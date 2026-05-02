/* ═══════════════════════════════════════════════════════
   GOVERNANCE CONSEQUENCES — voteId → option → effects.

   Single source of truth for what a community vote actually does
   to the player when they cast it. Authored alongside the vote
   itself (or retrofitted). Read by the server-side consequence
   dispatcher in `architectConsole.submitVote` after a vote is
   recorded.

   The dispatcher applies, per cast:
     1. A profile-delta source id from `playerProfileSources.ts`.
     2. A set of narrative flags written to
        `userProgress.gameData.narrativeFlags`.
     3. (Future, slice 3) a per-option `controlDelta` against
        warTerritories sectors — wired in `governanceFrontBindings.ts`.

   Unknown voteIds are tolerated — the cast is still recorded,
   it just carries no consequence. Adding a new vote means adding
   a row here, not editing the dispatcher.

   Versioning: bump CONSEQUENCES_VERSION when changing the shape
   of any entry so retroactive edits don't silently re-apply to
   already-closed votes (the dispatcher records the version on the
   playerVotes row at apply-time).
   ═══════════════════════════════════════════════════════ */

import type { VoteOptionEyeFraming } from "./governance";

/** Bumped when the shape of a consequence row changes in a way
 *  that would affect already-recorded casts. */
export const CONSEQUENCES_VERSION = 1;

/** Per-option consequence row. Authored once per vote; consumed
 *  by the dispatcher on every cast for that option. */
export interface OptionConsequence {
  /** Confirm / Look-Away / Neutral classification. Drives the
   *  generic `governance_vote:<framing>` profile source unless
   *  overridden by `profileSource`. */
  eyeFraming: VoteOptionEyeFraming;
  /** Override the default profile source. When set, the dispatcher
   *  uses this instead of the eyeFraming-derived source. Use for
   *  votes whose narrative weight is greater than the generic
   *  ±2 baseline. */
  profileSource?: string;
  /** Narrative flags to set on the player's userProgress.gameData
   *  when this option is cast. Always set; never unset. */
  narrativeFlags?: ReadonlyArray<string>;
  /** Optional reward-card grant override. The base grant lives on
   *  voteOptions.rewardOnWin and is given to *winners* on close;
   *  this is a per-cast reward applied immediately to anyone who
   *  picks this option. Use sparingly — meant for "the act of
   *  voting earns you something" cases like Vote #0. */
  immediateRewardCardId?: string;
}

/** Per-vote consequence row. Keyed by the vote's stable id (the
 *  same string used as `communityVotes.voteId` and the synthetic
 *  `vote_zero_eye` Vote #0 id). */
export interface VoteConsequence {
  /** Map of optionNumber → consequence. optionNumber is 1-based,
   *  matching `voteOptions.optionNumber`. */
  options: Readonly<Record<number, OptionConsequence>>;
  /** Narrative flag set the moment the vote *closes* (on any
   *  outcome). Useful for unlocking downstream Epoch Witness votes
   *  via the existing isVoteUnlocked() machinery. The dispatcher
   *  formats `vote_<id>_closed_<winnerOptionNumber>` for the
   *  per-outcome flag separately, so this list is for outcome-
   *  agnostic flags only. */
  onCloseFlags?: ReadonlyArray<string>;
}

/* ─── REGISTRY ─── */

/** The Vote #0 synthetic id shared by:
 *   - SurveillanceOpening's localStorage payload
 *   - architectConsole.recordVoteZero (server-side persistence)
 *   - the Architect's first-visit ceremony
 *   - the Antiquarian's first Tome inscription
 *  Treat as a magic constant — do not rename. */
export const VOTE_ZERO_ID = "vote_zero_eye";
export const VOTE_ZERO_OPTION_CONFIRM = 1;
export const VOTE_ZERO_OPTION_LOOK_AWAY = 2;

const CONSEQUENCES: Readonly<Record<string, VoteConsequence>> = Object.freeze({
  [VOTE_ZERO_ID]: {
    options: {
      [VOTE_ZERO_OPTION_CONFIRM]: {
        eyeFraming: "confirm",
        profileSource: "vote_zero_eye:confirmed",
        narrativeFlags: ["vote_zero_eye_response_confirmed"],
      },
      [VOTE_ZERO_OPTION_LOOK_AWAY]: {
        eyeFraming: "look_away",
        profileSource: "vote_zero_eye:looked_away",
        narrativeFlags: ["vote_zero_eye_response_looked_away"],
      },
    },
    onCloseFlags: [],
  },
});

/** Look up the consequence row for a given vote + option. Returns
 *  null if the vote is unknown to the registry (so the dispatcher
 *  can degrade gracefully — the cast is still recorded). */
export function getOptionConsequence(
  voteId: string,
  optionNumber: number,
): OptionConsequence | null {
  const row = CONSEQUENCES[voteId];
  if (!row) return null;
  return row.options[optionNumber] ?? null;
}

/** Look up the entire vote-level consequence row (used at close
 *  time for `onCloseFlags`). */
export function getVoteConsequence(voteId: string): VoteConsequence | null {
  return CONSEQUENCES[voteId] ?? null;
}

/** Resolve the profile source id for a cast. If the option has an
 *  explicit `profileSource`, use it; otherwise fall back to the
 *  generic `governance_vote:<framing>` derived from eyeFraming.
 *  Defaults to the neutral source when the option is unknown. */
export function resolveProfileSource(
  voteId: string,
  optionNumber: number,
): string {
  const opt = getOptionConsequence(voteId, optionNumber);
  if (!opt) return "governance_vote:neutral";
  if (opt.profileSource) return opt.profileSource;
  return `governance_vote:${opt.eyeFraming}`;
}

/** All voteIds in the registry — useful for tests + debugging. */
export function listRegisteredVoteIds(): readonly string[] {
  return Object.keys(CONSEQUENCES);
}

/** Internal: exposed only for the test suite to validate registry
 *  shape. Do not import from runtime code. */
export const __INTERNAL_CONSEQUENCES = CONSEQUENCES;
