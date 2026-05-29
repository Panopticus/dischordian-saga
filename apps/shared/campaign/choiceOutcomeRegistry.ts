/* ═══════════════════════════════════════════════════════
   CHOICE OUTCOME REGISTRY — typed catalogue

   Plan §2.1 (Foundations) #5.

   Mirrors `apps/shared/flags/narrativeFlagRegistry.ts`. That
   registry catalogues *narrative flags* — pieces of state
   the game writes that downstream systems read against.
   This registry catalogues *choice outcomes* — entries in
   the BioWare-style branching dialog whose effects feed
   back into the world (a card unlocks, a faction shifts, a
   future encounter mutates).

   Why we need a registry instead of inline data:

     1. **No orphan choices.** Every choice outcome must be
        consumed by something. The parity check (in
        `_completeness/checks/choiceOutcomeConsumerParity.ts`)
        scans the codebase to confirm each registered
        outcome has a downstream reader; if a flag gets
        renamed or a card gets deleted, the registry catches
        the drift before the player feels it.

     2. **Discoverability.** Writers + designers can scan
        one file to see every "moment that matters". The
        notes column doubles as the changelog the
        Campaign Ledger UI reads at render time.

     3. **Typed integration with NpcDialogChoice.** Every
        `NpcDialogChoice.sets` flag, every
        `factionRepDelta` key, and every `unlockCard` id
        traces back to an entry here.

   Scope today: the act-disclosure spine (Acts 1-5 fork
   outcomes), the Act 6/7 confession + endgame beats, the
   §5.8 Authority-Trial stakes swing, and the Game Master's
   pre-Trial card unlock — every entry has a verified
   downstream consumer (a requireFlag gate, a companion
   comment/ask-topic, a trust-variant read, or a real card
   def). Authors add entries here as new encounter dialog
   trees land; the registry is meant to grow.

   Audit note: the producer-scan only recognises setFlag/
   setNarrativeFlag/flagsToSet.push producers, so dialog-tree
   `sets:` flags are NOT eligible until they also flow through
   one of those. Orphan choices (a setFlag with no reader)
   are deliberately NOT registered — the registry catalogues
   outcomes that are consumed, not dead writes.

   Pure module — no imports from React, the engine, or the
   client.
   ═══════════════════════════════════════════════════════ */

import type { Faction } from "../tcg-core/types/Card";

export type ChoiceOutcomeKind =
  /** Sets a narrative flag (writes to `narrativeFlags`). */
  | "set_flag"
  /** Shifts faction reputation. */
  | "faction_rep"
  /** Unlocks a card in the player's collection. */
  | "unlock_card"
  /** Adds a card to a future encounter's boss deck. */
  | "mutate_encounter_deck"
  /** Shifts a stakes axis tracked by an in-progress encounter. */
  | "stakes_axis";

export interface ChoiceOutcomeEntry {
  /** Stable id used in the Campaign Ledger and the parity check. */
  id: string;
  kind: ChoiceOutcomeKind;
  /** The authored choice that triggers this outcome — e.g.
   *  `"act1.warlord_zero.spare"`. Used for the changelog entry the
   *  Campaign Ledger renders next to the timeline. */
  authoredAt: string;
  /** Owning act / system, for cross-reference. */
  owner: string;
  /** One short sentence on what this outcome means in-universe.
   *  Reused as the Campaign Ledger row's caption. */
  notes: string;

  /** Kind-specific payload — narrow these by `kind`. */

  /** Required for `set_flag` outcomes. */
  flag?: string;
  /** Required for `faction_rep` outcomes — the faction touched. */
  faction?: Faction;
  /** Required for `unlock_card` outcomes — the card def id minted. */
  cardDefId?: string;
  /** Required for `mutate_encounter_deck` outcomes. */
  encounterMutation?: { encounterId: string; addCardDefId: string };
  /** Required for `stakes_axis` outcomes — the axis id touched. */
  stakesAxisId?: string;
}

/**
 * The seed roster. Five entries to prove the registry shape and back
 * the first parity check. New entries land as encounter dialog trees
 * are authored (Phase 2). The corresponding parity check verifies
 * every entry's downstream consumer exists somewhere in `apps/`.
 *
 * NOTE: every flag listed in `flag:` here must ALSO be registered in
 * `narrativeFlagRegistry.ts` (the existing flag catalogue) and have a
 * producer somewhere — i.e. an actual `setNarrativeFlag()` call.
 */
