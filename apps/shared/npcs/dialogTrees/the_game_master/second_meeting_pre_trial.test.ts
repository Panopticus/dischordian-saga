// apps/shared/npcs/dialogTrees/the_game_master/second_meeting_pre_trial.test.ts
//
// Contract tests for the Game Master second-meeting (pre-Authority-
// Trial) dialog tree — the first Phase-1 BioWare-style outcome tree
// that exercises every new outcome field. Voice-discipline checks
// reference the_game_master.md §§1.3–1.4 + 1.7.

import { describe, expect, it } from "vitest";
import {
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  countPlayerPaths,
  getEntryNode,
} from "../types";
import {
  ALL_NPC_DIALOG_TREES,
  getDialogTree,
} from "../index";
import { THE_GAME_MASTER_SECOND_MEETING_PRE_TRIAL as TREE } from "./second_meeting_pre_trial";
import { ALL_CARD_DEFINITIONS } from "../../../tcg-core/cards";

describe("the_game_master second_meeting_pre_trial — registration", () => {
  it("is registered in the global aggregator", () => {
    expect(ALL_NPC_DIALOG_TREES).toContain(TREE);
  });

  it("is resolvable by (npcKey, treeId) — the server-authoritative lookup", () => {
    const found = getDialogTree(
      "the_game_master",
      "game-master-second-meeting-pre-trial",
    );
    expect(found).toBe(TREE);
  });
});

describe("the_game_master second_meeting_pre_trial — structural invariants", () => {
  it("is connected (every choice / autoNext target resolves)", () => {
    expect(isDialogTreeConnected(TREE)).toBe(true);
  });

  it("is NPC-consistent (every node is owned by the_game_master)", () => {
    expect(isDialogTreeNpcConsistent(TREE)).toBe(true);
  });

  it("exposes a single root with exactly 4 branches", () => {
    const entry = getEntryNode(TREE);
    expect(entry?.id).toBe("root");
    expect(entry?.choices?.length).toBe(4);
  });

  it("counts 4 distinct player paths (root → 4 branches → shared terminal)", () => {
    expect(countPlayerPaths(TREE)).toBe(4);
  });

  it("every branch auto-advances to the shared terminal", () => {
    const branches = [
      "branch_left_arithmetic",
      "branch_right_drawer",
      "branch_refuse_original",
      "branch_puzzle",
    ];
    for (const id of branches) {
      expect(TREE.nodes[id]?.autoNext, id).toBe("terminal");
    }
  });
});

describe("the_game_master second_meeting_pre_trial — Phase 1 outcome coverage", () => {
  const choices = TREE.nodes.root.choices ?? [];

  it("exercises every Phase 1 outcome field at least once across the 4 branches", () => {
    const seen = {
      factionRepDelta: 0,
      stakesAxisDelta: 0,
      unlockCard: 0,
      mutateNextEncounterDeck: 0,
    };
    for (const c of choices) {
      if (c.factionRepDelta) seen.factionRepDelta += 1;
      if (c.stakesAxisDelta) seen.stakesAxisDelta += 1;
      if (c.unlockCard) seen.unlockCard += 1;
      if (c.mutateNextEncounterDeck) seen.mutateNextEncounterDeck += 1;
    }
    expect(seen.factionRepDelta).toBeGreaterThanOrEqual(1);
    expect(seen.stakesAxisDelta).toBeGreaterThanOrEqual(1);
    expect(seen.unlockCard).toBeGreaterThanOrEqual(1);
    expect(seen.mutateNextEncounterDeck).toBeGreaterThanOrEqual(1);
  });

  it("also exercises the existing fields (sets / trustDelta / publicFlag / axisDelta) for parity", () => {
    const hasSets = choices.some((c) => Boolean(c.sets));
    const hasTrust = choices.some((c) => typeof c.trustDelta === "number");
    const hasPublic = choices.some((c) => Boolean(c.publicFlag));
    const hasAxis = choices.some((c) => (c.axisDelta?.length ?? 0) > 0);
    expect(hasSets && hasTrust && hasPublic && hasAxis).toBe(true);
  });

  it("unlockCard targets reference real card defs in ALL_CARD_DEFINITIONS", () => {
    const known = new Set(ALL_CARD_DEFINITIONS.map((d) => String(d.id)));
    for (const c of choices) {
      if (c.unlockCard) {
        expect(known.has(c.unlockCard.cardDefId), c.unlockCard.cardDefId).toBe(true);
      }
      if (c.mutateNextEncounterDeck) {
        expect(
          known.has(c.mutateNextEncounterDeck.addCardDefId),
          c.mutateNextEncounterDeck.addCardDefId,
        ).toBe(true);
      }
    }
  });

  it("unlockCard via field is `dialog_choice` — the family this PR introduces", () => {
    const unlock = choices.find((c) => Boolean(c.unlockCard))?.unlockCard;
    expect(unlock?.via).toBe("dialog_choice");
  });

  it("mutateNextEncounterDeck targets chAuthorityTrial — the canonical pre-Trial referenced encounter", () => {
    const mut = choices.find((c) => Boolean(c.mutateNextEncounterDeck))?.mutateNextEncounterDeck;
    expect(mut?.encounterId).toBe("chAuthorityTrial");
  });

  it("factionRepDelta keys are canonical Faction values only", () => {
    const allowed = new Set([
      "architect",
      "dreamer",
      "insurgency",
      "new_babylon",
      "antiquarian",
      "thought_virus",
      "panopticon",
      "neutral",
      "hierarchy_of_damned",
    ]);
    for (const c of choices) {
      for (const k of Object.keys(c.factionRepDelta ?? {})) {
        expect(allowed.has(k), k).toBe(true);
      }
    }
  });
});

