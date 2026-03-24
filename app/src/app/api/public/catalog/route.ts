import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function isConnectionIssue(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }
  return /Can't reach database server|PrismaClientInitializationError/i.test(error.message);
}

async function fetchCatalog(categorySlug: string | null) {
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

  return { categories, products };
}

export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get("category");
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { categories, products } = await fetchCatalog(categorySlug);
      return NextResponse.json({ categories, products });
    } catch (error) {
      if (!isConnectionIssue(error) || attempt === maxAttempts) {
        return NextResponse.json(
          {
            error: "Database connection failed",
            detail: error instanceof Error ? error.message : "Unknown database error",
            attempt,
          },
          { status: 503 },
        );
      }
      await wait(400 * attempt);
    }
  }

  return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
}
