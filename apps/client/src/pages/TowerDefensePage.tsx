/* ═══════════════════════════════════════════════════════
   THE WARDEN'S VIGIL — Base Defense & Raiding
   Place towers, defend against waves, raid other players.
   Full RPG integration: class, species, talents, civil
   skills, prestige all affect towers and raid units.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/routers";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";

type TowerPlacementRow = inferRouterOutputs<AppRouter>["towerDefense"]["getTowers"][number];
import { Link } from "wouter";
import {
  ChevronLeft, Shield, Plus, ArrowUp, Clock, Zap,
  Target, Lock, Check, ChevronRight, ChevronDown,
  ChevronUp, Star, Crown, Sparkles, Eye, Swords,
  Flame, Crosshair, AlertTriangle, Trophy, Play,
  Calendar, Globe, Building, Hammer, Gift,
  ShieldCheck, Coins, Skull, Square, Heart,
  Rocket, Moon, Orbit, Timer, EyeOff, Cpu, User as UserIcon, Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── element palette ─── */
const TOWER_ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  fire: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ice: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  lightning: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  void: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  nature: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  shadow: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  light: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  earth: { text: "text-stone-400", bg: "bg-stone-500/10", border: "border-stone-500/20" },
  wind: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  physical: { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
};
const NEUTRAL_COLORS = TOWER_ELEMENT_COLORS.physical;

/* ─── icon resolver — matches `icon: string` fields on TOWERS / RAID_UNITS defs ─── */
type IconComponent = React.ComponentType<{ size?: number; className?: string }>;
const ICON_MAP: Record<string, IconComponent> = {
  Zap, Rocket, Square, Heart, Target, Shield, Eye, AlertTriangle, Skull, Flame,
  Orbit, Moon, Timer, EyeOff, User: UserIcon, Cpu, Swords, Truck, Crown, Sparkles,
  Hammer,
};
const getIcon = (name?: string): IconComponent => (name && ICON_MAP[name]) || Crosshair;

/* ─── league formatting ─── */
const LEAGUE_TEXT: Record<string, string> = {
  bronze_1: "text-amber-700", bronze_2: "text-amber-700", bronze_3: "text-amber-700",
  silver_1: "text-zinc-300", silver_2: "text-zinc-300", silver_3: "text-zinc-300",
  gold_1: "text-yellow-400", gold_2: "text-yellow-400", gold_3: "text-yellow-400",
  platinum_1: "text-cyan-300", platinum_2: "text-cyan-300", platinum_3: "text-cyan-300",
  diamond_1: "text-blue-300", diamond_2: "text-blue-300", diamond_3: "text-blue-300",
  champion: "text-purple-400", legend: "text-pink-400",
};
const formatLeague = (k?: string): string =>
  !k ? "Bronze 1" : k.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

