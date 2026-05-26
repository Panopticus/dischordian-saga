/**
 * Axis 12 — faction-livery coverage parity check (Phase H.F).
 *
 * Declared surface: the canonical FactionLivery values × rooms with
 * any faction-axis variant. Implemented surface: rooms whose producer
 * library actually delivers each state.
 *
 * Per H.A inventory, 46 faction-axis variants are spread across rooms
 * with intentional partial coverage. compositeResolver degrades
 * gracefully for missing variants.
 *
 * **Vocabulary reconciliation (2026-05-26):** the canonical list was
 * widened from the original 8 (none/hierarchy/dreamers/pureflame/
 * insurgency/panopticon/collectors/multi) to 12 by adding
 * `authority` / `watcher` / `mechronis` / `antiquarian`. The producer
 * had been delivering art under these names (see
 * `scripts/_room-axis-coverage.ts`) and the prior 8-state list left
 * 16 delivered files uncounted. The four added names each represent
 * a canonical entity from the lore (the Architect Authority, the
 * Watcher, the Mechronis, the Antiquarian Circle) rather than an
 * alias of an existing faction; treating them as distinct states
 * lets the gate count every real delivery without polluting the
 * canonical list with duplicates of existing factions.
 *
 * Off-spec variants still uncounted by design (see the script for
 * the current list): `dreamer` (singular drift), `ironlions` (Iron
 * Lions are the Insurgency's military arm — too granular for the
 * top-level axis), `enemied` / `succession` (faction-state
 * qualifiers, not factions). These read as either aliases of
 * existing states or candidates for a separate axis; the lore team
 * can reclassify them later.
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
    // Added 2026-05-26 to reconcile producer-vocabulary drift — each
    // is a canonical lore entity the producer has been delivering
    // art for under its proper name. See header doc.
    "authority",
    "watcher",
    "mechronis",
    "antiquarian",
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
