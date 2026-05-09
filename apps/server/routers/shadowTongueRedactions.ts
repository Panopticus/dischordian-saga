/* ═══════════════════════════════════════════════════════
   SHADOW TONGUE REDACTIONS ROUTER

   Per-player Loredex redaction state (NPC depth #13). The
   Loredex client renderer calls these procedures to decide
   whether each entry should render in full, partially,
   redacted, or contradictory; the redaction service composes
   faction standing + axis profile + global power level + fired
   reveal triggers per apps/shared/universe/shadowTongue.ts.

   Authentication: protectedProcedure throughout. Per-player
   state is meaningless without an authenticated user.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { protectedProcedure, router } from "../_core/trpc";
import {
  fireRevealTrigger,
  resolveRedaction,
  resolveRedactionsBulk,
} from "../services/shadowTongueRedactionService";
import type {
  PlayerAxis,
  AxisMagnitude,
} from "../../shared/npcs/types";

const magnitudeSchema = z.enum([
  "strong_negative",
  "moderate_negative",
  "mild_negative",
  "neutral",
  "mild_positive",
  "moderate_positive",
  "strong_positive",
]);

const axesInputShape = z.object({
  aggression: magnitudeSchema.optional(),
  mercy: magnitudeSchema.optional(),
  curiosity: magnitudeSchema.optional(),
  conformity: magnitudeSchema.optional(),
  vigilance: magnitudeSchema.optional(),
  vulnerability: magnitudeSchema.optional(),
  wit: magnitudeSchema.optional(),
});

type AxesInput = Partial<Record<PlayerAxis, AxisMagnitude>>;

const revealTriggerInputShape = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("loredex_citation"),
    cited_by_npc: z.string().min(1).max(64),
    cite_target: z.string().min(1).max(96),
  }),
  z.object({
    kind: z.literal("encounter_card_investigated"),
    entryId: z.string().min(1).max(96),
  }),
  z.object({
    kind: z.literal("antiquarian_research"),
    archive: z.string().min(1).max(64),
  }),
  z.object({
    kind: z.literal("vex_broadcast_received"),
    broadcast_id: z.string().min(1).max(96),
  }),
  z.object({
    kind: z.literal("shadow_tongue_redactions_revealed_min"),
    n: z.number().int().min(1).max(1000),
  }),
  z.object({
    kind: z.literal("narrative_flag_set"),
    flag: z.string().min(1).max(128),
  }),
]);

export const shadowTongueRedactionsRouter = router({
  /**
   * Resolve the redaction state for a single Loredex entry. Use
   * sparingly — for large lists, prefer resolveBulk to amortise
   * the standing + power-level reads.
   */
  resolve: protectedProcedure
    .input(
      z.object({
        entryId: z.string().min(1).max(96),
        axes: axesInputShape.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const state = await resolveRedaction(
        ctx.user.id,
        input.entryId,
        (input.axes ?? {}) as AxesInput,
      );
      return { entryId: input.entryId, state };
    }),

  /**
   * Bulk-resolve. The Loredex client renderer pages the catalog and
   * calls this once per page; cheaper than per-entry calls.
   */
  resolveBulk: protectedProcedure
    .input(
      z.object({
        entryIds: z.array(z.string().min(1).max(96)).min(1).max(200),
        axes: axesInputShape.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const map = await resolveRedactionsBulk(
        ctx.user.id,
        input.entryIds,
        (input.axes ?? {}) as AxesInput,
      );
      return map;
    }),

  /**
   * Fire a reveal trigger. Idempotent; a re-fire is a no-op.
   * Triggers permanently flip the affected entry to `visible` for
   * the player.
   */
  fireTrigger: protectedProcedure
    .input(
      z.object({
        entryId: z.string().min(1).max(96),
        trigger: revealTriggerInputShape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await fireRevealTrigger(ctx.user.id, input.entryId, input.trigger);
      return { ok: true };
    }),
});
