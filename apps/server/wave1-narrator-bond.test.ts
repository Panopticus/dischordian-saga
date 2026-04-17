import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  adjustNarratorBond,
  deriveNarratorBond,
} from "../shared/narratorBond";

/* ═══════════════════════════════════════════════════════
   WAVE 1 — narratorBond field persistence wiring

   Verifies the field flows through the three layers that
   matter for cross-device save:

     1. GameState interface + default state (client)
     2. GameContext provider exposes adjust + get
     3. gameStateRouter.save schema accepts the field

   Also exercises the round-trip by simulating the
   server save → load contract on the pure shapes.
   ═══════════════════════════════════════════════════════ */

const ctxSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
  "utf-8",
);

const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/gameState.ts"),
  "utf-8",
);

describe("Wave 1 — GameState schema carries narratorBond", () => {
  it("GameState interface declares narratorBond: number", () => {
    expect(ctxSrc).toMatch(/narratorBond:\s*number;/);
  });

  it("DEFAULT_GAME_STATE initializes narratorBond to 0", () => {
    expect(ctxSrc).toMatch(/narratorBond:\s*0,/);
  });

  it("context interface exposes adjustNarratorBond(delta)", () => {
    expect(ctxSrc).toMatch(
      /adjustNarratorBond:\s*\(delta:\s*number\)\s*=>\s*void/,
    );
  });

  it("context interface exposes getNarratorBond() reader", () => {
    expect(ctxSrc).toMatch(/getNarratorBond:\s*\(\)\s*=>\s*number/);
  });

  it("adjustNarratorBond implementation uses the shared clamp helper", () => {
    // The callback body threads through shared/narratorBond's helper
    // rather than re-inlining a Math.max/Math.min clamp.
    expect(ctxSrc).toContain('from "@shared/narratorBond"');
    expect(ctxSrc).toMatch(/adjustNarratorBondValue\(prev\.narratorBond,\s*delta\)/);
  });

  it("getNarratorBond uses the derived-value fallback", () => {
    expect(ctxSrc).toMatch(/deriveNarratorBond\(\{[\s\S]{0,200}narratorBond:\s*state\.narratorBond/);
  });

  it("provider value surfaces both methods to consumers", () => {
    // Both names appear in the final `value={{ ... }}` object
    // that GameContext.Provider uses.
    const valueBlockMatch = ctxSrc.match(/<GameContext\.Provider[\s\S]*?\}\}>/);
    expect(valueBlockMatch).not.toBeNull();
    expect(valueBlockMatch![0]).toContain("adjustNarratorBond");
    expect(valueBlockMatch![0]).toContain("getNarratorBond");
  });
});

describe("Wave 1 — gameStateRouter schema accepts narratorBond", () => {
  it("schema declares narratorBond as optional number", () => {
    expect(routerSrc).toMatch(
      /narratorBond:\s*z\.number\(\)\.optional\(\)/,
    );
  });

  it("still keeps narrativeFlags required (no regression)", () => {
    expect(routerSrc).toContain("narrativeFlags: z.record(");
  });
});

describe("Wave 1 — narratorBond round-trip through save/load shape", () => {
  /** Minimal stand-in for what the save mutation persists and the load
   *  query returns — exercises the field's JSON trip without needing a DB. */
  type Snapshot = {
    narratorBond?: number;
    elaraTrust?: number;
    humanTrust?: number;
  };

  function roundTrip(snapshot: Snapshot): Snapshot {
    return JSON.parse(JSON.stringify(snapshot)) as Snapshot;
  }

  it("preserves an explicit narratorBond value across JSON serialization", () => {
    const saved: Snapshot = { narratorBond: 42, elaraTrust: 10, humanTrust: 10 };
    const loaded = roundTrip(saved);
    expect(loaded.narratorBond).toBe(42);
    expect(deriveNarratorBond(loaded)).toBe(42);
  });

  it("absent field post-load still yields a usable bond via fallback", () => {
    const saved: Snapshot = { elaraTrust: 55, humanTrust: 35 };
    const loaded = roundTrip(saved);
    expect(loaded.narratorBond).toBeUndefined();
    expect(deriveNarratorBond(loaded)).toBe(35);
  });

  it("adjust→save→load→derive chain preserves the value", () => {
    const start: Snapshot = { narratorBond: 30 };
    const next = adjustNarratorBond(start.narratorBond ?? 0, 15);
    const saved: Snapshot = { ...start, narratorBond: next };
    const loaded = roundTrip(saved);
    expect(deriveNarratorBond(loaded)).toBe(45);
  });

  it("clamping survives a save/load cycle even if the client persisted an over-range value", () => {
    // Defensive: a buggy client could write 150. deriveNarratorBond
    // must still return a valid 0..100 read on load.
    const saved: Snapshot = { narratorBond: 150 };
    const loaded = roundTrip(saved);
    expect(deriveNarratorBond(loaded)).toBe(100);
  });
});
