import { describe, it, expect } from "vitest";
import type { CampaignObjectiveInput } from "./campaignObjectives";
import {
  deriveObjectives,
  deriveSpineWingObjectives,
} from "./spineObjectives";
import { NARRATIVE_SPINE } from "./narrativeSpine";

const base = (
  o: Partial<CampaignObjectiveInput> = {},
): CampaignObjectiveInput => ({
  narrativeAct: 0,
  narrativeFlags: {},
  recruitmentMissionsCompleted: 0,
  preludeComplete: false,
  ...o,
});

describe("deriveSpineWingObjectives", () => {
  it("only surfaces wings whose act has been reached", () => {
    const early = deriveSpineWingObjectives(base({ narrativeAct: 1 }));
    const ids = early.map((o) => o.id);
    // loredex (act 0) + chess & mystery (act 1) are open by Act 1.
    expect(ids).toContain("spine_wing_loredex");
    expect(ids).toContain("spine_wing_chess");
    // trade_empire opens at act 3 — not yet.
    expect(ids).not.toContain("spine_wing_trade_empire");
  });

  it("never surfaces trunk beats as wings", () => {
    const all = deriveSpineWingObjectives(base({ narrativeAct: 7 }));
    const ids = all.map((o) => o.id);
    expect(ids).not.toContain("spine_wing_tcg_dischordia");
    expect(ids).not.toContain("spine_wing_cades_fps");
  });

  it("every wing has a carrier-voiced diegeticHint and a label", () => {
    for (const o of deriveSpineWingObjectives(base({ narrativeAct: 7 }))) {
      expect(o.diegeticHint.trim().length).toBeGreaterThan(20);
      expect(o.label.trim().length).toBeGreaterThan(0);
      expect(o.diegeticHint).toMatch(/: /); // "<Carrier>: <reveal>"
    }
  });

  it("covers every wing premise exactly once by end of Act 7", () => {
    const wingPremises = NARRATIVE_SPINE.filter(
      (b) => b.spineRole === "wing",
    ).map((b) => b.revealsPremiseId);
    const ids = deriveSpineWingObjectives(base({ narrativeAct: 7 })).map(
      (o) => o.id,
    );
    for (const p of wingPremises) {
      expect(ids).toContain(`spine_wing_${p}`);
    }
    expect(new Set(ids).size).toBe(ids.length); // no dupes
  });
});

describe("deriveObjectives (composed)", () => {
  it("keeps the mandatory trunk objective primary mid-campaign", () => {
    const objs = deriveObjectives(base({ narrativeAct: 1 }));
    expect(objs[0].id).toBe("act_1_tribunal");
  });

  it("fills the post-Act-7 blank instead of going empty", () => {
    const objs = deriveObjectives(
      base({
        narrativeAct: 7,
        recruitmentMissionsCompleted: 8,
        narrativeFlags: { act_7_complete: true },
      }),
    );
    expect(objs.length).toBeGreaterThan(0);
    expect(objs[0].id).toBe("endgame_continuing_loop");
    expect(objs[0].diegeticHint.trim().length).toBeGreaterThan(20);
  });

  it("emits no duplicate objective ids", () => {
    const objs = deriveObjectives(base({ narrativeAct: 5 }));
    const ids = objs.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
