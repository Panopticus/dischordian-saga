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
import { useNilmorgVO } from "@/hooks/useNilmorgVO";
import { DMC_ENVIRONMENTS, DMC_MUSIC, DMC_CINEMATICS } from "@/data/dmcAssets";
import { getNilmorgPortrait } from "@shared/nilmorgPortraits";

type Phase = "lobby" | "racing" | "results";

/* ═══════════════════════════════════════════════════════
   CinematicOverlay — fullscreen cutscene player
   Auto-plays the given video, fades in, lets the user
   skip at any time, and fires onComplete when finished.
   ═══════════════════════════════════════════════════════ */
function CinematicOverlay({
  src,
  caption,
  onComplete,
}: { src: string; caption?: string; onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => onComplete());
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "#000" }}
      onClick={onComplete}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        onEnded={onComplete}
      />
      {caption && (
        <div className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.3em]" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
          {caption}
        </div>
      )}
      <div className="absolute bottom-6 right-6 font-mono text-[9px] tracking-[0.2em] text-white/40 pointer-events-none">
        CLICK TO SKIP
      </div>
    </motion.div>
  );
}

const voidPanel = "bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur";

export default function DeadMansCircuitPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState } = useGame();
  const { speak: speakNilmorg } = useNilmorgVO();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [gameReady, setGameReady] = useState(false);
  const [raceResult, setRaceResult] = useState<any>(null);
  const [nilmorgQuote, setNilmorgQuote] = useState(() => getNilmorgLine("circuit_begins"));
  const [cinematic, setCinematic] = useState<{ src: string; caption?: string; next: () => void } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper: play a cinematic, then run `after()` when done/skipped
  const playCinematic = useCallback((src: string, caption: string, after: () => void) => {
    setCinematic({
      src,
      caption,
      next: () => { setCinematic(null); after(); },
    });
  }, []);

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
        const nilmorgVoId = `nilmorg_${String(Math.floor(Math.random() * 28)).padStart(2, '0')}`;
        if (!result.clone_survived) setNilmorgQuote(getNilmorgLine("player_died"));
        else if (result.finish_position === 1) setNilmorgQuote(getNilmorgLine("player_wins"));
        else setNilmorgQuote(getNilmorgLine("player_losing"));
        speakNilmorg(nilmorgVoId);
        // Play the appropriate outro cinematic, then show the results screen
        const gotoResults = () => setPhase("results");
        if (!result.clone_survived) {
          playCinematic(DMC_CINEMATICS.signalLostV2, "SIGNAL LOST", gotoResults);
        } else if (result.finish_position === 1) {
          playCinematic(DMC_CINEMATICS.severancePodium, "THE SEVERANCE PRIZE", gotoResults);
        } else {
          gotoResults();
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [cloneConfig.data, season.data, trackConfig.data]);

  // ─── NO ACTIVE SEASON ───
  if (!season.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
        <img src={DMC_ENVIRONMENTS.cloneVat} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
        <Skull size={64} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} className="relative z-10 mb-6 opacity-30" />
        <h1 className="relative z-10 font-display text-2xl tracking-[0.3em] mb-2" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
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
            <img src={DMC_ENVIRONMENTS.startingGrid} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="relative z-10">
              <Skull size={48} style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} className="mb-4 mx-auto" />
            </motion.div>
            <p className="relative z-10 font-mono text-sm tracking-[0.3em]" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
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
        <AnimatePresence>
          {cinematic && <CinematicOverlay key="cin" src={cinematic.src} caption={cinematic.caption} onComplete={cinematic.next} />}
        </AnimatePresence>
      </div>
    );
  }

  // ─── RESULTS PHASE ───
  if (phase === "results" && raceResult) {
    const pos = raceResult.finish_position || 0;
    const survived = raceResult.clone_survived;
    const cpBreakdown = calculateCP(pos, season.data.phase, survived, false, raceResult.rival_kills || 0);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
        <img src={DMC_ENVIRONMENTS.nilmorgPlatform} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center relative z-10">
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

          {/* Nilmorg — corporate-chair loop as portrait backdrop */}
          <div className={`${voidPanel} mb-6 relative overflow-hidden`}>
            <video
              src={DMC_CINEMATICS.nilmorgChair}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${CIRCUIT_PALETTE.TRENCH_DARK}f0 0%, ${CIRCUIT_PALETTE.TRENCH_DARK}80 60%, transparent 100%)` }} />
            <div className="relative p-4 flex items-start gap-3 text-left">
              <img
                src={getNilmorgPortrait(pos === 1 ? "player_wins" : survived ? "player_losing" : "player_died")}
                alt="Nilmorg"
                className="w-10 h-10 rounded-lg object-cover border shrink-0"
                style={{ borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "60" }}
              />
              <div className="min-w-0">
                <span className="font-mono text-[9px] tracking-wider" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>NILMORG</span>
                <p className="font-mono text-xs italic mt-1" style={{ color: CIRCUIT_PALETTE.BONE_WHITE + "cc" }}>"{nilmorgQuote}"</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setPhase("lobby"); setRaceResult(null); setGameReady(false); }}
            className="w-full py-3 rounded-lg font-mono text-sm tracking-wider border"
            style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE, borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "40", background: CIRCUIT_PALETTE.NILMORG_ORANGE + "10" }}
          >
            RETURN TO THE TRENCH
          </button>
        </motion.div>
        <AnimatePresence>
          {cinematic && <CinematicOverlay key="cin" src={cinematic.src} caption={cinematic.caption} onComplete={cinematic.next} />}
        </AnimatePresence>
      </div>
    );
  }

  // ─── LOBBY PHASE ───
  const lb = leaderboard.data || [];
  const stats = myStats.data;
  const clone = cloneConfig.data;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: CIRCUIT_PALETTE.TRENCH_DARK }}>
      {/* Hero background — 4K race gameplay loop, muted, behind everything */}
      <video
        src={DMC_CINEMATICS.raceGameplay}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <img src={DMC_ENVIRONMENTS.trench} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none mix-blend-multiply" />
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

      <div className="px-4 sm:px-6 pt-4 space-y-4 max-w-2xl mx-auto relative">
        {/* Nilmorg Sermon — lip-sync hero panel */}
        <div className={`${voidPanel} overflow-hidden`}>
          <button
            type="button"
            onClick={() => playCinematic(DMC_CINEMATICS.nilmorgLipSync, "NILMORG — THE VELOCITY SERMON", () => {})}
            className="group relative w-full aspect-video block"
          >
            <video
              src={DMC_CINEMATICS.nilmorgLipSync}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${CIRCUIT_PALETTE.TRENCH_DARK}ee 0%, transparent 60%)` }} />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-mono text-[8px] tracking-[0.25em] mb-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
                NILMORG — SVP OF KINETIC ACQUISITION
              </p>
              <p className="font-display text-[13px] sm:text-sm italic leading-snug" style={{ color: CIRCUIT_PALETTE.BONE_WHITE }}>
                "The universe runs on power. Power runs on desire. And desire — desire is driven by velocity and vanity."
              </p>
            </div>
            <div className="absolute top-3 right-3 font-mono text-[9px] px-2 py-1 rounded" style={{ background: "#000a", color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
              ▶ SERMON
            </div>
          </button>
        </div>

        {/* Nilmorg Commentary (dynamic VO lines, corporate-chair loop as portrait) */}
        <div className={`${voidPanel} relative overflow-hidden`}>
          <video
            src={DMC_CINEMATICS.nilmorgChair}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${CIRCUIT_PALETTE.TRENCH_DARK}f0 0%, ${CIRCUIT_PALETTE.TRENCH_DARK}80 60%, transparent 100%)` }} />
          <div className="relative p-4 flex items-start gap-3">
            <img
              src={getNilmorgPortrait(phase === "results" && raceResult ? (raceResult.finish_position === 1 ? "player_wins" : raceResult.clone_survived ? "player_losing" : "player_died") : "circuit_begins")}
              alt="Nilmorg"
              className="w-12 h-12 rounded-lg object-cover border shrink-0"
              style={{ borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "60" }}
            />
            <div className="min-w-0">
              <span className="font-mono text-[8px] tracking-[0.2em] block mb-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
                NILMORG, SVP OF KINETIC ACQUISITION
              </span>
              <p className="font-mono text-[11px] italic leading-relaxed" style={{ color: CIRCUIT_PALETTE.BONE_WHITE + "cc" }}>
                "{nilmorgQuote}"
              </p>
            </div>
          </div>
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
          onClick={() => playCinematic(DMC_CINEMATICS.cloneAwakeningV2, "CLONE AWAKENING", () => setPhase("racing"))}
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
      <AnimatePresence>
        {cinematic && <CinematicOverlay key="cin" src={cinematic.src} caption={cinematic.caption} onComplete={cinematic.next} />}
      </AnimatePresence>
    </div>
  );
}
