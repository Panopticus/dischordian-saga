/**
 * StoryModePage — structural + integration source-scan tests.
 *
 * Per repo convention (see FamilyTreeView.test.tsx, PreludePage.test.tsx)
 * RTL isn't in the client dep tree. These tests assert the five
 * invariants that keep the launcher wired correctly:
 *
 *   1. StoryModePage exports a default component.
 *   2. The /story route is registered in App.tsx behind GameRoute.
 *   3. Unfinished-Prelude players are redirected back to /prelude.
 *   4. The launcher imports ALL_CHAPTER_ENCOUNTERS and mounts
 *      DuelystGameUI with an `encounter` prop on pick.
 *   5. Match-end writes persist to storyProgress.completedChapters
 *      via saveStoryProgress.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import StoryModePage from "./StoryModePage";

const REPO_ROOT = path.resolve(__dirname, "../../../..");
const pageSrc = fs.readFileSync(
  path.resolve(__dirname, "StoryModePage.tsx"),
  "utf-8",
);

describe("StoryModePage", () => {
  it("exports a component function as default", () => {
    expect(StoryModePage).toBeDefined();
    expect(typeof StoryModePage).toBe("function");
  });

  it("iterates ALL_CHAPTER_ENCOUNTERS from tcg-core", () => {
    expect(pageSrc).toContain(
      'import { ALL_CHAPTER_ENCOUNTERS } from "@shared/tcg-core/story/chapters"',
    );
  });

  it("mounts DuelystGameUI with an encounter prop on pick", () => {
    expect(pageSrc).toContain("import DuelystGameUI from");
    expect(pageSrc).toMatch(/<DuelystGameUI[\s\S]*?encounter=/);
  });

  it("gates on narrativeFlags.prelude_complete", () => {
    expect(pageSrc).toContain("narrativeFlags?.prelude_complete");
    expect(pageSrc).toMatch(/navigate\(["']\/prelude["'],\s*\{\s*replace:\s*true\s*\}\)/);
  });

  it("persists completed chapters via saveStoryProgress", () => {
    expect(pageSrc).toContain("saveStoryProgress");
    expect(pageSrc).toContain("completedChapters");
  });

  it("highlights named bosses separately from sparring chapters", () => {
    // The ACT_1_NAMED_BOSS_ENCOUNTERS set drives the visual
    // differentiation — regression would collapse the two groups.
    expect(pageSrc).toContain("ACT_1_NAMED_BOSS_ENCOUNTERS");
  });
});

describe("App.tsx — /story route registration", () => {
  const appSrc = fs.readFileSync(
    path.resolve(REPO_ROOT, "apps/client/src/App.tsx"),
    "utf-8",
  );

  it("lazy-imports StoryModePage", () => {
    expect(appSrc).toContain(
      'const StoryModePage = lazy(() => import("./pages/StoryModePage"))',
    );
  });

  it("registers the /story route behind GameRoute", () => {
    // GameRoute wraps game pages with the auth/loading chrome, like
    // the other gameplay routes (/fight, /cards/play, /duelyst).
    expect(appSrc).toMatch(
      /<Route path="\/story">\s*\{[^}]*<GameRoute component=\{StoryModePage\}/,
    );
  });
});

describe("DuelystGameUI — encounter-mode plumbing", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(
      REPO_ROOT,
      "apps/client/src/game/duelyst/DuelystGameUI.tsx",
    ),
    "utf-8",
  );

  it("accepts an optional encounter prop", () => {
    expect(uiSrc).toContain("encounter?: StoryEncounter");
  });

  it("passes encounter modes through to TcgClient.init", () => {
    // All five mode passthroughs must be present — missing any one
    // would silently disable its UI overlay (Warlord lockout,
    // Programmer gift, Public witness, Seer prophecy, trial). The
    // regex matches object shorthand (`trialMode,`) OR explicit
    // (`trialMode: encounter?.trialMode,`).
    expect(uiSrc).toMatch(/\btrialMode[,:]/);
    expect(uiSrc).toMatch(/giftMode:\s*encounter\?\.giftMode/);
    expect(uiSrc).toMatch(/witnessMode:\s*encounter\?\.witnessMode/);
    expect(uiSrc).toMatch(/prophecyMode:\s*encounter\?\.prophecyMode/);
    expect(uiSrc).toMatch(/scriptedActions:\s*encounter\?\.scriptedActions/);
  });

  it("applies computeAuthorityTrialOverride for ch_authority_trial", () => {
    // The §5.7 → §5.8 handoff fires at encounter init when the
    // encounter id is the Authority trial.
    expect(uiSrc).toContain("computeAuthorityTrialOverride");
    expect(uiSrc).toContain("ch_authority_trial");
  });

  it("applies the encounter reward table on match resolution", () => {
    expect(uiSrc).toContain("getEncounterReward");
    expect(uiSrc).toMatch(/getEncounterReward\(\s*encounter\.id/);
  });

  it("guards reward writes behind the questsRecordedRef ref", () => {
    // Rewards must fire AT MOST once per match — same guard as the
    // quest writes. A regression that splits the guard would
    // double-apply bond deltas on strict-mode re-renders.
    const rewardBlock = uiSrc
      .split("questsRecordedRef.current = true")[1]
      ?.split("}\n    }")[0] ?? "";
    expect(rewardBlock).toContain("getEncounterReward");
  });
});
