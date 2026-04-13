/* ═══════════════════════════════════════════════════════
   LEVELING AS IN-WORLD EVENT  —  "AWAKENINGS"

   Leveling up is NOT a number going up. It is a diegetic
   ceremony that happens IN the world, WITNESSED by NPCs,
   with consequences that ripple outward.

   Design influences (reinterpreted, not copied):
     • Persona SL rank-up   — a mentor figure marks the growth
     • FF7R limit-break     — a combat climax signals readiness
     • Hades Mirror of Night — permanent upgrades unlock between runs
     • DE thought-internalization — wait + reflect to earn the change
     • Souls bonfire rest   — a ritual space heals and transforms

   CORE PROMISE:
     Every level is an EVENT. Every level is EARNED in-story.
     Every level UNLOCKS something. Every level is WITNESSED.

   MAX LEVEL: 50 (Epoch 1). Expands by +10 per future Epoch.
   ═══════════════════════════════════════════════════════ */

/* ─── LEVEL CAP ARCHITECTURE ─── */

export const LEVEL_CAP_BY_EPOCH: Record<number, number> = {
  1: 50,   // THE FALL
  2: 60,   // DEAD SIGNAL
  3: 70,   // THE PRICE
  4: 80,   // THE EDITOR
  5: 100,  // (reserved for "THE RECONSTRUCTION" — future)
};

export function getCurrentMaxLevel(epoch: number): number {
  return LEVEL_CAP_BY_EPOCH[epoch] ?? 50;
}

/* ─── XP CURVE (balanced, gentle-curve) ─── */
/** Cumulative XP required to reach level L (from level 1). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Quadratic with gentle coefficient: 100·L² + 50·L
  return 100 * level * level + 50 * level;
}

export function levelFromTotalXp(totalXp: number, maxLevel: number): number {
  let lvl = 1;
  while (lvl < maxLevel && totalXp >= xpForLevel(lvl + 1)) lvl++;
  return lvl;
}

/* ─── AWAKENING EVENT TYPES ─── */

export type AwakeningType =
  | "quiet"            // Levels 2-9: brief dreamscape, 1 NPC witness
  | "witnessed"        // Levels 10, 15, 20, 25, 30, 35, 40, 45: public ceremony
  | "milestone"        // Levels 5, 10, 15... divisible by 5
  | "threshold";       // Levels 10, 25, 50, 75, 100: narrative chapter break

export interface AwakeningEvent {
  level: number;
  type: AwakeningType;
  /** Name of the awakening */
  name: string;
  /** Cinematic duration (seconds) */
  duration: number;
  /** NPC(s) who witness and react */
  witnesses: string[];
  /** What unlocks at this awakening */
  unlocks: AwakeningUnlock[];
  /** In-world description */
  narration: string;
  /** Location the ceremony happens */
  location: string;
  /** Does it pause the game world? */
  pausesWorld: boolean;
  /** Does it broadcast to other players? (threshold only) */
  broadcastToCommunity: boolean;
}

export interface AwakeningUnlock {
  type: "ability" | "room" | "quest" | "dialog" | "cosmetic" | "attribute_points" | "memory_fragment" | "companion_slot";
  id: string;
  name: string;
  description: string;
}

/* ─── THE FIVE MENTOR CYCLES ─── */
/* Each witnessed awakening is hosted by a different NPC.
   The mentor responds to your growth based on their relationship. */

export const AWAKENING_MENTORS = [
  { level: 5,  npc: "elara",           role: "First Witness — decodes your neural pattern shift" },
  { level: 10, npc: "the_human",       role: "Second Witness — recognizes a Potential awakening" },
  { level: 15, npc: "the_antiquarian", role: "Third Witness — logs you in the Archive of Becomings" },
  { level: 20, npc: "agent_zero",      role: "Fourth Witness — marks you as operational" },
  { level: 25, npc: "the_source",      role: "Fifth Witness — the virus notices you now" },
  { level: 30, npc: "adjudicator_locke", role: "Sixth Witness — New Babylon issues your file" },
  { level: 35, npc: "shadow_tongue",   role: "Seventh Witness — tries to rewrite you mid-ceremony" },
  { level: 40, npc: "the_antiquarian", role: "Eighth Witness — he REMEMBERS your first awakening" },
  { level: 45, npc: "the_human",       role: "Ninth Witness — he calls you by a NEW name" },
  { level: 50, npc: "all",             role: "Tenth Witness — every NPC attends. You become canon." },
] as const;

