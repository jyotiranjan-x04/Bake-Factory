import { requireOwner } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if (auth.error) {
    return auth.error;
  }

  const [orderCount, paidOrders, popularProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { totalAmount: true } }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const revenue = paidOrders.reduce((sum: number, order: { totalAmount: number }) => sum + order.totalAmount, 0);

  return NextResponse.json({
    totalOrders: orderCount,
    totalRevenue: revenue,
    popularProducts,
  });
}
