import { describe, it, expect } from "vitest";
import {
  clipWitnessBalance,
  derivePublicLabel,
  deriveAuthorityVerdictOffset,
  initPublicWitnessState,
  isEntryDiverged,
  recordOpponentPlay,
} from "./publicWitness";
import type { CardDefinition } from "../types/Card";
import {
  PUBLIC_WITNESS_BALANCE_MAX,
  PUBLIC_WITNESS_BALANCE_MIN,
  PUBLIC_WITNESS_THRESHOLDS,
  type PublicWitnessEntry,
} from "../types/PublicWitness";

/** Small helper so each test's entry isn't 30 lines of boilerplate. */
function entry(partial: Partial<PublicWitnessEntry>): PublicWitnessEntry {
  return {
    id: "e",
    turnNumber: 1,
    publicLabel: "admission",
    publicDelta: 0,
    privateDelta: 0,
    cardDefId: "c",
    ...partial,
  };
}

describe("publicWitness — constants", () => {
  it("balance range is [-10, +10]", () => {
    expect(PUBLIC_WITNESS_BALANCE_MIN).toBe(-10);
    expect(PUBLIC_WITNESS_BALANCE_MAX).toBe(10);
  });

  it("§4 thresholds are ±3", () => {
    expect(PUBLIC_WITNESS_THRESHOLDS.warm).toBe(3);
    expect(PUBLIC_WITNESS_THRESHOLDS.cool).toBe(-3);
  });
});

