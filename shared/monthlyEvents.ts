/* ═══════════════════════════════════════════════════════
   MONTHLY EVENTS — Themed Event Quest System

   Each month features a themed event tied to an NPC or
   faction. Same story content available at 4 difficulty
   tiers with escalating reward multipliers. Five chapters
   per event, each with combat encounters and lore.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type EventDifficulty = "normal" | "heroic" | "master" | "legendary";

export interface EventReward {
  rewardId: string;
  rewardName: string;
  rewardType: "credits" | "shards" | "card_pack" | "cosmetic" | "lore_entry" | "exclusive_card";
  quantity: number;
  exclusiveToDifficulty: EventDifficulty | null;
}

export interface EventEncounter {
  encounterId: string;
  name: string;
  enemyIds: string[];
  recommendedPower: number;
  isBoss: boolean;
}

export interface EventChapter {
  chapterId: string;
  chapterNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  loreText: string;
  encounters: EventEncounter[];
  completionRewards: EventReward[];
}

export interface MonthlyEvent {
  eventId: string;
  name: string;
  description: string;
  themeNpc: string;
  themeFaction: string;
  month: number; // 1-12
  year: number;
  startDate: number; // epoch ms
  endDate: number;   // epoch ms
  chapters: EventChapter[];
  bannerImageKey: string;
}

export interface EventProgress {
  eventId: string;
  playerId: string;
  difficulty: EventDifficulty;
  completedChapterIds: string[];
  claimedRewardIds: string[];
  startedAt: number;
  lastPlayedAt: number;
}

/* ─── CONSTANTS ─── */

const DIFFICULTY_REWARD_MULTIPLIER: Record<EventDifficulty, number> = {
  normal: 1,
  heroic: 2,
  master: 3,
  legendary: 5,
};

const DIFFICULTY_POWER_SCALING: Record<EventDifficulty, number> = {
  normal: 1.0,
  heroic: 1.5,
  master: 2.2,
  legendary: 3.5,
};

const EVENT_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // ~30 days

/* ─── FUNCTIONS ─── */

export function getCurrentEvent(events: MonthlyEvent[]): MonthlyEvent | null {
  const now = Date.now();
  return events.find((e) => e.startDate <= now && e.endDate >= now) ?? null;
}

export function getChapterRewards(
  chapter: EventChapter,
  difficulty: EventDifficulty,
): EventReward[] {
  const multiplier = DIFFICULTY_REWARD_MULTIPLIER[difficulty];
  return chapter.completionRewards
    .filter(
      (r) => r.exclusiveToDifficulty === null || r.exclusiveToDifficulty === difficulty,
    )
    .map((r) => ({
      ...r,
      quantity: r.exclusiveToDifficulty ? r.quantity : r.quantity * multiplier,
    }));
}

export function getScaledEncounterPower(
  encounter: EventEncounter,
  difficulty: EventDifficulty,
): number {
  return Math.floor(encounter.recommendedPower * DIFFICULTY_POWER_SCALING[difficulty]);
}

export function isEventActive(event: MonthlyEvent): boolean {
  const now = Date.now();
  return event.startDate <= now && event.endDate >= now;
}

export function getEventProgress(
  progress: EventProgress,
  event: MonthlyEvent,
): { completedCount: number; totalCount: number; percentComplete: number } {
  const totalCount = event.chapters.length;
  const completedCount = progress.completedChapterIds.length;
  const percentComplete = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;
  return { completedCount, totalCount, percentComplete };
}

export function canPlayChapter(
  chapter: EventChapter,
  progress: EventProgress,
  event: MonthlyEvent,
): boolean {
  if (!isEventActive(event)) return false;
  if (progress.completedChapterIds.includes(chapter.chapterId)) return false;
  if (chapter.chapterNumber === 1) return true;
  const previousChapter = event.chapters.find(
    (c) => c.chapterNumber === (chapter.chapterNumber - 1) as EventChapter["chapterNumber"],
  );
  return previousChapter ? progress.completedChapterIds.includes(previousChapter.chapterId) : false;
}

export function createEventProgress(
  eventId: string,
  playerId: string,
  difficulty: EventDifficulty,
): EventProgress {
  return {
    eventId,
    playerId,
    difficulty,
    completedChapterIds: [],
    claimedRewardIds: [],
    startedAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
}
