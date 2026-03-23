import { requireOwner } from "@/lib/admin-auth";
import { notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const { id } = await context.params;

  const order = await prisma.order.findFirst({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    return notFound("Order not found");
  }

  const body = `Order confirmed by Bake Factory. Total ₹${order.totalAmount}. Status: ${order.status}.`;
  const result = await sendWhatsAppText(order.customerPhone, body);

  const log = await prisma.messageLog.create({
    data: {
      orderId: order.id,
      body,
      status: result.success ? "SENT" : "FAILED",
      providerMessageId: result.messageId,
      templateName: "order_confirmation",
    },
  });

  return NextResponse.json({ success: result.success, log });
}
