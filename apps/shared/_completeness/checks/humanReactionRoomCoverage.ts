/**
 * Human-reaction room coverage parity check.
 *
 * Declared: every room mystery module under
 * apps/shared/roomMysteries/ that is not a template / barrel /
 * species-exclusive shim.
 *
 * Implemented: each such module's source contains the literal
 * `humanReaction:` substring — proves the Detective has at
 * least one banded reaction surfaced somewhere in the room.
 *
 * Hard parity. Locks the gain from the Beat-H expansion: the
 * five rooms backfilled by this PR (chaosForge, elementalNexus,
 * guildSanctum, synthesisChamber, socialHub) now have
 * humanReaction; the check makes regressing impossible.
 */
import type { RawParityCount } from "../types";
import { readFile, readdir } from "fs/promises";
import { resolve } from "path";

const ROOM_DIR = "apps/shared/roomMysteries";
const EXCLUDED = new Set(["_template.ts", "_speciesExclusive.ts", "index.ts"]);

export async function checkHumanReactionRoomCoverage(): Promise<RawParityCount> {
  const dir = resolve(process.cwd(), ROOM_DIR);
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return { declared: 0, implemented: 0, missing: [`${ROOM_DIR} not found`] };
  }

  const modules = entries
    .filter((e) => e.endsWith(".ts"))
    .filter((e) => !e.endsWith(".test.ts"))
    .filter((e) => !EXCLUDED.has(e))
    .sort();

  const missing: string[] = [];
  let implemented = 0;
  for (const name of modules) {
    const path = `${ROOM_DIR}/${name}`;
    try {
      const content = await readFile(resolve(process.cwd(), path), "utf8");
      if (content.includes("humanReaction:")) {
        implemented++;
      } else {
        missing.push(`${name} (no humanReaction:)`);
      }
    } catch {
      missing.push(`${name} (not readable)`);
    }
  }

  return { declared: modules.length, implemented, missing };
}
