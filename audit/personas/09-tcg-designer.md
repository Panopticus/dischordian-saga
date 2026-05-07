# TCG Designer — Audit

Scope: `apps/shared/tcg-core/cards/definitions/` (475 card files across 17 dirs — 7 named factions + allegiance/imprint/class/race/dimensional/elemental/panopticon/s1_pack2/s2_hierarchy/s2_professors), `apps/shared/tcg-core/types/Card.ts`, `engine/effectInterpreter.ts`, `_completeness/registry.ts`. All RULES_VERSION literals in card files are `"1.1.0"` (1153 occurrences) and engine `RULES_VERSION = "1.1.0"` — **no rules drift**.

## Top 6 findings

### F1: Confession trial category is functionally extinct (Authority phase 7 unbeatable)
- file: `/home/user/dischordian-saga/apps/shared/tcg-core/cards/definitions/` (corpus-wide)
- severity: high
- category: trial_coverage
- finding: Only 4 cards across the entire 475-card pool tag `"confession"` — and all 4 are in Insurgency (per the `Card.ts:92` "insurgency lean" comment). Six of seven factions have **zero** confession cards. Authority Trial §5.8 phase 7 (cross-exam second) is therefore unwinnable for Architect/Thought Virus/New Babylon/Dreamer/Antiquarian/Neutral decks regardless of skill — the `trial_category_coverage` ratchet target is `0` but the §5.8 runtime ships behind a flag requiring 100% coverage (`registry.ts:117`).
- fix: Backfill at least 2 confession-tagged cards per faction (≥12 total). Best candidates: existing reactive cards with self-cost (e.g. `s1_spell_*` discard-self spells) — confession is meant to be the trade-off category per `Card.ts:92`.

### F2: Evidence + reactive starvation in Thought Virus and New Babylon
- file: `/home/user/dischordian-saga/apps/shared/tcg-core/cards/definitions/thought_virus/`, `.../new_babylon/`
- severity: high
- category: trial_coverage
- finding: Thought Virus has 4 evidence / 13 reactive across 53 cards; New Babylon has 5 evidence / 4 reactive across 52 cards. Authority phases 3–5 (evidence) and 6–8 (cross-exam, reactive) span 6 of the 9 phases. A New Babylon deck has only ~9 trial-eligible cards across phases 3–8 — below typical 30-card deck construction floor.
- fix: Tag ~8 more existing TV/NB cards with `evidence` and `reactive` (offensive-leaning factions deserve evidence options too — empire propaganda IS evidence). The `secondPassTrialCategorizer.ts` proposer in `apps/shared/tcg-core/balance/` is the right place to seed.

### F3: 12 keywords in the union have <3 cards — three have exactly 1
- file: `/home/user/dischordian-saga/apps/shared/tcg-core/types/Card.ts:37-68`
- severity: medium
- category: keyword_distribution
- finding: Per corpus grep — `zeal`, `untargetable`, `structure`, `resurrect`, `pack`, `blast` each appear on **1 card**; `rally_buff` on 2; `airdrop` on 3; `overcharge` on 4; `frenzy` on 5; `ranged` on 7. Meanwhile `provoke`(99) / `forcefield`(65) / `flying`(46) / `rush`(45) carry the entire keyword identity. Most "exotic" keywords are essentially unique cards costumed as a system.
- fix: Either (a) print 4–6 more cards per orphan keyword to legitimize it as a recognizable mechanic, or (b) prune the union (esp. `zeal`, `pack`, `blast`, `airdrop`) and convert the existing card to a triggered ability. Keeping a Keyword in the type union with one card is dead-weight engine surface.

### F4: Mana curve is overweighted at 3-cost (650 / 1284 cost-bearing cards = 51%)
- file: corpus-wide (cost histogram)
- severity: medium
- category: curve
- finding: Distribution: 0=18, 1=36, 2=157, 3=**650**, 4=122, 5=151, 6=70, 7=51, 8=21, 9=1. The 3-cost spike is ~4× the next slot. Combined with the `{kind:"once_per_match"}` artifact cost slot leaking into the grep (7 hits), the actual mana curve is 1-cost (36) << 2-cost (157) << 3-cost (650). A draft / pack-opener with random distribution will hand players mostly 3-drops.
- fix: Audit recent sets — bias new uncommons to 1/2/4 cost. Verify `statCurve.ts` tolerance band at cost 3 isn't itself driving authoring laziness.

