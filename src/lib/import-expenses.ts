import { PrismaClient } from "@prisma/client";
import fs from "fs";
import Papa from "papaparse";

const prisma = new PrismaClient();

type RawExpense = {
  amount: string;
  description: string;
  date: string;
  type: "EXPENSE" | "INCOME" | "TRANSFER";
  categoryId: string;
  userId: string;
  sourceAccountId: string;
  destinationAccountId: string;
};

async function parseCSV(path: string): Promise<RawExpense[]> {
  const file = fs.readFileSync(path, "utf8");
  return new Promise((resolve, reject) => {
    Papa.parse<RawExpense>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (err: Error) => reject(err),
    });
  });
}

async function main() {
  const rawExpenses = await parseCSV("./expenses.csv");

  const prepared = rawExpenses.map((r) => ({
    amount: parseFloat(r.amount),
    description: r.description,
    date: new Date(r.date),
    type: r.type,
    categoryId: r.categoryId || null,
    userId: r.userId,
    sourceAccountId: r.sourceAccountId,
    destinationAccountId: r.destinationAccountId || null,
  }));

  let successCount = 0;
  for (const entry of prepared) {
    try {
      await prisma.transaction.create({ data: entry });

      if (entry.type === "INCOME") {
        await prisma.account.update({
          where: { id: entry.sourceAccountId },
          data: {
            balance: {
              increment: entry.amount,
            },
          },
        });
      } else if (entry.type === "EXPENSE") {
        await prisma.account.update({
          where: { id: entry.sourceAccountId },
          data: {
            balance: {
              decrement: entry.amount,
            },
          },
        });
      } else {
        await prisma.account.update({
          where: { id: entry.sourceAccountId },
          data: {
            balance: {
              decrement: entry.amount,
            },
          },
        });
        await prisma.account.update({
          where: { id: entry?.destinationAccountId || undefined },
          data: {
            balance: {
              increment: entry.amount,
            },
          },
        });
      }

      successCount++;
    } catch (err) {
      console.error(`❌ Errore nella transazione:`, entry, err);
    }
  }

  console.log(
    `✅ Import completato: ${successCount} transazioni caricate e bilanci aggiornati.`
  );
}

main()
  .catch((err) => {
    console.error("❌ Errore durante l’import generale:", err);
  })
  .finally(() => prisma.$disconnect());
