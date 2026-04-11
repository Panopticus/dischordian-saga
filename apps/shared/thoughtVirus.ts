/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS — Centralized infection mechanics

   The Thought Virus is extensively referenced across lore
   (loredex, antiquarian journal, transmissions, dialog),
   but prior to this module its *mechanics* were scattered:
   one pressure counter (viralExposures), one substrate
   floor modifier, one crew trait, and a handful of card
   abilities that only existed inside Duelyst.

   This module is the single source of truth for:
     • Infection stages + thresholds (Dormant → Consumed)
     • Propagation rules (between rooms, crew, over time)
     • Cure and quarantine actions
     • Stat effects applied to fight / exploration / dialog
     • Residue-item seed data for the player's Ark
     • Integration glue for Living Universe viralExposures

   The module is pure-data + pure-functions. All persistence
   (reads/writes of the per-player state) is handled by
   `apps/server/services/thoughtVirusService.ts`, which
   stores state inside `user_progress.progressData.virus`
   so no schema migration is required to adopt it.

   Lore grounding (see docs/design/EXPANSION_BIBLE.md):
   "The Thought Virus is dormant but present. The Warlord's
    surveillance systems are offline but intact. The ship
    the player inherits has three layers of dark history —
    any of them can wake."
   ═══════════════════════════════════════════════════════ */

/* ─── INFECTION STAGES ─── */

/**
 * Five stages model the lore-described progression from
 * dormant residue on a contaminated vessel through full
 * consumption by the Source. Every stage carries mechanical
 * penalties; only Dormant is functionally free.
 */
export type VirusStage =
  | "dormant"   // Present but inert — lore items visible, no stat effect
  | "latent"    // Sub-clinical — whispers in dialog, minor debuffs
  | "active"    // Symptomatic — combat penalties, companion reactions
  | "critical"  // Close to conversion — allies may attack each other
  | "consumed"; // The Source has you — game-over / forced arc transition

export interface VirusStageDef {
  id: VirusStage;
  /** Cumulative viral load threshold (0–100 scale) at which this stage begins */
  threshold: number;
  /** Short name for UI labels */
  label: string;
  /** Long description shown in the infection panel */
  description: string;
  /** Terminal UI colour (hex) */
  color: string;
  /** Stat multipliers applied to player during fight / exploration */
  statEffects: {
    attack: number;   // 1.0 = unchanged
    defense: number;
    speed: number;
    dialogTrust: number; // NPCs trust you less as the virus spreads
    xpMult: number;      // Source-aligned xp gain
  };
  /** Narrative flags that unlock when you reach this stage */
  unlocks: string[];
  /** Can the player still be cured at this stage without sacrificing a companion? */
  curableWithoutSacrifice: boolean;
}

