import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_DAVEN_READS_SYL: HeroTarget = {
  "id": "scribe_daven_reads_syl",
  "name": "Scribe Daven Reads",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "phase_displacement",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "vow_reading",
      "category": "oracle",
      "severity": 1
    },
    {
      "id": "shape_of_the_loss",
      "category": "oracle",
      "severity": 1
    }
  ],
  "tells": [
    "Recites the hunter's vows back to him at unhelpful moments."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Scribe Daven Reads served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to scout the threshold rooms."
  ]
};
