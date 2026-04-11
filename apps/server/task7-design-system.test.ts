import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 7 — Design system consolidation
   7.1  CSS de-duplication + missing palette tokens
   7.2  Physics-aware motion primitives library
   ═══════════════════════════════════════════════════════ */

/* ─── TASK 7.1a — CSS consolidation status ─── */
describe("Task 7.1 — CSS consolidation", () => {
  const physicsSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/styles/void-physics.css"),
    "utf-8",
  );
  const materialsSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/engine/void-materials.css"),
    "utf-8",
  );

  it("void-physics.css is intentionally empty (consolidated stub)", () => {
    expect(physicsSrc).toContain("CONSOLIDATED INTO void-materials.css");
    // Make sure no rule blocks accidentally drift back in
    expect(physicsSrc).not.toMatch(/\.void-surface\s*\{/);
    expect(physicsSrc).not.toMatch(/\.void-elevated\s*\{/);
  });

  it("void-materials.css is the single source of truth", () => {
    expect(materialsSrc).toContain("Single source of truth");
    expect(materialsSrc).toContain('[data-physics="glass"] .void-surface');
    expect(materialsSrc).toContain('[data-physics="flat"] .void-surface');
    expect(materialsSrc).toContain('[data-physics="retro"] .void-surface');
  });

  it("material rules cover all three physics types for elevated tier too", () => {
    expect(materialsSrc).toContain('[data-physics="glass"] .void-elevated');
    expect(materialsSrc).toContain('[data-physics="flat"] .void-elevated');
    expect(materialsSrc).toContain('[data-physics="retro"] .void-elevated');
  });

  it("hover variants live in materials, not physics", () => {
    expect(materialsSrc).toContain('[data-physics="glass"] .void-surface:hover');
  });
});

