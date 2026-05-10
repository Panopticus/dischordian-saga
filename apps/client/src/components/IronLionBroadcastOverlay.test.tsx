/**
 * Structural tests for IronLionBroadcastOverlay — verify the
 * overlay reads the canonical pendingIronLionBroadcast queue
 * helper and wires the dismiss handler to setNarrativeFlag on
 * the broadcast's seenFlag.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "IronLionBroadcastOverlay.tsx"),
  "utf-8",
);

describe("IronLionBroadcastOverlay — wiring", () => {
  it("imports pendingIronLionBroadcast from the canonical shared module", () => {
    expect(src).toContain("pendingIronLionBroadcast");
    expect(src).toContain('from "@shared/ironLionBroadcasts"');
  });

  it("computes the pending broadcast from the player's narrative flags", () => {
    expect(src).toMatch(/pendingIronLionBroadcast\(flags\)/);
  });

  it("dismiss handler writes the canonical seenFlag", () => {
    expect(src).toMatch(/setNarrativeFlag\(broadcast\.seenFlag,\s*true\)/);
  });

  it("renders the transcript and per-broadcast metadata", () => {
    expect(src).toContain("broadcast.transcript");
    expect(src).toContain("broadcast.title");
    expect(src).toContain("broadcast.sequenceIndex");
    expect(src).toContain("broadcast.pairedMission");
  });

  it("returns null when no broadcast is pending (overlay does not mount otherwise)", () => {
    expect(src).toMatch(/if \(!broadcast\) return null/);
  });
});
