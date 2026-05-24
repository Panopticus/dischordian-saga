/* ═══════════════════════════════════════════════════════
   CONTENT SCHEMAS — Zod validation for all game content
   Run via: vitest run shared/contentIntegrity.test.ts
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

/** Helper: non-empty string for user-facing text */
const nonEmpty = z.string().min(1, "Must not be empty");

/* ─── TRANSMISSIONS ─── */

const TransmissionTriggerSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("awakening_step"), step: nonEmpty }),
  z.object({ kind: z.literal("chapter_complete"), chapterId: nonEmpty }),
  z.object({ kind: z.literal("level"), minLevel: z.number().int().positive() }),
  z.object({ kind: z.literal("trust"), npcId: nonEmpty, minTrust: z.number() }),
  z.object({
    kind: z.literal("morality"),
    direction: z.enum(["humanity", "machine"]),
    threshold: z.number(),
  }),
  z.object({ kind: z.literal("flag"), flag: nonEmpty }),
  z.object({ kind: z.literal("room_visited"), roomId: nonEmpty }),
  z.object({ kind: z.literal("apprentice_graduates") }),
  z.object({ kind: z.literal("loredex_discovered"), entityId: nonEmpty }),
  z.object({ kind: z.literal("always") }),
]);

export const TransmissionSchema = z.object({
  episodeNumber: z.number().int().min(0),
  // Epoch 0 covers pre-Season / "Spaces in Between" + EPOCH_0 backstories.
  // The airing seasons are 1–5. Keep 0 in the union so validator accepts
  // the backdated episodes instead of rejecting the whole archive.
  epoch: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  // broadcastOrder can be NEGATIVE for pre-broadcast / backdated transmissions
  // (the "Spaces in Between" prequels start at -30). Integer only.
  broadcastOrder: z.number().int(),
  title: nonEmpty,
  driveFileId: z.string().nullable(),
  videoUrl: z.string().nullable(),
  // lengthSeconds may be 0 for transmissions whose video asset hasn't
  // been produced yet — they still have a canonical entry in the archive.
  lengthSeconds: z.number().nonnegative(),
  memeIntro: nonEmpty,
  memeOutro: nonEmpty,
  triggersOracleReveal: z.boolean(),
  unlockTrigger: TransmissionTriggerSchema,
  reward: z.object({
    xp: z.number().nonnegative(),
    dream: z.number().nonnegative(),
    achievement: z.string().optional(),
  }),
  synopsis: nonEmpty,
}).passthrough(); // let future optional fields through without rewriting the schema

/* ─── APPRENTICE ARCHETYPES ─── */

export const ApprenticeArchetypeSchema = z.object({
  id: z.enum([
    "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
    "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
  ]),
  name: nonEmpty,
  title: nonEmpty,
  personality: nonEmpty,
  voiceDirection: nonEmpty,
  primaryStat: z.enum(["strength", "intelligence", "agility", "charisma"]),
  corruptionRisk: z.number().min(0).max(1),
  loyaltyBonus: z.object({
    target: nonEmpty,
    value: z.number(),
    label: nonEmpty,
  }),
  breakingPoint: nonEmpty,
});

/* ─── SEASONAL EVENTS ─── */

const EventMilestoneSchema = z.object({
  threshold: z.number().positive(),
  reward: z.object({
    type: z.enum(["token", "cosmetic", "card", "xp", "dream"]),
    key: nonEmpty,
    amount: z.number().positive(),
  }),
  label: nonEmpty,
});

const EventShopItemSchema = z.object({
  key: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  icon: nonEmpty,
  cost: z.number().nonnegative(),
  rarity: z.enum(["common", "rare", "legendary", "mythic"]),
  category: z.enum(["cosmetic", "consumable", "card", "decoration", "title"]),
  maxPurchases: z.number().int().positive(),
  requiredPrestige: z.string().optional(),
  requiredCivilSkill: z.object({
    skill: nonEmpty,
    level: z.number().int().positive(),
  }).optional(),
});

export const SeasonalEventSchema = z.object({
  key: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  icon: nonEmpty,
  color: nonEmpty,
  category: z.enum(["combat", "gathering", "crafting", "exploration", "lore", "social"]),
  durationDays: z.number().int().positive(),
  tokenName: nonEmpty,
  tokenIcon: nonEmpty,
  globalObjective: z.object({
    description: nonEmpty,
    targetAmount: z.number().positive(),
    rewardAll: z.object({
      tokenName: nonEmpty,
      amount: z.number().positive(),
    }),
  }),
  milestones: z.array(EventMilestoneSchema).min(1),
  shopItems: z.array(EventShopItemSchema).min(1),
  bonusClass: z.string().optional(),
  element: z.string().optional(),
  moralityPath: z.enum(["machine", "humanity"]).optional(),
});

