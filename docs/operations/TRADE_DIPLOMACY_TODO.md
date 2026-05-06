# Trade Empire — diplomacy price modifier (re-enabled)

## Status — RE-ENABLED with a server-derived source

`apps/server/routers/tradeWars.ts:trade` originally accepted
`input.factionReputation` from the client and used it directly to
compute up to a 15% price discount. A malicious client could send
`{ empire: 99999 }` and pay 15% less on every trade.

In G11 (security pass) the modifier was **disabled**. The
client-supplied input field was kept for back-compat but ignored.

The modifier is now back, sourced server-side. The wire field is
still ignored — dropping it from the Zod schema is the only step
intentionally deferred (breaking change for old clients; coordinate
with a client release).

## How it works now

- **Source.** `userProgress.gameData.factionReputation`
  (`Record<factionKey, number>`). Already mutated by
  `apps/server/routers/tradeContracts.ts` when contract effects of
  kind `faction_reputation_delta` fire, so the data path was
  already populated.
- **Lookup key.** The player's home faction
  (`tw_player_state.faction`, one of `"empire" | "insurgency"`).
  Server-derived; cannot be spoofed.
- **Bounds.** `factionReputationService.boundReputation` clamps to
  ±`REP_BOUND` (1000). A corrupted state caps at the same ceiling
  as a legitimate one — no escalation.
- **Math.** `computeTradePriceMultiplier(rep) = 1 - (rep / REP_BOUND) * 0.15`,
  yielding `[0.85, 1.15]`. Positive reputation cheapens prices,
  negative reputation marks them up.
- **Decay.** `runFactionReputationDecayTick` runs hourly via the
  cron driver in `apps/server/_core/index.ts`. Bleeds every
  non-zero reputation toward 0 by 1 unit per tick (rep=1000 fully
  decays in ~42 days). Ensures a one-time max-out doesn't grant a
  permanent discount.

## Files

- `apps/server/services/factionReputationService.ts` — the source +
  helpers + decay tick.
- `apps/server/services/factionReputationService.test.ts` —
  unit coverage on the pure-math helpers + no-DB graceful fallback.
- `apps/server/routers/tradeWars.ts` — the re-enabled call site
  (replaces the old `// DIPLOMACY PRICE MODIFIERS — DISABLED` block).
- `apps/server/_core/index.ts` — wires the hourly decay tick.

## Deferred (still owed)

- **Drop `factionReputation` from the Zod input schema.** Breaking
  change for clients that still send the field. Plan: coordinate
  with a client release that stops sending it, then remove the
  field on the next minor server release.
- **Acceptance test against the live trade endpoint.** Currently
  the spoof guarantee is enforced by `clamp(rep)` returning the
  same multiplier for `{ empire: 99999 }` as for
  `{ empire: 1000 }` (covered in
  `factionReputationService.test.ts`). A round-trip test that
  POSTs to the trade endpoint and asserts price equality lands
  alongside an integration harness for the trade routers.
