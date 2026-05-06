/* ═══════════════════════════════════════════════════════
   VERB-COIN PUZZLE — Monkey-Island-style scene

   Plan §A6. The codebase lacks any LucasArts/Loom-style
   playful-puzzle register. This module is the engine for
   "select a verb, point at a hotspot, see the result" —
   the SCUMM verb-coin / Monkey Island insult-swordcraft
   pattern, parameterised so future scenes (the natural home
   is the Antiquarian's chapter) can declare their own.

   Engine ships now; one seed puzzle ("The Antiquarian's
   Reading Room") demonstrates the shape. Production should
   add at least one verb-coin scene per chapter that wants
   the playful tonal change.
   ═══════════════════════════════════════════════════════ */

export type Verb = "look" | "use" | "talk_to" | "give" | "pick_up" | "open" | "push";

export interface VerbCoinHotspot {
  id: string;
  /** Display name for the hotspot. */
  name: string;
  /** Reactions per verb. Missing verbs render the puzzle's
   *  fallbackResponse. */
  reactions: Partial<Record<Verb, VerbReaction>>;
}

export interface VerbReaction {
  /** Narrator / scene response to this verb on this hotspot. */
  response: string;
  /** Flag set on first execution. Lets later reactions branch
   *  on prior interactions. */
  setsFlag?: string;
  /** Required flag — reaction not available until this flag
   *  is set. */
  requiresFlag?: string;
  /** When set, this reaction terminates the scene. */
  endsScene?: boolean;
  /** Optional next-scene trigger id. */
  triggersNextScene?: string;
}

export interface VerbCoinPuzzle {
  id: string;
  title: string;
  /** Authoring-time opening narration. */
  intro: string;
  /** Verbs the verb-coin offers in this scene. Authors can
   *  narrow it (e.g. Antiquarian's reading room only allows
   *  "look" and "talk_to" for tonal tightness). */
  verbs: ReadonlyArray<Verb>;
  hotspots: ReadonlyArray<VerbCoinHotspot>;
  /** Default response for verb+hotspot combos with no
   *  authored reaction. Sierra-style, dry. */
  fallbackResponse: string;
}

export const VERB_COIN_PUZZLES: ReadonlyArray<VerbCoinPuzzle> = [
  {
    id: "antiquarian_reading_room",
    title: "The Antiquarian's Reading Room",
    intro:
      "The Antiquarian sits with a closed book. There are three other things in the room. He looks tired in a way you can't ask him about.",
    verbs: ["look", "talk_to", "use", "pick_up"],
    hotspots: [
      {
        id: "the_book",
        name: "The closed book",
        reactions: {
          look: {
            response:
              "The book is older than most of the locations on this ship. The cover is spotless because the Antiquarian dusts it twice a day.",
          },
          talk_to: {
            response:
              "You speak to the book. The Antiquarian doesn't move, but a small noise escapes him — possibly approval, possibly not.",
            setsFlag: "verb_book_addressed",
          },
          pick_up: {
            response:
              "You don't pick it up. You can feel that you don't pick it up before you decide not to. The book has settled.",
          },
        },
      },
      {
        id: "the_lamp",
        name: "The desk lamp",
        reactions: {
          use: {
            response:
              "You adjust the lamp. The Antiquarian looks up — for the first time. He says: 'Thank you. The shadow had been there for forty years.'",
            setsFlag: "verb_lamp_adjusted",
          },
          look: {
            response: "The lamp is doing its job. It has been doing its job for a long time.",
          },
        },
      },
      {
        id: "the_chair",
        name: "The empty chair",
        reactions: {
          look: {
            response:
              "The chair is empty. It has been empty for a long enough time that the cushion has shaped to that absence.",
          },
          use: {
            response:
              "You sit. The Antiquarian doesn't react until you've been there a full minute. Then he says: 'Yes.' Just that. 'Yes.'",
            setsFlag: "verb_chair_sat",
            triggersNextScene: "antiquarian_chapter_open",
            endsScene: true,
          },
        },
      },
      {
        id: "the_antiquarian",
        name: "The Antiquarian himself",
        reactions: {
          talk_to: {
            response:
              "He doesn't look up. He says: 'I'd rather you spoke to the room first. I'm easier after the room.'",
          },
          look: {
            response:
              "He looks like a man who has read every book in his hand twice. Which, given the book in his hand, is an alarming amount of reading.",
          },
        },
      },
    ],
    fallbackResponse:
      "The Antiquarian raises an eyebrow but doesn't look up. The room remains, unhelpful.",
  },
];

/* ─── Helpers ─── */

const PUZZLE_BY_ID = new Map(VERB_COIN_PUZZLES.map((p) => [p.id, p]));

export function getVerbCoinPuzzle(id: string): VerbCoinPuzzle | undefined {
  return PUZZLE_BY_ID.get(id);
}

export interface InteractionContext {
  flags: Readonly<Record<string, boolean | undefined>>;
}

export interface InteractionResult {
  response: string;
  setsFlag?: string;
  endsScene?: boolean;
  triggersNextScene?: string;
}

export function resolveInteraction(
  puzzle: VerbCoinPuzzle,
  hotspotId: string,
  verb: Verb,
  ctx: InteractionContext,
): InteractionResult {
  const hotspot = puzzle.hotspots.find((h) => h.id === hotspotId);
  if (!hotspot) return { response: puzzle.fallbackResponse };
  const reaction = hotspot.reactions[verb];
  if (!reaction) return { response: puzzle.fallbackResponse };
  if (reaction.requiresFlag && !ctx.flags[reaction.requiresFlag]) {
    return { response: puzzle.fallbackResponse };
  }
  return {
    response: reaction.response,
    setsFlag: reaction.setsFlag,
    endsScene: reaction.endsScene,
    triggersNextScene: reaction.triggersNextScene,
  };
}
