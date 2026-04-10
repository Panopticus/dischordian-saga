/* ═══════════════════════════════════════════════════════
   THE DISCHORDIA CYCLE — Light/Dark Energy Meter

   Fork of shared/necromancerCycle.ts. This is the
   galaxy-wide community meter for "The Witnessing" — it
   tracks Light Energy, Dark Energy, and a hidden Vortex
   Proximity (doomsday clock).

   Spec from PART 3 of the Witnessing production plan.

   Numbers are NEVER shown to players. They see poetic
   descriptors. The only meter the community ever reads is
   the mood of the galaxy map: lit, dimming, dark, consumed,
   or reclaimed.
   ═══════════════════════════════════════════════════════ */

/* ─── METER STATE ─── */

export interface DischordianCycleState {
  /** Community-wide Light Energy pool. */
  lightEnergy: number;
  /** Community-wide Dark Energy pool. */
  darkEnergy: number;
  /** 0-100, only grows — doomsday clock for the Vortex. */
  vortexProximity: number;
  /** Percent of galaxy map sectors currently lit. */
  litSectors: number;
  /** Timestamp of the last reclamation event, ISO string. */
  lastReclamationEvent: string | null;
  /** Current weekly community Light goal. */
  communityLightGoal: number;
  /** Dark Energy threshold that triggers the "Bulb Dims" ambient event. */
  communityDarkThreshold: number;
  /** Has the "The Silence of Two Witnesses" 24h meter freeze been activated? */
  silenceOfWitnessesFreezeUntil: string | null;
  /** Current phase — mirrors community narrative arc. */
  phase: DischordianPhase;
}

export type DischordianPhase =
  | "dormant"
  | "stirring"           // Dark Energy starts rising
  | "besieged"           // Dark > Light, sectors begin dimming
  | "reclaiming"         // Community pushes back, sectors lighting up
  | "holding"            // Light holds, Vortex stalled
  | "consumed";          // Vortex arrival — endgame

export const DEFAULT_DISCHORDIA_STATE: DischordianCycleState = {
  lightEnergy: 0,
  darkEnergy: 0,
  vortexProximity: 0,
  litSectors: 100,
  lastReclamationEvent: null,
  communityLightGoal: 100_000,
  communityDarkThreshold: 300_000,
  silenceOfWitnessesFreezeUntil: null,
  phase: "dormant",
};

/* ─── POETIC DISPLAY STRINGS ─── */

/** Never show numbers. Always show mood. */
export const LIGHT_ENERGY_TEXT = {
  under100k: "The galaxy is a rumor of stars.",
  under300k: "A few windows are lit.",
  under500k: "The constellations remember their names.",
  under700k: "The bulb warms.",
  under900k: "The long night loses ground.",
  max:       "THE LIGHT HOLDS.",
} as const;

export const DARK_ENERGY_TEXT = {
  under100k: "A shadow in the gutter of the sky.",
  under300k: "Something is moving at the edges.",
  under500k: "The Vortex hums again.",
  under700k: "Stars forget how to shine.",
  under900k: "A sector has gone quiet.",
  max:       "THE BULB IS BREAKING.",
} as const;

/** Vortex Proximity is HIDDEN under 50% — it reveals itself slowly. */
export const VORTEX_PROXIMITY_TEXT = {
  under50:  null,                          // Hidden entirely.
  under75:  "A drum in the deep sky.",
  under90:  "The drum is closer.",
  at100:    "THE DRUM IS HERE.",
} as const;

export function describeLightEnergy(light: number): string {
  if (light < 100_000) return LIGHT_ENERGY_TEXT.under100k;
  if (light < 300_000) return LIGHT_ENERGY_TEXT.under300k;
  if (light < 500_000) return LIGHT_ENERGY_TEXT.under500k;
  if (light < 700_000) return LIGHT_ENERGY_TEXT.under700k;
  if (light < 900_000) return LIGHT_ENERGY_TEXT.under900k;
  return LIGHT_ENERGY_TEXT.max;
}

