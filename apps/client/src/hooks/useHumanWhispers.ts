/* ═══════════════════════════════════════════════════════
   useHumanWhispers — pre-Beat-H ambient whisper subscriber

   Subscribes to room enter + hotspot click counter changes
   and asks apps/shared/humanWhispers.ts for the next eligible
   whisper. Returns either the whisper to display or null.

   Lifecycle:
     - Whispers fire only while
       narrativeFlags["human_life_detective_seen"] is FALSE.
       Once the Detective video lands at Beat H, the surface
       closes for the rest of the run.
     - The `suppressed` arg lets the host (ArkExplorerPage)
       silence the surface while the Elara conversation popup
       is active. Suppression does NOT mark the candidate
       whisper as seen — it just refuses to surface it. The
       next eligibility check (e.g. when the popup closes)
       can resurface the same whisper.
     - On dismiss, the candidate whisper id is added to a
       hook-local Set so it never repeats in this session.

   Coordinate translation:
     - GameContext uses kebab-case room ids ("cargo-hold")
       and kebab-case hotspot ids ("rubber-chicken").
     - humanWhispers.ts uses snake_case room ids ("cargo_hold")
       and kebab-case hotspot ids (matches the room mystery
       modules).
     - The hook translates the room id at the boundary.

   Pure React. No external state — module-local Set of seen ids
   is enough for ambient whispers (refresh-on-reload is fine;
   they're not persistent narrative beats).
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  HUMAN_WHISPERS,
  pendingWhisper,
  type HumanWhisper,
} from "@shared/humanWhispers";
import type { RoomId } from "@shared/detectiveCommentary";

const KEBAB_TO_SNAKE = (kebab: string): string => kebab.replace(/-/g, "_");

/** Set of snake_case-ish RoomIds whisper.roomId may legitimately
 *  carry. Used to short-circuit translation when the player is in
 *  a room that has no whisper coverage. */
const ALL_WHISPER_ROOMS = new Set<string>(
  HUMAN_WHISPERS.filter((w) => w.roomId !== "any_room").map((w) => w.roomId),
);

export interface UseHumanWhispersResult {
  /** Currently surfaceable whisper, or null. The overlay should
   *  render text + play VO when this is non-null and not yet
   *  visible. */
  whisper: HumanWhisper | null;
  /** Mark the current whisper as seen and clear the slot. Called
   *  by the overlay after the auto-dismiss timer elapses or the
   *  player taps to dismiss. */
  dismiss: () => void;
}

export function useHumanWhispers(suppressed: boolean): UseHumanWhispersResult {
  const { state } = useGame();

  // Hook-local set of whispers the player has already heard this
  // session. Stored in a ref so updates to it don't re-run the
  // pending-whisper effect — only seen-state changes that come
  // from `dismiss()` matter, and `dismiss` triggers a manual
  // recompute by toggling the version counter below.
  const seenRef = useRef<Set<string>>(new Set());
  const [seenVersion, setSeenVersion] = useState(0);
  const [whisper, setWhisper] = useState<HumanWhisper | null>(null);

  // Translate the GameContext room id into a whisper RoomId. Null
  // when no room is active.
  const snakeRoom: RoomId | null = useMemo(() => {
    if (!state.currentRoomId) return null;
    return KEBAB_TO_SNAKE(state.currentRoomId) as RoomId;
  }, [state.currentRoomId]);

  // Derive the set of hotspot ids the player has examined in the
  // CURRENT room. The hotspotClickCount keys are kebab-case
  // `<roomId>:<hotspotId>`; we want just the hotspotId part for
  // rooms matching the active room.
  const examinedHotspots: Set<string> = useMemo(() => {
    const out = new Set<string>();
    if (!state.currentRoomId) return out;
    const prefix = `${state.currentRoomId}:`;
    for (const key of Object.keys(state.hotspotClickCount ?? {})) {
      if (!key.startsWith(prefix)) continue;
      const count = state.hotspotClickCount[key];
      if (typeof count === "number" && count > 0) {
        out.add(key.slice(prefix.length));
      }
    }
    return out;
  }, [state.currentRoomId, state.hotspotClickCount]);

  // Set of narrative flags currently true, narrowed to a Set
  // shape so the pure selector can accept it directly.
  const flagSet: Set<string> = useMemo(() => {
    const out = new Set<string>();
    for (const [key, value] of Object.entries(state.narrativeFlags ?? {})) {
      if (value) out.add(key);
    }
    return out;
  }, [state.narrativeFlags]);

  const detectiveSeen = Boolean(
    state.narrativeFlags?.["human_life_detective_seen"],
  );

  // Recompute the candidate whisper whenever the inputs change.
  useEffect(() => {
    if (suppressed) {
      // Suppressed by the host (Elara popup open, cutscene, etc.).
      // Do not surface a whisper — but keep the slot empty rather
      // than carrying a stale candidate from a previous tick.
      setWhisper(null);
      return;
    }
    if (!snakeRoom) {
      setWhisper(null);
      return;
    }
    // If the player is in a room with no whisper coverage AND no
    // any_room fallback is currently eligible (every any_room
    // whisper already seen), skip the expensive selector.
    if (!ALL_WHISPER_ROOMS.has(snakeRoom)) {
      const allAnyRoomSeen = HUMAN_WHISPERS.filter(
        (w) => w.roomId === "any_room",
      ).every((w) => seenRef.current.has(w.id));
      if (allAnyRoomSeen) {
        setWhisper(null);
        return;
      }
    }
    const next = pendingWhisper(
      snakeRoom,
      examinedHotspots,
      seenRef.current,
      flagSet,
      detectiveSeen,
    );
    setWhisper(next);
  }, [
    suppressed,
    snakeRoom,
    examinedHotspots,
    flagSet,
    detectiveSeen,
    seenVersion,
  ]);

  const dismiss = useCallback((): void => {
    setWhisper((current) => {
      if (current) {
        seenRef.current.add(current.id);
      }
      return null;
    });
    setSeenVersion((v) => v + 1);
  }, []);

  return { whisper, dismiss };
}
