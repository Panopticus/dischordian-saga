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

  it("resolveVariant returns null when no registered act matches", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "comms-relay",
      {
        moralityScore: 0,
        narrativeAct: 99, // no variants gated on act 99
        trustByCompanion: {},
        flags: new Set(),
      },
    );
    expect(resolved).toBeNull();
  });

  it("resolveVariant picks the balanced-banded comms-relay line", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "comms-relay",
      {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      },
    );
    expect(resolved?.morality).toBe("balanced");
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

  it("resolveVariant picks the neutral-banded human line when trust is 40", () => {
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
    // Expansion added trust-band variants for every band at Act 3.
    expect(resolved?.id).toBe("human_trust_neutral_act3");
  });

  it("resolveVariant returns null for an unregistered target id", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "npc_line",
      "does_not_exist_any",
      {
        moralityScore: 0,
        narrativeAct: 3,
        trustByCompanion: { the_human: 40 },
        flags: new Set(),
      },
    );
    expect(resolved).toBeNull();
  });

  it("covers every act from 1 through 7 with at least one registry entry", () => {
    for (const act of [1, 2, 3, 4, 5, 6, 7]) {
      const matches = VARIANT_REGISTRY.filter((v) => v.act === act);
      expect(matches.length, `act ${act} has no variants`).toBeGreaterThan(0);
    }
  });

  it("covers every surface type with at least one entry", () => {
    const surfaces = new Set(VARIANT_REGISTRY.map((v) => v.surface));
    expect(surfaces.has("room")).toBe(true);
    expect(surfaces.has("transmission")).toBe(true);
    expect(surfaces.has("npc_line")).toBe(true);
    expect(surfaces.has("journal")).toBe(true);
    expect(surfaces.has("wheel_followup")).toBe(true);
  });

  it("rejects stub markers in authored variant text", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i, /\blorem ipsum\b/i];
    for (const v of VARIANT_REGISTRY) {
      for (const pattern of stubs) {
        expect(
          pattern.test(v.text),
          `${v.id} contains stub marker ${pattern}`
        ).toBe(false);
      }
      expect(v.text.trim().length, `${v.id} empty text`).toBeGreaterThan(0);
    }
  });
});
