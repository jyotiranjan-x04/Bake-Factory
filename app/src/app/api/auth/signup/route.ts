import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { ownerSetupSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const ownerCount = await prisma.owner.count();
    if (ownerCount > 0) {
      return badRequest("Owner is already configured. Please use login.");
    }

    const body = await request.json();
    const parsed = ownerSetupSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid input");
    }

    const existingUser = await prisma.owner.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (existingUser) {
      return badRequest("Email already exists");
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const owner = await prisma.owner.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        fullName: parsed.data.fullName,
        phoneNumber: parsed.data.phoneNumber,
        passwordHash,
      },
    });

    await prisma.bakeryProfile.upsert({
      where: { id: "main" },
      update: {},
      create: {
        id: "main",
      },
    });

    const token = await createSessionToken({
      ownerId: owner.id,
      email: owner.email,
    });

    const response = NextResponse.json({
      owner: { id: owner.id, fullName: owner.fullName, email: owner.email },
      bakery: { id: "main", name: "Bake Factory" },
    });

    setSessionCookie(response, token);
    return response;
  } catch {
    return serverError();
  }
}
