/* ═══════════════════════════════════════════════════════
   WOLF-HUNT OVERLAY

   Mounts when WOLF_HUNT_ARC_AVAILABLE_FLAG is set true on
   the player's narrative-flag map. The flag is written by
   ResurrectionCinematicRouter on the Wolf release
   cinematic's onComplete.

   Surfaces:
     - Dossier panel (no active mission) — pick a target.
     - Mission card (active mission) — briefing → approach
       → engagement → aftermath.
     - Boss-fight card UI overlay (active boss fight) — play
       Wolf cards against the lieutenant's defender AI.

   v1 — playable, unpolished. Animations + card art ship
   in subsequent passes.
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useGame } from "@/contexts/GameContext";
import {
  WOLF_HUNT_ARC_AVAILABLE_FLAG,
  WOLF_HUNT_ARC_COMPLETE_TRIGGER_FLAG,
  WOLF_HUNT_ARC_FAILURE_TRIGGER_FLAG,
  WOLF_CARD_DEFS,
  type WolfCardId,
} from "@shared/wolfHunt";
import { WolfHuntDossierPanel } from "./WolfHuntDossierPanel";

const APPROACH_CHOICES = [
  { key: "stealth", label: "Approach in silence — risk low, reward modest." },
  { key: "social", label: "Approach in conversation — turn the corrupted speech back on them." },
  { key: "tactical", label: "Approach in force — risk high, reward decisive." },
  { key: "abort", label: "Withdraw and report; the hero escapes." },
] as const;

const ENGAGEMENT_CHOICES = [
  { key: "hunt", label: "Hunt — commit to the kill. Closes the column." },
  { key: "restraint", label: "Restraint — disable + interrogate. Slow, certain." },
  { key: "mercy", label: "Mercy — offer peace. Spares the hero; the Antiquarian may approve." },
  { key: "withdraw", label: "Withdraw — let them escape. The pressure rises." },
] as const;

export function WolfHuntOverlay() {
  const { state } = useGame();
  const available =
    state.narrativeFlags?.[WOLF_HUNT_ARC_AVAILABLE_FLAG] === true;
  const arcComplete =
    state.narrativeFlags?.[WOLF_HUNT_ARC_COMPLETE_TRIGGER_FLAG] === true;
  const arcFailure =
    state.narrativeFlags?.[WOLF_HUNT_ARC_FAILURE_TRIGGER_FLAG] === true;

  const missionQuery = trpc.wolfHunt.getMissionState.useQuery(undefined, {
    enabled: available,
  });
  const submit = trpc.wolfHunt.submitChoice.useMutation();
  const concede = trpc.wolfHunt.concedeMission.useMutation();
  const playBossCard = trpc.wolfHunt.playBossCard.useMutation();

  if (!available) return null;
  if (arcComplete || arcFailure) return null;

  const data = missionQuery.data;
  if (!data) return null;

  if (!data.mission) {
    return <WolfHuntDossierPanel />;
  }

  const { mission, briefing, target, bossFight } = data;

  const refetch = () => missionQuery.refetch();

  if (mission.step === "briefing" && briefing && target) {
    return (
      <Overlay>
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">The Antiquarian's Briefing</h1>
            <p className="text-xs opacity-70">
              {target.name} — {target.classKey} — Tier {target.threatTier}
            </p>
          </div>
          <Badge>{target.lairLocation.replace(/_/g, " ")}</Badge>
        </header>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>{briefing.preamble}</p>
          <p>{briefing.body}</p>
          <p className="opacity-80">{briefing.closing}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            disabled={submit.isPending}
            onClick={async () => {
              await submit.mutateAsync({
                action: { kind: "advance_from_briefing" },
              });
              refetch();
            }}
          >
            Begin the Approach
          </Button>
          <Button
            variant="secondary"
            disabled={concede.isPending}
            onClick={async () => {
              await concede.mutateAsync();
              refetch();
            }}
          >
            Decline the Contract
          </Button>
        </div>
      </Overlay>
    );
  }

  if (mission.step === "approach") {
    return (
      <Overlay>
        <h1 className="text-xl font-bold mb-3">The Approach</h1>
        <p className="text-xs opacity-70 mb-3">
          Lycos HP {mission.lycosHealth}/100
        </p>
        <Progress value={mission.lycosHealth} className="mb-4" />
        <div className="space-y-2">
          {APPROACH_CHOICES.map((c) => (
            <Button
              key={c.key}
              variant="outline"
              className="w-full justify-start"
              disabled={submit.isPending}
              onClick={async () => {
                const result = await submit.mutateAsync({
                  action: { kind: "approach_choice", choiceKey: c.key },
                });
                if (result.outcome === "lycos_died") {
                  toast.error("Lycos fell. The contract pauses.");
                }
                refetch();
              }}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </Overlay>
    );
  }

  if (mission.step === "engagement") {
    if (mission.bossFightTriggered && bossFight) {
      return (
        <BossFightView
          state={bossFight}
          onPlay={async (card) => {
            const out = await playBossCard.mutateAsync({ card });
            if (out.missionOutcome) {
              if (out.missionOutcome === "killed")
                toast.success("The lieutenant falls.");
              else if (out.missionOutcome === "lycos_died")
                toast.error("Lycos fell. The contract pauses.");
            }
            refetch();
          }}
          busy={playBossCard.isPending}
        />
      );
    }
    return (
      <Overlay>
        <h1 className="text-xl font-bold mb-3">The Engagement</h1>
        <p className="text-xs opacity-70 mb-3">
          Lycos HP {mission.lycosHealth}/100
        </p>
        <Progress value={mission.lycosHealth} className="mb-4" />
        <div className="space-y-2">
          {ENGAGEMENT_CHOICES.map((c) => (
            <Button
              key={c.key}
              variant="outline"
              className="w-full justify-start"
              disabled={submit.isPending}
              onClick={async () => {
                await submit.mutateAsync({
                  action: { kind: "engagement_choice", choiceKey: c.key },
                });
                refetch();
              }}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </Overlay>
    );
  }

  if (mission.step === "aftermath") {
    const tone =
      mission.outcome === "killed"
        ? "The column closes."
        : mission.outcome === "spared"
        ? "Mercy recorded."
        : mission.outcome === "escaped"
        ? "The hero escapes; pressure rises."
        : "Lycos fell. The contract pauses until he returns.";
    return (
      <Overlay>
        <h1 className="text-xl font-bold mb-2">Aftermath</h1>
        <p className="text-sm mb-4">{tone}</p>
        <Button
          onClick={async () => {
            await submit.mutateAsync({ action: { kind: "aftermath_close" } });
            refetch();
          }}
        >
          Close the dossier
        </Button>
      </Overlay>
    );
  }

  return null;
}

function BossFightView({
  state,
  onPlay,
  busy,
}: {
  state: { lieutenantHp: number; lieutenantMaxHp: number; lycosHp: number; lycosMaxHp: number; wolfHand: ReadonlyArray<WolfCardId>; log: ReadonlyArray<string>; turn: number; maxTurns: number };
  onPlay: (card: WolfCardId) => void;
  busy: boolean;
}) {
  return (
    <Overlay>
      <h1 className="text-xl font-bold mb-2">The Lieutenant's Stand</h1>
      <div className="text-xs opacity-70 mb-2">
        Turn {state.turn}/{state.maxTurns}
      </div>
      <div className="mb-2 text-sm">
        Lieutenant {state.lieutenantHp}/{state.lieutenantMaxHp}
      </div>
      <Progress value={(state.lieutenantHp / state.lieutenantMaxHp) * 100} className="mb-3" />
      <div className="mb-2 text-sm">
        Lycos {state.lycosHp}/{state.lycosMaxHp}
      </div>
      <Progress value={(state.lycosHp / state.lycosMaxHp) * 100} className="mb-3" />
      <div className="grid grid-cols-2 gap-2 mt-3">
        {state.wolfHand.map((c, i) => (
          <Button
            key={`${c}-${i}`}
            disabled={busy}
            onClick={() => onPlay(c)}
            variant="outline"
          >
            <div className="text-left">
              <div className="font-semibold">{WOLF_CARD_DEFS[c].name}</div>
              <div className="text-xs opacity-70">{WOLF_CARD_DEFS[c].blurb}</div>
            </div>
          </Button>
        ))}
      </div>
      <div className="mt-3 text-xs opacity-60 max-h-24 overflow-y-auto">
        {state.log.slice(-4).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </Overlay>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-xl w-[92%] rounded-lg border border-amber-900/40 bg-zinc-950 p-5 text-zinc-100 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
