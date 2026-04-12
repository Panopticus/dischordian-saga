/**
 * Server-side TCG match core helpers.
 *
 * Pure functions that glue the legacy Duelyst WebSocket protocol to the
 * real tcg-core reducer living in apps/shared/tcg-core. This file is the
 * one place that knows how to:
 *
 *   - Translate incoming client GAME_ACTION payloads (which still use the
 *     old `type: "move" | ...` shape from apps/client/src/game/duelyst/
 *     types.ts) into the new reducer's Action shape.
 *   - Pick a server-seeded match seed deterministically from two player
 *     IDs + a wall-clock nonce so replays can be reproduced from the DB.
 *   - Resolve a client-supplied faction string to a Faction + generalDefId
 *     pair, so MatchConfigs can be built without the client knowing
 *     anything about card definition ids.
 *   - Serialize a GameState + which side is asking, so each client gets
 *     a `{state, isYourTurn}` bundle that matches the existing protocol.
 *
 * Everything here is pure over its inputs so it can be unit-tested without
 * a WebSocket server. The thin WebSocket wrapper lives in
 * apps/server/duelystWs.ts and composes these helpers.
 *
 * Note on the CardRegistry: the server builds a singleton registry at
 * module load from the hand-authored ALL_CARD_DEFINITIONS barrel. The
 * registry is frozen — match creation consults it for base stats and
 * keywords. Unknown card def ids mint placeholder 0/1 instances, so the
 * match still runs even if format validation let something through.
 */
import {
  buildCardRegistry,
  createMatchState,
  ALL_CARD_DEFINITIONS,
  type Action,
  type CardRegistry,
  type GameState,
  type MatchConfig,
} from "../../shared/tcg-core";

/**
 * Shared singleton CardRegistry. Built once at module load; import this
 * from the WS wrapper and anywhere else that needs to reduce actions.
 */
export const serverCardRegistry: CardRegistry = buildCardRegistry(
  ALL_CARD_DEFINITIONS
);

/* ─── Faction → general mapping ─── */

/**
 * Known factions the server accepts in JOIN_QUEUE. Matches the client
 * side's Faction union. `neutral` is intentionally omitted: a player
 * cannot command a neutral general.
 */
const VALID_FACTIONS = new Set([
  "architect",
  "dreamer",
  "insurgency",
  "new_babylon",
  "antiquarian",
  "thought_virus",
] as const);

type ValidFaction =
  | "architect"
  | "dreamer"
  | "insurgency"
  | "new_babylon"
  | "antiquarian"
  | "thought_virus";

/**
 * Canonical general card definition id per faction. These ids are
 * placeholders until the generals are hand-authored — the match init
 * path is lenient about unknown card ids (mints 0/1 vanilla instances),
 * so matches still play.
 */
const FACTION_GENERALS: Record<ValidFaction, string> = {
  architect: "gen_architect",
  dreamer: "gen_dreamer",
  insurgency: "gen_insurgency",
  new_babylon: "gen_new_babylon",
  antiquarian: "gen_antiquarian",
  thought_virus: "gen_thought_virus",
};

export interface FactionResolution {
  faction: ValidFaction;
  generalDefId: string;
}

export function resolveFaction(raw: string): FactionResolution | null {
  if (!VALID_FACTIONS.has(raw as ValidFaction)) return null;
  const faction = raw as ValidFaction;
  return { faction, generalDefId: FACTION_GENERALS[faction] };
}

/* ─── MatchConfig builder ─── */

export interface JoinQueueInput {
  userId: number;
  faction: string;
  deckCardIds: readonly string[];
}

export interface BuildMatchConfigResult {
  config?: MatchConfig;
  error?: string;
}

export function buildMatchConfig(input: JoinQueueInput): BuildMatchConfigResult {
  const resolved = resolveFaction(input.faction);
  if (!resolved) {
    return { error: `unknown faction '${input.faction}'` };
  }
  if (!Array.isArray(input.deckCardIds) || input.deckCardIds.length === 0) {
    return { error: "deckCardIds must be a non-empty array" };
  }
  if (input.deckCardIds.some((id) => typeof id !== "string" || id.length === 0)) {
    return { error: "deckCardIds must contain non-empty strings" };
  }
  return {
    config: {
      userId: input.userId as MatchConfig["userId"],
      faction: resolved.faction,
      generalDefId: resolved.generalDefId,
      deckCardDefIds: input.deckCardIds.map((s) => s),
    },
  };
}

/* ─── Seed generation ─── */

/**
 * Derive a deterministic match seed from (matchId, playerIds). The wall-
 * clock component of matchId keeps seeds unique per match, so replays
 * tied to the same matchId always reproduce the same shuffle/draws.
 */
export function generateMatchSeed(
  matchId: string,
  p1Id: number,
  p2Id: number
): string {
  return `${matchId}:${Math.min(p1Id, p2Id)}:${Math.max(p1Id, p2Id)}`;
}

/* ─── Match creation ─── */

export interface CreateMatchArgs {
  matchId: string;
  p1: MatchConfig;
  p2: MatchConfig;
}

