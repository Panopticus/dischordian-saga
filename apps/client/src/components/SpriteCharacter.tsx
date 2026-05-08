/* ═══════════════════════════════════════════════════════
   SPRITE CHARACTER — sprite-sheet driven talking head.

   Walks one of the character's sheets (viseme / blink /
   breathing) on each frame and shows the matching cell.

   Lip sync uses wawa-lipsync to detect the dominant viseme
   from the live HTMLAudioElement and pick the matching cell
   from the viseme grid. When idle, the breathing loop plays
   at low fps and a blink interrupts it every 3-7s.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Lipsync } from "wawa-lipsync";
import {
  getCharacterSprite,
  type CharacterSprite,
  type SpriteSheet,
  type WawaViseme,
} from "@/game/characterSprites";

interface SpriteCharacterProps {
  npcId: string;
  /** Live audio currently playing for this character; drives lip sync. */
  audio?: HTMLAudioElement | null;
  /** Whether the character is actively speaking (drives sheet selection). */
  isSpeaking?: boolean;
  /** Per-line opt-in: when true and the character has a `visemeHyper`
   *  sheet registered, draw phoneme cells from that sheet instead of the
   *  standard viseme. Used for Shadow Tongue's revelatory beats where the
   *  jaw hyperextends and a second row of teeth becomes visible on open
   *  vowels. Silently falls back to the standard sheet if the character
   *  has no hyper variant. */
  useHyperVisemes?: boolean;
  className?: string;
}

const BLINK_INTERVAL_MIN = 3000;
const BLINK_INTERVAL_MAX = 7000;
const BLINK_DURATION_MS = 140;
const BREATHING_FPS = 10;

/** When a character is "speaking" but we have no connected audio to analyse
 *  (e.g. browser TTS, autoplay blocked, cross-origin CORS), cycle through a
 *  short loop of plausible visemes so the mouth still moves. */
const FAKE_VISEME_FPS = 7;
const FAKE_VISEME_SEQUENCE: WawaViseme[] = [
  "viseme_aa", "viseme_PP", "viseme_E", "viseme_O",
  "viseme_sil", "viseme_I", "viseme_U", "viseme_FF",
];

const prefersReducedMotion =
  typeof matchMedia !== "undefined"
    ? matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

/** When `?debug-mouthbox=1` is in the URL, render a thin outline of the
 *  active sprite's mouthBox so we can visually align viseme overlays
 *  against the rendered bust without binary-search-by-eye. */
const debugMouthBox =
  typeof window !== "undefined" &&
  /[?&]debug-mouthbox=1\b/.test(window.location.search);

/** Compute background-* CSS for showing one cell of a sheet inside the
 *  container. The container's aspect ratio MUST match the cell aspect
 *  for the cell to fill it without stretching. */
function cellStyle(sheet: SpriteSheet, index: number): CSSProperties {
  const col = index % sheet.cols;
  const row = Math.floor(index / sheet.cols);
  return {
    backgroundImage: `url(${sheet.url})`,
    backgroundSize: `${sheet.cols * 100}% ${sheet.rows * 100}%`,
    backgroundPosition: sheet.cols === 1 && sheet.rows === 1
      ? "center"
      : `${(col / Math.max(1, sheet.cols - 1)) * 100}% ${(row / Math.max(1, sheet.rows - 1)) * 100}%`,
    backgroundRepeat: "no-repeat",
  };
}

