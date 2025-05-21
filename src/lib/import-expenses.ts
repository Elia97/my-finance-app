import { PrismaClient } from "@prisma/client";
import fs from "fs";
import Papa from "papaparse";

const prisma = new PrismaClient();

type RawTransaction = {
  amount: string;
  description: string;
  date: string;
  type: "EXPENSE" | "INCOME" | "TRANSFER";
  category: string;
  user: string;
  sourceAccount: string;
  destinationAccount: string;
};

async function parseCSV(path: string): Promise<RawTransaction[]> {
  const file = fs.readFileSync(path, "utf8");
  return new Promise((resolve, reject) => {
    Papa.parse<RawTransaction>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (err: Error) => reject(err),
    });
  });
}

async function buildLookupMaps() {
  const [categories, accounts, users] = await Promise.all([
    prisma.category.findMany(),
    prisma.account.findMany(),
    prisma.user.findMany(),
  ]);

  return {
    categoryMap: new Map(categories.map((c) => [c.name, c.id])),
    accountMap: new Map(accounts.map((a) => [a.name, a.id])),
    userMap: new Map(users.map((u) => [u.name, u.id])),
  };
}

async function main() {
  const rawTransactions = await parseCSV("./expenses.csv");
  const { categoryMap, accountMap, userMap } = await buildLookupMaps();

  const prepared = rawTransactions.map((r) => {
    const categoryId = r.category ? categoryMap.get(r.category) : null;
    const userId = userMap.get(r.user);
    const sourceAccountId = accountMap.get(r.sourceAccount);
    const destinationAccountId = r.destinationAccount
      ? accountMap.get(r.destinationAccount)
      : null;

    if (!userId) throw new Error(`❌ Utente non trovato: ${r.user}`);
    if (!sourceAccountId)
      throw new Error(`❌ Conto origine non trovato: ${r.sourceAccount}`);
    if (r.destinationAccount && !destinationAccountId)
      throw new Error(
        `❌ Conto destinazione non trovato: ${r.destinationAccount}`
      );
    if (r.category && !categoryId)
      throw new Error(`❌ Categoria non trovata: ${r.category}`);

    return {
      amount: parseFloat(r.amount),
      description: r.description,
      date: new Date(r.date),
      type: r.type,
      categoryId,
      userId,
      sourceAccountId,
      destinationAccountId,
    };
  });

  let successCount = 0;

  for (const entry of prepared) {
    try {
      await prisma.transaction.create({ data: entry });

      if (entry.type === "INCOME") {
        await prisma.account.update({
          where: { id: entry.sourceAccountId },
          data: { balance: { increment: entry.amount } },
        });
      } else if (entry.type === "EXPENSE") {
        await prisma.account.update({
          where: { id: entry.sourceAccountId },
          data: { balance: { decrement: entry.amount } },
        });
      } else if (entry.type === "TRANSFER") {
        await prisma.account.update({
          where: { id: entry.sourceAccountId },
          data: { balance: { decrement: entry.amount } },
        });
        await prisma.account.update({
          where: { id: entry.destinationAccountId! },
          data: { balance: { increment: entry.amount } },
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
