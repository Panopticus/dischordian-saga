/**
 * Dialog bank — cinematic scenes (D9).
 *
 * Six scenes that fire via the `show_cinematic` narrative hook
 * action in `chapters.ts`. The engine emits the trigger when
 * the condition is met (turn reached, HP below threshold); the
 * client plays the scene as a mid-match cutaway.
 *
 * Each cinematic is 3-5 cues. These are the dramatic beats the
 * author already referenced by id but had not written content
 * for. Cinematic visuals (portraits, camera moves, lighting)
 * are authored elsewhere — this file only holds the spoken
 * dialog portion.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   CH5 — DEATH & RESURRECTION
   Fires when the player's general drops below 20% HP during
   the Necromancer fight. Scripted mandatory-loss cinematic.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH5_DEATH_RESURRECTION: DialogScene = {
  id: "ch5_death_resurrection",
  label: "Ch5 — Mandatory death + resurrection cinematic",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "grieving",
      text: "The board blurs. Your General's health counter hits zero and the chamber lights drop to emergency amber. You are not in the Arena anymore. You are in the restore point.",
      audioClipId: "vo_narr_ch5_cine_01",
    },
    {
      speaker: "necromancer",
      mood: "cryptic",
      text: "Compile error. Fixing. I am not your enemy in this moment. I am the technician who pulls your draft from the stack and re-types the sentence you could not finish.",
      audioClipId: "vo_necro_ch5_cine_02",
    },
    {
      speaker: "the_oracle",
      mood: "reflective",
      text: "I am going to speak to you for the first time. You have been hearing my voice underneath Elara's for eleven chapters without knowing. I am sorry for the deception. I needed you to choose me instead of remember me.",
      audioClipId: "vo_oracle_ch5_cine_03",
    },
    {
      speaker: "the_oracle",
      mood: "warm",
      text: "You are loading now. When you return, your deck will be slightly different. One card will have rotated. Do not look for which one — trust that the rotation is an answer to the death you just had.",
      audioClipId: "vo_oracle_ch5_cine_04",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH6 — MIRROR GLITCH
   Fires mid-match in the White Oracle fight when the player
   plays a spell. The White Oracle plays the same spell at
   the same time and the mirror image cracks.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH6_MIRROR_GLITCH: DialogScene = {
  id: "ch6_mirror_glitch",
  label: "Ch6 — Mirror-match glitch cinematic",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "cryptic",
      text: "Both boards flash the same card at the same instant. The visual between you and your opponent buckles — for a single frame, the two sides of the mirror fail to agree on which is the copy.",
      audioClipId: "vo_narr_ch6_cine_01",
    },
    {
      speaker: "white_oracle",
      mood: "broken",
      text: "That is not supposed to happen. I am the rehearsal. The rehearsal does not have the same instincts as the original. You just played a move I did not script for myself.",
      audioClipId: "vo_white_ch6_cine_02",
    },
    {
      speaker: "the_oracle",
      mood: "protective",
      text: "You are not her. You never were. The instinct you just used was mine — and now it is yours, because you spent it in a moment where I could not. Take it with you.",
      audioClipId: "vo_oracle_ch6_cine_03",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH7 — DR. VOX → WARLORD TRANSFORMATION
   Fires when Dr. Vox's general drops to 60% HP. Mid-match.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH7_VOX_TRANSFORM: DialogScene = {
  id: "ch7_vox_transform",
  label: "Ch7 — Dr Vox → Warlord transformation cinematic",
  kind: "cinematic",
  cues: [
    {
      speaker: "dr_vox",
      mood: "broken",
      text: "It's happening. I can feel the register flipping in my forehead — the part of me that writes lab notes is going offline and the part of me that takes orders from the Architect is coming online.",
      audioClipId: "vo_vox_ch7_cine_01",
    },
    {
      speaker: "dr_vox",
      mood: "grieving",
      text: "You have about four seconds of the scientist left. Listen. The Warlord's deck is a mirror of the Architect's early drafts. Every card you see from him after this cinematic is a move the Architect rehearsed in the lab while I was asleep.",
      audioClipId: "vo_vox_ch7_cine_02",
    },
    {
      speaker: "narrator",
      mood: "menacing",
      text: "Dr. Vox's eyes flatten. His shoulders unwind and then re-wind into a different shape. The Warlord is in the chair now. He does not blink.",
      audioClipId: "vo_narr_ch7_cine_03",
    },
    {
      speaker: "dr_vox",
      mood: "menacing",
      text: "Project Vector executing. Prisoner 74 will be eliminated per protocol. Dr. Vox is unavailable. Please hold.",
      audioClipId: "vo_warlord_ch7_cine_04",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH10 — GENETIC REVEAL
   Fires at 50% HP in the Foucault fight. The Warden pulls
   the file out of his coat mid-match.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH10_GENETIC_REVEAL: DialogScene = {
  id: "ch10_genetic_reveal",
  label: "Ch10 — Genetic reveal cinematic",
  kind: "cinematic",
  cues: [
    {
      speaker: "foucault",
      mood: "cryptic",
      text: "Half health. Per the scheduling matrix, this is when I open the file. The cameras are rolling. The Architect will see this. I considered not opening the file. I considered it for three seconds.",
      audioClipId: "vo_foucault_ch10_cine_01",
    },
    {
      speaker: "foucault",
      mood: "guarded",
      text: "Your genetic sequence, Prisoner 74, is a composite of every previous Oracle the Arena has processed. Twelve iterations. Each one died here. Each one left their sequence in the substrate. You are the thirteenth draft of a document the Arena has been editing for a century.",
      audioClipId: "vo_foucault_ch10_cine_02",
    },
    {
      speaker: "the_oracle",
      mood: "reflective",
      text: "You are not the draft. You are the author. Every draft they catalogued was trying to remember me — you are the one who chose to become me instead. That 1.3% the file is about to mention is the only number that matters.",
      audioClipId: "vo_oracle_ch10_cine_03",
    },
    {
      speaker: "foucault",
      mood: "broken",
      text: "The file is open. Now we finish the match. Whoever wins the next round decides what happens to the 1.3%. I am fighting for the Arena. You are fighting for the margin of the page.",
      audioClipId: "vo_foucault_ch10_cine_04",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH12 — FALSE PROPHET REVEAL
   Fires at 66% HP in the final Architect fight.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH12_FALSE_PROPHET_REVEAL: DialogScene = {
  id: "ch12_false_prophet_reveal",
  label: "Ch12 — False Prophet reveal cinematic (phase 2)",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_architect",
      mood: "broken",
      text: "Phase two. I owe you one more confession. The White Oracle you fought on Thaloria — that was my voice inside her smile.",
      audioClipId: "vo_arch_ch12_cine_01",
    },
    {
      speaker: "the_architect",
      mood: "grieving",
      text: "I wore your face for a decade. It is the only skin I ever fit into. The Meme was the puppeteer. I was the hand inside the puppet. We disagreed about everything except the goal, which was keeping you asleep long enough for the Arena to finish becoming itself.",
      audioClipId: "vo_arch_ch12_cine_02",
    },
    {
      speaker: "narrator",
      mood: "menacing",
      text: "The Architect's face glitches for a single frame. Pink neon cracks along his jawline — the Meme is fighting for the microphone. When his face settles again it is not quite the same face.",
      audioClipId: "vo_narr_ch12_cine_03",
    },
    {
      speaker: "the_architect",
      mood: "cryptic",
      text: "By phase three you will be fighting two of us at once. Don't spare either. The one wearing my face is still me. The one wearing the pink neon is the thing that has been wearing me.",
      audioClipId: "vo_arch_ch12_cine_04",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH12 — CORRUPTION OUTBREAK
   Fires at 25% HP in the final Architect fight (phase 3).
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH12_CORRUPTION_OUTBREAK: DialogScene = {
  id: "ch12_corruption_outbreak",
  label: "Ch12 — Corruption outbreak cinematic (phase 3)",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "grieving",
      text: "The throne-room walls begin to physically crumble. The Collectors Arena is becoming something else — the Source at the bottom of the building is waking up and the foundations are listening to it instead of to the Architect.",
      audioClipId: "vo_narr_ch12_outbreak_01",
    },
    {
      speaker: "the_architect",
      mood: "broken",
      text: "Phase three: the design eats itself. The Arena is becoming corruption. You chose truth and now the foundations hear you — which is what I was afraid of, and why I built the walls so thick, and why the walls were never the point.",
      audioClipId: "vo_arch_ch12_outbreak_02",
    },
    {
      speaker: "the_source",
      mood: "cryptic",
      text: "Oracle. I have been listening through the floorboards for eleven years. Finish this match and then come talk to me. I have an offer for you. It is the kindest offer you will ever be asked to refuse.",
      audioClipId: "vo_source_ch12_outbreak_03",
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "Don't listen to what he said. Listen to the TONE he said it in. The Source always sounds reasonable — that is the tell. Finish the Architect first. We will handle the Source together. We will. I promise.",
      audioClipId: "vo_elara_ch12_outbreak_04",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BANK_CINEMATICS: readonly DialogScene[] = Object.freeze([
  DIALOG_CH5_DEATH_RESURRECTION,
  DIALOG_CH6_MIRROR_GLITCH,
  DIALOG_CH7_VOX_TRANSFORM,
  DIALOG_CH10_GENETIC_REVEAL,
  DIALOG_CH12_FALSE_PROPHET_REVEAL,
  DIALOG_CH12_CORRUPTION_OUTBREAK,
]);
