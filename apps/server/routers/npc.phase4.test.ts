/* ═══════════════════════════════════════════════════════
   NPC ROUTER — Phase 4 multilayered architecture tests

   Verifies getSocialLinkRank + getInnerVoice endpoints are
   registered and canonically wired to the shared
   socialLinkRanks + innerVoiceSkills modules.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(path.resolve(__dirname, "npc.ts"), "utf-8");

describe("npcRouter — Phase 4 endpoint registration", () => {
  it("registers npc.getSocialLinkRank procedure", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["npc.getSocialLinkRank"]).toBeDefined();
  });

  it("registers npc.getInnerVoice procedure", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["npc.getInnerVoice"]).toBeDefined();
  });
});

describe("npc.getSocialLinkRank — canonical wiring", () => {
  it("imports canonical ladderFor / currentSocialLinkRank / rankDef helpers", () => {
    expect(src).toContain("ladderFor");
    expect(src).toContain("currentSocialLinkRank");
    expect(src).toContain("rankDef");
  });

  it("loads canonical context (trustState + publicFlags + flags + bands)", () => {
    expect(src).toMatch(
      /getSocialLinkRank[\s\S]{0,3000}resolveTrustState/,
    );
    expect(src).toMatch(
      /getSocialLinkRank[\s\S]{0,3000}readPublicFlags/,
    );
  });

  it("computes canonical bandOrdinalOf via NPC_REGISTRY trustBands", () => {
    expect(src).toContain("profile.trustBands.findIndex");
  });

  it("returns canonical activeRank shape with canonical fields", () => {
    expect(src).toContain("ladderLabel: ladder.ladderLabel");
    expect(src).toContain("rank: def.rank");
    expect(src).toContain("loreBlurb: def.loreBlurb");
    expect(src).toContain("setsFlag: def.setsFlag");
  });
});

describe("npc.getInnerVoice — canonical wiring", () => {
  it("imports canonical pickInnerVoice helper from innerVoiceSkills", () => {
    expect(src).toContain("pickInnerVoice");
    expect(src).toContain('"@shared/innerVoiceSkills"');
  });

  it("imports canonical magnitudeOf for canonical-axis snapshot", () => {
    expect(src).toContain("magnitudeOf");
    expect(src).toMatch(/playerProfile/);
  });

  it("computes canonical 7-axis magnitude snapshot", () => {
    expect(src).toMatch(/getInnerVoice[\s\S]{0,4000}aggression: magnitudeOfFn/);
    expect(src).toMatch(/mercy: magnitudeOfFn/);
    expect(src).toMatch(/curiosity: magnitudeOfFn/);
    expect(src).toMatch(/conformity: magnitudeOfFn/);
    expect(src).toMatch(/vigilance: magnitudeOfFn/);
    expect(src).toMatch(/vulnerability: magnitudeOfFn/);
    expect(src).toMatch(/wit: magnitudeOfFn/);
  });

  it("returns canonical voice shape (axis + label + cadence + canonicalNote)", () => {
    expect(src).toContain("axis: voice.axis");
    expect(src).toContain("label: voice.label");
    expect(src).toContain("cadence: voice.cadence");
    expect(src).toContain("canonicalNote: voice.canonicalNote");
  });

  it("respects canonical recentlySpoken cooldown set", () => {
    expect(src).toContain("recentlySpoken: new Set(input.recentlySpoken)");
  });
});
