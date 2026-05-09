import { describe, expect, it } from "vitest";
import {
  VARIANT_REGISTRY,
  bandForMorality,
  bandForTrust,
  humanCorruptionForTrust,
  isWithinTimeWindow,
  resolveVariant,
  type MoralityTrustActVariant,
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

  /* ─── audit/16 PR 4 (Cluster D) — variant resolver extensions ─── */

  describe("isWithinTimeWindow", () => {
    const t = new Date("2026-05-09T12:00:00Z");

    it("passes when window is undefined", () => {
      expect(isWithinTimeWindow(undefined, t)).toBe(true);
    });

    it("passes when both bounds are unset", () => {
      expect(isWithinTimeWindow({}, t)).toBe(true);
    });

    it("passes when `now` is undefined (caller doesn't care about windowing)", () => {
      expect(isWithinTimeWindow({ startsAt: "2026-05-01T00:00:00Z", endsAt: "2026-05-31T00:00:00Z" }, undefined)).toBe(true);
    });

    it("respects startsAt (inclusive)", () => {
      const window = { startsAt: "2026-05-09T12:00:00Z" };
      expect(isWithinTimeWindow(window, new Date("2026-05-09T11:59:59Z"))).toBe(false);
      expect(isWithinTimeWindow(window, new Date("2026-05-09T12:00:00Z"))).toBe(true);
      expect(isWithinTimeWindow(window, new Date("2026-05-09T12:00:01Z"))).toBe(true);
    });

    it("respects endsAt (exclusive)", () => {
      const window = { endsAt: "2026-05-09T12:00:00Z" };
      expect(isWithinTimeWindow(window, new Date("2026-05-09T11:59:59Z"))).toBe(true);
      expect(isWithinTimeWindow(window, new Date("2026-05-09T12:00:00Z"))).toBe(false);
      expect(isWithinTimeWindow(window, new Date("2026-05-09T12:00:01Z"))).toBe(false);
    });

    it("respects both bounds", () => {
      const window = { startsAt: "2026-05-01T00:00:00Z", endsAt: "2026-05-31T00:00:00Z" };
      expect(isWithinTimeWindow(window, new Date("2026-04-30T23:59:59Z"))).toBe(false);
      expect(isWithinTimeWindow(window, new Date("2026-05-15T12:00:00Z"))).toBe(true);
      expect(isWithinTimeWindow(window, new Date("2026-05-31T00:00:00Z"))).toBe(false);
    });

    it("ignores unparseable bounds (defensive — invalid ISO falls through)", () => {
      // If a bad ISO string slips into a registry, we don't want to
      // reject every variant — we want to log loudly elsewhere and
      // keep the variant eligible. The helper treats NaN as "no bound".
      expect(isWithinTimeWindow({ startsAt: "not-a-date" }, t)).toBe(true);
      expect(isWithinTimeWindow({ endsAt: "still-not-a-date" }, t)).toBe(true);
    });
  });

  describe("resolveVariant — timeWindow gating", () => {
    const baseRegistry: MoralityTrustActVariant[] = [
      {
        id: "test_default",
        surface: "room",
        targetId: "test_room",
        text: "default line",
        morality: "any",
        trust: "any",
        act: "any",
      },
      {
        id: "test_arg_drop",
        surface: "room",
        targetId: "test_room",
        text: "calendar drop line",
        morality: "any",
        trust: "any",
        act: "any",
        timeWindow: {
          startsAt: "2026-05-09T00:00:00Z",
          endsAt: "2026-05-10T00:00:00Z",
        },
      },
    ];

    it("ARG drop wins over default during its window", () => {
      const resolved = resolveVariant(baseRegistry, "room", "test_room", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
        now: new Date("2026-05-09T12:00:00Z"),
      });
      expect(resolved?.id).toBe("test_arg_drop");
    });

    it("falls back to default when outside the window", () => {
      const resolved = resolveVariant(baseRegistry, "room", "test_room", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
        now: new Date("2026-06-01T12:00:00Z"),
      });
      expect(resolved?.id).toBe("test_default");
    });

    it("ARG drop is eligible when caller omits `now` (back-compat)", () => {
      // Existing callers don't pass `now`; we must not silently
      // disable their variants. Since both default + arg_drop match
      // when `now` is omitted, the higher-specificity arg_drop wins.
      const resolved = resolveVariant(baseRegistry, "room", "test_room", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      });
      expect(resolved?.id).toBe("test_arg_drop");
    });
  });

  describe("portraitCinematicId + relatedClues — additive payloads", () => {
    it("variants resolve normally when portraitCinematicId is set", () => {
      const registry: MoralityTrustActVariant[] = [
        {
          id: "test_with_cinematic",
          surface: "wheel_followup",
          targetId: "wheel_x",
          text: "line with cinematic",
          morality: "any",
          trust: "any",
          act: "any",
          portraitCinematicId: "cinematic_wheel_x_reaction",
        },
      ];
      const resolved = resolveVariant(registry, "wheel_followup", "wheel_x", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      });
      expect(resolved?.portraitCinematicId).toBe("cinematic_wheel_x_reaction");
    });

    it("variants resolve normally when relatedClues is set", () => {
      const registry: MoralityTrustActVariant[] = [
        {
          id: "test_with_clues",
          surface: "journal",
          targetId: "clue_y",
          text: "line with clues",
          morality: "any",
          trust: "any",
          act: "any",
          relatedClues: ["clue_a", "clue_b"],
        },
      ];
      const resolved = resolveVariant(registry, "journal", "clue_y", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      });
      expect(resolved?.relatedClues).toEqual(["clue_a", "clue_b"]);
    });
  });

  describe("specificity scoring — Cluster D fields", () => {
    it("a time-windowed variant outscores an unbounded one with same gates", () => {
      // Direct exercise of the resolver's tie-break behaviour: when
      // morality/trust/act are identical, the time-windowed one wins.
      const registry: MoralityTrustActVariant[] = [
        {
          id: "tied_default",
          surface: "room",
          targetId: "tied",
          text: "default",
          morality: "any",
          trust: "any",
          act: "any",
        },
        {
          id: "tied_with_window",
          surface: "room",
          targetId: "tied",
          text: "with window",
          morality: "any",
          trust: "any",
          act: "any",
          timeWindow: { startsAt: "2026-01-01T00:00:00Z" },
        },
      ];
      const resolved = resolveVariant(registry, "room", "tied", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
        now: new Date("2026-05-09T12:00:00Z"),
      });
      expect(resolved?.id).toBe("tied_with_window");
    });
  });

  /* ─── audit/16 PR 7 — Cinematic small batch ─── */

  describe("humanCorruptionForTrust (C9)", () => {
    it("monotonically decreases as trust rises", () => {
      const cold = humanCorruptionForTrust(10);
      const neutral = humanCorruptionForTrust(30);
      const warm = humanCorruptionForTrust(60);
      const confidant = humanCorruptionForTrust(85);
      expect(cold).toBeGreaterThan(neutral);
      expect(neutral).toBeGreaterThan(warm);
      expect(warm).toBeGreaterThan(confidant);
    });
    it("returns canonical band values", () => {
      expect(humanCorruptionForTrust(0)).toBe(60);
      expect(humanCorruptionForTrust(24)).toBe(60);
      expect(humanCorruptionForTrust(25)).toBe(40);
      expect(humanCorruptionForTrust(50)).toBe(25);
      expect(humanCorruptionForTrust(80)).toBe(10);
      expect(humanCorruptionForTrust(100)).toBe(10);
    });
    it("matches bandForTrust thresholds at boundaries", () => {
      // Sanity — corruption thresholds align with trust band thresholds.
      expect(bandForTrust(25)).toBe("neutral");
      expect(humanCorruptionForTrust(25)).toBe(40);
      expect(bandForTrust(50)).toBe("warm");
      expect(humanCorruptionForTrust(50)).toBe(25);
    });
  });

  describe("voLineIds + slideshow_vo_override surface (C5)", () => {
    it("variant with voLineIds resolves on the new surface", () => {
      const registry: MoralityTrustActVariant[] = [
        {
          id: "test_silence_machine",
          surface: "slideshow_vo_override",
          targetId: "silence-of-two-witnesses",
          text: "(machine variant — cold-bird parenthetical)",
          morality: "machine",
          trust: "any",
          act: 2,
          voLineIds: ["silence-elara-machine", "silence-human-machine"],
        },
      ];
      const resolved = resolveVariant(
        registry,
        "slideshow_vo_override",
        "silence-of-two-witnesses",
        {
          moralityScore: -40,
          narrativeAct: 2,
          trustByCompanion: {},
          flags: new Set(),
        },
      );
      expect(resolved?.voLineIds).toEqual([
        "silence-elara-machine",
        "silence-human-machine",
      ]);
    });

    it("returns null when no variant matches (caller falls back to baseline)", () => {
      const resolved = resolveVariant(
        VARIANT_REGISTRY,
        "slideshow_vo_override",
        "silence-of-two-witnesses",
        {
          moralityScore: 0,
          narrativeAct: 2,
          trustByCompanion: {},
          flags: new Set(),
        },
      );
      // No production seed exists yet; caller's hardcoded
      // ["silence-elara", "silence-human"] fallback path runs.
      expect(resolved).toBeNull();
    });
  });

  describe("portraitNpcId / portraitExpression (C3)", () => {
    it("survives resolution as additive payload", () => {
      const registry: MoralityTrustActVariant[] = [
        {
          id: "test_with_portrait",
          surface: "transmission",
          targetId: "test_target",
          text: "transmission with portrait anchor",
          morality: "any",
          trust: "any",
          act: "any",
          portraitNpcId: "elara",
          portraitExpression: "stern",
        },
      ];
      const resolved = resolveVariant(registry, "transmission", "test_target", {
        moralityScore: 0,
        narrativeAct: 1,
        trustByCompanion: {},
        flags: new Set(),
      });
      expect(resolved?.portraitNpcId).toBe("elara");
      expect(resolved?.portraitExpression).toBe("stern");
    });
  });
});

/* ─── audit/16 PR 22 (cinematic schema batch) ─── */

describe("HumanRevealStage trustThresholdCinematic (audit/16 PR 22 C2)", () => {
  it("every reveal stage has a trustThresholdCinematic populated", async () => {
    const mod = await import("@/game/npcPortraits");
    const stages = mod.HUMAN_REVEAL_STAGES;
    for (const stage of stages) {
      expect(stage.trustThresholdCinematic, `${stage.id} missing cinematic`).toBeTruthy();
    }
  });

  it("cinematic ids follow the convention cinematic_human_reveal_<stage-id>", async () => {
    const mod = await import("@/game/npcPortraits");
    for (const stage of mod.HUMAN_REVEAL_STAGES) {
      expect(stage.trustThresholdCinematic).toBe(`cinematic_human_reveal_${stage.id}`);
    }
  });
});
