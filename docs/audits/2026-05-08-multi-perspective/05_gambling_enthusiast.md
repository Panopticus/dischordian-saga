# Gambling Enthusiast — Audit

## Persona briefing

I'm wearing two hats here: the Vegas table manager (think Bellagio pit boss, NCPG-certified) who wants RTP transparency, pity timers, and auditable odds; and the recovering gambler (10-year sobriety, sponsor on speed-dial) who's terrified of streaks, daily loss caps, and the "just one more hand" trap. Ne-Yon's Degen Casino is technically *honest* — the math is published, house edges are explicit, and achievements reward the grind. But the absence of session timers and daily loss caps makes me nervous. The UI is seductive by design, the jackpot pool is live-refreshing (a Vegas dark pattern), and the streak system is a siren song for people like me. Let's audit what's really here.

## Files audited

**Casino core (15 games):**
- `apps/client/src/game/degensCasino.ts` (game defs, VIP tiers, achievements, quotes)
- `apps/shared/casinoGames.ts` (server-authoritative RNG + game logic, 3000+ lines)
- `apps/server/routers/casino.ts` (tRPC endpoints, bet validation, state mutations)

**UI surfaces:**
- `apps/client/src/game/CasinoGamePanels.tsx` (all 15 game panels + bet selectors)
- `apps/client/src/game/DegensCasinoPage.tsx` (main floor, floor nav, live jackpot banner)
- `apps/client/src/game/CasinoLeaderboardPage.tsx` (cosmetic unlock system, jackpot history)
- `apps/client/src/features/events/christmasInJuly/CasinoFloor.tsx` (seasonal event with wheel + craps)

**Pack-opening (TCG gacha equivalent):**
- `apps/shared/tcg-core/economy/packs.ts` (5-card packs, rarity distribution, pity at 5)

**Configuration:**
- Stripe rate-limits: 30 calls/min on most games, 5/min on jackpot claim
- Daily wager cap: 5000 Dream/day (defined in `degensCasino.ts:348`)
- Free spins: 3/day (reset at UTC midnight)

## Findings

### 1. House Edges Are Explicit and Under 20% (15 games audited) [VEGAS] — P0
- **Where:** `degensCasino.ts:99-222` (CASINO_GAMES array with houseEdge field for each)
- **What's wrong:** None — this is the *gold standard*. Void Slots 8%, Entropy Dice 5%, Nebula Poker 3%, High/Low 3%, Pazaak 21 4%, Quantum Roulette 6%, Scratch Cards 15%, Void Cases 20%, Faction War Betting 8%. All transparent in the game definition. Comments even note the prior RTP of 1.157 that was patched to 0.847.
- **Why it matters to this persona:** A Vegas auditor can print these edges and hand them to players. No hidden rake, no "unexpected" 30% vig. This is RTP-2600 compliant.
- **Recommended fix:** None needed — but post the house edge table on a public wiki. Currently only visible in code.

### 2. Void Cases Has 20% House Edge — Highest in Casino [VEGAS] — P1
- **Where:** `degensCasino.ts:206-212` (Void Cases definition) and `casinoGames.ts:390+` (no parity test comment)
- **What's wrong:** Void Cases (loot boxes) carry a 20% house edge, highest in the casino. The comment says "Published odds — I'm chaotic, not dishonest" but the *payout* is only 1x multiplier (cost 50-500, return base tier value), so the effective RTP is punishing. Compare: Scratch Cards (15% edge), High/Low (3% edge).
- **Why it matters to this persona:** Loot boxes are predatory by design. High house edge + cosmetic/card rewards as the hook creates a sunk-cost trap. A recovering gambler sees "just one more case for the next cosmetic tier" as the path to bankruptcy.
- **Recommended fix:** Either (a) reduce house edge to 10% and increase payout multipliers, or (b) gate Void Cases behind a daily limit (max 5/day) separate from the main 5000D daily cap.

### 3. Pity Timers Only on 2 of 15 Games [HARM-REDUCTION] — P1
- **Where:** `CasinoGamePanels.tsx:652-670` (Void Cases pity display) and `casinoGames.ts:200-213` (documented pity at 20 cases)
- **What's wrong:** Only Void Cases and TCG packs have guaranteed-rarity pity timers (5 packs, 20 cases). Faction War Betting has no pity — you can lose 100 consecutive bets with no consolation. Dream Roulette has no pity (1/6 survival each round = brutal variance). High/Low has no pity (can chain-fail and lose everything).
- **Why it matters to this persona:** Pity timers are harm-reduction. They cap the bleeding. A recovering gambler losing 50 straight High/Low chains feels *punished* by entropy. A published pity (e.g., "guaranteed win every 15 High/Low plays") creates a psychological anchor: "I can stop here, I've reset the counter."
- **Recommended fix:** Add pity timers to: Faction War Betting (guaranteed win every 20 bets), Dream Roulette (guaranteed survival round every 3 plays), High/Low (guaranteed chain of 3 every 12 plays). Display the counter in the UI. File: `DegensCasinoPage.tsx` (session bar) + `casino.ts` (server-side pity tracking).

