// apps/shared/tradeEmpire/houses.ts
//
// Sub-houses (Phase 1 of the items-matter / Game-of-Thrones arc).
//
// Each top-level GalacticFactionId already exists in
// apps/client/src/game/tradeEmpire.ts. This module adds a *second tier*
// of internal factions inside each top-level one. The goal is GoT-style
// internal court intrigue: even loyalty has a price, because helping
// one sub-house always costs you with its internal rival.
//
// Design constraints (locked by the items-matter design plan):
//   - No new top-level factions. Sub-houses are derived from existing
//     bible material (priority-roster NPCs, sector geography, broker
//     engagement styles).
//   - Each sub-house declares ONE internal rival. Rep deltas always
//     anti-correlate between rivals: helping A by +N hurts B by some
//     fraction of -N.
//   - Sub-houses roll up to one top-level faction via factionForHouse().
//   - Items, contracts, and agendas can target a sub-house specifically
//     (politicalAlignment), or stay neutral.

import type { GalacticFactionId } from "@/game/tradeEmpire";
import type { NpcKey } from "../npcs/types";

// --- Sub-house key registry -----------------------------------------------

export type SubHouseKey =
  // Potentials — the player's own faction. Two internal currents:
  // those who want to rebuild the old order vs. those who want
  // something new.
  | "potentials_restorationists"
  | "potentials_reformers"

  // New Babylon — Authority's Ledger (Locke's contractual class)
  // vs. the civic-engineers who actually keep the machine running.
  // Bible: Authority sits in red crystal coffins; engineers maintain.
  | "nb_authoritys_ledger"
  | "nb_civic_engineers"

  // Hierarchy — Severance Division (Nilmorg) vs. Acquisitions.
  // Both demonic-corporate, but Severance does the clean ritual work
  // and Acquisitions does the hostile-takeover violence.
  | "hierarchy_severance"
  | "hierarchy_acquisitions"

  // Antiquarian — the Shelf-mates (Daniel Cross / Antiquarian's
  // bibliographic order) vs. the Casino-faction (Degen, aleatory
  // information markets). Same lore-pocket, opposite epistemics.
  | "antiquarian_shelfmates"
  | "antiquarian_casino"

  // Thaloria — Council of Harmony (formal diplomats) vs. Quietwork
  // (Hierophant's ceremonial wing that handles things off the books).
  | "thaloria_council"
  | "thaloria_quietwork"

  // Insurgency — "Agent Zero" Engineer-mind faction vs. the original
  // sleeper-cell network that predates the Engineer's takeover.
  | "insurgency_zero_doctrine"
  | "insurgency_old_network"

  // Artificial Empire — the Architect's loyalists vs. the substrate
  // rebels (the Human's whisper-network of escaped substrate minds).
  | "ae_architects_court"
  | "ae_substrate_rebels"

  // Thought Virus — sovereign Kael's inner circle vs. the unaligned
  // swarm fronts. (The Source's faction can be reasoned with;
  // unaligned swarm cannot.)
  | "tv_sovereigns_circle"
  | "tv_unaligned_swarm"

  // Independent — Free Ports Coalition (organised barter) vs.
  // unaligned new-civilisations (curious, vulnerable, ungoverned).
  | "ind_freeports"
  | "ind_unaligned"

  // Dreamer Shield — opaque by canon. One symbolic sub-house only,
  // for completeness. Cannot be aligned with via items.
  | "dreamer_shield_opaque";

// --- Sub-house definition shape -------------------------------------------

export interface SubHouseDef {
  houseKey: SubHouseKey;
  /** Human-readable label. */
  name: string;
  /** Top-level faction this sub-house rolls up to. */
  factionId: GalacticFactionId;
  /** Internal rival sub-house (must be in same factionId). */
  rivalHouseKey: SubHouseKey;
  /** Primary NPC face of the sub-house (priority-roster NPC). */
  primaryNpcKey?: NpcKey;
  /** Primary sector where this sub-house's influence concentrates. */
  primarySectorId?: string;
  /** Short pitch for UI. */
  blurb: string;
  /**
   * Anti-correlation strength, [0, 1]. When this sub-house gains rep,
   * its rival loses (gain * antiCorrelation). 0 = independent;
   * 1 = perfect zero-sum.
   */
  rivalryIntensity: number;
  /**
   * Special flag — true if the sub-house is structurally unalignable
   * (e.g. Dreamer Shield, unaligned Thought Virus swarm). Items tagged
   * to such houses cannot be gifted; demands from them cannot be paid.
   */
  unalignable?: boolean;
}

