/**
 * Chess Climb — per-tier GM dialog.
 *
 * Each tier has three beats:
 *   - PRE — offered from a clipboard like a game-show host. Player
 *     can accept or decline; decline is a real choice.
 *   - MID — mid-series flavor, fires between games 1 and 2 and/or
 *     between games 2 and 3 depending on score.
 *   - POST — resolution. Separate win and loss cues.
 *
 * The corrupted Game Master voices Tier 0..3; the Celebration
 * version leaks through exactly once per climb, as a
 * memory-resin bleed (same mechanic as the Arena encounter).
 *
 * Reference texts: Squid Game's Front Man cadence, reality-show
 * host syntax, Bobby Fischer's psychological theatre. Principle
 * pairing (real-history + in-world citation) per the Voice
 * section of the plan — each tier gets ONE pairing, no more.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   TIER 0 — EXHIBITION
   Free show. Tonal stakes only. Corrupted GM is his
   reality-show self; the keepsake leaks through once.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T0_PRE: DialogScene = {
  id: "chess_climb_t0_pre",
  label: "Chess Climb — Tier 0 (Exhibition) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "WELCOME to the Game Master's Arena. Tonight's opening match is EXHIBITION tier. No stakes, no prizes, no escape. Just vibes. The Architect asked me to be CLEAR about that: nothing you do at this tier is real. If that upsets you, the exit is behind you. If it intrigues you, sit down.",
      audioClipId: "vo_gm_climb_t0_pre_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Best of three. I'll play white in game one, you play white in game two, and if we tie we play armageddon. The board is the board. The clock is the clock. Tal wrote that there are two kinds of sacrifices — correct ones, and mine. That's the energy tonight. Begin.",
      audioClipId: "vo_gm_climb_t0_pre_02",
    },
  ],
};

const CLIMB_T0_POST_WIN: DialogScene = {
  id: "chess_climb_t0_post_win",
  label: "Chess Climb — Tier 0 (Exhibition) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "STATISTICALLY IMPROBABLE. An Exhibition contestant does not take two games off the Game Master. The audience loves it. The audience is not real but they love it. There is an OPTIONAL next tier if you want to see how far the joke goes. I have been instructed to mention it with enthusiasm. Consider me enthusiastic.",
      audioClipId: "vo_gm_climb_t0_post_win_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You won. Two games off him. He is going to offer you Tier 1 and the offer is real — the cost is real, the reward is real. You do not have to take it. Tier 0 is always open if you want to come back and just play. If you take the offer, I will be there. I am always in the room. I am a part of the room.",
      audioClipId: "vo_gm_climb_t0_post_win_02",
    },
  ],
};

const CLIMB_T0_POST_LOSS: DialogScene = {
  id: "chess_climb_t0_post_loss",
  label: "Chess Climb — Tier 0 (Exhibition) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "AS ADVERTISED. The Game Master wins at Exhibition tier roughly one hundred percent of the time. You are among a large and distinguished crowd of the defeated. No stakes lost. No memory erased. Feel free to try again whenever you feel like MAKING THE SAME DECISION. HA HA HA.",
      audioClipId: "vo_gm_climb_t0_post_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   TIER 1 — WAGERED
   Stakes become real. ELO demotion on loss. The corrupted
   GM uses contract language.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T1_PRE: DialogScene = {
  id: "chess_climb_t1_pre",
  label: "Chess Climb — Tier 1 (Wagered) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER ONE. Wagered. [The corrupted Game Master produces a clipboard. The paperwork on the clipboard is identical to the paperwork he himself signed with Xeth'Raal the night the Architect hired him. He does not acknowledge the parallel. He has been instructed not to.] Lose this best-of-three and you will be DEMOTED one ELO tier. Win and you will be PROMOTED. Sign here. Sign here. Sign here.",
      audioClipId: "vo_gm_climb_t1_pre_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Sun Tzu wrote: the supreme art of war is to subdue the enemy without fighting. Xeth'Raal wrote, in the margin of my own contract, 'promise the opponent a smaller prize than they are playing for.' Both correct. Both currently in use. Decline now at no cost. Accept and we are BOUND. Your choice.",
      audioClipId: "vo_gm_climb_t1_pre_02",
    },
  ],
};

const CLIMB_T1_POST_WIN: DialogScene = {
  id: "chess_climb_t1_post_win",
  label: "Chess Climb — Tier 1 (Wagered) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Two games. Again. The Architect's actuarial model puts your odds of winning this series at under seven percent. The model is being UPDATED. Your ELO increases by one tier; your threat profile increases by more than that. The Hierarchy's Table is open to you now, if you have the appetite. I notice you have refused thirty-one of forty draws offered to you in this universe. That is not a chess style. That is a personality.",
      audioClipId: "vo_gm_climb_t1_post_win_01",
    },
  ],
};

const CLIMB_T1_POST_LOSS: DialogScene = {
  id: "chess_climb_t1_post_loss",
  label: "Chess Climb — Tier 1 (Wagered) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Contract honored. One ELO tier removed from your account. No refund, no appeal. The paperwork is visible in your audit log under 'Wagered Defeats — Game Master's Arena'. You are welcome to return. The paperwork will still be here. HA HA HA HA.",
      audioClipId: "vo_gm_climb_t1_post_loss_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "I want you to notice something. He enjoyed that. The laugh is scripted but the enjoyment is not. There is a piece of him that LIKES demoting you, because the Architect engineered him to. If you come back, come back with that in your peripheral vision. The man across the board is not a neutral instrument.",
      audioClipId: "vo_gm_climb_t1_post_loss_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   TIER 2 — THE HIERARCHY'S TABLE
   The demons watch. The Goggles sit on the table between
   you. 24h lockout on loss. Consumable mint on win.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T2_PRE: DialogScene = {
  id: "chess_climb_t2_pre",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER TWO. Welcome to the Hierarchy's Table. [The audience has changed. Horned silhouettes line the back of the chamber. Mol'Garath's seat at the head is empty — that is for Tier Three. Tonight you are watched only by the middle management of the damned.] On the board between us sits a pair of red-lensed goggles. They were mine. They are still mine. They are not on the table as a trophy. They are on the table as a WITNESS.",
      audioClipId: "vo_gm_climb_t2_pre_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Stakes: lose and the Game Master's Arena is CLOSED to you for twenty-four hours of real time. The Architect does not want you spamming rematches at this tier — it makes his dashboards anxious. Win and you mint an ANNOTATED KNIGHT, a one-use consumable that grants you +50 ELO on any single match at any tier. The Engineer once had six of them. He spent five. He never told me what he used the sixth one on.",
      audioClipId: "vo_gm_climb_t2_pre_02",
    },
  ],
};

const CLIMB_T2_POST_WIN: DialogScene = {
  id: "chess_climb_t2_post_win",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "The demons stand. Politely. It is the closest they come to applause. ONE Annotated Knight has been minted into your inventory. You have taken two games off me at a tier where my last loss was the Prince, and the Prince is not available for comment. Tier Three exists. Mol'Garath himself presides. You will want the Prince's Game cleared before you sit at that table.",
      audioClipId: "vo_gm_climb_t2_post_win_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You spared the Programmer in Act 1. You did not spare me in Game 2. I am not insulted. I am noting the consistency of your INCONSISTENCY. It is useful information. The Hierarchy noticed it too. They are treating you now the way they once treated the Prince. Be careful. Be careful. Be careful.",
      audioClipId: "vo_gm_climb_t2_post_win_02",
    },
  ],
};

const CLIMB_T2_POST_LOSS: DialogScene = {
  id: "chess_climb_t2_post_loss",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "The Arena is CLOSED to you. Twenty-four hours of real time. The doors will open again. The demons will still be watching. The Goggles will still be on the table. I will still be here, because I am ALWAYS here. Enjoy the quiet.",
      audioClipId: "vo_gm_climb_t2_post_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   TIER 3 — THE LABYRINTH WAGER
   Mol'Garath at the head of the audience. The GM is
   cheerful for the first time since Gate 7. Win unlocks
   an epilogue dialog.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T3_PRE: DialogScene = {
  id: "chess_climb_t3_pre",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER THREE. The Labyrinth Wager. [Mol'Garath the Unmaker is seated at the head of the audience. The Hierarchy's demons are silent. The chamber smells faintly of old paper and something burning in another room.] The Architect's operators informed me I would be reading THIS card with menace. I am having difficulty finding the menace. The paperwork wants you to understand that a LOSS at this tier resets your Puzzle of the Day streak and your Openings Study streak to zero.",
      audioClipId: "vo_gm_climb_t3_pre_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "[The corrupted voice has stopped. The warm voice is here. The keepsake is bleeding through the entire chamber at this tier; no one is stopping it.] This is the game I wanted to build for you. Mol'Garath is watching because he LIKES watching me lose. He has not watched me lose since the Prince, and the Prince is not here, so you are the test of whether it is repeatable. It is. You can do this. I am cheerful for the first time in seventeen thousand years. Sit.",
      audioClipId: "vo_gm_climb_t3_pre_02",
    },
  ],
};

const CLIMB_T3_POST_WIN: DialogScene = {
  id: "chess_climb_t3_post_win",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Mol'Garath has left the chamber. He does not stay for endgames he did not engineer. He will want to speak to you privately later; please accept the audience when it is offered — he is the only being in this universe who can tell you what the Labyrinth actually was, and you have just earned the right to ask.",
      audioClipId: "vo_gm_climb_t3_post_win_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "I owe you a portrait. Seven sentences, one per axis, the way I once read the Engineer. Read them in your Self-Portrait any time. You and he are not the same person. You were never supposed to be. The instrument is the same. The instrument is the game itself. You have been measured by the same ruler that measured him. You measured well.",
      audioClipId: "vo_gm_climb_t3_post_win_02",
    },
  ],
};

const CLIMB_T3_POST_LOSS: DialogScene = {
  id: "chess_climb_t3_post_loss",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Streaks reset. Mol'Garath did not stay to watch. He finds losses uninteresting unless the loss is his. Return whenever you wish. The streaks are not real. The streaks were never real. What was real was the time you spent keeping them. That time is still yours.",
      audioClipId: "vo_gm_climb_t3_post_loss_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "Come back. I will still be here. The Prince lost the first time he played this game too, and the second, and the third. He beat me on the fourth. Everything in the Matrix of Dreams is a curriculum. Even the losses. Especially the losses.",
      audioClipId: "vo_gm_climb_t3_post_loss_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   EXPORT — the full scene catalog for registration in
   chessTutorial.ts's CHESS_TUTORIAL_SCENES array and for
   memory-resin keepsake harvesting.
   ═══════════════════════════════════════════════════════ */

