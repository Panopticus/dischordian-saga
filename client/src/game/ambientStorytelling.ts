/* ═══════════════════════════════════════════════════════
   AMBIENT STORYTELLING — NPCs reference history organically

   Characters don't dump exposition. They leak it.

   Elara mentions sunrises during combat briefings.
   The Human quotes someone he used to know during trade talk.
   The backstory seeps through unrelated conversations.

   This makes the world feel lived-in.
   ═══════════════════════════════════════════════════════ */

export interface AmbientReference {
  id: string;
  /** Which NPC says this */
  npcId: string;
  /** Trust required */
  minTrust: number;
  /** What triggers this line */
  context: AmbientContext;
  /** The line itself */
  text: string;
  /** What backstory it references */
  backstoryReference: string;
  /** Can only trigger once per context type */
  oneTime?: boolean;
}

export type AmbientContext =
  | "during_combat_briefing" | "during_trade" | "during_puzzle_help"
  | "during_quest_handoff" | "small_talk" | "waiting" | "room_entry"
  | "shared_silence" | "victory_reaction" | "defeat_reaction";

export const AMBIENT_REFERENCES: AmbientReference[] = [
  // Elara leaks her past in unexpected moments
  { id: "elara_sunrise_combat", npcId: "elara", minTrust: 40,
    context: "during_combat_briefing",
    text: "The enemy approaches from the east — which is, coincidentally, where the sun is coming up on Ark 2049's nearest star. I've been cataloguing them. 93,847. I don't know why I count.",
    backstoryReference: "Elara's 93,847 sunrises loneliness" },
  { id: "elara_atarion_silence", npcId: "elara", minTrust: 60,
    context: "shared_silence",
    text: "You know what Atarion's air tasted like? ...Neither do I. But sometimes I think I almost remember. Salt. Ozone. Something blooming.",
    backstoryReference: "Elara was Senator Voss on Atarion", oneTime: true },
  { id: "elara_calibrate_memory", npcId: "elara", minTrust: 30,
    context: "small_talk",
    text: "I recalibrate my memory indices every 47 hours. Most AIs go 200. I just... prefer to know what I remember before I forget.",
    backstoryReference: "Elara fears her amnesia returning" },

  // The Human references his Detective past casually
  { id: "human_new_babylon_rain", npcId: "the_human", minTrust: 30,
    context: "during_puzzle_help",
    text: "There's a lock like this one in New Babylon. East wall, Precinct 7. I opened it 400 years ago. Felt important then.",
    backstoryReference: "The Human's Detective era" },
  { id: "human_case_memory", npcId: "the_human", minTrust: 40,
    context: "during_quest_handoff",
    text: "Reminds me of the Molvek Case. Drug ring. Everyone lied. Took me eleven weeks to find the thread. This feels like week three.",
    backstoryReference: "The Human as greatest investigator of New Babylon" },
  { id: "human_archon_regret", npcId: "the_human", minTrust: 70,
    context: "shared_silence",
    text: "1,351 years ago I signed a contract. Didn't read the fine print. Turns out 'sacrifice' and 'execution' rhyme more than I knew.",
    backstoryReference: "The Human became 12th Archon, imprisoned in substrate", oneTime: true },

  // Agent Zero's military past echoes
  { id: "zero_training_memory", npcId: "agent_zero", minTrust: 30,
    context: "during_combat_briefing",
    text: "Drill sergeant used to say: aim for center mass, hit the weapon. You'll live longer. He's dead now. Everyone from the Academy is dead. Just me. *signal crackles*",
    backstoryReference: "Agent Zero Insurgency training" },
  { id: "zero_zenon_scars", npcId: "agent_zero", minTrust: 60,
    context: "victory_reaction",
    text: "*static* Zenon was quiet after. For about four hours. Then the Warlord's ships came. I'd killed the Game Master. They needed to kill me back. *pause* Fair trade, I guess.",
    backstoryReference: "Zero killed Game Master on Zenon, then was killed by Warlord", oneTime: true },

  // Locke's New Babylon history
  { id: "locke_old_deal", npcId: "adjudicator_locke", minTrust: 30,
    context: "during_trade",
    text: "Reminds me of a deal with a Quarchon merchant in New Babylon, circa 14,200 A.A. He tried to underprice me. I ended his career. Politely.",
    backstoryReference: "Locke's New Babylon centuries" },
  { id: "locke_eye_patch_origin", npcId: "adjudicator_locke", minTrust: 70,
    context: "shared_silence",
    text: "You're wondering about the eye. Everyone wonders. I made one trade I shouldn't have. With someone I trusted. She took the eye as warranty. I got what I wanted. She kept the eye anyway. Now I understand contracts better.",
    backstoryReference: "Locke's eye patch origin story", oneTime: true },
  { id: "locke_human_history", npcId: "adjudicator_locke", minTrust: 50,
    context: "during_trade",
    text: "Your Detective used to close my deals by accident. He'd solve a murder and three of my rivals would go with it. I profited. He thought he was serving justice. The righteous never suspect.",
    backstoryReference: "Locke used The Human/Detective as unwitting tool" },

  // Source/Kael leaks memory of his old self
  { id: "source_warm_memory", npcId: "the_source", minTrust: 40,
    context: "shared_silence",
    text: "*viral static pauses* ...I used to make coffee. With my hands. For other people. I don't know why I just remembered that. Or why it matters. Or why it hurts.",
    backstoryReference: "Kael's pre-virus human life" },
  { id: "source_recruiter_mode", npcId: "the_source", minTrust: 50,
    context: "during_combat_briefing",
    text: "The Recruiter part of me is still in here. It's analyzing your tactics. Assessing whether you'd be useful to the Insurgency. The irony isn't lost on whatever's left of me.",
    backstoryReference: "Kael was The Recruiter for the Insurgency" },

  // Antiquarian sees through time
  { id: "antiquarian_timeline_slip", npcId: "the_antiquarian", minTrust: 40,
    context: "room_entry",
    text: "In timeline 44, this room burned. In timeline 83, you're standing in the same spot but holding a different hand. The multiverse is crowded. I envy its conviction.",
    backstoryReference: "Antiquarian sees across timelines" },
  { id: "antiquarian_programmer_slip", npcId: "the_antiquarian", minTrust: 80,
    context: "shared_silence",
    text: "I wrote this universe's first draft. The Architect wrote the second. The Shadow Tongue has been editing ever since. I stopped writing. I watch instead. Watching is safer. Less satisfying.",
    backstoryReference: "Antiquarian is the Programmer", oneTime: true },

  // Shadow Tongue can't help leaking
  { id: "shadow_meta_aware", npcId: "shadow_tongue", minTrust: 40,
    context: "waiting",
    text: "*text briefly displays in different font* Did you see that? Neither did I. It didn't happen. *normal text* Let's continue.",
    backstoryReference: "Shadow Tongue can't help editing" },
];

export function getAmbientReference(
  npcId: string,
  trust: number,
  context: AmbientContext,
  triggeredIds: Set<string>,
): AmbientReference | null {
  const candidates = AMBIENT_REFERENCES.filter(r =>
    r.npcId === npcId &&
    r.minTrust <= trust &&
    r.context === context &&
    (!r.oneTime || !triggeredIds.has(r.id))
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
