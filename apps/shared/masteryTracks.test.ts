import { describe, it, expect } from "vitest";
import { NARRATIVE_SPINE } from "./narrativeSpine";
import {
  MASTERY_TRACKS,
  getMasteryTrack,
  getMasteryTrackCoverage,
} from "./masteryTracks";
import { checkMasteryTrackCoverage } from "./_completeness/checks/masteryTrackCoverage";

describe("mastery tracks", () => {
  it("one track per spine system, unique premise ids", () => {
    const ids = MASTERY_TRACKS.map((t) => t.premiseId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const b of NARRATIVE_SPINE) {
      expect(
        getMasteryTrack(b.revealsPremiseId),
        `spine system '${b.revealsPremiseId}' must have a mastery track`,
      ).toBeDefined();
    }
  });

  it("every track has a name and a play→grow loop line", () => {
    for (const t of MASTERY_TRACKS) {
      expect(t.track.trim().length).toBeGreaterThan(0);
      expect(t.loop).toMatch(/→/);
    }
  });

  it("coverage is spine-driven and complete", () => {
    const c = getMasteryTrackCoverage();
    expect(c.bound).toBe(c.declared);
  });
});

describe("mastery track coverage gate", () => {
  it("is hard-parity PASS — every spine system has a real growth track", () => {
    const r = checkMasteryTrackCoverage();
    expect(r.missing ?? []).toEqual([]);
    expect(r.implemented).toBe(r.declared);
  });
});
