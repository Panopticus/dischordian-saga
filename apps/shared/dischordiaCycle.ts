/* ═══════════════════════════════════════════════════════
   THE DISCHORDIA CYCLE — Light / Dark Galactic Meter

   A fork of shared/necromancerCycle.ts that tracks the
   Witnessing Narrative Proposal §3 "global bulb":

     lightEnergy     — the galaxy waking up
     darkEnergy      — the galaxy going quiet
     vortexProximity — doomsday clock, only ticks up

   Every mechanical action in the game writes to these
   meters (see ENERGY_GAIN_TABLE). Players never see
   numbers — only the poetic descriptors in this file.

   See docs/design/WITNESSING_NARRATIVE_PROPOSAL.md §3.
   ═══════════════════════════════════════════════════════ */

/* ─── CYCLE STATE ─── */

export type DischordiaPhase =
  | "dawn"              // Default. Lit sectors dominant.
  | "dimming"           // Dark energy ascending, visible dimming begins.
  | "long_night"        // Dark > 500k, sectors flickering out.
  | "vortex_advance"    // < 20% lit sectors. 72h rolling sector-loss event.
  | "reclamation"       // Community reclamation event in progress.
  | "light_holds";      // Community-visible Light ≥ 1M. The bulb holds.

export interface DischordiaCycleState {
  phase: DischordiaPhase;
  phaseStartedAt: string;
  /** Increments each Vortex Advance → Reclamation round trip */
  cycleNumber: number;
  /** Hidden numeric meter for the galaxy waking up */
  lightEnergy: number;
  /** Hidden numeric meter for the galaxy going quiet */
  darkEnergy: number;
  /** Doomsday clock, 0-100. Only ticks up. */
  vortexProximity: number;
  energyBalance: "dark_ascending" | "balanced" | "light_ascending";
  history: DischordiaCycleRecord[];
}

export interface DischordiaCycleRecord {
  cycleNumber: number;
  advanceTriggeredAt: string;
  reclaimedAt: string | null;
  durationHours: number;
  sectorsConsumed: number;
  sectorsReclaimed: number;
  outcome: "reclaimed" | "bulb_broke" | "ongoing";
}

/* ─── HIDDEN METER DISPLAY (Never show the number) ─── */

/** §3.5 — Light energy poetic descriptors. */
export function getLightEnergyDescription(energy: number): string {
  if (energy < 100_000) return "The galaxy is a rumor of stars.";
  if (energy < 300_000) return "A few windows are lit.";
  if (energy < 500_000) return "The constellations remember their names.";
  if (energy < 700_000) return "The bulb warms.";
  if (energy < 900_000) return "The long night loses ground.";
  return "THE LIGHT HOLDS.";
}

/** §3.5 — Dark energy poetic descriptors. */
export function getDarkEnergyDescription(energy: number): string {
  if (energy < 100_000) return "A shadow in the gutter of the sky.";
  if (energy < 300_000) return "Something is moving at the edges.";
  if (energy < 500_000) return "The Vortex hums again.";
  if (energy < 700_000) return "Stars forget how to shine.";
  if (energy < 900_000) return "A sector has gone quiet.";
  return "THE BULB IS BREAKING.";
}

/**
 * §3.5 — Vortex proximity descriptor. Hidden entirely until > 50%.
 * Returns `null` below that threshold so the UI can suppress display.
 */
export function getVortexProximityDescription(proximity: number): string | null {
  if (proximity <= 50) return null;
  if (proximity <= 75) return "A drum in the deep sky.";
  if (proximity <= 90) return "The drum is closer.";
  return "The drum is here.";
}

export function getBalanceDescription(
  balance: DischordiaCycleState["energyBalance"],
  phase: DischordiaPhase,
): string {
  if (phase === "dawn") return "The galaxy is at rest.";
  if (phase === "light_holds") return "The light holds. The galaxy remembers itself.";
  if (phase === "vortex_advance") return "The Vortex is taking sectors. The drum is here.";
  if (phase === "reclamation") return "A reclamation is underway. Every hand matters.";
  if (balance === "dark_ascending") return "Dark grows stronger than light. The Vortex gains ground.";
  if (balance === "light_ascending") return "Light gathers against the Vortex. Sectors flicker back on.";
  return "The energies are balanced. For now.";
}

/* ─── SECTOR LIGHT STATE (§3.2) ─── */

