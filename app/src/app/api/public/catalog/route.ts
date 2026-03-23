import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get("category");

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: {
      category: true,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ categories, products });
}
