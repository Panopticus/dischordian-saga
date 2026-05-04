/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY DIALOG — Vertical Slice

   Authored DialogScene cues for the keystone Mechronis episode.
   Same shape as celebrationSchoolDialog.ts. The Mechronis register
   is grading-and-surveillance — Architect-coded, formal,
   Hogwarts-procedural. Each Professor's hiddenAgenda surfaces in
   the final scene of their episode.

   Vertical slice in this file:
     • M1  Choric Compliance Drill — card combat (compliance variant)

   See plan §6 (Mechronis Academy — Episode List) and
   apps/shared/mechronisProfessors.ts for the Professor canon.
   ═══════════════════════════════════════════════════════ */

import type { DialogScene } from "./tcg-core/story/dialogBank";

/* ═══════════════════════════════════════════════════════
   M1 — CHORIC COMPLIANCE DRILL
   ─────────────────────────────────────────────────────────
   Headmaster Kanevas's Harmony Drill. Thirty students recite
   a card-combat sequence in unison. One speaks wrong; the
   class restarts. The hidden agenda surfaces in the closing
   scene: Kanevas is conditioning students to hear the
   Architect's story-engine as their own inner voice.

   POV: the cohort (the player IS one of thirty).
   System taught: Card combat, COMPLIANCE variant.
   ═══════════════════════════════════════════════════════ */

const M1_SCENE_1_THE_LECTERN: DialogScene = {
  id: "mechronis_m1_scene_1_the_lectern",
  label: "M1 · Scene 1 — The Lectern",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Lecture Hall RES-101. Thirty students in identical robes. The walls " +
        "are pale grey; the windows are tall and narrow; the light is the " +
        "kind that does not flatter anyone. At the front, behind a lectern " +
        "of dark wood, Headmaster Kanevas waits. He has been waiting since " +
        "before the first student arrived. His eyes are like empty lecterns. " +
        "His silver hair is brushed to a precision that suggests it does not, " +
        "in fact, grow.",
    },
    {
      speaker: "the_architect", // Kanevas — using the_architect mood channel; in production, register "kanevas"
      mood: "guarded",
      text: "Welcome, cohort. RES-101: Choric Compliance and Unison Logic. The first lecture. The lecture you will all remember the same way, by design.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "Open your decks. Place them on the desk in front of you, face up. Do not shuffle. Do not draw. Do not breathe heavily — the network will hear it.",
    },
  ],
};

const M1_SCENE_2_THE_DRILL: DialogScene = {
  id: "mechronis_m1_scene_2_the_drill",
  label: "M1 · Scene 2 — The Harmony Drill",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "The cohort will recite the opening sequence in unison. The sequence is: deploy, attack, end turn. Three words. Four breaths between each, by the metronome to your left. Do you hear the metronome?",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "A tone, soft and steady, like the heartbeat of a building that does not " +
        "have a heart. The cohort listens. Twenty-nine students nod. One does not.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "Begin. On the metronome's third beat: deploy.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "DEPLOY. Twenty-nine voices. The thirtieth — the new student, the one " +
        "the others do not yet know to look at — has spoken a half-beat early. " +
        "Kanevas does not say anything. He raises a hand. The metronome stops.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "Restart. From the lectern. The fault is not the student's. The fault is the cohort's. A cohort that fails to absorb a single half-beat error is an unmade cohort.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "They restart. And restart. And restart. By the seventh restart, the " +
        "new student is reciting in perfect time with the others. Not because " +
        "they have learned a card combat sequence. Because they have learned " +
        "the metronome. Kanevas, watching, does not smile, because Kanevas does " +
        "not smile. But his eyes are slightly less empty than when he began.",
    },
  ],
};

const M1_SCENE_3_HIDDEN_AGENDA: DialogScene = {
  id: "mechronis_m1_scene_3_hidden_agenda",
  label: "M1 · Scene 3 — The Hidden Agenda Surfaces",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "Cohort. Dismissed. You will recite the opening sequence three times each, in your dormitories, before sleep. The network will know if you do not.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The students file out. The new student — the player — lingers, " +
        "uncertain. Kanevas does not look up from his lectern. He speaks anyway.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "You wonder why I drilled it that way. I will tell you. The drill is not about the cards.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "You will leave this hall in seventeen minutes. By then, your inner voice — the voice you use when you tell yourself what to do next — will be reciting in time with the metronome you heard today. It will not stop reciting. It will not, in fact, ever stop.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "This is the network being student. This is the student being network. There is no individual learning here, because there is no individual. This is RES-101. It is also every other class you will take, until you graduate or you do not.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Dreamer hums, briefly, audible only to the player. A half-frequency " +
        "lullaby beneath the metronome. The metronome continues. So does the " +
        "lullaby. The player notices, for the first time, that they are listening " +
        "to two rhythms at once.",
    },
    {
      speaker: "the_architect",
      mood: "guarded",
      text: "If you cannot hear the network, you cannot graduate. If you can hear something else underneath it, that is a problem. You may go.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Kanevas's hidden agenda — per mechronisProfessors.ts — was always: " +
        "condition student minds to hear the Architect's story-engine as their " +
        "own inner voice. The drill achieved it in seventeen minutes. The " +
        "lullaby underneath is what stops it from working completely.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   REGISTRY
   ═══════════════════════════════════════════════════════ */

export const MECHRONIS_ACADEMY_SCENES: readonly DialogScene[] = Object.freeze([
  M1_SCENE_1_THE_LECTERN,
  M1_SCENE_2_THE_DRILL,
  M1_SCENE_3_HIDDEN_AGENDA,
]);

export const MECHRONIS_EPISODE_SCENE_MAP: Readonly<Record<string, readonly string[]>> = Object.freeze({
  mechronis_m1_choric_compliance: [
    "mechronis_m1_scene_1_the_lectern",
    "mechronis_m1_scene_2_the_drill",
    "mechronis_m1_scene_3_hidden_agenda",
  ],
});

export function getMechronisScenesForEpisode(episodeId: string): readonly DialogScene[] {
  const sceneIds = MECHRONIS_EPISODE_SCENE_MAP[episodeId];
  if (!sceneIds) return [];
  return sceneIds
    .map((id) => MECHRONIS_ACADEMY_SCENES.find((s) => s.id === id))
    .filter((s): s is DialogScene => s !== undefined);
}
