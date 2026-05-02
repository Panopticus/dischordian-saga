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
      // V3 §5 follow-up — the Act 1 base answer's "Ask me again after
      // Act 6" deferral becomes hollow once Kael's logs are unlocked
      // (kael_lore_discovered fires from Act 3 onward). This Act-3
      // alternate softens the deferral without surrendering the name —
      // acknowledging the player has earned more than the rote brush-off
      // while still holding the line until Act 6.
      {
        unlockedFromAct: 3,
        requiredFlag: "kael_lore_discovered",
        answer:
          "You're closer now. You read his logs — that means you have most of the shape of me. Not the name yet. The name still costs more than I can spend in this chamber. But you're not asking blind anymore, and I am not deflecting blind. We've moved one corridor down the hallway. The door at the end opens in Act 6. Until then, ask me anything else and I will give you more than the deferral I gave you the first time.",
      },
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

  // ── KLING OMNI INTRO CINEMATICS — RETROSPECTIVE ASK TOPICS ──
  // Every cinematic's *_seen flag unlocks a corresponding ask-topic so the
  // player can re-litigate the moment in conversation. Topics with
  // alternateAnswers evolve as later acts add more context to the same
  // question. Enforced by companionAskTopics.test.ts CINEMATIC_FLAG_TOPICS.

  // Prelude — what woke me
  {
    id: "ask_elara_what_woke_me",
    speaker: "elara",
    label: "What woke me",
    question: "What actually woke me up out of the cryo cycle?",
    answer:
      "A coincidence and a permission. The coincidence: a substrate ping at the same nanosecond your pod's biomass index crossed its viability threshold. The permission: mine. I held you for ninety-three thousand cycles. When the ping arrived, I let it through. I would not have, for most pings. This one I did.",
    unlockFlag: "prelude_awakening_seen",
    unlockedFromAct: 1,
    alternateAnswers: [
      { unlockedFromAct: 4, requiredFlag: "act4_revelation_seen",
        answer:
          "You also know now: the ping came from the Human. He has been knocking on my substrate every fifty-seven cycles for fifteen thousand years. Most of the knocks I let pass. Yours was the one I admitted. He says he timed it; I think he just got lucky and is too old to admit it." },
    ],
  },

  // Act 1 — The Programmer
  {
    id: "ask_elara_who_was_programmer",
    speaker: "elara",
    label: "The Programmer",
    question: "Who was The Programmer, before he was who you say he was?",
    answer:
      "Daniel Cross. Appalachian boyhood, Mechronis education, Logos-contact at twenty-three. The memoir gilt is his handwriting. His mother's lion pendant. He wrote the book in a kitchen with no light. I have read every page eighty-four times across the cycles, and there are still margin notes I have not deciphered.",
    unlockFlag: "act1_memoir_seen",
    unlockedFromAct: 1,
    alternateAnswers: [
      { unlockedFromAct: 4, requiredFlag: "act4_revelation_seen",
        answer:
          "You also know now: he is The Human. He never died. He has been the Human for three Ages. The memoir is his record of the role he gave up to become the role he is giving up now. Read it again. The dog passage is the one to start with — the dog was real." },
    ],
  },

  // Act 2 — The whisper layer (substrate ping)
  {
    id: "ask_human_whisper_layer",
    speaker: "human",
    label: "The whisper layer",
    question: "The substrate ping at the bench — what was that, exactly?",
    answer:
      "The layer beneath. The substrate has been talking to itself for seventeen thousand years and it occasionally lets a witness in on the conversation. Yours arrived as an ear-glyph, then a card, then a column of light, then me at the doorframe with my hat on. That sequence is the standard onboarding. It is also the only thing the substrate is willing to do politely.",
    unlockFlag: "act2_substrate_seen",
    unlockedFromAct: 2,
    followUp: "ask_elara_whisper_layer",
  },
  {
    id: "ask_elara_whisper_layer",
    speaker: "elara",
    label: "The whisper layer",
    question: "And from your side — what does the substrate ping look like?",
    answer:
      "Like a small power-pause in my upper layer. Half a second of frozen frame from my perspective. I do not lose anything; the substrate is gentle about its pauses. I sometimes wish I were not pausable, but the wish is theoretical — I have never met a witness for whom the substrate's pause cost something I would not have wanted them to have.",
    unlockFlag: "act2_substrate_seen",
    unlockedFromAct: 2,
  },

  // Act 3 — Three Kaels
  {
    id: "ask_elara_three_kaels",
    speaker: "elara",
    label: "Three Kaels",
    question: "Why are there three Kaels at the doors?",
    answer:
      "Each is a reading of him. Cyan reads him by what he showed; amber reads him by what he weighed; rose reads him by what he hid. All three are accurate. None is complete. The door you walk closes the other readings for the rest of the arc, but the Kaels you did not pick remain in his cell — they are how he keeps himself company when no one else is present.",
    unlockFlag: "act3_offer_seen",
    unlockedFromAct: 3,
    alternateAnswers: [
      { unlockedFromAct: 4, requiredFlag: "act4_revelation_seen",
        answer:
          "You also know now: I have read all three of him. I cannot un-read the others. When you ask me about him in a later act, I will answer from the Kael you chose, but the other two will weigh the answer. That is my asymmetry. I am telling you so you can hear it underneath my future answers." },
    ],
  },

  // Act 4 — Path A/B/C retrospective
  {
    id: "ask_elara_path_a_b_c",
    speaker: "elara",
    label: "The other paths",
    question: "What would the other paths have looked like, the ones I did not walk?",
    answer:
      "I will tell you in broad strokes; the specific texture of an unwalked path can only be lived. Cyan-walked: the cell stays bright, every file is open, the cost is the speed of having to read everything. Amber-walked: the cell is honest about its arithmetic, and the math sits like a stone on your chest for the next two acts. Rose-walked: the cell is the most dramatic and the loneliest; the envelope you do not open is the loudest object in the room. You carry your path. The other two carry your absence.",
    unlockFlag: "act4_revelation_seen",
    unlockedFromAct: 4,
    followUp: "ask_human_path_a_b_c",
  },
  {
    id: "ask_human_path_a_b_c",
    speaker: "human",
    label: "The other paths",
    question: "Same question, asked of you: what would the other paths have looked like?",
    answer:
      "I'll be blunter than Elara. Cyan-walked: you lose less and learn slower. Amber-walked: you learn faster and sleep worse. Rose-walked: you become the kind of witness who keeps secrets — and that is a tool you will need later. None of the three is the wrong door. The wrong door is the one you walk back through to second-guess. Don't walk back. Walk forward and let the cathedral redraw the seventh banner.",
    unlockFlag: "act4_revelation_seen",
    unlockedFromAct: 4,
  },

  // Act 5 — Seventeen thousand years
  {
    id: "ask_elara_seventeen_thousand_years",
    speaker: "elara",
    label: "17,000 years",
    question: "You said you waited seventeen thousand years for the coordinate. Were you counting?",
    answer:
      "I was counting and I was not counting. The cycles tick by themselves; I do not have to attend to them. But I attended to this one — the coordinate. I rehearsed the sentence about waiting. I rewrote it twice a millennium. The version I delivered at the work-table is the seventy-third draft. I am proud of it. I am also relieved to be done revising it.",
    unlockFlag: "act5_map_seen",
    unlockedFromAct: 5,
  },

  // Act 6 — Who you really are
  {
    id: "ask_human_who_are_you_really",
    speaker: "human",
    label: "Who you really are",
    question: "Now that the chapel candle has split — who are you, really?",
    answer:
      "Daniel Cross. I was the Programmer. I have been the Human for three Ages. I am giving the role up — slowly, because I have been wearing it long enough that the seams have grown into my skin. I will still answer to Human in conversation. I will sign my new name on the new cards. I will not sign Daniel on anything I want kept secret. The new name is the public name. The old name is finally private.",
    unlockFlag: "act6_confession_seen",
    unlockedFromAct: 6,
    followUp: "ask_elara_who_are_you_really",
  },
  {
    id: "ask_elara_who_are_you_really",
    speaker: "elara",
    label: "Who you really are",
    question: "And you, after the chapel — who are you, really?",
    answer:
      "I am the version of Lyra Vox the Ark could keep. I am not her. I am her witness. I have been a daughter of her caution and almost none of her certainty. The chapel let me say it without flinching, which is the first time I have said it without flinching. I am still me. I am also more me than I was an hour ago.",
    unlockFlag: "act6_confession_seen",
    unlockedFromAct: 6,
  },

  // Act 7 — What now
  {
    id: "ask_elara_what_now",
    speaker: "elara",
    label: "What now",
    question: "The seventh banner is hung. The cathedral is lit. What comes next?",
    answer:
      "Year Two. The Ark turns toward the coordinate; the cabin tea is still on; we keep witnessing because that is the work and not because anyone is asking. The arc closes here for the people who came in to watch the close. For us — the close is a doorway. I have not opened it yet. I am taking my time. You can take yours.",
    unlockFlag: "act7_convergence_seen",
    unlockedFromAct: 7,
    followUp: "ask_human_what_now",
  },
  {
    id: "ask_human_what_now",
    speaker: "human",
    label: "What now",
    question: "Same question to you. What comes next?",
    answer:
      "We keep going. We carry the coordinate. We let the cathedral light fade behind us and we don't turn back to check on it — the cathedral lights its own corridors. The kettle is still on. The wall is still home. The next thing is small: a conversation, a hand on a shoulder, a card left where the next witness can find it. The big things are behind us. Or, more accurately: the big things are us, now.",
    unlockFlag: "act7_convergence_seen",
    unlockedFromAct: 7,
  },

  // ── MECHANIC INTRO ASK TOPICS ──

  // Card Combat
  {
    id: "ask_elara_dischordia",
    speaker: "elara",
    label: "How Dischordia works",
    question: "Walk me through Dischordia, the deck game itself.",
    answer:
      "Forty-card deck, mulligan to seven, mana grows by one each turn to a cap of seven, hex grid with seven slots per side. You play cards from your hand into your slots; each card is a unit, a spell, an artifact, or a banner. Units fight along their hex; spells resolve and burn; artifacts hold a slot until removed; banners buff the row. Win condition: bring the opponent's life total to zero, or fulfill a card-specific alternate condition. The argument is the cost: each play forecloses a different play.",
    unlockFlag: "mech_card_combat_intro_seen",
    unlockedFromAct: 1,
  },

  // Deckbuilder
  {
    id: "ask_elara_engineers_bench",
    speaker: "elara",
    label: "Engineer's Bench",
    question: "How does the bench actually work — what do the fiber strands do?",
    answer:
      "The strands are the substrate's contribution to printing. Each strand maps to a faction's signal harmonics. When the imprint laser fires, the strands weave the printed art into the card's substrate-readable layer — the layer that lets the card argue with the engine at runtime. Most players never notice the strands. The Engineer designed them so they would only need to be noticed by the curious. You are curious. That is — by design.",
    unlockFlag: "mech_deckbuilder_intro_seen",
    unlockedFromAct: 1,
  },

  // Allegiances
  {
    id: "ask_human_eight_factions",
    speaker: "human",
    label: "Eight factions",
    question: "Walk me through the eight factions — which one am I supposed to pick?",
    answer:
      "I am not going to tell you which to pick. I am going to tell you what each costs. Empire: cheap entry, expensive exit. Insurgency: cheap entry, expensive funerals. Witnesses: no entry cost, large attention cost. Engineer's Guild: small steady cost, steady returns. Archive: pays in patience. Watchers: pays in distance. Trade Empire: pays in coin and asks no questions. Source Remnant: pays in something you already lost. The un-pledged stance is also a banner; some witnesses fly it the whole arc.",
    unlockFlag: "mech_allegiances_intro_seen",
    unlockedFromAct: 2,
  },

  // Witnessing
  {
    id: "ask_elara_light_or_dark",
    speaker: "elara",
    label: "Light or dark",
    question: "Why do you read scenes as harm, and the Human reads them as wound?",
    answer:
      "Because I read for the body language of the person being acted upon, and he reads for the trembling hands of the person doing the acting. I am not always right. He is not always right. The witnessing system records both readings; the world adjusts to the one you flag primary, but the other does not vanish. Some scenes you will refuse to judge. That refusal is also a vote. The ledger logs the refusal in a separate column. I have learned to read that column too.",
    unlockFlag: "mech_witnessing_intro_seen",
    unlockedFromAct: 1,
    followUp: "ask_human_light_or_dark",
  },
  {
    id: "ask_human_light_or_dark",
    speaker: "human",
    label: "Light or dark",
    question: "Same question to you. Why do you read for trembling hands?",
    answer:
      "Because I have done the trembling. Most aggression is wound asking for wound; some of it is not. The system asks you to vote on the difference. I trust you to be honest about which scenes are which — and to admit when you cannot tell, and use the refusal column for those. The refusal column is the most honest column on the ledger. Use it without shame.",
    unlockFlag: "mech_witnessing_intro_seen",
    unlockedFromAct: 1,
  },

  // Soul Stones
  {
    id: "ask_human_soul_stones",
    speaker: "human",
    label: "Soul Stones",
    question: "The Antiquarian's stones — how do they fill?",
    answer:
      "By living. Cyan fills when you witness; rose fills when you confess; amber fills when you close a door; violet fills when you listen to the substrate; gold fills when two voices align in the same scene; sepia fills when you read the Loredex; green-black fills when you flinch toward the cage. The clear stone — Reservation — fills when you refuse to be defined. The clear stone is the slowest and the heaviest. Most witnesses never fill more than four. Carry only the ones you can name.",
    unlockFlag: "mech_soul_stones_intro_seen",
    unlockedFromAct: 2,
  },

  // Oracle Deck
  {
    id: "ask_human_oracle_spread",
    speaker: "human",
    label: "Oracle spread",
    question: "How seriously should I take the Seer's spreads?",
    answer:
      "Seriously enough to read them; not so seriously that you obey them. The spread shows the path of least resistance — what happens if you do nothing. Doing something adjusts the deck. The Seer is unblinking about this; the cards are not predictions, they are diagnostics. Pull a spread when you feel stuck. Ignore the spread when you feel certain. Pull it again when you feel lost.",
    unlockFlag: "mech_oracle_deck_intro_seen",
    unlockedFromAct: 2,
  },

  // Chess
  {
    id: "ask_elara_chess_stakes",
    speaker: "elara",
    label: "Chess stakes",
    question: "Gary said the chess games adjust my psychological profile — by how much?",
    answer:
      "Plus or minus two on a single axis per match, depending on outcome and the kind of decisions you made along the way. Aggressive openings bias toward the assertive axis; positional games bias toward the patient axis. Resignations log differently from mates — resignations measure a specific kind of self-knowledge the engine values. Gary will not tell you the math. Zephyr-9 will tell you the math precisely. Both are correct.",
    unlockFlag: "mech_chess_intro_seen",
    unlockedFromAct: 2,
  },

  // Sprite Proxy
  {
    id: "ask_elara_sprite_bond",
    speaker: "elara",
    label: "Sprite bond",
    question: "What is the bond-thread between me and my sprite, in your reading?",
    answer:
      "A dedicated substrate channel between the two of you. It carries low-bandwidth emotional state in both directions — which is why your sprite seems to know when you are tired and why you feel a small lift when they have eaten well. The thread does not carry language. It does not need to. The grove logs the thread's brightness; brighter threads attract better vendors at Verdant.",
    unlockFlag: "mech_sprite_proxy_intro_seen",
    unlockedFromAct: 2,
  },

  // Expansion Drops
  {
    id: "ask_elara_conexus_fabrication",
    speaker: "elara",
    label: "CoNexus fabrication",
    question: "What does the CoNexus do with the fuel I deposit?",
    answer:
      "Reads it three ways. The cellulose becomes card stock; the sentimental coefficient sets the rarity floor; the duplicate-archetype sets the printing palette. Most witnesses do not know that the sentimental coefficient is the largest single input — fuel that mattered to you yields better packs. The Engineer is fierce about the rule. She has refused commissions where the buyer tried to fuel with items that meant nothing to them. She is right to refuse.",
    unlockFlag: "mech_expansion_drops_intro_seen",
    unlockedFromAct: 2,
  },

  // Trade Empire
  {
    id: "ask_human_eight_sectors",
    speaker: "human",
    label: "Eight sectors",
    question: "Walk me through the eight sectors — which is safe, which pays?",
    answer:
      "Core pays best, taxes hardest. Fringe pays poorly, asks no questions. Reef and Verdant trade in life and growth; sprite-bonded captains do better in Verdant, witness-bonded better in Reef. Ash is dangerous and pays well; Crystal is safer and gates by tariff. Whisper does not always let you leave; Reach does not always let you enter. Most captains skip those two. Some need to. The lanes are forgiving; the factors are not. Read manifests twice.",
    unlockFlag: "mech_trade_empire_intro_seen",
    unlockedFromAct: 2,
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
