import { prisma } from "@/lib/prisma";
import { verifyHmacSha256Signature } from "@/lib/webhook-signature";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

type WhatsAppWebhookPayload = {
  entry?: Array<{ id?: string }>;
};

const whatsAppWebhookSchema = z.object({
  entry: z.array(z.object({ id: z.string().optional() })).optional(),
});

export async function GET(request: NextRequest) {
  const verifyToken = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (verifyToken && verifyToken === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signatureHeader = request.headers.get("x-hub-signature-256");
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (process.env.NODE_ENV === "production" && !appSecret) {
    return NextResponse.json({ error: "WhatsApp app secret is not configured" }, { status: 500 });
  }

  if (appSecret) {
    const isValid = verifyHmacSha256Signature({
      payload,
      signatureHeader,
      secret: appSecret,
      headerPrefix: "sha256",
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  }

  const parsed = whatsAppWebhookSchema.safeParse(JSON.parse(payload));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const body = parsed.data as WhatsAppWebhookPayload;
  const eventId = body.entry?.[0]?.id || `wa-${Date.now()}`;

  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "whatsapp",
        providerEventId: String(eventId),
        payload: JSON.stringify(body),
      },
    });
  } catch {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  return NextResponse.json({ ok: true });
}
