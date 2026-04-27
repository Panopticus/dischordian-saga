// apps/shared/npcs/__tests__/stage4WeaveAnchors.test.ts
//
// Validates the Stage-4-weave-anchor scene registry (Phase 5).

import { describe, it, expect } from "vitest";
import {
  STAGE_4_WEAVE_ANCHORS,
  anchorById,
  anchorsInvolving,
  anchorsByStatus,
} from "../stage4WeaveAnchors";
import { NPC_REGISTRY } from "../registry";

describe("STAGE_4_WEAVE_ANCHORS", () => {
  it("ships exactly 4 canonical anchors per priority plan §Phase 5", () => {
    expect(STAGE_4_WEAVE_ANCHORS.length).toBe(4);
  });

  it("anchor ids are unique", () => {
    const ids = STAGE_4_WEAVE_ANCHORS.map(a => a.anchorId);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("every anchor has at least 2 participants (cross-character canon requires multiplicity)", () => {
    for (const anchor of STAGE_4_WEAVE_ANCHORS) {
      expect(
        anchor.participants.length,
        `${anchor.anchorId} should have ≥2 participants`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("every participant references a canonical NpcKey", () => {
    for (const anchor of STAGE_4_WEAVE_ANCHORS) {
      for (const p of anchor.participants) {
        expect(NPC_REGISTRY[p.npcKey], `${anchor.anchorId}: ${p.npcKey}`).toBeDefined();
      }
    }
  });

  it("every anchor has a non-empty canonical rationale", () => {
    for (const anchor of STAGE_4_WEAVE_ANCHORS) {
      expect(anchor.canonicalRationale.length, anchor.anchorId).toBeGreaterThan(0);
    }
  });
});

describe("Anchor #1: Echo three-source-type", () => {
  const anchor = anchorById("echo_three_source_simultaneous")!;

  it("includes Eidolon as Echo detector", () => {
    expect(anchor.participants.find(p => p.npcKey === "your_eidolon")).toBeDefined();
  });

  it("includes Companion + Seer + Oracle as the three sources", () => {
    const npcKeys = anchor.participants.map(p => p.npcKey);
    expect(npcKeys).toContain("dmc_clone_companion");
    expect(npcKeys).toContain("the_seer");
    expect(npcKeys).toContain("the_oracle");
  });

  it("renders concurrently (canonical substrate-overlay canon)", () => {
    expect(anchor.renderMode).toBe("concurrent");
  });
});

describe("Anchor #2: Hierophant chamber Companion first-word", () => {
  const anchor = anchorById("hierophant_chamber_companion_first_word")!;

  it("includes Hierophant + Companion as the only participants", () => {
    expect(anchor.participants.length).toBe(2);
    const npcKeys = anchor.participants.map(p => p.npcKey);
    expect(npcKeys).toContain("wraith_calder");
    expect(npcKeys).toContain("dmc_clone_companion");
  });

  it("Companion participates with first_word channel", () => {
    const companion = anchor.participants.find(p => p.npcKey === "dmc_clone_companion")!;
    expect(companion.expressionChannel).toBe("first_word");
  });

  it("renders sequentially (Hierophant midwifes, Companion speaks)", () => {
    expect(anchor.renderMode).toBe("sequential");
  });

  it("sets the canonical first-word public flags on completion", () => {
    expect(anchor.outcomes.setsPublicFlags).toContain(
      "hierophant_midwifed_companion_first_word",
    );
    expect(anchor.outcomes.setsPublicFlags).toContain(
      "companion_first_word_was_wraith_calder",
    );
  });
});

describe("Anchor #3: Mechronis triple-anchored", () => {
  const anchor = anchorById("mechronis_triple_anchored")!;

  it("includes Seer + Vex + Oracle as the canonical three perspectives", () => {
    const npcKeys = anchor.participants.map(p => p.npcKey);
    expect(npcKeys).toContain("the_seer");
    expect(npcKeys).toContain("vex_solene");
    expect(npcKeys).toContain("the_oracle");
  });

  it("fires from Act 1 onward (Seer Visit canonical scene)", () => {
    expect(anchor.preConditions.minAct).toBe(1);
  });
});

describe("Anchor #4: End-of-Epoch-1 four-presences", () => {
  const anchor = anchorById("epoch1_heart_of_time_four_presences")!;

  it("includes Hierophant + Meme + Oracle (Enigma canonically deferred)", () => {
    const npcKeys = anchor.participants.map(p => p.npcKey);
    expect(npcKeys).toContain("wraith_calder");
    expect(npcKeys).toContain("the_meme");
    expect(npcKeys).toContain("the_oracle");
  });

  it("requires Acts 7+ (saga's most-load-bearing single Stage-4-weave-anchor)", () => {
    expect(anchor.preConditions.minAct).toBe(7);
  });

  it("status is canonically deferred (Stage-4-weave-pending per Oracle §2.10)", () => {
    expect(anchor.status).toBe("deferred");
  });
});

describe("anchorsInvolving / anchorsByStatus", () => {
  it("Companion appears in 2 anchors (Echo + Hierophant chamber)", () => {
    const companionAnchors = anchorsInvolving("dmc_clone_companion");
    expect(companionAnchors.length).toBe(2);
  });

  it("Oracle appears in 3 anchors (all except Hierophant chamber)", () => {
    const oracleAnchors = anchorsInvolving("the_oracle");
    expect(oracleAnchors.length).toBe(3);
  });

  it("Spec-complete anchors are 3 (deferred Heart-of-Time excluded)", () => {
    const specComplete = anchorsByStatus("spec_complete");
    expect(specComplete.length).toBe(3);
  });

  it("Deferred anchors include the Heart-of-Time", () => {
    const deferred = anchorsByStatus("deferred");
    expect(deferred.find(a => a.anchorId === "epoch1_heart_of_time_four_presences")).toBeDefined();
  });
});