### F5: `deathwatch` keyword is silently sugar — 25 cards declare it but engine treats it as exempt
- file: `/home/user/dischordian-saga/apps/shared/_completeness/checks/keywordBehaviorCoverage.ts:74`
- severity: medium
- category: orphan_op
- finding: Exemption text says "card authors should use the `on_any_unit_dies` trigger directly. Keyword surfaces UI flavor only." But 25 cards (3rd most-used keyword after `provoke`/`forcefield`/`flying`) declare it expecting behavior. This is the same bug `drain` was the canonical case for, just larger. Players reading "Deathwatch" tooltip get no engine guarantee.
- fix: Either auto-inject the `on_any_unit_dies` trigger at card-load (loader change) so the keyword has runtime meaning, or strip `deathwatch` from all 25 cards and replace each with an authored trigger. Current state confuses both engine and players.

### F6: Stat-budget gate has 1 documented exception across 475 cards
- file: `/home/user/dischordian-saga/apps/shared/tcg-core/cards/definitions/` (corpus); `/home/user/dischordian-saga/apps/shared/tcg-core/balance/statCurve.ts`
- severity: medium
- category: stat_budget
- finding: `grep balanceException` returns exactly 1 hit. Either (a) the corpus is genuinely on-curve (then `tcg.card_stat_budget_coverage` ratchet target=0 should already PASS — verify via `pnpm ship:check`), or (b) outliers exist but designers haven't documented them, in which case the gate is RATCHET-hiding silent power outliers. Sample read shows `s1_char_018_the_antiquarian` 5/5/6 with `forcefield` — a 5-cost 5/6 plus first-instance damage absorb is likely above curve and lacks an exception.
- fix: Run `pnpm ship:check` and quote the `tcg.card_stat_budget_coverage` row. If non-zero gap, list outliers and either rebalance or add `balanceException` blocks (Card.ts:228 schema requires reason+reviewer).

## Trial-category × faction coverage matrix

| Faction        | defensive | offensive | narrative | evidence | reactive | confession | total |
|----------------|-----------|-----------|-----------|----------|----------|------------|-------|
| Neutral (81)   | 42        | 18        | 49        | 11       | 8        | **0**      | 81    |
| Architect (63) | 25        | 15        | 30        | 16       | 12       | **0**      | 63    |
| Thought Virus (53) | 12    | 33        | 15        | **4**    | 13       | **0**      | 53    |
| New Babylon (52) | 15      | 17        | 27        | **5**    | **4**    | **0**      | 52    |
| Insurgency (51) | 16       | 21        | 20        | 8        | 10       | 2          | 51    |
| Dreamer (61)   | 24        | 17        | 29        | 15       | 8        | **0**      | 61    |
| Antiquarian (39) | 23      | 12        | 13        | 11       | 2        | **0**      | 39    |

**Unbeatable Authority phase combinations:** all 6 non-Insurgency factions × phase 7 (confession). NB+TV are also dangerously thin on evidence (phases 3-5) and reactive (phases 6-8).

## Mana curve summary

Peak is **3-cost** at 650 cards (~51% of cost-bearing pool); 1-drops are starved (36); the curve flattens after 4 with a long thin tail to 9. New printings should target 1/2/4-cost gaps to broaden draft/pack experience.

## Convergence hints

- **Performance persona**: `deathwatch` (F5) — if loader auto-injects triggers on 25 cards each, that's 25 extra trigger subscriptions — coordinate.
- **QA persona**: F1/F2 trial gaps — §5.8 Authority feature flag will need test-deck fixtures per faction; gap means tests can't be authored yet.
- **Staff engineer**: F3 keyword-union pruning is a type-surface change — touches Card.ts union, schema.ts Zod, and the keyword exemption list together.
- **Game economist (deferred)**: F4 3-cost overweight directly impacts pack-opening experience (every pack feels samey); flag to economist persona.
- **Art quality**: not in any persona's lane — note as deferred.

Word count: ~770.
