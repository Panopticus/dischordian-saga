/* Tests for Phase K Wave 4 additions:
   - New encounter-kind transitions (apprentice_declared,
     final_encounter, accumulation_reveal, lieutenant_promoted,
     cohort_ended, name_revealed)
   - Whisper overlay on declaration
   - Inherited Nemesis-passage extraction */
import { describe, expect, it } from "vitest";
import {
  spawnNemesis,
  applyEncounterTransition,
  type NemesisDef,
} from "./nemesisSystem";
import {
  overlayWhisperOnDeclaration,
  generateBetrayalEvent,
  type BetrayalEvent,
} from "./apprenticeBetrayal";
import { getInheritedNemesisPassage, formatInheritancePassageForMorningBriefing } from "./apprenticeMemoryInheritance";

const T0 = "2026-05-13T00:00:00.000Z";

function fixture(overrides?: Partial<NemesisDef>): NemesisDef {
  return {
    ...spawnNemesis({
      userId: 100,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    }),
    ...(overrides ?? {}),
  };
}

describe("Wave 4 encounter-kind transitions", () => {
  it("accumulation_reveal is chronicle-only (no rank/grudge change)", () => {
    const n = fixture({ rank: 3, grudgeTier: 2 });
    const next = applyEncounterTransition(n, "accumulation_reveal");
    expect(next.rank).toBe(3);
    expect(next.grudgeTier).toBe(2);
  });

  it("lieutenant_promoted is chronicle-only", () => {
    const n = fixture({ rank: 4, grudgeTier: 1 });
    const next = applyEncounterTransition(n, "lieutenant_promoted");
    expect(next.rank).toBe(4);
    expect(next.grudgeTier).toBe(1);
  });

  it("cohort_ended is chronicle-only", () => {
    const n = fixture({ rank: 2, grudgeTier: 3 });
    const next = applyEncounterTransition(n, "cohort_ended");
    expect(next).toEqual(n);
  });

  it("name_revealed is chronicle-only", () => {
    const n = fixture({ rank: 5, grudgeTier: 4 });
    const next = applyEncounterTransition(n, "name_revealed");
    expect(next).toEqual(n);
  });

  it("apprentice_declared_betrayal_to_nemesis bumps grudge by 2 (cap 5)", () => {
    const n = fixture({ rank: 3, grudgeTier: 1 });
    const next = applyEncounterTransition(n, "apprentice_declared_betrayal_to_nemesis");
    expect(next.grudgeTier).toBe(3);
    expect(next.rank).toBe(3);
  });

  it("apprentice_declared clamps grudge at 5", () => {
    const n = fixture({ rank: 3, grudgeTier: 4 });
    const next = applyEncounterTransition(n, "apprentice_declared_betrayal_to_nemesis");
    expect(next.grudgeTier).toBe(5);
  });

  it("final_encounter_act7 clamps grudge at 5 (the climax)", () => {
    const n = fixture({ rank: 6, grudgeTier: 2 });
    const next = applyEncounterTransition(n, "final_encounter_act7");
    expect(next.grudgeTier).toBe(5);
    expect(next.rank).toBe(6); // rank unchanged
  });
});

describe("overlayWhisperOnDeclaration (K-W4-5)", () => {
  function makeDeclarationEvent(): BetrayalEvent {
    return {
      stage: "declaration",
      threshold: 90,
      prompt: "Generic declaration prompt.",
      options: [
        {
          id: "existing",
          label: "Existing option",
          outcome: {
            corruptionDelta: 0,
            bondDelta: 0,
            moralityDelta: 0,
            resultFlavor: "ok",
          },
        },
      ],
    };
  }

  it("appends Nemesis-aware framing to the declaration prompt", () => {
    const event = makeDeclarationEvent();
    const overlaid = overlayWhisperOnDeclaration(event, "Heretic");
    expect(overlaid.prompt).toContain("Heretic-Nemesis");
    expect(overlaid.prompt).toContain("spoke to them last night");
  });

  it("adds pull_from_whisper and release_to_whisper options", () => {
    const event = makeDeclarationEvent();
    const overlaid = overlayWhisperOnDeclaration(event, "Witch");
    const ids = overlaid.options.map((o) => o.id);
    expect(ids).toContain("pull_from_whisper");
    expect(ids).toContain("release_to_whisper");
    expect(ids).toContain("existing"); // existing options preserved
  });

  it("pull_from_whisper has positive bond delta and halts betrayal", () => {
    const event = makeDeclarationEvent();
    const overlaid = overlayWhisperOnDeclaration(event, "Oracle");
    const pull = overlaid.options.find((o) => o.id === "pull_from_whisper")!;
    expect(pull.outcome.bondDelta).toBeGreaterThan(0);
    expect(pull.outcome.forceStage).toBe("halted");
  });

  it("release_to_whisper forces betrayal stage", () => {
    const event = makeDeclarationEvent();
    const overlaid = overlayWhisperOnDeclaration(event, "Heretic");
    const release = overlaid.options.find((o) => o.id === "release_to_whisper")!;
    expect(release.outcome.forceStage).toBe("betrayal");
    expect(release.outcome.bondDelta).toBeLessThan(0);
  });

  it("is a no-op for non-declaration stages", () => {
    const warning: BetrayalEvent = {
      stage: "warning",
      threshold: 30,
      prompt: "Warning prompt.",
      options: [],
    };
    const result = overlayWhisperOnDeclaration(warning, "Ghost");
    expect(result).toBe(warning);
  });
});

describe("getInheritedNemesisPassage (K-W4-4)", () => {
  it("returns a non-empty passage for a known (ghost, heretic, high) pair", () => {
    const result = getInheritedNemesisPassage("ghost", "heretic", "high");
    expect(result.passage.length).toBeGreaterThan(20);
    expect(result.flagsToSet).toContain("inherited_nemesis_passage_from_ghost");
    expect(result.flagsToSet).toContain("inherited_nemesis_passage_about_heretic");
    expect(result.flagsToSet).toContain("inherited_nemesis_passage_at_high_corruption");
  });

  it("adds the named-by-dead-apprentice flag at high corruption", () => {
    const result = getInheritedNemesisPassage("scholar", "jester", "high");
    expect(result.flagsToSet).toContain("inherited_nemesis_named_by_dead_apprentice");
  });

  it("does NOT add the named-by-dead flag at low/mid corruption", () => {
    const low = getInheritedNemesisPassage("scholar", "jester", "low");
    expect(low.flagsToSet).not.toContain("inherited_nemesis_named_by_dead_apprentice");
    const mid = getInheritedNemesisPassage("scholar", "jester", "mid");
    expect(mid.flagsToSet).not.toContain("inherited_nemesis_named_by_dead_apprentice");
  });

  it("formatInheritancePassageForMorningBriefing wraps the passage with chronicle framing", () => {
    const passage = "I am still here. The chronicle marks the ink.";
    const formatted = formatInheritancePassageForMorningBriefing(passage, "Adra Vyn");
    expect(formatted).toContain("Adra Vyn");
    expect(formatted).toContain(passage);
    expect(formatted).toContain("chronicle");
  });

  it("formatInheritancePassageForMorningBriefing returns empty string on empty passage", () => {
    expect(formatInheritancePassageForMorningBriefing("", "Whoever")).toBe("");
  });
});
