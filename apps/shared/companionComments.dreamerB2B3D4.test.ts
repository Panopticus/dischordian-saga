/**
 * D4 + B2 + B3 (dual-faction recruitment plan) — tests for the
 * Phase-2 reveal companion-comment surfaces:
 *
 *   D4: Elara hint lines for the covert-relay role, fired on
 *       dreamer-awareness threshold crossings + per-vision
 *       deliveries.
 *   B2: Authority Trial verdict callback — Human's calibration-
 *       acknowledgment register on overturn / sentence_passed.
 *   B3: Witnessing-milestone Architect-only reaction — the
 *       Architect speaker plus a `witnessing_milestone_{id}`
 *       trigger format.
 */
import { describe, it, expect } from "vitest";
import {
  COMPANION_COMMENTS,
  type CompanionComment,
} from "./companionComments";

function find(trigger: string): CompanionComment | undefined {
  return COMPANION_COMMENTS.find((c) => c.trigger === trigger);
}

describe("Speaker enum supports the Architect (B3)", () => {
  it("at least one comment has speaker === 'architect'", () => {
    const architectLines = COMPANION_COMMENTS.filter(
      (c) => c.speaker === "architect",
    );
    expect(architectLines.length).toBeGreaterThan(0);
  });

  it("all four canonical speakers appear in the catalog", () => {
    const speakers = new Set(COMPANION_COMMENTS.map((c) => c.speaker));
    expect(speakers.has("elara")).toBe(true);
    expect(speakers.has("human")).toBe(true);
    expect(speakers.has("antiquarian")).toBe(true);
    expect(speakers.has("architect")).toBe(true);
  });
});

describe("D4 — Elara dreamer-relay hint lines", () => {
  for (const trigger of [
    "dreamer_relay_threshold_3",
    "dreamer_relay_after_vision_1",
    "dreamer_relay_after_vision_2",
    "dreamer_relay_after_vision_3",
  ]) {
    it(`registers a line for trigger '${trigger}'`, () => {
      const line = find(trigger);
      expect(line).toBeDefined();
      expect(line!.speaker).toBe("elara");
    });
  }

  it("dreamer-relay hints are conservative — never name the relay (no 'Dreamer' / 'Oracle' / 'relay')", () => {
    const dreamerHints = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("dreamer_relay_"),
    );
    for (const line of dreamerHints) {
      expect(line.voiceLine).not.toMatch(/\bDreamer\b/);
      expect(line.voiceLine).not.toMatch(/\bOracle\b/);
      expect(line.voiceLine).not.toMatch(/\brelay\b/i);
    }
  });

  it("dreamer-relay hints fire at most once per player (rare → maxPlays: 1)", () => {
    const dreamerHints = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("dreamer_relay_"),
    );
    for (const line of dreamerHints) {
      expect(line.maxPlays).toBe(1);
    }
  });
});

describe("B2 — Authority Trial verdict callback", () => {
  for (const outcome of ["overturn", "sentence_passed"]) {
    const trigger = `authority_trial_verdict_${outcome}`;
    it(`registers a Human-side line for trigger '${trigger}'`, () => {
      const line = find(trigger);
      expect(line).toBeDefined();
      expect(line!.speaker).toBe("human");
    });
  }

  it("verdict lines fire calibration-acknowledgment register (uses 'file' / 'forwarded' / 'baseline' lexicon)", () => {
    const verdictLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("authority_trial_verdict_"),
    );
    for (const line of verdictLines) {
      // Each line should mention at least one calibration-register
      // marker. The Architect's information-war framing.
      const lowered = line.voiceLine.toLowerCase();
      const hasMarker =
        lowered.includes("file") ||
        lowered.includes("forward") ||
        lowered.includes("baseline") ||
        lowered.includes("calibrat");
      expect(hasMarker).toBe(true);
    }
  });
});

describe("B3 — Witnessing-milestone Architect-only reaction", () => {
  it("registers Architect lines for at least one canonical milestone", () => {
    const milestoneLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("witnessing_milestone_"),
    );
    expect(milestoneLines.length).toBeGreaterThan(0);
  });

  it("every witnessing-milestone trigger uses the Architect speaker (none of the other three)", () => {
    const milestoneLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("witnessing_milestone_"),
    );
    for (const line of milestoneLines) {
      expect(line.speaker).toBe("architect");
    }
  });

  it("Architect lines fire 'immediate' timing (the witnessing toast appears at the same moment)", () => {
    const milestoneLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("witnessing_milestone_"),
    );
    for (const line of milestoneLines) {
      expect(line.timing).toBe("immediate");
    }
  });

  it("Architect lines fire at most once per milestone (calibration is logged once)", () => {
    const milestoneLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("witnessing_milestone_"),
    );
    for (const line of milestoneLines) {
      expect(line.maxPlays).toBe(1);
    }
  });

  it("Architect lines never use Elara/Human/Antiquarian register markers (no 'I love', no 'forgive', etc)", () => {
    const milestoneLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("witnessing_milestone_"),
    );
    for (const line of milestoneLines) {
      // Architect canon: never warm. This isn't an exhaustive lint —
      // just enough to catch a register-drift refactor that
      // accidentally pastes a companion line under the architect
      // speaker.
      const lowered = line.voiceLine.toLowerCase();
      expect(lowered).not.toContain("forgive");
      expect(lowered).not.toContain("i love");
      expect(lowered).not.toContain("don't be afraid");
    }
  });
});

describe("CompanionComment id uniqueness — overall catalog", () => {
  it("every comment has a unique id (no dedupe collisions)", () => {
    const ids = COMPANION_COMMENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
