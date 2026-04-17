/**
 * Scripted-action queue type.
 *
 * Lives in types/ (not engine/) because GameState references it and
 * the convention is types/ has no engine/ imports. The drain logic
 * + handler dispatch lives in engine/scriptedActions.ts.
 *
 * See engine/scriptedActions.ts for the full lifecycle doc-comment.
 */
import type { Side } from "./Ids";

export type ScriptedAction = ScriptedForcePlayCard | ScriptedOfferProgrammerGift;

export interface ScriptedForcePlayCard {
  kind: "force_play_card";
  /** Global GameState.turnNumber at which to fire. */
  globalTurn: number;
  /** Which side performs the play. */
  side: Side;
  /** CardDefinition id to find + play. */
  cardDefId: string;
}

/**
 * §5.6 Programmer gift offer. Transitions
 * `state.programmerGift` from "not_offered" → "offered" on the
 * scripted turn. No-op if the state is already offered/resolved
 * (idempotent via the engine's pure transition). The UI surfaces
 * the ChoicePillarProgrammerGift on the offered transition.
 */
export interface ScriptedOfferProgrammerGift {
  kind: "offer_programmer_gift";
  /** Global GameState.turnNumber at which to fire. */
  globalTurn: number;
  /** Which side "offers" — narratively the Programmer (opponent). */
  side: Side;
}
