# TCG Player — Audit

## Persona briefing

I'm an MTG Pro Tour veteran who grinds Eternal and Marvel Snap's economy side-by-side. I live in keyword stack ergonomics — the difference between **Lifelink+Trample** where the lifelink triggers first (critical for tempo preservation) and **Rush+Provoke** where adjacency rules matter for trading. I know the 7-card hand limit in Hearthstone forces mulligan discipline, Marvel Snap's 6-turn cap creates a tightness that costs matter more than stats, and MTG Arena's mana-curve heatmap forces designers to justify every cost-3 card. I evaluate TCGs on three axes: whether players can *read* cards (keyword density and clarity), whether draft feels *real* (rarity weighting, removal scarcity, bomb control), and whether ranked feels *honest* (balance patch frequency, transparency, sideboard discipline). The Dischordian Saga has the bones of all three — but the UX surface and balance calibration show they're still being welded.

## Files audited

**Core card system:**
- `apps/shared/tcg-core/cards/index.ts` (508-card barrel)
- `apps/shared/tcg-core/types/Card.ts` (CardDefinition schema, 27-keyword union)
- `apps/shared/tcg-core/balance/statCurve.ts` (STAT_CURVE + KEYWORD_TAX calibration, May 2026)

**Engine + combat:**
- `apps/shared/tcg-core/engine/combat.ts` (first 150 lines: provoke enforcement, ranged/flying bypass, overcharge/fury mechanics)
- `apps/shared/tcg-core/engine/lockout.ts` (Warlord three-move lockout, card-scoring heuristic)

**Replay infrastructure:**
- `apps/shared/tcg-core/replay/replay.ts` (deterministic match replay, seeded RNG, state hashing)

**Draft mode:**
- `apps/client/src/pages/DraftTournamentPage.tsx` (15 picks × 4-card packs, rarity weighting, 15-card deck limit)

**Deckbuilding UX:**
- `apps/client/src/pages/DeckBuilderPage.tsx` (full deck editor, import/export via deck codes, stats bar, rarity sorting)

**Ranked progression:**
- `apps/client/src/stores/act1CardLadderStore.ts` (localStorage-backed ladder, 12-step progression, win/loss tracking)

**Ratchet system (completeness checks):**
- `apps/shared/_completeness/checks/cardStatBudgetCoverage.ts` (deviation auditing, balanceException enforcement)
- `apps/shared/_completeness/checks/keywordBehaviorCoverage.ts` (keyword→engine coverage, exemption tracking)
- `apps/shared/_completeness/checks/trialCategoryCoverage.ts` (§5.8 Authority trial-phase category coverage)

