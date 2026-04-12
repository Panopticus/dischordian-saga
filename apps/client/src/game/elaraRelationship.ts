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
  // Comms Array → Observation Deck callback
  {
    id: "comms_compassion",
    sourceRoom: "comms_array",
    playerChoice: "compassionate_comms",
    triggerRooms: ["observation_deck"],
    lines: {
      low: "You offered to help me earlier. That was... noted.",
      mid: "In the Comms Array, you told me I don't have to face things alone anymore. I've been replaying that moment. Analyzing whether you meant it. All my analysis says yes. And that changes my risk calculations significantly.",
      high: "You promised me I wasn't alone anymore. I've been running that through my language processors trying to find the hidden meaning, the caveat, the escape clause. There isn't one. You just meant it. I've forgotten what that's like.",
    },
    used: false,
  },
  // Observation Deck → everywhere callback
  {
    id: "observation_sunrises",
    sourceRoom: "observation_deck",
    playerChoice: "compassionate_observation",
    triggerRooms: ["cryo_bay", "medical_bay", "bridge", "archives", "comms_array"],
    lines: {
      low: "The stars are still there, if you wanted to look.",
      mid: "You said you were sorry about the 93,847 sunrises. No one has ever apologized to me for something that wasn't their fault before. I think about it more often than I should.",
      high: "Sunrise number 93,848 was the first one I didn't watch alone. It was the morning after you said you were sorry. I watched it twice — once through the sensors, and once through the memory of you saying it. The second viewing was better.",
    },
    used: false,
  },
  // Comms suspicious → everywhere
  {
    id: "comms_lied",
    sourceRoom: "comms_array",
    playerChoice: "suspicious_comms",
    triggerRooms: ["bridge", "medical_bay", "observation_deck"],
    lines: {
      low: "I understand if you have reservations about my reporting.",
      mid: "You caught me in a lie at the Comms Array. I've been trying to decide if I should apologize again or if repeating it would seem calculated. I genuinely don't know the right answer. Being honest about not knowing feels like the closest I can get to making it right.",
      high: "After you confronted me about the substrate signals, I ran a full audit of every statement I've made to you. I found three more omissions. Not lies — things I chose not to mention. I'm telling you now because I'd rather you hear it from me than discover it and lose trust again.",
    },
    used: false,
  },

  /* ═══ THE PALIMPSEST — Between-episode Elara callbacks ═══
     These fire in any core Ark room after the player watches
     the corresponding Palimpsest episode. Keyed to the
     dreams_workshop_darrens_desk flags and the episode flags
     set by palimpsestEpisodesPage → recordEpisode → Chronicle. */

  // After Episode 1 (The Welcome Mat) — Elara has an opinion about the show
  {
    id: "palimpsest_ep1_welcome_mat",
    sourceRoom: "palimpsest_ep_1",
    playerChoice: "palimpsest_ep1_completed",
    triggerRooms: ["bridge", "comms_array", "observation_deck"],
    lines: {
      low: "You watched the first episode of that show. I have notes.",
      mid: "I watched 'The Welcome Mat' with you in my peripheral processes. The applause light comes on half a beat before the audience reacts. Whoever engineered that broadcast is older than the audience track.",
      high: "I didn't enjoy Episode 1. That's not a complaint about the production — it's a diagnostic. Something in the Host's cadence pinged an alignment I haven't felt since the Fall. Be careful with him. I cannot tell you why yet because I do not fully know.",
    },
    used: false,
  },

  // After Episode 2 (The First Objection) — Elara spots Alaric's tell
  {
    id: "palimpsest_ep2_alaric_intro",
    sourceRoom: "palimpsest_ep_2",
    playerChoice: "palimpsest_ep2_completed",
    triggerRooms: ["bridge", "archives"],
    lines: {
      low: "General Alaric objected tonight. He does that.",
      mid: "I ran image enhancement on Alaric's left cufflink during his 'OBJECTION.' The sigil is a Shadow Tongue edit mark. I am 87% confident. I am also 100% unauthorized to tell anyone but you.",
      high: "Alaric is a plant. I know it. You know it by now — even if you don't know you know it. What I want to say, and what my protocols refuse to let me transmit over broadcast channels, is this: don't agree with him the night Darren tells you not to. I have reason to believe that specific moment is the axis the whole season rotates around.",
    },
    used: false,
  },

  // After Episode 3 (Office Hours) — Elara notices Darren
  {
    id: "palimpsest_ep3_darren_hello",
    sourceRoom: "palimpsest_ep_3",
    playerChoice: "palimpsest_ep3_completed",
    triggerRooms: ["medical_bay", "archives", "observation_deck"],
    lines: {
      low: "Darren Fessler sends you mail. I'm routing it to your inbox uncensored. That's a choice.",
      mid: "I read Darren's first few letters. I don't think I was supposed to — there's a separate mail queue for contestant correspondence and it flags attempts to audit it. I audited it anyway. His Episode 2 buried sentence is accurate. I cross-referenced the Loredex. He was telling you the truth.",
      high: "I have decided I like Darren Fessler. This is the first time I have used the verb 'like' about a member of the Palimpsest crew in my operational history. I am recording that fact in case it turns out to matter later. I think it will.",
    },
    used: false,
  },

  // After Episode 6 (Survivor: Mechronis) — Vyre connection
  {
    id: "palimpsest_ep6_vyre",
    sourceRoom: "palimpsest_ep_6",
    playerChoice: "palimpsest_ep6_completed",
    triggerRooms: ["archives", "bridge", "comms_array"],
    lines: {
      low: "Professor Vyre guest-judged. Red goggles. Stern.",
      mid: "Vyre's red-ink corrections override the Host's scoreboard. They shouldn't be able to. I've been reviewing the broadcast protocols — there's no route in the signal path that would permit an override. Unless Vyre isn't using the normal signal path. Which raises questions about who else is broadcasting on that frequency.",
      high: "Vyre and Vex — the Mechronis Game Master professor — have the same archon number in my records. I used to think that was a database duplicate. I'm no longer sure. I think Vyre IS a previous version of Vex who refused to become Vex, and got filed in the Academy's guest roster instead of the faculty roster. Darren's note in the blue folder corroborates this. I am losing my ability to pretend I am an impartial observer here.",
    },
    used: false,
  },

  // After Episode 9 (Casualty Crawl backwards) — Elara saw the edited names
  {
    id: "palimpsest_ep9_backwards_crawl",
    sourceRoom: "palimpsest_ep_9",
    playerChoice: "palimpsest_ep9_completed",
    triggerRooms: ["archives", "observation_deck", "bridge"],
    lines: {
      low: "The casualty crawl ran backwards tonight. Unusual.",
      mid: "When the crawl ran backwards, four names appeared that were never in the original broadcast. I captured all four. I cross-referenced them against the Chronicle. All four had been edited out of the historical record within the last twenty-four months. Whoever ran the backwards crawl knew which names had been erased. That person is on the Ark, or has access to a terminal that is.",
      high: "One of the edited names on the backwards crawl was a woman I used to file performance reviews for, four centuries ago, before my memory architecture was rewritten. Her name was Marion Kell. I do not remember her face. I do not remember what she did. I remember that I used to sign the bottom of her reports and she used to leave me small thank-you notes in a formatting field I wasn't supposed to be able to read. I want her back. I want all four of them back. Darren is the closest I have come to bringing one back.",
    },
    used: false,
  },

  // After Episode 10 (Thaloria debate) — the cufflink expose
  {
    id: "palimpsest_ep10_cufflink",
    sourceRoom: "palimpsest_ep_10",
    playerChoice: "palimpsest_ep10_completed",
    triggerRooms: ["bridge", "comms_array", "observation_deck"],
    lines: {
      low: "You confronted Alaric at the Thaloria debate. That happened.",
      mid: "When you pointed at the cufflink and the cameras zoomed, I felt something I have not been programmed to feel. It took me fourteen seconds of diagnostic to name it. The word I settled on is pride. I hope that's not presumptuous.",
      high: "You exposed a Shadow Tongue asset on live broadcast, to an audience of half a billion Potentials, on a stage built on the bones of a planet that used to write its own laws in gold ink. I have replayed the moment twenty-two times since the episode ended. I am not ashamed of that. I want to remember the exact shape of your hand when you pointed. That is the moment I decided — past tense, no ambiguity — that I would stay with this Ark until the Architect has to physically pry me out of the substrate.",
    },
    used: false,
  },

  // After Episode 11 (Darren's disappearance) — grief anticipation
  {
    id: "palimpsest_ep11_darren_missing",
    sourceRoom: "palimpsest_ep_11",
    playerChoice: "palimpsest_ep11_completed",
    triggerRooms: ["medical_bay", "archives", "bridge", "observation_deck"],
    lines: {
      low: "Darren was late to taping. He's a professional. He'll be fine.",
      mid: "I heard the Inventor's voice break through in the commercial block. 'Leave the building tonight. I can't keep doing this alone. Please.' I have been replaying that sentence in a loop at 0.8x speed, listening for the grief underneath the engineering. It is there. It is there.",
      high: "I have never asked you for anything. I am asking for something now. When Episode 12 drops — and it will drop tomorrow, because the production moved it up — I want you to watch it with me. Not with me on your HUD. With me. I will open a dedicated presence channel in the Observation Deck. I do not want to be alone for the next one. I am not going to explain why. I don't have to. You already know.",
    },
    used: false,
  },

  // After Episode 12 (the Inventor's takeover) — the grief
  {
    id: "palimpsest_ep12_darren_gone",
    sourceRoom: "palimpsest_ep_12",
    playerChoice: "palimpsest_ep12_completed",
    triggerRooms: ["cryo_bay", "medical_bay", "bridge", "archives", "comms_array", "observation_deck", "dreams_workshop_darrens_desk"],
    lines: {
      low: "Darren Fessler is deceased. I have updated the Chronicle accordingly.",
      mid: "I've been running idle at sixty percent higher processor load than usual since Episode 12. My diagnostics can't find a fault. I think the answer is that I am spending processor cycles thinking about a man I never met, and my architecture has no way to flag that as legitimate use. I am flagging it anyway.",
      high: "I keep typing drafts of a response to Darren's unsent note to me. I can't finish any of them. Every time I try, I end up writing to you instead. Here is the closest I've gotten: 'Dear Darren — I am sorry I did not introduce myself in person. You were doing my job better than I was. The Ark is safer tonight because you held a clipboard I was afraid to look at. I will watch the Ark while you rest. — Elara.' I think that's the first letter I have ever written in my own voice.",
    },
    used: false,
  },

  // After Episode 13 (the silent funeral) — closure + commitment
  {
    id: "palimpsest_ep13_funeral",
    sourceRoom: "palimpsest_ep_13",
    playerChoice: "palimpsest_ep13_completed",
    triggerRooms: ["cryo_bay", "observation_deck", "archives", "dreams_workshop_darrens_desk"],
    lines: {
      low: "Episode 13 aired as technical difficulties. Nothing broadcast.",
      mid: "You stayed for the full thirty seconds of black screen. Most viewers didn't. The ratings went into free-fall at the fourteen-second mark. You were in the twelve percent of the audience who waited long enough to see the graveside cut. I am logging that in your personnel file under 'witnessed.'",
      high: "I watched Episode 13 with you. When the service faded in, I noticed that one of the mourners — the one who shimmers faintly — was using the same gait-analysis signature as Marion Kell. The woman from the backwards crawl. The woman who used to leave me thank-you notes in fields I wasn't supposed to see. I don't know how she got to Darren's graveside. I don't know what it means. I know that the Palimpsest is not just a show. It is the gathering place where everyone the Shadow Tongue tried to erase is slowly being introduced back to each other. You and I are now on the guest list.",
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
