"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpdateAccountDialog } from "./update-account-dialog";

export function UpdateAccount({ accountId }: { accountId: string }) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={() => setIsOpenDialog(true)}
      >
        Modifica
      </Button>
      <UpdateAccountDialog
        open={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        accountId={accountId}
      ></UpdateAccountDialog>
    </>
  );
}
