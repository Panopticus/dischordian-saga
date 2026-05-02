/**
 * Public exports of @shared/tcg-core.
 *
 * This is the *only* surface the rest of the monorepo should import from.
 * Deep imports into engine/* are allowed within tcg-core itself but
 * forbidden elsewhere (ESLint rule to follow).
 */

/* ─── Types ─── */
export type {
  GameState,
  BoardEntity,
  PlayerState,
  ArtifactInstance,
  GamePhase,
  WinReason,
  CardRegistry,
  PendingTrigger,
  PosKey,
} from "./types/GameState";
export {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  MAX_MANA,
  STARTING_MANA,
  MAX_HAND,
  MAX_ARTIFACTS,
  GENERAL_HP,
  DECK_SIZE,
  MULLIGAN_HAND_SIZE,
  posKey,
  parsePosKey,
} from "./types/GameState";

export type {
  CardDefinition,
  CardInstance,
  Buff,
  Faction,
  CardType,
  Rarity,
  Keyword,
  Ability,
} from "./types/Card";

export type {
  Action,
  ReduceError,
  ReduceErrorCode,
} from "./types/Action";

export type { GameEvent } from "./types/Event";

export type {
  Effect,
  EffectOp,
  Amount,
  TargetRef,
  UnitFilter,
  StatDelta,
  Duration,
  Condition,
  PositionSelector,
  DirectionRef,
} from "./types/Effect";

export type {
  TargetSelector,
  OriginSelector,
  Direction,
  PositionConstraint,
  Chooser,
} from "./types/Targeting";

export type {
  Trigger,
  ConcreteAbility,
  CardFilter,
  ActivationCost,
  AuraRange,
} from "./types/Trigger";

export type {
  MatchId,
  PlayerId,
  CardDefId,
  EntityId,
  AbilityId,
  AbilityInstanceId,
  Side,
} from "./types/Ids";
export {
  MatchId as createMatchId,
  PlayerId as createPlayerId,
  CardDefId as createCardDefId,
  EntityId as createEntityId,
  AbilityId as createAbilityId,
  otherSide,
} from "./types/Ids";

/* ─── Tier 3 foundation: N-player team types ───
 * Additive — exists alongside Side for forwards compatibility.
 * 1v1 callers may continue to use Side; 2v2/co-op/FFA callers
 * use MatchPlayerSlot + Team. See types/Teams.ts. */
export type {
  MatchPlayerSlot,
  TeamId,
  Team,
  TurnOrder,
  MatchShape,
} from "./types/Teams";
export {
  TeamId as createTeamId,
  TURN_ORDER_1V1,
  TURN_ORDER_2V2_ALTERNATING,
  TURN_ORDER_FFA_4,
  TURN_ORDER_COOP_2V1,
  sideToSlot,
  slotToSide,
  teamForSlot,
  alliedSlots,
  enemySlots,
  nextSlotInOrder,
  teams1v1,
  teams2v2,
  teamsCoop2v1,
  teamsFfa4,
} from "./types/Teams";

/* Team-aware targeting selectors (Tier 3 next slice). */
export type { TeamTargetSelectorKind } from "./types/TeamTargeting";
export {
  resolveTeamSelector,
  isAllyOf,
  isEnemyOf,
  filterByController,
} from "./types/TeamTargeting";

/* Team-aware MatchView projection (Tier 3 boundary layer). */
export type { MatchView } from "./types/MatchView";
export {
  viewOf,
  actorSlotFromSide,
  sideFromActorSlot,
  peekNextSlot,
} from "./types/MatchView";

/* ─── Engine ─── */
export {
  reduce,
  setTriggerEffectRunner,
  resetTriggerEffectRunner,
} from "./engine/reducer";
export type { ReduceResult, ReduceCtx } from "./engine/reducer";
export { RULES_VERSION, isReplayCompatible } from "./engine/version";
export type { RulesVersion } from "./engine/version";
export { createRng, rngInt, rngShuffle, rngPick } from "./engine/rng";
export type { Rng, RngState } from "./engine/rng";
export { hashState, hashPrefix, canonicalStringify } from "./engine/hash";
export { runStateBasedActions, SBA_SAFETY_CAP } from "./engine/stateBasedActions";
export {
  drainTriggerQueue,
  enqueueTrigger,
  TRIGGER_DRAIN_CAP,
} from "./engine/triggerQueue";
export type { TriggerEffectRunner } from "./engine/triggerQueue";
export { interpret, UnsupportedOpError } from "./engine/effectInterpreter";
export { createDefaultTriggerRunner } from "./engine/defaultTriggerRunner";
export { createMatchState, drawOneCard, mintEntityId } from "./engine/init";
export type {
  MatchConfig,
  CreateMatchOptions,
  MatchStartingBonuses,
} from "./engine/init";
export { refreshTurnForPlayer } from "./engine/turn";
export { getValidMoves } from "./engine/movement";
export type { Coord } from "./engine/movement";
export { deployCard, isAdjacentToFriendly } from "./engine/deploy";
export type { DeployError, DeployErrorCode, DeployResult } from "./engine/deploy";
export { makeExecCtx, withIt } from "./engine/execCtx";
export type { ExecCtx } from "./engine/execCtx";
export {
  resolveTargetRef,
  resolveTargetSelector,
  matchesUnitFilter,
  findBoardEntity,
  UnsupportedSelectorError,
} from "./engine/targeting";
export {
  evaluateCondition,
  UnsupportedConditionError,
} from "./engine/conditions";
export { evaluateAmount, UnsupportedAmountError } from "./engine/amounts";

