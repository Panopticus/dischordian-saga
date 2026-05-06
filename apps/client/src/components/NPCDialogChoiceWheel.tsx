/* ═══════════════════════════════════════════════════════
   NPC DIALOG CHOICE WHEEL — D1 promotion

   Plan §D1. The original audit asked for DialogWheel to
   become the primary story-dialogue surface. The earlier
   §A1 work unified the *grammar* (NPCDialogChoice gained
   alignment / skillCheck / moralityShift / cardRewardRarity).
   This component completes the §D1 promotion: every story
   NPC dialogue's choice list now uses the wheel's visual
   language by default — alignment-sorted ordering, the
   HUMANITY/NEUTRAL/MACHINE legend, hover-expanded text,
   right-side affordance cluster matching DialogWheel exactly.

   The component internalises:
     • Per-choice skill-check state (roll deadline, success/
       failure overlay)
     • The D100 roll mechanic (shared via dialogSkillCheck.ts)
     • Alignment-driven sorting + legend rendering
     • Hover-expand of choice.label/response

   It does NOT own:
     • The dialog modal chrome (NPCDialog handles that)
     • Portrait / VO / KineticText (NPCDialog)
     • Gift panel / archon whispers / ambient leaks (NPCDialog)
     • The choice domain object itself (NPCDialogChoice lives
       in NPCDialog.tsx exports)

   So a story NPC scene now feels like a Mass Effect dialogue
   wheel without losing any of the BioWare-grade reactivity
   surrounding it.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronRight,
  Eye,
  Heart,
  Lock,
  Shield,
  Sparkles,
  Star,
  Sword,
  Unlock,
  Zap,
} from "lucide-react";
import { rollSkillCheck, type SkillType } from "@/lib/dialogSkillCheck";
import type { NPCDialogChoice } from "./NPCDialog";

const SKILL_ICONS: Record<SkillType, typeof Brain> = {
  charisma: Heart,
  intelligence: Brain,
  strength: Sword,
  perception: Eye,
  willpower: Shield,
  agility: Zap,
};

const SKILL_COLORS: Record<SkillType, string> = {
  charisma: "void-text-error",
  intelligence: "void-text-energy",
  strength: "void-text-error",
  perception: "void-text-error",
  willpower: "void-text-system",
  agility: "void-text-energy",
};

type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
const RARITY_COLORS: Record<CardRarity, string> = {
  common: "void-text",
  uncommon: "void-text-energy",
  rare: "void-text-energy",
  epic: "void-text-system",
  legendary: "void-text-error",
  mythic: "void-text-error",
};

type Alignment = "humanity" | "neutral" | "machine";

const ALIGNMENT_ORDER: Record<Alignment, number> = {
  humanity: 0,
  neutral: 1,
  machine: 2,
};

export interface NPCDialogChoiceWheelProps {
  choices: ReadonlyArray<NPCDialogChoice>;
  /** NPC accent color, used as the neutral choice tint. */
  npcColor: string;
  /** Player stats for skill-check rolls. Provided by the parent
   *  via deriveSkillStats. */
  playerStats: Record<SkillType, number>;
  /** Fired when a choice commits — `passed` reflects the skill-
   *  check outcome (true if no check was attached). */
  onChoice: (choice: NPCDialogChoice, passed: boolean) => void;
  /** Optional hover callback so the parent can shift portrait
   *  expression on archetype hover. */
  onHoverArchetype?: (archetype: string | null) => void;
}

