import { requireOwner } from "@/lib/admin-auth";
import { badRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2),
  phoneNumber: z.string().min(10),
});

export async function PATCH(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid input");
  }

  const owner = await prisma.owner.update({
    where: { id: auth.owner.id },
    data: parsed.data,
  });

  return NextResponse.json({ owner });
}
