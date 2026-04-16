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

export type ScriptedAction = ScriptedForcePlayCard;

export interface ScriptedForcePlayCard {
  kind: "force_play_card";
  /** Global GameState.turnNumber at which to fire. */
  globalTurn: number;
  /** Which side performs the play. */
  side: Side;
  /** CardDefinition id to find + play. */
  cardDefId: string;
}
