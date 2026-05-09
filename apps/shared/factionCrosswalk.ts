/* ═══════════════════════════════════════════════════════
   FACTION CROSSWALK

   The saga has three faction registries, each scoped to its own
   subsystem and using its own naming convention:

     - Standing          (apps/shared/factions.ts)              — 5
     - Card engine       (apps/shared/tcg-core/cards/schema.ts) — 9
     - Trade Empire      (apps/client/src/game/tradeEmpire.ts)  — 10

   None of the three agree on names or count. Some entities exist
   in only one or two of the three; some have different ids in each
   registry that they appear in.

   This module is the single typed crosswalk between them. Every
   member of every registry maps to a CanonicalFactionId, or to
   null when the registry's value is a sentinel rather than a
   political body (the card engine's "neutral" sentinel is the
   only such case today).

   The crosswalk is consulted by:

     - faction-objective stage cascades (#11 in the NPC depth plan):
       a Trade-Empire-scope objective advancing must map to standing
       deltas via this module.
     - cross-system reactivity: a card-game victory for the
       "architect" faction must surface in standing for
       "architect_remnants" and Trade Empire reputation for
       "artificial_empire" coherently.
     - ship-check parity: every member of every registry must have
       a row here, even if mapping to null.
   ═══════════════════════════════════════════════════════ */

import type { GalacticFactionId } from "@/game/tradeEmpire";
import type { Faction as CardFaction } from "./tcg-core/types/Card";
import type { FactionId as StandingFactionId } from "./factions";

/**
 * The canonical political-body identifier. One per *political body* the
 * saga recognises. Subsystems may name it differently — the canonical
 * id is the bridge.
 *
 * Naming: noun-form, snake_case, no qualifiers ("_order", "_circle")
 * unless required to disambiguate from a generic word.
 */
export type CanonicalFactionId =
  | "architect_order"
  | "dreamer_order"
  | "new_babylon"
  | "hierarchy_of_damned"
  | "insurgency"
  | "antiquarian_circle"
  | "thought_virus"
  | "panopticon"
  | "thaloria"
  | "potentials"
  | "independent_civilizations";

export interface CrosswalkEntry {
  id: CanonicalFactionId;
  /** Human-readable name (for logs, debug, future UI). */
  name: string;
  /** One-sentence description anchored on the canonical reading. */
  description: string;
  /**
   * Standing-registry id, if this entity has per-player standing
   * tracked. Null for entities that exist only in card / Trade Empire
   * scopes (Antiquarian Circle, Thought Virus, Panopticon, Thaloria,
   * Potentials, Independent Civilizations) — those are scoped out of
   * the bipolar standing system by design, not omission.
   */
  standing: StandingFactionId | null;
  /**
   * Card-engine faction id, if this entity has cards. Null for
   * entities that exist only in standing / Trade Empire scopes
   * (Thaloria, Potentials, Independent Civilizations).
   */
  card: CardFaction | null;
  /**
   * Trade Empire faction id, if this entity has a Trade Empire
   * presence. Null only for entities that exist only in card scope —
   * panopticon is the one case (it folds into ae_architects_court at
   * the sub-house level via apps/shared/tradeEmpire/itemTags.ts).
   */
  tradeEmpire: GalacticFactionId | null;
}

/**
 * The crosswalk. Every CanonicalFactionId has exactly one entry; every
 * member of every registry appears in exactly one entry's mapping (or
 * is a sentinel — see CARD_NEUTRAL_IS_SENTINEL below).
 */
