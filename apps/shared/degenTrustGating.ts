/* ═══════════════════════════════════════════════════════
   DEGEN TRUST GATING — Dead Man's Circuit reveal

   The Degen runs the Casino above the Trench. The Hierarchy
   races (Dead Man's Circuit) run BELOW the Trench. The
   Degen knows. He will not tell the player about DMC until
   they have proven they can sit at his table without acting
   like they are owed something.

   Trust source: Pazaak wins at the Casino + Casino visits.
   Each Pazaak win advances trust by 1 (cap 10). The DMC
   reveal opens at trust 5; the entry pass at trust 8.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

export const DEGEN_TRUST_CAP = 10;
export const DMC_REVEAL_TRUST = 5;
export const DMC_ENTRY_TRUST = 8;

export interface DegenTrustState {
  /** 0..DEGEN_TRUST_CAP. Persisted on the player profile. */
  trust: number;
  /** Number of Pazaak hands won (history surface). */
  pazaakWins: number;
  /** Number of Casino visits. */
  casinoVisits: number;
}

export interface DegenTrustGate {
  systemId: "casino_back_room" | "dmc_rumor" | "dmc_entry_pass";
  requiresTrust: number;
  label: string;
  /** Degen's voice on what unlocks here, in fiction. */
  degenLine: string;
}

export const DEGEN_TRUST_GATES: ReadonlyArray<DegenTrustGate> = [
  {
    systemId: "casino_back_room",
    requiresTrust: 1,
    label: "The back room",
    degenLine:
      "You have a face the table can read. That is rare. Come back. Sit again. The back room is for people who sit twice.",
  },
  {
    systemId: "dmc_rumor",
    requiresTrust: DMC_REVEAL_TRUST,
    label: "DMC — the rumor",
    degenLine:
      "There's something on the lower decks. The Hierarchy runs races. Real races. Real consequences. Nilmorg's operation. I won't ask if you've heard. I'll only ask if you want to.",
  },
  {
    systemId: "dmc_entry_pass",
    requiresTrust: DMC_ENTRY_TRUST,
    label: "DMC — entry pass",
    degenLine:
      "Here's a pass. One race. One entry. The pass is mine — I am vouching for you down there, which means if you do anything stupid I have to vouch again with my own face. So please do not be stupid. The Trench does not return faces.",
  },
];

/** Trust earned per Pazaak win, capped at DEGEN_TRUST_CAP. */
export function applyPazaakWin(state: DegenTrustState): DegenTrustState {
  const trust = Math.min(state.trust + 1, DEGEN_TRUST_CAP);
  return {
    ...state,
    trust,
    pazaakWins: state.pazaakWins + 1,
  };
}

export function applyCasinoVisit(state: DegenTrustState): DegenTrustState {
  return { ...state, casinoVisits: state.casinoVisits + 1 };
}

export function gatesForTrust(trust: number): DegenTrustGate[] {
  return DEGEN_TRUST_GATES.filter((g) => trust >= g.requiresTrust);
}

export function dmcRumorUnlocked(state: DegenTrustState): boolean {
  return state.trust >= DMC_REVEAL_TRUST;
}

export function dmcEntryUnlocked(state: DegenTrustState): boolean {
  return state.trust >= DMC_ENTRY_TRUST;
}
