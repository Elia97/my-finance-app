"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dati di esempio
const transactions = [
  {
    id: 1,
    description: "Stipendio",
    amount: 1800,
    date: new Date("2023-05-01"),
    type: "income",
    account: "Conto Corrente",
    category: "Stipendio",
  },
  {
    id: 2,
    description: "Supermercato",
    amount: -85.45,
    date: new Date("2023-05-03"),
    type: "expense",
    account: "Conto Corrente",
    category: "Alimentari",
  },
  {
    id: 3,
    description: "Trasferimento a Conto Titoli",
    amount: -500,
    date: new Date("2023-05-05"),
    type: "transfer",
    account: "Conto Corrente",
    category: "Trasferimento",
  },
  {
    id: 4,
    description: "Trasferimento da Conto Corrente",
    amount: 500,
    date: new Date("2023-05-05"),
    type: "transfer",
    account: "Conto Titoli",
    category: "Trasferimento",
  },
  {
    id: 5,
    description: "Bolletta Luce",
    amount: -75.3,
    date: new Date("2023-05-10"),
    type: "expense",
    account: "Conto Corrente",
    category: "Bollette",
  },
  {
    id: 6,
    description: "Abbonamento Palestra",
    amount: -45,
    date: new Date("2023-05-15"),
    type: "expense",
    account: "Conto Corrente",
    category: "Salute",
  },
  {
    id: 7,
    description: "Dividendi",
    amount: 25.75,
    date: new Date("2023-05-20"),
    type: "income",
    account: "Conto Titoli",
    category: "Investimenti",
  },
];

export function TransactionsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Conto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Importo</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.account}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      transaction.type === "income"
                        ? "bg-green-100"
                        : transaction.type === "expense"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight
                        className={cn("h-4 w-4", "text-green-600")}
                      />
                    ) : transaction.type === "expense" ? (
                      <ArrowDownRight
                        className={cn("h-4 w-4", "text-red-600")}
                      />
                    ) : (
                      <RefreshCw className={cn("h-4 w-4", "text-blue-600")} />
                    )}
                  </div>
                  <Badge
                    variant={
                      transaction.type === "income"
                        ? "outline"
                        : transaction.type === "expense"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {transaction.type === "income"
                      ? "Entrata"
                      : transaction.type === "expense"
                      ? "Spesa"
                      : "Trasferimento"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium",
                  transaction.amount > 0
                    ? "text-green-600"
                    : transaction.type === "transfer"
                    ? "text-blue-600"
                    : "text-red-600"
                )}
              >
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Modifica</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Elimina
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
