/**
 * TcgClient — client-side match controller.
 *
 * Wraps the shared tcg-core reducer to provide a clean interface for
 * DuelystGameUI. It speaks the legacy action shape on input (the UI
 * still constructs `{ type: "move", unitId, ... }` objects) and the
 * legacy state shape on output (the UI still reads `state.board.get()`
 * and `unit.activeKeywords.has()`), while internally running all logic
 * through the deterministic tcg-core pure reducer.
 *
 * This means:
 *   - Actions go through `translateClientAction` before hitting reduce()
 *   - State is projected through `adaptTcgStateToLegacyView` after
 *     reduce() so the UI reads the familiar DuelystGameState shape
 *   - Validation helpers (getValidMoves, getValidAttacks, etc.) run
 *     against the canonical tcg-core state, not the legacy view
 *
 * The TcgClient also manages a monotonic sequence counter (`nextSeq`) so
 * the UI doesn't have to track it, and provides the CardRegistry for
 * display lookups.
 *
 * For PvP: the TcgClient can optionally be driven in "remote" mode where
 * the canonical state comes from the server rather than from a local
 * reduce(). The view adapter still works the same way. That mode lands
 * in a follow-up commit.
 */
import {
  createMatchState,
  reduce,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  type GameState,
  type CardRegistry,
  type ReduceResult,
  type MatchConfig,
  type GameEvent,
} from "@shared/tcg-core";
import type { TrialModeConfig } from "@shared/tcg-core/types/TrialPhase";
import type { GiftModeConfig } from "@shared/tcg-core/types/ProgrammerGift";
import type { WitnessModeConfig } from "@shared/tcg-core/types/PublicWitness";
import type { ProphecyModeConfig } from "@shared/tcg-core/types/SeerProphecy";
import type { ScriptedAction } from "@shared/tcg-core/types/ScriptedAction";
import {
  translateClientAction,
  type TranslateResult,
} from "@shared/tcg-core/compat/legacyClient";
import {
  adaptTcgStateToLegacyView,
  type LegacyDuelystGameState,
} from "@shared/tcg-core/compat/viewAdapter";
import { getValidMoves, type Coord } from "@shared/tcg-core";
import type { Faction } from "./types";

/** The client-side CardRegistry. Built once, shared across the session. */
/**
 * Production client registry — opts into strict trial-category
 * coverage so a missing `trial_categories` backfill fails at client
 * bundle evaluation rather than silently at §5.8 runtime.
 */
const clientRegistry: CardRegistry = buildCardRegistry(ALL_CARD_DEFINITIONS, {
  strictTrialCategoryCoverage: true,
});

export { clientRegistry };

export interface TcgDispatchResult {
  ok: boolean;
  viewState: LegacyDuelystGameState;
  events: readonly GameEvent[];
  error?: string;
}

export class TcgClient {
  private state: GameState;
  private nextSeq = 1;
  /** Which side is the local player? 0 for P1, 1 for P2. */
  readonly localSide: 0 | 1;

  constructor(state: GameState, localSide: 0 | 1 = 0) {
    this.state = state;
    this.localSide = localSide;
  }

