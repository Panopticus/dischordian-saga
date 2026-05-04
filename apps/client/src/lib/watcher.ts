/* ═══════════════════════════════════════════════════════
   WATCHER CLIENT HELPER

   `observe(event)` records an observation locally and queues it
   for batched sync to the server. Callers anywhere in the app can
   import and fire these without thinking about persistence.

   Batching: events accumulate in memory + a localStorage mirror.
   They flush on (a) every 30s, (b) page visibility change, and
   (c) explicit `flushNow()` call. Failures are silent — the
   Watcher must never break the player's session.

   Privacy: see docs/built/WATCHER_DESIGN.md. The kinds enumerated
   in `apps/shared/watcher/observationLog.ts` are the only data
   ever sent.
   ═══════════════════════════════════════════════════════ */

import {
  appendObservation,
  emptyLog,
  parseLog,
  type WatcherLog,
  type WatcherObservation,
} from "@shared/watcher/observationLog";
import { trpc } from "@/lib/trpc";

const PENDING_KEY = "loredex_watcher_pending";
const LOG_MIRROR_KEY = "loredex_watcher_log_mirror";
const FLUSH_INTERVAL_MS = 30_000;

interface PendingState {
  events: WatcherObservation[];
}

function readPending(): PendingState {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return { events: [] };
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.events)) {
      // Defensive: drop obviously bad shapes.
      return { events: parsed.events.filter((e: unknown) => e && typeof e === "object") };
    }
    return { events: [] };
  } catch {
    return { events: [] };
  }
}

function writePending(state: PendingState): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(state));
  } catch {
    /* storage blocked — Watcher degrades to in-session only */
  }
}

function readMirror(): WatcherLog {
  try {
    const raw = localStorage.getItem(LOG_MIRROR_KEY);
    if (!raw) return emptyLog();
    return parseLog(JSON.parse(raw));
  } catch {
    return emptyLog();
  }
}

function writeMirror(log: WatcherLog): void {
  try {
    localStorage.setItem(LOG_MIRROR_KEY, JSON.stringify(log));
  } catch {
    /* same fallback as above */
  }
}

let flushTimer: ReturnType<typeof setInterval> | null = null;
let flushing = false;

/**
 * Record an observation. Updates the local mirror + pending queue
 * synchronously; the actual server write is batched.
 */
export function observe(event: WatcherObservation): void {
  // Update local mirror so triggers can read it without a round trip.
  const mirror = readMirror();
  writeMirror(appendObservation(mirror, event));
  // Queue for server.
  const pending = readPending();
  pending.events.push(event);
  writePending(pending);
}

/** Read the current local mirror (best-effort). Server is canonical;
 *  this is "what we know right now" for client-side trigger eval. */
export function readLog(): WatcherLog {
  return readMirror();
}

/**
 * Flush queued observations to the server. No-op if nothing pending,
 * or if a flush is already in flight, or if no client is provided.
 */
export async function flushNow(client: ReturnType<typeof trpc.useUtils>): Promise<void> {
  if (flushing) return;
  const pending = readPending();
  if (pending.events.length === 0) return;
  flushing = true;
  try {
    await client.client.watcher.observe.mutate({ events: pending.events });
    writePending({ events: [] });
  } catch {
    // Leave the queue intact — next flush retries. Bounded growth via
    // appendObservation's MAX_LOG_ENTRIES on the server side.
  } finally {
    flushing = false;
  }
}

/**
 * Wire periodic flush + visibility-change flush. Idempotent: calling
 * twice is safe. Returns a teardown function.
 */
export function startFlushDaemon(client: ReturnType<typeof trpc.useUtils>): () => void {
  if (flushTimer !== null) {
    // Already running. Caller must call the returned teardown of the
    // first start to fully stop.
    return () => { /* no-op, daemon owned by earlier caller */ };
  }
  flushTimer = setInterval(() => {
    void flushNow(client);
  }, FLUSH_INTERVAL_MS);

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      void flushNow(client);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    if (flushTimer !== null) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** Hydrate the local mirror from the server. Called once on mount;
 *  ensures triggers see persisted history from prior sessions. */
export async function hydrateFromServer(client: ReturnType<typeof trpc.useUtils>): Promise<void> {
  try {
    const log = await client.client.watcher.getLog.query();
    writeMirror(log);
  } catch {
    /* keep whatever the local mirror has */
  }
}

/** Test-only: reset all client state (mirror + pending). */
export function __resetWatcherClientForTests(): void {
  try {
    localStorage.removeItem(PENDING_KEY);
    localStorage.removeItem(LOG_MIRROR_KEY);
  } catch { /* ignore */ }
}
