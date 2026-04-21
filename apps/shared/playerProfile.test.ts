import { describe, it, expect } from "vitest";
import {
  PROFILE_AXES,
  emptyProfile,
  applyDelta,
  magnitudeOf,
  getProfileBlurb,
  buildPortraitSentences,
  type PlayerProfile,
} from "./playerProfile";
import { getStandardDelta } from "./playerProfileSources";

describe("playerProfile.applyDelta", () => {
  it("returns a neutral profile for emptyProfile()", () => {
    const p = emptyProfile();
    for (const axis of PROFILE_AXES) {
      expect(p[axis]).toBe(0);
    }
    expect(p.eventCount).toBe(0);
    expect(p.lastUpdatedAt).toBeNull();
  });

  it("clamps values to [-100, 100]", () => {
    const p = emptyProfile();
    const huge = applyDelta(p, { aggression: 250 });
    expect(huge.aggression).toBe(100);
    const tiny = applyDelta(p, { aggression: -250 });
    expect(tiny.aggression).toBe(-100);
  });

  it("does not overflow on repeated saturating writes", () => {
    let p = emptyProfile();
    for (let i = 0; i < 50; i++) {
      p = applyDelta(p, { mercy: 20 });
    }
    expect(p.mercy).toBe(100);
    expect(p.eventCount).toBe(50);
  });

  it("tolerates an empty delta (still increments eventCount)", () => {
    const p = applyDelta(emptyProfile(), {});
    expect(p.eventCount).toBe(1);
    for (const axis of PROFILE_AXES) {
      expect(p[axis]).toBe(0);
    }
  });

  it("does not mutate the input profile", () => {
    const original = emptyProfile();
    const next = applyDelta(original, { wit: 5 });
    expect(original.wit).toBe(0);
    expect(next.wit).toBe(5);
    expect(original).not.toBe(next);
  });

  it("ignores non-finite delta values", () => {
    const p = applyDelta(emptyProfile(), {
      aggression: Number.NaN,
      mercy: Number.POSITIVE_INFINITY,
      wit: 3,
    });
    expect(p.aggression).toBe(0);
    expect(p.mercy).toBe(0);
    expect(p.wit).toBe(3);
  });
});

describe("playerProfile.magnitudeOf", () => {
  it("buckets values into the seven labels", () => {
    expect(magnitudeOf(-100)).toBe("strong_negative");
    expect(magnitudeOf(-67)).toBe("strong_negative");
    expect(magnitudeOf(-66)).toBe("moderate_negative");
    expect(magnitudeOf(-34)).toBe("moderate_negative");
    expect(magnitudeOf(-33)).toBe("mild_negative");
    expect(magnitudeOf(-11)).toBe("mild_negative");
    expect(magnitudeOf(-10)).toBe("neutral");
    expect(magnitudeOf(0)).toBe("neutral");
    expect(magnitudeOf(10)).toBe("neutral");
    expect(magnitudeOf(11)).toBe("mild_positive");
    expect(magnitudeOf(33)).toBe("mild_positive");
    expect(magnitudeOf(34)).toBe("moderate_positive");
    expect(magnitudeOf(66)).toBe("moderate_positive");
    expect(magnitudeOf(67)).toBe("strong_positive");
    expect(magnitudeOf(100)).toBe("strong_positive");
  });
});

describe("playerProfile.getProfileBlurb", () => {
  it("returns deterministic strings keyed by axis × magnitude", () => {
    const p: PlayerProfile = { ...emptyProfile(), aggression: 75 };
    expect(getProfileBlurb("aggression", p)).toBe("fiercely predator");

    const q: PlayerProfile = { ...emptyProfile(), aggression: -75 };
    expect(getProfileBlurb("aggression", q)).toBe("fiercely pacifist");

    const r: PlayerProfile = { ...emptyProfile(), mercy: 0 };
    expect(getProfileBlurb("mercy", r)).toBe("even-handed");
  });

  it("covers every axis × magnitude with a non-empty string", () => {
    for (const axis of PROFILE_AXES) {
      for (const value of [-100, -50, -20, 0, 20, 50, 100]) {
        const p: PlayerProfile = { ...emptyProfile(), [axis]: value };
        const blurb = getProfileBlurb(axis, p);
        expect(blurb).toBeTruthy();
        expect(typeof blurb).toBe("string");
      }
    }
  });
});

describe("playerProfile.buildPortraitSentences", () => {
  it("returns one sentence per axis, in fixed order", () => {
    const p = emptyProfile();
    const sentences = buildPortraitSentences(p);
    expect(sentences).toHaveLength(PROFILE_AXES.length);
    sentences.forEach((s) => expect(s.endsWith(".")).toBe(true));
  });
});

describe("playerProfileSources.getStandardDelta", () => {
  it("returns the canonical delta for a known archetype", () => {
    const d = getStandardDelta("chess_mind_game_choice:mocking");
    expect(d).not.toBeNull();
    expect(d?.wit).toBeGreaterThan(0);
    expect(d?.mercy).toBeLessThan(0);
  });

  it("returns null for an unknown source", () => {
    expect(getStandardDelta("totally_made_up_source")).toBeNull();
  });

  it("treats sparse choice tables (empty deltas) as valid no-ops", () => {
    const d = getStandardDelta("card_dialog_choice");
    // It's registered; the delta is just empty.
    expect(d).not.toBeNull();
    const p = applyDelta(emptyProfile(), d ?? {});
    expect(p.eventCount).toBe(1);
    for (const axis of PROFILE_AXES) {
      expect(p[axis]).toBe(0);
    }
  });

  it("resigning a winning game is a strong mercy signal", () => {
    const d = getStandardDelta("chess_resign:winning");
    expect(d?.mercy).toBeGreaterThanOrEqual(5);
  });

  it("declining a draw is the inverse of accepting one", () => {
    const declined = getStandardDelta("chess_draw_offer_declined");
    const accepted = getStandardDelta("chess_draw_offer_accepted");
    expect(declined?.mercy ?? 0).toBeLessThan(accepted?.mercy ?? 0);
  });
});
