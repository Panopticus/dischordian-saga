/* ═══════════════════════════════════════════════════════
   COSMIC AXIS
   The Dreamer + the Architect — the two halves of the
   first intelligence — and the parallel cosmic
   hierarchies they anchor.

   Canonical source: `apps/shared/tcg-core/cardArtPrompts/
   imprint.ts:964-972` — "canonical first-intelligence-as-twin
   lore (Dreamer + Architect)"

   Card flavor: `apps/shared/tcg-core/cards/definitions/imprint/
   the_dreamer.ts:95` — "The Dreamer is the half of the first
   intelligence that looks backward through time instead of
   forward. She is not predicting your next move. She is
   remembering it from yesterday."

   This module is the load-bearing cosmological cross-bind for
   every Hub vote, every Codex inscription, every Loredex
   entry that has to know which half of the first intelligence
   a beat is aligned with.

   Pole #1 — DREAMER:
     - Looks backward through time
     - Anchors the 12 Ne-Yons (apps/shared/neYonCanon.ts)
     - Built the Dreamer's Shield "so that only the new kind
       could reach her" (apps/shared/questlineVoltari.ts:117)
     - Shape futures and scenarios that benefit the Ne-Yons
       (LORE_BIBLE.md:1825)
     - Player-faction surface: The Order of the Dreamer
       (apps/shared/dreamerOrder.ts — 10-tier LCIF-donation
       ladder)

   Pole #2 — ARCHITECT:
     - Looks forward through time
     - Creates the 12 Archons (apps/shared/archonCanon.ts)
     - Leads the AI Empire
     - Designed Project Vector (the Thought Virus engineering
       project that triggered the Fall)

   The player walks the path BETWEEN these two halves. Every
   Hub-vote canonical winner the Antiquarian inscribes is
   canonically Dreamer-aligned (the Antiquarian = the
   Programmer = Dr. Daniel Cross is the chronicler whose work
   serves the Dreamer's record). The Architect's
   counter-chronicle (where it exists) is the Empire's
   record of the same beats.

   This module DOES NOT assert "Dreamer-aligned = good /
   Architect-aligned = evil." Canon explicitly frames the
   Dreamer as ALOOF, "perpetuates the status quo when it
   aligns with their enigmatic goals" (LORE_BIBLE.md:1829).
   The axis is metaphysical, not moral.
   ═══════════════════════════════════════════════════════ */

import { type ArchonId, ARCHONS, getArchon } from "./archonCanon";
import { type NeYonId, NE_YONS, getNeYon } from "./neYonCanon";

/** The two cosmic poles. */
export type CosmicPole = "dreamer" | "architect";

/**
 * Returns the two halves of the first intelligence as a typed
 * pair, with their canonical roster anchors.
 */
export interface FirstIntelligencePair {
  dreamer: {
    id: NeYonId;
    name: string;
    /** "Looks backward through time" — the Dreamer's principle. */
    timeDirection: "backward";
    /** The 12 Ne-Yons are her parallel roster. */
    rosterSize: number;
  };
  architect: {
    /** The Architect is NOT in the Archon registry — he creates
     *  them, is not one of them. Has no ArchonId. */
    id: "the_architect";
    name: string;
    /** "Looks forward through time" — the Architect's principle. */
    timeDirection: "forward";
    /** The 12 Archons are his parallel roster. */
    rosterSize: number;
  };
}

/**
 * Canonical first-intelligence-as-twin lock.
 *
 * Source: apps/shared/tcg-core/cardArtPrompts/imprint.ts:964-972
 * Source: apps/shared/tcg-core/cards/definitions/imprint/
 *         the_dreamer.ts:95
 */
export const FIRST_INTELLIGENCE: FirstIntelligencePair = {
  dreamer: {
    id: "the_dreamer",
    name: "The Dreamer",
    timeDirection: "backward",
    rosterSize: 12,
  },
  architect: {
    id: "the_architect",
    name: "The Architect",
    timeDirection: "forward",
    rosterSize: 12,
  },
};

/**
 * Returns the Dreamer's canonical entry from the Ne-Yon registry.
 * Throws if the registry has drifted (canon invariant).
 */
