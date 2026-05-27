/* ═══════════════════════════════════════════════════════
   ACT_4_MANIFEST — canonical contract tests

   Pins the manifest's resolution semantics to the existing
   in-page resolver (`resolveAct4Dialog` +
   `ACT_4_OPPONENTS`) so the upcoming CampaignRunPage swap
   cannot regress Act 4 behavior — drift between the
   manifest and the existing data layer fails the gate.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { ACT_4_MANIFEST } from "./act4";
import {
  listManifestOpponents,
  manifestHasBattles,
} from "../actManifest";
import { ACT_4_OPPONENTS } from "../../acts2to7Opponents";
import { resolveAct4Dialog } from "../../act4OpponentDialog";

describe("ACT_4_MANIFEST — shape", () => {
  it("declares actId '4' (string form, not numeric)", () => {
    expect(ACT_4_MANIFEST.actId).toBe("4");
  });

  it("uses the canonical act4 dialog bank", () => {
    expect(ACT_4_MANIFEST.defaultDialogBankId).toBe("act4OpponentDialog");
  });

  it("ships as a branching surface with three branches and no defaultBranch", () => {
    expect(ACT_4_MANIFEST.surface.mode).toBe("branching");
    if (ACT_4_MANIFEST.surface.mode !== "branching") return;
    expect(ACT_4_MANIFEST.surface.branches.length).toBe(3);
    expect(ACT_4_MANIFEST.surface.defaultBranch).toBeUndefined();
  });

  it("manifestHasBattles is true (Act 4 is not a pure interlude)", () => {
    expect(manifestHasBattles(ACT_4_MANIFEST)).toBe(true);
  });

  it("listManifestOpponents returns three encounters", () => {
    expect(listManifestOpponents(ACT_4_MANIFEST)).toHaveLength(3);
  });
});

describe("ACT_4_MANIFEST — encounter ids resolve against ACT_4_OPPONENTS", () => {
  const knownIds = new Set(ACT_4_OPPONENTS.map((o) => o.id));

  it("every branch encounterId exists in ACT_4_OPPONENTS", () => {
    for (const opp of listManifestOpponents(ACT_4_MANIFEST)) {
      expect(knownIds.has(opp.encounterId), opp.encounterId).toBe(true);
    }
  });

  it("references the three canonical Path A / B / C ids", () => {
    const ids = listManifestOpponents(ACT_4_MANIFEST)
      .map((o) => o.encounterId)
      .sort();
    expect(ids).toEqual(
      ["act4_the_betrayal", "act4_the_bridge", "act4_the_discovery"].sort(),
    );
  });

  it("faction values mirror each opponent's deckLeaning[0]", () => {
    if (ACT_4_MANIFEST.surface.mode !== "branching") return;
    for (const branch of ACT_4_MANIFEST.surface.branches) {
      const opp = ACT_4_OPPONENTS.find((o) => o.id === branch.encounter.encounterId);
      expect(opp, branch.encounter.encounterId).toBeDefined();
      expect(branch.encounter.faction).toBe(opp!.deckLeaning[0]);
    }
  });
});

describe("ACT_4_MANIFEST — branch order matches the existing resolver", () => {
  // The branching surface resolves via "first branch whose `requires`
  // flag is set." For Act 4 the precedence is canonically:
  //   1. act1_path_A      (Path A wins outright)
  //   2. act3_full_secret (Path C beats Path B when both are set)
  //   3. act3_partial_share
  // The tests below assert each input flag set resolves to the same
  // encounter the existing `resolveAct4Dialog()` produces — drift
  // would surface as a behavior change on the upcoming
  // CampaignRunPage swap.
  if (ACT_4_MANIFEST.surface.mode !== "branching") {
    throw new Error("ACT_4_MANIFEST is not branching — test setup broken");
  }
  const branches = ACT_4_MANIFEST.surface.branches;

  function resolveManifest(flags: Set<string>): string | null {
    for (const b of branches) {
      if (flags.has(b.requires)) return b.encounter.encounterId;
    }
    return null;
  }

  it("Path A only → act4_the_bridge (matches resolver)", () => {
    const flags = new Set(["act1_path_A"]);
    expect(resolveManifest(flags)).toBe("act4_the_bridge");
    expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_bridge");
  });

  it("act3_full_secret only → act4_the_betrayal (matches resolver)", () => {
    const flags = new Set(["act3_full_secret"]);
    expect(resolveManifest(flags)).toBe("act4_the_betrayal");
    expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_betrayal");
  });

  it("act3_partial_share only → act4_the_discovery (matches resolver)", () => {
    const flags = new Set(["act3_partial_share"]);
    expect(resolveManifest(flags)).toBe("act4_the_discovery");
    expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_discovery");
  });

  it("Path A + Path C (both flags) → Path A wins on both sides", () => {
    const flags = new Set(["act1_path_A", "act3_full_secret"]);
    expect(resolveManifest(flags)).toBe("act4_the_bridge");
    expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_bridge");
  });

  it("Path B + Path C (both flags) → Path C wins on both sides (precedence)", () => {
    const flags = new Set(["act3_partial_share", "act3_full_secret"]);
    expect(resolveManifest(flags)).toBe("act4_the_betrayal");
    expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_betrayal");
  });

  it("no relevant flags → both return null (path not yet resolved)", () => {
    const flags = new Set(["unrelated_flag"]);
    expect(resolveManifest(flags)).toBeNull();
    expect(resolveAct4Dialog(flags)).toBeNull();
  });
});
