import { badRequest, serverError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { subscribeSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid email");
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ status: "ok", message: "Already subscribed" });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: parsed.data.name,
        source: parsed.data.source || "footer",
      },
    });

    return NextResponse.json({ status: "ok", message: "Subscribed" });
  } catch {
    return serverError();
  }
}
