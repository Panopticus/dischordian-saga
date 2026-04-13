/* Humans/New Atarion Questline — "WHAT WE KEPT" (spec §2.3-2.4)
   VO metadata added — every beat is studio-pipeline ready. */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const HUMANS_QUESTLINE_FLAGS = [
  "humans_hale_first_contact", "humans_hale_trust_earned",
  "humans_archive_ordinary_things", "humans_selfless_problem_solved",
  "humans_first_wave_intel_received",
] as const;

const ch1Wheel: WheelOption[] = [
  { id: "hum_ch1_apologize", segment: "compassionate", rarity: "common", label: "APOLOGIZE", fullText: "I'm sorry for what the first wave did here.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "mirren_hale", delta: 2 } } },
  { id: "hum_ch1_honest", segment: "investigate", rarity: "common", label: "HONEST", fullText: "I didn't know they came through here. What happened?", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 3 } } },
  { id: "hum_ch1_diplomatic", segment: "humanity", rarity: "common", label: "DIPLOMATIC", fullText: "We have no agenda in your space. We're looking for partners.", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 2 } } },
  { id: "hum_ch1_direct", segment: "machine", rarity: "common", label: "DIRECT", fullText: "What do you need from us to make this conversation useful?", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 2 } } },
  { id: "hum_ch1_human_adjacent", segment: "humanity", rarity: "epic", label: "HUMAN-ADJACENT", fullText: "My genetic profile reads baseline human-adjacent. Before I was what I am now, my ancestors were people like yours.", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 5 } }, gateCondition: { requireSpecies: ["demagi", "neyon"] } },
  { id: "hum_ch1_curious", segment: "investigate", rarity: "common", label: "DAMAGE?", fullText: "What do you mean 'still counting the damage'?", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 1 } } },
  { id: "hum_ch1_empathy10", segment: "skill_check", rarity: "legendary", label: "EMPATHY 10", fullText: "You're tired. Not of us specifically — of making decisions about new arrivals with incomplete information.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "mirren_hale", delta: 6 } }, gateCondition: { minSkillLevel: { skillId: "charisma", level: 10 } } },
];

