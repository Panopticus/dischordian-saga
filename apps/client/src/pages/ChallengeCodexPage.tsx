/**
 * Challenge Codex — registry of every NPC the player can challenge.
 *
 * Mounts trpc.npcDuel.listChallengeable to enumerate every NPC with
 * an authored deck in NPC_DECK_REGISTRY. Each row shows:
 *   - the NPC's general portrait (the boss face the duel mounts)
 *   - their name + faction
 *   - learned-aspect count (X / Y)
 *   - defeated badge (if the player has won at least once)
 *   - cross-NPC echo flag (carriedByPlayer — set when the player
 *     has won and the cross-NPC public flag fired)
 *   - "Approach" button → mounts NpcDialogTreeRunner for that NPC's
 *     perspective_gathering tree
 *
 * All art comes from the shipped card registry (ALL_CARD_DEFINITIONS);
 * no new assets.
 *
 * The page is self-contained — drops at /codex/challenge with no
 * wider integration required.
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Swords, Check, History } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { NpcDialogTreeRunner } from "@/components/NpcDialogTreeRunner";
import { ALL_NPC_DIALOG_TREES } from "@shared/npcs/dialogTrees";
import { ALL_CARD_DEFINITIONS } from "@shared/tcg-core/cards";
import { getNpcDeck } from "@shared/npc-decks";
import type { NpcDialogTree } from "@shared/npcs/dialogTrees/types";
import type { NpcKey } from "@shared/npcs/types";

interface ChallengeableNpc {
  npcKey: string;
  defeated: boolean;
  learnedAspectCount: number;
  totalAspectCount: number;
  carriedByPlayer: boolean;
}

/** Find the canonical perspective_gathering tree for an NPC. */
function findPerspectiveTreeFor(npcKey: string): NpcDialogTree | undefined {
  return ALL_NPC_DIALOG_TREES.find(
    (t) => t.npcKey === (npcKey as NpcKey) && t.id.endsWith("-perspective-gathering"),
  );
}

/** Look up the NPC's general portrait from the shipped card registry.
 *  Each NpcDeck declares a `general` cardDefId; we resolve it to the
 *  `art` field. */
function generalPortraitFor(npcKey: string): { art: string; name: string } | undefined {
  const deck = getNpcDeck(npcKey as NpcKey);
  if (!deck) return undefined;
  const card = ALL_CARD_DEFINITIONS.find((c) => c.id === deck.general);
  if (!card) return undefined;
  return { art: card.art, name: card.name };
}

export default function ChallengeCodexPage() {
  const [, navigate] = useLocation();
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const list = trpc.npcDuel.listChallengeable.useQuery(undefined, {
    staleTime: 60_000,
  });

  const activeTree = useMemo(
    () => (activeNpc ? findPerspectiveTreeFor(activeNpc) : undefined),
    [activeNpc],
  );

  return (
    <div className="min-h-screen void-bg-canvas">
      {/* Header */}
      <div className="border-b void-border void-bg-sunk/[0.4] backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/ark")}
              className="text-white/30 hover:text-white/60"
              aria-label="Back to Ark"
            >
              <ArrowLeft size={18} />
            </button>
            <Swords size={14} className="void-text-accent" />
            <h1 className="font-display text-[14px] uppercase tracking-[0.25em] void-text">
              Challenge Codex
            </h1>
          </div>
          <button
            onClick={() => navigate("/codex/past-duels")}
            className="flex items-center gap-1.5 rounded border void-border px-2 py-1 font-mono text-[9px] uppercase tracking-wider void-text-dim hover:void-text"
            title="Historical record of every NPC duel you've played"
          >
            <History size={11} /> Past Duels
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="font-serif text-[13px] void-text leading-relaxed mb-6 max-w-2xl">
          Every potential the chronicle has filed as challengeable. The
          deeper you understand them, the more the tray weighs on victory.
          Each row shows what you've learned, what you've already taken,
          and which echoes the public-flag rail has filed.
        </p>

        {list.isLoading && (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim">
            The arithmetic is waiting…
          </p>
        )}

        {list.data && list.data.length === 0 && (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim">
            No potentials authored yet. The chronicle is empty for now.
          </p>
        )}

        {list.data && list.data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {list.data.map((npc: ChallengeableNpc) => {
              const portrait = generalPortraitFor(npc.npcKey);
              const hasTree = findPerspectiveTreeFor(npc.npcKey) !== undefined;
              return (
                <div
                  key={npc.npcKey}
                  className="rounded border void-border void-bg-sunk/[0.6] p-4 flex items-start gap-3"
                >
                  {portrait && (
                    <img
                      src={portrait.art}
                      alt={portrait.name}
                      className="h-20 w-14 rounded object-cover void-border border flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[13px] void-text truncate">
                        {npc.npcKey}
                      </p>
                      {npc.defeated && (
                        <span
                          className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider void-text-accent"
                          title="You have defeated this potential at least once"
                        >
                          <Check size={10} /> Defeated
                        </span>
                      )}
                    </div>
                    {portrait && (
                      <p className="font-mono text-[9px] uppercase tracking-wider void-text-dim mt-0.5">
                        {portrait.name}
                      </p>
                    )}
                    <p className="font-mono text-[10px] void-text-dim mt-2">
                      Aspects learned:{" "}
                      <span className="void-text">
                        {npc.learnedAspectCount} / {npc.totalAspectCount}
                      </span>
                    </p>
                    {npc.carriedByPlayer && (
                      <p className="font-mono text-[9px] italic void-text-dim mt-1">
                        Their memory rides with you.
                      </p>
                    )}
                    {hasTree ? (
                      <button
                        onClick={() => setActiveNpc(npc.npcKey)}
                        className="mt-3 rounded border void-border bg-cyan-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider void-text hover:bg-cyan-900/60"
                      >
                        Approach
                      </button>
                    ) : (
                      <p
                        className="mt-3 font-mono text-[9px] uppercase tracking-wider void-text-dim"
                        title="Deck authored but no perspective dialog tree yet"
                      >
                        No conversation surface yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active dialog runner — mounts on top when the player taps an
          Approach button. */}
      {activeNpc && activeTree && (
        <NpcDialogTreeRunner
          tree={activeTree}
          playerFaction="neutral"
          onClose={() => {
            setActiveNpc(null);
            // Refetch the list so any newly-defeated / newly-carried
            // state surfaces immediately on close.
            void list.refetch();
          }}
        />
      )}
    </div>
  );
}
