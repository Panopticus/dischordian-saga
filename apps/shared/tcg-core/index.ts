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
export type { MatchConfig, CreateMatchOptions } from "./engine/init";
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
