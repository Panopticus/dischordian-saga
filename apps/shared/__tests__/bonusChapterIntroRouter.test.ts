import { describe, expect, it } from "vitest";
import {
  BONUS_CHAPTER_INTRO_GATES,
  bonusChapterIntroSeenFlag,
  pickBonusChapterIntroToFire,
} from "@shared/bonusChapterIntroTriggers";

describe("pickBonusChapterIntroToFire", () => {
  it("returns null when no gating flags are set", () => {
    expect(
      pickBonusChapterIntroToFire({ narrativeAct: 7, flags: {} }),
    ).toBeNull();
  });

  it("ch19_nilmorg_BONUS fires when prestige_corporate_tier set + act >= 5", () => {
    const r = pickBonusChapterIntroToFire({
      narrativeAct: 5,
      flags: { prestige_corporate_tier: true },
    });
    expect(r?.def.id).toBe("ch19_nilmorg_BONUS");
  });

  it("ch20_conexus_BONUS fires when authority_alignment_chosen + act >= 7", () => {
    const r = pickBonusChapterIntroToFire({
      narrativeAct: 7,
      flags: { authority_alignment_chosen: true },
    });
    expect(r?.def.id).toBe("ch20_conexus_BONUS");
  });

  it("ch21_shadow_tongue_BONUS fires on the canonical event-active flag + act >= 7", () => {
    const r = pickBonusChapterIntroToFire({
      narrativeAct: 7,
      flags: {
        living_universe_event_shadow_tongue_edit_active: true,
      },
    });
    expect(r?.def.id).toBe("ch21_shadow_tongue_BONUS");
  });

  it("does not fire below the gate's minAct", () => {
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 4, // nilmorg minAct is 5
        flags: { prestige_corporate_tier: true },
      }),
    ).toBeNull();
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 6, // conexus + shadow_tongue minAct is 7
        flags: { authority_alignment_chosen: true },
      }),
    ).toBeNull();
  });

  it("does not refire after the seen flag is set", () => {
    const flags = {
      prestige_corporate_tier: true,
      [bonusChapterIntroSeenFlag("ch19_nilmorg_BONUS")]: true,
    };
    expect(
      pickBonusChapterIntroToFire({ narrativeAct: 5, flags }),
    ).toBeNull();
  });

  it("when multiple gates fire, returns the first in registry order", () => {
    const flags = {
      prestige_corporate_tier: true,
      authority_alignment_chosen: true,
      living_universe_event_shadow_tongue_edit_active: true,
    };
    const r = pickBonusChapterIntroToFire({ narrativeAct: 7, flags });
    expect(r?.def.id).toBe("ch19_nilmorg_BONUS");
  });

  it("non-true gating values do not count as set", () => {
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 7,
        flags: { prestige_corporate_tier: false },
      }),
    ).toBeNull();
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 7,
        flags: {
          prestige_corporate_tier: 1 as unknown as boolean,
        },
      }),
    ).toBeNull();
  });

  it("seen flag follows the documented convention", () => {
    expect(bonusChapterIntroSeenFlag("ch19_nilmorg_BONUS")).toBe(
      "chapter_intro_ch19_nilmorg_BONUS_seen",
    );
  });

  it("ships exactly 3 BONUS gates (matches producer drop)", () => {
    expect(BONUS_CHAPTER_INTRO_GATES).toHaveLength(3);
    const ids = BONUS_CHAPTER_INTRO_GATES.map((g) => g.introId).sort();
    expect(ids).toEqual([
      "ch19_nilmorg_BONUS",
      "ch20_conexus_BONUS",
      "ch21_shadow_tongue_BONUS",
    ]);
  });
});
