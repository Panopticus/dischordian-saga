import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { BEAT_C_ROLE_OPTIONS } from "./BeatCCrewRoleChoice";

/* Pure-data and structural tests for Beat C's post-cutscene
   crew-role picker. Interactive DOM tests are deferred to the e2e
   suite; these guarantee the canonical option set. */

describe("BeatCCrewRoleChoice — role options table", () => {
  it("exposes exactly three canonical role ids in fixed order", () => {
    expect(BEAT_C_ROLE_OPTIONS.map((o) => o.id)).toEqual([
      "engineer",
      "assassin",
      "oracle",
    ]);
  });

  it("each option raises a distinct `prelude_beat_c_role_<id>` flag", () => {
    const flags = new Set<string>();
    for (const opt of BEAT_C_ROLE_OPTIONS) {
      expect(opt.flag).toBe(`prelude_beat_c_role_${opt.id}`);
      flags.add(opt.flag);
    }
    expect(flags.size).toBe(BEAT_C_ROLE_OPTIONS.length);
  });

  it("positions each option inside the visible frame (0-100%)", () => {
    for (const opt of BEAT_C_ROLE_OPTIONS) {
      expect(opt.leftPct).toBeGreaterThanOrEqual(0);
      expect(opt.leftPct).toBeLessThanOrEqual(100);
      expect(opt.topPct).toBeGreaterThanOrEqual(0);
      expect(opt.topPct).toBeLessThanOrEqual(100);
    }
  });

  it("each option has a non-empty blurb and label", () => {
    for (const opt of BEAT_C_ROLE_OPTIONS) {
      expect(opt.label.length).toBeGreaterThan(0);
      expect(opt.blurb.length).toBeGreaterThan(8);
    }
  });
});

describe("BeatCCrewRoleChoice — source contract", () => {
  const componentSrc = fs.readFileSync(
    path.resolve(__dirname, "BeatCCrewRoleChoice.tsx"),
    "utf-8",
  );

  it("sets `prelude_beat_c_role_chosen` alongside the per-role flag", () => {
    expect(componentSrc).toContain('"prelude_beat_c_role_chosen"');
  });

  it("fires a companion comment on pick (uses fireCompanionComment)", () => {
    expect(componentSrc).toContain("fireCompanionComment");
  });

  it("disables the button cluster after a commit so the pick is final", () => {
    expect(componentSrc).toContain("picked !== null && picked !== opt.id");
  });
});
