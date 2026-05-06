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

  /* ─── Bridge of Kael ─── */
  {
    id: "bridge_of_kael",
    title: "The Bridge of Kael",
    intro:
      "Kael's old captain's chair is bolted to the deckplate as if the ship had decided not to let him leave. The room smells of cold solder and rosemary; nobody has explained the rosemary.",
    verbs: ["look", "talk_to", "use", "push"],
    hotspots: [
      {
        id: "captains_chair",
        name: "The captain's chair",
        reactions: {
          look: {
            response:
              "The chair faces the forward viewport. The cushion has the shape of a man who was tall on the right side and shorter on the left. The shape has not changed in fourteen years.",
          },
          use: {
            response:
              "You sit. The chair recognises you. Not as Kael. Not as a stranger. As whoever the chair has been waiting for, which is — apparently — a category that includes you. The console wakes.",
            setsFlag: "verb_kael_chair_sat",
            triggersNextScene: "bridge_of_kael_console",
            endsScene: true,
          },
          talk_to: {
            response:
              "You address the chair. Nothing answers. The chair is very, very good at being a chair when it wants to be.",
          },
        },
      },
      {
        id: "rosemary",
        name: "The rosemary",
        reactions: {
          look: {
            response:
              "A small clay pot. The rosemary is alive. Nobody has explained how. The label, in a child's handwriting, reads: 'For when he comes back. — L.'",
          },
          pick_up: {
            response:
              "You leave the pot where it is. So does everyone else who has ever come in here.",
          },
          talk_to: {
            response:
              "You greet the rosemary. The rosemary does not respond, but the smell strengthens — possibly an updraft, possibly not.",
          },
        },
      },
      {
        id: "viewport",
        name: "The forward viewport",
        reactions: {
          look: {
            response:
              "The viewport shows the same star Kael steered toward fourteen years ago. The star is no closer than it was when he left.",
          },
          push: {
            response:
              "You can't push a viewport. You can press your hand to it. The glass takes your hand-warmth and gives it back, slowly, over the next three minutes.",
          },
        },
      },
      {
        id: "headset",
        name: "Kael's headset",
        reactions: {
          look: {
            response:
              "Service-issue, second-generation. The temple foam has been replaced once, in someone else's hand. It still works.",
          },
          use: {
            response:
              "You put on the headset. There is a recording on the buffer. It is one minute and seventeen seconds long. Kael's voice, mid-sentence: 'tell L. the rosemary takes more water than she thinks. I'll be back when I'm back.'",
            setsFlag: "verb_kael_headset_heard",
          },
        },
      },
    ],
    fallbackResponse:
      "The Bridge holds its breath. The thing you tried to do isn't the thing the room is here for.",
  },

  /* ─── Engineering — the Workbench ─── */
  {
    id: "engineering_workbench",
    title: "The Engineer's Workbench",
    intro:
      "The Engineer left this bench mid-shift. The mug is cold. The schematic is half-rolled. There is a glove on the floor that has never been picked up, because nobody currently aboard knows whose glove it was.",
    verbs: ["look", "pick_up", "use", "talk_to"],
    hotspots: [
      {
        id: "schematic",
        name: "The half-rolled schematic",
        reactions: {
          look: {
            response:
              "A starter-card prototype. Pencil. The signature is the Engineer's. The margin notes are Lyra Vox's. They were arguing on paper, politely.",
          },
          pick_up: {
            response:
              "You roll the schematic. The crease memorises a new fold; the old one fades. You set it back where it was. The bench remembers; you both pretend it doesn't.",
          },
          use: {
            response:
              "You can't 'use' a schematic. You can read it. The schematic is unreadable until the second pass; on the second pass it makes sense; on the third it is obvious. You walk away owing the Engineer something.",
            setsFlag: "verb_workbench_schematic_read",
          },
        },
      },
      {
        id: "mug",
        name: "The cold mug",
        reactions: {
          look: {
            response:
              "Tea, maybe; the leaves have settled. There is a single fingerprint on the rim that is clearly the Engineer's. Nobody has washed it.",
          },
          pick_up: {
            response:
              "You don't pick it up. You can feel that you don't pick it up before you decide not to. The mug stays where it has been for fourteen years.",
          },
        },
      },
      {
        id: "glove",
        name: "The glove on the floor",
        reactions: {
          look: {
            response:
              "Not the Engineer's. Not Lyra's. Not anyone currently aboard. A spare, perhaps, from a hand that left and didn't come back.",
          },
          pick_up: {
            response:
              "You leave it. The bench has decided to keep it. You agree without speaking.",
          },
        },
      },
      {
        id: "starter_cards",
        name: "Cycle A starter cards (loose)",
        reactions: {
          look: {
            response:
              "Five cards. Three Engineer-tier. Two with no faction yet inked. The blanks are deliberate; the Engineer left them for whoever sat down next.",
          },
          pick_up: {
            response:
              "You pocket the two blanks. They are warm — they have been waiting in the pile for someone to want them.",
            setsFlag: "verb_workbench_blanks_taken",
            triggersNextScene: "engineering_blanks_inked",
          },
          use: {
            response:
              "You shuffle the three Engineer-tiers. The deck recognises you; it does not protest. You place it back. The bench logs the contact, quietly.",
          },
        },
      },
    ],
    fallbackResponse:
      "The bench stays the way the Engineer left it. The thing you tried isn't on the schematic.",
  },

  /* ─── Observation Deck — Memorial Plate (Loom-shaped) ─── */
  {
    id: "observation_memorial",
    title: "The Memorial Plate",
    intro:
      "A small brass plate set into the deck's outer rail. Names, in three columns. The column on the right is unfilled. There is one chair, set at the precise distance to read the names without choosing one.",
    verbs: ["look", "talk_to"],
    hotspots: [
      {
        id: "left_column",
        name: "The left column of names",
        reactions: {
          look: {
            response:
              "Crew lost in the pre-launch fire. Eleven names. The first is Lyra Vox's husband, although the plate doesn't say so.",
          },
          talk_to: {
            response:
              "You read three names aloud. The room takes them. Whatever the room does with them, you don't see.",
          },
        },
      },
      {
        id: "middle_column",
        name: "The middle column of names",
        reactions: {
          look: {
            response:
              "Crew lost in the long sleep. Twenty-three names. None of them are anyone you have spoken to yet, but you will recognise three of them later, and one of them will recognise you.",
          },
          talk_to: {
            response:
              "You read silently. The middle column doesn't ask out loud.",
          },
        },
      },
      {
        id: "right_column",
        name: "The empty right column",
        reactions: {
          look: {
            response:
              "Nineteen blank rows. The Antiquarian engraved them in advance, decades before the plate was hung. He knew the column would be needed. He has never explained how.",
          },
          talk_to: {
            response:
              "You don't speak. The right column doesn't take spoken words. It will take written ones, eventually, and not from you.",
            setsFlag: "verb_memorial_silenced",
          },
        },
      },
      {
        id: "chair",
        name: "The single chair",
        reactions: {
          look: {
            response:
              "Set at exactly the distance to read all three columns without making a choice between them. The chair is older than the plate. The plate was sized to the chair.",
          },
        },
      },
    ],
    fallbackResponse:
      "The deck holds. There is no other verb here.",
  },

  /* ─── Recipe Archive — Forgotten Recipe ─── */
  {
    id: "recipe_archive_forgotten",
    title: "The Forgotten Recipe",
    intro:
      "The Antiquarian's recipe archive has one drawer that doesn't open. The drawer is the only one with a label. The label is, perplexingly, blank.",
    verbs: ["look", "use", "give", "pick_up", "open"],
    hotspots: [
      {
        id: "blank_drawer",
        name: "The drawer with the blank label",
        reactions: {
          look: {
            response:
              "The label is genuinely blank. You can see the indent where ink used to be — but the ink itself is gone. As if the recipe had un-named itself.",
          },
          open: {
            response:
              "The drawer doesn't open. The mechanism isn't locked; it's simply uninterested.",
          },
          use: {
            response:
              "You can't use a drawer. You can address it. The drawer prefers being addressed. The handle warms slightly under your touch.",
          },
        },
      },
      {
        id: "antiquarian",
        name: "The Antiquarian (across the room)",
        reactions: {
          talk_to: {
            response:
              "Antiquarian: 'That drawer, yes. It used to have a recipe in it. I have forgotten the recipe. The drawer has, as a courtesy, forgotten with me.'",
          },
          give: {
            response:
              "He doesn't accept gifts during cataloguing hours. You return whatever you offered to your inventory; the room does not log the gesture.",
          },
        },
      },
      {
        id: "memory_token",
        name: "A loose memory token on the shelf",
        reactions: {
          look: {
            response:
              "An older token. The kind the Engineer used, before holographic indexes were standard. The token has no label. Its weight is wrong for its size.",
          },
          pick_up: {
            response:
              "You pocket the token. It is warm in the way the bench's blanks were warm — content to be carried.",
            setsFlag: "verb_archive_token_carried",
          },
          give: {
            response:
              "You can't give a token you haven't picked up.",
          },
        },
      },
      {
        id: "stove",
        name: "The cold stove in the corner",
        reactions: {
          look: {
            response:
              "Iron, two-burner, antique. The grate is clean. The grate has always been clean.",
          },
          use: {
            response:
              "You light a burner. The stove warms. The blank drawer makes a small, considered click. It does not open. It declines, politely, with a click.",
            requiresFlag: "verb_archive_token_carried",
            setsFlag: "verb_archive_stove_lit",
          },
        },
      },
      {
        id: "drawer_solved",
        name: "The drawer (after stove + token)",
        reactions: {
          open: {
            response:
              "You hold the token to the label. The label takes it. The drawer opens. Inside: one card, hand-drawn — the Antiquarian's hand — with a recipe so old the ink is now warm. The Antiquarian, across the room, without looking up: 'There it is. Thank you. I had — quite forgotten.'",
            requiresFlag: "verb_archive_stove_lit",
            setsFlag: "verb_archive_recipe_recovered",
            triggersNextScene: "antiquarian_chapter_handoff",
            endsScene: true,
          },
        },
      },
    ],
    fallbackResponse:
      "The archive is patient. The thing you tried wasn't the recipe; the recipe is still missing.",
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
