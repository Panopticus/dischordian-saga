/* ═══════════════════════════════════════════════════════
   i18n SETUP — Multi-language support for Dischordian Saga

   Uses i18next with react-i18next for React integration.
   Namespaces: ui, npc, lore, game, quests
   Default: English (en)
   Supported: English, Spanish, French, German, Japanese
   ═══════════════════════════════════════════════════════ */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    // Namespaces for organized translations
    ns: ["translation"],
    defaultNS: "translation",
  });

export default i18n;

/** Change language and persist */
export function setLanguage(lang: string) {
  i18n.changeLanguage(lang);
  localStorage.setItem("language", lang);
}

/** Get current language */
export function getLanguage(): string {
  return i18n.language;
}

/** Available languages */
export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];
