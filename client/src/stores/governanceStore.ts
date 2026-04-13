/* ═══════════════════════════════════════════════════════
   GOVERNANCE STORE (Zustand)

   Community voting, Antiquarian's Chronicle, engagement
   metrics, and the Year One events calendar. Powers the
   Governance Hub — the living democracy of Ark 1047.

   Use `useGovernanceStore(s => s.activeVote)` to subscribe
   to just the active vote — component will not re-render
   when chronicle or metrics change.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CommunityVote,
  VoteResult,
  DailyResourceVote,
  AntiquarianTomeEntry,
} from "@shared/governance";

/* ─── EVENTS CALENDAR TYPES ─── */

export type EventCategory =
  | "weekly_vote"
  | "monthly_vote"
  | "daily_micro"
  | "seasonal"
  | "crisis"
  | "milestone"
  | "content_drop"
  | "community_challenge";

export type EventStatus = "upcoming" | "active" | "completed" | "skipped";

export interface CalendarEvent {
  id: string;
  /** Display title */
  title: string;
  /** Rich description — the Antiquarian's framing */
  description: string;
  /** Which category drives scheduling & UI treatment */
  category: EventCategory;
  /** Current lifecycle state */
  status: EventStatus;
  /** Year-one act (1-4) this event belongs to */
  act: number;
  /** Month within the year (1-12) */
  month: number;
  /** Week within the year (1-52) */
  week: number;
  /** Day within the week (1-7, Mon=1) — optional for weekly+ events */
  day?: number;
  /** UTC timestamp when the event opens / becomes visible */
  startsAt: number;
  /** UTC timestamp when the event closes */
  endsAt: number;
  /** The CommunityVote attached to this event, if any */
  voteId?: string;
  /** Game systems this event touches */
  affectedSystems: string[];
  /** Narrative consequences once resolved */
  consequences?: string[];
  /** Tags for filtering */
  tags: string[];
}

/* ─── CHRONICLE ENTRY (enriched for the store) ─── */

export interface ChronicleEntry {
  id: string;
  week: number;
  month: number;
  act: number;
  type: "weekly" | "monthly" | "seasonal" | "milestone";
  title: string;
  /** Antiquarian's voice — 2-4 paragraphs */
  narrativeText: string;
  voteQuestion?: string;
  voteResult?: string;
  consequences: string[];
  engagementSnapshot: {
    totalVotes: number;
    totalKills: number;
    totalMissions: number;
    activePlayers: number;
  };
  timestamp: number;
}

/* ─── ENGAGEMENT METRICS ─── */

export interface EngagementMetrics {
  totalKills: number;
  totalMissions: number;
  totalVotesCast: number;
  activePlayers: number;
  resourcesGathered: number;
  cardsForged: number;
  specimensEvolved: number;
  chessMatesDelivered: number;
  towerWavesCleared: number;
  tradeVolumeCredits: number;
  loredexEntriesRead: number;
  musicTracksPlayed: number;
  trustPointsEarned: number;
  deathCount: number;
  betrayalsTriggered: number;
  secretsDiscovered: number;
}

export type MetricTrend = "up" | "down" | "stable";

export interface MetricSnapshot {
  current: number;
  previous: number;
  trend: MetricTrend;
}

/* ─── PLAYER VOTE RECORD ─── */

interface PlayerVoteRecord {
  voteId: string;
  optionId: string;
  castAt: number;
}

interface PlayerDailyVoteRecord {
  date: string;
  choice: "a" | "b";
}

/* ─── STORE SHAPE ─── */

interface GovernanceStore {
  /* ── Active voting state ── */
  /** The currently-open community vote (null if none) */
  activeVote: CommunityVote | null;
  /** Live tally for the active vote (real votes only) */
  voteTally: Record<string, number>;
  /** This player's cast votes (persisted) */
  playerVotes: PlayerVoteRecord[];
  /** This player's daily micro-votes (persisted) */
  playerDailyVotes: PlayerDailyVoteRecord[];

  /* ── Results archive ── */
  voteResults: VoteResult[];

  /* ── Chronicle ── */
  chronicleEntries: ChronicleEntry[];
  /** Antiquarian tome entries (raw, from shared type) */
  tomeEntries: AntiquarianTomeEntry[];

  /* ── Engagement ── */
  metrics: EngagementMetrics;
  /** 7-day history for sparklines (one snapshot per day) */
  metricsHistory: Array<{ date: string; metrics: EngagementMetrics }>;

  /* ── Events calendar ── */
  calendarEvents: CalendarEvent[];

