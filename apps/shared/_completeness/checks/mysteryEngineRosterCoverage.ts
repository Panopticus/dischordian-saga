/**
 * Phase I6 — mysteryEngineRosterCoverage parity check.
 *
 * The MYSTERY_DEFINITIONS array in apps/shared/episodeMysteries.ts
 * is the saga's registry of authored Mystery Engine arcs. Per
 * the §XVI Next Wave (PR-7), the dreamer pre-authorized exactly
 * four spine arcs against the 14-bible roster (PR #632):
 * the_watcher, ith_rael, the_necromancer, syl_vex. The remaining
 * 6 of the 14 bibles hold canonical reference but do not yet
 * have authoring authorization. The §XVI completion target is
 * the four pre-authorized arcs all shipping registered in
 * MYSTERY_DEFINITIONS.
 *
 * This check is HARD PARITY — the registry MUST contain at
 * least the four §XVI-authorized arcs. If any are dropped,
 * §XVI's completion regresses.
 *
 * RATCHETED on the broader spine roster (the_degen, vex_solene,
 * wraith_calder, jericho_jones, game_master, the_seer): those
 * are accounted for separately and pre-date §XVI.
 */
import { MYSTERY_DEFINITIONS } from "../../episodeMysteries";
import type { RawParityCount } from "../types";

const SECTION_XVI_REQUIRED_ARCS = [
  "mystery.the_watcher",
  "mystery.ith_rael",
  "mystery.the_necromancer",
  "mystery.syl_vex",
  // Phase D continuation — the_collector + the_politician were in
  // §XVI's held-back bucket; the dreamer authorized each 2026-05-15
  // by directing Phase D work (dreamer canon-authority overrides
  // per the build plan §I.1a). Once authored + registered they
  // become hard-parity requirements like the four §XVI arcs.
  "mystery.the_collector",
  "mystery.the_politician",
  "mystery.zyr_koth",
  "mystery.riri_ahlia",
  // Final §XVI roster pair (PR-13) — completes the 14-bible
  // Mystery Engine roster's authorable set. the_human is
  // companion-tier (not arc-suitable); every other held-back
  // bible is now an authored arc.
  "mystery.varkul",
  "mystery.fenra",
] as const;

export function checkMysteryEngineRosterCoverage(): RawParityCount {
  const declared = SECTION_XVI_REQUIRED_ARCS.length;
  const registeredIds = new Set(MYSTERY_DEFINITIONS.map((m) => m.id as string));
  const missing = SECTION_XVI_REQUIRED_ARCS
    .filter((id) => !registeredIds.has(id))
    .map(
      (id) =>
        `§XVI required arc '${id}' is NOT registered in MYSTERY_DEFINITIONS — regression vs PR-2 / PR-2B / PR-7`,
    );
  return {
    declared,
    implemented: declared - missing.length,
    missing,
  };
}
