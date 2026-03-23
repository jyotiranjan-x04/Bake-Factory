import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { badRequest, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid input");
    }

    const user = await prisma.owner.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user) {
      return unauthorized("Invalid credentials");
    }

    const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!isValid) {
      return unauthorized("Invalid credentials");
    }

    const token = await createSessionToken({
      ownerId: user.id,
      email: user.email,
    });

    const bakery = await prisma.bakeryProfile.findUnique({ where: { id: "main" } });

    const response = NextResponse.json({
      owner: { id: user.id, email: user.email, fullName: user.fullName },
      bakery,
    });

    setSessionCookie(response, token);
    return response;
  } catch {
    return serverError();
  }
}
