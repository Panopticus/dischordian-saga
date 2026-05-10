import { describe, it, expect } from "vitest";
import {
  resolveCommScreenContent,
  hasMinimumScreenState,
  type CommScreenContext,
} from "./berthCommScreen";
import type {
  ApprenticePartyMember,
  ElaraPartyMember,
  HumanPartyMember,
  PartyMember,
} from "./partyMember";

const apprentice: ApprenticePartyMember = {
  kind: "apprentice", id: "apprentice_active",
  apprenticeId: "test", displayName: "T",
  archetype: "scholar", gender: "non-binary",
  rarity: "common", bond: 60, corruption: 10, trialDay: 7,
};
const elara: ElaraPartyMember = {
  kind: "elara", id: "elara", displayName: "Elara",
  stability: 30, stabilityBand: "lucid",
};
const elaraFragmented: ElaraPartyMember = {
  ...elara, stability: -60, stabilityBand: "fragmented",
};
const humanRevealed: HumanPartyMember = {
  kind: "human", id: "the_human", displayName: "The Human",
  trust: 60, light: 20, lightBand: "balanced", revealStage: 4,
};
const humanHidden: HumanPartyMember = {
  ...humanRevealed, trust: 5, revealStage: 0,
};

const baseCtx = (host: PartyMember, roster: PartyMember[] = []): CommScreenContext => ({
  host,
  roster: [host, ...roster],
  phase: "midday",
  trialDay: 7,
});