export const CHOICE_OUTCOME_REGISTRY: ReadonlyArray<ChoiceOutcomeEntry> = [
  {
    id: "act1.forgiveness_choice_made",
    kind: "set_flag",
    authoredAt: "act1.forgiveness_arc.commit",
    owner: "act_1",
    notes:
      "Player committed a forgiveness choice in the Act 1 forgiveness arc; unlocks Lyra Vox and is read by every later opponent dialog that references mercy.",
    flag: "forgiveness_choice_made",
  },
  {
    id: "act1.lyra_vox_unlocked",
    kind: "set_flag",
    authoredAt: "act1.forgiveness_arc.commit",
    owner: "act_1",
    notes:
      "Lyra Vox NPC is now reachable in the /ark; opens the forgiveness-path companion ask topic.",
    flag: "lyra_vox_unlocked",
  },
  {
    id: "act1.closing_choice_made",
    kind: "set_flag",
    authoredAt: "act1.closing.commit",
    owner: "act_1",
    notes:
      "Player has committed an Act 1 closing choice — the morality cinematic gate.",
    flag: "act1_closing_choice_made",
  },
  {
    id: "act1.path_a_willing_disclosure",
    kind: "set_flag",
    authoredAt: "act1.disclosure.tell_truth",
    owner: "act_1",
    notes:
      "Act 1 disclosure fork: player took the willing-disclosure path (told Elara the truth); routes Act 4 to 'The Bridge' (Path A) and seeds the Path-A epilogue/inscription variants.",
    flag: "act1_path_a",
  },
  {
    id: "act1.told_elara",
    kind: "set_flag",
    authoredAt: "act1.s2.tell_elara",
    owner: "act_1",
    notes:
      "Act 1 disclosure fork: player told Elara the truth (act1-s2-loyal / -soldier); gates the Act 1 s3a Elara-reaction beats.",
    flag: "act1_told_elara",
  },
  {
    id: "act1.kept_secret",
    kind: "set_flag",
    authoredAt: "act1.s2.keep_secret",
    owner: "act_1",
    notes:
      "Act 1 disclosure fork: player concealed the truth (act1-s2-gather / -intrigued / -spy); gates the Act 1 s3b concealment beats.",
    flag: "act1_kept_secret",
  },
  {
    id: "act1.path_secret",
    kind: "set_flag",
    authoredAt: "act1.path.secret",
    owner: "act_1",
    notes:
      "Act 1 secret-path marker (concealment route); gates later Act 1 secret-path beats. The concealment counterpart to act1_path_a.",
    flag: "act1_path_secret",
  },
  {
    id: "act2.full_truth",
    kind: "set_flag",
    authoredAt: "act2.s1.full_truth",
    owner: "act_2",
    notes:
      "Act 2 disclosure fork: player gave the full truth (act2-s1-full-truth); read by the narrators' companion comments and the act-2 ask-topic gates.",
    flag: "act2_full_truth",
  },
  {
    id: "act2.partial_reveal",
    kind: "set_flag",
    authoredAt: "act2.s1.almost_confess",
    owner: "act_2",
    notes:
      "Act 2 disclosure fork: player partially confessed (act2-s1-almost-confess); read by companion comments and ask-topic gates.",
    flag: "act2_partial_reveal",
  },
  {
    id: "act2.lied",
    kind: "set_flag",
    authoredAt: "act2.s1.lie",
    owner: "act_2",
    notes:
      "Act 2 disclosure fork: player lied (act2-s1-lie); read by the narrators' companion comments and the act-2 ask-topic gates.",
    flag: "act2_lied",
  },
  {
    id: "act2.oracle_deflect",
    kind: "set_flag",
    authoredAt: "act2.s1.oracle_deflect",
    owner: "act_2",
    notes:
      "Act 2 disclosure fork: player deflected via the Oracle framing (act2-s1-oracle-deflect); read by companion comments and ask-topic gates.",
    flag: "act2_oracle_deflect_chosen",
  },
  {
    id: "act2.spy_misdirect",
    kind: "set_flag",
    authoredAt: "act2.s1.spy_misdirect",
    owner: "act_2",
    notes:
      "Act 2 disclosure fork: player ran the spy misdirection (act2-s1-spy-misdirect); read by companion comments and ask-topic gates.",
    flag: "act2_spy_misdirect_chosen",
  },
  {
    id: "act3.transparent",
    kind: "set_flag",
    authoredAt: "act3.offer.transparent",
    owner: "act_3",
    notes:
      "Act 3 disclosure fork: player chose full transparency; read by moralityTrustActVariants.ts to select the trust-variant opponent read.",
    flag: "act3_transparent",
  },
  {
    id: "act3.partial_share",
    kind: "set_flag",
    authoredAt: "act3.offer.share_partial",
    owner: "act_3",
    notes:
      "Act 3 disclosure fork: player shared part of the secret (pragmatic path); routes Act 4 to Elara's 'Discovery' (Path B) and softens later opponent reads.",
    flag: "act3_partial_share",
  },
  {
    id: "act3.full_secret",
    kind: "set_flag",
    authoredAt: "act3.offer.keep_secret",
    owner: "act_3",
    notes:
      "Act 3 disclosure fork: player kept the full secret (betrayal path); routes Act 4 to Elara's 'Betrayal' (Path C) and hardens later opponent reads.",
    flag: "act3_full_secret",
  },
  {
    id: "act4.reconciled",
    kind: "set_flag",
    authoredAt: "act4.pathB.reconcile",
    owner: "act_4",
    notes:
      "Act 4 Path-B outcome: relationship reconciled (act4-pB-honest / -explain); read by companion comments and ask-topic gates.",
    flag: "act4_reconciled",
  },
  {
    id: "act4.strained",
    kind: "set_flag",
    authoredAt: "act4.pathB.defiant",
    owner: "act_4",
    notes:
      "Act 4 Path-B outcome: relationship strained (act4-pB-defiant); read by companion comments.",
    flag: "act4_strained",
  },
  {
    id: "act4.fragile_trust",
    kind: "set_flag",
    authoredAt: "act4.pathC.fragile_trust",
    owner: "act_4",
    notes:
      "Act 4 Path-C outcome: fragile-trust salvage (act4-pC-grovel / -soldier-own); read by companion comments and ask-topic gates.",
    flag: "act4_fragile_trust",
  },
  {
    id: "act4.broken_trust",
    kind: "set_flag",
    authoredAt: "act4.pathC.broken_trust",
    owner: "act_4",
    notes:
      "Act 4 Path-C outcome: trust broken (act4-pC-cold / -assassin); the most widely-read Act-4 branch across companion comments and ask-topic gates.",
    flag: "act4_broken_trust",
  },
  {
    id: "act5.path_humanity_first",
    kind: "set_flag",
    authoredAt: "act5.s1.humanity_first",
    owner: "act_5",
    notes:
      "Act 5 doctrine fork: humanity-first path (act5-s1-humanity-first); read by companion comments and ask-topic gates.",
    flag: "act5_path_humanity_first",
  },
  {
    id: "act5.path_strength_first",
    kind: "set_flag",
    authoredAt: "act5.s1.strength_first",
    owner: "act_5",
    notes:
      "Act 5 doctrine fork: strength-first path (act5-s1-power); read by companion comments and ask-topic gates.",
    flag: "act5_path_strength_first",
  },
  {
    id: "act5.strategic_chosen",
    kind: "set_flag",
    authoredAt: "act5.s1.strategic",
    owner: "act_5",
    notes:
      "Act 5 doctrine fork: strategic path (act5-s1-strategic); read by companion comments and ask-topic gates.",
    flag: "act5_strategic_chosen",
  },
  {
    id: "act5.engineer_tech_chosen",
    kind: "set_flag",
    authoredAt: "act5.s1.engineer_tech",
    owner: "act_5",
    notes:
      "Act 5 doctrine fork: engineer/tech path (act5-s1-engineer-tech); read by companion comments.",
    flag: "act5_engineer_tech_chosen",
  },
  {
    id: "act5.balanced_chosen",
    kind: "set_flag",
    authoredAt: "act5.s1.balanced",
    owner: "act_5",
    notes:
      "Act 5 doctrine fork: balanced path (act5-s1-balanced); read by companion comments.",
    flag: "act5_balanced_chosen",
  },
  {
    id: "gm.second_meeting.unlock_original",
    kind: "unlock_card",
    authoredAt: "gm.second_meeting_pre_trial.branch_left_arithmetic",
    owner: "the_game_master",
    notes:
      "Engaging the Game Master's Left (the 'wrong question' reframe) in the pre-Trial second meeting unlocks the pre-Fall Senator relic card — a version of him no living character can reach.",
    cardDefId: "gen_game_master_original",
  },
  {
    id: "act6.elara_confession_heard",
    kind: "set_flag",
    authoredAt: "act6.confession.elara",
    owner: "act_6",
    notes:
      "Player heard Elara's Act 6 confession (the woman she was); unlocks the confession-mirror match and is read by the Act 7 convergence seat.",
    flag: "act6_elara_confession_heard",
  },
  {
    id: "act6.human_confession_heard",
    kind: "set_flag",
    authoredAt: "act6.confession.human",
    owner: "act_6",
    notes:
      "Player heard the Human's Act 6 confession (the detective in the wall); unlocks the confession-mirror match and is read by the Act 7 convergence seat.",
    flag: "act6_human_confession_heard",
  },
  {
    id: "act1.trial_public_witness_swing",
    kind: "stakes_axis",
    authoredAt: "act1.authority_trial.public_appeal",
    owner: "act_1",
    notes:
      "In the §5.8 Authority Trial, an in-encounter dialog appeal swings the Public Witness stakes axis; the stakesMode reducer applies the delta within the encounter's clip range.",
    stakesAxisId: "public_witness",
  },
  {
    id: "act7.endgame_light",
    kind: "set_flag",
    authoredAt: "act7.vortex.commit_light",
    owner: "act_7",
    notes:
      "Endgame committed to the light path — gates the light-variant epilogue and the light-band card pool.",
    flag: "vortex_endgame_light_variant",
  },
  {
    id: "act7.endgame_dark",
    kind: "set_flag",
    authoredAt: "act7.vortex.commit_dark",
    owner: "act_7",
    notes:
      "Endgame committed to the dark path — gates the dark-variant epilogue and the dark-band card pool.",
    flag: "vortex_endgame_dark_variant",
  },
];

