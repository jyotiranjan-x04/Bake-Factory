import { isBakeryAcceptingOrders } from "@/lib/availability";
import { badRequest, serverError } from "@/lib/http";
import { generateOrderNumber } from "@/lib/order";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const isOpen = await isBakeryAcceptingOrders();
    if (!isOpen) {
      return badRequest("Sorry, we are currently not accepting orders");
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid input");
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: parsed.data.items.map((item) => item.productId) },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    if (products.length !== parsed.data.items.length) {
      return badRequest("Some selected products are unavailable");
    }

    const byId = new Map<string, (typeof products)[number]>(
      products.map((product: (typeof products)[number]) => [product.id, product]),
    );
    const lineItems = parsed.data.items.map((item) => {
      const product = byId.get(item.productId)!;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
      };
    });

    const totalAmount = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const order = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderItem: typeof prisma.orderItem; orderEvent: typeof prisma.orderEvent }) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          type: "STANDARD",
          customerName: parsed.data.customerName,
          customerPhone: parsed.data.customerPhone,
          customerEmail: parsed.data.customerEmail,
          customerAddress: parsed.data.customerAddress,
          notes: parsed.data.notes,
          customization: parsed.data.customization,
          totalAmount,
        },
      });

      await tx.orderItem.createMany({
        data: lineItems.map((item) => ({
          orderId: created.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      });

      await tx.orderEvent.create({
        data: {
          orderId: created.id,
          type: "ORDER_RECEIVED",
          payload: JSON.stringify({ totalAmount }),
        },
      });

      return created;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
    });
  } catch {
    return serverError();
  }
}
