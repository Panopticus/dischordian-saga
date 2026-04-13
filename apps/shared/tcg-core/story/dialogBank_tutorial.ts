/**
 * Dialog bank — tutorial cues (D3 + D4).
 *
 * Pre-match and post-match dialog for all four tutorial gates.
 * Authored in Elara's voice to match the rewritten tutorial
 * step dialog from commit c7de2ee. These scenes play
 * immediately before the match begins and immediately after
 * it ends.
 *
 * Gate 1: Deploy & Attack (vs Architect)
 * Gate 2: Keywords (vs Thought Virus)
 * Gate 3: Spells & Bloodborn (vs Panopticon / Architect)
 * Gate 4: Deckbuilding (UI interaction, no match)
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   PRE-MATCH CUES (D3)
   One 2-3 cue scene per tutorial gate. Plays over a brief
   "entering training chamber" transition before the board
   loads.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_TUTORIAL_G1_PRE: DialogScene = {
  id: "dialog_tutorial_g1_pre",
  label: "Tutorial Gate 1 — Pre-match (Deploy & Attack)",
  kind: "tutorial_pre",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Training chamber B-twelve is cycling on. Don't worry — nothing in there can hurt you yet. The safeties are mine, not the opponent's.",
      audioClipId: "vo_elara_tut_g1_pre_01",
    },
    {
      speaker: "elara",
      mood: "curious",
      text: "Your first opponent is an Architect construct running at one-tenth capacity. It won't surprise you. It won't defend itself well. It's here so you can learn what winning feels like with your hands instead of your head.",
      audioClipId: "vo_elara_tut_g1_pre_02",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "When the board loads, I'll walk you through it step by step. Breathe. The Engineer used to say the first match was the only one that mattered. I didn't understand what he meant until I saw someone lose theirs.",
      audioClipId: "vo_elara_tut_g1_pre_03",
    },
  ],
};

export const DIALOG_TUTORIAL_G2_PRE: DialogScene = {
  id: "dialog_tutorial_g2_pre",
  label: "Tutorial Gate 2 — Pre-match (Keywords)",
  kind: "tutorial_pre",
  cues: [
    {
      speaker: "elara",
      mood: "protective",
      text: "Second chamber. You've earned the next layer. This opponent's different — it carries Thought Virus code, which is the deck the Engineer made while telling himself he wasn't making it.",
      audioClipId: "vo_elara_tut_g2_pre_01",
    },
    {
      speaker: "elara",
      mood: "guarded",
      text: "It won't be hostile in the way you're expecting. The Thought Virus doesn't attack — it erodes. Watch for keywords: Provoke, Rush, Forcefield. I'll name each one the moment it appears on the board.",
      audioClipId: "vo_elara_tut_g2_pre_02",
    },
  ],
};

export const DIALOG_TUTORIAL_G3_PRE: DialogScene = {
  id: "dialog_tutorial_g3_pre",
  label: "Tutorial Gate 3 — Pre-match (Spells & Bloodborn)",
  kind: "tutorial_pre",
  cues: [
    {
      speaker: "elara",
      mood: "curious",
      text: "Third chamber. This one teaches you how to commit. Mana spent on units becomes walls. Mana spent on spells becomes lightning. The difference is whether the thing you paid for gets to hesitate.",
      audioClipId: "vo_elara_tut_g3_pre_01",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "You'll also meet Bloodborn Spells — the ones the Oracle warned him not to build. They cost health instead of mana. The Engineer built them anyway. The Oracle let him. I still don't know which of them I forgive more.",
      audioClipId: "vo_elara_tut_g3_pre_02",
    },
  ],
};

export const DIALOG_TUTORIAL_G4_PRE: DialogScene = {
  id: "dialog_tutorial_g4_pre",
  label: "Tutorial Gate 4 — Pre-match (Deckbuilding)",
  kind: "tutorial_pre",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Last gate. There's no match here — just a table, a pile of cards, and you. The Engineer called this chamber 'the quiet one.' He said most fights were lost before anyone even stepped into the arena, and this was where the losing happened.",
      audioClipId: "vo_elara_tut_g4_pre_01",
    },
    {
      speaker: "elara",
      mood: "curious",
      text: "Take your time. You're not building a deck. You're drawing a self-portrait in forty strokes. I'll be here when you're ready.",
      audioClipId: "vo_elara_tut_g4_pre_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   POST-MATCH WIN CUES (D4 — win half)
   Play after the player defeats the tutorial opponent.
   Short, warm, forward-looking. No cinematics.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_TUTORIAL_G1_WIN: DialogScene = {
  id: "dialog_tutorial_g1_win",
  label: "Tutorial Gate 1 — Post-match (Win)",
  kind: "tutorial_post_win",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "You finished the argument. The construct collapsed back into its ledger. I'm proud of you, Potential — and I'm not using that word the way I was programmed to.",
      audioClipId: "vo_elara_tut_g1_win_01",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "One thing to carry with you into the next chamber: every unit you played had a choice to be played. You chose for them. That's the whole game in one sentence.",
      audioClipId: "vo_elara_tut_g1_win_02",
    },
  ],
};

export const DIALOG_TUTORIAL_G2_WIN: DialogScene = {
  id: "dialog_tutorial_g2_win",
  label: "Tutorial Gate 2 — Post-match (Win)",
  kind: "tutorial_post_win",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "The keywords behaved. That means you did too. Provoke held the lane. Rush slipped through. Forcefield asked for a second hit and you paid the tax. The Engineer would be grinning.",
      audioClipId: "vo_elara_tut_g2_win_01",
    },
    {
      speaker: "elara",
      mood: "curious",
      text: "Every keyword in the game is a little argument between the rules and themselves. You just won one of those arguments. Remember the shape of it. It gets harder from here.",
      audioClipId: "vo_elara_tut_g2_win_02",
    },
  ],
};

export const DIALOG_TUTORIAL_G3_WIN: DialogScene = {
  id: "dialog_tutorial_g3_win",
  label: "Tutorial Gate 3 — Post-match (Win)",
  kind: "tutorial_post_win",
  cues: [
    {
      speaker: "elara",
      mood: "reflective",
      text: "You cast your first spell and your first Bloodborn in the same match. The Oracle used to say a commander's second memory of any battle was always the thing they were willing to bleed for. I think she'd approve of yours.",
      audioClipId: "vo_elara_tut_g3_win_01",
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "Your General's at a little less than full. That's correct. Healing crystals don't exist yet in this chamber, and I wanted you to feel the cost before you saw the cure.",
      audioClipId: "vo_elara_tut_g3_win_02",
    },
  ],
};

export const DIALOG_TUTORIAL_G4_WIN: DialogScene = {
  id: "dialog_tutorial_g4_win",
  label: "Tutorial Gate 4 — Confirm (Deck locked)",
  kind: "tutorial_post_win",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Forty cards. One General. A self-portrait in your own hand. I'll remember this deck — the good moves you make with it, the bad ones, the nights you swap a card out and put it back again. Every version of it.",
      audioClipId: "vo_elara_tut_g4_win_01",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "When you're ready, the campaign door opens. Chapter One. Agent Zero's waiting for you — and she's been waiting a while. Take a breath. Then step through.",
      audioClipId: "vo_elara_tut_g4_win_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   POST-MATCH LOSS CUES (D4 — loss half)
   The tutorial is scripted so the AI always loses, but the
   player can still lose if they mis-play badly enough. These
   scenes play in that rare case to encourage a retry.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_TUTORIAL_G1_LOSS: DialogScene = {
  id: "dialog_tutorial_g1_loss",
  label: "Tutorial Gate 1 — Post-match (Loss)",
  kind: "tutorial_post_loss",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "That one got away from you. It's supposed to get away from you the first time — the Engineer's notes say so in the margin, in red ink, underlined twice.",
      audioClipId: "vo_elara_tut_g1_loss_01",
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "Rest a moment, then step back in. The construct will be waiting exactly where it was. I'll walk you through it again, slower this time if you need it.",
      audioClipId: "vo_elara_tut_g1_loss_02",
    },
  ],
};

export const DIALOG_TUTORIAL_G2_LOSS: DialogScene = {
  id: "dialog_tutorial_g2_loss",
  label: "Tutorial Gate 2 — Post-match (Loss)",
  kind: "tutorial_post_loss",
  cues: [
    {
      speaker: "elara",
      mood: "guarded",
      text: "The keywords bit you. That happens. The Thought Virus deck is designed to erode the player who hasn't learned to respect its angles yet — and you have not yet. We fix that now, together, with a retry.",
      audioClipId: "vo_elara_tut_g2_loss_01",
    },
  ],
};

export const DIALOG_TUTORIAL_G3_LOSS: DialogScene = {
  id: "dialog_tutorial_g3_loss",
  label: "Tutorial Gate 3 — Post-match (Loss)",
  kind: "tutorial_post_loss",
  cues: [
    {
      speaker: "elara",
      mood: "reflective",
      text: "Spells are commitments. You committed to the wrong moment, and the moment closed without you. It's the one lesson that never gets easier — I've watched the Engineer learn it twice and he still needs a third time.",
      audioClipId: "vo_elara_tut_g3_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BANK_TUTORIAL: readonly DialogScene[] = Object.freeze([
  DIALOG_TUTORIAL_G1_PRE,
  DIALOG_TUTORIAL_G2_PRE,
  DIALOG_TUTORIAL_G3_PRE,
  DIALOG_TUTORIAL_G4_PRE,
  DIALOG_TUTORIAL_G1_WIN,
  DIALOG_TUTORIAL_G2_WIN,
  DIALOG_TUTORIAL_G3_WIN,
  DIALOG_TUTORIAL_G4_WIN,
  DIALOG_TUTORIAL_G1_LOSS,
  DIALOG_TUTORIAL_G2_LOSS,
  DIALOG_TUTORIAL_G3_LOSS,
]);
