/* ═══════════════════════════════════════════════════════
   SOUL STONES — pure logic module
   See docs/design/SOUL_STONES_SYSTEM.md §1.1-1.3.

   Stones are collected as VIOLET (neutral). Each violet stone
   may then be CORRUPTED → red (counts toward Demon-Pet
   summoning) or PURIFIED → gold (counts toward Divine-Light
   investments). The choice is permanent per stone.

   Functions here are pure: they take the current count state
   and return the next state, or `null` when the operation
   is not permitted (insufficient stones, etc). The server
   router writes the result back to the `soulStones` row.
   ═══════════════════════════════════════════════════════ */

/** Per-player Soul Stone count snapshot — mirrors the relevant columns
 *  on `soulStones` (apps/db/schema.ts). The router converts the row
 *  to/from this shape so this module stays free of drizzle types. */
export interface SoulStoneCounts {
  violetCount: number;
  redCount: number;
  goldCount: number;
}

/** Weekly soft-cap on combat-source collection (§1.2). */
export const WEEKLY_COLLECT_CAP = 15;

/** Red stones required to summon a Tier-1 Demon Pet (§2.2). MVP starts
 *  at 10 — the doc spec is 7 but we round up while the demon-pet
 *  catalog is stubbed. Adjustable when the full roster lands. */
export const DEMON_PET_SUMMON_COST = 10;

/** Corrupt one violet stone → one red stone. Returns the new counts,
 *  or `null` if the player has no violet stones to spend. */
export function corruptSoulStone(counts: SoulStoneCounts): SoulStoneCounts | null {
  if (counts.violetCount < 1) return null;
  return {
    violetCount: counts.violetCount - 1,
    redCount: counts.redCount + 1,
    goldCount: counts.goldCount,
  };
}

/** Purify one violet stone → one gold stone. MVP is 1:1; the doc spec
 *  layers in a Dream-Token cost and a 15% failure rate (§3.1) which
 *  will land in a follow-up once the resonance-chamber UI exists. */
export function purifySoulStone(counts: SoulStoneCounts): SoulStoneCounts | null {
  if (counts.violetCount < 1) return null;
  return {
    violetCount: counts.violetCount - 1,
    redCount: counts.redCount,
    goldCount: counts.goldCount + 1,
  };
}

/** Result of a Demon-Pet summon. The `petPlaceholder` field is retained
 *  for back-compat with the Definition-of-Shipped soul-stone gate
 *  (which originally tracked the function name `summonDemonPet`). The
 *  unified-roster path is `summonDemonCrewMember` below — that is what
 *  the server router calls. */
export interface DemonPetSummonResult {
  success: true;
  redSpent: number;
  newCounts: SoulStoneCounts;
  petPlaceholder: "demon_pet";
}

/** Consume `cost` red stones to summon a Demon Pet placeholder. Kept for
 *  back-compat with callers that only need the stone-spend confirmation.
 *  New code should call `summonDemonCrewMember` so the demon lands on
 *  the unified crew roster. */
export function summonDemonPet(
  counts: SoulStoneCounts,
  cost: number = DEMON_PET_SUMMON_COST,
): DemonPetSummonResult | null {
  if (counts.redCount < cost) return null;
  return {
    success: true,
    redSpent: cost,
    newCounts: {
      violetCount: counts.violetCount,
      redCount: counts.redCount - cost,
      goldCount: counts.goldCount,
    },
    petPlaceholder: "demon_pet",
  };
}

/* ─── Unified roster: demon → crew member (productionPath="summoned") ─── */

import type {
  GeneticStat,
  SerializedCrewMember,
  CrewBiographyEntry,
} from "./crewPersistence";
import type { ApprenticeArchetype } from "./apprentices";

/** The three archetype tags a summoned demon can roll into. The split
 *  reflects the Hierarchy's lore role for bound spirits: heretics argue
 *  doctrine, revenants finish unfinished business, oracles dream the
 *  Architect's design backwards. (See docs/built/LORE_BIBLE.md
 *  Hierarchy + Blood Weave sections.) */
export type DemonArchetype = Extract<
  ApprenticeArchetype,
  "heretic" | "revenant" | "oracle"
>;

/** Demon name pools per archetype — short, sibilant, deliberately
 *  not-quite-human. Picked deterministically from the seed so a given
 *  stoneId always produces the same name for replayability. */
