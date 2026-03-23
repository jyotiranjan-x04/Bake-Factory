# Technical Architecture Specification

## 1) Suggested Repository Layout

```txt
apps/
  web/                # Next.js app (dashboard + storefront)
packages/
  db/                 # Prisma schema + generated client
  auth/               # JWT and session helpers
  billing/            # Razorpay integration
  messaging/          # WhatsApp API client + templates
  shared/             # Shared types, constants, validation
```

## 2) Data Model (High-Level)

### Core Tables
- `tenants`
- `users`
- `memberships` (tenant ↔ user ↔ role)
- `subscriptions`
- `storefront_settings`
- `availability_schedules`
- `products`
- `orders`
- `order_items`
- `order_events` (audit timeline)
- `payments`
- `webhook_events` (idempotency tracking)
- `message_logs`

### Critical Constraints
- Every tenant-scoped table includes `tenant_id`
- Unique index examples:
  - (`tenant_id`, `email`) on members/users where needed
  - (`provider`, `provider_event_id`) on webhook events
- Soft-lock fields on order:
  - `is_locked`
  - `locked_at`
  - `lock_reason`

## 3) API Surface (Initial)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Onboarding
- `POST /api/onboarding/profile`
- `POST /api/onboarding/availability`

### Storefront
- `GET /api/store/:tenantId/products`
- `POST /api/store/:tenantId/orders`
- `GET /api/store/:tenantId/orders/:orderId`

### Orders (Dashboard)
- `GET /api/dashboard/orders`
- `POST /api/dashboard/orders/:id/acknowledge`
- `POST /api/dashboard/orders/:id/confirm`
- `POST /api/dashboard/orders/:id/status`
- `POST /api/dashboard/orders/:id/edit`

### Payments
- `POST /api/payments/:orderId/create-link`
- `POST /api/webhooks/razorpay`

### Messaging
- `POST /api/messages/orders/:id/send-confirmation`
- `POST /api/webhooks/whatsapp`

### Real-Time
- `GET /api/orders/:id/events/stream` (SSE)

## 4) State Machine

```txt
DRAFT -> RECEIVED -> ACKNOWLEDGED -> CONFIRMED -> BAKING -> READY -> COMPLETED
                           |               |
                           |               -> CANCELLED
                           -> CANCELLED

Payment status: UNPAID -> PENDING -> PAID / FAILED
Edit rule: allowed only when payment != PAID and order.is_locked = false
Lock rule: on PAID => order.is_locked = true
```

## 5) Reliability Rules

- Webhooks are idempotent using provider event IDs
- All external API calls logged with retry metadata
- At-least-once event processing; handlers must be idempotent
- WhatsApp failure fallback: queue retry and mark notification state

## 6) Security

- JWT in HttpOnly + Secure cookies
- CSRF protection for cookie-auth state-changing routes
- Strict tenant guard middleware (`tenant_id` required + validated)
- Server-side role checks per route action
- PII-safe logs (no sensitive data in plain text)

## 7) Plan Enforcement

- Central entitlement function:
  - `canUseFeature(tenantId, featureKey)`
  - `canAddSeat(tenantId, role)`
- Enforced in backend only (frontend mirrors for UX)

## 8) Deployment Baseline

- Vercel for app deployment
- Neon PostgreSQL for primary DB
- Environment segmentation: dev/staging/prod
- Cron/scheduled jobs for webhook retry and dead-letter handling
