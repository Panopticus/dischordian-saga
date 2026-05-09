/**
 * TradeEmpireHubPage source-scan test. Pins:
 *   - The hub mounts the existing TradeEmpirePage and TradeCourtPage
 *     (so neither page's tested behaviour is duplicated or forked).
 *   - The Convergence panel is the third tab.
 *   - The /trade-empire/hub route resolves to the hub.
 *
 * These wiring details are easy to break with a careless rename;
 * pinning them here keeps the merge contract honest.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO_ROOT = resolve(__dirname, "../../../../..");

function readSrc(relPath: string): string {
  return readFileSync(resolve(REPO_ROOT, relPath), "utf8");
}

describe("Trade Empire 3-tab hub wiring", () => {
  it("hub embeds both the Map and Court pages without forking them", () => {
    const src = readSrc("apps/client/src/pages/TradeEmpireHubPage.tsx");
    expect(src).toContain('import TradeEmpirePage from "@/game/TradeEmpirePage"');
    expect(src).toContain('import TradeCourtPage from "@/pages/TradeCourtPage"');
    expect(src).toContain("TradeConvergencePanel");
    expect(src).toContain('value="map"');
    expect(src).toContain('value="court"');
    expect(src).toContain('value="convergence"');
  });

  it("Convergence panel reads the doom-clock + saturation queries", () => {
    const src = readSrc(
      "apps/client/src/components/tradeEmpire/TradeConvergencePanel.tsx",
    );
    expect(src).toContain("getConvergenceClimaxState");
    expect(src).toContain("getSectorSaturation");
    expect(src).toContain("CANONICAL_CLIMAX_RESOLUTION_KEYS");
    expect(src).toContain("getCanonicalClimaxResolutions");
  });

  it("App.tsx routes /trade-empire/hub to the hub page", () => {
    const src = readSrc("apps/client/src/App.tsx");
    expect(src).toContain("./pages/TradeEmpireHubPage");
    expect(src).toContain('path="/trade-empire/hub"');
    // Existing deep-links still resolve.
    expect(src).toContain('path="/trade-empire"');
    expect(src).toContain('path="/court"');
  });
});
