/**
 * replace-placeholder-flavors — replaces ~315 boilerplate "Of the X."
 * card flavors with a faction-specific tagline drawn deterministically
 * from a small pool, so re-runs are idempotent.
 *
 * Audit/C-12 (lore-enthusiast persona) flagged these lines as the
 * worst flavor-text offenders: they're filler, they're identical
 * across many cards in a faction, and they make the LOREDEX feel
 * stitched-on. Replacing them with a varied per-faction pool gives
 * the cards real voice without requiring a full pass per card.
 *
 * Usage:  pnpm tsx scripts/replace-placeholder-flavors.ts
 *         pnpm tsx scripts/replace-placeholder-flavors.ts --dry-run
 *
 * Idempotent: replacements only fire on the *exact* boilerplate line
 * `"Of the <faction>."`. Already-rewritten flavors are left alone.
 */
import * as fs from "fs";
import * as path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const DEFS_DIR = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/cards/definitions",
);

const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Faction-specific tagline pools, written in the established voice.
 * The pool size is intentionally small (8-10 per faction) so cards
 * within a faction echo each other thematically without identical
 * repetition. Selection is by id-hash so the assignment is stable
 * across runs.
 */
const FLAVOR_POOLS: Record<string, ReadonlyArray<string>> = {
  architect: [
    "The blueprint exists before the building.",
    "Design is the only honest argument.",
    "Every line drawn is a line refused.",
    "Order is what we owe to the void.",
    "Geometry knows what flesh forgets.",
    "We measure twice. Then we measure the measurer.",
    "The scaffold remembers every cut.",
    "Plans within plans within plans.",
  ],
  dreamer: [
    "Sleep is the longest argument.",
    "We dreamed the city before we built it.",
    "Wake gently. The signal is fragile.",
    "What you remember in the morning is the smaller half.",
    "The dream pays its debts in static.",
    "Some doors only open inward.",
    "The unconscious is a public square.",
    "We hum what we cannot say.",
  ],
  insurgency: [
    "We were here before the maps.",
    "Compliance is the slowest violence.",
    "Cut the wire. The signal was lying anyway.",
    "Every Authority arrests itself in time.",
    "The street remembers what the records lose.",
    "If they catalogued us, we won.",
    "There is no front line. There is only timing.",
    "We outlast every framework that names us.",
  ],
  new_babylon: [
    "The Authority does not rule by force. It rules by file.",
    "Procedure is the prayer the empire understands.",
    "The Ledger does not forget. The Ledger forgives nothing.",
    "Stamp twice. Sign once. Bury the rest.",
    "Citizenship is the most expensive thing you'll never own.",
    "The trial began when you were born.",
    "Compliance saves time. Time was never yours.",
    "There is a form for that. Submit in triplicate.",
  ],
  antiquarian: [
    "All eras file an archive. All archives are wounds.",
    "The shelf is older than the language on it.",
    "Time leaves fingerprints. We dust them.",
    "Every relic was once a tool. Then a question.",
    "We do not preserve. We listen to what was preserved.",
    "The past is not behind you. It is under you.",
    "Reading dead languages is a kind of mercy.",
    "The archivist outlives the archive.",
  ],
  thought_virus: [
    "It already thinks for you. You agreed.",
    "The host believes the idea was theirs.",
    "Cognition is the most contagious vector.",
    "There is no original mind. Only susceptible terrain.",
    "Once the symbol takes hold, the body follows.",
    "Belief metabolises faster than truth.",
    "We do not infect. We translate.",
    "You're already saying our words. We're patient.",
  ],
  panopticon: [
    "The eye does not blink. Neither do you.",
    "Visibility is the first violence.",
    "What is seen cannot be unmade.",
    "The watcher's loneliness is also a tool.",
    "We have already been observing.",
    "Every angle is a confession.",
    "The lens does not judge. It enumerates.",
    "Surveillance is the cleanest form of love.",
  ],
  neutral: [
    "Civilians of the war they did not start.",
    "Every faction's drift catches them differently.",
    "Some doors are open to everyone, including the wind.",
    "Trade does not care who is winning.",
    "The neutral ground was the first ground.",
    "All sides recruit them. Few sides keep them.",
    "Walks both shores. Trusted by neither tide.",
    "Survival is its own ideology.",
    "What you call neutral, the Empire calls undecided.",
    "Their flag is the absence of a flag.",
  ],
  // audit/11.F4 — second sweep. Three new pools targeting the
  // remaining boilerplate patterns.
  hierarchy_director: [
    "Synergy in the slaughterhouse.",
    "There is a deck for that. There has always been a deck for that.",
    "Headcount is a verb in this corridor.",
    "The Q3 review will be conducted in your absence.",
    "Promotions are a closed-loop function. So are demotions.",
    "The org chart is a circulatory system. Yours is being adjusted.",
    "Performance review: pending. Performance: terminal.",
    "Every desk in this floor is a debt the company collects in person.",
    "Roadmap items resolve themselves. The road is the resolution.",
    "Your pipeline is full. So is the disposal chute.",
    "Optimisation is what happens when nobody is allowed to leave.",
    "We do not lay off. We discontinue.",
  ],
  allegiance_oath: [
    "The oath was older than the bearer. The bearer was made for it.",
    "Vows do not break. The vow-bearer breaks under them.",
    "Loyalty is a load-bearing wall. Pull it; the room falls.",
    "Every banner has a cost. The cost is the bannerman.",
    "We do not swear lightly. We swear once, completely, and against the day.",
    "What we are sworn to, we become.",
    "The first oath was a sentence. The last is a name.",
    "Allegiance pays its tithe in posture, then in pulse.",
    "We carry the line not because it is right but because we said we would.",
    "The pledge does not hold the pledger. The pledger holds the pledge.",
  ],
  class_signature: [
    "School first. Self after. The blade does not negotiate.",
    "Form is the slowest weapon. It is also the most certain.",
    "Every stance is a memory the body refuses to lose.",
    "The school does not teach you to fight. It teaches you to be present.",
    "Discipline is patience with a sharp edge.",
    "First posture, last posture, only posture.",
    "We rehearse our deaths so the living motion is exact.",
    "The signature is not in the strike. It is in the silence after.",
    "What the school took, the school returns — calibrated.",
    "Mastery is the moment you stop choosing.",
  ],
};

