# Balance & Economy — Audit

## Persona briefing

I'm a systems/balance designer and live-ops economist. I've shipped seasonal
economies for live card games and run the spreadsheets that decide whether a
currency inflates into worthlessness or starves players into a paywall. My lens
is **whole-game meta health + the closed-loop economy** — not card-text clarity
(covered in `07_tcg_player.md`) and not the casino's internal RTP math (covered
in `05_gambling_enthusiast.md`). I care about exactly three questions:

1. Can an on-track player clear the PvE spine without hitting a wall they can't
   gear out of?
2. Is the card pool flat enough that deck diversity survives contact with the
   meta, or is there an auto-include / infinite-loop that solves the game?
3. Does every currency have a faucet *and* a sink in proportion — and can any
   actor mint currency faster than the sinks can drain it (inflation, RMT,
   exploit) or is any currency a starvation gate behind a purchase?

I read source. Where I could not finish the math without a live simulation I
say so explicitly ("suspected").

## Files/data audited

**Card balance / meta**
- `apps/shared/tcg-core/balance/statCurve.ts` (STAT_CURVE, KEYWORD_TAX, tolerances)
- `apps/shared/tcg-core/economy/packs.ts` (rarity table, pity, soul-stone values)

**Difficulty curve (Acts 1–7)**
- `docs/narrative-audit/PLAYTHROUGH_WALKTHROUGH_2026-05.md` §Act1–§Act7, §gaps
- `docs/narrative-audit/GAME_PROGRESSION_ANALYSIS_2026-05.md` (vote/episode pacing)
- `apps/shared/act1Opponents.ts`, `apps/shared/bossMastery.ts`
- `apps/shared/tcg-core/story/encounter.ts` (`computeBossDifficultyBonuses`)

**Reward-to-effort + the meta-economy**
- `apps/server/routers/dailyQuests.ts` (daily/weekly/epoch templates, login calendar)
- `apps/shared/battlePassConfig.ts` + `apps/server/routers/battlePass.ts`
- `apps/server/routers/store.ts` + `apps/server/products.ts`
- `apps/server/routers/marketplace.ts` (listings, tax pool, currency exchange)
- `apps/server/routers/casino.ts` + `apps/shared/casinoGames.ts` (faucet check only)
- `apps/server/routers/prestige.ts`, `prestigeQuests.ts`, `masteryTree.ts`, `techTree.ts`
- `pnpm ship:check` (economy-relevant rows)

## Findings

### 1. Daily-quest progress is client-reported with no cap and no event proof — P0
- **Where:** `apps/server/routers/dailyQuests.ts:405-475` (`updateProgress`),
  input schema line 407-409: `increment: z.number().min(1).default(1)`.
- **Numbers/mechanic:** `updateProgress` is a `protectedProcedure` callable
  directly by the client. There is **no `.max()`** on `increment` and **no
  server-side verification that the underlying game event happened** — the only
  server caller in the codebase is the procedure definition itself
  (`grep` for `updateProgress` across `apps/server` returns only line 405).
  A client posts `updateProgress({ questId: "d_win_3_fights", increment: 3 })`
  without playing a single fight, then `claimReward` (line 478). `claimReward`
  only checks `currentCount >= targetCount` and `!claimed`. Reward then mints
  Dream into `dreamBalance` (line 534-549), Credits into `characterSheets`,
  battle-pass XP (line 471), class XP, civil XP, and suit materials.
- **Why it breaks the economy:** This is an unbounded faucet for the entire
  reward economy. The epoch templates pay up to `rewardDream: 300`
  (`e_pvp_champion`, line 104) / `rewardCredits: 50000` (`e_trade_500k`,
  line 99) per claim. A scripted client drains every daily/weekly/epoch quest
  per period for ~1,000+ Dream + ~85,000 Credits with zero gameplay, repeatable
  every reset. Dream is hard-currency-equivalent (Finding 7): $5.99 = 500 Dream.
  This trivially breaks the game's currency integrity.
- **real?:** confirmed-read-source. The schema, the missing cap, and the
  absence of any server-side event emitter are all directly read.

### 2. Battle-pass `addXpFromAction` ignores its own daily caps — unbounded pass XP — P1
- **Where:** `apps/server/routers/battlePass.ts:172-233` (`addXpFromAction`);
  caps declared but unused in `apps/shared/battlePassConfig.ts:86-104`.
