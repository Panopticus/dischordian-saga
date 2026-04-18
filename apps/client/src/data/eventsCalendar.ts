/* ═══════════════════════════════════════════════════════
   YEAR ONE EVENTS CALENDAR — THE LIVING ARK

   Complete Year One roadmap infrastructure. Events are
   organized by Act (season), Month, and Week. The user
   will load the actual event content; this file provides
   the scaffolding, scheduling utilities, and type-safe
   helpers for populating the calendar.

   SCHEDULE:
   - Weekly Votes: Mon 00:00 UTC → Sun 23:59 UTC
   - Monthly Votes: Week 4 of each month
   - Daily Micro-Votes: 1-3 per day, 24h window
   - Seasonal Events: End of each Act (Weeks 13, 26, 39, 52)

   ACTS:
   - Act 1: Weeks 1-13  (Months 1-3)  — Awakening
   - Act 2: Weeks 14-26 (Months 4-6)  — Expansion
   - Act 3: Weeks 27-39 (Months 7-9)  — Conflict
   - Act 4: Weeks 40-52 (Months 10-12) — Resolution
   ═══════════════════════════════════════════════════════ */

import type {
  CalendarEvent,
  EventCategory,
  EventStatus,
} from "@/stores/governanceStore";

/* ─── ACT DEFINITIONS ─── */

export interface ActDefinition {
  act: number;
  title: string;
  subtitle: string;
  weekStart: number;
  weekEnd: number;
  monthStart: number;
  monthEnd: number;
  themeColor: string;
  description: string;
}

export const ACTS: ActDefinition[] = [
  {
    act: 1,
    title: "ACT I — AWAKENING",
    subtitle: "The Second Coming Opens Its Eyes",
    weekStart: 1,
    weekEnd: 13,
    monthStart: 1,
    monthEnd: 3,
    themeColor: "void-text-energy",
    description:
      "The Potentials awaken from cryo. The Ark's systems come online. " +
      "The first votes are cast. The Antiquarian begins writing.",
  },
  {
    act: 2,
    title: "ACT II — EXPANSION",
    subtitle: "Into the Unknown Signal",
    weekStart: 14,
    weekEnd: 26,
    monthStart: 4,
    monthEnd: 6,
    themeColor: "void-text-accent",
    description:
      "The Ark ventures deeper into uncharted space. New factions emerge. " +
      "The Thought Virus signal intensifies. Alliances form and fracture.",
  },
  {
    act: 3,
    title: "ACT III — CONFLICT",
    subtitle: "The Architect's Gambit",
    weekStart: 27,
    weekEnd: 39,
    monthStart: 7,
    monthEnd: 9,
    themeColor: "void-text-error",
    description:
      "War comes to the Ark. The Architect reveals their hand. " +
      "Community decisions carry permanent, irreversible consequences.",
  },
  {
    act: 4,
    title: "ACT IV — RESOLUTION",
    subtitle: "The Chronicle Closes",
    weekStart: 40,
    weekEnd: 52,
    monthStart: 10,
    monthEnd: 12,
    themeColor: "void-text-energy",
    description:
      "The final chapters are written. The Potentials face the truth " +
      "of their choices. The Antiquarian finishes the Chronicle.",
  },
];

/* ─── SCHEDULING UTILITIES ─── */

/**
 * Get the Act number for a given week (1-52).
 */
export function getActForWeek(week: number): number {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  if (week <= 39) return 3;
  return 4;
}

/**
 * Get the Act definition for a given week.
 */
export function getActDefinition(week: number): ActDefinition {
  return ACTS[getActForWeek(week) - 1];
}

/**
 * Calculate UTC timestamps for a weekly vote window.
 * Opens Monday 00:00 UTC, closes Sunday 23:59 UTC.
 * @param yearStart - The Unix timestamp of Year One's start (first Monday)
 * @param week - Week number (1-52)
 */
