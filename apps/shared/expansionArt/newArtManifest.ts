/**
 * NEW_ART_{1,2,3} drop manifest (2026-05-12).
 *
 * Typed accessors over the 1,838 producer assets shipped in three
 * companion zips delivered together:
 *
 *   - NEW_ART_1_characters_cards_sheets.zip (280 files)
 *     Character turnarounds + blood-weave alts + chapter cards +
 *     character-sheet UI atoms + 60 archetype × doctrine signature
 *     cards + 7 vehicle interiors + cinematics extras (climax stills,
 *     epigraphs, expansion loops, witnessing VFX) + 7 room overlays
 *     + manuscript-vault hotspots.
 *
 *   - NEW_ART_2_destinations_overlays_sprites_ui.zip (431 files)
 *     60 destination zones (10 trade-empire + 15 crucible/PvP + 10
 *     tower-defense + 20 castle-of-death chambers + 5 quiz-show set
 *     pieces) + 8 destination panoramas + 180 doctrine/trained-crew
 *     overlays + 68 apprentice/recruit sprites + trade-empire UI atoms
 *     + ~90 master-UI atoms (forge / audit / commons / cohort /
 *     dialog / doctrine / memory / mission / pedagogy / warden / etc.).
 *
 *   - NEW_ART_3_fight_portraits.zip (1,127 files)
 *     Full fight system (526 sprites + 45 stages + 17 hud + 17 vfx)
 *     plus the master portrait library (48 master_faces +
 *     270 expressions + 30 dialog headshots + 30 dialog 3qbody + 30
 *     profile heroes + 30 silhouettes + 30 thumbnails + 18 npc
 *     headshots + 14 npc expressions + 18 npc profile heroes + 3 style
 *     previews + 1 aesthetic anchor).
 *
 * All assets share the canonical CDN root
 * `cdn/client-public/<relPath>`. URLs resolved via {@link assetUrl}.
 *
 * Closes the §C and §D gaps in
 * `docs/production/_MISSING_ART_PROMPTS.md`:
 *   - §C 7 deferred vehicles → delivered (NEW_ART_1)
 *   - §D 60 deferred destinations → delivered (NEW_ART_2)
 */

import { assetUrl } from "@shared/lib/assetUrl";
import { NEW_ART_ASSETS } from "./newArtInventory.data";

export type { NewArtAsset } from "./newArtInventory.data";
export { NEW_ART_ASSETS };

/** Top-level category buckets present in the drop. */
export type NewArtTopCategory =
  | "card_game"
  | "chapter_cards"
  | "character_sheets"
  | "characters"
  | "cinematics"
  | "destinations"
  | "fight"
  | "manuscript_vault"
  | "overlays"
  | "portraits"
  | "room_overlays"
  | "signature_cards"
  | "sprites"
  | "trade_empire"
  | "ui"
  | "vehicles";

/* ─── Per-category accessors ─── */

const BY_TOP_CATEGORY: ReadonlyMap<
  string,
  ReadonlyArray<{ readonly relPath: string }>
> = (() => {
  const m = new Map<string, Array<{ relPath: string }>>();
  for (const a of NEW_ART_ASSETS) {
    let bucket = m.get(a.topCategory);
    if (!bucket) {
      bucket = [];
      m.set(a.topCategory, bucket);
    }
    bucket.push({ relPath: a.relPath });
  }
  return m;
})();

/** Asset count by top-level category. */
export function newArtCountByCategory(
  category: NewArtTopCategory,
): number {
  return BY_TOP_CATEGORY.get(category)?.length ?? 0;
}

/** Every asset under a given top-level category. */
export function newArtAssetsByCategory(
  category: NewArtTopCategory,
): readonly { readonly relPath: string }[] {
  return BY_TOP_CATEGORY.get(category) ?? [];
}

/** Resolve a relative path to a full CDN URL. */
export function newArtUrl(relPath: string): string {
  return assetUrl(relPath);
}

/** Total count — exposed for tests and dashboards. */
export const NEW_ART_TOTAL = NEW_ART_ASSETS.length;

/* ─── Targeted sub-bucket helpers ─── */

/**
 * The 60 canonical destinations grouped by category.
 * Closes _MISSING_ART_PROMPTS.md §D.
 */
export interface NewDestinationGroups {
  readonly tradeEmpire: readonly string[];
  readonly crucible: readonly string[];
  readonly towerDefense: readonly string[];
  readonly castleOfDeath: readonly string[];
  readonly quizShow: readonly string[];
  readonly panoramas: readonly string[];
}

