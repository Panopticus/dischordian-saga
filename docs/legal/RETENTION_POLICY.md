# Data retention policy

Required by GDPR Art. 5(1)(e) — data must not be kept "longer than
necessary." This document sets the windows and the deletion
mechanisms that enforce them.

## Windows

| Data class | Retention | Deletion mechanism |
|------------|-----------|--------------------|
| Account row (`users`) — active | While the user is active + 30-day grace after deletion request | `account.deleteMyAccount` mutation + hourly hard-delete sweep (`retentionService.runAccountCleanupTick`) |
| Account row — soft-deleted | 30 days | Hourly cron sweeps `deletedAt < NOW() - 30 days` |
| Game progress (`user_progress`, `user_cards`, etc.) | While account is active; deleted with account | `userProgress` cleared in the cleanup sweep; other tables become orphaned-but-PII-free since `name`/`email` were nulled at soft-delete |
| Financial records (`storePurchases`) | 7 years | Required for tax/accounting law; we keep purchase rows but anonymise the user fields after account deletion |
| Chat messages | 90 days from send | Hourly sweep of `guild_chat` older than 90 days (`retentionService.runChatMessagePurgeTick`) |
| Moderation reports | 2 years | Long horizon required for repeat-offender pattern detection |
| Analytics events | 24 months | Hourly sweep deletes `analytics_events` older than 24 months (`retentionService.runAnalyticsPurgeTick`); no PII in events anyway, only pseudonymous user IDs |
| Server logs (Sentry, OTel) | 90 days | Set in Sentry / OTel backend |
| Backups (MySQL snapshots, Railway-managed) | 30 days | Railway's default; verify in dashboard |

## Cron jobs

Implemented in `apps/server/services/retentionService.ts`. The
hourly tick is wired in `apps/server/_core/index.ts` alongside the
other in-process cron drivers (Living Universe, Mystery Engine,
Guild Quests). Hourly cadence is fine for daily / monthly windows
because each sweep is idempotent and date-bounded.

- `runAccountCleanupTick` — for users with
  `deletedAt < NOW() - 30 days`:
    1. Insert an `admin_audit_log` row (`action =
       retention.account_hard_delete`, `adminId = 0`) for the
       compliance trail.
    2. Delete the user's `userProgress` row.
    3. Hard-delete the `users` row.
  Other user-attributed tables become orphaned (no FK cascade on
  `users.id`), but they're already PII-free because the
  user-facing soft-delete mutation nulls `users.name` and
  `users.email` immediately.
- `runChatMessagePurgeTick` — deletes `guild_chat` rows whose
  `createdAt` is older than 90 days.
- `runAnalyticsPurgeTick` — deletes `analytics_events` rows whose
  `createdAt` is older than 24 months (computed as 30 × 24 days).

## User-initiated deletion

Users can self-serve via Settings → Account → Delete. The
`account.deleteMyAccount` mutation:

1. Nulls `users.name` and `users.email` immediately (the user
   stops being identifiable from this row).
2. Sets `users.deletedAt = NOW()`.
3. Deletes `user_progress` immediately so the in-game state
   disappears from their next session.
4. Returns `{ ok: true }` so the client can show the confirmation.

The 30-day grace lets users recover from accidental deletion by
contacting support; after that, the cron sweeps everything.

## Right to access

Users can self-serve via `account.exportMyData`. The export
includes every row in every user-attributed table at the time of
the request. Delivered as JSON.
