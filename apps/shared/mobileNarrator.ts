/* ═══════════════════════════════════════════════════════
   THE MOBILE NARRATOR — Floating Yin/Yang Companion Slot

   Witnessing Narrative Proposal §1.2 — §1.3.

   Every room has a single "Narrator Slot". On room entry,
   one of (Elara | The Human) is seeded into the slot based
   on:

     1. Room AFFINITY (some rooms lean one way)
     2. Current BOND scores (higher bond → more likely)
     3. Story FLAGS (some moments force a specific narrator)
     4. A GENUINE random roll in contested rooms

   This module is PURE. It does not touch React. The client
   calls `seedNarratorSlot` on room entry and renders the
   result. Determinism comes from the `seed` argument, which
   the client can generate from (roomId + sessionId + visit#)
   so tests and replays are stable.

   Additionally: §1.3 dismissal primitives. `applyDismissal`
   is a pure function from (state, choice) → (state, deltas).
   ═══════════════════════════════════════════════════════ */

export type NarratorId = "elara" | "the_human";

/**
 * The set of rooms that can host the narrator slot.
 * Mirrors livingArk.ts RoomId so the client can pass it directly.
 */
export type NarratorRoomId =
  | "cryo_bay"
  | "medical_bay"
  | "bridge"
  | "archives"
  | "comms_array"
  | "observation_deck"
  | "armory"
  | "engineering"
  | "trade_hub"
  | "cargo_bay"
  | "trophy_room"
  | "captains_quarters"
  | "memorial_corridor" // unlocks at trust 40, §1.5
  | "pet_garden";       // unlocks after Prelude, §2.5

/* ─── PRELUDE REVEAL BEATS (§1.4) ─── */

/**
 * The four §1.4 Prelude reveal beats, indexed by the room they
 * fire in. Each beat flag is one of the `FORCING_FLAGS` keys so
 * a single lookup in `seedNarratorSlot` produces the right
 * narrator.
 *
 * The proposal ties these beats to cleaned-room count (1st, 3rd,
 * 5th, 7th cleaned room). The codebase does not model "cleaning"
 * as a first-class concept, so we use the first room-visit as
 * the equivalent trigger — a single-shot moment at visitCount=1
 * and never again.
 */
export const PRELUDE_BEAT_BY_ROOM: Record<NarratorRoomId, string | undefined> = {
  cryo_bay: "narrator_beat_1_interference",
  medical_bay: "narrator_beat_2_signal",
  comms_array: "narrator_beat_3_introduction",
  observation_deck: "narrator_beat_4_swap",
  // Rooms below do not have a Prelude beat.
  bridge: undefined,
  archives: undefined,
  armory: undefined,
  engineering: undefined,
  trade_hub: undefined,
  cargo_bay: undefined,
  trophy_room: undefined,
  captains_quarters: undefined,
  memorial_corridor: undefined,
  pet_garden: undefined,
};

/**
 * Given a room id and its visit count, return the set of active
 * Prelude beat flags to feed into `seedNarratorSlot` via the
 * `flags` argument. Returns `undefined` when no beat is active
 * so callers can keep the reference stable across renders.
 *
 * Beats only fire on the FIRST visit to the room (visitCount === 1).
 * On subsequent visits the set is empty and the slot reverts to
 * bond-and-affinity weighting.
 */
export function getActivePreludeBeats(
  roomId: NarratorRoomId,
  visitCount: number,
): ReadonlySet<string> | undefined {
  if (visitCount !== 1) return undefined;
  const beat = PRELUDE_BEAT_BY_ROOM[roomId];
  if (!beat) return undefined;
  return new Set<string>([beat]);
}

/* ─── §2.7 ENGINEER OPENER HOOK ─── */

/**
 * Context for narrative beats that depend on inventory / quest
 * state, not just room visit count.
 */
export interface EngineerHookContext {
  /** The §2.6 crew mission 3 reward — the burnt Seer's card. */
  burntCardFound: boolean;
  /**
   * Whether the Archives opener cutscene (§2.7 "Two Voices, One
   * Deck") has already played. Once true, the forcing flag stops
   * firing so the player doesn't keep getting the scripted line
   * on repeat visits.
   */
  openerPlayed: boolean;
}

