import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, color } = body;

  if (!name || !color) {
    return NextResponse.json(
      { error: "Name and color are required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
      color,
      userId: session.user.id,
    },
  });

  return NextResponse.json(category);
}
