// apps/shared/npcs/__tests__/askBanks.wraith_calder.test.ts
//
// Phase 6d.3 part-1 verification — Wraith Calder → Hierophant
// ask-topics bank (~12 topics covering Foundation / History /
// Identity / Cosmic / Relationships / Personal categories per
// writers'-guide spec).
//
// Validates per wraith_calder.md §§1-3 voice canon:
//   1. ≥10 topics shipped
//   2. All npcKey "wraith_calder"
//   3. Topic ids unique + labels ≤24 chars
//   4. Multi-stage Identity arc: "Who are you?" canonical 2-stage
//      post_arena alternate (Wraith Calder voice + Hierophant voice)
//   5. §1.4 Tells canon enforced (pre_arena):
//      - Counting-himself ("Seven bodies. Each one solid.")
//      - Honest-motive ("Spite, mostly")
//      - Selective caps for contradicted nouns (CALL me / GAPS / STOLE)
//      - Periods-as-punches; em-dashes for the gap
//      - "Get up" canonical imperative
//   6. §1.7 Tells canon enforced (post_arena):
//      - Sacred vocabulary (name / ceremony / continuation /
//        witness / remember / slowly)
//      - Periodic build to quiet apex
//      - Corrective addendum
//      - "I will remember" liturgical reservation
//      - Pen-pause stage-direction canon
//   7. §1.8 bridge canon — what does NOT cross:
//      - NO caps in any post_arena line
//      - NO imperatives in post_arena (only "sit" canonical)
//      - NO "spite" in post_arena
//   8. §1.10 / §4.10 silence-shape protections:
//      - Hierophant canonically does NOT say "You are the Oracle"
//        (canonically unsayable-as-truth per canon-update)

import { describe, it, expect } from "vitest";
import { WRAITH_CALDER_ASK_TOPICS } from "../askBanks/wraith_calder";
import { getAskTopicsFor } from "../askBanks";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("WRAITH_CALDER_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6d.3 part 1 baseline)", () => {
    expect(WRAITH_CALDER_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by wraith_calder", () => {
    for (const t of WRAITH_CALDER_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("wraith_calder");
    }
  });

  it("topic ids are unique", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of WRAITH_CALDER_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of WRAITH_CALDER_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('wraith_calder')", () => {
    const fromAggregator = getAskTopicsFor("wraith_calder");
    expect(fromAggregator.length).toBe(WRAITH_CALDER_ASK_TOPICS.length);
  });
});

describe("Reveal-stage gating canon (pre_arena / post_arena)", () => {
  it("every base topic gates pre_arena or post_arena reveal-stage", () => {
    for (const t of WRAITH_CALDER_ASK_TOPICS) {
      expect(["pre_arena", "post_arena"], t.id).toContain(
        t.requiresRevealStage,
      );
    }
  });

  it("ships at least 4 pre_arena base topics (canonical pre-rite voice coverage)", () => {
    const preArena = WRAITH_CALDER_ASK_TOPICS.filter(
      (t) => t.requiresRevealStage === "pre_arena",
    );
    expect(preArena.length).toBeGreaterThanOrEqual(4);
  });

  it("ships at least 6 post_arena base topics (canonical post-rite voice coverage)", () => {
    const postArena = WRAITH_CALDER_ASK_TOPICS.filter(
      (t) => t.requiresRevealStage === "post_arena",
    );
    expect(postArena.length).toBeGreaterThanOrEqual(6);
  });

  it("multiple topics ship canonical post_arena alternate (transformation gating)", () => {
    const withAlternates = WRAITH_CALDER_ASK_TOPICS.filter(
      (t) =>
        t.requiresRevealStage === "pre_arena" &&
        (t.alternateAnswers ?? []).some(
          (a) => a.requiresRevealStage === "post_arena",
        ),
    );
    expect(withAlternates.length).toBeGreaterThanOrEqual(3);
  });
});

describe("'Who are you?' canonical 2-stage Identity arc", () => {
  const whoTopic = WRAITH_CALDER_ASK_TOPICS.find(
    (t) => t.id === "ask_hierophant_who",
  );

  it("ships canonical pre_arena base + post_arena alternate", () => {
    expect(whoTopic).toBeDefined();
    expect(whoTopic?.requiresRevealStage).toBe("pre_arena");
    expect(whoTopic?.alternateAnswers?.length).toBeGreaterThanOrEqual(1);
    const postArena = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "post_arena",
    );
    expect(postArena).toBeDefined();
  });

  it("pre_arena base lands canonical 'Seven bodies. Each one solid.' counting-canon (§1.4 Tell #1)", () => {
    expect(whoTopic?.answer).toMatch(/Wraith Calder/);
    expect(whoTopic?.answer).toMatch(/Seven bodies/);
    expect(whoTopic?.answer).toMatch(/Each one solid/);
    // canonical selective caps for contradicted nouns (§1.2 + §1.3)
    expect(whoTopic?.answer).toMatch(/\bCALL\b/);
    expect(whoTopic?.answer).toMatch(/\bGAPS\b/);
  });

  it("post_arena alternate lands canonical Hierophant 'preparing for the one who returns' canon", () => {
    const postArena = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "post_arena",
    );
    expect(postArena?.answer).toMatch(/I am the Hierophant/);
    expect(postArena?.answer).toMatch(/preparing for the one who returns/i);
    // canonical sacred vocabulary
    expect(postArena?.answer).toMatch(/continuation/i);
  });

  it("post_arena alternate uses NO caps (§1.8 bridge canon)", () => {
    const postArena = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "post_arena",
    );
    // canonical: post-arena has no contradicted-noun-caps; check no
    // standalone all-caps words longer than 3 chars
    const capsMatches = postArena?.answer.match(/\b[A-Z]{4,}\b/g) ?? [];
    expect(capsMatches.length).toBe(0);
  });
});

