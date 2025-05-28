import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
