/* ═══════════════════════════════════════════════════════
   INVENTOR MYTHICS — one-of-one story artifacts (plan §G.7)

   Every named set ships a Mythic tier: a single,
   story-bound heirloom that the schematic/trade/shop
   paths CANNOT produce. These items exist exactly once in
   the run; losing them means losing them.

   This module is the registry of Mythic acquisition beats.
   Three placeholder beats are authored on this branch per
   the plan's §G.7 carve-out; the full roster is
   co-authored with the Act-by-Act narrative team.

   NOTE: the actual piece ids the Mythic yields reuse the
   catalog's `<setId>:mythic:<slot>` identifier from
   suitSets.ts — the Mythic rarity IS part of the asset
   catalog, only its acquisition path is different.
   ═══════════════════════════════════════════════════════ */

import type { Rarity, SuitSlot } from "./suitSets";

export type MythicBeatStatus = "placeholder" | "authored";

export type MythicTrigger =
  | "boss_defeat"
  | "companion_gift"
  | "act_climax"
  | "hidden_encounter";

export interface MythicBeat {
  /** Stable id — `mythic:<setId>:<slot>`. */
  id: string;
  setId: string;
  slot: SuitSlot;
  /** Mythic pieces always resolve to this rarity; fixed here for clarity. */
  rarity: Extract<Rarity, "mythic">;
  /** Plain-English when/where the player earns this one-of-one. */
  description: string;
  /** Canonical trigger tag — feeds content discovery tooling. */
  trigger: MythicTrigger;
  /**
   * Placeholder vs authored. Placeholder beats ship the slot + the
   * render path; final narrative hook is a follow-up with the Act
   * writers.
   */
  status: MythicBeatStatus;
}

function mythicId(setId: string, slot: SuitSlot): string {
  return `mythic:${setId}:${slot}`;
}

/**
 * Placeholder beats — one per named set (18 total). Every one
 * carries a specific enough acquisition premise that the narrative
 * team can refine into canon without starting from zero, and each
 * reuses the §G.5 rarity contract (Mythic pieces exist at the same
 * assetId coords as the crafted rarities; only the acquisition path
 * is different).
 */
