import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    quantity,
    purchasePrice,
    date,
    investmentId,
    transactionType,
    userId,
  } = body;

  try {
    // Step 1: Recupera l'investimento e ottieni l'accountId
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      select: { accountId: true },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Step 2: Crea la transazione
    const transaction = await prisma.investmentTransaction.create({
      data: {
        quantity,
        price: purchasePrice,
        amount: purchasePrice * quantity,
        date: new Date(date),
        investmentId,
        type: transactionType,
        userId,
      },
    });

    // Step 3: Aggiorna il bilancio dell'account
    const balanceUpdate = purchasePrice * quantity;
    if (transactionType === "BUY") {
      await prisma.account.update({
        where: { id: investment.accountId },
        data: {
          balance: {
            decrement: balanceUpdate,
          },
        },
      });

      await prisma.investment.update({
        where: { id: investmentId },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      await prisma.account.update({
        where: { id: investment.accountId },
        data: {
          balance: {
            increment: balanceUpdate,
          },
        },
      });

      await prisma.investment.update({
        where: { id: investmentId },
        data: {
          quantity: {
            decrement: quantity,
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
