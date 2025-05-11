import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function AccountsHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Conti</h1>
        <p className="text-muted-foreground">
          Gestisci i tuoi conti finanziari
        </p>
      </div>
      <Button className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Nuovo Conto
      </Button>
    </div>
  );
}
