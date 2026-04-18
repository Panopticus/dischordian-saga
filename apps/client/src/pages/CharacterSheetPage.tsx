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
  RotateCcw, AlertTriangle, Compass, Crown, X
} from "lucide-react";
import TraitSummaryPanel from "@/components/TraitSummaryPanel";
import CharacterMindPanel from "@/components/CharacterMindPanel";
import { MoralityMeter } from "@/components/MoralityMeter";
import MoralityUnlockablesPanel from "@/components/MoralityUnlockablesPanel";
import RespecDialog from "@/components/RespecDialog";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CharacterAuraOverlay } from "@/components/CharacterAuraOverlay";
import { MoralityMilestoneRewards } from "@/components/MoralityMilestoneRewards";
import { useGame } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link as WLink } from "wouter";
import PaperDollRenderer from "@/components/PaperDollRenderer";
import EquipmentPanel from "@/components/EquipmentPanel";
import { type EquipSlot, type Species, type CharClass, getEquipmentById, calculateEquipmentStats, EQUIPMENT_DB } from "@/data/equipmentData";
import { equipItem as globalEquipItem, type EquippedItem } from "@/game/equipmentState";
import { canPrestige, getPrestigeLevel, getPrestigeStars, getPrestigeTitle, PRESTIGE_LEVELS, type PrestigeLevel } from "@shared/prestigeSystem";
import { MASTERY_BRANCHES } from "@shared/masteryTree";

import LivingBackground from "@/components/LivingBackground";

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
  earth: { text: "void-text-accent", bg: "void-bg-sunk", glow: "shadow-[0_0_12px_color-mix(in oklch, var(--energy-accent) 30%, transparent)]", border: "void-border" },
  fire: { text: "void-text-error", bg: "void-bg-error", glow: "shadow-[0_0_12px_color-mix(in oklch, var(--energy-error) 30%, transparent)]", border: "void-border-error" },
  water: { text: "void-text-energy", bg: "void-bg-sunk", glow: "shadow-[0_0_12px_color-mix(in oklch, var(--electric-blue) 30%, transparent)]", border: "void-border" },
  air: { text: "void-text-energy", bg: "void-bg-success", glow: "shadow-[0_0_12px_rgba(110,231,183,0.3)]", border: "void-border-success" },
  space: { text: "void-text-energy", bg: "void-bg-sunk", glow: "shadow-[0_0_12px_rgba(129,140,248,0.3)]", border: "void-border" },
  time: { text: "void-text-premium", bg: "void-bg-sunk", glow: "shadow-[0_0_12px_rgba(253,224,71,0.3)]", border: "void-border" },
  probability: { text: "void-text-error", bg: "void-bg-error", glow: "shadow-[0_0_12px_rgba(244,114,182,0.3)]", border: "void-border-error" },
  reality: { text: "void-text-system", bg: "void-bg-system", glow: "shadow-[0_0_12px_rgba(167,139,250,0.3)]", border: "void-border-system" },
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
   BIOSCAN DIAGNOSTIC QUOTES
   ═══════════════════════════════════════════════════ */

const KINETIC_QUOTES = [
  "",
  "Combat reflexes still recalibrating from cryo. The neural pathways are there — they need reactivation.",
  "Baseline combat response. Functional. The cryo process preserved your fundamentals.",
  "Above-average kinetic output. Your body remembers fighting even if your mind doesn't.",
  "93rd percentile neural-to-muscle response. The Game Master would have flagged you.",
  "I've cross-referenced every Potential in the database. Your combat reflexes are unprecedented.",
];
const INTEGRITY_QUOTES = [
  "",
  "Structural readings are concerning. The cryo process degraded your defensive matrix.",
  "Standard defensive architecture. Your body absorbs kinetic force within normal parameters.",
  "Enhanced structural integrity. Your species physiology provides natural reinforcement.",
  "Kinetic absorption capacity approaching theoretical limits for organic matter.",
  "Your defensive matrix exceeds anything in the Ark's historical database. The Dreamer would be impressed.",
];
const RESONANCE_QUOTES = [
  "",
  "Core resonance is weak. Your connection to the Dream substrate is tenuous.",
  "Stable resonance. The Matrix of Dreams recognizes your signal.",
  "Strong resonance. The Dreamer's frequency harmonizes with your bio-signature.",
  "Exceptional core resonance. You're pulling energy from the Dream substrate without trying.",
  "Your resonance signature matches readings I've only seen in pre-Fall records. This shouldn't be possible.",
];

/* ═══════════════════════════════════════════════════
   AUGMENTATION SLOT & RARITY MAPPINGS
   ═══════════════════════════════════════════════════ */

const SLOT_NAMES: Record<string, string> = {
  weapon: "PRIMARY AUGMENT",
  armor: "KINETIC LAYER",
  helm: "NEURAL INTERFACE",
  secondary: "AUXILIARY SYSTEM",
  accessory: "RESONANCE MODULE",
  consumable: "EMERGENCY PROTOCOL",
};

const RARITY_NAMES: Record<string, { label: string; color: string }> = {
  common: { label: "STANDARD ISSUE", color: "text-muted-foreground" },
  uncommon: { label: "FIELD MODIFIED", color: "void-text-energy" },
  rare: { label: "PRE-AWAKENING", color: "void-text-energy" },
  epic: { label: "CONSCIOUSNESS-ATTUNED", color: "void-text-system" },
  legendary: { label: "VOID-PATTERN", color: "void-text-accent" },
  mythic: { label: "DREAMER'S DESIGN", color: "void-text-error" },
};

