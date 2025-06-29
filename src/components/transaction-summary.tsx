"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface Summary {
  income: number;
  expenses: number;
  transfers: number;
}

export default function TransactionSummary() {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = mese corrente, -1 mese scorso, ecc.
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(1); // forza sempre il primo giorno del mese
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset]);

  const currentMonthLabel = targetDate.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await fetch(`/api/transactions/summary?year=${targetDate.getFullYear()}&month=${targetDate.getMonth() + 1}`);
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Errore nel caricamento del riepilogo:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [targetDate]);

  return (
    <Card className="col-span-2 lg:col-span-1 justify-between">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Riepilogo Mensile</CardTitle>
        <div className="flex items-center">
          <CardDescription>{currentMonthLabel}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Caricamento...</div>
        ) : summary && (summary.income || summary.expenses || summary.transfers) ? (
          <div className="space-y-6 ">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entrate</span>
              <span className="font-medium text-green-600">{formatCurrency(summary.income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uscite</span>
              <span className="font-medium text-red-600">{formatCurrency(summary.expenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trasferimenti</span>
              <span className="font-medium text-blue-600">{formatCurrency(summary.transfers)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Bilancio</span>
                <span className={(summary.income - summary.expenses) >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(summary.income - summary.expenses)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Nessuna transazione trovata</div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-3">
        <span className="text-sm text-muted-foreground">Visualizza riepilogo per mese</span>
        <div className="flex items-center justify-between w-full">
          <TooltipProvider>
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronLeft
                    onClick={() => setMonthOffset(offset => offset - 1)}
                    className="cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Precedente</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronRight
                    onClick={() => setMonthOffset(offset => offset + 1)}
                    className="cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Successivo</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
