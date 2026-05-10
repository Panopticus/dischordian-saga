/* ═══════════════════════════════════════════════════════
   COMMONS SCENES PANEL — fires authored vignettes from
   commonsScenePool.ts when the player visits the Common
   Room with their cohort co-present.

   Three sub-zones (bar / long_table / alcove) surface
   different scene flavors:
     • bar         — cohort drinking / unwind
     • long_table  — cohort meal-time
     • alcove      — romance / intimate moments

   This panel is the wiring layer the audit noted as
   missing: scene pool was authored but nothing rendered
   it. Mounts as a section inside GuildCommonRoomPage.

   File: apps/client/src/components/commons/CommonsScenesPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useState, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { useApprenticeStore } from "@/stores/apprenticeStore";
import {
  rollCommonsScenes,
  type CommonsScene,
  type ParticipantTag,
} from "@shared/commonsScenePool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Users, Heart } from "lucide-react";

const SUBZONE_LABEL: Record<CommonsScene["subzone"], string> = {
  bar: "Bar",
  long_table: "Long Table",
  alcove: "Alcove",
};

const SUBZONE_ICON: Record<CommonsScene["subzone"], React.ReactNode> = {
  bar: <Coffee className="w-4 h-4" />,
  long_table: <Users className="w-4 h-4" />,
  alcove: <Heart className="w-4 h-4 text-rose-300" />,
};

export function CommonsScenesPanel() {
  const { state } = useGame();
  const apprentice = useApprenticeStore(s => s.current);
  const [activeScene, setActiveScene] = useState<CommonsScene | null>(null);
  const [lineIdx, setLineIdx] = useState(0);

  // Build the present-set: active apprentice's archetype + recruited NPC keys.
  const present = useMemo<Set<ParticipantTag>>(() => {
    const s = new Set<ParticipantTag>();
    if (apprentice) s.add(apprentice.archetype);
    const flags = state.narrativeFlags;
    const recruits: Array<ParticipantTag> = ["vex_solene", "wraith_calder", "locke", "jericho_jones", "akai_shi"];
    for (const r of recruits) {
      if (flags[`${r}_recruited`]) s.add(r);
    }
    return s;
  }, [apprentice, state.narrativeFlags]);

  // Pick 3 eligible scenes deterministically by user + day.
  const playedIds = useMemo<Set<string>>(() => {
    // Sourced from a future-state played-scenes flag bag. For now,
    // accept that scenes can re-fire across visits — the alternative
    // (locking after one play) is too punishing without persistence.
    return new Set();
  }, []);

  const eligibleScenes = useMemo(() => {
    if (present.size < 1) return [];
    return rollCommonsScenes({
      present,
      playedIds,
      seed: simpleSeed(present),
      count: 3,
    });
  }, [present, playedIds]);

  if (eligibleScenes.length === 0) {
    return (
      <div className="text-xs text-slate-500 italic px-1 py-3">
        No vignettes available — recruit crew or wait for the cohort to
        co-occupy the Commons.
      </div>
    );
  }

  if (activeScene) {
    const line = activeScene.lines[lineIdx];
    return (
      <Card className="border-amber-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {SUBZONE_ICON[activeScene.subzone]}
            {SUBZONE_LABEL[activeScene.subzone]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {line && (
            <>
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-1">
                {String(line.speaker).replace(/_/g, " ")}
              </div>
              <div className="text-sm italic text-slate-200 mb-3">"{line.text}"</div>
              <div className="text-[10px] text-slate-500">
                {lineIdx + 1} / {activeScene.lines.length}
              </div>
            </>
          )}
          <div className="mt-3 flex gap-2">
            {lineIdx < activeScene.lines.length - 1 ? (
              <Button size="sm" onClick={() => setLineIdx(i => i + 1)}>
                Listen
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setActiveScene(null);
                  setLineIdx(0);
                }}
              >
                Step away
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-300 px-1">
        The Commons is in session. The cohort is here.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {eligibleScenes.map(scene => (
          <Card
            key={scene.id}
            className="cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                {SUBZONE_ICON[scene.subzone]}
                {SUBZONE_LABEL[scene.subzone]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-2">
                {scene.participants.map(p => (
                  <Badge key={String(p)} className="bg-slate-800 text-slate-300 text-[9px]">
                    {String(p).replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setActiveScene(scene);
                  setLineIdx(0);
                }}
              >
                Approach
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function simpleSeed(present: Set<ParticipantTag>): number {
  // Day-bucketed determinism: same set of present participants on the
  // same day rolls the same vignettes. Reroll on the next day or when
  // the cohort composition changes.
  const dayBucket = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  let seed = dayBucket;
  for (const tag of present) {
    for (const ch of String(tag)) seed = (seed * 33 + ch.charCodeAt(0)) | 0;
  }
  return Math.abs(seed) || 1;
}
