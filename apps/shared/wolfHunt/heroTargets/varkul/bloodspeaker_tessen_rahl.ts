import type { HeroTarget } from "../../types/HeroTarget";

export const BLOODSPEAKER_TESSEN_RAHL: HeroTarget = {
  id: "bloodspeaker_tessen_rahl",
  name: "Bloodspeaker Tessen Rahl",
  classKey: "assassin",
  corruptorLord: "varkul",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "cathedral_resonance", category: "assassin", severity: 3 },
    { id: "blood_lexicon", category: "assassin", severity: 3 },
    { id: "vampiric_economy", category: "assassin", severity: 2 },
  ],
  tells: [
    "Hums in the Cathedral's load-bearing frequency — kills mid-bar.",
    "Wears a thin glass vial at the throat; the contents are always full and always the Wolf's blood-type.",
    "Speaks his own kills' last words back to them as he kills them again.",
  ],
  lairLocation: "cathedral_undercroft",
  briefingHints: [
    "Was the League's last living theologian. Studied the Cathedral of Code from the outside for forty years.",
    "Varkul took him by inviting him in. He stayed.",
    "Now speaks fluent blood-magic and hears the Cathedral as a hymn.",
  ],
};
