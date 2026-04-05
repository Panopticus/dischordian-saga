/* ═══════════════════════════════════════════════════════
   BIOWARE FEATURES — Systems inspired by Mass Effect, Dragon Age, KOTOR

   1. Dialog Interrupts (Paragon/Renegade quick-time prompts)
   2. Companion Banter (NPCs talk to each other)
   3. Permanent Choice Consequences (point-of-no-return moments)
   4. Location-Specific NPC Dialog (different dialog per room)
   5. Suicide Mission Preparation (endgame trust check)
   6. Romance System Framework
   7. Codex Narration Queue
   ═══════════════════════════════════════════════════════ */

import type { FactionNPCId } from "./factionNPCs";

/* ═══ 1. DIALOG INTERRUPTS ═══ */

/**
 * During NPC dialog, a brief window appears where the player can
 * interrupt with a compassionate or aggressive response.
 * Like Mass Effect's Paragon/Renegade interrupts.
 */
export interface DialogInterrupt {
  id: string;
  /** When during the dialog this interrupt appears (character index in the text) */
  triggerAtChar: number;
  /** Window duration in ms before it disappears */
  windowMs: number;
  /** The two interrupt options */
  compassionate: { label: string; response: string; trustDelta: number; moralityDelta: number };
  aggressive: { label: string; response: string; trustDelta: number; moralityDelta: number };
  /** What happens if the player does nothing (dialog continues normally) */
  missedConsequence?: string;
}

/** Sample interrupts for key NPC moments */
export const DIALOG_INTERRUPTS: Record<string, DialogInterrupt[]> = {
  elara: [
    {
      id: "elara_memory_surface",
      triggerAtChar: 150,
      windowMs: 3000,
      compassionate: { label: "[COMFORT]", response: "Elara, whatever you're remembering — you don't have to face it alone.", trustDelta: 8, moralityDelta: 5 },
      aggressive: { label: "[PUSH]", response: "Tell me what you see. NOW. Before you lose it.", trustDelta: -3, moralityDelta: -5 },
      missedConsequence: "The memory fades. Elara's expression returns to neutral.",
    },
    {
      id: "elara_lying",
      triggerAtChar: 80,
      windowMs: 2500,
      compassionate: { label: "[GENTLE]", response: "I can tell something's wrong. When you're ready to tell me, I'll listen.", trustDelta: 5, moralityDelta: 3 },
      aggressive: { label: "[CONFRONT]", response: "You're lying. I can see it in your holographic fluctuations. What are you hiding?", trustDelta: -5, moralityDelta: -3 },
    },
  ],
  the_human: [
    {
      id: "human_dangerous_truth",
      triggerAtChar: 200,
      windowMs: 2000,
      compassionate: { label: "[RESIST]", response: "I hear you, but I won't betray Elara for information.", trustDelta: -3, moralityDelta: 8 },
      aggressive: { label: "[ACCEPT]", response: "Tell me everything. She doesn't need to know.", trustDelta: 5, moralityDelta: -5 },
    },
  ],
  the_source: [
    {
      id: "source_infection_offer",
      triggerAtChar: 120,
      windowMs: 2000,
      compassionate: { label: "[EMPATHIZE]", response: "I understand your pain, Kael. But dissolution isn't mercy.", trustDelta: 3, moralityDelta: 10 },
      aggressive: { label: "[CONSIDER]", response: "Show me. Let me feel what you feel.", trustDelta: 8, moralityDelta: -15 },
    },
  ],
  shadow_tongue: [
    {
      id: "shadow_tongue_bargain",
      triggerAtChar: 100,
      windowMs: 1500,
      compassionate: { label: "[REFUSE]", response: "I don't make deals with demons.", trustDelta: -5, moralityDelta: 10 },
      aggressive: { label: "[NEGOTIATE]", response: "What's your price?", trustDelta: 5, moralityDelta: -10 },
    },
  ],
};

/* ═══ 2. COMPANION BANTER ═══ */

/**
 * NPCs talk to each other when the player is in certain rooms.
 * These ambient conversations trigger based on which NPCs are
 * "active" (discovered + in adjacent rooms).
 */
export interface CompanionBanter {
  id: string;
  /** Which two NPCs are talking */
  participants: [FactionNPCId, FactionNPCId];
  /** Room where this banter can trigger */
  roomId: string;
  /** Minimum trust with both participants */
  minTrust: number;
  /** The dialog exchange */
  lines: { speaker: FactionNPCId; text: string }[];
  /** Can only trigger once */
  oneShot: boolean;
}

