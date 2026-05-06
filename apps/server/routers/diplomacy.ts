/* ═══════════════════════════════════════════════════════
   DIPLOMACY ROUTER — player ↔ NPC faction primitives

   Plan §C3 (full). Wraps the pure helpers in apps/shared/
   diplomacy.ts as tRPC procedures. Per-player relationship
   state lives inside userProgress.gameData.diplomacy
   (keyed by faction) so no DB migration is needed.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  applyAction,
  defaultRelationship,
  reactionLine,
  relationFor,
  type DiplomacyFaction,
  type RelationshipState,
} from "../../shared/diplomacy";

const factionSchema = z.enum([
  "architect",
  "insurgency",
  "new_babylon",
  "hierarchy_of_damned",
  "antiquarian",
  "thought_virus",
]);

const actionSchema = z.enum([
  "propose_treaty",
  "accept_treaty",
  "break_treaty",
  "declare_war",
  "embargo",
  "lift_embargo",
]);

type DiplomacyMap = Record<string, RelationshipState | undefined>;

async function loadGameData(userId: number): Promise<{
  raw: Record<string, unknown>;
  map: DiplomacyMap;
}> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  }
  const row = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const raw = (row[0]?.gameData ?? {}) as Record<string, unknown>;
  const map = (raw.diplomacy ?? {}) as DiplomacyMap;
  return { raw, map };
}

async function saveDiplomacy(userId: number, raw: Record<string, unknown>, map: DiplomacyMap) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(userProgress)
    .set({ gameData: { ...raw, diplomacy: map } })
    .where(eq(userProgress.userId, userId));
}

function getOrInit(map: DiplomacyMap, faction: DiplomacyFaction): RelationshipState {
  return map[faction] ?? defaultRelationship(faction);
}

export const diplomacyRouter = router({
  /** All factions' relationship state for the current player. Initial
   *  values for unconfigured factions come from defaultRelationship. */
  getStandings: protectedProcedure.query(async ({ ctx }) => {
    const { map } = await loadGameData(ctx.user.id);
    const factions: DiplomacyFaction[] = [
      "architect",
      "insurgency",
      "new_babylon",
      "hierarchy_of_damned",
      "antiquarian",
      "thought_virus",
    ];
    return factions.map((faction) => {
      const state = getOrInit(map, faction);
      return { ...state, relation: relationFor(state) };
    });
  }),

  /** Apply a diplomatic action. Returns the updated relationship state
   *  + the canned faction reaction line if one is seeded. */
  applyAction: protectedProcedure
    .input(z.object({ faction: factionSchema, action: actionSchema }))
    .mutation(async ({ ctx, input }) => {
      const { raw, map } = await loadGameData(ctx.user.id);
      const before = getOrInit(map, input.faction);
      const result = applyAction(before, input.action);
      if (!result.ok) {
        return { ok: false as const, error: result.error };
      }
      map[input.faction] = result.state;
      await saveDiplomacy(ctx.user.id, raw, map);
      return {
        ok: true as const,
        state: { ...result.state, relation: relationFor(result.state) },
        reaction: reactionLine(input.faction, input.action),
      };
    }),
});
