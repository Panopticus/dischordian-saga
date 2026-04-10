/* ═══════════════════════════════════════════════════════
   THE YIN/YANG NARRATOR SYSTEM — "The Witnessing"

   Spec from PART 1 of the Witnessing production plan.

   Two narrators — Elara and The Human — share the Ark.
   They move between rooms, they compete for the player's
   ear, they can be dismissed, and their reveals are gated
   by a shared trust ladder: neither can advance past the
   lower of the two bond scores. Forgiveness at the Two
   Witnesses Meet is the most important decision of Act 1.

   This module is pure data + pure helpers. All persistence
   lives in server/routers/narratorState.ts (see PART 13).
   ═══════════════════════════════════════════════════════ */

import type { RoomId } from "../client/src/game/livingArk";

/* ─── CORE IDENTIFIERS ─── */

export type NarratorId = "elara" | "human" | "lyra_vox";

/** The Trust Ladder tiers (spec §1.4). */
export type TrustTier = 0 | 20 | 40 | 60 | 80;

export const TRUST_TIER_NAMES: Record<TrustTier, string> = {
  0: "Functional",
  20: "Professional",
  40: "Honest",
  60: "Vulnerable",
  80: "Devoted",
};

/** Derive the current trust tier from a bond score (0-100). */
export function getTrustTier(bond: number): TrustTier {
  if (bond >= 80) return 80;
  if (bond >= 60) return 60;
  if (bond >= 40) return 40;
  if (bond >= 20) return 20;
  return 0;
}

/**
 * The Shared Trust Ladder: neither narrator may advance a
 * reveal past the LOWER of the two current tiers. This is
 * the mechanical enforcement of "both must be ready."
 */
export function sharedRevealTier(elaraBond: number, humanBond: number): TrustTier {
  const elaraTier = getTrustTier(elaraBond);
  const humanTier = getTrustTier(humanBond);
  return Math.min(elaraTier, humanTier) as TrustTier;
}

/* ─── STATE ─── */

export interface NarratorState {
  /** Which narrator is currently speaking / visible in this room. */
  activeNarrator: NarratorId | "both";
  /** Elara's bond, 0-100. */
  elaraBond: number;
  /** The Human's bond, 0-100. */
  humanBond: number;
  /** Per-room narrator preference, driven by seeding + story flags. */
  roomPreferences: Partial<Record<RoomId, "elara" | "human" | "contested">>;
  /** History of dismissal actions (bounded — keep last 32). */
  dismissalHistory: DismissalEvent[];
  /** Locked to the LOWER of the two bonds' tiers (shared reveal ladder). */
  sharedRevealTier: TrustTier;
  /** Unlocks if player chooses "Forgive Neither" at Two Witnesses Meet. */
  lyraVoxUnlocked: boolean;
  /** Flag set when Two Witnesses Meet has been resolved. */
  twoWitnessesResolved: boolean;
  /** Outcome of the Two Witnesses Meet decision, null until resolved. */
  forgivenessOutcome: ForgivenessOutcome | null;
  /**
   * Current hard-dismissal state: if set, the named narrator is out
   * for the current room plus `roomsRemaining` subsequent rooms.
   */
  hardDismissal: HardDismissalState | null;
  /**
   * Soft-dismissal cooldowns keyed by narrator. Values are UTC
   * millisecond timestamps — the narrator may return after that time.
   */
  softDismissalUntil: Partial<Record<NarratorId, number>>;
  /** Silence Mode: both narrators are absent until this timestamp. */
  silenceUntil: number | null;
  /** Has the player ever triggered Silence Mode? Unlocks a Tome page. */
  silenceEverUsed: boolean;
  /** Story flags set by dialog choices (subset; full set lives server-side). */
  flags: Record<string, boolean>;
}

export interface DismissalEvent {
  /** UTC milliseconds. */
  timestamp: number;
  /** Which narrator was dismissed. */
  dismissed: NarratorId;
  /** Which method the player used. */
  reason: "give_me_space" | "prefer_other" | "silence";
  /** Bond lost by the dismissed narrator from this action. */
  bondPenalty: number;
  /** ID of the "return line" the narrator will speak on next appearance. */
  returnLineId: string;
}

