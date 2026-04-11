/* ═══════════════════════════════════════════════════════
   CREW MISSIONS BOARD — Dispatch, watch, resolve
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Rocket, Skull, Clock, Target, AlertTriangle, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  CREW_MISSION_TEMPLATES,
  calculateMissionSuccess,
  findRivalPairs,
  findCloseBondPairs,
} from "@shared/crewMissions";
import type { CrewState, CrewMissionDifficulty } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
  onRefetch: () => void;
}

const DIFFICULTY_COLOR: Record<CrewMissionDifficulty, string> = {
  routine: "text-green-400 border-green-500/30",
  challenging: "text-yellow-400 border-yellow-500/30",
  dangerous: "text-orange-400 border-orange-500/30",
  suicidal: "text-red-400 border-red-500/50",
};

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "ready";
  const mins = Math.floor(ms / 60_000);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
}

export default function CrewMissionsBoard({ state, onRefetch }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);

  const dispatchMission = trpc.crew.dispatchMission.useMutation({
    onSuccess: () => {
      toast.success("Mission dispatched");
      setSelectedTemplate(null);
      setSelectedCrew([]);
      onRefetch();
    },
    onError: (e: any) => toast.error(e.message),
  });
  const acknowledge = trpc.crew.acknowledgeMission.useMutation({
    onSuccess: () => onRefetch(),
  });

  const eligible = useMemo(
    () => state.roster.members.filter(m => m.status === "active"),
    [state.roster.members],
  );

  const template = selectedTemplate
    ? CREW_MISSION_TEMPLATES.find(t => t.id === selectedTemplate)
    : null;

  const assigned = eligible.filter(m => selectedCrew.includes(m.id));
  const successPreview = template ? calculateMissionSuccess(template, assigned as any) : 0;
  const rivalPairs = findRivalPairs(assigned as any);
  const bondedPairs = findCloseBondPairs(assigned as any);

  const active = state.missions.filter(m => m.status === "dispatched");
  const resolved = state.missions.filter(m => m.status !== "dispatched");

  return (
    <div className="space-y-6">
      {/* Active missions */}
      {active.length > 0 && (
        <section>
          <div className="text-[11px] font-mono uppercase text-muted-foreground mb-2">
            Active ({active.length})
          </div>
          <div className="space-y-2">
            {active.map(m => {
              const pct = Math.min(
                100,
                ((Date.now() - m.dispatchedAt) / (m.completesAt - m.dispatchedAt)) * 100,
              );
              return (
                <div key={m.id} className="p-3 border border-border/40 bg-card/40 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-display text-sm font-semibold">{m.name}</div>
                    <Badge
                      variant="outline"
                      className={`text-[9px] ${DIFFICULTY_COLOR[m.difficulty]}`}
                    >
                      {m.difficulty}
                    </Badge>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mb-2">
                    {m.assignedCrewIds.length} crew · {Math.round(m.successChance * 100)}% success
                    projected
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="h-1 flex-1" />
                    <span className="text-[9px] font-mono text-muted-foreground w-14 text-right">
                      <Clock size={8} className="inline mr-0.5" />
                      {formatTimeLeft(m.completesAt - Date.now())}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Resolved missions awaiting acknowledgement */}
      {resolved.length > 0 && (
        <section>
          <div className="text-[11px] font-mono uppercase text-muted-foreground mb-2">
            Completed ({resolved.length})
          </div>
          <div className="space-y-2">
            {resolved.map(m => {
              const isWin = m.status === "succeeded";
              return (
                <div
                  key={m.id}
                  className={`p-3 border rounded ${
                    isWin ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-display text-sm font-semibold">{m.name}</div>
                    <Badge variant={isWin ? "default" : "destructive"} className="text-[9px]">
                      {m.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] font-mono italic mb-2 text-muted-foreground">
                    {m.resolution?.narrative}
                  </div>
                  {m.resolution && m.resolution.casualties.length > 0 && (
                    <div className="text-[10px] font-mono text-red-300 flex items-center gap-1 mb-2">
                      <Skull size={10} />
                      {m.resolution.casualties.length} lost
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px]"
                    onClick={() => acknowledge.mutate({ missionId: m.id })}
                  >
                    acknowledge
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Dispatch panel */}
      <section>
        <div className="text-[11px] font-mono uppercase text-muted-foreground mb-2">
          Dispatch New Mission
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Template list */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {CREW_MISSION_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`text-left p-3 border rounded transition ${
                  selectedTemplate === t.id
                    ? "border-primary bg-primary/5"
                    : "border-border/30 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-xs font-semibold">{t.name}</span>
                  <Badge variant="outline" className={`text-[9px] ${DIFFICULTY_COLOR[t.difficulty]}`}>
                    {t.difficulty}
                  </Badge>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground line-clamp-2">
                  {t.description}
                </div>
                <div className="text-[9px] font-mono text-muted-foreground mt-1">
                  {t.durationHours}h · {t.minCrew}–{t.maxCrew} crew · prefers{" "}
                  {t.preferredRole ?? "any"}
                </div>
              </button>
            ))}
          </div>

          {/* Crew assignment */}
          <div className="bg-card/30 border border-border/30 rounded p-3">
            {!template ? (
              <div className="text-center text-[11px] font-mono text-muted-foreground py-6">
                Select a mission
              </div>
            ) : (
              <>
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">
                  Assign crew
                </div>
                <div className="space-y-1 mb-3 max-h-64 overflow-y-auto">
                  {eligible.map(m => (
                    <button
                      key={m.id}
                      onClick={() =>
                        setSelectedCrew(prev =>
                          prev.includes(m.id)
                            ? prev.filter(id => id !== m.id)
                            : [...prev, m.id].slice(0, template.maxCrew),
                        )
                      }
                      className={`w-full text-left text-[10px] font-mono px-2 py-1 border rounded ${
                        selectedCrew.includes(m.id)
                          ? "border-primary bg-primary/10"
                          : "border-border/30"
                      }`}
                    >
                      {m.name}
                      {m.role === template.preferredRole && (
                        <span className="text-cyan-300 ml-1">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 bg-background/40 rounded border border-border/30 mb-3 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <Target size={10} className="text-primary" />
                    success projection: {Math.round(successPreview * 100)}%
                  </div>
                  {rivalPairs.length > 0 && (
                    <div className="text-[9px] font-mono text-red-300 flex items-start gap-1">
                      <AlertTriangle size={9} className="mt-0.5 shrink-0" />
                      <span>
                        Rivals on squad:{" "}
                        {rivalPairs
                          .map(([a, b]) => `${a.name} × ${b.name}`)
                          .join(", ")}
                        . Expect friction.
                      </span>
                    </div>
                  )}
                  {bondedPairs.length > 0 && (
                    <div className="text-[9px] font-mono text-cyan-300 flex items-start gap-1">
                      <Heart size={9} className="mt-0.5 shrink-0" />
                      <span>
                        Close bonds:{" "}
                        {bondedPairs
                          .map(([a, b]) => `${a.name} + ${b.name}`)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full gap-1"
                  disabled={
                    !template ||
                    selectedCrew.length < template.minCrew ||
                    selectedCrew.length > template.maxCrew
                  }
                  onClick={() => {
                    if (!template) return;
                    dispatchMission.mutate({
                      templateId: template.id,
                      crewIds: selectedCrew,
                    });
                  }}
                >
                  <Rocket size={12} />
                  dispatch
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
