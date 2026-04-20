import { describe, expect, it } from "vitest";

import { EARNED_REWARDS } from "./earnedLoadouts";
import {
  EARNED_LOADOUT_ART_PROMPTS,
  EARNED_LOADOUT_STYLE_ANCHOR,
} from "./earnedLoadoutArtPrompts";

/**
 * The prompt catalog must stay in lockstep with the reward pool. Any
 * item added to apps/shared/earnedLoadouts.ts must also land an art
 * prompt here — otherwise the production CSV silently ships a gap.
 */
describe("earnedLoadoutArtPrompts", () => {
  const rewardItemIds = (() => {
    const ids = new Set<string>();
    for (const source of Object.values(EARNED_REWARDS)) {
      for (const byClass of Object.values(source)) {
        for (const bySpecies of Object.values(byClass)) {
          for (const item of bySpecies ?? []) {
            ids.add(item.id);
          }
        }
      }
    }
    return ids;
  })();

  const promptAssetIds = new Set(
    EARNED_LOADOUT_ART_PROMPTS.map((p) => p.assetId),
  );

  it("covers every reward item with exactly one prompt", () => {
    for (const id of rewardItemIds) {
      expect(promptAssetIds).toContain(id);
    }
  });

  it("has no prompt entries without a matching reward item", () => {
    for (const id of promptAssetIds) {
      expect(rewardItemIds).toContain(id);
    }
  });

  it("has no duplicate assetIds", () => {
    const list = EARNED_LOADOUT_ART_PROMPTS.map((p) => p.assetId);
    expect(list.length).toBe(new Set(list).size);
  });

  it("every prompt declares the shared style-anchor dependency", () => {
    for (const p of EARNED_LOADOUT_ART_PROMPTS) {
      expect(p.dependencies ?? []).toContain("earned_loadout_style_anchor");
    }
  });

  it("every prompt body is non-trivial", () => {
    for (const p of EARNED_LOADOUT_ART_PROMPTS) {
      expect(p.prompt.length).toBeGreaterThan(120);
    }
  });

  it("the style anchor commits to the cyberpunk × steampunk sorcery brief", () => {
    expect(EARNED_LOADOUT_STYLE_ANCHOR.toLowerCase()).toContain("brass");
    expect(EARNED_LOADOUT_STYLE_ANCHOR.toLowerCase()).toContain("glyph");
  });
});
