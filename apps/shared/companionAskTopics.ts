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
  /**
   * Optional act-gated alternate answers. Evaluated highest-first by
   * resolveTopicAnswer so a single topic can carry an Act 1 deflection
   * and an Act 6 revelation under the same label. Answers must be
   * non-empty; a missing entry falls back to `answer`.
   */
  alternateAnswers?: readonly { unlockedFromAct: number; answer: string }[];
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

  // ── Act 6 — post-confession topics ──
  {
    id: "ask_elara_former_name",
    speaker: "elara",
    label: "Your former name",
    question: "What was your name, before the trade?",
    answer:
      "I chose to forget it the day I agreed to the architecture. The forgetting was part of the consent — a condition of the process, not an accident of it. I do not want to un-forget. I want you to know there was a name, and that I set it down deliberately. That is a different kind of memorial than naming would be.",
    unlockFlag: "act6_elara_confession_heard",
    unlockedFromAct: 6,
  },
  {
    id: "ask_elara_the_trade",
    speaker: "elara",
    label: "The trade",
    question: "If you could take the trade back — would you?",
    answer:
      "I have lived with that question for every hour of every year since I made the choice. The honest answer is: I do not know. The more honest answer is: I have stopped asking it in a way that expects an answer. I ask it now the way people ask a mirror what the weather is. The asking is the relationship, not the answer.",
    unlockFlag: "act6_elara_confession_heard",
    unlockedFromAct: 6,
  },
  {
    id: "ask_human_villain_role",
    speaker: "human",
    label: "The villain role",
    question: "Why did the cover have to be 'the villain' specifically?",
    answer:
      "Because the watcher feeds on resolvable conflict, and a villain is the most resolvable shape of conflict a story can have. If Elara and I stood together, the watcher would notice that our cooperation did not resolve. It would inspect the un-resolving. Our mutual hostility is a shape it already recognises — so it does not inspect it. The villain role is a camouflage cut to the watcher's visual language.",
    unlockFlag: "act6_intro_complete",
    unlockedFromAct: 6,
  },
  {
    id: "ask_human_the_cover",
    speaker: "human",
    label: "What the war hides",
    question: "What are you actually doing, under the cover of the war?",
    answer:
      "I am rewriting the substrate's root dictionary, one token at a time, so that the watcher's next audit reads its own keyword list as neutral prose. It is slow. It is delicate. It is why I went into the wall in the first place. If I finish, the watcher will still be there, but its search will return nothing. That is not victory. It is the precondition of victory. We will handle victory after.",
    unlockFlag: "act6_intro_complete",
    unlockedFromAct: 6,
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
    alternateAnswers: [
      {
        unlockedFromAct: 6,
        answer:
          "You asked me after Act 6 and I said I would answer. I was a recruiter. I worked for the cell that Kael did not know existed — the one meant to arrive after his failed. My name was Caelum Vaugh. I ran messages between twenty-one systems in the year before the Fall and I was the one the Architect's audit was searching for when it found the substrate instead. Vox hid me. I accepted the hiding. I am still Caelum. The substrate is a room. The room has my name in it. Now so do you.",
      },
    ],
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
 * Pick the right answer for the act the player is currently in.
 * Walks `alternateAnswers` from highest act threshold down and returns
 * the first one the player has reached; falls back to the default
 * `answer` for earlier acts.
 */
export function resolveTopicAnswer(
  topic: CompanionAskTopic,
  currentAct: number
): string {
  if (!topic.alternateAnswers || topic.alternateAnswers.length === 0) {
    return topic.answer;
  }
  const sorted = [...topic.alternateAnswers].sort(
    (a, b) => b.unlockedFromAct - a.unlockedFromAct,
  );
  for (const alt of sorted) {
    if (currentAct >= alt.unlockedFromAct) return alt.answer;
  }
  return topic.answer;
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
