"use client";

import { SlideAcknowledge } from "@/components/SlideAcknowledge";
import { StatusPill } from "@/components/StatusPill";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  type: "STANDARD" | "CUSTOM";
  customization?: string | null;
  customImageUrl?: string | null;
  customPriceQuote?: number | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ContentBlock = {
  id: string;
  key: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  sortOrder: number;
};

type BakeryProfile = {
  name: string;
  tagline: string;
  description?: string | null;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  locationAddress?: string | null;
  mapsEmbedUrl?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroImageUrl?: string | null;
  bannerImageUrl?: string | null;
};

function beep() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = 860;
  gainNode.gain.value = 0.03;
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    void audioContext.close();
  }, 240);
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"orders" | "products" | "content" | "analytics">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [bakeryProfile, setBakeryProfile] = useState<BakeryProfile | null>(null);
  const [analytics, setAnalytics] = useState<{
    totalOrders: number;
    totalRevenue: number;
    popularProducts: { productName: string; _sum: { quantity: number | null } }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    const response = await fetch("/api/admin/orders");
    const data = await response.json();
    if (response.ok) {
      setOrders(data.orders);
    }
  };

  const loadProducts = async () => {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);

    const productsData = await productsResponse.json();
    const categoriesData = await categoriesResponse.json();

    if (productsResponse.ok) {
      setProducts(productsData.products);
    }
    if (categoriesResponse.ok) {
      setCategories(categoriesData.categories);
    }
  };

  const loadContent = async () => {
    const response = await fetch("/api/admin/content");
    const data = await response.json();
    if (response.ok) {
      setContentBlocks(data.contentBlocks);
      setBakeryProfile(data.bakery);
    }
  };

  const loadAnalytics = async () => {
    const response = await fetch("/api/admin/analytics");
    const data = await response.json();
    if (response.ok) {
      setAnalytics(data);
    }
  };

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      void (async () => {
        setError(null);
        try {
          await Promise.all([loadOrders(), loadProducts(), loadContent(), loadAnalytics()]);
        } catch {
          setError("Failed to load admin dashboard data");
        }
      })();
    }, 0);

    const interval = setInterval(() => {
      void loadOrders();
      void loadAnalytics();
    }, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const pendingOrders = useMemo(() => orders.filter((order) => order.status === "RECEIVED"), [orders]);
  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  useEffect(() => {
    if (pendingOrders.length === 0) {
      return;
    }

    const interval = setInterval(beep, 900);
    return () => clearInterval(interval);
  }, [pendingOrders.length]);

  const acknowledgeOrder = async (orderId: string) => {
    await fetch(`/api/admin/orders/${orderId}/acknowledge`, { method: "POST" });
    await loadOrders();
  };

  const confirmOrder = async (orderId: string) => {
    const estimatedPrepMinutes = Number(prompt("Estimated prep time in minutes", "45") || 45);
    await fetch(`/api/admin/orders/${orderId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estimatedPrepMinutes }),
    });
    await loadOrders();
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadOrders();
  };

  const sendPaymentLink = async (orderId: string) => {
    const response = await fetch(`/api/payments/${orderId}/create-link`, { method: "POST" });
    const data = await response.json();
    if (response.ok) {
      alert(`Payment link generated: ${data.paymentLink}`);
    }
  };

  const setCustomQuote = async (orderId: string) => {
    const customPriceQuote = Number(prompt("Set custom cake price", "2500") || 0);
    if (!customPriceQuote) {
      return;
    }

    await fetch(`/api/admin/orders/${orderId}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customPriceQuote }),
    });

    await loadOrders();
  };

  const createCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        sortOrder: Number(formData.get("sortOrder") || 0),
      }),
    });

    event.currentTarget.reset();
    await loadProducts();
  };

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        imageUrl: formData.get("imageUrl") || undefined,
        categoryId: formData.get("categoryId") || null,
        isFeatured: formData.get("isFeatured") === "on",
        isActive: true,
      }),
    });

    event.currentTarget.reset();
    await loadProducts();
  };

  const updateContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: formData.get("key"),
        title: formData.get("title"),
        content: formData.get("content"),
        imageUrl: formData.get("imageUrl") || undefined,
        sortOrder: Number(formData.get("sortOrder") || 0),
      }),
    });

    event.currentTarget.reset();
    await loadContent();
  };

  const updateBakeryProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/admin/bakery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        tagline: formData.get("tagline"),
        description: formData.get("description"),
        phoneNumber: formData.get("phoneNumber"),
        whatsappNumber: formData.get("whatsappNumber"),
        locationAddress: formData.get("locationAddress"),
        mapsEmbedUrl: formData.get("mapsEmbedUrl") || undefined,
        heroTitle: formData.get("heroTitle"),
        heroSubtitle: formData.get("heroSubtitle"),
        heroCtaLabel: formData.get("heroCtaLabel"),
        heroImageUrl: formData.get("heroImageUrl") || undefined,
        bannerImageUrl: formData.get("bannerImageUrl") || undefined,
      }),
    });

    await loadContent();
  };

  return (
    <main className="flex min-h-screen bg-[#F5EEE6] text-[#3B2A1E]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#F5EEE6] py-6 shadow-[0px_12px_32px_-4px_rgba(59,42,30,0.08)]">
        <div className="mb-10 px-8">
          <h1 className="font-display text-xl italic">Master&apos;s Ledger</h1>
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#6E5442]">Artisanal Control</p>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setTab("orders")}
            className={tab === "orders" ? "flex w-full items-center gap-3 rounded-r-full bg-[#FFF7EE] px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#B07B4A] shadow-sm" : "flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#3B2A1E] hover:bg-[#FFF7EE]/50 hover:text-[#B07B4A]"}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Orders</span>
          </button>
          <button
            onClick={() => setTab("products")}
            className={tab === "products" ? "flex w-full items-center gap-3 rounded-r-full bg-[#FFF7EE] px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#B07B4A] shadow-sm" : "flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#3B2A1E] hover:bg-[#FFF7EE]/50 hover:text-[#B07B4A]"}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Inventory</span>
          </button>
          <button
            onClick={() => setTab("content")}
            className={tab === "content" ? "flex w-full items-center gap-3 rounded-r-full bg-[#FFF7EE] px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#B07B4A] shadow-sm" : "flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#3B2A1E] hover:bg-[#FFF7EE]/50 hover:text-[#B07B4A]"}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Store Content</span>
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={tab === "analytics" ? "flex w-full items-center gap-3 rounded-r-full bg-[#FFF7EE] px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#B07B4A] shadow-sm" : "flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.05em] text-[#3B2A1E] hover:bg-[#FFF7EE]/50 hover:text-[#B07B4A]"}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </button>
        </nav>

        <div className="mt-auto px-8">
          <button
            className="w-full rounded-full bg-gradient-to-br from-[#B07B4A] to-[#C89A5A] py-4 text-xs font-bold uppercase tracking-wider text-white"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#D9C7B4]/15 bg-[#FFF7EE]/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <span className="font-display text-base font-bold">Master&apos;s Ledger</span>
            <nav className="hidden gap-6 md:flex">
              <button className="border-b-2 border-[#B07B4A] pb-1 text-sm font-bold text-[#B07B4A]">Overview</button>
              <button className="text-sm text-[#6E5442] hover:text-[#B07B4A]">Reports</button>
              <button className="text-sm text-[#6E5442] hover:text-[#B07B4A]">Settings</button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden w-64 items-center rounded-full bg-[#E8D9C8] px-4 py-1.5 md:flex">
              <span className="material-symbols-outlined mr-2 text-[#6E5442]">search</span>
              <input className="w-full bg-transparent text-sm" placeholder="Search records..." />
            </div>
            <span className="material-symbols-outlined text-[#6E5442]">notifications</span>
          </div>
        </header>

        <div className="flex-1 space-y-8 px-8 pb-10 pt-8">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E5442]">Total Revenue</p>
              <h3 className="mt-2 font-display text-3xl text-[#B07B4A]">₹{analytics?.totalRevenue ?? 0}</h3>
            </article>
            <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E5442]">New Orders</p>
              <h3 className="mt-2 font-display text-3xl">{analytics?.totalOrders ?? 0}</h3>
            </article>
            <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E5442]">Pending</p>
              <h3 className="mt-2 font-display text-3xl">{pendingOrders.length}</h3>
            </article>
            <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E5442]">Products</p>
              <h3 className="mt-2 font-display text-3xl">{products.length}</h3>
            </article>
          </section>

          {pendingOrders.length > 0 ? (
            <section className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-4">
              <h2 className="text-sm font-bold">🔔 New order alert ({pendingOrders.length})</h2>
              <p className="text-xs text-[#6E5442]">Ringtone continues until acknowledged.</p>
            </section>
          ) : null}

          {error ? <p className="text-sm text-[#8a4c3a]">{error}</p> : null}

          {tab === "orders" ? (
            <section className="space-y-4 rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
              <h4 className="font-display text-xl">Recent Ledger Entries</h4>
              {recentOrders.map((order) => (
                <article key={order.id} className="rounded-lg border border-[#E8D9C8] bg-white/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.orderNumber} · {order.customerName}</p>
                      <p className="text-xs text-[#6E5442]">{order.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={order.type} />
                      <StatusPill status={order.status} />
                      <StatusPill status={order.paymentStatus} />
                    </div>
                  </div>

                  {order.customization ? <p className="mt-2 text-sm text-[#6E5442]">Custom notes: {order.customization}</p> : null}
                  {order.customImageUrl ? <a href={order.customImageUrl} target="_blank" className="mt-1 inline-block text-xs underline">View uploaded custom image</a> : null}

                  <p className="mt-2 text-sm font-semibold">Amount: ₹{order.totalAmount}</p>

                  {order.status === "RECEIVED" ? <SlideAcknowledge onComplete={() => acknowledgeOrder(order.id)} /> : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="rounded-full bg-gradient-to-br from-[#B07B4A] to-[#C89A5A] px-3 py-2 text-xs font-semibold text-white" onClick={() => confirmOrder(order.id)}>Confirm</button>
                    <button className="rounded-full bg-[#E8D9C8] px-3 py-2 text-xs font-semibold" onClick={() => updateStatus(order.id, "BAKING")}>Baking</button>
                    <button className="rounded-full bg-[#E8D9C8] px-3 py-2 text-xs font-semibold" onClick={() => updateStatus(order.id, "READY")}>Ready</button>
                    <button className="rounded-full bg-[#E8D9C8] px-3 py-2 text-xs font-semibold" onClick={() => sendPaymentLink(order.id)}>Send payment link</button>
                    {order.type === "CUSTOM" ? (
                      <button className="rounded-full bg-[#E8D9C8] px-3 py-2 text-xs font-semibold" onClick={() => setCustomQuote(order.id)}>Set custom price</button>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {tab === "products" ? (
            <section className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <h2 className="text-xl font-bold">Create Category</h2>
                <form className="mt-3 space-y-3" onSubmit={createCategory}>
                  <input name="name" placeholder="Category name" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="slug" placeholder="category-slug" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="description" placeholder="Description" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <input name="sortOrder" type="number" placeholder="Sort order" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" defaultValue={0} />
                  <button className="rounded-full bg-gradient-to-br from-[#B07B4A] to-[#C89A5A] px-4 py-2 text-sm font-semibold text-white" type="submit">Save Category</button>
                </form>
              </article>

              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <h2 className="text-xl font-bold">Create Product</h2>
                <form className="mt-3 space-y-3" onSubmit={createProduct}>
                  <input name="name" placeholder="Product name" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="slug" placeholder="product-slug" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <textarea name="description" placeholder="Description" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" rows={3} required />
                  <input name="price" type="number" placeholder="Price" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="imageUrl" placeholder="Image URL (optional)" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <select name="categoryId" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2">
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm"><input name="isFeatured" type="checkbox" /> Featured</label>
                  <button className="rounded-full bg-gradient-to-br from-[#B07B4A] to-[#C89A5A] px-4 py-2 text-sm font-semibold text-white" type="submit">Save Product</button>
                </form>
              </article>

              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5 lg:col-span-2">
                <h3 className="text-lg font-bold">Current Products</h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between rounded-lg bg-[#E8D9C8] px-3 py-2 text-sm">
                      <span>{product.name} · ₹{product.price}</span>
                      <button
                        className="text-[#8a4c3a]"
                        onClick={async () => {
                          await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
                          await loadProducts();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          {tab === "content" ? (
            <section className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5 lg:col-span-2">
                <h2 className="text-xl font-bold">Homepage & Bakery Profile</h2>
                <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={updateBakeryProfile}>
                  <input name="name" defaultValue={bakeryProfile?.name || "Bake Factory"} placeholder="Bakery name" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="tagline" defaultValue={bakeryProfile?.tagline || "Premium handcrafted cakes"} placeholder="Tagline" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="phoneNumber" defaultValue={bakeryProfile?.phoneNumber || ""} placeholder="Phone number" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="whatsappNumber" defaultValue={bakeryProfile?.whatsappNumber || ""} placeholder="WhatsApp number" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="locationAddress" defaultValue={bakeryProfile?.locationAddress || ""} placeholder="Location address" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="mapsEmbedUrl" defaultValue={bakeryProfile?.mapsEmbedUrl || ""} placeholder="Google Maps embed URL" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <input name="heroTitle" defaultValue={bakeryProfile?.heroTitle || "Bake Factory"} placeholder="Hero title" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="heroCtaLabel" defaultValue={bakeryProfile?.heroCtaLabel || "Order Now"} placeholder="Hero CTA label" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="heroImageUrl" defaultValue={bakeryProfile?.heroImageUrl || ""} placeholder="Hero image URL" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <input name="bannerImageUrl" defaultValue={bakeryProfile?.bannerImageUrl || ""} placeholder="Banner image URL" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <textarea name="heroSubtitle" defaultValue={bakeryProfile?.heroSubtitle || ""} placeholder="Hero subtitle" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2 md:col-span-2" rows={2} required />
                  <textarea name="description" defaultValue={bakeryProfile?.description || ""} placeholder="Bakery description" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2 md:col-span-2" rows={3} required />
                  <button className="rounded-full bg-gradient-to-br from-[#B07B4A] to-[#C89A5A] px-4 py-2 text-sm font-semibold text-white md:col-span-2" type="submit">Save Homepage Profile</button>
                </form>
              </article>

              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <h2 className="text-xl font-bold">Update Frontend Content Block</h2>
                <form className="mt-3 space-y-3" onSubmit={updateContent}>
                  <input name="key" placeholder="unique key (e.g. home_feature_3)" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <input name="title" placeholder="Title" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" required />
                  <textarea name="content" placeholder="Content" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" rows={4} required />
                  <input name="imageUrl" placeholder="Image URL (optional)" className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <input name="sortOrder" type="number" defaultValue={0} className="w-full rounded-lg bg-[#E8D9C8] px-3 py-2" />
                  <button className="rounded-full bg-gradient-to-br from-[#B07B4A] to-[#C89A5A] px-4 py-2 text-sm font-semibold text-white" type="submit">Save Content</button>
                </form>
              </article>

              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <h3 className="text-lg font-bold">Existing Content Blocks</h3>
                <div className="mt-3 space-y-2">
                  {contentBlocks.map((item) => (
                    <div key={item.id} className="rounded-lg bg-[#E8D9C8] px-3 py-2">
                      <p className="font-semibold">{item.key} · {item.title}</p>
                      <p className="text-sm text-[#6E5442]">{item.content}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          {tab === "analytics" ? (
            <section className="grid gap-5 md:grid-cols-3">
              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <p className="text-sm text-[#6E5442]">Total Orders</p>
                <p className="text-3xl font-bold">{analytics?.totalOrders ?? 0}</p>
              </article>
              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <p className="text-sm text-[#6E5442]">Total Revenue</p>
                <p className="text-3xl font-bold">₹{analytics?.totalRevenue ?? 0}</p>
              </article>
              <article className="rounded-xl border border-[#D9C7B4]/20 bg-[#FFF7EE] p-5">
                <p className="text-sm text-[#6E5442]">Popular Products</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {analytics?.popularProducts?.map((item) => (
                    <li key={item.productName}>{item.productName} · {item._sum.quantity ?? 0}</li>
                  ))}
                </ul>
              </article>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
