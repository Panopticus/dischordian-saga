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

// ─── Pre-defined game events for key funnels ───────────
//
// See docs/analytics/EVENT_SPEC.md for the canonical list, payload
// shapes, and guidance on when to fire each event. New events MUST be
// added to both this const AND the spec doc in the same PR so product,
// design, and engineering stay aligned.

export const GameEvents = {
  /* ─── Lifecycle ──────────────────────────────────── */
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  PAGE_VIEW: "page_view",
  DAILY_RETURN: "daily_return",
  STREAK_MAINTAINED: "streak_maintained",
  STREAK_BROKEN: "streak_broken",

  /* ─── Onboarding funnel ──────────────────────────── */
  LANDING_VIEWED: "landing_viewed",
  AUTH_STARTED: "auth_started",
  AUTH_COMPLETED: "auth_completed",
  AWAKENING_STARTED: "awakening_started",
  AWAKENING_STEP_COMPLETED: "awakening_step_completed",
  AWAKENING_ABANDONED: "awakening_abandoned",
  AWAKENING_COMPLETED: "awakening_completed",
  FIRST_ROOM_EXPLORED: "first_room_explored",
  FIRST_DIALOG_COMPLETED: "first_dialog_completed",
  FIRST_FIGHT_STARTED: "first_fight_started",
  FIRST_FIGHT_WON: "first_fight_won",
  TUTORIAL_STARTED: "tutorial_started",
  TUTORIAL_STEP_COMPLETED: "tutorial_step_completed",
  TUTORIAL_SKIPPED: "tutorial_skipped",
  TUTORIAL_COMPLETED: "tutorial_completed",

  /* ─── Engagement (per-mode entry) ────────────────── */
  GAME_MODE_ENTERED: "game_mode_entered",
  GAME_MODE_EXITED: "game_mode_exited",
  QUEST_STARTED: "quest_started",
  QUEST_COMPLETED: "quest_completed",
  QUEST_ABANDONED: "quest_abandoned",
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  LEVEL_UP: "level_up",
  PRESTIGE_CLAIMED: "prestige_claimed",
  LORE_DISCOVERED: "lore_discovered",
  ROOM_UNLOCKED: "room_unlocked",

  /* ─── Combat telemetry ───────────────────────────── */
  FIGHT_STARTED: "fight_started",
  FIGHT_ENDED: "fight_ended",
  FIGHT_RAGE_QUIT: "fight_rage_quit",
  CARD_MATCH_STARTED: "card_match_started",
  CARD_MATCH_ENDED: "card_match_ended",
  PVP_MATCH_QUEUED: "pvp_match_queued",
  PVP_MATCH_PLAYED: "pvp_match_played",
  TERMINUS_WAVE_COMPLETED: "terminus_wave_completed",
  TERMINUS_RUN_ENDED: "terminus_run_ended",
  CHESS_GAME_ENDED: "chess_game_ended",
  BOSS_ATTEMPT_STARTED: "boss_attempt_started",
  BOSS_ATTEMPT_ENDED: "boss_attempt_ended",

  /* ─── Economy — faucets (currency in) ────────────── */
  CURRENCY_EARNED: "currency_earned",   // { currency, amount, source }
  ITEM_GRANTED: "item_granted",         // { itemType, itemId, source }
  REWARD_CLAIMED: "reward_claimed",     // { rewardType, source }

  /* ─── Economy — sinks (currency out) ─────────────── */
  CURRENCY_SPENT: "currency_spent",     // { currency, amount, destination }
  ITEM_CONSUMED: "item_consumed",       // { itemType, itemId, destination }
  ITEM_CRAFTED: "item_crafted",         // { recipeId, inputCost }
  ITEM_LISTED: "item_listed",           // marketplace
  ITEM_PURCHASED: "item_purchased",     // marketplace

  /* ─── Monetization ───────────────────────────────── */
  STORE_VIEWED: "store_viewed",
  STORE_PRODUCT_VIEWED: "store_product_viewed",
  PURCHASE_STARTED: "purchase_started",
  PURCHASE_COMPLETED: "purchase_completed",
  PURCHASE_FAILED: "purchase_failed",
  PROMO_CODE_REDEEMED: "promo_code_redeemed",
  BATTLE_PASS_UNLOCKED: "battle_pass_unlocked",

  /* ─── Social graph ───────────────────────────────── */
  FRIEND_REQUEST_SENT: "friend_request_sent",
  FRIEND_REQUEST_ACCEPTED: "friend_request_accepted",
  FRIEND_REMOVED: "friend_removed",
  DM_SENT: "dm_sent",
  USER_BLOCKED: "user_blocked",
  USER_REPORTED: "user_reported",
  GUILD_JOINED: "guild_joined",
  GUILD_LEFT: "guild_left",
  TRADE_COMPLETED: "trade_completed",

  /* ─── Error + performance ────────────────────────── */
  CLIENT_ERROR: "client_error",
  TRPC_ERROR: "trpc_error",
  SOCKET_DISCONNECT: "socket_disconnect",
  FPS_DROP: "fps_drop",
  ASSET_LOAD_FAILED: "asset_load_failed",
  ASSET_LOAD_SLOW: "asset_load_slow",
} as const;

/**
 * All valid event names as a union type — prefer `trackEvent(GameEvents.X, …)`
 * over raw strings so typos are caught at compile time.
 */
export type GameEventName = typeof GameEvents[keyof typeof GameEvents];

/* ─── Strongly-typed helpers for the high-traffic events ─── */

/** Canonical currency identifiers. Keep in sync with shared/unifiedEconomy. */
export type CurrencyId =
  | "dream"       // soft currency, primary earn
  | "soulbound_dream" // soft currency, bound variant (cannot trade)
  | "credits"     // hard currency, Stripe-purchased
  | "essence"
  | "dust"
  | "shards";

/**
 * Emit a currency-earned event. Every faucet in the game should call this
 * so the economy dashboard can compute source attribution.
 */
export function trackCurrencyEarned(
  currency: CurrencyId,
  amount: number,
  source: string,
): void {
  trackEvent(GameEvents.CURRENCY_EARNED, { currency, amount, source });
}

/**
 * Emit a currency-spent event. Every sink should call this so the
 * economy dashboard can compute destination attribution.
 */
export function trackCurrencySpent(
  currency: CurrencyId,
  amount: number,
  destination: string,
): void {
  trackEvent(GameEvents.CURRENCY_SPENT, { currency, amount, destination });
}

/** Match result for combat telemetry. */
export interface MatchResultProps {
  mode: string;           // "fight" | "card" | "pvp" | "terminus" | "chess" | "boss"
  result: "win" | "loss" | "draw" | "quit";
  durationMs: number;
  opponentId?: string;
}
export function trackMatchEnded(props: MatchResultProps): void {
  const payload: Record<string, string | number | boolean> = {
    mode: props.mode,
    result: props.result,
    durationMs: props.durationMs,
  };
  if (props.opponentId) payload.opponentId = props.opponentId;
  trackEvent("match_ended", payload);
}

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

  const entry: AnalyticsEvent = {
    event,
    properties,
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
