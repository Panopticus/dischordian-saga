/* ═══════════════════════════════════════════════════════
   DISCHORDIA CYCLE ROUTER

   tRPC surface for the community-wide Light/Dark meter from
   §3 of the Witnessing Narrative Proposal.

   Endpoints:

     getState          — public query, returns the current cycle
                         snapshot (light, dark, vortex, phase,
                         balance, history).

     applyEnergy       — protected mutation, takes a
                         EnergyGainActionId from
                         @shared/dischordiaCycle and applies it
                         to the singleton. Requires auth.

     applyRawDelta     — admin mutation, bypasses the gain table
                         for one-off events and slideshow rewards.

     triggerVortexAdvance     — admin mutation, force the §3.3
                                community event.
     triggerReclamation       — admin mutation, force the §3.4 chain.
     completeReclamation      — admin mutation, finalize a
                                reclamation with a sector count.

     getAuditTrail     — admin query, return the last N energy
                         events with userId attribution.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { dischordiaCycleService } from "../services/dischordiaCycleService";
import { ENERGY_GAIN_TABLE } from "@shared/dischordiaCycle";

/** Zod enum of the valid EnergyGainActionId values. */
const EnergyGainActionIdEnum = z.enum(
  ENERGY_GAIN_TABLE.map((a) => a.id) as [string, ...string[]],
);

export const dischordiaCycleRouter = router({
  /**
   * Return the current cycle state. Public because the meter
   * is community-wide — anonymous players can read it even
   * before they log in.
   */
  getState: publicProcedure.query(() => {
    return dischordiaCycleService.getState();
  }),

  /**
   * Apply a row from the ENERGY_GAIN_TABLE to the community
   * meter. Requires auth so the audit trail records who
   * triggered it. The actionId is validated against the
   * canonical list to prevent clients from inventing new
   * gain rows.
   */
  applyEnergy: protectedProcedure
    .input(
      z.object({
        actionId: EnergyGainActionIdEnum,
      }),
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.user?.id ?? null;
      return dischordiaCycleService.applyEnergy(
        input.actionId as never,
        userId,
      );
    }),

  /**
   * Apply a raw light/dark/vortex delta. Admin only because
   * this bypasses the gain-table validator — used for slideshow
   * rewards that land +500 light at once, and for narrative
   * milestones that don't fit a predefined row.
   */
  applyRawDelta: adminProcedure
    .input(
      z.object({
        light: z.number().int().optional(),
        dark: z.number().int().optional(),
        vortex: z.number().int().min(-100).max(100).optional(),
        source: z.string().max(128).optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return dischordiaCycleService.applyRawDelta({
        light: input.light,
        dark: input.dark,
        vortex: input.vortex,
        source: input.source,
        userId: ctx.user?.id ?? null,
      });
    }),

  /**
   * Force the §3.3 Vortex Advance community event. Admin only
   * because the normal trigger pathway is the universe tick
   * checking lit-sector ratio; this endpoint is for manual
   * testing and in-case-of-emergency intervention.
   */
  triggerVortexAdvance: adminProcedure.mutation(() => {
    return dischordiaCycleService.triggerVortexAdvance();
  }),

  /**
   * Force the §3.4 Reclamation community event.
   */
  triggerReclamation: adminProcedure.mutation(() => {
    return dischordiaCycleService.triggerReclamation();
  }),

  /**
   * Complete a reclamation with a count of sectors that came
   * back online. Triggers the next cycle.
   */
  completeReclamation: adminProcedure
    .input(
      z.object({
        sectorsReclaimed: z.number().int().min(0).max(1000),
      }),
    )
    .mutation(({ input }) => {
      return dischordiaCycleService.completeReclamation(input.sectorsReclaimed);
    }),

  /**
   * Return the last N energy events. Admin-only view of the
   * in-memory audit trail.
   */
  getAuditTrail: adminProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(500).default(50),
        })
        .default({ limit: 50 }),
    )
    .query(({ input }) => {
      return dischordiaCycleService.getRecentAuditTrail(input.limit);
    }),
});
