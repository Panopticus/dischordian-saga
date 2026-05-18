/**
 * Mystery Engine — clue foundIn ⇄ binding-room parity.
 *
 * Every authored clue carries a `foundIn` room id (the narrative
 * hint shown to the player: "this clue is in <room>"). A clue is
 * actually collectable only when a room-mystery hotspot
 * verb-response carrying a `mysteryBinding` credits it. Those two
 * facts must agree: the room a clue's `foundIn` names MUST be a
 * room that actually binds the clue. If they disagree — `foundIn`
 * says "trade-hub" but the binding lives in "war-room", or
 * `foundIn` names a room module that does not exist — the hint
 * sends the player somewhere the clue is not, and nothing else in
 * the gate catches it: the binding-coverage check only asks "is it
 * bound at all", reachability only asks "is the hotspot clickable".
 * This is the exact failure mode that, during the ten-arc
 * playability remediation, was only caught by diffing
 * episodeMysteries.ts by hand on every pass. This check makes it
 * mechanical.
 *
 * Mechanism:
 *
 *   - The episode side imports MYSTERY_DEFINITIONS directly (the
 *     typed source of truth) and collects clueId → foundIn.
 *   - The room side is text-scanned (same parsing approach as
 *     scripts/_audit-mystery-binding-integrity.mjs and the sibling
 *     coverage check) so it runs fully inside the ship:check TS
 *     runtime: for every room module it reads the module's `roomId`
 *     and every `mysteryBinding.cluesFound` id, building
 *     clueId → set of roomIds that bind it.
 *   - Declared = clues that are both authored-with-a-foundIn AND
 *     bound in ≥1 room (the clues for which the hint is load-bearing
 *     and verifiable).
 *   - Implemented = the subset whose `foundIn` is one of the room
 *     ids that actually bind the clue.
 *
 * Hard parity (no ratchet): a clue whose hint points away from
 * where it is collectable is always a bug, never an accepted
 * backlog. The ten wired arcs were authored to satisfy this; this
 * gate locks that in so future arc work cannot silently regress it.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";
import { MYSTERY_DEFINITIONS } from "../../episodeMysteries";

const ROOM_DIR = path.join(REPO_ROOT, "apps/shared/roomMysteries");
const ROOM_SKIP = new Set([
  "_template.ts",
  "_speciesExclusive.ts",
  "index.ts",
]);

/** clueId → its authored `foundIn` room id (only clues that declare one). */
function collectClueFoundIn(): Map<string, string> {
  const foundIn = new Map<string, string>();
  for (const mystery of MYSTERY_DEFINITIONS) {
    for (const episode of mystery.episodes) {
      for (const clue of episode.clues) {
        const id = clue.id as string;
        const room = (clue as { foundIn?: string }).foundIn;
        if (typeof room === "string" && room.length > 0) {
          foundIn.set(id, room);
        }
      }
    }
  }
  return foundIn;
}

/**
 * clueId → set of room ids whose modules bind it via
 * `mysteryBinding.cluesFound`. The module's `roomId` is read from
 * the first `roomId: "<id>"` literal in the file (the
 * RoomMysteryModule declaration).
 */
function collectClueBindingRooms(): Map<string, Set<string>> {
  const byClue = new Map<string, Set<string>>();
  if (!fs.existsSync(ROOM_DIR)) return byClue;
  const files = fs
    .readdirSync(ROOM_DIR)
    .filter(
      (f) =>
        f.endsWith(".ts") && !f.endsWith(".test.ts") && !ROOM_SKIP.has(f),
    );
  const bindingRe = /mysteryBinding\s*:\s*\{([\s\S]*?)\}/g;
  for (const file of files) {
    const src = fs.readFileSync(path.join(ROOM_DIR, file), "utf-8");
    const roomIdMatch = src.match(/\broomId\s*:\s*"([^"]+)"/);
    if (!roomIdMatch) continue;
    const roomId = roomIdMatch[1];
    let m: RegExpExecArray | null;
    while ((m = bindingRe.exec(src)) !== null) {
      const cluesMatch = m[1].match(/cluesFound\s*:\s*\[([\s\S]*?)\]/);
      if (!cluesMatch) continue;
      for (const c of cluesMatch[1].matchAll(/"([^"]+)"/g)) {
        const set = byClue.get(c[1]) ?? new Set<string>();
        set.add(roomId);
        byClue.set(c[1], set);
      }
    }
  }
  return byClue;
}

export function checkMysteryClueFoundInParity(): RawParityCount {
  const clueFoundIn = collectClueFoundIn();
  const clueBindingRooms = collectClueBindingRooms();

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  for (const [clueId, foundIn] of clueFoundIn) {
    const bindingRooms = clueBindingRooms.get(clueId);
    // Only clues that are actually bound somewhere have a
    // verifiable hint. Unbound clues are the binding-coverage
    // check's concern, not this one.
    if (!bindingRooms || bindingRooms.size === 0) continue;
    declared++;
    if (bindingRooms.has(foundIn)) {
      implemented++;
    } else {
      missing.push(
        `${clueId}: foundIn "${foundIn}" but bound in ${[...bindingRooms]
          .map((r) => `"${r}"`)
          .join(", ")}`,
      );
    }
  }

  missing.sort();
  return { declared, implemented, missing };
}
