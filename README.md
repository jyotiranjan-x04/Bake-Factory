# Bake Factory Platform

Execution-ready workspace for the Bake Factory standalone bakery product.

## Documents

- `docs/PRD.md` — Structured product requirements
- `docs/MVP_AND_RELEASE_PLAN.md` — MVP scope and phased release plan
- `docs/TECH_ARCHITECTURE.md` — Technical architecture and API blueprint

## Implemented Project

The MVP application is implemented in `app/` with:
- Next.js App Router frontend + backend APIs
- Prisma single-bakery schema (PostgreSQL/Neon ready)
- Premium customer website + owner dashboard
- Storefront ordering, custom orders, and live tracking
- WhatsApp + Razorpay integration endpoints
- SSE live order tracking

## Run Locally

1. Open `app/`
2. Copy `.env.example` to `.env`
3. Set `DATABASE_URL` and `JWT_SECRET`
4. Run:
	- `npm install`
	- `npm run db:generate`
	- `npm run db:push`
	- `npm run db:seed`
	- `npm run dev`

## Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Tailwind CSS
- Razorpay SDK
- WhatsApp Cloud API integration

## Main App Guide

See `app/README.md` for all routes, API endpoints, and integration notes.
