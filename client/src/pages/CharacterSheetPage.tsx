import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "wouter";
import HolographicElara from "@/components/HolographicElara";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft, Shield, Swords, Heart, Zap, User,
  Sparkles, ArrowUp, Droplets, Flame, Wind, Mountain,
  Clock, Globe, Target, Wrench, Eye, Skull, Telescope,
  Star, Trophy, Gem, Lock, Unlock, Activity, Crosshair,
  Hexagon, CircleDot, Layers, Cpu, Wifi, ChevronDown, ChevronUp,
  RotateCcw, AlertTriangle, Compass, Crown
} from "lucide-react";
import TraitSummaryPanel from "@/components/TraitSummaryPanel";
import { MoralityMeter } from "@/components/MoralityMeter";
import MoralityUnlockablesPanel from "@/components/MoralityUnlockablesPanel";
import RespecDialog from "@/components/RespecDialog";
import { useGame } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link as WLink } from "wouter";
import PaperDollRenderer from "@/components/PaperDollRenderer";
import EquipmentPanel from "@/components/EquipmentPanel";
import { type EquipSlot, type Species, type CharClass, getEquipmentById, calculateEquipmentStats } from "@/data/equipmentData";

/* ═══════════════════════════════════════════════════
   CONSTANTS & MAPPINGS
   ═══════════════════════════════════════════════════ */

const ELEMENT_ICONS: Record<string, React.ComponentType<any>> = {
  earth: Mountain, fire: Flame, water: Droplets, air: Wind,
  space: Globe, time: Clock, probability: Target, reality: Sparkles,
};

const CLASS_ICONS: Record<string, React.ComponentType<any>> = {
  engineer: Wrench, oracle: Eye, assassin: Skull, soldier: Swords, spy: Telescope,
};

const ELEMENT_COLORS: Record<string, { text: string; bg: string; glow: string; border: string }> = {
  earth: { text: "text-amber-400", bg: "bg-amber-500/10", glow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]", border: "border-amber-400/30" },
  fire: { text: "text-red-400", bg: "bg-red-500/10", glow: "shadow-[0_0_12px_rgba(248,113,113,0.3)]", border: "border-red-400/30" },
  water: { text: "text-blue-400", bg: "bg-blue-500/10", glow: "shadow-[0_0_12px_rgba(96,165,250,0.3)]", border: "border-blue-400/30" },
  air: { text: "text-emerald-300", bg: "bg-emerald-500/10", glow: "shadow-[0_0_12px_rgba(110,231,183,0.3)]", border: "border-emerald-300/30" },
  space: { text: "text-indigo-400", bg: "bg-indigo-500/10", glow: "shadow-[0_0_12px_rgba(129,140,248,0.3)]", border: "border-indigo-400/30" },
  time: { text: "text-yellow-300", bg: "bg-yellow-500/10", glow: "shadow-[0_0_12px_rgba(253,224,71,0.3)]", border: "border-yellow-300/30" },
  probability: { text: "text-pink-400", bg: "bg-pink-500/10", glow: "shadow-[0_0_12px_rgba(244,114,182,0.3)]", border: "border-pink-400/30" },
  reality: { text: "text-violet-400", bg: "bg-violet-500/10", glow: "shadow-[0_0_12px_rgba(167,139,250,0.3)]", border: "border-violet-400/30" },
};

const SPECIES_LORE: Record<string, { title: string; tagline: string }> = {
  demagi: { title: "DeMagi", tagline: "Children of the Source — masters of elemental manipulation" },
  quarchon: { title: "Quarchon", tagline: "Silicon sentinels — dimensional architects of the Panopticon" },
  neyon: { title: "Ne-Yon", tagline: "The First Ten — hybrid entities of unparalleled power" },
};

const CLASS_LORE: Record<string, { title: string; tagline: string }> = {
  engineer: { title: "Engineer", tagline: "Reality hackers. They see the code behind the world." },
  oracle: { title: "Oracle", tagline: "Seers of fate. The future whispers to them." },
  assassin: { title: "Assassin", tagline: "Silent executors. Death is their art form." },
  soldier: { title: "Soldier", tagline: "Frontline warriors. Built for war." },
  spy: { title: "Spy", tagline: "Intelligence operatives. Trust no one." },
};

/* ═══════════════════════════════════════════════════
   STAT ORB — Glowing circular medallion for attributes
   Inspired by BG3 ability score circles
   ═══════════════════════════════════════════════════ */

