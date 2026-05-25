/**
 * Cutscene trigger-site parity check.
 *
 * Complements {@link checkCutsceneComponents} which checks that a
 * component or registry entry *exists* for each ANIMATED_CUTSCENES.md
 * named beat. This check answers the next question on the reachability
 * chain: does the engine ever *fire* it?
 *
 * For every {@link CutsceneId} in {@link CUTSCENE_REGISTRY}, at least
 * one file under `apps/client/src` or `apps/shared` (other than
 * cutsceneRegistry.ts itself) must reference the id as a string
 * literal — `playCutscene("cutscene_awakening")`,
 * `cutsceneId: "cutscene_awakening"`, narrative-flag triggers that
 * name the id, etc. A cutscene declared in the registry with no
 * trigger site is unreachable at runtime regardless of how complete
 * the component is.
 *
 * Hard-parity / ratchet candidate: many registered cutscenes already
 * have working triggers (the prelude, breaking-point, prestige reset);
 * any unreachable id is a real gap.
 */
import * as path from "node:path";
import { CUTSCENE_REGISTRY, CUTSCENE_IDS } from "../../cutsceneRegistry";
import {
  REPO_ROOT,
  hasLiteralStringReference,
} from "../scanner";
import type { RawParityCount } from "../types";

const CLIENT_DIR = path.join(REPO_ROOT, "apps/client/src");
const SHARED_DIR = path.join(REPO_ROOT, "apps/shared");
const CUTSCENE_REGISTRY_PATH = path.join(
  REPO_ROOT,
  "apps/shared/cutsceneRegistry.ts",
);

export function checkCutsceneTriggerSites(): RawParityCount {
  const missing: string[] = [];
  for (const id of CUTSCENE_IDS) {
    const def = CUTSCENE_REGISTRY[id];
    const inClient = hasLiteralStringReference(CLIENT_DIR, id);
    const inShared = hasLiteralStringReference(SHARED_DIR, id, {
      excludeAbs: CUTSCENE_REGISTRY_PATH,
    });
    if (!inClient && !inShared) {
      missing.push(
        `cutscene/${id}: registry entry exists (${def.title}) but no ` +
          `string-literal trigger site found in apps/client/src or apps/shared. ` +
          `Trigger flag "${def.triggerFlag}" never names this id — the cutscene ` +
          `is unreachable at runtime.`,
      );
    }
  }
  return {
    declared: CUTSCENE_IDS.length,
    implemented: CUTSCENE_IDS.length - missing.length,
    missing,
  };
}
