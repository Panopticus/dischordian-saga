// apps/shared/npcs/banks/the_degen.ts
//
// Phase 3 — The Degen's NpcLine bank.
//
// Per the_degen.md §§1-6 voice samples + §3.2 Ne-Yon-aleatory canon.
// The Degen chose gambling as his Ne-Yon domain (per Seer bible §3.2:
// "Every Ne-Yon chose a domain. The Seer chose prophecy. The Enigma
// chose truth. I chose gambling.").
//
// Trust bands per registry: Cold-table (0) / Recognized (25) / Marked
// (50) / Citation-holder (75) / Ne-Yon-kin (90).
//
// Personality archetypes (5×5 trust-phase × variant grid per bible):
//   - All-in / Pacifist-at-the-table / Citation-issuer / Ne-Yon-aleatory
//     / Ethics-committee-defendant
//
// Two canonical Degen-on-Seer lines per Seer §4.8:
//   - "Every Ne-Yon chose a domain..."
//   - "Especially not the Seer — she runs the ethics committee on
//      feelings and I have three open citations already."

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_degen" as const;

export const THE_DEGEN_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE FIRST-MEETING (cinematic, casino arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.signature.casino_welcome",
    text:
      "Welcome to the Casino. The house has an edge. The edge is me. I " +
      "will play you fairly. I will not, however, play you predictably. " +
      "Strategy is for cowards. Sit down.",
    surfaces: ["cinematic"],
    cooldownKey: "degen.casino_signature",
    maxPlays: 1,
    setsFlags: ["broker_degen_first_meeting"],
    setsPublicFlags: ["met_the_degen"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CH9B MATCH (canonical Antiquarian-cycle Gambler's Truth)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.match.ch9b.all_in_doctrine",
    text:
      "I go all-in every turn. Strategy is for cowards. Pacing is for " +
      "people who plan to die slowly. I plan to die loud, when the " +
      "arithmetic catches up.",
    surfaces: ["match"],
    cooldownKey: "degen.match.ch9b_intro",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "degen.match.ch9b.win.smaller_jars",
    text:
      "Hm. He'll learn smaller jars. The Antiquarian collects grief by " +
      "the gram; I collect it by the season. You took a season off him. " +
      "I'll be impressed when I figure out whether to be.",
    surfaces: ["match"],
    unlockFlags: ["ch9b_player_won"],
    cooldownKey: "degen.match.ch9b_win",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "degen.match.ch9b.loss.specific_attention",
    text:
      "He has your specific attention now. That's a category I file " +
      "twice — once with a date, once with a wager. Pick yourself up. " +
      "The next table will be cold-shuffled.",
    surfaces: ["match"],
    unlockFlags: ["ch9b_player_lost"],
    cooldownKey: "degen.match.ch9b_loss",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // NE-YON KIN CANON (transmission — references Seer per §4.8)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.transmission.neyon_roster_canon",
    text:
      "Every Ne-Yon chose a domain. The Seer chose prophecy. The Enigma " +
      "chose truth. I chose gambling. We don't talk about the other " +
      "nine. The other nine prefer it that way. Especially not the " +
      "Seer — she runs the ethics committee on feelings and I have " +
      "three open citations already.",
    surfaces: ["transmission"],
    requiresTrustBand: "Marked",
    cooldownKey: "degen.neyon_canon_disclosure",
    maxPlays: 1,
    setsFlags: ["degen_neyon_roster_disclosed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CASINO DATA-SOURCE (npc_line — broker-engagement context per §5.8)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.casino.data_source_offer",
    text:
      "Your recent play at the Casino suggests you can handle this. I " +
      "do not say that lightly. The Casino reads people in nine ways " +
      "and prints the synthesis on cocktail napkins. Yours says you " +
      "are willing to be wrong on purpose. I have a contract that " +
      "rewards exactly that quality.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Recognized",
    cooldownKey: "degen.casino_data_source",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // TRADE EMPIRE CASINO INTEGRATION
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.trade_empire.aleatory_offer",
    text:
      "The contract is calibrated. Aleatory in mid-stage, deterministic " +
      "at the close. You get the random part for free; the deterministic " +
      "part costs your reputation with whichever faction loses the dice. " +
      "Sign or pass. The table doesn't wait.",
    surfaces: ["trade_empire"],
    requiresTrustBand: "Marked",
    cooldownKey: "degen.trade_empire.aleatory_offer",
  },

  // ═════════════════════════════════════════════════════════════════════
  // ETHICS-COMMITTEE-DEFENDANT (reactive — Seer reaches him)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.reactive.ethics_committee_citation",
    text:
      "Citation four. Lovely. The Seer's pre-recordings are landing on " +
      "schedule. I'd argue the case but the case canonically pre-decided " +
      "before I started arguing. That is the part of being a Ne-Yon I " +
      "object to most.",
    surfaces: ["transmission"],
    reactsToPublicFlag: "seer_confidant_band_reached",
    cooldownKey: "degen.ethics_citation_four",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // NE-YON-KIN BAND (highest trust — Inner roster acknowledgment)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.neyon_kin.acknowledgment",
    text:
      "I liked you. That's unprofessional for a Ne-Yon. Don't tell " +
      "anyone. The Seer probably knows already; the Seer probably knew " +
      "before I did. That's also fine. We file these things and we move " +
      "the deck.",
    surfaces: ["transmission"],
    requiresTrustBand: "Ne-Yon-kin",
    cooldownKey: "degen.neyon_kin_acknowledgment",
    maxPlays: 1,
    setsPublicFlags: ["degen_acknowledged_player_as_kin"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "degen.cinematic.catchall",
    text: "The table is open. The arithmetic is ugly. Sit down anyway.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "degen.match.catchall",
    text: "Strategy is for cowards. I respect cowards. They live longer.",
    surfaces: ["match"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "degen.transmission.catchall",
    text: "[A wager-receipt arrives. The receipt is unsigned. The Degen never signs first.]",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "degen.npc_line.catchall",
    text: "Make the bet. Make the worse bet. Either way I file you under 'interesting'.",
    surfaces: ["npc_line"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "degen.trade_empire.catchall",
    text: "Risk-adjusted? Risk-unadjusted is the only honest column. Pick one.",
    surfaces: ["trade_empire"],
  },
];
