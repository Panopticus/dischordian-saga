/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — Phase 3 pilot NPC reaction wiring tests

   Verifies the Trade Empire endpoints (signContract,
   sectorFirstEntered, recordRouteRun) call tryNpcReaction
   server-to-server at canonical pivot moments, and surface
   the selected line(s) in the response shape.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "tradeEmpire.ts"),
  "utf-8",
);

describe("tradeEmpire — canonical imports for NPC reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(src).toContain("tryNpcReaction");
    expect(src).toContain('from "./npc"');
  });

  it("imports BROKER_REGISTRY for canonical broker→npc mapping", () => {
    expect(src).toContain("BROKER_REGISTRY");
    expect(src).toContain('from "@shared/tradeEmpire/brokers"');
  });

  it("imports MILESTONE_TIER_CANON for canonical tier-acknowledger lookup", () => {
    expect(src).toContain("MILESTONE_TIER_CANON");
  });
});

describe("tradeEmpire.signContract — broker NPC reaction", () => {
  it("calls tryNpcReaction with the canonical broker's npcKey on trade_empire surface", () => {
    expect(src).toMatch(
      /signContract[\s\S]{0,5000}BROKER_REGISTRY\[template\.brokerKey\][\s\S]{0,500}tryNpcReaction/,
    );
    expect(src).toMatch(/surface: "trade_empire"[\s\S]{0,400}targetId: input\.contractKey/);
  });

  it("returns canonical npcReaction in the signing response", () => {
    expect(src).toMatch(/signContract[\s\S]*?npcReaction,/);
  });

  it("silent-fails on reaction error (catch + console.warn)", () => {
    expect(src).toContain('console.warn("signContract npc reaction failed"');
  });
});

describe("tradeEmpire.sectorFirstEntered — pilot NPC greetings", () => {
  it("iterates the canonical pilot NPCs (Locke + Nilmorg + Eidolon)", () => {
    expect(src).toContain('"adjudicator_locke"');
    expect(src).toContain('"nilmorg"');
    expect(src).toContain('"your_eidolon"');
    expect(src).toContain("PILOT_NPCS");
  });

  it("calls tryNpcReaction per pilot NPC on trade_empire surface", () => {
    expect(src).toMatch(
      /PILOT_NPCS[\s\S]{0,1000}tryNpcReaction[\s\S]{0,400}surface: "trade_empire"/,
    );
  });

  it("returns canonical npcGreetings array in the arrival response", () => {
    expect(src).toMatch(/sectorFirstEntered[\s\S]*?npcGreetings,/);
  });
});

describe("tradeEmpire.recordRouteRun — canonical tier acknowledgments", () => {
  it("looks up canonical acknowledgers via MILESTONE_TIER_CANON[tier]", () => {
    expect(src).toContain("MILESTONE_TIER_CANON[tier]");
  });

  it("iterates canonicalAcknowledgers and calls tryNpcReaction per ack", () => {
    expect(src).toMatch(
      /canon\.canonicalAcknowledgers[\s\S]{0,500}tryNpcReaction/,
    );
  });

  it("returns canonical npcAcknowledgments per crossed tier", () => {
    expect(src).toMatch(/recordRouteRun[\s\S]*?npcAcknowledgments,/);
  });
});
