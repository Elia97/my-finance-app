"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  accountId,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante l'eliminazione");
      }

      toast.success("Conto eliminato", {
        description: "Il conto è stato rimosso con successo",
      });

      startTransition(() => {
        router.refresh();
      });

      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Errore durante l'eliminazione del conto", {
        description: errorMessage,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Elimina conto</DialogTitle>
          <DialogDescription>
            Sei sicuro di voler eliminare questo conto? Questa azione non può
            essere annullata.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Elimina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
