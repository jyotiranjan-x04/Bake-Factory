import { badRequest, notFound } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return badRequest("Phone number is required");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerPhone: phone,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return notFound("Order not found");
  }

  return NextResponse.json({ order });
}
