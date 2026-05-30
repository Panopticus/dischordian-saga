/* ═══════════════════════════════════════════════════════
   THE DEGEN'S CASINO — Page wrapper with game selection
   Accessible via Trade Hub (Locke trust 30 required)
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Skull, Trophy, Info } from "lucide-react";
import ParallaxDepthBackground from "@/components/ParallaxDepthBackground";
import { NemesisTicker } from "@/components/NemesisTicker";
import { NemesisEncounterModal } from "@/components/NemesisEncounterModal";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  CASINO_GAMES, getVIPLevel, getDegenQuote,
  DEFAULT_CASINO_STATE, type CasinoState, type CasinoGame,
  getStreakReward, getStreakMultiplier,
  getDegenFavorMilestone, rollForTale,
  checkEquilibrium, getDegenMood,
  DEGEN_QUOTES_EXPANSION, type DegenTale,
} from "./degensCasino";
import {
  CASINO_ENVIRONMENTS, FLOOR_BACKGROUNDS, CASINO_GAME_TABLES,
  getDegenPortrait, getVipChip,
} from "@/lib/casinoAssets";
import { useDegenVO } from "@/hooks/useDegenVO";
import { CasinoGamePanel, type CasinoGameResultPayload } from "./CasinoGamePanels";
import { CasinoBarrierModal } from "./CasinoBarrierModal";
import { SessionInterruptModal } from "./SessionInterruptModal";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import {
  DegensFavorDisclosure,
  DegensFavorHelpButton,
  useDegenFavorDisclosure,
} from "./DegensFavorDisclosure";
import { HolidayDialogTicker } from "@/components/HolidayDialogTicker";
import { trpc } from "@/lib/trpc";
import { useGame } from "@/contexts/GameContext";
import { milestonesCrossed } from "@shared/degenPazaakMilestones";
import { toast } from "sonner";
import { NpcDialogTreeRunner } from "@/components/NpcDialogTreeRunner";
import { THE_DEGEN_PERSPECTIVE_GATHERING } from "@shared/npcs/dialogTrees/the_degen/perspective_gathering";

const CASINO_FLOOR_BG = CASINO_ENVIRONMENTS.mainFloor;
const CASINO_PARALLAX_COLOR = "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775681916/Vast_open_casino_202604081640_drbpia.jpg";
const CASINO_PARALLAX_DEPTH = "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775681913/Vast_open_casino_202604081640_disparity_quhlae.png";

/** Compact banner showing the live progressive jackpot pool. Refreshes
 *  every 60s — passive display, not a FOMO ticker (audit/16 GA6). */
function JackpotPoolBanner() {
  const poolQuery = trpc.casino.getJackpotPool.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: false,
  });
  const balance = poolQuery.data?.balance ?? 0;
  return (
    <div className="px-4 py-2 border-b void-border">
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border void-border rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="void-text-accent" />
          <span className="font-display text-[11px] tracking-widest void-text-accent uppercase">
            Progressive Jackpot
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="How the jackpot pool works"
                className="void-text-muted hover:void-text-accent transition-colors"
              >
                <Info size={12} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-left">
              2% of every bet feeds this pool. Pool grows until claimed; 20% retained as seed after each jackpot.
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="font-mono text-sm void-text-accent font-bold">
          {balance.toLocaleString()}
          <span className="void-text-accent text-[10px] ml-1">DREAM</span>
        </span>
      </div>
    </div>
  );
}