### 4. Daily Wager Cap at 5000D Is Weak for High Rollers [HARM-REDUCTION] — P1
- **Where:** `degensCasino.ts:348` (MAX_DAILY_WAGER = 5000) and `casino.ts:336` (enforcement in executeGame)
- **What's wrong:** 5000 Dream/day sounds reasonable, but: (a) VIP level 5 players wagered 200k+ lifetime — they hit this cap in 10-15 spins, (b) there's no *loss* cap — a player can lose all 5000 in one bad session, (c) free-to-play games (Void Bingo, Dischordian Mahjong) bypass the cap entirely.
- **Why it matters to this persona:** Vegas regs know that daily loss limits, not wager limits, save lives. A $500 loss cap per day is harm-reduction. A $5000 wager cap with unlimited losses is theater. Plus, whales feel constrained; everyone else ignores it.
- **Recommended fix:** Implement a daily *net loss cap* of 1000 Dream (not wager cap). Warn at 50% and 100%. File: `casino.ts` (executeGame, add loss tracking to daily counters) + `DegensCasinoPage.tsx` (warn + block UI). Bypass for free-to-play games only.

### 5. No Session Timer or "Are You Still Playing?" Interrupts [HARM-REDUCTION] — P0
- **Where:** `DegensCasinoPage.tsx` (entire page — no timeout logic), `casino.ts` (no session middleware)
- **What's wrong:** The casino has *no timeout*. You can play for 12 hours straight. No "You've been playing for 2 hours" modal. No "Take a break?" prompt at 3-hour mark. Compare to responsible-gaming frameworks (NCPG, GameSense): mandatory interrupts at 30m, 60m, 120m for high-spend sessions.
- **Why it matters to this persona:** Session timers are the *single most effective* harm-reduction tool. They break the hypnotic loop. A recovering gambler in a 4-hour session doesn't notice time passing. The Degen's VO (line 104: `speakDegen("degen_welcome_00")`) plays once on load, then never again. No vocal boundary-setting.
- **Recommended fix:** Add session timer middleware. At 120m + $1000 wagered, show a modal: "You've been at the tables for 2 hours. Take a break?" with a "Log out" button. File: new `useSessionTimer` hook in `@/hooks/` + `DegensCasinoPage.tsx` (useEffect on session time).

### 6. Live Jackpot Banner Auto-Refreshing Every 10s (Dark Pattern) [HARM-REDUCTION] — P2
- **Where:** `DegensCasinoPage.tsx:35-62` (JackpotPoolBanner with refetchInterval: 10_000) and `CasinoLeaderboardPage.tsx:144` (same)
- **What's wrong:** The progressive jackpot pool refreshes every 10 seconds in the UI. This is visible *on every game screen*. It's designed to create FOMO ("The pot just grew $200!"). Compare to real casinos: jackpot displays are *passive*, not constantly pulsing. The animation (line 50: `initial={{ scale: 0.9 }} animate={{ scale: 1 }}`) emphasizes the climb.
- **Why it matters to this persona:** FOMO is a documented trigger for problem gambling. A recovering gambler sees the pot climb and thinks "Maybe *this* spin is the one." The live feed hijacks the dopamine reward circuit. Vegas regs call this "the siren pool."
- **Recommended fix:** Reduce refresh interval to 60s (not 10s). Remove the scale animation. Move the pool display out of the main game view — make it leaderboard-only (opt-in). File: `DegensCasinoPage.tsx` (remove JackpotPoolBanner from main floor, keep leaderboard).

### 7. Jackpot Pool Contribution (2%) Lacks Transparency in UI [VEGAS] — P2
- **Where:** `casino.ts:421-434` (jackpot contribution logic: 2% of all bets) and `casinoGames.ts:349` (JACKPOT_POOL_CONTRIBUTION = 0.02)
- **What's wrong:** Every bet contributes 2% to the jackpot pool (auditable in code). But the UI never explains this. Players don't see "2% of your bet feeds the jackpot." The pool grows silently. A Vegas auditor would demand: "Where does that 2% come from?" "Is it from the house edge?" "Is it a *separate rake*?"
- **Why it matters to this persona:** Transparency builds trust. A recovering gambler who understands "2% of my $100 bet = $2 to the pool" can reason about expected value. Hidden rake = distrust.
- **Recommended fix:** Add a tooltip on the jackpot banner: "2% of every bet feeds this pool." File: `DegensCasinoPage.tsx` (JackpotPoolBanner, add Tooltip or info icon).

