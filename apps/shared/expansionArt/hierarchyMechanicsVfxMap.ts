/* ═══════════════════════════════════════════════════════
   HIERARCHY MECHANICS VFX MAP

   The cinematicsManifest declares 3 producer-delivered
   hierarchy_mechanics VFX clips (vfx_perf_review,
   vfx_quarterly_earnings, vfx_stock_buyback) but none of them had
   a client trigger — they shipped to CDN and went unused.

   This map binds each clip to a specific s2_hierarchy card whose
   theme matches the VFX. When that card is played, the duel UI
   queues the clip as a brief on-board overlay (700-900ms) — same
   pattern as the existing screen-level card-event glows in
   triggerCardVfx, but using producer-rendered mp4 instead of the
   PNG glow library.
   ═══════════════════════════════════════════════════════ */

import type { VfxDef } from "./cinematicsManifest";
import { VFX_CLIPS, vfxVideoUrl, vfxKeyframeUrl } from "./cinematicsManifest";

/** Card-def-id → producer VFX clip id (must be a hierarchy_mechanics
 *  entry in VFX_CLIPS). The card-id casing matches the s2_hierarchy
 *  card definition files. */
export const HIERARCHY_CARD_TO_VFX: Readonly<Record<string, string>> = {
  // Manager Perf-Review Wraith — auditing manager card. The
  // perf-review VFX is the literal animation for what the card
  // does (a numerical audit overlay sweeping across the target).
  s2_hierarchy_mgr_perf_review_wraith: "vfx_perf_review",
  // Manager Quarterly Forecaster — quarterly-earnings projection
  // glyph fits the forecaster's signature ability.
  s2_hierarchy_mgr_quarterly_forecaster: "vfx_quarterly_earnings",
  // CFO Xeth'Raal the Debt Collector — stock-buyback VFX is the
  // CFO's signature gesture (the ledger reclaims the share).
  s2_hierarchy_cfo_xeth_raal: "vfx_stock_buyback",
};

/** Reverse index — given a VFX id, return the card-def-id that
 *  fires it. Used by the parity test to assert every declared
 *  hierarchy_mechanics clip has a binding. */
export function hierarchyVfxCardId(vfxId: string): string | undefined {
  for (const [cardId, fxId] of Object.entries(HIERARCHY_CARD_TO_VFX)) {
    if (fxId === vfxId) return cardId;
  }
  return undefined;
}

export interface HierarchyMechanicVfxTrigger {
  readonly vfxId: string;
  readonly videoUrl: string;
  readonly keyframeUrl: string;
}

/** Look up the producer VFX for the given card-def-id. Returns
 *  undefined for non-hierarchy cards OR when the VFX id resolves to
 *  no shipped clip (a parity-test contract — see __tests__). */
export function hierarchyMechanicVfxForCard(
  cardDefId: string,
): HierarchyMechanicVfxTrigger | undefined {
  const vfxId = HIERARCHY_CARD_TO_VFX[cardDefId];
  if (!vfxId) return undefined;
  const videoUrl = vfxVideoUrl(vfxId);
  const keyframeUrl = vfxKeyframeUrl(vfxId);
  if (!videoUrl || !keyframeUrl) return undefined;
  return { vfxId, videoUrl, keyframeUrl };
}

/** All hierarchy_mechanics VFX clips declared in the manifest. */
export function listHierarchyMechanicVfx(): readonly VfxDef[] {
  return VFX_CLIPS.filter((v) => v.category === "hierarchy_mechanics");
}
