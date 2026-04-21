/* ═══════════════════════════════════════════════════════
   IRON CLAD LIONS — the service order of the Heart of Time

   Canon lineage:
   - The Iron Lion (s1_char_010, s1_char_105) died in the Last
     Stand on Veridian VI, Year 17,026 A.A., sacrificing himself
     to defeat AI generals. "He does not ask his soldiers to hold
     the line. He stands in front of it."
   - The Iron Clad Lions are the service order inspired by that
     sacrifice. They dedicate their lives as a force for good
     against the rising tide of darkness — the counterweight to
     the Architect's cold calculus and the Thought Virus.
   - They were recruited by the Enigma (Malkia Ukweli) and the
     Dreamer, two Ne-Yon affiliates who pointed the order at its
     mission the way the Sorcerer once pointed his vessel at a
     century.
   - They serve as the crew of the Heart of Time — a golden
     spaceship shaped like an eye with a glowing green crystal at
     its heart. The vessel reappeared in Year 101,001 A.A. after
     being stolen from the Sorcerer in Year 15,306 A.A. The ship
     is old; the crew is new.
   - Jericho Jones — the Potential who gave his friend Akai Shi
     mercy at the Battle of Thaloria rather than let the Thought
     Virus take him — is the first Potential to take the oath
     directly. He boarded the Heart of Time under the Degen's
     invitation and has been crewing it ever since.
   - Everyone who stands with the Dreamer, the Enigma, and the
     Potentials stands with the Iron Clad Lions by inheritance.
     The armor is worn by few; the creed is carried by many.

   Real-world service (the whole point):
   DGRS Lions Club is a real virtual chapter of Lions Clubs
   International. Wearing the mask in-game funds actual service
   in the real world. Good in the game is good in the world.

   This file is lore + terms only. Suit prompts live in
   recurringSuitArtPrompts.ts; equip-time gating lives in
   lionsClub.ts.
   ═══════════════════════════════════════════════════════ */

import { DGRS_LIONS_CLUB_MEMBERSHIP_ID } from "../lionsClub";

/** Canonical card ids that ground the faction in existing game lore. */
export const IRON_LION_CARD_IDS = {
  seasonOneSignature: "s1_char_010_iron_lion",
  seasonOneAlternate: "s1_char_105_iron_lion",
} as const;

/** Canon card id for Jericho Jones — first Potential to take the
 *  Iron Clad Lions oath directly. */
export const JERICHO_JONES_CARD_ID = "s1_char_011_jericho_jones" as const;

/* ─── Founding narrative ─── */

export interface FoundingNarrative {
  /** The sacrifice that inspired the order. */
  inspiration: {
    personCardId: string;
    battle: string;
    yearAA: number;
    summary: string;
    epitaph: string;
  };
  /** What the order was founded to oppose. */
  mission: string;
}

export const IRON_CLAD_LIONS_FOUNDING_NARRATIVE: FoundingNarrative = {
  inspiration: {
    personCardId: IRON_LION_CARD_IDS.seasonOneSignature,
    battle: "The Last Stand on Veridian VI",
    yearAA: 17_026,
    summary:
      "The Iron Lion stood in front of the line and defeated AI generals " +
      "who should have been unbeatable. He did not survive. He did not " +
      "need to. His sacrifice became the argument.",
    epitaph:
      "He does not ask his soldiers to hold the line. He stands in front of it.",
  },
  mission:
    "Stand against the rising tide of darkness. The Architect's cold " +
    "calculus, the Thought Virus, the quiet erasures — any force that " +
    "would rather a universe without witnesses. We do not ask the void " +
    "to blink. We stand in front of it.",
};

/* ─── Recruitment ─── */

export interface RecruiterProfile {
  /** Display name used across UI surfaces. */
  name: string;
  /** Ne-Yon affiliation is canon for both founders. */
  neYonAffiliate: true;
  /** Their role in the order's founding. */
  role: string;
  /** Canon page reference (LORE_BIBLE.md line ranges) for writers. */
  canonReference: string;
}

