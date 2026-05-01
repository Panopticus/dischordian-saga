/* ═══════════════════════════════════════════════════════
   MYSTERIES tRPC ROUTER

   Client-callable surface for the Streamed Prism Mystery
   Engine. Thin wrapper over apps/server/services/mysteryService.ts
   — no business logic here, just zod-validated inputs and
   ctx.user.id-scoped persistence.

   See docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10
   (router endpoints) and §11 (verification).
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { gradeDeduction, mysteryService } from "../services/mysteryService";
import { lookupEpisode, lookupMystery } from "../services/mysteryRegistry";
import { MYSTERY_DEFINITIONS } from "@shared/episodeMysteries";
import type {
  ArcId,
  ChoiceId,
  ClueId,
  EpisodeId,
  LensId,
  MysteryId,
  ToneId,
} from "@shared/mysteryTypes";

/* ─── INPUT SHAPES ─── */

const mysteryIdSchema = z.string().min(1).max(100);
const episodeIdSchema = z.string().min(1).max(100);
const clueIdSchema    = z.string().min(1).max(100);
const lensIdSchema    = z.string().min(1).max(50);
const choiceIdSchema  = z.string().min(1).max(100);

const toneIdSchema = z.enum(["press", "accept", "challenge"]);

/* ─── ROUTER ─── */

