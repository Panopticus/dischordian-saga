// apps/shared/socialLinkRanks.ts
//
// Phase 4 — Persona-style social-link rank progression per character.
//
// Per the priority plan §Phase 4: extends the existing thoughtCabinet.ts
// (~80% Persona coverage) with explicit rank progression (1-5 per NPC)
// gated on cumulative trust-band-time + cross-system shared events.
//
// Per character:
//   Rank 1 — first-meeting
//   Rank 2 — first-shared-mission (or canonical first-shared-event)
//   Rank 3 — first-trust-band crossing (canonically Witnessed / Present)
//   Rank 4 — first-canonical-vulnerability moment (bible-canonical scene)
//   Rank 5 — canonical confidant scene (highest band; bible-locked event)
//
// Rank-up unlocks canonical thought-cabinet content + dialog branches.

import type { NpcKey } from "./npcs/types";

export type SocialLinkRank = 1 | 2 | 3 | 4 | 5;

export interface SocialLinkUnlockCriterion {
  /** Required public flag (canonical visible event) — primary gate. */
  publicFlag?: string;
  /** Minimum trust-band the player must have reached. */
  minTrustBand?: string;
  /** Optional minimum cumulative interactions. */
  minInteractions?: number;
  /** Optional minimum saga act. */
  minAct?: number;
}

export interface SocialLinkRankDef {
  rank: SocialLinkRank;
  /** Human-readable label rendered in social-link UI. */
  label: string;
  /** Lore-context blurb (can be multi-paragraph). */
  loreBlurb: string;
  /** Unlock criteria — ALL must be met. */
  unlockCriteria: SocialLinkUnlockCriterion;
  /** Canonical thought-cabinet thought-id unlocked at this rank (optional). */
  unlocksThoughtId?: string;
  /** Canonical narrative flag set when this rank is reached. */
  setsFlag: string;
}

export interface SocialLinkLadder {
  npcKey: NpcKey;
  /** Ladder name (rendered in UI; defaults to NPC name). */
  ladderLabel: string;
  ranks: ReadonlyArray<SocialLinkRankDef>;
}

// --- Per-character ladders -----------------------------------------------

const LOCKE_LADDER: SocialLinkLadder = {
  npcKey: "adjudicator_locke",
  ladderLabel: "The Adjudicator",
  ranks: [
    {
      rank: 1,
      label: "Rank 1 — Prospect",
      loreBlurb: "You met at the Authority's ledger. She filed you under unpriced.",
      unlockCriteria: { publicFlag: "met_adjudicator_locke" },
      setsFlag: "social_link_locke_rank_1",
    },
    {
      rank: 2,
      label: "Rank 2 — Client",
      loreBlurb:
        "First contract signed. The retainer is small; the file is not. Locke " +
        "has begun building an actuarial picture of you.",
      unlockCriteria: { minTrustBand: "Client" },
      setsFlag: "social_link_locke_rank_2",
    },
    {
      rank: 3,
      label: "Rank 3 — Partner",
      loreBlurb:
        "Trade Coin keepsake unlocked. Locke offers you a chair near the third " +
        "column — the audit-friendly contracts. Trust has earned you a register " +
        "shift: she names you, occasionally, in the second person.",
      unlockCriteria: { minTrustBand: "Partner" },
      unlocksThoughtId: "thought_locke_trade_coin",
      setsFlag: "social_link_locke_rank_3",
    },
    {
      rank: 4,
      label: "Rank 4 — Insider",
      loreBlurb:
        "The deferred-threat moment. Locke tells you, plainly, that there is " +
        "a leak this week and she has not decided whether you are stopping it " +
        "or being the one she reports. Vulnerability through honesty.",
      unlockCriteria: { minTrustBand: "Insider", minAct: 4 },
      setsFlag: "social_link_locke_rank_4",
    },
    {
      rank: 5,
      label: "Rank 5 — Adjudicated",
      loreBlurb:
        "The canonical confidant scene. Locke audits your file with you in " +
        "the room. The audit is the gift; the file is the affection. From " +
        "here on her cancellation cost on your contracts is symbolic only.",
      unlockCriteria: { minTrustBand: "Adjudicated", minAct: 5 },
      unlocksThoughtId: "thought_locke_audit_witnessed",
      setsFlag: "social_link_locke_rank_5",
    },
  ],
};

