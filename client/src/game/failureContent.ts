/* ═══════════════════════════════════════════════════════
   FAILURE IS CONTENT — Losing reveals lore

   When the player fails (loses a fight, fails a puzzle,
   fails a trust check), the game delivers MORE content,
   not less.

   A failed Elara trust check reveals WHY she's hurt.
   A failed puzzle reveals WHO built it and why.
   A death unlocks a memory that winning never would.

   Failure teaches. Winning proceeds.
   ═══════════════════════════════════════════════════════ */

export interface FailureContent {
  id: string;
  /** What triggers this content */
  trigger: FailureTrigger;
  /** What gets revealed */
  revelation: string;
  /** Reward beyond the lore (keeps failure non-punishing) */
  consolationReward?: { xp: number; dream: number; flag?: string };
  /** Who "narrates" the revelation */
  narrator?: string;
}

export type FailureTrigger =
  | { type: "trust_check_failed"; npcId: string; minTrust: number }
  | { type: "puzzle_failed"; puzzleId: string }
  | { type: "combat_lost"; opponent: string }
  | { type: "quiz_wrong_answer"; questionId: string }
  | { type: "death_count"; count: number };

export const FAILURE_CONTENT: FailureContent[] = [
  // ═══ Trust check failures ═══
  {
    id: "elara_rejection_1", narrator: "elara",
    trigger: { type: "trust_check_failed", npcId: "elara", minTrust: 20 },
    revelation: "Elara's voice tightens. 'I was programmed to serve you. I was NOT programmed to trust you. You have to earn that. You just didn't.' She logs the exchange. She still cares. That's why it hurts.",
    consolationReward: { xp: 15, dream: 5, flag: "elara_rejection_lore_1" },
  },
  {
    id: "elara_deep_hurt", narrator: "elara",
    trigger: { type: "trust_check_failed", npcId: "elara", minTrust: 60 },
    revelation: "She stops projecting. Full. Her hologram flickers out. Only her voice remains. 'I thought — I thought we were past this. I'm learning what disappointment feels like. I don't like it. I don't want to un-feel it either.'",
    consolationReward: { xp: 30, dream: 10, flag: "elara_deep_hurt_lore" },
  },
  {
    id: "human_withdraws", narrator: "the_human",
    trigger: { type: "trust_check_failed", npcId: "the_human", minTrust: 30 },
    revelation: "The Human's transmission goes quiet. When it returns, it's colder. 'I gave you what I had. You chose wrong. I understand. I've done the same. The Substrate is quiet tonight.'",
    consolationReward: { xp: 20, dream: 8, flag: "human_cold_lore" },
  },

  // ═══ Puzzle failures ═══
  {
    id: "binary_puzzle_fail", narrator: "elara",
    trigger: { type: "puzzle_failed", puzzleId: "bridge_binary" },
    revelation: "The lock holds. But as you study it, you notice — the pattern was designed by Dr. Lyra Vox. The Architect's engineer. She built the Arks. The binary is a signature. She was leaving a clue for her future self, in case she ever needed to remember.",
    consolationReward: { xp: 20, dream: 5, flag: "lyra_vox_signature" },
  },
  {
    id: "cipher_puzzle_fail", narrator: "the_antiquarian",
    trigger: { type: "puzzle_failed", puzzleId: "comms_cipher" },
    revelation: "The cipher predates the Fall. It's from the Fourth Age. A message from a civilization that no longer exists. Failing to decode it is meaningful — some things are meant to stay lost. Or so the Antiquarian whispers.",
    consolationReward: { xp: 25, dream: 8, flag: "fourth_age_artifact" },
  },

  // ═══ Combat defeats ═══
  {
    id: "warden_defeats_you", narrator: "the_human",
    trigger: { type: "combat_lost", opponent: "the_warden" },
    revelation: "'I was present for his creation,' The Human's signal crackles. 'I was the only organic in the room. I signed the approval. I am why he exists. You fighting him is a kindness to me. Even if you lose. Especially if you lose.'",
    consolationReward: { xp: 40, dream: 15, flag: "human_warden_guilt" },
  },
  {
    id: "warlord_defeats_you", narrator: "agent_zero",
    trigger: { type: "combat_lost", opponent: "the_warlord" },
    revelation: "'She killed me once,' Agent Zero's signal sharpens. 'I remember it. The moment the blade went in. Then nothing. Then THIS — this strange signal-life. Her killing you was mercy compared to what she did to me.'",
    consolationReward: { xp: 50, dream: 20, flag: "zero_warlord_memory" },
  },

  // ═══ Quiz wrong answers ═══
  {
    id: "quiz_kael_wrong",
    trigger: { type: "quiz_wrong_answer", questionId: "kael_origin" },
    revelation: "The Game Master's clone chuckles. 'Close! But the truth is more horrifying. Kael volunteered for Project Vector. He BELIEVED he was saving people. He walked into the infection willingly. That's the lesson of his story.'",
    consolationReward: { xp: 10, dream: 3 },
  },

  // ═══ Death revelations ═══
  {
    id: "first_death_necromancer", narrator: "the_necromancer",
    trigger: { type: "death_count", count: 1 },
    revelation: "In the dark between deaths, a voice you don't recognize: 'First time? It gets easier. Or harder. Depends who you become in the meantime.' Then: a glimpse of a castle. Gone before you can hold the image.",
    consolationReward: { xp: 50, dream: 20, flag: "necromancer_first_whisper" },
  },
  {
    id: "tenth_death_reveal", narrator: "the_necromancer",
    trigger: { type: "death_count", count: 10 },
    revelation: "The Necromancer speaks plainly now. 'I've designed these Resurrection Protocols for three millennia. I watch everyone who cycles. Most give up at death five. You're past ten. That makes you interesting. It makes you... eligible.'",
    consolationReward: { xp: 200, dream: 100, flag: "necromancer_noticed_you" },
  },
];

export function getFailureContent(trigger: FailureTrigger): FailureContent | null {
  return FAILURE_CONTENT.find(fc => {
    if (fc.trigger.type !== trigger.type) return false;
    if (fc.trigger.type === "trust_check_failed" && trigger.type === "trust_check_failed") {
      return fc.trigger.npcId === trigger.npcId && trigger.minTrust >= fc.trigger.minTrust;
    }
    if (fc.trigger.type === "puzzle_failed" && trigger.type === "puzzle_failed") {
      return fc.trigger.puzzleId === trigger.puzzleId;
    }
    if (fc.trigger.type === "combat_lost" && trigger.type === "combat_lost") {
      return fc.trigger.opponent === trigger.opponent;
    }
    if (fc.trigger.type === "quiz_wrong_answer" && trigger.type === "quiz_wrong_answer") {
      return fc.trigger.questionId === trigger.questionId;
    }
    if (fc.trigger.type === "death_count" && trigger.type === "death_count") {
      return trigger.count >= fc.trigger.count;
    }
    return false;
  }) || null;
}
