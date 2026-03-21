/* ═══════════════════════════════════════════════════════
   CADES — CoNexus Advanced Dimensional Exploration Simulation
   Each game is a parallel universe simulation that can save or doom a reality
   ═══════════════════════════════════════════════════════ */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Gamepad2, Swords, Rocket, ScrollText, Trophy, FlaskConical,
  ChevronRight, Shield, Crown, Ship, Zap, Globe, Radio, BookOpen, Users, Skull, Flame,
  ArrowLeftRight, Medal, Dices, Store, CalendarDays, Shield as ShieldIcon, Star, Package
} from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import TutorialTrigger from "@/components/TutorialTrigger";
import { useAutoTutorial } from "@/hooks/useAutoTutorial";
import AutoTutorialPrompt from "@/components/AutoTutorialPrompt";

interface GameTile {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  loreContext: string;
  icon: typeof Gamepad2;
  color: string;
  badge?: string;
  primary?: boolean;
}

const SIMULATIONS: GameTile[] = [
  {
    href: "/cards/play",
    title: "CARD GAME",
    subtitle: "Faction Warfare Simulation",
    description: "Deploy operatives across 3-lane battlefields. Each match simulates a dimensional conflict where your choices determine the fate of a parallel reality.",
    loreContext: "CADES DIMENSION: Faction War Timeline",
    icon: ScrollText,
    color: "var(--orb-orange)",
    badge: "ENTER SIMULATION",
    primary: true,
  },
  {
    href: "/trade-empire",
    title: "TRADE EMPIRE",
    subtitle: "Interstellar Commerce Simulation",
    description: "Navigate galactic trade routes, colonize sectors, and engage in ship-to-ship combat. Your economic decisions ripple across this simulated universe.",
    loreContext: "CADES DIMENSION: Commerce Timeline",
    icon: Ship,
    color: "var(--neon-cyan)",
    badge: "ENTER SIMULATION",
    primary: true,
  },
  {
    href: "/fight",
    title: "COMBAT SIMULATOR",
    subtitle: "Dimensional Combat Training",
    description: "Project your consciousness into combat scenarios. Each fight tests readiness against threats from across the multiverse.",
    loreContext: "CADES DIMENSION: Combat Timeline",
    icon: Swords,
    color: "var(--alert-red)",
    badge: "ENTER SIMULATION",
    primary: true,
  },
  {
    href: "/ark",
    title: "INCEPTION ARK",
    subtitle: "Ship Exploration",
    description: "Navigate the decks of the Inception Ark. Discover rooms, unlock secrets, and uncover the ship's hidden systems.",
    loreContext: "LOCAL: Ark Interior Systems",
    icon: Rocket,
    color: "var(--deep-purple)",
  },
  {
    href: "/cards",
    title: "CARD ARCHIVE",
    subtitle: "3000+ Dimensional Records",
    description: "Browse the complete archive of operatives, spells, and artifacts catalogued from CADES simulations.",
    loreContext: "DATABASE: Simulation Records",
    icon: Crown,
    color: "var(--electric-blue)",
  },
  {
    href: "/deck-builder",
    title: "DECK BUILDER",
    subtitle: "Strategic Loadout",
    description: "Construct and optimize your simulation loadouts. Prepare for dimensional warfare.",
    loreContext: "ARMORY: Loadout Configuration",
    icon: Shield,
    color: "var(--signal-green)",
  },
  {
    href: "/research-lab",
    title: "RESEARCH LAB",
    subtitle: "Card Synthesis",
    description: "Fuse dimensional artifacts, transmute elements, and synthesize new cards from your collection.",
    loreContext: "SCIENCE: CoNexus Research",
    icon: FlaskConical,
    color: "var(--deep-purple)",
  },
  {
    href: "/trophy",
    title: "TROPHY ROOM",
    subtitle: "Achievement Archive",
    description: "Display your rarest finds, track achievements, and review your simulation history.",
    loreContext: "PERSONAL: Operative Records",
    icon: Trophy,
    color: "var(--orb-orange)",
  },
  {
    href: "/conexus-portal",
    title: "ANTIQUARIAN'S LIBRARY",
    subtitle: "CoNexus Story Portal",
    description: "Access the Antiquarian's forbidden archive of interactive story games from the CoNexus dimension. Each tale is a gateway to another reality.",
    loreContext: "ARCHIVE: CoNexus Stories",
    icon: BookOpen,
    color: "#a855f7",
  },
  {
    href: "/boss-battle",
    title: "BOSS ENCOUNTERS",
    subtitle: "Loredex Guardians",
    description: "Face the most powerful entities in the Dischordian Saga. Each boss guards a room of the Ark with lore-accurate abilities and unique rewards.",
    loreContext: "COMBAT: Guardian Battles",
    icon: Crown,
    color: "#ef4444",
  },
  {
    href: "/card-challenge",
    title: "MULTIPLAYER ARENA",
    subtitle: "Async PvP Battles",
    description: "Challenge other operatives from the leaderboard. Your deck fights their deck — even when they're offline. Earn XP and climb the ranks.",
    loreContext: "PVP: Operative Duels",
    icon: Users,
    color: "#f59e0b",
  },
  {
    href: "/pvp",
    title: "PVP ARENA",
    subtitle: "Real-Time Card Battles",
    description: "Enter the arena for real-time multiplayer card battles. Match against live opponents, climb the ELO ladder, and earn your rank from Bronze to Grandmaster.",
    loreContext: "PVP: Live Combat",
    icon: Swords,
    color: "#ef4444",
  },
  {
    href: "/achievements",
    title: "LORE ACHIEVEMENTS",
    subtitle: "Saga Progress Tracker",
    description: "Track your progress across all 33 CoNexus story games. Unlock lore fragments, earn XP, and collect artifact cards as you complete each tale.",
    loreContext: "ARCHIVE: Lore Fragments",
    icon: Trophy,
    color: "#eab308",
  },
  {
    href: "/saga-timeline",
    title: "SAGA TIMELINE",
    subtitle: "Chronological Archive",
    description: "View the complete Dischordian Saga timeline across all 5 Ages. Trace the connections between stories, characters, and epochs.",
    loreContext: "ARCHIVE: Temporal Map",
    icon: Globe,
    color: "#8b5cf6",
  },
  {
    href: "/hierarchy",
    title: "HIERARCHY OF THE DAMNED",
    subtitle: "Demon Corporate Structure",
    description: "Explore the corporate org chart of Hell itself. Ten demon leaders mirror the Archons, oppose the Neyons, and are connected through the Blood Weave.",
    loreContext: "CLASSIFIED: Blood Weave Intel",
    icon: Skull,
    color: "#dc2626",
  },
  {
    href: "/demon-packs",
    title: "DEMON CARD PACKS",
    subtitle: "Hierarchy Gacha System",
    description: "Open Blood Weave, Infernal Gate, and Mol'Garath's Vault packs to collect all 10 demon leader cards. Spend Dream tokens for guaranteed rare+ pulls.",
    loreContext: "CLASSIFIED: Infernal Requisitions",
    icon: Flame,
    color: "#f97316",
  },
  {
    href: "/draft",
    title: "DRAFT TOURNAMENT",
    subtitle: "Draft & Battle",
    description: "Enter the dimensional draft arena. Build a deck from random card pools, then battle through a tournament bracket. Win rewards and exclusive draft-only cards.",
    loreContext: "ARENA: Draft Protocol",
    icon: Dices,
    color: "#a855f7",
  },
  {
    href: "/trading",
    title: "CARD TRADING",
    subtitle: "Operative Exchange",
    description: "Trade cards with other operatives across the network. Offer your duplicates, request cards you need, and negotiate deals on the trading floor.",
    loreContext: "NETWORK: Trade Channel",
    icon: ArrowLeftRight,
    color: "#06b6d4",
  },
  {
    href: "/card-achievements",
    title: "CARD ACHIEVEMENTS",
    subtitle: "Milestone Tracker",
    description: "Track your card game milestones across PvP wins, collection completion, draft victories, and trading. Earn Dream tokens and exclusive rewards.",
    loreContext: "ARCHIVE: Service Record",
    icon: Medal,
    color: "#f59e0b",
  },
  {
    href: "/marketplace",
    title: "INTERGALACTIC MARKET",
    subtitle: "Trade Everything",
    description: "List cards, materials, and items for sale. Place buy orders, bid on auctions, and exchange Dream tokens for credits on the open market.",
    loreContext: "MARKET: Galactic Exchange",
    icon: Store,
    color: "#10b981",
  },
  {
    href: "/quests",
    title: "QUEST BOARD",
    subtitle: "Daily / Weekly / Epoch",
    description: "Complete daily, weekly, and epoch-spanning quests for Dream tokens, materials, and exclusive rewards. Maintain your login streak for bonus loot.",
    loreContext: "ORDERS: Mission Briefings",
    icon: CalendarDays,
    color: "#8b5cf6",
  },
  {
    href: "/guild",
    title: "SYNDICATES",
    subtitle: "Guild System",
    description: "Form or join a Syndicate aligned with a faction. Contribute to the treasury, chat with members, climb the guild leaderboard, and wage faction wars.",
    loreContext: "SYNDICATE: Collective Operations",
    icon: Users,
    color: "#ec4899",
  },
  {
    href: "/battle-pass",
    title: "EPOCH PASS",
    subtitle: "Season Rewards",
    description: "Progress through 50 tiers of free and premium rewards. Earn XP from every game mode to unlock cards, Dream tokens, titles, and exclusive fighters.",
    loreContext: "EPOCH: Seasonal Protocol",
    icon: Star,
    color: "#f59e0b",
  },
  {
    href: "/inventory",
    title: "INVENTORY",
    subtitle: "Manage & Disenchant",
    description: "View all your cards and materials. Disenchant excess cards into Dream tokens and Star Dust. Bulk-disenchant duplicates with a single command.",
    loreContext: "CARGO: Asset Management",
    icon: Package,
    color: "#64748b",
  },
  {
    href: "/chess",
    title: "STRATEGIC CHESS",
    subtitle: "The Architect's Game",
    description: "Play chess against 12 lore characters with unique AI play styles. Climb the ranked ladder, enter tournaments, and challenge the Game Master — a Magnus Carlsen-level opponent.",
    loreContext: "STRATEGY: Neural Warfare",
    icon: Crown,
    color: "#a855f7",
  },
];

