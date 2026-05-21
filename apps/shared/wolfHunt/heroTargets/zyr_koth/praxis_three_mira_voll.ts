import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_THREE_MIRA_VOLL: HeroTarget = {
  id: "praxis_three_mira_voll",
  name: "Praxis-Three Mira'Voll",
  classKey: "engineer",
  corruptorLord: "zyr_koth",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "severance_protocol_refinement", category: "engineer", severity: 3 },
    { id: "iterative_flay", category: "engineer", severity: 3 },
    { id: "field_redesign", category: "engineer", severity: 2 },
    { id: "telemetry_swarm", category: "engineer", severity: 2 },
  ],
  tells: [
    "Speaks to the Wolf in the past tense — she has already iterated the encounter once in her workshop.",
    "Wears the third-generation revision of her own skin.",
    "Carries no weapon she did not redesign mid-fight at least once.",
  ],
  lairLocation: "flayers_workshop",
  briefingHints: [
    "Was the League's lead xenobiology engineer. Zyr'Koth recruited her by improving her own design.",
    "Refines the Severance Protocol against test subjects every nineteen hours.",
    "The third revision — Praxis-Three — is the operational version. There are seventeen earlier versions of her still alive in the workshop's lower vats.",
  ],
};
