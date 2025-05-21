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
import { Category } from "@/types/types";
import { TransactionType } from "@prisma/client";

interface TransactionFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  type: TransactionType | "all";
  setType: React.Dispatch<React.SetStateAction<TransactionType | "all">>;
  categoryId: string;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
}

export function TransactionFilters({
  search,
  setSearch,
  type,
  setType,
  categoryId,
  setCategoryId,
}: TransactionFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const transactionTypes = Object.values(TransactionType);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
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
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Conto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
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
