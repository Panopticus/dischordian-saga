/* ═══════════════════════════════════════════════════════
   WITNESSING STORE (Zustand) — §1.2, §1.3, §5

   Owns the three transient UI states that the Witnessing
   Narrative Proposal introduces:

     1. Which narrator is currently in the room's Narrator Slot.
     2. The active dismissal (§1.3 wheel) and its expiry.
     3. The currently-playing slideshow (§5), if any.

   None of this state needs server persistence — dismissals
   expire on wall clock, the slot is reseeded on every room
   entry, and slideshows are transient. Keeping it out of
   GameContext also means the React tree that reads these
   values only re-renders when this store changes, not on
   every global game state update.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import {
  applyDismissal,
  isDismissalActive,
  makeNarratorSeed,
  seedNarratorSlot,
  tickSwapRoom,
  type DismissalChoice,
  type DismissalState,
  type NarratorDominance,
  type NarratorId,
  type NarratorRoomId,
  type NarratorSlotSeedResult,
} from "@shared/mobileNarrator";
import type { SongSlideshowDef } from "@shared/songSlideshow";
import type { DanielCrossProphecy } from "@shared/danielCrossProphecies";
import { getSlideshow } from "@shared/songSlideshows";

/** Bookend prophecies for dream-mode playback. When set on the
 *  queue entry, SlideshowPlayerRoot threads them into SongSlideshow
 *  to render the opening + closing prophecy flashes around the body. */
export interface DreamPlaybackOptions {
  /** Stable id for the vision being delivered. Surfaced back via
   *  onDreamEnd so the caller knows which vision was just resolved. */
  visionId: string;
  bookend: { opening: DanielCrossProphecy; closing: DanielCrossProphecy };
  /** Disable the awaken affordance (First Visitation + capstone). */
  unawakenable?: boolean;
  /** Fires on dream end with full / awoken_early result. The
   *  prophecy queue uses this to decide whether to grant
   *  completion + Witness rewards. */
  onDreamEnd?: (result: { kind: "full" | "awoken_early"; visionId: string }) => void;
}

/* ─── SLIDESHOW QUEUE ENTRY ─── */

export interface SlideshowQueueEntry {
  def: SongSlideshowDef;
  /** Fired when the slideshow completes or the user skips past 15%. */
  onComplete?: () => void;
  /** Fired if the user explicitly closes the slideshow (X button). */
  onClose?: () => void;
  /** When set, render the slideshow in dream mode with bookends. */
  dream?: DreamPlaybackOptions;
}

/* ─── STORE SHAPE ─── */

interface WitnessingStore {
  /** Stable per-session nonce used as a seed input. */
  sessionNonce: number;
  /** Visit counts per room. Incremented each enterRoom call. */
  visitCounts: Partial<Record<NarratorRoomId, number>>;
  /** The room the player is currently in, if any. */
  currentRoomId: NarratorRoomId | null;
  /** The result of the most recent seedNarratorSlot call. */
  currentSlot: NarratorSlotSeedResult | null;
  /** The active dismissal, if any. */
  dismissal: DismissalState | null;
  /** Whether the "Potential Alone" tome page is unlocked (§1.3 silence choice). */
  potentialAloneUnlocked: boolean;
  /** The currently-playing slideshow, if any. */
  activeSlideshow: SlideshowQueueEntry | null;

  /* Actions */

  /** Reseed the slot for a room entry. Returns the new slot result. */
  enterRoom: (
    roomId: NarratorRoomId,
    bonds: { elaraBond: number; humanBond: number },
    flags?: ReadonlySet<string>,
    dominance?: NarratorDominance,
  ) => NarratorSlotSeedResult;
  /** Apply one of the three §1.3 dismissal choices. Returns bond deltas. */
  dismiss: (
    choice: DismissalChoice,
    bonds: { elaraBond: number; humanBond: number },
    flags?: ReadonlySet<string>,
    dominance?: NarratorDominance,
  ) => { elaraBond: number; humanBond: number; unlockPotentialAlonePage: boolean };
  /** Queue a slideshow for playback. */
  playSlideshow: (
    defOrId: SongSlideshowDef | string,
    opts?: {
      onComplete?: () => void;
      onClose?: () => void;
      dream?: DreamPlaybackOptions;
    },
  ) => boolean;
  /** Fire the active slideshow's onComplete callback and clear the queue. */
  completeActiveSlideshow: () => void;
  /** Fire the active slideshow's onClose callback and clear the queue. */
  closeActiveSlideshow: () => void;
  /** Reset all state — used by tests and "New Game". */
  reset: (opts?: { sessionNonce?: number }) => void;
}

/* ─── INITIAL STATE ─── */

function makeSessionNonce(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  return Math.floor(Math.random() * 0xffff_ffff);
}

