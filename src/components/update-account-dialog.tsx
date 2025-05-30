"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, type AccountFormData } from "@/types/schemas";
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

interface UpdateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
}

export function UpdateAccountDialog({
  open,
  onOpenChange,
  accountId,
}: UpdateAccountDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      balance: 0,
      type: "CHECKING",
      currency: "",
      number: "",
    },
  });
  const accountType = watch("type");

  const onSubmit = async (data: AccountFormData) => {
    try {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast.success("Conto modificato", {
        description: "Il conto è stato modificato con successo",
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
      toast.error("Errore durante la modifica del conto", {
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    async function fetchAccount(accountId: string) {
      try {
        const res = await fetch(`/api/accounts/${accountId}`);
        if (!res.ok) {
          throw new Error("Errore nel recupero del conto");
        }
        const accountData: AccountFormData = await res.json();
        reset(accountData);
      } catch (error) {
        toast.error("Errore durante il recupero del conto", {
          description: error instanceof Error ? error.message : String(error),
        });
      }
    }

    fetchAccount(accountId);
  }, [setValue, accountId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crea un nuovo conto</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del tuo nuovo conto. <br /> Puoi sempre
            modificarli in seguito.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RadioGroup
            value={accountType}
            onValueChange={(val) =>
              setValue("type", val as AccountFormData["type"])
            }
            className="grid grid-cols-2 gap-4"
          >
            {["CHECKING", "INVESTMENT"].map((type) => (
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
                    {type === "CHECKING" ? "Conto Corrente" : "Conto Titoli"}
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
            <Label htmlFor="number">Numero identificativo</Label>
            <Input id="number" {...register("number")} />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="balance">Bilancio</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              {...register("balance")}
            />
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Conto</Label>
            <Select
              value={watch("currency")}
              onValueChange={(val) => setValue("currency", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una valuta" />
              </SelectTrigger>
              <SelectContent>
                {["EUR", "USD", "CHF", "GBP"].map((val, index) => (
                  <SelectItem key={index} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Salva Conto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
