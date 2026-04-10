/* ═══════════════════════════════════════════════════════
   PLAYER SAVE — V1 schema (Zod)
   ───────────────────────────────────────────────────────
   The definitive, versioned, typed description of everything
   that counts as "player state worth saving."

   Why:
     Before this module, player state lived in ~70 separate
     localStorage keys sprinkled across ~57 client files with
     no schema, no validation, no migration path, and no
     versioning. See docs/design/FULL-PROJECT-AUDIT.md §1A.

   Scope:
     V1 covers the keys that were already being persisted as
     of the audit. Device-local settings (audio volume, theme
     tokens, physics mode, language) are NOT in this schema
     — those live in a separate SettingsV1 surface because
     they should not follow the player across devices.

   Migration:
     - Add new fields as `.optional()` with sensible defaults.
     - Bump SCHEMA_VERSION and add an entry to `migrate()`.
     - Never remove a field — mark it `.deprecated` and let the
       migration drop it. This keeps old saves loadable.

   Invariants:
     - SCHEMA_VERSION is monotonic.
     - `parsePlayerSave()` never throws on valid data. It
       reshapes malformed input and returns a best-effort save.
     - The shape is identical on client and server so a save
       round-trips through the DB unchanged.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";

export const SCHEMA_VERSION = 1 as const;

/* ─── Reusable primitives ─────────────────────────────── */

/** Coerce "1" / "true" / true / 1 into a boolean. localStorage often stringifies. */
const coerceBool = z.union([
  z.boolean(),
  z.literal("true").transform(() => true),
  z.literal("false").transform(() => false),
  z.literal("1").transform(() => true),
  z.literal("0").transform(() => false),
  z.number().transform((n) => n !== 0),
]).catch(false);

/** Coerce "42" / 42 / "42.5" into a number; fall back to 0 on garbage. */
const coerceNumber = z.union([
  z.number(),
  z.string().transform((s) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }),
]).catch(0);

const stringArray = z.array(z.string()).catch([]);
const numberArray = z.array(z.number()).catch([]);

/* ─── Sub-schemas ─────────────────────────────────────── */

/** Battle stats for the cinematic 2D fighter (Loredex Combat). */
export const battleStatsSchema = z.object({
  won: coerceNumber.default(0),
  played: coerceNumber.default(0),
}).default({ won: 0, played: 0 });

/** Ranked card-game stats (Dischordia). */
export const dischordiaStatsSchema = z.object({
  elo: coerceNumber.default(1000),
  wins: coerceNumber.default(0),
  losses: coerceNumber.default(0),
  tutorialComplete: coerceBool.default(false),
}).default({ elo: 1000, wins: 0, losses: 0, tutorialComplete: false });

/** Terminus Swarm (tower-defence roguelike) stats. */
export const terminusStatsSchema = z.object({
  highestWave: coerceNumber.default(0),
  kills: coerceNumber.default(0),
  trophies: coerceNumber.default(0),
  puzzleComplete: coerceBool.default(false),
}).default({ highestWave: 0, kills: 0, trophies: 0, puzzleComplete: false });

/** Which cinematic / tutorial / discovery reveal has been shown. */
export const seenFlagsSchema = z.object({
  cryoOrientation: coerceBool.default(false),
  openingCinematic: coerceBool.default(false),
  chessCinematic: coerceBool.default(false),
  collectorsArenaIntro: coerceBool.default(false),
  collectorsArenaLore: coerceBool.default(false),
  fight2dTutorial: coerceBool.default(false),
  fightTutorial: coerceBool.default(false),
  autoTutorialDismissed: coerceBool.default(false),
  dischordiaTutorial: coerceBool.default(false),
  seenTransitions: stringArray,
  shownDiscoveries: stringArray,
  completedTutorials: stringArray,
  visitedPages: stringArray,
}).default({
  cryoOrientation: false,
  openingCinematic: false,
  chessCinematic: false,
  collectorsArenaIntro: false,
  collectorsArenaLore: false,
  fight2dTutorial: false,
  fightTutorial: false,
  autoTutorialDismissed: false,
  dischordiaTutorial: false,
  seenTransitions: [],
  shownDiscoveries: [],
  completedTutorials: [],
  visitedPages: [],
});

/** Discovery, exploration, and collection progress. */
export const discoverySchema = z.object({
  /** Lore entries the player has discovered. */
  discovered: stringArray,
  /** Secret IDs the player has uncovered. */
  discoveredSecrets: stringArray,
  /** Easter eggs the player has found, per room. */
  roomEasterEggs: z.record(z.string(), stringArray).catch({}),
  /** Ordered list of all easter egg IDs found (flat). */
  easterEggs: stringArray,
  /** Puzzles solved — array of puzzle ids. */
  puzzlesSolved: stringArray,
  /** Legacy duplicate set — kept during V1 for migration safety. */
  solvedPuzzles: stringArray,
  /** Lore fragments assembled so far. */
  loreFragments: stringArray,
  /** Bonus cards granted via discoveries. */
  bonusCards: stringArray,
  /** Cards collected across all sources. */
  cardsCollected: stringArray,
  /** Opaque narrative flag map — value shape owned by narrativeSystems. */
  narrativeFlags: z.record(z.string(), z.unknown()).catch({}),
}).default({
  discovered: [],
  discoveredSecrets: [],
  roomEasterEggs: {},
  easterEggs: [],
  puzzlesSolved: [],
  solvedPuzzles: [],
  loreFragments: [],
  bonusCards: [],
  cardsCollected: [],
  narrativeFlags: {},
});

