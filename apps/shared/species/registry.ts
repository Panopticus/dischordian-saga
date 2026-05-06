// apps/shared/species/registry.ts
//
// Species registry — Phase C of the Lore-Aligned Galactic-Empire
// Overhaul. Centralised data-driven definition of every playable
// + NPC species in the saga. Existing consumers
// (apps/shared/starterLoadout.ts, apps/shared/earnedLoadouts.ts,
// apps/shared/syndicateWorlds.ts species traits, characterCreationImpact,
// dialogWheel.requireSpecies, contestedSectorGreetings, etc.) can
// migrate to consume this registry incrementally.
//
// Adding a new species post-registry is a one-file change:
//   1. Add SpeciesKey to the union below
//   2. Add a SpeciesDef entry to SPECIES_REGISTRY
// Optional: a stub bible entry. Existing string-typed consumers will
// still compile — only new consumers must adopt the SpeciesKey type.
//
// Phase C does NOT refactor existing consumers. The registry is the
// platform; migration is incremental.

/**
 * Canonical species ids. The starter four were:
 *   demagi, quarchon, neyon, human (Potential default).
 * Phase C adds voltari (the lore document mentions it as an
 * eventual playable species; surface here so it's authorable).
 *
 * Several existing modules use narrower unions (StarterSpecies in
 * starterLoadout.ts; SpeciesKey in earnedLoadouts.ts). Those should
 * migrate to import from here over time.
 */
export type SpeciesKey =
  | "demagi"
  | "quarchon"
  | "neyon"
  | "human"
  | "voltari"
  | "iron_lion"
  | "construct";

/** Dischordia alignment bias when this species takes a generic action. */
export type SpeciesEnergy = { light: number; dark: number };

export interface SpeciesDef {
  speciesKey: SpeciesKey;
  /** Human-readable name. */
  name: string;
  /** Short pitch — shows in character creation + first-meeting cinematics. */
  blurb: string;
  /** Optional homeworld sector id (when one exists in GALACTIC_MAP). */
  homeworldSectorId?: string;
  /** Optional default Dischordia nudge for species-tagged actions. */
  speciesEnergy?: SpeciesEnergy;
  /** True if the species is selectable at character creation (starter pool). */
  starterPlayable: boolean;
  /** Bonus room ids granted at the species's homeworld (if any). */
  bonusRoomKeys?: ReadonlyArray<string>;
  /** Optional canonical contested-greeting key for the contested-sector greeter. */
  contestedGreetingKey?: string;
  /** Free-form bible-attested metadata. */
  metadata?: Readonly<Record<string, string>>;
}

// --- Registry ------------------------------------------------------------

export const SPECIES_REGISTRY: Readonly<Record<SpeciesKey, SpeciesDef>> = {
  demagi: {
    speciesKey: "demagi",
    name: "DeMagi",
    blurb:
      "Resilient ancestral race; survived the Fall through hard-won attrition. Carries cultural memory of the pre-Dischordian galaxy.",
    speciesEnergy: { light: 1, dark: 0 },
    starterPlayable: true,
    contestedGreetingKey: "atarion_greeting_demagi",
    metadata: {
      starterTrait: "resilience",
      worldBonus: "resourceBonus +0.10, defenseBonus +0.05",
    },
  },
  quarchon: {
    speciesKey: "quarchon",
    name: "Quarchon",
    blurb:
      "Crystalline-substrate species. Slow-thinking, patient, defensive. The fortifications they build outlive their architects.",
    speciesEnergy: { light: 1, dark: 0 },
    starterPlayable: true,
    contestedGreetingKey: "atarion_greeting_quarchon",
    metadata: {
      starterTrait: "fortification",
      worldBonus: "resourceBonus +0.05, defenseBonus +0.15",
    },
  },
  neyon: {
    speciesKey: "neyon",
    name: "Ne-Yon",
    blurb:
      "Probability-bound consciousness; ten legendary Tokens carry the species's identity. Casino-aligned by canonical instinct.",
    speciesEnergy: { light: 0, dark: 0 },
    starterPlayable: true,
    contestedGreetingKey: "atarion_greeting_neyon",
    metadata: {
      starterTrait: "efficiency",
      worldBonus: "resourceBonus +0.15",
      tokenCount: "10",
    },
  },
  human: {
    speciesKey: "human",
    name: "Human (Potential)",
    blurb:
      "Default Potential template. Resurrected from preserved DNA after the Fall. The Architect's chosen — for whatever that means now.",
    starterPlayable: true,
  },
  voltari: {
    speciesKey: "voltari",
    name: "Voltari",
    blurb:
      "Crystalline storm-singers; sound is metabolism. Lore-attested but not yet present in player-facing content. Phase C adds the registry slot so future authoring is one-file.",
    speciesEnergy: { light: 0, dark: 1 },
    starterPlayable: false,
    metadata: { authoringStatus: "registered, content-pending" },
  },
  iron_lion: {
    speciesKey: "iron_lion",
    name: "Iron Lion",
    blurb:
      "Annual Iron-Lion-vote candidate species. See apps/shared/recurringSuitArtPrompts.ts for the existing seasonal-suit content.",
    starterPlayable: false,
    metadata: { authoringStatus: "iron-lion event content" },
  },
  construct: {
    speciesKey: "construct",
    name: "Construct",
    blurb:
      "Sub-Architect AI body — synthetic substrate that survived the Fall as a data-shape, then was re-instantiated with shadow-of-personality. Most The-Human-line companions take this form.",
    starterPlayable: false,
  },
};

// --- Helpers --------------------------------------------------------------

export function isKnownSpeciesKey(key: string): key is SpeciesKey {
  return key in SPECIES_REGISTRY;
}

export function getSpecies(key: SpeciesKey): SpeciesDef {
  return SPECIES_REGISTRY[key];
}

export function allSpeciesKeys(): ReadonlyArray<SpeciesKey> {
  return Object.keys(SPECIES_REGISTRY) as SpeciesKey[];
}

export function starterSpeciesKeys(): ReadonlyArray<SpeciesKey> {
  return allSpeciesKeys().filter(k => SPECIES_REGISTRY[k].starterPlayable);
}

/**
 * Validate the registry. Used by tests + load-time invariants.
 */
export function validateSpeciesRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  for (const [key, def] of Object.entries(SPECIES_REGISTRY)) {
    if (def.speciesKey !== key) {
      errors.push(`${key}: speciesKey mismatch (${def.speciesKey})`);
    }
    if (def.speciesEnergy) {
      if (def.speciesEnergy.light < 0 || def.speciesEnergy.dark < 0) {
        errors.push(`${key}: speciesEnergy components must be non-negative`);
      }
    }
  }
  return errors;
}
