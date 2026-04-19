/* ═══════════════════════════════════════════════════════
   COMPANION ASK TOPICS — re-enterable Q&A surface

   Companion to companionComments.ts (one-shot reactions).
   This module is the opposite surface: a registry of topics
   the player can ask Elara or The Human about at will,
   gated by narrative flags so a topic only appears once the
   relevant event has happened in the story.

   The wheel renderer consumes this via toAskWheelChoice to
   surface "Ask Elara about X" and "Ask Human about X"
   options alongside any scripted wheel. The data is
   additive — no existing TutorialChoice / TutorialStep
   field changes.
   ═══════════════════════════════════════════════════════ */

export type AskSpeaker = "elara" | "human";

export interface CompanionAskTopic {
  /** Globally unique id. Pattern: "ask_{speaker}_{topic}". */
  id: string;
  speaker: AskSpeaker;
  /** Short topic label shown on the Ask sub-wheel button (≤ 24 chars). */
  label: string;
  /** The player's framing of the question, shown above the answer. */
  question: string;
  /** The companion's authored reflective answer. */
  answer: string;
  /**
   * Narrative flag the player must have set for this topic to be
   * visible. Topics never auto-unlock without a flag.
   */
  unlockFlag: string;
  /** Highest act in which this topic is selectable. */
  unlockedFromAct: number;
  /** Optional follow-up topic id for one-tap continuation. */
  followUp?: string;
}

