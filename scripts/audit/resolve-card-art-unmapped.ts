/**
 * Resolve the 49 "Unmapped" rows in card-art-rename-map.md by doing a
 * cross-folder CDN inventory search — the original auto-matcher only
 * searched the same folder the broken path lived in, but most of the
 * descriptive PNGs are actually shipped under the card's faction
 * subfolder (e.g. art/cards/antiquarian/era_mote.webp).
 *
 * Modes:
 *   --dry-run   classify only, write a proposed map sibling, print table
 *   --apply     same classification, but mutate the live rename-map.md
 *
 * Outputs (--dry-run):
 *   audit/ship-readiness-2026-05-22/card-art-rename-map.proposed.md
 *   stdout: HIGH / MEDIUM / NONE classification table
 *
 * Outputs (--apply):
 *   audit/ship-readiness-2026-05-22/card-art-rename-map.md  ← rows moved
 *   audit/ship-readiness-2026-05-22/card-art-producer-verify.md  ← MEDIUM
 *   docs/production/card-art-commission-2026-05.md  ← NONE
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..", "..");
const MAP_PATH = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/card-art-rename-map.md");
const PROPOSED_PATH = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/card-art-rename-map.proposed.md");
const VERIFY_PATH = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/card-art-producer-verify.md");
const COMMISSION_PATH = join(REPO_ROOT, "docs/production/card-art-commission-2026-05.md");
const INVENTORY_PATH = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/cdn-inventory.tsv");

const MODE = process.argv.includes("--apply") ? "apply" : "dry-run";

/**
 * User-confirmed commission backlog. These rows have algorithmic hits
 * (engineers_apprentice for "The Engineer", oracles_unbroken_signal for
 * "The Oracle", etc.) but the producer has confirmed those are
 * different cards — the t5 hero PNGs and the 3 race/hierarchy unique
 * cards genuinely don't exist on CDN. Force-route to NONE regardless
 * of what the matcher finds so the rename-map doesn't propose a
 * misleading substitution.
 */
const COMMISSION_OVERRIDES = new Set([
  "s1_class_engineer_05",
  "s1_class_oracle_05",
  "s1_race_human_01",
  "s1_race_synthetic_03",
  "s2_hierarchy_lord_master_of_rlyeh",
]);

// ─── Definition-folder → CDN folder mapping ─────────────────────────
// Card definitions live under apps/shared/tcg-core/cards/definitions/<X>/
// but CDN keys use slightly different folder names. The mapping is
// 1:1 except for the asymmetries the rename-map already documented.
const DEF_TO_CDN: Record<string, string[]> = {
  allegiance: ["allegiance"],
  class: ["class"],
  dimensional: ["dimension"],
  elemental: ["element"],
  race: ["race"],
  antiquarian: ["antiquarian"],
  architect: ["architect"],
  dreamer: ["dreamer"],
  insurgency: ["insurgency"],
  new_babylon: ["new_babylon"],
  panopticon: ["panopticon"],
  thought_virus: ["thought_virus"],
  s2_hierarchy: ["hierarchy"],
  neutral: ["neutral", ""],
};

// ─── Load CDN inventory: set of every "art/cards/<...>.webp" or .png key ──
const inventoryRaw = readFileSync(INVENTORY_PATH, "utf-8");
const ALL_KEYS = new Set<string>();
for (const line of inventoryRaw.split("\n")) {
  const key = line.split("\t")[0];
  if (!key) continue;
  if (key.startsWith("art/cards/")) ALL_KEYS.add(key);
}

// ─── Parse the "Unmapped" section of the rename-map ────────────────
const mapRaw = readFileSync(MAP_PATH, "utf-8");
const mapLines = mapRaw.split("\n");

interface UnmappedRow {
  cardId: string;
  cardName: string;
  brokenArt: string;
  sourcePath: string;
  reason: string;
  raw: string;
  raw_idx: number;
}

const unmapped: UnmappedRow[] = [];
let inUnmapped = false;
mapLines.forEach((line, idx) => {
  if (line.startsWith("## Unmapped")) inUnmapped = true;
  else if (inUnmapped && line.startsWith("## ")) inUnmapped = false;
  if (!inUnmapped) return;
  if (!line.startsWith("| `")) return; // skip header / separator
  const cols = line.split("|").map((c) => c.trim());
  // | (empty) | id | name | broken | source | reason | (trailing empty)
  if (cols.length < 7) return;
  unmapped.push({
    cardId: cols[1].replaceAll("`", "").trim(),
    cardName: cols[2].trim(),
    brokenArt: cols[3].replaceAll("`", "").trim(),
    sourcePath: cols[4].replaceAll("`", "").trim(),
    reason: cols[5].trim(),
    raw: line,
    raw_idx: idx,
  });
});

