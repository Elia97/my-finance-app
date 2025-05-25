import { prisma } from "../prisma";
import { TransactionType } from "@prisma/client";

export async function getTransactionSummary(userId: string) {
  // Get the current month
  const currentMonth = new Date().getMonth() + 1;

  // Get transactions for the current month
  const [income, expenses, transfers] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: TransactionType.INCOME,
        date: {
          gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
          lte: new Date(new Date().getFullYear(), currentMonth, 0),
        },
        userId: userId, // Ensure to filter by userId
      },
    }),
    prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: TransactionType.EXPENSE,
        date: {
          gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
          lte: new Date(new Date().getFullYear(), currentMonth, 0),
        },
        userId: userId, // Ensure to filter by userId
      },
    }),
    prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: TransactionType.TRANSFER,
        date: {
          gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
          lte: new Date(new Date().getFullYear(), currentMonth, 0),
        },
        userId: userId, // Ensure to filter by userId
      },
    }),
  ]);

  return {
    income: income._sum.amount || 0,
    expenses: expenses._sum.amount || 0,
    transfers: transfers._sum.amount || 0,
  };
}
