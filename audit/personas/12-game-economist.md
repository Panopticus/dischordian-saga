# Game Economist — Audit

## Top 6 findings

### F1: Casino slots & roulette have negative house edge (player edge)
- file: /home/user/dischordian-saga/apps/shared/casinoGames.ts:63-83 (slots), 186-197 (roulette)
- severity: critical
- category: casino_house_edge
- exploit/risk: Sustained Dream farming. RTP > 1.0 means the casino is a money printer. Combined with VIP `vipWinBonus` multiplier in casino.ts:355 and 2% jackpot rake, whales gain an even larger positive EV.
- finding: Slot EV per 1-Dream bet (3 reels × 6 symbols, payouts: degen-triple 50x, other-triple 5x, void-triple 0, two-same 2x): (1/216)*50 + (5/216)*5 + (90/216)*2 = 255/216 ≈ **1.18 RTP (–18% house edge)**. Quantum Roulette "adjacent" with 3 factions (multiplier 2.5x, P=0.5) returns 1.25× bet — **+25% player edge**. Quantum Roulette "half" with 3 factions (1.8x, P=0.5) returns 0.9× — only 10% edge, far below intended 8%-target seen elsewhere in code (see `computeFactionWarOdds` comment).
- fix: Drop slot triple-2x to 1.5x or shrink twoSame probability surface; cap roulette adjacent multiplier at 1.7x (3-faction) / quarter at 2.2x (2-faction). Add a parity test in `casinoGames.test.ts` asserting RTP ≤ 0.92 across the bet space.

### F2: `battlePass.addXp` accepts client-asserted XP
- file: /home/user/dischordian-saga/apps/server/routers/battlePass.ts:75-160
- severity: high
- category: battlepass_curve
- exploit/risk: A rooted/MITM client can post `{ xp: 10000 }` repeatedly. With no per-window rate limit on this `protectedProcedure`, a player can max-tier the premium track in seconds. They get every premium reward (cosmetics, dream, card packs, eidolon accessories) for free — directly hits VC pass-skip revenue and bypasses the 60-day SEASON_LENGTH grind.
- finding: `addXp` validates only `z.number().min(1).max(10000)` and writes `currentXp = currentXp + finalXp`. No `procedureRateLimit`, no source attestation. The sibling `addXpFromAction` *does* the right thing (server-side `getXpSource` gate); `addXp` is the loophole.
- fix: Either delete `addXp` entirely (force all calls through `addXpFromAction`) or reduce max to e.g. 200 and add `procedureRateLimit({ windowMs: 60_000, max: 5 })`. The total pass is 15,750 XP — current cap allows finishing in two calls.

### F3: `iapReceipt.verify` returns success without recording fulfillment
- file: /home/user/dischordian-saga/apps/server/routers/iapReceipt.ts:54-119
- severity: critical
- category: receipt_replay
- exploit/risk: (a) Same RevenueCat receipt can be replayed indefinitely — no row written keyed on `transactionId`, so the docstring's "Idempotent on (userId, platform, transactionId)" is aspirational. The route returns `{ ok: true }` after RC validates, but never inserts into `storePurchases` and never calls `fulfillPurchase`. iOS/Android purchasers may receive nothing and contact support, OR (worse) the client trusts the `ok: true` and grants locally.
- finding: Lines 108-118 contain a literal comment "Fulfillment is intentionally minimal here". The function returns success without DB writes. Webhook-based fulfillment exists for Stripe (good — see `_core/index.ts:96` `processedWebhookEvents` table), but no equivalent for RevenueCat.
- fix: Wire `fulfillPurchase()` from store.ts into this route, using a `fulfillmentId` of `${platform}:${transactionId}`. Add a unique index on a `nativeTransactionId` column in `storePurchases` (or extend `purchaseGrants.fulfillmentId`). Until wired, gate the route behind a feature flag.

### F4: Pack-opening (Dream-funded) lacks transactional atomicity → refund race
- file: /home/user/dischordian-saga/apps/server/routers/cardGame.ts:1737-1830 (demon packs)
- severity: high
- category: pack_ev
- exploit/risk: Concurrent `purchasePack` calls can both pass the balance check (line 1744), each deduct Dream, and a server crash between deduct (1749) and `userCards` insert (1814) leaves the player paid but cardless. The "refund if no demon cards" branch (1758-1762) is itself non-atomic: a concurrent admin disable of demon cards plus a crash mid-refund burns Dream silently.
- finding: No `db.transaction()` wraps the deduct + grant. Compounded by `Math.random()` (non-seeded) for rarity rolls — disputes can't be reproduced. Compare with store.ts `purchaseWithDream` (lines 173-208), which does it correctly with a conditional UPDATE + transaction.
- fix: Mirror the store.ts pattern: wrap in `db.transaction`, use `UPDATE ... WHERE dream_tokens >= cost`, switch to `createRng(seed)` from `engine/rng` for replayability.

### F5: Auction `placeBid` has TOCTOU + non-atomic escrow swap
- file: /home/user/dischordian-saga/apps/server/routers/marketplace.ts:686-745
- severity: high
- category: auction
- exploit/risk: (1) Sniping: `endsAt` checked at line 696, but lines 707-737 (escrow new bid → refund old → update auction → record bid) are 4 separate writes. Two bids arriving in the final ms can both pass the time check. (2) Lost-update on `currentBid` — the UPDATE at line 728-730 has no `WHERE currentBid = ${oldValue}` guard, so a higher concurrent bid silently overwrites. (3) If the server crashes between line 710 (deduct) and line 714 (refund prior bidder), funds vanish.
- finding: No transaction wrap. No anti-snipe extension (most auction houses bump `endsAt` if a bid lands in the last 60s). Escrow column on auction would replace per-write balance ping-pong.
- fix: Wrap in `db.transaction`. Add `AND currentBid < ${input.bidAmount}` to the auction UPDATE; on 0 affected rows throw "outbid in flight". Add `endsAt = GREATEST(endsAt, NOW() + 60s)` for last-minute bids.

