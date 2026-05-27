// apps/shared/npcs/dialogTrees/the_game_master/mid_trial_intercession.test.ts
//
// Contract tests for the Game Master mid-Trial Intercession — Phase
// A6 of the narrative-spine adoption plan. FIRST consumer of the
// in-match dialog overlay system. Pins:
//   • registration in the global aggregator
//   • structural shape (3 entry bands + shared terminal)
//   • Phase 1 outcome coverage on every choice (stakesAxisDelta or
//     trustDelta — every choice authors at least one outcome)
//   • Voice discipline per the_game_master.md §§1.3 + 1.4 + 1.7
//     (Tell #4 cross-acknowledgment, Tell #5 no first-person plural,
//     Left no exclamations, Right CAPS aesthetic verbs + "darling"
//     once per band)
//   • Canonical band-shift in Right's CAPS verb (READING / HOPING
//     / WORKING) — the "cool" thing the player feels.

import { describe, expect, it } from "vitest";
import {
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  countPlayerPaths,
} from "../types";
import { ALL_NPC_DIALOG_TREES, getDialogTree } from "../index";
import { THE_GAME_MASTER_MID_TRIAL_INTERCESSION as TREE } from "./mid_trial_intercession";

describe("the_game_master mid_trial_intercession — registration", () => {
  it("is registered in the global aggregator", () => {
    expect(ALL_NPC_DIALOG_TREES).toContain(TREE);
  });

  it("is resolvable via (npcKey, treeId) — the canonical server-authoritative lookup", () => {
    expect(
      getDialogTree(
        "the_game_master",
        "game-master-mid-trial-intercession",
      ),
    ).toBe(TREE);
  });
});

describe("the_game_master mid_trial_intercession — structural invariants", () => {
  it("is connected (every choice / autoNext target resolves)", () => {
    expect(isDialogTreeConnected(TREE)).toBe(true);
  });

  it("is NPC-consistent (every node is owned by the_game_master)", () => {
    expect(isDialogTreeNpcConsistent(TREE)).toBe(true);
  });

  it("has three entry-band nodes plus a shared terminal", () => {
    expect(TREE.nodes.winning_band_entry).toBeDefined();
    expect(TREE.nodes.neutral_band_entry).toBeDefined();
    expect(TREE.nodes.losing_band_entry).toBeDefined();
    expect(TREE.nodes.terminal_filed).toBeDefined();
    // Total nodes: 3 entries + 1 terminal = 4.
    expect(Object.keys(TREE.nodes).length).toBe(4);
  });

  it("every band routes its choices to terminal_filed", () => {
    for (const band of ["winning_band_entry", "neutral_band_entry", "losing_band_entry"]) {
      const node = TREE.nodes[band];
      for (const choice of node.choices ?? []) {
        expect(choice.nextId, `${band}.${choice.label}`).toBe("terminal_filed");
      }
    }
  });

  it("per-band choice budget is 2 + 3 + 2 = 7 distinct player picks across the three bands", () => {
    // countPlayerPaths only walks from the default entry node;
    // here we count choices directly across the three band entries
    // since the narrative hook on chAuthorityTrial selects which
    // band the player enters at.
    const total = ["winning_band_entry", "neutral_band_entry", "losing_band_entry"]
      .map((id) => TREE.nodes[id].choices?.length ?? 0)
      .reduce((a, b) => a + b, 0);
    expect(total).toBe(7);
    // Sanity: default entry (winning band) has 2 choices → 2 paths.
    expect(countPlayerPaths(TREE)).toBe(2);
  });
});

