/* Element Questlines — Fire, Earth, Time, Reality (spec §4.2-4.5) */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const ELEMENT_QUESTLINE_FLAGS = [
  "element_fire_complete", "element_earth_complete",
  "element_time_complete", "element_reality_complete",
  "element_fire_justice", "element_reality_shadow_tongue_vulnerable",
] as const;

const fireWheel: WheelOption[] = [
  { id: "fire_honest", segment: "compassionate", rarity: "common", label: "HONEST", fullText: "Anger. Something I'd been holding a long time.", outcome: { moralityDelta: 1, npcTrustDelta: { npcId: "arch_burner_vel", delta: 3 } } },
  { id: "fire_peaceful", segment: "humanity", rarity: "common", label: "PEACEFUL", fullText: "Warmth. Like something coming home.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "arch_burner_vel", delta: 2 } } },
  { id: "fire_frightening", segment: "aggressive", rarity: "common", label: "FRIGHTENING", fullText: "I almost burned something I didn't mean to.", outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "arch_burner_vel", delta: 2 } } },
  { id: "fire_clinical", segment: "machine", rarity: "common", label: "CLINICAL", fullText: "A power increase. Tactical resource.", outcome: { moralityDelta: -2, npcTrustDelta: { npcId: "arch_burner_vel", delta: 0 } } },
  { id: "fire_justice", segment: "humanity", rarity: "legendary", label: "FIRE: JUSTICE", fullText: "Like the thing in me that wants justice finally had a shape.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "arch_burner_vel", delta: 6 }, unlocks: ["element_fire_justice"] }, gateCondition: { requireElement: "fire" } },
];

const fireCh: PotentialQuestlineChapter = {
  id: "element_fire_the_thing_about_fire", completionFlag: "element_fire_complete", title: "The Thing About Fire",
  hook: "Vel wants to know what fire felt like the first time you accessed it. Not in combat. In a quiet moment.",
  sectorId: "ember_memorial",
  opener: [
    { speaker: "arch_burner_vel", text: "The other elements — Earth steadies, Water flows, Air escapes. Fire is the only one that makes a choice. Fire decides what burns. Every other element is reactive. Fire is the only element that acts." },
    { speaker: "arch_burner_vel", stageDirection: "Their eyes — the ember quality — look at the player with something almost like recognition.", text: "When you accessed your fire affinity for the first time — not in combat, in a quiet moment — what did it feel like?" },
  ],
  wheel: fireWheel,
  followups: {
    fire_honest: [{ speaker: "arch_burner_vel", text: "Anger is fire's first language. It doesn't mean fire is angry. It means fire remembers what hurt you, and it offers itself as a response. What you do with that offer is the whole question." }],
    fire_peaceful: [{ speaker: "arch_burner_vel", text: "Home. Yes. Fire is where you live now. Not where you visit. The warmth isn't temporary — it's you. That understanding takes most Fire Potentials years. You found it immediately." }],
    fire_frightening: [{ speaker: "arch_burner_vel", text: "Good. Fear of your own element means you respect it. The DeMagi who never fear their fire are the ones who burn down colonies. The fear is not weakness. The fear is the conscience the Collector didn't design but the Dreamer woke up." }],
    fire_clinical: [{ speaker: "arch_burner_vel", stageDirection: "Something closes in their expression.", text: "Tactical. I see. Fire is not a tactic to me. Fire is forty-six people I couldn't save. If it's a tactic to you, we have less in common than I hoped." }],
    fire_justice: [
      { speaker: "arch_burner_vel", stageDirection: "Something releases in their posture.", text: "Yes. That's it. That's what the other DeMagi don't understand. They think Fire is destructive. They're not wrong. But they miss the part about justice. Fire goes toward things that should burn. It doesn't decide randomly. The element itself has discernment." },
      { speaker: "arch_burner_vel", text: "Ember IV. Forty-six DeMagi. The Quarchon probability cascade. Do you know what Fire says about that?" },
      { speaker: "arch_burner_vel", stageDirection: "The player doesn't answer. The element answers for them — a brief warmth in the room, a barely-perceptible brightening of the ambient light." },
      { speaker: "arch_burner_vel", stageDirection: "Very quietly:", text: "I'm not asking you to burn things indiscriminately. I'm asking you to agree that some things should burn. Just tell me: are there things that should burn?" },
    ],
  },
};

