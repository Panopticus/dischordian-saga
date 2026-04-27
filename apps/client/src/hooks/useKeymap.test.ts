/**
 * Tests for the keyboard remap infrastructure (#116 chunk —
 * keyboard remap).
 *
 * The hook itself wraps two pure functions exported alongside it
 * (`matchesActionWithKeymap` + `readKeymapFromStorage`) so this test
 * file can verify the contract without React Testing Library.
 *
 *   1. Default keymap matches the schema defaults.
 *   2. `matchesActionWithKeymap` returns true for the bound key.
 *   3. `matchesActionWithKeymap` returns false for an unrelated key.
 *   4. `Escape` is an always-on fallback for `cancel`, even if the
 *      user binds `cancel` to something else.
 *   5. The Escape fallback is action-scoped (doesn't bleed into
 *      `confirm` / `skipCutscene`).
 *   6. Partial keymap saves merge with defaults (no field loss).
 *
 * Behavioral coverage of the SettingsPage `KeymapEditor` capture UI
 * is left to a future Playwright spec; the hook is the load-bearing
 * piece.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  matchesActionWithKeymap,
  readKeymapFromStorage,
  ALWAYS_ON_FALLBACKS,
} from "./useKeymap";
import { DEFAULT_SETTINGS } from "@shared/settingsSchema";

const STORAGE_KEY = "loredex-settings";

// Tiny localStorage + window shim so the readKeymapFromStorage tests
// can run under Vitest's default node environment without pulling in
// jsdom or @testing-library/react. Mirrors the subset of the API the
// hook actually uses.
type ShimStorage = { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void; clear: () => void };
function makeShim(): { storage: ShimStorage } {
  const data = new Map<string, string>();
  const storage: ShimStorage = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => { data.set(k, v); },
    removeItem: (k) => { data.delete(k); },
    clear: () => data.clear(),
  };
  return { storage };
}

const { storage } = makeShim();
// Install minimal globals if the test runner doesn't provide them.
if (typeof (globalThis as { window?: unknown }).window === "undefined") {
  (globalThis as unknown as { window: unknown }).window = { localStorage: storage };
}
if (typeof (globalThis as { localStorage?: unknown }).localStorage === "undefined") {
  (globalThis as unknown as { localStorage: ShimStorage }).localStorage = storage;
}

describe("readKeymapFromStorage", () => {
  beforeEach(() => {
    storage.clear();
  });

  it("returns schema defaults when localStorage is empty", () => {
    expect(readKeymapFromStorage()).toEqual(DEFAULT_SETTINGS.keymap);
  });

  it("merges partial keymap saves with defaults (no field loss)", () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ keymap: { skipCutscene: "KeyP" } }),
    );
    const km = readKeymapFromStorage();
    expect(km.skipCutscene).toBe("KeyP");
    expect(km.confirm).toBe(DEFAULT_SETTINGS.keymap.confirm);
    expect(km.cancel).toBe(DEFAULT_SETTINGS.keymap.cancel);
  });

  it("falls back to defaults on malformed JSON", () => {
    storage.setItem(STORAGE_KEY, "{not-json");
    expect(readKeymapFromStorage()).toEqual(DEFAULT_SETTINGS.keymap);
  });
});

describe("matchesActionWithKeymap", () => {
  const baseKeymap = DEFAULT_SETTINGS.keymap;

  it("returns true for the bound key", () => {
    expect(
      matchesActionWithKeymap(baseKeymap, "skipCutscene", { code: "Space" }),
    ).toBe(true);
    expect(
      matchesActionWithKeymap(baseKeymap, "confirm", { code: "Enter" }),
    ).toBe(true);
  });

  it("returns false for an unrelated key", () => {
    expect(
      matchesActionWithKeymap(baseKeymap, "skipCutscene", { code: "KeyX" }),
    ).toBe(false);
    expect(
      matchesActionWithKeymap(baseKeymap, "confirm", { code: "KeyZ" }),
    ).toBe(false);
  });

  it("Escape is an always-on fallback for cancel even if remapped", () => {
    const remapped = { ...baseKeymap, cancel: "KeyQ" };
    // The new binding works.
    expect(
      matchesActionWithKeymap(remapped, "cancel", { code: "KeyQ" }),
    ).toBe(true);
    // Escape ALSO works — the always-on fallback is the safety net.
    expect(
      matchesActionWithKeymap(remapped, "cancel", { code: "Escape" }),
    ).toBe(true);
  });

  it("Escape fallback does NOT bleed into other actions", () => {
    // Just because Escape cancels doesn't mean it should also count
    // as e.g. confirm or skipCutscene — the fallback table is
    // action-scoped.
    expect(
      matchesActionWithKeymap(baseKeymap, "confirm", { code: "Escape" }),
    ).toBe(false);
    expect(
      matchesActionWithKeymap(baseKeymap, "skipCutscene", { code: "Escape" }),
    ).toBe(false);
  });

  it("ALWAYS_ON_FALLBACKS includes Escape for cancel and ONLY cancel", () => {
    // Locks the safety-net contract: only `cancel` has a fallback.
    // Adding fallbacks for other actions is a future call but should
    // be deliberate.
    expect(ALWAYS_ON_FALLBACKS.cancel).toContain("Escape");
    expect(ALWAYS_ON_FALLBACKS.confirm).toBeUndefined();
    expect(ALWAYS_ON_FALLBACKS.skipCutscene).toBeUndefined();
    expect(ALWAYS_ON_FALLBACKS.openSettings).toBeUndefined();
  });
});