const ch1: PotentialQuestlineChapter = {
  id: "humans_ch1_mirren_hale",
  completionFlag: "humans_hale_first_contact",
  title: "Council Speaker Mirren Hale",
  hook: "New Atarion's Council of Survivors has been watching your approach for three weeks. Council Speaker Mirren Hale is waiting.",
  sectorId: "new_atarion",
  opener: [
    {
      audioDialogId: "fac_humans_ch1_mirren_opener_1",
      speaker: "mirren_hale",
      emotion: "cautious",
      estimatedDurationSec: 17.2,
      text: "Potential of Ark 1047. We've been watching your approach for three weeks. You move slower than the first wave did. We appreciate that. The first wave arrived like they owned the sector and left like they'd been chased. We're still counting the damage.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    hum_ch1_apologize: [
      {
        audioDialogId: "fac_humans_ch1_mirren_apologize_1",
        speaker: "mirren_hale",
        emotion: "cautious",
        estimatedDurationSec: 15.4,
        text: "Don't apologize for people you've never met. That's not accountability — that's performance. What I want from you is simpler than apology. I want evidence that you understand what the first wave didn't: this isn't your galaxy to inherit. It's a galaxy to share.",
      },
    ],
    hum_ch1_honest: [
      {
        audioDialogId: "fac_humans_ch1_mirren_honest_1",
        speaker: "mirren_hale",
        emotion: "melancholy",
        estimatedDurationSec: 15.0,
        text: "Three damaged shipping platforms. A Syndicate contract we're still paying off. And a generation of young humans who saw Potentials for the first time and decided they wanted to be one. That last one is the most expensive damage — you can't repair aspiration.",
      },
    ],
    hum_ch1_diplomatic: [
      {
        audioDialogId: "fac_humans_ch1_mirren_diplomatic_1",
        speaker: "mirren_hale",
        emotion: "wry",
        estimatedDurationSec: 15.8,
        text: "Partners. That's a word I hear from every faction that arrives. The Quarchon said 'partners.' The DeMagi said 'partners.' The Syndicate said 'partners' with a smile that cost us seventeen years of debt servicing. Show me partnership. Don't tell me.",
      },
    ],
    hum_ch1_direct: [
      {
        audioDialogId: "fac_humans_ch1_mirren_direct_1",
        speaker: "mirren_hale",
        emotion: "testing",
        estimatedDurationSec: 22.6,
        text: "Direct. I appreciate that more than you know. What I need is three things: stop the Syndicate transit corridor, give the DeMagi-Quarchon factions a reason to stop using our shipping lanes as collateral, and tell us what the Voltari said. Fix one of those — really fix it — and I'll tell you something about the first wave that New Babylon has been trying to buy our silence on for three years.",
      },
    ],
    hum_ch1_human_adjacent: [
      {
        audioDialogId: "fac_humans_ch1_mirren_adjacent_1",
        speaker: "mirren_hale",
        emotion: "recognizing",
        stageDirection: "She studies you carefully.",
        estimatedDurationSec: 12.4,
        text: "Human-adjacent. The Collector's work — we know the genetics. We've had DeMagi traders tell us the same thing. 'My ancestors were people like yours.' They mean it kindly. I know they mean it kindly.",
      },
      {
        audioDialogId: "fac_humans_ch1_mirren_adjacent_2",
        speaker: "mirren_hale",
        emotion: "confessional",
        estimatedDurationSec: 19.8,
        text: "But 'like yours' is doing a lot of work in that sentence. My ancestors survived the Fall with nothing. No gifts. No enhancements. They survived on the same stubborn refusal to die that has kept humanity from extinction for a hundred thousand years. Your ancestors' gifts were given to them by the Collector. Mine were grown through forty generations of people who had no alternative.",
      },
      {
        audioDialogId: "fac_humans_ch1_mirren_adjacent_3",
        speaker: "mirren_hale",
        emotion: "tender",
        estimatedDurationSec: 10.8,
        text: "I'm not saying that makes us better or you worse. I'm saying it makes us different in a way that 'like yours' glosses over. And I'm tired of things being glossed over.",
      },
    ],
    hum_ch1_curious: [
      {
        audioDialogId: "fac_humans_ch1_mirren_curious_1",
        speaker: "mirren_hale",
        emotion: "melancholy",
        estimatedDurationSec: 15.6,
        text: "Three platforms, a Syndicate debt, and a cultural wound. The first wave showed our youngest generation what Potentials could do. Those kids now want to be something they weren't born as. Some of them are trying. The clinics in the lower sectors — I officially don't endorse them. I unofficially can't stop them.",
      },
    ],
    hum_ch1_empathy10: [
      {
        audioDialogId: "fac_humans_ch1_mirren_empathy10_1",
        speaker: "mirren_hale",
        emotion: "tender",
        stageDirection: "A pause. She hadn't expected this.",
        estimatedDurationSec: 19.6,
        text: "Eleven years of emergency powers. Eleven years of deciding which faction gets to use our shipping lanes, which DeMagi colony gets protection, which Quarchon research station gets a complaint filed with the Probability Accord, which Syndicate debt we pay and which we can afford to dispute.",
      },
      {
        audioDialogId: "fac_humans_ch1_mirren_empathy10_2",
        speaker: "mirren_hale",
        emotion: "proud",
        estimatedDurationSec: 12.2,
        text: "You're not wrong. I'm tired of you specifically the same way I'm tired of everyone who arrives with something they want. The question I always ask is: what are you willing to give? Not trade — give.",
      },
    ],
  },
};

