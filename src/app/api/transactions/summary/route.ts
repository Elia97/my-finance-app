import { NextResponse } from "next/server";
import { getTransactionSummary } from "@/lib/queries/transaction-summary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1-12

  if (!year || !month) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const summary = await getTransactionSummary(userId, year, month);
  return NextResponse.json(summary);
}