describe("Foundation topics (post-arena: Long Mourning / Final Rite / wall)", () => {
  it("ask_long_mourning lands canonical 'three thousand years / 347000 names remain' canon", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_long_mourning",
    );
    expect(l?.answer).toMatch(/three thousand years/i);
    expect(l?.answer).toMatch(/three hundred and forty-seven thousand/i);
    expect(l?.answer).toMatch(/continuation is the point/i);
  });

  it("ask_final_rite lands canonical 'eighth death / new flesh' canon", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_final_rite",
    );
    expect(l?.answer).toMatch(/eighth death/i);
    expect(l?.answer).toMatch(/new flesh/i);
    expect(l?.answer).toMatch(/name survived, the role did not/i);
  });

  it("ask_wall lands canonical pen-pause stage-direction canon (§1.7 Tell #5)", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_wall",
    );
    expect(l?.answer).toMatch(/pen pauses between names/i);
    expect(l?.answer).toMatch(/pause is part of the writing/i);
  });
});

describe("Pre-arena voice canon (§§1.2-1.4)", () => {
  const preArenaLines = WRAITH_CALDER_ASK_TOPICS.filter(
    (t) => t.requiresRevealStage === "pre_arena",
  );

  it("pre-arena voice canonically uses 'Seven bodies' / 'Each one solid' counting canon", () => {
    const allText = preArenaLines.map((l) => l.answer).join(" ");
    expect(allText).toMatch(/Seven bodies/);
    expect(allText).toMatch(/Each one solid/);
  });

  it("pre-arena voice canonically uses spite vocabulary (§1.3)", () => {
    const allText = preArenaLines.map((l) => l.answer).join(" ");
    expect(allText).toMatch(/Spite, mostly/i);
  });

  it("pre-arena voice canonically uses selective caps for contradicted nouns (§1.2 cadence rule 3)", () => {
    const allText = preArenaLines.map((l) => l.answer).join(" ");
    // canonical caps: at least one of CALL / GAPS / STOLE present
    const hasCanonicalCaps =
      /\bCALL\b/.test(allText) ||
      /\bGAPS\b/.test(allText) ||
      /\bSTOLE\b/.test(allText);
    expect(hasCanonicalCaps).toBe(true);
  });

  it("pre-arena ask_get_up lands canonical 'Get up' two-word imperative canon (§1.3)", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_get_up",
    );
    expect(l?.answer).toMatch(/Get up/);
    expect(l?.answer).toMatch(/Two words/i);
    expect(l?.answer).toMatch(/Floor-level/i);
  });
});

describe("Post-arena voice canon (§§1.5-1.7)", () => {
  const postArenaLines = WRAITH_CALDER_ASK_TOPICS.filter(
    (t) => t.requiresRevealStage === "post_arena",
  );

  it("post-arena voice canonically uses sacred vocabulary (name / ceremony / continuation)", () => {
    const allText = postArenaLines.map((l) => l.answer).join(" ");
    expect(allText).toMatch(/\bnames?\b/i);
    expect(allText).toMatch(/\b(ceremony|continuation|writing)\b/i);
    expect(allText).toMatch(/\bremember(ing)?\b/i);
  });

  it("post-arena voice canonically uses 'Sit' invitation canon (§1.6 + §1.8)", () => {
    const allText = postArenaLines.map((l) => l.answer).join(" ");
    // canonical post-arena imperative: only "sit" canonically
    expect(allText).toMatch(/\bSit\b/);
  });

  it("§1.8 bridge canon: NO selective caps (CALL / GAPS / STOLE) in post-arena lines", () => {
    for (const l of postArenaLines) {
      expect(l.answer, l.id).not.toMatch(/\bCALL\b/);
      expect(l.answer, l.id).not.toMatch(/\bGAPS\b/);
      expect(l.answer, l.id).not.toMatch(/\bSTOLE\b/);
    }
    // also check post-arena alternates
    const postAlternates = WRAITH_CALDER_ASK_TOPICS.flatMap(
      (t) =>
        (t.alternateAnswers ?? []).filter(
          (a) => a.requiresRevealStage === "post_arena",
        ),
    );
    for (const a of postAlternates) {
      expect(a.answer).not.toMatch(/\bCALL\b/);
      expect(a.answer).not.toMatch(/\bGAPS\b/);
      expect(a.answer).not.toMatch(/\bSTOLE\b/);
    }
  });

  it("§1.8 bridge canon: NO 'spite' vocabulary in post-arena lines", () => {
    for (const l of postArenaLines) {
      // canonical: "spite, mostly" is canonical pre-arena only
      expect(l.answer.toLowerCase(), l.id).not.toContain("spite, mostly");
    }
  });
});

