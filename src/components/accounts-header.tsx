"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddAccountDialog } from "@/components/add-account-dialog";

export function AccountsHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold">Conti</h1>
        <p className="text-muted-foreground">
          Gestisci i tuoi conti finanziari
        </p>
      </div>
      <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="h-4 w-4" />
        Nuovo Conto
      </Button>
      <AddAccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