const NILMORG_LADDER: SocialLinkLadder = {
  npcKey: "nilmorg",
  ladderLabel: "The Platform",
  ranks: [
    {
      rank: 1,
      label: "Rank 1 — File-holder",
      loreBlurb: "He filed you under Bone. It's not a slur; it's a category.",
      unlockCriteria: { publicFlag: "met_nilmorg" },
      setsFlag: "social_link_nilmorg_rank_1",
    },
    {
      rank: 2,
      label: "Rank 2 — Forecaster",
      loreBlurb: "Your splice signature is recognizable. The actuary stops being theoretical.",
      unlockCriteria: { minTrustBand: "Forecaster" },
      setsFlag: "social_link_nilmorg_rank_2",
    },
    {
      rank: 3,
      label: "Rank 3 — Counterparty",
      loreBlurb: "Chrome tier. He's adjusted his projections for you specifically.",
      unlockCriteria: { minTrustBand: "Counterparty" },
      setsFlag: "social_link_nilmorg_rank_3",
    },
    {
      rank: 4,
      label: "Rank 4 — Severance",
      loreBlurb:
        "Severance Prize paid for you. The Companion arrived. Nilmorg kept his " +
        "agreement. He does not say more. You do not say thank you.",
      unlockCriteria: { publicFlag: "nilmorg_kept_his_agreement" },
      unlocksThoughtId: "thought_companion_was_delivered",
      setsFlag: "social_link_nilmorg_rank_4",
    },
    {
      rank: 5,
      label: "Rank 5 — Counterparty-prime",
      loreBlurb:
        "Dead Man's tier. The Severance Prize is paid. He doesn't say more " +
        "than that to anyone. You've earned the silence. Don't thank him.",
      unlockCriteria: { minTrustBand: "Counterparty-prime" },
      setsFlag: "social_link_nilmorg_rank_5",
    },
  ],
};

const HIEROPHANT_LADDER: SocialLinkLadder = {
  npcKey: "wraith_calder",
  ladderLabel: "The Hierophant",
  ranks: [
    {
      rank: 1,
      label: "Rank 1 — Met in the Long Mourning chamber",
      loreBlurb: "He was Wraith Calder; he is still Wraith Calder; the rite did not erase the name.",
      unlockCriteria: { publicFlag: "met_the_hierophant" },
      setsFlag: "social_link_hierophant_rank_1",
    },
    {
      rank: 2,
      label: "Rank 2 — Wary",
      loreBlurb: "You stood in the room without flinching. The names on the wall continue.",
      unlockCriteria: { minTrustBand: "Wary" },
      setsFlag: "social_link_hierophant_rank_2",
    },
    {
      rank: 3,
      label: "Rank 3 — Witnessed",
      loreBlurb: "The work, the continuation, the wall. You hear the triad now without flattening.",
      unlockCriteria: { minTrustBand: "Witnessed" },
      setsFlag: "social_link_hierophant_rank_3",
    },
    {
      rank: 4,
      label: "Rank 4 — Present",
      loreBlurb:
        "Sacrifice-axis-inversion. The closer you stand, the less he is the threat. " +
        "Trust transformed him. You have stood close.",
      unlockCriteria: {
        minTrustBand: "Present",
        publicFlag: "hierophant_present_band_reached",
      },
      setsFlag: "social_link_hierophant_rank_4",
    },
    {
      rank: 5,
      label: "Rank 5 — Inheriting",
      loreBlurb:
        "He has named the voice he has been listening for. The chamber holds for the " +
        "voice's return. You may bring your Companion now; the chamber is ready.",
      unlockCriteria: {
        minTrustBand: "Inheriting",
        publicFlag: "hierophant_inheriting_band_reached",
      },
      unlocksThoughtId: "thought_hierophant_listening_voice",
      setsFlag: "social_link_hierophant_rank_5",
    },
  ],
};

const SEER_LADDER: SocialLinkLadder = {
  npcKey: "the_seer",
  ladderLabel: "The Seer (recordings)",
  ranks: [
    {
      rank: 1,
      label: "Rank 1 — Mechronis bench (witnessed)",
      loreBlurb: "She did not raise her staff. The bench learned. You watched.",
      unlockCriteria: { minAct: 1 },
      setsFlag: "social_link_seer_rank_1",
    },
    {
      rank: 2,
      label: "Rank 2 — First cold transmission",
      loreBlurb: "Eleven versions of the next four turns. The waiting continues.",
      unlockCriteria: { minTrustBand: "Wary", minAct: 3 },
      setsFlag: "social_link_seer_rank_2",
    },
    {
      rank: 3,
      label: "Rank 3 — First laughter",
      loreBlurb:
        "She laughed. Not at the Engineer; at the Programmer. You are in the " +
        "Programmer's category. That is a specific shelf.",
      unlockCriteria: { minTrustBand: "Witnessed", minAct: 5 },
      setsFlag: "social_link_seer_rank_3",
    },
    {
      rank: 4,
      label: "Rank 4 — Asymmetric kindness received",
      loreBlurb:
        "The hardest line. The Architect's kindness is canonically yours; she " +
        "shipped the honest version because she does not have a dishonest one.",
      unlockCriteria: { publicFlag: "seer_asymmetric_kindness_received" as string, minAct: 4 },
      setsFlag: "social_link_seer_rank_4",
    },
    {
      rank: 5,
      label: "Rank 5 — Thaloria invitation (Confidant)",
      loreBlurb:
        "The door was open before you knocked. The third cup. The chair by the " +
        "window. She is not in the room. She has not been in the room for an " +
        "Empire-era. The room kept itself for you anyway.",
      unlockCriteria: {
        minTrustBand: "Inheriting",
        minAct: 7,
        publicFlag: "seer_confidant_band_reached",
      },
      unlocksThoughtId: "thought_seer_thaloria_invitation",
      setsFlag: "social_link_seer_rank_5",
    },
  ],
};

