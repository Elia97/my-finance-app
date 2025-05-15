"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";

export function DashboardHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
      <div className="flex items-center gap-2 justify-center text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Panoramica delle tue finanze personali
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-center">
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nuova Transazione
        </Button>
      </div>
      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
