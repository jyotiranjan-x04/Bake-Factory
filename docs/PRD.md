# Bakery SaaS – Product Requirements Document

## 1) Product Overview

### Product Name
Bakery SaaS Platform (working name)

### Vision
Build a multi-tenant SaaS platform for bakeries to:
- Reduce order errors
- Automate WhatsApp communication
- Streamline payment collection
- Manage operations efficiently

### Outcome
Transform manual order handling into a reliable digital workflow for both bakery operators and customers.

---

## 2) User Roles

### Super Admin
- Manage all bakeries (tenants)
- View cross-tenant analytics
- Manage subscriptions and plans
- Override feature flags and access

### Admin / Owner
- Configure bakery profile and availability
- Confirm and update orders
- Send customer communication through WhatsApp

### Co-Admin (Pro/Enterprise)
- Assist owner with operational and order actions
- Limited to permitted modules by role policy

### Staff (Pro/Enterprise)
- Handle production-stage order updates
- Acknowledge and resolve new-order alerts

### Customer
- Place and track orders via storefront
- Receive order notifications via WhatsApp

---

## 3) Platform Architecture

### SaaS Model
- Single codebase
- Single backend
- Multiple isolated tenants

### Core Components
- Frontend: Next.js
- Backend APIs: Next.js route handlers / Node runtime where required
- Database: PostgreSQL (Neon)
- WhatsApp: Meta Cloud API
- Payments: Razorpay

### Tenant Resolution
- `tenantId` in URL/path context
- Optional subdomain mapping (`bakery.yourapp.com`)

---

## 4) Core User Flow

### 4.1 Signup & Onboarding
**Signup fields**
- Bakery name
- Owner name
- Email
- Password

**System creates**
- Tenant
- Owner account

**Onboarding fields**
- Phone number
- Bakery location (Google Maps)
- Working days
- Opening/closing time

**Availability rule**
If outside working hours or closed day, block order creation on both frontend and backend with:
- “Sorry, we are currently not accepting orders.”

### 4.2 Dashboard
Owner dashboard shows:
- All orders
- Status distribution
- Alerts and pending actions

### 4.3 Order Alert System
When a new order arrives:
- Continuous ringing sound
- Visual high-priority alert
- Stops only on slide-to-acknowledge

### 4.4 Order Processing
1. Order received (dashboard + alert)
2. Acknowledged (ringing stops)
3. Confirmation step requires estimated prep time
4. System sends WhatsApp confirmation (details/customization/price/pickup time)

### 4.5 Edit Flow (Pre-Payment Only)
Customer edit request path:
- Customer → WhatsApp → Backend webhook → Dashboard → Owner edits/resends/confirm

Constraint:
- Edits allowed only before payment success

### 4.6 Payment Flow
- Send Razorpay advance payment link
- On successful payment, set `orderStatus = PAID`
- Notify bakery
- Lock order from further edits

### 4.7 Production Tracking
Customer sees real-time order stage updates:
- Confirmed → Baking → Ready

Transport:
- Server-Sent Events (SSE)

### 4.8 Ready Notification
On `READY` status:
- WhatsApp message: “Your cake is ready 🎂 Please come and collect”

---

## 5) Storefront (B2C)

### Access
- `/store/[tenantId]`
- or mapped subdomain

### Features
- Product catalog
- Cart and checkout
- Order tracking

### Tenant Branding
- Logo
- Theme/colors (plan-dependent)

---

## 6) WhatsApp System

### API
- WhatsApp Business Cloud API

### Message Types
- Order confirmation
- Status updates
- Payment requests
- Ready notifications

### Requirements
- Template message configuration
- Secure webhook validation and retries

---

## 7) Subscription Model

### Free
- 1 owner
- Basic features
- No custom orders

### Pro
- Custom cake orders with image upload
- Dynamic pricing
- Limited staff (2–3 users)

### Enterprise
- Multiple admins and staff
- Role-based access expansion
- Higher usage limits

### Enforcement
Backend must enforce:
- User seat limits
- Feature entitlements

---

## 8) Staff Alert System
- Continuous ringing for new orders
- Slide-to-acknowledge interaction
- Timeout fallback/escalation logic

---

## 9) Security & Data
- Tenant isolation in every query and mutation
- JWT auth using HttpOnly cookies
- Role-based authorization at API level

---

## 10) Edge Cases
- Payment failure handling
- Duplicate webhook deduplication
- WhatsApp send failure + retry/fallback
- Concurrent edit conflicts
- Order locking after payment

---

## 11) Analytics
- Total orders
- Revenue trend
- Customer/order trends

---

## 12) Testing Requirements
- Authentication flow
- End-to-end order flow
- Payment and webhook validation
- Multi-tenant isolation checks

---

## 13) Deployment
- Hosting: Vercel
- Database: Neon PostgreSQL
- Suggested domains:
  - `yourapp.com` → SaaS app/dashboard
  - `api.yourapp.com` → API layer (if split)
  - `bakery.yourapp.com` → storefront tenant

---

## 14) Final Goal
Provide a system where:
- Bakery owners feel in control and stress-free
- Customers feel informed and confident
- Business operations become automated, efficient, and scalable
