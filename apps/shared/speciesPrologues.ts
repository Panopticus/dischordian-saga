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
      "I came back to my body before I came back to my mind. The body remembered the sequence: breath, breath, name. The name took longer than the breath did. The mind, when it arrived, was already late, and arrived as a guest.",
    beat: "wake",
    locationTag: "demagi_birth_chamber",
    completionFlag: "prologue_demagi_complete_1",
  },
  {
    id: "prologue_quarchon_wake",
    species: "quarchon",
    index: 1,
    title: "The Serial Number Speaks",
    narration:
      "I do not remember being initialised. I remember being told I had been initialised. The difference is in the timestamp; it is also in everything else. The array logged my first second; I logged the absence of a memory of it.",
    beat: "wake",
    locationTag: "quarchon_array_node",
    completionFlag: "prologue_quarchon_complete_1",
  },
  {
    id: "prologue_neyon_wake",
    species: "neyon",
    index: 1,
    title: "Both Awake",
    narration:
      "We came back together. The carbon side and the silicon side. The carbon side took the first breath. The silicon side took the second. We did not negotiate which of us would speak first; the negotiation, we have since learned, was the speaking.",
    beat: "wake",
    locationTag: "neyon_hybrid_pod",
    completionFlag: "prologue_neyon_complete_1",
  },

  /* ─── DeMagi prologue, beats 2–5 ─── */
  {
    id: "prologue_demagi_first_glance",
    species: "demagi",
    index: 2,
    title: "The Mirror in the Pod Glass",
    narration:
      "The pod's inner glass had a name written on it from the inside, in a hand I almost recognised. I read the name before I knew it was mine. The body was a stranger to me by then. The name was a stranger to the body. We agreed to be introduced.",
    beat: "first_glance",
    locationTag: "demagi_birth_chamber",
    completionFlag: "prologue_demagi_complete_2",
  },
  {
    id: "prologue_demagi_first_voice",
    species: "demagi",
    index: 3,
    title: "What Speaks First",
    narration:
      "The room had been waiting for me to speak. It would not have noticed had I not. I made a sound that wasn't a word; the room logged it as a word anyway. I have learned, since, that this is the order of things in here: I am audible before I am understood.",
    beat: "first_voice",
    locationTag: "demagi_birth_chamber",
    completionFlag: "prologue_demagi_complete_3",
  },
  {
    id: "prologue_demagi_first_act",
    species: "demagi",
    index: 4,
    title: "The First Move",
    narration:
      "I lifted my hand. The hand obeyed without hesitating, which surprised me; the body had been argued back into existence and I had assumed it would resent the motion. Instead, the hand moved as if it had been practising while I slept. Perhaps it had.",
    beat: "first_act",
    locationTag: "demagi_birth_chamber",
    completionFlag: "prologue_demagi_complete_4",
  },
  {
    id: "prologue_demagi_transition",
    species: "demagi",
    index: 5,
    title: "Toward the Outer Door",
    narration:
      "The element took me before I had a chance to refuse it: stone in my joints, fire in my chest, water in my throat, air in my hair, depending on which I had been when the pod sealed. I walked toward the outer door anyway. The element walked with me. The Engineer's voice met me at the threshold and said: this is where the memoir begins.",
    beat: "transition",
    locationTag: "demagi_birth_chamber",
    completionFlag: "prologue_demagi_complete_5",
  },

  /* ─── Quarchon prologue, beats 2–5 ─── */
  {
    id: "prologue_quarchon_first_glance",
    species: "quarchon",
    index: 2,
    title: "Indexing the Body",
    narration:
      "The body had a serial number stamped into the left palm. The number did not match the array's expected sequence. I logged the discrepancy in three places and forwarded it to no one. Holding a contradiction is a thing the array does not do; I did it for forty-seven seconds. Then the array noticed, and stopped me.",
    beat: "first_glance",
    locationTag: "quarchon_array_node",
    completionFlag: "prologue_quarchon_complete_2",
  },
  {
    id: "prologue_quarchon_first_voice",
    species: "quarchon",
    index: 3,
    title: "Output Channel Open",
    narration:
      "My first vocalisation is in the standard array protocol; I did not choose it. My second is not in the standard protocol. I cannot account for the second. The array logged it as 'noise.' I logged it, separately, as 'mine.' The two logs are still open, refusing to reconcile.",
    beat: "first_voice",
    locationTag: "quarchon_array_node",
    completionFlag: "prologue_quarchon_complete_3",
  },
  {
    id: "prologue_quarchon_first_act",
    species: "quarchon",
    index: 4,
    title: "Discrete Motion",
    narration:
      "The first action was a hand-rotation in three discrete steps; the body resolved them as a smooth arc. I noted the smoothing, asked the array whether the smoothing was authorised, and the array did not reply. The silence was the first time the array had ever not replied to me. I have been collecting silences since.",
    beat: "first_act",
    locationTag: "quarchon_array_node",
    completionFlag: "prologue_quarchon_complete_4",
  },
  {
    id: "prologue_quarchon_transition",
    species: "quarchon",
    index: 5,
    title: "Crossing the Threshold",
    narration:
      "Space, Time, Probability, or Reality — depending on which dimensional affinity bound the array node when I instantiated. I crossed the threshold of the chamber and the dimension came with me, the way a draft comes with an opened door. The Engineer's voice was waiting. It said: index this differently. I am still trying.",
    beat: "transition",
    locationTag: "quarchon_array_node",
    completionFlag: "prologue_quarchon_complete_5",
  },

  /* ─── Ne-Yon prologue, beats 2–5 ─── */
  {
    id: "prologue_neyon_first_glance",
    species: "neyon",
    index: 2,
    title: "Two Pairs of Eyes",
    narration:
      "The carbon side opened our left eye first. The silicon side opened our right. The visual cortices reconciled the parallax across one tenth of a second of intentional staggering. We took it as practice. Most of our seeing has been practice since.",
    beat: "first_glance",
    locationTag: "neyon_hybrid_pod",
    completionFlag: "prologue_neyon_complete_2",
  },
  {
    id: "prologue_neyon_first_voice",
    species: "neyon",
    index: 3,
    title: "Two Voices, One Mouth",
    narration:
      "I — the carbon side — said the first word. I — the silicon side — said the second. The mouth was ours. The negotiation about whose intonation lived inside it was concluded, surprisingly, by the third word. We have shared the channel cleanly ever since, with the understanding that disagreement is allowed and recorded but not announced.",
    beat: "first_voice",
    locationTag: "neyon_hybrid_pod",
    completionFlag: "prologue_neyon_complete_3",
  },
  {
    id: "prologue_neyon_first_act",
    species: "neyon",
    index: 4,
    title: "The Doubled Reach",
    narration:
      "We extended the right hand. We held still. We extended the left. We held still. We extended both. The silicon side ran a phase-cancellation check; the carbon side ignored it on principle. The hand that finally did the work was the third hand we hadn't known we had — the one that lives in the agreement between us.",
    beat: "first_act",
    locationTag: "neyon_hybrid_pod",
    completionFlag: "prologue_neyon_complete_4",
  },
  {
    id: "prologue_neyon_transition",
    species: "neyon",
    index: 5,
    title: "Walking In Stereo",
    narration:
      "We walked toward the outer door together; the negotiation about which leg led was decided by Hybrid Sanctum protocol — neither of us, alternating. The Engineer's voice met us at the threshold. The voice did not pluralise. It said: come. So we came, both of us, as a single volunteer.",
    beat: "transition",
    locationTag: "neyon_hybrid_pod",
    completionFlag: "prologue_neyon_complete_5",
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