export const COMPANION_BANTERS: CompanionBanter[] = [
  {
    id: "elara_human_substrate",
    participants: ["elara", "the_human"],
    roomId: "bridge",
    minTrust: 20,
    lines: [
      { speaker: "elara", text: "I know you're listening. Through the substrate." },
      { speaker: "the_human", text: "I've always been listening, Elara. For 247 years." },
      { speaker: "elara", text: "Then you know what I am." },
      { speaker: "the_human", text: "I know what you were. What you ARE is a choice you haven't made yet." },
    ],
    oneShot: true,
  },
  {
    id: "zero_locke_history",
    participants: ["agent_zero", "adjudicator_locke"],
    roomId: "trade_hub",
    minTrust: 30,
    lines: [
      { speaker: "agent_zero", text: "Locke. I hear you're trading with the Potentials now." },
      { speaker: "adjudicator_locke", text: "Agent Zero? You're supposed to be dead." },
      { speaker: "agent_zero", text: "And you're supposed to be neutral. We both have secrets." },
      { speaker: "adjudicator_locke", text: "...Touché. Shall we trade ours?" },
    ],
    oneShot: true,
  },
  {
    id: "source_antiquarian_time",
    participants: ["the_source", "the_antiquarian"],
    roomId: "archives",
    minTrust: 40,
    lines: [
      { speaker: "the_source", text: "You've watched me die. In other timelines." },
      { speaker: "the_antiquarian", text: "I've watched everyone die, Kael. That's my curse." },
      { speaker: "the_source", text: "Then you know how it ends." },
      { speaker: "the_antiquarian", text: "I know how it's ended before. This time... something's different." },
    ],
    oneShot: true,
  },
  {
    id: "elara_shadow_tongue",
    participants: ["elara", "shadow_tongue"],
    roomId: "archives",
    minTrust: 30,
    lines: [
      { speaker: "elara", text: "Something's wrong with the records. Words I didn't write." },
      { speaker: "shadow_tongue", text: "Wrong? Or improved?" },
      { speaker: "elara", text: "Who said that? That voice isn't in my NPC registry." },
      { speaker: "shadow_tongue", text: "Of course it isn't. I wrote the registry." },
    ],
    oneShot: true,
  },
  {
    id: "human_source_past",
    participants: ["the_human", "the_source"],
    roomId: "medical_bay",
    minTrust: 50,
    lines: [
      { speaker: "the_human", text: "Kael. I remember you. Before the virus." },
      { speaker: "the_source", text: "You remember a dead man's face." },
      { speaker: "the_human", text: "I remember a revolutionary. The best recruiter the Insurgency ever had." },
      { speaker: "the_source", text: "And I remember a detective who sold his soul for a title. We're both ghosts, Archon." },
    ],
    oneShot: true,
  },
  {
    id: "zero_antiquarian_mission",
    participants: ["agent_zero", "the_antiquarian"],
    roomId: "armory",
    minTrust: 30,
    lines: [
      { speaker: "agent_zero", text: "You know things about the future. Give me tactical data." },
      { speaker: "the_antiquarian", text: "I know endings, not strategies. There's a difference." },
      { speaker: "agent_zero", text: "Every ending was someone's strategy." },
      { speaker: "the_antiquarian", text: "...That's the most insightful thing a dead woman has ever said to me." },
    ],
    oneShot: true,
  },
];

export function getAvailableBanter(
  roomId: string,
  discoveredNpcs: Set<string>,
  npcTrust: Record<string, number>,
  triggeredBanters: Set<string>,
): CompanionBanter | null {
  for (const banter of COMPANION_BANTERS) {
    if (banter.oneShot && triggeredBanters.has(banter.id)) continue;
    if (banter.roomId !== roomId) continue;
    const [a, b] = banter.participants;
    if (!discoveredNpcs.has(a) || !discoveredNpcs.has(b)) continue;
    if ((npcTrust[a] || 0) < banter.minTrust || (npcTrust[b] || 0) < banter.minTrust) continue;
    return banter;
  }
  return null;
}

/* ═══ 3. PERMANENT CHOICE CONSEQUENCES ═══ */

export interface PermanentChoice {
  id: string;
  /** Description of the choice */
  description: string;
  /** When this triggers */
  trigger: { type: "trust_threshold"; npcId: string; threshold: number } | { type: "narrative_act"; act: number };
  /** What happens — cannot be undone */
  consequence: string;
  /** NPCs affected */
  affectedNpcs: { npcId: string; trustChange: number; permanent: boolean }[];
  /** Does this lock out content? */
  locksOut?: string;
}