export const MYTHIC_BEATS: readonly MythicBeat[] = [
  /* ─── Class sets (5) ─── */
  {
    id: mythicId("regalia-of-the-seeing-stylus", "weapon-primary"),
    setId: "regalia-of-the-seeing-stylus",
    slot: "weapon-primary",
    rarity: "mythic",
    description:
      "Recovered from the first Oracle who wore the Stylus in the Age of Privacy, dropped by the act-climax boss that wears it imperfectly.",
    trigger: "act_climax",
    status: "placeholder",
  },
  {
    id: mythicId("pressure-loom-harness", "chest"),
    setId: "pressure-loom-harness",
    slot: "chest",
    rarity: "mythic",
    description:
      "The Inventor's own workshop apron. Found hanging on a rusted hook in the Engineering Core when the operative finishes the first craft-bench questline.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
  {
    id: mythicId("black-crepe-weave", "back"),
    setId: "black-crepe-weave",
    slot: "back",
    rarity: "mythic",
    description:
      "A mourning sash wrapped around the shoulders of an Assassin who never collected the final contract. Boss drop from the Assassin-ladder act finale.",
    trigger: "act_climax",
    status: "placeholder",
  },
  {
    id: mythicId("bulwark-of-the-eighth-column", "shoulders"),
    setId: "bulwark-of-the-eighth-column",
    slot: "shoulders",
    rarity: "mythic",
    description:
      "The original epaulets of the Eighth Column's commander. A Soldier companion places them on the operative's shoulders when the operative first holds the line on their behalf.",
    trigger: "companion_gift",
    status: "placeholder",
  },
  {
    id: mythicId("low-profile-tailoring", "gloves"),
    setId: "low-profile-tailoring",
    slot: "gloves",
    rarity: "mythic",
    description:
      "Tailor's gloves with a hidden seam, discovered inside the Spy-faction dead drop that the operative retrieves after solving the Clue Journal's Act-1-carryover case.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },

  /* ─── Species sets (3) ─── */
  {
    id: mythicId("arcane-rune-regalia", "head"),
    setId: "arcane-rune-regalia",
    slot: "head",
    rarity: "mythic",
    description:
      "A Demagi coronet whose runes still answer the first person who spoke them. Act-climax boss whose defeat is only possible if the operative has spoken the rune aloud in a scripted dialog.",
    trigger: "act_climax",
    status: "placeholder",
  },
  {
    id: mythicId("clockwork-exoframe", "chest"),
    setId: "clockwork-exoframe",
    slot: "chest",
    rarity: "mythic",
    description:
      "Pulled from a hidden Quarchon war-chest discoverable only by completing a full §B progressive-disclosure chain that ends in the Engineering Deck.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
  {
    id: mythicId("hybrid-vein-panoply", "arms"),
    setId: "hybrid-vein-panoply",
    slot: "arms",
    rarity: "mythic",
    description:
      "Ne-Yon gauntlets whose filigree threads continue to grow after unequipping. Gifted by the Ne-Yon mentor character once the operative reaches Trust tier 80.",
    trigger: "companion_gift",
    status: "placeholder",
  },

  /* ─── Element sets (8) ─── */
  {
    id: mythicId("geomancers-stratum", "legs"),
    setId: "geomancers-stratum",
    slot: "legs",
    rarity: "mythic",
    description:
      "Slate greaves whose inlaid ley-ore chimes when the wearer stands on sanctified ground. Found in the Hidden Chamber behind the Earth-element Ark event's climax.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
  {
    id: mythicId("ember-bellows-array", "shoulders"),
    setId: "ember-bellows-array",
    slot: "shoulders",
    rarity: "mythic",
    description:
      "Forge-bellows pauldrons still warm from the first ember. Dropped by the Fire-element boss who wore them to a standstill in the Act-finale duel.",
    trigger: "act_climax",
    status: "placeholder",
  },
  {
    id: mythicId("tide-engine-carapace", "chest"),
    setId: "tide-engine-carapace",
    slot: "chest",
    rarity: "mythic",
    description:
      "A dive-plate with a pressure-gauge that still reads the fathoms of an ocean that no longer exists. Recovered from a sealed Water-element pod opened by a Clue-Journal key.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
  {
    id: mythicId("aetheric-dirigible-rig", "back"),
    setId: "aetheric-dirigible-rig",
    slot: "back",
    rarity: "mythic",
    description:
      "Canvas-sail wings stitched by the last aeronaut. A companion who flew beside the operative in an Ark-event sky-chase hands them over after surviving the fall.",
    trigger: "companion_gift",
    status: "placeholder",
  },
  {
    id: mythicId("void-sextant-ensemble", "head"),
    setId: "void-sextant-ensemble",
    slot: "head",
    rarity: "mythic",
    description:
      "A lacquered astrolabe-crown whose star-chart still points true to constellations erased in the Fall. Drops from the Space-element act-climax boss who navigated by it.",
    trigger: "act_climax",
    status: "placeholder",
  },
  {
    id: mythicId("chronometer-livery", "chest"),
    setId: "chronometer-livery",
    slot: "chest",
    rarity: "mythic",
    description:
      "A glass chestplate whose inner gears tick a second slower than the ship's clock. Hidden inside a loop the operative has to exit by refusing a scripted choice.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
  {
    id: mythicId("dicewrights-motley", "belt"),
    setId: "dicewrights-motley",
    slot: "belt",
    rarity: "mythic",
    description:
      "A flipping-coin buckle that always settles on the side the wearer thought of first. Won from Degen's Casino after completing the VIP-room chain the full Dicewright set unlocks.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
  {
    id: mythicId("null-weaver-mantle", "back"),
    setId: "null-weaver-mantle",
    slot: "back",
    rarity: "mythic",
    description:
      "A cloak whose hem refuses to settle because the seams aren't there. Dropped by the Reality-element act-climax boss at the moment the operative is asked to choose a truth and doesn't.",
    trigger: "act_climax",
    status: "placeholder",
  },

  /* ─── Foundation sets (2) ─── */
  {
    id: mythicId("the-mourners-coat", "back"),
    setId: "the-mourners-coat",
    slot: "back",
    rarity: "mythic",
    description:
      "Given — not taken. A late-Act companion who has worn it since before the Fall of Realities bequeaths the coat on their departure from the Ark.",
    trigger: "companion_gift",
    status: "placeholder",
  },
  {
    id: mythicId("the-first-chassis", "chest"),
    setId: "the-first-chassis",
    slot: "chest",
    rarity: "mythic",
    description:
      "The original plating of the Ark's first synthetic crew member. Revealed in a hidden compartment of the cryo bay at the end of the Cryo-Bay Mystery's carry-over case (§F).",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
];

const BY_ID = new Map<string, MythicBeat>(
  MYTHIC_BEATS.map((m) => [m.id, m] as const),
);

export function getMythicBeat(id: string): MythicBeat | null {
  return BY_ID.get(id) ?? null;
}

export function getMythicBeatsForSet(setId: string): readonly MythicBeat[] {
  return MYTHIC_BEATS.filter((m) => m.setId === setId);
}

/** Every set id with at least one authored-or-placeholder Mythic beat. */
export function setIdsWithMythics(): readonly string[] {
  return Array.from(new Set(MYTHIC_BEATS.map((m) => m.setId)));
}
