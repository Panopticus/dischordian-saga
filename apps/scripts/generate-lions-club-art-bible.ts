#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   LIONS CLUB / ORDER OF THE DREAMER — ART PROMPT BIBLE

   Reads every art-prompt surface added by the DGRS Lions
   Club work and emits a single production-ready markdown
   document matching the style of output/suit-art-prompts.md.

   Sources:
     - apps/shared/recurringSuitArtPrompts.ts
       (seasonal / seasonal-event / annual-vote / Iron Lion —
       500 composed prompts through §G.8 template)
     - apps/shared/dreamerOrder.ts
       (10 Dreamer tier trophies, 5 progress badges, 1 mythic
       template via getMythicInscriptionPrompt)
     - apps/client/src/data/events/christmasInJuly/festiveRewards.ts
       (3 event-window-exclusive donor trophies)

   Usage:
     pnpm lions-art:generate-md
     pnpm lions-art:generate-md --output <path>
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  RECURRING_SUIT_ART_PROMPTS,
  RECURRING_SUIT_SET_ROSTER,
  type RecurringSuitArtPrompt,
  type RecurringSuitSetDef,
} from "../shared/recurringSuitArtPrompts";
import {
  DREAMER_DOLLARS_PER_LEVEL,
  DREAMER_MAX_LEVEL,
  DREAMER_PROGRESS_BADGES,
  DREAMER_TIERS,
  getMythicInscriptionPrompt,
  type DreamerProgressBadge,
  type DreamerTier,
} from "../shared/dreamerOrder";
import {
  ELEMENT_PALETTES,
  NEUTRAL_ELEMENT_PALETTE,
  NEUTRAL_SPECIES_DECAL,
  RARITY_LABELS,
  RARITY_MODIFIERS,
  SPECIES_DECALS,
  SUIT_PIVOT_POINTS,
  SUIT_PREAMBLE,
  SUIT_SLOT_ORDER,
  type Rarity,
} from "../shared/suitArtPrompts";
import {
  IRON_CLAD_LIONS_FACTION,
  IRON_CLAD_LIONS_FOUNDING_NARRATIVE,
  IRON_CLAD_LIONS_NAMED_MEMBERS,
  IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE,
  IRON_CLAD_LIONS_RECRUITERS,
  IRON_CLAD_LIONS_VESSEL,
} from "../shared/factions/ironCladLions";
import {
  FESTIVE_REWARDS,
  type FestiveReward,
} from "../client/src/data/events/christmasInJuly/festiveRewards";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const DEFAULT_OUTPUT_PATH = path.join(
  REPO_ROOT,
  "output/lions-club-art-bible.md",
);

function parseArgs(argv: readonly string[]): { output: string } {
  let output = DEFAULT_OUTPUT_PATH;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--output" && i + 1 < argv.length) {
      output = path.resolve(REPO_ROOT, argv[++i]);
    }
  }
  return { output };
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function categoryLabel(cat: RecurringSuitSetDef["category"]): string {
  switch (cat) {
    case "seasonal":
      return "Seasonal";
    case "seasonal-event":
      return "Seasonal event";
    case "annual-vote":
      return "Annual governance vote";
    case "annual-founder":
      return "Annual founder rental";
  }
}

/* ─── Markdown section builders ─── */

function header(): string {
  const totalRecurring = RECURRING_SUIT_ART_PROMPTS.length;
  const countsByCategory: Record<string, number> = {};
  for (const set of RECURRING_SUIT_SET_ROSTER) {
    const cnt = set.rarities.length * SUIT_SLOT_ORDER.length;
    countsByCategory[set.category] = (countsByCategory[set.category] ?? 0) + cnt;
  }
  const catSummary = Object.entries(countsByCategory)
    .map(([k, v]) => `${k} ${v}`)
    .join(" · ");

  const donorTrophies = FESTIVE_REWARDS.filter((r) => r.type === "trophy");
  const dreamerCount = DREAMER_TIERS.length + DREAMER_PROGRESS_BADGES.length;
  const grandTotal = totalRecurring + dreamerCount + donorTrophies.length;

  return `# DGRS Lions Club + Order of the Dreamer — Art Prompt Bible

_Generated from_
\`apps/shared/recurringSuitArtPrompts.ts\`,
\`apps/shared/dreamerOrder.ts\`, and
\`apps/client/src/data/events/christmasInJuly/festiveRewards.ts\`.
_Do not hand-edit — regenerate via_ \`pnpm lions-art:generate-md\`.

- **Recurring suit prompts:** ${totalRecurring} (${catSummary})
- **Order of the Dreamer:** ${DREAMER_TIERS.length} trophy tiers · ${DREAMER_PROGRESS_BADGES.length} progress badges · 1 mythic template (level-100 inscription)
- **Christmas-in-July donor trophies:** ${donorTrophies.length}
- **Grand total prompts:** ${grandTotal}
- **Recurring suit resolution (baked in preamble):** 1024×1536
- **Recurring suit asset id format:** \`recurring:<setId>:<rarity>:<slot>\`
`;
}

