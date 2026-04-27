// apps/shared/npcs/conversationRunner.ts
//
// Pure functional state machine for multi-turn NpcLine conversations —
// Phase 6 Infrastructure Deliverable 3a.
//
// The selector (apps/shared/npcs/selector.ts) returns a single line per
// query. Multi-turn conversations need to walk the graph: serve the
// current line, present its choices, advance on choice selection or
// auto-advance via nextLineId, apply the line's + chosen choice's side
// effects (trustDelta / setsFlags / setsPublicFlags / clearFlag), and
// terminate when no advance target exists.
//
// This module is pure: no I/O, no React, no router. The caller injects
// a LineLookup function so the runner doesn't depend on the bank
// aggregator. The router (Phase 6 Infrastructure Deliverable 5) wraps
// the runner with persistence + the React hook.

import type { NpcChoice, NpcKey, NpcLine } from "./types";

/**
 * Caller-provided lookup. Returns the line for an id, or null if the
 * id is unknown — runner treats unknown ids as conversation-end.
 */
export type LineLookup = (lineId: string) => NpcLine | null;

// --- State ----------------------------------------------------------------

/**
 * Cumulative side-effect ledger for a conversation. The router applies
 * these when the conversation ends (or per-line if the caller prefers
 * incremental application).
 */
export interface ConversationDelta {
  flagsSet: ReadonlyArray<string>;
  flagsCleared: ReadonlyArray<string>;
  publicFlagsSet: ReadonlyArray<string>;
  trustDelta: number;
}

export interface ConversationState {
  /** Owning NPC. */
  npcKey: NpcKey;
  /** Current line id; null when the conversation has ended. */
  currentLineId: string | null;
  /** Ordered list of line ids played, for history / cooldown writes. */
  history: ReadonlyArray<string>;
  /** Cumulative deltas (line side effects + chosen-choice side effects). */
  cumulative: ConversationDelta;
  /** True iff the conversation has terminated. */
  ended: boolean;
}

// --- Helpers --------------------------------------------------------------

function emptyDelta(): ConversationDelta {
  return {
    flagsSet: [],
    flagsCleared: [],
    publicFlagsSet: [],
    trustDelta: 0,
  };
}

function mergeDelta(
  base: ConversationDelta,
  add: Partial<ConversationDelta>,
): ConversationDelta {
  return {
    flagsSet: [
      ...base.flagsSet,
      ...(add.flagsSet ?? []),
    ],
    flagsCleared: [
      ...base.flagsCleared,
      ...(add.flagsCleared ?? []),
    ],
    publicFlagsSet: [
      ...base.publicFlagsSet,
      ...(add.publicFlagsSet ?? []),
    ],
    trustDelta: base.trustDelta + (add.trustDelta ?? 0),
  };
}

function lineDelta(line: NpcLine): Partial<ConversationDelta> {
  return {
    flagsSet: line.setsFlags ?? [],
    publicFlagsSet: line.setsPublicFlags ?? [],
    trustDelta: line.trustDelta ?? 0,
  };
}

function choiceDelta(choice: NpcChoice): Partial<ConversationDelta> {
  return {
    flagsSet: choice.setFlag ? [choice.setFlag] : [],
    flagsCleared: choice.clearFlag ? [choice.clearFlag] : [],
    publicFlagsSet: choice.publicFlag ? [choice.publicFlag] : [],
    trustDelta: choice.trustDelta ?? 0,
  };
}

// --- Lifecycle ------------------------------------------------------------

/**
 * Start a conversation at `entryLineId`. Applies the entry line's side
 * effects to the cumulative delta and pushes the entry line into history.
 *
 * If the entry line is missing from the lookup, returns an immediately-
 * ended state with no history (silent-fail contract — callers should
 * treat this as "no conversation available, move on").
 */
