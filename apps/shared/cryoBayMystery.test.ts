import { describe, expect, it } from "vitest";

import {
  CRYO_MYSTERY_HOTSPOT_IDS,
  CRYO_MYSTERY_INVENTORY,
  CRYO_MYSTERY_RESPONSES,
  VERB_LIST,
  combineInventory,
  resolveVerbResponse,
} from "./cryoBayMystery";

describe("cryoBayMystery", () => {
  it("declares the seven Section F hotspots", () => {
    expect(CRYO_MYSTERY_HOTSPOT_IDS.length).toBe(7);
    expect(CRYO_MYSTERY_HOTSPOT_IDS).toEqual([
      "dead-pod",
      "cracked-panel",
      "medical-chart",
      "personal-effect",
      "data-slate",
      "frosted-glass",
      "med-bay-door",
    ]);
  });

  it("limits verbs to Look / Use / Talk (plan §F)", () => {
    expect(VERB_LIST).toEqual(["look", "use", "talk"]);
  });

  it("every hotspot answers the Look verb", () => {
    for (const id of CRYO_MYSTERY_HOTSPOT_IDS) {
      const r = resolveVerbResponse("look", id);
      expect(r).not.toBeNull();
      // Narration may be a banded triplet now; sample any band so the
      // length check stays meaningful.
      const text = typeof r!.narration === "string"
        ? r!.narration
        : r!.narration.lucid;
      expect(text.length).toBeGreaterThan(20);
    }
  });

  it("any clue-producing response sets cryo_mystery_first_clue_found", () => {
    for (const hotspotId of CRYO_MYSTERY_HOTSPOT_IDS) {
      const responses = CRYO_MYSTERY_RESPONSES[hotspotId];
      for (const verb of VERB_LIST) {
        const r = responses[verb];
        if (r?.logsClue && r.logsClue.order <= 3) {
          // Clue orders 0..3 are first-clue-eligible; they must flip the flag.
          expect(r.setsFlag).toBe("cryo_mystery_first_clue_found");
        }
      }
    }
  });

  it("every inventory id granted by a response is in the catalog", () => {
    for (const hotspotId of CRYO_MYSTERY_HOTSPOT_IDS) {
      const responses = CRYO_MYSTERY_RESPONSES[hotspotId];
      for (const verb of VERB_LIST) {
        const r = responses[verb];
        if (r?.grantsInventory) {
          expect(CRYO_MYSTERY_INVENTORY[r.grantsInventory]).toBeDefined();
        }
      }
    }
  });

  it("clue order values are unique across the scene", () => {
    const orders: number[] = [];
    for (const hotspotId of CRYO_MYSTERY_HOTSPOT_IDS) {
      const responses = CRYO_MYSTERY_RESPONSES[hotspotId];
      for (const verb of VERB_LIST) {
        const r = responses[verb];
        if (r?.logsClue) orders.push(r.logsClue.order);
      }
    }
    expect(orders.length).toBe(new Set(orders).size);
  });

  it("combining the ID tag and data-slate identifies the victim", () => {
    const result = combineInventory("torn-id-tag", "data-slate-fragment");
    expect(result).not.toBeNull();
    expect(result!.setsFlag).toBe("cryo_mystery_victim_identified");
    expect(result!.unlocksExit).toBe("medical-bay");
  });

  it("combining is order-independent", () => {
    const a = combineInventory("torn-id-tag", "data-slate-fragment");
    const b = combineInventory("data-slate-fragment", "torn-id-tag");
    expect(a).toEqual(b);
  });

  it("unrelated combines return null", () => {
    expect(
      combineInventory("silver-locket", "unlabeled-vial"),
    ).toBeNull();
  });

  it("med-bay-door use unlocks the medical-bay exit", () => {
    const r = resolveVerbResponse("use", "med-bay-door");
    expect(r?.unlocksExit).toBe("medical-bay");
  });
});
