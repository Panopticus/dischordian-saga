// apps/shared/npcs/__tests__/dialogTrees.locke.test.ts
//
// Phase 6a.2 sub-chunk F verification — Locke first-meeting dialog
// tree (the first per-NPC dialog tree authored under the unified
// NpcDialogTree infrastructure shipped in Phase 6 D2).
//
// Validates the bible-derived tree against canonical §2.5 4-axis
// branching spec + writers'-guide Trade Hub first-contact pattern:
//   1. 6 nodes total (root + 4 axis-branches + terminal — matches
//      the Elara/Human reference 6-node pattern from the plan)
//   2. Tree connectivity-validated via isDialogTreeConnected
//   3. Tree npc-consistency-validated via isDialogTreeNpcConsistent
//   4. Root has 4 axis-revealing choices (curiosity / vigilance /
//      mercy / wit) each setting a canonical "locke_axis_read_<axis>"
//      narrative flag
//   5. Each branch lands a canonical Locke variant register per §2.5
//      (Mercantile / Judicial / Collegial / Predatory)
//   6. Vigilance branch carries +trust (canonical respect for fine-
//      print readers per §2.4 anti-warmth canon — what rises is
//      specificity, not warmth, but professional respect for
//      audit-mindedness IS canonical Judicial)
//   7. Wit branch carries -trust + the canonical predatory-first-
//      contact public flag (filed-as-predatory)
//   8. Tree exposes 4 distinct player-experience-paths (the reference
//      threshold from countPlayerPaths)

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_FIRST_MEETING } from "../dialogTrees/adjudicator_locke/first_meeting";
import {
  countPlayerPaths,
  getDialogNode,
  getEntryNode,
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  isTerminalNode,
  walkNodes,
} from "../dialogTrees/types";
import { getDialogTree } from "../dialogTrees";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

describe("Locke first-meeting tree — shape", () => {
  it("has 6 nodes total (root + 4 branches + terminal)", () => {
    const all = walkNodes(ADJUDICATOR_LOCKE_FIRST_MEETING);
    expect(all.length).toBe(6);
  });

  it("connectivity-validates (every nextId / autoNext resolves)", () => {
    expect(isDialogTreeConnected(ADJUDICATOR_LOCKE_FIRST_MEETING)).toBe(
      true,
    );
  });

  it("npc-consistency-validates (every node owned by adjudicator_locke)", () => {
    expect(
      isDialogTreeNpcConsistent(ADJUDICATOR_LOCKE_FIRST_MEETING),
    ).toBe(true);
  });

  it("entry node is 'root' with 4 axis-revealing choices", () => {
    const root = getEntryNode(ADJUDICATOR_LOCKE_FIRST_MEETING);
    expect(root?.id).toBe("root");
    expect(root?.choices?.length).toBe(4);
  });

  it("terminal node ends the tree (no choices, no autoNext)", () => {
    const terminal = getDialogNode(
      ADJUDICATOR_LOCKE_FIRST_MEETING,
      "terminal",
    );
    expect(isTerminalNode(terminal)).toBe(true);
  });

  it("countPlayerPaths returns 4 (one per axis branch)", () => {
    expect(countPlayerPaths(ADJUDICATOR_LOCKE_FIRST_MEETING)).toBe(4);
  });
});

describe("Locke first-meeting tree — 4-axis canonical branching", () => {
  const root = getEntryNode(ADJUDICATOR_LOCKE_FIRST_MEETING)!;

  it("each root choice sets a canonical 'locke_axis_read_<axis>' flag", () => {
    const expectedFlags = [
      "locke_axis_read_curiosity",
      "locke_axis_read_vigilance",
      "locke_axis_read_mercy",
      "locke_axis_read_wit",
    ];
    const actualFlags = (root.choices ?? [])
      .map((c) => c.sets)
      .filter((f): f is string => typeof f === "string");
    for (const f of expectedFlags) {
      expect(actualFlags, f).toContain(f);
    }
  });

  it("each root choice records an axisDelta on its canonical axis", () => {
    const choices = root.choices ?? [];
    const axisFromChoice = (label: RegExp) =>
      choices.find((c) => label.test(c.label))?.axisDelta?.[0]?.axis;

    expect(axisFromChoice(/business/i)).toBe("curiosity");
    expect(axisFromChoice(/fine print/i)).toBe("vigilance");
    expect(axisFromChoice(/needs me/i)).toBe("mercy");
    expect(axisFromChoice(/hiding/i)).toBe("wit");
  });

  it("vigilance branch carries +trust (canonical Judicial respect)", () => {
    const vigChoice = root.choices?.find((c) =>
      /fine print/i.test(c.label),
    );
    expect(vigChoice?.trustDelta).toBe(2);
  });

  it("mercy branch carries +trust (canonical Collegial respect)", () => {
    const mercyChoice = root.choices?.find((c) =>
      /needs me/i.test(c.label),
    );
    expect(mercyChoice?.trustDelta).toBe(1);
  });

  it("wit branch carries -trust + the canonical predatory public flag", () => {
    const witChoice = root.choices?.find((c) => /hiding/i.test(c.label));
    expect(witChoice?.trustDelta).toBe(-1);
    expect(witChoice?.publicFlag).toBe(
      "locke_filed_player_as_predatory_first_contact",
    );
  });
});