**Sample cards (cost-curve fillers from PR #512):**
- `apps/shared/tcg-core/cards/definitions/insurgency/s1_curve_004_cell_decoy.ts` (1/2 at cost 1; on-curve)
- `apps/shared/tcg-core/cards/definitions/insurgency/s1_curve_009_trench_sergeant.ts` (4/5 at cost 4; on-curve)
- `apps/shared/tcg-core/cards/definitions/new_babylon/s1_curve_005_compliance_watcher.ts` (2/1 at cost 1; on-curve)
- `apps/shared/tcg-core/cards/definitions/architect/s1_pack_001_panopticon_override.ts` (4-cost AoE silence)

**Card definitions (faction inventory):**
- 8 factions + neutral: Insurgency (57), Architect (68), Dreamer (65), New Babylon (57), Thought Virus (55), Antiquarian (44), Neutral (83); S2 expansions + misc add 14 more

## Findings

**1. Keyword tax recalibration is mathematically honest but UI-invisible — P2**

- **Where:** `apps/shared/tcg-core/balance/statCurve.ts:29`, `apps/shared/tcg-core/types/Card.ts:37–68`
- **What's wrong:** The May 2026 calibration sets `KEYWORD_TAX = 0` because the live card pool (1100+ cards) never followed the original "1 stat per keyword" formula; designers authored cards at the gross expected-total-stats line and treated keywords as *flavor on top* rather than a stat subtraction. This is correct *in the engine* — the stat-curve check at `apps/shared/_completeness/checks/cardStatBudgetCoverage.ts:41–60` enforces it. But the DeckBuilderPage (`apps/client/src/pages/DeckBuilderPage.tsx:156–175`) computes stats averages without any keyword awareness, so a player looking at "Avg Power: 2.4" has no signal that a keyword-dense hand is trading off raw damage for effect complexity.
- **Why it matters to this persona:** MTG Arena's curve heatmap shows **keyword density as a third dimension** — your deck's average keyword count per card, correlated against win-rate. Snap players learn to *feel* the card-to-power ratio. Here, I can't tell if my deck is "efficient" or "keyword-loaded." The ratchet knows; the UX does not.
- **Recommended fix:** Add a `avgKeywords` stat to `DeckBuilderPage.tsx:175` alongside avgPower/avgCost. Compute `keywordCounts = deckCards.map(dc => cardMap.get(dc.cardId).keywords.length)`. Display as "Avg Keywords: 0.8/card" under the current stats bar. Reference the ratchet directly: if a card is beyond tolerance *and has no balanceException*, highlight it in orange in the deck list (`apps/client/src/pages/DeckBuilderPage.tsx:797`).

**2. Draft rarity escalation lacks removal scarcity controls — P1**

- **Where:** `apps/client/src/pages/DraftTournamentPage.tsx:69–104` (generateDraftPack)
- **What's wrong:** The rarity weighting formula (line 74–79) bumps rare/epic/legendary weights linearly as pick number increases (`20 + Math.min(pickNumber, 10)` for rares, `15 + Math.min(pickNumber * 0.5, 8)` for epics). This creates a **power spike at picks 10–15** that is not counterbalanced by removal availability or board-wipe scarcity. MTG's draft format enforces a "removal curve" where limited removal is scarce in early packs to force trades. This pool has no such constraint. A player's picks 13–15 will be almost entirely rares/epics with no downside. The AI battles (line 296–330, simulated with `winChance = 0.3 + (deckPower / 500)`) don't model board state, so a curve-less deck of 5 legendaries + 10 random commons will perform the same as a balanced curve.
- **Why it matters to this persona:** In MTG, draft *format depth* is measured by how tightly you must balance bombs, removal, and efficiency. A draft that lets you take 5 bombs is a draft with no tension. Here, the rarity escalation is too aggressive, and the AI doesn't punish greedy picking.
- **Recommended fix:** (a) Add `removal_scarcity` tracking: filter allCards for spells/effects with keywords like "dispel", "stun", "silence" (`apps/shared/tcg-core/types/Card.ts:37–68`). In generateDraftPack, weight removal cards higher in late packs *relative to bombs*. (b) Cap legendary weight at `5 + Math.min(pickNumber * 0.2, 3)` instead of `5 + Math.min(pickNumber * 0.3, 5)`. (c) Model the AI's board-clear threat in `DraftTournamentPage.tsx:305–311`: compute `deckHasRemoval = true` if any card silences/stuns/damages all enemies. If not, apply a `-0.15` penalty to winChance.

**3. Provoke + Ranged interaction is engine-sound but lacks UX preview — P2**

- **Where:** `apps/shared/tcg-core/engine/combat.ts:101–121`
- **What's wrong:** The combat resolver correctly enforces: ranged/flying bypass provoke (line 103–105), melee attackers must target provoke units first (line 107–112). This is a **non-obvious interaction** that mirrors MTG's flying and Hearthstone's taunt. But DeckBuilderPage shows no "interaction indicator" — a player building a ranged-heavy deck against a provoke-heavy opponent has no in-UI warning. The GameCard component (imported at line 6, used at line 659) renders card images and name/type/cost, but not keyword rules text or interaction chains.
- **Why it matters to this persona:** In Arena, you can hover any keyword and see a tooltip + list of cards that interact with it. Here, discovering that ranged bypasses provoke requires either reading rules or playing matches. Snap has this problem too (location text is dense), but Snap's economy forces you to learn fast. A ranked ladder (Act 1 ladder at `apps/client/src/stores/act1CardLadderStore.ts`) should assume players know the rules.
- **Recommended fix:** Add keyword tooltips to GameCard component: when keyword clicked, show a modal with (1) rule text (e.g., "Provoke: adjacent enemies must target this"), (2) list of cards on board + in hand that interact with it (e.g., "Ranged units ignore provoke"), (3) archetype tags that lean on this keyword (e.g., "Control, Tempo"). Wire this into the deck editor's card hover (`DeckBuilderPage.tsx:672–676` overlay).

**4. Warlord lockout scoring weights affordability over synergy — P1**

- **Where:** `apps/shared/tcg-core/engine/lockout.ts:80–127`
- **What's wrong:** The lockout heuristic scores hand cards by affordability (+25 if playable, -5 per mana overage), board state (+12 per friendly unit for buff/heal spells), empty tiles (+10 for units), and offensive keywords (+5 each). The Warlord picks the TOP two highest-scoring cards to LOCK (removing them from play), leaving the player with the lowest-scoring two. This is theoretically elegant — the Warlord prunes the "strongest" branches. But empirically, it scores a 1-drop at +25 (always affordable) over a 6-cost bomb at +0 (unaffordable but game-winning). On turn 4 (when the lockout triggers at act1/authority), players often have 6+ mana, making the cost heuristic *obsolete*. The Warlord isn't intelligently pruning; it's just locking small cards.
- **Why it matters to this persona:** MTG's AI difficulty in Standard gauntlets is calibrated by whether the AI understands **threat assessment** — can it see that your Omnath is lethal and discard your removal, or does it just play on-curve? The Warlord is supposed to be §5.5 boss-level difficulty, but the heuristic is too naive. A player with 8 mana and a hand of [1-drop, 2-drop, 4-drop bomb, 6-drop bomb] gets locked into the two bombs and left with vanilla fodder — not because the Warlord is smart, but because the scoring didn't account for late-game dynamics.
- **Recommended fix:** Reweight the heuristic for turn 4+: if `player.mana >= 6`, override affordability scoring and instead score by `card.baseStats?.power + baseStats?.health` (raw threat). Add `fuseWith: "combo"` scoring: boost cards that appear in ability chains (e.g., a card that triggers on another card's summon). Weight board-wipe threats (-10 per opponent's unit if the locked card can AoE). Example: `if (def.keywords.includes("blast") && boardEnemyCount > 3) score -= 20` (Warlord fears board-clears).

**5. Stat-curve tolerance windows widen at cost 5–9 but have no gradient justification — P2**

- **Where:** `apps/shared/tcg-core/balance/statCurve.ts:49–60`
- **What's wrong:** The tolerance for cost 3 is 20% (±1.4 expected stats), but cost 7 jumps to 30% (±5.1 expected stats). This is *justified in the comment* (line 36–41): high-cost cards are ability-driven, so they trade stats for effects. But the ratchet (`cardStatBudgetCoverage.ts`) flags any card outside tolerance with a hard error; there's no *sliding scale*. A cost-6 card with an ability-but-slightly-over-budget is penalized the same as a cost-7 card with no special effect. The statCurve.ts table has a discontinuity: cost-5 is 0.20, cost-6 is 0.25, cost-7 is 0.30, cost-8 is 0.30. This looks hand-tuned rather than principled.
- **Why it matters to this persona:** Balance anchoring — the feeling that cost *means something*. In MTG, a 7-mana card is expected to be closer to a power-level ceiling because there are fewer of them in the deck. Here, a cost-7 card at 20 stats and a cost-7 card at 12 stats are both "in tolerance" if one has no abilities and one has 1. But they're playing very differently. The ratchet should *report* cost/ability pairs, not just pass/fail.
- **Recommended fix:** (a) Compute cost-to-ability *ratio*: for each card, store `"Stat Efficiency" = (power + health) / (cost + keywords.length * 0.5)`. Add this to the stat bar in DeckBuilderPage (line 731–748). (b) In `cardStatBudgetCoverage.ts`, emit a second tier of warnings: "cards within tolerance but low efficiency" (e.g., a 1/1 at cost 2 with rush is in tolerance but inefficient). (c) Propose a more granular STAT_CURVE: use cost buckets `{ cost: 5–6, tolerance: 0.22 }` and `{ cost: 7–9, tolerance: 0.28 }` instead of per-cost steps. This reads as "mid-curve gets tighter, finishers are looser."

**6. Trial category backfill is incomplete and breaks Authority trial availability — P0**

- **Where:** `apps/shared/tcg-core/types/Card.ts:86–92`, docs comment line 83–84
- **What's wrong:** The CardDefinition schema allows `trial_categories?: readonly TrialCategory[]` (optional). The comment says "new optional field as of April 2026. Existing cards default to empty (unplayable in §5.8). Act 1 card-pool backfill planned in a follow-up pass." This is **a blocking issue**: the Authority trial finale (§5.8) is supposed to ship with 100% trial-category coverage per the ratchet (`trialCategoryCoverage.ts:41–55`). If existing cards have empty arrays, they're unplayable in restricted phases. The check counts `eligible.length - offenders.length` — but if 200+ cards have no categories, the gate fails. Looking at sample cards: `s1_curve_004_cell_decoy.ts:28` has `trial_categories: ["defensive"]`, `s1_pack_001_panopticon_override.ts:51` has `trial_categories: ["narrative", "offensive"]`. These are *authored*, not backfilled. The backfill task is in the queue but not shipped.
- **Why it matters to this persona:** In MTG, format-legality is a hard gate. If you announce a "restricted format" (like a sealed deck at a PTQ), then cards are either legal or not. The Dischordian Saga is announcing §5.8 Authority as a restricted format (5 phases, only certain card categories playable), but the authorization gate is *incomplete*. I can't draft a deck for Authority because I don't know which of my 500 cards are playable.
- **Recommended fix:** (a) Urgently backfill `trial_categories` on all non-token, non-reserved, non-warlord-only cards. Use the heuristic in `balance/verdictDeltaProposer.ts` (if it exists) or a simple rule: `cardType === "spell" ? ["defensive", "evidence"] : ["offensive", "evidence"]` (conservative assignment, then manual review by faction leads). (b) Add a toggle to DeckBuilderPage: "Filter for Authority trial" (checkbox at line 584). When enabled, gray out cards with empty `trial_categories` and show an overlay "Not yet authorized for trial play." (c) Make the ratchet gate a *precondition* for Authority runtime shipping (spec §2.1: "gates behind a feature flag that requires 100% coverage").

**7. Replay export is core infrastructure but has no UI surface — P2**

- **Where:** `apps/shared/tcg-core/replay/replay.ts:1–80`
- **What's wrong:** The replay system (deterministic, seeded, hash-verified) is built and documented. The input interface (ReplayInput line 37–45) accepts `matchId, seed, rulesVersion, actions, configs, registry`. The output (ReplayResult line 47–74) includes `steps, finalState, finalStateHash, versionCompatible`. But there's **no deckbuilder export** or **replay download** button. DeckBuilderPage has an export-deck-code button (line 419–426), but no "download replay" or "share replay ID" feature. A player who brewed a deck in the editor, played it in ranked, and won has no way to export the match for replay verification or sharing.
- **Why it matters to this persona:** MTG Arena lets you download match logs; Snap lets you share replay IDs to your crew. These are table-stakes for a competitive game. The Dischordian Saga has the *engine* but not the *UX*. Without this, balance disputes ("this card is busted") lack evidence trails.
- **Recommended fix:** (a) In DeckBuilderPage, add "Export Last Match Replay" button (next to "Export Deck Code"). On click, query `trpc.cardGame.getLastMatch` (new router endpoint) and call `replayMatch()` with the returned actions. Generate a shareable `replayId = hashState(result.finalState)`. (b) Add a new page `/replay/:replayId` that loads the replay from the DB, renders the ReplayViewer (`apps/shared/tcg-core/replay/viewer.ts` exists), and plays back the match frame-by-frame. (c) Wire replay verification into balance-patch notes: when a patch ships, flag replays from the old rules version and show a banner "This replay is from an older card set. Some abilities may have changed."

**8. Mana curve is heavily skewed at cost-3 and no archetype can avoid it — P1**

- **Where:** `apps/shared/tcg-core/cards/index.ts` (508-card barrel structure)
- **What's wrong:** The prior audit noted "Cost distribution heavily skewed at cost-3 (49.9% pre-PR #512; +10 cards in PR #512 across cost-1 + cost-4)." Post-PR, the distribution should be slightly less skewed — but the deck building incentive still favors cost-3. DeckBuilderPage's drag-and-drop interface (line 644–679) sorts cards by cost (line 654: `sort((a, b) => a.cost - b.cost)`), making cost-3 the natural "middle" of any sorted view. A player building a deck sees a wall of cost-3 cards and has no signal to avoid them. The stat bar (line 731–748) computes "Avg Cost: X.X" but doesn't warn when the average is below 3.5 (which would skew early) or above 4.5 (which would skew late relative to the 7-card hand limit in Authority).
- **Why it matters to this persona:** In Hearthstone, the mana curve *feels* important because your hand limit is 10 and you draw per turn. In MTG, a 7.5-land deck has a specific metagame role (control). Here, the draft format pulls toward cost-3 bombs naturally (rarity escalation), and the deckbuilder doesn't resist. A player's "best deck" is probably 8× cost-3 rares, which is boring and fragile to removal.
- **Recommended fix:** (a) Add a **mana-curve heatmap** to DeckBuilderPage (line 750–770, in the "Type distribution bar" section). Show a histogram: `[cost-0: █, cost-1: ██, cost-2: ███, cost-3: ███████, cost-4: ██, ...]` with color gradient (green = balanced, red = skewed). (b) Auto-compute `curveScore = Math.max(typeCounts[i] / deckCards.length)`. If curveScore > 0.35 (any single cost is >35% of deck), show a warning: "Your deck is heavily skewed toward cost-X. Consider adding X-cost answers." (c) When cost-3 cards are added to deck, faintly highlight all cost-3 cards in the collection panel (line 644) with a tooltip: "Deck already has X cost-3 cards."

## Cross-perspective overlap

(filled in during AUDIT_15_TRACKER.md aggregation)

## The deckbuilder UX I want

The DeckBuilderPage is the *core* competitive surface, and it's currently a **card browser with a sidebar**. I want it to become **a deck-tuning optimizer** that whispers in my ear like Arena's auto-suggestion system. Here's the vision:

When I open the editor (`DeckBuilderPage.tsx:568–875`), the right panel becomes a **tuning sidebar** instead of just a list view. It shows:
1. **Mana curve heatmap** (histogram, color-coded green→red for balance→skew)
2. **Keyword density** (e.g., "Your deck has 7 cards with Rush. Is this intentional?")
3. **Synergy clusters** (e.g., "You have 3 cards that trigger on summon + 2 summon-heavy cards. [Build Pack](?) to add more synergy targets")
4. **Removal scarcity** (e.g., "You have 0 board-wipes. [Add Silence/Stun cards?]")
5. **Budget check** (e.g., "You have 3 cards with balanceException. Review them here.") — links to each exception's reason/reviewer from `CardDefinition.ts:228–231`.
6. **Trial-phase legality** (e.g., "3 cards not yet authorized for Authority trial. Authority → [Auto-filter]")

The ratchet system (`cardStatBudgetCoverage.ts`, `keywordBehaviorCoverage.ts`, `trialCategoryCoverage.ts`) is the *truth source* for "is this balanced today." Wire it into the UI: when I hover a card with a balanceException, show a tooltip "(Approved by @designer_handle: 'high-impact keyword stack')" from the CardDefinition field.

Finally, **deck import/export should be bidirectional with replay**. I should be able to:
- Export a deck code (already works, line 419–426)
- Share the code with a friend, they import it (already works, line 302–319)
- Play a match with that deck
- Export the match replay
- My friend loads the replay, sees how I piloted it, iterates

This closes the feedback loop that Snap and Arena have.

## My top 3 archetype recommendations for Season 2

### 1. Aggro Cell (Insurgency rush + pack synergy)

**Seed cards:** `s1_pack_005_cell_runner.ts`, `s1_curve_004_cell_decoy.ts` (1/2 cost-1), `s1_pack_pet_flicker_imp_1.ts` (token generator), `s1_char_105_iron_lion.ts` (likely a 2/2 or 2/3 cost-2)

**What's missing:** Insurgency has Rush as its signature keyword (`engine/combat.ts:38`), and Pack tribal synergy (`engine/combat.ts:65`, "pack: +1 power per other ally with the same defId"). The archetype needs **cohesive cost-1 and cost-2 generators** to fill picks 1–7, then **pack-enabler payoffs** at cost 3–4 (e.g., "whenever a Pack unit attacks, draw a card" or "+1/+1 to all Pack units"). Currently, the pool has individual pack units and rush units, but no *bridge*. Season 2 should add a cost-3 Insurgency spell that summons multiple tokens of the same defId (e.g., "Summon 2 flickers. The first gains +1/+0").

**Which ratchet it would tighten:** **card_stat_budget_coverage** — adding cost-1 and cost-2 bodies with multiple keywords (rush + pack) will test whether `KEYWORD_TAX = 0` holds at the low end. If a 2/1 cost-1 rush pack unit is in-budget, it proves the formula; if not, it triggers a balanceException and documents why token generators break the curve.

### 2. Dispel Control (Architect silence + reactive lockdown)

**Seed cards:** `s1_pack_001_panopticon_override.ts` (4-cost AoE silence), Architect faction's dispel-heavy roster (Architect has 68 cards; likely includes single-target silences at cost 2–3), Thought Virus faction (55 cards; may lean on denial/exile mechanics that synergize with silence)

**What's missing:** The "Panopticon Override" is a premium answer (cost-4 spell), but Architect needs **efficient early removal** (cost-2 single-target silence) and **disruption that chains into silence**. For example, a cost-2 Architect spell: "Stun an enemy unit. At end of turn, if it's still stunned, silence it instead." This creates a **control progression**: stun to buy time, silence to lock permanence. Currently, the pool has silence as a one-off effect; Season 2 should add **silence-adjacent keywords** (e.g., "shackle: removes 1 keyword per turn" as a gradual dispel), turning silence into a **synergy cluster**.

**Which ratchet it would tighten:** **keyword_behavior_coverage** — the current exemption list (`keywordBehaviorCoverage.ts:42–60`) includes keywords like "dispel" that are implemented but "silence" as an *effect op* is not a named keyword in the union (`Card.ts:37–68`). Adding silence-related keywords (e.g., "antispell: cannot be silenced") forces the engine to implement keyword-keyword interactions, tightening the behavioral coverage gate.

### 3. Verdict Fraud (Dreamer mixed-phase Authority exploitation)

**Seed cards:** Cards with high `verdict_delta` (line 158–165 of `Card.ts`: "public delta overrides"). Dreamer faction (65 cards; thematically misaligns with Authority but may have narrative weight). Any cards with `public_delta` divergence (line 177: public delta != verdict delta).

**What's missing:** The Authority trial (§5.8) computes verdict balance by summing `verdict_delta` per played card. A deck that plays `[+1, +1, +1, +1]` cards biased toward Overturn will push the verdict that way. But the `public_delta` field allows a **divergence**: a card might have `verdict_delta: +2` (private) but `public_delta: -1` (public record). This means the card moves the verdict toward Overturn *secretly* but looks like evidence toward Sentence in the transcript. Season 2's "Verdict Fraud" archetype would be **intentional transcript-hacking**: draft cards with high verdict divergence, play them in the right phase order, and the public jury record diverges from the private state, handing you a verdict win with a "suspicious" transcript (driving narrative branching into Acts 4–7).

**Which ratchet it would tighten:** **trial_category_coverage** — this archetype forces the ratchet to ensure every card's `trial_categories`, `verdict_delta`, and `public_delta` are **coordinated**. A card playable in "evidence" phase with `verdict_delta: +2` and `public_delta: -2` is a contradiction (the comment suggests +2 heuristic for evidence cards; public should match unless intentional fraud). The ratchet should flag inconsistencies: "Card X plays in evidence phase but has negative verdict_delta. Is this intentional?" This surfaces archetype design space.
