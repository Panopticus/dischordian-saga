/* ═══════════════════════════════════════════════════════
   DIPLOMACY MINIGAME SUIT ADAPTER (plan §G.11)

   Three hooks: word-bank capacity, set-gated unlockable
   demands, and Oracle 10pc's "preview next demand" once
   per negotiation.

   Phase 3 (items-matter / GoT arc) extension: a
   suit-in-court reaction that returns the trust modifier a
   given sub-house applies on entry based on what the player
   is wearing. This is consumed by the contract-signing path,
   the tribute path, and (eventually) by NPC dialog
   selectors when the player visits a court room.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";
import {
  SUB_HOUSE_REGISTRY,
  type SubHouseKey,
} from "../tradeEmpire/houses";
import { suitSetIdToAlignment } from "../tradeEmpire/itemTags";

export interface DiplomacyModifiers {
  /** Extra word-bank slots (additive). */
  wordBankCapacityDelta: number;
  /** Set ids that unlock gated demands. Kept as strings — readers own the demand table. */
  unlockedDemandSetIds: readonly string[];
  /** One "preview next demand" use per negotiation (Oracle 10pc). */
  previewDemandUses: number;
}

export function toDiplomacyModifiers(
  bonuses: readonly AggregatedBonus[],
): DiplomacyModifiers {
  const s = suitOnly(bonuses);
  const oracle = piecesEquippedForSet(s, "regalia-of-the-seeing-stylus");
  const spy = piecesEquippedForSet(s, "low-profile-tailoring");
  const mourner = piecesEquippedForSet(s, "the-mourners-coat");
  const unlocked: string[] = [];
  if (oracle >= 4) unlocked.push("regalia-of-the-seeing-stylus");
  if (spy >= 4) unlocked.push("low-profile-tailoring");
  if (mourner >= 4) unlocked.push("the-mourners-coat");
  return {
    wordBankCapacityDelta: oracle >= 2 ? 2 : spy >= 2 ? 1 : 0,
    unlockedDemandSetIds: unlocked,
    previewDemandUses: oracle >= 10 ? 1 : 0,
  };
}

/** Set-ids the diplomacy adapter knows how to read for political alignment. */
const COURT_AWARE_SET_IDS = [
  "regalia-of-the-seeing-stylus", // Antiquarian shelf-mates
  "low-profile-tailoring", // Insurgency Zero Doctrine
  "bulwark-of-the-eighth-column", // New Babylon Authority's Ledger
  "pressure-loom-harness", // New Babylon Civic Engineers
  "black-crepe-weave", // Hierarchy Acquisitions
] as const;

/**
 * Compute the trust delta a sub-house applies on entry, based on
 * which named suit set the player is wearing >= 4 pieces of (the
 * canonical "set bonus active" threshold per the bonus ladder).
 *
 * Wearing the receiver's own alignment: +2 trust.
 * Wearing the rival's alignment:        -3 trust.
 * Wearing a third-party alignment:      -1 trust.
 * Wearing only neutral sets:             0.
 *
 * Multiple aligned sets stack — wear two of the receiver's
 * alignment and you get +4. This rewards coordinated loadout
 * choices and punishes "I just put on whatever" entries.
 */
export interface CourtEntryReaction {
  /** Sub-house being entered. */
  receivingHouseKey: SubHouseKey;
  /** Net trust delta the house applies on entry. */
  trustDelta: number;
  /** Set ids that contributed to the delta, with their alignment. */
  contributors: ReadonlyArray<{
    setId: string;
    alignment: SubHouseKey | "neutral";
    delta: number;
  }>;
}

export function courtEntryReaction(
  bonuses: readonly AggregatedBonus[],
  receivingHouseKey: SubHouseKey,
): CourtEntryReaction {
  const s = suitOnly(bonuses);
  const receivingDef = SUB_HOUSE_REGISTRY[receivingHouseKey];
  const rivalKey = receivingDef.rivalHouseKey;
  const contributors: Array<{
    setId: string;
    alignment: SubHouseKey | "neutral";
    delta: number;
  }> = [];
  let total = 0;
  for (const setId of COURT_AWARE_SET_IDS) {
    const pieces = piecesEquippedForSet(s, setId);
    if (pieces < 4) continue;
    const alignment = suitSetIdToAlignment(setId);
    if (alignment === "neutral") continue;
    let delta = 0;
    if (alignment === receivingHouseKey) delta = 2;
    else if (alignment === rivalKey) delta = -3;
    else delta = -1;
    contributors.push({ setId, alignment, delta });
    total += delta;
  }
  return { receivingHouseKey, trustDelta: total, contributors };
}
