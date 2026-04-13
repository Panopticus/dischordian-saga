/* ═══════════════════════════════════════════════════════
   RECONNECTING WEBSOCKET HOOK
   Exponential backoff with jitter for all game WS connections.
   Handles network blips without match forfeits.
   ═══════════════════════════════════════════════════════ */
import { useRef, useCallback, useEffect, useState } from "react";

interface UseReconnectingWsOptions {
  /** WebSocket URL (e.g., "wss://host/api/pvp") */
  url: string;
  /** Called when a message is received */
  onMessage: (data: unknown) => void;
  /** Called when connection opens */
  onOpen?: () => void;
  /** Called when connection closes */
  onClose?: (code: number, reason: string) => void;
  /** Max reconnection attempts before giving up */
  maxRetries?: number;
  /** Whether the connection should be active */
  enabled?: boolean;
}

interface ReconnectingWsState {
  connected: boolean;
  reconnecting: boolean;
  retryCount: number;
}

const INITIAL_DELAY_MS = 500;
const MAX_DELAY_MS = 16_000;
const JITTER_FACTOR = 0.3;

function backoffDelay(attempt: number): number {
  const base = Math.min(INITIAL_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
  const jitter = base * JITTER_FACTOR * (Math.random() * 2 - 1);
  return Math.max(100, base + jitter);
}

export function useReconnectingWs({
  url,
  onMessage,
  onOpen,
  onClose,
  maxRetries = 8,
  enabled = true,
}: UseReconnectingWsOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalCloseRef = useRef(false);
  const [state, setState] = useState<ReconnectingWsState>({
    connected: false, reconnecting: false, retryCount: 0,
  });

  const connect = useCallback(() => {
    if (!enabled) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retryCountRef.current = 0;
        setState({ connected: true, reconnecting: false, retryCount: 0 });
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch { /* ignore parse errors */ }
      };

      ws.onclose = (event) => {
        setState(s => ({ ...s, connected: false }));
        onClose?.(event.code, event.reason);

        // Don't reconnect if intentionally closed or max retries exceeded
        if (intentionalCloseRef.current) return;
        if (retryCountRef.current >= maxRetries) {
          setState(s => ({ ...s, reconnecting: false }));
          return;
        }

        // Schedule reconnection with exponential backoff
        const delay = backoffDelay(retryCountRef.current);
        retryCountRef.current++;
        setState(s => ({ ...s, reconnecting: true, retryCount: retryCountRef.current }));

        retryTimerRef.current = setTimeout(() => {
          connect();
        }, delay);
      };

      ws.onerror = () => {
        // onclose will fire after onerror, which handles reconnection
      };
    } catch {
      // Connection failed — schedule retry
      const delay = backoffDelay(retryCountRef.current);
      retryCountRef.current++;
      retryTimerRef.current = setTimeout(connect, delay);
    }
  }, [url, enabled, onMessage, onOpen, onClose, maxRetries]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    wsRef.current?.close(1000, "Intentional disconnect");
    wsRef.current = null;
    setState({ connected: false, reconnecting: false, retryCount: 0 });
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    intentionalCloseRef.current = false;
    if (enabled) connect();
    return () => {
      intentionalCloseRef.current = true;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      wsRef.current?.close(1000, "Component unmount");
    };
  }, [url, enabled, connect]);

  return { send, disconnect, ...state };
}
