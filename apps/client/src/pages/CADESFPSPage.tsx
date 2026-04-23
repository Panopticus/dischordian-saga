/* ═══════════════════════════════════════════════════════
   CADES UNIT — FPS Page
   Embeds the Godot 4.3 CADES FPS via iframe.
   Three modes: The Last Stand | Ship Defense | Historical Incursions
   
   Communication via PostMessage bridge:
   → CADES_CONFIG (React → Godot): mode, loop_count, awareness_level, scenarios
   ← CADES_READY  (Godot → React): game loaded
   ← CADES_RESULT (Godot → React): game finished with results
   ← IRON_LION_CHANNEL_OPEN (Godot → React): Iron Lion conversation triggered
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { ChevronLeft, Skull, Shield, BookOpen, Crosshair, Clock } from "lucide-react";
import { CADES_CHARACTERS, CADES_UI, CADES_MUSIC } from "@/data/cadesAssets";
import { isCadesUnlocked } from "@/data/cadesNarrativeIntegration";
import { dispatchNarrativeEffect } from "@/hooks/useNarrativeEvents";
import { CADESFeed } from "@/components/CADESFeed";
import { CADESAmbientLines } from "@/components/CADESAmbientLines";
import { CADESClueBoard } from "@/components/CADESClueBoard";
import { CADESConspiracyBoard } from "@/components/CADESConspiracyBoard";
import { OpenChannelEcho } from "@/components/OpenChannelEcho";
import { toFpsSuitBonuses } from "@shared/suitAdapters/fps";
import { useActVO } from "@/hooks/useActVO";
import {
  getPassiveBonuses,
  type AggregatedBonus,
} from "@/game/passiveBonusAggregator";
import { ResponsiveImage } from "@/components/ResponsiveImage";

import { assetUrl } from "@/lib/assetUrl";
/* ─── PALETTE ─── */
const P = {
  VOID_BLACK: "#0f172a",
  TRENCH_DARK: "#1c1917",
  AMBER: "var(--energy-accent)",
  ORANGE: "#f97316",
  RED: "var(--energy-error)",
  GOLD: "#fbbf24",
  VIOLET: "#8b5cf6",
  BONE: "#f5f0e8",
  OFF_WHITE: "#e2e8f0",
  CRIMSON: "#7f1d1d",
};

type Phase = "select" | "playing" | "result";
type CadesMode = "last_stand" | "ship_defense" | "historical_incursions";

interface CadesResult {
  mode: string;
  time_held?: number;
  waves_survived?: number;
  loop_count?: number;
  awareness_level?: number;
  canon_achieved?: boolean;
  success?: boolean;
  thoughtborn_contacted?: boolean;
  thoughtborn_killed?: number;
  scenario_completed?: string;
  scenarios_total_completed?: string[];
  game_masters_contact_level?: number;
}

const voidPanel = "bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur";