function StatOrb({ value, max = 5, label, color, icon: Icon, onUpgrade, canUpgrade, upgradeCost, isPending }: {
  value: number; max?: number; label: string; color: "red" | "cyan" | "amber";
  icon: React.ComponentType<any>;
  onUpgrade?: () => void; canUpgrade?: boolean; upgradeCost?: string; isPending?: boolean;
}) {
  const colorMap = {
    red: {
      ring: "border-red-400/60",
      glow: "shadow-[0_0_20px_rgba(248,113,113,0.25),0_0_40px_rgba(248,113,113,0.1)]",
      text: "text-red-400",
      fill: "bg-red-400",
      bg: "bg-red-500/8",
      track: "bg-red-400/15",
    },
    cyan: {
      ring: "border-cyan-400/60",
      glow: "shadow-[0_0_20px_rgba(51,226,230,0.25),0_0_40px_rgba(51,226,230,0.1)]",
      text: "text-cyan-400",
      fill: "bg-cyan-400",
      bg: "bg-cyan-500/8",
      track: "bg-cyan-400/15",
    },
    amber: {
      ring: "border-amber-400/60",
      glow: "shadow-[0_0_20px_rgba(251,191,36,0.25),0_0_40px_rgba(251,191,36,0.1)]",
      text: "text-amber-400",
      fill: "bg-amber-400",
      bg: "bg-amber-500/8",
      track: "bg-amber-400/15",
    },
  };
  const c = colorMap[color];

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* The Orb */}
      <div className={`relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full border-2 ${c.ring} ${c.glow} ${c.bg} flex items-center justify-center`}>
        {/* Circuit trace ring decoration */}
        <div className="absolute inset-[-3px] rounded-full border border-dashed border-border/40 animate-[spin_30s_linear_infinite]" />
        {/* Inner value */}
        <div className="text-center z-10">
          <span className={`font-display text-2xl sm:text-3xl font-black ${c.text}`}>{value}</span>
        </div>
        {/* Dot pips around the orb */}
        <div className="absolute inset-0">
          {Array.from({ length: max }, (_, i) => {
            const angle = -90 + (i * 360) / max;
            const rad = (angle * Math.PI) / 180;
            const r = 42; // radius for sm, will be overridden by CSS
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${i < value ? c.fill : c.track} transition-all duration-300`}
                style={{
                  left: `calc(50% + ${Math.cos(rad) * r}% - 4px)`,
                  top: `calc(50% + ${Math.sin(rad) * r}% - 4px)`,
                }}
              />
            );
          })}
        </div>
      </div>
      {/* Label */}
      <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/70">{label}</span>
      {/* Upgrade button */}
      {canUpgrade && onUpgrade && (
        <button
          onClick={onUpgrade}
          disabled={isPending}
          className={`font-mono text-[8px] ${c.text} opacity-70 hover:opacity-100 transition-opacity flex items-center gap-0.5`}
        >
          <ArrowUp size={8} /> {upgradeCost}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMBAT STAT PANEL — Ornate bordered stat display
   ═══════════════════════════════════════════════════ */

function CombatPanel({ icon: Icon, label, value, color = "cyan" }: {
  icon: React.ComponentType<any>; label: string; value: string | number; color?: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-500/5",
    red: "text-red-400 border-red-400/20 bg-red-500/5",
    amber: "text-amber-400 border-amber-400/20 bg-amber-500/5",
    green: "text-emerald-400 border-emerald-400/20 bg-emerald-500/5",
    purple: "text-purple-400 border-purple-400/20 bg-purple-500/5",
  };
  const cls = colorMap[color] || colorMap.cyan;
  const [textColor] = cls.split(" ");

  return (
    <div className={`relative border rounded-lg p-3 ${cls} overflow-hidden`}>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-30" />
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className={textColor} />
        <span className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/60">{label}</span>
      </div>
      <p className={`font-display text-lg sm:text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GEAR SLOT — Equipment display with slot icon
   ═══════════════════════════════════════════════════ */

function GearSlot({ slot, item }: { slot: string; item: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
      <div className="w-7 h-7 rounded bg-muted/40 border border-border/60 flex items-center justify-center flex-shrink-0">
        <Hexagon size={12} className="text-muted-foreground/40" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase">{slot}</p>
        <p className="font-mono text-xs text-foreground/80 truncate">{item}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION HEADER — Consistent section divider
   ═══════════════════════════════════════════════════ */

function SectionHeader({ icon: Icon, label, color = "text-primary" }: {
  icon: React.ComponentType<any>; label: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={12} className={color} />
      <span className="font-display text-[10px] font-bold tracking-[0.3em] text-foreground/80">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN CHARACTER SHEET PAGE
   ═══════════════════════════════════════════════════ */

export default function CharacterSheetPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const character = trpc.citizen.getCharacter.useQuery(undefined, { enabled: isAuthenticated });
  const dreamBalance = trpc.citizen.getDreamBalance.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();
  const [showTraitDetails, setShowTraitDetails] = useState(false);
  const [showRespec, setShowRespec] = useState(false);
  const { state: gameState } = useGame();
  const gam = useGamification();

  // ═══ NARRATIVE INTRO (from Awakening) ═══
  const searchString = useSearch();
  const fromAwakening = searchString.includes("from=awakening");
  const [showNarrativeIntro, setShowNarrativeIntro] = useState(false);
  const [narrativeStep, setNarrativeStep] = useState(0);
  const [narrativeText, setNarrativeText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const ELARA_INTRO_LINES = useMemo(() => [
    "Neural scan complete. Your biometric profile has been compiled, Operative.",
    "This is your dossier — everything we know about what you are. Your species markers, class aptitudes, elemental affinity... it's all here.",
    "I've cross-referenced your readings with the Ark's historical database. Your potential is... significant. The Prophecy may have been right about you.",
    "Study your capabilities carefully. The Ark holds many secrets, and you'll need every advantage to survive what's coming.",
    "When you're ready, the Cryo Bay door leads to the rest of the ship. I'll be with you every step of the way.",
  ], []);

  // Trigger narrative intro on first visit from Awakening
  useEffect(() => {
    if (fromAwakening && character.data && !showNarrativeIntro) {
      const seen = sessionStorage.getItem("character_sheet_intro_seen");
      if (!seen) {
        setShowNarrativeIntro(true);
        sessionStorage.setItem("character_sheet_intro_seen", "1");
      }
    }
  }, [fromAwakening, character.data]);

  // Typewriter effect for Elara dialog
  useEffect(() => {
    if (!showNarrativeIntro || narrativeStep >= ELARA_INTRO_LINES.length) return;
    const line = ELARA_INTRO_LINES[narrativeStep];
    setIsTyping(true);
    setNarrativeText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < line.length) {
        setNarrativeText(line.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [showNarrativeIntro, narrativeStep, ELARA_INTRO_LINES]);

  const advanceNarrative = useCallback(() => {
    if (isTyping) {
      // Skip to end of current line
      setNarrativeText(ELARA_INTRO_LINES[narrativeStep]);
      setIsTyping(false);
      return;
    }
    if (narrativeStep < ELARA_INTRO_LINES.length - 1) {
      setNarrativeStep(s => s + 1);
    } else {
      setShowNarrativeIntro(false);
    }
  }, [isTyping, narrativeStep, ELARA_INTRO_LINES]);

  const levelUpClass = trpc.citizen.levelUpClass.useMutation({
    onSuccess: () => { utils.citizen.getCharacter.invalidate(); utils.citizen.getDreamBalance.invalidate(); },
  });
  const levelUpAttr = trpc.citizen.levelUpAttribute.useMutation({
    onSuccess: () => { utils.citizen.getCharacter.invalidate(); utils.citizen.getDreamBalance.invalidate(); },
  });

  // Loading / Auth / No Character states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-400/30 mx-auto mb-4 flex items-center justify-center animate-cyber-pulse">
            <Cpu size={24} className="text-cyan-400" />
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em]">AUTHENTICATING NEURAL LINK...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-float rounded-lg p-8 max-w-md text-center">
          <Lock size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold tracking-wider mb-2">CLEARANCE DENIED</h2>
          <p className="font-mono text-xs text-muted-foreground mb-6">Neural authentication required to access dossier.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/30 transition-all">
            <Wifi size={14} /> AUTHENTICATE
          </a>
        </div>
      </div>
    );
  }

  if (character.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border border-dashed border-cyan-400/20 mx-auto mb-4 animate-[spin_8s_linear_infinite] flex items-center justify-center">
            <Activity size={28} className="text-cyan-400 animate-pulse" />
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em]">DECRYPTING DOSSIER...</p>
        </div>
      </div>
    );
  }

  if (!character.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-float rounded-lg p-8 max-w-md text-center">
          <User size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold tracking-wider mb-2">NO CITIZEN RECORD</h2>
          <p className="font-mono text-xs text-muted-foreground mb-6">No neural imprint found. Initialize awakening sequence.</p>
          <Link href="/create-citizen" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/30 transition-all">
            <Zap size={14} /> BEGIN AWAKENING
          </Link>
        </div>
      </div>
    );
  }

  const char = character.data;
  const dream = dreamBalance.data;
  const isOrder = char.alignment === "order";
  const alignGlow = isOrder
    ? "shadow-[0_0_60px_rgba(51,226,230,0.15),0_0_120px_rgba(51,226,230,0.05)]"
    : "shadow-[0_0_60px_rgba(168,85,247,0.15),0_0_120px_rgba(168,85,247,0.05)]";
  const alignBorderColor = isOrder ? "border-cyan-400/25" : "border-purple-400/25";
  const alignTextColor = isOrder ? "text-cyan-400" : "text-purple-400";
  const alignBg = isOrder ? "bg-cyan-500/8" : "bg-purple-500/8";
  const alignGlowText = isOrder ? "glow-cyan" : "glow-purple";

  const ElIcon = ELEMENT_ICONS[char.element] || Sparkles;
  const ClIcon = CLASS_ICONS[char.characterClass] || Swords;
  const elColors = ELEMENT_COLORS[char.element] || ELEMENT_COLORS.earth;
  const speciesLore = SPECIES_LORE[char.species] || SPECIES_LORE.demagi;
  const classLore = CLASS_LORE[char.characterClass] || CLASS_LORE.soldier;

  const classLevelCostXp = char.classLevel * 100;
  const classLevelCostDream = char.classLevel * 5;
  const gear = (char.gear || {}) as Record<string, string>;
  const gearEntries = Object.entries(gear);

  const xpPercent = Math.min((char.xp % 200) / 200 * 100, 100);

  // ═══ PAPER DOLL EQUIPMENT STATE ═══
  const [showEquipPanel, setShowEquipPanel] = useState(false);
  const paperDollEquipped = useMemo<Record<EquipSlot, string | null>>(() => {
    return {
      weapon: gear.weapon || null,
      armor: gear.armor || null,
      helm: gear.helm || null,
      secondary: gear.secondary || null,
      accessory: gear.accessory || null,
      consumable: gear.consumable || null,
    };
  }, [gear]);
  // Build inventory from gear values (all items the player has)
  const playerInventory = useMemo(() => {
    return Object.values(gear).filter(Boolean);
  }, [gear]);
  const equipStats = useMemo(() => calculateEquipmentStats(paperDollEquipped), [paperDollEquipped]);
  const handleEquipChange = (slot: EquipSlot, itemId: string | null) => {
    // For now, equipment changes are visual-only in the character sheet
    // Full server-side persistence will come with the crafting system
    console.log(`[Equipment] ${slot} → ${itemId || 'unequipped'}`);
  };

  return (
    <div className="min-h-screen relative">
      {/* ═══ BACKGROUND DECORATIONS ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Alignment-colored nebula */}
        <div className={`nebula-blob w-[500px] h-[500px] ${isOrder ? "bg-cyan-500" : "bg-purple-500"} top-[-100px] right-[-100px]`} style={{ animationDelay: "-5s" }} />
        <div className={`nebula-blob w-[400px] h-[400px] ${isOrder ? "bg-blue-600" : "bg-violet-600"} bottom-[-100px] left-[-100px]`} style={{ animationDelay: "-12s" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      {/* ═══ NARRATIVE ELARA INTRO OVERLAY ═══ */}
      <AnimatePresence>
        {showNarrativeIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
            onClick={advanceNarrative}
            style={{ background: "radial-gradient(ellipse at center, rgba(0,5,30,0.95) 0%, rgba(0,0,0,0.98) 100%)" }}
          >
            {/* Scanlines */}
            <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-30" />
            <div className="absolute inset-0 grid-bg opacity-20" />

            <div className="max-w-xl mx-auto px-6 text-center">
              {/* Holographic Elara */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8"
              >
                <HolographicElara size="lg" isSpeaking={isTyping} />
              </motion.div>

              {/* Elara label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/50" />
                  <span className="font-mono text-[10px] text-cyan-400/80 tracking-[0.4em]">ELARA // AI COMPANION</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/50" />
                </div>
              </motion.div>

              {/* Dialog text */}
              <motion.div
                key={narrativeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-[80px] flex items-center justify-center"
              >
                <p className="font-mono text-sm sm:text-base text-foreground leading-relaxed">
                  {narrativeText}
                  {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse" />}
                </p>
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {ELARA_INTRO_LINES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === narrativeStep ? "bg-cyan-400 w-4" : i < narrativeStep ? "bg-cyan-400/40" : "bg-foreground/15"
                    }`}
                  />
                ))}
              </div>

              {/* Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-mono text-[10px] text-muted-foreground/35 mt-6 tracking-wider"
              >
                {isTyping ? "CLICK TO SKIP" : narrativeStep < ELARA_INTRO_LINES.length - 1 ? "CLICK TO CONTINUE" : "CLICK TO VIEW DOSSIER"}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ DOSSIER HEADER BAR ═══ */}
      <div className="relative z-10 border-b border-border/40 bg-muted/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            <ChevronLeft size={12} /> COMMAND CONSOLE
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.3em]">DOSSIER // ACTIVE</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/40">LVL {char.level}</span>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* ═══════════════════════════════════════════════════
            TOP SECTION: Identity + Portrait + Core Stats
            Inspired by BG3 character sheet top half
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-xl border ${alignBorderColor} ${alignGlow} overflow-hidden mb-6`}
        >
          {/* Dossier background texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[#010020]/80 to-black/60" />
          {/* Circuit trace border animation */}
          <div className="absolute inset-0 rounded-xl" style={{
            background: `linear-gradient(90deg, transparent 0%, ${isOrder ? "rgba(51,226,230,0.1)" : "rgba(168,85,247,0.1)"} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "border-trace 6s linear infinite",
          }} />
          {/* CRT scanlines */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none" />

          <div className="relative p-4 sm:p-6">
            {/* ── CLASSIFICATION HEADER ── */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOrder ? "bg-cyan-400" : "bg-purple-400"} animate-pulse`} />
                <span className="font-mono text-[8px] tracking-[0.4em] text-muted-foreground/50">
                  PANOPTICON CITIZEN REGISTRY // {isOrder ? "ORDER DIVISION" : "CHAOS INSURGENCY"}
                </span>
              </div>
              <span className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/30">
                CLEARANCE: LEVEL {Math.min(Math.floor(char.level / 5) + 1, 10)}
              </span>
            </div>

            {/* ── MAIN IDENTITY LAYOUT ── */}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              {/* LEFT: Paper Doll Portrait */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                {/* Paper Doll Character Art */}
                <div className={`relative rounded-lg border-2 ${alignBorderColor} overflow-hidden flex-shrink-0`}
                  style={{ boxShadow: isOrder ? '0 0 30px rgba(51,226,230,0.1)' : '0 0 30px rgba(168,85,247,0.1)' }}>
                  {/* Background */}
                  <div className={`absolute inset-0 ${alignBg}`} />
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  {/* Scan line sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute w-full h-0.5 ${isOrder ? "bg-cyan-400/20" : "bg-purple-400/20"} animate-scan-line`} />
                  </div>
                  {/* Paper Doll Renderer */}
                  <div className="relative z-10 p-2">
                    <PaperDollRenderer
                      species={char.species as Species}
                      alignment={char.alignment as "order" | "chaos"}
                      element={char.element}
                      equipped={paperDollEquipped}
                      name={char.name}
                      size="md"
                      interactive
                      onSlotClick={() => setShowEquipPanel(true)}
                      moralityScore={gameState.moralityScore || 0}
                    />
                  </div>
                  {/* Corner brackets */}
                  <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  <div className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  <div className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  {/* Ne-Yon 1/1 badge */}
                  {char.species === "neyon" && char.neyonTokenId && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 z-20">
                      <span className="font-mono text-[7px] text-amber-400 font-bold">#{char.neyonTokenId} ✦ 1/1</span>
                    </div>
                  )}
                </div>

                {/* Alignment badge below portrait */}
                <div className={`px-3 py-1.5 rounded-full border ${alignBorderColor} ${alignBg} flex items-center gap-1.5`}>
                  {isOrder ? <Shield size={10} className="text-cyan-400" /> : <Zap size={10} className="text-purple-400" />}
                  <span className={`font-display text-[9px] font-bold tracking-[0.3em] ${alignTextColor}`}>
                    {char.alignment.toUpperCase()}
                  </span>
                </div>

                {/* Equipment Stats Summary */}
                {(equipStats.atk > 0 || equipStats.def > 0 || equipStats.hp > 0 || equipStats.speed > 0) && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {equipStats.atk > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-400/15">+{equipStats.atk} ATK</span>}
                    {equipStats.def > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-400/15">+{equipStats.def} DEF</span>}
                    {equipStats.hp > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-400/15">+{equipStats.hp} HP</span>}
                    {equipStats.speed > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-400/15">+{equipStats.speed} SPD</span>}
                  </div>
                )}
              </div>

              {/* RIGHT: Identity + Stats */}
              <div className="flex-1 min-w-0">
                {/* Name */}
                <h1 className={`font-display text-2xl sm:text-4xl font-black tracking-wider ${alignTextColor} ${alignGlowText} mb-1 truncate`}>
                  {char.name}
                </h1>

                {/* Species / Class / Element tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20">
                    {speciesLore.title}
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                    <ClIcon size={8} /> {classLore.title} Lv.{char.classLevel}
                  </span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${elColors.bg} ${elColors.text} ${elColors.border} border flex items-center gap-1`}>
                    <ElIcon size={8} /> {char.element.toUpperCase()}
                  </span>
                </div>

                {/* XP Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[8px] text-muted-foreground/50 tracking-[0.2em]">EXPERIENCE</span>
                    <span className="font-mono text-[9px] text-muted-foreground/60">{char.xp} XP</span>
                  </div>
                  <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isOrder ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-purple-500 to-violet-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* ── ATTRIBUTE ORBS (BG3-style ability score circles) ── */}
                <div className="flex items-start justify-center sm:justify-start gap-4 sm:gap-6">
                  <StatOrb
                    value={char.attrAttack}
                    label="ATTACK"
                    color="red"
                    icon={Crosshair}
                    canUpgrade={char.attrAttack < 5 && !!dream}
                    onUpgrade={() => levelUpAttr.mutate({ attribute: "attack" })}
                    upgradeCost={`${char.attrAttack * 10}D ${char.attrAttack * 3}SB`}
                    isPending={levelUpAttr.isPending}
                  />
                  <StatOrb
                    value={char.attrDefense}
                    label="DEFENSE"
                    color="cyan"
                    icon={Shield}
                    canUpgrade={char.attrDefense < 5 && !!dream}
                    onUpgrade={() => levelUpAttr.mutate({ attribute: "defense" })}
                    upgradeCost={`${char.attrDefense * 10}D ${char.attrDefense * 3}SB`}
                    isPending={levelUpAttr.isPending}
                  />
                  <StatOrb
                    value={char.attrVitality}
                    label="VITALITY"
                    color="amber"
                    icon={Heart}
                    canUpgrade={char.attrVitality < 5 && !!dream}
                    onUpgrade={() => levelUpAttr.mutate({ attribute: "vitality" })}
                    upgradeCost={`${char.attrVitality * 10}D ${char.attrVitality * 3}SB`}
                    isPending={levelUpAttr.isPending}
                  />
                </div>
                {levelUpAttr.error && (
                  <p className="font-mono text-[10px] text-destructive mt-2">{levelUpAttr.error.message}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            MIDDLE SECTION: Combat Stats + Gear + Element
            Two-column layout like BG3 lower half
           ═══════════════════════════════════════════════════ */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 mb-6">
          {/* ── COMBAT READOUT ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={Swords} label="COMBAT READOUT" color="text-red-400" />
            <div className="grid grid-cols-2 gap-2.5">
              <CombatPanel icon={Heart} label="MAX HP" value={char.maxHp} color="red" />
              <CombatPanel icon={Shield} label="ARMOR" value={char.armor} color="cyan" />
              <CombatPanel icon={ElIcon} label="ELEMENT ABILITY" value={char.elementInfo?.ability || "—"} color="green" />
              <CombatPanel icon={ClIcon} label="CLASS LEVEL" value={char.classLevel} color="amber" />
            </div>

            {/* Class Level Up */}
            <button
              onClick={() => levelUpClass.mutate()}
              disabled={levelUpClass.isPending}
              className="w-full mt-3 py-2 rounded-md bg-amber-500/8 border border-amber-400/20 text-amber-400 font-mono text-[10px] tracking-[0.1em] hover:bg-amber-500/15 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ArrowUp size={10} /> ADVANCE CLASS ({classLevelCostXp} XP + {classLevelCostDream} Dream)
            </button>
            {levelUpClass.error && (
              <p className="font-mono text-[9px] text-destructive mt-2">{levelUpClass.error.message}</p>
            )}
          </motion.div>

          {/* ── EQUIPPED GEAR (Enhanced with rarity) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={Layers} label="EQUIPPED GEAR" color="text-amber-400" />
            {gearEntries.length > 0 ? (
              <div>
                {gearEntries.map(([slot, itemName]) => {
                  const equipItem = getEquipmentById(itemName);
                  const rarityColor = equipItem ? {
                    common: 'text-muted-foreground', uncommon: 'text-green-400',
                    rare: 'text-blue-400', epic: 'text-purple-400', legendary: 'text-amber-400'
                  }[equipItem.rarity] : 'text-foreground/80';
                  return (
                    <div key={slot} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                      <div className="w-7 h-7 rounded bg-muted/40 border border-border/60 flex items-center justify-center flex-shrink-0"
                        style={equipItem ? { boxShadow: `0 0 6px ${equipItem.glowColor}` } : undefined}>
                        <Hexagon size={12} className={equipItem ? rarityColor : "text-muted-foreground/40"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase">{slot}</p>
                        <p className={`font-mono text-xs truncate ${rarityColor}`}>{equipItem?.name || itemName}</p>
                      </div>
                      {equipItem && (
                        <div className="flex gap-1">
                          {equipItem.stats.atk ? <span className="font-mono text-[8px] text-red-400">+{equipItem.stats.atk}</span> : null}
                          {equipItem.stats.def ? <span className="font-mono text-[8px] text-blue-400">+{equipItem.stats.def}</span> : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Hexagon size={28} className="text-muted-foreground/20 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/40">No gear equipped</p>
                <p className="font-mono text-[8px] text-muted-foreground/25 mt-1">Visit the Forge to craft equipment</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BOTTOM SECTION: Dream Resources + Species/Class Lore
           ═══════════════════════════════════════════════════ */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 mb-6">
          {/* ── DREAM RESOURCES ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={Gem} label="DREAM RESOURCES" color="text-purple-400" />
            {dream ? (
              <div className="grid grid-cols-2 gap-2.5">
                <CombatPanel icon={Gem} label="DREAM TOKENS" value={dream.dreamTokens} color="purple" />
                <CombatPanel icon={Lock} label="SOUL BOUND" value={dream.soulBoundDream} color="amber" />
                <CombatPanel icon={Cpu} label="DNA / CODE" value={dream.dnaCode} color="green" />
                <CombatPanel icon={Activity} label="LIFETIME EARNED" value={dream.totalDreamEarned} color="cyan" />
              </div>
            ) : (
              <div className="text-center py-6">
                <Gem size={28} className="text-muted-foreground/20 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/40">No Dream balance. Earn through combat and exploration.</p>
              </div>
            )}
          </motion.div>

          {/* ── SPECIES & CLASS IDENTITY ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={CircleDot} label="SPECIES & CLASS IDENTITY" color="text-blue-400" />

            {/* Species */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-display text-sm font-bold tracking-wider text-blue-400">{speciesLore.title}</span>
                {char.species === "neyon" && char.neyonTokenId && (
                  <span className="font-mono text-[7px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-400/20">
                    POTENTIALS #{char.neyonTokenId}
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground/60 mb-2">{speciesLore.tagline}</p>
              <div className="flex flex-wrap gap-1.5">
                {(char.species === "demagi" || char.species === "neyon") && (
                  <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-400/15">+20 HP</span>
                )}
                {(char.species === "quarchon" || char.species === "neyon") && (
                  <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/15">+5 ARMOR</span>
                )}
                {char.species === "neyon" && (
                  <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-400/15">HYBRID BONUS</span>
                )}
              </div>
            </div>

            {/* Class */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <ClIcon size={12} className="text-amber-400" />
                <span className="font-display text-sm font-bold tracking-wider text-amber-400">{classLore.title}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground/60 mb-2">{classLore.tagline}</p>
            </div>

            {/* Element */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ElIcon size={12} className={elColors.text} />
                <span className={`font-display text-sm font-bold tracking-wider ${elColors.text}`}>{char.element.toUpperCase()}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground/60">
                {char.elementInfo?.description || `Attuned to the ${char.element} force.`}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════
            QUEST PROGRESS & ACHIEVEMENTS — Central Identity Hub
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <SectionHeader icon={Target} label="MISSION STATUS" color="text-green-400" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: "ROOMS", value: gameState.totalRoomsUnlocked, icon: Unlock, color: "text-cyan-400", border: "border-cyan-400/20" },
              { label: "ITEMS", value: gameState.totalItemsFound, icon: Star, color: "text-amber-400", border: "border-amber-400/20" },
              { label: "FIGHTS", value: gam.gameSave.totalFights, icon: Swords, color: "text-red-400", border: "border-red-400/20" },
              { label: "WIN STREAK", value: gam.gameSave.bestWinStreak, icon: Trophy, color: "text-purple-400", border: "border-purple-400/20" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`rounded-lg border ${stat.border} bg-muted/40 p-3 flex items-center gap-2.5`}>
                  <Icon size={14} className={stat.color} />
                  <div>
                    <p className="font-display text-base font-bold tracking-wide">{stat.value}</p>
                    <p className="font-mono text-[8px] text-muted-foreground/50 tracking-[0.15em]">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievements earned */}
          <SectionHeader icon={Trophy} label="ACHIEVEMENTS" color="text-amber-400" />
          <div className="space-y-1.5 mb-4">
            {gameState.achievementsEarned.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground/40 text-center py-4">No achievements earned yet. Explore the Ark to unlock them.</p>
            ) : (
              gameState.achievementsEarned.slice(0, 8).map((ach, i) => (
                <div key={ach} className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/10">
                  <Trophy size={12} className="text-amber-400" />
                  <span className="font-mono text-[10px] text-amber-300/80 flex-1">{ach.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              ))
            )}
            {gameState.achievementsEarned.length > 8 && (
              <p className="font-mono text-[9px] text-muted-foreground/30 text-center">+{gameState.achievementsEarned.length - 8} more achievements</p>
            )}
          </div>

          {/* Exploration progress */}
          <SectionHeader icon={Compass} label="ARK EXPLORATION" color="text-cyan-400" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Rooms Unlocked", value: gameState.totalRoomsUnlocked, max: 10 },
              { label: "Items Found", value: gameState.totalItemsFound, max: 30 },
              { label: "Cards Collected", value: gameState.collectedCards.length, max: 50 },
            ].map((prog) => (
              <div key={prog.label} className="rounded-lg bg-muted/40 border border-cyan-400/10 p-3">
                <p className="font-mono text-[8px] text-muted-foreground/50 tracking-wider mb-1">{prog.label.toUpperCase()}</p>
                <div className="flex items-end gap-1">
                  <span className="font-display text-lg font-bold text-cyan-400">{prog.value}</span>
                  <span className="font-mono text-[9px] text-muted-foreground/30 pb-0.5">/ {prog.max}</span>
                </div>
                <div className="h-1 rounded-full bg-muted/40 mt-1.5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((prog.value / prog.max) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gamification Title & Rank */}
          <SectionHeader icon={Crown} label="OPERATIVE RANK" color="text-purple-400" />
          <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-purple-500/5 border border-purple-500/10 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
              <span className="font-display text-lg font-black text-purple-400">{gam.level}</span>
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-bold tracking-wider text-purple-300">{gam.title}</p>
              <p className="font-mono text-[9px] text-muted-foreground/50">{gam.xp} XP // Level {gam.level}</p>
              <div className="h-1.5 rounded-full bg-muted/40 mt-1.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((gam.xp % 200) / 200) * 100, 100)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            MORALITY ALIGNMENT & UNLOCKABLES
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.29 }}
          className="mb-4 space-y-3"
        >
          <SectionHeader icon={Shield} label="MORALITY ALIGNMENT" color="text-purple-400" />
          <MoralityMeter showDetails={true} />
          <MoralityUnlockablesPanel />
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            RESPEC BUTTON + TRAIT IMPACT SUMMARY
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowRespec(true)}
            className="w-full py-3 rounded-lg glass-float border border-purple-400/15 hover:border-purple-400/30 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2.5 group"
          >
            <RotateCcw size={14} className="text-purple-400 group-hover:animate-spin" style={{ animationDuration: '2s' }} />
            <span className="font-display text-[10px] font-bold tracking-[0.25em] text-purple-400">NEURAL RESPEC</span>
            <span className="font-mono text-[8px] text-muted-foreground/30">— Reassign attributes, alignment, or element</span>
          </button>
        </motion.div>

        <TraitSummaryPanel isAuthenticated={isAuthenticated} />

        {/* Respec Dialog */}
        <RespecDialog isOpen={showRespec} onClose={() => setShowRespec(false)} isAuthenticated={isAuthenticated} />

        {/* ═══ PROCEED TO ARK (post-Awakening) ═══ */}
        {fromAwakening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <Link
              href="/ark"
              className="w-full py-4 rounded-lg border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-3 group"
              style={{ boxShadow: "0 0 30px rgba(51,226,230,0.1)" }}
            >
              <Sparkles size={16} className="text-cyan-400 group-hover:animate-pulse" />
              <span className="font-display text-sm font-bold tracking-[0.2em] text-cyan-400">PROCEED TO THE ARK</span>
              <span className="font-mono text-[9px] text-cyan-400/50">— Begin exploring the ship</span>
            </Link>
            <p className="text-center font-mono text-[9px] text-muted-foreground/30 mt-2 tracking-wider">
              Elara will guide you through the Cryo Bay and beyond
            </p>
          </motion.div>
        )}

        {/* ═══ FOOTER CLASSIFICATION ═══ */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/10" />
            <span className="font-mono text-[7px] text-muted-foreground/25 tracking-[0.5em]">END OF DOSSIER // CLASSIFIED</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
