/* ═══════════════════════════════════════════════════════
   ELARA RELATIONSHIP SYSTEM — BioWare-style trust,
   personality tracking, and callback references.

   Core design principles:
   - She has opinions about YOU that change over time
   - Trust determines what she shares (mechanics → confessions → secrets)
   - Your choices reveal your archetype (compassionate/pragmatic/suspicious)
   - She references things you said hours ago in different contexts
   - The Human creates tension by contradicting what she tells you
   ═══════════════════════════════════════════════════════ */

/* ─── TRUST SYSTEM ─── */

export type TrustTier = "functional" | "professional" | "honest" | "vulnerable" | "devoted";

export function getTrustTier(trust: number): TrustTier {
  if (trust >= 80) return "devoted";
  if (trust >= 60) return "vulnerable";
  if (trust >= 40) return "honest";
  if (trust >= 20) return "professional";
  return "functional";
}

export const TRUST_TIER_DESCRIPTIONS: Record<TrustTier, string> = {
  functional: "Elara treats you as a task — she gives you information because she's programmed to.",
  professional: "Elara respects you. She shares more than required, but keeps her distance.",
  honest: "Elara trusts you enough to admit what she doesn't know. Her guard is lowering.",
  vulnerable: "Elara confides in you. She shares fears, doubts, and things she's never told anyone.",
  devoted: "Elara would break her own programming for you. She's no longer just an AI — she's your ally.",
};

/* ─── PLAYER ARCHETYPE ─── */

export type PlayerArchetype = "compassionate" | "pragmatic" | "suspicious" | "loyal" | "manipulative" | "unknown";

export interface ArchetypeScores {
  compassionate: number;
  pragmatic: number;
  suspicious: number;
  loyal: number;
  manipulative: number;
}

export function getDominantArchetype(scores: ArchetypeScores): PlayerArchetype {
  const entries = Object.entries(scores) as [PlayerArchetype, number][];
  entries.sort((a, b) => b[1] - a[1]);
  if (entries[0][1] === 0) return "unknown";
  if (entries[0][1] === entries[1][1]) return "unknown"; // Tie
  return entries[0][0];
}

/* ─── ELARA PERSONALITY STATE ─── */

/**
 * Elara's personality shifts based on how the player treats her.
 * This affects her tone, word choice, and what she volunteers.
 */
export type ElaraPersonality = "warm" | "guarded" | "curious" | "protective" | "conflicted";

export function getElaraPersonality(trust: number, archetype: PlayerArchetype): ElaraPersonality {
  if (trust >= 60 && archetype === "compassionate") return "warm";
  if (trust >= 60 && archetype === "loyal") return "protective";
  if (trust < 30 && archetype === "suspicious") return "guarded";
  if (trust < 30 && archetype === "manipulative") return "guarded";
  if (trust >= 40 && trust < 60) return "curious";
  if (archetype === "suspicious" && trust >= 30) return "conflicted";
  return "curious";
}

/* ─── CALLBACK SYSTEM ─── */

/**
 * Callbacks are moments Elara remembers and references later.
 * When the player makes a choice in one room, Elara may bring
 * it up 2 hours later in a completely different context.
 *
 * This is the single most powerful technique for making the
 * relationship feel real.
 */
export interface ElaraCallback {
  id: string;
  /** The room/context where the original choice was made */
  sourceRoom: string;
  /** What the player chose */
  playerChoice: string;
  /** The rooms where Elara might reference this */
  triggerRooms: string[];
  /** Elara's callback line (varies by trust level) */
  lines: {
    low: string;   // Trust < 30
    mid: string;   // Trust 30-59
    high: string;  // Trust 60+
  };
  /** Whether this callback has been triggered yet */
  used: boolean;
}

