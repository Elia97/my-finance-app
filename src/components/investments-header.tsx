"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Calendar } from "lucide-react";
import { AddInvestmentTransactionDialog } from "@/components/add-investment-transaction-dialog";

export function InvestmentsHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold">Portafoglio Titoli</h1>
          <p className="text-muted-foreground">
            Gestione e monitoraggio dei tuoi investimenti
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Periodo</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Esporta</span>
        </Button>
        <Button
          size="sm"
          className="gap-1"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Nuova Transazione</span>
        </Button>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Nuovo Asset</span>
        </Button>
        <AddInvestmentTransactionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        ></AddInvestmentTransactionDialog>
      </div>
    </div>
  );
}
