/**
 * MindGameOverlay — timed 3-choice dialog beside a live chess
 * match. Default-on-timeout is silent. Surfaces ABOVE the board
 * but does not pause the chess clock — the conversation happens
 * WHILE the player is thinking about their move.
 *
 * Props:
 *   - cue: the MindGameCue fetched from the trigger detector
 *   - matchId + triggerId: used as a stable seed for the
 *     paired-quote citation so re-viewing the same cue shows
 *     the same pairing
 *   - timeoutMs: how long the player has before silent default
 *   - onChoice: called with the archetype the player picked
 *     (or "silent" on timeout)
 */
import { useEffect, useState } from "react";
import type { MindGameCue } from "@shared/tcg-core/story/chessMindGameCues";
import { assembleCuePrompt } from "@shared/tcg-core/story/chessMindGameCues";
import type { MindGameArchetype } from "@shared/chessMindGameTriggers";

export interface MindGameOverlayProps {
  cue: MindGameCue;
  matchId: string;
  timeoutMs?: number;
  onChoice: (archetype: MindGameArchetype, choiceId: string) => void;
}

const DEFAULT_TIMEOUT_MS = 9000;

export default function MindGameOverlay({
  cue,
  matchId,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onChoice,
}: MindGameOverlayProps) {
  const [remainingMs, setRemainingMs] = useState(timeoutMs);
  const [replyArchetype, setReplyArchetype] = useState<MindGameArchetype | null>(null);
  const [replyChoiceId, setReplyChoiceId] = useState<string | null>(null);

  const prompt = assembleCuePrompt(cue, `${cue.trigger}:${matchId}`);

  useEffect(() => {
    if (replyArchetype !== null) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, timeoutMs - elapsed);
      setRemainingMs(left);
      if (left <= 0) {
        clearInterval(interval);
        setReplyArchetype("silent");
        setReplyChoiceId(null);
        onChoice("silent", `${cue.trigger}_silent`);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cue.trigger, onChoice, replyArchetype, timeoutMs]);

  function pick(archetype: MindGameArchetype, choiceId: string) {
    if (replyArchetype !== null) return;
    setReplyArchetype(archetype);
    setReplyChoiceId(choiceId);
    onChoice(archetype, choiceId);
  }

  const countdownPct = Math.max(0, Math.min(100, (remainingMs / timeoutMs) * 100));

  return (
    <aside
      role="dialog"
      aria-label="Game Master — mid-match"
      className="fixed right-6 top-24 w-80 p-4 border border-void-border/60 rounded bg-void-bg/90 backdrop-blur-sm text-void-text shadow-lg"
    >
      <div className="text-[10px] uppercase tracking-widest text-void-text-muted mb-2">
        The Game Master speaks
      </div>
      <p className="text-sm italic whitespace-pre-line mb-3">{prompt}</p>

      {replyArchetype === null ? (
        <>
          <div className="space-y-1">
            {cue.choices.map((c) => (
              <button
                key={c.id}
                onClick={() => pick(c.archetype, c.id)}
                className="block w-full text-left text-xs px-3 py-2 rounded border border-void-border/40 hover:border-void-text-accent/60 hover:bg-void-bg/60"
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-3 h-1 bg-void-bg rounded overflow-hidden">
            <div
              className="h-full bg-void-text-accent transition-all"
              style={{ width: `${countdownPct}%` }}
            />
          </div>
          <div className="text-[10px] text-void-text-muted mt-1 uppercase tracking-wider">
            Silent default in {Math.ceil(remainingMs / 1000)}s
          </div>
        </>
      ) : (
        <div className="mt-2 p-3 rounded bg-void-bg/70 border border-void-border/30">
          <div className="text-[10px] uppercase tracking-widest text-void-text-muted mb-1">
            Reply
          </div>
          <p className="text-sm italic">{cue.replies[replyArchetype]}</p>
        </div>
      )}
    </aside>
  );
}
