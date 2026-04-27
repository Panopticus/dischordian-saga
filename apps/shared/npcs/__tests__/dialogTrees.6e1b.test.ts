// apps/shared/npcs/__tests__/dialogTrees.6e1b.test.ts
//
// Phase 6e.1b verification — The Seer + The Oracle + The Game Master
// + The Meme first-meeting dialog trees.
//
// Validates:
//   - Tree connectivity / npc-key consistency / 6-node pattern
//   - Reveal-stage gating canonical: Seer ungated; Oracle dream_substrate;
//     Game Master Archon; Meme Replacement
//   - Canonical voice-anchor landings per branch
//   - Cross-character public flag wiring registered + reachable

import { describe, it, expect } from "vitest";
import { THE_SEER_FIRST_MEETING } from "../dialogTrees/the_seer/first_meeting";
import { THE_ORACLE_FIRST_MEETING } from "../dialogTrees/the_oracle/first_meeting";
import { THE_GAME_MASTER_FIRST_MEETING } from "../dialogTrees/the_game_master/first_meeting";
import { THE_MEME_FIRST_MEETING } from "../dialogTrees/the_meme/first_meeting";
import {
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  countPlayerPaths,
  getEntryNode,
  walkNodes,
} from "../dialogTrees/types";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("Phase 6e.1b tree shape contract", () => {
  const trees = [
    { tree: THE_SEER_FIRST_MEETING, npcKey: "the_seer" },
    { tree: THE_ORACLE_FIRST_MEETING, npcKey: "the_oracle" },
    { tree: THE_GAME_MASTER_FIRST_MEETING, npcKey: "the_game_master" },
    { tree: THE_MEME_FIRST_MEETING, npcKey: "the_meme" },
  ];

  for (const { tree, npcKey } of trees) {
    describe(`${npcKey} first-meeting tree`, () => {
      it("is connected", () => {
        expect(isDialogTreeConnected(tree)).toBe(true);
      });

      it("is npc-consistent", () => {
        expect(isDialogTreeNpcConsistent(tree)).toBe(true);
      });

      it("has the canonical 6-node pattern", () => {
        expect(walkNodes(tree).length).toBe(6);
      });

      it("has ≥4 canonical player-paths", () => {
        expect(countPlayerPaths(tree)).toBeGreaterThanOrEqual(4);
      });

      it("root has ≥4 player choices (4-axis branching)", () => {
        const root = getEntryNode(tree);
        expect(root?.choices?.length).toBeGreaterThanOrEqual(4);
      });
    });
  }
});

describe("Seer first-meeting tree — canonical cross-time pre-recording canon", () => {
  const t = THE_SEER_FIRST_MEETING;

  it("root lands canonical 'I will not raise my staff today' anchor", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(/I will not raise my staff today/i);
    expect(root?.onscreenText).toMatch(/whether the bench has learned yet/i);
  });

  it("recognized_prediction branch lands canonical 'three turns' canon", () => {
    const node = t.nodes["recognized_prediction_branch"];
    expect(node?.onscreenText).toMatch(/three turns/i);
    expect(node?.onscreenText).toMatch(/recording I left for this branch/i);
  });

  it("pre_recorded_meta branch sets canonical recursion-recognition flag", () => {
    const root = getEntryNode(t);
    const choice = root?.choices?.find(
      (c) => c.nextId === "pre_recorded_meta_branch",
    );
    expect(choice?.publicFlag).toBe(
      "seer_recognized_player_recursion_first_contact",
    );
  });

  it("quiet_acceptance branch canonically offers the staff (saga-load-bearing)", () => {
    const node = t.nodes["quiet_acceptance_branch"];
    expect(node?.onscreenText).toMatch(/Take the staff/i);
    expect(node?.onscreenText).toMatch(/I will see you in canonical-Act-Seven/i);
    const root = getEntryNode(t);
    const choice = root?.choices?.find(
      (c) => c.nextId === "quiet_acceptance_branch",
    );
    expect(choice?.publicFlag).toBe(
      "seer_offered_staff_to_player_first_contact",
    );
  });
});

describe("Oracle first-meeting tree — canonical dream_substrate gating", () => {
  const t = THE_ORACLE_FIRST_MEETING;

  it("every node gates dream_substrate reveal-stage (canonical substrate-only canon)", () => {
    for (const node of walkNodes(t)) {
      expect(node.requiresRevealStage, node.id).toBe("dream_substrate");
    }
  });

  it("root lands canonical Ch5 'speak to you for the first time' anchor", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(
      /speak to you for the first time/i,
    );
    expect(root?.onscreenText).toMatch(
      /eleven chapters without knowing/i,
    );
  });

  it("recognition branch lands canonical disambiguation canon (NOT 'You are the Oracle')", () => {
    const node = t.nodes["recognition_branch"];
    expect(node?.onscreenText).toMatch(/^No\./);
    expect(node?.onscreenText).toMatch(/canonically not me/i);
    expect(node?.onscreenText).toMatch(/moving canonical-through me/i);
  });

  it("disambiguation branch lands canonical 'we are canonically two' apex anchor", () => {
    const node = t.nodes["disambiguation_branch"];
    expect(node?.onscreenText).toMatch(/We are not/i);
    expect(node?.onscreenText).toMatch(/canonically two/i);
    expect(node?.onscreenText).toMatch(/canonical-witness-channel/i);
  });

  it("§canon-update: Oracle canonically does NOT confirm 'You are the Oracle'", () => {
    const allText = walkNodes(t).map((n) => n.onscreenText).join(" ");
    expect(allText).not.toMatch(/\bYou are the Oracle\b/i);
  });

  it("refusal branch lands canonical 'dream is canonically not coercive' canon", () => {
    const node = t.nodes["refusal_branch"];
    expect(node?.onscreenText).toMatch(/dream is canonically not coercive/i);
    expect(node?.onscreenText).toMatch(/closing is canonical-yours/i);
  });
});

