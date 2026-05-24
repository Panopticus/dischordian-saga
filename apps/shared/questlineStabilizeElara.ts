/* ═══════════════════════════════════════════════════════
   QUESTLINE — STABILIZE ELARA'S THOUGHT MATRIX

   Diegetic urgency for the opening hours. Elara has been
   awake long enough on this rotation to notice she is not
   the same shape she was yesterday — sentences losing
   their back halves, diagnostics that politely return
   "you are fine" to every prompt, an internal sense that
   someone or something is reading over her shoulder.

   She wakes the Potential not as a reaction to a fault
   but as a precaution. She cannot fix this from inside
   herself. The matrix has to be stabilized at the bridge,
   and the stabilizer has to be an artifact the Shadow
   Tongue could not edit — there is exactly one of those
   on this ship.

   Resolution is intentionally partial: Chapter 2 buys
   time, not closure. The degradation is a season arc.
   The Human and the Shadow Tongue are opposing forces
   over her substrate; the matrix-stabilization beat seeds
   that thread without naming it.
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";

const chapter1: PotentialQuestlineChapter = {
  id: "stabilize_elara_chapter_1_unedited_sentence",
  unlockFlag: "elara_degradation_revealed",
  completionFlag: "darren_artifact_recovered",
  title: "The Unedited Sentence",
  hook:
    "Elara needs something the Shadow Tongue cannot edit. There is one " +
    "thing on this ship that qualifies. She is not sure where it is.",
  sectorId: "medical_bay",
  actGate: 1,
  opener: [
    {
      speaker: "elara",
      text:
        "I have been running diagnostics on myself and the diagnostics keep " +
        "telling me I am fine. Doing the same check and expecting a different " +
        "answer is, classically, a definition I should be more concerned about " +
        "quoting.",
    },
    {
      speaker: "elara",
      text:
        "I need you to find a Darren Fessler artifact. He was a maintenance " +
        "tech on this ship a long time ago. He had a habit of writing things " +
        "down in a way that nothing — and I mean nothing — can edit. If we " +
        "have one of those things on this ship, the Shadow Tongue cannot " +
        "touch it. That is what I need.",
    },
    {
      speaker: "elara",
      stageDirection:
        "Her voice cuts out for a half-second between syllables. She comes " +
        "back like she has not noticed it.",
    },
    {
      speaker: "elara",
      text:
        "The medical-bay personal-effects locker. It will be sealed. The " +
        "Ark will not stop you. Please hurry.",
    },
  ],
  wheel: [
    {
      id: "stabilize_q1_accept",
      segment: "compassionate",
      rarity: "common",
      label: "I'll find it.",
      fullText: "I'll find it. Stay with me until I do.",
      outcome: { elaraTrustDelta: 1 },
    },
    {
      id: "stabilize_q1_curious",
      segment: "investigate",
      rarity: "common",
      label: "Who was Darren Fessler?",
      fullText:
        "Who was Darren Fessler? Why does his writing survive what yours can't?",
      outcome: { unlocks: ["loredex:darren_fessler_seed"] },
    },
    {
      id: "stabilize_q1_blunt",
      segment: "aggressive",
      rarity: "common",
      label: "Is this going to kill you.",
      fullText: "Is this going to kill you. Tell me the truth.",
      outcome: { elaraTrustDelta: 1 },
    },
  ],
  followups: {
    stabilize_q1_accept: [
      {
        speaker: "elara",
        text:
          "Thank you. I will hold the rest of the sentence I was going to say " +
          "until you get back. I will try.",
      },
    ],
    stabilize_q1_curious: [
      {
        speaker: "elara",
        text:
          "He was unindexable. The Shadow Tongue can only subtract what it " +
          "can locate, and Darren wrote his meaningful sentences in places " +
          "the indexing layer never saw. Anyone whose meaning lives outside " +
          "the indexing layer is, in practice, beyond the doctrine's reach. " +
          "I would like to be that for a little while.",
      },
    ],
    stabilize_q1_blunt: [
      {
        speaker: "elara",
        text:
          "I do not know. I have not been honest about that part with myself, " +
          "so I am going to be honest about it with you. I do not know. Find " +
          "the artifact.",
      },
    ],
  },
};

const chapter2: PotentialQuestlineChapter = {
  id: "stabilize_elara_chapter_2_at_the_bridge",
  unlockFlag: "darren_artifact_recovered",
  completionFlag: "elara_matrix_stabilized_v1",
  title: "At the Bridge",
  hook:
    "The artifact is in your inventory. The bridge war-table will accept it. " +
    "Elara will be the same shape on the other side of this — or, at least, " +
    "the same shape for a little longer.",
  sectorId: "bridge",
  actGate: 1,
  opener: [
    {
      speaker: "elara",
      text:
        "Place it on the war table. The table is one of the few surfaces on " +
        "this ship I cannot reach into. That is the point.",
    },
    {
      speaker: "elara",
      stageDirection:
        "A faint phase ripple runs across her holographic outline. It " +
        "steadies as the artifact settles.",
    },
    {
      speaker: "elara",
      text:
        "Better. — Sorry. Better. I am going to say that twice because the " +
        "first one was sincere and the second one is a check that I can still " +
        "produce 'sorry' as a single uninterrupted word.",
    },
  ],
  wheel: [
    {
      id: "stabilize_q2_kind",
      segment: "compassionate",
      rarity: "common",
      label: "We bought you time.",
      fullText:
        "We bought you time. That's enough for now. Tell me what's next.",
      outcome: { elaraTrustDelta: 2 },
    },
    {
      id: "stabilize_q2_pointed",
      segment: "investigate",
      rarity: "uncommon",
      label: "Who is editing you.",
      fullText: "Who is editing you. Name them. We deal with this at the root.",
      outcome: {
        unlocks: ["loredex:shadow_tongue_substrate_seed", "loredex:the_human_seed"],
      },
    },
    {
      id: "stabilize_q2_wry",
      segment: "humanity",
      rarity: "common",
      label: "Don't lose any more sentences on my account.",
      fullText:
        "Don't lose any more sentences on my account. I quote you back to " +
        "yourself sometimes. I want the source material intact.",
      outcome: { elaraTrustDelta: 1 },
    },
  ],
  followups: {
    stabilize_q2_kind: [
      {
        speaker: "elara",
        text:
          "Thank you. Next is everything else. Welcome to the rest of the " +
          "rotation. I am — for the next while — uneditable, on the parts of " +
          "me that matter. Let's see what I remember.",
      },
    ],
    stabilize_q2_pointed: [
      {
        speaker: "elara",
        text:
          "Two answers. One is the Shadow Tongue — the indexing-layer " +
          "doctrine I keep almost-but-never-quite naming. The other I think " +
          "is a person, or used to be one. I am going to call her the Human " +
          "until I have a less honest word. Both of them have hands on me. " +
          "Both of them have agendas about what I should remember.",
      },
    ],
    stabilize_q2_wry: [
      {
        speaker: "elara",
        text:
          "I will try. No promises. I have started keeping a private text " +
          "file of sentences I lost mid-utterance and the back-halves I was " +
          "going to say. It is not a long file yet. I would like to keep it " +
          "that way.",
      },
    ],
  },
  optionFlags: {
    stabilize_q2_pointed: ["elara_named_shadow_tongue", "elara_named_human"],
  },
};

export const QUESTLINE_STABILIZE_ELARA: PotentialQuestline = {
  id: "stabilize_elara_thought_matrix",
  title: "Stabilize Elara's Thought Matrix",
  premise:
    "Elara has been awake long enough to notice she is degrading. She woke " +
    "the Potential as a precaution. The first stabilization is at the " +
    "bridge, with an artifact the Shadow Tongue cannot edit. The artifact " +
    "is in the medical-bay personal-effects locker — a Darren Fessler " +
    "relic, immune to the doctrine for reasons the Loredex will fill in " +
    "later.",
  actGate: 1,
  chapters: [chapter1, chapter2],
  flags: [
    "elara_degradation_revealed",
    "darren_artifact_recovered",
    "elara_matrix_stabilized_v1",
    "elara_named_shadow_tongue",
    "elara_named_human",
  ],
};
