import { prisma } from "@/lib/prisma";
import { serializeDecimals } from "@/lib/serialize-decimals";
import { TransactionsClient } from "@/components/transactions-client";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: {
      sourceAccount: true,
      user: true,
      category: true,
    },
  });

  const safeTransactions = serializeDecimals(transactions);

  return <TransactionsClient transactions={safeTransactions} />;
}
