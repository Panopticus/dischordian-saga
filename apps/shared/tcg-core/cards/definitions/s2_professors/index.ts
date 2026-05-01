/**
 * Mechronis Professor signature ability cards — 12 Professors × 2
 * variants (light = sanctioned cast, dark = corrupted) = 24 spells.
 *
 * Each card is the in-engine representation of an F.4 signature
 * ability cinematic. Playing one of these cards triggers the
 * matching cs_sig_N_<variant> cutscene via professorSignatureCards.ts
 * and the engine's existing card_played GameEvent.
 *
 * Authoring contract:
 *   - cardType "spell" — signature abilities are one-shot effects, not units.
 *   - faction "architect" for light variants (sanctioned by the Mechronis
 *     school); "thought_virus" for dark variants (corruption arc).
 *   - rarity "rare" — Professor signatures are not basic kit.
 *   - cost 5 — placeholder; design owns final tuning. Each ability
 *     is rare-cost-5-shaped: high-impact one-shot with build-around
 *     potential.
 *   - keywords [] — no intrinsic keywords; the spell IS the keyword.
 *   - abilities: hand-authored effect trees per the bible's
 *     descriptions. Light variants are reactive/supportive; dark
 *     variants are aggressive/extractive.
 *   - art assetUrl points at the F.4 light/dark start frame, so the
 *     card art and the played cinematic share visual identity.
 *   - rulesVersion 1.1.0 — additive ops only, no version bump.
 *
 * Greenshaw's dark-variant placeholder
 * (`pack2_thought_virus_quarantine_field`) stays as a regular pack 2
 * unit but no longer fires a cinematic; the proper signature spell
 * `s2_professors_greenshaw_thought_virus` defined here took over
 * the F.4 trigger registration.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "../../../../../client/src/lib/assetUrl";

type Ability = CardDefinition["abilities"][number];
type AbilityId = Ability["id"];

interface SigDef {
  professor: string;
  sigN: number;
  light: { ability: string; flavor: string; abilities: readonly Ability[] };
  dark: { ability: string; flavor: string; abilities: readonly Ability[] };
}

/* ─── Ability factories ─── */
/* Each Professor's light + dark cast is one ability with `on_cast`
 * trigger. Effect ops drawn from apps/shared/tcg-core/types/Effect.ts;
 * targeting from types/Targeting.ts. Cost / scaling tuned for rare
 * cost-5 spells (see s1_spell_209 Safe House for baseline). */

const id = (s: string): AbilityId => s as AbilityId;

/** Light: Harmonize — every friendly unit gets +1/+1 for 1 turn. */
const KANEVAS_LIGHT: readonly Ability[] = [{
  id: id("kanevas_harmonize_rally"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "foreach",
    over: { kind: "all", filter: { controller: "self" } },
    do: { op: "buff", stats: { power: 1, health: 1 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
  },
}];
/** Dark: Dissonance — every enemy unit takes 2 damage AND -1/-0 for a turn. */
const KANEVAS_DARK: readonly Ability[] = [{
  id: id("kanevas_dissonance_break"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "foreach",
    over: { kind: "all", filter: { controller: "opponent" } },
    do: {
      op: "sequence",
      steps: [
        { op: "deal_damage", amount: { kind: "const", value: 2 }, to: { kind: "it" } },
        { op: "debuff", stats: { power: 1, health: 0 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
      ],
    },
  },
}];

/** Light: Unseen Passage — teleport a friendly unit to any empty tile + grant infiltrate. */
const AOKI_LIGHT: readonly Ability[] = [{
  id: id("aoki_unseen_passage_warp"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "teleport", target: { kind: "it" }, to: { kind: "random_empty" } },
        { op: "grant_keyword", keyword: "infiltrate", duration: { kind: "this_turn" }, to: { kind: "it" } },
      ],
    },
  },
}];
/** Dark: Private Confession — opponent discards 2 random + you draw 1. */
const AOKI_DARK: readonly Ability[] = [{
  id: id("aoki_private_confession_extract"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "discard", amount: { kind: "const", value: 2 }, from: "opponent", mode: "random" },
      { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    ],
  },
}];

/** Light: Soul-Read — mill 2 from opponent's deck + draw 1 yourself. */
const HALVEREZ_LIGHT: readonly Ability[] = [{
  id: id("halverez_soul_read_peek"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "mill", amount: { kind: "const", value: 2 }, who: "opponent" },
      { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    ],
  },
}];
/** Dark: Soul-Take — opponent discards 2 (player chooses), you draw 2. */
const HALVEREZ_DARK: readonly Ability[] = [{
  id: id("halverez_soul_take_seize"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "discard", amount: { kind: "const", value: 2 }, from: "opponent", mode: "choose" },
      { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    ],
  },
}];

