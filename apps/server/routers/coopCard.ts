/* ═══════════════════════════════════════════════════════
   COOP CARD ROUTER — "Two Witnesses" PvE encounters.
   Backed by apps/shared/tcg-core/coop/encounters.ts.
   Underlying engine still 1v1; the WS layer routes party
   inputs to side 0 and the boss AI to side 1.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  coopCardSessions,
  parties,
  partyMembers,
  competitiveRatings,
  userTitles,
  dreamBalance,
} from "../../db/schema";
import { eq, and, desc, inArray, sql, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import {
  COOP_ENCOUNTERS,
  getCoopEncounter,
} from "@shared/tcg-core/coop/encounters";
import { awardEligibleTitles } from "../services/titleService";
import { processClueDropEvent } from "../services/conspiracyService";
import { mirrorRating } from "../services/competitiveRatingsService";
import { logger } from "../logger";

const Difficulty = z.enum(["normal", "heroic", "mythic"]);

export const coopCardRouter = router({
  /** Public catalog of encounters — used by the client picker UI. */
  getCatalog: publicProcedure.query(() =>
    COOP_ENCOUNTERS.map((e) => ({
      encounterKey: e.encounterKey,
      name: e.name,
      description: e.description,
      flavorText: e.flavorText,
      loredexEntityId: e.loredexEntityId,
      bossGeneralKey: e.bossGeneralKey,
      bossHpMultiplier: e.bossHpMultiplier,
      phaseCount: e.phases.length,
      rewards: e.rewards,
    })),
  ),

  /**
   * Start a co-op session. Caller must be the leader of a party in
   * `card_coop` mode with the right member count (1 or 2).
   */
  startSession: protectedProcedure
    .input(z.object({
      encounterKey: z.string().min(1).max(64),
      difficulty: Difficulty,
    }))
    .mutation(async ({ ctx, input }) => {
      const def = getCoopEncounter(input.encounterKey);
      if (!def) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown encounter" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const memberRows = await db
        .select()
        .from(partyMembers)
        .where(eq(partyMembers.userId, ctx.user.id))
        .limit(1);
      if (!memberRows[0]) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a party" });
      if (memberRows[0].role !== "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Leader only" });
      }
      const partyRows = await db
        .select()
        .from(parties)
        .where(eq(parties.partyId, memberRows[0].partyId))
        .limit(1);
      const party = partyRows[0];
      if (!party) throw new TRPCError({ code: "NOT_FOUND", message: "Party gone" });
      if (party.mode !== "card_coop") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Party mode is not card_coop" });
      }
      const allMembers = await db
        .select({ userId: partyMembers.userId, slot: partyMembers.slot })
        .from(partyMembers)
        .where(eq(partyMembers.partyId, party.partyId))
        .orderBy(partyMembers.slot);
      if (allMembers.length < 1 || allMembers.length > 2) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Co-op requires 1 or 2 members" });
      }

      const sessionId = `coop_${randomUUID().slice(0, 12)}`;
      await db.insert(coopCardSessions).values({
        sessionId,
        partyId: party.partyId,
        encounterKey: def.encounterKey,
        difficulty: input.difficulty,
        partyMemberIds: allMembers.map((m) => m.userId),
        outcome: "pending",
        phasesFired: [],
      });
      await db
        .update(parties)
        .set({ status: "in_match", matchId: sessionId })
        .where(eq(parties.partyId, party.partyId));
      logger.info("coop_card_session_started", "coopCard", {
        sessionId,
        encounterKey: def.encounterKey,
        difficulty: input.difficulty,
        partyId: party.partyId,
      });
      return { sessionId };
    }),

  /**
   * Submit the result of a co-op session. Called by the WS layer
   * (or by the client when running offline-vs-AI fallback).
   */
  submitResult: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      outcome: z.enum(["victory", "defeat", "abandoned"]),
      phasesFired: z.array(z.number()).max(10),
      underlyingMatchId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(coopCardSessions)
        .where(eq(coopCardSessions.sessionId, input.sessionId))
        .limit(1);
      const s = rows[0];
      if (!s) throw new TRPCError({ code: "NOT_FOUND" });
      if (s.outcome !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Session already resolved" });
      }
      const memberIds = s.partyMemberIds ?? [];
      if (!memberIds.includes(ctx.user.id)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a party member" });
      }
      await db
        .update(coopCardSessions)
        .set({
          outcome: input.outcome,
          phasesFired: input.phasesFired,
          underlyingMatchId: input.underlyingMatchId ?? null,
          endedAt: new Date(),
        })
        .where(eq(coopCardSessions.id, s.id));
      // Release the party from in_match.
      await db
        .update(parties)
        .set({ status: "forming", matchId: null })
        .where(eq(parties.partyId, s.partyId));

      if (input.outcome === "victory") {
        const def = getCoopEncounter(s.encounterKey);
        // Apply rewards to every contributor.
        for (const uid of memberIds) {
          // Title grants (existing snapshot picks up coop_card_wins
          // via apprenticeTrial-style aggregate; we also fire the
          // explicit titleKeyOnFirstClear if the encounter sets one).
          if (def?.rewards.titleKeyOnFirstClear) {
            await db
              .insert(userTitles)
              .values({ userId: uid, titleKey: def.rewards.titleKeyOnFirstClear })
              .onDuplicateKeyUpdate({ set: { earnedAt: sql`earned_at` } })
              .catch(() => {/* idempotent */});
          }
          // Re-eval other title gates.
          awardEligibleTitles(uid, {
            kind: "coop_card_cleared",
            userId: uid,
            encounterKey: s.encounterKey,
          }).catch(() => {});
          // Mirror into competitive_ratings as gameType=card_coop
          // with a small win-only bump.
          mirrorRating({
            userId: uid,
            gameType: "card_coop",
            currentElo: 1200 + 15,
            rankTier: "silver",
            result: { win: true },
          }).catch(() => {});
          // Tier 2B clue drop.
          if (def?.rewards.clueDropKey) {
            // Direct drop bypasses the random table — narrative grant.
            // We stuff the clue into the user's progress via the
            // standard processClueDropEvent which rolls; for guaranteed
            // grants, the clue can also be added by the conspiracy
            // service's drop pool. Forward narrative_milestone kind so
            // the user has a chance to advance the relevant board.
            processClueDropEvent(uid, "narrative_milestone").catch(() => {});
          }
          // Dream tokens.
          if (def?.rewards.dreamTokens) {
            await db
              .update(dreamBalance)
              .set({ dreamTokens: sql`dream_tokens + ${def.rewards.dreamTokens}` })
              .where(eq(dreamBalance.userId, uid))
              .catch(() => {});
          }
        }
      }
      logger.info("coop_card_session_resolved", "coopCard", {
        sessionId: s.sessionId,
        outcome: input.outcome,
        phasesFired: input.phasesFired.length,
      });
      return { ok: true };
    }),

  /** Recent sessions for the current user. */
  getMySessions: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      // Filter via JSON_CONTAINS — small N, scan is fine.
      const all = await db
        .select()
        .from(coopCardSessions)
        .orderBy(desc(coopCardSessions.startedAt))
        .limit(200);
      return all
        .filter((s) => Array.isArray(s.partyMemberIds) && s.partyMemberIds.includes(ctx.user.id))
        .slice(0, input?.limit ?? 20);
    }),
});

export { COOP_ENCOUNTERS };
