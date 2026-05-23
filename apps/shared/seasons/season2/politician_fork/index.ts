/* Politician-fork variant modules — 3 Season-2 antagonist states. */
import type { PatchModule } from "../types";
import type { PoliticianForkResolution } from "../types";

export const SEAT_SEALED: PatchModule = {
  id: "politician_fork/seat_sealed",
  dialogOverrides: {
    "the_antiquarian.season2.politician_fork":
      "Her seat is sealed. The apprentices have gone home.",
  },
  loredexPatches: {
    the_politician: {
      status: "deceased",
      inMemoriamLine: "Her name was already past tense. It stays past tense.",
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "politician_seat_sealed_permanent",
    "archon_aspirant_nemesis_unseated",
    "season_2_no_politician_antagonist",
  ],
};

export const CONSTRAINED_RETURN: PatchModule = {
  id: "politician_fork/constrained_return",
  dialogOverrides: {
    "the_antiquarian.season2.politician_fork":
      "She wears the yellow tie. She has not reopened Mechronis.",
  },
  loredexPatches: {
    the_politician: {
      status: "alive",
      inMemoriamLine:
        "She returned constrained. The doctrine she carries is partial. The Academy has not reopened.",
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "politician_returns_constrained_partial_doctrine",
    "yellow_tie_iconography_active",
    "mechronis_academy_closed",
  ],
};

export const FULL_RETURN: PatchModule = {
  id: "politician_fork/full_return",
  dialogOverrides: {
    "the_antiquarian.season2.politician_fork":
      "She is seated. The Academy is open. The doctrine is whole. The community let her sit.",
  },
  loredexPatches: {
    the_politician: {
      status: "alive",
      inMemoriamLine:
        "She has returned. Project Sorrow is reactivated. Mechronis Academy is open.",
      rewritePastTense: false,
    },
  },
  cardUnlocks: ["the_politicians_pin"],
  crossArcRipples: [
    "politician_full_return_primary_antagonist",
    "mechronis_academy_reopened",
    "project_sorrow_reactivated",
    "politician_loredex_present_tense",
  ],
};

export function politicianForkPatchFor(r: PoliticianForkResolution): PatchModule {
  switch (r) {
    case "seat_sealed":
      return SEAT_SEALED;
    case "constrained_return":
      return CONSTRAINED_RETURN;
    case "full_return":
      return FULL_RETURN;
  }
}