export function getWeeklyVoteWindow(
  yearStart: number,
  week: number,
): { startsAt: number; endsAt: number } {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const startsAt = yearStart + (week - 1) * msPerWeek;
  const endsAt = startsAt + msPerWeek - 1;
  return { startsAt, endsAt };
}

/**
 * Calculate UTC timestamps for a monthly vote window.
 * Runs during Week 4 of the month.
 */
export function getMonthlyVoteWindow(
  yearStart: number,
  month: number,
): { startsAt: number; endsAt: number } {
  // Month's 4th week = (month-1)*4 + 4 = month*4
  const week = month * 4;
  return getWeeklyVoteWindow(yearStart, week);
}

/**
 * Check if a seasonal event week.
 */
export function isSeasonalWeek(week: number): boolean {
  return week === 13 || week === 26 || week === 39 || week === 52;
}

/* ─── EVENT BUILDER ─── */

/**
 * Create a CalendarEvent with sensible defaults.
 */
export function createCalendarEvent(
  params: Omit<CalendarEvent, "status"> & { status?: EventStatus },
): CalendarEvent {
  return {
    status: "upcoming",
    ...params,
  };
}

/**
 * Build a weekly vote event.
 */
export function buildWeeklyVoteEvent(params: {
  id: string;
  title: string;
  description: string;
  week: number;
  month: number;
  voteId: string;
  affectedSystems: string[];
  yearStart: number;
  tags?: string[];
}): CalendarEvent {
  const { startsAt, endsAt } = getWeeklyVoteWindow(params.yearStart, params.week);
  return createCalendarEvent({
    id: params.id,
    title: params.title,
    description: params.description,
    category: "weekly_vote",
    act: getActForWeek(params.week),
    month: params.month,
    week: params.week,
    startsAt,
    endsAt,
    voteId: params.voteId,
    affectedSystems: params.affectedSystems,
    tags: params.tags || ["vote", "weekly"],
  });
}

/**
 * Build a monthly vote event.
 */
export function buildMonthlyVoteEvent(params: {
  id: string;
  title: string;
  description: string;
  month: number;
  voteId: string;
  affectedSystems: string[];
  yearStart: number;
  tags?: string[];
}): CalendarEvent {
  const { startsAt, endsAt } = getMonthlyVoteWindow(params.yearStart, params.month);
  const week = params.month * 4;
  return createCalendarEvent({
    id: params.id,
    title: params.title,
    description: params.description,
    category: "monthly_vote",
    act: getActForWeek(week),
    month: params.month,
    week,
    startsAt,
    endsAt,
    voteId: params.voteId,
    affectedSystems: params.affectedSystems,
    tags: params.tags || ["vote", "monthly", "major"],
  });
}

/**
 * Build a seasonal climax event.
 */
export function buildSeasonalEvent(params: {
  id: string;
  title: string;
  description: string;
  act: number;
  /** Duration in weeks (typically 2-3) */
  durationWeeks: number;
  affectedSystems: string[];
  yearStart: number;
  tags?: string[];
}): CalendarEvent {
  const actDef = ACTS[params.act - 1];
  const finalWeek = actDef.weekEnd;
  const startWeek = finalWeek - params.durationWeeks + 1;
  const { startsAt } = getWeeklyVoteWindow(params.yearStart, startWeek);
  const { endsAt } = getWeeklyVoteWindow(params.yearStart, finalWeek);

  return createCalendarEvent({
    id: params.id,
    title: params.title,
    description: params.description,
    category: "seasonal",
    act: params.act,
    month: actDef.monthEnd,
    week: finalWeek,
    startsAt,
    endsAt,
    affectedSystems: params.affectedSystems,
    tags: params.tags || ["seasonal", "climax", `act${params.act}`],
  });
}

/**
 * Build a milestone/content-drop event.
 */
