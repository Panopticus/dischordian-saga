// apps/shared/npcs/__tests__/askBanks.your_eidolon.test.ts
//
// Phase 6d.4 part-2 verification — Your Eidolon ask-prompts bank
// (~6 canonical non-verbal expression-prompts per writers'-guide
// spec).
//
// Voice canon per eidolon.md §5 + §5.5:
//   - Canonical non-verbal-permanent: NO first-person verbal answers
//   - Each canonical question canonically triggers a glyph + posture
//     + sound response
//   - Ask-prompt answers are bracketed [stage-direction] format
//
// 6 canonical prompts:
//   1. "What do you see?" → canonical Echo-mode-active glyph
//   2. "Are you okay?" → canonical bond-band response
//   3. "What is that?" → canonical Echo registration glyph per source
//   4. "Come here" → canonical call-response posture
//   5. "Stay" → canonical hold-position posture
//   6. "Goodbye" → canonical perish-prelude register

import { describe, it, expect } from "vitest";
import { YOUR_EIDOLON_ASK_TOPICS } from "../askBanks/your_eidolon";
import { getAskTopicsFor } from "../askBanks";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("YOUR_EIDOLON_ASK_TOPICS — bank shape", () => {
  it("ships ≥6 expression-prompts (Phase 6d.4 part 2 baseline)", () => {
    expect(YOUR_EIDOLON_ASK_TOPICS.length).toBeGreaterThanOrEqual(6);
  });

  it("every prompt is owned by your_eidolon", () => {
    for (const t of YOUR_EIDOLON_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("your_eidolon");
    }
  });

  it("prompt ids are unique", () => {
    const ids = YOUR_EIDOLON_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of YOUR_EIDOLON_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('your_eidolon')", () => {
    const fromAggregator = getAskTopicsFor("your_eidolon");
    expect(fromAggregator.length).toBe(YOUR_EIDOLON_ASK_TOPICS.length);
  });
});

describe("Canonical non-verbal canon (§5.5)", () => {
  it("every prompt answer uses bracketed [stage-direction] format", () => {
    for (const t of YOUR_EIDOLON_ASK_TOPICS) {
      expect(t.answer.startsWith("["), t.id).toBe(true);
      expect(t.answer.endsWith("]"), t.id).toBe(true);
    }
  });

  it("no prompt uses verbal first-person canonical content (canonical non-verbal)", () => {
    for (const t of YOUR_EIDOLON_ASK_TOPICS) {
      // canonical: bracketed stage-directions describe the canonical-
      // glyph/posture/sound response; no first-person verbal content
      expect(t.answer, t.id).not.toMatch(/"[^"]+"/); // no quoted speech
      // canonical: answers describe the Eidolon's response from
      // outside (third-person stage-direction), never first-person
      expect(t.answer, t.id).not.toMatch(/^\[I /);
    }
  });
});

describe("Canonical 6 expression-prompts coverage", () => {
  const ids = YOUR_EIDOLON_ASK_TOPICS.map((t) => t.id);

  it("ships 'What do you see?' canonical Echo-mode-active glyph prompt", () => {
    expect(ids).toContain("ask_eidolon_what_do_you_see");
    const l = YOUR_EIDOLON_ASK_TOPICS.find(
      (t) => t.id === "ask_eidolon_what_do_you_see",
    );
    expect(l?.answer).toMatch(/Echo-mode glyph renders/i);
    expect(l?.answer).toMatch(/concentric arcs/i);
    expect(l?.answer).toMatch(/bilateral kin-mark/i);
    expect(l?.answer).toMatch(/temporal-distortion/i);
  });

  it("ships 'What is that?' canonical Echo-registration-glyph-per-source prompt", () => {
    expect(ids).toContain("ask_eidolon_what_is_that");
    const l = YOUR_EIDOLON_ASK_TOPICS.find(
      (t) => t.id === "ask_eidolon_what_is_that",
    );
    expect(l?.answer).toMatch(/canonical-pointing-direction/i);
    // canonical 3-source-type recognition + canonical-question-glyph
    // for none-of-the-three
    expect(l?.answer).toMatch(/Seer-aligned/i);
    expect(l?.answer).toMatch(/Companion-aligned/i);
    expect(l?.answer).toMatch(/Oracle-aligned/i);
    expect(l?.answer).toMatch(/asymmetric-with-missing-edge/i);
  });

  it("ships 'Are you okay?' canonical bond-band-response prompt", () => {
    expect(ids).toContain("ask_eidolon_are_you_okay");
    const l = YOUR_EIDOLON_ASK_TOPICS.find(
      (t) => t.id === "ask_eidolon_are_you_okay",
    );
    expect(l?.answer).toMatch(/canonical Untuned-band/i);
    expect(l?.answer).toMatch(/canonical Tuning-band/i);
    expect(l?.answer).toMatch(/canonical Resonant-band/i);
    expect(l?.answer).toMatch(/canonical Inseparable-band/i);
  });

  it("ships 'Come here' canonical call-response-posture prompt", () => {
    expect(ids).toContain("ask_eidolon_come_here");
    const l = YOUR_EIDOLON_ASK_TOPICS.find(
      (t) => t.id === "ask_eidolon_come_here",
    );
    expect(l?.answer).toMatch(/approaching the player/i);
    expect(l?.answer).toMatch(/canonical-immediate/i);
    expect(l?.answer).toMatch(/canonical-anticipatory-arrival/i);
  });

  it("ships 'Stay' canonical hold-position-posture prompt", () => {
    expect(ids).toContain("ask_eidolon_stay");
    const l = YOUR_EIDOLON_ASK_TOPICS.find(
      (t) => t.id === "ask_eidolon_stay",
    );
    expect(l?.answer).toMatch(/holds its current posture/i);
    expect(l?.answer).toMatch(/canonical-thirty-seconds/i);
    expect(l?.answer).toMatch(/canonical-three-minutes/i);
    expect(l?.answer).toMatch(/canonical-indefinite/i);
  });

  it("ships 'Goodbye' canonical perish-prelude register (Inseparable-only)", () => {
    expect(ids).toContain("ask_eidolon_goodbye");
    const l = YOUR_EIDOLON_ASK_TOPICS.find(
      (t) => t.id === "ask_eidolon_goodbye",
    );
    // canonical Eidolon apex band is "Inseparable" (not "Inheriting")
    expect(l?.requiresTrustBand).toBe("Inseparable");
    // canonical perish-prelude register
    expect(l?.answer).toMatch(/perish-prelude register/i);
    expect(l?.answer).toMatch(/lays its head against the player's canonical-hand/i);
    expect(l?.answer).toMatch(/canonical-final-bond-resonance/i);
    expect(l?.answer).toMatch(/Eidolon canonically does not let them/i);
    // canonical setsPublicFlags
    expect(l?.setsPublicFlags).toContain(
      "eidolon_canonical_goodbye_acknowledged",
    );
  });
});

describe("Cross-character public flag wiring (Phase 6d.4 part 2)", () => {
  it("eidolon_canonical_goodbye_acknowledged is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "eidolon_canonical_goodbye_acknowledged",
    );
  });
});
