/**
 * Server-side replay verification.
 *
 * Wraps the pure `verifyReplay` from `@shared/tcg-core/replay` for use
 * in mutation handlers. Submit handlers pass the action log + claimed
 * final-state hash; the verifier replays the match through the same
 * deterministic reducer and asserts the hash matches.
 *
 * Fail-open by default: if `replayLog` is absent the verifier returns
 * `{ ok: true, verified: false }`. Match handlers can choose to reject
 * absent logs based on a feature flag once clients are migrated.
 *
 * The expensive part of verification is the reduce loop, which is
 * O(actions). For typical matches (≤ 200 actions) this is microseconds.
 */
import {
  verifyReplay,
  type ReplayInput,
} from "@shared/tcg-core/replay/replay";
import type {
  Action,
  CardRegistry,
  MatchConfig,
} from "@shared/tcg-core";
import { logger } from "../logger";

export interface VerifyOptions {
  matchId: string;
  seed: string;
  rulesVersion: string;
  actions: readonly Action[] | undefined;
  expectedFinalHash: string | undefined;
  p1Config: MatchConfig;
  p2Config: MatchConfig;
  registry: CardRegistry;
  /** Caller name for structured logging. */
  source: string;
}

export interface VerifyResult {
  /** Verifier completed without error. */
  ok: boolean;
  /** True iff actions + expectedHash were provided and match. */
  verified: boolean;
  /** Reason for non-verification — useful for the caller to decide
   *  whether to reject or fall through. */
  reason?:
    | "no_action_log"
    | "no_claimed_hash"
    | "hash_mismatch"
    | "incompatible_rules_version"
    | "replay_error";
}

export function verifyMatchReplay(opts: VerifyOptions): VerifyResult {
  if (!opts.actions || opts.actions.length === 0) {
    return { ok: true, verified: false, reason: "no_action_log" };
  }
  if (!opts.expectedFinalHash) {
    return { ok: true, verified: false, reason: "no_claimed_hash" };
  }

  const input: ReplayInput = {
    matchId: opts.matchId,
    seed: opts.seed,
    rulesVersion: opts.rulesVersion,
    actions: opts.actions,
    p1Config: opts.p1Config,
    p2Config: opts.p2Config,
    registry: opts.registry,
  };

  try {
    const matched = verifyReplay(input, opts.expectedFinalHash);
    if (!matched) {
      logger.warn("replay_hash_mismatch", opts.source, {
        matchId: opts.matchId,
        rulesVersion: opts.rulesVersion,
        actionCount: opts.actions.length,
      });
      return { ok: true, verified: false, reason: "hash_mismatch" };
    }
    return { ok: true, verified: true };
  } catch (err) {
    logger.error("replay_verify_error", opts.source, {
      matchId: opts.matchId,
      error: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, verified: false, reason: "replay_error" };
  }
}

/**
 * Whether replay validation is required (mutations should reject
 * unverified results) or optional (log + accept). Default: required
 * in production once `MATCH_REPLAY_REQUIRED=true` is set; otherwise
 * optional. Read per-request so tests can flip mid-suite.
 */
export function isReplayRequired(): boolean {
  return process.env.MATCH_REPLAY_REQUIRED === "true";
}
