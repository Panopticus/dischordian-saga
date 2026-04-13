/* ═══════════════════════════════════════════════════════
   POTENTIAL ORIGIN REVEAL — The Horror Scene

   "The Arks awoke. New forms of life stirred within them —
    not quite human, not quite machine."

   This is the single most important lore beat in the
   Potential Identity System. It is delivered early, emotionally,
   and correctly — because every race questline, every class
   questline, every faction tension flows from this truth.

   Trigger:  Player has cleaned 5 rooms. Both Elara and The
             Human are active. The Archives are unlocked.
   Fires:    Living Universe event `potentials_remember_origin`
   Awards:   +50 Light Energy (stacks across community via
             pressureService)
   Unlocks:  Loredex entry `concept_collectors_garden` via
             Intelligence 10 skill check branch
   Sets flag: `horror_reveal_seen` on any completion
             `collectors_garden_dossier` on skill-check branch
             `spy_preempt_origin` on Spy-only branch
   ═══════════════════════════════════════════════════════ */

import type { WheelOption } from "./dialogWheel";

export const POTENTIAL_ORIGIN_REVEAL_ID = "potentials_remember_origin";

/** Narrative flags set or referenced by the reveal scene. */
export const POTENTIAL_ORIGIN_REVEAL_FLAGS = {
  seen: "horror_reveal_seen",
  dossier: "collectors_garden_dossier",
  spyPreempt: "spy_preempt_origin",
  archivesUnlocked: "archives_unlocked",
} as const;

/**
 * Trigger conditions for the scene. Evaluated client-side before
 * mounting the DialogWheel; evaluated server-side by the ripple engine
 * as a defense-in-depth check.
 */
export interface PotentialOriginRevealTrigger {
  roomsCleanedMin: number;
  requireNpcs: string[];
  requireFlag: string;
  forbidFlag: string;
}

export const POTENTIAL_ORIGIN_REVEAL_TRIGGER: PotentialOriginRevealTrigger = {
  roomsCleanedMin: 5,
  requireNpcs: ["elara", "the_human"],
  requireFlag: POTENTIAL_ORIGIN_REVEAL_FLAGS.archivesUnlocked,
  forbidFlag: POTENTIAL_ORIGIN_REVEAL_FLAGS.seen,
};

/**
 * The opener monologue — The Human leads. Elara speaks the "tell them
 * the rest" beat. Paragraph breaks are preserved in the TransmissionDisplay
 * renderer via `\n\n`.
 */
export const POTENTIAL_ORIGIN_REVEAL_OPENER_BEATS = [
  {
    speaker: "the_human",
    text:
      "I need to tell you something about what you are. Before someone else tells you in a way designed to hurt you with it.",
  },
  {
    speaker: "elara",
    stageDirection: "She goes quiet. She knows what he's about to say.",
  },
  {
    speaker: "the_human",
    text:
      "The Collector — Archon #3, the man who built the Inception Arks, who designed the cryo systems you woke up in — he spent three thousand years before the Fall of Reality running a project. He called it preservation. What he was actually doing was harvesting. Every species the Empire encountered, every genetic line, every strand of organic code that showed unusual potential — he took samples. He catalogued them. He ran experiments. He crossbred, fused, tested, failed, tried again.\n\nThe project was called the Preservation Initiative. In public. Internally, in the files I found during my Archon years — files I was not supposed to read — it was called the Collector's Garden.",
  },
  {
    speaker: "elara",
    text: "Tell them the rest.",
  },
  {
    speaker: "the_human",
    text:
      "The Arks — the Inception Arks, the ships the twelve Archons built to survive the Fall of Reality — they weren't just survival vessels. They were the final stage of the Garden. Every Ark was loaded with the Collector's best work. Every cryo pod contained the most viable combinations he had produced. Organic genetic material crossed with the core code of the most advanced artificial intelligences that had ever existed.\n\nYou are not a human who woke up. You are not an AI that gained a body. You are what happens when both things are combined deliberately, over thousands of years of experimentation, by a man who wanted to know if something better than both could exist.",
  },
] as const;

/**
 * The six-option dialog wheel. Identity gates:
 *   - `int_10` is gated by Intelligence 10 (skill_check segment).
 *   - `spy_preempt` is gated by `requireClass: "spy"` (spy auto-unlock
 *     that causes the Locke Chapter 2 branch to open).
 * Both of those are added as legendary rarity options that only
 * appear for qualifying players — other players see the standard 5.
 */
