import { describe, expect, it } from "vitest";

import {
  ROOM_MYSTERY_REGISTRY,
  getRoomMysteryModule,
  resolveVerbResponse,
} from "./index";

describe("roomMysteries registry", () => {
  it("registers cryo-bay and medical-bay", () => {
    expect(getRoomMysteryModule("cryo-bay")).not.toBeNull();
    expect(getRoomMysteryModule("medical-bay")).not.toBeNull();
  });

  it("returns null for unknown room ids", () => {
    expect(getRoomMysteryModule("not-a-room")).toBeNull();
  });

  it("each registered module's roomId matches its key", () => {
    for (const [key, mod] of Object.entries(ROOM_MYSTERY_REGISTRY)) {
      expect(mod.roomId).toBe(key);
    }
  });

  it("dispatches a Look on cryo-bay's dead-pod through the registry", () => {
    const mod = getRoomMysteryModule("cryo-bay")!;
    const r = resolveVerbResponse(mod, "look", "dead-pod");
    expect(r).not.toBeNull();
    expect(r!.setsFlag).toBe("cryo_mystery_first_clue_found");
  });

  it("dispatches a Look on medical-bay's dna-helix through the registry", () => {
    const mod = getRoomMysteryModule("medical-bay")!;
    const r = resolveVerbResponse(mod, "look", "dna-helix");
    expect(r).not.toBeNull();
    expect(r!.setsFlag).toBe("medbay_first_clue_found");
  });

  it("returns null for unauthored (verb, hotspot) pairs", () => {
    const mod = getRoomMysteryModule("medical-bay")!;
    expect(resolveVerbResponse(mod, "talk", "medicine-cabinet")).toBeNull();
  });
});
