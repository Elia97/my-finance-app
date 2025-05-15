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

  const statsMap = new Map<string, { income: number; expenses: number }>();

  for (const entry of income) {
    const key = new Date(entry.date).toISOString().slice(0, 7); // YYYY-MM
    statsMap.set(key, {
      income: Number(entry._sum.amount) ?? 0,
      expenses: 0,
    });
  }

  for (const entry of expenses) {
    const key = new Date(entry.date).toISOString().slice(0, 7); // YYYY-MM
    const existing = statsMap.get(key) || { income: 0, expenses: 0 };
    statsMap.set(key, {
      income: existing.income,
      expenses: Math.abs(Number(entry._sum.amount) ?? 0),
    });
  }

  const formatted = Array.from(statsMap.entries()).map(([key, values]) => {
    const [year, month] = key.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return {
      name: date.toLocaleString("it-IT", { month: "short", year: "numeric" }),
      income: values.income,
      expenses: values.expenses,
    };
  });

  return formatted;
}
