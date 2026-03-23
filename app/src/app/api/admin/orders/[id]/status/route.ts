import { requireOwner } from "@/lib/admin-auth";
import { badRequest, notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["BAKING", "READY", "COMPLETED", "CANCELLED", "CONFIRMED", "ACKNOWLEDGED"]),
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

  const updated = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
    const nextOrder = await tx.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    await tx.orderEvent.create({
      data: {
        orderId: id,
        type: `ORDER_${parsed.data.status}`,
        createdByOwnerId: auth.owner.id,
      },
    });

    return nextOrder;
  });

  if (parsed.data.status === "READY") {
    await sendWhatsAppText(order.customerPhone, "Your cake is ready 🎂 Please come and collect");
  }

  return NextResponse.json({ order: updated });
}
