import type { HeroTarget } from "../../types/HeroTarget";

export const GENERAL_CAEDRYN_VOLK: HeroTarget = {
  id: "general_caedryn_volk",
  name: "General Caedryn Volk",
  classKey: "soldier",
  corruptorLord: "mol_garath",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "unmaking_command", category: "soldier", severity: 3 },
    { id: "rank_compulsion", category: "soldier", severity: 3 },
    { id: "executive_charge", category: "soldier", severity: 2 },
    { id: "iron_quartermaster", category: "soldier", severity: 2 },
  ],
  tells: [
    "Refuses to issue an order he cannot personally enforce.",
    "Salutes the empty seat to his right before every command — Mol'Garath's chair.",
    "Bleeds chairman-black when struck.",
  ],
  lairLocation: "unmakers_court",
  briefingHints: [
    "Once led the League's frontier expedition that mapped the Crucible's outer wall.",
    "Mol'Garath promoted him posthumously the moment Volk's expedition was destroyed.",
    "Commands the Unmaker's standing army inside the Court — twelve cohorts of corrupted soldiers.",
  ],
};
