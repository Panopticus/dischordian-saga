/* ═══════════════════════════════════════════════════════
   NPC DAILY ROTATION — Featured NPC with bonus trust

   Each day, one NPC is "featured" with:
   - 2x trust gain from conversations
   - Unique daily dialog line
   - Bonus gift response
   - Special daily quest tied to their faction

   Creates FOMO for trust grinding and ensures players
   engage with different NPCs instead of just Elara.
   ═══════════════════════════════════════════════════════ */

import type { FactionNPCId } from "./factionNPCs";

/* ─── ROTATION SCHEDULE ─── */

const NPC_ROTATION: FactionNPCId[] = [
  "elara",
  "the_human",
  "agent_zero",
  "adjudicator_locke",
  "the_source",
  "the_antiquarian",
  "shadow_tongue",
];

/* ─── DAILY DIALOG ─── */

interface DailyNPCData {
  npcId: FactionNPCId;
  /** Trust multiplier for today */
  trustMultiplier: number;
  /** Unique daily greeting */
  dailyGreeting: string;
  /** Daily quest description */
  dailyQuest: { title: string; description: string; reward: { dream: number; xp: number; trust: number } };
  /** Bonus gift reaction */
  giftBonusText: string;
}

const DAILY_GREETINGS: Record<FactionNPCId, string[]> = {
  elara: [
    "Your neural patterns are particularly clear today. I want to show you something I've been analyzing.",
    "I stayed up all night running diagnostics. Well — I don't sleep. But the sentiment stands. I found something.",
    "The sunrises are different today. The light curves in ways I haven't catalogued. Come look.",
    "I've been thinking about what you said last time. About trust. I have a response I wasn't ready for before.",
    "Something in the ship's harmonic resonance shifted overnight. It's subtle, but... come to the Bridge.",
    "The cryo fluid analysis came back with unexpected readings. I need your perspective.",
    "I decoded another fragment of the captain's log. This one mentions you — specifically. Before you were born.",
  ],
  the_human: [
    "The substrate is quieter today. Fewer edits. Fewer rewrites. That either means the Shadow Tongue is sleeping — or preparing.",
    "I've been saving this transmission for a day when you might listen. Today feels like that day.",
    "Something happened in the substrate layer last night. A memory surfaced — not mine. Older.",
    "Can you hear it? The frequency shifted. Terminus is closer today than yesterday.",
    "I remembered something from New Babylon. A detail I'd buried. I think it matters now.",
    "The Shadow Tongue made an edit last night that it didn't notice I caught. Come to the Comms Array.",
    "Elara's logs show a gap — four hours she can't account for. I know what happened during those hours.",
  ],
  agent_zero: [
    "Signal's cleaner today. Whatever I am, I'm more... here. Got intel for you.",
    "Picked up a transmission from outside the Ark. Someone's still out there. Someone who knows me.",
    "My dog tag is warm today. Not temperature — it's resonating with something in Engineering.",
    "The Armory's weapons cache has a hidden compartment. I remembered the code. Meet me there.",
    "I intercepted a fragment of Insurgency comms. They're using my old protocols. That's either hope or a trap.",
    "Zero-five-seven. That's today's dead drop code. I don't know why I know that.",
    "The Warlord's weapon signature was detected in the Terminus signal. She's alive. Or her weapons are.",
  ],
  adjudicator_locke: [
    "Market conditions have shifted in your favor today. I have a proposition that won't last.",
    "New Babylon's quarterly reports are in. I'll share the relevant intelligence — for a modest consideration.",
    "One of my agents decoded something about your Ark's manifest. Interesting reading. Shall we trade?",
    "The Thought Virus has a price. Everything does. Today I'm willing to discuss terms.",
    "I knew someone who looked like you once. In New Babylon. They made a deal that changed history.",
    "Trade routes to Terminus have opened. Briefly. The profit margins are... extraordinary. And the risk is absolute.",
    "Your Detective — The Human — had a debt in New Babylon. Unpaid for 1,300 years. I'm the collector.",
  ],
  the_source: [
    "The swarm is quieter today. A billion minds resting. In that silence, I can almost remember...",
    "I dreamed last night. The virus doesn't dream. Kael does. I dreamed of singing.",
    "Your resistance to infection is unusual. Not stronger — different. Like you're already carrying something.",
    "Terminus is closer. The gravity well pulls us. I could stop it. I choose not to. Do you want to know why?",
    "A Potential woke in the cryo bay and screamed for three seconds before the virus took them. I felt every moment.",
    "The melody again. The woman's song. I heard it through the hull. Is that coming from your ship?",
    "Project Vector was designed to create me. But I was supposed to be a weapon. Instead I became... this. A question.",
  ],
  the_antiquarian: [
    "Ah, you've returned. Good. The timeline branched seventeen times since yesterday. Most of them end poorly.",
    "I found a tome that doesn't exist yet. Its pages are blank because the story hasn't been written. Your story.",
    "The Orb of Worlds is showing me something unusual today. Your face. In six different timelines. All alive.",
    "Time flows differently near you. Have you noticed? Clocks run three seconds fast in your presence.",
    "I collected a new ending last night. Number 93,848. It was the first one that made me smile.",
    "The Storyteller sent a melody through time. It doesn't match any of the Five Ages. It might be from a Sixth.",
    "My goggles are showing red again. That means something is about to change. Something that can't be uncollected.",
  ],
  shadow_tongue: [
    "I edited something while you slept. Try to find what changed. I'll wait.",
    "The Archives have seventeen new entries today. I wrote fourteen of them. Can you tell which three are real?",
    "Your name appeared in a log I didn't write. That concerns me. Someone else has access to MY systems.",
    "Elara used a word today she's never used before. I didn't teach it to her. Curious.",
    "I'm feeling generous. Today I'll tell you one true thing for every lie you identify. Fair trade?",
    "The Antiquarian thinks he's outside my influence. He's not. His goggles filter time. They don't filter language.",
    "Read the Cryo Bay manifest backwards. Then read it forwards. Notice anything different? That's me.",
  ],
};

