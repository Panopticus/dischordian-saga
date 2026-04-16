/**
 * Story encounter types + runner.
 *
 * A StoryEncounter defines a scripted campaign match: the boss's deck,
 * AI behavior, custom win/lose conditions, and narrative hooks that
 * fire mid-match (dialog, cinematics, board modifications).
 *
 * The encounter runner wraps the standard tcg-core reducer with a
 * NarrativeObserver that checks hooks after every action. The runner
 * is a pure function: given a StoryEncounter + player's deck/faction,
 * it produces an initial GameState in mulligan phase ready to play.
 *
 * Narrative hooks are sidecar observers — they do NOT modify the
 * engine's pure reducer. They observe state + events and return
 * narrative commands (play dialog, show cinematic, modify state via
 * a controlled patch). The UI layer interprets these commands.
 */
import {
  createMatchState,
  reduce,
  type GameState,
  type Action,
  type CardRegistry,
  type MatchConfig,
  type GameEvent,
} from "../index";
import type { ScriptedAction } from "../types/ScriptedAction";
import { resolveDialog, type DialogScene } from "./dialogBank";

/* ─── Types ─── */

export interface StoryEncounter {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  /** The boss faction and general. */
  bossFaction: string;
  bossGeneralDefId: string;
  /** The boss's pre-built deck (card def ids). */
  bossDeckCardDefIds: readonly string[];
  /** Deterministic seed per encounter — same seed = same shuffle. */
  seed: string;
  /** Custom win conditions beyond general death. */
  winConditions: WinCondition[];
  /** Custom lose conditions. */
  loseConditions: LoseCondition[];
  /** Narrative hooks that fire based on state/events. */
  narrativeHooks: NarrativeHook[];
  /** Pre-match dialog reference. */
  preMatchDialog?: string;
  /** Post-match dialog (win). */
  postMatchWinDialog?: string;
  /** Post-match dialog (loss). */
  postMatchLossDialog?: string;
  /**
   * Optional scripted-action queue. Forwarded to the engine via
   * createMatchState; the engine drains entries after each
   * turn-refresh whose `(globalTurn, side)` matches. The §5.5
   * Warlord Zero encounter is the canonical user — it scripts the
   * Three Moves cast on the Warlord's turn 3 (global turn 3 with
   * side === 1) so the lockout fires deterministically. See
   * engine/scriptedActions.ts.
   */
  scriptedActions?: readonly ScriptedAction[];
}

export type WinCondition =
  | { kind: "general_killed" } // default — kill the boss
  | { kind: "survive_turns"; turns: number } // survive N turns
  | { kind: "kill_before_turn"; turn: number }; // kill boss before turn N

export type LoseCondition =
  | { kind: "general_killed" } // default — your general dies
  | { kind: "turn_limit"; turn: number }; // lose if match reaches turn N

export interface NarrativeHook {
  id: string;
  /** Only fires once if true. */
  once: boolean;
  /** State condition for the hook to fire. */
  condition: NarrativeCondition;
  /** What to do when fired. */
  action: NarrativeAction;
}

export type NarrativeCondition =
  | { kind: "turn_reached"; turn: number }
  | { kind: "boss_hp_below"; percent: number }
  | { kind: "player_hp_below"; percent: number }
  | { kind: "unit_killed"; defId: string }
  | { kind: "always" }; // fires on every state check

export type NarrativeAction =
  | { kind: "play_dialog"; dialogId: string }
  | { kind: "show_cinematic"; cinematicId: string }
  | { kind: "boss_taunt"; text: string };

/* ─── Encounter runner ─── */

export interface EncounterInit {
  encounter: StoryEncounter;
  playerFaction: string;
  playerGeneralDefId: string;
  playerDeckCardDefIds: readonly string[];
  registry: CardRegistry;
}

export interface EncounterState {
  gameState: GameState;
  firedHooks: Set<string>;
}

/**
 * Initialize a story encounter. Returns a GameState in mulligan phase
 * ready for the player to interact with.
 */
export function initEncounter(input: EncounterInit): EncounterState {
  const { encounter, registry } = input;
  const p1Config: MatchConfig = {
    userId: 1 as MatchConfig["userId"],
    faction: input.playerFaction as MatchConfig["faction"],
    generalDefId: input.playerGeneralDefId,
    deckCardDefIds: input.playerDeckCardDefIds,
  };
  const p2Config: MatchConfig = {
    userId: 0 as MatchConfig["userId"], // AI
    faction: encounter.bossFaction as MatchConfig["faction"],
    generalDefId: encounter.bossGeneralDefId,
    deckCardDefIds: encounter.bossDeckCardDefIds,
  };
  const gameState = createMatchState({
    matchId: `story_${encounter.id}`,
    seed: encounter.seed,
    p1: p1Config,
    p2: p2Config,
    registry,
    scriptedActions: encounter.scriptedActions,
  });
  return { gameState, firedHooks: new Set() };
}

/**
 * Check narrative hooks against the current state. Returns any
 * NarrativeActions that should fire. Mutates `firedHooks` to track
 * once-only hooks.
 */
export function checkNarrativeHooks(
  encounter: StoryEncounter,
  state: GameState,
  firedHooks: Set<string>
): NarrativeAction[] {
  const actions: NarrativeAction[] = [];
  for (const hook of encounter.narrativeHooks) {
    if (hook.once && firedHooks.has(hook.id)) continue;
    if (evaluateNarrativeCondition(hook.condition, state)) {
      actions.push(hook.action);
      if (hook.once) firedHooks.add(hook.id);
    }
  }
  return actions;
}

