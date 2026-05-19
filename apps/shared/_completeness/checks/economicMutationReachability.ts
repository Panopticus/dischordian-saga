/**
 * Economic-mutation client-reachability parity check.
 *
 * The repo gates that economic surfaces are *transactional*
 * (db.economic_transaction_coverage) — but a transactional server
 * mutation with no client caller is still dead: the player can never
 * reach it. That is the exact information-asymmetry this gate suite
 * exists to close ("server logic exists" ≠ "the loop is shipped").
 *
 * The prestige NG+ reset was the canonical instance: `prestige.execute`
 * was fully wired and transactional server-side, yet the only client
 * reference was a `getState` read — `PrestigeCycleResetPage.tsx` ran a
 * local GameContext reducer and never invoked the durable mutation, so
 * the marquee meta-progression loop persisted nothing.
 *
 * Each marquee economic mutation below must have at least one non-test
 * client `trpc.<router>.<procedure>.useMutation` binding somewhere
 * under apps/client/src. Hard parity — deleting the front door (a
 * refactor that drops the only caller) fails the gate instead of
 * silently reverting the loop to backend-only.
 *
 * Adding a new player-economic mutation router means adding it here
 * with its client surface in the same change.
 */
import * as fs from "node:fs";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";
import * as path from "node:path";

interface EconomicMutation {
  router: string;
  procedure: string;
  reason: string;
}

const ECONOMIC_MUTATIONS: ReadonlyArray<EconomicMutation> = [
  {
    router: "prestige",
    procedure: "execute",
    reason:
      "NG+ reset (level→1, room re-lock, 10% currency carryover, BP/quest wipe, tier++) — the marquee meta-progression loop",
  },
  {
    router: "battlePass",
    procedure: "upgradePremium",
    reason: "premium-pass purchase — primary battle-pass conversion path",
  },
  {
    router: "crafting",
    procedure: "craftRecipe",
    reason: "card/suit crafting spend — core card-upgrade economy sink",
  },
  {
    router: "quests",
    procedure: "claimReward",
    reason: "daily-quest reward claim — the daily-loop faucet",
  },
];

export function checkEconomicMutationReachability(): RawParityCount {
  const clientSrc = path.join(REPO_ROOT, "apps/client/src");
  const files = walkSourceFiles(clientSrc, { includeTests: false });
  const corpus = files
    .map((f) => {
      try {
        return fs.readFileSync(f, "utf-8");
      } catch {
        return "";
      }
    })
    .join("\n");

  const missing: string[] = [];
  for (const m of ECONOMIC_MUTATIONS) {
    const re = new RegExp(
      `trpc\\.${m.router}\\.${m.procedure}\\.useMutation`,
    );
    if (!re.test(corpus)) {
      missing.push(
        `trpc.${m.router}.${m.procedure}: transactional server mutation has ` +
          `no client useMutation caller — backend with no front door (${m.reason})`,
      );
    }
  }
  return {
    declared: ECONOMIC_MUTATIONS.length,
    implemented: ECONOMIC_MUTATIONS.length - missing.length,
    missing,
  };
}
