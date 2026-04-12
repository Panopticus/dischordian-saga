/* Insurgency Remnant Questline — Orin Fell + Renn (spec §4) */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const INSURGENCY_QUESTLINE_FLAGS = [
  "insurgency_fell_contacted", "insurgency_iron_lion_fragment_known",
  "insurgency_forward_contacted", "insurgency_renn_met",
] as const;

const ch1Wheel: WheelOption[] = [
  { id: "ins_ch1_honest", segment: "compassionate", rarity: "common", label: "HONEST", fullText: "I don't know yet.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "orin_fell", delta: 3 } } },
  { id: "ins_ch1_bold", segment: "humanity", rarity: "common", label: "BOLD", fullText: "Yes. But I need to understand what I'm inheriting first.", outcome: { npcTrustDelta: { npcId: "orin_fell", delta: 4 } } },
  { id: "ins_ch1_humble", segment: "compassionate", rarity: "uncommon", label: "HUMBLE", fullText: "I'm not sure anyone is 'something larger.' It might be many things, smaller.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "orin_fell", delta: 4 } } },
  { id: "ins_ch1_curious", segment: "investigate", rarity: "common", label: "CURIOUS", fullText: "Tell me what you've been waiting for. What does 'larger' mean to you?", outcome: { npcTrustDelta: { npcId: "orin_fell", delta: 3 } } },
  { id: "ins_ch1_soldier", segment: "aggressive", rarity: "legendary", label: "SOLDIER: THE AFRAID PART", fullText: "I've heard his broadcast. Not the famous ending — the part before it. The part where he says 'I am afraid this will not be enough and I am going anyway.'", outcome: { npcTrustDelta: { npcId: "orin_fell", delta: 8 }, unlocks: ["insurgency_iron_lion_fragment_known"] }, gateCondition: { requireClass: "soldier" } },
  { id: "ins_ch1_oracle", segment: "skill_check", rarity: "epic", label: "ORACLE", fullText: "I've modeled the probability of the Insurgency achieving its ideological goals as a unified organization versus as a distributed philosophy. The distributed philosophy has better long-term survival odds.", outcome: { npcTrustDelta: { npcId: "orin_fell", delta: 5 } }, gateCondition: { requireClass: "oracle" } },
  { id: "ins_ch1_int8", segment: "skill_check", rarity: "epic", label: "INTEL 8", fullText: "Seventeen thousand years. The Insurgency has outlived every other political movement from the pre-Fall era. How?", outcome: { npcTrustDelta: { npcId: "orin_fell", delta: 4 } }, gateCondition: { minSkillLevel: { skillId: "intelligence", level: 8 } } },
];

const ch1: PotentialQuestlineChapter = {
  id: "insurgency_ch1_orin_fell",
  completionFlag: "insurgency_fell_contacted",
  title: "The Remembrance",
  hook: "An old-fashioned voice-only transmission. Orin Fell speaks with the particular reverence of someone reading from a sacred text.",
  sectorId: "remembrance_archive",
  opener: [
    { speaker: "orin_fell", stageDirection: "The transmission is old-fashioned — voice only, no visual, the way the original Insurgency communicated to avoid surveillance.", text: "Iron Lion's last broadcast. Do you know it? 'To the free souls of the galaxy — if you are hearing this, then I have fallen, but the resistance has not. Take what I was and make it something larger. Take what we built and make it something that does not need a general to keep it standing.'" },
    { speaker: "orin_fell", stageDirection: "A pause.", text: "We have been waiting for the something larger. For seventeen thousand years. The first wave wasn't it — too fast, too sure of themselves, gone before they understood what they'd inherited. Are you something larger?" },
  ],
  wheel: ch1Wheel,
  followups: {
    ins_ch1_honest: [{ speaker: "orin_fell", text: "That's the right answer. Iron Lion didn't know either, the night before the last stand. 'I don't know yet' was his exact phrasing. Renn will tell you — she was there. The fact that you chose the same words means either you've read a transcript you shouldn't have access to, or the kind of person who says 'I don't know yet' is the kind the Insurgency was built for." }],
    ins_ch1_bold: [{ speaker: "orin_fell", text: "Yes, first; understand, second. That's the order the first wave got wrong. They said yes before they understood. The yes was real but the understanding never caught up. You're reversing the sequence. Good." }],
    ins_ch1_humble: [{ speaker: "orin_fell", text: "Many things, smaller. That is — that is not how I've been thinking about it. Iron Lion's broadcast says 'something larger.' I have been interpreting 'larger' as 'greater.' You're interpreting it as 'more numerous.' Both readings are valid. Both change what we're looking for." }],
    ins_ch1_curious: [{ speaker: "orin_fell", text: "Larger means: something that doesn't need a general. Something that doesn't need a single leader or a single ideology or a single enemy. Something that runs on principle rather than personality. We have not found it in seventeen thousand years because we keep looking for a person who embodies it instead of a structure that distributes it." }],
    ins_ch1_soldier: [
      { speaker: "orin_fell", stageDirection: "A long silence.", text: "That part isn't in the broadcast archives. How did you know that part?" },
      { speaker: "orin_fell", text: "He said that to Commander Renn, the night before the last stand. Private communication. Renn told me. Renn has told almost no one. The fact that you know it means someone has been preparing you for this conversation for longer than you've been awake." },
    ],
    ins_ch1_oracle: [{ speaker: "orin_fell", text: "The distributed philosophy. Yes. I have been arguing this in Insurgency council for forty years. The Forward faction disagrees — they believe operational structure requires hierarchy. The Question faction agrees with your model but cannot convince the Forward. Perhaps an Oracle's probability data will succeed where my rhetoric has not." }],
    ins_ch1_int8: [{ speaker: "orin_fell", text: "By not being an organization. The Insurgency is an idea. Ideas do not have supply chains. Ideas do not need territory. Ideas survive because someone remembers them. Every time someone tries to turn the Insurgency into an institution, it becomes vulnerable to the things that destroy institutions. Every time it returns to being an idea, it becomes unkillable." }],
  },
};

const ch2: PotentialQuestlineChapter = {
  id: "insurgency_ch2_the_forward",
  completionFlag: "insurgency_forward_contacted",
  unlockFlag: "insurgency_fell_contacted",
  title: "The Forward's Mission",
  hook: "Field Commander Renn doesn't make speeches. She makes plans. The Vortex is three sectors closer than it was last month.",
  sectorId: "forward_bastion",
  opener: [
    { speaker: "field_commander_renn", text: "I don't make speeches. Orin makes speeches. I make plans. The Vortex is three sectors closer than it was last month. The Hierarchy has been probing the frontier. The Terminus Swarm is regrouping. Do you fight, or do you philosophize?" },
  ],
  wheel: [
    { id: "ins_ch2_fight", segment: "aggressive", rarity: "common", label: "FIGHT", fullText: "I fight. What do you need?", outcome: { npcTrustDelta: { npcId: "field_commander_renn", delta: 5 } } },
    { id: "ins_ch2_both", segment: "investigate", rarity: "uncommon", label: "BOTH", fullText: "Both. The best fighters I know are the ones who understand why they're fighting.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "field_commander_renn", delta: 4 } } },
    { id: "ins_ch2_plan", segment: "machine", rarity: "common", label: "SHOW ME THE PLAN", fullText: "Show me the plan. I'll tell you where the gaps are.", outcome: { npcTrustDelta: { npcId: "field_commander_renn", delta: 3 } } },
    { id: "ins_ch2_soldier", segment: "aggressive", rarity: "epic", label: "SOLDIER: IRON LION'S BROADCAST", fullText: "I heard Iron Lion. The part about being afraid. I'm afraid too. I'm going anyway.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "field_commander_renn", delta: 8 }, unlocks: ["insurgency_renn_met"] }, gateCondition: { requireClass: "soldier" } },
  ],
  followups: {
    ins_ch2_fight: [{ speaker: "field_commander_renn", text: "Good. The Forward operates in three contested sectors simultaneously. Joint operations with the DeMagi Warden's Vanguard — Seris-Fen is competent and we trust each other as far as any cross-faction trust goes. We also run quiet coordination with the Quarchon Dimensional Guard — Axis-9 and I have a working relationship that neither of our superiors has sanctioned. Pick a front." }],
    ins_ch2_both: [{ speaker: "field_commander_renn", stageDirection: "Almost a smile.", text: "Orin would like you. Fine. Both. The philosophy is Iron Lion's: every being has the right to exist without surveillance. The fight is mine: making sure those beings survive long enough to exercise the right. The two are not in tension. They're in sequence." }],
    ins_ch2_plan: [{ speaker: "field_commander_renn", text: "The plan is: hold three sectors. Deny the Hierarchy corridor access. Keep the Terminus Swarm south of the shipping lanes. Coordinate with anyone who'll coordinate. The gaps: we need intelligence on the Hierarchy's next probe, we need a way to resupply without passing through Syndicate transit corridors, and we need someone who can tell the DeMagi and Quarchon to stop fighting each other long enough to fight the actual enemy." }],
    ins_ch2_soldier: [
      { speaker: "field_commander_renn", stageDirection: "She stops. For the first time, the operational mask slips.", text: "He said that to me. The night before. Private frequency. I have carried those words for seventeen thousand years." },
      { speaker: "field_commander_renn", text: "If you know them — if someone made sure you knew them — then there is a thread connecting his last stand to your first one. I do not know who wove it. I know it's there. And I know that the person standing in front of me is afraid and going anyway, just like he was." },
      { speaker: "field_commander_renn", text: "Welcome to the Forward, Soldier." },
    ],
  },
};

export const INSURGENCY_QUESTLINE: PotentialQuestline = {
  id: "insurgency_the_something_larger",
  title: "The Something Larger",
  premise: "The Insurgency won seventeen thousand years ago and has been trying to figure out what winning was for ever since. Three factions: the Remembrance (conscience), the Forward (muscle), the Question (philosophy).",
  actGate: 1,
  chapters: [ch1, ch2],
  flags: INSURGENCY_QUESTLINE_FLAGS,
};
