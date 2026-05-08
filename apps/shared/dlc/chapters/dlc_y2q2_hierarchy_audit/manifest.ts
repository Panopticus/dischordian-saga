/* dlc_y2q2_hierarchy_audit — "The Hierarchy Audit"
 *
 * Year-2 Severance mini-DLC. A demon lord (Zyr'Koth) appears at
 * the Severance ceremony to claim a bound companion under an
 * infernal clause hidden in past DMC contracts. The Advocate
 * takes the Council's brief.
 */
import type { DlcChapter, DlcStep } from "../../types";
import type { MiniDlcManifest } from "../../miniDlcManifest";

const STEPS: readonly DlcStep[] = [
  {
    kind: "narration",
    id: "open",
    speaker: "advocate",
    text: "I have read every contract from the last seven seasons. Sixty-one of them carry a clause neither party signed. I am here to file objection on all sixty-one.",
    subtitle: "Severance Year 2 — Trade Court convened.",
  },
  {
    kind: "narration",
    id: "the_demand",
    speaker: "zyrkoth",
    text: "The clause is real. Read it aloud or read it weeping. Either way I am here to collect what is owed.",
  },
];

export const DLC_Y2Q2_HIERARCHY_AUDIT: DlcChapter = {
  id: "dlc_y2q2_hierarchy_audit",
  title: "The Hierarchy Audit",
  synopsis:
    "Severance Year 2 — Zyr'Koth appears in person to claim a bound companion under a hidden infernal clause; the Advocate defends the Council.",
  parentSection: { kind: "endgame" },
  sequence: 2,
  prerequisites: [
    { kind: "dlc_chapter_completion", chapterId: "dlc_y1q2_pale_inheritance" },
  ],
  steps: STEPS,
  rewards: { xp: 110, soulBoundDream: 18, lightEnergyReward: 55 },
  setsFlagsOnComplete: ["dlc_chapter_dlc_y2q2_hierarchy_audit_complete"],
};

export const DLC_Y2Q2_MINI_MANIFEST: MiniDlcManifest = {
  id: "dlc_y2q2_hierarchy_audit",
  title: "The Hierarchy Audit",
  sealRequired: 4,
  yearlyAffinity: "severance",
  moodImpact: { war: 0.1, death: 0.05 },
  prerequisiteDlc: "dlc_y1q2_pale_inheritance",
  newMysterySeed: { seedId: "severance.infernal_clause", sealTier: 4 },
  newTransmissionTrack: { trackId: "T15_the_audit", albumKey: "T15" },
  newCustomItem: {
    itemId: "audit_brief",
    assetSlug: "art/items/severance/audit_brief.png",
  },
  newGuildContract: {
    contractKey: "severance.infernal_counsel",
    summary: "Retain the Advocate to defend bound companions; high cost, high payoff.",
  },
  newGovernanceMotion: { motionKey: "severance_infernal_amnesty_year_2" },
  optionalDemonLord: { hierarchyId: "zyrkoth_at_the_court" },
};
