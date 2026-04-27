// apps/shared/npcs/__tests__/askBanks.the_oracle.test.ts
//
// Phase 6b.3 part-1 verification — The Oracle ask-topics bank
// (~14 topics walking the canonical 10-stage timeline arc per
// writers'-guide spec).
//
// Validates per the_oracle.md §1.1-1.5 + §2.x timeline canon:
//   1. ≥14 topics shipped covering canonical 10-stage timeline +
//      Identity (multi-act 4-act arc) + Relationships + Personal
//   2. All npcKey "the_oracle"
//   3. Topic ids unique + labels ≤24 chars
//   4. Identity multi-act arc has 3 alternates (Acts 5/6/7) per
//      writers'-guide canonical "fully answered post-Ch6
//      disambiguation" canon
//   5. §1.3 vocabulary anchors land canonically:
//      - "underneath" (Tell #2 substrate-as-position)
//      - "we / us / our" (Tell #3 we-of-witness; Tell #6 de-centered)
//      - "choose" / "choosing" (Tell #4 forward-looking)
//      - "take it / spend it" (Tell #5 transferred-instinct closure)
//      - "deception" (Tell #1 responsibility-without-agency)
//      - "Disappearance" (canonical end-of-arc anchor)
//   6. §1.3 forbidden vocabulary absent:
//      - destiny / fate / prophesy / grace / sin / evil / holy
//      - probability / version (Seer's vocabulary)
//      - contract / fine print (Locke's vocabulary)
//   7. Cross-character canon: 3 new public flags wired
//      (oracle_clone_canon_disclosed / oracle_meme_disclosed_to_player
//       / oracle_will_refuse_canonical_return)

import { describe, it, expect } from "vitest";
import { THE_ORACLE_ASK_TOPICS } from "../askBanks/the_oracle";
import { getAskTopicsFor } from "../askBanks";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

describe("THE_ORACLE_ASK_TOPICS — bank shape", () => {
  it("ships ≥14 topics (Phase 6b.3 baseline target)", () => {
    expect(THE_ORACLE_ASK_TOPICS.length).toBeGreaterThanOrEqual(14);
  });

  it("every topic is owned by the_oracle", () => {
    for (const t of THE_ORACLE_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("the_oracle");
    }
  });

  it("topic ids are unique", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of THE_ORACLE_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of THE_ORACLE_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('the_oracle')", () => {
    const fromAggregator = getAskTopicsFor("the_oracle");
    expect(fromAggregator.length).toBe(THE_ORACLE_ASK_TOPICS.length);
  });
});

describe("Canonical 10-stage timeline coverage", () => {
  it("Origin: soul_debate + why_lost", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_soul_debate");
    expect(ids).toContain("ask_oracle_why_lost");
  });

  it("Harvest: ask_oracle_harvest", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_harvest");
  });

  it("Prisoner: ask_oracle_prisoner (canonical reveal-gated)", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_prisoner",
    );
    expect(t).toBeDefined();
    // Canonical reveal-gate: only fully accessible post-Ch6
    // disambiguation
    expect(t?.unlockFlag).toBe("oracle_disambiguated_player_from_clone");
    expect(t?.unlockedFromAct).toBe(6);
    expect(t?.requiresTrustBand).toBe("Present");
  });

  it("Jailer: canonical 'yes' register", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_jailer",
    );
    expect(t?.answer).toMatch(/^Yes\./);
    expect(t?.answer).toMatch(/I was my own warden/);
  });

  it("False Prophet: canonical 'no — that was my clone' register", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_false_prophet",
    );
    expect(t?.answer).toMatch(/^No\./);
    expect(t?.answer).toMatch(/That was my clone/);
    expect(t?.answer).toMatch(/two falsifications layered/);
    expect(t?.setsPublicFlags).toContain("oracle_clone_canon_disclosed");
  });

  it("Silence: ask_oracle_silence", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_silence");
  });

  it("Liberation: canonical 'Enigma + Programmer destroyed the Warden' anchor", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_liberation",
    );
    expect(t?.answer).toMatch(/Enigma and the Programmer/);
    expect(t?.answer).toMatch(/destroyed the Warden/);
  });

  it("Fall / Revelation: ask_oracle_revelation", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_revelation");
  });

  it("Disappearance: canonical 'I am already going' register", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_disappear",
    );
    expect(t?.answer).toMatch(/I disappear at the end of time/);
    expect(t?.answer).toMatch(/I am already going/);
  });
});

