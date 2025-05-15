// app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await prisma.user.findFirst();
  return NextResponse.json(user);
}
