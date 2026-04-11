/* ═══════════════════════════════════════════════════════
   PALIMPSEST ROUTER — tRPC surface for the Signal/Noise meter

   Endpoints:
     get         — read the current user's state + global aggregate
     recordQuiz  — batch-emit Signal/Noise from quiz results
     recordDebate — apply Alaric debate outcomes
     recordEpisode — finalize an episode into history
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { ripple } from "../services/rippleEngine";
import { palimpsestService } from "../services/palimpsestService";
import { getPhase, PALIMPSEST_DELTAS } from "@shared/palimpsest";
import { getDb } from "../db";
import { contentParticipation } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../logger";

export const palimpsestRouter = router({
  /* ─── READ ─── */
  get: protectedProcedure.query(async ({ ctx }) => {
    const state = await palimpsestService.get(ctx.user.id);
    const global = palimpsestService.getGlobal();
    return {
      state,
      global,
      phase: getPhase(state),
      globalPhase: getPhase(global),
    };
  }),

  /* ─── QUIZ RESULTS (Lore Quiz + Gamemaster's Arena + Palimpsest episodes) ─── */
  recordQuiz: protectedProcedure
    .input(
      z.object({
        correct: z.number().int().min(0),
        wrong: z.number().int().min(0),
        source: z.enum(["lore_quiz", "gamemasters_arena", "palimpsest_episode"]),
        episode: z.number().int().min(0).max(13).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Emit ripple events — the engine handles pressure + notifications + meter.
      if (input.correct > 0) {
        await ripple.emit("palimpsest_signal_gain", {
          userId: ctx.user.id,
          amount: PALIMPSEST_DELTAS.quizCorrect.signal * input.correct,
          source: input.source,
        });
      }
      if (input.wrong > 0) {
        await ripple.emit("palimpsest_noise_gain", {
          userId: ctx.user.id,
          amount: PALIMPSEST_DELTAS.quizWrong.noise * input.wrong,
          source: input.source,
        });
      }
      return { state: await palimpsestService.get(ctx.user.id) };
    }),

  /* ─── ALARIC DEBATE RESOLUTION ─── */
  recordDebate: protectedProcedure
    .input(
      z.object({
        episode: z.number().int().min(1).max(13),
        signalDelta: z.number().int().min(0).max(50),
        noiseDelta: z.number().int().min(0).max(50),
        exposed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.signalDelta > 0) {
        await ripple.emit("palimpsest_signal_gain", {
          userId: ctx.user.id,
          amount: input.signalDelta,
          source: `alaric_debate_ep${input.episode}${input.exposed ? "_exposed" : ""}`,
        });
      }
      if (input.noiseDelta > 0) {
        await ripple.emit("palimpsest_noise_gain", {
          userId: ctx.user.id,
          amount: input.noiseDelta,
          source: `alaric_debate_ep${input.episode}`,
        });
      }
      return { state: await palimpsestService.get(ctx.user.id) };
    }),

  /* ─── EPISODE FINALIZATION ─── */
  recordEpisode: protectedProcedure
    .input(
      z.object({
        episodeNumber: z.number().int().min(1).max(13),
        winner: z.enum(["signal", "noise", "draw"]),
        /**
         * Casualties with their real elimination round. The Arena
         * passes the round index a contestant died in, not a default.
         */
        casualties: z.array(
          z.object({
            playerName: z.string().min(1).max(128),
            eliminationRound: z.number().int().min(1).max(10),
          }),
        ),
        signalGained: z.number().int().min(0),
        noiseGained: z.number().int().min(0),
        inventorHackLanded: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Record the episode into history. The returned state is pre-ripple;
      // we re-read at the bottom of this procedure after the outcome
      // events have propagated through the ripple engine.
      await palimpsestService.recordEpisode(ctx.user.id, {
        episodeNumber: input.episodeNumber,
        winner: input.winner,
        casualties: input.casualties.map((c) => c.playerName),
        signalGained: input.signalGained,
        noiseGained: input.noiseGained,
        inventorHackLanded: input.inventorHackLanded,
      });

      // Persist episode completion to contentParticipation so progress
      // follows the player across devices and sessions.
      const db = await getDb();
      if (db) {
        const contentId = `palimpsest_ep${input.episodeNumber}`;
        try {
          const [existing] = await db
            .select()
            .from(contentParticipation)
            .where(
              and(
                eq(contentParticipation.userId, ctx.user.id),
                eq(contentParticipation.contentType, "palimpsest_episode"),
                eq(contentParticipation.contentId, contentId),
              ),
            )
            .limit(1);
          const metadata = {
            winner: input.winner,
            casualties: input.casualties,
            signalGained: input.signalGained,
            noiseGained: input.noiseGained,
            inventorHackLanded: input.inventorHackLanded,
          };
          if (existing) {
            await db
              .update(contentParticipation)
              .set({ completed: 1, progress: 100, metadata })
              .where(eq(contentParticipation.id, existing.id));
          } else {
            await db.insert(contentParticipation).values({
              userId: ctx.user.id,
              contentType: "palimpsest_episode",
              contentId,
              completed: 1,
              progress: 100,
              metadata,
            });
          }
        } catch (e) {
          logger.warn(
            `[Palimpsest] failed to persist episode ${input.episodeNumber} participation:`,
            e,
          );
        }
      }

      // Fan out the outcome-level ripples, preserving real rounds.
      for (const casualty of input.casualties) {
        await ripple.emit("show_casualty_rolled", {
          userId: ctx.user.id,
          playerName: casualty.playerName,
          eliminationRound: casualty.eliminationRound,
          episode: input.episodeNumber,
        });
      }
      if (input.inventorHackLanded) {
        await ripple.emit("inventor_hack_landed", {
          userId: ctx.user.id,
          episode: input.episodeNumber,
          success: true,
        });
      }
      if (input.winner === "signal") {
        await ripple.emit("palimpsest_signal_gain", {
          userId: ctx.user.id,
          amount: PALIMPSEST_DELTAS.episodeWon.signal,
          source: `episode_${input.episodeNumber}_won`,
        });
      }
      if (input.winner === "noise") {
        await ripple.emit("palimpsest_noise_gain", {
          userId: ctx.user.id,
          amount: PALIMPSEST_DELTAS.episodeLost.noise,
          source: `episode_${input.episodeNumber}_lost`,
        });
      }
      // Return the post-ripple state so clients see the Signal/Noise
      // numbers they actually earned from this episode's outcome.
      return { state: await palimpsestService.get(ctx.user.id) };
    }),

  /* ─── LIST COMPLETED EPISODES ─── */
  listCompletedEpisodes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { completed: [] as number[] };
    const rows = await db
      .select()
      .from(contentParticipation)
      .where(
        and(
          eq(contentParticipation.userId, ctx.user.id),
          eq(contentParticipation.contentType, "palimpsest_episode"),
        ),
      );
    return {
      completed: rows
        .filter((r) => r.completed === 1)
        .map((r) => parseInt(r.contentId.replace("palimpsest_ep", ""), 10))
        .filter((n) => !Number.isNaN(n)),
    };
  }),
});