describe("Identity multi-act 4-act arc (canonical post-Ch6 fully-answered canon)", () => {
  const whoTopic = THE_ORACLE_ASK_TOPICS.find(
    (t) => t.id === "ask_oracle_who",
  );

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("base answer (Acts 5+) lands canonical 'the one underneath' Ch5 register", () => {
    expect(whoTopic?.answer).toMatch(/the one underneath/i);
    expect(whoTopic?.answer).toMatch(/Choose me instead of remember me/);
  });

  it("has 2 alternate answers (Acts 6 + Acts 7) for canonical 4-act progression", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(2);
    const acts = whoTopic?.alternateAnswers
      ?.map((a) => a.unlockedFromAct)
      .sort();
    expect(acts).toEqual([6, 7]);
  });

  it("Acts 6+ alternate lands canonical 'underneath the three' disambiguation register", () => {
    const act6 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 6,
    );
    expect(act6?.answer).toMatch(/Prisoner.*Jailer.*False Prophet/i);
    expect(act6?.answer).toMatch(/canonical me is underneath the three/i);
    expect(act6?.requiredFlag).toBe(
      "oracle_disambiguated_player_from_clone",
    );
  });

  it("Acts 7+ alternate lands canonical 'we walked together' register", () => {
    const act7 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 7,
    );
    expect(act7?.answer).toMatch(/Mechronis bench/);
    expect(act7?.answer).toMatch(/We walked together/);
    expect(act7?.answer).toMatch(/before the Disappearance/);
    expect(act7?.requiredFlag).toBe("oracle_mechronis_memory_witnessed");
  });

  it("base + alternates carry distinct canonical voIds", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    expect(ids.size).toBe(3);
  });
});

