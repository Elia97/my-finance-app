"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  type TransactionFormData,
} from "@/types/transaction";
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

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Category = { id: string; name: string };
type Account = { id: string; name: string };

export function AddTransactionDialog({
  open,
  onOpenChange,
}: AddTransactionDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      sourceAccountId: "",
      destinationAccountId: "",
      categoryId: "",
      transactionType: "EXPENSE",
      userId: "2ad3d12d-de4b-411a-b003-fd0fafe746ef",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;
  const transactionType = watch("transactionType");

  const onSubmit = async (data: TransactionFormData) => {
    if (transactionType === "TRANSFER") {
      delete data.categoryId;
    } else if (transactionType === "INCOME") {
      delete data.destinationAccountId;
      delete data.categoryId;
    } else {
      delete data.destinationAccountId;
    }
    try {
      const res = await fetch("/api/transactions", {
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
    const fetchAccounts = async () => {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    };
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchAccounts();
    fetchCategories();
  }, []);

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
                val as TransactionFormData["transactionType"]
              )
            }
            className="grid grid-cols-3 gap-4"
          >
            {["INCOME", "EXPENSE", "TRANSFER"].map((type) => (
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
                    {type === "EXPENSE"
                      ? "Spesa"
                      : type === "INCOME"
                      ? "Entrata"
                      : "Trasferimento"}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrizione</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Importo (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("date")} />
          </div>

          <div className="grid gap-2">
            <Label>Conto</Label>
            <Select onValueChange={(val) => setValue("sourceAccountId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un conto" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sourceAccountId && (
              <p className="text-sm text-red-500">
                {errors.sourceAccountId.message}
              </p>
            )}
          </div>

          {transactionType === "EXPENSE" ? (
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select onValueChange={(val) => setValue("categoryId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : transactionType === "TRANSFER" ? (
            <div className="grid gap-2">
              <Label>Conto Destinazione</Label>
              <Select
                onValueChange={(val) => setValue("destinationAccountId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un conto" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid gap-2 invisible">
              <Label>Categoria</Label>
              <Select onValueChange={(val) => setValue("categoryId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="submit">Salva Transazione</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
