import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;
  const body = await request.json();
  const { price } = body;

  if (!price) {
    return NextResponse.json({ error: "Price is required" }, { status: 400 });
  }

  const investment = await prisma.investment.update({
    where: {
      id: id,
    },
    data: {
      currentPrice: price,
    },
  });

  return NextResponse.json(investment);
}