export type SectorLightState =
  | "lit"        // Default. Normal art.
  | "dimming"    // Desaturated. NPCs less responsive. Trade prices shift against player.
  | "dark"       // No trade, no missions, enemies upgraded. Pets on-colony emergency cryo.
  | "consumed"   // Vortex reached this sector. Removed from travel graph this cycle.
  | "reclaimed"; // Community drove Light high enough. Gold border, favorable prices.

export interface SectorLightInfo {
  state: SectorLightState;
  label: string;
  description: string;
  /** Used by UI to tint / filter the sector art. */
  mood: "warm" | "neutral" | "cold" | "void" | "gold";
}

export const SECTOR_LIGHT_INFO: Record<SectorLightState, SectorLightInfo> = {
  lit: {
    state: "lit",
    label: "Lit",
    description: "The sector's lights are on. The constellations remember their names.",
    mood: "neutral",
  },
  dimming: {
    state: "dimming",
    label: "Dimming",
    description: "The colors are bleeding out. Locals answer in half-sentences.",
    mood: "cold",
  },
  dark: {
    state: "dark",
    label: "Dark",
    description: "No trade. No missions. Pets on-colony are in emergency cryo.",
    mood: "cold",
  },
  consumed: {
    state: "consumed",
    label: "Consumed",
    description: "The Vortex has taken this sector. It is a hole in the travel graph.",
    mood: "void",
  },
  reclaimed: {
    state: "reclaimed",
    label: "Reclaimed",
    description: "Your light reached this far. The sector glows.",
    mood: "gold",
  },
};

/* ─── GALAXY BRIGHTNESS TIER (§3.3) ─── */

export type GalaxyBrightnessTier =
  | "full_bloom"    // ≥ 80% lit
  | "normal"        // 50–80% lit
  | "dimming"       // 20–50% lit
  | "long_night";   // < 20% lit

export interface GalaxyBrightnessDisplay {
  tier: GalaxyBrightnessTier;
  label: string;
  elaraCallback: string | null;
  musicLayer: "warm" | "neutral" | "dark" | "vortex";
  triggersVortexAdvance: boolean;
}

/** §3.3 — Community brightness derived from lit-sector ratio. */
export function getGalaxyBrightnessTier(litRatio: number): GalaxyBrightnessDisplay {
  if (litRatio >= 0.8) {
    return {
      tier: "full_bloom",
      label: "The galaxy feels brighter today.",
      elaraCallback: "The galaxy feels brighter today. I can feel it in the reports.",
      musicLayer: "warm",
      triggersVortexAdvance: false,
    };
  }
  if (litRatio >= 0.5) {
    return {
      tier: "normal",
      label: "Steady. For now.",
      elaraCallback: null,
      musicLayer: "neutral",
      triggersVortexAdvance: false,
    };
  }
  if (litRatio >= 0.2) {
    return {
      tier: "dimming",
      label: "The colors are off. The signals are off.",
      // The Human gets more airtime in shared rooms — he handles the dark better.
      elaraCallback: null,
      musicLayer: "dark",
      triggersVortexAdvance: false,
    };
  }
  return {
    tier: "long_night",
    label: "The bulb is dimming across the whole field.",
    elaraCallback: null,
    musicLayer: "vortex",
    triggersVortexAdvance: true,
  };
}

/* ─── ENERGY GAIN TABLE (§3.6) ─── */

/**
 * A single tabulated action that writes to the light/dark meter.
 * The table is the spec — every mechanical action in the game
 * SHOULD route through `applyEnergyGain` so the meter is
 * consistent across systems.
 */
export interface EnergyGainAction {
  id: string;
  source: string;
  light: number;
  dark: number;
  /** Optional vortex proximity delta (only "refuse both" and sector loss.) */
  vortex?: number;
}

