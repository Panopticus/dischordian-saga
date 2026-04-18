/**
 * Audit 4A — morality visibly changes the world.
 *
 * ELARA_MORALITY_VARIANTS was authored against an older room
 * schema (command-bridge / engine-room / garden-biodome /
 * security-hub). The canonical room schema (GameContext.tsx
 * ROOM_DEFINITIONS) uses bridge / engineering / archives /
 * observation-deck / ... — two rooms match by coincidence
 * (archives + observation-deck), the rest don't.
 *
 * The getElaraVariant remap bridges the gap. This test locks:
 *   1. The remap maps bridge → command-bridge and
 *      engineering → engine-room correctly.
 *   2. The canonical ids that DO match (archives,
 *      observation-deck) pass through unchanged.
 *   3. The remap surfaces a morality-variant line when the
 *      player's morality crosses the threshold.
 *
 * A separate test asserts that every roomId referenced in
 * ELARA_MORALITY_VARIANTS is EITHER a canonical room id or
 * a known variant-only id (biodome / security-hub) documented
 * as pending canon. If a new variant lands without a canonical
 * mapping, the test fails loudly so content authors add the
 * remap row before shipping.
 */
import { describe, it, expect } from "vitest";
import {
  ELARA_MORALITY_VARIANTS,
  getElaraVariant,
} from "./moralityStoryBranches";

/** Canonical room ids from GameContext.tsx ROOM_DEFINITIONS
 *  that the Elara-variant remap should recognize. Sourced by
 *  reading ROOM_DEFINITIONS in the component tree; if the canon
 *  expands, add entries here. */
const CANONICAL_ROOM_IDS = new Set([
  "cryo-bay",
  "medical-bay",
  "bridge",
  "archives",
  "observation-deck",
  "comms-array",
  "engineering",
  "armory",
  "chaos-forge",
  "guild-sanctum",
  "quantum-lab",
  "shadow-vault",
]);

/** Variant-only room ids that don't yet have a canonical
 *  equivalent. Documented as pending canon; their variants
 *  silently never fire until those rooms land. */
const PENDING_CANON_ROOM_IDS = new Set([
  "security-hub",
  "garden-biodome",
]);

describe("Audit 4A — getElaraVariant remaps bridge + engineering", () => {
  it("bridge (canonical) → command-bridge (variant) — humanityDialog at +30", () => {
    // Morality +30 pulls the humanityDialog branch (score <60
    // so deep variant doesn't trigger).
    const line = getElaraVariant(30, "bridge");
    expect(line).toContain("remind me of the original captain");
  });

  it("bridge (canonical) → command-bridge (variant) — deep humanity at +60", () => {
    const line = getElaraVariant(60, "bridge");
    // Deep humanity on the bridge is the "warmth about you ...
    // captain would have loved you" line (deepHumanityDialog).
    expect(line).toContain("captain would have loved you");
  });

  it("engineering (canonical) → engine-room (variant)", () => {
    const line = getElaraVariant(30, "engineering");
    expect(line).toContain("engineering crew scratched their names");
  });

  it("archives + observation-deck pass through (id already matches)", () => {
    expect(getElaraVariant(60, "archives")).toBeTruthy();
    expect(getElaraVariant(60, "observation-deck")).toBeTruthy();
  });

  it("unknown room → null (graceful fallback)", () => {
    expect(getElaraVariant(60, "nonexistent-room")).toBeNull();
  });

  it("neutral morality (|score| < 30) → null (use default dialog)", () => {
    expect(getElaraVariant(0, "bridge")).toBeNull();
    expect(getElaraVariant(20, "bridge")).toBeNull();
    expect(getElaraVariant(-20, "bridge")).toBeNull();
  });

  it("machine morality pulls machineDialog", () => {
    const line = getElaraVariant(-40, "bridge");
    expect(line).toContain("tactical systems than the crew logs");
  });

  it("deep machine pulls deepMachineDialog when available", () => {
    const line = getElaraVariant(-80, "bridge");
    // bridge's deepMachineDialog is the "warmth" line? No — that's
    // deepHumanityDialog. Deep machine reads as cold efficiency.
    expect(line).toContain("neural patterns");
  });
});

describe("Audit 4A — variant-room-id inventory matches canon", () => {
  it("every ELARA_MORALITY_VARIANTS roomId is canonical or pending-canon", () => {
    const unknown: string[] = [];
    for (const variant of ELARA_MORALITY_VARIANTS) {
      // Variant ids land directly (archives, observation-deck) OR
      // are the target of a canonical remap (command-bridge,
      // engine-room) OR are documented pending canon.
      const isCanonical = CANONICAL_ROOM_IDS.has(variant.roomId);
      const isRemapTarget =
        variant.roomId === "command-bridge" ||
        variant.roomId === "engine-room";
      const isPendingCanon = PENDING_CANON_ROOM_IDS.has(variant.roomId);
      if (!isCanonical && !isRemapTarget && !isPendingCanon) {
        unknown.push(variant.roomId);
      }
    }
    expect(
      unknown,
      `Unknown variant roomIds (not canonical, not remapped, not documented pending): ${unknown.join(", ")}. Update the remap or add to PENDING_CANON_ROOM_IDS.`,
    ).toEqual([]);
  });
});
