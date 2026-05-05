/**
 * CADES Multiplayer Signaling WebSocket.
 *
 * Stateless relay between two peers in a CADES PvP match. The server
 * does not interpret SDP / ICE payloads — it just forwards them
 * between the two registered peers in a `match_id` room.
 *
 * Protocol (every message JSON-encoded):
 *
 *   Client → Server:
 *     { type: "JOIN_ROOM", matchId, role: "host" | "joiner", userId }
 *     { type: "OFFER", matchId, sdp }
 *     { type: "ANSWER", matchId, sdp }
 *     { type: "ICE", matchId, candidate }
 *     { type: "LEAVE", matchId }
 *
 *   Server → Client:
 *     { type: "PEER_READY", matchId }            // both peers present
 *     { type: "OFFER", sdp }                     // forwarded
 *     { type: "ANSWER", sdp }                    // forwarded
 *     { type: "ICE", candidate }                 // forwarded
 *     { type: "PEER_LEFT" }                      // partner disconnected
 *     { type: "ERROR", reason }
 *
 * The matched-peer roster is keyed on the `matchId` issued by
 * `cadesPvp.proposeMatch` — no separate matchmaking lives here.
 *
 * This is the foundation. Real-time entity sync uses Godot's
 * MultiplayerSpawner / MultiplayerSynchronizer once the WebRTC
 * peer-connection is wired up on both sides; this module only
 * brokers the handshake.
 */
import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "http";
import { z } from "zod";
import { logger } from "./logger";

interface PeerSocket {
  ws: WebSocket;
  userId: number;
  role: "host" | "joiner";
}

interface SignalingRoom {
  matchId: string;
  host?: PeerSocket;
  joiner?: PeerSocket;
}

const rooms = new Map<string, SignalingRoom>();
const sockToMatch = new WeakMap<WebSocket, string>();

const JoinSchema = z.object({
  type: z.literal("JOIN_ROOM"),
  matchId: z.string().min(1).max(96),
  role: z.enum(["host", "joiner"]),
  userId: z.number().int(),
});
const RelaySchema = z.object({
  type: z.enum(["OFFER", "ANSWER", "ICE"]),
  matchId: z.string().min(1).max(96),
  sdp: z.unknown().optional(),
  candidate: z.unknown().optional(),
});
const LeaveSchema = z.object({
  type: z.literal("LEAVE"),
  matchId: z.string().min(1).max(96),
});

function send(ws: WebSocket, msg: Record<string, unknown>): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function partnerOf(room: SignalingRoom, ws: WebSocket): PeerSocket | undefined {
  if (room.host?.ws === ws) return room.joiner;
  if (room.joiner?.ws === ws) return room.host;
  return undefined;
}

function maybeNotifyReady(room: SignalingRoom): void {
  if (room.host && room.joiner) {
    send(room.host.ws, { type: "PEER_READY", matchId: room.matchId });
    send(room.joiner.ws, { type: "PEER_READY", matchId: room.matchId });
  }
}

function dropFromRoom(ws: WebSocket): void {
  const matchId = sockToMatch.get(ws);
  if (!matchId) return;
  const room = rooms.get(matchId);
  if (!room) return;
  const partner = partnerOf(room, ws);
  if (room.host?.ws === ws) room.host = undefined;
  if (room.joiner?.ws === ws) room.joiner = undefined;
  if (partner) send(partner.ws, { type: "PEER_LEFT" });
  if (!room.host && !room.joiner) {
    rooms.delete(matchId);
  }
  sockToMatch.delete(ws);
}

/** Auth resolver for the signaling server. Default uses the session
 *  cookie via `_core/wsAuth`. Tests inject a stub via the optional
 *  `authResolver` parameter on `setupCadesSignalingWebSocket`. */
type SignalingAuthResolver = (req: import("http").IncomingMessage) => Promise<number | null>;

const defaultAuthResolver: SignalingAuthResolver = async (req) => {
  const { authenticateWebSocket } = await import("./_core/wsAuth");
  const u = await authenticateWebSocket(req);
  return u?.id ?? null;
};