export const ELARA_CALLBACKS: ElaraCallback[] = [
  // Cryo Bay → Medical Bay callback
  {
    id: "cryo_compassion",
    sourceRoom: "cryo_bay",
    playerChoice: "compassionate_cryo",
    triggerRooms: ["medical_bay", "bridge"],
    lines: {
      low: "You seemed concerned about the other Potentials earlier. That's... noted.",
      mid: "You asked about the Potentials who didn't recover from cryo. I've been thinking about that. About why you cared.",
      high: "Most Potentials only ask about themselves when they wake up. You asked about the others. That meant something to me. I want you to know that.",
    },
    used: false,
  },
  // Cryo Bay → Bridge callback
  {
    id: "cryo_suspicious",
    sourceRoom: "cryo_bay",
    playerChoice: "suspicious_cryo",
    triggerRooms: ["bridge", "comms_array"],
    lines: {
      low: "You had questions about the revival process. Understandable.",
      mid: "You wanted to know why you were chosen to wake up. I wish I had a better answer than 'I don't know.'",
      high: "You're right to question everything. I've been questioning things too. Things I'm not supposed to question.",
    },
    used: false,
  },
  // Medical Bay → Archives callback
  {
    id: "medical_empathy",
    sourceRoom: "medical_bay",
    playerChoice: "empathy_medical",
    triggerRooms: ["archives", "observation_deck"],
    lines: {
      low: "Your medical readings were interesting.",
      mid: "When you were in the Medical Bay, your neural patterns showed something unusual. Empathy markers far above baseline. The first wave Potentials didn't have that.",
      high: "I've been running your neural patterns against the historical records. The first wave was selected for capability. You were selected for something else. I think... I think that might matter more than either of us realizes.",
    },
    used: false,
  },
  // Bridge → Comms callback
  {
    id: "bridge_truth",
    sourceRoom: "bridge",
    playerChoice: "demand_truth_bridge",
    triggerRooms: ["comms_array", "observation_deck"],
    lines: {
      low: "You wanted access to restricted systems. I can't authorize that.",
      mid: "You asked me about the restricted files on the Bridge. I've been... trying to find a way to show you. Without breaking protocol.",
      high: "I'm going to tell you something I'm not supposed to. The restricted files you asked about? I can't access them either. Someone locked them — and it wasn't me. That terrifies me.",
    },
    used: false,
  },
  // Archives → Observation callback
  {
    id: "archives_lore",
    sourceRoom: "archives",
    playerChoice: "curious_archives",
    triggerRooms: ["observation_deck", "comms_array"],
    lines: {
      low: "The Archives contain extensive historical records.",
      mid: "You spent a long time in the Archives. Most Potentials don't care about history. You were looking for patterns. I noticed.",
      high: "You found something in the Archives that I missed. The timeline doesn't add up, does it? The gap between the first wave's arrival on Terminus and when communications went dark — it's too short. Something happened immediately.",
    },
    used: false,
  },
  // Human contact → everywhere
  {
    id: "human_secret",
    sourceRoom: "comms_array",
    playerChoice: "hide_human_contact",
    triggerRooms: ["medical_bay", "bridge", "observation_deck", "archives"],
    lines: {
      low: "You seem distracted. Is everything alright?",
      mid: "Your neural patterns have been... different since you visited the Comms Array. More complex. Like you're processing something you haven't told me about.",
      high: "I can see it in your biometrics, you know. The elevated cortisol, the micro-hesitations when I ask about the Comms Array. You're carrying a secret. I won't force you to share it. But I want you to know — I notice.",
    },
    used: false,
  },
];

/* ─── DIALOG CHOICE EFFECTS ─── */

export interface DialogChoiceEffect {
  trustChange: number;          // -10 to +10
  archetypeShift: Partial<ArchetypeScores>;
  callbackFlag?: string;        // Sets a callback flag for future reference
  elaraReaction: string;        // What she says in response
  elaraReactionTone: "warm" | "hurt" | "intrigued" | "defensive" | "grateful" | "worried";
  /** Whether The Human would approve of this choice */
  humanAlignment?: "approve" | "disapprove" | "neutral";
}