/** Research minigame progress. */
export const researchSchema = z.object({
  puzzlesSolved: coerceNumber.default(0),
  entriesUnlocked: stringArray,
}).default({ puzzlesSolved: 0, entriesUnlocked: [] });

/** Bestiary / specimen collection progress. */
export const bestiarySchema = z.object({
  /** Kill counts keyed by specimen id. */
  kills: z.record(z.string(), z.number()).catch({}),
  /** Discovered specimen ids. */
  discovered: stringArray,
  /** Owned specimen inventory. */
  owned: stringArray,
  /** Currently-active specimen id (null if none). */
  active: z.string().nullable().default(null),
  /** Memorial log for permadeath companions. */
  memorials: z.record(z.string(), z.unknown()).catch({}),
}).default({
  kills: {},
  discovered: [],
  owned: [],
  active: null,
  memorials: {},
});

/** Equipment + card upgrade ledgers. */
export const equipmentSchema = z.object({
  /** Card upgrade ledger — value shape owned by cardGameDepth. */
  cardUpgrades: z.record(z.string(), z.unknown()).catch({}),
  /** Multiverse record tracker. */
  multiverseRecord: z.record(z.string(), z.unknown()).catch({}),
}).default({
  cardUpgrades: {},
  multiverseRecord: {},
});

/** Story Mode + Collectors Arena (persistent narrative) state. */
export const storyModeSchema = z.object({
  /** Collectors Arena narrative branch state. */
  collectorsArenaStory: z.record(z.string(), z.unknown()).catch({}),
}).default({
  collectorsArenaStory: {},
});

/** Trade Empire (macro trade game) state. */
export const tradeEmpireSchema = z.object({
  state: z.record(z.string(), z.unknown()).catch({}),
  tech: z.record(z.string(), z.unknown()).catch({}),
}).default({ state: {}, tech: {} });

/** Casino / arena miscellany. */
export const miscGamesSchema = z.object({
  degenCasino: z.record(z.string(), z.unknown()).catch({}),
  gmArenaClones: z.record(z.string(), z.unknown()).catch({}),
}).default({ degenCasino: {}, gmArenaClones: {} });

/* ─── Root schema ─────────────────────────────────────── */

export const playerSaveV1Schema = z.object({
  version: z.literal(SCHEMA_VERSION).default(SCHEMA_VERSION),
  /** Wall-clock of the last successful save (ms epoch). */
  updatedAt: z.number().default(() => Date.now()),
  seenFlags: seenFlagsSchema,
  battleStats: battleStatsSchema,
  dischordia: dischordiaStatsSchema,
  terminus: terminusStatsSchema,
  discovery: discoverySchema,
  research: researchSchema,
  bestiary: bestiarySchema,
  equipment: equipmentSchema,
  storyMode: storyModeSchema,
  tradeEmpire: tradeEmpireSchema,
  miscGames: miscGamesSchema,
});

export type PlayerSaveV1 = z.infer<typeof playerSaveV1Schema>;

/** The empty / default player save — what a brand-new account starts with. */
export function emptyPlayerSave(): PlayerSaveV1 {
  return playerSaveV1Schema.parse({});
}

/**
 * Parse an unknown input into a PlayerSaveV1. Tolerates missing fields
 * and malformed sub-objects by filling them with defaults rather than
 * rejecting the whole save. Only returns `null` if the input is so
 * corrupt that even Zod's `.catch()` fallbacks can't recover.
 */
export function parsePlayerSave(input: unknown): PlayerSaveV1 | null {
  try {
    return playerSaveV1Schema.parse(input ?? {});
  } catch {
    return null;
  }
}

/**
 * Migration hook — future versions will add cases here to lift a V1
 * save into V2, V3, etc. Keeping the scaffold empty avoids a lint
 * warning and makes it obvious where to add new cases.
 */
export function migratePlayerSave(input: unknown): PlayerSaveV1 | null {
  if (input == null || typeof input !== "object") return null;
  const obj = input as { version?: number };
  switch (obj.version) {
    case undefined:
    case SCHEMA_VERSION:
      return parsePlayerSave(input);
    default:
      // Unknown future version — refuse to load so we don't silently
      // downgrade the save. The caller can present a "your save is
      // from a newer version of the game" error.
      return null;
  }
}
