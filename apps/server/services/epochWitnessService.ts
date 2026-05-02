/* Epoch Witness Service — campaign state machine + vote processing */
import { eq, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import { epochVotes, epochVoteTallies, playerEpochProgress, shadowTongueState } from "../../db/schema";
import { logger } from "../logger";
import { ripple } from "./rippleEngine";
import { AGE_OF_PRIVACY_VOTES, AGE_OF_PROPHECY_VOTES, isVoteUnlocked, unlockedVotes } from "@shared/epochWitnessVotes";
import { AGE_OF_INSURGENCY_VOTES, AGE_OF_REVELATION_VOTES, FALL_OF_REALITY_VOTES } from "@shared/epochWitnessVotesLate";
import type { NexusPointVote } from "@shared/epochWitnessVotes";
import {
  type ActiveEdit,
  type ActiveEdits,
  clearEdit as clearEditPure,
  parseActiveEdits,
  recordEdit as recordEditPure,
  serializeActiveEdits,
} from "@shared/shadowTongueEdits";

const ALL_VOTES: NexusPointVote[] = [
  ...AGE_OF_PRIVACY_VOTES, ...AGE_OF_PROPHECY_VOTES,
  ...AGE_OF_INSURGENCY_VOTES, ...AGE_OF_REVELATION_VOTES, ...FALL_OF_REALITY_VOTES,
];

export type CastVoteResult = { success: boolean; reason?: "locked" | "unknown_vote" | "invalid_option" | "duplicate" | "no_db"; tally?: Record<string, number> };

export const epochWitnessService = {
  async castVote(
    userId: number,
    voteId: string,
    optionChosen: string,
    narrativeFlags?: Record<string, boolean>,
  ): Promise<CastVoteResult> {
    const db = await getDb();
    if (!db) return { success: false, reason: "no_db" };
    const voteDef = ALL_VOTES.find(v => v.id === voteId);
    if (!voteDef) return { success: false, reason: "unknown_vote" };
    // Honour the lockedUntil narrative-flag gate declared in the vote
    // definition (e.g. "welcome_to_celebration_conexus_complete"). The
    // CoNexus Tome system raises these flags on completion; the
    // Loredex / Iron Lion / Agent Zero arcs raise the others. Reject
    // here so a client that hasn't reached the prerequisite can't
    // shortcut the campaign by hand-crafting a tRPC call.
    if (!isVoteUnlocked(voteDef, narrativeFlags)) return { success: false, reason: "locked" };
    const validOptions = voteDef.options.map(o => o.id);
    if (!validOptions.includes(optionChosen)) return { success: false, reason: "invalid_option" };

    try {
      await db.insert(epochVotes).values({ voteId, epoch: voteDef.epoch, userId, optionChosen });
    } catch (e: unknown) {
      if ((e as Record<string, unknown>)?.code === "ER_DUP_ENTRY") return { success: false, reason: "duplicate" };
      throw e;
    }

    const optionCol = `option${optionChosen.toUpperCase()}Count` as const;
    await db.insert(epochVoteTallies).values({ voteId, totalVotes: 1, [optionCol]: 1 })
      .onDuplicateKeyUpdate({ set: { totalVotes: sql`${epochVoteTallies.totalVotes} + 1`, [optionCol]: sql`${(epochVoteTallies as unknown as Record<string, unknown>)[optionCol]} + 1` } });

    await db.insert(playerEpochProgress).values({ userId, epochsVoted: { [voteDef.epoch]: [voteId] } })
      .onDuplicateKeyUpdate({ set: { epochsVoted: sql`JSON_SET(COALESCE(${playerEpochProgress.epochsVoted}, '{}'), '$."${sql.raw(voteDef.epoch)}"', JSON_ARRAY_APPEND(COALESCE(JSON_EXTRACT(${playerEpochProgress.epochsVoted}, '$."${sql.raw(voteDef.epoch)}"'), JSON_ARRAY()), '$', ${voteId}))` } })
      .catch(() => { /* best effort */ });

    try {
      await ripple.emit("epoch_vote_cast", { userId, voteId, epoch: voteDef.epoch, optionChosen });
    } catch (err) { logger.error("[epochWitness] ripple failed", err); }

    const [tally] = await db.select().from(epochVoteTallies).where(eq(epochVoteTallies.voteId, voteId)).limit(1);
    return { success: true, tally: tally ? { a: tally.optionACount, b: tally.optionBCount, c: tally.optionCCount, d: tally.optionDCount, e: tally.optionECount, total: tally.totalVotes } : undefined };
  },

  async getTally(voteId: string) {
    const db = await getDb();
    if (!db) return null;
    const [tally] = await db.select().from(epochVoteTallies).where(eq(epochVoteTallies.voteId, voteId)).limit(1);
    return tally ?? null;
  },

  async getPlayerProgress(userId: number) {
    const db = await getDb();
    if (!db) return null;
    const [progress] = await db.select().from(playerEpochProgress).where(eq(playerEpochProgress.userId, userId)).limit(1);
    return progress ?? null;
  },

  async getShadowTonguePower(): Promise<number> {
    const db = await getDb();
    if (!db) return 0;
    const [state] = await db.select().from(shadowTongueState).where(eq(shadowTongueState.id, 1)).limit(1);
    return state?.powerLevel ?? 0;
  },

  async adjustShadowTonguePower(delta: number): Promise<number> {
    const db = await getDb();
    if (!db) return 0;
    await db.update(shadowTongueState).set({ powerLevel: sql`LEAST(100, GREATEST(0, ${shadowTongueState.powerLevel} + ${delta}))`, lastUpdated: new Date() }).where(eq(shadowTongueState.id, 1));
    return this.getShadowTonguePower();
  },

  /** Full Shadow Tongue state read — power, activeEdits map, grandEditActive,
   *  lastUpdated. Powers the CorruptibleBio crossout overlay and the
   *  uncorruption-bench combine UI. Returns safe defaults when the DB row
   *  is missing (e.g. fresh install, in-memory test). */
  async getShadowTongueState(): Promise<{
    power: number;
    activeEdits: ActiveEdits;
    grandEditActive: boolean;
    lastUpdated: Date | null;
  }> {
    const db = await getDb();
    if (!db) {
      return { power: 0, activeEdits: {}, grandEditActive: false, lastUpdated: null };
    }
    const [state] = await db.select().from(shadowTongueState).where(eq(shadowTongueState.id, 1)).limit(1);
    if (!state) {
      return { power: 0, activeEdits: {}, grandEditActive: false, lastUpdated: null };
    }
    return {
      power: state.powerLevel,
      activeEdits: parseActiveEdits(state.activeEdits),
      grandEditActive: state.grandEditActive === 1,
      lastUpdated: state.lastUpdated,
    };
  },

  /** Apply a new Shadow Tongue edit to a room artifact. The pure helper
   *  in apps/shared/shadowTongueEdits.ts handles the merge semantics
   *  (preserves prior createdAt on re-edit, replaces previously-cleared
   *  entries cleanly). Read-modify-write — concurrent writers may race,
   *  but mutation frequency is player-paced (low). The userId scopes the
   *  outgoing ripple event; the underlying state is global. */
  async recordActiveEdit(userId: number, edit: ActiveEdit): Promise<ActiveEdits> {
    const db = await getDb();
    if (!db) return {};
    const [state] = await db.select().from(shadowTongueState).where(eq(shadowTongueState.id, 1)).limit(1);
    const current = parseActiveEdits(state?.activeEdits);
    const next = recordEditPure(current, edit);
    if (state) {
      await db.update(shadowTongueState)
        .set({ activeEdits: serializeActiveEdits(next), lastUpdated: new Date() })
        .where(eq(shadowTongueState.id, 1));
    } else {
      await db.insert(shadowTongueState).values({
        id: 1,
        powerLevel: 0,
        activeEdits: serializeActiveEdits(next),
        grandEditActive: 0,
      });
    }
    try {
      await ripple.emit("shadow_tongue_edit_recorded", { userId, editId: edit.id, room: edit.room });
    } catch (err) {
      logger.error("[shadowTongue] ripple failed on recordActiveEdit", err);
    }
    return next;
  },

  /** Clear an active edit at the given engine tick. Idempotent — clearing
   *  an already-cleared edit is a no-op (first clear wins). Clearing an
   *  unknown id is a no-op. The pure helper enforces both. The userId
   *  scopes the outgoing ripple event; the underlying state is global. */
  async clearActiveEdit(userId: number, id: string, tickAt: number): Promise<ActiveEdits> {
    const db = await getDb();
    if (!db) return {};
    const [state] = await db.select().from(shadowTongueState).where(eq(shadowTongueState.id, 1)).limit(1);
    const current = parseActiveEdits(state?.activeEdits);
    const next = clearEditPure(current, id, tickAt);
    if (next === current) return current;
    if (state) {
      await db.update(shadowTongueState)
        .set({ activeEdits: serializeActiveEdits(next), lastUpdated: new Date() })
        .where(eq(shadowTongueState.id, 1));
    }
    try {
      await ripple.emit("shadow_tongue_edit_cleared", { userId, editId: id });
    } catch (err) {
      logger.error("[shadowTongue] ripple failed on clearActiveEdit", err);
    }
    return next;
  },

  getVoteDefinition(voteId: string): NexusPointVote | undefined {
    return ALL_VOTES.find(v => v.id === voteId);
  },

  getAllVotesForEpoch(epoch: string): NexusPointVote[] {
    return ALL_VOTES.filter(v => v.epoch === epoch);
  },

  /** Same as getAllVotesForEpoch but drops votes whose lockedUntil
   *  flag isn't yet set on the caller's narrativeFlags map. */
  getUnlockedVotesForEpoch(epoch: string, narrativeFlags?: Record<string, boolean>): NexusPointVote[] {
    return unlockedVotes(ALL_VOTES.filter(v => v.epoch === epoch), narrativeFlags);
  },
};
