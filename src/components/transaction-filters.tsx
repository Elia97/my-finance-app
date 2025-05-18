"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Account } from "@/lib/types";
import { TransactionType } from "@prisma/client";

interface TransactionFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  type: TransactionType | "all";
  setType: React.Dispatch<React.SetStateAction<TransactionType | "all">>;
  accountId: string;
  setAccountId: React.Dispatch<React.SetStateAction<string>>;
}

export function TransactionFilters({
  search,
  setSearch,
  type,
  setType,
  accountId,
  setAccountId,
}: TransactionFiltersProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const transactionTypes = Object.values(TransactionType);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    };

    fetchAccounts();
  }, []);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca transazioni..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Select
          value={type}
          onValueChange={(value) => setType(value as TransactionType | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            {transactionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "EXPENSE"
                  ? "Spesa"
                  : type === "INCOME"
                  ? "Entrata"
                  : "Trasferimento"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Conto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Altri Filtri
        </Button>
      </div>
    </div>
  );
}
