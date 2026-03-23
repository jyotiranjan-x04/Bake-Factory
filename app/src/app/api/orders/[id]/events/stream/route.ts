import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

function toSSE(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      const encoder = new TextEncoder();

      const pushCurrentOrder = async () => {
        if (isClosed) {
          return;
        }

        const order = await prisma.order.findFirst({
          where: {
            id,
          },
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            isLocked: true,
            updatedAt: true,
          },
        });

        controller.enqueue(encoder.encode(toSSE("order", order)));
      };

      controller.enqueue(encoder.encode(toSSE("connected", { orderId: id })));
      await pushCurrentOrder();

      const interval = setInterval(async () => {
        await pushCurrentOrder();
      }, 2500);

      setTimeout(() => {
        clearInterval(interval);
        if (!isClosed) {
          isClosed = true;
          controller.close();
        }
      }, 1000 * 60 * 10);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        if (!isClosed) {
          isClosed = true;
          controller.close();
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