export const ENERGY_GAIN_TABLE: readonly EnergyGainAction[] = [
  { id: "card_battle_light_win", source: "Card Battle (Light deck win)", light: 20, dark: 0 },
  { id: "card_battle_loss", source: "Card Battle (loss, any)", light: 0, dark: 15 },
  { id: "crafting_light_card", source: "Crafting a Light-aligned card", light: 5, dark: 0 },
  { id: "chess_win_vs_gm", source: "Chess win vs Game Master NPC", light: 10, dark: 0 },
  { id: "pet_battle_rescue", source: "Pet Battle (rescue win)", light: 8, dark: 0 },
  { id: "pet_death_non_memorial", source: "Pet death (not memorial)", light: 0, dark: 25 },
  { id: "crew_mission_compassionate", source: "Crew mission (compassionate)", light: 15, dark: 0 },
  { id: "crew_mission_mercenary", source: "Crew mission (mercenary)", light: 5, dark: 5 },
  { id: "trade_diplomacy_treaty", source: "Trade Empire diplomacy (treaty)", light: 30, dark: 0 },
  { id: "trade_diplomacy_coup", source: "Trade Empire diplomacy (coup)", light: 15, dark: 15 },
  { id: "trade_sector_reclamation", source: "Trade Empire sector reclamation", light: 100, dark: 0 },
  { id: "collectors_arena_gm_defeat", source: "Collector's Arena — GM defeat", light: 50, dark: 0 },
  { id: "collectors_arena_gm_loss", source: "Collector's Arena — GM victory on you", light: 0, dark: 50 },
  { id: "fight_game_boss_defeat", source: "Fighting Game boss defeat (Act 4)", light: 30, dark: 0 },
  { id: "casino_win", source: "Casino win (Degen)", light: 2, dark: 5 },
  { id: "casino_loss", source: "Casino loss (Degen)", light: 0, dark: 10 },
  { id: "dmc_clear", source: "Dead Man's Circuit clear", light: 40, dark: 0 },
  { id: "cades_mission", source: "Cades FPS mission (Act 5)", light: 40, dark: 0 },
  { id: "dismiss_companion", source: "Dismiss a companion (\"go away\")", light: 0, dark: 5 },
  { id: "two_witnesses_forgive", source: "Forgive at Two Witnesses Meet", light: 200, dark: 0 },
  { id: "two_witnesses_refuse", source: "Refuse both at Two Witnesses Meet", light: 0, dark: 100, vortex: 1 },
  { id: "last_words_cinematic_seen", source: "Last Words cinematic (Act 1 finale, §17)", light: 500, dark: 0 },
] as const;

export type EnergyGainActionId = (typeof ENERGY_GAIN_TABLE)[number]["id"];

/** Look up the spec row for a given action id. */
export function getEnergyGain(actionId: EnergyGainActionId): EnergyGainAction | undefined {
  return ENERGY_GAIN_TABLE.find((a) => a.id === actionId);
}

/**
 * Apply an energy-gain action to a cycle state, returning a new state.
 * Pure function — never mutates input.
 */
export function applyEnergyGain(
  state: DischordiaCycleState,
  actionId: EnergyGainActionId,
): DischordiaCycleState {
  const action = getEnergyGain(actionId);
  if (!action) return state;
  return recomputeDerived({
    ...state,
    lightEnergy: state.lightEnergy + action.light,
    darkEnergy: state.darkEnergy + action.dark,
    vortexProximity: clampProximity(state.vortexProximity + (action.vortex ?? 0)),
  });
}

/* ─── Phase 5: item-tagged energy gain (items-matter / GoT arc) ─── */

/**
 * Per-faction additive energy nudges applied on top of an action's
 * baseline. Items reveal their alignment by which side of the
 * Dischordia meter they push. The mapping is intentionally
 * conservative — we only nudge by a few points so a single trade
 * can't dominate the global meter.
 *
 * Aligned with the priority-roster faction taxonomy:
 * - Light-leaning: Antiquarian, Thaloria/independent, Potentials
 * - Dark-leaning: Hierarchy, Thought Virus, Architect
 * - Neutral: New Babylon, Insurgency, Free Ports — politics, not metaphysics
 */
const FACTION_ENERGY_NUDGE: Readonly<Record<string, { light: number; dark: number }>> = {
  antiquarian: { light: 3, dark: 0 },
  thaloria: { light: 4, dark: 0 },
  potentials: { light: 2, dark: 0 },
  hierarchy: { light: 0, dark: 4 },
  thought_virus: { light: 0, dark: 5 },
  architect: { light: 0, dark: 3 },
  artificial_empire: { light: 0, dark: 3 },
  new_babylon: { light: 0, dark: 0 },
  insurgency: { light: 0, dark: 0 },
  independent: { light: 1, dark: 0 },
  neutral: { light: 0, dark: 0 },
};

