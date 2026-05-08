/* ═══════════════════════════════════════════════════════
   PERSONAL QUEST PANEL — apprentice 3-stage chain UI

   Reads:
     trpc.apprenticePersonalQuests.getStatus({ memberKey })
   Mutates:
     trpc.apprenticePersonalQuests.{open, advance, resolve}

   Renders the chain copy from APPRENTICE_IDENTITIES via the
   getStatus payload. Stage transitions are gated on bond
   thresholds (server enforces). Stage 3 surfaces the
   breaking-point fork — "deepen" or "break" — both with
   clear consequence copy. Selecting "break" triggers the
   apprenticeBetrayal descent on the next tick.

   File: apps/client/src/components/apprentice/PersonalQuestPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Heart, Skull, ChevronRight, BookOpen, Flag } from "lucide-react";

interface Props {
  memberKey: string;
}

export default function PersonalQuestPanel({ memberKey }: Props) {
  const utils = trpc.useUtils();
  const statusQuery = trpc.apprenticePersonalQuests.getStatus.useQuery({ memberKey });

  const open = trpc.apprenticePersonalQuests.open.useMutation({
    onSuccess: () => {
      utils.apprenticePersonalQuests.getStatus.invalidate({ memberKey });
      toast.success("Quest opened. Stage 1 begins.");
    },
    onError: (err) => toast.error(err.message),
  });
  const advance = trpc.apprenticePersonalQuests.advance.useMutation({
    onSuccess: (res) => {
      utils.apprenticePersonalQuests.getStatus.invalidate({ memberKey });
      toast.success(`Stage ${res.progress.stage} reached.`);
    },
    onError: (err) => toast.error(err.message),
  });
  const resolveMut = trpc.apprenticePersonalQuests.resolve.useMutation({
    onSuccess: (res, vars) => {
      utils.apprenticePersonalQuests.getStatus.invalidate({ memberKey });
      utils.crew.getState.invalidate();
      if (vars.choice === "deepened") {
        toast.success("Bond deepened. Romance arc unlockable.", { duration: 8000 });
      } else {
        toast.warning(
          "Trust broken. Their corruption is rising — watch for the betrayal warning.",
          { duration: 10000 },
        );
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const bondPct = useMemo(() => {
    if (!statusQuery.data) return 0;
    return Math.min(100, statusQuery.data.bond);
  }, [statusQuery.data]);

  if (statusQuery.isLoading) {
    return <div className="p-4 text-sm opacity-70">Loading personal quest…</div>;
  }
  if (statusQuery.error) {
    return (
      <Card>
        <CardContent className="py-4 text-sm opacity-80">
          {statusQuery.error.message}
        </CardContent>
      </Card>
    );
  }
  const data = statusQuery.data;
  if (!data) return null;
  const { progress, chain, bond, gates } = data;
  const stage = progress.stage;
  const resolution = progress.resolution;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              {chain.chainTitle}
            </span>
            <Badge variant={resolution ? "default" : "outline"}>
              {resolution
                ? resolution === "deepened"
                  ? "Deepened"
                  : "Broken"
                : stage === 0
                  ? "Closed"
                  : `Stage ${stage}`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-xs">
            <span>Bond</span>
            <span>{bond} / 100</span>
          </div>
          <Progress value={bondPct} />

          {stage === 0 ? (
            <div className="space-y-2">
              <p className="opacity-80">
                A personal story is waiting. Build your bond to {gates.open} to begin.
              </p>
              <Button
                disabled={bond < gates.open || open.isPending}
                onClick={() => open.mutate({ memberKey })}
              >
                Open the Quest
              </Button>
            </div>
          ) : null}

          {stage >= 1 ? (
            <Stage
              n={1}
              title={chain.stage1.title}
              description={chain.stage1.description}
              isCurrent={stage === 1}
              isComplete={stage > 1}
              gateLabel={`Bond ≥ ${gates.advance_to_2} to continue.`}
              actionLabel={
                stage === 1 ? `Advance to Stage 2 (bond ≥ ${gates.advance_to_2})` : undefined
              }
              actionDisabled={stage !== 1 || bond < gates.advance_to_2 || advance.isPending}
              onAction={() => advance.mutate({ memberKey, fromStage: 1 })}
            />
          ) : null}

          {stage >= 2 ? (
            <Stage
              n={2}
              title={chain.stage2.title}
              description={chain.stage2.description}
              isCurrent={stage === 2}
              isComplete={stage > 2}
              gateLabel={`Bond ≥ ${gates.advance_to_3} to reach the breaking point.`}
              actionLabel={
                stage === 2 ? `Advance to Stage 3 (bond ≥ ${gates.advance_to_3})` : undefined
              }
              actionDisabled={stage !== 2 || bond < gates.advance_to_3 || advance.isPending}
              onAction={() => advance.mutate({ memberKey, fromStage: 2 })}
            />
          ) : null}

          {stage === 3 ? (
            <BreakingPoint
              title={chain.stage3.title}
              description={chain.stage3.description}
              deepen={chain.stage3.deepenChoice}
              breakChoice={chain.stage3.breakChoice}
              resolution={resolution}
              pending={resolveMut.isPending}
              onResolve={(choice) =>
                resolveMut.mutate({ memberKey, choice })
              }
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Stage(props: {
  n: number;
  title: string;
  description: string;
  isCurrent: boolean;
  isComplete: boolean;
  gateLabel: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}) {
  return (
    <div className="rounded border border-foreground/10 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          Stage {props.n} — {props.title}
        </h4>
        {props.isComplete ? (
          <Badge variant="outline">Done</Badge>
        ) : props.isCurrent ? (
          <Badge>Current</Badge>
        ) : null}
      </div>
      <p className="text-xs opacity-80">{props.description}</p>
      {props.actionLabel ? (
        <Button
          size="sm"
          variant="outline"
          disabled={props.actionDisabled}
          onClick={props.onAction}
        >
          <ChevronRight className="w-3 h-3 mr-1" />
          {props.actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

function BreakingPoint(props: {
  title: string;
  description: string;
  deepen: { label: string; consequence: string };
  breakChoice: { label: string; consequence: string };
  resolution: "deepened" | "broken" | null;
  pending: boolean;
  onResolve: (choice: "deepened" | "broken") => void;
}) {
  if (props.resolution) {
    return (
      <div className="rounded border border-foreground/20 p-3 space-y-1 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          {props.resolution === "deepened" ? (
            <Heart className="w-4 h-4" />
          ) : (
            <Skull className="w-4 h-4" />
          )}
          Resolved — {props.resolution}
        </div>
        <p className="text-xs opacity-80">
          {props.resolution === "deepened"
            ? props.deepen.consequence
            : props.breakChoice.consequence}
        </p>
      </div>
    );
  }
  return (
    <div className="rounded border border-amber-500/40 p-3 space-y-3">
      <div>
        <h4 className="text-sm font-semibold">Breaking Point — {props.title}</h4>
        <p className="text-xs opacity-80 mt-1">{props.description}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          variant="default"
          size="sm"
          disabled={props.pending}
          onClick={() => props.onResolve("deepened")}
          className="justify-start text-left h-auto py-2"
        >
          <span>
            <Heart className="w-3 h-3 inline mr-1" />
            <strong className="block">{props.deepen.label}</strong>
            <span className="block text-xs opacity-80 mt-0.5">
              {props.deepen.consequence}
            </span>
          </span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={props.pending}
          onClick={() => props.onResolve("broken")}
          className="justify-start text-left h-auto py-2"
        >
          <span>
            <Skull className="w-3 h-3 inline mr-1" />
            <strong className="block">{props.breakChoice.label}</strong>
            <span className="block text-xs opacity-80 mt-0.5">
              {props.breakChoice.consequence}
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}
