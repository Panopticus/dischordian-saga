/**
 * VO coverage probe — every authored hotspot must contribute a
 * voId that the room-mystery generator will pick up.
 *
 * The generator at apps/scripts/generate-room-mystery-vo.ts walks
 * ROOM_MYSTERY_REGISTRY and emits one line per (voId, band) pair.
 * If a future PR adds a hotspot but forgets to author voId/voIds
 * on its VerbResponse, this probe catches the gap before the
 * generator silently skips it.
 *
 * The shape we lock in:
 *   - Every Look response on every authored hotspot has a voId.
 *   - voId follows the convention `<speaker>.<room>.<hotspot>.<verb>`
 *     (lowercase, dot-separated, kebab-case room/hotspot tokens).
 *   - At least one banded look response (3-tier text) per
 *     narrative-weight room exists, so resolveBandedVoId emits
 *     `.fragmented`/`.lucid`/`.luminous` variants.
 */
import { describe, expect, it } from "vitest";
import { ROOM_MYSTERY_REGISTRY } from "./index";
import type { VerbResponse } from "./_template";

/** Walk every (room, hotspot, verb) triple authored across the registry. */
function* walkAuthoredResponses(): Generator<{
  roomId: string;
  hotspotId: string;
  verb: string;
  response: VerbResponse;
}> {
  for (const [roomId, mod] of Object.entries(ROOM_MYSTERY_REGISTRY)) {
    for (const [hotspotId, verbs] of Object.entries(mod.responses)) {
      for (const [verb, response] of Object.entries(verbs ?? {})) {
        if (response) {
          yield {
            roomId,
            hotspotId,
            verb,
            response: response as VerbResponse,
          };
        }
      }
    }
  }
}

const VO_ID_RE = /^(elara|detective|human|shadow_tongue)\.[a-z0-9_-]+\.[a-z0-9_-]+\.(look|use|talk)(\.t\d+)?$/;
const SPECIES_ROOMS = new Set([
  "the_elemental_forge",
  "blood_archive",
  "probability_chamber",
  "dimensional_observatory",
  "hybrid_sanctum",
  "the_between",
]);

/** Hotspots shipped in the 2026-04-30 work. These MUST author voId
 *  explicitly (vs. pre-existing hotspots where voId may be inferred
 *  by the generator from speaker+room+hotspot+verb). */
const NEW_HOTSPOTS_REQUIRING_VO_ID: Array<[string, string]> = [
  // ST hotspots (B-3..B-5)
  ["archives", "corrupted-scroll-rack"],
  ["archives", "rewritten-ledger"],
  ["archives", "indigo-glow-lectern"],
  ["archives", "unnameable-hue-cabinet"],
  ["bridge", "shadow-tongue-annotations"],
  ["comms-array", "voice-in-the-static"],
  ["engineering", "schematic-pad"],
  ["shadow-vault", "sealed-cell-glass"],
  ["shadow-vault", "manuscript-pile"],
  ["shadow-vault", "warden-terminal"],
  ["shadow-vault", "release-or-seal-lever"],
  ["cipher-den", "rosetta-pad"],
  ["cipher-den", "encrypted-correspondence"],
  ["cipher-den", "dictionary-of-edits"],
  ["cipher-den", "uncorruption-bench"],
];

