"use client";

import { useState, useMemo } from "react";
import { TransactionsHeader } from "@/components/transactions-header";
import { TransactionsTable } from "@/components/transactions-table";
import { TransactionFilters } from "@/components/transaction-filters";
import { TransactionType } from "@prisma/client";
import { TransactionWithRelations } from "@/lib/types";

interface TransactionsClientProps {
  transactions: TransactionWithRelations[];
}

export function TransactionsClient({ transactions }: TransactionsClientProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionType | "all">("all");
  const [accountId, setAccountId] = useState<string | "all">("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        search === "" ||
        tx.description?.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "all" || tx.type === type;
      const matchesAccount =
        accountId === "all" || tx.sourceAccountId === accountId;

      return matchesSearch && matchesType && matchesAccount;
    });
  }, [transactions, search, type, accountId]);

  return (
    <div className="flex flex-col gap-6">
      <TransactionsHeader />
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        accountId={accountId}
        setAccountId={setAccountId}
      />
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
}
