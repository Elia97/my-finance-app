import { PrismaClient, TransactionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      name: "Utente di prova",
      email: "prova@example.com",
      password: hashedPassword,
    },
  });

  await prisma.userPreferences.create({
    data: {
      userId: user.id,
      balanceAlerts: true,
      budgetAlerts: true,
      marketingEmails: false,
    },
  });

  const [checking, investment] = await Promise.all([
    prisma.account.create({
      data: {
        name: "Conto Corrente",
        type: "CHECKING",
        userId: user.id,
        balance: 2000.0,
        number: "IT00X0000000000000000000000",
      },
    }),
    prisma.account.create({
      data: {
        name: "Conto Investimenti",
        type: "INVESTMENT",
        userId: user.id,
        balance: 5000.0,
        number: "DE00000000000000000000",
      },
    }),
  ]);

  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: "Alimentari", color: "#FF0000", userId: user.id },
      { name: "Trasporti", color: "#FF9900", userId: user.id },
      { name: "Casa", color: "#00CC66", userId: user.id },
      { name: "Salute", color: "#0099FF", userId: user.id },
      { name: "Intrattenimento", color: "#CC00FF", userId: user.id },
      { name: "Vestiti", color: "#6600CC", userId: user.id },
      { name: "Apprendimento", color: "#FFCC00", userId: user.id },
      { name: "Debito", color: "#333333", userId: user.id },
    ],
  });

  const findCategory = (name: string) =>
    categories.find((c) => c.name === name);

  const transactions = [
    {
      type: "INCOME",
      description: "Stipendio mensile",
      amount: 1800,
      date: "2025-05-01",
      category: null,
    },
    {
      type: "EXPENSE",
      description: "Spesa al supermercato",
      amount: 120,
      date: "2025-05-03",
      category: findCategory("Alimentari")?.id,
    },
    {
      type: "EXPENSE",
      description: "Abbonamento palestra",
      amount: 50,
      date: "2025-05-05",
      category: findCategory("Salute")?.id,
    },
    {
      type: "TRANSFER",
      description: "Spostamento su conto investimenti",
      amount: 500,
      date: "2025-05-10",
      category: null,
    },
    {
      type: "EXPENSE",
      description: "Cena fuori",
      amount: 60,
      date: "2025-05-12",
      category: findCategory("Intrattenimento")?.id,
    },
  ];

  for (const tx of transactions) {
    const { type, amount, date, description, category } = tx;

    const sourceAccountId = type === "INCOME" ? null : checking.id;
    const destinationAccountId =
      type === "TRANSFER" ? investment.id : checking.id;

    await prisma.transaction.create({
      data: {
        type: type as TransactionType,
        amount,
        date: new Date(date),
        description,
        categoryId: category ?? undefined,
        userId: user.id,
        sourceAccountId: sourceAccountId ?? checking.id,
        destinationAccountId: destinationAccountId,
      },
    });

    if (type === "INCOME") {
      await prisma.account.update({
        where: { id: checking.id },
        data: { balance: { increment: amount } },
      });
    } else if (type === "EXPENSE") {
      await prisma.account.update({
        where: { id: checking.id },
        data: { balance: { decrement: amount } },
      });
    } else if (type === "TRANSFER") {
      await prisma.$transaction([
        prisma.account.update({
          where: { id: checking.id },
          data: { balance: { decrement: 500 } },
        }),
        prisma.account.update({
          where: { id: investment.id },
          data: { balance: { increment: 500 } },
        }),
      ]);
    }
  }

  let investmentRecord = await prisma.investment.create({
    data: {
      name: "ETF Demo",
      type: "ETF",
      quantity: 50,
      averagePrice: 100,
      currentPrice: 105,
      accountId: investment.id,
      userId: user.id,
      startDate: new Date("2025-01-01"),
    },
  });

  const investmentTransactions = [
    { date: "2025-01-10", quantity: 5, price: 98 },
    { date: "2025-02-12", quantity: 10, price: 101 },
    { date: "2025-03-15", quantity: 8, price: 103 },
    { date: "2025-04-18", quantity: 12, price: 104 },
    { date: "2025-05-20", quantity: 15, price: 107 },
  ];

  for (const t of investmentTransactions) {
    const amount = t.quantity * t.price;

    await prisma.investmentTransaction.create({
      data: {
        date: new Date(t.date),
        quantity: t.quantity,
        price: t.price,
        amount,
        type: "BUY",
        investmentId: investmentRecord.id,
        userId: user.id,
      },
    });

    await prisma.account.update({
      where: { id: investment.id },
      data: { balance: { decrement: amount } },
    });

    const newQuantity = Number(investmentRecord.quantity) + t.quantity;
    const newAvgPrice =
      (Number(investmentRecord.quantity) *
        Number(investmentRecord.averagePrice) +
        t.quantity * t.price) /
      newQuantity;

    investmentRecord = await prisma.investment.update({
      where: { id: investmentRecord.id },
      data: {
        quantity: newQuantity,
        averagePrice: newAvgPrice,
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
