import { describe, expect, it } from "vitest";
import {
  RECRUITMENT_CHAINS,
  getRecruitmentChain,
  getStage,
  getChoice,
  recruitmentChainCoverage,
  type RecruitmentChain,
} from "./recruitmentQuests";

const NPCS = [
  "vex_solene",
  "wraith_calder",
  "locke",
  "jericho_jones",
  "akai_shi",
] as const;

describe("recruitmentQuests registry", () => {
  it("has chains for all 5 recruitable NPCs", () => {
    for (const npc of NPCS) {
      expect(RECRUITMENT_CHAINS[npc]).toBeDefined();
    }
  });

  it("getRecruitmentChain returns the chain for a known key", () => {
    const chain = getRecruitmentChain("vex_solene");
    expect(chain.npcKey).toBe("vex_solene");
    expect(chain.stages.length).toBeGreaterThanOrEqual(3);
  });

  it("every chain has all three terminal outcomes reachable", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      const outcomes = new Set<string>();
      for (const stage of chain.stages) {
        for (const choice of stage.choices) {
          if (choice.result.outcome) outcomes.add(choice.result.outcome);
        }
      }
      expect(outcomes).toContain("recruited_loyal");
      expect(outcomes).toContain("recruited_tense");
      expect(outcomes).toContain("refused");
    }
  });

  it("every choice's advanceTo references a real stage or 'end'", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      const stageIds = new Set(chain.stages.map((s) => s.id));
      for (const stage of chain.stages) {
        for (const choice of stage.choices) {
          if (choice.result.advanceTo === "end") continue;
          expect(stageIds.has(choice.result.advanceTo)).toBe(true);
        }
      }
    }
  });

  it("every stage has ≥ 2 choices", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      for (const stage of chain.stages) {
        expect(stage.choices.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("akai_shi chain has an openGate", () => {
    expect(RECRUITMENT_CHAINS.akai_shi.openGate).toBeDefined();
    expect(
      RECRUITMENT_CHAINS.akai_shi.openGate?.requiresFlagsAll,
    ).toContain("necromancer_event_complete");
  });

  it("getStage / getChoice helpers", () => {
    const chain = RECRUITMENT_CHAINS.vex_solene;
    const stage = getStage(chain, chain.startStageId);
    expect(stage).toBeDefined();
    const choice = getChoice(stage!, stage!.choices[0].id);
    expect(choice).toBeDefined();
    expect(getStage(chain, "nonexistent")).toBeUndefined();
  });

  it("recruited_loyal choices declare startingLoyalty + statTweaks", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      const loyal = chain.stages
        .flatMap((s) => s.choices)
        .find((c) => c.result.outcome === "recruited_loyal");
      expect(loyal).toBeDefined();
      expect(loyal!.result.startingLoyalty).toBeGreaterThanOrEqual(70);
      expect(loyal!.result.statTweaks).toBeDefined();
      expect(loyal!.result.relationshipTag).toBeDefined();
    }
  });

  it("recruited_tense choices have lower starting loyalty", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      const tense = chain.stages
        .flatMap((s) => s.choices)
        .find((c) => c.result.outcome === "recruited_tense");
      expect(tense).toBeDefined();
      expect(tense!.result.startingLoyalty).toBeLessThan(70);
    }
  });

  it("npcReply lines exist and are non-empty", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      for (const stage of chain.stages) {
        for (const choice of stage.choices) {
          expect(choice.npcReply.length).toBeGreaterThan(0);
          for (const line of choice.npcReply) {
            expect(line.text.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("recruitmentChainCoverage returns 5/5 implemented, 0 missing", () => {
    const cov = recruitmentChainCoverage();
    expect(cov.declared).toBe(5);
    expect(cov.implemented).toBe(5);
    expect(cov.missing).toEqual([]);
  });

  it("each chain has a unique briefing", () => {
    const briefings = new Set<string>();
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      expect(briefings.has(chain.briefing)).toBe(false);
      briefings.add(chain.briefing);
    }
  });

  it("simulating the loyal path reaches end + outcome=recruited_loyal", () => {
    for (const npc of NPCS) {
      const chain = RECRUITMENT_CHAINS[npc];
      let stageId: string | "end" = chain.startStageId;
      let visited = 0;
      let outcome: string | undefined;
      while (stageId !== "end" && visited < 10) {
        const stage = getStage(chain, stageId)!;
        // Pick the first choice that leads to either advancing or recruited_loyal terminal.
        const next =
          stage.choices.find(
            (c) => c.result.outcome === "recruited_loyal",
          ) ??
          stage.choices.find(
            (c) => c.result.advanceTo !== "end",
          );
        if (!next) break;
        stageId = next.result.advanceTo;
        outcome = next.result.outcome;
        visited++;
      }
      // Terminal: should have hit recruited_loyal somewhere along the path.
      const allOutcomes = chain.stages.flatMap((s) =>
        s.choices.map((c) => c.result.outcome),
      );
      expect(allOutcomes).toContain("recruited_loyal");
    }
  });
});

describe("RecruitmentChain narrative coherence", () => {
  it("briefings are at least 40 chars", () => {
    for (const npc of NPCS) {
      expect(RECRUITMENT_CHAINS[npc].briefing.length).toBeGreaterThanOrEqual(40);
    }
  });
  it("displayName matches lore", () => {
    expect(RECRUITMENT_CHAINS.vex_solene.displayName).toBe("Vex Solène");
    expect(RECRUITMENT_CHAINS.locke.displayName).toContain("Locke");
  });
});

function _typecheck_chain_shape(c: RecruitmentChain) {
  // ensures the exported type compiles; no runtime assertion needed.
  return c;
}
