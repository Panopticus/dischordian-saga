import { describe, it, expect } from "vitest";
// @ts-expect-error — .mjs sibling has no type decls; runtime import is fine.
import { transformSource } from "../../scripts/void-energy-migrate.mjs";

describe("scripts/void-energy-migrate transformSource", () => {
  it("preserves opacity modifiers on already-void classes (regression: stripped /40 → 100%)", () => {
    const src = `<div className="border border-void-text-accent/40 bg-void-bg/60" />`;
    expect(transformSource(src)).toBe(src);
  });

  it("preserves all void token families with opacity (real-codebase shapes)", () => {
    const cases = [
      // Sampled from actual usage in apps/client/src/components/**.tsx
      "border-void-text-accent/40",
      "border-void-text-accent/60",
      "text-void-text-accent/80",
      "bg-void-bg/20",
      "bg-void-bg/40",
      "bg-void-bg/60",
      "bg-void-bg/70",
      "bg-void-bg/90",
      "border-void-border/30",
      "border-void-border/40",
      "border-void-border/60",
    ];
    for (const cls of cases) {
      const src = `<div className="${cls}" />`;
      expect(transformSource(src), `expected ${cls} to be preserved`).toBe(src);
    }
  });

  it("still maps Tailwind color ramps to void tokens (no regression on the core recipe)", () => {
    expect(transformSource(`<div className="text-amber-500" />`))
      .toBe(`<div className="void-text-accent" />`);
    expect(transformSource(`<div className="bg-red-500" />`))
      .toBe(`<div className="void-bg-error" />`);
    expect(transformSource(`<div className="border-purple-400" />`))
      .toBe(`<div className="void-border-system" />`);
  });

  it("still maps known hex literals to design tokens", () => {
    expect(transformSource(`color: #22d3ee;`)).toBe(`color: var(--energy-primary);`);
    expect(transformSource(`color: #EF4444;`)).toBe(`color: var(--energy-error);`);
  });

  it("still strips hover: prefix from void classes (Law 4 — state belongs in data-attrs)", () => {
    expect(transformSource(`<div className="hover:void-text-accent" />`))
      .toBe(`<div className="void-text-accent" />`);
  });
});
