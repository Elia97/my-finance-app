import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const user = await prisma.user.create({
    data: {
      name: "Elia",
      email: "elia.zarantonello97@gmail.com",
      password: hashedPassword,
    },
  });

  const accounts = await prisma.account.createManyAndReturn({
    select: { id: true, balance: true, name: true },
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
        balance: 3028.6,
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

  const investmentAccount = accounts.find((a) => a.name === "Scalable Capital");
  if (!investmentAccount) throw new Error("Investment account not found");

  // Investimento iniziale (quantità storica pre-2025)
  let investment = await prisma.investment.create({
    data: {
      name: "SCWX",
      type: "ETF",
      quantity: 86,
      purchasePrice: 9.661,
      currentPrice: 9.5395349,
      accountId: investmentAccount.id,
      userId: user.id,
      startDate: new Date("2025-01-01"),
    },
  });

  const transactions = [
    { date: "2025-01-06", quantity: 10.282, price: 9.72 },
    { date: "2025-02-05", quantity: 10.141, price: 9.86 },
    { date: "2025-03-04", quantity: 10.573, price: 9.46 },
    { date: "2025-04-04", quantity: 12.062726, price: 8.29 },
    { date: "2025-05-05", quantity: 11.279043, price: 8.87 },
  ];

  for (const t of transactions) {
    const amount = t.quantity * t.price;

    await prisma.investmentTransaction.create({
      data: {
        date: new Date(t.date),
        quantity: t.quantity,
        price: t.price,
        amount: amount,
        type: "BUY",
        investmentId: investment.id,
        userId: user.id,
      },
    });

    // Aggiorna saldo conto
    await prisma.account.update({
      where: { id: investmentAccount.id },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Calcolo del nuovo prezzo medio ponderato
    const newQuantity = Number(investment.quantity) + t.quantity;
    const newAvgPrice =
      (Number(investment.quantity) * Number(investment.purchasePrice) +
        t.quantity * t.price) /
      newQuantity;

    // Aggiorna quantità e prezzo medio dell'investimento
    investment = await prisma.investment.update({
      where: { id: investment.id },
      data: {
        quantity: newQuantity,
        purchasePrice: newAvgPrice,
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
