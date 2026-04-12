/* ═══════════════════════════════════════════════════════
   ACT 2 INTERLUDE DATA — §6 "The Forged Hand"

   Data shell for the §6.2–§6.4 Act 2 content:

     §6.2  Engineer's Bench framing lines (Crafting unlock)
     §6.3  Zephyr-9's Classroom (Chess unlock + tiers)
     §6.4  The Two Game Masters (Left + Right) as first-class
           NPCs with dialog, combat tags, and arena roles

   None of these systems are built yet in terms of gameplay
   mechanics — the Chess minigame exists standalone, the
   Collector's Arena exists standalone, the Crafting Bench
   exists standalone. This shell is the BRIDGE between those
   existing systems and the Witnessing narrative, so future
   wiring can reach the canonical content without hunting
   through the proposal PDF.
   ═══════════════════════════════════════════════════════ */

/* ─── §6.2 ENGINEER'S BENCH FRAMING ─── */

export interface EngineersBenchFraming {
  /** Line played the first time the player activates the bench. */
  firstPowerOn: string;
  /** Elara's line when the player stands near the bench. */
  elaraAmbient: string;
  /** The Human's line when the player stands near the bench. */
  humanAmbient: string;
  /** Line played the first time the player crafts a Light-aligned card. */
  firstLightCraft: string;
  /** Line played the first time the player crafts a Dark-aligned card. */
  firstDarkCraft: string;
  /** Line played when the player runs out of Memory Energy (the §6.2 pinch). */
  outOfMemoryEnergy: string;
}

export const ENGINEERS_BENCH_FRAMING: EngineersBenchFraming = {
  firstPowerOn:
    "The bench powers on. It hums in a frequency you have heard before — on the Deck, in the reactor, in Elara's voice when she is reading old files. All three tuned to the same note.",
  elaraAmbient:
    "This bench… hums the same way his Deck did. Like it remembers him. I think he built it to build the Dischordia and then left it running. Just in case. Just in case one of us woke up.",
  humanAmbient:
    "She's right. He built it twice. Once before Mechronis, and once after Nexon. The second time was the one that worked. Don't ask me how I know. I watched it.",
  firstLightCraft:
    "You forge your first card. It is embarrassingly small — a Common with a tiny effect. That is intentional. The bench is teaching you what a card IS before it teaches you what a card CAN BE.",
  firstDarkCraft:
    "You forge a dark card. The bench hums at a lower frequency. Elara flinches in the slot. The Human nods once, as if to say: be honest about what you are making.",
  outOfMemoryEnergy:
    "The Memory Energy reserve is empty. The bench will not turn away — it will only wait. If you want more, the Trade Empire is the answer, and you already know it. That is the point of this moment.",
};

/* ─── §6.1b RECORDING-GATED BENCH HINTS ─── */

/**
 * After discovering holographic Engineer recordings, the bench plays
 * contextual one-shot lines from the Engineer when the player crafts.
 * These are "tech advice from beyond the grave."
 *
 * See engineerBenchHints.ts for the full hint definitions and helpers.
 * This interface extends the bench framing concept to support
 * recording-gated hints.
 */
export interface RecordingGatedBenchHint {
  readonly requiredRecordingFlag: string;
  readonly triggerAction: "craft_light" | "craft_dark" | "craft_rare" | "fusion" | "blueprint_unlock";
  readonly line: string;
  readonly companionReaction?: Readonly<{
    elara?: string;
    the_human?: string;
  }>;
}

/**
 * Determine if a recording-gated bench hint should fire.
 * Returns true if the required recording flag is set and the hint
 * hasn't been seen before.
 */
export function shouldFireBenchHint(
  requiredFlag: string,
  flags: Record<string, unknown>,
  seenHintIds: ReadonlySet<string>,
  hintId: string,
): boolean {
  return Boolean(flags[requiredFlag]) && !seenHintIds.has(hintId);
}

/* ─── §6.3 ZEPHYR-9'S CLASSROOM ─── */

