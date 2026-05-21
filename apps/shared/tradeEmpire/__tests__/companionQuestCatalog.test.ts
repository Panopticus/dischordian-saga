/* ═══════════════════════════════════════════════════════
   COMPANION QUEST CATALOG — shape + integration tests.

   Hard parity:
     - every catalog entry validates against canonical NPC + sector
       registries (the catalog file already self-checks on import,
       but the test re-verifies and inspects the error list)
     - every cardLoreHook.cardId resolves to a real CardDefinition
       in the ALL_CARD_DEFINITIONS registry
     - every weekly narrative flag is consumed by at least one
       SEASON_ARCS chapter (the arc-to-weekly mapping has no
       dangling weekly references)
     - the witness ledger aggregates flag bags into the expected
       per-anchor / per-sector / per-arc structure
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";

import {
  COMPANION_QUEST_CATALOG,
  companionQuestsForCadence,
  validateCompanionQuestCatalog,
  lookupCompanionQuest,
} from "../companionQuestCatalog";
import { SEASON_ARCS, arcsForWeeklyQuestId } from "../seasonArcs";
import { aggregateWitnessLedger, anchorWitnessCount } from "../witnessLedger";
import { ALL_CARD_DEFINITIONS } from "../../tcg-core/cards";

describe("companionQuestCatalog — shape", () => {
  it("validates cleanly (no anchor / sector / flag drift)", () => {
    const errs = validateCompanionQuestCatalog();
    expect(errs).toEqual([]);
  });

  it("ships at least 30 daily entries", () => {
    expect(companionQuestsForCadence("daily").length).toBeGreaterThanOrEqual(30);
  });

  it("ships at least 12 weekly entries", () => {
    expect(companionQuestsForCadence("weekly").length).toBeGreaterThanOrEqual(12);
  });

  it("every entry has a unique id", () => {
    const ids = new Set<string>();
    for (const q of COMPANION_QUEST_CATALOG) {
      expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false);
      ids.add(q.id);
    }
  });

  it("every cardLoreHook.cardId resolves to a real CardDefinition", () => {
    const knownCardIds = new Set(ALL_CARD_DEFINITIONS.map((c) => c.id as string));
    const missing: string[] = [];
    for (const q of COMPANION_QUEST_CATALOG) {
      if (!knownCardIds.has(q.cardLoreHook.cardId)) {
        missing.push(`${q.id} → ${q.cardLoreHook.cardId}`);
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("lookup by id is bidirectional with the catalog", () => {
    for (const q of COMPANION_QUEST_CATALOG) {
      expect(lookupCompanionQuest(q.id)?.id).toBe(q.id);
    }
    expect(lookupCompanionQuest("__nonexistent__")).toBeUndefined();
  });
});

describe("seasonArcs — chapter wiring", () => {
  it("every season-arc chapter references a real weekly quest id", () => {
    const weeklyIds = new Set(
      companionQuestsForCadence("weekly").map((q) => q.id),
    );
    const missing: string[] = [];
    for (const arc of SEASON_ARCS) {
      for (const chapter of arc.chapters) {
        if (!weeklyIds.has(chapter.weeklyQuestId)) {
          missing.push(`${arc.title} → ${chapter.weeklyQuestId}`);
        }
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("arcsForWeeklyQuestId returns at least one arc for every weekly", () => {
    for (const weekly of companionQuestsForCadence("weekly")) {
      const arcs = arcsForWeeklyQuestId(weekly.id);
      expect(arcs.length, `weekly ${weekly.id} not used by any arc`)
        .toBeGreaterThan(0);
    }
  });

  it("every arc defines exactly 5 chapters", () => {
    for (const arc of SEASON_ARCS) {
      expect(arc.chapters.length, arc.title).toBe(5);
    }
  });

  it("every cardsUnlocked entry resolves to a real CardDefinition", () => {
    const knownCardIds = new Set(ALL_CARD_DEFINITIONS.map((c) => c.id as string));
    const missing: string[] = [];
    for (const arc of SEASON_ARCS) {
      for (const id of arc.cardsUnlocked) {
        if (!knownCardIds.has(id)) {
          missing.push(`${arc.title} → ${id}`);
        }
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });
});

describe("witnessLedger — aggregation", () => {
  it("empty flag bag produces zero potentials and zero per-arc closures", () => {
    const ledger = aggregateWitnessLedger({});
    expect(ledger.totalPotentials).toBe(0);
    expect(Object.keys(ledger.byAnchor)).toEqual([]);
    expect(Object.keys(ledger.bySector)).toEqual([]);
    for (const arc of ledger.arcProgress) {
      expect(arc.closed).toBe(0);
      expect(arc.total).toBe(5);
    }
  });

  it("a daily quest's flag surfaces in byAnchor and bySector", () => {
    const elaraDaily = COMPANION_QUEST_CATALOG.find(
      (q) => q.id === "cq_d_elara_familiar_wreck",
    );
    expect(elaraDaily).toBeDefined();
    const flags = { [elaraDaily!.narrativeFlag]: true };
    const ledger = aggregateWitnessLedger(flags);

    expect(ledger.totalPotentials).toBe(1);
    expect(ledger.byAnchor["elara"]?.length).toBe(1);
    expect(ledger.bySector["ark_debris_field"]?.length).toBe(1);
    expect(ledger.byAnchor["elara"]?.[0].cardId).toBe("s1_pack_id_elara_ship_ai");
  });

  it("a weekly quest's flag advances the matching arc-progress chapter count", () => {
    const memento = COMPANION_QUEST_CATALOG.find(
      (q) => q.id === "cq_w_pan_faction_memento",
    );
    expect(memento).toBeDefined();
    const flags = { [memento!.narrativeFlag]: true };
    const ledger = aggregateWitnessLedger(flags);

    const mementoArc = ledger.arcProgress.find(
      (a) => a.arcId === "arc.memento_dischordia",
    );
    expect(mementoArc).toBeDefined();
    expect(mementoArc!.closed).toBe(1);
  });

  it("anchorWitnessCount counts per-anchor flags accurately", () => {
    const flags: Record<string, boolean> = {};
    for (const q of COMPANION_QUEST_CATALOG) {
      if (q.anchors.includes("elara")) flags[q.narrativeFlag] = true;
    }
    const count = anchorWitnessCount(flags, "elara");
    const expected = COMPANION_QUEST_CATALOG.filter((q) =>
      q.anchors.includes("elara"),
    ).length;
    expect(count).toBe(expected);
  });
});
