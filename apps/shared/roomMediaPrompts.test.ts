import { describe, expect, it } from "vitest";

import {
  ROOM_MEDIA_PROMPTS,
  ROOM_MEDIA_STILLS,
  ROOM_MEDIA_STYLE_ANCHOR_IMAGE,
  ROOM_MEDIA_STYLE_ANCHOR_VIDEO,
  ROOM_MEDIA_VIDEOS,
  SHADOW_TONGUE_CORRUPTION_LAYER,
} from "./roomMediaPrompts";
import { ROOM_STATE_STYLE_ANCHOR } from "./roomStateArtPrompts";

/**
 * Catalog contract for nano-banana 2 stills + Veo 3.1 videos.
 *
 * The engine, the asset team, and the prompt author all agree through
 * this catalog. These tests stop silent drift as more rooms gain media.
 *
 * Accessibility note: §6.3b parity probe (separate test) covers the
 * cross-cutting check that no critical-path content lives in a
 * species-gated room. Here we only validate manifest shape.
 */
describe("roomMediaPrompts", () => {
  it("ships at least 28 stills + 8 videos", () => {
    expect(ROOM_MEDIA_STILLS.length).toBeGreaterThanOrEqual(28);
    expect(ROOM_MEDIA_VIDEOS.length).toBeGreaterThanOrEqual(8);
    expect(ROOM_MEDIA_PROMPTS.length).toBe(
      ROOM_MEDIA_STILLS.length + ROOM_MEDIA_VIDEOS.length,
    );
  });

  it("has no duplicate assetIds", () => {
    const ids = ROOM_MEDIA_PROMPTS.map((p) => p.assetId);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("has no duplicate outputPaths", () => {
    const paths = ROOM_MEDIA_PROMPTS.map((p) => p.outputPath);
    expect(paths.length).toBe(new Set(paths).size);
  });

  it("every entry has a non-empty prompt body of at least 200 chars", () => {
    for (const p of ROOM_MEDIA_PROMPTS) {
      expect(p.prompt.length, `assetId ${p.assetId} too short`).toBeGreaterThanOrEqual(200);
    }
  });

  it("every entry has a non-empty label and condition", () => {
    for (const p of ROOM_MEDIA_PROMPTS) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.condition.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a valid model + kind combination", () => {
    for (const p of ROOM_MEDIA_PROMPTS) {
      if (p.kind === "image") {
        expect(p.model).toBe("nano-banana-2");
      } else {
        expect(p.model).toBe("veo-3.1");
      }
    }
  });

  it("stills declare the image style-anchor dependency", () => {
    for (const p of ROOM_MEDIA_STILLS) {
      expect(p.dependencies).toContain("room_media_style_anchor_image");
    }
  });

  it("videos declare the video style-anchor dependency", () => {
    for (const p of ROOM_MEDIA_VIDEOS) {
      expect(p.dependencies).toContain("room_media_style_anchor_video");
    }
  });

  it("every still output path lives under art/rooms/", () => {
    for (const p of ROOM_MEDIA_STILLS) {
      expect(p.outputPath.startsWith("art/rooms/")).toBe(true);
      expect(p.outputPath.endsWith(".webp")).toBe(true);
    }
  });

  it("every video output path lives under art/rooms/videos/", () => {
    for (const p of ROOM_MEDIA_VIDEOS) {
      expect(p.outputPath.startsWith("art/rooms/videos/")).toBe(true);
      const ok = p.outputPath.endsWith(".webm") || p.outputPath.endsWith(".mp4");
      expect(ok, `video ${p.assetId} must end .webm or .mp4`).toBe(true);
    }
  });

  it("species-exclusive stills land in art/rooms/species/ and are P2", () => {
    const speciesRooms = new Set([
      "the_elemental_forge",
      "blood_archive",
      "probability_chamber",
      "dimensional_observatory",
      "hybrid_sanctum",
      "the_between",
    ]);
    const species = ROOM_MEDIA_PROMPTS.filter((p) => speciesRooms.has(p.roomId));
    expect(species.length).toBe(6);
    for (const p of species) {
      expect(p.priority).toBe("P2");
      expect(p.outputPath.startsWith("art/rooms/species/")).toBe(true);
      // Critical: condition must reference canAccessRoom or species gating
      expect(p.condition.toLowerCase()).toMatch(/canaccessroom|only/);
    }
  });

  it("Shadow Tongue corruption layer is referenced by every ST-flagged entry", () => {
    const stEntries = ROOM_MEDIA_PROMPTS.filter((p) =>
      p.dependencies.includes("shadow_tongue_corruption_layer"),
    );
    // We expect ST corruption to appear in at least: archives:corrupted,
    // archives:tier-fluent, comms-array:static-haunted, engineering:edited-schematics,
    // bridge:annotations-visible, shadow-vault:cell-sealed, shadow-vault:cell-released,
    // shadow-tongue:text-corruption-loop, archives:glyph-rewriting-loop,
    // comms-array:signal-discovery, shadow-vault:meeting, engineering:schematic-edit-reveal
    expect(stEntries.length).toBeGreaterThanOrEqual(10);
    for (const p of stEntries) {
      // The body should mention either the corruption layer or the indigo hue.
      const body = p.prompt.toLowerCase();
      const ok =
        body.includes("shadow tongue corruption layer") ||
        body.includes("indigo");
      expect(ok, `ST entry ${p.assetId} must reference indigo / corruption layer`).toBe(true);
    }
  });

  it("video assetIds match the engine's overlay convention", () => {
    for (const p of ROOM_MEDIA_VIDEOS) {
      // Engine expects either `<roomId>:<stateId>` or `shadow-tongue:<beat>`.
      const ok =
        p.assetId === `${p.roomId}:${p.stateId}` ||
        p.assetId.startsWith("shadow-tongue:");
      expect(ok, `video ${p.assetId} bad shape`).toBe(true);
    }
  });

  it("still assetIds follow the `<roomId>:<stateId>` contract", () => {
    for (const p of ROOM_MEDIA_STILLS) {
      expect(p.assetId).toBe(`${p.roomId}:${p.stateId}`);
    }
  });

  it("every entry has a valid priority", () => {
    for (const p of ROOM_MEDIA_PROMPTS) {
      expect(["P0", "P1", "P2"]).toContain(p.priority);
    }
  });

  it("video resolutions encode fps and duration", () => {
    for (const p of ROOM_MEDIA_VIDEOS) {
      expect(p.resolution).toMatch(/24fps/);
      expect(p.resolution).toMatch(/(loop|one-shot)/);
    }
  });

  it("style anchors are non-empty and committed to the Ark aesthetic", () => {
    expect(ROOM_MEDIA_STYLE_ANCHOR_IMAGE).toBe(ROOM_STATE_STYLE_ANCHOR);
    const v = ROOM_MEDIA_STYLE_ANCHOR_VIDEO.toLowerCase();
    expect(v).toContain("16:9");
    expect(v).toContain("24fps");
    expect(v).toContain("brass");
    // Audio must NOT be generated by Veo — engine drives audio separately.
    expect(v).toContain("audio not generated");
  });

  it("Shadow Tongue corruption layer commits to the unnameable-hue cue", () => {
    const c = SHADOW_TONGUE_CORRUPTION_LAYER.toLowerCase();
    expect(c).toContain("indigo");
    expect(c).toContain("rgb channel-shift");
    expect(c).toContain("warm-gold");
  });

  it("no entry is gated by a non-existent room (sanity: roomIds use kebab- or snake_case only)", () => {
    for (const p of ROOM_MEDIA_PROMPTS) {
      // roomId must be a single token of [a-z0-9_-]
      expect(p.roomId).toMatch(/^[a-z0-9_-]+$/);
    }
  });

  it("every condition string mentions a flag, default state, or canAccessRoom gate", () => {
    for (const p of ROOM_MEDIA_PROMPTS) {
      const c = p.condition.toLowerCase();
      const ok =
        c.includes("narrativeflag") ||
        c.includes("default state") ||
        c.includes("shadowtonguestate") ||
        c.includes("canaccessroom") ||
        c.includes("transitions") ||
        c.includes("plays") ||
        c.includes("only when") ||
        c.includes("only-room");
      expect(ok, `entry ${p.assetId} condition unclear: ${p.condition}`).toBe(true);
    }
  });
});
