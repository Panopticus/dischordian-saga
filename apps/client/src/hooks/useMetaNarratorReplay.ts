/* ═══════════════════════════════════════════════════════
   useMetaNarratorReplay — Bandersnatch Move 2

   Fires the meta:* companion-comment triggers (authored in
   apps/shared/companionComments.ts) based on prestige cycle
   count, active path flags, and stance commitments. The
   Antiquarian's voice acknowledges that there is a player —
   not the playerCharacter, the actual person making decisions
   across runs — without breaking the fourth wall hard enough
   to feel like a different game.

   Triggers and conditions:

     meta:first_run_complete       — first time act_7_complete
                                      is true on the sheet
     meta:second_run_starts        — prestige tier 1, sheet not
                                      yet act_7_complete this cycle
     meta:third_run_starts         — prestige tier >= 2, ditto
     meta:second_run_finished      — prestige tier 1, act_7_complete
     meta:path_full_secret_committed — flag act3_full_secret
     meta:humanity_path_third_time — humanity_run_count >= 3
     meta:machine_path_first_choice — first machine stance
     meta:balance_path_chosen      — balance stance ever
     meta:silence_at_seat          — act7_silence_stance
     meta:dischordia_carryover_high — prestige carryover dischordiaCards
                                      >= 50 (player tier-3 indicator)
     meta:governance_pattern_consistent — heuristic: 5+ 'light'
                                      governance flags AND zero 'dark'
                                      governance flags

   Each trigger fires at most once per session via the existing
   localStorage watermark in companionCommentQueue (maxPlays: 1
   on every meta line in companionComments.ts). The hook just
   has to *emit* — the toast pipeline handles dedup.
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";

import { useGame } from "@/contexts/GameContext";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { trpc } from "@/lib/trpc";

type Flags = Record<string, boolean | undefined>;

function hasFlag(flags: Flags | undefined, key: string): boolean {
  return Boolean(flags?.[key]);
}

export function useMetaNarratorReplay(): void {
  const { state } = useGame();
  const { data: prestige } = trpc.prestige.getState.useQuery(undefined, {
    staleTime: 60_000,
  });

  useEffect(() => {
    const flags = state.narrativeFlags as Flags | undefined;
    if (!flags) return;
    const tier = prestige?.currentTier ?? 0;
    const arcComplete = hasFlag(flags, "act_7_complete");

    // Cycle-count meta beats
    if (tier === 0 && arcComplete) fireCompanionComment("meta:first_run_complete");
    if (tier === 1 && !arcComplete) fireCompanionComment("meta:second_run_starts");
    if (tier === 1 && arcComplete) fireCompanionComment("meta:second_run_finished");
    if (tier >= 2 && !arcComplete) fireCompanionComment("meta:third_run_starts");
    if (tier >= 2) fireCompanionComment("meta:returning_player_recognised");

    // Path-flag meta beats
    if (hasFlag(flags, "act3_full_secret")) {
      fireCompanionComment("meta:path_full_secret_committed");
    }

    // Stance meta beats
    if (hasFlag(flags, "act7_silence_stance")) {
      fireCompanionComment("meta:silence_at_seat");
    }
    if (hasFlag(flags, "act7_s1_balance")) {
      fireCompanionComment("meta:balance_path_chosen");
    }
    if (hasFlag(flags, "act7_s1_machine_path")) {
      fireCompanionComment("meta:machine_path_first_choice");
    }

    // Repeated-humanity recognition: track via prestige history.
    // Counts how many of the recorded prestige snapshots ended
    // with the humanity stance. Three or more triggers the
    // 'authoring a thesis' line.
    const history = prestige?.state?.prestigeHistory ?? [];
    const humanityRuns = history.filter((h: unknown) => {
      const entry = h as { stance?: string };
      return entry?.stance === "humanity";
    }).length;
    if (humanityRuns >= 3) {
      fireCompanionComment("meta:humanity_path_third_time");
    }

    // Dischordia carryover threshold.
    const dischordiaCarryover = (prestige as unknown as { state?: { lifetimeResources?: { dream?: number } } })
      ?.state?.lifetimeResources?.dream ?? 0;
    if (dischordiaCarryover >= 5_000) {
      fireCompanionComment("meta:dischordia_carryover_high");
    }

    // Governance pattern: 5+ light governance flags with no dark.
    const lightFlags = [
      "governance:engineer_bench_contained",
      "governance:ghost_network_endorsed",
      "governance:revolution_of_thought",
      "governance:vex_told_engineer_truth",
      "governance:annual_ark_culture",
    ];
    const darkFlags = [
      "governance:engineer_bench_powered",
      "governance:violence_was_warranted",
      "governance:vex_kept_in_dark",
      "governance:kael_chose_dissolution",
    ];
    const lightCount = lightFlags.filter((f) => hasFlag(flags, f)).length;
    const darkCount = darkFlags.filter((f) => hasFlag(flags, f)).length;
    if (lightCount >= 3 && darkCount === 0) {
      fireCompanionComment("meta:governance_pattern_consistent");
    }
  }, [state.narrativeFlags, prestige]);
}
