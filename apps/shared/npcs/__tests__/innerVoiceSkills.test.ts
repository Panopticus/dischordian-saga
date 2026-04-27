// apps/shared/npcs/__tests__/innerVoiceSkills.test.ts
//
// Validates the 7 inner-voice skill personifications (Phase 4
// Disco-Elysium-style extension).

import { describe, it, expect } from "vitest";
import {
  INNER_VOICE_PROFILES,
  activeInnerVoices,
  pickInnerVoice,
  renderInnerVoiceLine,
} from "../../innerVoiceSkills";
import type { AxisMagnitude, PlayerAxis } from "../types";

function neutralAxes(): Record<PlayerAxis, AxisMagnitude> {
  return {
    aggression: "neutral",
    mercy: "neutral",
    curiosity: "neutral",
    conformity: "neutral",
    vigilance: "neutral",
    vulnerability: "neutral",
    wit: "neutral",
  };
}

describe("INNER_VOICE_PROFILES", () => {
  it("ships exactly 7 voices (one per player-axis)", () => {
    expect(Object.keys(INNER_VOICE_PROFILES).length).toBe(7);
  });

  it("every voice has at least one active magnitude", () => {
    for (const profile of Object.values(INNER_VOICE_PROFILES)) {
      expect(profile.activeMagnitudes.length, profile.axis).toBeGreaterThan(0);
    }
  });

  it("no voice activates at neutral magnitude (silence is canonical)", () => {
    for (const profile of Object.values(INNER_VOICE_PROFILES)) {
      expect(
        profile.activeMagnitudes,
        `${profile.axis} should not activate at neutral`,
      ).not.toContain("neutral" as AxisMagnitude);
    }
  });

  it("no voice activates at any negative magnitude (low-magnitude axes are canonically silent)", () => {
    for (const profile of Object.values(INNER_VOICE_PROFILES)) {
      const negs: AxisMagnitude[] = ["strong_negative", "moderate_negative", "mild_negative"];
      for (const m of negs) {
        expect(profile.activeMagnitudes, `${profile.axis} should not activate at ${m}`).not.toContain(m);
      }
    }
  });
});

describe("activeInnerVoices", () => {
  it("returns empty for all-neutral player", () => {
    expect(activeInnerVoices({ axes: neutralAxes() })).toEqual([]);
  });

  it("returns Curiosity for high-curiosity player", () => {
    const axes = neutralAxes();
    axes.curiosity = "strong_positive";
    const active = activeInnerVoices({ axes });
    expect(active.find(p => p.axis === "curiosity")).toBeDefined();
    expect(active.find(p => p.axis === "mercy")).toBeUndefined();
  });

  it("returns multiple voices for multi-high-axis player", () => {
    const axes = neutralAxes();
    axes.curiosity = "strong_positive";
    axes.mercy = "moderate_positive";
    axes.vigilance = "mild_positive";
    const active = activeInnerVoices({ axes });
    expect(active.length).toBe(3);
  });

  it("respects recentlySpoken cooldown", () => {
    const axes = neutralAxes();
    axes.curiosity = "strong_positive";
    axes.mercy = "moderate_positive";
    const active = activeInnerVoices({
      axes,
      recentlySpoken: new Set(["curiosity"]),
    });
    expect(active.find(p => p.axis === "curiosity")).toBeUndefined();
    expect(active.find(p => p.axis === "mercy")).toBeDefined();
  });

  it("Mercy requires moderate+ (mild_positive does NOT activate)", () => {
    const axes = neutralAxes();
    axes.mercy = "mild_positive";
    expect(activeInnerVoices({ axes }).find(p => p.axis === "mercy")).toBeUndefined();
    axes.mercy = "moderate_positive";
    expect(activeInnerVoices({ axes }).find(p => p.axis === "mercy")).toBeDefined();
  });
});

describe("pickInnerVoice", () => {
  it("returns null when no voices active", () => {
    expect(pickInnerVoice({ axes: neutralAxes() })).toBeNull();
  });

  it("picks higher-magnitude voice over lower", () => {
    const axes = neutralAxes();
    axes.curiosity = "mild_positive";
    axes.mercy = "strong_positive";
    const pick = pickInnerVoice({ axes });
    expect(pick?.axis).toBe("mercy");
  });

  it("breaks ties by canonical declaration order (curiosity wins over mercy at equal magnitude)", () => {
    const axes = neutralAxes();
    axes.curiosity = "strong_positive";
    axes.mercy = "strong_positive";
    const pick = pickInnerVoice({ axes });
    // Curiosity is declared first in INNER_VOICE_PROFILES
    expect(pick?.axis).toBe("curiosity");
  });
});

describe("renderInnerVoiceLine", () => {
  it("renders the canonical Disco-Elysium-style format", () => {
    const profile = INNER_VOICE_PROFILES.curiosity;
    const out = renderInnerVoiceLine(profile, "something here is older than the contract");
    expect(out).toBe("Curiosity (whispering): something here is older than the contract");
  });

  it("renders Mercy with insisting cadence", () => {
    const profile = INNER_VOICE_PROFILES.mercy;
    const out = renderInnerVoiceLine(profile, "don't make her sign");
    expect(out).toBe("Mercy (insisting): don't make her sign");
  });
});