/**
 * §2.7 Archives opener — forces The Human to appear in the slot
 * when the player walks into the Archives for the first time
 * carrying the burnt Seer's card. This is the "She means the
 * Engineer. He was my classmate." moment.
 *
 * Returns a Set containing `engineer_hook_active_opener` when
 * the conditions match, `undefined` otherwise. Kept as a
 * separate helper from `getActivePreludeBeats` because it depends
 * on inventory state, not just visit count.
 */
export function getActiveEngineerHook(
  roomId: NarratorRoomId,
  visitCount: number,
  ctx: EngineerHookContext,
): ReadonlySet<string> | undefined {
  if (roomId !== "archives") return undefined;
  if (visitCount !== 1) return undefined;
  if (!ctx.burntCardFound) return undefined;
  if (ctx.openerPlayed) return undefined;
  return new Set<string>(["engineer_hook_active_opener"]);
}

/**
 * Merge two optional flag sets into a single one. Used at the
 * call site to combine Prelude beats with the Engineer hook
 * without having to construct intermediate objects in React
 * render paths.
 *
 * Returns the original `a` or `b` reference when the other is
 * undefined, so memoized callers can keep stable references.
 */
export function mergeBeatFlags(
  a: ReadonlySet<string> | undefined,
  b: ReadonlySet<string> | undefined,
): ReadonlySet<string> | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  const merged = new Set<string>(a);
  for (const flag of b) merged.add(flag);
  return merged;
}

/* ─── ROOM ID BRIDGE ─── */

/**
 * Map a GameContext room id (e.g. "cryo-bay", "comms-array") to a
 * canonical NarratorRoomId (e.g. "cryo_bay", "comms_array"). Returns
 * null for rooms that are NOT part of the §1.2 narrator slot system
 * — many of GameContext's specialized rooms (forge-workshop,
 * antiquarian-library, shadow-vault, etc.) deliberately have no
 * narrator because they're mini-game venues, not ship rooms.
 *
 * The mapping is mostly `.replace(/-/g, "_")` with one legacy
 * exception: the Ark's cargo area is called `cargo-hold` in
 * GameContext but `cargo_bay` in the Witnessing Narrative
 * Proposal (§13.10) and the livingArk.ts RoomId union.
 *
 * Callers should treat a null return as "slot suppressed here."
 */
export function toNarratorRoomId(gameRoomId: string | null | undefined): NarratorRoomId | null {
  if (!gameRoomId) return null;
  switch (gameRoomId) {
    case "cryo-bay":          return "cryo_bay";
    case "medical-bay":       return "medical_bay";
    case "bridge":            return "bridge";
    case "archives":          return "archives";
    case "comms-array":       return "comms_array";
    case "observation-deck":  return "observation_deck";
    case "engineering":       return "engineering";
    case "armory":            return "armory";
    case "cargo-hold":        return "cargo_bay";
    case "captains-quarters": return "captains_quarters";
    // §2.5 pet garden + §1.5 memorial corridor + §6 trade hub +
    // trophy room aren't yet primary rooms in GameContext. When they
    // land, add them here. Until then the slot is simply suppressed.
    default:                  return null;
  }
}

/* ─── ROOM AFFINITY ─── */

/**
 * Per-room lean toward one narrator. Range is [-1, +1] where
 * negative favors Elara, positive favors The Human. Zero is
 * genuinely contested — the seed roll decides.
 *
 * Source: §1.2 + per-room tone from livingArk.ts ROOMS.
 */
