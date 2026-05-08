/* ═══════════════════════════════════════════════════════
   LIVING CHARACTER SHEET
   The animated dossier panel from
   docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md.

   Pure renderer — reads game state via useGame, computes the
   view-model with `buildLivingCharacterSheet`, then crossfades
   the flavor line and pulses each stat when its value changes.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Flame, Star, Layers } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  buildLivingCharacterSheet,
  type LivingCharacterSheet as LivingSheet,
} from "@shared/livingCharacterSheet";
import {
  AXIS_POLES,
  PROFILE_AXES,
  type ProfileAxis,
} from "@shared/playerProfile";

interface PulseValueProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
}

/** A number that briefly pulses (scale + glow) every time the
 *  underlying value changes. Uses framer-motion's `key`-driven
 *  remount so we get an entry animation on every update. */
function PulseValue({ value, format, className }: PulseValueProps) {
  const text = format ? format(value) : String(value);
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={text}
        initial={{ scale: 1.18, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={className}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

interface MeterBarProps {
  /** 0..100 left-side fill (light / Elara). */
  left: number;
  /** 0..100 right-side fill (dark / Human). */
  right: number;
  leftClass: string;
  rightClass: string;
}

/** Dual-sided bar — fills inward from each edge. Used for the
 *  morality (light vs dark) and bond (Elara vs Human) meters. */
function MeterBar({ left, right, leftClass, rightClass }: MeterBarProps) {
  return (
    <div className="relative h-2 void-bg-canvas rounded-full overflow-hidden">
      <motion.div
        className={`absolute top-0 left-0 h-full ${leftClass} rounded-full`}
        animate={{ width: `${left / 2}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.div
        className={`absolute top-0 right-0 h-full ${rightClass} rounded-full`}
        animate={{ width: `${right / 2}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

interface AxisRowProps {
  axis: ProfileAxis;
  value: number;
}

/** A single psych-axis row — label on the left, signed bar in
 *  the middle (centered at 0), pole label on the right. */
function AxisRow({ axis, value }: AxisRowProps) {
  const poles = AXIS_POLES[axis];
  const pole = value === 0 ? poles.neutral : value > 0 ? poles.positive : poles.negative;
  const magnitude = Math.min(50, Math.abs(value) / 2); // half-bar width
  const isPositive = value >= 0;
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs void-text-dim w-20 truncate">
        {axis}
      </span>
      <div className="relative flex-1 h-1 void-bg-canvas rounded-full">
        <div
          className="absolute top-0 bottom-0 w-px void-bg-canvas"
          style={{ left: "50%" }}
        />
        <motion.div
          className={`absolute top-0 h-full rounded-full ${
            isPositive ? "void-bg-sunk void-border-success" : "void-bg-sunk void-border-error"
          }`}
          animate={{
            width: `${magnitude}%`,
            left: isPositive ? "50%" : `${50 - magnitude}%`,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span className={`font-mono text-xs ${isPositive ? "void-text-energy" : "void-text-error"} w-20 truncate text-right`}>
        {pole}
      </span>
    </div>
  );
}

export interface LivingCharacterSheetProps {
  /** Optional override of the seven-axis profile. When omitted,
   *  axes default to neutral (the player has no recorded events). */
  profile?: Parameters<typeof buildLivingCharacterSheet>[2];
}

export function LivingCharacterSheet({ profile }: LivingCharacterSheetProps = {}) {
  const { state } = useGame();

  const sheet: LivingSheet = useMemo(() => {
    const c = state.characterChoices;
    const level = c.attrAttack + c.attrDefense + c.attrVitality;
    return buildLivingCharacterSheet(
      {
        citizenName: c.name,
        species: c.species,
        characterClass: c.characterClass,
        alignment: c.alignment,
        element: c.element,
        level,
        moralityScore: state.moralityScore,
        cardCount: state.collectedCards.length,
        prestigeTier: state.prestigeLevel,
      },
      { elara: state.elaraTrust, human: state.humanTrust },
      profile ?? null,
    );
  }, [
    state.characterChoices,
    state.moralityScore,
    state.collectedCards.length,
    state.prestigeLevel,
    state.elaraTrust,
    state.humanTrust,
    profile,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="void-surface rounded-xl p-5 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-4 border-b void-border pb-3">
        <Sparkles size={14} className="text-primary" />
        <h2 className="font-display text-lg font-bold tracking-wider text-foreground">
          {sheet.citizenName}
        </h2>
        <span className="font-mono text-xs void-text-dim">
          {sheet.species} · {sheet.characterClass}
        </span>
        <span className="ml-auto font-mono text-xs void-text-accent tracking-wider uppercase">
          {sheet.alignment}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Left column — portrait + level + element */}
        <div className="flex flex-col items-center gap-3 sm:col-span-1">
          <div className="w-24 h-24 rounded-xl void-bg-canvas border void-border flex items-center justify-center">
            <Star size={32} className="void-text-dim" />
          </div>
          <div className="text-center">
            <p className="font-mono text-xs void-text-dim tracking-wider uppercase">Level</p>
            <PulseValue
              value={sheet.level}
              className="font-display text-2xl font-bold text-foreground tabular-nums block"
            />
          </div>
          {sheet.element && (
            <span className="font-mono text-xs void-text-system tracking-wider uppercase px-2 py-1 rounded-md void-bg-system border void-border-system">
              {sheet.element}
            </span>
          )}
          {sheet.prestigeTier > 0 && (
            <span className="font-mono text-xs void-text-premium tracking-wider uppercase">
              Prestige · <PulseValue value={sheet.prestigeTier} />
            </span>
          )}
          <span className="font-mono text-xs void-text-dim flex items-center gap-1">
            <Layers size={10} />
            <PulseValue value={sheet.cardCount} /> cards
          </span>
        </div>

        {/* Right column — meters and psych axes */}
        <div className="sm:col-span-2 space-y-4">
          {/* Morality */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs void-text-dim tracking-wider uppercase flex items-center gap-1">
                <Flame size={11} /> Light · Dark
              </span>
              <span className="font-mono text-xs void-text-dim tabular-nums">
                <PulseValue value={sheet.morality.light} /> / <PulseValue value={sheet.morality.dark} />
              </span>
            </div>
            <MeterBar
              left={sheet.morality.light}
              right={sheet.morality.dark}
              leftClass="void-bg-success"
              rightClass="void-bg-error"
            />
          </div>

          {/* Bonds */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs void-text-dim tracking-wider uppercase flex items-center gap-1">
                <Heart size={11} /> Elara · Human
              </span>
              <span className="font-mono text-xs void-text-dim tabular-nums">
                <PulseValue value={sheet.bonds.elara} /> / <PulseValue value={sheet.bonds.human} />
              </span>
            </div>
            <MeterBar
              left={sheet.bonds.elara}
              right={sheet.bonds.human}
              leftClass="void-bg-system"
              rightClass="void-bg-warning"
            />
          </div>

          {/* Psych axes */}
          <div className="space-y-1.5 pt-2 border-t void-border">
            {PROFILE_AXES.map((axis) => (
              <AxisRow key={axis} axis={axis} value={sheet.psychAxes[axis]} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer — flavor line crossfades on change */}
      <div className="mt-5 pt-3 border-t void-border min-h-[2.5rem] flex items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={sheet.flavorLine}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="font-mono text-xs void-text-accent italic tracking-wide"
          >
            {sheet.flavorLine}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default LivingCharacterSheet;
