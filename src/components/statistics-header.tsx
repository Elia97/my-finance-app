import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

export function StatisticsHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold">Statistiche</h1>
        <p className="text-muted-foreground">
          Analisi dettagliata delle tue finanze
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4" />
          Periodo
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4" />
          Esporta
        </Button>
      </div>
    </div>
  );
}
