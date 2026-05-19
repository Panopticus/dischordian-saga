/**
 * Parity test for the card-art well-formedness guard
 * (asset.card_art_well_formed).
 *
 * Hard parity: every non-reserved card must carry a structurally
 * valid, non-placeholder CDN art URL. A failure here means a card
 * ships a broken/placeholder reference (e.g. `…/undefined.webp`,
 * `…/PLACEHOLDER.png`, an unresolved `${…}` template, a path with
 * no asset extension). The message lists exactly which card and why.
 */
import { describe, it, expect } from "vitest";

import { checkCardArtWellFormed } from "./cardArtWellFormed";

describe("asset.card_art_well_formed", () => {
  const r = checkCardArtWellFormed();

  it("scans a non-trivial card-art surface", () => {
    expect(r.declared).toBeGreaterThan(1000);
  });

  it("never reports more implemented than declared", () => {
    expect(r.implemented).toBeLessThanOrEqual(r.declared);
    expect(r.implemented).toBeGreaterThanOrEqual(0);
  });

  it("is at hard parity — zero malformed/placeholder card art", () => {
    const gap = r.declared - r.implemented;
    expect(
      gap,
      `malformed/placeholder card art:\n${(r.missing ?? []).join("\n")}`,
    ).toBe(0);
  });
});
