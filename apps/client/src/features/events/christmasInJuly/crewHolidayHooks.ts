/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Crew System Hooks

   Exposes the crew holiday data (gift exchanges, casino
   events, festive emergencies, bloodline bonuses) as
   callable helpers so any crew feed / morale service can
   pull festive content while the event is active.

   The crew system proper does not yet exist in code; this
   file is intentionally framework-agnostic so it can be
   consumed once a crew service lands.
   ═══════════════════════════════════════════════════════ */
import {
  CREW_HOLIDAY_MORALE,
  CREW_GIFT_EXCHANGES, type CrewGiftEvent,
  CREW_CASINO_EVENTS, type CrewCasinoEvent,
  CREW_HOLIDAY_DANGERS, type CrewHolidayDanger,
  BLOODLINE_HOLIDAY_BONUSES, type BloodlineHolidayBonus,
  ROLE_HOLIDAY_BONUSES, type RoleHolidayBonus,
} from "@/data/events/christmasInJuly/crewHoliday";
import { CHRISTMAS_EVENT_CONFIG } from "@/data/events/christmasInJuly/eventConfig";

/** Simple deterministic pick — consumers that want seeded selection
 *  can pass a `rng` function; otherwise Math.random is used. */
function pickRandom<T>(items: T[], rng: () => number = Math.random): T {
  if (items.length === 0) throw new Error("Cannot pick from an empty array.");
  return items[Math.floor(rng() * items.length)];
}

/** True when the current wall clock is within the event window. */
export function isChristmasActive(now: Date = new Date()): boolean {
  return now.getTime() >= new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime() &&
         now.getTime() <= new Date(CHRISTMAS_EVENT_CONFIG.endDate).getTime();
}

/** Render a gift event's feed text with the actual participant names. */
export function renderCrewGiftFeed(
  event: CrewGiftEvent,
  gifterName: string,
  recipientName: string,
): string {
  return event.feedText.replace("[GIFTER]", gifterName).replace("[RECIPIENT]", recipientName);
}

/** Render a casino event feed with the crew member name. */
export function renderCrewCasinoFeed(event: CrewCasinoEvent, crewName: string): string {
  return event.feedText.replace(/\[CREW_NAME\]/g, crewName);
}

/**
 * Roll for a random daily crew gift exchange.
 * Respects `crewGiftExchangeChance` in the event config.
 */
export function rollCrewGiftExchange(rng: () => number = Math.random): CrewGiftEvent | null {
  if (rng() > CHRISTMAS_EVENT_CONFIG.crewIntegration.crewGiftExchangeChance) return null;
  return pickRandom(CREW_GIFT_EXCHANGES, rng);
}

/** Roll for a random crew casino event. */
export function rollCrewCasinoEvent(rng: () => number = Math.random): CrewCasinoEvent | null {
  if (rng() > CHRISTMAS_EVENT_CONFIG.crewIntegration.crewCasinoEventChance) return null;
  return pickRandom(CREW_CASINO_EVENTS, rng);
}

/** Roll for a festive emergency — these trigger the crew danger prompts. */
export function rollCrewHolidayDanger(rng: () => number = Math.random): CrewHolidayDanger | null {
  if (rng() > CHRISTMAS_EVENT_CONFIG.crewIntegration.crewDangerChance) return null;
  return pickRandom(CREW_HOLIDAY_DANGERS, rng);
}

/** Lookup a crew member's bloodline bonus, if any. */
export function getBloodlineHolidayBonus(bloodlineId: string): BloodlineHolidayBonus | null {
  return BLOODLINE_HOLIDAY_BONUSES.find(b => b.bloodlineId === bloodlineId) ?? null;
}

/** Lookup a crew member's role bonus, if any. */
export function getRoleHolidayBonus(roleId: string): RoleHolidayBonus | null {
  return ROLE_HOLIDAY_BONUSES.find(r => r.roleId === roleId) ?? null;
}

/**
 * Sum up the morale delta that a crew should apply while the event
 * is active, given a snapshot of the player's current stats.
 */
export function calculateCrewHolidayMorale(input: {
  giftsSentToday: number;
  milestonesReached: number;
  dailyGamblingLosses: number;
  currentChallengeStreak: number;
}): number {
  let delta = CREW_HOLIDAY_MORALE.baseBoost;
  delta += input.giftsSentToday * CREW_HOLIDAY_MORALE.perGiftSent;
  delta += input.milestonesReached * CREW_HOLIDAY_MORALE.perMilestone;
  if (input.dailyGamblingLosses >= 50) delta += CREW_HOLIDAY_MORALE.gamblingPenalty;
  delta += Math.min(14, input.currentChallengeStreak) * CREW_HOLIDAY_MORALE.streakBonus;
  return delta;
}

/** Composite feed builder — pulls a variety of entries for the day. */
export function buildDailyCrewHolidayFeed(opts: {
  gifterName: string;
  recipientName: string;
  crewName: string;
  rng?: () => number;
}): string[] {
  const rng = opts.rng ?? Math.random;
  const feed: string[] = [];
  const gift = rollCrewGiftExchange(rng);
  if (gift) feed.push(renderCrewGiftFeed(gift, opts.gifterName, opts.recipientName));
  const casino = rollCrewCasinoEvent(rng);
  if (casino) feed.push(renderCrewCasinoFeed(casino, opts.crewName));
  const danger = rollCrewHolidayDanger(rng);
  if (danger) feed.push(danger.description.replace(/\[CREW_NAME\]/g, opts.crewName));
  return feed;
}
