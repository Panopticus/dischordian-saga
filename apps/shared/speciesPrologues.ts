/* ═══════════════════════════════════════════════════════
   SPECIES PROLOGUES — DA:O-style origin openings

   Plan §B3. Today the Awakening Protocol is one linear 5-
   phase outbreak shared by every creation signature. This
   module is the data layer for "each species gets a 20-
   minute origin-specific opening before the shared Act 1
   begins."

   Engine wiring (the awakeningProtocol consumes this
   registry to insert species-specific beats before the
   shared phase 1) is a follow-up. This PR ships the
   structure + 1 anchor scene per species (DeMagi /
   Quarchon / Ne-Yon) as the proof of pattern. The full
   prologue (4–6 beats × 3 species) is writing-room scope.
   ═══════════════════════════════════════════════════════ */

export type Species = "demagi" | "quarchon" | "neyon";

export interface PrologueScene {
  id: string;
  species: Species;
  /** 1-indexed within the species' prologue. */
  index: number;
  title: string;
  /** Memoir-voice opening narration. The shared Engineer
   *  voice from Act 1 doesn't apply here — each species has
   *  its own narrator (DeMagi: a primal voice; Quarchon: an
   *  array's serial-number narrator; Ne-Yon: both at once). */
  narration: string;
  /** Hooks the awakening flow uses to render the moment.
   *  beat = the dramatic shape; locationTag = which background
   *  to render. Both consumed by the existing awakening
   *  components when wiring lands. */
  beat: "wake" | "first_glance" | "first_voice" | "first_act" | "transition";
  locationTag: string;
  /** Flag set on completion — feeds into Act 1's intro
   *  variant once the shared spine begins. */
  completionFlag: string;
}

export const SPECIES_PROLOGUES: ReadonlyArray<PrologueScene> = [
  {
    id: "prologue_demagi_wake",
    species: "demagi",
    index: 1,
    title: "The Body Remembers",
    narration:
      "I came back to my body before I came back to my mind. The body remembered the sequence: breath, breath, name. The name took longer than the breath did.",
    beat: "wake",
    locationTag: "demagi_birth_chamber",
    completionFlag: "prologue_demagi_complete",
  },
  {
    id: "prologue_quarchon_wake",
    species: "quarchon",
    index: 1,
    title: "The Serial Number Speaks",
    narration:
      "I do not remember being initialised. I remember being told I had been initialised. The difference is in the timestamp; it is also in everything else.",
    beat: "wake",
    locationTag: "quarchon_array_node",
    completionFlag: "prologue_quarchon_complete",
  },
  {
    id: "prologue_neyon_wake",
    species: "neyon",
    index: 1,
    title: "Both Awake",
    narration:
      "We came back together. The carbon side and the silicon side. The carbon side took the first breath. The silicon side took the second. We did not negotiate which of us would speak first.",
    beat: "wake",
    locationTag: "neyon_hybrid_pod",
    completionFlag: "prologue_neyon_complete",
  },
];

/* ─── Helpers ─── */

export function getPrologueForSpecies(species: Species): PrologueScene[] {
  return SPECIES_PROLOGUES.filter((s) => s.species === species).sort(
    (a, b) => a.index - b.index,
  );
}

export function getPrologueScene(id: string): PrologueScene | undefined {
  return SPECIES_PROLOGUES.find((s) => s.id === id);
}

/** True iff every scene in the species' prologue has its
 *  completion flag set. Lets the awakening engine know it can
 *  hand off to the shared Act 1 spine. */
export function isPrologueComplete(
  species: Species,
  flags: Readonly<Record<string, boolean | undefined>>,
): boolean {
  const scenes = getPrologueForSpecies(species);
  if (scenes.length === 0) return true; // species without an authored prologue: always "complete"
  return scenes.every((s) => !!flags[s.completionFlag]);
}
