/* ═══════════════════════════════════════════════════════
   CampaignRunPage — wiring + resolver contract tests

   Component-render tests would require a tRPC + GameContext
   harness this repo doesn't yet have; instead we use:

     1. Direct unit tests for `resolveActiveEncounter` (the
        pure manifest → opponent resolver — no React).
     2. Source-scan tests pinning the wiring contract
        (matches the existing useLivingUniverseSync /
        useNpcDialogTree test pattern).
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { resolveActiveEncounter } from "./CampaignRunPage";
import { ACT_4_MANIFEST } from "@shared/campaign/manifests/act4";
import type {
  ActManifest,
  ActSurfaceLadder,
  ActSurfaceInterlude,
  ActSurfaceSingle,
} from "@shared/campaign/actManifest";

const PAGE_SRC = fs.readFileSync(
  path.resolve(__dirname, "CampaignRunPage.tsx"),
  "utf-8",
);
const ADAPTER_SRC = fs.readFileSync(
  path.resolve(__dirname, "act4Adapter.tsx"),
  "utf-8",
);
const ACT4_SRC = fs.readFileSync(
  path.resolve(__dirname, "Act4MatchPage.tsx"),
  "utf-8",
);

describe("resolveActiveEncounter — pure manifest → opponent resolver", () => {
  it("returns the first branch whose `requires` flag is set", () => {
    expect(
      resolveActiveEncounter(ACT_4_MANIFEST, new Set(["act1_path_A"]))
        ?.encounterId,
    ).toBe("act4_the_bridge");
  });

  it("respects declaration order (Path C wins over Path B when both flags are set)", () => {
    expect(
      resolveActiveEncounter(
        ACT_4_MANIFEST,
        new Set(["act3_full_secret", "act3_partial_share"]),
      )?.encounterId,
    ).toBe("act4_the_betrayal");
  });

  it("returns null when no branch matches and no defaultBranch is set (Act 4 path-not-resolved)", () => {
    expect(
      resolveActiveEncounter(ACT_4_MANIFEST, new Set(["unrelated_flag"])),
    ).toBeNull();
  });

  it("falls back to defaultBranch when a branching surface has one", () => {
    const manifest: ActManifest = {
      ...ACT_4_MANIFEST,
      surface: {
        mode: "branching",
        branches: [
          {
            requires: "never_set",
            encounter: {
              encounterId: "ghost",
              name: "Ghost",
              faction: "neutral",
            },
          },
        ],
        defaultBranch: {
          encounterId: "fallback",
          name: "Fallback",
          faction: "neutral",
        },
      },
    };
    expect(
      resolveActiveEncounter(manifest, new Set())?.encounterId,
    ).toBe("fallback");
  });

  it("returns the single encounter for single-mode manifests", () => {
    const surface: ActSurfaceSingle = {
      mode: "single",
      encounter: {
        encounterId: "boss",
        name: "Boss",
        faction: "neutral",
      },
    };
    const manifest: ActManifest = { ...ACT_4_MANIFEST, surface };
    expect(
      resolveActiveEncounter(manifest, new Set())?.encounterId,
    ).toBe("boss");
  });

  it("returns null for ladder + interlude surfaces (not yet wired into the page)", () => {
    const ladder: ActSurfaceLadder = {
      mode: "ladder",
      opponents: [
        { encounterId: "x", name: "x", faction: "neutral" },
      ],
    };
    const interlude: ActSurfaceInterlude = {
      mode: "interlude",
      dialogTreeId: "t",
    };
    expect(
      resolveActiveEncounter({ ...ACT_4_MANIFEST, surface: ladder }, new Set()),
    ).toBeNull();
    expect(
      resolveActiveEncounter(
        { ...ACT_4_MANIFEST, surface: interlude },
        new Set(),
      ),
    ).toBeNull();
  });
});

describe("CampaignRunPage — source-scan wiring", () => {
  it("throws clearly for surface modes that have no consumer yet (so the next migration fails loud)", () => {
    expect(PAGE_SRC).toMatch(
      /not yet implemented in CampaignRunPage|not yet implemented/i,
    );
    expect(PAGE_SRC).toContain('manifest.surface.mode !== "branching"');
  });

  it("exposes the `CampaignActAdapter` interface other acts can implement", () => {
    expect(PAGE_SRC).toMatch(/export interface CampaignActAdapter/);
  });

  it("delegates per-act CONTENT to the adapter's render functions", () => {
    for (const fn of [
      "renderResolvingPanel",
      "renderMatchupPanel",
      "renderPostMatchPanel",
    ]) {
      expect(PAGE_SRC, fn).toMatch(new RegExp(`adapter\\.${fn}\\(`));
    }
  });

  it("delegates per-act SIDE EFFECTS to the adapter's lifecycle hooks", () => {
    expect(PAGE_SRC).toMatch(/adapter\.onWin\?\.\(/);
    expect(PAGE_SRC).toMatch(/adapter\.onLoss\?\.\(/);
    expect(PAGE_SRC).toMatch(/adapter\.beforeBattle\?\.\(/);
  });

  it("owns the battle layer itself (DuelystGameUI + ActNOpponentTauntOverlay) — adapters do NOT re-render battle", () => {
    expect(PAGE_SRC).toContain("<DuelystGameUI");
    expect(PAGE_SRC).toContain("<ActNOpponentTauntOverlay");
    // The adapter interface MUST NOT include a battle renderer.
    expect(PAGE_SRC).not.toMatch(/renderBattlePanel/);
  });

  it("derives narrative flag set from useGame() context", () => {
    expect(PAGE_SRC).toContain('from "@/contexts/GameContext"');
    expect(PAGE_SRC).toContain("gameState.narrativeFlags");
  });
});

describe("ACT_4_ADAPTER — parity with the prior Act4MatchPage side effects", () => {
  it("preserves Path C cross-game beat: the_programmers_math_loredex_act4_line", () => {
    expect(ADAPTER_SRC).toContain(
      'fireCrossGameBeat("the_programmers_math_loredex_act4_line")',
    );
  });

  it("preserves all three companion-comment fires (Path A / B / C)", () => {
    expect(ADAPTER_SRC).toContain('fireCompanionComment("act4_pathA_complete")');
    expect(ADAPTER_SRC).toContain('fireCompanionComment("act4_pathB_complete")');
    expect(ADAPTER_SRC).toContain('fireCompanionComment("act4_pathC_complete")');
    expect(ADAPTER_SRC).toContain('fireCompanionComment("act4_army_unlocked")');
  });

  it("preserves the wheel-followup outcome flag (act4_outcome_<outcome>)", () => {
    expect(ADAPTER_SRC).toContain("act4DialogPathToOutcome");
    expect(ADAPTER_SRC).toContain("act4_outcome_");
  });

  it("preserves the chapter-intro fire on Path C via beforeBattle", () => {
    expect(ADAPTER_SRC).toContain("resolveChapterIntroForOpponent");
    expect(ADAPTER_SRC).toContain("chapterIntroTriggerFlag");
  });

  it("preserves the watcher faction backdrop and the room-bridge living background", () => {
    expect(ADAPTER_SRC).toContain('factionBackdrop: "watcher"');
    expect(ADAPTER_SRC).toContain('art/rooms/room-bridge.png');
  });

  it("preserves the act4_revelation_complete + act4_army_unlocked flag writes on win", () => {
    expect(ADAPTER_SRC).toContain('setNarrativeFlag("act4_revelation_complete", true)');
    expect(ADAPTER_SRC).toContain('setNarrativeFlag("act4_army_unlocked", true)');
  });

  it("binds the canonical Act 4 outcome store + dialog resolver", () => {
    expect(ADAPTER_SRC).toContain("useAct4MatchStore");
    expect(ADAPTER_SRC).toContain("resolveAct4Dialog");
    expect(ADAPTER_SRC).toContain("ACT_4_OPPONENTS");
  });
});

describe("Act4MatchPage — slimmed to a manifest binding", () => {
  it("composes CampaignRunPage with the canonical Act 4 manifest + adapter", () => {
    expect(ACT4_SRC).toContain('from "./CampaignRunPage"');
    expect(ACT4_SRC).toContain('from "./act4Adapter"');
    expect(ACT4_SRC).toContain(
      'from "@shared/campaign/manifests/act4"',
    );
    expect(ACT4_SRC).toContain("ACT_4_MANIFEST");
    expect(ACT4_SRC).toContain("ACT_4_ADAPTER");
  });

  it("no longer imports DuelystGameUI, framer-motion, the taunt overlay, or any per-view JSX helpers", () => {
    // These all moved into CampaignRunPage + the adapter — the page
    // file should be ~20 lines.
    expect(ACT4_SRC).not.toContain("DuelystGameUI");
    expect(ACT4_SRC).not.toContain("framer-motion");
    expect(ACT4_SRC).not.toContain("ActNOpponentTauntOverlay");
    expect(ACT4_SRC).not.toContain("AnimatePresence");
  });

  it("is small — confirms the migration actually slimmed the surface", () => {
    // Hard cap so a future drift adds back to this file would fail
    // the gate (forcing the addition to land in the adapter or
    // CampaignRunPage instead).
    expect(ACT4_SRC.split("\n").length).toBeLessThan(30);
  });
});
