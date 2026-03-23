import { notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return notFound("Product not found");
  }

  return NextResponse.json({ product });
}
