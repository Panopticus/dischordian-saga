/**
 * Axis 11 — cycle-phase / time-of-day coverage parity check (H.E).
 *
 * Declared surface: 5 canonical CyclePhaseState values × every
 * producer-delivered room that has any cycle-axis variant in the
 * library.
 *
 * Implemented surface: rooms whose producer-art library actually
 * includes the variant for each cycle-phase value.
 *
 * Per H.A inventory, only `cycle_longnight` is delivered across 30
 * rooms — producer-art chose to ship the most-narrative-relevant
 * cycle variant per room. compositeResolver degrades gracefully
 * when other phases (dawn/midday/dusk/nightwatch) are requested but
 * not delivered.
 *
 * Ratcheted; gap shrinks as future passes land more phase variants
 * per room.
 */
import type { RawParityCount } from "../types";

export async function checkAxis11StateCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../expansionArt/roomArtManifest");

  const cycleEntries = manifest.roomArtByAxis("cycle");
  const roomsWithAnyCycle = new Set(cycleEntries.map((e) => e.zipDir));

  const CYCLE_STATES: readonly string[] = [
    "dawn",
    "midday",
    "dusk",
    "nightwatch",
    "longnight",
  ];

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  for (const zipDir of roomsWithAnyCycle) {
    for (const state of CYCLE_STATES) {
      declared += 1;
      const url = manifest.roomArtStateUrl(zipDir, "cycle", state);
      if (url) {
        implemented += 1;
      } else {
        missing.push(`${zipDir} × cycle_${state}: not in producer library`);
      }
    }
  }

  return {
    declared,
    implemented,
    missing: missing.slice(0, 20),
  };
}
