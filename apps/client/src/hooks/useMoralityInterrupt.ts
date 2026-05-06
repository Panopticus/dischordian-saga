/* ═══════════════════════════════════════════════════════
   useMoralityInterrupt — paragon/renegade-style QTE state

   Plan §B4. ME2's most-copied feature: during a story scene,
   render an Order/Chaos sigil for ~2 s; clicking commits a
   moral act and reshapes the scene. If the player doesn't
   click, the moment passes uncommitted.

   The timing is a pure state machine (testable) wrapped in a
   React hook (composable). Visual rendering lives in
   MoralityInterruptOverlay.tsx.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";

export type MoralitySide = "order" | "chaos";

export type InterruptStatus =
  | "idle"
  | "armed" // window is open, awaiting commit / expire
  | "committed" // player picked a side
  | "expired"; // window closed without a commit

export interface InterruptState {
  status: InterruptStatus;
  /** ms left in the armed window. 0 once expired/committed. */
  remainingMs: number;
  /** which side the player committed (only valid when status === "committed"). */
  committedSide: MoralitySide | null;
}

export const INITIAL_INTERRUPT_STATE: InterruptState = {
  status: "idle",
  remainingMs: 0,
  committedSide: null,
};

/* ─── Pure transitions ─── */

export function armInterrupt(durationMs: number): InterruptState {
  return { status: "armed", remainingMs: Math.max(0, durationMs), committedSide: null };
}

export function tickInterrupt(state: InterruptState, deltaMs: number): InterruptState {
  if (state.status !== "armed") return state;
  const remaining = state.remainingMs - Math.max(0, deltaMs);
  if (remaining <= 0) {
    return { status: "expired", remainingMs: 0, committedSide: null };
  }
  return { ...state, remainingMs: remaining };
}

export function commitInterrupt(state: InterruptState, side: MoralitySide): InterruptState {
  if (state.status !== "armed") return state;
  return { status: "committed", remainingMs: 0, committedSide: side };
}

export function resetInterrupt(): InterruptState {
  return INITIAL_INTERRUPT_STATE;
}

/* ─── React hook ─── */

export interface UseMoralityInterruptOptions {
  /** How long the QTE window stays open. Default 2200 ms (the
   *  same window ME2 uses for its paragon/renegade prompts). */
  durationMs?: number;
  /** Fires when the player commits a side. */
  onCommit?: (side: MoralitySide) => void;
  /** Fires when the window closes uncommitted. */
  onExpire?: () => void;
  /** Internal-tick interval. Lower = smoother countdown but
   *  more renders. Default 50 ms (20 fps countdown) — fine for
   *  a 2 s window. */
  tickIntervalMs?: number;
}

export interface UseMoralityInterruptResult {
  state: InterruptState;
  /** True iff the QTE window is currently open. */
  isArmed: boolean;
  /** ms left in the window (0 when not armed). */
  remainingMs: number;
  /** Fraction of the window still remaining, 0..1. */
  remainingFraction: number;
  /** Open the QTE window. Idempotent if already armed. */
  arm: () => void;
  /** Player clicked a side. No-op if not armed. */
  commit: (side: MoralitySide) => void;
  /** Force-close (e.g. scene ended early). */
  reset: () => void;
}

export function useMoralityInterrupt(
  options: UseMoralityInterruptOptions = {},
): UseMoralityInterruptResult {
  const { durationMs = 2200, onCommit, onExpire, tickIntervalMs = 50 } = options;
  const [state, setState] = useState<InterruptState>(INITIAL_INTERRUPT_STATE);

  // Latest-callbacks ref so onCommit / onExpire can be inline
  // without resetting the timer on every render.
  const callbacksRef = useRef({ onCommit, onExpire });
  useEffect(() => {
    callbacksRef.current = { onCommit, onExpire };
  });

  // Drive the countdown while armed. setInterval here is fine —
  // small bounded work, scoped to a single dialog scene.
  useEffect(() => {
    if (state.status !== "armed") return;
    const interval = setInterval(() => {
      setState((prev) => {
        const next = tickInterrupt(prev, tickIntervalMs);
        if (prev.status === "armed" && next.status === "expired") {
          callbacksRef.current.onExpire?.();
        }
        return next;
      });
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [state.status, tickIntervalMs]);

  const arm = useCallback(() => {
    setState((prev) => (prev.status === "armed" ? prev : armInterrupt(durationMs)));
  }, [durationMs]);

  const commit = useCallback((side: MoralitySide) => {
    setState((prev) => {
      const next = commitInterrupt(prev, side);
      if (prev.status === "armed" && next.status === "committed") {
        callbacksRef.current.onCommit?.(side);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => setState(INITIAL_INTERRUPT_STATE), []);

  return {
    state,
    isArmed: state.status === "armed",
    remainingMs: state.remainingMs,
    remainingFraction: durationMs > 0 ? state.remainingMs / durationMs : 0,
    arm,
    commit,
    reset,
  };
}
