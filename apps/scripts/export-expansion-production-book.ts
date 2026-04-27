/**
 * Generate the single-document Expansion Production Book.
 *
 * Output: docs/production/EXPANSION_PRODUCTION_BOOK.md
 *
 * Run:   tsx apps/scripts/export-expansion-production-book.ts
 *
 * Per the 2026-04-27 user directive, the artist + animator +
 * video-vendor hand-off is delivered as ONE assembled document
 * containing:
 *   §1  122 expansion cards (84 S2_HIERARCHY + 28 ACT_EXCLUSIVES
 *       + 10 specials), grouped by tier with the same per-card
 *       rigor as docs/production/CARD_ART_PROMPT_DOC.md
 *   §2  9 cutscenes (card-pack open + Hierarchy reveal + 7 Act
 *       narrative cutscenes), each with full beat-by-beat shot
 *       lists, VO lines, SFX cues, existing-VFX references
 *   §3  18 VFX assets (7 rarity ceremonies + 3 Hierarchy
 *       mechanics + 3 cosmetic reveals + 5 Act spell VFX), each
 *       with locked output spec + start/end frame prompts +
 *       motion prompt + SFX cue + existing-primitives list
 *
 * Pure inspection script — never writes outside docs/production.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import {
  EXPANSION_CARD_PROMPTS,
  EXPANSION_CUTSCENE_PROMPTS,
  EXPANSION_VFX_PROMPTS,
  VFX_OUTPUT_LOCKED,
} from "../shared/tcg-core/expansionPrompts";
import type {
  ExpansionCardPrompt,
  CutscenePrompt,
  VfxPrompt,
} from "../shared/tcg-core/expansionPrompts";
import { PROMPT_TEMPLATES } from "../shared/assetPromptTemplates";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_PATH = path.join(REPO_ROOT, "docs/production/EXPANSION_PRODUCTION_BOOK.md");

// ──────────────────────────────────────────────────────────────
// Card grouping (mirrors CARD_ART_PROMPT_DOC's policy: group by
// authoring module, ordered for the artist's reading flow)
// ──────────────────────────────────────────────────────────────

type CardGroupKey =
  | "hierarchy_csuite" | "hierarchy_vps" | "hierarchy_directors"
  | "hierarchy_managers" | "hierarchy_analysts" | "hierarchy_interns"
  | "act1" | "act2" | "act3" | "act4" | "act5" | "act6" | "act7"
  | "specials_cosmetic" | "specials_secrets";

const CARD_GROUP_DISPLAY: Record<CardGroupKey, string> = {
  hierarchy_csuite: "Hierarchy of the Damned — C-Suite (Mythic, 7)",
  hierarchy_vps: "Hierarchy of the Damned — VPs (Legendary, 7)",
  hierarchy_directors: "Hierarchy of the Damned — Directors (Epic, 14)",
  hierarchy_managers: "Hierarchy of the Damned — Managers (Rare, 18)",
  hierarchy_analysts: "Hierarchy of the Damned — Analysts (Uncommon, 24)",
  hierarchy_interns: "Hierarchy of the Damned — Interns (Common, 14)",
  act1: "Act 1 — The Memoir / The Signal (4)",
  act2: "Act 2 — The Whisper / The Engineer's Bench (4)",
  act3: "Act 3 — The Offer / Eyes in the Dark (4)",
  act4: "Act 4 — The Revelation / The Prisoner (4)",
  act5: "Act 5 — The Map / The Reckoning (4)",
  act6: "Act 6 — The Confession (4)",
  act7: "Act 7 — The Convergence (4)",
  specials_cosmetic: "Special Editions — Cosmetic Triptych (3)",
  specials_secrets: "Special Editions — Lore-Discovery Secrets (7)",
};

const CARD_GROUP_ORDER: readonly CardGroupKey[] = [
  "hierarchy_csuite", "hierarchy_vps", "hierarchy_directors",
  "hierarchy_managers", "hierarchy_analysts", "hierarchy_interns",
  "act1", "act2", "act3", "act4", "act5", "act6", "act7",
  "specials_cosmetic", "specials_secrets",
];

function cardGroupFor(card: ExpansionCardPrompt): CardGroupKey {
  if (card.cardId.startsWith("s2_hierarchy_ceo_") || card.cardId.startsWith("s2_hierarchy_cfo_")
      || card.cardId.startsWith("s2_hierarchy_coo_") || card.cardId.startsWith("s2_hierarchy_cmo_")
      || card.cardId.startsWith("s2_hierarchy_cto_") || card.cardId.startsWith("s2_hierarchy_chro_")
      || card.cardId.startsWith("s2_hierarchy_ciso_")) return "hierarchy_csuite";
  if (card.cardId.startsWith("s2_hierarchy_vp_")) return "hierarchy_vps";
  if (card.cardId.startsWith("s2_hierarchy_dir_")) return "hierarchy_directors";
  if (card.cardId.startsWith("s2_hierarchy_mgr_")) return "hierarchy_managers";
  if (card.cardId.startsWith("s2_hierarchy_anl_")) return "hierarchy_analysts";
  if (card.cardId.startsWith("s2_hierarchy_intn_")) return "hierarchy_interns";
  if (card.cardId.startsWith("act1_")) return "act1";
  if (card.cardId.startsWith("act2_")) return "act2";
  if (card.cardId.startsWith("act3_")) return "act3";
  if (card.cardId.startsWith("act4_")) return "act4";
  if (card.cardId.startsWith("act5_")) return "act5";
  if (card.cardId.startsWith("act6_")) return "act6";
  if (card.cardId.startsWith("act7_")) return "act7";
  if (card.cardId.startsWith("secret_")) return "specials_secrets";
  if (card.cardId.startsWith("special_")) return "specials_cosmetic";
  throw new Error(`unknown card group for id: ${card.cardId}`);
}

// ──────────────────────────────────────────────────────────────
// Render
// ──────────────────────────────────────────────────────────────

function main(): void {
  const cards = Object.values(EXPANSION_CARD_PROMPTS);
  const cutscenes = Object.values(EXPANSION_CUTSCENE_PROMPTS);
  const vfx = Object.values(EXPANSION_VFX_PROMPTS);

  const cardsByGroup = new Map<CardGroupKey, ExpansionCardPrompt[]>();
  for (const c of cards) {
    const k = cardGroupFor(c);
    if (!cardsByGroup.has(k)) cardsByGroup.set(k, []);
    cardsByGroup.get(k)!.push(c);
  }
  for (const list of cardsByGroup.values()) {
    list.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
  }

  const tpl = PROMPT_TEMPLATES.card_art_potential;
  const lines: string[] = [];

  // Front matter
  lines.push(`# Dischordian Saga — Expansion Production Book`);
  lines.push(``);
  lines.push(
    `**${cards.length} cards · ${cutscenes.length} cinematics · ${vfx.length} VFX assets.** ` +
    `Single artist + animator + video-vendor hand-off for the S2_HIERARCHY expansion ` +
    `+ ACT_EXCLUSIVES set + commercial-release special editions. Generated from ` +
    `\`apps/shared/tcg-core/expansionPrompts/\`.`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // How to read
  lines.push(`## How to read this document`);
  lines.push(``);
  lines.push(
    `Three sections: §1 cards (the artist's brief, one entry per card), §2 ` +
    `cinematics (beat-by-beat shot lists for the 9 cutscenes), §3 VFX (per-asset ` +
    `briefs for the 18 effects, locked to the prelude pipeline output spec).`,
  );
  lines.push(``);
  lines.push(
    `Every entry carries ≥1 lore citation pointing to a real file path in the ` +
    `repository. The CI test (\`apps/shared/tcg-core/expansionPrompts/expansion.test.ts\`) ` +
    `enforces structural rigor: required fields populated, citations present, no ` +
    `Acts 3-7 spoiler keywords in non-secret entries, Hierarchy un-canon entries ` +
    `carry archetype rationale.`,
  );
  lines.push(``);
  lines.push(
    `**Lore boundary:** Epoch-2 cutoff applies. Acts 3-7 reveals (Watcher unmasking, ` +
    `Source identity, Convergence chord identity, Engineer hidden-variable, Two ` +
    `Witnesses bond, Darren memorial) MUST stay hidden in the art unless the entry ` +
    `is one of the 7 unlock-gated lore-discovery secrets. The secrets surface their ` +
    `Act's earned truth as the Memoirist's first-person notebook reflection — never ` +
    `as authoritative third-person identity reveal.`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Master template
  lines.push(`## Master template (locked, applies to every card-art entry)`);
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

  // VFX output spec
  lines.push(`## VFX output spec (locked, applies to every §3 VFX entry)`);
  lines.push(``);
  lines.push(`| Field | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Resolution | \`${VFX_OUTPUT_LOCKED.width} × ${VFX_OUTPUT_LOCKED.height}\` |`);
  lines.push(`| Codec | \`${VFX_OUTPUT_LOCKED.codec}\` (WebM container) |`);
  lines.push(`| Alpha channel | \`${VFX_OUTPUT_LOCKED.alpha}\` (transparent background) |`);
  lines.push(`| Frame rate | \`${VFX_OUTPUT_LOCKED.fps}\` fps |`);
  lines.push(`| Pipeline reference | \`prelude-asset-build/prompts/vfx/README.md\` |`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // TOC
  lines.push(`## Table of contents`);
  lines.push(``);
  lines.push(`### §1 — Cards`);
  for (const k of CARD_GROUP_ORDER) {
    const list = cardsByGroup.get(k);
    if (!list) continue;
    const display = CARD_GROUP_DISPLAY[k];
    lines.push(`- [${display}](#${slugify(display)})`);
  }
  lines.push(``);
  lines.push(`### §2 — Cinematics`);
  for (const c of cutscenes) {
    lines.push(`- [${c.title}](#${slugify(c.title)})`);
  }
  lines.push(``);
  lines.push(`### §3 — VFX`);
  for (const v of vfx) {
    lines.push(`- [${v.id}](#${slugify(v.id)})`);
  }
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // §1 Cards
  lines.push(`# §1 — Cards (${cards.length})`);
  lines.push(``);
  for (const k of CARD_GROUP_ORDER) {
    const list = cardsByGroup.get(k);
    if (!list) continue;
    lines.push(`## ${CARD_GROUP_DISPLAY[k]}`);
    lines.push(``);
    lines.push(`*${list.length} cards in this section.*`);
    lines.push(``);
    for (const card of list) renderCard(lines, card);
    lines.push(`---`);
    lines.push(``);
  }

  // §2 Cinematics
  lines.push(`# §2 — Cinematics (${cutscenes.length})`);
  lines.push(``);
  for (const c of cutscenes) renderCutscene(lines, c);

  // §3 VFX
  lines.push(`# §3 — VFX (${vfx.length})`);
  lines.push(``);
  for (const v of vfx) renderVfx(lines, v);

  // Footer
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Footer`);
  lines.push(``);
  lines.push(
    `Regenerate with \`tsx apps/scripts/export-expansion-production-book.ts\`. ` +
    `Source of truth: \`apps/shared/tcg-core/expansionPrompts/\`. This document ` +
    `is a derived view; edit the typed source modules and re-run.`,
  );
  lines.push(``);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`  ${cards.length} cards across ${cardsByGroup.size} groups`);
  console.log(`  ${cutscenes.length} cinematics`);
  console.log(`  ${vfx.length} VFX assets`);
  for (const k of CARD_GROUP_ORDER) {
    const list = cardsByGroup.get(k);
    if (!list) continue;
    console.log(`    ${k.padEnd(22)} ${String(list.length).padStart(4)} cards`);
  }
}

function renderCard(lines: string[], card: ExpansionCardPrompt): void {
  lines.push(`### ${card.name}`);
  lines.push(``);
  lines.push(
    `**ID:** \`${card.cardId}\` · **Set:** ${card.setCode} · ` +
    `**Faction:** ${card.faction} · **Rarity:** ${card.rarity} · ` +
    `**Type:** ${card.cardType}`,
  );
  lines.push(``);
  if (card.flavorText && card.flavorText.trim().length > 0) {
    lines.push(`> *${escapeMd(card.flavorText.trim())}*`);
    lines.push(``);
  }
  lines.push(`**Scene:** ${escapeMd(card.sceneDelta)}`);
  lines.push(``);
  lines.push(`**Mood:** ${card.moodKeywords.map(k => `*${escapeMd(k)}*`).join(" · ")}`);
  lines.push(``);
  lines.push(`**Palette:** ${escapeMd(card.palette)}`);
  lines.push(``);
  lines.push(`**Composition:** ${escapeMd(card.composition)}`);
  lines.push(``);
  if (card.notes && card.notes.trim().length > 0) {
    lines.push(`**Notes:** ${escapeMd(card.notes)}`);
    lines.push(``);
  }
  if (card.archetypeRationale && card.archetypeRationale.trim().length > 0) {
    lines.push(`**Archetype rationale:** ${escapeMd(card.archetypeRationale)}`);
    lines.push(``);
  }
  if (card.tierVariants) {
    const tiers: Array<["T1" | "T2" | "T3" | "T4" | "T5", string | undefined]> = [
      ["T1", card.tierVariants.t1], ["T2", card.tierVariants.t2],
      ["T3", card.tierVariants.t3], ["T4", card.tierVariants.t4],
      ["T5", card.tierVariants.t5],
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
  lines.push(`**Lore citations:**`);
  for (const cite of card.loreCitations) lines.push(`- ${escapeMd(cite)}`);
  lines.push(``);
  lines.push(``);
}

function renderCutscene(lines: string[], c: CutscenePrompt): void {
  lines.push(`## ${c.title}`);
  lines.push(``);
  if (c.subtitle) {
    lines.push(`*${escapeMd(c.subtitle)}*`);
    lines.push(``);
  }
  lines.push(`**ID:** \`${c.id}\``);
  lines.push(``);
  lines.push(`**Trigger:** ${escapeMd(c.trigger)}`);
  lines.push(``);
  lines.push(`**Estimated duration:** ${c.estimatedDurationSec}s`);
  lines.push(``);
  if (c.ambientTrack) {
    lines.push(`**Ambient track:** ${escapeMd(c.ambientTrack)}`);
    lines.push(``);
  }
  lines.push(`**Beats (${c.beats.length}):**`);
  lines.push(``);
  for (let i = 0; i < c.beats.length; i++) {
    const b = c.beats[i];
    lines.push(`#### Beat ${i + 1}: \`${b.beatId}\` (${b.durationSec}s${b.mood ? `, mood: *${b.mood}*` : ""}${b.speaker && b.speaker !== "None" ? `, speaker: **${b.speaker}**` : ""})`);
    lines.push(``);
    if (b.line) {
      lines.push(`> *VO line:* "${escapeMd(b.line)}"`);
      lines.push(``);
    }
    lines.push(`- **Camera:** ${escapeMd(b.cameraDirection)}`);
    lines.push(`- **Framing:** ${escapeMd(b.framingPrompt)}`);
    lines.push(`- **Motion:** ${escapeMd(b.motionPrompt)}`);
    if (b.sfxCue) lines.push(`- **SFX cue:** ${escapeMd(b.sfxCue)}`);
    if (b.existingVfxRef) lines.push(`- **Existing VFX ref:** ${escapeMd(b.existingVfxRef)}`);
    lines.push(``);
  }
  lines.push(`**Lore citations:**`);
  for (const cite of c.loreCitations) lines.push(`- ${escapeMd(cite)}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
}

function renderVfx(lines: string[], v: VfxPrompt): void {
  lines.push(`## ${v.id}`);
  lines.push(``);
  lines.push(`**Trigger:** ${escapeMd(v.trigger)}`);
  lines.push(``);
  lines.push(`**Duration:** ${v.estimatedDurationSec}s`);
  lines.push(``);
  lines.push(`**Output:** ${v.output.width} × ${v.output.height}, ${v.output.codec} α @${v.output.fps}fps`);
  lines.push(``);
  lines.push(`**Start frame:** ${escapeMd(v.startFramePrompt)}`);
  lines.push(``);
  lines.push(`**End frame:** ${escapeMd(v.endFramePrompt)}`);
  lines.push(``);
  lines.push(`**Motion:** ${escapeMd(v.motionPrompt)}`);
  lines.push(``);
  lines.push(`**SFX cue:** ${escapeMd(v.sfxCue)}`);
  lines.push(``);
  lines.push(`**Existing primitives to reuse:**`);
  for (const p of v.existingPrimitives) lines.push(`- ${escapeMd(p)}`);
  lines.push(``);
  lines.push(`**Lore citations:**`);
  for (const cite of v.loreCitations) lines.push(`- ${escapeMd(cite)}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
}

function escapeMd(text: string): string {
  return text.replace(/\|/g, "\\|");
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main();