### F6: `dream_balance.gems` shared by Dream-purchase + Stripe VC + casino → arbitrage potential via `currencyExchange`
- file: /home/user/dischordian-saga/apps/server/routers/marketplace.ts:792-831 (`createExchangeOrder`)
- severity: medium
- category: currency_arbitrage
- exploit/risk: Player-set Dream↔Credits exchange rates with no floor/ceiling. Two colluding accounts can post wildly off-market orders to launder Dream into Credits (or vice versa) at favorable rates, then use Credits to buy listings priced cheap in Credits but expensive in Dream — effectively converting hard-currency-derived Dream into a non-tracked currency (twPlayerState.credits) used for gameplay advantage.
- finding: Exchange validation at line 802 only blocks same-currency. No bid-ask spread enforcement, no reference rate, no cap on `buyAmount/sellAmount` ratio. `marketListings` accept `priceCredits` up to 9_999_999 (line 133) — no Dream-equivalent cap. Combined with Void Crystals being a 4th currency on the same `dream_balance` row, every cross-currency conversion is a potential laundering hop.
- fix: Add a server-set reference rate band (e.g. `0.5 ≤ rate ≤ 2.0` versus rolling 7-day median). Reject exchange orders outside the band. Track the path Dream→Credits→Listing→Dream and clamp via a marketplace velocity meter.

## Currency map

Five currencies, all live on `dream_balance` row except credits:

| Currency | Source | Sink | Notes |
|---|---|---|---|
| Dream Tokens | Quests, casino wins, Stripe `dream_*` SKUs, marketplace sales, exchange | Pack purchase, casino bets, marketplace listings, battle pass premium (500 Dream alt) | Primary soft currency. Tradable. Stripe-acquireable. |
| Soul Bound Dream | Stripe `dream_vault`, marketplace consumables | Same surfaces as Dream where allowed | Untradable variant; prevents whale-account-funneling. |
| Void Crystals (`gems`) | Stripe vc_pack_* SKUs ($1.99–$49.99 → 100–5000 VC), Founders/Authors bundles | Cosmetics, boosters, Battle Pass Premium (1000 VC) | Premium currency. Pyramid pricing 50→100 VC/$. NOT marketplace-tradable. |
| Credits (`twPlayerState.credits`) | Trade Wars gameplay, marketplace, currency exchange | Marketplace listings | Soft gameplay currency. NO Stripe path. |
| DNA Code | (separate dnaCode column, sparsely referenced) | Niche unlocks | Appears unused in store.ts. |
| Soul Stones (disenchant) | Card disenchant (5/10/20/100/400 by rarity) | Craft cost (20/40/100/400/1600) | 4:1 disenchant:craft ratio is industry-standard. |

Five currencies is one over the typical "≤3 = healthy" rule of thumb. Mitigated by clear separation (Dream=grind, VC=premium, Credits=trade-empire). Founders pricing per-VC ($49 / 4500 VC = ~92 VC/$) is below the headline `vc_pack_titanic` ($49.99 / 5000 VC = 100 VC/$) — Founders looks worse-value on raw VC but bundles entitlements, which is fine.

## Convergence hints

- **Stripe webhook idempotency is solid** — `_core/index.ts:51-208` has dual-layer protection (`processedWebhookEvents` table + `storePurchases.stripePaymentIntentId` unique index). Bootstrap fallback in `webhookEventsBootstrap.ts` keeps it working through migration drift.
- **Pack EV (shared/tcg-core/economy/packs.ts spec)** — at C=65/U=20/R=10/E=4/L=1 with disenchant 5/10/20/100/400, expected disenchant per pack = 5 slots × 15.25 = 76.25; standard pack cost 100 Dream → ~24% effective rake before pity timer, well-tuned.
- **F2P-to-completion estimate** — daily-cap XP sources sum to ≈ 50*3+10*20+15*5+25*3+30*1 = 530 XP/day from XP_SOURCES. TOTAL_PASS_XP = 15,750. **30 days at zero spend** to finish the free track in a 60-day season — comfortable. No cards are VC-only: Founders/Authors entitlement-gated cards are real-money exclusive but lore-flagged as patron-tier (acceptable). Battle Pass Premium has a Dream alt (500 Dream) — F2P-friendly.
- **No regional pricing** — all SKUs are USD-denominated (`priceUsd: 99` cents). Stripe Auto-Tax is enabled (good for VAT), but no purchasing-power-parity tier; this materially hurts emerging-market conversion.
- **No marketplace/auction transactions** — auctions, exchanges, and demon-pack opens all need `db.transaction` wraps per DB-persona's tracked-12. The economic exploits I named (F4, F5, F6) are direct consequences.
- Marketplace tax is flat 5% (`TAX_RATE` line 76); 20% of that goes to seller's guild treasury (line 105) — fine.
- The casino's 8% house-edge intent (computeFactionWarOdds comment at marketplace.ts:241) does not match the actual implementations in slots/roulette (F1).
