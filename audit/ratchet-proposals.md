# Ratchet Proposals — 2026-05-07

The 14 convergent findings produce 11 candidate ship-check ratchets. These are mechanical parity checks for `apps/shared/_completeness/registry.ts` — each one converts a "manual review caught this" finding into a "CI catches this every PR" guarantee.

Per CLAUDE.md: *"Adding new declared types/enums/registries requires a parity test in the same change."* The methodology proposes that every systemic finding raised by ≥2 personas land as a ratchet, not a tracking issue. The ratchet system has no mode for "we tracked this but never landed it" — that's exactly what makes it the right lever.

All proposed ratchets are **RATCHET-mode** at landing (record current gap as ceiling, can only tighten). None should land as PASS-required without a stabilization period.

---

## R1 — `security.public_procedure_rate_limit_coverage`

**Source**: C-02 (security + perf + economist)
**File**: `apps/shared/_completeness/checks/publicProcedureRateLimit.ts` (new)
**Declared**: count of `publicProcedure(` and `protectedProcedure(` callsites under `apps/server/routers/**` *that mutate state* (heuristic: any procedure with `.input(...)` whose router file also has `db.update|db.insert|db.delete`).
**Implemented**: count of those that also include `.use(procedureRateLimit({...}))` in the procedure chain.
**Initial gap (today)**: ~175 (4 of 199).
**Drive direction**: down — every PR adding a mutating procedure must add a rate limit or lower the ceiling.
**Edge cases**: read-only queries are exempt; admin-only procedures gated by `requireAdmin` middleware are exempt; LLM/external-cost procedures (`elara.chat`) are *not* exempt — they need their own bucket.

```ts
// scaffolding for the parity check
import { Project } from "ts-morph";
export function checkPublicProcedureRateLimit() {
  const project = new Project({ tsConfigFilePath: "tsconfig.json" });
  const router = project.getSourceFiles("apps/server/routers/**/*.ts");
  let declared = 0, implemented = 0;
  for (const file of router) {
    const text = file.getFullText();
    const procedures = [...text.matchAll(/\.(mutation|input)\(/g)].length;
    const limited = [...text.matchAll(/procedureRateLimit\(/g)].length;
    declared += procedures;
    implemented += Math.min(limited, procedures);
  }
  return { declared, implemented, gap: declared - implemented };
}
```

## R2 — `db.economic_transaction_coverage` (extend existing)

**Source**: C-05 (DB + economist)
**Existing entry**: `db.economic_transaction_coverage: 12` already exists in `ratchet-state.json`.
**Action**: keep the entry; tighten the ceiling as each named callsite (cardGame.ts:548/1749/1907; marketplace.ts:155/548/663/686) gains a `db.transaction()` wrap.
**Drive direction**: 12 → 0 over the milestone.
**Bonus**: extend to also count `marketplace.placeBid` and `currencyExchange` mutations as "economic" (currently the heuristic may miss them).

## R3 — `db.foreign_key_coverage` (tighten existing)

**Source**: C-07 (DB + security)
**Existing entry**: `db.foreign_key_coverage: 301`.
**Action**: ratchet downward as each tier ships (tier 1 cascade ≈ 50 columns; tier 2 restrict ≈ 30; tier 3 restrict ≈ 20). Realistic 30-day target: 200.
**Edge cases**: cross-bounded-context columns (e.g. analytics-only `userId`) explicitly noted in a `fkExemptions.ts` allowlist with a justification per row.

## R4 — `client.replay_determinism_in_engine_path`

**Source**: C-01 (staff eng + economist)
**File**: `apps/shared/_completeness/checks/replayDeterminism.ts` (new)
**Declared**: count of files under `apps/server/routers/cardGame.ts`, `apps/server/routers/chess.ts`, and any future game-mode router.
**Implemented**: count of those files that contain ZERO occurrences of `Math.random` and at least one import from `@shared/tcg-core/engine`.
**Initial gap**: 1 (cardGame.ts:1266 + parallel combat).
**Drive direction**: 1 → 0 in the same PR as C-01 fix.

## R5 — `tcg.narrative_flag_consumer_coverage`

**Source**: C-12 (rpg designer + writer + tcg + lore enthusiast)
**File**: `apps/shared/_completeness/checks/narrativeFlagConsumer.ts` (new)
**Declared**: unique flag names appearing in `requiredFlags:` of `VARIANT_REGISTRY` and in `cross_arc_*` choice weights of `episodeMysteries.ts`.
**Implemented**: subset where at least one *page-level* component (`apps/client/src/pages/*.tsx`) reads the flag for non-cosmetic effect (heuristic: not just a `pathSuffix` string concat).
**Initial gap**: ~50 unique flags, ~5 actually consumed.
**Drive direction**: 50→0 over a milestone.
**Note**: the existing `tcg.narrative_flag_bridge_coverage` ratchet covers the *producer* side; this complements it on the *consumer* side.

## R6 — `tcg.card_flavor_quality`

**Source**: C-12 (writer F4)
**File**: `apps/shared/_completeness/checks/cardFlavorQuality.ts` (new)
**Declared**: 464 card definitions.
**Implemented**: count of cards whose `flavorText` matches:
- `length >= 20`, AND
- does NOT match `/^Of the [a-z]+\.$/`, AND
- does NOT match `/^TODO|^FIXME|^Placeholder/i`.
**Initial gap**: ~214 (the s1_pack2 stubs).
**Drive direction**: 214 → 0 as a writing pass lands.

