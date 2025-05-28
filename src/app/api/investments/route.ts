import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const investments = await prisma.investment.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      transactions: {
        orderBy: {
          date: "asc",
        },
      },
      account: true,
    },
  });
  return NextResponse.json(investments);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const data = await request.json();
  const {
    name,
    type,
    quantity,
    purchasePrice,
    currentPrice,
    accountId,
    currency,
    startDate,
  } = data;

  try {
    const investment = await prisma.investment.create({
      data: {
        name,
        type,
        quantity,
        averagePrice: purchasePrice,
        currentPrice,
        userId,
        accountId,
        currency,
        startDate: new Date(startDate),
      },
    });

    // Update the account balance if the investment is created
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          decrement: purchasePrice * quantity,
        },
      },
    });

    return NextResponse.json(investment);
  } catch {
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