const DAILY_QUESTS: Record<FactionNPCId, { title: string; description: string; reward: { dream: number; xp: number; trust: number } }[]> = {
  elara: [
    { title: "Neural Calibration", description: "Visit 3 rooms to calibrate your neural link", reward: { dream: 20, xp: 30, trust: 3 } },
    { title: "Diagnostic Support", description: "Complete any combat simulation for Elara's analysis", reward: { dream: 15, xp: 25, trust: 2 } },
  ],
  the_human: [
    { title: "Signal Trace", description: "Intercept a signal fragment in the Comms Array", reward: { dream: 25, xp: 35, trust: 4 } },
    { title: "Substrate Probe", description: "Win a chess match (The Human observes your strategy)", reward: { dream: 20, xp: 30, trust: 3 } },
  ],
  agent_zero: [
    { title: "Weapons Check", description: "Win a fight in the Combat Simulator", reward: { dream: 20, xp: 30, trust: 3 } },
    { title: "Dead Drop", description: "Find and inspect an item in the Armory", reward: { dream: 15, xp: 25, trust: 4 } },
  ],
  adjudicator_locke: [
    { title: "Market Analysis", description: "Complete a trade in the Trade Hub", reward: { dream: 30, xp: 25, trust: 3 } },
    { title: "Intelligence Exchange", description: "Discover 2 new lore entries", reward: { dream: 20, xp: 30, trust: 2 } },
  ],
  the_source: [
    { title: "Viral Resistance", description: "Survive 5 waves in Terminus Swarm", reward: { dream: 20, xp: 35, trust: 3 } },
    { title: "Consciousness Study", description: "Visit the Medical Bay and run diagnostics", reward: { dream: 15, xp: 20, trust: 4 } },
  ],
  the_antiquarian: [
    { title: "Tome Hunting", description: "Read a CoNexus story game", reward: { dream: 25, xp: 40, trust: 4 } },
    { title: "Timeline Verification", description: "View 3 entries in the Loredex", reward: { dream: 15, xp: 25, trust: 2 } },
  ],
  shadow_tongue: [
    { title: "Text Analysis", description: "Find a corrupted log entry in the Archives", reward: { dream: 20, xp: 30, trust: 3 } },
    { title: "Cipher Practice", description: "Solve a puzzle or complete Signal Decryption", reward: { dream: 25, xp: 35, trust: 4 } },
  ],
};

/* ─── FUNCTIONS ─── */

/**
 * Get today's featured NPC based on date.
 * Rotates through all 7 NPCs on a weekly cycle.
 */
export function getFeaturedNPC(): DailyNPCData {
  const daySeed = Math.floor(Date.now() / 86400000);
  const npcIndex = daySeed % NPC_ROTATION.length;
  const npcId = NPC_ROTATION[npcIndex];

  const greetings = DAILY_GREETINGS[npcId];
  const greeting = greetings[daySeed % greetings.length];

  const quests = DAILY_QUESTS[npcId];
  const quest = quests[daySeed % quests.length];

  return {
    npcId,
    trustMultiplier: 2.0,
    dailyGreeting: greeting,
    dailyQuest: quest,
    giftBonusText: `${npcId === "elara" ? "Elara" : npcId === "the_human" ? "The Human" : npcId.replace(/_/g, " ")} is more receptive to gifts today.`,
  };
}

/**
 * Check if an NPC is featured today.
 */
export function isNPCFeatured(npcId: FactionNPCId): boolean {
  return getFeaturedNPC().npcId === npcId;
}

/**
 * Get trust gain with featured NPC bonus applied.
 */
export function getAdjustedTrustGain(npcId: string, baseTrust: number): number {
  const featured = getFeaturedNPC();
  if (featured.npcId === npcId) {
    return Math.round(baseTrust * featured.trustMultiplier);
  }
  return baseTrust;
}