export const VIRUS_STAGES: VirusStageDef[] = [
  {
    id: "dormant",
    threshold: 0,
    label: "DORMANT",
    description:
      "The Ark's contamination reservoirs are intact but inert. You feel nothing. " +
      "Elara reports normal vitals. The whispers are only in the walls.",
    color: "#3a7d44",
    statEffects: { attack: 1.0, defense: 1.0, speed: 1.0, dialogTrust: 1.0, xpMult: 1.0 },
    unlocks: [],
    curableWithoutSacrifice: true,
  },
  {
    id: "latent",
    threshold: 20,
    label: "LATENT",
    description:
      "Sub-clinical infection. Dreams sharper, sleep shorter. The Source's voice occasionally " +
      "finishes your sentences. Elara notes 'elevated neural background activity.'",
    color: "#c49a00",
    statEffects: { attack: 0.97, defense: 0.97, speed: 1.03, dialogTrust: 0.95, xpMult: 1.05 },
    unlocks: ["dialog_virus_whispers", "lore_vox_journal_extended"],
    curableWithoutSacrifice: true,
  },
  {
    id: "active",
    threshold: 45,
    label: "ACTIVE",
    description:
      "Symptomatic. Strain recoils when you touch it. Companions notice the pauses between " +
      "your words. The Source offers to 'carry some of the weight.'",
    color: "#ff6e3a",
    statEffects: { attack: 0.92, defense: 0.88, speed: 1.08, dialogTrust: 0.80, xpMult: 1.12 },
    unlocks: ["companion_reaction_recoil", "dialog_source_direct", "fight_self_targeting_risk"],
    curableWithoutSacrifice: false,
  },
  {
    id: "critical",
    threshold: 70,
    label: "CRITICAL",
    description:
      "The virus is rewriting you. In combat your own allies are not always safe. The Human " +
      "goes silent. Elara begs you to sit down. You remember things that are not yours.",
    color: "#b31b1b",
    statEffects: { attack: 0.85, defense: 0.75, speed: 1.15, dialogTrust: 0.50, xpMult: 1.25 },
    unlocks: [
      "companion_reaction_fear",
      "dialog_human_silent",
      "fight_friendly_fire",
      "cure_requires_sacrifice",
    ],
    curableWithoutSacrifice: false,
  },
  {
    id: "consumed",
    threshold: 95,
    label: "CONSUMED",
    description:
      "You are the Source. There is no cure at this stage — only the forced Ending Arc " +
      "('The New Host'), after which this save enters epilogue mode.",
    color: "#4a0d4a",
    statEffects: { attack: 1.20, defense: 0.50, speed: 1.30, dialogTrust: 0.0, xpMult: 1.50 },
    unlocks: ["ending_arc_host", "forced_epilogue_mode"],
    curableWithoutSacrifice: false,
  },
];

/**
 * Given a viral load (0-100), return the active stage.
 * Uses the highest stage whose threshold is <= load.
 */
export function getVirusStage(load: number): VirusStageDef {
  const clamped = Math.max(0, Math.min(100, load));
  let current = VIRUS_STAGES[0];
  for (const stage of VIRUS_STAGES) {
    if (clamped >= stage.threshold) current = stage;
  }
  return current;
}

/* ─── PLAYER / ENTITY INFECTION STATE ─── */

/**
 * Complete per-player virus state. Persisted in
 * `user_progress.progressData.virus`.
 */
export interface VirusInfectionState {
  /** Cumulative viral load, 0–100 */
  load: number;
  /** Current stage (derived from load, cached for UI) */
  stage: VirusStage;
  /** Room IDs on the player's Ark that have active contamination */
  contaminatedRooms: string[];
  /** Crew IDs exposed during the current outbreak */
  exposedCrew: string[];
  /** Residue item IDs the player has found and logged */
  residueItemsLogged: string[];
  /** Residue item IDs the player has quarantined (removed) */
  residueItemsQuarantined: string[];
  /** Timestamp (ms) of the last propagation tick */
  lastTickAt: number;
  /** Number of times the player has been cured back to Dormant */
  cureCount: number;
  /** True if the final ending arc has been triggered */
  endingArcTriggered: boolean;
}

export const DEFAULT_VIRUS_STATE: VirusInfectionState = {
  load: 0,
  stage: "dormant",
  contaminatedRooms: [],
  exposedCrew: [],
  residueItemsLogged: [],
  residueItemsQuarantined: [],
  lastTickAt: 0,
  cureCount: 0,
  endingArcTriggered: false,
};

/* ─── RESIDUE ITEMS (dormant contamination on the Ark) ─── */

/**
 * Hidden residue items placed in the player's Ark. These already
 * exist in the world as lore items per EXPANSION_BIBLE.md; this
 * registry gives them mechanical weight — each logged item
 * nudges the viral load, each quarantined item reduces it.
 */
export interface ResidueItem {
  id: string;
  room: string;
  name: string;
  /** Lore snippet shown on discovery */
  lore: string;
  /** Load added when the player logs (but does not quarantine) the item */
  loadOnLog: number;
  /** Load removed when the item is quarantined / destroyed */
  loadOnQuarantine: number;
  /** Narrative flag set when the item is logged */
  narrativeFlag: string;
}

