/**
 * Woven Systems — types.
 *
 * The Two-Ripple Rule says: every player-facing system must ripple through
 * at least two *other* systems. This module declares the registry that
 * makes that rule machine-checkable. The parity check at
 * `_completeness/checks/wovenSystemRippleCoverage.ts` walks this registry
 * and audits the ripple-engine wiring against it.
 *
 * The registry is the contract; ripple-engine handlers carry a
 * `// woven: <fromId> -> <toId>` comment so the lexical scan can prove
 * they cross system boundaries.
 *
 * Mood contributions are *signed* per axis. A system that primarily
 * feeds Conquest declares `+`; one that subtracts from Famine declares
 * `-`. The world-mood service composes these.
 */

/**
 * Stable id for one woven system. snake_case. Adding a new value here
 * requires a registry entry in {@link ./registry.ts} *and* a paired
 * ripple emit in `apps/server/services/rippleEngine.ts`.
 *
 * Phases 1–4 ship 12 entries (the canonical named systems). Phase 5
 * extends to 17 with cross-cutting surfaces (guild / social / charity /
 * custom items / mini DLC).
 */
export type WovenSystemId =
  | "breeding"
  | "army"
  | "trade_empire"
  | "tower_defense"
  | "chess"
  | "demon_summoning"
  | "mechronis_celebration"
  | "governance"
  | "seasonal"
  | "yearly"
  | "transmissions"
  | "mysteries"
  | "guild"
  | "social"
  | "charity"
  | "custom_items"
  | "dlc_mini";

/**
 * The Four Horsemen — World Mood axes. Conquest / War / Famine / Death
 * are both the four-axis weather (current state) AND the first four
 * Seals (origin state). They share names because the Seals
 * *originate* the weather.
 */
export type HorsemanAxis = "conquest" | "war" | "famine" | "death";

export const ALL_HORSEMEN: ReadonlyArray<HorsemanAxis> = [
  "conquest",
  "war",
  "famine",
  "death",
];

/**
 * Signed per-axis weight. Positive contributes; negative subtracts.
 *
 * The world-mood service sums every system's contribution and
 * normalizes; an unscored axis (key absent) is treated as 0.
 */
export type MoodContribution = Partial<Record<HorsemanAxis, number>>;

/**
 * One row in the Woven Systems registry.
 *
 * Keep `routerPaths` / `sharedPaths` / `uiPaths` as ground-truth file
 * paths. The registry test verifies they exist.
 */
export interface WovenSystem {
  id: WovenSystemId;
  /** Human-facing name for the World Tapestry constellation. */
  name: string;
  /** One-line description. */
  description: string;
  /** Server router files (apps/server/routers/...). */
  routerPaths: ReadonlyArray<string>;
  /** Shared modules (apps/shared/...). */
  sharedPaths: ReadonlyArray<string>;
  /** Client surfaces (apps/client/src/...). */
  uiPaths: ReadonlyArray<string>;
  /**
   * Ripple events this system *emits*. Each entry must have at least
   * two `wovenOn(...)` consumers in `rippleEngine.ts` whose `toId`
   * differs from this system's `id` — the Two-Ripple Rule.
   */
  primaryEmits: ReadonlyArray<string>;
  /** Ripple events this system *consumes*. */
  primaryConsumes: ReadonlyArray<string>;
  /** Signed per-axis contribution to the World Mood. */
  moodContribution: MoodContribution;
}
