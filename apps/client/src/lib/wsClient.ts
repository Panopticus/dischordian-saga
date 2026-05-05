/**
 * Resilient WebSocket client.
 *
 * Centralises:
 *   - Connection / reconnection with exponential backoff (1s → 30s).
 *   - Ping / pong heartbeat (default 30s).
 *   - Outbound message queue for replay after reconnect.
 *   - Auth-aware: server closes 4401 on unauth — we don't reconnect.
 *
 * Usage:
 *
 *   const client = createWsClient({
 *     url: "/api/pvp",
 *     onMessage: (msg) => { ... },
 *     onStateChange: (state) => { ... },
 *   });
 *   client.send({ type: "JOIN_QUEUE", deck });
 *   client.close();
 */

export type WsState = "connecting" | "open" | "reconnecting" | "closed" | "unauthorized";

export interface WsClientOptions {
  /** Absolute URL or path; relative paths resolve to current origin. */
  url: string;
  /** Server messages — already JSON-parsed. */
  onMessage: (msg: unknown) => void;
  /** Lifecycle observer — called whenever state transitions. */
  onStateChange?: (state: WsState) => void;
  /** Send a ping every N ms. 0 disables. Default 30000. */
  heartbeatIntervalMs?: number;
  /** Initial backoff. Default 1000ms. */
  initialBackoffMs?: number;
  /** Max backoff. Default 30000ms. */
  maxBackoffMs?: number;
  /** Custom ping payload — defaults to `{ type: "PING" }`. */
  pingMessage?: unknown;
  /** Predicate to recognise a pong from the server. Defaults to
   *  `msg.type === "PONG"`. */
  isPong?: (msg: unknown) => boolean;
}

export interface WsClient {
  send: (msg: unknown) => void;
  close: () => void;
  getState: () => WsState;
}

const DEFAULT_HEARTBEAT_MS = 30_000;
const DEFAULT_INITIAL_BACKOFF_MS = 1_000;
const DEFAULT_MAX_BACKOFF_MS = 30_000;

function defaultIsPong(msg: unknown): boolean {
  return typeof msg === "object" && msg !== null && (msg as { type?: unknown }).type === "PONG";
}

export function createWsClient(opts: WsClientOptions): WsClient {
  const {
    url,
    onMessage,
    onStateChange,
    heartbeatIntervalMs = DEFAULT_HEARTBEAT_MS,
    initialBackoffMs = DEFAULT_INITIAL_BACKOFF_MS,
    maxBackoffMs = DEFAULT_MAX_BACKOFF_MS,
    pingMessage = { type: "PING" },
    isPong = defaultIsPong,
  } = opts;

  let socket: WebSocket | null = null;
  let state: WsState = "connecting";
  let closedByCaller = false;
  let backoffMs = initialBackoffMs;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  const outbox: unknown[] = [];

  function setState(next: WsState) {
    if (state === next) return;
    state = next;
    onStateChange?.(next);
  }

  function resolveUrl(): string {
    if (url.startsWith("ws://") || url.startsWith("wss://")) return url;
    if (typeof window === "undefined") return url;
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${proto}//${window.location.host}${path}`;
  }

  function flushOutbox() {
    while (socket && socket.readyState === WebSocket.OPEN && outbox.length > 0) {
      socket.send(JSON.stringify(outbox.shift()));
    }
  }

  function startHeartbeat() {
    if (!heartbeatIntervalMs) return;
    stopHeartbeat();
    heartbeatTimer = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(pingMessage));
      }
    }, heartbeatIntervalMs);
  }

  function stopHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  function scheduleReconnect() {
    if (closedByCaller) return;
    setState("reconnecting");
    reconnectTimer = setTimeout(() => {
      backoffMs = Math.min(backoffMs * 2, maxBackoffMs);
      connect();
    }, backoffMs);
  }

  function connect() {
    if (closedByCaller) return;
    setState("connecting");
    try {
      socket = new WebSocket(resolveUrl());
    } catch {
      scheduleReconnect();
      return;
    }

    socket.onopen = () => {
      // Reset backoff on successful connect.
      backoffMs = initialBackoffMs;
      setState("open");
      flushOutbox();
      startHeartbeat();
    };

    socket.onmessage = (ev) => {
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(ev.data as string);
      } catch {
        return;
      }
      // Pongs are absorbed silently — just confirm the connection is alive.
      if (isPong(parsed)) return;
      onMessage(parsed);
    };

    socket.onerror = () => {
      // onclose fires next; do reconnect logic there.
    };

    socket.onclose = (ev) => {
      stopHeartbeat();
      socket = null;
      // 4401 = our convention for "unauthorized". Don't reconnect —
      // the user needs to re-login. The page-level UI surfaces this.
      if (ev.code === 4401) {
        setState("unauthorized");
        return;
      }
      // 4403 = identity mismatch, also a hard fail.
      if (ev.code === 4403) {
        setState("unauthorized");
        return;
      }
      if (closedByCaller) {
        setState("closed");
        return;
      }
      scheduleReconnect();
    };
  }

  function send(msg: unknown) {
    if (state === "unauthorized" || closedByCaller) return;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      // Queue for replay once we reconnect.
      outbox.push(msg);
    }
  }

  function close() {
    closedByCaller = true;
    stopHeartbeat();
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (socket) {
      try {
        socket.close(1000, "client closing");
      } catch { /* ignore */ }
      socket = null;
    }
    setState("closed");
  }

  // Pause sending when the tab is hidden — saves battery and avoids
  // backlog when the browser throttles timers in background.
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && state === "reconnecting" && reconnectTimer) {
        // User came back; reconnect immediately rather than waiting
        // for the backoff timer.
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
        backoffMs = initialBackoffMs;
        connect();
      }
    });
  }

  connect();

  return {
    send,
    close,
    getState: () => state,
  };
}
