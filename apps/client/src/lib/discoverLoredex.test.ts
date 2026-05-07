import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "loredex_discovered";

/* The shared vitest config runs in `node` env; stub a minimal
 * `window` with localStorage + addEventListener / dispatchEvent to
 * exercise discoverLoredexEntries without a full DOM. */
function makeStubWindow() {
  const store: Record<string, string> = {};
  const listeners: Record<string, Set<EventListener>> = {};
  const stubLocalStorage = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
  const stubWindow = {
    localStorage: stubLocalStorage,
    addEventListener: (type: string, fn: EventListener) => {
      listeners[type] = listeners[type] ?? new Set();
      listeners[type].add(fn);
    },
    removeEventListener: (type: string, fn: EventListener) => {
      listeners[type]?.delete(fn);
    },
    dispatchEvent: (ev: Event) => {
      for (const fn of listeners[ev.type] ?? []) fn(ev);
      return true;
    },
  };
  return { stubWindow, stubLocalStorage, store };
}

class StubCustomEvent<T> {
  constructor(
    public readonly type: string,
    init: { detail: T },
  ) {
    this.detail = init.detail;
  }
  detail: T;
}

describe("discoverLoredexEntries", () => {
  let cleanup: () => void;

  beforeEach(async () => {
    const { stubWindow } = makeStubWindow();
    vi.stubGlobal("window", stubWindow);
    vi.stubGlobal("CustomEvent", StubCustomEvent);
    cleanup = () => {
      vi.unstubAllGlobals();
    };
    // Re-import so the module sees the stubbed `window`.
    vi.resetModules();
  });
  afterEach(() => cleanup());

  it("writes new ids to localStorage and returns the newly-discovered list", async () => {
    const { discoverLoredexEntries } = await import("./discoverLoredex");
    const newly = discoverLoredexEntries(["song_sih_2", "song_sih_4"]);
    expect(newly).toEqual(["song_sih_2", "song_sih_4"]);
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(new Set(stored)).toEqual(new Set(["song_sih_2", "song_sih_4"]));
  });

  it("does not duplicate already-known ids", async () => {
    const { discoverLoredexEntries } = await import("./discoverLoredex");
    discoverLoredexEntries(["song_sih_2"]);
    const newly = discoverLoredexEntries(["song_sih_2", "song_sih_4"]);
    expect(newly).toEqual(["song_sih_4"]);
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(2);
  });

  it("dispatches a `loredex-discovered` event with the new ids", async () => {
    const { discoverLoredexEntries } = await import("./discoverLoredex");
    const listener = vi.fn();
    window.addEventListener("loredex-discovered", listener as EventListener);
    discoverLoredexEntries(["song_sih_24"]);
    expect(listener).toHaveBeenCalledOnce();
    const ev = listener.mock.calls[0][0] as { detail: string[] };
    expect(ev.detail).toEqual(["song_sih_24"]);
  });

  it("does not dispatch when nothing new is discovered", async () => {
    const { discoverLoredexEntries } = await import("./discoverLoredex");
    discoverLoredexEntries(["song_sih_2"]);
    const listener = vi.fn();
    window.addEventListener("loredex-discovered", listener as EventListener);
    discoverLoredexEntries(["song_sih_2"]);
    expect(listener).not.toHaveBeenCalled();
  });

  it("ignores empty-string ids", async () => {
    const { discoverLoredexEntries } = await import("./discoverLoredex");
    const newly = discoverLoredexEntries(["", "song_sih_2"]);
    expect(newly).toEqual(["song_sih_2"]);
  });
});