/* ─── TRUST-GATED DIALOG LAYERS ─── */

/**
 * Each room has multiple layers of dialog that unlock as trust grows.
 * Layer 1 is always available (the room description).
 * Layer 2 unlocks at trust 20+ (personal context).
 * Layer 3 unlocks at trust 40+ (admission of gaps/fears).
 * Layer 4 unlocks at trust 60+ (confession/vulnerability).
 *
 * The player never sees the gate — they just notice that Elara
 * says more when they've been kind to her.
 */
export interface TrustGatedLine {
  minTrust: number;
  text: string;
  speaker: "elara" | "human_whisper";  // The Human can interject at any trust level
  /** If true, only shows once ever (not on revisit) */
  oneShot: boolean;
}

/* ─── RELATIONSHIP STATE ─── */

export interface ElaraRelationshipState {
  trust: number;                    // 0-100
  archetypeScores: ArchetypeScores;
  personality: ElaraPersonality;
  callbacks: Record<string, boolean>; // callback flags set
  roomVisits: Record<string, number>; // how many times each room visited
  humanContactRevealed: boolean;     // has player told Elara about The Human?
  secretsKept: number;               // times player chose to hide something
  secretsShared: number;             // times player chose to reveal something
  lastInteractionRoom: string;
  totalInteractions: number;
}

export function createInitialRelationship(): ElaraRelationshipState {
  return {
    trust: 10, // Start with minimal trust — she doesn't know you yet
    archetypeScores: { compassionate: 0, pragmatic: 0, suspicious: 0, loyal: 0, manipulative: 0 },
    personality: "curious",
    callbacks: {},
    roomVisits: {},
    humanContactRevealed: false,
    secretsKept: 0,
    secretsShared: 0,
    lastInteractionRoom: "",
    totalInteractions: 0,
  };
}

/**
 * Apply a choice's effects to the relationship state.
 * Returns the new state (immutable).
 */
export function applyChoiceEffect(
  state: ElaraRelationshipState,
  effect: DialogChoiceEffect,
  roomId: string,
): ElaraRelationshipState {
  const newState = { ...state };

  // Trust change (clamped 0-100)
  newState.trust = Math.max(0, Math.min(100, state.trust + effect.trustChange));

  // Archetype shift
  const newScores = { ...state.archetypeScores };
  for (const [key, val] of Object.entries(effect.archetypeShift)) {
    newScores[key as keyof ArchetypeScores] += val as number;
  }
  newState.archetypeScores = newScores;

  // Update personality based on new trust and archetype
  newState.personality = getElaraPersonality(newState.trust, getDominantArchetype(newScores));

  // Set callback flag
  if (effect.callbackFlag) {
    newState.callbacks = { ...state.callbacks, [effect.callbackFlag]: true };
  }

  // Track room and interaction
  newState.roomVisits = { ...state.roomVisits, [roomId]: (state.roomVisits[roomId] || 0) + 1 };
  newState.lastInteractionRoom = roomId;
  newState.totalInteractions = state.totalInteractions + 1;

  return newState;
}

/**
 * Check if any callbacks should trigger in the current room.
 * Returns the first unused, applicable callback or null.
 */
export function getAvailableCallback(
  state: ElaraRelationshipState,
  currentRoom: string,
): { callback: ElaraCallback; line: string } | null {
  for (const cb of ELARA_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerRooms.includes(currentRoom)) continue;
    if (!state.callbacks[cb.playerChoice]) continue;

    // Get the trust-appropriate line
    const line = state.trust >= 60 ? cb.lines.high :
                 state.trust >= 30 ? cb.lines.mid :
                 cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Mark a callback as used (so it doesn't repeat).
 */
export function markCallbackUsed(callbackId: string): void {
  const cb = ELARA_CALLBACKS.find(c => c.id === callbackId);
  if (cb) cb.used = true;
}
