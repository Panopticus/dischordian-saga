import { describe, expect, it } from "vitest";
import {
  COMPANION_ASK_TOPICS,
  getAvailableAskTopics,
  getAskTopic,
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

  it("gates Act 2 topics behind Act 2 flags", () => {
    const flagsNoAct2 = new Set<string>(["act1_intro_complete"]);
    expect(
      getAvailableAskTopics("elara", flagsNoAct2, 2).map((t) => t.id),
    ).not.toContain("ask_elara_dual_signal");
    expect(
      getAvailableAskTopics("human", flagsNoAct2, 2).map((t) => t.id),
    ).not.toContain("ask_human_substrate_louder");

    const flagsAct2 = new Set<string>([
      "act1_intro_complete",
      "act2_dual_signal_activated",
      "act2_partial_reveal",
    ]);
    const elaraAct2 = getAvailableAskTopics("elara", flagsAct2, 2).map((t) => t.id);
    const humanAct2 = getAvailableAskTopics("human", flagsAct2, 2).map((t) => t.id);
    expect(elaraAct2).toContain("ask_elara_dual_signal");
    expect(elaraAct2).toContain("ask_elara_substrate_louder");
    expect(elaraAct2).toContain("ask_elara_the_almost");
    expect(humanAct2).toContain("ask_human_dual_signal");
    expect(humanAct2).toContain("ask_human_substrate_louder");
    expect(humanAct2).toContain("ask_human_the_almost");
  });

  it("has at least one topic per speaker unlocked at Act 2", () => {
    const act2Elara = COMPANION_ASK_TOPICS.filter(
      (t) => t.speaker === "elara" && t.unlockedFromAct === 2,
    );
    const act2Human = COMPANION_ASK_TOPICS.filter(
      (t) => t.speaker === "human" && t.unlockedFromAct === 2,
    );
    expect(act2Elara.length).toBeGreaterThan(0);
    expect(act2Human.length).toBeGreaterThan(0);
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
