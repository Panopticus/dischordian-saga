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
  getNilmorgLine, getNilmorgVoLineId, SEASON_REWARD_TIERS,
  type CloneStats, type NilmorgCategory,
} from "@shared/deadMansCircuit";
import { crewMemberToCloneStats, type DmcCloneStats } from "@shared/crewDmcBridge";
import { useNilmorgVO } from "@/hooks/useNilmorgVO";
import {
  mergeCircuitSuitBonuses,
  normalizeToCircuitPlayerClone,
} from "@shared/suitAdapters/deadMansCircuit";
import {
  getPassiveBonuses,
  type AggregatedBonus as CircuitAggregatedBonus,
} from "@/game/passiveBonusAggregator";
import { DMC_ENVIRONMENTS, DMC_MUSIC, DMC_CINEMATICS } from "@/data/dmcAssets";
import { getNilmorgPortrait } from "@shared/nilmorgPortraits";
import DeadMansCircuitCrewPicker from "@/components/crew/DeadMansCircuitCrewPicker";

import { assetUrl } from "@/lib/assetUrl";
type Phase = "lobby" | "racing" | "results";

/** localStorage key for the player's 2-of-6 splice ability loadout. */
const LOADOUT_STORAGE_KEY = "dmc_ability_loadout";
const DEFAULT_LOADOUT = ["emp_pulse", "overclock"] as const;

/** Load the persisted 2-ability loadout from localStorage, falling
   back to the default pair if the value is missing or malformed. */
