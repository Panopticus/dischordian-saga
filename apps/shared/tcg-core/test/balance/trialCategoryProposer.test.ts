/**
 * Trial-category proposer summary test.
 *
 * Runs the §5.8 trial-category proposer over ALL_CARD_DEFINITIONS
 * and prints a per-faction summary + a count of cards whose
 * heuristic produced an empty category set (those need manual
 * categorization before §5.8 ships).
 *
 * The test never fails on category counts — the proposer's
 * output is review material, not a correctness invariant. The
 * test only fails if the proposer itself crashes or returns
 * malformed output.
 *
 * See docs/production/act1/authority-trial-phase-mechanic.md
 * §7 item 1 for the rollout plan this test supports.
 */
import { describe, it, expect } from "vitest";
import {
  proposeAll,
  summarizeByFaction,
} from "../../balance/trialCategoryProposer";

describe("trial-category proposer", () => {
  it("returns one proposal per card with a sorted category array", () => {
    const proposals = proposeAll();
    expect(proposals.length).toBeGreaterThan(0);
    for (const p of proposals) {
      expect(p.id).toBeTruthy();
      // Sorted check: each category should be lexically >= the previous.
      for (let i = 1; i < p.proposed.length; i++) {
        expect(p.proposed[i] >= p.proposed[i - 1]).toBe(true);
      }
    }
  });

  it("emits a per-faction summary (informational)", () => {
    const proposals = proposeAll();
    const summaries = summarizeByFaction(proposals);

    /* eslint-disable no-console */
    console.log(`\n=== TRIAL-CATEGORY PROPOSER: ${proposals.length} cards ===\n`);
    const totalUncategorized = proposals.filter((p) => p.uncategorized).length;
    console.log(
      `Cards with no proposed category: ${totalUncategorized} ` +
        `(${Math.round((totalUncategorized * 100) / proposals.length)}%)\n`,
    );

    console.log("Per-faction breakdown:");
    console.log("─".repeat(100));
    console.log(
      "faction".padEnd(16) +
        "total".padStart(7) +
        "uncat".padStart(7) +
        "def".padStart(6) +
        "off".padStart(6) +
        "narr".padStart(6) +
        "evid".padStart(6) +
        "reac".padStart(6) +
        "conf".padStart(6),
    );
    console.log("─".repeat(100));
    for (const s of summaries) {
      console.log(
        s.faction.padEnd(16) +
          String(s.total).padStart(7) +
          String(s.uncategorized).padStart(7) +
          String(s.byCategory.defensive).padStart(6) +
          String(s.byCategory.offensive).padStart(6) +
          String(s.byCategory.narrative).padStart(6) +
          String(s.byCategory.evidence).padStart(6) +
          String(s.byCategory.reactive).padStart(6) +
          String(s.byCategory.confession).padStart(6),
      );
    }
    console.log("");
    /* eslint-enable no-console */

    // Sanity: the summary covers every proposal.
    const summed = summaries.reduce((acc, s) => acc + s.total, 0);
    expect(summed).toBe(proposals.length);
  });
});