export function createServerMatchState(args: CreateMatchArgs): GameState {
  const seed = generateMatchSeed(args.matchId, args.p1.userId, args.p2.userId);
  return createMatchState({
    matchId: args.matchId,
    seed,
    p1: args.p1,
    p2: args.p2,
    registry: serverCardRegistry,
  });
}

/* ─── Action translation ─── */

/**
 * Translate a legacy client GAME_ACTION payload into the reducer's new
 * Action shape. Returns a discriminated union: either a valid Action
 * ready to feed to reduce(), or an error describing what was wrong with
 * the payload.
 *
 * Legacy client uses:
 *   - `type` field instead of `kind`
 *   - `unitId` instead of `entityId`
 *   - `cardIndex` instead of `handIndex`
 *   - no `actor` field (derived from the socket's authenticated side)
 *   - no `seq` field (assigned monotonically by the server)
 */
export type TranslateResult =
  | { ok: true; action: Action }
  | { ok: false; error: string };

export function translateClientAction(
  raw: unknown,
  actor: 0 | 1,
  seq: number
): TranslateResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "action payload must be an object" };
  }
  const m = raw as Record<string, unknown>;
  const type = typeof m.type === "string" ? m.type : null;
  if (!type) return { ok: false, error: "action.type missing or not a string" };

  switch (type) {
    case "move": {
      const entityId = typeof m.unitId === "string" ? m.unitId : null;
      const toRow = typeof m.toRow === "number" ? m.toRow : null;
      const toCol = typeof m.toCol === "number" ? m.toCol : null;
      if (!entityId || toRow === null || toCol === null) {
        return { ok: false, error: "move requires unitId + toRow + toCol" };
      }
      return { ok: true, action: { kind: "move", actor, entityId, toRow, toCol, seq } };
    }

    case "attack": {
      const attackerId = typeof m.attackerId === "string" ? m.attackerId : null;
      const targetId = typeof m.targetId === "string" ? m.targetId : null;
      if (!attackerId || !targetId) {
        return { ok: false, error: "attack requires attackerId + targetId" };
      }
      return {
        ok: true,
        action: { kind: "attack", actor, attackerId, targetId, seq },
      };
    }

    case "play_card": {
      const handIndex = typeof m.cardIndex === "number" ? m.cardIndex : null;
      if (handIndex === null) {
        return { ok: false, error: "play_card requires cardIndex" };
      }
      return {
        ok: true,
        action: {
          kind: "play_card",
          actor,
          handIndex,
          row: typeof m.row === "number" ? m.row : undefined,
          col: typeof m.col === "number" ? m.col : undefined,
          targetEntityId:
            typeof m.targetId === "string" ? m.targetId : undefined,
          chooseIndex:
            typeof m.chooseIndex === "number" ? m.chooseIndex : undefined,
          seq,
        },
      };
    }

    case "replace_card": {
      const handIndex = typeof m.cardIndex === "number" ? m.cardIndex : null;
      if (handIndex === null) {
        return { ok: false, error: "replace_card requires cardIndex" };
      }
      return { ok: true, action: { kind: "replace_card", actor, handIndex, seq } };
    }

    case "bloodborn_spell": {
      return {
        ok: true,
        action: {
          kind: "bloodborn_spell",
          actor,
          row: typeof m.targetRow === "number" ? m.targetRow : undefined,
          col: typeof m.targetCol === "number" ? m.targetCol : undefined,
          targetEntityId:
            typeof m.targetId === "string" ? m.targetId : undefined,
          seq,
        },
      };
    }

    case "end_turn":
      return { ok: true, action: { kind: "end_turn", actor, seq } };

    case "mulligan": {
      const replaceIndices = Array.isArray(m.replaceIndices)
        ? (m.replaceIndices.filter((x) => typeof x === "number") as number[])
        : [];
      return {
        ok: true,
        action: { kind: "mulligan", actor, replaceIndices, seq },
      };
    }

    case "finish_mulligan":
      return { ok: true, action: { kind: "finish_mulligan", actor, seq } };

    case "concede":
      return { ok: true, action: { kind: "concede", actor, seq } };

    default:
      return { ok: false, error: `unknown action type: ${type}` };
  }
}

/* ─── Broadcast serialization ─── */

/**
 * Build the per-player GAME_STATE payload the WebSocket server sends.
 * Both clients receive the full state — hiding opponent's hidden zones
 * (e.g. hand contents) is a separate scrubbing pass and can be added
 * here in a follow-up when fog-of-war ships.
 */
export function serializeForClient(
  state: GameState,
  side: 0 | 1
): { state: GameState; isYourTurn: boolean } {
  return {
    state,
    isYourTurn: state.currentPlayer === side && state.phase !== "ended",
  };
}

/**
 * Map the engine's `winReason` into the legacy MATCH_RESULT `reason`
 * string the client knows.
 */
export function endReasonFromWinReason(
  winReason: GameState["winReason"]
): "game_over" | "surrender" | "disconnect" | "turn_limit" {
  switch (winReason) {
    case "surrender":
      return "surrender";
    case "disconnect_forfeit":
      return "disconnect";
    case "turn_limit":
      return "turn_limit";
    case "general_killed":
    case null:
    default:
      return "game_over";
  }
}
