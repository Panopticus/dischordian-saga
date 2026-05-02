/**
 * Structural smoke for the CoNexus Portal wiring.
 *
 * Source-scan style (matches Act1ClosingChoicePanel.test.tsx,
 * ContractSigningModal.test.tsx). Browser smoke for this page
 * is not feasible in CI; instead we pin the contracts that the
 * three integration prongs (#300, #306) depend on so future
 * UI cleanups can't silently drop them:
 *
 *   • Diegetic discovery: TOME_PLACEMENTS-driven discoveredTomes
 *     reads npcTrust correctly for non-elara NPCs.
 *   • Antiquarian assignments: imports + renders an assignments panel.
 *   • Feedback loop: handleMarkComplete sets the three canonical
 *     narrative flags and bumps Antiquarian trust per Tome.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "ConexusPortalPage.tsx"),
  "utf-8",
);

describe("ConexusPortalPage — integration wiring contract", () => {
  it("imports the assignment helpers from the data module", () => {
    expect(SRC).toContain('from "@/data/antiquarianAssignments"');
    expect(SRC).toContain("ANTIQUARIAN_ASSIGNMENTS");
    expect(SRC).toContain("getActiveAssignments");
    expect(SRC).toContain("getAntiquarianTrust");
    expect(SRC).toContain("assignmentCompletionFlag");
  });

  it("destructures setNarrativeFlag and adjustNpcTrust from useGame()", () => {
    expect(SRC).toMatch(/setNarrativeFlag.*adjustNpcTrust|adjustNpcTrust.*setNarrativeFlag/);
  });

  it("computes activeAssignments from current act + Antiquarian trust + flags + completedGames", () => {
    expect(SRC).toContain("getActiveAssignments({");
    expect(SRC).toContain("narrativeAct: state.narrativeAct");
    expect(SRC).toContain("antiquarianTrust: getAntiquarianTrust(state.npcTrust)");
    expect(SRC).toContain("narrativeFlags: state.narrativeFlags");
    expect(SRC).toContain("completedGames: state.completedGames");
  });

  it("reads npcTrust correctly for elara, the_human, and other NPCs", () => {
    // The bug fixed in #300: original code only branched on elara and
    // returned 0 for everyone else, so every non-elara trust gate
    // silently failed. Pin the three-way branch.
    expect(SRC).toMatch(/npc === "elara"/);
    expect(SRC).toMatch(/npc === "the_human"/);
    expect(SRC).toMatch(/state\.npcTrust\?\.\[npc\]/);
  });

  it("handleMarkComplete sets the three canonical CoNexus → saga feedback flags", () => {
    expect(SRC).toContain("setNarrativeFlag(`${game.id}_conexus_complete`, true)");
    expect(SRC).toContain('setNarrativeFlag("conexusLoreViewed", true)');
    expect(SRC).toContain('setNarrativeFlag("completed_conexus_story", true)');
  });

  it("handleMarkComplete bumps Antiquarian trust per Tome", () => {
    expect(SRC).toMatch(/adjustNpcTrust\("antiquarian",\s*3\)/);
  });

  it("handleMarkComplete fires the postscript toast for active assignments", () => {
    expect(SRC).toContain("ANTIQUARIAN_ASSIGNMENTS.find");
    expect(SRC).toContain("assignmentCompletionFlag(assignment.id)");
    // Extra trust bump on assignment closure.
    expect(SRC).toMatch(/adjustNpcTrust\("antiquarian",\s*2\)/);
    // The Antiquarian's voice is what closes the loop.
    expect(SRC).toContain("assignment.postscript");
  });

  it("renders the prescriptions panel only when activeAssignments exist", () => {
    expect(SRC).toContain("activeAssignments.length > 0");
    expect(SRC).toContain("THE ANTIQUARIAN HAS LAID OUT");
  });
});

describe("HierarchyPage — hierarchy_discovered producer", () => {
  it("sets hierarchy_discovered on mount so blood-weave-gates-of-hell unlocks", () => {
    const hierarchySrc = fs.readFileSync(
      path.resolve(__dirname, "HierarchyPage.tsx"),
      "utf-8",
    );
    expect(hierarchySrc).toContain('from "@/contexts/GameContext"');
    expect(hierarchySrc).toContain('setNarrativeFlag("hierarchy_discovered", true)');
  });
});
