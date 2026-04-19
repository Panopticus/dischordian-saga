import { describe, expect, it } from "vitest";
import {
  buildAskLattice,
  buildBothSpeakerLattices,
  countUpcomingAtAct,
} from "./companionAskLattice";
import { COMPANION_ASK_TOPICS } from "./companionAskTopics";

const ACT1_FLAGS = new Set<string>([
  "act1_intro_complete",
  "act1_substrate_explain_heard",
  "prelude_beat_d_first_slate_read",
]);

const ACT7_FLAGS = new Set<string>([
  "act1_intro_complete",
  "act1_substrate_explain_heard",
  "prelude_beat_d_first_slate_read",
  "act3_intro_complete",
  "kael_lore_discovered",
  "act2_dual_signal_activated",
  "act3_kael_logs_unlocked",
  "act4_revelation_complete",
  "act4_army_unlocked",
  "act5_map_first_open",
  "act6_elara_confession_heard",
  "act6_human_confession_heard",
  "act6_confession_close",
  "act7_convergence_landing",
  "act7_arc_closes",
]);

describe("companionAskLattice — buildAskLattice", () => {
  it("returns only topics for the requested speaker", () => {
    const view = buildAskLattice({
      speaker: "elara",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    for (const t of view.available) expect(t.speaker).toBe("elara");
    for (const t of view.upcoming) expect(t.speaker).toBe("elara");
  });

  it("partitions available vs. upcoming by act+flag gating", () => {
    const view = buildAskLattice({
      speaker: "elara",
      currentAct: 1,
      flags: ACT1_FLAGS,
    });
    for (const t of view.available) {
      expect(t.unlockedFromAct).toBeLessThanOrEqual(1);
      expect(ACT1_FLAGS.has(t.unlockFlag)).toBe(true);
    }
    for (const t of view.upcoming) {
      const gated = t.unlockedFromAct > 1 || !ACT1_FLAGS.has(t.unlockFlag);
      expect(gated, `${t.id} is upcoming but all gates pass`).toBe(true);
    }
  });

  it("sorts available topics by unlockedFromAct ascending", () => {
    const view = buildAskLattice({
      speaker: "elara",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    for (let i = 1; i < view.available.length; i++) {
      expect(view.available[i].unlockedFromAct).toBeGreaterThanOrEqual(
        view.available[i - 1].unlockedFromAct
      );
    }
  });

  it("groups available topics by act in byAct map", () => {
    const view = buildAskLattice({
      speaker: "elara",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    let total = 0;
    for (const [act, topics] of view.byAct) {
      for (const t of topics) {
        expect(t.unlockedFromAct).toBe(act);
        total++;
      }
    }
    expect(total).toBe(view.available.length);
  });

  it("precomputes resolvedAnswers for every available topic", () => {
    const view = buildAskLattice({
      speaker: "human",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    for (const t of view.available) {
      const answer = view.resolvedAnswers.get(t.id);
      expect(answer, `${t.id} missing resolvedAnswer`).toBeTruthy();
      expect(answer!.trim().length).toBeGreaterThan(0);
    }
  });

  it("returns the act-progressed answer for ask_human_who at Act 7", () => {
    const view = buildAskLattice({
      speaker: "human",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    const baseTopic = COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_human_who"
    )!;
    const resolved = view.resolvedAnswers.get("ask_human_who")!;
    expect(resolved).not.toBe(baseTopic.answer);
  });

  it("populates availableCounts only for the requested speaker", () => {
    const elaraView = buildAskLattice({
      speaker: "elara",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    expect(elaraView.availableCounts.elara).toBe(elaraView.available.length);
    expect(elaraView.availableCounts.human).toBe(0);

    const humanView = buildAskLattice({
      speaker: "human",
      currentAct: 7,
      flags: ACT7_FLAGS,
    });
    expect(humanView.availableCounts.human).toBe(humanView.available.length);
    expect(humanView.availableCounts.elara).toBe(0);
  });

  it("returns empty available set for a speaker with no flags", () => {
    const view = buildAskLattice({
      speaker: "elara",
      currentAct: 1,
      flags: new Set(),
    });
    expect(view.available).toHaveLength(0);
    expect(view.resolvedAnswers.size).toBe(0);
    expect(view.byAct.size).toBe(0);
    expect(view.upcoming.length).toBeGreaterThan(0);
  });
});

describe("countUpcomingAtAct", () => {
  it("counts only topics whose flag is already set but act is still future", () => {
    const counts = countUpcomingAtAct(6, ACT1_FLAGS);
    expect(counts.elara + counts.human).toBe(0);

    const richFlags = new Set([
      ...ACT1_FLAGS,
      "act6_elara_confession_heard",
      "act6_human_confession_heard",
      "act6_confession_close",
    ]);
    const countsRich = countUpcomingAtAct(6, richFlags);
    expect(countsRich.elara).toBeGreaterThan(0);
    expect(countsRich.human).toBeGreaterThan(0);
  });
});

describe("buildBothSpeakerLattices", () => {
  it("produces one view per speaker in a single call", () => {
    const pair = buildBothSpeakerLattices(7, ACT7_FLAGS);
    expect(pair.elara.available.length).toBeGreaterThan(0);
    expect(pair.human.available.length).toBeGreaterThan(0);
    for (const t of pair.elara.available) expect(t.speaker).toBe("elara");
    for (const t of pair.human.available) expect(t.speaker).toBe("human");
  });
});
