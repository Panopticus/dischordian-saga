/* ═══════════════════════════════════════════════════════
   EQUIPMENT STATE HYDRATION TEST

   Covers the data path that lets crafted items actually
   show up on the paper doll after the Forge writes them
   to gameData.craftedItems:

   1. Character sheet queries citizen.getCharacter to learn
      what's currently equipped on the server side.
   2. seedEquippedItems(dbGear) hydrates the localStorage
      cache and dispatches an equipment-changed event.
   3. Any crafted item ID — previously added via crafting
      mutation to gameData.craftedItems, then equipped via
      citizen.updateGear → gear map — resolves against
      EQUIPMENT_DB and shows up in the cache with the right
      stats.

   This complements the source-level wiring tests in
   craftingRewards.test.ts and exercises the real module.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach, vi } from "vitest";

/* ─── Stub browser APIs the module expects ─── */

type StoredItem = { [key: string]: string };
const storage: StoredItem = {};

const fakeLocalStorage = {
  getItem: (k: string) => storage[k] ?? null,
  setItem: (k: string, v: string) => { storage[k] = v; },
  removeItem: (k: string) => { delete storage[k]; },
  clear: () => { for (const k of Object.keys(storage)) delete storage[k]; },
};

const dispatched: Array<{ type: string; detail: unknown }> = [];
const fakeWindow = {
  dispatchEvent: (evt: { type: string; detail: unknown }) => {
    dispatched.push({ type: evt.type, detail: evt.detail });
    return true;
  },
};

// Node's globalThis doesn't have localStorage / window / CustomEvent,
// so we wire them up before the module under test is imported. The
// equipmentState module reaches for these at call time, not load time,
// so staging them here is sufficient.
(globalThis as unknown as { localStorage: typeof fakeLocalStorage }).localStorage = fakeLocalStorage;
(globalThis as unknown as { window: typeof fakeWindow }).window = fakeWindow;
(globalThis as unknown as { CustomEvent: typeof CustomEvent }).CustomEvent = class CustomEvent<T> {
  type: string;
  detail: T;
  constructor(type: string, init?: { detail: T }) {
    this.type = type;
    this.detail = (init?.detail ?? undefined) as T;
  }
} as unknown as typeof CustomEvent;

const mod = await import("../client/src/game/equipmentState");

describe("seedEquippedItems() hydrates crafted gear", () => {
  beforeEach(() => {
    fakeLocalStorage.clear();
    dispatched.length = 0;
  });

  it("fills every slot with null when dbGear is empty", () => {
    mod.seedEquippedItems({});
    const cached = mod.getEquippedItems();
    expect(cached.weapon).toBeNull();
    expect(cached.armor).toBeNull();
    expect(cached.helm).toBeNull();
    expect(cached.secondary).toBeNull();
    expect(cached.accessory).toBeNull();
    expect(cached.consumable).toBeNull();
  });

  it("resolves a crafted weapon ID against EQUIPMENT_DB", () => {
    // phase_blade is defined in equipmentData with source: "craft"
    mod.seedEquippedItems({ weapon: "phase_blade" });
    const cached = mod.getEquippedItems();
    expect(cached.weapon).not.toBeNull();
    expect(cached.weapon?.id).toBe("phase_blade");
    expect(cached.weapon?.name).toBe("Phase Blade");
    expect(cached.weapon?.rarity).toBe("uncommon");
    expect(cached.weapon?.stats.atk).toBe(6);
  });

  it("silently drops unknown item IDs instead of crashing", () => {
    mod.seedEquippedItems({ weapon: "not_a_real_item", armor: "circuit_vest" });
    const cached = mod.getEquippedItems();
    expect(cached.weapon).toBeNull();
    expect(cached.armor?.id).toBe("circuit_vest");
  });

  it("handles every equippable slot in one pass", () => {
    mod.seedEquippedItems({
      weapon: "phase_blade",
      armor: "circuit_vest",
      helm: "void_helm",
      accessory: "data_lens",
    });
    const cached = mod.getEquippedItems();
    expect(cached.weapon?.id).toBe("phase_blade");
    expect(cached.armor?.id).toBe("circuit_vest");
    expect(cached.helm?.id).toBe("void_helm");
    expect(cached.accessory?.id).toBe("data_lens");
  });

  it("dispatches an equipment-changed event with the next state", () => {
    mod.seedEquippedItems({ weapon: "phase_blade" });
    expect(dispatched.length).toBe(1);
    expect(dispatched[0].type).toBe("equipment-changed");
    const detail = dispatched[0].detail as Record<string, { id: string } | null>;
    expect(detail.weapon?.id).toBe("phase_blade");
  });

  it("calculateTotalStats sums stats across every equipped slot", () => {
    mod.seedEquippedItems({
      weapon: "phase_blade", // atk 6
      armor: "circuit_vest", // def 3, hp 10
      helm: "void_helm",     // def 2, hp 5
    });
    const stats = mod.calculateTotalStats();
    expect(stats.totalAtk).toBe(6);
    expect(stats.totalDef).toBe(5);
    expect(stats.totalHp).toBe(15);
  });
});