- **Numbers/mechanic:** `XP_SOURCES` declares `dailyCap` per source
  (`combat_win` xp:10 cap:20, `daily_quest` xp:50 cap:3, `prestige_cycle`
  xp:500, etc.). `addXpFromAction` looks the source up via `getXpSource`,
  applies prestige + event multipliers, and writes XP — but **never reads or
  enforces `dailyCap`**. There is no per-day counter table touched anywhere in
  the handler, and the procedure has **no `procedureRateLimit`** (contrast the
  sibling deprecated `addXp` at line 85-88, which was capped to 200 and
  rate-limited 5/min specifically because it was exploitable). Season pass is
  15,750 XP total (`battlePassConfig.ts:69`). At `combat_win` = 10 XP with no
  cap, ~1,575 unverified calls complete the entire 50-tier pass; with
  `prestige_cycle` (500 XP) it's ~32 calls.
- **Why it breaks the economy:** The premium track is cosmetic-only
  (`battlePassConfig.ts:15`) so this is not a power break, but it nullifies the
  60-day seasonal engagement loop and devalues the 500-Dream / 1000-VC premium
  purchase (anyone reaches max tier in minutes). Combined with Finding 1
  (`daily_quest` completion also awards pass XP at `dailyQuests.ts:471`) the
  pass has two independent unbounded faucets.
- **real?:** confirmed-read-source.

### 3. `battlePass.generateSeason` is a protectedProcedure with no admin guard — P1
- **Where:** `apps/server/routers/battlePass.ts:431-493`.
- **Numbers/mechanic:** The comment calls it "admin/automated" but the
  procedure is `protectedProcedure` (any logged-in user). It runs
  `UPDATE battlePassSeasons SET status='ended' WHERE status='active'`
  (line 455-457) then inserts a fresh season. Any player can end the live
  season and mint a new one on demand.
- **Why it breaks the economy/meta:** Live-ops griefing + reward reset for the
  whole playerbase; also a reroll lever to fish for a favorable seasonal theme.
  Not a personal-gain faucet, hence P1 not P0, but it's a global-state mutation
  on an unauthenticated-for-role surface.
- **real?:** confirmed-read-source (no `adminProcedure`, no role check in body).

### 4. Currency-exchange band lets soft Credits launder into hard-equivalent Dream — P1
- **Where:** `apps/server/routers/marketplace.ts:831-902` (`createExchangeOrder`),
  band defined line 852-853: `REFERENCE_DREAM_PER_CREDIT = 1`,
  `RATE_BAND_MULTIPLIER = 2` → accepted band `[0.5, 2.0]` Dream/Credit.
- **Numbers/mechanic:** The exchange treats Dream and Credits as ~1:1 with a
  2× band in both directions, i.e. you may legally post **1 Credit → 2 Dream**.
  But the two currencies are not peers: Credits are a bulk grind faucet — the
  login calendar alone pays 500–5,000 Credits/day (`dailyQuests.ts:249-278`),
  daily `d_earn_credits`/`w_trade_50k`/`e_trade_500k` pay 5,000 / 50,000 /
  500,000 Credits, and `d_complete_trade` pays `rewardCredits: 1000`
  (`dailyQuests.ts:45`). Dream is cash-equivalent: `products.ts:78-110` sells
  50 Dream for $0.99 and 500 Dream for $5.99 (≈ $0.012/Dream). A player who
  farms 100,000 Credits (a few days of trade quests, or one `e_trade_500k`
  claim) can post exchange orders converting them to ~50,000 Dream at the
  band edge — i.e. ~$600 of premium-currency-equivalent for free, fed into the
  battle-pass (500 Dream), packs (100 Dream), or the casino. Even at 1:1 the
  Credit faucet dwarfs any Dream sink, so the exchange is an inflation pipe;
  the 2:1 band makes it an arbitrage pipe.
- **Why it breaks the economy:** Destroys the hard/soft currency separation
  that the entire monetization model rests on. Orders only fill if a
  counterparty order exists (`tryMatchExchangeOrders`, line 1188+), so the
  ceiling depends on counterparty supply — full quantitative break needs a
  market-depth simulation — but the *band itself* is mispriced versus the
  faucet asymmetry, which is confirmed.
- **real?:** confirmed-read-source for the band + the faucet asymmetry;
  suspected-needs-simulation for the realized laundering throughput (depends
  on order-book liquidity).