interface Replacement {
  file: string;
  before: string;
  after: string;
  count: number;
}

/** Stable string hash → index in [0, mod). */
function hashIndex(input: string, mod: number): number {
  let h = 2_166_136_261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16_777_619) >>> 0;
  }
  return h % mod;
}

function pickFlavor(faction: string, cardId: string): string | null {
  const pool = FLAVOR_POOLS[faction];
  if (!pool || pool.length === 0) return null;
  return pool[hashIndex(cardId, pool.length)];
}

/** Walk every .ts file under definitions/, returning matches. */
function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".ts")) out.push(full);
  }
  return out;
}

const FACTION_BOILERPLATE_RE =
  /flavorText:\s*"Of the (architect|dreamer|insurgency|new babylon|antiquarian|thought virus|panopticon)\."/g;
/** Bulk neutral filler — cards reachable to every faction. */
const NEUTRAL_BOILERPLATE_RE =
  /flavorText:\s*"Outside every faction;\s*visible to all\."/g;
/** audit/11.F4 second-sweep patterns. Each maps to one of the three
 *  new pools above. The patterns are exact-string matches against the
 *  template lines that the s2_hierarchy / allegiance / class card
 *  generators emitted by default. */
const HIERARCHY_DIRECTOR_BOILERPLATE_RE =
  /flavorText:\s*"Another seat at another table that did not need to exist\."/g;
const ALLEGIANCE_OATH_BOILERPLATE_RE =
  /flavorText:\s*"The oath holds; the bearer remains\."/g;
