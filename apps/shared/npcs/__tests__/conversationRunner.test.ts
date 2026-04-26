// apps/shared/npcs/__tests__/conversationRunner.test.ts
//
// Phase 6 Infrastructure Deliverable 3a verification.
// Validates the pure functional state machine using bible-faithful
// fixtures that mirror the Phase 6e.2 multi-turn chain spec — Locke
// contract-negotiation chain (4 lines: signing-intro → hidden-clause-
// disclosure → counter-offer → signing-completion).

import { describe, it, expect } from "vitest";
import {
  startConversation,
  getCurrentLine,
  getChoices,
  advanceWithChoice,
  advanceAuto,
  endConversation,
  type LineLookup,
} from "../conversationRunner";
import type { NpcLine } from "../types";

// ────────────────────────────────────────────────────────────────────
// Fixture: Locke contract-negotiation chain (canonical 4-line arc per
// the_writers_guide Phase 6e.2 — signing-intro → hidden-clause-
// disclosure → counter-offer → signing-completion).
// ────────────────────────────────────────────────────────────────────

const LINES: ReadonlyArray<NpcLine> = [
  {
    lineId: "locke.contract.signing_intro",
    npcKey: "adjudicator_locke",
    text: "I have brought the contract. Three stages, plain language. Read before you sign.",
    setsFlags: ["locke_contract_offered"],
    choices: [
      {
        id: "ask_about_clauses",
        label: "What's the fine print?",
        followUpLineId: "locke.contract.hidden_clause_disclosure",
        trustDelta: 2,
      },
      {
        id: "sign_blind",
        label: "I'll sign as written.",
        followUpLineId: "locke.contract.signing_completion",
        trustDelta: -1,
        setFlag: "locke_player_signed_blind",
      },
      {
        id: "walk_away",
        label: "Not today.",
        clearFlag: "locke_contract_offered",
        trustDelta: -2,
      },
    ],
  },
  {
    lineId: "locke.contract.hidden_clause_disclosure",
    npcKey: "adjudicator_locke",
    text: "Stage 2 includes a non-compete. Stage 3 includes my standing audit clause. Both are negotiable. Most people don't ask.",
    trustDelta: 1,
    setsPublicFlags: ["locke_disclosed_audit_clause"],
    choices: [
      {
        id: "negotiate",
        label: "Strike the audit clause.",
        followUpLineId: "locke.contract.counter_offer",
        trustDelta: 2,
        publicFlag: "locke_audit_clause_struck",
      },
      {
        id: "accept_disclosed",
        label: "Both stay. I'll sign.",
        followUpLineId: "locke.contract.signing_completion",
        trustDelta: 3,
      },
    ],
  },
  {
    lineId: "locke.contract.counter_offer",
    npcKey: "adjudicator_locke",
    text: "Acceptable. The clause is gone. The retainer rises by twelve percent. Reasonable.",
    nextLineId: "locke.contract.signing_completion",
    setsFlags: ["locke_counter_offer_accepted"],
  },
  {
    lineId: "locke.contract.signing_completion",
    npcKey: "adjudicator_locke",
    text: "Signed. Filed. The Authority will know by the next quarter. So will I.",
    setsFlags: ["locke_contract_signed"],
    setsPublicFlags: ["player_under_locke_retainer"],
    trustDelta: 5,
  },
];

const lookup: LineLookup = (lineId) =>
  LINES.find((l) => l.lineId === lineId) ?? null;

// ────────────────────────────────────────────────────────────────────

describe("startConversation", () => {
  it("seeds the cumulative delta with the entry line's side effects", () => {
    const state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    expect(state.currentLineId).toBe("locke.contract.signing_intro");
    expect(state.history).toEqual(["locke.contract.signing_intro"]);
    expect(state.cumulative.flagsSet).toContain("locke_contract_offered");
    expect(state.ended).toBe(false);
  });

  it("returns an ended state when the entry line is missing (silent-fail)", () => {
    const state = startConversation(
      "adjudicator_locke",
      "no.such.line",
      lookup,
    );
    expect(state.ended).toBe(true);
    expect(state.currentLineId).toBeNull();
    expect(state.history.length).toBe(0);
  });

  it("refuses to start a cross-NPC entry line (npcKey mismatch)", () => {
    const state = startConversation(
      "vex_solene", // wrong NPC for the Locke fixture
      "locke.contract.signing_intro",
      lookup,
    );
    expect(state.ended).toBe(true);
  });
});

