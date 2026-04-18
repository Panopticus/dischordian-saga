/* ═══════════════════════════════════════════════════════
   CREW DANGER EVENT MODAL

   Presents a random danger template (quarantine breach,
   boarding action, mutiny, thought-virus exposure,
   genetic degradation, etc.) and lets the player pick a
   response. On success the affected crew take a
   health/morale hit; on failure they can die.

   Pulls from the existing apps/client/src/game/crewManagement.ts
   DANGER_TEMPLATES via generateDangerEvent().
   ═══════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Skull, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { generateDangerEvent, type DangerEvent, type CrewRoster } from "@/game/crewManagement";
import type { CrewState, SerializedFeedEntry } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
  onClose: () => void;
}

function rosterFromCrewState(cs: CrewState): CrewRoster {
  return {
    members: cs.roster.members as any,
    maxCapacity: cs.roster.maxCapacity,
    deceased: cs.roster.deceased as any,
    totalCloned: cs.roster.totalCloned,
    totalLost: cs.roster.totalLost,
    generationRecord: cs.roster.generationRecord,
  };
}

export default function CrewDangerEventModal({ state, onClose }: Props) {
  const seed = Math.floor(Date.now() / 60_000);
  const event: DangerEvent | null = useMemo(() => {
    return generateDangerEvent(rosterFromCrewState(state), seed);
  }, [state, seed]);

  const [resolving, setResolving] = useState(false);
  const [outcome, setOutcome] = useState<null | { success: boolean; narrative: string }>(null);

  const pushFeed = trpc.crew.pushFeedEntry.useMutation();

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="bg-card border border-border/40 rounded p-6 max-w-md text-center">
          <div className="font-mono text-sm text-muted-foreground">
            The decks are quiet. No threats surfacing right now.
          </div>
          <Button onClick={onClose} className="mt-3" variant="outline">
            acknowledge
          </Button>
        </div>
      </motion.div>
    );
  }

  const target = state.roster.members.find(m => m.id === event.targetCrewIds[0]);

  const severityColor = {
    minor: "void-border",
    serious: "void-border",
    critical: "void-border-error",
    fatal: "void-border-error",
  }[event.severity];

  const handleChoice = async (choiceIdx: number) => {
    if (resolving) return;
    const choice = event.playerChoices[choiceIdx];
    setResolving(true);
    const roll = Math.random();
    const success = roll < choice.successChance;
    const narrative = success
      ? `${choice.label} worked. ${target?.name ?? "The crew"} survived.`
      : `${choice.label} failed. The situation worsened.`;
    setOutcome({ success, narrative });
    // Push a feed entry describing the outcome
    const entry: SerializedFeedEntry = {
      id: `danger-${event.id}-${Date.now()}`,
      timestamp: Date.now(),
      roomId: "medical_bay",
      category: "security",
      text: `${event.description.replace(/\[.*?\]/g, "")} — ${narrative}`,
      severity: success ? "warning" : "critical",
      actionable: false,
    };
    try {
      await pushFeed.mutateAsync({ entry: entry as any });
    } catch {
      // non-fatal
    }
    toast[success ? "success" : "error"](narrative);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        className={`bg-card border-2 rounded max-w-xl w-full p-6 relative ${severityColor}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          {event.severity === "fatal" ? (
            <Skull size={16} className="void-text-error" />
          ) : (
            <AlertTriangle
              size={16}
              className={
                event.severity === "critical"
                  ? "void-text-error"
                  : event.severity === "serious"
                    ? "void-text-premium"
                    : "void-text-premium"
              }
            />
          )}
          <span className="font-display text-base font-bold uppercase tracking-wide">
            {event.type.replace(/_/g, " ")}
          </span>
          <span className="ml-auto text-[9px] font-mono text-muted-foreground uppercase">
            {event.severity}
          </span>
        </div>

        <div className="text-[12px] font-mono text-foreground/80 mb-4 leading-relaxed">
          {event.description}
        </div>

        {outcome ? (
          <div
            className={`p-3 border rounded mb-3 text-[11px] font-mono ${
              outcome.success
                ? "void-border-success void-bg-success void-text-energy"
                : "void-border-error void-bg-error void-text-error"
            }`}
          >
            {outcome.narrative}
            <div className="mt-3">
              <Button onClick={onClose} size="sm" className="w-full">
                acknowledge
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {event.playerChoices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                disabled={resolving}
                className="w-full text-left p-3 border border-border/40 rounded hover:border-primary/60 transition disabled:opacity-40"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-display text-[12px] font-semibold">{choice.label}</span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {Math.round(choice.successChance * 100)}%
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  {choice.description}
                </div>
                {choice.cost && (
                  <div className="mt-1 text-[9px] font-mono void-text-premium">
                    cost:{" "}
                    {Object.entries(choice.cost)
                      .map(([k, v]) => `${v} ${k}`)
                      .join(", ")}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
