/* ═══════════════════════════════════════════════════════
   DMC ROUTER — Phase 3 pilot NPC reaction wiring tests

   Verifies submitRaceResult + grantSeverancePrize call
   tryNpcReaction at canonical pivot moments and surface
   the selected line(s) in the response shape.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "deadMansCircuit.ts"),
  "utf-8",
);

describe("deadMansCircuit — canonical imports for NPC reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(src).toContain("tryNpcReaction");
    expect(src).toContain('from "./npc"');
  });
});

describe("deadMansCircuit.submitRaceResult — Nilmorg + Eidolon reactions", () => {
  it("iterates DMC pilot NPCs (Nilmorg + Eidolon)", () => {
    expect(src).toContain("DMC_PILOT_NPCS");
    expect(src).toContain('"nilmorg"');
    expect(src).toContain('"your_eidolon"');
  });

  it("calls tryNpcReaction on dmc surface with race-state targetId", () => {
    expect(src).toMatch(
      /DMC_PILOT_NPCS[\s\S]{0,800}tryNpcReaction[\s\S]{0,300}surface: "dmc"/,
    );
    expect(src).toContain("raceTargetId");
  });

  it("returns canonical npcRaceCommentary in the race response", () => {
    expect(src).toMatch(/submitRaceResult[\s\S]*?npcRaceCommentary,/);
  });
});

describe("deadMansCircuit.grantSeverancePrize — Nilmorg + Companion ceremony", () => {
  it("iterates Severance pilot NPCs (Nilmorg + DMC Clone Companion)", () => {
    expect(src).toContain("SEVERANCE_PILOT_NPCS");
    expect(src).toContain('"dmc_clone_companion"');
  });

  it("calls tryNpcReaction on dmc surface with severance-prize targetId", () => {
    expect(src).toMatch(
      /SEVERANCE_PILOT_NPCS[\s\S]{0,800}tryNpcReaction[\s\S]{0,300}surface: "dmc"/,
    );
    expect(src).toContain('targetId: `severance_prize_${season.name}`');
  });

  it("returns canonical npcCeremonyLines in the prize-grant response", () => {
    expect(src).toMatch(/grantSeverancePrize[\s\S]*?npcCeremonyLines,/);
  });
});

describe("deadMansCircuit — silent-fail contract", () => {
  it("catches reaction errors and console.warns without blocking", () => {
    expect(src).toContain('console.warn(`submitRaceResult npc reaction failed');
    expect(src).toContain('console.warn(`grantSeverancePrize npc reaction failed');
  });
});
