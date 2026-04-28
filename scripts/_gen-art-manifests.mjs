#!/usr/bin/env node
/* Generate typed-art-manifest TypeScript modules from the uploaded
   producer packs. Reads /tmp/aaa_assets/extracted (pack 1) and
   /tmp/aaa_assets/pack2 (pack 2) and emits one file per pack:

     apps/shared/expansionArt/hierarchyOfDamned.ts   — pack 1 expansion cards
     apps/shared/expansionArt/dischordiaBaseSet.ts   — pack 2 base-set cards

   Both modules export a typed registry { assetId → relative path }
   plus a URL helper that wraps assetUrl().

   Idempotent — safe to re-run; deterministic ordering by category +
   filename.
*/
import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(ROOT, "apps", "shared", "expansionArt");

mkdirSync(OUT_DIR, { recursive: true });

/* ─── Pack 1: S2 Hierarchy of the Damned ─── */

const HOD_SOURCE = "/tmp/aaa_assets/extracted/expansion_cards";
const HOD_MAP = {
  c_suite_mythic: "c-suite",
  vp_legendary: "vps",
  director_epic: "directors",
  manager_rare: "managers",
  analyst_uncommon: "analysts",
  intern_common: "interns",
  act_exclusives: "act-exclusives",
  special_editions: "special-editions",
};
const HOD_RARITY = {
  c_suite_mythic: "mythic",
  vp_legendary: "legendary",
  director_epic: "epic",
  manager_rare: "rare",
  analyst_uncommon: "uncommon",
  intern_common: "common",
  act_exclusives: "act-exclusive",
  special_editions: "special-edition",
};

