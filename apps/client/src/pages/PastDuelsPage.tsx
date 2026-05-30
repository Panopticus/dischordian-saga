/**
 * Past Duels Codex — historical NPC-duel record.
 *
 * Reads trpc.npcDuel.listPastDuels and renders each duel with the
 * replay-pin metadata that GameState.npcDuelMeta captured at match
 * init: tier, aspects learned, outcome, what was granted / taken /
 * restored.
 *
 * This is the consumer that closes the replay-pin loop — the data
 * was being recorded already, this page is what surfaces it.
 *
 * All art comes from the shipped card registry. No new assets.
 */
import { useLocation } from "wouter";
import { ArrowLeft, History, Check, X, Coins } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ALL_CARD_DEFINITIONS } from "@shared/tcg-core/cards";
import { getNpcDeck } from "@shared/npc-decks";
import type { NpcKey } from "@shared/npcs/types";

const TIER_LABEL: Record<0 | 1 | 2 | 3, string> = {
  0: "tier 0 · single",
  1: "tier 1 · handful",
  2: "tier 2 · pile",
  3: "tier 3 · full memorial",
};

function generalPortraitFor(npcKey: string): { art: string; name: string } | undefined {
  const deck = getNpcDeck(npcKey as NpcKey);
  if (!deck) return undefined;
  const card = ALL_CARD_DEFINITIONS.find((c) => c.id === deck.general);
  if (!card) return undefined;
  return { art: card.art, name: card.name };
}

function cardArt(cardDefId: string): { art?: string; name?: string } {
  const c = ALL_CARD_DEFINITIONS.find((x) => x.id === cardDefId);
  return { art: c?.art, name: c?.name };
}

function formatRelative(ts: number | null): string {
  if (ts === null) return "";
  const delta = Date.now() - ts;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (delta < minute) return "just now";
  if (delta < hour) return `${Math.floor(delta / minute)}m ago`;
  if (delta < day) return `${Math.floor(delta / hour)}h ago`;
  return `${Math.floor(delta / day)}d ago`;
}

export default function PastDuelsPage() {
  const [, navigate] = useLocation();
  const list = trpc.npcDuel.listPastDuels.useQuery({ limit: 30 }, {
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen void-bg-canvas">
      {/* Header */}
      <div className="border-b void-border void-bg-sunk/[0.4] backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/codex/challenge")}
              className="text-white/30 hover:text-white/60"
              aria-label="Back to Challenge Codex"
            >
              <ArrowLeft size={18} />
            </button>
            <History size={14} className="void-text-accent" />
            <h1 className="font-display text-[14px] uppercase tracking-[0.25em] void-text">
              Past Duels
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="font-serif text-[13px] void-text leading-relaxed mb-6 max-w-2xl">
          The chronicle's record of every potential you have sat down
          with at the table. The tier records what the tray weighed at
          the moment you challenged them; the aspects record what you
          had understood.
        </p>

        {list.isLoading && (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim">
            Reading the chronicle…
          </p>
        )}

        {list.data && list.data.length === 0 && (
          <div className="rounded border void-border bg-stone-900/40 p-6 text-center">
            <p className="font-serif text-[13px] void-text-dim mb-3">
              No duels recorded yet. The chronicle is patient.
            </p>
            <button
              onClick={() => navigate("/codex/challenge")}
              className="rounded border void-border bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text hover:bg-cyan-900/60"
            >
              Approach a potential
            </button>
          </div>
        )}

        {list.data && list.data.length > 0 && (
          <div className="space-y-3">
            {list.data.map((d) => {
              const portrait = generalPortraitFor(d.npcKey);
              const won = d.outcome === "player_won";
              const taken = d.takenCardDefId ? cardArt(d.takenCardDefId) : null;
              return (
                <div
                  key={d.matchId}
                  className="rounded border void-border void-bg-sunk/[0.6] p-4 flex items-start gap-4"
                >
                  {portrait && (
                    <img
                      src={portrait.art}
                      alt={portrait.name}
                      className="h-20 w-14 rounded object-cover void-border border flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    {/* Top line: NPC + outcome + relative timestamp */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display text-[13px] void-text">
                        {d.npcKey}
                      </p>
                      {won ? (
                        <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider void-text-accent">
                          <Check size={10} /> won
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-red-300/80">
                          <X size={10} /> lost
                        </span>
                      )}
                      <span className="font-mono text-[9px] uppercase tracking-wider void-text-dim ml-auto">
                        {formatRelative(d.endedAt)}
                      </span>
                    </div>

                    {/* Replay-pin metadata */}
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-wider void-text-dim">
                      <p>
                        Aspects:{" "}
                        <span className="void-text">
                          {d.learnedAspectCount} / {d.totalAspectCount}
                        </span>
                      </p>
                      <p>
                        Tier:{" "}
                        <span className="void-text">
                          {TIER_LABEL[d.rewardTier] ?? `tier ${d.rewardTier}`}
                        </span>
                      </p>
                      {won && (
                        <p className="flex items-center gap-1">
                          <Coins size={9} />
                          <span className="void-text">{d.grantCount}</span>{" "}
                          {d.grantCount === 1 ? "memory" : "memories"}
                        </p>
                      )}
                    </div>

                    {/* Taken card (loss only) */}
                    {!won && taken && (
                      <div className="mt-3 flex items-center gap-2">
                        {taken.art && (
                          <img
                            src={taken.art}
                            alt={taken.name ?? d.takenCardDefId ?? ""}
                            className="h-10 w-7 rounded object-cover void-border border"
                          />
                        )}
                        <p className="font-mono text-[9px] uppercase tracking-wider void-text-dim">
                          They took{" "}
                          <span className="void-text">
                            {taken.name ?? d.takenCardDefId}
                          </span>
                          .
                        </p>
                      </div>
                    )}

                    {/* Restored cards (win + Highlander recovery) */}
                    {won && d.restoredCardDefIds.length > 0 && (
                      <div className="mt-3">
                        <p className="font-mono text-[9px] uppercase tracking-wider void-text-accent mb-1">
                          Recovered from the ledger
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {d.restoredCardDefIds.map((cid) => {
                            const c = cardArt(cid);
                            return (
                              <img
                                key={cid}
                                src={c.art}
                                alt={c.name ?? cid}
                                title={c.name ?? cid}
                                className="h-10 w-7 rounded object-cover void-border border"
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
