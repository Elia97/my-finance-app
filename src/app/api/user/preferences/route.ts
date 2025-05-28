import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();

  try {
    const updatedPreferences = await prisma.userPreferences.update({
      where: { userId },
      data: body,
    });

    return Response.json(updatedPreferences);
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
