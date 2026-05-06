/**
 * CivilopediaPage — structural integration tests.
 *
 * Per repo convention (see PreludePage.test.tsx, FamilyTreeView.test.tsx),
 * components are not rendered at runtime — @testing-library/react isn't
 * in the tree. Instead these tests assert the wiring invariants that
 * make the page reachable + functional:
 *
 *   1. Page exports a default component.
 *   2. The /civilopedia route is registered in App.tsx.
 *   3. AppShell sidebar lists the Civilopedia entry under "The Lore".
 *   4. ProtectedRoute + LoadingScreen know the route maps to the
 *      "archives" room (so the room-based gates stay consistent).
 *   5. Page imports the canonical CIVILOPEDIA_INDEX surface.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import CivilopediaPage from "./CivilopediaPage";

const REPO_ROOT = path.resolve(__dirname, "../../../..");

function readFile(rel: string): string {
  return fs.readFileSync(path.resolve(REPO_ROOT, rel), "utf-8");
}

describe("CivilopediaPage", () => {
  it("exports a component function as default", () => {
    expect(CivilopediaPage).toBeDefined();
    expect(typeof CivilopediaPage).toBe("function");
  });

  it("imports the canonical CIVILOPEDIA_INDEX from @shared/civilopedia", () => {
    const src = readFile("apps/client/src/pages/CivilopediaPage.tsx");
    expect(src).toMatch(/from\s+["']@shared\/civilopedia["']/);
    expect(src).toContain("CIVILOPEDIA_INDEX");
    expect(src).toContain("getCivilopediaEntry");
    expect(src).toContain("searchCivilopedia");
  });

  it("/civilopedia route is registered in App.tsx", () => {
    const src = readFile("apps/client/src/App.tsx");
    expect(src).toContain('lazy(() => import("./pages/CivilopediaPage"))');
    expect(src).toMatch(/<Route\s+path="\/civilopedia"\s+component={CivilopediaPage}\s*\/>/);
  });

  it("AppShell sidebar lists the Civilopedia entry", () => {
    const src = readFile("apps/client/src/components/AppShell.tsx");
    expect(src).toContain('path: "/civilopedia"');
    expect(src).toContain('"CIVILOPEDIA"');
  });

  it("/civilopedia maps to the archives room (ProtectedRoute + LoadingScreen)", () => {
    const protectedSrc = readFile("apps/client/src/components/ProtectedRoute.tsx");
    expect(protectedSrc).toContain('"/civilopedia": "archives"');
    const loadingSrc = readFile("apps/client/src/components/LoadingScreen.tsx");
    expect(loadingSrc).toContain('"/civilopedia": "archives"');
  });

  it("renders search input + entry list + detail panel data-testids", () => {
    const src = readFile("apps/client/src/pages/CivilopediaPage.tsx");
    expect(src).toContain('data-testid="civilopedia-search"');
    expect(src).toContain('data-testid="civilopedia-list"');
    expect(src).toContain('data-testid="civilopedia-detail"');
  });
});
