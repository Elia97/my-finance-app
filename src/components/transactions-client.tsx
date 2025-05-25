"use client";

import { useState, useMemo } from "react";
import { TransactionsHeader } from "@/components/transactions-header";
import { TransactionsTable } from "@/components/transactions-table";
import { TransactionFilters } from "@/components/transaction-filters";
import { TransactionType } from "@prisma/client";
import { TransactionWithRelations } from "@/types/types";

interface TransactionsClientProps {
  transactions: TransactionWithRelations[];
}

export function TransactionsClient({ transactions }: TransactionsClientProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionType | "all">("all");
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        search === "" ||
        tx.description?.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "all" || tx.type === type;
      const matchesCategory =
        categoryId === "all" || tx.categoryId === categoryId;
      const matchesDate =
        (!dateFilter.startDate || new Date(tx.date) >= dateFilter.startDate) &&
        (!dateFilter.endDate || new Date(tx.date) <= dateFilter.endDate);

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }, [transactions, search, type, categoryId, dateFilter]);

  return (
    <div className="flex flex-col gap-6">
      <TransactionsHeader />
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
}
