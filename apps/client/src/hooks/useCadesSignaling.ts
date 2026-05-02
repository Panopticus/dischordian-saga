/**
 * useCadesSignaling — bridge between the CADES Godot iframe and the
 * server's `/ws/cades-signaling` WebSocket, owning the JS-side
 * RTCPeerConnection lifecycle.
 *
 * Lifecycle:
 *   1. Hook mounts when a PvP match is active and an iframe ref is
 *      available. Opens the WebSocket and joins the room.
 *   2. Creates an `RTCPeerConnection` with the configured ICE
 *      servers. Hosts open a "godot" data channel; joiners receive
 *      the channel via `ondatachannel`.
 *   3. On `PEER_READY`, the host runs createOffer →
 *      setLocalDescription → sends OFFER. The joiner runs
 *      setRemoteDescription → createAnswer → sends ANSWER.
 *   4. ICE candidates trickle in both directions via ICE messages.
 *   5. When the data channel opens, exposes `window._mpPc` and
 *      `window._mpDataChannel` for the Godot MultiplayerBridge to
 *      poll. Posts `MULTIPLAYER_CONNECTED` to the iframe.
 *   6. Forwards `MULTIPLAYER_*` PostMessages from the iframe via the
 *      data channel (peer-to-peer, no signaling round-trip) when
 *      it's open; falls back to WS relay during signaling.
 *   7. On unmount, closes both the data channel and the peer
 *      connection cleanly.
 */
import { useEffect, useRef } from "react";

type SignalingProps = {
  matchId: string | null;
  role: "host" | "joiner";
  userId: number | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** Optional override; defaults to the page origin. */
  wsUrl?: string;
  /** Optional override; defaults to public Google STUN. Pass TURN
   *  configuration for production deploys via env. */
  iceServers?: RTCIceServer[];
};

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
];

/** Resolve TURN servers from a vite-time env var. The format mirrors
 *  the cloud-provider convention:
 *
 *    VITE_TURN_SERVERS="turn:turn.example.com:3478:user:pass,turn:turn2:3478:user:pass"
 *
 *  Empty / unset → fall back to plain STUN. The wrapping function is
 *  pure so tests can override.
 */
function loadIceServersFromEnv(): RTCIceServer[] {
  const raw = (import.meta as unknown as { env?: { VITE_TURN_SERVERS?: string } }).env?.VITE_TURN_SERVERS;
  if (!raw) return DEFAULT_ICE_SERVERS;
  const parsed: RTCIceServer[] = [];
  for (const piece of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    const tokens = piece.split(":");
    if (tokens.length < 3) continue;
    // The first 3 tokens are scheme + host + port (turn:host:3478),
    // the remaining 2 are username + credential.
    const url = `${tokens[0]}:${tokens[1]}:${tokens[2]}`;
    const username = tokens[3];
    const credential = tokens[4];
    parsed.push({ urls: url, username, credential });
  }
  // Always include STUN as a fallback for symmetric NATs that fail TURN.
  return parsed.length ? [...DEFAULT_ICE_SERVERS, ...parsed] : DEFAULT_ICE_SERVERS;
}

