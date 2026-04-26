/**
 * Soft FIGHTER_INTROS length guard (V3 §4D follow-up).
 *
 * The Writing Audit V2 prescribed "fight-context lines stay ≤ 25 words"
 * (Category D). V3 §4D refined the rule:
 *
 *   - Per-Act `opponentMidMatchEarly/Mid/Late`: ≤ 25 words HARD,
 *     enforced by per-act dialog tests already.
 *   - FIGHTER_INTROS `quote`: target ≤ 25, allow up to ~35 for the
 *     virus-interruption pattern (Source's intro quote is the
 *     canonical exception — its `— ALL WILL BE — / — CONSUMED —`
 *     interruptions push it to 33 words by structural necessity).
 *
 * This test enforces the upper soft cap. It walks every entry in
 * FIGHTER_INTROS, counts words in `quote`, and fails if any
 * non-exempt fighter's quote exceeds 35 words. The `source` fighter
 * is registered as the sole exempt id; any future virus-interruption
 * line on a different fighter would need to be added to the
 * `LENGTH_EXEMPT_FIGHTER_IDS` set with a comment explaining why.
 */
import { describe, it, expect } from "vitest";
import { FIGHTER_INTROS } from "../client/src/game/cinematicDesign";

const SOFT_CAP_WORDS = 35;

/** fighterIds whose `quote` is allowed to exceed SOFT_CAP_WORDS.
 *
 *  Currently empty — every fighter intro fits under 35 words, including
 *  the Source's virus-interruption line ("— ALL WILL BE — / — CONSUMED —")
 *  which lands at ~29 words after the V3 §4B.1 application. The
 *  mechanism is preserved for future virus-interruption-pattern lines
 *  on other fighters that genuinely can't compress below the cap.
 *
 *  Add a fighterId here ONLY with a per-line comment that explains
 *  why the structure forces the line longer. The "actually exceeds
 *  the soft cap" sanity check below ensures dead exemptions don't
 *  linger. */
const LENGTH_EXEMPT_FIGHTER_IDS: ReadonlySet<string> = new Set([]);

function countWords(text: string): number {
  // Treat em-dashes as word separators so "the — ALL WILL BE — floor"
  // counts as 5 words, not 1. Same for the explicit em-dash spelled
  // " — ".
  return text
    .replace(/—/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

describe("FIGHTER_INTROS length guard", () => {
  it("every fighter intro quote is at most 35 words (or registered as exempt)", () => {
    const violations: Array<{ fighterId: string; words: number; quote: string }> = [];
    for (const intro of FIGHTER_INTROS) {
      const words = countWords(intro.quote);
      if (words > SOFT_CAP_WORDS && !LENGTH_EXEMPT_FIGHTER_IDS.has(intro.fighterId)) {
        violations.push({ fighterId: intro.fighterId, words, quote: intro.quote });
      }
    }
    expect(
      violations,
      `Add the fighter to LENGTH_EXEMPT_FIGHTER_IDS with a comment if the structure requires the length, ` +
        `or trim the quote.\nViolations:\n${violations
          .map(
            (v) => `  ${v.fighterId} (${v.words} words): "${v.quote}"`,
          )
          .join("\n")}`,
    ).toEqual([]);
  });

  it("every registered exempt fighter actually exceeds the soft cap (no stale exemptions)", () => {
    // If a fighterId is in LENGTH_EXEMPT_FIGHTER_IDS but its quote
    // already fits under SOFT_CAP_WORDS, the exemption is dead weight
    // and should be removed. This test fails-closed when someone
    // shortens an exempt quote without trimming the exempt set.
    for (const exemptId of LENGTH_EXEMPT_FIGHTER_IDS) {
      const intro = FIGHTER_INTROS.find((i) => i.fighterId === exemptId);
      if (!intro) continue; // Stale exemption for a deleted fighter.
      const words = countWords(intro.quote);
      expect(
        words,
        `${exemptId} is registered as length-exempt but only has ${words} words — ` +
          `remove the exemption (it's no longer needed).`,
      ).toBeGreaterThan(SOFT_CAP_WORDS);
    }
  });
});