/* ─── Cards ─── */
export {
  cardDefinitionSchema,
  type ValidatedCardDefinition,
} from "./cards/schema";
export {
  buildCardRegistry,
  assertCardsPresent,
  CardRegistryLoadError,
} from "./cards/loader";
export { ALL_CARD_DEFINITIONS } from "./cards/index";

/* ─── Formats & deck validation ─── */
export { validateDeck } from "./formats/validateDeck";
export type {
  DeckInput,
  ValidationIssue,
  ValidationResult,
} from "./formats/validateDeck";
export { STANDARD_S1 } from "./formats/standard";
export type { Format } from "./formats/standard";

/* ─── Replay ─── */
export { replayMatch, verifyReplay } from "./replay/replay";
export type {
  ReplayInput,
  ReplayStep,
  ReplayResult,
} from "./replay/replay";
export {
  replayViewerReducer,
  getStateAtStep,
  getActionAtStep,
  generateTimelineMarkers,
} from "./replay/viewer";
export type {
  ReplayViewerState,
  ReplayViewerAction,
  TimelineMarker,
} from "./replay/viewer";

/* ─── Story / Campaign (WS6) ─── */
export {
  initEncounter,
  checkNarrativeHooks,
  checkEncounterOutcome,
  resolvePreMatchDialog,
  resolvePostMatchDialog,
  resolveNarrativeActions,
} from "./story/encounter";
export type {
  StoryEncounter,
  WinCondition,
  LoseCondition,
  NarrativeHook,
  NarrativeCondition,
  NarrativeAction,
  ResolvedNarrativeAction,
  EncounterInit,
  EncounterState,
} from "./story/encounter";

/* ─── Tutorial (WS7) ─── */
export {
  TUTORIAL_GATES,
  TUTORIAL_GATE_1,
  TUTORIAL_BOT,
  NEW_PLAYER_GRANT,
  getTutorialGate,
  resolveTutorialPreMatchDialog,
  resolveTutorialPostMatchDialog,
} from "./story/tutorial";
export type {
  TutorialGate,
  TutorialStepDef,
  TutorialBotConfig,
  NewPlayerGrant,
} from "./story/tutorial";

/* ─── Chess Tutorial (CT) ─── */
export {
  CHESS_TUTORIAL_GATES,
  CHESS_TUTORIAL_GATE_1,
  CHESS_TUTORIAL_GATE_2,
  CHESS_TUTORIAL_GATE_3,
  CHESS_TUTORIAL_GATE_4,
  CHESS_TUTORIAL_GATE_5,
  CHESS_TUTORIAL_GATE_6,
  CHESS_TUTORIAL_GATE_7,
  CHESS_TUTORIAL_GATE_4_5,
  CHESS_TUTORIAL_SIDE_GATES,
  CHESS_TUTORIAL_SCENES,
  getChessTutorialGate,
  getChessTutorialSideGate,
  isChessSideGateUnlocked,
  listChessTutorialVoiceCues,
} from "./story/chessTutorial";
export type {
  ChessTutorialStep,
  ChessTutorialGate,
  ChessPieceFocus,
  ChessTutorialVoiceCue,
} from "./story/chessTutorial";

/* ─── Oracle Deck (Phase E) ─── */
export {
  ORACLE_DECK,
  ORACLE_DECK_MAP,
  ORACLE_DECK_BY_ID,
  getOracleCardBySlug,
  getOracleCardById,
  listOracleCardsByUnlockKind,
} from "./tarot/oracleDeck";
export type {
  OracleCard,
  OracleArcanum,
  OracleUnlockKind,
  OracleUnlockCondition,
  OracleBuff,
  OracleDeck,
  OracleDeckLookup,
} from "./tarot/oracleDeckTypes";
export {
  DAILY_SPREAD,
  PRE_MATCH_SPREAD,
  WEEKLY_SPREAD,
  ORACLE_SPREADS,
  getOracleSpread,
} from "./tarot/spreads";
export type {
  OracleSpreadKind,
  OracleSpreadShape,
  OracleSpreadPosition,
  OracleDrawnPosition,
} from "./tarot/spreads";
export {
  castReading,
  deriveReadingSeed,
  fnv1a32,
  mulberry32,
} from "./tarot/readings";
export type { OracleReading } from "./tarot/readings";

/* ─── Campaign chapters (WS6) ─── */
export {
  ALL_CHAPTER_ENCOUNTERS,
  CHAPTER_MAP,
  DIFFICULTY_HP_SCALE,
} from "./story/chapters";

/* ─── Dialog Bank (Phase D) ─── */
export {
  DIALOG_BANK,
  resolveDialog,
  getDialogBankCoverage,
} from "./story/dialogBank";
export type {
  DialogSpeaker,
  DialogMood,
  DialogCue,
  DialogScene,
} from "./story/dialogBank";

