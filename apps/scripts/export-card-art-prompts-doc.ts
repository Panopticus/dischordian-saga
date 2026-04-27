/**
 * Generate a single browseable Markdown document from the
 * CARD_ART_PROMPTS registry — for handing to an artist as the
 * canonical "draw all 609 cards" brief.
 *
 * Output: docs/production/CARD_ART_PROMPT_DOC.md
 *
 * Run:   tsx apps/scripts/export-card-art-prompts-doc.ts
 *
 * The document groups prompts by faction (matching the on-disk
 * module split), cross-references each prompt with its CardDefinition
 * (for name, rarity, type, flavor text, keywords), and renders the
 * `card_art_potential` master template at the top so the artist sees
 * what tokens (LoRA, aspect, negative tokens) are pre-baked vs what
 * comes per-card.
 *
 * Tier-up cards (those with tierVariants) get a per-tier sub-block
 * laid out T1 → T5 with each tier's escalation delta inline.
 *
 * Pure inspection script — never writes outside docs/production.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { CARD_ART_PROMPTS } from "../shared/tcg-core/cardArtPrompts";
import type { CardArtPrompt } from "../shared/tcg-core/cardArtPrompts";
import { ALL_CARD_DEFINITIONS } from "../shared/tcg-core/cards/index";
import type { CardDefinition } from "../shared/tcg-core/types/Card";
import { PROMPT_TEMPLATES } from "../shared/assetPromptTemplates";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_PATH = path.join(REPO_ROOT, "docs/production/CARD_ART_PROMPT_DOC.md");

const FACTION_DISPLAY: Record<string, string> = {
  architect: "Architect",
  antiquarian: "Antiquarian",
  dreamer: "Dreamer",
  insurgency: "Insurgency",
  new_babylon: "New Babylon",
  thought_virus: "Thought Virus",
  neutral: "Neutral",
};

// Panopticon subgroup — explicit id list per the authoring split.
// These eight characters live in the architect faction by gameplay
// definition but the operator authored their prompts as a separate
// "Panopticon surveillance subgroup" in panopticon.ts; honor that
// grouping in the artist hand-off.
const PANOPTICON_IDS: ReadonlySet<string> = new Set([
  "s1_char_050", "s1_char_051", "s1_char_052", "s1_char_053",
  "s1_char_054", "s1_char_055", "s1_char_056", "s1_char_057",
]);

// Module-grouping override: cards belong to a specific authoring
// module that doesn't always match `definition.faction`. The id
// prefix is the canonical signal we used at authoring time.
function moduleGroupForCard(cardId: string, def: CardDefinition | undefined): string {
  if (cardId.startsWith("s1_imprint_")) return "imprint";
  if (cardId.startsWith("s1_alleg_")) return "allegiance";
  if (cardId.startsWith("s1_class_")) return "class";
  if (cardId.startsWith("s1_race_")) return "race";
  if (cardId.startsWith("s1_elem_")) return "elemental";
  if (cardId.startsWith("s1_dim_")) return "dimensional";
  if (PANOPTICON_IDS.has(cardId)) return "panopticon";
  if (def?.faction) return def.faction;
  return "uncategorized";
}

const GROUP_DISPLAY: Record<string, string> = {
  imprint: "Imprint (cross-faction tier-up legendaries)",
  allegiance: "Allegiance (faction tier-up champions)",
  class: "Class (Spy / Oracle / Assassin / Engineer / Soldier / Ne-Yon)",
  race: "Race (Human / Demagi / Quarchon / Synthetic / Ne-Yon)",
  elemental: "Elemental (Fire / Water / Earth / Air)",
  dimensional: "Dimensional (Time / Space / Probability / Reality)",
  panopticon: "Panopticon (Architect surveillance subgroup)",
  antiquarian: FACTION_DISPLAY.antiquarian,
  architect: FACTION_DISPLAY.architect,
  dreamer: FACTION_DISPLAY.dreamer,
  insurgency: FACTION_DISPLAY.insurgency,
  new_babylon: FACTION_DISPLAY.new_babylon,
  thought_virus: FACTION_DISPLAY.thought_virus,
  neutral: FACTION_DISPLAY.neutral,
};

const GROUP_ORDER: readonly string[] = [
  "imprint",
  "allegiance",
  "class",
  "race",
  "elemental",
  "dimensional",
  "panopticon",
  "architect",
  "antiquarian",
  "dreamer",
  "insurgency",
  "new_babylon",
  "thought_virus",
  "neutral",
];

interface PromptEntry {
  prompt: CardArtPrompt;
  def: CardDefinition | undefined;
}

function main() {
  const byId = new Map<string, CardDefinition>();
  for (const d of ALL_CARD_DEFINITIONS) byId.set(d.id, d);

  // Group prompts by module.
  const groups = new Map<string, PromptEntry[]>();
  for (const cardId of Object.keys(CARD_ART_PROMPTS)) {
    const prompt = CARD_ART_PROMPTS[cardId];
    const def = byId.get(cardId);
    const group = moduleGroupForCard(cardId, def);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push({ prompt, def });
  }

  // Sort entries inside each group by display name (then by id as tiebreak).
  for (const list of groups.values()) {
    list.sort((a, b) => {
      const an = (a.def?.name ?? a.prompt.cardId).toLowerCase();
      const bn = (b.def?.name ?? b.prompt.cardId).toLowerCase();
      if (an !== bn) return an < bn ? -1 : 1;
      return a.prompt.cardId < b.prompt.cardId ? -1 : 1;
    });
  }

  // Render.
  const tpl = PROMPT_TEMPLATES.card_art_potential;
  const totalPrompts = Object.keys(CARD_ART_PROMPTS).length;

  const lines: string[] = [];
  lines.push(`# Dischordian Saga — Card Art Brief`);
  lines.push(``);
  lines.push(
    `**${totalPrompts} cards across ${groups.size} authoring modules.**  ` +
    `This document is the canonical artist hand-off for the Season One: ` +
    `The Memoir base set. Generated from ` +
    `\`apps/shared/tcg-core/cardArtPrompts/\`.`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## How to read this document`);
  lines.push(``);
  lines.push(
    `Every entry below is one card. The "Scene" field is the visual ` +
    `brief — read it first. "Mood", "Palette", and "Composition" are ` +
    `the operator's locked direction; honor them unless you flag a ` +
    `specific reason to deviate. "Notes" is operator-side intent and ` +
    `lore tie-in. "Flavor" is the in-game flavor text the player ` +
    `sees on the card — it is canon, not a brief.`,
  );
  lines.push(``);
  lines.push(
    `Tier-up cards (those whose card id ends with \`_t1\` through ` +
    `\`_t5\`) escalate from mortal-baseline (T1) to cosmic-transcendent ` +
    `(T5). Each tier inherits the base brief and adds the per-tier ` +
    `delta — render five versions, one per tier.`,
  );
  lines.push(``);
  lines.push(
    `**Lore boundary:** every prompt draws ONLY from canon revealed ` +
    `by the END of Epoch 2. Acts 3-7 reveals (Watcher unmasking, ` +
    `Source identity, Convergence, Engineer hidden-variable, Two ` +
    `Witnesses, Darren memorial) MUST stay hidden in the art unless ` +
    `the card is explicitly an Act 3-7 unlock. When in doubt, encode ` +
    `as foreshadowing / silhouette / negative space, not direct ` +
    `confirmation.`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Master template block.
  lines.push(`## Master template (locked, applies to every card)`);
  lines.push(``);
  lines.push(`These tokens are pre-baked into every render and do not need to be re-stated per card:`);
  lines.push(``);
  lines.push(`| Field | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Prefix | \`${tpl.prefix}\` |`);
  lines.push(`| Required tokens | ${tpl.requiredTokens.map(t => `\`${t}\``).join(", ")} |`);
  lines.push(`| Negative tokens | ${tpl.negativeTokens.map(t => `\`${t}\``).join(", ")} |`);
  lines.push(`| Locked LoRA | \`${tpl.lockedLora}\` |`);
  lines.push(`| Locked seed | \`${tpl.lockedSeed}\` |`);
  lines.push(`| Aspect ratio | \`${tpl.aspect}\` |`);
  lines.push(`| Target model | \`${tpl.targetModel}\` |`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Tier escalation reminder.
  lines.push(`## Tier escalation rules (for cards with T1–T5 variants)`);
  lines.push(``);
  lines.push(`| Tier | Escalation |`);
  lines.push(`| --- | --- |`);
  lines.push(`| T1 baseline | mortal scale, single key light, restrained |`);
  lines.push(`| T2 awakened | visible elemental aura, secondary rim-light, saturated accent |`);
  lines.push(`| T3 ascendant | full elemental halo, sky shifted (dawn/dusk), visible weather |`);
  lines.push(`| T4 dominant | reality bends, scale increases, camera pulls back |`);
  lines.push(`| T5 transcendent | partly off-plane, cosmic-scale backdrop, half-bleed into otherspace |`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Table of contents.
  lines.push(`## Table of contents`);
  lines.push(``);
  for (const groupKey of GROUP_ORDER) {
    if (!groups.has(groupKey)) continue;
    const list = groups.get(groupKey)!;
    const display = GROUP_DISPLAY[groupKey] ?? groupKey;
    lines.push(`- [${display} — ${list.length} cards](#${slugify(display)})`);
  }
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Per-group sections.
  for (const groupKey of GROUP_ORDER) {
    if (!groups.has(groupKey)) continue;
    const list = groups.get(groupKey)!;
    const display = GROUP_DISPLAY[groupKey] ?? groupKey;
    lines.push(`## ${display}`);
    lines.push(``);
    lines.push(`*${list.length} cards in this section.*`);
    lines.push(``);
    for (const entry of list) {
      renderEntry(lines, entry);
    }
    lines.push(`---`);
    lines.push(``);
  }

  // Footer.
  lines.push(`## Footer`);
  lines.push(``);
  lines.push(
    `Regenerate with \`tsx apps/scripts/export-card-art-prompts-doc.ts\`. ` +
    `If a prompt looks wrong or ambiguous, edit the source under ` +
    `\`apps/shared/tcg-core/cardArtPrompts/<faction>.ts\` and re-run; ` +
    `that file is the source of truth, not this generated doc.`,
  );
  lines.push(``);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`  ${totalPrompts} prompts across ${groups.size} groups`);
  for (const groupKey of GROUP_ORDER) {
    if (!groups.has(groupKey)) continue;
    const list = groups.get(groupKey)!;
    console.log(`    ${groupKey.padEnd(16)} ${String(list.length).padStart(4)} cards`);
  }
}

function renderEntry(lines: string[], { prompt, def }: PromptEntry): void {
  const displayName = def?.name ?? "(unknown card)";
  const factionDisplay = def?.faction ? FACTION_DISPLAY[def.faction] ?? def.faction : "—";
  const rarity = def?.rarity ?? "—";
  const cardType = def?.cardType ?? "—";

  lines.push(`### ${displayName}`);
  lines.push(``);
  lines.push(
    `**ID:** \`${prompt.cardId}\` · ` +
    `**Faction:** ${factionDisplay} · ` +
    `**Rarity:** ${rarity} · ` +
    `**Type:** ${cardType}`,
  );
  lines.push(``);

  if (def?.flavorText && def.flavorText.trim().length > 0) {
    lines.push(`> *${escapeMd(def.flavorText.trim())}*`);
    lines.push(``);
  }

  lines.push(`**Scene:** ${escapeMd(prompt.sceneDelta)}`);
  lines.push(``);
  lines.push(`**Mood:** ${prompt.moodKeywords.map(k => `*${escapeMd(k)}*`).join(" · ")}`);
  lines.push(``);
  lines.push(`**Palette:** ${escapeMd(prompt.palette)}`);
  lines.push(``);
  lines.push(`**Composition:** ${escapeMd(prompt.composition)}`);
  lines.push(``);

  if (prompt.notes && prompt.notes.trim().length > 0) {
    lines.push(`**Notes:** ${escapeMd(prompt.notes)}`);
    lines.push(``);
  }

  if (prompt.tierVariants) {
    const tiers: Array<["T1" | "T2" | "T3" | "T4" | "T5", string | undefined]> = [
      ["T1", prompt.tierVariants.t1],
      ["T2", prompt.tierVariants.t2],
      ["T3", prompt.tierVariants.t3],
      ["T4", prompt.tierVariants.t4],
      ["T5", prompt.tierVariants.t5],
    ];
    const populated = tiers.filter(([, v]) => v && v.trim().length > 0);
    if (populated.length > 0) {
      lines.push(`**Tier escalation:**`);
      lines.push(``);
      for (const [label, delta] of populated) {
        lines.push(`- **${label}** — ${escapeMd(delta!)}`);
      }
      lines.push(``);
    }
  }

  if (def?.keywords && def.keywords.length > 0) {
    lines.push(`**Mechanics keywords (gameplay context for the artist):** ${def.keywords.map(k => `\`${k}\``).join(", ")}`);
    lines.push(``);
  }

  lines.push(``);
}

function escapeMd(text: string): string {
  // Conservative escape — preserve readability. We only neutralize
  // pipe characters (which break tables) and HTML angle brackets.
  return text.replace(/\|/g, "\\|");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main();
