/**
 * Visibility utilities — exercises the document-visibilitychange
 * subscriber pattern with a stub document.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isTabVisible, onHidden, onVisible } from "./visibility";

let stubDoc: { hidden: boolean; addEventListener: typeof document.addEventListener; removeEventListener: typeof document.removeEventListener };
let listeners: Array<() => void>;

beforeEach(() => {
  listeners = [];
  stubDoc = {
    hidden: false,
    addEventListener: ((_event: string, fn: EventListener) => {
      listeners.push(fn as () => void);
    }) as typeof document.addEventListener,
    removeEventListener: ((_event: string, fn: EventListener) => {
      const i = listeners.indexOf(fn as () => void);
      if (i >= 0) listeners.splice(i, 1);
    }) as typeof document.removeEventListener,
  };
  vi.stubGlobal("document", stubDoc);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isTabVisible", () => {
  it("returns true when document.hidden is false", () => {
    stubDoc.hidden = false;
    expect(isTabVisible()).toBe(true);
  });
  it("returns false when document.hidden is true", () => {
    stubDoc.hidden = true;
    expect(isTabVisible()).toBe(false);
  });
});

describe("onHidden / onVisible", () => {
  it("onHidden fires only when document.hidden is true", () => {
    const cb = vi.fn();
    onHidden(cb);
    stubDoc.hidden = false;
    listeners[0]();
    expect(cb).not.toHaveBeenCalled();
    stubDoc.hidden = true;
    listeners[0]();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("onVisible fires only when document.hidden is false", () => {
    const cb = vi.fn();
    onVisible(cb);
    stubDoc.hidden = true;
    listeners[0]();
    expect(cb).not.toHaveBeenCalled();
    stubDoc.hidden = false;
    listeners[0]();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("unsubscribes cleanly", () => {
    const cb = vi.fn();
    const unsub = onHidden(cb);
    expect(listeners).toHaveLength(1);
    unsub();
    expect(listeners).toHaveLength(0);
  });
});
