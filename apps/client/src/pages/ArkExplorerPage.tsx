import { useGameAreaBGM } from "@/contexts/GameAudioContext";
/* ═══════════════════════════════════════════════════════
   ARK EXPLORER PAGE — Point-and-click room exploration
   Old-school adventure game with clickable hotspots,
   Elara dialog, sound effects, and puzzle mechanics.
   The Living Ark: rooms have daily events that drive revisits.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { dialogOpened, dialogClosed } from "@/lib/dialogState";
import { claimActiveVo, releaseActiveVo } from "@/lib/voSpeakingState";
import { useGame, ROOM_DEFINITIONS, type HotspotDef, type RoomDef } from "@/contexts/GameContext";
import { resolveRoomBackgroundUrl } from "@/game/roomStateAssets";
import { getRoomTier, type RoomTier } from "@shared/roomTier";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import {
  generateDailyBrief,
  getCrossRoomAlerts,
  MUSIC_TRIGGERS,
  type EventType,
  type RoomEvent,
  type RoomId as LivingArkRoomId,
} from "@/game/livingArk";
import { processArkEvent, type ArkEventResult } from "@/game/arkEventHandler";
import { useDailyBrief } from "@/hooks/useDailyBrief";
import PageMeta from "@/components/PageMeta";
import LivingShipSensorOverlay from "@/components/LivingShipSensorOverlay";
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
import { getNPCPortrait, getHumanRevealImage } from "@/game/npcPortraits";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Terminal, Eye, Package, DoorOpen, Hand, Lock, ChevronRight,
  MapPin, Compass, Zap, Ship, ArrowLeft, X, Star, Volume2, VolumeX,
  Maximize2, Minimize2, Music, Swords, Search, BookOpen, Tv,
  FlaskConical, Shield, User, Map as MapIcon, Flame, Backpack
} from "lucide-react";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";
import { toast } from "sonner";
import { enqueue as enqueueCompanionLine } from "@/companion/companionScheduler";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { observe as observeWatcher, readLog as readWatcherLog } from "@/lib/watcher";
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
import AdventureInventoryDrawer from "@/components/AdventureInventoryDrawer";
import ElaraConversationPopup from "@/components/ElaraConversationPopup";
import CompanionPresenceBadge from "@/components/CompanionPresenceBadge";
import { useElaraVO } from "@/hooks/useElaraVO";
import { useHumanVO } from "@/hooks/useHumanVO";
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
import { pickRoomFilter } from "@shared/livingArkTouchpoints";
import {
  getRoomMysteryModule,
  resolveVerbResponse,
  resolveTierResponse,
  resolveBandedNarration,
  resolveBandedVoId,
  resolveHumanReaction,
  VERB_LIST,
  type Verb,
} from "@shared/roomMysteries";
import { stabilityBand, lightBand } from "@shared/companion";
import VerbCoin from "@/components/VerbCoin";
import LoreTutorialEngine from "@/components/LoreTutorialEngine";
import NarrativeTrigger from "@/components/NarrativeTrigger";
import InlineShipMap from "@/components/InlineShipMap";
import { getTutorialById, type TutorialReward } from "@/data/loreTutorials";
import { crossfadeToRoom } from "@/lib/ambientSounds";
import { trpc } from "@/lib/trpc";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp";

/* ─── HOTSPOT ICON MAP ─── */
function getHotspotIcon(type: HotspotDef["type"]) {
  switch (type) {
    case "terminal": return Terminal;
    case "item": return Star;
    case "door": return DoorOpen;
    case "examine": return Eye;
    case "interact": return Hand;
    case "npc": return User;
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
    case "npc":
      // NPC presence — the bust portrait carries its own per-character
      // colour ring (from NPC_PORTRAITS[npcId].color), so this fallback
      // only paints a generic glow when the portrait failed to load.
      return {
        border: "color-mix(in oklch, var(--energy-premium) 60%, transparent)",
        bg: "color-mix(in oklch, var(--bg-void) 70%, transparent)",
        glow: "color-mix(in oklch, var(--energy-premium) 40%, transparent)",
        text: "var(--energy-premium)",
      };
  }
}

/* ─── MYSTERY ACTION PARSE ─── */
/** Parse a `room-mystery:<roomId>:<id>` or legacy `cryo-mystery:<id>`
 *  hotspot action into its parts. Returns null when the action isn't a
 *  mystery dispatch — non-mystery hotspots use their existing branch. */
function parseMysteryAction(
  action: string | undefined,
): { roomId: string; hotspotId: string } | null {
  if (!action) return null;
  if (action.startsWith("cryo-mystery:")) {
    return { roomId: "cryo-bay", hotspotId: action.slice("cryo-mystery:".length) };
  }
  if (action.startsWith("room-mystery:")) {
    const rest = action.slice("room-mystery:".length);
    const sep = rest.indexOf(":");
    if (sep === -1) return null;
    return { roomId: rest.slice(0, sep), hotspotId: rest.slice(sep + 1) };
  }
  return null;
}

/** Verbs the room mystery module actually authors for this hotspot.
 *  Empty array = the hotspot isn't a mystery hotspot (or its module
 *  isn't registered) — verb coin shouldn't render. */