function loadStoredLoadout(): string[] {
  try {
    const raw = localStorage.getItem(LOADOUT_STORAGE_KEY);
    if (!raw) return [...DEFAULT_LOADOUT];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 2) return [...DEFAULT_LOADOUT];
    const validKeys = new Set(CIRCUIT_ABILITIES.map(a => a.key));
    if (!parsed.every(k => typeof k === "string" && validKeys.has(k))) return [...DEFAULT_LOADOUT];
    return parsed;
  } catch {
    return [...DEFAULT_LOADOUT];
  }
}

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
  const { state: gameState, setNarrativeFlag } = useGame();
  const { speak: speakNilmorg } = useNilmorgVO();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [gameReady, setGameReady] = useState(false);
  const [raceResult, setRaceResult] = useState<any>(null);
  const [nilmorgQuote, setNilmorgQuote] = useState(() => getNilmorgLine("circuit_begins"));
  const [cinematic, setCinematic] = useState<{ src: string; caption?: string; next: () => void } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Ambient music track + stingers. Single ambient element swaps its
  // src based on phase ("lobby" → Nilmorg Watches, "racing" → Terminal
  // Velocity / Phase Three, "results" → paused). Stings are one-shot.
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const stingerAudioRef = useRef<HTMLAudioElement | null>(null);
  const [musicMuted, setMusicMuted] = useState(() => {
    try { return localStorage.getItem("dmc_music_muted") === "1"; }
    catch { return false; }
  });
  const [showCrewPicker, setShowCrewPicker] = useState(false);
  const [crewRunner, setCrewRunner] = useState<{ memberId: string; designation: string } | null>(
    null,
  );
  const resolveDmc = trpc.crew.resolveDeadMansCircuit.useMutation();

  // Player-chosen splice abilities (exactly 2). Persisted to
  // localStorage so the loadout survives page reloads.
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>(loadStoredLoadout);
  useEffect(() => {
    try {
      localStorage.setItem(LOADOUT_STORAGE_KEY, JSON.stringify(selectedAbilities));
    } catch { /* ignore quota errors */ }
  }, [selectedAbilities]);

  /** Toggle an ability in the loadout. Keeps the list at exactly 2 by
      evicting the earliest-picked ability when the player selects a third. */
  const toggleAbility = useCallback((key: string) => {
    setSelectedAbilities(prev => {
      if (prev.includes(key)) {
        // Don't allow an empty loadout — require at least 1 ability
        if (prev.length <= 1) return prev;
        return prev.filter(k => k !== key);
      }
      if (prev.length >= 2) return [prev[1], key]; // evict oldest
      return [...prev, key];
    });
  }, []);

  // Side quest state — 8 cross-game quests tied to the active season.
  const sideQuests = trpc.deadMansCircuit.getMySideQuests.useQuery(undefined, { enabled: isAuthenticated });
  // §G.11 — citizen fetched once to drive the suit-bonus merge at
  // CONFIG post time. Missing citizen yields an empty bonus list.
  const citizenQuery = trpc.citizen.getCharacter.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  const claimSideQuestMutation = trpc.deadMansCircuit.claimSideQuest.useMutation({
    onSuccess: () => { sideQuests.refetch(); myStats.refetch(); },
  });

  // Reward tier + Severance Prize claim mutations
  const claimRewardTierMutation = trpc.deadMansCircuit.claimRewardTier.useMutation({
    onSuccess: () => { myStats.refetch(); },
  });
  const grantSeveranceMutation = trpc.deadMansCircuit.grantSeverancePrize.useMutation({
    onSuccess: () => { myStats.refetch(); },
  });

  // Identity chain (author your own four-name chain)
  const identityChain = trpc.deadMansCircuit.getMyIdentityChain.useQuery(undefined, { enabled: isAuthenticated });
  const submitIdentityChainName = trpc.deadMansCircuit.submitIdentityChainName.useMutation({
    onSuccess: () => { identityChain.refetch(); },
  });
  // Modal shown after races 3 / 6 / 9 / 10 — one prompt per slot.
  const [showChainModal, setShowChainModal] = useState(false);
  const [chainDraft, setChainDraft] = useState("");
  // Decide which slot the modal should target right now (the next
  // unauthored slot in student→seeker→detective→last order).
  const chainNextSlot = useMemo<"student" | "seeker" | "detective" | "last" | null>(() => {
    const row = identityChain.data;
    if (!row) return "student";
    if (!row.studentName) return "student";
    if (!row.seekerName) return "seeker";
    if (!row.detectiveName) return "detective";
    if (!row.lastName) return "last";
    return null;
  }, [identityChain.data]);

  // Persistent clone roster
  const cloneRoster = trpc.deadMansCircuit.getMyClones.useQuery(undefined, { enabled: isAuthenticated });
  const retireCloneMutation = trpc.deadMansCircuit.retireClone.useMutation({
    onSuccess: () => { cloneRoster.refetch(); cloneConfig.refetch(); },
  });
  // Season history is used to find any just-closed season where the
  // player was the champion — that's when the Severance Prize claim
  // card lights up.
  const seasonHistory = trpc.deadMansCircuit.getSeasonHistory.useQuery(undefined, { enabled: isAuthenticated });
  const championedSeason = useMemo(() => {
    if (!user || !seasonHistory.data) return null;
    return seasonHistory.data.find(s => s.championUserId === user.id) ?? null;
  }, [user, seasonHistory.data]);

  // Fetch the crew state only when we've selected a crew member — we need their
  // stats to override the default CloneStats payload for the race iframe.
  const crewQuery = trpc.crew.getState.useQuery(undefined, {
    enabled: !!crewRunner,
  });
  const crewCloneStats = useMemo<DmcCloneStats | null>(() => {
    if (!crewRunner || !crewQuery.data) return null;
    const member = (crewQuery.data as any).roster.members.find(
      (m: any) => m.id === crewRunner.memberId,
    );
    if (!member) return null;
    return crewMemberToCloneStats(member, crewRunner.designation);
  }, [crewRunner, crewQuery.data]);

  // Helper: play a cinematic, then run `after()` when done/skipped
  const playCinematic = useCallback((src: string, caption: string, after: () => void) => {
    setCinematic({
      src,
      caption,
      next: () => { setCinematic(null); after(); },
    });
  }, []);

  /** Play a one-shot stinger (signal-lost on death, severance on win). */
  const playStinger = useCallback((src: string) => {
    if (musicMuted) return;
    try {
      if (stingerAudioRef.current) {
        stingerAudioRef.current.pause();
      }
      const audio = new Audio(src);
      audio.volume = 0.5;
      stingerAudioRef.current = audio;
      audio.play().catch(() => { /* browser blocked autoplay, ignore */ });
    } catch { /* no audio context, ignore */ }
  }, [musicMuted]);

  /** Toggle music mute and persist the preference. */
  const toggleMusicMuted = useCallback(() => {
    setMusicMuted(prev => {
      const next = !prev;
      try { localStorage.setItem("dmc_music_muted", next ? "1" : "0"); }
      catch { /* ignore */ }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.muted = next;
        if (!next) ambientAudioRef.current.play().catch(() => {});
      }
      return next;
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

  // First-visit gate — play "The Circuit Opens" season announcement
  // once per player per install. Sets the narrative flag so it never
  // auto-plays again (but the lobby's Nilmorg Sermon button still
  // offers the other V1 cinematics on demand).
  const hasSeenCircuitIntro = !!gameState.narrativeFlags?.["circuit_first_visit"];
  useEffect(() => {
    if (!isAuthenticated) return;
    if (hasSeenCircuitIntro) return;
    if (phase !== "lobby") return;
    if (!season.data) return;
    // Delay the intro slightly so the lobby mounts cleanly first
    const timer = setTimeout(() => {
      playCinematic(DMC_CINEMATICS.circuitOpens, "THE CIRCUIT OPENS", () => {
        setNarrativeFlag("circuit_first_visit", true);
        // Queue the Nilmorg character intro right after the season
        // opener — it's the first time he speaks directly to the player.
        playCinematic(DMC_CINEMATICS.nilmorgSpeaks, "NILMORG SPEAKS", () => {
          setNarrativeFlag("nilmorg_introduced", true);
        });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, hasSeenCircuitIntro, phase, season.data, playCinematic, setNarrativeFlag]);

  // PostMessage bridge
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;
      if (e.data.type === "CIRCUIT_READY") {
        setGameReady(true);
        // Send config — crew-member stats override the default if a real crew
        // member has been dispatched from the Ark roster.
        const defaultClone = cloneConfig.data || {
          designation: "WIRED-7042-DELTA",
          neural_sync: 80,
          physical_integrity: 100,
          velocity_ceiling: 100,
          surface_grip: 65,
          survival_instinct: 25,
        };
        // §G.11 — reconcile the TS-side clone prototype shape
        // (velocity_ceiling_pct / surface_grip_pct) into the
        // Godot-expected bare-name shape, then fold current
        // suit bonuses into the result. Latched at CONFIG post
        // time (§G.11.1 reload semantics); mid-run swaps never
        // retro-apply.
        const rawClone = crewCloneStats ?? defaultClone;
        const circuitCitizen = citizenQuery?.data;
        const circuitPassiveBonuses: readonly CircuitAggregatedBonus[] =
          circuitCitizen
            ? getPassiveBonuses({
                citizen: circuitCitizen as Parameters<
                  typeof getPassiveBonuses
                >[0]["citizen"],
                gear: circuitCitizen.gear,
              })
            : [];
        const normalizedClone = normalizeToCircuitPlayerClone(
          rawClone as unknown as Parameters<
            typeof normalizeToCircuitPlayerClone
          >[0],
        );
        const mergedClone = mergeCircuitSuitBonuses(
          normalizedClone,
          circuitPassiveBonuses,
        );
        const rawCloneAny = rawClone as unknown as Record<string, unknown>;
        const nestedClone = rawCloneAny.clone as
          | Record<string, unknown>
          | undefined;
        const designation =
          (typeof rawCloneAny.designation === "string"
            ? rawCloneAny.designation
            : typeof nestedClone?.designation === "string"
              ? (nestedClone.designation as string)
              : null) ?? "WIRED-0000-ALPHA";
        const config = {
          player_clone: { designation, ...mergedClone },
          total_laps: 3,
          phase: season.data?.phase || 1,
          ai_count: 7,
          ai_difficulty: 0.5,
          abilities: selectedAbilities,
          track_sequence: trackConfig.data?.track.tileSequence || ["STRAIGHT", "CURVE_LIGHT", "STRAIGHT", "BONE_LANE", "CURVE_HARD", "SPEED_CONDUIT", "STRAIGHT", "DEAD_STRAIGHT"],
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
        // If the player sent a real crew member, resolve their fate in the roster
        if (crewRunner) {
          resolveDmc.mutate({
            memberId: crewRunner.memberId,
            survived: !!result.clone_survived,
            finishPosition: result.finish_position ?? null,
          });
          setCrewRunner(null);
        }
        // Nilmorg reacts — both the text quote and the VO line are
        // picked from the same semantic category so what he says
        // matches what he's actually reacting to.
        const category: NilmorgCategory = !result.clone_survived
          ? "player_died"
          : result.finish_position === 1
            ? "player_wins"
            : "player_losing";
        setNilmorgQuote(getNilmorgLine(category));
        speakNilmorg(getNilmorgVoLineId(category));
        // Fire the appropriate one-shot music sting
        if (!result.clone_survived) {
          playStinger(DMC_MUSIC.signalLost);
        } else if (result.finish_position === 1) {
          playStinger(DMC_MUSIC.severancePrize);
        }
        // Play the appropriate outro cinematic, then show the results screen
        const gotoResults = () => {
          setPhase("results");
          // After races 3 / 6 / 9 / 10, prompt the player for the next
          // identity-chain name if the chain isn't already complete.
          // We check the server-side count via identityChain.data here
          // rather than the client state so the modal survives refetches.
          const raceNum = myStats.data?.leaderboard?.racesCompleted ?? 0;
          const promptRace = [3, 6, 9, 10].includes(raceNum + 1);
          if (promptRace && chainNextSlot) {
            setShowChainModal(true);
          }
        };
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
  }, [cloneConfig.data, season.data, trackConfig.data, crewRunner, crewCloneStats, selectedAbilities, myStats.data, chainNextSlot]);

  // ── Ambient music driver ──
  // The page has three early-return branches (lobby/racing/results)
  // so we can't rely on a <audio> JSX element surviving phase changes.
  // Instead we create the element imperatively once on mount and keep
  // it alive across all renders via the ref.
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    ambientAudioRef.current = audio;
    return () => {
      audio.pause();
      ambientAudioRef.current = null;
    };
  }, []);

  // Picks the correct track for the current phase + season phase:
  //   lobby            → "Nilmorg Watches"
  //   racing (phase ≤2) → "Terminal Velocity"
  //   racing (phase 3)  → "Phase Three" (finals theme)
  //   results          → paused (the stinger plays instead)
  useEffect(() => {
    const seasonPhase = season.data?.phase ?? 1;
    let src: string | null = null;
    if (phase === "lobby") src = DMC_MUSIC.nilmorgWatches;
    else if (phase === "racing") src = seasonPhase >= 3 ? DMC_MUSIC.phaseThree : DMC_MUSIC.terminalVelocity;
    else src = null;

    const audio = ambientAudioRef.current;
    if (!audio) return;

    if (!src) {
      audio.pause();
      return;
    }

    // Only swap the source if it changed — otherwise let the loop continue
    if (!audio.src.endsWith(src)) {
      audio.src = src;
    }
    audio.muted = musicMuted;
    if (!musicMuted) {
      audio.play().catch(() => { /* browser autoplay block — user gesture will recover */ });
    }
  }, [phase, season.data?.phase, musicMuted]);

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
          src={assetUrl("games/circuit/index.html")}
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
    const cpBreakdown = calculateCP(pos, ((season.data?.phase ?? 1) as 1 | 2 | 3), survived, false, raceResult.rival_kills || 0);

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
  const cloneData = cloneConfig.data;
  const clone = cloneData?.clone;

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
          <button
            type="button"
            onClick={toggleMusicMuted}
            aria-label={musicMuted ? "Unmute music" : "Mute music"}
            className="ml-auto font-mono text-[9px] px-2 py-1 rounded border text-white/50 hover:text-white/80"
            style={{ borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "30" }}
          >
            {musicMuted ? "♪ OFF" : "♪ ON"}
          </button>
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

        {/* Race trailer — DMC_CINEMATICS.theRace, the 20s gameplay trailer
            authored as marketing material. Mirrored in the lobby so the
            asset has a real player-facing surface and isn't paying CDN
            storage for nothing. Click to play fullscreen via the same
            playCinematic overlay used by the sermon. */}
        <div className={`${voidPanel} overflow-hidden`}>
          <button
            type="button"
            onClick={() => playCinematic(DMC_CINEMATICS.theRace, "THE RACE", () => {})}
            className="group relative w-full aspect-video block"
          >
            <video
              src={DMC_CINEMATICS.theRace}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${CIRCUIT_PALETTE.TRENCH_DARK}ee 0%, transparent 60%)` }} />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-mono text-[8px] tracking-[0.25em] mb-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
                CIRCUIT // GAMEPLAY TRAILER
              </p>
              <p className="font-display text-[13px] sm:text-sm italic leading-snug" style={{ color: CIRCUIT_PALETTE.BONE_WHITE }}>
                Twenty seconds of the trench at terminal velocity.
              </p>
            </div>
            <div className="absolute top-3 right-3 font-mono text-[9px] px-2 py-1 rounded" style={{ background: "#000a", color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
              ▶ WATCH TRAILER
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
                <p className="font-mono text-sm font-bold" style={{ color: CIRCUIT_PALETTE.BONE_WHITE }}>{clone?.designation}</p>
                <p className="font-mono text-[9px] text-white/30">{clone?.chassisColor} Chassis • {cloneData?.species}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="bg-white/[0.03] rounded p-2">
                <span className="text-white/30 text-[8px] block">SYNC</span>
                <span style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>{clone?.neural_sync}%</span>
              </div>
              <div className="bg-white/[0.03] rounded p-2">
                <span className="text-white/30 text-[8px] block">SPEED</span>
                <span style={{ color: CIRCUIT_PALETTE.DEMAGI_BLUE }}>{clone?.velocity_ceiling_pct}%</span>
              </div>
              <div className="bg-white/[0.03] rounded p-2">
                <span className="text-white/30 text-[8px] block">GRIP</span>
                <span style={{ color: CIRCUIT_PALETTE.QUARCHON_VIOLET }}>{clone?.surface_grip_pct}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Crew-sourced clone seat */}
        {crewRunner ? (
          <div className="w-full p-3 rounded-lg border text-[11px] font-mono flex items-center justify-between"
               style={{ borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE, background: `${CIRCUIT_PALETTE.NILMORG_ORANGE}10` }}>
            <span>
              <Users size={11} className="inline mr-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
              Clone seat: <span style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>{crewRunner.designation}</span>
            </span>
            <button
              onClick={() => setCrewRunner(null)}
              className="text-white/40 hover:text-white/80 text-[10px] uppercase tracking-wider"
            >
              clear
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCrewPicker(true)}
            className="w-full py-2.5 rounded-lg border font-mono text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition"
            style={{ borderColor: `${CIRCUIT_PALETTE.NILMORG_ORANGE}40` }}
          >
            <Users size={12} className="inline mr-2" />
            USE ARK CREW MEMBER
          </button>
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
              <div><span className="text-white/30 text-[8px] block">RACES</span>{stats.leaderboard?.racesCompleted ?? 0}</div>
              <div><span className="text-white/30 text-[8px] block">BEST</span>P{stats.leaderboard?.bestPosition ?? "-"}</div>
              <div><span className="text-white/30 text-[8px] block">KILLS</span>{stats.leaderboard?.totalKills ?? 0}</div>
              <div><span className="text-white/30 text-[8px] block" style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>CP</span><span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>{stats.leaderboard?.totalCp ?? 0}</span></div>
            </div>
          </div>
        )}

        {/* Season Reward Tiers */}
        {stats && (
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">SEASON REWARDS</h3>
            <div className="space-y-2">
              {SEASON_REWARD_TIERS.map(tier => {
                const totalCp = stats.leaderboard?.totalCp ?? 0;
                const unlocked = totalCp >= tier.minCp;
                const claimedTiers = (stats.leaderboard?.claimedTiers ?? []) as string[];
                const claimed = claimedTiers.includes(tier.tier);
                return (
                  <div
                    key={tier.tier}
                    className="rounded-lg p-2 border"
                    style={{
                      background: unlocked ? `${tier.color}10` : "color-mix(in oklch, var(--text-primary) 2%, transparent)",
                      borderColor: unlocked ? `${tier.color}60` : "color-mix(in oklch, var(--text-primary) 8%, transparent)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-mono text-[10px] font-bold" style={{ color: tier.color }}>
                        {tier.name}
                      </p>
                      <span className="font-mono text-[9px] text-white/40">
                        {tier.minCp} CP
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tier.rewards.map(r => (
                        <span
                          key={r.key}
                          className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/50"
                        >
                          {r.label}
                        </span>
                      ))}
                    </div>
                    {unlocked && !claimed && (
                      <button
                        type="button"
                        disabled={claimRewardTierMutation.isPending}
                        onClick={() => claimRewardTierMutation.mutate({ tier: tier.tier as "bone" | "wire" | "chrome" | "dead_mans" })}
                        className="mt-2 w-full py-1 rounded font-mono text-[9px] tracking-wider border disabled:opacity-50"
                        style={{
                          color: tier.color,
                          borderColor: tier.color + "60",
                          background: tier.color + "15",
                        }}
                      >
                        CLAIM
                      </button>
                    )}
                    {claimed && (
                      <p className="font-mono text-[8px] mt-1" style={{ color: tier.color }}>
                        ✓ CLAIMED
                      </p>
                    )}
                    {!unlocked && (
                      <p className="font-mono text-[8px] mt-1 text-white/30">
                        {tier.minCp - totalCp} CP needed
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Severance Prize — only when the player champions a closed season */}
        {championedSeason && (
          <div
            className={`${voidPanel} p-4 relative overflow-hidden`}
            style={{ borderColor: CIRCUIT_PALETTE.VICTORY_GOLD + "60" }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${CIRCUIT_PALETTE.VICTORY_GOLD}40, transparent 70%)` }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={14} style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }} />
                <h3 className="font-display text-sm font-bold tracking-wider" style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>
                  THE SEVERANCE PRIZE
                </h3>
              </div>
              <p className="font-mono text-[10px] text-white/60 mb-2">
                You were the champion of <span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>{championedSeason.name}</span>.
                Nilmorg owes you a soul fragment. Collect it.
              </p>
              <p className="font-mono text-[8px] italic text-white/40 mb-3">
                "The Severance Prize is paid. Don't thank me." — Nilmorg
              </p>
              <button
                type="button"
                disabled={grantSeveranceMutation.isPending || grantSeveranceMutation.isSuccess}
                onClick={() => grantSeveranceMutation.mutate({ seasonId: championedSeason.id })}
                className="w-full py-2 rounded font-mono text-[10px] tracking-[0.2em] border disabled:opacity-50"
                style={{
                  color: CIRCUIT_PALETTE.TRENCH_DARK,
                  borderColor: CIRCUIT_PALETTE.VICTORY_GOLD,
                  background: `linear-gradient(135deg, ${CIRCUIT_PALETTE.NILMORG_ORANGE}, ${CIRCUIT_PALETTE.VICTORY_GOLD})`,
                }}
              >
                {grantSeveranceMutation.isSuccess ? "FRAGMENT COLLECTED" : "CLAIM SEVERANCE PRIZE"}
              </button>
              {grantSeveranceMutation.data && (
                <p className="font-mono text-[8px] mt-2 text-white/60 italic">
                  {grantSeveranceMutation.data.nickname}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Clone Roster — every wired clone the player has fielded this season */}
        {isAuthenticated && cloneRoster.data && cloneRoster.data.length > 0 && (
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">
              <Users size={10} className="inline mr-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
              CLONE ROSTER
            </h3>
            <div className="space-y-1">
              {cloneRoster.data.map((c: any) => {
                const statusColor =
                  c.status === "active" ? CIRCUIT_PALETTE.NILMORG_ORANGE :
                  c.status === "dead"   ? CIRCUIT_PALETTE.DANGER_RED :
                                          "#6b7280";
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 font-mono text-[10px] py-1.5 px-2 rounded border border-white/5"
                    style={{ background: `${statusColor}08` }}
                  >
                    <span className="flex-1 truncate" style={{ color: statusColor }}>{c.designation}</span>
                    <span className="text-white/30">{c.racesRun}R</span>
                    <span className="text-white/30">{c.killsScored}K</span>
                    {c.veteranNoted ? (
                      <span className="text-white/50 text-[8px]" title="Veteran">★</span>
                    ) : null}
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: statusColor }}>
                      {c.status}
                    </span>
                    {c.status === "active" && (
                      <button
                        type="button"
                        disabled={retireCloneMutation.isPending}
                        onClick={() => retireCloneMutation.mutate({ cloneId: c.id })}
                        className="text-white/30 hover:text-white/60 text-[8px] uppercase disabled:opacity-40"
                      >
                        retire
                      </button>
                    )}
                  </div>
                );
              })}
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
                <span className="w-6 text-right" style={{ color: i < 3 ? CIRCUIT_PALETTE.VICTORY_GOLD : "color-mix(in oklch, var(--text-primary) 30%, transparent)" }}>
                  {i + 1}
                </span>
                <span className="flex-1 text-white/50 truncate">{entry.username || `Driver ${entry.userId}`}</span>
                <span style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>{entry.totalCp} CP</span>
                <span className="text-white/20">{entry.racesCompleted}R</span>
              </div>
            ))}
            {lb.length === 0 && <p className="text-white/20 text-[10px] text-center py-4">No racers yet this season</p>}
          </div>
        </div>

        {/* Splice Loadout Picker — choose exactly 2 of 6 abilities */}
        <div className={`${voidPanel} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-[9px] tracking-wider text-white/30">SPLICE LOADOUT</h3>
            <span className="font-mono text-[9px]" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
              {selectedAbilities.length}/2 SELECTED
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CIRCUIT_ABILITIES.map(ab => {
              const isSelected = selectedAbilities.includes(ab.key);
              return (
                <button
                  key={ab.key}
                  type="button"
                  onClick={() => toggleAbility(ab.key)}
                  className="text-left rounded-lg p-2 border transition-colors"
                  style={{
                    background: isSelected ? `${ab.color}22` : "color-mix(in oklch, var(--text-primary) 2%, transparent)",
                    borderColor: isSelected ? `${ab.color}80` : "color-mix(in oklch, var(--text-primary) 8%, transparent)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-[10px] font-bold" style={{ color: ab.color }}>{ab.display_name}</p>
                    {isSelected && (
                      <span className="font-mono text-[8px]" style={{ color: ab.color }}>✓</span>
                    )}
                  </div>
                  <p className="font-mono text-[8px] text-white/40 leading-relaxed">{ab.description}</p>
                  <p className="font-mono text-[7px] text-white/20 italic mt-1 leading-tight">{ab.lore}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cross-game Side Quests */}
        {isAuthenticated && sideQuests.data && sideQuests.data.quests.length > 0 && (
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[9px] tracking-wider text-white/30 mb-3">
              <Target size={10} className="inline mr-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }} />
              CROSS-GAME CIRCUIT QUESTS
            </h3>
            <div className="space-y-2">
              {sideQuests.data.quests.map(q => {
                const pct = Math.min(100, Math.floor((q.progress / q.target) * 100));
                return (
                  <div key={q.key} className="bg-white/[0.02] rounded-lg p-2 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-mono text-[10px] font-bold" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>{q.title}</p>
                      <span className="font-mono text-[9px]" style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>
                        +{q.cpReward} CP
                      </span>
                    </div>
                    <p className="font-mono text-[8px] text-white/40 leading-relaxed mb-1">{q.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: q.completed
                              ? CIRCUIT_PALETTE.VICTORY_GOLD
                              : CIRCUIT_PALETTE.NILMORG_ORANGE,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[8px] text-white/30 min-w-[48px] text-right">
                        {q.progress.toLocaleString()}/{q.target.toLocaleString()}
                      </span>
                    </div>
                    {q.completed && !q.claimed && (
                      <button
                        type="button"
                        disabled={claimSideQuestMutation.isPending}
                        onClick={() => claimSideQuestMutation.mutate({ questKey: q.key })}
                        className="mt-2 w-full py-1 rounded font-mono text-[9px] tracking-wider border disabled:opacity-50"
                        style={{
                          color: CIRCUIT_PALETTE.VICTORY_GOLD,
                          borderColor: CIRCUIT_PALETTE.VICTORY_GOLD + "60",
                          background: CIRCUIT_PALETTE.VICTORY_GOLD + "15",
                        }}
                      >
                        CLAIM
                      </button>
                    )}
                    {q.claimed && (
                      <p className="font-mono text-[8px] mt-1" style={{ color: CIRCUIT_PALETTE.VICTORY_GOLD }}>
                        ✓ CLAIMED
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {cinematic && <CinematicOverlay key="cin" src={cinematic.src} caption={cinematic.caption} onComplete={cinematic.next} />}
      </AnimatePresence>
      <AnimatePresence>
        {showCrewPicker && (
          <DeadMansCircuitCrewPicker
            onClose={() => setShowCrewPicker(false)}
            onPicked={(memberId, designation) => setCrewRunner({ memberId, designation })}
          />
        )}
      </AnimatePresence>

      {/* Identity Chain Author Modal */}
      <AnimatePresence>
        {showChainModal && chainNextSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ background: "color-mix(in oklch, var(--bg-void) 90%, transparent)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full rounded-xl p-6 border relative"
              style={{
                background: CIRCUIT_PALETTE.TRENCH_DARK,
                borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE + "60",
              }}
            >
              <p className="font-mono text-[9px] tracking-[0.3em] mb-1" style={{ color: CIRCUIT_PALETTE.NILMORG_ORANGE }}>
                NILMORG, SVP OF KINETIC ACQUISITION
              </p>
              <h2 className="font-display text-xl font-bold mb-3" style={{ color: CIRCUIT_PALETTE.BONE_WHITE }}>
                {chainNextSlot === "student"   && "What was your Student name?"}
                {chainNextSlot === "seeker"    && "What was your Seeker name?"}
                {chainNextSlot === "detective" && "What was your Detective name?"}
                {chainNextSlot === "last"      && "What will your last name be?"}
              </h2>
              <p className="font-mono text-[10px] italic text-white/50 mb-4 leading-relaxed">
                {chainNextSlot === "student" && "Every major figure in the saga has an identity chain. Yours begins here. Who were you before you knew anything?"}
                {chainNextSlot === "seeker" && "The Student became the Seeker. Name that version of you — the one who started asking the questions nobody answered."}
                {chainNextSlot === "detective" && "The Seeker became the Detective. Name the one who started finding the answers, even when they hurt."}
                {chainNextSlot === "last" && "The last name. The one carved into the bone lane if you fall. Choose carefully."}
              </p>
              <input
                type="text"
                value={chainDraft}
                onChange={e => setChainDraft(e.target.value)}
                placeholder="Type a name..."
                maxLength={64}
                className="w-full px-3 py-2 rounded font-mono text-sm mb-3"
                style={{
                  background: "color-mix(in oklch, var(--text-primary) 5%, transparent)",
                  border: `1px solid ${CIRCUIT_PALETTE.NILMORG_ORANGE}40`,
                  color: CIRCUIT_PALETTE.BONE_WHITE,
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowChainModal(false); setChainDraft(""); }}
                  className="flex-1 py-2 rounded font-mono text-[10px] tracking-wider border text-white/50"
                  style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, transparent)" }}
                >
                  LATER
                </button>
                <button
                  type="button"
                  disabled={!chainDraft.trim() || submitIdentityChainName.isPending}
                  onClick={async () => {
                    const name = chainDraft.trim();
                    if (!name) return;
                    const res = await submitIdentityChainName.mutateAsync({ slot: chainNextSlot, name });
                    setChainDraft("");
                    setShowChainModal(false);
                    if (res.justCompleted) {
                      // All four slots authored — the server wrote the
                      // Loredex entry and set the narrative flags.
                      setNilmorgQuote("The chain is written. You are now a character in the Loredex. Nilmorg finds this mildly interesting.");
                    }
                  }}
                  className="flex-1 py-2 rounded font-mono text-[10px] tracking-wider border disabled:opacity-50"
                  style={{
                    color: CIRCUIT_PALETTE.TRENCH_DARK,
                    borderColor: CIRCUIT_PALETTE.NILMORG_ORANGE,
                    background: CIRCUIT_PALETTE.NILMORG_ORANGE,
                  }}
                >
                  COMMIT NAME
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
