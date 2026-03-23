import { requireOwner } from "@/lib/admin-auth";
import { badRequest, notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { createRazorpayPaymentLink } from "@/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const { orderId } = await context.params;

  const order = await prisma.order.findFirst({
    where: { id: orderId },
  });

  if (!order) {
    return notFound("Order not found");
  }

  if (order.paymentStatus === "PAID") {
    return badRequest("Order is already paid");
  }

  const paymentLink = await createRazorpayPaymentLink({
    amount: order.totalAmount,
    description: `Advance payment for order ${order.id}`,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "razorpay",
      providerPaymentId: paymentLink.id,
      amount: order.totalAmount,
      status: "PENDING",
      paymentLink: paymentLink.short_url,
    },
  });

  return NextResponse.json({
    paymentId: payment.id,
    providerPaymentId: payment.providerPaymentId,
    paymentLink: payment.paymentLink,
  });
}
