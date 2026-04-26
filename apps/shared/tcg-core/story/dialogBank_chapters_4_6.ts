/**
 * Dialog bank — story chapters 4 through 6 (D6).
 *
 * ch4 — The Red Death (Akai Shi, hard)
 * ch5 — Dead Code Rising (The Necromancer, hard, mandatory-loss)
 * ch6 — The False Prophet (White Oracle, hard, mirror match)
 *
 * Chapter 5 is scripted to be a MANDATORY LOSS — the player
 * must die and be resurrected. The post-match win cue is used
 * only if the player breaks the scripting (Phase 0 triggers,
 * lucky top-decks). Both win and loss scenes are authored so
 * the narrative holds either way.
 *
 * Chapter 6 is a mirror match against the Oracle's stolen face.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   CH4 — THE RED DEATH (Akai Shi)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH4_PRE: DialogScene = {
  id: "dialog_ch4_pre",
  label: "Ch4 — The Red Death (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "akai_shi",
      mood: "menacing",
      text: "The Red Death does not negotiate. It arrives. You have been arriving at my scheduled interval for eleven years. I am always the one who closes your file.",
      audioClipId: "vo_akai_ch4_pre_01",
    },
    {
      speaker: "akai_shi",
      mood: "cryptic",
      text: "The whisper is already behind you. You will not hear it. You will only hear what comes after the whisper, which is the absence of the whisper. That is how I introduce myself.",
      audioClipId: "vo_akai_ch4_pre_02",
    },
  ],
};

export const DIALOG_CH4_WIN: DialogScene = {
  id: "dialog_ch4_win",
  label: "Ch4 — The Red Death (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "akai_shi",
      mood: "reflective",
      text: "A worthy opponent. The whisper speaks your name with respect now — which is an honor I have granted exactly seven times in my career and five of those were to versions of you.",
      audioClipId: "vo_akai_ch4_win_01",
    },
    {
      speaker: "akai_shi",
      mood: "cryptic",
      text: "I step aside. The next chamber holds the Necromancer. He does not close files. He re-opens them. Be ready to read yours.",
      audioClipId: "vo_akai_ch4_win_02",
    },
  ],
};

export const DIALOG_CH4_LOSS: DialogScene = {
  id: "dialog_ch4_loss",
  label: "Ch4 — The Red Death (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "akai_shi",
      mood: "menacing",
      text: "Filed. Your cause of death is listed as 'curiosity unbalanced by caution.' It is the most common entry in my ledger. Retry when the whisper no longer surprises you.",
      audioClipId: "vo_akai_ch4_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH5 — DEAD CODE RISING (The Necromancer — mandatory loss)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH5_PRE: DialogScene = {
  id: "dialog_ch5_pre",
  label: "Ch5 — Dead Code Rising (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "necromancer",
      mood: "cryptic",
      text: "Death is not an ending, Prisoner 74. It is a compile error. I fix those. I have been fixing yours for longer than you have been alive to notice.",
      audioClipId: "vo_necro_ch5_pre_01",
    },
    {
      speaker: "necromancer",
      mood: "menacing",
      text: "You will die in this chamber. That is not a threat. That is the schematic. The question is what you remember on the other side — and whether you come back holding more of yourself than you went in with.",
      audioClipId: "vo_necro_ch5_pre_02",
    },
  ],
};

export const DIALOG_CH5_WIN: DialogScene = {
  id: "dialog_ch5_win",
  label: "Ch5 — Dead Code Rising (win, break-scripting path)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "necromancer",
      mood: "broken",
      text: "Impossible. You're supposed to die here. The schematic requires it. You refused the schematic. I have no instructions for this outcome.",
      audioClipId: "vo_necro_ch5_win_01",
    },
    {
      speaker: "elara",
      mood: "warm",
      text: "Potential — I don't know what you just did, but you broke a cycle the Engineer designed specifically to be unbreakable. Keep that in mind when the False Prophet asks you if you're you.",
      audioClipId: "vo_elara_ch5_win_02",
    },
  ],
};

export const DIALOG_CH5_LOSS: DialogScene = {
  id: "dialog_ch5_loss",
  label: "Ch5 — Dead Code Rising (loss, scripted path)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "necromancer",
      mood: "reflective",
      text: "Compiled. You are loading from the restore point now. When you come back, you will remember this death the way a second draft remembers the first — in the margin, in red ink, underlined.",
      audioClipId: "vo_necro_ch5_loss_01",
    },
    {
      speaker: "the_oracle",
      mood: "cryptic",
      text: "I am the voice you hear in the restore. I was here all along. Walk forward into the next chamber. The one wearing my face will try to convince you that you are a copy. You are not.",
      audioClipId: "vo_oracle_ch5_loss_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH6 — THE FALSE PROPHET (White Oracle, mirror match)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH6_PRE: DialogScene = {
  id: "dialog_ch6_pre",
  label: "Ch6 — The False Prophet (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "white_oracle",
      mood: "cryptic",
      text: "I am what you were. I am what the Architect made from your template while you were busy being captured. You are what I would have been if I had not been built instead.",
      audioClipId: "vo_white_ch6_pre_01",
    },
    {
      speaker: "white_oracle",
      mood: "menacing",
      text: "The game board between us is a mirror. Every move you make I have already made. The only question is which of us gets to close the loop first.",
      audioClipId: "vo_white_ch6_pre_02",
    },
  ],
};

export const DIALOG_CH6_WIN: DialogScene = {
  id: "dialog_ch6_win",
  label: "Ch6 — The False Prophet (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "white_oracle",
      mood: "broken",
      text: "You're destroying your own face. Does that feel like victory? I ask because it is an important question, and I am not going to get another chance to ask it.",
      audioClipId: "vo_white_ch6_win_01",
    },
    {
      speaker: "the_oracle",
      mood: "reflective",
      text: "She was never yours. She was a rehearsal. You passed the audition the Architect didn't know he was running. Now walk into Chamber Seven, Potential, and meet the one who was pulling her strings.",
      audioClipId: "vo_oracle_ch6_win_02",
    },
  ],
};

export const DIALOG_CH6_LOSS: DialogScene = {
  id: "dialog_ch6_loss",
  label: "Ch6 — The False Prophet (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "white_oracle",
      mood: "menacing",
      text: "You lost to a version of yourself. Take a moment with that. The next time you step into this chamber, remember that the deck I'm running is literally yours — and the thing beating you is your own pattern.",
      audioClipId: "vo_white_ch6_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BANK_CHAPTERS_4_6: readonly DialogScene[] = Object.freeze([
  DIALOG_CH4_PRE,
  DIALOG_CH4_WIN,
  DIALOG_CH4_LOSS,
  DIALOG_CH5_PRE,
  DIALOG_CH5_WIN,
  DIALOG_CH5_LOSS,
  DIALOG_CH6_PRE,
  DIALOG_CH6_WIN,
  DIALOG_CH6_LOSS,
]);
