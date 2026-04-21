/* ═══════════════════════════════════════════════════════
   RECURRING SUIT ART PROMPTS — seasonal, event, vote, and
   membership-rental suits.

   The base 1,080-prompt catalog in suitArtPrompts.ts is a
   HARD INVARIANT (18 sets × 6 rarities × 10 slots). Adding
   new sets there breaks the coverage test and re-numbers
   every downstream CSV. This parallel catalog keeps the
   invariant intact and lets the art pipeline treat rental /
   annual sets differently.

   This catalog covers:
     • 4 seasonal sets (Spring / Summer / Autumn / Winter)
     • 4 seasonal-event sets (CiJ + placeholders)
     • 4 annual governance-vote sets (State of the Ark,
       Faction Succession, Apocalypse Protocol, Oracle's
       Question)
     • 1 founder rental — Iron Clad Lions ceremonial

   Every rental set declares:
     • ownership: "rental"
     • membershipId: "dgrs-lions-club"
     • equipSlotMapping: 10-slot → 16+-slot paper doll

   The count is parametric: it's literally
   sum(set.rarities.length × 10) — no magic number.
   ═══════════════════════════════════════════════════════ */

import { DGRS_LIONS_CLUB_MEMBERSHIP_ID } from "./lionsClub";
import type { SuitEquipSlot } from "./suitEquipSlots";
import {
  ANATOMICAL_REGIONS,
  ELEMENT_PALETTES,
  NEUTRAL_ELEMENT_PALETTE,
  NEUTRAL_SPECIES_DECAL,
  RARITY_LABELS,
  RARITY_MODIFIERS,
  type Priority,
  type Rarity,
  SPECIES_DECALS,
  SUIT_PIVOT_POINTS,
  SUIT_PREAMBLE,
  SUIT_SLOT_ORDER,
  type SuitSlot,
  type SpeciesKey,
  type ElementKey,
} from "./suitArtPrompts";

export type RecurringSetCategory =
  | "seasonal"
  | "seasonal-event"
  | "annual-vote"
  | "annual-founder";

export type RecurringOwnership = "rental";

export type RecurringRenewalCycle =
  | "seasonal"
  | "seasonal-event"
  | "annual-vote"
  | "annual-founder";

export interface RecurringSuitSetDef {
  id: string;
  name: string;
  category: RecurringSetCategory;
  motif: string;

  ownership: RecurringOwnership;
  renewalCycle: RecurringRenewalCycle;
  /** Required-membership org id (e.g. "dgrs-lions-club"). */
  membershipId: string;
  availabilityYear: number;

  /** Rarities actually issued for this set (Iron Lion only
   *  ships legendary + mythic, most seasons ship all six). */
  rarities: readonly Rarity[];

  /** Optional palette/decal bakes, matching the permanent catalog. */
  bakedElement?: ElementKey;
  bakedSpecies?: SpeciesKey;

  /** 10 art-prompt slots → 16+ paper-doll slots. Every set MUST
   *  declare this explicitly so the compositor has no ambiguity. */
  equipSlotMapping: Record<SuitSlot, SuitEquipSlot>;

  /** Optional link to a CommunityVote id (annual-vote suits only). */
  linkedVoteId?: string;

  /** Optional link to a seasonal-event registry id. */
  linkedEventId?: string;
}

/**
 * Default 10-slot → 16-slot mapping that matches the canonical
 * paper doll. Sets override only when a piece legitimately
 * belongs in a different gameplay slot (the Iron Lion lion-mask,
 * for instance, goes on `head` since `base-mask` is creation-locked).
 */
export const DEFAULT_EQUIP_SLOT_MAPPING: Record<SuitSlot, SuitEquipSlot> = {
  head: "head",
  chest: "chest",
  shoulders: "shoulders",
  arms: "arms",
  gloves: "gloves",
  belt: "belt",
  legs: "legs",
  feet: "feet",
  "weapon-primary": "weapon-primary",
  back: "back",
};

/* ─── Seasonal (4) ─── */

