/* ═══════════════════════════════════════════════════════
   PET QUEST TRACKER

   Displays companion quests for a pet. Quest step completion
   flags live on `playerPets.completedQuestSteps` and are
   updated via `trpc.petBattles.setQuestFlag`. The tracker
   reads them live — no localStorage.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ScrollText, Lock, Check, Circle } from "lucide-react";
import { PET_QUESTS, type PetQuest } from "@/game/petBonding";

interface Props {
  petId: string;
  petName: string;
  bond: number;
  /** Server-persisted completion flags for this pet. */
  completedFlags: string[];
}

export default function PetQuestTracker({ petId, petName, bond, completedFlags }: Props) {
  const quests = useMemo(() => PET_QUESTS.filter((q) => q.petId === petId), [petId]);
  const flagSet = useMemo(() => new Set(completedFlags), [completedFlags]);

  if (quests.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ScrollText size={14} />
          <span className="font-display text-xs font-bold tracking-[0.2em]">{petName.toUpperCase()} QUESTS</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          No companion quests authored for this specimen yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4 space-y-3" data-testid="pet-quest-tracker">
      <div className="flex items-center gap-2">
        <ScrollText size={14} className="void-text-accent" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">{petName.toUpperCase()} QUESTS</span>
      </div>
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} bond={bond} flags={flagSet} />
      ))}
    </div>
  );
}

function QuestCard({ quest, bond, flags }: { quest: PetQuest; bond: number; flags: Set<string> }) {
  const locked = bond < quest.bondRequired;
  const completedSteps = quest.steps.filter((s) => flags.has(s.completionFlag));
  const allDone = completedSteps.length === quest.steps.length;

  const status = locked ? "locked" : allDone ? "complete" : completedSteps.length > 0 ? "in_progress" : "available";
  const statusStyle: Record<string, string> = {
    locked: "void-border void-bg-canvas opacity-60",
    available: "void-border void-bg-sunk",
    in_progress: "void-border void-bg-sunk",
    complete: "void-border-success void-bg-success",
  };
  const statusLabel: Record<string, string> = {
    locked: "LOCKED",
    available: "AVAILABLE",
    in_progress: "IN PROGRESS",
    complete: "COMPLETE",
  };

  return (
    <motion.div
      layout
      className={`border rounded-md p-2.5 ${statusStyle[status]}`}
      data-testid={`quest-${quest.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[11px] font-bold text-foreground">{quest.name}</span>
        <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1">
          {locked && <Lock size={8} />}
          {statusLabel[status]}
        </span>
      </div>
      <p className="font-mono text-[9px] text-muted-foreground/70 italic mt-1 leading-relaxed">
        {quest.description}
      </p>
      {locked && (
        <p className="font-mono text-[9px] void-text-accent mt-1">
          Requires bond {quest.bondRequired} (currently {bond})
        </p>
      )}
      {!locked && (
        <ul className="mt-2 space-y-0.5">
          {quest.steps.map((step) => {
            const done = flags.has(step.completionFlag);
            return (
              <li key={step.id} className="flex items-start gap-1.5 font-mono text-[9px]">
                {done ? <Check size={10} className="void-text-energy mt-0.5" /> : <Circle size={10} className="text-muted-foreground/50 mt-0.5" />}
                <span className={done ? "text-muted-foreground/50 line-through" : "text-foreground/80"}>
                  {step.description}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-2 flex items-center gap-2 text-[9px] font-mono">
        <span className="void-text-error">+{quest.reward.bondGain} bond</span>
        <span className="void-text-energy">+{quest.reward.skillPoints} skills</span>
        {quest.reward.loreUnlock && <span className="void-text-accent">lore: {quest.reward.loreUnlock}</span>}
      </div>
    </motion.div>
  );
}
