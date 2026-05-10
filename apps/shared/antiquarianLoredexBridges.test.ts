import { describe, expect, it } from "vitest";
import {
  ANTIQUARIAN_BRIDGE_ENTRIES,
  getAntiquarianBridge,
  pendingAntiquarianBridge,
  antiquarianBridgesComplete,
} from "./antiquarianLoredexBridges";

describe("antiquarianLoredexBridges", () => {
  it("ships exactly five between-act entries", () => {
    expect(ANTIQUARIAN_BRIDGE_ENTRIES).toHaveLength(5);
  });

  it("entries are in canonical Act 1 → Act 5 order, gated on act_N_complete flags", () => {
    const triggers = ANTIQUARIAN_BRIDGE_ENTRIES.map((e) => e.triggerFlag);
    expect(triggers).toEqual([
      "act_1_complete",
      "act_2_complete",
      "act_3_complete",
      "act_4_complete",
      "act_5_complete",
    ]);
  });

  it("every entry has a non-empty title and a substantial body", () => {
    for (const entry of ANTIQUARIAN_BRIDGE_ENTRIES) {
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(entry.body.trim().length).toBeGreaterThan(200);
    }
  });

  it("every entry uses the Antiquarian's canonical determinism frame", () => {
    // "I had read this page already" + variants are his signature.
    // Not every entry needs the exact phrase, but at least one must.
    const allBodies = ANTIQUARIAN_BRIDGE_ENTRIES.map((e) => e.body).join(" ");
    expect(allBodies.toLowerCase()).toContain("i had read this page");
  });

  it("trigger and seen flags are unique across all 5 entries", () => {
    const triggers = ANTIQUARIAN_BRIDGE_ENTRIES.map((e) => e.triggerFlag);
    const seens = ANTIQUARIAN_BRIDGE_ENTRIES.map((e) => e.seenFlag);
    expect(new Set(triggers).size).toBe(triggers.length);
    expect(new Set(seens).size).toBe(seens.length);
    for (const seen of seens) expect(triggers).not.toContain(seen);
  });

  it("getAntiquarianBridge returns each entry by id", () => {
    expect(getAntiquarianBridge("antiq_bridge_act_1_close")?.entryNumber).toMatch(
      /18,431/,
    );
    expect(getAntiquarianBridge("antiq_bridge_act_5_close")?.entryNumber).toMatch(
      /18,435/,
    );
  });

  describe("pendingAntiquarianBridge", () => {
    it("returns null when nothing has triggered", () => {
      expect(pendingAntiquarianBridge(new Set())).toBeNull();
    });

    it("returns the first triggered-but-unseen entry in canonical order", () => {
      const flags = new Set(["act_1_complete", "act_2_complete"]);
      expect(pendingAntiquarianBridge(flags)?.id).toBe(
        "antiq_bridge_act_1_close",
      );
    });

    it("skips entries whose seenFlag is already set", () => {
      const flags = new Set([
        "act_1_complete",
        "antiq_bridge_act_1_close_seen",
        "act_2_complete",
      ]);
      expect(pendingAntiquarianBridge(flags)?.id).toBe(
        "antiq_bridge_act_2_close",
      );
    });

    it("returns null when every triggered entry has been seen", () => {
      const flags = new Set([
        "act_1_complete",
        "antiq_bridge_act_1_close_seen",
      ]);
      expect(pendingAntiquarianBridge(flags)).toBeNull();
    });
  });

  describe("antiquarianBridgesComplete", () => {
    it("returns false when fewer than 5 entries have been read", () => {
      expect(antiquarianBridgesComplete(new Set())).toBe(false);
      expect(
        antiquarianBridgesComplete(
          new Set([
            "antiq_bridge_act_1_close_seen",
            "antiq_bridge_act_2_close_seen",
            "antiq_bridge_act_3_close_seen",
            "antiq_bridge_act_4_close_seen",
          ]),
        ),
      ).toBe(false);
    });

    it("returns true once all 5 entries have been read", () => {
      const flags = new Set([
        "antiq_bridge_act_1_close_seen",
        "antiq_bridge_act_2_close_seen",
        "antiq_bridge_act_3_close_seen",
        "antiq_bridge_act_4_close_seen",
        "antiq_bridge_act_5_close_seen",
      ]);
      expect(antiquarianBridgesComplete(flags)).toBe(true);
    });
  });
});
