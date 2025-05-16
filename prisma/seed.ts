import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const hashedPassword = await bcrypt.hash("password", 10);
  const user = await prisma.user.create({
    data: {
      name: "Elia",
      email: "elia.zarantonello97@gmail.com",
      password: hashedPassword,
    },
  });

  // Create accounts
  await prisma.account.createManyAndReturn({
    select: { id: true, balance: true },
    data: [
      {
        name: "IsyBank",
        type: "CHECKING",
        userId: user.id,
        balance: 1272.06,
        number: "IT02J0338501601100080961954",
      },
      {
        name: "Scalable Capital",
        type: "INVESTMENT",
        userId: user.id,
        balance: 3849.0,
        number: "DE16120700700751437258",
      },
    ],
  });

  // Create categories
  await prisma.category.createManyAndReturn({
    select: { id: true },
    data: [
      {
        name: "Alimentari",
        userId: user.id,
      },
      {
        name: "Apprendimento",
        userId: user.id,
      },
      {
        name: "Casa",
        userId: user.id,
      },
      {
        name: "Vestiti",
        userId: user.id,
      },
      {
        name: "Intrattenimento",
        userId: user.id,
      },
      {
        name: "Debito",
        userId: user.id,
      },
      {
        name: "Salute",
        userId: user.id,
      },
      {
        name: "Trasporti",
        userId: user.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
