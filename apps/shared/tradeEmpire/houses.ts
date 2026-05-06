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

  // Hierarchy — Severance Division (Nilmorg) vs. Acquisitions
  // (Drael'Mon) vs. Syndicate of Death (death-cult arm). Severance
  // does the clean ritual close; Acquisitions does the hostile-
  // takeover violence; the Syndicate of Death operates the death
  // cult that preys on the same flock the Wraith Hierophant's
  // revival now claims to protect.
  | "hierarchy_severance"
  | "hierarchy_acquisitions"
  | "hierarchy_syndicate_of_death"
  | "hierarchy_research_and_development"

  // Antiquarian — the Shelf-mates (Daniel Cross / the Antiquarian's
  // bibliographic order) vs. the Casino-faction (Degen, aleatory
  // information markets). Cross-References Desk is Daniel Cross's
  // working wing — internally cohesive, low rivalry intensity.
  | "antiquarian_shelfmates"
  | "antiquarian_casino"
  | "antiquarian_cross_references_desk"

  // Thaloria — Council of Harmony (formal diplomats) vs. Quietwork
  // (Hierophant's ceremonial wing that handles things off the books).
  // Thaloria — sovereign world; home of the resurrected Thalorian
  // religion led by the Wraith Hierophant (Wraith Calder). The
  // Council is the spiritual seat; Quietwork is the off-the-books
  // wing. The revival itself is canonically an insurgent movement
  // weaponised against the New Babylon Authority and the
  // Hierarchy's Syndicate of Death — see externalRivals.
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
  /**
   * Phase A: cross-faction blood feuds. Rivalry deltas anti-correlate
   * with these sub-houses too (at a smaller intensity than the
   * primary `rivalHouseKey`, see CROSS_FACTION_RIVALRY_INTENSITY).
   * Used to encode bible-canonical cross-faction enmities — most
   * notably the Wraith Hierophant's revival being weaponised against
   * the New Babylon Authority and the Hierarchy's Syndicate of Death.
   */
  externalRivals?: ReadonlyArray<SubHouseKey>;
}

/**
 * How strongly external rivals anti-correlate with a primary delta.
 * Lower than the intra-faction rivalryIntensity so cross-faction
 * blood feuds are real but don't dominate the math.
 */
