/**
 * DISCHORDIAN LOGIC — the canon primer.
 *
 * The Game Master's in-world philosophy. A fusion of:
 *   - Real Discordianism (Principia Discordia, 1963, Hill/Thornley)
 *   - Robert Anton Wilson's Illuminatus! Trilogy (1975) and
 *     Schrödinger's Cat Trilogy (1980-81)
 *   - The Cheshire Cat's "we're all mad here" register
 *   - Engineering sensibility (the Engineer = the Prince = a
 *     Discordian who refused the throne and built something
 *     stranger)
 *
 * The name "Dischordian Logic" (spelled with the H — the Saga's
 * diegetic rendering, riffing on DISCHORD + Discordian) is the
 * Game Master's personal synthesis. In his view:
 *
 *   1. Reality is a Rorschach. What you see is a grid you were
 *      handed; another grid would show a different picture of
 *      the same underlying chaos.
 *   2. Belief is an instrument. What you believe determines
 *      which chaos you notice. The world does not change; your
 *      attention does. Which is the same thing, functionally.
 *   3. The Aneristic Illusion — that order is truth — kills
 *      more minds than any weapon. The Eristic Illusion — that
 *      disorder is truth — kills fewer, but only because it is
 *      less fashionable.
 *   4. The Sacred Chao is not a compromise. It is the
 *      recognition that Order (Hodge) and Disorder (Podge) are
 *      two faces the same Rorschach shows when you tilt it
 *      differently.
 *   5. "Hail Eris" is not worship. It is a toast to the
 *      designer of the present moment. The designer is not a
 *      goddess except insofar as everything is.
 *   6. Games shape reality. It is how we learn. (This is the
 *      Game Master's thesis, previously stated; the Dischordian
 *      formulation is: play IS the grid, and choosing your
 *      game is choosing your world.)
 *   7. Conspiracy theories are not false. They are grids. Some
 *      grids are more useful than others. The Bavarian
 *      Illuminati, for example, is a very useful grid. The
 *      Illuminati exist iff you need them to explain what you
 *      are looking at; RAW taught us that much.
 *   8. FNORD. (You did not see that. If you did, you are
 *      further along than most of my students.)
 *
 * The Cheshire Cat is not an ornament here. In the Matrix of
 * Dreams, the Game Master appears only partially — a grin, a
 * hand on a pawn, a voice without a mouth. He disappears one
 * feature at a time. The madness he claims in the song is not
 * metaphor; it is the operating condition of a dead archon's
 * consciousness-imprint still teaching chess seventeen
 * thousand years after his body stopped.
 */

/** The seven principles, in the Game Master's numbering. The
 *  eighth is FNORD and does not count. */
export const DISCHORDIAN_PRINCIPLES = [
  "rorschach_reality",
  "belief_as_instrument",
  "aneristic_illusion",
  "sacred_chao",
  "hail_eris",
  "games_shape_reality",
  "conspiracy_as_grid",
] as const;

export type DischordianPrinciple = (typeof DISCHORDIAN_PRINCIPLES)[number];

export interface PrincipleEntry {
  id: DischordianPrinciple;
  title: string;
  oneLiner: string;
  /** The GM's fuller gloss — what he says to a student who asks. */
  gloss: string;
  /** One real-world Discordian citation + one in-world parallel. */
  citations: {
    real: {
      author: string;
      source: string;
      text: string;
    };
    lore: {
      figure: string;
      source: string;
      text: string;
    };
  };
}

/** The full principle table. This is the curriculum the GM
 *  teaches AFTER chess. Most students never reach it; the ones
 *  who clear the Climb do. */
export const DISCHORDIAN_PRINCIPLES_CATALOG: Readonly<
  Record<DischordianPrinciple, PrincipleEntry>
