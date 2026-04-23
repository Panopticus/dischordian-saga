/**
 * settingsSync.ts — Cloud sync manager for player settings
 *
 * Reads from localStorage, writes to both localStorage and server.
 * On login, merges server settings with local (server wins for conflicts,
 * local wins for new fields). Debounces server writes (500ms) to avoid
 * spamming on slider drags.
 */
import { settingsSchema, DEFAULT_SETTINGS, type GameSettings } from "@shared/settingsSchema";
import { trpc } from "./trpc";

const STORAGE_KEY = "loredex-settings";

// ─── Local Storage Helpers ───

/**
 * Load settings from localStorage, merged with defaults.
 * Always returns a complete GameSettings object.
 */
export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(saved);
    const result = settingsSchema.safeParse({ ...DEFAULT_SETTINGS, ...parsed });
    return result.success ? result.data : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Write settings to localStorage and apply DOM-level accessibility classes.
 */
function writeLocal(settings: GameSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  applySettingsToDOM(settings);
}

/**
 * Apply accessibility / display settings to the document root.
 */
function applySettingsToDOM(settings: GameSettings): void {
  const root = document.documentElement;
  root.classList.toggle("high-contrast", settings.highContrast);
  root.classList.toggle("reduce-motion", settings.reduceMotion);
  root.classList.toggle("dyslexia-font", settings.dyslexiaFont);
  root.classList.toggle("reduce-glow", settings.reduceGlow);
  root.classList.remove("font-size-small", "font-size-medium", "font-size-large");
  root.classList.add(`font-size-${settings.fontSize}`);

  // Motion intensity → CSS custom property. Zero out when reduceMotion is on
  // so every consumer that multiplies by --motion-intensity collapses cleanly.
  const intensity = settings.reduceMotion ? 0 : settings.motionIntensity;
  root.style.setProperty("--motion-intensity", String(intensity));

  // Audio-reactive toggle → class on <html>. Consumers gate FX on :root:not(.audio-reactive-off).
  root.classList.toggle("audio-reactive-off", !settings.audioReactive);

  // Captions toggle + typewriter pacing. Both exposed at the :root level
  // so downstream components can read them without threading props
  // through providers. The class pattern matches reduce-motion so
  // consumers already familiar with the convention pick it up.
  root.classList.toggle("captions-on", settings.captions);
  root.style.setProperty("--typewriter-speed-ms", String(settings.typewriterSpeed));
}

// ─── Debounced Server Sync ───

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSettings: Partial<GameSettings> | null = null;
let trpcClient: ReturnType<typeof trpc.useUtils> | null = null;

/**
 * Initialize the sync manager with a tRPC utils reference.
 * Call this once from a React component (e.g., SettingsPage or App).
 */
export function initSync(utils: ReturnType<typeof trpc.useUtils>): void {
  trpcClient = utils;
}

/**
 * Queue a server write. Debounces at 500ms so rapid slider drags
 * only produce one request.
 */
function queueServerSync(partial: Partial<GameSettings>): void {
  pendingSettings = { ...(pendingSettings || {}), ...partial };

  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    if (!pendingSettings) return;
    const toSend = { ...pendingSettings };
    pendingSettings = null;
    syncTimer = null;

    try {
      // Use fetch-based mutation since we may not be inside React tree
      await trpcClient?.client.settings.saveSettings.mutate(toSend);
    } catch (e) {
      // Silently fail — local storage is the source of truth for offline use
      console.warn("[settingsSync] Server sync failed, settings saved locally only:", e);
    }
  }, 500);
}

// ─── Public API ───

/**
 * Save a partial settings update. Writes immediately to localStorage
 * and queues a debounced server sync.
 */
export function saveSettings(settings: Partial<GameSettings>): void {
  const current = loadSettings();
  const merged = { ...current, ...settings };
  const validated = settingsSchema.parse(merged);
  writeLocal(validated);
  queueServerSync(settings);
}

/**
 * Pull settings from server and merge with local.
 * Server wins for conflicting fields; local wins for fields not on server.
 * Call this on login / app startup when authenticated.
 */
export async function syncFromServer(): Promise<GameSettings> {
  if (!trpcClient) {
    console.warn("[settingsSync] syncFromServer called before initSync");
    return loadSettings();
  }

  try {
    const serverSettings = await trpcClient.client.settings.getSettings.query();
    const local = loadSettings();

    // Server wins for conflicts, local fills in any fields server doesn't have
    const merged = settingsSchema.parse({ ...local, ...serverSettings });
    writeLocal(merged);
    return merged;
  } catch (e) {
    console.warn("[settingsSync] Failed to sync from server, using local settings:", e);
    return loadSettings();
  }
}

/**
 * Export current settings as a JSON string for backup.
 */
export function exportSettings(): string {
  const settings = loadSettings();
  return JSON.stringify(settings, null, 2);
}

/**
 * Import settings from a JSON string. Validates and saves both locally and to server.
 * Returns the imported settings.
 * @throws Error if JSON is invalid or doesn't match schema
 */
export function importSettings(json: string): GameSettings {
  const parsed = JSON.parse(json);
  const validated = settingsSchema.parse({ ...DEFAULT_SETTINGS, ...parsed });
  writeLocal(validated);
  queueServerSync(validated);
  return validated;
}