export const ROOM_AFFINITY: Record<NarratorRoomId, number> = {
  // Elara-leaning (warm, political, reflective, healing)
  medical_bay: -0.6,
  bridge: -0.5,
  observation_deck: -0.6,
  trade_hub: -0.4,
  captains_quarters: -0.3,
  memorial_corridor: -0.3, // she weeps here; §1.5
  pet_garden: -0.4,

  // Human-leaning (investigation, signal, reactor, weapons)
  archives: 0.6,
  comms_array: 0.7,
  engineering: 0.5,
  armory: 0.4,

  // Contested
  cryo_bay: -0.1, // she was the first voice you heard — narrow lean
  cargo_bay: 0.1, // barely favors Human (sorting records)
  trophy_room: 0.0,
};

/* ─── SEED RESULT ─── */

export interface NarratorSlotSeedInput {
  roomId: NarratorRoomId;
  /** 0-100 bond with Elara. */
  elaraBond: number;
  /** 0-100 bond with The Human. */
  humanBond: number;
  /**
   * Active story flags. Some flags FORCE a specific narrator
   * regardless of affinity (e.g. a Prelude beat that only Elara
   * can deliver). See FORCING_FLAGS below.
   */
  flags?: ReadonlySet<string>;
  /**
   * Recent dismissal state. If the player just dismissed
   * Elara or The Human, they cannot appear in the slot
   * until the dismissal expires.
   */
  dismissal?: DismissalState | null;
  /**
   * A deterministic roll in [0, 1). The client generates
   * this from (roomId + sessionId + visit#) so the same
   * walk into the same room is stable.
   */
  seed: number;
  /**
   * Optional clock override for dismissal expiry comparisons.
   * Tests inject this; production uses `Date.now()` when omitted.
   */
  nowMs?: number;
}

export interface NarratorSlotSeedResult {
  /** Who is in the slot. `null` means silence mode. */
  narratorId: NarratorId | null;
  /** Why they ended up there (for telemetry, debug panel). */
  reason:
    | "forced_by_flag"
    | "silence_active"
    | "dismissed_elara"
    | "dismissed_the_human"
    | "weighted_roll";
  /** The weight each narrator had before the roll, for UI debug. */
  weights: { elara: number; the_human: number };
}

/* ─── FORCING FLAGS (§1.4 Reveal Arc) ─── */

/**
 * Flags that, if present, FORCE a specific narrator into the
 * slot regardless of bond or affinity. These are the Prelude
 * reveal beats and a few later cinematic moments. A value of
 * `"silence"` means neither narrator may appear — used for
 * the §1.5 Two Witnesses Meet 30-minute silence window.
 */
export const FORCING_FLAGS: Record<string, NarratorId | "silence"> = {
  // Prelude §1.4
  narrator_beat_1_interference: "elara",      // Cryo Bay — static under Elara
  narrator_beat_2_signal: "the_human",        // Medical Bay → Comms — Human cuts in
  narrator_beat_3_introduction: "the_human",  // Comms Array — Human formally introduces
  narrator_beat_4_swap: "the_human",          // Observation Deck — the Swap moment
  // Act 1 Archives opener
  engineer_hook_active_opener: "the_human",   // He was my classmate — §2.7
  // Two Witnesses set pieces (§1.5)
  two_witnesses_silence_phase: "silence",     // 30-minute mutual silence window
};

/* ─── DISMISSAL STATE (§1.3) ─── */

export type DismissalChoice =
  | "give_space"        // soft — -2 Bond, 10 min, returns wounded
  | "rather_hear_other" // hard — -5/+3, swap for 3 rooms
  | "both_out";         // silence — -3/-3, 20 min no narrator

export interface DismissalState {
  /** Who was dismissed. `null` = silence (both). */
  dismissedId: NarratorId | null;
  /** Which option was chosen. */
  choice: DismissalChoice;
  /** When the dismissal expires (epoch ms). */
  expiresAt: number;
  /** For hard dismissal, rooms remaining in the swap window. */
  swapRoomsRemaining?: number;
}

export interface DismissalOutcome {
  state: DismissalState;
  deltas: {
    elaraBond: number;
    humanBond: number;
    /** Set to true for the third option — plays the contemplative
     *  ambient track and unlocks the "Potential Alone" tome page. */
    unlockPotentialAlonePage: boolean;
  };
}