/* ─── TASK 7.1b — 5 missing palette tokens ─── */
describe("Task 7.1 — palette tokens", () => {
  const materialsSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/engine/void-materials.css"),
    "utf-8",
  );

  const REQUIRED_TOKENS = [
    "--ve-bg-sunk",
    "--ve-bg-spotlight",
    "--ve-energy-secondary",
    "--ve-color-premium",
    "--ve-color-system",
  ];

  for (const token of REQUIRED_TOKENS) {
    it(`declares ${token} in :root`, () => {
      expect(materialsSrc).toContain(`${token}:`);
    });
  }

  it("each token has a fallback chain to a baseline color", () => {
    // Make sure the var() fallback chain exists so the token still
    // resolves outside of an [data-atmosphere] scope.
    expect(materialsSrc).toMatch(/--ve-bg-sunk:\s*var\(/);
    expect(materialsSrc).toMatch(/--ve-bg-spotlight:\s*var\(/);
    expect(materialsSrc).toMatch(/--ve-energy-secondary:\s*var\(/);
    expect(materialsSrc).toMatch(/--ve-color-premium:\s*var\(/);
    expect(materialsSrc).toMatch(/--ve-color-system:\s*var\(/);
  });

  it("documents the Task 7.1 palette block", () => {
    expect(materialsSrc).toContain("Task 7.1");
    expect(materialsSrc).toMatch(/PALETTE TOKENS/);
  });
});

/* ─── TASK 7.2 — motionPrimitives library ─── */
describe("Task 7.2 — motionPrimitives library", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "../client/src/lib/motionPrimitives.ts"),
    "utf-8",
  );

  it("exports getPhysics SSR-safe helper", () => {
    expect(src).toContain("export function getPhysics");
    expect(src).toMatch(/typeof document === "undefined"/);
  });

  it("exports the canonical six primitives", () => {
    expect(src).toContain("export function materialize");
    expect(src).toContain("export function dematerialize");
    expect(src).toContain("export function emerge");
    expect(src).toContain("export function dissolve");
    expect(src).toContain("export function implode");
    expect(src).toContain("export function live");
  });

  it("exports a name → factory map for enumeration", () => {
    expect(src).toContain("export const motionPrimitives");
    expect(src).toContain("materialize,");
    expect(src).toContain("dematerialize,");
  });

  it("primitives are pure factories — not pre-baked constants", () => {
    // The factory pattern is essential because physics can flip
    // at runtime. A cached `const variants = materialize()` would
    // freeze the first physics value.
    expect(src).toMatch(/export function materialize\(\): Variants/);
    expect(src).toContain("const physics = getPhysics()");
  });

  it("retro physics returns 0 ms duration (instant)", () => {
    expect(src).toMatch(/if \(physics === "retro"\) return 0/);
  });

  it("only glass uses backdrop blur", () => {
    expect(src).toContain('if (physics === "glass") return `blur(');
    expect(src).toContain('return "blur(0px)"');
  });

  it("dissolve is a pure opacity crossfade with no movement", () => {
    // Pull just the dissolve function body and assert it has no
    // y/scale/filter keys.
    const m = src.match(/export function dissolve\(\)[\s\S]*?\n\}/);
    expect(m).toBeTruthy();
    const body = m![0];
    expect(body).toContain("opacity: 0");
    expect(body).toContain("opacity: 1");
    expect(body).not.toMatch(/^\s*y:/m);
    expect(body).not.toMatch(/^\s*scale:/m);
    expect(body).not.toMatch(/^\s*filter:/m);
  });

  it("emerge animates height from 0 to auto with delayed opacity", () => {
    expect(src).toMatch(/emerge[\s\S]{0,500}height:\s*0/);
    expect(src).toMatch(/emerge[\s\S]{0,500}height:\s*"auto"/);
    expect(src).toMatch(/opacity:\s*\{\s*duration:\s*opacityDur,\s*delay:\s*opacityDelay/);
  });

  it("live() returns a still variant in retro to disable animation", () => {
    expect(src).toMatch(/if \(physics === "retro"\)[\s\S]{0,200}return\s*\{[\s\S]{0,100}animate:\s*\{\s*opacity:\s*1\s*\}/);
  });

  it("documents the Task 7.2 design rationale", () => {
    expect(src).toContain("Task 7.2");
    expect(src).toMatch(/factory pattern|pure functions/i);
  });
});

/* ─── TASK 7.2 — demo consumers wired ─── */
describe("Task 7.2 — demo consumer migrations", () => {
  it("ReconnectingOverlay uses dissolve()", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/ReconnectingOverlay.tsx"),
      "utf-8",
    );
    expect(src).toContain('import { dissolve } from "@/lib/motionPrimitives"');
    expect(src).toContain("variants={dissolve()}");
    // Make sure the old hand-rolled props are gone
    expect(src).not.toMatch(/initial=\{\{\s*opacity:\s*0\s*\}\}\s*animate=\{\{\s*opacity:\s*1\s*\}\}/);
  });

  it("NarrativeEngine dialog phase uses materialize()", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/NarrativeEngine.tsx"),
      "utf-8",
    );
    expect(src).toContain('import { materialize } from "@/lib/motionPrimitives"');
    expect(src).toContain("variants={materialize()}");
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME — exercise the factories with simulated physics
   ═══════════════════════════════════════════════════════ */

describe("Task 7.2 — motion primitives runtime behavior", () => {
  // Polyfill `document.documentElement.dataset.physics` so the
  // factories can read it without a real DOM.
  let savedDocument: any;

  beforeEach(() => {
    savedDocument = (globalThis as any).document;
    (globalThis as any).document = {
      documentElement: {
        dataset: { physics: undefined as undefined | string },
      },
    };
  });

  afterEach(() => {
    (globalThis as any).document = savedDocument;
  });

  function setPhysics(value: string | undefined) {
    (globalThis as any).document.documentElement.dataset.physics = value;
  }

  it("getPhysics defaults to glass when no attribute is set", async () => {
    setPhysics(undefined);
    const { getPhysics } = await import("../client/src/lib/motionPrimitives");
    expect(getPhysics()).toBe("glass");
  });

  it("getPhysics respects flat", async () => {
    setPhysics("flat");
    const { getPhysics } = await import("../client/src/lib/motionPrimitives");
    expect(getPhysics()).toBe("flat");
  });

  it("getPhysics respects retro", async () => {
    setPhysics("retro");
    const { getPhysics } = await import("../client/src/lib/motionPrimitives");
    expect(getPhysics()).toBe("retro");
  });

  it("getPhysics rejects unknown values and falls back to glass", async () => {
    setPhysics("plasma");
    const { getPhysics } = await import("../client/src/lib/motionPrimitives");
    expect(getPhysics()).toBe("glass");
  });

  describe("materialize()", () => {
    it("glass uses ~300 ms duration with blur clear", async () => {
      setPhysics("glass");
      const { materialize } = await import("../client/src/lib/motionPrimitives");
      const v = materialize() as any;
      expect(v.initial.filter).toContain("blur(12px)");
      expect(v.animate.filter).toBe("blur(0px)");
      expect(v.animate.transition.duration).toBeCloseTo(0.3, 2);
    });

    it("flat uses ~200 ms duration with no blur", async () => {
      setPhysics("flat");
      const { materialize } = await import("../client/src/lib/motionPrimitives");
      const v = materialize() as any;
      expect(v.initial.filter).toBe("blur(0px)");
      expect(v.animate.transition.duration).toBeCloseTo(0.2, 2);
    });

    it("retro uses 0 ms duration with no blur", async () => {
      setPhysics("retro");
      const { materialize } = await import("../client/src/lib/motionPrimitives");
      const v = materialize() as any;
      expect(v.initial.filter).toBe("blur(0px)");
      expect(v.animate.transition.duration).toBe(0);
    });

    it("starts offset by 15px and scaled to 0.96", async () => {
      setPhysics("glass");
      const { materialize } = await import("../client/src/lib/motionPrimitives");
      const v = materialize() as any;
      expect(v.initial.y).toBe(15);
      expect(v.initial.scale).toBe(0.96);
      expect(v.initial.opacity).toBe(0);
      expect(v.animate.y).toBe(0);
      expect(v.animate.scale).toBe(1);
      expect(v.animate.opacity).toBe(1);
    });

    it("exit returns to opacity 0 with negative y", async () => {
      setPhysics("glass");
      const { materialize } = await import("../client/src/lib/motionPrimitives");
      const v = materialize() as any;
      expect(v.exit.opacity).toBe(0);
      expect(v.exit.y).toBe(-10);
    });
  });

  describe("dissolve()", () => {
    it("is a pure opacity crossfade — no movement", async () => {
      setPhysics("glass");
      const { dissolve } = await import("../client/src/lib/motionPrimitives");
      const v = dissolve() as any;
      expect(v.initial.opacity).toBe(0);
      expect(v.animate.opacity).toBe(1);
      expect(v.initial.y).toBeUndefined();
      expect(v.initial.scale).toBeUndefined();
      expect(v.initial.filter).toBeUndefined();
    });

    it("retro is instant", async () => {
      setPhysics("retro");
      const { dissolve } = await import("../client/src/lib/motionPrimitives");
      const v = dissolve() as any;
      expect(v.animate.transition.duration).toBe(0);
    });
  });

  describe("emerge()", () => {
    it("animates height from 0 to auto", async () => {
      setPhysics("glass");
      const { emerge } = await import("../client/src/lib/motionPrimitives");
      const v = emerge() as any;
      expect(v.initial.height).toBe(0);
      expect(v.animate.height).toBe("auto");
      expect(v.initial.overflow).toBe("hidden");
    });

    it("retro emerge collapses durations to 0", async () => {
      setPhysics("retro");
      const { emerge } = await import("../client/src/lib/motionPrimitives");
      const v = emerge() as any;
      expect(v.animate.transition.height.duration).toBe(0);
      expect(v.animate.transition.opacity.duration).toBe(0);
      expect(v.animate.transition.opacity.delay).toBe(0);
    });
  });

  describe("dematerialize()", () => {
    it("starts visible and fades out with negative y", async () => {
      setPhysics("glass");
      const { dematerialize } = await import("../client/src/lib/motionPrimitives");
      const v = dematerialize() as any;
      expect(v.initial.opacity).toBe(1);
      expect(v.exit.opacity).toBe(0);
      expect(v.exit.y).toBe(-10);
    });
  });

  describe("implode()", () => {
    it("scales down on exit", async () => {
      setPhysics("glass");
      const { implode } = await import("../client/src/lib/motionPrimitives");
      const v = implode() as any;
      expect(v.initial.scale).toBe(1);
      expect(v.exit.scale).toBe(0.9);
      expect(v.exit.opacity).toBe(0);
    });
  });

  describe("live()", () => {
    it("glass loops opacity + slight scale on infinite repeat", async () => {
      setPhysics("glass");
      const { live } = await import("../client/src/lib/motionPrimitives");
      const v = live() as any;
      expect(v.animate.opacity).toEqual([0.85, 1, 0.85]);
      expect(v.animate.scale).toEqual([1, 1.02, 1]);
      expect(v.animate.transition.repeat).toBe(Infinity);
    });

    it("retro live() returns a still variant (no loop)", async () => {
      setPhysics("retro");
      const { live } = await import("../client/src/lib/motionPrimitives");
      const v = live() as any;
      expect(v.animate.opacity).toBe(1);
      expect(v.animate.transition).toBeUndefined();
    });

    it("flat omits scale loop (no spring physics)", async () => {
      setPhysics("flat");
      const { live } = await import("../client/src/lib/motionPrimitives");
      const v = live() as any;
      expect(v.animate.opacity).toEqual([0.85, 1, 0.85]);
      expect(v.animate.scale).toEqual([1, 1, 1]);
    });
  });

  describe("motionPrimitives map", () => {
    it("enumerates all six factories", async () => {
      const { motionPrimitives } = await import("../client/src/lib/motionPrimitives");
      expect(Object.keys(motionPrimitives)).toEqual([
        "materialize",
        "dematerialize",
        "emerge",
        "dissolve",
        "implode",
        "live",
      ]);
    });
  });
});
