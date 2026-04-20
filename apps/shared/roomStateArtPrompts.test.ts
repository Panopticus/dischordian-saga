import { describe, expect, it } from "vitest";

import {
  ROOM_STATE_ART_PROMPTS,
  ROOM_STATE_STYLE_ANCHOR,
  type RoomId,
} from "./roomStateArtPrompts";

/**
 * The room-state catalog is the contract between the prompt author
 * and the runtime variant picker (lands with Section F). These tests
 * stop silent drift as more rooms gain states.
 */
describe("roomStateArtPrompts", () => {
  it("ships 4 cryo-bay states + 4 med-bay states (8 total)", () => {
    expect(ROOM_STATE_ART_PROMPTS.length).toBe(8);
    const byRoom = new Map<RoomId, number>();
    for (const p of ROOM_STATE_ART_PROMPTS) {
      byRoom.set(p.roomId, (byRoom.get(p.roomId) ?? 0) + 1);
    }
    expect(byRoom.get("cryo-bay")).toBe(4);
    expect(byRoom.get("medical-bay")).toBe(4);
  });

  it("has no duplicate assetIds", () => {
    const ids = ROOM_STATE_ART_PROMPTS.map((p) => p.assetId);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("assetIds follow the `<roomId>:<stateId>` contract", () => {
    for (const p of ROOM_STATE_ART_PROMPTS) {
      expect(p.assetId).toBe(`${p.roomId}:${p.stateId}`);
    }
  });

  it("every prompt declares the shared style-anchor dependency", () => {
    for (const p of ROOM_STATE_ART_PROMPTS) {
      expect(p.dependencies).toContain("room_state_style_anchor");
    }
  });

  it("every prompt body is substantial (>= 300 chars)", () => {
    for (const p of ROOM_STATE_ART_PROMPTS) {
      expect(p.prompt.length).toBeGreaterThanOrEqual(300);
    }
  });

  it("cryo-bay prompts share the same room layout preamble", () => {
    const cryo = ROOM_STATE_ART_PROMPTS.filter((p) => p.roomId === "cryo-bay");
    // Every cryo state must mention the foreground pod + far-end bulkhead
    // so variants composite onto the same architecture.
    for (const p of cryo) {
      expect(p.prompt).toContain("waking-pod vantage");
      expect(p.prompt).toContain("bulkhead");
    }
  });

  it("medical-bay prompts share the same room layout preamble", () => {
    const med = ROOM_STATE_ART_PROMPTS.filter(
      (p) => p.roomId === "medical-bay",
    );
    for (const p of med) {
      expect(p.prompt).toContain("bio-bed");
      expect(p.prompt).toContain("maintenance access panel");
    }
  });

  it("medical-bay states reflect the unkempt-device beat", () => {
    const byId = new Map(
      ROOM_STATE_ART_PROMPTS.map((p) => [p.assetId, p] as const),
    );
    // The four distinct device visibility states must each be present.
    expect(byId.has("medical-bay:initial")).toBe(true);
    expect(byId.has("medical-bay:device-awakened")).toBe(true);
    expect(byId.has("medical-bay:donated")).toBe(true);
    expect(byId.has("medical-bay:refused")).toBe(true);

    // Donated state references the reward delivery.
    expect(byId.get("medical-bay:donated")!.prompt).toMatch(
      /receipt plate|reward/i,
    );
    // Refused state keeps the device concealed.
    expect(byId.get("medical-bay:refused")!.prompt.toLowerCase()).toContain(
      "closed",
    );
  });

  it("cryo-bay states cover the four Section F beats", () => {
    const ids = ROOM_STATE_ART_PROMPTS.filter(
      (p) => p.roomId === "cryo-bay",
    ).map((p) => p.stateId);
    expect(ids).toEqual(
      expect.arrayContaining([
        "initial",
        "investigating",
        "victim-identified",
        "case-open-later",
      ]),
    );
  });

  it("every condition string references a narrativeFlag or default-state cue", () => {
    for (const p of ROOM_STATE_ART_PROMPTS) {
      const c = p.condition.toLowerCase();
      expect(
        c.includes("narrativeflags") ||
          c.includes("default state") ||
          c.includes("no flag") ||
          c.includes("no investigation") ||
          c.includes("modal"),
      ).toBe(true);
    }
  });

  it("the style anchor commits to the Ark interior aesthetic", () => {
    const a = ROOM_STATE_STYLE_ANCHOR.toLowerCase();
    expect(a).toContain("brass");
    expect(a).toContain("steel");
    expect(a).toContain("16:9");
  });
});
