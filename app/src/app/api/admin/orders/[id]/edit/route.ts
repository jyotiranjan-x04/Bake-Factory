import { requireOwner } from "@/lib/admin-auth";
import { badRequest, notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  notes: z.string().optional(),
  customization: z.string().optional(),
  totalAmount: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid input");
  }

  const { id } = await context.params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return notFound("Order not found");
  }

  if (order.paymentStatus === "PAID" || order.isLocked) {
    return badRequest("Order edits are not allowed after payment");
  }

  const updated = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
    const nextOrder = await tx.order.update({
      where: { id },
      data: {
        notes: parsed.data.notes,
        customization: parsed.data.customization,
        totalAmount: parsed.data.totalAmount,
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: id,
        type: "ORDER_EDITED",
        payload: JSON.stringify(parsed.data),
        createdByOwnerId: auth.owner.id,
      },
    });

    return nextOrder;
  });

  return NextResponse.json({ order: updated });
}