export interface HardDismissalState {
  dismissed: NarratorId;
  /** Number of rooms remaining before the dismissed narrator may return. */
  roomsRemaining: number;
}

export type ForgivenessOutcome =
  | "forgive_both"
  | "forgive_elara_only"
  | "forgive_human_only"
  | "forgive_neither";

/* ─── CONSTANTS ─── */

export const DEFAULT_NARRATOR_STATE: NarratorState = {
  activeNarrator: "elara",
  elaraBond: 5,          // Elara is the first voice in the cryo bay, gets +5 free
  humanBond: 0,
  roomPreferences: {},
  dismissalHistory: [],
  sharedRevealTier: 0,
  lyraVoxUnlocked: false,
  twoWitnessesResolved: false,
  forgivenessOutcome: null,
  hardDismissal: null,
  softDismissalUntil: {},
  silenceUntil: null,
  silenceEverUsed: false,
  flags: {},
};

/** Max bond any narrator can accumulate. */
export const NARRATOR_BOND_MAX = 100;

/** Max elements kept in dismissalHistory to bound memory. */
export const DISMISSAL_HISTORY_MAX = 32;

/** Soft-dismiss cooldown: 10 real-time minutes (spec §1.3). */
export const SOFT_DISMISS_MS = 10 * 60 * 1000;

/** Silence Mode duration: 20 real-time minutes (spec §1.3). */
export const SILENCE_MS = 20 * 60 * 1000;

/** Hard-dismiss duration: this room + 2 subsequent rooms (spec §1.3). */
export const HARD_DISMISS_ROOMS = 3;

/* ─── ROOM SEEDING ─── */

/**
 * Canonical Room Narrator Seeding table (spec §1.2).
 * Maps every RoomId in the Ark to its primary/secondary narrator.
 * `contested: true` means both may appear at random — seeding
 * should fall back to {@link seedRoomPreference}.
 */
export interface RoomSeed {
  primary: NarratorId;
  secondary?: NarratorId;
  contested: boolean;
  /**
   * For contested rooms, bias in favour of the primary narrator.
   * 50 = 50/50, 60 = 60/40 primary/secondary, etc.
   */
  primaryBias: number;
  /** Some rooms force BOTH narrators to be present (Archives). */
  forceBoth?: boolean;
  /** Some rooms require both at a minimum tier before unlocking. */
  minSharedTier?: TrustTier;
}

export const ROOM_SEEDS: Partial<Record<RoomId, RoomSeed>> = {
  cryo_bay:         { primary: "elara", contested: false, primaryBias: 100 },
  bridge:           { primary: "elara", secondary: "human", contested: true, primaryBias: 50 },
  medical_bay:      { primary: "elara", contested: false, primaryBias: 100 },
  // Mess Hall is unmapped in livingArk RoomId union — tracked for future expansion.
  comms_array:      { primary: "human", contested: false, primaryBias: 100 },
  armory:           { primary: "human", secondary: "elara", contested: true, primaryBias: 60 },
  observation_deck: { primary: "elara", secondary: "human", contested: true, primaryBias: 50 },
  engineering:      { primary: "human", contested: false, primaryBias: 100 },
  cargo_bay:        { primary: "elara", secondary: "human", contested: true, primaryBias: 50, minSharedTier: 40 },
  archives:         { primary: "elara", secondary: "human", contested: false, primaryBias: 50, forceBoth: true },
  // Memorial Corridor: both, unlocks at shared trust 40+. Stored against trophy_room for now.
  trophy_room:      { primary: "elara", secondary: "human", contested: true, primaryBias: 50, minSharedTier: 40 },
  // Council / captain's quarters: both, Act 3 diplomacy.
  captains_quarters:{ primary: "elara", secondary: "human", contested: true, primaryBias: 50, minSharedTier: 60 },
  trade_hub:        { primary: "elara", secondary: "human", contested: true, primaryBias: 50 },
};

/* ─── MOBILE NARRATOR PLACEMENT ALGORITHM ─── */