function factionSection(): string {
  const recruitersList = IRON_CLAD_LIONS_RECRUITERS.map(
    (r) => `- **${r.name}** — ${r.role}`,
  ).join("\n");

  const namedList = IRON_CLAD_LIONS_NAMED_MEMBERS.map(
    (m) => `- **${m.name}** _(${m.rank})_ — ${m.role}`,
  ).join("\n");

  return `
## The Iron Clad Lions — canon the art must honor

Every rental-suit piece is worn by a member of this order. Artists
should keep these facts in mind while rendering: the armor is a
lease, the ship is a temporal-navigator, and the service is real.

- **Creed:** _${IRON_CLAD_LIONS_FACTION.creed}_
- **Inspiration:** ${IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.battle} (Year ${IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.yearAA.toLocaleString()} A.A.) — ${IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.summary}
- **Epitaph:** _"${IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.epitaph}"_
- **Mission:** ${IRON_CLAD_LIONS_FOUNDING_NARRATIVE.mission}
- **Flagship:** ${IRON_CLAD_LIONS_VESSEL.name} — ${IRON_CLAD_LIONS_VESSEL.summary}

### Recruited by

${recruitersList}

### Named members

${namedList}

### Real-world service

${IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE}
`;
}

function baselineSection(): string {
  return `
## Shared preamble (baked into every recurring-suit prompt)

Every recurring-suit prompt below inherits this preamble verbatim.
Prepend it when submitting an individual piece prompt to the art
backend; the composed prompt body already appends the motif, rarity
modifier, element palette, species decal, and pivot points.

> ${SUIT_PREAMBLE}

### Pivot points (baked into every piece body)

> ${SUIT_PIVOT_POINTS}

### Rarity visual modifiers

| Rarity | Label | Modifier |
| --- | --- | --- |
${(
    Object.keys(RARITY_MODIFIERS) as Rarity[]
  )
    .map(
      (r) => `| \`${r}\` | ${RARITY_LABELS[r]} | ${RARITY_MODIFIERS[r]} |`,
    )
    .join("\n")}

### Element palettes

| Element | Palette |
| --- | --- |
${Object.entries(ELEMENT_PALETTES)
    .map(([k, v]) => `| \`${k}\` | ${v} |`)
    .join("\n")}

Neutral palette (no element tint baked at catalog time):
_${NEUTRAL_ELEMENT_PALETTE}_

### Species decals

| Species | Decal |
| --- | --- |
${Object.entries(SPECIES_DECALS)
    .map(([k, v]) => `| \`${k}\` | ${v} |`)
    .join("\n")}

Neutral decal: _${NEUTRAL_SPECIES_DECAL}_
`;
}

function tableOfContents(): string {
  const bySet = new Map<string, RecurringSuitSetDef>();
  for (const set of RECURRING_SUIT_SET_ROSTER) bySet.set(set.id, set);

  const bySection: Record<string, string[]> = {
    seasonal: [],
    "seasonal-event": [],
    "annual-vote": [],
    "annual-founder": [],
  };
  for (const set of RECURRING_SUIT_SET_ROSTER) {
    bySection[set.category].push(
      `  - [${set.name}](#${slug(set.id)})`,
    );
  }

  return `
# Table of contents

- [The Iron Clad Lions — canon the art must honor](#the-iron-clad-lions--canon-the-art-must-honor)
- [Shared preamble](#shared-preamble-baked-into-every-recurring-suit-prompt)
- [Seasonal suits](#seasonal-suits)
${bySection["seasonal"].join("\n")}
- [Seasonal-event suits](#seasonal-event-suits)
${bySection["seasonal-event"].join("\n")}
- [Annual governance-vote suits](#annual-governance-vote-suits)
${bySection["annual-vote"].join("\n")}
- [Annual founder rental — Iron Clad Lions Ceremonial](#annual-founder-rental--iron-clad-lions-ceremonial)
${bySection["annual-founder"].join("\n")}
- [Order of the Dreamer — trophy tiers](#order-of-the-dreamer--trophy-tiers)
- [Order of the Dreamer — progress badges](#order-of-the-dreamer--progress-badges)
- [Order of the Dreamer — mythic inscription template (level 100)](#order-of-the-dreamer--mythic-inscription-template-level-100)
- [Christmas-in-July donor trophies](#christmas-in-july-donor-trophies)
`;
}