const formatCountdown = (target: Date | string | null | undefined): string => {
  if (!target) return "Ready";
  const t = typeof target === "string" ? new Date(target).getTime() : target.getTime();
  const ms = t - Date.now();
  if (ms <= 0) return "Ready";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function TowerDefensePage() {
  const utils = trpc.useUtils();

  /* tick every second so timers refresh */
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  /* ─── QUERIES ─── */
  const { data: stationData } = trpc.spaceStation.getStation.useQuery();
  const station = stationData?.station;
  const stationId = station?.id;
  const stationGridSize = station?.gridSize || 6;

  const { data: towers, isLoading: defLoading, refetch: refetchDef } = trpc.towerDefense.getTowers.useQuery(
    { ownerType: "station" as const, ownerId: stationId! },
    { enabled: !!stationId, refetchInterval: 30_000 },
  );
  const { data: availableTowers } = trpc.towerDefense.getTowerDefs.useQuery();
  const { data: unitDefs } = trpc.towerDefense.getUnitDefs.useQuery();

  const [targetType, setTargetType] = useState<"station" | "world">("station");
  const { data: raidTarget, refetch: refetchTarget } = trpc.towerDefense.findRaidTarget.useQuery({ targetType });

  const { data: combinedHistory } = trpc.towerDefense.getCombinedHistory.useQuery({ limit: 25 });

  // PvE defense wave history
  const { data: defenseWaveHistory, refetch: refetchWaves } = trpc.towerDefense.getDefenseWaves.useQuery(
    { ownerType: "station" as const, ownerId: stationId!, limit: 10 },
    { enabled: !!stationId },
  );
  const lastCompletedWaveNumber = defenseWaveHistory?.[0]?.waveNumber || 0;
  const nextWaveNumber = lastCompletedWaveNumber + 1;

  const { data: stationBonuses } = trpc.spaceStation.getStationBonuses.useQuery();
  const allTraitBonuses = trpc.citizen.getAllTraitBonuses.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const tdBonuses = allTraitBonuses.data?.towerDefense;
  const { data: slotInfo } = trpc.towerDefense.getMaxTowerSlots.useQuery();
  const maxTowers = slotInfo?.maxTowerSlots ?? tdBonuses?.maxTowerSlots ?? 10;
  const maxRaidUnits = slotInfo?.maxRaidUnits ?? tdBonuses?.maxRaidUnits ?? 20;

  /* Trophy + leaderboard + streak */
  const { data: trophies } = trpc.towerDefense.getTrophies.useQuery();
  const { data: leagueThresholds } = trpc.towerDefense.getLeagueThresholds.useQuery();
  const { data: leaderboard } = trpc.towerDefense.getLeaderboard.useQuery({ limit: 10 });
  const { data: streak, refetch: refetchStreak } = trpc.towerDefense.getStreak.useQuery();
  const { data: streakRewards } = trpc.towerDefense.getStreakRewards.useQuery();

  /* ─── MUTATIONS ─── */
  const placeTower = trpc.towerDefense.placeTower.useMutation({
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.error || "Failed to place tower"); return; }
      refetchDef();
      utils.spaceStation.getStation.invalidate();
      toast.success("Tower placed — construction started");
      setSelectedTowerKey(null);
    },
    onError: (err) => toast.error(err.message),
  });
  const upgradeTower = trpc.towerDefense.upgradeTower.useMutation({
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.error || "Failed to upgrade"); return; }
      refetchDef();
      utils.spaceStation.getStation.invalidate();
      toast.success("Upgrade started");
    },
    onError: (err) => toast.error(err.message),
  });
  const completeTower = trpc.towerDefense.completeTower.useMutation({
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.error || "Not yet complete"); return; }
      refetchDef();
      toast.success("Construction complete");
    },
    onError: (err) => toast.error(err.message),
  });
  const launchRaid = trpc.towerDefense.executeRaid.useMutation({
    onSuccess: (res) => {
      refetchDef();
      refetchTarget();
      utils.towerDefense.getCombinedHistory.invalidate();
      utils.towerDefense.getTrophies.invalidate();
      utils.towerDefense.getLeaderboard.invalidate();
      if (!res.success) { toast.error("error" in res ? (res as { error: string }).error : "Raid failed"); return; }
      const lootSummary = Object.entries(res.lootStolen || {})
        .filter(([, v]) => (v as number) > 0)
        .map(([k, v]) => `${v} ${k}`)
        .join(", ");
      if (res.result === "victory") {
        toast.success(`★${res.stars} Victory! +${res.trophyChange} 🏆${lootSummary ? ` · Loot: ${lootSummary}` : ""}`);
      } else {
        toast.error(`Defeat — ${res.destructionPercent}% destruction · ${res.trophyChange} 🏆`);
      }
      setRaidUnits({});
      setSelectedTarget(null);
    },
    onError: (err) => toast.error(err.message),
  });
  const checkIn = trpc.towerDefense.checkIn.useMutation({
    onSuccess: (res) => {
      if (!res.success) { toast.error(("error" in res && res.error) || "Check-in failed"); return; }
      refetchStreak();
      const shards = ("shardsEarned" in res && res.shardsEarned) || res.reward?.chronoShards || 0;
      toast.success(`Day ${res.streak} — +${shards} Chrono Shards!`);
    },
    onError: (err) => toast.error(err.message),
  });
  const runDefenseWave = trpc.towerDefense.runDefenseWave.useMutation({
    onSuccess: (res) => {
      if (!res.success) { toast.error(("error" in res && res.error) || "Wave failed"); return; }
      refetchWaves();
      refetchDef();
      if (res.survived) {
        const reward = Object.entries(res.rewards || {}).map(([k, v]) => `${v} ${k}`).join(", ");
        toast.success(`Wave ${res.waveNumber} survived! ${reward ? `Rewards: ${reward}` : ""}`);
      } else {
        toast.error(`Wave ${res.waveNumber} failed — ${res.towersDestroyed} towers destroyed`);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  /* ─── STATE ─── */
  const [activeTab, setActiveTab] = useState<"defense" | "raid" | "history" | "trophies" | "streak">("defense");
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [selectedTowerKey, setSelectedTowerKey] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showBonuses, setShowBonuses] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [raidUnits, setRaidUnits] = useState<Record<string, number>>({});

  /* ─── DERIVED ─── */
  const towerDefByKey = useMemo(() => {
    const map = new Map<string, NonNullable<typeof availableTowers>[number]>();
    for (const t of availableTowers || []) map.set(t.key, t);
    return map;
  }, [availableTowers]);

  const towerList: TowerPlacementRow[] = towers || [];

  const selectedTowerDef = selectedTowerKey ? towerDefByKey.get(selectedTowerKey) : null;
  const isShielded = !!(station?.shieldUntil && new Date(station.shieldUntil) > new Date());
  const totalRaidUnits = Object.values(raidUnits).reduce((a, b) => a + b, 0);

  const isLoading = defLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/space-station" className="font-mono text-xs text-muted-foreground inline-flex items-center gap-1.5 mb-4">
            <ChevronLeft size={12} /> back
          </Link>
          <div className="border border-border/30 rounded-lg bg-card/30 p-6 text-center">
            <Shield size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-mono text-xs text-muted-foreground">
              You need to build a Space Station before you can deploy tower defenses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalDefense = towerList.reduce((sum, t) => {
    if (t.status === "destroyed") return sum;
    const def = towerDefByKey.get(t.towerKey);
    if (!def) return sum;
    const dmg = def.baseDamage + def.damagePerLevel * (t.level - 1);
    return sum + Math.ceil(dmg * (tdBonuses?.towerDamageMultiplier || 1));
  }, 0);

  /* Build a map of grid-cell → tower for rendering the grid view */
  const occupied = new Map<string, { tower: typeof towerList[number]; def: NonNullable<typeof availableTowers>[number] | undefined }>();
  for (const t of towerList) {
    if (t.status === "destroyed") continue;
    const def = towerDefByKey.get(t.towerKey);
    const [w, h] = def?.gridSize || [1, 1];
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        occupied.set(`${t.gridX + dx},${t.gridY + dy}`, { tower: t, def });
      }
    }
  }

  function tryPlaceAt(cellX: number, cellY: number) {
    if (!selectedTowerDef || !stationId) return;
    placeTower.mutate({
      ownerType: "station",
      ownerId: stationId,
      towerKey: selectedTowerDef.key,
      gridX: cellX,
      gridY: cellY,
    });
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/space-station" className="p-1.5 rounded-lg hover:bg-card/40 transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
              <Shield size={20} className="text-red-400" />
              THE WARDEN'S <span className="text-red-400">VIGIL</span>
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              Total DMG: {totalDefense} • Towers: {towerList.length}/{maxTowers} • {trophies?.trophies ?? 0} 🏆
              {isShielded && (
                <span className="ml-2 text-emerald-400">
                  • <ShieldCheck size={10} className="inline mr-0.5" /> Shielded {formatCountdown(station.shieldUntil)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 border-b border-border/20 pb-2 overflow-x-auto">
          {[
            { key: "defense" as const, label: "DEFENSE", icon: Shield, color: "text-red-400" },
            { key: "raid" as const, label: "RAID", icon: Swords, color: "text-amber-400" },
            { key: "history" as const, label: "HISTORY", icon: Trophy, color: "text-purple-400" },
            { key: "trophies" as const, label: "TROPHIES", icon: Crown, color: "text-yellow-400" },
            { key: "streak" as const, label: "STREAK", icon: Calendar, color: "text-cyan-400" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? `bg-card/40 border border-border/30 ${tab.color}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* RPG Bonuses */}
        {stationBonuses && (
          <div className="border border-border/30 rounded-lg bg-card/30 p-3 mb-4">
            <button
              onClick={() => setShowBonuses(!showBonuses)}
              className="flex items-center gap-2 w-full"
            >
              <Zap size={12} className="text-primary" />
              <span className="font-mono text-[9px] font-bold tracking-wider">RPG COMBAT BONUSES</span>
              <span className="font-mono text-[8px] text-muted-foreground ml-2">
                {stationBonuses.sources.length} sources
              </span>
              <span className="ml-auto">
                {showBonuses ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </span>
            </button>
            <AnimatePresence>
              {showBonuses && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Build Speed</span>
                      <span className="font-display text-sm font-bold text-emerald-400">
                        x{stationBonuses.buildSpeedMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Production</span>
                      <span className="font-display text-sm font-bold text-amber-400">
                        x{stationBonuses.productionMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Defense</span>
                      <span className="font-display text-sm font-bold text-red-400">
                        x{stationBonuses.defenseMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Extra Slots</span>
                      <span className="font-display text-sm font-bold text-purple-400">
                        +{stationBonuses.moduleSlotBonus}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {stationBonuses.sources.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Sparkles size={8} className="text-primary/60" />
                        <span className="font-mono text-[8px] text-muted-foreground">
                          <strong className="text-foreground/70">{s.source}:</strong> {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Character Trait Bonuses */}
        {tdBonuses && tdBonuses.sources.length > 0 && (
          <div className="border border-accent/20 rounded-lg bg-accent/5 p-3 mb-4">
            <h3 className="font-mono text-[9px] font-bold tracking-wider flex items-center gap-2 mb-2">
              <Zap size={12} className="text-accent" />
              CHARACTER TRAIT BONUSES
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {tdBonuses.towerDamageMultiplier > 1 && (
                <div className="bg-red-500/10 rounded-md p-2">
                  <span className="font-mono text-[8px] text-muted-foreground block">Tower DMG</span>
                  <span className="font-display text-sm font-bold text-red-400">+{Math.round((tdBonuses.towerDamageMultiplier - 1) * 100)}%</span>
                </div>
              )}
              {tdBonuses.towerHpMultiplier > 1 && (
                <div className="bg-green-500/10 rounded-md p-2">
                  <span className="font-mono text-[8px] text-muted-foreground block">Tower HP</span>
                  <span className="font-display text-sm font-bold text-green-400">+{Math.round((tdBonuses.towerHpMultiplier - 1) * 100)}%</span>
                </div>
              )}
              {tdBonuses.raidUnitDamageMultiplier > 1 && (
                <div className="bg-amber-500/10 rounded-md p-2">
                  <span className="font-mono text-[8px] text-muted-foreground block">Raid DMG</span>
                  <span className="font-display text-sm font-bold text-amber-400">+{Math.round((tdBonuses.raidUnitDamageMultiplier - 1) * 100)}%</span>
                </div>
              )}
              {tdBonuses.raidLootMultiplier > 1 && (
                <div className="bg-purple-500/10 rounded-md p-2">
                  <span className="font-mono text-[8px] text-muted-foreground block">Raid Loot</span>
                  <span className="font-display text-sm font-bold text-purple-400">x{tdBonuses.raidLootMultiplier.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              {tdBonuses.sources.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Sparkles size={8} className="text-accent/60" />
                  <span className="font-mono text-[8px] text-muted-foreground">
                    <strong className="text-foreground/70">{s.source}:</strong> {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ DEFENSE TAB ═══ */}
        {activeTab === "defense" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xs font-bold tracking-[0.2em] flex items-center gap-2">
                <Shield size={14} className="text-red-400" />
                DEFENSE GRID
              </span>
              <Button
                size="sm" variant="outline"
                className="text-xs h-9 border-red-500/30 text-red-400"
                onClick={() => { setShowBuildMenu(!showBuildMenu); if (showBuildMenu) setSelectedTowerKey(null); }}
                disabled={towerList.filter(t => t.status !== "destroyed").length >= maxTowers}
              >
                <Plus size={12} className="mr-1" />
                {showBuildMenu ? "Close" : "Build Tower"} ({towerList.filter(t => t.status !== "destroyed").length}/{maxTowers})
              </Button>
            </div>

            {selectedTowerDef && (
              <div className="mb-2 p-2 border border-amber-500/40 bg-amber-500/10 rounded-md flex items-center gap-2">
                <Target size={12} className="text-amber-400" />
                <span className="font-mono text-[10px] text-amber-300">
                  Placing <strong>{selectedTowerDef.name}</strong> ({selectedTowerDef.gridSize[0]}×{selectedTowerDef.gridSize[1]}) — click an empty cell
                </span>
                <button
                  className="ml-auto text-[9px] text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedTowerKey(null)}
                >cancel</button>
              </div>
            )}

            {/* Grid view */}
            <div
              className="grid gap-1 mb-4 p-2 border border-border/30 rounded-lg bg-zinc-950/60"
              style={{
                gridTemplateColumns: `repeat(${stationGridSize}, minmax(0, 1fr))`,
                aspectRatio: "1 / 1",
                maxWidth: "420px",
              }}
            >
              {Array.from({ length: stationGridSize * stationGridSize }).map((_, i) => {
                const x = i % stationGridSize;
                const y = Math.floor(i / stationGridSize);
                const slot = occupied.get(`${x},${y}`);
                // Only render the tile for the top-left of multi-cell towers; others get a hover overlay
                const isTopLeft = slot && slot.tower.gridX === x && slot.tower.gridY === y;

                if (slot && !isTopLeft) {
                  // interior cell of a bigger tower — render transparent placeholder
                  return <div key={`${x}-${y}`} className="rounded" />;
                }

                if (slot && isTopLeft && slot.def) {
                  const elem = TOWER_ELEMENT_COLORS[slot.def.element || "physical"] || NEUTRAL_COLORS;
                  const [gw, gh] = slot.def.gridSize;
                  const Icon = getIcon(slot.def.icon);
                  const hpPct = Math.max(0, Math.round((slot.tower.currentHp / Math.max(slot.tower.maxHp, 1)) * 100));
                  const isBusy = slot.tower.status === "building" || slot.tower.status === "upgrading";
                  const isReady = isBusy && slot.tower.completesAt && new Date(slot.tower.completesAt) <= new Date();
                  return (
                    <motion.button
                      key={`${x}-${y}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative border ${elem.border} ${elem.bg} rounded flex flex-col items-center justify-center p-0.5 min-h-0 hover:ring-1 hover:ring-primary/40`}
                      style={{ gridColumn: `span ${gw}`, gridRow: `span ${gh}` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isReady) {
                          completeTower.mutate({ towerId: slot.tower.id });
                        } else if (slot.tower.status === "active") {
                          upgradeTower.mutate({ towerId: slot.tower.id });
                        }
                      }}
                      title={`${slot.def.name} Lv.${slot.tower.level}`}
                    >
                      <Icon size={14} className={elem.text} />
                      <span className={`font-mono text-[7px] ${elem.text}`}>L{slot.tower.level}</span>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
                        <div className="h-full bg-emerald-400" style={{ width: `${hpPct}%` }} />
                      </div>
                      {isBusy && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                          {isReady ? (
                            <Check size={12} className="text-emerald-400" />
                          ) : (
                            <span className="font-mono text-[7px] text-amber-300 flex items-center gap-0.5">
                              <Clock size={8} /> {formatCountdown(slot.tower.completesAt)}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                }

                // Empty cell
                return (
                  <button
                    key={`${x}-${y}`}
                    className={`rounded border border-dashed ${
                      selectedTowerDef ? "border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10" : "border-border/20"
                    } transition-colors`}
                    disabled={!selectedTowerDef || placeTower.isPending}
                    onClick={() => tryPlaceAt(x, y)}
                    title={`(${x},${y})`}
                  />
                );
              })}
            </div>

            {/* Placed towers list (compact) */}
            {towerList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                {towerList.map((tower, i) => {
                  const def = towerDefByKey.get(tower.towerKey);
                  const elem = TOWER_ELEMENT_COLORS[def?.element || "physical"] || NEUTRAL_COLORS;
                  const Icon = getIcon(def?.icon);
                  const dmg = def ? def.baseDamage + def.damagePerLevel * (tower.level - 1) : 0;
                  const busy = tower.status === "building" || tower.status === "upgrading";
                  const ready = busy && tower.completesAt && new Date(tower.completesAt) <= new Date();
                  return (
                    <motion.div
                      key={tower.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border ${elem.border} ${elem.bg} rounded-lg p-2`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={12} className={elem.text} />
                        <span className="font-display text-[11px] font-bold flex-1 truncate">{def?.name || tower.towerKey}</span>
                        <span className={`font-mono text-[8px] ${elem.text}`}>Lv.{tower.level}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mb-1">
                        <div className="bg-zinc-800/20 rounded px-1 py-0.5">
                          <span className="font-mono text-[7px] text-muted-foreground block">DMG</span>
                          <span className="font-mono text-[9px] font-bold">{Math.ceil(dmg * (tdBonuses?.towerDamageMultiplier || 1))}</span>
                        </div>
                        <div className="bg-zinc-800/20 rounded px-1 py-0.5">
                          <span className="font-mono text-[7px] text-muted-foreground block">HP</span>
                          <span className="font-mono text-[9px] font-bold">{tower.currentHp}/{tower.maxHp}</span>
                        </div>
                        <div className="bg-zinc-800/20 rounded px-1 py-0.5">
                          <span className="font-mono text-[7px] text-muted-foreground block">RNG</span>
                          <span className="font-mono text-[9px] font-bold">{(def?.baseRange || 0) + (tdBonuses?.towerRangeBonus || 0)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {busy ? (
                          <>
                            <span className="font-mono text-[8px] text-amber-300 flex items-center gap-0.5">
                              <Clock size={8} /> {formatCountdown(tower.completesAt)}
                            </span>
                            {ready && (
                              <Button
                                size="sm" variant="ghost"
                                className="text-[8px] h-5 px-2 ml-auto text-emerald-400 hover:text-emerald-300"
                                onClick={() => completeTower.mutate({ towerId: tower.id })}
                                disabled={completeTower.isPending}
                              >
                                <Check size={8} className="mr-0.5" /> Complete
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <span className={`font-mono text-[8px] ${elem.text} capitalize`}>{def?.element || "physical"}</span>
                            <Button
                              size="sm" variant="ghost"
                              className="text-[8px] h-5 px-2 ml-auto text-muted-foreground hover:text-primary"
                              onClick={() => upgradeTower.mutate({ towerId: tower.id })}
                              disabled={upgradeTower.isPending || (def && tower.level >= def.maxLevel)}
                            >
                              <ArrowUp size={8} className="mr-0.5" />
                              {def && tower.level >= def.maxLevel ? "Max" : "Upgrade"}
                            </Button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PvE WAVE DEFENSE */}
            <div className="border border-amber-500/30 rounded-lg bg-amber-500/5 p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={12} className="text-amber-400" />
                <span className="font-mono text-[10px] font-bold tracking-wider text-amber-300">PVE WAVE DEFENSE</span>
                <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                  Cleared {lastCompletedWaveNumber} · Next wave {nextWaveNumber}
                </span>
              </div>
              <p className="font-mono text-[9px] text-muted-foreground mb-2">
                Run a simulated wave of enemies against your placed towers. Towers take damage; survivors
                earn credits and alloy scaled to the wave number. Uses your current tower HP — repair
                with upgrades between waves.
              </p>
              <Button
                className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30"
                disabled={runDefenseWave.isPending || towerList.filter(t => t.status === "active").length === 0}
                onClick={() => {
                  if (!stationId) return;
                  runDefenseWave.mutate({ ownerType: "station", ownerId: stationId });
                }}
              >
                {runDefenseWave.isPending ? (
                  <span className="animate-pulse">Simulating...</span>
                ) : (
                  <><Play size={12} className="mr-1" /> Run Wave {nextWaveNumber}</>
                )}
              </Button>

              {defenseWaveHistory && defenseWaveHistory.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="font-mono text-[8px] text-muted-foreground">Recent waves:</div>
                  {defenseWaveHistory.slice(0, 5).map(w => {
                    const won = w.status === "completed";
                    const rewardsStr = Object.entries((w.rewards || {}) as Record<string, number>)
                      .map(([k, v]) => `${v} ${k}`)
                      .join(", ");
                    return (
                      <div key={w.id} className={`flex items-center gap-2 text-[9px] font-mono px-2 py-1 rounded ${
                        won ? "bg-emerald-500/5 text-emerald-400" : "bg-red-500/5 text-red-400"
                      }`}>
                        <span>Wave {w.waveNumber}</span>
                        <span className="opacity-60">· {w.difficultyMultiplier}% diff</span>
                        <span className="flex-1">{won ? "SURVIVED" : "FAILED"}</span>
                        {won && rewardsStr && <span className="text-amber-300">{rewardsStr}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Build Menu */}
            <AnimatePresence>
              {showBuildMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="border border-red-500/30 rounded-xl bg-zinc-950/95 p-4 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-sm font-bold tracking-wider">SELECT TOWER TO BUILD</span>
                    <button onClick={() => setShowBuildMenu(false)}>
                      <ChevronUp size={16} className="text-muted-foreground" />
                    </button>
                  </div>

                  {/* Element filter */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["all", "fire", "ice", "lightning", "void", "nature", "shadow", "light", "earth", "wind"].map(elem => (
                      <button
                        key={elem}
                        onClick={() => setSelectedElement(elem === "all" ? null : elem)}
                        className={`font-mono text-[8px] px-2 py-1 rounded-md border transition-all ${
                          (elem === "all" && !selectedElement) || selectedElement === elem
                            ? "border-red-500/40 bg-red-500/10 text-red-400"
                            : "border-border/20 bg-card/20 text-muted-foreground hover:border-border/40"
                        }`}
                      >
                        {elem.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                    {(availableTowers || [])
                      .filter(t => !selectedElement || t.element === selectedElement)
                      .map(tower => {
                        const elem = TOWER_ELEMENT_COLORS[tower.element || "physical"] || NEUTRAL_COLORS;
                        const Icon = getIcon(tower.icon);
                        const isSelected = selectedTowerKey === tower.key;
                        return (
                          <button
                            key={tower.key}
                            onClick={() => setSelectedTowerKey(isSelected ? null : tower.key)}
                            className={`text-left border ${elem.border} ${elem.bg} rounded-lg p-3 transition-all ${
                              isSelected ? "ring-2 ring-amber-400" : "hover:ring-1 hover:ring-primary/20"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon size={14} className={elem.text} />
                              <div className="flex-1">
                                <span className="font-display text-xs font-bold">{tower.name}</span>
                                {tower.requiredClass && (
                                  <span className="font-mono text-[7px] text-amber-400 ml-1 capitalize">
                                    <Lock size={7} className="inline mr-0.5" />{tower.requiredClass}
                                  </span>
                                )}
                                {tower.requiredPrestige && (
                                  <span className="font-mono text-[7px] text-purple-400 ml-1 capitalize">
                                    <Crown size={7} className="inline mr-0.5" />{tower.requiredPrestige}
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[7px] text-muted-foreground">{tower.gridSize[0]}×{tower.gridSize[1]}</span>
                            </div>
                            <p className="font-mono text-[8px] text-muted-foreground mb-2">{tower.description}</p>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-mono text-[7px] ${elem.text}`}>
                                DMG: {tower.baseDamage} • HP: {tower.baseHp} • RNG: {tower.baseRange}
                              </span>
                            </div>
                            <div className="font-mono text-[7px] text-muted-foreground">
                              Cost: {Object.entries(tower.baseCost).map(([r, v]) => `${v} ${r}`).join(", ")}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                  {selectedTowerDef && (
                    <div className="mt-3 p-2 border border-amber-500/30 bg-amber-500/10 rounded-md text-center">
                      <span className="font-mono text-[9px] text-amber-300">
                        Close this menu and click an empty grid cell to place{" "}
                        <strong>{selectedTowerDef.name}</strong>.
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ═══ RAID TAB ═══ */}
        {activeTab === "raid" && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Swords size={14} className="text-amber-400" />
                <span className="font-display text-xs font-bold tracking-[0.2em]">AVAILABLE TARGETS</span>
              </div>
              <div className="flex items-center gap-1 border border-border/30 rounded-md p-0.5">
                <button
                  onClick={() => { setTargetType("station"); setSelectedTarget(null); }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono transition-colors ${
                    targetType === "station" ? "bg-amber-500/20 text-amber-300" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building size={10} /> STATION
                </button>
                <button
                  onClick={() => { setTargetType("world"); setSelectedTarget(null); }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono transition-colors ${
                    targetType === "world" ? "bg-amber-500/20 text-amber-300" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe size={10} /> WORLD
                </button>
                <button
                  onClick={() => refetchTarget()}
                  className="ml-1 px-2 py-1 text-[9px] font-mono text-muted-foreground hover:text-foreground"
                  title="Find new target"
                >↻</button>
              </div>
            </div>

            {!raidTarget ? (
              <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
                <Target size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-mono text-xs text-muted-foreground">
                  No {targetType === "station" ? "station" : "world"} targets available right now. Check back later!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const target = raidTarget;
                  const isSelected = selectedTarget === target.id;
                  const TargetIcon = target.type === "station" ? Building : Globe;
                  const tierOrLevel = target.type === "station"
                    ? `Tier ${target.tier}`
                    : `Level ${target.level}`;
                  const lootEntries = Object.entries(target.lootAvailable || {}).filter(([, v]) => (v as number) > 0);
                  return (
                    <motion.div
                      key={target.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                        isSelected
                          ? "border-amber-500/30 bg-amber-950/10 ring-1 ring-amber-500/10"
                          : "border-border/30 bg-card/20 hover:border-border/50"
                      }`}
                      onClick={() => setSelectedTarget(isSelected ? null : target.id)}
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800/30 border border-border/20 flex items-center justify-center">
                            <TargetIcon size={18} className="text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <span className="font-display text-sm font-bold">{target.name}</span>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                              <span className="font-mono text-[8px] text-muted-foreground">
                                <Shield size={8} className="inline mr-0.5" />
                                Defense: {target.defense}
                              </span>
                              <span className="font-mono text-[8px] text-muted-foreground">{tierOrLevel}</span>
                              <span className="font-mono text-[8px] text-muted-foreground">
                                {target.towerCount} towers
                              </span>
                              {lootEntries.length > 0 && (
                                <span className="font-mono text-[8px] text-amber-400">
                                  <Coins size={8} className="inline mr-0.5" />
                                  {lootEntries.slice(0, 3).map(([k, v]) => `${v} ${k}`).join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className={`text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`}
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 border-t border-border/10">
                              <div className="mt-3 flex items-center justify-between">
                                <span className="font-mono text-[9px] text-muted-foreground">
                                  SELECT RAID UNITS ({totalRaidUnits}/{maxRaidUnits})
                                </span>
                                <button
                                  className="font-mono text-[8px] text-muted-foreground hover:text-foreground"
                                  onClick={(e) => { e.stopPropagation(); setRaidUnits({}); }}
                                >clear</button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                                {(unitDefs || []).map(unit => {
                                  const UnitIcon = getIcon(unit.icon);
                                  const count = raidUnits[unit.key] || 0;
                                  const locked = unit.requiredClass && allTraitBonuses.data
                                    ? undefined // server enforces; we just don't hide — show req
                                    : undefined;
                                  return (
                                    <div key={unit.key} className="flex items-center gap-2 bg-zinc-800/20 rounded-md px-2 py-1.5 border border-border/10">
                                      <UnitIcon size={12} className="text-amber-400" />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span className="font-mono text-[9px] font-bold truncate">{unit.name}</span>
                                          {unit.requiredClass && (
                                            <span className="font-mono text-[7px] text-amber-400 capitalize">
                                              <Lock size={6} className="inline" />{unit.requiredClass}
                                            </span>
                                          )}
                                        </div>
                                        <span className="font-mono text-[7px] text-muted-foreground">
                                          HP {unit.baseHp} · DMG {unit.baseDamage} · {Object.entries(unit.cost).map(([r, v]) => `${v}${r[0]}`).join(" ")}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          className="w-5 h-5 rounded bg-zinc-700/40 flex items-center justify-center text-xs hover:bg-zinc-600/40"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setRaidUnits(prev => ({ ...prev, [unit.key]: Math.max(0, (prev[unit.key] || 0) - 1) }));
                                          }}
                                        >-</button>
                                        <span className="font-mono text-[10px] w-5 text-center">{count}</span>
                                        <button
                                          className="w-5 h-5 rounded bg-zinc-700/40 flex items-center justify-center text-xs hover:bg-zinc-600/40 disabled:opacity-40"
                                          disabled={locked !== undefined || totalRaidUnits >= maxRaidUnits}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (totalRaidUnits >= maxRaidUnits) return;
                                            setRaidUnits(prev => ({ ...prev, [unit.key]: (prev[unit.key] || 0) + 1 }));
                                          }}
                                        >+</button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <Button
                                className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const units = Object.entries(raidUnits)
                                    .filter(([, c]) => c > 0)
                                    .map(([key, count]) => ({ key, count }));
                                  if (units.length === 0) { toast.error("Select at least one unit!"); return; }
                                  launchRaid.mutate({
                                    defenderType: target.type,
                                    defenderId: target.id,
                                    units,
                                  });
                                }}
                                disabled={launchRaid.isPending || totalRaidUnits === 0}
                              >
                                {launchRaid.isPending ? (
                                  <span className="animate-pulse">Raiding...</span>
                                ) : (
                                  <>
                                    <Swords size={14} className="mr-1" />
                                    LAUNCH RAID
                                  </>
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ═══ HISTORY TAB ═══ */}
        {activeTab === "history" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={14} className="text-purple-400" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">RAID HISTORY</span>
            </div>

            {!combinedHistory || combinedHistory.length === 0 ? (
              <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
                <Trophy size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-mono text-xs text-muted-foreground">
                  No raid history yet. Launch your first raid!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {combinedHistory.map((raid, i) => {
                  const isAttacker = raid.role === "attacker";
                  // Player "won" if: attacker AND result==victory, OR defender AND result==defeat
                  const playerWon = isAttacker ? raid.result === "victory" : raid.result === "defeat";
                  const loot = (raid.lootStolen || {}) as Record<string, number>;
                  const lootEntries = Object.entries(loot).filter(([, v]) => v > 0);
                  return (
                    <motion.div
                      key={`${raid.role}-${raid.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border rounded-lg p-3 ${
                        playerWon
                          ? "border-emerald-500/20 bg-emerald-950/10"
                          : "border-red-500/20 bg-red-950/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          playerWon ? "bg-emerald-500/20" : "bg-red-500/20"
                        }`}>
                          {playerWon ? (
                            <Trophy size={14} className="text-emerald-400" />
                          ) : (
                            <AlertTriangle size={14} className="text-red-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-display text-xs font-bold ${
                              playerWon ? "text-emerald-400" : "text-red-400"
                            }`}>
                              {playerWon ? "VICTORY" : "DEFEAT"}
                            </span>
                            <span className="font-mono text-[8px] text-muted-foreground">
                              {isAttacker ? "Attacked" : "Defended against"} {raid.opponentName}
                            </span>
                            <span className="font-mono text-[8px] text-amber-300">
                              {"★".repeat(raid.stars)}{"☆".repeat(3 - raid.stars)}
                            </span>
                            <span className="font-mono text-[8px] text-muted-foreground">
                              {raid.destructionPercent}%
                            </span>
                            <span className={`font-mono text-[8px] ${raid.trophiesChanged >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {raid.trophiesChanged >= 0 ? "+" : ""}{raid.trophiesChanged} 🏆
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {lootEntries.length > 0 && (
                              <span className="font-mono text-[8px] text-amber-400">
                                <Coins size={8} className="inline mr-0.5" />
                                {lootEntries.map(([k, v]) => `${v} ${k}`).join(", ")}
                              </span>
                            )}
                            {raid.unitsLost > 0 && (
                              <span className="font-mono text-[8px] text-muted-foreground">
                                Lost {raid.unitsLost} units
                              </span>
                            )}
                            <span className="font-mono text-[7px] text-muted-foreground/60">
                              {new Date(raid.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ TROPHIES TAB ═══ */}
        {activeTab === "trophies" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={14} className="text-yellow-400" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">TROPHIES & LEAGUE</span>
            </div>

            {/* Player trophy card */}
            <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <Trophy size={24} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className={`font-display text-lg font-bold ${LEAGUE_TEXT[trophies?.league || "bronze_1"] || "text-muted-foreground"}`}>
                    {formatLeague(trophies?.league)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {trophies?.trophies ?? 0} 🏆 · Season high {trophies?.seasonHigh ?? 0} · All-time {trophies?.allTimeHigh ?? 0}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-zinc-800/30 rounded px-2 py-1">
                  <div className="font-mono text-[8px] text-muted-foreground">TOTAL RAIDS</div>
                  <div className="font-display text-sm font-bold">{trophies?.totalRaids ?? 0}</div>
                </div>
                <div className="bg-zinc-800/30 rounded px-2 py-1">
                  <div className="font-mono text-[8px] text-muted-foreground">WIN STREAK</div>
                  <div className="font-display text-sm font-bold text-emerald-400">{trophies?.winStreak ?? 0}</div>
                </div>
                <div className="bg-zinc-800/30 rounded px-2 py-1">
                  <div className="font-mono text-[8px] text-muted-foreground">BEST STREAK</div>
                  <div className="font-display text-sm font-bold text-amber-400">{trophies?.bestWinStreak ?? 0}</div>
                </div>
                <div className="bg-zinc-800/30 rounded px-2 py-1">
                  <div className="font-mono text-[8px] text-muted-foreground">DEFENSES</div>
                  <div className="font-display text-sm font-bold">{trophies?.totalDefenses ?? 0}</div>
                </div>
              </div>
            </div>

            {/* League ladder */}
            {leagueThresholds && leagueThresholds.length > 0 && (
              <div className="border border-border/30 rounded-lg bg-card/30 p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={12} className="text-yellow-400" />
                  <span className="font-mono text-[10px] font-bold tracking-wider">LEAGUE LADDER</span>
                </div>
                <div className="space-y-1">
                  {leagueThresholds.map(({ league, minTrophies }) => {
                    const current = trophies?.league === league;
                    const achieved = (trophies?.trophies ?? 0) >= minTrophies;
                    return (
                      <div key={league} className={`flex items-center gap-2 px-2 py-1 rounded text-[9px] font-mono ${
                        current ? "bg-yellow-500/10 border border-yellow-500/30" : achieved ? "text-muted-foreground" : "text-muted-foreground/50"
                      }`}>
                        <span className={`flex-1 ${LEAGUE_TEXT[league] || ""}`}>{formatLeague(league)}</span>
                        <span>{minTrophies} 🏆</span>
                        {current && <span className="text-yellow-400">← YOU</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top players */}
            {leaderboard && leaderboard.length > 0 && (
              <div className="border border-border/30 rounded-lg bg-card/30 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={12} className="text-purple-400" />
                  <span className="font-mono text-[10px] font-bold tracking-wider">TOP 10 RAIDERS</span>
                </div>
                <div className="space-y-1">
                  {leaderboard.slice(0, 10).map((row, idx) => (
                    <div key={row.id} className="flex items-center gap-2 px-2 py-1 rounded text-[9px] font-mono hover:bg-zinc-800/20">
                      <span className={`w-4 text-right ${idx < 3 ? "text-yellow-400" : "text-muted-foreground"}`}>
                        #{idx + 1}
                      </span>
                      <span className="flex-1 truncate">{row.userName}</span>
                      <span className={LEAGUE_TEXT[row.league] || "text-muted-foreground"}>{formatLeague(row.league)}</span>
                      <span className="text-yellow-400">{row.trophies} 🏆</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ STREAK TAB ═══ */}
        {activeTab === "streak" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-cyan-400" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">DAILY CHECK-IN</span>
            </div>

            {/* Current streak card */}
            <div className="border border-cyan-500/30 bg-cyan-500/5 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Calendar size={24} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg font-bold text-cyan-400">
                    Day {streak?.currentStreak ?? 0}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    Longest: {streak?.longestStreak ?? 0} · Total check-ins: {streak?.totalCheckIns ?? 0}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-bold text-purple-300">
                    {streak?.chronoShards ?? 0}
                  </div>
                  <div className="font-mono text-[8px] text-muted-foreground">Chrono Shards</div>
                </div>
              </div>

              {(() => {
                const today = new Date().toISOString().slice(0, 10);
                const alreadyCheckedIn = streak?.lastCheckIn === today;
                return (
                  <Button
                    className="w-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30"
                    onClick={() => checkIn.mutate()}
                    disabled={checkIn.isPending || alreadyCheckedIn}
                  >
                    {alreadyCheckedIn ? (
                      <><Check size={14} className="mr-1" /> CHECKED IN TODAY</>
                    ) : checkIn.isPending ? (
                      <span className="animate-pulse">Checking in...</span>
                    ) : (
                      <><Gift size={14} className="mr-1" /> CLAIM TODAY'S REWARD</>
                    )}
                  </Button>
                );
              })()}
            </div>

            {/* Rewards calendar */}
            {streakRewards && streakRewards.length > 0 && (
              <div className="border border-border/30 rounded-lg bg-card/30 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={12} className="text-amber-400" />
                  <span className="font-mono text-[10px] font-bold tracking-wider">STREAK REWARDS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {streakRewards.map(reward => {
                    const achieved = (streak?.currentStreak ?? 0) >= reward.day;
                    const current = (streak?.currentStreak ?? 0) === reward.day;
                    return (
                      <div
                        key={reward.day}
                        className={`rounded-md border p-2 ${
                          current
                            ? "border-cyan-500/40 bg-cyan-500/10"
                            : achieved
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-border/20 bg-card/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[9px] font-bold">Day {reward.day}</span>
                          {achieved && !current && <Check size={10} className="text-emerald-400" />}
                        </div>
                        <div className="font-mono text-[8px] text-purple-300">
                          +{reward.chronoShards} shards
                        </div>
                        <div className="font-mono text-[8px] text-amber-300">
                          +{reward.credits} ₵
                        </div>
                        <div className="font-mono text-[7px] text-muted-foreground mt-0.5 truncate">
                          {reward.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {streak && streak.repairItems > 0 && (
              <div className="mt-3 p-2 border border-amber-500/30 bg-amber-500/5 rounded-md">
                <span className="font-mono text-[9px] text-amber-300">
                  🛠 {streak.repairItems} streak repair{streak.repairItems > 1 ? "s" : ""} available — will auto-use if you miss a day.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
