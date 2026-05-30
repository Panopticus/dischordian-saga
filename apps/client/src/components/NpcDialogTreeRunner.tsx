/**
 * NpcDialogTreeRunner — self-contained renderer for an out-of-match
 * BioWare-style NpcDialogTree.
 *
 * Walks the tree via the server-authoritative `useNpcDialogTree`
 * hook (which commits each choice through
 * `npc.recordDialogChoiceOutcome` before advancing). When a choice
 * carries a `challenge: { npcKey }` outcome, the committed result
 * surfaces `lastResult.challenge` non-null; this component
 * auto-mounts `NpcDuelOverlay` so the duel loop runs end-to-end
 * without the host having to plumb the wiring.
 *
 * Phases inside this component:
 *
 *   - "dialog"   the tree is walking normally; render node text +
 *                choices, advance via the hook.
 *   - "duel"     a challenge fired; NpcDuelOverlay is mounted. The
 *                dialog state is preserved underneath so when the
 *                overlay closes we fall back to the dialog's
 *                terminal beat (or whatever node the challenge
 *                choice's nextId pointed at).
 *
 * Hosts:
 *
 *   <NpcDialogTreeRunner
 *     tree={THE_DEGEN_PERSPECTIVE_GATHERING}
 *     playerFaction="dreamer"
 *     onClose={() => setShowDialog(false)}
 *   />
 *
 * That's the entire integration — any room / hub / page that wants
 * the dialog → duel → harvest loop mounts this. Per-room theming
 * goes around it (frame, backdrop, ambient audio); the runner
 * stays presentation-minimal.
 */
import { useEffect, useRef, useState } from "react";
import { useNpcDialogTree, type ChoiceCommitResult } from "@/hooks/useNpcDialogTree";
import { useDialogTreeVo } from "@/hooks/useDialogTreeVo";
import { NpcDuelOverlay } from "./NpcDuelOverlay";
import type { NpcDialogTree } from "@shared/npcs/dialogTrees/types";
import type { Faction as DuelystFaction } from "@/game/duelyst/types";

export interface NpcDialogTreeRunnerProps {
  /** The tree to walk. */
  tree: NpcDialogTree;
  /** Player's chosen faction — forwarded to the duel overlay if a
   *  challenge fires. Surfaces that don't track faction should
   *  pass "neutral". */
  playerFaction: DuelystFaction;
  /** Optional dreamer-aware entry override (sourced server-side by
   *  the host; useNpcDialogTree forwards through). */
  entryNodeId?: string;
  /** Fires when the conversation closes — either at the tree's
   *  terminal node OR after the duel overlay's result phase
   *  completes. The host unmounts this component. */
  onClose: () => void;
  /** Optional: fires after each successful choice commit. The host
   *  can refresh caches / fire toasts. The hook's full
   *  `ChoiceCommitResult` is forwarded (includes the `challenge`
   *  field for hosts that want their own intercept). */
  onChoiceCommitted?: (result: ChoiceCommitResult) => void;
  /** Optional: fires after a duel victory is recorded successfully. */
  onVictoryRecorded?: (grantCount: number, rewardTier: 0 | 1 | 2 | 3) => void;
}

export function NpcDialogTreeRunner({
  tree,
  playerFaction,
  entryNodeId,
  onClose,
  onChoiceCommitted,
  onVictoryRecorded,
}: NpcDialogTreeRunnerProps) {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  // VO playback — per-NPC manifest lookup. Silent no-op when the
  // manifest hasn't loaded yet or the voLineId isn't in it (e.g.
  // before pnpm vo:npc-first-meet has generated the MP3s).
  const vo = useDialogTreeVo(tree.npcKey);
  const lastSpokenRef = useRef<string | null>(null);

  const view = useNpcDialogTree({
    tree,
    entryNodeId,
    onChoiceCommitted: (result) => {
      onChoiceCommitted?.(result);
      if (result.challenge) {
        // Auto-mount the duel overlay. The dialog state advances
        // underneath as authored — when the overlay closes we
        // reveal the dialog's next node (the challenge choice's
        // nextId, usually a "challenge_accepted" terminal stub).
        setActiveChallenge(result.challenge.npcKey);
      }
    },
  });

  const handleChoice = (choiceIndex: number) => {
    void view.advance(choiceIndex).catch(() => {
      // Errors are surfaced on view.error; the hook keeps local
      // state on the current node so the player can retry.
    });
  };

  /* ─── Duel overlay (mounted ON TOP of the dialog when active) ─── */
  const duelMounted = activeChallenge !== null;

  /* ─── Dialog body ─── */
  const node = view.currentNode;

  // Speak the node's VO clip once per node-entry. Suppressed while
  // the duel overlay is mounted on top so the Degen's table-side
  // voice doesn't talk over the duel UI.
  useEffect(() => {
    if (!node) return;
    if (duelMounted) return;
    const id = node.voLineId;
    if (!id) return;
    if (lastSpokenRef.current === id) return;
    lastSpokenRef.current = id;
    vo.speak(id);
  }, [node, duelMounted, vo]);

  if (!node) {
    // Defensive — useNpcDialogTree's startTreeRun would have thrown
    // if the entry node didn't exist; this is the post-walk state.
    return (
      <Shell label={tree.npcKey}>
        <p className="font-serif text-[13px] void-text">…</p>
        <CloseButton onClick={onClose} label="Continue" />
      </Shell>
    );
  }

  return (
    <>
      <Shell label={`Conversation: ${tree.npcKey}`}>
        <p className="font-serif text-[14px] italic leading-relaxed void-text whitespace-pre-line">
          {node.onscreenText}
        </p>

        {view.error && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-red-300">
            commit failed — try again
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {view.ended ? (
            <CloseButton onClick={onClose} label="Continue" />
          ) : (
            (node.choices ?? []).map((choice, i) => (
              <button
                key={`${node.id}_${i}`}
                type="button"
                disabled={view.committing}
                onClick={() => handleChoice(i)}
                className="text-left rounded border void-border bg-stone-900/60 px-4 py-3 font-serif text-[13px] void-text hover:bg-stone-800/80 hover:border-cyan-500/60 transition-colors disabled:opacity-50"
              >
                {choice.label}
              </button>
            ))
          )}
        </div>
      </Shell>

      {duelMounted && (
        <NpcDuelOverlay
          npcKey={activeChallenge}
          playerFaction={playerFaction}
          onClose={() => setActiveChallenge(null)}
          onVictoryRecorded={onVictoryRecorded}
        />
      )}
    </>
  );
}

/* ─── Helpers ─── */

function Shell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      <div className="max-w-2xl w-full mx-6 p-8 bg-stone-950/95 border void-border rounded">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim mb-4 text-center">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function CloseButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded border void-border bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text hover:bg-cyan-900/60"
    >
      {label}
    </button>
  );
}
