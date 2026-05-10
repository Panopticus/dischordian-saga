/* ═══════════════════════════════════════════════════════
   CONFESSION-CLOSE ROUTER

   Bible §10.4 (NANO_BANANA_VEO_FULL_PROMPT_BOOK.md line 2186+):
   "Engineering wires this into Act6CardLadderPage.tsx:100 after stance".

   When the player commits a confession-close stance during Act 6,
   one of the seven `act6_confession_close_<stance>` flags goes
   true. This router watches for that flag, finds the matching
   pair of cutscenes (one for Elara, one for the Human), and plays
   them sequentially. On completion of the pair, sets
   `confession_close_<stance>_seen` so re-entering the page won't
   replay them.

   Idempotent on `_seen`. Pure resolver
   (`resolvePendingConfessionClose`) is exported separately so it
   can be unit-tested without a DOM.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, useState, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  CONFESSION_CLOSE_STANCES,
  resolveConfessionCloseCutscene,
  stanceFromFlag,
  type ConfessionCloseCutsceneDef,
  type ConfessionCloseStance,
} from "@shared/confessionCloseCutscenes";
import { SingleVideoCutsceneOverlay } from "./SingleVideoCutsceneOverlay";

export const confessionCloseSeenFlag = (
  stance: ConfessionCloseStance,
): string => `confession_close_${stance}_seen`;

export interface PendingConfessionCloseQueue {
  stance: ConfessionCloseStance;
  /** Ordered playback queue: Elara first, then Human. */
  queue: readonly [
    ConfessionCloseCutsceneDef,
    ConfessionCloseCutsceneDef,
  ];
}

/** Pure resolver: given a narrative-flag map, return the pending
 *  stance + ordered playback queue, or null if no stance is
 *  pending or it's already been seen.
 *
 *  Iteration matches CONFESSION_CLOSE_STANCES order — if multiple
 *  stance flags are set (shouldn't happen in normal play; the
 *  gate enforces single-stance), the first canonical one wins. */
export function resolvePendingConfessionClose(
  flags: Readonly<Record<string, unknown>>,
): PendingConfessionCloseQueue | null {
  for (const stance of CONFESSION_CLOSE_STANCES) {
    const stanceFlag = `act6_confession_close_${stance}`;
    if (flags[stanceFlag] !== true) continue;
    if (flags[confessionCloseSeenFlag(stance)] === true) continue;
    const elara = resolveConfessionCloseCutscene("elara", stance);
    const human = resolveConfessionCloseCutscene("human", stance);
    if (!elara || !human) continue;
    return { stance, queue: [elara, human] };
  }
  return null;
}

/** Re-export so consumers don't have to chase the import path. */
export { stanceFromFlag };

export function ConfessionCloseRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const pending = useMemo<PendingConfessionCloseQueue | null>(
    () => resolvePendingConfessionClose(flags),
    [flags],
  );

  // 0 = Elara not yet finished; 1 = Elara done, Human playing.
  // Resets to 0 whenever the pending stance changes.
  const [step, setStep] = useState(0);

  // When the pending stance changes (or unloads), reset the step
  // counter. useMemo for stable identity.
  const pendingStanceKey = pending?.stance ?? null;
  useMemo(() => setStep(0), [pendingStanceKey]);

  const handleStepComplete = useCallback(() => {
    if (!pending) return;
    if (step === 0) {
      setStep(1);
      return;
    }
    // Both videos done — stamp the seen flag so the next render
    // sees no pending queue. Step counter resets via useMemo above
    // on the next render when pendingStanceKey flips to null.
    setNarrativeFlag(confessionCloseSeenFlag(pending.stance), true);
  }, [pending, step, setNarrativeFlag]);

  if (!pending) return null;

  const current = pending.queue[step];
  const characterLabel =
    current.character === "elara" ? "Elara" : "The Human";
  const stanceLabel = pending.stance
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={current.id}
      videoRelPath={current.videoRelPath}
      primaryLabel={`Confession · ${characterLabel}`}
      secondaryLabel={stanceLabel}
      badge={`${step + 1}/2`}
      onComplete={handleStepComplete}
    />
  );
}

export default ConfessionCloseRouter;
