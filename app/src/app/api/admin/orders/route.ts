import { requireOwner } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ orders });
}
