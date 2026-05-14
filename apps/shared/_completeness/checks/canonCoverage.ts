/**
 * Canon-coverage parity checks for Phase A foundation +
 * Phase B character canon-lock infrastructure.
 *
 * Six checks here:
 *   - Ne-Yon canonical roster coverage
 *   - Archon canonical roster coverage
 *   - Hierarchy of the Damned canonical roster coverage
 *   - Casino Heist crew coverage (7 cited)
 *   - Identity collision lock (8 manifolds locked)
 *   - Era timeline coverage (11 eras)
 *
 * The Ne-Yon / Archon checks register the FULL canonical
 * count (12 each) — with the canon-ambiguous-is-fine
 * Phase A2 decision, an entry in the registry counts as
 * "implemented" whether its position is canon-locked OR
 * stored as `null` (ambiguous-but-registered). What it
 * MUST NOT do is invent a position.
 */
import type { RawParityCount } from "../types";
import { NE_YONS } from "../../neYonCanon";
import { ARCHONS, CANONICAL_ARCHON_COUNT } from "../../archonCanon";
import {
  HIERARCHY_LORDS,
  CANONICAL_CORE_TEN_COUNT,
} from "../../hierarchyCanon";
import {
  CASINO_HEIST_CREW,
  CASINO_HEIST_CREW_SIZE,
} from "../../casinoHeistCanon";
import { IDENTITY_MANIFOLDS } from "../../identityCollisionCanon";
import { ERAS } from "../../eraTimeline";
import {
  AUTHORITY_FOUNDERS,
  AUTHORITY_FOUNDER_COUNT,
} from "../../authorityCanon";
import { GUILD_BINDINGS, MECHRONIS_GUILD_COUNT } from "../../mechronisGuildSystem";

/* ═══════════════════════════════════════════════════════
   Ne-Yon canonical roster coverage
   ═══════════════════════════════════════════════════════ */

const CANONICAL_NEYON_COUNT = 12;

