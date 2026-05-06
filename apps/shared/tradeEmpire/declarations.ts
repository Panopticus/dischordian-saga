// apps/shared/tradeEmpire/declarations.ts
//
// Season declarations — the public stance one faction takes at season
// start. Phase 2 of the items-matter / Game-of-Thrones arc ships the
// registry; the selector that picks one per season tick lands fully
// in phase 4 alongside the agenda engine.
//
// A declaration is a season-long modifier that anti-correlates two
// sub-houses for the duration. Examples:
//   - Hierarchy declares Thaloria heretical
//   - Authority's Ledger declares the Trench off-books
//   - Antiquarian declares a citation under reconstruction
//
// Mechanically:
//   - A declaration sets a publicFlag readable by NPC dialog.
//   - A declaration applies a rivalryModifier multiplier to any
//     contract-completion rep delta touching the issuing or target
//     sub-house this season.

import type { SeasonDeclaration } from "./season";
import { isKnownSubHouseKey } from "./houses";

/**
 * Canonical declaration registry. Keys are unique stable strings —
 * the season clock state stores the active key, not the embedded
 * shape, so future authoring can adjust copy without breaking
 * historical season logs.
 */
export const DECLARATION_REGISTRY: Readonly<Record<string, SeasonDeclaration>> = {
  "decl.hierarchy.thaloria_heretical": {
    declarationKey: "decl.hierarchy.thaloria_heretical",
    headline: "Hierarchy declares Thaloria heretical",
    text:
      "Severance Division publishes a binding doctrine: any contract aligned with Thaloria's Council of Harmony is to be treated as a hostile religious imposition. Acquisitions cheers. The Quietwork desk goes quiet.",
    issuingHouse: "hierarchy_severance",
    targetHouse: "thaloria_council",
    rivalryModifier: 1.5,
    publicFlag: "decl.hierarchy_thaloria_heretical",
  },

  "decl.authority.trench_offbooks": {
    declarationKey: "decl.authority.trench_offbooks",
    headline: "Authority's Ledger declares the Trench off-books",
    text:
      "Locke's Ledger writes the Trench out of the season's settlement journal. New Babylon brokers will refuse to cite Trench transactions; Hierarchy's Severance reads the omission as an opening.",
    issuingHouse: "nb_authoritys_ledger",
    targetHouse: "hierarchy_severance",
    rivalryModifier: 1.4,
    publicFlag: "decl.authority_trench_offbooks",
  },

  "decl.antiquarian.citation_reconstruction": {
    declarationKey: "decl.antiquarian.citation_reconstruction",
    headline: "Antiquarian opens a citation reconstruction",
    text:
      "Daniel Cross publishes a reconstruction notice on a long-lost attribution. The Casino Floor's open spreads close at par; every shelf-mate begins reaching backwards for sources.",
    issuingHouse: "antiquarian_shelfmates",
    targetHouse: "antiquarian_casino",
    rivalryModifier: 1.3,
    publicFlag: "decl.antiquarian_citation_reconstruction",
  },

  "decl.casino.spread_open": {
    declarationKey: "decl.casino.spread_open",
    headline: "The Casino opens a season-long spread",
    text:
      "The Degen lays a spread on the season's outcome. Any open question — political, economic, narrative — accepts a bet. The shelf-mates' formalities feel suddenly quaint.",
    issuingHouse: "antiquarian_casino",
    targetHouse: "antiquarian_shelfmates",
    rivalryModifier: 1.3,
    publicFlag: "decl.casino_season_spread",
  },

  "decl.thaloria.silent_year": {
    declarationKey: "decl.thaloria.silent_year",
    headline: "Thaloria declares a Silent Year",
    text:
      "The Council of Harmony invokes a Silent Year — diplomatic ceremony only, no combat-positive engagement. Quietwork's ceremonial wing absorbs the season's traffic; combat-aligned brokers find Thaloria's doors closed.",
    issuingHouse: "thaloria_council",
    targetHouse: "hierarchy_acquisitions",
    rivalryModifier: 1.4,
    publicFlag: "decl.thaloria_silent_year",
  },

  "decl.engineers.civic_emergency": {
    declarationKey: "decl.engineers.civic_emergency",
    headline: "Civic Engineers declare a civic emergency",
    text:
      "The Civic Engineers pull engineering crews off Locke's audit tour and re-route them to a sector-wide infrastructure rebuild. The Authority's Ledger calls it grandstanding; the engineers call it Tuesday.",
    issuingHouse: "nb_civic_engineers",
    targetHouse: "nb_authoritys_ledger",
    rivalryModifier: 1.4,
    publicFlag: "decl.engineers_civic_emergency",
  },

  "decl.freeports.barter_season": {
    declarationKey: "decl.freeports.barter_season",
    headline: "Free Ports proclaim a Barter Season",
    text:
      "The Coalition refuses credit for the season. Every transaction must canonically clear in goods. The cash-rich find themselves illiquid; the holds-full find themselves wealthy.",
    issuingHouse: "ind_freeports",
    targetHouse: "nb_authoritys_ledger",
    rivalryModifier: 1.2,
    publicFlag: "decl.freeports_barter_season",
  },
} as const;

