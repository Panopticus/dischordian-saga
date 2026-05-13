/* ═══════════════════════════════════════════════════════
   IDENTITY COLLISION CANON — Registry integrity tests

   Validates every identity-manifold lock against the 2026-05
   audit findings.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  IDENTITY_MANIFOLDS,
  canonicalNameFor,
  findManifoldForName,
  getAuditCollisionFlags,
  getSpoilerProtectedManifolds,
  isSameCanonicalCharacter,
} from "./identityCollisionCanon";

describe("Identity Collision Canon registry", () => {
  it("registers 8 canonical identity manifolds", () => {
    expect(IDENTITY_MANIFOLDS).toHaveLength(8);
  });

  it("has no duplicate manifold ids", () => {
    const ids = IDENTITY_MANIFOLDS.map((m) => m.manifoldId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate primary names", () => {
    const names = IDENTITY_MANIFOLDS.map((m) => m.primaryName);
    expect(new Set(names).size).toBe(names.length);
  });

  it("no alias appears in more than one manifold", () => {
    const aliasToManifold = new Map<string, string>();
    for (const manifold of IDENTITY_MANIFOLDS) {
      for (const alias of manifold.aliases) {
        if (aliasToManifold.has(alias)) {
          throw new Error(
            `Alias "${alias}" appears in both ${aliasToManifold.get(alias)} ` +
              `and ${manifold.manifoldId}.`,
          );
        }
        aliasToManifold.set(alias, manifold.manifoldId);
      }
    }
    expect(aliasToManifold.size).toBeGreaterThan(0);
  });

  it("every manifold has a non-empty loreSource citation", () => {
    for (const manifold of IDENTITY_MANIFOLDS) {
      expect(manifold.loreSource.length).toBeGreaterThan(20);
    }
  });

  it("every manifold has a non-empty collisionMechanism", () => {
    for (const manifold of IDENTITY_MANIFOLDS) {
      expect(manifold.collisionMechanism.length).toBeGreaterThan(40);
    }
  });
});

describe("Vex Solène manifold (the most-aliased character)", () => {
  it("collapses Engineer Zero, Agent Zero, The Eyes of Reality, " +
     "Maestro of The Coda into Vex Solène", () => {
    const m = findManifoldForName("Agent Zero");
    expect(m?.primaryName).toBe("Vex Solène");
    expect(m?.aliases).toContain("Engineer Zero");
    expect(m?.aliases).toContain("Agent Zero");
    expect(m?.aliases).toContain("The Eyes of Reality");
    expect(m?.aliases).toContain("Maestro of The Coda");
  });

  it("flags Agent Zero + Engineer Zero as audit-collision-flagged", () => {
    const m = findManifoldForName("Vex Solène");
    expect(m?.auditCollisionFlags).toContain("Agent Zero");
    expect(m?.auditCollisionFlags).toContain("Engineer Zero");
  });

  it("is spoiler-protected (Act 5 reveal)", () => {
    expect(findManifoldForName("Vex Solène")?.spoilerProtected).toBe(true);
  });

  it("references mystery.vex_solene as the reveal arc", () => {
    expect(findManifoldForName("Vex Solène")?.revealMysteryArc).toBe(
      "mystery.vex_solene",
    );
  });
});

describe("Wraith Calder manifold (Hierophant in Exile)", () => {
  it("collapses Hierophant Wraith into Wraith Calder", () => {
    const m = findManifoldForName("Hierophant Wraith");
    expect(m?.primaryName).toBe("Wraith Calder");
  });

  it("includes the Mourning Keeper + Ghost of the Potentials aliases", () => {
    const m = findManifoldForName("Wraith Calder");
    expect(m?.aliases).toContain("The Mourning Keeper");
    expect(m?.aliases).toContain("Ghost of the Potentials");
    expect(m?.aliases).toContain("The Hierophant of Thaloria in Exile");
  });

  it("references mystery.wraith_calder", () => {
    expect(findManifoldForName("Wraith Calder")?.revealMysteryArc).toBe(
      "mystery.wraith_calder",
    );
  });
});

describe("Akai Shi → Red Death manifold", () => {
  it("collapses 'The Red Death' into Akai Shi", () => {
    const m = findManifoldForName("The Red Death");
    expect(m?.primaryName).toBe("Akai Shi");
  });

  it("registers The Red Death as audit-collision-flagged", () => {
    const m = findManifoldForName("Akai Shi");
    expect(m?.auditCollisionFlags).toContain("The Red Death");
  });

  it("canon mechanism names Akai Shi as the Necromancer's executioner", () => {
    const m = findManifoldForName("Akai Shi");
    expect(m?.collisionMechanism).toMatch(/Necromancer/i);
  });
});

describe("Wolf manifold (Lycos pre-resurrection)", () => {
  it("collapses Lycos into the Wolf (dreamer-canon correction)", () => {
    const m = findManifoldForName("Lycos");
    expect(m?.primaryName).toBe("The Wolf");
  });

  it("registers Lycos as audit-collision-flagged " +
     "(restored by dreamer canon)", () => {
    const m = findManifoldForName("The Wolf");
    expect(m?.auditCollisionFlags).toContain("Lycos");
  });

  it("canon mechanism references the Judge as destroyer + Crucible " +
     "as resurrection site", () => {
    const m = findManifoldForName("The Wolf");
    expect(m?.collisionMechanism).toMatch(/Judge/);
    expect(m?.collisionMechanism).toMatch(/Crucible/);
  });
});

describe("Antiquarian manifold", () => {
  it("collapses Dr. Daniel Cross + The Programmer into The Antiquarian", () => {
    expect(findManifoldForName("Dr. Daniel Cross")?.primaryName).toBe(
      "The Antiquarian",
    );
    expect(findManifoldForName("The Programmer")?.primaryName).toBe(
      "The Antiquarian",
    );
  });
});

describe("Enigma / Storyteller manifold", () => {
  it("collapses Malkia Ukweli + The Storyteller into The Enigma", () => {
    expect(findManifoldForName("Malkia Ukweli")?.primaryName).toBe("The Enigma");
    expect(findManifoldForName("The Storyteller")?.primaryName).toBe(
      "The Enigma",
    );
  });

  it("includes Queen of Truth + The Dealer aliases", () => {
    const m = findManifoldForName("The Enigma");
    expect(m?.aliases).toContain("Queen of Truth");
    expect(m?.aliases).toContain("The Dealer");
  });
});

describe("The Human identity-chain manifold", () => {
  it("collapses Student / Seeker / Detective / Last Archon into The Human", () => {
    expect(findManifoldForName("The Student")?.primaryName).toBe("The Human");
    expect(findManifoldForName("The Seeker")?.primaryName).toBe("The Human");
    expect(findManifoldForName("The Detective")?.primaryName).toBe("The Human");
    expect(findManifoldForName("The Last Archon")?.primaryName).toBe("The Human");
  });
});

describe("The Source manifold (Act 5 reveal lock)", () => {
  it("collapses Kael Reborn into The Source", () => {
    expect(findManifoldForName("Kael Reborn")?.primaryName).toBe("The Source");
  });

  it("is spoiler-protected (Act 5 reveal)", () => {
    expect(findManifoldForName("The Source")?.spoilerProtected).toBe(true);
  });
});

describe("Helper functions", () => {
  it("isSameCanonicalCharacter recognizes Vex Solène = Agent Zero", () => {
    expect(isSameCanonicalCharacter("Vex Solène", "Agent Zero")).toBe(true);
    expect(isSameCanonicalCharacter("Engineer Zero", "Vex Solène")).toBe(true);
    expect(isSameCanonicalCharacter("Agent Zero", "Engineer Zero")).toBe(true);
  });

  it("isSameCanonicalCharacter recognizes Wraith Calder = Hierophant Wraith", () => {
    expect(isSameCanonicalCharacter("Wraith Calder", "Hierophant Wraith")).toBe(
      true,
    );
  });

  it("isSameCanonicalCharacter returns false for genuinely different characters", () => {
    expect(isSameCanonicalCharacter("Vex Solène", "Wraith Calder")).toBe(false);
    expect(isSameCanonicalCharacter("The Antiquarian", "The Enigma")).toBe(
      false,
    );
  });

  it("isSameCanonicalCharacter returns true when the same name is passed twice", () => {
    expect(isSameCanonicalCharacter("Elara", "Elara")).toBe(true);
  });

  it("canonicalNameFor returns the primary name for any alias", () => {
    expect(canonicalNameFor("Agent Zero")).toBe("Vex Solène");
    expect(canonicalNameFor("Hierophant Wraith")).toBe("Wraith Calder");
    expect(canonicalNameFor("The Red Death")).toBe("Akai Shi");
    expect(canonicalNameFor("Lycos")).toBe("The Wolf");
    expect(canonicalNameFor("Dr. Daniel Cross")).toBe("The Antiquarian");
    expect(canonicalNameFor("Malkia Ukweli")).toBe("The Enigma");
    expect(canonicalNameFor("The Detective")).toBe("The Human");
    expect(canonicalNameFor("Kael Reborn")).toBe("The Source");
  });

  it("canonicalNameFor returns unchanged for unregistered names", () => {
    expect(canonicalNameFor("Elara")).toBe("Elara");
    expect(canonicalNameFor("The Degen")).toBe("The Degen");
  });

  it("getSpoilerProtectedManifolds returns Vex Solène + Source manifolds", () => {
    const spoiler = getSpoilerProtectedManifolds();
    const ids = spoiler.map((m) => m.manifoldId);
    expect(ids).toContain("vex_solene_manifold");
    expect(ids).toContain("source_manifold");
  });

  it("getAuditCollisionFlags surfaces every audit-flagged alias", () => {
    const flags = getAuditCollisionFlags();
    // Per §I.2 of the rebuild plan, these are the explicit audit flags:
    expect(flags).toContain("Agent Zero");
    expect(flags).toContain("Engineer Zero");
    expect(flags).toContain("Hierophant Wraith");
    expect(flags).toContain("The Hierophant of Thaloria");
    expect(flags).toContain("The Red Death");
    expect(flags).toContain("Lycos");
  });
});
