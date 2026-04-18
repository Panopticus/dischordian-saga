/**
 * PR-2 — starter-pack auto-claim on Prelude completion.
 *
 * Source-scan tests that lock the claimStarterPack wiring. Before
 * this effect existed the mutation was exposed via tRPC but no UI
 * ever called it; fresh players had an empty collection until they
 * manually opened booster packs.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const hookSrc = fs.readFileSync(
  path.resolve(__dirname, "useNarrativeIntegration.ts"),
  "utf-8",
);

describe("useNarrativeIntegration — starter-pack auto-claim (PR-2)", () => {
  it("imports trpc for mutation access", () => {
    expect(hookSrc).toContain('import { trpc } from "@/lib/trpc"');
  });

  it("instantiates the claimStarterPack mutation", () => {
    expect(hookSrc).toContain(
      "trpc.cardGame.claimStarterPack.useMutation()",
    );
  });

  it("gates the auto-claim on prelude_complete", () => {
    expect(hookSrc).toMatch(
      /if\s*\(!state\.narrativeFlags\?\.prelude_complete\)\s*return/,
    );
  });

  it("short-circuits once starter_pack_claimed is set", () => {
    expect(hookSrc).toContain("starter_pack_claimed");
  });

  it("raises starter_pack_claimed on the mutation resolution", () => {
    expect(hookSrc).toMatch(
      /setNarrativeFlag\(\s*["']starter_pack_claimed["']\s*,\s*true\s*\)/,
    );
  });

  it("retries on transient error (does not pin the flag until success)", () => {
    // The onError branch must reset the in-flight ref so a later
    // render can retry — otherwise a single network failure
    // permanently orphans the player with no cards.
    expect(hookSrc).toMatch(/onError:/);
    expect(hookSrc).toMatch(/starterPackClaimedRef\.current\s*=\s*false/);
  });

  it("surfaces a toast on a fresh claim (not on subsequent idempotent calls)", () => {
    // result.success is the server's signal that the claim actually
    // happened this call (vs. the idempotent-no-op branch). Only
    // then should the toast fire.
    expect(hookSrc).toMatch(/result\?\.success/);
    expect(hookSrc).toMatch(/Starter deck unlocked/);
  });
});

describe("BridgeConsole — Play Dischordia quick-entry (PR-2)", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "../pages/BridgeConsole.tsx"),
    "utf-8",
  );

  it("registers a Play Dischordia button", () => {
    expect(src).toContain('data-testid="bridge-play-dischordia"');
  });

  it("routes unfinished-Act-1 players to /story and finished players to /duelyst", () => {
    expect(src).toMatch(/navigate\(\s*act1Done\s*\?\s*["']\/duelyst["']\s*:\s*["']\/story["']/);
  });
});
