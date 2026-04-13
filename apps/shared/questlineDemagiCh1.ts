/* DeMagi Questline Ch1 — First Contact from the Assembly (spec §2.1) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const DEMAGI_CH1_FLAGS = ["demagi_assembly_contacted", "demagi_trade_channel_explained"] as const;

const ch1Wheel: WheelOption[] = [
  {
    id: "dem_ch1_suspicious",
    segment: "aggressive",
    rarity: "common",
    label: "SUSPICIOUS",
    fullText: "You've been awake forty-three years and this is the first contact?",
    outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "thael_vo", delta: 1 } },
  },
  {
    id: "dem_ch1_interested",
    segment: "investigate",
    rarity: "common",
    label: "INTERESTED",
    fullText: "Tell me what you've been building.",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 3 } },
  },
  {
    id: "dem_ch1_direct",
    segment: "machine",
    rarity: "common",
    label: "DIRECT",
    fullText: "What's the matter you want my cooperation on?",
    outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "thael_vo", delta: 2 } },
  },
  {
    id: "dem_ch1_demagi_only",
    segment: "humanity",
    rarity: "rare",
    label: "DeMagi: WHY TRADE CHANNELS?",
    fullText: "I'm DeMagi. Why are you contacting me through Trade channels instead of directly?",
    outcome: {
      npcTrustDelta: { npcId: "thael_vo", delta: 4 },
      unlocks: ["demagi_trade_channel_explained"],
    },
    gateCondition: { requireSpecies: "demagi" },
  },
  {
    id: "dem_ch1_perception",
    segment: "skill_check",
    rarity: "epic",
    label: "PERCEPTION 8",
    fullText: "You said you've been watching my choices. All of them? Including the ones in the substrate?",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 3 }, elaraTrustDelta: 1 },
    gateCondition: { minSkillLevel: { skillId: "perception", level: 8 } },
  },
];

export const DEMAGI_CH1: PotentialQuestlineChapter = {
  id: "demagi_ch1_first_contact",
  completionFlag: "demagi_assembly_contacted",
  title: "First Contact from the Assembly",
  hook: "A hologram materializes on the Bridge: Council Speaker Thael-Vo of the Elemental Assembly.",
  sectorId: "free_ports",
  opener: [
    {
      speaker: "thael_vo",
      stageDirection: "A hologram materializes on the Bridge: a tall being with skin that shifts subtly between earthy bronze and green — a DeMagi marked clearly by their element. Their voice has the particular cadence of someone who has been preparing this speech for a while and is trying not to let it show.",
    },
    {
      speaker: "thael_vo",
      text: "Potential of Ark 1047. I am Thael-Vo, Earth-Speaker of the Elemental Assembly. We have been watching your awakening. We have been watching your choices. You have been kind to the living systems around you. This matters to us.",
    },
    {
      speaker: "thael_vo",
      text: "We are DeMagi. We woke from our pods forty-three years ago. We have been building something since then. We want to show it to you. Not because we want something from you — well, that's not entirely true, we do want your cooperation on a matter — but first because you deserve to know that you are not alone. That the second wave is not just you.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    dem_ch1_suspicious: [
      {
        speaker: "thael_vo",
        text: "A fair response. We could have contacted you at awakening. We chose not to because the Quarchon were watching your Ark from the moment your pod opened — they have a whole probability branch dedicated to newly awakened Potentials and which faction they'll align with. We needed them to think you were unaffiliated for long enough that you could make a genuine choice.",
      },
      {
        speaker: "thael_vo",
        text: "Now you've been awake long enough that your alignment isn't just a probability projection. It's a record. And the record suggests you're someone worth meeting.",
      },
    ],
    dem_ch1_interested: [
      {
        speaker: "thael_vo",
        text: "Twelve self-sustaining colonies. A mutual defense network. A shared research archive on elemental affinity development. And the beginning of a governance framework that doesn't require a single centralized authority. Forty-three years. We've been busy.",
      },
    ],
    dem_ch1_direct: [
      {
        speaker: "thael_vo",
        text: "Someone who can move between DeMagi and Quarchon spaces without either faction treating them as an agent of the other. You woke up recently. You haven't been claimed. You are — for a window that will close — genuinely unaffiliated.",
      },
    ],
    dem_ch1_demagi_only: [
      {
        speaker: "thael_vo",
        stageDirection: "A pause — respect in it.",
        text: "Because the Quarchon monitor DeMagi-to-DeMagi direct transmissions. They have probability models that flag DeMagi coordination above a certain threshold. We use trade channels because the Quarchon's Probability Accord considers commerce too variable to usefully model. It's the one blind spot in their surveillance.",
      },
      {
        speaker: "thael_vo",
        text: "You are the first DeMagi we have contacted in eighteen months who did not immediately respond with either fear or defiance. Both are understandable. But what we need right now is someone who will listen. Are you that?",
      },
    ],
    dem_ch1_perception: [
      {
        speaker: "thael_vo",
        stageDirection: "A longer pause. He reassesses you.",
        text: "Not all of them. But more than we expected you to notice we were watching. Your perception is... sharp. That will serve you well in what comes next. The substrate has layers that most Potentials don't sense for years.",
      },
    ],
  },
};
