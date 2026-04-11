/* ═══════════════════════════════════════════════════════
   APPRENTICE MEMORIAL WALL

   A solemn display of fallen apprentices. Each entry
   carries their name, archetype, cause of death, days
   served, and a generated epitaph. Candle glows pulse
   beside each name. Click to expand their full story.

   "No names yet grace this wall. May it stay that way."
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronDown, ChevronUp, Skull, Clock, Shield } from "lucide-react";
import { generateEpitaph } from "@shared/apprenticePermadeath";

export interface FallenApprentice {
  name: string;
  archetype: string;
  rarity: string;
  causeOfDeath: string;
  daysServed: number;
  backstory?: string;
}

interface Props {
  fallen: FallenApprentice[];
}

/* ─── RARITY COLORS ─── */

const RARITY_COLORS: Record<string, string> = {
  common: "text-slate-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  mythic: "text-amber-400",
};

const RARITY_GLOW: Record<string, string> = {
  common: "shadow-slate-500/20",
  uncommon: "shadow-green-500/20",
  rare: "shadow-blue-500/20",
  epic: "shadow-purple-500/30",
  mythic: "shadow-amber-500/40",
};

/* ─── ARCHETYPE DISPLAY NAMES ─── */

const ARCHETYPE_TITLES: Record<string, string> = {
  zealot: "The Zealot",
  ghost: "The Ghost",
  scholar: "The Scholar",
  revenant: "The Revenant",
  artisan: "The Artisan",
  oracle: "The Oracle",
  wanderer: "The Wanderer",
  martyr: "The Martyr",
  heretic: "The Heretic",
  jester: "The Jester",
  sentinel: "The Sentinel",
  prodigal: "The Prodigal",
};

/* ─── MEMORIAL ENTRY ─── */

function MemorialEntry({ entry, index }: { entry: FallenApprentice; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const epitaph = generateEpitaph(entry.archetype, entry.causeOfDeath);
  const rarityColor = RARITY_COLORS[entry.rarity] ?? "text-slate-400";
  const rarityGlow = RARITY_GLOW[entry.rarity] ?? "";
  const title = ARCHETYPE_TITLES[entry.archetype] ?? entry.archetype;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
      className={`
        relative border border-border/20 rounded-lg bg-card/30 backdrop-blur-sm
        overflow-hidden shadow-lg ${rarityGlow}
      `}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors"
        aria-expanded={expanded}
        aria-label={`Memorial for ${entry.name}, ${title}`}
      >
        {/* Candle glow */}
        <div className="relative flex-shrink-0 mt-1" aria-hidden="true">
          <Flame className="w-5 h-5 text-amber-400 candle-glow" />
          <div className="absolute inset-0 w-5 h-5 rounded-full bg-amber-400/20 candle-glow" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{entry.name}</span>
            <span className={`text-xs font-medium ${rarityColor}`}>
              {title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 italic leading-relaxed">
            &ldquo;{epitaph}&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1">
              <Skull className="w-3 h-3" />
              {entry.causeOfDeath}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {entry.daysServed} {entry.daysServed === 1 ? "day" : "days"} served
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <div className="flex-shrink-0 mt-1 text-muted-foreground/50">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded story */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/10">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-muted-foreground/60" />
                <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                  Full Record
                </span>
              </div>
              {entry.backstory ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.backstory}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/60 italic">
                  No further record exists. They lived. They served. They fell.
                </p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/20 rounded px-2 py-1.5">
                  <span className="text-muted-foreground/60 block">Archetype</span>
                  <span className={rarityColor}>{title}</span>
                </div>
                <div className="bg-black/20 rounded px-2 py-1.5">
                  <span className="text-muted-foreground/60 block">Rarity</span>
                  <span className={rarityColor}>{entry.rarity}</span>
                </div>
                <div className="bg-black/20 rounded px-2 py-1.5">
                  <span className="text-muted-foreground/60 block">Cause of Death</span>
                  <span className="text-foreground/80">{entry.causeOfDeath}</span>
                </div>
                <div className="bg-black/20 rounded px-2 py-1.5">
                  <span className="text-muted-foreground/60 block">Days Served</span>
                  <span className="text-foreground/80">{entry.daysServed}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── CANDLE GLOW KEYFRAMES (injected once) ─── */

const CANDLE_STYLE_ID = "apprentice-memorial-candle-glow";

function ensureCandleStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(CANDLE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = CANDLE_STYLE_ID;
  style.textContent = `
    @keyframes candleGlow {
      0%, 100% { opacity: 1; filter: brightness(1); }
      30% { opacity: 0.7; filter: brightness(0.8); }
      60% { opacity: 0.9; filter: brightness(1.2); }
      80% { opacity: 0.75; filter: brightness(0.9); }
    }
    .candle-glow {
      animation: candleGlow 3s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .candle-glow {
        animation: none;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ─── MAIN COMPONENT ─── */

export default function ApprenticeMemorial({ fallen }: Props) {
  // Inject candle animation styles
  if (typeof document !== "undefined") {
    ensureCandleStyles();
  }

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400/80" />
          <h2 className="text-sm font-semibold text-foreground tracking-wide">
            Memorial Wall
          </h2>
          {fallen.length > 0 && (
            <span className="text-xs text-muted-foreground/60 ml-auto">
              {fallen.length} {fallen.length === 1 ? "name" : "names"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {fallen.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-8 text-center"
          >
            <Flame className="w-6 h-6 text-amber-400/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground/60 italic">
              No names yet grace this wall. May it stay that way.
            </p>
          </motion.div>
        ) : (
          fallen.map((entry, i) => (
            <MemorialEntry key={`${entry.name}-${entry.archetype}-${i}`} entry={entry} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