export function newArtDestinations(): NewDestinationGroups {
  const filterByPrefix = (prefix: string) =>
    NEW_ART_ASSETS.filter((a) => a.relPath.startsWith(prefix)).map(
      (a) => a.relPath,
    );
  return {
    tradeEmpire: filterByPrefix("art/destinations/trade_empire/"),
    crucible: filterByPrefix("art/destinations/crucible"),
    towerDefense: filterByPrefix("art/destinations/tower_defense/"),
    castleOfDeath: filterByPrefix("art/destinations/castle_of_death/"),
    quizShow: filterByPrefix("art/destinations/quiz_show/"),
    panoramas: NEW_ART_ASSETS.filter(
      (a) =>
        a.relPath.startsWith("art/destinations/destination_") &&
        a.relPath.endsWith("_panorama.png"),
    ).map((a) => a.relPath),
  };
}

/**
 * 7 vehicle assets (1 baseline interior per vehicle).
 * Closes _MISSING_ART_PROMPTS.md §C.
 */
export const NEW_ART_VEHICLE_ZIPDIRS: readonly string[] = [
  "cades_apc",
  "captains_shuttle",
  "cargo_vessel",
  "combat_dropship",
  "eidolon_vessel",
  "memorial_hearse",
  "pet_transport",
];

export function newArtVehicleBaselineUrl(
  zipDir: string,
): string | undefined {
  // Producer ships nested-dir vehicle baselines (e.g.
  // art/vehicles/cades_apc/baseline_or_first.png). We index by
  // looking up any file under art/vehicles/<zipDir>/.
  const entry = NEW_ART_ASSETS.find((a) =>
    a.relPath.startsWith(`art/vehicles/${zipDir}/`),
  );
  return entry ? newArtUrl(entry.relPath) : undefined;
}

/** 28 chapter cards keyed by file stem (e.g. "chapter_act3_disclosure"). */
export function newArtChapterCardUrl(stem: string): string | undefined {
  const entry = NEW_ART_ASSETS.find(
    (a) => a.relPath === `art/chapter_cards/${stem}.png`,
  );
  return entry ? newArtUrl(entry.relPath) : undefined;
}

/** 60 archetype × doctrine signature cards (12 archetypes × 5 doctrines). */
export const NEW_ART_DOCTRINE_ARCHETYPES = [
  "artisan",
  "ghost",
  "heretic",
  "jester",
  "martyr",
  "oracle",
  "prodigal",
  "revenant",
  "scholar",
  "sentinel",
  "wanderer",
  "zealot",
] as const;
export type NewArtDoctrineArchetype = (typeof NEW_ART_DOCTRINE_ARCHETYPES)[number];

export const NEW_ART_DOCTRINE_BRANCHES = [
  "cold_hand",
  "compliant_mouth",
  "forked_path",
  "heretical_quiet",
  "human_remainder",
] as const;
export type NewArtDoctrineBranch = (typeof NEW_ART_DOCTRINE_BRANCHES)[number];

export function newArtSignatureCardUrl(
  archetype: NewArtDoctrineArchetype,
  branch: NewArtDoctrineBranch,
): string | undefined {
  const stem = `${archetype}_${branch}_card`;
  const entry = NEW_ART_ASSETS.find(
    (a) => a.relPath === `art/signature_cards/${stem}.png`,
  );
  return entry ? newArtUrl(entry.relPath) : undefined;
}

/* ─── Coverage report (for the parity gate) ─── */

export interface NewArtCoverageReport {
  readonly total: number;
  readonly byCategory: ReadonlyMap<string, number>;
  readonly vehiclesCovered: readonly string[];
  readonly destinationsCovered: number;
}

export function newArtCoverageReport(): NewArtCoverageReport {
  const counts = new Map<string, number>();
  for (const [k, v] of BY_TOP_CATEGORY.entries()) counts.set(k, v.length);
  const dest = newArtDestinations();
  return {
    total: NEW_ART_TOTAL,
    byCategory: counts,
    vehiclesCovered: [...NEW_ART_VEHICLE_ZIPDIRS],
    destinationsCovered:
      dest.tradeEmpire.length +
      dest.crucible.length +
      dest.towerDefense.length +
      dest.castleOfDeath.length +
      dest.quizShow.length,
  };
}
