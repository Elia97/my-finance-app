import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const password = process.env.USER_PASSWORD;

if (!password) {
  throw new Error("USER_PASSWORD environment variable is not set.");
}

async function main() {
  // Controlla se l'utente esiste già
  let user = await prisma.user.findUnique({
    where: {
      email: "elia.zarantonello97@gmail.com",
    },
  });

  // Se non esiste, crealo
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Elia",
        email: "elia.zarantonello97@gmail.com",
        password: await bcrypt.hash(password as string, 10),
      },
    });
  }

  // Controlla se esiste già un account per questo utente
  let account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      name: "Default Account",
    },
  });

  // Se non esiste, crealo
  if (!account) {
    account = await prisma.account.create({
      data: {
        userId: user.id,
        name: "Default Account",
        type: "CHECKING",
        balance: 0,
      },
    });
  }

  // Creazione delle categorie
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Health",
  ];

  // Crea o trova tutte le categorie e salva i loro ID
  const categoryRecords = await Promise.all(
    categories.map(async (cat) => {
      // Assumes you have a unique constraint on (name, userId). If not, use findFirst + create.
      // Since there is no unique constraint on (name, userId), use findFirst + create
      let category = await prisma.category.findFirst({
        where: {
          name: cat,
          userId: user.id,
        },
      });
      if (!category) {
        category = await prisma.category.create({
          data: { name: cat, user: { connect: { id: user.id } } },
        });
      }
      return category;
    })
  );

  // Cancella le transazioni esistenti per questo utente
  await prisma.transaction.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Creazione di molte transazioni
  for (let i = 0; i < 100; i++) {
    const randomCategory =
      categoryRecords[Math.floor(Math.random() * categoryRecords.length)];
    await prisma.transaction.create({
      data: {
        userId: user.id,
        sourceAccountId: account.id,
        amount: Math.floor(Math.random() * 100) + 1,
        type: "EXPENSE",
        description: `Transazione ${i + 1}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Data casuale negli ultimi 100 giorni
        categoryId: randomCategory.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