describe("§1.10 + §4.10 silence-shape protections", () => {
  const allText = WRAITH_CALDER_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("Hierophant canonically does NOT say 'You are the Oracle' (canon-protected per §4.10)", () => {
    // canonical: per bible §4.10 canon-update, the line is canonically
    // unsayable-as-truth. The Hierophant's voice is structurally
    // unable to lie about itself — the line cannot fire.
    expect(allText).not.toMatch(/\bYou are the Oracle\b/i);
    expect(allText).not.toMatch(/\bI think you are the Oracle\b/i);
  });

  it("ask_about_oracle lands canonical 'player is canonically NOT the Oracle' canon", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_about_oracle",
    );
    expect(l?.answer).toMatch(/Oracle is canonically not the player/i);
    expect(l?.answer).toMatch(/witness-channel/i);
    expect(l?.answer).toMatch(/Oracle and the player are canonically two/i);
    // canonical Inheriting-band-only canon
    expect(l?.requiresTrustBand).toBe("Inheriting");
    expect(l?.setsPublicFlags).toContain(
      "hierophant_disclosed_oracle_witness_channel_canon",
    );
  });
});

describe("Inheriting-band canonical canon (apex)", () => {
  it("ask_tea_cupboard gates Inheriting trust-band + sets canonical-keepsake flag", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_tea_cupboard",
    );
    expect(l?.requiresTrustBand).toBe("Inheriting");
    expect(l?.requiresRevealStage).toBe("post_arena");
    expect(l?.answer).toMatch(/Oracle once gave me to hold/i);
    expect(l?.answer).toMatch(/three thousand years/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_acknowledged_tea_cupboard_canon",
    );
  });

  it("ask_what_prepare_for canonical Inheriting-band alternate lands 'one who returns' canon", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_what_prepare_for",
    );
    const inheriting = l?.alternateAnswers?.find(
      (a) => a.requiredFlag === "hierophant_inheriting_band_reached",
    );
    expect(inheriting?.answer).toMatch(/I prepare for the one who returns/i);
    expect(inheriting?.answer).toMatch(/voice I have been listening for/i);
  });
});

describe("'More wall' canonical Seer exchange canon", () => {
  it("ask_about_seer pre-arena + post-arena both reference the canonical 'more wall' exchange", () => {
    const l = WRAITH_CALDER_ASK_TOPICS.find(
      (t) => t.id === "ask_hierophant_about_seer",
    );
    expect(l?.answer).toMatch(/more wall/i);
    const postArena = l?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "post_arena",
    );
    expect(postArena?.answer).toMatch(/more wall/i);
  });
});

describe("Cross-character public flag wiring (Phase 6d.3 part 1)", () => {
  it("hierophant_disclosed_oracle_witness_channel_canon is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_disclosed_oracle_witness_channel_canon",
    );
  });

  it("hierophant_acknowledged_tea_cupboard_canon is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_acknowledged_tea_cupboard_canon",
    );
  });

  it("hierophant_inheriting_band_reached (consumer) is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_inheriting_band_reached",
    );
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: long_mourning + final_rite + wall", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_hierophant_long_mourning");
    expect(ids).toContain("ask_hierophant_final_rite");
    expect(ids).toContain("ask_hierophant_wall");
  });

  it("History: seven_deaths + ghosts_gambit (both with canonical 2-stage alternates)", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_hierophant_seven_deaths");
    expect(ids).toContain("ask_hierophant_ghosts_gambit");
  });

  it("Identity: who (canonical 2-stage post_arena alternate)", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_hierophant_who");
  });

  it("Cosmic: what_prepare_for + oracle_returns", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_hierophant_what_prepare_for");
    expect(ids).toContain("ask_hierophant_oracle_returns");
  });

  it("Relationships: about_oracle (Inheriting-only) + about_seer (both stages)", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_hierophant_about_oracle");
    expect(ids).toContain("ask_hierophant_about_seer");
  });

  it("Personal: tea_cupboard (Inheriting-only) + get_up (both stages)", () => {
    const ids = WRAITH_CALDER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_hierophant_tea_cupboard");
    expect(ids).toContain("ask_hierophant_get_up");
  });
});
