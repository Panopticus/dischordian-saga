import { describe, it, expect } from "vitest";
import {
  ROOM_STATE_ASSET_URLS,
  resolveRoomBackgroundUrl,
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

  it("every registered state resolves to a wired asset URL (AAA Final drop)", () => {
    for (const roomId of ["cryo-bay", "medical-bay"] as const) {
      const slots = ROOM_STATE_ASSET_URLS[roomId] as Record<string, string | null>;
      for (const [stateId, url] of Object.entries(slots)) {
        expect(url, `${roomId}:${stateId} must be wired`).toBeTruthy();
        // URL must be either a local static asset (/art/...) or an
        // https CDN URL. Reject protocol-relative and bare filenames.
        const looksLocal = url!.startsWith("/");
        const looksCdn = url!.startsWith("https://");
        expect(looksLocal || looksCdn, `${roomId}:${stateId} must be absolute or https`).toBe(true);
        expect(url!).toContain(`${roomId}_${stateId}`);
      }
    }
  });

  it("resolveRoomStateAsset returns each state's specific URL", () => {
    expect(
      resolveRoomStateAsset("cryo-bay", { cryo_mystery_first_clue_found: true }),
    ).toContain("cryo-bay_investigating");
    expect(
      resolveRoomStateAsset("medical-bay", { donated_dna_sample: true }),
    ).toContain("medical-bay_donated");
  });

  describe("resolveRoomBackgroundUrl — tier-aware entry point", () => {
    const LEGACY = "https://example.cdn/legacy-room.webp";

    it("delegates to the Section F flag-based resolver for cryo-bay", () => {
      const url = resolveRoomBackgroundUrl(
        "cryo-bay",
        { cryo_mystery_first_clue_found: true },
        LEGACY,
      );
      expect(url).toContain("cryo-bay_investigating");
    });

    it("delegates to the Section F flag-based resolver for medical-bay", () => {
      const url = resolveRoomBackgroundUrl(
        "medical-bay",
        { donated_dna_sample: true },
        LEGACY,
      );
      expect(url).toContain("medical-bay_donated");
    });

    it("returns the legacy URL for rooms without tier art registered", () => {
      // Bridge has a tier threshold declared but no tier art entry
      // yet — the resolver must fall through to the supplied legacy.
      expect(resolveRoomBackgroundUrl("bridge", {}, LEGACY)).toBe(LEGACY);
      expect(
        resolveRoomBackgroundUrl(
          "engineering",
          { engineering_first_clue_found: true },
          LEGACY,
        ),
      ).toBe(LEGACY);
    });

    it("returns the legacy URL for entirely unknown rooms", () => {
      expect(resolveRoomBackgroundUrl("not-a-room", {}, LEGACY)).toBe(LEGACY);
    });

    it("never returns null or undefined", () => {
      const url = resolveRoomBackgroundUrl("bridge", {}, LEGACY);
      expect(url).toBeTruthy();
      expect(typeof url).toBe("string");
    });
  });
});
