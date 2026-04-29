#!/usr/bin/env node
/* Generate the Pack 2 base-set net-new card definitions from the
   producer slugs in dischordiaBaseSet.ts.

   Emits one file per category under
     apps/shared/tcg-core/cards/definitions/s1_pack2/<category>.ts

   Each card carries:
     id           = "s1_pack2_<category>_<slug>"  (namespace prefix avoids
                                                   collision with existing s1)
     name         = Title Case of the slug
     faction      = derived from category (faction-named → that faction;
                                            cross-faction → "neutral")
     cardType     = "unit" by default
     rarity       = name-pattern derived (supreme/champion/lord → legendary,
                                          elite/veteran        → epic,
                                          novice/initiate      → common,
                                          else                 → uncommon)
     cost / baseStats = derived from rarity
     keywords     = slug-derived (wraith → ephemeral, etc.)
     abilities    = []  (empty; design owns balance pass)
     art          = assetUrl(producer relPath via dischordiaBaseSetArtUrl)
     flavorText   = generic per category
     rulesVersion = "1.0.0"

   Imprint slugs are EXCLUDED — those land via the existing
   s1_imprint_* defs (PR-B repointed their art: fields at the new
   producer slugs). Tier-grid composites are also excluded.

   Idempotent — re-running overwrites the per-category files but the
   barrel registration (apps/shared/tcg-core/cards/index.ts) stays put.
*/
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MANIFEST = join(ROOT, "apps/shared/expansionArt/dischordiaBaseSet.ts");
const OUT_DIR = join(ROOT, "apps/shared/tcg-core/cards/definitions/s1_pack2");
await mkdir(OUT_DIR, { recursive: true });

/* ─── Parse the producer slugs out of dischordiaBaseSet.ts ─── */

const manifestText = await readFile(MANIFEST, "utf8");
const ENTRY_RE = /\{ assetId: "([^"]+)", category: "([^"]+)", relPath: "([^"]+)" \},/g;

const allEntries = [];
for (const m of manifestText.matchAll(ENTRY_RE)) {
  allEntries.push({ assetId: m[1], category: m[2], relPath: m[3] });
}
const cardEntries = allEntries.filter(
  (e) => !e.relPath.includes("/_grids/") && e.category !== "imprint",
);

const byCategory = new Map();
for (const e of cardEntries) {
  if (!byCategory.has(e.category)) byCategory.set(e.category, []);
  byCategory.get(e.category).push(e);
}
for (const list of byCategory.values()) list.sort((a, b) => a.assetId.localeCompare(b.assetId));

/* ─── Category → faction mapping ─── */

const FACTION_BY_CATEGORY = {
  antiquarian: "antiquarian",
  architect: "architect",
  dreamer: "dreamer",
  insurgency: "insurgency",
  new_babylon: "new_babylon",
  thought_virus: "thought_virus",
  neutral: "neutral",
  /* Cross-faction categories → neutral.
     panopticon entries existing card-defs use "architect"; mirror that. */
  panopticon: "architect",
  class: "neutral",
  dimension: "neutral",
  element: "neutral",
  race: "neutral",
  allegiance: "neutral",
};

/* ─── Rarity / stats / cost derivation ─── */

const POWER_PATTERNS = [
  { pattern: /supreme|champion|lord|ruler|first|prime|sovereign|warlord/i, rarity: "legendary", cost: 7, power: 6, health: 6 },
  { pattern: /elite|veteran|archlord|senator|prophet|herald/i,             rarity: "epic",      cost: 5, power: 5, health: 5 },
  { pattern: /novice|initiate|recruit|apprentice|drone|child|seed/i,       rarity: "common",    cost: 2, power: 2, health: 2 },
];
const DEFAULT = { rarity: "uncommon", cost: 3, power: 3, health: 3 };

function pickRarityShape(slug) {
  for (const r of POWER_PATTERNS) if (r.pattern.test(slug)) return r;
  return DEFAULT;
}

const KEYWORD_RULES = [
  [/wraith|phantom|specter|ghost|ghoul/, "ephemeral"],
  [/blade|dancer|assassin|kael|akai_shi/, "rush"],
  [/tank|guardian|warden|sentinel|provoke/, "provoke"],
  [/lancer|rider|skyrider|herald|flying/, "flying"],
  [/champion|legendary|prime/, "celerity"],
];
function pickKeyword(slug) {
  for (const [pat, kw] of KEYWORD_RULES) if (pat.test(slug)) return kw;
  return null;
}

