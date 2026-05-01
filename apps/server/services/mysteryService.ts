/* ═══════════════════════════════════════════════════════
   MYSTERY SERVICE — Streamed Prism Mystery Engine

   The orchestration brain for the Episodic Mystery System
   (see docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10).

   Five responsibilities:
     1. Episode lifecycle — open / advance / close
     2. Evidence tracking — idempotent clue-find recording
     3. Deduction grading — pure lookup against the authored
        deduction graph in episodeMysteries.ts
     4. Choice + interrogation logging — durable carry-forward
     5. NPC trust-scalar finalization at arc close

   No vote-closure compilation here — that lives in
   mysteryClosureCron + mysteryTemplates.ts (separate slice).

   Convention: each public method takes a userId first and
   returns a typed payload (or null/typed-error). All persistence
   is idempotent — calling openCase twice for the same
   (user, mystery) returns the same row.
   ═══════════════════════════════════════════════════════ */

import { and, desc, eq } from "drizzle-orm";
import {
  mysteryDeductions,
  mysteryEvidence,
  mysteryInterrogationLog,
  npcTrustScalars,
  playerMysteryChoices,
  playerMysteryProgress,
} from "../../db/schema";
import { getDb } from "../db";
import { logger } from "../logger";
import { lookupEpisode, lookupMystery } from "./mysteryRegistry";
import type {
  ArcId,
  ChoiceId,
  ClueId,
  DeductionResult,
  EpisodeDefinition,
  EpisodeId,
  LensId,
  MysteryDefinition,
  MysteryId,
  ToneId,
} from "@shared/mysteryTypes";

/* ─── PURE GRADING ─── */

/**
 * Grade a deduction submission against the authored deduction
 * graph. Pure — no DB. Returns the matching edge's result, or
 * "nonsense" when no edge matches (signaling the runtime to
 * serve a generic "those don't connect" beat).
 *
 * Pairs are unordered: (A, B) matches an edge whose clueA / clueB
 * are A / B in either order. 3-clue deductions match unordered
 * triples.
 */
export function gradeDeduction(
  episode: EpisodeDefinition,
  clueAId: ClueId,
  clueBId: ClueId,
  clueCId?: ClueId,
): {
  result: DeductionResult;
  narrationId: string;
  narrationProse?: string;
  unlocksEpisode?: EpisodeId;
} {
  for (const edge of episode.deductions) {
    const matchesAB =
      (edge.clueA === clueAId && edge.clueB === clueBId) ||
      (edge.clueA === clueBId && edge.clueB === clueAId);
    if (!matchesAB) continue;
    if (edge.clueC || clueCId) {
      // 3-clue match requires clueC to also match
      if (edge.clueC !== clueCId) continue;
    }
    return {
      result: edge.result,
      narrationId: edge.narrationId,
      narrationProse: edge.narrationProse,
      unlocksEpisode: edge.unlocksEpisode,
    };
  }
  return {
    result: "nonsense",
    narrationId: "mystery.fallback.nonsense",
  };
}

/* ─── EPISODE LIFECYCLE ─── */

