/**
 * useCadesSignaling — bridge between the CADES Godot iframe and the
 * server's `/ws/cades-signaling` WebSocket.
 *
 * Lifecycle:
 *   1. Hook mounts when a PvP match is active and an iframe ref is
 *      available. Opens the WebSocket and joins the room.
 *   2. Forwards every `MULTIPLAYER_*` PostMessage from the iframe
 *      onto the WebSocket as a plain JSON envelope.
 *   3. Forwards every WS message back to the iframe via PostMessage
 *      (the Godot MultiplayerBridge polls window._mpSignals).
 *   4. On unmount, disconnects cleanly.
 *
 * Owns no peer-connection state — that lives in the Godot side. We're
 * purely a relay.
 */
import { useEffect, useRef } from "react";

type SignalingProps = {
  matchId: string | null;
  role: "host" | "joiner";
  userId: number | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** Optional override; defaults to the page origin. */
  wsUrl?: string;
};

export function useCadesSignaling({
  matchId,
  role,
  userId,
  iframeRef,
  wsUrl,
}: SignalingProps): void {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!matchId || userId == null) return;
    if (typeof window === "undefined") return;

    const url =
      wsUrl ??
      (() => {
        const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
        return `${proto}//${window.location.host}/ws/cades-signaling`;
      })();

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "JOIN_ROOM", matchId, role, userId }));
    });

    ws.addEventListener("message", (e) => {
      let msg: unknown;
      try {
        msg = JSON.parse(typeof e.data === "string" ? e.data : "");
      } catch {
        return;
      }
      if (typeof msg !== "object" || msg === null) return;
      const m = msg as Record<string, unknown>;
      // Server messages get a MULTIPLAYER_* prefix when forwarded
      // to the iframe so the Godot bridge's listener picks them up.
      const t = String(m.type ?? "");
      const forwardedType =
        t === "PEER_READY" ? "MULTIPLAYER_PEER_READY" :
        t === "OFFER" ? "MULTIPLAYER_OFFER" :
        t === "ANSWER" ? "MULTIPLAYER_ANSWER" :
        t === "ICE" ? "MULTIPLAYER_ICE" :
        t === "PEER_LEFT" ? "MULTIPLAYER_PEER_LEFT" :
        t === "ERROR" ? "MULTIPLAYER_ERROR" :
        null;
      if (!forwardedType) return;
      iframeRef.current?.contentWindow?.postMessage(
        { type: forwardedType, payload: m },
        "*",
      );
    });

    // Forward iframe → server.
    const onMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data.type !== "string") return;
      const t = e.data.type as string;
      if (!t.startsWith("MULTIPLAYER_")) return;
      const payload = (e.data.payload ?? {}) as Record<string, unknown>;
      if (ws.readyState !== ws.OPEN) return;
      // Map iframe message types back to the server's wire protocol.
      switch (t) {
        case "MULTIPLAYER_HOST":
        case "MULTIPLAYER_JOIN":
          // Godot bridge already issues JOIN_ROOM when it computes
          // its role; the iframe-issued HOST/JOIN serves as a hint
          // that we *should* have the WS open. No-op here.
          break;
        case "MULTIPLAYER_REQUEST_OFFER":
          // Host wants to start the SDP exchange. The actual
          // createOffer() call happens JS-side in a future patch
          // wrapping `RTCPeerConnection`; this is the trigger.
          ws.send(JSON.stringify({
            type: "OFFER",
            matchId,
            sdp: payload.sdp ?? null,
          }));
          break;
        case "MULTIPLAYER_OFFER":
          ws.send(JSON.stringify({ type: "OFFER", matchId, sdp: payload.sdp }));
          break;
        case "MULTIPLAYER_ANSWER":
          ws.send(JSON.stringify({ type: "ANSWER", matchId, sdp: payload.sdp }));
          break;
        case "MULTIPLAYER_ICE":
          ws.send(JSON.stringify({ type: "ICE", matchId, candidate: payload.candidate }));
          break;
        case "MULTIPLAYER_LEAVE":
          ws.send(JSON.stringify({ type: "LEAVE", matchId }));
          break;
        default:
          break;
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      try {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: "LEAVE", matchId }));
        }
        ws.close();
      } catch {
        /* ignore */
      }
      wsRef.current = null;
    };
  }, [matchId, role, userId, iframeRef, wsUrl]);
}
