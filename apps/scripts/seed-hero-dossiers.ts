/* ═══════════════════════════════════════════════════════
   SEED HERO DOSSIERS — C-pivot.C.1

   One-shot generator. For each of the 10 core Hierarchy
   lords, emits 24 hero dossier files (the 25th, the
   lieutenant, was hand-authored in C-pivot.A.9).

   Run once: pnpm tsx apps/scripts/seed-hero-dossiers.ts

   The script is deterministic — the output is stable
   across re-runs. Names are drawn from class-specific
   pools; lair distribution + power selection are
   tier-weighted. Existing dossier files are NEVER
   overwritten — the script asserts the file does not
   exist before writing.

   This is "templated hand-authoring" — every hero has a
   unique name, lair, tells, and briefing hints, but the
   prose patterns are shared. Writer can polish individual
   dossiers later; the priority is closing the
   wolf_hunt.hero_target_coverage ratchet to 250/250.
   ═══════════════════════════════════════════════════════ */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DOSSIER_ROOT = path.join(
  REPO_ROOT,
  "apps/shared/wolfHunt/heroTargets",
);

type HeroClass = "engineer" | "oracle" | "assassin" | "soldier" | "spy";
type Lord =
  | "mol_garath"
  | "xeth_raal"
  | "riri_ahlia"
  | "zyr_koth"
  | "ith_rael"
  | "syl_vex"
  | "drael_mon"
  | "varkul"
  | "fenra"
  | "mol_vereth";
type Region =
  | "antechamber"
  | "unmakers_court"
  | "ledger_vault"
  | "tasking_yards"
  | "flayers_workshop"
  | "rylloh_galleries"
  | "corrupters_orchard"
  | "cathedral_undercroft"
  | "moonsick_terraces"
  | "trustee_archive";
type Tier = 1 | 2 | 3 | 4;

// ─── Class power pools (must match powerLibrary.ts) ──────
const POWERS: Record<HeroClass, ReadonlyArray<{ id: string; severity: 1 | 2 | 3 }>> = {
  engineer: [
    { id: "severance_protocol_refinement", severity: 3 },
    { id: "iterative_flay", severity: 3 },
    { id: "field_redesign", severity: 2 },
    { id: "telemetry_swarm", severity: 2 },
    { id: "trustee_clause_authoring", severity: 3 },
    { id: "principal_machinery", severity: 3 },
    { id: "anniversary_recursion", severity: 2 },
    { id: "fiduciary_lock", severity: 2 },
    { id: "patch_propagation", severity: 1 },
    { id: "tooling_call", severity: 1 },
  ],
  oracle: [
    { id: "ledger_sight", severity: 3 },
    { id: "contract_recall", severity: 3 },
    { id: "interest_compounder", severity: 2 },
    { id: "default_reckoning", severity: 2 },
    { id: "tidal_prediction", severity: 3 },
    { id: "celestial_indexing", severity: 3 },
    { id: "lunatic_compass", severity: 2 },
    { id: "phase_displacement", severity: 2 },
    { id: "vow_reading", severity: 1 },
    { id: "shape_of_the_loss", severity: 1 },
  ],
  assassin: [
    { id: "soul_taxis", severity: 3 },
    { id: "harvest_pace", severity: 3 },
    { id: "veil_step", severity: 2 },
    { id: "memorial_taking", severity: 2 },
    { id: "cathedral_resonance", severity: 3 },
    { id: "blood_lexicon", severity: 3 },
    { id: "vampiric_economy", severity: 2 },
    { id: "exact_quietus", severity: 2 },
    { id: "shadow_weapon", severity: 1 },
    { id: "ritual_grace", severity: 1 },
  ],
  soldier: [
    { id: "unmaking_command", severity: 3 },
    { id: "rank_compulsion", severity: 3 },
    { id: "executive_charge", severity: 2 },
    { id: "iron_quartermaster", severity: 2 },
    { id: "seven_dimension_siege", severity: 3 },
    { id: "reorganization_doctrine", severity: 3 },
    { id: "attritional_will", severity: 2 },
    { id: "flag_authority", severity: 2 },
    { id: "uniform_disregard", severity: 1 },
    { id: "garrison_recall", severity: 1 },
  ],
  spy: [
    { id: "whisper_inheritance", severity: 3 },
    { id: "thaloria_dialect", severity: 3 },
    { id: "patient_subversion", severity: 2 },
    { id: "shadow_tongue_handle", severity: 2 },
    { id: "cobalt_conversion", severity: 3 },
    { id: "mirror_argument", severity: 3 },
    { id: "consent_extraction", severity: 2 },
    { id: "long_listen", severity: 2 },
    { id: "named_signal", severity: 1 },
    { id: "rumor_seed", severity: 1 },
  ],
};