/* ─── QUESTS ─── */

const QuestRequirementSchema = z.object({
  type: z.enum([
    "kills", "waves", "wins", "damage", "turrets_built", "cards_played",
    "packs_opened", "matches_played", "perfect_wins", "elo_reached",
    "collection_size", "crafts", "trades",
  ]),
  count: z.number().positive(),
  game: z.enum(["terminus", "dischordia", "chess", "fight", "any"]).optional(),
});

const QuestRewardSchema = z.object({
  salvage: z.number().nonnegative().optional(),
  viralIchor: z.number().nonnegative().optional(),
  neuralCores: z.number().nonnegative().optional(),
  voidCrystals: z.number().nonnegative().optional(),
  dream: z.number().nonnegative().optional(),
  xp: z.number().nonnegative().optional(),
  titleUnlock: z.string().optional(),
  cardPack: z.string().optional(),
});

export const QuestSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  game: z.enum(["terminus", "dischordia", "chess", "fight", "any"]),
  frequency: z.enum(["daily", "weekly", "epoch"]),
  requirement: QuestRequirementSchema,
  reward: QuestRewardSchema,
  loreText: z.string().optional(),
});

/* ─── STORY CHAPTERS ─── */

// Dialog items come in two flavors: plain StoryDialogue lines and
// DialogWheel choice nodes. Both are valid entries in the preFight /
// postFight arrays, so the schema accepts either shape.
const StoryDialogueSchema = z.object({
  speaker: nonEmpty,
  text: nonEmpty,
  speakerColor: z.string().optional(),
}).passthrough();

const DialogWheelSchema = z.object({
  // A DialogWheel node carries `options` (the four cardinal choices).
  // We don't exhaustively validate each option — we just confirm the
  // shape is array-like so the integrity test can distinguish it from
  // a malformed StoryDialogue.
  options: z.array(z.any()),
}).passthrough();

const DialogOrWheelSchema = z.union([StoryDialogueSchema, DialogWheelSchema]);

export const StoryChapterSchema = z.object({
  id: nonEmpty,
  chapter: z.number().int().min(0),
  title: nonEmpty,
  subtitle: nonEmpty,
  opponentId: nonEmpty,
  arenaId: nonEmpty,
  difficulty: z.enum(["easy", "normal", "hard", "nightmare"]),
  // unlocksFighter is optional per the StoryChapter interface.
  unlocksFighter: z.string().optional(),
  // Canonical field names from `client/src/game/storyMode.ts`.
  // The old schema used preDialogue / postVictoryDialogue which no
  // longer exist; these (preFight / postFight / postDefeatDialogue)
  // are the actual fields every chapter ships with.
  preFight: z.array(DialogOrWheelSchema).min(1),
  postFight: z.array(DialogOrWheelSchema).min(1).optional(),
  postDefeatDialogue: z.array(StoryDialogueSchema).min(1),
  memoryFragment: z.string().optional(),
  powerGained: z.string().optional(),
  cutsceneVideoUrl: z.string().url().optional(),
}).passthrough(); // allow the many optional chapter fields (isBoss, branches, etc.)

/* ─── MORALITY THEMES ─── */

const ThemeSideSchema = z.enum(["machine", "humanity", "balanced"]);

export const ShipThemeSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  side: ThemeSideSchema,
  requiredScore: z.number(),
  cssClass: nonEmpty,
  bgPattern: z.enum(["circuit", "hex", "organic", "crystal", "void", "flame", "frost", "nature", "chrome", "industrial"]),
  glowColor: nonEmpty,
  borderStyle: z.enum(["solid", "dashed", "double", "groove", "ridge"]),
  particleEffect: z.enum(["sparks", "leaves", "data", "embers", "snowflakes", "fireflies", "static", "none"]),
  hullTexture: nonEmpty,
});

