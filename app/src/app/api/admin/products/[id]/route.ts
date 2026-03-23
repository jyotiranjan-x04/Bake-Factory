import { requireOwner } from "@/lib/admin-auth";
import { badRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid input");
  }

  const { id } = await context.params;

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ product });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
