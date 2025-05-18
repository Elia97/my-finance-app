import { prisma } from "@/lib/prisma";

export async function getMonthlyStats() {
  const income = await prisma.transaction.groupBy({
    by: ["date"],
    where: { type: "INCOME" },
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const expenses = await prisma.transaction.groupBy({
    by: ["date"],
    where: { type: "EXPENSE" },
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const transfers = await prisma.transaction.groupBy({
    by: ["date"],
    where: { type: "TRANSFER" },
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const statsMap = new Map<
    string,
    { income: number; expenses: number; transfers: number }
  >();

  const addToMap = (
    key: string,
    field: "income" | "expenses" | "transfers",
    value: number
  ) => {
    const existing = statsMap.get(key) || {
      income: 0,
      expenses: 0,
      transfers: 0,
    };
    existing[field] += value;
    statsMap.set(key, existing);
  };

  for (const entry of income) {
    const key = new Date(entry.date).toISOString().slice(0, 7); // YYYY-MM
    addToMap(key, "income", Number(entry._sum.amount) ?? 0);
  }

  for (const entry of expenses) {
    const key = new Date(entry.date).toISOString().slice(0, 7);
    addToMap(key, "expenses", Number(entry._sum.amount) ?? 0);
  }

  for (const entry of transfers) {
    const key = new Date(entry.date).toISOString().slice(0, 7);
    addToMap(key, "transfers", Number(entry._sum.amount) ?? 0);
  }

  const formatted = Array.from(statsMap.entries()).map(([key, values]) => {
    const [year, month] = key.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return {
      name: date.toLocaleString("it-IT", { month: "short", year: "numeric" }),
      income: values.income,
      expenses: values.expenses,
      transfers: values.transfers,
    };
  });

  return formatted;
}
