/* ═══════════════════════════════════════════════════════
   KAEL FRAGMENT F1-F6 WATCHERS

   Pure-function watchers that, given the current narrative
   flag set and a small runtime context, return the list of
   Kael Fragments whose unlock condition is now satisfied.

   The watcher is INTENTIONALLY dumb: it reads flags that
   other systems are already expected to raise (Substrate
   Dungeon completion, Terminus Swarm wave 10, etc.) and
   returns a set of fragments to unlock. The narrative
   integration hook consumes the output and calls
   setNarrativeFlag / emits the ripple event.

   Canonical data: apps/shared/appendixBKaelQuestline.ts
   (KAEL_FRAGMENTS).
   ═══════════════════════════════════════════════════════ */

import { KAEL_FRAGMENTS, type KaelFragmentId } from "./appendixBKaelQuestline";

export interface KaelFragmentWatcherContext {
  /** Ark idle-with-comms-open watcher: minutes elapsed idle. */
  commsIdleMinutesWhileHumanActive?: number;
  /** Trade Empire missions run into the panopticon_ruins sector. */
  panopticonRuinsMissionCount?: number;
  /** Days into the 28-day Celebration Trial. */
  celebrationTrialDay?: number;
  /** Highest apprentice bond while Celebration Trial is active. */
  highestApprenticeBond?: number;
}

/**
 * Given flags + runtime context, return the subset of Fragment
 * ids whose unlock condition is satisfied *and* which have not
 * yet been flagged as unlocked.
 *
 * Caller is responsible for:
 *   - Raising each fragment's `flag`
 *   - Emitting the corresponding ripple event
 *   - Applying any light/dark energy reward
 */
export function pendingKaelFragmentUnlocks(
  flags: Record<string, unknown>,
  ctx: KaelFragmentWatcherContext,
): readonly KaelFragmentId[] {
  const out: KaelFragmentId[] = [];
  for (const frag of KAEL_FRAGMENTS) {
    if (flags[frag.flag]) continue; // Already unlocked.
    if (isFragmentConditionMet(frag.id, flags, ctx)) {
      out.push(frag.id);
    }
  }
  return out;
}

function isFragmentConditionMet(
  id: KaelFragmentId,
  flags: Record<string, unknown>,
  ctx: KaelFragmentWatcherContext,
): boolean {
  switch (id) {
    case "f1":
      // Terminus Swarm Wave 10 first-time completion.
      return Boolean(flags.terminus_swarm_wave_10_first_complete);
    case "f2":
      // Ark idle with Comms Array open, Elara dismissed (Human active),
      // for 30 real-world minutes.
      return (
        Boolean(flags.elara_dismissed) &&
        (ctx.commsIdleMinutesWhileHumanActive ?? 0) >= 30
      );
    case "f3":
      // 6 Trade Empire missions into panopticon_ruins.
      return (ctx.panopticonRuinsMissionCount ?? 0) >= 6;
    case "f4":
      // Substrate Dungeon cleared with The Human as active companion.
      return Boolean(flags.substrate_dungeon_cleared_human_active);
    case "f5":
      // Celebration Trial Day 20 with Apprentice bond ≥ 40,
      // Apprentice Betrayal event triggered.
      return (
        (ctx.celebrationTrialDay ?? 0) >= 20 &&
        (ctx.highestApprenticeBond ?? 0) >= 40 &&
        Boolean(flags.apprentice_betrayal_triggered)
      );
    case "f6":
      // Act 1 Card Game Cycle B complete with Light reading.
      return Boolean(
        flags.act_1_cycle_b_complete && flags.dischordia_cycle_light_reading,
      );
  }
}

/**
 * Has the full Kael questline been completed? True iff all six
 * Fragment flags are set. Consumers should check this and then
 * raise `kael_questline_complete` + fire cinematic bd3.
 */
export function isKaelQuestlineComplete(
  flags: Record<string, unknown>,
): boolean {
  return KAEL_FRAGMENTS.every((f) => Boolean(flags[f.flag]));
}
