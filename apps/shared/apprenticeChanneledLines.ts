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
      zealot: {
        base: "The Deck is a covenant. Forty cards. Forty witnesses. Forty pieces of the Engineer's mind, copied forward through us.",
        channeledPhrase: "the Deck remembers, that's enough",
        elaraOverlay: "He never used the word covenant. You just did. He'd have liked it.",
      },
      revenant: {
        base: "I knew this bench. Before. The bench knew me back. We start where I left off — wherever that was.",
        channeledPhrase: "the Deck remembers",
        elaraOverlay: "I'm not going to ask whose memory that was. Word for word, his — but the cadence is yours.",
      },
      wanderer: {
        base: "I learned a deck like this on Vora. Different cards, same shape. Forty slots. Mana curve. The bones are universal — that's why I never stayed long enough to master one.",
        channeledPhrase: "everything else is just bigger Arks",
      },
      martyr: {
        base: "Sorry — I'll go slowly. Forty cards, mana curve, the rest follows. Tell me if I'm rushing. I'd rather you understood than I felt useful.",
        channeledPhrase: "the Deck remembers, that's enough",
      },
      heretic: {
        base: "They'll tell you the Deck is a graph. They'll tell you it's a covenant. Both readings are partial. The Deck is a sentence you're writing one word at a time, and the cards are the only vocabulary you've been given. Argue with the vocabulary later. Place a card now.",
        channeledPhrase: "the Deck remembers",
      },
      jester: {
        base: "Forty cards. No more, no less. Try to sneak in a forty-first; the bench laughs at you. I have tried. The bench has laughed at me. Place a card.",
        channeledPhrase: "everything else is just bigger Arks",
        elaraOverlay: "He laughed twice in his whole life. Once at me. Once at this exact joke. You'd have liked him.",
      },
      sentinel: {
        base: "Position first. Read the field. Place a card you can defend, not one you fall in love with. The Deck rewards patience the way a wall rewards bricks.",
        channeledPhrase: "the bench hums in three frequencies",
      },
      prodigal: {
        base: "I left this bench once. I came back. Most do. The Deck doesn't keep score on absence. Sit. Where were we.",
        channeledPhrase: "the Deck remembers",
        elaraOverlay: "He waited for you. That phrasing was his — the bench remembers absence too.",
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
      revenant: {
        base: "The curve is a slope I have walked before, in some other version of this bench. Two-drops are forgiving. Five-drops are not. Climb in order.",
        channeledPhrase: "the curve is your spine",
      },
      wanderer: {
        base: "Every deck I've ever played, every world I've drifted through — same curve. Cheap early, big late. The shape is the only thing that travels.",
      },
      sentinel: {
        base: "The curve is your defensive line. Skip a tier and a turn opens. Don't skip a tier.",
      },
      heretic: {
        base: "The curve is correct because everyone else uses it. That is a reason. It is not the only reason. Build the curve first. Question it after you've won three matches with it.",
      },
      jester: {
        base: "Mana curve. Cheap, medium, expensive. Like a menu. Don't order all dessert. The bench will find out and the bench will judge you.",
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
      heretic: {
        base: "Most decks have one or two pairs that work. Mine has eleven. The orthodoxy says that is too many. The orthodoxy has not played my deck.",
        channeledPhrase: "build conversations",
      },
      martyr: {
        base: "I like cards that protect each other. Sorry — I know that's not optimal. It's just what I keep building. Two cards that take hits for one another. The Deck pays for it. I pay for it. It's worth it.",
        channeledPhrase: "build conversations",
      },
      revenant: {
        base: "Synergies travel between cycles. A pair I built once stays paired in my hand even when the cards have changed. The bench remembers — and so do I.",
        channeledPhrase: "listen for the hum",
      },
      wanderer: {
        base: "I keep finding the same two-card combo across worlds. Different art, different name, same hum. Synergy is the part of the game that never lets you stay alone.",
        channeledPhrase: "listen for the hum",
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
      ghost: {
        base: "Cut the slot. Don't apologize. The card was sentimental. Sentimental costs you a turn.",
      },
      jester: {
        base: "Eviction notice. Slot thirty-seven, you're out. You haven't carried your weight since the second match. The Deck has standards. The Deck has limits. The Deck has, frankly, a lawyer.",
        channeledPhrase: "every slot pays rent",
      },
      sentinel: {
        base: "Each slot is a watch post. Empty posts get overrun. Card-with-a-job, every slot. Audit before each match.",
      },
      prodigal: {
        base: "I keep one slot for a card that reminds me of who I used to be. The Deck tolerates it because the Deck is generous. Don't tell anyone.",
        channeledPhrase: "each one earns its seat",
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
      scholar: {
        base: "The laser writes at sub-micron resolution. Your hand will tremble. The bench compensates if you trust it. The bench cannot compensate for blinking. Don't blink.",
        channeledPhrase: "clamp the binder before you imprint",
      },
      sentinel: {
        base: "Steady. Brace your elbow. Hand on the binder, not the laser. The binder is what you're guarding; the laser is just the noise.",
        channeledPhrase: "clamp the binder before you imprint",
      },
      revenant: {
        base: "I have done this before. My hand remembers what my mind doesn't. Watch — the laser arc settles into the binder if you wait through the third pulse. Three pulses. Then steady.",
        channeledPhrase: "clamp the binder before you imprint",
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
    variants: {
      scholar: {
        base: "The index wall is a hash table. Each peg is a key. Each card hung from a peg is a value. Lookups are O(1). The bench is, in this respect, more thoughtful than most teachers I have had.",
        channeledPhrase: "the bench's memory",
      },
      revenant: {
        base: "I see entries on the wall I do not remember pinning. The bench keeps versions of me I have forgotten. I leave them up. They might want to come back.",
        channeledPhrase: "the bench's memory",
      },
      oracle: {
        base: "The wall is an archive. Treat each entry like a vintage. Date the pin. Don't move pins without writing down where they were. The bench prefers ceremony over speed.",
        channeledPhrase: "the bench's memory",
      },
    },
    fallback: {
      base: "The index wall is the bench's memory. Anything you make goes up there. Anything up there can come back down.",
      channeledPhrase: "the bench's memory",
    },
  },
  {
    topic: "crafting_binder_clasp",
    tutorialGateId: "tutor_crafting_binder_clasp",
    variants: {
      ghost: {
        base: "Click. Quarter-turn. If it's loose, you'll know — the bench dims. Watch the bench, not the clasp.",
        channeledPhrase: "click, then quarter-turn",
      },
      sentinel: {
        base: "Clasp is the most failure-prone part. Three checks: click, turn, listen. If you don't hear the small chime on the turn, restart.",
        channeledPhrase: "click, then quarter-turn",
      },
      martyr: {
        base: "I'll do it for you the first few times if you want — sorry, I know you'd rather learn. Just — click first, then quarter-turn. Don't push, just pivot. Forgive yourself if you smudge it. The Deck forgives the binder. So can you.",
        channeledPhrase: "click, then quarter-turn",
      },
    },
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
      oracle: {
        base: "Some nodes are obvious. Some are obvious only after. Choose obvious-after when you can — the essence is denser there.",
        channeledPhrase: "the bench drinks it",
      },
      heretic: {
        base: "The right answer to the puzzle is the answer that yields the most essence. Most students confuse the puzzle's question with their own. Don't. The bench is paying you. Bill it correctly.",
        channeledPhrase: "constraints become essence",
      },
      zealot: {
        base: "Each constraint solved is a small grace. Each yield of essence is the bench thanking you. Solve. Yield. Repeat.",
        channeledPhrase: "the bench drinks it",
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
    variants: {
      wanderer: {
        base: "Every drop is a place. The art comes from somewhere. The cards come from somewhere. Pull a drop, you're collaborating with a world that hasn't asked your permission yet.",
        channeledPhrase: "nothing comes from nothing",
      },
      oracle: {
        base: "Drops are foreclosed timelines, fabricated to be legible. Each card is a trace of an outcome that didn't happen. The fabrication is the gift. Nothing comes from nothing — but a great deal comes from what was nearly something.",
        channeledPhrase: "nothing comes from nothing",
      },
      scholar: {
        base: "The drop is procedurally generated against a seed. The seed is your imprint history plus the bench's resin signature plus the day's network state. Three inputs. One drop. Reproducibility is, frustratingly, not a feature.",
        channeledPhrase: "nothing comes from nothing",
      },
    },
    fallback: {
      base: "The drop is fabricated, not pulled. We make it from what's been imprinted. Nothing comes from nothing.",
      channeledPhrase: "nothing comes from nothing",
    },
  },
  {
    topic: "bench_three_frequencies",
    tutorialGateId: "tutor_bench_three_frequencies",
    variants: {
      oracle: {
        base: "Three frequencies. I have heard two of them since I was small — his, and the Seer's. The third I have heard only once, the night you held the binder for the first time. It was yours. It still is.",
        channeledPhrase: "the third is yours",
        elaraOverlay: "He never met you and he wrote that line for you. I don't know how. I stopped asking how about him.",
      },
      ghost: {
        base: "Three. His. Hers. Yours. Listen.",
        channeledPhrase: "the third is yours",
      },
      martyr: {
        base: "I — sorry — I think I've heard the third frequency. I didn't want to say. It would mean I'm meant to inherit something, and I haven't decided I deserve it. The bench keeps humming anyway. I think it disagrees with me.",
        channeledPhrase: "the third is yours",
        elaraOverlay: "It does disagree with you. So do I. Sorry to gang up.",
      },
    },
    fallback: {
      base: "The bench hums in three frequencies. The first is his. The second is the Seer's. The third is yours — it doesn't know the note until you play your first card.",
      channeledPhrase: "the third is yours",
      elaraOverlay: "He left that line for you. Word for word. He always knew you'd be here.",
    },
  },
  {
    topic: "goggles_inherited",
    tutorialGateId: "tutor_goggles_inherited",
    variants: {
      revenant: {
        base: "I have worn these once, in some other version of this bench. The lenses know me. I do not entirely know them. He was meant to give them to whoever finishes the bench. I think that is both of us. I think it has been both of us for a while.",
        channeledPhrase: "whoever finishes the bench",
        elaraOverlay: "That was the line. Word for word. It is, somehow, more his than ever, now that you've said it.",
      },
      prodigal: {
        base: "I left. I came back. He left them anyway. The bench was waiting. I wear them now, on his behalf, and on mine. The lenses fit. I don't know how. I have stopped asking how about him.",
        channeledPhrase: "whoever finishes the bench",
        elaraOverlay: "He always knew you'd come back. He made me promise to relay this verbatim. Now it's said.",
      },
      sentinel: {
        base: "I will guard these. He guarded them his whole life. The duty passes. The lenses know it has passed. The bench, somehow, knows.",
        channeledPhrase: "whoever finishes the bench",
      },
    },
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