/* ─── AWAKENING LOCATIONS ─── */
/** A ceremony happens in a PLACE. The place matters. */
export const AWAKENING_LOCATIONS = {
  medbay:        "Med-Bay Regeneration Pod — Elara presides, biometric scanners sing",
  archive:       "The Archive — ten thousand books witness your change",
  chapel:        "The Chapel of Dead Signals — Agent Zero plays a recording of a fallen operative",
  bridge:        "Command Bridge — the Ark's forward windows reveal Violetta burning purple",
  cathedral:     "Broken Cathedral — The Source's virus-song echoes through shattered glass",
  courtroom:     "Adjudicator's Courtroom — Locke reads your name into the registry",
  chamber:       "The Between — a room only Ne-Yon can see. Others see only a wall.",
  observatory:   "Starlight Observatory — every star you've ever seen is visible at once",
  cycle_room:    "The Cycle Room — the Antiquarian's private study where timelines are filed",
  the_garden:    "The Garden of Remembered Deaths — every NPC who ever died here stands",
} as const;

/* ─── AWAKENING SCHEDULE ─── */
/**
 * Generate the full 50-level awakening schedule.
 * Every level has an event. Most are brief. Ten are monumental.
 */
export function generateAwakeningSchedule(maxLevel: number = 50): AwakeningEvent[] {
  const events: AwakeningEvent[] = [];

  for (let lvl = 2; lvl <= maxLevel; lvl++) {
    const mentor = AWAKENING_MENTORS.find(m => m.level === lvl);
    const isThreshold = lvl === 10 || lvl === 25 || lvl === 50 || lvl === 75 || lvl === 100;
    const isWitnessed = !!mentor;
    const isMilestone = lvl % 5 === 0;

    const type: AwakeningType =
      isThreshold ? "threshold" :
      isWitnessed ? "witnessed" :
      isMilestone ? "milestone" : "quiet";

    events.push(buildEventForLevel(lvl, type, mentor?.npc));
  }

  return events;
}

