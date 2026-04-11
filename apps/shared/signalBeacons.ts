/**
 * SIGNAL BEACONS (Dark Souls Messages)
 * ══════════════════════════════════════════════════════════
 * Players leave short text messages in Ark rooms, visible to
 * other players. Messages use structured templates with
 * fill-in-the-blank slots, rated as "Truth" or "Edited"
 * (a Shadow Tongue reference).
 *
 * RPG IMPACT:
 * - Highly rated beacons persist longer (Truth extends, Edited shortens)
 * - "Confirmed Signal" status at >10 Truth ratings (7-day persistence)
 * - "Connector" reputation tracks players with high-quality beacons
 *
 * LORE: "The Shadow Tongue edits reality. But some signals
 * cut through the noise — beacons left by those who walked
 * these corridors before you."
 */

/* ─── TYPES ─── */

export interface SignalBeacon {
  id: string;
  room: string;
  authorId: string;
  message: string;
  template: string;
  rating: { truth: number; edited: number };
  createdAt: number;
  expiresAt: number;
}

export type BeaconRating = "truth" | "edited";

/* ─── TEMPLATES ─── */

export const BEACON_TEMPLATES = [
  "Don't trust {npc}.",
  "Trust {npc}.",
  "{npc} is lying about {topic}.",
  "The {room} hides something.",
  "Elara remembers {memory}.",
  "The Shadow Tongue edited {thing}.",
  "If you're reading this, {warning}.",
  "The Antiquarian told me {revelation}.",
  "{freeform}",
] as const;

/* ─── CONSTANTS ─── */

/** Maximum message length in characters */
export const MAX_BEACON_MESSAGE_LENGTH = 100;

/** Maximum beacons a player can create per day */
export const MAX_BEACONS_PER_PLAYER_PER_DAY = 3;

/** Maximum beacons returned for a single room */
export const MAX_BEACONS_PER_ROOM = 5;

/** Base lifespan in milliseconds (24 hours) */
export const BASE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

/** Time added per "Truth" rating (6 hours in ms) */
export const TRUTH_EXTENSION_MS = 6 * 60 * 60 * 1000;

/** Time removed per "Edited" rating (3 hours in ms) */
export const EDITED_REDUCTION_MS = 3 * 60 * 60 * 1000;

/** Truth ratings needed for "Confirmed Signal" status */
export const CONFIRMED_SIGNAL_THRESHOLD = 10;

/** Confirmed Signal lifespan (7 days in ms) */
export const CONFIRMED_SIGNAL_LIFESPAN_MS = 7 * 24 * 60 * 60 * 1000;

/** Truth ratings needed for a beacon to count toward Connector reputation */
export const CONNECTOR_BEACON_THRESHOLD = 5;

/* ─── TEMPLATE INTERPOLATION ─── */

/**
 * Build a beacon message from a template and fill-in values.
 * For the {freeform} template, the entire message is custom text.
 */
function buildMessageFromTemplate(
  template: string,
  fillIns: Record<string, string>,
): string {
  if (template === "{freeform}") {
    return fillIns["freeform"] || "";
  }
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    return fillIns[key] || key;
  });
}

/* ─── CORE FUNCTIONS ─── */

/**
 * Create a new signal beacon in a room.
 * Enforces max message length. Rate limiting (max 3/day) is enforced server-side.
 */
export function createBeacon(
  room: string,
  template: string,
  fillIns: Record<string, string>,
  authorId: string,
): { beacon: SignalBeacon | null; error?: string } {
  const message = buildMessageFromTemplate(template, fillIns);

  if (!message.trim()) {
    return { beacon: null, error: "Beacon message cannot be empty." };
  }
  if (message.length > MAX_BEACON_MESSAGE_LENGTH) {
    return {
      beacon: null,
      error: `Beacon message too long (max ${MAX_BEACON_MESSAGE_LENGTH} characters, got ${message.length}).`,
    };
  }

  const now = Date.now();
  const beacon: SignalBeacon = {
    id: `beacon_${now}_${Math.random().toString(36).slice(2, 9)}`,
    room,
    authorId,
    message,
    template,
    rating: { truth: 0, edited: 0 },
    createdAt: now,
    expiresAt: now + BASE_LIFESPAN_MS,
  };

  return { beacon };
}

