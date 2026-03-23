import { isBakeryAcceptingOrders } from "@/lib/availability";
import { NextResponse } from "next/server";

export async function GET() {
  const isOpen = await isBakeryAcceptingOrders();
  return NextResponse.json({
    isOpen,
    message: isOpen ? "Open for orders" : "Sorry, we are currently not accepting orders",
  });
}