// ─── Class distributions per lord (24 heroes per lord) ───
// Each row sums to 24 — these are NON-LIEUTENANT counts.
const LORD_CLASS_DIST: Record<Lord, Record<HeroClass, number>> = {
  mol_garath:  { soldier: 10, assassin: 6, engineer: 3, oracle: 3, spy: 2 },
  xeth_raal:   { oracle: 8, engineer: 6, spy: 4, assassin: 4, soldier: 2 },
  riri_ahlia:  { soldier: 11, engineer: 5, oracle: 3, assassin: 3, spy: 2 },
  zyr_koth:    { engineer: 11, assassin: 5, oracle: 3, soldier: 3, spy: 2 },
  ith_rael:    { spy: 11, oracle: 5, assassin: 3, soldier: 3, engineer: 2 },
  syl_vex:     { spy: 8, oracle: 7, assassin: 4, soldier: 3, engineer: 2 },
  drael_mon:   { assassin: 11, oracle: 4, spy: 4, soldier: 3, engineer: 2 },
  varkul:      { assassin: 8, soldier: 6, engineer: 4, oracle: 3, spy: 3 },
  fenra:       { oracle: 11, assassin: 4, spy: 4, engineer: 3, soldier: 2 },
  mol_vereth:  { engineer: 10, spy: 6, oracle: 4, assassin: 2, soldier: 2 },
};

// ─── Home region per lord ────────────────────────────────
const LORD_REGION: Record<Lord, Region> = {
  mol_garath: "unmakers_court",
  xeth_raal: "ledger_vault",
  riri_ahlia: "tasking_yards",
  zyr_koth: "flayers_workshop",
  ith_rael: "rylloh_galleries",
  syl_vex: "corrupters_orchard",
  drael_mon: "corrupters_orchard",
  varkul: "cathedral_undercroft",
  fenra: "moonsick_terraces",
  mol_vereth: "trustee_archive",
};

// ─── Lord epithet phrases ────────────────────────────────
const LORD_EPITHET: Record<Lord, string> = {
  mol_garath: "Mol'Garath the Unmaker",
  xeth_raal: "Xeth'Raal the Ledger Keeper",
  riri_ahlia: "Riri'Ahlia the Taskmaster",
  zyr_koth: "Zyr'Koth the Flayer",
  ith_rael: "Ith'Rael the Whisperer",
  syl_vex: "Syl'Vex the Corruptor",
  drael_mon: "Drael'Mon the Harvester",
  varkul: "Varkul the Blood Lord",
  fenra: "Fenra the Moon Tyrant",
  mol_vereth: "Mol'Vereth the Trustee",
};

// ─── Name pools — first names + family/title for class-mix ──
// Curated to feel canon-adjacent without colliding with existing names.
const FIRST_NAMES = [
  "Aevyn","Brann","Cassi","Davyl","Erith","Ferren","Gida","Halen","Ilya","Joren",
  "Kael","Lyra","Mavik","Niall","Oryn","Pell","Quen","Rhian","Soren","Talia",
  "Ulvi","Vesh","Wynn","Xala","Yarrow","Zofia","Aric","Brya","Cedar","Daven",
  "Esra","Faolan","Gwyn","Hekla","Iohn","Jurel","Kynan","Lieve","Mara","Nessa",
  "Onek","Pravin","Quill","Rema","Sten","Taro","Ulric","Vela","Wren","Xanto",
  "Yorek","Zara","Adros","Bett","Cyril","Daphne","Elen","Faro","Gisla","Hadi",
  "Ines","Jevan","Karis","Lior","Mira","Nyx","Orla","Petra","Ren","Sera",
  "Toma","Una","Vask","Wira","Xen","Yael","Zayd","Aliz","Boran","Cleo",
  "Drev","Edda","Fenra","Garron","Hael","Isolde","Jorah","Kestrel","Linnea","Mosey",
  "Nevin","Ode","Phaedra","Quira","Ryl","Saith","Theia","Ulen","Velka","Wirt",
];

