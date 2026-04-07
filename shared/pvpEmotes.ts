/* ═══════════════════════════════════════════════════════
   PVP EMOTES — Quick-chat emote system for PvP matches

   12 emotes across 4 categories: neutral, faction-specific,
   competitive, and companion-based. Includes rate limiting
   to prevent spam.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type EmoteCategory = "neutral" | "faction" | "competitive" | "companion";

export interface Emote {
  /** Unique emote identifier */
  id: string;
  /** Display text shown to all players */
  text: string;
  /** Emote category */
  category: EmoteCategory;
  /** Icon identifier for UI (lucide icon name) */
  icon: string;
  /** If set, only available to players of this faction */
  factionLock: string | null;
  /** If set, only available when this companion is equipped */
  companionLock: string | null;
}

/* ─── RATE LIMITING ─── */

/** Maximum emotes a player can send in the rate limit window */
export const EMOTE_RATE_LIMIT = 3;

/** Rate limit window in milliseconds (30 seconds) */
export const EMOTE_RATE_WINDOW_MS = 30_000;

export interface EmoteRateState {
  timestamps: number[];
}

/**
 * Check if a player can send an emote given their recent emote history.
 * Returns true if the emote is allowed, false if rate-limited.
 */
export function canSendEmote(state: EmoteRateState, now: number = Date.now()): boolean {
  // Clean up timestamps outside the window
  const recentTimestamps = state.timestamps.filter(
    ts => now - ts < EMOTE_RATE_WINDOW_MS,
  );
  return recentTimestamps.length < EMOTE_RATE_LIMIT;
}

/**
 * Record an emote send and return the updated rate state.
 * Call this after canSendEmote returns true.
 */
export function recordEmoteSend(state: EmoteRateState, now: number = Date.now()): EmoteRateState {
  const recentTimestamps = state.timestamps.filter(
    ts => now - ts < EMOTE_RATE_WINDOW_MS,
  );
  return { timestamps: [...recentTimestamps, now] };
}

/**
 * Get the number of seconds until the next emote is available.
 * Returns 0 if the player can send an emote now.
 */
export function getEmoteCooldownSeconds(state: EmoteRateState, now: number = Date.now()): number {
  const recentTimestamps = state.timestamps
    .filter(ts => now - ts < EMOTE_RATE_WINDOW_MS)
    .sort((a, b) => a - b);

  if (recentTimestamps.length < EMOTE_RATE_LIMIT) return 0;

  // The oldest timestamp in the window determines when the next slot opens
  const oldestInWindow = recentTimestamps[0];
  const availableAt = oldestInWindow + EMOTE_RATE_WINDOW_MS;
  return Math.max(0, Math.ceil((availableAt - now) / 1000));
}

/* ─── EMOTE DEFINITIONS ─── */

export const ALL_EMOTES: Emote[] = [
  // Neutral (available to everyone)
  {
    id: "well_played",
    text: "Well played!",
    category: "neutral",
    icon: "ThumbsUp",
    factionLock: null,
    companionLock: null,
  },
  {
    id: "good_game",
    text: "Good game",
    category: "neutral",
    icon: "Handshake",
    factionLock: null,
    companionLock: null,
  },
  {
    id: "thanks",
    text: "Thanks",
    category: "neutral",
    icon: "Heart",
    factionLock: null,
    companionLock: null,
  },
  {
    id: "interesting",
    text: "Interesting...",
    category: "neutral",
    icon: "Search",
    factionLock: null,
    companionLock: null,
  },

  // Faction-specific
  {
    id: "architect_approves",
    text: "The Architect approves",
    category: "faction",
    icon: "Building",
    factionLock: "architect",
    companionLock: null,
  },
  {
    id: "for_the_dreamer",
    text: "For the Dreamer!",
    category: "faction",
    icon: "Sparkles",
    factionLock: "dreamer",
    companionLock: null,
  },
  {
    id: "meme_sends_regards",
    text: "The Meme sends regards",
    category: "faction",
    icon: "Smile",
    factionLock: "meme",
    companionLock: null,
  },

  // Competitive
  {
    id: "lucky",
    text: "Lucky...",
    category: "competitive",
    icon: "Clover",
    factionLock: null,
    companionLock: null,
  },
  {
    id: "calculated",
    text: "Calculated.",
    category: "competitive",
    icon: "Calculator",
    factionLock: null,
    companionLock: null,
  },
  {
    id: "too_easy",
    text: "Too easy",
    category: "competitive",
    icon: "Zap",
    factionLock: null,
    companionLock: null,
  },
  {
    id: "rematch",
    text: "Rematch?",
    category: "competitive",
    icon: "RotateCcw",
    factionLock: null,
    companionLock: null,
  },

  // Companion
  {
    id: "elara_nods",
    text: "Elara nods approvingly",
    category: "companion",
    icon: "Smile",
    factionLock: null,
    companionLock: "elara",
  },
  {
    id: "human_scoffs",
    text: "The Human scoffs",
    category: "companion",
    icon: "Frown",
    factionLock: null,
    companionLock: "the_human",
  },
];

/* ─── EMOTE FILTERING ─── */

/**
 * Get all emotes available to a player based on their faction and companion.
 * Faction-specific emotes are only available to players of that faction.
 * Companion emotes are only available when the matching companion is equipped.
 *
 * @param faction - The player's faction (e.g., "architect", "dreamer", "meme")
 * @param companionId - The player's currently equipped companion ID, if any
 */
export function getAvailableEmotes(faction: string, companionId?: string): Emote[] {
  return ALL_EMOTES.filter(emote => {
    // Faction-locked emotes: only available to matching faction
    if (emote.factionLock && emote.factionLock !== faction) return false;

    // Companion-locked emotes: only available with matching companion
    if (emote.companionLock && emote.companionLock !== companionId) return false;

    return true;
  });
}

/**
 * Get emotes grouped by category for UI display.
 */
export function getEmotesByCategory(
  faction: string,
  companionId?: string,
): Record<EmoteCategory, Emote[]> {
  const available = getAvailableEmotes(faction, companionId);
  return {
    neutral: available.filter(e => e.category === "neutral"),
    faction: available.filter(e => e.category === "faction"),
    competitive: available.filter(e => e.category === "competitive"),
    companion: available.filter(e => e.category === "companion"),
  };
}

/**
 * Validate that a player is allowed to use a specific emote.
 */
export function validateEmote(
  emoteId: string,
  faction: string,
  companionId?: string,
): { valid: boolean; error?: string } {
  const emote = ALL_EMOTES.find(e => e.id === emoteId);
  if (!emote) return { valid: false, error: "Unknown emote" };

  if (emote.factionLock && emote.factionLock !== faction) {
    return { valid: false, error: `This emote is exclusive to the ${emote.factionLock} faction` };
  }

  if (emote.companionLock && emote.companionLock !== companionId) {
    return { valid: false, error: `This emote requires the ${emote.companionLock} companion` };
  }

  return { valid: true };
}
