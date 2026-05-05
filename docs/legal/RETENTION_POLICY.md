# Data retention policy

Required by GDPR Art. 5(1)(e) — data must not be kept "longer than
necessary." This document sets the windows and the deletion
mechanisms that enforce them.

## Windows

| Data class | Retention | Deletion mechanism |
|------------|-----------|--------------------|
| Account row (`users`) — active | While the user is active + 30-day grace after deletion request | `account.deleteMyAccount` mutation + nightly hard-delete cron (TODO) |
| Account row — soft-deleted | 30 days | Nightly cron sweeps `deletedAt < NOW() - 30 days` (TODO) |
| Game progress (`user_progress`, `user_cards`, etc.) | While account is active; deleted with account | Foreign-key cascade or explicit cleanup in the cron |
| Financial records (`storePurchases`) | 7 years | Required for tax/accounting law; we keep purchase rows but anonymise the user fields after account deletion |
| Chat messages | 90 days from send | Daily cleanup job (TODO) |
| Moderation reports | 2 years | Long horizon required for repeat-offender pattern detection |
| Analytics events | 24 months | Monthly cleanup; no PII in events anyway, only pseudonymous user IDs |
| Server logs (Sentry, OTel) | 90 days | Set in Sentry / OTel backend |
| Backups (MySQL snapshots, Railway-managed) | 30 days | Railway's default; verify in dashboard |

## Cron jobs (to be implemented)

- `account-cleanup` — runs daily 03:00 UTC. For users with
  `deletedAt < NOW() - 30 days`:
    1. Delete dependent rows (chat, analytics, gameplay tables).
    2. Hard-delete the `users` row.
    3. Log the action to `adminAuditLog` for compliance audit trail.
- `chat-message-purge` — runs daily 03:30 UTC. Deletes
  `chat_messages` older than 90 days.
- `analytics-purge` — runs monthly. Deletes `analytics_events`
  older than 24 months.

These jobs are **not yet wired**. Until they are, retention
windows are aspirational. Track in `docs/operations/cron-jobs.md`
once the scheduler lands.

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
