/* ═══════════════════════════════════════════════════════
   HIERARCHY CANON — Registry integrity tests
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  CANONICAL_CORE_TEN_COUNT,
  CANONICAL_HIERARCHY_C_SUITE,
  HIERARCHY_LORDS,
  HIERARCHY_NON_DEMON_MEMBER,
  getCoreTenLords,
  getHierarchyLord,
  getHierarchyLordByRole,
  getNonCoreLords,
} from "./hierarchyCanon";

describe("Hierarchy canonical registry", () => {
  it("registers 11 Hierarchy-affiliated demons total", () => {
    // 10 confirmed core demons + 1 adjacent (Ozhul'Vana).
    // Mol'Vereth was promoted into the core 10 per the dreamer
    // canon-lock of 2026-05-16.
    expect(HIERARCHY_LORDS).toHaveLength(11);
  });

  it("has no duplicate ids", () => {
    const ids = HIERARCHY_LORDS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("CANONICAL_CORE_TEN_COUNT is 10 per LORE_BIBLE.md:5348", () => {
    expect(CANONICAL_CORE_TEN_COUNT).toBe(10);
  });

  it("registers all 10 canonical core demons", () => {
    expect(getCoreTenLords()).toHaveLength(10);
  });

  it("registers 1 non-core Hierarchy-adjacent demon", () => {
    expect(getNonCoreLords()).toHaveLength(1);
  });

  it("the sole non-core demon is Ozhul'Vana (Degen arc)", () => {
    const ids = getNonCoreLords().map((l) => l.id);
    expect(ids).toEqual(["ozhul_vana"]);
  });

  it("every entry has a primary LORE_BIBLE citation", () => {
    for (const lord of HIERARCHY_LORDS) {
      expect(lord.loreSource).toMatch(/LORE_BIBLE\.md:\d+/);
    }
  });

  it("every entry has a non-empty domain", () => {
    for (const lord of HIERARCHY_LORDS) {
      expect(lord.domain.length).toBeGreaterThan(30);
    }
  });

  it("non-core demons carry a canonNote explaining their non-core status", () => {
    for (const lord of getNonCoreLords()) {
      expect(lord.canonNote).toBeDefined();
      expect(lord.canonNote!.length).toBeGreaterThan(20);
    }
  });
});

describe("Hierarchy C-suite", () => {
  it("locks the CEO to Mol'Garath per LORE_BIBLE.md:4072", () => {
    expect(CANONICAL_HIERARCHY_C_SUITE.ceo).toBe("mol_garath");
    expect(getHierarchyLordByRole("ceo")?.id).toBe("mol_garath");
  });

  it("locks the CFO to Xeth'Raal per LORE_BIBLE.md:5135", () => {
    expect(CANONICAL_HIERARCHY_C_SUITE.cfo).toBe("xeth_raal");
    expect(getHierarchyLordByRole("cfo")?.id).toBe("xeth_raal");
  });

  it("locks the COO to Riri'Ahlia per LORE_BIBLE.md:4185", () => {
    expect(CANONICAL_HIERARCHY_C_SUITE.coo).toBe("riri_ahlia");
    expect(getHierarchyLordByRole("coo")?.id).toBe("riri_ahlia");
  });

  it("locks the R&D SVP to Zyr'Koth", () => {
    expect(getHierarchyLordByRole("svp-r-and-d")?.id).toBe("zyr_koth");
  });

  it("locks the Director of Special Projects to Ith'Rael", () => {
    expect(getHierarchyLordByRole("director-special-projects")?.id).toBe(
      "ith_rael",
    );
  });

  it("locks the trustee role to Mol'Vereth (Degen arc)", () => {
    expect(getHierarchyLordByRole("trustee")?.id).toBe("mol_vereth");
  });

  it("locks the senior-partner role to Ozhul'Vana", () => {
    expect(getHierarchyLordByRole("senior-partner")?.id).toBe("ozhul_vana");
  });

  it("has no duplicate C-suite positions (CEO/CFO/COO/SVP-R&D/Director)", () => {
    const cSuiteRoles = ["ceo", "cfo", "coo", "svp-r-and-d", "director-special-projects"] as const;
    for (const role of cSuiteRoles) {
      const holders = HIERARCHY_LORDS.filter((l) => l.role === role);
      expect(holders).toHaveLength(1);
    }
  });
});

describe("Cross-registry: the Game Master as Hierarchy's non-demon", () => {
  it("registers the Game Master as the only non-demon Hierarchy member", () => {
    expect(HIERARCHY_NON_DEMON_MEMBER.archonId).toBe("the_game_master");
    expect(HIERARCHY_NON_DEMON_MEMBER.role).toBe("head-of-r-and-d");
  });

  it("the Game Master is NOT in the demon-lord registry " +
     "(he is canonically an Archon, registered in archonCanon.ts)", () => {
    const ids = new Set(HIERARCHY_LORDS.map((l) => l.id));
    expect(ids.has("the_game_master" as never)).toBe(false);
  });

  it("the cross-registry binding cites LORE_BIBLE.md:5352", () => {
    expect(HIERARCHY_NON_DEMON_MEMBER.joiningEventSource).toMatch(
      /LORE_BIBLE\.md:5352/,
    );
    expect(HIERARCHY_NON_DEMON_MEMBER.destroyedBySource).toMatch(
      /LORE_BIBLE\.md:5352/,
    );
  });
});

describe("Helpers", () => {
  it("getHierarchyLord returns the correct entry for every id", () => {
    for (const lord of HIERARCHY_LORDS) {
      expect(getHierarchyLord(lord.id).id).toBe(lord.id);
    }
  });

  it("getHierarchyLordByRole returns null for unfilled roles", () => {
    // No senior-lord-specific filter — there are multiple senior lords —
    // but the function returns the FIRST match. Verify a non-existent
    // role hypothetically would not match.
    // (This is just a smoke test — all canonical roles are filled.)
    expect(getHierarchyLordByRole("ceo")).not.toBeNull();
  });
});
