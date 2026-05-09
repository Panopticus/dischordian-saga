/**
 * Card-battle replay export — frame plan layer.
 *
 * audit/16 PR 36 (audit/15 finding Strm7 — Streamer persona).
 *
 * Pre-PR-36, the deterministic replay pipeline (replay.ts)
 * shipped match playback but had no export surface — streamers
 * who wanted to clip a match to MP4 had no path. The audit's
 * recommended fix was "ship replayExport.ts with an FFmpeg WASM
 * MP4 encoder."
 *
 * This module ships the **substrate** the audit named: the
 * encoder-agnostic frame plan. Every encoder (FFmpeg WASM,
 * server-side ffmpeg shell, PNG-zip fallback) reads against the
 * same shape: `FramePlan` → ordered `ExportFrame[]` → render
 * each `stateAfter` to a canvas → encode.
 *
 * The actual FFmpeg WASM dependency lands in a follow-up infra
 * PR; the substrate here is encoder-agnostic so the follow-up
 * is purely additive. See docs/design/REPLAY_MP4_EXPORT.md for
 * the full encoder-side implementation plan.
 */

import type { GameState } from "../types/GameState";
import type { Action } from "../types/Action";
import type { ReplayResult } from "./replay";

/** One frame in the export plan. The renderer reads `stateAfter`
 *  and produces a canvas snapshot; the encoder reads `durationMs`
 *  and `timeMs` to align frames in the output stream. */
export interface ExportFrame {
  /** Index of the action in the original action log. */
  stepIndex: number;
  /** Cumulative time in ms from the start of the replay.
   *  Monotonically increasing. */
  timeMs: number;
  /** How long this frame holds on screen before the next
   *  frame's `timeMs` arrives. Equal to the next frame's
   *  `timeMs - timeMs`; the final frame uses its own
   *  duration as a held-final cap. */
  durationMs: number;
  /** The state the renderer should draw for this frame.
   *  Comes straight from the replay's per-step
   *  `stateAfter`. */
  stateAfter: GameState;
  /** The action that produced this frame. The renderer can
   *  use this to surface a per-frame caption ("Player 2
   *  declares trial: confession"). */
  primaryAction: Action;
}

export interface FramePlan {
  /** True iff the underlying replay completed without
   *  errors AND was version-compatible. False short-circuits
   *  encoding — the encoder should refuse to produce an MP4
   *  for a broken / archived replay. */
  ok: boolean;
  matchId: string;
  rulesVersion: string;
  versionCompatible: boolean;
  /** Sum of every frame's `durationMs`. */
  totalDurationMs: number;
  frames: ExportFrame[];
}

/** Per-action duration heuristic (milliseconds). Different
 *  actions get different screen-time so the output reads
 *  naturally — a trial declaration is "weighty," an end-turn
 *  is a beat. See docs/design/REPLAY_MP4_EXPORT.md for the
 *  full table. */
export const DEFAULT_ACTION_DURATION_MS: Readonly<Record<string, number>> = {
  play_card: 1500,
  attack: 2000,
  declare_trial: 2500,
  resolve_trial: 2000,
  end_turn: 800,
  mulligan: 1000,
  finish_mulligan: 600,
  pass: 500,
  move: 800,
  replace_card: 700,
  bloodborn_spell: 1800,
  programmer_gift_choice: 1500,
  concede: 1500,
};

/** Fallback for action kinds not in the table. */
export const FALLBACK_ACTION_DURATION_MS = 1200;

/** Look up the duration for one action. Pure. */
export function durationForAction(action: Action): number {
  return DEFAULT_ACTION_DURATION_MS[action.kind] ?? FALLBACK_ACTION_DURATION_MS;
}

export interface PlanExportFramesOptions {
  /** Optional override for the per-action duration table.
   *  Useful for tests + future "fast-forward" / "extended"
   *  export modes. Missing keys fall back to the default
   *  table. */
  durationOverrides?: Readonly<Partial<Record<string, number>>>;
  /** Cap on the final frame's `durationMs` so the
   *  end-of-match frame doesn't hang for the rendered
   *  duration of "play_card" (1500ms). Defaults to 3000ms
   *  so the final state reads as "this is the result, hold
   *  on it for 3 seconds." */
  finalFrameDurationMs?: number;
}

/** Build the export frame plan for a completed replay.
 *
 *  Pure, deterministic — same `ReplayResult` always yields the
 *  same `FramePlan`. Empty when the replay had no successful
 *  steps, or when the replay was version-incompatible (the
 *  encoder must refuse archived replays).
 *
 *  Steps with errors are SKIPPED — they don't get a frame,
 *  but the timing of subsequent frames is unaffected. The
 *  rationale: if a stored replay has a corrupt action that
 *  the reducer rejected, rendering the prior state for an
 *  extra beat would suggest progress that didn't happen.
 *  Cleaner to drop and let the next frame land at its
 *  proper cumulative time. */
export function planExportFrames(
  result: ReplayResult,
  options: PlanExportFramesOptions = {},
): FramePlan {
  const finalCapMs = options.finalFrameDurationMs ?? 3000;
  const overrides = options.durationOverrides ?? {};

  if (!result.ok || !result.versionCompatible) {
    return {
      ok: false,
      matchId: extractMatchId(result),
      rulesVersion: result.steps[0]?.action ? "" : "",
      versionCompatible: result.versionCompatible,
      totalDurationMs: 0,
      frames: [],
    };
  }

  const frames: ExportFrame[] = [];
  let cumulativeMs = 0;
  for (const step of result.steps) {
    if (step.error) continue;
    const dur =
      overrides[step.action.kind] ??
      DEFAULT_ACTION_DURATION_MS[step.action.kind] ??
      FALLBACK_ACTION_DURATION_MS;
    frames.push({
      stepIndex: step.actionIndex,
      timeMs: cumulativeMs,
      durationMs: dur,
      stateAfter: step.stateAfter,
      primaryAction: step.action,
    });
    cumulativeMs += dur;
  }

  // Cap the final frame's hold so the export doesn't dangle.
  if (frames.length > 0) {
    const last = frames[frames.length - 1]!;
    if (last.durationMs > finalCapMs) {
      cumulativeMs -= last.durationMs - finalCapMs;
      last.durationMs = finalCapMs;
    }
  }

  return {
    ok: true,
    matchId: extractMatchId(result),
    rulesVersion: "",
    versionCompatible: true,
    totalDurationMs: cumulativeMs,
    frames,
  };
}

/** Convenience: pure summary the UI surfaces in the
 *  "Export Replay" modal — frame count + total duration in
 *  human-readable format. */
export function summarizeFramePlan(plan: FramePlan): {
  frameCount: number;
  totalSeconds: number;
  estimatedFileSizeMB: number;
} {
  // Empirical baseline: a 1920×1080 H.264 stream at 30fps
  // sits around 0.5 MB/sec for board-game UI (low motion,
  // mostly static frames between actions). Used purely as a
  // UI hint; the encoder produces the actual file.
  const totalSeconds = plan.totalDurationMs / 1000;
  return {
    frameCount: plan.frames.length,
    totalSeconds: Math.round(totalSeconds * 10) / 10,
    estimatedFileSizeMB: Math.round(totalSeconds * 0.5 * 10) / 10,
  };
}

/** Internal — extract a stable matchId for the plan. The
 *  ReplayResult shape doesn't carry the matchId on every
 *  field, so we read from the first state's metadata. */
function extractMatchId(result: ReplayResult): string {
  const initial = result.initialState as unknown as { matchId?: string };
  return initial?.matchId ?? "";
}