/** §1.3 — pure function from dismissal input to new state + bond deltas. */
export function applyDismissal(
  choice: DismissalChoice,
  presentNarrator: NarratorId,
  nowMs: number = Date.now(),
): DismissalOutcome {
  switch (choice) {
    case "give_space": {
      return {
        state: {
          dismissedId: presentNarrator,
          choice,
          expiresAt: nowMs + 10 * 60 * 1000,
        },
        deltas: {
          elaraBond: presentNarrator === "elara" ? -2 : 0,
          humanBond: presentNarrator === "the_human" ? -2 : 0,
          unlockPotentialAlonePage: false,
        },
      };
    }
    case "rather_hear_other": {
      return {
        state: {
          dismissedId: presentNarrator,
          choice,
          // Hard dismissal swaps for 3 rooms OR 15 min, whichever first.
          expiresAt: nowMs + 15 * 60 * 1000,
          swapRoomsRemaining: 3,
        },
        deltas: {
          elaraBond: presentNarrator === "elara" ? -5 : 3,
          humanBond: presentNarrator === "the_human" ? -5 : 3,
          unlockPotentialAlonePage: false,
        },
      };
    }
    case "both_out": {
      return {
        state: {
          dismissedId: null, // silence
          choice,
          expiresAt: nowMs + 20 * 60 * 1000,
        },
        deltas: {
          elaraBond: -3,
          humanBond: -3,
          unlockPotentialAlonePage: true,
        },
      };
    }
  }
}

/** Returns true if the dismissal is still in effect at `nowMs`. */
export function isDismissalActive(
  dismissal: DismissalState | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!dismissal) return false;
  if (dismissal.expiresAt <= nowMs) return false;
  // Hard dismissal also ends early if swapRoomsRemaining reaches 0.
  if (
    dismissal.choice === "rather_hear_other" &&
    (dismissal.swapRoomsRemaining ?? 0) <= 0
  ) {
    return false;
  }
  return true;
}

/**
 * Decrement the swap-rooms counter on a hard dismissal.
 * Call this each time the player enters a new room while
 * a "rather_hear_other" dismissal is active.
 */
export function tickSwapRoom(dismissal: DismissalState): DismissalState {
  if (dismissal.choice !== "rather_hear_other") return dismissal;
  return {
    ...dismissal,
    swapRoomsRemaining: Math.max(0, (dismissal.swapRoomsRemaining ?? 0) - 1),
  };
}

/* ─── SLOT SEEDING (the core function) ─── */

/**
 * Deterministically pick a narrator for the slot.
 *
 * Algorithm:
 *   1. If any forcing flag is set → return that narrator.
 *   2. If a dismissal is active and in silence mode → return null.
 *   3. If a dismissal is active and in hard-swap mode → return the
 *      opposite of the dismissed narrator.
 *   4. Otherwise, build a weighted roll out of:
 *        baseWeight(room affinity) + bondWeight(bond scores)
 *      and break ties by the `seed` value.
 */