export default function GamesPage() {
  const gam = useGamification();
  const { autoTutorial, showAutoTutorial, launchTutorial, dismissTutorial, snoozeTutorial } = useAutoTutorial("/games");

  const primarySims = SIMULATIONS.filter(s => s.primary);
  const supportSims = SIMULATIONS.filter(s => !s.primary);

  return (
    <>
    {autoTutorial && (
      <AutoTutorialPrompt
        tutorial={autoTutorial}
        show={showAutoTutorial}
        onLaunch={launchTutorial}
        onDismiss={dismissTutorial}
        onSnooze={snoozeTutorial}
      />
    )}
    <div className="min-h-screen pb-8 animate-materialize">
      {/* ═══ CADES HEADER ═══ */}
      <div className="px-4 sm:px-6 pt-6 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 max-w-8" style={{ background: "var(--brand-gradient)" }} />
          <span className="font-mono text-[9px] tracking-[0.4em]" style={{ color: "var(--neon-cyan)" }}>
            CoNexus Advanced Dimensional Exploration Simulation
          </span>
          <div className="h-px flex-1 max-w-8" style={{ background: "var(--brand-gradient)" }} />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          C.A.D.E.S. <span className="glow-cyan" style={{ color: "var(--neon-cyan)" }}>SIMULATIONS</span>
        </h1>

        <p className="font-mono text-xs sm:text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-dim)" }}>
          Each simulation projects your consciousness into a parallel universe within the multiverse.
          Your choices determine whether that reality is <span style={{ color: "var(--signal-green)" }}>saved</span> or{" "}
          <span style={{ color: "var(--alert-red)" }}>doomed</span>.
          The CoNexus technology bridges the dimensional divide — proceed with caution, Operative.
        </p>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mt-4 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md glass-sunk">
            <Zap size={10} style={{ color: "var(--neon-cyan)" }} />
            <span style={{ color: "var(--text-muted-ve)" }}>LV.<span style={{ color: "var(--neon-cyan)" }}>{gam.level}</span></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md glass-sunk">
            <Globe size={10} style={{ color: "var(--orb-orange)" }} />
            <span style={{ color: "var(--text-muted-ve)" }}><span style={{ color: "var(--orb-orange)" }}>{gam.points}</span> PTS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md glass-sunk">
            <Trophy size={10} style={{ color: "var(--signal-green)" }} />
            <span style={{ color: "var(--text-muted-ve)" }}><span style={{ color: "var(--signal-green)" }}>{gam.earnedAchievements.length}</span> ACHIEVED</span>
          </div>
        </div>
      </div>

      {/* ═══ TUTORIAL TRIGGER ═══ */}
      <div className="px-4 sm:px-6 mb-4">
        <TutorialTrigger route="/games" variant="banner" />
      </div>

      {/* ═══ PRIMARY SIMULATIONS ═══ */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={12} style={{ color: "var(--neon-cyan)" }} />
          <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color: "var(--neon-cyan)" }}>
            ACTIVE DIMENSIONAL SIMULATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {primarySims.map((sim, i) => {
            const Icon = sim.icon;
            return (
              <motion.div
                key={sim.href}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={sim.href}
                  className="group block rounded-lg overflow-hidden glass-float hover:shadow-[0_0_30px_rgba(51,226,230,0.12)] transition-all duration-300"
                >
                  {/* Top accent line */}
                  <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${sim.color}, transparent)` }} />

                  <div className="p-4 sm:p-5">
                    {/* Icon + Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                        style={{
                          background: `color-mix(in oklch, ${sim.color} 12%, transparent)`,
                          border: `1px solid color-mix(in oklch, ${sim.color} 25%, transparent)`,
                          boxShadow: `0 0 20px color-mix(in oklch, ${sim.color} 15%, transparent)`,
                        }}
                      >
                        <Icon size={22} style={{ color: sim.color }} />
                      </div>
                      {sim.badge && (
                        <span
                          className="font-mono text-[8px] font-bold tracking-[0.15em] px-2 py-1 rounded-full animate-cyber-pulse"
                          style={{
                            background: `color-mix(in oklch, ${sim.color} 15%, transparent)`,
                            color: sim.color,
                            border: `1px solid color-mix(in oklch, ${sim.color} 30%, transparent)`,
                          }}
                        >
                          {sim.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="font-display text-base font-bold tracking-wider mb-1 transition-all group-hover:brightness-125"
                      style={{ color: sim.color }}
                    >
                      {sim.title}
                    </h3>
                    <p className="font-mono text-[9px] tracking-wider mb-2" style={{ color: "var(--text-muted-ve)" }}>
                      {sim.subtitle}
                    </p>

                    {/* Description */}
                    <p className="font-mono text-[11px] leading-relaxed mb-3" style={{ color: "var(--text-dim)" }}>
                      {sim.description}
                    </p>

                    {/* Lore context tag */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] tracking-wider px-2 py-0.5 rounded glass-sunk" style={{ color: "var(--text-muted-ve)" }}>
                        {sim.loreContext}
                      </span>
                      <ChevronRight
                        size={14}
                        className="opacity-30 group-hover:opacity-80 group-hover:translate-x-1 transition-all"
                        style={{ color: sim.color }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══ SUPPORT SYSTEMS ═══ */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 size={12} style={{ color: "var(--electric-blue)" }} />
          <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color: "var(--electric-blue)" }}>
            ARK SUPPORT SYSTEMS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {supportSims.map((sim, i) => {
            const Icon = sim.icon;
            return (
              <motion.div
                key={sim.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link
                  href={sim.href}
                  className="group block rounded-lg glass-float p-3 hover:shadow-[0_0_20px_var(--glass-border)] transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon size={16} style={{ color: sim.color }} className="group-hover:scale-110 transition-transform" />
                    <h4 className="font-display text-[11px] font-bold tracking-wider text-foreground group-hover:text-foreground transition-colors">
                      {sim.title}
                    </h4>
                  </div>
                  <p className="font-mono text-[9px] leading-relaxed" style={{ color: "var(--text-muted-ve)" }}>
                    {sim.subtitle}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
