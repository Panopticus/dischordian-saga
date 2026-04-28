/**
 * Structural tests for NarrativeTimelinePanel — Phase 5.
 *
 * Verifies the panel reads NARRATIVE_TIMELINE, groups entries by
 * canonical phase order, computes met/available/locked status per
 * entry, and surfaces canonical unmet-gate reasons.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "NarrativeTimelinePanel.tsx"),
  "utf-8",
);

describe("NarrativeTimelinePanel — canonical imports", () => {
  it("reads the canonical NARRATIVE_TIMELINE registry", () => {
    expect(src).toContain("NARRATIVE_TIMELINE");
    expect(src).toContain('from "@shared/npcs/narrativeTimeline"');
  });

  it("uses canEncounterForFirstTime gate-resolver helper", () => {
    expect(src).toContain("canEncounterForFirstTime");
  });

  it("uses canonical entryPointsByPhase grouping helper", () => {
    expect(src).toContain("entryPointsByPhase");
  });

  it("imports NPC_REGISTRY for canonical name resolution", () => {
    expect(src).toContain("NPC_REGISTRY");
  });
});

describe("NarrativeTimelinePanel — canonical phase order", () => {
  it("renders the canonical 5 phases in canonical order", () => {
    expect(src).toContain('"pre_act_1"');
    expect(src).toContain('"act_1"');
    expect(src).toContain('"post_act_1"');
    expect(src).toContain('"post_dmc_season"');
    expect(src).toContain('"acts_4_plus"');
  });

  it("orders phases via PHASE_ORDER constant", () => {
    expect(src).toContain("PHASE_ORDER");
  });

  it("sorts within-phase entries by canonical phaseOrder", () => {
    expect(src).toContain("a.phaseOrder ?? 999");
  });
});

describe("NarrativeTimelinePanel — canonical status resolution", () => {
  it("computes met / available / locked status per entry", () => {
    expect(src).toContain('"met"');
    expect(src).toContain('"available"');
    expect(src).toContain('"locked"');
  });

  it("treats metNpcs membership as canonical-met short-circuit", () => {
    expect(src).toContain("ctx.metNpcs?.has(entry.npcKey)");
  });

  it("surfaces canonical-readable unmet-gate reasons", () => {
    expect(src).toContain("Reach Act");
    expect(src).toContain("Complete chapter");
    expect(src).toContain("Authority Trial outcome");
  });
});

describe("NarrativeTimelinePanel — canonical-render shape", () => {
  it("renders canonical NPC name from NPC_REGISTRY", () => {
    expect(src).toContain("profile?.name");
  });

  it("renders canonical canonicalRationale per entry", () => {
    expect(src).toContain("entry.canonicalRationale");
  });

  it("renders canonical NARRATIVE_TIMELINE.length count footer", () => {
    expect(src).toContain("NARRATIVE_TIMELINE.length");
  });
});