export function checkNeyonCanonicalRosterCoverage(): RawParityCount {
  // The registry MUST hold exactly 12 entries. Each entry must
  // have either a locked position (1-12) OR position === null
  // (canon-ambiguous-is-fine per Phase A2 decision).
  const missing: string[] = [];
  let implemented = 0;

  for (const n of NE_YONS) {
    const ok =
      // Either canon-locked numerical position
      (n.position !== null && n.positionSource !== null) ||
      // OR explicit canon-ambiguity (position null + no source)
      (n.position === null && n.positionSource === null);
    if (ok) {
      implemented++;
    } else {
      missing.push(`${n.id} → invalid position/source pairing`);
    }
  }

  // Also enforce roster size — fewer than 12 = under-coverage.
  if (NE_YONS.length !== CANONICAL_NEYON_COUNT) {
    missing.push(
      `roster size: have ${NE_YONS.length}, canon requires ${CANONICAL_NEYON_COUNT}`,
    );
  }

  return {
    declared: CANONICAL_NEYON_COUNT,
    implemented,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Archon canonical roster coverage
   ═══════════════════════════════════════════════════════ */

export function checkArchonCanonicalRosterCoverage(): RawParityCount {
  // Counts the registered Archons against the canonical full
  // count (12). The registry is allowed to be under-coverage
  // because canon hasn't yet surfaced all 12 names; the gap is
  // ratcheted at landing-time and only ALLOWED to shrink.
  const missing: string[] = [];
  let implemented = 0;

  for (const a of ARCHONS) {
    const ok =
      (a.position !== null && a.positionSource !== null) ||
      (a.position === null && a.positionSource === null);
    if (ok) {
      implemented++;
    } else {
      missing.push(`${a.id} → invalid position/source pairing`);
    }
  }

  // Track the roster-size gap as informational missing rows.
  for (let i = ARCHONS.length; i < CANONICAL_ARCHON_COUNT; i++) {
    missing.push(`archon_slot_${i + 1} canon-pending in LORE_BIBLE`);
  }

  return {
    declared: CANONICAL_ARCHON_COUNT,
    implemented,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Hierarchy of the Damned canonical roster coverage
   ═══════════════════════════════════════════════════════ */

export function checkHierarchyCanonicalRosterCoverage(): RawParityCount {
  // Per LORE_BIBLE.md:5348, the Hierarchy is exactly 10 demon
  // lords. The registry's `inCoreTen` flag marks the core 10;
  // additional adjacent demons (Mol'Vereth, Ozhul'Vana) are
  // counted separately and not in the canonical 10.
  const coreTen = HIERARCHY_LORDS.filter((l) => l.inCoreTen);
  const missing: string[] = [];

  for (let i = coreTen.length; i < CANONICAL_CORE_TEN_COUNT; i++) {
    missing.push(`demon_lord_slot_${i + 1} canon-pending`);
  }

  return {
    declared: CANONICAL_CORE_TEN_COUNT,
    implemented: coreTen.length,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Casino Heist crew coverage
   ═══════════════════════════════════════════════════════ */

export function checkCasinoHeistCrewCoverage(): RawParityCount {
  // Canonically 7 crew. Registry must hold 7. Each entry must
  // have a non-empty loreSource and at least one canonical
  // contribution sentence.
  const missing: string[] = [];
  let implemented = 0;

  for (const c of CASINO_HEIST_CREW) {
    const ok =
      c.loreSource.length > 0 &&
      c.canonicalContribution.length > 0;
    if (ok) {
      implemented++;
    } else {
      missing.push(`${c.id} → missing source or contribution`);
    }
  }

  if (CASINO_HEIST_CREW.length !== CASINO_HEIST_CREW_SIZE) {
    missing.push(
      `crew size: have ${CASINO_HEIST_CREW.length}, canon requires ${CASINO_HEIST_CREW_SIZE}`,
    );
  }

  return {
    declared: CASINO_HEIST_CREW_SIZE,
    implemented,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Identity collision lock
   ═══════════════════════════════════════════════════════ */

const CANONICAL_IDENTITY_MANIFOLDS = 8;

export function checkIdentityCollisionLock(): RawParityCount {
  // Per Plan §I.2 + identityCollisionCanon.ts, 8 manifolds are
  // canonically locked:
  //   1. Vex Solène (Engineer Zero / Agent Zero / Eyes of Reality)
  //   2. Wraith Calder (Hierophant / Mourning Keeper)
  //   3. Akai Shi (Red Death)
  //   4. The Wolf (Lycos pre-resurrection)
  //   5. The Antiquarian (Cross / Programmer)
  //   6. The Enigma (Malkia Ukweli / Storyteller / Queen of Truth)
  //   7. The Human (Student / Seeker / Detective / Last Archon)
  //   8. The Source (Kael Reborn — spoiler-protected)
  const missing: string[] = [];
  let implemented = 0;

  for (const m of IDENTITY_MANIFOLDS) {
    const ok = m.loreSource.length > 0 && m.aliases.length > 0;
    if (ok) {
      implemented++;
    } else {
      missing.push(`${m.manifoldId} → missing source or aliases`);
    }
  }

  if (IDENTITY_MANIFOLDS.length !== CANONICAL_IDENTITY_MANIFOLDS) {
    missing.push(
      `manifold count: have ${IDENTITY_MANIFOLDS.length}, canon requires ${CANONICAL_IDENTITY_MANIFOLDS}`,
    );
  }

  return {
    declared: CANONICAL_IDENTITY_MANIFOLDS,
    implemented,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Era timeline coverage
   ═══════════════════════════════════════════════════════ */

const CANONICAL_ERA_COUNT = 12;

export function checkEraTimelineCoverage(): RawParityCount {
  // 12 canonical eras in chronicle order. Each must have a
  // non-empty defining event + non-empty loreSource +
  // unique chronicleOrder.
  const missing: string[] = [];
  let implemented = 0;
  const seenOrders = new Set<number>();

  for (const e of ERAS) {
    const ok =
      e.definingEvent.length > 0 &&
      e.loreSource.length > 0 &&
      !seenOrders.has(e.chronicleOrder);
    if (ok) {
      implemented++;
      seenOrders.add(e.chronicleOrder);
    } else {
      missing.push(
        `${e.id} → ${seenOrders.has(e.chronicleOrder) ? "duplicate chronicleOrder" : "missing source or event"}`,
      );
    }
  }

  if (ERAS.length !== CANONICAL_ERA_COUNT) {
    missing.push(
      `era count: have ${ERAS.length}, canon requires ${CANONICAL_ERA_COUNT}`,
    );
  }

  return {
    declared: CANONICAL_ERA_COUNT,
    implemented,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Authority Six Founders coverage
   ═══════════════════════════════════════════════════════ */

export function checkAuthorityFounderCoverage(): RawParityCount {
  // Always 6 Founders. Each must have a loreSource. Founders
  // 1-3 are canon-named (Samsara + Phyral succubus + Midlothian
  // extractor); Founders 4-6 are canon-locked at the TITLE
  // level per the Sin-Founder pairing (Wrath Bearer of the
  // Tribunal + Pride Bearer of the Sovereign Spire + Envy
  // Bearer of the Reflected Quarter — locked 2026-05-14 by
  // the dreamer). Every slot must be registered.
  const missing: string[] = [];
  let implemented = 0;

  for (const f of AUTHORITY_FOUNDERS) {
    if (f.loreSource.length > 0) {
      implemented++;
    } else {
      missing.push(`${f.id} → missing source`);
    }
  }

  if (AUTHORITY_FOUNDERS.length !== AUTHORITY_FOUNDER_COUNT) {
    missing.push(
      `founder count: have ${AUTHORITY_FOUNDERS.length}, canon requires ${AUTHORITY_FOUNDER_COUNT}`,
    );
  }

  return {
    declared: AUTHORITY_FOUNDER_COUNT,
    implemented,
    missing,
  };
}

/* ═══════════════════════════════════════════════════════
   Mechronis Guild ↔ Class binding coverage
   ═══════════════════════════════════════════════════════ */

export function checkMechronisGuildBindingCoverage(): RawParityCount {
  // 5 Guild ↔ Class bindings. Each must have a loreSource and
  // a canonicalExemplar. All 5 Guilds are now canon-locked
  // (the 5th Guild's canonical name 'The Guild of Omens' was
  // locked 2026-05-14 by the dreamer).
  const missing: string[] = [];
  let implemented = 0;

  for (const b of GUILD_BINDINGS) {
    const ok =
      b.loreSource.length > 0 &&
      b.canonicalExemplar.length > 0;
    if (ok) {
      implemented++;
    } else {
      missing.push(`${b.guildId} → missing source or exemplar`);
    }
  }

  if (GUILD_BINDINGS.length !== MECHRONIS_GUILD_COUNT) {
    missing.push(
      `binding count: have ${GUILD_BINDINGS.length}, canon requires ${MECHRONIS_GUILD_COUNT}`,
    );
  }

  return {
    declared: MECHRONIS_GUILD_COUNT,
    implemented,
    missing,
  };
}