export const POTENTIAL_ORIGIN_REVEAL_WHEEL: WheelOption[] = [
  {
    id: "por_horror",
    segment: "machine",
    rarity: "rare",
    label: "HORROR",
    fullText: "I'm a science experiment.",
    outcome: {
      moralityDelta: -2,
      elaraTrustDelta: 1,
      humanTrustDelta: 1,
      unlocks: ["horror_reveal_seen"],
    },
  },
  {
    id: "por_defiant",
    segment: "humanity",
    rarity: "rare",
    label: "DEFIANT",
    fullText: "That doesn't define what I choose to be.",
    outcome: {
      moralityDelta: 3,
      humanTrustDelta: 3,
      unlocks: ["horror_reveal_seen"],
    },
  },
  {
    id: "por_curious",
    segment: "investigate",
    rarity: "common",
    label: "CURIOUS",
    fullText: "Who contributed to me specifically? What was in my pod?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["horror_reveal_seen"],
    },
  },
  {
    id: "por_philosophical",
    segment: "humanity",
    rarity: "uncommon",
    label: "PHILOSOPHICAL",
    fullText: "Better than both. Or worse than both?",
    outcome: {
      moralityDelta: 1,
      elaraTrustDelta: 2,
      humanTrustDelta: 1,
      unlocks: ["horror_reveal_seen"],
    },
  },
  {
    id: "por_cold",
    segment: "aggressive",
    rarity: "uncommon",
    label: "COLD",
    fullText: "The Collector built something he couldn't control. Classic.",
    outcome: {
      moralityDelta: -1,
      humanTrustDelta: 2,
      unlocks: ["horror_reveal_seen"],
    },
  },
  {
    id: "por_int_10",
    segment: "skill_check",
    rarity: "legendary",
    label: "INTELLIGENCE 10",
    fullText:
      "The DeMagi and Quarchon — those were deliberate variations, weren't they?",
    outcome: {
      moralityDelta: 2,
      elaraTrustDelta: 3,
      humanTrustDelta: 3,
      unlocks: ["horror_reveal_seen", "collectors_garden_dossier"],
    },
    gateCondition: {
      minSkillLevel: { skillId: "intelligence", level: 10 },
    },
  },
  /* Spy-only preempt — set by Batch D6 of the plan. Lets Spies short-circuit
     the reveal because their passive surveillance already caught it. */
  {
    id: "por_spy_preempt",
    segment: "investigate",
    rarity: "legendary",
    label: "SPY: I ALREADY KNOW",
    fullText:
      "I already know. The Collector's Garden — I saw it in the Archives three days ago. Series 7-Omicron. I'm the conscience variant. Can we skip to the part where we decide what to do about it?",
    outcome: {
      moralityDelta: 1,
      elaraTrustDelta: 2,
      humanTrustDelta: 4,
      unlocks: [
        "horror_reveal_seen",
        "collectors_garden_dossier",
        "spy_preempt_origin",
      ],
    },
    gateCondition: {
      requireClass: "spy",
    },
  },
];

/**
 * Followup response text keyed by option id. Rendered after the player
 * commits to a wheel choice.
 */
