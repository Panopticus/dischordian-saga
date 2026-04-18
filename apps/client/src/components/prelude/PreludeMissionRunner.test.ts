import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { PRELUDE_CREW_MISSIONS } from "@shared/preludeCrewMissions";
import {
  advancePreludeStep,
  getPreludeCompletionFlags,
  startPreludeRun,
} from "@shared/preludeMissionRunner";

/* The pure engine is already covered by
   apps/shared/preludeMissionRunner.test.ts. These tests verify the
   React wrapper's wiring contract (GameContext flag-write + reward
   credit + mission completion). We test source structure rather
   than rendering to avoid a heavy provider setup. */

const SRC = fs.readFileSync(
  path.resolve(__dirname, "PreludeMissionRunner.tsx"),
  "utf-8",
);

describe("PreludeMissionRunner — GameContext wiring contract", () => {
  it("raises every completion flag via setNarrativeFlag", () => {
    expect(SRC).toContain("setNarrativeFlag(flag, true)");
    expect(SRC).toContain("getPreludeCompletionFlags(finalRun)");
  });

  it("credits every reward material via addMaterial(materialId, 1)", () => {
    expect(SRC).toContain(
      "for (const materialId of mission.rewards.materialIds)",
    );
    expect(SRC).toContain("addMaterial(materialId, 1)");
  });

  it("applies the crew bond delta via adjustNarratorBond", () => {
    expect(SRC).toContain("adjustNarratorBond(mission.rewards.bondDelta)");
  });

  it("only fires the completion side-effects once per run", () => {
    // Guard: `finished` ref-state blocks the second call in.
    expect(SRC).toContain("if (finished) return;");
    expect(SRC).toContain("setFinished(true)");
  });
});

describe("PreludeMissionRunner — burnt-card canonical payoff", () => {
  it("completing burnt_card raises prelude_complete + prelude_burnt_card_found", () => {
    let run = startPreludeRun("burnt_card");
    const mission = PRELUDE_CREW_MISSIONS.burnt_card;
    for (let i = 0; i < mission.steps.length; i++) {
      run = advancePreludeStep(run);
    }
    const flags = getPreludeCompletionFlags(run);
    expect(flags).toContain("prelude_complete");
    expect(flags).toContain("prelude_burnt_card_found");
    expect(flags).toContain("prelude_mission_burnt_card_complete");
  });
});