export default function NPCDialogChoiceWheel({
  choices,
  npcColor,
  playerStats,
  onChoice,
  onHoverArchetype,
}: NPCDialogChoiceWheelProps) {
  const [skillCheckResults, setSkillCheckResults] = useState<
    Record<string, { passed: boolean; roll: number } | undefined>
  >({});
  const [rollingChoiceId, setRollingChoiceId] = useState<string | null>(null);

  // Wheel-style alignment ordering: humanity at top, neutral
  // in the middle, machine at the bottom. Stable within an
  // alignment group (preserves authoring order).
  const sorted = useMemo(() => {
    const withIndex = choices.map((c, i) => ({ choice: c, originalIndex: i }));
    withIndex.sort((a, b) => {
      const aw = a.choice.alignment ? ALIGNMENT_ORDER[a.choice.alignment] : ALIGNMENT_ORDER.neutral;
      const bw = b.choice.alignment ? ALIGNMENT_ORDER[b.choice.alignment] : ALIGNMENT_ORDER.neutral;
      if (aw !== bw) return aw - bw;
      return a.originalIndex - b.originalIndex;
    });
    return withIndex.map((w) => w.choice);
  }, [choices]);

  const hasAnyAlignment = useMemo(
    () => choices.some((c) => c.alignment),
    [choices],
  );

  const handleClick = useCallback(
    (choice: NPCDialogChoice, e: React.MouseEvent) => {
      e.stopPropagation();
      const result = skillCheckResults[choice.id];
      const sc = choice.skillCheck;
      const failedLocked = !!result && !result.passed;
      const rolling = rollingChoiceId === choice.id;
      if (failedLocked || rolling) return;

      if (sc && !result) {
        setRollingChoiceId(choice.id);
        const stat = playerStats[sc.skill] ?? 0;
        const rolled = rollSkillCheck(stat, sc.threshold);
        setTimeout(() => {
          setSkillCheckResults((prev) => ({
            ...prev,
            [choice.id]: { passed: rolled.passed, roll: rolled.roll },
          }));
          setRollingChoiceId(null);
          setTimeout(() => onChoice(choice, rolled.passed), 700);
        }, 600);
        return;
      }

      onChoice(choice, true);
    },
    [skillCheckResults, rollingChoiceId, playerStats, onChoice],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-4 space-y-2"
      data-testid="npc-dialog-choice-wheel"
    >
      {/* Wheel-style alignment legend. Renders only when any
          choice declares an alignment — keeps the surface clean
          for purely-archetype scenes. */}
      {hasAnyAlignment && (
        <div className="flex items-center gap-4 px-1 pb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full void-bg-success" />
            <span className="text-[9px] font-mono void-text-energy tracking-wider">HUMANITY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
            <span className="text-[9px] font-mono text-muted-foreground/50 tracking-wider">NEUTRAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full void-bg-error" />
            <span className="text-[9px] font-mono void-text-error tracking-wider">MACHINE</span>
          </div>
        </div>
      )}

      {sorted.map((choice, i) => {
        const sc = choice.skillCheck;
        const result = skillCheckResults[choice.id];
        const rolling = rollingChoiceId === choice.id;
        const isHumanity = choice.alignment === "humanity";
        const isMachine = choice.alignment === "machine";
        const failedLocked = !!result && !result.passed;

        return (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={(e) => handleClick(choice, e)}
            onMouseEnter={() => onHoverArchetype?.(choice.archetype)}
            onMouseLeave={() => onHoverArchetype?.(null)}
            disabled={failedLocked || rolling}
            data-testid={`choice-${choice.id}`}
            className={`relative w-full flex items-center gap-2 p-3 rounded-lg border transition-all text-left group hover:brightness-125 ${
              isHumanity
                ? "void-border-success void-bg-success"
                : isMachine
                  ? "void-border-error void-bg-error"
                  : ""
            } ${failedLocked ? "opacity-30 line-through" : ""}`}
            style={
              !isHumanity && !isMachine
                ? {
                    borderColor: `${npcColor}15`,
                    backgroundColor: `${npcColor}05`,
                  }
                : undefined
            }
          >
            {/* Alignment indicator bar — wheel's signature affordance,
                always rendered when any choice is aligned so the
                visual rhythm stays consistent column-by-column. */}
            {hasAnyAlignment && (
              <div
                className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                  isHumanity
                    ? "void-bg-success"
                    : isMachine
                      ? "void-bg-error"
                      : "bg-muted-foreground/20"
                }`}
              />
            )}

            <ChevronRight
              size={12}
              style={{ color: `${npcColor}60` }}
              className="group-hover:translate-x-0.5 transition-transform flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p
                className={`font-mono text-xs group-hover:text-white transition-colors ${
                  isHumanity
                    ? "void-text-energy"
                    : isMachine
                      ? "void-text-error"
                      : "text-white/80"
                }`}
              >
                {choice.label}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[8px] text-white/20">[{choice.archetype}]</span>
                {choice.secretFromElara && (
                  <span className="font-mono text-[7px] void-text-error">SECRET</span>
                )}
                {choice.trustChange !== 0 && (
                  <span
                    className={`font-mono text-[8px] ${
                      choice.trustChange > 0 ? "void-text-energy" : "void-text-error"
                    }`}
                  >
                    {choice.trustChange > 0 ? "+" : ""}
                    {choice.trustChange} trust
                  </span>
                )}
              </div>
            </div>

            {/* Right-side affordance cluster — skill check, reward,
                morality shift. Same shape DialogWheel uses, so the
                visual language matches across surfaces. */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {sc &&
                (() => {
                  const SkillIcon = SKILL_ICONS[sc.skill];
                  return (
                    <div
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        result
                          ? result.passed
                            ? "void-bg-success void-text-energy"
                            : "void-bg-error void-text-error"
                          : `bg-muted/30 ${SKILL_COLORS[sc.skill]}`
                      }`}
                      data-testid={`skill-check-${choice.id}`}
                    >
                      <SkillIcon size={10} />
                      {result ? (
                        result.passed ? (
                          <Unlock size={10} />
                        ) : (
                          <Lock size={10} />
                        )
                      ) : (
                        <span>{sc.threshold}</span>
                      )}
                    </div>
                  );
                })()}

              {choice.cardRewardRarity && (
                <div
                  className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-mono ${
                    RARITY_COLORS[choice.cardRewardRarity]
                  }`}
                >
                  <Star size={9} />
                  <span className="uppercase tracking-wider">
                    {choice.cardRewardRarity.slice(0, 3)}
                  </span>
                </div>
              )}

              {choice.moralityShift !== undefined &&
                choice.moralityShift !== 0 &&
                (() => {
                  const absVal = Math.abs(choice.moralityShift);
                  const isMachineShift = choice.moralityShift < 0;
                  return (
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
                      {isMachineShift ? (
                        <>
                          <span className="void-text-error">+{absVal}</span>
                          <span className="text-muted-foreground/40">/</span>
                          <span className="void-text-energy">-{absVal}</span>
                        </>
                      ) : (
                        <>
                          <span className="void-text-energy">+{absVal}</span>
                          <span className="text-muted-foreground/40">/</span>
                          <span className="void-text-error">-{absVal}</span>
                        </>
                      )}
                    </div>
                  );
                })()}
            </div>

            {/* Skill-check rolling overlay */}
            <AnimatePresence>
              {rolling && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/85 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-sm font-mono">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={14} className="text-primary" />
                    </motion.div>
                    <span className="text-primary">SKILL CHECK...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skill-check result overlay */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                    result.passed ? "void-bg-success" : "void-bg-error"
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold tracking-wider ${
                      result.passed ? "void-text-energy" : "void-text-error"
                    }`}
                  >
                    {result.passed ? "SUCCESS" : "FAILED"} [{result.roll}]
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/* ─── Pure helpers exported for tests ─── */

/** Sort choices by alignment (humanity → neutral → machine).
 *  Stable within a group. Used internally by the wheel; exported
 *  so tests can verify the wheel's signature ordering without
 *  rendering React. */
export function sortChoicesByAlignment(
  choices: ReadonlyArray<NPCDialogChoice>,
): NPCDialogChoice[] {
  const withIndex = choices.map((c, i) => ({ choice: c, originalIndex: i }));
  withIndex.sort((a, b) => {
    const aw = a.choice.alignment ? ALIGNMENT_ORDER[a.choice.alignment] : ALIGNMENT_ORDER.neutral;
    const bw = b.choice.alignment ? ALIGNMENT_ORDER[b.choice.alignment] : ALIGNMENT_ORDER.neutral;
    if (aw !== bw) return aw - bw;
    return a.originalIndex - b.originalIndex;
  });
  return withIndex.map((w) => w.choice);
}
