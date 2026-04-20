import { describe, expect, it } from "vitest";

import {
  BASE_LOCKED_SLOTS,
  LEGACY_SLOT_ALIAS,
  SUIT_EQUIP_SLOT_ORDER,
  SUIT_LAYER_Z,
  isBaseLocked,
  resolveSuitSlot,
} from "./suitEquipSlots";

describe("suitEquipSlots taxonomy", () => {
  it("enumerates the §G.1 set of 18 slots (16 gameplay + 2 base-locked — all in one union)", () => {
    // §G.1 lists 16 gameplay slots. Our ordered list includes the
    // locked base-mask + base-suit underlayer too.
    expect(SUIT_EQUIP_SLOT_ORDER.length).toBe(18);
    expect(new Set(SUIT_EQUIP_SLOT_ORDER).size).toBe(18);
  });

  it("every slot has a defined layerZ", () => {
    for (const slot of SUIT_EQUIP_SLOT_ORDER) {
      expect(SUIT_LAYER_Z[slot]).toBeTypeOf("number");
    }
  });

  it("aura is drawn behind everything (lowest z)", () => {
    const minZ = Math.min(...Object.values(SUIT_LAYER_Z));
    expect(SUIT_LAYER_Z.aura).toBe(minZ);
  });

  it("weapon-primary is drawn in front of the body (highest z)", () => {
    const maxZ = Math.max(...Object.values(SUIT_LAYER_Z));
    expect(SUIT_LAYER_Z["weapon-primary"]).toBe(maxZ);
  });

  it("base-mask and base-suit are the only locked slots", () => {
    expect(BASE_LOCKED_SLOTS.size).toBe(2);
    expect(isBaseLocked("base-mask")).toBe(true);
    expect(isBaseLocked("base-suit")).toBe(true);
    expect(isBaseLocked("chest")).toBe(false);
  });

  it("legacy slot ids alias into their §G.1 counterparts", () => {
    expect(LEGACY_SLOT_ALIAS.helm).toBe("head");
    expect(LEGACY_SLOT_ALIAS.armor).toBe("chest");
    expect(LEGACY_SLOT_ALIAS.weapon).toBe("weapon-primary");
    expect(LEGACY_SLOT_ALIAS.secondary).toBe("weapon-offhand");
    expect(LEGACY_SLOT_ALIAS.accessory).toBe("ring-1");
    // Consumable has no paper-doll visual — must NOT be aliased.
    expect("consumable" in LEGACY_SLOT_ALIAS).toBe(false);
  });

  it("resolveSuitSlot passes through 16-slot ids", () => {
    expect(resolveSuitSlot("head")).toBe("head");
    expect(resolveSuitSlot("weapon-primary")).toBe("weapon-primary");
  });

  it("resolveSuitSlot translates legacy ids", () => {
    expect(resolveSuitSlot("helm")).toBe("head");
    expect(resolveSuitSlot("armor")).toBe("chest");
  });

  it("resolveSuitSlot returns null for slots with no visual", () => {
    expect(resolveSuitSlot("consumable")).toBeNull();
    expect(resolveSuitSlot("made-up-slot")).toBeNull();
  });
});
