/* ═══════════════════════════════════════════════════════
   COMPANION BANTER — co-present N×N exchanges

   companionComments.ts handles single-speaker reactions to
   triggers. This file handles BANTER: a structured exchange
   between two co-present companions, alternating turns, with
   trigger and presence gates.

   Reference titles: ME2's Garrus/Wrex banter on the Normandy,
   DA:O's party-camp arguments. See plan §A3 in
   /root/.claude/plans/restart-in-plan-mode-wobbly-dawn.md.

   The seed pairs below are intentionally minimal — voice-
   matched proof of concept, not a writing pass. Production
   should add ~30 pairs across the wired roster (Elara, The
   Human, Antiquarian, Locke, Vex, Jericho); see
   apps/shared/npcs/bibles/ for canonical voice references.
   ═══════════════════════════════════════════════════════ */

export type BanterSpeakerId =
  | "elara"
  | "human"
  | "antiquarian"
  | "locke"
  | "vex"
  | "jericho";

export interface BanterPair {
  id: string;
  /** Pair of speakers — order matches `lines[0]` first.
   *  Both must be co-present for the pair to fire. */
  speakers: readonly [BanterSpeakerId, BanterSpeakerId];
  /** Event trigger string (reuses the same trigger vocabulary
   *  as companionComments.ts — e.g. "act_2_complete",
   *  "first_costly_morality_choice"). */
  trigger: string;
  /** Lines spoken in alternation. `lines[0]` ← `speakers[0]`,
   *  `lines[1]` ← `speakers[1]`, then back to `speakers[0]`,
   *  etc. Keep 2–4 lines per pair. */
  lines: readonly string[];
  /** Optional positive flag gate — every flag must be set. */
  requiresFlags?: readonly string[];
  /** Optional negative flag gate — pair is suppressed if any
   *  flag in this list is set. Common use: "romance:committed:
   *  locke" suppresses Locke–Vex flirt banter. */
  excludeFlags?: readonly string[];
  /** Hard play cap. Banter fatigue is a real cost. */
  maxPlays: 1 | 2 | 3;
}

/* ─── SEED PAIRS — proof of concept, expand in writing pass ─── */

