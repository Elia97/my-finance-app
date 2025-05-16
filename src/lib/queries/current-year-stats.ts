import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { startOfYear } from "date-fns";

export async function getCurrentYearStats() {
  const startOfCurrentYear = startOfYear(new Date());

  const stats = await prisma.transaction.findMany({
    where: {
      OR: [{ type: TransactionType.INCOME }, { type: TransactionType.EXPENSE }],
      date: {
        gte: startOfCurrentYear,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const monthsData: { [key: string]: { income: number; expenses: number } } =
    {};

  stats.forEach((transaction) => {
    const monthYear = transaction.date.toLocaleString("it-IT", {
      month: "short",
      year: "numeric",
    });

    if (!monthsData[monthYear]) {
      monthsData[monthYear] = { income: 0, expenses: 0 };
    }

    if (transaction.type === TransactionType.INCOME) {
      monthsData[monthYear].income += Number(transaction.amount);
    } else if (transaction.type === TransactionType.EXPENSE) {
      monthsData[monthYear].expenses += Number(transaction.amount);
    }
  });

  const formattedData = Object.entries(monthsData).map(([name, values]) => ({
    name,
    income: values.income,
    expenses: values.expenses,
  }));

  return formattedData;
}
