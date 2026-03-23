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
  const [analytics, setAnalytics] = useState<{ totalOrders: number; totalRevenue: number; popularProducts: { productName: string; _sum: { quantity: number | null } }[] } | null>(null);
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
    <main className="section-wrap py-6 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="clay-card h-fit p-4">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Admin</p>
            <h1 className="font-display text-xl font-bold">Demo Bakery</h1>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Owner Dashboard</p>
          </div>

          <nav className="space-y-2">
            <button className={tab === "orders" ? "clay-button w-full px-4 py-2 text-sm" : "clay-inset w-full px-4 py-2 text-sm"} onClick={() => setTab("orders")}>Orders</button>
            <button className={tab === "products" ? "clay-button w-full px-4 py-2 text-sm" : "clay-inset w-full px-4 py-2 text-sm"} onClick={() => setTab("products")}>Products & Categories</button>
            <button className={tab === "content" ? "clay-button w-full px-4 py-2 text-sm" : "clay-inset w-full px-4 py-2 text-sm"} onClick={() => setTab("content")}>Content Management</button>
            <button className={tab === "analytics" ? "clay-button w-full px-4 py-2 text-sm" : "clay-inset w-full px-4 py-2 text-sm"} onClick={() => setTab("analytics")}>Analytics</button>
          </nav>

          <button
            className="clay-inset mt-4 w-full px-4 py-2 text-sm"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
          >
            Logout
          </button>
        </aside>

        <section className="space-y-5">
          <section className="clay-card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
            <div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Bake Factory Owner Dashboard</h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">Manage orders, custom requests, storefront content, and products.</p>
            </div>
            <div className="flex items-center gap-2">
              <input className="clay-input hidden px-3 py-2 text-sm md:block" placeholder="Search orders" />
              <span className="status-chip px-3 py-1 text-xs">Live</span>
            </div>
          </section>

          {pendingOrders.length > 0 ? (
            <section className="clay-card border border-[color:var(--line)] bg-[#f1e4d6] p-4 sm:p-5">
              <h2 className="font-bold text-[color:var(--foreground)]">🔔 New order alert ({pendingOrders.length})</h2>
              <p className="text-sm text-[color:var(--muted)]">Ringtone continues until acknowledged.</p>
            </section>
          ) : null}

          {error ? <p className="clay-error text-sm">{error}</p> : null}

          {tab === "orders" ? (
            <section className="grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="clay-card space-y-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.orderNumber} · {order.customerName}</p>
                      <p className="text-sm text-[color:var(--muted)]">{order.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={order.type} />
                      <StatusPill status={order.status} />
                      <StatusPill status={order.paymentStatus} />
                    </div>
                  </div>

                  {order.customization ? <p className="text-sm text-[color:var(--muted)]">Custom notes: {order.customization}</p> : null}
                  {order.customImageUrl ? <a href={order.customImageUrl} target="_blank" className="clay-link text-sm underline">View uploaded custom image</a> : null}

                  <p className="font-semibold">Amount: ₹{order.totalAmount}</p>

                  {order.status === "RECEIVED" ? (
                    <SlideAcknowledge onComplete={() => acknowledgeOrder(order.id)} />
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <button className="clay-button px-3 py-2 text-sm" onClick={() => confirmOrder(order.id)}>Confirm</button>
                    <button className="clay-inset px-3 py-2 text-sm" onClick={() => updateStatus(order.id, "BAKING")}>Baking</button>
                    <button className="clay-inset px-3 py-2 text-sm" onClick={() => updateStatus(order.id, "READY")}>Ready</button>
                    <button className="clay-inset px-3 py-2 text-sm" onClick={() => sendPaymentLink(order.id)}>Send payment link</button>
                    {order.type === "CUSTOM" ? (
                      <button className="clay-inset px-3 py-2 text-sm" onClick={() => setCustomQuote(order.id)}>Set custom price</button>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {tab === "products" ? (
            <section className="grid gap-5 lg:grid-cols-2">
          <article className="clay-card p-5">
            <h2 className="text-xl font-bold">Create Category</h2>
            <form className="mt-3 space-y-3" onSubmit={createCategory}>
              <input name="name" placeholder="Category name" className="clay-inset w-full px-3 py-2" required />
              <input name="slug" placeholder="category-slug" className="clay-inset w-full px-3 py-2" required />
              <input name="description" placeholder="Description" className="clay-inset w-full px-3 py-2" />
              <input name="sortOrder" type="number" placeholder="Sort order" className="clay-inset w-full px-3 py-2" defaultValue={0} />
              <button className="clay-button px-4 py-2 text-sm font-semibold" type="submit">Save Category</button>
            </form>
          </article>

          <article className="clay-card p-5">
            <h2 className="text-xl font-bold">Create Product</h2>
            <form className="mt-3 space-y-3" onSubmit={createProduct}>
              <input name="name" placeholder="Product name" className="clay-inset w-full px-3 py-2" required />
              <input name="slug" placeholder="product-slug" className="clay-inset w-full px-3 py-2" required />
              <textarea name="description" placeholder="Description" className="clay-inset w-full px-3 py-2" rows={3} required />
              <input name="price" type="number" placeholder="Price" className="clay-inset w-full px-3 py-2" required />
              <input name="imageUrl" placeholder="Image URL (optional)" className="clay-inset w-full px-3 py-2" />
              <select name="categoryId" className="clay-inset w-full px-3 py-2">
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm"><input name="isFeatured" type="checkbox" /> Featured</label>
              <button className="clay-button px-4 py-2 text-sm font-semibold" type="submit">Save Product</button>
            </form>
          </article>

          <article className="clay-card p-5 lg:col-span-2">
            <h3 className="text-lg font-bold">Current Products</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="clay-inset flex items-center justify-between px-3 py-2 text-sm">
                  <span>{product.name} · ₹{product.price}</span>
                  <button
                    className="clay-danger"
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
          <article className="clay-card p-5 lg:col-span-2">
            <h2 className="text-xl font-bold">Homepage & Bakery Profile</h2>
            <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={updateBakeryProfile}>
              <input name="name" defaultValue={bakeryProfile?.name || "Bake Factory"} placeholder="Bakery name" className="clay-inset w-full px-3 py-2" required />
              <input name="tagline" defaultValue={bakeryProfile?.tagline || "Premium handcrafted cakes"} placeholder="Tagline" className="clay-inset w-full px-3 py-2" required />
              <input name="phoneNumber" defaultValue={bakeryProfile?.phoneNumber || ""} placeholder="Phone number" className="clay-inset w-full px-3 py-2" required />
              <input name="whatsappNumber" defaultValue={bakeryProfile?.whatsappNumber || ""} placeholder="WhatsApp number" className="clay-inset w-full px-3 py-2" required />
              <input name="locationAddress" defaultValue={bakeryProfile?.locationAddress || ""} placeholder="Location address" className="clay-inset w-full px-3 py-2" required />
              <input name="mapsEmbedUrl" defaultValue={bakeryProfile?.mapsEmbedUrl || ""} placeholder="Google Maps embed URL" className="clay-inset w-full px-3 py-2" />
              <input name="heroTitle" defaultValue={bakeryProfile?.heroTitle || "Bake Factory"} placeholder="Hero title" className="clay-inset w-full px-3 py-2" required />
              <input name="heroCtaLabel" defaultValue={bakeryProfile?.heroCtaLabel || "Order Now"} placeholder="Hero CTA label" className="clay-inset w-full px-3 py-2" required />
              <input name="heroImageUrl" defaultValue={bakeryProfile?.heroImageUrl || ""} placeholder="Hero image URL" className="clay-inset w-full px-3 py-2" />
              <input name="bannerImageUrl" defaultValue={bakeryProfile?.bannerImageUrl || ""} placeholder="Banner image URL" className="clay-inset w-full px-3 py-2" />
              <textarea name="heroSubtitle" defaultValue={bakeryProfile?.heroSubtitle || ""} placeholder="Hero subtitle" className="clay-inset w-full px-3 py-2 md:col-span-2" rows={2} required />
              <textarea name="description" defaultValue={bakeryProfile?.description || ""} placeholder="Bakery description" className="clay-inset w-full px-3 py-2 md:col-span-2" rows={3} required />
              <button className="clay-button px-4 py-2 text-sm font-semibold md:col-span-2" type="submit">Save Homepage Profile</button>
            </form>
          </article>

          <article className="clay-card p-5">
            <h2 className="text-xl font-bold">Update Frontend Content Block</h2>
            <form className="mt-3 space-y-3" onSubmit={updateContent}>
              <input name="key" placeholder="unique key (e.g. home_feature_3)" className="clay-inset w-full px-3 py-2" required />
              <input name="title" placeholder="Title" className="clay-inset w-full px-3 py-2" required />
              <textarea name="content" placeholder="Content" className="clay-inset w-full px-3 py-2" rows={4} required />
              <input name="imageUrl" placeholder="Image URL (optional)" className="clay-inset w-full px-3 py-2" />
              <input name="sortOrder" type="number" defaultValue={0} className="clay-inset w-full px-3 py-2" />
              <button className="clay-button px-4 py-2 text-sm font-semibold" type="submit">Save Content</button>
            </form>
          </article>

          <article className="clay-card p-5">
            <h3 className="text-lg font-bold">Existing Content Blocks</h3>
            <div className="mt-3 space-y-2">
              {contentBlocks.map((item) => (
                <div key={item.id} className="clay-inset px-3 py-2">
                  <p className="font-semibold">{item.key} · {item.title}</p>
                  <p className="text-sm text-[color:var(--muted)]">{item.content}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
          ) : null}

          {tab === "analytics" ? (
            <section className="grid gap-5 md:grid-cols-3">
          <article className="clay-card p-5">
            <p className="text-sm text-[color:var(--muted)]">Total Orders</p>
            <p className="text-3xl font-bold">{analytics?.totalOrders ?? 0}</p>
          </article>
          <article className="clay-card p-5">
            <p className="text-sm text-[color:var(--muted)]">Total Revenue</p>
            <p className="text-3xl font-bold">₹{analytics?.totalRevenue ?? 0}</p>
          </article>
          <article className="clay-card p-5">
            <p className="text-sm text-[color:var(--muted)]">Popular Products</p>
            <ul className="mt-2 space-y-1 text-sm">
              {analytics?.popularProducts?.map((item) => (
                <li key={item.productName}>{item.productName} · {item._sum.quantity ?? 0}</li>
              ))}
            </ul>
          </article>
        </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}
