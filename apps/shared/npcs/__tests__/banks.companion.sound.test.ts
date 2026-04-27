// apps/shared/npcs/__tests__/banks.companion.sound.test.ts
//
// Phase 6c.2 part-4 verification — Companion Channel-3 (sound-palette)
// bank expansion (~5 new lines covering canonical 5 sound categories
// per dmc_clone_companion.md §1.3).
//
// 5 canonical sound-palette categories per §1.3:
//   - Breath-tells (voluntary deliberate / involuntary catch-of-breath)
//   - Throat-clicks (canonical "I am following" acknowledgment)
//   - Half-syllables (canonical foreshadow of Channel 4 first-word)
//   - Mourning-tone (sustained low; over-resolution canon)
//   - Recognition-tone (canonical "first voluntary sound")
//
// Voluntary vs involuntary canonically audible per §1.3 (half-beat
// of pre-vocalisation = voluntary; lands-without-warning = involuntary).
// Cross-channel layering canon: post-Witnessed three-channel-minimum
// (sound canonically partners with glyph + posture).

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const NEW_SOUND_LINES = DMC_CLONE_COMPANION_BANK.filter((l) => {
  const newIds = [
    "companion.expression.sound.breath_tell_voluntary",
    "companion.expression.sound.breath_tell_involuntary_catch",
    "companion.expression.sound.throat_click_acknowledgment",
    "companion.expression.sound.mourning_tone_canon",
    "companion.expression.sound.half_syllables_late_articulation",
  ];
  return newIds.includes(l.lineId);
});

const ALL_SOUND_LINES = DMC_CLONE_COMPANION_BANK.filter(
  (l) => l.expressionChannel === "sound",
);

