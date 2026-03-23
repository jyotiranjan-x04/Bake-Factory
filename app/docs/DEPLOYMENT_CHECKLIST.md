# Bake Factory Production Deployment Checklist (Vercel)

## 1) Environment Configuration

Set the following environment variables in Vercel (Production and Preview where appropriate):

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`

Security requirements:
- Use unique secrets per environment.
- Do not reuse local development secrets in production.
- Rotate webhook secrets if compromised.

## 2) Build & Runtime

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output: `.next`

## 3) Database (Neon)

- Ensure production branch/database exists.
- Run:
  - `npm run db:generate`
  - `npm run db:push` (or `npm run db:migrate` if migration workflow is adopted)
  - `npm run db:seed` (only if required for baseline content)

## 4) Webhook Setup

### Razorpay
- Endpoint: `https://<your-domain>/api/webhooks/razorpay`
- Set secret in Razorpay dashboard and match `RAZORPAY_WEBHOOK_SECRET`.
- Enable relevant events (payment capture/payment link paid).

### WhatsApp Cloud API
- Callback URL: `https://<your-domain>/api/webhooks/whatsapp`
- Verify token must match `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
- App secret must match `WHATSAPP_APP_SECRET` for signature validation.

## 5) Post-Deploy Smoke Test

- Public pages load (`/`, `/catalog`, `/product/[slug]`, `/custom-order`, `/checkout`, `/track-order`).
- Admin auth works (`/admin/login`, `/admin/dashboard`).
- Place test order and custom order with image upload.
- Acknowledge order alert in dashboard.
- Generate payment link and confirm webhook updates order to `PAID`.
- Mark order as `READY` and verify WhatsApp send path.

## 6) Operational Hardening

- Enable Vercel monitoring/alerts for API failures.
- Configure structured log retention.
- Add uptime checks for key endpoints:
  - `/api/public/home`
  - `/api/webhooks/razorpay`
  - `/api/webhooks/whatsapp`

## 7) Backup & Recovery

- Enable Neon backups and point-in-time recovery.
- Document emergency rollback process for Vercel deployment.
