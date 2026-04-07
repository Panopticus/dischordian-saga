/* ═══════════════════════════════════════════════════════
   WEBSOCKET RECONNECTION WRAPPER
   Drop-in replacement for `new WebSocket()` that adds
   automatic reconnection with exponential backoff.

   Usage (minimal change to existing code):
     // Before: const ws = new WebSocket(url);
     // After:  const ws = createReconnectingSocket(url);
     //         ws.onopen = ...  // works the same
     //         ws.close()       // stops reconnection
   ═══════════════════════════════════════════════════════ */

const INITIAL_DELAY = 500;
const MAX_DELAY = 16_000;
const MAX_RETRIES = 8;
const JITTER = 0.3;

function backoffDelay(attempt: number): number {
  const base = Math.min(INITIAL_DELAY * Math.pow(2, attempt), MAX_DELAY);
  const jitter = base * JITTER * (Math.random() * 2 - 1);
  return Math.max(100, base + jitter);
}

export interface ReconnectingSocket {
  /** Current underlying WebSocket (may change on reconnect) */
  readonly ws: WebSocket | null;
  /** Send data (safe — no-ops if not connected) */
  send(data: string | ArrayBuffer): boolean;
  /** Permanently close and stop reconnecting */
  close(): void;
  /** Current connection state */
  readonly connected: boolean;
  readonly reconnecting: boolean;
  readonly retryCount: number;
  /** Callbacks */
  onopen: ((ev: Event) => void) | null;
  onmessage: ((ev: MessageEvent) => void) | null;
  onclose: ((ev: CloseEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  /** Called during reconnection attempts */
  onreconnecting: ((attempt: number, maxRetries: number) => void) | null;
  /** Called when all reconnection attempts are exhausted */
  onreconnectfailed: (() => void) | null;
}

export function createReconnectingSocket(url: string, maxRetries = MAX_RETRIES): ReconnectingSocket {
  let ws: WebSocket | null = null;
  let retryCount = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;
  let connected = false;
  let reconnecting = false;

  const socket: ReconnectingSocket = {
    get ws() { return ws; },
    get connected() { return connected; },
    get reconnecting() { return reconnecting; },
    get retryCount() { return retryCount; },
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null,
    onreconnecting: null,
    onreconnectfailed: null,

    send(data: string | ArrayBuffer): boolean {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(data);
        return true;
      }
      return false;
    },

    close() {
      intentionalClose = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close(1000, "Intentional disconnect");
      ws = null;
      connected = false;
      reconnecting = false;
    },
  };

  function connect() {
    try {
      ws = new WebSocket(url);

      ws.onopen = (ev) => {
        connected = true;
        reconnecting = false;
        retryCount = 0;
        socket.onopen?.(ev);
      };

      ws.onmessage = (ev) => {
        socket.onmessage?.(ev);
      };

      ws.onclose = (ev) => {
        connected = false;
        socket.onclose?.(ev);

        if (intentionalClose) return;
        if (retryCount >= maxRetries) {
          reconnecting = false;
          socket.onreconnectfailed?.();
          return;
        }

        reconnecting = true;
        const delay = backoffDelay(retryCount);
        retryCount++;
        socket.onreconnecting?.(retryCount, maxRetries);

        retryTimer = setTimeout(connect, delay);
      };

      ws.onerror = (ev) => {
        socket.onerror?.(ev);
        // onclose fires after onerror, which handles reconnection
      };
    } catch {
      reconnecting = true;
      const delay = backoffDelay(retryCount);
      retryCount++;
      retryTimer = setTimeout(connect, delay);
    }
  }

  connect();
  return socket;
}

/** Build a WebSocket URL from the current location */
export function wsUrl(path: string): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${path}`;
}
