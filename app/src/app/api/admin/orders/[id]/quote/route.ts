import { requireOwner } from "@/lib/admin-auth";
import { badRequest, notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  customPriceQuote: z.number().int().positive(),
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

  if (order.type !== "CUSTOM") {
    return badRequest("Only custom orders can be quoted");
  }

  const updated = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
    const nextOrder = await tx.order.update({
      where: { id },
      data: {
        customPriceQuote: parsed.data.customPriceQuote,
        totalAmount: parsed.data.customPriceQuote,
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: id,
        type: "CUSTOM_QUOTE_SET",
        payload: JSON.stringify({ customPriceQuote: parsed.data.customPriceQuote }),
        createdByOwnerId: auth.owner.id,
      },
    });

    return nextOrder;
  });

  await sendWhatsAppText(
    order.customerPhone,
    `Bake Factory set your custom cake quote at ₹${parsed.data.customPriceQuote}. Reply to confirm and proceed with payment.`,
  );

  return NextResponse.json({ order: updated });
}