function setSection(set: RecurringSuitSetDef): string {
  const prompts = RECURRING_SUIT_ART_PROMPTS.filter((p) => p.setId === set.id);
  const rarities: readonly Rarity[] = set.rarities;

  const palette = set.bakedElement
    ? `${set.bakedElement} — ${ELEMENT_PALETTES[set.bakedElement]}`
    : `neutral (${NEUTRAL_ELEMENT_PALETTE})`;
  const decal = set.bakedSpecies
    ? `${set.bakedSpecies} — ${SPECIES_DECALS[set.bakedSpecies]}`
    : `none (${NEUTRAL_SPECIES_DECAL})`;

  const linkedBits: string[] = [];
  if (set.linkedEventId) linkedBits.push(`linked event: \`${set.linkedEventId}\``);
  if (set.linkedVoteId) linkedBits.push(`linked vote: \`${set.linkedVoteId}\``);

  let out =
    `\n# ${set.name}\n` +
    `<a id="${slug(set.id)}"></a>\n\n` +
    `- **Set id:** \`${set.id}\`\n` +
    `- **Category:** ${categoryLabel(set.category)}\n` +
    `- **Ownership:** rental (requires active \`${set.membershipId}\` membership)\n` +
    `- **Renewal cycle:** ${set.renewalCycle}\n` +
    `- **Availability year:** ${set.availabilityYear}\n` +
    `- **Rarities shipped:** ${rarities.map((r) => `\`${r}\` (${RARITY_LABELS[r]})`).join(", ")}\n` +
    `- **Element palette:** ${palette}\n` +
    `- **Species decal:** ${decal}\n` +
    `- **Motif:** ${set.motif}\n` +
    (linkedBits.length ? `- **Links:** ${linkedBits.join(" · ")}\n` : "") +
    `\n`;

  for (const rarity of rarities) {
    out += `## ${set.name} — ${RARITY_LABELS[rarity]} (${rarity})\n\n`;
    const rarityPrompts = prompts.filter((p) => p.rarity === rarity);
    for (const p of rarityPrompts) {
      out += renderRecurringPrompt(p);
    }
  }

  return out;
}

function renderRecurringPrompt(p: RecurringSuitArtPrompt): string {
  return (
    `### \`${p.assetId}\`\n\n` +
    `- **Slot (art):** ${p.slot}  ·  **Gameplay slot:** ${p.equipSlot}  ·  **Rarity:** ${p.rarity} (${RARITY_LABELS[p.rarity]})  ·  **Priority:** ${p.priority}\n` +
    `- **Resolution:** ${p.resolution}\n` +
    `- **Dependencies:** ${p.dependencies.map((d) => `\`${d}\``).join(", ")}\n\n` +
    `> ${p.prompt.replace(/\n/g, "\n> ")}\n\n`
  );
}

function recurringSectionsByCategory(): string {
  const groups: Array<{
    category: RecurringSuitSetDef["category"];
    heading: string;
    anchor: string;
  }> = [
    { category: "seasonal", heading: "Seasonal suits", anchor: "seasonal-suits" },
    {
      category: "seasonal-event",
      heading: "Seasonal-event suits",
      anchor: "seasonal-event-suits",
    },
    {
      category: "annual-vote",
      heading: "Annual governance-vote suits",
      anchor: "annual-governance-vote-suits",
    },
    {
      category: "annual-founder",
      heading: "Annual founder rental — Iron Clad Lions Ceremonial",
      anchor: "annual-founder-rental--iron-clad-lions-ceremonial",
    },
  ];

  let out = "";
  for (const g of groups) {
    out += `\n# ${g.heading}\n`;
    out += `<a id="${g.anchor}"></a>\n`;
    const sets = RECURRING_SUIT_SET_ROSTER.filter((s) => s.category === g.category);
    for (const set of sets) {
      out += setSection(set);
    }
  }
  return out;
}

function dreamerTiersSection(): string {
  let out = `\n# Order of the Dreamer — trophy tiers\n`;
  out += `<a id="order-of-the-dreamer--trophy-tiers"></a>\n\n`;
  out += `- **Unlock rule:** one trophy per ${
    DREAMER_DOLLARS_PER_LEVEL
  } USD level threshold, every 10 levels (cap at level ${DREAMER_MAX_LEVEL}).\n`;
  out += `- **Effect doubling:** active DGRS Lions Club members see every tier's effect magnitude doubled at resolution time.\n\n`;

  for (const tier of DREAMER_TIERS) {
    out += renderDreamerTier(tier);
  }
  return out;
}

