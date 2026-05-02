/* ═══════════════════════════════════════════════════════
   THE AWAKENING PROTOCOL V2
   Complete Onboarding: Cinematics, Outbreak, Companions & Crew

   The player wakes from cryo → creates character → companion clones
   → virus escapes → room-by-room containment teaches every system
   → craft vaccine → save the Ark.

   5 Phases, 11 cinematics, 5 rooms, 2-4 crew, 2-4 hours.
   This IS the onboarding.

   Integrates with:
   - morality endpoint (Wave 1) — every choice syncs moralityScore
   - pressureService (Wave 1) — outbreak actions feed Living Universe
   - companionCombat (Wave 3) — first pet battle during Armory phase
   - petEvolution (Wave 3) — bond actions grant evolution XP
   - battlePassXp (Wave 4) — outbreak completion grants pass XP
   ═══════════════════════════════════════════════════════ */

/* ─── OUTBREAK PHASES ─── */

export type OutbreakPhase =
  | "NOT_STARTED"          // Pre-outbreak (normal awakening)
  | "COMPANION_EMERGENCE"  // Phase 1: Companion clones
  | "AUGMENTATION_CHOICE"  // Phase 1: First morality choice
  | "VIRAL_BREACH"         // Phase 2: Virus enters ventilation
  | "QUARANTINE_SEALED"    // Phase 2: Medical Bay sealed
  | "ENGINEERING"          // Phase 3: Room 1 — crafting tutorial
  | "BRIDGE"               // Phase 3: Room 2 — loredex/conspiracy tutorial
  | "COMMS_ARRAY"          // Phase 3: Room 3 — signal tutorial + Human first contact
  | "ARMORY"               // Phase 3: Room 4 — first pet battle + combat
  | "OBSERVATION_DECK"     // Phase 3: Room 5 — bond resonance + Purification Crystal
  | "VACCINE_SYNTHESIS"    // Phase 4: All components → tower defense
  | "CURE_DEPLOYED"        // Phase 4: Vaccine activated, Ark heals
  | "ARK_OPEN"             // Phase 5: Free exploration
  | "COMPLETED";           // Outbreak finished (permanent flag)

/** Order of phases for progression */
export const OUTBREAK_PHASE_ORDER: OutbreakPhase[] = [
  "NOT_STARTED", "COMPANION_EMERGENCE", "AUGMENTATION_CHOICE",
  "VIRAL_BREACH", "QUARANTINE_SEALED",
  "ENGINEERING", "BRIDGE", "COMMS_ARRAY", "ARMORY", "OBSERVATION_DECK",
  "VACCINE_SYNTHESIS", "CURE_DEPLOYED", "ARK_OPEN", "COMPLETED",
];

/* ─── CINEMATICS ─── */

export interface CinematicDef {
  id: string;
  name: string;
  duration: number; // seconds
  trigger: string; // When this plays
  phase: OutbreakPhase; // Which phase triggers it
  /** Has choice variants? */
  variants?: string[];
  /** Kling Omni video prompt (for production) */
  prompt: string;
}

