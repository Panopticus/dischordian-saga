/**
 * Mechronis Professor signature ability cards — 12 Professors × 2
 * variants (light = sanctioned cast, dark = corrupted) = 24 spells.
 *
 * Each card is the in-engine representation of an F.4 signature
 * ability cinematic. Playing one of these cards triggers the
 * matching cs_sig_N_<variant> cutscene via professorSignatureCards.ts
 * and the engine's existing card_played GameEvent.
 *
 * Authoring contract (matches the s1_pack2 auto-draft pattern):
 *   - cardType "spell" — signature abilities are one-shot effects, not units.
 *   - faction "architect" for light variants (sanctioned by the Mechronis
 *     school); "thought_virus" for dark variants (corruption arc).
 *   - rarity "rare" — Professor signatures are not basic kit.
 *   - cost 5 — placeholder; design owns final tuning.
 *   - keywords [] · abilities [] — auto-draft. Effect trees come in the
 *     content-design pass; this commit ships the registry shape only.
 *   - art assetUrl points at the F.4 light/dark start frame, so the
 *     card art and the played cinematic share visual identity.
 *   - flavorText is the Professor's bible-canonical mantra (or the
 *     ability's spoken VO line) for the dark variant.
 *   - rulesVersion 1.1.0 — matches the existing s1_pack2 baseline.
 *   - trial_categories empty — these don't slot into §5.8 Authority.
 *
 * Greenshaw's dark variant already exists as
 * `pack2_thought_virus_quarantine_field` (a "Field" unit placeholder);
 * the new `professors_greenshaw_thought_virus` card here is the proper
 * signature-spell representation. The registry in
 * apps/shared/expansionArt/professorSignatureCards.ts is updated to
 * point at the new card; the old "Field" unit stays as a regular pack
 * 2 unit but no longer triggers a cinematic.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "../../../../../client/src/lib/assetUrl";

interface SigDef {
  professor: string;
  light: { ability: string; flavor: string; sigN: number };
  dark: { ability: string; flavor: string };
}

const SIGS: readonly SigDef[] = [
  {
    professor: "kanevas",
    light: { ability: "Harmonize", flavor: "Sync to me. We move as one.", sigN: 1 },
    dark: { ability: "Dissonance", flavor: "Sync to me. They will move as I choose." },
  },
  {
    professor: "aoki",
    light: { ability: "Unseen Passage", flavor: "Walk where they cannot watch.", sigN: 2 },
    dark: { ability: "Private Confession", flavor: "Their secrets are mine now." },
  },
  {
    professor: "halverez",
    light: { ability: "Soul-Read", flavor: "Show me what you treasure.", sigN: 3 },
    dark: { ability: "Soul-Take", flavor: "It is mine now. Always was." },
  },
  {
    professor: "orphic",
    light: { ability: "Phase-Step", flavor: "Through. Out the other side.", sigN: 4 },
    dark: { ability: "Dimensional Drift", flavor: "Through... mostly." },
  },
  {
    professor: "mireille",
    light: { ability: "Viral Word", flavor: "Believe me. Just for a moment.", sigN: 5 },
    dark: { ability: "Thought Carry", flavor: "Believe me. Tell everyone." },
  },
  {
    professor: "kasra",
    light: { ability: "Parade Order", flavor: "Parade order. To me. Now.", sigN: 6 },
    dark: { ability: "Acceptable Casualties", flavor: "Some losses are acceptable. These." },
  },
  {
    professor: "vellis",
    light: { ability: "Verbal Contract", flavor: "Agreed. For five turns of the wheel.", sigN: 7 },
    dark: { ability: "Blood Oath", flavor: "Agreed. For all turns. Mine." },
  },
  {
    professor: "greenshaw",
    light: { ability: "Quarantine", flavor: "Held. You will not move.", sigN: 8 },
    dark: { ability: "Thought Virus", flavor: "Held. And contagious." },
  },
  {
    professor: "vex",
    light: { ability: "Rule Rewrite", flavor: "House rules. For this turn.", sigN: 9 },
    dark: { ability: "House Rules", flavor: "House rules. From now on. Forever." },
  },
  {
    professor: "vasara",
    light: { ability: "Second Breath", flavor: "Again. Not finished.", sigN: 10 },
    dark: { ability: "Borrowed Time", flavor: "Again. At their cost." },
  },
  {
    professor: "vent",
    light: { ability: "Field Repair", flavor: "Fixed. Stronger than before.", sigN: 11 },
    dark: { ability: "Salvage Rights", flavor: "Salvaged. Their loss, your gain." },
  },
  {
    professor: "proctor",
    light: { ability: "Investigator's Sight", flavor: "There. The next answer.", sigN: 12 },
    dark: { ability: "Architect's Eye", flavor: "There. And there. And there. All of it. Yours." },
  },
];

/* The visual art for each signature spell reuses the F.4 cinematic's
 * start frame so the card and the played cinematic look like the
 * same beat. Bundle path matches guildCutscenesManifest.ts. */
function sigArt(sigN: number, variant: "light" | "dark"): string {
  return assetUrl(
    `art/guild-cutscenes/f4_abilities/cs_sig_${sigN}_${variant}_start.png`,
  );
}

const ALL: CardDefinition[] = [];

for (const sig of SIGS) {
  ALL.push({
    id: `s2_professors_${sig.professor}_${sig.light.ability.toLowerCase().replace(/[^a-z0-9]+/g, "_")}` as CardDefinition["id"],
    name: sig.light.ability,
    faction: "architect",
    cardType: "spell",
    rarity: "rare",
    cost: 5,
    keywords: [],
    abilities: [],
    art: sigArt(sig.light.sigN, "light"),
    flavorText: sig.light.flavor,
    rulesVersion: "1.1.0",
    trial_categories: [],
  });
  ALL.push({
    id: `s2_professors_${sig.professor}_${sig.dark.ability.toLowerCase().replace(/[^a-z0-9]+/g, "_")}` as CardDefinition["id"],
    name: sig.dark.ability,
    faction: "thought_virus",
    cardType: "spell",
    rarity: "rare",
    cost: 5,
    keywords: [],
    abilities: [],
    art: sigArt(sig.light.sigN, "dark"),
    flavorText: sig.dark.flavor,
    rulesVersion: "1.1.0",
    trial_categories: [],
  });
}

export const S2_PROFESSOR_SIGNATURE_CARDS: readonly CardDefinition[] = ALL;
