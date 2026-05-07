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