export const OUTBREAK_CINEMATICS: CinematicDef[] = [
  {
    id: "AWK-001", name: "Starter Specimen Emergence", duration: 15,
    trigger: "Companion pod opens during awakening",
    phase: "COMPANION_EMERGENCE",
    prompt: "Cryo Bay. Blue emergency lighting. Companion cloning pod glows amber. Creature emerges — species-specific. Recognition. Bond. 15 seconds.",
  },
  {
    id: "AWK-002", name: "The Augmentation", duration: 10,
    trigger: "After morality choice",
    phase: "AUGMENTATION_CHOICE",
    variants: ["mutation", "cybernetic"],
    prompt: "Medical Bay. Companion receives augmentation. Choice A: golden-green organic shimmer. Choice B: cybernetic node at skull base. Trust in eyes. 10 seconds.",
  },
  {
    id: "AWK-003", name: "Viral Breach", duration: 15,
    trigger: "Virus enters ventilation system",
    phase: "VIRAL_BREACH",
    prompt: "Cryo Bay. Cloning vats pulse red-violet. Viral mist flows into ventilation. Elara materializes — concern. Companion reacts. Path to Medical Bay clear. 15 seconds.",
  },
  {
    id: "AWK-004", name: "Quarantine Seal", duration: 10,
    trigger: "Medical Bay doors close",
    phase: "QUARANTINE_SEALED",
    prompt: "Medical Bay blast doors slam shut. Blue quarantine seal. Through viewport: corridor fills with mist. Clean air inside. Elara stabilizes. Safe. Temporary. 10 seconds.",
  },
  {
    id: "AWK-005", name: "Engineering Corridor", duration: 10,
    trigger: "Player enters first contaminated corridor",
    phase: "ENGINEERING",
    prompt: "POV corridor transit. Red lighting. Viral veins in walls. Fabricator corruption sounds. Companion leads — resistance shimmer visible. 10 seconds.",
  },
  {
    id: "AWK-006", name: "First Crew Clone", duration: 10,
    trigger: "Player saves infected crew member (Choice B only)",
    phase: "ENGINEERING",
    variants: ["saved"],
    prompt: "Cloning pod in Engineering. Viral veins on glass. Override activated. Virus retreats. Eyes open. First crew member. Born in crisis. 10 seconds.",
  },
  {
    id: "AWK-007", name: "The Human's Signal", duration: 10,
    trigger: "Human first contact in Comms Array",
    phase: "COMMS_ARRAY",
    prompt: "Comms screen. Signal waveforms scrolling. One different signal — HUMAN voice in static from inside the Ark's substrate. 'Don't block that frequency. That's ME.' 10 seconds.",
  },
  {
    id: "AWK-008", name: "Viral Constructs", duration: 15,
    trigger: "First pet battle in Armory",
    phase: "ARMORY",
    prompt: "Armory occupied by viral constructs — red-black pulsing entities. Companion enters first — resistance creates clean zone. Combat stance. First battle. 15 seconds.",
  },
  {
    id: "AWK-009", name: "The Bonding", duration: 20,
    trigger: "Purification Crystal activation on Observation Deck",
    phase: "OBSERVATION_DECK",
    prompt: "Observation Deck. Stars. Beauty after horror. Companion relaxes. Player touches companion. Bond resonance pulses golden. Crystal activates. Music swells. Love solved the last problem. 20 seconds.",
  },
  {
    id: "AWK-010", name: "Vaccine Synthesis", duration: 10,
    trigger: "All 5 components collected, synthesis begins",
    phase: "VACCINE_SYNTHESIS",
    prompt: "Medical Bay. Five glowing components in Research Board. Elara synthesizes — golden helix around red-violet core. Timer: 10:00. Viral surge begins outside. 10 seconds.",
  },
  {
    id: "AWK-011", name: "The Cure Deploys", duration: 15,
    trigger: "Timer ends, vaccine activates",
    phase: "CURE_DEPLOYED",
    prompt: "Vaccine enters ventilation. Golden mist replaces red. Room by room: red → blue → white. Ark heals. Companion relaxes. Elara smiles. 15 seconds.",
  },
];

/* ─── RESEARCH BOARD COMPONENTS ─── */

export interface ResearchComponent {
  id: string;
  name: string;
  room: string; // Room where it's collected
  roomId: string; // RoomId for unlock gating
  description: string;
  /** Which game system the player learns to collect this */
  tutorialSystem: string;
}

export const RESEARCH_COMPONENTS: ResearchComponent[] = [
  { id: "viral_sample_alpha", name: "Viral Sample Alpha", room: "Engineering Bay", roomId: "engineering", description: "Extracted from corrupted fabrication substrate", tutorialSystem: "crafting" },
  { id: "neural_scan_data", name: "Neural Scan Data", room: "Bridge", roomId: "bridge", description: "Captured from the virus's data-editing patterns", tutorialSystem: "loredex" },
  { id: "frequency_isolate", name: "Frequency Isolate", room: "Comms Array", roomId: "comms_array", description: "Isolated from the virus's broadcast attempt", tutorialSystem: "signals" },
  { id: "bio_reagent_compound", name: "Bio-Reagent Compound", room: "Armory", roomId: "armory", description: "Retrieved after clearing viral constructs", tutorialSystem: "combat" },
  { id: "purification_crystal", name: "Purification Crystal", room: "Observation Deck", roomId: "observation_deck", description: "Activated through companion bond resonance", tutorialSystem: "bond" },
];

/* ─── MORALITY CHOICES ─── */

export interface OutbreakMoralityChoice {
  id: string;
  phase: OutbreakPhase;
  room: string;
  title: string;
  description: string;
  choiceA: { label: string; moralityDelta: number; flag: string; description: string };
  choiceB: { label: string; moralityDelta: number; flag: string; description: string };
  /**
   * Optional third option — typically the "delay / observe / refuse to
   * commit" stance. Smaller moralityDelta than A/B; sets its own flag so
   * the universe remembers the player chose to wait. Adding the third
   * option here makes the prelude branch a tri-state instead of a
   * binary, with downstream variants reading whichever flag is set.
   */
  choiceC?: { label: string; moralityDelta: number; flag: string; description: string };
}

