/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO STORE — match-state persistence

   Persists the current match's HuntState + a thin history
   log on userProgress.gameData.huntTheHero. Same JSON-blob
   pattern as resurrectionStore — keeps the v1 migration
   footprint small and groups the data with the related
   crew / narrative state.

   Single active match per user. Once a match ends, the
   final state is moved to `pastMatches` (capped at 5 for
   replay-debug; canonical outcome lives on
   userProgress.narrativeFlags via huntOutcomeFlag()).
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import type { HuntState } from "../../shared/tcg-core/matches/huntTheHero";

const FRANCHISE = "dischordian-saga";
const MAX_PAST_MATCHES = 5;

export interface HuntTheHeroStore {
  active: HuntState | null;
  pastMatches: HuntState[];
}

const empty: HuntTheHeroStore = { active: null, pastMatches: [] };

export async function loadHuntTheHeroStore(
  userId: number,
): Promise<HuntTheHeroStore> {
  const db = await getDb();
  if (!db) return { ...empty };
  const rows = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  const gameData = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const r = (gameData.huntTheHero as HuntTheHeroStore | undefined) ?? empty;
  return {
    active: r.active ?? null,
    pastMatches: Array.isArray(r.pastMatches) ? r.pastMatches : [],
  };
}

export async function saveHuntTheHeroStore(
  userId: number,
  store: HuntTheHeroStore,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  const existing = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const next = { ...existing, huntTheHero: store };
  if (rows.length > 0) {
    await db
      .update(userProgress)
      .set({ gameData: next })
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.franchiseId, FRANCHISE),
        ),
      );
  } else {
    await db.insert(userProgress).values({
      userId,
      franchiseId: FRANCHISE,
      xp: 0,
      level: 1,
      points: 0,
      gameData: next,
    });
  }
}

/** Cap the past-matches list and prepend the new finished match. */
export function archiveFinishedMatch(
  store: HuntTheHeroStore,
  finished: HuntState,
): HuntTheHeroStore {
  return {
    active: null,
    pastMatches: [finished, ...store.pastMatches].slice(0, MAX_PAST_MATCHES),
  };
}