export const useWitnessingStore = create<WitnessingStore>((set, get) => ({
  sessionNonce: makeSessionNonce(),
  visitCounts: {},
  currentRoomId: null,
  currentSlot: null,
  dismissal: null,
  potentialAloneUnlocked: false,
  activeSlideshow: null,

  enterRoom: (roomId, bonds, flags, dominance) => {
    const state = get();
    const previousVisits = state.visitCounts[roomId] ?? 0;
    const nextVisit = previousVisits + 1;

    // Tick the hard-dismissal swap counter if we're entering a new room.
    let dismissal = state.dismissal;
    if (dismissal && dismissal.choice === "rather_hear_other") {
      dismissal = tickSwapRoom(dismissal);
      if (!isDismissalActive(dismissal)) dismissal = null;
    } else if (dismissal && !isDismissalActive(dismissal)) {
      dismissal = null;
    }

    const slot = seedNarratorSlot({
      roomId,
      elaraBond: bonds.elaraBond,
      humanBond: bonds.humanBond,
      flags,
      dismissal,
      seed: makeNarratorSeed(roomId, state.sessionNonce, nextVisit),
      dominance,
    });

    set({
      currentRoomId: roomId,
      currentSlot: slot,
      dismissal,
      visitCounts: { ...state.visitCounts, [roomId]: nextVisit },
    });

    return slot;
  },

  dismiss: (choice, bonds, flags, dominance) => {
    const state = get();
    const presentNarrator: NarratorId | null = state.currentSlot?.narratorId ?? null;

    // Dismissal of nobody is a no-op.
    if (!presentNarrator && choice !== "both_out") {
      return { elaraBond: 0, humanBond: 0, unlockPotentialAlonePage: false };
    }

    // Lyra Vox cannot be dismissed — she is the ship itself. Ignore
    // any dismissal attempt on her.
    if (presentNarrator === "lyra_vox") {
      return { elaraBond: 0, humanBond: 0, unlockPotentialAlonePage: false };
    }

    // For the "silence" variant we don't care who's currently in the slot.
    const target: NarratorId = presentNarrator ?? "elara";
    const outcome = applyDismissal(choice, target);

    // Apply the new dismissal state and maybe unlock the tome page.
    set({
      dismissal: outcome.state,
      potentialAloneUnlocked:
        state.potentialAloneUnlocked || outcome.deltas.unlockPotentialAlonePage,
    });

    // Re-seed the slot in the current room to reflect the dismissal.
    if (state.currentRoomId) {
      const visits = state.visitCounts[state.currentRoomId] ?? 1;
      const slot = seedNarratorSlot({
        roomId: state.currentRoomId,
        elaraBond: bonds.elaraBond,
        humanBond: bonds.humanBond,
        flags,
        dismissal: outcome.state,
        seed: makeNarratorSeed(state.currentRoomId, state.sessionNonce, visits),
        dominance,
      });
      set({ currentSlot: slot });
    }

    return outcome.deltas;
  },

  playSlideshow: (defOrId, opts) => {
    const def: SongSlideshowDef | undefined =
      typeof defOrId === "string" ? getSlideshow(defOrId) : defOrId;
    if (!def) return false;
    set({
      activeSlideshow: {
        def,
        onComplete: opts?.onComplete,
        onClose: opts?.onClose,
        dream: opts?.dream,
      },
    });
    return true;
  },

  completeActiveSlideshow: () => {
    const active = get().activeSlideshow;
    set({ activeSlideshow: null });
    active?.onComplete?.();
  },

  closeActiveSlideshow: () => {
    const active = get().activeSlideshow;
    set({ activeSlideshow: null });
    active?.onClose?.();
  },

  reset: (opts) => {
    set({
      sessionNonce: opts?.sessionNonce ?? makeSessionNonce(),
      visitCounts: {},
      currentRoomId: null,
      currentSlot: null,
      dismissal: null,
      potentialAloneUnlocked: false,
      activeSlideshow: null,
    });
  },
}));

/* ─── SELECTORS ─── */

export const selectCurrentSlot = (s: WitnessingStore) => s.currentSlot;
export const selectActiveSlideshow = (s: WitnessingStore) => s.activeSlideshow;
export const selectDismissal = (s: WitnessingStore) => s.dismissal;
export const selectPotentialAloneUnlocked = (s: WitnessingStore) =>
  s.potentialAloneUnlocked;

/* ─── PLAIN-FUNCTION HELPERS (for non-React callers) ─── */

/**
 * Queue a slideshow from non-React code (e.g. narrative act callbacks).
 * Equivalent to:
 *   useWitnessingStore.getState().playSlideshow(id, opts)
 */
export function playSlideshow(
  defOrId: SongSlideshowDef | string,
  opts?: {
    onComplete?: () => void;
    onClose?: () => void;
    dream?: DreamPlaybackOptions;
  },
): boolean {
  return useWitnessingStore.getState().playSlideshow(defOrId, opts);
}