export type DeclarationKey = keyof typeof DECLARATION_REGISTRY;

/** All registered declaration keys. */
export function allDeclarationKeys(): ReadonlyArray<string> {
  return Object.keys(DECLARATION_REGISTRY);
}

/** Resolve a declaration definition by key. */
export function getDeclaration(key: string): SeasonDeclaration | undefined {
  return DECLARATION_REGISTRY[key];
}

/**
 * Pick the next season's declaration. Phase 2 ships a deterministic
 * round-robin selector keyed by season number — predictable for
 * tests, pleasant for the first run-through. Phase 4 will replace
 * this with a weighted selector that consults sub-house standings,
 * agenda outcomes, and the previous season's player choice.
 */
export function selectDeclarationForSeason(
  seasonNumber: number,
): SeasonDeclaration {
  const keys = allDeclarationKeys();
  if (keys.length === 0) {
    throw new Error("DECLARATION_REGISTRY is empty");
  }
  const idx = ((seasonNumber - 1) % keys.length + keys.length) % keys.length;
  return DECLARATION_REGISTRY[keys[idx]];
}

/**
 * Apply the rivalry modifier of an active declaration to a base rep
 * delta. Returns the modified delta if the houseKey is the issuing
 * house (modifier amplifies positive deltas) or the target house
 * (modifier amplifies negative deltas); otherwise returns the
 * unmodified delta.
 *
 * Used by the contract-progression and demand-payment paths so a
 * season declaration *bites* every transaction that touches its
 * named houses, not just the season-end settlement.
 */
export function applyDeclarationModifier(
  declaration: SeasonDeclaration | null,
  houseKey: string,
  baseDelta: number,
): number {
  if (!declaration) return baseDelta;
  if (houseKey === declaration.issuingHouse && baseDelta > 0) {
    return Math.round(baseDelta * declaration.rivalryModifier);
  }
  if (houseKey === declaration.targetHouse && baseDelta < 0) {
    return Math.round(baseDelta * declaration.rivalryModifier);
  }
  return baseDelta;
}

/** Validate the registry. Used by tests + load-time invariants. */
export function validateDeclarationRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  for (const [key, decl] of Object.entries(DECLARATION_REGISTRY)) {
    if (decl.declarationKey !== key) {
      errors.push(`${key}: declarationKey mismatch (${decl.declarationKey})`);
    }
    if (!isKnownSubHouseKey(decl.issuingHouse)) {
      errors.push(`${key}: unknown issuingHouse ${decl.issuingHouse}`);
    }
    if (!isKnownSubHouseKey(decl.targetHouse)) {
      errors.push(`${key}: unknown targetHouse ${decl.targetHouse}`);
    }
    if (decl.issuingHouse === decl.targetHouse) {
      errors.push(`${key}: issuing and target cannot be the same house`);
    }
    if (decl.rivalryModifier < 1) {
      errors.push(
        `${key}: rivalryModifier ${decl.rivalryModifier} should amplify (≥1)`,
      );
    }
  }
  return errors;
}

/**
 * Find the declaration in the registry that best matches an
 * (issuingHouse, targetHouse) pair. Returns the registry entry that
 * exactly matches, or undefined. Used when the public-knowledge
 * log records "decl.X" and we want to render it.
 */
export function declarationForHouses(
  issuingHouse: string,
  targetHouse: string,
): SeasonDeclaration | undefined {
  return Object.values(DECLARATION_REGISTRY).find(
    d => d.issuingHouse === issuingHouse && d.targetHouse === targetHouse,
  );
}
