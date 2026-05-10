/* ═══════════════════════════════════════════════════════
   useHumanRevealTrigger

   Watches narrative state for the Act 6+ "settling moment" and
   fires the matching cutscene_human_reveal_<branch>_triggered
   flag when:
     - the breaking-point flags or convergence-active flag have
       resolved (`deriveHumanRevealBranch` returns non-null)
     - AND the player is in Act 6+ (so the reveal pays off the
       earlier choice)
     - AND no other human-reveal variant has been seen yet

   Mounted once at the App root as a side-effect-only watcher,
   mirrors useFirstHumanContactTrigger.

   Pure decision function exported for unit testing.
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  deriveHumanRevealBranch,
  HUMAN_REVEAL_BRANCHES,
  type HumanRevealBranch,
} from "@shared/humanRevealVariants";

export const humanRevealTriggerFlag = (
  branch: HumanRevealBranch,
): string => `cutscene_human_reveal_${branch}_triggered`;
export const humanRevealSeenFlag = (branch: HumanRevealBranch): string =>
  `cutscene_human_reveal_${branch}_seen`;

export const HUMAN_REVEAL_BRANCH_RESOLVED_FLAG =
  "human_reveal_branch_resolved";

const ACT_6_GATE_FLAG = "act_6_started";

export interface HumanRevealTriggerDecisionInput {
  narrativeAct: number;
  flags: Readonly<Record<string, boolean | undefined>>;
}

/** Pure decision function: should we fire a human-reveal trigger
 *  flag now, and if so for which branch? Returns null when no
 *  fire is warranted (already seen, branch unresolved, or pre-
 *  Act 6). */
export function pickHumanRevealBranchToFire(
  input: HumanRevealTriggerDecisionInput,
): HumanRevealBranch | null {
  const { narrativeAct, flags } = input;
  // Once any human-reveal variant has been seen, none of the
  // others should fire — the resolved branch is sticky.
  if (flags[HUMAN_REVEAL_BRANCH_RESOLVED_FLAG] === true) return null;
  for (const branch of HUMAN_REVEAL_BRANCHES) {
    if (flags[humanRevealSeenFlag(branch)] === true) return null;
  }
  // Act gate — Bible: variants fire Act 6+ when the path has
  // settled. Pre-Act-6 paths haven't earned the reveal yet.
  const inAct6Plus =
    narrativeAct >= 6 || flags[ACT_6_GATE_FLAG] === true;
  if (!inAct6Plus) return null;

  const branch = deriveHumanRevealBranch(flags);
  if (!branch) return null;

  // If the trigger is already set (router will pick it up next
  // render), don't redundantly re-write it.
  if (flags[humanRevealTriggerFlag(branch)] === true) return null;

  return branch;
}

export function useHumanRevealTrigger(): void {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};
  const narrativeAct = state.narrativeAct ?? 0;

  useEffect(() => {
    const branch = pickHumanRevealBranchToFire({
      narrativeAct,
      flags: flags as Record<string, boolean | undefined>,
    });
    if (branch) {
      setNarrativeFlag(humanRevealTriggerFlag(branch), true);
    }
  }, [narrativeAct, flags, setNarrativeFlag]);
}
