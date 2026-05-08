/* ═══════════════════════════════════════════════════════
   CREW STATE — load/save helpers shared across routers.

   The crew JSON blob lives at userProgress.gameData.crew
   (franchise: dischordian-saga). The crew router was the
   first reader/writer; this module factors out load/save
   so other routers (resurrection, hellbox, apprenticeTrial,
   npc-recruitment) can read/write without duplicating SQL.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  ensureCrewState,
  type CrewState,
  type SerializedCrewMember,
} from "../../shared/crewPersistence";
import { syncCrewStateToTables } from "./crewTableSync";

const FRANCHISE = "dischordian-saga";

export async function loadCrewState(userId: number): Promise<CrewState | null> {
  const db = await getDb();
  if (!db) return null;
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
  return ensureCrewState(gameData.crew as CrewState | undefined);
}

export async function saveCrewState(
  userId: number,
  state: CrewState,
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
  const next = { ...existing, crew: state };
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
  void syncCrewStateToTables(userId, state);
}

/** Add a crew member to the player's roster. Idempotent on `member.id`. */
export function addCrewMemberToState(
  state: CrewState,
  member: SerializedCrewMember,
): CrewState {
  if (state.roster.members.some((m) => m.id === member.id)) {
    return state;
  }
  return {
    ...state,
    roster: {
      ...state.roster,
      members: [...state.roster.members, member],
    },
    firstCrewMemberBorn: true,
    crewSystemUnlocked: true,
  };
}

/** Remove a crew member by id (move to deceased if dead, else just drop). */
export function removeCrewMemberFromState(
  state: CrewState,
  memberId: string,
): CrewState {
  const idx = state.roster.members.findIndex((m) => m.id === memberId);
  if (idx === -1) return state;
  const member = state.roster.members[idx];
  const remaining = state.roster.members.filter((m) => m.id !== memberId);
  if (member.status === "dead") {
    return {
      ...state,
      roster: {
        ...state.roster,
        members: remaining,
        deceased: [...state.roster.deceased, member],
      },
    };
  }
  return {
    ...state,
    roster: { ...state.roster, members: remaining },
  };
}

/** Replace a member by id (in living roster). */
export function replaceCrewMemberInState(
  state: CrewState,
  member: SerializedCrewMember,
): CrewState {
  return {
    ...state,
    roster: {
      ...state.roster,
      members: state.roster.members.map((m) =>
        m.id === member.id ? member : m,
      ),
    },
  };
}
