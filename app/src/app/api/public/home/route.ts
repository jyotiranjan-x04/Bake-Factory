import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [bakery, contentBlocks] = await Promise.all([
    prisma.bakeryProfile.findUnique({ where: { id: "main" } }),
    prisma.contentBlock.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({ bakery, contentBlocks });
}
