import { requireOwner } from "@/lib/admin-auth";
import { badRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid input");
  }

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json({ category }, { status: 201 });
}
