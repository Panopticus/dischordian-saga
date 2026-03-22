/* ═══════════════════════════════════════════════════════
   SPACE STATION PAGE — Personal Base Management
   Build modules, collect resources, defend against raids.
   Full RPG integration: class, species, talents, civil
   skills, prestige all affect station operations.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Rocket, Plus, ArrowUp, Clock, Shield,
  Zap, Package, Hammer, Lock, Check, ChevronRight,
  ChevronDown, ChevronUp, AlertTriangle, Star, Crown,
  Cpu, Layers, FlaskConical, Sparkles, Eye, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MODULE_CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  production: Package,
  defense: Shield,
  living: Layers,
  research: FlaskConical,
  special: Sparkles,
  prestige: Crown,
};

const MODULE_CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  production: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  defense: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  living: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  research: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  special: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  prestige: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
};

const RESOURCE_ICONS: Record<string, string> = {
  alloy: "⚙️", crystal: "💎", dark_matter: "🌑", void_essence: "🌀",
  biomass: "🧬", dream_tokens: "✨", credits: "💰",
};

export default function SpaceStationPage() {
  const { data: stationData, isLoading, refetch } = trpc.spaceStation.getStation.useQuery();
  const station = stationData?.station;
  const modules = stationData?.modules || [];
  const { data: availableModules } = trpc.spaceStation.getAvailableModules.useQuery();
  const { data: bonuses } = trpc.spaceStation.getStationBonuses.useQuery();
  const createStation = trpc.spaceStation.createStation.useMutation({
    onSuccess: () => { refetch(); toast.success("Space station created!"); },
    onError: (err) => toast.error(err.message),
  });
  const buildModule = trpc.spaceStation.buildModule.useMutation({
    onSuccess: () => { refetch(); toast.success("Module construction started!"); },
    onError: (err) => toast.error(err.message),
  });
  const upgradeModule = trpc.spaceStation.upgradeModule.useMutation({
    onSuccess: () => { refetch(); toast.success("Module upgrade started!"); },
    onError: (err) => toast.error(err.message),
  });
  const completeModule = trpc.spaceStation.completeModule.useMutation({
    onSuccess: () => { refetch(); toast.success("Module completed!"); },
    onError: (err) => toast.error(err.message),
  });
  const collectResources = trpc.spaceStation.collectResources.useMutation({
    onSuccess: (result) => {
      refetch();
      if (result.collected) {
        const total = Object.values(result.collected).reduce((s: number, v) => s + (v as number), 0);
        toast.success(`Collected ${total} resources!`);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBonuses, setShowBonuses] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  // No station yet — creation screen
  if (!stationData || !station) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="border border-primary/30 rounded-xl bg-card/40 p-8">
            <Rocket size={48} className="text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold tracking-wider mb-2">
              DEPLOY YOUR <span className="text-primary">SPACE STATION</span>
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground mb-6">
              Your personal orbital base. Build modules, generate resources,
              and defend against raids. Your class, species, and talents
              determine what you can build and how efficiently.
            </p>
            <input
              type="text"
              placeholder="Station Name (e.g., Nexus Prime)"
              className="w-full bg-zinc-900/50 border border-border/30 rounded-lg px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 mb-4"
              id="station-name-input"
            />
            <Button
              className="w-full bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
              onClick={() => {
                const name = (document.getElementById("station-name-input") as HTMLInputElement)?.value || "My Station";
                createStation.mutate({ stationName: name });
              }}
              disabled={createStation.isPending}
            >
              {createStation.isPending ? "Deploying..." : "Deploy Station"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const resources = (station.storedResources || {}) as Record<string, number>;

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/ark" className="p-1.5 rounded-lg hover:bg-card/40 transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
              <Rocket size={20} className="text-primary" />
              {station.stationName}
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              Tier {station.tier} • Defense: {station.totalDefense}
              {station.shieldUntil && new Date(station.shieldUntil) > new Date() && (
                <span className="text-emerald-400 ml-2">
                  <Shield size={8} className="inline mr-0.5" />
                  Shielded
                </span>
              )}
            </p>
          </div>
          <Button
            size="sm" variant="outline"
            className="text-[10px] h-7 border-primary/30 text-primary"
            onClick={() => collectResources.mutate()}
            disabled={collectResources.isPending}
          >
            {collectResources.isPending ? "..." : "Collect Resources"}
          </Button>
        </div>

        {/* Resources Bar */}
        <div className="border border-border/30 rounded-lg bg-card/30 p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={12} className="text-amber-400" />
            <span className="font-mono text-[9px] font-bold tracking-wider">STORED RESOURCES</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(resources).filter(([, v]) => (v as number) > 0).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5 bg-zinc-800/30 rounded-md px-2 py-1">
                <span className="text-sm">{RESOURCE_ICONS[key] || "📦"}</span>
                <div>
                  <span className="font-mono text-[8px] text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="font-display text-xs font-bold block">{(value as number).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RPG Bonuses Toggle */}
        {bonuses && (
          <div className="border border-border/30 rounded-lg bg-card/30 p-3 mb-4">
            <button
              onClick={() => setShowBonuses(!showBonuses)}
              className="flex items-center gap-2 w-full"
            >
              <Zap size={12} className="text-primary" />
              <span className="font-mono text-[9px] font-bold tracking-wider">RPG BONUSES ACTIVE</span>
              <span className="font-mono text-[8px] text-muted-foreground ml-2">
                {bonuses.sources.length} sources
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
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Build Speed</span>
                      <span className="font-display text-sm font-bold text-emerald-400">
                        x{bonuses.buildSpeedMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Production</span>
                      <span className="font-display text-sm font-bold text-amber-400">
                        x{bonuses.productionMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Defense</span>
                      <span className="font-display text-sm font-bold text-red-400">
                        x{bonuses.defenseMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Cost Reduction</span>
                      <span className="font-display text-sm font-bold text-blue-400">
                        -{(bonuses.costReduction * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Module Slots</span>
                      <span className="font-display text-sm font-bold text-purple-400">
                        +{bonuses.moduleSlotBonus}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Stealth</span>
                      <span className="font-display text-sm font-bold text-indigo-400">
                        +{bonuses.stealthBonus}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {bonuses.sources.map((s: any, i: number) => (
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

        {/* Installed Modules Grid */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-xs font-bold tracking-[0.2em] flex items-center gap-2">
            <Cpu size={14} className="text-primary" />
            INSTALLED MODULES
          </span>
          <Button
            size="sm" variant="outline"
            className="text-[10px] h-7 border-primary/30 text-primary"
            onClick={() => setShowBuildMenu(!showBuildMenu)}
          >
            <Plus size={12} className="mr-1" />
            Build Module
          </Button>
        </div>

        {modules.length === 0 ? (
          <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
            <Cpu size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-mono text-xs text-muted-foreground">
              No modules installed yet. Build your first module to start generating resources!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {modules.map((mod: any, i: number) => {
              const catColors = MODULE_CATEGORY_COLORS[mod.category] || MODULE_CATEGORY_COLORS.production;
              const CatIcon = MODULE_CATEGORY_ICONS[mod.category] || Cpu;
              const isBuilding = mod.status === "building" || mod.status === "upgrading";
              const canComplete = isBuilding && mod.completesAt && new Date(mod.completesAt) <= new Date();

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`border ${catColors.border} ${catColors.bg} rounded-lg p-3`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CatIcon size={14} className={catColors.text} />
                    <span className="font-display text-xs font-bold flex-1">{mod.moduleKey}</span>
                    <span className={`font-mono text-[8px] ${catColors.text}`}>Lv.{mod.level}</span>
                  </div>

                  {isBuilding && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock size={10} className="text-amber-400 animate-pulse" />
                      <span className="font-mono text-[8px] text-amber-400">
                        {mod.status === "upgrading" ? "Upgrading" : "Building"}...
                      </span>
                      {canComplete && (
                        <Button
                          size="sm" variant="outline"
                          className="text-[8px] h-5 px-2 ml-auto border-emerald-500/30 text-emerald-400"
                          onClick={() => completeModule.mutate({ moduleId: mod.id })}
                          disabled={completeModule.isPending}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  )}

                  {mod.status === "active" && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8px] text-emerald-400">
                        <Check size={8} className="inline mr-0.5" />
                        Active
                      </span>
                      <Button
                        size="sm" variant="ghost"
                        className="text-[8px] h-5 px-2 ml-auto text-muted-foreground hover:text-primary"
                        onClick={() => upgradeModule.mutate({ moduleId: mod.id })}
                        disabled={upgradeModule.isPending}
                      >
                        <ArrowUp size={8} className="mr-0.5" />
                        Upgrade
                      </Button>
                    </div>
                  )}
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
              className="border border-primary/30 rounded-xl bg-zinc-950/95 p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-sm font-bold tracking-wider">BUILD MODULE</span>
                <button onClick={() => setShowBuildMenu(false)}>
                  <ChevronUp size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["all", "production", "defense", "living", "research", "special", "prestige"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === "all" ? null : cat)}
                    className={`font-mono text-[8px] px-2 py-1 rounded-md border transition-all ${
                      (cat === "all" && !selectedCategory) || selectedCategory === cat
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/20 bg-card/20 text-muted-foreground hover:border-border/40"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Module list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {(availableModules || [])
                  .filter((m: any) => !selectedCategory || m.category === selectedCategory)
                  .map((mod: any) => {
                    const catColors = MODULE_CATEGORY_COLORS[mod.category] || MODULE_CATEGORY_COLORS.production;
                    const isLocked = mod.requiredLevel && station.tier < mod.requiredLevel;

                    return (
                      <div
                        key={mod.key}
                        className={`border rounded-lg p-3 transition-all ${
                          isLocked
                            ? "border-zinc-800/20 bg-zinc-900/20 opacity-50"
                            : `${catColors.border} ${catColors.bg} hover:ring-1 hover:ring-primary/20`
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{mod.icon}</span>
                          <div className="flex-1">
                            <span className="font-display text-xs font-bold">{mod.name}</span>
                            {mod.requiredClass && (
                              <span className="font-mono text-[7px] text-amber-400 ml-1 capitalize">
                                {mod.requiredClass}
                              </span>
                            )}
                          </div>
                          {isLocked && <Lock size={10} className="text-zinc-600" />}
                        </div>
                        <p className="font-mono text-[8px] text-muted-foreground mb-2">{mod.description}</p>

                        {/* Cost */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(mod.baseCost).map(([res, cost]) => (
                            <span key={res} className="font-mono text-[7px] bg-zinc-800/40 px-1 py-0.5 rounded">
                              {RESOURCE_ICONS[res] || "📦"} {(cost as number).toLocaleString()} {res}
                            </span>
                          ))}
                        </div>

                        {!isLocked && (
                          <Button
                            size="sm" variant="outline"
                            className={`text-[8px] h-5 px-2 w-full ${catColors.border} ${catColors.text}`}
                            onClick={() => {
                              buildModule.mutate({
                                moduleKey: mod.key,
                                gridX: Math.floor(Math.random() * 8),
                                gridY: Math.floor(Math.random() * 8),
                              });
                              setShowBuildMenu(false);
                            }}
                            disabled={buildModule.isPending}
                          >
                            Build
                          </Button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/tower-defense"
            className="border border-red-500/20 bg-red-950/10 rounded-lg p-3 hover:border-red-500/40 transition-all group"
          >
            <Shield size={16} className="text-red-400 mb-1" />
            <span className="font-display text-xs font-bold block">Tower Defense</span>
            <span className="font-mono text-[8px] text-muted-foreground">Defend your station</span>
          </Link>
          <Link
            href="/tower-defense"
            className="border border-amber-500/20 bg-amber-950/10 rounded-lg p-3 hover:border-amber-500/40 transition-all group"
          >
            <Target size={16} className="text-amber-400 mb-1" />
            <span className="font-display text-xs font-bold block">Raid Others</span>
            <span className="font-mono text-[8px] text-muted-foreground">Attack for resources</span>
          </Link>
          <Link
            href="/prestige-quests"
            className="border border-purple-500/20 bg-purple-950/10 rounded-lg p-3 hover:border-purple-500/40 transition-all group"
          >
            <Crown size={16} className="text-purple-400 mb-1" />
            <span className="font-display text-xs font-bold block">Prestige Quests</span>
            <span className="font-mono text-[8px] text-muted-foreground">Unlock prestige classes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
