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
import { TransactionWithRelations } from "@/types/types";
import type { Transaction } from "@prisma/client";
import { useState } from "react";
import { UpdateTransactionDialog } from "./update-transaction-dialog";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";

interface TransactionsTableProps {
  transactions: TransactionWithRelations[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Nessuna transazione trovata</p>
      </div>
    );
  }
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
              <TableCell>{transaction.category?.name}</TableCell>
              <TableCell>{transaction.sourceAccount.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      transaction.type === "INCOME"
                        ? "bg-green-100"
                        : transaction.type === "EXPENSE"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    )}
                  >
                    {transaction.type === "INCOME" ? (
                      <ArrowUpRight
                        className={cn("h-4 w-4", "text-green-600")}
                      />
                    ) : transaction.type === "EXPENSE" ? (
                      <ArrowDownRight
                        className={cn("h-4 w-4", "text-red-600")}
                      />
                    ) : (
                      <RefreshCw className={cn("h-4 w-4", "text-blue-600")} />
                    )}
                  </div>
                  <Badge
                    variant="default"
                    className={
                      transaction.type === "INCOME"
                        ? "bg-green-100 text-green-700"
                        : transaction.type === "EXPENSE"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  >
                    {transaction.type === "INCOME"
                      ? "Entrata"
                      : transaction.type === "EXPENSE"
                      ? "Spesa"
                      : "Trasferimento"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium",
                  transaction.type === "INCOME"
                    ? "text-green-700"
                    : transaction.type === "EXPENSE"
                    ? "text-red-700"
                    : "text-blue-700"
                )}
              >
                {formatCurrency(Number(transaction.amount))}
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
                    <DropdownMenuItem
                      onClick={() => handleUpdateTransaction(transaction)}
                    >
                      Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteTransaction(transaction)}
                    >
                      Elimina
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isUpdateDialogOpen && selectedTransaction && (
        <UpdateTransactionDialog
          transaction={selectedTransaction}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
        />
      )}
      {isDeleteDialogOpen && selectedTransaction && (
        <DeleteTransactionDialog
          transaction={selectedTransaction}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}
