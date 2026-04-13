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
  violet: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", glow: "shadow-purple-500/20", art: SOUL_STONE_ART.violet },
  red:    { text: "text-red-400",    border: "border-red-500/30",    bg: "bg-red-500/10",    glow: "shadow-red-500/20",    art: SOUL_STONE_ART.red },
  gold:   { text: "text-amber-400",  border: "border-amber-500/30",  bg: "bg-amber-500/10",  glow: "shadow-amber-500/20",  art: SOUL_STONE_ART.gold },
};

/* ─── TIER BADGE COLORS ─── */
const TIER_COLORS: Record<CompanionTier, { text: string; border: string; bg: string }> = {
  1: { text: "text-cyan-400",   border: "border-cyan-500/30",   bg: "bg-cyan-500/10" },
  2: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  3: { text: "text-amber-400",  border: "border-amber-500/30",  bg: "bg-amber-500/10" },
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
  const borderColor = isDemon ? "border-red-500/40" : "border-amber-500/40";
  const bgColor = isDemon ? "bg-red-500/5" : "bg-amber-500/5";
  const textColor = isDemon ? "text-red-400" : "text-amber-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border ${borderColor} ${bgColor} mb-4 flex items-center gap-3`}
      data-narrative="breathe"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDemon ? "bg-red-500/20" : "bg-amber-500/20"}`}>
        {isDemon ? <Skull size={16} className="text-red-400" /> : <Sun size={16} className="text-amber-400" />}
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
    { label: "TOTAL STONES",     value: stats.totalStones,       color: "text-purple-400" },
    { label: "CORRUPTION PTS",   value: stats.corruptionPoints,  color: "text-red-400" },
    { label: "DIVINE LIGHT",     value: stats.divineLightFragments, color: "text-amber-400" },
    { label: "WEEKLY CAP",       value: `${stats.weeklyCollected}/15`, color: "text-cyan-400" },
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
          <span className="font-mono text-[8px] text-amber-400 flex items-center gap-1">
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
            className="void-btn flex-1 text-[9px] font-mono uppercase tracking-wider py-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Flame size={10} className="inline mr-1" />
            CORRUPT
          </button>
          <button
            onClick={handlePurify}
            className="void-btn flex-1 text-[9px] font-mono uppercase tracking-wider py-1.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
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
        <Gem size={16} className="text-purple-400" />
        <h2 className="font-display text-lg uppercase tracking-wider text-purple-400">
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
      className={`void-elevated rounded-lg p-4 border ${isEquipped ? "border-red-500/60 shadow-lg shadow-red-500/20" : "border-red-500/20"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm text-red-400">{pet.name}</h3>
        <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${tierColor.border} ${tierColor.bg} ${tierColor.text}`}>
          TIER {pet.tier}
        </span>
      </div>

      <div className="font-mono text-[9px] text-muted-foreground/50 mb-2">
        <span className="uppercase tracking-wider">PATRON</span>{" "}
        <span className="text-red-400/80">{pet.patron}</span>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground/70 mb-2 leading-relaxed">
        {pet.ability.description}
      </p>

      <p className="font-mono text-[9px] text-red-400/70 mb-3 leading-relaxed">
        <AlertTriangle size={10} className="inline mr-1" />
        {pet.drawback.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/50">
          <Flame size={10} className="inline mr-1 text-red-400" />
          {pet.corruptionCost} CP
        </span>

        {isEquipped ? (
          <button
            onClick={handleDismiss}
            className="void-btn text-[9px] font-mono uppercase tracking-wider py-1.5 px-3 rounded border border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
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
                ? "border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25"
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
        <Skull size={18} className="text-red-400" />
        <h2 className="font-display text-lg uppercase tracking-wider text-red-400">
          The Castle of Death — Summoning Circle
        </h2>
      </div>

      {/* Necromancer quote */}
      <div
        className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 mb-6"
        data-narrative="breathe"
      >
        <p className="font-mono text-[10px] text-red-400/80 italic leading-relaxed">
          "Every soul has a price, and every demon demands payment in kind.
          Choose your servant wisely — their hunger never sleeps."
        </p>
        <span className="font-mono text-[8px] uppercase tracking-wider text-red-400/40 mt-1 block">
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
            <div className="flex-1 h-px bg-red-500/10" />
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
      className={`void-elevated rounded-lg p-4 border ${isEquipped ? "border-amber-500/60 shadow-lg shadow-amber-500/20" : "border-amber-500/20"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm text-amber-400">{companion.name}</h3>
        <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${tierColor.border} ${tierColor.bg} ${tierColor.text}`}>
          TIER {companion.tier}
        </span>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground/70 mb-2 leading-relaxed">
        {companion.ability.description}
      </p>

      <span className="inline-block font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-3">
        <Check size={8} className="inline mr-0.5" />
        NO DRAWBACK
      </span>

      {/* Antiquarian quote */}
      <div className="p-2 rounded border border-emerald-500/10 bg-emerald-500/5 mb-3">
        <p className="font-mono text-[9px] text-emerald-400/60 italic leading-relaxed">
          "{companion.antiquarianEntry}"
        </p>
        <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-400/30 mt-0.5 block">
          — The Antiquarian
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/50">
          <Sun size={10} className="inline mr-1 text-amber-400" />
          {companion.divineLightCost} DL
        </span>

        {isEquipped ? (
          <button
            onClick={handleDismiss}
            className="void-btn text-[9px] font-mono uppercase tracking-wider py-1.5 px-3 rounded border border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
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
                ? "border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
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
      className="void-elevated rounded-lg p-3 border border-amber-500/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gem size={12} className="text-purple-400" />
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
            Stone from {stone.source}
          </span>
        </div>
        <span className={`font-mono text-[9px] ${isComplete ? "text-amber-400" : "text-muted-foreground/50"}`}>
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
        <Sun size={18} className="text-amber-400" />
        <h2 className="font-display text-lg uppercase tracking-wider text-amber-400">
          The Dreamer's Resonance Chamber
        </h2>
      </div>

      {/* Active purifications */}
      {purifyingStones.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={12} className="text-amber-400/60" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400/60">
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
            <div className="flex-1 h-px bg-amber-500/10" />
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
      text: "text-red-400",
      border: "border-red-500/30",
      bg: "bg-red-500",
      glow: "shadow-red-500/40",
      barBg: "bg-red-500/20",
      gradient: "from-red-600 to-red-400",
    },
    amber: {
      text: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500",
      glow: "shadow-amber-500/40",
      barBg: "bg-amber-500/20",
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
        <Scale size={18} className="text-purple-400" />
        <h2 className="font-display text-lg uppercase tracking-wider text-purple-400">
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
        className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5 mb-6 text-center"
        data-narrative="breathe"
      >
        <p className="font-mono text-[10px] text-purple-400/80 uppercase tracking-wider leading-relaxed">
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
              <Skull size={14} className="text-red-400" />
              <span className="font-display text-xl text-red-400">
                {alignment.activeDemonPets}
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">
              Active Demon Pets
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sun size={14} className="text-amber-400" />
              <span className="font-display text-xl text-amber-400">
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
        <InfinityIcon size={18} className="text-violet-400" />
        <h2 className="font-display text-lg uppercase tracking-wider text-violet-400">
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
                  ? "border-violet-500/40 bg-violet-950/10 hover:bg-violet-900/20 hover:border-violet-400"
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
                  <span className={stoneCounts.red    >= comp.cost.red    ? "text-red-400"    : "text-red-900"}>R{comp.cost.red}</span>
                  <span className={stoneCounts.gold   >= comp.cost.gold   ? "text-amber-400"  : "text-amber-900"}>G{comp.cost.gold}</span>
                  <span className={stoneCounts.violet >= comp.cost.violet ? "text-purple-400" : "text-purple-900"}>V{comp.cost.violet}</span>
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
              className="max-w-2xl w-full bg-[#0a0a18] border-2 border-violet-500/40 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: selected.color }}>
                    {selected.name}
                  </h2>
                  <p className="text-sm uppercase tracking-wider text-violet-400/70">
                    Tier {selected.tier} · Dischordian
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">
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
                <p className="text-gray-300">{selected.description}</p>
                <div>
                  <span className="text-gray-500 uppercase text-xs">Visual: </span>
                  <p className="text-gray-400 italic mt-1">{selected.visual}</p>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-xs">Ability: </span>
                  <p className="text-green-400 mt-1">{selected.ability.description}</p>
                </div>
                <div className="flex gap-4 pt-3 border-t border-violet-500/20 text-xs">
                  <div>
                    <span className="text-gray-500 uppercase">Cost: </span>
                    <span className="text-red-400">{selected.cost.red}R</span>{" "}
                    <span className="text-amber-400">{selected.cost.gold}G</span>{" "}
                    <span className="text-purple-400">{selected.cost.violet}V</span>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase">Trust: </span>
                    <span className="text-cyan-400">Antiquarian {selected.trustRequirements.antiquarian}</span>
                    {" · "}
                    <span className="text-red-400">Necromancer {selected.trustRequirements.necromancer}</span>
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
  { id: "inventory",     label: "INVENTORY",  icon: Gem,          color: "text-purple-400" },
  { id: "summoning",     label: "SUMMONING",  icon: Skull,        color: "text-red-400" },
  { id: "purification",  label: "PURIFICATION", icon: Sun,        color: "text-amber-400" },
  { id: "alignment",     label: "ALIGNMENT",  icon: Scale,        color: "text-purple-400" },
  { id: "dischordian",   label: "DISCHORDIAN", icon: InfinityIcon, color: "text-violet-400" },
];

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function SoulStonesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inventory");

  // Ambient background tinting per tab
  const ambientClass = useMemo(() => {
    switch (activeTab) {
      case "summoning":     return "bg-red-950/10";
      case "purification":  return "bg-amber-950/10";
      case "dischordian":   return "bg-violet-950/10";
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
              <h1 className="font-display text-xl uppercase tracking-wider text-cyan-400">
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
