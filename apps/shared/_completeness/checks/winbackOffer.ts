/**
 * Winback (comeback) offer integrity parity check.
 *
 * A lapsed-player offer is only worth anything if it (a) actually
 * grants, (b) is capped, and (c) cannot be farmed by toggling
 * activity. This gate binds those invariants so a refactor can't
 * leave a hollow offer (looks present, never grants) or a farmable
 * one (re-claimable for the same lapse).
 *
 * Hard parity:
 *   1. winbackOfferService exports getWinbackOffer + claimWinbackOffer.
 *   2. The three lapse tiers exist (drifting/lapsed/lost).
 *   3. The reward is capped (REWARD_CAP) — not an unbounded faucet.
 *   4. The claim re-reads the claim marker inside the transaction and
 *      rejects an already-claimed lapse (idempotent / anti-farm) and
 *      actually credits dreamBalance.
 *   5. The winback router is registered in the appRouter.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const SVC = "apps/server/services/winbackOfferService.ts";
const ROUTERS = "apps/server/routers.ts";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkWinbackOffer(): RawParityCount {
  const svc = read(SVC);
  const routers = read(ROUTERS);
  const missing: string[] = [];

  if (
    !/export async function getWinbackOffer/.test(svc) ||
    !/export async function claimWinbackOffer/.test(svc)
  ) {
    missing.push(`${SVC}: getWinbackOffer/claimWinbackOffer not exported`);
  }

  if (
    !/"drifting"/.test(svc) ||
    !/"lapsed"/.test(svc) ||
    !/"lost"/.test(svc)
  ) {
    missing.push(`${SVC}: lapse tier classification missing`);
  }

  if (!/REWARD_CAP/.test(svc) || !/Math\.min\(\s*REWARD_CAP/.test(svc)) {
    missing.push(`${SVC}: reward not capped by REWARD_CAP (faucet risk)`);
  }

  const idempotent =
    /db\.transaction\(/.test(svc) &&
    /claims\.includes\(\s*offer\.lapseKey\s*\)/.test(svc) &&
    /already_claimed/.test(svc);
  const grants = /dreamBalance\.dreamTokens\}\s*\+\s*\$\{offer\.rewardDream/.test(
    svc,
  );
  if (!idempotent) {
    missing.push(
      `${SVC}: claim is not idempotent (no in-tx re-check of the lapse-key marker)`,
    );
  }
  if (!grants) {
    missing.push(`${SVC}: claim does not credit dreamBalance (hollow offer)`);
  }

  if (
    !/import \{ winbackRouter \} from ".\/routers\/winback"/.test(routers) ||
    !/\bwinback:\s*winbackRouter\b/.test(routers)
  ) {
    missing.push(`${ROUTERS}: winback router not registered in appRouter`);
  }

  const declared = 6;
  return { declared, implemented: declared - missing.length, missing };
}