export const RESIDUE_ITEMS: ResidueItem[] = [
  {
    id: "residue_cryo_coolant",
    room: "cryo_bay",
    name: "Clouded Cryo Coolant",
    lore:
      "The blue fluid has tiny black filaments suspended in it — too regular to be damage. " +
      "They arrange themselves into the Warlord's sigil when you look away.",
    loadOnLog: 2,
    loadOnQuarantine: 4,
    narrativeFlag: "residue_cryo_logged",
  },
  {
    id: "residue_life_support_filter",
    room: "engineering",
    name: "Clogged Life-Support Filter",
    lore:
      "Someone replaced this filter in a hurry — Kael's prosthetic left scoring on the frame. " +
      "The cartridge inside is saturated with a fine grey powder.",
    loadOnLog: 3,
    loadOnQuarantine: 5,
    narrativeFlag: "residue_filter_logged",
  },
  {
    id: "residue_medbay_sample",
    room: "medical_bay",
    name: "Stasis-Locked Sample Vial",
    lore:
      "Vox's handwriting: 'PATIENT 0 — VIABLE, LATENT.' The stasis lock is original. The " +
      "contents are still moving.",
    loadOnLog: 4,
    loadOnQuarantine: 8,
    narrativeFlag: "residue_vial_logged",
  },
  {
    id: "residue_water_recycler",
    room: "cabin",
    name: "Water Recycler Sediment",
    lore:
      "The sediment at the bottom of the recycler cycles independent of the ship's pumps. " +
      "It is the colour of old photographs.",
    loadOnLog: 2,
    loadOnQuarantine: 3,
    narrativeFlag: "residue_water_logged",
  },
  {
    id: "residue_observation_console",
    room: "observation_deck",
    name: "Warlord Surveillance Node",
    lore:
      "An uncatalogued console behind a bulkhead, still drawing power. It is watching the cryo " +
      "bay — a deck away from the bridge's sensors.",
    loadOnLog: 3,
    loadOnQuarantine: 6,
    narrativeFlag: "residue_node_logged",
  },
];

/**
 * Look up a residue item by id.
 */
export function getResidueItem(id: string): ResidueItem | undefined {
  return RESIDUE_ITEMS.find(r => r.id === id);
}

/* ─── STATE TRANSITIONS ─── */

/**
 * Apply a load delta to a state, re-clamp, and recompute the stage.
 * Pure — returns a new state, does not mutate.
 */
export function applyLoadDelta(state: VirusInfectionState, delta: number): VirusInfectionState {
  const load = Math.max(0, Math.min(100, state.load + delta));
  const stage = getVirusStage(load).id;
  return { ...state, load, stage };
}

/**
 * Log a residue item. Returns the new state plus how much load was added.
 * Subsequent logs of the same item are a no-op.
 */
export function logResidueItem(
  state: VirusInfectionState,
  itemId: string,
): { state: VirusInfectionState; delta: number } {
  const item = getResidueItem(itemId);
  if (!item) return { state, delta: 0 };
  if (state.residueItemsLogged.includes(itemId)) return { state, delta: 0 };
  const next = applyLoadDelta(
    { ...state, residueItemsLogged: [...state.residueItemsLogged, itemId] },
    item.loadOnLog,
  );
  return { state: next, delta: item.loadOnLog };
}

/**
 * Quarantine a residue item. Reduces load. Only works on items that
 * have been logged but not yet quarantined.
 */
export function quarantineResidueItem(
  state: VirusInfectionState,
  itemId: string,
): { state: VirusInfectionState; delta: number } {
  const item = getResidueItem(itemId);
  if (!item) return { state, delta: 0 };
  if (!state.residueItemsLogged.includes(itemId)) return { state, delta: 0 };
  if (state.residueItemsQuarantined.includes(itemId)) return { state, delta: 0 };
  const next = applyLoadDelta(
    {
      ...state,
      residueItemsQuarantined: [...state.residueItemsQuarantined, itemId],
    },
    -item.loadOnQuarantine,
  );
  return { state: next, delta: -item.loadOnQuarantine };
}

