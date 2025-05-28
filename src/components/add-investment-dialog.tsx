"use client";

import { useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investmentSchema, type InvestmentFormData } from "@/types/schemas";
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
import { FieldErrors } from "react-hook-form";

interface AddInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInvestmentDialog({
  open,
  onOpenChange,
}: AddInvestmentDialogProps) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: "",
      type: "ETF",
      quantity: 0,
      purchasePrice: 0,
      currentPrice: 0,
      accountId: "",
      currency: "EUR",
      startDate: new Date().toISOString().split("T")[0], // Imposta la data di inizio al giorno corrente
    },
  });
  const investmentType = watch("type");

  const onSubmit = async (rawData: InvestmentFormData) => {
    const data: InvestmentFormData = {
      ...rawData,
      currentPrice: rawData.purchasePrice,
      type: investmentType,
    };

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore sconosciuto");
      }

      toast.success("Investimento creato", {
        description: "L'investimento è stato creato con successo",
      });

      startTransition(() => {
        router.refresh();
      });

      if (!isPending) {
        onOpenChange(false);
        reset();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Errore durante la creazione dell'investimento", {
        description: errorMessage,
      });
    }
  };

  const onError = (errors: FieldErrors<InvestmentFormData>) => {
    console.error("Errori di validazione Zod:", errors);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    };

    fetchAccounts();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-11/12 overflow-y-auto pr-2">
        <DialogHeader>
          <DialogTitle>Crea un nuovo conto</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del tuo nuovo conto. <br /> Puoi sempre
            modificarli in seguito.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-4 overflow-y-auto"
        >
          <RadioGroup
            value={investmentType}
            onValueChange={(val) =>
              setValue("type", val as InvestmentFormData["type"])
            }
            className="grid grid-cols-2 gap-4"
          >
            {["STOCK", "BOND", "ETF", "CRYPTO"].map((type) => (
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
                  <span>
                    {type === "STOCK"
                      ? "Azioni"
                      : type === "BOND"
                      ? "Obbligazioni"
                      : type === "ETF"
                      ? "ETF"
                      : "Criptovalute"}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantità</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="purchasePrice">Prezzo di acquisto</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              {...register("purchasePrice", { valueAsNumber: true })}
            />
            {errors.purchasePrice && (
              <p className="text-sm text-red-500">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="startDate">Data di inizio</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accountId">Conto</Label>
            <Select
              onValueChange={(val) =>
                setValue("accountId", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un conto" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter((acc) => acc.type === "INVESTMENT")
                  .map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-red-500">{errors.accountId.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">Valuta</Label>
            <Input
              id="currency"
              {...register("currency")}
              defaultValue="EUR"
              disabled
            />
            {errors.currency && (
              <p className="text-sm text-red-500">{errors.currency.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Salva Conto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
