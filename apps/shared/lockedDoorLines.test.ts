// F11 — every (roomId, gate) resolver result points to lines that exist
// in the combined companion registry.

import { describe, it, expect } from "vitest";
import { LOCKED_DOOR_LINES, lockedDoorLineId } from "./lockedDoorLines";
import { ELARA_LINES } from "./elaraLines";
import { HUMAN_LINES } from "./humanLines";

const ALL_LINE_IDS = new Set<string>([
  ...LOCKED_DOOR_LINES.map(l => l.lineId),
  ...ELARA_LINES.map(l => l.lineId),
  ...HUMAN_LINES.map(l => l.lineId),
]);

function resolvesToKnownVariants(ref: string): boolean {
  if (!ref.endsWith("_*")) return ALL_LINE_IDS.has(ref);
  const base = ref.slice(0, -2);
  // At least one of the canonical band suffixes must exist.
  const candidates = [
    `${base}_lucid`, `${base}_fragmented`, `${base}_luminous`,
    `${base}_shadow`, `${base}_balanced`, `${base}_warm`,
  ];
  return candidates.some(c => ALL_LINE_IDS.has(c));
}

describe("lockedDoorLineId", () => {
  const rooms = ["medical-bay", "bridge", "engineering", "comms-array", "armory", "cargo-bay", "captains-quarters"];
  const ctxMatrix = [
    { preludeComplete: false, bridgeDesignationFound: false },
    { preludeComplete: false, bridgeDesignationFound: true },
    { preludeComplete: true, bridgeDesignationFound: false },
    { preludeComplete: true, bridgeDesignationFound: true },
  ];

  it("every (roomId, ctx) pair resolves to an authored line ref", () => {
    for (const room of rooms) {
      for (const ctx of ctxMatrix) {
        const ref = lockedDoorLineId(room, "prelude", ctx);
        expect(resolvesToKnownVariants(ref), `${room} @ ${JSON.stringify(ctx)} → ${ref}`).toBe(true);
      }
    }
  });

  it("unknown rooms fall through to the generic line", () => {
    const ref = lockedDoorLineId("nonexistent-room", "prelude", {
      preludeComplete: false,
      bridgeDesignationFound: false,
    });
    expect(ref).toBe("locked_generic_*");
    expect(resolvesToKnownVariants(ref)).toBe(true);
  });

  it("medical-bay toggles between prelude and postprelude variants", () => {
    const pre = lockedDoorLineId("medical-bay", "prelude", {
      preludeComplete: false,
      bridgeDesignationFound: false,
    });
    const post = lockedDoorLineId("medical-bay", "prelude", {
      preludeComplete: true,
      bridgeDesignationFound: false,
    });
    expect(pre).toContain("prelude");
    expect(post).toContain("postprelude");
    expect(pre).not.toBe(post);
  });

  it("bridge swaps to clued variant when designation found", () => {
    const noClue = lockedDoorLineId("bridge", "prelude", {
      preludeComplete: false,
      bridgeDesignationFound: false,
    });
    const clued = lockedDoorLineId("bridge", "prelude", {
      preludeComplete: false,
      bridgeDesignationFound: true,
    });
    expect(noClue).toContain("noclue");
    expect(clued).toContain("clued");
  });
});
