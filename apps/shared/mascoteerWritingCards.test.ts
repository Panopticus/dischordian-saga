import { describe, it, expect } from "vitest";
import {
  MASCOTEER_WRITING_CARDS,
  getMascoteerCard,
  withWritingCard,
} from "./mascoteerWritingCards";
import { MASCOTEERS } from "./mascoteers";

describe("mascoteerWritingCards", () => {
  it("has a writing card for every canonical Mascoteer (no missing interior life)", () => {
    const canonIds = new Set(MASCOTEERS.map((m) => m.id));
    const cardIds = new Set(MASCOTEER_WRITING_CARDS.map((c) => c.mascoteerId));
    for (const id of canonIds) {
      expect(cardIds.has(id)).toBe(true);
    }
  });

  it("every card has Hope / Goal / Plan / Voice / Forbidden / Sample (writing-card discipline)", () => {
    for (const card of MASCOTEER_WRITING_CARDS) {
      expect(card.hope.length).toBeGreaterThan(10);
      expect(card.goal.length).toBeGreaterThan(10);
      expect(card.plan.length).toBeGreaterThan(10);
      expect(card.voiceFingerprint.length).toBeGreaterThan(15);
      expect(card.forbiddenRegister.length).toBeGreaterThan(10);
      expect(card.sampleLine.length).toBeGreaterThan(20);
    }
  });

  it("Conni the Conductor's voice never raises (her register is lowering, not sharpening)", () => {
    const card = getMascoteerCard("the_conductor");
    expect(card).toBeDefined();
    // No bare exclamation-mark caps
    const fullCapsExclam = card!.sampleLine.match(/\b[A-Z]{4,}!\b/g);
    expect(fullCapsExclam).toBeNull();
    expect(card!.forbiddenRegister.toLowerCase()).toContain("sharp");
  });

  it("Mr. Unblink's voice does not blink — sample includes 'see' as a verb (his canonical tic)", () => {
    const card = getMascoteerCard("mr_unblink");
    expect(card).toBeDefined();
    expect(card!.sampleLine.toLowerCase()).toContain("see");
  });

  it("the Prince's voice carries the dry plain register of his adult recordings (canon-load-bearing)", () => {
    const card = getMascoteerCard("the_prince");
    expect(card).toBeDefined();
    // Sample ends on a self-deprecating internal monologue (the Prince's signature)
    expect(card!.sampleLine).toContain("(But");
  });

  it("Gary's voice is the Senator-era warmth — never theatrical, never caps-emphasis", () => {
    const card = getMascoteerCard("gary");
    expect(card).toBeDefined();
    expect(card!.forbiddenRegister.toLowerCase()).toContain("theatrical");
    const capsWords = card!.sampleLine.match(/\b[A-Z]{4,}\b/g) ?? [];
    expect(capsWords).toEqual([]);
  });

  it("Minnie the Meme uses ALL CAPS for delight (per her voice fingerprint)", () => {
    const card = getMascoteerCard("minnie");
    expect(card).toBeDefined();
    const capsWords = card!.sampleLine.match(/\b[A-Z]{3,}\b/g) ?? [];
    expect(capsWords.length).toBeGreaterThan(0);
  });

  it("Senator Sprout uses 'Mr. Speaker' as the parliamentary opener", () => {
    const card = getMascoteerCard("senator_sprout");
    expect(card).toBeDefined();
    expect(card!.sampleLine).toContain("Mr. Speaker");
  });

  it("Red, the Seeker-Boy's voice is small (per his canonical fingerprint)", () => {
    const card = getMascoteerCard("the_seeker_child");
    expect(card).toBeDefined();
    expect(card!.sampleLine.toLowerCase()).toContain("sorry");
  });

  it("getMascoteerCard returns undefined for unknown ids", () => {
    expect(getMascoteerCard("not_a_mascoteer")).toBeUndefined();
  });

  it("withWritingCard composes the Mascoteer with its card", () => {
    const conni = MASCOTEERS.find((m) => m.id === "the_conductor")!;
    const composed = withWritingCard(conni);
    expect(composed).toBeDefined();
    expect(composed!.id).toBe("the_conductor");
    expect(composed!.writingCard.hope).toBeTruthy();
  });

  it("every card's voice fingerprint enumerates at least 3 tics (3-5 short tics canonical)", () => {
    for (const card of MASCOTEER_WRITING_CARDS) {
      const tics = card.voiceFingerprint.split(/[·•]/).filter((t) => t.trim().length > 0);
      expect(tics.length).toBeGreaterThanOrEqual(3);
    }
  });
});
