/**
 * PHANTOM CREW / GHOST SIGNALS (Passive Multiplayer)
 * ══════════════════════════════════════════════════════════
 * Death Stranding-inspired async multiplayer. Players see
 * translucent "echoes" of other players' actions — anonymous
 * phantom signals that hint at what others have done.
 *
 * RPG IMPACT:
 * - Acknowledging a phantom grants both players +1 trust with the room's NPC
 * - 15% chance to see a phantom signal when entering any room
 * - Phantoms are always anonymous ("A Potential")
 *
 * LORE: "You are not alone in the Arks. The walls remember
 * every choice, every death, every discovery. Sometimes,
 * if you listen closely, you can hear them."
 */

/* ─── TYPES ─── */

export interface PhantomSignal {
  id: string;
  type: "choice" | "discovery" | "achievement" | "death" | "milestone";
  message: string;
  room: string;
  timestamp: number;
  acknowledgeCount: number;
}

export interface PhantomActionContext {
  npcName?: string;
  otherNpc?: string;
  room: string;
  loreEntry?: string;
  achievementName?: string;
  level?: number;
  className?: string;
  wave?: number;
}

/* ─── SIGNAL TEMPLATES ─── */

const PHANTOM_SIGNAL_TEMPLATES: Record<PhantomSignal["type"], string[]> = {
  choice: [
    "A Potential chose {npcName} over {otherNpc}.",
    "A Potential made a permanent choice in the {room}.",
    "A Potential forgave their apprentice.",
    "A Potential reached the Breaking Point.",
  ],
  discovery: [
    "A Potential discovered {loreEntry} in the Archives.",
    "A Potential found a hidden data fragment in the {room}.",
    "A Potential completed Epoch Zero.",
  ],
  achievement: [
    "A Potential earned '{achievementName}'.",
    "A Potential reached Level {level}.",
    "A Potential mastered {className}.",
  ],
  death: [
    "A Potential fell in Terminus Swarm at wave {wave}.",
    "A Potential's Eidolon was lost.",
    "A Potential was betrayed by their apprentice.",
  ],
  milestone: [
    "A Potential's trust with {npcName} reached 100.",
    "A Potential completed their 1000th game.",
    "A Potential became Canon.",
  ],
};

/* ─── CONSTANTS ─── */

/** Chance (0-1) to see a phantom signal when entering a room */
export const PHANTOM_APPEARANCE_CHANCE = 0.15;

/** Max phantom signals returned for a single room */
export const MAX_PHANTOMS_PER_ROOM = 3;

/** Trust bonus granted to both players when a phantom is acknowledged */
export const ACKNOWLEDGE_TRUST_BONUS = 1;

/** How long phantom signals persist before expiring (7 days in ms) */
export const PHANTOM_SIGNAL_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/* ─── TEMPLATE INTERPOLATION ─── */

/**
 * Fills template placeholders like {npcName} with values from context.
 * Unknown placeholders are replaced with "the unknown".
 */
function interpolateTemplate(template: string, context: PhantomActionContext): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = (context as Record<string, unknown>)[key];
    if (value !== undefined && value !== null) return String(value);
    return "the unknown";
  });
}

/* ─── CORE FUNCTIONS ─── */

/**
 * Generate a phantom signal from a player action.
 * Selects a random template for the given type and fills in context values.
 */
export function generatePhantomSignal(
  action: PhantomSignal["type"],
  context: PhantomActionContext,
): PhantomSignal {
  const templates = PHANTOM_SIGNAL_TEMPLATES[action];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const message = interpolateTemplate(template, context);

  return {
    id: `phantom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: action,
    message,
    room: context.room,
    timestamp: Date.now(),
    acknowledgeCount: 0,
  };
}

/**
 * Return recent phantom signals for a room, up to `limit` (default 3).
 * Filters out expired signals and sorts by most recent first.
 */
export function getPhantomSignalsForRoom(
  allSignals: PhantomSignal[],
  room: string,
  limit: number = MAX_PHANTOMS_PER_ROOM,
): PhantomSignal[] {
  const now = Date.now();
  return allSignals
    .filter(s => s.room === room && (now - s.timestamp) < PHANTOM_SIGNAL_TTL_MS)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Acknowledge (like) a phantom signal. Increments the signal's acknowledge
 * count and returns the trust bonus that should be applied to both players.
 *
 * Returns the updated signal and the trust bonus value.
 */
export function acknowledgePhantom(
  signal: PhantomSignal,
): { signal: PhantomSignal; trustBonus: number } {
  const updated: PhantomSignal = {
    ...signal,
    acknowledgeCount: signal.acknowledgeCount + 1,
  };
  return { signal: updated, trustBonus: ACKNOWLEDGE_TRUST_BONUS };
}

/**
 * Roll whether a phantom should appear when entering a room.
 * Returns true ~15% of the time.
 */
export function shouldPhantomAppear(rng?: number): boolean {
  const roll = rng ?? Math.random();
  return roll < PHANTOM_APPEARANCE_CHANCE;
}

/**
 * Pick a single phantom signal to display from the available signals for a room.
 * Prioritizes signals with higher acknowledge counts (social proof).
 */
export function pickPhantomToDisplay(
  allSignals: PhantomSignal[],
  room: string,
): PhantomSignal | null {
  const candidates = getPhantomSignalsForRoom(allSignals, room);
  if (candidates.length === 0) return null;

  // Weight by acknowledge count: more-acknowledged phantoms are more likely to appear
  const totalWeight = candidates.reduce((sum, s) => sum + s.acknowledgeCount + 1, 0);
  let roll = Math.random() * totalWeight;
  for (const signal of candidates) {
    roll -= signal.acknowledgeCount + 1;
    if (roll <= 0) return signal;
  }
  return candidates[0];
}

/**
 * Get all available template types for generating phantom signals.
 */
export function getPhantomSignalTypes(): PhantomSignal["type"][] {
  return Object.keys(PHANTOM_SIGNAL_TEMPLATES) as PhantomSignal["type"][];
}

/**
 * Format a phantom signal for display in the UI.
 * Returns an object with display-friendly properties.
 */
export function formatPhantomForDisplay(signal: PhantomSignal): {
  message: string;
  timeAgo: string;
  acknowledges: number;
  typeIcon: string;
} {
  const elapsed = Date.now() - signal.timestamp;
  const minutes = Math.floor(elapsed / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeAgo: string;
  if (days > 0) timeAgo = `${days}d ago`;
  else if (hours > 0) timeAgo = `${hours}h ago`;
  else if (minutes > 0) timeAgo = `${minutes}m ago`;
  else timeAgo = "just now";

  const typeIcons: Record<PhantomSignal["type"], string> = {
    choice: "GitBranch",
    discovery: "Compass",
    achievement: "Trophy",
    death: "Skull",
    milestone: "Flag",
  };

  return {
    message: signal.message,
    timeAgo,
    acknowledges: signal.acknowledgeCount,
    typeIcon: typeIcons[signal.type],
  };
}
