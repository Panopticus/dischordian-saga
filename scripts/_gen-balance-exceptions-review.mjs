import * as fs from "node:fs";
import * as path from "node:path";

const CARDS_DIR = "apps/shared/tcg-core/cards/definitions";
const REVIEWER = "2026-05-stat-curve-recalibration";

function walk(dir, out=[]) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (name.endsWith(".ts") && !name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

const entries = [];
for (const file of walk(CARDS_DIR)) {
  const src = fs.readFileSync(file, "utf-8");
  if (!src.includes(REVIEWER)) continue;
  // Match only CARD ids (not ability ids). Card ids end in
  // `as CardDefinition["id"]`; ability ids end in
  // `as CardDefinition["abilities"][number]["id"]`.
  const cardIdRe = /id:\s*"([a-z0-9_]+)"\s*as CardDefinition\["id"\]/g;
  const idMatches = [...src.matchAll(cardIdRe)];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
    const block = src.slice(start, end);
    if (!block.includes(REVIEWER)) continue;
    const id = idMatches[i][1];
    const m = (re, dflt = "") => {
      const r = block.match(re);
      return r ? r[1].trim() : dflt;
    };
    entries.push({
      id,
      file: path.relative(".", file),
      name: m(/name:\s*"([^"]+)"/),
      cost: m(/cost:\s*(\d+)/),
      power: m(/power:\s*(\d+)/),
      health: m(/health:\s*(\d+)/),
      keywords: m(/keywords:\s*\[([^\]]*)\]/, "")
        .replace(/["']/g, "").split(",").map(s => s.trim()).filter(Boolean).join(", ") || "—",
      reason: m(/reason:\s*"((?:[^"\\]|\\.)*?)"/),
    });
  }
}

entries.sort((a, b) => Number(a.cost) - Number(b.cost) || a.id.localeCompare(b.id));

let out = `# Balance Exceptions — designer review\n\n`;
out += `> ${entries.length} cards carry \`balanceException\` entries with reviewer \`${REVIEWER}\`. Each was auto-classified by \`apps/scripts/backfill-balance-exceptions.ts\` based on structural heuristics (pet, reward, imprint, ability-driven, etc.). Designer review either rebalances the card (and removes the entry) or upgrades the reason to intent-on-record sign-off, replacing the reviewer field with the human approver's name.\n\n`;
out += `Find them all: \`grep -rln '"${REVIEWER}"' apps/shared/tcg-core/cards/definitions\`\n\n`;
out += `## Review table\n\n`;
out += `| Cost | Card | Stats | Keywords | Auto-reason category | File |\n`;
out += `|------|------|-------|----------|---------------------|------|\n`;
for (const e of entries) {
  const cat = e.reason.startsWith("Pet/companion") ? "pet"
    : e.reason.startsWith("Reward/prestige") ? "reward"
    : e.reason.startsWith("General /") ? "general/imprint"
    : e.reason.startsWith("Thematic-pool") ? "thematic"
    : e.reason.startsWith("Ability-driven") ? "ability-driven"
    : e.reason.startsWith("Aggressive low-cost") ? "low-cost util"
    : "other";
  const rel = e.file.replace("apps/shared/tcg-core/cards/definitions/", "");
  out += `| ${e.cost} | **${e.name}** (\`${e.id}\`) | ${e.power}/${e.health} | ${e.keywords} | ${cat} | \`${rel}\` |\n`;
}
out += `\n## Upgrade workflow\n\n`;
out += `For each card the designer reviews:\n\n`;
out += `1. **Confirm the deviation is intentional.** Check the abilities + keywords against current playtest data. If the stat profile is wrong, rebalance and remove the \`balanceException\` block entirely.\n`;
out += `2. **Upgrade the reason.** Replace the auto-classified text with a one-line designer note that names the specific mechanic justifying the deviation (e.g. "Wraith Calder: rebirth keyword effectively doubles HP; printed line under raw curve compensates").\n`;
out += `3. **Replace the reviewer.** Change \`reviewer: "${REVIEWER}"\` to your name / handle. The string is the audit trail; replacing it signals the entry has been reviewed.\n`;
out += `4. **Remove from this doc.** Delete the card's row.\n\n`;
out += `When the table is empty, delete this doc.\n`;

fs.writeFileSync("docs/operations/BALANCE_EXCEPTIONS_REVIEW.md", out);
console.log(`Wrote review doc with ${entries.length} entries.`);
