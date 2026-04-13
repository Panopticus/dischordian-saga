/* ═══════════════════════════════════════════════════════
   THE PROGRAMMER'S TIME MACHINE — Governance Timeline Service

   Lets the Architect (game developer) jump to ANY decision
   point in the Year One calendar. Every CoNexus event —
   weekly vote, monthly vote, seasonal climax — is a jumpable
   node on the timeline. The store is mutated to reflect
   the world-state at that moment in time.

   Used exclusively by the TimeMachineView in the
   Architect's Console.
   ═══════════════════════════════════════════════════════ */

import { useGovernanceStore } from "@/stores/governanceStore";
import type {
  CalendarEvent,
  ChronicleEntry,
  EngagementMetrics,
} from "@/stores/governanceStore";
import { buildVoteChronicleEntry } from "@/data/antiquarianChronicle";
import type { CommunityVote } from "@shared/governance";

/* ─── TYPES ─── */

export interface CoNexusEvent {
  id: string;
  week: number;
  month: number;
  act: number;
  title: string;
  type: "weekly_vote" | "monthly_vote" | "seasonal";
  voteId: string;
  description: string;
}

interface TimelinePosition {
  week: number;
  month: number;
  act: number;
}

/* ─── INTERNAL STATE ─── */

let currentPosition: TimelinePosition | null = null;

/** Cache of loaded year-one data (lazy) */
let _yearOneData: {
  weeklyVotes: CommunityVote[];
  monthlyVotes: CommunityVote[];
  events: CalendarEvent[];
  seasonalEvents: CalendarEvent[];
} | null = null;

/* ─── LAZY DATA LOADING ─── */

/**
 * Lazily imports the Year One event data so we don't crash if it
 * hasn't been authored yet. Returns null when unavailable.
 */
async function loadYearOneData() {
  if (_yearOneData) return _yearOneData;
  try {
    const mod = await import("@/data/yearOneEvents");
    _yearOneData = {
      weeklyVotes: mod.YEAR_ONE_WEEKLY_VOTES ?? [],
      monthlyVotes: mod.YEAR_ONE_MONTHLY_VOTES ?? [],
      events: mod.YEAR_ONE_EVENTS ?? [],
      seasonalEvents: mod.YEAR_ONE_SEASONAL_EVENTS ?? [],
    };
    return _yearOneData;
  } catch {
    return null;
  }
}

/**
 * Synchronous getter — returns cached data or empty fallback.
 * Must call `loadYearOneData()` at least once before relying on this.
 */
function getYearOneDataSync() {
  return (
    _yearOneData ?? {
      weeklyVotes: [] as CommunityVote[],
      monthlyVotes: [] as CommunityVote[],
      events: [] as CalendarEvent[],
      seasonalEvents: [] as CalendarEvent[],
    }
  );
}

/* ─── HELPERS ─── */

function weekToAct(week: number): number {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  if (week <= 39) return 3;
  return 4;
}

function weekToMonth(week: number): number {
  return Math.min(12, Math.ceil(week / 4.33));
}

/** Deterministic but varied pseudo-random from a seed string */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
}

/** Pick a random element using a seed */
function seededPick<T>(arr: T[], seed: string): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

/**
 * Generate scaled engagement metrics for a given week.
 * Numbers grow as the game "ages" to simulate organic growth.
 */
function generateMetricsForWeek(week: number): EngagementMetrics {
  const r = () => Math.floor(Math.random() * 400) - 200;
  const growthFactor = 1 + week * 0.06; // 6% growth per week

  return {
    totalKills: Math.floor(week * 1200 * growthFactor + r()),
    totalMissions: Math.floor(week * 340 * growthFactor + r()),
    totalVotesCast: Math.floor(week * 85 * growthFactor + r()),
    activePlayers: Math.floor(200 + week * 55 * growthFactor + r()),
    resourcesGathered: Math.floor(week * 2800 * growthFactor + r()),
    cardsForged: Math.floor(week * 90 * growthFactor + r()),
    specimensEvolved: Math.floor(week * 12 * growthFactor + r()),
    chessMatesDelivered: Math.floor(week * 30 * growthFactor + r()),
    towerWavesCleared: Math.floor(week * 150 * growthFactor + r()),
    tradeVolumeCredits: Math.floor(week * 45000 * growthFactor + r()),
    loredexEntriesRead: Math.floor(week * 420 * growthFactor + r()),
    musicTracksPlayed: Math.floor(week * 610 * growthFactor + r()),
    trustPointsEarned: Math.floor(week * 380 * growthFactor + r()),
    deathCount: Math.floor(week * 900 * growthFactor + r()),
    betrayalsTriggered: Math.floor(week * 8 * growthFactor + r()),
    secretsDiscovered: Math.floor(week * 18 * growthFactor + r()),
  };
}