export function describeDarkEnergy(dark: number): string {
  if (dark < 100_000) return DARK_ENERGY_TEXT.under100k;
  if (dark < 300_000) return DARK_ENERGY_TEXT.under300k;
  if (dark < 500_000) return DARK_ENERGY_TEXT.under500k;
  if (dark < 700_000) return DARK_ENERGY_TEXT.under700k;
  if (dark < 900_000) return DARK_ENERGY_TEXT.under900k;
  return DARK_ENERGY_TEXT.max;
}

export function describeVortexProximity(proximity: number): string | null {
  if (proximity < 50) return VORTEX_PROXIMITY_TEXT.under50;
  if (proximity < 75) return VORTEX_PROXIMITY_TEXT.under75;
  if (proximity < 90) return VORTEX_PROXIMITY_TEXT.under90;
  return VORTEX_PROXIMITY_TEXT.at100;
}

/* ─── SECTOR LIGHT STATES ─── */

export type SectorLightState =
  | "lit"        // default — normal art
  | "dimming"    // dark energy near — desaturated art, worse trade prices
  | "dark"       // power gone — pets at risk, enemies upgraded, no trade
  | "consumed"   // Vortex arrived — removed from travel graph until reclaimed
  | "reclaimed"; // community drove it back — gold border art, premium prices

/* ─── CONTRIBUTION TABLE ─── */

/**
 * Every player action writes to the Light/Dark meter. This table is the
 * canonical source used by {@link applyContribution}, the ripple engine,
 * and the server's metric collector.
 *
 * Spec from PART 3 §3.3.
 */
export interface ContributionRule {
  id: string;
  label: string;
  lightGain: number;
  darkGain: number;
  livingUniverseNote?: string;
}

