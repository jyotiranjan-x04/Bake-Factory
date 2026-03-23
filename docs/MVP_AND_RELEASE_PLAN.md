# MVP & Release Plan

## MVP (Phase 1) — Must Launch

### Scope
- Multi-tenant onboarding (tenant + owner account)
- Bakery availability schedule with hard order blocking
- Basic storefront (`/store/[tenantId]`) with cart/checkout
- Order creation and owner dashboard list
- New-order alert with ring + slide-to-acknowledge
- Owner confirmation with estimated prep time
- WhatsApp order confirmation + ready notification
- Razorpay payment link + payment success webhook
- Order lock after payment
- SSE-based order tracking (Confirmed/Baking/Ready)
- RBAC for Owner role only (initial)

### Non-MVP (Explicitly Deferred)
- Co-admin/staff granular permission matrix
- Dynamic pricing engine
- Custom cake image upload flow
- Full analytics suite (beyond basic totals)
- Subdomain automation (keep tenantId route first)

### MVP Success Metrics
- < 2% failed order confirmations
- 100% payment webhook reconciliation
- < 1 minute median time from order create to owner acknowledgement

---

## Phase 2 — PRO Enablement

### Scope
- Co-admin + limited staff seats
- Custom order flow (including image upload)
- Dynamic pricing controls
- Enhanced dashboard metrics
- Alert timeout escalation and staff routing

### Guardrails
- Backend entitlement checks for all Pro features
- Seat-limit hard enforcement

---

## Phase 3 — Enterprise & Scale

### Scope
- Advanced role matrix and permissions
- Cross-location support (if needed)
- Subscription lifecycle automation
- Advanced analytics and cohort reports
- Operational resilience features (queue/retry observability)

---

## Recommended Delivery Order
1. Auth + tenant model + onboarding
2. Storefront + order pipeline
3. Dashboard + alerts + acknowledgement
4. WhatsApp integration + webhook reliability
5. Payments + lock rules
6. Real-time tracking + readiness notifications
7. Plan enforcement + subscriptions
