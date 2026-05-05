# Incident response

Production for Loredex OS / Dischordian Saga is hosted on Railway.
The server is one Node process behind Railway's reverse proxy;
MySQL is a managed Railway add-on.

## Severity matrix

| Sev | Definition | Response time | Examples |
|-----|------------|---------------|----------|
| SEV-1 | Total outage / data loss / actively-exploited security hole | < 15 min | site down, DB unreachable, auth bypass, money draining |
| SEV-2 | Partial outage / major feature broken | < 1 hour | PvP queue won't match, store checkout 500s, mass login failures |
| SEV-3 | Minor degradation / single-feature broken | next business day | leaderboard stale, one cosmetic mis-rendered |
| SEV-4 | Cosmetic / one-off | backlog | typo in lore text, minor balance issue |

## Triage

1. **Confirm the symptom.** Check Sentry for new error patterns,
   `/api/health` for liveness, the Railway logs for the last
   deploy. If you can reproduce the issue, you've already half
   triaged.
2. **Check recent deploys.** Most outages are the most recent
   deploy. `git log --since='2 hours ago'` on `main`. If the
   timing matches, `git revert` the offending commit and let
   Railway redeploy. **Always revert before debugging in prod.**
3. **Check the dashboards.**
   - Railway: CPU / memory / restart count.
   - MySQL: connections, slow queries.
   - Sentry: error spike timestamps.
4. **Communicate.** Post in #incidents (or wherever your team
   coordinates) with the symptom, the suspected cause, and what
   you're doing about it. One status update every 15 min for
   SEV-1, every 30 for SEV-2.

## Common runbooks

### Site is down, can't reach `/api/health`

- Check Railway dashboard — is the service healthy?
- If restarts > 3 in last 5 min, check logs for the crash. Most
  common: bad migration, env var change, unhandled promise
  rejection in a bootstrap. Revert + redeploy.
- If Railway shows healthy but the public URL doesn't respond,
  check DNS / Cloudflare.

### MySQL connection errors in logs

- Connection limit exhausted? Connection limit is 20 in
  `apps/server/db.ts`; pump it via env if more capacity needed.
- Slow queries piling up? `SHOW PROCESSLIST` + kill long-runners.
- Lock wait timeouts? Find the holder of the lock and decide
  (kill the holder, or wait if it's a critical write).

### Sentry shows a flood of `INTERNAL_SERVER_ERROR`

- Group by tRPC path. Find the top offender. Most likely:
  - A new mutation deployed without a migration.
  - A data shape changed and an old payload still in flight.
- Tactical fix: revert the deploy. Strategic fix: ship the
  migration / coercer.

### Stripe webhook errors

- Stripe retries 5xx responses. The handler is idempotent via
  `processed_webhook_events` (event-level) and the unique index
  on `storePurchases.stripePaymentIntentId` (payment-intent
  level). A 500 spike means a downstream handler is throwing —
  fix root cause; replays will re-fulfill.

### Suspected security incident

- DO NOT redeploy. Capture state.
- Snapshot `users`, `storePurchases`, recent admin audit log.
- Revoke any exposed credential immediately:
  - JWT_SECRET — invalidates all sessions; users will re-login.
  - Stripe keys — rotate in dashboard.
  - OAuth client secrets — rotate per provider.
- Notify users only after the breach window is closed and you
  understand the impact.

## Post-incident

Within 48 hours, write a post-mortem in
`docs/operations/postmortems/YYYY-MM-DD-short-name.md` with:

- **Timeline** (UTC, minute granularity).
- **Impact** (which users, for how long, what they couldn't do).
- **Root cause** (the actual technical cause, not "human error").
- **What we'd change** (process and code).

Post-mortems are blameless. The goal is to make the system safer,
not to assign fault.
