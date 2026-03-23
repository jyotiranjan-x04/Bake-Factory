"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = ["CONFIRMED", "BAKING", "READY"];

type OrderState = {
  status: string;
  paymentStatus: string;
};

export default function TrackOrderPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !phone) {
      return;
    }

    const load = async () => {
      const response = await fetch(`/api/public/orders/${orderId}?phone=${encodeURIComponent(phone)}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Order not found");
        return;
      }
      setOrder(data.order);
      setError(null);
    };

    void load();
    const source = new EventSource(`/api/orders/${orderId}/events/stream`);
    source.addEventListener("order", (event) => {
      const payload = JSON.parse(event.data) as OrderState | null;
      if (payload) {
        setOrder(payload);
      }
    });

    return () => source.close();
  }, [orderId, phone]);

  const activeIndex = STEPS.indexOf(order?.status || "CONFIRMED");

  return (
    <main className="pb-10">
      <SiteHeader />
      <section className="section-wrap clay-card p-6">
        <h1 className="text-3xl font-bold">Track Order Status</h1>
        <p className="mt-2 text-sm text-[#5f4a3a]">Order ID: {orderId}</p>

        <div className="mt-4">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter order phone number"
            className="clay-input w-full px-4 py-3"
          />
        </div>

        {error ? <p className="feedback-error mt-3 text-sm">{error}</p> : null}

        <div className="mt-6 space-y-3">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`clay-inset px-4 py-3 ${index <= activeIndex ? "status-chip-strong" : "opacity-70"}`}
            >
              {step}
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