export function seedNarratorSlot(
  input: NarratorSlotSeedInput,
): NarratorSlotSeedResult {
  const { roomId, elaraBond, humanBond, flags, dismissal, seed, nowMs } = input;
  const clock = nowMs ?? Date.now();

  // 1. Forcing flags. First match wins.
  if (flags) {
    for (const [flagId, forced] of Object.entries(FORCING_FLAGS)) {
      if (!flags.has(flagId)) continue;
      if (forced === "silence") {
        return {
          narratorId: null,
          reason: "forced_by_flag",
          weights: { elara: 0, the_human: 0 },
        };
      }
      return {
        narratorId: forced,
        reason: "forced_by_flag",
        weights: { elara: 0, the_human: 0 },
      };
    }
  }

  // 2. Silence mode.
  if (isDismissalActive(dismissal, clock) && dismissal && dismissal.dismissedId === null) {
    return {
      narratorId: null,
      reason: "silence_active",
      weights: { elara: 0, the_human: 0 },
    };
  }

  // 3. Hard-swap dismissal — force the opposite.
  if (
    isDismissalActive(dismissal, clock) &&
    dismissal &&
    dismissal.choice === "rather_hear_other"
  ) {
    const opposite: NarratorId =
      dismissal.dismissedId === "elara" ? "the_human" : "elara";
    return {
      narratorId: opposite,
      reason:
        dismissal.dismissedId === "elara" ? "dismissed_elara" : "dismissed_the_human",
      weights: { elara: 0, the_human: 0 },
    };
  }

  // 4. Weighted roll.
  // Base weight: [0.5, 0.5] nudged by room affinity in [-1, 1].
  const affinity = ROOM_AFFINITY[roomId] ?? 0;
  // Affinity magnitude maps to a max ±0.35 shift off the 0.5 baseline.
  let elaraWeight = 0.5 - affinity * 0.35;
  let humanWeight = 0.5 + affinity * 0.35;

  // Bond weight: normalize bonds into [0, 1] each, then nudge by up to ±0.25.
  const elaraBondN = clamp01(elaraBond / 100);
  const humanBondN = clamp01(humanBond / 100);
  const bondDiff = humanBondN - elaraBondN; // [-1, 1]
  elaraWeight -= bondDiff * 0.25;
  humanWeight += bondDiff * 0.25;

  // Dismissed narrator (soft dismissal) is temporarily suppressed.
  if (isDismissalActive(dismissal, clock) && dismissal && dismissal.choice === "give_space") {
    if (dismissal.dismissedId === "elara") elaraWeight = 0;
    if (dismissal.dismissedId === "the_human") humanWeight = 0;
  }

  elaraWeight = Math.max(0, elaraWeight);
  humanWeight = Math.max(0, humanWeight);
  const total = elaraWeight + humanWeight;

  // Degenerate case: both zero (e.g. soft dismissal on a room where the
  // remaining narrator's weight was also exactly zero). Fall back to
  // the non-dismissed narrator.
  if (total === 0) {
    const fallback: NarratorId =
      dismissal?.dismissedId === "elara" ? "the_human" : "elara";
    return {
      narratorId: fallback,
      reason: "weighted_roll",
      weights: { elara: 0, the_human: 0 },
    };
  }

  const elaraP = elaraWeight / total;
  const pick: NarratorId = seed < elaraP ? "elara" : "the_human";
  return {
    narratorId: pick,
    reason: "weighted_roll",
    weights: { elara: elaraWeight, the_human: humanWeight },
  };
}

/**
 * Generate a stable seed in [0, 1) from a roomId + session nonce + visit count.
 * Uses a simple xor-fold hash so tests can reproduce exact values.
 */
export function makeNarratorSeed(
  roomId: NarratorRoomId,
  sessionNonce: number,
  visitIndex: number,
): number {
  let h = 2166136261 >>> 0;
  const key = `${roomId}:${sessionNonce}:${visitIndex}`;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0) / 0x1_0000_0000;
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/* ─── BOND TIER GATING (§1.3 teeth) ─── */

export interface BondTierEffect {
  /** Bond ≤ this → effect active. */
  maxBond: number;
  narratorId: NarratorId;
  /** Human-readable explanation for tooltip. */
  description: string;
  /** Gates unlocked or locked at this tier. */
  locks: string[];
}

export const BOND_TIER_EFFECTS: readonly BondTierEffect[] = [
  {
    maxBond: 20,
    narratorId: "elara",
    description: "Elara goes clinical. No political cadence, no volunteered lore, no callbacks.",
    locks: ["elara_callbacks", "elara_volunteer_lore"],
  },
  {
    maxBond: 20,
    narratorId: "the_human",
    description: "The signal degrades to static. Single-sentence dialog. Chess bonus locked.",
    locks: ["human_chess_bonus", "human_archon_strategy_tree"],
  },
] as const;

export function getBondLocks(
  narratorId: NarratorId,
  bond: number,
): readonly string[] {
  const effect = BOND_TIER_EFFECTS.find(
    (e) => e.narratorId === narratorId && bond <= e.maxBond,
  );
  return effect?.locks ?? [];
}