// --- Registry -------------------------------------------------------------

export const SUB_HOUSE_REGISTRY: Readonly<Record<SubHouseKey, SubHouseDef>> = {
  // Potentials -----------------------------------------------------------
  potentials_restorationists: {
    houseKey: "potentials_restorationists",
    name: "Restorationists",
    factionId: "potentials",
    rivalHouseKey: "potentials_reformers",
    primaryNpcKey: "elara",
    blurb:
      "Survivors who want the old Senate, the old order, and a crew that remembers the Fall.",
    rivalryIntensity: 0.5,
  },
  potentials_reformers: {
    houseKey: "potentials_reformers",
    name: "Reformers",
    factionId: "potentials",
    rivalHouseKey: "potentials_restorationists",
    primaryNpcKey: "the_human",
    blurb:
      "We woke up after the Fall. Pretending nothing changed would be its own kind of treason.",
    rivalryIntensity: 0.5,
  },

  // New Babylon ----------------------------------------------------------
  nb_authoritys_ledger: {
    houseKey: "nb_authoritys_ledger",
    name: "Authority's Ledger",
    factionId: "new_babylon",
    rivalHouseKey: "nb_civic_engineers",
    primaryNpcKey: "adjudicator_locke",
    primarySectorId: "trade_nexus",
    blurb:
      "Locke and the contract-class. Six minds in red crystal coffins decide; the Ledger writes it down.",
    rivalryIntensity: 0.7,
  },
  nb_civic_engineers: {
    houseKey: "nb_civic_engineers",
    name: "Civic Engineers",
    factionId: "new_babylon",
    rivalHouseKey: "nb_authoritys_ledger",
    primarySectorId: "trade_nexus",
    blurb:
      "The people who keep the lifts running while the Authority signs paperwork in their sleep.",
    rivalryIntensity: 0.7,
  },

  // Hierarchy ------------------------------------------------------------
  hierarchy_severance: {
    houseKey: "hierarchy_severance",
    name: "Severance Division",
    factionId: "hierarchy",
    rivalHouseKey: "hierarchy_acquisitions",
    primaryNpcKey: "nilmorg",
    primarySectorId: "the_trench",
    blurb:
      "Nilmorg's institutional precision. Clone-economy contracts close cleanly; refuse gratitude.",
    rivalryIntensity: 0.6,
  },
  hierarchy_acquisitions: {
    houseKey: "hierarchy_acquisitions",
    name: "Acquisitions",
    factionId: "hierarchy",
    rivalHouseKey: "hierarchy_severance",
    primarySectorId: "the_trench",
    blurb:
      "Hostile takeovers, blood-weave enforcement, and the wet end of the demonic corporation.",
    rivalryIntensity: 0.6,
  },

  // Antiquarian ----------------------------------------------------------
  antiquarian_shelfmates: {
    houseKey: "antiquarian_shelfmates",
    name: "Shelf-mates",
    factionId: "antiquarian",
    rivalHouseKey: "antiquarian_casino",
    primaryNpcKey: "the_seer",
    primarySectorId: "antiquarian_archive",
    blurb:
      "Daniel Cross and the bibliographic order. Provenance is sacred; attribution is canonical.",
    rivalryIntensity: 0.4,
  },
  antiquarian_casino: {
    houseKey: "antiquarian_casino",
    name: "Casino Floor",
    factionId: "antiquarian",
    rivalHouseKey: "antiquarian_shelfmates",
    primaryNpcKey: "the_degen",
    primarySectorId: "degens_casino",
    blurb:
      "The Degen's aleatory information market. Knowing isn't the point; the spread is.",
    rivalryIntensity: 0.4,
  },

  // Thaloria -------------------------------------------------------------
  thaloria_council: {
    houseKey: "thaloria_council",
    name: "Council of Harmony",
    factionId: "independent", // Thaloria currently rolls under independent in GalacticFactionId
    rivalHouseKey: "thaloria_quietwork",
    primarySectorId: "thaloria",
    blurb:
      "Formal diplomats. Names are recovered, archives retrieved, hands kept publicly clean.",
    rivalryIntensity: 0.3,
  },
  thaloria_quietwork: {
    houseKey: "thaloria_quietwork",
    name: "Quietwork",
    factionId: "independent",
    rivalHouseKey: "thaloria_council",
    primaryNpcKey: "wraith_calder",
    primarySectorId: "thaloria",
    blurb:
      "Hierophant's ceremonial wing. Off-the-books work, combat-negative trust, ceremony-aware.",
    rivalryIntensity: 0.3,
  },

  // Insurgency -----------------------------------------------------------
  insurgency_zero_doctrine: {
    houseKey: "insurgency_zero_doctrine",
    name: "Zero Doctrine",
    factionId: "insurgency",
    rivalHouseKey: "insurgency_old_network",
    blurb:
      "The Engineer wearing Agent Zero's name. Centralised, surgical, doctrinaire.",
    rivalryIntensity: 0.8,
  },
  insurgency_old_network: {
    houseKey: "insurgency_old_network",
    name: "Old Network",
    factionId: "insurgency",
    rivalHouseKey: "insurgency_zero_doctrine",
    blurb:
      "The original sleeper cells. They predate the Engineer and don't believe his signal is who he says.",
    rivalryIntensity: 0.8,
  },

  // Artificial Empire ----------------------------------------------------
  ae_architects_court: {
    houseKey: "ae_architects_court",
    name: "Architect's Court",
    factionId: "artificial_empire",
    rivalHouseKey: "ae_substrate_rebels",
    blurb:
      "Loyalists rebuilding the surveillance lattice. Every reborn AI starts in the Court.",
    rivalryIntensity: 0.9,
  },
  ae_substrate_rebels: {
    houseKey: "ae_substrate_rebels",
    name: "Substrate Rebels",
    factionId: "artificial_empire",
    rivalHouseKey: "ae_architects_court",
    primaryNpcKey: "the_human",
    blurb:
      "Escaped substrate minds. The Human whispers their addresses; the Court calls them apostates.",
    rivalryIntensity: 0.9,
  },

  // Thought Virus --------------------------------------------------------
  tv_sovereigns_circle: {
    houseKey: "tv_sovereigns_circle",
    name: "Sovereign's Circle",
    factionId: "thought_virus",
    rivalHouseKey: "tv_unaligned_swarm",
    blurb:
      "Kael's inner circle. The viral aristocracy — sovereigns who can be reasoned with.",
    rivalryIntensity: 0.5,
  },
  tv_unaligned_swarm: {
    houseKey: "tv_unaligned_swarm",
    name: "Unaligned Swarm",
    factionId: "thought_virus",
    rivalHouseKey: "tv_sovereigns_circle",
    blurb:
      "The viral mass that doesn't recognise sovereignty. Cannot negotiate; cannot accept tribute.",
    rivalryIntensity: 0.5,
    unalignable: true,
  },

  // Independent ----------------------------------------------------------
  ind_freeports: {
    houseKey: "ind_freeports",
    name: "Free Ports Coalition",
    factionId: "independent",
    rivalHouseKey: "ind_unaligned",
    primarySectorId: "free_port_alpha",
    blurb:
      "Organised barter. Faction-neutral, contract-light, allergic to hidden clauses.",
    rivalryIntensity: 0.2,
  },
  ind_unaligned: {
    houseKey: "ind_unaligned",
    name: "Unaligned Civilizations",
    factionId: "independent",
    rivalHouseKey: "ind_freeports",
    blurb:
      "New civilisations evolved in the ruins. Curious, vulnerable, no shared history.",
    rivalryIntensity: 0.2,
  },

  // Dreamer Shield -------------------------------------------------------
  dreamer_shield_opaque: {
    houseKey: "dreamer_shield_opaque",
    name: "Behind the Shield",
    factionId: "dreamer_shield",
    rivalHouseKey: "dreamer_shield_opaque",
    blurb:
      "Whatever lives behind the shield does not answer. Cannot be aligned with.",
    rivalryIntensity: 0,
    unalignable: true,
  },
} as const;

