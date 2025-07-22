import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import { toast } from "sonner";
import { Transaction } from "@prisma/client";
import { useRouter } from "next/navigation";

export function DeleteTransactionDialog({
  transaction,
  isOpen,
  onClose,
}: {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Errore durante l'eliminazione della transazione");
      }
      toast.success("Transazione eliminata con successo");

      startTransition(() => {
        onClose();
        router.refresh();
      });
    } catch {
      toast.error("Errore durante l'eliminazione della transazione");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogTitle>Elimina Transazione</AlertDialogTitle>
        <AlertDialogDescription>
          Sei sicuro di voler eliminare questa transazione?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Eliminando..." : "Elimina"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
