"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UploadExpensesDialog } from "./upload-expenses-dialog";
import { AddTransactionDialog } from "./add-transaction-dialog";

export function TransactionsHeader() {
  const [uploadExpensesDialogOpen, setUploadExpensesDialogOpen] =
    useState(false);
  const [addTransactionDialogOpen, setAddTransactionDialogOpen] =
    useState(false);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Transazioni</h1>
        <p className="text-muted-foreground">
          Gestisci e visualizza tutte le tue transazioni
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          className="gap-2"
          onClick={() => setUploadExpensesDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Importa transazioni
        </Button>
        <Button
          className="gap-2"
          onClick={() => setAddTransactionDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Nuova Transazione
        </Button>
      </div>
      <UploadExpensesDialog
        open={uploadExpensesDialogOpen}
        onOpenChange={setUploadExpensesDialogOpen}
      />
      <AddTransactionDialog
        open={addTransactionDialogOpen}
        onOpenChange={setAddTransactionDialogOpen}
      />
    </div>
  );
}
