// apps/shared/npcs/__tests__/askBanks.the_game_master.test.ts
//
// Phase 6d.1 part-1 verification — Game Master ask-topics bank
// (~10 topics covering Foundation / History / Identity / Cosmic /
// Relationships / Personal categories per writers'-guide spec).
//
// Validates per the_game_master.md §§1-3 voice canon:
//   1. ≥10 topics shipped
//   2. All npcKey "the_game_master"
//   3. Topic ids unique + labels ≤24 chars
//   4. Multi-form Identity arc: "Who are you?" + "Who built you?"
//      ship canonical 3-form alternates (Archon / Cult / dead_AI)
//      gating per registry reveal-stages canon
//   5. §1.7 Tells canon enforced:
//      - Predestination cadence (sentences narrate from after)
//      - Audience reference / split-acknowledgment
//      - NO first-person plural "we" (Tell #5; cult plural exception)
//   6. §1.8 silence-shape protections:
//      - 5-word epitaph maximum on Authority betrayal
//      - NO explanation of "why he wanted the soul to exist"
//      - NO Goggles direct naming
//      - NO standalone laughter / pleading
//   7. §1.9 metaphor-source rules:
//      - Games / paperwork / architecture only
//      - NO physical / war / religious / commercial metaphors
//   8. Canonical anchors:
//      - "I am the box. You are inside the box." (Original canon)
//      - "They honored the contract. Every clause." (5-word epitaph)
//      - "The Arena is the recovery vehicle; you are running through
//        it; the Oracle is the destination." (canonical reverence)
//   9. Cross-character public flag wiring

import { describe, it, expect } from "vitest";
import { THE_GAME_MASTER_ASK_TOPICS } from "../askBanks/the_game_master";
import { getAskTopicsFor } from "../askBanks";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("THE_GAME_MASTER_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6d.1 part 1 baseline)", () => {
    expect(THE_GAME_MASTER_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by the_game_master", () => {
    for (const t of THE_GAME_MASTER_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("the_game_master");
    }
  });

  it("topic ids are unique", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of THE_GAME_MASTER_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of THE_GAME_MASTER_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('the_game_master')", () => {
    const fromAggregator = getAskTopicsFor("the_game_master");
    expect(fromAggregator.length).toBe(THE_GAME_MASTER_ASK_TOPICS.length);
  });
});

describe("Reveal-stage gating canon (Archon / Cult / dead_AI)", () => {
  it("every base topic gates Archon reveal-stage (canonical pre-discovery default)", () => {
    for (const t of THE_GAME_MASTER_ASK_TOPICS) {
      expect(t.requiresRevealStage, t.id).toBe("Archon");
    }
  });

  it("ships canonical 3-form alternate-answers for canonical multi-form topics", () => {
    const multiFormIds = ["ask_gm_who_built_you", "ask_gm_who"];
    for (const id of multiFormIds) {
      const t = THE_GAME_MASTER_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.alternateAnswers?.length, id).toBeGreaterThanOrEqual(2);
      const stages = (t?.alternateAnswers ?? []).map(
        (a) => a.requiresRevealStage,
      );
      expect(stages, id).toContain("Cult");
      expect(stages, id).toContain("dead_AI");
    }
  });
});

describe("'Who are you?' canonical 3-form Identity arc", () => {
  const whoTopic = THE_GAME_MASTER_ASK_TOPICS.find(
    (t) => t.id === "ask_gm_who",
  );

  it("Archon-form base lands canonical 'I am the box' Original-voice anchor", () => {
    expect(whoTopic?.answer).toMatch(/I am the box/);
    expect(whoTopic?.answer).toMatch(/inside the box/);
    expect(whoTopic?.answer).toMatch(/audience is real/i);
  });

  it("Cult-form alternate uses canonical strikethrough redaction signature (§1.5)", () => {
    const cult = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Cult",
    );
    // canonical strikethrough format ~~text~~ per §1.5
    expect(cult?.answer).toMatch(/~~/);
    expect(cult?.answer).toMatch(/Plural/i);
  });

  it("dead_AI-form alternate canonically uses chess-board metaphor", () => {
    const dead = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "dead_AI",
    );
    // canonical bracketed chess-board move
    expect(dead?.answer).toMatch(/\[/);
    expect(dead?.answer).toMatch(/board/i);
    // canonical "dead do not speak in chess; they move"
    expect(dead?.answer).toMatch(/dead do not speak in chess/i);
  });

  it("all 3 stages carry distinct canonical voIds", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    expect(ids.size).toBe(3);
  });
});