/**
 * Look up the per-action nudge for a given faction id (or any string —
 * unknown values fall through to neutral). Used by the item-tagged
 * energy paths and exported so callers can preview the effect.
 */
export function factionEnergyNudge(factionId: string | null | undefined): {
  light: number;
  dark: number;
} {
  if (!factionId) return { light: 0, dark: 0 };
  return FACTION_ENERGY_NUDGE[factionId] ?? { light: 0, dark: 0 };
}

/**
 * Apply an energy-gain action AND add a small faction-keyed nudge
 * derived from an item's political alignment. Used wherever an
 * action's energy effect should depend on what was traded / crafted /
 * disenchanted.
 *
 * Pure function. Use this in place of applyEnergyGain when the
 * action has an associated item / card / good with a faction tag.
 */
export function applyEnergyGainForFaction(
  state: DischordiaCycleState,
  actionId: EnergyGainActionId,
  factionId: string | null | undefined,
): DischordiaCycleState {
  const baseAction = getEnergyGain(actionId);
  if (!baseAction) return state;
  const nudge = factionEnergyNudge(factionId);
  return recomputeDerived({
    ...state,
    lightEnergy: state.lightEnergy + baseAction.light + nudge.light,
    darkEnergy: state.darkEnergy + baseAction.dark + nudge.dark,
    vortexProximity: clampProximity(
      state.vortexProximity + (baseAction.vortex ?? 0),
    ),
  });
}

/* ─── RECLAMATION CHAIN (§3.4) ─── */

export interface ReclamationStep {
  id: string;
  stage: number;
  name: string;
  description: string;
  /** Which system hosts this step. */
  gameMode: "trade_empire" | "card_game" | "comms_array" | "cutscene";
  /** What community action fulfills this step. */
  objective:
    | { type: "collect_resources"; items: string[] }
    | { type: "card_duel_win"; targetOpponent: string }
    | { type: "comms_clicks"; clicksRequired: number }
    | { type: "cutscene_play"; cutsceneId: string };
  /** Personal Light Energy pool awarded to participants. */
  personalLightReward: number;
}

/** §3.4 — The community Reclamation Event chain. */
export const RECLAMATION_CHAIN: readonly ReclamationStep[] = [
  {
    id: "forge_light_beacon",
    stage: 1,
    name: "Forge a Light Beacon",
    description: "Collect three resources from three different faction territories.",
    gameMode: "trade_empire",
    objective: {
      type: "collect_resources",
      items: ["sunsteel_ingot", "ne_yon_prism", "quarchon_core_shard"],
    },
    personalLightReward: 50,
  },
  {
    id: "open_card_duel",
    stage: 2,
    name: "Open a Card Duel",
    description: "A player wins a Dischordia battle against a specified opponent, broadcast live.",
    gameMode: "card_game",
    objective: {
      type: "card_duel_win",
      targetOpponent: "game_master_herald",
    },
    personalLightReward: 75,
  },
  {
    id: "broadcast_signal",
    stage: 3,
    name: "Broadcast the Signal",
    description: "Comms Array mini-puzzle — every participating player gets to click once.",
    gameMode: "comms_array",
    objective: {
      type: "comms_clicks",
      clicksRequired: 1,
    },
    personalLightReward: 50,
  },
  {
    id: "sector_wakes_cutscene",
    stage: 4,
    name: "A Sector Wakes",
    description: "The consumed sector reboots on the galaxy map. Gold border. Reclaimer tome page.",
    gameMode: "cutscene",
    objective: {
      type: "cutscene_play",
      cutsceneId: "reclamation_sector_wakes",
    },
    personalLightReward: 25,
  },
] as const;

/* ─── HELPERS ─── */