export const CharacterThemeSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  side: ThemeSideSchema,
  requiredScore: z.number(),
  cssClass: nonEmpty,
  auraColor: nonEmpty,
  auraType: z.enum(["glow", "particles", "rings", "flames", "vines", "lightning", "frost", "shadow", "radiance", "none"]),
  portraitEffect: z.enum(["normal", "grayscale", "sepia", "hue-shift", "invert", "saturate", "contrast"]),
  overlayPattern: z.enum(["none", "circuit-lines", "leaf-veins", "energy-grid", "rune-marks", "hud-elements", "nature-frame"]),
});

/* ─── GUILD HALL ─── */

const GuildPerkSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  effect: z.object({
    stat: nonEmpty,
    value: z.number(),
    percent: z.boolean(),
  }),
});

export const GuildHallTierSchema = z.object({
  tier: z.number().int().min(1).max(5),
  name: nonEmpty,
  description: nonEmpty,
  cost: z.number().nonnegative(),
  maxRooms: z.number().int().positive(),
  perks: z.array(GuildPerkSchema).min(1),
  loreText: nonEmpty,
});

export const GuildHallRoomSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  tierRequired: z.number().int().min(1).max(5),
  features: z.array(nonEmpty).min(1),
  bonuses: z.array(z.object({
    stat: nonEmpty,
    value: z.number(),
    percent: z.boolean(),
  })),
  decorationSlots: z.number().int().nonnegative(),
  gridSize: z.tuple([z.number().int().positive(), z.number().int().positive()]),
});

export const GuildDecorationSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  description: nonEmpty,
  category: z.enum(["banner", "trophy", "furniture", "lighting", "tech", "memorial", "luxury"]),
  cost: z.object({
    dream: z.number().nonnegative().optional(),
    credits: z.number().nonnegative().optional(),
  }),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  gridSize: z.tuple([z.number().int().positive(), z.number().int().positive()]),
  passiveBonus: z.object({
    stat: nonEmpty,
    value: z.number(),
    description: nonEmpty,
  }).optional(),
  unlockRequirement: z.string().optional(),
});

/* ─── LOREDEX ENTRIES ─── */

const SongAppearanceSchema = z.object({
  song: nonEmpty,
  album: nonEmpty,
  music_video: z.record(z.string(), z.string()).optional(),
});

export const LoredexEntrySchema = z.object({
  id: nonEmpty,
  // "dream" entries (e.g. dream_enigmas_lament) are replayable narrative
  // sequences unlocked by gameplay events. They share the same Loredex
  // shape as canonical entities but skip the era/affiliation/status fields
  // (a dream isn't an entity — it's a memory). `episode` extends the same
  // shape for Dischordian Saga show entries — they pair with a video on
  // the CDN and get the Loredex "Replay Episode" affordance.
  type: z.enum(["character", "faction", "location", "concept", "song", "event", "artifact", "dream", "entity", "episode"]),
  name: nonEmpty,
  aliases: z.array(z.string()).optional(),
  era: z.string().optional(),
  date_aa: z.string().optional(),
  date_ad: z.string().optional(),
  season: z.string().optional(),
  affiliation: z.string().optional(),
  status: z.string().optional(),
  bio: nonEmpty,
  history: z.string().optional(),
  connections: z.array(z.string()).optional(),
  conexus_stories: z.array(z.string()).optional(),
  song_appearances: z.array(SongAppearanceSchema).optional(),
  // Some meta/paradox entries (e.g. "The Meme's Contested Fate", "The
  // Agent Zero Paradox") are canonically imageless — they live in the
  // archive as disputed/unresolved canon. Keep the field optional so
  // they pass validation without needing a placeholder image.
  image: z.string().optional(),
  priority: z.union([z.string(), z.number()]).optional(),
  streaming_links: z.record(z.string(), z.string()).optional(),
});

/* ─── BETRAYAL EVENTS ─── */

const BetrayalStageSchema = z.enum(["warning", "turn", "declaration", "betrayal"]);

const BetrayalChoiceOutcomeSchema = z.object({
  corruptionDelta: z.number(),
  bondDelta: z.number(),
  forceStage: z.union([BetrayalStageSchema, z.literal("halted")]).optional(),
  moralityDelta: z.number(),
  resultFlavor: nonEmpty,
});

export const BetrayalChoiceSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
  outcome: BetrayalChoiceOutcomeSchema,
});

/* ─── SACRIFICE REACTIONS ─── */

export const SacrificeReactionLinesSchema = z.record(
  z.enum([
    "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
    "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
  ]),
  z.array(nonEmpty).min(1),
);
