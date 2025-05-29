import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const accountId = url.pathname.split("/").pop();

  if (!accountId) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }
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

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const accountId = url.pathname.split("/").pop();

  if (!accountId) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }
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

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const accountId = url.pathname.split("/").pop();

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
