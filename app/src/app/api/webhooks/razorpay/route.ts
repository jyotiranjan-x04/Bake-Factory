import { prisma } from "@/lib/prisma";
import { verifyHmacSha256Signature } from "@/lib/webhook-signature";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        status?: string;
        order_id?: string;
      };
    };
    payment_link?: {
      entity?: {
        id?: string;
      };
    };
  };
};

const razorpayWebhookSchema = z.object({
  event: z.string().optional(),
  payload: z
    .object({
      payment: z
        .object({
          entity: z
            .object({
              id: z.string().optional(),
              status: z.string().optional(),
              order_id: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      payment_link: z
        .object({
          entity: z
            .object({
              id: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signatureHeader = request.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (process.env.NODE_ENV === "production" && !webhookSecret) {
    return NextResponse.json({ error: "Razorpay webhook secret is not configured" }, { status: 500 });
  }

  if (webhookSecret) {
    const isValid = verifyHmacSha256Signature({
      payload,
      signatureHeader,
      secret: webhookSecret,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  }

  const parsed = razorpayWebhookSchema.safeParse(JSON.parse(payload));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const body = parsed.data as RazorpayWebhookPayload;

  const eventId =
    body.payload?.payment?.entity?.id ||
    body.payload?.payment_link?.entity?.id ||
    body.event ||
    `evt-${Date.now()}`;

  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "razorpay",
        providerEventId: String(eventId),
        payload: JSON.stringify(body),
      },
    });
  } catch {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const status = body.payload?.payment?.entity?.status;
  const providerOrderId =
    body.payload?.payment_link?.entity?.id ||
    body.payload?.payment?.entity?.order_id;

  if (status === "captured" || body.event === "payment_link.paid") {
    const payment = await prisma.payment.findFirst({
      where: {
        provider: "razorpay",
        providerPaymentId: String(providerOrderId),
      },
      include: {
        order: true,
      },
    });

    if (payment) {
      await prisma.$transaction(async (tx: { payment: typeof prisma.payment; order: typeof prisma.order; orderEvent: typeof prisma.orderEvent }) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: "PAID",
            isLocked: true,
            lockReason: "payment_success",
          },
        });

        await tx.orderEvent.create({
          data: {
            orderId: payment.orderId,
            type: "PAYMENT_SUCCESS",
            payload: JSON.stringify({ webhookEvent: body.event }),
          },
        });
      });
    }
  }

  return NextResponse.json({ ok: true });
}
