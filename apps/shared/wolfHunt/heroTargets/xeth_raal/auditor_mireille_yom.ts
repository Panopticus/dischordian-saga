import type { HeroTarget } from "../../types/HeroTarget";

export const AUDITOR_MIREILLE_YOM: HeroTarget = {
  id: "auditor_mireille_yom",
  name: "Auditor Mireille Yom",
  classKey: "oracle",
  corruptorLord: "xeth_raal",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "ledger_sight", category: "oracle", severity: 3 },
    { id: "contract_recall", category: "oracle", severity: 3 },
    { id: "interest_compounder", category: "oracle", severity: 2 },
    { id: "default_reckoning", category: "oracle", severity: 2 },
  ],
  tells: [
    "Reads every promise the Wolf has ever made aloud before engaging.",
    "Carries no weapon — only the Ledger of Ruin, bound in unfinished contracts.",
    "Knows the price of mercy in advance and adjusts her ask accordingly.",
  ],
  lairLocation: "ledger_vault",
  briefingHints: [
    "Was the League's chief contract negotiator before she signed a clause she did not read aloud.",
    "Xeth'Raal honors every clause of her current employment — that is the threat.",
    "Has seen the ending of this hunt forty-one ways. Most of them end with the Wolf in arrears.",
  ],
};
