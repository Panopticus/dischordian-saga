/**
 * MatchSummary — structural + contract tests.
 *
 * Per repo convention (RTL isn't in the client dep tree), these are
 * export + source-scan checks. They lock down the four invariants
 * that let the match-end UI do its job:
 *   1. Default export is a React component.
 *   2. The component renders both "PLAY AGAIN" and "RETURN TO MENU"
 *      affordances so the player always has a next step.
 *   3. Stats (turns, cards played) are interpolated from props, not
 *      hardcoded.
 *   4. The `reward` prop is optional — null / empty reward rows
 *      don't crash the component (sparring / PvP matches).
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import MatchSummary, {
  type MatchSummaryStats,
} from "./MatchSummary";

const src = fs.readFileSync(
  path.resolve(__dirname, "MatchSummary.tsx"),
  "utf-8",
);

describe("MatchSummary component", () => {
  it("exports a component function as default", () => {
    expect(MatchSummary).toBeDefined();
    expect(typeof MatchSummary).toBe("function");
  });

  it("accepts an optional null reward (no crash path for sparring / PvP)", () => {
    // Compile-time check: the prop type allows null. We spot-check
    // the source for the exact shape since we can't render.
    expect(src).toMatch(/reward:\s*EncounterReward\s*\|\s*null/);
  });

  it("renders both Play Again and Return to Menu buttons", () => {
    expect(src).toContain("PLAY AGAIN");
    expect(src).toContain("RETURN TO MENU");
    expect(src).toContain('data-testid="match-summary-play-again"');
    expect(src).toContain('data-testid="match-summary-return-menu"');
  });

  it("interpolates stats from props — no hardcoded turn numbers", () => {
    // Every stat should read from `stats.X`, never a constant.
    expect(src).toMatch(/\{stats\.turnsTaken\}/);
    expect(src).toMatch(/\{stats\.cardsPlayed\}/);
    expect(src).toMatch(/stats\.damageDealt/);
  });

  it("marks the container as role=alert with aria-live for AT users", () => {
    expect(src).toMatch(/role="alert"/);
    expect(src).toMatch(/aria-live="polite"/);
  });

  it("differentiates the conceded-defeat subtitle from the standard defeat", () => {
    // Spec: conceded matches show "WITHDRAWN" / "You stepped away",
    // not "DEFEAT" / "Your general has been destroyed."
    expect(src).toContain("WITHDRAWN");
    expect(src).toContain("stepped away");
  });

  it("encounter name renders only when provided (null ⇒ hidden)", () => {
    // Defensive render: the encounter-name block should be gated on
    // {encounterName && ...} so PvP / sparring matches don't show a
    // blank row.
    expect(src).toMatch(/encounterName && /);
  });

  it("MatchSummaryStats type includes the conceded flag", () => {
    // Structural type check via a no-op construction.
    const stats: MatchSummaryStats = {
      turnsTaken: 8,
      cardsPlayed: 12,
      conceded: false,
    };
    expect(stats.conceded).toBe(false);
  });
});

describe("DuelystGameUI — MatchSummary integration", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "../../game/duelyst/DuelystGameUI.tsx"),
    "utf-8",
  );

  it("imports MatchSummary + MatchSummaryStats from the match components dir", () => {
    expect(uiSrc).toContain(
      'import { MatchSummary, type MatchSummaryStats } from "@/components/match/MatchSummary"',
    );
  });

  it("replaces the inline game-over screen with <MatchSummary>", () => {
    // The old inline <h2>VICTORY</h2> JSX block is gone; the new
    // path returns a <MatchSummary ... />. We assert the component
    // is mounted inside the phase==="game_over" branch.
    expect(uiSrc).toMatch(/if\s*\(phase\s*===\s*"game_over"\)/);
    expect(uiSrc).toMatch(/<MatchSummary/);
  });

  it("increments dischordia_wins on player victory", () => {
    // The counter must be written, not just read — this re-activates
    // the Act 1 cycle milestone chain that was a dead wire.
    expect(uiSrc).toContain('localStorage.setItem(\n              "dischordia_wins"');
  });

  it("plays the victory/defeat sound sting on match end", () => {
    expect(uiSrc).toMatch(
      /dischordiaSounds\.play\(gameState\.winner === 0 \? "victory" : "defeat"\)/,
    );
  });

  it("captures match stats into state on game-over (stable across re-renders)", () => {
    expect(uiSrc).toContain("setCapturedMatchStats");
    expect(uiSrc).toContain("setCapturedReward");
    expect(uiSrc).toMatch(/turnsTaken:\s*gameState\.turnNumber/);
  });

  it("increments cardsPlayedRef on every successful play_card dispatch", () => {
    // The ref must be bumped AT LEAST the number of dispatch sites
    // that call play_card. Today that's 4 (summon-to-tile,
    // summon-with-target, spell-self, spell-target, artifact).
    const matches = uiSrc.match(/cardsPlayedRef\.current \+= 1/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(4);
  });

  it("renders a concede button with a confirm modal", () => {
    expect(uiSrc).toContain('data-testid="concede-button"');
    expect(uiSrc).toContain('data-testid="concede-confirm"');
    expect(uiSrc).toContain('data-testid="concede-cancel"');
    expect(uiSrc).toMatch(/dispatch\(\s*\{\s*type:\s*"concede"\s*\}\s*\)/);
  });

  it("Play Again handler bumps matchRunId so the init effect reruns", () => {
    expect(uiSrc).toContain("setMatchRunId((n) => n + 1)");
  });
});