const DEMON_NAME_POOLS: Record<DemonArchetype, ReadonlyArray<string>> = {
  heretic: [
    "Vesh-Kal", "Mor'reth", "Iskand", "Thal-Ven", "Drevan",
    "Sarvex", "Nemir", "Aleth-Korr", "Vrash", "Ozim'tar",
  ],
  revenant: [
    "Khaal-Bin", "Olun", "Resha-Sul", "Threnn", "Kohven",
    "Maerith", "Velkhar", "Dralun", "Ish'mara", "Tov-Anath",
  ],
  oracle: [
    "Sin-Avar", "Eluneth", "Phren-Sul", "Yshani", "Aurel-Vem",
    "Toresh", "Mirial", "Kev'an-Sira", "Nyssel", "Oroun",
  ],
};

/** Tiny LCG mirroring the pattern used in petBreeding.ts so demons roll
 *  deterministically per (userId, stoneId) seed. */
function lcg(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x1_0000_0000;
  };
}

/** Deterministic 32-bit hash of a string for seed mixing. */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const DEMON_ARCHETYPES: ReadonlyArray<DemonArchetype> = [
  "heretic",
  "revenant",
  "oracle",
];

function clampStat(n: number): number {
  return Math.max(1, Math.min(100, Math.round(n)));
}

/** Inputs to `summonDemonCrewMember`. The router supplies userId+stoneId
 *  to derive a stable seed; tests can pass an explicit `seed` to pin
 *  archetype/stat rolls. */
export interface SummonDemonCrewInput {
  /** The soul-stone consumed (or representative — N stones spent, but
   *  the demon is bound to a single stone of record per the lore).
   *  Used both for `boundStoneId` and as part of the seed. */
  boundStoneId: string;
  /** Player id — second seed component, ensures cross-player uniqueness.
   *  Accepts string or number; both are stringified before hashing. */
  userId: string | number;
  /** Optional explicit seed override (testing). */
  seed?: number;
  /** Cycle to record on the crew member. Defaults to 0. */
  cycle?: number;
  /** ms epoch to use for id generation. Default Date.now(). */
  now?: number;
  /** Override stone cost (defaults to DEMON_PET_SUMMON_COST). */
  cost?: number;
}

/** Result of a successful summon. `member` is ready to push onto
 *  `state.roster.members` via `addCrewMemberToState`. */
export interface DemonCrewSummonResult {
  success: true;
  redSpent: number;
  newCounts: SoulStoneCounts;
  member: SerializedCrewMember;
  /** Loredex entry id keyed to the demon's archetype + bloodline.
   *  The router emits a `loredex_entry_discovered` for this id. */
  loredexUnlock: string;
  /** Kept for back-compat with the soul-stone gate. */
  petPlaceholder: "demon_pet";
}

/** Summon a Demon as a unified-roster crew member. Consumes `cost` red
 *  stones, rolls archetype + name + stats deterministically from the
 *  seed, returns a `SerializedCrewMember` with `productionPath="summoned"`,
 *  `bloodlineId="blood_weave"`, `corruption` in [30..60], `boundStoneId`,
 *  and a starting biography entry. Returns `null` when the player can't
 *  afford the cost. */
