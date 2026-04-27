// apps/shared/npcs/__tests__/adapters.test.ts
//
// Tests for the three trust adapters. Validates each adapter produces a
// canonical TrustState shape and maps trust values to the NPC's bibles-
// canonical bands.

import { describe, it, expect } from "vitest";
import { eidolonBondToTrustState } from "../adapters/eidolonBondAdapter";
import { lockeRelationshipToTrustState } from "../adapters/lockeRelationshipAdapter";
import {
  elaraStabilityToTrustState,
  humanLightToTrustState,
} from "../adapters/companionAdapter";

describe("eidolonBondAdapter", () => {
  it("maps bond=0 to Untuned band", () => {
    const state = eidolonBondToTrustState({ bond: 0 });
    expect(state.npcKey).toBe("your_eidolon");
    expect(state.trust).toBe(0);
    expect(state.band).toBe("Untuned");
  });

  it("maps bond=30 to Tuning band", () => {
    const state = eidolonBondToTrustState({ bond: 30 });
    expect(state.band).toBe("Tuning");
  });

  it("maps bond=60 to Resonant band", () => {
    const state = eidolonBondToTrustState({ bond: 60 });
    expect(state.band).toBe("Resonant");
  });

  it("maps bond=90 to Inseparable band", () => {
    const state = eidolonBondToTrustState({ bond: 90 });
    expect(state.band).toBe("Inseparable");
  });

  it("clamps negative bond to 0", () => {
    expect(eidolonBondToTrustState({ bond: -50 }).trust).toBe(0);
  });

  it("clamps bond > 100 to 100", () => {
    expect(eidolonBondToTrustState({ bond: 250 }).trust).toBe(100);
  });

  it("surfaces stage as flag", () => {
    const state = eidolonBondToTrustState({ bond: 30, stage: "companion" });
    expect(state.flags.has("eidolon_stage_companion")).toBe(true);
  });

  it("surfaces isResonant + isSoulBound as flags", () => {
    const state = eidolonBondToTrustState({
      bond: 50,
      isResonant: true,
      isSoulBound: true,
    });
    expect(state.flags.has("eidolon_resonant")).toBe(true);
    expect(state.flags.has("eidolon_soul_bound")).toBe(true);
  });

  it("converts updatedAt Date to lastInteractionAt epoch", () => {
    const date = new Date("2026-01-01T12:00:00Z");
    const state = eidolonBondToTrustState({ bond: 50, updatedAt: date });
    expect(state.lastInteractionAt).toBe(date.getTime());
  });
});

describe("lockeRelationshipAdapter", () => {
  it("maps trust=0 to Prospect band", () => {
    const state = lockeRelationshipToTrustState({ trust: 0 });
    expect(state.npcKey).toBe("adjudicator_locke");
    expect(state.band).toBe("Prospect");
  });

  it("maps trust=30 to Client band", () => {
    expect(lockeRelationshipToTrustState({ trust: 30 }).band).toBe("Client");
  });

  it("maps trust=50 to Partner band", () => {
    expect(lockeRelationshipToTrustState({ trust: 50 }).band).toBe("Partner");
  });

  it("maps trust=70 to Insider band", () => {
    expect(lockeRelationshipToTrustState({ trust: 70 }).band).toBe("Insider");
  });

  it("maps trust=85 to Adjudicated band (top)", () => {
    expect(lockeRelationshipToTrustState({ trust: 85 }).band).toBe("Adjudicated");
  });

  it("preserves caller-supplied flags", () => {
    const state = lockeRelationshipToTrustState({
      trust: 50,
      flags: ["trade_coin_unlocked", "exclusive_deal_signed"],
    });
    expect(state.flags.has("trade_coin_unlocked")).toBe(true);
    expect(state.flags.has("exclusive_deal_signed")).toBe(true);
  });

  it("does NOT set revealStage (Locke uses personalityArchetype, not reveal-stages)", () => {
    expect(lockeRelationshipToTrustState({ trust: 80 }).revealStage).toBeUndefined();
  });
});

describe("companionAdapter — Elara", () => {
  it("maps stability=-100 to fragmented band (lowest)", () => {
    const state = elaraStabilityToTrustState({ value: -100 });
    expect(state.npcKey).toBe("elara");
    expect(state.band).toBe("fragmented");
  });

  it("maps stability=0 to lucid band (mid)", () => {
    expect(elaraStabilityToTrustState({ value: 0 }).band).toBe("lucid");
  });

  it("maps stability=+50 to luminous band (top)", () => {
    expect(elaraStabilityToTrustState({ value: 50 }).band).toBe("luminous");
  });

  it("normalizes -100..+100 to 0..100 trust", () => {
    expect(elaraStabilityToTrustState({ value: -100 }).trust).toBe(0);
    expect(elaraStabilityToTrustState({ value: 0 }).trust).toBe(50);
    expect(elaraStabilityToTrustState({ value: 100 }).trust).toBe(100);
  });

  it("surfaces band as elara_stability_<band> flag", () => {
    const state = elaraStabilityToTrustState({ value: 50 });
    expect(state.flags.has("elara_stability_luminous")).toBe(true);
  });
});

describe("companionAdapter — Human", () => {
  it("maps light=-100 to fragmented band", () => {
    expect(humanLightToTrustState({ value: -100 }).band).toBe("fragmented");
  });

  it("maps light=+50 to luminous band", () => {
    expect(humanLightToTrustState({ value: 50 }).band).toBe("luminous");
  });

  it("surfaces back-compat human_band_<shadow|balanced|warm> flags", () => {
    expect(humanLightToTrustState({ value: -100 }).flags.has("human_band_shadow")).toBe(true);
    expect(humanLightToTrustState({ value: 0 }).flags.has("human_band_balanced")).toBe(true);
    expect(humanLightToTrustState({ value: 100 }).flags.has("human_band_warm")).toBe(true);
  });

  it("surfaces metric flag (human_light_<band>)", () => {
    expect(humanLightToTrustState({ value: 100 }).flags.has("human_light_luminous")).toBe(true);
  });
});