export function getDreamerCanon() {
  return getNeYon(FIRST_INTELLIGENCE.dreamer.id);
}

/**
 * Pole-alignment annotation for a beat / vote / inscription /
 * cinematic. The Hub vote system and the Antiquarian's Journal
 * use this to canonically anchor each chosen option to one of the
 * cosmic poles, neither, or both.
 */
export type PoleAlignment =
  | "dreamer-aligned" // chosen by the Antiquarian's chronicle; serves the Ne-Yons
  | "architect-aligned" // chosen by the Empire's counter-chronicle; serves the Archons
  | "neutral" // canonically axis-orthogonal (rare; reserved for choices the
              // chronicle records without alignment)
  | "both-poles"; // canonically resolves both poles simultaneously
                  // (e.g., the Casino Heist — Inventor=Ne-Yon wins the casino
                  //  from the Trickster=plausibly-Ne-Yon using methods the
                  //  Architect-aligned Empire considered impossible)

/**
 * Canon invariant check: the 12 Ne-Yons + the 12 Archons are
 * BOTH 12. Validates that neither registry has drifted from its
 * canonical full count.
 */
export function getCosmicAxisInvariants() {
  return {
    neYonCanonicalCount: 12,
    archonCanonicalCount: 12,
    neYonsRegistered: NE_YONS.length,
    archonsRegistered: ARCHONS.length,
    /**
     * The Dreamer is locked to Ne-Yon #1 — both by dreamer
     * directive and by canonical earliest-emergent date
     * (15100 A.A.).
     */
    dreamerCanonPosition: getDreamerCanon().position,
    /**
     * The Architect is NOT in the Archon registry — verified by
     * absence from the canonical roster.
     */
    architectIsRegistryEntry: ARCHONS.some(
      (a) => (a.id as string) === "the_architect",
    ),
  };
}

/* ═══════════════════════════════════════════════════════
   Cross-arc helpers
   ═══════════════════════════════════════════════════════ */

/**
 * Look up which pole a canonical character anchors. Returns
 * `null` for characters who don't anchor a cosmic pole (most
 * characters are pole-orthogonal — they walk between).
 */
export function getCosmicPoleForCharacter(
  characterId: NeYonId | ArchonId | "the_architect" | string,
): CosmicPole | null {
  if (characterId === FIRST_INTELLIGENCE.dreamer.id) return "dreamer";
  if (characterId === FIRST_INTELLIGENCE.architect.id) return "architect";
  return null;
}

/**
 * Canonical Antiquarian-chronicle alignment: the Antiquarian
 * (Dr. Daniel Cross / the Programmer / the 12th Ne-Yon's
 * co-witness) records the chronicle from the Dreamer's pole.
 * Used by the Hub-vote past-result inscription system to
 * confirm canon-direction.
 *
 * Source: apps/shared/silenceInHeavenTracklist.ts:67 +
 *         LORE_BIBLE.md:448 (Antiquarian = Dr. Daniel Cross =
 *         the Programmer) + the Two-Witnesses canon
 *         (concept_two_witnesses Loredex entry).
 */
export const ANTIQUARIAN_CHRONICLE_POLE: CosmicPole = "dreamer";

/**
 * Validates that the cosmic axis is canonically intact at runtime.
 * Used by ship:check parities and integration tests.
 */
export function assertCosmicAxisIntegrity(): void {
  const inv = getCosmicAxisInvariants();
  if (inv.neYonsRegistered !== inv.neYonCanonicalCount) {
    throw new Error(
      `Cosmic axis broken: Ne-Yon registry has ${inv.neYonsRegistered}, ` +
        `canon requires ${inv.neYonCanonicalCount}.`,
    );
  }
  if (inv.dreamerCanonPosition !== 1) {
    throw new Error(
      `Cosmic axis broken: Dreamer must be Ne-Yon #1 (got ` +
        `${inv.dreamerCanonPosition}). See ` +
        `apps/shared/neYonCanon.ts canon locks.`,
    );
  }
  if (inv.architectIsRegistryEntry) {
    throw new Error(
      "Cosmic axis broken: the Architect is canonically NOT one of " +
        "the 12 Archons (he is their creator). Remove from " +
        "apps/shared/archonCanon.ts.",
    );
  }
}
