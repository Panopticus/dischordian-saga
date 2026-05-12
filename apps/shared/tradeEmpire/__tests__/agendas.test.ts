// apps/shared/tradeEmpire/__tests__/agendas.test.ts

import { describe, it, expect } from "vitest";
import {
  REFERENCE_AGENDAS,
  validateAgendaDef,
  validateAllReferenceAgendas,
  type SeasonAgendaDef,
} from "../agendas";
import { isKnownSubHouseKey } from "../houses";

describe("Agenda data model — phase 1", () => {
  it("every reference agenda passes validateAgendaDef()", () => {
    expect(validateAllReferenceAgendas()).toEqual([]);
  });

  it("every agenda's primary and threatened houses are real sub-houses", () => {
    for (const agenda of REFERENCE_AGENDAS) {
      expect(isKnownSubHouseKey(agenda.primaryHouseKey)).toBe(true);
      expect(isKnownSubHouseKey(agenda.threatenedHouseKey)).toBe(true);
    }
  });

  it("every agenda's stage worldStepDeltas reference real sub-houses", () => {
    for (const agenda of REFERENCE_AGENDAS) {
      for (const stage of agenda.stages) {
        for (const delta of stage.worldStepDeltas) {
          expect(isKnownSubHouseKey(delta.houseKey), delta.houseKey).toBe(true);
        }
        for (const delta of stage.counter.counterDeltas) {
          expect(isKnownSubHouseKey(delta.houseKey), delta.houseKey).toBe(true);
        }
      }
    }
  });

  it("stage tick offsets are non-decreasing", () => {
    for (const agenda of REFERENCE_AGENDAS) {
      let last = -Infinity;
      for (const stage of agenda.stages) {
        expect(stage.tickOffset).toBeGreaterThanOrEqual(last);
        last = stage.tickOffset;
      }
    }
  });

  it("rejects an agenda whose primary equals threatened", () => {
    const bad: SeasonAgendaDef = {
      ...REFERENCE_AGENDAS[0],
      threatenedHouseKey: REFERENCE_AGENDAS[0].primaryHouseKey,
    };
    expect(validateAgendaDef(bad).length).toBeGreaterThan(0);
  });

  it("rejects an agenda with a regressing tick offset", () => {
    const original = REFERENCE_AGENDAS[0];
    const bad: SeasonAgendaDef = {
      ...original,
      stages: [
        { ...original.stages[0], tickOffset: 5 },
        { ...original.stages[1], tickOffset: 2 },
      ],
    };
    expect(validateAgendaDef(bad).length).toBeGreaterThan(0);
  });

  it("rejects an agenda stage with empty worldStepDeltas", () => {
    const original = REFERENCE_AGENDAS[0];
    const bad: SeasonAgendaDef = {
      ...original,
      stages: [{ ...original.stages[0], worldStepDeltas: [] }],
    };
    expect(validateAgendaDef(bad).length).toBeGreaterThan(0);
  });
});

describe("Priority-roster agenda coverage (NPC depth #1)", () => {
  // Priority-roster NPCs that are most directly faction-anchored should
  // each own at least one season agenda. NPCs whose roles are not
  // faction-mechanical (Elara, Eidolon, Companion, Game Master, Meme,
  // Degen) intentionally omit agendas at this tier.
  const expectedNpcs = [
    "adjudicator_locke",
    "nilmorg",
    "the_antiquarian",
    "wraith_calder",
    "vex_solene",
    "drael_mon",
    "the_oracle",
  ] as const;

  it.each(expectedNpcs)("%s has at least one reference agenda", (npc) => {
    const agendas = REFERENCE_AGENDAS.filter(a => a.npcKey === npc);
    expect(agendas.length).toBeGreaterThan(0);
  });

  it("the_antiquarian agenda anchors on the Cross-References Desk (post-bible-correction)", () => {
    // The Antiquarian ships multiple reference agendas across seasons
    // (shelfmates / cross-references-desk / etc.). Post-bible-correction
    // the canonical anchor is the Cross-References Desk — assert that
    // AT LEAST ONE agenda uses that primaryHouseKey rather than the
    // first match by npcKey (which would break every time a new
    // Antiquarian agenda is authored).
    const agendas = REFERENCE_AGENDAS.filter(
      (a) => a.npcKey === "the_antiquarian",
    );
    expect(agendas.length).toBeGreaterThan(0);
    const anchored = agendas.some(
      (a) => a.primaryHouseKey === "antiquarian_cross_references_desk",
    );
    expect(anchored).toBe(true);
  });

  it("wraith_calder Cultivate-the-Successor agenda gates on post_arena reveal", () => {
    const agenda = REFERENCE_AGENDAS.find(
      a => a.npcKey === "wraith_calder",
    );
    expect(agenda).toBeDefined();
    expect(agenda?.requiresRevealStage).toBe("post_arena");
    // Per bible §3.10 — covert layer at Inheriting band only.
    expect(agenda?.primaryHouseKey).toBe("thaloria_quietwork");
    expect(agenda?.threatenedHouseKey).toBe("hierarchy_syndicate_of_death");
  });
});
