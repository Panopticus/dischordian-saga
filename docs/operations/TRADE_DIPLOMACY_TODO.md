# Trade Empire — diplomacy price modifier (re-enable)

## Why this doc exists

`apps/server/routers/tradeWars.ts:performTrade` previously accepted
`input.factionReputation` from the client and used it directly to
compute up to a 15% price discount. A malicious client could send
`{ empire: 99999 }` and pay 15% less on every trade.

In G11 (security pass) we **disabled the diplomacy modifier**. The
input field is still accepted (back-compat with old clients) but
ignored.

## What needs to land before re-enabling

1. **Server-side faction reputation source.** Likely candidates:
   - Aggregate per-faction sums from `trade_sector_reputation`
     (sector × faction mapping in `tradeSectors`).
   - A new table `user_faction_reputation` with one row per
     (userId, factionKey).
   - A field on `tradeEmpirePlayerState` for the four faction
     totals.
2. **Bounded math.** Cap server-computed reputation values to a
   sane range (-1000..+1000) so even a corrupted state can't yield
   absurd discounts.
3. **Mutation events.** Wherever the player makes a diplomacy
   choice (mission outcomes, sector control, trade contracts,
   conspiracy boards), the relevant faction values should adjust.
4. **Decay.** Reputation should bleed back toward 0 over time so a
   one-time max-out doesn't grant permanent discounts.

## Re-enable steps

1. Implement the source above.
2. Replace the disabled block in `performTrade` with a server-side
   `await getFactionReputation(ctx.user.id)` call.
3. Apply the same discount math, but with the server values.
4. Drop the `factionReputation` input field entirely from the Zod
   schema (breaking change — coordinate with client to remove the
   call site at the same release).
5. Update CHANGELOG with a "diplomacy modifier re-enabled" line.

## Acceptance test

A test that exercises the trade endpoint with a deliberately
spoofed `factionReputation: { empire: 99999 }` body and asserts
that the executed trade price is **identical** to a trade with no
factionReputation. Once the re-enable lands, replace this test
with one that asserts server-derived reputation is used.
