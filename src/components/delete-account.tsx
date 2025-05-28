"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function DeleteAccount({ accountId }: { accountId: string }) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  return (
    <>
      <Button
        variant={"destructive"}
        size="sm"
        className="flex-1"
        onClick={() => setIsOpenDialog(true)}
      >
        Elimina
      </Button>
      <DeleteAccountDialog
        open={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        accountId={accountId}
      ></DeleteAccountDialog>
    </>
  );
}
