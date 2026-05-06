// apps/shared/tradeEmpire/itemTags.ts
//
// Political alignment + craft-method tagging for inventory items.
// Phase 1 of the items-matter / Game-of-Thrones arc.
//
// Design choice: alignment is *derived*, not stored. Cards already
// declare `faction`; suit sets declare an id we map to a sub-house;
// materials map by source. We avoid a schema migration until a
// later phase actually needs to override the derived value (e.g.,
// looted cargo whose alignment depends on which faction's freighter
// you took it from).
//
// Craft method derives from the existing `obtainedVia` field on
// user_cards / ship_upgrades / etc.

import type { Faction } from "../tcg-core/types/Card";
import type { SubHouseKey } from "./houses";

// --- Political alignment --------------------------------------------------

/**
 * What a single inventory item politically signals. Items either point
 * to one sub-house (a card from the New Babylon faction defaults to
 * Authority's Ledger) or are neutral (most class/element suit pieces,
 * generic materials). Brokers and agendas read this to decide if the
 * item is acceptable as tribute, demanded as tax, or disqualifying
 * to wear into a court.
 */
export type PoliticalAlignment = SubHouseKey | "neutral";

/**
 * How an item came into the player's possession. Drives gift-weight
 * (hand-crafted > market-bought) and tribute eligibility (Antiquarian
 * canonically refuses anything not provenance-clean).
 */
export type CraftMethod =
  | "hand_crafted" // Player-crafted via any of the three crafting systems
  | "market_bought" // Acquired via store / vendor / cash purchase
  | "looted" // Mission/raid drop, faction unknown
  | "gifted" // Granted by an NPC or quest reward
  | "starter" // Seeded at character creation
  | "rewarded" // Generic reward (achievements, daily streaks)
  | "unknown"; // Fallback when obtainedVia is missing/legacy

// --- TCG Faction → SubHouse mapping ---------------------------------------

/**
 * Each TCG `Faction` maps to ONE sub-house by default — the
 * "establishment" house inside that faction. A card author can
 * override per-card later (Phase 3) but for Phase 1 the faction tag
 * alone determines alignment.
 */
const TCG_FACTION_TO_SUB_HOUSE: Readonly<Record<Faction, SubHouseKey | "neutral">> = {
  architect: "ae_architects_court",
  dreamer: "dreamer_shield_opaque",
  insurgency: "insurgency_old_network",
  new_babylon: "nb_authoritys_ledger",
  antiquarian: "antiquarian_shelfmates",
  thought_virus: "tv_sovereigns_circle",
  hierarchy_of_damned: "hierarchy_severance",
  neutral: "neutral",
};

export function tcgFactionToAlignment(faction: Faction): PoliticalAlignment {
  return TCG_FACTION_TO_SUB_HOUSE[faction];
}

// --- Suit set → SubHouse mapping ------------------------------------------

/**
 * Only suit sets with explicit narrative alignment map to a sub-house.
 * Class/element/species sets stay neutral so wearing a generic loadout
 * doesn't accidentally trigger court reactions.
 *
 * This table is intentionally sparse and conservative — Phase 3
 * (suit-in-court diplomacy) will expand it as bonus-ladder hooks
 * surface specific named sets.
 */
const SUIT_SET_ID_TO_SUB_HOUSE: Readonly<Record<string, SubHouseKey>> = {
  // Foundation-themed sets aligned to specific NPCs / factions:
  "regalia-of-the-seeing-stylus": "antiquarian_shelfmates", // Oracle / divination — Antiquarian shelf-mates
  "low-profile-tailoring": "insurgency_zero_doctrine", // Spy — Engineer's surgical doctrine
  "bulwark-of-the-eighth-column": "nb_authoritys_ledger", // Soldier regimentation — New Babylon Ledger
  "pressure-loom-harness": "nb_civic_engineers", // Engineer — civic engineers
  "black-crepe-weave": "hierarchy_acquisitions", // Assassin — hostile-takeover wing
};

export function suitSetIdToAlignment(setId: string): PoliticalAlignment {
  return SUIT_SET_ID_TO_SUB_HOUSE[setId] ?? "neutral";
}

// --- Material → SubHouse mapping ------------------------------------------

/**
 * Most crafting materials are politically neutral (raw alloy,
 * essences). A small number derive from a faction's territory or
 * proprietary process; those carry alignment.
 */
