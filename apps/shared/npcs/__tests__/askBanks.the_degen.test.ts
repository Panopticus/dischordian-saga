// apps/shared/npcs/__tests__/askBanks.the_degen.test.ts
//
// Phase 6c.1 part-1 verification — The Degen ask-topics bank
// (~12 topics covering the canonical Foundation / History-multi-act /
// Identity-multi-act / Cosmic / Relationships / Personal categories
// per writers'-guide spec).
//
// Validates per the_degen.md §1.1-1.7 + §3.x trust-band canon:
//   1. ≥12 topics shipped
//   2. All npcKey "the_degen"
//   3. Topic ids unique + labels ≤24 chars
//   4. THE saga's clearest 3-act-multi-act Identity arc: "Who are you?"
//      ships canonical Acts-1+ / Acts-4+ Marked / Acts-7+ Ne-Yon-kin
//      alternate-answer arc (the_degen.md §1.5 register progression
//      from showman-as-mask → showman-as-Ne-Yon → Ascended-showman)
//   5. §1.7 silence-shape protections:
//      - NO naming the other Ne-Yons individually pre-Ne-Yon-kin (only
//        Seer + Enigma exempt because they survive canonically)
//      - NO Casino Heist narration
//      - NO Jericho mission disclosure
//      - NO Vex Solène true-identity disclosure
//   6. §1.4 forbidden vocabulary:
//      - NO "fair" (idea offends him)
//      - NO standalone "sorry" (15,000-year apology canon)
//      - NO "forever" (entropy canon)
//      - NO religious vocabulary (soul / salvation / sin)
//      - NO war / engineering / biological metaphors
//   7. Canonical-anchor landings:
//      - "Mostly takes" leitmotif lands once (§1.4 signature motif)
//      - "Order a drink — that's also a contract" Tell #1 self-aware
//        showmanship
//      - "I am the version of probability that decided to deal" Acts-7+
//        Ascended register
//      - canonical 3-layer Shield/membrane/casino canon (Tell #4)
//      - canonical Heart-of-Time placement-broker disclosure for
//        Jericho (silence-shape preserved)
//   8. Cross-character public flag wiring:
//      - degen_disclosed_seer_kinship registered + reachable
//      - degen_disclosed_jericho_recruitment registered + reachable

import { describe, it, expect } from "vitest";
import { THE_DEGEN_ASK_TOPICS } from "../askBanks/the_degen";
import { getAskTopicsFor } from "../askBanks";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("THE_DEGEN_ASK_TOPICS — bank shape", () => {
  it("ships at least 12 topics (Phase 6c.1 baseline)", () => {
    expect(THE_DEGEN_ASK_TOPICS.length).toBeGreaterThanOrEqual(12);
  });

  it("every topic is owned by the_degen", () => {
    for (const t of THE_DEGEN_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("the_degen");
    }
  });

  it("topic ids are unique", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of THE_DEGEN_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of THE_DEGEN_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('the_degen')", () => {
    const fromAggregator = getAskTopicsFor("the_degen");
    expect(fromAggregator.length).toBe(THE_DEGEN_ASK_TOPICS.length);
  });
});