function evaluateNarrativeCondition(
  cond: NarrativeCondition,
  state: GameState
): boolean {
  switch (cond.kind) {
    case "turn_reached":
      return state.turnNumber >= cond.turn;
    case "boss_hp_below": {
      const genId = state.players[1].generalEntityId;
      const gen = Object.values(state.board).find(
        (e) => e.entityId === genId
      );
      if (!gen) return true; // dead
      const pct = gen.card.currentHealth / gen.card.maxHealth;
      return pct < cond.percent / 100;
    }
    case "player_hp_below": {
      const genId = state.players[0].generalEntityId;
      const gen = Object.values(state.board).find(
        (e) => e.entityId === genId
      );
      if (!gen) return true;
      const pct = gen.card.currentHealth / gen.card.maxHealth;
      return pct < cond.percent / 100;
    }
    case "unit_killed": {
      return state.players[1].graveyard.some(
        (c) => c.defId === cond.defId
      );
    }
    case "always":
      return true;
    default:
      return false;
  }
}

/**
 * Check custom win/lose conditions. Returns the outcome or null if
 * the match is still in progress.
 */
export function checkEncounterOutcome(
  encounter: StoryEncounter,
  state: GameState
): "win" | "lose" | null {
  // Check engine's built-in win first.
  if (state.phase === "ended") {
    return state.winner === 0 ? "win" : "lose";
  }
  // Custom win conditions.
  for (const wc of encounter.winConditions) {
    switch (wc.kind) {
      case "survive_turns":
        if (state.turnNumber > wc.turns && state.phase === "playing") {
          return "win";
        }
        break;
      case "kill_before_turn":
        // Win handled by general_killed above; this is a deadline.
        if (state.turnNumber >= wc.turn && state.phase === "playing") {
          return "lose"; // failed to kill in time
        }
        break;
    }
  }
  // Custom lose conditions.
  for (const lc of encounter.loseConditions) {
    if (lc.kind === "turn_limit" && state.turnNumber >= lc.turn) {
      return "lose";
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   DIALOG BANK RESOLVERS (Phase D2)
   Each helper bridges the encounter data model (which only
   carries string ids like "dialog_ch1_pre") to the dialog
   bank (which owns the actual authored content). Callers
   use these at the three natural seams of a match —
   pre-match, post-match, and mid-match narrative hooks.
   ═══════════════════════════════════════════════════════ */

/**
 * Resolve the pre-match dialog scene for an encounter, if any.
 * Call this immediately after `initEncounter()` to drive the
 * client's pre-match cutscene. Returns `null` when the encounter
 * has no dialog id set, or when the id exists but no scene has
 * been authored yet (useful for graceful fallback during content
 * buildout).
 */
export function resolvePreMatchDialog(
  encounter: StoryEncounter
): DialogScene | null {
  return resolveDialog(encounter.preMatchDialog) ?? null;
}

/**
 * Resolve the post-match dialog scene for an encounter based on
 * the match outcome. Call this the moment `checkEncounterOutcome`
 * returns a non-null result. Returns `null` on:
 *   - `null` outcome (match still in progress — misuse)
 *   - encounter has no win/loss dialog id set
 *   - dialog id exists but no scene authored yet
 */
export function resolvePostMatchDialog(
  encounter: StoryEncounter,
  outcome: "win" | "lose"
): DialogScene | null {
  const dialogId =
    outcome === "win"
      ? encounter.postMatchWinDialog
      : encounter.postMatchLossDialog;
  return resolveDialog(dialogId) ?? null;
}

/**
 * A narrative action enriched with the resolved dialog scene
 * (if the action carries a dialog or cinematic reference). The
 * original `NarrativeAction` union is preserved for the call
 * sites that only care about the action type; this enriched
 * variant gives the client everything it needs to render the
 * scene in a single object.
 */
export type ResolvedNarrativeAction =
  | { kind: "play_dialog"; dialogId: string; scene: DialogScene | null }
  | { kind: "show_cinematic"; cinematicId: string; scene: DialogScene | null }
  | { kind: "boss_taunt"; text: string };

/**
 * Resolve the dialog/cinematic references on any narrative
 * actions the encounter just fired. `boss_taunt` actions pass
 * through unchanged (they carry their text inline). The other
 * two action kinds gain a `scene` field that resolves to the
 * full authored content — or `null` if the id is unknown.
 *
 * Typical usage inside the match loop:
 *
 *   const actions = checkNarrativeHooks(encounter, state, firedHooks);
 *   const resolved = resolveNarrativeActions(actions);
 *   for (const r of resolved) sendToClient(r);
 */
export function resolveNarrativeActions(
  actions: readonly NarrativeAction[]
): ResolvedNarrativeAction[] {
  return actions.map((action) => {
    switch (action.kind) {
      case "play_dialog":
        return {
          kind: "play_dialog",
          dialogId: action.dialogId,
          scene: resolveDialog(action.dialogId) ?? null,
        };
      case "show_cinematic":
        return {
          kind: "show_cinematic",
          cinematicId: action.cinematicId,
          scene: resolveDialog(action.cinematicId) ?? null,
        };
      case "boss_taunt":
        return { kind: "boss_taunt", text: action.text };
      default: {
        // Exhaustiveness guard — new NarrativeAction variants will
        // surface here at build time.
        const _exhaust: never = action;
        void _exhaust;
        throw new Error(
          `resolveNarrativeActions: unknown NarrativeAction kind`
        );
      }
    }
  });
}
