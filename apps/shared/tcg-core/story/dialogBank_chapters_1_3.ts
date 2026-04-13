/**
 * Dialog bank — story chapters 1 through 3 (D5).
 *
 * ch1 — The Dead Signal (Agent Zero, easy)
 * ch2 — The Arena's Law (The Jailer, easy, boss)
 * ch3a — The General's Honor (Iron Lion, normal, branch A)
 * ch3b — The Ghost's Gambit (Wraith Calder, normal, branch B)
 *
 * Each chapter has:
 *   - a pre-match cue scene (opponent introduces themselves)
 *   - a post-match win cue scene (opponent reacts to losing)
 *   - a post-match loss cue scene (opponent taunts the player
 *     or offers them a retry)
 *
 * Each scene is 2-3 cues. All cues carry audioClipId fields.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   CH1 — THE DEAD SIGNAL (Agent Zero)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH1_PRE: DialogScene = {
  id: "dialog_ch1_pre",
  label: "Ch1 — The Dead Signal (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "agent_zero",
      mood: "guarded",
      text: "Subject Zero. Cameras cycle every forty-three seconds. I have thirty-one. The Collector wiped your memory but not your instincts — I need to see if your instincts still belong to who I think you are.",
      audioClipId: "vo_zero_ch1_pre_01",
    },
    {
      speaker: "agent_zero",
      mood: "cryptic",
      text: "I'm not going to introduce myself. You're going to either recognize me mid-match or you aren't. If you do, don't say my name out loud. The walls hear everything in here except hesitation.",
      audioClipId: "vo_zero_ch1_pre_02",
    },
  ],
};

export const DIALOG_CH1_WIN: DialogScene = {
  id: "dialog_ch1_win",
  label: "Ch1 — The Dead Signal (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "agent_zero",
      mood: "reflective",
      text: "Combat pattern Alpha-Seven-Violet. Confirmed. You fight like him. I've been looking for you for eleven years and I'm still not ready for what I'm about to say next.",
      audioClipId: "vo_zero_ch1_win_01",
    },
    {
      speaker: "agent_zero",
      mood: "protective",
      text: "Stay sharp. The Jailer is next — and he is not here to test you. He's here to put you back in rotation. Don't let him.",
      audioClipId: "vo_zero_ch1_win_02",
    },
  ],
};

export const DIALOG_CH1_LOSS: DialogScene = {
  id: "dialog_ch1_loss",
  label: "Ch1 — The Dead Signal (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "agent_zero",
      mood: "guarded",
      text: "Get up. The Oracle doesn't stay down — that's the one thing everyone who ever met him agreed on. If you're him, get up. If you're not, at least get up to prove me wrong.",
      audioClipId: "vo_zero_ch1_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH2 — THE ARENA'S LAW (The Jailer — boss)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH2_PRE: DialogScene = {
  id: "dialog_ch2_pre",
  label: "Ch2 — The Arena's Law (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "the_jailer",
      mood: "menacing",
      text: "Designation: Subject Zero. You survived the first match. That puts you in the rotation.",
      audioClipId: "vo_jailer_ch2_pre_01",
    },
    {
      speaker: "the_jailer",
      mood: "cryptic",
      text: "You will notice that my voice resembles yours. Auditory matching. Side effect of the template. It will pass.",
      internal: "The skull. The chains. But that voice — stripped of everything, it's still MY voice underneath.",
      audioClipId: "vo_jailer_ch2_pre_02",
    },
  ],
};

export const DIALOG_CH2_WIN: DialogScene = {
  id: "dialog_ch2_win",
  label: "Ch2 — The Arena's Law (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_jailer",
      mood: "broken",
      text: "Unscheduled deviation. Rotation interrupted. My designation — my designation is — ",
      audioClipId: "vo_jailer_ch2_win_01",
    },
    {
      speaker: "agent_zero",
      mood: "reflective",
      text: "Two wings open from here. Wing A is Iron Lion — he knows who you were. Wing B is Wraith Calder — he knows what the Arena does to your DNA. Choose, but know the Jailer is already rebooting. We have minutes, not hours.",
      audioClipId: "vo_zero_ch2_win_02",
    },
  ],
};

export const DIALOG_CH2_LOSS: DialogScene = {
  id: "dialog_ch2_loss",
  label: "Ch2 — The Arena's Law (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "the_jailer",
      mood: "menacing",
      text: "Return to your cell, Subject Zero. The rotation continues. You will be recalled at your scheduled interval. The cameras will not notice this interlude.",
      audioClipId: "vo_jailer_ch2_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH3A — THE GENERAL'S HONOR (Iron Lion — branch A)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH3A_PRE: DialogScene = {
  id: "dialog_ch3a_pre",
  label: "Ch3A — The General's Honor (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "iron_lion",
      mood: "reflective",
      text: "Zero flagged you. Zero does not flag anyone. That puts you in a category I have not issued papers for in eleven years.",
      audioClipId: "vo_lion_ch3a_pre_01",
    },
    {
      speaker: "iron_lion",
      mood: "protective",
      text: "If you are who she thinks you are, I owe you a salute. If you are not, I owe you a fair fight. Both debts require the same thing from me: that I bring my best deck and my second-best mercy.",
      audioClipId: "vo_lion_ch3a_pre_02",
    },
  ],
};

export const DIALOG_CH3A_WIN: DialogScene = {
  id: "dialog_ch3a_win",
  label: "Ch3A — The General's Honor (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "iron_lion",
      mood: "triumphant",
      text: "You fight with a general's discipline. That settles it. I've served three commanders in my life and all three of them were you under different names. Welcome back, Oracle.",
      audioClipId: "vo_lion_ch3a_win_01",
    },
  ],
};

export const DIALOG_CH3A_LOSS: DialogScene = {
  id: "dialog_ch3a_loss",
  label: "Ch3A — The General's Honor (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "iron_lion",
      mood: "reflective",
      text: "You fight like a lieutenant who has not yet met their own general. That is correct. I will wait. Rest, rebuild, and come back with more of yourself in the deck.",
      audioClipId: "vo_lion_ch3a_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH3B — THE GHOST'S GAMBIT (Wraith Calder — branch B)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH3B_PRE: DialogScene = {
  id: "dialog_ch3b_pre",
  label: "Ch3B — The Ghost's Gambit (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "wraith_calder",
      mood: "cryptic",
      text: "Seven times I've died in this Arena. Each time I came back knowing a little more about what it does to the DNA of the people inside it. You're next to find out — or next to skip the lesson, if you're lucky.",
      audioClipId: "vo_calder_ch3b_pre_01",
    },
    {
      speaker: "wraith_calder",
      mood: "guarded",
      text: "Don't mourn me if I drop. I'll be back. The real question is whether YOU will come back when it's your turn. That's the data Zero sent me here to collect.",
      audioClipId: "vo_calder_ch3b_pre_02",
    },
  ],
};

export const DIALOG_CH3B_WIN: DialogScene = {
  id: "dialog_ch3b_win",
  label: "Ch3B — The Ghost's Gambit (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "wraith_calder",
      mood: "broken",
      text: "Death number eight. Somewhere a ledger is logging this. I can feel it, every time. The Arena is keeping score of me and one of these days the score will tell it I'm done.",
      audioClipId: "vo_calder_ch3b_win_01",
    },
    {
      speaker: "wraith_calder",
      mood: "reflective",
      text: "You felt it, didn't you? The moment the DNA shifts. That flicker under your skin after the killing blow. Now you know. Now you are part of the experiment whether you consented or not. I'm sorry.",
      audioClipId: "vo_calder_ch3b_win_02",
    },
  ],
};

export const DIALOG_CH3B_LOSS: DialogScene = {
  id: "dialog_ch3b_loss",
  label: "Ch3B — The Ghost's Gambit (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "wraith_calder",
      mood: "cryptic",
      text: "Good. That was a clean loss. Clean losses don't change the DNA — only ugly ones do that. Come back ugly next time if you want to learn faster.",
      audioClipId: "vo_calder_ch3b_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BANK_CHAPTERS_1_3: readonly DialogScene[] = Object.freeze([
  DIALOG_CH1_PRE,
  DIALOG_CH1_WIN,
  DIALOG_CH1_LOSS,
  DIALOG_CH2_PRE,
  DIALOG_CH2_WIN,
  DIALOG_CH2_LOSS,
  DIALOG_CH3A_PRE,
  DIALOG_CH3A_WIN,
  DIALOG_CH3A_LOSS,
  DIALOG_CH3B_PRE,
  DIALOG_CH3B_WIN,
  DIALOG_CH3B_LOSS,
]);
