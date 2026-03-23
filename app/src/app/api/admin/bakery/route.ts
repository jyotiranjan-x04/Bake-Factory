import { requireOwner } from "@/lib/admin-auth";
import { badRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { bakeryProfileSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const bakery = await prisma.bakeryProfile.findUnique({ where: { id: "main" } });
  return NextResponse.json({ bakery });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = bakeryProfileSchema.safeParse(body);

  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid input");
  }

  const bakery = await prisma.bakeryProfile.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      ...parsed.data,
    },
    update: parsed.data,
  });

  return NextResponse.json({ bakery });
}