const COMPANION_LADDER: SocialLinkLadder = {
  npcKey: "dmc_clone_companion",
  ladderLabel: "The Companion (delivered)",
  ranks: [
    {
      rank: 1,
      label: "Rank 1 — First glyph (recognition)",
      loreBlurb: "The soul-fragment recognized the source. The glyph held 1.8 seconds.",
      unlockCriteria: { publicFlag: "nilmorg_kept_his_agreement" },
      setsFlag: "social_link_companion_rank_1",
    },
    {
      rank: 2,
      label: "Rank 2 — First posture (leaning)",
      loreBlurb: "Curiosity-shape. The fragment is canonical-interested in canonical-things.",
      unlockCriteria: { minTrustBand: "Witnessed" },
      setsFlag: "social_link_companion_rank_2",
    },
    {
      rank: 3,
      label: "Rank 3 — Half-syllables (foreshadow)",
      loreBlurb:
        "A breath drawn for speech, then released without shape. The canonical-" +
        "almost-speaking is the canonical-foreshadow.",
      unlockCriteria: { minTrustBand: "Present" },
      setsFlag: "social_link_companion_rank_3",
    },
    {
      rank: 4,
      label: "Rank 4 — First word (singular)",
      loreBlurb:
        "The Companion spoke. One word. Singular and irreversible. You will " +
        "remember the word for the rest of the saga.",
      unlockCriteria: { publicFlag: "companion_first_word_was_wraith_calder" as string },
      unlocksThoughtId: "thought_companion_first_word",
      setsFlag: "social_link_companion_rank_4",
    },
    {
      rank: 5,
      label: "Rank 5 — Named personality",
      loreBlurb:
        "You named her. She accepted. A name you choose for yourself is not " +
        "the name that wakes you up. She needed yours.",
      unlockCriteria: { publicFlag: "companion_structural_identity_acknowledged" },
      setsFlag: "social_link_companion_rank_5",
    },
  ],
};

// --- Registry -------------------------------------------------------------

export const SOCIAL_LINK_LADDERS: ReadonlyArray<SocialLinkLadder> = [
  LOCKE_LADDER,
  NILMORG_LADDER,
  HIEROPHANT_LADDER,
  SEER_LADDER,
  COMPANION_LADDER,
];

/** Resolve a ladder by NPC key. */
export function ladderFor(npcKey: NpcKey): SocialLinkLadder | undefined {
  return SOCIAL_LINK_LADDERS.find(l => l.npcKey === npcKey);
}

/** Resolve a specific rank for a NPC. */
export function rankDef(npcKey: NpcKey, rank: SocialLinkRank): SocialLinkRankDef | undefined {
  return ladderFor(npcKey)?.ranks.find(r => r.rank === rank);
}

// --- Rank-up resolver -----------------------------------------------------

export interface RankUpContext {
  /** Current rank (0 if not started). */
  currentRank: number;
  /** Player's current public flags. */
  publicFlags: ReadonlySet<string>;
  /** Player's narrative flags. */
  flags: ReadonlySet<string>;
  /** Current trust band for the NPC. */
  trustBand?: string;
  /** Trust-band ordinal index per the NPC's bands array. */
  trustBandIndex?: number;
  /** Minimum-band ordinal index lookup (per NPC ladder threshold). */
  bandOrdinalOf?: (band: string) => number;
  /** Cumulative interactions. */
  interactions: number;
  /** Current saga act. */
  act: number;
}

/**
 * Returns the highest rank the player has canonically reached for a given
 * NPC (or 0 if no rank earned). Walks ranks in canonical order; stops at
 * the first rank whose criteria the player does not meet.
 */
export function currentSocialLinkRank(
  npcKey: NpcKey,
  ctx: RankUpContext,
): number {
  const ladder = ladderFor(npcKey);
  if (!ladder) return 0;
  let achieved = ctx.currentRank;
  for (const rankDef of ladder.ranks) {
    if (rankDef.rank <= achieved) continue;
    const c = rankDef.unlockCriteria;
    if (c.publicFlag && !ctx.publicFlags.has(c.publicFlag)) continue;
    if (c.minTrustBand !== undefined) {
      if (!ctx.bandOrdinalOf) continue;
      const required = ctx.bandOrdinalOf(c.minTrustBand);
      const current = ctx.trustBandIndex ?? -1;
      if (current < required) continue;
    }
    if (c.minInteractions !== undefined && ctx.interactions < c.minInteractions) continue;
    if (c.minAct !== undefined && ctx.act < c.minAct) continue;
    achieved = rankDef.rank;
  }
  return achieved;
}