export function useCadesSignaling({
  matchId,
  role,
  userId,
  iframeRef,
  wsUrl,
  iceServers,
}: SignalingProps): void {
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);

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

    // Initialise the RTCPeerConnection. Host creates the data
    // channel up front; joiner receives it via `ondatachannel`.
    const pc = new RTCPeerConnection({
      iceServers: iceServers ?? loadIceServersFromEnv(),
    });
    pcRef.current = pc;
    (window as unknown as { _mpPc?: RTCPeerConnection })._mpPc = pc;

    const sendWs = (msg: Record<string, unknown>) => {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
    };

    const forwardToIframe = (type: string, payload: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage({ type, payload }, "*");
    };

    const wireDataChannel = (dc: RTCDataChannel) => {
      dcRef.current = dc;
      (window as unknown as { _mpDataChannel?: RTCDataChannel })._mpDataChannel = dc;
      dc.binaryType = "arraybuffer";
      dc.onopen = () => {
        forwardToIframe("MULTIPLAYER_CONNECTED", { matchId, role });
      };
      dc.onclose = () => {
        forwardToIframe("MULTIPLAYER_PEER_LEFT", {});
        dcRef.current = null;
      };
      dc.onmessage = (ev) => {
        // Game-traffic messages from the peer. Forward straight to
        // the iframe so the Godot side can apply them. Game-traffic
        // protocol is owned by the Godot multiplayer layer; we just
        // tunnel bytes.
        forwardToIframe("MULTIPLAYER_DATA", { data: ev.data });
      };
    };

    if (role === "host") {
      const dc = pc.createDataChannel("godot", { ordered: true });
      wireDataChannel(dc);
    } else {
      pc.ondatachannel = (ev) => wireDataChannel(ev.channel);
    }

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        sendWs({ type: "ICE", matchId, candidate: ev.candidate.toJSON() });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        forwardToIframe("MULTIPLAYER_ERROR", {
          reason: `connection_${pc.connectionState}`,
        });
      }
    };

    ws.addEventListener("open", () => {
      sendWs({ type: "JOIN_ROOM", matchId, role, userId });
    });

    ws.addEventListener("message", async (e) => {
      let msg: unknown;
      try {
        msg = JSON.parse(typeof e.data === "string" ? e.data : "");
      } catch {
        return;
      }
      if (typeof msg !== "object" || msg === null) return;
      const m = msg as Record<string, unknown>;
      const t = String(m.type ?? "");

      switch (t) {
        case "PEER_READY":
          forwardToIframe("MULTIPLAYER_PEER_READY", m);
          // Host kicks off the SDP exchange.
          if (role === "host") {
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              sendWs({ type: "OFFER", matchId, sdp: offer });
            } catch (err) {
              forwardToIframe("MULTIPLAYER_ERROR", { reason: `offer_failed_${String(err)}` });
            }
          }
          break;
        case "OFFER":
          if (role === "joiner") {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(m.sdp as RTCSessionDescriptionInit));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendWs({ type: "ANSWER", matchId, sdp: answer });
            } catch (err) {
              forwardToIframe("MULTIPLAYER_ERROR", { reason: `answer_failed_${String(err)}` });
            }
          }
          break;
        case "ANSWER":
          if (role === "host") {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(m.sdp as RTCSessionDescriptionInit));
            } catch (err) {
              forwardToIframe("MULTIPLAYER_ERROR", { reason: `set_remote_failed_${String(err)}` });
            }
          }
          break;
        case "ICE":
          try {
            await pc.addIceCandidate(new RTCIceCandidate(m.candidate as RTCIceCandidateInit));
          } catch (err) {
            // Tolerated — late candidates after closed are expected.
          }
          break;
        case "PEER_LEFT":
          forwardToIframe("MULTIPLAYER_PEER_LEFT", {});
          break;
        case "ERROR":
          forwardToIframe("MULTIPLAYER_ERROR", m);
          break;
      }
    });

    // Forward iframe → peer (data channel) or → server (signaling).
    const onMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data.type !== "string") return;
      const t = e.data.type as string;
      if (!t.startsWith("MULTIPLAYER_")) return;
      const payload = (e.data.payload ?? {}) as Record<string, unknown>;
      switch (t) {
        case "MULTIPLAYER_HOST":
        case "MULTIPLAYER_JOIN":
          // Godot bridge already issues JOIN_ROOM via WS through us.
          // No-op (the join is implicit at hook mount).
          break;
        case "MULTIPLAYER_LEAVE":
          if (ws.readyState === ws.OPEN) {
            sendWs({ type: "LEAVE", matchId });
          }
          break;
        case "MULTIPLAYER_GAME_DATA":
          // Game-traffic message from Godot — push over the data
          // channel if open; else drop (the peer will resync).
          if (dcRef.current && dcRef.current.readyState === "open") {
            const data = payload.data;
            if (typeof data === "string") {
              dcRef.current.send(data);
            } else if (data instanceof ArrayBuffer) {
              dcRef.current.send(data);
            }
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      try {
        if (dcRef.current) dcRef.current.close();
      } catch { /* ignore */ }
      try {
        if (pc) pc.close();
      } catch { /* ignore */ }
      try {
        if (ws.readyState === ws.OPEN) sendWs({ type: "LEAVE", matchId });
        ws.close();
      } catch { /* ignore */ }
      const w = window as unknown as { _mpPc?: RTCPeerConnection; _mpDataChannel?: RTCDataChannel };
      delete w._mpPc;
      delete w._mpDataChannel;
      pcRef.current = null;
      dcRef.current = null;
      wsRef.current = null;
    };
  }, [matchId, role, userId, iframeRef, wsUrl, iceServers]);
}

export { loadIceServersFromEnv };