// Class-specific surname/title patterns.
const SURNAMES_BY_CLASS: Record<HeroClass, ReadonlyArray<string>> = {
  engineer: ["Voss","Halt","Ironcaul","Quill-Mark","Spindler","Brace","Drift","Bind","Calbrook","Wrenward","Fettle","Lockerby","Mendsmith","Calipers","Gauge","Trim"],
  oracle: ["Pell","Reads","Forecaster","Indexer","Calibre","Veil","Tracewell","Ledger","Margin","Watch","Sumshore","Beckon","Auspice","Forewright","Quietsee","Pageturner"],
  assassin: ["Hush","Quietus","Veil-Cutter","Last-Note","Marsh","Shadow-Borne","Fallnight","Holloway","Ash-Hand","Tally","Endsign","Crocus","Salt","Owl","Threshold","Coin"],
  soldier: ["Marsh","Standardbearer","Bastion","Rank","Quartermaster","Wallborn","Flagcaller","Ironside","Holdfast","Gardener-of-Lines","Cohort","Drill","Shieldwall","Vanguard","Ranks","Marshal"],
  spy: ["Listener","Long-Ear","Mirror","Half-Tongue","Soft-Tread","Quiet-Step","Side-Door","Two-Hands","Postmaster","Rumour","Faded","Foundling","Smoke","Cipher","Letter","Bind"],
};

// Tells per class (variations) — picked deterministically per hero.
const TELLS_BY_CLASS: Record<HeroClass, ReadonlyArray<string>> = {
  engineer: [
    "Revises the engagement's geometry as he fights — favourable cover becomes hostile.",
    "Speaks to her hands as if they were a separate crew.",
    "Refuses to commit to a tactic she has used before.",
    "Carries tools signed by the lord and by her in the same hand.",
    "Counts her revisions out loud — the second is the operational one.",
    "Reads the room's ambient telemetry before the first move.",
    "Holds a folded contract in his off-hand that updates itself.",
    "Reorders his own anatomy between strikes.",
  ],
  oracle: [
    "Names the next four moves before the first.",
    "Recites the hunter's vows back to him at unhelpful moments.",
    "Describes the hunter's eventual loss aloud, then attempts it.",
    "Reads the engagement's celestial alignment before committing.",
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar.",
    "Names every promise the hunter has made aloud.",
    "Compounds the cost of the hunter's repeated choices.",
  ],
  assassin: [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse.",
    "Strikes only on the exact breath he chose in advance.",
    "Carries a weapon composed of the hunter's afterimage.",
    "Performs a brief sacrament before each kill.",
    "Takes the dead's last memory along with the life.",
  ],
  soldier: [
    "Salutes an empty seat to her right before every order.",
    "Reorders his guard formation mid-fight — the formation is the attack.",
    "Refuses to retreat from a structured engagement.",
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance.",
    "Calls a reserve unit on a delayed cadence.",
  ],
  spy: [
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived.",
    "Speaks the Shadow Tongue when uncorrupted listeners are present.",
    "Argues the hunter into his opposite without raising the voice.",
    "Knows the hunter's name in a register he has not used since boyhood.",
    "Plants a false rumour that returns as accepted truth.",
    "Carries a cobalt thread visible only when she laughs.",
    "Extracts agreement under reasonable framing.",
  ],
};

// Briefing hints — per lord × class. Two woven phrases.
function briefingHintsFor(lord: Lord, cls: HeroClass, name: string, tier: Tier): string[] {
  const formerRole = formerRoleFor(cls);
  const corruption = corruptionMomentFor(lord, cls);
  const consequence = tierConsequence(tier);
  return [
    `${name} served the League as a ${formerRole} before ${corruption}.`,
    `${LORD_EPITHET[lord]} now uses ${cls === "oracle" || cls === "engineer" ? "her" : "him"} to ${consequence}.`,
  ];
}

function formerRoleFor(cls: HeroClass): string {
  switch (cls) {
    case "engineer": return "field engineer in the League's frontier-design corps";
    case "oracle": return "auspice keeper on the Witness Council";
    case "assassin": return "retrieval specialist in the League's quiet branch";
    case "soldier": return "ranking officer in the League's standing line";
    case "spy": return "long-listen officer in the League's counter-intelligence";
  }
}

