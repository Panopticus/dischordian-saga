/* ═══════════════════════════════════════════════════════
   FACTION REPUTATION BANDS — shared pure helpers

   Plan §3 (Faction Reputation as first-class system).

   `apps/server/services/factionReputationService.ts` already
   persists faction reputation as a bounded integer in
   `[-REP_BOUND, REP_BOUND]` and owns the mutation round-
   trip. That service is server-only — it imports drizzle,
   touches the DB, and runs the hourly decay tick. It is the
   right home for that work and is not duplicated here.

   What was missing was a *shared* read model: a pure
   classifier so the client, the dialog runner, the
   campaign-stakes screen, and the encounter resolver could
   all answer "what band is this reputation in, and how
   close is it to the next one?" without reaching for the
   server module. That is what this file owns.

   Bands map to a five-tier ladder borrowed from the
   nemesis FactionStandingSnapshot vocabulary:

     hostile  | -1000 .. -601
     wary     |  -600 .. -201
     neutral  |  -200 ..  200
     allied   |   201 ..  600
     sworn    |   601 .. 1000

   The neutral band is symmetric around zero so an untouched
   reputation reads as neutral, not "barely-positive".

   Pure module — no imports, no I/O, no React.
   ═══════════════════════════════════════════════════════ */

import type { Faction } from "./tcg-core/types/Card";

/** Hard reputation clamp range — mirrors REP_BOUND in
 *  `apps/server/services/factionReputationService.ts`. We
 *  duplicate the constant rather than import from the
 *  server module to keep this file shared-safe (the server
 *  module pulls in drizzle / db / logger).
 *
 *  Test `factionReputationBands.test.ts` asserts the two
 *  constants stay in sync. */
export const REP_BAND_BOUND = 1000;

export const REP_BAND_IDS = ["hostile", "wary", "neutral", "allied", "sworn"] as const;
export type RepBand = (typeof REP_BAND_IDS)[number];

/** Inclusive lower bound of each band. The upper bound of
 *  band N is `(thresholds[N+1] - 1)`; band `sworn` runs up
 *  to `REP_BAND_BOUND`. */
const BAND_LOWER_BOUND: Readonly<Record<RepBand, number>> = {
  hostile: -REP_BAND_BOUND,
  wary: -600,
  neutral: -200,
  allied: 201,
  sworn: 601,
};

/** Clamp a reputation value into the bounded range. Mirrors
 *  `boundReputation()` in the server service so callers that
 *  receive an unbounded value (a delta-applied test value, a
 *  hand-typed cheat code) get the same clipping. */
export function clampReputation(rep: number): number {
  if (!Number.isFinite(rep)) return 0;
  if (rep > REP_BAND_BOUND) return REP_BAND_BOUND;
  if (rep < -REP_BAND_BOUND) return -REP_BAND_BOUND;
  // Math.trunc(-0.7) returns -0; normalize so callers serialising
  // through Object.is or JSON don't see the negative sign on zero.
  const truncated = Math.trunc(rep);
  return truncated === 0 ? 0 : truncated;
}

/** Classify a bounded reputation into a band. Out-of-range
 *  inputs are clamped first so a corrupted state still
 *  returns a valid band. */
export function getReputationBand(rep: number): RepBand {
  const r = clampReputation(rep);
  if (r >= BAND_LOWER_BOUND.sworn) return "sworn";
  if (r >= BAND_LOWER_BOUND.allied) return "allied";
  if (r >= BAND_LOWER_BOUND.neutral) return "neutral";
  if (r >= BAND_LOWER_BOUND.wary) return "wary";
  return "hostile";
}

