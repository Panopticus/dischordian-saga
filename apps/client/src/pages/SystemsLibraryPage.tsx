/* ═══════════════════════════════════════════════════════
   SYSTEMS LIBRARY PAGE

   Consolidated browser for 14 game systems that otherwise
   lacked dedicated pages. Each system renders as a card
   showing its content catalog:

     • Mini-games (hacking, signal-decryption, star-chart)
     • Meta puzzle (8-room master puzzle)
     • Quiz spectator (betting system)
     • Adventure features (hotspots, inventory combos)
     • Story puzzles (narrative-gated)
     • Persistent world (Mythic+, keystone affixes, live events)
     • Guild hall + Guild wonders
     • Epoch pass
     • Monetization (Dream packs, Ark Commander)
     • Quarter visitors
     • Progression systems (NPC days, ark restorations, limit breaks)

   This is a designer/power-user view — surfaces content that
   exists in code so players/devs can explore it.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Library, Gamepad2, Puzzle, Eye, Map, Castle, BookOpen, Sparkles, ShoppingBag, Users as UsersIcon, TrendingUp, Zap } from "lucide-react";
import { HACKING_MINIGAME, SIGNAL_DECRYPTION_MINIGAME, STAR_CHART_MINIGAME } from "@/game/miniGames";
import { META_SOLUTION, ROOM_PUZZLE_ANSWERS } from "@/game/metaPuzzle";
import { MIN_BET, MAX_BET, MAX_BETS_PER_GAME } from "@/game/quizSpectator";
import { INVENTORY_COMBINATIONS, ADVENTURE_HOTSPOTS, ROOM_STATE_CHANGES } from "@/game/adventureFeatures";
import { STORY_PUZZLES } from "@/game/storyPuzzles";
import { KEYSTONE_AFFIXES, EXTRACTION_POINTS, LIVE_EVENTS } from "@/game/persistentWorld";
import { EPOCH_SEASONS } from "@shared/epochPass";
import { HALL_TIERS, HALL_ROOMS, GUILD_DECORATIONS } from "@shared/guildHall";
import { GUILD_WONDERS } from "@shared/guildWonders";
import { DREAM_PACKS } from "@shared/monetization";
import { NPC_SPECIAL_DAYS, ARK_RESTORATIONS, LIMIT_BREAKS } from "@/game/progressionSystems";

interface SystemCard {
  id: string;
  icon: any;
  color: string;
  category: "games" | "narrative" | "guilds" | "economy" | "progression";
  title: string;
  description: string;
  stats: { label: string; value: string | number }[];
  preview?: string[];
}

export default function SystemsLibraryPage() {
  const [filter, setFilter] = useState<"all" | "games" | "narrative" | "guilds" | "economy" | "progression">("all");

  const systems = useMemo<SystemCard[]>(() => [
    {
      id: "minigames", icon: Gamepad2, color: "void-text-energy", category: "games",
      title: "Minigames Collection",
      description: "Three self-contained puzzle games within the Saga: hacking, signal decryption, and starchart navigation.",
      stats: [
        { label: "Minigames", value: 3 },
        { label: "Hacking difficulties", value: HACKING_MINIGAME.difficulties.length },
        { label: "Signal difficulties", value: SIGNAL_DECRYPTION_MINIGAME.difficulties.length },
        { label: "Starchart difficulties", value: STAR_CHART_MINIGAME.difficulties.length },
      ],
      preview: [HACKING_MINIGAME.name, SIGNAL_DECRYPTION_MINIGAME.name, STAR_CHART_MINIGAME.name],
    },
    {
      id: "metapuzzle", icon: Puzzle, color: "void-text-system", category: "narrative",
      title: "The Meta Puzzle",
      description: "Eight room-based puzzles combine into ONE meta-answer. Players who solve all 8 unlock the legendary title.",
      stats: [
        { label: "Room puzzles", value: Object.keys(ROOM_PUZZLE_ANSWERS).length },
        { label: "Meta solution length", value: `${META_SOLUTION.length} chars` },
      ],
      preview: [`Meta: "${META_SOLUTION}"`],
    },
    {
      id: "quizspectator", icon: Eye, color: "void-text-accent", category: "games",
      title: "Quiz Spectator Betting",
      description: "Watch live quiz games. Bet Dream tokens on outcomes. Three bets max per game.",
      stats: [
        { label: "Min bet (Dream)", value: MIN_BET },
        { label: "Max bet (Dream)", value: MAX_BET },
        { label: "Bets per game", value: MAX_BETS_PER_GAME },
      ],
    },
    {
      id: "adventure", icon: Map, color: "void-text-energy", category: "narrative",
      title: "Adventure Features",
      description: "Point-and-click mechanics: inventory combos, room state changes, interactive hotspots.",
      stats: [
        { label: "Inventory combos", value: INVENTORY_COMBINATIONS.length },
        { label: "Hotspots", value: ADVENTURE_HOTSPOTS.length },
        { label: "State changes", value: ROOM_STATE_CHANGES.length },
      ],
      preview: ADVENTURE_HOTSPOTS.slice(0, 3).map(h => h.name ?? h.id),
    },
    {
      id: "storypuzzles", icon: BookOpen, color: "void-text-energy", category: "narrative",
      title: "Story Puzzles",
      description: "Narrative-gated puzzles. Trust level and chapter progression unlock them.",
      stats: [
        { label: "Story puzzles", value: STORY_PUZZLES.length },
      ],
      preview: STORY_PUZZLES.slice(0, 3).map(p => p.name ?? p.id),
    },
    {
      id: "persistent", icon: Sparkles, color: "void-text-system", category: "games",
      title: "Persistent World (Mythic+)",
      description: "Keystone affixes, extraction points, live events — MMO-style infinite progression.",
      stats: [
        { label: "Keystone affixes", value: KEYSTONE_AFFIXES.length },
        { label: "Extraction rooms", value: EXTRACTION_POINTS.join(", ") },
        { label: "Live events", value: LIVE_EVENTS.length },
      ],
    },
    {
      id: "epochpass", icon: TrendingUp, color: "void-text-error", category: "progression",
      title: "Epoch Pass Seasons",
      description: "Seasonal progression track. Each Epoch = 50-tier battle pass with narrative rewards.",
      stats: [
        { label: "Epochs defined", value: EPOCH_SEASONS.length },
      ],
      preview: EPOCH_SEASONS.slice(0, 3).map(e => e.name ?? e.id),
    },
    {
      id: "guildhall", icon: Castle, color: "void-text-premium", category: "guilds",
      title: "Guild Hall Housing",
      description: "WoW-style guild bases: 5 tier upgrades, 12 room types, 30+ decorations.",
      stats: [
        { label: "Hall tiers", value: HALL_TIERS.length },
        { label: "Room types", value: HALL_ROOMS.length },
        { label: "Decorations", value: GUILD_DECORATIONS.length },
      ],
    },
    {
      id: "guildwonders", icon: Castle, color: "void-text-premium", category: "guilds",
      title: "Guild Wonders",
      description: "Construction projects (1-4 week builds) granting server-wide bonuses.",
      stats: [
        { label: "Wonders", value: GUILD_WONDERS.length },
      ],
      preview: GUILD_WONDERS.slice(0, 3).map((w: any) => w.name ?? w.id),
    },
    {
      id: "monetization", icon: ShoppingBag, color: "void-text-energy", category: "economy",
      title: "Dream Packs & Premium",
      description: "Ark Commander subscription, Epoch Pass Premium, 10+ Dream pack bundles.",
      stats: [
        { label: "Dream pack bundles", value: DREAM_PACKS.length },
      ],
      preview: DREAM_PACKS.slice(0, 3).map((p: any) => p.name ?? p.id),
    },
    {
      id: "quarters", icon: UsersIcon, color: "void-text-energy", category: "guilds",
      title: "Quarter Visitors",
      description: "Social visiting + guest book reactions in Personal Quarters. 5 visits/day, 10 reactions/visit.",
      stats: [
        { label: "Max visits/day", value: 5 },
        { label: "Max reactions/visit", value: 10 },
      ],
    },
    {
      id: "progression", icon: Zap, color: "void-text-error", category: "progression",
      title: "Progression Systems",
      description: "NPC special days, ark restorations, limit breaks. Meta-progression backbone.",
      stats: [
        { label: "NPC special days", value: NPC_SPECIAL_DAYS.length },
        { label: "Ark restorations", value: ARK_RESTORATIONS.length },
        { label: "Limit breaks", value: LIMIT_BREAKS.length },
      ],
    },
  ], []);

  const filtered = filter === "all" ? systems : systems.filter(s => s.category === filter);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Library size={18} className="void-text-energy" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">SYSTEMS LIBRARY</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {systems.length} systems · content catalog for designers & power users
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
          {(["all", "games", "narrative", "guilds", "economy", "progression"] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded border font-mono text-[9px] uppercase tracking-wider transition-colors ${
                filter === cat
                  ? "void-border void-bg-sunk void-text-energy"
                  : "border-border/40 text-muted-foreground/70 hover:border-border/70"
              }`}
              data-testid={`filter-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((sys, i) => {
            const Icon = sys.icon;
            return (
              <motion.div
                key={sys.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-3 rounded border border-border/30 bg-card/40"
                data-testid={`system-${sys.id}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Icon size={16} className={sys.color} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-display text-sm font-bold tracking-wider ${sys.color}`}>{sys.title}</h3>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50">{sys.category}</p>
                  </div>
                </div>
                <p className="font-mono text-[10px] text-foreground/80 leading-relaxed mb-2">{sys.description}</p>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {sys.stats.map((stat, j) => (
                    <div key={j} className="px-2 py-1 rounded border border-border/20 bg-background/40">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">{stat.label}</span>
                      <span className={`font-display text-sm font-bold block tabular-nums ${sys.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                {sys.preview && sys.preview.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sys.preview.map((item, k) => (
                      <span key={k} className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-border/20 text-foreground/70">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