export function startConversation(
  npcKey: NpcKey,
  entryLineId: string,
  lookup: LineLookup,
): ConversationState {
  const line = lookup(entryLineId);
  if (!line) {
    return {
      npcKey,
      currentLineId: null,
      history: [],
      cumulative: emptyDelta(),
      ended: true,
    };
  }
  if (line.npcKey !== npcKey) {
    // Cross-NPC line in the same lookup — refuse to start; conversation
    // runners are scoped to a single NPC so cross-talk is not silently
    // allowed.
    return {
      npcKey,
      currentLineId: null,
      history: [],
      cumulative: emptyDelta(),
      ended: true,
    };
  }
  return {
    npcKey,
    currentLineId: entryLineId,
    history: [entryLineId],
    cumulative: mergeDelta(emptyDelta(), lineDelta(line)),
    ended: false,
  };
}

/** Returns the current line, or null if the conversation has ended. */
export function getCurrentLine(
  state: ConversationState,
  lookup: LineLookup,
): NpcLine | null {
  if (state.ended || state.currentLineId === null) return null;
  return lookup(state.currentLineId);
}

/**
 * Returns the visible choices on the current line. Choices are filtered
 * by reveal-stage / unlock-flag gates externally by the selector; this
 * function returns them as authored.
 */
export function getChoices(
  state: ConversationState,
  lookup: LineLookup,
): ReadonlyArray<NpcChoice> {
  const line = getCurrentLine(state, lookup);
  return line?.choices ?? [];
}

/**
 * Advance via a player-selected choice. Applies the choice's side effects
 * + the next line's side effects to the cumulative delta. Returns an
 * ended state if the chosen choice has no followUpLineId (terminal arc).
 *
 * Throws if the choiceId is not present on the current line — callers
 * must surface UI choices that actually exist; otherwise it's an
 * authoring bug worth catching loudly.
 */
export function advanceWithChoice(
  state: ConversationState,
  choiceId: string,
  lookup: LineLookup,
): ConversationState {
  if (state.ended || state.currentLineId === null) return state;
  const line = lookup(state.currentLineId);
  if (!line) {
    return { ...state, ended: true, currentLineId: null };
  }
  const choice = line.choices?.find((c) => c.id === choiceId);
  if (!choice) {
    throw new Error(
      `[conversationRunner] line ${line.lineId} has no choice with id ${choiceId}`,
    );
  }
  const afterChoice = mergeDelta(state.cumulative, choiceDelta(choice));
  const nextId = choice.followUpLineId;
  if (!nextId) {
    return {
      ...state,
      currentLineId: null,
      cumulative: afterChoice,
      ended: true,
    };
  }
  const nextLine = lookup(nextId);
  if (!nextLine) {
    return {
      ...state,
      currentLineId: null,
      cumulative: afterChoice,
      ended: true,
    };
  }
  return {
    ...state,
    currentLineId: nextId,
    history: [...state.history, nextId],
    cumulative: mergeDelta(afterChoice, lineDelta(nextLine)),
    ended: false,
  };
}

/**
 * Auto-advance via the current line's `nextLineId` (used when the line
 * has no choices but does have a follow-up). Returns an ended state if
 * the line has no nextLineId.
 */
export function advanceAuto(
  state: ConversationState,
  lookup: LineLookup,
): ConversationState {
  if (state.ended || state.currentLineId === null) return state;
  const line = lookup(state.currentLineId);
  if (!line) return { ...state, ended: true, currentLineId: null };
  // If the line has choices, autoadvance is an authoring error; runner
  // refuses to advance silently.
  if (line.choices && line.choices.length > 0) return state;
  const nextId = line.nextLineId;
  if (!nextId) {
    return { ...state, currentLineId: null, ended: true };
  }
  const nextLine = lookup(nextId);
  if (!nextLine) {
    return { ...state, currentLineId: null, ended: true };
  }
  return {
    ...state,
    currentLineId: nextId,
    history: [...state.history, nextId],
    cumulative: mergeDelta(state.cumulative, lineDelta(nextLine)),
    ended: false,
  };
}

/**
 * Terminate the conversation early (player closes the wheel before
 * choosing). Cumulative delta is preserved — the entry line's side
 * effects already fired and stay applied.
 */
export function endConversation(
  state: ConversationState,
): ConversationState {
  if (state.ended) return state;
  return { ...state, currentLineId: null, ended: true };
}
