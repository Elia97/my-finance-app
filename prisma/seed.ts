import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const password = process.env.USER_PASSWORD;

if (!password) {
  throw new Error("USER_PASSWORD environment variable is not set.");
}

async function main() {
  await prisma.user.create({
    data: {
      name: "Elia",
      email: "elia.zarantonello97@gmail.com",
      password: await bcrypt.hash(password as string, 10),
    },
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