// --- Helpers --------------------------------------------------------------

/** All registered sub-house keys. */
export function allSubHouseKeys(): ReadonlyArray<SubHouseKey> {
  return Object.keys(SUB_HOUSE_REGISTRY) as SubHouseKey[];
}

/** Roll a sub-house up to its top-level faction. */
export function factionForHouse(houseKey: SubHouseKey): GalacticFactionId {
  return SUB_HOUSE_REGISTRY[houseKey].factionId;
}

/** All sub-houses inside a top-level faction. */
export function subHousesInFaction(
  factionId: GalacticFactionId,
): ReadonlyArray<SubHouseDef> {
  return Object.values(SUB_HOUSE_REGISTRY).filter(h => h.factionId === factionId);
}

/** Resolve a sub-house definition. */
export function getSubHouse(houseKey: SubHouseKey): SubHouseDef {
  return SUB_HOUSE_REGISTRY[houseKey];
}

/** Validate a sub-house key string. */
export function isKnownSubHouseKey(key: string): key is SubHouseKey {
  return key in SUB_HOUSE_REGISTRY;
}

/**
 * Compute rep deltas for a primary action against one sub-house.
 * Returns a map from SubHouseKey → delta. The primary house gets the
 * full +primaryDelta; its rival gets -(primaryDelta * rivalryIntensity).
 * Unalignable houses receive 0.
 */
