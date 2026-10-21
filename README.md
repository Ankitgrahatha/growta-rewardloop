# Growta RewardLoop

Mobile-first agricultural loyalty platform for product QR claims, points, rewards, and partner operations.

> **Current release status:** foundation / connectivity smoke-test stage. The current homepage is a temporary deployment test page, not the complete farmer PWA. Do not use it to issue or redeem real rewards.

## Current architecture target

- **Farmer PWA:** installable, mobile-first, Hindi and English first, QR camera scanning with manual fallback.
- **Admin web:** separate interface; all privileged operations must be authorized by the trusted backend.
- **Backend:** Supabase Auth, PostgreSQL, row-level security, Edge Functions, migrations, audit records, and transactional claims/redemptions.
- **Abuse controls:** Upstash Redis for rate limits and short-lived counters; PostgreSQL remains authoritative for points and inventory.
- **Delivery:** GitHub source control, GitHub Actions checks, Vercel Preview deployments, and Production releases from `main`.

## Repository status

This repository currently contains a temporary static homepage and the initial CI foundation. Backend and mobile source must be added only after the target architecture and secure integration contracts are verified. Do not assume Supabase or Redis is wired into this repository until the relevant code and environment configuration are present.

## Run locally

Requires Node.js 20 or newer.

```bash
npm test
npm run build
```

The project intentionally has no runtime npm dependencies at this foundation stage. The build check validates the static entry page; it is not a substitute for end-to-end, backend, security, or device tests.

To preview the current page locally, serve the repository root with any static HTTP server, then open `index.html`.

## Delivery workflow

1. Create a feature branch.
2. Commit and push changes to GitHub.
3. Let GitHub Actions run the static checks.
4. Confirm Vercel created a Preview deployment for the branch.
5. Test the Preview and review the change.
6. Merge through a pull request only after checks pass.
7. Verify the production deployment and smoke tests after merging to `main`.

Never commit `.env` files, Supabase service-role keys, Redis credentials, OTP provider secrets, or production data. Use Vercel/Supabase server-side environment settings for secrets.

## Reward integrity rules

- QR codes must be unguessable, scoped to an authorized product/batch/campaign, and revocable.
- Claim eligibility and points awards are decided by trusted server-side code.
- Claims, ledger credits, inventory reservations, and redemptions must be atomic and idempotent.
- PostgreSQL is the source of truth; Redis is never the authoritative points ledger.
- Demo rewards/campaigns must never be redeemable or activatable as real offers.
- Never show a success state until the backend confirms the operation.
- Do not run destructive transaction or concurrency tests against production.

## Release gate

A real-value pilot remains **NO-GO** until valid QR claim/replay/concurrency tests, redemption rollback/reconciliation tests, tenant isolation, authentication delivery, admin bootstrap, rate limits, backup recovery, and operational monitoring have been verified.
