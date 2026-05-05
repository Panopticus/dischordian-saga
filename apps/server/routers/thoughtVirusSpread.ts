/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS SPREAD ROUTER

   Player-facing API for the per-sector infection mechanic
   (item 9 of the choice-impact follow-up). Wraps
   thoughtVirusSpreadService.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { protectedProcedure, router } from "../_core/trpc";
import {
  applyContainment,
  getSectorStatus,
  SECTOR_IDS,
} from "../services/thoughtVirusSpreadService";
import type { VirusSectorId } from "../../shared/thoughtVirusSpread";

const sectorIdSchema = z.enum([
  "mechronis_archives",
  "thaloria_substrate",
  "celebration_records",
  "deep_dock_chronology",
  "convergence_seat_proximity",
]);

export const thoughtVirusSpreadRouter = router({
  getSectorStatus: protectedProcedure.query(async ({ ctx }) => {
    return getSectorStatus(ctx.user.id);
  }),

  applyContainment: protectedProcedure
    .input(z.object({
      sectorId: sectorIdSchema,
      actionId: z.string().min(1).max(64),
    }))
    .mutation(async ({ ctx, input }) => {
      return applyContainment({
        userId: ctx.user.id,
        sectorId: input.sectorId as VirusSectorId,
        actionId: input.actionId,
      });
    }),

  listSectors: protectedProcedure.query(() => SECTOR_IDS),
});
