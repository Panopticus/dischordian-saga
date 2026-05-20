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
import { checkCanvasTouchActionAdoption } from "./checks/canvasTouchActionAdoption";
import { checkSafeAreaInsetAdoption } from "./checks/safeAreaInsetAdoption";
import { checkEconomicMutationReachability } from "./checks/economicMutationReachability";
import { checkFirstPurchaseGateAdoption } from "./checks/firstPurchaseGateAdoption";
import { checkFtueFunnelInstrumentation } from "./checks/ftueFunnelInstrumentation";
import { checkPvpScoreResubmitGuard } from "./checks/pvpScoreResubmitGuard";
import { checkTouchTargetFloor } from "./checks/touchTargetFloor";
import { checkRefundClawback } from "./checks/refundClawback";
import { checkIapReceiptOwnership } from "./checks/iapReceiptOwnership";
import { checkVipSubscription } from "./checks/vipSubscription";
import { checkNativeHaptics } from "./checks/nativeHaptics";
import { checkNativeOrientation } from "./checks/nativeOrientation";
import { checkNativeShell } from "./checks/nativeShell";
import { checkSagaLedgerHumanizerCoverage } from "./checks/sagaLedgerHumanizerCoverage";
import { checkWinbackOffer } from "./checks/winbackOffer";
import { checkSessionEndCliffhanger } from "./checks/sessionEndCliffhanger";
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
import { checkAxis12StateCoverage } from "./checks/axis12StateCoverage";
import { checkStoryHookCoverage } from "./checks/storyHookCoverage";
import { checkHotspotCoverage } from "./checks/hotspotCoverage";
import { checkRoomReachabilityCoverage } from "./checks/roomReachabilityCoverage";
import { checkExpansionCutsceneCoverage } from "./checks/expansionCutsceneCoverage";
import { checkNewArtDropCoverage } from "./checks/newArtDropCoverage";
import { checkCardArtWellFormed } from "./checks/cardArtWellFormed";
import { checkHumanWhisperRoomCoverage } from "./checks/humanWhisperRoomCoverage";
import { checkMascoteerFileAuthorityCoverage } from "./checks/mascoteerFileAuthorityCoverage";
import { checkMascoteerFileSurfaceLocation } from "./checks/mascoteerFileSurfaceLocation";
import { checkWatchersEyesDispatchSurfaceLocation } from "./checks/watchersEyesDispatchSurfaceLocation";
import { checkHumanReactionRoomCoverage } from "./checks/humanReactionRoomCoverage";
import {
  checkNemesisPoliticianTicCoverage,
  checkNemesisPlanKindHandlerCoverage,
  checkNemesisEncounterKindHandlerCoverage,
  checkNemesisSurfaceIntegrationCoverage,
  checkNemesisArchetypeBehaviorCoverage,
  checkNemesisArchetypePairDialogCoverage,
  checkApprenticeOnNemesisPairDialogCoverage,
  checkNemesisFactionAlignmentCoverage,
  checkNemesisScenePerPairCoverage,
  checkApprenticeScenePerPairCoverage,
  checkNemesisWave4TriggerCoverage,
  checkNemesisAxisConflictDeepening,
} from "./checks/nemesisCoverage";
import { checkOcularumCellCoverage } from "./checks/ocularumCellCoverage";
import { checkNonCoordinationPactIntegrity } from "./checks/nonCoordinationPactIntegrity";
import { checkZodSchemaUnionParity } from "./checks/zodSchemaUnionParity";
import { checkFlagPrefixWriterParity } from "./checks/flagPrefixWriterParity";
import { checkNinjaOcularumStageCoverage } from "./checks/ninjaOcularumStageCoverage";
import { checkPreLockeCoordinatorCoverage } from "./checks/preLockeCoordinatorCoverage";
import { checkDreamerArchitectTwinBind } from "./checks/dreamerArchitectTwinBind";
import { checkMysteryEngineRosterCoverage } from "./checks/mysteryEngineRosterCoverage";
import { checkMysteryClueBindingCoverage } from "./checks/mysteryClueBindingCoverage";
import { checkMysteryClueFoundInParity } from "./checks/mysteryClueFoundInParity";
import { checkCodexRosterCoverage } from "./checks/codexRosterCoverage";
import { checkGameModeNarrativePremiseCoverage } from "./checks/gameModeNarrativePremiseCoverage";
import { checkImprintFirstSummonCutsceneCoverage } from "./checks/imprintFirstSummonCutsceneCoverage";
import { checkImprintCardsCarryUnlockCondition } from "./checks/imprintCardsCarryUnlockCondition";
import { checkContinuingLoopEndgameCoverage } from "./checks/continuingLoopEndgameCoverage";
import { checkServantHeroDeferralCoverage } from "./checks/servantHeroDeferralCoverage";
import { checkSurfaceDiscoverabilityCoverage } from "./checks/surfaceDiscoverabilityCoverage";
import { checkNarrativeSpineCoverage } from "./checks/narrativeSpineCoverage";
import { checkSpineDoorwayCoverage } from "./checks/spineDoorwayCoverage";
import { checkQuestlineRegistryCoverage } from "./checks/questlineRegistryCoverage";
import { checkDailySessionLoopCoverage } from "./checks/dailySessionLoopCoverage";
import { checkMasteryTrackCoverage } from "./checks/masteryTrackCoverage";
import { checkRpgStaplesCoverage } from "./checks/rpgStaplesCoverage";
import { checkPerspectiveCanonCoverage } from "./checks/perspectiveCanonCoverage";
import { checkProphecyTarotCoverage } from "./checks/prophecyTarotCoverage";
import { checkActCloseCutsceneCoverage } from "./checks/actCloseCutsceneCoverage";
import { checkResurrectionCinematicCoverage } from "./checks/resurrectionCinematicCoverage";
import { checkTheComingCoverage } from "./checks/theComingCoverage";
import { checkVortexTerminusCoverage } from "./checks/vortexTerminusCoverage";
import { checkPetOriginCoverage } from "./checks/petOriginCoverage";
import { checkReplayDeterminismGuard } from "./checks/replayDeterminismGuard";
import { checkStoreSkuParity } from "./checks/storeSkuParity";
import {
  checkNeyonCanonicalRosterCoverage,
  checkArchonCanonicalRosterCoverage,
  checkHierarchyCanonicalRosterCoverage,
  checkCasinoHeistCrewCoverage,
  checkIdentityCollisionLock,
  checkEraTimelineCoverage,
  checkAuthorityFounderCoverage,
  checkMechronisGuildBindingCoverage,
} from "./checks/canonCoverage";

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
      "PROCEDURE-LEVEL (Persistence F8): every tRPC procedure that writes a currency balance must wrap its debit+grant(+ledger) sequence in db.transaction(...) — unless it delegates to a self-transacting fulfillment helper or its only money write is a single atomic conditional UPDATE (no partial-failure window). The prior file-level check passed a file if it had db.transaction() anywhere, masking unwrapped procedures in 'covered' files. Switching to procedure-level surfaced a pre-existing gap of 12; the ratchet ceiling was deliberately re-seeded 0→12 (documented in PR, not silenced — same as trial_categories seeding). Target 0; tightens as transaction-wrapping PRs land.",
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
  {
    id: "server.replay_determinism_guard",
    name: "Replay determinism guard",
    description:
      "Persistence F1/F2: the RULES_VERSION/replay-pin contract must be wired, not doc-only — replay execution gated on versionCompatible, the server verifier reads rulesVersion, and replay.test.ts pins a literal final-state hash. Ratcheted: surfaces the currently-unwired determinism gap as a mechanical, non-regressing row (audit's prescribed first step) until the engine is pinned/gated.",
    check: () => checkReplayDeterminismGuard(),
    ratchet: { target: 0 },
  },
  {
    id: "economy.store_sku_parity",
    name: "Store SKU parity (web/iOS/Android)",
    description:
      "Balance F7: every real-money product (priceUsd > 0) in products.ts must carry web/iOS/Android store SKUs in a server-side catalog cross-checked by iapReceipt. CLAUDE.md's definition-of-shipped lists this; it was tracked-not-shipped. Ratcheted: surfaces the full SKU-mapping gap mechanically until the catalog lands.",
    check: () => checkStoreSkuParity(),
    ratchet: { target: 0 },
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
    id: "client.canvas_touch_action_adoption",
    name: "Interactive canvas touch-action adoption",
    description:
      "Every interactive game canvas in checks/canvasTouchActionAdoption.ts INTERACTIVE_CANVASES carries a touch-action:none boundary (game-canvas-mount / touch-none / FightEngine2D). Closes the mobileWiring probe-#6 gap: CSS rule declared but not applied.",
    check: () => checkCanvasTouchActionAdoption(),
  },
  {
    id: "client.safe_area_inset_adoption",
    name: "Safe-area inset adoption",
    description:
      "Full-bleed game surfaces in checks/safeAreaInsetAdoption.ts SAFE_AREA_SURFACES apply safe-area-top (audit/08.F5). Closes the hollow-tracking gap: .safe-area-* declared in index.css but never applied to the notch-overlapping HUDs.",
    check: () => checkSafeAreaInsetAdoption(),
  },
  {
    id: "client.economic_mutation_reachability",
    name: "Economic mutation client reachability",
    description:
      "Every marquee economic mutation in checks/economicMutationReachability.ts ECONOMIC_MUTATIONS has a non-test client useMutation caller. Closes the 'transactional server logic exists but no front door' gap — prestige.execute (the NG+ loop) was backend-only until wired into PrestigeCycleResetPage.",
    check: () => checkEconomicMutationReachability(),
  },
  {
    id: "economy.first_purchase_gate_adoption",
    name: "First-purchase SKU server gate",
    description:
      "store.ts FIRST_PURCHASE_GATED_SKUS lists first_purchase_starter and createCheckout invokes assertFirstPurchaseEligible. Closes the permanently-repeatable $0.99 starter-bundle arbitrage (catalog promised 'first 7 days only' / once-per-account but nothing enforced it).",
    check: () => checkFirstPurchaseGateAdoption(),
  },
  {
    id: "client.ftue_funnel_instrumentation",
    name: "FTUE funnel instrumentation",
    description:
      "GameEvents declares the 5 FTUE funnel events and useTutorialOrchestrator emits STEP_SHOWN/STEP_COMPLETED/SKIPPED. Keeps the onboarding drop-off funnel measurable — a refactor can't silently re-blind D1 retention analysis.",
    check: () => checkFtueFunnelInstrumentation(),
  },
  {
    id: "server.pvp_score_resubmit_guard",
    name: "PvP score resubmission guard",
    description:
      "tier5Pvp.submitScore rejects a second submission once the caller's score is recorded. Closes an unbounded ELO/title farm (re-POST after match completion re-ran mirrorRating + awardEligibleTitles every call).",
    check: () => checkPvpScoreResubmitGuard(),
  },
  {
    id: "client.touch_target_floor",
    name: "Coarse-pointer touch-target floor",
    description:
      "index.css applies the 44px Apple/Google touch-target minimum under @media (pointer: coarse), not just max-width:639px. Fixes sub-minimum hit areas on landscape phones / tablets (the devices with landscape duel modes) where the width-gated rule didn't apply.",
    check: () => checkTouchTargetFloor(),
  },
  {
    id: "economy.refund_clawback",
    name: "Refund / chargeback clawback",
    description:
      "store.ts clawbackByPaymentIntent (currency reversal clamped at zero, entitlements revoked, consumed grants flagged for ops) is wired to the charge.refunded and charge.dispute.created Stripe webhook events. Closes refund-and-keep-the-goods.",
    check: () => checkRefundClawback(),
  },
  {
    id: "economy.iap_receipt_ownership",
    name: "IAP receipt ownership verification",
    description:
      "iapReceipt.verify parses the RevenueCat subscriber payload and gates fulfilment on the claimed productId being present (non_subscriptions/subscriptions), not on a bare HTTP 200. Closes 'verified == got 200'.",
    check: () => checkIapReceiptOwnership(),
  },
  {
    id: "economy.vip_subscription",
    name: "VIP subscription end-to-end",
    description:
      "Time-bounded VIP entitlement: catalog product + Stripe mode:subscription checkout + customer.subscription.created/updated set-from-period + subscription.deleted clear + entitlementService helpers + the dailyQuests reward multiplier actually consuming it. Event-driven + pull-based — no cron, no leader-election dependency.",
    check: () => checkVipSubscription(),
  },
  {
    id: "mobile.native_haptics",
    name: "Native haptics (iOS Taptic / Android)",
    description:
      "lib/haptics.ts routes through @capacitor/haptics on the native shell (web Vibration API fallback) and every named HapticPatterns entry has an explicit native mapping. Fixes iOS, where navigator.vibrate is absent and all haptics silently no-opped.",
    check: () => checkNativeHaptics(),
  },
  {
    id: "mobile.native_orientation",
    name: "Native orientation lock",
    description:
      "LandscapeEnforcer locks landscape via @capacitor/screen-orientation on the native shell (web Screen Orientation API + overlay fallback). Fixes iOS, where screen.orientation.lock is unsupported and players got a rotate-device overlay instead of the OS rotating the app.",
    check: () => checkNativeOrientation(),
  },
  {
    id: "mobile.native_shell",
    name: "Native shell (splash / status-bar / back)",
    description:
      "lib/nativeShell drives StatusBar style + SplashScreen.hide (config launchAutoHide:false) + Android backButton behind the native probe, invoked from main.tsx. Stops the native build dropping to a blank frame pre-mount and fixes status-bar contrast / unhandled hardware-back.",
    check: () => checkNativeShell(),
  },
  {
    id: "narrative.saga_ledger_humanizer_coverage",
    name: "Your Saga ledger humanizer coverage",
    description:
      "Every ripple.emit() eventType has a SAGA_EVENT_HUMANIZERS entry, so the player-facing 'Your Saga' consequence ledger renders every persisted consequence as a readable line instead of a raw code. saga.ledger tRPC joins it with npc_public_flags world-standing.",
    check: () => checkSagaLedgerHumanizerCoverage(),
  },
  {
    id: "engagement.winback_offer",
    name: "Winback comeback offer integrity",
    description:
      "winbackOfferService grants a lapse-scaled, REWARD_CAP-bounded Dream comeback reward, keyed to the lapse episode so it can't be farmed (in-tx re-check of the claim marker), exposed via the winback tRPC router. Real grant + anti-farm, not a hollow offer.",
    check: () => checkWinbackOffer(),
  },
  {
    id: "narrative.session_end_cliffhanger",
    name: "Session-end forward hook",
    description:
      "generateRecap derives a next-phase hook from getNextPhaseGuidance(narrativeAct, flags) and RecapOverlay renders it after the cliffhanger, so a session ends pointing at a concrete next beat. Gate binds compute+render so it can't regress to a computed-but-hidden hook.",
    check: () => checkSessionEndCliffhanger(),
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
  {
    // Phase H.F — Axis 12 faction-livery coverage.
    id: "art.axis12_state_coverage",
    name: "Room art Axis 12 (faction-livery) state coverage",
    description:
      "Every room with any faction-axis variant in the producer library should ideally have all 8 canonical faction states (none/hierarchy/dreamers/pureflame/insurgency/panopticon/collectors/multi). Producer-art delivers selective coverage (46 faction-axis variants total). compositeResolver degrades gracefully.",
    check: () => checkAxis12StateCoverage(),
    ratchet: { target: 0 },
  },
  {
    // Phase H.G — Axis 13 storyteller-hook registry coverage.
    // Hard parity: every producer-axis-13 variant (everything outside
    // axis 9/11/12/baseline) is auto-registered in storyHookRegistry.
    // Seed extraction is exhaustive; new producer-art passes that
    // land new axis-13 variants must regenerate the registry.
    id: "art.story_hook_coverage",
    name: "Axis 13 storyteller-hook registry coverage",
    description:
      "Every producer-axis-13 state variant in the room-art manifest (morality / season / trust / lore / etc.) is registered as a StoryHook. Hard parity: gap > 0 means a producer-art pass landed new variants the registry hasn't been regenerated for.",
    check: () => checkStoryHookCoverage(),
  },
  {
    // Phase H.H — Hotspot coverage. Every space in PRODUCTION_FINAL.md
    // PARTs III–VIII should have at least one hotspot. The 49 Ark
    // rooms have inline hotspots in ROOM_DEFINITIONS; the 19 deferred
    // Hellbox + vehicle spaces have sidecar stubs in
    // roomHotspotManifest. ~98 destination + apprentice spaces still
    // need hotspot authoring; ratchet shrinks as those land.
    id: "art.hotspot_coverage",
    name: "Room hotspot coverage",
    description:
      "Every space in _PRODUCTION_FINAL.md PARTs III–VIII should have at least one hotspot — either inline (ROOM_DEFINITIONS) or sidecar (roomHotspotManifest). Ratcheted; gap shrinks as destination + apprentice rooms get authored hotspots.",
    check: () => checkHotspotCoverage(),
    ratchet: { target: 0 },
  },
  {
    // Phase H.I — Room reachability coverage for the 117 deferred
    // spaces (12 HB + 7 veh + 60 destination + 38 apprentice).
    // 70 of 117 have explicit unlock gates in roomUnlockManifest.
    // The ~47 gap is the destination zones whose unlock model is
    // an explicitly deferred narrative-design decision (TBD[4] in
    // _PHASE_H_HANDOFF.md) — unauthored in source AND docs, not
    // "gated per-subsystem". The ratchet is the honest accounting.
    id: "art.room_reachability_coverage",
    name: "Room reachability / unlock manifest coverage",
    description:
      "70 of the 117 deferred spaces (12 Hellboxes + 7 vehicles + apprentice/pedagogy/berth/guild/Game-Master + a few dest.*) have an explicit unlock gate in apps/shared/roomGating/roomUnlockManifest.ts. Ratcheted at 47: the 60 destination zones' unlock model is an explicitly deferred narrative-design decision (TBD[4] in docs/production/_PHASE_H_HANDOFF.md), not authored anywhere in source or docs. Closes only when the narrative team writes the per-zone gates; must not be turned green by inventing them.",
    check: () => checkRoomReachabilityCoverage(),
    ratchet: { target: 0 },
  },
  {
    // Phase H.L — Expansion-cutscene runtime coverage. Producer drop
    // NEW_CUTSCENES_67.zip (2026-05-12) delivered 67 mp4 clips across
    // 10 categories (berth, cohort_park, comm_screen, doctrine_binding,
    // forge, guild_room, mechronis_audit, memory_card, mission,
    // wardens_dock). Every clip needs at least one trigger entry in
    // roomCutsceneTriggers.ts. Hard parity.
    id: "art.expansion_cutscene_coverage",
    name: "Expansion cutscene runtime trigger coverage",
    description:
      "Every cutscene declared in cinematicsManifest.EXPANSION_CUTSCENES is wired to at least one runtime trigger in roomCutsceneTriggers.ROOM_CUTSCENE_TRIGGERS. A producer-delivered cutscene without a trigger is unreachable in-game.",
    check: () => checkExpansionCutsceneCoverage(),
  },
  {
    // NEW_ART_{1,2,3} drop (2026-05-12). Closes _MISSING_ART_PROMPTS.md
    // §C (7 vehicles) + §D (60 destinations) + delivers 60 signature
    // cards + 28 chapter cards + 1,683 additional assets across
    // characters, portraits, fight system, overlays, sprites, UI atoms.
    id: "art.new_art_drop_coverage",
    name: "NEW_ART_{1,2,3} drop runtime coverage",
    description:
      "Every key from the 1,838-entry NEW_ART_{1,2,3} producer drop (2026-05-12) resolves to a CDN URL via newArtManifest.ts. Hard parity: gap > 0 means a declared asset (vehicle baseline / destination / signature card / chapter card) is missing from the inventory.",
    check: () => checkNewArtDropCoverage(),
  },
  {
    id: "asset.card_art_well_formed",
    name: "Card art well-formedness guard",
    description:
      "Every non-reserved card's resolved `art` URL is a structurally valid CDN asset path (under PUBLIC_ASSET_BASE, an allowed root, a real asset extension) and is not a placeholder/stub/unresolved-`${…}` string. Offline regression guard for the CDN-only asset surface that manifest-coverage checks can't see; true S3 existence stays with scripts/_check-art-coverage.mjs. Hard parity: gap > 0 means a card ships a broken/placeholder art reference.",
    check: () => checkCardArtWellFormed(),
  },
  // ─── The Human / four-era surface ────────────────────────────
  // Beat-H expansion: whispers + Mascoteer files (Era 1) +
  // Watchers' Eyes dispatches (Era 2) + humanReaction backfill
  // on the five rooms previously missing the Detective's
  // banded counter-read. All five checks land at hard parity.
  {
    id: "human.whisper_room_coverage",
    name: "Human whisper room coverage",
    description:
      "Every roomId on HUMAN_WHISPERS resolves to a real RoomId in detectiveCommentary.ts (or the any_room sentinel). A whisper referencing a non-existent room silently fails to fire and breaks the pre-Beat-H surface the Reveal video promises.",
    check: () => checkHumanWhisperRoomCoverage(),
  },
  {
    id: "human.mascoteer_authority_coverage",
    name: "Mascoteer authority coverage",
    description:
      "Every mascoteers[] entry on every MascoteerFile is a canonical Mascoteer id, and every child-Archon name (Vernon/Wanda/Wayne) used in mascoteerFiles.ts also appears in detectiveCommentary.ts so the kid-detective files anchor to the Era-3 Detective surface.",
    check: () => checkMascoteerFileAuthorityCoverage(),
  },
  {
    id: "human.mascoteer_surface_location",
    name: "Mascoteer file surface location",
    description:
      "Every MascoteerFile.surfaceLocation.{roomId,hotspotId} resolves to a real hotspot in the matching apps/shared/roomMysteries/<room>.ts module. A case wired to a non-existent hotspot never surfaces.",
    check: () => checkMascoteerFileSurfaceLocation(),
  },
  {
    id: "human.watchers_eyes_dispatch_surface_location",
    name: "Watchers' Eyes dispatch surface location",
    description:
      "Every WatchersEyesDispatch.surfaceLocation resolves to a real hotspot. Same logic as the Mascoteer check; the Elara betrayal dispatch in particular has to land somewhere readable for the Beat-H reveal to work.",
    check: () => checkWatchersEyesDispatchSurfaceLocation(),
  },
  {
    id: "human.human_reaction_room_coverage",
    name: "humanReaction room coverage",
    description:
      "Every non-template / non-species-exclusive room mystery module under apps/shared/roomMysteries/ contains at least one humanReaction. Locks the gain from the Beat-H expansion: the five rooms backfilled here (chaosForge / elementalNexus / guildSanctum / synthesisChamber / socialHub) cannot regress.",
    check: () => checkHumanReactionRoomCoverage(),
  },
  // ─── Phase K10.1 — Nemesis system parities ──────────────────
  {
    id: "nemesis.politician_tic_coverage",
    name: "Politician-tic phrases",
    description:
      "Every POLITICIAN_TIC declared in nemesisSystem.ts has a corresponding TIC_PHRASES entry so applyPoliticianTic can render it in dialog.",
    check: () => checkNemesisPoliticianTicCoverage(),
  },
  {
    id: "nemesis.plan_kind_handler_coverage",
    name: "Nemesis plan-kind power-ups",
    description:
      "Every NemesisPlanKind in PLAN_KIND_CATALOG has a power-up duration registered in POWER_UP_DURATIONS_MS so plan-success effects materialize.",
    check: () => checkNemesisPlanKindHandlerCoverage(),
  },
  {
    id: "nemesis.encounter_kind_handler_coverage",
    name: "Nemesis encounter transitions",
    description:
      "Every NemesisEncounterKind has a `case` branch in applyEncounterTransition. Kinds without a case fall through to no-op and never advance grudge/rank.",
    check: () => checkNemesisEncounterKindHandlerCoverage(),
  },
  {
    id: "nemesis.surface_integration_coverage",
    name: "Nemesis surface integrations",
    description:
      "Every NEMESIS_SURFACES entry is referenced as a string literal in nemesisIntegration.ts, proving the surface has integration helpers wired.",
    check: () => checkNemesisSurfaceIntegrationCoverage(),
  },
  {
    id: "nemesis.archetype_behavior_coverage",
    name: "Nemesis archetype behaviors",
    description:
      "Every ApprenticeArchetype has a NEMESIS_ARCHETYPE_BEHAVIORS entry (K4 — plan preferences, voice register, recruit affinity, faction alignment).",
    check: () => checkNemesisArchetypeBehaviorCoverage(),
  },
  {
    id: "nemesis.faction_alignment_coverage",
    name: "Nemesis faction alignment",
    description:
      "Every faction has at least one archetype whose factionAffinityVector points to it strongly (≥6). Ensures chooseNemesisFaction can plausibly pin a Nemesis to any faction.",
    check: () => checkNemesisFactionAlignmentCoverage(),
  },
  {
    id: "nemesis.archetype_pair_dialog_coverage",
    name: "Nemesis pair-bank dialog",
    description:
      "12 player-archetypes × 11 Nemesis-archetypes = 132 pair-banks under apps/shared/npcs/banks/nemesis/. Authoring waterfall — climbs to 132 across Phase K5.2 sprints.",
    check: () => checkNemesisArchetypePairDialogCoverage(),
    // Authoring-waterfall: starts low and climbs. Records the worst
    // gap once any pair-bank ships; ratchet protects the gain.
    ratchet: { target: 0 },
  },
  {
    id: "nemesis.apprentice_pair_dialog_coverage",
    name: "Apprentice-on-Nemesis pair-bank dialog",
    description:
      "Parallel to nemesis pair-banks: 132 apprentice-on-Nemesis banks under apps/shared/npcs/banks/apprenticeOnNemesis/. K6.2 authoring waterfall.",
    check: () => checkApprenticeOnNemesisPairDialogCoverage(),
    ratchet: { target: 0 },
  },

  // ─── Phase K Wave 4 — Per-scene + trigger parities ───
  {
    id: "nemesis.scene_coverage_per_pair",
    name: "Nemesis pair scene coverage",
    description:
      "132 pairs × 8 scenes = 1056 scene-slots; each pair-bank file must declare every scene-id from NemesisEncounterSceneId. PASS proves no surface-render call can crash on a missing scene.",
    check: () => checkNemesisScenePerPairCoverage(),
  },
  {
    id: "nemesis.apprentice_scene_coverage_per_pair",
    name: "Apprentice-on-Nemesis pair scene coverage",
    description:
      "132 pairs × 8 scenes = 1056 scene-slots on the apprentice side. Same shape as the nemesis-side parity, for ApprenticeOnNemesisSceneId.",
    check: () => checkApprenticeScenePerPairCoverage(),
  },
  {
    id: "nemesis.wave4_trigger_coverage",
    name: "Nemesis Wave 4 trigger coverage",
    description:
      "Six new trigger-firing encounter kinds (accumulation_reveal, lieutenant_promoted, apprentice_declared_betrayal_to_nemesis, cohort_ended, name_revealed, final_encounter_act7) must each have at least one server call site that fires them via recordSurfaceEvent.",
    check: () => checkNemesisWave4TriggerCoverage(),
  },
  {
    id: "nemesis.axis_conflict_deepening",
    name: "Nemesis axis-conflict deepening",
    description:
      "12 thematic axes × 2 directions = 24 pair-bank files hand-deepened beyond the generator's 24-node floor. Each deepened file climbs to >80 dialog nodes via 5-node bespoke trees (ghost↔jester silence vs noise, heretic↔zealot rival faiths, etc.). RATCHET — pairs ship as writers complete them.",
    check: () => checkNemesisAxisConflictDeepening(),
    ratchet: { target: 0 },
  },

  // ─── Canon / lore (Ocularum Wave) ─────────────────────────
  {
    id: "canon.ocularum_cell_coverage",
    name: "Ocularum named cells",
    description:
      "The Ocularum's operational body is canonically 700 numbered cells (apps/shared/ocularumCanon.ts:CANONICAL_OCULARUM_CELL_COUNT). PR-1 canonizes 3 cells; the remaining are owed by the future 700-card DLC. RATCHET — each cell named in canon must remain named.",
    check: () => checkOcularumCellCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "canon.non_coordination_pact_integrity",
    name: "Non-Coordination Pact integrity",
    description:
      "Hard parity on the five PACT_INVARIANTS (apps/shared/nonCoordinationPact.ts): founding exchange UNQUOTED, memorial echo canonically quoted (Touché), both operators can refuse, player canonically honors-or-breaks, Antiquarian is the tacit guardian. Any failure compromises the saga's cosmological resistance pattern (apps/shared/logosCanon.ts).",
    check: () => checkNonCoordinationPactIntegrity(),
  },

  // ─── PR-5 meta-audits (drift regression guards) ────────────
  {
    id: "tcg.zod_schema_union_parity",
    name: "Zod schema ↔ TypeScript union parity",
    description:
      "Hard parity: every kind in CardUnlockCondition (apps/shared/tcg-core/types/Card.ts) MUST be present as a z.literal in cardUnlockConditionSchema (apps/shared/tcg-core/cards/schema.ts). PR-4 found 3 missing kinds (arc_episode_complete, dlc_chapter_completion, bloodline_threshold); this gate is the regression guard.",
    check: () => checkZodSchemaUnionParity(),
  },
  {
    id: "tcg.flag_prefix_writer_parity",
    name: "Flag-prefix writer parity",
    description:
      "Hard parity: every flag-prefix the expansion-unlock service reads (apps/shared/tcg-core/rewards/expansionUnlockService.ts) MUST have a documented writer. PR-4 found the mystery_episode_complete:* prefix was orphan-read; this gate is the regression guard against future read/write drift.",
    check: () => checkFlagPrefixWriterParity(),
  },

  // ─── PR-5 canon bindings ───────────────────────────────────
  {
    id: "canon.ninja_ocularum_stage_coverage",
    name: "Ninja Ocularum stage coverage",
    description:
      "Hard parity: every NinjaOcularumStage in apps/shared/ninjaOcularumApprentice.ts MUST have a narration entry in NINJA_OCULARUM_STAGE_NARRATION. The diegetic-surface runtime breaks silently otherwise.",
    check: () => checkNinjaOcularumStageCoverage(),
  },
  {
    id: "canon.pre_locke_coordinator_coverage",
    name: "Pre-Locke Coordinator coverage",
    description:
      "Per dreamer canon-lock 2026-05-14 (apps/shared/preLockeCoordinators.ts), the chain between the founding regicide and Locke holds 5-15 Coordinators. 5/5 — the Founder + Jericho plus three intermediate Coordinators (Veth Karran, Oss Vae, Halvenn Sarro) generated under project-owner authorization (canon-lock 2026-05-16), satisfying the dreamer-locked minimum. Ratcheted at 0; cannot regress.",
    check: () => checkPreLockeCoordinatorCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "canon.dreamer_architect_twin_bind",
    name: "Dreamer ↔ Architect twin canon bind",
    description:
      "Hard parity: the Logos split's twin canon places the Architect at A1 (Twelve Archons roster) and the Dreamer at N1 (Twelve Ne-Yons roster). Both entries MUST exist in their registries with position 1. Regression breaks the saga's cosmic axis — TCG imprint cards, Codex inscriptions, and prophecy outputs all cite this twin-pairing as load-bearing.",
    check: () => checkDreamerArchitectTwinBind(),
  },
  {
    id: "narrative.mystery_engine_roster_coverage",
    name: "Mystery Engine roster coverage (§XVI authored arcs)",
    description:
      "Hard parity: the four §XVI-authorized arcs (mystery.the_watcher / ith_rael / the_necromancer / syl_vex) MUST all be registered in MYSTERY_DEFINITIONS. Regression vs PR-2 / PR-2B / PR-7 is a §XVI completion failure.",
    check: () => checkMysteryEngineRosterCoverage(),
  },
  {
    id: "narrative.mystery_clue_binding_coverage",
    name: "Mystery progression-critical clue binding",
    description:
      "Every clue referenced by a deduction edge that carries `unlocksEpisode` (the progression-critical clues, across all MYSTERY_DEFINITIONS arcs) must be bound to a room-mystery hotspot via mysteryBinding.cluesFound — otherwise the arc dead-ends on episode 1 (the DeductionPanel only pairs clues the player has actually found). RATCHET: only the Watcher arc is fully wired; the 9 other unbound arcs make this a large gap. The ceiling is the real current gap after Watcher — it cannot regress and must tighten as the remaining arcs are wired.",
    check: () => checkMysteryClueBindingCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.mystery_clue_foundin_parity",
    name: "Mystery clue foundIn ⇄ binding-room parity",
    description:
      "Hard parity: every authored clue that is bound to a room-mystery hotspot must have its `foundIn` hint name a room that actually binds it. A `foundIn` that points to a non-existent module or to a different room than the binding sends the player to where the clue is not — a silent dead-hint that binding-coverage and reachability both miss. This gate was added after the ten-arc playability remediation, where the only safeguard against half-done foundIn re-homes was manual diffing.",
    check: () => checkMysteryClueFoundInParity(),
  },
  {
    id: "canon.codex_roster_coverage",
    name: "Codex roster coverage (Archons + Ne-Yons positions)",
    description:
      "Hard parity: the Codex's loreData.ts ARCHONS + NEYONS arrays MUST stay in numerical-position parity with the canon registries (apps/shared/archonCanon.ts + neYonCanon.ts). PR-9 reconciled the drift; this gate guards against regression. Drift here means the Codex renders canon incorrectly to the player.",
    check: () => checkCodexRosterCoverage(),
  },
  {
    id: "narrative.game_mode_premise_coverage",
    name: "Game-mode narrative-premise coverage (Phase F)",
    description:
      "Hard parity (build-plan §VIII Phase F): every player-facing game mode in apps/shared/gameModeNarrativePremises.ts MUST have a non-empty diegetic 'why' + a canon premiseSourceModule. A game mode with no in-fiction reason to exist is a Phase F failure. PR-14 reconciled F2 (chess ↔ Game Master rules-layer), F7 (Trade Empire reconnaissance premise), F10 (Apprentice Mentor Loop ↔ Politician secret-apprentice doubling).",
    check: () => checkGameModeNarrativePremiseCoverage(),
  },
  {
    id: "narrative.imprint_first_summon_cutscene_coverage",
    name: "Imprint first-summon cutscene coverage (Phase J / I13)",
    description:
      "Hard parity (build-plan §VIII Phase J / I13): every imprint NPC in apps/shared/imprintSummoningCanon.ts:IMPRINT_INTRO_REGISTRY MUST carry a valid introStatus (produced | pending | retired). 'pending' is the canon-anchored gate-then-stub hook (video production owed); 'retired' is the J9 Foucault decision. An unclassified imprint is the failure.",
    check: () => checkImprintFirstSummonCutsceneCoverage(),
  },
  {
    id: "tcg.imprint_cards_carry_unlock_condition",
    name: "Imprint cards carry unlockCondition (Phase J / I14)",
    description:
      "Ratcheted (build-plan §VIII Phase J / I14): every imprint-faction card should carry an unlockCondition so the engine can gate first-summon to canonical phase availability. PR-15 baseline is 0/18 (adding the right condition to 90 card files is per-card canon-judgment work). The gap is tracked and may only SHRINK — a future PR that adds unlockConditions tightens it; removing one fails the gate.",
    check: () => checkImprintCardsCarryUnlockCondition(),
    ratchet: { target: 0 },
  },

  // ─── Phase A foundation + Phase B character canon-lock ──────
  {
    id: "canon.neyon_roster_coverage",
    name: "Ne-Yon canonical roster coverage",
    description:
      "Every of the 12 canonical Ne-Yons is registered in apps/shared/neYonCanon.ts with either a locked position (1-12) and source citation OR an explicit canon-ambiguous position:null (per Phase A2 decision). The registry MUST hold exactly 12 entries.",
    check: () => checkNeyonCanonicalRosterCoverage(),
  },
  {
    id: "canon.archon_roster_coverage",
    name: "Archon canonical roster coverage",
    description:
      "Per LORE_BIBLE.md:361, the Archons number 12. Registry holds the canon-witnessed Archons; the gap to 12 represents canon-pending slots (canon hasn't yet surfaced the remaining names). Ratcheted; only allowed to shrink.",
    check: () => checkArchonCanonicalRosterCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "canon.hierarchy_roster_coverage",
    name: "Hierarchy of the Damned canonical roster coverage",
    description:
      "Per LORE_BIBLE.md:5348, the Hierarchy is exactly 10 demon lords. The registry's inCoreTen flag marks the canonical core. 10/10 — Mol'Vereth was promoted into the core ten per the dreamer canon-lock of 2026-05-16; Ozhul'Vana remains adjacent (senior-partner, Degen arc) and is counted outside the core. Ratcheted at 0; cannot regress.",
    check: () => checkHierarchyCanonicalRosterCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "canon.casino_heist_crew_coverage",
    name: "Casino Heist crew coverage",
    description:
      "Per LORE_BIBLE.md:471, 2275, the Casino Heist crew is exactly 7. Every crew member must have a non-empty loreSource and canonicalContribution.",
    check: () => checkCasinoHeistCrewCoverage(),
  },
  {
    id: "canon.identity_collision_lock",
    name: "Identity collision lock",
    description:
      "Per Plan §I.2 + identityCollisionCanon.ts, 8 identity manifolds are canonically locked (Vex Solène / Wraith Calder / Akai Shi / Wolf-Lycos / Antiquarian-Cross / Enigma-Storyteller / Human / Source-Kael-Reborn). Each must have a loreSource and at least one alias.",
    check: () => checkIdentityCollisionLock(),
  },
  {
    id: "canon.era_timeline_coverage",
    name: "Era timeline coverage",
    description:
      "12 canonical eras in chronicle order (per apps/shared/eraTimeline.ts + Phase A3 decision). Each must have a definingEvent + loreSource + unique chronicleOrder.",
    check: () => checkEraTimelineCoverage(),
  },
  {
    id: "canon.authority_founder_coverage",
    name: "Authority Six Founders coverage",
    description:
      "Per LORE_BIBLE.md:1500, the Authority is exactly 6 Founders. Five canon-locked under the Sin-Founder pairing (Samsara/Greed + Phyral succubus/Lust + Midlothian extractor + Wrath Bearer/Tribunal + Pride Bearer/Sovereign Spire + Envy Bearer/Reflected Quarter — Founders 4/5/6 locked 2026-05-14 by the dreamer per Phase A5 decision). Sloth + 6th Founder remain canon-pending. Every slot must have a loreSource.",
    check: () => checkAuthorityFounderCoverage(),
  },
  {
    id: "canon.mechronis_guild_binding_coverage",
    name: "Mechronis Guild ↔ Class binding coverage",
    description:
      "Per LORE_BIBLE.md:5860 + Phase A4 decision (canon-locked 2026-05-14), 5 Guild ↔ Class bindings: Soldier↔War, Spy↔Subterfuge, Engineer↔Manipulation, Assassin↔Control-Over-Life, Oracle↔fifth_guild (canonical name: 'The Guild of Omens'). Each binding must have a loreSource + canonicalExemplar.",
    check: () => checkMechronisGuildBindingCoverage(),
  },

  // ─── Phase C — continuing-loop endgame canon-lock ──────────
  {
    id: "canon.continuing_loop_endgame_coverage",
    name: "Continuing-loop endgame canon-lock (Phase C)",
    description:
      "Hard parity (build-plan §VIII Phase C): the shipped endgame is the post-Act-7 continuing loop (events + fights + Governance Hub votes + the per-cycle chronicle), NOT the Servant Hero Academy. Every LoopSurfaceCanon in apps/shared/continuingLoopEndgameCanon.ts MUST bind to a shipped runtime anchor + file:line loreSource + valid status. The Cross-Wave Witness Network (apps/shared/crossWaveWitnessNetwork.ts) is canon-locked as a CURRENT-LOOP surface footed on the Two-Witnesses canon + cycle-aware post_run inscriptions. The Chronicler's Desk / §X.7 baton-pass is canon-locked (apps/shared/chroniclersDeskCanon.ts).",
    check: () => checkContinuingLoopEndgameCoverage(),
  },
  {
    id: "canon.servant_hero_future_season_deferral",
    name: "Servant Hero Academy future-season deferral (Phase C C6/C7)",
    description:
      "Hard parity (build-plan §VIII Phase C — C6/C7): the Servant Hero Academy is a deferred future season / DLC (≥1 year out). C6 (onboarding cinematic) + C7 (Servant-Hero curriculum) are registered in apps/shared/servantHeroFutureSeasonCanon.ts as typed deferred_future_season hooks. The Act7→Phase14 seam (sagaPhases.ts:281-294, unreachable while narrativeAct<=7) is canon-locked as the DELIBERATE not-yet-launched boundary, not an orphaned bug. The gate accounts for the deferral without blocking.",
    check: () => checkServantHeroDeferralCoverage(),
  },

  // ─── PR-17 — discoverability backbone ──────────────────────
  {
    id: "narrative.surface_discoverability_coverage",
    name: "Surface discoverability coverage",
    description:
      "One discoverable narrative path (PR-17 backbone; PR-24/25 backfill): every <Route> in apps/client/src/App.tsx is classified in apps/shared/surfaceDiscoverabilityCanon.ts and every narrative_gated surface resolves its gate through EXISTING infra (featureRoadmap / gameModeNarrativePremises / sagaPhases / act-completion gates / expansion unlock service). PR-24/25 closed the 78-orphan baseline to 0 — game modes with a recorded diegetic premise → narrative_gated, narrative locations/episodes → phase, nav-reachable social/competitive/economy → always_available, dev/account/seasonal → utility. A two-way drift scan folds any unclassified App.tsx route or stale registry route into the gap, so a new unclassified route is an immediate regression. RATCHET ceiling tightened to 0 — it can never regrow. This is the 'tighten things' lock.",
    check: () => checkSurfaceDiscoverabilityCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.spine_coverage",
    name: "Narrative spine coverage",
    description:
      "The story IS the connective layer (owner-locked): every game mode in apps/shared/gameModeNarrativePremises.ts MUST be revealed by exactly one beat in apps/shared/narrativeSpine.ts, and docs/built/SAGA_GAME_MODE_COHERENCE.md MUST stay in sync with it. The spine consolidates the already-shipped per-mode sagaPhase gates (surfaceDiscoverabilityCanon) + the 14 canon premises into one ordered open-but-guided through-line; each beat binds a system to a canonical phase + an in-fiction carrier (Elara/Locke/Antiquarian/companion/cutscene), inventing no canon. Hard parity: a system not on the spine is orphaned from the story — the exact failure this eliminates. Regenerate the doc with pnpm tsx apps/scripts/gen-saga-mode-coherence.ts.",
    check: () => checkNarrativeSpineCoverage(),
  },
  {
    id: "narrative.spine_doorway_coverage",
    name: "Spine doorway coverage",
    description:
      "Open but guided (owner-locked): every spine WING in apps/shared/narrativeSpine.ts must have a diegetic in-world doorway — a ROOM_DEFINITIONS hotspot whose route action is the wing's canonical entryRoute. Being on the spine + in the objective tracker is not the same as the player being able to walk in from the living world. RATCHET (target 0): the bridge already exists for some wings (Strategy Table → /chess, Trade Terminal → /trade-empire, Warden's Vigil → /tower-defense); the rest are precise targets in `missing`. The gap can only shrink — a wing with a world door can never regress to doorless. Driven by spineDoorways.ts (source-scan of GameContext ROOM_DEFINITIONS, no client import).",
    check: () => checkSpineDoorwayCoverage(),
    ratchet: { target: 0 },
  },
  {
    id: "narrative.questline_registry_coverage",
    name: "Questline registry coverage",
    description:
      "W7 (audit: 'questline completion status is unknown/untracked'): every apps/shared/questline*.ts module (non-test) MUST be registered in apps/shared/questlineRegistry.ts with a status (shipped | authored | support). Before this the only aggregation was a partial 11-entry array inside questlineAll.test.ts while 23 modules existed on disk. Hard parity, two-way: an unregistered module is untracked completion status; a registry entry with no module on disk is stale. Status is classified from objective module evidence (PotentialQuestline export + aggregate-test coverage), not lore judgement.",
    check: () => checkQuestlineRegistryCoverage(),
  },
  {
    id: "loop.daily_session_coverage",
    name: "Daily session loop coverage",
    description:
      "W5 (audit: 'no designed what-do-I-do-for-8-minutes-today loop'): every part shipped (Memory Energy, streak saver, daily brief, axis daily quests, bonus objectives, NPC rotation, daily-reward ladder) but with no designed sequence. apps/shared/dailySessionLoop.ts is that through-line, ending in the spine handoff so the day always points at the next beat. Hard parity: every step's anchor module must exist on disk, and the total budget must stay in the designed 5–12 minute band.",
    check: () => checkDailySessionLoopCoverage(),
  },
  {
    id: "progression.mastery_track_coverage",
    name: "Mastery track coverage",
    description:
      "W4 (audit: 'no traditional RPG progression spine'): the progression parts shipped (classMastery, bossMastery, the per-mode reward engine) but with no contract that the play→grow→invest→play-stronger loop reaches every system the story reveals. apps/shared/masteryTracks.ts binds one growth track per spine system to a shipped reward/mastery anchor. Hard parity, spine-driven & two-way: every NARRATIVE_SPINE premise has exactly one track whose anchor exists; a track targeting a non-spine premise is also a defect.",
    check: () => checkMasteryTrackCoverage(),
  },
  {
    id: "progression.rpg_staples_coverage",
    name: "RPG staples coverage",
    description:
      "W6 (audit: inventory unmanaged / 'crafting is 5 recipes' / no vendor economy / no overworld traversal): each claim was stale; what was missing was an enforced contract. apps/shared/rpgStaples.ts declares the four pillars + their shipped anchors, with overworld traversal explicitly bound to the room-unlock manifest + the spine doorways (W0) so the 'linear room-unlock chain' is the spine-driven graph. Hard parity: every pillar's anchor modules exist and crafting clears the recipe floor (the stale '5 recipes' is now an enforced minimum).",
    check: () => checkRpgStaplesCoverage(),
  },

  // ─── PR-18 — Dischordian-Logic epistemology ────────────────
  {
    id: "canon.perspective_coverage",
    name: "Perspective canon coverage",
    description:
      "Hard parity (PR-18): every learnable PERSPECTIVE in apps/shared/perspectiveCanon.ts is coherent. A 'locked' perspective MUST resolve its Mystery-Engine arc + terminal episode against episodeMysteries.ts (a card gated behind an unlearnable lens is a Dischordian-Logic failure); a 'canon_pending' loose thread (Vortex / Terminus Swarm / Pets / the Coming) MUST carry a loreSource and is bound to its dedicated backbone in PR-21/PR-22/PR-23. The perspective_learned CardUnlockCondition kind rides the existing mystery_episode_complete flag stream — no new flag prefix (tcg.flag_prefix_writer_parity untouched), schema literal shipped same change (tcg.zod_schema_union_parity stays PASS).",
    check: () => checkPerspectiveCanonCoverage(),
  },

  // ─── PR-19 — prophecy/seal/seer/Oracle-Tarot unification ───
  {
    id: "narrative.prophecy_tarot_unification",
    name: "Prophecy · Seal · Tarot unification",
    description:
      "Hard parity (PR-19): each of the 7 per-Act bindings in apps/shared/prophecyTarotCanon.ts resolves its Seal (SEVEN_SEALS num+act), its prophecy bookend (getProphecyById), at least one Oracle-Tarot card slug under the act (PROPHECY_VISIONS — the existing 23-card Oracle Deck IS the Dischordian Tarot; no new cards/art), the antiquarian_manifold (Daniel Cross = Programmer = Antiquarian, the prophet), and the canonical Seer warming band (cold 1-2 / warm 3-5 / confidant 6-7). Acts must be exactly {1..7} once each.",
    check: () => checkProphecyTarotCoverage(),
  },

  // ─── PR-20 — act-close chapter cutscenes (the two Comings) ─
  {
    id: "narrative.act_close_cutscene_coverage",
    name: "Act-close chapter cutscene coverage",
    description:
      "Hard parity (PR-20): 7 act-close entries in apps/shared/actCloseCutsceneCanon.ts, acts {1..7} once each, delivered through the shipped Antiquarian bridge overlay (every antiquarianBridgeId resolves) with Seal+prophecy deferred to the validated prophecyTarotCanon binding. The two Comings are canon-pinned: the FIRST Coming (Necromancer = halfway) on Act 4; the FINAL Coming (Politician = endgame) on Act 7, which ignites the PR-16 continuing-loop canon. No other act may carry a Coming.",
    check: () => checkActCloseCutsceneCoverage(),
  },

  // ─── Resurrection cinematics (three dead Potentials) ───────
  {
    id: "narrative.resurrection_cinematic_coverage",
    name: "Resurrection cinematic coverage",
    description:
      "Hard parity: (a) every cinematic id in RESURRECTION_CINEMATIC_BY_NPC (apps/shared/resurrectionProtocols.ts) and WOLF_CRUCIBLE_RESCUE_CINEMATIC (apps/shared/dlcMysteries/wolfAnaraHunt.ts) must resolve to a real CinematicDef in cinematicsManifest.ts. Three bindings cover the canonical resurrected Potentials (resurrectionistCycleWalker.ts:46-48): Wraith Calder, Akai Shi, The Wolf. (b) WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG must equal the canonical mystery_episode_complete flag for the Wolf Anara Hunt arc's FINAL episode — guards against arc renames or episode-list reorders silently breaking the cinematic trigger.",
    check: () => checkResurrectionCinematicCoverage(),
  },

  // ─── PR-21 — the Coming (two-stage canon binding) ──────────
  {
    id: "canon.the_coming_binding",
    name: "The Coming — two-stage binding",
    description:
      "Hard parity (PR-21): 'the Coming' is one prophecy with two fulfilments and both must resolve every registry they cite. FIRST Coming = the Necromancer's Return (halfway, Act 4 / saga phase 7): necromancer arc + resurrection meter + act-4 close 'first'. FINAL Coming = the Politician's Return (endgame, Act 7 / saga phase 13): politician arc + Archon #7 + act-7 close 'final' igniting the PR-16 continuing loop. Supersedes the single-stage Coming framing.",
    check: () => checkTheComingCoverage(),
  },

  // ─── PR-22 — Vortex / Terminus reconciliation ──────────────
  {
    id: "canon.vortex_terminus_reconciliation",
    name: "Vortex / Terminus reconciliation",
    description:
      "Hard PASS (PR-22, dreamer 2026-05-17): the Terminus Swarm is RECONCILED — canonical reading = the Thought Virus itself (the intergalactic mind-plague; vector Kael → The Source, sealed in the ex-Panopticon rogue planet Terminus), an independent institutional threat. The Risen / Necromancer-First-Coming and Vortex-manifestation readings are preserved as typed in-fiction alternates (not discarded). The Vortex is RECONCILED & HARD-LOCKED — Archon #9, the doomsday-clock terminal state that feeds the Final Coming (theComingCanon.final_coming). No thread is canon_pending; the gate is a hard PASS and the ratchet target stays 0.",
    check: () => checkVortexTerminusCoverage(),
    ratchet: { target: 0 },
  },

  // ─── PR-23 — Pets narrative origin (last loose thread) ─────
  {
    id: "canon.pet_origin_coverage",
    name: "Pet origin canon coverage",
    description:
      "Hard parity (PR-23): the Pets' narrative origin (apps/shared/petOriginCanon.ts) resolves all five anchors — the Matrix-of-Dreams imprint ontology (imprintSummoningCanon), the species registry (petSpeciesTraits), the breeding mechanic (petBreeding.breedPets), the Risen fate (necromancerReturn pet_battles Risen impacts + theComingCanon.first_coming), and the Pets-vs-crew-Companions distinction (pet species disjoint from companionBattleReactions.getReactiveCompanionIds — Pets are imprint-creatures, not the crew Companions Elara/the Human). Pets are the First Coming felt at companion scale; the last loose thread is bound to the spine, and the origin is surfaced player-facing in the LORE_BIBLE 'The Pets' entry.",
    check: () => checkPetOriginCoverage(),
  },
];
