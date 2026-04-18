/**
 * Audit 2H — inner-voice dispatch wiring.
 *
 * `dispatchVoiceWhisper` was defined with 8 VoiceTrigger types but
 * never called from any game mode. This test locks the five new
 * call sites so future refactors can't quietly remove them.
 *
 * Coverage:
 *   - DuelystGameUI combat_start   (mulligan → playing)
 *   - DuelystGameUI combat_low_hp  (player general HP < 25%)
 *   - DuelystGameUI choice_presented × 2 (Light/Dark + ProgrammerGift
 *     pillars on mount)
 *   - Act1ClosingChoicePanel choice_presented (§6.3 mount)
 *   - ForgivenessChoicePanel choice_presented (§1.5 Bond-80 mount)
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const duelystUI = fs.readFileSync(
  path.resolve(__dirname, "../../game/duelyst/DuelystGameUI.tsx"),
  "utf-8",
);
const act1Closing = fs.readFileSync(
  path.resolve(__dirname, "../Act1ClosingChoicePanel.tsx"),
  "utf-8",
);
const forgiveness = fs.readFileSync(
  path.resolve(__dirname, "../ForgivenessChoicePanel.tsx"),
  "utf-8",
);
const hackingPuzzle = fs.readFileSync(
  path.resolve(__dirname, "../../game/HackingPuzzle.tsx"),
  "utf-8",
);

describe("audit 2H — DuelystGameUI dispatches inner-voice whispers", () => {
  it("imports dispatchVoiceWhisper", () => {
    expect(duelystUI).toContain(
      'import { dispatchVoiceWhisper } from "@/components/VoiceWhisper"',
    );
  });

  it("fires combat_start on mulligan → playing transition", () => {
    // The dispatch lands next to setPhase("playing") in the
    // finish-mulligan handler.
    expect(duelystUI).toMatch(
      /setPhase\("playing"\);[\s\S]{0,400}dispatchVoiceWhisper\(\s*\{\s*type:\s*"combat_start"\s*\}/,
    );
  });

  it("fires combat_low_hp when player general HP drops below 25%", () => {
    expect(duelystUI).toContain('{ type: "combat_low_hp" }');
    expect(duelystUI).toContain("lowHpDispatchedRef");
    expect(duelystUI).toMatch(/pct\s*<\s*0\.25/);
  });

  it("resets the low-HP guard when HP recovers (crossing re-fires)", () => {
    expect(duelystUI).toMatch(/pct\s*>=\s*0\.25/);
    expect(duelystUI).toMatch(/lowHpDispatchedRef\.current\s*=\s*false/);
  });

  it("fires choice_presented when the §5.8.1 Light/Dark pillar mounts", () => {
    expect(duelystUI).toMatch(
      /setShowLightDarkPillar\(true\);[\s\S]{0,400}dispatchVoiceWhisper\(\s*\{\s*type:\s*"choice_presented"\s*\}/,
    );
  });

  it("fires choice_presented when the §5.6 Programmer gift pillar mounts", () => {
    expect(duelystUI).toMatch(
      /setShowProgrammerGiftPillar\(true\);[\s\S]{0,400}dispatchVoiceWhisper\(\s*\{\s*type:\s*"choice_presented"\s*\}/,
    );
  });
});

describe("audit 2H — global choice panels dispatch on mount", () => {
  it("Act1ClosingChoicePanel imports + dispatches choice_presented", () => {
    expect(act1Closing).toContain(
      'import { dispatchVoiceWhisper } from "@/components/VoiceWhisper"',
    );
    expect(act1Closing).toMatch(
      /dispatchVoiceWhisper\(\s*\{\s*type:\s*"choice_presented"\s*\}/,
    );
  });

  it("Act1ClosingChoicePanel guards on `unlocked && !alreadyMade`", () => {
    // The useEffect must early-return before the dispatch when the
    // panel isn't actually surfaced, so a non-playing player doesn't
    // trigger whispers from a hidden gate.
    expect(act1Closing).toMatch(
      /useEffect[\s\S]{0,200}if\s*\(!unlocked\s*\|\|\s*alreadyMade\)\s*return/,
    );
  });

  it("ForgivenessChoicePanel imports + dispatches choice_presented", () => {
    expect(forgiveness).toContain(
      'import { dispatchVoiceWhisper } from "@/components/VoiceWhisper"',
    );
    expect(forgiveness).toMatch(
      /dispatchVoiceWhisper\(\s*\{\s*type:\s*"choice_presented"\s*\}/,
    );
  });

  it("ForgivenessChoicePanel guards on `unlocked && !alreadyMade`", () => {
    expect(forgiveness).toMatch(
      /useEffect[\s\S]{0,200}if\s*\(!unlocked\s*\|\|\s*alreadyMade\)\s*return/,
    );
  });
});

describe("audit 2H — puzzle_attempt dispatch on HackingPuzzle mount", () => {
  it("imports dispatchVoiceWhisper + useGame", () => {
    expect(hackingPuzzle).toContain(
      'import { dispatchVoiceWhisper } from "@/components/VoiceWhisper"',
    );
    expect(hackingPuzzle).toContain(
      'import { useGame } from "@/contexts/GameContext"',
    );
  });

  it("fires puzzle_attempt with the hacking puzzleId on mount", () => {
    expect(hackingPuzzle).toMatch(
      /dispatchVoiceWhisper\(\s*\{\s*type:\s*"puzzle_attempt",\s*puzzleId:\s*"hacking"\s*\}/,
    );
  });
});

describe("audit 3B — DuelystGameUI fires card-battle quest progress on match end", () => {
  it("imports trpc + creates the updateQuestProgress mutation", () => {
    expect(duelystUI).toContain('import { trpc } from "@/lib/trpc"');
    expect(duelystUI).toContain(
      "trpc.quests.updateProgress.useMutation()",
    );
  });

  it("guards via questsRecordedRef so increments fire once per match", () => {
    expect(duelystUI).toContain("questsRecordedRef");
    expect(duelystUI).toMatch(
      /if\s*\(!questsRecordedRef\.current\)[\s\S]{0,200}questsRecordedRef\.current\s*=\s*true/,
    );
  });

  it("fires d_play_3_battles on every completion (win or loss)", () => {
    expect(duelystUI).toContain(
      'updateQuestProgress.mutate({ questId: "d_play_3_battles", increment: 1 })',
    );
  });

  it("fires win-only quests (card_battle / weekly / season) when winner === 0", () => {
    expect(duelystUI).toMatch(
      /gameState\.winner\s*===\s*0[\s\S]{0,300}d_play_card_battle[\s\S]{0,100}w_win_10_battles[\s\S]{0,100}e_win_100_battles/,
    );
  });
});
