import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = session.user.id;

  if (!id) {
    return new Response("User ID not found", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
      categories: true,
      transactions: true,
      preferences: true,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return Response.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = session.user.id;

  if (!id) {
    return new Response("User ID not found", { status: 400 });
  }

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
