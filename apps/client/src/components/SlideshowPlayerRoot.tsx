/* ═══════════════════════════════════════════════════════
   SLIDESHOW PLAYER ROOT — global host for SongSlideshow.

   Mount this once near the app root. It subscribes to the
   witnessing store's activeSlideshow slot and mounts a
   <SongSlideshow /> whenever a caller queues one via
   `useWitnessingStore.getState().playSlideshow(id, opts)`
   (or the convenience `playSlideshow(id, opts)` helper).

   Keeps slideshow playback decoupled from whatever view the
   player is on — a narrative act in the card game can fire
   a slideshow and it just plays over whatever's rendered.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SongSlideshow from "./SongSlideshow";
import SongCinematicVideo from "./SongCinematicVideo";
import { MatrixFrame } from "./MatrixFrame";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { applySlideshowReward } from "@/stores/dischordiaCycleStore";
import {
  recordMemorableMoment,
  useMemorableMomentsStore,
} from "@/stores/memorableMomentsStore";
import { getDynamicLionFrames } from "@shared/memorableMoments";
import { useGame } from "@/contexts/GameContext";
import { useActVO } from "@/hooks/useActVO";
import {
  VARIANT_REGISTRY,
  resolveVariant,
} from "@shared/moralityTrustActVariants";
import { useVariant } from "@/hooks/useVariant";
import { discoverLoredexEntries } from "@/lib/discoverLoredex";

export function SlideshowPlayerRoot() {
  const active = useWitnessingStore((s) => s.activeSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);
  const moments = useMemorableMomentsStore((s) => s.moments);
  const { setNarrativeFlag, state: gameState } = useGame();
  // Acts 2-7 AAA Final cinematic drop — when an opener slideshow
  // declares a `videoUrl`, prefer the MP4 player. If the video
  // 404s, this flag flips and we fall back to the still-frame
  // slideshow. Reset whenever the active slideshow changes.
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => {
    setVideoFailed(false);
  }, [active?.def.id]);
  // §14.1 · Silence-of-Two-Witnesses parenthetical VO — two quiet
  // voice-over beats (`silence-elara`, `silence-human`) that layer
  // on top of the SILENCE_OF_TWO_WITNESSES_SLIDESHOW cinematic. The
  // cinematic is mostly room tone + held breath; these are the only
  // two voiced moments.
  const act2Vo = useActVO("2");
  const silenceVoFiredRef = useRef(false);

  useEffect(() => {
    if (!active) {
      silenceVoFiredRef.current = false;
      return;
    }
    if (active.def.id !== "silence-of-two-witnesses") return;
    if (silenceVoFiredRef.current) return;
    silenceVoFiredRef.current = true;
    // audit/16 PR 7 (C5) — consult variant resolver for a
    // morality-gated VO override before firing the hardcoded
    // pair. Authors can ship a `surface: "slideshow_vo_override",
    // targetId: "silence-of-two-witnesses"` variant carrying
    // alternate `voLineIds`; the resolver picks the most
    // specific match for current morality/trust/act/flags.
    const trustByCompanion = {
      elara: gameState.elaraTrustLevel ?? 0,
      the_human: gameState.humanTrustLevel ?? 0,
    };
    const flags = new Set(
      Object.entries(gameState.narrativeFlags ?? {})
        .filter(([, v]) => v)
        .map(([k]) => k),
    );
    const variant = resolveVariant(
      VARIANT_REGISTRY,
      "slideshow_vo_override",
      "silence-of-two-witnesses",
      {
        moralityScore: gameState.moralityScore ?? 0,
        narrativeAct: gameState.narrativeAct ?? 0,
        trustByCompanion,
        flags,
        now: new Date(),
      },
    );
    const lineIds = variant?.voLineIds && variant.voLineIds.length > 0
      ? variant.voLineIds
      : ["silence-elara", "silence-human"];
    for (const id of lineIds) act2Vo.speak(id);
  }, [active, act2Vo, gameState]);

  // Appendix A.1 — once the player flips
  // matrix_is_slideshow_substrate, every slideshow becomes a
  // diegetic "Matrix pull." Before the flag, slideshows play
  // with the pre-Witnessing framing they always had.
  const matrixFrameActive = Boolean(
    gameState.narrativeFlags?.matrix_is_slideshow_substrate,
  );

  // §11.2 — when the queued slideshow is "The Lion in Black",
  // substitute its dynamic frames (2-10) with captions curated
  // from the player's memorable moments. Every other slideshow
  // plays with its canonical frames untouched.
  const slideshowDef = useMemo(() => {
    if (!active) return null;
    if (active.def.id === "the-lion-in-black") {
      return getDynamicLionFrames(active.def, moments);
    }
    return active.def;
  }, [active, moments]);

  const handleComplete = useCallback(() => {
    // Apply the slideshow's registered light-energy reward (if any)
    // to the Dischordia Cycle store before firing the caller's
    // onComplete. This is how §5.4's "+500 community Light Energy"
    // actually lands on the meter.
    if (active) {
      applySlideshowReward(active.def.lightEnergyReward);
      // §5 — every slideshow declares a set of narrative flags it
      // raises on completion. SlideshowPlayerRoot is the single
      // site that applies them so callers don't each have to
      // duplicate the flag wiring.
      if (active.def.flagsSetOnComplete) {
        for (const flag of active.def.flagsSetOnComplete) {
          setNarrativeFlag(flag, true);
        }
      }
      // Witnessing §11.2 — record the watched cinematic as a
      // memorable moment. The Antiquarian's Lion in Black feed
      // consumes `slideshow_watched` moments into its three
      // slideshow-themed slots (Observation Deck Vortex, Engineer
      // execution, Eyes falling in the grass).
      recordMemorableMoment(
        "slideshow_watched",
        `The moment you watched ${active.def.title}.`,
        undefined,
        { slideshowId: active.def.id },
      );
      // Loredex auto-discovery — when the slideshow declares an
      // `unlockLoredexEntry`, mark it as discovered so the album /
      // index pages reflect the watch without waiting for a manual
      // tap. Generic across all registered slideshows; today binds
      // the 18 SiH song slideshows and 19 dialog interludes to
      // their `song_sih_<N>` Loredex entries plus any pre-existing
      // declarations (e.g. last-words → "the-prince-of-celebration").
      if (active.def.unlockLoredexEntry) {
        discoverLoredexEntries([active.def.unlockLoredexEntry]);
      }
    }
    completeActive();
  }, [active, completeActive, setNarrativeFlag]);

  // NOTE(ci-green): SongSlideshow (apps/client/src/components/SongSlideshow.tsx)
  // is a simple frames-based renderer that can't consume the rich production
  // shape of SongSlideshowDef (Ken Burns animation, lyric-synced overlays,
  // theater-mode dialog beats, lore card reveals, reduced-motion fallback,
  // etc). Until the component is rewritten to consume a SongSlideshowDef
  // directly, lossy-adapt the def's frame timings into the simple shape the
  // component accepts. Drops kenBurns, overlays, theater mode, and the
  // onSkip/onClose distinction — onEnd covers both natural-end and
  // user-dismiss so rewards always apply when a slideshow plays.
  const simpleFrames = useMemo(
    () =>
      slideshowDef?.frames.map((f) => ({
        imageSrc: f.imageUrl,
        // D2 Vision 3 + 4 — pass through the per-frame video URL when
        // the def declares one. SongSlideshow renders <video> in
        // place of <img> for those frames and pauses the audio bed
        // while the flash plays. Image stays as the fallback when
        // the video fails to load.
        videoSrc: f.videoUrl,
        durationMs: Math.max(1000, f.endMs - f.startMs),
        lyric: f.dialogOverlay,
        // Narrator portrait composite — Silence in Heaven dialog
        // interludes carry a per-beat portrait + side; the runtime
        // overlays the speaker's expression on the background.
        portraitSrc: f.portraitUrl,
        portraitSide: f.portraitSide,
      })) ?? [],
    [slideshowDef],
  );

  // audit/10.F1 — transmission surface variant. Authored framing
  // text overlays the slideshow when morality/trust/act gating
  // matches. Null = no overlay (the slideshow plays bare).
  const transmissionVariant = useVariant(
    "transmission",
    slideshowDef?.id,
  );

  if (!active || !slideshowDef) return null;

  // Acts 2-7 AAA Final — when the def declares a videoUrl and the
  // video hasn't failed yet, route to the MP4 player. Music bed
  // rides on `audioUrl` underneath. Falls through to the slideshow
  // path if the video errors.
  const useVideoPlayer = Boolean(slideshowDef.videoUrl) && !videoFailed;

  // Dream-mode props are threaded through when the queue entry
  // declares dream metadata. The presence of `dream` flips
  // SongSlideshow into bookend + awaken behavior. The video-player
  // path is intentionally not dream-aware — dream visions render
  // as frame slideshows so the prophecy bookends bracket cleanly.
  const dream = active?.dream;
  const inner = useVideoPlayer && !dream ? (
    <SongCinematicVideo
      videoUrl={slideshowDef.videoUrl!}
      audioUrl={slideshowDef.audioUrl}
      title={slideshowDef.title}
      onEnd={handleComplete}
      onVideoError={() => setVideoFailed(true)}
    />
  ) : (
    <SongSlideshow
      frames={simpleFrames}
      audioSrc={slideshowDef.audioUrl}
      title={slideshowDef.title}
      onEnd={handleComplete}
      dreamMode={Boolean(dream)}
      bookend={dream?.bookend}
      visionId={dream?.visionId}
      unawakenable={dream?.unawakenable}
      onDreamEnd={dream?.onDreamEnd}
    />
  );

  const wrapped = transmissionVariant ? (
    <div className="relative w-full h-full">
      {inner}
      <div
        className="absolute left-0 right-0 bottom-0 px-6 pb-6 pointer-events-none"
        data-testid="transmission-variant-line"
        data-variant-id={transmissionVariant.id}
      >
        <p className="font-mono text-xs leading-relaxed max-w-2xl mx-auto text-center text-[color:color-mix(in_oklch,var(--neon-cyan)_70%,white)] drop-shadow-[0_0_8px_color-mix(in_oklch,var(--energy-primary)_40%,transparent)]">
          {transmissionVariant.text}
        </p>
      </div>
    </div>
  ) : (
    inner
  );

  if (matrixFrameActive) {
    return <MatrixFrame title={slideshowDef.title}>{wrapped}</MatrixFrame>;
  }
  return wrapped;
}