export const CONTRIBUTION_TABLE: ContributionRule[] = [
  { id: "card_battle_win_light",  label: "Card Battle win (Light deck)",    lightGain: 20, darkGain: 0 },
  { id: "card_battle_loss",       label: "Card Battle loss (any)",           lightGain: 0,  darkGain: 15 },
  { id: "craft_light_card",       label: "Crafting Light-aligned card",      lightGain: 5,  darkGain: 0 },
  { id: "chess_gm_win",           label: "Chess win vs Game Master NPC",     lightGain: 10, darkGain: 0 },
  { id: "pet_battle_rescue_win",  label: "Pet Battle (rescue win)",          lightGain: 8,  darkGain: 0 },
  {
    id: "pet_death_non_memorial",
    label: "Pet death (non-memorial)",
    lightGain: 0,
    darkGain: 25,
    livingUniverseNote: "Highest single-action dark gain",
  },
  { id: "crew_mission_compassion", label: "Crew mission (compassionate)",    lightGain: 15, darkGain: 0 },
  { id: "trade_treaty",            label: "Trade Empire treaty",             lightGain: 30, darkGain: 0 },
  {
    id: "trade_reclaim_sector",
    label: "Trade Empire sector reclaim",
    lightGain: 100,
    darkGain: 0,
    livingUniverseNote: "Triggers Reclamation Event",
  },
  { id: "arena_gm_defeat",         label: "Collector's Arena GM defeat",     lightGain: 50, darkGain: 0 },
  { id: "casino_loss",             label: "Casino loss",                     lightGain: 0,  darkGain: 10 },
  { id: "narrator_dismiss",        label: "Dismiss companion (\"go away\")", lightGain: 0,  darkGain: 5 },
  {
    id: "two_witnesses_forgive_both",
    label: "Forgive at Two Witnesses Meet",
    lightGain: 200,
    darkGain: 0,
    livingUniverseNote: "Highest single-action light gain",
  },
  {
    id: "two_witnesses_refuse_both",
    label: "Refuse both at Two Witnesses",
    lightGain: 0,
    darkGain: 100,
    livingUniverseNote: "Unlocks Lyra Vox narrator",
  },
  { id: "dead_mans_circuit_clear", label: "Dead Man's Circuit clear",        lightGain: 40, darkGain: 0 },
  { id: "cades_fps_mission",       label: "Cades FPS mission",               lightGain: 40, darkGain: 0 },

  /* ─── GALACTIC DANCE CONTRIBUTIONS ─── */
  // See docs/design/THE_GALACTIC_DANCE.md — the factions weave into the
  // Light/Dark meter through acts of witnessing. The Voltari in particular
  // are aligned with Light because their whole philosophy is "witness
  // without stopping" — they give gently, they do not take.
  {
    id: "voltari_first_contact",
    label: "Voltari first contact established",
    lightGain: 120,
    darkGain: 0,
    livingUniverseNote: "A galaxy-scale witness has acknowledged the new kind.",
  },
  {
    id: "voltari_vote_generous",
    label: "Voltari community vote — sent a word we wanted to give",
    lightGain: 150,
    darkGain: 0,
    livingUniverseNote: "The ~37% of the community that picked 'give' — the Voltari have been looking for this quality for a very long time.",
  },
  {
    id: "voltari_vote_selfish",
    label: "Voltari community vote — sent a word we wanted to receive",
    lightGain: 30,
    darkGain: 15,
    livingUniverseNote: "The Voltari still respond, but the probability model shifts half a step.",
  },
  {
    id: "voltari_witness_point_decoded",
    label: "Decoded a Voltari Witness Point",
    lightGain: 25,
    darkGain: 0,
  },
  {
    id: "engineer_resonance_node_built",
    label: "Engineer built a Voltari Resonance Node",
    lightGain: 50,
    darkGain: 0,
  },
  // New Atarion / post-Fall humans — the surviving kind.
  {
    id: "new_atarion_problem_solved_no_reward",
    label: "Solved a New Atarion problem nobody else would take (no reward)",
    lightGain: 100,
    darkGain: 0,
    livingUniverseNote: "Mirren Hale's grandmother wrote the original journal. Its true inheritor is the one who takes responsibility without being asked.",
  },
  {
    id: "bridge_project_supported_safely",
    label: "Supported the Bridge Project without reckless experimentation",
    lightGain: 40,
    darkGain: 0,
  },
  {
    id: "bridge_project_reckless",
    label: "Pushed Bridge Project trials that harmed a patient",
    lightGain: 0,
    darkGain: 60,
  },
  // Thaloria — the quiet long mourning.
  {
    id: "hierophant_name_witnessed",
    label: "Witnessed the Hierophant write a name back into the record",
    lightGain: 30,
    darkGain: 0,
    livingUniverseNote: "One name. 347,000 remain. The Shadow Tongue edits quickly; the Hierophant writes slowly. This is the disadvantage AND the advantage.",
  },
  {
    id: "hierophant_ceremony_completed",
    label: "Shared the Hierophant's ceremony to completion",
    lightGain: 300,
    darkGain: 0,
    livingUniverseNote: "Third-highest Light Energy gain in the game.",
  },
  // Insurgency Remnant — the three factions.
  {
    id: "insurgency_remembrance_gift",
    label: "Gave the Remembrance a piece of Iron Lion history they didn't have",
    lightGain: 40,
    darkGain: 0,
  },
  {
    id: "insurgency_question_subscribed",
    label: "Subscribed to The Question's weekly broadcast",
    lightGain: 5,
    darkGain: 0,
  },
  // Syndicate of Death — transactional, not unholy.
  {
    id: "syndicate_fair_trade",
    label: "Traded fairly with the Syndicate of Death",
    lightGain: 10,
    darkGain: 10,
    livingUniverseNote: "A fair deal leaves both sides a little lighter and a little heavier.",
  },
  {
    id: "syndicate_betrayal_deal",
    label: "Broke a Syndicate deal after signing it",
    lightGain: 0,
    darkGain: 80,
  },
  // Awakened Clones — the Oracle's living argument.
  {
    id: "clone_oracle_fragment_received",
    label: "Received the Oracle's lost fragment from the Clone collective",
    lightGain: 60,
    darkGain: 0,
    livingUniverseNote: "A memory the Oracle never got to hear is finally delivered to his intended audience.",
  },
  {
    id: "remembrance_clone_introduction",
    label: "Introduced Orin Fell to Binath-VII",
    lightGain: 75,
    darkGain: 0,
    livingUniverseNote: "The longest NPC-to-NPC dialogue in the game.",
  },
];

