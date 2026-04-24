/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE ART ASSETS — assetId → CDN URL resolver

   Single source of truth. Data layer (Wonder.image, EraDefinition.banner,
   etc.) stores asset-id strings from tradeEmpireArtPrompts.ts. UI layer
   calls tradeEmpireArtUrl(id) to resolve.

   Convention: PNGs live at
     apps/client/public/art/trade-empire/<category-dir>/<assetId>.png
   The existing `pnpm assets:upload` script mirrors that to CDN.
   ═══════════════════════════════════════════════════════ */

import {
  TRADE_EMPIRE_ART_PROMPTS,
  type TradeEmpireArtCategory,
} from "../../../shared/tradeEmpireArtPrompts";
import { assetUrl } from "../lib/assetUrl";

const CATEGORY_DIR: Record<TradeEmpireArtCategory, string> = {
  wonder: "wonders",
  era_banner: "eras",
  encounter_key_art: "encounters",
  doctrine_banner: "doctrines",
  fleet_silhouette: "fleet",
  pirate_portrait: "fleet",
  civic_icon: "civics",
  sector_painting: "sectors",
};

const ASSET_BY_ID = new Map(
  TRADE_EMPIRE_ART_PROMPTS.map((p) => [p.assetId, p] as const),
);

/**
 * Resolve a Trade Empire art assetId to a CDN URL, or return undefined
 * if the id isn't in the prompt vault. Callers should treat undefined
 * (and image-load errors) as "no art yet — fall back to text-only".
 *
 * Files are served as WEBP (~16× smaller than the source PNGs while
 * preserving fidelity at panel-display size). All major browsers ≥2020
 * support WEBP; the <ArtThumb> wrapper hides itself onError if a
 * client somehow can't decode it.
 */
export function tradeEmpireArtUrl(assetId: string | undefined): string | undefined {
  if (!assetId) return undefined;
  const p = ASSET_BY_ID.get(assetId);
  if (!p) return undefined;
  return assetUrl(`art/trade-empire/${CATEGORY_DIR[p.category]}/${assetId}.webp`);
}

/**
 * Resolve a sector's art URL. Two conventions coexist:
 *  - 4 pre-existing sectors carry a full `image` URL (legacy `art/planets/...`).
 *  - 33 newly-prompted sectors derive their URL from the vault via
 *    the `sector_<sectorId>` assetId convention.
 * Returns undefined if neither resolves.
 */
export function resolveSectorArtUrl(
  sector: { id: string; image?: string },
): string | undefined {
  if (sector.image) return sector.image;
  return tradeEmpireArtUrl(`sector_${sector.id}`);
}
