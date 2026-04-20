/* ═══════════════════════════════════════════════════════
   useTransmissionIntercept

   Picks at most one video announcement to auto-play on
   the title screen per session. Filter chain:

     1. Must have `videoUrl` and `triggerOnTitle=true`.
     2. `audience` must match the viewer's tags.
     3. Must be unseen (no `firstSeenAt`, no `dismissedAt`).
     4. Must not be muted by `localStorage.muteTransmissions`.
     5. Roll against `triggerProbability` (0–100).
     6. Must not fire during the 1.5s threshold beat
        (`interactionReady` must be true).

   Exactly one pick per session is guaranteed via
   sessionStorage — even if the hook re-runs due to state
   changes, the same (or no) announcement is served.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useState } from "react";

import type { AnnouncementRow, AnnouncementAudience } from "./types";

const MUTE_KEY = "muteTransmissions";
const SESSION_PICK_KEY = "dischordia_intercept_pick";

interface InterceptArgs {
  announcements: AnnouncementRow[];
  audienceTags: AnnouncementAudience[];
  /** True once the user has passed the 1.5s threshold beat. */
  interactionReady: boolean;
}

export function useTransmissionIntercept({
  announcements,
  audienceTags,
  interactionReady,
}: InterceptArgs): AnnouncementRow | null {
  const [decided, setDecided] = useState(false);
  const [pick, setPick] = useState<AnnouncementRow | null>(null);

  const muted = useMemo(() => {
    try { return localStorage.getItem(MUTE_KEY) === "1"; }
    catch { return false; }
  }, []);

  // Session-scoped stability: if a pick was already made this
  // session (even a "no-pick" decision) don't reroll.
  const sessionDecision = useMemo(() => {
    try { return sessionStorage.getItem(SESSION_PICK_KEY); }
    catch { return null; }
  }, []);

  useEffect(() => {
    if (decided) return;
    if (!interactionReady) return;
    if (muted) {
      setDecided(true);
      try { sessionStorage.setItem(SESSION_PICK_KEY, "muted"); } catch { /* ignore */ }
      return;
    }
    if (sessionDecision) {
      // Already decided this session. If the decision was an ID,
      // find the matching announcement and play it; otherwise hold.
      const id = Number(sessionDecision);
      if (!Number.isFinite(id) || id <= 0) {
        setDecided(true);
        return;
      }
      const match = announcements.find(a => a.id === id);
      setPick(match ?? null);
      setDecided(true);
      return;
    }

    const audienceSet = new Set(audienceTags);
    const candidates = announcements.filter(a => {
      if (!a.videoUrl) return false;
      if (!a.triggerOnTitle) return false;
      if (a.dismissedAt) return false;
      if (a.firstSeenAt) return false;
      if (a.audience !== "all" && !audienceSet.has(a.audience)) return false;
      return true;
    });

    // Priority: high first, newest first.
    candidates.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
      const da = new Date(a.publishedAt).getTime();
      const db = new Date(b.publishedAt).getTime();
      return db - da;
    });

    for (const c of candidates) {
      const roll = Math.random() * 100;
      if (roll <= c.triggerProbability) {
        setPick(c);
        setDecided(true);
        try { sessionStorage.setItem(SESSION_PICK_KEY, String(c.id)); } catch { /* ignore */ }
        return;
      }
    }

    // No candidate rolled successfully — remember that for the session.
    setDecided(true);
    try { sessionStorage.setItem(SESSION_PICK_KEY, "no-pick"); } catch { /* ignore */ }
  }, [decided, interactionReady, muted, sessionDecision, announcements, audienceTags]);

  return pick;
}
