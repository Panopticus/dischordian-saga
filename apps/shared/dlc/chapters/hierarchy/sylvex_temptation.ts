/* dlc_hierarchy_03_sylvex_temptation — Syl'Vex's Offer
 *
 * Syl'Vex, SVP HR · Corruptor. The Advocate's dark mirror — same
 * cobalt skin, same red-amber gaze, same Sacrum. Where the Advocate
 * sealed it, Syl'Vex unsealed it. Where the Advocate wove the Blood
 * Weave to defend, Syl'Vex weaves it to convert.
 *
 * Per Testament v2 §VI Part 1: Syl'Vex carries every option the
 * Advocate refused. The temptation isn't power — it's relief.
 *
 * Parent : hierarchy_arc · Sequence 3
 * Prereqs : Chapter 2 complete + Act 5 complete
 */
import type { DlcChapter } from "../../types";

export const DLC_HIERARCHY_03_SYLVEX_TEMPTATION: DlcChapter = {
  id: "dlc_hierarchy_03_sylvex_temptation",
  title: "Syl'Vex's Offer",
  synopsis:
    "She wears the Advocate's face. She holds the Sacrum the way the Advocate would not. The offer is gentle, and that is the danger.",
  parentSection: { kind: "hierarchy_arc" },
  sequence: 3,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_hierarchy_02_taskmaster_remembered",
    },
    { kind: "act_completion", act: 5 },
  ],
  steps: [
    {
      kind: "narration",
      id: "mirror_arrival",
      speaker: "antiquarian",
      text: "She is not the Advocate. She is, exactly, every option the Advocate left on the table. Cobalt skin. Amber eyes. The Sacrum, in her right palm, unsealed.",
      subtitle: "Syl'Vex, SVP HR · Corruptor. The Advocate's dark mirror.",
    },
    {
      kind: "narration",
      id: "the_offer",
      speaker: "antiquarian",
      text: "She offers what the Advocate refused: the Blood Weave used not to defend but to convert. She says: 'You can stop carrying this. You can stop being the one who chose. I will choose for you.'",
    },
    {
      kind: "narration",
      id: "the_relief",
      speaker: "antiquarian",
      text: "Notice what is in your chest as she says it. Not horror. Relief. That is the recruitment. That is always the recruitment. She is not stronger than the Advocate. She is more comfortable.",
    },
    {
      kind: "choice",
      id: "answer_sylvex",
      speaker: "antiquarian",
      prompt: "What do you tell Syl'Vex?",
      options: [
        {
          id: "refuse_speak",
          text: "Refuse, in words. 'The Advocate sealed this for a reason. The relief you offer is the reason.'",
          setFlag: "hierarchy_sylvex_refused_in_words",
        },
        {
          id: "refuse_silent",
          text: "Refuse, in silence. Walk away with the Sacrum still cool in your own palm.",
          setFlag: "hierarchy_sylvex_refused_in_silence",
        },
        {
          id: "negotiate",
          text: "Negotiate. Some part of her is not yet what the Hierarchy made. Find that part. Speak to it.",
          setFlag: "hierarchy_sylvex_negotiated",
        },
        {
          id: "step_aside",
          text: "Step aside. Let the offer hang. Some answers are not given in this hour.",
          setFlag: "hierarchy_sylvex_deferred",
        },
      ],
    },
    {
      kind: "narration",
      id: "sylvex_aftermath_refused_in_words",
      speaker: "antiquarian",
      text: "You named the trap aloud — that the relief she offers is itself the reason the Advocate sealed this. Saying it is its own kind of armor: a corruption you have described to its face has lost the one weapon it relies on, which is your not-quite-noticing. She heard you notice. The door stays open. You no longer mistake it for a window.",
      requiresFlag: "hierarchy_sylvex_refused_in_words",
    },
    {
      kind: "narration",
      id: "sylvex_aftermath_refused_in_silence",
      speaker: "antiquarian",
      text: "Silence. You walked out with the Sacrum still cool in your own palm and gave her nothing to negotiate against. The Corruptor can answer any argument; she has had Ages to practice. What she cannot answer is a person who simply declines to begin. The quietest refusal is the one she cannot get a grip on.",
      requiresFlag: "hierarchy_sylvex_refused_in_silence",
    },
    {
      kind: "narration",
      id: "sylvex_aftermath_negotiated",
      speaker: "antiquarian",
      text: "You spoke to the part of her the Hierarchy has not yet finished making. A dangerous mercy — there may be no such part left, and the search itself is how she gets her hooks in. But if there is a Syl'Vex under the Corruptor, you are the first in an Age to address her by it. Remember: you went looking in the Corruptor's house. Count your fingers on the way out.",
      requiresFlag: "hierarchy_sylvex_negotiated",
    },
    {
      kind: "narration",
      id: "sylvex_aftermath_deferred",
      speaker: "antiquarian",
      text: "You let the offer hang. Not refused, not taken — deferred to an hour you have not yet reached. I will not pretend this is safe; an open offer is a debt that accrues interest in the dark. But neither is it foolish. Some answers given too early are just fear wearing the costume of conviction. You chose to be sure first. See that you return before she decides the silence was a yes.",
      requiresFlag: "hierarchy_sylvex_deferred",
    },
    {
      kind: "narration",
      id: "mirror_closes",
      speaker: "antiquarian",
      text: "She does not pursue you. The Corruptor never does. She only opens the door, and the door is always open, and the door is the corruption.",
    },
  ],
  rewards: {
    xp: 100,
    soulBoundDream: 10,
    lightEnergyReward: 50,
    loredexEntries: ["entity_sylvex", "concept_advocates_dark_mirror"],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_hierarchy_03_sylvex_temptation_complete",
    "hierarchy_ladder_corruptor_faced",
    "advocate_dark_mirror_seen",
  ],
};
