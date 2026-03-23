# Bake Factory Platform

Production-ready single-business bakery website and management system for Bake Factory.

## Included

- Auth: owner signup/login/logout with JWT HttpOnly cookie
- Single-bakery data model (no tenant/subdomain logic)
- Premium customer website with claymorphism style and Framer Motion animations
- Catalog + product detail + cart + checkout + track order pages
- Custom cake order flow with image upload
- Owner dashboard: order management + ringtone alert + acknowledge + custom quote
- Product/category CRUD
- Frontend content management (homepage text, banners, maps embed, contact)
- Working-hours/day enforcement with closed message handling
- Payments: Razorpay payment link creation + webhook processing
- Messaging: WhatsApp send endpoint + webhook receiver
- Tracking: SSE endpoint and customer tracking page

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind
- Framer Motion
- Prisma + PostgreSQL (Neon compatible)
- Razorpay SDK
- WhatsApp Cloud API via fetch

## Setup

1. Copy env template:

```bash
cp .env.example .env
```

For production, use `.env.production.example` as your base template.

2. Fill required values in `.env`:
- `DATABASE_URL`
- `JWT_SECRET`
- Optional for live integrations: Razorpay + WhatsApp credentials

3. Generate Prisma client and sync schema:

```bash
npm run db:generate
npm run db:push
```

4. Seed demo data:

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

Open http://localhost:3000

## Key Routes

- App:
	- `/`
	- `/catalog`
	- `/product/[slug]`
	- `/custom-order`
	- `/cart`
	- `/checkout`
	- `/track-order`
	- `/track-order/[orderId]`
	- `/admin/login`
	- `/admin/dashboard`

- API:
	- `/api/auth/*`
	- `/api/public/*`
	- `/api/admin/*`
	- `/api/payments/:orderId/create-link`
	- `/api/webhooks/razorpay`
	- `/api/webhooks/whatsapp`
	- `/api/orders/:id/events/stream`

## Notes

- If Razorpay or WhatsApp credentials are not provided, the app uses safe mock-like behavior for local testing.
- Razorpay and WhatsApp webhook signature verification are implemented and enforced when secrets are configured.

## Production Docs

- `docs/DEPLOYMENT_CHECKLIST.md` — Vercel production deployment and validation checklist
- `docs/NEON_MIGRATION_PLAN.md` — staged Neon migration and rollback plan
