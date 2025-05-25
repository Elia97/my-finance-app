import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
      categories: true,
      transactions: true,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return Response.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const user = await prisma.user.update({
    where: { id },
    data: body,
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return Response.json(user);
}
