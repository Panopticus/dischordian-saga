// apps/shared/npcs/__tests__/banks.your_eidolon.echo_bond.test.ts
//
// Phase 6d.4 part-1 verification — Eidolon Echo-mode 3-source-type +
// bond-resonance per-band/per-trigger expression-beat bank
// (~25 new beats covering eidolon.md §5 Echo canon + §3 trust-band
// canon).
//
// Coverage:
//   Echo-mode 3-source-type (×15):
//     - Seer-transmission Echo × 5 (glyph + posture + sound + recording-
//       tag + triplet)
//     - Companion-event Echo × 5 (kin-glyph + lateral-posture + shared-
//       breath + first-word-witnessed + post-naming-triplet)
//     - Oracle-dream-residue Echo × 5 (temporal-glyph + dream-wake-
//       posture + distant-resonance + cinematic-witnessed + triplet)
//   Bond-resonance per-band per-trigger (×10):
//     - Untuned (1) — first-meeting-stillness
//     - Tuning (3) — mission-success / mission-failure / NPC-intro
//     - Resonant (3) — threshold-pause / player-distress / canonical-loss
//     - Inseparable (3) — shared-silence / deep-familiarity / perish-
//       prelude

import { describe, it, expect } from "vitest";
import { YOUR_EIDOLON_BANK } from "../banks/your_eidolon";
import { allRegisteredFlags } from "../crossCharacterReactions";

const NEW_ECHO_LINES = YOUR_EIDOLON_BANK.filter((l) =>
  l.lineId.startsWith("eidolon.echo."),
);

const NEW_BOND_LINES = YOUR_EIDOLON_BANK.filter((l) =>
  l.lineId.startsWith("eidolon.bond."),
);

