"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddInvestmentTransactionDialog } from "@/components/add-investment-transaction-dialog";
import { AddInvestmentDialog } from "./add-investment-dialog";

export function InvestmentsHeader() {
  const [
    isAddInvestmentTransactionDialogOpen,
    setIsAddInvestmentTransactionDialogOpen,
  ] = useState(false);
  const [isAddInvestmentDialogOpen, setIsAddInvestmentDialogOpen] =
    useState(false);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
      <div className="flex items-center justify-center gap-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">Portafoglio Titoli</h1>
          <p className="text-muted-foreground">
            Gestione e monitoraggio dei tuoi investimenti
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 xl:mx-0">
        <Button
          size="sm"
          className="w-full md:w-auto"
          onClick={() => setIsAddInvestmentTransactionDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Nuova Transazione</span>
        </Button>
        <Button
          size="sm"
          className="w-full md:w-auto"
          onClick={() => setIsAddInvestmentDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Nuovo Asset</span>
        </Button>
        <AddInvestmentTransactionDialog
          open={isAddInvestmentTransactionDialogOpen}
          onOpenChange={setIsAddInvestmentTransactionDialogOpen}
        />
        <AddInvestmentDialog
          open={isAddInvestmentDialogOpen}
          onOpenChange={setIsAddInvestmentDialogOpen}
        />
      </div>
    </div>
  );
}