### 5. Pity timer's `rollRarity(minRarity)` re-normalization skews toward legendary — P2
- **Where:** `apps/shared/tcg-core/economy/packs.ts:113-131`.
- **Numbers/mechanic:** Base cumulative table (line 48-54): legendary 0.01,
  epic 0.05, rare 0.15, uncommon 0.35, common 1.0. On a pity pull
  (`minRarity="rare"`), `thresholds` is filtered to
  `[legendary 0.01, epic 0.05, rare 0.15]`, then `maxCum = 0.15`,
  `adjusted = roll * 0.15`, and the loop returns the first `t` with
  `adjusted <= t.cumulative`. The cumulative values were **not recomputed**
  for the filtered set, so the implied conditional probabilities are
  legendary `0.01/0.15 ≈ 6.7%`, epic `(0.05-0.01)/0.15 ≈ 26.7%`,
  rare `66.6%`. A correct "rare or better" conditional from the base table is
  legendary `1/15 ≈ 6.7%`, epic `4/15 ≈ 26.7%`, rare `10/15 ≈ 66.6%` — so
  here the math actually happens to land correctly because the thresholds are
  already cumulative from the top. **However**, the non-pity path
  `rollRarity()` with the full table uses `adjusted = roll * 1.0` and the same
  first-match loop — that one is fine. The real defect is subtler: a
  *guaranteed-rare-or-better* pull still has a 6.7% legendary rate, identical
  to... nothing, because the base per-slot legendary rate is 1%. The pity
  card is ~6.7× more legendary-rich than a normal slot, which is generous but
  undocumented; the published odds (`packs.ts:9-16`) say "at least one Rare or
  better" and do not disclose the pity's internal distribution.
- **Why it matters:** Honesty/transparency of the gacha. Not a break, but the
  pity is materially more generous than advertised and players cannot audit it
  (no in-client odds surface). Pity triggers at "every 5th pack"
  (`packsSinceLastRare >= 4`, line 85) which is honest and shallow — good.
- **real?:** confirmed-read-source for the distribution; the "is it disclosed
  anywhere in-client" claim is suspected (no client odds surface found, not
  exhaustively searched).

### 6. KEYWORD_TAX = 0 + wide high-cost tolerances → no curve enforcement on bombs — P2
- **Where:** `apps/shared/tcg-core/balance/statCurve.ts:29` (`KEYWORD_TAX=0`),
  `:49-60` (STAT_CURVE), `:62-66` (`getExpectedStats`).
- **Numbers/mechanic:** `getExpectedStats = expectedTotalStats - keywordCount*0`
  → keyword count is **free**; a card pays nothing on the stat budget for
  carrying 5 keywords. Tolerance at cost 7-9 is 0.30 on an expected 17–23, i.e.
  a cost-7 card may legally ship at `17 ± 5.1` total stats *and* arbitrary
  keyword load *and* arbitrary ability text (the stat budget never models
  ability impact at all — only raw power+health). The ratchet
  `cardStatBudgetCoverage` only flags cards outside the *stat* window; a
  20-stat, 5-keyword, deal-10-AoE cost-7 is "in budget." This is the classic
  recipe for an auto-include bomb: the curve cannot see the thing that makes a
  card dominant (its ability), only its body.
- **Why it matters for the meta:** Deck diversity dies to whatever the
  strongest *ability* at each cost is, because the only governor (stat budget)
  is blind to abilities and keyword stacking is untaxed. I could not enumerate
  the actual dominant card without a registry-wide ability-power pass + win-rate
  sim, so I am not asserting a specific broken card — but the *guardrail is
  structurally incapable of catching one*, which is the finding.
- **real?:** confirmed-read-source for the formula blindness;
  suspected-needs-simulation for "which specific card/combo is dominant."

### 7. Store SKU parity across web/iOS/Android is claimed under ship:check but not gated — P2
- **Where:** `pnpm ship:check` output (run 2026-05-16): the only
  economy rows are `Economic surfaces are transactional 13/13 PASS` and
  `Per-procedure rate limits 5/5 PASS`. `CLAUDE.md` line 145 explicitly lists
  "store SKU coverage across web+iOS+Android" as landing under the gate.
  `apps/shared/_completeness/registry.ts:214-227` contains
  `economic_transaction_coverage` and `procedure_rate_limits` but **no SKU
  parity check**. `apps/server/products.ts` defines `priceUsd`/`priceDream`/
  `priceCredits`/`priceVoidCrystals` per product with no per-platform SKU
  mapping or parity assertion; iOS/Android receipt validation lives in
  `iapReceipt.ts` but nothing cross-checks the catalogs.