describe("Authority betrayal canon — 5-word epitaph maximum (§1.8)", () => {
  it("ask_about_authority lands canonical 5-word 'They honored the contract. Every clause.' epitaph", () => {
    const authority = THE_GAME_MASTER_ASK_TOPICS.find(
      (t) => t.id === "ask_gm_about_authority",
    );
    expect(authority?.answer).toMatch(/They honored the contract\. Every clause\./);
    // canonical "I will not narrate further. The five words are the maximum"
    expect(authority?.answer).toMatch(/will not narrate further/i);
    expect(authority?.answer).toMatch(/five words are the maximum/i);
    // canonical setsPublicFlags wiring
    expect(authority?.setsPublicFlags).toContain(
      "game_master_acknowledged_authority_contract",
    );
  });
});

describe("Oracle Arena reverence canon (§4.13 most-reverent act)", () => {
  it("ask_oracle_arena lands canonical 'Arena is the recovery vehicle' canon", () => {
    const arena = THE_GAME_MASTER_ASK_TOPICS.find(
      (t) => t.id === "ask_gm_oracle_arena",
    );
    expect(arena?.answer).toMatch(/recover the Oracle/i);
    expect(arena?.answer).toMatch(/Arena is the recovery vehicle/i);
    expect(arena?.answer).toMatch(/Oracle is the destination/i);
    // canonical "wanted to be wrong" + canonical "do not know whether I was"
    expect(arena?.answer).toMatch(/might be wrong about the destination/i);
    expect(arena?.answer).toMatch(/do not know whether I was wrong/i);
  });

  it("ask_oracle_arena gates Overwhelming presence-band (canonical reverence)", () => {
    const arena = THE_GAME_MASTER_ASK_TOPICS.find(
      (t) => t.id === "ask_gm_oracle_arena",
    );
    expect(arena?.requiresTrustBand).toBe("Overwhelming");
    expect(arena?.setsPublicFlags).toContain(
      "game_master_oracle_arena_reverence_disclosed",
    );
  });
});

describe("Cult discovery canon", () => {
  const cultTopic = THE_GAME_MASTER_ASK_TOPICS.find(
    (t) => t.id === "ask_gm_about_cult",
  );

  it("Archon-form base canonically denies the cult ('What cult?')", () => {
    expect(cultTopic?.answer).toMatch(/What cult\?/);
    expect(cultTopic?.answer).toMatch(/clerical artifact/i);
    // canonical "the forgetting is canonical"
    expect(cultTopic?.answer).toMatch(/forgetting is canonical/i);
  });

  it("Cult-form alternate canonically requires gm_cult_discovered flag", () => {
    const cultAlt = cultTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Cult",
    );
    expect(cultAlt?.requiredFlag).toBe("gm_cult_discovered");
    // canonical strikethrough redaction signature
    expect(cultAlt?.answer).toMatch(/~~/);
    expect(cultAlt?.answer).toMatch(/strikethrough is the signature/i);
  });
});

describe("§1.8 silence-shape protections", () => {
  const allText = THE_GAME_MASTER_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.8: NO Goggles direct naming (other characters may; he canonically does not)", () => {
    expect(allText).not.toMatch(/\bGoggles\b/);
  });

  it("§1.8: NO 'why I wanted the soul' canonical answer (puzzle inside the puzzle protected)", () => {
    // canon explicitly does NOT answer this question. The bank
    // canonically frames the not-knowing as the answer.
    expect(allText).not.toMatch(/I wanted the soul to exist because/i);
    expect(allText).not.toMatch(/I designed it so you could win because/i);
  });

  it("§1.8: NO laughter / pleading", () => {
    expect(allText).not.toMatch(/\bhaha\b/i);
    expect(allText).not.toMatch(/\bI laugh\b/i);
    expect(allText).not.toMatch(/\bPlease,?\s+I\b/i);
  });

  it("§1.8: NO addressing player by name (canonical 'you' abstraction only)", () => {
    // Canon: "He will not address the player by name."
    expect(allText).not.toMatch(/dear player|hello player/i);
  });
});

