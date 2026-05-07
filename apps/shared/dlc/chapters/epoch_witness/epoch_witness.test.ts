/* Wave-4 integration tests — Epoch Witness DLC chapters.
 *
 * Confirms that the 16 late-age votes (Insurgency / Revelation /
 * Fall of Reality) round-trip through the DLC system without
 * losing fidelity to their NexusPointVote source: parent section
 * carries the canonical EpochId, prerequisites chain off the
 * right Act gate, lockedUntil flags surface as DlcPrerequisite,
 * and the choice step preserves the vote's options 1:1.
 */
import { describe, expect, it } from "vitest";
import {
  ALL_EPOCH_WITNESS_DLC_CHAPTERS,
  buildDlcChapterFromVote,
  epochWitnessChapterId,
} from "./index";
import {
  AGE_OF_INSURGENCY_VOTES,
  AGE_OF_REVELATION_VOTES,
  FALL_OF_REALITY_VOTES,
} from "../../../epochWitnessVotesLate";
import {
  ALL_DLC_CHAPTERS,
  deriveDlcChapterStatus,
  dlcChapterCompletionFlag,
  getDlcChaptersForSection,
} from "../../index";
import type { DlcChapter } from "../../types";

const LATE_VOTE_COUNT =
  AGE_OF_INSURGENCY_VOTES.length +
  AGE_OF_REVELATION_VOTES.length +
  FALL_OF_REALITY_VOTES.length;