/**
 * Generate a fake vote tally for a given vote with plausible-looking numbers.
 */
function generateFakeTally(
  vote: CommunityVote,
  week: number,
): Record<string, number> {
  const tally: Record<string, number> = {};
  const baseVotes = Math.floor(150 + week * 20 + Math.random() * 100);

  vote.options.forEach((opt, i) => {
    // First option typically gets more, rest distributed randomly
    const weight = i === 0 ? 0.35 : 0.65 / (vote.options.length - 1);
    const jitter = (Math.random() - 0.5) * 0.15;
    tally[opt.id] = Math.max(
      5,
      Math.floor(baseVotes * (weight + jitter)),
    );
  });

  return tally;
}

/**
 * Simulate a random winning option for a past vote.
 * Uses seeded random so results are deterministic per vote.
 */
function pickRandomWinner(vote: CommunityVote): string {
  return seededPick(vote.options, vote.id).id;
}

/* ─── PUBLIC API ─── */

/**
 * Extract every vote from the Year One calendar as a jumpable CoNexus Event.
 * Combines weekly + monthly + seasonal votes into a sorted timeline.
 */
export function getAllCoNexusEvents(): CoNexusEvent[] {
  const data = getYearOneDataSync();
  const events: CoNexusEvent[] = [];

  // Weekly votes
  for (const vote of data.weeklyVotes) {
    events.push({
      id: `cnx_weekly_${vote.id}`,
      week: vote.week,
      month: vote.month,
      act: weekToAct(vote.week),
      title: vote.question,
      type: "weekly_vote",
      voteId: vote.id,
      description: vote.antiquarianIntro.slice(0, 120) + "...",
    });
  }

  // Monthly votes
  for (const vote of data.monthlyVotes) {
    events.push({
      id: `cnx_monthly_${vote.id}`,
      week: vote.week,
      month: vote.month,
      act: weekToAct(vote.week),
      title: vote.question,
      type: "monthly_vote",
      voteId: vote.id,
      description: vote.antiquarianIntro.slice(0, 120) + "...",
    });
  }

  // Seasonal events that have an attached vote
  for (const evt of data.seasonalEvents) {
    if (evt.voteId) {
      events.push({
        id: `cnx_seasonal_${evt.id}`,
        week: evt.week,
        month: evt.month,
        act: evt.act,
        title: evt.title,
        type: "seasonal",
        voteId: evt.voteId,
        description: evt.description.slice(0, 120) + "...",
      });
    }
  }

  // Sort by week, then month
  events.sort((a, b) => a.week - b.week || a.month - b.month);
  return events;
}

/**
 * Jump the governance store to the moment in time represented by
 * the given CoNexus event. Sets calendar event statuses, active vote,
 * fake tallies, chronicle entries, and metrics.
 */
export async function jumpToEvent(eventId: string): Promise<void> {
  // Ensure data is loaded
  await loadYearOneData();

  const allEvents = getAllCoNexusEvents();
  const target = allEvents.find((e) => e.id === eventId);
  if (!target) {
    throw new Error(`CoNexus event not found: ${eventId}`);
  }

  const store = useGovernanceStore.getState();
  const data = getYearOneDataSync();

  // Find the vote for the target event
  const allVotes = [...data.weeklyVotes, ...data.monthlyVotes];
  const targetVote = allVotes.find((v) => v.id === target.voteId);

  // 1. Update calendar event statuses
  const allCalendarEvents = [...data.events, ...data.seasonalEvents];
  const updatedEvents: CalendarEvent[] = allCalendarEvents.map((evt) => {
    if (evt.week < target.week) {
      return { ...evt, status: "completed" as const };
    } else if (
      evt.week === target.week &&
      evt.id === (target.id.replace(/^cnx_(weekly|monthly|seasonal)_/, ""))
    ) {
      return { ...evt, status: "active" as const };
    } else if (evt.week === target.week) {
      return { ...evt, status: "active" as const };
    } else {
      return { ...evt, status: "upcoming" as const };
    }
  });
  store.setCalendarEvents(updatedEvents);

  // 2. Set the active vote
  if (targetVote) {
    store.setActiveVote(targetVote);
    store.updateTally(generateFakeTally(targetVote, target.week));
  }

  // 3. Generate chronicle entries for all "past" events
  const pastEvents = allEvents.filter((e) => e.week < target.week);
  const chronicleEntries: ChronicleEntry[] = [];

  for (const pastEvt of pastEvents) {
    const pastVote = allVotes.find((v) => v.id === pastEvt.voteId);
    if (!pastVote) continue;

    const winnerId = pickRandomWinner(pastVote);
    const winnerOpt = pastVote.options.find((o) => o.id === winnerId);
    const fakeMetrics = generateMetricsForWeek(pastEvt.week);

    chronicleEntries.push(
      buildVoteChronicleEntry({
        id: `chronicle_tm_${pastEvt.id}`,
        week: pastEvt.week,
        month: pastEvt.month,
        act: pastEvt.act,
        type: pastEvt.type === "monthly_vote" ? "monthly" : "weekly",
        title: pastEvt.title,
        voteQuestion: pastVote.question,
        winningOptionLabel: winnerOpt?.label ?? "Unknown",
        totalVotes: Math.floor(
          150 + pastEvt.week * 20 + seededRandom(pastEvt.id) * 100,
        ),
        consequences: winnerOpt?.consequences ?? [],
        metrics: {
          totalKills: fakeMetrics.totalKills,
          totalMissions: fakeMetrics.totalMissions,
          activePlayers: fakeMetrics.activePlayers,
        },
      }),
    );
  }

  store.setChronicleEntries(chronicleEntries);

  // 4. Set current metrics
  const currentMetrics = generateMetricsForWeek(target.week);
  store.updateMetrics(currentMetrics);

  // 5. Push 7-day metrics history
  for (let d = 6; d >= 0; d--) {
    const dayWeek = Math.max(1, target.week - (d / 7));
    const dayMetrics = generateMetricsForWeek(dayWeek);
    const dateStr = `W${target.week}-D${7 - d}`;
    // Manually push — store only keeps last 7
    store.pushMetricsSnapshot(dateStr);
    // Update metrics before snapshot so each snapshot is different
    if (d > 0) {
      store.updateMetrics(generateMetricsForWeek(dayWeek - 0.5));
    }
  }
  // Restore current metrics after history push
  store.updateMetrics(currentMetrics);

  // 6. Update internal position
  currentPosition = {
    week: target.week,
    month: target.month,
    act: target.act,
  };
}