export default function DegensCasinoPage() {
  const [, navigate] = useLocation();
  const [entering, setEntering] = useState(true);
  const trpcContext = trpc.useUtils();
  // Server-side casino state (authoritative). If the query errors
  // (unauthenticated or DB-less dev mode) we fall back to the default
  // state and keep the UI rendering without crashing.
  const stateQuery = trpc.casino.getState.useQuery(undefined, { retry: false });
  const casinoState: CasinoState = useMemo(() => {
    if (!stateQuery.data) return DEFAULT_CASINO_STATE;
    const srv = stateQuery.data;
    return {
      totalWagered: srv.totalWagered,
      totalWon: srv.totalWon,
      sessionWins: srv.sessionWins,
      sessionLosses: srv.sessionLosses,
      vipLevel: srv.vipLevel,
      freeSpinsLeft: srv.freeSpinsLeft,
      jackpotContribution: srv.jackpotContribution,
      scratchCards: srv.scratchCards,
      currentStreak: srv.currentStreak,
      bestStreak: srv.bestStreak,
      degenFavor: srv.degenFavor,
      totalBetsPlaced: srv.totalBetsPlaced,
      collectedTales: (srv.collectedTales ?? []) as string[],
      gamesPlayed: (srv.gamesPlayed ?? {}) as Partial<Record<CasinoGame, number>>,
    };
  }, [stateQuery.data]);

  // audit/16 GA5 — session-length harm reduction. Hook ticks once
  // per minute; dispatches "casino-session-interrupt" CustomEvent
  // at 2h (gated on ≥500D wagered today) / 4h / 6h. The
  // SessionInterruptModal listens and renders.
  useSessionTimer(casinoState.totalWagered);

  // audit/16 GA8 — Degen's Favor transparency disclosure. Auto-
  // opens once per device on first casino visit; help-icon button
  // re-surfaces it on demand.
  const favorDisclosure = useDegenFavorDisclosure();

  // Auto-dismiss loading screen after image loads + brief cinematic pause
  useEffect(() => {
    if (!entering) return;
    const img = new Image();
    img.src = CASINO_FLOOR_BG;
    const timer = setTimeout(() => setEntering(false), 3000);
    img.onload = () => { setTimeout(() => setEntering(false), 1500); clearTimeout(timer); };
    return () => clearTimeout(timer);
  }, []);

  // Play welcome VO on first load
  useEffect(() => { speakDegen("degen_welcome_00"); }, []);

  // Set the casino_first_visit narrative flag the first time the player
  // enters the casino. This unlocks the Dead Man's Circuit lobby per
  // featureRoadmap.ts, completing the "Casino → Circuit" progression
  // path that Locke opens at trust 30.
  const { setNarrativeFlag } = useGame();
  useEffect(() => { setNarrativeFlag("casino_first_visit", true); }, [setNarrativeFlag]);

  // Server-side mutation that advances the "The Degen's Wager" side
  // quest during an active Circuit season. No-ops outside of seasons.
  const recordSideQuestMutation = trpc.deadMansCircuit.recordSideQuestEvent.useMutation();
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [casinoFloor, setCasinoFloor] = useState<"main" | "cards" | "dice" | "slots" | "vip" | "betting" | "bingo" | "roulette">("main");
  const { speak: speakDegen } = useDegenVO();
  const [degenText, setDegenText] = useState(() => getDegenQuote("welcome"));
  const [latestTale, setLatestTale] = useState<DegenTale | null>(null);
  const [showTale, setShowTale] = useState(false);
  /** Toggled by the "Approach the Degen" header button. Mounts the
   *  NpcDialogTreeRunner with the perspective-gathering tree; the
   *  runner auto-mounts the duel overlay if the player picks the
   *  challenge choice. */
  const [showDegenDialog, setShowDegenDialog] = useState(false);

  const vip = useMemo(() => getVIPLevel(casinoState.totalWagered), [casinoState.totalWagered]);
  const streakReward = useMemo(() => getStreakReward(casinoState.currentStreak), [casinoState.currentStreak]);
  const degenMood = useMemo(() => getDegenMood(casinoState), [casinoState]);
  const favorMilestone = useMemo(() => getDegenFavorMilestone(casinoState.degenFavor), [casinoState.degenFavor]);
  const isEquilibrium = useMemo(() => checkEquilibrium(casinoState), [casinoState]);
  const floorBg = useMemo(() => FLOOR_BACKGROUNDS[casinoFloor] ?? CASINO_FLOOR_BG, [casinoFloor]);
  const degenPortrait = useMemo(
    () => getDegenPortrait(casinoState.degenFavor, degenMood as unknown as "impressed" | "amused" | "predatory" | "philosophical" | "nervous" | "bored" | undefined),
    [casinoState.degenFavor, degenMood],
  );
  const vipChipImg = useMemo(() => getVipChip(vip.name), [vip.name]);

  /** Called by every game panel after a successful tRPC mutation. Rolls for
   *  a lore tale drop client-side (low-cost flavor) and updates the Degen's
   *  commentary banner + VO based on the fresh server state. */
  const onAnyGameResult = (payload?: CasinoGameResultPayload) => {
    trpcContext.casino.getState.invalidate();
    trpcContext.casino.getMyCasinoRewards.invalidate();
    // Toast any new achievements + cosmetic rewards that landed this turn.
    for (const id of payload?.achievementsUnlocked ?? []) {
      toast.success(`Achievement unlocked: ${id.replace(/_/g, " ")}`);
    }
    for (const id of payload?.rewardsUnlocked ?? []) {
      const kind = id.split(":")[0];
      const slug = id.split(":")[1] ?? id;
      toast(`New ${kind} unlocked`, {
        description: slug.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      });
    }
    const nextState = stateQuery.data;
    if (!nextState) return;

    // If this result was a win (session wins moved forward), feed the
    // Dead Man's Circuit "The Degen's Wager" side quest. No-ops outside
    // of an active Circuit season.
    const prevSessionWins = casinoState.sessionWins;
    if (nextState.sessionWins > prevSessionWins) {
      recordSideQuestMutation.mutate({ trigger: "casino_game_won", amount: 1 });
      // Degen trust milestones — fire on the win that crosses each
      // threshold. Idempotent because setNarrativeFlag re-write is a
      // no-op when the value is already true.
      for (const flag of milestonesCrossed(prevSessionWins, nextState.sessionWins)) {
        setNarrativeFlag(flag, true);
      }
    }
    // Tale drop is purely cosmetic — rolled on the client from the
    // refreshed degenFavor + collectedTales list.
    const tale = rollForTale(nextState.degenFavor, (nextState.collectedTales ?? []) as string[]);
    if (tale) {
      setLatestTale(tale);
      setShowTale(true);
    }
    // Pick commentary bucket from the new streak.
    const streak = nextState.currentStreak;
    if (streak >= 10) {
      const q = DEGEN_QUOTES_EXPANSION.streak_10;
      setDegenText(q[Math.floor(Math.random() * q.length)]);
      speakDegen("degen_win_00");
    } else if (streak >= 5) {
      const q = DEGEN_QUOTES_EXPANSION.streak_5;
      setDegenText(q[Math.floor(Math.random() * q.length)]);
      speakDegen("degen_win_00");
    } else if (streak >= 3) {
      const q = DEGEN_QUOTES_EXPANSION.streak_3;
      setDegenText(q[Math.floor(Math.random() * q.length)]);
      speakDegen("degen_win_00");
    } else if (nextState.sessionWins > 0) {
      setDegenText(getDegenQuote("win"));
      speakDegen("degen_win_00");
    } else {
      setDegenText(getDegenQuote("lose"));
      speakDegen("degen_lose_00");
    }
  };

  // ─── LOADING / ENTRY SCREEN ───
  if (entering) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <img
          src={CASINO_FLOOR_BG}
          alt="The Degen's Casino"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(1.2)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Skull size={48} className="void-text-accent mx-auto mb-4" />
          </motion.div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-[0.3em] void-text-accent mb-2">
            THE DEGEN'S CASINO
          </h1>
          <p className="font-mono text-[10px] void-text-accent tracking-[0.2em] mb-6">
            EDGE OF THE SHIELD // NE-YON SPACE // THE HOST WATCHES
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[9px] void-text-accent"
          >
            ENTERING THE FLOOR...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* audit/16 GA4 + GA2 — harm-reduction barrier modal listens
          for "casino-barrier" CustomEvents dispatched from the global
          tRPC mutation-cache subscriber when daily caps are hit. */}
      <CasinoBarrierModal />

      {/* audit/16 GA5 — session-length break prompt. Listens for
          "casino-session-interrupt" CustomEvents from useSessionTimer
          and renders the take-a-break modal at 2h/4h/6h. */}
      <SessionInterruptModal />

      {/* audit/16 GA8 — Degen's Favor transparency disclosure. Auto-
          opens on first visit; on-demand via help-icon button beside
          the favor display below. */}
      <DegensFavorDisclosure
        isOpen={favorDisclosure.isOpen}
        onClose={favorDisclosure.close}
      />

      {/* Phase K3 — NemesisTicker. Surfaces the active
          Nemesis operating in the casino (and any active
          casino_odds_rigging plan). Fail-quiet if no
          Nemeses are active for this user. */}
      <div className="relative z-10 px-4 pt-3">
        <NemesisTicker surface="casino" />
      </div>
      {/* Phase K Wave 6 — encounter modal opens on pending. */}
      <NemesisEncounterModal surface="casino" />

      {/* Casino Floor — environment background per area */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <img
          key={casinoFloor}
          src={floorBg}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.25) saturate(1.2)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
      {/* Parallax depth overlay */}
      <ParallaxDepthBackground
        colorUrl={CASINO_PARALLAX_COLOR}
        depthUrl={CASINO_PARALLAX_DEPTH}
        intensity={0.03}
        opacity={0.12}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b void-border bg-gradient-to-r from-black via-amber-950/20 to-black relative z-10">
        <div className="flex items-center gap-3">
          <img
            src={degenPortrait}
            alt="The Degen"
            className="w-10 h-10 rounded-full object-cover void-bg-sunk border void-border"
          />
          <div>
            <h1 className="font-display text-lg tracking-[0.2em] void-text-accent">THE DEGEN'S CASINO</h1>
            <p className="font-mono text-[8px] void-text-accent">EDGE OF THE SHIELD // ONLY OPEN ZONE IN NE-YON SPACE // THE HOST WATCHES</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={vipChipImg} alt={vip.name} className="w-6 h-6 object-contain" />
            <div className="text-right">
              <p className="font-mono text-[9px] void-text-accent">VIP: {vip.name}</p>
              <p className="font-mono text-[8px] text-white/20">Wagered: {casinoState.totalWagered}D</p>
            </div>
          </div>
          <button
            onClick={() => setShowDegenDialog(true)}
            className="font-mono text-[9px] void-text-accent px-2 py-1 rounded border void-border"
            title="Approach the Degen — perspective dialog, optional duel"
          >
            APPROACH
          </button>
          <button
            onClick={() => navigate("/casino/leaderboard")}
            className="font-mono text-[9px] void-text-accent void-text-accent px-2 py-1 rounded border void-border void-border"
            title="View jackpot leaderboard"
          >
            LEADERBOARD
          </button>
          <button onClick={() => navigate("/ark")} className="text-white/20 hover:text-white/50">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Streak & Favor Bar */}
      {(casinoState.currentStreak >= 3 || casinoState.degenFavor > 0) && (
        <div className="px-4 py-1.5 border-b void-border void-bg-sunk/[0.02] flex items-center justify-between font-mono text-[8px]">
          {casinoState.currentStreak >= 3 && (
            <span className="void-text-accent">
              🔥 STREAK: {casinoState.currentStreak} — {streakReward?.effect ?? ""}
              {getStreakMultiplier(casinoState.currentStreak) > 1 && ` (${getStreakMultiplier(casinoState.currentStreak)}x)`}
            </span>
          )}
          {casinoState.degenFavor > 0 && (
            <span className="void-text-accent inline-flex items-center">
              Degen&apos;s Favor: {casinoState.degenFavor}/100
              {favorMilestone && ` — ${favorMilestone.name}`}
              <DegensFavorHelpButton onOpen={favorDisclosure.open} />
            </span>
          )}
        </div>
      )}

      {/* Progressive jackpot banner — hits all paid games, not just slots */}
      <JackpotPoolBanner />

      {/* Christmas in July ticker — active only during the event window */}
      <div className="px-4 py-2">
        <HolidayDialogTicker npcId="degen" />
      </div>

      {/* Degen Commentary */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-start gap-3">
          <img
            src={degenPortrait}
            alt="The Degen"
            className="w-10 h-10 rounded-full object-cover border void-border shrink-0"
          />
          <p className="font-mono text-xs void-text-accent italic leading-relaxed">"{degenText}"</p>
        </div>
      </div>

      {/* Casino Floor Navigation */}
      {!selectedGame && (
        <div className="px-4 py-2 border-b border-white/5 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {([
              { id: "main", label: "Main Floor", icon: "🎰" },
              { id: "cards", label: "Card Tables", icon: "🃏" },
              { id: "dice", label: "Dice Pit", icon: "🎲" },
              { id: "slots", label: "Slots Gallery", icon: "💎" },
              { id: "betting", label: "Betting Board", icon: "📊" },
              { id: "bingo", label: "Bingo Hall", icon: "📋" },
              { id: "roulette", label: "Dream Roulette", icon: "💀" },
              ...(casinoState.degenFavor >= 80 ? [{ id: "vip", label: "VIP Lounge", icon: "👑" }] : []),
            ] as const).map(floor => (
              <button key={floor.id}
                onClick={() => setCasinoFloor(floor.id as typeof casinoFloor)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] whitespace-nowrap transition-all ${
                  casinoFloor === floor.id
                    ? "void-bg-sunk border void-border void-text-accent"
                    : "bg-white/[0.02] border border-white/5 text-white/30 hover:text-white/50"
                }`}>
                {floor.icon} {floor.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lore Tale Drop Modal */}
      <AnimatePresence>
        {showTale && latestTale && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowTale(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full p-6 rounded-xl border void-border bg-gradient-to-b from-amber-950/40 to-black"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <span className="void-text-accent text-lg">📖</span>
                <p className="font-mono text-[10px] void-text-accent tracking-wider">DEGEN'S TALE DISCOVERED</p>
              </div>
              <h3 className="font-display text-lg void-text-accent mb-3">{latestTale.title}</h3>
              <p className="font-mono text-xs text-white/60 leading-relaxed mb-4">{latestTale.text}</p>
              <div className="flex justify-between items-center">
                <p className="font-mono text-[8px] void-text-accent">
                  Tale {casinoState.collectedTales.length} collected
                </p>
                <button onClick={() => setShowTale(false)}
                  className="px-3 py-1 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-[10px]">
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Selection or Active Game */}
      <div className="p-4 max-w-2xl mx-auto">
        {!selectedGame ? (
          <>
            <p className="font-mono text-[10px] text-white/20 tracking-wider mb-4">
              {casinoFloor === "main" ? "SELECT YOUR GAME" :
               casinoFloor === "cards" ? "CARD TABLES QUARTER" :
               casinoFloor === "dice" ? "THE DICE PIT" :
               casinoFloor === "slots" ? "SLOTS GALLERY" :
               casinoFloor === "vip" ? "THE DEGEN'S VIP LOUNGE" :
               casinoFloor === "betting" ? "FACTION WAR BETTING BOARD" :
               casinoFloor === "bingo" ? "VOID BINGO HALL" :
               casinoFloor === "roulette" ? "DREAM ROULETTE CHAMBER" : "SELECT YOUR GAME"}
            </p>
            {/* Equilibrium alert */}
            {isEquilibrium && (
              <div className="mb-4 p-4 rounded-xl border void-border void-bg-sunk text-center">
                <p className="font-display text-lg void-text-accent">THE EQUILIBRIUM</p>
                <p className="font-mono text-[10px] void-text-accent mt-1">
                  {casinoState.totalBetsPlaced} bets. Exactly even. The Degen is terrified.
                </p>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {CASINO_GAMES
                .filter(game => {
                  if (casinoFloor === "main") return true;
                  if (casinoFloor === "cards") return ["nebula_poker", "pazaak_21", "void_blackjack_tournament", "card_battlers_gauntlet"].includes(game.id);
                  if (casinoFloor === "dice") return ["entropy_dice", "liars_dice", "dream_roulette"].includes(game.id);
                  if (casinoFloor === "slots") return ["void_slots", "scratch_cards", "void_bingo"].includes(game.id);
                  if (casinoFloor === "vip") return ["nebula_poker", "void_blackjack_tournament", "card_battlers_gauntlet"].includes(game.id);
                  if (casinoFloor === "betting") return game.id === "faction_war_betting";
                  if (casinoFloor === "bingo") return game.id === "void_bingo";
                  if (casinoFloor === "roulette") return ["quantum_roulette", "dream_roulette"].includes(game.id);
                  return true;
                })
                .map(game => (
                <button key={game.id} onClick={() => setSelectedGame(game.id)}
                  className="p-4 rounded-xl border void-border void-bg-sunk/[0.03] void-bg-sunk/[0.06] transition-all text-left group">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-sm void-text-accent font-bold group-void-text-accent">{game.name}</p>
                    {(casinoState.gamesPlayed[game.id] ?? 0) > 0 && (
                      <span className="font-mono text-[7px] text-white/15">played {casinoState.gamesPlayed[game.id]}x</span>
                    )}
                  </div>
                  <p className="font-mono text-[9px] text-white/30 mb-2">{game.description}</p>
                  <div className="flex gap-3 font-mono text-[8px] text-white/15">
                    {game.minBet > 0 ? (
                      <>
                        <span>Min: {game.minBet}D</span>
                        <span>Max: {game.maxBet}D</span>
                        <span>Edge: {game.houseEdge}%</span>
                      </>
                    ) : (
                      <span className="void-text-energy">FREE TO PLAY</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <button onClick={() => setSelectedGame(null)}
              className="font-mono text-[10px] text-white/20 hover:text-white/40 mb-4 flex items-center gap-1">
              ← BACK TO GAMES
            </button>

            {/* All games are rendered by the CasinoGamePanel dispatcher,
                which wires each one to the server-authoritative tRPC casino router. */}
            {selectedGame && (
              <div>
                {(() => {
                  const GAME_TABLE_ART: Partial<Record<CasinoGame, string>> = {
                    nebula_poker: CASINO_ENVIRONMENTS.cardTables,
                    pazaak_21: CASINO_ENVIRONMENTS.cardTables,
                    void_blackjack_tournament: CASINO_GAME_TABLES.blackjackTable,
                    liars_dice: CASINO_GAME_TABLES.liarsDiceTable,
                    faction_war_betting: CASINO_GAME_TABLES.factionBettingBoard,
                    card_battlers_gauntlet: CASINO_GAME_TABLES.cardBattlersTable,
                    void_bingo: CASINO_ENVIRONMENTS.bingoHall,
                    dream_roulette: CASINO_GAME_TABLES.voidChargeDevice,
                    quantum_roulette: CASINO_ENVIRONMENTS.rouletteChamber,
                  };
                  const tableImg = GAME_TABLE_ART[selectedGame];
                  return tableImg ? (
                    <img src={tableImg} alt="" className="w-full max-w-sm mx-auto rounded-xl mb-4 opacity-40" style={{ filter: "saturate(0.7)" }} />
                  ) : null;
                })()}
                <CasinoGamePanel game={selectedGame} onResult={onAnyGameResult} />
                <p className="font-mono text-[9px] text-white/20 mt-6 text-center">
                  {CASINO_GAMES.find(g => g.id === selectedGame)?.rules}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-2 border-t void-border bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-2xl mx-auto font-mono text-[9px] text-white/20">
          <span>W: {casinoState.sessionWins} / L: {casinoState.sessionLosses}</span>
          <span>Net: <span className={casinoState.totalWon - casinoState.totalWagered >= 0 ? "void-text-energy" : "void-text-error"}>
            {casinoState.totalWon - casinoState.totalWagered}D
          </span></span>
          {casinoState.currentStreak >= 3 && <span className="void-text-accent">🔥{casinoState.currentStreak}</span>}
          <span>Bets: {casinoState.totalBetsPlaced}</span>
          <span>Tales: {casinoState.collectedTales.length}/12</span>
          <span>VIP: {vip.name}</span>
        </div>
      </div>

      {/* Approach the Degen — dialog → optional duel → memorial harvest.
       *  The runner walks THE_DEGEN_PERSPECTIVE_GATHERING; if the player
       *  picks the "Sit. Deal." challenge choice, NpcDuelOverlay
       *  auto-mounts on top of this dialog. playerFaction defaults to
       *  "neutral" — the player's starter deck is what runs against the
       *  Degen's authored deck. */}
      {showDegenDialog && (
        <NpcDialogTreeRunner
          tree={THE_DEGEN_PERSPECTIVE_GATHERING}
          playerFaction="neutral"
          onClose={() => setShowDegenDialog(false)}
          onVictoryRecorded={(grantCount, rewardTier) => {
            toast.success(
              `The Degen folded ${grantCount} ${
                grantCount === 1 ? "memory" : "memories"
              } into your tray (tier ${rewardTier}).`,
            );
          }}
        />
      )}
    </div>
  );
}
