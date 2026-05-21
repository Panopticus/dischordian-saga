import type { HeroTarget } from "../../types/HeroTarget";

export const MOONSCRIBE_ILARA_PELL: HeroTarget = {
  id: "moonscribe_ilara_pell",
  name: "Moonscribe Ilara Pell",
  classKey: "oracle",
  corruptorLord: "fenra",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "tidal_prediction", category: "oracle", severity: 3 },
    { id: "celestial_indexing", category: "oracle", severity: 3 },
    { id: "lunatic_compass", category: "oracle", severity: 2 },
    { id: "phase_displacement", category: "oracle", severity: 2 },
  ],
  tells: [
    "Speaks in the cadence of the Moonsick terraces' twelve-hour tide.",
    "Her shadow lags a half-second behind her body — the lag is the warning.",
    "Carries no weapon between waxing crescents and full moons.",
  ],
  lairLocation: "moonsick_terraces",
  briefingHints: [
    "Was the League's chief astronomer. Charted Fenra's lunar cycles to predict her attacks before the corruption took her.",
    "Fenra inverted her by inviting her to chart from the inside.",
    "Now writes celestial scripture the corrupted Crucible reads as scheduling.",
  ],
};
