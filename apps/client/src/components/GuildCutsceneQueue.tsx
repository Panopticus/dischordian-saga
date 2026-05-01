/* ═══════════════════════════════════════════════════════
   GuildCutsceneQueue — plays an ordered list of
   <GuildCutscenePlayer> triggers, transitioning to the
   next on each `onComplete`. The shape that the
   guildHall.upgradeTier and guildWars.createWar mutations
   return is `{ cutscenes: CutsceneTrigger[] }` (or a
   single `cutscene: CutsceneTrigger`); both feed cleanly
   into this component.

   Lighter than CutsceneOverlay's framer-motion stack —
   queue advancement is just index state, no animation
   coordination. Callers wrap us in their own modal /
   portal / motion overlay if they want richer presentation.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useState } from "react";
import type { CutsceneTrigger } from "@shared/expansionArt/guildCutsceneVoMap";
import { GuildCutscenePlayer } from "@/components/GuildCutscenePlayer";

export interface GuildCutsceneQueueProps {
  /** Triggers to play in order. Empty array → onComplete fires
   *  immediately (component renders nothing). */
  triggers: readonly CutsceneTrigger[];
  /** Fired after the last trigger's player completes. */
  onComplete?: () => void;
  /** Auto-start the first trigger on mount. Default true. */
  autoPlay?: boolean;
  /** Show skip + subtitle UI on each player. Default true. */
  chrome?: boolean;
  /** Optional className applied to each rendered player. */
  className?: string;
}

export function GuildCutsceneQueue({
  triggers,
  onComplete,
  autoPlay = true,
  chrome = true,
  className,
}: GuildCutsceneQueueProps) {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((i) => {
      const next = i + 1;
      if (next >= triggers.length) {
        onComplete?.();
      }
      return next;
    });
  }, [triggers.length, onComplete]);

  if (triggers.length === 0 || index >= triggers.length) return null;

  const trigger = triggers[index];
  return (
    <GuildCutscenePlayer
      // key forces a fresh <video> + <audio> mount per trigger so the
      // browser doesn't try to reuse the prior cutscene's media.
      key={`${trigger.csId}:${trigger.voLineId ?? ""}:${index}`}
      csId={trigger.csId}
      voLineId={trigger.voLineId}
      autoPlay={autoPlay}
      chrome={chrome}
      onComplete={advance}
      className={className}
    />
  );
}
