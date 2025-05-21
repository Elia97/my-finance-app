"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePriceSchema, type UpdatePriceFormData } from "@/types/schemas";
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
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Investment } from "@/types/types";

interface UpdateCurrentPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateCurrentPriceDialog({
  open,
  onOpenChange,
}: UpdateCurrentPriceDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdatePriceFormData>({
    resolver: zodResolver(updatePriceSchema),
    defaultValues: {
      price: undefined,
      investmentId: "",
    },
  });

  const onSubmit = async (data: UpdatePriceFormData) => {
    try {
      const res = await fetch(`/api/investments/${data.investmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast.success("Prezzo aggiornato", {
        description: "Il prezzo è stato aggiornato con successo",
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
      toast.error("Errore durante l'aggiornamento del prezzo", {
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

  if (status === "loading") {
    return null; // oppure spinner
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiorna prezzo corrente</DialogTitle>
          <DialogDescription>
            Aggiorna il prezzo corrente di un investimento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Prezzo</Label>
            <Input
              id="price"
              type="number"
              step="0.00001"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Investimento</Label>
            <Select onValueChange={(val) => setValue("investmentId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un investimento" />
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
            <Button type="submit">Aggiorna prezzo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
