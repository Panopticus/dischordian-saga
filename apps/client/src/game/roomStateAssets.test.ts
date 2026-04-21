import { describe, it, expect } from "vitest";
import {
  ROOM_STATE_ASSET_URLS,
  resolveRoomStateAsset,
  resolveRoomStateId,
} from "./roomStateAssets";

describe("roomStateAssets — variant picker", () => {
  it("cryo-bay defaults to `initial` with no flags", () => {
    expect(resolveRoomStateId("cryo-bay", {})).toBe("initial");
    expect(resolveRoomStateId("cryo-bay", undefined)).toBe("initial");
  });

  it("cryo-bay progresses through mystery states as flags land", () => {
    expect(
      resolveRoomStateId("cryo-bay", { cryo_mystery_first_clue_found: true }),
    ).toBe("investigating");
    expect(
      resolveRoomStateId("cryo-bay", {
        cryo_mystery_first_clue_found: true,
        cryo_mystery_victim_identified: true,
      }),
    ).toBe("victim-identified");
    expect(
      resolveRoomStateId("cryo-bay", {
        cryo_mystery_first_clue_found: true,
        cryo_mystery_victim_identified: true,
        cryo_case_marked_open: true,
      }),
    ).toBe("case-open-later");
  });

  it("medical-bay defaults to `initial` with no flags", () => {
    expect(resolveRoomStateId("medical-bay", {})).toBe("initial");
  });

  it("medical-bay respects device/donation branches", () => {
    expect(
      resolveRoomStateId("medical-bay", { medbay_device_awakened: true }),
    ).toBe("device-awakened");
    expect(
      resolveRoomStateId("medical-bay", { donated_dna_sample: true }),
    ).toBe("donated");
    expect(
      resolveRoomStateId("medical-bay", { refused_dna_sample: true }),
    ).toBe("refused");
  });

  it("resolveRoomStateAsset never returns null (legacy fallback)", () => {
    const url = resolveRoomStateAsset("cryo-bay", {});
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);

    const medUrl = resolveRoomStateAsset("medical-bay", {});
    expect(typeof medUrl).toBe("string");
    expect(medUrl.length).toBeGreaterThan(0);
  });

  it("registry declares every state slot so next-render-drop has a home", () => {
    expect(Object.keys(ROOM_STATE_ASSET_URLS["cryo-bay"]).sort()).toEqual(
      ["case-open-later", "initial", "investigating", "victim-identified"],
    );
    expect(Object.keys(ROOM_STATE_ASSET_URLS["medical-bay"]).sort()).toEqual(
      ["device-awakened", "donated", "initial", "refused"],
    );
  });
});
