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

  it("gates Act 5 topics behind act5_intro_complete", () => {
    const preAct5 = new Set<string>(["act1_intro_complete", "act3_intro_complete"]);
    const preIds = getAvailableAskTopics("elara", preAct5, 5).map((t) => t.id);
    expect(preIds).not.toContain("ask_elara_star_map");
    expect(preIds).not.toContain("ask_elara_shattered_frontier");

    const postAct5 = new Set<string>([
      "act1_intro_complete",
      "act3_intro_complete",
      "act5_intro_complete",
    ]);
    const elara = getAvailableAskTopics("elara", postAct5, 5).map((t) => t.id);
    const human = getAvailableAskTopics("human", postAct5, 5).map((t) => t.id);
    expect(elara).toEqual(
      expect.arrayContaining([
        "ask_elara_star_map",
        "ask_elara_shattered_frontier",
        "ask_elara_kael_contamination",
      ]),
    );
    expect(human).toEqual(
      expect.arrayContaining([
        "ask_human_star_map",
        "ask_human_shattered_frontier",
        "ask_human_kael_contamination",
      ]),
    );
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
