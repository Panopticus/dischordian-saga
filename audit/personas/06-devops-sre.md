# DevOps / SRE — Audit

## Top 5 findings

### F1: No HTTP `/api/health`; Railway healthcheck targets `/`, CI polls a non-existent path
- file: /home/user/dischordian-saga/railway.toml, /home/user/dischordian-saga/.github/workflows/ci.yml:296
- severity: high
- category: observability
- finding: Health exists only as tRPC procedures (`system.health`, `performance.healthCheck`). `railway.toml` sets `healthcheckPath = "/"` — hits SPA index, so a broken Express with stale static still passes. CI e2e polls `curl /api/health` — path registered nowhere; falls through to `::warning::`. `ipRateLimit.ts:15` claims to skip `/api/health`, suggesting it was intended.
- fix: Register `app.get("/api/health", …)` returning `{ ok, dbPing, sentryReady, otelReady }` before CSRF/rate-limit; point `healthcheckPath` and CI's curl at it.

### F2: Sentry/OTel "required in prod" but loaded as optional dynamic imports — silent observability possible
- file: /home/user/dischordian-saga/apps/server/sentry.ts, /home/user/dischordian-saga/apps/server/otel.ts, /home/user/dischordian-saga/apps/server/_core/env.ts
- severity: high
- category: observability
- finding: `env.ts:85-89` makes `SENTRY_DSN` and `OTEL_EXPORTER_OTLP_ENDPOINT` boot-required, but `sentry.ts:21-25` wraps `import("@sentry/node")` in try/catch that skips silently if missing; `otel.ts` mirrors that with variable-specifier dynamic imports. `package.json` lists `@sentry/node` but **no** `@opentelemetry/*` deps. Prod build satisfies env check and emits zero traces. CLAUDE.md's planned ratchet not yet enforced.
- fix: Promote `@opentelemetry/sdk-node` + exporters to hard deps; convert to static imports; add ship-check asserting `Sentry.getClient()` and OTel SDK non-null in prod.

### F3: CI gates `db:migrate:prod` with `continue-on-error: true`; ~25 startup `bootstrap*` IIFEs paper over drift
- file: /home/user/dischordian-saga/.github/workflows/ci.yml:173,277, /home/user/dischordian-saga/apps/server/_core/index.ts:530-689
- severity: high
- category: migration
- finding: `db-smoke` and `e2e` run migrate with `continue-on-error: true` because journal-tracked migrations 0045+ depend on orphans 0036–0044, 0049, 0054–0070 absent from `_journal.json`. Server compensates with ~25 `bootstrap*` IIFEs (`CREATE TABLE IF NOT EXISTS`/`ALTER TABLE`) at startup. Prod schema enforced by cold-boot, not `drizzle-kit migrate`; rollback to prior image leaves columns/tables newer code expects; CI green ≠ migrations apply on fresh DB.
- fix: Reconcile the journal; flip both `continue-on-error` flags to `false`; retire bootstraps once journaled.

### F4: No graceful-shutdown handler — SIGTERM kills in-flight HTTP/WS, skips Sentry/OTel flush
- file: /home/user/dischordian-saga/apps/server/_core/index.ts
- severity: medium
- category: deploy
- finding: `grep SIGTERM|SIGINT apps/server` returns nothing. Railway sends SIGTERM on every redeploy (30s grace). 8+ WebSocket surfaces, 6 `setInterval` ticks, Stripe flows — none drained. `Sentry.close()` / `sdk.shutdown()` not invoked; pre-deploy telemetry vanishes.
- fix: `process.on("SIGTERM", async () => { server.close(); await Promise.allSettled([Sentry.close(2000), shutdownOTel()]); process.exit(0); })`.

### F5: `db:migrate` and `db:migrate:prod` are aliases; no `db:push` guard
- file: /home/user/dischordian-saga/package.json, /home/user/dischordian-saga/railway.toml
- severity: medium
- category: env_parity
- finding: Both resolve to `drizzle-kit migrate`. Railway's `pnpm db:migrate:prod && pnpm start` is identical to dev. `db:push` is documented as "bypasses the migration journal" — nothing prevents pointing it at prod `DATABASE_URL`. No `DATABASE_URL_PROD` split.
- fix: Make `db:migrate:prod` refuse on `NODE_ENV !== "production"`; add `db:push` guard aborting on non-dev hosts.

## CI workflow inventory

| File | Trigger | Runs | Required? |
|------|---------|------|-----------|
| ci.yml | push main/master/claude/**; PR main/master | `check`: lint, lint:void-energy, ship:check, tsc, vitest, audit (advisory), entity-name (advisory), build, bundle warn. `db-smoke`: MySQL 8, migrate (continue-on-error), `db:smoke`. `e2e`: MySQL 8, migrate (continue-on-error), seed, build, start, Playwright. | PR-required (inferred). |
| asset-coverage-probe.yml | dispatch; daily 09:00 UTC; PR on `expansionArt/**`, card defs | HEAD-checks every manifest URL against S3; skips on fork PRs. | Conditional. |
| dmc-build.yml | push main on `games/dead-mans-circuit/**`; dispatch | Godot 4.6 → web export → `assets:upload --only=games` → CDN smoke. | No (deploy). |
| public-assets-upload.yml | push main on `apps/client/public/{art,audio,…}/**`; dispatch | `assets:upload`; ETag-skips. | No (deploy). |
| trade-empire-art-upload.yml | dispatch | Producer ZIP → `upload-trade-empire-art.ts`. | No (manual). |
| trade-empire-vo-generate.yml | dispatch | ElevenLabs VO + S3 + auto-PR. | No (manual). |
| ark-rooms-art-upload.yml | dispatch | Producer ZIP → PNG→WebP → `assets:upload --only=art`. | No (manual). |

## Convergence hints

- **Stripe + F2:** webhook (apps/server/_core/index.ts:51-209) has two-layer idempotency but logs via `console.error` — invisible without Sentry. `processed_webhook_events` itself bootstrapped at startup (inherits F3). RevenueCat in deps but **no** `/api/revenuecat/webhook` route.
- **Asset pipeline verified:** `upload-public-to-s3.ts:78-98` computes local MD5 and HEAD-checks ETag/ContentLength before PUT. Soft failure: any HEAD error returns `false` (404 vs 403 indistinguishable); creds lacking `s3:HeadObject` silently re-upload everything.
- **Secrets:** Only `.env.example` checked in. Via GitHub `secrets.*`. `env.ts:sanitizeCredential` strips non-printable chars. No rotation tooling, no IAM-scoping-as-code.
- **Rollback:** none documented. `restartPolicyMaxRetries: 10` but bad migration loops until manual intervention. No image pinning, no DB snapshot.
- **Branch protection:** not inferable from filesystem. Parent audit: `gh api repos/.../branches/main/protection`.
- **Cross-persona:** F2 ↔ security (audit gap); F3 ↔ DB (FK ratchet vs. bootstrap tables); F4 ↔ multiplayer (match drops on deploy).