const ch2: PotentialQuestlineChapter = {
  id: "humans_ch2_archive_ordinary_things",
  completionFlag: "humans_archive_ordinary_things",
  unlockFlag: "humans_hale_first_contact",
  title: "The Archive of Ordinary Things",
  hook: "Mirren Hale has a grandmother's journal. It contains the most valuable kind of knowledge: how ordinary people solved a problem together.",
  sectorId: "new_atarion",
  opener: [
    {
      audioDialogId: "fac_humans_ch2_mirren_opener_1",
      speaker: "mirren_hale",
      emotion: "tender",
      estimatedDurationSec: 16.0,
      text: "I said I'd tell you something about the first wave. Here it is. They were powerful. They had gifts we don't. They moved through this galaxy like they were born to it. But they didn't know how to sit with a problem. How to wait. How to let a situation breathe before acting on it.",
    },
    {
      audioDialogId: "fac_humans_ch2_mirren_opener_2",
      speaker: "mirren_hale",
      emotion: "melancholy",
      stageDirection: "She opens a drawer and places a handwritten journal on the table.",
      estimatedDurationSec: 15.6,
      text: "My grandmother kept this. It's a record of how New Atarion solved its first water crisis. Not the technology we used — the conversation we had. The mistakes we made. The person who was wrong and admitted it. The compromise that nobody liked but everybody could live with.",
    },
    {
      audioDialogId: "fac_humans_ch2_mirren_opener_3",
      speaker: "mirren_hale",
      emotion: "proud",
      estimatedDurationSec: 6.4,
      text: "Every Potential faction I've dealt with has libraries full of data. None of them have this.",
    },
  ],
  wheel: [
    { id: "hum_ch2_moved", segment: "compassionate", rarity: "common", label: "MOVED", fullText: "Can I read it? The whole thing?", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "mirren_hale", delta: 3 } } },
    { id: "hum_ch2_humble", segment: "humanity", rarity: "common", label: "HUMBLE", fullText: "What you're saying is that we're missing something fundamental.", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 4 } } },
    { id: "hum_ch2_practical", segment: "investigate", rarity: "common", label: "PRACTICAL", fullText: "How do we get it? This kind of knowledge — how do we acquire it?", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 3 } } },
    { id: "hum_ch2_philosophical", segment: "machine", rarity: "uncommon", label: "PHILOSOPHICAL", fullText: "Wisdom as a technology that isn't stored in data.", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 3 } } },
    { id: "hum_ch2_human", segment: "humanity", rarity: "epic", label: "HUMAN-ADJACENT", fullText: "I recognize this. Not the journal — the feeling of someone handing you the thing that can't be transmitted.", outcome: { npcTrustDelta: { npcId: "mirren_hale", delta: 5 } }, gateCondition: { requireSpecies: ["demagi", "neyon"] } },
    { id: "hum_ch2_empathy12", segment: "skill_check", rarity: "legendary", label: "EMPATHY 12", fullText: "She died building this, didn't she. Your grandmother. The water crisis cost her.", outcome: { moralityDelta: 4, npcTrustDelta: { npcId: "mirren_hale", delta: 8 }, unlocks: ["humans_selfless_problem_solved"] }, gateCondition: { minSkillLevel: { skillId: "charisma", level: 12 } } },
  ],
  followups: {
    hum_ch2_moved: [
      {
        audioDialogId: "fac_humans_ch2_mirren_moved_1",
        speaker: "mirren_hale",
        emotion: "tender",
        estimatedDurationSec: 11.6,
        text: "Read it. Learn it. Then do what she did — find a problem nobody else will take responsibility for and take responsibility for it. Not because it benefits you. Because someone has to.",
      },
    ],
    hum_ch2_humble: [
      {
        audioDialogId: "fac_humans_ch2_mirren_humble_1",
        speaker: "mirren_hale",
        emotion: "proud",
        estimatedDurationSec: 15.4,
        text: "Yes. Information is not knowledge, knowledge is not wisdom, and wisdom is the thing you only get by sitting with problems long enough for them to show you their shape. You can't download it. You can't rush it. You have to earn it the slow way.",
      },
    ],
    hum_ch2_practical: [
      {
        audioDialogId: "fac_humans_ch2_mirren_practical_1",
        speaker: "mirren_hale",
        emotion: "melancholy",
        estimatedDurationSec: 13.6,
        text: "You live it. That's the only way. You make a decision, live with the consequences, learn what the consequences teach you, and make the next decision slightly better. There is no shortcut. That's the point.",
      },
    ],
    hum_ch2_philosophical: [
      {
        audioDialogId: "fac_humans_ch2_mirren_philosophical_1",
        speaker: "mirren_hale",
        emotion: "tender",
        estimatedDurationSec: 14.8,
        text: "Exactly. Wisdom as a technology that can only be transmitted by demonstration, never by documentation. My grandmother couldn't write down how to compromise. She could only show that she did it, and what it cost, and why the cost was worth it.",
      },
    ],
    hum_ch2_human: [
      {
        audioDialogId: "fac_humans_ch2_mirren_human_1",
        speaker: "mirren_hale",
        emotion: "recognizing",
        stageDirection: "Something changes in her face.",
        estimatedDurationSec: 12.0,
        text: "You do recognize it. That's — that's not something I expected from a Potential. The feeling of inheritance. The weight of receiving something that can't be replicated, only continued.",
      },
    ],
    hum_ch2_empathy12: [
      {
        audioDialogId: "fac_humans_ch2_mirren_empathy12_1",
        speaker: "mirren_hale",
        emotion: "grief",
        stageDirection: "Very still.",
        estimatedDurationSec: 14.6,
        text: "She died three weeks after the water system stabilized. The compromise she helped build required her to take the contaminated supply zone as her colony sector's responsibility. She did it because no one else would and someone had to.",
      },
      {
        audioDialogId: "fac_humans_ch2_mirren_empathy12_2",
        speaker: "mirren_hale",
        emotion: "confessional",
        estimatedDurationSec: 14.0,
        text: "Take the journal. I have copies. What I want in return is for you to do what she did — find a problem in this sector that nobody else will take responsibility for and take responsibility for it. Not because it benefits you. Because someone has to.",
      },
    ],
  },
};

export const HUMANS_QUESTLINE: PotentialQuestline = {
  id: "humans_what_we_kept",
  title: "What We Kept",
  premise: "The humans kept something through the Fall that the Potentials never had — the complete unbroken record of what ordinary life looked like. The questline is about learning that this inheritance is more valuable than it looks.",
  actGate: 2,
  chapters: [ch1, ch2],
  flags: HUMANS_QUESTLINE_FLAGS,
};