  /**
   * Convenience factory: create a match from faction + deck config,
   * returning a ready-to-play TcgClient.
   */
  static init(opts: {
    seed?: string;
    matchId?: string;
    p1Faction: string;
    p1DeckCardIds: string[];
    p2Faction: string;
    p2DeckCardIds: string[];
    /** Override the default `gen_<faction>` generals. */
    p1GeneralDefId?: string;
    p2GeneralDefId?: string;
    localSide?: 0 | 1;
    /* ─── Encounter-mode opt-ins ───
       These flow straight through to createMatchState. They're the
       piece that lets §5.5/§5.6/§5.7/§5.8/§4.9 encounters actually
       boot their per-mode state (trial, gift, witness, prophecy)
       when DuelystGameUI launches an encounter match. Before these
       were plumbed, encounter-mode UI branches (PublicWitnessColumn,
       TrialPhaseIndicator, SeerPlayOverlay) had no state to render
       because TcgClient.init never set the mode configs. */
    trialMode?: TrialModeConfig;
    giftMode?: GiftModeConfig;
    witnessMode?: WitnessModeConfig;
    prophecyMode?: ProphecyModeConfig;
    scriptedActions?: readonly ScriptedAction[];
    /** NPC duel replay-pin metadata. Pure pass-through onto
     *  GameState.npcDuelMeta; reducers ignore the field. Set by
     *  NpcDuelOverlay launches. */
    npcDuelMeta?: import("@shared/tcg-core/types/GameState").NpcDuelMeta;
  }): TcgClient {
    const matchId = opts.matchId ?? `local-${Date.now()}`;
    const seed = opts.seed ?? `s-${matchId}`;
    const p1: MatchConfig = {
      userId: 1 as MatchConfig["userId"],
      faction: opts.p1Faction as Faction,
      generalDefId: opts.p1GeneralDefId ?? `gen_${opts.p1Faction}`,
      deckCardDefIds: opts.p1DeckCardIds,
    };
    const p2: MatchConfig = {
      userId: 2 as MatchConfig["userId"],
      faction: opts.p2Faction as Faction,
      generalDefId: opts.p2GeneralDefId ?? `gen_${opts.p2Faction}`,
      deckCardDefIds: opts.p2DeckCardIds,
    };
    const state = createMatchState({
      matchId,
      seed,
      p1,
      p2,
      registry: clientRegistry,
      trialMode: opts.trialMode,
      giftMode: opts.giftMode,
      witnessMode: opts.witnessMode,
      prophecyMode: opts.prophecyMode,
      scriptedActions: opts.scriptedActions,
      npcDuelMeta: opts.npcDuelMeta,
    });
    return new TcgClient(state, opts.localSide ?? 0);
  }

  /** Current canonical state (tcg-core shape). Internal use + PvP sync. */
  getRawState(): GameState {
    return this.state;
  }

  /** Project the canonical state into the legacy DuelystGameState view. */
  getViewState(): LegacyDuelystGameState {
    return adaptTcgStateToLegacyView(this.state, clientRegistry);
  }

  /** The shared CardRegistry, for display lookups. */
  getRegistry(): CardRegistry {
    return clientRegistry;
  }

  /**
   * Dispatch a legacy-shaped action (e.g. `{ type: "move", unitId, ... }`).
   *
   * Translates to tcg-core Action, calls the pure reducer, updates
   * internal state, and returns the new projected view.
   */
  dispatch(legacyAction: Record<string, unknown>): TcgDispatchResult {
    const translated = translateClientAction(
      legacyAction,
      this.localSide,
      this.nextSeq
    );
    if (!translated.ok) {
      return {
        ok: false,
        viewState: this.getViewState(),
        events: [],
        error: `translate error: ${translated.error}`,
      };
    }
    const result = reduce(this.state, translated.action, clientRegistry);
    if (result.error) {
      return {
        ok: false,
        viewState: this.getViewState(),
        events: [],
        error: `${result.error.code}: ${result.error.message}`,
      };
    }
    this.state = result.state;
    this.nextSeq++;
    return {
      ok: true,
      viewState: this.getViewState(),
      events: result.events,
    };
  }

  /**
   * Dispatch an action for the OTHER side (AI's turn in single-player).
   * Same as dispatch but uses the opponent side as actor.
   */
  dispatchOpponent(legacyAction: Record<string, unknown>): TcgDispatchResult {
    const oppSide: 0 | 1 = this.localSide === 0 ? 1 : 0;
    const translated = translateClientAction(
      legacyAction,
      oppSide,
      this.nextSeq
    );
    if (!translated.ok) {
      return {
        ok: false,
        viewState: this.getViewState(),
        events: [],
        error: `translate error: ${translated.error}`,
      };
    }
    const result = reduce(this.state, translated.action, clientRegistry);
    if (result.error) {
      return {
        ok: false,
        viewState: this.getViewState(),
        events: [],
        error: `${result.error.code}: ${result.error.message}`,
      };
    }
    this.state = result.state;
    this.nextSeq++;
    return {
      ok: true,
      viewState: this.getViewState(),
      events: result.events,
    };
  }

  /**
   * Apply a remote server state update (for PvP). Replaces the internal
   * state and bumps seq.
   */
  applyRemoteState(state: GameState): LegacyDuelystGameState {
    this.state = state;
    this.nextSeq = state.actionSeq + 1;
    return this.getViewState();
  }

  /* ─── Query helpers (run against canonical state) ─── */

  getValidMoves(entityId: string): Array<[number, number]> {
    return getValidMoves(this.state, entityId).map(
      (c: Coord) => [c.row, c.col] as [number, number]
    );
  }
}
