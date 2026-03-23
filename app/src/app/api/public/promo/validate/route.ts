import { badRequest, serverError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { promoValidateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

type PromoRow = {
  code: string;
  description: string | null;
  discountPercent: number;
  minSubtotal: number;
  isActive: boolean;
  startsAt: Date;
  expiresAt: Date | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = promoValidateSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid promo code");
    }

    const code = parsed.data.code.trim().toUpperCase();
    const result = await prisma.$queryRaw<PromoRow[]>`
      SELECT code, description, "discountPercent", "minSubtotal", "isActive", "startsAt", "expiresAt"
      FROM "PromoCode"
      WHERE code = ${code}
      LIMIT 1;
    `;
    const promo = result[0];

    if (!promo || !promo.isActive) {
      return badRequest("Promo code is not valid");
    }

    const now = new Date();
    if (promo.startsAt && promo.startsAt > now) {
      return badRequest("Promo code is not active yet");
    }
    if (promo.expiresAt && promo.expiresAt < now) {
      return badRequest("Promo code has expired");
    }
    if (parsed.data.subtotal < promo.minSubtotal) {
      return badRequest(`Minimum order is ₹${promo.minSubtotal}`);
    }

    const discountAmount = Math.round(parsed.data.subtotal * (promo.discountPercent / 100));

    return NextResponse.json({
      status: "ok",
      code: promo.code,
      discountPercent: promo.discountPercent,
      discountAmount,
      description: promo.description,
    });
  } catch {
    return serverError();
  }
}