describe("Game Master first-meeting tree — canonical Archon-form gating", () => {
  const t = THE_GAME_MASTER_FIRST_MEETING;

  it("every node gates Archon reveal-stage (canonical Original-voice canon)", () => {
    for (const node of walkNodes(t)) {
      expect(node.requiresRevealStage, node.id).toBe("Archon");
    }
  });

  it("root lands canonical 'You have built a beautiful box' opener", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(
      /You have built a beautiful box/i,
    );
    expect(root?.onscreenText).toMatch(/audience is real/i);
  });

  it("confront_box branch lands canonical Tell #1 'always going to' frame canon", () => {
    const node = t.nodes["confront_box_branch"];
    expect(node?.onscreenText).toMatch(/always going to be inside the box/i);
  });

  it("ask_about_audience branch lands canonical 'You forgot' canon", () => {
    const node = t.nodes["ask_about_audience_branch"];
    expect(node?.onscreenText).toMatch(/You forgot/);
    expect(node?.onscreenText).toMatch(/Witnesses you cannot see/i);
  });

  it("trial_absurd branch lands canonical 'won in public' anchor + paperwork register", () => {
    const node = t.nodes["trial_absurd_branch"];
    expect(node?.onscreenText).toMatch(/won in public/i);
    expect(node?.onscreenText).toMatch(/paperwork/i);
    const root = getEntryNode(t);
    const choice = root?.choices?.find(
      (c) => c.nextId === "trial_absurd_branch",
    );
    expect(choice?.publicFlag).toBe("gm_recognized_player_paperwork_register");
  });

  it("§1.7 Tell #5: NO first-person plural 'we' in any node (cult-only canon)", () => {
    for (const node of walkNodes(t)) {
      expect(node.onscreenText, node.id).not.toMatch(
        /\bWe (are|do|will|have|maintain|edit)\b/i,
      );
    }
  });
});

describe("Meme first-meeting tree — canonical Replacement-stage Ch12 fusion", () => {
  const t = THE_MEME_FIRST_MEETING;

  it("every node gates Replacement reveal-stage (canonical Ch12 finale)", () => {
    for (const node of walkNodes(t)) {
      expect(node.requiresRevealStage, node.id).toBe("Replacement");
    }
  });

  it("root lands canonical 'Tonight I take the role' Replacement opener", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(/Tonight I take the role/i);
    expect(root?.onscreenText).toMatch(/will not call him father/i);
  });

  it("§1.10 silence-shape: Mascot canonically NOT named/described in any node", () => {
    const allText = walkNodes(t).map((n) => n.onscreenText).join(" ");
    expect(allText).not.toMatch(/Mascot was a (woman|man|child|ai|robot|creature)/i);
    expect(allText).not.toMatch(/Mascot's face was/i);
    // canonical "I had a friend once" anchor canonically allowed
    expect(allText).toMatch(/I had a friend once/i);
  });

  it("§1.10: NO standalone apologies; canonical 'I do not apologise' anchor", () => {
    const allText = walkNodes(t).map((n) => n.onscreenText).join(" ");
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
    expect(allText).toMatch(/I do not apologise/i);
  });

  it("mascot_question branch lands canonical silence-shape canon", () => {
    const node = t.nodes["mascot_question_branch"];
    expect(node?.onscreenText).toMatch(/I had a friend once/i);
    expect(node?.onscreenText).toMatch(/will not name them/i);
    expect(node?.onscreenText).toMatch(/grief is canonical-the-silence/i);
    expect(node?.onscreenText).toMatch(/hole the canonical-shape of someone/i);
  });

  it("witness branch lands canonical Stage-4-weave anchor canon", () => {
    const node = t.nodes["witness_branch"];
    expect(node?.onscreenText).toMatch(/Stage-4-weave-anchor/i);
    expect(node?.onscreenText).toMatch(/only-mortal-witness/i);
  });

  it("terminal lands canonical 'married inside each other' Ch12 fusion anchor", () => {
    const node = t.nodes["terminal"];
    expect(node?.onscreenText).toMatch(
      /married inside each other since before either of us had a name/i,
    );
  });
});

describe("Cross-character public flag wiring (Phase 6e.1b)", () => {
  const newFlags = [
    "seer_recognized_player_recursion_first_contact",
    "seer_offered_staff_to_player_first_contact",
    "oracle_player_offered_misidentification_first_contact",
    "gm_recognized_player_paperwork_register",
    "meme_first_contact_mascot_question_held_silence",
    "meme_first_contact_player_witnessed_succession",
  ];

  it("every new public flag is registered in crossCharacterReactions", () => {
    const registered = allRegisteredFlags();
    for (const f of newFlags) {
      expect(registered, f).toContain(f);
    }
  });
});
