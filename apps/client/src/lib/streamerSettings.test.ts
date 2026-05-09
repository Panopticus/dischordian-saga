import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Tests run in node environment per vitest.config.ts; stub the
// browser globals the helpers reach for. This is a real production
// bug surface — every code path in streamerSettings.ts is wrapped
// in try/catch precisely because some hosts (SSR, headless CI)
// don't have localStorage; the tests still need to verify the
// happy-path round-trips, so we stand up a minimal in-memory
// implementation here.
class MemoryStorage implements Storage {
  private store: Record<string, string> = {};
  get length() { return Object.keys(this.store).length; }
  clear() { this.store = {}; }
  getItem(key: string) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
  key(i: number) { return Object.keys(this.store)[i] ?? null; }
  removeItem(key: string) { delete this.store[key]; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
}
const memoryStorage = new MemoryStorage();
(globalThis as { localStorage?: Storage }).localStorage = memoryStorage;
(globalThis as { window?: Window & typeof globalThis }).window =
  (globalThis as unknown as Window & typeof globalThis);
// Minimal CustomEvent + dispatch shim so setX() doesn't blow up.
class FakeCustomEvent<T> {
  type: string; detail: T;
  constructor(type: string, init: { detail: T }) { this.type = type; this.detail = init.detail; }
}
(globalThis as { CustomEvent?: typeof FakeCustomEvent }).CustomEvent = FakeCustomEvent;
(window as unknown as { dispatchEvent: (e: unknown) => boolean }).dispatchEvent = () => true;
import {
  STREAMER_KEYS,
  getVoVolume,
  setVoVolume,
  getSfxMuteList,
  setSfxMuteList,
  isSfxMuted,
  getBlurPauseMenu,
  setBlurPauseMenu,
  getNarrativeAnimSpeed,
  setNarrativeAnimSpeed,
  NARRATIVE_ANIM_SPEED_BOUNDS,
} from "./streamerSettings";

describe("streamerSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("voVolume (Strm1)", () => {
    it("defaults to 1.0", () => {
      expect(getVoVolume()).toBe(1.0);
    });
    it("clamps below 0", () => {
      setVoVolume(-0.5);
      expect(getVoVolume()).toBe(0);
    });
    it("clamps above 1", () => {
      setVoVolume(2);
      expect(getVoVolume()).toBe(1);
    });
    it("round-trips via localStorage", () => {
      setVoVolume(0.4);
      expect(localStorage.getItem(STREAMER_KEYS.voVolume)).toBe("0.4");
      expect(getVoVolume()).toBe(0.4);
    });
    it("falls back to default on a non-numeric persisted value", () => {
      localStorage.setItem(STREAMER_KEYS.voVolume, "not-a-number");
      expect(getVoVolume()).toBe(1.0);
    });
    it("dispatches change event on set", () => {
      setVoVolume(0.5);
      expect(window.dispatchEvent).toHaveBeenCalled();
    });
  });

  describe("sfxMuteList (Strm8)", () => {
    it("defaults to empty", () => {
      expect(getSfxMuteList()).toEqual([]);
    });
    it("round-trips an array", () => {
      setSfxMuteList(["casino_jackpot", "achievement"]);
      expect(getSfxMuteList()).toEqual(["casino_jackpot", "achievement"]);
    });
    it("isSfxMuted reflects the list", () => {
      setSfxMuteList(["casino_jackpot"]);
      expect(isSfxMuted("casino_jackpot")).toBe(true);
      expect(isSfxMuted("button_click")).toBe(false);
    });
    it("treats malformed JSON as empty", () => {
      localStorage.setItem(STREAMER_KEYS.sfxMuteList, "{not-json");
      expect(getSfxMuteList()).toEqual([]);
    });
    it("strips non-string entries defensively", () => {
      localStorage.setItem(STREAMER_KEYS.sfxMuteList, JSON.stringify(["good", 42, null, "also_good"]));
      expect(getSfxMuteList()).toEqual(["good", "also_good"]);
    });
  });

  describe("blurPauseMenu (Strm2)", () => {
    it("defaults to false", () => {
      expect(getBlurPauseMenu()).toBe(false);
    });
    it("round-trips boolean true", () => {
      setBlurPauseMenu(true);
      expect(getBlurPauseMenu()).toBe(true);
    });
    it("round-trips boolean false", () => {
      setBlurPauseMenu(true);
      setBlurPauseMenu(false);
      expect(getBlurPauseMenu()).toBe(false);
    });
  });

  describe("narrativeAnimSpeed (Strm4)", () => {
    it("defaults to 1.0", () => {
      expect(getNarrativeAnimSpeed()).toBe(1.0);
    });
    it("clamps below the floor", () => {
      setNarrativeAnimSpeed(0.1);
      expect(getNarrativeAnimSpeed()).toBe(NARRATIVE_ANIM_SPEED_BOUNDS.min);
    });
    it("clamps above the ceiling", () => {
      setNarrativeAnimSpeed(5);
      expect(getNarrativeAnimSpeed()).toBe(NARRATIVE_ANIM_SPEED_BOUNDS.max);
    });
    it("accepts mid-range values", () => {
      setNarrativeAnimSpeed(1.5);
      expect(getNarrativeAnimSpeed()).toBe(1.5);
    });
    it("falls back to default on a non-numeric persisted value", () => {
      localStorage.setItem(STREAMER_KEYS.narrativeAnimSpeed, "fast");
      expect(getNarrativeAnimSpeed()).toBe(1.0);
    });

    it("exposes documented bounds", () => {
      expect(NARRATIVE_ANIM_SPEED_BOUNDS).toEqual({ min: 0.5, max: 2.0, default: 1.0 });
    });
  });
});
