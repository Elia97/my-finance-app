import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Funzione per inserire una nuova transazione.
 * @param request - La richiesta contenente i dati della transazione.
 * @returns Una risposta JSON con i dettagli della transazione creata o un errore.
 * @throws Errore se la sessione non è valida o se si verifica un errore durante la creazione della transazione.
 * @description Questa funzione gestisce la creazione di una nuova transazione, aggiornando i saldi dei conti coinvolti.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const body = await request.json();
  const {
    description,
    amount,
    date,
    sourceAccountId,
    destinationAccountId,
    categoryId,
    transactionType,
  } = body;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        date: new Date(date),
        sourceAccountId,
        destinationAccountId,
        categoryId,
        type: transactionType,
        userId,
      },
    });
    if (transactionType === "INCOME") {
      await prisma.account.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    } else if (transactionType === "EXPENSE") {
      await prisma.account.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } else {
      await prisma.account.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      await prisma.account.update({
        where: { id: destinationAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }
    return NextResponse.json(transaction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error creating transaction", message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Funzioner per modificare una transazione esistente.
 * @param request - La richiesta contenente i dati della transazione da modificare.
 * @returns Una risposta JSON con i dettagli della transazione modificata o un errore.
 * @throws Errore se la sessione non è valida o se si verifica un errore durante la modifica della transazione.
 * @description Questa funzione gestisce la modifica di una transazione esistente, aggiornando i saldi dei conti coinvolti.
 *
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const body = await request.json();
  const {
    id,
    description,
    amount,
    date,
    sourceAccountId,
    destinationAccountId,
    categoryId,
    transactionType,
  } = body;

  try {
    // Prima recuperiamo la transazione originale per annullare il suo effetto
    const originalTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!originalTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Annulliamo l'effetto della transazione originale sui saldi
    if (originalTransaction.type === "INCOME") {
      await prisma.account.update({
        where: { id: originalTransaction.sourceAccountId },
        data: {
          balance: {
            decrement: originalTransaction.amount,
          },
        },
      });
    } else if (originalTransaction.type === "EXPENSE") {
      await prisma.account.update({
        where: { id: originalTransaction.sourceAccountId },
        data: {
          balance: {
            increment: originalTransaction.amount,
          },
        },
      });
    } else {
      // TRANSFER
      await prisma.account.update({
        where: { id: originalTransaction.sourceAccountId },
        data: {
          balance: {
            increment: originalTransaction.amount,
          },
        },
      });
      if (originalTransaction.destinationAccountId) {
        await prisma.account.update({
          where: { id: originalTransaction.destinationAccountId },
          data: {
            balance: {
              decrement: originalTransaction.amount,
            },
          },
        });
      }
    }

    // Aggiorniamo la transazione con i nuovi dati
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount,
        date: new Date(date),
        sourceAccountId,
        destinationAccountId,
        categoryId,
        type: transactionType,
        userId,
      },
    });

    // Applichiamo l'effetto della transazione modificata sui saldi
    if (transactionType === "INCOME") {
      await prisma.account.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    } else if (transactionType === "EXPENSE") {
      await prisma.account.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } else {
      // TRANSFER
      await prisma.account.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      await prisma.account.update({
        where: { id: destinationAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }
    return NextResponse.json(transaction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error updating transaction", message: errorMessage },
      { status: 500 }
    );
  }
}