const REGISTRY_BY_ID = new Map(
  CHOICE_OUTCOME_REGISTRY.map((e) => [e.id, e] as const),
);

export function getChoiceOutcome(id: string): ChoiceOutcomeEntry | undefined {
  return REGISTRY_BY_ID.get(id);
}

export function listChoiceOutcomes(): ReadonlyArray<ChoiceOutcomeEntry> {
  return CHOICE_OUTCOME_REGISTRY;
}

export function listChoiceOutcomesByOwner(
  owner: string,
): ChoiceOutcomeEntry[] {
  return CHOICE_OUTCOME_REGISTRY.filter((e) => e.owner === owner);
}

export function listChoiceOutcomesByKind(
  kind: ChoiceOutcomeKind,
): ChoiceOutcomeEntry[] {
  return CHOICE_OUTCOME_REGISTRY.filter((e) => e.kind === kind);
}

/** Every distinct flag referenced by `set_flag` outcomes. Used by
 *  the parity check to confirm each flag has a producer somewhere
 *  in `apps/` AND lives in the `narrativeFlagRegistry`. */
export function listOutcomeFlags(): string[] {
  const out = new Set<string>();
  for (const e of CHOICE_OUTCOME_REGISTRY) {
    if (e.kind === "set_flag" && e.flag) out.add(e.flag);
  }
  return [...out];
}