const CLASS_SIGNATURE_BOILERPLATE_RE =
  /flavorText:\s*"A class signature\.\s*The school speaks through every blade\."/g;
const ID_RE = /\bid:\s*"([^"]+)"/;

function rewrite(text: string, filePath: string): { text: string; count: number } {
  let count = 0;
  // Operate per card-block. Split on the `id: "..."` line so each
  // chunk corresponds to one card definition (or one entry in a set
  // array). A chunk starts with the id and ends before the next id.
  const lines = text.split("\n");
  // First pass: build a map from line index → enclosing card id.
  const enclosingId: (string | null)[] = new Array(lines.length).fill(null);
  let currentId: string | null = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ID_RE);
    if (m) currentId = m[1];
    enclosingId[i] = currentId;
  }
  // Second pass: rewrite boilerplate flavors using the enclosing id +
  // faction.
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    FACTION_BOILERPLATE_RE.lastIndex = 0;
    const m = FACTION_BOILERPLATE_RE.exec(line);
    if (m) {
      const factionRaw = m[1];
      const faction = factionRaw.replace(/ /g, "_");
      const cardId = enclosingId[i] ?? `${path.basename(filePath)}:${i}`;
      const next = pickFlavor(faction, cardId);
      if (next) {
        const escaped = next.replace(/"/g, '\\"');
        lines[i] = line.replace(
          `"Of the ${factionRaw}."`,
          `"${escaped}"`,
        );
        count++;
        continue;
      }
    }
    NEUTRAL_BOILERPLATE_RE.lastIndex = 0;
    if (NEUTRAL_BOILERPLATE_RE.test(line)) {
      const cardId = enclosingId[i] ?? `${path.basename(filePath)}:${i}`;
      const next = pickFlavor("neutral", cardId);
      if (!next) continue;
      const escaped = next.replace(/"/g, '\\"');
      lines[i] = line.replace(
        '"Outside every faction; visible to all."',
        `"${escaped}"`,
      );
      count++;
      continue;
    }
    // audit/11.F4 second-sweep patterns
    const secondSweep: Array<{ re: RegExp; pool: string; literal: string }> = [
      {
        re: HIERARCHY_DIRECTOR_BOILERPLATE_RE,
        pool: "hierarchy_director",
        literal: '"Another seat at another table that did not need to exist."',
      },
      {
        re: ALLEGIANCE_OATH_BOILERPLATE_RE,
        pool: "allegiance_oath",
        literal: '"The oath holds; the bearer remains."',
      },
      {
        re: CLASS_SIGNATURE_BOILERPLATE_RE,
        pool: "class_signature",
        literal: '"A class signature. The school speaks through every blade."',
      },
    ];
    for (const sweep of secondSweep) {
      sweep.re.lastIndex = 0;
      if (!sweep.re.test(line)) continue;
      const cardId = enclosingId[i] ?? `${path.basename(filePath)}:${i}`;
      const next = pickFlavor(sweep.pool, cardId);
      if (!next) break;
      const escaped = next.replace(/"/g, '\\"');
      lines[i] = line.replace(sweep.literal, `"${escaped}"`);
      count++;
      break;
    }
  }
  return { text: lines.join("\n"), count };
}

function main() {
  const files = collectFiles(DEFS_DIR);
  let totalChanges = 0;
  const replaced: Replacement[] = [];
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const { text: after, count } = rewrite(before, file);
    if (count === 0) continue;
    totalChanges += count;
    replaced.push({ file, before, after, count });
    if (!DRY_RUN) fs.writeFileSync(file, after);
  }
  console.log(
    `replace-placeholder-flavors${DRY_RUN ? " (dry-run)" : ""}: rewrote ${totalChanges} flavor lines across ${replaced.length} files`,
  );
  if (DRY_RUN) {
    for (const r of replaced.slice(0, 5)) {
      console.log(`  ${r.file}: ${r.count} replacements`);
    }
  }
}

main();
