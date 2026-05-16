/* ═══════════════════════════════════════════════════════
   PERSPECTIVE CANON — integrity + end-to-end wiring tests
   (PR-18, Dischordian-Logic epistemology)

   Proves:
   - registry integrity (unique ids, well-formed status)
   - the parity gate passes (locked ⇒ arc+episode resolves;
     canon_pending ⇒ loreSource)
   - the Zod schema accepts the new perspective_learned kind
     and still rejects malformed / extra fields (.strict)
   - the FULL unlock path works off the EXISTING mystery
     flag stream: a closed terminal episode derives the
     learned perspective, which satisfies the
     perspective_learned CardUnlockCondition — and a player
     with nothing closed does NOT get it.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  PERSPECTIVES,
  getPerspective,
  perspectiveLearnedFromEpisode,
  getPerspectiveCoverage,
} from "./perspectiveCanon";
import { getMysteriesForArc } from "./episodeMysteries";
import type { ArcId } from "./mysteryTypes";
import { cardUnlockConditionSchema } from "./tcg-core/cards/schema";
import {
  evaluateUnlockCondition,
  derivePlayerExpansionStateFromFlags,
  NULL_PLAYER_EXPANSION_STATE,
} from "./tcg-core/rewards/expansionUnlockService";
import { checkPerspectiveCanonCoverage } from "./_completeness/checks/perspectiveCanonCoverage";

describe("perspective canon — integrity", () => {
  it("ids are unique and namespaced", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const p of PERSPECTIVES) {
      if (seen.has(p.id)) dupes.push(p.id);
      seen.add(p.id);
      expect(p.id.startsWith("perspective."), `${p.id} namespace`).toBe(true);
    }
    expect(dupes).toEqual([]);
  });

  it("ships both locked and canon_pending classifications", () => {
    const c = getPerspectiveCoverage();
    expect(c.declared).toBe(PERSPECTIVES.length);
    expect(c.locked).toBeGreaterThan(0);
    expect(c.canonPending).toBeGreaterThan(0);
  });

  it("every locked perspective resolves its arc + terminal episode", () => {
    for (const p of PERSPECTIVES) {
      if (p.status !== "locked") continue;
      expect(p.unlockingArcId, `${p.id} arcId`).toBeTruthy();
      expect(p.unlockingTerminalEpisodeId, `${p.id} episodeId`).toBeTruthy();
      const mysteries = getMysteriesForArc(p.unlockingArcId as ArcId);
      const hasEpisode = mysteries.some((m) =>
        m.episodes.some((e) => e.id === p.unlockingTerminalEpisodeId),
      );
      expect(
        hasEpisode,
        `${p.id}: ${p.unlockingArcId}:${p.unlockingTerminalEpisodeId} must resolve`,
      ).toBe(true);
    }
  });

  it("every canon_pending perspective carries a loreSource", () => {
    for (const p of PERSPECTIVES) {
      if (p.status !== "canon_pending") continue;
      expect(p.loreSource.trim().length, `${p.id} loreSource`).toBeGreaterThan(0);
      expect(p.unlockingArcId).toBeNull();
    }
  });

  it("the parity gate passes (hard)", () => {
    const r = checkPerspectiveCanonCoverage();
    expect(r.missing).toEqual([]);
    expect(r.implemented).toBe(r.declared);
  });
});

describe("perspective_learned — schema parity", () => {
  it("accepts a well-formed perspective_learned condition", () => {
    const parsed = cardUnlockConditionSchema.parse({
      kind: "perspective_learned",
      perspectiveId: "perspective.the_seer",
    });
    expect(parsed).toEqual({
      kind: "perspective_learned",
      perspectiveId: "perspective.the_seer",
    });
  });

  it("rejects empty perspectiveId and unknown extra fields (.strict)", () => {
    expect(() =>
      cardUnlockConditionSchema.parse({
        kind: "perspective_learned",
        perspectiveId: "",
      }),
    ).toThrow();
    expect(() =>
      cardUnlockConditionSchema.parse({
        kind: "perspective_learned",
        perspectiveId: "perspective.the_seer",
        extra: true,
      }),
    ).toThrow();
  });
});

describe("perspective_learned — end-to-end off the existing flag stream", () => {
  const seer = getPerspective("perspective.the_seer");

  it("a closed terminal episode derives the learned perspective", () => {
    expect(seer).toBeDefined();
    const arcId = seer!.unlockingArcId!;
    const epId = seer!.unlockingTerminalEpisodeId!;

    // reverse map
    expect(perspectiveLearnedFromEpisode(arcId, epId)).toBe(
      "perspective.the_seer",
    );

    // derived from the SAME prefix the unlock service already
    // reads — no new flag prefix introduced.
    const state = derivePlayerExpansionStateFromFlags({
      [`mystery_episode_complete:${arcId}:${epId}`]: true,
    });
    expect(state.learnedPerspectives.has("perspective.the_seer")).toBe(true);

    expect(
      evaluateUnlockCondition(
        { kind: "perspective_learned", perspectiveId: "perspective.the_seer" },
        state,
      ),
    ).toBe(true);
  });

  it("a player who has closed nothing has not learned it", () => {
    expect(
      evaluateUnlockCondition(
        { kind: "perspective_learned", perspectiveId: "perspective.the_seer" },
        NULL_PLAYER_EXPANSION_STATE,
      ),
    ).toBe(false);
    const empty = derivePlayerExpansionStateFromFlags({});
    expect(empty.learnedPerspectives.size).toBe(0);
  });

  it("a non-terminal episode does NOT teach the perspective", () => {
    const state = derivePlayerExpansionStateFromFlags({
      "mystery_episode_complete:arc.the_seer:seer.e1": true,
    });
    expect(state.learnedPerspectives.size).toBe(0);
  });
});
