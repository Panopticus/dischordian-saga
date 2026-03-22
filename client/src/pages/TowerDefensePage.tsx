/* ═══════════════════════════════════════════════════════
   TOWER DEFENSE PAGE — Base Defense & Raiding
   Place towers, defend against waves, raid other players.
   Full RPG integration: class, species, talents, civil
   skills, prestige all affect towers and raid units.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Shield, Plus, ArrowUp, Clock, Zap,
  Target, Lock, Check, ChevronRight, ChevronDown,
  ChevronUp, Star, Crown, Sparkles, Eye, Swords,
  Flame, Crosshair, Layers, AlertTriangle, Trophy,
  Play, Pause, SkipForward
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TOWER_ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  fire: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ice: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  lightning: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  void: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  nature: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  physical: { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
  psychic: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  holy: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  dark: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
};

const UNIT_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  infantry: Swords,
  ranged: Crosshair,
  siege: Target,
  stealth: Eye,
  tank: Shield,
  flying: Sparkles,
};

export default function TowerDefensePage() {
  // We need the user's station to get towers
  const { data: stationData } = trpc.spaceStation.getStation.useQuery();
  const stationId = stationData?.station?.id;
  const { data: towers, isLoading: defLoading, refetch: refetchDef } = trpc.towerDefense.getTowers.useQuery(
    { ownerType: "station" as const, ownerId: stationId! },
    { enabled: !!stationId }
  );
  const { data: availableTowers } = trpc.towerDefense.getTowerDefs.useQuery();
  const { data: raidTarget, refetch: refetchTarget } = trpc.towerDefense.findRaidTarget.useQuery(
    { targetType: "station" as const },
  );
  const [raidHistoryLimit] = useState(20);
  const { data: raidHistory } = trpc.towerDefense.getRaidHistory.useQuery({ limit: raidHistoryLimit });
  const { data: stationBonuses } = trpc.spaceStation.getStationBonuses.useQuery();

  const placeTower = trpc.towerDefense.placeTower.useMutation({
    onSuccess: () => { refetchDef(); toast.success("Tower placed!"); },
    onError: (err) => toast.error(err.message),
  });
  const upgradeTower = trpc.towerDefense.upgradeTower.useMutation({
    onSuccess: () => { refetchDef(); toast.success("Tower upgraded!"); },
    onError: (err) => toast.error(err.message),
  });
  const launchRaid = trpc.towerDefense.executeRaid.useMutation({
    onSuccess: (result: any) => {
      refetchDef();
      refetchTarget();
      if (result.success) {
        toast.success(`Raid ${result.result?.victory ? "successful" : "failed"}! ${result.result?.loot ? "Loot acquired!" : ""}`);
      }
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [activeTab, setActiveTab] = useState<"defense" | "raid" | "history">("defense");
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showBonuses, setShowBonuses] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [raidUnits, setRaidUnits] = useState<Record<string, number>>({});

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

  const towerList = towers || [];
  const maxTowers = 6 + (stationBonuses?.moduleSlotBonus || 0);
  const totalDefense = towerList.reduce((sum: number, t: any) => sum + (t.damage || 0) + (t.hp || 0), 0);

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
              TOWER <span className="text-red-400">DEFENSE</span> & RAIDING
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              Total Defense: {totalDefense} • Towers: {towerList.length}/{maxTowers} •
              Your class, talents, and skills determine available towers and raid units
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 border-b border-border/20 pb-2">
          {[
            { key: "defense" as const, label: "DEFENSE", icon: Shield, color: "text-red-400" },
            { key: "raid" as const, label: "RAID", icon: Swords, color: "text-amber-400" },
            { key: "history" as const, label: "HISTORY", icon: Trophy, color: "text-purple-400" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${
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
                    {stationBonuses.sources.map((s: any, i: number) => (
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

        {/* ═══ DEFENSE TAB ═══ */}
        {activeTab === "defense" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xs font-bold tracking-[0.2em] flex items-center gap-2">
                <Shield size={14} className="text-red-400" />
                PLACED TOWERS
              </span>
              <Button
                size="sm" variant="outline"
                className="text-[10px] h-7 border-red-500/30 text-red-400"
                onClick={() => setShowBuildMenu(!showBuildMenu)}
                disabled={towerList.length >= maxTowers}
              >
                <Plus size={12} className="mr-1" />
                Place Tower ({towerList.length}/{maxTowers})
              </Button>
            </div>

            {towerList.length === 0 ? (
              <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
                <Shield size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-mono text-xs text-muted-foreground">
                  No towers placed. Build towers to defend your station against raids!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {towerList.map((tower: any, i: number) => {
                  const elemColors = TOWER_ELEMENT_COLORS[tower.element] || TOWER_ELEMENT_COLORS.physical;

                  return (
                    <motion.div
                      key={tower.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`border ${elemColors.border} ${elemColors.bg} rounded-lg p-3`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Flame size={14} className={elemColors.text} />
                        <span className="font-display text-xs font-bold flex-1">{tower.towerKey}</span>
                        <span className={`font-mono text-[8px] ${elemColors.text}`}>Lv.{tower.level}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        <div className="bg-zinc-800/20 rounded px-1.5 py-0.5">
                          <span className="font-mono text-[7px] text-muted-foreground block">DMG</span>
                          <span className="font-mono text-[9px] font-bold">{tower.damage}</span>
                        </div>
                        <div className="bg-zinc-800/20 rounded px-1.5 py-0.5">
                          <span className="font-mono text-[7px] text-muted-foreground block">HP</span>
                          <span className="font-mono text-[9px] font-bold">{tower.hp}</span>
                        </div>
                        <div className="bg-zinc-800/20 rounded px-1.5 py-0.5">
                          <span className="font-mono text-[7px] text-muted-foreground block">RNG</span>
                          <span className="font-mono text-[9px] font-bold">{tower.range}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[8px] ${elemColors.text} capitalize`}>
                          {tower.element}
                        </span>
                        <Button
                          size="sm" variant="ghost"
                          className="text-[8px] h-5 px-2 ml-auto text-muted-foreground hover:text-primary"
                          onClick={() => upgradeTower.mutate({ towerId: tower.id })}
                          disabled={upgradeTower.isPending}
                        >
                          <ArrowUp size={8} className="mr-0.5" />
                          Upgrade
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

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
                    <span className="font-display text-sm font-bold tracking-wider">PLACE TOWER</span>
                    <button onClick={() => setShowBuildMenu(false)}>
                      <ChevronUp size={16} className="text-muted-foreground" />
                    </button>
                  </div>

                  {/* Element filter */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["all", "fire", "ice", "lightning", "void", "nature", "physical", "psychic", "holy", "dark"].map(elem => (
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {(availableTowers || [])
                      .filter((t: any) => !selectedElement || t.element === selectedElement)
                      .map((tower: any) => {
                        const elemColors = TOWER_ELEMENT_COLORS[tower.element] || TOWER_ELEMENT_COLORS.physical;

                        return (
                          <div
                            key={tower.key}
                            className={`border ${elemColors.border} ${elemColors.bg} rounded-lg p-3 hover:ring-1 hover:ring-primary/20 transition-all`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">{tower.icon}</span>
                              <div className="flex-1">
                                <span className="font-display text-xs font-bold">{tower.name}</span>
                                {tower.requiredClass && (
                                  <span className="font-mono text-[7px] text-amber-400 ml-1 capitalize">
                                    {tower.requiredClass}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="font-mono text-[8px] text-muted-foreground mb-2">{tower.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`font-mono text-[7px] ${elemColors.text}`}>
                                DMG: {tower.baseDamage} • HP: {tower.baseHp} • RNG: {tower.range}
                              </span>
                            </div>
                            <Button
                              size="sm" variant="outline"
                              className={`text-[8px] h-5 px-2 w-full ${elemColors.border} ${elemColors.text}`}
                              onClick={() => {
                                placeTower.mutate({
                                  ownerType: "station" as const,
                                  ownerId: stationId!,
                                  towerKey: tower.key,
                                  gridX: Math.floor(Math.random() * 8),
                                  gridY: Math.floor(Math.random() * 8),
                                });
                                setShowBuildMenu(false);
                              }}
                              disabled={placeTower.isPending}
                            >
                              Place Tower
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ═══ RAID TAB ═══ */}
        {activeTab === "raid" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Swords size={14} className="text-amber-400" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">AVAILABLE TARGETS</span>
            </div>

            {!raidTarget ? (
              <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
                <Target size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-mono text-xs text-muted-foreground">
                  No raid targets available right now. Check back later!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[raidTarget].map((target: any, i: number) => {
                  const isSelected = selectedTarget === target.id;

                  return (
                    <motion.div
                      key={target.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
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
                            <Target size={18} className="text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <span className="font-display text-sm font-bold">{target.stationName}</span>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="font-mono text-[8px] text-muted-foreground">
                                <Shield size={8} className="inline mr-0.5" />
                                Defense: {target.totalDefense}
                              </span>
                              <span className="font-mono text-[8px] text-muted-foreground">
                                Tier {target.tier}
                              </span>
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
                              <div className="mt-3">
                                <span className="font-mono text-[9px] text-muted-foreground block mb-2">
                                  SELECT RAID UNITS:
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                                  {["infantry", "ranged", "siege", "stealth", "tank"].map(unitType => {
                                    const UnitIcon = UNIT_TYPE_ICONS[unitType] || Swords;
                                    const count = raidUnits[unitType] || 0;

                                    return (
                                      <div key={unitType} className="flex items-center gap-2 bg-zinc-800/20 rounded-md px-2 py-1.5">
                                        <UnitIcon size={12} className="text-amber-400" />
                                        <span className="font-mono text-[8px] capitalize flex-1">{unitType}</span>
                                        <div className="flex items-center gap-1">
                                          <button
                                            className="w-5 h-5 rounded bg-zinc-700/40 flex items-center justify-center text-xs hover:bg-zinc-600/40"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setRaidUnits(prev => ({
                                                ...prev,
                                                [unitType]: Math.max(0, (prev[unitType] || 0) - 1),
                                              }));
                                            }}
                                          >
                                            -
                                          </button>
                                          <span className="font-mono text-[10px] w-4 text-center">{count}</span>
                                          <button
                                            className="w-5 h-5 rounded bg-zinc-700/40 flex items-center justify-center text-xs hover:bg-zinc-600/40"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setRaidUnits(prev => ({
                                                ...prev,
                                                [unitType]: Math.min(10, (prev[unitType] || 0) + 1),
                                              }));
                                            }}
                                          >
                                            +
                                          </button>
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
                                      .filter(([, count]) => count > 0)
                                      .map(([type, count]) => ({ unitType: type, count }));
                                    if (units.length === 0) {
                                      toast.error("Select at least one unit!");
                                      return;
                                    }
                                    launchRaid.mutate({
                                      defenderType: "station" as const,
                                      defenderId: target.id,
                                      units: units.map(u => ({ key: u.unitType, count: u.count })),
                                    });
                                  }}
                                  disabled={launchRaid.isPending}
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
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
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

            {!raidHistory || raidHistory.length === 0 ? (
              <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
                <Trophy size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-mono text-xs text-muted-foreground">
                  No raid history yet. Launch your first raid!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {raidHistory.map((raid: any, i: number) => {
                  const isVictory = raid.result === "victory";
                  const isAttacker = raid.role === "attacker";

                  return (
                    <motion.div
                      key={raid.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border rounded-lg p-3 ${
                        isVictory
                          ? "border-emerald-500/20 bg-emerald-950/10"
                          : "border-red-500/20 bg-red-950/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isVictory ? "bg-emerald-500/20" : "bg-red-500/20"
                        }`}>
                          {isVictory ? (
                            <Trophy size={14} className="text-emerald-400" />
                          ) : (
                            <AlertTriangle size={14} className="text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-display text-xs font-bold ${
                              isVictory ? "text-emerald-400" : "text-red-400"
                            }`}>
                              {isVictory ? "VICTORY" : "DEFEAT"}
                            </span>
                            <span className="font-mono text-[8px] text-muted-foreground">
                              {isAttacker ? "Attacked" : "Defended against"} {raid.opponentName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            {raid.loot && (
                              <span className="font-mono text-[8px] text-amber-400">
                                Loot: {Object.entries(raid.loot).map(([k, v]) => `${v} ${k}`).join(", ")}
                              </span>
                            )}
                            <span className="font-mono text-[7px] text-muted-foreground/60">
                              {new Date(raid.timestamp).toLocaleDateString()}
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
      </div>
    </div>
  );
}
