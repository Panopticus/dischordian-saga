/* ═══════════════════════════════════════════════════════
   FAILURE REVELATIONS — Dispatcher

   Surfaces failureContent.ts lore via toast whenever something
   in the game fails. Failure is the Dreamer's classroom.

   Any component can call:
     triggerFailureRevelation({ type: "combat_lost", opponent: "locke" })

   If matching content exists, a toast plays with the revelation.
   Also persists to localStorage so the Codex can show "failures
   witnessed" later.
   ═══════════════════════════════════════════════════════ */
import { toast } from "sonner";
import { getFailureContent, type FailureTrigger } from "@/game/failureContent";

const STORAGE_KEY = "dischordian:failure_revelations_seen";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function addSeenId(id: string) {
  try {
    const seen = getSeenIds();
    seen.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
  } catch { /* ignore storage errors */ }
}

/**
 * Trigger a failure revelation. If matching content exists, surfaces it
 * via toast with the narrator's attribution.
 * Safe to call from anywhere — no-ops gracefully if no content matches.
 */
export function triggerFailureRevelation(trigger: FailureTrigger): void {
  const content = getFailureContent(trigger);
  if (!content) return;

  const seen = getSeenIds();
  const isNew = !seen.has(content.id);

  toast(
    `${isNew ? "📜 " : ""}${content.narrator ? content.narrator.toUpperCase() + " — " : ""}${content.revelation}`,
    {
      duration: 8000,
      className: "font-mono text-xs",
      description: content.consolationReward
        ? `+${content.consolationReward.xp ?? 0} XP · +${content.consolationReward.dream ?? 0} Dream`
        : undefined,
    },
  );

  if (isNew) addSeenId(content.id);
}

/**
 * Get all failure revelations the player has seen.
 * Useful for Codex display.
 */
export function getSeenFailureRevelations(): string[] {
  return [...getSeenIds()];
}

/**
 * How many failure-content entries has the player unlocked?
 */
export function getFailureRevelationCount(): number {
  return getSeenIds().size;
}
