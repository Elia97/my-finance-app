import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function getAccountStats() {
  const [totalBalance, totalIncome, totalExpenses, totalTransfers] =
    await Promise.all([
      prisma.account.aggregate({
        _sum: {
          balance: true,
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: TransactionType.INCOME,
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: TransactionType.EXPENSE,
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: TransactionType.TRANSFER,
        },
      }),
    ]);

  return {
    totalBalance: totalBalance._sum.balance || 0,
    totalIncome: totalIncome._sum.amount || 0,
    totalExpenses: totalExpenses._sum.amount || 0,
    totalTransfers: totalTransfers._sum.amount || 0,
  };
}