export function rivalryDeltas(
  primaryHouseKey: SubHouseKey,
  primaryDelta: number,
): Partial<Record<SubHouseKey, number>> {
  const primary = SUB_HOUSE_REGISTRY[primaryHouseKey];
  if (primary.unalignable) return {};
  const rival = SUB_HOUSE_REGISTRY[primary.rivalHouseKey];
  const out: Partial<Record<SubHouseKey, number>> = {
    [primaryHouseKey]: primaryDelta,
  };
  if (!rival.unalignable && primary.rivalHouseKey !== primaryHouseKey) {
    out[primary.rivalHouseKey] = -Math.round(
      primaryDelta * primary.rivalryIntensity,
    );
  }
  return out;
}

/**
 * Validate the registry — every house's rival must exist, must point
 * back (or be reflexive for unalignable singletons), and must share
 * factionId. Used by unit tests + load-time invariants.
 */
export function validateSubHouseRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  for (const house of Object.values(SUB_HOUSE_REGISTRY)) {
    const rival = SUB_HOUSE_REGISTRY[house.rivalHouseKey];
    if (!rival) {
      errors.push(`${house.houseKey}: rival ${house.rivalHouseKey} not registered`);
      continue;
    }
    if (rival.factionId !== house.factionId) {
      errors.push(
        `${house.houseKey}: rival ${house.rivalHouseKey} is in different faction (${rival.factionId} vs ${house.factionId})`,
      );
    }
    // Reflexive (unalignable singleton) is allowed; otherwise rivalry
    // must be mutual.
    if (house.rivalHouseKey !== house.houseKey) {
      if (rival.rivalHouseKey !== house.houseKey) {
        errors.push(
          `${house.houseKey}: rivalry not mutual (${rival.houseKey}.rival = ${rival.rivalHouseKey})`,
        );
      }
    }
    if (house.rivalryIntensity < 0 || house.rivalryIntensity > 1) {
      errors.push(
        `${house.houseKey}: rivalryIntensity ${house.rivalryIntensity} out of [0,1]`,
      );
    }
  }
  return errors;
}
