import { describe, it, expect } from "vitest";

import { makeAssetManifest } from "../_assetManifest";

const CDN_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

interface Entry {
  assetId: string;
  bucket: "a" | "b";
  relPath: string;
}

const ENTRIES: readonly Entry[] = [
  { assetId: "alpha", bucket: "a", relPath: "art/test/alpha.webp" },
  { assetId: "beta", bucket: "b", relPath: "art/test/beta.webp" },
  { assetId: "gamma", bucket: "a", relPath: "art/test/gamma.webp" },
];

describe("makeAssetManifest", () => {
  const m = makeAssetManifest(ENTRIES, "assetId", "relPath");

  it("preserves the entries array reference (no copy)", () => {
    expect(m.entries).toBe(ENTRIES);
  });

  it("byId resolves each entry by id", () => {
    expect(m.byId.get("alpha")).toBe(ENTRIES[0]);
    expect(m.byId.get("beta")).toBe(ENTRIES[1]);
    expect(m.byId.get("missing")).toBeUndefined();
  });

  it("urlOf returns the assetUrl-resolved CDN URL for a known id", () => {
    expect(m.urlOf("alpha")).toBe(`${CDN_PREFIX}art/test/alpha.webp`);
    expect(m.urlOf("gamma")).toBe(`${CDN_PREFIX}art/test/gamma.webp`);
  });

  it("urlOf returns undefined for unknown / falsy ids", () => {
    expect(m.urlOf("nope")).toBeUndefined();
    expect(m.urlOf(undefined)).toBeUndefined();
    expect(m.urlOf("")).toBeUndefined();
  });

  it("requireUrl throws on missing ids with the field name in the message", () => {
    expect(() => m.requireUrl("nope")).toThrow(/assetId.*nope/);
  });

  it("requireUrl returns the URL for a known id", () => {
    expect(m.requireUrl("beta")).toBe(`${CDN_PREFIX}art/test/beta.webp`);
  });

  it("byField returns the subset matching the predicate", () => {
    const aBucket = m.byField("bucket", "a");
    expect(aBucket).toHaveLength(2);
    expect(aBucket.map((e) => e.assetId).sort()).toEqual(["alpha", "gamma"]);
    expect(m.byField("bucket", "b")).toHaveLength(1);
  });

  it("total reflects the entries length", () => {
    expect(m.total).toBe(3);
  });
});
