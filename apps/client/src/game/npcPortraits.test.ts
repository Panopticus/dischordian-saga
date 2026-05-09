import { describe, expect, it } from "vitest";
import {
  NPC_PORTRAITS,
  getFactionColorHex,
  getNamedExpression,
  type NPCPortrait,
} from "./npcPortraits";

describe("NPC_PORTRAITS — Cos8 + Cos9 invariants (audit/16 PR 25)", () => {
  it("every NPC has factionColorHex populated", () => {
    for (const portrait of Object.values(NPC_PORTRAITS)) {
      expect(portrait.factionColorHex, `${portrait.id} missing factionColorHex`).toBeTruthy();
    }
  });

  it("factionColorHex is always #RRGGBB hex format", () => {
    for (const portrait of Object.values(NPC_PORTRAITS)) {
      expect(portrait.factionColorHex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("every NPC has factionName populated and non-empty", () => {
    for (const portrait of Object.values(NPC_PORTRAITS)) {
      expect(portrait.factionName, `${portrait.id} missing factionName`).toBeTruthy();
      expect(portrait.factionName!.length).toBeGreaterThan(0);
    }
  });

  it("every NPC has namedExpressions populated with the 4 mood keys", () => {
    for (const portrait of Object.values(NPC_PORTRAITS)) {
      expect(portrait.namedExpressions, `${portrait.id} missing namedExpressions`).toBeTruthy();
      const keys = Object.keys(portrait.namedExpressions ?? {});
      expect(keys.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("legacy expressions block is unchanged (back-compat)", () => {
    for (const portrait of Object.values(NPC_PORTRAITS)) {
      expect(portrait.expressions.neutral).toBeTruthy();
      expect(portrait.expressions.emotional1).toBeTruthy();
      expect(portrait.expressions.emotional2).toBeTruthy();
      expect(portrait.expressions.speaking).toBeTruthy();
    }
  });
});

describe("getFactionColorHex", () => {
  it("returns factionColorHex when populated", () => {
    const elara = NPC_PORTRAITS.elara!;
    expect(getFactionColorHex(elara)).toBe(elara.factionColorHex);
  });

  it("falls back to legacy color when factionColorHex is missing", () => {
    const fake: NPCPortrait = {
      id: "fake", name: "Fake", fullPortrait: "x", bustPortrait: "x",
      color: "#abcdef",
      expressions: { neutral: "x", emotional1: "x", emotional2: "x", speaking: "x" },
    };
    expect(getFactionColorHex(fake)).toBe("#abcdef");
  });
});

describe("getNamedExpression", () => {
  it("returns the namedExpressions URL when the emotion is registered", () => {
    const elara = NPC_PORTRAITS.elara!;
    const url = getNamedExpression(elara, "concerned");
    expect(url).toBe(elara.namedExpressions!.concerned);
  });

  it("falls back to the legacy expressions block for emotional1 / emotional2 keys", () => {
    const elara = NPC_PORTRAITS.elara!;
    const url = getNamedExpression(elara, "emotional1");
    expect(url).toBe(elara.expressions.emotional1);
  });

  it("falls back to neutral when the emotion is unknown", () => {
    const elara = NPC_PORTRAITS.elara!;
    const url = getNamedExpression(elara, "not_a_real_emotion");
    expect(url).toBe(elara.expressions.neutral);
  });
});
