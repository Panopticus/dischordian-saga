/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO OVERLAY

   Mounts when `wolf.hunt_the_hero_available` is true. The
   flag is written by ResurrectionCinematicRouter on the
   Wolf release cinematic's onComplete (see flagsOnComplete.
   extraOnTrue). The router (huntTheHero.* tRPC) writes the
   outcome flag and flips the available flag false on match
   end, so this overlay unmounts itself.

   Single-player vs. scripted Lycos AI. The reducer is
   pure (apps/shared/tcg-core/matches/huntTheHero); the
   server runs both halves of the round (player → wolf)
   per submitAction.

   This is a v1 surface — playable but not polished. Polish
   passes (animations, card art, sound) follow in later
   producer drops.
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useGame } from "@/contexts/GameContext";
import {
  HUNT_THE_HERO_AVAILABLE_FLAG,
  PLAYER_CARD_DEFS,
  type HeroId,
  type HuntState,
  type PlayerCardId,
} from "@shared/tcg-core/matches/huntTheHero";

export function HuntTheHeroOverlay() {
  const { state } = useGame();
  const available = state.narrativeFlags?.[HUNT_THE_HERO_AVAILABLE_FLAG] === true;
  const stateQuery = trpc.huntTheHero.getState.useQuery(undefined, {
    enabled: available,
  });
  const start = trpc.huntTheHero.start.useMutation();
  const submit = trpc.huntTheHero.submitAction.useMutation();
  const concede = trpc.huntTheHero.concede.useMutation();
  const [selectedCard, setSelectedCard] = useState<PlayerCardId | null>(null);

  if (!available) return null;

  const active = stateQuery.data?.active ?? null;
  const refetch = () => stateQuery.refetch();

  if (!active) {
    return (
      <Overlay>
        <h1 className="text-2xl font-bold mb-3">The Hunt Begins</h1>
        <p className="mb-4 text-sm leading-relaxed">
          The Hall is empty except for the broken Hellbox-seal and the
          first sound of footsteps approaching the threshold. Three
          League heroes are crossing into the chamber. Lycos is waiting.
          Open the case file. Play the defenders the chronicle has
          already named.
        </p>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              await start.mutateAsync();
              refetch();
            }}
            disabled={start.isPending}
          >
            Begin the Hunt
          </Button>
        </div>
      </Overlay>
    );
  }

  if (active.phase === "ended") {
    return <OutcomeView state={active} onClose={() => refetch()} />;
  }

  const isPlayerTurn = active.phase === "player_turn";

  async function playCard(card: PlayerCardId, target?: HeroId) {
    const cardDef = PLAYER_CARD_DEFS[card];
    if (cardDef.targeted && !target) {
      toast.error(`${cardDef.name} requires a target hero`);
      return;
    }
    try {
      const res = await submit.mutateAsync({
        action: { kind: "player_play", card, targetHero: target },
      });
      setSelectedCard(null);
      stateQuery.refetch();
      if (res.state.phase === "ended") refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action rejected");
    }
  }

  async function endTurn() {
    try {
      await submit.mutateAsync({ action: { kind: "player_end_turn" } });
      stateQuery.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "End-turn failed");
    }
  }

  return (
    <Overlay>
      <header className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">The Hunt — turn {active.turn} of {active.maxTurns}</h1>
        <Badge variant={isPlayerTurn ? "default" : "secondary"}>
          {isPlayerTurn ? "Your turn" : "Lycos's turn"}
        </Badge>
      </header>

      <section className="grid grid-cols-3 gap-3 mb-4">
        {active.heroes.map((h) => (
          <button
            key={h.id}
            type="button"
            disabled={!isPlayerTurn || !selectedCard || h.resolution !== "alive"}
            className={
              "border rounded p-2 text-left text-xs " +
              (h.resolution === "dead"
                ? "opacity-50 line-through"
                : h.resolution === "evacuated"
                  ? "opacity-60 italic"
                  : h.resolution === "spared"
                    ? "border-emerald-500"
                    : "border-zinc-700") +
              (selectedCard && h.resolution === "alive"
                ? " hover:border-emerald-400 cursor-pointer"
                : "")
            }
            onClick={() => {
              if (selectedCard && h.resolution === "alive") {
                void playCard(selectedCard, h.id);
              }
            }}
          >
            <div className="font-semibold">{h.name}</div>
            <Progress value={(h.hp / h.maxHp) * 100} className="my-1" />
            <div className="text-zinc-400">
              HP {h.hp}/{h.maxHp}
              {h.shielded ? " · shielded" : ""}
              {h.warned ? " · warned" : ""}
              {h.resolution !== "alive" ? ` · ${h.resolution}` : ""}
            </div>
          </button>
        ))}
      </section>

      <section className="mb-4">
        <div className="text-xs uppercase text-zinc-500 mb-1">Hand</div>
        <div className="flex flex-wrap gap-2">
          {active.playerHand.map((cardId, idx) => {
            const def = PLAYER_CARD_DEFS[cardId];
            const isSelected = selectedCard === cardId;
            return (
              <button
                key={`${cardId}-${idx}`}
                type="button"
                disabled={!isPlayerTurn}
                className={
                  "border rounded p-2 text-left text-xs w-44 " +
                  (isSelected
                    ? "border-amber-400 bg-zinc-900"
                    : "border-zinc-700 hover:border-zinc-500")
                }
                onClick={() => {
                  if (def.targeted) {
                    setSelectedCard(isSelected ? null : cardId);
                  } else {
                    void playCard(cardId);
                  }
                }}
              >
                <div className="font-semibold">{def.name}</div>
                <div className="text-zinc-400">{def.description}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-3 max-h-32 overflow-y-auto text-xs text-zinc-300 border border-zinc-800 rounded p-2 font-mono leading-relaxed">
        {active.log.slice(-8).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </section>

      <footer className="flex gap-2">
        <Button onClick={endTurn} disabled={!isPlayerTurn || submit.isPending}>
          End turn
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await concede.mutateAsync();
            refetch();
          }}
        >
          Concede
        </Button>
      </footer>
    </Overlay>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-zinc-950 border border-zinc-800 rounded-lg p-5 text-zinc-100">
        {children}
      </div>
    </div>
  );
}

function OutcomeView({ state, onClose }: { state: HuntState; onClose: () => void }) {
  const outcomeCopy: Record<NonNullable<HuntState["outcome"]>, { title: string; body: string }> = {
    player_saved_all: {
      title: "All Three Saved",
      body: "Every hero crossed and returned. Lycos's hunt closed without bloodshed. The chronicle records the impossible defense.",
    },
    mercy_extended: {
      title: "Mercy Extended — Twice",
      body: "Lycos extended mercy a second time. The chronicle records the gesture as a concession, not a defeat. Lycos may yet be reachable.",
    },
    wolf_killed_one: {
      title: "One Fell",
      body: "One hero fell to the Hunt. The chronicle records the cost.",
    },
    wolf_killed_two: {
      title: "Two Fell",
      body: "Two heroes fell to the Hunt. The chronicle records the cost.",
    },
    wolf_killed_all: {
      title: "All Fell",
      body: "All three heroes fell. The Hall's geometry was vindicated. Lycos has confirmed his ethic.",
    },
    draw_timeout: {
      title: "The Hunt Held",
      body: "The turn count expired. The Hall returns to waiting. Neither verdict was delivered.",
    },
  };
  const copy = state.outcome ? outcomeCopy[state.outcome] : null;
  return (
    <Overlay>
      <h1 className="text-2xl font-bold mb-3">{copy?.title ?? "The Hunt Resolved"}</h1>
      <p className="mb-4 text-sm leading-relaxed">{copy?.body ?? ""}</p>
      <div className="mb-3 text-xs text-zinc-400">
        Killed: {state.heroes.filter((h) => h.resolution === "dead").length} ·
        Saved: {state.heroes.filter((h) => h.resolution !== "dead").length} ·
        Mercy played: {state.mercyPlayed ? "yes" : "no"}
      </div>
      <Button onClick={onClose}>Close</Button>
    </Overlay>
  );
}
