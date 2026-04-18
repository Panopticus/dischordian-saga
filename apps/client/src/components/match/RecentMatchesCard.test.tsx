/**
 * RecentMatchesCard — structural + integration tests.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import RecentMatchesCard from "./RecentMatchesCard";

const src = fs.readFileSync(
  path.resolve(__dirname, "RecentMatchesCard.tsx"),
  "utf-8",
);

describe("RecentMatchesCard component", () => {
  it("exports a default component function", () => {
    expect(RecentMatchesCard).toBeDefined();
    expect(typeof RecentMatchesCard).toBe("function");
  });

  it("reads from the shared clientMatchHistory helper", () => {
    expect(src).toContain(
      'from "@shared/clientMatchHistory"',
    );
    expect(src).toContain("readMatchHistory()");
    expect(src).toContain("summarizeMatchHistory");
  });

  it("renders null when there's no history (fresh-save empty state)", () => {
    expect(src).toMatch(/if\s*\(history\.length\s*===\s*0\)\s*return\s+null/);
  });

  it("caps the visible list at 5 rows (Bridge is compact)", () => {
    expect(src).toContain("history.slice(0, 5)");
  });

  it("surfaces W/L summary in the header", () => {
    expect(src).toContain("stats.wins");
    expect(src).toContain("stats.losses");
  });

  it("tags outcome rows with distinct color classes", () => {
    expect(src).toContain("outcomeStyle");
    // Post-Void-Energy migration: axis tokens instead of raw Tailwind ramps.
    expect(src).toContain("void-text-energy"); // win → success axis
    expect(src).toContain("void-text-error");  // loss → error axis
    expect(src).toContain("void-text-accent"); // withdrawn → accent axis
  });
});

describe("BridgeConsole — RecentMatchesCard integration", () => {
  const bridgeSrc = fs.readFileSync(
    path.resolve(__dirname, "../../pages/BridgeConsole.tsx"),
    "utf-8",
  );

  it("imports RecentMatchesCard", () => {
    expect(bridgeSrc).toContain(
      'import { RecentMatchesCard } from "@/components/match/RecentMatchesCard"',
    );
  });

  it("mounts RecentMatchesCard in the page body", () => {
    expect(bridgeSrc).toContain("<RecentMatchesCard />");
  });
});

describe("DuelystGameUI — history append on match-end", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "../../game/duelyst/DuelystGameUI.tsx"),
    "utf-8",
  );

  it("imports appendMatchHistoryEntry from the shared module", () => {
    expect(uiSrc).toContain(
      'from "@shared/clientMatchHistory"',
    );
    expect(uiSrc).toContain("appendMatchHistoryEntry");
  });

  it("writes the entry with turns + cardsPlayed + outcome derived from winner", () => {
    expect(uiSrc).toMatch(/appendMatchHistoryEntry\(\{[\s\S]{0,500}outcome:\s*outcomeForHistory/);
    expect(uiSrc).toMatch(/turns:\s*turnsTaken/);
    expect(uiSrc).toMatch(/cardsPlayed:\s*cardsPlayedRef\.current/);
  });

  it("distinguishes withdrawn from loss via winReason", () => {
    // conceded + opponent-won ⇒ withdrawn; opponent-won without concede
    // ⇒ loss; player-won ⇒ win.
    expect(uiSrc).toMatch(/conceded\s*&&\s*gameState\.winner\s*!==\s*0/);
  });
});
