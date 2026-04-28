/**
 * Structural tests for ShipSchematicMap room-surface NPC wiring.
 *
 * Verifies handleTravel + handleEnter fire canonical room-surface
 * NPC reactions and surface them via NpcExpressionRenderer.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "ShipSchematicMap.tsx"),
  "utf-8",
);

describe("ShipSchematicMap — canonical room-surface NPC wiring", () => {
  it("imports canonical useNpcReactions hook", () => {
    expect(src).toContain("useNpcReactions");
    expect(src).toContain('from "@/game/npcReactions"');
  });

  it("imports canonical NpcExpressionRenderer component", () => {
    expect(src).toContain("NpcExpressionRenderer");
  });

  it("declares ROOM_PILOT_NPCS canonical array", () => {
    expect(src).toContain("ROOM_PILOT_NPCS");
    expect(src).toContain('"wraith_calder"');
    expect(src).toContain('"your_eidolon"');
    expect(src).toContain('"dmc_clone_companion"');
    expect(src).toContain('"adjudicator_locke"');
    expect(src).toContain('"vex_solene"');
  });
});

describe("ShipSchematicMap — fireRoomReactions canon", () => {
  it("iterates ROOM_PILOT_NPCS and calls reactToEvent on room surface", () => {
    expect(src).toMatch(
      /fireRoomReactions[\s\S]{0,1500}ROOM_PILOT_NPCS[\s\S]{0,500}surface: "room"/,
    );
  });

  it("constructs minimal NpcLine with canonical expressionChannel", () => {
    expect(src).toContain("expressionChannel:");
    expect(src).toContain("?? \"verbal\"");
  });

  it("setPendingExpression on first canonical line returned", () => {
    expect(src).toContain("setPendingExpression(minimalLine)");
  });

  it("silent-fails on reaction error to never block room navigation", () => {
    expect(src).toMatch(/silent-fail/);
  });
});

describe("ShipSchematicMap — Phase 4 canonical NpcExpressionRenderer mount", () => {
  it("renders canonical NpcExpressionRenderer when pendingExpression is set", () => {
    expect(src).toContain("pendingExpression && (");
    expect(src).toMatch(/<NpcExpressionRenderer/);
  });

  it("clears pendingExpression on canonical onComplete callback", () => {
    expect(src).toContain("setPendingExpression(null)");
  });
});

describe("ShipSchematicMap — handleTravel + handleEnter invoke fireRoomReactions", () => {
  it("handleTravel canonically fires room reactions", () => {
    expect(src).toMatch(/handleTravel[\s\S]{0,300}fireRoomReactions/);
  });

  it("handleEnter canonically fires room reactions", () => {
    expect(src).toMatch(/handleEnter[\s\S]{0,300}fireRoomReactions/);
  });
});
