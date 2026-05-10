import { describe, expect, it } from "vitest";
import {
  deriveCampaignObjectives,
  type CampaignObjectiveInput,
} from "./campaignObjectives";

const baseInput = (
  overrides: Partial<CampaignObjectiveInput> = {},
): CampaignObjectiveInput => ({
  narrativeAct: 0,
  narrativeFlags: {},
  recruitmentMissionsCompleted: 0,
  preludeComplete: false,
  ...overrides,
});

describe("deriveCampaignObjectives", () => {
  it("Prelude in progress → 'Wake up the Ark.'", () => {
    const objs = deriveCampaignObjectives(baseInput());
    expect(objs).toHaveLength(1);
    expect(objs[0].id).toBe("prelude_in_progress");
  });

  it("Prelude complete → 'The Tribunal awaits.'", () => {
    const objs = deriveCampaignObjectives(
      baseInput({ preludeComplete: true }),
    );
    expect(objs[0].id).toBe("prelude_to_act_1");
  });

  it("Act 1 in progress → tribunal objective with 12-battle hint", () => {
    const objs = deriveCampaignObjectives(baseInput({ narrativeAct: 1 }));
    expect(objs[0].id).toBe("act_1_tribunal");
    expect(objs[0].label).toMatch(/12 battles/);
  });

  it("Act 1 complete → no objectives at narrativeAct 1", () => {
    const objs = deriveCampaignObjectives(
      baseInput({
        narrativeAct: 1,
        narrativeFlags: { act_1_complete: true },
      }),
    );
    expect(objs).toEqual([]);
  });

  it("Act 4 with no prisoner chapter cleared → 'Pick one prisoner chapter'", () => {
    const objs = deriveCampaignObjectives(baseInput({ narrativeAct: 4 }));
    expect(objs[0].label).toMatch(/Pick one prisoner chapter/);
  });

  it("Act 4 with one chapter cleared → 'Close out the Revelation cycle'", () => {
    const objs = deriveCampaignObjectives(
      baseInput({
        narrativeAct: 4,
        narrativeFlags: { act4_prisoner_cell_complete: true },
      }),
    );
    expect(objs[0].label).toMatch(/Close out the Revelation cycle/);
  });

  it("Act 5 below recruitment gate → 'Recruit N more' with correct math", () => {
    const objs = deriveCampaignObjectives(
      baseInput({ narrativeAct: 5, recruitmentMissionsCompleted: 2 }),
    );
    const recruit = objs.find((o) => o.id === "act_5_recruitment");
    expect(recruit?.label).toMatch(/Recruit 3 more/); // gate is 5
  });

  it("Act 5 with M7 incomplete and recruit met → only M7 objective", () => {
    const objs = deriveCampaignObjectives(
      baseInput({ narrativeAct: 5, recruitmentMissionsCompleted: 5 }),
    );
    expect(objs.map((o) => o.id)).toEqual(["act_5_cades_m7"]);
  });

  it("Act 7 with recruitment gate met but act_7_complete false → Convergence Seat", () => {
    const objs = deriveCampaignObjectives(
      baseInput({ narrativeAct: 7, recruitmentMissionsCompleted: 8 }),
    );
    expect(objs[0].id).toBe("act_7_convergence_seat");
  });

  it("Act 7 with recruitment gate UNMET → 'Recruit N more'", () => {
    const objs = deriveCampaignObjectives(
      baseInput({ narrativeAct: 7, recruitmentMissionsCompleted: 6 }),
    );
    expect(objs[0].id).toBe("act_7_final_recruitment");
    expect(objs[0].label).toMatch(/Recruit 2 more/); // gate is 8
  });

  it("Post-prestige (act_7_complete) returns no objectives", () => {
    const objs = deriveCampaignObjectives(
      baseInput({
        narrativeAct: 7,
        recruitmentMissionsCompleted: 8,
        narrativeFlags: { act_7_complete: true },
      }),
    );
    expect(objs).toEqual([]);
  });

  it("every objective has a non-empty diegeticHint pointing at the in-fiction surface", () => {
    for (let act = 0; act <= 7; act++) {
      const objs = deriveCampaignObjectives(baseInput({ narrativeAct: act }));
      for (const obj of objs) {
        expect(obj.diegeticHint.trim().length).toBeGreaterThan(20);
      }
    }
  });
});