describe("getCurrentLine + getChoices", () => {
  it("returns the current line + its choices", () => {
    const state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    const line = getCurrentLine(state, lookup);
    expect(line?.lineId).toBe("locke.contract.signing_intro");
    expect(getChoices(state, lookup).length).toBe(3);
  });

  it("returns null line + empty choices on an ended state", () => {
    const state = endConversation(
      startConversation(
        "adjudicator_locke",
        "locke.contract.signing_intro",
        lookup,
      ),
    );
    expect(getCurrentLine(state, lookup)).toBeNull();
    expect(getChoices(state, lookup).length).toBe(0);
  });
});

describe("advanceWithChoice", () => {
  it("walks to the chosen follow-up line + applies choice deltas + line deltas", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    state = advanceWithChoice(state, "ask_about_clauses", lookup);
    expect(state.currentLineId).toBe(
      "locke.contract.hidden_clause_disclosure",
    );
    // Choice trustDelta (+2) plus next-line trustDelta (+1) = +3
    expect(state.cumulative.trustDelta).toBe(3);
    expect(state.cumulative.publicFlagsSet).toContain(
      "locke_disclosed_audit_clause",
    );
  });

  it("ends the conversation when the chosen choice has no followUpLineId", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    state = advanceWithChoice(state, "walk_away", lookup);
    expect(state.ended).toBe(true);
    expect(state.cumulative.trustDelta).toBe(-2);
    expect(state.cumulative.flagsCleared).toContain(
      "locke_contract_offered",
    );
  });

  it("walks the canonical full negotiation chain end-to-end", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    state = advanceWithChoice(state, "ask_about_clauses", lookup);
    state = advanceWithChoice(state, "negotiate", lookup);
    // 'negotiate' choice has followUpLineId locke.contract.counter_offer.
    // counter_offer has nextLineId → signing_completion (auto-advance step).
    state = advanceAuto(state, lookup);
    expect(state.currentLineId).toBe(
      "locke.contract.signing_completion",
    );
    expect(state.history).toEqual([
      "locke.contract.signing_intro",
      "locke.contract.hidden_clause_disclosure",
      "locke.contract.counter_offer",
      "locke.contract.signing_completion",
    ]);
    // Final state should have the canonical "player under retainer" flag.
    expect(state.cumulative.publicFlagsSet).toContain(
      "player_under_locke_retainer",
    );
    expect(state.cumulative.flagsSet).toContain(
      "locke_counter_offer_accepted",
    );
    expect(state.cumulative.flagsSet).toContain(
      "locke_contract_signed",
    );
  });

  it("throws on a choiceId that doesn't exist on the current line", () => {
    const state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    expect(() =>
      advanceWithChoice(state, "ghost_choice", lookup),
    ).toThrow(/no choice with id/);
  });

  it("returns ended state when followUpLineId points at a missing line (silent-fail)", () => {
    const brokenLookup: LineLookup = (id) => {
      if (id === "locke.contract.signing_intro") {
        return {
          lineId: "locke.contract.signing_intro",
          npcKey: "adjudicator_locke",
          text: "x",
          choices: [
            {
              id: "go",
              label: "go",
              followUpLineId: "missing_line",
            },
          ],
        };
      }
      return null;
    };
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      brokenLookup,
    );
    state = advanceWithChoice(state, "go", brokenLookup);
    expect(state.ended).toBe(true);
  });
});

describe("advanceAuto", () => {
  it("walks via nextLineId on a line without choices", () => {
    // Start on the counter_offer line (nextLineId → signing_completion)
    // — this exercises the autoadvance pathway.
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.counter_offer",
      lookup,
    );
    expect(state.currentLineId).toBe("locke.contract.counter_offer");
    state = advanceAuto(state, lookup);
    expect(state.currentLineId).toBe(
      "locke.contract.signing_completion",
    );
  });

  it("refuses to autoadvance when the line has choices (authoring guard)", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    state = advanceAuto(state, lookup);
    // No advance — still on signing_intro.
    expect(state.currentLineId).toBe("locke.contract.signing_intro");
  });

  it("ends the conversation when the line has neither choices nor nextLineId", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_completion",
      lookup,
    );
    state = advanceAuto(state, lookup);
    expect(state.ended).toBe(true);
  });
});

describe("endConversation", () => {
  it("marks the state ended without dropping cumulative deltas", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    state = endConversation(state);
    expect(state.ended).toBe(true);
    // Entry-line side effects were already applied and remain.
    expect(state.cumulative.flagsSet).toContain("locke_contract_offered");
  });

  it("is idempotent on an already-ended state", () => {
    let state = startConversation(
      "adjudicator_locke",
      "locke.contract.signing_intro",
      lookup,
    );
    state = endConversation(state);
    const second = endConversation(state);
    expect(second).toEqual(state);
  });
});