export const mysteryService = {
  /**
   * Open a case for a player, or fetch the existing progress row.
   * Idempotent — calling twice returns the same row.
   *
   * Returns null when the mystery isn't authored (the caller
   * should treat this as a degraded state — likely a vote that
   * produced an unbuilt seed).
   */
  async openCase(
    userId: number,
    mysteryId: MysteryId,
    lensId: LensId,
  ): Promise<typeof playerMysteryProgress.$inferSelect | null> {
    const definition = lookupMystery(mysteryId);
    if (!definition) {
      logger.warn(`[MysteryService] openCase: unknown mystery ${mysteryId} for user ${userId}`);
      return null;
    }
    if (definition.episodes.length === 0) {
      logger.warn(`[MysteryService] openCase: mystery ${mysteryId} has no episodes`);
      return null;
    }
    const db = await getDb();
    if (!db) return null;

    const existing = await db.select().from(playerMysteryProgress)
      .where(and(
        eq(playerMysteryProgress.userId, userId),
        eq(playerMysteryProgress.mysteryId, mysteryId as string),
      ))
      .limit(1);
    if (existing.length > 0) return existing[0];

    await db.insert(playerMysteryProgress).values({
      userId,
      mysteryId: mysteryId as string,
      currentEpisodeId: definition.episodes[0].id as string,
      lensId: lensId as string,
      recapNeeded: 0,
    });

    const created = await db.select().from(playerMysteryProgress)
      .where(and(
        eq(playerMysteryProgress.userId, userId),
        eq(playerMysteryProgress.mysteryId, mysteryId as string),
      ))
      .limit(1);
    return created[0] ?? null;
  },

  /**
   * Fetch the player's currently-active case — defined as the
   * most recently acted-on `playerMysteryProgress` row.
   */
  async getActiveCase(userId: number): Promise<typeof playerMysteryProgress.$inferSelect | null> {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select().from(playerMysteryProgress)
      .where(eq(playerMysteryProgress.userId, userId))
      .orderBy(desc(playerMysteryProgress.lastActedAt))
      .limit(1);
    return rows[0] ?? null;
  },

  /**
   * Idempotent clue-find recording. The (userId, mysteryId, clueId)
   * unique index makes this safe to call from any room hotspot
   * that authored a `mysteryBinding` — the runtime fires this on
   * every verb resolution; duplicate finds are silently absorbed.
   */
  async recordEvidence(
    userId: number,
    mysteryId: MysteryId,
    clueId: ClueId,
    foundInRoom: string,
    foundViaVerb: string,
  ): Promise<void> {
    const db = await getDb();
    if (!db) return;
    try {
      await db.insert(mysteryEvidence).values({
        userId,
        mysteryId: mysteryId as string,
        clueId: clueId as string,
        foundInRoom,
        foundViaVerb,
        presentedToNpcs: [],
      });
    } catch {
      // Duplicate key — clue already recorded. Idempotent: no-op.
    }
  },

  /**
   * List all evidence the player has found for one mystery, in
   * find-order (the journal's natural display order).
   */
  async listEvidence(
    userId: number,
    mysteryId: MysteryId,
  ): Promise<(typeof mysteryEvidence.$inferSelect)[]> {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(mysteryEvidence)
      .where(and(
        eq(mysteryEvidence.userId, userId),
        eq(mysteryEvidence.mysteryId, mysteryId as string),
      ));
  },

  /**
   * Submit a deduction. Grades it against the authored graph,
   * persists the result, and advances the player's current
   * episode when the edge unlocks one. Returns the result + the
   * authored narration id so the caller can render the reveal.
   */
  async submitDeduction(args: {
    userId: number;
    mysteryId: MysteryId;
    episodeId: EpisodeId;
    clueAId: ClueId;
    clueBId: ClueId;
    clueCId?: ClueId;
  }): Promise<{
    result: DeductionResult;
    narrationId: string;
    narrationProse?: string;
    advancedTo: EpisodeId | null;
  }> {
    const episode = lookupEpisode(args.mysteryId, args.episodeId);
    if (!episode) {
      return { result: "nonsense", narrationId: "mystery.fallback.unknown_episode", advancedTo: null };
    }
    const graded = gradeDeduction(episode, args.clueAId, args.clueBId, args.clueCId);

    const db = await getDb();
    if (db) {
      await db.insert(mysteryDeductions).values({
        userId: args.userId,
        mysteryId: args.mysteryId as string,
        episodeId: args.episodeId as string,
        clueAId: args.clueAId as string,
        clueBId: args.clueBId as string,
        clueCId: (args.clueCId as string | undefined) ?? null,
        result: graded.result,
        narrationId: graded.narrationId,
      });

      // Advance the case when the deduction unlocks a new episode
      // and the player is currently on the matching one.
      if (graded.unlocksEpisode) {
        await db.update(playerMysteryProgress)
          .set({ currentEpisodeId: graded.unlocksEpisode as string })
          .where(and(
            eq(playerMysteryProgress.userId, args.userId),
            eq(playerMysteryProgress.mysteryId, args.mysteryId as string),
            eq(playerMysteryProgress.currentEpisodeId, args.episodeId as string),
          ));
      }
    }

    return {
      result: graded.result,
      narrationId: graded.narrationId,
      narrationProse: graded.narrationProse,
      advancedTo: graded.unlocksEpisode ?? null,
    };
  },

  /**
   * Persist an episode-close choice. Idempotent — the (user,
   * mystery, episode) unique index means re-submitting the same
   * episode's choice just overwrites the previous one (the
   * player is allowed to change their mind before the next
   * episode opens).
   */
  async submitChoice(args: {
    userId: number;
    mysteryId: MysteryId;
    episodeId: EpisodeId;
    choiceId: ChoiceId;
    weight: string;
    willRememberFlag?: string;
  }): Promise<void> {
    const db = await getDb();
    if (!db) return;
    try {
      await db.insert(playerMysteryChoices).values({
        userId: args.userId,
        mysteryId: args.mysteryId as string,
        episodeId: args.episodeId as string,
        choiceId: args.choiceId as string,
        weight: args.weight,
        willRememberFlag: args.willRememberFlag ?? "",
      });
    } catch {
      // Duplicate (user, mystery, episode) — overwrite the row.
      await db.update(playerMysteryChoices)
        .set({
          choiceId: args.choiceId as string,
          weight: args.weight,
          willRememberFlag: args.willRememberFlag ?? "",
        })
        .where(and(
          eq(playerMysteryChoices.userId, args.userId),
          eq(playerMysteryChoices.mysteryId, args.mysteryId as string),
          eq(playerMysteryChoices.episodeId, args.episodeId as string),
        ));
    }

    // Auto-finalize the per-player NPC trust scalar when the
    // player commits a choice on the final episode of an arc
    // that anchors on a single NPC. Vote-spawned and anniversary
    // mysteries leave npcId unset — their trust scalars are
    // independent of any single NPC and are not finalized here.
    const mystery = lookupMystery(args.mysteryId);
    if (mystery && mystery.npcId && mystery.episodes.length > 0) {
      const finalEpisode = mystery.episodes[mystery.episodes.length - 1];
      if (finalEpisode.id === args.episodeId) {
        await mysteryService.finalizeTrustScalar(
          args.userId,
          mystery.npcId,
          mystery.arcId,
        );
      }
    }
  },

  /**
   * Log an interrogation press and apply the trust delta. The
   * delta is durable (`trustDeltaApplied`) so retroactive scalar
   * recalculations don't rewrite history — the log is canon.
   */
  async recordInterrogation(args: {
    userId: number;
    mysteryId: MysteryId;
    episodeId: EpisodeId;
    npcId: string;
    questionId: string;
    toneId: ToneId;
    trustDelta: number;
  }): Promise<void> {
    const db = await getDb();
    if (!db) return;
    await db.insert(mysteryInterrogationLog).values({
      userId: args.userId,
      mysteryId: args.mysteryId as string,
      episodeId: args.episodeId as string,
      npcId: args.npcId,
      questionId: args.questionId,
      toneId: args.toneId,
      trustDeltaApplied: args.trustDelta,
    });

    if (args.trustDelta !== 0) {
      await mysteryService.applyTrustDelta(args.userId, args.npcId, args.trustDelta, args.mysteryId);
    }
  },

  /**
   * Apply a trust delta to a per-player NPC scalar. Clamps to
   * [0, 100]. Upserts the row when the (user, npc) pair has no
   * scalar yet (start at 50, then apply delta).
   */
  async applyTrustDelta(
    userId: number,
    npcId: string,
    delta: number,
    sourceMysteryId: MysteryId,
  ): Promise<void> {
    const db = await getDb();
    if (!db) return;
    const existing = await db.select().from(npcTrustScalars)
      .where(and(
        eq(npcTrustScalars.userId, userId),
        eq(npcTrustScalars.npcId, npcId),
      ))
      .limit(1);
    const current = existing[0]?.scalar ?? 50;
    const next = Math.max(0, Math.min(100, current + delta));
    if (existing.length === 0) {
      await db.insert(npcTrustScalars).values({
        userId,
        npcId,
        scalar: next,
        lastUpdatedFromMysteryId: sourceMysteryId as string,
      });
    } else {
      await db.update(npcTrustScalars)
        .set({
          scalar: next,
          lastUpdatedFromMysteryId: sourceMysteryId as string,
        })
        .where(and(
          eq(npcTrustScalars.userId, userId),
          eq(npcTrustScalars.npcId, npcId),
        ));
    }
  },

  /**
   * Finalize the per-player NPC trust scalar at arc close. Stamps
   * `finalizedFromArc` so subsequent arcs know not to reset it —
   * the scalar persists across years per docs §14c.8.
   */
  async finalizeTrustScalar(
    userId: number,
    npcId: string,
    arcId: ArcId,
  ): Promise<void> {
    const db = await getDb();
    if (!db) return;
    await db.update(npcTrustScalars)
      .set({ finalizedFromArc: arcId as string })
      .where(and(
        eq(npcTrustScalars.userId, userId),
        eq(npcTrustScalars.npcId, npcId),
      ));
  },

  /**
   * List every NPC trust scalar a player has accumulated. The
   * client renders these as chips on the Cases page so the player
   * can see how each arc's NPC reads them — across active and
   * already-finalised arcs.
   *
   * Returns an empty array when the DB is unavailable; never
   * throws.
   */
  async listMyTrustScalars(
    userId: number,
  ): Promise<(typeof npcTrustScalars.$inferSelect)[]> {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(npcTrustScalars)
      .where(eq(npcTrustScalars.userId, userId));
  },

  /**
   * Assemble the recap payload for a case — every clue, deduction,
   * and choice the player has made, in chronological order. Drives
   * `CaseRecap.tsx`'s Telltale-style cold-open + the late-joiner
   * densified-recap rendering.
   */
  async getRecap(userId: number, mysteryId: MysteryId): Promise<{
    mystery: MysteryDefinition | null;
    evidence: (typeof mysteryEvidence.$inferSelect)[];
    deductions: (typeof mysteryDeductions.$inferSelect)[];
    choices: (typeof playerMysteryChoices.$inferSelect)[];
  }> {
    const mystery = lookupMystery(mysteryId);
    const db = await getDb();
    if (!db) return { mystery, evidence: [], deductions: [], choices: [] };

    const [evidence, deductions, choices] = await Promise.all([
      db.select().from(mysteryEvidence)
        .where(and(
          eq(mysteryEvidence.userId, userId),
          eq(mysteryEvidence.mysteryId, mysteryId as string),
        )),
      db.select().from(mysteryDeductions)
        .where(and(
          eq(mysteryDeductions.userId, userId),
          eq(mysteryDeductions.mysteryId, mysteryId as string),
        )),
      db.select().from(playerMysteryChoices)
        .where(and(
          eq(playerMysteryChoices.userId, userId),
          eq(playerMysteryChoices.mysteryId, mysteryId as string),
        )),
    ]);
    return { mystery, evidence, deductions, choices };
  },
};
