/* ═══════════════════════════════════════════════════════
   SYNDICATE WORLD PAGE — Guild Capital Management
   Build structures, generate guild resources, defend
   against rival syndicates. RPG stats affect everything.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Castle, Plus, ArrowUp, Clock, Shield,
  Zap, Package, Hammer, Lock, Check, ChevronRight,
  ChevronDown, ChevronUp, Star, Crown, Sparkles,
  Users, Swords, Target, Eye, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BUILDING_CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  resource: Package,
  defense: Shield,
  utility: Layers,
  military: Swords,
  research: Eye,
  prestige: Crown,
};

const BUILDING_CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  resource: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  defense: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  utility: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  military: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  research: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  prestige: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
};

const RESOURCE_ICONS: Record<string, string> = {
  alloy: "⚙️", crystal: "💎", dark_matter: "🌑", void_essence: "🌀",
  biomass: "🧬", dream_tokens: "✨", credits: "💰",
};

const BIOME_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  forge_world: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  shadow_realm: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  crystal_spire: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  void_nexus: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  eden_prime: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export default function SyndicateWorldPage() {
  // We need the user's guild membership to get the world
  const { data: guildMembership } = trpc.guild.myGuild.useQuery();
  const guildId = guildMembership?.guild?.id;
  const { data: worldData, isLoading, refetch } = trpc.syndicateWorld.getWorld.useQuery(
    { guildId: guildId! },
    { enabled: !!guildId }
  );
  const { data: availableBuildings } = trpc.syndicateWorld.getAvailableBuildings.useQuery();
  const { data: bonuses } = trpc.syndicateWorld.getCapitalBonuses.useQuery();
  const createWorld = trpc.syndicateWorld.createWorld.useMutation({
    onSuccess: () => { refetch(); toast.success("Syndicate world established!"); },
    onError: (err) => toast.error(err.message),
  });
  const buildStructure = trpc.syndicateWorld.buildStructure.useMutation({
    onSuccess: () => { refetch(); toast.success("Construction started!"); },
    onError: (err) => toast.error(err.message),
  });
  const upgradeBuilding = trpc.syndicateWorld.upgradeBuilding.useMutation({
    onSuccess: () => { refetch(); toast.success("Upgrade started!"); },
    onError: (err) => toast.error(err.message),
  });
  const completeBuilding = trpc.syndicateWorld.completeBuilding.useMutation({
    onSuccess: () => { refetch(); toast.success("Building completed!"); },
    onError: (err) => toast.error(err.message),
  });
  const collectResources = trpc.syndicateWorld.collectResources.useMutation({
    onSuccess: (result) => {
      refetch();
      if (result.collected) {
        const total = Object.values(result.collected).reduce((s: number, v) => s + (v as number), 0);
        toast.success(`Collected ${total} resources for the syndicate!`);
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

  // No world yet — need guild first
  if (!worldData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="border border-amber-500/30 rounded-xl bg-card/40 p-8">
            <Castle size={48} className="text-amber-400 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold tracking-wider mb-2">
              SYNDICATE <span className="text-amber-400">HOMEWORLD</span>
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground mb-6">
              Your guild's capital world. Build structures, generate resources,
              and defend against rival syndicates. Join or create a guild first.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/guild">
                <Button variant="outline" className="border-amber-500/30 text-amber-400">
                  <Users size={14} className="mr-1" />
                  Go to Guild
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const world = worldData.world;
  const buildings = worldData.buildings || [];
  const resources = (world.storedResources || {}) as Record<string, number>;
  const biomeColors = BIOME_COLORS[world.biome] || BIOME_COLORS.forge_world;

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/guild" className="p-1.5 rounded-lg hover:bg-card/40 transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
              <Castle size={20} className={biomeColors.text} />
              {world.worldName}
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              Level {world.level} • <span className={biomeColors.text}>{world.biome.replace(/_/g, " ")}</span> •
              Defense: {world.totalDefense}
              {world.shieldUntil && new Date(world.shieldUntil) > new Date() && (
                <span className="text-emerald-400 ml-2">
                  <Shield size={8} className="inline mr-0.5" />
                  Shielded
                </span>
              )}
            </p>
          </div>
          <Button
            size="sm" variant="outline"
            className={`text-[10px] h-7 ${biomeColors.border} ${biomeColors.text}`}
            onClick={() => collectResources.mutate({ worldId: world.id })}
            disabled={collectResources.isPending}
          >
            {collectResources.isPending ? "..." : "Collect Resources"}
          </Button>
        </div>

        {/* Resources Bar */}
        <div className={`border ${biomeColors.border} rounded-lg ${biomeColors.bg} p-3 mb-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Package size={12} className={biomeColors.text} />
            <span className="font-mono text-[9px] font-bold tracking-wider">CAPITAL RESOURCES</span>
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

        {/* RPG Bonuses */}
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
                      <span className="font-mono text-[8px] text-muted-foreground block">Resources</span>
                      <span className="font-display text-sm font-bold text-amber-400">
                        x{bonuses.resourceMultiplier.toFixed(2)}
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
                      <span className="font-mono text-[8px] text-muted-foreground block">Max Buildings</span>
                      <span className="font-display text-sm font-bold text-purple-400">
                        +{bonuses.maxBuildingBonus}
                      </span>
                    </div>
                    <div className="bg-zinc-800/20 rounded-md p-2">
                      <span className="font-mono text-[8px] text-muted-foreground block">Raid Troops</span>
                      <span className="font-display text-sm font-bold text-orange-400">
                        +{bonuses.raidTroopBonus}
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

        {/* Buildings Grid */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-xs font-bold tracking-[0.2em] flex items-center gap-2">
            <Castle size={14} className={biomeColors.text} />
            CAPITAL STRUCTURES
          </span>
          <Button
            size="sm" variant="outline"
            className={`text-[10px] h-7 ${biomeColors.border} ${biomeColors.text}`}
            onClick={() => setShowBuildMenu(!showBuildMenu)}
          >
            <Plus size={12} className="mr-1" />
            Build
          </Button>
        </div>

        {buildings.length === 0 ? (
          <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
            <Castle size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-mono text-xs text-muted-foreground">
              No structures built yet. Construct your first building to start generating resources!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {buildings.map((bld: any, i: number) => {
              const catColors = BUILDING_CATEGORY_COLORS[bld.category] || BUILDING_CATEGORY_COLORS.resource;
              const CatIcon = BUILDING_CATEGORY_ICONS[bld.category] || Package;
              const isBuilding = bld.status === "building" || bld.status === "upgrading";
              const canComplete = isBuilding && bld.completesAt && new Date(bld.completesAt) <= new Date();

              return (
                <motion.div
                  key={bld.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`border ${catColors.border} ${catColors.bg} rounded-lg p-3`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CatIcon size={14} className={catColors.text} />
                    <span className="font-display text-xs font-bold flex-1">{bld.buildingKey}</span>
                    <span className={`font-mono text-[8px] ${catColors.text}`}>Lv.{bld.level}</span>
                  </div>

                  {isBuilding && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock size={10} className="text-amber-400 animate-pulse" />
                      <span className="font-mono text-[8px] text-amber-400">
                        {bld.status === "upgrading" ? "Upgrading" : "Building"}...
                      </span>
                      {canComplete && (
                        <Button
                          size="sm" variant="outline"
                          className="text-[8px] h-5 px-2 ml-auto border-emerald-500/30 text-emerald-400"
                          onClick={() => completeBuilding.mutate({ buildingId: bld.id })}
                          disabled={completeBuilding.isPending}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  )}

                  {bld.status === "active" && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8px] text-emerald-400">
                        <Check size={8} className="inline mr-0.5" />
                        Active
                      </span>
                      <Button
                        size="sm" variant="ghost"
                        className="text-[8px] h-5 px-2 ml-auto text-muted-foreground hover:text-primary"
                        onClick={() => upgradeBuilding.mutate({ buildingId: bld.id })}
                        disabled={upgradeBuilding.isPending}
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
              className={`border ${biomeColors.border} rounded-xl bg-zinc-950/95 p-4 mb-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-sm font-bold tracking-wider">BUILD STRUCTURE</span>
                <button onClick={() => setShowBuildMenu(false)}>
                  <ChevronUp size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["all", "resource", "defense", "utility", "military", "research", "prestige"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === "all" ? null : cat)}
                    className={`font-mono text-[8px] px-2 py-1 rounded-md border transition-all ${
                      (cat === "all" && !selectedCategory) || selectedCategory === cat
                        ? `${biomeColors.border} ${biomeColors.bg} ${biomeColors.text}`
                        : "border-border/20 bg-card/20 text-muted-foreground hover:border-border/40"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Building list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {(availableBuildings || [])
                  .filter((b: any) => !selectedCategory || b.category === selectedCategory)
                  .map((bld: any) => {
                    const catColors = BUILDING_CATEGORY_COLORS[bld.category] || BUILDING_CATEGORY_COLORS.resource;

                    return (
                      <div
                        key={bld.key}
                        className={`border ${catColors.border} ${catColors.bg} rounded-lg p-3 hover:ring-1 hover:ring-primary/20 transition-all`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{bld.icon}</span>
                          <div className="flex-1">
                            <span className="font-display text-xs font-bold">{bld.name}</span>
                            {bld.requiredClass && (
                              <span className="font-mono text-[7px] text-amber-400 ml-1 capitalize">
                                {bld.requiredClass}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="font-mono text-[8px] text-muted-foreground mb-2">{bld.description}</p>

                        {/* Cost */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(bld.baseCost).map(([res, cost]) => (
                            <span key={res} className="font-mono text-[7px] bg-zinc-800/40 px-1 py-0.5 rounded">
                              {RESOURCE_ICONS[res] || "📦"} {(cost as number).toLocaleString()} {res}
                            </span>
                          ))}
                        </div>

                        <Button
                          size="sm" variant="outline"
                          className={`text-[8px] h-5 px-2 w-full ${catColors.border} ${catColors.text}`}
                          onClick={() => {
                            buildStructure.mutate({
                              worldId: world.id,
                              buildingKey: bld.key,
                              gridX: Math.floor(Math.random() * 10),
                              gridY: Math.floor(Math.random() * 10),
                            });
                            setShowBuildMenu(false);
                          }}
                          disabled={buildStructure.isPending}
                        >
                          Build
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <Link
            href="/tower-defense"
            className="border border-red-500/20 bg-red-950/10 rounded-lg p-3 hover:border-red-500/40 transition-all"
          >
            <Shield size={16} className="text-red-400 mb-1" />
            <span className="font-display text-xs font-bold block">Warden's Vigil</span>
            <span className="font-mono text-[8px] text-muted-foreground">Defend the capital</span>
          </Link>
          <Link
            href="/guild-wars"
            className="border border-orange-500/20 bg-orange-950/10 rounded-lg p-3 hover:border-orange-500/40 transition-all"
          >
            <Swords size={16} className="text-orange-400 mb-1" />
            <span className="font-display text-xs font-bold block">Guild Wars</span>
            <span className="font-mono text-[8px] text-muted-foreground">Syndicate conflicts</span>
          </Link>
          <Link
            href="/space-station"
            className="border border-primary/20 bg-primary/5 rounded-lg p-3 hover:border-primary/40 transition-all"
          >
            <Star size={16} className="text-primary mb-1" />
            <span className="font-display text-xs font-bold block">My Station</span>
            <span className="font-mono text-[8px] text-muted-foreground">Personal base</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