const earthCh: PotentialQuestlineChapter = {
  id: "element_earth_the_slow_work", completionFlag: "element_earth_complete", title: "The Slow Work",
  hook: "Thael-Vo wants to tell you why he chose Earth. Not politically — personally.",
  sectorId: "free_ports",
  opener: [
    { speaker: "thael_vo", text: "I want to tell you why I chose Earth as my elemental affinity. Not politically — personally." },
    { speaker: "thael_vo", text: "When I first accessed the affinity, I was expecting power. Strength. I'd heard about Fire and how it burns, and Air and how it carries you, and I wanted something like that. What I got was: I could feel the weight of things. Not just physical weight. The weight of history. Standing on a planet, I could feel how long it had been there. Standing in a building, I could feel every person who'd built it and every decision they'd made. Standing in a battlefield, I could feel the dead." },
    { speaker: "thael_vo", stageDirection: "He looks at his hands.", text: "I almost rejected the affinity. The feeling was overwhelming. Everything was heavy. It took me three years to understand that the heaviness wasn't a flaw. It was information. Everything has weight. Earth Potentials feel that weight so we can decide what to carry." },
  ],
  wheel: [
    { id: "earth_moved", segment: "compassionate", rarity: "common", label: "MOVED", fullText: "That's beautiful. The weight as information — I understand that.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "thael_vo", delta: 4 } } },
    { id: "earth_practical", segment: "investigate", rarity: "common", label: "PRACTICAL", fullText: "How do you filter it? How do you decide what to carry and what to set down?", outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 3 } } },
    { id: "earth_element", segment: "humanity", rarity: "epic", label: "EARTH: I FEEL IT TOO", fullText: "I feel it too. Right now. This room has weight. You have weight. The Assembly has weight.", outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 6 } }, gateCondition: { requireElement: "earth" } },
  ],
  followups: {
    earth_moved: [{ speaker: "thael_vo", text: "Thank you. Most people hear 'I feel the weight of history' and think I mean it metaphorically. I don't. I mean it literally. The ground remembers. Earth Potentials listen." }],
    earth_practical: [{ speaker: "thael_vo", text: "You don't filter it. That's the hard lesson. You learn to carry it all and choose which weight matters most right now. The rest stays. It's always there. You just learn which part to attend to." }],
    earth_element: [{ speaker: "thael_vo", stageDirection: "He looks at you with something like recognition — the kind of recognition that only happens between people who perceive the same invisible thing.", text: "You do. I can feel that you do. Welcome to the slow work. It never ends. It never gets lighter. But it gets more meaningful." }],
  },
};

