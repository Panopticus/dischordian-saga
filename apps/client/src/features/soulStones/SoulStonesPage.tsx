/* ═══════════════════════════════════════════════════════
   THE SOUL ECONOMY — Soul Stones, Demon Pets, Divine
   Companions & Alignment.
   Four-tab sacred/dark space for the dual-path economy.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Gem, Skull, Sun, Scale, Flame, Sparkles,
  Clock, Shield, Zap, AlertTriangle, Check, X, Star,
  Heart, Eye, Crown, Package, ArrowUp, Infinity as InfinityIcon,
} from "lucide-react";
import { AtmosphereScope } from "@/components/void";
import { useSoulStoneStore } from "./soulStoneStore";
import type {
  SoulStone, StoneState, DemonPet, DivineCompanion, DischordianCompanion,
  CompanionTier, ActiveCompanion, GlobalAlignment,
  CorruptionTierEffect, PurityTierEffect,
} from "./types";
import { DEMON_PETS } from "./demonPets";
import { DIVINE_COMPANIONS, DISCHORDIAN_COMPANIONS } from "./divineCompanions";
import { CORRUPTION_TIERS, PURITY_TIERS, PURIFICATION_CONFIG } from "./soulStoneConfig";
import {
  corruptStone, startPurification, summonDemon, dismissCompanion,
  forgeDivineCompanion, getAlignmentData, getPlayerStats,
} from "./soulStoneService";
import { SOUL_STONE_ART } from "@/data/nanobanna2Assets";

/* ─── TAB TYPE ─── */
type Tab = "inventory" | "summoning" | "purification" | "alignment" | "dischordian";

/* ─── ROOM KEYS for atmosphere ─── */
const TAB_ROOMS: Record<Tab, string> = {
  inventory: "soul_stones_vault",
  summoning: "castle_of_death",
  purification: "dreamers_chamber",
  alignment: "arks_soul",
  dischordian: "the_paradox_space",
};

/* ─── STONE COLOR MAP ─── */
const STONE_COLORS: Record<StoneState, { text: string; border: string; bg: string; glow: string; art: string }> = {
  violet: { text: "void-text-system", border: "void-border-system", bg: "void-bg-system", glow: "shadow-purple-500/20", art: SOUL_STONE_ART.violet },
  red:    { text: "void-text-error",    border: "void-border-error",    bg: "void-bg-error",    glow: "shadow-red-500/20",    art: SOUL_STONE_ART.red },
  gold:   { text: "void-text-accent",  border: "void-border",  bg: "void-bg-sunk",  glow: "shadow-amber-500/20",  art: SOUL_STONE_ART.gold },
};

/* ─── TIER BADGE COLORS ─── */
const TIER_COLORS: Record<CompanionTier, { text: string; border: string; bg: string }> = {
  1: { text: "void-text-energy",   border: "void-border-success",   bg: "void-bg-success" },
  2: { text: "void-text-system", border: "void-border-system", bg: "void-bg-system" },
  3: { text: "void-text-accent",  border: "void-border",  bg: "void-bg-sunk" },
};

/* ─── COUNTDOWN FORMATTER ─── */
function formatCountdown(targetMs: number): string {
  const diff = targetMs - Date.now();
  if (diff <= 0) return "COMPLETE";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ─── DATE FORMATTER ─── */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════
   ACTIVE COMPANION DISPLAY
   ═══════════════════════════════════════════════════════ */
function ActiveCompanionBanner({ companion }: { companion: ActiveCompanion | null }) {
  if (!companion) return null;

  const pet = DEMON_PETS.find((d) => d.id === companion.companionId);
  const divine = DIVINE_COMPANIONS.find((d) => d.id === companion.companionId);
  const entity = pet || divine;
  if (!entity) return null;

  const isDemon = companion.path === "demon";
  const borderColor = isDemon ? "void-border-error" : "void-border";
  const bgColor = isDemon ? "void-bg-error" : "void-bg-sunk";
  const textColor = isDemon ? "void-text-error" : "void-text-accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border ${borderColor} ${bgColor} mb-4 flex items-center gap-3`}
      data-narrative="breathe"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDemon ? "void-bg-error" : "void-bg-sunk"}`}>
        {isDemon ? <Skull size={16} className="void-text-error" /> : <Sun size={16} className="void-text-accent" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-display text-sm ${textColor}`}>{entity.name}</span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
            {isDemon ? "DEMON PET" : "DIVINE COMPANION"}
          </span>
        </div>
        <p className="font-mono text-[9px] text-muted-foreground/60 truncate">
          {entity.ability.description}
        </p>
      </div>
      <span className="font-mono text-[8px] text-muted-foreground/40">
        EQUIPPED {formatDate(companion.equippedAt)}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR
   ═══════════════════════════════════════════════════════ */