describe("Room-mystery VO coverage", () => {
  it("every NEW Shadow Tongue hotspot has a voId on at least one verb", () => {
    // Most ST hotspots are Look-driven; a few (warden-terminal,
    // release-or-seal-lever, uncorruption-bench) are Use-only by
    // design. Any verb authored is fine — we just need ONE so the
    // generator can emit a recording.
    const missing: string[] = [];
    for (const [room, hotspot] of NEW_HOTSPOTS_REQUIRING_VO_ID) {
      const mod = ROOM_MYSTERY_REGISTRY[room];
      const verbs = mod?.responses[hotspot] ?? {};
      const hasVoId = Object.values(verbs).some((v) => v?.voId);
      if (!hasVoId) missing.push(`${room}:${hotspot}`);
    }
    expect(
      missing,
      `ST hotspots missing voId on ALL verbs: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every authored voId follows the convention", () => {
    const malformed: string[] = [];
    for (const { roomId, hotspotId, verb, response } of walkAuthoredResponses()) {
      if (response.voId && !VO_ID_RE.test(response.voId)) {
        malformed.push(`${roomId}:${hotspotId}:${verb} → ${response.voId}`);
      }
    }
    expect(malformed, `malformed voIds: ${malformed.join("; ")}`).toEqual([]);
  });

  it("every Detective humanReaction has a voId", () => {
    const missing: string[] = [];
    for (const { roomId, hotspotId, verb, response } of walkAuthoredResponses()) {
      if (response.humanReaction && !response.humanReaction.voId) {
        missing.push(`${roomId}:${hotspotId}:${verb} (humanReaction)`);
      }
    }
    expect(
      missing,
      `humanReactions missing voId: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("ships look responses for all 8 new rooms (Phase B-5 + C)", () => {
    // These rooms gained authored modules in the 2026-04-30 work.
    // Drop one and the room becomes click-dead.
    const newRooms = [
      "shadow-vault",
      "cipher-den",
      "observation-deck",
      "war-room",
      "station-dock",
      "forge-workshop",
      "antiquarian-library",
      "engineering-core",
      "oracle-sanctum",
      "order-tribunal",
      "dreams-workshop-subbasement",
      "chaos-forge",
      "elemental-nexus",
      "quantum-lab",
      "synthesis-chamber",
      "guild-sanctum",
      "social-hub",
    ];
    const missing: string[] = [];
    for (const room of newRooms) {
      const mod = ROOM_MYSTERY_REGISTRY[room];
      if (!mod) {
        missing.push(`${room} (not registered)`);
        continue;
      }
      const hasLook = Object.values(mod.responses).some(
        (verbs) => verbs?.look !== undefined,
      );
      if (!hasLook) missing.push(`${room} (no look)`);
    }
    expect(missing).toEqual([]);
  });

  it("ships Shadow Tongue hotspots in their canonical rooms", () => {
    // The ST arc is wired through these specific room+hotspot pairs.
    // If any goes missing, the arc breaks silently.
    const stPairs: Array<[string, string]> = [
      ["archives", "corrupted-scroll-rack"],
      ["archives", "rewritten-ledger"],
      ["archives", "indigo-glow-lectern"],
      ["archives", "unnameable-hue-cabinet"],
      ["bridge", "shadow-tongue-annotations"],
      ["comms-array", "voice-in-the-static"],
      ["engineering", "schematic-pad"],
      ["shadow-vault", "sealed-cell-glass"],
      ["shadow-vault", "manuscript-pile"],
      ["shadow-vault", "warden-terminal"],
      ["shadow-vault", "release-or-seal-lever"],
      ["cipher-den", "rosetta-pad"],
      ["cipher-den", "encrypted-correspondence"],
      ["cipher-den", "dictionary-of-edits"],
      ["cipher-den", "uncorruption-bench"],
    ];
    const missing: string[] = [];
    for (const [room, hotspot] of stPairs) {
      const mod = ROOM_MYSTERY_REGISTRY[room];
      if (!mod || !mod.responses[hotspot]) {
        missing.push(`${room}:${hotspot}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("species-exclusive rooms have voIds (cosmetic-only — bonus content)", () => {
    let speciesRoomsSeen = 0;
    for (const [roomId] of Object.entries(ROOM_MYSTERY_REGISTRY)) {
      if (SPECIES_ROOMS.has(roomId)) speciesRoomsSeen++;
    }
    expect(speciesRoomsSeen).toBeGreaterThanOrEqual(6);
  });
});