/** Light: Phase-Step — teleport a chosen friendly unit anywhere empty. */
const ORPHIC_LIGHT: readonly Ability[] = [{
  id: id("orphic_phase_step_warp"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    do: { op: "teleport", target: { kind: "it" }, to: { kind: "random_empty" } },
  },
}];
/** Dark: Dimensional Drift — teleport ALL units to random empty tiles. */
const ORPHIC_DARK: readonly Ability[] = [{
  id: id("orphic_dimensional_drift_scatter"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "foreach",
    over: { kind: "all", filter: {} },
    do: { op: "teleport", target: { kind: "it" }, to: { kind: "random_empty" } },
  },
}];

/** Light: Viral Word — buff a friendly unit AND copy buff to adjacents. */
const MIREILLE_LIGHT: readonly Ability[] = [{
  id: id("mireille_viral_word_spread"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "buff", stats: { power: 2, health: 2 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
        {
          op: "foreach",
          over: { kind: "radius", origin: { kind: "trigger_source" }, radius: 1, filter: { controller: "self" } },
          do: { op: "buff", stats: { power: 1, health: 1 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
        },
      ],
    },
  },
}];
/** Dark: Thought Carry — debuff an enemy + spread debuff to adjacents. */
const MIREILLE_DARK: readonly Ability[] = [{
  id: id("mireille_thought_carry_infect"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "opponent" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "debuff", stats: { power: 2, health: 2 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
        {
          op: "foreach",
          over: { kind: "radius", origin: { kind: "trigger_source" }, radius: 1, filter: { controller: "opponent" } },
          do: { op: "debuff", stats: { power: 1, health: 1 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
        },
      ],
    },
  },
}];

/** Light: Parade Order — grant rush + +1/+0 to every friendly unit this turn. */
const KASRA_LIGHT: readonly Ability[] = [{
  id: id("kasra_parade_order_rally"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "foreach",
    over: { kind: "all", filter: { controller: "self" } },
    do: {
      op: "sequence",
      steps: [
        { op: "grant_keyword", keyword: "rush", duration: { kind: "this_turn" }, to: { kind: "it" } },
        { op: "buff", stats: { power: 1, health: 0 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
      ],
    },
  },
}];
/** Dark: Acceptable Casualties — sacrifice a friendly unit, deal 6 to enemy general. */
const KASRA_DARK: readonly Ability[] = [{
  id: id("kasra_acceptable_casualties_sacrifice"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sacrifice_then",
    sac: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    then: { op: "deal_damage", amount: { kind: "const", value: 6 }, to: { kind: "enemy_general" } },
  },
}];

/** Light: Verbal Contract — gain 2 mana this turn + draw 1. */
const VELLIS_LIGHT: readonly Ability[] = [{
  id: id("vellis_verbal_contract_deal"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "gain_mana", amount: { kind: "const", value: 2 }, permanent: false },
      { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    ],
  },
}];
/** Dark: Blood Oath — gain 4 mana + draw 2, but deal 3 to friendly general. */
const VELLIS_DARK: readonly Ability[] = [{
  id: id("vellis_blood_oath_pact"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "gain_mana", amount: { kind: "const", value: 4 }, permanent: false },
      { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
      { op: "deal_damage", amount: { kind: "const", value: 3 }, to: { kind: "friendly_general" } },
    ],
  },
}];

/** Light: Quarantine — stun a chosen enemy unit for 2 turns. */
const GREENSHAW_LIGHT: readonly Ability[] = [{
  id: id("greenshaw_quarantine_lockdown"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "opponent" }, chooser: "player" },
    do: { op: "stun", duration: { kind: "n_turns", n: 2 }, to: { kind: "it" } },
  },
}];
/** Dark: Thought Virus — stun the chosen enemy AND every adjacent enemy. */
const GREENSHAW_DARK: readonly Ability[] = [{
  id: id("greenshaw_thought_virus_spread"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "opponent" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "stun", duration: { kind: "n_turns", n: 1 }, to: { kind: "it" } },
        {
          op: "foreach",
          over: { kind: "radius", origin: { kind: "last_target" }, radius: 1, filter: { controller: "opponent" } },
          do: { op: "stun", duration: { kind: "n_turns", n: 1 }, to: { kind: "it" } },
        },
      ],
    },
  },
}];

