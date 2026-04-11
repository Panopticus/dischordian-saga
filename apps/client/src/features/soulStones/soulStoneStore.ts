/* ═══════════════════════════════════════════════════════
   SOUL STONE STORE (Zustand)

   Dual-path corruption economy — collect violet Soul
   Stones, corrupt them (red) for demon pets, or purify
   them (gold) for divine companions. Dischordian path
   requires all three.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SoulStone,
  StoneState,
  ActiveCompanion,
  CompanionPath,
  PurificationAttempt,
} from "./types";

/* ─── CONSTANTS ─── */

const WEEKLY_CAP = 15;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const PURIFICATION_DURATION_MS = 24 * 60 * 60 * 1000;
const PURIFICATION_SUCCESS_RATE = 0.85;
const PURIFICATION_TOKEN_COST = 1;

/** Simple client-side ID generator */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Combat sources are subject to the weekly cap */
const COMBAT_SOURCES = new Set([
  "arena_victory",
  "arena_streak",
  "td_clear",
  "td_perfect",
  "fight_boss",
  "fight_elite",
  "fight_rare",
]);

function isCombatSource(source: string): boolean {
  return COMBAT_SOURCES.has(source) || source.startsWith("combat_");
}

/** Max concurrent purifications based on antiquarian trust (0-100) */
function maxConcurrentPurifications(trust: number): number {
  if (trust >= 80) return 3;
  if (trust >= 40) return 2;
  return 1;
}

/* ─── STORE INTERFACE ─── */

interface SoulStoneState {
  stones: SoulStone[];
  corruptionPoints: number;
  divineLightFragments: number;
  activeDemonPet: ActiveCompanion | null;
  activeDivineCompanion: ActiveCompanion | null;
  activeDischordian: ActiveCompanion | null;
  activePurifications: PurificationAttempt[];
  weeklyDropCount: number;
  weeklyDropResetAt: number;
  totalStonesCollected: number;
  totalCorrupted: number;
  totalPurified: number;
  totalPurificationsFailed: number;
  dismissedPets: string[];
  globalCorruption: number;
  globalPurity: number;
}

interface SoulStoneActions {
  collectStone: (source: string, state?: StoneState) => SoulStone | null;
  corruptStone: (stoneId: string) => boolean;
  startPurification: (
    stoneId: string,
    antiquarianTrust: number,
  ) => PurificationAttempt | null;
  completePurification: (attemptId: string) => { success: boolean };
  summonDemon: (demonId: string) => boolean;
  forgeDivine: (companionId: string) => boolean;
  forgeDischordian: (companionId: string) => boolean;
  dismissCompanion: (path: CompanionPath) => void;
  checkWeeklyCap: () => void;
  updateGlobalAlignment: (corruption: number, purity: number) => void;
  reset: () => void;
  /** Mark a stone as corrupted (red) — used by Soul Stone Craps
   *  when the server returns a "corrupted" outcome. */
  markStoneCorrupted: (stoneId: string) => boolean;
  /** Remove a stone from inventory entirely — used when the server
   *  returns a "consumed" outcome (loss to community pool). */
  markStoneConsumed: (stoneId: string) => boolean;
  /** Mark a stone as purified (gold). Used for craps "blessed" rolls
   *  which bypass the normal 24-hour purification flow. */
  markStonePurified: (stoneId: string) => boolean;
}

type SoulStoneStore = SoulStoneState & SoulStoneActions;

/* ─── INITIAL STATE ─── */

const INITIAL_STATE: SoulStoneState = {
  stones: [],
  corruptionPoints: 0,
  divineLightFragments: 0,
  activeDemonPet: null,
  activeDivineCompanion: null,
  activeDischordian: null,
  activePurifications: [],
  weeklyDropCount: 0,
  weeklyDropResetAt: Date.now() + WEEK_MS,
  totalStonesCollected: 0,
  totalCorrupted: 0,
  totalPurified: 0,
  totalPurificationsFailed: 0,
  dismissedPets: [],
  globalCorruption: 0,
  globalPurity: 0,
};

