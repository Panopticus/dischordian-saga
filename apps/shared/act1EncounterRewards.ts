/**
 * Act 1 encounter → campaign-state rewards.
 *
 * Declarative table mapping `(encounterId, outcome)` → a set of
 * campaign-layer deltas that must be applied when the encounter
 * resolves. Used by the match-end orchestrator to adjust
 * `narratorBond`, army recruitment, and narrative flags once per
 * encounter completion.
 *
 * Context: Wave 1 added the campaign-state fields (narratorBond,
 * yearOneMonth, armyRecruitment, prestige, lightDarkAlignment) but
 * no Act 1 encounter was adjusting them. Downstream Acts 2+ saw zero
 * delta regardless of how the player played Act 1. This table is
 * the missing middle — it turns "I beat the Warlord" into
 * "narratorBond +2 and army_recruited_warlord_zero_legacy raised."
 *
 * The table is the authoritative spec: any new Act 1 encounter that
 * should affect campaign state adds its row here, not in ad-hoc UI
 * handlers. A test in `act1EncounterRewards.test.ts` enforces that
 * every named-boss encounter has both a win and a loss entry, so
 * new bosses can't silently skip the reward pass.
 */

/** Canonical outcome labels for Act 1 encounters. */
export type EncounterOutcome = "win" | "loss";

/**
 * One row of deltas to apply to campaign state at encounter
 * resolution. Every field is optional — minimal rows (e.g. a
 * cycle-A win that only advances card-win counts) can be `{}`.
 */
export interface EncounterReward {
  /**
   * Delta applied via `adjustNarratorBond`. Positive = bond with
   * The Human strengthens (shared trauma, shared grief);
   * negative = narrator retreats (rare in Act 1 — canon tilts
   * Act 1 experiences toward bond-building).
   */
  narratorBondDelta?: number;
  /**
   * Mission-id to add to `armyRecruitmentMissionsCompleted`.
   * Gates Act 6 (5+) and Act 7 (15+).
   */
  armyRecruitmentMission?: string;
  /** Narrative flags to set (value always `true`). */
  flagsToSet?: readonly string[];
  /**
   * Memorable moments the Antiquarian should record for this
   * encounter outcome. Pairs of (subtitle, kind) to be fed through
   * `recordMemorableMoment`.
   */
  memorableMoments?: readonly {
    subtitle: string;
    /**
     * Must be a canonical `MemorableMomentKind` from
     * `apps/shared/memorableMoments.ts`. Kept as a string literal
     * union here (rather than importing the type) so this module
     * stays a pure data table — tests assert exact membership.
     */
    kind: "bond_peak" | "card_battle_win" | "game_master_defeated" | "silence_chosen";
  }[];
}

type EncounterRewardTable = Record<string, Partial<Record<EncounterOutcome, EncounterReward>>>;

/**
 * The 5 named bosses + the 3 cycle-completion encounters.
 * Non-named Act 1 encounters (ch1..ch12 faction sparring matches)
 * have no rewards rows — they contribute via the card-win counter
 * in `useNarrativeIntegration.ts` and do not individually adjust
 * campaign state.
 */
export const ACT_1_ENCOUNTER_REWARDS: EncounterRewardTable = {
  // §5.5 Warlord Zero — Nexon flashback. Win OR loss is canon;
  // the lockout itself is the experience.
  ch_warlord_zero_first: {
    win: {
      narratorBondDelta: 2,
      flagsToSet: ["act1_warlord_zero_defeated"],
      memorableMoments: [
        {
          subtitle: "The night you counted her three moves back at her.",
          kind: "bond_peak",
        },
      ],
    },
    loss: {
      narratorBondDelta: 1,
      flagsToSet: ["act1_warlord_zero_escaped"],
      memorableMoments: [
        {
          subtitle: "The night you learned what arithmetic really means.",
          kind: "silence_chosen",
        },
      ],
    },
  },

  // §5.6 Programmer gift. The bond delta on accept is already
  // applied by `handleProgrammerGiftPick` in DuelystGameUI (the pick
  // handler fires before the match formally ends). This row's
  // flags exist for symmetry and for the future story-mode
  // launcher that may skip the pick phase entirely.
  ch_programmer_gift: {
    win: {
      flagsToSet: ["act1_programmer_gift_resolved"],
    },
    loss: {
      flagsToSet: ["act1_programmer_gift_resolved"],
    },
  },

  // §5.7 Game Master. The verdict balance captured here feeds §5.8
  // via `act1TrialHandoff.ts`; bond + flag effects are encoded
  // here for the campaign-layer dispatch.
  ch_game_master: {
    win: {
      narratorBondDelta: 3,
      flagsToSet: ["act1_game_master_outwitted"],
      memorableMoments: [
        {
          subtitle: "The night you opened the beautiful box in public.",
          kind: "game_master_defeated",
        },
      ],
    },
    loss: {
      narratorBondDelta: 1,
      flagsToSet: ["act1_game_master_prosecuted"],
    },
  },

  // §5.8 Authority trial. Outcome fan-out is driven by
  // `act1_authority_outcome` flag set in the DuelystGameUI trial-
  // resolution hook; this row adds the bond + army deltas.
  ch_authority_trial: {
    win: {
      // Surviving 10 phases is a monument.
      narratorBondDelta: 4,
      armyRecruitmentMission: "act1_authority_overturn",
      flagsToSet: ["act1_authority_trial_survived"],
      memorableMoments: [
        {
          subtitle: "The night the verdict came back for you and not against you.",
          kind: "bond_peak",
        },
      ],
    },
    loss: {
      narratorBondDelta: 2,
      flagsToSet: ["act1_authority_trial_sentenced"],
      memorableMoments: [
        {
          subtitle: "The night the sentence was passed.",
          kind: "silence_chosen",
        },
      ],
    },
  },

  // §4.9 Seer. Both outcomes are canon; the flag write that drives
  // Acts 2+ unlock logic is handled in the DuelystGameUI seer hook
  // (SEER_OUTCOME_FLAGS). This row adds the bond delta only —
  // defeating the Seer is the rare winnable path and deserves a
  // heftier bond gift than the scripted loss.
  ch_seer_visit: {
    win: {
      narratorBondDelta: 3,
      flagsToSet: ["act1_seer_winnable_path_witnessed"],
    },
    loss: {
      narratorBondDelta: 1,
    },
  },
};

/**
 * Lookup helper. Returns the reward row for the given
 * `(encounterId, outcome)` pair, or undefined if none is authored.
 * A missing row is legitimate — most ch1..ch12 matches have no
 * per-encounter reward beyond the card-win counter.
 */
export function getEncounterReward(
  encounterId: string,
  outcome: EncounterOutcome,
): EncounterReward | undefined {
  return ACT_1_ENCOUNTER_REWARDS[encounterId]?.[outcome];
}

/**
 * The set of encounter ids the rewards table treats as named
 * bosses. Used by tests + the story-mode launcher to guarantee
 * every named boss has an authored row.
 */
export const ACT_1_NAMED_BOSS_ENCOUNTERS: readonly string[] = Object.freeze([
  "ch_warlord_zero_first",
  "ch_programmer_gift",
  "ch_game_master",
  "ch_authority_trial",
  "ch_seer_visit",
]);
