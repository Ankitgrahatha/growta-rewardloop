# Backend source-of-truth and release notes

## Live project inventory checked 2026-10-21

Supabase project ref: `guhhuqxrobhuumwrypnc` (ap-south-1).

The deployed authenticated API was retrieved from Supabase and mirrored to:
`supabase/functions/rewardloop-api/index.ts`.

- Live deployed version at capture: 7.
- SHA-256 reported by Supabase for the deployed source: `a98269e94a0adc0720e610582d4a9414cde5a057130db2ce41283daeea72a29e`.
- The function has `verify_jwt = true`, validates the bearer session with Supabase Auth, and performs privileged operations through a server-side service-role client. The live function was redeployed as version 8 after the reviewed CORS update.
- CORS uses an exact-origin allowlist containing `https://bigagri.vercel.app`, `https://growta-rewardloop.vercel.app`, `https://growta-rewardloop-acme-bce0.vercel.app`, and `https://growta-rewardloop-git-main-acme-bce0.vercel.app`, plus any explicitly configured exact origins in the server-side `ALLOWED_ORIGINS` secret. Preview deployment URLs are not wildcarded.
- The implementation currently hardcodes tenant slug `growta-rewardloop`; it is a single-tenant pilot API, not a general multi-tenant router.

## Database state observed

The live project reports 13 applied migrations, through `20261021121229_rewardloop_admin_settings`. Core tables include tenants, tenant_memberships, partners, products, production_batches, campaigns, qr_codes, scan_events, claims, points_ledger, audit_logs, qr_issuance_batches, rewards, redemptions, and rewardloop_admin_settings. RLS is enabled on the listed tables.

**Important:** the applied migration history is not yet represented by the complete SQL migration files in this repository. Do not run a production schema change from this repository until the canonical migration SQL has been recovered and reconciled against the live schema. Never fabricate a migration based only on table names.

## Legacy function warning

The live project also has six older Edge Functions: `claim-qr`, `onboard-farmer`, `issue-qr-batch`, `revoke-qr-batch`, `redeem-reward`, and `verify-partner`. They are deployed with platform `verify_jwt=false`; their source appears to manually call Auth `getUser()`, but their CORS allows `*` and the initial source scan did not find explicit tenant-membership / admin-role checks in these wrappers.

- Do not wire the UI to these legacy endpoints.
- Do not assume CORS is authorization; it is not.
- Review each endpoint's full code and its database RPC authorization before deciding whether to retire or harden it.
- The preferred client entry point is the `rewardloop-api` dispatcher, which checks user sessions and explicit admin membership for privileged actions.

## Secrets and deployment

Required server-side function secrets include `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a public key variable (`SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY`). Keep all secret values out of GitHub and the browser. Do not print, commit, or paste service-role or Redis tokens into source.

The frontend uses only the project URL and a public/publishable key. Supabase Auth Site URL and Redirect URLs still need to be confirmed in the dashboard for `https://growta-rewardloop.vercel.app` before production email-link sign-in can be declared working. Use Vercel environment settings and Supabase Auth URL configuration; do not place secrets in committed `.env` files.

## Next backend gates

1. Recover and commit canonical migration SQL, then compare it with live schema and migration history.
2. Audit the six legacy functions and their RPCs; disable or secure any unsafe route after impact review.
3. Add isolated database tests for valid claims, replay/idempotency, concurrency, redemptions, stock/balance rollback, demo protection, and tenant isolation.
4. Configure production auth delivery and redirect URLs.
5. Integrate Upstash for rate limiting only after server-side secrets and abuse semantics are agreed; PostgreSQL remains authoritative for points.
