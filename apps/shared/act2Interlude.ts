import { assetUrl } from "@shared/lib/assetUrl";
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
  /** Optional VO audio URL per framing line. Relative to /audio/act2/. */
  firstPowerOnAudioUrl?: string;
  elaraAmbientAudioUrl?: string;
  humanAmbientAudioUrl?: string;
  firstLightCraftAudioUrl?: string;
  firstDarkCraftAudioUrl?: string;
  outOfMemoryEnergyAudioUrl?: string;
}

export const ENGINEERS_BENCH_FRAMING: EngineersBenchFraming = {
  firstPowerOn:
    "The bench powers on. It hums in a frequency you have heard before — on the Deck, in the reactor, in Elara's voice when she is reading old files. All three tuned to the same note.",
  firstPowerOnAudioUrl: assetUrl("audio/act2/bench-first-power-on.mp3"),
  elaraAmbient:
    "This bench… hums the same way his Deck did. Like it remembers him. I think he built it to build the Dischordia and then left it running. Just in case. Just in case one of us woke up.",
  elaraAmbientAudioUrl: assetUrl("audio/act2/bench-elara-ambient.mp3"),
  humanAmbient:
    "She's right. He built it twice. Once before Mechronis, and once after Nexon. The second time was the one that worked. Don't ask me how I know. I watched it.",
  humanAmbientAudioUrl: assetUrl("audio/act2/bench-human-ambient.mp3"),
  firstLightCraft:
    "You forge your first card. It is embarrassingly small — a Common with a tiny effect. That is intentional. The bench is teaching you what a card IS before it teaches you what a card CAN BE.",
  firstLightCraftAudioUrl: assetUrl("audio/act2/bench-first-light-craft.mp3"),
  firstDarkCraft:
    "You forge a dark card. The bench hums at a lower frequency. Elara flinches in the slot. The Human nods once, as if to say: be honest about what you are making.",
  firstDarkCraftAudioUrl: assetUrl("audio/act2/bench-first-dark-craft.mp3"),
  outOfMemoryEnergy:
    "The Memory Energy reserve is empty. The bench will not turn away — it will only wait. If you want more, the Trade Empire is the answer, and you already know it. That is the point of this moment.",
  outOfMemoryEnergyAudioUrl: assetUrl("audio/act2/bench-out-of-memory-energy.mp3"),
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
  /** Optional VO audio for the teaching line. Relative to /audio/act2/. */
  zephyrAudioUrl?: string;
}

export const ZEPHYR_9_CLASSROOM: readonly ChessDepthUnlock[] = [
  {
    depth: 1,
    reward: "basic_chess_access",
    zephyrLine:
      "You may play. I will not let you win. I will not let you lose quickly. Both take time.",
    zephyrAudioUrl: assetUrl("audio/act2/zephyr-tier-1.mp3"),
  },
  {
    depth: 3,
    reward: "dischordia_preview_cards",
    zephyrLine:
      "Now you may peek at the top card of your deck before drawing. This is not cheating. This is chess applied to cards. Both games reward knowing what's coming.",
    zephyrAudioUrl: assetUrl("audio/act2/zephyr-tier-3.mp3"),
  },
  {
    depth: 5,
    reward: "dischordia_undo_once",
    zephyrLine:
      "You may now un-do a single move per match. Use it sparingly. Quarchon have no un-do; we regret in other ways.",
    zephyrAudioUrl: assetUrl("audio/act2/zephyr-tier-5.mp3"),
  },
  {
    depth: 8,
    reward: "engineers_opening",
    zephyrLine:
      "I will teach you the Engineer's Opening. It is the first hand he ever drew in a tournament. It is also the last hand he ever drew in one. There is a lesson in the symmetry.",
    zephyrAudioUrl: assetUrl("audio/act2/zephyr-tier-8.mp3"),
  },
];

/** Line played the first time the player loses to a Game Master at chess. */
export const GAME_MASTER_FIRST_LOSS_LINE = `You lose. You were always going to lose. The Game Masters are reading your moves from the Matrix of Dreams. They read them before you make them. The only way to beat a Game Master at chess is to beat a Game Master in the Arena. Ask Zephyr-9 how.`;

/** Optional VO for GAME_MASTER_FIRST_LOSS_LINE. Relative to /audio/act2/. */
export const GAME_MASTER_FIRST_LOSS_AUDIO_URL =
  assetUrl("audio/act2/game-master-first-loss.mp3");

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
  /**
   * Line played when the player beats them a second time or later. Optional —
   * if absent, downstream callers should fall back to silent or reuse the
   * first-victory line. Authored for Act 2; Acts 3-4 culling acts add their
   * own dialog via getCullingRematchLine().
   */
  repeatVictoryLine?: string;
  /** Which Act stages them as a culminating boss. */
  cullingActs: number[];
  /** Seed deck id for the TCG duel variant of the encounter. */
  deckId?: string;
  /** Optional VO audio URLs (relative to /audio/act2/). */
  firstContactAudioUrl?: string;
  firstDefeatAudioUrl?: string;
  firstVictoryAudioUrl?: string;
  repeatVictoryAudioUrl?: string;
}

