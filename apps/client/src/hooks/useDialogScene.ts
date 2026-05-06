/* ═══════════════════════════════════════════════════════
   useDialogScene — sequence state for shot-reverse-shot
   dialogue scenes (banter, romance scenes, codex unlocks).

   Pure state machine — no framer-motion / portrait deps —
   so it can be unit tested in isolation and reused by any
   surface that wants to step through a list of scripted
   lines.

   Reference titles to match: KOTOR/ME conversation pacing
   (see plan §D1 in /root/.claude/plans/restart-in-plan-mode-
   wobbly-dawn.md).
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";

export interface DialogSceneLine<SpeakerId extends string = string> {
  speaker: SpeakerId;
  text: string;
  /** Optional VO id consumers may resolve to a manifest entry. */
  voId?: string;
}

export interface UseDialogSceneOptions<SpeakerId extends string> {
  lines: ReadonlyArray<DialogSceneLine<SpeakerId>>;
  /** Fires once after the player advances past the last line. */
  onComplete?: () => void;
}

export interface UseDialogSceneResult<SpeakerId extends string> {
  /** The line currently being delivered, or null if the scene
   *  is complete and onComplete has fired. */
  current: DialogSceneLine<SpeakerId> | null;
  /** 0-based index into `lines`, or `lines.length` once the
   *  scene has completed. */
  index: number;
  /** True once the player has advanced past the final line. */
  isComplete: boolean;
  /** Advance to the next line, or trigger completion if at the
   *  final line. Idempotent past completion. */
  advance: () => void;
  /** Reset back to line 0; useful for replays / banter-on-
   *  return-visit. */
  reset: () => void;
  /** Speakers that appear in the scene, in first-appearance
   *  order — handy for laying out portraits without rendering
   *  the whole sequence first. */
  speakers: ReadonlyArray<SpeakerId>;
  /** True if the named speaker is the one delivering the
   *  current line. False once the scene is complete. */
  isActiveSpeaker: (speaker: SpeakerId) => boolean;
}

/* ─── Pure helpers (testable without React) ─── */

/** First-appearance-ordered list of distinct speakers. */
export function dialogSceneSpeakers<SpeakerId extends string>(
  lines: ReadonlyArray<DialogSceneLine<SpeakerId>>,
): ReadonlyArray<SpeakerId> {
  const seen = new Set<SpeakerId>();
  const order: SpeakerId[] = [];
  for (const line of lines) {
    if (!seen.has(line.speaker)) {
      seen.add(line.speaker);
      order.push(line.speaker);
    }
  }
  return order;
}

/** Pure transition: returns the next index (clamped at lineCount).
 *  Idempotent past completion. */
export function dialogSceneAdvanceIndex(currentIndex: number, lineCount: number): number {
  if (currentIndex >= lineCount) return currentIndex;
  return currentIndex + 1;
}

/** Pure selector: the line at `index`, or null past the end. */
export function dialogSceneCurrent<SpeakerId extends string>(
  lines: ReadonlyArray<DialogSceneLine<SpeakerId>>,
  index: number,
): DialogSceneLine<SpeakerId> | null {
  if (index >= lines.length) return null;
  return lines[index] ?? null;
}

export function useDialogScene<SpeakerId extends string>(
  options: UseDialogSceneOptions<SpeakerId>,
): UseDialogSceneResult<SpeakerId> {
  const { lines, onComplete } = options;
  const [index, setIndex] = useState(0);

  const speakers = useMemo<ReadonlyArray<SpeakerId>>(
    () => dialogSceneSpeakers(lines),
    [lines],
  );

  const isComplete = index >= lines.length;
  const current = dialogSceneCurrent(lines, index);

  const advance = useCallback(() => {
    setIndex((prev) => {
      const next = dialogSceneAdvanceIndex(prev, lines.length);
      if (next >= lines.length && next !== prev && onComplete) onComplete();
      return next;
    });
  }, [lines.length, onComplete]);

  const reset = useCallback(() => setIndex(0), []);

  const isActiveSpeaker = useCallback(
    (speaker: SpeakerId) => current?.speaker === speaker,
    [current],
  );

  return { current, index, isComplete, advance, reset, speakers, isActiveSpeaker };
}
