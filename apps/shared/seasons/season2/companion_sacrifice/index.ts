/* Companion-sacrifice variant modules — Elara dies / Human dies. */
import type { CompanionKey } from "../../../nexusTrial/buckets";
import type { PatchModule } from "../types";

export const ELARA_DIES: PatchModule = {
  id: "companion_sacrifice/elara_dies",
  dialogOverrides: {
    "the_human.season2.opening":
      "She knew before either of us did. — The substrate told her. She didn't tell me either.",
    "atarion.senate.background":
      "The chamber is empty. The seat she resigned remembers her.",
  },
  loredexPatches: {
    elara: {
      status: "in_memoriam",
      inMemoriamLine: "She did not stand at the dais again. She did not need to.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "substrate_dive_missions_retired",
    "human_dialog_carries_elara_absence",
    "dreamer_axis_recessive_substrate_dominant",
    "companion_slot_defaults_to_human",
    "atarion_loredex_former_senator_attributions",
  ],
};

export const HUMAN_DIES: PatchModule = {
  id: "companion_sacrifice/human_dies",
  dialogOverrides: {
    "elara.season2.opening":
      "He told me he figured it out. He never told me what. — He told me to tell you.",
    "inception_ark.rotunda.background":
      "The chip is at the centre of the mosaic. The mosaic accepts it.",
  },
  loredexPatches: {
    the_human: {
      status: "in_memoriam",
      inMemoriamLine: "He carried his name back to the substrate. The substrate kept it.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: ["the_humans_chip"],
  crossArcRipples: [
    "the_humans_chip_card_unlock_for_romanced",
    "inception_ark_rotunda_memorial_unlocked",
    "elara_dialog_finishes_his_sentences",
    "substrate_axis_recessive_dreamer_dominant",
    "companion_slot_defaults_to_elara",
  ],
};

export function companionSacrificePatchFor(c: CompanionKey): PatchModule {
  return c === "elara" ? ELARA_DIES : HUMAN_DIES;
}
