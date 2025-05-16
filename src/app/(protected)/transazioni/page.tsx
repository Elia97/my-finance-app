import { TransactionsHeader } from "@/components/transactions-header";
import { TransactionsTable } from "@/components/transactions-table";
import { TransactionFilters } from "@/components/transaction-filters";
import { prisma } from "@/lib/prisma";
import { serializeDecimals } from "@/lib/serialize-decimals";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      date: "desc", // Ordina dalla più recente alla più vecchia
    },
    include: {
      sourceAccount: true,
      user: true,
      category: true,
    },
  });

  const safeTransactions = serializeDecimals(transactions);

  return (
    <div className="flex flex-col gap-6">
      <TransactionsHeader />
      <TransactionFilters />
      <TransactionsTable transactions={safeTransactions} />
    </div>
  );
}