const MATERIAL_ID_TO_SUB_HOUSE: Readonly<Record<string, SubHouseKey>> = {
  // (Future: e.g., "trench-bone-meal" → hierarchy_severance,
  // "antiquarian-vellum" → antiquarian_shelfmates.)
};

export function materialIdToAlignment(materialId: string): PoliticalAlignment {
  return MATERIAL_ID_TO_SUB_HOUSE[materialId] ?? "neutral";
}

// --- obtainedVia → CraftMethod -------------------------------------------

/**
 * Map the legacy free-form `obtainedVia` strings already written by
 * craftingRouter and other sources onto the canonical CraftMethod
 * enum. Unrecognised strings fall through to "unknown" — that's
 * intentional, so any new source has to be explicitly classified
 * before it can affect tribute weight.
 */
export function obtainedViaToCraftMethod(obtainedVia: string | null | undefined): CraftMethod {
  if (!obtainedVia) return "unknown";
  switch (obtainedVia) {
    case "starter":
      return "starter";
    case "purchase":
    case "store":
    case "shop":
      return "market_bought";
    case "crafting":
    case "crafting_upgrade":
    case "crafting_foil":
    case "fusion":
    case "transmute":
    case "engineers_bench":
    case "suit_craft":
      return "hand_crafted";
    case "quest":
    case "quest_reward":
    case "gift":
    case "npc_gift":
      return "gifted";
    case "drop":
    case "loot":
    case "raid":
    case "battle":
    case "mission":
      return "looted";
    case "achievement":
    case "daily":
    case "streak":
    case "battlepass":
      return "rewarded";
    default:
      return "unknown";
  }
}

// --- Tribute / gift weight ------------------------------------------------

/**
 * Gift-weight multiplier per craft method. Brokers reading a tribute
 * apply this to the base trust delta. Hand-crafted items signal effort;
 * market-bought items signal money but not commitment; loot is anonymous.
 *
 * Antiquarian's "bibliographic precision" refuses anything below 0.5
 * (caller checks this; the multiplier just provides ordering).
 */
const CRAFT_METHOD_WEIGHT: Readonly<Record<CraftMethod, number>> = {
  hand_crafted: 1.5,
  gifted: 1.0,
  rewarded: 0.8,
  starter: 0.6,
  market_bought: 0.5,
  looted: 0.3,
  unknown: 0.2,
};

export function craftMethodWeight(method: CraftMethod): number {
  return CRAFT_METHOD_WEIGHT[method];
}

// --- Generic item-tag shape -----------------------------------------------

/**
 * Composite tag for a single inventory item. Anything that asks "what
 * is this item politically?" should consume this rather than reading
 * fields directly — we want one place to evolve the derivation.
 */
export interface ItemTag {
  alignment: PoliticalAlignment;
  craftMethod: CraftMethod;
}

export function tagForCard(args: {
  faction: Faction;
  obtainedVia?: string | null;
}): ItemTag {
  return {
    alignment: tcgFactionToAlignment(args.faction),
    craftMethod: obtainedViaToCraftMethod(args.obtainedVia),
  };
}

export function tagForSuitPiece(args: {
  setId: string;
  obtainedVia?: string | null;
}): ItemTag {
  return {
    alignment: suitSetIdToAlignment(args.setId),
    craftMethod: obtainedViaToCraftMethod(args.obtainedVia),
  };
}

export function tagForMaterial(args: {
  materialId: string;
  obtainedVia?: string | null;
}): ItemTag {
  return {
    alignment: materialIdToAlignment(args.materialId),
    craftMethod: obtainedViaToCraftMethod(args.obtainedVia),
  };
}

// --- Acceptability rules --------------------------------------------------

/**
 * Whether a given item can be accepted as tribute by a given
 * sub-house. An item is acceptable if it is aligned to the *receiving*
 * sub-house (or its parent faction sense), or neutral (with a discount).
 * A rival's item is rejected outright.
 *
 * Used by Phase 2's tribute mechanic and by the tax/demand fulfilment
 * path. Keeps that logic out of the routers.
 */
export function isAcceptableTribute(
  item: ItemTag,
  receivingHouse: SubHouseKey,
  rivalHouse: SubHouseKey,
): boolean {
  if (item.alignment === rivalHouse) return false;
  if (item.alignment === "neutral") return true;
  return item.alignment === receivingHouse;
}
