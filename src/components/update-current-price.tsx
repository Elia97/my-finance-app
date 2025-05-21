"use client";

import { useState } from "react";
import { UpdateCurrentPriceDialog } from "./update-current-price-dialog";
import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

export function UpdateCurrentPrice() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 mt-3">
      <Button onClick={() => setIsDialogOpen(true)}>
        <RefreshCcw className="h-4 w-4" />
        Aggiorna Prezzo Corrente
      </Button>
      <UpdateCurrentPriceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
