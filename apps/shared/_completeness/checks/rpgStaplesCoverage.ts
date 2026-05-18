/**
 * RPG-staples coverage — the four-pillar presence gate (W6).
 *
 * The audit flagged inventory/crafting/vendor/traversal as missing
 * or thin. Each claim was stale; what was missing was an enforced
 * contract. apps/shared/rpgStaples.ts declares the four pillars and
 * their shipped anchors; overworld traversal is explicitly bound to
 * the room-unlock manifest + the spine doorways.
 *
 * HARD PARITY: a pillar is implemented iff every one of its anchor
 * modules exists on disk AND (for crafting) the recipe book clears
 * CRAFTING_RECIPE_FLOOR — the stale "5 recipes" claim is now an
 * enforced minimum. declared = 4 pillars.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import { RPG_STAPLES, CRAFTING_RECIPE_FLOOR } from "../../rpgStaples";
import type { RawParityCount } from "../types";

const CRAFTING_DATA = "apps/client/src/data/craftingData.ts";

function craftingRecipeCount(): number {
  try {
    const src = fs.readFileSync(
      path.join(REPO_ROOT, CRAFTING_DATA),
      "utf-8",
    );
    const block = src.slice(src.indexOf("CRAFTING_RECIPES"));
    return (block.match(/\bid:\s*['"]/g) ?? []).length;
  } catch {
    return 0;
  }
}

export function checkRpgStaplesCoverage(): RawParityCount {
  const missing: string[] = [];
  let implemented = 0;

  for (const staple of RPG_STAPLES) {
    const absent = staple.anchorModules.filter(
      (m) => !fs.existsSync(path.join(REPO_ROOT, m)),
    );
    if (absent.length > 0) {
      missing.push(
        `pillar '${staple.pillar}' missing anchor module(s): ` +
          absent.join(", "),
      );
      continue;
    }
    if (staple.id === "crafting") {
      const n = craftingRecipeCount();
      if (n < CRAFTING_RECIPE_FLOOR) {
        missing.push(
          `crafting has ~${n} recipes — below the enforced floor of ` +
            `${CRAFTING_RECIPE_FLOOR} (the audit's stale "5 recipes" ` +
            `claim is now a minimum)`,
        );
        continue;
      }
    }
    implemented++;
  }

  return { declared: RPG_STAPLES.length, implemented, missing };
}
