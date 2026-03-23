import { getSessionFromRequest } from "@/lib/auth";
import { unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function requireOwner(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return { error: unauthorized() };
  }

  const owner = await prisma.owner.findUnique({ where: { id: session.ownerId } });
  if (!owner) {
    return { error: unauthorized() };
  }

  return { owner };
}
