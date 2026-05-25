#!/usr/bin/env tsx
/**
 * Ad-hoc per-room axis coverage report. Reads roomArtManifest and
 * prints, for each of axes 9 / 11 / 12:
 *   - which rooms have any variant on the axis
 *   - which states each room has delivered
 *   - a coverage tally
 */
import {
  roomArtByAxis,
  roomArtStateUrl,
} from "../apps/shared/expansionArt/roomArtManifest";

const AXES = {
  tv: ["clean", "exposed", "spreading", "corrupted", "quarantined"],
  cycle: ["dawn", "midday", "dusk", "nightwatch", "longnight"],
  faction: [
    "none",
    "hierarchy",
    "dreamers",
    "pureflame",
    "insurgency",
    "panopticon",
    "collectors",
    "multi",
  ],
} as const;

const AXIS_LABEL = {
  tv: "Axis 9 — TV-infection",
  cycle: "Axis 11 — cycle-phase",
  faction: "Axis 12 — faction-livery",
} as const;

for (const axis of Object.keys(AXES) as Array<keyof typeof AXES>) {
  const states = AXES[axis];
  const rooms = Array.from(
    new Set(roomArtByAxis(axis).map((e) => e.zipDir)),
  ).sort();
  console.log(`\n## ${AXIS_LABEL[axis]}`);
  console.log(`Rooms with at least one ${axis}-axis variant: ${rooms.length}`);
  console.log(`States checked: ${states.join(", ")}\n`);
  console.log(
    `room`.padEnd(40) +
      states.map((s) => s.slice(0, 6).padEnd(7)).join("") +
      "  covered/total",
  );
  console.log("-".repeat(40 + states.length * 7 + 16));
  let totalCovered = 0;
  let totalCells = 0;
  for (const room of rooms) {
    const cells: string[] = [];
    let coveredHere = 0;
    for (const state of states) {
      totalCells += 1;
      if (roomArtStateUrl(room, axis, state)) {
        cells.push("✓".padEnd(7));
        coveredHere += 1;
        totalCovered += 1;
      } else {
        cells.push("·".padEnd(7));
      }
    }
    console.log(
      room.padEnd(40) +
        cells.join("") +
        `  ${coveredHere}/${states.length}`,
    );
  }
  console.log(
    "-".repeat(40 + states.length * 7 + 16),
  );
  console.log(
    `TOTAL`.padEnd(40 + states.length * 7) + `  ${totalCovered}/${totalCells}`,
  );

  // Surface any variants that exist for the axis but fall OUTSIDE the
  // canonical state list — these are real producer deliveries that
  // don't count toward the gate because their state name isn't in
  // the canonical set. Useful for spotting misnamed variants.
  const offSpec: Record<string, string[]> = {};
  for (const e of roomArtByAxis(axis)) {
    const canonical = (states as readonly string[]).includes(e.value);
    if (!canonical) {
      (offSpec[e.zipDir] ??= []).push(e.value);
    }
  }
  const offSpecRooms = Object.keys(offSpec).sort();
  if (offSpecRooms.length > 0) {
    console.log(
      `\nOff-canonical ${axis}-axis variants (in library but outside the ${states.length}-state set):`,
    );
    for (const room of offSpecRooms) {
      console.log(`  ${room}: ${offSpec[room].sort().join(", ")}`);
    }
  }
}
