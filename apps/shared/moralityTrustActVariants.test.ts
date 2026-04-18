import { describe, expect, it } from "vitest";
import {
  VARIANT_REGISTRY,
  bandForMorality,
  bandForTrust,
  resolveVariant,
} from "./moralityTrustActVariants";

describe("moralityTrustActVariants", () => {
  it("bands morality correctly at the boundaries", () => {
    expect(bandForMorality(-21)).toBe("machine");
    expect(bandForMorality(-20)).toBe("machine");
    expect(bandForMorality(-19)).toBe("balanced");
    expect(bandForMorality(0)).toBe("balanced");
    expect(bandForMorality(19)).toBe("balanced");
    expect(bandForMorality(20)).toBe("humanity");
    expect(bandForMorality(100)).toBe("humanity");
  });

  it("bands trust at the canonical thresholds", () => {
    expect(bandForTrust(0)).toBe("cold");
    expect(bandForTrust(24)).toBe("cold");
    expect(bandForTrust(25)).toBe("neutral");
    expect(bandForTrust(49)).toBe("neutral");
    expect(bandForTrust(50)).toBe("warm");
    expect(bandForTrust(79)).toBe("warm");
    expect(bandForTrust(80)).toBe("confidant");
    expect(bandForTrust(100)).toBe("confidant");
  });

  it("every variant id is unique", () => {
    const ids = VARIANT_REGISTRY.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every variant with a trust gate also specifies trustCompanionId", () => {
    for (const v of VARIANT_REGISTRY) {
      if (v.trust !== "any") {
        expect(v.trustCompanionId, `${v.id} has trust gate but no trustCompanionId`).toBeTruthy();
      }
    }
  });

  it("resolveVariant picks the humanity-banded comms-relay line", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "comms-relay",
      {
        moralityScore: 40,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      },
    );
    expect(resolved?.id).toBe("comms_array_first_entry_humanity");
  });

  it("resolveVariant picks the machine-banded comms-relay line", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "comms-relay",
      {
        moralityScore: -40,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      },
    );
    expect(resolved?.id).toBe("comms_array_first_entry_machine");
  });

  it("resolveVariant returns null when act or morality gates miss", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "comms-relay",
      {
        moralityScore: 0, // balanced — no comms-relay variant for balanced
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      },
    );
    expect(resolved).toBeNull();
  });

  it("resolveVariant gates on trust + companion correctly", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "npc_line",
      "the_human_any",
      {
        moralityScore: 0,
        narrativeAct: 3,
        trustByCompanion: { the_human: 85 },
        flags: new Set(),
      },
    );
    expect(resolved?.id).toBe("human_trust_confidant_act3");
  });

  it("resolveVariant rejects trust mismatch", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "npc_line",
      "the_human_any",
      {
        moralityScore: 0,
        narrativeAct: 3,
        trustByCompanion: { the_human: 40 },
        flags: new Set(),
      },
    );
    expect(resolved).toBeNull();
  });
});
