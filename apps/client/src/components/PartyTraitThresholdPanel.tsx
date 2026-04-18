/* ═══════════════════════════════════════════════════════
   PARTY TRAIT THRESHOLD PANEL

   Shows active party-wide trait synergies (TFT-style):
   which traits are active, match counts, progress toward
   next threshold, bonuses earned, and a suggestion for
   the most-impactful swap.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, TrendingUp, Lightbulb, ChevronDown, ChevronUp, Lock } from "lucide-react";
import {
  computeActiveTraits,
  suggestThresholdUpgrade,
  type PartyMemberTraits,
  type ActiveTrait,
  type TraitThreshold,
} from "@shared/companionTraitThresholds";

interface Props {
  party: PartyMemberTraits[];
  /** Optional title override */
  title?: string;
  /** Hide upgrade suggestion */
  hideSuggestion?: boolean;
}

const TIER_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Bronze: {
    bg: "void-bg-sunk", border: "void-border",
    text: "void-text-accent", glow: "shadow-amber-500/20",
  },
  Silver: {
    bg: "void-bg-canvas", border: "void-border",
    text: "void-text", glow: "shadow-slate-400/30",
  },
  Gold: {
    bg: "void-bg-sunk", border: "void-border",
    text: "void-text-premium", glow: "shadow-yellow-400/40",
  },
  Locked: {
    bg: "void-bg-canvas", border: "void-border",
    text: "void-text", glow: "",
  },
};

export default function PartyTraitThresholdPanel({
  party,
  title = "PARTY TRAITS",
  hideSuggestion = false,
}: Props) {
  const activeTraits = useMemo(() => computeActiveTraits(party), [party]);
  const suggestion = useMemo(() => suggestThresholdUpgrade(party), [party]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeCount = activeTraits.filter(t => t.activeThreshold).length;
  const aspirationalCount = activeTraits.filter(t => !t.activeThreshold).length;

  if (party.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />
          <span className="font-mono text-xs tracking-wider">PARTY TRAITS // EMPTY PARTY</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          Add companions to your active party to activate trait thresholds.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="void-text-energy" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="void-text-energy">{activeCount} active</span>
          {aspirationalCount > 0 && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-muted-foreground/60">{aspirationalCount} in progress</span>
            </>
          )}
        </div>
      </div>

      {/* Upgrade suggestion */}
      {!hideSuggestion && suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2.5 rounded-md border void-border void-bg-sunk flex items-start gap-2"
          data-testid="trait-suggestion"
        >
          <Lightbulb size={12} className="void-text-energy shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-mono text-[9px] uppercase tracking-wider void-text-energy">
                Next Unlock
              </span>
              <span className="font-display text-[10px] font-bold text-foreground">
                {suggestion.traitName}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/60">
                {suggestion.current}/{suggestion.needed}
              </span>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground/80 leading-relaxed">
              {suggestion.recommendation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Traits list */}
      {activeTraits.length === 0 ? (
        <div className="py-4 text-center">
          <p className="font-mono text-[10px] text-muted-foreground/60">
            No trait matches yet. Add companions with matching elements, species, factions, or classes.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeTraits.map(t => (
            <TraitRow
              key={t.trait.id}
              trait={t}
              expanded={expandedId === t.trait.id}
              onToggle={() => setExpandedId(expandedId === t.trait.id ? null : t.trait.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── TRAIT ROW ─── */

function TraitRow({ trait, expanded, onToggle }: {
  trait: ActiveTrait;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tierName = trait.activeThreshold?.tierName ?? "Locked";
  const style = TIER_STYLES[tierName] ?? TIER_STYLES.Locked;
  const next = trait.nextThreshold;
  const maxCount = next ? next.count : trait.activeThreshold?.count ?? 2;
  const progress = Math.min((trait.matchCount / maxCount) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border ${style.border} ${style.bg} rounded-md overflow-hidden ${trait.activeThreshold ? `shadow-sm ${style.glow}` : ""}`}
      data-testid={`trait-${trait.trait.id}`}
    >
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {/* Icon */}
          <span className="text-base leading-none shrink-0" aria-hidden="true">
            {trait.trait.icon}
          </span>

          {/* Name + traitType */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-xs font-bold text-foreground truncate">
                {trait.trait.name}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
                {trait.trait.traitType}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 void-bg-canvas rounded-full overflow-hidden relative">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${trait.activeThreshold ? "bg-gradient-to-r from-amber-500 via-slate-300 to-yellow-400" : "void-bg-canvas"}`}
                  style={{ width: `${progress}%` }}
                />
                {/* Threshold ticks */}
                {trait.trait.thresholds.map(th => {
                  const pct = (th.count / maxCount) * 100;
                  if (pct >= 99) return null;
                  return (
                    <div
                      key={th.count}
                      className="absolute top-0 bottom-0 w-px void-bg-canvas"
                      style={{ left: `${pct}%` }}
                    />
                  );
                })}
              </div>
              <span className="font-mono text-[9px] text-muted-foreground shrink-0 tabular-nums">
                {trait.matchCount}/{next?.count ?? trait.activeThreshold?.count}
              </span>
            </div>
          </div>

          {/* Tier badge */}
          <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${style.border} ${style.text} shrink-0`}>
            {tierName === "Locked" ? (
              <span className="flex items-center gap-0.5"><Lock size={8} />{next?.tierName ?? ""}</span>
            ) : tierName}
          </span>

          {expanded ? <ChevronUp size={10} className="text-muted-foreground shrink-0" /> : <ChevronDown size={10} className="text-muted-foreground shrink-0" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3 border-t border-border/10"
          >
            {/* Contributing members */}
            <div className="mt-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-1">
                Contributors ({trait.matchCount})
              </span>
              <div className="flex flex-wrap gap-1">
                {trait.matchingMembers.map(name => (
                  <span
                    key={name}
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-border/20 text-foreground/80"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Active tier bonuses */}
            {trait.activeThreshold && (
              <TierBlock threshold={trait.activeThreshold} active />
            )}

            {/* Next tier preview */}
            {next && (
              <TierBlock threshold={next} active={false} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── TIER BLOCK ─── */

function TierBlock({ threshold, active }: { threshold: TraitThreshold; active: boolean }) {
  const style = TIER_STYLES[threshold.tierName] ?? TIER_STYLES.Locked;
  return (
    <div className={`mt-2 pt-2 border-t border-border/10 ${active ? "" : "opacity-50"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <TrendingUp size={10} className={style.text} />
        <span className={`font-mono text-[9px] uppercase tracking-wider ${style.text}`}>
          {threshold.tierName} ({threshold.count}+) {active ? "— ACTIVE" : "— LOCKED"}
        </span>
      </div>
      <p className="font-mono text-[9px] italic text-muted-foreground/70 mb-1.5 leading-relaxed">
        "{threshold.flavor}"
      </p>
      <ul className="space-y-0.5">
        {threshold.bonuses.map((b, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className={`font-mono text-[9px] ${active ? "void-text-energy" : "void-text"} mt-0.5`}>
              {active ? "▸" : "◦"}
            </span>
            <span className={`font-mono text-[9px] ${active ? "text-foreground/90" : "text-muted-foreground/60"} leading-relaxed`}>
              {b.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
