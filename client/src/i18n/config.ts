/* ═══════════════════════════════════════════════════════
   i18n CONFIG — Namespace-based i18next configuration
   for Dischordian Saga.

   Namespaces:
     common  — shared UI strings (buttons, labels, nav)
     game    — game-specific terms (classes, elements, stats)
     narrative — story text (English-only, structured for future translation)
     ui      — interface strings (settings, menus, tooltips)

   Default / fallback language: English (en)
   ═══════════════════════════════════════════════════════ */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEN from "./locales/en/common.json";
import gameEN from "./locales/en/game.json";
import uiEN from "./locales/en/ui.json";

// Legacy flat translation file — kept for backward compatibility
import legacyEN from "./locales/en.json";

export const NAMESPACES = ["common", "game", "narrative", "ui"] as const;
export type Namespace = (typeof NAMESPACES)[number];

export const DEFAULT_NS: Namespace = "common";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEN,
      game: gameEN,
      ui: uiEN,
      // Legacy namespace kept so existing t("key") calls still resolve
      translation: legacyEN,
    },
  },

  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",

  // Namespace configuration
  ns: ["common", "game", "ui", "translation"],
  defaultNS: DEFAULT_NS,
  fallbackNS: "translation", // fall back to legacy flat file

  interpolation: {
    escapeValue: false, // React already escapes output
    // Allow basic HTML tags inside translation values
    // Usage: t("key", { interpolation: { escapeValue: false } })
    skipOnVariables: false,
  },

  // Development: warn on missing keys
  saveMissing: import.meta.env.DEV,
  missingKeyHandler(lngs, ns, key, fallbackValue) {
    if (import.meta.env.DEV) {
      console.warn(
        `[i18n] Missing key: "${key}" in namespace "${ns}" for languages [${lngs.join(", ")}]. Fallback: "${fallbackValue}"`,
      );
    }
  },

  // Return key if translation not found (makes missing translations obvious)
  returnNull: false,
  returnEmptyString: false,
});

export default i18n;

/** Change language and persist to localStorage */
export function setLanguage(lang: string) {
  i18n.changeLanguage(lang);
  localStorage.setItem("language", lang);
}

/** Get current language code */
export function getLanguage(): string {
  return i18n.language;
}

/** Available languages (UI selector) */
export const LANGUAGES = [
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "es", label: "Espa\u00F1ol", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "fr", label: "Fran\u00E7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "de", label: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "ja", label: "\u65E5\u672C\u8A9E", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "pt", label: "Portugu\u00EAs", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "ko", label: "\uD55C\uAD6D\uC5B4", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "zh", label: "\u4E2D\u6587", flag: "\u{1F1E8}\u{1F1F3}" },
] as const;
