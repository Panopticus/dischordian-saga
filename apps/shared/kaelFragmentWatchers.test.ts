import { describe, it, expect } from "vitest";
import {
  pendingKaelFragmentUnlocks,
  isKaelQuestlineComplete,
} from "./kaelFragmentWatchers";
import { KAEL_FRAGMENTS } from "./appendixBKaelQuestline";

describe("kaelFragmentWatchers", () => {
  describe("pendingKaelFragmentUnlocks", () => {
    it("returns no unlocks when nothing has happened", () => {
      const out = pendingKaelFragmentUnlocks({}, {});
      expect(out).toEqual([]);
    });

    it("unlocks F1 when terminus wave 10 first complete flag is set", () => {
      const out = pendingKaelFragmentUnlocks(
        { terminus_swarm_wave_10_first_complete: true },
        {},
      );
      expect(out).toContain("f1");
    });

    it("does NOT re-unlock F1 once its flag is already raised", () => {
      const out = pendingKaelFragmentUnlocks(
        {
          terminus_swarm_wave_10_first_complete: true,
          kael_fragment_f1_unlocked: true,
        },
        {},
      );
      expect(out).not.toContain("f1");
    });

    it("unlocks F2 only when Elara dismissed AND 30+ idle minutes", () => {
      expect(
        pendingKaelFragmentUnlocks(
          { elara_dismissed: true },
          { commsIdleMinutesWhileHumanActive: 29 },
        ),
      ).not.toContain("f2");
      expect(
        pendingKaelFragmentUnlocks(
          { elara_dismissed: true },
          { commsIdleMinutesWhileHumanActive: 30 },
        ),
      ).toContain("f2");
      expect(
        pendingKaelFragmentUnlocks(
          {},
          { commsIdleMinutesWhileHumanActive: 45 },
        ),
      ).not.toContain("f2");
    });

    it("unlocks F3 only after 6 panopticon_ruins missions", () => {
      expect(
        pendingKaelFragmentUnlocks({}, { panopticonRuinsMissionCount: 5 }),
      ).not.toContain("f3");
      expect(
        pendingKaelFragmentUnlocks({}, { panopticonRuinsMissionCount: 6 }),
      ).toContain("f3");
    });

    it("unlocks F4 when Substrate cleared with The Human active", () => {
      expect(
        pendingKaelFragmentUnlocks(
          { substrate_dungeon_cleared_human_active: true },
          {},
        ),
      ).toContain("f4");
    });

    it("unlocks F5 only when all three F5 conditions hold", () => {
      expect(
        pendingKaelFragmentUnlocks(
          { apprentice_betrayal_triggered: true },
          { celebrationTrialDay: 20, highestApprenticeBond: 40 },
        ),
      ).toContain("f5");
      expect(
        pendingKaelFragmentUnlocks(
          { apprentice_betrayal_triggered: true },
          { celebrationTrialDay: 19, highestApprenticeBond: 40 },
        ),
      ).not.toContain("f5");
      expect(
        pendingKaelFragmentUnlocks(
          { apprentice_betrayal_triggered: true },
          { celebrationTrialDay: 20, highestApprenticeBond: 39 },
        ),
      ).not.toContain("f5");
      expect(
        pendingKaelFragmentUnlocks(
          {},
          { celebrationTrialDay: 28, highestApprenticeBond: 99 },
        ),
      ).not.toContain("f5");
    });

    it("unlocks F6 when Act 1 Cycle B complete AND light reading", () => {
      expect(
        pendingKaelFragmentUnlocks(
          {
            act_1_cycle_b_complete: true,
            dischordia_cycle_light_reading: true,
          },
          {},
        ),
      ).toContain("f6");
    });

    it("can unlock several fragments at once", () => {
      const out = pendingKaelFragmentUnlocks(
        {
          terminus_swarm_wave_10_first_complete: true,
          substrate_dungeon_cleared_human_active: true,
        },
        {},
      );
      expect(out).toContain("f1");
      expect(out).toContain("f4");
    });
  });

  describe("isKaelQuestlineComplete", () => {
    it("false when nothing unlocked", () => {
      expect(isKaelQuestlineComplete({})).toBe(false);
    });

    it("false when only 5 of 6 fragments unlocked", () => {
      const flags: Record<string, boolean> = {};
      for (const f of KAEL_FRAGMENTS.slice(0, 5)) flags[f.flag] = true;
      expect(isKaelQuestlineComplete(flags)).toBe(false);
    });

    it("true when all 6 fragments unlocked", () => {
      const flags: Record<string, boolean> = {};
      for (const f of KAEL_FRAGMENTS) flags[f.flag] = true;
      expect(isKaelQuestlineComplete(flags)).toBe(true);
    });
  });
});
