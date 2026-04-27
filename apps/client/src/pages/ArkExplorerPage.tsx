import { useGameAreaBGM } from "@/contexts/GameAudioContext";
/* ═══════════════════════════════════════════════════════
   ARK EXPLORER PAGE — Point-and-click room exploration
   Old-school adventure game with clickable hotspots,
   Elara dialog, sound effects, and puzzle mechanics.
   The Living Ark: rooms have daily events that drive revisits.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { dialogOpened, dialogClosed } from "@/lib/dialogState";
import { useGame, ROOM_DEFINITIONS, type HotspotDef, type RoomDef } from "@/contexts/GameContext";
import { resolveRoomStateAsset } from "@/game/roomStateAssets";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import { generateDailyBrief, type RoomEvent } from "@/game/livingArk";
import { processArkEvent, type ArkEventResult } from "@/game/arkEventHandler";
import { useDailyBrief } from "@/hooks/useDailyBrief";
import PageMeta from "@/components/PageMeta";
import RoomAmbientLife from "@/components/RoomAmbientLife";
import ArkFastTravelModal from "@/components/ArkFastTravelModal";
import NPCDialog, { buildFirstContactScene, type NPCDialogScene, type NPCDialogChoice } from "@/components/NPCDialog";
import type { FactionNPCId } from "@/game/factionNPCs";
import { getAvailableBanter, type CompanionBanter } from "@/game/companionDeepening";
import { dispatchNarrativeEffect, dispatchRoomEnter } from "@/hooks/useNarrativeEvents";
import { getActiveVoices, type VoiceUtterance } from "@/game/innerVoices";
import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";
import { dispatchRememberThis } from "@/game/narrativeSystems";
import { getActiveBreadcrumbs, type BreadcrumbChain } from "@/game/explorationSystems";
import { getCluesForRoom, type EnvironmentalClue } from "@/game/puzzleClues";
import { getAdjustedTrustGain } from "@/game/npcDailyRotation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Terminal, Eye, Package, DoorOpen, Hand, Lock, ChevronRight,
  MapPin, Compass, Zap, Ship, ArrowLeft, X, Star, Volume2, VolumeX,
  Maximize2, Minimize2, Music, Swords, Search, BookOpen, Tv,
  FlaskConical, Shield, User, Map as MapIcon, Flame
} from "lucide-react";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";
import { toast } from "sonner";
import { enqueue as enqueueCompanionLine } from "@/companion/companionScheduler";
import { lockedDoorLineId } from "@shared/lockedDoorLines";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";
import PuzzleModal, { ROOM_PUZZLES } from "@/components/PuzzleSystem";
import RoomTransition from "@/components/RoomTransition";
import RoomTutorialDialog, { hasRoomDialog } from "@/components/RoomTutorialDialog";
import HolographicElara from "@/components/HolographicElara";
import SecretTransmissionOverlay from "@/components/SecretTransmissionOverlay";
import { getRoomTransmissions, getElaraVariant, type SecretTransmission } from "@/data/moralityStoryBranches";
import AlienSymbolPuzzle from "@/components/AlienSymbolPuzzle";
import FastTravelPanel from "@/components/FastTravelPanel";
import ItemDetailModal from "@/components/ItemDetailModal";
import DnaDeviceOfferDialog from "@/components/DnaDeviceOfferDialog";
import ParallaxRoom from "@/components/ParallaxRoom";
import { MobileNarratorSlot } from "@/components/MobileNarratorSlot";
import {
  getActiveEngineerHook,
  getActivePreludeBeats,
  mergeBeatFlags,
  toNarratorRoomId,
} from "@shared/mobileNarrator";
import { isRoomUnlocked as isPreludeRoomUnlocked } from "@shared/preludeRoomGate";
import {
  resolveVerbResponse,
  type CryoMysteryHotspotId,
} from "@shared/cryoBayMystery";
import LoreTutorialEngine from "@/components/LoreTutorialEngine";
import NarrativeTrigger from "@/components/NarrativeTrigger";
import InlineShipMap from "@/components/InlineShipMap";
import { getTutorialById, type TutorialReward } from "@/data/loreTutorials";
import { crossfadeToRoom } from "@/lib/ambientSounds";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp";

/* ─── HOTSPOT ICON MAP ─── */
function getHotspotIcon(type: HotspotDef["type"]) {
  switch (type) {
    case "terminal": return Terminal;
    case "item": return Star;
    case "door": return DoorOpen;
    case "examine": return Eye;
    case "interact": return Hand;
    default: return Eye;
  }
}

function getHotspotColor(type: HotspotDef["type"]) {
  switch (type) {
    case "terminal":
      return {
        border: "color-mix(in oklch, var(--energy-primary) 50%, transparent)",
        bg: "color-mix(in oklch, var(--energy-primary) 15%, transparent)",
        glow: "color-mix(in oklch, var(--energy-primary) 30%, transparent)",
        text: "var(--energy-primary)",
      };
    case "item":
      return {
        border: "color-mix(in oklch, var(--energy-premium) 50%, transparent)",
        bg: "color-mix(in oklch, var(--energy-premium) 15%, transparent)",
        glow: "color-mix(in oklch, var(--energy-premium) 30%, transparent)",
        text: "var(--energy-premium)",
      };
    case "door":
      return {
        border: "color-mix(in oklch, var(--energy-primary) 50%, transparent)",
        bg: "var(--glass-border)",
        glow: "color-mix(in oklch, var(--energy-primary) 30%, transparent)",
        text: "var(--energy-primary)",
      };
    case "examine":
      return {
        border: "color-mix(in oklch, var(--energy-system) 50%, transparent)",
        bg: "color-mix(in oklch, var(--energy-system) 15%, transparent)",
        glow: "color-mix(in oklch, var(--energy-system) 30%, transparent)",
        text: "var(--energy-system)",
      };
    case "interact":
      return {
        border: "color-mix(in oklch, var(--energy-success) 50%, transparent)",
        bg: "color-mix(in oklch, var(--energy-success) 15%, transparent)",
        glow: "color-mix(in oklch, var(--energy-success) 30%, transparent)",
        text: "var(--energy-success)",
      };
  }
}

/* ─── FEATURE ROUTE ICON MAP ─── */
function getFeatureIcon(action: string | undefined) {
  if (!action) return null;
  switch (action) {
    case "/character-sheet": return User;
    case "/board": return MapIcon;
    case "/search": return Search;
    case "/codex": return BookOpen;
    case "/watch": return Tv;
    case "/lore-tutorials": return BookOpen;
    case "/discography": return Music;
    case "/research-lab": return FlaskConical;
    case "/research-minigame": return FlaskConical;
    case "/forge": return Flame;
    case "/card-game": return Swords;
    case "/arena": return Shield;
    case "/war-map": return MapIcon;
    case "/trade-empire": return Package;
    case "/fighting-game": return Swords;
    default: return null;
  }
}

