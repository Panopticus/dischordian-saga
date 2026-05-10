import { describe, expect, it } from "vitest";
import {
  LOCKE_INBOX_BRIDGES,
  getLockeInboxBridge,
  pendingLockeInboxBridge,
  resolveLockeInboxBridgeBody,
  lockeBridgesComplete,
} from "./lockeInboxBridges";

describe("lockeInboxBridges", () => {
  it("ships exactly five between-act messages", () => {
    expect(LOCKE_INBOX_BRIDGES).toHaveLength(5);
  });

  it("messages are in canonical Act 1 → Act 5 order", () => {
    const triggers = LOCKE_INBOX_BRIDGES.map((m) => m.triggerFlag);
    expect(triggers).toEqual([
      "act_1_complete",
      "act_2_complete",
      "act_3_complete",
      "act_4_complete",
      "act_5_complete",
    ]);
  });

  it("every message has a non-empty subject and substantial canonical body", () => {
    for (const entry of LOCKE_INBOX_BRIDGES) {
      expect(entry.subject.trim().length).toBeGreaterThan(0);
      expect(entry.canonicalBody.trim().length).toBeGreaterThan(200);
    }
  });

  it("every message body signs off as 'L.' (Locke's signature)", () => {
    for (const entry of LOCKE_INBOX_BRIDGES) {
      const resolved = resolveLockeInboxBridgeBody(entry, new Set());
      expect(resolved).toMatch(/—\s*L\./);
    }
  });

  it("seen flags are unique and don't collide with trigger flags", () => {
    const triggers = LOCKE_INBOX_BRIDGES.map((m) => m.triggerFlag);
    const seens = LOCKE_INBOX_BRIDGES.map((m) => m.seenFlag);
    expect(new Set(seens).size).toBe(seens.length);
    for (const seen of seens) expect(triggers).not.toContain(seen);
  });

  describe("resolveLockeInboxBridgeBody", () => {
    it("returns the canonical body when no variant matches", () => {
      const entry = getLockeInboxBridge("locke_bridge_post_act_1")!;
      const body = resolveLockeInboxBridgeBody(entry, new Set());
      expect(body).toContain("Forged Hand era");
      // Postscript appended
      expect(body).toContain("Antiquarian sent a page");
    });

    it("picks the Light variant when last_words_choice_light is set", () => {
      const entry = getLockeInboxBridge("locke_bridge_post_act_1")!;
      const body = resolveLockeInboxBridgeBody(
        entry,
        new Set(["last_words_choice_light"]),
      );
      expect(body).toContain("You picked Light");
      expect(body).not.toContain("You picked Dark");
    });

    it("picks the Dark variant when last_words_choice_dark is set", () => {
      const entry = getLockeInboxBridge("locke_bridge_post_act_1")!;
      const body = resolveLockeInboxBridgeBody(
        entry,
        new Set(["last_words_choice_dark"]),
      );
      expect(body).toContain("You picked Dark");
    });

    it("picks the path-A variant for the Act 3 bridge when act1_path_A is set", () => {
      const entry = getLockeInboxBridge("locke_bridge_post_act_3")!;
      const body = resolveLockeInboxBridgeBody(
        entry,
        new Set(["act1_path_A"]),
      );
      expect(body).toContain("disclosed everything");
    });

    it("picks the full-secret variant for the Act 3 bridge when act3_full_secret is set", () => {
      const entry = getLockeInboxBridge("locke_bridge_post_act_3")!;
      const body = resolveLockeInboxBridgeBody(
        entry,
        new Set(["act3_full_secret"]),
      );
      expect(body).toContain("kept it from her");
    });
  });

  describe("pendingLockeInboxBridge", () => {
    it("returns null when nothing has triggered", () => {
      expect(pendingLockeInboxBridge(new Set())).toBeNull();
    });

    it("returns the first triggered-but-unseen message in canonical order", () => {
      const flags = new Set(["act_1_complete", "act_2_complete"]);
      expect(pendingLockeInboxBridge(flags)?.id).toBe(
        "locke_bridge_post_act_1",
      );
    });

    it("skips messages whose seenFlag is already set", () => {
      const flags = new Set([
        "act_1_complete",
        "locke_bridge_post_act_1_seen",
        "act_2_complete",
      ]);
      expect(pendingLockeInboxBridge(flags)?.id).toBe(
        "locke_bridge_post_act_2",
      );
    });

    it("returns null when every triggered message has been seen", () => {
      const flags = new Set([
        "act_1_complete",
        "locke_bridge_post_act_1_seen",
      ]);
      expect(pendingLockeInboxBridge(flags)).toBeNull();
    });
  });

  describe("lockeBridgesComplete", () => {
    it("returns false when fewer than 5 messages have been read", () => {
      expect(lockeBridgesComplete(new Set())).toBe(false);
    });

    it("returns true once all 5 messages have been read", () => {
      const flags = new Set([
        "locke_bridge_post_act_1_seen",
        "locke_bridge_post_act_2_seen",
        "locke_bridge_post_act_3_seen",
        "locke_bridge_post_act_4_seen",
        "locke_bridge_post_act_5_seen",
      ]);
      expect(lockeBridgesComplete(flags)).toBe(true);
    });
  });
});
