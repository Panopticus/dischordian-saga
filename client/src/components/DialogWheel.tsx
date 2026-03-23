/* ═══════════════════════════════════════════════════════
   DIALOG WHEEL — Mass Effect-style radial conversation UI
   Features:
   - Radial layout with 6 positions (top-right to bottom-right)
   - Skill check gates (Charisma, Intelligence, Strength, etc.)
   - Morality alignment indicators (Machine left, Humanity right)
   - Elara/Human corruption visual effects
   - Card rarity reward previews
   - Signal corruption mechanic
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Heart, Sword, Shield, Eye, Zap,
  Lock, Unlock, Star, Sparkles, AlertTriangle,
  ChevronRight, Radio, Wifi, WifiOff
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";

// ─── Types (re-export from shared) ───
import type {
  SkillType, CorruptionSource, CardRarity, SkillCheckDef,
  TutorialChoice,
} from "@/data/loreTutorials";
export type { SkillType, CorruptionSource, CardRarity };
export type MoralityAlignment = "machine" | "humanity" | "neutral";

/** WheelChoice extends TutorialChoice with required shortText and alignment */
export interface WheelChoice extends TutorialChoice {
  shortText: string;
  alignment: MoralityAlignment;
}

export interface DialogWheelProps {
  speakerName: string;
  speakerText: string;
  speakerPortrait?: string;
  choices: WheelChoice[];
  onSelect: (choice: WheelChoice, passed: boolean) => void;
  onCancel?: () => void;
  corruptionLevel?: number; // 0-100, how much Human has hacked Elara's signal
  disabled?: boolean;
}

// ─── Skill Icons ───
const SKILL_ICONS: Record<SkillType, typeof Brain> = {
  charisma: Heart,
  intelligence: Brain,
  strength: Sword,
  perception: Eye,
  willpower: Shield,
  agility: Zap,
};

const SKILL_COLORS: Record<SkillType, string> = {
  charisma: "text-pink-400",
  intelligence: "text-cyan-400",
  strength: "text-red-400",
  perception: "text-amber-400",
  willpower: "text-purple-400",
  agility: "text-green-400",
};

const RARITY_COLORS: Record<CardRarity, string> = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
  mythic: "text-rose-400",
};

const RARITY_GLOW: Record<CardRarity, string> = {
  common: "",
  uncommon: "drop-shadow-[0_0_3px_rgba(74,222,128,0.4)]",
  rare: "drop-shadow-[0_0_4px_rgba(96,165,250,0.5)]",
  epic: "drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]",
  legendary: "drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]",
  mythic: "drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]",
};

// ─── Skill Check Logic ───
function rollSkillCheck(playerStat: number, threshold: number): { passed: boolean; roll: number } {
  // D100 roll + player stat vs threshold
  const roll = Math.floor(Math.random() * 100) + 1;
  const total = roll + playerStat;
  return { passed: total >= threshold, roll };
}

