/* Epoch Witness Service — campaign state machine + vote processing */
import { eq, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import { epochVotes, epochVoteTallies, playerEpochProgress, shadowTongueState } from "../../db/schema";
import { logger } from "../logger";
import { ripple } from "./rippleEngine";
import { AGE_OF_PRIVACY_VOTES, AGE_OF_PROPHECY_VOTES } from "@shared/epochWitnessVotes";
import { AGE_OF_INSURGENCY_VOTES, AGE_OF_REVELATION_VOTES, FALL_OF_REALITY_VOTES } from "@shared/epochWitnessVotesLate";
import type { NexusPointVote } from "@shared/epochWitnessVotes";

const ALL_VOTES: NexusPointVote[] = [
  ...AGE_OF_PRIVACY_VOTES, ...AGE_OF_PROPHECY_VOTES,
  ...AGE_OF_INSURGENCY_VOTES, ...AGE_OF_REVELATION_VOTES, ...FALL_OF_REALITY_VOTES,
];

export const epochWitnessService = {
  async castVote(userId: number, voteId: string, optionChosen: string): Promise<{ success: boolean; tally?: Record<string, number> }> {
    const db = await getDb();
    if (!db) return { success: false };
    const voteDef = ALL_VOTES.find(v => v.id === voteId);
    if (!voteDef) return { success: false };
    const validOptions = voteDef.options.map(o => o.id);
    if (!validOptions.includes(optionChosen)) return { success: false };

    try {
      await db.insert(epochVotes).values({ voteId, epoch: voteDef.epoch, userId, optionChosen });
    } catch (e: unknown) {
      if ((e as Record<string, unknown>)?.code === "ER_DUP_ENTRY") return { success: false };
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

  getVoteDefinition(voteId: string): NexusPointVote | undefined {
    return ALL_VOTES.find(v => v.id === voteId);
  },

  getAllVotesForEpoch(epoch: string): NexusPointVote[] {
    return ALL_VOTES.filter(v => v.epoch === epoch);
  },
};
