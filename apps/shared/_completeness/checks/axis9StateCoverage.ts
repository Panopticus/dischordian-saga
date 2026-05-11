/**
 * Axis 9 — TV-infection state coverage parity check (Phase H.D).
 *
 * Declared surface: 5 canonical TVInfectionState values × every
 * producer-delivered room that has at least one axis 9 (tv-*)
 * variant in the library.
 *
 * Implemented surface: rooms whose producer-art library actually
 * includes the variant for each state.
 *
 * Per H.A inventory, 63 tv-axis files are spread across rooms with
 * mostly partial coverage (e.g. cryo_bay has tv_spreading but not
 * tv_clean/exposed/corrupted/quarantined). The producer-art library
 * intentionally provides only "interesting" variants — the
 * compositeResolver degrades gracefully when a state is requested
 * but not delivered.
 *
 * **Ratcheted parity**: gap shrinks as future producer passes land
 * the missing per-room state variants; cannot regress.
 */
import type { RawParityCount } from "../types";

export async function checkAxis9StateCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../expansionArt/roomArtManifest");

  // Find all rooms that have ANY tv-axis variant in the library
  const tvEntries = manifest.roomArtByAxis("tv");
  const roomsWithAnyTv = new Set(tvEntries.map((e) => e.zipDir));

  const TV_STATES: readonly string[] = [
    "clean",
    "exposed",
    "spreading",
    "corrupted",
    "quarantined",
  ];

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  for (const zipDir of roomsWithAnyTv) {
    for (const state of TV_STATES) {
      declared += 1;
      const url = manifest.roomArtStateUrl(zipDir, "tv", state);
      if (url) {
        implemented += 1;
      } else {
        missing.push(`${zipDir} × tv_${state}: not in producer library`);
      }
    }
  }

  return {
    declared,
    implemented,
    missing: missing.slice(0, 20), // truncate; many rooms have partial
                                    // coverage by design
  };
}
