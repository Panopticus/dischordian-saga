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
import { checkVoidContrastCoverage } from "./checks/voidContrastCoverage";
import { checkCardFlavorQuality } from "./checks/cardFlavorQuality";
import { checkGlobalAlignmentMeter } from "./checks/globalAlignmentMeter";
import { checkMobileNarratorAdoption } from "./checks/mobileNarratorAdoption";
import { checkShadowTongueRoomCoverage } from "./checks/shadowTongueRoomCoverage";
import { checkCutsceneComponents } from "./checks/cutsceneComponents";
import { checkDeclaredSubsystemRuntime } from "./checks/declaredSubsystemRuntime";
import { checkGovernanceRouterPresence } from "./checks/governanceRouterPresence";
import { checkSchemaOrphanColumns } from "./checks/schemaOrphanColumns";
import { checkNotificationEnumProducers } from "./checks/notificationEnumProducers";
import { checkApprenticeAuthoringCoverage } from "./checks/apprenticeAuthoringCoverage";
import { checkCommonsSceneCoverage } from "./checks/commonsSceneCoverage";
import { checkWovenSystemRippleCoverage } from "./checks/wovenSystemRippleCoverage";
import { checkYearlyEventRuntime } from "./checks/yearlyEventRuntime";
import { checkSevenSealRuntime } from "./checks/sevenSealRuntime";
import { checkMiniDlcFiveSystemCoverage } from "./checks/miniDlcFiveSystemCoverage";
import { checkSevenSealEpigraphCoverage } from "./checks/sevenSealEpigraphCoverage";

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
      "SENTRY_DSN + OTEL_EXPORTER_OTLP_ENDPOINT wired into env with loud prod warning when unset, prom-client metrics module exposed at /metrics, tRPC procedures auto-instrumented, per-IP rate limit on /api.",
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
  // ─── Accessibility ────────────────────────────────────────
  {
    // audit/07.F5 — Void Energy fg/bg token pairs must hit WCAG AA
    // contrast. Currently a RATCHET starting at the worst case
    // (zero pairs measured) — populated by scripts/audit-contrast.ts
    // (planned) which renders the page in headless Chrome and reads
    // computed colours.
    id: "a11y.void_contrast_coverage",
    name: "Void Energy contrast coverage",
    description:
      "Every fg/bg pair in apps/shared/_completeness/checks/voidContrastCoverage.ts TOKEN_PAIRS has a measured WCAG contrast ratio above its threshold (≥4.5 for normal text, ≥3 for large).",
    check: () => checkVoidContrastCoverage(),
    ratchet: { target: 0 },
  },
  // ─── Content quality ──────────────────────────────────────
  {
    // audit/11.F4 — sweep boilerplate "Of the X." / "Outside every
    // faction…" placeholder flavors. Wave 3.3 closed 409; class/
    // imprint/allegiance lines remain.
    id: "content.card_flavor_quality",
    name: "Card flavor-text quality",
    description:
      "Every card with flavorText has length ≥20 and does not match a known boilerplate template (see apps/shared/_completeness/checks/cardFlavorQuality.ts BOILERPLATE_PATTERNS).",
    check: () => checkCardFlavorQuality(),
    ratchet: { target: 0 },
  },
  // ─── Narrative — designs the gate did not previously cover ───
  // Added 2026-05-08 alongside docs/design/INCOMPLETE_DESIGNS_AUDIT_2026-05-08.md.
  // Each entry surfaces a documented design that lacks runtime — the
  // mechanical-gate counterparts to the audit's prose findings. New
  // entries land RATCHET on first run; ship:check --update-ratchet
  // records the seed ceiling. Closing them = building the runtime.
  {
    id: "narrative.global_alignment_meter",
    name: "Global Light/Dark meter",
    description:
      "NARRATIVE_ARCHITECTURE.md §0 calls for a server-aggregated Light/Dark meter that the Hierarchy invasion cadence and Architect events read from. Per-player morality exists; the global aggregate does not. Tracks four artifacts: schema column, server aggregator, tRPC reader, client component.",
    check: () => checkGlobalAlignmentMeter(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.mobile_narrator_adoption",
    name: "Mobile Narrator page adoption",
    description:
      "MobileNarratorSlot ships full runtime but only one page mounts it. Each page in EXPECTED_NARRATOR_PAGES is a design-mandated narrator surface — adding a page is a design decision, removing one without justification is a regression.",
    check: () => checkMobileNarratorAdoption(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.shadow_tongue_room_coverage",
    name: "Shadow Tongue room coverage",
    description:
      "STREAMED_PRISM_MYSTERY_ENGINE.md §1 enumerates 26 universal + 6 species-exclusive rooms. Every room must (a) be registered in ROOM_MYSTERY_REGISTRY and (b) have a non-empty source module. Catches dead-click rooms.",
    check: () => checkShadowTongueRoomCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.cutscene_components",
    name: "Animated cutscene components",
    description:
      "ANIMATED_CUTSCENES.md names five cutscenes (Awakening, First Human Contact, Elara Memory Recovery, Breaking Point, Thought Virus Manifests). Each must have a component or registered literal id in apps/client/src — otherwise the named beat fires nothing.",
    check: () => checkCutsceneComponents(),
    ratchet: { target: 0 },
  },
  // ─── Declared subsystems — designs landed in docs, not code ──
  {
    id: "design.declared_subsystem_runtime",
    name: "Declared subsystem runtime",
    description:
      "Three large designs (Soul Stones, Pet Breeding, Living Character Sheet) are documented but unbuilt. Tracks 11 runtime artifacts (schema tables, shared modules, tRPC routers, client components). Each missing artifact is a piece of design with no runtime.",
    check: () => checkDeclaredSubsystemRuntime(),
    ratchet: { target: 0 },
  },
  // ─── Governance ──────────────────────────────────────────────
  {
    id: "server.governance_router_present",
    name: "Governance Hub router presence",
    description:
      "GovernanceHubPage.tsx must keep its tRPC wiring (no MOCK_ literal regression) and the architectConsole router must keep getActiveVotes + submitVote. Page-side and server-side move together.",
    check: () => checkGovernanceRouterPresence(),
  },
  // ─── Schema hygiene ──────────────────────────────────────────
  {
    id: "schema.no_orphan_columns",
    name: "No orphan columns in live tables",
    description:
      "Tracked columns (currently characterSheets.avatarUrl) must have at least one consumer outside apps/db/. Adding a new orphan-prone column to a live table = adding a row here.",
    check: () => checkSchemaOrphanColumns(),
    ratchet: { target: 0 },
  },
  {
    id: "schema.notification_enum_producers",
    name: "notifications.type producers",
    description:
      "Every variant in the notifications.type enum must have at least one `type: \"<variant>\"` writer in apps/server/. Catches enum members the engine renders for but the server never emits.",
    check: () => checkNotificationEnumProducers(),
    ratchet: { target: 0 },
  },
  // ─── Apprentice authoring depth ──────────────────────────────
  {
    id: "apprentice.authoring_coverage",
    name: "Apprentice authoring per archetype",
    description:
      "Every ApprenticeArchetype has identity, ≥ 1 banter pair, ≥ 2 reactive comments, ≥ 1 gift catalog match, ≥ 1 commons scene, and 2 VO line files (female + male).",
    check: () => checkApprenticeAuthoringCoverage(),
    // Hard parity target — but ratcheted during the rollout pass.
    // Once every archetype is fully covered the ratchet config is
    // removed and the gate becomes hard parity.
    ratchet: { target: 0 },
  },
  {
    id: "commons.scene_coverage",
    name: "Commons scene pairing coverage",
    description:
      "Every (archetype × archetype) and (archetype × recruited-NPC) pairing has at least one scene in commonsScenePool.ts. Triads count for all three pairwise edges.",
    check: () => checkCommonsSceneCoverage(),
    // Ratcheted — full coverage is a long-tail authoring goal; the
    // gate enforces no-regress as the pool grows.
    ratchet: { target: 0 },
  },
  // ─── World — woven-systems integration (the Two-Ripple Rule) ──
  // Added 2026-05-08 alongside docs/design/INCOMPLETE_DESIGNS_AUDIT
  // follow-up. WOVEN_SYSTEMS registry declares 17 surfaces; ripple-
  // engine wiring is audited per declared emit.
  {
    id: "world.woven_two_ripple_rule",
    name: "Woven systems Two-Ripple Rule",
    description:
      "Every WovenSystem.primaryEmits event must have ≥ 2 cross-system handler registrations in rippleEngine.ts carrying a `// woven: <fromId> -> <toId>` comment. Lands at RATCHET; closes when wovenOn() helper + handler tagging catches up to the 17-system registry.",
    check: () => checkWovenSystemRippleCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "world.yearly_event_runtime",
    name: "Yearly event runtime",
    description:
      "The four canonical yearly anchors (Foundation Day, Severance, Mechronis Festival, Memorial Day) require shared definition + server router + scheduler service + DB schema. Lands at RATCHET — only the shared definition exists today.",
    check: () => checkYearlyEventRuntime(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.seven_seal_runtime",
    name: "Seven Seals canon",
    description:
      "Hard parity on the seven-seals data structure: 7 entries, seals I–IV bind to the four horsemen in order, seals IV/V declare unlocksYearly, every seal carries a non-empty fallSummary. The actual epigraph prose is content authored separately.",
    check: () => checkSevenSealRuntime(),
  },
  {
    id: "narrative.mini_dlc_five_system_coverage",
    name: "Mini-DLC five-system coverage",
    description:
      "Every mini-DLC manifest under apps/shared/dlc/chapters/**/manifest.ts must declare the five required refs (mystery seed, transmission track, custom item, guild contract, governance motion). Lands at RATCHET; back-catalog manifests need backfill in a follow-up.",
    check: () => checkMiniDlcFiveSystemCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.seven_seal_epigraphs",
    name: "Seven Seals Daniel Cross epigraphs",
    description:
      "Every seal in apps/shared/sevenSeals.ts must have an authored epigraph in apps/shared/sevenSealsEpigraphs.ts (openingLine ≤ 80 chars, body 200–600 chars, attribution + citation non-empty). Hard parity — missing epigraphs degrade the SealEpigraphCinematic to the fall-summary fallback.",
    check: () => checkSevenSealEpigraphCoverage(),
  },
];
