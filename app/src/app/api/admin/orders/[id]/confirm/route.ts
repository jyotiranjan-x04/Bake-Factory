import { requireOwner } from "@/lib/admin-auth";
import { badRequest, notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  estimatedPrepMinutes: z.number().int().min(5).max(480),
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

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return notFound("Order not found");
  }

  const updated = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
    const nextOrder = await tx.order.update({
      where: { id },
      data: {
        status: "CONFIRMED",
        estimatedPrepMinutes: parsed.data.estimatedPrepMinutes,
        confirmedAt: new Date(),
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: id,
        type: "ORDER_CONFIRMED",
        payload: JSON.stringify({ estimatedPrepMinutes: parsed.data.estimatedPrepMinutes }),
        createdByOwnerId: auth.owner.id,
      },
    });

    return nextOrder;
  });

  const itemSummary = order.items.map((item: (typeof order.items)[number]) => `${item.productName} x${item.quantity}`).join(", ");
  await sendWhatsAppText(
    order.customerPhone,
    `✅ Bake Factory confirmed your order ${order.orderNumber}. Items: ${itemSummary}. Total: ₹${order.totalAmount}. Pickup in ~${parsed.data.estimatedPrepMinutes} mins.`,
  );

  return NextResponse.json({ order: updated });
}