## R7 — `client.public_url_via_assetUrl`

**Source**: baseline (1,458 hardcoded CloudFront URLs in code; C-12 alignment)
**File**: `apps/shared/_completeness/checks/assetUrlCoverage.ts` (new)
**Declared**: count of `https://d2xsxph8kpxj0f.cloudfront.net/` and `https://dgrsart.s3` and `https://dgrsvoices.s3` literal occurrences in `apps/**/*.ts`/`*.tsx`.
**Implemented**: count of those that pass through `assetUrl(` or a typed manifest helper.
**Initial gap**: ~1,500+ (today only ~30% of asset references go through assetUrl).
**Drive direction**: down. Hard ceiling at landing; PRs that add raw URLs without a helper bump the gap.
**Note**: this is the prerequisite for changing the CDN host without a 1,500-file diff.

## R8 — `a11y.axe_violation_count`

**Source**: C-09 + 07.F1/F2/F3 (a11y + qa + devops)
**File**: `apps/shared/_completeness/checks/axeCoverage.ts` (new)
**Declared**: count of route-level pages under `apps/client/src/pages/*.tsx` (~70).
**Implemented**: count of pages covered by an axe assertion in `apps/e2e/accessibility-audit.spec.ts` that runs without `test.skip` and asserts `violations.length === 0` (not `≥ 0`).
**Initial gap**: ~67 (3 covered: /, /terms, /privacy).
**Drive direction**: down. Requires E2E_AUTH_OPEN_ID fixture in CI to make it meaningful.

## R9 — `tests.golden_path_router_coverage`

**Source**: C-09 (qa F1)
**File**: `apps/shared/_completeness/checks/routerGoldenPath.ts` (new)
**Declared**: count of `*.ts` files under `apps/server/routers/` that export a router (heuristic: contains `t.router({` or `createTRPCRouter`).
**Implemented**: count of those with at least one adjacent `*.test.ts` whose tests assert at least one happy-path call returning data (not just `expect(constants).toBeTruthy()` shape).
**Initial gap**: ~143 (22 of 165).
**Drive direction**: down. Pair with the integration-test fixture from C-09.

## R10 — `mobile.sku_parity_coverage`

**Source**: 08.F3 (mobile)
**File**: `apps/shared/_completeness/checks/skuParity.ts` (new)
**Declared**: count of entries in `apps/shared/store/skuCatalog.ts` (after creating it).
**Implemented**: count of entries with all three of `stripePriceId`, `iosProductId`, `androidProductId` populated (or explicit `webOnly: true`).
**Initial gap**: catalog doesn't exist yet — first scaffold the catalog, then ratchet it.

## R11 — `tcg.faction_keyword_trial_set_parity`

**Source**: 16.F1 (modder) + 09.F3 (tcg)
**File**: `apps/shared/_completeness/checks/typeUnionParity.ts` (new — five-line check, high leverage)
**Declared**: union of values in:
- `factionSchema` (Zod) ∪ `Faction` (TS union)
- `keywordSchema` ∪ `Keyword`
- `trialCategorySchema` ∪ `TrialCategory`
- `EFFECT_OP_HANDLERS` keys ∪ `EffectOp` discriminator literals
**Implemented**: intersection of each pair.
**Initial gap**: at least 1 (Faction: `panopticon` in Zod, missing from TS).
**Drive direction**: down. This is the modder-flagged "schema-validates-the-type" invariant guard; same template covers the four parallel cases.

---

## Adoption order

Land the ratchets as new `registry.ts` entries in this order, each with a single PR:

1. **R11** — five lines, immediate value, no behavior change.
2. **R4** — one cardGame.ts fix, then the ratchet pins it green.
3. **R6** — runs against existing data, immediately discovers the 214.
4. **R7** — runs against existing data, immediately discovers the ~1,500.
5. **R10** — first ship the catalog, then the ratchet.
6. **R9** + **R8** — these need integration test + auth fixture infra (from C-09); land after.
7. **R1** — large, controversial; needs codeowner sign-off on the heuristic.
8. **R5** — large; depends on C-12 wiring landing.
9. **R2/R3** — already exist; just tighten as fixes ship.

**Net effect**: 8 new ratchets, 2 tightenings. After this, the audit's convergent findings are no longer "tracked" — they're "gated."

## Anti-pattern guardrails

CLAUDE.md warns: *"Patterns I (Claude) infer from file structure are not equivalent to patterns I read from source. The gate makes 'is the runtime actually wired' a mechanical check."*

These ratchets must obey the same discipline. Specifically:

- **R1** (rate limits) must verify the rate limit is on the *procedure chain*, not just imported. Imports are necessary but not sufficient.
- **R7** (assetUrl) must not pass on `// asset urls intentionally hardcoded` style escapes. If exemption is needed, an allowlist file with reason per entry, not a comment annotation.
- **R10** (SKU) was specifically called out by mobile persona F2 as the anti-pattern: *"ship-check passing on file existence not runtime."* The ratchet must verify the catalog is *imported* by store.ts and iapReceipt.ts, not just that the file exists.
- **R8** (axe) must require `violations.length === 0`, not `>= 0`. The current `accessibility-audit.spec.ts:348` shows how easily this can be tautological.

If a ratchet's check function can be satisfied by adding a no-op file, the check is wrong and should be rewritten.
