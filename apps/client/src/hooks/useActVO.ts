/* ═══════════════════════════════════════════════════════
   ACTS 2–7 VO HOOK — plays spine voice-over lines

   Loads the per-act manifest (`apps/shared/act<N>VoManifest.json`)
   populated by `pnpm vo:act<N>`, and exposes `speak(lineId)` that
   plays the MP3 via a single `<audio>` element. Mirrors the Act 1
   pattern in `useElaraVO.ts` — line-id lookup + queue + volume +
   graceful no-op when the manifest isn't generated yet.

   The manifests store either dev-relative paths (`/audio/act2/...`)
   when the generator ran without AWS creds, OR full S3 URLs when it
   did. `resolveUrl` handles both forms: absolute URLs pass through;
   relative paths get wrapped by `assetUrl()` so they resolve to the
   S3 CDN at runtime.

   Usage:
     const { speak } = useActVO(6);
     speak("human-confession-01");
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assetUrl";
import { getVoVolume } from "@/lib/streamerSettings";

export type ActVoKey = "2" | "3" | "4" | "4_5" | "5" | "6" | "7";

type Manifest = Record<string, string>;

const manifestCache: Partial<Record<ActVoKey, Manifest>> = {};
const manifestLoading: Partial<Record<ActVoKey, Promise<void>>> = {};

async function loadManifest(act: ActVoKey): Promise<void> {
  if (manifestCache[act]) return;
  if (manifestLoading[act]) return manifestLoading[act];

  const promise = (async () => {
    try {
      // Each act's manifest is a separate static import so Vite can
      // tree-shake. Switch instead of template string so the bundler
      // sees every possible specifier at build time.
      let mod: { default: Manifest } | Manifest;
      switch (act) {
        case "2":
          mod = await import("@shared/act2VoManifest.json");
          break;
        case "3":
          mod = await import("@shared/act3VoManifest.json");
          break;
        case "4":
          mod = await import("@shared/act4VoManifest.json");
          break;
        case "4_5":
          mod = await import("@shared/act4_5VoManifest.json");
          break;
        case "5":
          mod = await import("@shared/act5VoManifest.json");
          break;
        case "6":
          mod = await import("@shared/act6VoManifest.json");
          break;
        case "7":
          mod = await import("@shared/act7VoManifest.json");
          break;
        default:
          mod = {};
      }
      manifestCache[act] =
        (mod as { default?: Manifest }).default ?? (mod as Manifest);
    } catch {
      manifestCache[act] = {};
    }
  })();
  manifestLoading[act] = promise;
  return promise;
}

function resolveUrl(raw: string): string {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return assetUrl(raw);
}

export function useActVO(act: ActVoKey) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(Boolean(manifestCache[act]));

  useEffect(() => {
    let active = true;
    loadManifest(act).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [act]);

  const speak = useCallback(
    (lineId: string) => {
      const m = manifestCache[act];
      const raw = m?.[lineId];
      if (!raw) return false;

      if (audioRef.current && !audioRef.current.ended) {
        queueRef.current.push(lineId);
        return true;
      }

      const url = resolveUrl(raw);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.volume = 0.85 * getVoVolume();
      audio.onplay = () => setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
        const next = queueRef.current.shift();
        if (next) {
          audioRef.current = null;
          speak(next);
        }
      };
      audio.onerror = () => {
        setSpeaking(false);
        audioRef.current = null;
      };
      void audio.play().catch(() => {
        setSpeaking(false);
        audioRef.current = null;
      });
      return true;
    },
    [act],
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    queueRef.current = [];
    setSpeaking(false);
  }, []);

  const has = useCallback(
    (lineId: string) => Boolean(manifestCache[act]?.[lineId]),
    [act],
  );

  return { speak, stop, speaking, ready, has };
}
