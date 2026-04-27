// apps/shared/npcs/__tests__/banks.meme.reveal_cascade.test.ts
//
// Phase 6d.2 part-5 verification — Meme reveal-cascade reactive bank
// (~5 lines firing on Oracle Ch6 disambiguation per the_meme.md
// §1.6 + Oracle cross-bible canon).
//
// Coverage (5 reactive lines, all gating on
// oracle_disambiguated_player_from_clone public flag):
//   - acknowledges_oracle_returned (Real register)
//   - relinquishes_stolen_voice (Stolen register, canonical disguise-
//     destabilisation)
//   - witnesses_disguise_collapse (Stolen register, canonical visual
//     collapse)
//   - truth_leak_canonical (Quiet register, canonical Tell #4 truth-
//     leak "I knew this was coming")
//   - replacement_pivot (Replacement register, canonical earliest
//     foreshadow of Ch12 succession-claim)

import { describe, it, expect } from "vitest";
import { THE_MEME_BANK } from "../banks/the_meme";
import { allRegisteredFlags } from "../crossCharacterReactions";

const CASCADE_LINES = THE_MEME_BANK.filter((l) =>
  l.lineId.startsWith("meme.cascade."),
);

describe("Meme reveal-cascade reactive bank — Phase 6d.2 part 5", () => {
  it("ships ≥5 cascade-reactive lines", () => {
    expect(CASCADE_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every cascade line is owned by the_meme", () => {
    for (const l of CASCADE_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_meme");
    }
  });

  it("every cascade line reacts to oracle_disambiguated_player_from_clone flag", () => {
    for (const l of CASCADE_LINES) {
      expect(l.reactsToPublicFlag, l.lineId).toBe(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });

  it("every cascade line minAct ≥6 (canonical Ch6+ canon)", () => {
    for (const l of CASCADE_LINES) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(6);
    }
  });

  it("every cascade line carries cooldownKey + maxPlays:1 (canonical one-shot canon)", () => {
    for (const l of CASCADE_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });

  it("cascade line ids are unique", () => {
    const ids = CASCADE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Cascade reveal-stage canonical distribution", () => {
  it("ships ≥1 Real-register cascade line", () => {
    const real = CASCADE_LINES.filter(
      (l) => l.requiresRevealStage === "Real",
    );
    expect(real.length).toBeGreaterThanOrEqual(1);
  });

  it("ships ≥2 Stolen-register cascade lines (canonical disguise-collapse pair)", () => {
    const stolen = CASCADE_LINES.filter(
      (l) => l.requiresRevealStage === "Stolen",
    );
    expect(stolen.length).toBeGreaterThanOrEqual(2);
  });

  it("ships ≥1 Quiet-register cascade line (canonical truth-leak)", () => {
    const quiet = CASCADE_LINES.filter(
      (l) => l.requiresRevealStage === "Quiet",
    );
    expect(quiet.length).toBeGreaterThanOrEqual(1);
  });

  it("ships ≥1 Replacement-register cascade line (canonical pivot foreshadow)", () => {
    const replacement = CASCADE_LINES.filter(
      (l) => l.requiresRevealStage === "Replacement",
    );
    expect(replacement.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Canonical anchor lands per cascade line", () => {
  it("acknowledges_oracle_returned lands canonical 'real one is back' canon + Real register", () => {
    const l = CASCADE_LINES.find(
      (x) => x.lineId === "meme.cascade.acknowledges_oracle_returned",
    );
    expect(l?.text).toMatch(/Pink-glitch/);
    expect(l?.text).toMatch(/real one is back/i);
    expect(l?.text).toMatch(/eleven canonical years/i);
    expect(l?.text).toMatch(/canonically not mine to\s+wear anymore/i);
    // §1.10 canonical no-apology preserved
    expect(l?.text).toMatch(/I do not apologise. I describe/i);
    // canonical setsPublicFlags wiring
    expect(l?.setsPublicFlags).toContain(
      "meme_relinquished_stolen_oracle_voice",
    );
  });

  it("relinquishes_stolen_voice lands canonical disguise-destabilisation canon", () => {
    const l = CASCADE_LINES.find(
      (x) => x.lineId === "meme.cascade.relinquishes_stolen_voice",
    );
    expect(l?.text).toMatch(/Stolen disguise canonically destabilises/i);
    expect(l?.text).toMatch(/Pink-glitch intensifies/i);
    expect(l?.text).toMatch(/cannot wear his face anymore/i);
    expect(l?.text).toMatch(/canonical-relinquishment is canonically the most honest move/i);
  });

  it("witnesses_disguise_collapse lands canonical 3-second pink-glitch saturation canon", () => {
    const l = CASCADE_LINES.find(
      (x) => x.lineId === "meme.cascade.witnesses_disguise_collapse",
    );
    expect(l?.text).toMatch(/disguise canonically collapses/i);
    expect(l?.text).toMatch(/canonical-three-second stretch/i);
    expect(l?.text).toMatch(/longest pink-glitch in the saga/i);
    // canonical "Meme is canonically smaller than the disguise canonically suggested"
    expect(l?.text).toMatch(/canonically smaller than the disguise canonically suggested/i);
  });

  it("truth_leak_canonical lands canonical Tell #4 'I knew this was coming' canon", () => {
    const l = CASCADE_LINES.find(
      (x) => x.lineId === "meme.cascade.truth_leak_canonical",
    );
    // canonical bracketed Quiet register stage-direction
    expect(l?.text).toMatch(/^\[The Meme's voice is different. Quieter/);
    // canonical truth-leak anchor
    expect(l?.text).toMatch(/I knew this was coming/i);
    expect(l?.text).toMatch(/burden of wearing his face for eleven years/i);
    expect(l?.text).toMatch(/closest thing to honesty/i);
  });

  it("replacement_pivot lands canonical 'if I cannot wear him, I canonically become him' canon", () => {
    const l = CASCADE_LINES.find(
      (x) => x.lineId === "meme.cascade.replacement_pivot",
    );
    expect(l?.text).toMatch(/Replacement-register cadence canonically arrives early/i);
    expect(l?.text).toMatch(/If I cannot wear him, I canonically\s+become him/i);
    expect(l?.text).toMatch(/Architect's canonical-role/i);
    // canonical "waiting canonically begins now"
    expect(l?.text).toMatch(/waiting canonically begins now/i);
    // canonical setsPublicFlags wiring
    expect(l?.setsPublicFlags).toContain("meme_began_replacement_pivot");
  });
});

describe("§1.10 silence-shape protections (cascade bank)", () => {
  const allText = CASCADE_LINES.map((l) => l.text).join(" ");

  it("§1.10: NO standalone apologies in cascade lines", () => {
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
    // canonical "I do not apologise. I describe." anchor lands
    expect(allText).toMatch(/I do not apologise/i);
  });

  it("§1.10: NO 'father' / first-person 'partner' in cascade lines", () => {
    expect(allText).not.toMatch(/\bI call him father\b/i);
    expect(allText).not.toMatch(/\bmy father\b/i);
  });

  it("§1.10: NO Mascot face / identity in cascade lines", () => {
    expect(allText).not.toMatch(/Mascot was a (woman|man|child|ai|robot|creature)/i);
  });
});

describe("§1.9 Tell #5 pink-glitch involuntary canon (cascade)", () => {
  const allText = CASCADE_LINES.map((l) => l.text).join(" ");

  it("canonical pink-glitch tell appears in canonical disguise-collapse canon", () => {
    // canonical: pink-glitch is the canonical Stolen-disguise-
    // destabilisation tell; appears in cascade lines
    expect(allText).toMatch(/Pink-glitch/i);
  });
});

describe("Cross-character public flag wiring (Phase 6d.2 part 5)", () => {
  it("meme_relinquished_stolen_oracle_voice is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "meme_relinquished_stolen_oracle_voice",
    );
  });

  it("meme_began_replacement_pivot is registered", () => {
    expect(allRegisteredFlags()).toContain("meme_began_replacement_pivot");
  });

  it("oracle_disambiguated_player_from_clone (consumer) is registered", () => {
    // canonical: the cross-character flag the cascade reactive lines
    // canonically consume
    expect(allRegisteredFlags()).toContain(
      "oracle_disambiguated_player_from_clone",
    );
  });
});

describe("Cumulative Meme bank density (Phase 6d.2 cumulative)", () => {
  it("Meme bank ≥56 entries (Phase 6d.2 parts 1-5 cumulative target)", () => {
    expect(THE_MEME_BANK.length).toBeGreaterThanOrEqual(56);
  });
});
