/* dlc_hierarchy_04_molgarath_labyrinth — Mol'Garath's Long View
 *
 * NOT an antagonist beat. Per molGarathEndgameLayer.ts +
 * molGarathEpilogue.ts, Mol'Garath the Unmaker / CEO is the saga's
 * endgame REFEREE. He is "not the Architect's ally. Not the Game
 * Master's enemy." This chapter is the audience the Engineer left
 * a key for — Mol'Garath walks the player through the Labyrinth
 * the Engineer disassembled, in his own voice, with the receipts.
 *
 * Parent : hierarchy_arc · Sequence 4
 * Prereqs : Chapter 3 complete + Act 6 complete
 */
import type { DlcChapter } from "../../types";

export const DLC_HIERARCHY_04_MOLGARATH_LABYRINTH: DlcChapter = {
  id: "dlc_hierarchy_04_molgarath_labyrinth",
  title: "Mol'Garath's Long View",
  synopsis:
    "The CEO does not greet you. He hands you a key. The Engineer left it for you, and Mol'Garath has been keeping it in a cold room for four hundred years.",
  parentSection: { kind: "hierarchy_arc" },
  sequence: 4,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_hierarchy_03_sylvex_temptation",
    },
    { kind: "act_completion", act: 6 },
  ],
  steps: [
    {
      kind: "narration",
      id: "audience_opens",
      speaker: "antiquarian",
      text: "He is not what you expected. He has the calm of a man who has read the last page first and gone back to enjoy the middle. He does not gloat. He hands you the key the Engineer left him, and the room behind it.",
      subtitle: "Mol'Garath, CEO · Unmaker. The saga's endgame referee, not its enemy.",
    },
    {
      kind: "narration",
      id: "the_labyrinth",
      speaker: "antiquarian",
      text: "The Labyrinth was a curriculum the Architect designed and the Engineer dismantled. Every recording the Engineer left contains a margin note from Mol'Garath now — a footnote in his cheerful, almost teacher's voice, citing which trap that recording was disabling.",
      subtitle: "Labyrinth Annotations unlock — see molGarathEndgameLayer.ts.",
    },
    {
      kind: "narration",
      id: "the_referee",
      speaker: "antiquarian",
      text: "He is the only being who refereed the run where the Engineer named the Warlord's substrate. He has been waiting for you to arrive at a point where the receipt would mean something. You have arrived. The receipt means something now.",
    },
    {
      kind: "choice",
      id: "audience_choice",
      speaker: "antiquarian",
      prompt: "Mol'Garath asks: what do you carry out of the Labyrinth?",
      options: [
        {
          id: "the_annotations",
          text: "The annotations. The Engineer wrote a curriculum even Mol'Garath had to footnote. I want to read every footnote.",
          setFlag: "hierarchy_molgarath_annotations_taken",
        },
        {
          id: "the_traps_feed",
          text: "The live traps feed. Tell me which traps are being designed across the saga right now. I will know where the Architects are working.",
          setFlag: "hierarchy_molgarath_traps_feed_taken",
        },
        {
          id: "the_final_clue",
          text: "The Hamlet board's final connection. The substrate name the Engineer carved. I want it confirmed.",
          setFlag: "hierarchy_molgarath_final_clue_taken",
        },
      ],
    },
    {
      kind: "narration",
      id: "audience_closes",
      speaker: "antiquarian",
      text: "He does not show you out. He never does. He only resumes his chair and turns a page. The next page is one you wrote, and he has been waiting to read it.",
    },
  ],
  rewards: {
    xp: 150,
    soulBoundDream: 15,
    lightEnergyReward: 75,
    loredexEntries: [
      "entity_molgarath",
      "concept_labyrinth_annotations",
      "concept_long_view_layer",
    ],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_hierarchy_04_molgarath_labyrinth_complete",
    "hierarchy_ladder_ceo_audited",
    "molgarath_audience_concluded",
  ],
};
