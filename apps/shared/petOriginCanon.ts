/* ═══════════════════════════════════════════════════════
   PET ORIGIN CANON — PR-23

   The Pets had mechanics (petBreeding.ts, petSpeciesTraits.ts)
   but no narrative origin — the last loose thread. PR-23 binds
   them to the spine the project owner reaffirmed (Necromancer
   = halfway / Politician = endgame) without inventing new art
   or systems.

   ORIGIN — imprint-creatures.
     A pet is a consciousness-imprint on the Matrix of Dreams
     given companion form — the same ontology imprintSummoning-
     Canon already locks for cards ("every duel is a re-play of
     an archived mind"). Breeding (petBreeding.breedPets) is
     imprint-recombination: two archived patterns folded into a
     third. Species traits (petSpeciesTraits) are the stable
     shapes those imprints settle into.

   FATE — the Risen.
     Because a pet is an imprint, the First Coming claims it.
     When community resurrection-energy crosses its threshold
     (necromancerReturn.ts) pets "become 'Risen' — stronger but
     uncontrollable", and at catastrophe "all dead pets return
     as uncontrolled Risen versions". The Pets are the First
     Coming felt at the companion scale — they thread into
     theComingCanon.first_coming exactly as the Terminus Swarm
     does (vortexTerminusCanon).

   The parity gate
   (apps/shared/_completeness/checks/petOriginCoverage.ts) is
   HARD: the origin binding must resolve the Matrix-of-Dreams
   ontology (imprintSummoningCanon), the species registry must
   be non-empty (petSpeciesTraits), the breeding mechanic must
   exist (petBreeding), and the Risen fate must be wired
   (necromancerReturn pet_battles Risen impact). A Pets origin
   that does not resolve its anchors is a loose thread, not a
   canon.
   ═══════════════════════════════════════════════════════ */

export interface PetOriginBinding {
  id: string;
  title: string;
  /** The in-fiction claim. */
  premise: string;
  /** The module/anchor this binding asserts resolves. */
  anchor:
    | "imprint_ontology"
    | "species_registry"
    | "breeding_mechanic"
    | "risen_fate";
  loreSource: string;
}

export const PET_ORIGIN_PREMISE = {
  title: "On the Pets as Imprint-Creatures",
  thesis:
    "A pet is a consciousness-imprint on the Matrix of Dreams given companion form. It is bred by imprint-recombination and, being an imprint, it answers the First Coming: the Risen are the Pets the Necromancer's return reclaims.",
  spineRole:
    "The Pets are the First Coming (Necromancer = halfway) felt at companion scale — the same imprint ontology as cards, the same Risen fate the Necromancer's return reclaims.",
} as const;

export const PET_ORIGIN_BINDINGS: readonly PetOriginBinding[] = [
  {
    id: "pet_imprint_ontology",
    title: "Pets are Matrix-of-Dreams imprints",
    premise:
      "The same ontology imprintSummoningCanon locks for cards: a pet is an archived consciousness-imprint given companion form.",
    anchor: "imprint_ontology",
    loreSource: "apps/shared/imprintSummoningCanon.ts (IMPRINT_SUMMONING_PREMISE — the Matrix of Dreams)",
  },
  {
    id: "pet_species_shapes",
    title: "Species are the shapes imprints settle into",
    premise:
      "petSpeciesTraits enumerates the stable trait-shapes an imprint resolves into; they are not arbitrary stat blocks but settled patterns.",
    anchor: "species_registry",
    loreSource: "apps/shared/petSpeciesTraits.ts (PET_SPECIES_TRAITS)",
  },
  {
    id: "pet_breeding_recombination",
    title: "Breeding is imprint-recombination",
    premise:
      "petBreeding.breedPets folds two archived patterns into a third — recombination of imprints, not biology.",
    anchor: "breeding_mechanic",
    loreSource: "apps/shared/petBreeding.ts (breedPets)",
  },
  {
    id: "pet_risen_fate",
    title: "The First Coming reclaims the Pets as the Risen",
    premise:
      "Because a pet is an imprint, the Necromancer's First Coming claims it: pets become 'Risen', and at catastrophe all dead pets return uncontrolled.",
    anchor: "risen_fate",
    loreSource:
      "apps/shared/necromancerReturn.ts (pet_battles Risen impacts) + apps/shared/theComingCanon.ts (first_coming) + apps/shared/vortexTerminusCanon.ts",
  },
];

/** Look up a binding. */
export function getPetOriginBinding(
  id: string,
): PetOriginBinding | undefined {
  return PET_ORIGIN_BINDINGS.find((b) => b.id === id);
}

/** Coverage snapshot for the parity gate. */
export function getPetOriginCoverage(): {
  declared: number;
  anchors: number;
} {
  return {
    declared: PET_ORIGIN_BINDINGS.length,
    anchors: new Set(PET_ORIGIN_BINDINGS.map((b) => b.anchor)).size,
  };
}