describe("Locke first-meeting tree — variant register canon (§2.5)", () => {
  it("Mercantile branch lands canonical 'Business I understand' anchor", () => {
    const merc = getDialogNode(
      ADJUDICATOR_LOCKE_FIRST_MEETING,
      "mercantile_branch",
    );
    expect(merc.onscreenText).toMatch(/Business I understand/i);
  });

  it("Judicial branch lands canonical 'I am filing this' tell + 'docket' anchor", () => {
    const jud = getDialogNode(
      ADJUDICATOR_LOCKE_FIRST_MEETING,
      "judicial_branch",
    );
    expect(jud.onscreenText).toMatch(/I am filing this/i);
    expect(jud.onscreenText).toMatch(/docket/i);
  });

  it("Collegial branch lands canonical 'someone is fortunate' on-behalf-of register", () => {
    // §2.5 Collegial canon: peer-mode treats the player as a board
    // member acting for someone else. The canonical first-meeting
    // register names "someone is fortunate" — Locke's institutional
    // courtesy that doesn't quite cross into warmth.
    const col = getDialogNode(
      ADJUDICATOR_LOCKE_FIRST_MEETING,
      "collegial_branch",
    );
    expect(col.onscreenText).toMatch(/someone is fortunate/i);
    expect(col.onscreenText).toMatch(/Authority does not often hire on behalf of someone else/i);
  });

  it("Predatory branch lands canonical 'I am filing that you said that' deferred-threat", () => {
    // §1.4 tell #4 deferred-threat lands here. The canonical Predatory
    // first-contact register is "Sit anyway. We can find out together."
    // — hospitality-as-honeypot.
    const pred = getDialogNode(
      ADJUDICATOR_LOCKE_FIRST_MEETING,
      "predatory_branch",
    );
    expect(pred.onscreenText).toMatch(/I am filing that you said that/i);
    expect(pred.onscreenText).toMatch(/Sit anyway/i);
  });
});

describe("Locke first-meeting tree — aggregator integration", () => {
  it("getDialogTree('adjudicator_locke', 'locke-first-meeting') returns the tree", () => {
    const t = getDialogTree("adjudicator_locke", "locke-first-meeting");
    expect(t).toBeDefined();
    expect(t?.id).toBe("locke-first-meeting");
  });

  it("getDialogTree returns undefined for unknown ids (silent-fail)", () => {
    expect(
      getDialogTree("adjudicator_locke", "no-such-tree"),
    ).toBeUndefined();
  });
});

describe("Locke first-meeting tree — cross-character flag wiring", () => {
  it("locke_filed_player_as_predatory_first_contact has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "locke_filed_player_as_predatory_first_contact",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("adjudicator_locke");
  });
});

describe("Locke first-meeting tree — bible canon protections", () => {
  it("§1.5 NO regret/sorry vocabulary anywhere in the tree", () => {
    const allText = walkNodes(ADJUDICATOR_LOCKE_FIRST_MEETING)
      .map((n) => n.onscreenText)
      .join(" ");
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    expect(apologyWords.test(allText)).toBe(false);
  });

  it("§2.4 anti-warmth canon: Collegial branch stays institutional", () => {
    // Per §2.4: warmth writers will be tempted to add as trust rises
    // is out of character. The Collegial-first-contact line should
    // stay institutional — it names the canonical Authority register
    // without welcome-vocabulary.
    const col = getDialogNode(
      ADJUDICATOR_LOCKE_FIRST_MEETING,
      "collegial_branch",
    );
    expect(col.onscreenText).not.toMatch(
      /\b(welcome home|dear friend|happy to|so glad|delighted)\b/i,
    );
  });

  it("the canonical 'the file' / 'filing' / 'docket' / 'ledger' anchor density (≥4 of 6 nodes)", () => {
    const allText = walkNodes(ADJUDICATOR_LOCKE_FIRST_MEETING).map(
      (n) => n.onscreenText,
    );
    const anchored = allText.filter((t) =>
      /\b(file|filing|docket|ledger)\b/i.test(t),
    );
    expect(anchored.length).toBeGreaterThanOrEqual(4);
  });
});