function StatsBar() {
  const store = useSoulStoneStore();
  const stats = useMemo(() => getPlayerStats(store), [store]);

  const items = [
    { label: "TOTAL STONES",     value: stats.totalStones,       color: "void-text-system" },
    { label: "CORRUPTION PTS",   value: stats.corruptionPoints,  color: "void-text-error" },
    { label: "DIVINE LIGHT",     value: stats.divineLightFragments, color: "void-text-accent" },
    { label: "WEEKLY CAP",       value: `${stats.weeklyCollected}/15`, color: "void-text-energy" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="void-surface rounded-lg p-2 text-center"
        >
          <div className={`font-display text-lg ${item.color}`}>{item.value}</div>
          <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SOUL STONE CARD
   ═══════════════════════════════════════════════════════ */
function SoulStoneCard({ stone }: { stone: SoulStone }) {
  const store = useSoulStoneStore();
  const colors = STONE_COLORS[stone.state];

  const handleCorrupt = useCallback(() => {
    corruptStone(store, stone.id);
  }, [store, stone.id]);

  const handlePurify = useCallback(() => {
    startPurification(store, stone.id);
  }, [store, stone.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`void-elevated rounded-lg p-3 border ${colors.border} ${colors.bg} shadow-lg ${colors.glow}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gem size={14} className={colors.text} />
          <span className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${colors.bg} ${colors.border} border ${colors.text}`}>
            {stone.state}
          </span>
        </div>
        {stone.isPurifying && (
          <span className="font-mono text-[8px] void-text-accent flex items-center gap-1">
            <Clock size={10} /> PURIFYING
          </span>
        )}
      </div>

      <div className="space-y-1 mb-3">
        <div className="font-mono text-[9px] text-muted-foreground/60">
          <span className="uppercase tracking-wider">SOURCE</span>{" "}
          <span className="text-muted-foreground/80">{stone.source}</span>
        </div>
        <div className="font-mono text-[9px] text-muted-foreground/60">
          <span className="uppercase tracking-wider">COLLECTED</span>{" "}
          <span className="text-muted-foreground/80">{formatDate(stone.collectedAt)}</span>
        </div>
      </div>

      {stone.state === "violet" && !stone.isPurifying && (
        <div className="flex gap-2">
          <button
            onClick={handleCorrupt}
            className="void-btn flex-1 text-[9px] font-mono uppercase tracking-wider py-1.5 rounded border void-border-error void-bg-error void-text-error void-bg-error transition-colors"
          >
            <Flame size={10} className="inline mr-1" />
            CORRUPT
          </button>
          <button
            onClick={handlePurify}
            className="void-btn flex-1 text-[9px] font-mono uppercase tracking-wider py-1.5 rounded border void-border void-bg-sunk void-text-accent void-bg-sunk transition-colors"
          >
            <Sun size={10} className="inline mr-1" />
            PURIFY
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 1: INVENTORY
   ═══════════════════════════════════════════════════════ */
function InventoryTab() {
  const { stones, activeDemonPet, activeDivineCompanion, activeDischordian } = useSoulStoneStore();
  const activeCompanion = activeDemonPet ?? activeDivineCompanion ?? activeDischordian;

  return (
    <div>
      <ActiveCompanionBanner companion={activeCompanion} />
      <StatsBar />

      <div className="flex items-center gap-2 mb-4">
        <Gem size={16} className="void-text-system" />
        <h2 className="font-display text-lg uppercase tracking-wider void-text-system">
          Soul Stone Inventory
        </h2>
      </div>

      {stones.length === 0 ? (
        <div className="void-surface rounded-lg p-8 text-center">
          <Gem size={32} className="mx-auto text-muted-foreground/20 mb-3" />
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/40">
            No soul stones collected yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {stones.map((stone) => (
              <SoulStoneCard key={stone.id} stone={stone} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DEMON PET CARD
   ═══════════════════════════════════════════════════════ */
function DemonPetCard({ pet, canAfford, isEquipped }: {
  pet: DemonPet;
  canAfford: boolean;
  isEquipped: boolean;
}) {
  const store = useSoulStoneStore();
  const tierColor = TIER_COLORS[pet.tier];

  const handleSummon = useCallback(() => {
    summonDemon(store, pet.id);
  }, [store, pet.id]);

  const handleDismiss = useCallback(() => {
    dismissCompanion(store);
  }, [store]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`void-elevated rounded-lg p-4 border ${isEquipped ? "void-border-error shadow-lg shadow-red-500/20" : "void-border-error"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm void-text-error">{pet.name}</h3>
        <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${tierColor.border} ${tierColor.bg} ${tierColor.text}`}>
          TIER {pet.tier}
        </span>
      </div>

      <div className="font-mono text-[9px] text-muted-foreground/50 mb-2">
        <span className="uppercase tracking-wider">PATRON</span>{" "}
        <span className="void-text-error">{pet.patron}</span>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground/70 mb-2 leading-relaxed">
        {pet.ability.description}
      </p>

      <p className="font-mono text-[9px] void-text-error mb-3 leading-relaxed">
        <AlertTriangle size={10} className="inline mr-1" />
        {pet.drawback.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/50">
          <Flame size={10} className="inline mr-1 void-text-error" />
          {pet.corruptionCost} CP
        </span>

        {isEquipped ? (
          <button
            onClick={handleDismiss}
            className="void-btn text-[9px] font-mono uppercase tracking-wider py-1.5 px-3 rounded border void-border-error void-bg-error void-text-error void-bg-error transition-colors"
          >
            <X size={10} className="inline mr-1" />
            DISMISS
          </button>
        ) : (
          <button
            onClick={handleSummon}
            disabled={!canAfford}
            className={`void-btn text-[9px] font-mono uppercase tracking-wider py-1.5 px-3 rounded border transition-colors
              ${canAfford
                ? "void-border-error void-bg-error void-text-error void-bg-error"
                : "border-muted/20 bg-muted/5 text-muted-foreground/30 cursor-not-allowed"
              }`}
          >
            <Skull size={10} className="inline mr-1" />
            SUMMON
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 2: SUMMONING CIRCLE
   ═══════════════════════════════════════════════════════ */
function SummoningCircleTab() {
  const store = useSoulStoneStore();
  const stats = useMemo(() => getPlayerStats(store), [store]);
  const equippedDemon = store.activeDemonPet;

  const petsByTier = useMemo(() => {
    const grouped: Record<CompanionTier, DemonPet[]> = { 1: [], 2: [], 3: [] };
    DEMON_PETS.forEach((pet) => grouped[pet.tier].push(pet));
    return grouped;
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Skull size={18} className="void-text-error" />
        <h2 className="font-display text-lg uppercase tracking-wider void-text-error">
          The Castle of Death — Summoning Circle
        </h2>
      </div>

      {/* Necromancer quote */}
      <div
        className="p-3 rounded-lg border void-border-error void-bg-error mb-6"
        data-narrative="breathe"
      >
        <p className="font-mono text-[10px] void-text-error italic leading-relaxed">
          "Every soul has a price, and every demon demands payment in kind.
          Choose your servant wisely — their hunger never sleeps."
        </p>
        <span className="font-mono text-[8px] uppercase tracking-wider void-text-error mt-1 block">
          — The Necromancer
        </span>
      </div>

      {/* Equipped demon */}
      {equippedDemon && (
        <ActiveCompanionBanner companion={equippedDemon} />
      )}

      {/* Tiers */}
      {([1, 2, 3] as CompanionTier[]).map((tier) => (
        <div key={tier} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${TIER_COLORS[tier].border} ${TIER_COLORS[tier].bg} ${TIER_COLORS[tier].text}`}>
              TIER {tier}
            </span>
            <div className="flex-1 h-px void-bg-error" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {petsByTier[tier].map((pet) => (
              <DemonPetCard
                key={pet.id}
                pet={pet}
                canAfford={stats.corruptionPoints >= pet.corruptionCost}
                isEquipped={equippedDemon?.companionId === pet.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DIVINE COMPANION CARD
   ═══════════════════════════════════════════════════════ */
function DivineCompanionCard({ companion, canAfford, isEquipped }: {
  companion: DivineCompanion;
  canAfford: boolean;
  isEquipped: boolean;
}) {
  const store = useSoulStoneStore();
  const tierColor = TIER_COLORS[companion.tier];

  const handleForge = useCallback(() => {
    forgeDivineCompanion(store, companion.id);
  }, [store, companion.id]);

  const handleDismiss = useCallback(() => {
    dismissCompanion(store);
  }, [store]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`void-elevated rounded-lg p-4 border ${isEquipped ? "void-border shadow-lg shadow-amber-500/20" : "void-border"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm void-text-accent">{companion.name}</h3>
        <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${tierColor.border} ${tierColor.bg} ${tierColor.text}`}>
          TIER {companion.tier}
        </span>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground/70 mb-2 leading-relaxed">
        {companion.ability.description}
      </p>

      <span className="inline-block font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border-success void-bg-success void-text-energy mb-3">
        <Check size={8} className="inline mr-0.5" />
        NO DRAWBACK
      </span>

      {/* Antiquarian quote */}
      <div className="p-2 rounded border void-border-success void-bg-success mb-3">
        <p className="font-mono text-[9px] void-text-energy italic leading-relaxed">
          "{companion.antiquarianEntry}"
        </p>
        <span className="font-mono text-[8px] uppercase tracking-wider void-text-energy mt-0.5 block">
          — The Antiquarian
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/50">
          <Sun size={10} className="inline mr-1 void-text-accent" />
          {companion.divineLightCost} DL
        </span>

        {isEquipped ? (
          <button
            onClick={handleDismiss}
            className="void-btn text-[9px] font-mono uppercase tracking-wider py-1.5 px-3 rounded border void-border void-bg-sunk void-text-accent void-bg-sunk transition-colors"
          >
            <X size={10} className="inline mr-1" />
            DISMISS
          </button>
        ) : (
          <button
            onClick={handleForge}
            disabled={!canAfford}
            className={`void-btn text-[9px] font-mono uppercase tracking-wider py-1.5 px-3 rounded border transition-colors
              ${canAfford
                ? "void-border void-bg-sunk void-text-accent void-bg-sunk"
                : "border-muted/20 bg-muted/5 text-muted-foreground/30 cursor-not-allowed"
              }`}
          >
            <Sparkles size={10} className="inline mr-1" />
            FORGE
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PURIFICATION PROGRESS BAR
   ═══════════════════════════════════════════════════════ */
function PurificationProgress({ stone, now }: { stone: SoulStone; now: number }) {
  if (!stone.purificationStartedAt || !stone.purificationCompletesAt) return null;

  const total = stone.purificationCompletesAt - stone.purificationStartedAt;
  const elapsed = Math.min(now - stone.purificationStartedAt, total);
  const pct = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;
  const isComplete = now >= stone.purificationCompletesAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="void-elevated rounded-lg p-3 border void-border"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gem size={12} className="void-text-system" />
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
            Stone from {stone.source}
          </span>
        </div>
        <span className={`font-mono text-[9px] ${isComplete ? "void-text-accent" : "text-muted-foreground/50"}`}>
          {isComplete ? (
            <><Check size={10} className="inline mr-1" />COMPLETE</>
          ) : (
            <><Clock size={10} className="inline mr-1" />{formatCountdown(stone.purificationCompletesAt)}</>
          )}
        </span>
      </div>

      <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400"
          style={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="font-mono text-[8px] text-muted-foreground/40">0h</span>
        <span className="font-mono text-[8px] text-muted-foreground/40">
          {Math.round(PURIFICATION_CONFIG.durationMs / (60 * 60 * 1000))}h
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 3: PURIFICATION CHAMBER
   ═══════════════════════════════════════════════════════ */
function PurificationChamberTab() {
  const store = useSoulStoneStore();
  const stats = useMemo(() => getPlayerStats(store), [store]);
  const [now, setNow] = useState(Date.now());
  const equippedDivine = store.activeDivineCompanion;

  // Tick every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const purifyingStones = useMemo(
    () => store.stones.filter((s) => s.isPurifying),
    [store.stones],
  );

  const companionsByTier = useMemo(() => {
    const grouped: Record<CompanionTier, DivineCompanion[]> = { 1: [], 2: [], 3: [] };
    DIVINE_COMPANIONS.forEach((c) => grouped[c.tier].push(c));
    return grouped;
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Sun size={18} className="void-text-accent" />
        <h2 className="font-display text-lg uppercase tracking-wider void-text-accent">
          The Dreamer's Resonance Chamber
        </h2>
      </div>

      {/* Active purifications */}
      {purifyingStones.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={12} className="void-text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-wider void-text-accent">
              Active Purifications ({purifyingStones.length})
            </span>
          </div>
          <div className="space-y-2">
            {purifyingStones.map((stone) => (
              <PurificationProgress key={stone.id} stone={stone} now={now} />
            ))}
          </div>
        </div>
      )}

      {/* Equipped divine companion */}
      {equippedDivine && (
        <ActiveCompanionBanner companion={equippedDivine} />
      )}

      {/* Tiers */}
      {([1, 2, 3] as CompanionTier[]).map((tier) => (
        <div key={tier} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${TIER_COLORS[tier].border} ${TIER_COLORS[tier].bg} ${TIER_COLORS[tier].text}`}>
              TIER {tier}
            </span>
            <div className="flex-1 h-px void-bg-sunk" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {companionsByTier[tier].map((companion) => (
              <DivineCompanionCard
                key={companion.id}
                companion={companion}
                canAfford={stats.divineLightFragments >= companion.divineLightCost}
                isEquipped={equippedDivine?.companionId === companion.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ALIGNMENT METER
   ═══════════════════════════════════════════════════════ */
function AlignmentMeter({ label, level, tiers, color, icon: Icon }: {
  label: string;
  level: number;
  tiers: (CorruptionTierEffect | PurityTierEffect)[];
  color: "red" | "amber";
  icon: typeof Flame;
}) {
  const currentTier = useMemo(
    () => tiers.find((t) => level >= t.minLevel && level <= t.maxLevel) || tiers[0],
    [tiers, level],
  );

  const pct = Math.min(level, 100);
  const colorMap = {
    red: {
      text: "void-text-error",
      border: "void-border-error",
      bg: "void-bg-error",
      glow: "shadow-red-500/40",
      barBg: "void-bg-error",
      gradient: "from-red-600 to-red-400",
    },
    amber: {
      text: "void-text-accent",
      border: "void-border",
      bg: "void-bg-sunk",
      glow: "shadow-amber-500/40",
      barBg: "void-bg-sunk",
      gradient: "from-amber-600 to-amber-400",
    },
  };
  const c = colorMap[color];

  return (
    <div className="flex-1 void-elevated rounded-lg p-4 border border-muted/10">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={c.text} />
        <h3 className={`font-display text-sm uppercase tracking-wider ${c.text}`}>
          {label}
        </h3>
      </div>

      {/* Vertical bar */}
      <div className="flex gap-4 mb-4">
        <div className={`w-8 h-40 rounded-full ${c.barBg} overflow-hidden flex flex-col-reverse relative`}>
          <motion.div
            className={`w-full rounded-full bg-gradient-to-t ${c.gradient} shadow-lg ${c.glow}`}
            initial={{ height: 0 }}
            animate={{ height: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex-1">
          <div className={`font-display text-3xl ${c.text} mb-1`}>{level}</div>
          <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40 mb-3">
            / 100
          </div>
          {currentTier && (
            <>
              <div className={`font-display text-xs ${c.text} mb-1`}>{currentTier.name}</div>
              <p className="font-mono text-[9px] text-muted-foreground/60 mb-2 leading-relaxed">
                {currentTier.description}
              </p>
              <ul className="space-y-1">
                {currentTier.effects.map((effect, i) => (
                  <li key={i} className="font-mono text-[9px] text-muted-foreground/50 flex items-start gap-1">
                    <ArrowUp size={9} className={`${c.text} mt-0.5 shrink-0`} />
                    {effect}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 4: ALIGNMENT
   ═══════════════════════════════════════════════════════ */
function AlignmentTab() {
  const store = useSoulStoneStore();
  const alignment = useMemo(() => getAlignmentData(store), [store]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Scale size={18} className="void-text-system" />
        <h2 className="font-display text-lg uppercase tracking-wider void-text-system">
          The Ark's Soul
        </h2>
      </div>

      {/* Dual meters */}
      <div className="flex gap-4 mb-6">
        <AlignmentMeter
          label="Corruption"
          level={alignment.corruptionLevel}
          tiers={CORRUPTION_TIERS}
          color="red"
          icon={Flame}
        />
        <AlignmentMeter
          label="Purity"
          level={alignment.purityLevel}
          tiers={PURITY_TIERS}
          color="amber"
          icon={Sun}
        />
      </div>

      {/* Tension text */}
      <div
        className="p-4 rounded-lg border void-border-system void-bg-system mb-6 text-center"
        data-narrative="breathe"
      >
        <p className="font-mono text-[10px] void-text-system uppercase tracking-wider leading-relaxed">
          Corruption and Purity are independent. Both can rise.
        </p>
      </div>

      {/* Community stats */}
      <div className="void-surface rounded-lg p-4">
        <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Community Alignment
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Skull size={14} className="void-text-error" />
              <span className="font-display text-xl void-text-error">
                {alignment.activeDemonPets}
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">
              Active Demon Pets
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sun size={14} className="void-text-accent" />
              <span className="font-display text-xl void-text-accent">
                {alignment.activeDivineCompanions}
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">
              Active Divine Companions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 5: DISCHORDIAN — The secret third path.
   Neither demon nor divine. Something older.
   ═══════════════════════════════════════════════════════ */
function DischordianTab() {
  const store = useSoulStoneStore();
  const [selected, setSelected] = useState<DischordianCompanion | null>(null);

  const stoneCounts = useMemo(() => {
    const counts = { red: 0, gold: 0, violet: 0 };
    for (const s of store.stones) {
      if (!s.isPurifying) counts[s.state]++;
    }
    return counts;
  }, [store.stones]);

  const canAfford = (comp: DischordianCompanion) =>
    stoneCounts.red >= comp.cost.red &&
    stoneCounts.gold >= comp.cost.gold &&
    stoneCounts.violet >= comp.cost.violet;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <InfinityIcon size={18} className="void-text-system" />
        <h2 className="font-display text-lg uppercase tracking-wider void-text-system">
          The Dischordian Companions
        </h2>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-6">
        Neither demon nor divine — something older. Each requires one of every stone, plus hard-won trust with both patrons.
      </p>

      {/* Companion grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DISCHORDIAN_COMPANIONS.map((comp) => {
          const affordable = canAfford(comp);
          return (
            <button
              key={comp.id}
              type="button"
              onClick={() => setSelected(comp)}
              data-testid={`dischordian-card-${comp.id}`}
              className={`text-left border rounded-lg overflow-hidden transition
                ${affordable
                  ? "void-border-system void-bg-system void-bg-system void-border-system"
                  : "border-muted/20 bg-muted/5 opacity-70 hover:opacity-90"}
              `}
            >
              {/* Portrait */}
              <div className="aspect-square bg-gradient-to-b from-black to-violet-950/40 flex items-center justify-center overflow-hidden">
                {comp.artPath ? (
                  <img
                    src={comp.artPath}
                    alt={comp.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <InfinityIcon size={64} style={{ color: comp.color }} />
                )}
              </div>

              {/* Text block */}
              <div className="p-3 space-y-2">
                <h3 className="font-display text-sm uppercase tracking-wider" style={{ color: comp.color }}>
                  {comp.name}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                  Tier {comp.tier} · Dischordian
                </p>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className={stoneCounts.red    >= comp.cost.red    ? "void-text-error"    : "void-text-error"}>R{comp.cost.red}</span>
                  <span className={stoneCounts.gold   >= comp.cost.gold   ? "void-text-accent"  : "void-text-accent"}>G{comp.cost.gold}</span>
                  <span className={stoneCounts.violet >= comp.cost.violet ? "void-text-system" : "void-text-system"}>V{comp.cost.violet}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 line-clamp-3">
                  {comp.ability.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            data-testid="dischordian-modal"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-[#0a0a18] border-2 void-border-system rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: selected.color }}>
                    {selected.name}
                  </h2>
                  <p className="text-sm uppercase tracking-wider void-text-system">
                    Tier {selected.tier} · Dischordian
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="void-text hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selected.artPath && (
                <div className="flex justify-center my-4">
                  <img
                    src={selected.artPath}
                    alt={selected.name}
                    className="max-h-80 w-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              <div className="space-y-3 text-sm">
                <p className="void-text">{selected.description}</p>
                <div>
                  <span className="void-text uppercase text-xs">Visual: </span>
                  <p className="void-text italic mt-1">{selected.visual}</p>
                </div>
                <div>
                  <span className="void-text uppercase text-xs">Ability: </span>
                  <p className="void-text-energy mt-1">{selected.ability.description}</p>
                </div>
                <div className="flex gap-4 pt-3 border-t void-border-system text-xs">
                  <div>
                    <span className="void-text uppercase">Cost: </span>
                    <span className="void-text-error">{selected.cost.red}R</span>{" "}
                    <span className="void-text-accent">{selected.cost.gold}G</span>{" "}
                    <span className="void-text-system">{selected.cost.violet}V</span>
                  </div>
                  <div>
                    <span className="void-text uppercase">Trust: </span>
                    <span className="void-text-energy">Antiquarian {selected.trustRequirements.antiquarian}</span>
                    {" · "}
                    <span className="void-text-error">Necromancer {selected.trustRequirements.necromancer}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB NAVIGATION
   ═══════════════════════════════════════════════════════ */
const TABS: { id: Tab; label: string; icon: typeof Gem; color: string }[] = [
  { id: "inventory",     label: "INVENTORY",  icon: Gem,          color: "void-text-system" },
  { id: "summoning",     label: "SUMMONING",  icon: Skull,        color: "void-text-error" },
  { id: "purification",  label: "PURIFICATION", icon: Sun,        color: "void-text-accent" },
  { id: "alignment",     label: "ALIGNMENT",  icon: Scale,        color: "void-text-system" },
  { id: "dischordian",   label: "DISCHORDIAN", icon: InfinityIcon, color: "void-text-system" },
];

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function SoulStonesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inventory");

  // Ambient background tinting per tab
  const ambientClass = useMemo(() => {
    switch (activeTab) {
      case "summoning":     return "void-bg-error";
      case "purification":  return "void-bg-sunk";
      case "dischordian":   return "void-bg-system";
      default:              return "";
    }
  }, [activeTab]);

  return (
    <AtmosphereScope roomKey={TAB_ROOMS[activeTab]}>
      <div className={`min-h-screen transition-colors duration-700 ${ambientClass}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-muted/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/">
              <a className="void-btn p-1.5 rounded-md hover:bg-muted/10 transition-colors">
                <ChevronLeft size={18} className="text-muted-foreground/60" />
              </a>
            </Link>
            <div>
              <h1 className="font-display text-xl uppercase tracking-wider void-text-energy">
                The Soul Economy
              </h1>
              <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">
                Corruption &middot; Purification &middot; Alignment
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="max-w-6xl mx-auto px-4 flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider rounded-t-md transition-colors relative
                    ${isActive
                      ? `${tab.color} bg-muted/10`
                      : "text-muted-foreground/40 hover:text-muted-foreground/60 hover:bg-muted/5"
                    }`}
                >
                  <Icon size={12} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="soul-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-current"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "inventory" && <InventoryTab />}
              {activeTab === "summoning" && <SummoningCircleTab />}
              {activeTab === "purification" && <PurificationChamberTab />}
              {activeTab === "alignment" && <AlignmentTab />}
              {activeTab === "dischordian" && <DischordianTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AtmosphereScope>
  );
}