export default function CADESFPSPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, setNarrativeFlag } = useGame();
  const vo = useActVO("5");

  /**
   * Mapping of Godot iframe modes → canonical CADES_FPS_MISSIONS
   * ids. M1 (Scout's Gambit) isn't directly selectable — it's the
   * "any successful run" mission — so we play its VO alongside
   * whichever mode the player actually chose.
   */
  const MODE_TO_MISSION_ID: Record<string, number> = {
    ship_defense: 2,
    historical_incursions: 5,
    last_stand: 7,
  };

  // §G.11 — CADES receives the player's current suit bonuses via the
  // CADES_CONFIG payload. Aggregator is read once per render; missing
  // citizen data yields [] and the Godot side behaves identically to
  // pre-suit builds.
  const citizenQuery = trpc.citizen.getCharacter.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  const cadesPassiveBonuses: readonly AggregatedBonus[] = (() => {
    const citizen = citizenQuery.data;
    if (!citizen) return [];
    return getPassiveBonuses({
      citizen: citizen as Parameters<typeof getPassiveBonuses>[0]["citizen"],
      gear: citizen.gear,
    });
  })();

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedMode, setSelectedMode] = useState<CadesMode | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const [result, setResult] = useState<CadesResult | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persisted CADES data
  const cadesData = trpc.gameState.getCadesData.useQuery(undefined, { enabled: isAuthenticated });
  const saveCadesResult = trpc.gameState.saveCadesResult.useMutation({
    onSuccess: () => cadesData.refetch(),
  });

  // PostMessage bridge
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;

      if (e.data.type === "CADES_READY") {
        setGameReady(true);
        // Send config. Suit bonuses are latched here (§G.11.1
        // reload semantics: no retro-apply mid-run). The adapter is
        // pure — missing aggregator data yields a 1.0/0 payload so
        // pre-suit-system saves behave identically.
        const config = {
          mode: selectedMode,
          loop_count: cadesData.data?.loopCount ?? 0,
          awareness_level: cadesData.data?.awarenessLevel ?? 0,
          scenarios_completed: cadesData.data?.scenariosCompleted ?? [],
          suit_bonuses: toFpsSuitBonuses(cadesPassiveBonuses),
        };
        iframeRef.current?.contentWindow?.postMessage(
          { type: "CADES_CONFIG", payload: config }, "*"
        );
      }

      if (e.data.type === "CADES_RESULT") {
        const r = e.data.payload as CadesResult;
        setResult(r);
        setPhase("result");
        // Persist
        saveCadesResult.mutate(r as unknown as Record<string, unknown>);
        // Fan out narrative events so the living universe layer can react.
        if (r.canon_achieved) dispatchNarrativeEffect(undefined, "cades_canon_achieved");
        if (r.mode === "ship_defense" && r.success) dispatchNarrativeEffect(undefined, "cades_shields_restored");
        if (r.mode === "ship_defense" && (r.thoughtborn_killed ?? 0) > 0) dispatchNarrativeEffect(undefined, "cades_thoughtborn_killed");
        if (r.thoughtborn_contacted) dispatchNarrativeEffect(undefined, "cades_thoughtborn_contacted");
        if (r.scenario_completed) dispatchNarrativeEffect(undefined, `cades_scenario_${r.scenario_completed}`);

        // Act 5 completion-gate bridge — map Godot CADES modes to the
        // canonical CADES_FPS_MISSIONS completedFlag names defined in
        // apps/shared/actsFourFiveShells.ts. Without this the Act 5
        // gate (`cades_m7_complete` required) never fires and Act 6
        // remains locked via dev-only flags.
        //
        // Canon mapping (matches the data-shell's mission ordering):
        //   ship_defense   → M2 "The Digital Onslaught"  (hold the node)
        //   historical_incursions → M5 "Operation Trojan Downfall"
        //                            (joint assault; canonical partial loss)
        //   last_stand     → M7 "The Last Stand on Veridian VI"
        //                            (Iron Lion dies — mandatory_death beat)
        //
        // Any successful Cades run also raises M1 (Scout's Gambit) —
        // the player has scouted the battlefield by playing at all.
        // This gives the Hub panel a visible progression arc even
        // before the player reaches last_stand.
        if (r.success) {
          setNarrativeFlag("cades_m1_complete", true);
          if (r.mode === "ship_defense") {
            setNarrativeFlag("cades_m2_complete", true);
          } else if (r.mode === "historical_incursions") {
            setNarrativeFlag("cades_m5_complete", true);
          } else if (r.mode === "last_stand") {
            setNarrativeFlag("cades_m7_complete", true);
          }
          // Iron Lion's debrief VO — M1 fires once per save on first
          // successful return, mode-specific debrief fires every time.
          if (!gameState.narrativeFlags?.cades_m1_debrief_heard) {
            setNarrativeFlag("cades_m1_debrief_heard", true);
            vo.speak("cades-m1-debrief");
          }
          const missionN = MODE_TO_MISSION_ID[r.mode];
          if (missionN) vo.speak(`cades-m${missionN}-debrief`);
        }
      }

      if (e.data.type === "IRON_LION_CHANNEL_OPEN") {
        saveCadesResult.mutate({
          mode: "last_stand",
          iron_lion_contacted: true,
          loop_count: e.data.payload.loop_count,
          awareness_level: e.data.payload.awareness_level,
          open_channel_choice: e.data.payload.player_choice ?? "",
        });
        dispatchNarrativeEffect(undefined, "cades_iron_lion_contacted");
      }

      if (e.data.type === "CADES_GM_CONTACT") {
        const level = e.data.payload?.level ?? 0;
        saveCadesResult.mutate({
          mode: "historical_incursions",
          gm_contact_level: level,
          scenarios_total_completed: e.data.payload?.scenarios_completed ?? [],
        });
        dispatchNarrativeEffect(undefined, `cades_gm_contact_${level}`);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [selectedMode, cadesData.data]);

  // Stop audio when leaving
  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const startGame = useCallback((mode: CadesMode) => {
    setSelectedMode(mode);
    setPhase("playing");
    setGameReady(false);
    setResult(null);
    // Iron Lion's mission-brief VO. M1 brief plays alongside the
    // mode-specific brief so the Scout's Gambit thread gets its
    // one-shot spoken kickoff on a fresh save.
    if (!gameState.narrativeFlags?.cades_m1_brief_heard) {
      setNarrativeFlag("cades_m1_brief_heard", true);
      vo.speak("cades-m1-brief");
    }
    const missionN = MODE_TO_MISSION_ID[mode];
    if (missionN) vo.speak(`cades-m${missionN}-brief`);
  }, [gameState.narrativeFlags, setNarrativeFlag, vo]);

  // Cades mission mid-line timer — the Godot iframe doesn't emit
  // mid_tick events, so the mid VO fires on a best-effort 45-second
  // timer after the player enters the playing phase. Canceled on
  // phase/mode transitions so a mid-match exit doesn't leak a line
  // into the next run. M1 mid plays once per save alongside the
  // mode-specific mid.
  useEffect(() => {
    if (phase !== "playing" || !selectedMode) return;
    const missionN = MODE_TO_MISSION_ID[selectedMode];
    const timer = window.setTimeout(() => {
      if (!gameState.narrativeFlags?.cades_m1_mid_heard) {
        setNarrativeFlag("cades_m1_mid_heard", true);
        vo.speak("cades-m1-mid");
      }
      if (missionN) vo.speak(`cades-m${missionN}-mid`);
    }, 45_000);
    return () => window.clearTimeout(timer);
  }, [phase, selectedMode, gameState.narrativeFlags, setNarrativeFlag, vo]);

  // ─── NARRATIVE GATE — Act 5 (THE MAP) must be reached ───
  const unlocked = isCadesUnlocked({
    narrativeAct: gameState.narrativeAct ?? 0,
    cadesDiscovered: (gameState as unknown as { cadesDiscovered?: boolean }).cadesDiscovered,
  });
  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: P.VOID_BLACK }}>
        <img src={CADES_UI.modeSelectBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-lg text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Link href="/games" className="text-white/40 hover:text-white/70"><ChevronLeft size={18} /></Link>
            <h1 className="font-display text-2xl font-bold tracking-[0.3em]" style={{ color: P.AMBER }}>
              CADES UNIT — LOCKED
            </h1>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] mb-6" style={{ color: P.VIOLET }}>
            CONSCIOUSNESS ARCHIVAL AND DREAM ENGAGEMENT SYSTEM
          </p>
          <div className={`${voidPanel} p-6 mb-6`}>
            <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: P.BONE }}>
              The CADES unit sits in the restricted section of the Medical Bay.
              It has been drawing power from the Ark's core since before launch.
            </p>
            <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: P.OFF_WHITE + "80" }}>
              You are not yet ready to use it. The Human has not told you what it does.
              Elara does not yet know what the violet light means.
            </p>
            <p className="font-mono text-[10px] tracking-wider" style={{ color: P.VIOLET }}>
              UNLOCKS AFTER ACT 5 — THE MAP
            </p>
            <p className="font-mono text-[10px] mt-2" style={{ color: P.OFF_WHITE + "60" }}>
              Current narrative act: {gameState.narrativeAct ?? 0}/7
            </p>
          </div>
          <Link href="/games" className="inline-block px-6 py-3 rounded-lg font-mono text-sm tracking-wider border" style={{ color: P.AMBER, borderColor: P.AMBER + "40", background: P.AMBER + "10" }}>
            RETURN TO GAMES
          </Link>
        </div>
      </div>
    );
  }

  // ─── MODE SELECT ───
  if (phase === "select") {
    return (
      <div className="min-h-screen relative" style={{ background: P.VOID_BLACK }}>
        <img src={CADES_UI.modeSelectBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
        <div className="relative z-10 px-4 sm:px-6 pt-8 pb-24">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Link href="/games" className="text-white/30 hover:text-white/60"><ChevronLeft size={18} /></Link>
            <h1 className="font-display text-2xl font-bold tracking-[0.3em]" style={{ color: P.AMBER }}>
              CADES UNIT
            </h1>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] mb-8" style={{ color: P.VIOLET }}>
            CONSCIOUSNESS ARCHIVAL AND DREAM ENGAGEMENT SYSTEM
          </p>

          {/* Mode cards */}
          <div className="grid gap-4 max-w-lg mx-auto">
            {/* The Last Stand */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame("last_stand")}
              className={`${voidPanel} p-6 text-left`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Crosshair size={20} style={{ color: P.AMBER }} />
                <span className="font-display text-lg font-bold tracking-wider" style={{ color: P.AMBER }}>
                  THE LAST STAND
                </span>
              </div>
              <p className="font-mono text-xs" style={{ color: P.BONE }}>
                Bridge of Kael — Iron Lion holds the line
              </p>
              <p className="font-mono text-[10px] mt-2" style={{ color: P.OFF_WHITE + "80" }}>
                Horde survival. Hold the bridge. The canonical time is 3 hours, 47 minutes.
              </p>
              {cadesData.data?.bestTimeHeld ? (
                <p className="font-mono text-[10px] mt-1" style={{ color: P.GOLD }}>
                  BEST: {Math.floor((cadesData.data.bestTimeHeld ?? 0) / 60)}m {Math.floor((cadesData.data.bestTimeHeld ?? 0) % 60)}s
                  {cadesData.data?.canonAchieved && " — CANON ACHIEVED"}
                </p>
              ) : null}
            </motion.button>

            {/* Ship Defense */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame("ship_defense")}
              className={`${voidPanel} p-6 text-left`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield size={20} style={{ color: P.VIOLET }} />
                <span className="font-display text-lg font-bold tracking-wider" style={{ color: P.VIOLET }}>
                  SHIP DEFENSE
                </span>
              </div>
              <p className="font-mono text-xs" style={{ color: P.BONE }}>
                Inception Ark 1047 — Elara needs 25 minutes
              </p>
              <p className="font-mono text-[10px] mt-2" style={{ color: P.OFF_WHITE + "80" }}>
                Defend three breach points. Keep the shields charging. Don't shoot the Thoughtborn.
              </p>
            </motion.button>

            {/* Historical Incursions */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame("historical_incursions")}
              className={`${voidPanel} p-6 text-left`}
            >
              <div className="flex items-center gap-3 mb-2">
                <BookOpen size={20} style={{ color: P.VIOLET }} />
                <span className="font-display text-lg font-bold tracking-wider" style={{ color: P.OFF_WHITE }}>
                  HISTORICAL INCURSIONS
                </span>
              </div>
              <p className="font-mono text-xs" style={{ color: P.BONE }}>
                The Matrix of Dreams — scenarios archived by the Game Master
              </p>
              <p className="font-mono text-[10px] mt-2" style={{ color: P.OFF_WHITE + "80" }}>
                Six scenarios. The Game Masters are watching. Iron Lion is asking questions.
              </p>
              {(cadesData.data?.scenariosCompleted?.length ?? 0) > 0 && (
                <p className="font-mono text-[10px] mt-1" style={{ color: P.VIOLET }}>
                  {cadesData.data?.scenariosCompleted?.length}/6 SCENARIOS COMPLETED
                </p>
              )}
            </motion.button>
          </div>

          {/* Elara echo of the player's last Open Channel choice */}
          <div className="max-w-lg mx-auto mt-8">
            <OpenChannelEcho />
          </div>

          {/* Ambient chatter — shows NPC reactions and GM surveillance */}
          <div className="max-w-lg mx-auto mt-4">
            <CADESAmbientLines />
          </div>

          {/* Investigation clues unlocked through CADES progress */}
          <div className="max-w-lg mx-auto mt-4">
            <CADESClueBoard />
          </div>

          {/* Conspiracy board showing discovered CADES-side nodes */}
          <div className="max-w-3xl mx-auto mt-4">
            <CADESConspiracyBoard />
          </div>

          {/* Lore footer */}
          <p className="font-mono text-[9px] text-center mt-8 max-w-md mx-auto" style={{ color: P.OFF_WHITE + "40" }}>
            Installed by a Hierarchy contractor. Dual-purpose: therapeutic immersion
            and consciousness energy harvesting for the Matrix of Dreams.
            Elara knew. She chose her moment carefully.
          </p>
        </div>
      </div>
    );
  }

  // ─── PLAYING ───
  if (phase === "playing") {
    return (
      <div className="min-h-screen relative" style={{ background: "#000" }}>
        {!gameReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ background: P.VOID_BLACK }}>
            <img src={CADES_CHARACTERS.ironLionPortrait} alt="" className="w-32 h-32 rounded-full object-cover mb-6 opacity-40" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              <p className="font-mono text-sm tracking-[0.3em]" style={{ color: P.AMBER }}>
                INITIALIZING CADES MATRIX...
              </p>
            </motion.div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={assetUrl("games/cades-fps/index.html")}
          className="w-full h-full absolute inset-0"
          style={{ border: "none", opacity: gameReady ? 1 : 0, transition: "opacity 0.5s" }}
          title="CADES Unit FPS"
          allow="autoplay; fullscreen"
        />
      </div>
    );
  }

  // ─── RESULT ───
  if (phase === "result" && result) {
    const isLastStand = result.mode === "last_stand";
    const isShipDefense = result.mode === "ship_defense";
    const titleColor = result.canon_achieved ? P.GOLD : isShipDefense && result.success ? P.VIOLET : P.AMBER;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{ background: "#000" }}>
        <img src={CADES_CHARACTERS.ironLionPortrait} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center relative z-10">
          {/* Title */}
          <h1 className="font-display text-3xl font-black mb-2" style={{ color: titleColor }}>
            {isLastStand
              ? (result.canon_achieved ? "THE BRIDGE HOLDS" : "[SIGNAL LOST]")
              : isShipDefense
                ? (result.success ? "SHIELDS RESTORED" : "BREACH UNCONTAINED")
                : "SCENARIO COMPLETE"
            }
          </h1>

          {/* Stats */}
          <div className={`${voidPanel} p-4 mb-4 mt-6`}>
            {isLastStand && result.time_held != null && (
              <>
                <p className="font-mono text-sm" style={{ color: P.GOLD }}>
                  TIME HELD: {Math.floor(result.time_held / 3600)}h {Math.floor((result.time_held % 3600) / 60)}m {Math.floor(result.time_held % 60)}s
                </p>
                <p className="font-mono text-xs mt-1" style={{ color: P.OFF_WHITE + "60" }}>
                  WAVES SURVIVED: {result.waves_survived} | LOOP: {result.loop_count}
                </p>
                {result.canon_achieved && (
                  <p className="font-mono text-xs mt-2" style={{ color: P.GOLD }}>
                    THE SHIPS ESCAPED. Iron Lion gave them what they needed.
                  </p>
                )}
              </>
            )}
            {isShipDefense && (
              <>
                <p className="font-mono text-sm" style={{ color: result.success ? P.VIOLET : P.RED }}>
                  {result.success ? "Ark 1047 is secure." : "Inception Ark 1047 has fallen."}
                </p>
                {result.thoughtborn_contacted && (
                  <>
                    <div className="mt-3 -mx-4 overflow-hidden rounded-md border void-border-system">
                      <ResponsiveImage
                        src={CADES_CHARACTERS.thoughtbornLeaderBossSplash}
                        alt="The Thoughtborn Leader"
                        className="w-full h-auto block"
                      />
                    </div>
                    <p className="font-mono text-xs mt-2" style={{ color: P.VIOLET }}>
                      The Thoughtborn made contact.
                    </p>
                  </>
                )}
              </>
            )}
          </div>

          {/* Crew reactions feed — shows what the ship is saying */}
          <div className="mb-4 text-left">
            <CADESFeed limit={4} title="CREW RESPONSE — LIVE FEED" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setPhase("select"); setResult(null); }}
              className="px-6 py-3 rounded-lg font-mono text-sm tracking-wider border"
              style={{ color: P.AMBER, borderColor: P.AMBER + "40", background: P.AMBER + "10" }}
            >
              RETURN TO CADES
            </button>
            <button
              onClick={() => { setPhase("playing"); setGameReady(false); setResult(null); }}
              className="px-6 py-3 rounded-lg font-mono text-sm tracking-wider border"
              style={{ color: P.BONE, borderColor: P.BONE + "20", background: P.BONE + "05" }}
            >
              PLAY AGAIN
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
