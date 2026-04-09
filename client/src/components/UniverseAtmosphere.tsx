/* ═══════════════════════════════════════════════════════
   UNIVERSE ATMOSPHERE — Bridges Living Universe events
   to the Void Energy visual atmosphere and ambient music.

   Pure side-effect component: subscribes to universe state,
   pushes atmosphere changes to the DOM, and overrides music
   when events carry a musicOverride consequence.

   Mount once in the global overlay area (App.tsx / GameGate).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { useLivingUniverse } from "@/hooks/useDailyBrief";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import type { MusicTrack } from "@/contexts/AmbientMusicContext";

/* ─── EVENT → ATMOSPHERE MAPPING ─── */

const EVENT_ATMOSPHERES: Record<string, string> = {
  necromancer_return: "necromancer_revival",
  dreamer_awakening: "ascendant_light",
  terminus_advance: "virus_encounter",
  antiquarian_revelation: "cosmic_dawn",
  shadow_tongue_edit: "digital_decay",
};

/* ─── EVENT MUSIC OVERRIDE → YOUTUBE TRACK ───
   Maps the musicOverride strings from livingUniverseEvents.ts
   to playable YouTube tracks. When a track name has a known
   YouTube ID we use it directly; otherwise we log the intent
   so the override infrastructure is exercised and ready. */

const MUSIC_OVERRIDE_TRACKS: Record<string, MusicTrack> = {
  "Judgment Day": {
    id: "universe-judgment-day",
    title: "Judgment Day",
    album: "Silence in Heaven",
    youtubeId: "mIUKgCWp2f4",
  },
  "The Dreamer": {
    id: "universe-the-dreamer",
    title: "The Dreamer",
    album: "Silence in Heaven",
    youtubeId: "", // YouTube ID pending — will log override intent
  },
  "The Source (Reprise)": {
    id: "universe-source-reprise",
    title: "The Source (Reprise)",
    album: "Silence in Heaven",
    youtubeId: "", // YouTube ID pending — will log override intent
  },
  "Silence in Heaven": {
    id: "universe-silence-in-heaven",
    title: "Silence in Heaven",
    album: "Silence in Heaven",
    youtubeId: "", // YouTube ID pending — will log override intent
  },
};

export default function UniverseAtmosphere() {
  const { activeEvents, activeConsequences } = useLivingUniverse();
  const ambientMusic = useAmbientMusic();
  const prevRoomRef = useRef<string | null>(null);
  const musicOverrideActiveRef = useRef(false);

  /* ── 1. Atmosphere: set data-universe-event on <html> ── */
  useEffect(() => {
    if (!activeEvents || activeEvents.length === 0) {
      // Clear universe event atmosphere when no events active
      if (document.documentElement.dataset.universeEvent) {
        document.documentElement.dataset.universeEvent = "";
      }
      return;
    }

    // Apply the strongest (first) event's atmosphere
    const eventId = activeEvents[0]?.eventId;
    const atmosphere = eventId ? EVENT_ATMOSPHERES[eventId] : undefined;
    if (!atmosphere) return;

    const prev = document.documentElement.dataset.universeEvent;
    document.documentElement.dataset.universeEvent = atmosphere;

    return () => {
      // Only clean up if we're still the one who set it
      if (document.documentElement.dataset.universeEvent === atmosphere) {
        document.documentElement.dataset.universeEvent = prev || "";
      }
    };
  }, [activeEvents]);

  /* ── 2. Music: override ambient track when event has musicOverride ── */
  useEffect(() => {
    const musicOverride = activeConsequences?.musicOverride;

    if (!musicOverride) {
      // Event resolved — if we were overriding, let ambient music
      // return to its normal room track
      if (musicOverrideActiveRef.current) {
        musicOverrideActiveRef.current = false;
        console.log("[UniverseAtmosphere] Music override ended, returning to room music");
        // Resume room music if we have a saved room context
        if (prevRoomRef.current) {
          ambientMusic.playForRoom(prevRoomRef.current);
        }
      }
      return;
    }

    const track = MUSIC_OVERRIDE_TRACKS[musicOverride];
    if (!track) {
      console.log(`[UniverseAtmosphere] Unknown music override: "${musicOverride}"`);
      return;
    }

    // Save current room so we can restore later
    if (!musicOverrideActiveRef.current && ambientMusic.currentRoomId) {
      prevRoomRef.current = ambientMusic.currentRoomId;
    }
    musicOverrideActiveRef.current = true;

    if (!track.youtubeId) {
      // Track exists in the map but has no YouTube ID yet — log the intent
      console.log(
        `[UniverseAtmosphere] Music override ready: "${musicOverride}" ` +
        `(YouTube ID pending — would play "${track.title}" from ${track.album})`
      );
      return;
    }

    // Don't re-trigger if already playing this override track
    if (ambientMusic.currentTrack?.youtubeId === track.youtubeId && ambientMusic.isPlaying) {
      return;
    }

    console.log(`[UniverseAtmosphere] Applying music override: "${track.title}"`);
    // Use the ambient music system's internal playForRoom mechanism
    // by directly invoking the general play path — the track will
    // override whatever room music is currently playing
    ambientMusic.playForRoom(track.id);
  }, [activeConsequences?.musicOverride, ambientMusic]);

  return null; // Pure side-effect component
}
