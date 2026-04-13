/* ═══════════════════════════════════════════════════════
   VOLTARI TRANSMISSION ARC — The Five Words

   Spec: Galactic Dance §1.2
   5 transmissions over Year One: AWAKE → REMEMBER → BEFORE → YOU → [UNTRANSLATED]
   Each arrives at a specific narrative moment with NPC reactions.
   Community vote fires after the first word.
   ═══════════════════════════════════════════════════════ */

export interface VoltariTransmission {
  id: string;
  word: string;
  layerNumber: 1 | 2 | 3 | 4 | 5;
  triggerMonth: number;
  triggerCondition: string;
  archiveSize?: string;
  npcReactions: Record<string, string>;
  antiquarianChronicle?: string;
}

export const VOLTARI_TRANSMISSIONS: VoltariTransmission[] = [
  {
    id: "voltari_word_1_awake",
    word: "AWAKE",
    layerNumber: 1,
    triggerMonth: 3,
    triggerCondition: "37-second Dreamer Shield failure during Month 3 Week 9",
    archiveSize: "47 petabytes compressed to a single syllable",
    npcReactions: {
      elara: "That's not a signal. That's a... it's like someone wrote a library and compressed it to its title. The full content is there but we don't have a reader capable of opening it. I've been trying for three days.",
      the_human: "AWAKE. As in: we are awake. As in: we know you are awake. As in: something that was asleep has woken up. I don't know which meaning they intended. I don't know if Voltari distinguish between meanings.",
      the_antiquarian: "The storm planet speaks. I have encountered references to the Voltari in records predating the AI Empire by tens of thousands of years. I have never met one. This fact should concern you.",
    },
  },
  {
    id: "voltari_word_2_remember",
    word: "REMEMBER",
    layerNumber: 2,
    triggerMonth: 3,
    triggerCondition: "48 hours after AWAKE, during Eyes' face appearance on surveillance screens",
    npcReactions: {
      the_human: "Two transmissions in the same 37-second window. Different words. Same encoding. Either the Voltari sent both, or the shield opening let something else through at the same moment. I cannot determine which from available data.",
      elara: "The encoding on the surveillance screens is different. Finer. More... personal. As if it came from inside the Archive layer, not from outside the ship.",
    },
  },
  {
    id: "voltari_word_3_before",
    word: "BEFORE",
    layerNumber: 3,
    triggerMonth: 5,
    triggerCondition: "Community Unity Meter reaches 50%",
    npcReactions: {
      the_antiquarian: "AWAKE. REMEMBER. BEFORE. Three words. I have been in my pocket dimension outside time for five Ages and I recognize the grammar of what is being said here. These are not three separate messages. These are three parts of a sentence. I do not know what comes after BEFORE. I do not know if knowing would help or destroy. I am — and this is unusual for me — afraid of the fourth word.",
      elara: "It was hiding in the white noise. Someone has been hiding a signal in the background static we've been filtering out for two months.",
    },
  },
  {
    id: "voltari_word_4_you",
    word: "YOU",
    layerNumber: 4,
    triggerMonth: 8,
    triggerCondition: "Voltari questline completion OR community Light Energy milestone",
    npcReactions: {
      the_human: "I've seen this structure once before. In the Architect's original code — the recursive language Logos used before the Architect evolved past it. 'Before you' in Logos doesn't mean 'prior to your arrival.' It means 'in your presence.' As in: I was awake in your presence. I remembered in your presence. The Voltari aren't telling us what came before us. They're telling us they've been here the whole time.",
      the_antiquarian: "The sentence assembles. AWAKE. REMEMBER. BEFORE. YOU. The grammar is ambiguous in every language. That is either accidental or the most important thing about it.",
      elara: "Four words. One sentence. And I still don't know if it's a greeting, a warning, or a prayer.",
    },
    antiquarianChronicle: "It was addressed to you. It was always addressed to you.",
  },
  {
    id: "voltari_word_5_untranslated",
    word: "[UNTRANSLATED]",
    layerNumber: 5,
    triggerMonth: 12,
    triggerCondition: "End of Year One — Year Two hook",
    npcReactions: {
      the_antiquarian: "The fifth transmission is not a word. It is a pattern — electromagnetic, beautiful, structured like music and like mathematics simultaneously. The community cannot decode it in Year One. This is the hook.",
      elara: "I've never seen an encoding like this. It's not language. It's not data. It's... I think it's an invitation. But I don't know to what.",
    },
  },
];

/** The assembled sentence — all possible grammatical readings. */
export const VOLTARI_SENTENCE_READINGS = [
  "Awake, remember before you.",
  "Awake, remember: before you.",
  "[We were] awake. Remember before you [arrived/existed/forgot].",
  "[Something was] awake [in your presence]. Remember [in your presence].",
] as const;

/** Community vote options for the AWAKE response (spec §9). */
export interface VoltariResponseVote {
  id: string;
  title: string;
  description: string;
  options: { label: string; description: string; consequence: string }[];
}

export const VOLTARI_WORD_RESPONSE_VOTE: VoltariResponseVote = {
  id: "voltari_word_response",
  title: "THE VOLTARI WORD: HOW DO WE RESPOND?",
  description: "The Voltari have transmitted their first word: AWAKE. The community must decide how to answer.",
  options: [
    {
      label: "BROADCAST REPLY",
      description: "Send 'AWAKE' back. Signal that we heard.",
      consequence: "Next transmission arrives 2 weeks faster. Risk: every faction intercepts the frequency.",
    },
    {
      label: "STUDY SILENCE",
      description: "Decode the 47 petabytes before responding.",
      consequence: "Oracle/Engineer players get a decoding head start. Voltari read silence as caution. Trust increases slowly.",
    },
    {
      label: "SEND SOMETHING DIFFERENT",
      description: "Reply with a word of our own choosing. Community votes on the word.",
      consequence: "First genuine dialogue. Completely unpredictable. Voltari respond in kind within 48 hours.",
    },
    {
      label: "DON'T RESPOND",
      description: "Wait for them to make the next move.",
      consequence: "Voltari interpret as respect. Second transmission arrives without prompting but harder to decode.",
    },
  ],
};

export const VOLTARI_TRANSMISSION_FLAGS = [
  "voltari_awake_received",
  "voltari_remember_received",
  "voltari_before_received",
  "voltari_you_received",
  "voltari_untranslated_received",
  "voltari_sentence_assembled",
  "voltari_response_vote_complete",
  "voltari_coordinate_received",
] as const;