export function summonDemonCrewMember(
  counts: SoulStoneCounts,
  input: SummonDemonCrewInput,
): DemonCrewSummonResult | null {
  const cost = input.cost ?? DEMON_PET_SUMMON_COST;
  if (counts.redCount < cost) return null;

  const seed =
    input.seed ??
    (hashString(String(input.userId)) ^ hashString(input.boundStoneId)) >>> 0;
  const rand = lcg(seed);

  const archetype: DemonArchetype =
    DEMON_ARCHETYPES[Math.floor(rand() * DEMON_ARCHETYPES.length)];

  const namePool = DEMON_NAME_POOLS[archetype];
  const name = namePool[Math.floor(rand() * namePool.length)];

  // Demons are strong on the cognitive/spectral axes and weak on the
  // somatic/empathic ones — the corruption is a *cost* the player pays
  // for the stat profile.
  const baseHi = 65;
  const baseLo = 35;
  const stats: Record<GeneticStat, number> = {
    resilience: clampStat(baseLo + Math.floor(rand() * 20)),
    intellect: clampStat(baseHi + Math.floor(rand() * 25)),
    reflexes: clampStat(baseHi + Math.floor(rand() * 25)),
    empathy: clampStat(baseLo + Math.floor(rand() * 15)),
    immunity: clampStat(baseLo + Math.floor(rand() * 15)),
    adaptability: clampStat(baseHi + Math.floor(rand() * 20)),
  };

  // Archetype-flavored bonus on the dominant axis.
  if (archetype === "heretic") stats.empathy = clampStat(stats.empathy + 12);
  if (archetype === "revenant") stats.resilience = clampStat(stats.resilience + 18);
  if (archetype === "oracle") stats.intellect = clampStat(stats.intellect + 12);

  const corruption = 30 + Math.floor(rand() * 31); // 30..60

  const now = input.now ?? Date.now();
  const id = `demon-${input.boundStoneId}-${now}`;

  const biography: CrewBiographyEntry[] = [
    {
      cycle: input.cycle ?? 0,
      text: `Bound by ritual to soul-stone ${input.boundStoneId}. ${name} answered the summons.`,
      tag: "event",
    },
  ];

  const member: SerializedCrewMember = {
    id,
    name,
    nickname: null,
    species: "abyssal",
    gender: "non-binary",
    bloodlineId: "blood_weave",
    generation: 1,
    parentIds: null,
    children: [],
    geneticTraits: [`demon_${archetype}`],
    role: null,
    stats,
    morale: 60,
    health: 100,
    loyalty: 40, // bound, not loyal
    status: "active",
    age: 0,
    maxAge: 80,
    missionHistory: [],
    relationships: {},
    birthCycle: input.cycle ?? 0,
    isFounder: false,
    productionPath: "summoned",
    archetype,
    biography,
    personalQuestStage: 0,
    personalQuestResolution: null,
    cloneDegradation: 0,
    boundStoneId: input.boundStoneId,
    corruption,
  };

  return {
    success: true,
    redSpent: cost,
    newCounts: {
      violetCount: counts.violetCount,
      redCount: counts.redCount - cost,
      goldCount: counts.goldCount,
    },
    member,
    loredexUnlock: `demon_lineage_${archetype}`,
    petPlaceholder: "demon_pet",
  };
}

/** When a soul-stone bound to a demon is purified, the bond breaks.
 *  The choice fork lives at the call site — this function returns the
 *  two possible post-bond fates so the router can pick.
 *
 *  - `martyred`: archetype shifts to `martyr`, stats decay by 12, and
 *    `corruption` resets to 0. The demon stays on the roster as a
 *    redeemed soul (productionPath="summoned" preserved for memorial).
 *  - `fled`: the demon vanishes from the roster (caller removes member). */
export type DemonBondBreakOutcome = "martyred" | "fled";

export interface MartyrTransform {
  outcome: "martyred";
  member: SerializedCrewMember;
}
export interface FledTransform {
  outcome: "fled";
  memberId: string;
}
export type DemonBondBreakResult = MartyrTransform | FledTransform;

/** Apply the chosen outcome to a bound-demon crew member.
 *  Caller is responsible for actually persisting the result. */
export function breakDemonBond(
  member: SerializedCrewMember,
  outcome: DemonBondBreakOutcome,
): DemonBondBreakResult {
  if (outcome === "fled") {
    return { outcome: "fled", memberId: member.id };
  }
  const decayed: Record<GeneticStat, number> = {
    resilience: clampStat(member.stats.resilience - 12),
    intellect: clampStat(member.stats.intellect - 12),
    reflexes: clampStat(member.stats.reflexes - 12),
    empathy: clampStat(member.stats.empathy - 12),
    immunity: clampStat(member.stats.immunity - 12),
    adaptability: clampStat(member.stats.adaptability - 12),
  };
  const next: SerializedCrewMember = {
    ...member,
    archetype: "martyr",
    stats: decayed,
    corruption: 0,
    boundStoneId: undefined,
    biography: [
      ...(member.biography ?? []),
      {
        cycle: 0,
        text: `The binding stone was purified. ${member.name} chose redemption — and the cost.`,
        tag: "event",
      },
    ],
  };
  return { outcome: "martyred", member: next };
}

/** Drop quantities per source (§1.2). The router calls into the
 *  matching one at each drop site; combat-win is the only site wired
 *  in the MVP slice. */
export const DROP_QUANTITIES = {
  combat_win: 1,
  combat_loss: 1, // 25% chance gate is at the call site
  story_chapter: 2,
  secret_found: 1, // gold (pre-purified)
  trust_milestone: 1,
} as const;

export type SoulStoneDropSource = keyof typeof DROP_QUANTITIES;

/** Returns `true` when the source counts toward the weekly soft-cap.
 *  Narrative sources (story chapters, trust milestones) are uncapped
 *  per §1.2; only combat / exploration sources hit the limit. */
export function dropSourceCountsTowardWeeklyCap(source: SoulStoneDropSource): boolean {
  return source === "combat_win" || source === "combat_loss";
}
