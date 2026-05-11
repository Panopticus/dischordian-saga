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
import { checkRecruitmentChainCoverage } from "./checks/recruitmentChainCoverage";
import { checkApprenticeDialogueCoverage } from "./checks/apprenticeDialogueCoverage";
import { checkWovenSystemRippleCoverage } from "./checks/wovenSystemRippleCoverage";
import { checkYearlyEventRuntime } from "./checks/yearlyEventRuntime";
import { checkSevenSealRuntime } from "./checks/sevenSealRuntime";
import { checkMiniDlcFiveSystemCoverage } from "./checks/miniDlcFiveSystemCoverage";
import { checkSevenSealEpigraphCoverage } from "./checks/sevenSealEpigraphCoverage";
import { checkNpcBiowareCoverage } from "./checks/npcBiowareCoverage";
import { checkNpcDialogueCoverage } from "./checks/npcDialogueCoverage";
import { checkMissionFactoryConsumerCoverage } from "./checks/missionFactoryConsumerCoverage";
import { checkLoredexMemberCarryWired } from "./checks/loredexMemberCarryWired";
import { checkPersonalQuestSubtaskAuthoring } from "./checks/personalQuestSubtaskAuthoring";
import { checkNpcBanterCommentCoverage } from "./checks/npcBanterCommentCoverage";
import { checkWheelFollowupCinematicCoverage } from "./checks/wheelFollowupCinematicCoverage";
import { checkApprenticeDoctrineCoverage } from "./checks/apprenticeDoctrineCoverage";
import { checkApprenticeAuditCoverage } from "./checks/apprenticeAuditCoverage";
import { checkApprenticeMissionCoverage } from "./checks/apprenticeMissionCoverage";
import { checkApprenticeMechronisLinkCoverage } from "./checks/apprenticeMechronisLinkCoverage";
import { checkApprenticeWardenCoverage } from "./checks/apprenticeWardenCoverage";
import { checkApprenticePedagogyAssetCoverage } from "./checks/apprenticePedagogyAssetCoverage";
import { checkBerthCoverage } from "./checks/berthCoverage";
import { checkRoomAssetCoverage } from "./checks/roomAssetCoverage";
import { checkAxis9StateCoverage } from "./checks/axis9StateCoverage";
import { checkAxis11StateCoverage } from "./checks/axis11StateCoverage";

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
  {
    id: "recruit.chain_coverage",
    name: "Recruitment chain coverage",
    description:
      "Every recruitable NPC has a complete authored chain in recruitmentQuests.ts: briefing, ≥ 3 stages with ≥ 2 choices each, all three terminal outcomes (loyal / tense / refused) reachable, no dangling stage references.",
    check: () => checkRecruitmentChainCoverage(),
  },
  {
    id: "apprentice.dialogue_coverage",
    name: "Apprentice branching dialogues",
    description:
      "Every ApprenticeArchetype has all four BioWare-style branching topics (past / calling / mortality / us) with non-empty openers, ≥ 3 entry choices per topic, and at least one choice that opens a follow-up node.",
    check: () => checkApprenticeDialogueCoverage(),
  },
  {
    id: "apprentice.doctrine_coverage",
    name: "Apprentice Doctrine creeds",
    description:
      "Every DoctrineId in apprenticeDoctrines.ts has ≥ 4 stanzas (incl. morning + at_graduation), a non-empty resonantArchetypes set, ≥ 1 permittedRole, and stanza lines ≥ 30 chars (no stubs). Hard parity — the doctrine-pick UI shows all five.",
    check: () => checkApprenticeDoctrineCoverage(),
  },
  {
    id: "apprentice.audit_coverage",
    name: "Apprentice Mechronis audits",
    description:
      "Every (ApprenticeArchetype × audit day {7,14,21}) cell has authored archetypeFlavor (≥ 10 chars). All three AUDIT_PROMPTS have non-empty question + complianceTemplate. 36 declared cells.",
    check: () => checkApprenticeAuditCoverage(),
  },
  {
    id: "apprentice.mission_coverage",
    name: "Graduate-Legion mission micro-arcs",
    description:
      "Every GraduateRole that participates in mission micro-arcs has ≥ MIN_MISSIONS_PER_ROLE entries; every mission has briefing + crisis + return + ≥ 2 choices + non-empty resonantArchetypes. Hard parity.",
    check: () => checkApprenticeMissionCoverage(),
  },
  {
    id: "apprentice.mechronis_link_coverage",
    name: "Apprentice × Mechronis pedagogical link",
    description:
      "12 mentor signatures (one per professor), 4 House archetype-weight tables (non-uniform), 4 narrative-cohort seed bands (in-range), and 12 archetype inheritance hooks (gift + line + breaking-point echo) — 32 declared cells, hard parity.",
    check: () => checkApprenticeMechronisLinkCoverage(),
  },
  {
    id: "apprentice.warden_coverage",
    name: "Apprentice Warden authoring",
    description:
      "Four sub-systems: WARDEN identity, ≥ 4 fully-authored rival recruits, audit cameo modifier across 4 classifications, and a Day-14 purge notice with all three options. Hard parity.",
    check: () => checkApprenticeWardenCoverage(),
  },
  {
    id: "apprentice.pedagogy_asset_coverage",
    name: "Apprentice pedagogy asset slots",
    description:
      "60 signature card art slots (12 archetypes × 5 doctrine motifs) each with composition + color spec, plus 4 VO line files generated by `pnpm vo:extract-pedagogy`. Hard parity — re-run the extractor when underlying TS modules change.",
    check: () => checkApprenticePedagogyAssetCoverage(),
  },
  {
    id: "berth.system_coverage",
    name: "Berth System coverage",
    description:
      "48 apprentice activity cells (12 archetypes × 4 day-phases), 5 recruit activity defaults, 5 bunkroom door entries, 4 Tier-2 portrait registrations with the bond×corruption expression palette, and 4 comm-screen resolver smoke tests across PartyMember kinds. Hard parity — total 66 declared cells.",
    check: () => checkBerthCoverage(),
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
  // ─── Tier-2/Tier-3 NPC authoring depth ──────────────────────
  {
    id: "npc.bioware_coverage",
    name: "NPC BioWare authoring per NPC",
    description:
      "Every NamedNpcKey (12 NPCs across tier-2 and tier-3) has identity (likes/dislikes/wants/signature) and a personal-quest chain matching its tier — tier-2: 3 stages with stage-3 breaking-point choices; tier-3: 1 stage cosmic encounter. Each stage declares ≥3 sub-tasks.",
    check: () => checkNpcBiowareCoverage(),
  },
  {
    id: "npc.dialogue_coverage",
    name: "NPC branching dialogues",
    description:
      "Every NamedNpcKey has all four BioWare-style topics (past/calling/mortality/us) with non-empty openers, ≥3 entry choices, and ≥1 follow-up node per topic. Hard parity.",
    check: () => checkNpcDialogueCoverage(),
  },
  // ─── Mission factory + consumer migration ────────────────────
  {
    id: "mission.factory_consumer_coverage",
    name: "Mission factory consumer coverage",
    description:
      "Every consumer that emits a CrewMissionTemplate (dailyQuests, tradeMissions, crew, collectorsWorkMissions) routes through proceduralMissionFactory.generateMission. Lands at RATCHET — full migration is the closing step of the unified-roster wave.",
    check: () => checkMissionFactoryConsumerCoverage(),
    ratchet: { target: 0 },
  },
  // ─── Per-member loredex carry wiring ─────────────────────────
  {
    id: "loredex.member_carry_wired",
    name: "Per-member loredex carry wiring",
    description:
      "Every loredex_entry_discovered emit site is observed by the rippleEngine carry handler (recordDiscovery) so the dead can stamp memorialAtCycle on unread entries on death. Lands at RATCHET — slideshow + silence-in-heaven emitters added in follow-up.",
    check: () => checkLoredexMemberCarryWired(),
    ratchet: { target: 0 },
  },
  // ─── Personal-quest sub-task authoring ───────────────────────
  {
    id: "personal_quest.subtask_authoring",
    name: "Personal-quest sub-task authoring",
    description:
      "Every (NPC | apprentice) × stage in the personal-quest chains declares ≥3 sub-tasks. Tier-2 NPCs and apprentices have 3 stages; tier-3 NPCs have a single cosmic encounter. Hard parity once apprentice authoring lands; ratcheted during rollout.",
    check: () => checkPersonalQuestSubtaskAuthoring(),
    ratchet: { target: 0 },
  },
  {
    id: "npc.banter_comment_coverage",
    name: "NPC banter + reactive-comment coverage",
    description:
      "Every NamedNpcKey has ≥3 reactive comments in NPC_REACTIVE_COMMENTS and ≥3 banter pairs in NPC_BANTER_PAIRS. Hard parity at landing; ratcheted to prevent authoring regressions.",
    check: () => checkNpcBanterCommentCoverage(),
    ratchet: { target: 0 },
  },
  {
    // audit/16 PR 4 (Cluster D — finding C1).
    // RATCHETed; PR 9 (cinematic consumers) drives the gap toward 0.
    // Initial state: 40 declared / 0 implemented; the schema lands
    // here, the per-variant cinematic IDs land in PR 9.
    id: "narrative.wheel_followup_cinematic_coverage",
    name: "wheel_followup portraitCinematicId coverage",
    description:
      "Every variant with `surface: \"wheel_followup\"` in moralityTrustActVariants.ts should set `portraitCinematicId` so the wheel followup crossfades an AnimatedPortrait. PR 4 (Cluster D) lands the schema; PR 9 (cinematic consumers) backfills the per-variant cinematic IDs.",
    check: () => checkWheelFollowupCinematicCoverage(),
    ratchet: { target: 0 },
  },
  {
    // Phase H.B — Producer-art room library integration.
    // RATCHETed; subsequent producer-art passthroughs drive the gap
    // toward 0. Initial state: 166 declared / 61 implemented
    // (37 %); 105 deferred (12 Hellboxes + 7 vehicles + 60
    // destinations + 36 of 38 apprentice spaces).
    id: "art.room_asset_coverage",
    name: "Room art coverage (producer-delivered)",
    description:
      "Every space specced in docs/production/_PRODUCTION_FINAL.md PARTs III–VIII should have at least a baseline.png in the producer-art room library (apps/shared/expansionArt/roomArtManifest.ts). Gap shrinks as subsequent producer passthroughs land; cannot regress. Initial state: 166 declared / 60 implemented (36 %); 106 deferred.",
    check: () => checkRoomAssetCoverage(),
    ratchet: { target: 0 },
  },
  {
    // Phase H.D — Axis 9 TV-infection state coverage.
    // Ratcheted; producer-art passthroughs intentionally provide
    // only "interesting" variants per room (e.g. cryo_bay has only
    // tv_spreading). compositeResolver degrades gracefully for
    // missing variants. Gap shrinks as future passes land more
    // states per room; cannot regress.
    id: "art.axis9_state_coverage",
    name: "Room art Axis 9 (TV-infection) state coverage",
    description:
      "Every room with any tv-axis variant in the producer library should ideally have all 5 canonical states (clean/exposed/spreading/corrupted/quarantined). compositeResolver omits missing variants so the runtime degrades gracefully. Initial state: producer delivered only the 'interesting' state per room (e.g. cryo_bay only ships tv_spreading).",
    check: () => checkAxis9StateCoverage(),
    ratchet: { target: 0 },
  },
  {
    // Phase H.E — Axis 11 cycle-phase coverage. Producer-art delivers
    // only `cycle_longnight` per room; full per-phase coverage
    // (dawn/midday/dusk/nightwatch + longnight) is the eventual target.
    id: "art.axis11_state_coverage",
    name: "Room art Axis 11 (cycle-phase) state coverage",
    description:
      "Every room with any cycle-axis variant in the producer library should ideally have all 5 canonical states (dawn/midday/dusk/nightwatch/longnight). Producer-art currently delivers only cycle_longnight across 30 rooms — the most narrative-relevant phase variant. compositeResolver degrades gracefully for missing phases.",
    check: () => checkAxis11StateCoverage(),
    ratchet: { target: 0 },
  },
];
