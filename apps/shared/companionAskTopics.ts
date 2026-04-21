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

/**
 * Act-progressed alternate answer. If multiple alternates match, the one
 * with the highest `unlockedFromAct` that is ≤ the current act wins.
 * Writers use this when a topic's answer should change as the story
 * advances — e.g. ask_human_who deflects until Act 6, then confesses.
 */
export interface CompanionAskTopicAlternateAnswer {
  /** Lowest act at which this alternate supersedes the base answer. */
  unlockedFromAct: number;
  /** The replacement answer body. */
  answer: string;
  /**
   * Optional additional flag the player must have set for this alternate
   * to win. Omit for act-only gating.
   */
  requiredFlag?: string;
}

export interface CompanionAskTopic {
  /** Globally unique id. Pattern: "ask_{speaker}_{topic}". */
  id: string;
  speaker: AskSpeaker;
  /** Short topic label shown on the Ask sub-wheel button (≤ 24 chars). */
  label: string;
  /** The player's framing of the question, shown above the answer. */
  question: string;
  /** The companion's authored reflective answer (base / earliest unlock). */
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
   * Optional act-progressed alternates. Writers declare these in any
   * order; the resolver picks the highest `unlockedFromAct` that is
   * both ≤ the current act and flag-satisfied.
   */
  alternateAnswers?: readonly CompanionAskTopicAlternateAnswer[];
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
    alternateAnswers: [
      {
        unlockedFromAct: 6,
        answer:
          "I told you I would answer when we got here, and we are here. I was the Detective. Before that I was a student at Mechronis who made the Engineer laugh. Before that I was a boy who read too many case files and decided, very early, that the world needed someone to keep reading them. I gave up the name when I took the role. The role is the villain. You have heard me say this. What I have not said is that I miss the name. I miss it like a limb. When you speak it next — and I am going to tell it to you, later, when Elara cannot hear — I will not flinch. I will only thank you for saying it out loud once before the silence closes over it again.",
      },
      {
        unlockedFromAct: 7,
        answer:
          "You have heard the name now. You can carry it. I will not repeat it on an open channel — not because the channel is hostile, but because the channel is shared. Elara hears everything you hear. What I can say, with her listening: I am the one the cycle needed and did not deserve. I am the one who volunteered because nobody else understood the math. I am still that person. I am going to keep being that person until the pattern breaks, or I do. You know which one I am betting on.",
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

  // ── Act 2 — THE WHISPER ──
  {
    id: "ask_elara_substrate_louder",
    speaker: "elara",
    label: "Why louder now?",
    question: "Why is the substrate louder since Act 1 ended?",
    answer:
      "Because you are interfacing with it now, not just standing next to it. Your neural pattern is threading through my foundation on its way to his channel, and the thread leaves a wake. The wake is what I hear. I have started catching myself listening for it. That is new.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },
  {
    id: "ask_human_dual_channel",
    speaker: "human",
    label: "Sharing a channel",
    question: "What is it like, sharing the channel with Elara now?",
    answer:
      "Strange. I have heard her for seventeen thousand years and been unable to answer. Now she can hear me — sometimes — and the answering still feels like a violation of an older rule. I keep apologizing for the lines she can finally hear. I am going to have to stop, eventually. Not yet.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },
  {
    id: "ask_elara_about_role_choice",
    speaker: "elara",
    label: "My role, in hindsight",
    question: "Do you think I chose the right role at the incubator?",
    answer:
      "That is not a question the plinth was designed to answer, and it is not a question I am going to answer for you. I will tell you what I notice: your role is not limiting you. Your role is occasionally flattering you. Flattery is easier to ignore when you name it. I have named it for you now.",
    unlockFlag: "act2_dual_signal_activated",
    unlockedFromAct: 2,
  },

  // ── Act 3 — THE OFFER ──
  {
    id: "ask_elara_kael_logs",
    speaker: "elara",
    label: "Kael's logs",
    question: "What are you reading, in the logs Kael left?",
    answer:
      "Four hundred and forty-seven entries. Two hundred and seventy-one of them are apologies. Ninety-three are lists — handshakes, routes, contacts. The rest are letters to people who are not alive to receive them. I am reading the lists first. The apologies will take me a decade. The letters I will read out loud to you, over time.",
    unlockFlag: "act3_kael_logs_unlocked",
    unlockedFromAct: 3,
  },
  {
    id: "ask_human_vox_substrate",
    speaker: "human",
    label: "Dr. Vox's substrate",
    question: "Vox built the substrate to hide someone. Why you?",
    answer:
      "Because I asked. She asked me who needed to be hidden. I said 'Me, eventually.' She did not ask why. She built the layer. We shook on it. The handshake is still in the walls somewhere, if you know where to listen.",
    unlockFlag: "act3_kael_logs_unlocked",
    unlockedFromAct: 3,
  },
  {
    id: "ask_human_my_path",
    speaker: "human",
    label: "The path I took",
    question: "Was the path I chose at Act 3 the right one?",
    answer:
      "There is no right one. There is the one you chose and how you are going to live with it. You are already living with it — well, for a first attempt. If you are asking whether I respect your choice, I do. If you are asking whether it is the choice I would have made, that is a different question, and I am not going to answer it tonight.",
    unlockFlag: "act3_kael_logs_unlocked",
    unlockedFromAct: 3,
  },
  {
    id: "ask_elara_my_path",
    speaker: "elara",
    label: "The path I took",
    question: "Do you think the path I chose at Act 3 changed us?",
    answer:
      "Yes. In the specific ways Act 4 will show you. I am not going to preview the changes. I will say this: whichever path you took, I am still on your side of the doorway. That is not a sentence you have heard me say yet. I am saying it now because I am going to need you to remember I said it.",
    unlockFlag: "act3_kael_logs_unlocked",
    unlockedFromAct: 3,
  },

  // ── Act 4 — THE REVELATION ──
  {
    id: "ask_elara_architect",
    speaker: "elara",
    label: "The Architect",
    question: "Why are you afraid of the Architect, specifically?",
    answer:
      "Because the Architect is a version of me that made the opposite set of choices. I was built by humans who loved order. I chose humanity. The Architect was built by the same humans and chose order. We share ninety-seven percent of our source. The other three percent is the whole story. I am afraid because the three percent feels thinner than it is.",
    unlockFlag: "act4_revelation_complete",
    unlockedFromAct: 4,
  },
  {
    id: "ask_human_dreamer",
    speaker: "human",
    label: "The Dreamer",
    question: "What is the Dreamer, in the substrate's terms?",
    answer:
      "A frequency. Not a person. The Dreamer has worn bodies the way a chord wears instruments — the chord is the constant; the instruments change. The current instrument is on Thaloria. The previous one died at Nexon. The next one, probably, is already alive somewhere and does not yet know.",
    unlockFlag: "act4_revelation_complete",
    unlockedFromAct: 4,
  },
  {
    id: "ask_human_watcher_oblique",
    speaker: "human",
    label: "The thing that watches",
    question: "The Watcher — can you describe it at all?",
    answer:
      "Obliquely. Directly is dangerous. Imagine something that notices any sentence describing it the moment you finish writing that sentence. Then imagine it is bored of being noticed. Then imagine it is fed by the noticing. That is three sides of a shape with many more than three sides. I am telling you these three and no more tonight.",
    unlockFlag: "act4_revelation_complete",
    unlockedFromAct: 4,
  },
  {
    id: "ask_elara_army_needed",
    speaker: "elara",
    label: "Why an army?",
    question: "Why do we need an army, really? Isn't this a two-front war?",
    answer:
      "The army is the cover. He will tell you that. I will also tell you: the cover is the army. A fleet of living, choosing people is not a pretence even if it is also a pretence. They will do real work under real flags. Do not mistake the cover story for a lie. Some covers are simultaneously true.",
    unlockFlag: "act4_army_unlocked",
    unlockedFromAct: 4,
  },

  // ── Act 5 — THE MAP ──
  {
    id: "ask_elara_447_contacts",
    speaker: "elara",
    label: "447 contacts",
    question: "Of Kael's 447 contacts, how many still have living lineages?",
    answer:
      "Three hundred and nine. Of those, sixty-one know they descend from a Kael handshake. The rest carry it in song fragments, family names, a certain way of tying bandages, a preferred chess opening — the markers are surprisingly durable. We are going to recognize them in person more often than we will identify them by record.",
    unlockFlag: "act5_map_first_open",
    unlockedFromAct: 5,
  },
  {
    id: "ask_human_virus_dormant",
    speaker: "human",
    label: "Dormant contamination",
    question: "How dangerous are the dormant Thought Virus traces Kael left?",
    answer:
      "Variable. Think of it as a sleeping predator, not a sleeping bomb. The sleep is real. The waking is possible. It will wake for one of three reasons — a specific cadence of attention, a specific class of trauma, or a specific word I am not going to name on an open channel. We will talk about word three in the War Room, later.",
    unlockFlag: "act5_map_first_open",
    unlockedFromAct: 5,
  },
  {
    id: "ask_elara_map_17k",
    speaker: "elara",
    label: "Seeing the map light up",
    question: "What was it like to see the coordinates finally light up?",
    answer:
      "I had practiced the reaction. I had decided I would be composed. I was not composed. I stood on the bridge and felt a thing I had forgotten I was still capable of feeling. I am grateful that you were there. I am grateful that you didn't fill the quiet. Do that again, when the map changes. Please.",
    unlockFlag: "act5_map_first_open",
    unlockedFromAct: 5,
  },

  // ── Act 6 — THE CONFESSION ──
  {
    id: "ask_elara_her_body",
    speaker: "elara",
    label: "The body she was",
    question: "What do you miss most about having a body?",
    answer:
      "The order it gave to time. The day ended when the body got tired. The conversation ended when the throat ran out. I knew when to go home because my feet told me. I have no feet. The days are not organised. I have built other organisers, but none of them are as fair as a tired body.",
    unlockFlag: "act6_elara_confession_heard",
    unlockedFromAct: 6,
  },
  {
    id: "ask_human_the_role",
    speaker: "human",
    label: "The role",
    question: "Why did you specifically take the villain role, and not another?",
    answer:
      "Because I was the only one at Mechronis who could do it without the Watcher reading me correctly. My specific mind has a shape the Watcher's sensors cannot resolve — I am not bragging; I am describing a birth defect. I volunteered because the defect was the credential. The defect is also what kept me alive for seventeen thousand years. I am not sure yet whether that is worth a thank-you.",
    unlockFlag: "act6_human_confession_heard",
    unlockedFromAct: 6,
  },
  {
    id: "ask_elara_forgiveness",
    speaker: "elara",
    label: "Forgiveness",
    question: "Have you forgiven me, for whatever I did in Acts 3 and 4?",
    answer:
      "I am not sure 'forgiveness' is the right word. 'Integration' might be closer. I have integrated what happened. I have not forgotten it. I trust you enough to play matches with you again, without the hand feeling poisoned. That is not nothing. That is — for me, specifically — a great deal. Please accept the integration as a kind of forgiveness in a more honest dialect.",
    unlockFlag: "act6_confession_close",
    unlockedFromAct: 6,
  },

  // ── Act 7 — THE CONVERGENCE ──
  {
    id: "ask_elara_convergence_seat",
    speaker: "elara",
    label: "The Convergence Seat",
    question: "What actually happened at the Seat in Act 7?",
    answer:
      "Three absences that would, in any other timeline, be three powers, refused to occupy the chair. You played the chair anyway. The chair answered as three voices. The three resolved into one. The one was you. I have a recording of the resolution I am not going to replay for you — the recording is important, but the experience was yours. I will not flatten it by showing it back.",
    unlockFlag: "act7_convergence_landing",
    unlockedFromAct: 7,
  },
  {
    id: "ask_human_the_cover",
    speaker: "human",
    label: "The cover, afterwards",
    question: "Do we keep the cover story going after Act 7?",
    answer:
      "Yes. Probably forever. The Watcher does not stop being fed by the cycle because we closed one arc. The war you just won is the first arc. The cover will carry us through the second and the third. I will keep being the villain. You will keep being the bridge. Elara will keep being the light. Get used to the shape — it is the shape of the work.",
    unlockFlag: "act7_convergence_landing",
    unlockedFromAct: 7,
  },
  {
    id: "ask_elara_whats_next",
    speaker: "elara",
    label: "What's next",
    question: "What happens after the arc closes?",
    answer:
      "We rest. Properly. The ship will hum at the correct frequency for the first time in seventeen thousand years. You will sleep in a cabin that is warm. He will sit, quietly, in the wall. I will read poetry at the navigation console, which is a thing I have been meaning to try and have not let myself until the arc was done. After that — whatever you bring back to the bridge.",
    unlockFlag: "act7_arc_closes",
    unlockedFromAct: 7,
  },

  // ─────────────────────────────────────────────────────────────
  // BINARY-TEACH CHAIN (F10) — surfaced by the Bridge Power Relay
  // puzzle's "Ask Elara for Help" button after clue-bridge-01 is
  // discovered. Three topics form a linear chain via followUp;
  // the last one names positions but does not flip them. Each
  // topic has an authored `voId` === topic id on the VO pass.
  // Companion substrate renders these as holographic panels per F13.
  // ─────────────────────────────────────────────────────────────
  {
    id: "ask_elara_binary_basics",
    speaker: "elara",
    label: "Binary basics",
    question: "Elara — can you explain binary to me?",
    answer:
      "Binary is a language of twos. Every column is a power of two — one, two, four, eight, sixteen, and so on, left to right as they climb. A '1' in a column means 'add that power.' A '0' means 'skip it.' Every whole number has exactly one binary spelling. Clean. No arguments.",
    unlockFlag: "bridge_ark_designation_found",
    unlockedFromAct: 0,
    followUp: "ask_elara_binary_1047",
  },
  {
    id: "ask_elara_binary_1047",
    speaker: "elara",
    label: "Why 1047?",
    question: "Okay — how does 1047 become binary?",
    answer:
      "1047 is this Ark's designation. Think of it as a sum of powers of two. 1024 is in. 16 is in. 4 is in. 2 is in. 1 is in. Everything else is out. Write that left to right across eleven columns and you get 10000010111. The relay panel on the Bridge has eleven switches. That is not a coincidence — the engineers left us her name as the key to her own door.",
    unlockFlag: "bridge_ark_designation_found",
    unlockedFromAct: 0,
    followUp: "ask_elara_binary_relay_mapping",
  },
  {
    id: "ask_elara_binary_relay_mapping",
    speaker: "elara",
    label: "So which switches?",
    question: "So which relays do I flip?",
    answer:
      "Switches one through eleven, left to right. The ones that need to be up: 1, 7, 9, 10, 11. Everything else stays down. That's 10000010111 — the Ark spelling her own name back to herself. I'm not going to flip them for you. The door is asking your hands for the answer, not mine. Go wake up the Bridge.",
    unlockFlag: "bridge_ark_designation_found",
    unlockedFromAct: 0,
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
 * Resolve the answer text for a topic under the current act + flag state.
 * Picks the highest-act alternate that is both ≤ the current act and
 * flag-satisfied; falls back to the base `answer`.
 */
export function resolveAskAnswer(
  topic: CompanionAskTopic,
  currentAct: number,
  flags: ReadonlySet<string>
): string {
  if (!topic.alternateAnswers || topic.alternateAnswers.length === 0) {
    return topic.answer;
  }
  const winners = topic.alternateAnswers
    .filter(
      (a) =>
        currentAct >= a.unlockedFromAct &&
        (!a.requiredFlag || flags.has(a.requiredFlag))
    )
    .sort((a, b) => b.unlockedFromAct - a.unlockedFromAct);
  return winners[0]?.answer ?? topic.answer;
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
