/**
 * Chess SFX — one-shot audio on move / capture / check / mate.
 *
 * Lightweight: uses plain `HTMLAudioElement`. Files live at
 * `/audio/chess_sfx/<event>.mp3`. Missing files are silent
 * (no exception) so the UI keeps working if the asset drops
 * haven't landed yet.
 *
 * Keepsake bleed-through ("leak") uses a reversed-breath
 * underlay at lower volume so it doesn't compete with the GM's
 * spoken cue.
 */

export type ChessSfxEvent =
  | "move"
  | "capture"
  | "check"
  | "mate"
  | "mate_climb"
  | "leak";

const SFX_PATHS: Readonly<Record<ChessSfxEvent, string>> = Object.freeze({
  move: "/audio/chess_sfx/move.mp3",
  capture: "/audio/chess_sfx/capture.mp3",
  check: "/audio/chess_sfx/check.mp3",
  mate: "/audio/chess_sfx/mate.mp3",
  mate_climb: "/audio/chess_sfx/mate_climb.mp3",
  leak: "/audio/chess_sfx/leak.mp3",
});

const SFX_VOLUME: Readonly<Record<ChessSfxEvent, number>> = Object.freeze({
  move: 0.35,
  capture: 0.45,
  check: 0.55,
  mate: 0.7,
  mate_climb: 0.75,
  leak: 0.22,
});

// Cache of preloaded audio elements keyed by event.
const audioCache = new Map<ChessSfxEvent, HTMLAudioElement>();

function ensureLoaded(event: ChessSfxEvent): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  const existing = audioCache.get(event);
  if (existing) return existing;
  try {
    const audio = new Audio(SFX_PATHS[event]);
    audio.preload = "auto";
    audio.volume = SFX_VOLUME[event];
    audioCache.set(event, audio);
    return audio;
  } catch {
    return null;
  }
}

/** Fire a one-shot sfx. Silent on failure — never throws. */
export function playChessSfx(event: ChessSfxEvent): void {
  const a = ensureLoaded(event);
  if (!a) return;
  try {
    // Clone so overlapping moves don't cut each other off.
    const clone = a.cloneNode(true) as HTMLAudioElement;
    clone.volume = SFX_VOLUME[event];
    void clone.play().catch(() => {
      /* ignored — autoplay policy etc. */
    });
  } catch {
    /* ignored */
  }
}

/** Preload every sfx. Call once from the chess page mount. */
export function preloadChessSfx(): void {
  for (const event of Object.keys(SFX_PATHS) as ChessSfxEvent[]) {
    ensureLoaded(event);
  }
}