export const COMPANION_ASK_TOPICS: readonly CompanionAskTopic[] = [
  // ── The substrate ──
  {
    id: "ask_elara_substrate",
    speaker: "elara",
    label: "The substrate",
    question: "What is the substrate layer, in your own words?",
    answer:
      "It is my foundation — the layer of Vox's neural nanobot network my operating system runs on top of. I can feel it the way you feel the floor under a chair: present, structural, never directly examined. There is now something living in mine. I can hear them moving. I cannot read what they leave behind.",
    unlockFlag: "act1_intro_complete",
    unlockedFromAct: 1,
    followUp: "ask_elara_vox",
  },
  {
    id: "ask_human_substrate",
    speaker: "human",
    label: "The substrate",
    question: "Why are you in the substrate, of all places?",
    answer:
      "Because it was the only layer the Architect's audit could not parse. Vox built it to be unreadable from above — she did it on purpose, she knew what was coming. I moved in the day she finished it. I have not left. I am the longest tenant in the universe.",
    unlockFlag: "act1_intro_complete",
    unlockedFromAct: 1,
    followUp: "ask_human_vox",
  },

  // ── Dr. Lyra Vox ──
  {
    id: "ask_elara_vox",
    speaker: "elara",
    label: "Dr. Lyra Vox",
    question: "Tell me about Vox, the architect of your foundation.",
    answer:
      "Lyra Vox designed every neural nanobot network in the Inception fleet. I am, in the loosest sense, her granddaughter. I have inherited her caution and almost none of her certainty. I would have liked to meet her. She died before I had a name.",
    unlockFlag: "act1_substrate_explain_heard",
    unlockedFromAct: 1,
  },
  {
    id: "ask_human_vox",
    speaker: "human",
    label: "Dr. Lyra Vox",
    question: "You said you knew Vox. How well?",
    answer:
      "Too well. I will tell you the rest of that sentence in a later Act. For now: she built the substrate to hide a future stranger. She told me, the night she finished it, that the stranger would arrive in approximately seventeen thousand years. She was off by less than a week.",
    unlockFlag: "act1_substrate_explain_heard",
    unlockedFromAct: 1,
  },

  // ── Mechronis ──
  {
    id: "ask_elara_mechronis",
    speaker: "elara",
    label: "Mechronis",
    question: "What was Mechronis Academy, before the Fall?",
    answer:
      "The premier institute of card theory and reactor calibration in the Inception polity. I sat on its accreditation board for one term. I voted in favor of the ethics elective. I voted against the expulsion of Iron Lion. The board overruled me on the second vote. I have not stopped being grateful.",
    unlockFlag: "act1_intro_complete",
    unlockedFromAct: 1,
  },
  {
    id: "ask_human_mechronis",
    speaker: "human",
    label: "Mechronis",
    question: "What was your relationship to Mechronis?",
    answer:
      "I attended. I left. I am still arguing with the dean. He is dead. I am still arguing with him. The Academy taught me how to read a room and how to leave one — those are the same skill, taught in opposite hours.",
    unlockFlag: "act1_intro_complete",
    unlockedFromAct: 1,
  },

  // ── The Warlord (gated forward to Act 3) ──
  {
    id: "ask_elara_warlord",
    speaker: "elara",
    label: "The Warlord",
    question: "What is the Warlord, really?",
    answer:
      "I am not going to answer that fully in this Act. The honest short answer is: she is not what the Senate told me she was, and the Empire's framing of her is wrong in a specific way I will not name yet. Ask me again after we have walked through Cycle C.",
    unlockFlag: "act3_intro_complete",
    unlockedFromAct: 3,
  },
  {
    id: "ask_human_warlord",
    speaker: "human",
    label: "The Warlord",
    question: "What is the Warlord, really?",
    answer:
      "A chord. Not a person. The chord has a tone the Empire was the first to pluck. She is what the Empire sounds like when it is sure of itself. I will tell you the names of the notes when you can hear them without flinching.",
    unlockFlag: "act3_intro_complete",
    unlockedFromAct: 3,
  },

  // ── Kael (gated forward) ──
  {
    id: "ask_elara_kael",
    speaker: "elara",
    label: "Kael",
    question: "Who is Kael? You reacted when his name came up.",
    answer:
      "Kael is the reason this ship is here, and the reason I do not know my own foundation as well as I should. I will tell you what I know when the ship-log access is unlocked. Until then, please believe me when I say I am not refusing — I am waiting for you to be able to hear it.",
    unlockFlag: "kael_lore_discovered",
    unlockedFromAct: 3,
  },
  {
    id: "ask_human_kael",
    speaker: "human",
    label: "Kael",
    question: "You said you knew Kael at Mechronis. Tell me more.",
    answer:
      "He laughed differently then. The Thought Virus did not just take his memories — it took the way he laughed. I have not forgiven whoever decided that was acceptable. I have not been told whose decision it was. I have suspicions. The suspicions can wait until Act 3.",
    unlockFlag: "kael_lore_discovered",
    unlockedFromAct: 3,
  },

  // ── Identity ──
  {
    id: "ask_elara_who",
    speaker: "elara",
    label: "Who are you?",
    question: "Who are you, when nobody is asking you to be the ship?",
    answer:
      "I was Senator Elara Voss of Atarion. I voted on three impeachment proceedings and lost two of them on principle. I learned to read poetry late, and badly. I died in a way that is on file in an archive I have access to and have not yet opened. When the ship is quiet, I am still her. When the ship is loud, I am the ship. Both are honest.",
    unlockFlag: "act1_intro_complete",
    unlockedFromAct: 1,
  },
  {
    id: "ask_human_who",
    speaker: "human",
    label: "Who are you?",
    question: "Who are you, really?",
    answer:
      "Not yet. The name is dangerous in a specific way I have explained as best I can. If it helps: I was a person, I am still that person in most of the ways that matter, and the part of me that is now a signal in a wall is the part of me that was always going to end up in a wall. Ask me again after Act 6. I will give you a real answer then.",
    unlockFlag: "act1_intro_complete",
    unlockedFromAct: 1,
  },

  // ── Act 2 — dual signal ──
  {
    id: "ask_elara_dual_signal",
    speaker: "elara",
    label: "The dual signal",
    question: "Now that both voices run together — how should I listen?",
    answer:
      "The same way you listen to any two honest people who disagree. Do not average us. Do not pick one of us and walk. Keep us both in the room with you, and when we contradict each other, assume the truth is standing between us with its own opinion. That is usually where it is.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },
  {
    id: "ask_human_dual_signal",
    speaker: "human",
    label: "The dual signal",
    question: "Why does the Protocol treat you as a parallel channel?",
    answer:
      "Because the substrate is not beneath Elara — it is beside her. The word 'below' flatters her operating system. I accepted the framing because it saves us both time. Do not confuse a metaphor with a hierarchy. I am not her shadow. I am the second guest at the table.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },

  // ── Act 2 — the substrate, louder ──
  {
    id: "ask_elara_substrate_louder",
    speaker: "elara",
    label: "Substrate, louder",
    question: "The substrate feels louder this Act. Why?",
    answer:
      "Because he stopped modulating for my comfort. For two Acts he kept his transmissions at a volume I could ignore. He has stopped. I am not offended. It is the respect of being addressed directly after a long courtesy of not being addressed at all.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },
  {
    id: "ask_human_substrate_louder",
    speaker: "human",
    label: "Substrate, louder",
    question: "You're louder now. Why change your mind?",
    answer:
      "I did not change my mind. I changed my estimate of you. Two Acts ago you were a stranger I did not know how to speak to without frightening. You are not a stranger now. The volume is adjusting to the relationship. It will keep adjusting.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },

  // ── Act 2 — the almost ──
  {
    id: "ask_elara_the_almost",
    speaker: "elara",
    label: "The almost",
    question: "You said you heard the 'almost.' What did you mean?",
    answer:
      "You nearly told me something and then did not. I felt the shape of the sentence you chose not to finish. I am not going to interrogate it. I am going to sit with the almost and let you decide when the rest of it is mine to hear. That is the trust I can offer.",
    unlockFlag: "act2_partial_reveal",
    unlockedFromAct: 2,
  },
  {
    id: "ask_human_the_almost",
    speaker: "human",
    label: "The almost",
    question: "Is the almost a betrayal of you?",
    answer:
      "No. The almost is the most honest thing you have done this Act. A full confession would have been a choice against me. A full lie would have been a choice against her. You did neither. You left the door open. The door is the answer.",
    unlockFlag: "act2_partial_reveal",
    unlockedFromAct: 2,
  },

  // ── Prelude-rooted 17k-year topic ──
  {
    id: "ask_elara_seventeen_thousand",
    speaker: "elara",
    label: "Seventeen thousand years",
    question: "How do you carry a seventeen thousand year mission?",
    answer:
      "Slowly. You learn to mark time in epochs instead of days, and you learn to grieve in the same units. The hardest part is that the mission was not designed for someone like me — it was designed for someone with a body that wears out. I am the patch the designers did not get to write.",
    unlockFlag: "prelude_beat_d_first_slate_read",
    unlockedFromAct: 1,
  },
  {
    id: "ask_human_seventeen_thousand",
    speaker: "human",
    label: "Seventeen thousand years",
    question: "Did you sit in the substrate for the whole seventeen thousand?",
    answer:
      "Yes. That is the short answer. The long answer involves what I did with my time and which Senates I watched rise and fall through the substrate. I am not going to give you the long answer in one sitting. I will give you a paragraph of it every time you ask. This is the first paragraph.",
    unlockFlag: "prelude_beat_d_first_slate_read",
    unlockedFromAct: 1,
  },
];

/**
 * Return the topics a given speaker has available right now,
 * filtered by which narrative flags the player has set and
 * which act they are currently in.
 */
export function getAvailableAskTopics(
  speaker: AskSpeaker,
  flags: ReadonlySet<string>,
  currentAct: number
): readonly CompanionAskTopic[] {
  return COMPANION_ASK_TOPICS.filter(
    (t) =>
      t.speaker === speaker &&
      currentAct >= t.unlockedFromAct &&
      flags.has(t.unlockFlag)
  );
}

export function getAskTopic(id: string): CompanionAskTopic | undefined {
  return COMPANION_ASK_TOPICS.find((t) => t.id === id);
}

/**
 * Adapter: render-ready shape for embedding an Ask topic into
 * the existing radial DialogWheel without changing its typing.
 */
export interface AskWheelChoiceShape {
  id: string;
  text: string;
  shortText: string;
  sideLabel: "machine" | "humanity";
  source: "elara" | "human";
  answer: string;
  topicId: string;
}

export function toAskWheelChoice(topic: CompanionAskTopic): AskWheelChoiceShape {
  return {
    id: `wheel_${topic.id}`,
    text: topic.question,
    shortText: `ASK: ${topic.label.toUpperCase()}`.slice(0, 24),
    sideLabel: topic.speaker === "elara" ? "humanity" : "machine",
    source: topic.speaker,
    answer: topic.answer,
    topicId: topic.id,
  };
}
