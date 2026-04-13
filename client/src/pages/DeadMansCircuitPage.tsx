/* ═══════════════════════════════════════════════════════
   DEAD MAN'S CIRCUIT — Seasonal Kart Racing Page
   The Hierarchy's races in The Trench.
   Nilmorg watches. The Bone Lane grows.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import {
  Skull, ChevronLeft, Trophy, Zap, Shield, Clock,
  Play, Users, Flame, AlertTriangle, Crown, Target,
} from "lucide-react";
import {
  CIRCUIT_PALETTE, CIRCUIT_ABILITIES, calculateCP,
  getNilmorgLine, type CloneStats,
} from "@shared/deadMansCircuit";

type Phase = "lobby" | "racing" | "results";

const voidPanel = "bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur";

export default function DeadMansCircuitPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState } = useGame();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [gameReady, setGameReady] = useState(false);
  const [raceResult, setRaceResult] = useState<any>(null);
  const [nilmorgQuote, setNilmorgQuote] = useState(() => getNilmorgLine("circuit_begins"));
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const season = trpc.deadMansCircuit.getCurrentSeason.useQuery();
  const leaderboard = trpc.deadMansCircuit.getLeaderboard.useQuery();
  const myStats = trpc.deadMansCircuit.getMyStats.useQuery(undefined, { enabled: isAuthenticated });
  const cloneConfig = trpc.deadMansCircuit.getCloneConfig.useQuery(undefined, { enabled: isAuthenticated });
  const trackConfig = trpc.deadMansCircuit.getTrackConfig.useQuery(undefined, { enabled: !!season.data });
  const submitResult = trpc.deadMansCircuit.submitRaceResult.useMutation({
    onSuccess: (data) => {
      myStats.refetch();
      leaderboard.refetch();
    },
  });

  // PostMessage bridge
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;
      if (e.data.type === "CIRCUIT_READY") {
        setGameReady(true);
        // Send config
        const config = {
          player_clone: cloneConfig.data || {
            designation: "WIRED-7042-DELTA",
            neural_sync: 80,
            physical_integrity: 100,
            velocity_ceiling: 100,
            surface_grip: 65,
            survival_instinct: 25,
          },
          total_laps: 3,
          phase: season.data?.phase || 1,
          ai_count: 7,
          ai_difficulty: 0.5,
          abilities: ["emp_pulse", "overclock"],
          track_sequence: trackConfig.data?.trackSequence || ["STRAIGHT", "CURVE_LIGHT", "STRAIGHT", "BONE_LANE", "CURVE_HARD", "SPEED_CONDUIT", "STRAIGHT", "DEAD_STRAIGHT"],
          bone_obstacles: trackConfig.data?.boneObstacles || [],
        };
        iframeRef.current?.contentWindow?.postMessage({ type: "CIRCUIT_CONFIG", payload: config }, "*");
      }
      if (e.data.type === "CIRCUIT_RESULT") {
        const result = e.data.payload;
        setRaceResult(result);
        setPhase("results");
        // Submit to server
        submitResult.mutate({
          cloneDesignation: result.designation || "WIRED-0000-UNKNOWN",
          finishPosition: result.finish_position || 8,
          totalTimeMs: result.total_ms || 0,
          bestLapMs: result.best_lap_ms || null,
          cloneSurvived: result.clone_survived || false,
          rivalKills: result.rival_kills || 0,
          abilitiesUsed: result.abilities_used || [],
        });
        // Nilmorg reacts
        if (!result.clone_survived) setNilmorgQuote(getNilmorgLine("player_died"));
        else if (result.finish_position === 1) setNilmorgQuote(getNilmorgLine("player_wins"));
        else setNilmorgQuote(getNilmorgLine("player_losing"));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [cloneConfig.data, season.data, trackConfig.data]);

  // ─── NO ACTIVE SEASON ───
  if (!season.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
        <Skull size={64} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} className="mb-6 opacity-30" />
        <h1 className="font-display text-2xl tracking-[0.3em] mb-2" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
          THE CIRCUIT IS CLOSED
        </h1>
        <p className="font-mono text-xs text-white/30 mb-8 text-center max-w-md">
          Dead Man's Circuit opens bi-monthly. Nilmorg is preparing the next season.
          The Bone Lane is being measured. The clones are being grown.
        </p>
        <Link href="/casino" className="font-mono text-xs px-4 py-2 rounded-lg border" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE, borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "40" }}>
          RETURN TO THE CASINO
        </Link>
      </div>
    );
  }

  // ─── RACING PHASE ───
  if (phase === "racing") {
    return (
      <div className="min-h-screen relative" style={{ background: CIRCUIT_PALETTE.VOID_BLACK }}>
        {!gameReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              <Skull size={48} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} className="mb-4 mx-auto" />
            </motion.div>
            <p className="font-mono text-sm tracking-[0.3em]" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
              THE TRENCH IS OPENING
            </p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/games/circuit/index.html"
          className="w-full h-full absolute inset-0"
          style={{ border: "none", opacity: gameReady ? 1 : 0, transition: "opacity 0.5s" }}
          title="Dead Man's Circuit"
          allow="autoplay; fullscreen"
        />
      </div>
    );
  }

  // ─── RESULTS PHASE ───
  if (phase === "results" && raceResult) {
    const pos = raceResult.finish_position || 0;
    const survived = raceResult.clone_survived;
    const cpBreakdown = calculateCP(pos, season.data.phase, survived, false, raceResult.rival_kills || 0);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          {/* Position */}
          <div className="mb-6">
            <p className="font-display text-6xl font-black" style={{ color: pos === 1 ? CIRCUIT_PALETTE.VICTORY_GOLD : CIRCUIT_PALETTE.NILMORG_ORANGE }}>
              {pos <= 3 ? ["1ST", "2ND", "3RD"][pos - 1] : `${pos}TH`}
            </p>
            <p className="font-mono text-xs text-white/30 mt-1">
              {raceResult.designation || "WIRED-0000-UNKNOWN"}
            </p>
          </div>

          {/* Fate */}
          <div className={`${voidPanel} p-4 mb-4`}>
            <p className="font-mono text-xs" style={{ color: survived ? "#4ade80" : CIRCUIT_PALETTE.DANGER_RED }}>
              {survived ? "SIGNAL ACTIVE — CLONE SURVIVED" : "SIGNAL LOST — ADDED TO BONE LANE"}
            </p>
          </div>

          {/* CP Breakdown */}
          <div className={`${voidPanel} p-4 mb-4`}>
            <p className="font-mono text-[9px] tracking-wider text-white/30 mb-3">CIRCUIT POINTS EARNED</p>
            {Object.entries(cpBreakdown).filter(([k]) => k !== "total").map(([key, val]) => (
              val > 0 && (
                <div key={key} className="flex justify-between font-mono text-xs py-1 border-b border-white/5">
                  <span className="text-white/50">{key.replace(/_/g, " ").toUpperCase()}</span>
                  <span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>+{val} CP</span>
                </div>
              )
            ))}
            <div className="flex justify-between font-mono text-sm font-bold mt-2 pt-2 border-t border-white/10">
              <span className="text-white/70">TOTAL</span>
              <span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>{cpBreakdown.total} CP</span>
            </div>
          </div>

          {/* Nilmorg */}
          <div className={`${voidPanel} p-4 mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              <Skull size={14} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
              <span className="font-mono text-[9px] tracking-wider" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>NILMORG</span>
            </div>
            <p className="font-mono text-xs text-white/60 italic">"{nilmorgQuote}"</p>
          </div>

          <button
            onClick={() => { setPhase("lobby"); setRaceResult(null); setGameReady(false); }}
            className="w-full py-3 rounded-lg font-mono text-sm tracking-wider border"
            style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE, borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "40", background: CIRCUIT_PALETTE.NILMORG_ORANGE + "10" }}
          >
            RETURN TO THE TRENCH
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── LOBBY PHASE ───
  const lb = leaderboard.data || [];
  const stats = myStats.data;
  const clone = cloneConfig.data;

  return (
    <div className="min-h-screen pb-24" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b" style={{ borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "20" }}>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/casino" className="text-white/30 hover:text-white/60"><ChevronLeft size={18} /></Link>
          <Skull size={18} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
          <h1 className="font-display text-lg font-bold tracking-[0.2em]" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
            DEAD MAN'S CIRCUIT
          </h1>
        </div>
        <p className="font-mono text-[9px] text-white/20 ml-8">
          Season {season.data.seasonNumber} • Phase {season.data.phase}/3 •
          {season.data.phase === 1 ? " x1 CP" : season.data.phase === 2 ? " x2.5 CP" : " x10 CP — FINALS"}
        </p>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4 max-w-2xl mx-auto">
        {/* Nilmorg Commentary */}
        <div className={`${voidPanel} p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Skull size={12} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
            <span className="font-mono text-[8px] tracking-[0.2em]" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
              NILMORG, SVP OF KINETIC ACQUISITION
            </span>
          </div>
          <p className="font-mono text-[11px] text-white/50 italic leading-relaxed">
            "{nilmorgQuote}"
          </p>
        </div>

        {/* Clone Configuration */}
        {clone && (
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">YOUR WIRED CLONE</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: CIRCUIT_PALETTE.NILMORG_ORANGE + "15", border: `1px solid ${CIRCUIT_PALETTE.NILMORG_ORANGE}30` }}>
                <Zap size={20} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
              </div>
              <div>
                <p className="font-mono text-sm font-bold" style={{ color: CIRCUIT_PALETTE.BONE_WHITE }}>{clone.designation}</p>
                <p className="font-mono text-[9px] text-white/30">{clone.chassisColor} Chassis • {clone.species}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="bg-white/[0.03] rounded p-2">
                <span className="text-white/30 text-[8px] block">SYNC</span>
                <span style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>{clone.neural_sync}%</span>
              </div>
              <div className="bg-white/[0.03] rounded p-2">
                <span className="text-white/30 text-[8px] block">SPEED</span>
                <span style={{ color: CIRCUIT_PALETTE.DEMAGI_BLUE }}>{clone.velocity_ceiling}%</span>
              </div>
              <div className="bg-white/[0.03] rounded p-2">
                <span className="text-white/30 text-[8px] block">GRIP</span>
                <span style={{ color: CIRCUIT_PALETTE.QUARCHON_VIOLET }}>{clone.surface_grip}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Start Race */}
        <button
          onClick={() => setPhase("racing")}
          className="w-full py-4 rounded-xl font-display text-lg tracking-[0.2em] transition-all hover:scale-[1.01]"
          style={{
            color: CIRCUIT_PALETTE.TRENCH_DARK,
            background: `linear-gradient(135deg, ${CIRCUIT_PALETTE.NILMORG_ORANGE}, ${CIRCUIT_PALETTE.VICTORY_GOLD})`,
            boxShadow: `0 0 30px ${CIRCUIT_PALETTE.NILMORG_ORANGE}30`,
          }}
        >
          <Play size={18} className="inline mr-2" />
          ENTER THE TRENCH
        </button>

        {/* My Stats */}
        {stats && (
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">YOUR SEASON</h3>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
              <div><span className="text-white/30 text-[8px] block">RACES</span>{stats.racesCompleted}</div>
              <div><span className="text-white/30 text-[8px] block">BEST</span>P{stats.bestPosition}</div>
              <div><span className="text-white/30 text-[8px] block">KILLS</span>{stats.totalKills}</div>
              <div><span className="text-white/30 text-[8px] block" style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>CP</span><span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>{stats.totalCp}</span></div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className={`${voidPanel} p-4`}>
          <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">
            <Trophy size={10} className="inline mr-1" style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }} />
            CIRCUIT LEADERBOARD
          </h3>
          <div className="space-y-1">
            {lb.slice(0, 10).map((entry: any, i: number) => (
              <div key={entry.userId} className="flex items-center gap-2 font-mono text-[10px] py-1 border-b border-white/5">
                <span className="w-6 text-right" style={{ color: i < 3 ? CIRCUIT_PALETTE.VICTORY_GOLD : "rgba(255,255,255,0.3)" }}>
                  {i + 1}
                </span>
                <span className="flex-1 text-white/50 truncate">{entry.userName || `Driver ${entry.userId}`}</span>
                <span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>{entry.totalCp} CP</span>
                <span className="text-white/20">{entry.racesCompleted}R</span>
              </div>
            ))}
            {lb.length === 0 && <p className="text-white/20 text-[10px] text-center py-4">No racers yet this season</p>}
          </div>
        </div>

        {/* Abilities Preview */}
        <div className={`${voidPanel} p-4`}>
          <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">SPLICE ABILITIES</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CIRCUIT_ABILITIES).slice(0, 4).map(([id, ab]) => (
              <div key={id} className="bg-white/[0.02] rounded-lg p-2 border border-white/5">
                <p className="font-mono text-[10px] font-bold" style={{ color: ab.color }}>{ab.display_name}</p>
                <p className="font-mono text-[8px] text-white/30 leading-relaxed">{ab.lore}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