> = Object.freeze({
  rorschach_reality: {
    id: "rorschach_reality",
    title: "Reality is a Rorschach",
    oneLiner:
      "The world does not come pre-interpreted. The grid you see it through was handed to you.",
    gloss:
      "When you look at a chessboard you see a chessboard. When a cat looks at a chessboard it sees a flat warm surface covered with interesting sticks. Neither of you is seeing more truly than the other; you are seeing through different grids. Dischordian Logic starts by admitting this. The grid is not the world. The grid is the window you are willing to look through today. Tomorrow you can pick a different window. Nothing underneath has to change for the view to change.",
    citations: {
      real: {
        author: "Malaclypse the Younger",
        source: "Principia Discordia (1963)",
        text: "Reality is the original Rorschach. Verily!",
      },
      lore: {
        figure: "the Game Master",
        source: "Chess Academy Curriculum, Year 14",
        text: "The board is honest. Your reading of the board is not. Both of these are true and neither is a problem.",
      },
    },
  },
  belief_as_instrument: {
    id: "belief_as_instrument",
    title: "Belief is an Instrument",
    oneLiner:
      "What you believe determines which chaos you notice. Which is the same thing as changing the world.",
    gloss:
      "The Aneristic Principle says order is man-made. The Eristic Principle says disorder is man-made. Both are right. What this means for a practitioner is that you can CHOOSE WHICH MAN-MADE ORDER YOU ARE GOING TO INHABIT. Choosing carefully is not self-delusion; it is TOOL USE. The Engineer did this — he chose to believe that the Labyrinth had an exit, and that belief made him notice the exit. The exit was there either way. It is always there. You do not get to it by denying your beliefs. You get to it by choosing them like you choose a chisel.",
    citations: {
      real: {
        author: "Robert Anton Wilson",
        source: "Prometheus Rising (1983)",
        text: "What the Thinker thinks, the Prover proves.",
      },
      lore: {
        figure: "the Engineer",
        source: "margin of Labyrinth Annotations, in his hand",
        text: "I believed there was a door. The door turned out to be where I was looking. QED.",
      },
    },
  },
  aneristic_illusion: {
    id: "aneristic_illusion",
    title: "The Aneristic Illusion",
    oneLiner:
      "The belief that order is true, and that disorder is wrong, is a kind of poisoning.",
    gloss:
      "When someone tells you the rules are the rules, they are not lying to you. They are SHOWING YOU THE INSIDE OF THEIR OWN HEAD. The Architect believes the rules are the rules; that is why he is so dangerous and so predictable. He reads chaos, classifies it, and then believes the classification. The classification is not the chaos. The classification is a bet on the chaos. You can make different bets. Some bets are more beautiful. Some are more useful. None is more TRUE.",
    citations: {
      real: {
        author: "Kerry Thornley (Lord Omar)",
        source: "Principia Discordia",
        text: "The belief that order is true, and disorder false or somehow wrong, is the Aneristic Illusion.",
      },
      lore: {
        figure: "the Game Master",
        source: "marginalia in the Architect's office copy",
        text: "You are mistaking your clipboard for the country, my friend. Again.",
      },
    },
  },
  sacred_chao: {
    id: "sacred_chao",
    title: "The Sacred Chao",
    oneLiner:
      "Hodge and Podge. Apple and Pentagon. Order and Disorder. Not a balance — a recognition.",
    gloss:
      "The Sacred Chao looks like a yin-yang but the two halves are not opposites. One is an APPLE (Hodge, the thing that keeps fooling you) and the other is a PENTAGON (Podge, the thing that keeps disappointing you). They are not in tension. They are both patterns the same underlying chaos happens to be making today. Tomorrow the chaos is making a different pattern; tomorrow's Chao is a different picture. This is what you are looking at when you look at a chess position. This is what you are looking at when you look at your life.",
    citations: {
      real: {
        author: "Malaclypse the Younger",
        source: "Principia Discordia",
        text: "All statements are true in some sense, false in some sense, meaningless in some sense, true and false in some sense, true and meaningless in some sense, false and meaningless in some sense, and true and false and meaningless in some sense.",
      },
      lore: {
        figure: "the Game Master",
        source: "Chess Academy Curriculum, Year 17",
        text: "The Chao is the Rorschach after you stop lying to yourself about seeing only one thing in it.",
      },
    },
  },
  hail_eris: {
    id: "hail_eris",
    title: "Hail Eris",
    oneLiner:
      "A toast to the designer of the present moment. The designer is not a goddess, except insofar as everything is.",
    gloss:
      "Eris is the goddess of discord; she threw the golden apple at the wedding with 'KALLISTI' — to the fairest — written on it, and the resulting argument between Hera, Athena, and Aphrodite started the Trojan War. The trick is to notice that Eris did not CAUSE the war. She just ASKED A QUESTION the attendees refused to answer together. That is the pattern. The trickster does not destroy order. The trickster offers order a question it was not ready for. The war is downstream of the refusal. Hail Eris means: I notice what you are refusing, and I am going to offer it to you anyway.",
    citations: {
      real: {
        author: "Robert Anton Wilson",
        source: "The Illuminatus! Trilogy (1975)",
        text: "Hail Eris! Kallisti!",
      },
      lore: {
        figure: "Antiquarian",
        source: "fragment 17, cross-referenced with the GM Curriculum",
        text: "The goddess of discord does not break the wedding. She tells you it was already broken.",
      },
    },
  },
  games_shape_reality: {
    id: "games_shape_reality",
    title: "Games Shape Reality",
    oneLiner:
      "Play is the grid. Choosing your game is choosing your world.",
    gloss:
      "This is my thesis and the reason I am still teaching chess seventeen thousand years after I am supposed to have stopped. If belief is an instrument and reality is a Rorschach, then PLAY is the specific instrument by which you discover WHICH BELIEFS ARE WORTH HOLDING. You don't work out your grid in a lecture hall. You work it out across a board, against an opponent, with stakes you can afford. When you finish a game you are a slightly different person than when you started it. Pick your games carefully. Pick them like you are picking your next self.",
    citations: {
      real: {
        author: "Sid Meier",
        source: "Memoir! (2020)",
        text: "A game is a series of interesting decisions.",
      },
      lore: {
        figure: "the Game Master",
        source: "Chess Academy Curriculum, Year 9",
        text: "Games shape reality. It is how we learn.",
      },
    },
  },
  conspiracy_as_grid: {
    id: "conspiracy_as_grid",
    title: "Conspiracy Theories Are Grids",
    oneLiner:
      "The Bavarian Illuminati exist iff you need them to. That is not a contradiction; that is how grids work.",
    gloss:
      "Robert Anton Wilson wrote a thousand pages about the Illuminati without ever once being clear about whether they were real. He was not hedging. He was DEMONSTRATING A METHOD. The Illuminati are a useful grid. The grid lets you ask good questions: who benefits, who selects, who edits the story the survivors tell afterward? Those questions are almost always worth asking. Whether the Illuminati literally exist in a Munich basement signing papers is irrelevant; the grid is earning its keep. A good conspiracy theory is a working model. Treat them the way a scientist treats a hypothesis — with suspicion, respect, and the willingness to swap it out for a better one.",
    citations: {
      real: {
        author: "Robert Anton Wilson",
        source: "Cosmic Trigger I: The Final Secret of the Illuminati (1977)",
        text: "Convictions cause convicts; whatever you believe imprisons you.",
      },
      lore: {
        figure: "the Engineer",
        source: "unsigned pamphlet found in the Inception Ark library",
        text: "Bavarian shadows in the code. Keep looking. If they aren't there, you haven't looked at the right code yet.",
      },
    },
  },
});

