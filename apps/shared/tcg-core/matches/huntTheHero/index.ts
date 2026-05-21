/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO — public surface

   Single-player tactical card minigame that opens after
   the Wolf E5 release cinematic. See state.ts for the
   architectural overview.
   ═══════════════════════════════════════════════════════ */

export {
  type HuntPhase,
  type HuntState,
  type Hero,
  type HeroId,
  type HeroResolution,
  type HuntOutcome,
  type PlayerCardId,
  type WolfCardId,
  type CardId,
  HERO_IDS,
  survivingHeroCount,
  killedHeroCount,
} from "./state";

export {
  PLAYER_CARD_DEFS,
  WOLF_CARD_DEFS,
  PLAYER_STARTING_DECK,
  WOLF_STARTING_DECK,
  type PlayerCardDef,
  type WolfCardDef,
} from "./cards";

export {
  initialHuntState,
  type HuntInitInputs,
} from "./initialState";

export {
  reduceHunt,
  type HuntAction,
  type HuntReduceError,
  type HuntReduceErrorCode,
  type HuntReduceResult,
} from "./reducer";

/** Stable narrative-flag name for the outcome of a finished
 *  match. Server writes this when phase === "ended" so the
 *  world-feedback layer (companion comments, Lycos recruitment
 *  in Section D) reads from a single canonical surface. */
export function huntOutcomeFlag(outcome: import("./state").HuntOutcome): string {
  return `wolf.hunt_the_hero_outcome_${outcome}`;
}

/** Sentinel flag the client uses to gate the "Begin the Hunt"
 *  CTA. Server writes this on cinematic-seen for Wolf, and
 *  flips it false when the minigame ends. */
export const HUNT_THE_HERO_AVAILABLE_FLAG = "wolf.hunt_the_hero_available";
