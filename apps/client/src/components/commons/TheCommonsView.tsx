/* ═══════════════════════════════════════════════════════
   THE COMMONS — Social-room view.

   Mass Effect / Dragon Age tactic — you walk into a room,
   characters are mid-conversation, you can Approach,
   Eavesdrop, or Leave. Each scene mutates the relationship
   graph; cohesion ("how well everyone gets along") rolls
   up into a global weather badge.

   File: apps/client/src/components/commons/TheCommonsView.tsx
   tRPC: trpc.commons.{getState,rollScenes,approachScene,eavesdrop}
   ═══════════════════════════════════════════════════════ */

import { useState, useMemo, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Coffee, Users, MessageCircleHeart, Eye, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { CommonsScene } from "@shared/commonsScenePool";

const WEATHER_LABEL: Record<string, string> = {
  hostile: "Hostile",
  tense: "Tense",
  warm: "Warm",
  bonded: "Bonded",
  family: "Family",
};
const WEATHER_BADGE: Record<string, "default" | "outline" | "destructive"> = {
  hostile: "destructive",
  tense: "outline",
  warm: "outline",
  bonded: "default",
  family: "default",
};

const SUBZONE_ICON: Record<CommonsScene["subzone"], ReactNode> = {
  bar: <Coffee className="w-4 h-4" />,
  long_table: <Users className="w-4 h-4" />,
  alcove: <MessageCircleHeart className="w-4 h-4" />,
};

export default function TheCommonsView() {
  const utils = trpc.useUtils();
  const stateQuery = trpc.commons.getState.useQuery();
  const scenesQuery = trpc.commons.rollScenes.useQuery({ count: 3 });
  const approachScene = trpc.commons.approachScene.useMutation({
    onSuccess: (res) => {
      utils.commons.getState.invalidate();
      utils.crew.getState.invalidate();
      toast.success(res.consequence);
    },
  });
  const eavesdrop = trpc.commons.eavesdrop.useMutation({
    onSuccess: () => toast.success("Logged. They didn't notice."),
  });
  const [selectedScene, setSelectedScene] = useState<CommonsScene | null>(null);

  const social = stateQuery.data;
  const scenes = useMemo(() => scenesQuery.data ?? [], [scenesQuery.data]);

  return (
    <div className="void-card p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="void-heading-2">The Commons</h2>
          <p className="void-text-secondary text-sm mt-1">
            Where the crew lives between the missions.
          </p>
        </div>
        {social ? (
          <div className="flex items-center gap-3">
            <span className="void-text-secondary text-sm">
              Cohesion {social.cohesionScore} ·{" "}
              <span className="void-text-primary">
                {(social.weatherMultiplier * 100).toFixed(0)}% combat
              </span>
            </span>
            <Badge variant={WEATHER_BADGE[social.weather] ?? "outline"}>
              {WEATHER_LABEL[social.weather] ?? social.weather}
            </Badge>
          </div>
        ) : null}
      </header>

      {social ? (
        <>
          {social.openTensions.length > 0 ? (
            <div className="mb-4 p-3 rounded void-bg-card void-border-subtle">
              <span className="void-text-secondary text-sm">
                {social.openTensions.length} open tension
                {social.openTensions.length === 1 ? "" : "s"} on the ship.
                Mediating in the Commons softens them.
              </span>
            </div>
          ) : null}
        </>
      ) : null}

      <h3 className="void-heading-4 text-sm mb-3">In progress now</h3>

      {scenes.length === 0 ? (
        <p className="void-text-secondary">
          The Commons is quiet. Recruit more apprentices or NPCs to spawn
          banter.
        </p>
      ) : (
        <ul className="space-y-3">
          {scenes.map((s) => (
            <li
              key={s.id}
              className="p-4 rounded void-bg-card void-border-subtle"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="void-text-secondary">
                  {SUBZONE_ICON[s.subzone]}
                </span>
                <Badge variant="outline" className="text-xs">
                  {s.subzone.replace("_", " ")}
                </Badge>
                <span className="void-text-tertiary text-xs">
                  {s.participants.join(" × ")}
                </span>
              </div>
              <ul className="mb-3 space-y-1">
                {s.lines.map((line, i) => (
                  <li key={i} className="text-sm">
                    <span className="void-text-secondary">{line.speaker}:</span>{" "}
                    <span className="void-text-primary">{line.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedScene(s)}
                >
                  Approach
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => eavesdrop.mutate({ sceneId: s.id })}
                  disabled={eavesdrop.isPending}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Eavesdrop
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedScene ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setSelectedScene(null)}
        >
          <div
            className="void-card max-w-xl w-full p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="void-heading-3">Approach the conversation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedScene(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="void-text-secondary text-sm mb-4">
              {selectedScene.participants.join(" × ")} ·{" "}
              {selectedScene.subzone.replace("_", " ")}
            </p>
            <ul className="space-y-2">
              {selectedScene.approachChoices.map((c, i) => (
                <li key={i}>
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start h-auto py-3"
                    onClick={() => {
                      approachScene.mutate({
                        sceneId: selectedScene.id,
                        choiceIndex: i,
                      });
                      setSelectedScene(null);
                    }}
                    disabled={approachScene.isPending}
                  >
                    <div>
                      <div className="font-medium">{c.label}</div>
                      <div className="void-text-tertiary text-xs">
                        Bond delta {c.bondDelta > 0 ? "+" : ""}
                        {c.bondDelta}
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
