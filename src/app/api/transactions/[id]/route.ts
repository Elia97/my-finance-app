import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Funzione per eliminare una transazione esistente.
 * @param request - La richiesta contenente l'ID della transazione da eliminare.
 * @param context - Il contesto contenente i parametri dinamici della route.
 * @returns Una risposta JSON con conferma dell'eliminazione o un errore.
 * @throws Errore se la sessione non è valida o se si verifica un errore durante l'eliminazione della transazione.
 * @description Questa funzione gestisce l'eliminazione di una transazione, annullando il suo effetto sui saldi dei conti coinvolti.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: transactionId } = await params;

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    // Prima recuperiamo la transazione da eliminare per annullare il suo effetto
    const transactionToDelete = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transactionToDelete) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Verifichiamo che la transazione appartenga all'utente corrente
    if (transactionToDelete.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own transactions" },
        { status: 403 }
      );
    }

    // Annulliamo l'effetto della transazione sui saldi degli account
    if (transactionToDelete.type === "INCOME") {
      await prisma.account.update({
        where: { id: transactionToDelete.sourceAccountId },
        data: {
          balance: {
            decrement: transactionToDelete.amount,
          },
        },
      });
    } else if (transactionToDelete.type === "EXPENSE") {
      await prisma.account.update({
        where: { id: transactionToDelete.sourceAccountId },
        data: {
          balance: {
            increment: transactionToDelete.amount,
          },
        },
      });
    } else {
      // TRANSFER
      await prisma.account.update({
        where: { id: transactionToDelete.sourceAccountId },
        data: {
          balance: {
            increment: transactionToDelete.amount,
          },
        },
      });
      if (transactionToDelete.destinationAccountId) {
        await prisma.account.update({
          where: { id: transactionToDelete.destinationAccountId },
          data: {
            balance: {
              decrement: transactionToDelete.amount,
            },
          },
        });
      }
    }

    // Eliminiamo la transazione
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json({
      message: "Transaction deleted successfully",
      deletedTransaction: transactionToDelete,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error deleting transaction", message: errorMessage },
      { status: 500 }
    );
  }
}
