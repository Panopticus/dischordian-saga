/**
 * The Seven Seals — narrative spine of the saga.
 *
 * Each of the 7 acts is paired with a Seal. Seals I–IV originate the
 * four horsemen of the World Mood (Conquest / War / Famine / Death);
 * Seals V–VII break the metaphysical spine (souls / cosmic upheaval /
 * silence-before-trumpets).
 *
 * This module is **content-shaped**: it holds the *structure* of each
 * seal — id, act, horseman binding, theme tag, gameplay fall-through —
 * but the actual epigraph prose is authored separately by the writers
 * and stored in `apps/shared/sevenSealsEpigraphs.ts` (or equivalent
 * content registry). That separation keeps the engine free of long
 * text content and lets the Production Bible team iterate on copy
 * without touching code.
 *
 * The runtime side (`apps/server/services/sealStateService.ts`)
 * derives `sealed | breaking | broken` phases from existing
 * `act_N_started` / `act_N_complete` narrative flags. There is no
 * separate seal state table; the seal flags *are* the act flags.
 */
import type { HorsemanAxis } from "./worldMood";

export type SealNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SealPhase = "sealed" | "breaking" | "broken";

/**
 * Short theme tags. These identify each seal in code, telemetry, and
 * art-asset slugs. Long-form prose lives in the writers' content
 * registry, not here.
 */
export type SealThemeTag =
  | "white_horse_conquest"
  | "red_horse_war"
  | "black_horse_famine"
  | "pale_horse_death"
  | "souls_under_altar"
  | "cosmic_upheaval"
  | "silence_before_trumpets";

export interface SealDef {
  /** 1..7 */
  num: SealNumber;
  /** Which act breaking this seal is paired with (1..7). */
  act: SealNumber;
  /**
   * Horseman this seal originates, if any. Seals I–IV map to a single
   * horseman; Seal V tilts famine + death; Seals VI–VII have no
   * single binding.
   */
  horseman: HorsemanAxis | null;
  /** Short theme tag — see {@link SealThemeTag}. */
  themeTag: SealThemeTag;
  /** One-line gameplay summary for the World Tapestry tooltip. */
  fallSummary: string;
  /**
   * Which yearly event (if any) gets a calendar-override on first
   * break. Seal IV unlocks Severance; Seal V unlocks Memorial Day.
   */
  unlocksYearly?: "severance" | "memorial_day";
}

export const SEVEN_SEALS: ReadonlyArray<SealDef> = [
  {
    num: 1,
    act: 1,
    horseman: "conquest",
    themeTag: "white_horse_conquest",
    fallSummary:
      "Trade-Empire claims gain a first-conquest bonus; the Architect Console issues its first notification.",
  },
  {
    num: 2,
    act: 2,
    horseman: "war",
    themeTag: "red_horse_war",
    fallSummary:
      "Trade routes roll for hostile encounters; tower-defense raid frequency climbs; Hierarchy infernal-pack drop rate ticks up.",
  },
  {
    num: 3,
    act: 3,
    horseman: "famine",
    themeTag: "black_horse_famine",
    fallSummary:
      "Crew bloodline inbreeding penalty doubles; market price spreads widen; Advocate / Eidolon-bond gains stay protected.",
  },
  {
    num: 4,
    act: 4,
    horseman: "death",
    themeTag: "pale_horse_death",
    fallSummary:
      "Legion deployments emit pale_horse_arrives; soul-bound deaths feed double palimpsest noise; Severance fires regardless of date on first break.",
    unlocksYearly: "severance",
  },
  {
    num: 5,
    act: 5,
    horseman: null,
    themeTag: "souls_under_altar",
    fallSummary:
      "Souls Under the Altar mystery tier opens; every prior unsolved mystery gets a martyr-witness reroll; Memorial Day fires regardless of date on first break.",
    unlocksYearly: "memorial_day",
  },
  {
    num: 6,
    act: 6,
    horseman: null,
    themeTag: "cosmic_upheaval",
    fallSummary:
      "Palimpsest noise floor +10; host_mask_slipped probability x2; transmissions get a static-overlay shader; DischordiaCycle forced into vortex phase.",
  },
  {
    num: 7,
    act: 7,
    horseman: null,
    themeTag: "silence_before_trumpets",
    fallSummary:
      "Both narrators silenced for 30 real minutes; the World-Mood widget shows a single horizontal line; seven trumpet slots scaffold but stay inert (post-launch content).",
  },
];

/**
 * Resolve the runtime phase of a single seal from a player's narrative
 * flags. The flags are the canonical state — the seal is just a
 * *view* of them, like the World Mood.
 *
 * - `act_N_started === false && act_N_complete === false` → "sealed"
 * - `act_N_started === true  && act_N_complete === false` → "breaking"
 * - `act_N_complete === true`                             → "broken"
 */
export function resolveSealPhase(flags: {
  actStarted: boolean;
  actComplete: boolean;
}): SealPhase {
  if (flags.actComplete) return "broken";
  if (flags.actStarted) return "breaking";
  return "sealed";
}

/**
 * Pick the highest-numbered broken seal across a player's flag set.
 * Returns `null` if no acts are complete.
 *
 * Used by:
 *   - `worldMoodService.global()` to add the seal baselines
 *   - `mysteries.ts` seeder to pick eligible seeds (seal_tier)
 *   - the SevenSealsRibbon UI to highlight the latest crack
 */
export function latestBrokenSeal(
  flagsByAct: ReadonlyArray<{ act: SealNumber; complete: boolean }>,
): SealNumber | null {
  let max: SealNumber | null = null;
  for (const f of flagsByAct) {
    if (f.complete && (max === null || f.act > max)) {
      max = f.act;
    }
  }
  return max;
}

/**
 * Convenience: did this player ever complete the act that pairs with
 * the given seal? Used by yearly-event override logic (Severance
 * fires on first Seal IV break; Memorial Day on first Seal V).
 */
export function isSealBroken(
  num: SealNumber,
  flagsByAct: ReadonlyArray<{ act: SealNumber; complete: boolean }>,
): boolean {
  return flagsByAct.some((f) => f.act === num && f.complete);
}