export const CROSS_FACTION_RIVALRY_INTENSITY = 0.3;

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
    // Cross-faction: the Wraith Hierophant's Thalorian revival
    // (canon per user) is an insurgent movement weaponised
    // *against* the Authority. Helping the Hierophant publicly
    // costs Authority rep.
    externalRivals: ["thaloria_council"],
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
    primaryNpcKey: "drael_mon",
    primarySectorId: "the_trench",
    blurb:
      "Drael'Mon, the Harvester. Hostile takeovers, blood-weave enforcement, and the wet end of the demonic corporation. Files your name under leverage.",
    rivalryIntensity: 0.6,
  },
  // Phase A: canonical Hierarchy death cult. Pre-existing in lore
  // (the Wraith Hierophant's revival exists *because* the Syndicate
  // is preying on the same flock the religion claims to protect).
  hierarchy_syndicate_of_death: {
    houseKey: "hierarchy_syndicate_of_death",
    name: "Syndicate of Death",
    factionId: "hierarchy",
    rivalHouseKey: "hierarchy_severance",
    primarySectorId: "the_trench",
    blurb:
      "The Hierarchy's death-cult arm. Sacrificial ceremonies inverted from Thalorian liturgy. The Wraith Hierophant's revival is canonically targeted against this wing.",
    rivalryIntensity: 0.4,
    externalRivals: ["thaloria_council"],
  },
  // Phase A.5: canonical SVP R&D — Hierarchy bibliographic /
  // institutional sub-house. Lower priority but completes the
  // demonic-corporate org chart.
  hierarchy_research_and_development: {
    houseKey: "hierarchy_research_and_development",
    name: "R&D Division",
    factionId: "hierarchy",
    rivalHouseKey: "hierarchy_severance",
    primarySectorId: "the_trench",
    blurb:
      "The Hierarchy's research arm. Demonic instrument design, ritual prototypes, and the slow industrial automation of damnation.",
    rivalryIntensity: 0.3,
  },

  // Antiquarian ----------------------------------------------------------
  antiquarian_shelfmates: {
    houseKey: "antiquarian_shelfmates",
    name: "Shelf-mates",
    factionId: "antiquarian",
    rivalHouseKey: "antiquarian_casino",
    // Phase A correction: the_seer is Insurgency-adjacent (Sixth
    // Sense). The Antiquarian is canonically Daniel Cross.
    primaryNpcKey: "the_antiquarian",
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
  // Phase A.5: Daniel Cross's working wing — internal-cohesive
  // research operation. Pairs with Shelf-mates and Casino at low
  // rivalry intensity; the Antiquarian's pocket is internally calm.
  antiquarian_cross_references_desk: {
    houseKey: "antiquarian_cross_references_desk",
    name: "Cross-References Desk",
    factionId: "antiquarian",
    rivalHouseKey: "antiquarian_casino",
    primaryNpcKey: "the_antiquarian",
    primarySectorId: "antiquarian_archive",
    blurb:
      "Daniel Cross's working wing. Where citations are compiled, attributions are reconstructed, and timelines are walked backward.",
    rivalryIntensity: 0.2,
  },

  // Thaloria -------------------------------------------------------------
  // Phase A re-frame per user lore correction: Wraith Calder IS the
  // new Hierophant. The Thalorian religion is itself a *resurrected*,
  // *insurgent* movement led by him — a Potential who took up the
  // Hierophant mantle millennia after the original died in the Fall.
  // The revival is canonically weaponised against:
  //   - the New Babylon Authority (externalRival)
  //   - the Hierarchy's Syndicate of Death (externalRival)
  // Council = Wraith Hierophant's spiritual seat (the *public* face of
  // the revolt). Quietwork = the off-the-books wing (faceless on
  // purpose; the Hierophant himself does not run it).
  thaloria_council: {
    houseKey: "thaloria_council",
    name: "Council of the Wraith Hierophant",
    factionId: "thaloria",
    rivalHouseKey: "thaloria_quietwork",
    primaryNpcKey: "wraith_calder",
    primarySectorId: "thaloria",
    blurb:
      "Wraith Calder, the Wraith Hierophant. The resurrected Thalorian religion he leads is canonically an insurgent revival weaponised against the New Babylon Authority and the Hierarchy's Syndicate of Death.",
    rivalryIntensity: 0.3,
    externalRivals: ["nb_authoritys_ledger", "hierarchy_syndicate_of_death"],
  },
  thaloria_quietwork: {
    houseKey: "thaloria_quietwork",
    name: "Quietwork",
    factionId: "thaloria",
    rivalHouseKey: "thaloria_council",
    // Phase A: bible-canonically faceless. The Hierophant leads the
    // Council; the Quietwork is intentionally off-the-books and has
    // no single owning NPC.
    primarySectorId: "thaloria",
    blurb:
      "The off-the-books wing of the Thalorian revival. Quiet on the surface, coordinated underneath. No single face.",
    rivalryIntensity: 0.3,
    externalRivals: ["hierarchy_syndicate_of_death"],
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
  // Phase A: cross-faction blood feuds. Apply a smaller anti-
  // correlation against each external rival. Skips unalignable
  // rivals and never overrides a rival already in `out` (so the
  // intra-faction rival's delta wins ties).
  for (const externalKey of primary.externalRivals ?? []) {
    if (externalKey === primaryHouseKey) continue;
    if (out[externalKey] !== undefined) continue;
    const ext = SUB_HOUSE_REGISTRY[externalKey];
    if (!ext || ext.unalignable) continue;
    out[externalKey] = -Math.round(
      primaryDelta * CROSS_FACTION_RIVALRY_INTENSITY,
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
  // Per-faction sub-house counts so the mutuality rule only applies
  // to 2-house factions (3+ houses naturally form a graph, not a pair).
  const factionSizes = new Map<string, number>();
  for (const house of Object.values(SUB_HOUSE_REGISTRY)) {
    factionSizes.set(
      house.factionId,
      (factionSizes.get(house.factionId) ?? 0) + 1,
    );
  }

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
    // Mutuality applies only to 2-house factions. With 3+ sub-houses,
    // each picks a *primary* rival but the rivalry graph is not pair-
    // wise (e.g., Hierarchy has Severance/Acquisitions/SoD/R&D — all
    // four can't pair up mutually).
    const factionSize = factionSizes.get(house.factionId) ?? 0;
    if (
      factionSize <= 2 &&
      house.rivalHouseKey !== house.houseKey &&
      rival.rivalHouseKey !== house.houseKey
    ) {
      errors.push(
        `${house.houseKey}: rivalry not mutual (${rival.houseKey}.rival = ${rival.rivalHouseKey})`,
      );
    }
    if (house.rivalryIntensity < 0 || house.rivalryIntensity > 1) {
      errors.push(
        `${house.houseKey}: rivalryIntensity ${house.rivalryIntensity} out of [0,1]`,
      );
    }
    // Phase A: validate externalRivals — each must be a real key, not
    // self, and must NOT be in the same faction (those use rivalHouseKey).
    for (const externalKey of house.externalRivals ?? []) {
      const ext = SUB_HOUSE_REGISTRY[externalKey];
      if (!ext) {
        errors.push(
          `${house.houseKey}: externalRival ${externalKey} not registered`,
        );
        continue;
      }
      if (externalKey === house.houseKey) {
        errors.push(`${house.houseKey}: externalRival cannot be self`);
      }
      if (ext.factionId === house.factionId) {
        errors.push(
          `${house.houseKey}: externalRival ${externalKey} is in the same faction (use rivalHouseKey instead)`,
        );
      }
    }
  }
  return errors;
}
