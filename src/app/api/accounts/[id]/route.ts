import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const accountId = params.id;

  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        user: true,
      },
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
  { params }: { params: { id: string } }
) {
  const accountId = params.id;
  const data = await request.json();

  try {
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data,
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
  { params }: { params: { id: string } }
) {
  const accountId = params.id;

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
