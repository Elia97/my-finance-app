import { prisma } from "../prisma";
import { TransactionType } from "@prisma/client";

export async function getTransactionSummary(
  userId: string,
  year: number,
  month: number
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59); // fine mese

  const [income, expenses, transfers] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: TransactionType.INCOME,
        date: { gte: startDate, lte: endDate },
        userId,
      },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: TransactionType.EXPENSE,
        date: { gte: startDate, lte: endDate },
        userId,
      },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: TransactionType.TRANSFER,
        date: { gte: startDate, lte: endDate },
        userId,
      },
    }),
  ]);

  return {
    income: income._sum.amount || 0,
    expenses: expenses._sum.amount || 0,
    transfers: transfers._sum.amount || 0,
  };
}
