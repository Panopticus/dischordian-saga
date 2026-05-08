// Companion scheduler (F13). Single owner for Elara + Human line playback.
// Priority queue with interruption, cooldown dedupe, flag gating, and
// speaker routing. Runtime consumers:
//   - CompanionHost reads `active` to render the current panel
//   - Any feature that wants to push a line calls `enqueue(lineId)`
//
// Zustand-less implementation; we use a tiny subscription bus instead so
// this module has zero external deps beyond the shared schema.

import {
  CompanionLine,
  CompanionSpeaker,
  lineGatePasses,
} from "@shared/companion";
import { ELARA_LINES } from "@shared/elaraLines";
import { HUMAN_LINES } from "@shared/humanLines";
import { LOCKED_DOOR_LINES } from "@shared/lockedDoorLines";

/* ─── Line registry ─── */

const LINE_REGISTRY: Map<string, CompanionLine> = new Map();

function registerLines(lines: readonly CompanionLine[]) {
  for (const line of lines) {
    if (LINE_REGISTRY.has(line.lineId) && process.env.NODE_ENV !== "production") {
      console.warn(`[companionScheduler] duplicate lineId: ${line.lineId}`);
    }
    LINE_REGISTRY.set(line.lineId, line);
  }
}

registerLines(ELARA_LINES);
registerLines(HUMAN_LINES);
registerLines(LOCKED_DOOR_LINES);

export function getCompanionLine(lineId: string): CompanionLine | undefined {
  return LINE_REGISTRY.get(lineId);
}

/* ─── Context for gate evaluation ─── */

export interface SchedulerContext {
  elaraStability: number;
  humanLight: number;
  flags: ReadonlySet<string>;
  act: number;
}

/* ─── Queue state ─── */

interface QueueEntry {
  line: CompanionLine;
  enqueueTime: number;
}

interface SchedulerState {
  active: CompanionLine | null;
  queue: QueueEntry[];
  /** Last-played timestamp per cooldownKey. */
  cooldowns: Map<string, number>;
  context: SchedulerContext;
}

const DEFAULT_COOLDOWN_MS = 30_000;

const state: SchedulerState = {
  active: null,
  queue: [],
  cooldowns: new Map(),
  context: {
    elaraStability: 10,
    humanLight: -20,
    flags: new Set<string>(),
    act: 0,
  },
};

/* ─── Subscriber bus ─── */

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  for (const fn of listeners) fn();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ─── Band-variant resolver ─── */

/**
 * When a caller passes a bare lineId with a "_*" suffix (see
 * lockedDoorLineId), expand it to the authored variant for the current
 * band — falls through lucid → fragmented → luminous for stability,
 * balanced → shadow → warm for light.
 */
function resolveBandedLineId(lineId: string): string {
  if (!lineId.endsWith("_*")) return lineId;
  const base = lineId.slice(0, -2);
  const { elaraStability, humanLight } = state.context;
  const elaraBand =
    elaraStability <= -30 ? "fragmented" : elaraStability >= 40 ? "luminous" : "lucid";
  const humanBand =
    humanLight <= -30 ? "shadow" : humanLight >= 40 ? "warm" : "balanced";
  // Try Elara band first, then Human band. Either may exist for the base.
  const candidates = [
    `${base}_${elaraBand}`,
    `${base}_${humanBand}`,
    `${base}_lucid`,
    `${base}_balanced`,
  ];
  for (const c of candidates) if (LINE_REGISTRY.has(c)) return c;
  return lineId;
}

/* ─── Public API ─── */

export function setContext(next: Partial<SchedulerContext>) {
  state.context = { ...state.context, ...next };
  // Flag changes can unblock queued lines; nothing else to do here.
  notify();
}

export function getActive(): CompanionLine | null {
  return state.active;
}

export function getContext(): SchedulerContext {
  return state.context;
}

/**
 * Enqueue a line by id. Resolves banded "_*" suffixes, drops the enqueue
 * if the line is on cooldown or gated out, preempts the active line when
 * priority is higher.
 */
export function enqueue(lineIdOrRef: string): boolean {
  const resolvedId = resolveBandedLineId(lineIdOrRef);
  const line = LINE_REGISTRY.get(resolvedId);
  if (!line) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[companionScheduler] unknown lineId: ${lineIdOrRef}`);
    }
    return false;
  }

  // Gate check.
  if (!lineGatePasses(line, state.context)) return false;

  // Cooldown check.
  if (line.cooldownKey) {
    const last = state.cooldowns.get(line.cooldownKey);
    if (last && Date.now() - last < DEFAULT_COOLDOWN_MS) return false;
  }

  // Priority preemption.
  if (state.active && line.priority > state.active.priority) {
    const preempted = state.active;
    state.active = null;
    // Re-queue the preempted line if it was interruptible.
    if (preempted.interruptible) {
      state.queue.unshift({ line: preempted, enqueueTime: Date.now() });
    }
  }

  if (state.active) {
    // Insert sorted by (priority desc, enqueueTime asc).
    const entry: QueueEntry = { line, enqueueTime: Date.now() };
    let inserted = false;
    for (let i = 0; i < state.queue.length; i++) {
      if (line.priority > state.queue[i].line.priority) {
        state.queue.splice(i, 0, entry);
        inserted = true;
        break;
      }
    }
    if (!inserted) state.queue.push(entry);
  } else {
    makeActive(line);
  }
  notify();
  return true;
}

function makeActive(line: CompanionLine) {
  state.active = line;
  if (line.cooldownKey) state.cooldowns.set(line.cooldownKey, Date.now());
}

/**
 * Advance: call this when the UI finishes the active line (auto timer
 * elapsed, player tap, etc.). Applies stability/light deltas and pops the
 * next queued line.
 */
export function dismiss(): void {
  const finished = state.active;
  if (!finished) return;

  // Apply deltas.
  if (finished.elaraStabilityDelta || finished.humanLightDelta) {
    state.context = {
      ...state.context,
      elaraStability: clamp(
        state.context.elaraStability + (finished.elaraStabilityDelta ?? 0),
        -100,
        100,
      ),
      humanLight: clamp(
        state.context.humanLight + (finished.humanLightDelta ?? 0),
        -100,
        100,
      ),
    };
  }

  state.active = null;
  // Pop next.
  while (state.queue.length > 0) {
    const next = state.queue.shift()!;
    if (lineGatePasses(next.line, state.context)) {
      makeActive(next.line);
      break;
    }
  }
  notify();
}

/** Clear the entire queue plus the active line. Used on room changes or
 *  when the player explicitly silences both companions. */
export function flush(): void {
  state.active = null;
  state.queue = [];
  notify();
}

/** Expose the most recent speaker for callers that need it without
 *  re-reading the line. */
export function activeSpeaker(): CompanionSpeaker | null {
  return state.active?.speaker ?? null;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

// Test-only reset.
export function __resetSchedulerForTests(): void {
  state.active = null;
  state.queue = [];
  state.cooldowns.clear();
  state.context = {
    elaraStability: 10,
    humanLight: -20,
    flags: new Set<string>(),
    act: 0,
  };
  listeners.clear();
}
