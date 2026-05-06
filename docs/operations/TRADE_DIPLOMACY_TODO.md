# Trade Empire — diplomacy price modifier (re-enabled)

## Status — RE-ENABLED with a server-derived source

`apps/server/routers/tradeWars.ts:trade` originally accepted
`input.factionReputation` from the client and used it directly to
compute up to a 15% price discount. A malicious client could send
`{ empire: 99999 }` and pay 15% less on every trade.

In G11 (security pass) the modifier was **disabled**. The
client-supplied input field was kept for back-compat but ignored.

The modifier is now back, sourced server-side. The legacy
`factionReputation` Zod input field has been removed; old clients
that still send it are unaffected because Zod's default strip-mode
silently discards unknown wire keys.

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

_None — the original deferred items have all landed:_

- ~~**Drop `factionReputation` from the Zod input schema.**~~ Done.
  The field is gone from `tradeWars.ts:trade`. Client call sites
  in `apps/client/src/pages/TradeWarsPage.tsx` were updated in the
  same commit to stop sending it. Old clients that still send the
  field continue to work via Zod strip-mode.
- ~~**Acceptance test against the live trade endpoint.**~~ Done.
  `apps/server/tradeWars.test.ts:trade` carries an
  `it("ignores client-supplied factionReputation (spoof guarantee)")`
  block: two trades with identical `(commodity, action, quantity)`
  — one carrying a max-spoof `factionReputation` map, one carrying
  nothing — must yield identical post-trade messages (same
  `totalCost`). DB-gated alongside the rest of `tradeWars.test.ts`.
  The unit-level math gate in
  `apps/server/services/factionReputationService.test.ts` remains
  as the no-DB no-skip belt to the integration test's suspenders.