const CLEARANCE_TITLES: Record<number, { order: string; chaos: string }> = {
  0: { order: "CLEARANCE: RECRUIT", chaos: "CLEARANCE: RECRUIT" },
  1: { order: "CLEARANCE: OPERATIVE", chaos: "CLEARANCE: OPERATIVE" },
  2: { order: "CLEARANCE: SENTINEL", chaos: "CLEARANCE: SENTINEL" },
  3: { order: "CLEARANCE: ARCHON-CANDIDATE", chaos: "CLEARANCE: NE-YON CANDIDATE" },
  4: { order: "CLEARANCE: ASCENDANT", chaos: "CLEARANCE: TRANSCENDENT" },
};

/* ═══════════════════════════════════════════════════
   BIOSCAN READOUT — Horizontal bar diagnostic for each stat
   ═══════════════════════════════════════════════════ */

function BioscanReadout({ value, max = 5, label, immersiveName, color, icon: Icon, quote, onUpgrade, canUpgrade, upgradeCost, isPending }: {
  value: number; max?: number; label: string; immersiveName: string;
  color: "red" | "cyan" | "amber";
  icon: React.ComponentType<any>;
  quote: string;
  onUpgrade?: () => void; canUpgrade?: boolean; upgradeCost?: string; isPending?: boolean;
}) {
  const colorMap = {
    red: {
      bar: "bg-gradient-to-r from-red-500 to-red-400",
      glow: "shadow-[0_0_12px_color-mix(in oklch, var(--energy-error) 30%, transparent)]",
      text: "void-text-error",
      track: "void-bg-error",
      border: "void-border-error",
      bg: "void-bg-error",
    },
    cyan: {
      bar: "bg-gradient-to-r from-cyan-500 to-cyan-400",
      glow: "shadow-[0_0_12px_color-mix(in oklch, var(--energy-primary) 30%, transparent)]",
      text: "void-text-energy",
      track: "void-bg-success",
      border: "void-border-success",
      bg: "void-bg-success",
    },
    amber: {
      bar: "bg-gradient-to-r from-amber-500 to-amber-400",
      glow: "shadow-[0_0_12px_color-mix(in oklch, var(--energy-premium) 30%, transparent)]",
      text: "void-text-accent",
      track: "void-bg-sunk",
      border: "void-border",
      bg: "void-bg-sunk",
    },
  };
  const c = colorMap[color];
  const pct = (value / max) * 100;

  return (
    <div className={`relative rounded-lg border ${c.border} ${c.bg} p-3 sm:p-4 overflow-hidden`}>
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${c.border} opacity-60`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${c.border} opacity-60`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${c.border} opacity-60`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${c.border} opacity-60`} />

      {/* Header: immersive name + value */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className={c.text} />
          <span className={`font-display text-[10px] font-bold tracking-[0.25em] ${c.text}`}>{immersiveName}</span>
        </div>
        <span className={`font-mono text-sm font-bold ${c.text}`}>{value.toFixed(1)} / {max.toFixed(1)}</span>
      </div>

      {/* Horizontal bar */}
      <div className={`h-2 rounded-full ${c.track} overflow-hidden mb-2`}>
        <motion.div
          className={`h-full rounded-full ${c.bar} ${c.glow}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Elara diagnostic quote */}
      <p className="font-mono text-[9px] text-muted-foreground/60 italic leading-relaxed">{quote}</p>

      {/* Upgrade button */}
      {canUpgrade && onUpgrade && (
        <button
          onClick={onUpgrade}
          disabled={isPending}
          className={`mt-2 px-3 py-1 rounded-md ${c.bg} border ${c.border} ${c.text} font-mono text-[9px] tracking-[0.15em] hover:opacity-80 transition-all disabled:opacity-30 flex items-center gap-1.5`}
        >
          <ArrowUp size={9} /> NEURAL ENHANCEMENT — {upgradeCost}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TACTICAL STAT PANEL — 2x2 grid stat display
   ═══════════════════════════════════════════════════ */

function TacticalPanel({ icon: Icon, label, subtitle, value, color = "cyan" }: {
  icon: React.ComponentType<any>; label: string; subtitle: string; value: string | number; color?: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "void-text-energy void-border-success void-bg-success",
    red: "void-text-error void-border-error void-bg-error",
    amber: "void-text-accent void-border void-bg-sunk",
    green: "void-text-energy void-border-success void-bg-success",
    purple: "void-text-system void-border-system void-bg-system",
  };
  const cls = colorMap[color] || colorMap.cyan;
  const [textColor] = cls.split(" ");

  return (
    <div className={`relative border rounded-lg p-3 ${cls} overflow-hidden`}>
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-30" />
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className={textColor} />
        <span className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/60">{label}</span>
      </div>
      <p className={`font-display text-lg sm:text-xl font-bold ${textColor}`}>{value}</p>
      <p className="font-mono text-[7px] text-muted-foreground/40 mt-0.5">{subtitle}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION HEADER — Consistent section divider
   ═══════════════════════════════════════════════════ */

function SectionHeader({ icon: Icon, label, subtitle, color = "text-primary" }: {
  icon: React.ComponentType<any>; label: string; subtitle?: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={12} className={color} />
      <span className="font-display text-[10px] font-bold tracking-[0.3em] text-foreground/80">{label}</span>
      {subtitle && <span className="font-mono text-[8px] text-muted-foreground/40">— {subtitle}</span>}
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN CHARACTER SHEET — THE NEURAL IMPRINT READER
   ═══════════════════════════════════════════════════ */

export default function CharacterSheetPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const character = trpc.citizen.getCharacter.useQuery(undefined, { enabled: isAuthenticated });
  const dreamBalance = trpc.citizen.getDreamBalance.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();
  const [showTraitDetails, setShowTraitDetails] = useState(false);
  const [showRespec, setShowRespec] = useState(false);
  const { state: gameState, performPrestige, startInternalizingThought, completeInternalizingThought } = useGame();
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

  // ═══ PAPER DOLL EQUIPMENT STATE ═══
  const [showEquipPanel, setShowEquipPanel] = useState(false);
  const [localGearOverride, setLocalGearOverride] = useState<Record<string, string | null> | null>(null);
  const dbGear = (character.data?.gear || {}) as Record<string, string>;
  const gear = localGearOverride ?? dbGear;
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
  const playerInventory = useMemo(() => {
    const owned = new Set<string>();
    for (const id of Object.values(gear)) { if (id) owned.add(id); }
    const charClass = character.data?.characterClass;
    if (charClass) {
      EQUIPMENT_DB.filter(e => e.source === "starting" && (!e.requiredClass || e.requiredClass === charClass))
        .forEach(e => owned.add(e.id));
    }
    EQUIPMENT_DB.filter(e => e.source === "drop" || e.source === "shop")
      .forEach(e => owned.add(e.id));
    return Array.from(owned);
  }, [gear, character.data?.characterClass]);
  const equipStats = useMemo(() => calculateEquipmentStats(paperDollEquipped), [paperDollEquipped]);

  const updateGearMutation = trpc.citizen.updateGear.useMutation({
    onSuccess: () => { utils.citizen.getCharacter.invalidate(); },
  });

  // Sync DB gear to global equipmentState on load
  useEffect(() => {
    if (!character.data?.gear) return;
    const dbG = character.data.gear as Record<string, string>;
    const slots = ["helm", "armor", "weapon", "secondary", "accessory", "consumable"] as const;
    for (const slot of slots) {
      const itemId = dbG[slot];
      if (itemId) {
        const itemDef = getEquipmentById(itemId);
        if (itemDef) {
          const equipped: EquippedItem = {
            id: itemDef.id, name: itemDef.name, slot,
            rarity: itemDef.rarity,
            stats: { atk: itemDef.stats.atk, def: itemDef.stats.def, hp: itemDef.stats.hp, speed: itemDef.stats.speed },
          };
          globalEquipItem(slot, equipped);
        }
      } else {
        globalEquipItem(slot, null);
      }
    }
  }, [character.data?.gear]);

  const handleEquipChange = useCallback((slot: EquipSlot, itemId: string | null) => {
    const newGear = { ...gear, [slot]: itemId };
    if (!itemId) delete (newGear as any)[slot];
    setLocalGearOverride(newGear);
    if (itemId) {
      const itemDef = getEquipmentById(itemId);
      if (itemDef) {
        globalEquipItem(slot, {
          id: itemDef.id, name: itemDef.name, slot,
          rarity: itemDef.rarity,
          stats: { atk: itemDef.stats.atk, def: itemDef.stats.def, hp: itemDef.stats.hp, speed: itemDef.stats.speed },
        });
      }
    } else {
      globalEquipItem(slot, null);
    }
    updateGearMutation.mutate({ gear: newGear });
  }, [gear, updateGearMutation]);

  // ═══ LOADING / AUTH / NO CHARACTER STATES ═══
  if (authLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <LivingBackground src="https://dgrsart.s3.us-east-2.amazonaws.com/page-backgrounds/CHR-001_operative-dossier.jpg" accent="var(--energy-primary)" opacity={0.13} particleCount={4} scanlines={false} />
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 void-border-success mx-auto mb-4 flex items-center justify-center animate-cyber-pulse">
            <Cpu size={24} className="void-text-energy" />
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em]">ESTABLISHING NEURAL LINK...</p>
          <p className="font-mono text-[8px] text-muted-foreground/30 mt-1 tracking-wider">Temporal Vault handshake in progress</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-float rounded-lg p-8 max-w-md text-center">
          <Lock size={48} className="void-text-error mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold tracking-wider mb-2">NEURAL LINK DENIED</h2>
          <p className="font-mono text-xs text-muted-foreground mb-6">Authentication required to access Neural Imprint Reader.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 void-btn void-btn-primary font-mono text-sm">
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
          <div className="w-20 h-20 rounded-full border border-dashed void-border-success mx-auto mb-4 animate-[spin_8s_linear_infinite] flex items-center justify-center">
            <Activity size={28} className="void-text-energy animate-pulse" />
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em]">SCANNING NEURAL IMPRINT...</p>
          <p className="font-mono text-[8px] text-muted-foreground/30 mt-1 tracking-wider">Decrypting biosignature from cryo records</p>
        </div>
      </div>
    );
  }

  if (!character.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-float rounded-lg p-8 max-w-md text-center">
          <User size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold tracking-wider mb-2">NO NEURAL IMPRINT DETECTED</h2>
          <p className="font-mono text-xs text-muted-foreground mb-6">No biosignature found in cryo records. Initialize awakening sequence.</p>
          <Link href="/create-citizen" className="inline-flex items-center gap-2 void-btn void-btn-primary font-mono text-sm">
            <Zap size={14} /> BEGIN AWAKENING
          </Link>
        </div>
      </div>
    );
  }

  // ═══ DERIVED DATA ═══
  const char = character.data;
  const dream = dreamBalance.data;
  const isOrder = char.alignment === "order";
  const alignGlow = isOrder
    ? "shadow-[0_0_60px_color-mix(in oklch, var(--energy-primary) 15%, transparent),0_0_120px_color-mix(in oklch, var(--energy-primary) 5%, transparent)]"
    : "shadow-[0_0_60px_color-mix(in oklch, var(--energy-system) 15%, transparent),0_0_120px_color-mix(in oklch, var(--energy-system) 5%, transparent)]";
  const alignBorderColor = isOrder ? "void-border-success" : "void-border-system";
  const alignTextColor = isOrder ? "void-text-energy" : "void-text-system";
  const alignBg = isOrder ? "void-bg-success" : "void-bg-system";
  const alignGlowText = isOrder ? "glow-cyan" : "glow-purple";

  const ElIcon = ELEMENT_ICONS[char.element] || Sparkles;
  const ClIcon = CLASS_ICONS[char.characterClass] || Swords;
  const elColors = ELEMENT_COLORS[char.element] || ELEMENT_COLORS.earth;
  const speciesLore = SPECIES_LORE[char.species] || SPECIES_LORE.demagi;
  const classLore = CLASS_LORE[char.characterClass] || CLASS_LORE.soldier;

  const classLevelCostXp = char.classLevel * 100;
  const classLevelCostDream = char.classLevel * 5;
  const gearEntries = Object.entries(gear).filter(([, v]) => v != null) as [string, string][];
  const xpPercent = Math.min((char.xp % 200) / 200 * 100, 100);

  // Chronicle card bio
  const alignProtocol = isOrder ? "Order Protocol" : "Chaos Protocol";
  const moralDesc = (gameState.moralityScore || 0) > 30 ? "Compassion signatures elevated" :
    (gameState.moralityScore || 0) < -30 ? "Ruthlessness markers detected" : "Moral equilibrium nominal";
  const clearanceTier = Math.min(Math.floor(char.level / 5) + 1, 10);
  const chronicleText = `Operative ${char.name} awoke from Cryo Bay ${Math.floor(Math.random() * 99) + 1} with the neural signature of a ${speciesLore.title} ${classLore.title}, aligned with ${alignProtocol}. ${char.element.charAt(0).toUpperCase() + char.element.slice(1)} resonance detected at ${Math.min(char.attrVitality * 20, 100)}%. ${moralDesc}. The Game Master's records classify them as Clearance Tier ${clearanceTier}.`;

  return (
    <div className="min-h-screen relative">
      {/* ═══ BACKGROUND DECORATIONS ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`nebula-blob w-[500px] h-[500px] ${isOrder ? "void-bg-success" : "void-bg-system"} top-[-100px] right-[-100px]`} style={{ animationDelay: "-5s" }} />
        <div className={`nebula-blob w-[400px] h-[400px] ${isOrder ? "void-bg-sunk" : "void-bg-system"} bottom-[-100px] left-[-100px]`} style={{ animationDelay: "-12s" }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-20" />
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
            style={{ background: "radial-gradient(ellipse at center, rgba(0,5,30,0.95) 0%, color-mix(in oklch, var(--bg-void) 98%, transparent) 100%)" }}
          >
            <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-30" />
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="max-w-xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8"
              >
                <HolographicElara size="lg" isSpeaking={isTyping} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/50" />
                  <span className="font-mono text-[10px] void-text-energy tracking-[0.4em]">ELARA // AI COMPANION</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/50" />
                </div>
              </motion.div>
              <motion.div
                key={narrativeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-[80px] flex items-center justify-center"
              >
                <p className="font-mono text-sm sm:text-base text-foreground leading-relaxed">
                  {narrativeText}
                  {isTyping && <span className="inline-block w-2 h-4 void-bg-success ml-0.5 animate-pulse" />}
                </p>
              </motion.div>
              <div className="flex items-center justify-center gap-2 mt-8">
                {ELARA_INTRO_LINES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === narrativeStep ? "void-bg-success w-4" : i < narrativeStep ? "void-bg-success" : "bg-foreground/15"
                    }`}
                  />
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-mono text-[10px] text-muted-foreground/35 mt-6 tracking-wider"
              >
                {isTyping ? "CLICK TO SKIP" : narrativeStep < ELARA_INTRO_LINES.length - 1 ? "CLICK TO CONTINUE" : "CLICK TO VIEW NEURAL IMPRINT"}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HEADER BAR — NEURAL IMPRINT // LIVE SCAN ═══ */}
      <div className="relative z-10 border-b border-border/40 bg-muted/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
            className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
          >
            <ChevronLeft size={12} /> NEURAL IMPRINT
          </button>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full void-bg-success animate-pulse" />
              <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.3em]">NEURAL IMPRINT // LIVE SCAN</span>
            </div>
            <span className="font-mono text-[7px] text-muted-foreground/30 tracking-[0.2em]">Temporal Vault Status: LOCKED // Time Remaining: [UNKNOWN]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full void-bg-error animate-pulse" />
              <span className="font-mono text-[7px] void-text-error tracking-wider">GAME MASTER PROTOCOL: ACTIVE</span>
            </div>
          </div>
        </div>
        {/* Elara monitoring status */}
        <div className="max-w-5xl mx-auto px-4 pb-2 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full void-bg-success border void-border-success flex items-center justify-center" data-narrative="breathe">
            <Eye size={8} className="void-text-energy" />
          </div>
          <span className="font-mono text-[8px] void-text-energy tracking-[0.2em]">ELARA STATUS: MONITORING</span>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/10 to-transparent" />
          <span className="font-mono text-[8px] text-muted-foreground/30">LVL {char.level}</span>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* ═══════════════════════════════════════════════════
            SECTION 1: IDENTITY SCAN — Portrait + Chronicle Card
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-xl border ${alignBorderColor} ${alignGlow} overflow-hidden mb-6`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[var(--bg-void)]/80 to-black/60" />
          <div className="absolute inset-0 rounded-xl" style={{
            background: `linear-gradient(90deg, transparent 0%, ${isOrder ? "color-mix(in oklch, var(--energy-primary) 10%, transparent)" : "color-mix(in oklch, var(--energy-system) 10%, transparent)"} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "border-trace 6s linear infinite",
          }} />
          <div className="absolute inset-0 crt-scanlines pointer-events-none" />

          <div className="relative p-4 sm:p-6">
            {/* Classification header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOrder ? "void-bg-success" : "void-bg-system"} animate-pulse`} />
                <span className="font-mono text-[8px] tracking-[0.4em] text-muted-foreground/50">
                  IDENTITY SCAN // {isOrder ? "ORDER PROTOCOL" : "CHAOS PROTOCOL"}
                </span>
              </div>
              <span className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/30">
                CLEARANCE: TIER {clearanceTier}
              </span>
            </div>

            {/* Main identity layout */}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              {/* LEFT: Paper Doll Portrait */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className={`relative rounded-lg border-2 ${alignBorderColor} overflow-hidden flex-shrink-0`}
                  style={{ boxShadow: isOrder ? '0 0 30px color-mix(in oklch, var(--energy-primary) 10%, transparent)' : '0 0 30px color-mix(in oklch, var(--energy-system) 10%, transparent)' }}>
                  <div className={`absolute inset-0 ${alignBg}`} />
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute w-full h-0.5 ${isOrder ? "void-bg-success" : "void-bg-system"} animate-scan-line`} />
                  </div>
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
                  <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  <div className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  <div className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  {char.species === "neyon" && char.neyonTokenId && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded void-bg-sunk border void-border z-20">
                      <span className="font-mono text-[7px] void-text-accent font-bold">#{char.neyonTokenId} ✦ 1/1</span>
                    </div>
                  )}
                </div>

                {/* Equipment Stats Summary */}
                {(equipStats.atk > 0 || equipStats.def > 0 || equipStats.hp > 0 || equipStats.speed > 0) && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {equipStats.atk > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded void-bg-error void-text-error border void-border-error">+{equipStats.atk} ATK</span>}
                    {equipStats.def > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded void-bg-sunk void-text-energy border void-border">+{equipStats.def} DEF</span>}
                    {equipStats.hp > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded void-bg-success void-text-energy border void-border-success">+{equipStats.hp} HP</span>}
                    {equipStats.speed > 0 && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded void-bg-sunk void-text-accent border void-border">+{equipStats.speed} SPD</span>}
                  </div>
                )}
              </div>

              {/* RIGHT: Identity + Chronicle */}
              <div className="flex-1 min-w-0">
                {/* Name */}
                <h1 className={`font-display text-2xl sm:text-4xl font-black tracking-wider ${alignTextColor} ${alignGlowText} mb-1 truncate`}>
                  {char.name}
                </h1>

                {/* Designation line */}
                <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider mb-1">
                  DESIGNATION: {speciesLore.title} {classLore.title} // ALIGNMENT: {isOrder ? "Order Protocol" : "Chaos Protocol"}
                </p>

                {/* Species / Class / Element tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full void-bg-sunk void-text-energy border void-border">
                    {speciesLore.title}
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full void-bg-sunk void-text-accent border void-border flex items-center gap-1">
                    <ClIcon size={8} /> {classLore.title} Lv.{char.classLevel}
                  </span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${elColors.bg} ${elColors.text} ${elColors.border} border flex items-center gap-1`}>
                    <ElIcon size={8} /> {char.element.toUpperCase()}
                  </span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${alignBg} ${alignTextColor} ${alignBorderColor} border flex items-center gap-1`}>
                    {isOrder ? <Shield size={8} /> : <Zap size={8} />} {char.alignment.toUpperCase()}
                  </span>
                </div>

                {/* THE CHRONICLE CARD */}
                <div className={`rounded-lg border ${alignBorderColor} ${alignBg} p-3 mb-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDot size={10} className={alignTextColor} />
                    <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/50">CHRONICLE CARD // ANTIQUARIAN RECORD</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed italic">
                    {chronicleText}
                  </p>
                </div>

                {/* XP Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[8px] text-muted-foreground/50 tracking-[0.2em]">NEURAL EXPERIENCE</span>
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
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            SECTION 2: VITAL SIGNS — Bioscan Readouts
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6"
        >
          <SectionHeader icon={Activity} label="VITAL SIGNS" subtitle="Real-time bioscan diagnostics" color="void-text-energy" />
          <div className="grid gap-3">
            <BioscanReadout
              value={char.attrAttack}
              label="ATTACK"
              immersiveName="KINETIC OUTPUT"
              color="red"
              icon={Crosshair}
              quote={KINETIC_QUOTES[Math.min(char.attrAttack, 5)] || KINETIC_QUOTES[1]}
              canUpgrade={char.attrAttack < 5 && !!dream}
              onUpgrade={() => levelUpAttr.mutate({ attribute: "attack" })}
              upgradeCost={`${char.attrAttack * 10}D ${char.attrAttack * 3}SB`}
              isPending={levelUpAttr.isPending}
            />
            <BioscanReadout
              value={char.attrDefense}
              label="DEFENSE"
              immersiveName="STRUCTURAL INTEGRITY"
              color="cyan"
              icon={Shield}
              quote={INTEGRITY_QUOTES[Math.min(char.attrDefense, 5)] || INTEGRITY_QUOTES[1]}
              canUpgrade={char.attrDefense < 5 && !!dream}
              onUpgrade={() => levelUpAttr.mutate({ attribute: "defense" })}
              upgradeCost={`${char.attrDefense * 10}D ${char.attrDefense * 3}SB`}
              isPending={levelUpAttr.isPending}
            />
            <BioscanReadout
              value={char.attrVitality}
              label="VITALITY"
              immersiveName="CORE RESONANCE"
              color="amber"
              icon={Heart}
              quote={RESONANCE_QUOTES[Math.min(char.attrVitality, 5)] || RESONANCE_QUOTES[1]}
              canUpgrade={char.attrVitality < 5 && !!dream}
              onUpgrade={() => levelUpAttr.mutate({ attribute: "vitality" })}
              upgradeCost={`${char.attrVitality * 10}D ${char.attrVitality * 3}SB`}
              isPending={levelUpAttr.isPending}
            />
          </div>
          {levelUpAttr.error && (
            <p className="font-mono text-[10px] text-destructive mt-2">{levelUpAttr.error.message}</p>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            SECTION 3: TACTICAL ANALYSIS + SECTION 4: AUGMENTATIONS
           ═══════════════════════════════════════════════════ */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 mb-6">
          {/* TACTICAL ANALYSIS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={Crosshair} label="TACTICAL ANALYSIS" color="void-text-error" />
            <div className="grid grid-cols-2 gap-2.5">
              <TacticalPanel icon={Heart} label="SYSTEM INTEGRITY" subtitle="Total bio-structural capacity" value={char.maxHp} color="red" />
              <TacticalPanel icon={Shield} label="KINETIC ABSORPTION" subtitle="Damage mitigation threshold" value={char.armor} color="cyan" />
              <TacticalPanel icon={ElIcon} label="ELEMENTAL ATTUNEMENT" subtitle={`${char.element} resonance active`} value={char.elementInfo?.ability || "—"} color="green" />
              <TacticalPanel icon={ClIcon} label="OPERATIONAL CLEARANCE" subtitle={`${classLore.title} classification`} value={`Lv.${char.classLevel}`} color="amber" />
            </div>

            <button
              onClick={() => levelUpClass.mutate()}
              disabled={levelUpClass.isPending}
              className="w-full mt-3 py-2 rounded-md void-bg-sunk border void-border void-text-accent font-mono text-[10px] tracking-[0.1em] void-bg-sunk transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ArrowUp size={10} /> ENHANCE CLEARANCE ({classLevelCostXp} XP + {classLevelCostDream} Dream)
            </button>
            {levelUpClass.error && (
              <p className="font-mono text-[9px] text-destructive mt-2">{levelUpClass.error.message}</p>
            )}
          </motion.div>

          {/* NEURAL AUGMENTATIONS (Equipment) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={Layers} label="NEURAL AUGMENTATIONS" color="void-text-accent" />
            {gearEntries.length > 0 ? (
              <div>
                {gearEntries.map(([slot, itemName]) => {
                  const equipItem = getEquipmentById(itemName);
                  const rarityInfo = equipItem ? (RARITY_NAMES[equipItem.rarity] || RARITY_NAMES.common) : RARITY_NAMES.common;
                  const slotLabel = SLOT_NAMES[slot] || slot.toUpperCase();
                  return (
                    <div key={slot} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                      <div className="w-7 h-7 rounded bg-muted/40 border border-border/60 flex items-center justify-center flex-shrink-0"
                        style={equipItem ? { boxShadow: `0 0 6px ${equipItem.glowColor}` } : undefined}>
                        <Hexagon size={12} className={equipItem ? rarityInfo.color : "text-muted-foreground/40"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[8px] text-muted-foreground/50 tracking-[0.15em]">{slotLabel}</p>
                        <p className={`font-mono text-xs truncate ${rarityInfo.color}`}>{equipItem?.name || itemName}</p>
                        {equipItem && <p className="font-mono text-[7px] text-muted-foreground/30">{rarityInfo.label}</p>}
                      </div>
                      {equipItem && (
                        <div className="flex gap-1">
                          {equipItem.stats.atk ? <span className="font-mono text-[8px] void-text-error">+{equipItem.stats.atk}</span> : null}
                          {equipItem.stats.def ? <span className="font-mono text-[8px] void-text-energy">+{equipItem.stats.def}</span> : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Hexagon size={28} className="text-muted-foreground/20 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/40">No augmentations installed</p>
                <p className="font-mono text-[8px] text-muted-foreground/25 mt-1">Access the augmentation grid to equip neural systems</p>
              </div>
            )}
            <button
              onClick={() => setShowEquipPanel(true)}
              className="w-full mt-3 py-2 rounded-md void-bg-success border void-border-success void-text-energy font-mono text-[10px] tracking-[0.1em] void-bg-success transition-all flex items-center justify-center gap-1.5"
            >
              <Layers size={10} /> MANAGE AUGMENTATIONS
            </button>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 5: DREAM SUBSTRATE RESERVES
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-float rounded-lg p-4 sm:p-5 mb-6"
        >
          <SectionHeader icon={Gem} label="DREAM SUBSTRATE RESERVES" color="void-text-system" />
          {dream ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <TacticalPanel icon={Gem} label="DREAM RESONANCE" subtitle="Crystallized consciousness units" value={dream.dreamTokens} color="purple" />
              <TacticalPanel icon={Lock} label="BOUND LIGHT" subtitle="Locked dimensional energy" value={dream.soulBoundDream} color="amber" />
              <TacticalPanel icon={Cpu} label="GENETIC CIPHER" subtitle="Programmer's source fragments" value={dream.dnaCode} color="green" />
              <TacticalPanel icon={Activity} label="LIFETIME RESONANCE" subtitle="Total consciousness harvested" value={dream.totalDreamEarned} color="cyan" />
            </div>
          ) : (
            <div className="text-center py-6">
              <Gem size={28} className="text-muted-foreground/20 mx-auto mb-2" />
              <p className="font-mono text-[10px] text-muted-foreground/40">No Dream substrate detected. Earn through simulation survival.</p>
            </div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            SECTION 6: SECURITY CLEARANCE & MORALITY
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mb-4"
        >
          {/* SECURITY CLEARANCE (Prestige) */}
          <SectionHeader icon={Star} label="SECURITY CLEARANCE" color="void-text-accent" />
          {(() => {
            const prestige = (gameState as any).prestige || 0;
            const stars = getPrestigeStars(prestige);
            const canP = canPrestige(char.level, prestige);
            const nextLevel = getPrestigeLevel(prestige + 1);
            const clearance = CLEARANCE_TITLES[Math.min(prestige, 4)] || CLEARANCE_TITLES[0];
            const clearanceLabel = isOrder ? clearance.order : clearance.chaos;
            return (
              <div className="glass-float rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-display text-sm font-bold void-text-accent">
                      {clearanceLabel} {prestige > 0 ? stars : ""}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/50">
                      {prestige > 0 ? getPrestigeTitle(prestige, gam.title || "Operative") : "Reach level 25 to unlock higher clearance"}
                    </p>
                  </div>
                  {prestige > 0 && (
                    <div className="text-right">
                      <p className="font-mono text-[9px] void-text-accent">{((getPrestigeLevel(prestige)?.xpMultiplier || 1) * 100 - 100).toFixed(0)}% XP bonus</p>
                      <p className="font-mono text-[9px] void-text-energy">{((getPrestigeLevel(prestige)?.resourceMultiplier || 1) * 100 - 100).toFixed(0)}% resource bonus</p>
                    </div>
                  )}
                </div>
                {nextLevel && (
                  <div className="border void-border rounded-lg p-3 void-bg-sunk/[0.03]">
                    <p className="font-mono text-[9px] void-text-accent mb-1">NEXT: {nextLevel.titlePrefix} ({nextLevel.stars}★)</p>
                    <p className="font-mono text-[8px] text-white/30">{nextLevel.reward.description}</p>
                    <p className="font-mono text-[8px] text-white/15 italic mt-1">{nextLevel.loreText.substring(0, 120)}...</p>
                  </div>
                )}
                {canP && (
                  <button onClick={() => { if (window.confirm("Security clearance upgrade will reset your level, rooms, and quests. NPC trust, cards, equipment, and achievements are kept. Continue?")) { performPrestige(); } }}
                    className="w-full mt-3 py-2.5 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-[10px] font-bold tracking-wider void-bg-sunk transition-all">
                    UPGRADE CLEARANCE — Reset level, keep everything that matters
                  </button>
                )}
              </div>
            );
          })()}
        </motion.div>

        {/* MORALITY ALIGNMENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mb-4 space-y-3"
        >
          <SectionHeader icon={Shield} label="MORALITY ALIGNMENT" color="void-text-system" />
          <MoralityMeter showDetails={true} />
          <MoralityUnlockablesPanel />
          <MoralityMilestoneRewards />
          <ThemeSelector
            activeShipTheme={(gameState as any).activeShipTheme || "ship_twilight_equilibrium"}
            activeCharacterTheme={(gameState as any).activeCharacterTheme || "char_void_walker"}
            onEquipShipTheme={(id) => {
              (gameState as any).activeShipTheme = id;
            }}
            onEquipCharacterTheme={(id) => {
              (gameState as any).activeCharacterTheme = id;
            }}
          />
        </motion.div>

        {/* DREAM PARTITION (Character Mind) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <SectionHeader icon={Cpu} label="DREAM PARTITION" subtitle="Your corner of the Matrix of Dreams" color="void-text-system" />
          <CharacterMindPanel
            skills={gameState.innerVoiceSkills as any}
            thoughtState={{
              internalizing: gameState.thoughtInternalizing,
              internalized: gameState.thoughtInternalized,
              discovered: gameState.thoughtDiscovered,
              maxSlots: 3,
            }}
            archetypeState={{
              emerged: gameState.archetypeEmerged as any,
              primary: gameState.archetypePrimary as any,
              emergenceDates: gameState.archetypeEmergenceDates,
            }}
            onStartInternalizing={startInternalizingThought}
            onCompleteInternalizing={completeInternalizingThought}
          />
        </motion.div>

        {/* NEURAL RESPEC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowRespec(true)}
            className="w-full py-3 rounded-lg glass-float border void-border-system void-border-system void-bg-system transition-all flex items-center justify-center gap-2.5 group"
          >
            <RotateCcw size={14} className="void-text-system group-hover:animate-spin" style={{ animationDuration: '2s' }} />
            <span className="font-display text-[10px] font-bold tracking-[0.25em] void-text-system">NEURAL RESPEC</span>
            <span className="font-mono text-[8px] text-muted-foreground/30">— Reassign attributes, alignment, or element</span>
          </button>
        </motion.div>

        <TraitSummaryPanel isAuthenticated={isAuthenticated} />

        {/* ═══════════════════════════════════════════════════
            SECTION 7: OPERATIONAL RECORD
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="mb-4"
        >
          <SectionHeader icon={Target} label="OPERATIONAL RECORD" color="void-text-energy" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: "SECTORS ACCESSED", value: gameState.totalRoomsUnlocked, icon: Unlock, color: "void-text-energy", border: "void-border-success" },
              { label: "ARTIFACTS RECOVERED", value: gameState.totalItemsFound, icon: Star, color: "void-text-accent", border: "void-border" },
              { label: "SIMULATIONS SURVIVED", value: gam.gameSave.totalFights, icon: Swords, color: "void-text-error", border: "void-border-error" },
              { label: "CONSECUTIVE VICTORIES", value: gam.gameSave.bestWinStreak, icon: Trophy, color: "void-text-system", border: "void-border-system" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`rounded-lg border ${stat.border} bg-muted/40 p-3 flex items-center gap-2.5`}>
                  <Icon size={14} className={stat.color} />
                  <div>
                    <p className="font-display text-base font-bold tracking-wide">{stat.value}</p>
                    <p className="font-mono text-[7px] text-muted-foreground/50 tracking-[0.1em]">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievements as OPERATION: [NAME] */}
          <SectionHeader icon={Trophy} label="OPERATIONS COMPLETED" color="void-text-accent" />
          <div className="space-y-1.5 mb-4">
            {gameState.achievementsEarned.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground/40 text-center py-4">No operations completed. Explore the Ark to unlock classified objectives.</p>
            ) : (
              gameState.achievementsEarned.slice(0, 8).map((ach, i) => (
                <div key={ach} className="flex items-center gap-2 px-3 py-2 rounded-md void-bg-sunk border void-border">
                  <Trophy size={12} className="void-text-accent" />
                  <span className="font-mono text-[10px] void-text-accent flex-1">OP: {ach.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              ))
            )}
            {gameState.achievementsEarned.length > 8 && (
              <p className="font-mono text-[9px] text-muted-foreground/30 text-center">+{gameState.achievementsEarned.length - 8} more operations</p>
            )}
          </div>

          {/* ARK RECONNAISSANCE */}
          <SectionHeader icon={Compass} label="ARK RECONNAISSANCE" color="void-text-energy" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Sectors Accessed", value: gameState.totalRoomsUnlocked, max: 10 },
              { label: "Artifacts Found", value: gameState.totalItemsFound, max: 30 },
              { label: "Cards Collected", value: gameState.collectedCards.length, max: 50 },
            ].map((prog) => (
              <div key={prog.label} className="rounded-lg bg-muted/40 border void-border-success p-3">
                <p className="font-mono text-[8px] text-muted-foreground/50 tracking-wider mb-1">{prog.label.toUpperCase()}</p>
                <div className="flex items-end gap-1">
                  <span className="font-display text-lg font-bold void-text-energy">{prog.value}</span>
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

          {/* Operative Rank */}
          <SectionHeader icon={Crown} label="OPERATIVE RANK" color="void-text-system" />
          <div className="flex items-center gap-4 px-4 py-3 rounded-lg void-bg-system border void-border-system mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border void-border-system flex items-center justify-center">
              <span className="font-display text-lg font-black void-text-system">{gam.level}</span>
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-bold tracking-wider void-text-system">{gam.title}</p>
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
            SECTION 8: GAME MASTER WARNING
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="mb-6 mt-8"
        >
          <div className="rounded-lg border void-border-error void-bg-error/[0.02] p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={14} className="void-text-error mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-mono text-[9px] void-text-error tracking-[0.2em] mb-1.5">
                  GAME MASTER PROTOCOL: ACTIVE // STATUS: SELF-EXECUTING
                </p>
                <p className="font-mono text-[8px] text-muted-foreground/25 leading-relaxed">
                  The Game Master is dead. The Game continues. Your Neural Imprint is being recorded. Everything you do in this simulation is observed by systems that no longer answer to their creator. Proceed accordingly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ PROCEED TO ARK (post-Awakening) ═══ */}
        {fromAwakening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Link
              href="/ark"
              className="w-full py-4 rounded-lg border void-border-success void-bg-success void-bg-success void-border-success transition-all flex items-center justify-center gap-3 group"
              style={{ boxShadow: "0 0 30px color-mix(in oklch, var(--energy-primary) 10%, transparent)" }}
            >
              <Sparkles size={16} className="void-text-energy group-hover:animate-pulse" />
              <span className="font-display text-sm font-bold tracking-[0.2em] void-text-energy">PROCEED TO THE ARK</span>
              <span className="font-mono text-[9px] void-text-energy">— Begin exploring the ship</span>
            </Link>
            <p className="text-center font-mono text-[9px] text-muted-foreground/30 mt-2 tracking-wider">
              Elara will guide you through the Cryo Bay and beyond
            </p>
          </motion.div>
        )}

        {/* ═══ EQUIPMENT PANEL MODAL ═══ */}
        <AnimatePresence>
          {showEquipPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowEquipPanel(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-black/95 border void-border-success rounded-2xl p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg tracking-[0.2em] void-text-energy">AUGMENTATION GRID</h2>
                  <button onClick={() => setShowEquipPanel(false)} className="text-white/30 hover:text-white/60">
                    <X size={18} />
                  </button>
                </div>
                <EquipmentPanel
                  equipped={paperDollEquipped}
                  inventory={playerInventory}
                  species={(char.species as Species) || "demagi"}
                  charClass={(char.characterClass as CharClass) || "soldier"}
                  alignment={char.alignment as "order" | "chaos"}
                  element={char.element}
                  name={char.name}
                  moralityScore={gameState.moralityScore || 0}
                  onEquip={handleEquipChange}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Respec Dialog */}
        <RespecDialog isOpen={showRespec} onClose={() => setShowRespec(false)} isAuthenticated={isAuthenticated} />

        {/* ═══ FOOTER CLASSIFICATION ═══ */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/10" />
            <span className="font-mono text-[7px] text-muted-foreground/25 tracking-[0.5em]">END OF NEURAL IMPRINT // CLASSIFIED</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
