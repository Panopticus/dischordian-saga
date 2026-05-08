import { describe, expect, it } from "vitest";
import {
  APPRENTICE_DIALOGUES,
  allTopics,
  archetypeDialogueLineCount,
  dialogueCoverage,
  topicLines,
  type DialogueChoice,
} from "./apprenticeDialogues";
import type { ApprenticeArchetype } from "./apprentices";

const ARCHS: ApprenticeArchetype[] = [
  "zealot",
  "ghost",
  "scholar",
  "revenant",
  "artisan",
  "oracle",
  "wanderer",
  "martyr",
  "heretic",
  "jester",
  "sentinel",
  "prodigal",
];

describe("apprenticeDialogues registry", () => {
  it("has all 12 archetype sets", () => {
    for (const a of ARCHS) {
      expect(APPRENTICE_DIALOGUES[a]).toBeDefined();
    }
  });

  it("each archetype has all four topic kinds", () => {
    for (const a of ARCHS) {
      const set = APPRENTICE_DIALOGUES[a];
      expect(set.past.kind).toBe("past");
      expect(set.calling.kind).toBe("calling");
      expect(set.mortality.kind).toBe("mortality");
      expect(set.us.kind).toBe("us");
    }
  });

  it("bond gates rise across topic kinds", () => {
    for (const a of ARCHS) {
      const s = APPRENTICE_DIALOGUES[a];
      expect(s.past.bondGate).toBeLessThan(s.calling.bondGate);
      expect(s.calling.bondGate).toBeLessThan(s.mortality.bondGate);
      expect(s.mortality.bondGate).toBeLessThan(s.us.bondGate);
    }
  });

  it("every topic has at least 3 entry choices", () => {
    for (const t of allTopics()) {
      expect(t.choices.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every topic has a non-empty opener", () => {
    for (const t of allTopics()) {
      expect(t.opener.length).toBeGreaterThan(0);
      expect(t.opener[0].length).toBeGreaterThan(0);
    }
  });

  it("every topic has at least one follow-up branch", () => {
    for (const t of allTopics()) {
      const hasFollowup = t.choices.some(
        (c) => c.followups && c.followups.length > 0,
      );
      expect(hasFollowup).toBe(true);
    }
  });

  it("every choice has at least one NPC reply line", () => {
    const visit = (cs: readonly DialogueChoice[]) => {
      for (const c of cs) {
        expect(c.npcReply.length).toBeGreaterThan(0);
        expect(c.npcReply[0].length).toBeGreaterThan(0);
        if (c.followups) visit(c.followups);
      }
    };
    for (const t of allTopics()) {
      visit(t.choices);
    }
  });

  it("every choice id is unique within its parent set", () => {
    for (const t of allTopics()) {
      const ids = t.choices.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const c of t.choices) {
        if (c.followups) {
          const fids = c.followups.map((x) => x.id);
          expect(new Set(fids).size).toBe(fids.length);
        }
      }
    }
  });

  it("every archetype has at least 25 dialogue NPC lines", () => {
    for (const a of ARCHS) {
      expect(archetypeDialogueLineCount(a)).toBeGreaterThanOrEqual(25);
    }
  });

  it("topicLines walks opener + every choice + every followup reply", () => {
    const set = APPRENTICE_DIALOGUES.scholar;
    const lines = topicLines(set.past);
    // opener (2) + 3 main choices each with replies + at least 2 followups
    expect(lines.length).toBeGreaterThanOrEqual(7);
    expect(lines[0].path).toBe("opener_0");
    expect(lines[0].text).toBe(set.past.opener[0]);
  });

  it("dialogueCoverage returns 12/12 implemented, no missing", () => {
    const cov = dialogueCoverage();
    expect(cov.declared).toBe(12);
    expect(cov.implemented).toBe(12);
    expect(cov.missing).toEqual([]);
  });
});

describe("Tone palette + bond deltas", () => {
  it("warm choices give positive bond, cold give negative", () => {
    let warmCount = 0;
    let coldCount = 0;
    for (const t of allTopics()) {
      for (const c of t.choices) {
        if (c.tone === "warm") {
          expect(c.bondDelta).toBeGreaterThan(0);
          warmCount++;
        } else if (c.tone === "cold") {
          expect(c.bondDelta).toBeLessThan(0);
          coldCount++;
        }
      }
    }
    // Sanity: every topic has at least one warm and one cold entry choice.
    expect(warmCount).toBeGreaterThanOrEqual(48);
    expect(coldCount).toBeGreaterThanOrEqual(48);
  });

  it("probing choices typically deepen", () => {
    let probingTotal = 0;
    let probingDeepens = 0;
    for (const t of allTopics()) {
      for (const c of t.choices) {
        if (c.tone === "probing") {
          probingTotal++;
          if (c.followups && c.followups.length > 0) probingDeepens++;
        }
      }
    }
    expect(probingTotal).toBeGreaterThan(0);
    expect(probingDeepens / probingTotal).toBeGreaterThanOrEqual(0.9);
  });
});

describe("flagToSet integration", () => {
  it("at least one topic per archetype sets a narrative flag", () => {
    for (const a of ARCHS) {
      const set = APPRENTICE_DIALOGUES[a];
      const topicsWithFlags = [set.past, set.calling, set.mortality, set.us]
        .filter((t) => {
          const visit = (cs: readonly DialogueChoice[]): boolean => {
            for (const c of cs) {
              if (c.flagToSet) return true;
              if (c.followups && visit(c.followups)) return true;
            }
            return false;
          };
          return visit(t.choices);
        });
      expect(topicsWithFlags.length).toBeGreaterThanOrEqual(1);
    }
  });
});