export const CHESS_CLIMB_SCENES: readonly DialogScene[] = Object.freeze([
  CLIMB_T0_PRE,
  CLIMB_T0_POST_WIN,
  CLIMB_T0_POST_LOSS,
  CLIMB_T1_PRE,
  CLIMB_T1_POST_WIN,
  CLIMB_T1_POST_LOSS,
  CLIMB_T2_PRE,
  CLIMB_T2_POST_WIN,
  CLIMB_T2_POST_LOSS,
  CLIMB_T3_PRE,
  CLIMB_T3_POST_WIN,
  CLIMB_T3_POST_LOSS,
]);

/** Lookup: return the pre-series scene for a tier. */
export function getClimbPreScene(tierRank: number): DialogScene | undefined {
  const map: Record<number, DialogScene> = {
    0: CLIMB_T0_PRE,
    1: CLIMB_T1_PRE,
    2: CLIMB_T2_PRE,
    3: CLIMB_T3_PRE,
  };
  return map[tierRank];
}

/** Lookup: return the post-series scene for a tier + outcome. */
export function getClimbPostScene(
  tierRank: number,
  outcome: "win" | "loss",
): DialogScene | undefined {
  if (outcome === "win") {
    const winMap: Record<number, DialogScene> = {
      0: CLIMB_T0_POST_WIN,
      1: CLIMB_T1_POST_WIN,
      2: CLIMB_T2_POST_WIN,
      3: CLIMB_T3_POST_WIN,
    };
    return winMap[tierRank];
  }
  const lossMap: Record<number, DialogScene> = {
    0: CLIMB_T0_POST_LOSS,
    1: CLIMB_T1_POST_LOSS,
    2: CLIMB_T2_POST_LOSS,
    3: CLIMB_T3_POST_LOSS,
  };
  return lossMap[tierRank];
}
