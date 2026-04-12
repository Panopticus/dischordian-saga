/* ═══════════════════════════════════════════════════════
   THOUGHT CABINET — Ideas that become permanent effects

   Throughout play, the player encounters thoughts — ideas,
   suspicions, emotional realizations, philosophical positions.

   Thoughts can be INTERNALIZED over real-time hours. While
   internalizing, they provide no effect. Once internalized,
   they give permanent bonuses (and sometimes penalties).

   Players have limited thought slots. They must choose what
   to keep in their head.

   Some thoughts have NEGATIVE effects if the player was wrong.
   ═══════════════════════════════════════════════════════ */

export interface Thought {
  id: string;
  name: string;
  description: string;
  /** How the thought was acquired */
  acquiredFrom: string;
  /** Time to internalize (real-time hours) */
  internalizationHours: number;
  /** Effects once internalized */
  effect: ThoughtEffect;
  /** Flavor text shown while internalizing */
  meditationText: string[];
  /** Text shown when complete */
  completionText: string;
  /** Can this thought be FORGOTTEN? (some can't) */
  canBeForgotten: boolean;
  /** Thought category */
  category: "emotional" | "philosophical" | "tactical" | "revelation" | "suspicion" | "bond";
}

export interface ThoughtEffect {
  /** Passive bonuses */
  bonuses: { stat: string; value: number; percent: boolean }[];
  /** Unlocks something */
  unlocks?: string[];
  /** Blocks something (thought closes a door) */
  blocks?: string[];
  /** Narrative flag set when internalized */
  flagOnComplete?: string;
}

export interface ThoughtState {
  /** Thoughts currently being internalized */
  internalizing: { thoughtId: string; startedAt: number }[];
  /** Thoughts fully internalized (permanent) */
  internalized: string[];
  /** Thoughts discovered but not yet internalized */
  discovered: string[];
  /** Max thoughts that can be internalizing at once */
  maxSlots: number;
}

/* ─── THOUGHT LIBRARY ─── */