// ─── Glitch Text Effect ───
function GlitchText({ text, intensity = 0.3 }: { text: string; intensity?: number }) {
  const [glitched, setGlitched] = useState(text);

  useEffect(() => {
    if (intensity <= 0) { setGlitched(text); return; }
    const glitchChars = "█▓▒░╔╗╚╝║═╬╣╠╩╦";
    const interval = setInterval(() => {
      const chars = text.split("");
      const numGlitch = Math.floor(chars.length * intensity * Math.random());
      for (let i = 0; i < numGlitch; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        chars[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      setGlitched(chars.join(""));
    }, 100);
    return () => clearInterval(interval);
  }, [text, intensity]);

  return <span className="font-mono">{glitched}</span>;
}

// ─── Individual Wheel Segment ───
function WheelSegment({
  choice,
  index,
  total,
  onSelect,
  playerStats,
  corruptionLevel,
  disabled,
}: {
  choice: WheelChoice;
  index: number;
  total: number;
  onSelect: (choice: WheelChoice, passed: boolean) => void;
  playerStats: Record<SkillType, number>;
  corruptionLevel: number;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ passed: boolean; roll: number } | null>(null);

  // Position calculation — Mass Effect style
  // Top-right = Paragon/Humanity, Bottom-right = Renegade/Machine
  // Choices arranged clockwise from top-right
  const isMachine = choice.alignment === "machine";
  const isHumanity = choice.alignment === "humanity";
  const isCorrupted = choice.corrupted || (choice.source === "human" && corruptionLevel > 50);

  // Layout: choices on the right side of the wheel, stacked vertically
  // Humanity options at top, neutral in middle, machine at bottom
  const yOffset = index * 64; // 64px per choice

  const sc = choice.skillCheck;
  const hasSkillCheck = !!sc;
  const canAttempt = !hasSkillCheck || !checkResult;

  const handleClick = useCallback(() => {
    if (disabled || checking) return;

    if (hasSkillCheck && !checkResult && sc) {
      setChecking(true);
      const stat = playerStats[sc.skill] || 0;
      const result = rollSkillCheck(stat, sc.threshold);
      setTimeout(() => {
        setCheckResult(result);
        setChecking(false);
        // Auto-select after showing result
        setTimeout(() => onSelect(choice, result.passed), 800);
      }, 600);
      return;
    }

    onSelect(choice, true);
  }, [disabled, checking, hasSkillCheck, checkResult, playerStats, choice, onSelect]);

  // Corruption visual effects
  const corruptionIntensity = isCorrupted ? Math.min(corruptionLevel / 100, 0.6) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="relative"
      style={{ marginTop: index === 0 ? 0 : 4 }}
    >
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={disabled || checking || (!!checkResult && !checkResult.passed)}
        className={`
          group relative w-full text-left transition-all duration-200
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
          ${checkResult && !checkResult.passed ? "opacity-30 line-through" : ""}
        `}
      >
        {/* Main choice container */}
        <div className={`
          flex items-center gap-2 px-3 py-2.5 rounded-sm border transition-all duration-200
          ${isHumanity
            ? "border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10"
            : isMachine
              ? "border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/10"
              : "border-border/40 hover:border-primary/40 hover:bg-primary/5"
          }
          ${isCorrupted ? "border-red-500/40 bg-red-500/5" : ""}
          ${hovered && !disabled ? "translate-x-1" : ""}
          ${checking ? "animate-pulse" : ""}
        `}>
          {/* Alignment indicator bar */}
          <div className={`
            w-1 self-stretch rounded-full flex-shrink-0
            ${isHumanity ? "bg-cyan-400" : isMachine ? "bg-amber-500" : "bg-muted-foreground/30"}
          `} />

          {/* Source indicator */}
          <div className={`
            flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
            ${choice.source === "elara" ? "bg-cyan-500/20" : choice.source === "human" ? "bg-amber-500/20" : "bg-muted/30"}
          `}>
            {choice.source === "elara" ? (
              <Radio size={11} className="text-cyan-400" />
            ) : choice.source === "human" ? (
              <WifiOff size={11} className="text-amber-400" />
            ) : (
              <ChevronRight size={11} className="text-muted-foreground" />
            )}
          </div>

          {/* Choice text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {isCorrupted ? (
                <GlitchText text={choice.shortText} intensity={corruptionIntensity} />
              ) : (
                <span className={`
                  text-sm font-mono truncate
                  ${isHumanity ? "text-cyan-300" : isMachine ? "text-amber-300" : "text-foreground"}
                `}>
                  {choice.shortText}
                </span>
              )}
            </div>

            {/* Expanded text on hover */}
            <AnimatePresence>
              {hovered && choice.text !== choice.shortText && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-xs text-muted-foreground mt-0.5 leading-snug"
                >
                  {choice.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Right side indicators */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Skill check badge */}
            {hasSkillCheck && sc && (
              <div className={`
                flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono
                ${checkResult
                  ? checkResult.passed
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  : `bg-muted/30 ${SKILL_COLORS[sc.skill]}`
                }
              `}>
                {(() => {
                  const SkillIcon = SKILL_ICONS[sc.skill];
                  return <SkillIcon size={10} />;
                })()}
                {checkResult ? (
                  checkResult.passed ? (
                    <Unlock size={10} />
                  ) : (
                    <Lock size={10} />
                  )
                ) : (
                  <span>{sc.threshold}</span>
                )}
              </div>
            )}

            {/* Card reward preview */}
            {choice.cardReward && (
              <div className={`
                flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-mono
                ${RARITY_COLORS[choice.cardReward.rarity]}
                ${RARITY_GLOW[choice.cardReward.rarity]}
              `}>
                <Star size={9} />
                <span className="uppercase tracking-wider">{choice.cardReward.rarity.slice(0, 3)}</span>
              </div>
            )}

            {/* Morality shift indicator — shows BOTH sides */}
            {choice.moralityShift !== 0 && (() => {
              const absVal = Math.abs(choice.moralityShift);
              const isMachine = choice.moralityShift < 0;
              return (
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
                  {isMachine ? (
                    <>
                      <span className="text-amber-400">+{absVal}</span>
                      <span className="text-muted-foreground/40">/</span>
                      <span className="text-cyan-400">-{absVal}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-cyan-400">+{absVal}</span>
                      <span className="text-muted-foreground/40">/</span>
                      <span className="text-amber-400">-{absVal}</span>
                    </>
                  )}
                </div>
              );
            })()}

            <ChevronRight size={12} className={`
              text-muted-foreground transition-all
              ${hovered ? "opacity-100 translate-x-0.5" : "opacity-30"}
            `} />
          </div>
        </div>

        {/* Skill check animation overlay */}
        <AnimatePresence>
          {checking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-sm"
            >
              <div className="flex items-center gap-2 text-sm font-mono">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={16} className="text-primary" />
                </motion.div>
                <span className="text-primary">SKILL CHECK...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Check result overlay */}
        <AnimatePresence>
          {checkResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`
                absolute inset-0 flex items-center justify-center rounded-sm
                ${checkResult.passed ? "bg-green-500/10" : "bg-red-500/10"}
              `}
            >
              <span className={`
                text-xs font-mono font-bold tracking-wider
                ${checkResult.passed ? "text-green-400" : "text-red-400"}
              `}>
                {checkResult.passed ? "SUCCESS" : "FAILED"} [{checkResult.roll}]
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

// ─── Signal Corruption Bar ───
function CorruptionBar({ level }: { level: number }) {
  if (level <= 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <Wifi size={12} className={level > 50 ? "text-red-400" : "text-amber-400"} />
      <div className="flex-1 h-1 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${level > 70 ? "bg-red-500" : level > 40 ? "bg-amber-500" : "bg-amber-400/60"}`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">
        {level > 70 ? "SIGNAL CRITICAL" : level > 40 ? "SIGNAL DEGRADED" : "SIGNAL INTERFERENCE"}
      </span>
    </div>
  );
}

// ═══ MAIN DIALOG WHEEL COMPONENT ═══
export default function DialogWheel({
  speakerName,
  speakerText,
  speakerPortrait,
  choices,
  onSelect,
  onCancel,
  corruptionLevel = 0,
  disabled = false,
}: DialogWheelProps) {
  const { state } = useGame();
  const characterChoices = state.characterChoices;

  // Get player stats from character sheet
  // Map the 3 core attributes (attack/defense/vitality) to 6 skill types
  const playerStats = useMemo<Record<SkillType, number>>(() => {
    const atk = characterChoices?.attrAttack || 5;
    const def = characterChoices?.attrDefense || 5;
    const vit = characterChoices?.attrVitality || 5;
    return {
      charisma: vit * 10,       // Vitality → social resilience
      intelligence: atk * 8 + def * 2, // Attack-weighted analysis
      strength: atk * 10,       // Raw attack power
      perception: def * 6 + atk * 4,   // Defense-weighted awareness
      willpower: def * 10,      // Pure defense → mental fortitude
      agility: atk * 5 + vit * 5,      // Balanced speed
    };
  }, [characterChoices]);

  // Filter choices based on class/alignment requirements and corruption
  const visibleChoices = useMemo(() => {
    return choices.filter(c => {
      // Class requirement
      if (c.requiresClass && characterChoices?.characterClass !== c.requiresClass) return false;
      // Alignment requirement
      if (c.requiresAlignment) {
        const morality = state.moralityScore;
        if (c.requiresAlignment === "machine" && morality > -20) return false;
        if (c.requiresAlignment === "humanity" && morality < 20) return false;
      }
      // Corruption threshold
      if (c.hiddenUntilCorruption && corruptionLevel < c.hiddenUntilCorruption) return false;
      return true;
    });
  }, [choices, characterChoices, state.moralityScore, corruptionLevel]);

  // Sort: humanity top, neutral middle, machine bottom
  const sortedChoices = useMemo(() => {
    const order: Record<MoralityAlignment, number> = { humanity: 0, neutral: 1, machine: 2 };
    return [...visibleChoices].sort((a, b) => order[a.alignment] - order[b.alignment]);
  }, [visibleChoices]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {/* Speaker section */}
      <div className="flex items-start gap-3 mb-4">
        {speakerPortrait && (
          <div className="w-12 h-12 rounded-sm border border-primary/30 overflow-hidden flex-shrink-0">
            <img src={speakerPortrait} alt={speakerName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-xs font-bold tracking-[0.15em] text-primary">
              {speakerName.toUpperCase()}
            </span>
            {corruptionLevel > 30 && (
              <AlertTriangle size={11} className="text-amber-400 animate-pulse" />
            )}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed font-mono">
            {corruptionLevel > 60 ? (
              <GlitchText text={speakerText} intensity={corruptionLevel / 300} />
            ) : (
              speakerText
            )}
          </p>
        </div>
      </div>

      {/* Corruption indicator */}
      <CorruptionBar level={corruptionLevel} />

      {/* Alignment legend */}
      <div className="flex items-center gap-4 px-3 py-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-400/70 tracking-wider">HUMANITY</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">NEUTRAL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] font-mono text-amber-400/70 tracking-wider">MACHINE</span>
        </div>
        {corruptionLevel > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-red-400/70 tracking-wider">CORRUPTED</span>
          </div>
        )}
      </div>

      {/* Choice wheel — vertical stack, ME-style */}
      <div className="space-y-0.5">
        {sortedChoices.map((choice, i) => (
          <WheelSegment
            key={choice.id}
            choice={choice}
            index={i}
            total={sortedChoices.length}
            onSelect={onSelect}
            playerStats={playerStats}
            corruptionLevel={corruptionLevel}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Cancel / back option */}
      {onCancel && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onCancel}
          className="mt-3 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          [ESC] END CONVERSATION
        </motion.button>
      )}
    </motion.div>
  );
}
