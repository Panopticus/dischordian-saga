/* ═══════════════════════════════════════════════════════
   useTranslation — Convenience hook wrapping react-i18next
   with namespace-specific shortcut functions.

   Usage:
     const { t, tCommon, tGame, tUI } = useAppTranslation();
     tCommon("actions.save")   // => "Save"
     tGame("currency.dream")   // => "Dream"
     tUI("settings.title")     // => "Ship Systems"
   ═══════════════════════════════════════════════════════ */
import { useCallback } from "react";
import {
  useTranslation,
  type UseTranslationOptions,
} from "react-i18next";
import type { Namespace } from "../i18n/config";

/**
 * App-level translation hook that provides the base `t` function
 * plus namespace-specific helpers: `tCommon`, `tGame`, `tUI`.
 *
 * Preloads the requested namespaces so translations are available
 * synchronously on first render.
 */
export function useAppTranslation(
  ns: Namespace | Namespace[] = "common",
  options?: UseTranslationOptions<string>,
) {
  // Preload namespaces so keys resolve immediately
  const namespacesToLoad: Namespace[] = Array.isArray(ns) ? ns : [ns];
  const allNs: Namespace[] = Array.from(
    new Set([...namespacesToLoad, "common", "game", "ui"]),
  );

  const { t, i18n, ready } = useTranslation(allNs as string[], options);

  /** Translate a key from the `common` namespace */
  const tCommon = useCallback(
    (key: string, opts?: Record<string, unknown>) =>
      t(key, { ns: "common", ...opts }),
    [t],
  );

  /** Translate a key from the `game` namespace */
  const tGame = useCallback(
    (key: string, opts?: Record<string, unknown>) =>
      t(key, { ns: "game", ...opts }),
    [t],
  );

  /** Translate a key from the `ui` namespace */
  const tUI = useCallback(
    (key: string, opts?: Record<string, unknown>) =>
      t(key, { ns: "ui", ...opts }),
    [t],
  );

  return {
    /** Default `t` bound to the requested namespace(s) */
    t,
    /** Translate from `common` namespace */
    tCommon,
    /** Translate from `game` namespace */
    tGame,
    /** Translate from `ui` namespace */
    tUI,
    /** Underlying i18next instance */
    i18n,
    /** Whether translations have loaded */
    ready,
  } as const;
}

export default useAppTranslation;
