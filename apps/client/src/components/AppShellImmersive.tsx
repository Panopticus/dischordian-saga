/* ═══════════════════════════════════════════════════════
   APP SHELL — Immersive Living Ark Navigation

   NO SIDEBAR. NO GAME MENUS. NO SPOILERS.

   The ship IS the navigation. Four persistent buttons:
   - MAP: Full-screen ship schematic (the ONLY way to move between rooms)
   - OPERATIVE: Character sheet, equipment, stats
   - JOURNAL: Quests, lore, clue journal
   - COMMS: Elara dialog, NPC signals, notifications

   Everything else is accessed FROM rooms. Games live inside
   the rooms where they belong. The player discovers features
   by exploring, not by reading a sidebar.

   Design principles:
   - If the player hasn't found it, it doesn't exist
   - Navigation should feel like walking through a ship
   - The UI should be invisible until needed
   - The world should teach the player, not menus
   ═══════════════════════════════════════════════════════ */
import { lazy, Suspense, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  Map, Shield, ScrollText, Radio, X, Camera, Home,
} from "lucide-react";
// Lazy: ShaderOverlay pulls three.js + 5 postprocessing passes
// (EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass)
// into whichever chunk imports it. Eagerly loading from AppShell put
// three.js into the *initial* chunk for every route — even /terms,
// /privacy, /leaderboard. With React.lazy + Suspense it lands in a
// separate chunk only fetched once the shell mounts; on `quality-low`
// the component bails out instantly so cellular / low-end devices skip
// the bloom shader entirely.
const ShaderOverlay = lazy(() => import("@/components/ShaderOverlay"));
import AmbientSkybox from "@/components/AmbientSkybox";
import { VoidAmbientParticles } from "@/engine/VoidAmbientParticles";
import { trpc } from "@/lib/trpc";
import { PhotoMode } from "@/components/PhotoMode";
import CrewAmbientTicker from "@/components/crew/CrewAmbientTicker";
import { motion, AnimatePresence } from "framer-motion";
import { materialize } from "@/engine/voidMotion";
import NotificationBell from "@/components/NotificationBell";
import { ShipThemeOverlay } from "@/components/ShipThemeOverlay";
import TransmissionDeck from "@/components/TransmissionDeck";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useNarrativeEvents } from "@/hooks/useNarrativeEvents";
import { usePetQuestEventBridge } from "@/game/petQuestHooks";
import { useCodexUnlockToasts } from "@/lib/codexUnlockNotifier";
import { useGamification } from "@/contexts/GamificationContext";
import { useNarrativeIntegration } from "@/hooks/useNarrativeIntegration";
import { useIncomingTransmissions } from "@/hooks/useIncomingTransmissions";
import { useLoginAlbumTransmission } from "@/hooks/useLoginAlbumTransmission";
import { usePlayerContext } from "@/hooks/usePlayerContext";
import { useAuth } from "@/_core/hooks/useAuth";
import LoginMemeBroadcast from "@/components/LoginMemeBroadcast";
import LoginMemeMiniCard from "@/components/LoginMemeMiniCard";
import VoiceWhisper from "@/components/VoiceWhisper";
import EngineerRecordingDiscoveryModal from "@/components/EngineerRecordingDiscoveryModal";

const ARK_CONTROL_ROOM = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/ark_control_room_04cb4fe3.png";

/* ─── NAV BAR ITEMS ─── */
const NAV_ITEMS = [
  { id: "map", path: "/ship-map", label: "MAP", icon: Map, color: "var(--energy-primary)" },
  { id: "cabin", path: "/cabin", label: "CABIN", icon: Home, color: "#34d399" },
  { id: "operative", path: "/character-sheet", label: "OPERATIVE", icon: Shield, color: "#a855f7" },
  { id: "journal", path: "/clue-journal", label: "JOURNAL", icon: ScrollText, color: "var(--energy-accent)" },
  { id: "comms", path: "/comms-array", label: "COMMS", icon: Radio, color: "#f87171" },
] as const;

/* ─── ROUTES THAT HIDE THE NAV BAR (fully immersive) ─── */
const IMMERSIVE_ROUTES = ["/ark", "/awakening", "/fight", "/terminus-swarm"];

