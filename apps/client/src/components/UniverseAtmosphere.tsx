/* ═══════════════════════════════════════════════════════
   UNIVERSE ATMOSPHERE — Bridges Living Universe events
   to the Void Energy visual atmosphere and ambient music.

   Pure side-effect component: subscribes to universe state,
   pushes atmosphere changes to the DOM via data attributes,
   and overrides ambient music when events carry a musicOverride
   consequence.

   Mount once in the global overlay area (GameGate in App.tsx).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { useLivingUniverse } from "@/hooks/useDailyBrief";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import type { MusicTrack } from "@/contexts/AmbientMusicContext";

/* ─── EVENT → ATMOSPHERE MAPPING ───
   Maps Living Universe event IDs to CSS data-universe-event
   values. These drive the CSS variables defined in index.css
   (--void-glow, --void-accent) for event-specific visual moods. */

const EVENT_ATMOSPHERES: Record<string, string> = {
  necromancer_return: "necromancer_revival",
  dreamer_awakening: "ascendant_light",
  terminus_advance: "virus_encounter",
  antiquarian_revelation: "cosmic_dawn",
  shadow_tongue_edit: "digital_decay",
};

/* ─── MUSIC OVERRIDE → YOUTUBE TRACK ───
   Maps the musicOverride strings from livingUniverseEvents.ts
   to playable YouTube tracks. When a track name has a known
   YouTube ID we play it; otherwise we log the intent so the
   override infrastructure is exercised and ready for when
   IDs are added. */

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
    youtubeId: "", // YouTube ID pending
  },
  "The Source (Reprise)": {
    id: "universe-source-reprise",
    title: "The Source (Reprise)",
    album: "Silence in Heaven",
    youtubeId: "", // YouTube ID pending
  },
  "Silence in Heaven": {
    id: "universe-silence-in-heaven",
    title: "Silence in Heaven",
    album: "Silence in Heaven",
    youtubeId: "", // YouTube ID pending
  },
};

export default function UniverseAtmosphere() {
  const { activeEvents, activeConsequences } = useLivingUniverse();
  const { playEventOverride, clearEventOverride } = useAmbientMusic();
  const prevMusicOverrideRef = useRef<string | undefined>(undefined);

  /* ── 1. Atmosphere: set data-universe-event on <html> ──
     CSS selectors in index.css respond to this attribute to
     override --void-glow and --void-accent for event moods. */
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
      // Only clean up if we are still the one who set it
      if (document.documentElement.dataset.universeEvent === atmosphere) {
        document.documentElement.dataset.universeEvent = prev || "";
      }
    };
  }, [activeEvents]);

  /* ── 2. Music: override ambient track when event has musicOverride ── */
  useEffect(() => {
    const musicOverride = activeConsequences?.musicOverride;

    // If override disappeared, clear it
    if (!musicOverride && prevMusicOverrideRef.current) {
      prevMusicOverrideRef.current = undefined;
      clearEventOverride();
      return;
    }

    // If override unchanged, skip
    if (musicOverride === prevMusicOverrideRef.current) return;

    // New or changed override
    if (musicOverride) {
      prevMusicOverrideRef.current = musicOverride;
      const track = MUSIC_OVERRIDE_TRACKS[musicOverride];
      if (track) {
        playEventOverride(track);
      } else {
        console.log(`[UniverseAtmosphere] Unknown music override: "${musicOverride}"`);
      }
    }
  }, [activeConsequences?.musicOverride, playEventOverride, clearEventOverride]);

  return null; // Pure side-effect component
}
