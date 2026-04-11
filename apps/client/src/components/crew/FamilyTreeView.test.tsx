/**
 * Structural smoke test for FamilyTreeView.
 *
 * Per repo convention we don't render the component here — a real
 * layout regression test would need jsdom + @testing-library/react,
 * which aren't in the dependency tree. We verify the component
 * exports a function; the deterministic parts of the tree layout
 * (generation grouping, filter default choice) are covered by the
 * crewBreeding.test.ts tick/state tests.
 */
import { describe, it, expect } from "vitest";
import FamilyTreeView from "./FamilyTreeView";

describe("FamilyTreeView", () => {
  it("exports a component function as default", () => {
    expect(FamilyTreeView).toBeDefined();
    expect(typeof FamilyTreeView).toBe("function");
  });
});
