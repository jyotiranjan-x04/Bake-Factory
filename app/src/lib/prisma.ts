import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isDevelopment = process.env.NODE_ENV === "development";

const isIgnorableDevPrismaError = (message: string) => {
  return [
    "Error in PostgreSQL connection: Error { kind: Closed, cause: None }",
    "Can't reach database server at",
    "code: 'P1001'",
  ].some((snippet) => message.includes(snippet));
};

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment
      ? [
          { emit: "event", level: "warn" },
          { emit: "event", level: "error" },
        ]
      : ["error"],
  });

if (isDevelopment) {
  // @ts-expect-error - Prisma client types don't inherently export the string event literal unless explicitly inferred
  prismaClient.$on("warn", (event: { message: string }) => {
    console.warn(`prisma:warn ${event.message}`);
  });

  // @ts-expect-error - Prisma client types don't inherently export the string event literal unless explicitly inferred
  prismaClient.$on("error", (event: { message: string }) => {
    if (isIgnorableDevPrismaError(event.message)) {
      return;
    }

    console.error(`prisma:error ${event.message}`);
  });
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