function corruptionMomentFor(lord: Lord, cls: HeroClass): string {
  const base: Record<Lord, string> = {
    mol_garath: "the Unmaker pulled rank on the chain of command they had once trusted",
    xeth_raal: "the Ledger Keeper opened a contract clause they did not read aloud",
    riri_ahlia: "the Taskmaster reorganised them onto a curriculum they had not been told existed",
    zyr_koth: "the Flayer revised them — third iteration is the operational one",
    ith_rael: "the Whisperer turned them across a window of decades",
    syl_vex: "the Corruptor wove a cobalt thread into their decision-making",
    drael_mon: "the Harvester paid them, in advance, for the souls they had not yet brought him",
    varkul: "the Blood Lord invited them into the Cathedral as visitor and they stayed",
    fenra: "the Moon Tyrant charted them from the inside",
    mol_vereth: "the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself",
  };
  return base[lord];
}

function tierConsequence(tier: Tier): string {
  switch (tier) {
    case 1: return "scout the threshold rooms";
    case 2: return "hold a cell of the Crucible's lattice";
    case 3: return "drive a substantive operation against League material";
    case 4: return "anchor a load-bearing column of the corruption";
  }
}

// ─── Generation ──────────────────────────────────────────

function pickPowers(cls: HeroClass, tier: Tier, seedIndex: number): { id: string; category: HeroClass; severity: 1 | 2 | 3 }[] {
  // 3 powers at tier 1, 4 at tier 2-3, 5 at tier 4.
  const count = tier === 1 ? 3 : tier === 2 ? 4 : tier === 3 ? 4 : 5;
  // Severity ceiling scales with tier (tier 1 → cap 2, tier 2 → cap 2, tier 3 → cap 3, tier 4 → cap 3).
  // Cap 2 minimum so the pool always has enough entries for the requested count.
  const cap = tier <= 2 ? 2 : 3;
  const pool = POWERS[cls].filter((p) => p.severity <= cap);
  // Rotate pool by seedIndex to ensure heroes feel distinct.
  const rotated = [...pool.slice(seedIndex % pool.length), ...pool.slice(0, seedIndex % pool.length)];
  return rotated.slice(0, count).map((p) => ({ id: p.id, category: cls, severity: p.severity }));
}

