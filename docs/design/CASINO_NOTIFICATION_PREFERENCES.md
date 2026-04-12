# Casino Notification Preferences

## Overview

Players who participate in the Degen's Casino and the Christmas in July
event can receive two distinct kinds of system notifications:

1. **Jackpot claim broadcasts** — fired when any player claims the
   progressive jackpot pool via `casino.claimJackpot`.
2. **Community milestone broadcasts** — fired during Christmas in July
   when the global gift count crosses a tier threshold in
   `CHRISTMAS_MILESTONES`.

Both are fan-out notifications that land in the in-game inbox of every
casino participant. Heavy-notification users can opt out of either
stream independently.

## Opt-out flags

Both flags live on the `casino_state` row:

| Column | Type | Default | Governs |
|--------|------|---------|---------|
| `jackpotBroadcastOptOut` | `boolean` | `false` | Jackpot claim broadcasts |
| `milestoneBroadcastOptOut` | `boolean` | `false` | Christmas milestone broadcasts |

They are **independent** — a player can keep jackpot notifications
while muting milestones, or vice versa. Neither flag affects:

- Personal gift notifications (gifts sent **to** the player).
- Achievement unlock toasts.
- Strain's first-Christmas cutscene trigger.
- Daily challenge claim confirmations.
- Admin rate-limit alert notifications.

## History

- **Initial release** (migration `0046_casino_notification_preferences.sql`,
  PR #28): added `jackpotBroadcastOptOut`. At this point the single flag
  controlled both jackpot broadcasts and Christmas milestone broadcasts
  — a design choice reflected in PR #29's toggle copy.
- **Split release** (migration `0047_casino_milestone_opt_out.sql`,
  PR #30): added `milestoneBroadcastOptOut` as a separate column so
  users who want to mute milestones without losing jackpot notifications
  can do so. Existing users keep their `jackpotBroadcastOptOut` value;
  `milestoneBroadcastOptOut` defaults to `false`.

## User-facing preference UI

The two toggles live on `/casino/leaderboard` directly beneath the
progressive jackpot pool card:

- **"Mute jackpot claim broadcasts"** → toggles `jackpotBroadcastOptOut`
  via `casino.setJackpotBroadcastOptOut`.
- **"Mute Christmas in July milestone broadcasts"** → toggles
  `milestoneBroadcastOptOut` via `casino.setMilestoneBroadcastOptOut`.

Both toggles show a toast confirmation on success.

## Server behaviour

### Jackpot broadcast filter

`casino.claimJackpot` fans out a `notifications` row to every participant
with a `casino_state` row where `jackpotBroadcastOptOut = false`.

### Milestone broadcast filter

`christmasInJuly.broadcastMilestone` left-joins `casino_state` on every
`xmas_july_progress` row and filters by `milestoneBroadcastOptOut = false`.

Both filters are applied inside the same transaction as the triggering
mutation, so a player who opts out between the start of a claim and
the broadcast will be excluded from that same claim's fanout.

## Migration notes for existing users

When `0047` runs against a production database, every existing
`casino_state` row gets `milestoneBroadcastOptOut = false` by default —
users who had previously muted broadcasts entirely (via the single flag)
will start receiving milestone broadcasts again until they re-toggle
the new control. This is the intended behaviour: the split lets users
re-opt-in to the stream they actually want without any flag
preservation heuristics to get wrong.

A simple release-notes line suffices:

> **Casino notification preferences are now split.** You can now mute
> jackpot claim broadcasts and Christmas in July milestone broadcasts
> independently. If you previously opted out of all casino broadcasts,
> check `/casino/leaderboard` → Notification preferences after the
> update and re-apply the toggles you want.

## Related

- Migration `0046_casino_notification_preferences.sql`
- Migration `0047_casino_milestone_opt_out.sql`
- `apps/server/routers/casino.ts` — `setJackpotBroadcastOptOut`,
  `setMilestoneBroadcastOptOut`, broadcast filter.
- `apps/server/routers/christmasInJuly.ts` — `broadcastMilestone` filter.
- `apps/client/src/game/CasinoLeaderboardPage.tsx` — UI toggles.