export const OUTBREAK_MORALITY_CHOICES: OutbreakMoralityChoice[] = [
  {
    id: "companion_augmentation",
    phase: "AUGMENTATION_CHOICE",
    room: "medical_bay",
    title: "Companion Augmentation",
    description: "How to protect your companion from the Thought Virus strain",
    choiceA: { label: "Organic Mutation", moralityDelta: 2, flag: "companion_augmentation_mutation", description: "Expose to controlled viral doses. Natural adaptation. The Dreamer's approach." },
    choiceB: { label: "Cybernetic Filter", moralityDelta: -2, flag: "companion_augmentation_cybernetics", description: "Install neural-cybernetic resistance filter. Precise. The Architect's approach." },
    choiceC: { label: "Wait — Observe", moralityDelta: 0, flag: "companion_augmentation_observed", description: "Hold the augmentation. Watch the strain's behavior in the next room before committing. The Antiquarian's approach." },
  },
  {
    id: "infected_clone",
    phase: "ENGINEERING",
    room: "engineering",
    title: "The Infected Clone",
    description: "A crew member's cloning cycle is 40% complete and infected",
    choiceA: { label: "Purge", moralityDelta: 2, flag: "crew_engineer_purged", description: "The clone was never conscious. Purging is merciful and safe." },
    choiceB: { label: "Save", moralityDelta: -2, flag: "crew_engineer_saved", description: "Continue cloning. The crew member might survive. Might be compromised." },
    choiceC: { label: "Quarantine — Hold", moralityDelta: 0, flag: "crew_engineer_quarantined", description: "Pause the cycle in stasis. No purge, no completion. Decide later, with more information." },
  },
  {
    id: "distress_signal",
    phase: "COMMS_ARRAY",
    room: "comms_array",
    title: "The Distress Signal",
    description: "The virus's broadcast contains a real distress signal from other Arks",
    choiceA: { label: "Respond", moralityDelta: 3, flag: "crew_comms_rescued", description: "Answer the call. Open a channel the virus could exploit. Someone needs help." },
    choiceB: { label: "Silence", moralityDelta: -1, flag: "radio_silence", description: "Maintain radio silence. Protect the Ark. Leave others without help." },
    choiceC: { label: "Trace — Passive", moralityDelta: 1, flag: "signal_traced", description: "Don't open a channel. Log the source coordinates for later. Listen, do not answer." },
  },
];

/* ─── CREW CLONING EVENTS ─── */

export interface CrewCloningEvent {
  id: string;
  phase: OutbreakPhase;
  room: string;
  roomId: string;
  crewType: string;
  /** Condition for this crew member to clone */
  condition: "automatic" | "choice_a" | "choice_b";
  /** Which morality choice ID gates this (if conditional) */
  conditionChoiceId?: string;
  /** Trait the crew member gets */
  trait?: { id: string; name: string; description: string };
}

export const CREW_CLONING_EVENTS: CrewCloningEvent[] = [
  {
    id: "crew_engineer", phase: "ENGINEERING", room: "Engineering Bay", roomId: "engineering",
    crewType: "Combat Engineer", condition: "choice_b", conditionChoiceId: "infected_clone",
    trait: { id: "outbreak_survivor", name: "Outbreak Survivor", description: "+5% virus resistance, -5% crew trust" },
  },
  {
    id: "crew_tactical", phase: "BRIDGE", room: "Bridge", roomId: "bridge",
    crewType: "Tactical Officer", condition: "automatic",
  },
  {
    id: "crew_comms", phase: "COMMS_ARRAY", room: "Comms Array", roomId: "comms_array",
    crewType: "Communications Officer", condition: "choice_a", conditionChoiceId: "distress_signal",
    trait: { id: "signal_rescued", name: "Signal Rescued", description: "+5% comms range" },
  },
  {
    id: "crew_combat", phase: "ARMORY", room: "Armory", roomId: "armory",
    crewType: "Combat Specialist", condition: "automatic",
  },
];

/* ─── ROOM UNLOCK ORDER DURING OUTBREAK ─── */

/** During outbreak, rooms unlock in this specific order */
export const OUTBREAK_ROOM_ORDER: string[] = [
  "cryo_bay",        // Starting room (always unlocked)
  "medical_bay",     // Phase 2: Quarantine base
  "engineering",     // Phase 3, Room 1
  "bridge",          // Phase 3, Room 2
  "comms_array",     // Phase 3, Room 3
  "armory",          // Phase 3, Room 4
  "observation_deck",// Phase 3, Room 5
];

