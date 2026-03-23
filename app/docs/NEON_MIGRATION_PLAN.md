# Neon Migration Plan (Bake Factory)

## Goal

Move from local/legacy schema state to stable production schema on Neon with minimal downtime and safe rollback options.

## Phase 1: Baseline Audit

1. Confirm current schema:
   - `prisma/schema.prisma` matches deployed app code.
2. Confirm data model conversion is complete (single-bakery architecture only).
3. Validate no tenant/SaaS dependencies remain in production code paths.

## Phase 2: Environment Preparation

1. Create Neon project and production database branch.
2. Store `DATABASE_URL` in Vercel production environment.
3. Use separate Neon branches for staging and production.

## Phase 3: Schema Deployment Strategy

Preferred strategy for production:
1. Generate migration from current schema:
   - `npm run db:migrate -- --name single_bakery_conversion`
2. Review generated SQL for destructive operations.
3. Apply migration in staging branch first.
4. Verify app behavior in staging.
5. Apply to production during low-traffic window.

Alternative (early stage only):
- `npm run db:push` can be used before strict migration governance is adopted.

## Phase 4: Data Seeding / Bootstrapping

1. Run seed script only where needed:
   - `npm run db:seed`
2. Confirm these records exist:
   - Owner account
   - `BakeryProfile` with id `main`
   - Categories and initial products
   - Availability schedules for all weekdays

## Phase 5: Verification Checklist

After schema deployment:
1. Owner login succeeds.
2. Catalog loads products from Neon.
3. Checkout creates orders with items.
4. Custom order uploads image and creates `CUSTOM` order.
5. Dashboard shows orders and allows status transitions.
6. Payment webhook updates order and locks edits after payment.
7. Order tracking stream returns status updates.

## Phase 6: Rollback Plan

If critical issue occurs:
1. Pause inbound traffic/webhooks (temporary switch in external providers if needed).
2. Roll back Vercel deployment to last stable build.
3. Restore Neon from backup/PITR to pre-migration point if data corruption occurred.
4. Re-run smoke tests before re-opening traffic.

## Phase 7: Ongoing Governance

- Adopt migration-per-change policy.
- Require staging validation before production migration.
- Keep seed logic idempotent.
- Track schema changes in release notes.