export interface ReputationBandProgress {
  band: RepBand;
  /** Bounded current reputation. */
  reputation: number;
  /** Inclusive lower bound of the current band. */
  bandFloor: number;
  /** Inclusive upper bound of the current band. */
  bandCeiling: number;
  /** Next band up, or null if already `sworn`. */
  nextBandUp: RepBand | null;
  /** Next band down, or null if already `hostile`. */
  nextBandDown: RepBand | null;
  /** Points needed to enter `nextBandUp`. Zero when none. */
  pointsToNextBandUp: number;
  /** Points needed to fall into `nextBandDown`. Zero when none. */
  pointsToNextBandDown: number;
  /** Progress through the current band as a fraction in `[0,1]`. */
  bandFillFraction: number;
}

/** Compute a UI-ready snapshot of where a reputation sits
 *  within its band and how far to the neighbours. Pure. */
export function getReputationBandProgress(rep: number): ReputationBandProgress {
  const reputation = clampReputation(rep);
  const band = getReputationBand(reputation);
  const bandFloor = BAND_LOWER_BOUND[band];
  const bandCeiling = computeBandCeiling(band);
  const span = bandCeiling - bandFloor;
  const bandFillFraction =
    span <= 0 ? 1 : Math.min(1, Math.max(0, (reputation - bandFloor) / span));

  const nextBandUp = computeNeighbourBand(band, "up");
  const nextBandDown = computeNeighbourBand(band, "down");
  const pointsToNextBandUp =
    nextBandUp === null ? 0 : Math.max(0, BAND_LOWER_BOUND[nextBandUp] - reputation);
  const pointsToNextBandDown =
    nextBandDown === null
      ? 0
      : Math.max(0, reputation - (computeBandCeiling(nextBandDown)));

  return {
    band,
    reputation,
    bandFloor,
    bandCeiling,
    nextBandUp,
    nextBandDown,
    pointsToNextBandUp,
    pointsToNextBandDown,
    bandFillFraction,
  };
}

function computeBandCeiling(band: RepBand): number {
  switch (band) {
    case "hostile":
      return BAND_LOWER_BOUND.wary - 1;
    case "wary":
      return BAND_LOWER_BOUND.neutral - 1;
    case "neutral":
      return BAND_LOWER_BOUND.allied - 1;
    case "allied":
      return BAND_LOWER_BOUND.sworn - 1;
    case "sworn":
      return REP_BAND_BOUND;
  }
}

function computeNeighbourBand(band: RepBand, dir: "up" | "down"): RepBand | null {
  const idx = REP_BAND_IDS.indexOf(band);
  const nextIdx = dir === "up" ? idx + 1 : idx - 1;
  if (nextIdx < 0 || nextIdx >= REP_BAND_IDS.length) return null;
  return REP_BAND_IDS[nextIdx];
}

/** A signed delta applied to one faction key. Used by the
 *  dialog choice resolver and the campaign encounter
 *  reward bridge; the actual mutation is forwarded to the
 *  server's `applyFactionReputationDelta()`. */
export interface FactionRepDelta {
  factionKey: string;
  delta: number;
}

/** Fold a set of deltas into a map. Later entries for the
 *  same key add to earlier ones (so a "−5 to insurgency"
 *  and a "+3 to insurgency" net to −2). */
export function combineRepDeltas(
  deltas: ReadonlyArray<FactionRepDelta>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const { factionKey, delta } of deltas) {
    if (!Number.isFinite(delta) || delta === 0) continue;
    out[factionKey] = (out[factionKey] ?? 0) + Math.trunc(delta);
  }
  return out;
}

/** Apply a partial-record delta from a dialog choice (keyed
 *  by `Faction`) to a current rep map. Returns a fresh map
 *  with all values clamped to the bounded range. Pure —
 *  the persistence round-trip happens server-side. */
export function applyFactionDeltaMap(
  current: Readonly<Record<string, number>>,
  delta: Partial<Record<Faction, number>>,
): Record<string, number> {
  const next: Record<string, number> = { ...current };
  for (const [k, v] of Object.entries(delta)) {
    if (v === undefined || !Number.isFinite(v) || v === 0) continue;
    next[k] = clampReputation((next[k] ?? 0) + Math.trunc(v));
  }
  return next;
}