/** Map of contribution rule id → rule for O(1) lookup. */
export const CONTRIBUTION_INDEX: Record<string, ContributionRule> =
  Object.fromEntries(CONTRIBUTION_TABLE.map(rule => [rule.id, rule]));

/* ─── STATE TRANSITIONS ─── */

export interface ContributionResult {
  state: DischordianCycleState;
  previousPhase: DischordianPhase;
  phaseChanged: boolean;
  /** True if the Light/Dark meter is currently frozen (see Silence event). */
  frozen: boolean;
  appliedRule: ContributionRule | null;
}

/**
 * Apply a contribution to the Light/Dark meter. Pure — returns a NEW state.
 * If the meter is frozen (Silence of Two Witnesses) the contribution is
 * recorded but energies are unchanged.
 */
export function applyContribution(
  state: DischordianCycleState,
  ruleId: string,
  nowIso: string,
): ContributionResult {
  const rule = CONTRIBUTION_INDEX[ruleId] ?? null;
  const previousPhase = state.phase;
  const frozen = isFrozen(state, nowIso);

  if (!rule) {
    return { state, previousPhase, phaseChanged: false, frozen, appliedRule: null };
  }

  if (frozen) {
    return { state, previousPhase, phaseChanged: false, frozen, appliedRule: rule };
  }

  const nextLight = Math.max(0, state.lightEnergy + rule.lightGain);
  const nextDark = Math.max(0, state.darkEnergy + rule.darkGain);

  // Special trigger: trade_reclaim_sector records a reclamation event.
  const nextReclamation = rule.id === "trade_reclaim_sector" ? nowIso : state.lastReclamationEvent;

  // Vortex proximity only grows. It responds primarily to Dark Energy
  // accumulation once Dark > Light. Tiny drip otherwise.
  let vortexDelta = 0;
  if (nextDark > nextLight) {
    vortexDelta = Math.min(5, Math.floor((nextDark - nextLight) / 50_000));
  }
  const nextVortex = Math.min(100, state.vortexProximity + vortexDelta);

  const nextState: DischordianCycleState = {
    ...state,
    lightEnergy: nextLight,
    darkEnergy: nextDark,
    vortexProximity: nextVortex,
    lastReclamationEvent: nextReclamation,
    phase: derivePhase(nextLight, nextDark, nextVortex),
  };

  return {
    state: nextState,
    previousPhase,
    phaseChanged: nextState.phase !== previousPhase,
    frozen: false,
    appliedRule: rule,
  };
}

/** Derive the narrative phase from the three scalars. */
export function derivePhase(
  light: number,
  dark: number,
  vortex: number,
): DischordianPhase {
  if (vortex >= 100) return "consumed";
  if (dark === 0 && light === 0) return "dormant";
  if (dark > 0 && dark < 100_000 && light < 100_000) return "stirring";
  if (dark > light) return "besieged";
  if (light >= 700_000) return "holding";
  if (light > dark) return "reclaiming";
  return "stirring";
}

/** The "Silence of Two Witnesses" freezes the meter for 24 real-time hours. */
export function freezeForSilenceOfWitnesses(
  state: DischordianCycleState,
  nowIso: string,
  durationMs: number = 24 * 60 * 60 * 1000,
): DischordianCycleState {
  const freezeUntil = new Date(new Date(nowIso).getTime() + durationMs).toISOString();
  return { ...state, silenceOfWitnessesFreezeUntil: freezeUntil };
}

export function isFrozen(state: DischordianCycleState, nowIso: string): boolean {
  if (!state.silenceOfWitnessesFreezeUntil) return false;
  return new Date(state.silenceOfWitnessesFreezeUntil).getTime() > new Date(nowIso).getTime();
}

/* ─── LIVING UNIVERSE BROADCAST NOTES ─── */

/**
 * Short in-universe blurbs for the Antiquarian's Journal and the
 * Governance Hub broadcast feed. Spec from PART 14 §14.2.
 */
