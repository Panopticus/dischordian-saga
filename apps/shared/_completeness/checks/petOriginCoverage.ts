/**
 * Pet origin canon coverage parity check — PR-23.
 *
 * HARD parity. The Pets' narrative origin (the last loose
 * thread) must resolve every anchor it claims:
 *
 *   - imprint_ontology   → imprintSummoningCanon's
 *                          IMPRINT_SUMMONING_PREMISE (the
 *                          Matrix-of-Dreams ontology) exists;
 *   - species_registry   → petSpeciesTraits.PET_SPECIES_TRAITS
 *                          is non-empty;
 *   - breeding_mechanic  → petBreeding.breedPets is callable;
 *   - risen_fate         → necromancerReturn.SYSTEM_IMPACTS
 *                          contains a pet_battles Risen effect
 *                          AND theComingCanon has the
 *                          first_coming stage.
 *
 * Every declared binding's anchor must be one of the four and
 * each anchor must actually resolve. No ratchet — a Pets
 * origin that does not resolve is a loose thread, not canon.
 */
import {
  PET_ORIGIN_BINDINGS,
  PET_ORIGIN_PREMISE,
  getPetOriginCoverage,
} from "../../petOriginCanon";
import { IMPRINT_SUMMONING_PREMISE } from "../../imprintSummoningCanon";
import { PET_SPECIES_TRAITS } from "../../petSpeciesTraits";
import { breedPets } from "../../petBreeding";
import { SYSTEM_IMPACTS } from "../../necromancerReturn";
import { getComingStage } from "../../theComingCanon";
import type { RawParityCount } from "../types";

function anchorResolves(anchor: string): boolean {
  switch (anchor) {
    case "imprint_ontology":
      return (
        typeof IMPRINT_SUMMONING_PREMISE === "object" &&
        IMPRINT_SUMMONING_PREMISE !== null
      );
    case "species_registry":
      return Object.keys(PET_SPECIES_TRAITS).length > 0;
    case "breeding_mechanic":
      return typeof breedPets === "function";
    case "risen_fate": {
      const hasRisenPetImpact = SYSTEM_IMPACTS.some((s) =>
        s.effects.some(
          (e) => e.system === "pet_battles" && /risen/i.test(e.effect),
        ),
      );
      return hasRisenPetImpact && getComingStage("first_coming") !== undefined;
    }
    default:
      return false;
  }
}

export function checkPetOriginCoverage(): RawParityCount {
  const { declared } = getPetOriginCoverage();
  const missing: string[] = [];

  if (
    !PET_ORIGIN_PREMISE.thesis ||
    PET_ORIGIN_PREMISE.thesis.trim().length === 0
  ) {
    missing.push("PET_ORIGIN_PREMISE has no thesis");
  }

  const seenAnchors = new Set<string>();
  for (const b of PET_ORIGIN_BINDINGS) {
    seenAnchors.add(b.anchor);
    if (!anchorResolves(b.anchor)) {
      missing.push(
        `pet origin binding '${b.id}': anchor '${b.anchor}' does not resolve`,
      );
    }
    if (b.loreSource.trim().length === 0) {
      missing.push(`pet origin binding '${b.id}': empty loreSource`);
    }
  }

  for (const required of [
    "imprint_ontology",
    "species_registry",
    "breeding_mechanic",
    "risen_fate",
  ]) {
    if (!seenAnchors.has(required)) {
      missing.push(`pet origin is missing the '${required}' binding`);
    }
  }

  return {
    declared,
    implemented: Math.max(0, declared - missing.length),
    missing,
  };
}
