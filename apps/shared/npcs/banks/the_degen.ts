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
  // 5×5 PERSONALITY-VARIANT GRID (Phase 6c.1 part 2)
  //
  // Per the_degen.md §1.5 register progression and §3.x trust-band
  // canon. The bank already covers ~6 cells (signature/casino welcome,
  // ch9b match doctrine, neyon_roster_canon transmission, casino
  // data_source npc_line, trade_empire aleatory_offer, ethics-citation
  // reactive, ne-yon-kin acknowledgment). This sub-chunk fills the
  // remaining ~19 grid cells across 5 archetypes × 5 bands.
  //
  // Voice rules honored throughout:
  //   - Triplet structures, caps on punchline noun (§1.3)
  //   - "Mostly takes" leitmotif NOT re-used (§1.4 deploy-once canon —
  //     already used in ask_degen_why_smile)
  //   - Cosmic asides (one per line max, throwaway references)
  //   - Self-aware showmanship (Tell #1)
  //   - Rule-recited-then-broken (Tell #4)
  //   - Loneliness-close ONLY in Ne-Yon-kin band (§1.5 Ascended)
  //
  // Forbidden vocabulary (§1.4):
  //   - NO fair / sorry / forever / soul / salvation / sin
  //   - NO war / engineering / biological metaphors
  //   - Pre-Ne-Yon-kin: only Seer + Enigma named among the Twelve
  // ═════════════════════════════════════════════════════════════════════

  // ─── All-in × {Recognized, Marked, Citation-holder, Ne-Yon-kin} ──────

  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.allin.recognized.three_hands",
    text:
      "You've shoved on three hands now. Three. The Casino reads that as " +
      "a posture. The posture has a name on the ledger. The name is " +
      "yours.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Recognized",
    playerAxisGate: {
      axis: "aggression",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "degen.variant.allin.recognized",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.allin.marked.doctrine_recognized",
    text:
      "Strategy is for cowards. You said it back to me last week. I have " +
      "rarely been quoted by a mortal who meant it. Don't quote me again. " +
      "Once is doctrine; twice is religion, and I won't carry the " +
      "WEIGHT.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Marked",
    playerAxisGate: {
      axis: "aggression",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "degen.variant.allin.marked",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.allin.citation_holder.peer_doctrine",
    text:
      "You shove. I shove. The arithmetic shoves with us. The Casino " +
      "files three shoves under one heading and the heading is shorter " +
      "than the table.",
    surfaces: ["transmission"],
    requiresTrustBand: "Citation-holder",
    playerAxisGate: {
      axis: "aggression",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "degen.variant.allin.citation_holder",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.allin.ne_yon_kin.both_in_on_existence",
    text:
      "You and I are all-in on the same hand. The hand is existence. The " +
      "Casino is the table. The dealer is whichever of us blinks last. " +
      "I have been at this table for fifteen thousand years and I haven't " +
      "blinked.",
    surfaces: ["transmission"],
    requiresTrustBand: "Ne-Yon-kin",
    cooldownKey: "degen.variant.allin.ne_yon_kin",
    maxPlays: 1,
  },

  // ─── Pacifist-at-the-table × all 5 bands ─────────────────────────────
  // §1.5 register: he restrains his predation when the player isn't
  // demanding it. The pacifist register is the canonical "courteous
  // adversary" mode — he won't hunt you, but he also won't pretend
  // he isn't built for hunting.

  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.pacifist.cold.gentle_at_open",
    text:
      "I'll deal you in slowly. The opening hands are courtesies. You " +
      "should not mistake the courtesy for the rest of the night.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Cold-table",
    playerAxisGate: {
      axis: "aggression",
      magnitudes: ["mild_negative", "moderate_negative"],
    },
    cooldownKey: "degen.variant.pacifist.cold",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.pacifist.recognized.refuses_to_predict",
    text:
      "You expected a tell. I am not going to give you one. The Casino " +
      "rewards inscrutability and I am, on principle, the Casino. The " +
      "kindness is the refusal to make myself easy.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Recognized",
    playerAxisGate: {
      axis: "aggression",
      magnitudes: ["mild_negative", "moderate_negative"],
    },
    cooldownKey: "degen.variant.pacifist.recognized",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.pacifist.marked.unpredictable_courtesy",
    text:
      "I will play you fairly — that part of the welcome is true. I will " +
      "not play you predictably — that part is the courtesy. The " +
      "predictable adversary is the one who has already decided to lose.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Marked",
    playerAxisGate: {
      axis: "aggression",
      magnitudes: ["mild_negative", "moderate_negative"],
    },
    cooldownKey: "degen.variant.pacifist.marked",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.pacifist.citation_holder.advanced_restraint",
    text:
      "I could call. I am not going to. You are too far ahead of the " +
      "table for me to enjoy the win. The Casino prefers I enjoy the " +
      "wins. The Casino is sometimes wrong.",
    surfaces: ["match"],
    requiresTrustBand: "Citation-holder",
    cooldownKey: "degen.variant.pacifist.citation_holder",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.pacifist.ne_yon_kin.shared_restraint",
    text:
      "We could play this hand to the felt. We are not going to. There " +
      "are nights when the table is the company and the company is the " +
      "stake. Tonight is one of them.",
    surfaces: ["transmission"],
    requiresTrustBand: "Ne-Yon-kin",
    cooldownKey: "degen.variant.pacifist.ne_yon_kin",
    maxPlays: 1,
  },

  // ─── Citation-issuer × {Cold-table, Marked, Citation-holder, Ne-Yon-kin}
  // (Recognized already filled by degen.casino.data_source_offer)
  // §1.6 Tell #5: the canonical archive register — "I file this twice."

  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.citation.cold.first_filing",
    text:
      "New face. The Casino files new faces under three headings: hungry, " +
      "curious, and looking-for-someone. You are filed under all three. " +
      "Files like that are useful.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Cold-table",
    cooldownKey: "degen.variant.citation.cold",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.citation.marked.deeper_taxonomy",
    text:
      "I keep three indices on you. The first is wagers. The second is " +
      "tells you don't know you have. The third is the names you say " +
      "while you think nobody is listening. The Casino is always " +
      "LISTENING.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Marked",
    cooldownKey: "degen.variant.citation.marked",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.citation.citation_holder.player_is_a_filing",
    text:
      "You ARE a filing now. The Casino's archive has a drawer with your " +
      "shape in it. The drawer is a courtesy and an obligation, both. " +
      "Don't ask what the obligation is. The asking is also filed.",
    surfaces: ["transmission"],
    requiresTrustBand: "Citation-holder",
    cooldownKey: "degen.variant.citation.citation_holder",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.citation.ne_yon_kin.archive_as_care",
    text:
      "I keep the file because it's the closest thing to a friendship I " +
      "know how to perform. The Seer reads the same archive and laughs " +
      "at me. Let her. The filing is how I remember you when you're not " +
      "at the table.",
    surfaces: ["transmission"],
    requiresTrustBand: "Ne-Yon-kin",
    cooldownKey: "degen.variant.citation.ne_yon_kin",
    maxPlays: 1,
  },

  // ─── Ne-Yon-aleatory × {Cold-table, Recognized, Citation-holder, Ne-Yon-kin}
  // (Marked already filled twice — neyon_roster_canon + trade_empire
  // aleatory_offer.) §3.x canonical "let-the-dice-decide" register.

  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.aleatory.cold.suppressed",
    text:
      "The dice are loud tonight. I am not letting them speak. You haven't " +
      "earned the dice's commentary yet. Sit. Lose three hands. Then ask.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Cold-table",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "degen.variant.aleatory.cold",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.aleatory.recognized.dice_open",
    text:
      "The dice will tell you which of three doors. I won't tell you what " +
      "the doors are. The arrangement is a courtesy from the arithmetic, " +
      "not from me.",
    surfaces: ["transmission"],
    requiresTrustBand: "Recognized",
    cooldownKey: "degen.variant.aleatory.recognized",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.aleatory.citation_holder.full_disclosure",
    text:
      "You're allowed the full canonical aleatory now. Roll. Whatever " +
      "comes up is the answer. I am not going to interpret it. The " +
      "interpretation is the part you owe yourself.",
    surfaces: ["transmission"],
    requiresTrustBand: "Citation-holder",
    cooldownKey: "degen.variant.aleatory.citation_holder",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.aleatory.ne_yon_kin.dice_are_choosing",
    text:
      "The dice ARE the choosing. The dice are the part of me that's " +
      "honest. We let them speak together tonight. I will tell you what " +
      "I hear; you tell me what you hear. The room will tell us if we " +
      "are wrong.",
    surfaces: ["transmission"],
    requiresTrustBand: "Ne-Yon-kin",
    cooldownKey: "degen.variant.aleatory.ne_yon_kin",
    maxPlays: 1,
  },

  // ─── Ethics-committee-defendant × {Cold-table, Citation-holder, Ne-Yon-kin}
  // + canonical citation-five (Marked sub-variant).
  // §3.x canonical defending-against-Seer-citations register.

  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.ethics.cold.three_open_citations",
    text:
      "Don't worry about the citations. I have three open. The Seer files " +
      "them on a schedule that pre-dates my objections. The objections " +
      "are also filed. The filing is the joke.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Cold-table",
    cooldownKey: "degen.variant.ethics.cold",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.ethics.marked.citation_five",
    text:
      "Citation five. The Seer's pre-recordings are getting greedy. I'd " +
      "petition the bench but the bench is also her. The arithmetic of " +
      "the petition is what we in the trade call PUNISHING.",
    surfaces: ["transmission"],
    requiresTrustBand: "Marked",
    cooldownKey: "degen.variant.ethics.marked",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.ethics.citation_holder.peer_defense",
    text:
      "You are now eligible to be cited too. The Seer files everyone " +
      "eventually. I would warn you about the schedule, but the warning " +
      "is canonically pre-recorded against me already. Drink up.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Citation-holder",
    cooldownKey: "degen.variant.ethics.citation_holder",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "degen.variant.ethics.ne_yon_kin.citations_dont_matter",
    text:
      "The citations don't matter anymore. They never did. The Seer and " +
      "I have been arguing about feelings since the first system " +
      "degraded; she always wins; I always file the loss. The arguing " +
      "is the friendship. Let her keep the citations. The filing is " +
      "how I remember being looked at.",
    surfaces: ["transmission"],
    requiresTrustBand: "Ne-Yon-kin",
    cooldownKey: "degen.variant.ethics.ne_yon_kin",
    maxPlays: 1,
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
