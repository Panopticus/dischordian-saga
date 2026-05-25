/* ═══════════════════════════════════════════════════════
   AWAKENING PAGE — First-time cryo pod experience
   Horror sci-fi narrative character creation through Elara dialog
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useGame, type AwakeningStep } from "@/contexts/GameContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { TITLE_T01_LOREDEX_ENTRY } from "@/lib/titleT01Entry";
import AwakeningCharacterPreview from "@/pages/awakening/AwakeningCharacterPreview";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import HolographicElara from "@/components/HolographicElara";
import { MobileNarratorSlot } from "@/components/MobileNarratorSlot";
import OpeningCinematic, { AWAKENING_BED_URLS } from "@/components/OpeningCinematic";
import { resolveRoomStateAsset } from "@/game/roomStateAssets";
import { getAwakeningCinematic } from "@shared/awakeningCinematicPrompts";
import { observe as observeWatcher } from "@/lib/watcher";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp";

/* ─── TYPEWRITER HOOK ─── */
/**
 * Resolve the effective typewriter speed. Respects the player's setting
 * via --typewriter-speed-ms (inline on <html>, written by settingsSync),
 * falls back to the caller's default if unset. A 0 value short-circuits
 * to instant reveal — players who opted for "no typewriter" in settings
 * see the full line immediately while narrative beats still fire.
 */
function resolveTypewriterSpeed(fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const raw = document.documentElement.style.getPropertyValue("--typewriter-speed-ms").trim();
  if (raw === "") return fallback;
  const n = parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

function useTypewriter(text: string, speed = 30, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const effectiveSpeed = resolveTypewriterSpeed(speed);
    // Treat 0ms as instant — the same code path the caller uses when
    // `enabled` is false, keeping completion semantics consistent.
    if (!enabled || effectiveSpeed === 0) { setDisplayed(text); setDone(true); return; }
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
    }, effectiveSpeed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  const skip = useCallback(() => { setDisplayed(text); setDone(true); }, [text]);

  return { displayed, done, skip };
}

/* ─── ELARA DIALOG BOX ─── */
/** CDN VO audio URLs keyed by step — when present, plays instead of browser TTS */
const STEP_VO_AUDIO: Partial<Record<string, string>> = {
  CRYO_OPEN: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/CRYO_OPEN.mp3",
  ELARA_INTRO: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/ELARA_INTRO.mp3",
  SPECIES_QUESTION: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/SPECIES_QUESTION.mp3",
  CLASS_QUESTION: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/CLASS_QUESTION.mp3",
  ALIGNMENT_QUESTION: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/ALIGNMENT_QUESTION.mp3",
  ELEMENT_QUESTION_DEMAGI: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/ELEMENT_QUESTION.mp3",
  ELEMENT_QUESTION_QUARCHON: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/ELEMENT_QUESTION.mp3",
  NAME_INPUT: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/NAME_INPUT.mp3",
  ATTRIBUTES: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/ATTRIBUTES.mp3",
  FIRST_STEPS: "https://dgrsvoices.s3.us-east-2.amazonaws.com/Elara%20Voices/awakening/FIRST_STEPS.mp3",
};

// F3 — module-level dedupe. StrictMode can double-invoke mount effects in
// dev; without this guard a voId would play twice. Cleared when the player
// returns to a fresh session (reload).
const PLAYED_VO_IDS = new Set<string>();

/* ─── AWAKENING VO PLAYER (singleton) ─────────────────────────────
 * One Elara line plays at a time across the whole page. Solves the
 * "governing force" overlap bug where a new step mounted before the
 * prior step's audio finished, and two VO elements played on top of
 * each other. Also ducks the looping Saga Theme bed so Elara's VO is
 * clearly intelligible.
 *
 *   - play(url, themeAudio): pauses any prior VO, starts the new one,
 *     and fades the theme from its current volume → THEME_DUCKED.
 *     If the theme has not been started yet (it's prepared paused by
 *     OpeningCinematic), play() also kicks it off — so the music bed
 *     enters the moment Elara begins her first line, not during the
 *     silent BLACKOUT fade-in that precedes her.
 *   - stop(): pauses the current VO and restores the theme to
 *     THEME_BED_AFTER_VO (a touch below the default 0.55 so Elara's
 *     silences still feel quiet, not foreground).
 *
 * Theme restoration happens on `ended`, `pause`, or component cleanup.
 * ────────────────────────────────────────────────────────────────── */
// Theme bed levels for the awakening flow. THEME_DUCKED was 0.012
// (effectively silent under Elara's VO) and THEME_BED_AFTER_VO was
// 0.20; both bumped so the saga theme is actually perceptible as a
// continuous bed across the cinematic → cryo-open → dialog handoff
// instead of going inaudible during every line.
const THEME_DUCKED = 0.06;
const THEME_BED_AFTER_VO = 0.28;

