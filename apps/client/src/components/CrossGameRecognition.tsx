/**
 * CrossGameRecognition — drop-in display for cross-game canon
 * recognitions (#43).
 *
 * Pages drop this in next to a speaker (Elara, Antiquarian, Human,
 * etc.) to surface a recognition phrase when the player has done
 * something in Cades-FPS / Dead Man's Circuit that the canon should
 * acknowledge. The component:
 *
 *   - Loads the player's narrativeFlags on mount via the existing
 *     `crossGameThreads.status` endpoint (cheap; the data is also
 *     used by the threads page).
 *   - Picks the first eligible recognition for the speaker (via
 *     pure helpers in apps/shared/crossGameRecognition.ts).
 *   - Renders a compact "they remember" line with appropriate
 *     styling for the context (greeting / remembrance / warning /
 *     tease).
 *   - Renders nothing when no recognition fires — the consumer
 *     UI never has to gate on a non-empty result.
 *
 * For server-side use (e.g. baking recognitions into a tRPC query
 * payload), call `pickRecognitionFor` directly from the shared
 * module.
 */
import { useMemo } from "react";
import {
  pickRecognitionFor,
  type RecognitionSpeaker,
} from "@shared/crossGameRecognition";

export interface CrossGameRecognitionProps {
  /** Which speaker is asking. Determines which recognitions are
   *  eligible. */
  speaker: RecognitionSpeaker;
  /** Player's narrativeFlags map. Pass the same shape returned by
   *  `crossGameThreads.status` or `playerProfile.flags`. The
   *  component reads the `xgame_<beatId>` keys. */
  narrativeFlags: Record<string, boolean | undefined>;
  /** Optional className (positioning, sizing). */
  className?: string;
}

const CONTEXT_LABEL: Record<NonNullable<ReturnType<typeof pickRecognitionFor>>["context"] & string, string> = {
  greeting: "GREETING",
  remembrance: "REMEMBERED",
  warning: "WARNING",
  tease: "ECHO",
};

export function CrossGameRecognition({
  speaker,
  narrativeFlags,
  className,
}: CrossGameRecognitionProps) {
  const recognition = useMemo(
    () => pickRecognitionFor(narrativeFlags, speaker),
    [narrativeFlags, speaker],
  );
  if (!recognition) return null;

  const contextLabel = recognition.context
    ? CONTEXT_LABEL[recognition.context]
    : "RECOGNITION";

  return (
    <aside
      role="note"
      aria-label={`${speaker} cross-game recognition: ${contextLabel}`}
      className={`rounded border border-border/40 bg-card/30 px-3 py-2 ${
        className ?? ""
      }`}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {contextLabel}
        </span>
        <span className="text-[9px] text-muted-foreground/60">
          · cross-game canon
        </span>
      </div>
      <p className="mt-1 italic text-sm text-foreground/90">
        "{recognition.phrase}"
      </p>
    </aside>
  );
}