function buildEventForLevel(level: number, type: AwakeningType, mentor?: string): AwakeningEvent {
  // Quiet awakenings: brief dreamscape
  if (type === "quiet") {
    return {
      level, type,
      name: `Neural Shift ${level}`,
      duration: 6,
      witnesses: ["elara"],
      unlocks: [
        { type: "attribute_points", id: `attr_${level}`, name: "+2 Attribute Points",
          description: "Distribute among Strength, Intelligence, Agility, Charisma" },
      ],
      narration: "A pulse. A shift. Your neural map rewrites itself in the quiet between heartbeats. Elara's console chimes once.",
      location: "medbay",
      pausesWorld: false,
      broadcastToCommunity: false,
    };
  }

  // Milestone: earn ability + resources
  if (type === "milestone") {
    return {
      level, type,
      name: `Awakening ${level}`,
      duration: 18,
      witnesses: [mentor || "elara"],
      unlocks: [
        { type: "attribute_points", id: `attr_${level}`, name: "+3 Attribute Points", description: "Distribute freely" },
        { type: "ability", id: `ability_${level}`, name: `Tier-${Math.floor(level/5)} Ability Unlock`, description: "A new class ability becomes available" },
      ],
      narration: "The ship hums. Your vitals spike. A witnessing presence arrives — they have seen this before. They know what comes next.",
      location: "medbay",
      pausesWorld: true,
      broadcastToCommunity: false,
    };
  }

  // Witnessed: public ceremony, NPC reacts
  if (type === "witnessed") {
    const loc = getLocationForMentor(mentor);
    return {
      level, type,
      name: THRESHOLD_NAMES[level] || `Witnessed Awakening ${level}`,
      duration: 45,
      witnesses: [mentor || "the_human"],
      unlocks: [
        { type: "attribute_points", id: `attr_${level}`, name: "+5 Attribute Points", description: "Major stat upgrade" },
        { type: "ability", id: `mentor_gift_${level}`, name: `${mentor}'s Gift`, description: "An ability the mentor teaches you personally" },
        { type: "dialog", id: `post_awakening_${level}`, name: "New Dialog Branch", description: "Every NPC has new lines acknowledging what you've become" },
        { type: "memory_fragment", id: `frag_${level}`, name: "Memory Fragment", description: "A piece of the Architect's lost archive surfaces in your mind" },
      ],
      narration: MENTOR_NARRATIONS[level] || "A mentor witnesses your becoming and names it.",
      location: loc,
      pausesWorld: true,
      broadcastToCommunity: false,
    };
  }

  // Threshold: narrative chapter break, broadcast to community
  return {
    level, type,
    name: THRESHOLD_NAMES[level] || `THE ${level}TH THRESHOLD`,
    duration: 90,
    witnesses: level === 50 ? ["all"] : [mentor || "the_human", "elara", "the_antiquarian"],
    unlocks: [
      { type: "attribute_points", id: `attr_${level}`, name: "+10 Attribute Points", description: "Redistribute significant power" },
      { type: "room", id: `threshold_room_${level}`, name: `Level ${level} Sanctum`, description: "A new room opens on the Ark" },
      { type: "quest", id: `threshold_quest_${level}`, name: "Threshold Quest", description: "A quest only available after this awakening" },
      { type: "companion_slot", id: `slot_${level}`, name: "Additional Companion Slot", description: "Bring one more companion into combat" },
      { type: "cosmetic", id: `aura_${level}`, name: `Tier-${level/10} Aura`, description: "Visible shimmer around your character" },
    ],
    narration: THRESHOLD_NARRATIONS[level] || "A threshold breaks. The whole Ark feels it. The whole Community feels it.",
    location: getLocationForMentor(mentor),
    pausesWorld: true,
    broadcastToCommunity: true,  // Other players see: "Player X crossed the Nth Threshold"
  };
}

function getLocationForMentor(mentor?: string): string {
  switch (mentor) {
    case "elara": return "medbay";
    case "the_human": return "bridge";
    case "the_antiquarian": return "cycle_room";
    case "agent_zero": return "chapel";
    case "the_source": return "cathedral";
    case "adjudicator_locke": return "courtroom";
    case "shadow_tongue": return "archive";
    case "all": return "the_garden";
    default: return "medbay";
  }
}

/* ─── THRESHOLD NAMES & NARRATIONS ─── */

const THRESHOLD_NAMES: Record<number, string> = {
  10: "THE FIRST THRESHOLD — Recognition",
  25: "THE SECOND THRESHOLD — Acceleration",
  50: "THE FINAL THRESHOLD — Canon",
  75: "THE FOURTH THRESHOLD — Echoing (Epoch 3)",
  100: "THE FIFTH THRESHOLD — Beyond (Epoch 5)",
};

const THRESHOLD_NARRATIONS: Record<number, string> = {
  10: "You cross the First Threshold. The Ark's systems log you as a Person of Interest. The Human nods once. The Antiquarian opens a new file. You are NOTED now.",
  25: "The Second Threshold breaks. Every faction on the Ark has a dossier on you. The Source's virus learns your signal. Locke stamps your file RED. You are RECOGNIZED.",
  50: "The Final Threshold. You walk into the Garden of Remembered Deaths and every NPC who ever loved you is standing there — including the ones who died. They came back to witness. You are CANON. You are written into the Ark's foundational memory. You cannot be erased now.",
  75: "Beyond the Fourth Threshold, the Antiquarian removes his goggles. For the first time, he calls you by the name he has never spoken aloud.",
  100: "The Fifth Threshold. The Storyteller's melody includes your name. Music that was never written plays. You are legend now. You are passed down.",
};

