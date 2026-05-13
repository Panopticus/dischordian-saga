/* ═══════════════════════════════════════════════════════
   SAGA STATUS RENDERER — integration tests

   Verifies the renderer correctly composes all four foundation
   surfaces (saga phases / mystery engines / cross-arcs / real-
   world chronicle) into a coherent display payload.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  countActiveCrossArcThreads,
  renderCrossArcPreviews,
  renderMysteryEngineCatalog,
  renderNextStepHint,
  renderPhaseChronicleCaption,
  renderRealWorldChronicle,
  renderSagaPhaseStatus,
  renderSagaStatus,
} from "./sagaStatusRenderer";
import type { SagaPhaseInput } from "./sagaPhases";

const state = (
  narrativeAct: number,
  flags: Record<string, boolean> = {},
): SagaPhaseInput => ({ narrativeAct, flags });

describe("renderSagaPhaseStatus", () => {
  it("returns Phase 0 payload for narrativeAct 0", () => {
    const p = renderSagaPhaseStatus(state(0));
    expect(p.currentPhase).toBe(0);
    expect(p.currentPhaseDefinition.title).toMatch(/Prelude/);
    expect(p.panelTitle).toContain("Phase 0");
    expect(p.progressPercent).toBe(0);
  });

  it("returns Phase 1 payload for narrativeAct 1 + act_1_started", () => {
    const p = renderSagaPhaseStatus(state(1, { act_1_started: true }));
    expect(p.currentPhase).toBe(1);
    expect(p.currentPhaseDefinition.title).toMatch(/Awakening/);
    expect(p.completedPhases).toEqual([0]);
  });

  it("computes progressPercent as currentPhase/14 rounded", () => {
    expect(renderSagaPhaseStatus(state(0)).progressPercent).toBe(0);
    // narrativeAct 7 / act_7_started -> Phase 12
    expect(
      renderSagaPhaseStatus(state(7, { act_7_started: true })).progressPercent,
    ).toBe(86); // 12/14 = 0.857 -> 86
  });

  it("returns nextPhaseGuidance for non-terminal phases", () => {
    const p = renderSagaPhaseStatus(state(2, { act_2_started: true }));
    expect(p.nextPhaseGuidance).not.toBeNull();
    expect(p.nextPhaseGuidance!.phase).toBe(4);
  });

  it("returns null nextPhaseGuidance at Phase 14", () => {
    const p = renderSagaPhaseStatus(state(99));
    expect(p.currentPhase).toBe(14);
    expect(p.nextPhaseGuidance).toBeNull();
  });
});

describe("renderMysteryEngineCatalog", () => {
  it("returns 0 available arcs at narrativeAct 1", () => {
    const p = renderMysteryEngineCatalog(state(1));
    expect(p.availableCount).toBe(0);
    expect(p.upcomingArcs.length).toBeGreaterThan(0);
  });

  it("returns Wraith/Jericho/Seer arcs at narrativeAct 2", () => {
    const p = renderMysteryEngineCatalog(state(2));
    const ids = p.availableArcs.map((a) => a.arcId).sort();
    expect(ids).toEqual([
      "arc.jericho_jones",
      "arc.the_seer",
      "arc.wraith_calder",
    ]);
  });

  it("returns all 6 canonical arcs at narrativeAct 5+", () => {
    const p = renderMysteryEngineCatalog(state(5));
    expect(p.availableCount).toBe(6);
    expect(p.upcomingArcs).toHaveLength(0);
    expect(p.totalCount).toBe(6);
  });
});

describe("renderCrossArcPreviews", () => {
  it("returns 0 active bindings when no arcs are available", () => {
    const p = renderCrossArcPreviews(state(1));
    expect(p.activeBindings).toHaveLength(0);
    expect(p.totalBindings).toBe(6);
  });

  it("returns bindings sourced from Wraith / Jericho at Act 2", () => {
    const p = renderCrossArcPreviews(state(2));
    // Bindings whose sourceArc is wraith / jericho should appear;
    // Vex's binding (sourceArc vex, unlock act 5) should NOT.
    const sourceArcs = new Set<string>(
      p.activeBindings.map((b) => b.sourceArc as unknown as string),
    );
    expect(sourceArcs.has("arc.wraith_calder")).toBe(true);
    expect(sourceArcs.has("arc.jericho_jones")).toBe(true);
    expect(sourceArcs.has("arc.vex_solene")).toBe(false);
  });

  it("returns all 6 bindings at full saga (Act 5+)", () => {
    const p = renderCrossArcPreviews(state(5));
    expect(p.activeBindings).toHaveLength(6);
  });

  it("every preview has non-empty text", () => {
    const p = renderCrossArcPreviews(state(5));
    for (const item of p.previews) {
      expect(item.previewText.length).toBeGreaterThan(50);
    }
  });
});

describe("renderRealWorldChronicle", () => {
  it("returns Nairobi 2027 as next trip on 2026-12-01", () => {
    const p = renderRealWorldChronicle("2026-12-01");
    expect(p.nextTrip?.id).toBe("nairobi_2027");
    expect(p.hasPartnership).toBe(true);
  });

  it("returns DC 2027 as next trip on 2027-03-01", () => {
    const p = renderRealWorldChronicle("2027-03-01");
    expect(p.nextTrip?.id).toBe("dc_2027");
    expect(p.hasPartnership).toBe(false);
  });

  it("returns daysUntilNextTrip with correct sign", () => {
    const p = renderRealWorldChronicle("2027-01-02");
    expect(p.daysUntilNextTrip).toBeGreaterThan(0); // Nairobi starts 2027-02-02
    expect(p.daysUntilNextTrip).toBeLessThan(35);
  });

  it("returns null trip when no future scheduled trips remain", () => {
    const p = renderRealWorldChronicle("2030-01-01");
    expect(p.nextTrip).toBeNull();
    expect(p.daysUntilNextTrip).toBeNull();
    expect(p.hasPartnership).toBe(false);
  });
});

describe("renderSagaStatus (top-level composition)", () => {
  it("composes all four surfaces into one payload", () => {
    const p = renderSagaStatus(
      state(3, { act_3_started: true }),
      "2026-12-01",
    );
    expect(p.phase.currentPhase).toBe(5);
    expect(p.mysteries.availableCount).toBeGreaterThan(0);
    expect(p.crossArcs.totalBindings).toBe(6);
    expect(p.realWorld.nextTrip?.id).toBe("nairobi_2027");
  });

  it("payload is JSON-serializable (no cyclic refs)", () => {
    const p = renderSagaStatus(state(5), "2026-12-01");
    // Roundtrip via JSON to verify no cyclic structures.
    const serialized = JSON.stringify(p);
    expect(serialized.length).toBeGreaterThan(100);
    const parsed = JSON.parse(serialized);
    expect(parsed.phase.currentPhase).toBe(p.phase.currentPhase);
  });
});

describe("renderNextStepHint", () => {
  it("returns 'your path continues' hint for non-terminal phases", () => {
    const hint = renderNextStepHint(state(1, { act_1_started: true }));
    expect(hint).toMatch(/path continues/i);
    expect(hint).toMatch(/Phase 2/);
  });

  it("returns the SHA-era hint at Phase 14", () => {
    const hint = renderNextStepHint(state(99));
    expect(hint).toMatch(/saga is complete/i);
    expect(hint).toMatch(/Servant Hero Academy/);
  });
});

describe("renderPhaseChronicleCaption", () => {
  it("returns a Codex-header caption for any phase", () => {
    const cap = renderPhaseChronicleCaption(0);
    expect(cap).toMatch(/Phase 0/);
    expect(cap).toMatch(/Prelude/);
    expect(cap.length).toBeGreaterThan(80);
  });

  it("includes premise text", () => {
    const cap = renderPhaseChronicleCaption(11);
    expect(cap).toMatch(/Agent Zero Death Reveal/i);
  });
});

describe("countActiveCrossArcThreads", () => {
  it("returns 0 at Act 1", () => {
    expect(countActiveCrossArcThreads(state(1))).toBe(0);
  });

  it("returns 6 at full saga (Act 5+)", () => {
    expect(countActiveCrossArcThreads(state(5))).toBe(6);
  });
});