export function SpriteCharacter({
  npcId,
  audio,
  isSpeaking = false,
  useHyperVisemes = false,
  className = "",
}: SpriteCharacterProps) {
  const sprite = getCharacterSprite(npcId);
  // Resolve which viseme sheet to draw from this frame. Hyper sheets are
  // opt-in per line; falls back to the standard sheet when unset or when
  // the character has no hyper variant.
  const activeViseme =
    useHyperVisemes && sprite?.visemeHyper ? sprite.visemeHyper : sprite?.viseme;
  const containerRef = useRef<HTMLDivElement>(null);
  const lipsyncRef = useRef<Lipsync | null>(null);
  const lastConnectedRef = useRef<HTMLAudioElement | null>(null);

  // Animation state — kept in refs to avoid re-rendering 60x/sec.
  const stateRef = useRef<{
    blinking: boolean;
    breathFrame: number;
    visemeCell: number;
  }>({ blinking: false, breathFrame: 0, visemeCell: 0 });

  // Force a re-render when the visible cell changes. Throttled — not every frame.
  const [, setTick] = useState(0);

  /* ─── Lip sync: connect / reconnect when the audio element changes ─── */
  useEffect(() => {
    if (!sprite?.viseme || !audio) return;

    let lipsync = lipsyncRef.current;
    if (!lipsync) {
      lipsync = new Lipsync({ fftSize: 1024, historySize: 8 });
      lipsyncRef.current = lipsync;
    }

    if (lastConnectedRef.current !== audio) {
      try {
        lipsync.connectAudio(audio);
        lastConnectedRef.current = audio;
      } catch {
        // connectAudio fails if the audio source is cross-origin without
        // CORS, or if it's already been connected to another AudioContext.
        // Either way, lipsync silently degrades to "mouth stays at REST".
      }
    }
  }, [audio, sprite?.viseme]);

  /* ─── Animation loop ─── */
  useEffect(() => {
    if (!sprite) return;

    let raf = 0;
    let lastBreath = performance.now();
    let lastFake = performance.now();
    let fakeIdx = 0;

    const tick = (now: number) => {
      const s = stateRef.current;
      let dirty = false;

      if (isSpeaking && activeViseme) {
        // Always advance the fake viseme cycle as a baseline so the mouth
        // visibly moves the entire time the character is speaking — lip
        // sync via wawa-lipsync is best-effort (CORS, AudioContext state,
        // iOS Safari quirks) and silently degrades to viseme_sil when it
        // can't read samples, which would otherwise leave the mouth
        // frozen at REST.
        if (now - lastFake > 1000 / FAKE_VISEME_FPS) {
          lastFake = now;
          fakeIdx = (fakeIdx + 1) % FAKE_VISEME_SEQUENCE.length;
          const cell = activeViseme.map[FAKE_VISEME_SEQUENCE[fakeIdx]] ?? 0;
          if (cell !== s.visemeCell) {
            s.visemeCell = cell;
            dirty = true;
          }
        }
        // Lip sync override: when wawa-lipsync is wired up and reports a
        // real phoneme (anything other than silence), prefer that cell.
        const haveLiveAnalysis =
          audio && lipsyncRef.current && lastConnectedRef.current === audio;
        if (haveLiveAnalysis) {
          try {
            lipsyncRef.current!.processAudio();
            const v = lipsyncRef.current!.viseme as WawaViseme;
            if (v && v !== "viseme_sil") {
              const cell = activeViseme.map[v] ?? 0;
              if (cell !== s.visemeCell) {
                s.visemeCell = cell;
                dirty = true;
              }
            }
          } catch {
            // ignore — fake cycle already moved the mouth this frame
          }
        }
      } else if (!isSpeaking && sprite.breathing && !prefersReducedMotion) {
        // Idle breathing cycle.
        const dt = now - lastBreath;
        if (dt > 1000 / BREATHING_FPS) {
          lastBreath = now;
          s.breathFrame = (s.breathFrame + 1) % (sprite.breathing.frames ?? sprite.breathing.cols * sprite.breathing.rows);
          dirty = true;
        }
      } else if (s.visemeCell !== 0) {
        // Settle mouth to REST when we stop speaking.
        s.visemeCell = 0;
        dirty = true;
      }

      if (dirty) setTick((t) => (t + 1) % 1024);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sprite, audio, isSpeaking]);

  /* ─── Idle blink scheduler (independent of animation loop) ─── */
  useEffect(() => {
    if (!sprite?.blink || prefersReducedMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = BLINK_INTERVAL_MIN + Math.random() * (BLINK_INTERVAL_MAX - BLINK_INTERVAL_MIN);
      timer = setTimeout(() => {
        stateRef.current.blinking = true;
        setTick((t) => (t + 1) % 1024);
        setTimeout(() => {
          stateRef.current.blinking = false;
          setTick((t) => (t + 1) % 1024);
          schedule();
        }, BLINK_DURATION_MS);
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [sprite?.blink]);

  if (!sprite) return null;

  const s = stateRef.current;

  // Overlay mode: the viseme sheet is a mouth-only close-up that sits on
  // top of the bust. Render the bust as the base and composite the mouth
  // cell at `mouthBox` when speaking. The bust stays visible so the eyes,
  // hair and shoulders aren't cropped away.
  if (sprite.visemeOverlay && activeViseme && sprite.mouthBox) {
    const box = sprite.mouthBox;
    const bustStyle: CSSProperties = {
      backgroundImage: `url(${sprite.bust})`,
      backgroundSize: sprite.bustSize ?? "cover",
      backgroundPosition: sprite.bustPosition ?? "center top",
      backgroundRepeat: "no-repeat",
    };
    // Soft elliptical mask feathers the cell edges into the surrounding bust
    // so the rectangular cell boundary doesn't read as a hard cutout. Inner
    // ~35% stays fully opaque (mouth region); fades to transparent by ~85%.
    const featherMask = "radial-gradient(ellipse at center, black 35%, transparent 85%)";
    const mouthStyle: CSSProperties = {
      position: "absolute",
      left: `${box.x * 100}%`,
      top: `${box.y * 100}%`,
      width: `${box.width * 100}%`,
      height: `${box.height * 100}%`,
      ...cellStyle(activeViseme, s.visemeCell),
      backgroundSize: `${activeViseme.cols * 100}% ${activeViseme.rows * 100}%`,
      maskImage: featherMask,
      WebkitMaskImage: featherMask,
      pointerEvents: "none",
    };
    return (
      <div
        ref={containerRef}
        data-npc-sprite={sprite.id}
        data-speaking={isSpeaking ? "true" : undefined}
        className={`relative w-full h-full ${className}`}
        style={bustStyle}
      >
        {isSpeaking && <div style={mouthStyle} />}
        {debugMouthBox && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: `${box.x * 100}%`,
              top: `${box.y * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              border: "1px dashed magenta",
              boxShadow: "0 0 0 1px color-mix(in oklch, var(--bg-void) 40%, transparent) inset",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
      </div>
    );
  }

  // Pick which sheet/cell to display this frame, in priority order:
  //   1. Blink (briefly) — closed eye cell from the triptych
  //   2. Speaking — viseme cell driven by lipsync
  //   3. Idle breathing — current breath frame
  //   4. Static bust
  let style: CSSProperties;
  if (s.blinking && sprite.blink) {
    style = cellStyle(sprite.blink, 2); // closed-eye cell
  } else if (isSpeaking && activeViseme) {
    style = cellStyle(activeViseme, s.visemeCell);
  } else if (sprite.breathing && !prefersReducedMotion) {
    style = cellStyle(sprite.breathing, s.breathFrame);
  } else {
    style = {
      backgroundImage: `url(${sprite.bust})`,
      backgroundSize: sprite.bustSize ?? "cover",
      backgroundPosition: sprite.bustPosition ?? "center top",
      backgroundRepeat: "no-repeat",
    };
  }

  return (
    <div
      ref={containerRef}
      data-npc-sprite={sprite.id}
      data-speaking={isSpeaking ? "true" : undefined}
      className={`w-full h-full ${className}`}
      style={style}
    />
  );
}

export default SpriteCharacter;
