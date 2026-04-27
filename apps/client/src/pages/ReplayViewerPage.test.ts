/**
 * ReplayViewerPage wiring guard (#6 / #46 follow-up).
 *
 * Static-analysis on the page so the wiring can't silently regress:
 *   - The page imports the canonical engine helpers (replayMatch +
 *     replayViewerReducer) instead of duplicating playback logic.
 *   - Uses the public `getReplayByToken` endpoint (not the auth-
 *     gated by-id lookup) so a non-logged-in viewer following a
 *     share-link doesn't bounce off AuthGate.
 *   - Routes through the client-side card registry, not the server's.
 *   - The /replay/:token route is registered in App.tsx and (a) does
 *     NOT live inside an AuthGate / ProtectedRoute wrapper, (b) sits
 *     above the catch-all 404 route.
 *
 * The page itself is mostly view code; behavioural tests of the
 * underlying engine (`replayMatch`) and viewer reducer
 * (`replayViewerReducer`) live in the engine's own test suite under
 * apps/shared/tcg-core.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("ReplayViewerPage — engine + tRPC wiring", () => {
  const SRC = read("apps/client/src/pages/ReplayViewerPage.tsx");

  it("imports replayMatch + replayViewerReducer from the shared engine", () => {
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?replayMatch[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?replayViewerReducer[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
  });

  it("uses the client-side card registry (not the server's)", () => {
    expect(SRC).toMatch(
      /import\s*\{\s*clientRegistry\s*\}\s*from\s*["']@\/game\/duelyst\/TcgClient["']/,
    );
    expect(SRC).toMatch(/registry:\s*clientRegistry/);
  });

  it("fetches via the public getReplayByToken endpoint", () => {
    // public, no auth — share-link must work for logged-out viewers.
    expect(SRC).toMatch(/trpc\.replay\.getReplayByToken\.useQuery/);
    // Pass the token from the URL.
    expect(SRC).toMatch(/shareToken:\s*token\s*\?\?\s*["']{2}/);
  });

  it("guards the query against an empty token (URL without param)", () => {
    expect(SRC).toMatch(/enabled:\s*!!token/);
  });

  it("memoizes the engine replay computation across renders", () => {
    // Re-running through the reducer is deterministic but not free
    // for long matches, and the viewer reducer below depends on the
    // result by reference identity — recomputing every render would
    // reset the scrubber.
    expect(SRC).toMatch(/useMemo<[\s\S]*?>\(\(\)\s*=>/);
  });

  it("driver useEffect auto-pauses when scrubbed past the final step", () => {
    // The auto-play loop must stop dispatching `step_forward` once
    // currentStep >= total, otherwise the scrubber pings forever.
    expect(SRC).toMatch(/state\.currentStep\s*>=\s*total/);
    expect(SRC).toMatch(/dispatch\(\{\s*kind:\s*["']pause["']\s*\}\)/);
  });

  it("renders a graceful fallback for legacy rows missing matchId/seed/rulesVersion", () => {
    // Verification PR #236 backfilled matchId; rows produced by
    // the pre-#236 producer can't be reconstructed because the
    // engine seeds card-instance ids with matchId. The page must
    // surface that as "step viewer unavailable" rather than crash.
    expect(SRC).toMatch(/kind:\s*["']incomplete["']/);
    expect(SRC).toMatch(/Step viewer unavailable/);
  });

  it("renders a real fallback shell for missing token / loading / error / 404", () => {
    expect(SRC).toMatch(/Missing share token in URL/);
    expect(SRC).toMatch(/Loading replay/);
    expect(SRC).toMatch(/Couldn't load this replay/);
    expect(SRC).toMatch(/Replay not found/);
  });
});

describe("ReplayViewerPage — App.tsx route registration", () => {
  const APP = read("apps/client/src/App.tsx");

  it("imports ReplayViewerPage as a lazy chunk", () => {
    expect(APP).toMatch(
      /const\s+ReplayViewerPage\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*["']\.\/pages\/ReplayViewerPage["']\s*\)\s*\)/,
    );
  });

  it("registers the /replay/:token route", () => {
    expect(APP).toMatch(
      /<Route\s+path=["']\/replay\/:token["']\s+component=\{ReplayViewerPage\}/,
    );
  });

  it("the /replay/:token route is NOT wrapped in AuthGate / ProtectedRoute", () => {
    // Public share-link must work for logged-out viewers. A naive
    // refactor that wraps the Switch in an AuthGate would silently
    // gate share-links behind auth — guard that.
    const replayRouteIdx = APP.indexOf('path="/replay/:token"');
    expect(replayRouteIdx).toBeGreaterThan(0);

    // Walk back from the route line to the nearest opening JSX tag
    // and confirm it isn't ProtectedRoute. The nearest enclosing
    // wrapper is the Switch from <RouteErrorBoundary><Suspense>...
    // <Switch>; both are auth-agnostic.
    const before = APP.slice(0, replayRouteIdx);
    const lastWrapperOpen = Math.max(
      before.lastIndexOf("<ProtectedRoute"),
      before.lastIndexOf("<AuthGate"),
    );
    const lastWrapperClose = Math.max(
      before.lastIndexOf("</ProtectedRoute>"),
      before.lastIndexOf("</AuthGate>"),
    );
    // Either no auth wrapper appears at all (-1) or the most recent
    // one already closed before this route.
    expect(lastWrapperOpen).toBeLessThanOrEqual(lastWrapperClose);
  });
});