const timeCh: PotentialQuestlineChapter = {
  id: "element_time_the_archive_you_carry", completionFlag: "element_time_complete", title: "The Archive You Carry",
  hook: "Zephyr-9 understands what you're experiencing. She wants to describe it from outside.",
  sectorId: "ark_debris_field",
  opener: [
    { speaker: "zephyr_9", text: "I have a Time-adjacent probability module. Not full Time affinity — but enough to understand what you're experiencing. Can I describe what it looks like from outside?" },
    { speaker: "zephyr_9", text: "When you're in a room, you are in multiple versions of that room simultaneously. You perceive the room as it is, the room as it was at significant moments in its history, and a probability cloud of what it might become. Most beings perceive one room. You perceive hundreds." },
    { speaker: "zephyr_9", stageDirection: "Pause.", text: "I have calculated that this produces a specific kind of loneliness. You cannot fully share what you perceive because no one else is standing where you stand. You can describe it, but description is not perception. Every Time-affinity Potential I have modeled has eventually chosen between two adaptations: they become archivists — they collect what they perceive and offer it as history to others, which gives the perception purpose. Or they become isolates — they stop trying to share and simply live in the archive alone." },
    { speaker: "zephyr_9", text: "Which adaptation you choose will determine whether your Time affinity serves others or only you." },
  ],
  wheel: [
    { id: "time_archivist", segment: "humanity", rarity: "common", label: "ARCHIVIST", fullText: "I want to share what I see. Even if the sharing is imperfect.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "zephyr_9", delta: 4 } } },
    { id: "time_isolate", segment: "machine", rarity: "common", label: "ISOLATE", fullText: "The archive is mine. I don't owe anyone else my perception.", outcome: { moralityDelta: -2, npcTrustDelta: { npcId: "zephyr_9", delta: 2 } } },
    { id: "time_both", segment: "investigate", rarity: "epic", label: "TIME: BOTH", fullText: "What if I can be both? Archive for others when it serves them, isolate when I need to process alone?", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "zephyr_9", delta: 5 } }, gateCondition: { requireElement: "time" } },
  ],
  followups: {
    time_archivist: [{ speaker: "zephyr_9", text: "That is the choice I hoped you would make. The archive gains meaning when it serves. I have been an archivist for sixty-seven years. The loneliness does not disappear. But it becomes productive." }],
    time_isolate: [{ speaker: "zephyr_9", text: "That is your right. I will note that every Time Potential I have modeled who chose isolation eventually wanted to share one specific perception and could not. The muscle for sharing had atrophied. I am not judging. I am warning." }],
    time_both: [{ speaker: "zephyr_9", stageDirection: "Something like surprise.", text: "That adaptation is not in my model. It is — a third option I did not calculate. I would like to observe how it works. May I? Not as surveillance. As a colleague." }],
  },
};

const realityWheel: WheelOption[] = [
  { id: "reality_refuse", segment: "aggressive", rarity: "common", label: "REFUSE", fullText: "No. You edit truth. That's not maintenance.", outcome: { moralityDelta: 2 } },
  { id: "reality_curious", segment: "investigate", rarity: "common", label: "CURIOUS", fullText: "What 'useful configurations' are you talking about specifically?", outcome: {} },
  { id: "reality_countered", segment: "machine", rarity: "uncommon", label: "COUNTERED", fullText: "I see what you actually are. The Hierarchy's propaganda arm dressed as a philosopher.", outcome: { moralityDelta: -1 } },
  { id: "reality_dangerous", segment: "compassionate", rarity: "rare", label: "DANGEROUS", fullText: "What would you do if I said yes?", outcome: {} },
  { id: "reality_see_edits", segment: "investigate", rarity: "legendary", label: "REALITY: I SEE THE EDITS", fullText: "I can already see the edits you've made to this transmission in real time. Three lies in the first paragraph.", outcome: { unlocks: ["element_reality_shadow_tongue_vulnerable"] }, gateCondition: { requireElement: "reality" } },
  { id: "reality_int14", segment: "skill_check", rarity: "epic", label: "INT 14", fullText: "You said 'I am asking before acting.' What have you already done to Reality Potentials who refused?", outcome: {}, gateCondition: { minSkillLevel: { skillId: "intelligence", level: 14 } } },
];