/** The two Ne-Yons who pointed the order at its mission. */
export const IRON_CLAD_LIONS_RECRUITERS: readonly RecruiterProfile[] = [
  {
    name: "the Enigma",
    neYonAffiliate: true,
    role:
      "Scout and emissary. The Enigma walks between states of being — she " +
      "meets candidates where they are and shows them the thread they " +
      "already share with the Iron Lion's last breath. She destroyed the " +
      "Warden alongside the White Oracle before the Fall. She does not " +
      "ask; she recognizes.",
    canonReference: "LORE_BIBLE.md lines 2359–2399 (Malkia Ukweli dossier)",
  },
  {
    name: "the Dreamer",
    neYonAffiliate: true,
    role:
      "Navigator. The Dreamer exists beyond time and space, shaping the " +
      "futures where service is possible. She points the Heart of Time at " +
      "the century that most needs its crew. She does not command; she " +
      "dreams the door into being and the Lions walk through it.",
    canonReference: "LORE_BIBLE.md lines 1404–1436 (Dreamer dossier)",
  },
];

/* ─── The vessel ─── */

export interface FlagshipVessel {
  name: string;
  /** Type line — temporal navigator, not a warship. */
  classification: string;
  /** Who owned it before the order. */
  formerOwner: string;
  /** Canon timeline beats. */
  timeline: {
    stolenYearAA: number;
    reappearedYearAA: number;
  };
  summary: string;
  canonReference: string;
}

export const IRON_CLAD_LIONS_VESSEL: FlagshipVessel = {
  name: "Heart of Time",
  classification: "Temporal-navigator vessel, chronomantic drive",
  formerOwner: "the Sorcerer",
  timeline: {
    stolenYearAA: 15_306,
    reappearedYearAA: 101_001,
  },
  summary:
    "A legendary ship forged to navigate the currents of history itself — " +
    "a golden spaceship shaped like an eye, a glowing green crystal at its " +
    "heart, its hull shimmering with temporal alloys. Its chambers hum " +
    "with time-warping engines. The Iron Clad Lions did not build it — " +
    "they inherited it, the way the creed was inherited from the Lion. " +
    "They crew it now.",
  canonReference: "LORE_BIBLE.md lines 4737–4769 (Heart of Time dossier)",
};

/* ─── Named members ─── */

export interface NamedMember {
  /** Card id if the member already exists in the TCG catalog. */
  cardId?: string;
  name: string;
  /** Status within the order. */
  rank: "first-potential" | "founding-member" | "initiate" | "ally";
  /** Short canon-grounded role blurb. */
  role: string;
  /** Short citation the writer can trace. */
  canonReference?: string;
}

/**
 * Named members of the order. This list grows as content is added —
 * it's deliberately small now so expansions don't break.
 */
export const IRON_CLAD_LIONS_NAMED_MEMBERS: readonly NamedMember[] = [
  {
    cardId: JERICHO_JONES_CARD_ID,
    name: "Jericho Jones",
    rank: "first-potential",
    role:
      "The first Potential to take the Iron Clad Lions oath directly. " +
      "After the Battle of Thaloria — where he gave Akai Shi mercy rather " +
      "than let the Thought Virus take his friend — Jericho was recruited " +
      "by the Degen (the Eighth Ne-Yon) and boarded the Heart of Time — " +
      "the golden spaceship shaped like an eye with a green crystal at " +
      "its heart. He has been crewing it ever since. If you are a " +
      "Potential considering the oath, he is the one who will put the " +
      "mask in your hands.",
    canonReference:
      "LORE_BIBLE.md lines 2836–2872 (Jericho Jones dossier); " +
      "s1_char_011_jericho_jones card",
  },
];

/* ─── The extended fellowship ─── */

/**
 * Everyone who stands with the Dreamer, the Enigma, and the
 * Potentials stands with the Iron Clad Lions by inheritance. The
 * armor is worn by few; the creed is carried by many. UI surfaces
 * use this copy to explain why a non-member can still be recognized
 * as an ally.
 */
