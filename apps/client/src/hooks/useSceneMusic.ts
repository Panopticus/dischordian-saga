/* ═══════════════════════════════════════════════════════
   useSceneMusic — declarative scene → track resolver

   Plan §D2. Reads a sceneId, looks it up in the music
   registry, and exposes the resulting cue (track + intensity
   + fade). The actual playback pipeline is owned by
   AmbientMusicContext — this hook is the metadata bridge
   that lets a story beat / hub / romance scene declare its
   musical intent in one place.

   Caller pattern:

     const cue = useSceneMusic("act_3_intro");
     if (cue) ambientMusic.play(cue.baseTrackId, { fadeInMs: cue.fadeInMs });
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import {
  getSceneMusicCue,
  type SceneMusicCue,
} from "@shared/sceneMusicRegistry";

export function useSceneMusic(sceneId: string | undefined | null): SceneMusicCue | undefined {
  return useMemo(() => {
    if (!sceneId) return undefined;
    return getSceneMusicCue(sceneId);
  }, [sceneId]);
}
