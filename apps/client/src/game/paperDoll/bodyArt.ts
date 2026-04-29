/* ═══════════════════════════════════════════════════════
   BODY ART URL RESOLVER (plan §G.9 follow-up)

   Per-species silhouette PNGs that sit at the bottom of the
   paper-doll z-stack so equipped gear renders on a body
   instead of floating in space. Path convention mirrors the
   suit catalog:

     /art/bodies/<species>.png

   The four species are the StarterSpecies union from
   apps/shared/starterLoadout.ts (`human`, `demagi`,
   `quarchon`, `neyon`). Foundation is intentionally NOT in
   the path — the body silhouette is the same regardless of
   humanity / machine choice; foundation manifests through
   the mask + glow, not the body shape.

   Browsers prefer the .webp sibling automatically via
   <ResponsiveImage>; this helper only emits the .png URL.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@/lib/assetUrl";
import type { StarterSpecies } from "@shared/starterLoadout";

export type BodySpecies = StarterSpecies;

/** Canonical art URL for a species body PNG. */
export function bodyArtUrl(species: BodySpecies): string {
  return assetUrl(`art/bodies/${species}.png`);
}