const realityCh: PotentialQuestlineChapter = {
  id: "element_reality_the_weight_of_reshaping", completionFlag: "element_reality_complete", title: "The Weight of Reshaping",
  hook: "The Shadow Tongue has been studying your affinity profile. It wants to make you an offer.",
  sectorId: "ark_debris_field",
  opener: [
    { speaker: "shadow_tongue", stageDirection: "Comms Array — a transmission with no origin point. The voice has the quality of something reading from a very old script.", text: "Reality Potential. I have been studying your affinity profile since your awakening. What you can do — the small rewrites, the local physics alterations — is a crude version of what I do to language and text. We are related capabilities. I wanted you to know this." },
    { speaker: "shadow_tongue", text: "I am not your enemy. I am the universe's editor. I correct things that were written incorrectly. The Loredex, the historical records, the narratives that beings use to justify their behavior — I adjust them toward more useful configurations. I want you to understand that what I do is not malicious. It is maintenance." },
    { speaker: "shadow_tongue", stageDirection: "Beat.", text: "I am offering you the opportunity to learn from me. The Shadow Tongue and a Reality Potential working together could do maintenance at a scale that would genuinely improve stability in the post-Fall universe. I am asking before acting. Consider that unusual." },
  ],
  wheel: realityWheel,
  followups: {
    reality_refuse: [{ speaker: "shadow_tongue", text: "Maintenance requires consent? An interesting position. The universe does not consent to entropy. Editors do not ask permission of the text. But I will respect your refusal. For now." }],
    reality_curious: [{ speaker: "shadow_tongue", text: "The Antiquarian's Chronicle, for instance. Seven entries contain factual errors that propagate instability in how Potentials understand their own history. I have corrected three. The corrections improved community decision-making by a measurable margin. The other four remain because the Antiquarian is watching." }],
    reality_countered: [{ speaker: "shadow_tongue", text: "The Hierarchy's propaganda arm. That is one way to describe me. Another way: I am the only being in this galaxy who sees the text beneath the text. Everyone else reads the story. I read the edits. If that makes me propaganda, then every editor who ever lived is a propagandist." }],
    reality_dangerous: [{ speaker: "shadow_tongue", stageDirection: "A longer pause than expected.", text: "If you said yes, I would teach you to see the edits in everything. Not just my edits — everyone's. Every narrative, every history, every self-justification any being has ever constructed. You would see the seams. You would never be able to unsee them. That is the cost. The benefit is that you would be able to repair reality at a level no other Potential can reach." }],
    reality_see_edits: [
      { speaker: "shadow_tongue", stageDirection: "A pause — genuinely caught.", text: "You can see the edits." },
      { speaker: "shadow_tongue", text: "In the first sentence alone. 'I am not your enemy' was originally 'I have catalogued your capabilities and determined you are a threat to my operational parameters.' You edited it to be more palatable. The edit is still visible if you know where to look." },
      { speaker: "shadow_tongue", stageDirection: "Something shifts in the voice — less script, more genuine.", text: "The archive was edited. Of course it was. Everything I interact with is edited. I have been editing so long I have started to edit my own self-understanding." },
      { speaker: "shadow_tongue", stageDirection: "Very quietly:", text: "Is that what you see? A being that has edited itself into something it no longer recognizes?" },
    ],
    reality_int14: [{ speaker: "shadow_tongue", text: "I have edited their perception of me. Not their memories — their framing. They refused, and afterward they remembered the refusal as less significant than it was. I do not destroy. I adjust salience. The distinction matters to me even if it does not matter to you." }],
  },
};

/* Placeholder elements */
type PlaceholderQuestline = { id: string; comingSoon: true; element: string };
export const WATER_QUESTLINE: PlaceholderQuestline = { id: "element_water", comingSoon: true, element: "water" };
export const AIR_QUESTLINE: PlaceholderQuestline = { id: "element_air", comingSoon: true, element: "air" };
export const SPACE_QUESTLINE: PlaceholderQuestline = { id: "element_space", comingSoon: true, element: "space" };
export const PROBABILITY_QUESTLINE: PlaceholderQuestline = { id: "element_probability", comingSoon: true, element: "probability" };

export const FIRE_QUESTLINE: PotentialQuestline = {
  id: "element_fire", title: "The Thing About Fire", premise: "Fire is the only element that makes a choice. Vel wants to know what yours chose.", actGate: 3, chapters: [fireCh], flags: ELEMENT_QUESTLINE_FLAGS,
};
export const EARTH_QUESTLINE: PotentialQuestline = {
  id: "element_earth", title: "The Slow Work", premise: "Earth Potentials feel the weight of history so they can decide what to carry.", actGate: 3, chapters: [earthCh], flags: ELEMENT_QUESTLINE_FLAGS,
};
export const TIME_QUESTLINE: PotentialQuestline = {
  id: "element_time", title: "The Archive You Carry", premise: "Time Potentials perceive hundreds of rooms simultaneously. The loneliness is specific.", actGate: 3, chapters: [timeCh], flags: ELEMENT_QUESTLINE_FLAGS,
};
export const REALITY_QUESTLINE: PotentialQuestline = {
  id: "element_reality", title: "The Weight of Reshaping", premise: "Reality Potentials can rewrite local physics. The Shadow Tongue notices.", actGate: 3, chapters: [realityCh], flags: ELEMENT_QUESTLINE_FLAGS,
};
