/* dlc_breeding_01_crew_unlocks — The Bene-Gesserit Manifest
 *
 * Unlocks the Crew-Bene-Gesserit tier of the Breeding Program at
 * Act 3+. Surfaces the seven canonical blood classifications and
 * the per-classification Blood Weave crystal yields. The
 * Antiquarian frames the program in the Advocate's voice (per
 * Testament v2 §VI Part 4 — "the Collector's Work was always
 * the Advocate's letter to the future").
 *
 * Parent : breeding_program · crew_bene_gesserit · Sequence 1
 * Prereqs : Act 3 complete
 */
import type { DlcChapter } from "../../types";

export const DLC_BREEDING_01_CREW_UNLOCKS: DlcChapter = {
  id: "dlc_breeding_01_crew_unlocks",
  title: "The Bene-Gesserit Manifest",
  synopsis:
    "The Advocate left a manifest. It catalogues seven bloodlines, each yielding a different density of Blood Weave crystal. The Crew tier of the Breeding Program is the page she meant for you.",
  parentSection: { kind: "breeding_program", tier: "crew_bene_gesserit" },
  sequence: 1,
  prerequisites: [{ kind: "act_completion", act: 3 }],
  steps: [
    {
      kind: "narration",
      id: "manifest_surfaces",
      speaker: "antiquarian",
      text: "There is a page in the Chronicle that does not appear until Act 3. The page is in the Advocate's hand. It catalogues seven bloodlines and the Blood Weave crystal density each one yields under ritual. She left it for you. She knew you would arrive at the page.",
      subtitle: "Bloodline classifications surface: PURE · HYBRID · DEMONIC · ADVOCATE · SAMSARA · NAMED · UNKNOWN.",
    },
    {
      kind: "narration",
      id: "the_yields",
      speaker: "antiquarian",
      text: "DEMONIC and ADVOCATE bloodlines yield the densest crystal — the corruption pressure on DEMONIC is the cost. PURE bloodlines yield the least; the bloodline is too clean to refine into crystal at scale. That is why generations matter. The Advocate is patient. So is the Collector.",
    },
    {
      kind: "choice",
      id: "manifest_commitment",
      speaker: "antiquarian",
      prompt: "Which bloodline do you commit to first?",
      options: [
        {
          id: "pure",
          text: "PURE — the long road. Seven generations or nothing. I will keep the bloodline clean and pay the patience tax.",
          setFlag: "breeding_path_pure_chosen",
        },
        {
          id: "hybrid",
          text: "HYBRID — the working compromise. Decent yield, no corruption pressure, no waiting.",
          setFlag: "breeding_path_hybrid_chosen",
        },
        {
          id: "named",
          text: "NAMED — the careful selection. Each generation is a person whose name I record and remember.",
          setFlag: "breeding_path_named_chosen",
        },
      ],
    },
    {
      kind: "narration",
      id: "aftermath_pure",
      speaker: "antiquarian",
      text: "PURE. The patience tax. I will record this in the ledger in the long hand — the one I reserve for those who mean to be remembered in seven generations rather than one. The Collector will not see yield for an Age. He is, of all of us, the one who does not mind waiting. Neither, it seems, are you.",
      requiresFlag: "breeding_path_pure_chosen",
    },
    {
      kind: "narration",
      id: "aftermath_hybrid",
      speaker: "antiquarian",
      text: "HYBRID. The working compromise. No corruption pressure, no waiting, decent crystal. I will not pretend it is the road the Collector hoped you would take — but it is the road that keeps the most of your crew alive to walk it. There is a kind of mercy in a yield nobody had to bleed for.",
      requiresFlag: "breeding_path_hybrid_chosen",
    },
    {
      kind: "narration",
      id: "aftermath_named",
      speaker: "antiquarian",
      text: "NAMED. Each generation a person whose name you record. I will give you a second ledger for it, then — the names go beside mine, in the hand I keep for the witnessed. It is the slowest accounting of all, the naming. The Collector will understand. He has been a name in someone's book for fifteen thousand years.",
      requiresFlag: "breeding_path_named_chosen",
    },
    {
      kind: "narration",
      id: "first_cycle_opens",
      speaker: "antiquarian",
      text: "The manifest closes. The first ritual cycle is scheduled for the next moon. The Collector is, as always, in his study, in his office, in his chair, in his eternity. He is waiting for the first cycle's report.",
    },
  ],
  rewards: {
    xp: 80,
    soulBoundDream: 8,
    lightEnergyReward: 40,
    loredexEntries: [
      "concept_breeding_program",
      "concept_seven_bloodlines",
      "concept_blood_weave_crystal_yield",
    ],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_breeding_01_crew_unlocks_complete",
    "crew_bene_gesserit_unlocked",
    "breeding_manifest_read",
  ],
};
