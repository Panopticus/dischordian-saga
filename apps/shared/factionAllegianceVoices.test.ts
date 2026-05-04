import { describe, it, expect } from "vitest";
import {
  FACTION_ALLEGIANCE_VOICES,
  getFactionVoice,
  resolveAllegianceTutorPitch,
} from "./factionAllegianceVoices";
import { ALL_POTENTIAL_FACTIONS } from "./potentialFactions";

describe("factionAllegianceVoices", () => {
  it("has voicing for every canonical faction (no missing leader)", () => {
    const canonIds = new Set(ALL_POTENTIAL_FACTIONS.map((f) => f.id));
    const voiceIds = new Set(FACTION_ALLEGIANCE_VOICES.map((v) => v.factionId));
    expect(voiceIds.size).toBe(canonIds.size);
    for (const id of canonIds) expect(voiceIds.has(id)).toBe(true);
  });

  it("leader names match the canonical faction registry", () => {
    for (const voice of FACTION_ALLEGIANCE_VOICES) {
      const canon = ALL_POTENTIAL_FACTIONS.find((f) => f.id === voice.factionId);
      expect(canon).toBeDefined();
      expect(voice.leaderName).toBe(canon!.leaderName);
    }
  });

  it("every voice has Hope / Goal / Plan / Voice / Forbidden filled (writing-card discipline)", () => {
    for (const voice of FACTION_ALLEGIANCE_VOICES) {
      expect(voice.hope.length).toBeGreaterThan(10);
      expect(voice.goal.length).toBeGreaterThan(10);
      expect(voice.plan.length).toBeGreaterThan(10);
      expect(voice.voiceFingerprint.length).toBeGreaterThan(10);
      expect(voice.forbiddenRegister.length).toBeGreaterThan(5);
      expect(voice.firstContactLine.length).toBeGreaterThan(40);
      expect(voice.tutorialPitch.length).toBeGreaterThan(20);
    }
  });

  it("the Pure Flame's voice does not laugh (per its forbidden register)", () => {
    const v = getFactionVoice("demagi_pureflame");
    expect(v).toBeDefined();
    expect(v!.firstContactLine.toLowerCase()).not.toContain("ha ha");
    expect(v!.firstContactLine.toLowerCase()).not.toContain("(laughs)");
  });

  it("the First Pattern's voice carries the Architect's clinical register (no improvisation)", () => {
    const v = getFactionVoice("quarchon_firstpattern");
    expect(v).toBeDefined();
    // Echo of the Architect — the canonical "Designate: Potential" framing
    expect(v!.firstContactLine).toContain("Designate");
    expect(v!.firstContactLine.toLowerCase()).toContain("variant");
  });

  it("Council Speaker Thael-Vo's voice never says 'recruit' (Assembly invites, doesn't recruit)", () => {
    const v = getFactionVoice("demagi_assembly");
    expect(v).toBeDefined();
    expect(v!.firstContactLine.toLowerCase()).not.toContain("recruit");
    // The Assembly's tutorial pitch should frame as a vote, not an enlistment
    expect(v!.tutorialPitch.toLowerCase()).toContain("vote");
  });

  it("Theorist Praxis-4's voice ends a question with another question (recursive register)", () => {
    const v = getFactionVoice("quarchon_realinst");
    expect(v).toBeDefined();
    // Praxis-4 footnotes everything; their first-contact line should
    // include "consider" or pose a paradox
    expect(v!.firstContactLine.toLowerCase()).toMatch(/consider|recursion|instance/);
  });

  it("getFactionVoice returns undefined for unknown ids", () => {
    // @ts-expect-error — testing the runtime path explicitly
    expect(getFactionVoice("not_a_faction")).toBeUndefined();
  });

  it("resolveAllegianceTutorPitch returns undefined when no faction is selected (caller falls back to Locke)", () => {
    expect(resolveAllegianceTutorPitch(undefined)).toBeUndefined();
  });

  it("resolveAllegianceTutorPitch returns the canonical pitch for each faction", () => {
    for (const voice of FACTION_ALLEGIANCE_VOICES) {
      expect(resolveAllegianceTutorPitch(voice.factionId)).toBe(voice.tutorialPitch);
    }
  });

  it("extremist factions (Pure Flame, First Pattern) have voices that warn the player off", () => {
    const pureFlame = getFactionVoice("demagi_pureflame")!;
    const firstPattern = getFactionVoice("quarchon_firstpattern")!;
    // Both should signal something forbidding in their tutor pitch
    expect(pureFlame.tutorialPitch.toLowerCase()).toMatch(/only|burned|burning/);
    expect(firstPattern.tutorialPitch.toLowerCase()).toMatch(/only|vanish|no individual/);
  });
});
