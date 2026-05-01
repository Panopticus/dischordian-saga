/* ═══════════════════════════════════════════════════════
   useGuildCutsceneVO — speaker-agnostic VO playback for
   guild-cutscene lines. Resolves a line id → its mp3 url
   by lazy-importing the matching per-speaker manifest, then
   plays the audio with the same cancelable HTMLAudioElement
   pattern as the other VO hooks.

   Why a dedicated hook instead of useFighterVO? Two reasons:
     1. Guild cutscenes touch 26 unique speakers; the
        fighterVoRegistry only registers fighters and would
        double in size to absorb chorus/between/warden etc.
     2. Resolution is line-id-driven (we have a full pair
        from guildCutsceneVoMap.ts), so we already know the
        speaker — no need for the registry indirection.

   Manifests are cached at module scope, surviving unmount.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";
import { getVoLine } from "@shared/expansionArt/guildCutsceneVoMap";

type Manifest = Record<string, string>;

const MANIFEST_CACHE = new Map<string, Manifest>();
const MANIFEST_INFLIGHT = new Map<string, Promise<Manifest>>();

/** Lazy-load `apps/shared/<speaker>VoManifest.json` and cache it. */
async function loadManifest(speaker: string): Promise<Manifest> {
  const cached = MANIFEST_CACHE.get(speaker);
  if (cached) return cached;
  const inflight = MANIFEST_INFLIGHT.get(speaker);
  if (inflight) return inflight;

  const promise = (async () => {
    try {
      // Vite resolves dynamic imports of JSON modules at build time
      // when the path is a literal template. Speaker names are a
      // closed set (the 26 keys in guild-cutscene-vo-lines.json), so
      // the bundler emits one chunk per manifest.
      const mod = (await import(
        /* @vite-ignore */ `@shared/${speaker}VoManifest.json`
      )) as { default?: Manifest } & Manifest;
      const data: Manifest =
        (mod.default && typeof mod.default === "object" ? mod.default : (mod as Manifest)) ?? {};
      MANIFEST_CACHE.set(speaker, data);
      return data;
    } catch {
      MANIFEST_CACHE.set(speaker, {});
      return {};
    } finally {
      MANIFEST_INFLIGHT.delete(speaker);
    }
  })();

  MANIFEST_INFLIGHT.set(speaker, promise);
  return promise;
}

export interface UseGuildCutsceneVOResult {
  /** Begin playback for the given guild-cutscene VO line id. Resolves
   *  to the underlying HTMLAudioElement so callers can wire up
   *  analyser nodes for lipsync, or `null` if the line/url could not
   *  be resolved. */
  speak: (voLineId: string) => Promise<HTMLAudioElement | null>;
  /** Cancel current playback. */
  stop: () => void;
  /** True while a line is actively playing. */
  speaking: boolean;
}

export function useGuildCutsceneVO(): UseGuildCutsceneVOResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.src = "";
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const speak = useCallback<UseGuildCutsceneVOResult["speak"]>(
    async (voLineId) => {
      const pair = getVoLine(voLineId);
      if (!pair) return null;
      const manifest = await loadManifest(pair.speaker);
      const url = manifest[voLineId];
      if (!url) return null;

      stop();
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
      setSpeaking(true);

      const cleanup = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
          setSpeaking(false);
        }
      };
      audio.addEventListener("ended", cleanup, { once: true });
      audio.addEventListener("error", cleanup, { once: true });

      try {
        await audio.play();
      } catch {
        cleanup();
        return null;
      }
      return audio;
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speaking };
}