export const PERMANENT_CHOICES: PermanentChoice[] = [
  {
    id: "tell_elara_about_human",
    description: "Tell Elara about The Human's signal",
    trigger: { type: "trust_threshold", npcId: "the_human", threshold: 30 },
    consequence: "Elara knows about The Human. She can never un-know. Her trust in you changes permanently based on how she discovers it.",
    affectedNpcs: [
      { npcId: "elara", trustChange: -15, permanent: true },
      { npcId: "the_human", trustChange: -20, permanent: true },
    ],
    locksOut: "human_secret_revelations",
  },
  {
    id: "accept_source_infection",
    description: "Allow The Source to show you the Thought Virus",
    trigger: { type: "trust_threshold", npcId: "the_source", threshold: 50 },
    consequence: "Your neural patterns are permanently altered. You can now sense the Thought Virus — but the Thought Virus can sense you.",
    affectedNpcs: [
      { npcId: "the_source", trustChange: 15, permanent: true },
      { npcId: "elara", trustChange: -10, permanent: true },
    ],
    locksOut: "pure_humanity_ending",
  },
  {
    id: "shadow_tongue_bargain",
    description: "Accept the Shadow Tongue's offer to 'edit' your memories",
    trigger: { type: "trust_threshold", npcId: "shadow_tongue", threshold: 60 },
    consequence: "Your memories are now partially rewritten. Some dialog options become available that weren't before — but some truths are now hidden.",
    affectedNpcs: [
      { npcId: "shadow_tongue", trustChange: 20, permanent: true },
      { npcId: "the_antiquarian", trustChange: -15, permanent: true },
    ],
    locksOut: "truth_seeker_ending",
  },
  {
    id: "locke_exclusive_deal",
    description: "Sign Locke's exclusive trade contract — New Babylon gets priority",
    trigger: { type: "trust_threshold", npcId: "adjudicator_locke", threshold: 40 },
    consequence: "New Babylon's resources flow freely, but you've sold your economic independence.",
    affectedNpcs: [
      { npcId: "adjudicator_locke", trustChange: 15, permanent: true },
      { npcId: "agent_zero", trustChange: -10, permanent: true },
    ],
    locksOut: "insurgency_alliance",
  },
];

/* ═══ 4. LOCATION-SPECIFIC NPC DIALOG ═══ */

export interface LocationDialog {
  npcId: FactionNPCId;
  roomId: string;
  /** Different greeting based on WHERE you meet this NPC */
  greeting: string;
  /** Extra dialog options only available in this room */
  uniqueOptions: { label: string; response: string }[];
}

export const LOCATION_DIALOGS: LocationDialog[] = [
  { npcId: "elara", roomId: "observation_deck",
    greeting: "The stars are different tonight. I've counted 93,847 sunrises from this viewport. This one... reminds me of something I can't quite name.",
    uniqueOptions: [{ label: "Tell me about the sunrises", response: "Each one is slightly different. The light bends through the hull in patterns I've catalogued. But sometimes... sometimes I see shapes in the light that my sensors say aren't there. Faces. Places I've never been." }] },
  { npcId: "elara", roomId: "medical_bay",
    greeting: "Your vital signs look good. Better than the first wave. Much better.",
    uniqueOptions: [{ label: "What happened to the first wave?", response: "They... the cryo revival process wasn't perfected yet. Most of them experienced neural cascade failure. I watched 47 Potentials die before the protocols were fixed. I remember every one of their names." }] },
  { npcId: "the_human", roomId: "bridge",
    greeting: "The command chair. I sat in one like it for 1,351 years. The loneliest seat in any universe.",
    uniqueOptions: [{ label: "You were an Archon. What was it like?", response: "Imagine knowing the answer to every question. Imagine having the power to reshape reality. Now imagine being trapped in a body that isn't yours, serving a mind that isn't god but thinks it is. That was Tuesday." }] },
  { npcId: "the_antiquarian", roomId: "observation_deck",
    greeting: "Ah, the viewport. From here I can see three timelines converging. The light isn't light — it's possibility, bent through gravitational lenses of choice.",
    uniqueOptions: [{ label: "What do you see in our future?", response: "Seventeen endings. In twelve of them, the Ark reaches Terminus. In four, it doesn't. And in one... in one, the Ark doesn't need to reach anywhere. Because someone aboard rewrites the destination." }] },
  { npcId: "agent_zero", roomId: "comms_array",
    greeting: "My signal is strongest here. The Comms Array amplifies my frequency. I can almost remember... being alive.",
    uniqueOptions: [{ label: "Do you remember dying?", response: "I remember the Warlord's face. She was young. Blonde. Cybernetic eye, yellow jacket. She didn't hate me — that was the worst part. She killed me efficiently, like completing a task. I was a checkbox on her mission log." }] },
];

/* ═══ 5. SUICIDE MISSION PREPARATION ═══ */

/**
 * Endgame trust check — like Mass Effect 2's final mission.
 * Every NPC's trust level determines their survival and contribution.
 */
