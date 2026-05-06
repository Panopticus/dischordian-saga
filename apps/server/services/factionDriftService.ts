/* ═══════════════════════════════════════════════════════
   FACTION DRIFT SERVICE — weekly NPC territorial simulation

   Today the war map only moves when players contribute. This
   service introduces a small per-tick drift on each territory
   so the map *moves* between sessions, the way a Civilization
   AI civ keeps acting between your turns. It's the cheapest
   variant of plan §C3 — pure simulation, no diplomacy.

   The drift logic is pure (seedable RNG, deterministic given
   inputs) so it tests cleanly. The runner mutates DB; mount
   it from a Railway cron or an admin endpoint.

   To wire as a weekly schedule on Railway: add a cron service
   that hits an admin tRPC endpoint which calls
   runWeeklyFactionDrift(db). One ledger row per tick is
   appropriate; do NOT setInterval inside the stateless server
   process — that fires per-pod and double-applies under HA.
   ═══════════════════════════════════════════════════════ */

import type { DrizzleDb } from "../db";
import { warTerritories } from "../../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../logger";

/* ─── Types ─── */

export interface FactionDriftTerritoryView {
  id: number;
  sectorId: number;
  faction: "empire" | "insurgency" | null;
  controlPoints: number;
  contestCount: number;
}

export interface FactionDriftResult {
  /** Territory id. */
  id: number;
  /** Net change in controlPoints applied (signed, can be 0). */
  delta: number;
  /** Final controlPoints after applying the delta (clamped 0–100). */
  newControlPoints: number;
  /** Final faction lean — null if exactly 50, "empire" if <50,
   *  "insurgency" if >50 (matches the existing warMap convention
   *  where high control points lean Insurgency / Dreamer). */
  newFaction: "empire" | "insurgency" | null;
}

/* ─── Pure helpers ─── */

/** Seedable mulberry32 PRNG so tests can pin behavior. Returns
 *  a function `() → [0, 1)`. */
export function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Drift parameters. A "tick" is one weekly pass. Bounded so a
 *  single tick can't flip a sector outright; multi-week drift
 *  is what creates emergent geopolitics. */
export interface FactionDriftConfig {
  /** Maximum |delta| any single territory can move in one tick. */
  maxStep: number;
  /** Strength of the regression-to-50 pull. Higher = more
   *  contested-ness drift; 0 = no regression. */
  regressionStrength: number;
  /** Strength of the "winning faction keeps winning" momentum
   *  (a sector at 70 drifts further toward 100, not back to 50).
   *  Counterbalances regression — at high values the map polarises. */
  momentumStrength: number;
  /** Random jitter range, applied symmetrically. */
  jitter: number;
}

export const DEFAULT_DRIFT_CONFIG: FactionDriftConfig = {
  maxStep: 4,
  regressionStrength: 0.5,
  momentumStrength: 0.6,
  jitter: 1.5,
};

/** Compute the drift delta for one territory. Pure, deterministic
 *  given the same rng + config. */
export function computeFactionDriftDelta(
  territory: Pick<FactionDriftTerritoryView, "controlPoints" | "contestCount">,
  rng: () => number,
  config: FactionDriftConfig = DEFAULT_DRIFT_CONFIG,
): number {
  const cp = territory.controlPoints;
  // distance from contested midpoint, signed: positive = leaning Insurgency
  const lean = cp - 50;

  // Regression component pulls toward 50 — more aggressive on
  // heavily-contested sectors (high contestCount means active
  // tug-of-war that's been going both ways).
  const contestModifier = Math.min(1, territory.contestCount / 20);
  const regression = -lean * config.regressionStrength * 0.05 * (1 + contestModifier);

  // Momentum component reinforces whichever side already leads.
  // The further from 50, the stronger the pull further from 50.
  const momentum = Math.sign(lean) * Math.abs(lean) * config.momentumStrength * 0.04;

  // Jitter — symmetric noise so even a contested 50 doesn't sit
  // perfectly still. Drives the "something's happening on the map"
  // perception even when math is balanced.
  const jitter = (rng() * 2 - 1) * config.jitter;

  const raw = regression + momentum + jitter;
  // Clamp to maxStep so a single tick can't flip a sector.
  if (raw > config.maxStep) return config.maxStep;
  if (raw < -config.maxStep) return -config.maxStep;
  // Round to whole points so DB reads stay tidy.
  return Math.round(raw);
}

/** Apply a delta to a controlPoints scalar, clamped 0..100. */
export function applyDriftToControlPoints(current: number, delta: number): number {
  const next = current + delta;
  if (next < 0) return 0;
  if (next > 100) return 100;
  return next;
}

/** Re-derive faction lean from controlPoints. Mirrors the rule
 *  warMap.ts uses (50 = contested → null, >50 leans Insurgency,
 *  <50 leans Empire). */
export function leanFactionFor(controlPoints: number): "empire" | "insurgency" | null {
  if (controlPoints === 50) return null;
  return controlPoints > 50 ? "insurgency" : "empire";
}

/** Compute the per-territory result for a batch — pure, no DB
 *  required. Useful for previewing a tick before commit. */
export function computeFactionDriftBatch(
  territories: ReadonlyArray<FactionDriftTerritoryView>,
  rng: () => number,
  config: FactionDriftConfig = DEFAULT_DRIFT_CONFIG,
): FactionDriftResult[] {
  return territories.map((t) => {
    const delta = computeFactionDriftDelta(t, rng, config);
    const newControlPoints = applyDriftToControlPoints(t.controlPoints, delta);
    return {
      id: t.id,
      delta,
      newControlPoints,
      newFaction: leanFactionFor(newControlPoints),
    };
  });
}

/* ─── DB runner ─── */

/** Run one weekly drift tick over every active war territory in
 *  the given season. Caller is responsible for making sure this
 *  is only invoked once per tick window (use an external cron
 *  scheduler with a single dispatcher, NOT setInterval). */
export async function runWeeklyFactionDrift(
  db: DrizzleDb,
  seasonId: number,
  options: { seed?: number; config?: FactionDriftConfig } = {},
): Promise<{ ticked: number; results: FactionDriftResult[] }> {
  const seed = options.seed ?? Date.now();
  const rng = makeRng(seed);
  const config = options.config ?? DEFAULT_DRIFT_CONFIG;

  const territories = await db
    .select()
    .from(warTerritories)
    .where(eq(warTerritories.seasonId, seasonId));

  const views: FactionDriftTerritoryView[] = territories.map((t) => ({
    id: t.id,
    sectorId: t.sectorId,
    faction: t.faction,
    controlPoints: t.controlPoints,
    contestCount: t.contestCount,
  }));

  const results = computeFactionDriftBatch(views, rng, config);

  for (const r of results) {
    if (r.delta === 0) continue;
    await db
      .update(warTerritories)
      .set({
        controlPoints: r.newControlPoints,
        faction: r.newFaction,
      })
      .where(eq(warTerritories.id, r.id));
  }

  logger.info(
    `[factionDrift] season=${seasonId} seed=${seed} ticked ${results.filter((r) => r.delta !== 0).length}/${results.length} territories`,
  );

  return { ticked: results.filter((r) => r.delta !== 0).length, results };
}