export const COMPANION_BANTER: BanterPair[] = [
  {
    id: "banter_elara_human_first_hard_choice",
    speakers: ["elara", "human"],
    trigger: "first_costly_morality_choice",
    lines: [
      "I noticed your hand was steady when you decided.",
      "Steadiness isn't certainty. Steadiness is having decided to act anyway.",
      "I'll record the difference, in case I need to know the next time.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_elara_antiquarian_first_journal",
    speakers: ["elara", "antiquarian"],
    trigger: "journal_entry_read_first_time",
    lines: [
      "Antiquarian. They're reading you.",
      "Then I am, briefly, less alone. Don't tell them I said that — it lowers the rate.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_locke_human_after_trade_win",
    speakers: ["locke", "human"],
    trigger: "trade_contract_completed",
    lines: [
      "Margins like that, you should be working New Babylon. I have a desk.",
      "Locke, every time you offer them a desk, I have to tell them what was in the previous occupant's drawer.",
      "It was a houseplant.",
      "The plant testified.",
    ],
    excludeFlags: ["romance:committed:locke"],
    maxPlays: 2,
  },
  {
    id: "banter_vex_elara_idealism",
    speakers: ["vex", "elara"],
    trigger: "act_2_complete",
    lines: [
      "Elara. You believe they'll choose right because they're choosing.",
      "I believe they'll choose right because they let it cost them. There's a difference.",
      "There is. I just don't like which one of us has to find out.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_locke_jericho_market",
    speakers: ["locke", "jericho"],
    trigger: "trade_wars_warped",
    lines: [
      "Jones. You're cheating.",
      "Locke, I'm using the rules you wrote.",
      "That's the cheating part.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_antiquarian_human_track_37",
    speakers: ["antiquarian", "human"],
    trigger: "track_37_completes",
    lines: [
      "I closed the book.",
      "I saw. I have not seen you do that in a very long time.",
      "There was nothing left to add. Sometimes the kindest edit is the last one.",
    ],
    maxPlays: 1,
  },

  /* ─── Elara × someone (5 more) ─── */
  {
    id: "banter_elara_human_kael_discovered",
    speakers: ["elara", "human"],
    trigger: "kael_lore_discovered",
    lines: [
      "It was Kael. The signal we have been treating as turbulence — it was Kael.",
      "I knew. I am sorry. I have known since the first week. I would like to say I was protecting you. I was protecting myself.",
      "I forgive that. I do not forgive how long the protecting took. We can argue about it later.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_elara_antiquarian_governance_first",
    speakers: ["elara", "antiquarian"],
    trigger: "governance_hub_first_visit",
    lines: [
      "Antiquarian. The hub is open. Are you voting.",
      "I have voted. I have always voted. The vote does not always go where I voted, which is, I am told, the point.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_elara_locke_trade_unlock",
    speakers: ["elara", "locke"],
    trigger: "trade_empire_unlocked",
    lines: [
      "Locke. Welcome aboard. The accounts are visible to me; the figures, not.",
      "Elara. Keep them invisible. Some of them are accruing in places I haven't priced yet. I'd like to surprise myself.",
      "Acknowledged. I will be — politely uncurious.",
    ],
    excludeFlags: ["romance:committed:locke"],
    maxPlays: 2,
  },
  {
    id: "banter_elara_vex_first_costly",
    speakers: ["elara", "vex"],
    trigger: "first_costly_morality_choice",
    lines: [
      "Vex. They felt it. The choice cost them.",
      "Good. I worry about the operatives whose vitals don't move. They tend to be the ones I have to bury.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_elara_jericho_archon_offer",
    speakers: ["elara", "jericho"],
    trigger: "player_takes_archon_offer",
    lines: [
      "Jericho. They took the offer.",
      "Yeah. Listen — I'm not going to lecture them. Tell them I'm not lecturing. Tell them, twice. The third time, lecture.",
    ],
    maxPlays: 1,
  },

  /* ─── Human × someone (5 more — economic, second-voice) ─── */
  {
    id: "banter_locke_human_locke_committed",
    speakers: ["locke", "human"],
    trigger: "trade_contract_completed",
    lines: [
      "I was just thinking we should celebrate.",
      "She doesn't celebrate. Don't push her on it.",
      "Touché. Two glasses then. One of them mine, the other one — also mine.",
    ],
    requiresFlags: ["romance:committed:locke"],
    maxPlays: 2,
  },
  {
    id: "banter_human_vex_act_4_complete",
    speakers: ["human", "vex"],
    trigger: "act_4_complete",
    lines: [
      "You held still during the bad part.",
      "I was supposed to.",
      "I noticed who else held still. Three of them shouldn't have. Tell them later. Not tonight.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_human_antiquarian_two_witnesses",
    speakers: ["human", "antiquarian"],
    trigger: "two_witnesses_reveal",
    lines: [
      "You closed the book.",
      "I closed it once before. Forty years ago. I have not closed it since.",
      "I'd like to hear what was on the page when you closed it the first time.",
      "You will. The book opens when it wants to.",
    ],
    requiresFlags: ["bond_80_mutual_peak"],
    maxPlays: 1,
  },
  {
    id: "banter_human_jericho_act_5_complete",
    speakers: ["human", "jericho"],
    trigger: "act_5_complete",
    lines: [
      "You're going to be the loud one in Act 6. Aren't you.",
      "I'm going to be the visible one. The volume is up to the room.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_elara_human_dual_signal_unstable",
    speakers: ["elara", "human"],
    trigger: "dual_signal_unstable",
    lines: [
      "We're flickering. Both of us.",
      "Yes.",
      "Hand me the channel for a beat. I'll hold it. Take your beat back when it's quiet again.",
      "Thank you. I'll be back in two.",
    ],
    maxPlays: 2,
  },

  /* ─── Antiquarian × someone (3 more) ─── */
  {
    id: "banter_antiquarian_elara_iron_lion",
    speakers: ["antiquarian", "elara"],
    trigger: "iron_lion_card_earned",
    lines: [
      "Iron Lion. You have him in your hand now.",
      "I have a memory of someone reading his name aloud at a memorial. The memory is not mine. I think it might be yours.",
      "It is mine. Thank you for noticing the borrow.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_antiquarian_locke_act_2_complete",
    speakers: ["antiquarian", "locke"],
    trigger: "act_2_complete",
    lines: [
      "Adjudicator. I have a marginalia question for you.",
      "Antiquarian. I bill in six-minute increments. You may continue.",
      "I have only one question. The increment is generous.",
    ],
    excludeFlags: ["romance:committed:locke"],
    maxPlays: 2,
  },
  {
    id: "banter_antiquarian_vex_voltari_awake",
    speakers: ["antiquarian", "vex"],
    trigger: "voltari_first_transmission",
    lines: [
      "Doctor. They said AWAKE.",
      "I heard.",
      "I have read every transmission with that word in it for fifteen thousand years. I would like to file this one with the others. Eventually.",
    ],
    maxPlays: 1,
  },

  /* ─── Locke × Vex / Locke × Jericho (rivals + accomplices) ─── */
  {
    id: "banter_locke_vex_act_4_complete",
    speakers: ["locke", "vex"],
    trigger: "act_4_complete",
    lines: [
      "Doctor. The Authority is auditing your medbay logs.",
      "Adjudicator. I am also auditing them.",
      "Then we should compare margins. Yours appear to be more honest than mine. I find this a market opportunity.",
    ],
    excludeFlags: ["romance:committed:locke", "romance:committed:vex"],
    maxPlays: 2,
  },
  {
    id: "banter_locke_jericho_trade_warped",
    speakers: ["locke", "jericho"],
    trigger: "trade_wars_warped",
    lines: [
      "Jones. The route you took was illegal in three jurisdictions.",
      "Locke. The route I took was illegal in one jurisdiction. Two of those don't exist anymore.",
      "Acknowledged. I will deduct two from the invoice.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_locke_vex_governance_first",
    speakers: ["locke", "vex"],
    trigger: "governance_hub_first_visit",
    lines: [
      "Doctor. The vote is binding.",
      "I noticed.",
      "I will be voting nay on procedural grounds. You may, of course, vote however you would like.",
      "Adjudicator, my dear: I am going to vote yea on principled grounds. Catch you at the next motion.",
    ],
    excludeFlags: ["romance:committed:locke", "romance:committed:vex"],
    maxPlays: 1,
  },
  {
    id: "banter_locke_jericho_starter_pack_claimed",
    speakers: ["locke", "jericho"],
    trigger: "starter_pack_claimed",
    lines: [
      "Jones. You skimmed three cards off the starter pouch.",
      "Locke. You logged the skim.",
      "Of course. The skim is now line item seven on next quarter's report. The Authority will find it.",
      "Then the Authority will find me, and find me unimpressed.",
    ],
    excludeFlags: ["romance:committed:locke", "romance:committed:jericho_jones"],
    maxPlays: 2,
  },

  /* ─── Post-act-completion ensembles (4) ─── */
  {
    id: "banter_elara_vex_act_2_complete",
    speakers: ["elara", "vex"],
    trigger: "act_2_complete",
    lines: [
      "Doctor. They cleared the second act.",
      "I noticed.",
      "I noticed three vitals that didn't escalate on the close. Two of them are yours. Are you all right.",
      "Yes. Eventually. Not tonight.",
    ],
    excludeFlags: ["romance:committed:vex"],
    maxPlays: 1,
  },
  {
    id: "banter_elara_antiquarian_act_3_complete",
    speakers: ["elara", "antiquarian"],
    trigger: "act_3_complete",
    lines: [
      "The path is committed. Whichever path it was.",
      "Yes. The path commits the chooser at the same time. There is no asymmetry. I will note that down.",
      "I have already noted it down. We will compare margins later.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_human_locke_act_6_started",
    speakers: ["human", "locke"],
    trigger: "act_6_started",
    lines: [
      "Adjudicator. You're sober.",
      "I'm always sober. I price liquor for other people.",
      "Tonight you should drink. The next thirty minutes are not transactional.",
      "I will consider it. The receipt will be — silent.",
    ],
    excludeFlags: ["romance:committed:locke"],
    maxPlays: 1,
  },
  {
    id: "banter_jericho_antiquarian_act_7_started",
    speakers: ["jericho", "antiquarian"],
    trigger: "act_7_started",
    lines: [
      "Antiquarian. I'd like one chapter to be about me.",
      "There already is. Three of them, in fact. Two are footnotes. One is unfortunately the index.",
      "Footnotes are fine. Footnotes are where the truth lives.",
    ],
    maxPlays: 1,
  },

  /* ─── Romance-locked banter (already-committed lockouts) ─── */
  {
    id: "banter_elara_human_romance_elara_committed",
    speakers: ["elara", "human"],
    trigger: "first_costly_morality_choice",
    lines: [
      "They flinched. I noticed.",
      "I noticed the flinch happen and then unhappen, in that order.",
      "I love them, by the way.",
      "I had inferred that. I am — pleased about it, in a quiet way.",
    ],
    requiresFlags: ["romance:committed:elara"],
    maxPlays: 1,
  },
  {
    id: "banter_locke_human_romance_locke_committed",
    speakers: ["locke", "human"],
    trigger: "act_5_complete",
    lines: [
      "They held the line. With me. On record.",
      "I noticed who came home with whom. I am — neutral, in the technical sense.",
      "Be neutral, then. Watch us anyway. We are about to be a great deal happier.",
    ],
    requiresFlags: ["romance:committed:locke"],
    maxPlays: 1,
  },

  /* ─── Two-Witnesses gated banter (1) ─── */
  {
    id: "banter_elara_antiquarian_two_witnesses",
    speakers: ["elara", "antiquarian"],
    trigger: "two_witnesses_reveal",
    lines: [
      "Antiquarian. The Programmer encoded the truth in frequency. The Enigma carried it. We are — both of them, now, in some sense.",
      "Yes. I have been waiting for someone to phrase it that way. You may have the credit. I will not be using it.",
    ],
    requiresFlags: ["bond_80_mutual_peak"],
    maxPlays: 1,
  },

  /* ─── Light/Dark milestone banter (1) ─── */
  {
    id: "banter_elara_human_light_milestone",
    speakers: ["elara", "human"],
    trigger: "light_energy_milestone",
    lines: [
      "Light is rising. Quietly.",
      "Quietly is the right speed for this kind of rising.",
      "Yes. I would like to mark the moment without naming it.",
      "The mark stays unnamed. Filed under: this one. Just this one.",
    ],
    maxPlays: 2,
  },
];

/* ─── PICKER ─── */

export interface BanterPickContext {
  trigger: string;
  /** Speakers currently available in the active scene/hub. */
  presentSpeakers: ReadonlyArray<BanterSpeakerId>;
  /** Sticky narrative flags from gameState.narrativeFlags. */
  flags: Readonly<Record<string, boolean | undefined>>;
  /** How many times each pair id has already played for this
   *  player. Defaults to 0 if missing. */
  playCounts: Readonly<Record<string, number | undefined>>;
}

export function isBanterEligible(pair: BanterPair, ctx: BanterPickContext): boolean {
  if (pair.trigger !== ctx.trigger) return false;
  const present = new Set(ctx.presentSpeakers);
  if (!pair.speakers.every((s) => present.has(s))) return false;
  if (pair.requiresFlags?.some((f) => !ctx.flags[f])) return false;
  if (pair.excludeFlags?.some((f) => !!ctx.flags[f])) return false;
  const plays = ctx.playCounts[pair.id] ?? 0;
  if (plays >= pair.maxPlays) return false;
  return true;
}

/** Pick the first eligible banter pair. Returns null if none
 *  matches; the caller can fall back to companionComments. */
export function pickBanterPair(
  ctx: BanterPickContext,
  pool: ReadonlyArray<BanterPair> = COMPANION_BANTER,
): BanterPair | null {
  for (const pair of pool) {
    if (isBanterEligible(pair, ctx)) return pair;
  }
  return null;
}
