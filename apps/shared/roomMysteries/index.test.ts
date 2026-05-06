import { describe, expect, it } from "vitest";

import {
  ROOM_MYSTERY_REGISTRY,
  getRoomMysteryModule,
  resolveVerbResponse,
} from "./index";

describe("roomMysteries registry", () => {
  it("registers cryo-bay, medical-bay, bridge, and engineering", () => {
    expect(getRoomMysteryModule("cryo-bay")).not.toBeNull();
    expect(getRoomMysteryModule("medical-bay")).not.toBeNull();
    expect(getRoomMysteryModule("bridge")).not.toBeNull();
    expect(getRoomMysteryModule("engineering")).not.toBeNull();
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
    // medical-bay's egg-vox-neural-bridge intentionally omits Use
    // (the dna-device-offer ArkExplorerPage branch owns that path) —
    // see medicalBay.test.ts for the architectural assertion. This is
    // a canonical example of a (verb, hotspot) pair the registry
    // resolves to null on purpose so the runtime can dispatch elsewhere.
    const mod = getRoomMysteryModule("medical-bay")!;
    expect(resolveVerbResponse(mod, "use", "egg-vox-neural-bridge")).toBeNull();
  });

  it("dispatches a Look on bridge's captains-chair through the registry", () => {
    const mod = getRoomMysteryModule("bridge")!;
    const r = resolveVerbResponse(mod, "look", "captains-chair");
    expect(r).not.toBeNull();
    expect(r!.setsFlag).toBe("bridge_first_clue_found");
  });

  it("dispatches a Look on engineering's reactor-core through the registry", () => {
    const mod = getRoomMysteryModule("engineering")!;
    const r = resolveVerbResponse(mod, "look", "reactor-core");
    expect(r).not.toBeNull();
    expect(r!.setsFlag).toBe("engineering_first_clue_found");
  });
});
