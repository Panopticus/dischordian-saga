import { describe, it, expect } from "vitest";
import {
  ROOM_STATE_ASSET_URLS,
  ROOM_VIDEO_OVERLAY_URLS,
  resolveRoomBackgroundUrl,
  resolveRoomStateAsset,
  resolveRoomStateId,
  resolveRoomVideoOverlay,
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

    it("bridge resolves to tier-aware art URLs at each tier", () => {
      // Tier 0 (no flags)
      expect(resolveRoomBackgroundUrl("bridge", {}, LEGACY)).toContain(
        "bridge_t0.webp",
      );
      // Tier 1 (clue logged) — Tier 1 art intentionally absent;
      // resolver falls back DOWN to Tier 0 art.
      expect(
        resolveRoomBackgroundUrl(
          "bridge",
          { bridge_first_clue_found: true },
          LEGACY,
        ),
      ).toContain("bridge_t0.webp");
      // Tier 2 (nav puzzle solved)
      expect(
        resolveRoomBackgroundUrl(
          "bridge",
          { fast_travel_unlocked: true },
          LEGACY,
        ),
      ).toContain("bridge_t2.webp");
      // Tier 3 (war table online)
      expect(
        resolveRoomBackgroundUrl(
          "bridge",
          { bridge_war_table_online: true },
          LEGACY,
        ),
      ).toContain("bridge_t3.webp");
    });

    it("engineering resolves to tier-aware art URLs at each tier", () => {
      expect(resolveRoomBackgroundUrl("engineering", {}, LEGACY)).toContain(
        "engineering_t0.webp",
      );
      expect(
        resolveRoomBackgroundUrl(
          "engineering",
          { engineering_signal_booster_built: true },
          LEGACY,
        ),
      ).toContain("engineering_t2.webp");
      expect(
        resolveRoomBackgroundUrl(
          "engineering",
          { engineering_research_bench_online: true },
          LEGACY,
        ),
      ).toContain("engineering_t3.webp");
    });

    it("returns the legacy URL for rooms without tier art registered", () => {
      // Medical bay has its own Section F flow; archives / armory / etc.
      // have no tier art registered and must fall through to legacy.
      expect(resolveRoomBackgroundUrl("archives", {}, LEGACY)).toBe(LEGACY);
      expect(resolveRoomBackgroundUrl("armory", {}, LEGACY)).toBe(LEGACY);
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

  describe("video overlays — Veo 3.1", () => {
    it("registers overlays for the high-narrative rooms from roomMediaPrompts.ts", () => {
      expect(Object.keys(ROOM_VIDEO_OVERLAY_URLS)).toEqual(
        expect.arrayContaining([
          "archives",
          "bridge",
          "comms-array",
          "cryo-bay",
          "engineering",
          "observation-deck",
          "shadow-vault",
        ]),
      );
    });

    it("every overlay URL ends with .webm or .mp4", () => {
      for (const entries of Object.values(ROOM_VIDEO_OVERLAY_URLS)) {
        for (const { overlay } of entries) {
          const ok =
            overlay.url.endsWith(".webm") || overlay.url.endsWith(".mp4");
          expect(ok, `bad overlay url: ${overlay.url}`).toBe(true);
        }
      }
    });

    it("every overlay (loop or one-shot) ships as .mp4 — Veo 3.1 native output", () => {
      // The 2026-04-30 asset drop forwards Veo's mp4 verbatim for
      // both loops and one-shots; the runtime reads `kind`, not
      // extension, to decide playback semantics.
      for (const entries of Object.values(ROOM_VIDEO_OVERLAY_URLS)) {
        for (const { overlay } of entries) {
          expect(
            overlay.url.endsWith(".mp4"),
            `overlay should be .mp4: ${overlay.url}`,
          ).toBe(true);
        }
      }
    });

    it("archives glyph-rewriting-loop is registered as a loop", () => {
      const entries = ROOM_VIDEO_OVERLAY_URLS.archives;
      const glyph = entries?.find((e) => e.stateId === "glyph-rewriting-loop");
      expect(glyph?.overlay.kind).toBe("loop");
    });

    it("returns null for an unregistered room", () => {
      expect(resolveRoomVideoOverlay("not-a-room", {})).toBeNull();
    });

    it("returns null when no flags match for a registered room", () => {
      expect(resolveRoomVideoOverlay("archives", {})).toBeNull();
    });

    it("matches archives glyph-rewriting-loop on shadow_tongue_corruption_seen", () => {
      const overlay = resolveRoomVideoOverlay("archives", {
        shadow_tongue_corruption_seen: true,
      });
      expect(overlay).not.toBeNull();
      expect(overlay!.kind).toBe("loop");
      expect(overlay!.url).toContain("archives_glyph_rewriting_loop.mp4");
    });

    it("matches bridge fast-travel-unlocked one-shot", () => {
      const overlay = resolveRoomVideoOverlay("bridge", {
        fast_travel_unlocked: true,
      });
      expect(overlay).not.toBeNull();
      expect(overlay!.kind).toBe("one-shot");
      expect(overlay!.url).toContain("bridge_fast_travel_unlocked.mp4");
    });

    it("matches comms-array signal-discovery on shadow_tongue_voice_heard", () => {
      const overlay = resolveRoomVideoOverlay("comms-array", {
        shadow_tongue_voice_heard: true,
      });
      expect(overlay).not.toBeNull();
      expect(overlay!.url).toContain("comms_array_signal_discovery.mp4");
    });

    it("matches engineering schematic-edit-reveal", () => {
      const overlay = resolveRoomVideoOverlay("engineering", {
        shadow_tongue_engineering_edits_seen: true,
      });
      expect(overlay).not.toBeNull();
      expect(overlay!.url).toContain("engineering_schematic_edit_reveal.mp4");
    });

    it("matches observation-deck bond-resonance-pulse loop", () => {
      const overlay = resolveRoomVideoOverlay("observation-deck", {
        first_bond_resonance: true,
      });
      expect(overlay).not.toBeNull();
      expect(overlay!.kind).toBe("loop");
    });

    it("matches shadow-vault meeting on shadow_tongue_face_to_face", () => {
      const overlay = resolveRoomVideoOverlay("shadow-vault", {
        shadow_tongue_face_to_face: true,
      });
      expect(overlay).not.toBeNull();
      expect(overlay!.url).toContain("shadow_vault_meeting.mp4");
    });
  });
});
