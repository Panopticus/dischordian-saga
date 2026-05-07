import { describe, it, expect } from "vitest";

import { ITEM_DATABASE } from "@/components/ItemDetailModal";
import { ROOM_DEFINITIONS } from "@/contexts/GameContext";
import { ROOM_MYSTERY_REGISTRY } from "@shared/roomMysteries";

function collectGrantableItemIds(): Set<string> {
  const ids = new Set<string>();

  // 1. Room hotspots with type "item" — clicking them calls
  //    collectItem(hotspot.action) and opens ItemDetailModal.
  for (const room of ROOM_DEFINITIONS) {
    for (const hotspot of room.hotspots) {
      if (hotspot.type === "item" && hotspot.action) {
        ids.add(hotspot.action);
      }
    }
  }

  // 2. Room mysteries' grantsInventory — these go to mysteryInventory
  //    via grantMysteryItem() and the modal auto-opens on pickup.
  for (const mod of Object.values(ROOM_MYSTERY_REGISTRY)) {
    for (const verbs of Object.values(mod.responses)) {
      if (!verbs) continue;
      for (const resp of Object.values(verbs)) {
        if (!resp) continue;
        if (resp.grantsInventory) ids.add(resp.grantsInventory);
        for (const tier of resp.tiers ?? []) {
          if (tier.grantsInventory) ids.add(tier.grantsInventory);
        }
      }
    }
    for (const rule of mod.combines ?? []) {
      if (rule.result.producesInventory) ids.add(rule.result.producesInventory);
    }
  }

  // 3. Direct collectItem literals in ArkExplorerPage that aren't
  //    sourced from a hotspot.action — currently just the
  //    bio-bed autopsy console flow.
  ids.add("bridge-reset-code");

  // Note: the legacy adventureFeatures.INVENTORY_COMBINATIONS
  // ingredients/outputs (decoder_ring, master_decoder, …) live in
  // a separate snake_case namespace and aren't currently granted
  // by any code path. If a hotspot or mystery ever grants one,
  // it will land here through (1) or (2) and this test will fail
  // until the corresponding ItemMeta entry exists.

  return ids;
}

describe("ITEM_DATABASE coverage", () => {
  const grantable = collectGrantableItemIds();

  it("has an entry for every grantable inventory item id", () => {
    const missing: string[] = [];
    for (const id of grantable) {
      if (!ITEM_DATABASE[id]) missing.push(id);
    }
    expect(missing, `Missing ItemMeta for: ${missing.join(", ")}`).toEqual([]);
  });

  it("each entry has non-empty description, elaraAnalysis, and loreExcerpt", () => {
    const thin: string[] = [];
    for (const [id, meta] of Object.entries(ITEM_DATABASE)) {
      if (!meta.description?.trim()) thin.push(`${id}.description`);
      if (!meta.elaraAnalysis?.trim()) thin.push(`${id}.elaraAnalysis`);
      if (!meta.loreExcerpt?.trim()) thin.push(`${id}.loreExcerpt`);
    }
    expect(thin, `Thin entries: ${thin.join(", ")}`).toEqual([]);
  });
});