export interface PlacementContext {
  roomId: RoomId;
  state: NarratorState;
  /** Deterministic per-visit random 0-1 (hash of userId+roomId+visitCount). */
  rng: number;
  /** Current in-game timestamp (for dismissal expiry checks). */
  now: number;
}

/**
 * Resolve which narrator speaks in this room on this visit.
 *
 * Priority order:
 *   1. Silence Mode active → neither.
 *   2. Hard dismissal active → the other narrator, always.
 *   3. Room force-both + minSharedTier met → both.
 *   4. Lyra Vox unlocked + room is Engineering → Lyra Vox.
 *   5. Soft dismissal → prefer the non-dismissed narrator.
 *   6. Bond-weighted affinity check vs. room seed bias.
 */
export function resolveNarratorForRoom(ctx: PlacementContext): NarratorId | "both" | "none" {
  const { roomId, state, rng, now } = ctx;

  // 1. Silence Mode — both narrators absent.
  if (state.silenceUntil && state.silenceUntil > now) return "none";

  // 2. Hard dismissal — flip to the other narrator.
  if (state.hardDismissal && state.hardDismissal.roomsRemaining > 0) {
    return state.hardDismissal.dismissed === "elara" ? "human" : "elara";
  }

  const seed = ROOM_SEEDS[roomId];
  if (!seed) {
    // Room has no explicit seeding; default to whichever narrator has
    // higher bond, tie-break to Elara.
    return state.elaraBond >= state.humanBond ? "elara" : "human";
  }

  // 3. Force-both rooms (Archives).
  const sharedTier = sharedRevealTier(state.elaraBond, state.humanBond);
  if (seed.forceBoth) {
    if (!seed.minSharedTier || sharedTier >= seed.minSharedTier) return "both";
  }

  // 4. Lyra Vox — only unlocks in Engineering and only after Forgive Neither.
  if (roomId === "engineering" && state.lyraVoxUnlocked) return "lyra_vox";

  // Some rooms are locked until shared tier is reached.
  if (seed.minSharedTier && sharedTier < seed.minSharedTier) {
    // Fall through to primary narrator alone — the special "both" state is
    // gated behind trust.
  }

  // 5. Soft dismissal — prefer the non-dismissed narrator.
  const elaraSoftUntil = state.softDismissalUntil.elara ?? 0;
  const humanSoftUntil = state.softDismissalUntil.human ?? 0;
  const elaraSoftActive = elaraSoftUntil > now;
  const humanSoftActive = humanSoftUntil > now;
  if (elaraSoftActive && !humanSoftActive) return "human";
  if (humanSoftActive && !elaraSoftActive) return "elara";

  // 6. Bond-weighted affinity.
  if (!seed.contested) return seed.primary;

  // Contested: weight by seed bias, then nudge by bond differential.
  const bondDiff = state.elaraBond - state.humanBond; // positive = elara stronger
  const elaraBias = seed.primary === "elara" ? seed.primaryBias : 100 - seed.primaryBias;
  const adjustedElaraBias = Math.max(5, Math.min(95, elaraBias + bondDiff / 4));
  return rng * 100 < adjustedElaraBias ? "elara" : "human";
}

/**
 * Initial seeding of `state.roomPreferences` on first Ark boot.
 * Rooms without a contested seed resolve to the primary deterministically.
 */
export function seedRoomPreferences(): Partial<Record<RoomId, "elara" | "human" | "contested">> {
  const prefs: Partial<Record<RoomId, "elara" | "human" | "contested">> = {};
  for (const [room, seed] of Object.entries(ROOM_SEEDS) as [RoomId, RoomSeed][]) {
    if (seed.contested) prefs[room] = "contested";
    else if (seed.primary !== "lyra_vox") prefs[room] = seed.primary;
  }
  return prefs;
}

/* ─── DISMISSAL WHEEL ─── */

export type DismissalMethod = "give_me_space" | "prefer_other" | "silence";

export interface DismissalResult {
  state: NarratorState;
  /** The ID of the line the dismissed narrator will say on their return. */
  returnLineId: string;
}

/**
 * Apply a dismissal action to narrator state. Returns a NEW state —
 * does not mutate input. (Pure helper, safe to use in tests.)
 */
