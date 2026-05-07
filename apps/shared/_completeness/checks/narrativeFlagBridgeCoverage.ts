/**
 * B7 — Narrative→TCG flag-bridge coverage parity check.
 *
 * `apps/shared/tcg-core/rewards/expansionUnlockService.ts` reads two
 * families of narrative flags to gate `CardUnlockCondition`:
 *
 *   - `act_${n}_complete`         (n = 1..7)
 *   - `secret_act_${n}_revealed`  (n = 1..7)
 *
 * For each flag name, at least one `setNarrativeFlag("<name>", ...)`
 * call must exist somewhere in `apps/`. Without a writer, every card
 * gated on that flag is permanently locked — exactly the bug the
 * gate exists to surface.
 *
 * Mirrors the existing `dialogTemplatingCoverage.test.ts` pattern
 * (every `{if FLAG}` template needs a producer). Hard parity in
 * principle; ratcheted at landing because the secret-reveal half is
 * currently unwired (7 missing writers).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

const APPS_DIR = path.join(REPO_ROOT, "apps");

/**
 * The exact set of flag names the unlock service depends on. Hard-coded
 * because the names are constructed by template-string in
 * expansionUnlockService.ts and a regex on that file would only see
 * the templates, not the materialized names. If the unlock service
 * adds new flag families, they must be enumerated here too.
 */
function unlockServiceFlagNames(): string[] {
  const names: string[] = [];
  for (const n of [1, 2, 3, 4, 5, 6, 7] as const) {
    names.push(`act_${n}_complete`);
    names.push(`secret_act_${n}_revealed`);
  }
  return names;
}

export function checkNarrativeFlagBridgeCoverage(): RawParityCount {
  const required = unlockServiceFlagNames();

  // Same producer regex that dialogTemplatingCoverage.test.ts uses,
  // for symmetry — moves with that test if either updates.
  const literalRe =
    /(?:setNarrativeFlag|flagsToSet\.push)\(\s*["']([a-z][a-zA-Z0-9_:]+)["']/g;

  const produced = new Set<string>();
  for (const file of walkSourceFiles(APPS_DIR)) {
    const src = fs.readFileSync(file, "utf-8");
    let m: RegExpExecArray | null;
    while ((m = literalRe.exec(src)) !== null) {
      produced.add(m[1]);
    }
  }

  const missing = required.filter((name) => !produced.has(name));

  return {
    declared: required.length,
    implemented: required.length - missing.length,
    missing: missing.map(
      (name) =>
        `${name}: read by expansionUnlockService.ts; no \`setNarrativeFlag("${name}", ...)\` writer found in apps/`,
    ),
  };
}