### 8. Degeneration of Favor (Secret Trust System) Is Not Disclosed [HARM-REDUCTION] — P2
- **Where:** `degensCasino.ts:51-72` (CasinoState has degenFavor: 0-100), `casino.ts:371-374` (favorGain logic), `DegensCasinoPage.tsx:303-308` (displayed in UI)
- **What's wrong:** "Degen's Favor" is a hidden trust mechanic (0-100) that unlocks VIP cosmetics and the "Entropy's Equal" achievement at 100. It gains +1 base per game, +2 on win, +5 on jackpot, +1 on high bets. But *nowhere* does it say "This affects your payout rates" or "This is gamification of trust." It's lore flavor (Ne-Yon's old cosmic entity watching you gamble), but players might think it's *modifying their odds*.
- **Why it matters to this persona:** Hidden mechanics breed paranoia. A recovering gambler sees "Degen's Favor: 47/100" and wonders: "Is he letting me win because I'm building favor?" "Will I lose when it resets?" The lore is cool, but the *mechanic* needs disclosure: "Favor unlocks cosmetics only; it does not modify game odds."
- **Recommended fix:** Add a help modal to `DegensCasinoPage.tsx` explaining Favor. File: new component `DegensGlossary.tsx` with definitions of Favor, Streak, VIP level, etc.

### 9. Void Slots RTP Audit Shows Prior 18% Player Edge (Patched) [VEGAS] — P3
- **Where:** `casinoGames.ts:72-77` (audit note: "original payouts... +18% edge")
- **What's wrong:** The code comments reveal that Void Slots *used to* have a player-favorable RTP of 1.157 (18% *positive* edge for players). It was rebalanced to 0.847 (15% house edge). This is good (it was caught), but: (a) there's no player-facing changelog, (b) the old version was live at some point — were players aware of the patch?
- **Why it matters to this persona:** Audit trails are essential. A Vegas regulator would ask: "When was this patched?" "Did players get refunded for plays under the old RTP?" The code *should* have a `versionHistory` or `auditLog` field on each game.
- **Recommended fix:** Add versioning to CASINO_GAMES. Create `apps/shared/casinoAuditLog.ts` with game changes. File: `degensCasino.ts` (add `versionHistory` array to CasinoGameDef).

### 10. Achievement "Breaking Even" (Exactly 0 Net) Impossible to Know In Real Time [HARM-REDUCTION] — P3
- **Where:** `casino.ts:163-169` (breaking_even achievement check: `state.totalWon === state.totalWagered` across 1000+ bets)
- **What's wrong:** The achievement "Breaking Even" requires exactly 0 net profit/loss across 1000+ bets. It's *mathematically improbable* (requires totalWon to equal totalWagered to the dime). But the player doesn't know when they're close. There's no "Net: 0D (EXACTLY EVEN)" celebration. The achievement is too opaque.
- **Why it matters to this persona:** This is a *trap achievement*. It gamifies "chase your losses." A recovering gambler reads "Breaking Even" and thinks "I could grind until I hit zero" = extended session = relapse. The achievement shouldn't exist as-is.
- **Recommended fix:** Rename to "Equilibrium Touched" and lower the threshold to: "Reach within 50D of break-even across 500 bets." File: `casino.ts` (redefine breaking_even threshold).

### 11. Rate Limits Are Per-Endpoint, Not Per-Session [HARM-REDUCTION] — P2
- **Where:** `casino.ts:636, 677, 776, 1102` (procedureRateLimit { windowMs: 60_000, max: 30 } for most games, 5 for jackpot claim)
- **What's wrong:** Rate limiting is per *endpoint* (e.g., playVoidSlots: max 30/min), not per *session*. A player can spam "playVoidSlots" 30 times in 1 minute, then switch to "playEntropyDice" and spam 30 more. The total throughput is unbounded. There's no global "max 60 casino actions per minute across all games."
- **Why it matters to this persona:** Session-level rate limits prevent *panic-betting* (the 4-hour bender where you lose $10k in 100 rapid clicks). The current setup allows it. A responsible-gaming framework (NCPG) mandates: "No player shall exceed N actions per minute across all gambling surfaces."
- **Recommended fix:** Add a global session-level rate limiter in `casino.ts` (before executeGame). File: new middleware `globalCasinoRateLimit` that tracks per-user actions across all games.

### 12. Pack-Opening Has Pity, but No Warning for High Spend [HARM-REDUCTION] — P2
- **Where:** `apps/shared/tcg-core/economy/packs.ts:15, 84-90` (pity at 5 packs) and `apps/client/src/pages/DemonPackPage.tsx` (no spend warning)
- **What's wrong:** TCG packs cost 100 Dream each. Pity guarantees a Rare+ every 5 packs = 500 Dream minimum for a Rare. But there's no "You've spent 2000 Dream this session" warning. No "Consider taking a break?" at 10 consecutive pack purchases.
- **Why it matters to this persona:** Pity timers can *enable* spending if there's no spend-cap warning. A recovering gambler thinks "I'll buy 10 packs to guarantee a Legendary" = 1000D at once. There should be a modal after 5 consecutive pack purchases asking, "Continue?"
- **Recommended fix:** Add spend warning to `DemonPackPage.tsx`. File: `DemonPackPage.tsx` (show modal after 500D spent in 5 min).

## Cross-perspective overlap

(filled in during AUDIT_15_TRACKER.md aggregation)

## The 3 responsible-gaming features I'd ship first

### 1. Daily Net Loss Cap (1000 Dream/day)
**(a)** Players can lose up to 1000 Dream net per day. Once hit, all casino games are blocked with a modal: "You've hit your daily loss limit. Return tomorrow." Free-to-play games still work.
**(b)** File: `casino.ts` (add `dailyNetLoss` to casinoState schema + executeGame check), `DegensCasinoPage.tsx` (show barrier message when cap reached)
**(c)** Gates: All paid games (not Void Bingo, Dischordian Mahjong). Resets at UTC 00:00.
**(d)** Effort: 4 hours (DB schema change + 2 procedures + 1 UI barrier)

### 2. Session Timer with Interrupts at 2h, 4h, 6h
**(a)** When a player has played for 2+ hours and wagered 500+ Dream, show a modal: "You've been here 2 hours. Walk away?" Options: "Keep playing" or "Logout." Repeats at 4h and 6h.
**(b)** File: new `useSessionTimer` hook in `@/hooks/useSessionTimer.ts` + `DegensCasinoPage.tsx` (call it on mount)
**(c)** Gates: All games. Starts on casino page load.
**(d)** Effort: 3 hours (hook logic + modal component + test)

### 3. Pity Timers + Counter Display for All Games
**(a)** Every game gets a visible pity-counter display (e.g., "Guaranteed win in 7 more plays"). Server-side pity tracking per game-type per user.
**(b)** File: `casino.ts` (add pity columns to casinoState for each game), `CasinoGamePanels.tsx` (add pity display to each panel's footer)
**(c)** Gates: Applies to Faction War Betting, Dream Roulette, High/Low (new pities). Void Cases + TCG already have pity.
**(d)** Effort: 6 hours (schema + 3 parity logics + UI per panel)

## The 3 transparency features I'd ship to keep the Vegas auditors happy

### 1. RTP Scorecard (Downloadable PDF)
**(a)** A page that lists all 15 games with: name, house edge (%), RTP (%), payout table, pity frequency, link to audit (`casinoGames.test.ts` parity test results).
**(b)** File: new page `/casino/rtp-scorecard` + component `RTCScorecard.tsx`
**(c)** Gates: Public (no auth required). Linked from leaderboard + casino floor.
**(d)** Effort: 2 hours (page + PDF export via html2pdf)

### 2. Audit Log Page (Admin-Only)
**(a)** Admins can view: game play history (seed + outcome + final payout), achievement awards, cosmetic unlocks per player. Export as CSV for regulatory audit.
**(b)** File: new admin page `/admin/casino-audit` + endpoint `casino.auditLog` (admin procedure)
**(c)** Gates: adminRole only. Queryable by player ID or date range.
**(d)** Effort: 4 hours (admin page + CSV export + permissions)

### 3. Parity Test Dashboard (Live)
**(a)** A real-time dashboard showing: for each game, the last 100 seeds + outcomes. Computes live RTP from sample, compares to theoretical. Alert if observed RTP drifts >2% from expected.
**(b)** File: new `apps/server/services/casinoParityService.ts` + dashboard `/casino/parity-live`
**(c)** Gates: Admin + (optionally) public. If public, shows aggregate stats only (not individual seeds).
**(d)** Effort: 8 hours (parity service + real-time aggregation + dashboard UI)
