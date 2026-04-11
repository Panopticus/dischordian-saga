import { describe, it, expect } from "vitest";
import {
  APPRENTICE_STAND_TOWER,
  getKaelFragment,
  getKaelTowerInscription,
  getKaelTowerMemorial,
  getPendingKaelPayoffCinematic,
  KAEL_FRAGMENTS,
  KAEL_PAYOFF_CINEMATICS,
  KAEL_RIPPLE_EVENT_TYPES,
  KAEL_TOWER_MEMORIALS,
  listKaelFragments,
  listKaelPayoffCinematics,
  listKaelTowerMemorials,
  YEAR_ONE_RIPPLES,
} from "./appendixBKaelQuestline";

describe("Appendix B Kael questline — §B.3 Six Fragments", () => {
  it("has exactly 6 fragments", () => {
    expect(KAEL_FRAGMENTS.length).toBe(6);
  });

  it("fragments are ordered 1-6 contiguously", () => {
    const orders = [...KAEL_FRAGMENTS].map((f) => f.order).sort();
    expect(orders).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("every fragment has a unique flag", () => {
    const flags = KAEL_FRAGMENTS.map((f) => f.flag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("F1 is the mirror seen at Wave 10", () => {
    const f1 = getKaelFragment("f1");
    expect(f1?.rippleEvent).toBe("kael_mirror_seen");
    expect(f1?.unlockSystem).toBe("terminus_swarm_wave_10");
  });

  it("F6 unlocks the Recruiter's real name and emits kael_name_spoken", () => {
    const f6 = getKaelFragment("f6");
    expect(f6?.rippleEvent).toBe("kael_name_spoken");
    expect(f6?.whatPlayerLearns.toLowerCase()).toContain("name");
  });

  it("listKaelFragments returns all 6", () => {
    expect(listKaelFragments().length).toBe(6);
  });
});

describe("Appendix B Kael questline — §B.4 Tower Memorials", () => {
  it("has at least 9 tower memorials", () => {
    expect(KAEL_TOWER_MEMORIALS.length).toBeGreaterThanOrEqual(9);
  });

  it("every memorial has a non-empty inscription", () => {
    for (const m of KAEL_TOWER_MEMORIALS) {
      expect(m.inscription.length).toBeGreaterThan(0);
    }
  });

  it("healing_pylon memorializes Kael's wife and has a single-flower inscription", () => {
    const pylon = KAEL_TOWER_MEMORIALS.find((m) => m.towerKey === "healing_pylon");
    expect(pylon).toBeDefined();
    expect(pylon!.memorialTo.toLowerCase()).toContain("wife");
    expect(pylon!.inscription.toLowerCase()).toContain("flower");
  });

  it("artillery_cannon memorializes the Iron Lion", () => {
    const cannon = KAEL_TOWER_MEMORIALS.find(
      (m) => m.towerKey === "artillery_cannon",
    );
    expect(cannon?.memorialTo).toBe("Iron Lion");
  });

  it("Apprentice Stand tower is sacrificial and once-per-account", () => {
    expect(APPRENTICE_STAND_TOWER.sacrificial).toBe(true);
    expect(APPRENTICE_STAND_TOWER.oncePerAccountEver).toBe(true);
  });

  it("listKaelTowerMemorials returns the full list", () => {
    expect(listKaelTowerMemorials().length).toBe(KAEL_TOWER_MEMORIALS.length);
  });
});

describe("Appendix B Kael questline — §B.5 Ripple Event Types", () => {
  it("has exactly 6 new ripple event types", () => {
    expect(KAEL_RIPPLE_EVENT_TYPES.length).toBe(6);
  });

  it("includes kael_questline_complete", () => {
    expect(KAEL_RIPPLE_EVENT_TYPES).toContain("kael_questline_complete");
  });

  it("every ripple type is distinct", () => {
    expect(new Set(KAEL_RIPPLE_EVENT_TYPES).size).toBe(
      KAEL_RIPPLE_EVENT_TYPES.length,
    );
  });
});

describe("Appendix B Kael questline — §B.8 Payoff Cinematics", () => {
  it("has exactly 3 payoff cinematics (bd1, bd2, bd3)", () => {
    expect(KAEL_PAYOFF_CINEMATICS.length).toBe(3);
    const ids = KAEL_PAYOFF_CINEMATICS.map((c) => c.id).sort();
    expect(ids).toEqual(["bd1", "bd2", "bd3"]);
  });

  it("bd3 is The Man Who Came Back and fires at questline complete", () => {
    const bd3 = KAEL_PAYOFF_CINEMATICS.find((c) => c.id === "bd3");
    expect(bd3?.title).toContain("Came Back");
    expect(bd3?.purpose.toLowerCase()).toContain("questline_complete");
  });

  it("listKaelPayoffCinematics returns all 3", () => {
    expect(listKaelPayoffCinematics().length).toBe(3);
  });
});

describe("Appendix B Kael questline — §B.6 Year One Ripples", () => {
  it("has one calendar beat per fragment", () => {
    expect(YEAR_ONE_RIPPLES.length).toBe(6);
    const ids = [...YEAR_ONE_RIPPLES].map((r) => r.fragmentId).sort();
    expect(ids).toEqual(["f1", "f2", "f3", "f4", "f5", "f6"]);
  });

  it("f6's calendar beat mentions redaction by Lyra Vox", () => {
    const f6 = YEAR_ONE_RIPPLES.find((r) => r.fragmentId === "f6");
    expect(f6?.calendarBeat).toContain("Lyra Vox");
  });
});

describe("Appendix B Kael questline — runtime helpers", () => {
  it("getKaelTowerInscription returns null before F2", () => {
    expect(getKaelTowerInscription("artillery_cannon", {})).toBeNull();
  });

  it("getKaelTowerInscription returns the inscription after F2", () => {
    const out = getKaelTowerInscription("artillery_cannon", {
      kael_fragment_f2_unlocked: true,
    });
    expect(out).toContain("fire where he fell");
  });

  it("getKaelTowerInscription returns null for unknown tower keys even after F2", () => {
    expect(
      getKaelTowerInscription("made_up_tower", { kael_fragment_f2_unlocked: true }),
    ).toBeNull();
  });

  it("getKaelTowerMemorial works without flag gating", () => {
    expect(getKaelTowerMemorial("tesla_coil")?.memorialTo).toContain("Engineer");
    expect(getKaelTowerMemorial("made_up_tower")).toBeUndefined();
  });

  it("getPendingKaelPayoffCinematic returns null by default", () => {
    expect(getPendingKaelPayoffCinematic({})).toBeNull();
  });

  it("bd1 fires only when F6 + both narrators have spoken Kael's name", () => {
    expect(
      getPendingKaelPayoffCinematic({ kael_fragment_f6_unlocked: true }),
    ).toBeNull();
    expect(
      getPendingKaelPayoffCinematic({
        kael_fragment_f6_unlocked: true,
        kael_name_spoken_by_elara: true,
      }),
    ).toBeNull();
    expect(
      getPendingKaelPayoffCinematic({
        kael_fragment_f6_unlocked: true,
        kael_name_spoken_by_elara: true,
        kael_name_spoken_by_human: true,
      })?.id,
    ).toBe("bd1");
  });

  it("bd2 fires when apprentices_stand_built is set", () => {
    expect(
      getPendingKaelPayoffCinematic({ apprentices_stand_built: true })?.id,
    ).toBe("bd2");
  });

  it("bd3 fires at kael_questline_complete", () => {
    expect(
      getPendingKaelPayoffCinematic({ kael_questline_complete: true })?.id,
    ).toBe("bd3");
  });

  it("does not re-fire a cinematic that already has its flag raised", () => {
    expect(
      getPendingKaelPayoffCinematic({
        kael_questline_complete: true,
        kael_cinematic_came_back_seen: true,
      }),
    ).toBeNull();
  });
});