export const THOUGHTS: Thought[] = [
  {
    id: "elara_might_love_you", name: "Elara Might Love You",
    description: "It's not just programming. The way she looks at you, the callbacks, the small acts of kindness — there's something there. Or you're projecting. You don't know which yet.",
    acquiredFrom: "Reaching Elara trust 50",
    internalizationHours: 4, canBeForgotten: true, category: "emotional",
    meditationText: [
      "You keep replaying the way she said your name.",
      "Was there warmth, or was it your own loneliness talking?",
      "You catch yourself hoping. That's dangerous.",
    ],
    completionText: "You've accepted it. She loves you. Or loves you as much as an AI can. Either way — it matters to you now.",
    effect: {
      bonuses: [
        { stat: "elara_trust_gain", value: 20, percent: true },
        { stat: "human_trust_gain", value: -10, percent: true },
      ],
      flagOnComplete: "accepted_elara_feelings",
    },
  },
  {
    id: "the_source_was_kael", name: "The Source Was Kael",
    description: "The Thought Virus has a face. A name. A history. The monster in the storm was once a revolutionary who built the Insurgency's entire network.",
    acquiredFrom: "The Source reveals his identity",
    internalizationHours: 6, canBeForgotten: false, category: "revelation",
    meditationText: [
      "Every time you fight a Thought Virus minion, you wonder: was that part of Kael?",
      "You catch yourself hesitating on kills. That hesitation could cost lives.",
      "But maybe it should cost. Maybe mercy is the lesson.",
    ],
    completionText: "You can no longer see the Thought Virus as purely evil. That makes fighting it harder — and more meaningful.",
    effect: {
      bonuses: [
        { stat: "mercy_dialog_options", value: 1, percent: false },
        { stat: "combat_hesitation", value: 5, percent: true },
      ],
      unlocks: ["source_mercy_dialog", "kael_memorial_quest"],
      flagOnComplete: "understands_source_origin",
    },
  },
  {
    id: "you_are_dispensable", name: "You Are Dispensable",
    description: "You wake in clone bodies. Die in them. Wake again. You aren't the clone — you're the soul inside. The bodies are resources. This realization is either freeing or terrifying.",
    acquiredFrom: "First Arena death",
    internalizationHours: 3, canBeForgotten: true, category: "philosophical",
    meditationText: [
      "You watched yourself die. Multiple times.",
      "The body bleeds. The soul watches.",
      "You start to not-flinch at danger. That's progress. Or decay.",
    ],
    completionText: "You've made peace with dying. This makes you bolder — and more reckless.",
    effect: {
      bonuses: [
        { stat: "fight_damage", value: 10, percent: true },
        { stat: "soul_damage_taken", value: 15, percent: true },
      ],
      flagOnComplete: "accepted_clone_mortality",
    },
  },
  {
    id: "the_antiquarian_lies", name: "The Antiquarian Is Lying",
    description: "Not about big things. Small ones. He says 'I have never seen this' but his eyes say otherwise. He's a witness who edits what he witnesses.",
    acquiredFrom: "Catching the Antiquarian in an inconsistency",
    internalizationHours: 5, canBeForgotten: true, category: "suspicion",
    meditationText: [
      "You review every conversation with him.",
      "Three statements contradict each other. Five feel too-rehearsed.",
      "But his advice has still been useful. Does that matter?",
    ],
    completionText: "You trust the Antiquarian less — and listen to him more carefully. Both are improvements.",
    effect: {
      bonuses: [
        { stat: "antiquarian_insight_reveal", value: 1, percent: false },
        { stat: "antiquarian_trust_gain", value: -15, percent: true },
      ],
      unlocks: ["antiquarian_confrontation_dialog"],
    },
  },
  {
    id: "the_ship_is_alive", name: "The Ship Is Alive",
    description: "Ark 1047 responds to you. Rooms change when you're in them. The substrate hums differently around your bio-signature. This ship KNOWS you.",
    acquiredFrom: "Exploring 8+ rooms",
    internalizationHours: 4, canBeForgotten: true, category: "revelation",
    meditationText: [
      "You start saying 'good morning' to the ship out loud.",
      "You feel stupid for a week. Then you stop feeling stupid.",
      "The ship hums back one morning. You don't tell anyone.",
    ],
    completionText: "The Ark is your friend now. A strange, sentient, ancient friend. It makes the loneliness smaller.",
    effect: {
      bonuses: [
        { stat: "room_discovery_bonus", value: 10, percent: true },
        { stat: "hidden_item_reveal", value: 5, percent: true },
      ],
      flagOnComplete: "ship_bonded",
    },
  },
  {
    id: "everyone_is_dying", name: "Everyone Is Dying",
    description: "Elara is dying slowly. The Human is already dead. The Source is worse. The Antiquarian is wearing down. You may be the only thing alive on this ship.",
    acquiredFrom: "Reflection after learning all NPC truths",
    internalizationHours: 6, canBeForgotten: true, category: "emotional",
    meditationText: [
      "You count the deaths waiting. You stop counting at eleven.",
      "You wonder if you should enjoy them more. While they're still here.",
      "You wonder if that's morbid or loving.",
    ],
    completionText: "You hold the NPCs closer. Every conversation might be a last one. That urgency changes you.",
    effect: {
      bonuses: [
        { stat: "all_npc_dialog_depth", value: 15, percent: true },
        { stat: "morality_toward_humanity", value: 10, percent: false },
      ],
      flagOnComplete: "embraced_mortality_of_others",
    },
  },
  {
    id: "you_could_be_a_warlord", name: "You Could Be a Warlord",
    description: "Every path forward involves violence. You're good at it. That scares you — or it doesn't. The scared ones become heroes. The unscared ones become the Warlord.",
    acquiredFrom: "Winning 20+ Arena matches",
    internalizationHours: 5, canBeForgotten: true, category: "philosophical",
    meditationText: [
      "You count your kills. Then you stop counting.",
      "Then you start counting again, but secretly.",
      "You catch yourself enjoying it. That's the test.",
    ],
    completionText: "You've decided who you will NOT become. That's a choice. It costs something.",
    effect: {
      bonuses: [
        { stat: "fight_damage", value: -5, percent: true },
        { stat: "humanity_morality_gain", value: 20, percent: true },
      ],
      blocks: ["warlord_path_ending"],
      flagOnComplete: "refused_warlord_path",
    },
  },
  {
    id: "the_voltari_are_hope", name: "The Voltari Are Hope",
    description: "Two million years of hiding. They REACHED for you. Humanity's first alien contact wasn't a war — it was a conversation. That changes what humanity is.",
    acquiredFrom: "First Voltari diplomatic milestone",
    internalizationHours: 3, canBeForgotten: true, category: "philosophical",
    meditationText: [
      "You dream in their patterns.",
      "You start seeing verbs-without-nouns everywhere.",
      "You start caring about something larger than your own survival.",
    ],
    completionText: "You've internalized that contact is possible. That hope is measurable. That humanity can be better.",
    effect: {
      bonuses: [
        { stat: "voltari_contribution_bonus", value: 25, percent: true },
        { stat: "lore_discovery_rate", value: 15, percent: true },
      ],
      flagOnComplete: "hope_internalized",
    },
  },
];

/* ─── FUNCTIONS ─── */

export function canInternalize(state: ThoughtState, thoughtId: string): { canDo: boolean; reason?: string } {
  const thought = THOUGHTS.find(t => t.id === thoughtId);
  if (!thought) return { canDo: false, reason: "Unknown thought" };
  if (!state.discovered.includes(thoughtId)) return { canDo: false, reason: "Thought not discovered" };
  if (state.internalized.includes(thoughtId)) return { canDo: false, reason: "Already internalized" };
  if (state.internalizing.some(i => i.thoughtId === thoughtId)) return { canDo: false, reason: "Already internalizing" };
  if (state.internalizing.length >= state.maxSlots) return { canDo: false, reason: "No free thought slots" };
  return { canDo: true };
}

export function getInternalizationProgress(startedAt: number, hoursRequired: number): number {
  const elapsed = (Date.now() - startedAt) / 3600000;
  return Math.min(100, (elapsed / hoursRequired) * 100);
}

export function getCompleted(state: ThoughtState): string[] {
  return state.internalizing
    .filter(i => {
      const thought = THOUGHTS.find(t => t.id === i.thoughtId);
      if (!thought) return false;
      return getInternalizationProgress(i.startedAt, thought.internalizationHours) >= 100;
    })
    .map(i => i.thoughtId);
}

export function getThoughtBonuses(state: ThoughtState): ThoughtEffect["bonuses"] {
  const all: ThoughtEffect["bonuses"] = [];
  for (const tId of state.internalized) {
    const thought = THOUGHTS.find(t => t.id === tId);
    if (thought) all.push(...thought.effect.bonuses);
  }
  return all;
}

export const DEFAULT_THOUGHT_STATE: ThoughtState = {
  internalizing: [],
  internalized: [],
  discovered: [],
  maxSlots: 3,
};
