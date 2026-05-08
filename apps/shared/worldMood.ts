/**
 * World Mood — the Four Horsemen as the saga's *weather*.
 *
 * Conquest / War / Famine / Death are the four normalized axes the
 * server derives from existing pressure / palimpsest / dischordia /
 * narrative-flag signals. The mood is a *view*, not new state — the
 * service that computes it (`apps/server/services/worldMoodService.ts`)
 * never writes.
 *
 * Two scopes:
 *   - `forPlayer(userId)` — that player's personal weather
 *   - `global()` — the saga's weather, mean across active players
 *
 * Both share the {@link WorldMood} shape so the client renders one
 * gauge component for either.
 */
import type { HorsemanAxis, MoodContribution } from "./wovenSystems/types";
import { ALL_HORSEMEN } from "./wovenSystems/types";

export type { HorsemanAxis, MoodContribution } from "./wovenSystems/types";
export { ALL_HORSEMEN } from "./wovenSystems/types";

/**
 * One world-mood reading. All axes are normalized to [0, 1].
 *
 * `dominantAxis` is whichever axis has the highest value; ties break
 * in declaration order (conquest > war > famine > death).
 */
export interface WorldMood {
  conquest: number;
  war: number;
  famine: number;
  death: number;
  dominantAxis: HorsemanAxis;
  /** When this reading was computed. Used for cache headers. */
  computedAt: Date;
  /**
   * Optional: which broken seals contributed to this reading.
   * Empty array on a fresh world (no acts complete).
   */
  contributingSeals?: ReadonlyArray<number>;
  /**
   * Optional: how much the Mercy blend (charity donations + social
   * counter-tick) is currently subtracting from the famine + death
   * axes. Surfaces in the widget tooltip.
   */
  mercyOffset?: number;
}

/**
 * Saga-canonical baseline contribution from each broken seal. Seals
 * I–IV map to a horseman directly; Seal V tilts both Famine and Death
 * (souls under the altar); Seal VI is "every axis tilts a little";
 * Seal VII inverts toward silence (no contribution — the widget shows
 * a flat line during the half-hour).
 *
 * The `worldMoodService` adds these on top of the runtime-derived
 * signals when computing `global()`.
 */
export const SEAL_HORSEMAN_BASELINE: Readonly<
  Record<number, MoodContribution>
> = {
  1: { conquest: 0.1 },
  2: { war: 0.15 },
  3: { famine: 0.2 },
  4: { death: 0.25 },
  5: { famine: 0.1, death: 0.1 },
  6: { conquest: 0.05, war: 0.05, famine: 0.05, death: 0.05 },
  7: {}, // silence — no contribution
};

/**
 * Compose a normalized {@link WorldMood} from a partial axis tally.
 *
 * Used by the worldMoodService and any test that wants to assert
 * "given these signals, the dominant horseman is X." Pure function.
 *
 * `clamp` keeps each axis in [0, 1] regardless of how many signals
 * piled on. `dominantAxis` ties break in {@link ALL_HORSEMEN} order.
 */
export function composeWorldMood(
  raw: MoodContribution,
  meta: {
    computedAt?: Date;
    contributingSeals?: ReadonlyArray<number>;
    mercyOffset?: number;
  } = {},
): WorldMood {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const c = clamp(raw.conquest ?? 0);
  const w = clamp(raw.war ?? 0);
  const f = clamp(raw.famine ?? 0);
  const d = clamp(raw.death ?? 0);
  let dominantAxis: HorsemanAxis = ALL_HORSEMEN[0];
  let dominantValue = -Infinity;
  for (const axis of ALL_HORSEMEN) {
    const v =
      axis === "conquest"
        ? c
        : axis === "war"
          ? w
          : axis === "famine"
            ? f
            : d;
    if (v > dominantValue) {
      dominantValue = v;
      dominantAxis = axis;
    }
  }
  return {
    conquest: c,
    war: w,
    famine: f,
    death: d,
    dominantAxis,
    computedAt: meta.computedAt ?? new Date(),
    contributingSeals: meta.contributingSeals,
    mercyOffset: meta.mercyOffset,
  };
}

/**
 * Sum a list of MoodContributions into one. Charity / social
 * counter-ticks pass *negative* values; the worldMoodService applies
 * `composeWorldMood` after summing so negatives clamp to 0 rather
 * than spilling into other axes.
 */
export function sumContributions(
  parts: ReadonlyArray<MoodContribution>,
): MoodContribution {
  const out: MoodContribution = {};
  for (const p of parts) {
    for (const axis of ALL_HORSEMEN) {
      const v = p[axis];
      if (v === undefined) continue;
      out[axis] = (out[axis] ?? 0) + v;
    }
  }
  return out;
}
