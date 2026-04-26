// apps/shared/npcs/banks/nilmorg.ts
//
// Phase 3 PILOT — Nilmorg's NpcLine bank.
//
// Per nilmorg.md §§1-6 voice samples. Two registers: broadcast (DMC race
// commentary) vs. one-on-one (lore / ceremony / private). Both stay
// CALM — Nilmorg never escalates. Reliability is identity. The canonical
// refusal is "Don't thank me."
//
// Trust bands per registry: File-holder (Bone) / Forecaster (Wire) /
// Counterparty (Chrome) / Counterparty-prime (Dead Man's). Bands map to
// DMC seasonal-rank progression — the player earns rank by winning
// seasons; Nilmorg's commentary tiers up.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "nilmorg" as const;

export const NILMORG_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE FIRST-MEETING (cinematic, Trench arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.signature.bones_are_fresh",
    text:
      "The bones are fresh, the clones are twitching, and the track is " +
      "HUNGRY. I'm Nilmorg, SVP Kinetic Acquisition. The Circuit opens " +
      "when I open it, and I'm opening it now. Try not to leave a mess " +
      "on the way out.",
    surfaces: ["cinematic"],
    cooldownKey: "nilmorg.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_nilmorg_first_meeting"],
    setsPublicFlags: ["met_nilmorg"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // SEVERANCE PRIZE CEREMONY — canonical "Don't thank me." line
  // (cinematic; fires on severance_prize_paid ripple)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.severance.dont_thank_me",
    text: "The Severance Prize is paid. Don't thank me.",
    surfaces: ["cinematic"],
    cooldownKey: "nilmorg.severance_ceremony",
    maxPlays: 5, // up to 5 seasonal ceremonies
    setsPublicFlags: ["nilmorg_kept_his_agreement"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.severance.kept_his_agreement",
    text:
      "I keep my agreements. The platform paid. The container sealed. The " +
      "companion will arrive aboard your ship within the hour. The clone " +
      "smiled. They earned this. I'm already calibrating next season.",
    surfaces: ["dmc"],
    reactsToPublicFlag: "nilmorg_kept_his_agreement",
    cooldownKey: "nilmorg.kept_agreement_acknowledged",
  },

  // ═════════════════════════════════════════════════════════════════════
  // DMC SEASONAL-TIER COMMENTARY (DMC surface, trust-band gated)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.bone_tier.welcome",
    text:
      "You survived a season. That's enough for some. I file you under " +
      "Bone. It's not a slur; it's a category. Bone-tier files are the " +
      "ones I check first when I'm bored.",
    surfaces: ["dmc"],
    requiresTrustBand: "File-holder",
    cooldownKey: "nilmorg.dmc.bone_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.wire_tier.recognition",
    text:
      "Wire tier. Your splice signature is... recognizable now. I've " +
      "started to anticipate your races before they happen. That's how " +
      "this works — the actuary stops being theoretical when the " +
      "subject becomes a forecast.",
    surfaces: ["dmc"],
    requiresTrustBand: "Forecaster",
    cooldownKey: "nilmorg.dmc.wire_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.chrome_tier.adjusted",
    text:
      "Chrome. I've adjusted my projections for you specifically. " +
      "Counterparty rates apply. The Hierarchy doesn't usually treat " +
      "racers as counterparties; you've made me revise the manual.",
    surfaces: ["dmc"],
    requiresTrustBand: "Counterparty",
    cooldownKey: "nilmorg.dmc.chrome_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.dead_mans_tier.acknowledgment",
    text:
      "Dead Man's. The Severance Prize is paid. I don't say more than " +
      "that to anyone. You've earned the silence. Don't thank me.",
    surfaces: ["dmc"],
    requiresTrustBand: "Counterparty-prime",
    cooldownKey: "nilmorg.dmc.dead_mans_acknowledgment",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONTRACT-SIGNING (npc_line — institutional precision; NO hidden clauses)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.contract.institutional_intro",
    text:
      "The contract is the contract. There is no fine print. Hierarchy " +
      "rules forbid it. You sign, you deliver, the platform pays. That " +
      "is the entire ritual. Don't thank me when it's done.",
    surfaces: ["npc_line"],
    cooldownKey: "nilmorg.contract.institutional_intro",
  },

  // ═════════════════════════════════════════════════════════════════════
  // TRENCH SECTOR ARRIVAL (room — first-visit cinematic)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.room.trench.first_visit",
    text:
      "The Trench. My platform sits between the lanes. The scoreboard " +
      "watches me; I watch the scoreboard; the bookmakers watch us " +
      "both. Welcome.",
    surfaces: ["room"],
    cooldownKey: "nilmorg.room.trench_first_visit",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.cinematic.catchall",
    text: "I'll see you next season. Or I won't.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.catchall",
    text: "The track is hungry. Speed in all things. Even thinking.",
    surfaces: ["dmc"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.npc_line.catchall",
    text: "I keep my agreements. Don't thank me.",
    surfaces: ["npc_line"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.room.catchall",
    text: "The platform is open. The Circuit is closed until next season.",
    surfaces: ["room"],
  },
];