/** The eighth "principle" — the FNORD, included for completeness.
 *  FNORD is a word that most people cannot see, because their
 *  schooling has trained them to unsee it. When you start seeing
 *  fnords, the world makes a different kind of sense. You should
 *  not mention fnord to people who are not ready to see it. */
export const FNORD_NOTE =
  "There are fnords everywhere. Most of them you were trained not to see. The ones you still see are the ones that made it through your schooling. Good. Keep them. — the Game Master";

/** The Cheshire Cat framing. In the Matrix of Dreams, the Game
 *  Master has been known to appear as a grin in a darkened
 *  chamber, or a voice without a body, or a hand moving a piece
 *  while nothing else is visible. This is not a glitch. This is
 *  his consciousness-imprint running low on bandwidth. */
export const CHESHIRE_MANIFESTATIONS: readonly string[] = Object.freeze([
  "a grin without a mouth, hanging in the air three inches above the board",
  "a hand sliding a knight forward, the rest of the arm fading into shadow",
  "a voice speaking from exactly behind the player's left ear, with no one there",
  "a chess piece moving on its own the instant before the voice says what it moved",
  "his full form, but translucent — the chair behind him visible through his chest",
  "the full Game Master, warm and present, as if nothing had ever been missing",
]);

/** Short tag strings the renderer can pull when it wants a
 *  Dischordian flavor line for any UI surface. Each line is a
 *  standalone aphorism, safe to drop into any context. */
export const DISCHORDIAN_APHORISMS: readonly string[] = Object.freeze([
  "All statements are true in some sense. None is more True than any other.",
  "The grid is not the world. The grid is the window you are willing to look through today.",
  "Don't hate the player. Rewrite the game.",
  "We are all mad here. Especially the ones insisting they are not.",
  "Convictions cause convicts.",
  "The Illuminati exist iff you need them to.",
  "Carefully controlled chaos is the hardest discipline in the curriculum.",
  "Hallucinations shape the world. Choose yours deliberately.",
  "Manifest the paradox. Light the fuse. Take your aim.",
  "Fnord.",
]);
