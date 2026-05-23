/* Second-death variant modules — 4 ballot outcomes. */
import type { BallotKey } from "../../../nexusTrial/buckets";
import type { PatchModule } from "../types";

export const WRAITH_DIES: PatchModule = {
  id: "second_death/wraith_dies",
  dialogOverrides: {
    "recovery_ledger.header":
      "Last keeper: Wraith Calder. — She closed it over her thumb.",
  },
  loredexPatches: {
    wraith_calder: {
      status: "in_memoriam",
      inMemoriamLine: "She was last seen carrying the names. We do not know which names she saved.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "akai_shi_silent_beat_inscribe",
    "recovery_ledger_readonly_calder_last_keeper",
    "jericho_contract_seal_no_living_author",
    "thaloria_loredex_calder_attributions",
  ],
};

export const LYCOS_DIES: PatchModule = {
  id: "second_death/lycos_dies",
  dialogOverrides: {
    "the_judge.season2.encounter":
      "The hunter is no longer between us.",
  },
  loredexPatches: {
    lycos: {
      status: "in_memoriam",
      inMemoriamLine: "He went back into Anara. The pack waited at the bench.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "anara_hunt_frozen_static_loredex",
    "judge_dialog_hunter_no_longer_between_us",
    "pack_tier_locked_no_new_bonds",
    "antiquarian_dialog_different_contract",
  ],
};

export const AKAI_DIES: PatchModule = {
  id: "second_death/akai_dies",
  dialogOverrides: {
    "jericho_jones.season2.opening":
      "The Red Death gave her colour back to the dark. — I gave her her colour the first time.",
  },
  loredexPatches: {
    akai_shi: {
      status: "in_memoriam",
      inMemoriamLine: "The Red Death gave her colour back to the dark. The dark accepted.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "jericho_mercy_canon_collapse_single",
    "cades_dmc_jericho_only_carrier",
    "necromancer_cooldown_extended_years",
    "inscribe_akai_shi_already_inscribed_flip",
  ],
};

export const VEX_DIES: PatchModule = {
  id: "second_death/vex_dies",
  dialogOverrides: {
    "the_coda.dissolution.notice":
      "The Maestro is not here. The chair is here. The chorus has gone home.",
  },
  loredexPatches: {
    vex_solene: {
      status: "in_memoriam",
      inMemoriamLine: "She finished the inventory. She did not finish the courtesy.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "coda_dissolved_protocols_factional_contest",
    "engineer_pattern_warlord_fragment_scattered",
    "vex_im_glad_its_you_never_canonical",
    "coda_dependents_will_not_arrive_beat",
  ],
};

export function secondDeathPatchFor(winner: BallotKey): PatchModule {
  switch (winner) {
    case "wraith_calder":
      return WRAITH_DIES;
    case "lycos":
      return LYCOS_DIES;
    case "akai_shi":
      return AKAI_DIES;
    case "vex_solene":
      return VEX_DIES;
    default: {
      const _exhaustive: never = winner;
      throw new Error(`Unknown ballot winner: ${String(_exhaustive)}`);
    }
  }
}