function renderDreamerTier(tier: DreamerTier): string {
  const effects = tier.effects.length
    ? tier.effects.map((e) => `  - \`${e.id}\` — ${e.label} (${e.kind}, magnitude ${e.magnitude})`).join("\n")
    : "  - _(none defined yet — design fills later)_";
  return (
    `## ${tier.trophyName} — tier ${tier.tierNumber}\n\n` +
    `- **Trophy id:** \`${tier.trophyId}\`\n` +
    `- **Unlocks at level:** ${tier.unlocksAtLevel}\n` +
    `- **Mythic one-of-one:** ${tier.isMythicOneOfOne ? "yes" : "no"}\n` +
    `- **Effects:**\n${effects}\n\n` +
    `> ${tier.artPrompt}\n\n`
  );
}

function dreamerBadgesSection(): string {
  let out = `\n# Order of the Dreamer — progress badges\n`;
  out += `<a id="order-of-the-dreamer--progress-badges"></a>\n\n`;
  out += `Smaller profile badges that reward early and mid-ladder donors. These sit between the ten main trophy tiers.\n\n`;

  for (const badge of DREAMER_PROGRESS_BADGES) {
    out += renderDreamerBadge(badge);
  }
  return out;
}

function renderDreamerBadge(badge: DreamerProgressBadge): string {
  return (
    `## ${badge.badgeName} — level ${badge.level}\n\n` +
    `- **Badge id:** \`${badge.badgeId}\`\n` +
    `- **Unlocks at level:** ${badge.level}\n\n` +
    `> ${badge.artPrompt}\n\n`
  );
}

function mythicTemplateSection(): string {
  const sample = getMythicInscriptionPrompt("{donor-name-goes-here}");
  return (
    `\n# Order of the Dreamer — mythic inscription template (level 100)\n` +
    `<a id="order-of-the-dreamer--mythic-inscription-template-level-100"></a>\n\n` +
    `The level-100 trophy (\`dreamer-tier-10-mythic\`) is a one-of-one mythic engraved with the donor's chosen name. At render time, substitute the donor's typed engraving into the \`{engravedName}\` token in the prompt. Below is the composed prompt with a sample token so artists can see the full shape:\n\n` +
    `> ${sample}\n\n`
  );
}

function cijTrophiesSection(): string {
  const trophies = FESTIVE_REWARDS.filter(
    (r): r is FestiveReward & { donorUsdThreshold: number } =>
      r.type === "trophy" && r.eventWindowExclusive === true,
  ).sort((a, b) => (a.donorUsdThreshold ?? 0) - (b.donorUsdThreshold ?? 0));

  let out = `\n# Christmas-in-July donor trophies\n`;
  out += `<a id="christmas-in-july-donor-trophies"></a>\n\n`;
  out += `Event-window-exclusive. Only obtainable by donating during the live Christmas-in-July event — a pre-existing Dreamer level does NOT retroactively grant these. The donation dollars DO still credit the Order of the Dreamer ladder in parallel (see \`cijDreamerBridge.ts\`).\n\n`;

  for (const t of trophies) {
    out +=
      `## ${t.name} — $${t.donorUsdThreshold} donor\n\n` +
      `- **Trophy id:** \`${t.id}\`\n` +
      `- **Rarity:** ${t.rarity}\n` +
      `- **Donor threshold:** $${t.donorUsdThreshold}\n` +
      `- **Description:** ${t.description}\n` +
      `- **How to obtain:** ${t.howToObtain}\n\n` +
      `> ${t.artPrompt}\n\n`;
  }
  return out;
}

/* ─── Main ─── */

function main() {
  const { output } = parseArgs(process.argv.slice(2));

  const parts = [
    header(),
    factionSection(),
    baselineSection(),
    "---\n",
    tableOfContents(),
    "---\n",
    recurringSectionsByCategory(),
    "---\n",
    dreamerTiersSection(),
    "---\n",
    dreamerBadgesSection(),
    "---\n",
    mythicTemplateSection(),
    "---\n",
    cijTrophiesSection(),
  ];
  const doc = parts.join("\n");

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, doc, "utf8");

  const lines = doc.split("\n").length;
  const donorCount = FESTIVE_REWARDS.filter((r) => r.type === "trophy").length;
  // Mythic template is tier 10 rendered through getMythicInscriptionPrompt,
  // not an extra prompt — count tiers + badges only.
  const dreamerCount = DREAMER_TIERS.length + DREAMER_PROGRESS_BADGES.length;
  const grand = RECURRING_SUIT_ART_PROMPTS.length + dreamerCount + donorCount;

  console.log(`Wrote ${output}`);
  console.log(
    `  ${lines} lines · ${RECURRING_SUIT_ART_PROMPTS.length} recurring-suit prompts · ` +
      `${DREAMER_TIERS.length} Dreamer tiers (incl. 1 mythic template) + ${DREAMER_PROGRESS_BADGES.length} badges · ` +
      `${donorCount} CiJ donor trophies · grand total ${grand} prompts.`,
  );
}

main();
