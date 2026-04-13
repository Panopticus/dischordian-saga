/* ═══════════════════════════════════════════════════════
   i18n SETUP — Multi-language support for Dischordian Saga

   Uses i18next with react-i18next for React integration.
   Namespaces: common, game, narrative, ui
   Default: English (en)
   Supported: English, Spanish, French, German, Japanese

   This barrel file re-exports from config.ts for backward
   compatibility — existing `import "./i18n"` calls still work.
   ═══════════════════════════════════════════════════════ */
export {
  default,
  getLanguage,
  LANGUAGES,
  setLanguage,
} from "./config";
export { DEFAULT_NS, NAMESPACES } from "./config";
export type { Namespace } from "./config";