// ─── Helpers ────────────────────────────────────────────────────────
function snake(s: string): string {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Faction folder candidates for a card def at this source path. */
function factionFolders(sourcePath: string): string[] {
  // apps/shared/tcg-core/cards/definitions/<faction>/<file>.ts
  const m = sourcePath.match(/definitions\/([^/]+)\/[^/]+\.ts$/);
  if (!m) return [""];
  return DEF_TO_CDN[m[1]] ?? [m[1]];
}

/** Descriptive token candidates derived from the card def filename
 *  and the card's display name. */
function tokenCandidates(row: UnmappedRow): string[] {
  const fileBase = basename(row.sourcePath, ".ts");
  const tokens: string[] = [];

  // s1_<archetype>_<NN>_<descriptive>... → strip the lead
  const m1 = fileBase.match(/^s\d+_[a-z]+_\d+_(.+)$/);
  if (m1) tokens.push(m1[1]);

  // s1_alleg_<faction>_t<N> → <faction>_<name>_t<N> via card name
  const m2 = fileBase.match(/^s\d+_alleg_([a-z_]+)_t(\d+)$/);
  if (m2) {
    const nameSnake = snake(row.cardName).replace(/^[a-z]+_/, ""); // strip "Babylonian"
    tokens.push(`${m2[1]}_${nameSnake}_t${m2[2]}`);
    tokens.push(`${m2[1]}_t${m2[2]}`);
  }

  // s1_race_<race>_NN → <race>_<descriptive from name>
  const m3 = fileBase.match(/^s\d+_race_([a-z]+)_\d+$/);
  if (m3) {
    const nameSnake = snake(row.cardName);
    tokens.push(`${m3[1]}_${nameSnake.replace(`${m3[1]}_`, "")}`);
    tokens.push(nameSnake);
  }

  // s1_class_<class>_NN → simple snake of card name
  const m4 = fileBase.match(/^s\d+_class_([a-z_]+)_\d+$/);
  if (m4) {
    tokens.push(snake(row.cardName));
    // multi-card defs (e.g. class/assassin.ts) — name is the only signal
    tokens.push(snake(row.cardName.replace(/^The /i, "")));
  }

  // s2_watcher_NNN — name-based
  if (/^s\d+_watcher_/.test(fileBase)) tokens.push(snake(row.cardName.replace(/^The /i, "")));

  // s2_hierarchy_lord_<...> — name-based
  if (/^s\d+_hierarchy_lord_/.test(fileBase)) tokens.push(snake(row.cardName.replace(/^The /i, "")));

  // gen_* — just the suffix
  const m5 = row.cardId.match(/^gen_(.+)$/);
  if (m5) tokens.push(m5[1]);

  // card_<...>_title — pull the descriptive bit
  const m6 = row.cardId.match(/^card_(.+)_title$/);
  if (m6) tokens.push(m6[1]);

  // Always include a pure name-snake fallback
  tokens.push(snake(row.cardName));
  tokens.push(snake(row.cardName.replace(/^The /i, "")));

  // De-dupe, preserve order
  return [...new Set(tokens.filter(Boolean))];
}

/** Generate slug variants for a single token: split-pairs etc. */
function slugVariants(token: string): string[] {
  const variants = new Set<string>([token]);
  // foot_soldier ↔ footsoldier
  variants.add(token.replace(/_/g, ""));
  // chronoguard → chrono_guard
  variants.add(token.replace(/([a-z]{4,})/g, (m) => m));
  // Drop a leading "the_"
  variants.add(token.replace(/^the_/, ""));
  variants.add("the_" + token);
  return [...variants];
}

interface Match {
  key: string;
  confidence: "HIGH" | "MEDIUM";
  reason: string;
}

function findMatches(row: UnmappedRow): Match[] {
  const factions = factionFolders(row.sourcePath);
  const tokens = tokenCandidates(row);
  const hits: Match[] = [];
  const seen = new Set<string>();

  // Pass 1: exact token in faction folder → HIGH.
  // The producer ships both .png and .webp for many assets — they're
  // the same image, so we treat the basename-without-extension as the
  // identity and prefer the .webp sibling (which is what assetUrl()
  // serves via <picture> fallback). Dedupe by (faction, variant) so a
  // dual-format upload registers as ONE hit, not two.
  const stemSeen = new Set<string>();
  for (const fac of factions) {
    for (const tok of tokens) {
      for (const variant of slugVariants(tok)) {
        const stem = `${fac}/${variant}`;
        if (stemSeen.has(stem)) continue;
        // Prefer .webp if both exist; fall through to .png if only that ships.
        const webp = fac ? `art/cards/${fac}/${variant}.webp` : `art/cards/${variant}.webp`;
        const png = fac ? `art/cards/${fac}/${variant}.png` : `art/cards/${variant}.png`;
        const chosen = ALL_KEYS.has(webp) ? webp : ALL_KEYS.has(png) ? png : null;
        if (chosen && !seen.has(chosen)) {
          seen.add(chosen);
          stemSeen.add(stem);
          hits.push({ key: chosen, confidence: "HIGH", reason: `faction:${fac} token:${variant}` });
        }
      }
    }
  }

  // Pass 2: tier-suffix variants for allegiance cards.
  // Demoted to MEDIUM because matching just by `<faction>_*_t<N>` is a
  // structural match, not a name match — the producer renamed several
  // tiers (Adjudicator → Senator, Archon-Elect → Governor) and a blind
  // pick by tier number alone can pair the wrong descriptive PNG to a
  // card. We surface the candidate but route through producer-verify.
  const allegMatch = row.cardId.match(/^s\d+_alleg_([a-z_]+)_t(\d+)$/);
  if (allegMatch && hits.length === 0) {
    const [, faction, tier] = allegMatch;
    const folder = `art/cards/allegiance`;
    const facShort = faction.replace("new_", "");
    const candidates = new Set<string>();
    for (const key of ALL_KEYS) {
      if (key.startsWith(`${folder}/${facShort}_`) && (key.endsWith(`_t${tier}.webp`) || key.endsWith(`_t${tier}.png`))) {
        // Prefer .webp partner
        const webpKey = key.replace(/\.png$/, ".webp");
        candidates.add(ALL_KEYS.has(webpKey) ? webpKey : key);
      }
    }
    for (const key of candidates) {
      if (!seen.has(key)) {
        seen.add(key);
        hits.push({ key, confidence: "MEDIUM", reason: `allegiance tier scan (structural)` });
      }
    }
  }

  // Pass 3: substring scan in faction folder → MEDIUM
  if (hits.length === 0) {
    for (const fac of factions) {
      const folderPrefix = fac ? `art/cards/${fac}/` : `art/cards/`;
      for (const tok of tokens) {
        for (const key of ALL_KEYS) {
          if (!key.startsWith(folderPrefix)) continue;
          // Only direct children of this folder
          const rest = key.slice(folderPrefix.length);
          if (rest.includes("/")) continue;
          if (rest.toLowerCase().includes(tok.toLowerCase()) && tok.length >= 4) {
            if (!seen.has(key)) {
              seen.add(key);
              hits.push({ key, confidence: "MEDIUM", reason: `substring tok=${tok}` });
            }
          }
        }
      }
    }
  }

  // Pass 4: race-prefix folder scan. When the def lives in
  // race/<species>.ts (one file per species, multiple tiers), the
  // matcher above can't tie a single tier id to a single file. List
  // every `art/cards/race/<species>_*` as a MEDIUM candidate so the
  // producer can pick. Applies symmetrically to other prefix-grouped
  // folders if they emerge (e.g. class/<class>.ts → `class_<class>_*`).
  if (hits.length === 0) {
    const speciesMatch = row.sourcePath.match(/definitions\/(race)\/([a-z]+)\.ts$/);
    if (speciesMatch) {
      const [, , species] = speciesMatch;
      const folderPrefix = `art/cards/race/${species}_`;
      const candidates = new Set<string>();
      for (const key of ALL_KEYS) {
        if (!key.startsWith(folderPrefix)) continue;
        const webp = key.replace(/\.png$/, ".webp");
        candidates.add(ALL_KEYS.has(webp) ? webp : key);
      }
      for (const key of candidates) {
        if (!seen.has(key)) {
          seen.add(key);
          hits.push({ key, confidence: "MEDIUM", reason: `species-prefix scan` });
        }
      }
    }
  }

  return hits;
}

// ─── Classify every unmapped row ───────────────────────────────────
interface Classified {
  row: UnmappedRow;
  tier: "HIGH" | "MEDIUM" | "NONE";
  primary?: Match;
  alternates: Match[];
}

const classified: Classified[] = unmapped.map((row) => {
  if (COMMISSION_OVERRIDES.has(row.cardId)) {
    return { row, tier: "NONE", alternates: [] };
  }
  const hits = findMatches(row);
  if (hits.length === 0) return { row, tier: "NONE", alternates: [] };
  const high = hits.filter((h) => h.confidence === "HIGH").sort((a, b) => b.key.length - a.key.length);
  if (high.length === 1) return { row, tier: "HIGH", primary: high[0], alternates: hits.slice(1) };
  // Multiple HIGH: if the longest is at least 4 chars longer than the
  // next, the longest is the unambiguous specific match — keep HIGH
  // with the shorter ones demoted to alternates. Otherwise the names
  // are similar enough that we shouldn't auto-pick — route through
  // producer-verify.
  if (high.length > 1 && high[0].key.length - high[1].key.length >= 4) {
    return { row, tier: "HIGH", primary: high[0], alternates: high.slice(1) };
  }
  if (high.length > 1) return { row, tier: "MEDIUM", primary: high[0], alternates: high.slice(1) };
  return { row, tier: "MEDIUM", primary: hits[0], alternates: hits.slice(1) };
});

// ─── Print classification table to stdout ──────────────────────────
const counts = { HIGH: 0, MEDIUM: 0, NONE: 0 };
console.log("");
console.log("Card-art resolver — proposed reclassification");
console.log("=".repeat(118));
console.log("Tier    Card id".padEnd(48) + "Card name".padEnd(38) + "Proposed match");
console.log("-".repeat(118));
for (const c of classified) {
  counts[c.tier]++;
  const tag = c.tier.padEnd(7);
  const id = c.row.cardId.length > 38 ? c.row.cardId.slice(0, 36) + "…" : c.row.cardId;
  const name = c.row.cardName.length > 35 ? c.row.cardName.slice(0, 33) + "…" : c.row.cardName;
  const match = c.primary ? c.primary.key : "—";
  console.log(
    `${tag} ${id.padEnd(40)}${name.padEnd(38)}${match}`,
  );
}
console.log("-".repeat(118));
console.log(`Totals — HIGH: ${counts.HIGH}  MEDIUM: ${counts.MEDIUM}  NONE: ${counts.NONE}  (of ${classified.length})`);
console.log("");

// ─── Write the proposed map (dry-run) or mutate live map (apply) ───
function rebuildMap(): string {
  const out: string[] = [];
  // Find the section boundaries
  const headerHigh = mapLines.findIndex((l) => l.startsWith("## Auto-mapped (high confidence)"));
  const headerLow = mapLines.findIndex((l) => l.startsWith("## Auto-mapped (low confidence"));
  const headerUnmapped = mapLines.findIndex((l) => l.startsWith("## Unmapped"));

  // Build the new HIGH table rows from classified HIGH entries
  const newHighRows = classified
    .filter((c) => c.tier === "HIGH" && c.primary)
    .map((c) => {
      const oldPath = c.row.brokenArt;
      const newPath = c.primary!.key;
      const src = c.row.sourcePath;
      return `| \`${c.row.cardId}\` | ${c.row.cardName} | \`${oldPath}\` | \`${newPath}\` | \`${src}\` | resolved by cross-folder scan |`;
    });

  // Replicate the file:
  // 1) preamble through (and including) the "## Auto-mapped (high confidence)" table — append our new HIGH rows at the table end
  for (let i = 0; i < headerLow; i++) {
    out.push(mapLines[i]);
  }
  // Remove trailing blank line(s) before headerLow, ensure we insert before
  while (out.length && out[out.length - 1] === "") out.pop();
  if (newHighRows.length) {
    out.push(...newHighRows);
  }
  out.push("");

  // 2) Low-confidence section unchanged
  for (let i = headerLow; i < headerUnmapped; i++) {
    out.push(mapLines[i]);
  }

  // 3) Rebuild "## Unmapped" with only NONE entries; add a "## Producer verify"
  //    section with MEDIUM entries
  const noneClassified = classified.filter((c) => c.tier === "NONE");

  out.push("## Producer verify — multiple candidates");
  out.push("");
  out.push("| Card id | Card name | Broken | Top candidate | Alternates | Source |");
  out.push("|---|---|---|---|---|---|");
  for (const c of classified.filter((x) => x.tier === "MEDIUM")) {
    const alts = c.alternates.slice(0, 3).map((a) => `\`${a.key}\``).join("<br>") || "—";
    out.push(
      `| \`${c.row.cardId}\` | ${c.row.cardName} | \`${c.row.brokenArt}\` | \`${c.primary?.key ?? "—"}\` | ${alts} | \`${c.row.sourcePath}\` |`,
    );
  }
  out.push("");
  out.push("## Unmapped — commission required");
  out.push("");
  out.push("| Card id | Card name | Broken `art:` | Source |");
  out.push("|---|---|---|---|");
  for (const c of noneClassified) {
    out.push(`| \`${c.row.cardId}\` | ${c.row.cardName} | \`${c.row.brokenArt}\` | \`${c.row.sourcePath}\` |`);
  }
  out.push("");

  return out.join("\n");
}

const proposed = rebuildMap();
const outPath = MODE === "apply" ? MAP_PATH : PROPOSED_PATH;
writeFileSync(outPath, proposed);
console.log(`wrote ${outPath}`);

if (MODE === "dry-run") {
  console.log("");
  console.log("Dry-run complete. Diff against the live map with:");
  console.log(`  git diff --no-index ${MAP_PATH} ${PROPOSED_PATH}`);
  console.log("");
  console.log("To apply: pnpm tsx scripts/audit/resolve-card-art-unmapped.ts --apply");
}
