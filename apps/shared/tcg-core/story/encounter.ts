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
