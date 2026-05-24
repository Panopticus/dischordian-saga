import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getGoogleLoginUrl } from "@/const";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "wouter";
import HolographicElara from "@/components/HolographicElara";
import { useElaraVO } from "@/hooks/useElaraVO";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft, Shield, Swords, Heart, Zap, User,
  Sparkles, ArrowUp, Droplets, Flame, Wind, Mountain,
  Clock, Globe, Target, Wrench, Eye, Skull, Telescope,
  Star, Trophy, Gem, Lock, Unlock, Activity, Crosshair,
  Hexagon, CircleDot, Layers, Cpu, Wifi, ChevronDown, ChevronUp,
  RotateCcw, AlertTriangle, Compass, Crown, X, Pencil
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
import PaperDollBG3, { isDressupV2Enabled } from "@/components/PaperDollBG3";
import { parseSuitPieceArtId } from "@/game/paperDoll/suitArt";
import type { Loadout } from "@/game/paperDoll/compositePaperDoll";
import {
  resolveStarterLoadout,
  classSetId,
  speciesSetId,
  type FoundationKey,
  type StarterSpecies,
} from "@shared/starterLoadout";
import { pieceId } from "@shared/suitSets";
import type { ClassKey, ElementKey } from "@shared/earnedLoadouts";
import { ELEMENT_PALETTES } from "@shared/suitArtPrompts";
import EquipmentPanel from "@/components/EquipmentPanel";
import { type EquipSlot, type Species, type CharClass, SLOT_CONFIG, RARITY_COLORS, getEquipmentById, calculateEquipmentStats, EQUIPMENT_DB } from "@/data/equipmentData";
import { equipItem as globalEquipItem, type EquippedItem } from "@/game/equipmentState";
import { canPrestige, getPrestigeLevel, getPrestigeStars, getPrestigeTitle, PRESTIGE_LEVELS, type PrestigeLevel } from "@shared/prestigeSystem";
import { MASTERY_BRANCHES } from "@shared/masteryTree";

import LivingBackground from "@/components/LivingBackground";
import { FactionStandingPanel } from "@/components/faction/FactionStandingPanel";
import { characterSheetFrameUrls } from "@shared/aaaArtArchive/characterSheets";
import { assetUrl } from "@/lib/assetUrl";

/** Full-bleed species portrait shipped under art/ui. Used as a heritage
 *  fallback so the player always sees their race even when the §G.9
 *  paper-doll body PNG hasn't shipped for that combination. */
const SPECIES_HERITAGE_PORTRAIT: Record<string, string | undefined> = {
  demagi: assetUrl("art/ui/ui_cohort_species_demagi.png"),
  quarchon: assetUrl("art/ui/ui_cohort_species_quarchon.png"),
  neyon: assetUrl("art/cards/race/neyon_kael_first.webp"),
  "ne-yon": assetUrl("art/cards/race/neyon_kael_first.webp"),
  human: assetUrl("art/ui/ui_cohort_species_human.png"),
};

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
  engineer: { title: "Engineer", tagline: "You read the seams of the world. Every system answers, if you ask correctly." },
  oracle: { title: "Oracle", tagline: "Possibility arranges itself in front of you a heartbeat early." },
  assassin: { title: "Assassin", tagline: "Quiet has always come naturally. You leave no signature." },
  soldier: { title: "Soldier", tagline: "Your body remembers stance, breath, distance — even what your mind doesn't." },
  spy: { title: "Spy", tagline: "You have lived in the spaces between truths. Trust is a tool." },
};

/* ═══════════════════════════════════════════════════
   BIOSCAN DIAGNOSTIC QUOTES
   ═══════════════════════════════════════════════════ */