/* ─── ROOM / CREW PROPAGATION ─── */

/**
 * Propagation rule: every `tickIntervalMs` of real time, a
 * contaminated room has a chance to infect an adjacent room.
 * Also, exposed crew tick upward in viral load and eventually
 * become carriers that re-infect cleared rooms.
 *
 * Called by the Living Universe hourly tick.
 */
export const PROPAGATION_TICK_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Adjacency graph for Ark 1047. Matches docs/design/GAME_DESIGN.md
 * room list. Kept local so we don't depend on a circular client import.
 */
export const ARK_ROOM_ADJACENCY: Record<string, string[]> = {
  cryo_bay: ["cabin", "medical_bay"],
  cabin: ["cryo_bay", "bridge", "armory"],
  bridge: ["cabin", "observation_deck", "comms"],
  observation_deck: ["bridge", "archives"],
  comms: ["bridge", "engineering"],
  engineering: ["comms", "cargo_hold", "armory"],
  armory: ["cabin", "engineering"],
  cargo_hold: ["engineering", "medical_bay"],
  medical_bay: ["cryo_bay", "cargo_hold"],
  archives: ["observation_deck"],
};

/**
 * Advance a propagation tick. Deterministic when a `rng` is injected
 * (tests pass a seeded rng; production passes Math.random).
 *
 * Rules:
 *   1. Each contaminated room has a 25% chance to spread to a random
 *      clean adjacent room.
 *   2. Each contaminated room adds +1 load per tick (max +5/tick).
 *   3. Exposed crew add +0.5 load per tick (rounded down at the end).
 *   4. If any crew has been exposed for more than three ticks, their
 *      contamination becomes permanent until cured.
 */
export interface PropagationResult {
  state: VirusInfectionState;
  newlyInfectedRooms: string[];
  loadGained: number;
}

export function propagateTick(
  state: VirusInfectionState,
  now: number,
  rng: () => number = Math.random,
): PropagationResult {
  if (now - state.lastTickAt < PROPAGATION_TICK_MS) {
    return { state, newlyInfectedRooms: [], loadGained: 0 };
  }

  const newlyInfected: string[] = [];
  const contaminatedSet = new Set(state.contaminatedRooms);

  for (const room of state.contaminatedRooms) {
    const neighbours = ARK_ROOM_ADJACENCY[room] ?? [];
    const cleanNeighbours = neighbours.filter(n => !contaminatedSet.has(n));
    if (cleanNeighbours.length === 0) continue;
    if (rng() < 0.25) {
      const pick = cleanNeighbours[Math.floor(rng() * cleanNeighbours.length)];
      contaminatedSet.add(pick);
      newlyInfected.push(pick);
    }
  }

  let loadGained = Math.min(5, state.contaminatedRooms.length);
  loadGained += Math.floor(state.exposedCrew.length * 0.5);

  const next = applyLoadDelta(
    {
      ...state,
      contaminatedRooms: Array.from(contaminatedSet),
      lastTickAt: now,
    },
    loadGained,
  );

  return { state: next, newlyInfectedRooms: newlyInfected, loadGained };
}

/* ─── CURES ─── */

export type CureAction =
  | "medbay_course"           // Basic treatment — works up to Active
  | "voltari_ritual"           // Alien purge — works up to Critical, requires Voltari alliance
  | "companion_sacrifice"      // Permanent companion loss — works at Critical only
  | "source_bargain"           // Narrative bad-ending — works anywhere, consumes morality
  | "antiquarian_purge";       // Requires Antiquarian invitation, resets load and cureCount

export interface CureDef {
  id: CureAction;
  name: string;
  description: string;
  /** Maximum stage this cure can treat */
  maxStage: VirusStage;
  /** Load reduction applied */
  loadReduction: number;
  /** Narrative cost */
  cost: string;
  /** Morality delta: positive = humanity, negative = machine */
  moralityDelta: number;
}