function availableVerbsFor(action: string | undefined): readonly Verb[] {
  const parsed = parseMysteryAction(action);
  if (!parsed) return [];
  const mod = getRoomMysteryModule(parsed.roomId);
  if (!mod) return [];
  return VERB_LIST.filter((v) =>
    Boolean(resolveVerbResponse(mod, v, parsed.hotspotId)),
  );
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
function ElaraPopup({ text, onClose, voUrl }: { text: string | string[]; onClose: () => void; voUrl?: string }) {
  // Normalise to a beat array so the rest of the render path is uniform.
  // A plain string is just a single-beat monologue; long room intros
  // pass an array and we walk through it one beat at a time, keyed off
  // VO playback when audio is available.
  const beats = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [beatIndex, setBeatIndex] = useState(0);
  // Reset beat progression whenever the parent swaps in a new dialog.
  useEffect(() => { setBeatIndex(0); }, [beats]);
  const isFinalBeat = beatIndex >= beats.length - 1;
  const currentBeat = beats[Math.min(beatIndex, beats.length - 1)];

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play VO audio when the popup opens — significantly louder than BGM.
  // Audio outlives individual beat changes (the file is one continuous
  // monologue) so this effect is keyed only on `voUrl`, not beatIndex.
  useEffect(() => {
    if (!voUrl) return;
    const audio = new Audio(voUrl);
    audio.volume = 0.92;
    audioRef.current = audio;
    // Funnel through the single-active-VO bus so this legacy URL path
    // can't overlap with hook-driven lines from elara/human/etc.
    const myStop = () => { audio.pause(); };
    claimActiveVo(myStop);
    audio.play().catch(() => {/* autoplay blocked */});
    return () => {
      releaseActiveVo(myStop);
      audio.pause();
      audioRef.current = null;
    };
  }, [voUrl]);

  // Auto-advance beats based on VO progress. We don't have per-beat
  // timestamps, so apportion the audio's duration by character-count
  // weight — longer beats stay on screen longer. When the player has
  // no audio (or the file is still loading metadata) auto-advance is a
  // no-op and the player advances manually via the [next] / [dismiss]
  // affordance below.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || beats.length <= 1) return;
    const totalChars = beats.reduce((sum, b) => sum + b.length, 0) || 1;
    const cumChars: number[] = [];
    beats.reduce((acc, b, i) => {
      const next = acc + b.length;
      cumChars[i] = next;
      return next;
    }, 0);
    const onTimeUpdate = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const charsAt = totalChars * (audio.currentTime / audio.duration);
      let target = beats.length - 1;
      for (let i = 0; i < beats.length; i++) {
        if (charsAt < cumChars[i]) { target = i; break; }
      }
      setBeatIndex((prev) => (target > prev ? target : prev));
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [beats]);

  // Stop VO on close
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onClose();
  };

  // Manual advance (clicking the prompt under the text). On the final
  // beat it dismisses the popup outright.
  const handleAdvance = () => {
    if (isFinalBeat) { handleClose(); return; }
    setBeatIndex((i) => Math.min(i + 1, beats.length - 1));
  };

  // Per-beat typewriter. When a VO is driving us, skip the typewriter
  // and show the full beat instantly so visemes / heard text stay in
  // sync — the typewriter would otherwise lag the audio by ~20ms/char.
  // The TTS-less fallback path keeps the typewriter so silent reads
  // still feel paced.
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (voUrl) {
      setDisplayed(currentBeat);
      setDone(true);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (i < currentBeat.length) {
        setDisplayed(currentBeat.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [currentBeat, voUrl]);

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
          <div className="mt-2 flex items-center justify-between gap-2">
            {/* Beat counter only when there's more than one beat — keeps
                the single-line hotspot dialogs visually unchanged. */}
            {beats.length > 1 ? (
              <span className="font-mono text-[9px] text-[var(--neon-cyan)]/30 tracking-wider">
                {beatIndex + 1} / {beats.length}
              </span>
            ) : <span />}
            <button
              onClick={handleAdvance}
              className="font-mono text-[10px] text-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] transition-colors"
            >
              {isFinalBeat ? "[dismiss]" : "[next]"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── ROOM SCENE ─── */
function RoomScene({
  room,
  onHotspotClick,
  onHotspotHoverWhisper,
  itemsCollected,
  collectedHotspots = [],
  fastTravelUnlocked = false,
  commsRelayComplete = false,
  roomsWithEvents = new Set<string>(),
}: {
  room: RoomDef;
  /** Default verb is `look`. The verb-coin overlay calls this with
   *  a non-look verb to invoke a specific (verb, hotspot) response. */
  onHotspotClick: (hotspot: HotspotDef, verb?: Verb) => void;
  /** Section 9 — fired (after a local 600ms debounce) when the
   *  player's pointer dwells on a hotspot that authors an
   *  `elaraHoverVoId`. The parent applies the global 12s throttle +
   *  once-per-session dedup before actually speaking. */
  onHotspotHoverWhisper?: (hotspot: HotspotDef) => void;
  itemsCollected: string[];
  /** Hotspot ids that have been one-shot collected and should no
   *  longer render in the scene (data-slate after `use`, locket after
   *  `look`, etc.). */
  collectedHotspots?: string[];
  fastTravelUnlocked?: boolean;
  commsRelayComplete?: boolean;
  roomsWithEvents?: Set<string>;
}) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  // Per-hotspot debounce timer for hover whispers. Cleared on
  // mouse-leave so a quick sweep across hotspots never fires.
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { state: gameStateForArt } = useGame();
  // Tier-aware room backdrop. The Section-F flag-based variants for
  // cryo / medical bay still win, then any tier-indexed art for the
  // current room tier, then the room's legacy imageUrl. See
  // apps/client/src/game/roomStateAssets.ts ROOM_TIER_ASSET_URLS for
  // the registry — empty by default so all rooms keep their existing
  // backdrop until tier art lands.
  const roomArtUrl = resolveRoomBackgroundUrl(
    room.id,
    gameStateForArt.narrativeFlags,
    room.imageUrl,
  );
  const roomTier = getRoomTier(room.id, {
    narrativeFlags: gameStateForArt.narrativeFlags,
  });
  // Witnessing §14.2 narrator filter — Elara/Human bond thresholds
  // tint the room background. Falls through to "neutral" when neither
  // bond has crossed 80, in which case no filter class is applied.
  const narratorRoomId = toNarratorRoomId(room.id);
  const filterPreset = narratorRoomId
    ? pickRoomFilter(
        narratorRoomId,
        gameStateForArt.elaraTrust ?? 0,
        gameStateForArt.humanTrust ?? 0,
      )
    : "neutral";
  const filterClassName =
    filterPreset === "warm_elara"
      ? "ark-room-filter-warm-elara"
      : filterPreset === "noir_human"
        ? "ark-room-filter-noir-human"
        : filterPreset === "yin_yang_flicker"
          ? "ark-room-filter-yin-yang-flicker"
          : filterPreset === "silence_ambient"
            ? "ark-room-filter-silence-ambient"
            : "";
  const [showHotspots, setShowHotspots] = useState(() => {
    try {
      const v = localStorage.getItem("loredex-show-hotspots");
      return v === null ? true : v === "true";
    } catch { return true; }
  });

  // Ambient mode — markers stay invisible until the cursor is over the
  // bounding box (or the player holds Alt to peek). The old behaviour
  // covered every shipped room with hand cursors and pulsing rings, which
  // collapses the painted scenery into a checklist of icons. Players who
  // need the hand-holding (accessibility, kids, screen-readers) can still
  // flip Settings → "Always show hotspots" off this default.
  const [ambientHotspots, setAmbientHotspots] = useState(() => {
    try {
      const v = localStorage.getItem("loredex-ambient-hotspots");
      return v === null ? true : v === "true";
    } catch { return true; }
  });

  // Alt-hold peek: while the key is down every marker fades in at full
  // strength, then fades back out when the key releases. This is the
  // discovery-friendly equivalent of a "scan visor" — the player asks
  // "what's clickable in this room?" once, instead of the room
  // pre-answering for them.
  const [peekHotspots, setPeekHotspots] = useState(false);
  useEffect(() => {
    if (!ambientHotspots) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Alt" && !e.repeat) setPeekHotspots(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Alt") setPeekHotspots(false);
    };
    const blur = () => setPeekHotspots(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [ambientHotspots]);

  // ?debug-hotspots=1 — overlay every hotspot's bounding box with its id
  // label so we can re-anchor against the room art in one pass instead of
  // by binary search. No production cost; renders only when the flag is
  // set in the URL on the current navigation.
  const debugHotspots =
    typeof window !== "undefined" &&
    /[?&]debug-hotspots=1\b/.test(window.location.search);

  // Listen for settings page toggle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.visible === "boolean") {
        setShowHotspots(detail.visible);
      }
      if (detail && typeof detail.ambient === "boolean") {
        setAmbientHotspots(detail.ambient);
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
        className={`absolute inset-0 ${filterClassName}`.trim()}
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
      <RoomAmbientLife roomId={room.id} tier={roomTier} />

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
          // One-shot pickup hotspots (data-slate use, locket pickup) are
          // tracked by id in collectedHotspots so they don't reappear
          // when the player re-enters the room.
          const isOneShotConsumed = collectedHotspots.includes(hotspot.id);

          if (isCollected || isOneShotConsumed) return null;

          // Smaller hotspots sit on top of larger ones. Several rooms
          // (notably the cryo-bay dead-pod cluster) have detail
          // hotspots that fall entirely inside a wide-area parent
          // hotspot — without an explicit z-index, hover/click can
          // flicker between them. We score each hotspot by area in
          // % squared so a small detail (e.g. 5×5 = 25) always sits
          // above a 16×54 = 864 wrapper.
          const area = hotspot.width * hotspot.height;
          // Map area into a z range above z-10 (the layer baseline).
          // Smaller hotspot → higher z. Cap so we never collide with
          // higher overlay layers (verb-coin, modals, etc.).
          const hotspotZ = Math.max(11, Math.min(40, 50 - Math.round(area / 30)));
          // Ambient mode: the icon/label/rings only render when the
          // player is hovering or holding Alt to peek. The cursor still
          // changes to pointer over the bounding box so discovery still
          // works — the painted scenery just isn't pre-spoiled by a
          // ring of glowing chips. The legacy "always-on" mode is still
          // available via Settings → markers toggle.
          const markerVisible = !ambientHotspots || isHovered || peekHotspots;
          // Quest-critical attention beacons (keycards, nav console,
          // comms relay) keep their always-visible pulse so they still
          // pull the player toward the next gate. Everything else falls
          // back to ambient discovery.
          const isAttentionBeacon =
            hotspot.id === "observation-keycard" ||
            hotspot.id === "captains-master-key" ||
            hotspot.id === "nav-console" ||
            hotspot.id === "comms-relay";
          const persistentMarker = !ambientHotspots || isAttentionBeacon;
          return (
            <motion.div
              key={hotspot.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute cursor-pointer"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
                zIndex: hotspotZ,
              }}
              onMouseEnter={() => {
                setHoveredHotspot(hotspot.id);
                // Section 9 — debounce the hover whisper so accidental
                // sweeps across the room don't trigger it. The parent
                // applies the global throttle + per-session dedup.
                if (hotspot.elaraHoverVoId && onHotspotHoverWhisper) {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                  hoverTimerRef.current = setTimeout(() => {
                    onHotspotHoverWhisper(hotspot);
                  }, 600);
                }
              }}
              onMouseLeave={() => {
                setHoveredHotspot(null);
                if (hoverTimerRef.current) {
                  clearTimeout(hoverTimerRef.current);
                  hoverTimerRef.current = null;
                }
              }}
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

              {/* Icon marker — opacity respects ambient mode so the
                  shipped scenery isn't covered in chips during normal
                  play. Easter eggs stay nearly invisible regardless;
                  attention beacons (key items, quest gates) keep their
                  always-visible glow so the player still gets pulled to
                  the next room. */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  opacity: isEasterEgg
                    ? (markerVisible ? 0.6 : 0.08)
                    : isHovered
                      ? 1
                      : persistentMarker
                        ? 0.85
                        : peekHotspots
                          ? 0.7
                          : 0,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
                }}
              >
                {hotspot.type === "npc" && hotspot.npcId ? (
                  // Phase C — NPC presence. Render the NPC's bust portrait
                  // at the hotspot instead of the default icon. The Human
                  // is special: portrait progressive-reveals via
                  // getHumanRevealImage(trust) until trust ≥ 50.
                  (() => {
                    const portrait = getNPCPortrait(hotspot.npcId);
                    const trust = gameStateForArt.npcTrust?.[hotspot.npcId] ?? 0;
                    const src = hotspot.npcId === "the_human"
                      ? getHumanRevealImage(trust)
                      : (portrait?.bustPortrait ?? portrait?.fullPortrait);
                    if (!src) return null;
                    return (
                      <div
                        className="rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                          width: "var(--space-2xl)",
                          height: "var(--space-2xl)",
                          background: "color-mix(in oklch, var(--bg-void) 70%, transparent)",
                          border: `2px solid ${portrait?.color ?? "color-mix(in oklch, var(--energy-primary) 70%, transparent)"}`,
                          boxShadow: `0 0 var(--space-md) ${portrait?.color ?? "var(--glass-border)"}`,
                        }}
                      >
                        <img
                          src={src}
                          alt={portrait?.name ?? hotspot.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    );
                  })()
                ) : (
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
                )}
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
                {/* Door pulse rings — gated on persistentMarker so they
                    don't sit on every painted doorway during ambient
                    play. They still appear on hover, on Alt-peek, or
                    when the legacy "always-on" mode is selected. */}
                {hotspot.type === "door" && (persistentMarker || markerVisible) && (
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
                {/* Pulse ring — only for regular items, not Easter eggs.
                    Same gating as doors: ambient mode keeps the room
                    quiet until the player asks. */}
                {hotspot.type === "item" && !isEasterEgg && (persistentMarker || markerVisible) && (
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
              {/* Door label with room name + Living Ark event badge.
                  In ambient mode the label only fades in on hover or
                  Alt-peek so it doesn't sit permanently across whatever
                  art lives above the door. */}
              {hotspot.type === "door" && !isEasterEgg && (persistentMarker || markerVisible) && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-1 -translate-y-full pointer-events-none transition-opacity duration-200"
                  style={{ opacity: markerVisible ? 1 : persistentMarker ? 1 : 0 }}
                >
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

              {/* Verb-coin overlay — only renders for hotspots with an
                  authored room-mystery action. Hover-triggered, sits
                  above the hotspot so it doesn't fight the tooltip
                  below. Click-through stops at the coin so picking a
                  verb doesn't also fire the default Look click. */}
              <AnimatePresence>
                {isHovered && (
                  <VerbCoin
                    visible
                    availableVerbs={availableVerbsFor(hotspot.action)}
                    onVerb={(verb) => onHotspotClick(hotspot, verb)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ?debug-hotspots=1 overlay — bounding box + id label per hotspot
          so we can re-anchor coordinates against the room art without
          guess-and-check. */}
      {debugHotspots && room.hotspots.map((h) => (
        <div
          key={`debug-${h.id}`}
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            width: `${h.width}%`,
            height: `${h.height}%`,
            border: "1px dashed magenta",
            background: "color-mix(in oklch, magenta 8%, transparent)",
            zIndex: 60,
          }}
        >
          <span
            className="font-mono text-[9px]"
            style={{
              position: "absolute",
              top: -14,
              left: 0,
              padding: "0 4px", // void-ignore — ?debug-hotspots=1 dev overlay only
              background: "rgba(0,0,0,0.7)", // void-ignore — ?debug-hotspots=1 dev overlay only
              color: "magenta",
              whiteSpace: "nowrap",
            }}
          >
            {h.id} ({h.x},{h.y},{h.width}×{h.height})
          </span>
        </div>
      ))}

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
    markHotspotCollected,
    bumpHotspotClick,
  } = useGame();
  const { discoverEntry } = useGamification();
  const { setRoomAmbience, playSFX, initAudio, audioReady } = useSound();
  const { notify, notifyAchievement } = useNotificationQueue();
  useGameAreaBGM("ark");
  const [, navigate] = useLocation();
  // ElaraPopup accepts either a single string (legacy default for hotspot
  // one-liners) or an array of beats (long room intros that pace against
  // their VO). The popup itself reduces single strings to a one-beat
  // array internally so the render path is unified.
  const [elaraText, setElaraText] = useState<string | string[] | null>(null);
  const [elaraVoUrl, setElaraVoUrl] = useState<string | undefined>(undefined);
  // Section 9 — manifest id for the current narration. Drives Elara's
  // voice through useElaraVO inside the conversation popup; takes
  // priority over the legacy CDN voUrl when set.
  const [elaraVoId, setElaraVoId] = useState<string | undefined>(undefined);
  // Section 9 — player response choices surfaced once Elara finishes
  // her line. When empty/null, the popup falls through to the default
  // 3-button strip (Acknowledged / Tell me more / [stay silent]).
  const [elaraResponses, setElaraResponses] = useState<
    import("@/components/ElaraConversationPopup").ConversationChoice[] | undefined
  >(undefined);

  // Section 9 — single hook instance per speaker, lifted to the page
  // so both the conversation popup and the companion-presence badge
  // observe the same playback state. Each useNpcVO holds its own
  // `audio` element + `speaking` flag; sharing the instance keeps
  // them in lockstep without a context.
  const elaraVo = useElaraVO();
  const humanVo = useHumanVO();
  const elaraSpeakingNow = elaraVo.speaking;
  const humanSpeakingNow = humanVo.speaking;

  // Mystery Engine — credits a verb response's `mysteryBinding`
  // clue ids to the active case via mysteries.recordEvidence.
  // Idempotent on the server (per-(user, mystery, clue) unique
  // index absorbs duplicates), so firing without an active case
  // is harmless. Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
  // §10 + the MysteryBinding shape in roomMysteries/_template.ts.
  const recordMysteryEvidence = trpc.mysteries.recordEvidence.useMutation();
  // Mystery Engine — opens the Wraith Calder case on first
  // antiquarian-library visit. Fired once per player; gated by
  // the `wraith_case_auto_opened` narrative flag. Server-side
  // openCase is idempotent (existing case rows are returned
  // unchanged), so a duplicate fire is a server no-op.
  const openMysteryCase = trpc.mysteries.openCase.useMutation();

  /**
   * Single entry point for every Elara narration that fires from the
   * Ark explorer. Replaces direct setElaraText() calls so the runtime
   * also wires up the manifest VO id + response strip in one shot.
   */
  const narrateElara = useCallback((opts: {
    text: string | string[];
    voId?: string;
    voUrl?: string;
    responses?: import("@/components/ElaraConversationPopup").ConversationChoice[];
  }) => {
    // Cut any in-flight or queued VO from a previous narration before
    // we hand the popup a new line. Without this, speak() in the hooks
    // sees `speaking === true`, queues the new lineId behind the old
    // one, and the player hears the previous VO finish over the new
    // popup's text.
    elaraVo.stop();
    humanVo.stop();
    setElaraText(opts.text);
    setElaraVoId(opts.voId);
    // When voId is present, prefer the manifest path — clear voUrl so
    // the popup doesn't double-play. When voId is missing the legacy
    // CDN URL still gets through.
    setElaraVoUrl(opts.voId ? undefined : opts.voUrl);
    setElaraResponses(opts.responses);
  }, [elaraVo, humanVo]);

  // Section 9 — hover-whisper throttle + dedup. RoomScene applies a
  // 600ms debounce per hotspot before calling this; we additionally
  // gate on:
  //   • a 12s global throttle so even fast players can't spam Elara
  //   • a per-hotspot Set so each whisper plays at most once per session
  //   • a no-op when the popup is already showing (silence wins)
  const lastWhisperAtRef = useRef<number>(0);
  const playedWhispersRef = useRef<Set<string>>(new Set());
  const firstHoverFiredRef = useRef<boolean>(false);
  const onHotspotHoverWhisper = useCallback((hotspot: HotspotDef) => {
    // Section 9 — first-hover meta-line. The first time any player
    // dwells on any hotspot in any session AND the framing flag is
    // unset, fire the one-shot framing line that establishes Elara
    // as the narrator. Suppresses the per-hotspot whisper this same
    // hover so the two don't overlap.
    if (!firstHoverFiredRef.current && !state.narrativeFlags?.tutorial_elara_narrates_explained) {
      firstHoverFiredRef.current = true;
      setNarrativeFlag("tutorial_elara_narrates_explained");
      narrateElara({
        text: "Don't worry about reading the labels yourself — I'll narrate. Point at what catches your eye and we'll talk it through.",
        voId: "elara.framing.first-hover",
      });
      return;
    }
    if (!hotspot.elaraHoverVoId) return;
    if (elaraText) return; // popup is live; don't talk over the line
    if (playedWhispersRef.current.has(hotspot.id)) return;
    const now = performance.now();
    if (now - lastWhisperAtRef.current < 12_000) return;
    lastWhisperAtRef.current = now;
    playedWhispersRef.current.add(hotspot.id);
    elaraVo.speak(hotspot.elaraHoverVoId);
  }, [elaraText, elaraVo, state.narrativeFlags?.tutorial_elara_narrates_explained, setNarrativeFlag, narrateElara]);
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

  // Section 9 — cryo-bay re-entry beat. The first time the player
  // walks back into the cryo bay AFTER the bridge dead-lock has been
  // resolved (i.e. the autopsy console has handed over the reset
  // code), fire a one-shot Elara line acknowledging the new lens
  // they're seeing the room through. Gated on a dedicated flag so it
  // only fires once across the save.
  useEffect(() => {
    if (!currentRoom || currentRoom.id !== "cryo-bay") return;
    if (!state.narrativeFlags?.bridge_dead_lock_resolved) return;
    if (state.narrativeFlags?.cryo_bay_post_autopsy_reentry_seen) return;
    setNarrativeFlag("cryo_bay_post_autopsy_reentry_seen");
    narrateElara({
      text: "Same room. Different room. We're looking at it through what we know now — go on, look harder.",
      voId: "elara.cryo-bay.post-autopsy-reentry",
    });
  }, [
    currentRoom?.id,
    state.narrativeFlags?.bridge_dead_lock_resolved,
    state.narrativeFlags?.cryo_bay_post_autopsy_reentry_seen,
    setNarrativeFlag,
    narrateElara,
  ]);

  // Investigator briefing — first cryo-bay entry only. Teaches the
  // "look more than once for tier escalation" pattern that the room's
  // hotspots rely on. Resolves to the appropriate Elara stability band
  // via the scheduler's "_*" expansion (cryo_orient_08_lucid by default
  // on a fresh save). Gated by cryo_briefing_delivered so it never
  // replays.
  useEffect(() => {
    if (!currentRoom || currentRoom.id !== "cryo-bay") return;
    if (state.narrativeFlags?.cryo_briefing_delivered) return;
    setNarrativeFlag("cryo_briefing_delivered");
    enqueueCompanionLine("cryo_orient_08_*");
  }, [
    currentRoom?.id,
    state.narrativeFlags?.cryo_briefing_delivered,
    setNarrativeFlag,
  ]);

  // First-visit music cue. Mirrors the existing
  // music_heard_<song> flag pattern from RoomDialog beats —
  // doesn't auto-play audio, just marks the trigger as
  // armed so other systems (radio mode, codex) can light up
  // the discography entry. See apps/client/src/game/livingArk.ts
  // MUSIC_TRIGGERS.
  useEffect(() => {
    if (!currentRoom || !currentRoomState) return;
    if (currentRoomState.visitCount !== 1) return;
    // mobileNarrator's NarratorRoomId uses underscores (cryo_bay)
    // while ROOM_DEFINITIONS uses dashes (cryo-bay). MUSIC_TRIGGERS
    // is keyed off the underscored RoomId from livingArk. Map once.
    const livingRoomId = toNarratorRoomId(currentRoom.id);
    if (!livingRoomId) return;
    const trigger = MUSIC_TRIGGERS.find((t) => t.room === livingRoomId);
    if (!trigger) return;
    const flagKey = `music_heard_${trigger.song
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")}`;
    if (!state.narrativeFlags[flagKey]) {
      setNarrativeFlag(flagKey);
    }
  }, [currentRoom?.id, currentRoomState?.visitCount, state.narrativeFlags, setNarrativeFlag]);

  // Mystery Engine — auto-open the Wraith Calder case the first
  // time a player enters the antiquarian library. The library is
  // the lore-natural unlock surface for the arc (the Antiquarian's
  // ep1-15 margin note about "the one who walked toward the wall
  // when others ran"). Gated by a one-shot narrative flag; server-
  // side openCase is idempotent so a duplicate fire is harmless.
  useEffect(() => {
    if (currentRoom?.id !== "antiquarian-library") return;
    if (state.narrativeFlags["wraith_case_auto_opened"]) return;
    setNarrativeFlag("wraith_case_auto_opened");
    openMysteryCase.mutate({
      mysteryId: "mystery.wraith_calder",
      lensId: "lens.neutral",
    });
  }, [currentRoom?.id, state.narrativeFlags, setNarrativeFlag, openMysteryCase]);

  // Cross-room ripple — when a showcase room's tier advances, fire
  // the matching getCrossRoomAlerts() entries as user-facing
  // notifications so distant rooms feel coupled. Tier→eventType
  // mapping: 1 = system_anomaly (something stirred), 2 =
  // signal_fragment (a system came online), 3 = tome_discovered
  // (a chapter is closed). See apps/client/src/game/livingArk.ts
  // getCrossRoomAlerts().
  const previousTiersRef = useRef<Record<string, RoomTier>>({});
  useEffect(() => {
    const prev = previousTiersRef.current;
    const next: Record<string, RoomTier> = {};
    const tierToEventType: Record<RoomTier, EventType | null> = {
      0: null,
      1: "system_anomaly",
      2: "signal_fragment",
      3: "tome_discovered",
    };
    for (const roomId of ["cryo-bay", "medical-bay", "bridge", "engineering"]) {
      const tier = getRoomTier(roomId, { narrativeFlags: state.narrativeFlags });
      next[roomId] = tier;
      const prevTier = prev[roomId] ?? 0;
      if (tier > prevTier) {
        const eventType = tierToEventType[tier];
        if (!eventType) continue;
        const livingRoomId = toNarratorRoomId(roomId);
        if (!livingRoomId) continue;
        const alerts = getCrossRoomAlerts(eventType, livingRoomId as LivingArkRoomId);
        for (const alert of alerts) {
          notify(`cross-room-${alert.alertType}`, alert.title, alert.description);
        }
      }
    }
    previousTiersRef.current = next;
  }, [state.narrativeFlags, notify]);

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
  const [inventoryDrawerOpen, setInventoryDrawerOpen] = useState(false);
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
      // Watcher: tally attempts per door. After 3 attempts on the
      // same door, surface a Watcher comment acknowledging the
      // operator's persistence. Threshold check uses the local log
      // mirror; appendObservation runs first so the just-counted
      // attempt is included.
      observeWatcher({ kind: "locked_door_attempt", doorId: targetRoomId, at: Date.now() });
      const log = readWatcherLog();
      const sameDoorAttempts = log.events.reduce(
        (n, e) => n + (e.kind === "locked_door_attempt" && e.doorId === targetRoomId ? 1 : 0),
        0,
      );
      if (sameDoorAttempts === 3) {
        fireCompanionComment("watcher_locked_door_persistence");
      }
      return;
    }

    const isNew = !state.rooms[targetRoomId]?.visited;
    const fromRoom = state.currentRoomId || "cryo-bay";
    if (audioReady) playSFX("room_enter");
    const toRoomImage = resolveRoomBackgroundUrl(
      targetRoomId,
      state.narrativeFlags,
      targetDef.imageUrl,
    );
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

  const handleHotspotClick = useCallback((hotspot: HotspotDef, verb: Verb = "look") => {
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
          // Two strings on purpose: a short HUD line for the toast and a
          // longer in-fiction beat Elara speaks. We avoid "locked"/"unlock
          // X rooms" phrasing here — the Ark seals doors for reasons, and
          // those reasons should sound like ship behaviour, not a level
          // gate.
          let toastReason = "The door won't open.";
          let elaraReason = "The door won't open. Whatever the Ark is waiting for, we haven't given it yet.";

          if (req?.type === "narrative_event" && req.value === "cryo_mystery_victim_identified") {
            // Med Bay quarantine — the cryo-bay incident triggered an
            // automatic seal. The Ark won't lift it until the dead is
            // named: torn ID tag slotted into the cracked data-slate.
            toastReason = "Medical Bay is in quarantine lockdown.";
            elaraReason =
              "Medical won't open until the dead are named. Find the ID tag — the cord under the frosted glass tells you it was taken — and the cracked data-slate hidden under the pod. Slot the tag against the slate's scanner. Once the manifest knows who died, the Ark will let us in.";
          } else if (req?.type === "narrative_event") {
            toastReason = "The Ark hasn't cleared this section yet.";
            elaraReason =
              "The Ark hasn't cleared this section yet. Something earlier in the ship has to change before she'll route us through here.";
          } else if (req?.type === "rooms_unlocked") {
            toastReason = "Section access still restricted.";
            elaraReason = `The Ark is staging access deck by deck. We need ${req.value} sections cleared before this one's on the route.`;
          } else if (req?.type === "items_collected") {
            toastReason = "Inventory threshold not met.";
            elaraReason = `This section is keyed to a recovery threshold — ${req.value} items pulled from the ship before she'll open it.`;
          } else if (req?.type === "specific_item") {
            toastReason = "Credential or key required.";
            elaraReason =
              "There's a credential check on this door. The Ark wants something specific in your hand before she'll open it. We haven't found it yet.";
          } else if (req?.type === "chain_complete") {
            toastReason = "Storyline gate.";
            elaraReason =
              "This door is keyed to an arc we haven't finished. The Ark is patient about that kind of thing — finish what we started, and she opens.";
          }

          if (audioReady) playSFX("door_locked");
          notify("error", "ACCESS DENIED", toastReason);
          setElaraText(elaraReason);
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
      case "npc": {
        // Phase C — NPC presence at room hotspots. The hotspot carries
        // a FactionNPCId; opening NPCDialog with buildFirstContactScene
        // routes through useDialogVO (already wired to play VO) and
        // through the global vo-speaking refcount (Phase A) so the BGM
        // ducks while the NPC speaks. No additional plumbing required.
        if (!hotspot.npcId) break;
        const scene = buildFirstContactScene(hotspot.npcId as FactionNPCId);
        setNpcDialogScene(scene);
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
        // Room mystery dispatch (Section F+). Two action prefixes:
        //   `cryo-mystery:<id>`            — legacy, cryo bay only
        //   `room-mystery:<roomId>:<id>`   — generic, any room module
        // Both resolve against apps/shared/roomMysteries (registry +
        // verb × hotspot matrices). Default verb is Look — the
        // verb-coin UI ships in PointAndClickScene as a follow-up.
        if (
          hotspot.action?.startsWith("cryo-mystery:") ||
          hotspot.action?.startsWith("room-mystery:")
        ) {
          let roomId: string;
          let hotspotId: string;
          if (hotspot.action.startsWith("cryo-mystery:")) {
            roomId = "cryo-bay";
            hotspotId = hotspot.action.slice("cryo-mystery:".length);
          } else {
            const rest = hotspot.action.slice("room-mystery:".length);
            const sep = rest.indexOf(":");
            roomId = sep === -1 ? "" : rest.slice(0, sep);
            hotspotId = sep === -1 ? "" : rest.slice(sep + 1);
          }
          const mod = getRoomMysteryModule(roomId);
          // Sierra-style escalation: each click on the same hotspot
          // serves a deeper tier. Bump first so the count we resolve
          // against is the post-bump value (1 on first click → base
          // response; 2 → tiers[0]; …).
          const clickCount = mod ? bumpHotspotClick(roomId, hotspotId) : 1;
          const mystery = mod
            ? resolveTierResponse(mod, verb, hotspotId, clickCount)
            : null;
          if (!mystery) {
            // Verb-coin disables verbs without authored responses, so
            // a missing reaction here is most plausibly a player who
            // clicked the hotspot directly (Look default) on a hotspot
            // that didn't author Look. Same fallback either way.
            setElaraText("Nothing reveals itself here.");
            break;
          }
          if (audioReady) playSFX("dialog_open");
          // Resolve Elara's banded narration against her live stability.
          // Plain-string narrations (surface beats, red herrings) fall
          // through unchanged.
          const elaraTextResolved = resolveBandedNarration(
            mystery.narration,
            stabilityBand(state.elaraStability),
          );

          // Detective duet — once the Prelude has set
          // `first_human_revealed`, hotspots that authored a
          // `humanReaction` get an "Ask the Human." choice prepended
          // to the response strip. Picking it skips the YOU echo,
          // routes the Detective's banded line through the popup's
          // detectiveSpeaking phase, and exposes a cost-bearing fork
          // that pushes Elara's stability and the Human's light in
          // opposing directions to dramatize the choice.
          const humanRevealed = !!state.narrativeFlags["first_human_revealed"];
          const human = humanRevealed
            ? resolveHumanReaction(mystery, lightBand(state.humanLight))
            : null;
          const baseResponses = mystery.responses?.map((r) => ({
            id: r.id,
            label: r.label,
            elaraFollowUpVoId: r.elaraFollowUpVoId,
            elaraFollowUpText: r.elaraFollowUpText,
            closesDialog: r.closesDialog,
            onPick: r.logsClue ? (() => logClue(r.logsClue!)) : undefined,
          })) ?? [];
          const askHuman = human ? [{
            id: `ask-human:${roomId}:${hotspotId}:${verb}:t${clickCount}`,
            label: "Ask the Human.",
            skipPlayerEcho: true,
            detectiveFollowUpVoId: human.voId,
            detectiveFollowUpText: human.text,
            onPick: () => {
              if (human.logsClue) logClue(human.logsClue);
              if (human.setsFlag) setNarrativeFlag(human.setsFlag);
            },
            // The fork is in-fiction — the player chooses who they
            // believe, and the consequence shows up later in tone, not
            // in a number on screen. Leans relational, not punitive;
            // one option lets them refuse the choice entirely.
            followUpResponses: [
              {
                id: `ask-human:stay-elara:${roomId}:${hotspotId}:t${clickCount}`,
                label: "She lived through it. I'll take her read.",
                closesDialog: true,
                onPick: () => {
                  adjustElaraTrust(1);
                  adjustHumanTrust(-1);
                },
              },
              {
                id: `ask-human:trust-detective:${roomId}:${hotspotId}:t${clickCount}`,
                label: "He watched it happen. I'll take his.",
                closesDialog: true,
                onPick: () => {
                  adjustElaraTrust(-1);
                  adjustHumanTrust(1);
                },
              },
              {
                id: `ask-human:both:${roomId}:${hotspotId}:t${clickCount}`,
                label: "I want both of you. Keep talking.",
                closesDialog: true,
              },
            ],
          }] : [];
          // Section 9 — route through narrateElara so the popup also
          // picks up the manifest VO id and the response strip. The
          // legacy `vo` URL field is honoured as a fallback for any
          // mystery beat that hasn't migrated to a manifest id yet.
          // Banded narrations carry one base voId in the source of
          // truth; the manifest stores three audio files keyed by
          // band suffix. Resolve to the band-specific id here so the
          // playback matches the displayed text.
          const elaraVoIdResolved = resolveBandedVoId(
            mystery.voId,
            mystery.narration,
            stabilityBand(state.elaraStability),
          );
          narrateElara({
            text: elaraTextResolved,
            voId: elaraVoIdResolved,
            voUrl: elaraVoIdResolved ? undefined : mystery.vo,
            responses: [...askHuman, ...baseResponses],
          });
          if (mystery.logsClue) logClue(mystery.logsClue);
          if (mystery.grantsInventory) {
            grantMysteryItem(mystery.grantsInventory);
            // Auto-open the inspect modal for pickups so the player
            // sees the item's lore/analysis the moment they pocket it,
            // rather than only when they later open the inventory.
            setSelectedItem(mystery.grantsInventory);
          }
          if (mystery.setsFlag) setNarrativeFlag(mystery.setsFlag);
          if (mystery.mysteryBinding) {
            // Credit the bound clue ids to the player's active
            // mystery case. Fire-and-forget — the server's per-
            // (user, mystery, clue) unique index makes this
            // idempotent, so a duplicate click on the same hotspot
            // is a no-op on the DB.
            for (const clueId of mystery.mysteryBinding.cluesFound) {
              recordMysteryEvidence.mutate({
                mysteryId: mystery.mysteryBinding.mysteryId,
                clueId,
                foundInRoom: roomId,
                foundViaVerb: verb,
              });
            }
          }
          if (mystery.consumesHotspot) {
            // One-shot pickup — remove the hotspot from the scene so
            // the data-slate / locket don't keep glowing after they're
            // in the player's pocket.
            markHotspotCollected(roomId, hotspotId);
          }
          if (mystery.unlocksExit) {
            const exitDef = getRoomDef(mystery.unlocksExit);
            const exitName = exitDef?.name?.toUpperCase() ?? mystery.unlocksExit.toUpperCase();
            notify(
              "room-unlock",
              `${exitName} UNSEALED`,
              "The bulkhead has accepted your case file. A new area is open.",
            );
          }
          break;
        }
        if (hotspot.action === "comms-relay-import") {
          if (audioReady) playSFX("terminal_access");
          break;
        }
        // Section 8 — Murder-mystery clue turn-in. The bio-bed autopsy
        // console reads the data-slate fragment recovered from the
        // dead pod, returning the Bridge reset code that the door is
        // missing. Without the slate it's an empty queue — the player
        // is sent back to the cryo bay to keep investigating.
        if (hotspot.action === "bio-bed-autopsy-console") {
          if (audioReady) playSFX("terminal_access");
          const hasSlate = state.mysteryInventory.includes("data-slate-fragment");
          if (!hasSlate) {
            setElaraText(
              "There's nothing for me to read here yet. The slate from the pod next to yours might give us something to work with — go back to the cryo bay and look beneath the dark pod.",
            );
            break;
          }
          if (state.itemsCollected.includes("bridge-reset-code")) {
            setElaraText(
              "We already pulled the reset code off the slate. The Bridge will accept it once — let's go.",
            );
            break;
          }
          setElaraText(
            "Slate accepted. Manifest match: Potential AK-74-0073. Time of death — ninety seconds before your revival. Last write to the slate was a panic broadcast: the Bridge reset code. They tried to send it before the door's auth handshake was severed. They didn't make it. We will. Code locked into your operative ledger.",
          );
          collectItem("bridge-reset-code");
          setSelectedItem("bridge-reset-code");
          setNarrativeFlag("bridge_dead_lock_resolved");
          notify(
            "room-unlock",
            "BRIDGE RESET CODE RECOVERED",
            "Return to the Bridge Access door — it will accept the code once.",
          );
          break;
        }
        if (hotspot.elaraDialog) {
          if (audioReady) playSFX("dialog_open");
          // Section 9 — route through narrateElara so the popup picks
          // up the optional VO manifest id + response strip authored
          // on the hotspot. Hotspots that don't author either still
          // get the default 3-button strip and silent text.
          narrateElara({
            text: hotspot.elaraDialog,
            voId: hotspot.elaraDialogVoId,
            responses: hotspot.responses?.map((r) => ({
              id: r.id,
              label: r.label,
              elaraFollowUpVoId: r.elaraFollowUpVoId,
              elaraFollowUpText: r.elaraFollowUpText,
              closesDialog: r.closesDialog,
              onPick: r.logsClue ? (() => logClue(r.logsClue!)) : undefined,
            })),
          });
        }
        break;
      }
    }
  }, [isRoomUnlocked, canUnlockRoom, navigateWithTransition, collectItem, navigate, state.itemsCollected, state.mysteryInventory, discoverEntry, getRoomDef, audioReady, playSFX, roomNeedsPuzzle, fastTravelUnlocked, markHotspotCollected, setNarrativeFlag, notify]);

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
      <LivingShipSensorOverlay />
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
            {/* Phase B — Adventure-inventory backpack toggle. Reads
                state.mysteryInventory and runs INVENTORY_COMBINATIONS
                via tryCombineItems(). The badge surfaces item count so
                the player knows when a pickup just landed. */}
            <button
              onClick={() => setInventoryDrawerOpen((v) => !v)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] transition-all"
              style={{
                background: inventoryDrawerOpen ? "color-mix(in oklch, var(--energy-premium) 15%, transparent)" : "color-mix(in oklch, var(--text-primary) 3%, transparent)",
                border: `1px solid ${inventoryDrawerOpen ? "color-mix(in oklch, var(--energy-premium) 30%, transparent)" : "color-mix(in oklch, var(--text-primary) 10%, transparent)"}`,
                color: inventoryDrawerOpen ? "var(--energy-premium)" : "color-mix(in oklch, var(--text-primary) 50%, transparent)",
              }}
              title="Inventory"
            >
              <Backpack size={12} />
              INVENTORY
              {state.mysteryInventory && state.mysteryInventory.length > 0 && (
                <span
                  className="ml-1 px-1.5 rounded-full font-mono text-[9px]"
                  style={{
                    background: "color-mix(in oklch, var(--energy-premium) 30%, transparent)",
                    color: "var(--energy-premium)",
                  }}
                >
                  {state.mysteryInventory.length}
                </span>
              )}
            </button>
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
              onHotspotHoverWhisper={onHotspotHoverWhisper}
              itemsCollected={state.itemsCollected}
              collectedHotspots={state.rooms[currentRoom.id]?.collectedHotspots ?? []}
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

      {/* Section 9 — Conversation popup. The new component preserves
          ElaraPopup's visual layout but adds:
            • response-strip after Elara's line ends
            • viseme-synced HolographicElara when audio is live
            • avatar swap to "YOU" while the human's reply plays
          When `responses` is empty/undefined the popup falls through to
          the default 3-button strip (Acknowledged / Tell me more / silent). */}
      <AnimatePresence>
        {elaraText && (
          <ElaraConversationPopup
            text={elaraText}
            voId={elaraVoId}
            voUrl={elaraVoUrl}
            responses={elaraResponses}
            elaraVo={elaraVo}
            humanVo={humanVo}
            onClose={() => {
              window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: false } }));
              setElaraText(null);
              setElaraVoUrl(undefined);
              setElaraVoId(undefined);
              setElaraResponses(undefined);
              if (audioReady) playSFX("dialog_close");
            }}
          />
        )}
      </AnimatePresence>

      {/* Section 9 — Persistent companion-presence pip in the room.
          Pulses solid-cyan when Elara is speaking, solid-violet when
          the human is replying. Tells the player whose voice is live. */}
      <CompanionPresenceBadge
        elaraSpeaking={elaraSpeakingNow}
        humanSpeaking={humanSpeakingNow}
        placement="bottom-right"
      />

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

      {/* Phase B — Adventure inventory drawer. Always mounted so the
          player can review items + run combines from any room. */}
      <AdventureInventoryDrawer
        open={inventoryDrawerOpen}
        onClose={() => setInventoryDrawerOpen(false)}
      />


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