export interface ChessDepthUnlock {
  depth: number;
  /** What the player unlocks at this chess_depth stat. */
  reward: string;
  /** Zephyr-9's teaching line at this milestone. */
  zephyrLine: string;
}

export const ZEPHYR_9_CLASSROOM: readonly ChessDepthUnlock[] = [
  {
    depth: 1,
    reward: "basic_chess_access",
    zephyrLine:
      "You may play. I will not let you win. I will not let you lose quickly. Both take time.",
  },
  {
    depth: 3,
    reward: "dischordia_preview_cards",
    zephyrLine:
      "Now you may peek at the top card of your deck before drawing. This is not cheating. This is chess applied to cards. Both games reward knowing what's coming.",
  },
  {
    depth: 5,
    reward: "dischordia_undo_once",
    zephyrLine:
      "You may now un-do a single move per match. Use it sparingly. Quarchon have no un-do; we regret in other ways.",
  },
  {
    depth: 8,
    reward: "engineers_opening",
    zephyrLine:
      "I will teach you the Engineer's Opening. It is the first hand he ever drew in a tournament. It is also the last hand he ever drew in one. There is a lesson in the symmetry.",
  },
];

/** Line played the first time the player loses to a Game Master at chess. */
export const GAME_MASTER_FIRST_LOSS_LINE = `You lose. You were always going to lose. The Game Masters are reading your moves from the Matrix of Dreams. They read them before you make them. The only way to beat a Game Master at chess is to beat a Game Master in the Arena. Ask Zephyr-9 how.`;

/* ─── §6.4 THE TWO GAME MASTERS ─── */

export type GameMasterId = "left_game_master" | "right_game_master";

export interface GameMasterProfile {
  id: GameMasterId;
  name: string;
  /** Which lens of the original Game Master's split goggles they wear. */
  lens: "left" | "right";
  /** Personality description for dialog writing + deck construction. */
  temperament: string;
  /** Canonical dialog on first meeting in the Collector's Arena. */
  firstContactLine: string;
  /** Line when the player loses to them the first time. */
  firstDefeatLine: string;
  /** Line when the player eventually beats them. */
  firstVictoryLine: string;
  /** Which Act stages them as a culminating boss. */
  cullingActs: number[];
}

export const THE_LEFT_GAME_MASTER: GameMasterProfile = {
  id: "left_game_master",
  name: "The Left Game Master",
  lens: "left",
  temperament:
    "Tactical, analytical, cold. He counts the moves you haven't made yet. He plays the math.",
  firstContactLine:
    "I read from your left hemisphere. That is the logic one. I find it disappointing in almost every species, but I am fair. I will tell you when you play well. I will not tell you often.",
  firstDefeatLine:
    "You played the arithmetic correctly. The arithmetic was the wrong question. I will not tell you the right question tonight. Come back.",
  firstVictoryLine:
    "You beat the arithmetic. You did not beat the question. The question is what I am for. You will see me again.",
  cullingActs: [3, 4],
};

export const THE_RIGHT_GAME_MASTER: GameMasterProfile = {
  id: "right_game_master",
  name: "The Right Game Master",
  lens: "right",
  temperament:
    "Improvisational, artistic, cruel. She reads from your right hemisphere, the one that is surprised by things. She plays the mood.",
  firstContactLine:
    "I read from your right hemisphere. That is the pretty one. I am not fair. I am, however, extremely entertaining. Sit.",
  firstDefeatLine:
    "Oh, darling. That was a READ. That was a WHOLE BOOK. I am keeping this one in the drawer where I keep the good ones.",
  firstVictoryLine:
    "You win. Nobody wins the right hemisphere. Nobody. I am genuinely delighted. I will tell the Left one, and he will be genuinely unable to process it.",
  cullingActs: [3, 4],
};

export const GAME_MASTERS: Record<GameMasterId, GameMasterProfile> = {
  left_game_master: THE_LEFT_GAME_MASTER,
  right_game_master: THE_RIGHT_GAME_MASTER,
};

export function listGameMasters(): GameMasterProfile[] {
  return [THE_LEFT_GAME_MASTER, THE_RIGHT_GAME_MASTER];
}
