"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
}: AddTransactionDialogProps) {
  const [transactionType, setTransactionType] = useState("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Transazione aggiunta", {
      description: "La transazione è stata aggiunta con successo",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Transazione</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli della nuova transazione
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <RadioGroup
              defaultValue="expense"
              className="grid grid-cols-3 gap-4"
              onValueChange={setTransactionType}
            >
              <div>
                <RadioGroupItem
                  value="expense"
                  id="expense"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="expense"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Spesa</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="income"
                  id="income"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="income"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Entrata</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="transfer"
                  id="transfer"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="transfer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Trasferimento</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrizione</Label>
              <Input id="description" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Importo (€)</Label>
              <Input id="amount" type="number" step="0.01" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account">Conto</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un conto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Conto Corrente</SelectItem>
                  <SelectItem value="2">Conto Titoli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {transactionType === "transfer" && (
              <div className="grid gap-2">
                <Label htmlFor="destination">Conto Destinazione</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un conto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Conto Corrente</SelectItem>
                    <SelectItem value="2">Conto Titoli</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {transactionType !== "transfer" && (
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionType === "expense" ? (
                      <>
                        <SelectItem value="food">Alimentari</SelectItem>
                        <SelectItem value="transport">Trasporti</SelectItem>
                        <SelectItem value="utilities">Bollette</SelectItem>
                        <SelectItem value="entertainment">Svago</SelectItem>
                        <SelectItem value="health">Salute</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="salary">Stipendio</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="investments">
                          Investimenti
                        </SelectItem>
                        <SelectItem value="gifts">Regali</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
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