- **Why it matters economically:** Price/SKU drift between platforms (a bundle
  priced $4.99 web / mispriced or missing on iOS) is a revenue leak and a
  store-policy risk, and the project's own definition-of-shipped says this is
  supposed to be mechanically verified. It is "tracked, not shipped."
- **real?:** confirmed-read-source (ship:check run + registry + CLAUDE.md).

### 8. Difficulty curve Acts 1–7 has no power wall — but no curve either (flat) — P3
- **Where:** `docs/narrative-audit/PLAYTHROUGH_WALKTHROUGH_2026-05.md:423-686`;
  `apps/shared/act1Opponents.ts:60-256`;
  `apps/shared/tcg-core/story/encounter.ts:187-199`.
- **Numbers/mechanic:** The PvE spine is gated by **flag AND-gates**, not by
  combat power thresholds. Act 1 = win 12 ladder battles (battle 11 is a
  *scripted mandatory loss*, not a wall — `walkthrough:451`) + resolve the
  §5.8 trial (resolves either way: `overturn` *or* `sentence_passed` both set
  `act1_authority_outcome` and advance — `walkthrough:482-485`) + pick
  Light/Dark. Acts 2–7 are 2–4 sub-flag AND-gates fired by winning *a* ladder
  battle / completing recruitment missions — no recommended-level check, no
  enemy stat scaling. `act1Opponents.ts` entries carry **no power/health/AI
  fields at all** (only `deckLeaning` flavor). The only difficulty lever is
  `computeBossDifficultyBonuses` which is hard-clamped to **+10 general HP and
  +2 starting cards max** (`encounter.ts:196-197`) — structurally incapable of
  producing an unbeatable encounter. So: **no cliff, no wall** (good — no P0
  progression block), but also **no ramp** — the curve is flat narrative
  gating. Risk is the inverse of a wall: trivialization / no challenge growth
  Acts 2–7, which is a tuning/engagement concern, not a break.
- **Why it matters:** The persona brief asked specifically whether an on-track
  player can be walled off the main path. Answer: **no, confirmed** — every
  gate either resolves both ways or is a scripted loss. The flatness is a P3
  engagement note, not a balance break. (The real Act-3 blocker is content,
  not balance: `walkthrough:867` — the Trade Empire infiltration mission-loop
  runtime is unbuilt, so the Act 3 path-lock "cannot fire via gameplay." That
  is a P0 *progression* bug but it's a missing-runtime issue already owned by
  the playthrough audit, not an economy/balance finding — flagged here only
  for cross-reference.)
- **real?:** confirmed-read-source.

### 9. Boss-mastery and login calendar are bounded Dream faucets (healthy) — informational
- **Where:** `apps/shared/bossMastery.ts:23-163`;
  `apps/server/routers/dailyQuests.ts:248-279`.
- **Numbers/mechanic:** Boss mastery pays Dream only at level-2 of each boss
  (20–30 Dream) and is **kill-count gated with a hard max level** (50 kills →
  no further Dream), so it is a one-time ~100–150 Dream onboarding faucet, not
  a renewable farm. The 30-day login calendar pays a bounded
  3–150 Dream/day on a fixed cycle (`streakToCycleDay` modulo 30) with a
  server-authoritative once-per-UTC-day claim (`claimLogin`, line 679 rejects
  same-day reclaim). Both are correctly bounded — noted as the *contrast* to
  Findings 1/2/4 to show the economy's faucets are well-designed *except* where
  client-trust or band-mispricing breaks them.
- **real?:** confirmed-read-source.

### 10. Casino is a closed Dream loop / net sink, not a faucet — informational
- **Where:** `apps/server/routers/casino.ts:427-451` (bet deduct + payout add
  to `dreamBalance`), `:533-554` (2% jackpot rake);
  `apps/shared/casinoGames.ts:662-668` + `:646-720` (achievements grant
  cosmetics/titles only — no Dream).
- **Numbers/mechanic:** Every game deducts the bet from `dream_tokens` and adds
  `payout` back to `dream_tokens`; with every published house edge < 21%
  (per `05_gambling_enthusiast.md`) plus a 2% jackpot rake, the casino is a
  **net Dream sink** in expectation and pays nothing into any *other* currency.
  Achievement rewards are cosmetic/title only. The progressive jackpot
  redistributes rake among players (zero-sum + the rake leak), so the casino
  does not inject net currency into the wider economy. This directly answers
  the brief's "casino payouts only as a faucet INTO the wider economy" concern:
  **it is not a faucet into the economy** — confirmed.
- **real?:** confirmed-read-source.

## Currency faucet/sink table

