import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { startOfMonth, subMonths } from "date-fns"; // Utilizzo di date-fns per manipolare le date

export async function getLastThreeMonthsStats() {
  // Calcola la data di inizio del mese 3 mesi fa
  const threeMonthsAgo = subMonths(startOfMonth(new Date()), 3);

  // Esegui la query per ottenere le transazioni
  const stats = await prisma.transaction.findMany({
    where: {
      OR: [{ type: TransactionType.INCOME }, { type: TransactionType.EXPENSE }],
      date: {
        gte: threeMonthsAgo, // Data maggiore o uguale a tre mesi fa
      },
    },
    orderBy: {
      date: "asc", // Ordina per data crescente
    },
  });

  // Aggrega i dati per mese
  const monthsData: { [key: string]: { income: number; expenses: number } } =
    {};

  stats.forEach((transaction) => {
    // Formatta la data per ottenere il mese e l'anno (es. "Gen 2025")
    const monthYear = transaction.date.toLocaleString("it-IT", {
      month: "short",
      year: "numeric",
    });

    // Inizializza l'oggetto per il mese se non esiste
    if (!monthsData[monthYear]) {
      monthsData[monthYear] = { income: 0, expenses: 0 };
    }

    // Somma le entrate e le uscite per il mese specifico
    if (transaction.type === TransactionType.INCOME) {
      monthsData[monthYear].income += Number(transaction.amount);
    } else if (transaction.type === TransactionType.EXPENSE) {
      monthsData[monthYear].expenses += Number(transaction.amount);
    }
  });

  // Converte l'oggetto in un array con la struttura desiderata
  const formattedData = Object.entries(monthsData).map(([name, values]) => ({
    name,
    income: values.income,
    expenses: values.expenses,
  }));

  return formattedData;
}
