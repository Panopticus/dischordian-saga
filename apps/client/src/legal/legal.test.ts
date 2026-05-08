/**
 * Legal-text invariants — verifies the markdown policies stay aligned
 * with the server-side CURRENT_AGREEMENT_VERSIONS, the canonical
 * vendor list at docs/legal/VENDORS.md, and the structural clauses
 * each policy is required to contain.
 *
 * Why these checks exist: the prior pages drifted into materially
 * incorrect prose (Google-only when we use 3 OAuth providers,
 * "anonymous analytics" when the schema is pseudonymous, version
 * date mismatch with the server). These assertions are cheap CI
 * tripwires for the same class of drift.
 */
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

import { CURRENT_AGREEMENT_VERSIONS } from "../../../server/routers/account";

const REPO_ROOT = path.resolve(__dirname, "../../../..");
const LEGAL_DIR = path.join(REPO_ROOT, "apps/client/src/legal");
const VENDORS_PATH = path.join(REPO_ROOT, "docs/legal/VENDORS.md");

const VERSION_RE = /<!--\s*version:\s*([\d-]+)\s*-->/;

function readPolicy(name: "privacy" | "terms" | "cookies"): string {
  return fs.readFileSync(path.join(LEGAL_DIR, `${name}.md`), "utf8");
}

function parseVersion(raw: string): string | null {
  return raw.match(VERSION_RE)?.[1] ?? null;
}

describe("Legal markdown — file presence and minimum size", () => {
  for (const name of ["privacy", "terms", "cookies"] as const) {
    it(`${name}.md exists and is substantial`, () => {
      const raw = readPolicy(name);
      expect(raw.length).toBeGreaterThan(500);
    });
  }
});

describe("Legal markdown — version pinning", () => {
  it("privacy.md version matches CURRENT_AGREEMENT_VERSIONS.privacy_policy", () => {
    expect(parseVersion(readPolicy("privacy"))).toBe(
      CURRENT_AGREEMENT_VERSIONS.privacy_policy,
    );
  });
  it("terms.md version matches CURRENT_AGREEMENT_VERSIONS.terms_of_service", () => {
    expect(parseVersion(readPolicy("terms"))).toBe(
      CURRENT_AGREEMENT_VERSIONS.terms_of_service,
    );
  });
  it("cookies.md version matches CURRENT_AGREEMENT_VERSIONS.cookie_policy", () => {
    expect(parseVersion(readPolicy("cookies"))).toBe(
      CURRENT_AGREEMENT_VERSIONS.cookie_policy,
    );
  });
});

describe("Privacy policy — required disclosure structure", () => {
  const privacy = readPolicy("privacy");

  it("names every vendor from docs/legal/VENDORS.md", () => {
    // The vendor table in VENDORS.md uses **bold** for the vendor
    // name; extract those.
    const vendorsRaw = fs.readFileSync(VENDORS_PATH, "utf8");
    const vendorNames = Array.from(
      vendorsRaw.matchAll(/\|\s*\*\*([^*]+)\*\*/g),
    ).map((m) => m[1].trim());
    expect(vendorNames.length).toBeGreaterThan(5);
    const missing = vendorNames.filter((v) => {
      // Strip parentheticals so "Google (OAuth)" matches a privacy.md
      // line that simply says "Google".
      const bareName = v.replace(/\s*\([^)]*\)\s*/g, "").trim();
      return !privacy.includes(bareName);
    });
    expect(
      missing,
      `Vendors named in VENDORS.md but missing from privacy.md: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it.each([
    "GDPR",
    "UK GDPR",
    "CCPA",
    "lawful basis",
    "supervisory authority",
    "Standard Contractual Clauses",
    "16",
    "13",
    "Children",
  ])("contains required clause: %s", (clause) => {
    expect(privacy).toContain(clause);
  });

  it("explicitly states we do not sell personal information", () => {
    expect(privacy).toMatch(/do not\s+sell/i);
  });

  it("describes analytics as pseudonymous, not anonymous", () => {
    // The prior page wording was 'anonymous'; the schema actually
    // stores a userId, so the new wording must be 'pseudonymous'.
    expect(privacy).toMatch(/pseudonymous/i);
  });

  it("lists all three OAuth providers", () => {
    for (const provider of ["Google", "Discord", "GitHub"]) {
      expect(privacy).toContain(provider);
    }
  });
});

describe("Terms of Service — required structural clauses", () => {
  const terms = readPolicy("terms");
  it.each([
    "arbitration",
    "class",
    "AS IS",
    "indemnif",
    "governing law",
    "Severability",
    "force majeure",
    "Entire agreement",
    "Acceptable use",
    "Limitation of liability",
  ])("contains required clause: %s", (clause) => {
    expect(terms.toLowerCase()).toContain(clause.toLowerCase());
  });
});

describe("Cookie policy — names every cookie + control surface", () => {
  const cookies = readPolicy("cookies");
  it.each([
    "loredex_session",
    "HttpOnly",
    "Secure",
    "SameSite",
    "Global Privacy Control",
  ])("contains: %s", (clause) => {
    expect(cookies).toContain(clause);
  });
});