describe("Epoch Witness — DLC adapter", () => {
  it("wraps every late-age vote into a DLC chapter (14 today: 6 Insurgency + 5 Revelation + 3 Fall)", () => {
    expect(ALL_EPOCH_WITNESS_DLC_CHAPTERS).toHaveLength(LATE_VOTE_COUNT);
    expect(AGE_OF_INSURGENCY_VOTES).toHaveLength(6);
    expect(AGE_OF_REVELATION_VOTES).toHaveLength(5);
    expect(FALL_OF_REALITY_VOTES).toHaveLength(3);
    expect(LATE_VOTE_COUNT).toBe(14);
  });

  it("every chapter id has the dlc_epoch_<vote_id> shape", () => {
    for (const chapter of ALL_EPOCH_WITNESS_DLC_CHAPTERS) {
      expect(chapter.id).toMatch(/^dlc_epoch_[a-z0-9_]+$/);
    }
  });

  it("epochWitnessChapterId derives the canonical id", () => {
    expect(epochWitnessChapterId("ins_v1")).toBe("dlc_epoch_ins_v1");
    expect(epochWitnessChapterId("fall_v3")).toBe("dlc_epoch_fall_v3");
    expect(epochWitnessChapterId("rev_close")).toBe("dlc_epoch_rev_close");
  });

  it("parentSection carries the canonical EpochId + archetype gate", () => {
    const v = AGE_OF_INSURGENCY_VOTES[0];
    const c = buildDlcChapterFromVote(v);
    expect(c.parentSection).toEqual({
      kind: "epoch_witness",
      epoch: v.epoch,
      archetype: v.archetypeRequired,
    });
  });

  it("Insurgency chapters require Act 4 completion", () => {
    for (const c of ALL_EPOCH_WITNESS_DLC_CHAPTERS) {
      if (c.parentSection.kind !== "epoch_witness") continue;
      if (c.parentSection.epoch !== "age_of_insurgency") continue;
      expect(c.prerequisites).toContainEqual({ kind: "act_completion", act: 4 });
    }
  });

  it("Revelation chapters require Act 5 completion", () => {
    for (const c of ALL_EPOCH_WITNESS_DLC_CHAPTERS) {
      if (c.parentSection.kind !== "epoch_witness") continue;
      if (c.parentSection.epoch !== "age_of_revelation") continue;
      expect(c.prerequisites).toContainEqual({ kind: "act_completion", act: 5 });
    }
  });

  it("Fall-of-Reality chapters require Act 7 completion", () => {
    for (const c of ALL_EPOCH_WITNESS_DLC_CHAPTERS) {
      if (c.parentSection.kind !== "epoch_witness") continue;
      if (c.parentSection.epoch !== "fall_of_reality") continue;
      expect(c.prerequisites).toContainEqual({ kind: "act_completion", act: 7 });
    }
  });

  it("votes with lockedUntil get an extra flag prerequisite", () => {
    const insV2 = AGE_OF_INSURGENCY_VOTES.find((v) => v.id === "ins_v2");
    expect(insV2?.lockedUntil).toBeTruthy();
    const c = buildDlcChapterFromVote(insV2!);
    expect(c.prerequisites).toContainEqual({
      kind: "flag",
      flag: insV2!.lockedUntil!,
    });
  });

  it("steps include officialHistory + a choice with every option preserved", () => {
    const v = AGE_OF_INSURGENCY_VOTES[0];
    const c = buildDlcChapterFromVote(v);
    const narration = c.steps.find((s) => s.id === "official_history");
    expect(narration?.kind).toBe("narration");
    if (narration?.kind === "narration") {
      expect(narration.text).toBe(v.officialHistory);
    }
    const choice = c.steps.find((s) => s.id === "cast_vote");
    expect(choice?.kind).toBe("choice");
    if (choice?.kind === "choice") {
      expect(choice.options.map((o) => o.id)).toEqual(
        v.options.map((o) => o.id),
      );
    }
  });

  it("rewards.loredexEntries mirrors the vote's connectedLoredexEntries", () => {
    const v = AGE_OF_INSURGENCY_VOTES[0];
    const c = buildDlcChapterFromVote(v);
    expect(c.rewards.loredexEntries).toEqual(v.connectedLoredexEntries);
  });

  it("setsFlagsOnComplete includes the canonical dlc_chapter_<id>_complete flag", () => {
    for (const c of ALL_EPOCH_WITNESS_DLC_CHAPTERS) {
      expect(c.setsFlagsOnComplete).toContain(dlcChapterCompletionFlag(c.id));
    }
  });

  it("epoch closers sort to the end of their parent section", () => {
    const insChapters = getDlcChaptersForSection({
      kind: "epoch_witness",
      epoch: "age_of_insurgency",
    });
    const last: DlcChapter = insChapters[insChapters.length - 1];
    expect(last.id).toBe("dlc_epoch_ins_close");
  });

  it("getDlcChaptersForSection groups by epoch correctly", () => {
    const ins = getDlcChaptersForSection({
      kind: "epoch_witness",
      epoch: "age_of_insurgency",
    });
    const rev = getDlcChaptersForSection({
      kind: "epoch_witness",
      epoch: "age_of_revelation",
    });
    const fall = getDlcChaptersForSection({
      kind: "epoch_witness",
      epoch: "fall_of_reality",
    });
    expect(ins.length).toBe(AGE_OF_INSURGENCY_VOTES.length);
    expect(rev.length).toBe(AGE_OF_REVELATION_VOTES.length);
    expect(fall.length).toBe(FALL_OF_REALITY_VOTES.length);
  });

  it("the global registry contains every epoch-witness chapter", () => {
    for (const c of ALL_EPOCH_WITNESS_DLC_CHAPTERS) {
      expect(ALL_DLC_CHAPTERS).toContain(c);
    }
  });

  it("Insurgency vote ins_v1 lifecycles correctly through the gate", () => {
    const chapter = ALL_EPOCH_WITNESS_DLC_CHAPTERS.find(
      (c) => c.id === "dlc_epoch_ins_v1",
    )!;
    expect(chapter).toBeDefined();
    // Locked initially.
    expect(
      deriveDlcChapterStatus({ chapter, flags: {}, entitlements: {} })
        .available,
    ).toBe(false);
    // Available after Act 4 (ins_v1 has no lockedUntil).
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags: { act_4_complete: true },
        entitlements: {},
      }).available,
    ).toBe(true);
    // Already complete once the canonical flag is set.
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags: {
          act_4_complete: true,
          [dlcChapterCompletionFlag(chapter.id)]: true,
        },
        entitlements: {},
      }).alreadyComplete,
    ).toBe(true);
  });
});