/** Clamp the 0-100 doomsday clock. */
export function clampProximity(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/** Compute the narrative balance tag from the two meters. */
export function calculateBalance(
  lightEnergy: number,
  darkEnergy: number,
): DischordiaCycleState["energyBalance"] {
  const diff = darkEnergy - lightEnergy;
  if (diff > 100_000) return "dark_ascending";
  if (diff < -100_000) return "light_ascending";
  return "balanced";
}

/**
 * Recompute derived state (balance, phase) after a raw meter update.
 * Phase transitions follow §3.3 thresholds plus vortex/reclamation
 * overrides, but are conservative — they never roll BACKWARDS from
 * `vortex_advance` or `reclamation` on their own; callers must advance
 * those explicitly through `triggerReclamation` / `completeReclamation`.
 */
export function recomputeDerived(state: DischordiaCycleState): DischordiaCycleState {
  const balance = calculateBalance(state.lightEnergy, state.darkEnergy);
  // Don't auto-exit the two explicit community phases.
  if (state.phase === "vortex_advance" || state.phase === "reclamation") {
    return { ...state, energyBalance: balance };
  }
  let phase: DischordiaPhase = state.phase;
  if (state.lightEnergy >= 1_000_000) phase = "light_holds";
  else if (state.darkEnergy >= 500_000) phase = "long_night";
  else if (state.darkEnergy >= 100_000) phase = "dimming";
  else phase = "dawn";
  return {
    ...state,
    energyBalance: balance,
    phase,
    phaseStartedAt:
      phase === state.phase ? state.phaseStartedAt : new Date().toISOString(),
  };
}

export function shouldTriggerVortexAdvance(
  state: DischordiaCycleState,
  litSectorRatio: number,
): boolean {
  if (state.phase === "vortex_advance" || state.phase === "reclamation") return false;
  return litSectorRatio < 0.2;
}

export function triggerVortexAdvance(state: DischordiaCycleState): DischordiaCycleState {
  return {
    ...state,
    phase: "vortex_advance",
    phaseStartedAt: new Date().toISOString(),
  };
}

export function triggerReclamation(state: DischordiaCycleState): DischordiaCycleState {
  return {
    ...state,
    phase: "reclamation",
    phaseStartedAt: new Date().toISOString(),
  };
}

export function completeReclamation(
  state: DischordiaCycleState,
  sectorsReclaimed: number,
): DischordiaCycleState {
  const now = new Date().toISOString();
  const started = new Date(state.phaseStartedAt).getTime();
  const durationHours = Math.max(0, (Date.now() - started) / (1000 * 60 * 60));
  const record: DischordiaCycleRecord = {
    cycleNumber: state.cycleNumber,
    advanceTriggeredAt: state.phaseStartedAt,
    reclaimedAt: now,
    durationHours,
    sectorsConsumed: 0,
    sectorsReclaimed,
    outcome: "reclaimed",
  };
  return recomputeDerived({
    ...state,
    phase: "dawn",
    phaseStartedAt: now,
    cycleNumber: state.cycleNumber + 1,
    lightEnergy: state.lightEnergy + sectorsReclaimed * 100,
    history: [...state.history, record],
  });
}

/* ─── DEFAULT STATE ─── */

export const DEFAULT_DISCHORDIA_CYCLE_STATE: DischordiaCycleState = {
  phase: "dawn",
  phaseStartedAt: new Date(0).toISOString(),
  cycleNumber: 1,
  lightEnergy: 0,
  darkEnergy: 0,
  vortexProximity: 0,
  energyBalance: "balanced",
  history: [],
};

/* ─── TIMING CALIBRATION (hidden from players) ─── */

export const DISCHORDIA_TIMING = {
  /** Target average hours before a long-night phase triggers Vortex Advance. */
  vortexAdvanceWindowHours: 72,
  /** Sectors lost per tick once vortex_advance is live. */
  vortexAdvanceSectorsPerTick: 1,
  /** Hours per vortex-advance tick. */
  vortexAdvanceTickHours: 12,
  /** Minimum hours between reclamation events (prevent farming). */
  minHoursBetweenReclamations: 24,
} as const;

/* ─── ENGINEER RECORDING MILESTONES ─── */

/**
 * Card-battle milestone thresholds that activate Engineer holographic
 * recordings.  These are checked after every card battle to determine
 * if a new recording should surface in the Ark.
 *
 * See engineerRecordings.ts for the full recording definitions.
 */
export interface CardBattleMilestone {
  readonly recordingOrder: number;
  readonly minWins: number;
  readonly dischordiaStep?: number;
  readonly allAct1Complete?: boolean;
  /**
   * Optional gate — only fire the recording once the Prelude has
   * completed (`narrativeFlags.prelude_complete` raised). Reserved
   * for Recording 0, which lands at end-of-Prelude before Act 1.
   */
  readonly preludeComplete?: boolean;
  readonly discoveryFlag: string;
}

export const CARD_BATTLE_MILESTONES: readonly CardBattleMilestone[] = [
  // Recording 0 — "If You're Hearing This." Engineer's end-of-Prelude
  // transmission. Per canon (engineerRecordings.ts:74), it surfaces when
  // the Prelude completes, before any card-battle wins are recorded.
  { recordingOrder: 0, minWins: 0, preludeComplete: true, discoveryFlag: "engineer_recording_0_discovered" },
  { recordingOrder: 1, minWins: 1, discoveryFlag: "engineer_recording_1_discovered" },
  { recordingOrder: 2, minWins: 3, discoveryFlag: "engineer_recording_2_discovered" },
  { recordingOrder: 3, minWins: 4, discoveryFlag: "engineer_recording_3_discovered" },
  { recordingOrder: 4, minWins: 8, discoveryFlag: "engineer_recording_4_discovered" },
  { recordingOrder: 5, minWins: 9, discoveryFlag: "engineer_recording_5_discovered" },
  { recordingOrder: 6, minWins: 10, dischordiaStep: 12, discoveryFlag: "engineer_recording_6_discovered" },
  { recordingOrder: 7, minWins: 12, allAct1Complete: true, discoveryFlag: "engineer_recording_7_discovered" },
] as const;

/**
 * Check whether a new Engineer recording should trigger based on the
 * player's card battle progress.  Returns the next milestone that hasn't
 * been discovered yet, or undefined if none are ready.
 */
export function getNextRecordingMilestone(
  totalCardWins: number,
  dischordiaStep: number,
  allAct1Complete: boolean,
  flags: Record<string, unknown>,
): CardBattleMilestone | undefined {
  return CARD_BATTLE_MILESTONES.find((m) => {
    if (flags[m.discoveryFlag]) return false;
    if (totalCardWins < m.minWins) return false;
    if (m.dischordiaStep != null && dischordiaStep < m.dischordiaStep) return false;
    if (m.allAct1Complete && !allAct1Complete) return false;
    return true;
  });
}

/* ═══════════════════════════════════════════════════════
   LIGHT ENERGY THRESHOLD ACKNOWLEDGMENTS

   Act 1 Ship-Ready Bible §17.4 specifies that when a
   player's personal contribution (e.g., the +500 from the
   Last Words cinematic) pushes the galaxy-wide lightEnergy
   counter across a multi-thousand threshold, the Witnessing
   Hub surfaces a "You contributed to this" acknowledgment.
   The thresholds below are the canonical set.
   ═══════════════════════════════════════════════════════ */

export interface LightEnergyThreshold {
  /** Counter value at which this threshold fires. */
  value: number;
  /** Label shown on the Hub dashboard milestone card. */
  label: string;
  /** Acknowledgment text shown when a player's contribution pushes the counter past this value. */
  acknowledgment: string;
}

export const LIGHT_ENERGY_THRESHOLDS: readonly LightEnergyThreshold[] = [
  {
    value: 1_000,
    label: "The First Thousand",
    acknowledgment:
      "You contributed to this. The first thousand Light is always the hardest.",
  },
  {
    value: 10_000,
    label: "Ten Thousand Witnesses",
    acknowledgment:
      "You contributed to this. Ten thousand Light Energy is a crowd that remembers.",
  },
  {
    value: 100_000,
    label: "A Sector Brightens",
    acknowledgment:
      "You contributed to this. The galaxy noticed the hundred-thousand mark. The Antiquarian annotated the ledger.",
  },
  {
    value: 1_000_000,
    label: "The Million-Light Line",
    acknowledgment:
      "You contributed to this. One million Light is where the Reclamation protocols stop being theoretical.",
  },
  {
    value: 10_000_000,
    label: "The Dreamers' Threshold",
    acknowledgment:
      "You contributed to this. The Dreamers' Shield flickers at ten million. Someone behind it may have noticed.",
  },
] as const;

/**
 * Returns the threshold a delta crosses, or null if the delta does not
 * push the counter past any canonical threshold.
 *
 * @param previousLight   lightEnergy before the gain
 * @param newLight        lightEnergy after the gain
 */
export function checkLightEnergyThresholdCrossing(
  previousLight: number,
  newLight: number,
): LightEnergyThreshold | null {
  for (const t of LIGHT_ENERGY_THRESHOLDS) {
    if (previousLight < t.value && newLight >= t.value) {
      return t;
    }
  }
  return null;
}
