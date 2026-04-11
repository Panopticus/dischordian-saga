/* ═══════════════════════════════════════════════════════
   INCUBATOR MONITOR — Pod visualization, hatch, repair
   ═══════════════════════════════════════════════════════ */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, Wrench, Dna } from "lucide-react";
import { getTemplate } from "@/game/crewGenetics";
import type { CrewState, SerializedPod } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
  onHatch: (podId: number) => void;
  onRepair: (podId: number) => void;
  onCancel: (podId: number) => void;
}

function PodCard({ pod, onHatch, onRepair, onCancel }: {
  pod: SerializedPod;
  onHatch: (id: number) => void;
  onRepair: (id: number) => void;
  onCancel: (id: number) => void;
}) {
  const template = pod.templateId ? getTemplate(pod.templateId) : null;
  const pct =
    pod.totalTimeHours > 0
      ? Math.max(0, Math.min(100, ((pod.totalTimeHours - pod.timeRemainingHours) / pod.totalTimeHours) * 100))
      : 0;

  const statusColor = {
    empty: "border-border/30",
    gestating: "border-cyan-500/40",
    ready: "border-green-500/60",
    malfunction: "border-red-500/60",
  }[pod.status];

  return (
    <div className={`p-4 border rounded bg-card/40 ${statusColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Dna size={14} className="text-muted-foreground" />
          <span className="font-mono text-xs">POD {pod.id.toString().padStart(2, "0")}</span>
        </div>
        <Badge
          variant={
            pod.status === "ready"
              ? "default"
              : pod.status === "malfunction"
                ? "destructive"
                : pod.status === "gestating"
                  ? "secondary"
                  : "outline"
          }
          className="text-[9px] uppercase"
        >
          {pod.status}
        </Badge>
      </div>

      {pod.status === "empty" ? (
        <div className="text-center py-6 text-[11px] font-mono text-muted-foreground/70">
          awaiting genetic template
        </div>
      ) : (
        <>
          <div className="mb-2">
            <div className="font-display text-sm">{template?.name ?? "unknown"}</div>
            <div className="text-[10px] font-mono text-muted-foreground">
              gen {pod.generation} · integrity {pod.geneticIntegrity}%
            </div>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2">
              <Clock size={10} className="text-muted-foreground" />
              <Progress value={pct} className="h-1.5 flex-1" />
              <span className="text-[9px] font-mono text-muted-foreground w-14 text-right">
                {pod.timeRemainingHours.toFixed(1)}h
              </span>
            </div>
            {pod.geneticIntegrity < 80 && (
              <div className="flex items-center gap-1 text-[9px] font-mono text-yellow-500">
                <AlertTriangle size={10} />
                genetic integrity warning
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {pod.status === "ready" && (
              <Button size="sm" className="flex-1 h-7 text-[10px]" onClick={() => onHatch(pod.id)}>
                hatch
              </Button>
            )}
            {pod.status === "malfunction" && (
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 h-7 text-[10px] gap-1"
                onClick={() => onRepair(pod.id)}
              >
                <Wrench size={10} />
                repair
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[10px]"
              onClick={() => onCancel(pod.id)}
            >
              cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function IncubatorMonitor({ state, onHatch, onRepair, onCancel }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-mono text-muted-foreground">
          {state.incubator.pods.filter(p => p.status !== "empty").length} /{" "}
          {state.incubator.pods.length} pods in use · {state.incubator.totalCloned} total cloned
        </div>
        {state.incubator.malfunctionCount > 0 && (
          <Badge variant="destructive" className="text-[9px]">
            {state.incubator.malfunctionCount} lifetime malfunctions
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.incubator.pods.map(pod => (
          <PodCard
            key={pod.id}
            pod={pod}
            onHatch={onHatch}
            onRepair={onRepair}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
}
