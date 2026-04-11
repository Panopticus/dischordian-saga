/* ═══════════════════════════════════════════════════════
   GUILD EVENTS — Scheduled guild activities

   Guild leaders and officers can schedule events (raids,
   tournaments, roleplay nights, lore symposiums, etc.).
   Members RSVP and optionally check in. Each event category
   has an icon, color, and description used by the client.
   ═══════════════════════════════════════════════════════ */

/** The exact set of event types matches the DB enum in schema.ts guild_events. */
export type GuildEventType =
  | "raid"
  | "tournament"
  | "pvp_practice"
  | "roleplay"
  | "lore_night"
  | "recruitment_drive"
  | "trade_fair"
  | "training"
  | "social"
  | "other";

export type GuildEventStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type RsvpStatus = "going" | "maybe" | "declined";

export interface GuildEventTypeDef {
  id: GuildEventType;
  name: string;
  description: string;
  /** lucide-react icon name. */
  icon: string;
  /** Tailwind-compatible accent color. */
  color: string;
}

export const GUILD_EVENT_TYPES: readonly GuildEventTypeDef[] = [
  { id: "raid",              name: "Raid",              description: "Coordinated boss run or dungeon clear.",           icon: "Swords",   color: "#ef4444" },
  { id: "tournament",        name: "Tournament",        description: "Bracketed competition (fight / chess / cards).",    icon: "Trophy",   color: "#f59e0b" },
  { id: "pvp_practice",      name: "PvP Practice",      description: "Open sparring, ladder warmup, scrims.",             icon: "Shield",   color: "#8b5cf6" },
  { id: "roleplay",          name: "Roleplay",          description: "In-character session in the guild hall.",           icon: "Drama",    color: "#ec4899" },
  { id: "lore_night",        name: "Lore Night",        description: "Shared reading, Loredex crawl, or symposium.",      icon: "BookOpen", color: "#3b82f6" },
  { id: "recruitment_drive", name: "Recruitment Drive", description: "Open event for prospective members.",               icon: "UserPlus", color: "#22c55e" },
  { id: "trade_fair",        name: "Trade Fair",        description: "Guild-run marketplace and crafting swap.",          icon: "Store",    color: "#06b6d4" },
  { id: "training",          name: "Training",          description: "Skill instruction led by a senior member.",         icon: "GraduationCap", color: "#0ea5e9" },
  { id: "social",            name: "Social",            description: "Hangout, icebreaker, celebration, quiet night.",    icon: "Users",    color: "#a855f7" },
  { id: "other",             name: "Other",             description: "Anything that doesn't fit another bucket.",         icon: "Calendar", color: "#94a3b8" },
] as const;

export function getGuildEventTypeDef(type: GuildEventType): GuildEventTypeDef {
  return GUILD_EVENT_TYPES.find((t) => t.id === type) ?? GUILD_EVENT_TYPES[GUILD_EVENT_TYPES.length - 1];
}

/** Validation limits for event creation. Enforced in the router. */
export const GUILD_EVENT_LIMITS = {
  titleMaxLen: 128,
  descriptionMaxLen: 2000,
  minDurationMs: 5 * 60 * 1000,            // 5 minutes
  maxDurationMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
  maxFutureMs: 180 * 24 * 60 * 60 * 1000,  // 180 days out
  maxAttendeesHardCap: 1000,
} as const;

export interface EventValidationError {
  field: string;
  message: string;
}

/** Shared input validator — used by both the router and any client-side
 *  optimistic checks. Returns an empty array on success. */
export function validateEventInput(input: {
  title: string;
  description?: string | null;
  startsAt: Date | number;
  endsAt: Date | number;
  maxAttendees?: number;
}): EventValidationError[] {
  const errors: EventValidationError[] = [];
  const title = input.title?.trim() ?? "";
  if (title.length === 0) errors.push({ field: "title", message: "Title is required" });
  if (title.length > GUILD_EVENT_LIMITS.titleMaxLen) {
    errors.push({ field: "title", message: `Title must be ≤${GUILD_EVENT_LIMITS.titleMaxLen} chars` });
  }
  if (input.description && input.description.length > GUILD_EVENT_LIMITS.descriptionMaxLen) {
    errors.push({ field: "description", message: `Description must be ≤${GUILD_EVENT_LIMITS.descriptionMaxLen} chars` });
  }

  const startsAtMs = typeof input.startsAt === "number" ? input.startsAt : input.startsAt.getTime();
  const endsAtMs = typeof input.endsAt === "number" ? input.endsAt : input.endsAt.getTime();
  const now = Date.now();

  if (!Number.isFinite(startsAtMs)) errors.push({ field: "startsAt", message: "Invalid start time" });
  if (!Number.isFinite(endsAtMs)) errors.push({ field: "endsAt", message: "Invalid end time" });
  if (endsAtMs <= startsAtMs) {
    errors.push({ field: "endsAt", message: "End time must be after start time" });
  }
  const duration = endsAtMs - startsAtMs;
  if (duration < GUILD_EVENT_LIMITS.minDurationMs) {
    errors.push({ field: "endsAt", message: "Event must last at least 5 minutes" });
  }
  if (duration > GUILD_EVENT_LIMITS.maxDurationMs) {
    errors.push({ field: "endsAt", message: "Event cannot exceed 7 days" });
  }
  if (startsAtMs - now > GUILD_EVENT_LIMITS.maxFutureMs) {
    errors.push({ field: "startsAt", message: "Event cannot be scheduled more than 180 days out" });
  }

  if (input.maxAttendees !== undefined) {
    if (input.maxAttendees < 0) {
      errors.push({ field: "maxAttendees", message: "maxAttendees cannot be negative" });
    }
    if (input.maxAttendees > GUILD_EVENT_LIMITS.maxAttendeesHardCap) {
      errors.push({ field: "maxAttendees", message: `maxAttendees cannot exceed ${GUILD_EVENT_LIMITS.maxAttendeesHardCap}` });
    }
  }

  return errors;
}

/** Return only RSVPs in the 'going' state. Used for attendee counts. */
export function countGoing(attendance: { rsvpStatus: RsvpStatus }[]): number {
  return attendance.filter((a) => a.rsvpStatus === "going").length;
}

/** Derive a runtime status from the stored status + current time. Useful for
 *  the UI when an event has auto-transitioned from scheduled to in-progress
 *  without the server having patched the row yet. */
export function computeLiveStatus(
  stored: GuildEventStatus,
  startsAt: Date | number,
  endsAt: Date | number,
  now: number = Date.now(),
): GuildEventStatus {
  if (stored === "cancelled" || stored === "completed") return stored;
  const s = typeof startsAt === "number" ? startsAt : startsAt.getTime();
  const e = typeof endsAt === "number" ? endsAt : endsAt.getTime();
  if (now < s) return "scheduled";
  if (now >= s && now < e) return "in_progress";
  return "completed";
}
