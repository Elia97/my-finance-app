import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { subMonths, differenceInMonths } from "date-fns";

export async function getExpensesByMonth() {
  const twelveMonthsAgo = subMonths(new Date(), 12);

  const expenses = await prisma.transaction.findMany({
    where: {
      type: TransactionType.EXPENSE,
      date: {
        gte: twelveMonthsAgo,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Inizializza struttura con 12 mesi precedenti
  const now = new Date();
  const result: { month: string; expenses: number }[] = [];

  for (let i = 0; i < 12; i++) {
    const date = subMonths(now, 11 - i); // Mantieni ordine cronologico
    const label = date.toLocaleString("it-IT", { month: "short" });
    result.push({ month: label, expenses: 0 });
  }

  expenses.forEach((tx) => {
    const diff = differenceInMonths(now, tx.date);
    const index = 11 - diff;

    if (index >= 0 && index < 12) {
      result[index].expenses += Number(tx.amount);
    }
  });

  return result;
}