async function listWebp(rootDir, mapping) {
  const out = [];
  for (const ent of await readdir(rootDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const cdn = mapping[ent.name];
    if (!cdn) continue;
    const sub = join(rootDir, ent.name);
    for (const f of await readdir(sub)) {
      if (!f.endsWith(".webp")) continue;
      out.push({ producerDir: ent.name, cdnDir: cdn, file: f, assetId: f.replace(/\.webp$/, "") });
    }
  }
  out.sort((a, b) => a.cdnDir.localeCompare(b.cdnDir) || a.assetId.localeCompare(b.assetId));
  return out;
}

const hodEntries = await listWebp(HOD_SOURCE, HOD_MAP);

const hodTs = `/* ═══════════════════════════════════════════════════════
   S2 HIERARCHY OF THE DAMNED — expansion art manifest
   AUTO-GENERATED from scripts/_gen-art-manifests.mjs.

   Source: producer drop s3://dgrsart/aaa_assets_complete.zip
   (2026-04-28). Files served from
   s3://dgrsart/cdn/client-public/art/expansions/hierarchy-of-damned/
   <rarity>/<assetId>.webp via assetUrl().

   ${hodEntries.length} cards across ${Object.keys(HOD_MAP).length} rarity buckets.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";

export type HierarchyOfDamnedRarity =
${[...new Set(Object.values(HOD_RARITY))].map((r) => `  | "${r}"`).join("\n")};

export interface HierarchyOfDamnedArtEntry {
  /** Canonical asset id (matches uploaded webp filename, no extension). */
  assetId: string;
  /** Rarity bucket. Drives the CDN sub-directory. */
  rarity: HierarchyOfDamnedRarity;
  /** Path relative to apps/client/public, suitable for assetUrl(). */
  relPath: string;
}

const PRODUCER_TO_RARITY: Record<string, HierarchyOfDamnedRarity> = ${JSON.stringify(
  HOD_RARITY,
  null,
  2,
).replace(/"([a-z_]+)":/g, "$1:")};

const PRODUCER_TO_CDN: Record<string, string> = ${JSON.stringify(HOD_MAP, null, 2).replace(
  /"([a-z_]+)":/g,
  "$1:",
)};

export const HIERARCHY_OF_DAMNED_ART: readonly HierarchyOfDamnedArtEntry[] = [
${hodEntries
  .map(
    (e) =>
      `  { assetId: ${JSON.stringify(e.assetId)}, rarity: ${JSON.stringify(
        HOD_RARITY[e.producerDir],
      )}, relPath: "art/expansions/hierarchy-of-damned/${e.cdnDir}/${e.file}" },`,
  )
  .join("\n")}
];

const BY_ID = new Map(HIERARCHY_OF_DAMNED_ART.map((e) => [e.assetId, e] as const));

/** Resolve a Hierarchy of the Damned art assetId → CDN URL.
 *  Returns undefined if the id isn't in the manifest. */
export function hierarchyOfDamnedArtUrl(
  assetId: string | undefined,
): string | undefined {
  if (!assetId) return undefined;
  const e = BY_ID.get(assetId);
  return e ? assetUrl(e.relPath) : undefined;
}

/** Every assetId for a given rarity bucket, alphabetically. */
export function hierarchyOfDamnedByRarity(
  rarity: HierarchyOfDamnedRarity,
): readonly HierarchyOfDamnedArtEntry[] {
  return HIERARCHY_OF_DAMNED_ART.filter((e) => e.rarity === rarity);
}

/** Total card count, exposed for tests + dashboards. */
export const HIERARCHY_OF_DAMNED_TOTAL = HIERARCHY_OF_DAMNED_ART.length;
`;

writeFileSync(join(OUT_DIR, "hierarchyOfDamned.ts"), hodTs);
console.log(`hierarchyOfDamned.ts → ${hodEntries.length} entries`);

/* ─── Pack 2: Dischordia base set ─── */

const BASE_SOURCE = "/tmp/aaa_assets/pack2";
const BASE_MAP = {
  allegiance: "allegiance",
  antiquarian: "antiquarian",
  architect: "architect",
  class: "class",
  dimensional: "dimension",   // normalized to existing card-defs convention
  dreamer: "dreamer",
  elemental: "element",       // normalized
  imprint: "imprint",
  insurgency: "insurgency",
  neutral: "neutral",
  new_babylon: "new_babylon",
  panopticon: "panopticon",
  race: "race",
  thought_virus: "thought_virus",
};

const baseEntriesAll = await listWebp(BASE_SOURCE, BASE_MAP);
const baseCards = baseEntriesAll.filter((e) => !/_grid\.webp$/.test(e.file));
const baseGrids = baseEntriesAll.filter((e) =>  /_grid\.webp$/.test(e.file));

const baseCategories = [...new Set(baseCards.map((e) => e.cdnDir))].sort();

const baseTs = `/* ═══════════════════════════════════════════════════════
   DISCHORDIA BASE SET — expansion art manifest
   AUTO-GENERATED from scripts/_gen-art-manifests.mjs.

   Source: producer drop s3://dgrsart/tcg_card_art_651.zip
   (2026-04-28). Files served from
   s3://dgrsart/cdn/client-public/art/cards/<category>/<assetId>.webp
   via assetUrl().

   Producer dirs dimensional/elemental are normalised to dimension/
   element on the way in so they match the existing card-defs path
   convention in apps/shared/tcg-core/cards/definitions/.

   ${baseCards.length} per-card images + ${baseGrids.length} tier-grid
   review composites (kept under <category>/_grids/ in the CDN).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";

export type DischordiaBaseSetCategory =
${baseCategories.map((c) => `  | "${c}"`).join("\n")};

export interface DischordiaBaseSetArtEntry {
  /** Producer-canonical asset slug (matches uploaded webp filename, no ext). */
  assetId: string;
  /** Category bucket. Drives the CDN sub-directory. */
  category: DischordiaBaseSetCategory;
  /** Path relative to apps/client/public, suitable for assetUrl(). */
  relPath: string;
}

export const DISCHORDIA_BASE_SET_ART: readonly DischordiaBaseSetArtEntry[] = [
${baseCards
  .map(
    (e) =>
      `  { assetId: ${JSON.stringify(e.assetId)}, category: ${JSON.stringify(
        e.cdnDir,
      )}, relPath: "art/cards/${e.cdnDir}/${e.file}" },`,
  )
  .join("\n")}
];

/** Tier-grid composites (4-up review images, not per-card art).
 *  Useful for QA dashboards; not referenced by gameplay. */
export const DISCHORDIA_BASE_SET_TIER_GRIDS: readonly DischordiaBaseSetArtEntry[] = [
${baseGrids
  .map(
    (e) =>
      `  { assetId: ${JSON.stringify(e.assetId)}, category: ${JSON.stringify(
        e.cdnDir,
      )}, relPath: "art/cards/${e.cdnDir}/_grids/${e.file}" },`,
  )
  .join("\n")}
];

const BY_ID = new Map(DISCHORDIA_BASE_SET_ART.map((e) => [e.assetId, e] as const));

/** Resolve a Dischordia base-set art assetId → CDN URL.
 *  Returns undefined if the id isn't in the manifest. */
export function dischordiaBaseSetArtUrl(
  assetId: string | undefined,
): string | undefined {
  if (!assetId) return undefined;
  const e = BY_ID.get(assetId);
  return e ? assetUrl(e.relPath) : undefined;
}

/** Every assetId for a given category, alphabetically. */
export function dischordiaBaseSetByCategory(
  category: DischordiaBaseSetCategory,
): readonly DischordiaBaseSetArtEntry[] {
  return DISCHORDIA_BASE_SET_ART.filter((e) => e.category === category);
}

/** Total per-card image count, exposed for tests + dashboards. */
export const DISCHORDIA_BASE_SET_TOTAL = DISCHORDIA_BASE_SET_ART.length;
`;

writeFileSync(join(OUT_DIR, "dischordiaBaseSet.ts"), baseTs);
console.log(`dischordiaBaseSet.ts → ${baseCards.length} cards + ${baseGrids.length} grids`);

/* ─── Index re-export ─── */

writeFileSync(
  join(OUT_DIR, "index.ts"),
  `/* AUTO-GENERATED. Re-runs of scripts/_gen-art-manifests.mjs may overwrite. */
export * from "./hierarchyOfDamned";
export * from "./dischordiaBaseSet";
`,
);
console.log("index.ts written");
