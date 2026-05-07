/* dlc_hierarchy_01_xeth_audit — The Debt Collector's Audit
 *
 * First rung of the Hierarchy ladder. The COO (Debt Collector)
 * presents the player's metaphysical balance sheet for the first
 * time. The Antiquarian translates the column entries.
 *
 * Parent : hierarchy_arc · Sequence 1
 * Prereqs : Act 3 complete
 */
import type { DlcChapter } from "../../types";

export const DLC_HIERARCHY_01_XETH_AUDIT: DlcChapter = {
  id: "dlc_hierarchy_01_xeth_audit",
  title: "The Debt Collector's Audit",
  synopsis:
    "Xeth'Raal opens a ledger no one volunteered to maintain. Every thought you ever finished is on a line. The Debt Collector wants to know which lines you'd rather not have written.",
  parentSection: { kind: "hierarchy_arc" },
  sequence: 1,
  prerequisites: [{ kind: "act_completion", act: 3 }],
  steps: [
    {
      kind: "narration",
      id: "audit_opens",
      speaker: "antiquarian",
      text: "There is no door. There is a column of names, and yours is at the top, and a being who looks like a column made of names is reading it.",
      subtitle: "Xeth'Raal, Debt Collector COO. The audit begins without paperwork.",
    },
    {
      kind: "narration",
      id: "the_ledger",
      speaker: "antiquarian",
      text: "The ledger is not a book. It is the memory of every promise you made under your breath. Xeth'Raal does not need you to remember them — he remembers for you. He only needs you to choose which line you stand by.",
    },
    {
      kind: "choice",
      id: "audit_choice",
      speaker: "antiquarian",
      prompt: "Which line do you stand by, when the Debt Collector reads it back?",
      options: [
        {
          id: "honored",
          text: "Every promise still owed. They are mine. I will pay them in time, with weight.",
          setFlag: "hierarchy_xeth_audit_honored",
        },
        {
          id: "renegotiated",
          text: "The ones I keep. The ones I've outgrown, I do not. Renegotiate.",
          setFlag: "hierarchy_xeth_audit_renegotiated",
        },
        {
          id: "refused",
          text: "None. The ledger is yours, not mine. You may read it forever; I will not sign it.",
          setFlag: "hierarchy_xeth_audit_refused",
        },
      ],
    },
    {
      kind: "narration",
      id: "audit_closes",
      speaker: "antiquarian",
      text: "The column closes. He does not say goodbye. Debt Collectors do not. They schedule the next audit.",
    },
  ],
  rewards: {
    xp: 60,
    soulBoundDream: 6,
    lightEnergyReward: 30,
    loredexEntries: ["entity_xethraal"],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_hierarchy_01_xeth_audit_complete",
    "hierarchy_ladder_first_rung_climbed",
  ],
};
