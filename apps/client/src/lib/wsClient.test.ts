/**
 * wsClient unit tests — exercise the auth-close, reconnection,
 * outbox replay, and heartbeat behaviour with a mock WebSocket.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createWsClient } from "./wsClient";

class MockSocket {
  readyState = 0; // CONNECTING
  static instances: MockSocket[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: ((ev: { code: number }) => void) | null = null;
  sent: string[] = [];
  constructor(url: string) {
    this.url = url;
    MockSocket.instances.push(this);
  }
  send(data: string) {
    this.sent.push(data);
  }
  close(code: number) {
    this.readyState = 3; // CLOSED
    this.onclose?.({ code });
  }
  // Test-only helpers:
  open() {
    this.readyState = 1; // OPEN
    this.onopen?.();
  }
  receive(msg: unknown) {
    this.onmessage?.({ data: JSON.stringify(msg) });
  }
  remoteClose(code: number) {
    this.readyState = 3;
    this.onclose?.({ code });
  }
}

const OPEN = 1;

describe("createWsClient", () => {
  const original = globalThis.WebSocket;

  afterEach(() => {
    globalThis.WebSocket = original;
    MockSocket.instances.length = 0;
  });

  function installMock() {
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = Object.assign(MockSocket, { OPEN });
  }

  it("flushes queued messages once connected", () => {
    installMock();
    const client = createWsClient({
      url: "ws://x/y",
      onMessage: () => {},
      heartbeatIntervalMs: 0,
    });
    // Send before open — should be queued.
    client.send({ hello: "world" });
    const sock = MockSocket.instances[0];
    expect(sock.sent).toEqual([]);
    sock.open();
    expect(sock.sent.length).toBe(1);
    expect(JSON.parse(sock.sent[0])).toEqual({ hello: "world" });
    client.close();
  });

  it("does not reconnect on close code 4401 (unauthorized)", async () => {
    installMock();
    const states: string[] = [];
    createWsClient({
      url: "ws://x/y",
      onMessage: () => {},
      onStateChange: (s) => states.push(s),
      heartbeatIntervalMs: 0,
    });
    const sock = MockSocket.instances[0];
    sock.open();
    sock.remoteClose(4401);
    // No new connection should be attempted.
    expect(MockSocket.instances.length).toBe(1);
    expect(states).toContain("unauthorized");
  });

  it("does not reconnect on close code 4403 (identity mismatch)", () => {
    installMock();
    const states: string[] = [];
    createWsClient({
      url: "ws://x/y",
      onMessage: () => {},
      onStateChange: (s) => states.push(s),
      heartbeatIntervalMs: 0,
    });
    const sock = MockSocket.instances[0];
    sock.open();
    sock.remoteClose(4403);
    expect(MockSocket.instances.length).toBe(1);
    expect(states).toContain("unauthorized");
  });

  it("absorbs PONG silently without delivering to onMessage", () => {
    installMock();
    const onMessage = vi.fn();
    createWsClient({
      url: "ws://x/y",
      onMessage,
      heartbeatIntervalMs: 0,
    });
    const sock = MockSocket.instances[0];
    sock.open();
    sock.receive({ type: "PONG" });
    expect(onMessage).not.toHaveBeenCalled();
    sock.receive({ type: "GAME_UPDATE" });
    expect(onMessage).toHaveBeenCalledWith({ type: "GAME_UPDATE" });
  });
});
