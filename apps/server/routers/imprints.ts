/**
 * Imprints router — read-only API for the Imprint Gallery client
 * page (F28). The grant side lives in the imprintService which
 * other routers call directly; this router surfaces progress to
 * the UI.
 */
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { listImprintProgress } from "../services/imprintService";
import {
  IMPRINT_REGISTRY,
  IMPRINT_THRESHOLDS,
  IMPRINT_TIER_RARITY,
  tierForFragments,
} from "@shared/tcg-core";

export const imprintsRouter = router({
  /** Return the full 18-NPC imprint gallery with per-NPC fragment
   *  count, highest tier unlocked, and the threshold + rarity for
   *  the next tier the player could reach. */
  getGallery: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const rows = await listImprintProgress(db, ctx.user.id);
    const rowMap = new Map(rows.map((r) => [r.npcId, r]));

    return IMPRINT_REGISTRY.map((npc) => {
      const row = rowMap.get(npc.slug);
      const fragments = row?.fragments ?? 0;
      const tier = row?.highestTierUnlocked ?? 0;
      const nextTier = tier < 5 ? ((tier + 1) as 1 | 2 | 3 | 4 | 5) : null;
      const nextThreshold = nextTier ? IMPRINT_THRESHOLDS[nextTier] : null;
      return {
        slug: npc.slug,
        displayName: npc.displayName,
        faction: npc.faction,
        blurb: npc.blurb,
        fragments,
        highestTierUnlocked: tier,
        tieredCardDefIds: npc.tieredCardDefIds,
        // Show the progress bar toward the next tier — current
        // fragments vs. the next threshold. When all 5 tiers are
        // unlocked, progress stays at 100%.
        nextTier,
        nextThreshold,
        progressPercent: nextThreshold
          ? Math.min(100, Math.round((fragments / nextThreshold) * 100))
          : 100,
        rarityUnlockedLabel: tier > 0
          ? IMPRINT_TIER_RARITY[tier as 1 | 2 | 3 | 4 | 5]
          : null,
        lastSource: row?.lastSource ?? null,
      };
    });
  }),

  /** Client-side safety helper — the registry + thresholds are
   *  already exposed via @shared/tcg-core, but the gallery page
   *  doesn't need to import tcg-core directly in the client
   *  bundle. This procedure gives it a single source of truth. */
  getConstants: protectedProcedure.query(() => ({
    thresholds: IMPRINT_THRESHOLDS,
    rarityByTier: IMPRINT_TIER_RARITY,
    sanityCheck: {
      npcCount: IMPRINT_REGISTRY.length,
      totalTieredCards: IMPRINT_REGISTRY.length * 5,
    },
    /** Surface tierForFragments as a precomputed function the
     *  client can't easily replicate: return a flat mapping of
     *  fragment count → tier for common values. */
    tierBreakpoints: [0, 9, 10, 24, 25, 49, 50, 99, 100, 199, 200].map((f) => ({
      fragments: f,
      tier: tierForFragments(f),
    })),
  })),
});
