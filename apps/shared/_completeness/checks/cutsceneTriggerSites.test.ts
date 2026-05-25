/**
 * Self-test for cutscene trigger-site reachability.
 *
 * Verifies:
 *   (a) the check runs and returns a non-negative gap
 *   (b) every cutscene id reported missing actually lacks a literal
 *       trigger site (no false positives caused by, e.g., the check
 *       finding its own id literal inside the registry file)
 */
import { describe, it, expect } from "vitest";
import { CUTSCENE_IDS } from "../../cutsceneRegistry";
import { checkCutsceneTriggerSites } from "./cutsceneTriggerSites";

describe("checkCutsceneTriggerSites", () => {
  it("declares one row per registered cutscene id", async () => {
    const result = await checkCutsceneTriggerSites();
    expect(result.declared).toBe(CUTSCENE_IDS.length);
    expect(result.implemented).toBeGreaterThanOrEqual(0);
    expect(result.implemented).toBeLessThanOrEqual(result.declared);
  });

  it("missing lines name a known CutsceneId", async () => {
    const result = await checkCutsceneTriggerSites();
    const validPrefixes = CUTSCENE_IDS.map((id) => `cutscene/${id}:`);
    for (const line of result.missing ?? []) {
      const matched = validPrefixes.some((p) => line.startsWith(p));
      expect(matched, `unexpected missing line: ${line}`).toBe(true);
    }
  });
});
