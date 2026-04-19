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

  it("resolveVariant returns null when act gates miss", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "comms-relay",
      {
        moralityScore: 0,
        narrativeAct: 7, // no comms-relay variant for act 7
        trustByCompanion: {},
        flags: new Set(),
      },
    );
    expect(resolved).toBeNull();
  });

  it("resolveVariant returns null when targetId is unknown", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "room",
      "unknown-room",
      {
        moralityScore: 0,
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

  it("covers every surface with at least one entry", () => {
    const surfaces = new Set(VARIANT_REGISTRY.map((v) => v.surface));
    expect(surfaces.has("room")).toBe(true);
    expect(surfaces.has("transmission")).toBe(true);
    expect(surfaces.has("npc_line")).toBe(true);
    expect(surfaces.has("journal")).toBe(true);
    expect(surfaces.has("wheel_followup")).toBe(true);
  });

  it("covers all three morality bands at least once outside the 'any' bucket", () => {
    const moralities = new Set(VARIANT_REGISTRY.map((v) => v.morality));
    expect(moralities.has("machine")).toBe(true);
    expect(moralities.has("balanced")).toBe(true);
    expect(moralities.has("humanity")).toBe(true);
  });

  it("every requiredFlags entry references a non-empty flag id", () => {
    for (const v of VARIANT_REGISTRY) {
      if (!v.requiredFlags) continue;
      for (const flag of v.requiredFlags) {
        expect(
          flag.length,
          `${v.id} has an empty requiredFlags entry`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("registry has ≥ 20 entries — usable authoring coverage", () => {
    expect(VARIANT_REGISTRY.length).toBeGreaterThanOrEqual(20);
  });

  it("resolveVariant prefers the flag-gated entry over an unflagged sibling", () => {
    // Both act6_refused_secrecy and act6_intro_complete target
    // the_human_any, but the flag-gated ones have higher specificity.
    const withFlag = resolveVariant(
      VARIANT_REGISTRY,
      "npc_line",
      "the_human_any",
      {
        moralityScore: 0,
        narrativeAct: 6,
        trustByCompanion: { the_human: 85 },
        flags: new Set(["act6_intro_complete"]),
      },
    );
    expect(withFlag?.id).toBe("human_confidant_post_confession");
  });

  it("resolveVariant honours requiredFlags (no flag → no match)", () => {
    const resolved = resolveVariant(
      VARIANT_REGISTRY,
      "transmission",
      "kael_log_1",
      {
        moralityScore: 0,
        narrativeAct: 3,
        trustByCompanion: {},
        flags: new Set(), // missing kael_lore_discovered
      },
    );
    expect(resolved).toBeNull();
  });

  it("resolveVariant picks Light vs Dark Last Words echo by flag", () => {
    const light = resolveVariant(
      VARIANT_REGISTRY,
      "transmission",
      "last_words_echo",
      {
        moralityScore: 30,
        narrativeAct: 5,
        trustByCompanion: {},
        flags: new Set(["last_words_light_chosen"]),
      },
    );
    expect(light?.id).toBe("last_words_echo_light");

    const dark = resolveVariant(
      VARIANT_REGISTRY,
      "transmission",
      "last_words_echo",
      {
        moralityScore: -30,
        narrativeAct: 5,
        trustByCompanion: {},
        flags: new Set(["last_words_dark_chosen"]),
      },
    );
    expect(dark?.id).toBe("last_words_echo_dark");
  });
});