/** Light: Rule Rewrite — pick one of three keywords to grant a friendly unit for a turn. */
const VEX_LIGHT: readonly Ability[] = [{
  id: id("vex_rule_rewrite_choose"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    do: {
      op: "choose_one",
      options: [
        { text: "Grant Rush", effect: { op: "grant_keyword", keyword: "rush", duration: { kind: "this_turn" }, to: { kind: "it" } } },
        { text: "Grant Provoke", effect: { op: "grant_keyword", keyword: "provoke", duration: { kind: "this_turn" }, to: { kind: "it" } } },
        { text: "Grant Forcefield", effect: { op: "grant_keyword", keyword: "forcefield", duration: { kind: "this_turn" }, to: { kind: "it" } } },
      ],
    },
  },
}];
/** Dark: House Rules — pick a keyword permanently AND debuff every enemy. */
const VEX_DARK: readonly Ability[] = [{
  id: id("vex_house_rules_seize"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      {
        op: "with_target",
        selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
        do: {
          op: "choose_one",
          options: [
            { text: "Grant Rush (permanent)", effect: { op: "grant_keyword", keyword: "rush", duration: { kind: "permanent" }, to: { kind: "it" } } },
            { text: "Grant Celerity (permanent)", effect: { op: "grant_keyword", keyword: "celerity", duration: { kind: "permanent" }, to: { kind: "it" } } },
            { text: "Grant Frenzy (permanent)", effect: { op: "grant_keyword", keyword: "frenzy", duration: { kind: "permanent" }, to: { kind: "it" } } },
          ],
        },
      },
      {
        op: "foreach",
        over: { kind: "all", filter: { controller: "opponent" } },
        do: { op: "debuff", stats: { power: 1, health: 1 }, duration: { kind: "this_turn" }, to: { kind: "it" } },
      },
    ],
  },
}];

/** Light: Second Breath — heal every friendly unit for 4. */
const VASARA_LIGHT: readonly Ability[] = [{
  id: id("vasara_second_breath_heal"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "foreach",
    over: { kind: "all", filter: { controller: "self" } },
    do: { op: "heal", amount: { kind: "const", value: 4 }, to: { kind: "it" } },
  },
}];
/** Dark: Borrowed Time — heal a friendly unit for 8 + 4 damage to enemy general. */
const VASARA_DARK: readonly Ability[] = [{
  id: id("vasara_borrowed_time_trade"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "heal", amount: { kind: "const", value: 8 }, to: { kind: "it" } },
        { op: "deal_damage", amount: { kind: "const", value: 4 }, to: { kind: "enemy_general" } },
      ],
    },
  },
}];

/** Light: Field Repair — heal a friendly for 5 + grant forcefield. */
const VENT_LIGHT: readonly Ability[] = [{
  id: id("vent_field_repair_patch"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "heal", amount: { kind: "const", value: 5 }, to: { kind: "it" } },
        { op: "grant_keyword", keyword: "forcefield", duration: { kind: "this_turn" }, to: { kind: "it" } },
      ],
    },
  },
}];
/** Dark: Salvage Rights — destroy an enemy unit, summon a 4/4 token on your side. */
const VENT_DARK: readonly Ability[] = [{
  id: id("vent_salvage_rights_seize"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "with_target",
    selector: { kind: "single", filter: { controller: "opponent" }, chooser: "player" },
    do: {
      op: "sequence",
      steps: [
        { op: "destroy", to: { kind: "it" } },
        { op: "summon", tokenId: "tok_calculation", at: { kind: "random_empty" }, controller: "self" },
      ],
    },
  },
}];