const MENTOR_NARRATIONS: Record<number, string> = {
  5:  "Elara places her hand on the scanner. 'Your neural patterns just shifted. I've never seen anyone's wave so... ordered. Also fractal. Also impossible. Welcome to Awakening.'",
  10: "The Human sits across from you. 'I've watched 47 Potentials cross this threshold in my 1,500 years. Each one surprised me differently. Tell me what you feel.' He waits. He actually waits.",
  15: "The Antiquarian looks up from the Archive. 'Ah. I remember YOUR becoming from three cycles ago. In this one, you're a little braver. A little less certain. I like this version better.'",
  20: "Agent Zero plays you a recording. A dead operative's last transmission. 'I want you to know what the job costs before I give you more of it. Still in?' You are in.",
  25: "The Source manifests — viral static with a woman's voice. 'You are interesting now. The virus wants you. I want you. Choose.' (This choice affects the ending.)",
  30: "Adjudicator Locke reads from a ledger. 'Citizen file updated. Your threat level is 3-star. Your asset value is 5-star. My personal opinion of you is... improving.' She almost smiles.",
  35: "Shadow Tongue tries to edit your memory of this moment. It FAILS. Your becoming is un-editable. Shadow Tongue text-glitches in rage and awe: 'You are the first I cannot touch.'",
  40: "The Antiquarian removes ONE goggle lens. His real eye is golden. 'I watched you at Awakening 15. You cried. I filed it. Now I am UN-filing it. You earned privacy.'",
  45: "The Human says a name that is not the name you chose. It is a true name. He says it softly. You do not recognize it, but something in you does.",
};

/* ─── EARN-THE-LEVEL GATE ─── */
/**
 * XP alone doesn't promote you to witnessed/threshold levels.
 * You must ALSO complete a level-specific in-world task.
 */
export interface AwakeningGate {
  level: number;
  requirement: string;
  checkFn: string;  // Reference to backend validator
}

export const AWAKENING_GATES: AwakeningGate[] = [
  { level: 10, requirement: "Save or condemn 1 NPC through a trust choice", checkFn: "hasMadeTrustChoice" },
  { level: 25, requirement: "Complete one full NPC relationship arc", checkFn: "hasCompletedRelationshipArc" },
  { level: 50, requirement: "Witness one ending (any ending — good, bad, neutral)", checkFn: "hasWitnessedEnding" },
  { level: 75, requirement: "Prestige once (see prestigeSystem.ts)", checkFn: "hasPrestiged" },
  { level: 100, requirement: "Reach all 7 prestige levels", checkFn: "hasMaxPrestige" },
];

/**
 * XP-ready but gate-not-met: player sits at "99% to level N"
 * until they complete the in-world requirement. This turns
 * leveling into a QUEST, not an automatic reward.
 */
export function canAdvanceLevel(
  totalXp: number,
  targetLevel: number,
  gatesCompleted: number[],
): { canAdvance: boolean; reason: string } {
  if (totalXp < xpForLevel(targetLevel)) {
    return { canAdvance: false, reason: "Insufficient XP" };
  }
  const gate = AWAKENING_GATES.find(g => g.level === targetLevel);
  if (gate && !gatesCompleted.includes(targetLevel)) {
    return { canAdvance: false, reason: `Must complete: ${gate.requirement}` };
  }
  return { canAdvance: true, reason: "Awakening ready" };
}

/* ─── COMMUNITY BROADCAST ─── */
/**
 * When a player crosses a threshold, the WHOLE community sees it.
 * Creates social pressure, aspiration, celebration.
 */
export interface ThresholdBroadcast {
  playerId: number;
  playerName: string;
  level: number;
  thresholdName: string;
  timestamp: string;
  witnessed: string[];
}

export function shouldBroadcast(event: AwakeningEvent): boolean {
  return event.broadcastToCommunity;
}

/* ─── DEFAULT STATE ─── */

export interface PlayerAwakeningState {
  currentLevel: number;
  totalXp: number;
  gatesCompleted: number[];
  awakeningsWitnessed: number[];
  pendingAwakening: number | null;  // If XP ready + gate ready, queue the ceremony
  attributePointsUnspent: number;
}

export const DEFAULT_AWAKENING_STATE: PlayerAwakeningState = {
  currentLevel: 1,
  totalXp: 0,
  gatesCompleted: [],
  awakeningsWitnessed: [],
  pendingAwakening: null,
  attributePointsUnspent: 0,
};
