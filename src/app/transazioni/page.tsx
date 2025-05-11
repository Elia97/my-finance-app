import { TransactionsHeader } from "@/components/transactions-header";
import { TransactionsTable } from "@/components/transactions-table";
import { TransactionFilters } from "@/components/transaction-filters";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <TransactionsHeader />
      <TransactionFilters />
      <TransactionsTable />
    </div>
  );
}