const SEASONAL_SETS: readonly RecurringSuitSetDef[] = [
  {
    id: "vernal-quickening-regalia",
    name: "Vernal Quickening Regalia",
    category: "seasonal",
    renewalCycle: "seasonal",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["common", "uncommon", "rare", "epic", "legendary", "mythic"],
    motif:
      "Spring regalia — fresh-brass plating tinted with new-growth green, seed-satchel belt, pollen-glass glyphs on the pauldrons, buds and thorns etched along every seam",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "solstice-forge-plate",
    name: "Solstice Forge-Plate",
    category: "seasonal",
    renewalCycle: "seasonal",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["common", "uncommon", "rare", "epic", "legendary", "mythic"],
    motif:
      "Summer regalia — sun-bronze plates with heat-bloomed enamel, forge-scale greaves, cicada-wing cape seams, ember-filigree along every edge",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "harvest-ledger-coat",
    name: "Harvest Ledger-Coat",
    category: "seasonal",
    renewalCycle: "seasonal",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["common", "uncommon", "rare", "epic", "legendary", "mythic"],
    motif:
      "Autumn regalia — rust-leather longcoat over black-iron plate, abacus gauntlets with real sliding beads, wheat-sheaf sigil on the belt, storm-lantern at the hip",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "deep-winter-bulwark",
    name: "Deep-Winter Bulwark",
    category: "seasonal",
    renewalCycle: "seasonal",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["common", "uncommon", "rare", "epic", "legendary", "mythic"],
    motif:
      "Winter regalia — white lacquer over black-iron plate, frost-glyph filigree that reads cold to the touch, fur-lined collar, breath-fogged visor",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
];

/* ─── Seasonal events (4) ─── */

const SEASONAL_EVENT_SETS: readonly RecurringSuitSetDef[] = [
  {
    id: "christmas-in-july-lightworks",
    name: "Christmas-in-July Lightworks",
    category: "seasonal-event",
    renewalCycle: "seasonal-event",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["rare", "epic", "legendary"],
    linkedEventId: "christmas_in_july",
    motif:
      "Christmas-in-July festive regalia — warm gold plate wrapped in holographic tinsel, tree-light chestpiece that actually glows, candy-cane greaves, ornament-pommel belt hook",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "shadow-convergence-mantle",
    name: "Shadow Convergence Mantle",
    category: "seasonal-event",
    renewalCycle: "seasonal-event",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["rare", "epic", "legendary"],
    linkedEventId: "shadow_convergence",
    bakedElement: "space",
    motif:
      "Shadow-Convergence regalia — black-lacquer plate veined with silver constellation lines, eclipse-gold cape, void-stitched gloves, starchart visor",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "first-light-anniversary-plate",
    name: "First-Light Anniversary Plate",
    category: "seasonal-event",
    renewalCycle: "seasonal-event",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["rare", "epic", "legendary"],
    linkedEventId: "anniversary_first_light",
    motif:
      "Anniversary regalia — polished gold rimwork with mother-of-pearl inlay, sunrise-etched chestpiece, commemorative year-sigil at the collar",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "harvest-vigil-longcoat",
    name: "Harvest-Vigil Longcoat",
    category: "seasonal-event",
    renewalCycle: "seasonal-event",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["rare", "epic", "legendary"],
    linkedEventId: "harvest_vigil",
    motif:
      "Harvest-Vigil regalia — candle-wax ivory longcoat with beeswax-sealed glyphs, bone-gold buttons, lantern-ember glow at the belt, remembrance-ribbon at the breast",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
];

/* ─── Annual governance votes (4) ─── */

const ANNUAL_VOTE_SETS: readonly RecurringSuitSetDef[] = [
  {
    id: "state-of-the-ark-vestment",
    name: "State of the Ark Vestment",
    category: "annual-vote",
    renewalCycle: "annual-vote",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["epic", "legendary", "mythic"],
    linkedVoteId: "annual-state-of-the-ark",
    motif:
      "State of the Ark vestment — ceremonial council regalia in ark-deck grey and brass, rostrum-engraved breastplate, parchment-stole across the chest, Antiquarian quill at the belt",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "faction-succession-mantle",
    name: "Faction Succession Mantle",
    category: "annual-vote",
    renewalCycle: "annual-vote",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["epic", "legendary", "mythic"],
    linkedVoteId: "annual-faction-succession",
    motif:
      "Faction Succession mantle — four-paneled cape that rotates the reigning faction's sigil, braid-of-inheritance at the shoulder, ballot-seal at the breast",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "apocalypse-protocol-warplate",
    name: "Apocalypse Protocol Warplate",
    category: "annual-vote",
    renewalCycle: "annual-vote",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["epic", "legendary", "mythic"],
    linkedVoteId: "annual-apocalypse-protocol",
    bakedElement: "fire",
    motif:
      "Apocalypse Protocol warplate — blackened armor scored by real-looking combat damage, protocol-seal stamped at the shoulder, emergency-red glow at the seams, failsafe keys on a lanyard at the belt",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
  {
    id: "oracles-question-robe",
    name: "Oracle's Question Robe",
    category: "annual-vote",
    renewalCycle: "annual-vote",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["epic", "legendary", "mythic"],
    linkedVoteId: "annual-oracles-question",
    bakedElement: "probability",
    motif:
      "Oracle's Question robe — asymmetric probability-cut silks over thin plate, die-faceted pauldrons, query-glyph engraved down the spine, answer-less ballot pinned at the heart",
    equipSlotMapping: DEFAULT_EQUIP_SLOT_MAPPING,
  },
];

/* ─── Annual founder rental (1) — Iron Clad Lions ceremonial ─── */

const IRON_LION_SETS: readonly RecurringSuitSetDef[] = [
  {
    id: "iron-clad-lions-ceremonial",
    name: "Iron Clad Lions Ceremonial",
    category: "annual-founder",
    renewalCycle: "annual-founder",
    ownership: "rental",
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    availabilityYear: 2026,
    rarities: ["legendary", "mythic"],
    motif:
      "Iron Clad Lions ceremonial armor — white lacquered iron plates with a gold lion-mask helm, shoulder sacrificial kneel-points scuffed down to bare metal, mane filigree etched with a rosary of servants' names, gold filigree running the seams, matte-white cape hemmed in gold",
    equipSlotMapping: {
      ...DEFAULT_EQUIP_SLOT_MAPPING,
      // Lion-mask helm occupies gameplay slot "head", not base-mask
      // (base-mask is locked at character creation per suitEquipSlots.ts).
      head: "head",
    },
  },
];

/* ─── Full recurring roster ─── */

export const RECURRING_SUIT_SET_ROSTER: readonly RecurringSuitSetDef[] = [
  ...SEASONAL_SETS,
  ...SEASONAL_EVENT_SETS,
  ...ANNUAL_VOTE_SETS,
  ...IRON_LION_SETS,
];

/* ─── Composer + asset-id helpers ─── */

export interface RecurringSuitArtPrompt {
  assetId: string;
  setId: string;
  setName: string;
  category: RecurringSetCategory;
  rarity: Rarity;
  slot: SuitSlot;
  prompt: string;
  resolution: string;
  priority: Priority;
  dependencies: readonly string[];
  /* Ownership + lifecycle */
  ownership: RecurringOwnership;
  renewalCycle: RecurringRenewalCycle;
  membershipId: string;
  availabilityYear: number;
  /* Gameplay-slot projection */
  equipSlot: SuitEquipSlot;
}

export const RECURRING_SUIT_ART_RESOLUTION = "1024x1536";

const RECURRING_SUIT_ART_DEPENDENCIES = [
  "suit_preamble",
  "suit_pivot_points",
] as const;

export function recurringAssetId(
  setId: string,
  rarity: Rarity,
  slot: SuitSlot,
): string {
  return `recurring:${setId}:${rarity}:${slot}`;
}

/** Pure — same input always produces the same string. Reuses the
 *  exact §G.8 body format from the permanent catalog so artists
 *  brief both surfaces identically. */
export function buildRecurringSuitPrompt(
  set: RecurringSuitSetDef,
  rarity: Rarity,
  slot: SuitSlot,
): string {
  const elementPalette = set.bakedElement
    ? ELEMENT_PALETTES[set.bakedElement]
    : NEUTRAL_ELEMENT_PALETTE;
  const speciesDecal = set.bakedSpecies
    ? SPECIES_DECALS[set.bakedSpecies]
    : NEUTRAL_SPECIES_DECAL;

  const body =
    `Render ONLY the ${slot} piece for the ${set.name} suit, ${RARITY_LABELS[rarity]} tier. ` +
    `The piece covers ${ANATOMICAL_REGIONS[slot]}; everything outside this region must be ` +
    `fully transparent alpha, including any part of the body itself. ` +
    `Piece motif: ${set.motif}. ` +
    `Rarity modifiers: ${RARITY_MODIFIERS[rarity]}. ` +
    `Element tint: ${elementPalette}. ` +
    `Species etching overlay: ${speciesDecal}. ` +
    `Alignment with base pose: joints at exact pixel pivots. ${SUIT_PIVOT_POINTS} ` +
    `Do not render any body part or clothing outside the ${slot} anatomical region. ` +
    `Lifecycle note: ${set.renewalCycle} rental — this piece returns to the chapter when membership lapses.`;

  return `${SUIT_PREAMBLE}\n\n${body}`;
}

function expandRecurringCatalog(): readonly RecurringSuitArtPrompt[] {
  const out: RecurringSuitArtPrompt[] = [];
  for (const set of RECURRING_SUIT_SET_ROSTER) {
    for (const rarity of set.rarities) {
      for (const slot of SUIT_SLOT_ORDER) {
        out.push({
          assetId: recurringAssetId(set.id, rarity, slot),
          setId: set.id,
          setName: set.name,
          category: set.category,
          rarity,
          slot,
          prompt: buildRecurringSuitPrompt(set, rarity, slot),
          resolution: RECURRING_SUIT_ART_RESOLUTION,
          priority: rarity === "legendary" || rarity === "mythic" ? "P1" : "P2",
          dependencies: RECURRING_SUIT_ART_DEPENDENCIES,
          ownership: set.ownership,
          renewalCycle: set.renewalCycle,
          membershipId: set.membershipId,
          availabilityYear: set.availabilityYear,
          equipSlot: set.equipSlotMapping[slot],
        });
      }
    }
  }
  return out;
}

export const RECURRING_SUIT_ART_PROMPTS: readonly RecurringSuitArtPrompt[] =
  expandRecurringCatalog();

/* ─── Lookup helpers ─── */

export function getRecurringSet(
  setId: string,
): RecurringSuitSetDef | undefined {
  return RECURRING_SUIT_SET_ROSTER.find((s) => s.id === setId);
}

export function getRecurringSetsByCategory(
  category: RecurringSetCategory,
): readonly RecurringSuitSetDef[] {
  return RECURRING_SUIT_SET_ROSTER.filter((s) => s.category === category);
}

export function getPromptsForRecurringSet(
  setId: string,
): readonly RecurringSuitArtPrompt[] {
  return RECURRING_SUIT_ART_PROMPTS.filter((p) => p.setId === setId);
}
