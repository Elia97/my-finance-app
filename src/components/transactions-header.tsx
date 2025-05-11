import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function TransactionsHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Transazioni</h1>
        <p className="text-muted-foreground">
          Gestisci e visualizza tutte le tue transazioni
        </p>
      </div>
      <Button className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Nuova Transazione
      </Button>
    </div>
  );
}
