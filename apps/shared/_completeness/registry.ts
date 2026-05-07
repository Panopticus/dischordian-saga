/**
 * Completeness gate — registry.
 *
 * Add subsystems here as their parity checks land. The harness
 * (`scripts/ship-check.ts`) iterates this list and the matching vitest
 * suite (`apps/shared/_completeness/registry.test.ts`) keeps the entries
 * well-formed.
 *
 * Each entry's `check` function does its own scanning and returns a
 * {@link RawParityCount}. The harness folds in PASS/FAIL/RATCHET status
 * from the count and the entry's ratchet config — check functions do
 * NOT compute their own status.
 */
import type { CompletenessEntry } from "./types";
import { checkEffectOpCoverage } from "./checks/effectOpCoverage";
import { checkConditionKindCoverage } from "./checks/conditionKindCoverage";
import { checkTriggerKindCoverage } from "./checks/triggerKindCoverage";
import { checkKeywordBehaviorCoverage } from "./checks/keywordBehaviorCoverage";
import { checkUnlockConditionUICoverage } from "./checks/unlockConditionUICoverage";
import { checkCardStatBudgetCoverage } from "./checks/cardStatBudgetCoverage";
import { checkNarrativeFlagBridgeCoverage } from "./checks/narrativeFlagBridgeCoverage";
import { checkTrialCategoryCoverage } from "./checks/trialCategoryCoverage";
import { checkLoreBibleDrift } from "./checks/loreBibleDrift";
import { checkObservabilityWiring } from "./checks/observabilityWiring";
import { checkDbForeignKeyCoverage } from "./checks/dbForeignKeyCoverage";
import { checkEconomicTransactionCoverage } from "./checks/economicTransactionCoverage";
import { checkMobileWiring } from "./checks/mobileWiring";
import { checkListVirtualizationAdoption } from "./checks/listVirtualizationAdoption";
import { checkAssetPrefetchManifest } from "./checks/assetPrefetchManifest";
import { checkProcedureRateLimits } from "./checks/procedureRateLimits";