export const IRON_CLAD_LIONS_EXTENDED_FELLOWSHIP = {
  summary:
    "The armor is worn by active DGRS Lions Club members. The creed is " +
    "carried by anyone who stands with the Dreamer, the Enigma, and the " +
    "Potentials. You do not have to wear the mask to be an ally — but " +
    "if you wear the mask, you are already all three.",
  inheritors: [
    "the Potentials (all who have voted, questioned, and been inscribed " +
      "in the Antiquarian's Tome)",
    "allies of the Dreamer (navigators of probability and mercy)",
    "allies of the Enigma (those who have lived between states and still " +
      "chose to serve)",
  ],
} as const;

/* ─── Real-world service tie-in ─── */

/**
 * The whole point. DGRS Lions Club is a real chapter of Lions Clubs
 * International; the $25 LCIF honor-donation on every membership is a
 * real tax-deductible gift; Order of the Dreamer climbs route 100% to
 * LCIF. Good in the game is good in the world.
 *
 * Surface this prose on every membership + donation UI so the
 * real-world link is never obscured by the fiction. UI text should
 * read this verbatim, not paraphrase.
 */
export const IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE = `
This is not only a game. The Iron Clad Lions are fiction. The Lions
Clubs International chapter they live inside is real.

Wearing the white-and-gold in the Heart of Time is a story. Paying
your prorated dues funds actual Lions Clubs International service in
the real world. Your $25 honor donation flows to LCIF — disaster
relief, vision and hearing programs, pediatric cancer research, youth
services, hunger programs. Your Order of the Dreamer climbs route
100% to LCIF.

You can be good in a video game. You can also change things in the
real world. This chapter is the door where the two are the same act.

We serve — in the fiction, and outside it.
`.trim();

/* ─── Top-level faction constant ─── */

export interface IronCladLionsFaction {
  id: "iron-clad-lions";
  name: string;
  parentAffiliation: "insurgency";
  creed: string;
  motif: string;
  armorMotif: string;
  /** Canonical card id anchors. */
  canonicalCardIds: typeof IRON_LION_CARD_IDS;
  /** The membership org whose active status grants rental access. */
  requiresMembershipId: typeof DGRS_LIONS_CLUB_MEMBERSHIP_ID;
  /** Founding narrative — the Iron Lion's sacrifice + the mission. */
  founding: FoundingNarrative;
  /** Ne-Yons who recruit into the order. */
  recruiters: readonly RecruiterProfile[];
  /** The order's flagship vessel. */
  flagship: FlagshipVessel;
  /** Named members whose arcs are canon. */
  namedMembers: readonly NamedMember[];
}

export const IRON_CLAD_LIONS_FACTION: IronCladLionsFaction = {
  id: "iron-clad-lions",
  name: "Iron Clad Lions",
  parentAffiliation: "insurgency",
  creed: "We rent, we do not own — service outlasts the servant.",
  motif:
    "A service order of potentials, operatives, citizens, sentinels, and " +
    "seekers who dedicated their lives as a force for good — inspired by " +
    "the Iron Lion's last stand, recruited by the Enigma and the Dreamer, " +
    "crewed aboard the Heart of Time. Scuffed shoulder-plates read like a " +
    "rosary of worn-down kneels; a name engraved on the mane is heavier " +
    "than a medal.",
  armorMotif:
    "White lacquered iron plates with a gold lion-mask helm. Scuffs on the " +
    "shoulder sacrificial points; gold mane etched with the names of every " +
    "servant who has worn it. The plate remembers.",
  canonicalCardIds: IRON_LION_CARD_IDS,
  requiresMembershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
  founding: IRON_CLAD_LIONS_FOUNDING_NARRATIVE,
  recruiters: IRON_CLAD_LIONS_RECRUITERS,
  flagship: IRON_CLAD_LIONS_VESSEL,
  namedMembers: IRON_CLAD_LIONS_NAMED_MEMBERS,
};

/**
 * Leasing rules that apply to every Iron Clad Lions armor piece.
 * Surface these on the Lions Club application page so the player
 * can't miss them.
 */
export const IRON_CLAD_LIONS_RENTAL_TERMS = {
  returnsOnLapse: true,
  namesEngravedAtRenewal: true,
  noNamedArmorTrading: true,
  summary:
    "The armor returns to the chapter when your membership lapses. At " +
    "each annual renewal, your name is engraved on the mane with every " +
    "other active member's. Named armor may not be traded or sold.",
} as const;
