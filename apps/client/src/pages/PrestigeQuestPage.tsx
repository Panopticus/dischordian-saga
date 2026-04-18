/* ═══════════════════════════════════════════════════════
   PRESTIGE QUEST CHAIN PAGE
   Multi-step quest chains that unlock prestige classes.
   Shows RPG requirements, step progress, and rewards.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Crown, Lock, Check, ChevronRight, Scroll,
  Swords, Star, Zap, AlertTriangle, Shield, BookOpen,
  Target, Clock, Sparkles, Trophy, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STEP_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  combat: Swords,
  lore: BookOpen,
  exploration: Eye,
  crafting: Target,
  social: Shield,
  trial: Crown,
};

export default function PrestigeQuestPage() {
  const { data: questChains, isLoading: chainsLoading } = trpc.prestigeQuest.getQuestChains.useQuery();
  const { data: myProgress, isLoading: progressLoading, refetch } = trpc.prestigeQuest.getMyProgress.useQuery();
  const startQuest = trpc.prestigeQuest.startQuest.useMutation({
    onSuccess: (result) => {
      refetch();
      if (result.skippedSteps && result.skippedSteps.length > 0) {
        toast.success(`Quest started! ${result.skippedSteps.length} step(s) auto-completed by your talents.`);
      } else {
        toast.success("Quest chain started!");
      }
    },
    onError: (err) => toast.error(err.message),
  });
  const advanceStep = trpc.prestigeQuest.advanceStep.useMutation({
    onSuccess: (result) => {
      refetch();
      if (result.isComplete) {
        toast.success("Quest chain completed! Prestige class unlocked!");
      } else if (result.skipped) {
        toast.success("Step auto-completed by your talents!");
      } else {
        toast.success(`Step advanced! +${result.xpEarned} XP`);
      }
    },
    onError: (err) => toast.error(err.message),
  });
  const abandonQuest = trpc.prestigeQuest.abandonQuest.useMutation({
    onSuccess: () => { refetch(); toast.info("Quest abandoned."); },
    onError: (err) => toast.error(err.message),
  });

  const [expandedChain, setExpandedChain] = useState<string | null>(null);
  const [confirmAbandon, setConfirmAbandon] = useState<string | null>(null);

  const isLoading = chainsLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    );
  }

  const progressMap = new Map(
    (myProgress || []).map(p => [p.questChainKey, p])
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/character-sheet" className="p-1.5 rounded-lg hover:bg-card/40 transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
              <Crown size={20} className="void-text-accent" />
              PRESTIGE <span className="void-text-accent">QUEST CHAINS</span>
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              Complete quest chains to unlock prestige classes — your RPG stats affect progression
            </p>
          </div>
        </div>

        {/* Quest Chain List */}
        <div className="space-y-3">
          {(questChains || []).map((chain, i) => {
            const progress = progressMap.get(chain.key);
            const isExpanded = expandedChain === chain.key;
            const isActive = progress?.status === "in_progress";
            const isCompleted = progress?.status === "completed";
            const completedSteps = (progress?.completedSteps || []) as string[];
            const skippedSteps = (progress?.skippedSteps || []) as string[];

            return (
              <motion.div
                key={chain.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isCompleted
                    ? "void-border void-bg-sunk"
                    : isActive
                    ? "border-primary/30 bg-primary/5"
                    : chain.canStart
                    ? "border-border/30 bg-card/30 hover:border-border/50"
                    : "void-border void-bg-canvas opacity-60"
                }`}
              >
                {/* Chain Header */}
                <button
                  onClick={() => setExpandedChain(isExpanded ? null : chain.key)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted ? "void-bg-sunk border void-border" :
                      isActive ? "bg-primary/20 border border-primary/30" :
                      "void-bg-canvas border void-border"
                    }`}>
                      {isCompleted ? (
                        <Trophy size={20} className="void-text-accent" />
                      ) : chain.canStart ? (
                        <Scroll size={20} className="text-primary" />
                      ) : (
                        <Lock size={16} className="void-text" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-display text-sm font-bold ${
                          isCompleted ? "void-text-accent" : isActive ? "text-primary" : ""
                        }`}>
                          {chain.name}
                        </h3>
                        {isCompleted && (
                          <span className="font-mono text-[8px] void-bg-sunk void-text-accent px-1.5 py-0.5 rounded">
                            COMPLETED
                          </span>
                        )}
                        {isActive && (
                          <span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded animate-pulse">
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{chain.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="font-mono text-[8px] text-muted-foreground">
                          <Swords size={8} className="inline mr-0.5" />
                          {chain.steps.length} steps
                        </span>
                        <span className="font-mono text-[8px] void-text-accent">
                          <Crown size={8} className="inline mr-0.5" />
                          Unlocks: {chain.completionReward.prestigeClass}
                        </span>
                        {!chain.canStart && chain.lockReason && (
                          <span className="font-mono text-[8px] void-text-error">
                            <Lock size={8} className="inline mr-0.5" />
                            {chain.lockReason}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {isActive && (
                      <div className="w-16 text-right">
                        <span className="font-mono text-[10px] text-primary">
                          {completedSteps.length}/{chain.steps.length}
                        </span>
                        <div className="h-1.5 void-bg-canvas rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-primary/60 rounded-full transition-all"
                            style={{ width: `${(completedSteps.length / chain.steps.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <ChevronRight
                      size={16}
                      className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {/* Expanded Steps */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-border/10">
                        {/* Requirements */}
                        <div className="mt-3 mb-4">
                          <span className="font-mono text-[9px] text-muted-foreground block mb-1.5">
                            PREREQUISITES:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <span className={`font-mono text-[8px] px-2 py-1 rounded ${
                              chain.canStart ? "void-bg-success void-text-energy border void-border-success" :
                              "void-bg-error void-text-error border void-border-error"
                            }`}>
                              Class: {chain.requiredBaseClass} Rank {chain.requiredClassRank}+
                            </span>
                            <span className={`font-mono text-[8px] px-2 py-1 rounded ${
                              chain.canStart ? "void-bg-success void-text-energy border void-border-success" :
                              "void-bg-error void-text-error border void-border-error"
                            }`}>
                              Citizen Level {chain.requiredLevel}+
                            </span>
                          </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-2">
                          {chain.steps.map((step: any, si: number) => {
                            const isStepDone = completedSteps.includes(step.stepId);
                            const wasSkipped = skippedSteps.includes(step.stepId);
                            const isCurrent = isActive && !isStepDone && si === (progress?.currentStep || 0);
                            const StepIcon = STEP_TYPE_ICONS[step.type] || Target;

                            return (
                              <div
                                key={step.stepId}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                                  isStepDone
                                    ? "void-border-success void-bg-success"
                                    : isCurrent
                                    ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10"
                                    : "border-border/10 bg-card/10 opacity-50"
                                }`}
                              >
                                {/* Step number / status */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isStepDone
                                    ? "void-bg-success border void-border-success"
                                    : isCurrent
                                    ? "bg-primary/20 border border-primary/30"
                                    : "void-bg-canvas border void-border"
                                }`}>
                                  {isStepDone ? (
                                    <Check size={12} className="void-text-energy" />
                                  ) : (
                                    <span className="font-mono text-[9px]">{si + 1}</span>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <StepIcon size={12} className={isCurrent ? "text-primary" : "text-muted-foreground"} />
                                    <span className={`font-display text-xs font-bold ${
                                      isStepDone ? "void-text-energy" : isCurrent ? "text-primary" : ""
                                    }`}>
                                      {step.name}
                                    </span>
                                    {wasSkipped && (
                                      <span className="font-mono text-[7px] void-bg-system void-text-system px-1 py-0.5 rounded">
                                        TALENT SKIP
                                      </span>
                                    )}
                                    <span className="font-mono text-[7px] text-muted-foreground capitalize">
                                      {step.type}
                                    </span>
                                  </div>
                                  <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                                    {step.description}
                                  </p>

                                  {/* Civil skill requirement */}
                                  {step.requirement?.civilSkill && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <BookOpen size={8} className="void-text-energy" />
                                      <span className="font-mono text-[8px] void-text-energy">
                                        Requires {step.requirement.civilSkill.skill} Lv.{step.requirement.civilSkill.level}
                                      </span>
                                    </div>
                                  )}

                                  {/* Skippable by talent */}
                                  {step.skippableByTalent && !isStepDone && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Sparkles size={8} className="void-text-system" />
                                      <span className="font-mono text-[8px] void-text-system">
                                        Skippable with "{step.skippableByTalent}" talent
                                      </span>
                                    </div>
                                  )}

                                  {/* Rewards */}
                                  {step.rewards && (
                                    <div className="flex items-center gap-2 mt-1">
                                      {step.rewards.xp && (
                                        <span className="font-mono text-[7px] void-text-accent">
                                          +{step.rewards.xp} XP
                                        </span>
                                      )}
                                      {step.rewards.item && (
                                        <span className="font-mono text-[7px] void-text-energy">
                                          +{step.rewards.item}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Advance button for current step */}
                                  {isCurrent && (
                                    <Button
                                      size="sm" variant="outline"
                                      className="text-[9px] h-6 px-3 mt-2 border-primary/30 text-primary"
                                      onClick={() => advanceStep.mutate({
                                        questChainKey: chain.key,
                                        stepId: step.stepId,
                                      })}
                                      disabled={advanceStep.isPending}
                                    >
                                      {advanceStep.isPending ? "..." : "Complete Step"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Completion Reward */}
                        <div className="mt-4 p-3 border void-border void-bg-sunk rounded-lg">
                          <span className="font-mono text-[9px] void-text-accent block mb-1">
                            <Trophy size={10} className="inline mr-1" />
                            COMPLETION REWARD:
                          </span>
                          <div className="flex items-center gap-3">
                            <Crown size={16} className="void-text-accent" />
                            <div>
                              <span className="font-display text-sm font-bold void-text-accent">
                                {chain.completionReward.prestigeClass}
                              </span>
                              <span className="font-mono text-[9px] text-muted-foreground ml-2">
                                +{chain.completionReward.xp} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 flex gap-2">
                          {!isActive && !isCompleted && chain.canStart && (
                            <Button
                              size="sm"
                              className="text-xs h-9 px-4 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
                              onClick={() => startQuest.mutate({ questChainKey: chain.key })}
                              disabled={startQuest.isPending}
                            >
                              {startQuest.isPending ? "Starting..." : "Begin Quest Chain"}
                            </Button>
                          )}
                          {isActive && (
                            <>
                              {confirmAbandon === chain.key ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[9px] void-text-error">
                                    <AlertTriangle size={10} className="inline mr-1" />
                                    Abandon this quest?
                                  </span>
                                  <Button
                                    size="sm" variant="outline"
                                    className="text-[9px] h-6 px-2"
                                    onClick={() => setConfirmAbandon(null)}
                                  >
                                    No
                                  </Button>
                                  <Button
                                    size="sm" variant="destructive"
                                    className="text-[9px] h-6 px-2"
                                    onClick={() => {
                                      abandonQuest.mutate({ questChainKey: chain.key });
                                      setConfirmAbandon(null);
                                    }}
                                  >
                                    Yes, Abandon
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm" variant="ghost"
                                  className="text-[9px] h-6 px-3 void-text-error void-text-error"
                                  onClick={() => setConfirmAbandon(chain.key)}
                                >
                                  Abandon Quest
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
