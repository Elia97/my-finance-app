// app/api/import-csv/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
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

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileContent = buffer.toString("utf8");

  const parsed = Papa.parse<RawTransaction>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const rawTransactions = parsed.data;

  try {
    const { categoryMap, accountMap, userMap } = await buildLookupMaps();

    const prepared = rawTransactions.map((r) => {
      const categoryId = r.category ? categoryMap.get(r.category) : null;
      const userId = userMap.get(r.user);
      const sourceAccountId = accountMap.get(r.sourceAccount);
      const destinationAccountId = r.destinationAccount
        ? accountMap.get(r.destinationAccount)
        : null;

      if (!userId) throw new Error(`Utente non trovato: ${r.user}`);
      if (!sourceAccountId)
        throw new Error(`Conto origine non trovato: ${r.sourceAccount}`);
      if (r.destinationAccount && !destinationAccountId)
        throw new Error(
          `Conto destinazione non trovato: ${r.destinationAccount}`
        );
      if (r.category && !categoryId)
        throw new Error(`Categoria non trovata: ${r.category}`);

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
    }

    return NextResponse.json({
      message: "Import completato",
      count: successCount,
    });
  } catch (err: unknown) {
    console.error("Errore durante import:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Errore sconosciuto";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
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
