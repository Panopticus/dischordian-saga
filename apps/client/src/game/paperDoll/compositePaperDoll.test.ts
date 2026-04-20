import { describe, expect, it } from "vitest";

import {
  compositePaperDoll,
  hasRequiredBaseLayers,
  type Loadout,
} from "./compositePaperDoll";
import { SUIT_LAYER_Z } from "@shared/suitEquipSlots";

const minimalBase: Loadout = {
  pieces: {
    "base-mask": { slot: "base-mask", artId: "base-mask:human-mask:demagi" },
    "base-suit": {
      slot: "base-suit",
      artId: "base-suit:long-coat-over-cuirass:fire",
    },
  },
};

describe("compositePaperDoll", () => {
  it("hasRequiredBaseLayers requires both base-mask and base-suit", () => {
    expect(hasRequiredBaseLayers(minimalBase)).toBe(true);
    expect(
      hasRequiredBaseLayers({ pieces: { "base-mask": minimalBase.pieces["base-mask"] } }),
    ).toBe(false);
    expect(hasRequiredBaseLayers({ pieces: {} })).toBe(false);
  });

  it("emits layers sorted by layerZ ascending", () => {
    const layers = compositePaperDoll({
      pieces: {
        ...minimalBase.pieces,
        chest: { slot: "chest", artId: "chest-art" },
        head: { slot: "head", artId: "head-art" },
        aura: { slot: "aura", artId: "aura-art" },
      },
    });
    // aura (0) < base-suit (20) < chest (25) < base-mask (48) < head (52).
    const zs = layers.map((l) => l.layerZ);
    for (let i = 1; i < zs.length; i++) {
      expect(zs[i]).toBeGreaterThanOrEqual(zs[i - 1]);
    }
    // First layer is aura.
    expect(layers[0].slot).toBe("aura");
    // Last layer is head.
    expect(layers[layers.length - 1].slot).toBe("head");
  });

  it("occludes suppresses matching lower layers but keeps the occluder", () => {
    const layers = compositePaperDoll({
      pieces: {
        ...minimalBase.pieces,
        head: {
          slot: "head",
          artId: "full-helm",
          sidecar: { occludes: ["base-mask"] },
        },
      },
    });
    const slots = layers.map((l) => l.slot);
    expect(slots).toContain("head");
    expect(slots).not.toContain("base-mask");
  });

  it("sidecar layerZ overrides SUIT_LAYER_Z", () => {
    const layers = compositePaperDoll({
      pieces: {
        ...minimalBase.pieces,
        chest: {
          slot: "chest",
          artId: "chest-hero",
          sidecar: { layerZ: 999 }, // draw on top of everything
        },
      },
    });
    const chest = layers.find((l) => l.slot === "chest")!;
    expect(chest.layerZ).toBe(999);
    // Chest should now be the last (highest-z) layer.
    expect(layers[layers.length - 1].slot).toBe("chest");
  });

  it("tintMask defaults off for identity pieces and on for tintable armor", () => {
    const layers = compositePaperDoll({
      pieces: {
        ...minimalBase.pieces,
        face: { slot: "face", artId: "face-decal" },
        chest: { slot: "chest", artId: "chest-art" },
        "ring-1": { slot: "ring-1", artId: "ring-art" },
      },
    });
    const byslot = new Map(layers.map((l) => [l.slot, l]));
    expect(byslot.get("face")!.tintMask).toBe(false);
    expect(byslot.get("ring-1")!.tintMask).toBe(false);
    expect(byslot.get("chest")!.tintMask).toBe(true);
    expect(byslot.get("base-mask")!.tintMask).toBe(false);
  });

  it("sidecar tintMask: false overrides the default", () => {
    const layers = compositePaperDoll({
      pieces: {
        ...minimalBase.pieces,
        chest: {
          slot: "chest",
          artId: "anti-tint-chest",
          sidecar: { tintMask: false },
        },
      },
    });
    expect(layers.find((l) => l.slot === "chest")!.tintMask).toBe(false);
  });

  it("uses SUIT_LAYER_Z exactly when no sidecar override is given", () => {
    const layers = compositePaperDoll({
      pieces: {
        ...minimalBase.pieces,
        back: { slot: "back", artId: "back-art" },
      },
    });
    const back = layers.find((l) => l.slot === "back")!;
    expect(back.layerZ).toBe(SUIT_LAYER_Z.back);
  });
});
