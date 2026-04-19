import { describe, expect, it } from "vitest";
import {
  COMPANION_ASK_TOPICS,
  getAvailableAskTopics,
  getAskTopic,
  resolveAskAnswer,
  toAskWheelChoice,
} from "./companionAskTopics";

describe("companionAskTopics", () => {
  it("registers at least 6 topics for each speaker", () => {
    const elara = COMPANION_ASK_TOPICS.filter((t) => t.speaker === "elara");
    const human = COMPANION_ASK_TOPICS.filter((t) => t.speaker === "human");
    expect(elara.length).toBeGreaterThanOrEqual(6);
    expect(human.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps every topic id globally unique", () => {
    const ids = COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("authors a non-empty question and answer for every topic", () => {
    for (const t of COMPANION_ASK_TOPICS) {
      expect(t.question.trim().length, `${t.id} has empty question`).toBeGreaterThan(0);
      expect(t.answer.trim().length, `${t.id} has empty answer`).toBeGreaterThan(0);
      expect(t.label.length, `${t.id} label too long`).toBeLessThanOrEqual(24);
    }
  });

  it("hides topics whose unlock flag is not set", () => {
    const flags = new Set<string>();
    expect(getAvailableAskTopics("elara", flags, 1)).toHaveLength(0);
    expect(getAvailableAskTopics("human", flags, 1)).toHaveLength(0);
  });

  it("reveals only act-appropriate topics once flags are set", () => {
    const flags = new Set<string>([
      "act1_intro_complete",
      "act1_substrate_explain_heard",
      "prelude_beat_d_first_slate_read",
      "kael_lore_discovered",
      "act3_intro_complete",
    ]);
    const act1Ids = getAvailableAskTopics("elara", flags, 1).map((t) => t.id);
    expect(act1Ids).not.toContain("ask_elara_warlord");
    expect(act1Ids).not.toContain("ask_elara_kael");
    const act3Ids = getAvailableAskTopics("elara", flags, 3).map((t) => t.id);
    expect(act3Ids).toContain("ask_elara_warlord");
    expect(act3Ids).toContain("ask_elara_kael");
  });

  it("getAskTopic resolves by id and returns undefined for unknown ids", () => {
    expect(getAskTopic("ask_elara_substrate")?.label).toBe("The substrate");
    expect(getAskTopic("does_not_exist")).toBeUndefined();
  });

  it("follow-up references point at real topic ids", () => {
    for (const t of COMPANION_ASK_TOPICS) {
      if (!t.followUp) continue;
      expect(
        getAskTopic(t.followUp),
        `${t.id} followUp ${t.followUp} does not resolve`
      ).toBeDefined();
    }
  });

  it("unlocks at least one topic for every Act 2–7 boundary", () => {
    for (const act of [2, 3, 4, 5, 6, 7]) {
      const topics = COMPANION_ASK_TOPICS.filter(
        (t) => t.unlockedFromAct === act
      );
      expect(
        topics.length,
        `no Ask topic with unlockedFromAct=${act}`
      ).toBeGreaterThan(0);
    }
  });

  it("covers both speakers across the Act 2–7 unlock range", () => {
    const act2To7 = COMPANION_ASK_TOPICS.filter(
      (t) => t.unlockedFromAct >= 2 && t.unlockedFromAct <= 7
    );
    expect(act2To7.some((t) => t.speaker === "elara")).toBe(true);
    expect(act2To7.some((t) => t.speaker === "human")).toBe(true);
  });

  it("authors every alternate answer with non-empty text and act >= base", () => {
    for (const t of COMPANION_ASK_TOPICS) {
      if (!t.alternateAnswers) continue;
      for (const a of t.alternateAnswers) {
        expect(
          a.answer.trim().length,
          `${t.id} alternate for act ${a.unlockedFromAct} is empty`
        ).toBeGreaterThan(0);
        expect(
          a.unlockedFromAct,
          `${t.id} alternate must gate above the base unlockedFromAct`
        ).toBeGreaterThan(t.unlockedFromAct);
      }
      const acts = t.alternateAnswers.map((a) => a.unlockedFromAct);
      expect(
        new Set(acts).size,
        `${t.id} has duplicate alternate act gates`
      ).toBe(acts.length);
    }
  });
});

describe("resolveAskAnswer", () => {
  it("returns the base answer when no alternates are declared", () => {
    const topic = getAskTopic("ask_elara_substrate")!;
    expect(resolveAskAnswer(topic, 7, new Set())).toBe(topic.answer);
  });

  it("returns the base answer before the earliest alternate unlocks", () => {
    const topic = getAskTopic("ask_human_who")!;
    expect(topic.alternateAnswers).toBeDefined();
    const base = resolveAskAnswer(topic, 5, new Set(["act1_intro_complete"]));
    expect(base).toBe(topic.answer);
  });

  it("picks the highest-act alternate that is ≤ current act", () => {
    const topic = getAskTopic("ask_human_who")!;
    const act6 = resolveAskAnswer(topic, 6, new Set());
    const act7 = resolveAskAnswer(topic, 7, new Set());
    expect(act6).not.toBe(topic.answer);
    expect(act7).not.toBe(topic.answer);
    expect(act6).not.toBe(act7);
    // Act 7 alternate wins over Act 6 alternate once both are in range.
    const act7Variant = topic.alternateAnswers!.find(
      (a) => a.unlockedFromAct === 7
    )!;
    expect(act7).toBe(act7Variant.answer);
  });

  it("honors a requiredFlag on an alternate", () => {
    const topic = {
      ...getAskTopic("ask_human_who")!,
      alternateAnswers: [
        { unlockedFromAct: 6, answer: "gated", requiredFlag: "needs_it" },
      ],
    };
    expect(resolveAskAnswer(topic, 7, new Set())).toBe(topic.answer);
    expect(resolveAskAnswer(topic, 7, new Set(["needs_it"]))).toBe("gated");
  });
});

describe("toAskWheelChoice adapter", () => {
  it("maps speaker → wheel side label", () => {
    const elaraTopic = getAskTopic("ask_elara_substrate")!;
    const humanTopic = getAskTopic("ask_human_substrate")!;
    expect(toAskWheelChoice(elaraTopic).sideLabel).toBe("humanity");
    expect(toAskWheelChoice(humanTopic).sideLabel).toBe("machine");
  });

  it("preserves the topic id for follow-up resolution", () => {
    const topic = getAskTopic("ask_elara_substrate")!;
    const wheel = toAskWheelChoice(topic);
    expect(wheel.topicId).toBe("ask_elara_substrate");
    expect(wheel.id.startsWith("wheel_")).toBe(true);
  });

  it("clamps shortText to ≤ 24 characters", () => {
    for (const topic of COMPANION_ASK_TOPICS) {
      const wheel = toAskWheelChoice(topic);
      expect(wheel.shortText.length).toBeLessThanOrEqual(24);
    }
  });
});