export const COMPLETENESS_REGISTRY: ReadonlyArray<CompletenessEntry> = [
  // ─── Card engine ──────────────────────────────────────────
  {
    id: "tcg.effect_op_coverage",
    name: "effect.op handlers",
    description:
      "Every Effect op declared in apps/shared/tcg-core/types/Effect.ts has a `case` branch in engine/effectInterpreter.ts.",
    check: () => checkEffectOpCoverage(),
  },
  {
    id: "tcg.condition_kind_coverage",
    name: "Condition.kind handlers",
    description:
      "Every Condition kind declared in Effect.ts has a `case` branch in engine/conditions.ts.",
    check: () => checkConditionKindCoverage(),
  },
  {
    id: "tcg.trigger_kind_coverage",
    name: "Trigger.kind dispatchers",
    description:
      "Every Trigger kind declared in apps/shared/tcg-core/types/Trigger.ts has at least one `trigger.kind === \"<kind>\"` dispatch site in the engine.",
    check: () => checkTriggerKindCoverage(),
    // Ratcheted during Part B rollout. End state is hard parity
    // (gap === 0 → PASS). Removing the ratchet config is the final
    // step of the Part B work, after passive_aura's continuous-
    // evaluation pass lands.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.keyword_behavior_coverage",
    name: "Keyword combat behaviors",
    description:
      "Every keyword in the Keyword union (Card.ts) is queried by at least one engine source file. Exempt keywords are listed in checks/keywordBehaviorCoverage.ts with a documented reason.",
    check: () => checkKeywordBehaviorCoverage(),
    // Ratcheted during Part B rollout. drain ships first (canonical
    // dead-keyword case); the ~11 other unimplemented keywords get
    // triaged one-by-one — either implemented or moved to the
    // KEYWORD_BEHAVIOR_EXEMPT allowlist with a documented reason.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.unlock_condition_ui_coverage",
    name: "CardUnlockCondition UI surfaces",
    description:
      "Every CardUnlockCondition kind is named as a string literal somewhere in apps/client/src/ — proves the player can see why a card unlocked.",
    check: () => checkUnlockConditionUICoverage(),
    // founding_author and authors_edition currently have no UI;
    // closed in Part E (mobile / collection surface) but the row
    // sits visible until then.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.card_stat_budget_coverage",
    name: "Card stat-budget compliance",
    description:
      "Every unit/structure card is either within the per-cost tolerance window from balance/statCurve.ts OR carries an explicit `balanceException: { reason, reviewer }`. Off-curve cards without an exception are silent power-curve outliers.",
    check: () => checkCardStatBudgetCoverage(),
    // Existing card pool has known outliers (the OVER/UNDER lines
    // already printed by balance/balanceAudit.ts). Ratcheted at
    // landing; tightens as designers either rebalance or add
    // documented exceptions.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.narrative_flag_bridge_coverage",
    name: "Narrative→TCG flag bridge",
    description:
      "Every flag name read by expansionUnlockService.ts (act_N_complete + secret_act_N_revealed for N=1..7) has a setNarrativeFlag(...) writer somewhere in apps/. Without writers, gated cards are permanently locked.",
    check: () => checkNarrativeFlagBridgeCoverage(),
    // Half of the bridge is shipped (act_N_complete writers exist
    // in useNarrativeIntegration.ts), the other half (secret_act_N_revealed)
    // has no writers yet. Ratcheted; closes when secret-reveal hooks
    // land.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.trial_category_coverage",
    name: "trial_categories coverage",
    description:
      "Every non-token, non-reserved CardDefinition declares a non-empty trial_categories array. Cards without categories are unplayable in the §5.8 Authority trial finale (docs/production/act1/authority-trial-phase-mechanic.md).",
    check: () => checkTrialCategoryCoverage(),
    // Backfill is the bulk of the work; ratcheted at landing,
    // tightens per-card as designers fill in the categories. The
    // §5.8 runtime ships behind a feature flag that requires 100%
    // coverage.
    ratchet: { target: 0 },
  },
  // ─── DB ───────────────────────────────────────────────────
  {
    id: "db.foreign_key_coverage",
    name: "DB foreign-key coverage",
    description:
      "Every int FK-shaped column (`*Id` / `*_id`) in apps/db/schema.ts declares `.references()` — the difference between 'type says int' and 'database rejects orphans.' Ratcheted; tightens as plan §C2 backfills land.",
    check: () => checkDbForeignKeyCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "db.economic_transaction_coverage",
    name: "Economic surfaces are transactional",
    description:
      "Every server router that mutates a currency balance (dream / void_crystals / gems / credits / store_purchases) wraps its mutation in db.transaction(...). Ratcheted; 12 routers found to touch currency surfaces without wrapping at landing — each needs per-router care to pick the right isolation level, see the route-by-route plan in the C3 PR.",
    check: () => checkEconomicTransactionCoverage(),
    ratchet: { target: 0 },
  },
  // ─── Server / abuse surfaces ──────────────────────────────
  {
    id: "server.procedure_rate_limits",
    name: "Per-procedure rate limits",
    description:
      "procedureRateLimit factory exists + applied to high-risk mutations: store.createCheckout, cardGame.createDeck, cardGame.updateDeck, account.acceptAgreement. Hard parity — removing the decoration silently degrades abuse defense.",
    check: () => checkProcedureRateLimits(),
  },
  // ─── Server / observability ───────────────────────────────
  {
    id: "server.observability_wiring",
    name: "Observability wiring",
    description:
      "SENTRY_DSN + OTEL_EXPORTER_OTLP_ENDPOINT required in env (fail-fast in prod), prom-client metrics module exposed at /metrics, tRPC procedures auto-instrumented, per-IP rate limit on /api.",
    check: () => checkObservabilityWiring(),
  },
  // ─── Mobile / native ──────────────────────────────────────
  {
    id: "client.mobile_wiring",
    name: "Native-mobile wiring",
    description:
      "Capacitor scaffold (config, mobile:* scripts), payment adapter (web Stripe + native RevenueCat), server iapReceipt router mounted, list-virtualization helper, canvas touch-action class, LockedCardBadge UI component.",
    check: () => checkMobileWiring(),
  },
  {
    id: "client.list_virtualization_adoption",
    name: "List virtualization adoption",
    description:
      "Pages declared in checks/listVirtualizationAdoption.ts ADOPTED_LIST_PAGES still import useListVirtualizer. Catches accidental removal during refactors.",
    check: () => checkListVirtualizationAdoption(),
  },
  {
    id: "client.asset_prefetch_manifest",
    name: "Asset prefetch manifest",
    description:
      "Route-aware prefetch: ASSET_MANIFEST + prefetchRouteAssets exist in apps/client/src/lib/assetPrefetch.ts and App.tsx wires the call into wouter's useLocation() listener.",
    check: () => checkAssetPrefetchManifest(),
  },
  // ─── Lore ─────────────────────────────────────────────────
  {
    id: "lore.bible_drift",
    name: "LORE_BIBLE.md drift",
    description:
      "docs/built/LORE_BIBLE.md exactly matches scripts/generate-lore-bible.ts output from apps/client/src/data/loredex-data.json. The MD is a generated artifact; loredex-data.json is canonical.",
    check: () => checkLoreBibleDrift(),
  },
];