export function buildMilestoneEvent(params: {
  id: string;
  title: string;
  description: string;
  week: number;
  month: number;
  affectedSystems: string[];
  yearStart: number;
  consequences?: string[];
  tags?: string[];
}): CalendarEvent {
  const { startsAt, endsAt } = getWeeklyVoteWindow(params.yearStart, params.week);
  return createCalendarEvent({
    id: params.id,
    title: params.title,
    description: params.description,
    category: "milestone",
    act: getActForWeek(params.week),
    month: params.month,
    week: params.week,
    startsAt,
    endsAt,
    affectedSystems: params.affectedSystems,
    consequences: params.consequences,
    tags: params.tags || ["milestone"],
  });
}

/**
 * Build a community challenge event.
 */
export function buildCommunityChallenge(params: {
  id: string;
  title: string;
  description: string;
  week: number;
  month: number;
  durationDays: number;
  affectedSystems: string[];
  yearStart: number;
  tags?: string[];
}): CalendarEvent {
  const { startsAt } = getWeeklyVoteWindow(params.yearStart, params.week);
  const endsAt = startsAt + params.durationDays * 24 * 60 * 60 * 1000;
  return createCalendarEvent({
    id: params.id,
    title: params.title,
    description: params.description,
    category: "community_challenge",
    act: getActForWeek(params.week),
    month: params.month,
    week: params.week,
    startsAt,
    endsAt,
    affectedSystems: params.affectedSystems,
    tags: params.tags || ["challenge", "community"],
  });
}

/* ─── CALENDAR QUERY HELPERS ─── */

/**
 * Filter and sort events for a given time window.
 */
export function getEventsInWindow(
  events: CalendarEvent[],
  from: number,
  to: number,
): CalendarEvent[] {
  return events
    .filter(
      (e) =>
        (e.startsAt >= from && e.startsAt <= to) ||
        (e.endsAt >= from && e.endsAt <= to) ||
        (e.startsAt <= from && e.endsAt >= to),
    )
    .sort((a, b) => a.startsAt - b.startsAt);
}

/**
 * Get the next N upcoming events from now.
 */
export function getNextEvents(
  events: CalendarEvent[],
  limit: number = 3,
): CalendarEvent[] {
  const now = Date.now();
  return events
    .filter((e) => e.endsAt > now)
    .sort((a, b) => a.startsAt - b.startsAt)
    .slice(0, limit);
}

/**
 * Get events grouped by act for a timeline display.
 */
export function getEventsByActGrouped(
  events: CalendarEvent[],
): Record<number, CalendarEvent[]> {
  const grouped: Record<number, CalendarEvent[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const event of events) {
    if (grouped[event.act]) {
      grouped[event.act].push(event);
    }
  }
  return grouped;
}

/**
 * Calculate the category icon hint for display.
 */
export function getCategoryIcon(category: EventCategory): string {
  switch (category) {
    case "weekly_vote": return "Vote";
    case "monthly_vote": return "Crown";
    case "daily_micro": return "Clock";
    case "seasonal": return "Sparkles";
    case "crisis": return "AlertTriangle";
    case "milestone": return "Flag";
    case "content_drop": return "Package";
    case "community_challenge": return "Users";
  }
}

/**
 * Get a human-readable label for event category.
 */
export function getCategoryLabel(category: EventCategory): string {
  switch (category) {
    case "weekly_vote": return "Weekly Vote";
    case "monthly_vote": return "Monthly Vote";
    case "daily_micro": return "Daily Micro-Vote";
    case "seasonal": return "Seasonal Event";
    case "crisis": return "Crisis Event";
    case "milestone": return "Milestone";
    case "content_drop": return "Content Drop";
    case "community_challenge": return "Community Challenge";
  }
}

/**
 * Get status color for display.
 */
export function getStatusColor(status: EventStatus): string {
  switch (status) {
    case "upcoming": return "void-text-energy";
    case "active": return "void-text-energy";
    case "completed": return "text-muted-foreground/50";
    case "skipped": return "void-text-error";
  }
}
