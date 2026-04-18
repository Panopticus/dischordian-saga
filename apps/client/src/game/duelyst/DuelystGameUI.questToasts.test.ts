/**
 * Quest-complete toast + faction-preference persistence.
 *
 * Structural tests anchoring two small but high-leverage polish
 * fixes from the progression audit:
 *   - Card-battle quest progress wrote to the DB but was invisible
 *     to the player (no completion toast). Now the updateProgress
 *     mutation has an onSuccess that surfaces completed quests.
 *   - Faction selection was lost on reload (audit P1). Now
 *     persisted in localStorage via `dischordia_preferred_faction`.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const uiSrc = fs.readFileSync(
  path.resolve(__dirname, "DuelystGameUI.tsx"),
  "utf-8",
);

const pageSrc = fs.readFileSync(
  path.resolve(__dirname, "DuelystPage.tsx"),
  "utf-8",
);

describe("DuelystGameUI — quest-complete toast", () => {
  it("passes an onSuccess handler to updateQuestProgress mutation", () => {
    expect(uiSrc).toMatch(
      /trpc\.quests\.updateProgress\.useMutation\(\{\s*onSuccess:/,
    );
  });

  it("toasts when the server reports completed: true", () => {
    expect(uiSrc).toMatch(/if\s*\(!result\.completed\)\s*return/);
    expect(uiSrc).toContain("Quest complete:");
  });

  it("exposes human-friendly labels for the four tracked quest ids", () => {
    // Each quest id DuelystGameUI fires must have a label, otherwise
    // the toast will show the raw id (which is a UX regression).
    expect(uiSrc).toContain("d_play_3_battles:");
    expect(uiSrc).toContain("d_play_card_battle:");
    expect(uiSrc).toContain("w_win_10_battles:");
    expect(uiSrc).toContain("e_win_100_battles:");
  });

  it("falls back to the raw id when a label is missing (safety net)", () => {
    // Catches a future regression where someone adds a new quest id
    // in the mutation call but forgets to add a label; player still
    // sees *something*, not undefined.
    expect(uiSrc).toMatch(/QUEST_LABELS\[variables\.questId\]\s*\?\?\s*variables\.questId/);
  });
});

describe("DuelystPage — faction preference persistence", () => {
  it("hydrates the initial faction from localStorage", () => {
    expect(pageSrc).toMatch(
      /localStorage\.getItem\(\s*["']dischordia_preferred_faction["']\s*\)/,
    );
  });

  it("validates the saved value against the known faction list before use", () => {
    // Defensive — if a future refactor renames a faction, the stored
    // value must not blow up the page. The validation list must cover
    // the 6 playable factions.
    expect(pageSrc).toMatch(/valid:\s*Faction\[\]/);
    expect(pageSrc).toMatch(/"architect"/);
    expect(pageSrc).toMatch(/"insurgency"/);
    expect(pageSrc).toMatch(/"dreamer"/);
    expect(pageSrc).toMatch(/"new_babylon"/);
    expect(pageSrc).toMatch(/"antiquarian"/);
    expect(pageSrc).toMatch(/"thought_virus"/);
  });

  it("persists the selection on handleFactionSelect", () => {
    expect(pageSrc).toMatch(
      /localStorage\.setItem\(\s*["']dischordia_preferred_faction["']\s*,\s*faction\s*\)/,
    );
  });
});
