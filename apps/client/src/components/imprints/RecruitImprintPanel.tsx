/* ═══════════════════════════════════════════════════════
   RECRUIT IMPRINT PANEL — Quest-chain UI

   Each of the five recruitable NPCs (Vex Solène, Wraith
   Calder, Locke, Jericho Jones, Akai Shi) has an authored
   3-stage recruitment quest with branching dialog. This
   panel renders:

     1. The roster grid — one card per NPC with a status
        badge (closed / in progress / loyal / tense /
        refused / on crew).
     2. The selected chain detail view — the briefing,
        the current stage's scene, choices, and (after a
        choice) the NPC's reply lines.
     3. The terminal "Recruit" button when the chain ends
        on recruited_loyal or recruited_tense — clicking
        this calls trpc.npcRecruit.recruit which validates
        the chain outcome and instantiates the crew member
        with the choice-derived stat tweaks + relationship
        tag.

   Reads:
     trpc.recruitmentQuests.listChains
     trpc.recruitmentQuests.getChain({ npcKey })
   Mutates:
     trpc.recruitmentQuests.open({ npcKey })
     trpc.recruitmentQuests.makeChoice({ npcKey, choiceId })
     trpc.npcRecruit.recruit({ npcKey })

   File: apps/client/src/components/imprints/RecruitImprintPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  UserPlus,
  ShieldCheck,
  Lock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Skull,
  Flag,
} from "lucide-react";
import type {
  RecruitmentChain,
  RecruitmentStage,
} from "@shared/recruitmentQuests";

/** Shape returned by trpc.recruitmentQuests.getChain — matches the
 *  router's return value. Authored here as a discrete type so the
 *  ChainDetail / StageView props don't need a circular import. */
interface ChainData {
  chain: RecruitmentChain;
  progress: {
    currentStageId: string | null;
    choiceHistory: readonly string[];
    flagsSet: readonly string[];
    outcome: Outcome;
    recruitModifiers: {
      startingLoyalty?: number;
      statTweaks?: Record<string, number>;
      relationshipTag?: string;
    } | null;
  };
  gate: { ok: boolean; reason?: string };
  visibleStage: RecruitmentStage | null;
}

type NpcKey =
  | "vex_solene"
  | "wraith_calder"
  | "locke"
  | "jericho_jones"
  | "akai_shi"
  | "lycos";

type Outcome = "recruited_loyal" | "recruited_tense" | "refused" | null;

