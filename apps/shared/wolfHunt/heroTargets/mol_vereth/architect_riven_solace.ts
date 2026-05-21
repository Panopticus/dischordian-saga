import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_RIVEN_SOLACE: HeroTarget = {
  id: "architect_riven_solace",
  name: "Architect Riven Solace",
  classKey: "engineer",
  corruptorLord: "mol_vereth",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "trustee_clause_authoring", category: "engineer", severity: 3 },
    { id: "principal_machinery", category: "engineer", severity: 3 },
    { id: "anniversary_recursion", category: "engineer", severity: 2 },
    { id: "fiduciary_lock", category: "engineer", severity: 2 },
  ],
  tells: [
    "Carries a folded contract that updates itself in the Wolf's peripheral vision.",
    "Refuses to begin combat on any date that is not Mol'Vereth's annual audit anniversary.",
    "His tools are signed in his own hand and Mol'Vereth's hand simultaneously.",
  ],
  lairLocation: "trustee_archive",
  briefingHints: [
    "Was the League's chief structural architect — designed the Hall of Disappearances itself before the Antiquarian had it built.",
    "Mol'Vereth recruited him through a contract he authored while drunk and ratified while sober.",
    "Now builds the principal-machinery that Mol'Vereth's trusteeship turns. Every Crucible bell-housing carries his signature.",
  ],
};
