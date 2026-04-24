import { describe, expect, it } from "vitest";

import {
  CIVIC_POLICIES,
  ELDRITCH_ENCOUNTERS,
  ERAS,
  FLEET_DOCTRINES,
  FLEET_UNIT_PROFILES,
  WONDERS,
} from "./tradeEmpireExpansion";
import { GALACTIC_MAP } from "./tradeEmpire";
import {
  resolveSectorArtUrl,
  tradeEmpireArtUrl,
} from "./tradeEmpireArtAssets";

/**
 * Lock the contract between canonical Trade Empire data and the
 * art prompt vault. If a wonder/era/civic/etc. references an
 * assetId that doesn't exist in the vault, the URL won't resolve
 * and the UI silently falls back — that's the bug this catches.
 */
describe("tradeEmpireArtAssets resolution", () => {
  it("every WONDER's image resolves through the vault", () => {
    for (const w of WONDERS) {
      expect(w.image).toBeTruthy();
      expect(tradeEmpireArtUrl(w.image)).toContain("/art/trade-empire/wonders/");
    }
  });

  it("every ERA's banner resolves through the vault", () => {
    for (const e of ERAS) {
      expect(e.banner).toBeTruthy();
      expect(tradeEmpireArtUrl(e.banner)).toContain("/art/trade-empire/eras/");
    }
  });

  it("every CIVIC POLICY's icon resolves through the vault", () => {
    for (const c of CIVIC_POLICIES) {
      expect(c.icon).toBeTruthy();
      expect(tradeEmpireArtUrl(c.icon)).toContain("/art/trade-empire/civics/");
    }
  });

  it("every FLEET DOCTRINE's banner resolves through the vault", () => {
    for (const d of FLEET_DOCTRINES) {
      expect(d.banner).toBeTruthy();
      expect(tradeEmpireArtUrl(d.banner)).toContain(
        "/art/trade-empire/doctrines/",
      );
    }
  });

  it("every FLEET UNIT PROFILE's silhouette resolves through the vault", () => {
    for (const p of Object.values(FLEET_UNIT_PROFILES)) {
      expect(p.silhouette).toBeTruthy();
      expect(tradeEmpireArtUrl(p.silhouette)).toContain(
        "/art/trade-empire/fleet/",
      );
    }
  });

  it("every ELDRITCH ENCOUNTER's keyArt resolves through the vault", () => {
    for (const e of ELDRITCH_ENCOUNTERS) {
      expect(e.keyArt).toBeTruthy();
      expect(tradeEmpireArtUrl(e.keyArt)).toContain(
        "/art/trade-empire/encounters/",
      );
    }
  });

  it("returns undefined for unknown / missing ids", () => {
    expect(tradeEmpireArtUrl(undefined)).toBeUndefined();
    expect(tradeEmpireArtUrl("does_not_exist")).toBeUndefined();
  });
});

describe("resolveSectorArtUrl", () => {
  it("preserves explicit image URLs on the 4 legacy sectors", () => {
    const legacyIds = [
      "free_ports",
      "terminus_core",
      "hell_gate",
      "dreamer_barrier",
    ];
    for (const id of legacyIds) {
      const sector = GALACTIC_MAP.find((s) => s.id === id);
      expect(sector).toBeDefined();
      const url = resolveSectorArtUrl(sector!);
      // legacy sectors live under art/planets/, not art/trade-empire/sectors/
      expect(url).toContain("/art/planets/");
    }
  });

  it("derives a vault URL for every other sector that has a vault prompt", () => {
    for (const sector of GALACTIC_MAP) {
      const url = resolveSectorArtUrl(sector);
      // Either resolves (legacy URL or vault URL) — never undefined for any
      // sector in GALACTIC_MAP, because Phase 1 ships 100% sector coverage.
      expect(url).toBeTruthy();
    }
  });

  it("handles a sector that has no image and no vault prompt by returning undefined", () => {
    const url = resolveSectorArtUrl({ id: "fake_unknown_sector" });
    expect(url).toBeUndefined();
  });
});