export function dismissNarrator(
  state: NarratorState,
  target: NarratorId,
  method: DismissalMethod,
  now: number,
): DismissalResult {
  const next: NarratorState = {
    ...state,
    softDismissalUntil: { ...state.softDismissalUntil },
    flags: { ...state.flags },
    dismissalHistory: [...state.dismissalHistory],
  };

  let bondPenalty = 0;
  let returnLineId = "return_default";

  switch (method) {
    case "give_me_space": {
      bondPenalty = 2;
      next.softDismissalUntil[target] = now + SOFT_DISMISS_MS;
      returnLineId = target === "elara" ? "elara_return_soft" : "human_return_soft";
      break;
    }
    case "prefer_other": {
      bondPenalty = 5;
      // Hard dismissal: this room + 2 subsequent rooms.
      next.hardDismissal = { dismissed: target, roomsRemaining: HARD_DISMISS_ROOMS };
      // Summoned (the OTHER narrator) gets +3 bond, awareness line set via flag.
      if (target === "elara") {
        next.humanBond = clampBond(next.humanBond + 3);
        next.flags.human_summoned_awareness = true;
      } else if (target === "human") {
        next.elaraBond = clampBond(next.elaraBond + 3);
        next.flags.elara_summoned_awareness = true;
      }
      returnLineId = target === "elara" ? "elara_return_hard" : "human_return_hard";
      break;
    }
    case "silence": {
      bondPenalty = 3;
      next.silenceUntil = now + SILENCE_MS;
      next.silenceEverUsed = true;
      returnLineId = "silence_return";
      // Silence Mode hits BOTH narrators; this branch also penalises the other.
      const other: NarratorId = target === "elara" ? "human" : "elara";
      if (other === "elara") next.elaraBond = clampBond(next.elaraBond - bondPenalty);
      else next.humanBond = clampBond(next.humanBond - bondPenalty);
      break;
    }
  }

  if (target === "elara") next.elaraBond = clampBond(next.elaraBond - bondPenalty);
  else if (target === "human") next.humanBond = clampBond(next.humanBond - bondPenalty);

  next.sharedRevealTier = sharedRevealTier(next.elaraBond, next.humanBond);

  next.dismissalHistory.push({
    timestamp: now,
    dismissed: target,
    reason: method,
    bondPenalty,
    returnLineId,
  });
  if (next.dismissalHistory.length > DISMISSAL_HISTORY_MAX) {
    next.dismissalHistory.splice(0, next.dismissalHistory.length - DISMISSAL_HISTORY_MAX);
  }

  return { state: next, returnLineId };
}

/* ─── BOND MUTATIONS ─── */

export function clampBond(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(NARRATOR_BOND_MAX, Math.round(value)));
}

export interface BondDelta {
  narrator: NarratorId;
  delta: number;
  /** Short tag describing why — "prelude_cryo_thanks", "c4_tribunal", etc. */
  source: string;
}

export function applyBondDelta(state: NarratorState, change: BondDelta): NarratorState {
  const next: NarratorState = { ...state, flags: { ...state.flags } };
  if (change.narrator === "elara") next.elaraBond = clampBond(next.elaraBond + change.delta);
  else if (change.narrator === "human") next.humanBond = clampBond(next.humanBond + change.delta);
  next.sharedRevealTier = sharedRevealTier(next.elaraBond, next.humanBond);
  return next;
}

/* ─── ROOM TRANSITION ─── */

/**
 * Call once per room transition. Decrements hard-dismissal counters,
 * expires soft dismissals and silence mode if their timers have passed.
 */
export function advanceRoomTransition(state: NarratorState, now: number): NarratorState {
  const next: NarratorState = {
    ...state,
    softDismissalUntil: { ...state.softDismissalUntil },
  };

  if (next.hardDismissal) {
    const remaining = next.hardDismissal.roomsRemaining - 1;
    next.hardDismissal = remaining > 0
      ? { ...next.hardDismissal, roomsRemaining: remaining }
      : null;
  }

  for (const key of Object.keys(next.softDismissalUntil) as NarratorId[]) {
    const until = next.softDismissalUntil[key] ?? 0;
    if (until <= now) delete next.softDismissalUntil[key];
  }

  if (next.silenceUntil && next.silenceUntil <= now) next.silenceUntil = null;

  return next;
}

