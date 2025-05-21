import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const investments = await prisma.investment.findMany();
  return NextResponse.json(investments);
}