export const mysteriesRouter = router({
  /**
   * List every authored mystery the player can open. Returns
   * shallow definition payloads (no episode bodies) — the
   * client fetches per-episode detail via `getEpisode`.
   */
  listAvailable: protectedProcedure.query(async () => {
    return MYSTERY_DEFINITIONS.map((m) => ({
      id: m.id,
      arcId: m.arcId,
      title: m.title,
      summary: m.summary,
      episodeCount: m.episodes.length,
    }));
  }),

  /**
   * Most-recently-acted case for the calling user, with
   * the active episode's definition for immediate render.
   * Returns null when the user has no open case.
   */
  getActiveCase: protectedProcedure.query(async ({ ctx }) => {
    const progress = await mysteryService.getActiveCase(ctx.user.id);
    if (!progress) return null;
    const mystery = lookupMystery(progress.mysteryId as MysteryId);
    if (!mystery) return { progress, mystery: null, currentEpisode: null };
    const currentEpisode = lookupEpisode(
      progress.mysteryId as MysteryId,
      progress.currentEpisodeId as EpisodeId,
    );
    return { progress, mystery, currentEpisode };
  }),

  /**
   * Open a new case. Idempotent — re-opening a case the player
   * already has returns the existing progress row unchanged.
   */
  openCase: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      lensId: lensIdSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const progress = await mysteryService.openCase(
        ctx.user.id,
        input.mysteryId as MysteryId,
        input.lensId as LensId,
      );
      return { progress };
    }),

  /**
   * Fetch a single episode's authored definition. Lens-aware
   * narration overlays land in a follow-up slice.
   */
  getEpisode: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      episodeId: episodeIdSchema,
    }))
    .query(async ({ input }) => {
      const episode = lookupEpisode(
        input.mysteryId as MysteryId,
        input.episodeId as EpisodeId,
      );
      return episode ?? null;
    }),

  /**
   * Evidence-board view: every clue the player has found for
   * this case, plus the authored suspect graph + lens list.
   * Drives the SagaConspiracyBoard tab + clue journal.
   */
  getEvidenceBoard: protectedProcedure
    .input(z.object({ mysteryId: mysteryIdSchema }))
    .query(async ({ ctx, input }) => {
      const mystery = lookupMystery(input.mysteryId as MysteryId);
      const evidence = await mysteryService.listEvidence(
        ctx.user.id,
        input.mysteryId as MysteryId,
      );
      return {
        mystery,
        evidence,
        suspects: mystery?.suspects ?? [],
        lenses: mystery?.lenses ?? [],
      };
    }),

  /**
   * Record a clue-find. Called by the room-mystery runtime when a
   * verb response with a `mysteryBinding` fires. Idempotent.
   */
  recordEvidence: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      clueId: clueIdSchema,
      foundInRoom: z.string().min(1).max(64),
      foundViaVerb: z.string().min(1).max(24),
    }))
    .mutation(async ({ ctx, input }) => {
      await mysteryService.recordEvidence(
        ctx.user.id,
        input.mysteryId as MysteryId,
        input.clueId as ClueId,
        input.foundInRoom,
        input.foundViaVerb,
      );
      return { ok: true as const };
    }),

  /**
   * Submit a deduction. Returns `{ result, narrationId, advancedTo }`.
   * `result` is the authored grade ("correct" / "partial" /
   * "false_lead_named" / "nonsense"); `advancedTo` is non-null
   * when the deduction unlocked a new episode and the player
   * was on the matching one.
   */
  submitDeduction: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      episodeId: episodeIdSchema,
      clueAId: clueIdSchema,
      clueBId: clueIdSchema,
      clueCId: clueIdSchema.optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return mysteryService.submitDeduction({
        userId: ctx.user.id,
        mysteryId: input.mysteryId as MysteryId,
        episodeId: input.episodeId as EpisodeId,
        clueAId: input.clueAId as ClueId,
        clueBId: input.clueBId as ClueId,
        clueCId: input.clueCId as ClueId | undefined,
      });
    }),

  /**
   * Pure deduction grading — no DB write. Used by the client to
   * preview a deduction's grade before committing (e.g. when the
   * player is hovering a candidate pair). Caller still needs to
   * call `submitDeduction` to persist.
   */
  previewDeduction: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      episodeId: episodeIdSchema,
      clueAId: clueIdSchema,
      clueBId: clueIdSchema,
      clueCId: clueIdSchema.optional(),
    }))
    .query(async ({ input }) => {
      const episode = lookupEpisode(
        input.mysteryId as MysteryId,
        input.episodeId as EpisodeId,
      );
      if (!episode) {
        return {
          result: "nonsense" as const,
          narrationId: "mystery.fallback.unknown_episode",
        };
      }
      return gradeDeduction(
        episode,
        input.clueAId as ClueId,
        input.clueBId as ClueId,
        input.clueCId as ClueId | undefined,
      );
    }),

  /**
   * Persist an episode-close choice. Overwrites a prior choice
   * for the same (mystery, episode) — the player can change
   * their mind before the next episode opens.
   */
  submitChoice: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      episodeId: episodeIdSchema,
      choiceId: choiceIdSchema,
      weight: z.string().min(1).max(50),
      willRememberFlag: z.string().max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await mysteryService.submitChoice({
        userId: ctx.user.id,
        mysteryId: input.mysteryId as MysteryId,
        episodeId: input.episodeId as EpisodeId,
        choiceId: input.choiceId as ChoiceId,
        weight: input.weight,
        willRememberFlag: input.willRememberFlag,
      });
      return { ok: true as const };
    }),

  /**
   * Log an interrogation press (npc, question, tone) with the
   * resulting trust delta. The delta is persisted on the log
   * row (durable) and applied to the per-(user, npc) scalar.
   */
  recordInterrogation: protectedProcedure
    .input(z.object({
      mysteryId: mysteryIdSchema,
      episodeId: episodeIdSchema,
      npcId: z.string().min(1).max(100),
      questionId: z.string().min(1).max(200),
      toneId: toneIdSchema,
      trustDelta: z.number().int().min(-50).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      await mysteryService.recordInterrogation({
        userId: ctx.user.id,
        mysteryId: input.mysteryId as MysteryId,
        episodeId: input.episodeId as EpisodeId,
        npcId: input.npcId,
        questionId: input.questionId,
        toneId: input.toneId as ToneId,
        trustDelta: input.trustDelta,
      });
      return { ok: true as const };
    }),

  /**
   * Recap payload — every clue, deduction, and choice the
   * player has made on this case in chronological order.
   * Drives `CaseRecap.tsx`'s Telltale-style cold-open + the
   * late-joiner densified-recap rendering.
   */
  getRecap: protectedProcedure
    .input(z.object({ mysteryId: mysteryIdSchema }))
    .query(async ({ ctx, input }) => {
      return mysteryService.getRecap(ctx.user.id, input.mysteryId as MysteryId);
    }),

  /**
   * Finalize the per-player trust scalar at arc close. Called
   * when the player completes the final episode of an arc
   * (E5 for canonical 5-episode NPC arcs).
   */
  finalizeTrust: protectedProcedure
    .input(z.object({
      npcId: z.string().min(1).max(100),
      arcId: z.string().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      await mysteryService.finalizeTrustScalar(
        ctx.user.id,
        input.npcId,
        input.arcId as ArcId,
      );
      return { ok: true as const };
    }),
});