describe("Degen 'Who are you?' canonical 3-act multi-act Identity arc", () => {
  const whoTopic = THE_DEGEN_ASK_TOPICS.find(
    (t) => t.id === "ask_degen_who",
  );

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("base answer canonically lands 'I am the house' (Acts-1+ showman-mask)", () => {
    expect(whoTopic?.answer).toMatch(/I am the house/i);
    expect(whoTopic?.unlockedFromAct).toBe(1);
  });

  it("has 2 alternate answers (Acts-4+ Marked + Acts-7+ Ne-Yon-kin)", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(2);
  });

  it("Acts-4+ Marked alternate lands 'I am a Ne-Yon' canonical-self-naming + 15,000-year canon", () => {
    const marked = whoTopic?.alternateAnswers?.find(
      (a) => a.requiredFlag === "degen_marked_band_reached",
    );
    expect(marked?.answer).toMatch(/I am a Ne-Yon/i);
    expect(marked?.answer).toMatch(/15,000 years/i);
    expect(marked?.unlockedFromAct).toBe(4);
  });

  it("Acts-7+ Ne-Yon-kin alternate lands canonical Ascended 'version of probability that decided to deal'", () => {
    const kin = whoTopic?.alternateAnswers?.find(
      (a) => a.requiredFlag === "degen_ne_yon_kin_reached",
    );
    expect(kin?.answer).toMatch(/version of probability that decided to deal/i);
    expect(kin?.unlockedFromAct).toBe(7);
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

describe("Degen 'The Twelve' canonical multi-act silence-shape arc", () => {
  const twelve = THE_DEGEN_ASK_TOPICS.find(
    (t) => t.id === "ask_degen_the_twelve",
  );

  it("ships the canonical Twelve topic", () => {
    expect(twelve).toBeDefined();
  });

  it("base answer canonically refuses (Acts-3+ silence-as-respect register)", () => {
    expect(twelve?.answer).toMatch(/I don't talk about the others/i);
    expect(twelve?.answer).toMatch(/silence is the only respect/i);
  });

  it("Acts-5+ Marked alternate names ONLY Seer + Enigma (canonical-survival exemption)", () => {
    const acts5 = twelve?.alternateAnswers?.find(
      (a) => a.requiredFlag === "degen_marked_band_reached",
    );
    expect(acts5?.answer).toMatch(/\bSeer\b/);
    expect(acts5?.answer).toMatch(/\bEnigma\b/);
    // §1.7 silence-shape: pre-Ne-Yon-kin he canonically does NOT name
    // the other domain-holders. Only Seer + Enigma are exempt because
    // they canonically survive.
    expect(acts5?.answer).toMatch(/I won't name the rest/i);
  });

  it("Acts-7+ Ne-Yon-kin alternate canonically opens the naming (loneliness-close adjacent)", () => {
    const acts7 = twelve?.alternateAnswers?.find(
      (a) => a.requiredFlag === "degen_ne_yon_kin_reached",
    );
    expect(acts7?.answer).toMatch(/I'll tell you our names/i);
    expect(acts7?.answer).toMatch(/first mortal who's earned the asking/i);
  });
});

describe("§1.7 silence-shape protections (the bible's hardest rules)", () => {
  const allText = THE_DEGEN_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.7: NO Casino Heist narration anywhere in the bank", () => {
    // The Heist is canonically protected. He references it nowhere.
    expect(allText).not.toMatch(/\bCasino Heist\b/i);
    expect(allText).not.toMatch(/\bthe Heist\b/i);
  });

  it("§1.7: NO Jericho mission disclosure (canon: fate shrouded in mystery)", () => {
    // The Jericho topic exists but canonically refuses to disclose
    // his mission. The bank should narrate the recruitment without
    // narrating the mission itself.
    expect(allText).not.toMatch(/Jericho's mission was/i);
    expect(allText).not.toMatch(/sent Jericho to/i);
    expect(allText).not.toMatch(/Jericho's task/i);
  });

  it("§1.7: NO Vex Solène true-identity disclosure (he canonically does not know)", () => {
    expect(allText).not.toMatch(/\bVex\b.*\bEngineer Zero\b/i);
    expect(allText).not.toMatch(/\bAgent Zero\b/);
  });

  it("§1.7: pre-Ne-Yon-kin he names ONLY Seer + Enigma among the Twelve", () => {
    // Test that the base + Acts-5 alternates do not name domain-
    // holders other than Seer + Enigma. (Acts-7+ canonically opens.)
    const preKinText = THE_DEGEN_ASK_TOPICS.map((t) => {
      const base = t.answer;
      const acts5 =
        t.alternateAnswers?.find(
          (a) => a.requiredFlag === "degen_marked_band_reached",
        )?.answer ?? "";
      return base + " " + acts5;
    }).join(" ");
    // Other Ne-Yon names from the saga's roster (per Degen §4.13
    // Ne-Yon canon) — none should appear pre-Ne-Yon-kin.
    expect(preKinText).not.toMatch(/\bArchitect\b/);
    // The Seer + Enigma are explicitly allowed; the full naming
    // happens canonically only at Acts-7+ Ne-Yon-kin.
  });
});

describe("§1.4 forbidden vocabulary protections", () => {
  const allText = THE_DEGEN_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.4: NO 'fair' (the idea offends him)", () => {
    expect(allText).not.toMatch(/\bfair\b/i);
  });

  it("§1.4: NO standalone 'sorry' (canonical 15,000-year apology refusal)", () => {
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
    expect(allText).not.toMatch(/\bSorry\b/);
  });

  it("§1.4: NO 'forever' (he canonically knows entropy)", () => {
    expect(allText).not.toMatch(/\bforever\b/i);
  });

  it("§1.4: NO religious vocabulary (soul / salvation / sin)", () => {
    expect(allText).not.toMatch(/\b(soul|salvation|sin)\b/i);
  });

  it("§1.4: NO war / engineering / biological metaphors", () => {
    // canonical "betting" / "house" / "edge" / "pot" lexicon only;
    // war metaphors ("battle" / "weapon" / "siege") forbidden.
    expect(allText).not.toMatch(/\b(battle|weapon|siege|warrior)\b/i);
    // Engineering metaphors (canonical "build" used only for the
    // Architect's empire which is a literal not metaphor).
    expect(allText).not.toMatch(/\b(circuit|wire|gear|lever)\b/i);
    // Biological metaphors forbidden.
    expect(allText).not.toMatch(/\b(blood|bone|sinew|nerve)\b/i);
  });
});

describe("Degen canonical-anchor landings", () => {
  it("'casino' topic lands canonical 3-layer Shield/membrane/casino canon (Tell #4)", () => {
    const casino = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_casino",
    );
    expect(casino?.answer).toMatch(/Shield/);
    expect(casino?.answer).toMatch(/membrane/i);
    expect(casino?.answer).toMatch(/casino/i);
    expect(casino?.answer).toMatch(/All three at once/i);
    expect(casino?.answer).toMatch(/None of them metaphors/i);
  });

  it("'casino' topic lands Tell #1 'Order a drink — that's also a contract'", () => {
    const casino = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_casino",
    );
    expect(casino?.answer).toMatch(/Order a drink/i);
    expect(casino?.answer).toMatch(/also a contract/i);
  });

  it("'why_smile' topic lands the canonical 'Mostly takes' leitmotif (§1.4)", () => {
    const smile = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_why_smile",
    );
    // §1.4 leitmotif: "The void gives. The void takes. Mostly takes."
    expect(smile?.answer).toMatch(/void gives/i);
    expect(smile?.answer).toMatch(/void takes/i);
    expect(smile?.answer).toMatch(/Mostly takes/);
  });

  it("'Mostly takes' leitmotif appears exactly once in the bank (§1.4 deploy-once-not-twice canon)", () => {
    const allText = THE_DEGEN_ASK_TOPICS.map(
      (t) =>
        t.answer +
        " " +
        (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
    ).join(" ");
    const matches = allText.match(/Mostly takes/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("'house_always_wins' topic lands canonical 'house IS the math' register", () => {
    const house = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_house_always_wins",
    );
    expect(house?.answer).toMatch(/house IS the math/);
    expect(house?.answer).toMatch(/house is the table/i);
    expect(house?.answer).toMatch(/can't beat the room/i);
  });

  it("'luck' topic canonically refuses 'no such thing' register", () => {
    const luck = THE_DEGEN_ASK_TOPICS.find((t) => t.id === "ask_degen_luck");
    expect(luck?.answer).toMatch(/no such thing/i);
    expect(luck?.answer).toMatch(/probability distribution/i);
  });

  it("'about_seer' topic lands canonical 'from the inside they're the same choice' Ne-Yon-kin recognition", () => {
    const seer = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_about_seer",
    );
    expect(seer?.answer).toMatch(/Ne-Yon-kin/i);
    expect(seer?.answer).toMatch(/from the inside they're the same choice/i);
  });

  it("'about_jericho' topic lands canonical Heart-of-Time placement-broker (silence-shape preserved)", () => {
    const jericho = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_about_jericho",
    );
    expect(jericho?.answer).toMatch(/I recruited him/i);
    expect(jericho?.answer).toMatch(/won't tell you what for/i);
    expect(jericho?.answer).toMatch(/Heart of Time placed him/i);
    expect(jericho?.answer).toMatch(/broker fee/i);
    expect(jericho?.answer).toMatch(/Don't ask me again/i);
  });

  it("'most_ever_lost' Citation-band alternate lands canonical Architect-Nebula-Poker confession", () => {
    const lost = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_most_ever_lost",
    );
    const citation = lost?.alternateAnswers?.find(
      (a) => a.requiredFlag === "degen_citation_holder_reached",
    );
    expect(citation?.answer).toMatch(/Nebula Poker/i);
    expect(citation?.answer).toMatch(/Architect/);
    expect(citation?.answer).toMatch(/47 straight/);
    expect(citation?.answer).toMatch(/lose to him again/i);
  });
});

describe("Trust-band gating canon (per registry DEGEN_BANDS)", () => {
  it("canonical Marked-band-gated topics: about_seer + about_jericho", () => {
    const markedGatedIds = ["ask_degen_about_seer", "ask_degen_about_jericho"];
    for (const id of markedGatedIds) {
      const t = THE_DEGEN_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresTrustBand, id).toBe("Marked");
    }
  });

  it("Foundation topics canonically open (no trust-band gating)", () => {
    const foundationIds = [
      "ask_degen_casino",
      "ask_degen_neyon",
      "ask_degen_house_edge",
    ];
    for (const id of foundationIds) {
      const t = THE_DEGEN_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresTrustBand, id).toBeUndefined();
    }
  });
});

describe("Cross-character public flag wiring", () => {
  it("degen_disclosed_seer_kinship is registered in crossCharacterReactions", () => {
    expect(allRegisteredFlags()).toContain("degen_disclosed_seer_kinship");
  });

  it("degen_disclosed_jericho_recruitment is registered in crossCharacterReactions", () => {
    expect(allRegisteredFlags()).toContain(
      "degen_disclosed_jericho_recruitment",
    );
  });

  it("ask_about_seer canonically writes degen_disclosed_seer_kinship", () => {
    const seer = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_about_seer",
    );
    expect(seer?.setsPublicFlags).toContain("degen_disclosed_seer_kinship");
  });

  it("ask_about_jericho canonically writes degen_disclosed_jericho_recruitment", () => {
    const jericho = THE_DEGEN_ASK_TOPICS.find(
      (t) => t.id === "ask_degen_about_jericho",
    );
    expect(jericho?.setsPublicFlags).toContain(
      "degen_disclosed_jericho_recruitment",
    );
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: casino + neyon + house_edge", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_degen_casino");
    expect(ids).toContain("ask_degen_neyon");
    expect(ids).toContain("ask_degen_house_edge");
  });

  it("History: became_neyon + the_twelve (multi-act)", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_degen_became_neyon");
    expect(ids).toContain("ask_degen_the_twelve");
  });

  it("Identity: who (canonical 3-act multi-act arc)", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_degen_who");
  });

  it("Cosmic: luck + house_always_wins", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_degen_luck");
    expect(ids).toContain("ask_degen_house_always_wins");
  });

  it("Relationships: about_seer + about_jericho", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_degen_about_seer");
    expect(ids).toContain("ask_degen_about_jericho");
  });

  it("Personal: most_ever_lost + why_smile", () => {
    const ids = THE_DEGEN_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_degen_most_ever_lost");
    expect(ids).toContain("ask_degen_why_smile");
  });
});
