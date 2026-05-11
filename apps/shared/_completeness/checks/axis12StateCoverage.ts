/**
 * Axis 12 — faction-livery coverage parity check (Phase H.F).
 *
 * Declared surface: 8 canonical FactionLivery × rooms with any
 * faction-axis variant. Implemented surface: rooms whose producer
 * library actually delivers each state.
 *
 * Per H.A inventory, 46 faction-axis variants are spread across
 * rooms with intentional partial coverage. compositeResolver
 * degrades gracefully for missing variants.
 *
 * Ratcheted.
 */
import type { RawParityCount } from "../types";

export async function checkAxis12StateCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../expansionArt/roomArtManifest");

  const factionEntries = manifest.roomArtByAxis("faction");
  const roomsWithAnyFaction = new Set(factionEntries.map((e) => e.zipDir));

  const FACTION_STATES: readonly string[] = [
    "none",
    "hierarchy",
    "dreamers",
    "pureflame",
    "insurgency",
    "panopticon",
    "collectors",
    "multi",
  ];

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  for (const zipDir of roomsWithAnyFaction) {
    for (const state of FACTION_STATES) {
      declared += 1;
      const url = manifest.roomArtStateUrl(zipDir, "faction", state);
      if (url) {
        implemented += 1;
      } else {
        missing.push(`${zipDir} × faction_${state}: not in producer library`);
      }
    }
  }

  return {
    declared,
    implemented,
    missing: missing.slice(0, 20),
  };
}
