/* ═══════════════════════════════════════════════════════
   useBanterEvent — N×N banter consumer

   Plan §A3. The banter system ships with pure helpers
   (pickBanterPair, isBanterEligible). This hook is the
   client-side glue: given a trigger event + the speakers
   currently co-present in the active scene/hub, find an
   eligible pair against the player's flag bag + per-pair
   play counts and surface it.

   Play-count bookkeeping lives in localStorage keyed per
   user, so reloads don't reset banter fatigue.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from "react";
import {
  pickBanterPair,
  type BanterPair,
  type BanterSpeakerId,
} from "@shared/companionBanter";
import { useGame } from "@/contexts/GameContext";

const PLAY_COUNT_KEY = "loredex-banter-play-counts";

function loadPlayCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PLAY_COUNT_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "number") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function persistPlayCounts(counts: Record<string, number>): void {
  try {
    localStorage.setItem(PLAY_COUNT_KEY, JSON.stringify(counts));
  } catch {
    /* private mode / quota — silently degrade */
  }
}

export interface UseBanterEventResult {
  /** The active pair, or null if none matches. */
  active: BanterPair | null;
  /** Trigger an event lookup with the named speakers co-present. */
  fire: (
    trigger: string,
    presentSpeakers: ReadonlyArray<BanterSpeakerId>,
  ) => BanterPair | null;
  /** Mark the active pair as fully played — increments its count
   *  + persists. Call when the dialog finishes. */
  markPlayed: () => void;
  /** Force-clear the active pair without incrementing. */
  dismiss: () => void;
}

export function useBanterEvent(): UseBanterEventResult {
  const { state } = useGame();
  const [active, setActive] = useState<BanterPair | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setCounts(loadPlayCounts());
  }, []);

  const fire = useCallback(
    (trigger: string, presentSpeakers: ReadonlyArray<BanterSpeakerId>) => {
      const next = pickBanterPair({
        trigger,
        presentSpeakers,
        flags: state.narrativeFlags,
        playCounts: counts,
      });
      setActive(next);
      return next;
    },
    [state.narrativeFlags, counts],
  );

  const markPlayed = useCallback(() => {
    if (!active) return;
    setCounts((prev) => {
      const next = { ...prev, [active.id]: (prev[active.id] ?? 0) + 1 };
      persistPlayCounts(next);
      return next;
    });
    setActive(null);
  }, [active]);

  const dismiss = useCallback(() => setActive(null), []);

  return { active, fire, markPlayed, dismiss };
}