/** Rooms that open after outbreak completion (free exploration) */
export const POST_OUTBREAK_ROOMS: string[] = [
  "archives",
  "cargo_bay",
  "trade_hub",
  "trophy_room",
  "captains_quarters",
];

/* ─── NARRATIVE FLAGS ─── */

export const OUTBREAK_FLAGS = {
  outbreak_completed: "outbreak_completed",
  companion_augmentation_mutation: "companion_augmentation_mutation",
  companion_augmentation_cybernetics: "companion_augmentation_cybernetics",
  companion_augmentation_observed: "companion_augmentation_observed",
  crew_engineer_saved: "crew_engineer_saved",
  crew_engineer_purged: "crew_engineer_purged",
  crew_engineer_quarantined: "crew_engineer_quarantined",
  crew_comms_rescued: "crew_comms_rescued",
  radio_silence: "radio_silence",
  signal_traced: "signal_traced",
  tutorial_mode_full: "tutorial_mode_full",
  tutorial_mode_minimal: "tutorial_mode_minimal",
  first_pet_battle_completed: "first_pet_battle_completed",
  human_first_contact: "human_first_contact",
  first_bond_resonance: "first_bond_resonance",
} as const;

/* ─── OUTBREAK STATE ─── */

export interface OutbreakState {
  phase: OutbreakPhase;
  componentsCollected: string[];
  crewCloned: string[];
  moralityChoicesMade: Record<string, "a" | "b" | "c">;
  cinematicsPlayed: string[];
  tutorialMode: "full" | "minimal";
  startedAt: string | null;
  completedAt: string | null;
  /** Duration in minutes */
  durationMinutes: number;
}

export const DEFAULT_OUTBREAK_STATE: OutbreakState = {
  phase: "NOT_STARTED",
  componentsCollected: [],
  crewCloned: [],
  moralityChoicesMade: {},
  cinematicsPlayed: [],
  tutorialMode: "full",
  startedAt: null,
  completedAt: null,
  durationMinutes: 0,
};

/* ─── HELPER FUNCTIONS ─── */

export function canAdvancePhase(state: OutbreakState, to: OutbreakPhase): boolean {
  const currentIdx = OUTBREAK_PHASE_ORDER.indexOf(state.phase);
  const targetIdx = OUTBREAK_PHASE_ORDER.indexOf(to);
  return targetIdx === currentIdx + 1;
}

export function getNextRoom(state: OutbreakState): string | null {
  const componentRooms = RESEARCH_COMPONENTS.map(c => c.roomId);
  for (const roomId of componentRooms) {
    const component = RESEARCH_COMPONENTS.find(c => c.roomId === roomId);
    if (component && !state.componentsCollected.includes(component.id)) {
      return roomId;
    }
  }
  return null;
}

export function isOutbreakComplete(state: OutbreakState): boolean {
  return state.phase === "COMPLETED" || state.componentsCollected.length >= RESEARCH_COMPONENTS.length;
}

export function getOutbreakMoralityTotal(state: OutbreakState): number {
  let total = 0;
  for (const [choiceId, choice] of Object.entries(state.moralityChoicesMade)) {
    const def = OUTBREAK_MORALITY_CHOICES.find(c => c.id === choiceId);
    if (!def) continue;
    if (choice === "a") total += def.choiceA.moralityDelta;
    else if (choice === "b") total += def.choiceB.moralityDelta;
    else if (choice === "c" && def.choiceC) total += def.choiceC.moralityDelta;
  }
  return total;
}

/** Elara's post-cure speech (personalized based on choices) */
export function getCureSpeech(state: OutbreakState, companionSpecies: string, playerName: string, realMinutes: number): string {
  const crewCount = state.crewCloned.length;
  return `It's done. The vaccine is deploying. Viral concentration dropping across all decks. Corridors clearing. Systems restoring.\n\nYou did this, ${playerName}. In ${realMinutes} minutes you navigated an infected ship, learned systems you'd never seen, made choices that mattered, cloned ${crewCount} crew member${crewCount !== 1 ? "s" : ""} from nothing, and saved the Ark with a creature that was born from the same material that nearly destroyed us.\n\nThe virus is neutralized. Fragments remain in the deep code — dormant, contained. The Thought Virus is never truly destroyed. It adapts. It waits.\n\nBut today it LOST. Because of you. And a ${companionSpecies} that didn't know what it was doing when it opened its eyes — only that it trusted you.\n\nThe Ark is yours now, ${playerName}. Every room. Every system. Every crew member. Every secret.`;
}
