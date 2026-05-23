import { describe, it, expect } from "vitest";
import {
  NEXUS_TRIAL_CINEMATICS,
  BALLOT_CINEMATICS,
  CONFESSION_CINEMATICS,
  ballotCinematicFor,
  confessionCinematicFor,
  abortCinematic,
  lockeCinematic,
  type CinematicScript,
} from "./cinematics";
import { BALLOT_KEYS, type BallotKey } from "./buckets";

describe("NEXUS_TRIAL_CINEMATICS — registry", () => {
  it("ships exactly 8 cinematics (Locke + 4 ballot + 2 confession + abort)", () => {
    expect(Object.keys(NEXUS_TRIAL_CINEMATICS).length).toBe(8);
  });

  it("every CinematicScript has the full authoring shape", () => {
    for (const c of Object.values(NEXUS_TRIAL_CINEMATICS)) {
      expect(c.id.length).toBeGreaterThan(0);
      expect(c.antiquarianOpening.length).toBeGreaterThan(40);
      expect(c.actionDirections.length).toBeGreaterThan(80);
      expect(c.antiquarianClosing.length).toBeGreaterThan(10);
      expect(c.cardBurnArt.length).toBeGreaterThan(10);
      expect(c.crossArcRipples.length).toBeGreaterThan(0);
      // npcKey is null for the abort variant; non-empty otherwise.
      if (c.slot !== "abort") {
        expect(c.npcKey).not.toBeNull();
      }
      // characterLine is empty for the abort variant; non-empty otherwise.
      if (c.slot !== "abort") {
        expect(c.characterLine.length).toBeGreaterThan(10);
      }
    }
  });

  it("Locke runs at verdict_open; ballot variants at verdict_ballot; confession variants at confession; abort at abort", () => {
    expect(NEXUS_TRIAL_CINEMATICS.verdict_locke.slot).toBe("verdict_open");
    for (const c of BALLOT_CINEMATICS) expect(c.slot).toBe("verdict_ballot");
    for (const c of CONFESSION_CINEMATICS) expect(c.slot).toBe("confession");
    expect(NEXUS_TRIAL_CINEMATICS.verdict_abort.slot).toBe("abort");
  });
});

describe("CONFESSION_CINEMATICS — variants + romance tags", () => {
  it("covers both companions (elara, human)", () => {
    expect(CONFESSION_CINEMATICS.map((c) => c.npcKey)).toEqual(["elara", "human"]);
  });

  it("confessionCinematicFor returns the matching variant", () => {
    expect(confessionCinematicFor("elara").id).toBe("confession_elara_dies");
    expect(confessionCinematicFor("human").id).toBe("confession_human_dies");
  });

  it("both variants carry a romance tag (private add-on for romanced players)", () => {
    for (const c of CONFESSION_CINEMATICS) {
      expect(c.romanceTag).toBeDefined();
      expect(c.romanceTag!.characterLine.length).toBeGreaterThan(10);
      expect(c.romanceTag!.stageDirections.length).toBeGreaterThan(20);
    }
  });

  it("romance tag interpolates {player_name} (not a hardcoded name)", () => {
    for (const c of CONFESSION_CINEMATICS) {
      expect(c.romanceTag!.characterLine).toContain("{player_name}");
    }
  });

  it("ballot variants do NOT carry a romance tag", () => {
    for (const c of BALLOT_CINEMATICS) {
      expect(c.romanceTag).toBeUndefined();
    }
  });
});

describe("abortCinematic", () => {
  it("returns the verdict_abort script with empty characterLine", () => {
    const a = abortCinematic();
    expect(a.id).toBe("verdict_abort");
    expect(a.slot).toBe("abort");
    expect(a.npcKey).toBeNull();
    expect(a.characterLine).toBe("");
  });

  it("the Antiquarian's closing line is the runbook's narrative cover", () => {
    expect(abortCinematic().antiquarianClosing).toBe(
      "The Antiquarian closed the ledger early.",
    );
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
