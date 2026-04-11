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

export const palimpsestRouter = router({
  /* ─── READ ─── */
  get: protectedProcedure.query(({ ctx }) => {
    const state = palimpsestService.get(ctx.user.id);
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
      return { state: palimpsestService.get(ctx.user.id) };
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
      return { state: palimpsestService.get(ctx.user.id) };
    }),

  /* ─── EPISODE FINALIZATION ─── */
  recordEpisode: protectedProcedure
    .input(
      z.object({
        episodeNumber: z.number().int().min(1).max(13),
        winner: z.enum(["signal", "noise", "draw"]),
        casualties: z.array(z.string()),
        signalGained: z.number().int().min(0),
        noiseGained: z.number().int().min(0),
        inventorHackLanded: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = palimpsestService.recordEpisode(ctx.user.id, input);

      // Fan out the outcome-level ripples.
      for (const name of input.casualties) {
        await ripple.emit("show_casualty_rolled", {
          userId: ctx.user.id,
          playerName: name,
          eliminationRound: 10, // default round 10; refine later
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
      return { state };
    }),
});
