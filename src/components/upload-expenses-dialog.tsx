"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloudIcon } from "lucide-react";

interface UploadExpensesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadExpensesDialog({
  open,
  onOpenChange,
}: UploadExpensesDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { status: userStatus } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setStatus({ type: "info", message: "Caricamento in corso..." });
      const res = await fetch("api/import-expenses", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore sconosciuto");
      }

      toast.success("Transazioni aggiunte", {
        description: "Le transazioni sono state aggiunte con successo",
      });

      startTransition(() => {
        router.refresh();
      });

      if (!isPending) {
        onOpenChange(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Errore durante il caricamento delle transazioni", {
        description: errorMessage,
      });
    }
  };

  if (userStatus === "loading") {
    return null; // oppure spinner
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importa transazioni da CSV</DialogTitle>
          <DialogDescription>
            Importa le transazioni caricando un file csv.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="cursor-pointer"
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !file}
              className="cursor-pointer"
            >
              <UploadCloudIcon className="w-4 h-4 mr-2" />
              {loading ? "Caricamento..." : "Carica CSV"}
            </Button>
          </DialogFooter>
          {status && (
            <Alert
              variant={status.type === "error" ? "destructive" : "default"}
            >
              <AlertTitle>
                {status.type === "error" ? "Errore" : "Stato"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