/* ─── ROUTES WHERE WE SHOW MINIMAL HEADER ─── */
const MINIMAL_HEADER_ROUTES = ["/ark", "/fight", "/terminus-swarm", "/chess", "/duelyst"];

export default function AppShell({ children, elaraTTS: _elaraTTS }: { children: ReactNode; elaraTTS?: any }) {
  const [location] = useLocation();
  const { showPlayer } = usePlayer();
  const { state: gameState } = useGame();
  // Thought Virus infection level drives the corruption shader. Falls back to
  // the legacy narrativeFlags.thought_virus_level when the tRPC query is
  // unavailable (e.g. on first load, pre-auth).
  const virusStatusQuery = trpc.thoughtVirus.getStatus.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: false,
  });
  const virusLoadPct =
    virusStatusQuery.data?.summary.loadPct ??
    (gameState.narrativeFlags?.thought_virus_level as unknown as number) ??
    0;
  const [showTransmissions, setShowTransmissions] = useState(false);
  const [photoModeOpen, setPhotoModeOpen] = useState(false);

  // Activate narrative effects bridge — listens to game events (combat, NPC, room, etc.)
  // and triggers physics-aware CSS narrative effects on the app body
  useNarrativeEvents();

  // Pet quest bridge — listens for `pet-quest-event` + `room-enter` window
  // events and writes the matching PET_QUESTS flags via tRPC. Mounted here
  // so every page that dispatches the existing `room-enter` event (the
  // ArkExplorerPage in particular) automatically progresses pet quests.
  usePetQuestEventBridge();

  // Codex unlock notifier — toasts when the player's level crosses an
  // entry's unlockRequirement. First-run toasts are suppressed (returning
  // players don't get a flood); subsequent level-ups fire one toast per
  // newly-unlocked entry. See plan §A4.
  const gamification = useGamification();
  useCodexUnlockToasts(gamification.level || 0);

  // Narrative integration — lore discovery, morality world effects, cross-game threads,
  // NPC trust consequences. Watches game state and triggers narrative systems automatically.
  useNarrativeIntegration();

  // "TRANSMISSION INCOMING" toast — fires when a new Meme broadcast
  // unlocks. Mounted once globally so it works on every route.
  useIncomingTransmissions();

  // On-login Dischordian Logic transmission. Pops the CRT broadcast
  // modal with the next undelivered track from T01-T09.
  const loginMeme = useLoginAlbumTransmission();

  // TransmissionDeck unlocks when Observation Deck OR Comms Array is discovered
  const hasMediaAccess = !!(gameState.rooms["observation-deck"]?.unlocked || gameState.rooms["comms-array"]?.unlocked);

  // Count discovered rooms for the map badge
  const discoveredRooms = Object.values(gameState.rooms).filter(r => r.unlocked).length;

  // Active quest count for journal badge
  const activeQuests = (gameState.claimedQuestRewards || []).length;

  // Unread signals (NPC discoveries)
  const npcSignals = Object.values(gameState.npcDiscovered || {}).filter(Boolean).length;
  // Combined COMMS-deck pending: NPC signals + login transmissions
  // sitting in the inbox (skipped, muted, or simply unread). The
  // inbox query is gated on auth + the player context that drives it.
  const loginCtxForBadge = usePlayerContext();
  const { isAuthenticated: hasAuthForBadge } = useAuth();
  const inboxBadgeQuery = trpc.transmissions.getLoginTransmissionInbox.useQuery(
    { playerContext: loginCtxForBadge },
    { enabled: hasAuthForBadge, staleTime: 30_000 },
  );
  const loginInboxPending = inboxBadgeQuery.data?.pendingCount ?? 0;
  const commsPending = npcSignals + loginInboxPending;

  // Determine if we're in a fully immersive context
  const isImmersive = IMMERSIVE_ROUTES.some(r => location.startsWith(r));
  const isMinimalHeader = MINIMAL_HEADER_ROUTES.some(r => location.startsWith(r));
  const isAwakening = location.startsWith("/awakening");

  // Hide everything during awakening
  if (isAwakening) {
    return (
      <div className="min-h-screen relative">
        <ShipThemeOverlay />
        {children}
      </div>
    );
  }

  // Immersive routes (Ark, Fight, Terminus) own their own background.
  // Showing the skybox underneath would bleed through translucent
  // layouts; suppress it for those routes.
  const showSkybox = !isImmersive;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ═══ SHADER OVERLAY — Corruption + morality post-processing ═══
          Suspended (no fallback DOM) so the rest of the shell renders
          immediately while three.js + postprocessing passes load. */}
      <Suspense fallback={null}>
        <ShaderOverlay
          corruption={Math.max(0, Math.min(1, (virusLoadPct || 0) / 100))}
          morality={gameState.moralityScore || 0}
          enabled={!isAwakening}
        />
      </Suspense>

      {/* ═══ AMBIENT SKYBOX — Persistent "you are in space" layer.
          Replaces the faded Ark-control-room still, which read as a
          random background image rather than a diegetic void. Routes
          that own their own backdrop (Ark, Fight, Terminus) suppress
          this via isImmersive. ═══ */}
      {showSkybox && <AmbientSkybox />}

      {/* ═══ VOID AMBIENT PARTICLES — Canvas 2D atmosphere layer
          driven by the active VoidTheme.particleEffect. Reads
          data-particles on <html> (set in voidEngine.applyThemeToDOM)
          and paints fireflies / embers / sparks / data / leaves /
          static. Suppressed on immersive routes that own their
          own backdrop, same as the skybox. ═══ */}
      {showSkybox && <VoidAmbientParticles />}

      {/* Legacy cockpit tint — kept for the immersive routes so the
          Ark-control-room still reads while Ark/Fight/Terminus paint
          their own art on top. */}
      {!showSkybox && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src={ARK_CONTROL_ROOM}
            alt=""
            className="w-full h-full object-cover opacity-[0.04]"
            style={{ filter: "blur(2px) saturate(0.3)" }}
          />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(5,2,20,0.85) 0%, color-mix(in oklch, var(--bg-void) 98%, transparent) 70%)"
          }} />
        </div>
      )}

      <ShipThemeOverlay />

      {/* ═══ VOICE WHISPER — Inner voice commentary across all contexts ═══ */}
      <VoiceWhisper />

      {/* ═══ ENGINEER RECORDING DISCOVERY — Act 2 holographic reveal modal ═══ */}
      <EngineerRecordingDiscoveryModal />

      {/* ═══ MINIMAL HEADER — Only shows Ark identity + notifications ═══ */}
      {!isImmersive && (
        <header className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-4 void-surface"
          style={{
            borderRadius: 0,
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
          }}>
          {/* Ship identity */}
          <Link href="/ark" className="flex items-center gap-2 group">
            <div className="w-1.5 h-1.5 rounded-full void-bg-success shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 group-hover:text-white/50 transition-colors">
              ARK 1047 // INCEPTION CLASS
            </span>
          </Link>

          {/* Right side: photo mode + notifications */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhotoModeOpen(true)}
              className="p-1.5 rounded-md text-white/30 hover:text-white/60 transition-colors"
              aria-label="Photo mode"
            >
              <Camera size={14} />
            </button>
            <NotificationBell />
          </div>
        </header>
      )}

      {/* ═══ AMBIENT CREW TICKER — overhears the ship ═══ */}
      {!isImmersive && (
        <div className="fixed top-10 left-0 right-0 z-40 flex justify-center px-4 pt-1 pointer-events-none">
          <div className="pointer-events-auto">
            <CrewAmbientTicker />
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══
          AnimatePresence keyed by pathname gives every client-side
          route change a cross-fade. Immersive routes own their own
          transitions (Ark room crossfade, Fight intro) so we skip
          the outer animation for them — otherwise their custom
          cinematics double up with a generic fade. */}
      <main
        className="flex-1 relative z-10"
        style={{
          paddingTop: !isImmersive ? "2.5rem" : undefined,
          paddingBottom: showPlayer ? "8rem" : "4rem",
          transition: `padding var(--ve-transition-speed, 200ms) var(--ve-transition-ease, ease)`,
        }}
      >
        {isImmersive ? (
          children
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location}
              {...materialize()}
              // Exit is the inverse of materialize — kept inline so
              // route unmounts don't fight mode="wait".
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* ═══ BOTTOM NAV BAR — The only persistent navigation ═══ */}
      {!isImmersive && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-[49] safe-area-bottom void-surface"
          style={{
            borderRadius: 0,
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
          }}
        >
          <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.id === "comms" ? showTransmissions : (location === item.path || location.startsWith(item.path + "/"));
              const badge = item.id === "map" ? discoveredRooms :
                           item.id === "comms" ? commsPending :
                           0;

              // COMMS button opens TransmissionDeck overlay (if media discovered)
              if (item.id === "comms") {
                return (
                  <button
                    key={item.id}
                    onClick={() => hasMediaAccess ? setShowTransmissions(true) : undefined}
                    className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-lg transition-all relative ${!hasMediaAccess ? "opacity-20" : ""}`}
                  >
                    <div className="relative">
                      <Icon size={20} style={{ color: active ? item.color : hasMediaAccess ? "color-mix(in oklch, var(--text-primary) 30%, transparent)" : "color-mix(in oklch, var(--text-primary) 10%, transparent)" }} className="transition-colors" />
                      {active && (
                        <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                      )}
                      {hasMediaAccess && badge > 0 && !active && (
                        <div className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full void-bg-error flex items-center justify-center">
                          <span className="font-mono text-[7px] text-white font-bold">{badge}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.15em] transition-colors" style={{ color: active ? item.color : hasMediaAccess ? "color-mix(in oklch, var(--text-primary) 20%, transparent)" : "color-mix(in oklch, var(--text-primary) 8%, transparent)" }}>
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className="flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-lg transition-all relative"
                >
                  <div className="relative">
                    <Icon
                      size={20}
                      style={{ color: active ? item.color : "color-mix(in oklch, var(--text-primary) 30%, transparent)" }}
                      className="transition-colors"
                    />
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                        style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                      />
                    )}
                    {badge > 0 && !active && (
                      <div className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full void-bg-error flex items-center justify-center">
                        <span className="font-mono text-[7px] text-white font-bold">{badge}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className="font-mono text-[8px] tracking-[0.15em] transition-colors"
                    style={{ color: active ? item.color : "color-mix(in oklch, var(--text-primary) 20%, transparent)" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* ═══ TRANSMISSION DECK (media hub) ═══ */}
      <TransmissionDeck isOpen={showTransmissions} onClose={() => setShowTransmissions(false)} />

      {/* ═══ PHOTO MODE ═══ */}
      <PhotoMode isOpen={photoModeOpen} onClose={() => setPhotoModeOpen(false)} />

      {/* ═══ MOBILE BOTTOM NAV — 5-tab nav for <640px screens ═══ */}
      <MobileBottomNav
        pendingQuests={activeQuests}
        newItems={0}
        onMorePress={() => setShowTransmissions((v) => !v)}
      />

      {/* ═══ LOGIN MEME BROADCAST ═══ */}
      {loginMeme.transmission &&
        (loginMeme.phase === "first-words" ||
          loginMeme.phase === "intro" ||
          loginMeme.phase === "playing" ||
          loginMeme.phase === "outro") && (
          <LoginMemeBroadcast
            transmission={loginMeme.transmission}
            phase={loginMeme.phase}
            onAccept={loginMeme.accept}
            onSkip={loginMeme.skip}
            onMuteFuture={loginMeme.muteFuture}
            onDismiss={loginMeme.dismiss}
            onMinimize={loginMeme.minimize}
            onPhaseChange={loginMeme.setPhase}
            onTvCompleted={loginMeme.reportTvCompleted}
          />
        )}
      {loginMeme.transmission && loginMeme.phase === "minimized" && (
        <LoginMemeMiniCard
          transmission={loginMeme.transmission}
          onExpand={loginMeme.expand}
          onClose={loginMeme.dismiss}
        />
      )}

      {/* ═══ CRT OVERLAY ═══ */}
      <div className="crt-overlay" />
    </div>
  );
}