| Currency | What it is | Faucets (earn) | Sinks (spend) | Verdict |
|---|---|---|---|---|
| **Dream Tokens** (`dreamBalance.dreamTokens`) | Soft-premium; cash-buyable ($0.99=50, $5.99=500, `products.ts:78-110`) | Daily/weekly/epoch quests (5–300 ea), login calendar (3–150/day), boss-mastery L2 (20–30, capped), casino *payouts* (net-negative), store-purchased, marketplace sales, **EXPLOIT: client-reported quest progress (F1, unbounded)**, **EXPLOIT: Credit→Dream exchange (F4)** | Packs (100), premium battle pass (500), store products, casino bets (net sink), marketplace buys, currency exchange | **Inflation risk via F1+F4.** Sinks are fine; faucets are breakable. P0/P1. |
| **Credits** (`characterSheets.credits` / `twPlayerState.credits`) | Pure grind soft currency | Login calendar (500–5,000/day), trade quests (1k–500k), marketplace sales, quest `rewardCredits` | Store `purchaseWithCredits`, marketplace buys, **exchange → Dream (F4)** | Massive faucet, thin sink. Safe *only* while walled off from Dream — F4 breaks that wall. P1. |
| **Void Crystals / gems** (`dreamBalance.gems`) | Hard premium (Stripe/IAP) | Store SKUs only (`totalGemsPurchased`) | Premium battle pass (1000 VC), VC store products | Correctly purchase-only faucet; no exploit faucet found. Healthy. SKU-parity unverified (F7). |
| **Soul-Bound Dream** (`dreamBalance.soulBoundDream`) | Non-tradable Dream (bundle/founder grants) | Store bundles, $5.99 pack (`+50`) | (spends as Dream where allowed) | Bounded, purchase-derived. Healthy. |
| **Soul Stones** (pack dupe conversion) | Card crafting currency | 4th+ dupe auto-convert (5/10/20/100/400 by rarity, `packs.ts:137-147`) | Craft cards (20–1600 by rarity) | Faucet ∝ pack opens; sink ∝ collection gaps. Closed to packs. Healthy by construction. |
| **Battle-pass XP** | Seasonal progression (not spendable) | Quests, combat, `addXpFromAction` (**F2: caps unenforced, unbounded**) | Tier unlocks (cosmetic) | Engagement faucet broken by F2. Cosmetic-only so P1 not P0. |
| **Market Tax Pool** (`marketTaxPool`) | Sink-fed prize pool | 5% of every market trade (20% sub-routed to guild treasury) | Guild wars / season prizes | Pure sink→redistribution. Healthy design. |

## Top concern

**Finding 1 (P0) is the worst balance/economy break: daily-quest progress is
client-self-reported with no upper bound and no server-side event proof.** One
crafted tRPC call sequence (`updateProgress` with a large `increment`, then
`claimReward`) mints the full daily/weekly/epoch reward stack — up to ~1,000+
Dream and ~85,000 Credits per reset, every reset, with zero gameplay. Because
Dream is cash-equivalent (Finding 7) and feeds packs, the premium battle pass,
and the casino, this is an unbounded hard-currency-equivalent faucet that
collapses the entire monetization and progression model. Fix is to make
`updateProgress` server-authoritative (driven by trusted in-engine event
emitters, not a client RPC) or at minimum cap `increment` and validate the
event — and the same pattern must be applied to `battlePass.addXpFromAction`
(Finding 2, the same class of bug with the declared `dailyCap` left
unenforced).

**The worst pure-economy structural break is Finding 4: the Dream↔Credits
exchange is priced as if the two currencies are 1:1 peers with a 2× band, when
Credits are a bulk grind faucet and Dream is cash-equivalent.** Even without
the F1 exploit, the Credit faucet alone (500–500,000 Credits from routine
quests/login) arbitrages into hard-currency-equivalent Dream at up to 2:1 the
moment a counterparty order exists, dissolving the hard/soft currency
separation the store depends on. Re-peg the reference rate to the *faucet
ratio* (Credits are ~2-3 orders of magnitude more abundant than Dream) or
remove Credit→Dream convertibility entirely.

Notably, the parts nobody had audited that are *healthy*: the casino is a
correctly closed Dream sink (not a faucet into the wider economy), boss-mastery
and the login calendar are properly bounded faucets, soul-stones and the market
tax pool are closed loops, and the PvE spine has no unbeatable wall (every gate
resolves both ways or is a scripted loss). The economy's *design* is sound; its
*server-trust boundary* is where it breaks.