/**
 * Return top-rated beacons for a room, up to `limit` (default 5).
 * Filters out expired beacons. Sorts by net rating (truth - edited) descending.
 */
export function getBeaconsForRoom(
  allBeacons: SignalBeacon[],
  room: string,
  limit: number = MAX_BEACONS_PER_ROOM,
): SignalBeacon[] {
  const now = Date.now();
  return allBeacons
    .filter(b => b.room === room && b.expiresAt > now)
    .sort((a, b) => {
      const netA = a.rating.truth - a.rating.edited;
      const netB = b.rating.truth - b.rating.edited;
      return netB - netA;
    })
    .slice(0, limit);
}

/**
 * Rate a beacon as "Truth" (helpful) or "Edited" (misleading).
 * Adjusts the beacon's expiry accordingly.
 * Returns the updated beacon.
 */
export function rateBeacon(
  beacon: SignalBeacon,
  rating: BeaconRating,
): SignalBeacon {
  const updated = { ...beacon, rating: { ...beacon.rating } };

  if (rating === "truth") {
    updated.rating.truth += 1;
    updated.expiresAt += TRUTH_EXTENSION_MS;

    // Check for "Confirmed Signal" — override to 7-day lifespan from creation
    if (updated.rating.truth >= CONFIRMED_SIGNAL_THRESHOLD) {
      const confirmedExpiry = updated.createdAt + CONFIRMED_SIGNAL_LIFESPAN_MS;
      if (updated.expiresAt < confirmedExpiry) {
        updated.expiresAt = confirmedExpiry;
      }
    }
  } else {
    updated.rating.edited += 1;
    updated.expiresAt -= EDITED_REDUCTION_MS;

    // Don't let expiry go before creation time (minimum lifespan = 0)
    if (updated.expiresAt < updated.createdAt) {
      updated.expiresAt = updated.createdAt;
    }
  }

  return updated;
}

/**
 * Check whether a beacon has "Confirmed Signal" status.
 */
export function isConfirmedSignal(beacon: SignalBeacon): boolean {
  return beacon.rating.truth >= CONFIRMED_SIGNAL_THRESHOLD;
}

/**
 * Calculate a player's "Connector" reputation score.
 * Counts how many of their beacons have >= 5 Truth ratings.
 */
export function getConnectorReputation(
  allBeacons: SignalBeacon[],
  authorId: string,
): number {
  return allBeacons.filter(
    b => b.authorId === authorId && b.rating.truth >= CONNECTOR_BEACON_THRESHOLD,
  ).length;
}

/**
 * Calculate the remaining lifespan of a beacon in hours.
 */
export function getRemainingLifespanHours(beacon: SignalBeacon): number {
  const remaining = beacon.expiresAt - Date.now();
  return Math.max(0, Math.round(remaining / (60 * 60 * 1000)));
}

/**
 * Check if a beacon has expired.
 */
export function isBeaconExpired(beacon: SignalBeacon): boolean {
  return Date.now() >= beacon.expiresAt;
}

/**
 * Format a beacon for display. Hides authorId for anonymity.
 */
export function formatBeaconForDisplay(beacon: SignalBeacon): {
  message: string;
  truthCount: number;
  editedCount: number;
  confirmed: boolean;
  remainingHours: number;
} {
  return {
    message: beacon.message,
    truthCount: beacon.rating.truth,
    editedCount: beacon.rating.edited,
    confirmed: isConfirmedSignal(beacon),
    remainingHours: getRemainingLifespanHours(beacon),
  };
}

/**
 * Validate that a template is one of the allowed beacon templates.
 */
export function isValidTemplate(template: string): boolean {
  return (BEACON_TEMPLATES as readonly string[]).includes(template);
}
