/**
 * Structural tests for SagaStatusPanel.
 *
 * Verifies the panel reads through the canon-anchored renderer
 * (renderSagaStatus) rather than reaching directly into the
 * foundation registries (sagaPhases / mysteryEngineCanon /
 * crossArcReactivity / realWorldChronicle).
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "SagaStatusPanel.tsx"),
  "utf-8",
);

describe("SagaStatusPanel — canonical wiring", () => {
  it("reads through the renderer, not the foundation registries", () => {
    expect(src).toContain('from "@shared/sagaStatusRenderer"');
    expect(src).toContain("renderSagaStatus");
    // The panel may import a type from sagaPhases (SagaPhaseInput)
    // but must NOT reach for runtime values from the other foundation
    // registries — the renderer is the only allowed indirection.
    expect(src).not.toContain('from "@shared/mysteryEngineCanon"');
    expect(src).not.toContain('from "@shared/crossArcReactivity"');
    expect(src).not.toContain('from "@shared/realWorldChronicle"');
  });

  it("imports SagaPhaseInput as type-only (canon-anchored shape)", () => {
    expect(src).toContain('import type { SagaPhaseInput }');
  });

  it("subscribes to narrativeAct + narrativeFlags from GameContext", () => {
    expect(src).toContain("state.narrativeAct");
    expect(src).toContain("state.narrativeFlags");
  });

  it("renders the four foundation surfaces", () => {
    // Each section should be present + labeled.
    expect(src).toMatch(/data-section="phase"/);
    expect(src).toMatch(/data-section="mysteries"/);
    expect(src).toMatch(/data-section="cross-arcs"/);
    expect(src).toMatch(/data-section="real-world"/);
  });

  it("memoizes the payload so re-renders only fire when act/flags change", () => {
    expect(src).toContain("useMemo");
    expect(src).toContain("renderSagaStatus(input, todayIso())");
  });

  it("supplies an ARIA progressbar with bounded values", () => {
    expect(src).toContain('role="progressbar"');
    expect(src).toContain('aria-valuemin={0}');
    expect(src).toContain('aria-valuemax={100}');
  });
});
