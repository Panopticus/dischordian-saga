import { describe, expect, it } from "vitest";
import {
  BONUS_CHAPTER_INTRO_GATES,
  DEFERRED_BONUS_INTRO_IDS,
  bonusChapterIntroSeenFlag,
  pickBonusChapterIntroToFire,
} from "@shared/bonusChapterIntroTriggers";

describe("pickBonusChapterIntroToFire", () => {
  it("returns null when no gating flags are set", () => {
    expect(
      pickBonusChapterIntroToFire({ narrativeAct: 7, flags: {} }),
    ).toBeNull();
  });

  it("ch19_nilmorg_BONUS fires when trade_empire_arc_completed set + act >= 5", () => {
    const r = pickBonusChapterIntroToFire({
      narrativeAct: 5,
      flags: { trade_empire_arc_completed: true },
    });
    expect(r?.def.id).toBe("ch19_nilmorg_BONUS");
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
        flags: { trade_empire_arc_completed: true },
      }),
    ).toBeNull();
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 6, // shadow_tongue minAct is 7
        flags: {
          living_universe_event_shadow_tongue_edit_active: true,
        },
      }),
    ).toBeNull();
  });

  it("does not refire after the seen flag is set", () => {
    const flags = {
      trade_empire_arc_completed: true,
      [bonusChapterIntroSeenFlag("ch19_nilmorg_BONUS")]: true,
    };
    expect(
      pickBonusChapterIntroToFire({ narrativeAct: 5, flags }),
    ).toBeNull();
  });

  it("when multiple gates fire, returns the first in registry order", () => {
    const flags = {
      trade_empire_arc_completed: true,
      living_universe_event_shadow_tongue_edit_active: true,
    };
    const r = pickBonusChapterIntroToFire({ narrativeAct: 7, flags });
    expect(r?.def.id).toBe("ch19_nilmorg_BONUS");
  });

  it("non-true gating values do not count as set", () => {
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 7,
        flags: { trade_empire_arc_completed: false },
      }),
    ).toBeNull();
    expect(
      pickBonusChapterIntroToFire({
        narrativeAct: 7,
        flags: {
          trade_empire_arc_completed: 1 as unknown as boolean,
        },
      }),
    ).toBeNull();
  });

  it("seen flag follows the documented convention", () => {
    expect(bonusChapterIntroSeenFlag("ch19_nilmorg_BONUS")).toBe(
      "chapter_intro_ch19_nilmorg_BONUS_seen",
    );
  });

  it("ships 3 active BONUS gates (Nilmorg + Shadow-Tongue + Conexus)", () => {
    expect(BONUS_CHAPTER_INTRO_GATES).toHaveLength(3);
    const ids = BONUS_CHAPTER_INTRO_GATES.map((g) => g.introId).sort();
    expect(ids).toEqual([
      "ch19_nilmorg_BONUS",
      "ch20_conexus_BONUS",
      "ch21_shadow_tongue_BONUS",
    ]);
  });

  it("ch20_conexus_BONUS fires on Authority-aligned flag + act >= 7", () => {
    const r = pickBonusChapterIntroToFire({
      narrativeAct: 7,
      flags: { authority_alignment_aligned: true },
    });
    expect(r?.def.id).toBe("ch20_conexus_BONUS");
  });

  it("ch20_conexus_BONUS does not fire without the Authority-aligned flag", () => {
    // None of the older candidate flags is the producer; only the
    // canonical authority_alignment_aligned flag triggers the row.
    const flags = {
      hierarchy_dlc_arc_completed: true,
      light_dark_alignment: "light",
      act7_visible_war_won: true,
    } as Record<string, unknown>;
    const r = pickBonusChapterIntroToFire({ narrativeAct: 7, flags });
    expect(r?.def.id).not.toBe("ch20_conexus_BONUS");
  });

  it("registry contains no deferred intro ids (canon spine is now authoritative)", () => {
    const registered = new Set(
      BONUS_CHAPTER_INTRO_GATES.map((g) => g.introId),
    );
    for (const deferredId of DEFERRED_BONUS_INTRO_IDS) {
      expect(registered.has(deferredId)).toBe(false);
    }
  });
});
