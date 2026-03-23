import { getSessionFromRequest } from "@/lib/auth";
import { unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return unauthorized();
  }

  const bakery = await prisma.bakeryProfile.findUnique({ where: { id: "main" } });
  const owner = await prisma.owner.findUnique({ where: { id: session.ownerId } });

  if (!bakery || !owner) {
    return unauthorized();
  }

  return NextResponse.json({
    owner: {
      id: owner.id,
      fullName: owner.fullName,
      email: owner.email,
      phoneNumber: owner.phoneNumber,
    },
    bakery,
  });
}
