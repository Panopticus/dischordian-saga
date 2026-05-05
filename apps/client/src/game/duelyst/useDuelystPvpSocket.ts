/* ═══════════════════════════════════════════════════════
   useDuelystPvpSocket — Duelyst multiplayer WebSocket hook

   Mirrors the connectWs() pattern at PvpArenaPage.tsx:234.
   Wraps the /api/duelyst-pvp protocol (apps/server/duelystWs.ts:88-92)
   in a React-friendly state machine + send helpers. The matchmaking
   page mounts this hook once; the hook owns the socket lifecycle.

   Wire format (server-side ClientMessage / ServerMessage):
     Client → Server: PING, JOIN_QUEUE, LEAVE_QUEUE, GAME_ACTION,
                      SURRENDER
     Server → Client: PONG, QUEUE_JOINED, QUEUE_UPDATE, MATCH_FOUND,
                      GAME_STATE, OPPONENT_DISCONNECTED, MATCH_RESULT,
                      ERROR
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";

export type DuelystSide = 0 | 1;
export type DuelystPhase = "idle" | "queue" | "match_found" | "playing" | "ended" | "error";

/** Server-side `state` payload is the engine's GameState; the client
 *  receives it as opaque JSON and renders against the runtime shape. */
export type DuelystGameStatePayload = unknown;

export interface DuelystMatchResult {
  result: "win" | "loss" | "draw";
  eloChange: number;
}

export interface UseDuelystPvpSocketOptions {
  /** Currently-authenticated user. The hook is a no-op until present. */
  user: { id: number; name: string } | null;
}

export interface UseDuelystPvpSocketState {
  phase: DuelystPhase;
  /** Queue position from QUEUE_JOINED / QUEUE_UPDATE (1-indexed). */
  queuePosition: number | null;
  playersInQueue: number | null;
  matchId: string | null;
  mySide: DuelystSide | null;
  opponentName: string | null;
  opponentFaction: string | null;
  /** Most-recent GAME_STATE payload from the server. */
  gameState: DuelystGameStatePayload | null;
  isYourTurn: boolean;
  matchResult: DuelystMatchResult | null;
  opponentDisconnected: boolean;
  errors: readonly string[];
  /** True while the socket is open. Useful for disabling action buttons. */
  connected: boolean;
}

export interface UseDuelystPvpSocketActions {
  /** Open the socket + send JOIN_QUEUE. Idempotent — replaces any
   *  existing connection. */
  joinQueue: (input: {
    faction: string;
    deckCardIds: readonly string[];
    heatModifiers?: readonly string[];
  }) => void;
  /** Send LEAVE_QUEUE (if in queue) or close the socket cleanly. */
  leaveQueue: () => void;
  /** Send a GAME_ACTION. The action payload is the legacy client
   *  action shape that translateClientAction parses server-side. */
  sendAction: (action: unknown) => void;
  /** Send SURRENDER. Server ends the match with the opponent as winner. */
  surrender: () => void;
  /** Reset the hook state back to idle. Use after a match ends to return
   *  the player to the lobby. Closes the socket if open. */
  reset: () => void;
}

export type UseDuelystPvpSocket =
  & UseDuelystPvpSocketState
  & UseDuelystPvpSocketActions;

export interface ServerMessage {
  type: string;
  [key: string]: unknown;
}

/**
 * Pure reducer over server messages. Extracted so the protocol parsing
 * + phase transitions are testable without needing a DOM. The hook
 * below just plumbs WebSocket onmessage into this function.
 */
export function applyServerMessage(
  s: UseDuelystPvpSocketState,
  msg: ServerMessage,
): UseDuelystPvpSocketState {
  switch (msg.type) {
    case "QUEUE_JOINED":
      return {
        ...s,
        phase: "queue",
        queuePosition: typeof msg.position === "number" ? msg.position : null,
      };
    case "QUEUE_UPDATE":
      return {
        ...s,
        queuePosition: typeof msg.position === "number" ? msg.position : s.queuePosition,
        playersInQueue: typeof msg.playersInQueue === "number" ? msg.playersInQueue : s.playersInQueue,
      };
    case "MATCH_FOUND":
      return {
        ...s,
        phase: "match_found",
        matchId: typeof msg.matchId === "string" ? msg.matchId : null,
        mySide: msg.yourSide === 0 || msg.yourSide === 1 ? msg.yourSide : null,
        opponentName: typeof msg.opponentName === "string" ? msg.opponentName : null,
        opponentFaction: typeof msg.opponentFaction === "string" ? msg.opponentFaction : null,
      };
    case "GAME_STATE":
      return {
        ...s,
        phase: "playing",
        gameState: msg.state ?? null,
        isYourTurn: msg.isYourTurn === true,
      };
    case "OPPONENT_DISCONNECTED":
      return { ...s, opponentDisconnected: true };
    case "MATCH_RESULT":
      return {
        ...s,
        phase: "ended",
        matchResult: {
          result:
            msg.result === "win" || msg.result === "loss" || msg.result === "draw"
              ? msg.result
              : "draw",
          eloChange: typeof msg.eloChange === "number" ? msg.eloChange : 0,
        },
      };
    case "ERROR":
      return {
        ...s,
        errors: [
          ...s.errors,
          typeof msg.message === "string" ? msg.message : "Server error",
        ],
      };
    case "PONG":
      return s;
    default:
      // Unknown message type — log but don't error so future server
      // additions are forward-compatible.
      console.warn("[DuelystPvp] unknown server message:", msg.type);
      return s;
  }
}

function buildWsUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/duelyst-pvp`;
}

const INITIAL_STATE: UseDuelystPvpSocketState = {
  phase: "idle",
  queuePosition: null,
  playersInQueue: null,
  matchId: null,
  mySide: null,
  opponentName: null,
  opponentFaction: null,
  gameState: null,
  isYourTurn: false,
  matchResult: null,
  opponentDisconnected: false,
  errors: [],
  connected: false,
};

export function useDuelystPvpSocket(
  options: UseDuelystPvpSocketOptions,
): UseDuelystPvpSocket {
  const { user } = options;
  const [state, setState] = useState<UseDuelystPvpSocketState>(INITIAL_STATE);
  const wsRef = useRef<WebSocket | null>(null);

  const cleanup = useCallback(() => {
    const sock = wsRef.current;
    wsRef.current = null;
    if (sock && sock.readyState <= WebSocket.OPEN) {
      try { sock.close(); } catch { /* ignore */ }
    }
  }, []);

  const safeSend = useCallback((msg: Record<string, unknown>) => {
    const sock = wsRef.current;
    if (!sock || sock.readyState !== WebSocket.OPEN) return;
    try { sock.send(JSON.stringify(msg)); } catch (err) {
      console.warn("[DuelystPvp] send failed:", err);
    }
  }, []);

  const joinQueue = useCallback<UseDuelystPvpSocketActions["joinQueue"]>(
    (input) => {
      if (!user) {
        setState((s) => ({ ...s, errors: [...s.errors, "Sign in to play multiplayer"] }));
        return;
      }
      cleanup();

      const sock = new WebSocket(buildWsUrl());
      wsRef.current = sock;

      sock.onopen = () => {
        setState((s) => ({ ...s, connected: true }));
        sock.send(JSON.stringify({
          type: "JOIN_QUEUE",
          userId: user.id,
          userName: user.name,
          faction: input.faction,
          deckCardIds: input.deckCardIds,
          heatModifiers: input.heatModifiers ?? [],
        }));
      };

      sock.onmessage = (ev) => {
        let msg: ServerMessage;
        try { msg = JSON.parse(ev.data); } catch { return; }
        setState((s) => applyServerMessage(s, msg));
      };

      sock.onclose = () => {
        setState((s) => ({
          ...s,
          connected: false,
          // If the socket dies before we hit a real terminal phase
          // (queue / match_found / playing), drop back to idle so the
          // user can re-queue.
          phase: s.phase === "playing" || s.phase === "ended" ? s.phase : "idle",
        }));
        wsRef.current = null;
      };

      sock.onerror = () => {
        setState((s) => ({
          ...s,
          errors: [...s.errors, "WebSocket error — connection lost"],
          phase: "error",
        }));
      };

      // Reset transient state for the new session.
      setState({
        ...INITIAL_STATE,
        phase: "idle",
      });
    },
    [user, cleanup],
  );

  const leaveQueue = useCallback(() => {
    safeSend({ type: "LEAVE_QUEUE" });
    cleanup();
    setState(INITIAL_STATE);
  }, [safeSend, cleanup]);

  const sendAction = useCallback<UseDuelystPvpSocketActions["sendAction"]>(
    (action) => {
      safeSend({ type: "GAME_ACTION", action });
    },
    [safeSend],
  );

  const surrender = useCallback(() => {
    safeSend({ type: "SURRENDER" });
  }, [safeSend]);

  const reset = useCallback(() => {
    cleanup();
    setState(INITIAL_STATE);
  }, [cleanup]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    joinQueue,
    leaveQueue,
    sendAction,
    surrender,
    reset,
  };
}