function titleCase(slug) {
  return slug
    .replace(/^[a-z]+_/, "")  // strip the producer category prefix on slugs that have one
    .split("_")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function flavorFor(category, slug) {
  if (category === "neutral")  return "Outside every faction; visible to all.";
  if (category === "class")    return "A class signature. The school speaks through every blade.";
  if (category === "dimension") return "A choice the universe forgot it had to make.";
  if (category === "element")  return "Older than any throne. Heeds no banner.";
  if (category === "race")     return "Born of a world that remembers its first breath.";
  if (category === "allegiance") return "The oath holds; the bearer remains.";
  if (category === "panopticon") return "The eye sees all that pretends not to be seen.";
  return `Of the ${category.replace(/_/g, " ")}.`;
}

/* ─── Per-card definition emit ─── */

function emitCard(entry) {
  const { assetId, category, relPath } = entry;
  const faction = FACTION_BY_CATEGORY[category] ?? "neutral";
  const shape = pickRarityShape(assetId);
  const keyword = pickKeyword(assetId);
  const id = `s1_pack2_${category}_${assetId}`;
  // export name must be a valid JS identifier
  const exportName = `pack2_${category}_${assetId}`.replace(/[^a-z0-9_]/g, "_");
  const name = titleCase(assetId);
  // §5.8 trial-category default — defensive is the safest backfill
  // for un-authored cards (matches the pattern enforced by the
  // strict trialCategoryCoverage test). Design refines per card.
  const trialCats = pickTrialCategories(keyword, shape.rarity);
  return {
    exportName,
    src: `export const ${exportName}: CardDefinition = {
  id: "${id}" as CardDefinition["id"],
  name: "${name.replace(/"/g, '\\"')}",
  faction: "${faction}",
  cardType: "unit",
  rarity: "${shape.rarity}",
  cost: ${shape.cost},
  baseStats: { power: ${shape.power}, health: ${shape.health} },
  keywords: [${keyword ? `"${keyword}"` : ""}],
  abilities: [],  // AUTO-DRAFT — design owns balance + abilities pass
  art: assetUrl(${JSON.stringify(relPath)}),
  flavorText: ${JSON.stringify(flavorFor(category, assetId))},
  rulesVersion: "1.0.0",
  trial_categories: [${trialCats.map((c) => `"${c}"`).join(", ")}] as const,
  verdict_delta: 0,
};`,
  };
}

function pickTrialCategories(keyword, rarity) {
  if (keyword === "provoke" || keyword === "forcefield") return ["defensive"];
  if (keyword === "rush" || keyword === "celerity") return ["offensive"];
  if (keyword === "flying" || keyword === "ranged") return ["reactive"];
  if (keyword === "ephemeral") return ["narrative"];
  // Default: defensive — the safest backfill per
  // balance/verdictDeltaProposer.ts heuristics.
  return ["defensive"];
}

/* ─── Per-category file emit ─── */

const categoriesEmitted = [];
for (const [cat, list] of [...byCategory.entries()].sort()) {
  const cards = list.map(emitCard);
  const collection = `S1_PACK2_${cat.toUpperCase()}_CARDS`;
  const text = `/**
 * Pack 2 base-set · ${cat} · ${list.length} net-new card definitions.
 *
 * AUTO-GENERATED by scripts/_gen-pack2-cards.mjs from the
 * producer slugs in apps/shared/expansionArt/dischordiaBaseSet.ts.
 * Hand-edit individual cards in this file if design wants finer
 * tuning; the generator is idempotent on re-run (overwrites this
 * file, so move custom edits into per-slug overrides if you want
 * them to survive).
 *
 * Every ability list is currently empty — design owns the balance +
 * effect pass. CardIds use the s1_pack2_ namespace so they don't
 * collide with the existing s1_ defs.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "../../../../../client/src/lib/assetUrl";

${cards.map((c) => c.src).join("\n\n")}

export const ${collection}: readonly CardDefinition[] = [
${cards.map((c) => `  ${c.exportName},`).join("\n")}
];
`;
  await writeFile(join(OUT_DIR, `${cat}.ts`), text);
  categoriesEmitted.push({ cat, count: list.length, collection });
  console.log(`  wrote ${cat}.ts: ${list.length} cards`);
}

/* ─── Emit a barrel index that the cards/index.ts can spread ─── */

const barrelText = `/* AUTO-GENERATED by scripts/_gen-pack2-cards.mjs.
 * Re-export every Pack 2 net-new collection in one go. The cards/index.ts
 * registry imports + spreads ALL_S1_PACK2_CARDS once. */
import type { CardDefinition } from "../../../index";
${categoriesEmitted.map((c) => `import { ${c.collection} } from "./${c.cat}";`).join("\n")}

export const ALL_S1_PACK2_CARDS: readonly CardDefinition[] = [
${categoriesEmitted.map((c) => `  ...${c.collection},`).join("\n")}
];

export const S1_PACK2_TOTAL = ALL_S1_PACK2_CARDS.length;
`;
await writeFile(join(OUT_DIR, "index.ts"), barrelText);

const total = categoriesEmitted.reduce((n, c) => n + c.count, 0);
console.log(`\nTotal: ${total} cards across ${categoriesEmitted.length} categories.`);
console.log(`Wrote barrel apps/shared/tcg-core/cards/definitions/s1_pack2/index.ts`);
