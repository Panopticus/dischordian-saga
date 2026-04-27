/**
 * useKeymap — hook for reading the user's remappable keymap.
 *
 * Settings exposes a `keymap` object (apps/shared/settingsSchema.ts) that
 * maps logical action names ("cancel", "confirm", "skipCutscene", …) to
 * `KeyboardEvent.code` strings ("Escape", "Enter", "Space", …). This
 * hook gives components a stable read-side of that map plus a small
 * `matchesAction` helper that turns any KeyboardEvent into a boolean
 * "did this match the user's bound key for X?" check.
 *
 * Why a hook (vs. a plain getter):
 *   - Settings sync writes localStorage on every change; the hook
 *     reacts via `storage` events so two Settings windows stay in
 *     sync, AND via a custom `loredex-settings-changed` event emitted
 *     by the in-tab settings save flow.
 *   - `Escape` is always-on as a cancel fallback so players who clear
 *     `keymap.cancel` aren't stranded.
 *
 * Consumers:
 *
 *   const { matchesAction } = useKeymap();
 *   useEffect(() => {
 *     const handler = (e: KeyboardEvent) => {
 *       if (matchesAction("skipCutscene", e)) onSkip();
 *     };
 *     window.addEventListener("keydown", handler);
 *     return () => window.removeEventListener("keydown", handler);
 *   }, [matchesAction, onSkip]);
 *
 * Default keymap matches the keys currently hardcoded across the
 * codebase, so wiring this hook into a previously-hardcoded handler
 * is zero behavioral change for default users.
 */
import { useEffect, useMemo, useState, useCallback } from "react";
import { DEFAULT_SETTINGS, type GameSettings } from "@shared/settingsSchema";

const STORAGE_KEY = "loredex-settings";
const SETTINGS_CHANGED_EVENT = "loredex-settings-changed";

/** The set of actions the keymap supports. Mirrors the schema fields. */
export type KeymapAction = keyof GameSettings["keymap"];

/** Always-on fallback keys for actions that would otherwise be
 *  unmappable. The user-facing intent: "I cleared my keymap, am I now
 *  unable to close any modal?" — never. */
export const ALWAYS_ON_FALLBACKS: Partial<Record<KeymapAction, readonly string[]>> = {
  cancel: ["Escape"],
};

/** Pure-function matcher exported alongside the hook so unit tests can
 *  exercise the contract without rendering a component. The hook
 *  delegates to this internally. */
export function matchesActionWithKeymap(
  keymap: GameSettings["keymap"],
  action: KeymapAction,
  event: { code: string },
): boolean {
  if (keymap[action] && event.code === keymap[action]) return true;
  const fallbacks = ALWAYS_ON_FALLBACKS[action];
  if (fallbacks?.includes(event.code)) return true;
  return false;
}

/** Read the current keymap from localStorage, falling back to the
 *  schema's defaults. Exported so tests can verify the read path
 *  without rendering a component. */
export function readKeymapFromStorage(): GameSettings["keymap"] {
  if (typeof window === "undefined") return DEFAULT_SETTINGS.keymap;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS.keymap;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...DEFAULT_SETTINGS.keymap, ...(parsed.keymap ?? {}) };
  } catch {
    return DEFAULT_SETTINGS.keymap;
  }
}

function readKeymap(): GameSettings["keymap"] {
  return readKeymapFromStorage();
}

export interface UseKeymapResult {
  /** Live snapshot of the user's keymap. */
  keymap: GameSettings["keymap"];
  /** True when `event.code` matches the user's bound key for `action`,
   *  OR the action's always-on fallback (e.g. `Escape` for `cancel`). */
  matchesAction: (action: KeymapAction, event: KeyboardEvent) => boolean;
}

export function useKeymap(): UseKeymapResult {
  const [keymap, setKeymap] = useState<GameSettings["keymap"]>(readKeymap);

  useEffect(() => {
    const refresh = () => setKeymap(readKeymap());
    // Cross-tab updates (Settings open in another tab).
    window.addEventListener("storage", refresh);
    // In-tab updates — settingsSync emits this on every saveSettings.
    window.addEventListener(SETTINGS_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SETTINGS_CHANGED_EVENT, refresh);
    };
  }, []);

  const matchesAction = useCallback(
    (action: KeymapAction, event: KeyboardEvent): boolean =>
      matchesActionWithKeymap(keymap, action, event),
    [keymap],
  );

  return useMemo(() => ({ keymap, matchesAction }), [keymap, matchesAction]);
}