/* ─── ELARA POPUP ─── */
function ElaraPopup({ text, onClose, voUrl }: { text: string; onClose: () => void; voUrl?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voPlaying, setVoPlaying] = useState(false);

  // Play VO audio when popup opens — significantly louder than BGM
  useEffect(() => {
    if (voUrl) {
      const audio = new Audio(voUrl);
      audio.volume = 0.92;
      audioRef.current = audio;
      audio.play().then(() => setVoPlaying(true)).catch(() => {/* autoplay blocked */});
      audio.onended = () => setVoPlaying(false);
      return () => {
        audio.pause();
        audio.onended = null;
        audioRef.current = null;
        setVoPlaying(false);
      };
    }
  }, [voUrl]);

  // Stop VO on close
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onClose();
  };

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      /* void-ignore — sidebar fixed width on sm+ breakpoint */
      className="fixed top-4 left-4 right-4 sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 sm:w-[420px] z-50"
    >
      <div
        className="rounded-lg p-4 relative"
        style={{
          background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
          border: "1px solid color-mix(in oklch, var(--energy-primary) 25%, transparent)",
          boxShadow: "0 0 var(--space-lg) color-mix(in oklch, var(--energy-primary) 8%, transparent), 0 var(--space-md) var(--space-2xl) color-mix(in oklch, var(--bg-void) 50%, transparent)",
          // void-ignore — 20px is the fallback default when --physics-blur is unset (flat physics)
          backdropFilter: "blur(var(--physics-blur, 20px))",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-md border border-[var(--glass-border)] text-muted-foreground/70 hover:text-white hover:bg-muted/40 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="flex gap-3">
          <img
            src={ELARA_PORTRAIT}
            alt="Elara"
            className="w-10 h-10 rounded-full object-cover border border-[var(--neon-cyan)]/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mb-1">ELARA</p>
            <p className="font-mono text-xs text-foreground/90 leading-relaxed">
              {displayed}
              {!done && <span className="inline-block w-1.5 h-3 bg-[var(--neon-cyan)] ml-0.5 animate-pulse" />}
            </p>
          </div>
        </div>
        {done && (
          <button
            onClick={handleClose}
            className="mt-2 w-full text-center font-mono text-[10px] text-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] transition-colors"
          >
            [dismiss]
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── ROOM SCENE ─── */
function RoomScene({
  room,
  onHotspotClick,
  itemsCollected,
  fastTravelUnlocked = false,
  commsRelayComplete = false,
  roomsWithEvents = new Set<string>(),
}: {
  room: RoomDef;
  onHotspotClick: (hotspot: HotspotDef) => void;
  itemsCollected: string[];
  fastTravelUnlocked?: boolean;
  commsRelayComplete?: boolean;
  roomsWithEvents?: Set<string>;
}) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const { state: gameStateForArt } = useGame();
  // State-aware room backdrop for Section F mystery rooms. Falls through
  // to the room definition's legacy imageUrl for every other room.
  const roomArtUrl = (room.id === "cryo-bay" || room.id === "medical-bay")
    ? resolveRoomStateAsset(room.id as "cryo-bay" | "medical-bay", gameStateForArt.narrativeFlags)
    : room.imageUrl;
  const [showHotspots, setShowHotspots] = useState(() => {
    try {
      const v = localStorage.getItem("loredex-show-hotspots");
      return v === null ? true : v === "true";
    } catch { return true; }
  });

  // Listen for settings page toggle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.visible === "boolean") {
        setShowHotspots(detail.visible);
      }
    };
    window.addEventListener("hotspot-visibility-changed", handler);
    return () => window.removeEventListener("hotspot-visibility-changed", handler);
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden group">
      {/* Room background image with parallax depth effect. For the
          Section F murder-mystery rooms, roomArtUrl swaps between the
          initial/investigating/victim-identified/case-open-later
          variants based on the player's narrative flags.

          fit="contain" so hotspot %-coords (authored against the full
          source image) line up with the visible art at every viewport.
          With cover, anything outside the container's aspect ratio got
          cropped and the hotspots drifted off the artwork they label. */}
      <ParallaxRoom
        key={roomArtUrl}
        layers={[{ src: roomArtUrl, depth: -0.3 }]}
        className="absolute inset-0"
        fit="contain"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--energy-primary) 15%, transparent) 2px, color-mix(in oklch, var(--energy-primary) 15%, transparent) 4px)",
      }} />

      {/* Per-room ambient life overlay — keyframed CSS-only particles
          and sweeps themed per room (cryo vapor, bridge star drift,
          engineering heat haze + sparks, medical diagnostic line +
          IV drip, antiquarian library dust motes). Unknown rooms
          render nothing so the default "image + scanlines" experience
          is preserved. */}
      <RoomAmbientLife roomId={room.id} />

      {/* Markers toggle moved to Settings page */}

      {/* Hotspot markers */}
      <AnimatePresence>
        {showHotspots && room.hotspots.map((hotspot) => {
          const colors = getHotspotColor(hotspot.type);
          const Icon = getHotspotIcon(hotspot.type);
          const FeatureIcon = hotspot.type === "terminal" ? getFeatureIcon(hotspot.action) : null;
          const isCollected = hotspot.type === "item" && hotspot.action && itemsCollected.includes(hotspot.action);
          const isHovered = hoveredHotspot === hotspot.id;
          const isEasterEgg = hotspot.id.startsWith("egg-");

          if (isCollected) return null;

          return (
            <motion.div
              key={hotspot.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute cursor-pointer z-10"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              onMouseEnter={() => setHoveredHotspot(hotspot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={() => onHotspotClick(hotspot)}
            >
              {/* Clickable area highlight */}
              <div
                className="absolute inset-0 rounded-md transition-all duration-300"
                style={{
                  border: `1px solid ${isHovered ? colors.border : "transparent"}`,
                  background: isHovered ? colors.bg : "transparent",
                  boxShadow: isHovered ? `0 0 var(--space-md) ${colors.glow}` : "none",
                }}
              />

              {/* Icon marker */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  opacity: isEasterEgg ? (isHovered ? 0.6 : 0.08) : (isHovered ? 1 : 0.85),
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
                }}
              >
                <div
                  className={`${isEasterEgg ? "w-4 h-4" : hotspot.type === "door" ? "w-10 h-10" : "w-8 h-8"} rounded-full flex items-center justify-center`}
                  style={{
                    background: isEasterEgg ? "transparent" : hotspot.type === "door" ? "color-mix(in oklch, var(--electric-blue) 25%, transparent)" : colors.bg,
                    border: isEasterEgg ? "none" : hotspot.type === "door" ? "2px solid color-mix(in oklch, var(--electric-blue) 70%, transparent)" : `1.5px solid ${colors.border}`,
                    boxShadow: isEasterEgg ? "none" : hotspot.type === "door" ? "0 0 var(--space-md) color-mix(in oklch, var(--electric-blue) 50%, transparent), 0 0 var(--space-xl) var(--glass-border)" : `0 0 var(--space-sm) ${colors.glow}`,
                  }}
                >
                  {!isEasterEgg && <Icon size={hotspot.type === "door" ? 18 : 14} style={{ color: colors.text }} />}
                  {isEasterEgg && <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.text, opacity: 0.4 }} />}
                </div>
                {/* Feature sub-icon badge for terminal hotspots */}
                {FeatureIcon && !isEasterEgg && (
                  <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20"
                    style={{
                      background: "color-mix(in oklch, var(--energy-primary) 85%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--energy-primary) 50%, transparent)",
                      boxShadow: "0 0 var(--space-xs) color-mix(in oklch, var(--energy-primary) 40%, transparent)",
                    }}
                  >
                    <FeatureIcon size={8} style={{ color: "var(--bg-void)" }} />
                  </div>
                )}
                {/* Door pulse rings - always visible, slower pulse */}
                {hotspot.type === "door" && (
                  <>
                    <div
                      className="absolute inset-[-4px] rounded-full animate-ping"
                      style={{ border: "2px solid color-mix(in oklch, var(--electric-blue) 40%, transparent)", opacity: 0.5, animationDuration: "2s" }}
                    />
                    <div
                      className="absolute inset-[-8px] rounded-full animate-ping"
                      style={{ border: "1px solid var(--glass-border)", opacity: 0.3, animationDuration: "3s" }}
                    />
                  </>
                )}
                {/* Pulse ring — only for regular items, not Easter eggs */}
                {hotspot.type === "item" && !isEasterEgg && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ border: `1px solid ${colors.border}`, opacity: 0.3 }}
                  />
                )}
                {/* Special pulsing indicator for nav-console before puzzle is solved */}
                {hotspot.id === "nav-console" && !fastTravelUnlocked && (
                  <>
                    <div
                      className="absolute inset-[-6px] rounded-full animate-ping"
                      style={{ border: "2px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)", opacity: 0.6, animationDuration: "1.5s" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-ping"
                      style={{ border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)", opacity: 0.3, animationDuration: "2.5s" }}
                    />
                    {/* Exclamation badge */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold z-20"
                      style={{
                        background: "color-mix(in oklch, var(--energy-premium) 90%, transparent)",
                        color: "var(--bg-void)",
                        boxShadow: "0 0 var(--space-xs) color-mix(in oklch, var(--energy-premium) 60%, transparent)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      !
                    </div>
                  </>
                )}
                {/* Special pulsing indicator for key items (keycards/master keys) */}
                {(hotspot.id === "observation-keycard" || hotspot.id === "captains-master-key") && (
                  <>
                    <div
                      className="absolute inset-[-6px] rounded-full animate-ping"
                      style={{ border: "2px solid color-mix(in oklch, var(--energy-premium) 60%, transparent)", opacity: 0.6, animationDuration: "1.5s" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-ping"
                      style={{ border: "1px solid color-mix(in oklch, var(--energy-premium) 30%, transparent)", opacity: 0.3, animationDuration: "2.5s" }}
                    />
                    {/* Key badge */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20"
                      style={{
                        background: "color-mix(in oklch, var(--energy-premium) 90%, transparent)",
                        color: "var(--bg-void)",
                        boxShadow: "0 0 var(--space-xs) color-mix(in oklch, var(--energy-premium) 60%, transparent)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h3v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                    </div>
                  </>
                )}
                {/* Special pulsing indicator for comms-relay before quest is completed */}
                {hotspot.id === "comms-relay" && !commsRelayComplete && (
                  <>
                    <div
                      className="absolute inset-[-6px] rounded-full animate-ping"
                      style={{ border: "2px solid color-mix(in oklch, var(--energy-system) 60%, transparent)", opacity: 0.6, animationDuration: "1.8s" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-ping"
                      style={{ border: "1px solid color-mix(in oklch, var(--energy-system) 30%, transparent)", opacity: 0.3, animationDuration: "2.8s" }}
                    />
                    {/* Signal badge */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold z-20"
                      style={{
                        background: "color-mix(in oklch, var(--energy-system) 90%, transparent)",
                        color: "var(--text-primary)",
                        boxShadow: "0 0 var(--space-xs) color-mix(in oklch, var(--energy-system) 60%, transparent)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      !
                    </div>
                  </>
                )}
              </div>
              {/* Always-visible door label with room name + Living Ark event badge */}
              {hotspot.type === "door" && !isEasterEgg && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 -translate-y-full pointer-events-none">
                  <div className="px-2.5 py-1 rounded flex items-center gap-1.5" style={{
                    background: "var(--bg-overlay)",
                    border: `1px solid ${hotspot.action && roomsWithEvents.has(hotspot.action.replace(/-/g, "_")) ? "color-mix(in oklch, var(--energy-premium) 60%, transparent)" : "color-mix(in oklch, var(--electric-blue) 35%, transparent)"}`,
                    boxShadow: hotspot.action && roomsWithEvents.has(hotspot.action.replace(/-/g, "_")) ? "0 0 var(--space-sm) color-mix(in oklch, var(--energy-premium) 40%, transparent)" : "0 0 var(--space-sm) var(--glass-border)",
                  }}>
                    <p className="font-mono text-[9px] void-text-energy tracking-wider whitespace-nowrap font-bold">
                      ▶ {hotspot.name}
                    </p>
                    {hotspot.action && roomsWithEvents.has(hotspot.action.replace(/-/g, "_")) && (
                      <span className="w-2 h-2 rounded-full void-bg-sunk animate-pulse" title="Event available" />
                    )}
                  </div>
                </div>
              )}

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full z-30 pointer-events-none"
                    /* void-ignore — fixed minWidth for hotspot tooltips, not a spacing token */ style={{ minWidth: "180px" }}
                  >
                    <div
                      className="rounded-md px-3 py-2"
                      style={{
                        background: "var(--bg-void)",
                        border: `1px solid ${colors.border}`,
                        boxShadow: `0 0 var(--space-sm) ${colors.glow}`,
                      }}
                    >
                      <p className="font-mono text-[10px] font-bold" style={{ color: colors.text }}>{hotspot.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground/70 mt-0.5">{hotspot.description}</p>
                      <p className="font-mono text-[8px] mt-1 tracking-wider" style={{ color: colors.text, opacity: 0.6 }}>
                        {hotspot.type === "door" ? "ENTER" : hotspot.type === "terminal" ? "ACCESS" : hotspot.type === "item" ? "COLLECT" : "EXAMINE"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Room name overlay */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--signal-green)] shadow-[0_0_6px_var(--signal-green)]" />
          <span className="font-display text-sm font-bold tracking-[0.15em] text-foreground drop-shadow-lg">{room.name.toUpperCase()}</span>
        </div>
        <p className="font-mono text-[9px] text-muted-foreground/60 ml-4 tracking-wider">
          DECK {room.deck} // {room.deckName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/** Rewrite `/forge` to `/engineers-bench` once the player has entered
 *  Act 2. Same room, same recipe data; the Bench is the diegetic Act 2
 *  presentation of the forge (§6.2). All other routes pass through
 *  unchanged. */
function resolveActionRoute(
  action: string | undefined,
  flags: Record<string, unknown> | undefined,
): string | undefined {
  if (!action) return action;
  if (action === "/forge" && flags?.act_2_started) {
    return "/engineers-bench";
  }
  return action;
}

/* ─── MAIN EXPLORER PAGE ─── */
export default function ArkExplorerPage() {
  const {
    state, enterRoom, collectItem, markElaraDialogSeen,
    isRoomUnlocked, canUnlockRoom, getRoomDef, getRoomState,
    setNarrativeFlag, isTutorialCompleted, completeTutorial, shiftMorality, collectCard,
    adjustNpcTrust, discoverNpc, adjustHumanTrust, adjustElaraTrust,
    incrementNpcConversation, revealNpcSecret, setNpcCallback,
    logClue, grantMysteryItem,
  } = useGame();
  const { discoverEntry } = useGamification();
  const { setRoomAmbience, playSFX, initAudio, audioReady } = useSound();
  const { notify, notifyAchievement } = useNotificationQueue();
  useGameAreaBGM("ark");
  const [, navigate] = useLocation();
  const [elaraText, setElaraText] = useState<string | null>(null);
  const [elaraVoUrl, setElaraVoUrl] = useState<string | undefined>(undefined);
  const [showOnboardingTutorial, setShowOnboardingTutorial] = useState(false);
  const [activeTransmission, setActiveTransmission] = useState<SecretTransmission | null>(null);
  const { discoverTransmission, isTransmissionDiscovered } = useGame();

  // Living Ark: daily events that drive room revisits.
  //
  // Task 2.2 — The `completeEvent` mutation is how we land server-authoritative
  // rewards when the player taps the Living Ark notification. Its onSuccess
  // handler (inside useDailyBrief) also takes care of fanning out trust
  // changes, narrative flags, and reward toasts, so the local click handler
  // below only has to do visual-effect work.
  //
  // We still generate the *display* events client-side from narrativeFlags +
  // elaraTrust, because the server daily brief pool lives in dailyBrief.ts
  // and uses a different generator — the visible notification ids need to
  // match whatever the player is looking at in this page.
  const { completeEvent: completeLivingArkEvent } = useDailyBrief();
  const dailyBrief = useMemo(() => {
    const daySeed = Math.floor(Date.now() / 86400000);
    const act = state.narrativeFlags?.act_1_complete ? (state.narrativeFlags?.act_2_complete ? 2 : 1) : 0;
    const trust = (state as any).elaraTrust ?? 10;
    const completed = new Set<string>(
      Object.keys(state.narrativeFlags || {}).filter(k => k.startsWith("tome_") || k.startsWith("music_"))
    );
    return generateDailyBrief(daySeed, act, trust, completed);
  }, [state.narrativeFlags, (state as any).elaraTrust]);

  // Rooms with active events today (for door badges)
  const roomsWithEvents = useMemo(() => {
    const rooms = new Set<string>();
    if (dailyBrief.gameplay) rooms.add(dailyBrief.gameplay.roomId);
    if (dailyBrief.story) rooms.add(dailyBrief.story.roomId);
    if (dailyBrief.relationship) rooms.add(dailyBrief.relationship.roomId);
    return rooms;
  }, [dailyBrief]);

  // Dispatch dialog-active events for QuestTracker auto-minimize
  useEffect(() => {
    if (elaraText) {
      window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: true } }));
    }
  }, [elaraText]);


  // NPC Dialog state (triggered by Ark events)
  const [npcDialogScene, setNpcDialogScene] = useState<NPCDialogScene | null>(null);
  const [banterText, setBanterText] = useState<string | null>(null);

  // Companion banter trigger on room entry (BioWare-style)
  useEffect(() => {
    if (!state.currentRoomId) return;
    const roomKey = state.currentRoomId.replace(/-/g, "_");
    const discovered = new Set<string>(["elara"]); // Elara always discovered
    if (state.humanContactMade) discovered.add("the_human");
    for (const [npcId, disc] of Object.entries(state.npcDiscovered || {})) {
      if (disc) discovered.add(npcId);
    }
    const trustMap: Record<string, number> = { elara: state.elaraTrust || 10, the_human: state.humanTrust || 0 };
    for (const [npcId, trust] of Object.entries(state.npcTrust || {})) {
      trustMap[npcId] = trust;
    }
    const triggered = new Set<string>(Object.keys(state.narrativeFlags || {}).filter(k => k.startsWith("banter_")));
    const banter = getAvailableBanter(roomKey, discovered, trustMap, triggered);
    if (banter) {
      // Show banter after a delay (after Elara intro)
      const timer = setTimeout(() => {
        const text = banter.lines.map(l => `${l.speaker === "elara" ? "Elara" : l.speaker.replace(/_/g, " ")}: "${l.text}"`).join("\n");
        setBanterText(text);
        setNarrativeFlag(`banter_${banter.id}`, true);
        // Auto-dismiss after reading time
        setTimeout(() => setBanterText(null), 12000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.currentRoomId]);

  // Dispatch room-enter narrative effect for physics-aware screen animation
  useEffect(() => {
    if (state.currentRoomId) {
      dispatchRoomEnter(state.currentRoomId);
    }
  }, [state.currentRoomId]);

  // Inner voice whisper on room entry — skill voices comment on surroundings
  const [voiceWhisper, setVoiceWhisper] = useState<VoiceUtterance | null>(null);
  useEffect(() => {
    if (!state.currentRoomId) return;
    const roomKey = state.currentRoomId.replace(/-/g, "_");
    const skills = (state as any).innerVoiceSkills ?? {};
    const voices = getActiveVoices({ type: "room_enter", roomId: roomKey }, skills, 1);
    if (voices.length > 0) {
      const timer = setTimeout(() => {
        setVoiceWhisper(voices[0]);
        setTimeout(() => setVoiceWhisper(null), 8000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.currentRoomId]);

  // Breadcrumb chain: after completing something, Elara announces what activated elsewhere
  const [breadcrumbMessage, setBreadcrumbMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!state.currentRoomId) return;
    const completedActions = new Set<string>(
      Object.keys(state.narrativeFlags || {}).map(k => k) // All flags are potential actions
    );
    const crumbs = getActiveBreadcrumbs(completedActions, state.currentRoomId.replace(/-/g, "_"));
    if (crumbs.length > 0) {
      const top = crumbs[0];
      // Show after room loads + Elara intro + banter
      const timer = setTimeout(() => {
        setBreadcrumbMessage(top.elaraMessage);
        setTimeout(() => setBreadcrumbMessage(null), 8000);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [state.currentRoomId, state.narrativeFlags]);

  // Puzzle clues visible in current room
  const roomClues = useMemo(() => {
    if (!state.currentRoomId) return [];
    const roomKey = state.currentRoomId.replace(/-/g, "_");
    return getCluesForRoom(roomKey);
  }, [state.currentRoomId]);

  const [gameHint, setGameHint] = useState<ArkEventResult["gameHint"] | null>(null);

  const [puzzleRoomId, setPuzzleRoomId] = useState<string | null>(null);
  const [showNavPuzzle, setShowNavPuzzle] = useState(false);
  const [showDnaDeviceOffer, setShowDnaDeviceOffer] = useState(false);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const fastTravelUnlocked = !!state.narrativeFlags["fast_travel_unlocked"];
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("loredex_solved_puzzles");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [tutorialRoomId, setTutorialRoomId] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("loredex_completed_tutorials");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [transition, setTransition] = useState<{
    fromRoom: string;
    toRoom: string;
    toRoomName: string;
    toRoomImage: string;
    isNewRoom: boolean;
  } | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenRef = useCallback((node: HTMLDivElement | null) => {
    if (node) (window as any).__arkExplorerRef = node;
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = (window as any).__arkExplorerRef as HTMLDivElement | undefined;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
        // Try to lock landscape
        try {
          await (screen as any).orientation?.lock?.("landscape");
        } catch { /* not supported */ }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        try {
          (screen as any).orientation?.unlock?.();
        } catch { /* silent */ }
      }
    } catch { /* silent */ }
  }, []);

  // Listen for fullscreen changes (e.g. user presses Escape)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const currentRoom = state.currentRoomId ? getRoomDef(state.currentRoomId) : null;
  const currentRoomState = state.currentRoomId ? getRoomState(state.currentRoomId) : null;

  // Witnessing §1.2 + §1.4 + §2.7 — compute the canonical
  // NarratorRoomId and the active narrative beat flag set for the
  // current room. Memoized per (room, visit-count, engineer-hook
  // state) so the slot component doesn't reseed on every re-render.
  const witnessingNarratorRoomId = useMemo(
    () => toNarratorRoomId(state.currentRoomId),
    [state.currentRoomId],
  );
  const witnessingBeatFlags = useMemo(() => {
    if (!witnessingNarratorRoomId) return undefined;
    const visitCount = state.currentRoomId
      ? state.rooms[state.currentRoomId]?.visitCount ?? 0
      : 0;
    const prelude = getActivePreludeBeats(witnessingNarratorRoomId, visitCount);
    // §2.7 Archives opener — fires only when the player has the
    // burnt Seer's card (gameplay sets prelude_burnt_card_found
    // on the §2.6 crew mission 3 reward).
    const engineer = getActiveEngineerHook(
      witnessingNarratorRoomId,
      visitCount,
      {
        burntCardFound: !!state.narrativeFlags?.prelude_burnt_card_found,
        openerPlayed: !!state.narrativeFlags?.engineer_archives_opener_played,
      },
    );
    return mergeBeatFlags(prelude, engineer);
  }, [
    witnessingNarratorRoomId,
    state.currentRoomId,
    state.rooms,
    state.narrativeFlags?.prelude_burnt_card_found,
    state.narrativeFlags?.engineer_archives_opener_played,
  ]);

  // Persist solved puzzles
  useEffect(() => {
    try {
      localStorage.setItem("loredex_solved_puzzles", JSON.stringify(Array.from(solvedPuzzles)));
    } catch { /* ignore */ }
  }, [solvedPuzzles]);

  // Default to cryo-bay if no current room
  useEffect(() => {
    if (!state.currentRoomId && state.phase !== "FIRST_VISIT" && state.phase !== "AWAKENING") {
      enterRoom("cryo-bay");
    }
  }, [state.currentRoomId, state.phase, enterRoom]);

  // Initialize audio if not ready
  useEffect(() => {
    if (!audioReady) {
      const handleClick = () => {
        initAudio().catch(() => {});
        window.removeEventListener("click", handleClick);
      };
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [audioReady, initAudio]);

  // Change ambient sound when room changes
  useEffect(() => {
    if (state.currentRoomId && audioReady) {
      setRoomAmbience(state.currentRoomId);
    }
  }, [state.currentRoomId, audioReady, setRoomAmbience]);

  // Living Ark: trigger NPC event notification when entering a room with an active event
  const [activeRoomEvent, setActiveRoomEvent] = useState<RoomEvent | null>(null);
  useEffect(() => {
    if (!state.currentRoomId) return;
    const roomKey = state.currentRoomId.replace(/-/g, "_");
    const events = [dailyBrief.gameplay, dailyBrief.story, dailyBrief.relationship];
    const match = events.find(e => e && e.roomId === roomKey);
    if (match && match.id !== activeRoomEvent?.id) {
      // Show event notification after a short delay (let the room load first)
      setTimeout(() => setActiveRoomEvent(match), 1500);
    } else if (!match) {
      setActiveRoomEvent(null);
    }
  }, [state.currentRoomId, dailyBrief, activeRoomEvent]);

  // Play contextual music when entering a room
  const { playForRoom: playMusicForRoom } = useAmbientMusic();
  useEffect(() => {
    if (state.currentRoomId) {
      playMusicForRoom(state.currentRoomId);
    }
  }, [state.currentRoomId, playMusicForRoom]);

  // Show Elara intro on first visit — with morality variant dialog
  useEffect(() => {
    if (currentRoom && currentRoomState && !currentRoomState.elaraDialogSeen && currentRoomState.visitCount <= 1) {
      // Check for morality-variant Elara dialog
      const moralityVariant = getElaraVariant(state.moralityScore, currentRoom.id);
      setElaraText(moralityVariant || currentRoom.elaraIntro);
      if (!moralityVariant && currentRoom.elaraIntroVoUrl) {
        setElaraVoUrl(currentRoom.elaraIntroVoUrl);
      } else {
        setElaraVoUrl(undefined);
      }
      markElaraDialogSeen(currentRoom.id);
      if (audioReady) playSFX("dialog_open");
    }
  }, [currentRoom?.id, currentRoomState?.elaraDialogSeen, currentRoomState?.visitCount, audioReady, state.moralityScore]);

  const unlockedRoomIds = useMemo(() => {
    const set = new Set<string>();
    ROOM_DEFINITIONS.forEach(r => {
      if (state.rooms[r.id]?.unlocked) set.add(r.id);
    });
    return set;
  }, [state.rooms]);

  // Cmd/Ctrl+K opens the searchable fast-travel modal once the
  // player has solved the nav-console puzzle. Gated behind
  // fastTravelUnlocked so pre-puzzle players don't get a keyboard
  // shortcut that exposes rooms they haven't earned yet.
  const [fastTravelModalOpen, setFastTravelModalOpen] = useState(false);
  useEffect(() => {
    if (!fastTravelUnlocked) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setFastTravelModalOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fastTravelUnlocked]);
  const unlockedRoomDefs = useMemo(
    () => ROOM_DEFINITIONS.filter((r) => unlockedRoomIds.has(r.id)),
    [unlockedRoomIds],
  );

  // Check if a room requires a puzzle to enter
  const roomNeedsPuzzle = useCallback((roomId: string): boolean => {
    const puzzle = ROOM_PUZZLES[roomId];
    if (!puzzle) return false;
    if (solvedPuzzles.has(roomId)) return false;
    // Keycard puzzles need the item
    if (puzzle.type === "keycard" && puzzle.requiredItem) {
      return !state.itemsCollected.includes(puzzle.requiredItem);
    }
    return true;
  }, [solvedPuzzles, state.itemsCollected]);

  // Navigate to room with transition cutscene
  const navigateWithTransition = useCallback((targetRoomId: string) => {
    const targetDef = getRoomDef(targetRoomId);
    if (!targetDef) return;

    // Witnessing §2.2 — the Prelude hard-gated 10-room order.
    // Refuse transitions to rooms that are still locked behind
    // earlier cleaning steps. Only applies during the Prelude
    // (narrativeAct === 0); Act 1+ navigates freely.
    const cleanedMap: Record<string, boolean> = {};
    for (const [id, room] of Object.entries(state.rooms)) {
      if ((room?.visitCount ?? 0) > 0) cleanedMap[id] = true;
    }
    if (
      !isPreludeRoomUnlocked(targetRoomId, {
        narrativeAct: state.narrativeAct ?? 0,
        roomCleanedMap: cleanedMap,
      })
    ) {
      // F11 — route through the companion scheduler so Elara (or the
      // Human, where appropriate) speaks the locked-door reason in her
      // own voice, using a line that references something the player
      // has actually seen. Fallback sonner survives only if no line
      // resolves (unlikely given the generic fallback in lockedDoorLines).
      const preludeComplete = Boolean(state.narrativeFlags?.prelude_complete);
      const bridgeDesignationFound = Boolean(
        state.narrativeFlags?.bridge_ark_designation_found ||
          state.clueJournal?.some(c => c.id === "clue-bridge-01"),
      );
      const lineRef = lockedDoorLineId(targetRoomId, "prelude", {
        preludeComplete,
        bridgeDesignationFound,
      });
      const ok = enqueueCompanionLine(lineRef);
      if (!ok) {
        // Last-ditch fallback so the player is never silent on the door.
        toast.info("The door is sealed.", {
          description:
            "There's still an earlier part of the ship you haven't finished cleaning. The Ark is patient.",
          duration: 5000,
        });
      }
      return;
    }

    const isNew = !state.rooms[targetRoomId]?.visited;
    const fromRoom = state.currentRoomId || "cryo-bay";
    if (audioReady) playSFX("room_enter");
    const toRoomImage = (targetRoomId === "cryo-bay" || targetRoomId === "medical-bay")
      ? resolveRoomStateAsset(targetRoomId, state.narrativeFlags)
      : targetDef.imageUrl;
    setTransition({
      fromRoom,
      toRoom: targetRoomId,
      toRoomName: targetDef.name,
      toRoomImage,
      isNewRoom: isNew,
    });
  }, [getRoomDef, state.rooms, state.currentRoomId, state.narrativeAct, state.narrativeFlags, audioReady, playSFX]);

  // Persist completed tutorials
  useEffect(() => {
    try {
      localStorage.setItem("loredex_completed_tutorials", JSON.stringify(Array.from(completedTutorials)));
    } catch { /* ignore */ }
  }, [completedTutorials]);

  const handleTransitionComplete = useCallback(() => {
    if (!transition) return;
    enterRoom(transition.toRoom);
    discoverEntry(`room-${transition.toRoom}`);
    // Check if this room has a tutorial dialog and hasn't been seen
    if (transition.isNewRoom && hasRoomDialog(transition.toRoom) && !completedTutorials.has(transition.toRoom)) {
      setTutorialRoomId(transition.toRoom);
    }
    setTransition(null);
  }, [transition, enterRoom, discoverEntry, completedTutorials]);

  const handleTutorialComplete = useCallback((flags: Record<string, boolean>, cardId?: string) => {
    const closingRoomId = tutorialRoomId;
    if (closingRoomId) {
      setCompletedTutorials(prev => {
        const next = new Set(prev);
        next.add(closingRoomId);
        return next;
      });
      // Set narrative flags in game state
      // (flags are stored via the dialog choice system)
      if (cardId) {
        // Collect the card reward
        notify("loot-drop", "Card Acquired!", "New card added to your collection.");
      }
    }
    setTutorialRoomId(null);
    // After the cryo-bay opening narration finishes for the first time, hand
    // off to the "First Steps Aboard the Ark" lore tutorial so onboarding
    // continues without a separate orientation modal in between.
    if (closingRoomId === "cryo-bay" && !isTutorialCompleted("tut-first-steps")) {
      setTimeout(() => setShowOnboardingTutorial(true), 600);
    }
  }, [tutorialRoomId, isTutorialCompleted]);

  const handlePuzzleSolve = useCallback((roomId: string) => {
    setSolvedPuzzles(prev => {
      const next = new Set(prev);
      next.add(roomId);
      return next;
    });
    setPuzzleRoomId(null);
    if (audioReady) playSFX("door_unlock");
    notify("room-unlock", `ACCESS GRANTED — ${getRoomDef(roomId)?.name || roomId}`, "Puzzle solved! Room unlocked.");
    // Navigate with transition
    navigateWithTransition(roomId);
  }, [navigateWithTransition, audioReady, playSFX, getRoomDef]);

  const handleHotspotClick = useCallback((hotspot: HotspotDef) => {
    if (audioReady) playSFX("button_click");

    switch (hotspot.type) {
      case "door": {
        const targetRoomId = hotspot.action!;
        if (isRoomUnlocked(targetRoomId) || canUnlockRoom(targetRoomId)) {
          // Check if room has an unsolved puzzle
          if (roomNeedsPuzzle(targetRoomId)) {
            setPuzzleRoomId(targetRoomId);
            if (audioReady) playSFX("door_locked");
            return;
          }
          navigateWithTransition(targetRoomId);
        } else {
          const def = getRoomDef(targetRoomId);
          const req = def?.unlockRequirement;
          let reason = "This area is locked.";
          if (req?.type === "rooms_unlocked") reason = `Unlock ${req.value} rooms to access this area.`;
          if (req?.type === "items_collected") reason = `Collect ${req.value} items to access this area.`;
          if (audioReady) playSFX("door_locked");
          notify("error", "ACCESS DENIED", reason);
          setElaraText(`That door is locked. ${reason} Keep exploring — you'll find a way.`);
        }
        break;
      }
      case "terminal": {
        if (audioReady) playSFX("terminal_access");
        if (hotspot.elaraDialog) setElaraText(hotspot.elaraDialog);
        if (hotspot.action) {
          const route = resolveActionRoute(hotspot.action, state.narrativeFlags);
          if (route) setTimeout(() => navigate(route), 800);
        }
        break;
      }
      case "item": {
        if (hotspot.action && !state.itemsCollected.includes(hotspot.action)) {
          collectItem(hotspot.action);
          discoverEntry(`item-${hotspot.action}`);
          if (audioReady) playSFX("item_pickup");
          notify("loot-drop", "Item Collected!", hotspot.name);
          if (hotspot.elaraDialog) {
            if (audioReady) playSFX("dialog_open");
            setElaraText(hotspot.elaraDialog);
          }
        } else {
          notify("info", "Already collected", hotspot.name);
        }
        // Audit 2H — item_inspect whisper on any item click (both
        // newly-picked and already-owned; the inspection moment is
        // the same narratively).
        dispatchVoiceWhisper(
          { type: "item_inspect", itemId: hotspot.action ?? hotspot.id },
          ((state as unknown as { innerVoiceSkills?: Record<string, number> }).innerVoiceSkills ?? {}) as Record<string, number>,
        );
        break;
      }
      case "examine":
      case "interact": {
        // Audit 2H — item_inspect whisper on examine/interact clicks.
        // The "examine" type is the canonical passive-look moment;
        // "interact" includes puzzles/terminals that already fire
        // their own whispers (puzzle_attempt on mount), so this
        // overlap is tolerable — cooldown guards against double-up.
        dispatchVoiceWhisper(
          { type: "item_inspect", itemId: hotspot.action ?? hotspot.id },
          ((state as unknown as { innerVoiceSkills?: Record<string, number> }).innerVoiceSkills ?? {}) as Record<string, number>,
        );
        if (hotspot.action === "nav-calibration") {
          if (fastTravelUnlocked) {
            notify("info", "Navigation system already calibrated", "Fast-travel is online. Use the NAV tab on the right.");
            if (hotspot.elaraDialog) setElaraText("The navigation system is already online. Use the NAV panel on the right side of your screen to jump to any discovered room.");
          } else {
            if (audioReady) playSFX("terminal_access");
            setShowNavPuzzle(true);
          }
          break;
        }
        if (hotspot.action === "dna-device-offer") {
          const alreadyDonated = !!state.narrativeFlags["donated_dna_sample"];
          const alreadyRefused = !!state.narrativeFlags["refused_dna_sample"];
          if (alreadyDonated) {
            setElaraText("The device is silent now. Whatever it took, it has. Whatever it gave, we already carry.");
          } else if (alreadyRefused) {
            setElaraText("You already stepped back from this once. The needle-port is closed. Leave it that way.");
          } else {
            if (audioReady) playSFX("terminal_access");
            if (hotspot.elaraDialog) setElaraText(hotspot.elaraDialog);
            setShowDnaDeviceOffer(true);
          }
          break;
        }
        // Section F — Cryo Bay mystery hotspots. `cryo-mystery:<id>` is
        // resolved against the verb × hotspot matrix in
        // apps/shared/cryoBayMystery.ts. Default verb is Look (the
        // verb-coin UI lands with the PointAndClickScene follow-up).
        if (hotspot.action?.startsWith("cryo-mystery:")) {
          const hotspotId = hotspot.action.slice("cryo-mystery:".length);
          const mystery = resolveVerbResponse(
            "look",
            hotspotId as CryoMysteryHotspotId,
          );
          if (!mystery) {
            setElaraText("Nothing reveals itself here.");
            break;
          }
          if (audioReady) playSFX("dialog_open");
          setElaraText(mystery.narration);
          if (mystery.logsClue) logClue(mystery.logsClue);
          if (mystery.grantsInventory) grantMysteryItem(mystery.grantsInventory);
          if (mystery.setsFlag) setNarrativeFlag(mystery.setsFlag);
          if (mystery.unlocksExit === "medical-bay") {
            // The unlockRequirement change on medical-bay handles the
            // actual room gating; nudge the player with a notification.
            notify(
              "room-unlock",
              "MEDICAL BAY UNSEALED",
              "The bulkhead has accepted your case file. The Med Bay is open.",
            );
          }
          break;
        }
        if (hotspot.action === "comms-relay-import") {
          if (audioReady) playSFX("terminal_access");
          break;
        }
        if (hotspot.elaraDialog) {
          if (audioReady) playSFX("dialog_open");
          setElaraText(hotspot.elaraDialog);
        }
        break;
      }
    }
  }, [isRoomUnlocked, canUnlockRoom, navigateWithTransition, collectItem, navigate, state.itemsCollected, discoverEntry, getRoomDef, audioReady, playSFX, roomNeedsPuzzle, fastTravelUnlocked]);

  const handleRoomSelect = useCallback((roomId: string) => {
    if (roomNeedsPuzzle(roomId)) {
      setPuzzleRoomId(roomId);
      return;
    }

    navigateWithTransition(roomId);
  }, [navigateWithTransition, roomNeedsPuzzle]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-muted-foreground/60">Loading Ark systems...</p>
      </div>
    );
  }

  return (
    <LandscapeEnforcer message="The Ark's systems are best navigated in landscape mode. Rotate your device to explore the ship.">
    {/* Task 9.3 — per-route SEO meta. */}
    <PageMeta
      title="Ark Explorer"
      description="Walk the Ark's decks, meet the crew, and uncover the ship's daily secrets. The Living Universe is always in motion."
    />
    <div ref={fullscreenRef} className={`min-h-screen ${isFullscreen ? 'bg-background overflow-auto' : ''} pb-8`}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground/60 hover:text-muted-foreground/90"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-display text-sm font-bold tracking-[0.2em] text-[var(--neon-cyan)]">
                INCEPTION ARK — EXPLORATION
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider">
                {state.totalRoomsUnlocked}/{ROOM_DEFINITIONS.length} ROOMS UNLOCKED • {state.totalItemsFound} ITEMS FOUND
                {solvedPuzzles.size > 0 && ` • ${solvedPuzzles.size} PUZZLES SOLVED`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] transition-all"
              style={{
                background: isFullscreen ? "color-mix(in oklch, var(--energy-primary) 15%, transparent)" : "color-mix(in oklch, var(--text-primary) 3%, transparent)",
                border: `1px solid ${isFullscreen ? "color-mix(in oklch, var(--energy-primary) 30%, transparent)" : "color-mix(in oklch, var(--text-primary) 10%, transparent)"}`,
                color: isFullscreen ? "var(--neon-cyan)" : "color-mix(in oklch, var(--text-primary) 50%, transparent)",
              }}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              {isFullscreen ? "EXIT" : "FULLSCREEN"}
            </button>

          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 flex gap-4">
        {/* Main scene */}
        <div className="flex-1">
          {/* Room scene — wrapped in a relative container so the
              Witnessing mobile narrator slot (§1.2) can overlay. */}
          <div className="relative">
            <RoomScene
              room={currentRoom}
              onHotspotClick={handleHotspotClick}
              itemsCollected={state.itemsCollected}
              fastTravelUnlocked={fastTravelUnlocked}
              commsRelayComplete={!!state.narrativeFlags["comms_relay_first_claim"]}
              roomsWithEvents={roomsWithEvents}
            />
            {/* Witnessing §1.2 — floating narrator slot. Appears in
                every canonicalized ship room. Specialized mini-game
                venues (forge, libraries, vaults, etc.) return null
                from toNarratorRoomId and suppress the slot.
                §1.4 — beat flags force the scripted reveal narrator
                on first visit to each Prelude room.

                First-arrival gate (cryo-bay only): the §13 cryo-bay
                Elara line ("All but one pod is empty…") and its
                paired Human line ("She can. She just won't.") both
                reference The Human, who hasn't been narratively
                introduced on first awakening. We suppress the slot
                until the player has examined at least one mystery
                hotspot — `cryo_mystery_first_clue_found` is flipped
                by `resolveVerbResponse(look, …).setsFlag` and is the
                same gate the Med Bay door uses. Other rooms keep
                their unconditional slot since by the time the player
                reaches them the prologue framing is already done. */}
            {witnessingNarratorRoomId &&
              (witnessingNarratorRoomId !== "cryo_bay" ||
                !!state.narrativeFlags?.cryo_mystery_first_clue_found) && (
              <MobileNarratorSlot
                roomId={witnessingNarratorRoomId}
                flags={witnessingBeatFlags}
              />
            )}
          </div>

          {/* Room description */}
          <div className="mt-3 rounded-lg p-4" style={{
            background: "color-mix(in srgb, var(--bg-void) 60%, transparent)",
            border: "1px solid var(--glass-border)",
          }}>
            <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed">{currentRoom.description}</p>
          </div>

          {/* Room features */}
          <div className="mt-3 flex flex-wrap gap-2">
            {currentRoom.features.map((feature, i) => (
              <button
                key={i}
                onClick={() => {
                  const route = resolveActionRoute(
                    currentRoom.featureRoutes[i],
                    state.narrativeFlags,
                  );
                  if (route) {
                    if (audioReady) playSFX("terminal_access");
                    navigate(route);
                  }
                }}
                className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all hover:bg-[color-mix(in oklch, var(--energy-primary) 12%, transparent)]"
                style={{
                  background: "color-mix(in oklch, var(--energy-primary) 5%, transparent)",
                  border: "1px solid color-mix(in oklch, var(--energy-primary) 15%, transparent)",
                  color: "var(--neon-cyan)",
                  cursor: currentRoom.featureRoutes[i] ? "pointer" : "default",
                }}
              >
                {feature}
              </button>
            ))}
          </div>

          {/* Connected rooms - PATHWAYS (non-bridge) or SHIP MAP (bridge) */}
          {state.currentRoomId === "bridge" ? (
            <InlineShipMap
              currentRoomId={state.currentRoomId}
              onTravel={(roomId) => navigateWithTransition(roomId)}
            />
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Compass size={12} className="void-text-energy" />
                <p className="font-mono text-[10px] void-text-energy tracking-[0.3em] font-bold">PATHWAYS</p>
                <div className="flex-1 h-px bg-gradient-to-r from-[color-mix(in oklch, var(--electric-blue) 30%, transparent)] to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentRoom.connections.map(connId => {
                  const connRoom = getRoomDef(connId);
                  const unlocked = isRoomUnlocked(connId) || canUnlockRoom(connId);
                  const hasPuzzle = roomNeedsPuzzle(connId);
                  const deckDiff = connRoom ? connRoom.deck - currentRoom.deck : 0;
                  const deckLabel = deckDiff > 0 ? `↑ DECK ${connRoom?.deck}` : deckDiff < 0 ? `↓ DECK ${connRoom?.deck}` : "SAME DECK";
                  return (
                    <button
                      key={connId}
                      onClick={() => {
                        if (unlocked) {
                          if (hasPuzzle) {
                            setPuzzleRoomId(connId);
                            if (audioReady) playSFX("door_locked");
                          } else {
                            navigateWithTransition(connId);
                          }
                        } else {
                          if (audioReady) playSFX("door_locked");
                          notify("error", "LOCKED", "Explore more to unlock this area.");
                        }
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-[11px] transition-all group"
                      style={{
                        background: unlocked
                          ? hasPuzzle ? "color-mix(in oklch, var(--energy-premium) 6%, transparent)" : "color-mix(in oklch, var(--electric-blue) 6%, transparent)"
                          : "color-mix(in oklch, var(--text-primary) 2%, transparent)",
                        border: `1px solid ${
                          unlocked
                            ? hasPuzzle ? "color-mix(in oklch, var(--energy-premium) 25%, transparent)" : "color-mix(in oklch, var(--electric-blue) 25%, transparent)"
                            : "color-mix(in oklch, var(--text-primary) 5%, transparent)"
                        }`,
                      }}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                        background: unlocked
                          ? hasPuzzle ? "color-mix(in oklch, var(--energy-premium) 15%, transparent)" : "var(--glass-border)"
                          : "color-mix(in oklch, var(--text-primary) 3%, transparent)",
                        border: `1px solid ${
                          unlocked
                            ? hasPuzzle ? "color-mix(in oklch, var(--energy-premium) 30%, transparent)" : "color-mix(in oklch, var(--electric-blue) 30%, transparent)"
                            : "color-mix(in oklch, var(--text-primary) 8%, transparent)"
                        }`,
                      }}>
                        {unlocked ? (
                          hasPuzzle ? <Zap size={14} className="text-[var(--orb-orange)]" /> : <DoorOpen size={14} className="void-text-energy" />
                        ) : (
                          <Lock size={14} className="text-muted-foreground/25" />
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 text-left">
                        <p className="font-bold tracking-wider" style={{
                          color: unlocked ? "color-mix(in oklch, var(--text-primary) 85%, transparent)" : "color-mix(in oklch, var(--text-primary) 20%, transparent)",
                        }}>
                          {unlocked ? (connRoom?.name || connId) : "???"}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{
                          color: unlocked
                            ? hasPuzzle ? "color-mix(in oklch, var(--energy-premium) 60%, transparent)" : "color-mix(in oklch, var(--electric-blue) 60%, transparent)"
                            : "color-mix(in oklch, var(--text-primary) 10%, transparent)",
                        }}>
                          {unlocked ? (hasPuzzle ? "🔒 PUZZLE REQUIRED" : deckLabel) : "LOCKED"}
                        </p>
                      </div>
                      {/* Arrow */}
                      <ChevronRight size={14} className={`transition-transform group-hover:translate-x-1 ${
                        unlocked ? "text-muted-foreground/50" : "text-muted-foreground/20"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Morality-gated secret transmission hotspot indicator */}
      {currentRoom && (() => {
        const transmissions = getRoomTransmissions(state.moralityScore, currentRoom.id);
        const undiscovered = transmissions.filter(t => !isTransmissionDiscovered(t.id));
        if (undiscovered.length === 0) return null;
        const t = undiscovered[0];
        return (
          <div className="fixed bottom-24 right-4 z-40">
            <button
              onClick={() => { setActiveTransmission(t); if (audioReady) playSFX("terminal_access"); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider animate-pulse"
              style={{
                background: t.side === "machine"
                  ? "linear-gradient(135deg, color-mix(in oklch, var(--energy-error) 15%, transparent), color-mix(in oklch, var(--energy-error) 5%, transparent))"
                  : "linear-gradient(135deg, color-mix(in oklch, var(--energy-success) 15%, transparent), color-mix(in oklch, var(--energy-success) 5%, transparent))",
                border: `1px solid ${t.side === "machine" ? "color-mix(in oklch, var(--energy-error) 30%, transparent)" : "color-mix(in oklch, var(--energy-success) 30%, transparent)"}`,
                color: t.side === "machine" ? "var(--alert-red)" : "var(--signal-green)",
                boxShadow: t.side === "machine" ? "0 0 var(--space-md) color-mix(in oklch, var(--energy-error) 15%, transparent)" : "0 0 var(--space-md) color-mix(in oklch, var(--energy-success) 15%, transparent)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: t.side === "machine" ? "var(--alert-red)" : "var(--signal-green)" }} />
              INTERCEPTED SIGNAL DETECTED
            </button>
          </div>
        );
      })()}

      {/* Secret Transmission Overlay */}
      <SecretTransmissionOverlay
        transmission={activeTransmission}
        onClose={() => setActiveTransmission(null)}
        alreadyClaimed={activeTransmission ? isTransmissionDiscovered(activeTransmission.id) : false}
        onClaim={(t) => {
          discoverTransmission(t.id);
          notify("story-reveal", "Transmission Archived!", `+${t.reward.xp} XP, +${t.reward.dreamTokens} Dream Tokens${t.reward.title ? `, "${t.reward.title}" title unlocked` : ""}`);
          setActiveTransmission(null);
        }}
      />

      {/* Elara dialog popup */}
      <AnimatePresence>
        {elaraText && (
          <ElaraPopup text={elaraText} voUrl={elaraVoUrl} onClose={() => {
            window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: false } }));
            setElaraText(null);
            setElaraVoUrl(undefined);
            if (audioReady) playSFX("dialog_close");
          }} />
        )}
      </AnimatePresence>

      {/* Puzzle modal */}
      <AnimatePresence>
        {puzzleRoomId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <PuzzleModal
              roomId={puzzleRoomId}
              itemsCollected={state.itemsCollected}
              onSolve={handlePuzzleSolve}
              onClose={() => setPuzzleRoomId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alien Symbol Navigation Puzzle */}
      <AnimatePresence>
        {showNavPuzzle && (
          <AlienSymbolPuzzle
            onSolve={() => {
              setShowNavPuzzle(false);
              setNarrativeFlag("fast_travel_unlocked");
              if (audioReady) playSFX("door_unlock");
              notify("room-unlock", "NAVIGATION SYSTEM ONLINE", "Fast-travel unlocked! Use the NAV tab on the right to jump between discovered rooms.");
              setElaraText("Excellent work! The navigation grid is online. You can now use the NAV panel on the right side of your screen to instantly travel to any room you've already discovered. No more backtracking through corridors.");
            }}
            onClose={() => setShowNavPuzzle(false)}
          />
        )}
      </AnimatePresence>

      {/* Med Bay "unkempt device" DNA offer (Section A — earned loadouts) */}
      <AnimatePresence>
        {showDnaDeviceOffer && (
          <DnaDeviceOfferDialog
            onClose={({ donated, reward }) => {
              setShowDnaDeviceOffer(false);
              if (donated) {
                setNarrativeFlag("donated_dna_sample");
                if (audioReady) playSFX("dialog_open");
                if (reward) {
                  notify(
                    "room-unlock",
                    "LOADOUT EARNED",
                    `${reward.name} — ${reward.slot.toUpperCase()}`,
                  );
                  setElaraText(
                    `The device returns something: a ${reward.name}. ${reward.flavor} Whatever this trade cost, it's paid forward, not back.`,
                  );
                } else {
                  setElaraText(
                    "The device took what it wanted. Nothing came back. Remember that.",
                  );
                }
              } else {
                setNarrativeFlag("refused_dna_sample");
                setElaraText(
                  "You stepped back. Smart. Some doors open only to those who know the price.",
                );
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Fast Travel modal — Cmd/Ctrl+K. Only mounted when the
          player has solved the nav-console puzzle; the keybind
          effect above is gated on the same flag so pre-puzzle
          players don't get a shortcut that reveals rooms they
          haven't earned. */}
      {fastTravelUnlocked && (
        <ArkFastTravelModal
          open={fastTravelModalOpen}
          onClose={() => setFastTravelModalOpen(false)}
          rooms={unlockedRoomDefs}
          currentRoomId={state.currentRoomId}
          onTravel={(roomId) => {
            if (audioReady) playSFX("terminal_access");
            navigateWithTransition(roomId);
          }}
        />
      )}

      {/* Fast Travel Panel — only visible after solving the nav puzzle */}
      {fastTravelUnlocked && (
        <FastTravelPanel
          currentRoomId={state.currentRoomId}
          rooms={state.rooms}
          unlockedRooms={unlockedRoomIds}
          itemsCollected={state.itemsCollected}
          solvedPuzzles={solvedPuzzles}
          getRoomDef={getRoomDef}
          onTravel={(roomId) => {
            if (audioReady) playSFX("terminal_access");
            navigateWithTransition(roomId);
          }}
          onItemClick={(itemAction) => {
            if (audioReady) playSFX("dialog_open");
            setSelectedItem(itemAction);
          }}
        />
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        itemAction={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Living Ark Event Notification */}
      <AnimatePresence>
        {activeRoomEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[90] max-w-sm w-full px-4"
          >
            <button
              onClick={() => {
                if (!activeRoomEvent) return;
                const daySeed = Math.floor(Date.now() / 86400000);
                const result = processArkEvent(activeRoomEvent, daySeed);

                // Task 2.2 — Fire the server-authoritative reward mutation.
                // The server applies dream / xp / crafting materials, updates
                // room state, records pressure, and the useDailyBrief hook's
                // onSuccess handler shows reward toasts + cross-room alerts.
                // Safe to call even when the event id isn't on the server's
                // brief today — the mutation falls through gracefully.
                completeLivingArkEvent(
                  activeRoomEvent.id,
                  activeRoomEvent.type,
                  activeRoomEvent.roomId,
                );

                // Apply trust changes
                for (const tc of result.trustChanges) {
                  if (tc.npcId === "elara") {
                    adjustElaraTrust?.(tc.delta);
                  } else if (tc.npcId === "the_human") {
                    adjustHumanTrust?.(tc.delta);
                  } else {
                    adjustNpcTrust?.(tc.npcId, tc.delta);
                    discoverNpc?.(tc.npcId);
                  }
                }

                // Set narrative flags
                for (const flag of result.flagsToSet) {
                  setNarrativeFlag(flag, true);
                }

                // Task 2.2 — Server grants (dream/xp/materials) are handled
                // by the completeLivingArkEvent mutation above; the client
                // now only handles client-local effects (dialog, visuals,
                // cards, notifications).

                // Trigger NPC dialog
                if (result.npcDialog) {
                  const scene = buildFirstContactScene(result.npcDialog.npcId as FactionNPCId);
                  setNpcDialogScene(scene);
                }

                // Set game hint
                if (result.gameHint) {
                  setGameHint(result.gameHint);
                }

                // Play music
                if (result.musicTrigger) {
                  setNarrativeFlag(`music_heard_${result.musicTrigger.toLowerCase().replace(/\s+/g, "_")}`, true);
                }

                // Collect cards
                if (result.cardReward) {
                  collectCard(result.cardReward);
                }

                // Equipment drop
                if (result.equipmentDrop) {
                  notify("loot-drop", "Equipment Found!", `You found ${result.equipmentDrop.replace(/_/g, " ")} while exploring.`);
                }

                // Dispatch narrative effect based on event type
                const eventEffects: Record<string, string> = {
                  npc_conversation: "pulse",
                  signal_fragment: "glitch",
                  quarantine: "static",
                  tome_discovered: "surge",
                  music_transmission: "breathe",
                  boss_challenge: "quake",
                  system_anomaly: "distort",
                  stargazing: "drift",
                  research_complete: "jolt",
                };
                const narrativeEffect = eventEffects[activeRoomEvent.type];
                if (narrativeEffect) {
                  dispatchNarrativeEffect(narrativeEffect as any);
                }

                // Show notification via priority queue
                notify(result.toast.type, result.toast.title, result.toast.description);

                setActiveRoomEvent(null);
              }}
              className="w-full text-left p-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all hover:scale-[1.02]"
              style={{
                background: "color-mix(in oklch, var(--bg-void) 85%, transparent)",
                borderColor: activeRoomEvent.type === "npc_conversation" ? "color-mix(in oklch, var(--energy-primary) 40%, transparent)" :
                              activeRoomEvent.type === "quarantine" ? "color-mix(in oklch, var(--energy-error) 40%, transparent)" :
                              activeRoomEvent.type === "signal_fragment" ? "color-mix(in oklch, var(--energy-error) 40%, transparent)" :
                              activeRoomEvent.type === "tome_discovered" ? "color-mix(in oklch, var(--energy-system) 40%, transparent)" :
                              "color-mix(in oklch, var(--energy-premium) 40%, transparent)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: activeRoomEvent.type === "npc_conversation" ? "color-mix(in oklch, var(--energy-primary) 15%, transparent)" :
                                     activeRoomEvent.type === "quarantine" ? "color-mix(in oklch, var(--energy-error) 15%, transparent)" :
                                     "color-mix(in oklch, var(--energy-premium) 15%, transparent)",
                    border: `1px solid ${activeRoomEvent.type === "npc_conversation" ? "color-mix(in oklch, var(--energy-primary) 40%, transparent)" : "color-mix(in oklch, var(--energy-premium) 40%, transparent)"}`,
                  }}>
                  <span className="text-xs">
                    {activeRoomEvent.type === "npc_conversation" ? "💬" :
                     activeRoomEvent.type === "quarantine" ? "⚠️" :
                     activeRoomEvent.type === "signal_fragment" ? "📡" :
                     activeRoomEvent.type === "tome_discovered" ? "📖" :
                     activeRoomEvent.type === "music_transmission" ? "🎵" :
                     activeRoomEvent.type === "stargazing" ? "✨" : "📋"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-bold text-white/90 truncate">{activeRoomEvent.title}</p>
                  <p className="font-mono text-[10px] text-white/40 truncate">{activeRoomEvent.description}</p>
                </div>
                <span className="font-mono text-[8px] text-white/20 shrink-0">TAP</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC Dialog (triggered by Ark events) */}
      <AnimatePresence>
        {npcDialogScene && (
          <NPCDialog
            npcId={npcDialogScene.npcId}
            scene={npcDialogScene}
            onClose={() => setNpcDialogScene(null)}
            onChoice={(choice) => {
              // Apply choice effects
              if (choice.trustChange) {
                const nid = npcDialogScene.npcId;
                if (nid === "elara") adjustElaraTrust?.(choice.trustChange);
                else if (nid === "the_human") adjustHumanTrust?.(choice.trustChange);
                else adjustNpcTrust?.(nid, choice.trustChange);
              }
              if (choice.callbackFlag) {
                setNpcCallback?.(npcDialogScene.npcId, choice.callbackFlag);
              }
              incrementNpcConversation?.(npcDialogScene.npcId);
              // Show response as Elara-style text
              setElaraText(choice.response);
              setNpcDialogScene(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Breadcrumb Chain Message (Elden Ring "one more room" loop) */}
      <AnimatePresence>
        {breadcrumbMessage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            /* void-ignore — toast fixed width on sm+ breakpoint */
            className="fixed top-14 left-4 right-4 sm:left-auto sm:right-4 sm:w-[360px] z-[82]"
          >
            <div className="p-3 rounded-xl void-bg-sunk border void-border backdrop-blur-md"
              onClick={() => setBreadcrumbMessage(null)}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full void-bg-sunk animate-pulse" />
                <span className="font-mono text-[8px] void-text-energy tracking-wider">ELARA // SYSTEM ALERT</span>
              </div>
              <p className="font-mono text-[10px] void-text-energy leading-relaxed">{breadcrumbMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle Clues (Sierra/LucasArts environmental hints) */}
      {roomClues.length > 0 && (
        <div className="fixed bottom-28 right-4 z-[75] max-w-[200px]">
          {roomClues.slice(0, 2).map((clue, i) => (
            <motion.div
              key={clue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 3 + i * 2 }}
              className="mb-1.5 p-2 rounded-lg void-bg-sunk border void-border-subtle"
            >
              <p className="font-mono text-[8px] void-text-dim leading-relaxed">{clue.text}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Companion Banter (BioWare-style NPC-to-NPC dialog) */}
      <AnimatePresence>
        {banterText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] max-w-md w-full px-4"
          >
            <div className="void-surface p-3 rounded-xl backdrop-blur-md"
              style={{ borderColor: "var(--void-glow, color-mix(in oklch, var(--energy-system) 20%, transparent))" }}
              onClick={() => setBanterText(null)}>
              <p className="font-mono text-[8px] tracking-wider mb-2" style={{ color: "var(--void-primary-muted)" }}>OVERHEARD TRANSMISSION</p>
              <pre className="font-mono text-[10px] whitespace-pre-wrap leading-relaxed void-text-muted">{banterText}</pre>
              <p className="font-mono text-[7px] mt-2 text-right" style={{ color: "var(--void-text-muted, color-mix(in oklch, var(--text-primary) 15%, transparent))" }}>tap to dismiss</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inner Voice Whisper (skill-based commentary on room entry) */}
      <AnimatePresence>
        {voiceWhisper && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.85, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 right-4 z-[70] max-w-[240px]"
          >
            <div className="p-2.5 rounded-lg border backdrop-blur-sm"
              style={{
                background: "color-mix(in oklch, var(--bg-void) 75%, transparent)",
                borderColor: voiceWhisper.isFalse
                  ? "color-mix(in oklch, var(--energy-error) 15%, transparent)"
                  : "var(--void-border-subtle, color-mix(in oklch, var(--text-primary) 6%, transparent))",
              }}
              onClick={() => setVoiceWhisper(null)}>
              <p className="font-mono text-[7px] tracking-[0.2em] mb-1"
                style={{ color: voiceWhisper.isFalse ? "color-mix(in oklch, var(--energy-error) 40%, transparent)" : "var(--void-primary-muted)" }}>
                {voiceWhisper.isFalse ? "UNRELIABLE INSTINCT" : "INNER VOICE"}
              </p>
              <p className="font-mono text-[10px] leading-relaxed italic"
                style={{ color: "var(--void-text-muted, color-mix(in oklch, var(--text-primary) 50%, transparent))" }}>
                &ldquo;{voiceWhisper.text}&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Hint Banner (from Ark events) */}
      <AnimatePresence>
        {gameHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[85] max-w-sm w-full px-4"
          >
            <button
              onClick={() => {
                navigate(gameHint.route);
                setGameHint(null);
              }}
              className="w-full text-left p-3 rounded-xl border void-border bg-black/90 backdrop-blur-md shadow-2xl void-border transition-all"
            >
              <p className="font-mono text-[9px] void-text-energy tracking-wider mb-1">SYSTEM RECOMMENDATION</p>
              <p className="font-mono text-xs text-white/80">{gameHint.label}</p>
              <p className="font-mono text-[8px] void-text-energy mt-1 flex items-center gap-1">
                <ChevronRight size={8} /> TAP TO LAUNCH {gameHint.game.replace(/_/g, " ").toUpperCase()}
              </p>
            </button>
            <button
              onClick={() => setGameHint(null)}
              className="absolute top-2 right-6 text-white/20 hover:text-white/50"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Tutorial Dialog */}
      <AnimatePresence>
        {tutorialRoomId && (
          <RoomTutorialDialog
            roomId={tutorialRoomId}
            onComplete={handleTutorialComplete}
            onDismiss={() => {
              const closingRoomId = tutorialRoomId;
              setCompletedTutorials(prev => {
                const next = new Set(prev);
                if (closingRoomId) next.add(closingRoomId);
                return next;
              });
              setTutorialRoomId(null);
              if (closingRoomId === "cryo-bay" && !isTutorialCompleted("tut-first-steps")) {
                setTimeout(() => setShowOnboardingTutorial(true), 600);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Room Transition Cutscene */}
      <AnimatePresence>
        {transition && (
          <RoomTransition
            fromRoom={transition.fromRoom}
            toRoom={transition.toRoom}
            toRoomName={transition.toRoomName}
            toRoomImage={transition.toRoomImage}
            onComplete={handleTransitionComplete}
            isNewRoom={transition.isNewRoom}
          />
        )}
      </AnimatePresence>

      {/* ═══ NARRATIVE ACT TRIGGER (7-Act Angel/Demon System) ═══ */}
      <NarrativeTrigger currentRoom={state.currentRoomId || undefined} variant="auto" />

      {/* ═══ ONBOARDING TUTORIAL OVERLAY ═══ */}
      <AnimatePresence>
        {showOnboardingTutorial && (() => {
          const tut = getTutorialById("tut-first-steps");
          if (!tut) return null;
          return (
            <LoreTutorialEngine
              key="onboarding"
              tutorial={tut}
              onComplete={(rewards: TutorialReward[], moralityTotal: number, flags: Record<string, boolean>) => {
                completeTutorial("tut-first-steps");
                if (moralityTotal !== 0) shiftMorality(moralityTotal, "tut-first-steps");
                rewards.forEach(r => { if (r.type === "card" && r.id) collectCard(r.id); });
                Object.entries(flags).forEach(([k, v]) => { if (v) setNarrativeFlag(k); });
                setShowOnboardingTutorial(false);
              }}
              onDismiss={() => setShowOnboardingTutorial(false)}
            />
          );
        })()}
      </AnimatePresence>
    </div>
    </LandscapeEnforcer>
  );
}
