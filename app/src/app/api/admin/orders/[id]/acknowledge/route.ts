import { requireOwner } from "@/lib/admin-auth";
import { notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const { id } = await context.params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return notFound("Order not found");
  }

  const updated = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
    const nextOrder = await tx.order.update({
      where: { id },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date(),
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: id,
        type: "ORDER_ACKNOWLEDGED",
        createdByOwnerId: auth.owner.id,
      },
    });

    return nextOrder;
  });

  return NextResponse.json({ order: updated });
}
