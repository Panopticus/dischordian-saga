/**
 * PreludePage — structural + integration source-scan tests.
 *
 * Per repo convention (see FamilyTreeView.test.tsx) we don't render
 * components at runtime — @testing-library/react isn't in the tree.
 * Instead these tests assert the three invariants that make the
 * Prelude routable:
 *
 *   1. PreludePage exports a default component and mounts the
 *      GameContext-aware PreludeSequencePlayerConnected wrapper.
 *   2. The `/prelude` route is registered in App.tsx.
 *   3. BridgeConsole (the "/" landing) redirects unfinished-prelude
 *      players to `/prelude`.
 *
 * Collectively these three checks guard against a regression back to
 * the PR-A ship-blocker (Prelude orchestrator authored but never
 * reachable from any route).
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import PreludePage from "./PreludePage";

const REPO_ROOT = path.resolve(__dirname, "../../../..");

describe("PreludePage", () => {
  it("exports a component function as default", () => {
    expect(PreludePage).toBeDefined();
    expect(typeof PreludePage).toBe("function");
  });

  it("mounts PreludeSequencePlayerConnected (not the pure base player)", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "PreludePage.tsx"),
      "utf-8",
    );
    expect(src).toContain("PreludeSequencePlayerConnected");
  });

  it("gates on narrativeFlags.prelude_complete", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "PreludePage.tsx"),
      "utf-8",
    );
    expect(src).toContain("narrativeFlags?.prelude_complete");
  });

  it("redirects completed-Prelude players to /ark", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "PreludePage.tsx"),
      "utf-8",
    );
    expect(src).toMatch(/navigate\(["']\/ark["']/);
  });
});

describe("App.tsx — /prelude route registration", () => {
  const appSrc = fs.readFileSync(
    path.resolve(REPO_ROOT, "apps/client/src/App.tsx"),
    "utf-8",
  );

  it("lazy-imports PreludePage", () => {
    expect(appSrc).toContain(
      'const PreludePage = lazy(() => import("./pages/PreludePage"))',
    );
  });

  it("registers the /prelude route", () => {
    expect(appSrc).toContain('<Route path="/prelude"');
    expect(appSrc).toMatch(/component=\{PreludePage\}/);
  });
});

describe("BridgeConsole — fresh-save redirect", () => {
  const src = fs.readFileSync(
    path.resolve(REPO_ROOT, "apps/client/src/pages/BridgeConsole.tsx"),
    "utf-8",
  );

  it("imports useLocation from wouter", () => {
    expect(src).toMatch(/import\s+\{[^}]*useLocation[^}]*\}\s+from\s+"wouter"/);
  });

  it("redirects players without prelude_complete to /prelude", () => {
    expect(src).toMatch(/if\s*\(!preludeComplete\)\s*navigate\(["']\/prelude["']/);
  });

  it("uses replace: true so the redirect does not pollute history", () => {
    // Without replace, browser back button would trap the player on the
    // Prelude page. Match is lenient on whitespace/line-break formatting.
    expect(src).toMatch(/navigate\(["']\/prelude["'],\s*\{\s*replace:\s*true\s*\}\)/);
  });
});
