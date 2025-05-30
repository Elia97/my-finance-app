import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accountId = params.id;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  if (!accountId) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accountId = params.id;
  if (!accountId) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  const body = await request.json();

  const { name, balance, type, currency, number } = body;

  try {
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        name,
        balance,
        type,
        currency,
        number,
      },
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accountId = params.id;

  if (!accountId) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  try {
    await prisma.account.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