describe("Companion Channel-3 sound bank — Phase 6c.2 part 4 expansion", () => {
  it("ships ≥5 new sound-palette lines (Phase 6c.2 part 4 baseline)", () => {
    expect(NEW_SOUND_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("total sound-channel bank ≥7 lines (2 prior + 5 new)", () => {
    expect(ALL_SOUND_LINES.length).toBeGreaterThanOrEqual(7);
  });

  it("every new line is owned by dmc_clone_companion", () => {
    for (const l of NEW_SOUND_LINES) {
      expect(l.npcKey, l.lineId).toBe("dmc_clone_companion");
    }
  });

  it("every new line carries expressionChannel: 'sound'", () => {
    for (const l of NEW_SOUND_LINES) {
      expect(l.expressionChannel, l.lineId).toBe("sound");
    }
  });

  it("every new line uses bracketed [expression] format (non-verbal canon)", () => {
    for (const l of NEW_SOUND_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_SOUND_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });
});

describe("Breath-tells canon — voluntary vs involuntary distinction (§1.3)", () => {
  it("breath_tell_voluntary lands canonical 'half-beat pre-vocalisation' canon", () => {
    const l = NEW_SOUND_LINES.find(
      (x) =>
        x.lineId === "companion.expression.sound.breath_tell_voluntary",
    );
    expect(l?.text).toMatch(/deliberate slow breath/i);
    // canonical voluntary distinction: pre-vocalisation half-beat
    expect(l?.text).toMatch(/half-beat/i);
    expect(l?.text).toMatch(/canonical-\s*voluntary/);
  });

  it("breath_tell_involuntary lands canonical 'lands without warning' canon", () => {
    const l = NEW_SOUND_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.sound.breath_tell_involuntary_catch",
    );
    expect(l?.text).toMatch(/catch-of-breath/i);
    // canonical involuntary distinction: lands-without-warning
    expect(l?.text).toMatch(/lands without/i);
    // canonical "body chose it before the fragment could shape it"
    expect(l?.text).toMatch(/body chose it/i);
  });
});

describe("Throat-click acknowledgment canon", () => {
  it("throat_click lands canonical 'I-am-following / I-am-here' canon", () => {
    const l = NEW_SOUND_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.sound.throat_click_acknowledgment",
    );
    expect(l?.text).toMatch(/throat-click/i);
    expect(l?.text).toMatch(/I-am-following/);
    expect(l?.text).toMatch(/I-am-here/);
    // canonical body-tell distinction (vs Eidolon instinctive trill)
    expect(l?.text).toMatch(/canonical-body-/);
    expect(l?.text).toMatch(/not instinctive/i);
    // canonical Eidolon cross-bible canon
    expect(l?.text).toMatch(/Eidolon trill/i);
  });
});

describe("Mourning-tone canon — over-resolution + Seer cross-bible parallel", () => {
  it("mourning_tone lands canonical 'sustained low' + 'over-resolves audio medium' canon", () => {
    const l = NEW_SOUND_LINES.find(
      (x) => x.lineId === "companion.expression.sound.mourning_tone_canon",
    );
    expect(l?.text).toMatch(/sustained low/i);
    // canonical over-resolution canon
    expect(l?.text).toMatch(/over-resolves the audio medium/i);
    expect(l?.text).toMatch(/deeper than/i);
    // canonical Seer cross-bible parallel
    expect(l?.text).toMatch(/Seer's image-/);
    expect(l?.text).toMatch(/expression-channel-bound/i);
  });

  it("mourning_tone canonically gates at Present band (canonical 3-channel-stable)", () => {
    const l = NEW_SOUND_LINES.find(
      (x) => x.lineId === "companion.expression.sound.mourning_tone_canon",
    );
    expect(l?.requiresTrustBand).toBe("Present");
  });

  it("mourning_tone canonically lays cross-channel layering canon (§1.3)", () => {
    const l = NEW_SOUND_LINES.find(
      (x) => x.lineId === "companion.expression.sound.mourning_tone_canon",
    );
    // canonical cross-channel layering: mourning-tone canonically
    // pairs with mourning-glyph for duration
    expect(l?.text).toMatch(/cross-/);
    expect(l?.text).toMatch(/layering/i);
  });
});

describe("Late-Stage-3 articulation canon (canonical Channel-4 priming)", () => {
  it("half_syllables_late_articulation lands canonical 'almost a word' priming canon", () => {
    const l = NEW_SOUND_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.sound.half_syllables_late_articulation",
    );
    expect(l?.text).toMatch(/articulating now/i);
    expect(l?.text).toMatch(/almost a word/i);
    // canonical "consonants forming, vowel shape approaching commitment"
    expect(l?.text).toMatch(/consonants are forming/i);
    expect(l?.text).toMatch(/vowel shape/i);
  });

  it("half_syllables_late_articulation lands canonical 'priming of Channel 4' canon", () => {
    const l = NEW_SOUND_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.sound.half_syllables_late_articulation",
    );
    expect(l?.text).toMatch(/priming of Channel 4/);
    expect(l?.text).toMatch(/threshold/i);
    // canonical narrative-flag set per §5.3 priming canon
    expect(l?.setsFlags).toContain("companion_channel_4_unlock_imminent");
  });

  it("late-articulation gates at Present band (canonical 3-channel-stable)", () => {
    const l = NEW_SOUND_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.sound.half_syllables_late_articulation",
    );
    expect(l?.requiresTrustBand).toBe("Present");
  });
});

describe("Trust-band gating canon (§1.1 channel-by-channel)", () => {
  it("Witnessed-band sounds canonically include breath-tells + throat-click", () => {
    const witnessedBand = NEW_SOUND_LINES.filter(
      (l) => l.requiresTrustBand === "Witnessed",
    );
    // canonical Witnessed unlocks: breath-tells (×2) + throat-click
    expect(witnessedBand.length).toBeGreaterThanOrEqual(3);
  });

  it("Present-band sounds canonically include mourning-tone + half-syllables-late-articulation", () => {
    const presentBand = NEW_SOUND_LINES.filter(
      (l) => l.requiresTrustBand === "Present",
    );
    // canonical Present-band-stable unlocks: mourning-tone + late-
    // articulation (canonical 3-channel-stable + Channel-4-priming)
    expect(presentBand.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Channel-by-channel canon — no verbal leakage", () => {
  it("no sound line uses verbal-channel content (canonical non-verbal-only canon)", () => {
    for (const l of NEW_SOUND_LINES) {
      // canonical bracketed-expression format = canonically non-verbal
      // sounds are described, not transcribed (no quoted speech)
      expect(l.text, l.lineId).not.toMatch(/"[a-zA-Z]+"/);  // no quoted speech
      expect(l.text, l.lineId).not.toMatch(/^I /);          // no first-person opening
    }
  });

  it("no sound line carries requiresRevealStage (canonical pre-naming surface)", () => {
    for (const l of NEW_SOUND_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBeUndefined();
    }
  });
});
