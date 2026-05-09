/* ═══════════════════════════════════════════════════════
   COMMUNITY INVESTIGATION ROUTER — tRPC surface for AR7.

   audit/16 PR 35.

   Three procedures:

     - recordDiscovery (mutation, protected) — the runtime
       fires this when the player crosses a discovery
       boundary (clue collected / mystery solved / etc).
       The mutation accepts the player's `optIn` from the
       caller; the durable row records it, and only opt-in
       rows feed the cross-player aggregator.

     - getSnapshot (query, public) — returns the aggregate
       counts. Anti-spoiler invariant: per-target /
       per-player data never appears in the response.

     - getMilestones (query, public) — returns
       (current, next) milestones the UI surfaces in the
       "we're X away from Y" community ribbon.

   Rate-limited via the standard procedureRateLimit factory.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { procedureRateLimit } from "../_core/procedureRateLimit";
import {
  getCommunitySnapshot,
  getMilestoneSnapshot,
  recordDiscoveryEvent,
  setOptInForUser,
} from "../services/communityInvestigationService";

const COMMUNITY_DISCOVERY_KINDS = [
  "clue_collected",
  "mystery_solved",
  "puzzle_solved",
  "manuscript_entry_unlocked",
  "unreachable_registered",
] as const;

const recordDiscoveryInput = z.object({
  kind: z.enum(COMMUNITY_DISCOVERY_KINDS),
  targetId: z.string().min(1).max(128),
  optIn: z.boolean(),
  seasonKey: z.string().max(32).optional(),
});

const declaredTargetsShape = z
  .object({
    clue_collected: z.number().int().nonnegative(),
    mystery_solved: z.number().int().nonnegative(),
    puzzle_solved: z.number().int().nonnegative(),
    manuscript_entry_unlocked: z.number().int().nonnegative(),
    unreachable_registered: z.number().int().nonnegative(),
  })
  .optional();

export const communityInvestigationRouter = router({
  /** Persist one discovery event. Idempotent on
   *  (userId, kind, targetId): re-discovering the same
   *  target is a no-op. Returns the row id (or 0 for the
   *  no-op path / unconfigured DB). */
  recordDiscovery: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 60 }))
    .input(recordDiscoveryInput)
    .mutation(async ({ ctx, input }) => {
      const id = await recordDiscoveryEvent({
        userId: ctx.user.id,
        kind: input.kind,
        targetId: input.targetId,
        optIn: input.optIn,
        seasonKey: input.seasonKey,
      });
      return { ok: true, id };
    }),

  /** Toggle the optIn flag for every row owned by the
   *  caller. Used when the player flips their privacy
   *  setting and we want retroactive consent applied. */
  setOptIn: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 10 }))
    .input(z.object({ optIn: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const updated = await setOptInForUser(ctx.user.id, input.optIn);
      return { ok: true, updated };
    }),

  /** Cross-player aggregate snapshot. Public —
   *  anti-spoiler invariant means no per-target or
   *  per-player data is in the response. */
  getSnapshot: publicProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 30 }))
    .input(
      z.object({
        seasonKey: z.string().max(32).optional(),
        declaredTargets: declaredTargetsShape,
      }).optional(),
    )
    .query(async ({ input }) => {
      return await getCommunitySnapshot(input ?? {});
    }),

  /** Snapshot + milestone tuple for the community ribbon
   *  UI. Returns the milestone IDs only — the registry
   *  lookup happens client-side. */
  getMilestones: publicProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 30 }))
    .input(
      z.object({
        seasonKey: z.string().max(32).optional(),
        declaredTargets: declaredTargetsShape,
      }).optional(),
    )
    .query(async ({ input }) => {
      return await getMilestoneSnapshot(input ?? {});
    }),
});