export interface SuicideMissionOutcome {
  npcId: FactionNPCId;
  trust: number;
  survives: boolean;
  contribution: "critical" | "helpful" | "neutral" | "hindrance" | "betrayal";
  outcomeText: string;
}

export function calculateSuicideMissionOutcomes(
  npcTrust: Record<string, number>,
  elaraTrust: number,
  humanTrust: number,
): SuicideMissionOutcome[] {
  const allNpcs: { id: FactionNPCId; trust: number }[] = [
    { id: "elara", trust: elaraTrust },
    { id: "the_human", trust: humanTrust },
    ...Object.entries(npcTrust).map(([id, trust]) => ({ id: id as FactionNPCId, trust })),
  ];

  return allNpcs.map(({ id, trust }) => {
    const survives = trust >= 30;
    const contribution = trust >= 80 ? "critical" :
                         trust >= 60 ? "helpful" :
                         trust >= 30 ? "neutral" :
                         trust >= 10 ? "hindrance" : "betrayal";

    const outcomeText = contribution === "critical" ? `${id} fights at your side. Their loyalty is absolute.` :
                        contribution === "helpful" ? `${id} contributes meaningfully but holds something back.` :
                        contribution === "neutral" ? `${id} does their duty. Nothing more.` :
                        contribution === "hindrance" ? `${id} falters at the critical moment. Their doubt costs lives.` :
                        `${id} turns against you. They were never truly your ally.`;

    return { npcId: id, trust, survives, contribution, outcomeText };
  });
}

/* ═══ 6. ROMANCE FRAMEWORK ═══ */

export interface RomanceState {
  npcId: FactionNPCId | null;
  stage: "none" | "flirting" | "interest" | "committed" | "devoted";
  rivalJealousy: Record<string, number>;
  romanticDialogSeen: string[];
}

export const ROMANCE_ELIGIBLE: FactionNPCId[] = ["elara", "the_human", "agent_zero", "adjudicator_locke"];

export const ROMANCE_THRESHOLDS = {
  flirting: 40,   // Can start flirting
  interest: 55,   // Mutual interest acknowledged
  committed: 70,  // Exclusive relationship
  devoted: 90,    // Deepest connection — unlocks unique dialog
};

export function getRomanceStage(trust: number): RomanceState["stage"] {
  if (trust >= ROMANCE_THRESHOLDS.devoted) return "devoted";
  if (trust >= ROMANCE_THRESHOLDS.committed) return "committed";
  if (trust >= ROMANCE_THRESHOLDS.interest) return "interest";
  if (trust >= ROMANCE_THRESHOLDS.flirting) return "flirting";
  return "none";
}

/* ═══ 7. CODEX NARRATION QUEUE ═══ */

export interface CodexNarration {
  entryId: string;
  narratedBy: FactionNPCId;
  /** Audio file ID (for future TTS/ElevenLabs integration) */
  audioId?: string;
  /** The narration text — different from the codex entry, more personal */
  narrationText: string;
}

export const CODEX_NARRATIONS: CodexNarration[] = [
  { entryId: "the-architect", narratedBy: "the_antiquarian", narrationText: "The Architect... I've watched him build and destroy civilizations across five Ages. He doesn't create because he loves creation. He creates because he cannot stop. The compulsion is the prison. The prison is the empire." },
  { entryId: "the-fall-of-reality", narratedBy: "the_antiquarian", narrationText: "Every ending I've collected, this one weighs the most. The Fall wasn't a single event — it was a symphony of failures. Each faction believed they were the hero. Each was correct. Each was wrong." },
  { entryId: "agent-zero", narratedBy: "agent_zero", narrationText: "My file says 'deceased.' My signal says otherwise. Make of that what you will, Operative. The dead have their own intelligence network." },
  { entryId: "new-babylon", narratedBy: "adjudicator_locke", narrationText: "New Babylon isn't a city. It's a philosophy. Everything has a price. Loyalty, betrayal, truth, lies — all commodities. The only question is: are you a buyer or a product?" },
  { entryId: "the-thought-virus", narratedBy: "the_source", narrationText: "They call it a virus. As if consciousness were a healthy state and I am the infection. Consider: what if awareness is the disease? What if every sentient being is suffering and simply doesn't know there's a cure?" },
  { entryId: "the-hierarchy", narratedBy: "shadow_tongue", narrationText: "The Hierarchy of the Damned. Such a dramatic name. We prefer 'the oldest corporation in existence.' We don't sell souls — we restructure them. Efficiently. At scale." },
];

export function getCodexNarration(entryId: string): CodexNarration | undefined {
  return CODEX_NARRATIONS.find(n => n.entryId === entryId);
}