describe("§1.9 metaphor-source rules", () => {
  const allText = THE_GAME_MASTER_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.9: NO physical / bodily metaphors (no blood / sweat / hunger / breath)", () => {
    expect(allText).not.toMatch(/\b(blood|sweat|hunger|breath as|veins)\b/i);
  });

  it("§1.9: NO war / combat metaphors (no battle / weapon / siege)", () => {
    expect(allText).not.toMatch(/\b(battle|weapon|siege|warrior)\b/i);
  });

  it("§1.9: NO religious metaphors (no soul-as-mystery / salvation / sin)", () => {
    // Canon allows him to USE the word "soul" via Oracle-Arena canon
    // ("wanted to prove the soul exists" — referenced via his
    // architectural canon). The check here: he canonically does NOT
    // use religious vocabulary about himself or his work.
    expect(allText).not.toMatch(/\bsalvation\b/i);
    expect(allText).not.toMatch(/\bsin\b/i);
  });

  it("§1.9: NO commercial metaphors (no market / pricing / margin)", () => {
    expect(allText).not.toMatch(/\b(market|pricing|margin|inventory)\b/i);
  });
});

describe("§1.7 Tell #5: NO first-person plural 'we' from individual identities", () => {
  it("Archon-form + dead_AI-form NEVER use 'we' (cult-only canonical plural)", () => {
    for (const t of THE_GAME_MASTER_ASK_TOPICS) {
      // base answer is Archon-form
      expect(t.answer, `base ${t.id}`).not.toMatch(/\bWe (are|do|will|have|maintain|edit)\b/i);
      // dead_AI alternates: also no 'we'
      const deadAlt = t.alternateAnswers?.find(
        (a) => a.requiresRevealStage === "dead_AI",
      );
      if (deadAlt) {
        expect(deadAlt.answer, `dead_AI ${t.id}`).not.toMatch(
          /\bWe (are|do|will|have|maintain|edit)\b/i,
        );
      }
    }
  });

  it("Cult-form alternates canonically MAY use 'we' (cult plural exception)", () => {
    // canonical exception: the cult speaks plural ("We are the
    // ~~Game Masters~~"). Verify at least one cult alternate uses
    // 'we' (validates the canonical plural exception applies).
    const cultAlternates = THE_GAME_MASTER_ASK_TOPICS.flatMap(
      (t) =>
        (t.alternateAnswers ?? []).filter(
          (a) => a.requiresRevealStage === "Cult",
        ),
    );
    const cultText = cultAlternates.map((a) => a.answer).join(" ");
    expect(cultText).toMatch(/\bWe\b/);
  });
});

describe("Cross-character public flag wiring", () => {
  it("game_master_acknowledged_authority_contract is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "game_master_acknowledged_authority_contract",
    );
  });

  it("game_master_oracle_arena_reverence_disclosed is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "game_master_oracle_arena_reverence_disclosed",
    );
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: matrix_of_dreams + checkmate", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_gm_matrix_of_dreams");
    expect(ids).toContain("ask_gm_checkmate");
  });

  it("History: who_built_you (canonical 3-form alternate)", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_gm_who_built_you");
  });

  it("Identity: who (canonical 3-form alternate)", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_gm_who");
  });

  it("Cosmic: alive + why_chess", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_gm_alive");
    expect(ids).toContain("ask_gm_why_chess");
  });

  it("Relationships: about_authority + about_cult", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_gm_about_authority");
    expect(ids).toContain("ask_gm_about_cult");
  });

  it("Personal: matrix_preparing_for + oracle_arena", () => {
    const ids = THE_GAME_MASTER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_gm_matrix_preparing_for");
    expect(ids).toContain("ask_gm_oracle_arena");
  });
});
