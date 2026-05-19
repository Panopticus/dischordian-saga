/* ═══════════════════════════════════════════════════════
   PLAYER ANALYTICS — Privacy-first event tracking
   No third-party services. Stores events locally and
   batches them to our own server endpoint.
   ═══════════════════════════════════════════════════════ */

// ─── Types ─────────────────────────────────────────────

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: number;
  sessionId: string;
}

/**
 * Event taxonomy schema version. BUMP THIS when an event's
 * properties shape changes (renaming a field, removing a field,
 * adding a required field). Don't bump for additive optional
 * properties.
 *
 * Downstream dashboards filter on properties.schemaVersion so
 * historical data isn't mis-classified after a rename.
 */
export const ANALYTICS_SCHEMA_VERSION = 1;

// ─── Pre-defined game events for key funnels ───────────

export const GameEvents = {
  // Onboarding funnel
  LANDING_VIEWED: "landing_viewed",
  AWAKENING_STARTED: "awakening_started",
  AWAKENING_COMPLETED: "awakening_completed",
  FIRST_ROOM_EXPLORED: "first_room_explored",
  FIRST_DIALOG_COMPLETED: "first_dialog_completed",
  FIRST_FIGHT_STARTED: "first_fight_started",
  FIRST_FIGHT_WON: "first_fight_won",

  // FTUE step funnel — per-step drop-off. Each carries
  // { stepId, index, total } so retention analysis can build a
  // stage-by-stage conversion funnel; SKIPPED/COMPLETED also carry
  // the depth reached, so we can see WHERE the FTUE loses players.
  FTUE_STEP_SHOWN: "ftue_step_shown",
  FTUE_STEP_COMPLETED: "ftue_step_completed",
  FTUE_STEP_DISMISSED: "ftue_step_dismissed",
  FTUE_SKIPPED: "ftue_skipped",
  FTUE_COMPLETED: "ftue_completed",

  // Engagement
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  GAME_MODE_ENTERED: "game_mode_entered",
  QUEST_COMPLETED: "quest_completed",
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  LEVEL_UP: "level_up",

  // Retention
  DAILY_RETURN: "daily_return",
  STREAK_MAINTAINED: "streak_maintained",

  // Monetization
  STORE_VIEWED: "store_viewed",
  PURCHASE_STARTED: "purchase_started",
  PURCHASE_COMPLETED: "purchase_completed",

  // Social
  GUILD_JOINED: "guild_joined",
  PVP_MATCH_PLAYED: "pvp_match_played",
  TRADE_COMPLETED: "trade_completed",
} as const;

// ─── Internal state ────────────────────────────────────

let eventQueue: AnalyticsEvent[] = [];
let currentSessionId: string = "";
let sessionStartTime: number = 0;
let flushTimer: ReturnType<typeof setInterval> | null = null;

const FLUSH_INTERVAL_MS = 30_000;
const MAX_BATCH_SIZE = 100;
const STORAGE_KEY = "ds_analytics_queue";

// ─── Helpers ───────────────────────────────────────────

function generateSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function persistQueue(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventQueue));
  } catch {
    // Storage full or unavailable — silently drop
  }
}

function restoreQueue(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AnalyticsEvent[];
      if (Array.isArray(parsed)) {
        eventQueue = parsed;
      }
    }
  } catch {
    // Corrupted data — start fresh
    eventQueue = [];
  }
}

// ─── Core tracking functions ───────────────────────────

export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
): void {
  if (!currentSessionId) return;

  // Always stamp the schema version so the dashboard knows which
  // properties shape to apply when reading. Property is reserved.
  const stamped: Record<string, string | number | boolean> = {
    ...(properties ?? {}),
    schemaVersion: ANALYTICS_SCHEMA_VERSION,
  };

  const entry: AnalyticsEvent = {
    event,
    properties: stamped,
    timestamp: Date.now(),
    sessionId: currentSessionId,
  };

  eventQueue.push(entry);
  persistQueue();
}

export function trackPageView(path: string): void {
  trackEvent("page_view", { path });
}

export function trackTiming(category: string, durationMs: number): void {
  trackEvent("timing", { category, durationMs });
}

// ─── Session management ────────────────────────────────

export function startSession(): string {
  restoreQueue();

  currentSessionId = generateSessionId();
  sessionStartTime = Date.now();

  trackEvent(GameEvents.SESSION_START);

  // Auto-flush every 30 seconds
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = setInterval(() => {
    void flushEvents();
  }, FLUSH_INTERVAL_MS);

  // Flush on page unload
  if (typeof window !== "undefined") {
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
  }

  return currentSessionId;
}

export function endSession(): void {
  if (!currentSessionId) return;

  trackEvent(GameEvents.SESSION_END, {
    durationMs: getSessionDuration(),
  });

  void flushEvents();

  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }

  if (typeof window !== "undefined") {
    window.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  }

  currentSessionId = "";
  sessionStartTime = 0;
}

export function getSessionDuration(): number {
  if (!sessionStartTime) return 0;
  return Date.now() - sessionStartTime;
}

// ─── Flush / batch send ────────────────────────────────

export async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  // Take up to MAX_BATCH_SIZE events
  const batch = eventQueue.splice(0, MAX_BATCH_SIZE);
  persistQueue();

  try {
    const response = await fetch("/api/trpc/analytics.ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { events: batch } }),
      keepalive: true, // Survives page unload
    });

    if (!response.ok) {
      // Re-queue failed events at the front
      eventQueue.unshift(...batch);
      persistQueue();
    }
  } catch {
    // Network failure — re-queue
    eventQueue.unshift(...batch);
    persistQueue();
  }
}

// ─── Visibility / unload handlers ──────────────────────

function handleVisibilityChange(): void {
  if (document.visibilityState === "hidden") {
    void flushEvents();
  }
}

function handleBeforeUnload(): void {
  // Use sendBeacon for reliable delivery during unload
  if (eventQueue.length === 0) return;

  const batch = eventQueue.splice(0, MAX_BATCH_SIZE);

  try {
    const payload = JSON.stringify({ json: { events: batch } });
    const sent = navigator.sendBeacon("/api/trpc/analytics.ingest", payload);
    if (!sent) {
      eventQueue.unshift(...batch);
    }
  } catch {
    eventQueue.unshift(...batch);
  }

  persistQueue();
}
