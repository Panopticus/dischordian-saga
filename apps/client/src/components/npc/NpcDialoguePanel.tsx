/* ═══════════════════════════════════════════════════════
   NPC DIALOGUE PANEL — BioWare-style topic conversations
   for the 12 named tier-2/tier-3 NPCs.

   Mirror of apprentice DialoguePanel — reads from the
   npcDialogues router instead of apprenticeDialogues.
   Tier-3 cosmic NPCs have higher bond gates and a softer
   gating UX (the topic surface still browses; the actual
   choice action gates server-side).

   File: apps/client/src/components/npc/NpcDialoguePanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MessageCircle,
  Heart,
  HelpCircle,
  Snowflake,
  Smile,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  NpcDialogueChoice,
  NpcDialogueTopic,
  NpcDialogueTone,
} from "@shared/npcDialogues";

interface Props {
  npcKey: string;
}

const TONE_ICON: Record<NpcDialogueTone, ReactNode> = {
  warm: <Heart className="w-3 h-3 text-rose-400" />,
  probing: <HelpCircle className="w-3 h-3 text-sky-400" />,
  cold: <Snowflake className="w-3 h-3 text-slate-400" />,
  playful: <Smile className="w-3 h-3 text-amber-400" />,
  wary: <Eye className="w-3 h-3 text-violet-400" />,
};

const KIND_LABEL: Record<string, string> = {
  past: "The Past",
  calling: "The Calling",
  mortality: "Mortality",
  us: "Us",
};

export default function NpcDialoguePanel({ npcKey }: Props) {
  const utils = trpc.useUtils();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const listQuery = trpc.npcDialogues.listForNpc.useQuery({ npcKey });
  const topicQuery = trpc.npcDialogues.getTopic.useQuery(
    { npcKey, topicId: activeTopicId ?? "" },
    { enabled: activeTopicId !== null },
  );

  const pick = trpc.npcDialogues.pickChoice.useMutation({
    onSuccess: (res) => {
      utils.npcDialogues.listForNpc.invalidate({ npcKey });
      utils.npcDialogues.getTopic.invalidate({
        npcKey,
        topicId: activeTopicId ?? "",
      });
      if (res.sealed) toast.info("Conversation sealed.", { duration: 4000 });
    },
    onError: (err) => toast.error(err.message),
  });

  if (listQuery.isLoading) {
    return <div className="p-4 text-sm opacity-70">Loading dialogues…</div>;
  }
  if (listQuery.error) {
    return (
      <Card>
        <CardContent className="py-4 text-sm opacity-80">
          {listQuery.error.message}
        </CardContent>
      </Card>
    );
  }
  if (!listQuery.data) return null;

  if (activeTopicId === null) {
    return (
      <TopicList
        displayName={listQuery.data.displayName}
        epithet={listQuery.data.epithet}
        signatureLine={listQuery.data.signatureLine}
        tier={listQuery.data.tier}
        topics={listQuery.data.topics}
        onSelect={(id) => setActiveTopicId(id)}
      />
    );
  }

  if (topicQuery.isLoading) {
    return <div className="p-4 text-sm opacity-70">Loading topic…</div>;
  }
  if (topicQuery.error) {
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" onClick={() => setActiveTopicId(null)}>
          <ChevronLeft className="w-3 h-3 mr-1" /> Back
        </Button>
        <Card>
          <CardContent className="py-4 text-sm opacity-80">
            {topicQuery.error.message}
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!topicQuery.data) return null;

  return (
    <TopicScene
      data={topicQuery.data}
      onBack={() => setActiveTopicId(null)}
      onPick={(choiceId) =>
        pick.mutate({ npcKey, topicId: activeTopicId, choiceId })
      }
      pending={pick.isPending}
    />
  );
}

interface TopicListEntry {
  id: string;
  kind: string;
  title: string;
  hook: string;
  bondGate: number;
  progress: {
    sealed: boolean;
    pathChoices: readonly string[];
    bondDeltaApplied: number;
  } | null;
}

function TopicList(props: {
  displayName: string;
  epithet: string;
  signatureLine: string;
  tier: "2" | "3";
  topics: TopicListEntry[];
  onSelect: (topicId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {props.displayName}
        </h3>
        <p className="text-xs opacity-70 mt-1">{props.epithet}</p>
        <p className="text-xs italic opacity-60 mt-2">"{props.signatureLine}"</p>
      </div>
      <div className="grid gap-2">
        {props.topics.map((t) => {
          const heard = t.progress?.sealed === true;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => props.onSelect(t.id)}
              className="rounded border border-foreground/10 p-3 text-left hover:bg-foreground/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                  {KIND_LABEL[t.kind] ?? t.kind} — {t.title}
                </span>
                {heard ? (
                  <Badge variant="outline">Heard</Badge>
                ) : (
                  <Badge variant="outline">
                    {props.tier === "3" ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Bond ≥ {t.bondGate}
                      </>
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-70 mt-1">{t.hook}</p>
              {heard && t.progress ? (
                <p className="text-xs opacity-50 mt-1">
                  Played {t.progress.pathChoices.length} choice{t.progress.pathChoices.length === 1 ? "" : "s"}.
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SceneData {
  topic: NpcDialogueTopic;
  pickedSoFar: NpcDialogueChoice[];
  nextChoices: NpcDialogueChoice[];
  sealed: boolean;
  progress: {
    pathChoices: readonly string[];
    bondDeltaApplied: number;
  };
}

function TopicScene(props: {
  data: SceneData;
  onBack: () => void;
  onPick: (choiceId: string) => void;
  pending: boolean;
}) {
  const { topic, pickedSoFar, nextChoices, sealed } = props.data;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={props.onBack}>
          <ChevronLeft className="w-3 h-3 mr-1" /> Back to topics
        </Button>
        <span className="text-sm font-semibold">
          {KIND_LABEL[topic.kind] ?? topic.kind} — {topic.title}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{topic.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded border border-foreground/10 p-3 space-y-1 italic opacity-90">
            {topic.opener.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {pickedSoFar.map((choice) => (
            <div key={choice.id} className="space-y-2">
              <div className="rounded border border-foreground/10 p-2 text-xs">
                <strong className="opacity-70">You: </strong>
                {choice.playerText}
              </div>
              <div className="rounded border border-foreground/10 p-3 space-y-1 italic opacity-90">
                {choice.npcReply.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          ))}

          {!sealed && nextChoices.length > 0 ? (
            <div className="space-y-2 pt-1">
              <p className="text-xs opacity-70 uppercase tracking-wide">
                Your move
              </p>
              {nextChoices.map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  variant="outline"
                  disabled={props.pending}
                  onClick={() => props.onPick(c.id)}
                  className="w-full justify-start text-left h-auto py-2"
                >
                  <span className="flex items-start gap-2">
                    <span className="mt-1 shrink-0">{TONE_ICON[c.tone]}</span>
                    <span>
                      <strong className="block">{c.playerText}</strong>
                      <span className="block text-xs opacity-60 mt-0.5">
                        {c.tone}
                        {c.bondDelta !== 0
                          ? ` · bond ${c.bondDelta >= 0 ? "+" : ""}${c.bondDelta}`
                          : ""}
                        {c.followups && c.followups.length > 0
                          ? " · deepens"
                          : ""}
                      </span>
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          ) : null}

          {sealed ? (
            <p className="text-xs opacity-70 pt-1">
              Sealed. Bond{" "}
              {props.data.progress.bondDeltaApplied >= 0 ? "+" : ""}
              {props.data.progress.bondDeltaApplied}.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
