/* ═══════════════════════════════════════════════════════
   APPRENTICE CHANNELED LINES — Engineer-Domain Tutorial Layer

   When a tutorial fires for an Engineer-domain system (deck
   builder depth, crafting, research lab, expansion drops,
   bench mechanics), the player's currently-bonded Apprentice
   speaks the lines instead of the Engineer himself. The
   Engineer is dead. His teaching has to come through someone
   alive — and the Apprentice he was training is the only
   conduit.

   The mechanic:
     1. The Apprentice delivers the line in their archetype's
        voice (per ARCHETYPES in apprentices.ts).
     2. Mid-line, sometimes a phrase comes out that is
        *not* in their voice. They don't quite notice. The
        player notices. Elara sometimes overlays:
        "That phrasing was his."
     3. By Act 6, the Apprentice begins to suspect. By Act 7,
        they inherit the goggles.

   This file maps Engineer-domain TutorTopic IDs to a set of
   channeled-line variants per archetype. Authors writing new
   Engineer-domain tutorial gates pick a topic, write a base
   line, and (optionally) supply a "channeled phrase" — a
   short fragment that is the Engineer's voice slipping
   through. If no channeled phrase is supplied, the engine
   uses the default Engineer-isms in DEFAULT_ENGINEER_TICS.

   See plan §4 (The Apprentice as Living Engineer Conduit).
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

/** Engineer-domain topics that route through the Apprentice. */
export type EngineerDomainTopic =
  | "deck_builder_intro"
  | "deck_builder_curve"
  | "deck_builder_synergy"
  | "deck_builder_slot_optim"
  | "crafting_imprint_laser"
  | "crafting_index_wall"
  | "crafting_binder_clasp"
  | "research_lab_essence"
  | "expansion_drops_fabricate"
  | "bench_three_frequencies"
  | "goggles_inherited";

export interface ChanneledLineVariant {
  /** The base spoken text in the Apprentice's archetype voice. */
  readonly base: string;
  /**
   * Optional Engineer-voice phrase that the Apprentice utters mid-line
   * without realizing. Authors should write a fragment that sounds
   * unmistakably like the Engineer (dry, plain, slightly self-deprecating).
   * If omitted, the engine substitutes from DEFAULT_ENGINEER_TICS at runtime.
   */
  readonly channeledPhrase?: string;
  /**
   * Optional Elara overlay line. Fires AFTER the channeledPhrase if
   * the player's bond with the Apprentice is high enough that Elara
   * deems the slip worth flagging. Empty string = no overlay.
   */
  readonly elaraOverlay?: string;
}

export interface ChanneledTopic {
  readonly topic: EngineerDomainTopic;
  /** Tutorial gate this topic primarily attaches to (free-form id). */
  readonly tutorialGateId: string;
  /**
   * Per-archetype variants. Falls back to a default if the player's
   * apprentice archetype is not listed.
   */
  readonly variants: Readonly<Partial<Record<ApprenticeArchetype, ChanneledLineVariant>>>;
  /**
   * The default delivery used when the apprentice's archetype is not
   * explicitly listed. Required.
   */
  readonly fallback: ChanneledLineVariant;
}

/** Stock Engineer-isms used when an author hasn't supplied a custom channeledPhrase. */
export const DEFAULT_ENGINEER_TICS: readonly string[] = Object.freeze([
  "clamp the binder before you imprint",
  "the bench hums in three frequencies",
  "the Deck remembers, that's enough",
  "I should not have built this",
  "you're already faster than the last one",
  "tools become weapons the moment someone takes them from the person they were built for",
]);

/**
 * Self-aware-pause line the Apprentice can deliver after a channeled
 * phrase. These are universal — any archetype can say them. The
 * delivery engine inserts at most one per scene.
 */
export const APPRENTICE_AWARE_PAUSES: readonly string[] = Object.freeze([
  "…I don't know why I know this.",
  "…huh. He used to say that. I think.",
  "…sorry. Got distracted. Where was I?",
  "…that wasn't me. Was it?",
]);

/* ─── TOPIC MAP ─── */