/* ─── Engineer's Logs (Phase A / FNORD-23) ─── */
export {
  ENGINEER_LOGS,
  ENGINEER_LOG_MAP,
  getLogForUnlock,
} from "./story/engineerLogs";
export type {
  EngineerLog,
  EngineerLogUnlockKind,
  MusicPrompt,
} from "./story/engineerLogs";

/* ─── FNORD-23 (Phase G) ─── */
export { FNORD_EFFECTS, FNORD23_DEVICE_LORE } from "./audio/fnord23";
export type {
  InstrumentalTrack,
  ChannelDefinition,
  MemoryResinEntry,
  RemixState,
  BeatGameScore,
  Fnord23UserState,
  FnordEffect,
} from "./audio/fnord23";
export {
  OUTERGROOVE_CHANNEL,
  OUTERGROOVE_TRACKS,
  OUTERGROOVE_TRACK_MAP,
  ALL_CHANNELS,
  ALL_INSTRUMENTAL_TRACKS,
  INSTRUMENTAL_TRACK_MAP,
} from "./audio/outergroove";

/* ─── Economy (WS8) ─── */
export { openPack, STANDARD_PACK, SOUL_STONE_VALUES } from "./economy/packs";
export type { PackType, PackResult } from "./economy/packs";
export {
  RANKED_TIERS,
  getTierForRating,
  ELO_CONFIG,
  calculateEloChange,
  SEASON_REWARDS,
} from "./economy/ranked";
export type {
  RankedTier,
  EloConfig,
  SeasonReward,
} from "./economy/ranked";
export { CURRENCIES, CURRENCY_MAP, ECONOMY } from "./economy/config";
export type { CurrencyType, EconomyConfig } from "./economy/config";

/* ─── Campaign AI ─── */
export { chooseCampaignAction } from "./ai/campaignAI";

/* ─── Starter Decks ─── */
export {
  ALL_STARTER_DECKS,
  STARTER_DECK_MAP,
  ARCHITECT_STARTER,
  INSURGENCY_STARTER,
  DREAMER_STARTER,
  NEW_BABYLON_STARTER,
  ANTIQUARIAN_STARTER,
  THOUGHT_VIRUS_STARTER,
} from "./decks/starterDecks";
export type { StarterDeck } from "./decks/starterDecks";

/* ─── Balance ─── */
export { STAT_CURVE, KEYWORD_TAX, getExpectedStats } from "./balance/statCurve";
export { audit as runBalanceAudit } from "./balance/balanceAudit";

/* ─── Booster Pack System ─── */
export {
  VARIANT_DROP_RATES,
  BOOSTER_CARD_META,
  BOOSTER_CARD_MAP,
} from "./packs/boosterSystem";
export type {
  CardVariant,
  VariantDropRate,
  CrossGameUnlock,
  BoosterCardMeta,
} from "./packs/boosterSystem";

/* ─── Card Rewards (WS-D) ─── */
export type {
  RewardType,
  MoralityBranch,
  VoteBranch,
  CardRewardSource,
  MoralityRewardTier,
  MoralAxis,
  VoteRewardConfig,
  GameModeReward,
} from "./rewards/index";
export {
  CARD_REWARD_REGISTRY,
  REWARD_MAP,
  MORALITY_REWARD_TIERS,
  computeDominantAxis,
  VOTE_REWARD_CONFIGS,
  VOTE_REWARD_MAP,
  ALL_GAME_MODE_REWARDS,
  GAME_MODE_REWARD_MAP,
  REWARDS_BY_MODE,
} from "./rewards/index";

/* ─── NPC Imprints (Phase F) ─── */
export type {
  ImprintTier,
  ImprintNpcEntry,
  ImprintFragmentSource,
} from "./rewards/index";
export {
  IMPRINT_REGISTRY,
  IMPRINT_REGISTRY_BY_SLUG,
  IMPRINT_TIER_RARITY,
  IMPRINT_THRESHOLDS,
  IMPRINT_FRAGMENT_SOURCES,
  CHAPTER_TO_IMPRINT_NPCS,
  getImprintNpc,
  tierForFragments,
  tieredCardDefIdsFor,
} from "./rewards/index";

/* ─── Compat (legacy client translation) ─── */
export {
  translateClientAction,
  type TranslateResult,
} from "./compat/legacyClient";
export {
  adaptTcgStateToLegacyView,
  type LegacyDuelystGameState,
  type LegacyBoardUnit,
  type LegacyDuelystCard,
  type LegacyDuelystPlayer,
} from "./compat/viewAdapter";

/* ─── Heat (per-run modifiers, #1) ─── */
export {
  HEAT_MODIFIERS,
  MAX_HEAT_LEVEL,
  MAX_MODIFIER_COST,
  getModifier,
  totalHeatCost,
  validateHeatConfig,
  modifiersUnlockedAtTier,
} from "./heat";
export type {
  Modifier,
  ModifierTrigger,
  ModifierCategory,
  HeatConfig,
  HeatValidationResult,
} from "./heat";
