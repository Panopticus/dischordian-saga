/**
 * Unit tests for the suit-art URL resolver. The renderer
 * (PaperDollBG3.tsx) is covered by a source-shape test; these
 * are the pure-function guarantees the renderer relies on.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { assetUrl } from "@/lib/assetUrl";
import { parseSuitPieceArtId, suitArtUrl } from "./suitArt";
import { pieceId } from "@shared/suitSets";

describe("suitArtUrl", () => {
  it("emits the canonical /art/suits/<set>/<rarity>/<slot>.png path", () => {
    expect(suitArtUrl("the-mourners-coat", "common", "chest")).toBe(
      assetUrl("art/suits/the-mourners-coat/common/chest.png"),
    );
    expect(suitArtUrl("the-first-chassis", "legendary", "weapon-primary")).toBe(
      assetUrl("art/suits/the-first-chassis/legendary/weapon-primary.png"),
    );
  });

  it("percent-encodes the set id to stay URL-safe", () => {
    // Defensive — set ids in the roster are slug-safe today, but the
    // encoder protects us if anyone later adds a space or unusual char.
    expect(suitArtUrl("odd set", "rare", "head")).toBe(
      assetUrl("art/suits/odd%20set/rare/head.png"),
    );
  });
});

describe("parseSuitPieceArtId", () => {
  it("parses artIds produced by pieceId() round-trip clean", () => {
    const id = pieceId("the-mourners-coat", "epic", "shoulders");
    const parsed = parseSuitPieceArtId(id);
    expect(parsed).toEqual({
      setId: "the-mourners-coat",
      rarity: "epic",
      slot: "shoulders",
    });
  });

  it("routes starter mask sentinels to the matching species/foundation set", () => {
    // Humanity foundation + human motif → Mourner's Coat.
    expect(parseSuitPieceArtId("mask:human-mask:human")).toEqual({
      setId: "the-mourners-coat",
      rarity: "common",
      slot: "head",
    });
    // Machine foundation + human motif → First Chassis (sculpt fallback).
    expect(parseSuitPieceArtId("mask:machine-head:human")).toEqual({
      setId: "the-mourners-coat",
      rarity: "common",
      slot: "head",
    });
    // Species motif takes precedence over sculpt.
    expect(parseSuitPieceArtId("mask:human-mask:demagi")).toEqual({
      setId: "arcane-rune-regalia",
      rarity: "common",
      slot: "head",
    });
    expect(parseSuitPieceArtId("mask:machine-head:quarchon")).toEqual({
      setId: "clockwork-exoframe",
      rarity: "common",
      slot: "head",
    });
    expect(parseSuitPieceArtId("mask:human-mask:neyon")).toEqual({
      setId: "hybrid-vein-panoply",
      rarity: "common",
      slot: "head",
    });
  });

  it("routes starter suit sentinels to the matching class set's chest piece", () => {
    expect(parseSuitPieceArtId("suit:long-coat-over-cuirass:earth")).toEqual({
      setId: "regalia-of-the-seeing-stylus",
      rarity: "common",
      slot: "chest",
    });
    expect(parseSuitPieceArtId("suit:segmented-workshop-rig:fire")).toEqual({
      setId: "pressure-loom-harness",
      rarity: "common",
      slot: "chest",
    });
    expect(parseSuitPieceArtId("suit:plated-harness:water")).toEqual({
      setId: "bulwark-of-the-eighth-column",
      rarity: "common",
      slot: "chest",
    });
  });

  it("returns null for starter sentinels with unknown components", () => {
    expect(parseSuitPieceArtId("mask:bad-sculpt:bad-motif")).toBeNull();
    expect(parseSuitPieceArtId("suit:bad-cut:fire")).toBeNull();
  });

  it("rejects ids with the wrong component count", () => {
    expect(parseSuitPieceArtId("only-two:parts")).toBeNull();
    expect(parseSuitPieceArtId("a:b:c:d")).toBeNull();
    expect(parseSuitPieceArtId("")).toBeNull();
  });
});

describe("PaperDollBG3 wiring (source shape)", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "..", "..", "components", "PaperDollBG3.tsx"),
    "utf-8",
  );

  it("uses ResponsiveImage to pick up the .webp siblings automatically", () => {
    expect(src).toContain('import ResponsiveImage from "@/components/ResponsiveImage"');
    expect(src).toMatch(/<ResponsiveImage\b/);
  });

  it("resolves paths through suitArtUrl()", () => {
    expect(src).toContain("suitArtUrl");
    expect(src).toContain('from "@/game/paperDoll/suitArt"');
  });

  it("falls back to PlaceholderRect on non-suit artIds or image failure", () => {
    expect(src).toContain("parseSuitPieceArtId");
    expect(src).toContain("PlaceholderRect");
    expect(src).toContain("setImgFailed");
    expect(src).toMatch(/onError=\{?\(\)?\s*=>?\s*setImgFailed/);
  });

  it("keeps DRESSUP_V2 off by default and only reads an opt-in signal", () => {
    expect(src).toContain("isDressupV2Enabled");
    expect(src).toContain('localStorage.getItem("DRESSUP_V2")');
    expect(src).toContain("VITE_DRESSUP_V2");
  });
});
