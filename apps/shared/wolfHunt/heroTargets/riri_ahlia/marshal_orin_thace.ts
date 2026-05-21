import type { HeroTarget } from "../../types/HeroTarget";

export const MARSHAL_ORIN_THACE: HeroTarget = {
  id: "marshal_orin_thace",
  name: "Marshal Orin Thace",
  classKey: "soldier",
  corruptorLord: "riri_ahlia",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "seven_dimension_siege", category: "soldier", severity: 3 },
    { id: "reorganization_doctrine", category: "soldier", severity: 3 },
    { id: "attritional_will", category: "soldier", severity: 2 },
  ],
  tells: [
    "Reorders his guard formation mid-fight — the formation itself is the attack.",
    "Has never retreated from a structured engagement; routes only against chaos.",
    "Salutes Riri'Ahlia's flag pole twice. Once to begin, once to acknowledge the new chain of command.",
  ],
  lairLocation: "tasking_yards",
  briefingHints: [
    "Led the League's defensive doctrine school before Riri'Ahlia reorganized him.",
    "Now teaches her siege-of-seven-dimensions cadence to corrupted underclasses.",
    "His engagements run by training calendar — the Wolf can see the schedule if he reads the yards' bell-tower postings.",
  ],
};
