/* ═══════════════════════════════════════════════════════
   RESURRECTION CINEMATIC ROUTER — resolver invariant tests

   Mirrors apps/shared/__tests__/confessionCloseRouterResolver.test.ts
   shape. Exercises the pure resolver
   (resolvePendingCinematic) so the iteration order and
   pending/seen-flag gating are locked.

   The resolver walks two trigger families:
     1. Resurrection-protocol NPCs (Wraith, Akai today) —
        pending_resurrection_cinematic_<npcKey> set by Path A
        (resurrection.ts:completePathA) or Path B
        (pathBResolutionService — pending wire-up).
     2. The Wolf release — the per-choice flag
        mystery_choice:...:wolf.e5.c.release_the_wolf set by
        mysteryService when the player commits E5's release.

   Failure here means a branch of the cinematic plumbing
   regressed. The fix is to repair the flag plumbing, not
   relax the test.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { resolvePendingCinematic } from "../ResurrectionCinematicRouter";
import {
  pendingResurrectionCinematicFlag,
  resurrectionCinematicSeenFlag,
  RESURRECTABLE_NPC_KEYS,
  RESURRECTION_CINEMATIC_BY_NPC,
} from "@shared/resurrectionProtocols";
import {
  WOLF_CRUCIBLE_RESCUE_CINEMATIC,
  WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG,
  WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG,
  WOLF_RELEASE_CHOICE_ID,
} from "@shared/dlcMysteries/wolfAnaraHunt";
import { HUNT_THE_HERO_AVAILABLE_FLAG } from "@shared/tcg-core/matches/huntTheHero";

describe("ResurrectionCinematicRouter — resolvePendingCinematic", () => {
  it("returns null with no flags set", () => {
    expect(resolvePendingCinematic({})).toBeNull();
  });

  it("returns the Wraith cinematic when its pending flag is set", () => {
    const pending = resolvePendingCinematic({
      [pendingResurrectionCinematicFlag("wraith_calder")]: true,
    });
    expect(pending?.triggerId).toBe("resurrection_cinematic_wraith_calder");
    expect(pending?.cinematicId).toBe("wraith_calder_syndicate_of_death");
    expect(pending?.flagsOnComplete.pending).toBe(
      pendingResurrectionCinematicFlag("wraith_calder"),
    );
    expect(pending?.flagsOnComplete.seen).toBe(
      resurrectionCinematicSeenFlag("wraith_calder"),
    );
  });

  it("returns the Akai cinematic when its pending flag is set", () => {
    const pending = resolvePendingCinematic({
      [pendingResurrectionCinematicFlag("akai_shi")]: true,
    });
    expect(pending?.triggerId).toBe("resurrection_cinematic_akai_shi");
    expect(pending?.cinematicId).toBe("akai_shi_necromancers_lair");
  });

  it("skips a cinematic whose seen-flag is already set", () => {
    const pending = resolvePendingCinematic({
      [pendingResurrectionCinematicFlag("wraith_calder")]: true,
      [resurrectionCinematicSeenFlag("wraith_calder")]: true,
    });
    expect(pending).toBeNull();
  });

  it("fires the Wolf release cinematic on the per-choice release flag", () => {
    const pending = resolvePendingCinematic({
      [WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG]: true,
    });
    expect(pending?.triggerId).toBe("resurrection_cinematic_wolf");
    expect(pending?.cinematicId).toBe(WOLF_CRUCIBLE_RESCUE_CINEMATIC);
    expect(pending?.flagsOnComplete.pending).toBeNull();
    expect(pending?.flagsOnComplete.seen).toBe(
      WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG,
    );
  });

  it("Wolf cinematic completion opens the Hunt-the-Hero CTA", () => {
    // The handleComplete callback writes every flag in
    // flagsOnComplete.extraOnTrue to true so the Hunt overlay
    // becomes mountable the moment the release video ends.
    const pending = resolvePendingCinematic({
      [WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG]: true,
    });
    expect(pending?.flagsOnComplete.extraOnTrue).toContain(
      HUNT_THE_HERO_AVAILABLE_FLAG,
    );
  });

  it("resurrection cinematics do NOT open the Hunt-the-Hero CTA", () => {
    const pending = resolvePendingCinematic({
      [pendingResurrectionCinematicFlag("wraith_calder")]: true,
    });
    expect(pending?.flagsOnComplete.extraOnTrue).toBeUndefined();
  });

  it("does NOT fire the Wolf cinematic on the leave-contained choice flag", () => {
    const leaveContainedFlag =
      `mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5:wolf.e5.c.leave_him_contained`;
    const pending = resolvePendingCinematic({
      [leaveContainedFlag]: true,
    });
    expect(pending).toBeNull();
  });

  it("does NOT fire the Wolf cinematic on the recall-the-judge choice flag", () => {
    const recallJudgeFlag =
      `mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5:wolf.e5.c.recall_the_judge`;
    const pending = resolvePendingCinematic({
      [recallJudgeFlag]: true,
    });
    expect(pending).toBeNull();
  });

  it("skips the Wolf cinematic when its seen-flag is set", () => {
    const pending = resolvePendingCinematic({
      [WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG]: true,
      [WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG]: true,
    });
    expect(pending).toBeNull();
  });

  it("non-true pending values do not count as set", () => {
    expect(
      resolvePendingCinematic({
        [pendingResurrectionCinematicFlag("wraith_calder")]: false,
      }),
    ).toBeNull();
    expect(
      resolvePendingCinematic({
        [pendingResurrectionCinematicFlag("akai_shi")]: 1 as unknown as boolean,
      }),
    ).toBeNull();
  });

  it("iteration order: resurrection-protocol NPCs (canonical order) before Wolf", () => {
    // Set every possible pending flag; resolver should pick the
    // first canonical NPC with a cinematic binding. Today that's
    // wraith_calder (RESURRECTABLE_NPC_KEYS index 1, after
    // vex_solene which has no cinematic).
    const allFlags: Record<string, boolean> = {
      [WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG]: true,
    };
    for (const npcKey of RESURRECTABLE_NPC_KEYS) {
      if (RESURRECTION_CINEMATIC_BY_NPC[npcKey]) {
        allFlags[pendingResurrectionCinematicFlag(npcKey)] = true;
      }
    }
    const pending = resolvePendingCinematic(allFlags);
    // First cinematic-bound NPC in canonical order.
    const firstBound = RESURRECTABLE_NPC_KEYS.find(
      (k) => RESURRECTION_CINEMATIC_BY_NPC[k],
    );
    expect(pending?.triggerId).toBe(`resurrection_cinematic_${firstBound}`);
  });

  it("Wolf trigger flag follows the documented release-choice convention", () => {
    expect(WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG).toBe(
      `mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5:${WOLF_RELEASE_CHOICE_ID}`,
    );
  });

  it("resurrection seen-flag follows the documented convention", () => {
    expect(resurrectionCinematicSeenFlag("wraith_calder")).toBe(
      "resurrection_cinematic_wraith_calder_seen",
    );
    expect(resurrectionCinematicSeenFlag("akai_shi")).toBe(
      "resurrection_cinematic_akai_shi_seen",
    );
  });

  it("resurrection pending-flag follows the documented convention", () => {
    expect(pendingResurrectionCinematicFlag("wraith_calder")).toBe(
      "pending_resurrection_cinematic_wraith_calder",
    );
  });
});