describe("Eidolon expansion bank shape — Phase 6d.4 part 1", () => {
  it("ships ≥15 new Echo-mode lines", () => {
    expect(NEW_ECHO_LINES.length).toBeGreaterThanOrEqual(15);
  });

  it("ships ≥10 new bond-resonance lines", () => {
    expect(NEW_BOND_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("total expansion ≥25 expression-beats", () => {
    expect(NEW_ECHO_LINES.length + NEW_BOND_LINES.length).toBeGreaterThanOrEqual(25);
  });

  it("every new line is owned by your_eidolon", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    for (const l of all) {
      expect(l.npcKey, l.lineId).toBe("your_eidolon");
    }
  });

  it("every new line uses bracketed [stage-direction] format (canonical non-verbal)", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    for (const l of all) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every new line uses an expressionChannel (glyph / posture / sound)", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    for (const l of all) {
      expect(["glyph", "posture", "sound"], l.lineId).toContain(
        l.expressionChannel,
      );
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    for (const l of all) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("new line ids are unique", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    const ids = all.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Echo-mode Seer-transmission (×5)", () => {
  const seerLines = NEW_ECHO_LINES.filter((l) =>
    l.lineId.startsWith("eidolon.echo.seer."),
  );

  it("ships ≥5 Seer-transmission Echo beats", () => {
    expect(seerLines.length).toBeGreaterThanOrEqual(5);
  });

  it("includes canonical glyph + posture + sound channels", () => {
    const channels = new Set(seerLines.map((l) => l.expressionChannel));
    expect(channels.has("glyph")).toBe(true);
    expect(channels.has("posture")).toBe(true);
    expect(channels.has("sound")).toBe(true);
  });

  it("foretelling_recognition glyph lands canonical 'pre-recording form' canon", () => {
    const l = seerLines.find(
      (x) =>
        x.lineId === "eidolon.echo.seer.glyph.foretelling_recognition",
    );
    expect(l?.text).toMatch(/pre-recording form/i);
    expect(l?.text).toMatch(/concentric arcs/i);
  });

  it("recognition_chirp lands canonical 'half-an-octave higher' source-discrimination canon", () => {
    const l = seerLines.find(
      (x) => x.lineId === "eidolon.echo.seer.sound.recognition_chirp",
    );
    expect(l?.text).toMatch(/half-an-\s*octave higher/i);
    expect(l?.text).toMatch(/source-discrimination/i);
  });

  it("triplet sets canonical eidolon_echo_seer_source_canonically_introduced flag", () => {
    const l = seerLines.find(
      (x) =>
        x.lineId === "eidolon.echo.seer.triplet.wary_band_first_seer",
    );
    expect(l?.setsFlags).toContain(
      "eidolon_echo_seer_source_canonically_introduced",
    );
  });
});

describe("Echo-mode Companion-event (×5)", () => {
  const companionLines = NEW_ECHO_LINES.filter((l) =>
    l.lineId.startsWith("eidolon.echo.companion."),
  );

  it("ships ≥5 Companion-event Echo beats", () => {
    expect(companionLines.length).toBeGreaterThanOrEqual(5);
  });

  it("first_word_witnessed canonically reacts to companion_first_word_spoken flag", () => {
    const l = companionLines.find(
      (x) =>
        x.lineId === "eidolon.echo.companion.glyph.first_word_witnessed",
    );
    expect(l?.reactsToPublicFlag).toBe("companion_first_word_spoken");
    expect(l?.text).toMatch(/first word has just landed/i);
    expect(l?.text).toMatch(/witness-mark canonically holds/i);
  });

  it("post-naming triplet canonically reacts to companion_named flag", () => {
    const l = companionLines.find(
      (x) =>
        x.lineId === "eidolon.echo.companion.triplet.post_naming_kin",
    );
    expect(l?.reactsToPublicFlag).toBe("companion_named");
  });

  it("kin_by_form lands canonical 'bilateral, canonically symmetric, soft-edged' canon", () => {
    const l = companionLines.find(
      (x) => x.lineId === "eidolon.echo.companion.glyph.kin_by_form",
    );
    expect(l?.text).toMatch(/bilateral/i);
    expect(l?.text).toMatch(/canonically symmetric, soft-edged/i);
  });

  it("shared_breath lands canonical 'three-cycles' synchrony canon", () => {
    const l = companionLines.find(
      (x) => x.lineId === "eidolon.echo.companion.sound.shared_breath",
    );
    expect(l?.text).toMatch(/canonical-three-cycles/i);
    expect(l?.text).toMatch(/canonically involuntary/i);
  });
});

describe("Echo-mode Oracle dream-residue (×5)", () => {
  const oracleLines = NEW_ECHO_LINES.filter((l) =>
    l.lineId.startsWith("eidolon.echo.oracle."),
  );

  it("ships ≥5 Oracle-residue Echo beats", () => {
    expect(oracleLines.length).toBeGreaterThanOrEqual(5);
  });

  it("temporal_distortion lands canonical 'appears canonically before it canonically resolves' canon", () => {
    const l = oracleLines.find(
      (x) => x.lineId === "eidolon.echo.oracle.glyph.temporal_distortion",
    );
    expect(l?.text).toMatch(/canonical temporal-distortion/i);
    expect(l?.text).toMatch(/appears canonically before it canonically resolves/i);
  });

  it("dream_wake_anticipation lands canonical 'felt the dream's wake before' canon", () => {
    const l = oracleLines.find(
      (x) =>
        x.lineId ===
        "eidolon.echo.oracle.posture.dream_wake_anticipation",
    );
    expect(l?.text).toMatch(/ten canonical-seconds before the player/i);
    expect(l?.text).toMatch(/feels the dream's wake before the player/i);
  });

  it("cinematic_witnessed canonically reacts to oracle_disambiguated_player_from_clone flag", () => {
    const l = oracleLines.find(
      (x) =>
        x.lineId === "eidolon.echo.oracle.glyph.cinematic_witnessed",
    );
    expect(l?.reactsToPublicFlag).toBe(
      "oracle_disambiguated_player_from_clone",
    );
  });

  it("substrate_residue triplet gates Inseparable band (canonical apex)", () => {
    const l = oracleLines.find(
      (x) =>
        x.lineId === "eidolon.echo.oracle.triplet.substrate_residue",
    );
    expect(l?.requiresTrustBand).toBe("Inseparable");
  });
});

describe("Bond-resonance per-band canon", () => {
  it("ships canonical Untuned-band first-meeting beat", () => {
    const l = NEW_BOND_LINES.find(
      (x) => x.lineId === "eidolon.bond.untuned.first_meeting",
    );
    expect(l?.requiresTrustBand).toBe("Untuned");
    expect(l?.text).toMatch(/canonical Untuned-band canon is canonically-absence/i);
    expect(l?.text).toMatch(/stillness is canonical/i);
  });

  it("ships ≥3 Tuning-band beats (mission_success / mission_failure / npc_introduction)", () => {
    const tuningLines = NEW_BOND_LINES.filter(
      (l) => l.requiresTrustBand === "Tuning",
    );
    expect(tuningLines.length).toBeGreaterThanOrEqual(3);
  });

  it("ships ≥3 Resonant-band beats", () => {
    const resonantLines = NEW_BOND_LINES.filter(
      (l) => l.requiresTrustBand === "Resonant",
    );
    expect(resonantLines.length).toBeGreaterThanOrEqual(3);
  });

  it("ships ≥3 Inseparable-band beats (shared_silence / deep_familiarity / perish_prelude)", () => {
    const inseparableLines = NEW_BOND_LINES.filter(
      (l) => l.requiresTrustBand === "Inseparable",
    );
    expect(inseparableLines.length).toBeGreaterThanOrEqual(3);
  });

  it("perish_prelude lands canonical 'lays its head against the player's hand' canon", () => {
    const l = NEW_BOND_LINES.find(
      (x) =>
        x.lineId === "eidolon.bond.inseparable.perish_prelude",
    );
    expect(l?.text).toMatch(/lays its head against the player's canonical-hand/i);
    expect(l?.text).toMatch(/canonical-final-bond-resonance/i);
    expect(l?.text).toMatch(/Eidolon canonically does not let them/i);
    expect(l?.setsPublicFlags).toContain("eidolon_perish_prelude_witnessed");
  });

  it("shared_silence lands canonical 'canonically-loud-without-being-loud' canon", () => {
    const l = NEW_BOND_LINES.find(
      (x) => x.lineId === "eidolon.bond.inseparable.shared_silence",
    );
    expect(l?.text).toMatch(/canonically-loud-without-being-loud/i);
  });

  it("deep_familiarity lands canonical 'half-a-beat before the player's canonical-decision' canon", () => {
    const l = NEW_BOND_LINES.find(
      (x) =>
        x.lineId === "eidolon.bond.inseparable.deep_familiarity",
    );
    expect(l?.text).toMatch(/canonical-half-a-beat before/i);
  });

  it("threshold_pause lands canonical 'air-thickens' canon (per bible §3)", () => {
    const l = NEW_BOND_LINES.find(
      (x) => x.lineId === "eidolon.bond.resonant.threshold_pause",
    );
    expect(l?.text).toMatch(/canonical-air-thickens canon/i);
    expect(l?.text).toMatch(/canonical-three-seconds/i);
  });
});

describe("Eidolon non-verbal canon — no verbal leakage", () => {
  it("no new line uses verbal-channel content (canonical non-verbal-only canon)", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    for (const l of all) {
      expect(l.text, l.lineId).not.toMatch(/"[^"]+"/); // no quoted speech
      expect(l.text, l.lineId).not.toMatch(/^I /); // no first-person opening
    }
  });

  it("no new line carries requiresRevealStage (canonical Eidolon has no reveal-stages)", () => {
    const all = [...NEW_ECHO_LINES, ...NEW_BOND_LINES];
    for (const l of all) {
      expect(l.requiresRevealStage, l.lineId).toBeUndefined();
    }
  });
});

describe("Cross-character public flag wiring (Phase 6d.4 part 1)", () => {
  it("eidolon_perish_prelude_witnessed is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "eidolon_perish_prelude_witnessed",
    );
  });

  it("companion_first_word_spoken (consumer) is registered as public flag", () => {
    expect(allRegisteredFlags()).toContain("companion_first_word_spoken");
  });

  it("companion_named (consumer) is registered as public flag", () => {
    expect(allRegisteredFlags()).toContain("companion_named");
  });

  it("oracle_disambiguated_player_from_clone (consumer) is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "oracle_disambiguated_player_from_clone",
    );
  });
});

describe("Cumulative Eidolon bank density (Phase 6d.4 part 1)", () => {
  it("Eidolon bank ≥35 entries (Phase 6d.4 part 1 cumulative target)", () => {
    expect(YOUR_EIDOLON_BANK.length).toBeGreaterThanOrEqual(35);
  });
});
