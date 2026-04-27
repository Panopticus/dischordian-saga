/**
 * Cross-game recognition contract (#43).
 *
 * Two layers of coverage:
 *
 *   1. Behavioral tests on the pure helpers — the speaker filter
 *     produces the right subset; the flag predicate matches the
 *     server's `xgame_<beatId>` convention.
 *
 *   2. Cross-registry parity guard — every beatId referenced by a
 *     recognition must resolve to a real beat in
 *     CROSS_GAME_THREADS. A typo here silently disables the
 *     recognition (the flag never matches an authored beat); the
 *     test fails CI before that ships.
 */
import { describe, it, expect } from "vitest";
import {
  CROSS_GAME_RECOGNITIONS,
  getEligibleRecognitions,
  pickRecognitionFor,
  recognitionBeatIds,
  recognitionFlagFor,
} from "./crossGameRecognition";
import { getAllBeats } from "./crossGameNarrativeThreads";

describe("recognitionFlagFor — server contract parity", () => {
  it("uses the canonical xgame_<beatId> prefix", () => {
    expect(recognitionFlagFor("cades_fall_fall")).toBe("xgame_cades_fall_fall");
  });

  it("matches the server's flagFor convention exactly", () => {
    // The server's flagFor is in apps/server/routers/crossGameThreads.ts
    // and writes `xgame_${beatId}` to userProgress.narrativeFlags.
    // Mirror it here so the consumer reads the same key the producer
    // writes; a divergence would silently disable every recognition.
    expect(recognitionFlagFor("any_beat_id")).toMatch(/^xgame_/);
    expect(recognitionFlagFor("any_beat_id").slice(6)).toBe("any_beat_id");
  });
});

describe("CROSS_GAME_RECOGNITIONS — registry shape + parity", () => {
  it("ships at least one recognition (Phase 1 seed)", () => {
    expect(CROSS_GAME_RECOGNITIONS.length).toBeGreaterThan(0);
  });

  it("every recognition's beatId resolves to a real beat in CROSS_GAME_THREADS", () => {
    const allBeats = getAllBeats();
    const orphans: string[] = [];
    for (const rec of CROSS_GAME_RECOGNITIONS) {
      if (!allBeats[rec.beatId]) orphans.push(rec.beatId);
    }
    expect(
      orphans,
      `Recognitions reference unknown beats:\n  ${orphans.join("\n  ")}`,
    ).toEqual([]);
  });

  it("every phrase is non-empty and within the 140-char UI budget", () => {
    for (const rec of CROSS_GAME_RECOGNITIONS) {
      expect(rec.phrase.length, `${rec.beatId}/${rec.speaker}`).toBeGreaterThan(0);
      expect(rec.phrase.length, `${rec.beatId}/${rec.speaker} too long`).toBeLessThanOrEqual(140);
    }
  });

  it("every recognition's speaker is a known id", () => {
    const validSpeakers = new Set([
      "any",
      "elara",
      "antiquarian",
      "human",
      "architect",
      "kael",
      "ne_yon",
      "warlord",
    ]);
    for (const rec of CROSS_GAME_RECOGNITIONS) {
      expect(validSpeakers.has(rec.speaker), rec.speaker).toBe(true);
    }
  });

  it("every recognition's context (when set) is from the canonical set", () => {
    const validContexts = new Set(["greeting", "remembrance", "warning", "tease"]);
    for (const rec of CROSS_GAME_RECOGNITIONS) {
      if (rec.context) {
        expect(validContexts.has(rec.context), rec.context).toBe(true);
      }
    }
  });

  it("recognitionBeatIds() returns a deduped list of referenced beats", () => {
    const ids = recognitionBeatIds();
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getEligibleRecognitions — flag-driven filter", () => {
  it("returns [] when no relevant flags are set", () => {
    expect(getEligibleRecognitions({})).toEqual([]);
    expect(getEligibleRecognitions({ unrelated_flag: true })).toEqual([]);
  });

  it("returns recognitions whose xgame_<beatId> flag is true", () => {
    const flags = { xgame_cades_fall_fall: true };
    const eligible = getEligibleRecognitions(flags);
    expect(eligible.length).toBeGreaterThan(0);
    for (const r of eligible) {
      expect(r.beatId).toBe("cades_fall_fall");
    }
  });

  it("ignores flags that are explicitly false / undefined", () => {
    expect(getEligibleRecognitions({ xgame_cades_fall_fall: false })).toEqual([]);
    expect(getEligibleRecognitions({ xgame_cades_fall_fall: undefined })).toEqual([]);
  });

  it("scopes to a specific speaker (plus 'any' wildcards)", () => {
    const flags = { xgame_cades_fall_fall: true };
    const elaraOnly = getEligibleRecognitions(flags, "elara");
    for (const r of elaraOnly) {
      expect(["elara", "any"]).toContain(r.speaker);
    }
  });

  it("'any' speaker filter returns the full eligible set", () => {
    const flags = { xgame_cades_fall_fall: true };
    const all = getEligibleRecognitions(flags);
    const anyFiltered = getEligibleRecognitions(flags, "any");
    expect(anyFiltered.length).toBe(all.length);
  });
});

describe("pickRecognitionFor — first-eligible deterministic pick", () => {
  it("returns undefined when nothing is eligible", () => {
    expect(pickRecognitionFor({}, "elara")).toBeUndefined();
  });

  it("returns the first matching recognition in declaration order", () => {
    const flags = { xgame_cades_fall_fall: true };
    const first = pickRecognitionFor(flags, "human");
    expect(first).toBeDefined();
    expect(first!.beatId).toBe("cades_fall_fall");
    expect(first!.speaker).toBe("human");
  });

  it("two consecutive calls with the same flags + speaker return the same pick (deterministic)", () => {
    const flags = { xgame_cades_fall_fall: true };
    const a = pickRecognitionFor(flags, "elara");
    const b = pickRecognitionFor(flags, "elara");
    expect(a).toBe(b);
  });
});

describe("CrossGameRecognition component wiring (static-analysis)", () => {
  it("imports pickRecognitionFor (canonical helper) instead of duplicating", () => {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const src = fs.readFileSync(
      path.resolve(
        process.cwd(),
        "apps/client/src/components/CrossGameRecognition.tsx",
      ),
      "utf-8",
    );
    expect(src).toMatch(
      /import\s*\{[\s\S]*?pickRecognitionFor[\s\S]*?\}\s*from\s*["']@shared\/crossGameRecognition["']/,
    );
  });

  it("renders nothing when no recognition fires (consumer doesn't gate)", () => {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const src = fs.readFileSync(
      path.resolve(
        process.cwd(),
        "apps/client/src/components/CrossGameRecognition.tsx",
      ),
      "utf-8",
    );
    expect(src).toMatch(/if\s*\(!recognition\)\s*return null/);
  });

  it("carries a role + aria-label so screen readers pick it up", () => {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const src = fs.readFileSync(
      path.resolve(
        process.cwd(),
        "apps/client/src/components/CrossGameRecognition.tsx",
      ),
      "utf-8",
    );
    expect(src).toMatch(/role=["']note["']/);
    expect(src).toMatch(/aria-label=\{`\$\{speaker\} cross-game recognition/);
  });
});
