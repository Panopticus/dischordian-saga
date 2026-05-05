/**
 * cadesSignalingWs smoke tests.
 *
 * The signaling server is a stateless message relay. We exercise the
 * room-pairing logic + relay routing via an in-process WS server +
 * two `ws` clients. No DB / no http listener — just the WS upgrade
 * path.
 */
import { describe, it, expect, afterEach } from "vitest";
import { createServer, type Server } from "node:http";
import { WebSocket } from "ws";
import { setupCadesSignalingWebSocket, getSignalingStatus } from "./cadesSignalingWs";

interface Harness {
  server: Server;
  port: number;
  cleanup: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const server = createServer();
  // Tests bypass the session-cookie auth by reading a synthetic
  // `x-test-user-id` header set on the WS handshake. Production code
  // path uses `authenticateWebSocket` via the default resolver.
  setupCadesSignalingWebSocket(server, async (req) => {
    const raw = req.headers["x-test-user-id"];
    const id = typeof raw === "string" ? Number(raw) : NaN;
    return Number.isFinite(id) ? id : null;
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  if (typeof addr !== "object" || !addr) throw new Error("no address");
  return {
    server,
    port: addr.port,
    cleanup: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

function openClient(port: number, userId: number): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws/cades-signaling`, {
      headers: { "x-test-user-id": String(userId) },
    });
    ws.once("open", () => resolve(ws));
    ws.once("error", reject);
  });
}

function nextMessage(ws: WebSocket, timeoutMs = 1000): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.removeListener("message", onMsg);
      reject(new Error("timeout waiting for ws message"));
    }, timeoutMs);
    const onMsg = (raw: WebSocket.RawData) => {
      clearTimeout(timer);
      ws.removeListener("message", onMsg);
      try {
        resolve(JSON.parse(raw.toString()));
      } catch (e) {
        reject(e);
      }
    };
    ws.on("message", onMsg);
  });
}

describe("cadesSignalingWs", () => {
  let harness: Harness | null = null;
  afterEach(async () => {
    if (harness) await harness.cleanup();
    harness = null;
  });

  it("pairs two peers in the same room and notifies both with PEER_READY", async () => {
    harness = await startHarness();
    const host = await openClient(harness.port, 100);
    const joiner = await openClient(harness.port, 200);

    host.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m1", role: "host", userId: 100 }));
    joiner.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m1", role: "joiner", userId: 200 }));

    const hostReady = await nextMessage(host);
    const joinerReady = await nextMessage(joiner);
    expect(hostReady.type).toBe("PEER_READY");
    expect(joinerReady.type).toBe("PEER_READY");
    expect(hostReady.matchId).toBe("m1");

    host.close();
    joiner.close();
  });

  it("relays OFFER from host to joiner only", async () => {
    harness = await startHarness();
    const host = await openClient(harness.port, 1);
    const joiner = await openClient(harness.port, 2);
    host.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m2", role: "host", userId: 1 }));
    joiner.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m2", role: "joiner", userId: 2 }));
    await nextMessage(host); // PEER_READY
    await nextMessage(joiner);

    host.send(JSON.stringify({ type: "OFFER", matchId: "m2", sdp: "test-sdp" }));
    const received = await nextMessage(joiner);
    expect(received.type).toBe("OFFER");
    expect(received.sdp).toBe("test-sdp");

    host.close();
    joiner.close();
  });

  it("rejects a second peer claiming an already-occupied role", async () => {
    harness = await startHarness();
    const a = await openClient(harness.port, 1);
    const b = await openClient(harness.port, 2);
    a.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m3", role: "host", userId: 1 }));
    b.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m3", role: "host", userId: 2 }));
    const err = await nextMessage(b);
    expect(err.type).toBe("ERROR");
    expect(err.reason).toBe("host_slot_taken");
    a.close();
    b.close();
  });

  it("notifies remaining peer with PEER_LEFT on partner disconnect", async () => {
    harness = await startHarness();
    const host = await openClient(harness.port, 1);
    const joiner = await openClient(harness.port, 2);
    host.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m4", role: "host", userId: 1 }));
    joiner.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m4", role: "joiner", userId: 2 }));
    await nextMessage(host);
    await nextMessage(joiner);

    joiner.close();
    const left = await nextMessage(host, 2000);
    expect(left.type).toBe("PEER_LEFT");
    host.close();
  });

  it("returns ERROR for a relay message with no partner", async () => {
    harness = await startHarness();
    const lone = await openClient(harness.port, 1);
    lone.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m5", role: "host", userId: 1 }));
    lone.send(JSON.stringify({ type: "OFFER", matchId: "m5", sdp: "x" }));
    const err = await nextMessage(lone);
    expect(err.type).toBe("ERROR");
    expect(err.reason).toBe("no_partner");
    lone.close();
  });

  it("rejects malformed JSON", async () => {
    harness = await startHarness();
    const ws = await openClient(harness.port, 99);
    ws.send("{not json");
    const err = await nextMessage(ws);
    expect(err.type).toBe("ERROR");
    expect(err.reason).toBe("invalid_json");
    ws.close();
  });

  it("rejects JOIN_ROOM with userId mismatching the authed identity", async () => {
    harness = await startHarness();
    const ws = await openClient(harness.port, 1);
    // Authed as 1, claims to be 999 — must be rejected.
    ws.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m7", role: "host", userId: 999 }));
    const err = await nextMessage(ws);
    expect(err.type).toBe("ERROR");
    expect(err.reason).toBe("identity_mismatch");
  });

  it("rejects unauthenticated connections at first message", async () => {
    harness = await startHarness();
    // openClient with NaN user → resolver returns null → connection
    // is unauthorized.
    const ws = await new Promise<WebSocket>((resolve, reject) => {
      const w = new WebSocket(`ws://127.0.0.1:${harness!.port}/ws/cades-signaling`);
      w.once("open", () => resolve(w));
      w.once("error", reject);
    });
    ws.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m8", role: "host", userId: 1 }));
    const err = await nextMessage(ws);
    expect(err.type).toBe("ERROR");
    expect(err.reason).toBe("unauthorized");
  });

  it("getSignalingStatus reports rooms + paired/pending counts", async () => {
    harness = await startHarness();
    const a = await openClient(harness.port, 1);
    a.send(JSON.stringify({ type: "JOIN_ROOM", matchId: "m6", role: "host", userId: 1 }));
    // Wait a tick so the server processes the JOIN.
    await new Promise((r) => setTimeout(r, 50));
    const before = getSignalingStatus();
    expect(before.rooms).toBeGreaterThanOrEqual(1);
    expect(before.pendingPairs).toBeGreaterThanOrEqual(1);
    a.close();
  });
});
