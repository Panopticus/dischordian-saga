import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  advanceYearOneMonth,
  deriveYearOneMonth,
  yearOneMonthFlag,
} from "../shared/yearOneMonth";

/* ═══════════════════════════════════════════════════════
   WAVE 1 — yearOneMonth field persistence wiring

   Adds the canonical Year One Calendar month tracker
   (Roadmap Implication §6). The Hub previously derived
   the month by flag-scan only; now there's a first-class
   field with a shared derive-with-fallback helper.
   ═══════════════════════════════════════════════════════ */

const ctxSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
  "utf-8",
);
const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/gameState.ts"),
  "utf-8",
);
const hubPageSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/pages/WitnessingHubPage.tsx"),
  "utf-8",
);

describe("Wave 1 — GameState schema carries yearOneMonth", () => {
  it("GameState interface declares yearOneMonth: number", () => {
    expect(ctxSrc).toMatch(/yearOneMonth:\s*number;/);
  });

  it("DEFAULT_GAME_STATE initializes yearOneMonth to 1", () => {
    expect(ctxSrc).toMatch(/yearOneMonth:\s*1,/);
  });

  it("context interface exposes advanceYearOneMonth()", () => {
    expect(ctxSrc).toMatch(/advanceYearOneMonth:\s*\(\)\s*=>\s*void/);
  });

  it("context interface exposes getYearOneMonth() reader", () => {
    expect(ctxSrc).toMatch(/getYearOneMonth:\s*\(\)\s*=>\s*number/);
  });

  it("advanceYearOneMonth raises the year_one_month_N_opened flag in the same tick", () => {
    // The implementation must update narrativeFlags when it advances,
    // otherwise pre-field readers (the Hub flag-scan fallback) drift.
    expect(ctxSrc).toContain("yearOneMonthFlag(nextMonth)");
    expect(ctxSrc).toMatch(
      /narrativeFlags:\s*\{\s*\.\.\.prev\.narrativeFlags,\s*\[flag\]:\s*true\s*\}/,
    );
  });

  it("getYearOneMonth uses the shared deriver", () => {
    expect(ctxSrc).toContain('from "@shared/yearOneMonth"');
    expect(ctxSrc).toMatch(
      /deriveYearOneMonth\(\{[\s\S]{0,200}yearOneMonth:\s*state\.yearOneMonth/,
    );
  });

  it("provider value surfaces both methods to consumers", () => {
    const valueBlockMatch = ctxSrc.match(/<GameContext\.Provider[\s\S]*?\}\}>/);
    expect(valueBlockMatch).not.toBeNull();
    expect(valueBlockMatch![0]).toContain("advanceYearOneMonth");
    expect(valueBlockMatch![0]).toContain("getYearOneMonth");
  });
});

describe("Wave 1 — gameStateRouter schema accepts yearOneMonth", () => {
  it("schema declares yearOneMonth as optional number", () => {
    expect(routerSrc).toMatch(/yearOneMonth:\s*z\.number\(\)\.optional\(\)/);
  });
});

describe("Wave 1 — WitnessingHubPage prefers the canonical field", () => {
  it("imports deriveYearOneMonth from the shared module", () => {
    expect(hubPageSrc).toContain(
      'import { deriveYearOneMonth } from "@shared/yearOneMonth"',
    );
  });

  it("feeds deriveYearOneMonth into deriveWitnessingHubState", () => {
    expect(hubPageSrc).toMatch(
      /yearOneMonth:\s*deriveYearOneMonth\(\{[\s\S]{0,200}yearOneMonth:\s*gameState\.yearOneMonth/,
    );
  });

  it("retired the local inferYearOneMonth shim (one-source-of-truth)", () => {
    expect(hubPageSrc).not.toContain("function inferYearOneMonth");
    expect(hubPageSrc).not.toMatch(
      /inferYearOneMonth\(gameState\.narrativeFlags/,
    );
  });
});

describe("Wave 1 — yearOneMonth round-trip through save/load shape", () => {
  type Snapshot = {
    yearOneMonth?: number;
    narrativeFlags?: Record<string, boolean>;
  };

  function roundTrip(snapshot: Snapshot): Snapshot {
    return JSON.parse(JSON.stringify(snapshot)) as Snapshot;
  }

  it("preserves an explicit yearOneMonth across JSON serialization", () => {
    const saved: Snapshot = { yearOneMonth: 7 };
    const loaded = roundTrip(saved);
    expect(loaded.yearOneMonth).toBe(7);
    expect(
      deriveYearOneMonth({
        yearOneMonth: loaded.yearOneMonth,
        flags: loaded.narrativeFlags,
      }),
    ).toBe(7);
  });

  it("pre-field save still reads via flag-scan fallback", () => {
    const saved: Snapshot = {
      narrativeFlags: {
        year_one_month_1_opened: true,
        year_one_month_2_opened: true,
        year_one_month_3_opened: true,
      },
    };
    const loaded = roundTrip(saved);
    expect(loaded.yearOneMonth).toBeUndefined();
    expect(
      deriveYearOneMonth({
        yearOneMonth: loaded.yearOneMonth,
        flags: loaded.narrativeFlags,
      }),
    ).toBe(3);
  });

  it("advance→save→load→derive chain lands on the right month", () => {
    const next = advanceYearOneMonth(3);
    const saved: Snapshot = {
      yearOneMonth: next,
      narrativeFlags: { [yearOneMonthFlag(next)]: true },
    };
    const loaded = roundTrip(saved);
    expect(
      deriveYearOneMonth({
        yearOneMonth: loaded.yearOneMonth,
        flags: loaded.narrativeFlags,
      }),
    ).toBe(4);
  });
});