export const THE_LEFT_GAME_MASTER: GameMasterProfile = {
  id: "left_game_master",
  name: "The Left Game Master",
  lens: "left",
  temperament:
    "Tactical, analytical, cold. He counts the moves you haven't made yet. He plays the math.",
  firstContactLine:
    "I read from your left hemisphere. That is the logic one. I find it disappointing in almost every species, but I am fair. I will tell you when you play well. I will not tell you often.",
  firstContactAudioUrl: assetUrl("audio/act2/left-gm-first-contact.mp3"),
  firstDefeatLine:
    "You played the arithmetic correctly. The arithmetic was the wrong question. I will not tell you the right question tonight. Come back.",
  firstDefeatAudioUrl: assetUrl("audio/act2/left-gm-first-defeat.mp3"),
  firstVictoryLine:
    "You beat the arithmetic. You did not beat the question. The question is what I am for. You will see me again.",
  firstVictoryAudioUrl: assetUrl("audio/act2/left-gm-first-victory.mp3"),
  repeatVictoryLine:
    "Again. The arithmetic was the wrong question again. You are learning to ignore the arithmetic. I am, faintly, offended. Keep doing it.",
  repeatVictoryAudioUrl: assetUrl("audio/act2/left-gm-repeat-victory.mp3"),
  cullingActs: [3, 4],
  deckId: "tactical_arithmetic",
};

export const THE_RIGHT_GAME_MASTER: GameMasterProfile = {
  id: "right_game_master",
  name: "The Right Game Master",
  lens: "right",
  temperament:
    "Improvisational, artistic, cruel. She reads from your right hemisphere, the one that is surprised by things. She plays the mood.",
  firstContactLine:
    "I read from your right hemisphere. That is the pretty one. I am not fair. I am, however, extremely entertaining. Sit.",
  firstContactAudioUrl: assetUrl("audio/act2/right-gm-first-contact.mp3"),
  firstDefeatLine:
    "Oh, darling. That was a READ. That was a WHOLE BOOK. I am keeping this one in the drawer where I keep the good ones.",
  firstDefeatAudioUrl: assetUrl("audio/act2/right-gm-first-defeat.mp3"),
  firstVictoryLine:
    "You win. Nobody wins the right hemisphere. Nobody. I am genuinely delighted. I will tell the Left one, and he will be genuinely unable to process it.",
  firstVictoryAudioUrl: assetUrl("audio/act2/right-gm-first-victory.mp3"),
  repeatVictoryLine:
    "Again? You absolute menace. Do you know how many moods I keep here? I will show you another one. Sit. Stay.",
  repeatVictoryAudioUrl: assetUrl("audio/act2/right-gm-repeat-victory.mp3"),
  cullingActs: [3, 4],
  deckId: "improv_mood",
};

export const GAME_MASTERS: Record<GameMasterId, GameMasterProfile> = {
  left_game_master: THE_LEFT_GAME_MASTER,
  right_game_master: THE_RIGHT_GAME_MASTER,
};

export function listGameMasters(): GameMasterProfile[] {
  return [THE_LEFT_GAME_MASTER, THE_RIGHT_GAME_MASTER];
}

/**
 * Resolve the seeded TCG deck id for a Game Master encounter. Falls back
 * to a neutral deck when the profile doesn't carry one explicitly.
 */
export function pickGameMasterDeck(gm: GameMasterProfile): string {
  return gm.deckId ?? "game_master_neutral";
}

/**
 * Culling-act rematch line resolver. Acts 3 and 4 re-stage the Two
 * Game Masters as boss fights (per §6.4 cullingActs); this helper
 * returns the authored rematch line. CULLING_REMATCH_LINES below
 * covers both Game Masters × both acts (4 lines total, all
 * authored). Returns an empty string only when the requested act
 * is not in this GM's cullingActs list — that's a "no rematch in
 * this act" signal, not an unauthored stub.
 */
export function getCullingRematchLine(
  gm: GameMasterProfile,
  act: number,
): string {
  if (!gm.cullingActs.includes(act)) return "";
  const table = CULLING_REMATCH_LINES[gm.id];
  return table?.[act] ?? "";
}

/**
 * Culling-act rematch dialog for the two Game Masters. Referenced
 * by encounter init in Acts 3 and 4. Keyed by GM id then by act
 * number so new acts can be added without touching the resolver.
 *
 * Act 3: "The Offer" / "The Eyes in the Dark". The Game Master
 *        returns as a faction-affiliated opponent — the same lens,
 *        now wearing another faction's uniform. Player has seen
 *        them before; the GM is no longer wasting introductions.
 * Act 4: "The Prisoner" / "The Revelation". This IS the culling —
 *        the GM appears inside Kael's extracted memory, not as a
 *        live opponent. The line must read as a memory playing
 *        back, not a fresh encounter.
 */
const CULLING_REMATCH_LINES: Record<GameMasterId, Record<number, string>> = {
  left_game_master: {
    3:
      "Back. Different uniform, same hemisphere. The arithmetic has moved up a " +
      "register — the stakes now cost something you cannot recompute. Play anyway. " +
      "I will tell you the correct answer only after the wrong one has already " +
      "cost you.",
    4:
      "You are not playing me. You are watching him play me. Seventeen thousand " +
      "years ago. He won this game. That is why you are in this memory — you are " +
      "here to see HOW. Watch the left hemisphere. Watch what he did not do.",
  },
  right_game_master: {
    3:
      "Oh HELLO again. You came back. I was so hoping. I have been WORKING on " +
      "material since we last spoke. Some of it is cruel. Some of it is " +
      "charming. You will not be able to tell which is which until it is too " +
      "late. Sit. Sit. Let me read you again.",
    4:
      "This is a memory. Yes, darling. You are watching it. You are not in it. " +
      "You cannot save him. But you can learn the SHAPE of how I lost to him " +
      "the first time — which means you can learn the shape of how to lose to " +
      "me. Pay attention. The next move is the one I did not see coming.",
  },
};
