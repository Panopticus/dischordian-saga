/**
 * Shared art-resolver for the S2 Hierarchy expansion.
 *
 * Every s2_hierarchy card calls this; the throw-if-missing guard
 * surfaces a clear error when a producer slug is renamed without
 * updating the hierarchyOfDamned manifest. Centralising the helper
 * keeps the error message one place.
 */
import { hierarchyOfDamnedArtUrl } from "../../../../expansionArt/hierarchyOfDamned";

export function art(assetId: string): string {
  const url = hierarchyOfDamnedArtUrl(assetId);
  if (!url) throw new Error(`hierarchyOfDamnedArtUrl missing for ${assetId}`);
  return url;
}

/** The faction string, exported once so card files don't repeat the literal. */
export const HIERARCHY_FACTION = "hierarchy_of_damned" as const;