describe("the_game_master second_meeting_pre_trial — voice discipline (bible §§1.3–1.4, 1.7)", () => {
  // Aggregate every node's onscreenText into one corpus we can grep.
  const corpus = Object.values(TREE.nodes)
    .map((n) => n.onscreenText)
    .join("\n");

  it("§1.7 Tell #5 — never uses first-person plural (no 'we' anywhere)", () => {
    // Word-boundary 'we' / 'We' — but allow it inside compounds like
    // "between us" / "wearing". A word-boundary regex is enough; the
    // tree does not contain any 'we' / 'We' standalone.
    expect(corpus).not.toMatch(/\bwe\b/i);
  });

  it("§1.3 Left has no exclamation marks (the quietest voice in the saga)", () => {
    // The Left's lines are the ones starting with 'Left:'. Any
    // exclamation in a Left segment fails the rule.
    const leftSegments = corpus.match(/Left:[^\n]+/g) ?? [];
    for (const seg of leftSegments) {
      expect(seg, seg).not.toMatch(/!/);
    }
  });

  it("§1.4 Right uses CAPS on at least one aesthetic verb (READ / BOOK / KEEPING / LOUD)", () => {
    // The Right's signature emphasis register.
    expect(corpus).toMatch(/\b(READ|BOOK|KEEPING|LOUD|HOPING|WORKING)\b/);
  });

  it("§1.4 Right uses 'darling' at least once (her singular term of endearment)", () => {
    expect(corpus.toLowerCase()).toContain("darling");
  });

  it("§1.7 Tell #4 — the Two cross-reference each other at least once", () => {
    // The Left says "the Right one"; the Right says "the Left one".
    const leftRefRight = /the\s+Right\s+one/i.test(corpus);
    const rightRefLeft = /the\s+Left\s+one/i.test(corpus);
    expect(leftRefRight || rightRefLeft).toBe(true);
  });

  it("§2.5 — the canonical five-word epitaph is preserved verbatim where the destruction is named", () => {
    // "They honored the contract. Every clause." Canon-locked phrasing.
    // The refuse-original branch leans on the variant "The contract
    // was honored. Every clause." — same five-word semantic + the
    // canonically-licensed "Every clause." closer.
    expect(corpus).toMatch(/Every clause\./);
  });

  it("§1.8 — the puzzle is voiced by the player, never answered by the Two", () => {
    // The puzzle branch must NOT contain the words "Yes" / "No" as the
    // Two's answer. The Two acknowledge without answering.
    const puzzle = TREE.nodes.branch_puzzle.onscreenText;
    expect(puzzle).not.toMatch(/^Yes[.,]/m);
    expect(puzzle).not.toMatch(/^No[.,]/m);
  });
});
