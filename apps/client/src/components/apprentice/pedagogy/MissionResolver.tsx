/* ═══════════════════════════════════════════════════════
   MISSION RESOLVER — Graduate-Legion crisis decision UI.

   Three beats: briefing letter, mid-mission crisis with
   2–4 player choices, return scene. The runtime picks the
   mission via apprentice archetype × doctrine × role.

   File: apps/client/src/components/apprentice/pedagogy/MissionResolver.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Inbox, CheckCircle, AlertCircle } from "lucide-react";

type DoctrineId =
  | "compliant_mouth" | "forked_path" | "cold_hand"
  | "heretical_quiet" | "human_remainder";

type GraduateRole =
  | "companion" | "cryo_vault" | "army_leader" | "trade_envoy"
  | "tower_captain" | "sacrificed" | "relationship_gift";

type Archetype =
  | "zealot" | "ghost" | "scholar" | "revenant" | "artisan" | "oracle"
  | "wanderer" | "martyr" | "heretic" | "jester" | "sentinel" | "prodigal";

interface Props {
  apprenticeId: string;
  apprenticeName: string;
  apprenticeArchetype: Archetype;
  doctrineId: DoctrineId;
  role: GraduateRole;
}

export default function MissionResolver({
  apprenticeId, apprenticeName, apprenticeArchetype, doctrineId, role,
}: Props) {
  const utils = trpc.useUtils();
  const activeQuery = trpc.apprenticePedagogy.missionListActive.useQuery();
  const catalogQuery = trpc.apprenticePedagogy.missionCatalog.useQuery();

  const myMissions = (activeQuery.data ?? []).filter(m => m.apprenticeId === apprenticeId);
  const pendingCrisis = myMissions.find(m => m.stage === "crisis_pending");
  const resolvedMissions = myMissions.filter(m => m.stage === "resolved");

  const [briefingTriggered, setBriefingTriggered] = useState(false);

  const brief = trpc.apprenticePedagogy.missionBrief.useMutation({
    onSuccess: (res) => {
      utils.apprenticePedagogy.missionListActive.invalidate();
      toast.success(`${apprenticeName} has been briefed for ${res.mission.name}.`);
      setBriefingTriggered(true);
    },
    onError: (e) => toast.error(e.message),
  });

  const resolve = trpc.apprenticePedagogy.missionResolve.useMutation({
    onSuccess: () => {
      utils.apprenticePedagogy.missionListActive.invalidate();
      toast.success("Mission resolved.");
    },
    onError: (e) => toast.error(e.message),
  });

  const interpolate = (template: string) =>
    template.replace(/\{name\}/g, apprenticeName);

  const pendingMission = useMemo(() => {
    if (!pendingCrisis) return null;
    return catalogQuery.data?.find(m => m.id === pendingCrisis.missionTypeId) ?? null;
  }, [pendingCrisis, catalogQuery.data]);

  return (
    <div className="space-y-3">
      {!pendingCrisis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="w-5 h-5" />
              Brief {apprenticeName} for {role.replace("_", " ")} duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              disabled={brief.isPending || briefingTriggered}
              onClick={() => brief.mutate({
                apprenticeId, apprenticeArchetype,
                doctrineId, role,
              })}
            >
              {brief.isPending ? "Briefing..." : "Open mission file"}
            </Button>
          </CardContent>
        </Card>
      )}

      {pendingCrisis && pendingMission && (
        <Card className="border-amber-700/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Inbox className="w-5 h-5 text-amber-300" />
              {pendingMission.name}
            </CardTitle>
            <div className="text-xs text-slate-400">{pendingMission.subtitle}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Briefing</div>
              <div className="text-sm italic text-slate-300 whitespace-pre-wrap">
                {interpolate(pendingMission.briefingTemplate)}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Crisis</div>
              <div className="text-sm text-slate-200 whitespace-pre-wrap">
                {interpolate(pendingMission.crisisPrompt)}
              </div>
            </div>

            <div className="space-y-2">
              {pendingMission.crisisChoices.map(c => (
                <button
                  key={c.id}
                  disabled={resolve.isPending}
                  onClick={() => resolve.mutate({
                    missionInstanceId: pendingCrisis.id,
                    missionTypeId: pendingMission.id,
                    choiceId: c.id,
                  })}
                  className="w-full text-left p-3 rounded border border-slate-800 hover:border-amber-500 transition-colors"
                >
                  <div className="text-sm font-medium">{interpolate(c.label)}</div>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs">
                    <Badge className="bg-slate-800 text-slate-300">
                      bond {c.bondDelta >= 0 ? "+" : ""}{c.bondDelta}
                    </Badge>
                    <Badge className="bg-slate-800 text-slate-300">
                      corrupt {c.corruptionDelta >= 0 ? "+" : ""}{c.corruptionDelta}
                    </Badge>
                    <Badge className="bg-slate-800 text-slate-300">
                      arch {c.architectInfluenceDelta >= 0 ? "+" : ""}{c.architectInfluenceDelta}
                    </Badge>
                    <Badge className="bg-slate-800 text-slate-300">
                      reward ×{c.rewardMultiplier.toFixed(2)}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {resolvedMissions.length > 0 && catalogQuery.data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mission History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resolvedMissions
              .sort((a, b) => (b.resolvedAt ?? 0) - (a.resolvedAt ?? 0))
              .map(m => {
                const mission = catalogQuery.data.find(x => x.id === m.missionTypeId);
                const choice = mission?.crisisChoices.find(c => c.id === m.resolvedChoiceId);
                return (
                  <div key={m.id} className="border border-slate-800 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {mission?.name ?? m.missionTypeId}
                      </div>
                      <Badge className="bg-slate-800 text-slate-300 text-xs">
                        ×{(m.rewardMultiplierApplied / 100).toFixed(2)} reward
                      </Badge>
                    </div>
                    {choice && (
                      <>
                        <div className="text-xs text-slate-400 mb-1">{interpolate(choice.label)}</div>
                        <div className="text-xs italic text-slate-500 whitespace-pre-wrap">
                          {interpolate(choice.outcomeFlavor)}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {!pendingCrisis && resolvedMissions.length === 0 && !brief.isPending && !briefingTriggered && (
        <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
          <AlertCircle className="w-3.5 h-3.5" />
          No active mission. Brief {apprenticeName} to start one.
        </div>
      )}
    </div>
  );
}