const KINETIC_QUOTES = [
  "",
  "Your body is still relearning itself. The instincts are present, just out of focus — give them a few hours.",
  "You move like someone who's been here before. Whatever your mind has lost, your spine remembers.",
  "There's a fighter in your tendons. You don't have to think about closing distance — you just close it.",
  "I have seen one-in-ten-thousand reactions like yours. They tend to belong to people who survived their own wars.",
  "You move the way the old recordings move. Whatever you were before this pod, you were dangerous.",
];
const INTEGRITY_QUOTES = [
  "",
  "You feel thinner than you should. The cryo took something — you'll get it back, but not all at once.",
  "You hold your weight well. Whatever happens next won't crack you on the first hit.",
  "Your bones know how to hold a line. You can stand somewhere, and you can stay there.",
  "You're built to take what's coming, even before you know what's coming. That's a rare frame to live in.",
  "I don't know what made you, but it made you to last. You'll outlive most things on this ship.",
];
const RESONANCE_QUOTES = [
  "",
  "You hum on a thin signal. The Dream is there, just at the edge of your hearing.",
  "You and the Dream are talking. It's a conversation, not a shout — that's what most people get.",
  "You don't reach for the Dream. It comes to you. That's not common.",
  "The Dream doesn't visit you, you live alongside it. I have only ever read this in stories.",
  "You're tuned to a frequency that should not be available to anyone alive. I am writing this down carefully.",
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

/* The DB `gear` column stores entries in two shapes — the creation flow
 * writes `{ id, baseLocked: true }` for base-mask/base-suit, while
 * updateGear writes flat `"<id>"` strings. Reading either shape returns
 * the underlying id, or null when the slot is genuinely empty. Without
 * this coercion, the object shape leaks into JSX children and triggers
 * Minified React error #31. */
function readGearId(val: unknown): string | null {
  if (typeof val === "string" && val.length > 0) return val;
  if (val && typeof val === "object" && "id" in (val as object)) {
    const id = (val as { id?: unknown }).id;
    return typeof id === "string" && id.length > 0 ? id : null;
  }
  return null;
}

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
  // performPrestige was previously invoked here behind a window.confirm();
  // the §15 ceremony now lives at /prestige-cycle, which imports it via
  // useGame() directly. Leaving the action un-destructured here.
  const { state: gameState, startInternalizingThought, completeInternalizingThought, setNarrativeFlag } = useGame();
  const gam = useGamification();

  // ═══ NARRATIVE INTRO (from Awakening) ═══
  const searchString = useSearch();
  const fromAwakening = searchString.includes("from=awakening");
  const [showNarrativeIntro, setShowNarrativeIntro] = useState(false);
  const [narrativeStep, setNarrativeStep] = useState(0);
  const [narrativeText, setNarrativeText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // Plays the per-step VO line if `character_sheet_intro_N` exists in
  // the manifest. Falls through silently if the line hasn't been
  // generated yet — typewriter remains the source of truth in that
  // case. The exposed `audio` element drives the SpriteCharacter
  // viseme overlay so Elara's mouth syncs to her actual voice instead
  // of a fake cycle.
  const { speak: speakElaraIntro, audio: elaraIntroAudio, speaking: elaraIntroSpeaking } = useElaraVO();

  const ELARA_INTRO_LINES = useMemo(() => [
    "Neural scan complete. Your biometric profile has been compiled, Operative.",
    "This is your dossier — everything we know about what you are. Your species markers, your class aptitudes, your elemental affinity. I'll surface the rest as you need it.",
    "I've cross-referenced your readings against the Ark's historical database. You are not a small signal. The Prophecy may have been right about you.",
    "Sit with this. Let it be true for a moment. The deck plates outside this room remember things you don't, and you'll need to remember some of them back.",
    "When you're ready — the Cryo Bay door is open. Walk through. I'll stay with you.",
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

  // Section 8 — In-world Dream tutorial. Once the player has earned
  // any Dream AND the murder mystery is in motion (cryo clue logged),
  // unlock the bioscan upgrade buttons by flipping
  // `tutorial_dream_explained`. This is the minimum-viable wire-up
  // for the gating introduced in §6/7; the full conversation flow
  // (Elara line + dialog choices) lands in Section 9.
  useEffect(() => {
    if (!character.data) return;
    if (gameState.narrativeFlags?.tutorial_dream_explained) return;
    const hasDream = (dreamBalance.data?.dreamTokens ?? 0) > 0
      || (dreamBalance.data?.soulBoundDream ?? 0) > 0;
    const mysteryStarted = !!gameState.narrativeFlags?.cryo_mystery_first_clue_found;
    if (hasDream && mysteryStarted) {
      setNarrativeFlag("tutorial_dream_explained");
    }
  }, [
    character.data,
    dreamBalance.data?.dreamTokens,
    dreamBalance.data?.soulBoundDream,
    gameState.narrativeFlags?.cryo_mystery_first_clue_found,
    gameState.narrativeFlags?.tutorial_dream_explained,
    setNarrativeFlag,
  ]);

  // Fire VO for the current line whenever the step advances. The hook
  // is idempotent against missing manifest entries, so this is safe to
  // call even before VO has been generated for these line ids.
  useEffect(() => {
    if (!showNarrativeIntro || narrativeStep >= ELARA_INTRO_LINES.length) return;
    speakElaraIntro(`character_sheet_intro_${narrativeStep + 1}`);
  }, [showNarrativeIntro, narrativeStep, speakElaraIntro]);

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
  // `gear` may carry `{ id, baseLocked }` objects for base slots written by
  // the creation flow; readGearId collapses both shapes to a string id (or
  // null) so the paper doll never receives an object as a child.
  const paperDollEquipped = useMemo<Record<EquipSlot, string | null>>(() => {
    return {
      weapon: readGearId(gear.weapon),
      armor: readGearId(gear.armor),
      helm: readGearId(gear.helm),
      secondary: readGearId(gear.secondary),
      accessory: readGearId(gear.accessory),
      consumable: readGearId(gear.consumable),
    };
  }, [gear]);
  const playerInventory = useMemo(() => {
    const owned = new Set<string>();
    for (const raw of Object.values(gear)) {
      const id = readGearId(raw);
      if (id) owned.add(id);
    }
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

  // ═══ BG3 LOADOUT — 18-slot paper doll with species base-mask/base-suit ═══
  // The DB gear column is written in two shapes:
  //   - creation flow writes { "base-mask": { id, baseLocked: true }, ... }
  //   - updateGear writes flat { "base-mask": "<id>", ... }
  // Read either shape defensively, and fall back to resolveStarterLoadout when
  // a base slot is missing entirely (older saves pre-dating §G.2).
  // §G.9 — Only build a BG3 loadout when the DRESSUP_V2 art catalog is
  // actually shipped for this client. Without the suit-piece PNGs the
  // composited renderer leaks an isolated head layer over an empty body
  // (the "floating helmet" report on a fresh awakened operative). When
  // the flag is off we fall through to PaperDollRenderer below, which
  // procedurally paints a full SVG silhouette from the species palette
  // and tints equipped gear on top.
  const bg3Enabled = isDressupV2Enabled();
  const bg3Loadout = useMemo<Loadout | null>(() => {
    if (!bg3Enabled) return null;
    const char = character.data;
    if (!char) return null;

    const gearObj = (char.gear || {}) as Record<string, unknown>;

    const foundation = ((char.foundation as FoundationKey | null | undefined)
      ?? "humanity") as FoundationKey;
    const maskMotif: StarterSpecies =
      foundation === "humanity" ? "human" : (char.species as StarterSpecies);
    const starter = resolveStarterLoadout({
      species: maskMotif,
      characterClass: char.characterClass as ClassKey,
      element: char.element as ElementKey,
      foundation,
    });

    const baseMaskId = readGearId(gearObj["base-mask"]) ?? starter.baseMaskId;
    const baseSuitId = readGearId(gearObj["base-suit"]) ?? starter.baseSuitId;

    const pieces: Record<string, { slot: string; artId: string }> = {
      "base-mask": { slot: "base-mask", artId: baseMaskId },
      "base-suit": { slot: "base-suit", artId: baseSuitId },
    };

    // Pre-fill the visible base outfit from the class's catalog set so the
    // chronicle card reads as a complete kit (head / chest / shoulders /
    // arms / gloves / belt / legs / feet) on a body — not a single hood
    // floating in space. Slots whose PNGs haven't shipped yet silently
    // drop out (PaperDollBG3 renders nothing on image error). Each slot
    // is overridable: equipped or DB-written gear at the same slot wins.
    const baseSet = classSetId(char.characterClass as ClassKey);
    const BASE_OUTFIT_SLOTS = [
      "head", "chest", "shoulders", "arms", "gloves", "belt", "legs", "feet",
    ] as const;
    for (const slot of BASE_OUTFIT_SLOTS) {
      pieces[slot] = { slot, artId: pieceId(baseSet, "common", slot) };
    }

    // Map legacy 6-slot equipment into their §G.1 counterparts so existing
    // drops light up a slot on the BG3 doll, overriding the base-set
    // pre-fill above. Items whose artId can't be parsed back into a
    // <setId>:<rarity>:<slot> suit piece (every legacy id predating the
    // catalog rewrite) are dropped here — overwriting the pre-fill with
    // them would render nothing for that slot and leak through as a
    // floating helmet over a missing body. Renderable suit-piece ids
    // still override the base outfit as intended.
    const LEGACY_TO_SUIT: Record<string, string> = {
      helm: "head",
      armor: "chest",
      weapon: "weapon-primary",
      secondary: "weapon-offhand",
      accessory: "ring-1",
    };
    for (const [legacy, suit] of Object.entries(LEGACY_TO_SUIT)) {
      const id = readGearId(gearObj[legacy]);
      if (id && parseSuitPieceArtId(id)) pieces[suit] = { slot: suit, artId: id };
    }

    // Also honour suit-slot keys directly written to gear (forward-compat).
    // Same parse-gate: only overwrite when the equipped artId is a real
    // suit-catalog piece. An un-renderable id leaves the base pre-fill
    // in place instead of silently blanking the slot.
    const SUIT_SLOTS = [
      "head", "face", "neck", "shoulders", "back", "chest", "arms", "gloves",
      "belt", "legs", "feet", "ring-1", "ring-2", "weapon-primary",
      "weapon-offhand", "aura",
    ] as const;
    for (const slot of SUIT_SLOTS) {
      const id = readGearId(gearObj[slot]);
      if (id && parseSuitPieceArtId(id)) pieces[slot] = { slot, artId: id };
    }

    return { pieces } as unknown as Loadout;
  }, [character.data, bg3Enabled]);

  // Species silhouette to layer at the bottom of the BG3 z-stack so the
  // outfit pieces sit on a body. Mirrors the same `human` collapse the
  // mask motif uses for the humanity foundation so the body shape stays
  // consistent with the mask identity.
  const bg3BodySpecies = useMemo<StarterSpecies | undefined>(() => {
    const char = character.data;
    if (!char) return undefined;
    const foundation = ((char.foundation as FoundationKey | null | undefined)
      ?? "humanity") as FoundationKey;
    return foundation === "humanity"
      ? "human"
      : (char.species as StarterSpecies);
  }, [character.data]);

  // "Base set race" — the species/foundation Inventor set drawn under
  // the class layers so the doll reads as race body in species kit
  // with class plate over the top (BG3 / BioWare reading). Uses the
  // same humanity-collapse as bg3BodySpecies so the human Mourner's
  // Coat wins for humanity-foundation operatives.
  const bg3BaseSetId = useMemo<string | undefined>(() => {
    return bg3BodySpecies ? speciesSetId(bg3BodySpecies) : undefined;
  }, [bg3BodySpecies]);

  // Element tint for BG3 — pull the anchor hex out of the palette descriptor.
  const bg3ElementTint = useMemo(() => {
    const el = character.data?.element as ElementKey | undefined;
    if (!el) return undefined;
    const pal = ELEMENT_PALETTES[el];
    const m = /#([0-9a-f]{6})/i.exec(pal ?? "");
    return m ? `#${m[1]}` : undefined;
  }, [character.data?.element]);

  const updateGearMutation = trpc.citizen.updateGear.useMutation({
    onSuccess: () => { utils.citizen.getCharacter.invalidate(); },
  });

  // Rename UX — opens the small inline dialog rendered down-page.
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const renameMutation = trpc.citizen.renameCharacter.useMutation({
    onSuccess: () => {
      utils.citizen.getCharacter.invalidate();
      setRenameOpen(false);
      setRenameError(null);
    },
    onError: (err) => setRenameError(err.message || "Rename failed."),
  });
  const openRename = useCallback(() => {
    setRenameDraft(character.data?.name ?? "");
    setRenameError(null);
    setRenameOpen(true);
  }, [character.data?.name]);
  const submitRename = useCallback(() => {
    const next = renameDraft.trim();
    if (next.length < 2 || next.length > 64) {
      setRenameError("Name must be 2–64 characters.");
      return;
    }
    if (next === character.data?.name) {
      setRenameOpen(false);
      return;
    }
    renameMutation.mutate({ name: next });
  }, [renameDraft, character.data?.name, renameMutation]);

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
    // Send only the slot that changed — the server merges, so we mustn't
    // re-send the whole gear blob (which may contain object-shape base-mask
    // / base-suit entries that don't match the string-only zod schema).
    updateGearMutation.mutate({ gear: { [slot]: itemId } });
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
          <a href={getGoogleLoginUrl()} className="inline-flex items-center gap-2 void-btn void-btn-primary font-mono text-sm">
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
  // Fall back to a zeroed balance so a transient DB miss on dream_balance
  // never nulls out the sheet. The server also returns zeroed on error,
  // but this is defense-in-depth for the loading/network-error window.
  const dream = dreamBalance.data ?? {
    dreamTokens: 0,
    soulBoundDream: 0,
    dnaCode: 0,
    gems: 0,
    totalGemsPurchased: 0,
    totalDreamEarned: 0,
    difficultyModifier: 0,
  };
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
  // Unwrap the `{ id, baseLocked }` object shape (creation-flow base-mask /
  // base-suit entries) to plain ids so the augmentations list never receives
  // an object as a JSX child — that's the source of Minified React error #31
  // when this section renders on mobile.
  const gearEntries = Object.entries(gear)
    .map(([slot, raw]) => [slot, readGearId(raw)] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] !== null);
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
                {/* Hold "speaking" through the whole line read. When VO
                    audio is attached we ALSO pass it to HolographicElara
                    so wawa-lipsync can drive visemes from the actual
                    waveform instead of the fake-cycle fallback. */}
                <HolographicElara
                  size="lg"
                  isSpeaking={(showNarrativeIntro && narrativeStep < ELARA_INTRO_LINES.length) || elaraIntroSpeaking}
                  audio={elaraIntroAudio}
                />
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

        {/* ═══ PROCEED TO ARK — hoisted for first-time players so the
            most important next action is the easiest one to find. The
            duplicate CTA at the bottom of the page remains as a fallback
            for players who scroll first. ═══ */}
        {fromAwakening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <Link
              href="/ark"
              className="w-full py-4 rounded-lg border void-border-success void-bg-success transition-all flex items-center justify-center gap-3 group"
              style={{ boxShadow: "0 0 30px color-mix(in oklch, var(--energy-primary) 12%, transparent)" }}
            >
              <Sparkles size={16} className="void-text-energy group-hover:animate-pulse" />
              <span className="font-display text-sm font-bold tracking-[0.2em] void-text-energy">PROCEED TO THE ARK</span>
              <span className="font-mono text-[9px] void-text-energy">— Begin exploring the ship</span>
            </Link>
            <p className="text-center font-mono text-[9px] text-muted-foreground/40 mt-2 tracking-wider">
              Elara will surface the rest of your dossier as you discover it
            </p>
          </motion.div>
        )}

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
                {/* Heritage portrait — always-visible species plate behind
                    the paper-doll, so the operative reads as their race
                    even when the §G.9 BG3 body PNG hasn't shipped for
                    this species×foundation combination. The doll layers
                    composite on top via the existing PaperDollBG3 stack;
                    this background just guarantees a body is visible. */}
                <div className={`relative rounded-lg border-2 ${alignBorderColor} overflow-hidden flex-shrink-0`}
                  style={{ boxShadow: isOrder ? '0 0 30px color-mix(in oklch, var(--energy-primary) 10%, transparent)' : '0 0 30px color-mix(in oklch, var(--energy-system) 10%, transparent)' }}>
                  {(() => {
                    const heritageSrc = SPECIES_HERITAGE_PORTRAIT[String(char.species).toLowerCase()];
                    if (!heritageSrc) return null;
                    return (
                      <img
                        src={heritageSrc}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none z-[1]"
                        style={{ objectPosition: "center 18%" }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    );
                  })()}
                  <div className={`absolute inset-0 ${alignBg}`} />
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute w-full h-0.5 ${isOrder ? "void-bg-success" : "void-bg-system"} animate-scan-line`} />
                  </div>
                  <div className="relative z-10 p-2">
                    {/* §G.9 18-slot BG3 paper doll — species-driven base-mask
                        + base-suit composed under element-tinted gear layers.
                        Starter sentinels (`mask:…` / `suit:…`) route to the
                        matching Inventor-catalog piece via parseSuitPieceArtId
                        so the base layers render real shipped art; equipped
                        suit pieces render directly from `<setId>:<rarity>:<slot>`.
                        Slots whose PNG hasn't shipped yet still fall through
                        to the placeholder rectangle so the silhouette of the
                        character is always visible. */}
                    <div className="relative" style={{ width: 320 }}>
                      {bg3Loadout ? (
                        <PaperDollBG3
                          loadout={bg3Loadout}
                          elementTint={bg3ElementTint}
                          width={320}
                          bodySpecies={bg3BodySpecies}
                          baseSetId={bg3BaseSetId}
                        />
                      ) : (
                        <PaperDollRenderer
                          species={char.species as Species}
                          alignment={char.alignment as "order" | "chaos"}
                          element={char.element}
                          equipped={paperDollEquipped}
                          name={char.name}
                          size="md"
                          moralityScore={gameState.moralityScore || 0}
                        />
                      )}

                      {/* Nameplate */}
                      {char.name && (
                        <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
                          <span className={`font-display text-xs tracking-[0.2em] ${isOrder ? "void-text-energy" : "void-text-system"}`}
                            style={{ textShadow: `0 0 8px ${isOrder ? "color-mix(in oklch, var(--energy-primary) 50%, transparent)" : "color-mix(in oklch, var(--energy-system) 50%, transparent)"}` }}>
                            {char.name}
                          </span>
                        </div>
                      )}

                      {/* Interactive slot indicators overlay — the BG3
                          renderer draws the doll; we still want clickable
                          chips so the player can jump into the equip panel
                          on the correct slot. Positions come from the
                          legacy SLOT_CONFIG which still lines up with the
                          new silhouette. */}
                      <div className="absolute inset-0 pointer-events-none">
                        {(Object.entries(SLOT_CONFIG) as [EquipSlot, typeof SLOT_CONFIG[EquipSlot]][]).map(([slot, config]) => {
                          const itemId = paperDollEquipped[slot];
                          const item = itemId ? getEquipmentById(itemId) : null;
                          const rarity = item ? RARITY_COLORS[item.rarity] : null;
                          return (
                            <motion.button
                              key={slot}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowEquipPanel(true)}
                              className={`pointer-events-auto absolute w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                                ${item
                                  ? `${rarity!.border} ${rarity!.bg} shadow-lg`
                                  : "border-dashed border-muted-foreground/30 bg-muted/20 hover:border-primary/50"
                                }`}
                              style={{
                                left: `${config.position.x}%`,
                                top: `${config.position.y}%`,
                                transform: "translate(-50%, -50%)",
                                boxShadow: item ? `0 0 8px ${item.glowColor}` : undefined,
                              }}
                              title={item ? `${config.label}: ${item.name}` : `${config.label}: Empty`}
                            >
                              <span className={`text-[8px] font-mono font-bold ${item ? rarity!.text : "text-muted-foreground/50"}`}>
                                {config.label.charAt(0)}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  <div className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  <div className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${isOrder ? "void-border-success" : "void-border-system"}`} />
                  {/* Ornamental portrait frame on top of everything —
                      gold for Order, silver for Chaos. The PNG has a
                      transparent center so the doll + heritage still
                      read through. Pointer-events disabled so the slot
                      pips beneath remain interactive. Falls back to the
                      bare corner brackets above on 404. */}
                  <img
                    src={characterSheetFrameUrls(isOrder ? "gold" : "silver").final}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  {char.species === "neyon" && char.neyonTokenId && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded void-bg-sunk border void-border z-40">
                      <span className="font-mono text-[7px] void-text-accent font-bold">#{char.neyonTokenId} ✦ 1/1</span>
                    </div>
                  )}
                </div>

                {/* Heritage card — species + class base set the player
                    is wearing. Always rendered so the operative reads
                    as their race/class even when individual paper-doll
                    art slots haven't shipped. Pulls lore from the same
                    SPECIES_LORE / CLASS_LORE the chronicle uses. */}
                <div className={`rounded-lg border ${alignBorderColor} ${alignBg} p-3 w-full max-w-[340px]`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={10} className={alignTextColor} />
                    <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">HERITAGE // BASE LOADOUT</span>
                  </div>
                  <p className={`font-display text-sm font-bold tracking-wide ${alignTextColor}`}>
                    {speciesLore.title}
                    <span className="font-mono text-[9px] text-muted-foreground/50 ml-1.5">{classLore.title.toUpperCase()}</span>
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/70 italic leading-snug mt-1">
                    {speciesLore.tagline}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 leading-snug mt-2">
                    {classLore.tagline}
                  </p>
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
                {/* Name + rename affordance. The pencil opens an inline
                    dialog backed by the citizen.renameCharacter mutation
                    so a placeholder name (e.g. typed during Awakening QA)
                    can be fixed without re-running creation. */}
                <div className="flex items-center gap-2 mb-1 min-w-0">
                  <h1 className={`font-display text-2xl sm:text-4xl font-black tracking-wider ${alignTextColor} ${alignGlowText} truncate min-w-0`}>
                    {char.name}
                  </h1>
                  <button
                    type="button"
                    onClick={openRename}
                    aria-label="Rename operative"
                    title="Rename operative"
                    className="shrink-0 p-1.5 rounded-md void-bg-sunk border void-border hover:void-text-energy text-muted-foreground/60 transition-colors"
                    data-testid="character-rename-trigger"
                  >
                    <Pencil size={12} />
                  </button>
                </div>

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
          {/* Dream-spend upgrade buttons are hidden until Elara has
              actually explained Dream as substrate (in-world tutorial,
              flag `tutorial_dream_explained`). Until then the bars are
              read-only — the player sees who they are, not what they
              can buy. */}
          <div className="grid gap-3">
            <BioscanReadout
              value={char.attrAttack}
              label="ATTACK"
              immersiveName="KINETIC OUTPUT"
              color="red"
              icon={Crosshair}
              quote={KINETIC_QUOTES[Math.min(char.attrAttack, 5)] || KINETIC_QUOTES[1]}
              canUpgrade={!!gameState.narrativeFlags?.tutorial_dream_explained && char.attrAttack < 5 && !!dream}
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
              canUpgrade={!!gameState.narrativeFlags?.tutorial_dream_explained && char.attrDefense < 5 && !!dream}
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
              canUpgrade={!!gameState.narrativeFlags?.tutorial_dream_explained && char.attrVitality < 5 && !!dream}
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
            Gated behind mech_dream_substrate_tutor_seen — the panel
            reveals after the Engineer's Log on FNORD-23 plays. Until
            then a new player has no frame for tokens vs bound light.
           ═══════════════════════════════════════════════════ */}
        {gameState.narrativeFlags?.mech_dream_substrate_tutor_seen && (
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
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 6: SECURITY CLEARANCE & MORALITY
            Prestige panel gated behind mech_prestige_tutor_seen
            (The Degen's casino cinematic). Morality block follows
            its own tutor flag below.
           ═══════════════════════════════════════════════════ */}
        {gameState.narrativeFlags?.mech_prestige_tutor_seen && (
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
                {/* Only preview the next prestige tier's title, reward,
                    and lore once the player is actually eligible to take
                    it — otherwise we're spoiling clearances they haven't
                    earned yet. Pre-eligibility, the level cap nudge above
                    ("Reach level 25 to unlock…") carries the load. */}
                {nextLevel && canP && (
                  <div className="border void-border rounded-lg p-3 void-bg-sunk/[0.03]">
                    <p className="font-mono text-[9px] void-text-accent mb-1">NEXT: {nextLevel.titlePrefix} ({nextLevel.stars}★)</p>
                    <p className="font-mono text-[8px] text-white/30">{nextLevel.reward.description}</p>
                    <p className="font-mono text-[8px] text-white/15 italic mt-1">{nextLevel.loreText.substring(0, 120)}...</p>
                  </div>
                )}
                {canP && (
                  // Routes to the proper §15 cycle-reset ceremony page
                  // instead of the window.confirm() hack this used to
                  // fire. The ceremony lists the carryover rules in
                  // canon and requires a deliberate "Release" click —
                  // `performPrestige()` is still the underlying action,
                  // invoked from PrestigeCycleResetPage once confirmed.
                  <Link
                    href="/prestige-cycle"
                    className="block w-full mt-3 py-2.5 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-[10px] font-bold tracking-wider void-bg-sunk transition-all text-center"
                  >
                    UPGRADE CLEARANCE — Review cycle reset ceremony
                  </Link>
                )}
              </div>
            );
          })()}
        </motion.div>
        )}

        {/* MORALITY ALIGNMENT — gated behind mech_morality_tutor_seen
            (The Human's Act 1 closing-branch cinematic) */}
        {gameState.narrativeFlags?.mech_morality_tutor_seen && (
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
        )}

        {/* DREAM PARTITION (Character Mind) — gated behind the existing
            tutorial_dream_explained flag (Elara's Comms-Relay beat).
            Same flag already gates attribute upgrades above. */}
        {gameState.narrativeFlags?.tutorial_dream_explained && (
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
        )}

        {/* NEURAL RESPEC — gated behind mech_respec_tutor_seen
            (Engineer's Log "On Un-Choosing"). The button hides until
            the player has heard the lesson on the bench. */}
        {gameState.narrativeFlags?.mech_respec_tutor_seen && (
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
        )}

        {/* TRAIT SUMMARY — derived gate. The panel shows once any of
            the system tutors has fired, so it grows visibly as the
            player learns the systems that contribute its rows. The
            rows themselves derive their visibility from each
            underlying system's tutor-seen flag (handled inside
            TraitSummaryPanel, not here). */}
        {(gameState.narrativeFlags?.mech_card_combat_tutor_seen
          || gameState.narrativeFlags?.mech_deckbuilder_tutor_seen
          || gameState.narrativeFlags?.mech_allegiances_tutor_seen
          || gameState.narrativeFlags?.mech_witnessing_tutor_seen
          || gameState.narrativeFlags?.mech_soul_stones_tutor_seen
          || gameState.narrativeFlags?.mech_oracle_deck_tutor_seen
          || gameState.narrativeFlags?.mech_chess_tutor_seen
          || gameState.narrativeFlags?.mech_sprite_proxy_tutor_seen
          || gameState.narrativeFlags?.mech_expansion_drops_tutor_seen
          || gameState.narrativeFlags?.mech_trade_empire_tutor_seen
          || gameState.narrativeFlags?.mech_crafting_tutor_seen
          || gameState.narrativeFlags?.mech_dream_substrate_tutor_seen
          || gameState.narrativeFlags?.mech_respec_tutor_seen
          || gameState.narrativeFlags?.mech_prestige_tutor_seen
          || gameState.narrativeFlags?.mech_morality_tutor_seen
          || gameState.narrativeFlags?.mech_breeding_tutor_seen
          || gameState.narrativeFlags?.mech_colony_commerce_tutor_seen
          || gameState.narrativeFlags?.mech_demon_pacts_tutor_seen) && (
          <TraitSummaryPanel isAuthenticated={isAuthenticated} />
        )}

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
            FACTION STANDINGS — five-faction reputation
            (Architect Remnants / New Babylon / Hierarchy /
            Insurgency / Dreamer's Children). Standing values
            are server-authoritative via getFactionStandings;
            this widget renders bars and the current band
            (enemy / suspect / neutral / ally / champion).

            Gated behind mech_allegiances_tutor_seen — The Human
            introduces the eight-banner system at the central
            pedestal in Act 2 before the panel reveals.
           ═══════════════════════════════════════════════════ */}
        {gameState.narrativeFlags?.mech_allegiances_tutor_seen && (
          <div className="my-6">
            <FactionStandingPanel />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 8: GAME MASTER WARNING
            Gated behind `combat_first_damage_taken` — the warning lands
            after the player has actually felt the cost of being watched.
            On the post-Awakening landing it would be a spoiler salvo
            before the player has a frame for any of these terms.
           ═══════════════════════════════════════════════════ */}
        {gameState.narrativeFlags?.combat_first_damage_taken && (
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
        )}

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

        {/* Rename Dialog — small inline modal styled to match the
            rest of the chronicle's surface so it reads as part of
            the same control vocabulary. */}
        <AnimatePresence>
          {renameOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setRenameOpen(false)}
              data-testid="character-rename-dialog"
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-sm rounded-lg border-2 ${alignBorderColor} ${alignBg} p-5`}
              >
                <button
                  type="button"
                  onClick={() => setRenameOpen(false)}
                  aria-label="Close rename dialog"
                  className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground/60 hover:void-text-energy"
                >
                  <X size={14} />
                </button>
                <p className={`font-mono text-[10px] tracking-[0.3em] mb-1 ${alignTextColor}`}>
                  RENAME OPERATIVE
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/60 mb-4">
                  The Antiquarian will overwrite your nameplate in the chronicle. 2–64 characters.
                </p>
                <input
                  type="text"
                  value={renameDraft}
                  onChange={(e) => { setRenameDraft(e.target.value); setRenameError(null); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitRename();
                    if (e.key === "Escape") setRenameOpen(false);
                  }}
                  maxLength={64}
                  autoFocus
                  placeholder="New name"
                  className="w-full px-3 py-2 rounded-md void-bg-sunk border void-border font-mono text-sm void-text outline-none focus:void-border-success"
                  data-testid="character-rename-input"
                />
                {renameError && (
                  <p className="mt-2 font-mono text-[10px] void-text-error">{renameError}</p>
                )}
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRenameOpen(false)}
                    className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 hover:void-text"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={submitRename}
                    disabled={renameMutation.isPending || renameDraft.trim().length < 2}
                    className={`px-4 py-1.5 rounded-md font-mono text-[10px] tracking-[0.2em] border ${alignBorderColor} ${alignBg} ${alignTextColor} disabled:opacity-40`}
                    data-testid="character-rename-submit"
                  >
                    {renameMutation.isPending ? "SAVING…" : "COMMIT"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