describe("§1.3 vocabulary canon — anchor word landings", () => {
  const allText = THE_ORACLE_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("canonical 'underneath' anchor (Tell #2 substrate-as-position) lands ≥4 times", () => {
    const matches = allText.match(/\bunderneath\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(4);
  });

  it("canonical 'we / us / our' anchor (Tell #3 + #6 de-centered) lands ≥10 times", () => {
    // The Oracle's most-load-bearing voice canon: prefers we / us /
    // our over canonical first-person-singular per §1.4 tell #6.
    const matches = allText.match(/\b(we|us|our)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(10);
  });

  it("canonical 'choose' / 'choosing' anchor (Tell #4) lands ≥3 times", () => {
    const matches = allText.match(/\bchoos(e|ing)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("canonical 'take it' / 'spend it' transferred-instinct closure (Tell #5) lands", () => {
    expect(allText).toMatch(/\bTake (the|what|it)\b/);
    expect(allText).toMatch(/\bSpend it\b/);
  });

  it("canonical 'deception' anchor (Tell #1 responsibility-without-agency) lands ≥3 times", () => {
    const matches = allText.match(/\bdeception\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("canonical 'Disappearance' / 'disappear' anchor lands ≥3 times", () => {
    const matches = allText.match(/\b(Disappearance|disappear(ing|s)?)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("canonical 'I am sorry' Tell #1 responsibility-without-agency apology lands ≥2 times", () => {
    // §1.4 tell #1: the Oracle canonically apologises for what was
    // not his (the Meme-impersonation, the deception).
    const matches = allText.match(/\bI am sorry\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(2);
  });
});

describe("§1.3 forbidden-vocabulary protections", () => {
  const allText = THE_ORACLE_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("NO 'destiny' / 'fate' / 'fated' / 'destined'", () => {
    expect(allText).not.toMatch(/\bdestin(y|ed)\b/i);
    expect(allText).not.toMatch(/\bfate(d)?\b/i);
  });

  it("NO 'prophesy' / 'prophesies' (forbidden self-description per §1.3)", () => {
    // §1.3: "The Oracle does NOT canonically use prophesy as self-
    // description — he canonically *speaks from underneath*, not
    // canonically *prophesies from above*."
    expect(allText).not.toMatch(/\bprophes(y|ies|ying)\b/i);
  });

  it("NO 'grace' / 'sin' / 'evil' / 'holy' / 'sacrament' (Hierophant's vocabulary)", () => {
    expect(allText).not.toMatch(/\b(grace|sin|evil|holy|sacrament)\b/i);
  });

  it("NO 'probability' / 'version' (Seer's vocabulary)", () => {
    // §1.3: "the Seer's vocabulary; the Oracle canonically does not
    // use the Seer's table-vocabulary even in dream-sequences."
    expect(allText).not.toMatch(/\bprobabilit(y|ies)\b/i);
    expect(allText).not.toMatch(/\bversion(s)?\b/i);
  });

  it("NO 'contract' / 'retainer' / 'fine print' (Locke's vocabulary)", () => {
    expect(allText).not.toMatch(/\b(retainer|fine print)\b/i);
    expect(allText).not.toMatch(/\bcontract(s|ed|ing)?\b/i);
  });
});

describe("Oracle cross-character canon — public-flag wiring", () => {
  it("'Was that you the Insurgency trusted?' writes oracle_clone_canon_disclosed", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_false_prophet",
    );
    expect(t?.setsPublicFlags).toContain("oracle_clone_canon_disclosed");
  });

  it("'Tell me about the Meme' writes oracle_meme_disclosed_to_player", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_about_meme",
    );
    expect(t?.setsPublicFlags).toContain("oracle_meme_disclosed_to_player");
  });

  it("'Tell me about the Hierophant' writes oracle_will_refuse_canonical_return", () => {
    const t = THE_ORACLE_ASK_TOPICS.find(
      (x) => x.id === "ask_oracle_about_hierophant",
    );
    expect(t?.setsPublicFlags).toContain(
      "oracle_will_refuse_canonical_return",
    );
  });

  it("all 3 new public flags have registry entries", () => {
    const newFlags = [
      "oracle_clone_canon_disclosed",
      "oracle_meme_disclosed_to_player",
      "oracle_will_refuse_canonical_return",
    ];
    for (const flag of newFlags) {
      const entry = CROSS_CHARACTER_REACTIONS.find((r) => r.flag === flag);
      expect(entry, flag).toBeDefined();
      expect(entry?.setBy, flag).toContain("the_oracle");
    }
  });
});

describe("Oracle trust-band gating canon", () => {
  it("Witnessed-band topics: soul_debate / why_lost / harvest / jailer / silence / liberation / why_dreams", () => {
    const witnessedIds = [
      "ask_oracle_soul_debate",
      "ask_oracle_why_lost",
      "ask_oracle_harvest",
      "ask_oracle_jailer",
      "ask_oracle_silence",
      "ask_oracle_liberation",
      "ask_oracle_why_dreams",
    ];
    for (const id of witnessedIds) {
      const t = THE_ORACLE_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresTrustBand, id).toBe("Witnessed");
    }
  });

  it("Present-band topics (post-Ch6 disambiguation): prisoner / false_prophet / revelation / disappear / about_meme / about_hierophant", () => {
    const presentIds = [
      "ask_oracle_prisoner",
      "ask_oracle_false_prophet",
      "ask_oracle_revelation",
      "ask_oracle_disappear",
      "ask_oracle_about_meme",
      "ask_oracle_about_hierophant",
    ];
    for (const id of presentIds) {
      const t = THE_ORACLE_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresTrustBand, id).toBe("Present");
    }
  });
});

describe("Canonical category coverage", () => {
  it("Origin (2 topics)", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_soul_debate");
    expect(ids).toContain("ask_oracle_why_lost");
  });

  it("Captivity stages (3 topics): Harvest + Prisoner + Jailer", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_harvest");
    expect(ids).toContain("ask_oracle_prisoner");
    expect(ids).toContain("ask_oracle_jailer");
  });

  it("Falsification + Silence (2 topics): false_prophet + silence", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_false_prophet");
    expect(ids).toContain("ask_oracle_silence");
  });

  it("Liberation + Fall + Disappearance (3 topics)", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_liberation");
    expect(ids).toContain("ask_oracle_revelation");
    expect(ids).toContain("ask_oracle_disappear");
  });

  it("Identity (1 multi-act topic)", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_who");
  });

  it("Relationships (2 topics): about_meme + about_hierophant", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_about_meme");
    expect(ids).toContain("ask_oracle_about_hierophant");
  });

  it("Personal (1 topic): why_dreams", () => {
    const ids = THE_ORACLE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_oracle_why_dreams");
  });
});