export const CHANNELED_TOPICS: readonly ChanneledTopic[] = [
  {
    topic: "deck_builder_intro",
    tutorialGateId: "tutor_deck_builder_intro",
    variants: {
      artisan: {
        base: "Right. The Deck. You sit, you breathe, you place the first card. There's a rhythm.",
        channeledPhrase: "the Deck remembers, that's enough",
        elaraOverlay: "That phrasing was his.",
      },
      scholar: {
        base: "The Deck is a constrained graph. Forty edges, twelve vertices, one mana curve. We start here.",
        channeledPhrase: "the bench hums in three frequencies",
      },
      ghost: {
        base: "Sit. Breathe. Cards.",
        channeledPhrase: "the Deck remembers",
      },
    },
    fallback: {
      base: "We start with the Deck. It's a small Ark. Everything else is just bigger Arks.",
      channeledPhrase: "everything else is just bigger Arks",
      elaraOverlay: "He used to say that. Word for word.",
    },
  },
  {
    topic: "deck_builder_curve",
    tutorialGateId: "tutor_deck_builder_curve",
    variants: {
      scholar: {
        base: "Mana curve. Two-drops, three-drops, four-drops. The shape is the discipline.",
        channeledPhrase: "the shape is the discipline",
      },
      artisan: {
        base: "You don't fight the curve. You ride it. Cheap on the bottom, payoff on top.",
      },
    },
    fallback: {
      base: "Cheap cards early, expensive cards late. The curve is your spine.",
      channeledPhrase: "the curve is your spine",
    },
  },
  {
    topic: "deck_builder_synergy",
    tutorialGateId: "tutor_deck_builder_synergy",
    variants: {
      oracle: {
        base: "Two cards that hum together do more than two cards. Listen for the hum.",
        channeledPhrase: "listen for the hum",
        elaraOverlay: "That was his bench rule. I haven't heard it since.",
      },
    },
    fallback: {
      base: "Two cards that talk to each other are stronger than two cards that don't. Build conversations.",
      channeledPhrase: "build conversations",
    },
  },
  {
    topic: "deck_builder_slot_optim",
    tutorialGateId: "tutor_deck_builder_slot_optim",
    variants: {
      artisan: {
        base: "Forty slots. Every slot pays rent. If a card isn't paying, it isn't living there.",
        channeledPhrase: "every slot pays rent",
      },
    },
    fallback: {
      base: "Forty cards. No more, no less. Each one earns its seat.",
      channeledPhrase: "each one earns its seat",
    },
  },
  {
    topic: "crafting_imprint_laser",
    tutorialGateId: "tutor_crafting_imprint_laser",
    variants: {
      artisan: {
        base: "The imprint laser. Steady hand. Don't blink at the wrong moment — the binder catches it.",
        channeledPhrase: "clamp the binder before you imprint",
        elaraOverlay: "That phrasing was his.",
      },
    },
    fallback: {
      base: "Imprint laser, binder, finished card. In that order. Always in that order.",
      channeledPhrase: "clamp the binder before you imprint",
    },
  },
  {
    topic: "crafting_index_wall",
    tutorialGateId: "tutor_crafting_index_wall",
    variants: {},
    fallback: {
      base: "The index wall is the bench's memory. Anything you make goes up there. Anything up there can come back down.",
      channeledPhrase: "the bench's memory",
    },
  },
  {
    topic: "crafting_binder_clasp",
    tutorialGateId: "tutor_crafting_binder_clasp",
    variants: {},
    fallback: {
      base: "Binder clasp. Click, then quarter-turn. If it's loose, the imprint smudges and you start over.",
      channeledPhrase: "click, then quarter-turn",
    },
  },
  {
    topic: "research_lab_essence",
    tutorialGateId: "tutor_research_lab_essence",
    variants: {
      scholar: {
        base: "Essence harvest. Each puzzle node is a constraint; you solve constraints, you yield essence.",
        channeledPhrase: "constraints become essence",
      },
    },
    fallback: {
      base: "Click the right nodes in the right order. Essence drops out the bottom. The bench drinks it.",
      channeledPhrase: "the bench drinks it",
    },
  },
  {
    topic: "expansion_drops_fabricate",
    tutorialGateId: "tutor_expansion_drops_fabricate",
    variants: {},
    fallback: {
      base: "The drop is fabricated, not pulled. We make it from what's been imprinted. Nothing comes from nothing.",
      channeledPhrase: "nothing comes from nothing",
    },
  },
  {
    topic: "bench_three_frequencies",
    tutorialGateId: "tutor_bench_three_frequencies",
    variants: {},
    fallback: {
      base: "The bench hums in three frequencies. The first is his. The second is the Seer's. The third is yours — it doesn't know the note until you play your first card.",
      channeledPhrase: "the third is yours",
      elaraOverlay: "He left that line for you. Word for word. He always knew you'd be here.",
    },
  },
  {
    topic: "goggles_inherited",
    tutorialGateId: "tutor_goggles_inherited",
    variants: {},
    fallback: {
      base: "These were his. He wore them once, in the courtyard at Celebration, after the chess match. He told me to give them to whoever finishes the bench. I think that's both of us, now.",
      channeledPhrase: "whoever finishes the bench",
      elaraOverlay: "That was the line he made me promise to relay. Verbatim. Now it's said.",
    },
  },
];

/* ─── LOOKUP HELPERS ─── */

export function getChanneledTopic(topic: EngineerDomainTopic): ChanneledTopic | undefined {
  return CHANNELED_TOPICS.find((t) => t.topic === topic);
}

export function resolveVariant(
  topic: EngineerDomainTopic,
  archetype: ApprenticeArchetype,
): ChanneledLineVariant {
  const def = getChanneledTopic(topic);
  if (!def) {
    throw new Error(`No channeled topic registered for "${topic}"`);
  }
  return def.variants[archetype] ?? def.fallback;
}

/**
 * Pick a self-aware pause line. Caller is responsible for limiting to one
 * pause per scene. Index is deterministic by topic + archetype so replays
 * are stable.
 */
export function pickAwarePause(
  topic: EngineerDomainTopic,
  archetype: ApprenticeArchetype,
): string {
  const seed = topic.length * 31 + archetype.length;
  return APPRENTICE_AWARE_PAUSES[seed % APPRENTICE_AWARE_PAUSES.length]!;
}