describe("publicWitness — clipWitnessBalance", () => {
  it("passes valid values through", () => {
    expect(clipWitnessBalance(0)).toBe(0);
    expect(clipWitnessBalance(5)).toBe(5);
    expect(clipWitnessBalance(-7)).toBe(-7);
  });

  it("clips above +10", () => {
    expect(clipWitnessBalance(11)).toBe(10);
    expect(clipWitnessBalance(9999)).toBe(10);
  });

  it("clips below -10", () => {
    expect(clipWitnessBalance(-11)).toBe(-10);
    expect(clipWitnessBalance(-9999)).toBe(-10);
  });

  it("treats NaN/Infinity as 0", () => {
    expect(clipWitnessBalance(Number.NaN)).toBe(0);
    expect(clipWitnessBalance(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clipWitnessBalance(Number.NEGATIVE_INFINITY)).toBe(0);
  });
});

describe("publicWitness — initPublicWitnessState", () => {
  it("default start is balance 0, no entries", () => {
    expect(initPublicWitnessState()).toEqual({ balance: 0, entries: [] });
  });

  it("honors an openingBalance (for save-resume)", () => {
    expect(initPublicWitnessState({ openingBalance: 5 })).toEqual({
      balance: 5,
      entries: [],
    });
  });

  it("clips an invalid opening balance", () => {
    expect(initPublicWitnessState({ openingBalance: 50 }).balance).toBe(10);
    expect(initPublicWitnessState({ openingBalance: -50 }).balance).toBe(-10);
  });

  it("treats NaN opening as 0", () => {
    expect(
      initPublicWitnessState({ openingBalance: Number.NaN }).balance,
    ).toBe(0);
  });
});

describe("publicWitness — recordOpponentPlay", () => {
  it("appends an entry and updates the running balance", () => {
    const s0 = initPublicWitnessState();
    const s1 = recordOpponentPlay(
      s0,
      entry({ id: "e1", publicDelta: 2, privateDelta: -1 }),
    );
    expect(s1.balance).toBe(2);
    expect(s1.entries.length).toBe(1);
    expect(s1.entries[0].id).toBe("e1");
  });

  it("accumulates across multiple plays", () => {
    let s = initPublicWitnessState();
    s = recordOpponentPlay(s, entry({ id: "a", publicDelta: 2 }));
    s = recordOpponentPlay(s, entry({ id: "b", publicDelta: -1 }));
    s = recordOpponentPlay(s, entry({ id: "c", publicDelta: 4 }));
    expect(s.balance).toBe(5);
    expect(s.entries.map((e) => e.id)).toEqual(["a", "b", "c"]);
  });

  it("clips at +10 on over-accumulation (single-play can't break clip)", () => {
    let s = initPublicWitnessState({ openingBalance: 9 });
    s = recordOpponentPlay(s, entry({ publicDelta: 5 }));
    expect(s.balance).toBe(10);
  });

  it("clips at -10 on under-accumulation", () => {
    let s = initPublicWitnessState({ openingBalance: -9 });
    s = recordOpponentPlay(s, entry({ publicDelta: -5 }));
    expect(s.balance).toBe(-10);
  });

  it("is pure (doesn't mutate input state)", () => {
    const s0 = initPublicWitnessState();
    const s1 = recordOpponentPlay(s0, entry({ publicDelta: 1 }));
    expect(s0.balance).toBe(0);
    expect(s0.entries.length).toBe(0);
    expect(s1).not.toBe(s0);
  });
});

describe("publicWitness — deriveAuthorityVerdictOffset (§5.8 handoff)", () => {
  it("returns +3 at or above the warm threshold", () => {
    expect(deriveAuthorityVerdictOffset(3)).toBe(3);
    expect(deriveAuthorityVerdictOffset(5)).toBe(3);
    expect(deriveAuthorityVerdictOffset(10)).toBe(3);
  });

  it("returns -3 at or below the cool threshold", () => {
    expect(deriveAuthorityVerdictOffset(-3)).toBe(-3);
    expect(deriveAuthorityVerdictOffset(-7)).toBe(-3);
    expect(deriveAuthorityVerdictOffset(-10)).toBe(-3);
  });

  it("returns 0 in the neutral band [-2, +2]", () => {
    expect(deriveAuthorityVerdictOffset(-2)).toBe(0);
    expect(deriveAuthorityVerdictOffset(-1)).toBe(0);
    expect(deriveAuthorityVerdictOffset(0)).toBe(0);
    expect(deriveAuthorityVerdictOffset(1)).toBe(0);
    expect(deriveAuthorityVerdictOffset(2)).toBe(0);
  });

  it("treats NaN/Infinity as 0 (never crashes §5.8)", () => {
    expect(deriveAuthorityVerdictOffset(Number.NaN)).toBe(0);
    expect(deriveAuthorityVerdictOffset(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("publicWitness — isEntryDiverged (§3 divergence rule)", () => {
  it("true when signs disagree (private good, public bad)", () => {
    expect(
      isEntryDiverged(entry({ publicDelta: -2, privateDelta: 3 })),
    ).toBe(true);
  });

  it("true when signs disagree (private bad, public good)", () => {
    expect(
      isEntryDiverged(entry({ publicDelta: 2, privateDelta: -3 })),
    ).toBe(true);
  });

  it("false when both positive", () => {
    expect(
      isEntryDiverged(entry({ publicDelta: 2, privateDelta: 3 })),
    ).toBe(false);
  });

  it("false when both negative", () => {
    expect(
      isEntryDiverged(entry({ publicDelta: -2, privateDelta: -3 })),
    ).toBe(false);
  });

  it("false when either delta is zero (no divergence to render)", () => {
    expect(isEntryDiverged(entry({ publicDelta: 0, privateDelta: 3 }))).toBe(false);
    expect(isEntryDiverged(entry({ publicDelta: 2, privateDelta: 0 }))).toBe(false);
    expect(isEntryDiverged(entry({ publicDelta: 0, privateDelta: 0 }))).toBe(false);
  });
});

describe("publicWitness — public_delta override (§3 divergence)", () => {
  // These assertions exercise the override field directly rather
  // than the full applyPublicWitnessPlay draft path — they confirm
  // the authoring contract that the four tuned Cycle C cards (§5.7
  // playable pool) actually diverge as intended.
  it("Field Medic: private +1, public -2 (obstruction)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cardDef } = require("../cards/definitions/neutral/s1_char_088_field_medic.ts");
    expect(cardDef.verdict_delta).toBe(1);
    expect(cardDef.public_delta).toBe(-2);
  });

  it("Hired Blade: private +1, public -2 (admission of violence)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cardDef } = require("../cards/definitions/neutral/s1_char_090_hired_blade.ts");
    expect(cardDef.verdict_delta).toBe(1);
    expect(cardDef.public_delta).toBe(-2);
  });

  it("Scrapyard Golem: alignment-but-stronger private +1, public +2", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cardDef } = require("../cards/definitions/neutral/s1_char_087_scrapyard_golem.ts");
    expect(cardDef.verdict_delta).toBe(1);
    expect(cardDef.public_delta).toBe(2);
  });

  it("Dischordian Logic: private +1, public -1 (paradox)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cardDef } = require("../cards/definitions/neutral/s1_spell_123_dischordian_logic.ts");
    expect(cardDef.verdict_delta).toBe(1);
    expect(cardDef.public_delta).toBe(-1);
  });

  it("divergence check fires on sign disagreement", () => {
    // Medic + Blade + Logic all have private+/public- → diverged
    // Golem has both positive → not diverged
    expect(
      isEntryDiverged({
        id: "e",
        turnNumber: 1,
        publicLabel: "defensive",
        publicDelta: -2,
        privateDelta: 1,
        cardDefId: "s1_char_088",
      }),
    ).toBe(true);
    expect(
      isEntryDiverged({
        id: "e",
        turnNumber: 1,
        publicLabel: "defensive",
        publicDelta: 2,
        privateDelta: 1,
        cardDefId: "s1_char_087",
      }),
    ).toBe(false);
  });
});

describe("publicWitness — derivePublicLabel", () => {
  const def = (
    cats: CardDefinition["trial_categories"],
  ): Pick<CardDefinition, "trial_categories"> => ({ trial_categories: cats });

  it("confession wins over every other category", () => {
    expect(derivePublicLabel(def(["confession", "evidence", "narrative"]))).toBe(
      "confession",
    );
  });

  it("evidence beats narrative/reactive/defensive", () => {
    expect(derivePublicLabel(def(["evidence", "narrative"]))).toBe("evidence");
    expect(derivePublicLabel(def(["reactive", "evidence"]))).toBe("evidence");
  });

  it("narrative beats reactive + defensive", () => {
    expect(derivePublicLabel(def(["narrative", "reactive"]))).toBe("narrative");
    expect(derivePublicLabel(def(["defensive", "narrative"]))).toBe("narrative");
  });

  it("single-category cards pass through directly", () => {
    expect(derivePublicLabel(def(["defensive"]))).toBe("defensive");
    expect(derivePublicLabel(def(["reactive"]))).toBe("reactive");
  });

  it("falls back to 'procedural' when no categories are authored", () => {
    expect(derivePublicLabel(def(undefined))).toBe("procedural");
    expect(derivePublicLabel(def([]))).toBe("procedural");
  });
});

describe("publicWitness — end-to-end (§5.7 → §5.8 handoff)", () => {
  it("player who stays in the neutral band hands off 0 to §5.8", () => {
    let s = initPublicWitnessState();
    s = recordOpponentPlay(s, entry({ publicDelta: 1 }));
    s = recordOpponentPlay(s, entry({ publicDelta: -1 }));
    s = recordOpponentPlay(s, entry({ publicDelta: 2 }));
    s = recordOpponentPlay(s, entry({ publicDelta: -1 }));
    expect(deriveAuthorityVerdictOffset(s.balance)).toBe(0);
  });

  it("player who crosses into warm hands off +3", () => {
    let s = initPublicWitnessState();
    s = recordOpponentPlay(s, entry({ publicDelta: 2 }));
    s = recordOpponentPlay(s, entry({ publicDelta: 2 }));
    expect(s.balance).toBe(4);
    expect(deriveAuthorityVerdictOffset(s.balance)).toBe(3);
  });

  it("player who crosses into cool hands off -3", () => {
    let s = initPublicWitnessState();
    s = recordOpponentPlay(s, entry({ publicDelta: -2 }));
    s = recordOpponentPlay(s, entry({ publicDelta: -2 }));
    expect(s.balance).toBe(-4);
    expect(deriveAuthorityVerdictOffset(s.balance)).toBe(-3);
  });
});
