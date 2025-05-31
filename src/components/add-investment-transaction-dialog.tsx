"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  investmentTransactionSchema,
  type InvestmentTransactionFormData,
} from "@/types/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Investment } from "@/types/types";

interface AddInvestmentTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInvestmentTransactionDialog({
  open,
  onOpenChange,
}: AddInvestmentTransactionDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InvestmentTransactionFormData>({
    resolver: zodResolver(investmentTransactionSchema),
    defaultValues: {
      quantity: 0,
      purchasePrice: 0,
      date: new Date().toISOString().split("T")[0],
      investmentId: "",
      transactionType: "BUY",
    },
  });
  const transactionType = watch("transactionType");

  const onSubmit = async (data: InvestmentTransactionFormData) => {
    try {
      const res = await fetch("/api/investment-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast.success("Transazione aggiunta", {
        description: "La transazione è stata aggiunta con successo",
      });

      startTransition(() => {
        router.refresh();
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore sconosciuto");
      }
      if (!isPending) {
        onOpenChange(false);
        reset();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Errore durante l'invio della transazione", {
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      const res = await fetch("/api/investments");
      const data = await res.json();
      setInvestments(data);
    };

    fetchInvestments();
  }, []);

  if (investments.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Transazione</DialogTitle>
            <DialogDescription>
              Non hai ancora investimenti. Crea un investimento prima di
              aggiungere una transazione.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Transazione</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli della nuova transazione
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RadioGroup
            value={transactionType}
            onValueChange={(val) =>
              setValue(
                "transactionType",
                val as InvestmentTransactionFormData["transactionType"]
              )
            }
            className="grid grid-cols-2 gap-4"
          >
            {["BUY", "SELL"].map((type) => (
              <div key={type}>
                <RadioGroupItem
                  value={type}
                  id={type}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={type}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <span>{type === "BUY" ? "Compra" : "Vendi"}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantità</Label>
            <Input
              id="quantity"
              type="number"
              step="0.00000001"
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="purchasePrice">Prezzo (€)</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.00000001"
              {...register("purchasePrice")}
            />
            {errors.purchasePrice && (
              <p className="text-sm text-red-500">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("date")} />
          </div>

          <div className="grid gap-2">
            <Label>Investimento</Label>
            <Select onValueChange={(val) => setValue("investmentId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un conto" />
              </SelectTrigger>
              <SelectContent>
                {investments.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.investmentId && (
              <p className="text-sm text-red-500">
                {errors.investmentId.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Salva Transazione</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