describe("the_game_master mid_trial_intercession — Phase 1 outcome coverage", () => {
  const allChoices = ["winning_band_entry", "neutral_band_entry", "losing_band_entry"].flatMap(
    (id) => TREE.nodes[id].choices ?? [],
  );

  it("every choice authors at least one outcome (stakesAxisDelta OR trustDelta OR publicFlag)", () => {
    for (const c of allChoices) {
      const hasOutcome =
        c.stakesAxisDelta !== undefined ||
        c.trustDelta !== undefined ||
        c.publicFlag !== undefined;
      expect(hasOutcome, c.label).toBe(true);
    }
  });

  it("public_witness axis is the ONLY stakes axis exercised this slice", () => {
    // Per A4 design decision: chAuthorityTrial declares stakesMode
    // with public_witness only (verdict-axis adoption deferred to
    // the trialMode→stakesMode migration). The tree must not author
    // verdict-axis stakes that would silently drop.
    for (const c of allChoices) {
      if (c.stakesAxisDelta) {
        for (const axis of Object.keys(c.stakesAxisDelta)) {
          expect(axis, `${c.label} authors axis: ${axis}`).toBe("public_witness");
        }
      }
    }
  });

  it("the losing-band Confession choice carries the canonical §5.7 divergence (public_witness -3)", () => {
    const confessChoice = TREE.nodes.losing_band_entry.choices?.find(
      (c) => c.label === "Voice the confession.",
    );
    expect(confessChoice?.stakesAxisDelta?.public_witness).toBe(-3);
    // It also mints the public flag for cross-NPC reactivity.
    expect(confessChoice?.publicFlag).toBe("gm_player_voiced_confession_at_losing");
  });
});

describe("the_game_master mid_trial_intercession — voice discipline (bible §§1.3 + 1.4 + 1.7)", () => {
  // Aggregate every node's onscreenText into one corpus for the
  // pattern probes.
  const corpus = Object.values(TREE.nodes)
    .map((n) => n.onscreenText)
    .join("\n");

  // Per-band corpora for band-specific assertions.
  const winningText = TREE.nodes.winning_band_entry.onscreenText;
  const neutralText = TREE.nodes.neutral_band_entry.onscreenText;
  const losingText = TREE.nodes.losing_band_entry.onscreenText;

  it("§1.7 Tell #5 — no first-person plural ('we') anywhere", () => {
    expect(corpus).not.toMatch(/\bwe\b/i);
  });

  it("§1.3 Left has no exclamation marks (quietest voice in the saga)", () => {
    // Walk every node, extract Left segments only, assert no '!'.
    for (const node of Object.values(TREE.nodes)) {
      const leftSegments = node.onscreenText.match(/Left:[^\n]+/g) ?? [];
      for (const seg of leftSegments) {
        expect(seg, seg).not.toMatch(/!/);
      }
    }
  });

  it("§1.4 Right uses 'darling' exactly once per choice-band (not in the terminal)", () => {
    // Each band's Right segment must say "darling" once. The
    // terminal is shared and intentionally does NOT use "darling"
    // (the Right is reflective, not addressing the player as a
    // single audience member at the close).
    for (const band of [winningText, neutralText, losingText]) {
      const matches = band.toLowerCase().match(/\bdarling\b/g) ?? [];
      expect(matches.length).toBe(1);
    }
    expect(TREE.nodes.terminal_filed.onscreenText.toLowerCase()).not.toContain("darling");
  });

  it("§1.4 Right uses band-specific CAPS aesthetic verb: READING / HOPING / WORKING", () => {
    expect(winningText).toMatch(/\bREADING\b/);
    expect(neutralText).toMatch(/\bHOPING\b/);
    expect(losingText).toMatch(/\bWORKING\b/);
  });

  it("§1.7 Tell #4 — every band cross-acknowledges the other Game Master", () => {
    // The Left names "the Right one" or the Right names "the Left
    // one" at least once per band.
    for (const band of [winningText, neutralText, losingText]) {
      const refsRight = /the\s+Right\s+one/i.test(band);
      const refsLeft = /the\s+Left\s+one/i.test(band);
      expect(refsRight || refsLeft).toBe(true);
    }
  });

  it("§2.5 — the canonical 'Every clause.' epitaph variant lands in the terminal", () => {
    expect(TREE.nodes.terminal_filed.onscreenText).toContain("Every clause");
  });

  it("first_meeting tree's signature closer ('Every move enters the public record') is preserved verbatim in the mid-Trial terminal — the player feels the Two reading from the same book", () => {
    expect(TREE.nodes.terminal_filed.onscreenText).toContain(
      "Every move enters the public record",
    );
  });
});
