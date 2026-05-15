/**
 * Phase J / I14 — imprint cards carry an unlockCondition.
 *
 * Build-plan §VIII Phase I14
 * (`imprintFactionCardsAllCarryUnlockConditionLock`): every
 * imprint-faction card should carry an `unlockCondition` so
 * the engine can gate first-summon to canonical phase
 * availability.
 *
 * Current state (PR-15 baseline): 0 of 18 imprint NPCs' tier-1
 * card defs carry an unlockCondition. Adding the right
 * condition to 90 card files is per-card canon-judgment work
 * (which phase gates which imprint) and risks the card-schema
 * parity tests if done blindly. So this gate is RATCHETED:
 * the gap is tracked, allowed to be non-zero, and may only
 * SHRINK. A future PR that adds unlockConditions tightens it;
 * a regression (removing one) fails the gate.
 *
 * Declared = 18 imprint NPCs. Implemented = NPCs whose tier-1
 * imprint card definition file declares an `unlockCondition`.
 * The check reads the registry slugs and probes the card-def
 * source files for the `unlockCondition` token.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { IMPRINT_REGISTRY } from "../../tcg-core/rewards/imprintRegistry";
import type { RawParityCount } from "../types";

const IMPRINT_DEF_DIR = join(
  process.cwd(),
  "apps/shared/tcg-core/cards/definitions/imprint",
);

export function checkImprintCardsCarryUnlockCondition(): RawParityCount {
  const declared = IMPRINT_REGISTRY.length;
  const missing: string[] = [];
  let implemented = 0;

  for (const npc of IMPRINT_REGISTRY) {
    let src = "";
    try {
      src = readFileSync(join(IMPRINT_DEF_DIR, `${npc.slug}.ts`), "utf-8");
    } catch {
      missing.push(`imprint '${npc.slug}' — card-def file not found`);
      continue;
    }
    if (src.includes("unlockCondition")) {
      implemented += 1;
    } else {
      missing.push(
        `imprint '${npc.slug}' (${npc.displayName}) tier cards carry no ` +
          `unlockCondition — engine cannot gate first-summon to canonical phase`,
      );
    }
  }

  return { declared, implemented, missing };
}