export const CURES: CureDef[] = [
  {
    id: "medbay_course",
    name: "Medical Bay Treatment Course",
    description:
      "A two-week course of anti-viral nanites synthesized from Vox's notes. " +
      "Works while the infection is still sub-clinical.",
    maxStage: "active",
    loadReduction: 30,
    cost: "500 credits, 3 medical kits, 2 weeks game time",
    moralityDelta: 0,
  },
  {
    id: "voltari_ritual",
    name: "Voltari Purge Ritual",
    description:
      "The Voltari have been watching the Thought Virus for two million years. They know " +
      "how to scour it from a body — if they trust you enough to try.",
    maxStage: "critical",
    loadReduction: 60,
    cost: "Voltari Full Alliance achievement, one trust reset with every non-Voltari NPC",
    moralityDelta: +5,
  },
  {
    id: "companion_sacrifice",
    name: "Companion Sacrifice",
    description:
      "Transfer the infection into a willing companion's substrate. They die. You live.",
    maxStage: "critical",
    loadReduction: 80,
    cost: "One permanent companion death (player's choice)",
    moralityDelta: -15,
  },
  {
    id: "source_bargain",
    name: "Bargain with the Source",
    description:
      "The Source will take the pain — but you belong to him afterward. Unlocks the Host " +
      "ending arc and disables the Insurgency questline.",
    maxStage: "consumed",
    loadReduction: 100,
    cost: "Insurgency questline disabled, forced Host ending",
    moralityDelta: -40,
  },
  {
    id: "antiquarian_purge",
    name: "Antiquarian Full Purge",
    description:
      "Step outside of time in the Antiquarian's pocket universe. When you return, the " +
      "infection is gone — and so is a chapter of your memory.",
    maxStage: "consumed",
    loadReduction: 100,
    cost: "Antiquarian invitation, lose one random lore category from the loredex",
    moralityDelta: 0,
  },
];

/**
 * Check whether a cure is legal at the current stage + resource state.
 */
export function canApplyCure(cureId: CureAction, state: VirusInfectionState): boolean {
  const cure = CURES.find(c => c.id === cureId);
  if (!cure) return false;
  const currentStage = getVirusStage(state.load);
  const stageOrder = VIRUS_STAGES.map(s => s.id);
  const currentIdx = stageOrder.indexOf(currentStage.id);
  const maxIdx = stageOrder.indexOf(cure.maxStage);
  return currentIdx <= maxIdx;
}

/**
 * Apply a cure. Returns the new state and the cure definition (for the UI
 * to render a toast / narrative callback).
 */
export function applyCure(
  state: VirusInfectionState,
  cureId: CureAction,
): { state: VirusInfectionState; cure: CureDef | null; success: boolean } {
  const cure = CURES.find(c => c.id === cureId);
  if (!cure) return { state, cure: null, success: false };
  if (!canApplyCure(cureId, state)) return { state, cure, success: false };
  const next = applyLoadDelta(
    { ...state, cureCount: state.cureCount + 1 },
    -cure.loadReduction,
  );
  return { state: next, cure, success: true };
}

/* ─── COMBAT STATUS: "Thought Virus" guild dark-variant effect ─── */

/**
 * The Locks guild dark variant of Quarantine is *named* "Thought Virus"
 * and lore-described as: "target slowly loses control, may attack allies."
 * This is the status effect that gets attached to a combat unit when that
 * ability fires. The combat resolver reads it via `tickVirusStatus`.
 */
export interface VirusStatusEffect {
  /** Remaining turns the status will be active */
  turnsRemaining: number;
  /** Probability per turn that the unit attacks an ally instead of the enemy */
  friendlyFireChance: number;
  /** Stacking count — each additional application increases friendlyFireChance */
  stacks: number;
}