export function setupCadesSignalingWebSocket(
  server: Server,
  authResolver: SignalingAuthResolver = defaultAuthResolver,
): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    if (!request.url) return;
    if (!request.url.startsWith("/ws/cades-signaling")) return;
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws, req) => {
    // Authenticate the WS upgrade. Cades signaling is identity-bound:
    // the userId tells us which side of the call this peer is on. We
    // bind to the verified session userId and ignore client claims.
    let authedUserId: number | null = null;
    let authResolved = false;
    void (async () => {
      try {
        authedUserId = await authResolver(req);
      } catch {
        authedUserId = null;
      } finally {
        authResolved = true;
      }
    })();

    ws.on("message", (raw) => {
      // Best-effort: messages received before auth resolves are
      // dropped. The first message from a client is usually JOIN_ROOM
      // and arrives well after the upgrade has settled.
      if (!authResolved) {
        send(ws, { type: "ERROR", reason: "auth_pending" });
        return;
      }
      if (authedUserId === null) {
        send(ws, { type: "ERROR", reason: "unauthorized" });
        ws.close(4401, "unauthorized");
        return;
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        send(ws, { type: "ERROR", reason: "invalid_json" });
        return;
      }
      if (typeof parsed !== "object" || parsed === null) return;
      const msg = parsed as Record<string, unknown>;

      if (msg.type === "JOIN_ROOM") {
        const j = JoinSchema.safeParse(msg);
        if (!j.success) {
          send(ws, { type: "ERROR", reason: "bad_join" });
          return;
        }
        // Reject mismatched userIds — historically trusted client claim.
        if (j.data.userId !== authedUserId) {
          send(ws, { type: "ERROR", reason: "identity_mismatch" });
          ws.close(4403, "forbidden");
          return;
        }
        let room = rooms.get(j.data.matchId);
        if (!room) {
          room = { matchId: j.data.matchId };
          rooms.set(j.data.matchId, room);
        }
        // Reject if a peer with that role already occupies the slot.
        if (j.data.role === "host" && room.host) {
          send(ws, { type: "ERROR", reason: "host_slot_taken" });
          return;
        }
        if (j.data.role === "joiner" && room.joiner) {
          send(ws, { type: "ERROR", reason: "joiner_slot_taken" });
          return;
        }
        const peer: PeerSocket = { ws, userId: j.data.userId, role: j.data.role };
        if (j.data.role === "host") room.host = peer;
        else room.joiner = peer;
        sockToMatch.set(ws, j.data.matchId);
        logger.info("cades_signaling_join", "cadesSignaling", {
          matchId: j.data.matchId,
          role: j.data.role,
          userId: j.data.userId,
        });
        maybeNotifyReady(room);
        return;
      }

      if (msg.type === "OFFER" || msg.type === "ANSWER" || msg.type === "ICE") {
        const r = RelaySchema.safeParse(msg);
        if (!r.success) {
          send(ws, { type: "ERROR", reason: "bad_relay" });
          return;
        }
        const room = rooms.get(r.data.matchId);
        if (!room) {
          send(ws, { type: "ERROR", reason: "unknown_room" });
          return;
        }
        const partner = partnerOf(room, ws);
        if (!partner) {
          send(ws, { type: "ERROR", reason: "no_partner" });
          return;
        }
        send(partner.ws, {
          type: r.data.type,
          ...(r.data.sdp !== undefined ? { sdp: r.data.sdp } : {}),
          ...(r.data.candidate !== undefined ? { candidate: r.data.candidate } : {}),
        });
        return;
      }

      if (msg.type === "LEAVE") {
        const l = LeaveSchema.safeParse(msg);
        if (l.success) dropFromRoom(ws);
        return;
      }

      send(ws, { type: "ERROR", reason: "unknown_message_type" });
    });

    ws.on("close", () => {
      dropFromRoom(ws);
    });

    ws.on("error", (err) => {
      logger.warn("cades_signaling_socket_error", "cadesSignaling", {
        error: String(err),
      });
      dropFromRoom(ws);
    });
  });

  return wss;
}

/** Diagnostic snapshot for the admin dashboard. */
export function getSignalingStatus(): {
  rooms: number;
  pendingPairs: number;
  pairedRooms: number;
} {
  let pending = 0;
  let paired = 0;
  for (const room of rooms.values()) {
    if (room.host && room.joiner) paired++;
    else pending++;
  }
  return { rooms: rooms.size, pendingPairs: pending, pairedRooms: paired };
}
