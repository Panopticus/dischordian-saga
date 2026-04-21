/**
 * Structural tests for EngineerRecordingDiscoveryModal.
 *
 * Verifies the modal imports the canonical recording registry,
 * reads the discovery flag from useGame state, and queues
 * sequential reveals by recording order. Source-scan style
 * matches the other Act 2 component tests.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "EngineerRecordingDiscoveryModal.tsx"),
  "utf-8",
);

describe("EngineerRecordingDiscoveryModal — imports", () => {
  it("imports the canonical ENGINEER_RECORDINGS registry", () => {
    expect(src).toContain("ENGINEER_RECORDINGS");
    expect(src).toContain('from "@shared/engineerRecordings"');
  });

  it("reads narrativeFlags via useGame()", () => {
    expect(src).toContain("useGame()");
    expect(src).toContain("narrativeFlags");
  });
});

describe("EngineerRecordingDiscoveryModal — queue semantics", () => {
  it("filters by r.discoveryFlag to detect unlocked recordings", () => {
    expect(src).toContain("r.discoveryFlag");
    expect(src).toContain("flags[r.discoveryFlag]");
  });

  it("sorts queued recordings by canonical `order`", () => {
    expect(src).toContain("a.order - b.order");
  });

  it("guards against re-showing via a per-session ref", () => {
    expect(src).toContain("shownThisSessionRef");
  });
});

describe("EngineerRecordingDiscoveryModal — content surfaces", () => {
  it("renders transcript + both NPC reaction slots", () => {
    expect(src).toContain("active.transcript");
    expect(src).toContain("active.npcReactions.elara");
    expect(src).toContain("active.npcReactions.the_human");
  });

  it("never writes narrative flags itself (read-only surface)", () => {
    expect(src).not.toContain("setNarrativeFlag");
  });
});