/**
 * Simulate a specific option winning a specific vote.
 * Useful for testing branching narrative paths.
 */
export async function simulateOutcome(
  voteId: string,
  winningOptionId: string,
): Promise<void> {
  await loadYearOneData();

  const data = getYearOneDataSync();
  const allVotes = [...data.weeklyVotes, ...data.monthlyVotes];
  const vote = allVotes.find((v) => v.id === voteId);

  if (!vote) {
    throw new Error(`Vote not found: ${voteId}`);
  }

  const winnerOpt = vote.options.find((o) => o.id === winningOptionId);
  if (!winnerOpt) {
    throw new Error(`Option not found: ${winningOptionId} in vote ${voteId}`);
  }

  const store = useGovernanceStore.getState();
  const pos = currentPosition ?? { week: vote.week, month: vote.month, act: weekToAct(vote.week) };

  // Generate a tally that makes this option the winner
  const tally: Record<string, number> = {};
  const baseVotes = Math.floor(200 + pos.week * 25);

  vote.options.forEach((opt) => {
    if (opt.id === winningOptionId) {
      tally[opt.id] = Math.floor(baseVotes * 0.55 + Math.random() * 50);
    } else {
      tally[opt.id] = Math.floor(
        (baseVotes * 0.45) / (vote.options.length - 1) + Math.random() * 30,
      );
    }
  });

  store.updateTally(tally);

  // Add a chronicle entry for this outcome
  const fakeMetrics = generateMetricsForWeek(pos.week);
  const totalVotes = Object.values(tally).reduce((s, n) => s + n, 0);

  const entry = buildVoteChronicleEntry({
    id: `chronicle_sim_${voteId}_${winningOptionId}`,
    week: pos.week,
    month: pos.month,
    act: pos.act,
    type: vote.category === "monthly" ? "monthly" : "weekly",
    title: `Simulated: ${vote.question}`,
    voteQuestion: vote.question,
    winningOptionLabel: winnerOpt.label,
    totalVotes,
    consequences: winnerOpt.consequences,
    metrics: {
      totalKills: fakeMetrics.totalKills,
      totalMissions: fakeMetrics.totalMissions,
      activePlayers: fakeMetrics.activePlayers,
    },
  });

  store.addChronicleEntry(entry);
}

/**
 * Reset the governance store and timeline position to initial state.
 */
export function resetTimeline(): void {
  const store = useGovernanceStore.getState();
  store.reset();
  currentPosition = null;
  _yearOneData = null; // force re-import on next use
}

/**
 * Get the current timeline position, or null if not jumped.
 */
export function getCurrentTimelinePosition(): TimelinePosition | null {
  return currentPosition ? { ...currentPosition } : null;
}

/**
 * Pre-load the Year One data. Call this on mount to ensure
 * synchronous access later.
 */
export async function preloadTimeline(): Promise<boolean> {
  const data = await loadYearOneData();
  return data !== null;
}
