/* ═══════════════════════════════════════════════════════
   NPC ROUTER — reactToEvent contract tests

   Structural verification of the Phase 3 pilot
   reactToEvent endpoint: ensures the wiring loads the
   canonical selector context, runs selectNpcLine, applies
   the canonical side effects (trustDelta + setsPublicFlags),
   and exposes the line result.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "npc.ts"),
  "utf-8",
);

describe("npcRouter — reactToEvent registration", () => {
  it("registers npc.reactToEvent procedure", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["npc.reactToEvent"]).toBeDefined();
  });
});

describe("npcRouter.reactToEvent — canonical context loading", () => {
  it("imports selectNpcLine from canonical selector module", () => {
    expect(src).toContain("selectNpcLine");
    expect(src).toContain('from "../../shared/npcs/selector"');
  });

  it("imports getBank from canonical banks aggregator", () => {
    expect(src).toContain("getBank");
    expect(src).toContain('from "../../shared/npcs/banks"');
  });

  it("imports magnitudeOf for canonical-axis profile shape", () => {
    expect(src).toContain("magnitudeOf");
    expect(src).toContain('from "../../shared/playerProfile"');
  });

  it("loads canonical TrustState via resolveTrustState helper", () => {
    expect(src).toMatch(/reactToEvent[\s\S]{0,2000}resolveTrustState/);
  });

  it("loads canonical public flags via readPublicFlags helper", () => {
    expect(src).toMatch(/reactToEvent[\s\S]{0,2000}readPublicFlags/);
  });

  it("loads canonical line history into a Map for cooldown enforcement", () => {
    expect(src).toMatch(/reactToEvent[\s\S]{0,3000}lineHistoryMap/);
    expect(src).toContain("npcLineHistory");
  });

  it("computes canonical 7-axis magnitude snapshot", () => {
    expect(src).toContain("aggression: magnitudeOf");
    expect(src).toContain("mercy: magnitudeOf");
    expect(src).toContain("curiosity: magnitudeOf");
    expect(src).toContain("conformity: magnitudeOf");
    expect(src).toContain("vigilance: magnitudeOf");
    expect(src).toContain("vulnerability: magnitudeOf");
    expect(src).toContain("wit: magnitudeOf");
  });
});

describe("npcRouter.reactToEvent — canonical side-effects", () => {
  it("inserts canonical npcLineHistory row on selected line", () => {
    expect(src).toContain("lineId: result.line.lineId");
    expect(src).toMatch(
      /db\.insert\(npcLineHistory\)\.values\([\s\S]{0,300}lineId: result\.line\.lineId/,
    );
  });

  it("applies canonical trustDelta when line carries one", () => {
    expect(src).toContain("result.line.trustDelta");
    expect(src).toMatch(
      /result\.line\.trustDelta\)[\s\S]{0,200}applyTrustDelta/,
    );
  });

  it("writes canonical setsPublicFlags via writePublicFlag", () => {
    expect(src).toContain("result.line.setsPublicFlags");
    expect(src).toMatch(
      /result\.line\.setsPublicFlags[\s\S]{0,300}writePublicFlag/,
    );
  });
});

describe("npcRouter.reactToEvent — silent-fail contract", () => {
  it("returns { ok: true, line: null } when selector returns null", () => {
    expect(src).toMatch(/if \(!result\)[\s\S]{0,200}line: null/);
  });
});