/** Light: Investigator's Sight — draw 2 + mill 1 from opponent. */
const PROCTOR_LIGHT: readonly Ability[] = [{
  id: id("proctor_investigator_sight_read"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
      { op: "mill", amount: { kind: "const", value: 1 }, who: "opponent" },
    ],
  },
}];
/** Dark: Architect's Eye — draw 3, opponent mills 3, opponent discards 1. */
const PROCTOR_DARK: readonly Ability[] = [{
  id: id("proctor_architect_eye_seize"),
  trigger: { kind: "on_cast" },
  effect: {
    op: "sequence",
    steps: [
      { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
      { op: "mill", amount: { kind: "const", value: 3 }, who: "opponent" },
      { op: "discard", amount: { kind: "const", value: 1 }, from: "opponent", mode: "random" },
    ],
  },
}];

const SIGS: readonly SigDef[] = [
  { professor: "kanevas", sigN: 1,
    light: { ability: "Harmonize", flavor: "Sync to me. We move as one.", abilities: KANEVAS_LIGHT },
    dark: { ability: "Dissonance", flavor: "Sync to me. They will move as I choose.", abilities: KANEVAS_DARK } },
  { professor: "aoki", sigN: 2,
    light: { ability: "Unseen Passage", flavor: "Walk where they cannot watch.", abilities: AOKI_LIGHT },
    dark: { ability: "Private Confession", flavor: "Their secrets are mine now.", abilities: AOKI_DARK } },
  { professor: "halverez", sigN: 3,
    light: { ability: "Soul-Read", flavor: "Show me what you treasure.", abilities: HALVEREZ_LIGHT },
    dark: { ability: "Soul-Take", flavor: "It is mine now. Always was.", abilities: HALVEREZ_DARK } },
  { professor: "orphic", sigN: 4,
    light: { ability: "Phase-Step", flavor: "Through. Out the other side.", abilities: ORPHIC_LIGHT },
    dark: { ability: "Dimensional Drift", flavor: "Through... mostly.", abilities: ORPHIC_DARK } },
  { professor: "mireille", sigN: 5,
    light: { ability: "Viral Word", flavor: "Believe me. Just for a moment.", abilities: MIREILLE_LIGHT },
    dark: { ability: "Thought Carry", flavor: "Believe me. Tell everyone.", abilities: MIREILLE_DARK } },
  { professor: "kasra", sigN: 6,
    light: { ability: "Parade Order", flavor: "Parade order. To me. Now.", abilities: KASRA_LIGHT },
    dark: { ability: "Acceptable Casualties", flavor: "Some losses are acceptable. These.", abilities: KASRA_DARK } },
  { professor: "vellis", sigN: 7,
    light: { ability: "Verbal Contract", flavor: "Agreed. For five turns of the wheel.", abilities: VELLIS_LIGHT },
    dark: { ability: "Blood Oath", flavor: "Agreed. For all turns. Mine.", abilities: VELLIS_DARK } },
  { professor: "greenshaw", sigN: 8,
    light: { ability: "Quarantine", flavor: "Held. You will not move.", abilities: GREENSHAW_LIGHT },
    dark: { ability: "Thought Virus", flavor: "Held. And contagious.", abilities: GREENSHAW_DARK } },
  { professor: "vex", sigN: 9,
    light: { ability: "Rule Rewrite", flavor: "House rules. For this turn.", abilities: VEX_LIGHT },
    dark: { ability: "House Rules", flavor: "House rules. From now on. Forever.", abilities: VEX_DARK } },
  { professor: "vasara", sigN: 10,
    light: { ability: "Second Breath", flavor: "Again. Not finished.", abilities: VASARA_LIGHT },
    dark: { ability: "Borrowed Time", flavor: "Again. At their cost.", abilities: VASARA_DARK } },
  { professor: "vent", sigN: 11,
    light: { ability: "Field Repair", flavor: "Fixed. Stronger than before.", abilities: VENT_LIGHT },
    dark: { ability: "Salvage Rights", flavor: "Salvaged. Their loss, your gain.", abilities: VENT_DARK } },
  { professor: "proctor", sigN: 12,
    light: { ability: "Investigator's Sight", flavor: "There. The next answer.", abilities: PROCTOR_LIGHT },
    dark: { ability: "Architect's Eye", flavor: "There. And there. And there. All of it. Yours.", abilities: PROCTOR_DARK } },
];

/* The visual art for each signature spell reuses the F.4 cinematic's
 * start frame so the card and the played cinematic look like the
 * same beat. */
function sigArt(sigN: number, variant: "light" | "dark"): string {
  return assetUrl(
    `art/guild-cutscenes/f4_abilities/cs_sig_${sigN}_${variant}_start.png`,
  );
}

const ALL: CardDefinition[] = [];
for (const sig of SIGS) {
  const lightSlug = sig.light.ability.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const darkSlug = sig.dark.ability.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  ALL.push({
    id: `s2_professors_${sig.professor}_${lightSlug}` as CardDefinition["id"],
    name: sig.light.ability,
    faction: "architect",
    cardType: "spell",
    rarity: "rare",
    cost: 5,
    keywords: [],
    abilities: sig.light.abilities,
    art: sigArt(sig.sigN, "light"),
    flavorText: sig.light.flavor,
    rulesVersion: "1.1.0",
    trial_categories: [],
  });
  ALL.push({
    id: `s2_professors_${sig.professor}_${darkSlug}` as CardDefinition["id"],
    name: sig.dark.ability,
    faction: "thought_virus",
    cardType: "spell",
    rarity: "rare",
    cost: 5,
    keywords: [],
    abilities: sig.dark.abilities,
    art: sigArt(sig.sigN, "dark"),
    flavorText: sig.dark.flavor,
    rulesVersion: "1.1.0",
    trial_categories: [],
  });
}

export const S2_PROFESSOR_SIGNATURE_CARDS: readonly CardDefinition[] = ALL;