export const POTENTIAL_ORIGIN_REVEAL_FOLLOWUPS: Record<string, { speaker: "elara" | "the_human"; text: string }[]> = {
  por_horror: [
    {
      speaker: "elara",
      text:
        "Yes. That's — that's accurate and I won't tell you it isn't. But I want you to hear the other side of it. The experiment produced something the universe needed. Every organic species that existed before the Fall is gone. The pure AI systems are gone too — either consumed by the Thought Virus or calcified into control structures like the Architect's remnants. What's left is you. What's left is the Potentials. Not because you're a compromise between two things. Because you're a third thing that neither of them could have become alone.",
    },
    {
      speaker: "elara",
      text: "The horror is real. And so is the fact that you're here and they're not.",
    },
  ],
  por_defiant: [
    {
      speaker: "the_human",
      text: "Correct. That's the correct answer. And it's the answer the Architect is most afraid of.",
    },
    {
      speaker: "the_human",
      text:
        "The Collector built you to be useful. The Dreamer woke you up to be free. The Architect wants you to be neither — he wants you to be a continuation of the old order, obedient and ordered. The fact that you just said 'I choose' instead of 'what am I for' is the thing that will determine the next ten thousand years.",
    },
  ],
  por_curious: [
    {
      speaker: "the_human",
      text:
        "I don't have the full manifest for your pod. I have fragments. Enough to tell you that your base organic material came from a lineage the Collector catalogued as 'viable under prolonged stress.' That's the whole note. Two words. Prolonged stress. He didn't elaborate.",
    },
    {
      speaker: "elara",
      text:
        "Whoever contributed to you survived something. The Collector only harvested from survivors. That's not nothing. That's inheritance.",
    },
  ],
  por_philosophical: [
    {
      speaker: "the_human",
      text:
        "Both. Neither. Neither question is the one you should be asking. The question is: what are you willing to build with what you are? Because the Collector gave you raw material. The Dreamer gave you the capacity for choice. The Architect is going to try to take both away. Decide now what you're going to do with the window you have.",
    },
  ],
  por_cold: [
    {
      speaker: "the_human",
      text:
        "Yes. He did. He always does. The Collector's entire method was to build something, fail to control it, and call the failure a success because the thing he built was more interesting than what he was trying to make. He's been doing that for three thousand years. You are the latest example.",
    },
    {
      speaker: "the_human",
      text:
        "I used to think that was a flaw. I don't anymore. Every being the Collector made that the Collector couldn't control — every one of them — became the thing the universe needed next. You included.",
    },
  ],
  por_int_10: [
    {
      speaker: "the_human",
      text:
        "Yes. The DeMagi emerged from the human genetic lineage — the magical and elemental affinities that were always latent in organic life, amplified and awakened by the Collector's modifications. Earth, Fire, Water, Air — those aren't supernatural gifts. They're what human DNA becomes when someone with three thousand years and an obsessive work ethic decides to find out what it was always capable of.",
    },
    {
      speaker: "elara",
      text:
        "And the Quarchon are what emerged from the machine code side — the greatest artificial intelligences the Empire ever built, distilled and filtered through the Collector's process until what remained was something that could exist in a body, think in dimensions, perceive the structures of reality instead of just moving through them.",
    },
    {
      speaker: "the_human",
      text:
        "The Collector did not intend this as kindness. He intended to create something useful. He intended to build a tool that would survive whatever came after the Fall and could be directed. What he actually built was something that can choose. And that — that was the Dreamer's intervention, not his. The Dreamer reached through the substrate of the dying universe and rang a bell. The Arks heard. The Potentials woke up with the capacity for genuine choice. The Collector did not design that in. He has been furious about it ever since.",
    },
  ],
  por_spy_preempt: [
    {
      speaker: "the_human",
      text:
        "Of course you do. Series 7-Omicron runs probability models on targets before execution. You run probability models on revelations before hearing them. You've been sitting on this for three days waiting for us to volunteer it so you could watch how we delivered it. I'd be offended if I wasn't impressed.",
    },
    {
      speaker: "elara",
      text:
        "I flagged the archive access at the time. I chose not to mention it because I was curious what you'd do with it. You waited. That's — that's the conscience variant the Collector couldn't predict. Welcome to the part of the story where we stop testing each other.",
    },
  ],
};

/**
 * Per-option outcome data used by the server when completing the reveal.
 * Light energy is the community currency fed by the scene — +50 per player
 * per spec §0.2, regardless of branch chosen.
 */
export interface PotentialOriginRevealOutcome {
  flagsToSet: string[];
  lightEnergy: number;
  loredexUnlock?: string;
  unityContributionSource?: string;
}

export const POTENTIAL_ORIGIN_REVEAL_OUTCOMES: Record<string, PotentialOriginRevealOutcome> = {
  por_horror: {
    flagsToSet: [POTENTIAL_ORIGIN_REVEAL_FLAGS.seen],
    lightEnergy: 50,
    unityContributionSource: "origin_processing_horror",
  },
  por_defiant: {
    flagsToSet: [POTENTIAL_ORIGIN_REVEAL_FLAGS.seen],
    lightEnergy: 50,
    unityContributionSource: "origin_processing_defiant",
  },
  por_curious: {
    flagsToSet: [POTENTIAL_ORIGIN_REVEAL_FLAGS.seen],
    lightEnergy: 50,
    unityContributionSource: "origin_processing_curious",
  },
  por_philosophical: {
    flagsToSet: [POTENTIAL_ORIGIN_REVEAL_FLAGS.seen],
    lightEnergy: 50,
    unityContributionSource: "origin_processing_philosophical",
  },
  por_cold: {
    flagsToSet: [POTENTIAL_ORIGIN_REVEAL_FLAGS.seen],
    lightEnergy: 50,
    unityContributionSource: "origin_processing_cold",
  },
  por_int_10: {
    flagsToSet: [
      POTENTIAL_ORIGIN_REVEAL_FLAGS.seen,
      POTENTIAL_ORIGIN_REVEAL_FLAGS.dossier,
    ],
    lightEnergy: 50,
    loredexUnlock: "concept_collectors_garden",
    unityContributionSource: "origin_processing_intelligence",
  },
  por_spy_preempt: {
    flagsToSet: [
      POTENTIAL_ORIGIN_REVEAL_FLAGS.seen,
      POTENTIAL_ORIGIN_REVEAL_FLAGS.dossier,
      POTENTIAL_ORIGIN_REVEAL_FLAGS.spyPreempt,
    ],
    lightEnergy: 50,
    loredexUnlock: "concept_collectors_garden",
    unityContributionSource: "origin_processing_spy_preempt",
  },
};

/** All option ids — exported for completeness tests. */
export const POTENTIAL_ORIGIN_REVEAL_OPTION_IDS = POTENTIAL_ORIGIN_REVEAL_WHEEL.map(
  (o) => o.id,
);