  /* ── Actions ── */
  setActiveVote: (vote: CommunityVote | null) => void;
  castVote: (voteId: string, optionId: string) => void;
  castDailyVote: (date: string, choice: "a" | "b") => void;
  updateTally: (tally: Record<string, number>) => void;
  addVoteResult: (result: VoteResult) => void;
  addChronicleEntry: (entry: ChronicleEntry) => void;
  addTomeEntry: (entry: AntiquarianTomeEntry) => void;
  setTomeEntries: (entries: AntiquarianTomeEntry[]) => void;
  setChronicleEntries: (entries: ChronicleEntry[]) => void;
  updateMetrics: (partial: Partial<EngagementMetrics>) => void;
  pushMetricsSnapshot: (date: string) => void;
  setCalendarEvents: (events: CalendarEvent[]) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  getPlayerVote: (voteId: string) => string | null;
  getPlayerDailyVote: (date: string) => "a" | "b" | null;
  getUpcomingEvents: (limit?: number) => CalendarEvent[];
  getActiveEvents: () => CalendarEvent[];
  getEventsByAct: (act: number) => CalendarEvent[];
  getEventsByMonth: (month: number) => CalendarEvent[];
  reset: () => void;
}

/* ─── INITIAL STATE ─── */

const EMPTY_METRICS: EngagementMetrics = {
  totalKills: 0,
  totalMissions: 0,
  totalVotesCast: 0,
  activePlayers: 0,
  resourcesGathered: 0,
  cardsForged: 0,
  specimensEvolved: 0,
  chessMatesDelivered: 0,
  towerWavesCleared: 0,
  tradeVolumeCredits: 0,
  loredexEntriesRead: 0,
  musicTracksPlayed: 0,
  trustPointsEarned: 0,
  deathCount: 0,
  betrayalsTriggered: 0,
  secretsDiscovered: 0,
};

const INITIAL_STATE = {
  activeVote: null as CommunityVote | null,
  voteTally: {} as Record<string, number>,
  playerVotes: [] as PlayerVoteRecord[],
  playerDailyVotes: [] as PlayerDailyVoteRecord[],
  voteResults: [] as VoteResult[],
  chronicleEntries: [] as ChronicleEntry[],
  tomeEntries: [] as AntiquarianTomeEntry[],
  metrics: { ...EMPTY_METRICS },
  metricsHistory: [] as Array<{ date: string; metrics: EngagementMetrics }>,
  calendarEvents: [] as CalendarEvent[],
};

/* ─── STORE ─── */

export const useGovernanceStore = create<GovernanceStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      /* ── Vote actions ── */

      setActiveVote: (vote) => set({ activeVote: vote }),

      castVote: (voteId, optionId) =>
        set((s) => ({
          playerVotes: [
            ...s.playerVotes,
            { voteId, optionId, castAt: Date.now() },
          ],
          voteTally: {
            ...s.voteTally,
            [optionId]: (s.voteTally[optionId] || 0) + 1,
          },
          metrics: {
            ...s.metrics,
            totalVotesCast: s.metrics.totalVotesCast + 1,
          },
        })),

      castDailyVote: (date, choice) =>
        set((s) => ({
          playerDailyVotes: [...s.playerDailyVotes, { date, choice }],
        })),

      updateTally: (tally) => set({ voteTally: tally }),

      addVoteResult: (result) =>
        set((s) => ({
          voteResults: [...s.voteResults, result],
        })),

      /* ── Chronicle actions ── */

      addChronicleEntry: (entry) =>
        set((s) => ({
          chronicleEntries: [...s.chronicleEntries, entry],
        })),

      addTomeEntry: (entry) =>
        set((s) => ({
          tomeEntries: [...s.tomeEntries, entry],
        })),

      setTomeEntries: (entries) => set({ tomeEntries: entries }),
      setChronicleEntries: (entries) => set({ chronicleEntries: entries }),

      /* ── Engagement actions ── */

      updateMetrics: (partial) =>
        set((s) => ({
          metrics: { ...s.metrics, ...partial },
        })),

      pushMetricsSnapshot: (date) =>
        set((s) => ({
          metricsHistory: [
            ...s.metricsHistory.slice(-6), // Keep last 7 days
            { date, metrics: { ...s.metrics } },
          ],
        })),

      /* ── Calendar actions ── */

      setCalendarEvents: (events) => set({ calendarEvents: events }),

      addCalendarEvent: (event) =>
        set((s) => ({
          calendarEvents: [...s.calendarEvents, event],
        })),

      updateEventStatus: (eventId, status) =>
        set((s) => ({
          calendarEvents: s.calendarEvents.map((e) =>
            e.id === eventId ? { ...e, status } : e,
          ),
        })),

      /* ── Derived getters ── */

      getPlayerVote: (voteId) => {
        const record = get().playerVotes.find((v) => v.voteId === voteId);
        return record?.optionId ?? null;
      },

      getPlayerDailyVote: (date) => {
        const record = get().playerDailyVotes.find((v) => v.date === date);
        return record?.choice ?? null;
      },

      getUpcomingEvents: (limit = 3) => {
        const now = Date.now();
        return get()
          .calendarEvents.filter(
            (e) => e.status === "upcoming" && e.startsAt > now,
          )
          .sort((a, b) => a.startsAt - b.startsAt)
          .slice(0, limit);
      },

      getActiveEvents: () =>
        get().calendarEvents.filter((e) => e.status === "active"),

      getEventsByAct: (act) =>
        get().calendarEvents.filter((e) => e.act === act),

      getEventsByMonth: (month) =>
        get().calendarEvents.filter((e) => e.month === month),

      /* ── Reset ── */

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "dischordian-governance",
      version: 1,
    },
  ),
);
