import { requireOwner } from "@/lib/admin-auth";
import { badRequest } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  content: z.string().min(2),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const [bakery, contentBlocks] = await Promise.all([
    prisma.bakeryProfile.findUnique({ where: { id: "main" } }),
    prisma.contentBlock.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({ bakery, contentBlocks });
}

export async function POST(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid input");
  }

  const block = await prisma.contentBlock.upsert({
    where: { key: parsed.data.key },
    create: parsed.data,
    update: parsed.data,
  });

  return NextResponse.json({ block });
}