function pickTells(cls: HeroClass, seedIndex: number): string[] {
  const pool = TELLS_BY_CLASS[cls];
  // 1-3 tells per hero, rotated by seed.
  const start = seedIndex % pool.length;
  const count = 1 + (seedIndex % 3);
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

function pickRegion(lord: Lord, tier: Tier, seedIndex: number): Region {
  // Tier-1 heroes lair anywhere; higher tiers lean toward lord's home region.
  if (tier === 4 || (tier === 3 && seedIndex % 3 === 0)) return LORD_REGION[lord];
  // Otherwise pick across all regions deterministically.
  const REGIONS: Region[] = [
    "antechamber", "unmakers_court", "ledger_vault", "tasking_yards", "flayers_workshop",
    "rylloh_galleries", "corrupters_orchard", "cathedral_undercroft", "moonsick_terraces", "trustee_archive",
  ];
  return REGIONS[(seedIndex + tier) % REGIONS.length];
}

function pickName(cls: HeroClass, seedIndex: number): { displayName: string; idSlug: string } {
  const first = FIRST_NAMES[seedIndex % FIRST_NAMES.length];
  const surnames = SURNAMES_BY_CLASS[cls];
  const surname = surnames[seedIndex % surnames.length];
  // Some classes get titles.
  const title = (() => {
    switch (cls) {
      case "engineer": return seedIndex % 4 === 0 ? "Praxis-" : "Architect";
      case "oracle": return seedIndex % 3 === 0 ? "Scribe" : "Auspex";
      case "assassin": return seedIndex % 5 === 0 ? "Quietus" : "Reaper";
      case "soldier": return seedIndex % 4 === 0 ? "Captain" : seedIndex % 4 === 1 ? "Lieutenant" : "Sergeant";
      case "spy": return seedIndex % 3 === 0 ? "Listener" : "Handler";
    }
  })();
  const displayName = cls === "engineer" && title.endsWith("-")
    ? `${title}${first} ${surname}`
    : `${title} ${first} ${surname}`;
  const safeFirst = first.toLowerCase().replace(/'/g, "");
  const safeSurname = surname.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const idSlug = `${safeTitle}_${safeFirst}_${safeSurname}`;
  return { displayName, idSlug };
}

interface HeroDossier {
  id: string;
  name: string;
  classKey: HeroClass;
  corruptorLord: Lord;
  threatTier: Tier;
  isBossLieutenant: false;
  powerSet: { id: string; category: HeroClass; severity: 1 | 2 | 3 }[];
  tells: string[];
  lairLocation: Region;
  briefingHints: string[];
}

function buildDossiers(): { [lord in Lord]: HeroDossier[] } {
  const out: Partial<Record<Lord, HeroDossier[]>> = {};
  const usedIds = new Set<string>();
  let seed = 0;
  for (const lord of Object.keys(LORD_CLASS_DIST) as Lord[]) {
    const dist = LORD_CLASS_DIST[lord];
    const heroes: HeroDossier[] = [];
    const classes: HeroClass[] = ["engineer", "oracle", "assassin", "soldier", "spy"];
    let perLordIdx = 0;
    for (const cls of classes) {
      const n = dist[cls];
      for (let i = 0; i < n; i += 1) {
        seed += 1;
        const tier = (1 + (perLordIdx % 4)) as Tier;
        let nm = pickName(cls, seed);
        // Disambiguate id collisions deterministically.
        let suffix = 0;
        let candidateId = `${nm.idSlug}_${lord.split("_")[0]}`;
        while (usedIds.has(candidateId)) {
          suffix += 1;
          candidateId = `${nm.idSlug}_${lord.split("_")[0]}_${suffix}`;
        }
        usedIds.add(candidateId);
        heroes.push({
          id: candidateId,
          name: nm.displayName,
          classKey: cls,
          corruptorLord: lord,
          threatTier: tier,
          isBossLieutenant: false,
          powerSet: pickPowers(cls, tier, seed),
          tells: pickTells(cls, seed),
          lairLocation: pickRegion(lord, tier, seed),
          briefingHints: briefingHintsFor(lord, cls, nm.displayName, tier),
        });
        perLordIdx += 1;
      }
    }
    out[lord] = heroes;
  }
  return out as { [lord in Lord]: HeroDossier[] };
}

function constNameFor(id: string): string {
  return id.toUpperCase();
}

function dossierFileBody(d: HeroDossier): string {
  const constName = constNameFor(d.id);
  return `import type { HeroTarget } from "../../types/HeroTarget";

export const ${constName}: HeroTarget = ${JSON.stringify(
    {
      id: d.id,
      name: d.name,
      classKey: d.classKey,
      corruptorLord: d.corruptorLord,
      threatTier: d.threatTier,
      isBossLieutenant: d.isBossLieutenant,
      powerSet: d.powerSet,
      tells: d.tells,
      lairLocation: d.lairLocation,
      briefingHints: d.briefingHints,
    },
    null,
    2,
  )};
`;
}

function main() {
  const dossiers = buildDossiers();
  let written = 0;
  for (const lord of Object.keys(dossiers) as Lord[]) {
    const dir = path.join(DOSSIER_ROOT, lord);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (const d of dossiers[lord]) {
      const fp = path.join(dir, `${d.id}.ts`);
      if (fs.existsSync(fp)) {
        // Skip — don't overwrite hand-authored content.
        continue;
      }
      fs.writeFileSync(fp, dossierFileBody(d), "utf-8");
      written += 1;
    }
  }
  console.log(`Wrote ${written} new dossier files.`);

  // Now regenerate the heroTargets/index.ts barrel.
  const allLords = Object.keys(dossiers) as Lord[];
  const allDossiers: HeroDossier[] = [];
  for (const lord of allLords) {
    allDossiers.push(...dossiers[lord]);
  }

  // Also include the 10 already-authored lieutenants by reading the directory.
  const lieutenantEntries: Array<{ lord: Lord; id: string; constName: string }> = [];
  for (const lord of allLords) {
    const dir = path.join(DOSSIER_ROOT, lord);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".ts")) continue;
      const id = file.replace(/\.ts$/, "");
      const isGenerated = allDossiers.some((d) => d.id === id);
      if (isGenerated) continue;
      // Lieutenant — read the const name from the file.
      const src = fs.readFileSync(path.join(dir, file), "utf-8");
      const m = src.match(/export const (\w+):/);
      if (!m) {
        throw new Error(`could not parse const name in ${dir}/${file}`);
      }
      lieutenantEntries.push({ lord, id, constName: m[1] });
    }
  }

  const allEntries = [
    ...lieutenantEntries.map((e) => ({
      lord: e.lord,
      id: e.id,
      constName: e.constName,
    })),
    ...allDossiers.map((d) => ({
      lord: d.corruptorLord,
      id: d.id,
      constName: constNameFor(d.id),
    })),
  ];

  // Group imports by lord directory.
  const imports = allEntries
    .map((e) => `import { ${e.constName} } from "./${e.lord}/${e.id}";`)
    .join("\n");
  const spread = allEntries.map((e) => `  ${e.constName},`).join("\n");

  const barrelSrc = `/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero target registry

   Single source of truth for the 250-hero Wolf-Anara
   hunt matrix. Every dossier is imported here and
   validated through heroTargetSchema at module load.

   Authoring cadence: the registry ships partial and
   ratchets toward 250. The ship-check parity row
   \`wolfHunt.hero_target_coverage\` enforces non-regression;
   the \`wolfHunt.boss_lieutenant_coverage\` row enforces
   hard parity 10/10 on the lieutenant subset.

   File layout: dossiers live under
   \`<lordKey>/<heroId>.ts\`, one file per hero. Adding a
   hero is: (1) author the dossier file, (2) import it
   here, (3) spread it into ALL_HERO_TARGETS. The bulk of
   the registry was generated by apps/scripts/seed-hero-
   dossiers.ts (C-pivot.C.1); the 10 lieutenants were
   hand-authored.
   ═══════════════════════════════════════════════════════ */

import type { HeroTarget } from "../types/HeroTarget";
import { CORE_HIERARCHY_LORD_IDS } from "../types/HeroTarget";
import type { CoreHierarchyLordId } from "../types/HeroTarget";
import { heroTargetSchema } from "./schema";

${imports}

const HERO_TARGET_DEFS: ReadonlyArray<HeroTarget> = [
${spread}
];

// Validate every dossier at module load. Throws on first failure.
for (const def of HERO_TARGET_DEFS) {
  heroTargetSchema.parse(def);
}

// Enforce id uniqueness across the registry.
{
  const seen = new Set<string>();
  for (const def of HERO_TARGET_DEFS) {
    if (seen.has(def.id)) {
      throw new Error(
        \`wolfHunt heroTargets: duplicate id "\${def.id}" — every dossier must have a unique id.\`,
      );
    }
    seen.add(def.id);
  }
}

/** All hero targets currently shipped, in registration order. */
export const ALL_HERO_TARGETS: ReadonlyArray<HeroTarget> = HERO_TARGET_DEFS;

/** Canonical full count of the hero matrix (10 lords × 25 heroes). */
export const HERO_TARGET_FULL_MATRIX_COUNT = 250;

/** Canonical lieutenant count (one per lord). */
export const HERO_TARGET_LIEUTENANT_COUNT = 10;

/** Look up a hero target by id. Throws if not found. */
export function getHeroTarget(id: string): HeroTarget {
  const found = ALL_HERO_TARGETS.find((h) => h.id === id);
  if (!found) {
    throw new Error(\`wolfHunt: unknown hero target id "\${id}"\`);
  }
  return found;
}

/** Return every lieutenant in registration order. */
export function getLieutenants(): ReadonlyArray<HeroTarget> {
  return ALL_HERO_TARGETS.filter((h) => h.isBossLieutenant);
}

/** Return every hero corrupted by a given lord. */
export function getHeroesByLord(
  lordId: CoreHierarchyLordId,
): ReadonlyArray<HeroTarget> {
  return ALL_HERO_TARGETS.filter((h) => h.corruptorLord === lordId);
}

/** Map of lord id → count of heroes registered under that lord. */
export function getLordCohortSizes(): Readonly<Record<CoreHierarchyLordId, number>> {
  const out = Object.fromEntries(
    CORE_HIERARCHY_LORD_IDS.map((id) => [id, 0]),
  ) as Record<CoreHierarchyLordId, number>;
  for (const h of ALL_HERO_TARGETS) {
    out[h.corruptorLord] += 1;
  }
  return out;
}
`;

  const barrelPath = path.join(DOSSIER_ROOT, "index.ts");
  fs.writeFileSync(barrelPath, barrelSrc, "utf-8");
  console.log(`Rewrote ${barrelPath} with ${allEntries.length} entries.`);
}

main();