/* ─── STORE ─── */

export const useSoulStoneStore = create<SoulStoneStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      collectStone: (source, stoneState = "violet") => {
        const s = get();

        // Enforce weekly cap for combat sources
        if (isCombatSource(source)) {
          // Auto-reset if past the weekly window
          if (Date.now() >= s.weeklyDropResetAt) {
            set({
              weeklyDropCount: 0,
              weeklyDropResetAt: Date.now() + WEEK_MS,
            });
          } else if (s.weeklyDropCount >= WEEKLY_CAP) {
            return null;
          }
        }

        const stone: SoulStone = {
          id: generateId(),
          state: stoneState,
          source,
          collectedAt: Date.now(),
          isPurifying: false,
        };

        const updates: Partial<SoulStoneState> = {
          stones: [...get().stones, stone],
          totalStonesCollected: get().totalStonesCollected + 1,
        };

        if (isCombatSource(source)) {
          updates.weeklyDropCount = get().weeklyDropCount + 1;
        }

        set(updates);
        return stone;
      },

      corruptStone: (stoneId) => {
        const s = get();
        const idx = s.stones.findIndex(
          (st) => st.id === stoneId && st.state === "violet",
        );
        if (idx === -1) return false;

        const updated = [...s.stones];
        updated[idx] = { ...updated[idx], state: "red" };

        set({
          stones: updated,
          corruptionPoints: s.corruptionPoints + 1,
          totalCorrupted: s.totalCorrupted + 1,
        });
        return true;
      },

      startPurification: (stoneId, antiquarianTrust) => {
        const s = get();

        // Stone must be violet and not already purifying
        const stone = s.stones.find(
          (st) => st.id === stoneId && st.state === "violet" && !st.isPurifying,
        );
        if (!stone) return null;

        // Check concurrent purification limit
        const maxConcurrent = maxConcurrentPurifications(antiquarianTrust);
        if (s.activePurifications.length >= maxConcurrent) return null;

        const now = Date.now();
        const attempt: PurificationAttempt = {
          id: generateId(),
          stoneId,
          startTime: now,
          endTime: now + PURIFICATION_DURATION_MS,
          tokenCost: PURIFICATION_TOKEN_COST,
          successProbability: PURIFICATION_SUCCESS_RATE,
        };

        const updatedStones = s.stones.map((st) =>
          st.id === stoneId
            ? {
                ...st,
                isPurifying: true,
                purificationStartedAt: now,
                purificationCompletesAt: now + PURIFICATION_DURATION_MS,
              }
            : st,
        );

        set({
          stones: updatedStones,
          activePurifications: [...s.activePurifications, attempt],
        });

        return attempt;
      },

      completePurification: (attemptId) => {
        const s = get();
        const attempt = s.activePurifications.find((a) => a.id === attemptId);
        if (!attempt) return { success: false };

        const roll = Math.random();
        const success = roll < attempt.successProbability;

        let updatedStones: SoulStone[];
        const updates: Partial<SoulStoneState> = {
          activePurifications: s.activePurifications.filter(
            (a) => a.id !== attemptId,
          ),
        };

        if (success) {
          // Stone becomes gold
          updatedStones = s.stones.map((st) =>
            st.id === attempt.stoneId
              ? { ...st, state: "gold" as StoneState, isPurifying: false }
              : st,
          );
          updates.divineLightFragments = s.divineLightFragments + 1;
          updates.totalPurified = s.totalPurified + 1;
        } else {
          // Stone is destroyed
          updatedStones = s.stones.filter((st) => st.id !== attempt.stoneId);
          updates.totalPurificationsFailed = s.totalPurificationsFailed + 1;
        }

        updates.stones = updatedStones;
        set(updates);

        return { success };
      },

      summonDemon: (demonId) => {
        const s = get();
        // Default demon cost is corruptionPoints >= 3 (tier-dependent in production)
        // For now, minimum 1 corruption point required
        if (s.corruptionPoints < 1) return false;

        set({
          corruptionPoints: s.corruptionPoints - 1,
          activeDemonPet: {
            id: generateId(),
            path: "demon",
            companionId: demonId,
            equippedAt: Date.now(),
          },
        });
        return true;
      },

      forgeDivine: (companionId) => {
        const s = get();
        if (s.divineLightFragments < 1) return false;

        set({
          divineLightFragments: s.divineLightFragments - 1,
          activeDivineCompanion: {
            id: generateId(),
            path: "divine",
            companionId,
            equippedAt: Date.now(),
          },
        });
        return true;
      },

      forgeDischordian: (companionId) => {
        const s = get();

        // Need at least 1 red, 1 gold, and 1 violet stone
        const red = s.stones.find(
          (st) => st.state === "red" && !st.isPurifying,
        );
        const gold = s.stones.find(
          (st) => st.state === "gold" && !st.isPurifying,
        );
        const violet = s.stones.find(
          (st) => st.state === "violet" && !st.isPurifying,
        );

        if (!red || !gold || !violet) return false;

        // Consume the three stones
        const consumed = new Set([red.id, gold.id, violet.id]);
        set({
          stones: s.stones.filter((st) => !consumed.has(st.id)),
          activeDischordian: {
            id: generateId(),
            path: "dischordian",
            companionId,
            equippedAt: Date.now(),
          },
        });
        return true;
      },

      dismissCompanion: (path) => {
        const s = get();
        const updates: Partial<SoulStoneState> = {};

        switch (path) {
          case "demon":
            if (s.activeDemonPet) {
              updates.dismissedPets = [
                ...s.dismissedPets,
                s.activeDemonPet.companionId,
              ];
            }
            updates.activeDemonPet = null;
            break;
          case "divine":
            updates.activeDivineCompanion = null;
            break;
          case "dischordian":
            updates.activeDischordian = null;
            break;
        }

        set(updates);
      },

      checkWeeklyCap: () => {
        const now = Date.now();
        const s = get();
        if (now >= s.weeklyDropResetAt) {
          set({
            weeklyDropCount: 0,
            weeklyDropResetAt: now + WEEK_MS,
          });
        }
      },

      updateGlobalAlignment: (corruption, purity) => {
        set({
          globalCorruption: Math.max(0, Math.min(100, corruption)),
          globalPurity: Math.max(0, Math.min(100, purity)),
        });
      },

      /** Mark a stone corrupted (red) without requiring it to be
       *  violet — used for events where the corruption is imposed
       *  by the fiction (hierarchy_claims outcome in craps). */
      markStoneCorrupted: (stoneId) => {
        const s = get();
        const idx = s.stones.findIndex((st) => st.id === stoneId);
        if (idx === -1) return false;
        const updated = [...s.stones];
        updated[idx] = { ...updated[idx], state: "red", isPurifying: false };
        set({
          stones: updated,
          corruptionPoints: s.corruptionPoints + 1,
          totalCorrupted: s.totalCorrupted + 1,
        });
        return true;
      },

      /** Remove a stone from inventory entirely — used when the
       *  server says the stone was consumed (loss to pool in craps). */
      markStoneConsumed: (stoneId) => {
        const s = get();
        const stone = s.stones.find((st) => st.id === stoneId);
        if (!stone) return false;
        set({ stones: s.stones.filter((st) => st.id !== stoneId) });
        return true;
      },

      /** Instantly mark a stone purified (gold). Used for craps
       *  "blessed" rolls which skip the 24-hour purification flow. */
      markStonePurified: (stoneId) => {
        const s = get();
        const idx = s.stones.findIndex((st) => st.id === stoneId);
        if (idx === -1) return false;
        const updated = [...s.stones];
        updated[idx] = { ...updated[idx], state: "gold", isPurifying: false };
        set({
          stones: updated,
          divineLightFragments: s.divineLightFragments + 1,
          totalPurified: s.totalPurified + 1,
        });
        return true;
      },

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "dischordian-soul-stones",
      version: 1,
    },
  ),
);
