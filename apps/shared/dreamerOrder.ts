/* ═══════════════════════════════════════════════════════
   ORDER OF THE DREAMER — LCIF donation ladder

   A year-round 100-level ladder that any player can climb by
   donating $100/level to LCIF. 100% of each purchase routes
   to LCIF — these are pure donations, not membership dues
   (see lionsClub.ts for dues).

   Rewards:
     - 10 main trophy tiers at every 10th level (10, 20, …, 100)
     - 5 progress badges at levels 1, 5, 25, 50, 75
     - Level 100 trophy is a one-of-one mythic engraved with
       the donor's chosen name

   Each main tier carries an `effects[]` array of gameplay
   bonuses (XP multiplier, currency multiplier, etc.). Active
   Iron Clad Lions members see these effects DOUBLED at
   resolution time — see lionsClubBonuses.ts.

   This module is data-only and pure. The Christmas-in-July
   bridge and the server credit handler both read from it.
   ═══════════════════════════════════════════════════════ */

/* ─── Ladder constants ─── */

export const DREAMER_DOLLARS_PER_LEVEL = 100;
export const DREAMER_MAX_LEVEL = 100;

/** Trophies unlock at every 10th level. */
export const DREAMER_MAIN_TIER_LEVELS = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
] as const;

/** Smaller progress badges reward early and mid-ladder donors. */
export const DREAMER_PROGRESS_BADGE_LEVELS = [1, 5, 25, 50, 75] as const;

export type DreamerTierNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type DreamerEffectKind =
  | "xp-multiplier"
  | "currency-multiplier"
  | "cosmetic-aura"
  | "dialog-flag";

export interface DreamerEffect {
  /** Stable id — "dreamer-t3-xp-boost". */
  id: string;
  /** UI-facing label. */
  label: string;
  /**
   * Raw bonus magnitude (e.g. 0.05 = +5%). Iron Clad Lion members
   * see this doubled at resolution time — design fills specifics;
   * the data model just exposes the field.
   */
  magnitude: number;
  kind: DreamerEffectKind;
}

export interface DreamerTier {
  tierNumber: DreamerTierNumber;
  unlocksAtLevel: number;
  trophyId: string;
  trophyName: string;
  /** Art prompt — for the server-side art pipeline. */
  artPrompt: string;
  effects: DreamerEffect[];
  /** True only for level-100 — engraved with the donor's name. */
  isMythicOneOfOne: boolean;
}

export interface DreamerProgressBadge {
  level: number;
  badgeId: string;
  badgeName: string;
  artPrompt: string;
}

export interface DreamerProfile {
  citizenId: string;
  /** 0..100 */
  currentLevel: number;
  /** Running total of LCIF dollars donated (credits the ladder). */
  totalLcifDonatedUsd: number;
  unlockedTrophyIds: string[];
  unlockedBadgeIds: string[];
  mythicEngraving?: { engravedName: string; engravedAtIso: string };
}

/* ─── Registries ─── */

const ART_PREAMBLE =
  "Ornate DGRS-Labs award art, Art Nouveau meets cyberpunk sorcery, brass + " +
  "black-iron + luminous glyphs, hand-painted edges over clean vector base, " +
  "isolated on transparent alpha, no text, no watermarks.";

function profileTrophyArt(motif: string): string {
  return `${ART_PREAMBLE} Character-displayable trophy piece, 256x256, 1:1, ${motif}`;
}

function profileBadgeArt(motif: string): string {
  return `${ART_PREAMBLE} Small profile badge, 128x128, 1:1, ${motif}`;
}

function mythicArt(engravedNameToken: string): string {
  return (
    `${ART_PREAMBLE} Full-body character display piece, 512x512, 1:1, ` +
    `one-of-one mythic Dreamer relic, iridescent not-color underlayer, ` +
    `hand-etched inscription reading "${engravedNameToken}" at the base, ` +
    `signed with the DGRS Lions sigil at a hidden corner.`
  );
}

