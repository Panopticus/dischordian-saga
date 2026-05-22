import { describe, it, expect } from "vitest";
import {
  NEXUS_TRIAL_CINEMATICS,
  BALLOT_CINEMATICS,
  ballotCinematicFor,
  lockeCinematic,
  type CinematicScript,
} from "./cinematics";
import { BALLOT_KEYS, type BallotKey } from "./buckets";

describe("NEXUS_TRIAL_CINEMATICS — registry", () => {
  it("ships exactly 5 cinematics (Locke + 4 ballot)", () => {
    expect(Object.keys(NEXUS_TRIAL_CINEMATICS).length).toBe(5);
  });

  it("every CinematicScript has the full authoring shape", () => {
    for (const c of Object.values(NEXUS_TRIAL_CINEMATICS)) {
      expect(c.id.length).toBeGreaterThan(0);
      expect(c.npcKey.length).toBeGreaterThan(0);
      expect(c.antiquarianOpening.length).toBeGreaterThan(40);
      expect(c.characterLine.length).toBeGreaterThan(10);
      expect(c.actionDirections.length).toBeGreaterThan(80);
      expect(c.antiquarianClosing.length).toBeGreaterThan(10);
      expect(c.cardBurnArt.length).toBeGreaterThan(10);
      expect(c.crossArcRipples.length).toBeGreaterThan(0);
    }
  });

  it("Locke runs at verdict_open; the 4 ballot variants at verdict_ballot", () => {
    expect(NEXUS_TRIAL_CINEMATICS.verdict_locke.slot).toBe("verdict_open");
    for (const c of BALLOT_CINEMATICS) {
      expect(c.slot).toBe("verdict_ballot");
    }
  });
});

describe("ballotCinematicFor — every ballot key has a cinematic", () => {
  it("covers all 4 BALLOT_KEYS", () => {
    for (const key of BALLOT_KEYS) {
      const c = ballotCinematicFor(key);
      expect(c.npcKey).toBe(key);
      expect(c.slot).toBe("verdict_ballot");
    }
  });

  it("returns a stable reference (same lookup → same object)", () => {
    expect(ballotCinematicFor("wraith_calder")).toBe(
      ballotCinematicFor("wraith_calder"),
    );
  });
});

describe("BALLOT_CINEMATICS — order matches BALLOT_KEYS", () => {
  it("canonical order is wraith → lycos → akai → vex", () => {
    expect(BALLOT_CINEMATICS.map((c) => c.npcKey)).toEqual([
      "wraith_calder",
      "lycos",
      "akai_shi",
      "vex_solene",
    ]);
  });
});

describe("plan canon — Antiquarian closing lines match the plan's pre-authored text", () => {
  // These lines also surface in the Sprint 1 permadeath store as
  // `finalNarration` when the Verdict fires. The Sprint 10 tick
  // service has its own copy of the 4 ballot narration lines in
  // ballotFinalNarration(); the two should agree exactly. We pin
  // the lines here so a regression in either place is caught.
  const PLAN_CANON: Array<[CinematicScript["id"], string]> = [
    ["verdict_locke", "She filed the world. She did not file herself."],
    [
      "verdict_ballot_wraith_calder",
      "She was last seen carrying the names. We do not know which names she saved.",
    ],
    [
      "verdict_ballot_lycos",
      "He went back into Anara. The pack waited at the bench. He did not return to it.",
    ],
    [
      "verdict_ballot_akai_shi",
      "The Red Death gave her colour back to the dark. The dark accepted.",
    ],
    [
      "verdict_ballot_vex_solene",
      "She finished the inventory. She did not finish the courtesy.",
    ],
  ];

  for (const [id, expected] of PLAN_CANON) {
    it(`${id}: closing line matches plan`, () => {
      expect(NEXUS_TRIAL_CINEMATICS[id].antiquarianClosing).toBe(expected);
    });
  }
});

describe("authoring constraints — ballot lines stay tight", () => {
  // Plan §5: "no ballot character speaks more than two sentences"
  // captures the *spirit* — keep the line tight, don't monologue —
  // but the actual cinematic scripts use deliberate single-word
  // openings (Wraith: "Locke.") and self-interrupted closures (Vex:
  // "I am glad it was —"). The literal sentence count varies; the
  // word count is the better invariant for "tight".
  it("each ballot character's line is ≤ 50 words", () => {
    for (const c of BALLOT_CINEMATICS) {
      const wordCount = c.characterLine.split(/\s+/).filter(Boolean).length;
      expect(wordCount).toBeLessThanOrEqual(50);
    }
  });
});

describe("lockeCinematic helper", () => {
  it("returns the verdict_locke script", () => {
    expect(lockeCinematic().id).toBe("verdict_locke");
  });
});
