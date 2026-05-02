// apps/shared/npcs/__tests__/dialogTrees.6e1a.test.ts
//
// Phase 6e.1a verification — Nilmorg + Vex Solène + Hierophant
// first-meeting dialog trees.
//
// Validates per the existing dialog-tree lint contract:
//   - Tree connectivity (no dead-reference choices)
//   - npc-key consistency (no foreign-NPC nodes)
//   - 6-node canonical pattern (root + 4 branches + terminal)
//   - 4 player-paths per tree (1 per branch)
//   - Reveal-stage gating canonical: Vex eyes_of_reality / Hierophant
//     post_arena
//   - Canonical voice-anchors land per branch

import { describe, it, expect } from "vitest";
import { NILMORG_FIRST_CONTACT } from "../dialogTrees/nilmorg/first_meeting";
import { VEX_SOLENE_FIRST_MEETING } from "../dialogTrees/vex_solene/first_meeting";
import { WRAITH_CALDER_FIRST_MEETING } from "../dialogTrees/wraith_calder/first_meeting";
import {
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  countPlayerPaths,
  getEntryNode,
  walkNodes,
} from "../dialogTrees/types";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("Phase 6e.1a tree shape contract", () => {
  const trees = [
    { tree: NILMORG_FIRST_CONTACT, npcKey: "nilmorg" },
    { tree: VEX_SOLENE_FIRST_MEETING, npcKey: "vex_solene" },
    { tree: WRAITH_CALDER_FIRST_MEETING, npcKey: "wraith_calder" },
  ];

  for (const { tree, npcKey } of trees) {
    describe(`${npcKey} first-meeting tree`, () => {
      it("is connected (no dead-reference choices/autoNext)", () => {
        expect(isDialogTreeConnected(tree)).toBe(true);
      });

      it("is npc-consistent (every node owned by canonical npcKey)", () => {
        expect(isDialogTreeNpcConsistent(tree)).toBe(true);
      });

      it("has a canonical entry node", () => {
        expect(getEntryNode(tree)).not.toBeNull();
      });

      it("has at least the canonical 6-node pattern (root + 4 branches + terminal); some trees author additional D3 dreamer-aware nodes on top", () => {
        // Vex's tree carries 3 extra D3 dreamer-aware nodes
        // (dreamer_aware_root + mintwork + ledger_entry); Nilmorg
        // and Hierophant ship the canonical 6 today.
        expect(walkNodes(tree).length).toBeGreaterThanOrEqual(6);
      });

      it("has ≥4 canonical player-paths (1 per branch)", () => {
        expect(countPlayerPaths(tree)).toBeGreaterThanOrEqual(4);
      });

      it("root has ≥4 player choices (canonical 4-axis branching)", () => {
        const root = getEntryNode(tree);
        expect(root?.choices?.length).toBeGreaterThanOrEqual(4);
      });
    });
  }
});

