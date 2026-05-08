/* ═══════════════════════════════════════════════════════
   DIALOGUE PANEL — BioWare-style topic conversations.

   Renders the four topics for an apprentice:
     past / calling / mortality / us

   Each topic gates on bond. Picking a topic opens an inline
   scene: the NPC's opener, then a row of player choices
   tagged with tone icons (warm / probing / cold / playful /
   wary). Picking a choice plays the NPC reply and either
   reveals follow-up choices (probing branches) or seals
   the topic (the rest).

   Sealed topics show their full played path on re-open with
   a "Heard" tag. Bond delta from the conversation is applied
   atomically when the topic seals — the crew member's
   loyalty stat shifts on the same tick.

   File: apps/client/src/components/apprentice/DialoguePanel.tsx
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
  DialogueChoice,
  DialogueTopic,
  DialogueTone,
} from "@shared/apprenticeDialogues";

interface Props {
  memberKey: string;
}

const TONE_ICON: Record<DialogueTone, ReactNode> = {
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

export default function DialoguePanel({ memberKey }: Props) {
  const utils = trpc.useUtils();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const listQuery = trpc.apprenticeDialogues.listForMember.useQuery({ memberKey });
  const topicQuery = trpc.apprenticeDialogues.getTopic.useQuery(
    { memberKey, topicId: activeTopicId ?? "" },
    { enabled: activeTopicId !== null },
  );

  const pick = trpc.apprenticeDialogues.pickChoice.useMutation({
    onSuccess: (res) => {
      utils.apprenticeDialogues.listForMember.invalidate({ memberKey });
      utils.apprenticeDialogues.getTopic.invalidate({
        memberKey,
        topicId: activeTopicId ?? "",
      });
      utils.crew.getState.invalidate();
      if (res.sealed && res.progress.bondDeltaApplied !== 0) {
        const sign = res.progress.bondDeltaApplied >= 0 ? "+" : "";
        toast.success(
          `Conversation sealed. Bond ${sign}${res.progress.bondDeltaApplied}.`,
          { duration: 6000 },
        );
      } else if (res.sealed) {
        toast.info("Conversation sealed.", { duration: 4000 });
      }
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

  if (activeTopicId === null) {
    return (
      <TopicList
        topics={listQuery.data ?? []}
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
        pick.mutate({ memberKey, topicId: activeTopicId, choiceId })
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
  unlocked: boolean;
  progress: {
    sealed: boolean;
    pathChoices: readonly string[];
    bondDeltaApplied: number;
  } | null;
}

function TopicList(props: {
  topics: TopicListEntry[];
  onSelect: (topicId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Talk to them
        </h3>
        <p className="text-xs opacity-70 mt-1">
          Topics unlock as bond rises. Each conversation is one-shot.
        </p>
      </div>
      <div className="grid gap-2">
        {props.topics.map((t) => {
          const heard = t.progress?.sealed === true;
          return (
            <button
              key={t.id}
              type="button"
              disabled={!t.unlocked}
              onClick={() => props.onSelect(t.id)}
              className="rounded border border-foreground/10 p-3 text-left disabled:opacity-50 hover:bg-foreground/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                  {KIND_LABEL[t.kind] ?? t.kind} — {t.title}
                </span>
                {heard ? (
                  <Badge variant="outline">Heard</Badge>
                ) : !t.unlocked ? (
                  <Badge variant="outline">
                    <Lock className="w-3 h-3 mr-1" /> Bond ≥ {t.bondGate}
                  </Badge>
                ) : (
                  <Badge>
                    <ChevronRight className="w-3 h-3" />
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-70 mt-1">{t.hook}</p>
              {heard && t.progress ? (
                <p className="text-xs opacity-50 mt-1">
                  Played {t.progress.pathChoices.length}{" "}
                  choice{t.progress.pathChoices.length === 1 ? "" : "s"}.
                  Bond {t.progress.bondDeltaApplied >= 0 ? "+" : ""}
                  {t.progress.bondDeltaApplied}.
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
  topic: DialogueTopic;
  pickedSoFar: DialogueChoice[];
  nextChoices: DialogueChoice[];
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
          {/* Opener */}
          <div className="rounded border border-foreground/10 p-3 space-y-1 italic opacity-90">
            {topic.opener.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* Played choices so far + their replies */}
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

          {/* Next choices, if any */}
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