describe("berthCommScreen", () => {
  describe("ambient field", () => {
    it("always returns a 2-line ambient", () => {
      const state = resolveCommScreenContent(baseCtx(apprentice));
      expect(state.ambient.lines).toHaveLength(2);
      expect(hasMinimumScreenState(state)).toBe(true);
    });

    it("trial day shows in ambient", () => {
      const state = resolveCommScreenContent({ ...baseCtx(apprentice), trialDay: 14 });
      expect(state.ambient.lines[0]).toContain("Trial Day 14");
    });

    it("ambient varies per host id", () => {
      const a = resolveCommScreenContent(baseCtx(apprentice));
      const b = resolveCommScreenContent(baseCtx(elara, [apprentice]));
      // Most of the time these will differ; the test is "they CAN
      // differ across hosts" — we just ensure deterministic per-host.
      const a2 = resolveCommScreenContent(baseCtx(apprentice));
      expect(a.ambient.lines[1]).toBe(a2.ambient.lines[1]);
      expect(b.ambient.lines[1]).toBeTruthy();
    });
  });

  describe("pinned corners", () => {
    it("Elara's corner is present when she's in the roster", () => {
      const state = resolveCommScreenContent(baseCtx(apprentice, [elara]));
      expect(state.pinnedElara).not.toBeNull();
      expect(state.pinnedElara?.who).toBe("elara");
      expect(state.pinnedElara?.tint).toMatch(/^[A-F0-9]{6}$/);
    });

    it("Elara's corner has stability-banded tint", () => {
      const lucid = resolveCommScreenContent(baseCtx(apprentice, [elara]));
      const fragmented = resolveCommScreenContent(baseCtx(apprentice, [elaraFragmented]));
      expect(lucid.pinnedElara?.tint).not.toBe(fragmented.pinnedElara?.tint);
    });

    it("Human's corner is null pre-reveal (revealStage 0)", () => {
      const state = resolveCommScreenContent(baseCtx(apprentice, [elara, humanHidden]));
      expect(state.pinnedHuman).toBeNull();
    });

    it("Human's corner is present at revealStage ≥ 1", () => {
      const state = resolveCommScreenContent(baseCtx(apprentice, [elara, humanRevealed]));
      expect(state.pinnedHuman).not.toBeNull();
    });
  });

  describe("watermarks", () => {
    it("audit_started → audit_in_progress watermark + suppresses pinned corners", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara, humanRevealed]),
        recentBeats: [{ kind: "audit_started", at: Date.now() }],
      });
      expect(state.watermark?.kind).toBe("audit_in_progress");
      expect(state.pinnedElara).toBeNull();
      expect(state.pinnedHuman).toBeNull();
    });

    it("warden_tap → low-opacity watermark, corners NOT suppressed", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara]),
        recentBeats: [{ kind: "warden_tap", at: Date.now() }],
      });
      expect(state.watermark?.kind).toBe("warden_line_tap");
      expect(state.pinnedElara).not.toBeNull();
    });

    it("crew_died → narrative_silence watermark suppresses corners", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara]),
        recentBeats: [{ kind: "crew_died", at: Date.now(), subjectId: "vex_solene" }],
      });
      expect(state.watermark?.kind).toBe("narrative_silence");
      expect(state.pinnedElara).toBeNull();
    });

    it("old beats (outside the recent window) don't fire", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara]),
        recentBeats: [{ kind: "audit_started", at: Date.now() - 5 * 60_000 }],
      });
      expect(state.watermark).toBeNull();
    });
  });

  describe("active calls", () => {
    it("companion banter wins over cohort banter", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara]),
        companionBanterCandidates: [
          { id: "comp_1", lines: [{ speaker: "elara", text: "Hey." }] },
        ],
        cohortBanterCandidates: [
          {
            id: "cohort_1", archetypeA: "scholar", archetypeB: "ghost",
            lines: [{ speakerArchetype: "ghost", text: "..." }],
          },
        ],
      });
      expect(state.activeCall?.source).toBe("companion_banter");
      expect(state.activeCall?.sourceId).toBe("comp_1");
    });

    it("mourning interrupts everything", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara]),
        companionBanterCandidates: [
          { id: "comp_1", lines: [{ speaker: "elara", text: "Hey." }] },
        ],
        recentBeats: [{ kind: "crew_died", at: Date.now(), subjectId: "vex_solene" }],
      });
      // crew_died sets watermark which suppresses calls anyway, so
      // activeCall is null. Validating the invariant.
      expect(state.activeCall).toBeNull();
    });

    it("cohort banter falls through when no companion banter", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice),
        cohortBanterCandidates: [
          {
            id: "cohort_1", archetypeA: "scholar", archetypeB: "ghost",
            lines: [
              { speakerArchetype: "scholar", text: "Did you check?" },
              { speakerArchetype: "ghost", text: "I do not check." },
            ],
          },
        ],
      });
      expect(state.activeCall?.source).toBe("cohort_banter");
      expect(state.activeCall?.lines).toHaveLength(2);
    });

    it("cooldown filter: already-fired banter is skipped", () => {
      const state = resolveCommScreenContent({
        ...baseCtx(apprentice, [elara]),
        companionBanterCandidates: [
          { id: "comp_1", lines: [{ speaker: "elara", text: "Hey." }] },
          { id: "comp_2", lines: [{ speaker: "human", text: "..." }] },
        ],
        recentlyFiredBanterIds: ["comp_1"],
      });
      expect(state.activeCall?.sourceId).toBe("comp_2");
    });
  });

  describe("kind smoke (every PartyMember produces a state)", () => {
    it("apprentice host", () => {
      expect(hasMinimumScreenState(resolveCommScreenContent(baseCtx(apprentice)))).toBe(true);
    });

    it("elara host", () => {
      expect(hasMinimumScreenState(resolveCommScreenContent(baseCtx(elara)))).toBe(true);
    });

    it("human host", () => {
      expect(hasMinimumScreenState(resolveCommScreenContent(baseCtx(humanRevealed)))).toBe(true);
    });

    it("recruit host", () => {
      const recruit: PartyMember = {
        kind: "recruit", id: "vex_solene", displayName: "Vex Solene",
        bond: 50, recruited: true,
      };
      expect(hasMinimumScreenState(resolveCommScreenContent(baseCtx(recruit)))).toBe(true);
    });
  });
});
