/**
 * Seven Seals runtime parity check.
 *
 * Asserts that the seven-seals spine has runtime, not just data:
 *
 *   1. `apps/shared/sevenSeals.ts` declares all 7 seals in order with
 *      the expected horseman bindings.
 *   2. Each seal carries a non-empty `fallSummary` (one-line gameplay
 *      summary, surfaced in the World Tapestry tooltip).
 *   3. Seal IV / V declare a `unlocksYearly` for the calendar override.
 *
 * Hard parity. Adding an 8th seal or breaking the I–IV horseman
 * mapping is a structural change that should fail loudly.
 *
 * The runtime side (`sealStateService.ts` derivation, ripple-engine
 * `seal_broken` emit, mystery-seeder seal-tier gate) is audited by
 * the woven-system ripple-coverage check, not here — this row is the
 * canonical-data row.
 */
import { SEVEN_SEALS } from "../../sevenSeals";
import type { RawParityCount } from "../types";

export function checkSevenSealRuntime(): RawParityCount {
  const checks: Array<[string, boolean]> = [];

  checks.push(["seven_seals.length === 7", SEVEN_SEALS.length === 7]);
  for (let n = 1; n <= 7; n++) {
    const seal = SEVEN_SEALS[n - 1];
    checks.push([`seal[${n}].num === ${n}`, seal?.num === n]);
    checks.push([`seal[${n}].act === ${n}`, seal?.act === n]);
    checks.push([
      `seal[${n}].fallSummary non-empty`,
      typeof seal?.fallSummary === "string" && seal.fallSummary.length > 10,
    ]);
  }
  checks.push(["seal[1].horseman === 'conquest'", SEVEN_SEALS[0]?.horseman === "conquest"]);
  checks.push(["seal[2].horseman === 'war'", SEVEN_SEALS[1]?.horseman === "war"]);
  checks.push(["seal[3].horseman === 'famine'", SEVEN_SEALS[2]?.horseman === "famine"]);
  checks.push(["seal[4].horseman === 'death'", SEVEN_SEALS[3]?.horseman === "death"]);
  checks.push([
    "seal[4].unlocksYearly === 'severance'",
    SEVEN_SEALS[3]?.unlocksYearly === "severance",
  ]);
  checks.push([
    "seal[5].unlocksYearly === 'memorial_day'",
    SEVEN_SEALS[4]?.unlocksYearly === "memorial_day",
  ]);

  const missing = checks.filter(([, ok]) => !ok).map(([label]) => label);
  return {
    declared: checks.length,
    implemented: checks.length - missing.length,
    missing,
  };
}
