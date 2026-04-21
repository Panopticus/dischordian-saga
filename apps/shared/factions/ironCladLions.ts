/* ═══════════════════════════════════════════════════════
   IRON CLAD LIONS — service order of the DGRS Lions Club

   Canonical Iron Lion card heroes (s1_char_010, s1_char_105)
   are reframed here as the founding members of a service
   order that predates the Fall. The ceremonial armor — white
   lacquered iron plates with a gold lion-mask helm — is
   LEASED to active DGRS Lions Club members, not owned. The
   mane is engraved with the name of every servant who has
   worn it; fresh names are added at each annual renewal.

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
}

export const IRON_CLAD_LIONS_FACTION: IronCladLionsFaction = {
  id: "iron-clad-lions",
  name: "Iron Clad Lions",
  parentAffiliation: "insurgency",
  creed: "We rent, we do not own — service outlasts the servant.",
  motif:
    "A pre-Fall service order whose members kneel before every campaign. " +
    "Scuffed shoulder-plates read like a rosary of worn-down kneels; a " +
    "name engraved on the mane is heavier than a medal.",
  armorMotif:
    "White lacquered iron plates with a gold lion-mask helm. Scuffs on the " +
    "shoulder sacrificial points; gold mane etched with the names of every " +
    "servant who has worn it. The plate remembers.",
  canonicalCardIds: IRON_LION_CARD_IDS,
  requiresMembershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
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