describe("Nilmorg first-meeting tree — canonical voice", () => {
  const t = NILMORG_FIRST_CONTACT;

  it("root lands canonical 'BONES ARE FRESH' triplet-crescendo opener", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(/bones are fresh/i);
    expect(root?.onscreenText).toMatch(/HUNGRY/);
  });

  it("hype branch lands canonical broadcast-register caps + triplet", () => {
    const node = t.nodes["hype_branch"];
    expect(node?.onscreenText).toMatch(/contender/i);
    expect(node?.onscreenText).toMatch(/BLEEDING/);
  });

  it("one-on-one branch lands canonical 'I am working tonight' register (no caps)", () => {
    const node = t.nodes["one_on_one_branch"];
    expect(node?.onscreenText).toMatch(/I am working tonight/i);
    // canonical one-on-one register canonically caps-off
    const capsMatches = (node?.onscreenText ?? "").match(/\b[A-Z]{4,}\b/g) ?? [];
    expect(capsMatches.length).toBe(0);
  });

  it("lore branch lands canonical §1.7 silence-shape (mechanism canonically not disclosed)", () => {
    const node = t.nodes["lore_branch"];
    expect(node?.onscreenText).toMatch(/won't explain the mechanism/i);
    expect(node?.onscreenText).toMatch(/canonical-private/i);
  });

  it("refusal branch lands canonical §4.8 'Don't thank me' first-inherited-memory canon", () => {
    const node = t.nodes["refusal_branch"];
    expect(node?.onscreenText).toMatch(/Don't thank me/);
    // canonical refusal-trust-delta is canonically negative (the
    // canonical refusal IS canonical-care, but lands as canonical-
    // gruff-first-impression)
    const root = getEntryNode(t);
    const refusalChoice = root?.choices?.find(
      (c) => c.nextId === "refusal_branch",
    );
    expect(refusalChoice?.trustDelta).toBe(-1);
    expect(refusalChoice?.publicFlag).toBe(
      "nilmorg_refused_canonical_thanks_first_contact",
    );
  });
});

describe("Vex Solène first-meeting tree — reveal-stage gating canon", () => {
  const t = VEX_SOLENE_FIRST_MEETING;

  it("every node gates eyes_of_reality reveal-stage (canonical pre-reveal)", () => {
    for (const node of walkNodes(t)) {
      expect(node.requiresRevealStage, node.id).toBe("eyes_of_reality");
    }
  });

  it("§1.6 silence-shape: NO 'Engineer' / 'Engineer Zero' / 'Agent Zero' anywhere", () => {
    const allText = walkNodes(t).map((n) => n.onscreenText).join(" ");
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
    expect(allText).not.toMatch(/\bAgent Zero\b/);
  });

  it("root lands canonical 'I am the Maestro of Coda's commerce' anchor", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(/I am the Maestro of Coda's commerce/);
  });

  it("coda_music branch lands canonical 'music is canonically a market' anchor", () => {
    const node = t.nodes["coda_music_branch"];
    expect(node?.onscreenText).toMatch(/music is canonically a market/i);
    expect(node?.onscreenText).toMatch(/Three chairs in the sanctum/i);
  });

  it("maestro_conductor branch lands canonical 'I do not conduct the players' anchor", () => {
    const node = t.nodes["maestro_conductor_branch"];
    expect(node?.onscreenText).toMatch(/I do not conduct the players/i);
    expect(node?.onscreenText).toMatch(/canonical-arbitrate/i);
  });

  it("why_quiet branch lands canonical 'work is canonically loudest underneath' anchor", () => {
    const node = t.nodes["why_quiet_branch"];
    expect(node?.onscreenText).toMatch(/loudest underneath/i);
  });

  it("audit_aware branch sets canonical Locke-cross-character public flag", () => {
    const root = getEntryNode(t);
    const auditChoice = root?.choices?.find(
      (c) => c.nextId === "audit_aware_branch",
    );
    expect(auditChoice?.publicFlag).toBe(
      "vex_filed_player_as_audit_aware_first_contact",
    );
  });
});

describe("Hierophant first-meeting tree — canonical post-arena gating", () => {
  const t = WRAITH_CALDER_FIRST_MEETING;

  it("every node gates post_arena reveal-stage (canonical chamber-only)", () => {
    for (const node of walkNodes(t)) {
      expect(node.requiresRevealStage, node.id).toBe("post_arena");
    }
  });

  it("root lands canonical §1.7 Tell #1 'does not look up' stage-direction", () => {
    const root = getEntryNode(t);
    expect(root?.onscreenText).toMatch(/does not look up/i);
    expect(root?.onscreenText).toMatch(/pen continues/i);
  });

  it("silence_held branch lands canonical 'looks up for the first time' gratitude canon", () => {
    const node = t.nodes["silence_held_branch"];
    expect(node?.onscreenText).toMatch(/looks up for the first time/i);
    expect(node?.onscreenText).toMatch(/canonically gratitude, not recognition/i);
    // canonical trust-positive
    const root = getEntryNode(t);
    const silenceChoice = root?.choices?.find(
      (c) => c.nextId === "silence_held_branch",
    );
    expect(silenceChoice?.trustDelta).toBeGreaterThanOrEqual(2);
    expect(silenceChoice?.publicFlag).toBe(
      "hierophant_first_contact_silence_held",
    );
  });

  it("personal_question branch lands canonical 'I will remember' covenant canon", () => {
    const node = t.nodes["personal_question_branch"];
    expect(node?.onscreenText).toMatch(/I will remember that/i);
    expect(node?.onscreenText).toMatch(/canonically a covenant/i);
  });

  it("get_up_mistake branch lands canonical §3.9 trust-breach + Hostile-band seed", () => {
    const node = t.nodes["get_up_mistake_branch"];
    expect(node?.onscreenText).toMatch(/verb of someone I canonically outgrew/i);
    expect(node?.onscreenText).toMatch(/Sit. Or leave/);
    // canonical trust-breach
    const root = getEntryNode(t);
    const getUpChoice = root?.choices?.find(
      (c) => c.nextId === "get_up_mistake_branch",
    );
    expect(getUpChoice?.trustDelta).toBeLessThanOrEqual(-3);
    expect(getUpChoice?.publicFlag).toBe(
      "hierophant_first_contact_get_up_weaponized",
    );
  });

  it("§1.8 bridge canon: NO contradicted-noun-caps in any post-arena node", () => {
    for (const node of walkNodes(t)) {
      const capsMatches = (node.onscreenText ?? "").match(/\b[A-Z]{4,}\b/g) ?? [];
      expect(capsMatches.length, node.id).toBe(0);
    }
  });
});

describe("Cross-character public flag wiring (Phase 6e.1a)", () => {
  it("nilmorg_refused_canonical_thanks_first_contact is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "nilmorg_refused_canonical_thanks_first_contact",
    );
  });

  it("vex_filed_player_as_audit_aware_first_contact is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "vex_filed_player_as_audit_aware_first_contact",
    );
  });

  it("hierophant_first_contact_silence_held is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_first_contact_silence_held",
    );
  });

  it("hierophant_first_contact_get_up_weaponized is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_first_contact_get_up_weaponized",
    );
  });
});