/** Every distinct card def id referenced by `unlock_card` outcomes.
 *  The parity check verifies each appears in the card registry. */
export function listOutcomeCardDefIds(): string[] {
  const out = new Set<string>();
  for (const e of CHOICE_OUTCOME_REGISTRY) {
    if (e.kind === "unlock_card" && e.cardDefId) out.add(e.cardDefId);
  }
  return [...out];
}

/** Sanity assertion — entries must populate the payload field their
 *  `kind` requires. Called from the registry's own test. */
export function validateChoiceOutcomeEntry(
  entry: ChoiceOutcomeEntry,
): { ok: true } | { ok: false; reason: string } {
  switch (entry.kind) {
    case "set_flag":
      return entry.flag
        ? { ok: true }
        : { ok: false, reason: `set_flag entry "${entry.id}" missing flag` };
    case "faction_rep":
      return entry.faction
        ? { ok: true }
        : { ok: false, reason: `faction_rep entry "${entry.id}" missing faction` };
    case "unlock_card":
      return entry.cardDefId
        ? { ok: true }
        : { ok: false, reason: `unlock_card entry "${entry.id}" missing cardDefId` };
    case "mutate_encounter_deck":
      return entry.encounterMutation
        ? { ok: true }
        : {
            ok: false,
            reason: `mutate_encounter_deck entry "${entry.id}" missing encounterMutation`,
          };
    case "stakes_axis":
      return entry.stakesAxisId
        ? { ok: true }
        : {
            ok: false,
            reason: `stakes_axis entry "${entry.id}" missing stakesAxisId`,
          };
  }
}