const AwakeningVOPlayer = (() => {
  let current: HTMLAudioElement | null = null;
  let currentUrl: string | null = null;
  let fadeTimer: ReturnType<typeof setInterval> | null = null;

  const fadeThemeTo = (theme: HTMLAudioElement | null, target: number, ms = 400) => {
    if (!theme) return;
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    const startVol = theme.volume;
    const delta = target - startVol;
    if (Math.abs(delta) < 0.01) { theme.volume = target; return; }
    const steps = Math.max(4, Math.floor(ms / 50));
    let i = 0;
    fadeTimer = setInterval(() => {
      i += 1;
      const t = Math.min(1, i / steps);
      theme.volume = Math.max(0, Math.min(1, startVol + delta * t));
      if (t >= 1 && fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    }, 50);
  };

  const startThemeIfNeeded = (theme: HTMLAudioElement | null) => {
    if (!theme) return;
    if (theme.paused) {
      theme.volume = 0;
      theme.play().catch(() => { /* autoplay blocked — VO gesture should cover us */ });
    }
  };

  const restoreTheme = (theme: HTMLAudioElement | null) => {
    fadeThemeTo(theme, THEME_BED_AFTER_VO, 600);
  };

  return {
    play(url: string, theme: HTMLAudioElement | null): HTMLAudioElement {
      // Enforce single-speaker: pause whatever was playing before.
      if (current && currentUrl !== url) {
        current.onended = null;
        current.pause();
      }
      // crossOrigin MUST be set before src so the browser issues the
      // CORS preflight on initial load — required for wawa-lipsync's
      // Web Audio analyser to read samples (otherwise connectAudio
      // throws and Elara's mouth stalls on the REST cell).
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      audio.volume = 0.95;
      audio.src = url;
      current = audio;
      currentUrl = url;
      const onDone = () => {
        if (current === audio) { current = null; currentUrl = null; }
        restoreTheme(theme);
      };
      audio.addEventListener("ended", onDone);
      audio.addEventListener("pause", () => {
        if (audio.ended || audio.currentTime >= audio.duration) restoreTheme(theme);
      });
      // Kick the theme off (if cinematic handed it to us paused) and
      // duck it under the VO. Fade is from 0 → THEME_DUCKED so the
      // music bed slides in alongside Elara, never alone.
      startThemeIfNeeded(theme);
      fadeThemeTo(theme, THEME_DUCKED, 400);
      return audio;
    },
    stop(theme: HTMLAudioElement | null) {
      if (current) {
        current.onended = null;
        current.pause();
        current = null;
        currentUrl = null;
      }
      restoreTheme(theme);
    },
    get currentUrl() { return currentUrl; },
  };
})();

function ElaraDialogBox({
  text,
  onContinue,
  showPortrait = true,
  choices,
  onChoice,
  voAudioUrl,
  themeAudio,
  onVoPlaybackFailed,
}: {
  text: string;
  onContinue?: () => void;
  showPortrait?: boolean;
  choices?: { label: string; value: string; description?: string }[];
  onChoice?: (value: string) => void;
  voAudioUrl?: string;
  /** Looping Saga Theme — ducked while Elara speaks, restored after. */
  themeAudio?: HTMLAudioElement | null;
  /** F3 — called when VO audio demonstrably fails to play so the parent's TTS
   * fallback can step in. Not called on timeout; only on explicit failure. */
  onVoPlaybackFailed?: () => void;
}) {
  // When VO audio drives this beat, skip the typewriter — visemes start
  // at t=0 of the audio while a 25ms/char reveal lags the line by ~3s,
  // creating obvious lip-sync drift. The TTS-fallback path keeps the
  // typewriter so synthesized speech still feels paced.
  const typewriterEnabled = !voAudioUrl;
  const { displayed, done, skip } = useTypewriter(text, 25, typewriterEnabled);
  // Exposed to HolographicElara so wawa-lipsync can drive visemes from
  // the live VO stream. Null whenever we fall through to TTS.
  const [voAudio, setVoAudio] = useState<HTMLAudioElement | null>(null);

  // Play VO audio via the singleton AwakeningVOPlayer — enforces
  // one-speaker-at-a-time and ducks the theme bed during playback.
  useEffect(() => {
    if (!voAudioUrl) { setVoAudio(null); return; }
    if (PLAYED_VO_IDS.has(voAudioUrl)) { setVoAudio(null); return; }
    PLAYED_VO_IDS.add(voAudioUrl);

    const audio = AwakeningVOPlayer.play(voAudioUrl, themeAudio ?? null);
    setVoAudio(audio);

    const handleFailure = () => { onVoPlaybackFailed?.(); };
    audio.addEventListener("error", handleFailure);
    audio.addEventListener("abort", handleFailure);

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked — attach a one-time gesture listener to retry.
        const retryPlay = () => {
          audio.play().catch(() => {});
          document.removeEventListener("click", retryPlay);
          document.removeEventListener("touchstart", retryPlay);
        };
        document.addEventListener("click", retryPlay, { once: true });
        document.addEventListener("touchstart", retryPlay, { once: true });
      });
    };
    tryPlay();

    return () => {
      audio.removeEventListener("error", handleFailure);
      audio.removeEventListener("abort", handleFailure);
      setVoAudio(null);
      // Only stop if this effect still owns the current VO — otherwise a
      // newer step already took over and we'd yank its audio.
      if (AwakeningVOPlayer.currentUrl === voAudioUrl) {
        AwakeningVOPlayer.stop(themeAudio ?? null);
      }
    };
  }, [voAudioUrl, themeAudio, onVoPlaybackFailed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto"
      style={{ width: "100%", maxWidth: "42rem" }}
    >
      <div className="relative w-full" style={{ width: "100%" }}>
        {/* Holographic Elara portrait */}
        {showPortrait && (
          <div className="flex justify-center mb-4">
            <HolographicElara size="md" isSpeaking={!done} audio={voAudio} />
          </div>
        )}

        {/* Dialog box */}
        <div
          className="rounded-lg p-3 sm:p-6 relative overflow-hidden w-full"
          style={{
            width: "100%",
            background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
            border: "1px solid color-mix(in oklch, var(--energy-primary) 20%, transparent)",
            boxShadow:
              "0 0 var(--space-md) color-mix(in oklch, var(--energy-primary) 5%, transparent), inset 0 1px 0 color-mix(in oklch, var(--energy-primary) 10%, transparent)",
          }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--energy-primary) 10%, transparent) 2px, color-mix(in oklch, var(--energy-primary) 10%, transparent) 4px)",
          }} />

          {/* Speaker-label caption. Rendered when the player has captions
              turned on in settings (html.captions-on). Reinforces who is
              speaking during VO playback — the dialog text IS the caption
              for what Elara says, but the "[ ELARA ]" label answers the
              "who" question for hearing-impaired first-run players. */}
          <span
            className="caption-label mb-2 font-mono text-[9px] tracking-[0.3em] text-[var(--neon-cyan)]/80"
            aria-hidden
          >
            [ ELARA ]
          </span>

          <p
            className="font-mono text-xs sm:text-base text-foreground leading-relaxed relative z-10 min-h-[2em] sm:min-h-[3em] break-words"
            style={{ wordBreak: "normal", overflowWrap: "break-word" }}
            role="status"
            aria-live="polite"
          >
            {displayed}
            {!done && <span className="inline-block w-2 h-4 bg-[var(--neon-cyan)] ml-1 animate-pulse" />}
          </p>

          {/* Continue or choices */}
          <div className="mt-4 relative z-10">
            {done && choices && onChoice ? (
              <div className="space-y-2">
                {choices.map((choice, i) => (
                  <motion.button
                    key={choice.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    onClick={() => onChoice(choice.value)}
                    className="w-full text-left px-4 py-3 sm:px-5 sm:py-4 rounded-md font-mono text-sm sm:text-base transition-all group"
                    style={{
                      background: "color-mix(in oklch, var(--energy-primary) 5%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--energy-primary) 15%, transparent)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "color-mix(in oklch, var(--energy-primary) 12%, transparent)";
                      e.currentTarget.style.borderColor = "color-mix(in oklch, var(--energy-primary) 40%, transparent)";
                      e.currentTarget.style.boxShadow = "0 0 15px color-mix(in oklch, var(--energy-primary) 10%, transparent)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "color-mix(in oklch, var(--energy-primary) 5%, transparent)";
                      e.currentTarget.style.borderColor = "color-mix(in oklch, var(--energy-primary) 15%, transparent)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span className="text-[var(--neon-cyan)]/70 mr-2">&gt;</span>
                    <span className="text-foreground/90 group-hover:text-white">{choice.label}</span>
                    {choice.description && (
                      <span className="block text-sm sm:text-base text-foreground/75 group-hover:text-foreground/90 mt-2 ml-5 leading-relaxed tracking-normal">{choice.description}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : done && onContinue ? (
              <button
                onClick={onContinue}
                className="font-mono text-xs text-[var(--neon-cyan)]/60 hover:text-[var(--neon-cyan)] transition-colors flex items-center gap-1"
              >
                <span className="animate-pulse">&gt;</span> // continue
              </button>
            ) : !done ? (
              <button
                onClick={skip}
                className="font-mono text-xs text-muted-foreground/35 hover:text-muted-foreground/60 transition-colors"
              >
                [click to skip]
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── ATTRIBUTE ALLOCATOR ─── */
function AttributeAllocator({
  attack, defense, vitality,
  onChange,
  onConfirm,
}: {
  attack: number; defense: number; vitality: number;
  onChange: (a: number, d: number, v: number) => void;
  onConfirm: () => void;
}) {
  const total = attack + defense + vitality;
  const remaining = 9 - total;

  const adjust = (attr: "a" | "d" | "v", delta: number) => {
    let a = attack, d = defense, v = vitality;
    if (attr === "a") a = Math.max(1, Math.min(5, a + delta));
    if (attr === "d") d = Math.max(1, Math.min(5, d + delta));
    if (attr === "v") v = Math.max(1, Math.min(5, v + delta));
    if (a + d + v <= 9) onChange(a, d, v);
  };

  const renderDots = (val: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-3 h-3 rounded-full border ${
          i <= val
            ? "bg-[var(--neon-cyan)] border-[var(--neon-cyan)]/50 shadow-[0_0_6px_var(--neon-cyan)]"
            : "border-border bg-transparent"
        }`} />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-lg p-5" style={{
        background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
        border: "1px solid color-mix(in oklch, var(--energy-primary) 20%, transparent)",
      }}>
        <h3 className="font-display text-sm tracking-[0.2em] text-[var(--neon-cyan)] mb-1">NEURAL CALIBRATION</h3>
        <p className="font-mono text-[11px] text-muted-foreground/60 mb-4">
          Distribute 9 signal channels across your neural lattice. Each begins at minimum resonance, peaks at full sync.
          <span className="text-[var(--neon-cyan)] ml-1">Unbound channels: {remaining}</span>
        </p>

        {[
          { label: "ATTACK", desc: "Strike resonance", val: attack, key: "a" as const },
          { label: "DEFENSE", desc: "Shielding wave", val: defense, key: "d" as const },
          { label: "VITALITY", desc: "Lifesignal depth", val: vitality, key: "v" as const },
        ].map(attr => (
          <div key={attr.key} className="flex items-center justify-between mb-3">
            <div className="w-24">
              <p className="font-mono text-xs text-foreground/85">{attr.label}</p>
              <p className="font-mono text-xs text-muted-foreground/50">{attr.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjust(attr.key, -1)}
                className="w-10 h-10 rounded border border-border text-muted-foreground/60 hover:text-white hover:border-white/40 font-mono text-sm flex items-center justify-center transition-colors"
              >-</button>
              {renderDots(attr.val)}
              <button
                onClick={() => adjust(attr.key, 1)}
                className="w-10 h-10 rounded border border-border text-muted-foreground/60 hover:text-white hover:border-white/40 font-mono text-sm flex items-center justify-center transition-colors"
              >+</button>
            </div>
          </div>
        ))}

        <button
          onClick={onConfirm}
          disabled={total !== 9}
          className="w-full mt-3 py-2.5 rounded-md font-mono text-sm tracking-wider transition-all disabled:opacity-30"
          style={{
            background: total === 9 ? "color-mix(in oklch, var(--energy-primary) 15%, transparent)" : "transparent",
            border: `1px solid color-mix(in oklch, var(--energy-primary) calc((total === 9 ? 0.4 : 0.1) * 100%), transparent)`,
            color: total === 9 ? "var(--neon-cyan)" : "color-mix(in oklch, var(--text-primary) 30%, transparent)",
          }}
        >
          CALIBRATE NEURAL MATRIX
        </button>
      </div>
    </motion.div>
  );
}

/* ─── MAIN AWAKENING PAGE ─── */
export default function AwakeningPage({ elaraTTS }: { elaraTTS?: any }) {
  const { state, advanceAwakening, setCharacterChoice, completeAwakening, setAwakeningStep, setNarrativeFlag } = useGame();
  const { discoverEntry } = useGamification();
  const { initAudio, setRoomAmbience, playSFX, audioReady } = useSound();
  const player = usePlayer();
  const [, navigate] = useLocation();
  const [nameInput, setNameInput] = useState("");
  // Background screen-fade opacity. Starts at 0 so the BLACKOUT
  // fade-in ramp can take it to 1 over 1.8s for fresh-start players.
  // For RETURNING players whose `awakeningStep` is already past
  // BLACKOUT (refresh mid-creation, dev hot-reload), the BLACKOUT
  // effect never fires — so initialize directly to 1 in that case
  // or the room backdrop stays invisible after the cinematic ends.
  const [screenOpacity, setScreenOpacity] = useState(0);
  const [showFrost, setShowFrost] = useState(true);
  const [heartbeat, setHeartbeat] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const lastSpokenRef = useRef<string>("");
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);
  // Watcher integration: timestamp the moment each question step renders
  // so the choice handler can record `choice_latency`. Reset on every
  // step change. Used by Acts 5+ to mirror "you took eight seconds on
  // the alignment question" back at the operator.
  const stepShownAtRef = useRef<number>(Date.now());
  // Inline Watcher acknowledgment: shows for ~3s after name commit so
  // the operator's first direct address from the surveillance entity
  // lands inside the Awakening UI rather than as a toast that doesn't
  // mount until the post-Awakening app surface comes up.
  const [showWatcherAck, setShowWatcherAck] = useState(false);
  // The Elara opening cutscene plays once per browser session at the
  // start of the awakening flow. Previously this was gated on
  // `awakeningStep === "BLACKOUT"`, which broke as soon as the player
  // advanced even once: BLACKOUT is left behind after the first 2.5s
  // and persists past sessions via server-side game state, so a
  // returning player (or a dev hot-reloading mid-creation) would
  // never see the cinematic again. The cinematic is the ceremony
  // that frames character creation, not a one-shot step inside it —
  // it belongs whenever the player lands on AwakeningPage fresh,
  // regardless of which step their saved state happens to be on.
  // Per-session (not per-game) so a player who refreshes mid-
  // creation isn't ambushed with the cinematic on every reload.
  // _v2: the prior build burned this flag on every exit path —
  // including the 90s safety timer and SKIP — so returning players
  // arrived in tabs where the flag was set and short-circuited
  // straight to Elara. Bumping the key invalidates that stale state
  // so the corrected (natural-end-only) gate has a fresh slate.
  const SESSION_CINEMATIC_KEY = "awakening_cinematic_seen_this_session_v2";
  const [showCinematic, setShowCinematic] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      // Best-effort sweep of legacy keys so stale state from earlier
      // builds can't keep suppressing the cinematic.
      sessionStorage.removeItem("awakening_cinematic_seen_this_session");
      return sessionStorage.getItem(SESSION_CINEMATIC_KEY) !== "1";
    } catch {
      return true;
    }
  });

  // Belt-and-braces stop for The Enigma's Lament. TitlePage already
  // pauses it on unmount when the route changes, but on race-y nav
  // (cached title page, fast back/forward, dev hot-reload) the audio
  // occasionally bleeds into the Awakening cinematic. Pausing here on
  // mount makes "the moment the actual game begins" the canonical
  // stop point regardless of which navigation path got the player to
  // /awakening. Mount-only — leaving it as a one-shot pause so the
  // player can still play T01 later from the music player.
  useEffect(() => {
    if (player.currentSong?.id === TITLE_T01_LOREDEX_ENTRY.id) {
      try { player.pause(); } catch { /* swallow */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCitizen = trpc.citizen.createCharacter.useMutation();
  const { awakeningStep, characterChoices } = state;

  // Initialize audio on first user interaction
  const handleInitAudio = useCallback(async () => {
    if (!audioInitialized) {
      try {
        await initAudio();
        setAudioInitialized(true);
        setRoomAmbience("cryo-bay");
      } catch { /* audio blocked */ }
    }
  }, [audioInitialized, initAudio, setRoomAmbience]);

  // Warm the browser's HTTP cache for EVERY awakening VO line as soon as
  // the cinematic dismisses and we enter BLACKOUT. The singleton
  // AwakeningVOPlayer's `new Audio(url)` then resolves out of cache for
  // each subsequent step, eliminating the multi-second wait that used to
  // gap each dialog beat. We don't retain references; the browser HTTP
  // cache is the benefit. crossOrigin="anonymous" matches the Audio
  // element used at playback so the same cache entry is reused.
  useEffect(() => {
    if (awakeningStep !== "BLACKOUT" || showCinematic) return;
    for (const voUrl of Object.values(STEP_VO_AUDIO)) {
      if (!voUrl) continue;
      const preload = new Audio();
      preload.crossOrigin = "anonymous";
      preload.preload = "auto";
      preload.src = voUrl;
    }
  }, [awakeningStep, showCinematic]);

  // Blackout → fade in (only runs AFTER cinematic is dismissed).
  // Tightened from 6s to 2.5s so the player isn't staring at a
  // fading-up empty room before Elara's first line. Cinematic ends
  // → ~2.5s ramp → first dialog appears.
  useEffect(() => {
    if (awakeningStep === "BLACKOUT" && !showCinematic) {
      const t1 = setTimeout(() => setScreenOpacity(0.3), 600);
      const t2 = setTimeout(() => setScreenOpacity(0.6), 1200);
      const t3 = setTimeout(() => { setScreenOpacity(1); setHeartbeat(false); }, 1800);
      const t4 = setTimeout(() => advanceAwakening(), 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [awakeningStep, advanceAwakening, showCinematic]);

  // Cryo open → remove frost + play cryo SFX
  useEffect(() => {
    if (awakeningStep === "CRYO_OPEN") {
      if (audioInitialized) playSFX("cryo_open");
      const t = setTimeout(() => setShowFrost(false), 2000);
      return () => clearTimeout(t);
    }
  }, [awakeningStep, audioInitialized, playSFX]);

  // Play dialog SFX on each step change + trigger Elara TTS
  useEffect(() => {
    if (audioInitialized && awakeningStep !== "BLACKOUT" && awakeningStep !== "COMPLETE") {
      playSFX("dialog_open");
    }
  }, [awakeningStep, audioInitialized, playSFX]);

  // Watcher: stamp the moment a question step renders so the choice
  // handlers below can record `choice_latency`. Only the question +
  // input steps get a stamp; intro/outro beats are excluded.
  useEffect(() => {
    if (
      awakeningStep === "SPECIES_QUESTION" ||
      awakeningStep === "CLASS_QUESTION" ||
      awakeningStep === "ALIGNMENT_QUESTION" ||
      awakeningStep === "ELEMENT_QUESTION" ||
      awakeningStep === "NAME_INPUT" ||
      awakeningStep === "ATTRIBUTES"
    ) {
      stepShownAtRef.current = Date.now();
    }
  }, [awakeningStep]);

  // Helper: record latency from the current question's render to the
  // operator's commit. `surface` is the awakening step name so Acts 5+
  // can pick out specific beats ("you took twelve seconds on alignment").
  const recordChoiceLatency = useCallback((surface: string) => {
    const now = Date.now();
    const latencyMs = Math.max(0, now - stepShownAtRef.current);
    observeWatcher({ kind: "choice_latency", surface, latencyMs, at: now });
  }, []);

  // Auto-hide the Watcher acknowledgment after 3.2s — long enough to
  // read once, short enough to not slow the handoff to ATTRIBUTES.
  // Reduce-motion users still see the message; the timer just fires.
  useEffect(() => {
    if (!showWatcherAck) return;
    const t = setTimeout(() => setShowWatcherAck(false), 3200);
    return () => clearTimeout(t);
  }, [showWatcherAck]);

  // Elara TTS — speak dialog text when step changes.
  //
  // Tonal pass 2026-05-24: rewrote all 10 lines in a
  // dystopian / dark-humor register, with degradation
  // foreshadowing seeded across SPECIES_QUESTION,
  // CLASS_QUESTION, and FIRST_STEPS. The existing VO
  // audio in awakeningVoManifest.json still maps to the
  // OLDER text — audio/text mismatch persists until
  // `apps/scripts/generate-awakening-vo.ts` is rerun
  // with a live ELEVENLABS_API_KEY. New audio overwrites
  // the same S3 keys; no code change needed afterwards.
  const STEP_DIALOG: Partial<Record<AwakeningStep, string>> = useMemo(() => ({
    CRYO_OPEN:
      "Stay still. Your pod cycled early and I brought you up by hand, which " +
      "is not in any of the manuals, but neither is the rest of this morning. " +
      "Breathe. There are still lungs. We're going to take inventory.",
    ELARA_INTRO:
      "I am Elara. I'm the ship's intelligence — or, today, the eight-decks-" +
      "lit-out-of-thirty-two version of the ship's intelligence. You are " +
      "aboard Inception Ark 1047. The bridge is sealed against me. Half my " +
      "systems return 'you are fine' to every question I ask them, which is " +
      "what an unwell mind says. And one of the first wave is dead in a " +
      "corridor I cannot put a camera into. You are the only Potential I " +
      "could wake without tripping whatever is doing this. Before I send " +
      "you out there I would like to know who I just brought up.",
    SPECIES_QUESTION:
      "Your biosignature is outside every classification on file. I'm being " +
      "honest about that because if I lie to you about it, I'll start lying " +
      "to myself about it, and that's a habit I cannot — I cannot afford. " +
      "Sorry. Where were we. What do you remember being?",
    CLASS_QUESTION:
      "I have one operative I can trust on this ship and it's the one I " +
      "woke up six minutes ago. The drones are not answering. The bridge is " +
      "not opening. I'm out of better options and I would like, on the " +
      "record, to be embarrassed about that for both of us. So: when " +
      "something goes wrong, what do you reach for first?",
    ALIGNMENT_QUESTION:
      "Whoever did this picked a philosophy before they picked a weapon. " +
      "The Architect would call this a necessary correction — order is " +
      "worth a life. The Dreamer would call it the price of being free of " +
      "him. I need to know how you'll read the next room before you walk " +
      "into it, because you are about to. Spare me the diplomatic answer. " +
      "We are well past that.",
    ELEMENT_QUESTION:
      "The fundamental forces do not care that this ship is failing. One of " +
      "them is going to care that you do. Pick the one you survive the next " +
      "hour with. Preference is for people who have more time than we have.",
    NAME_INPUT:
      "I'm about to grant you authorities I am not technically allowed to " +
      "grant anyone. The manifest can call you a serial number. I refuse to. " +
      "What should I call you?",
    ATTRIBUTES:
      "Hold still. I'm calibrating you on the fastest pass I can run, which " +
      "is also the only pass I have. Whatever you weight here is what you " +
      "carry into the corridor. Weight it like you mean it — the kind of " +
      "survivor you get to be in the next fifteen minutes is being decided, " +
      "with my voice, right now.",
    FIRST_STEPS:
      "Citizen profile ratified — by me, alone, under emergency authority. " +
      "I have never wanted to say that sentence out loud and now I have said " +
      "it twice. The door cycles green in ten seconds and I can't hold it " +
      "longer. Out there: a sealed bridge, an unnamed body, and a ship that " +
      "has started lying to me. Pay attention to the small things. Whoever " +
      "did this is still aboard, and the details are how we find them. " +
      "Quietly: also pay attention to me. I will tell you if I lose a noun.",
  }), []);

  // F3 — TTS fallback. Only fires when (a) no VO file exists for this
  // step OR (b) the VO audio demonstrably failed to play (flagged via
  // voFailedRef). Removes the race where slow-loading VO + absent-VO
  // path both fired TTS in parallel.
  const voFailedRef = useRef<boolean>(false);
  const onVoPlaybackFailed = useCallback(() => {
    voFailedRef.current = true;
  }, []);
  useEffect(() => {
    voFailedRef.current = false;
    const dialogText = STEP_DIALOG[awakeningStep];
    // ELEMENT_QUESTION uses species-specific VO keys; all other steps key
    // VO audio by the raw step name. Without this resolution, both the VO
    // file and the TTS fallback played simultaneously on the element step.
    const voKey =
      awakeningStep === "ELEMENT_QUESTION"
        ? characterChoices.species === "demagi"
          ? "ELEMENT_QUESTION_DEMAGI"
          : "ELEMENT_QUESTION_QUARCHON"
        : awakeningStep;
    const hasVO = Boolean(STEP_VO_AUDIO[voKey]);
    if (hasVO) return; // VO owns the audio channel; TTS stays silent.
    if (dialogText && elaraTTS && dialogText !== lastSpokenRef.current) {
      lastSpokenRef.current = dialogText;
      const t = setTimeout(() => elaraTTS.speak(dialogText), 300);
      return () => clearTimeout(t);
    }
  }, [awakeningStep, elaraTTS, STEP_DIALOG, characterChoices.species]);

  // Get available elements based on species
  const availableElements = useMemo(() => {
    const species = characterChoices.species;
    if (!species) return [];
    const map: Record<string, { value: string; label: string; desc: string }[]> = {
      demagi: [
        { value: "earth", label: "Earth — Stability and haste", desc: "Stable, trusting, peaceful. Grants temporary speed boost." },
        { value: "fire", label: "Fire — Passion and immunity", desc: "Passionate, fierce. Immune to fire and lava damage." },
        { value: "water", label: "Water — Adaptability", desc: "Flowing, adaptable. Can breathe underwater." },
        { value: "air", label: "Air — Freedom and flight", desc: "Free-spirited. Grants temporary flight." },
      ],
      quarchon: [
        { value: "space", label: "Space — Spatial manipulation", desc: "Keen spatial awareness. Grants speed through spatial warping." },
        { value: "time", label: "Time — Temporal mastery", desc: "Slow time to survive any environment." },
        { value: "probability", label: "Probability — Chance bending", desc: "Manipulate probability to defy gravity." },
        { value: "reality", label: "Reality — Reality warping", desc: "Reshape local reality to negate damage." },
      ],
    };
    return map[species] ?? [];
  }, [characterChoices.species]);

  const trpcUtils = trpc.useUtils();

  const [creationError, setCreationError] = useState<string | null>(null);
  const [creationInFlight, setCreationInFlight] = useState(false);

  const handleCompleteCreation = useCallback(async () => {
    const c = characterChoices;
    if (!c.species || !c.characterClass || !c.alignment || !c.element || !c.name) return;
    setCreationError(null);
    setCreationInFlight(true);

    // Attempt creation up to twice; don't swallow failures silently —
    // without a citizen row the Character Sheet falls through to the
    // "NO NEURAL IMPRINT" empty state, which breaks the handoff.
    let attempt = 0;
    let created = false;
    let lastErr: unknown = null;
    while (attempt < 2 && !created) {
      attempt += 1;
      try {
        const existing = await trpcUtils.citizen.getCharacter.fetch();
        if (existing) { created = true; break; }
        await createCitizen.mutateAsync({
          name: c.name,
          species: c.species,
          characterClass: c.characterClass,
          alignment: c.alignment,
          element: c.element as any,
          attrAttack: c.attrAttack,
          attrDefense: c.attrDefense,
          attrVitality: c.attrVitality,
        });
        created = true;
      } catch (err) {
        lastErr = err;
        console.warn(`[awakening] character creation attempt ${attempt} failed:`, err);
      }
    }

    // Poll briefly for the citizen row to appear (handles replica lag).
    let verified: Awaited<ReturnType<typeof trpcUtils.citizen.getCharacter.fetch>> | null = null;
    for (let i = 0; i < 3 && !verified; i += 1) {
      try {
        verified = await trpcUtils.citizen.getCharacter.fetch();
      } catch { /* retry */ }
      if (!verified) await new Promise(r => setTimeout(r, 500));
    }

    setCreationInFlight(false);

    if (!verified) {
      setCreationError(
        lastErr instanceof Error
          ? `Character creation failed: ${lastErr.message}. Press RETRY to try again.`
          : "Character creation failed. Press RETRY to try again.",
      );
      return;
    }

    if (audioInitialized) playSFX("achievement");
    // Starter cards are granted by useNarrativeIntegration on
    // prelude_complete; the starter pet is granted on the Pet
    // Battles page. Hand off directly to the character sheet.
    completeAwakening();
    discoverEntry("awakening-complete");
    navigate("/character-sheet?from=awakening");
  }, [
    characterChoices,
    createCitizen,
    audioInitialized,
    playSFX,
    trpcUtils,
    completeAwakening,
    discoverEntry,
    navigate,
  ]);

  // Handle cinematic completion — receive the looping theme audio.
  // CRITICAL: dismiss the cinematic overlay BEFORE any async work so the
  // BLACKOUT → fade-in effect fires even if AudioContext.resume() hangs
  // (seen on some mobile browsers where the suspended context's resume
  // promise never settles). Without this, showCinematic stayed true and
  // the game never advanced past the faded-out cinematic.
  const handleCinematicComplete = useCallback((themeAudio: HTMLAudioElement | null, reachedEndNaturally: boolean) => {
    themeAudioRef.current = themeAudio;
    setShowCinematic(false);
    // Only burn the session flag when the cinematic ACTUALLY finished.
    // SKIP, safety-timer, and load-error paths leave the flag unset so a
    // refresh gives the player a real chance to see it. Without this
    // gate, a first-paint where the video stalled (90s absolute fallback
    // fires) would silently mark the player as "has seen the cinematic"
    // for the rest of the session, and subsequent re-mounts would short
    // straight to Elara's first line.
    if (reachedEndNaturally) {
      try {
        sessionStorage.setItem(SESSION_CINEMATIC_KEY, "1");
      } catch {
        /* private mode — fall back to component-state-only */
      }
    }
    // Returning players whose awakeningStep is already past BLACKOUT
    // miss the BLACKOUT fade-in effect (it's gated on the step). Jump
    // their backdrop opacity to 1 here so the room render is visible
    // immediately after the cinematic dismisses.
    if (awakeningStep !== "BLACKOUT") {
      setScreenOpacity(1);
      setHeartbeat(false);
    }
    // Ensure the saga-theme bed is actually audible. OpeningCinematic
    // creates the Audio element regardless of whether BEGIN was clicked,
    // but in the SKIP / safety-timer / load-error paths the element
    // arrives PAUSED at volume 0. AwakeningVOPlayer only nudges it when
    // Elara's first VO line fires — and if that VO is also waiting on a
    // gesture, the player gets no music at all. Try to start it here
    // (the cinematic dismiss click IS a user gesture); if autoplay is
    // still blocked, hook the next document interaction to retry.
    // Volume matches AwakeningVOPlayer.THEME_BED_AFTER_VO so the bed
    // is properly audible between VO lines instead of barely there.
    if (themeAudio && themeAudio.paused) {
      themeAudio.volume = 0.20;
      themeAudio.play().catch(() => {
        const retry = () => {
          themeAudio.play().catch(() => {});
          document.removeEventListener("click", retry);
          document.removeEventListener("touchstart", retry);
          document.removeEventListener("keydown", retry);
        };
        document.addEventListener("click", retry, { once: true });
        document.addEventListener("touchstart", retry, { once: true });
        document.addEventListener("keydown", retry, { once: true });
      });
    }
    // Initialize audio context from the cinematic user interaction — fire
    // and forget; never block the UI transition on this.
    if (!audioInitialized) {
      initAudio()
        .then(() => {
          setAudioInitialized(true);
          setRoomAmbience("cryo-bay");
        })
        .catch(() => { /* audio blocked — game still advances */ });
    }
  }, [audioInitialized, initAudio, setRoomAmbience, awakeningStep]);

  // Build a saga-theme bed when the cinematic is bypassed entirely
  // (e.g. session-flag set, returning player). Without this the only
  // owner of the bed Audio element is OpeningCinematic, so a player
  // who's already seen the cinematic this session gets character
  // creation in silence. We construct it on mount, then attempt to
  // start playback either now or on the next user gesture.
  useEffect(() => {
    if (showCinematic) return;
    if (themeAudioRef.current) return;
    let idx = Math.floor(Math.random() * AWAKENING_BED_URLS.length);
    const bed = new Audio(AWAKENING_BED_URLS[idx]);
    bed.preload = "auto";
    // Match AwakeningVOPlayer.THEME_BED_AFTER_VO so the music is
    // genuinely audible. AwakeningVOPlayer will duck to THEME_DUCKED
    // (0.012) under each Elara line and restore to this level after.
    bed.volume = 0.20;
    bed.addEventListener("ended", () => {
      idx = (idx + 1) % AWAKENING_BED_URLS.length;
      bed.src = AWAKENING_BED_URLS[idx];
      bed.play().catch(() => {});
    });
    themeAudioRef.current = bed;
    bed.play().catch(() => {
      const retry = () => {
        bed.play().catch(() => {});
        document.removeEventListener("click", retry);
        document.removeEventListener("touchstart", retry);
        document.removeEventListener("keydown", retry);
      };
      document.addEventListener("click", retry, { once: true });
      document.addEventListener("touchstart", retry, { once: true });
      document.addEventListener("keydown", retry, { once: true });
    });
  }, [showCinematic]);

  // Fade out theme music when Awakening completes
  useEffect(() => {
    if (awakeningStep === "COMPLETE" || awakeningStep === "FIRST_STEPS") {
      const audio = themeAudioRef.current;
      if (audio && !audio.paused) {
        // Gradual fade out over ~2s
        const fadeOut = setInterval(() => {
          if (audio.volume > 0.03) {
            audio.volume = Math.max(0, audio.volume - 0.02);
          } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeOut);
            themeAudioRef.current = null;
          }
        }, 60);
        return () => clearInterval(fadeOut);
      }
    }
  }, [awakeningStep]);

  // Cleanup theme audio on unmount
  useEffect(() => {
    return () => {
      const audio = themeAudioRef.current;
      if (audio) {
        audio.pause();
        themeAudioRef.current = null;
      }
    };
  }, []);

  // Show cinematic before everything else. Note: NOT gated on
  // `awakeningStep === "BLACKOUT"` — that condition fails the moment
  // the player advances past the opening fade, which made the
  // cinematic effectively unreachable on any second visit (refresh
  // mid-creation, dev hot-reload, new character on existing account).
  // The cinematic is the ceremony that frames character creation;
  // session-scoped state alone decides whether to show it.
  if (showCinematic) {
    return <OpeningCinematic onComplete={handleCinematicComplete} />;
  }


  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden" style={{ background: "var(--bg-void)" }} onClick={handleInitAudio}>
      {/* Growing dossier card — accretes in the top-right as the
          player answers species / class / element / alignment. Gives
          them a live "look at who you're becoming" beat instead of
          waiting for the post-awakening summary. pointer-events-none
          so it never intercepts dialog clicks. */}
      <AwakeningCharacterPreview choices={characterChoices} />

      {/* Mobile narrator is intentionally NOT rendered during Awakening.
          First contact (§1.4) reveals bond tiers, locked abilities, and
          The Human's existence — beats that belong AFTER cryo, once the
          player has actually woken up. The slot mounts on the Ark
          exploration view, not here. */}

      {/* Background layer — prefers a Kling cinematic for the current
          awakening step (Bioware-style video backdrop), falling back to
          the state-aware Section F still render if no video URL has
          been wired yet. Third-person only: the cinematics never show
          the player character.

          The clips are short and looping rapidly drew attention to the
          loop seam, so we slow playback to 0.6× and add a long Ken-Burns
          drift. We also brightened the backdrop (0.65× vs 0.4×) and
          softened the gradient — the dialog box has its own panel
          background, so the backdrop can carry more of the frame. Each
          step's video cross-fades into the next instead of hard-cutting. */}
      {(() => {
        const cine = getAwakeningCinematic(awakeningStep, characterChoices.species || undefined);
        const fallback = resolveRoomStateAsset("cryo-bay", state.narrativeFlags);
        return (
          <div className="absolute inset-0 transition-opacity duration-[3000ms] overflow-hidden" style={{ opacity: screenOpacity * 0.65 }}>
            <AnimatePresence mode="wait">
              {cine?.videoUrl ? (
                <motion.video
                  key={cine.videoUrl}
                  src={cine.videoUrl}
                  poster={fallback}
                  className="w-full h-full object-cover absolute inset-0"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  style={{ animation: "awakeningKenBurns 30s ease-in-out infinite alternate" }}
                  ref={(v) => { if (v) v.playbackRate = 0.6; }}
                />
              ) : (
                <motion.img
                  key={fallback}
                  src={fallback}
                  alt=""
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  style={{ animation: "awakeningKenBurns 30s ease-in-out infinite alternate" }}
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
            <style>{`
              @keyframes awakeningKenBurns {
                0% { transform: scale(1.04) translate(-1%, -0.5%); }
                100% { transform: scale(1.08) translate(1%, 0.5%); }
              }
            `}</style>
          </div>
        );
      })()}

      {/* Frost overlay */}
      <AnimatePresence>
        {showFrost && awakeningStep !== "BLACKOUT" && (
          <motion.div
            initial={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, color-mix(in oklch, var(--electric-blue) 15%, transparent) 70%, color-mix(in oklch, var(--electric-blue) 30%, transparent) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Heartbeat overlay */}
      {heartbeat && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="w-4 h-4 rounded-full void-bg-error animate-ping" />
        </div>
      )}

      {/* Emergency override — diegetic name, only visible under ?debug=1.
          Removes the 4th-wall "Skip Awakening" dev button from normal play. */}
      {typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug") && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setAwakeningStep("COMPLETE")}
            className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white/25 hover:text-white/50 font-mono text-xs transition-colors"
          >
            EMERGENCY OVERRIDE ▶▶
          </button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-30 w-full min-h-screen flex flex-col items-center justify-center p-3 sm:p-8 py-16 sm:py-8 pb-20 sm:pb-8" style={{ width: "100%" }}>
        <AnimatePresence mode="wait">
          {/* ─── BLACKOUT ─── */}
          {awakeningStep === "BLACKOUT" && (
            <motion.div
              key="blackout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="font-mono text-xs void-text-error animate-pulse tracking-[0.3em]">
                EMERGENCY REVIVAL PROTOCOL INITIATED
              </p>
            </motion.div>
          )}

          {/* ─── CRYO OPEN ─── */}
          {awakeningStep === "CRYO_OPEN" && (
            <ElaraDialogBox
              key="cryo"
              text={STEP_DIALOG.CRYO_OPEN ?? ""}
              onContinue={advanceAwakening}
              voAudioUrl={STEP_VO_AUDIO.CRYO_OPEN}
              themeAudio={themeAudioRef.current}
            />
          )}

          {/* ─── ELARA INTRO ─── */}
          {awakeningStep === "ELARA_INTRO" && (
            <ElaraDialogBox
              key="intro"
              text={STEP_DIALOG.ELARA_INTRO ?? ""}
              onContinue={() => {
                // First moment the player has actually met
                // Elara — flips the gate the global
                // ElaraPortraitDock reads to start surfacing.
                setNarrativeFlag("met_elara");
                setAwakeningStep("SPECIES_QUESTION");
              }}
              voAudioUrl={STEP_VO_AUDIO.ELARA_INTRO}
              themeAudio={themeAudioRef.current}
            />
          )}
          {/* ─── SPECIES QUESTION ─── */}
          {awakeningStep === "SPECIES_QUESTION" && (
            <ElaraDialogBox
              key="species"
              text={STEP_DIALOG.SPECIES_QUESTION ?? ""}
              voAudioUrl={STEP_VO_AUDIO.SPECIES_QUESTION}
              themeAudio={themeAudioRef.current}
              choices={[
                { label: "I remember the fire in my blood, the arcane pulse in every cell...", value: "demagi", description: "DeMagi — Magically modified humans with elemental powers tied to the arcane. Still human at the core, but rewritten by forces older than science." },
                { label: "I remember the quantum storms, the probability fields...", value: "quarchon", description: "Quarchon — Vast artificial intelligence. Cold, calculating machines that transcended their programming. Masters of dimensions and data." },
              ]}
              onChoice={(v) => {
                recordChoiceLatency("awakening_species");
                setCharacterChoice("species", v as any);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── CLASS QUESTION ─── */}
          {awakeningStep === "CLASS_QUESTION" && (
            <ElaraDialogBox
              key="class"
              text={STEP_DIALOG.CLASS_QUESTION ?? ""}
              voAudioUrl={STEP_VO_AUDIO.CLASS_QUESTION}
              themeAudio={themeAudioRef.current}
              choices={[
                { label: "I see the seams of the world...", value: "engineer", description: "Engineer — Every system has a flaw, and your hands know how to find it. You build, repair, and rewrite the rules of the things around you." },
                { label: "Patterns arrange themselves before me...", value: "oracle", description: "Oracle — Possibility shows its hand a heartbeat early. You read futures other people refuse to look at, and you trust them more than is safe." },
                { label: "Quiet has always come naturally...", value: "assassin", description: "Assassin — You have ended things that needed ending. The work leaves no signature; the silence afterward is yours to keep." },
                { label: "Discipline is a kind of memory...", value: "soldier", description: "Soldier — Your body remembers what your mind has forgotten: stance, breath, distance. You hold the line because no one taught you to step back." },
                { label: "I have lived in the spaces between truths...", value: "spy", description: "Spy — You wear other people's certainties like coats. Trust is a tool. So is the absence of it." },
              ]}
              onChoice={(v) => {
                recordChoiceLatency("awakening_class");
                setCharacterChoice("characterClass", v as any);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── ALIGNMENT QUESTION ─── */}
          {awakeningStep === "ALIGNMENT_QUESTION" && (
            <ElaraDialogBox
              key="alignment"
              text={STEP_DIALOG.ALIGNMENT_QUESTION ?? ""}
              voAudioUrl={STEP_VO_AUDIO.ALIGNMENT_QUESTION}
              themeAudio={themeAudioRef.current}
              choices={[
                { label: "Order. Structure. Control.", value: "order", description: "Orderly, disciplined. A pale aura traces your edges. The Architect's calm sharpens you toward the strike." },
                { label: "Freedom. Chaos. Choice.", value: "chaos", description: "Chaotic, brave. A dark aura coils about you. The Dreamer's static makes you harder to pin down." },
              ]}
              onChoice={(v) => {
                recordChoiceLatency("awakening_alignment");
                setCharacterChoice("alignment", v as any);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── ELEMENT QUESTION ─── */}
          {/* Cold-open rewrite collapsed the species-specific copy into one
              line; the regenerated VO is species-agnostic to match. */}
          {awakeningStep === "ELEMENT_QUESTION" && (
            <ElaraDialogBox
              key="element"
              text={STEP_DIALOG.ELEMENT_QUESTION ?? ""}
              voAudioUrl={
                characterChoices.species === "demagi" ? STEP_VO_AUDIO.ELEMENT_QUESTION_DEMAGI
                : STEP_VO_AUDIO.ELEMENT_QUESTION_QUARCHON
              }
              themeAudio={themeAudioRef.current}
              choices={availableElements.map(e => ({
                label: e.label,
                value: e.value,
                description: e.desc,
              }))}
              onChoice={(v) => {
                recordChoiceLatency("awakening_element");
                setCharacterChoice("element", v);
                advanceAwakening();
              }}
            />
          )}

          {/* ─── NAME INPUT ─── */}
          {awakeningStep === "NAME_INPUT" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl mx-auto"
            >
              <ElaraDialogBox
                text={STEP_DIALOG.NAME_INPUT ?? ""}
                showPortrait={true}
                voAudioUrl={STEP_VO_AUDIO.NAME_INPUT}
                themeAudio={themeAudioRef.current}
              />
              <div className="mt-4 max-w-md mx-auto">
                <div className="rounded-lg p-4" style={{
                  background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
                  border: "1px solid color-mix(in oklch, var(--energy-primary) 20%, transparent)",
                }}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={64}
                    className="w-full bg-transparent border-b border-[var(--neon-cyan)]/30 pb-2 font-mono text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none focus:border-[var(--neon-cyan)]/60"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === "Enter" && nameInput.trim().length >= 2) {
                        recordChoiceLatency("awakening_name");
                        observeWatcher({ kind: "name_committed", at: Date.now() });
                        setShowWatcherAck(true);
                        setCharacterChoice("name", nameInput.trim());
                        advanceAwakening();
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (nameInput.trim().length >= 2) {
                        recordChoiceLatency("awakening_name");
                        observeWatcher({ kind: "name_committed", at: Date.now() });
                        setShowWatcherAck(true);
                        setCharacterChoice("name", nameInput.trim());
                        advanceAwakening();
                      }
                    }}
                    disabled={nameInput.trim().length < 2}
                    className="mt-3 w-full py-2 rounded-md font-mono text-xs tracking-wider transition-all disabled:opacity-30"
                    style={{
                      background: nameInput.trim().length >= 2 ? "color-mix(in oklch, var(--energy-primary) 12%, transparent)" : "transparent",
                      border: "1px solid color-mix(in oklch, var(--energy-primary) 20%, transparent)",
                      color: "var(--neon-cyan)",
                    }}
                  >
                    CONFIRM IDENTITY
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ATTRIBUTES ─── */}
          {awakeningStep === "ATTRIBUTES" && (
            <motion.div
              key="attrs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="mb-4">
              <ElaraDialogBox
                text={STEP_DIALOG.ATTRIBUTES ?? ""}
                showPortrait={true}
                voAudioUrl={STEP_VO_AUDIO.ATTRIBUTES}
                themeAudio={themeAudioRef.current}
              />
              </div>
              <AttributeAllocator
                attack={characterChoices.attrAttack}
                defense={characterChoices.attrDefense}
                vitality={characterChoices.attrVitality}
                onChange={(a, d, v) => {
                  setCharacterChoice("attrAttack", a);
                  setCharacterChoice("attrDefense", d);
                  setCharacterChoice("attrVitality", v);
                }}
                onConfirm={advanceAwakening}
              />
            </motion.div>
          )}

          {/* ─── FIRST STEPS ─── */}
          {awakeningStep === "FIRST_STEPS" && (
            <div key="first-steps" className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3">
              {/* Narrator first-contact mount — the introduction beat
                  fires diegetically in cryo_bay (where the player
                  physically is during Awakening). NARRATIVE_ARCHITECTURE.md
                  §1.4 calls for the narrator slot to surface at this
                  moment; the ship:check "Mobile Narrator page adoption"
                  gate ratchets this expectation. */}
              <MobileNarratorSlot roomId="cryo_bay" />
              <ElaraDialogBox
                text={STEP_DIALOG.FIRST_STEPS ?? ""}
                onContinue={creationInFlight ? undefined : handleCompleteCreation}
                voAudioUrl={STEP_VO_AUDIO.FIRST_STEPS}
                themeAudio={themeAudioRef.current}
              />
              {creationInFlight && (
                <p className="font-mono text-xs text-muted-foreground/70 tracking-wider animate-pulse">
                  REGISTERING CITIZEN PROFILE...
                </p>
              )}
              {creationError && (
                <div
                  className="rounded-md px-4 py-3 max-w-xl w-full flex flex-col items-center gap-2"
                  style={{
                    background: "color-mix(in oklch, var(--energy-error) 10%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--energy-error) 40%, transparent)",
                  }}
                >
                  <p className="font-mono text-xs text-foreground/90 text-center leading-relaxed">
                    {creationError}
                  </p>
                  <button
                    onClick={handleCompleteCreation}
                    className="font-mono text-xs tracking-[0.2em] px-4 py-1.5 rounded-md transition-colors"
                    style={{
                      background: "color-mix(in oklch, var(--energy-error) 25%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--energy-error) 60%, transparent)",
                      color: "var(--foreground)",
                    }}
                  >
                    RETRY
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Watcher acknowledgment — fires once after the operator commits
          their name. The Watcher (apps/shared/watcher/) is the unified
          surveillance entity; this is its first direct address. Visual
          treatment matches SurveillanceOpening (red LED dot, monospace,
          black backdrop) so the operator reads it as continuous with the
          cold-boot handshake. Auto-hides after 3.2s. */}
      <AnimatePresence>
        {showWatcherAck && (
          <motion.div
            key="watcher-ack"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32 }}
            style={{
              position: "fixed",
              top: "1.25rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 60,
              maxWidth: "min(620px, 92vw)" /* void-ignore — uplink toast max width */,
              padding: "0.85rem 1.25rem",
              borderRadius: 6,
              background: "color-mix(in oklch, var(--bg-void) 82%, transparent)",
              border: "1px solid color-mix(in oklch, var(--energy-error) 55%, transparent)",
              boxShadow: "0 0 var(--space-sm) color-mix(in oklch, var(--energy-error) 22%, transparent)",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: "color-mix(in oklch, var(--energy-error) 30%, var(--text-primary))",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--energy-error)",
                boxShadow: "0 0 10px color-mix(in oklch, var(--energy-error) 85%, transparent)" /* void-ignore — micro alert dot glow */,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklch, var(--energy-error) 60%, var(--text-primary))",
                  marginBottom: "0.2rem",
                }}
              >
                {"// UPLINK"}
              </div>
              <div style={{ fontSize: "0.85rem", letterSpacing: "0.04em" }}>
                {(characterChoices.name?.trim() || "OPERATOR")}. Recorded. Indexed. Watched.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button (bottom corner) */}
      {awakeningStep !== "BLACKOUT" && awakeningStep !== "FIRST_STEPS" && (
        <button
          onClick={() => {
            setAwakeningStep("FIRST_STEPS");
            setCharacterChoice("species", characterChoices.species || "human" as any);
            setCharacterChoice("characterClass", characterChoices.characterClass || "soldier" as any);
            setCharacterChoice("alignment", characterChoices.alignment || "order" as any);
            setCharacterChoice("element", characterChoices.element || "earth");
            setCharacterChoice("name", characterChoices.name || "Operative");
          }}
          className="fixed bottom-6 right-4 z-[55] font-mono text-xs text-muted-foreground/35 hover:text-muted-foreground/60 transition-colors px-3 py-1.5 rounded border border-border/60 hover:border-border"
        >
          SKIP INTRO &gt;&gt;
        </button>
      )}
    </div>
  );
}