/* ─── FORGIVENESS (TWO WITNESSES MEET) ─── */

export interface ForgivenessResult {
  state: NarratorState;
  lightEnergyDelta: number;
  darkEnergyDelta: number;
  unlocks: string[];
}

/**
 * Resolve the Two Witnesses Meet decision. This is the game's
 * emotional peak (spec §1.4, Trust Tier 5).
 */
export function resolveTwoWitnessesMeet(
  state: NarratorState,
  outcome: ForgivenessOutcome,
): ForgivenessResult {
  const next: NarratorState = { ...state, flags: { ...state.flags } };
  next.twoWitnessesResolved = true;
  next.forgivenessOutcome = outcome;

  const unlocks: string[] = [];
  let lightEnergyDelta = 0;
  let darkEnergyDelta = 0;

  switch (outcome) {
    case "forgive_both": {
      unlocks.push("memorial_corridor_full", "elara_legendary_summon", "human_legendary_summon");
      next.flags.two_witnesses_forgive_both = true;
      lightEnergyDelta = 200;
      break;
    }
    case "forgive_elara_only": {
      next.humanBond = clampBond(Math.min(next.humanBond, 65));
      next.flags.human_hardened = true;
      unlocks.push("elara_legendary_summon");
      lightEnergyDelta = 50;
      darkEnergyDelta = 25;
      break;
    }
    case "forgive_human_only": {
      next.elaraBond = clampBond(Math.min(next.elaraBond, 65));
      next.flags.elara_quieted = true;
      unlocks.push("human_legendary_summon");
      lightEnergyDelta = 50;
      darkEnergyDelta = 25;
      break;
    }
    case "forgive_neither": {
      next.elaraBond = 40;
      next.humanBond = 40;
      next.lyraVoxUnlocked = true;
      next.flags.lyra_vox_substrate_speaks = true;
      unlocks.push("lyra_vox_narrator");
      darkEnergyDelta = 100;
      lightEnergyDelta = -100;
      break;
    }
  }

  next.sharedRevealTier = sharedRevealTier(next.elaraBond, next.humanBond);

  return { state: next, lightEnergyDelta, darkEnergyDelta, unlocks };
}

/* ─── TRUST GATING ─── */

/**
 * Can a reveal at `requestedTier` be played for this narrator?
 * Enforces the Shared Trust Ladder — neither narrator may advance
 * past the lower of the two bonds.
 */
export function canAdvanceReveal(
  state: NarratorState,
  narrator: NarratorId,
  requestedTier: TrustTier,
): boolean {
  if (narrator === "lyra_vox") return state.lyraVoxUnlocked;
  const narratorBond = narrator === "elara" ? state.elaraBond : state.humanBond;
  const narratorTier = getTrustTier(narratorBond);
  if (narratorTier < requestedTier) return false;
  // Shared ladder: cannot advance past the lower-tiered narrator.
  return state.sharedRevealTier >= requestedTier;
}

/* ─── LIVING UNIVERSE EVENT TRIGGERS ─── */

export type NarratorLivingUniverseEvent =
  | "two_witnesses_remember"      // shared trust 40 — Memorial Corridor unlocks
  | "silence_of_two_witnesses"    // shared trust 60 — 30 min silence
  | "two_witnesses_meet";         // shared trust 80 — forgiveness choice

/**
 * Detect which Living Universe beat (if any) is unlocked by the most
 * recent bond change. Caller should emit the matching ripple event.
 */
export function detectLivingUniverseBeat(
  prev: NarratorState,
  next: NarratorState,
): NarratorLivingUniverseEvent | null {
  const prevTier = prev.sharedRevealTier;
  const nextTier = next.sharedRevealTier;
  if (nextTier <= prevTier) return null;
  if (prevTier < 40 && nextTier >= 40) return "two_witnesses_remember";
  if (prevTier < 60 && nextTier >= 60) return "silence_of_two_witnesses";
  if (prevTier < 80 && nextTier >= 80) return "two_witnesses_meet";
  return null;
}
