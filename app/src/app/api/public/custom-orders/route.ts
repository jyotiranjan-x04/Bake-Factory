import { isBakeryAcceptingOrders } from "@/lib/availability";
import { badRequest, serverError } from "@/lib/http";
import { generateOrderNumber } from "@/lib/order";
import { prisma } from "@/lib/prisma";
import { saveImageFile } from "@/lib/upload";
import { createCustomOrderSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const isOpen = await isBakeryAcceptingOrders();
    if (!isOpen) {
      return badRequest("Sorry, we are currently not accepting orders");
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return badRequest("Custom design image is required");
    }

    const parsed = createCustomOrderSchema.safeParse({
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail") || undefined,
      description: formData.get("description"),
      budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
    });

    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid input");
    }

    const imageUrl = await saveImageFile(image, "custom-orders");

    const order = await prisma.$transaction(async (tx: { order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          type: "CUSTOM",
          customerName: parsed.data.customerName,
          customerPhone: parsed.data.customerPhone,
          customerEmail: parsed.data.customerEmail,
          customization: parsed.data.description,
          customImageUrl: imageUrl,
          customPriceQuote: parsed.data.budget,
          totalAmount: parsed.data.budget || 0,
          status: "RECEIVED",
          paymentStatus: "UNPAID",
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: created.id,
          type: "CUSTOM_ORDER_REQUESTED",
          payload: JSON.stringify({ imageUrl }),
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
