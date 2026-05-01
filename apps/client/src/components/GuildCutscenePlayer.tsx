/* ═══════════════════════════════════════════════════════
   GuildCutscenePlayer — plays a single guild-cutscene
   (cs_id) with its paired VO line(s). Resolves visuals
   from guildCutscenesManifest.ts and audio from
   guildCutsceneVoMap.ts via useGuildCutsceneVO.

   Behaviour
   ─────────
   - On mount (autoPlay=true, default), starts the MP4 and
     fires the VO line. If the cutscene has multiple paired
     VO lines (only F.5 cs_hall_tier_up does), pick the line
     to play via the `voLineId` prop.
   - If the bundle has no MP4 for this cutscene (F.2.4
     emote stickers), we crossfade the start still and
     dwell for the VO duration.
   - Skip / Esc dismiss the player and call `onComplete`.
   - Subtitles render the VO line's `text` for accessibility.

   The component is intentionally framework-light (no
   framer-motion, no portal) so it can be embedded inline
   in a guild-hall view, an alliance-war banner, or popped
   in a fullscreen overlay by the caller.
   ═══════════════════════════════════════════════════════ */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  guildCutsceneById,
  guildCutsceneStillUrls,
  guildCutsceneVideoUrl,
} from "@shared/expansionArt/guildCutscenesManifest";
import { getCsVoLines } from "@shared/expansionArt/guildCutsceneVoMap";
import { useGuildCutsceneVO } from "@/hooks/useGuildCutsceneVO";

export interface GuildCutscenePlayerProps {
  /** Cutscene id matching guildCutscenesManifest. */
  csId: string;
  /** Specific paired VO line to play. Required when the cutscene has
   *  >1 paired line (e.g. cs_hall_tier_up has elara_tier_2..5).
   *  When omitted, plays the first paired line if any. */
  voLineId?: string;
  /** Auto-start on mount. Default true. */
  autoPlay?: boolean;
  /** Render skip + subtitle UI. Default true. */
  chrome?: boolean;
  /** Fired when video reaches its natural end OR the user skips. */
  onComplete?: () => void;
  /** Optional className for the wrapper. */
  className?: string;
}

export function GuildCutscenePlayer({
  csId,
  voLineId,
  autoPlay = true,
  chrome = true,
  onComplete,
  className,
}: GuildCutscenePlayerProps) {
  const def = guildCutsceneById(csId);
  const videoUrl = guildCutsceneVideoUrl(csId);
  const stillUrls = guildCutsceneStillUrls(csId);
  const paired = useMemo(() => getCsVoLines(csId), [csId]);

  const selectedLine = useMemo(() => {
    if (voLineId) return paired.find((p) => p.id === voLineId) ?? null;
    return paired[0] ?? null;
  }, [paired, voLineId]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { speak, stop } = useGuildCutsceneVO();
  const [completed, setCompleted] = useState(false);

  /* ─── Playback handlers ─── */
  const finish = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    stop();
    onComplete?.();
  }, [completed, onComplete, stop]);

  const startVo = useCallback(() => {
    if (selectedLine) void speak(selectedLine.id);
  }, [selectedLine, speak]);

  const handleVideoPlay = useCallback(() => {
    startVo();
  }, [startVo]);

  /* ─── Auto-play coordination ─── */
  /* Strategy:
   *   - If we have an MP4, the <video onPlay> handler kicks off VO.
   *     The <video> tag sets autoPlay={autoPlay} so this is
   *     declarative; nothing further needed in an effect.
   *   - If we have only stills (F.2.4 emotes), there's no onPlay
   *     event — fire the VO from a one-shot effect when autoPlay
   *     is true and the still loads.
   */
  useEffect(() => {
    if (!autoPlay) return;
    if (videoUrl) return; // <video onPlay> path will fire VO
    startVo();
    return stop;
  }, [autoPlay, videoUrl, startVo, stop]);

  /* ─── Esc key skips ─── */
  useEffect(() => {
    if (!chrome) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chrome, finish]);

  if (!def) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn(`GuildCutscenePlayer: unknown csId "${csId}"`);
    }
    return null;
  }

  const subtitleText = selectedLine?.text ?? "";

  return (
    <div
      className={className}
      role="dialog"
      aria-modal="true"
      aria-label={`Cutscene ${csId}`}
      data-cs-id={csId}
      data-cs-variant={def.variant ?? ""}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay={autoPlay}
          playsInline
          muted={false}
          onPlay={handleVideoPlay}
          onEnded={finish}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ) : (
        // Still-only fallback (F.2.4 emote stickers — videoless).
        // Render the start frame full-bleed.
        stillUrls[0] && (
          <img
            src={stillUrls[0]}
            alt={subtitleText || `Cutscene ${csId}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )
      )}

      {chrome && (
        <div data-cutscene-chrome="true">
          {subtitleText && (
            <p
              data-cutscene-subtitle="true"
              aria-live="polite"
            >
              {subtitleText}
            </p>
          )}
          <button
            type="button"
            onClick={finish}
            data-cutscene-skip="true"
            aria-label="Skip cutscene"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}