/** Canonical registry — 10 tiers, one per main-level threshold. */
export const DREAMER_TIERS: readonly DreamerTier[] = [
  {
    tierNumber: 1,
    unlocksAtLevel: 10,
    trophyId: "dreamer-tier-1-quill",
    trophyName: "The First Quill",
    artPrompt: profileTrophyArt(
      "a single brass writing quill upright on a marble plinth, soft dawn light",
    ),
    effects: [
      {
        id: "dreamer-t1-xp-boost",
        label: "+1% global XP",
        magnitude: 0.01,
        kind: "xp-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 2,
    unlocksAtLevel: 20,
    trophyId: "dreamer-tier-2-lantern",
    trophyName: "The Lantern Bearer",
    artPrompt: profileTrophyArt(
      "a lantern on a polished orrery base, warm interior glow",
    ),
    effects: [
      {
        id: "dreamer-t2-currency-boost",
        label: "+2% currency from charity actions",
        magnitude: 0.02,
        kind: "currency-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 3,
    unlocksAtLevel: 30,
    trophyId: "dreamer-tier-3-orrery",
    trophyName: "The Charitable Orrery",
    artPrompt: profileTrophyArt(
      "brass orrery with three concentric rings of clockwork gears",
    ),
    effects: [
      {
        id: "dreamer-t3-xp-boost",
        label: "+3% global XP",
        magnitude: 0.03,
        kind: "xp-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 4,
    unlocksAtLevel: 40,
    trophyId: "dreamer-tier-4-bell",
    trophyName: "Bell of the Open Hand",
    artPrompt: profileTrophyArt(
      "cast-brass service bell on a velvet-wrapped anvil, open-palm mold",
    ),
    effects: [
      {
        id: "dreamer-t4-aura",
        label: "Subtle gold aura on profile card",
        magnitude: 1,
        kind: "cosmetic-aura",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 5,
    unlocksAtLevel: 50,
    trophyId: "dreamer-tier-5-compass",
    trophyName: "The Compass of Service",
    artPrompt: profileTrophyArt(
      "ornate navigation compass with a Lion's head at the pivot, rose-gold finish",
    ),
    effects: [
      {
        id: "dreamer-t5-currency-boost",
        label: "+5% currency from charity actions",
        magnitude: 0.05,
        kind: "currency-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 6,
    unlocksAtLevel: 60,
    trophyId: "dreamer-tier-6-anvil",
    trophyName: "Anvil of Unmade Futures",
    artPrompt: profileTrophyArt(
      "black-iron anvil wrapped in gold ribbon, half-forged relic resting atop",
    ),
    effects: [
      {
        id: "dreamer-t6-xp-boost",
        label: "+6% global XP",
        magnitude: 0.06,
        kind: "xp-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 7,
    unlocksAtLevel: 70,
    trophyId: "dreamer-tier-7-throne",
    trophyName: "Throne of the Humbled",
    artPrompt: profileTrophyArt(
      "low stone bench carved with lion-paw feet, gold leaf on the seat",
    ),
    effects: [
      {
        id: "dreamer-t7-dialog",
        label: "Unlocks Dreamer-specific NPC dialog arcs",
        magnitude: 1,
        kind: "dialog-flag",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 8,
    unlocksAtLevel: 80,
    trophyId: "dreamer-tier-8-moon",
    trophyName: "The Giving Moon",
    artPrompt: profileTrophyArt(
      "crescent-moon relief in pale silver, drops of gold falling from its lower curve",
    ),
    effects: [
      {
        id: "dreamer-t8-xp-boost",
        label: "+8% global XP",
        magnitude: 0.08,
        kind: "xp-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 9,
    unlocksAtLevel: 90,
    trophyId: "dreamer-tier-9-crown",
    trophyName: "Crown of Quiet Service",
    artPrompt: profileTrophyArt(
      "laurel crown of beaten gold, engraved inside with the LCIF seal",
    ),
    effects: [
      {
        id: "dreamer-t9-currency-boost",
        label: "+10% currency from charity actions",
        magnitude: 0.1,
        kind: "currency-multiplier",
      },
    ],
    isMythicOneOfOne: false,
  },
  {
    tierNumber: 10,
    unlocksAtLevel: 100,
    trophyId: "dreamer-tier-10-mythic",
    trophyName: "The Dreamer's Mirror",
    artPrompt: mythicArt("{engravedName}"),
    effects: [
      {
        id: "dreamer-t10-xp-boost",
        label: "+10% global XP",
        magnitude: 0.1,
        kind: "xp-multiplier",
      },
      {
        id: "dreamer-t10-currency-boost",
        label: "+10% currency from charity actions",
        magnitude: 0.1,
        kind: "currency-multiplier",
      },
      {
        id: "dreamer-t10-aura",
        label: "Iridescent Dreamer aura on profile and character",
        magnitude: 1,
        kind: "cosmetic-aura",
      },
    ],
    isMythicOneOfOne: true,
  },
];

/** 5 progress badges at 1, 5, 25, 50, 75 — rewards for early and
 *  mid-ladder donors that precede the first main trophy at level 10. */
export const DREAMER_PROGRESS_BADGES: readonly DreamerProgressBadge[] = [
  {
    level: 1,
    badgeId: "dreamer-badge-first-light",
    badgeName: "First Light",
    artPrompt: profileBadgeArt(
      "a single spark of gold light in a brass ring, simple minimalist emblem",
    ),
  },
  {
    level: 5,
    badgeId: "dreamer-badge-kindling",
    badgeName: "Kindling",
    artPrompt: profileBadgeArt(
      "a small stack of kindling lit with a golden flame, warm glow",
    ),
  },
  {
    level: 25,
    badgeId: "dreamer-badge-quarter-climb",
    badgeName: "Quarter-Climb",
    artPrompt: profileBadgeArt(
      "a brass step-ladder badge with a golden 1/4 glyph at the top rung",
    ),
  },
  {
    level: 50,
    badgeId: "dreamer-badge-half-moon",
    badgeName: "Half-Moon Dreamer",
    artPrompt: profileBadgeArt(
      "half-moon badge in silver with a gold meridian line bisecting it",
    ),
  },
  {
    level: 75,
    badgeId: "dreamer-badge-three-quarters",
    badgeName: "The Long Patience",
    artPrompt: profileBadgeArt(
      "three-quarter moon badge, silver and gold inlay, patina of age",
    ),
  },
];

/* ─── Helper functions ─── */

/** Floors a running LCIF-donated total into a ladder level. */
export function calculateLevelFromTotalUsd(totalUsd: number): number {
  if (!Number.isFinite(totalUsd) || totalUsd <= 0) return 0;
  const raw = Math.floor(totalUsd / DREAMER_DOLLARS_PER_LEVEL);
  return Math.min(raw, DREAMER_MAX_LEVEL);
}

export interface DreamerLevelCrossing {
  trophies: string[];
  badges: string[];
}

/** The trophy + badge ids newly crossed between two levels. */
export function trophiesNewlyCrossed(
  beforeLevel: number,
  afterLevel: number,
): DreamerLevelCrossing {
  const clampedBefore = Math.max(0, Math.min(beforeLevel, DREAMER_MAX_LEVEL));
  const clampedAfter = Math.max(0, Math.min(afterLevel, DREAMER_MAX_LEVEL));
  if (clampedAfter <= clampedBefore) return { trophies: [], badges: [] };

  const trophies: string[] = [];
  for (const tier of DREAMER_TIERS) {
    if (tier.unlocksAtLevel > clampedBefore && tier.unlocksAtLevel <= clampedAfter) {
      trophies.push(tier.trophyId);
    }
  }

  const badges: string[] = [];
  for (const badge of DREAMER_PROGRESS_BADGES) {
    if (badge.level > clampedBefore && badge.level <= clampedAfter) {
      badges.push(badge.badgeId);
    }
  }

  return { trophies, badges };
}

/** Resolves the concrete mythic art prompt for a chosen engraved name. */
export function getMythicInscriptionPrompt(engravedName: string): string {
  const sanitized = engravedName.trim().replace(/"/g, "'");
  return mythicArt(sanitized);
}

/** Lookup helpers for UI. */
export function getDreamerTier(trophyId: string): DreamerTier | undefined {
  return DREAMER_TIERS.find((t) => t.trophyId === trophyId);
}

export function getDreamerTierByLevel(level: number): DreamerTier | undefined {
  return DREAMER_TIERS.find((t) => t.unlocksAtLevel === level);
}

export function getDreamerBadge(
  badgeId: string,
): DreamerProgressBadge | undefined {
  return DREAMER_PROGRESS_BADGES.find((b) => b.badgeId === badgeId);
}

/** Next tier level above `currentLevel`, or null at/over the cap. */
export function nextTierLevel(currentLevel: number): number | null {
  for (const level of DREAMER_MAIN_TIER_LEVELS) {
    if (level > currentLevel) return level;
  }
  return null;
}

/** Empty profile factory — used by first-donation code paths. */
export function createEmptyDreamerProfile(citizenId: string): DreamerProfile {
  return {
    citizenId,
    currentLevel: 0,
    totalLcifDonatedUsd: 0,
    unlockedTrophyIds: [],
    unlockedBadgeIds: [],
  };
}
