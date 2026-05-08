/* ═══════════════════════════════════════════════════════
   RESURRECTION PROTOCOL PANEL

   The cosmic-petition UI. Shows open quests for fallen
   recruited NPCs, the procedurally rolled 4-of-7 sub-task
   recipe, sub-task progress, and the Path A completion
   button when all sub-tasks land.

   Surfaces the Human + Elara briefing copy on first open.

   File: apps/client/src/components/resurrection/ResurrectionProtocolPanel.tsx
   tRPC: trpc.resurrection.{getState,getBriefing,markSubtaskComplete,completePathA}
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Hammer,
  Heart,
  Skull,
  FlaskConical,
  Coins,
  BookOpen,
  Gavel,
  ChevronRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  PROTOCOL_SUBTASKS,
  type ProtocolSubtaskId,
  type ResurrectableNpcKey,
} from "@shared/resurrectionProtocols";

const SUBTASK_ICON: Record<ProtocolSubtaskId, ReactNode> = {
  forge_the_vessel: <Hammer className="w-4 h-4" />,
  lineage_imprint: <Heart className="w-4 h-4" />,
  hellbox_cycle_echo: <Skull className="w-4 h-4" />,
  soul_stone_catalyst: <FlaskConical className="w-4 h-4" />,
  trade_empire_tribute: <Coins className="w-4 h-4" />,
  loredex_witness: <BookOpen className="w-4 h-4" />,
  confession_trial: <Gavel className="w-4 h-4" />,
};

const NPC_DISPLAY: Record<ResurrectableNpcKey, string> = {
  vex_solene: "Vex Solène",
  wraith_calder: "Wraith Calder",
  locke: "Adjudicator Locke",
  jericho_jones: "Jericho Jones",
  akai_shi: "Akai Shi",
};

export default function ResurrectionProtocolPanel() {
  const utils = trpc.useUtils();
  const stateQuery = trpc.resurrection.getState.useQuery();
  const drainSideEffects = trpc.resurrection.drainSideEffects.useMutation({
    onSuccess: () => utils.resurrection.getState.invalidate(),
  });
  const completeSubtask = trpc.resurrection.markSubtaskComplete.useMutation({
    onSuccess: () => {
      utils.resurrection.getState.invalidate();
      toast.success("Sub-task complete. The Cycle Walker is listening.");
    },
  });
  const completePathA = trpc.resurrection.completePathA.useMutation({
    onSuccess: (res) => {
      utils.resurrection.getState.invalidate();
      utils.crew.getState.invalidate();
      toast.success(
        res.firstLine
          ? `They returned. "${res.firstLine}"`
          : "The petition was heard. Your friend is back on the ark.",
        { duration: 12000 },
      );
    },
    onError: (err) => toast.error(err.message),
  });

  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [briefingOpenFor, setBriefingOpenFor] =
    useState<ResurrectableNpcKey | null>(null);

  const briefing = trpc.resurrection.getBriefing.useQuery(
    briefingOpenFor ? { npcKey: briefingOpenFor } : { npcKey: "locke" },
    { enabled: briefingOpenFor !== null },
  );

  const data = stateQuery.data;
  const openQuests = useMemo(() => {
    if (!data) return [];
    return data.quests.filter(
      (q) => q.status === "open" || q.status === "in_progress",
    );
  }, [data]);
  const resolvedQuests = useMemo(() => {
    if (!data) return [];
    return data.quests.filter(
      (q) =>
        q.status === "completed_path_a" || q.status === "completed_path_b",
    );
  }, [data]);

  const selectedQuest =
    openQuests.find((q) => q.id === selectedQuestId) ?? openQuests[0] ?? null;

  if (!data) {
    return (
      <div className="void-text-secondary p-6">Loading the petition log…</div>
    );
  }

  return (
    <div className="void-card p-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="void-heading-2">Resurrection Protocols</h2>
          <p className="void-text-secondary text-sm mt-1">
            Petitions to the Resurrectionist Ne-Yon. Mediated by the Degen.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => drainSideEffects.mutate()}
            disabled={drainSideEffects.isPending}
          >
            Refresh deaths
          </Button>
        </div>
      </header>

      {openQuests.length === 0 && resolvedQuests.length === 0 ? (
        <div className="void-text-secondary text-sm">
          No open petitions. Recruited NPCs (Vex Solène, Wraith Calder, Locke,
          Jericho Jones, Akai Shi) who fall on a mission will appear here.
        </div>
      ) : null}

      {openQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quest list */}
          <aside className="md:col-span-1 space-y-2">
            <h3 className="void-heading-4 text-sm">Open petitions</h3>
            {openQuests.map((q) => {
              const completed = q.subtasks.filter((s) => s.completed).length;
              const isSel = selectedQuest?.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestId(q.id)}
                  className={`w-full text-left p-3 rounded transition-all ${
                    isSel
                      ? "void-bg-active void-border"
                      : "void-bg-card void-border-subtle hover:void-bg-hover"
                  }`}
                  data-active={isSel ? "true" : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="void-text-primary font-medium">
                      {NPC_DISPLAY[q.npcKey]}
                    </span>
                    <Badge variant="outline">
                      {completed}/{q.subtasks.length}
                    </Badge>
                  </div>
                  <div className="void-text-tertiary text-xs mt-1">
                    Cycle {q.deathCycle}
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Selected quest detail */}
          <section className="md:col-span-2">
            {selectedQuest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="void-heading-3">
                    {NPC_DISPLAY[selectedQuest.npcKey]}
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBriefingOpenFor(selectedQuest.npcKey)}
                  >
                    Re-read briefing
                  </Button>
                </div>

                <Progress
                  value={
                    (selectedQuest.subtasks.filter((s) => s.completed).length /
                      selectedQuest.subtasks.length) *
                    100
                  }
                />

                <ul className="space-y-3">
                  {selectedQuest.subtasks.map((st) => {
                    const def = PROTOCOL_SUBTASKS[st.id];
                    return (
                      <li
                        key={st.id}
                        data-completed={st.completed ? "true" : undefined}
                        className="flex gap-3 p-3 rounded void-bg-card void-border-subtle data-[completed=true]:void-border-success"
                      >
                        <div className="void-text-secondary mt-1">
                          {SUBTASK_ICON[st.id]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium void-text-primary">
                              {def.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {def.system}
                            </Badge>
                          </div>
                          <p className="void-text-secondary text-sm mt-1">
                            {def.description}
                          </p>
                          {!st.completed ? (
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() =>
                                completeSubtask.mutate({
                                  questId: selectedQuest.id,
                                  subtaskId: st.id,
                                })
                              }
                              disabled={completeSubtask.isPending}
                            >
                              Mark sub-task complete{" "}
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          ) : (
                            <Badge className="mt-2" variant="default">
                              Complete
                            </Badge>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {selectedQuest.status === "completed_path_a" ? (
                  <div className="void-bg-active p-4 rounded">
                    <p className="void-text-primary mb-2">
                      All sub-tasks complete. The Degen will deliver the
                      petition.
                    </p>
                    <Button
                      onClick={() =>
                        completePathA.mutate({ questId: selectedQuest.id })
                      }
                      disabled={completePathA.isPending}
                    >
                      Petition the Resurrectionist
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      {resolvedQuests.length > 0 ? (
        <section className="mt-8">
          <h3 className="void-heading-4 text-sm mb-2">Resolved petitions</h3>
          <ul className="space-y-2">
            {resolvedQuests.map((q) => (
              <li
                key={q.id}
                className="flex items-center justify-between p-3 rounded void-bg-card void-border-subtle"
              >
                <span className="void-text-primary">
                  {NPC_DISPLAY[q.npcKey]}
                </span>
                <Badge
                  variant={
                    q.status === "completed_path_a" ? "default" : "outline"
                  }
                >
                  {q.status === "completed_path_a"
                    ? "Returned to ark"
                    : "Returned off-ship (Path B)"}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {briefingOpenFor && briefing.data ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setBriefingOpenFor(null)}
        >
          <div
            className="void-card max-w-2xl w-full p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="void-heading-3 mb-4">
              Briefing — {NPC_DISPLAY[briefingOpenFor]}
            </h3>
            <p className="void-text-primary mb-3">{briefing.data.humanIntro}</p>
            <p className="void-text-primary mb-3">{briefing.data.elaraIntro}</p>
            <p className="void-text-secondary text-sm italic">
              {briefing.data.humanPathBWarning}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setBriefingOpenFor(null)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