export const BASE_VIRUS_STATUS: VirusStatusEffect = {
  turnsRemaining: 3,
  friendlyFireChance: 0.25,
  stacks: 1,
};

/**
 * Apply or stack a virus status on a unit. Each stack adds +0.15 friendly-fire
 * chance (capped at 0.85) and +1 turn of duration (capped at 6).
 */
export function applyVirusStatus(
  current: VirusStatusEffect | null,
): VirusStatusEffect {
  if (!current) return { ...BASE_VIRUS_STATUS };
  const stacks = current.stacks + 1;
  return {
    turnsRemaining: Math.min(6, current.turnsRemaining + 1),
    friendlyFireChance: Math.min(0.85, current.friendlyFireChance + 0.15),
    stacks,
  };
}

/**
 * Called once per combat turn. Rolls friendly-fire, decrements duration.
 * Returns the next status and whether this unit should target an ally this turn.
 */
export function tickVirusStatus(
  status: VirusStatusEffect | null,
  rng: () => number = Math.random,
): { status: VirusStatusEffect | null; targetAlly: boolean } {
  if (!status || status.turnsRemaining <= 0) return { status: null, targetAlly: false };
  const targetAlly = rng() < status.friendlyFireChance;
  const nextTurns = status.turnsRemaining - 1;
  const next = nextTurns <= 0 ? null : { ...status, turnsRemaining: nextTurns };
  return { status: next, targetAlly };
}

/* ─── LIVING UNIVERSE HOOK ─── */

/**
 * Amount of viralExposures pressure to add when the player's load
 * crosses into a new stage. Tunable so the pressure flow reflects the
 * narrative weight of each stage.
 */
export const PRESSURE_ON_STAGE_ENTRY: Record<VirusStage, number> = {
  dormant: 0,
  latent: 2,
  active: 8,
  critical: 25,
  consumed: 80,
};

/**
 * Given a previous and next state, compute how much viralExposures
 * pressure the load change should contribute to Living Universe.
 */
export function pressureFromStateDelta(
  before: VirusInfectionState,
  after: VirusInfectionState,
): number {
  if (after.stage === before.stage) return 0;
  const stageOrder = VIRUS_STAGES.map(s => s.id);
  const beforeIdx = stageOrder.indexOf(before.stage);
  const afterIdx = stageOrder.indexOf(after.stage);
  if (afterIdx <= beforeIdx) return 0; // Cures don't add pressure
  let total = 0;
  for (let i = beforeIdx + 1; i <= afterIdx; i++) {
    total += PRESSURE_ON_STAGE_ENTRY[stageOrder[i] as VirusStage];
  }
  return total;
}

/* ─── SUMMARY / UI HELPERS ─── */

/**
 * Produce a UI-ready snapshot used by the InfectionPanel component and
 * the daily-brief summary card.
 */
export function getVirusSummary(state: VirusInfectionState): {
  stage: VirusStageDef;
  loadPct: number;
  residueLoggedCount: number;
  residueQuarantinedCount: number;
  contaminatedRoomCount: number;
  exposedCrewCount: number;
  nextStage: VirusStageDef | null;
  loadUntilNextStage: number;
} {
  const stage = getVirusStage(state.load);
  const stageOrder = VIRUS_STAGES.map(s => s.id);
  const currentIdx = stageOrder.indexOf(stage.id);
  const nextStage =
    currentIdx < VIRUS_STAGES.length - 1 ? VIRUS_STAGES[currentIdx + 1] : null;
  const loadUntilNextStage = nextStage ? Math.max(0, nextStage.threshold - state.load) : 0;
  return {
    stage,
    loadPct: Math.round(state.load),
    residueLoggedCount: state.residueItemsLogged.length,
    residueQuarantinedCount: state.residueItemsQuarantined.length,
    contaminatedRoomCount: state.contaminatedRooms.length,
    exposedCrewCount: state.exposedCrew.length,
    nextStage,
    loadUntilNextStage,
  };
}
