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
        color: "#FF0000",
      },
      {
        name: "Apprendimento",
        userId: user.id,
        color: "#FFA500",
      },
      {
        name: "Casa",
        userId: user.id,
        color: "#FFFF00",
      },
      {
        name: "Vestiti",
        userId: user.id,
        color: "#008000",
      },
      {
        name: "Intrattenimento",
        userId: user.id,
        color: "#00FFFF",
      },
      {
        name: "Debito",
        userId: user.id,
        color: "#0000FF",
      },
      {
        name: "Salute",
        userId: user.id,
        color: "#FFC0CB",
      },
      {
        name: "Trasporti",
        userId: user.id,
        color: "#FF00FF",
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
