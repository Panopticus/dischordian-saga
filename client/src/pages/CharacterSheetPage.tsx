import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  ChevronLeft, Shield, Swords, Heart, Zap, User,
  Sparkles, ArrowUp, Droplets, Flame, Wind, Mountain,
  Clock, Globe, Target, Wrench, Eye, Skull, Telescope,
  Star, Trophy, Gem, Lock, Unlock, Activity, Crosshair,
  Hexagon, CircleDot, Layers, Cpu, Wifi, ChevronDown, ChevronUp
} from "lucide-react";

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
        <div className="absolute inset-[-3px] rounded-full border border-dashed border-white/5 animate-[spin_30s_linear_infinite]" />
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
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
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

      {/* ═══ DOSSIER HEADER BAR ═══ */}
      <div className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-md">
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
              {/* LEFT: Portrait Area */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                {/* Portrait Frame */}
                <div className={`relative w-32 h-40 sm:w-40 sm:h-52 rounded-lg border-2 ${alignBorderColor} overflow-hidden flex-shrink-0`}>
                  {/* Inner glow */}
                  <div className={`absolute inset-0 ${alignBg}`} />
                  {/* Scan line sweep */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute w-full h-0.5 ${isOrder ? "bg-cyan-400/20" : "bg-purple-400/20"} animate-scan-line`} />
                  </div>
                  {/* Portrait placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <User size={48} className={`${alignTextColor} mx-auto mb-2 opacity-40`} />
                      <span className="font-mono text-[7px] text-muted-foreground/30 tracking-[0.2em]">NEURAL SCAN</span>
                    </div>
                  </div>
                  {/* Corner brackets */}
                  <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  <div className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  <div className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${isOrder ? "border-cyan-400/40" : "border-purple-400/40"}`} />
                  {/* Ne-Yon 1/1 badge */}
                  {char.species === "neyon" && char.neyonTokenId && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40">
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
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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

          {/* ── EQUIPPED GEAR ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-float rounded-lg p-4 sm:p-5"
          >
            <SectionHeader icon={Layers} label="EQUIPPED GEAR" color="text-amber-400" />
            {gearEntries.length > 0 ? (
              <div>
                {gearEntries.map(([slot, item]) => (
                  <GearSlot key={slot} slot={slot} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Hexagon size={28} className="text-muted-foreground/20 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/40">No gear equipped</p>
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
            TRAIT IMPACT SUMMARY — Shows how traits affect all game systems
           ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-float rounded-lg overflow-hidden mb-6"
        >
          <button
            onClick={() => setShowTraitDetails(!showTraitDetails)}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-primary" />
              <span className="font-display text-[10px] font-bold tracking-[0.3em] text-foreground/80">TRAIT IMPACT ANALYSIS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] text-muted-foreground/40">
                {showTraitDetails ? "COLLAPSE" : "EXPAND"}
              </span>
              {showTraitDetails ? <ChevronUp size={12} className="text-muted-foreground/40" /> : <ChevronDown size={12} className="text-muted-foreground/40" />}
            </div>
          </button>

          {showTraitDetails && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/5 pt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card Game */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers size={10} className="text-primary" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-primary">CARD GAME</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-muted-foreground/70">
                  <p>Species: {char.species === "demagi" ? "+HP bonus" : char.species === "quarchon" ? "+Armor bonus" : "+HP & Armor"}</p>
                  <p>Class: {char.characterClass === "spy" ? "+Draw cards" : char.characterClass === "oracle" ? "+Foresight" : char.characterClass === "assassin" ? "+Crit chance" : char.characterClass === "engineer" ? "+Repair" : "+ATK power"}</p>
                  <p>Element: Matching cards get +ATK/+HP</p>
                  <p>Alignment: {isOrder ? "Structure bonus" : "Wildcard bonus"}</p>
                </div>
              </div>

              {/* Trade Empire */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Globe size={10} className="text-accent" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-accent">TRADE EMPIRE</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-muted-foreground/70">
                  <p>Species: {char.species === "demagi" ? "+Trade credits" : char.species === "quarchon" ? "+Combat power" : "+Both bonuses"}</p>
                  <p>Class: {char.characterClass === "spy" ? "+Scan range" : char.characterClass === "oracle" ? "+Market intel" : char.characterClass === "assassin" ? "+Piracy" : char.characterClass === "engineer" ? "+Ship repair" : "+Weapons"}</p>
                  <p>Element: Hazard resistance</p>
                  <p>Alignment: {isOrder ? "Better port prices" : "Smuggling bonus"}</p>
                </div>
              </div>

              {/* Fight Game */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Swords size={10} className="text-red-400" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-red-400">FIGHT ARENA</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-muted-foreground/70">
                  <p>Species: {char.species === "demagi" ? "+HP & Energy" : char.species === "quarchon" ? "+Defense & ATK" : "+HP, DEF, ATK"}</p>
                  <p>Class: {char.characterClass === "assassin" ? "+Crit damage" : char.characterClass === "soldier" ? "+Raw ATK" : char.characterClass === "engineer" ? "+Defense" : char.characterClass === "oracle" ? "+Speed" : "+Evasion"}</p>
                  <p>Alignment: {isOrder ? "+Counter chance" : "+Crit multiplier"}</p>
                  <p>Attributes: Direct stat scaling</p>
                </div>
              </div>

              {/* Crafting */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Wrench size={10} className="text-emerald-400" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-emerald-400">CRAFTING</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-muted-foreground/70">
                  <p>Class: {char.characterClass === "engineer" ? "+15% success rate" : char.characterClass === "oracle" ? "+Rare output chance" : "+5% success rate"}</p>
                  <p>Attributes: VIT dots boost success</p>
                </div>
              </div>

              {/* Exploration */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Telescope size={10} className="text-indigo-400" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-indigo-400">EXPLORATION</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-muted-foreground/70">
                  <p>Class: {char.characterClass === "spy" ? "+Hidden items" : char.characterClass === "oracle" ? "+Discovery XP" : "+Exploration bonus"}</p>
                  <p>Element: Terrain affinity bonus</p>
                  <p>Attributes: ATK dots boost Dream earnings</p>
                </div>
              </div>

              {/* Universal */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Star size={10} className="text-yellow-400" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-yellow-400">UNIVERSAL</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-muted-foreground/70">
                  <p>Potential NFT: Level multiplier (1.0x-1.5x)</p>
                  <p>Citizen Level: Unlocks rooms & content</p>
                  <p>Dream Balance: Upgrade attributes & class</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

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