export const LIVING_UNIVERSE_BROADCASTS: Record<string, string> = {
  two_witnesses_remember:
    "Two Witnesses have remembered each other. An eight-name shard of the Memorial Corridor has lit.",
  silence_of_two_witnesses:
    "Something unprecedented has occurred aboard Ark 1047. Two Witnesses have remembered each other. The Light and the Dark will not move for a day.",
  two_witnesses_meet:
    "The Memorial Corridor has filled. A Potential has forgiven both. The plaques remember what the Shadow Tongue tried to eat.",
  two_witnesses_refuse_both:
    "A Potential refused to forgive. Dr. Lyra Vox has spoken from the substrate for the first time in seventeen thousand years.",
  sector_reclaimed:
    "A sector has been pulled back from the dimming. The gold border on its map tile is the community's signature.",
  bulb_dims:
    "The Bulb Dims. A sector has gone quiet, and the ones around it are beginning to flicker.",
  vortex_drum:
    "Somewhere in the deep sky, a drum. Only the players who've read enough of the lore can hear it yet.",

  /* ─── GALACTIC DANCE BROADCASTS ─── */
  voltari_awake:
    "A word has arrived through the Dreamer's Shield during a 37-second failure. One syllable, 47 petabytes, every being who looks at it understands it immediately. AWAKE.",
  voltari_remember:
    "Forty-eight hours later, a second word appears on the Eyes' surveillance screens. Same encoding, different source. REMEMBER.",
  voltari_before:
    "A third word hides in two months of white noise nobody was listening to. BEFORE.",
  voltari_you:
    "The fourth word arrives only for communities that have earned it. The sentence assembles: AWAKE. REMEMBER. BEFORE. YOU.",
  voltari_coordinate:
    "The Voltari have shared a coordinate for the first time in five Ages. They do not direct. They have begun directing. Something has changed in their assessment of the new kind.",
  new_atarion_contact:
    "The Council of Survivors has opened diplomatic channels with Ark 1047. Mirren Hale is tired, precise, and unwilling to gloss things over.",
  hierophant_speaks:
    "The Thalorian Hierophant has spoken publicly for the first time in three thousand years. He said: 'Ask the Voltari what they wrote.'",
  clone_collective_welcome:
    "General Binath-VII of the Awakened Clones has welcomed the first Potential into her sector. The conversation began with: 'The Collector made us both without asking. That is a place to start.'",
  syndicate_7_omega:
    "The Word and the Silence have offered 7-Omega records for something the Ark is carrying without knowing. The Human has been protecting a Syndicate memory imprint in the substrate layer this whole time.",
};

/* ─── COMMUNITY MILESTONE CHECKS ─── */

export interface MilestoneCheckResult {
  milestone: string | null;
  broadcast: string | null;
}

export function checkMilestones(
  prev: DischordianCycleState,
  next: DischordianCycleState,
): MilestoneCheckResult {
  // Light energy crossing into new bracket.
  if (prev.lightEnergy < 700_000 && next.lightEnergy >= 700_000) {
    return { milestone: "light_warming", broadcast: "The bulb warms." };
  }
  if (prev.lightEnergy < 900_000 && next.lightEnergy >= 900_000) {
    return { milestone: "long_night_loses", broadcast: LIGHT_ENERGY_TEXT.under900k };
  }

  // Dark energy milestones.
  if (prev.darkEnergy < 500_000 && next.darkEnergy >= 500_000) {
    return { milestone: "vortex_hums", broadcast: DARK_ENERGY_TEXT.under500k };
  }
  if (prev.darkEnergy < 900_000 && next.darkEnergy >= 900_000) {
    return { milestone: "bulb_dims", broadcast: LIVING_UNIVERSE_BROADCASTS.bulb_dims };
  }

  // Vortex proximity milestones.
  if (prev.vortexProximity < 50 && next.vortexProximity >= 50) {
    return { milestone: "vortex_drum_heard", broadcast: LIVING_UNIVERSE_BROADCASTS.vortex_drum };
  }
  if (prev.vortexProximity < 100 && next.vortexProximity >= 100) {
    return { milestone: "vortex_arrived", broadcast: VORTEX_PROXIMITY_TEXT.at100 };
  }

  return { milestone: null, broadcast: null };
}