export const CROSSWALK: Readonly<Record<CanonicalFactionId, CrosswalkEntry>> = {
  architect_order: {
    id: "architect_order",
    name: "The Architect's Order",
    description:
      "The Architect's loyalists across registries. Standing tracks the post-Fall remnants; cards track the pre-Fall imperial order; Trade Empire tracks the active rebuilding effort.",
    standing: "architect_remnants",
    card: "architect",
    tradeEmpire: "artificial_empire",
  },
  dreamer_order: {
    id: "dreamer_order",
    name: "The Dreamer's Order",
    description:
      "The Dreamer's followers and shielded sectors. Standing tracks the children-of-the-Dreamer cohort; cards track the prophecy faction; Trade Empire tracks the shielded Potentials sector.",
    standing: "dreamers_children",
    card: "dreamer",
    tradeEmpire: "dreamer_shield",
  },
  new_babylon: {
    id: "new_babylon",
    name: "New Babylon",
    description:
      "The Adjudicator's bureaucracy. The only registry that uses the same id across all three subsystems.",
    standing: "new_babylon",
    card: "new_babylon",
    tradeEmpire: "new_babylon",
  },
  hierarchy_of_damned: {
    id: "hierarchy_of_damned",
    name: "The Hierarchy of the Damned",
    description:
      "Zyr'Koth's order of demon-lords. Standing and Trade Empire abbreviate to 'hierarchy'; cards spell out 'hierarchy_of_damned'.",
    standing: "hierarchy",
    card: "hierarchy_of_damned",
    tradeEmpire: "hierarchy",
  },
  insurgency: {
    id: "insurgency",
    name: "The Insurgency",
    description:
      "Agent Zero's network — overt operations through the Old Network sub-house, infrastructural revival through Thaloria's Quietwork. Same id across all three registries.",
    standing: "insurgency",
    card: "insurgency",
    tradeEmpire: "insurgency",
  },
  antiquarian_circle: {
    id: "antiquarian_circle",
    name: "The Antiquarian Circle",
    description:
      "The hidden bibliographic order. Has cards and Trade Empire presence; not tracked at the standing-registry tier (standing is reserved for the five top-line ideological bodies).",
    standing: null,
    card: "antiquarian",
    tradeEmpire: "antiquarian",
  },
  thought_virus: {
    id: "thought_virus",
    name: "The Thought Virus",
    description:
      "The spreading mind-corruption from Terminus. Has cards and Trade Empire presence; not standing-tracked because it is treated as an ambient hazard rather than a faction the player champions or opposes.",
    standing: null,
    card: "thought_virus",
    tradeEmpire: "thought_virus",
  },
  panopticon: {
    id: "panopticon",
    name: "The Panopticon",
    description:
      "The all-seeing-eye faction. Cards-only as a top-level political body; folds into the Architect's court at the Trade Empire sub-house tier (apps/shared/tradeEmpire/itemTags.ts).",
    standing: null,
    card: "panopticon",
    tradeEmpire: null,
  },
  thaloria: {
    id: "thaloria",
    name: "Thaloria",
    description:
      "The sovereign world hosting the resurrected Tamarin religious revival, led by the Wraith Hierophant (Wraith Calder). Trade-Empire-only as a top-level body; cards subsume Thalorian narrative material under Insurgency or Neutral cards.",
    standing: null,
    card: null,
    tradeEmpire: "thaloria",
  },
  potentials: {
    id: "potentials",
    name: "The Potentials",
    description:
      "The player's own faction — Ark 1047 and the cohort whose biology the Seven Protocol triad has been writing on. Trade-Empire-only as an explicit top-level body; standing treats Potential alignment as implicit (the player is always a Potential), and cards do not declare a Potentials faction.",
    standing: null,
    card: null,
    tradeEmpire: "potentials",
  },
  independent_civilizations: {
    id: "independent_civilizations",
    name: "Independent Civilizations",
    description:
      "New civilisations that evolved in the ruins. Trade-Empire-only top-level body; cards' 'neutral' is a sentinel for cards-without-faction and is not equivalent to this canonical entity.",
    standing: null,
    card: null,
    tradeEmpire: "independent",
  },
};

/**
 * The card engine has one sentinel value — `neutral` — that means
 * "this card has no political faction" rather than naming a political
 * body. It does not map to any CanonicalFactionId. fromCard("neutral")
 * returns null by design.
 */
export const CARD_NEUTRAL_IS_SENTINEL = "neutral" as const satisfies CardFaction;

export const CANONICAL_FACTION_IDS: readonly CanonicalFactionId[] =
  Object.keys(CROSSWALK) as CanonicalFactionId[];

/* ─── Lookups ─── */

/** Resolve a standing FactionId to its crosswalk entry. */
export function fromStanding(id: StandingFactionId): CrosswalkEntry {
  for (const entry of Object.values(CROSSWALK)) {
    if (entry.standing === id) return entry;
  }
  // Standing registry is closed and every member is in the crosswalk
  // above. Reaching this throw means the standing registry has gained
  // a member without an accompanying crosswalk update — that's a
  // ship-check failure waiting to happen.
  throw new Error(
    `[factionCrosswalk] Standing FactionId "${id}" has no crosswalk entry. Add it to CROSSWALK.`,
  );
}

/**
 * Resolve a card-engine Faction to its crosswalk entry, or null if
 * the value is the `neutral` sentinel.
 */
export function fromCard(faction: CardFaction): CrosswalkEntry | null {
  if (faction === CARD_NEUTRAL_IS_SENTINEL) return null;
  for (const entry of Object.values(CROSSWALK)) {
    if (entry.card === faction) return entry;
  }
  throw new Error(
    `[factionCrosswalk] Card Faction "${faction}" has no crosswalk entry. Add it to CROSSWALK.`,
  );
}

/** Resolve a Trade Empire GalacticFactionId to its crosswalk entry. */
export function fromTradeEmpire(id: GalacticFactionId): CrosswalkEntry {
  for (const entry of Object.values(CROSSWALK)) {
    if (entry.tradeEmpire === id) return entry;
  }
  throw new Error(
    `[factionCrosswalk] Trade Empire GalacticFactionId "${id}" has no crosswalk entry. Add it to CROSSWALK.`,
  );
}

/** Direct lookup by canonical id. */
export function getCanonical(id: CanonicalFactionId): CrosswalkEntry {
  return CROSSWALK[id];
}