export default function RecruitImprintPanel() {
  const [selectedNpc, setSelectedNpc] = useState<NpcKey | null>(null);
  const [lastReply, setLastReply] = useState<{
    speaker: string;
    text: string;
  }[] | null>(null);

  const utils = trpc.useUtils();
  const listQuery = trpc.recruitmentQuests.listChains.useQuery();
  const crewQuery = trpc.crew.getState.useQuery();
  const chainQuery = trpc.recruitmentQuests.getChain.useQuery(
    { npcKey: (selectedNpc ?? "vex_solene") as NpcKey },
    { enabled: selectedNpc !== null },
  );

  const open = trpc.recruitmentQuests.open.useMutation({
    onSuccess: () => {
      utils.recruitmentQuests.listChains.invalidate();
      utils.recruitmentQuests.getChain.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
  const makeChoice = trpc.recruitmentQuests.makeChoice.useMutation({
    onSuccess: (res) => {
      utils.recruitmentQuests.listChains.invalidate();
      utils.recruitmentQuests.getChain.invalidate();
      setLastReply(res.choice.npcReply.map((l) => ({ speaker: l.speaker, text: l.text })));
      if (res.terminal) {
        const o = res.progress.outcome;
        if (o === "recruited_loyal") {
          toast.success(`Chain complete: loyal recruitment. Press Recruit to bring them aboard.`, { duration: 8000 });
        } else if (o === "recruited_tense") {
          toast.warning(`Chain complete: tense recruitment. Press Recruit to bring them aboard despite themselves.`, { duration: 8000 });
        } else {
          toast.error(`They declined.`, { duration: 8000 });
        }
      }
    },
    onError: (err) => toast.error(err.message),
  });
  const recruit = trpc.npcRecruit.recruit.useMutation({
    onSuccess: (res, vars) => {
      utils.crew.getState.invalidate();
      utils.recruitmentQuests.listChains.invalidate();
      if (res.alreadyRecruited) {
        toast.info(`${humanize(vars.npcKey)} is already on the crew roster.`);
        return;
      }
      const tag = res.relationshipTag ? ` (${res.relationshipTag})` : "";
      toast.success(
        `${humanize(vars.npcKey)} joined the crew${tag}. The Human nodded once.`,
        { duration: 9000 },
      );
    },
    onError: (err) => toast.error(err.message),
  });

  const recruitedKeys = useMemo(() => {
    const set = new Set<string>();
    const members = crewQuery.data?.roster?.members ?? [];
    for (const m of members) {
      if (m.linkedNpcKey) set.add(m.linkedNpcKey);
    }
    return set;
  }, [crewQuery.data]);

  if (listQuery.isLoading) {
    return <div className="p-4 text-sm opacity-70">Loading recruitment chains…</div>;
  }
  const list = listQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Recruitment Chains
        </h2>
        <p className="text-sm opacity-80 mt-1 max-w-prose">
          Five named characters can join the crew of the inception ark — but
          they choose. Each chain is a three-stage conversation with branching
          choices. The choices you make shape who joins (loyal vs. tense) and
          how they fit. A refusal is permanent. Walk into the rooms where they
          already are.
        </p>
      </div>

      {selectedNpc === null ? (
        <RosterGrid
          list={list}
          recruitedKeys={recruitedKeys}
          onSelect={(k) => {
            setSelectedNpc(k);
            setLastReply(null);
          }}
        />
      ) : chainQuery.data ? (
        <ChainDetail
          data={chainQuery.data}
          recruited={recruitedKeys.has(selectedNpc)}
          lastReply={lastReply}
          onBack={() => {
            setSelectedNpc(null);
            setLastReply(null);
          }}
          onOpen={() => open.mutate({ npcKey: selectedNpc })}
          onChoose={(choiceId) =>
            makeChoice.mutate({ npcKey: selectedNpc, choiceId })
          }
          onRecruit={() => recruit.mutate({ npcKey: selectedNpc })}
          openPending={open.isPending}
          choicePending={makeChoice.isPending}
          recruitPending={recruit.isPending}
        />
      ) : (
        <div className="p-4 text-sm opacity-70">Loading chain…</div>
      )}
    </div>
  );
}

interface ListEntry {
  npcKey: NpcKey;
  displayName: string;
  briefing: string;
  gateOpen: boolean;
  gateReason?: string;
  progress: {
    currentStageId: string | null;
    outcome: Outcome;
  };
}

function RosterGrid(props: {
  list: ListEntry[];
  recruitedKeys: Set<string>;
  onSelect: (k: NpcKey) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {props.list.map((entry) => {
        const onCrew = props.recruitedKeys.has(entry.npcKey);
        const status = derivedStatus(entry, onCrew);
        return (
          <Card key={entry.npcKey}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{entry.displayName}</span>
                <StatusBadge status={status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="opacity-80 line-clamp-3">{entry.briefing}</p>
              {!entry.gateOpen ? (
                <p className="text-xs opacity-70 flex items-start gap-1">
                  <Lock className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{entry.gateReason ?? "Gated."}</span>
                </p>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => props.onSelect(entry.npcKey)}
              >
                <ChevronRight className="w-3 h-3 mr-1" />
                {onCrew
                  ? "Review chain"
                  : entry.progress.outcome
                    ? "Review outcome"
                    : entry.progress.currentStageId
                      ? "Continue chain"
                      : "Begin chain"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ChainDetail(props: {
  data: ChainData;
  recruited: boolean;
  lastReply: { speaker: string; text: string }[] | null;
  onBack: () => void;
  onOpen: () => void;
  onChoose: (choiceId: string) => void;
  onRecruit: () => void;
  openPending: boolean;
  choicePending: boolean;
  recruitPending: boolean;
}) {
  const { chain, progress, gate, visibleStage } = props.data;
  const outcome = progress.outcome as Outcome;
  const inProgress = progress.currentStageId !== null && outcome === null;
  const notOpened = progress.currentStageId === null && outcome === null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={props.onBack}>
          <ChevronLeft className="w-3 h-3 mr-1" />
          Back to roster
        </Button>
        <span className="text-sm font-semibold">{chain.displayName}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Briefing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="opacity-90">{chain.briefing}</p>
          {!gate.ok ? (
            <p className="text-amber-600 text-xs flex items-start gap-1">
              <Lock className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{gate.reason}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      {notOpened ? (
        <Card>
          <CardContent className="py-4 space-y-3 text-sm">
            <p className="opacity-80">
              The chain has not begun. Step into the room.
            </p>
            <Button
              disabled={!gate.ok || props.openPending}
              onClick={props.onOpen}
            >
              Begin
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {inProgress && visibleStage ? (
        <StageView
          stage={visibleStage}
          lastReply={props.lastReply}
          onChoose={props.onChoose}
          choicePending={props.choicePending}
        />
      ) : null}

      {outcome ? (
        <OutcomeView
          outcome={outcome}
          npcName={chain.displayName}
          recruited={props.recruited}
          relationshipTag={progress.recruitModifiers?.relationshipTag ?? null}
          startingLoyalty={progress.recruitModifiers?.startingLoyalty}
          onRecruit={props.onRecruit}
          recruitPending={props.recruitPending}
          lastReply={props.lastReply}
        />
      ) : null}
    </div>
  );
}

function StageView(props: {
  stage: RecruitmentStage | null;
  lastReply: { speaker: string; text: string }[] | null;
  onChoose: (choiceId: string) => void;
  choicePending: boolean;
}) {
  if (!props.stage) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{props.stage.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="opacity-80">{props.stage.description}</p>
        {props.lastReply && props.lastReply.length > 0 ? (
          <div className="rounded border border-foreground/10 p-3 space-y-1 text-xs italic opacity-90">
            <div className="font-semibold not-italic opacity-70">Reply</div>
            {props.lastReply.map((l, i) => (
              <p key={i}>
                <strong className="not-italic">{l.speaker}:</strong> {l.text}
              </p>
            ))}
          </div>
        ) : null}
        <div className="rounded border border-foreground/10 p-3 space-y-1 text-xs">
          {props.stage.scene.map((line, i) => (
            <p key={i}>
              <strong className="opacity-70">{line.speaker}:</strong>{" "}
              <span>{line.text}</span>
            </p>
          ))}
        </div>
        <div className="space-y-2 pt-1">
          <p className="text-xs opacity-70 uppercase tracking-wide">Your move</p>
          {props.stage.choices.map((choice) => (
            <Button
              key={choice.id}
              variant="outline"
              size="sm"
              disabled={props.choicePending}
              onClick={() => props.onChoose(choice.id)}
              className="w-full justify-start text-left h-auto py-2"
            >
              <span>
                <strong className="block">{choice.label}</strong>
                <span className="block text-xs opacity-70 mt-0.5">
                  {choice.preview}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OutcomeView(props: {
  outcome: NonNullable<Outcome>;
  npcName: string;
  recruited: boolean;
  relationshipTag: string | null;
  startingLoyalty?: number;
  onRecruit: () => void;
  recruitPending: boolean;
  lastReply: { speaker: string; text: string }[] | null;
}) {
  if (props.outcome === "refused") {
    return (
      <Card className="border-rose-500/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Skull className="w-4 h-4 text-rose-500" />
            Refused
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {props.lastReply && props.lastReply.length > 0 ? (
            <div className="rounded border border-foreground/10 p-3 space-y-1 text-xs italic opacity-90">
              {props.lastReply.map((l, i) => (
                <p key={i}>
                  <strong className="not-italic">{l.speaker}:</strong> {l.text}
                </p>
              ))}
            </div>
          ) : null}
          <p className="opacity-80">
            {props.npcName} declined. They will not return.
          </p>
        </CardContent>
      </Card>
    );
  }
  const isLoyal = props.outcome === "recruited_loyal";
  return (
    <Card className={isLoyal ? "border-emerald-500/40" : "border-amber-500/40"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className={`w-4 h-4 ${isLoyal ? "text-emerald-500" : "text-amber-500"}`} />
          {isLoyal ? "Recruited — Loyal" : "Recruited — Tense"}
          {props.relationshipTag ? (
            <Badge variant="outline" className="ml-2">
              {props.relationshipTag}
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        {props.lastReply && props.lastReply.length > 0 ? (
          <div className="rounded border border-foreground/10 p-3 space-y-1 text-xs italic opacity-90">
            {props.lastReply.map((l, i) => (
              <p key={i}>
                <strong className="not-italic">{l.speaker}:</strong> {l.text}
              </p>
            ))}
          </div>
        ) : null}
        <p className="opacity-80">
          {isLoyal
            ? `${props.npcName} agreed to your terms. They'll join with high starting loyalty.`
            : `${props.npcName} agreed despite themselves. They'll join, but tense — low starting loyalty.`}
          {typeof props.startingLoyalty === "number"
            ? ` Starting loyalty: ${props.startingLoyalty}.`
            : ""}
        </p>
        <Button
          disabled={props.recruited || props.recruitPending}
          onClick={props.onRecruit}
          variant={isLoyal ? "default" : "secondary"}
          className="w-full"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          {props.recruited
            ? "Already on crew"
            : isLoyal
              ? "Recruit to crew (loyal)"
              : "Recruit to crew (tense)"}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── helpers ─── */

function StatusBadge(props: { status: string }) {
  const map: Record<string, { label: string; tone: "default" | "outline" | "secondary" }> = {
    on_crew: { label: "On Crew", tone: "default" },
    loyal: { label: "Loyal — Press Recruit", tone: "default" },
    tense: { label: "Tense — Press Recruit", tone: "secondary" },
    refused: { label: "Refused", tone: "outline" },
    in_progress: { label: "In Progress", tone: "secondary" },
    closed: { label: "Closed", tone: "outline" },
  };
  const cfg = map[props.status] ?? map.closed;
  return <Badge variant={cfg.tone}>{cfg.label}</Badge>;
}

function derivedStatus(entry: ListEntry, onCrew: boolean): string {
  if (onCrew) return "on_crew";
  const o = entry.progress.outcome;
  if (o === "recruited_loyal") return "loyal";
  if (o === "recruited_tense") return "tense";
  if (o === "refused") return "refused";
  if (entry.progress.currentStageId) return "in_progress";
  return "closed";
}

function humanize(key: string): string {
  return key
    .split("_")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
}

