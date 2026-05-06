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
