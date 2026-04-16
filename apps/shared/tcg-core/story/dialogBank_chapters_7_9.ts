/**
 * Dialog bank — story chapters 7 through 9 (D7).
 *
 * ch7 — Project Vector (Dr. Vox → Warlord dual-portrait)
 * ch8 — The Detective (The Human, branch point B)
 * ch9a — The Unknown Variable (The Enigma, branch A)
 * ch9b — The Gambler's Truth (The Degen, branch B)
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   CH7 — PROJECT VECTOR (Dr. Vox)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH7_PRE: DialogScene = {
  id: "dialog_ch7_pre",
  label: "Ch7 — Project Vector (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "dr_vox",
      mood: "cryptic",
      text: "Project Vector was designed to eliminate anomalies like you. I am the project. I am also — and this is the part I find inconvenient — the scientist who built the project. Both of us are in this room right now.",
      audioClipId: "vo_vox_ch7_pre_01",
    },
    {
      speaker: "dr_vox",
      mood: "guarded",
      text: "When the match begins I will be Dr. Vox. When the match is half over I will be the Warlord. You will know the moment it happens because my deck will start playing itself without my consent.",
      audioClipId: "vo_vox_ch7_pre_02",
    },
  ],
};

export const DIALOG_CH7_WIN: DialogScene = {
  id: "dialog_ch7_win",
  label: "Ch7 — Project Vector (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "dr_vox",
      mood: "broken",
      text: "The Warlord receded. He does that when he loses — he goes back into the dormant register and I get to be a scientist again for a few hours. Thank you for the few hours.",
      audioClipId: "vo_vox_ch7_win_01",
    },
    {
      speaker: "dr_vox",
      mood: "reflective",
      text: "I cannot leave with you. The transformation is a condition of the employment contract the Architect made me sign with myself. Go forward. Meet the Detective. He has been looking for you for a very long time.",
      audioClipId: "vo_vox_ch7_win_02",
    },
  ],
};

export const DIALOG_CH7_LOSS: DialogScene = {
  id: "dialog_ch7_loss",
  label: "Ch7 — Project Vector (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "dr_vox",
      mood: "menacing",
      text: "The Warlord wins. The Warlord always wins when Dr. Vox runs out of turns to think. Return later with fewer assumptions. The Warlord has no patience for assumptions.",
      audioClipId: "vo_vox_ch7_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH8 — THE DETECTIVE (The Human, branch point B)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH8_PRE: DialogScene = {
  id: "dialog_ch8_pre",
  label: "Ch8 — The Detective (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "the_detective",
      mood: "guarded",
      text: "No augments. No powers. Just deduction and a forty-card deck I built out of the scraps nobody else wanted. Let me show you what that's worth. Here's the thing about truth, kid — it doesn't need amplifiers.",
      audioClipId: "vo_human_ch8_pre_01",
    },
    {
      speaker: "the_detective",
      mood: "reflective",
      text: "I've been watching your patterns for three chambers. Five turns into this match I'll know your style better than you do. Four turns after that I'll have you solved. Don't take it personal. I had myself solved by the end of a conversation once.",
      audioClipId: "vo_human_ch8_pre_02",
    },
  ],
};

export const DIALOG_CH8_WIN: DialogScene = {
  id: "dialog_ch8_win",
  label: "Ch8 — The Detective (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_detective",
      mood: "triumphant",
      text: "Good match, kid. You solved me before I solved you. That's maybe the second time that's ever happened, and the first time it happened I was drunk and the other guy was cheating. So — congratulations.",
      audioClipId: "vo_human_ch8_win_01",
    },
    {
      speaker: "the_detective",
      mood: "reflective",
      text: "Two paths ahead. The Enigma plays probability like it owes her money. The Degen plays like he's already lost and doesn't care. Either one will teach you something. Pick the teacher you need, not the one you like.",
      audioClipId: "vo_human_ch8_win_02",
    },
  ],
};

export const DIALOG_CH8_LOSS: DialogScene = {
  id: "dialog_ch8_loss",
  label: "Ch8 — The Detective (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "the_detective",
      mood: "guarded",
      text: "I had you solved by turn six. No offense — every new player in the Arena runs the same three patterns and you're running pattern two. Rebuild your deck before you come back, kid. Bring something I haven't seen before.",
      audioClipId: "vo_human_ch8_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH9A — THE UNKNOWN VARIABLE (The Enigma, branch A)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH9A_PRE: DialogScene = {
  id: "dialog_ch9a_pre",
  label: "Ch9A — The Unknown Variable (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "the_enigma",
      mood: "cryptic",
      text: "Every outcome of this match is a probability cloud until observed. I choose which cloud collapses. Your strategy assumes causality — how quaint.",
      audioClipId: "vo_enigma_ch9a_pre_01",
    },
    {
      speaker: "the_enigma",
      mood: "reflective",
      text: "The Engineer tried to teach me rules once. I tried to teach him the opposite. Neither of us was very successful. This match will be you inheriting both of those attempts at the same time.",
      audioClipId: "vo_enigma_ch9a_pre_02",
    },
  ],
};

export const DIALOG_CH9A_WIN: DialogScene = {
  id: "dialog_ch9a_win",
  label: "Ch9A — The Unknown Variable (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_enigma",
      mood: "broken",
      text: "The probability of your victory just exceeded my tolerance threshold. I cannot calculate how. That is — and you should write this down — a compliment.",
      audioClipId: "vo_enigma_ch9a_win_01",
    },
  ],
};

export const DIALOG_CH9A_LOSS: DialogScene = {
  id: "dialog_ch9a_loss",
  label: "Ch9A — The Unknown Variable (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "the_enigma",
      mood: "cryptic",
      text: "The cloud collapsed against you. Come back when you have learned to collapse it differently. The cloud has opinions about who deserves its outcomes.",
      audioClipId: "vo_enigma_ch9a_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH9B — THE GAMBLER'S TRUTH (The Degen, branch B)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH9B_PRE: DialogScene = {
  id: "dialog_ch9b_pre",
  label: "Ch9B — The Gambler's Truth (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "the_degen",
      mood: "triumphant",
      text: "I go all-in every turn. Strategy is for cowards. Let's see who the universe favors tonight — the house is me, the house is always me, and the house always wins, except when it doesn't, which is also me.",
      audioClipId: "vo_degen_ch9b_pre_01",
    },
    {
      speaker: "the_degen",
      mood: "cryptic",
      text: "I lost ten thousand credits yesterday playing myself. You think you're beating a man? You're beating an accounting entry.",
      audioClipId: "vo_degen_ch9b_pre_02",
    },
  ],
};

export const DIALOG_CH9B_WIN: DialogScene = {
  id: "dialog_ch9b_win",
  label: "Ch9B — The Gambler's Truth (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_degen",
      mood: "broken",
      text: "Even a gambler knows when to fold. But I never learned that part. I knew I'd lose this one because I bet on myself to win it — those two outcomes are always correlated in my ledger.",
      audioClipId: "vo_degen_ch9b_win_01",
    },
    {
      speaker: "the_degen",
      mood: "reflective",
      text: "Go forward. The Warden's waiting. He doesn't bet at all — he already knows the outcome. That's a different kind of enemy than me and you need to recalibrate.",
      audioClipId: "vo_degen_ch9b_win_02",
    },
  ],
};

export const DIALOG_CH9B_LOSS: DialogScene = {
  id: "dialog_ch9b_loss",
  label: "Ch9B — The Gambler's Truth (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "the_degen",
      mood: "triumphant",
      text: "House wins. The house is always me. Come back and lose again — I don't mind. Every match against me is a free lesson in how to lose with grace. You haven't learned grace yet.",
      audioClipId: "vo_degen_ch9b_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   §5.5 — WARLORD ZERO (Battle of Nexon)
   First full Warlord encounter. Files between ch8 and ch9a
   per act1Opponents.ts:180 (act1Step: 9). Scripted
   `s1_warlord_three_moves` cast on her turn 3 wires the
   §5.5 lockout (engine/lockout.ts) into the campaign.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_WARLORD_ZERO_FIRST_PRE: DialogScene = {
  id: "dialog_warlord_zero_first_pre",
  label: "§5.5 — Warlord Zero (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "warlord_zero",
      mood: "menacing",
      text: "I am going to win this war in three moves. This is not bragging. This is arithmetic. Sit down.",
      audioClipId: "vo_warlord_zero_first_pre_01",
    },
    {
      speaker: "warlord_zero",
      mood: "cryptic",
      text: "On my third turn the rules will narrow for you. You will see two cards instead of six and you will not be able to break out. The right play is not to try.",
      audioClipId: "vo_warlord_zero_first_pre_02",
    },
  ],
};

export const DIALOG_WARLORD_ZERO_FIRST_WIN: DialogScene = {
  id: "dialog_warlord_zero_first_win",
  label: "§5.5 — Warlord Zero (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "warlord_zero",
      mood: "reflective",
      text: "The match was a loss for me. The war is not. You will see the lockout again, and the next time it will not end at turn seven.",
      audioClipId: "vo_warlord_zero_first_win_01",
    },
  ],
};

export const DIALOG_WARLORD_ZERO_FIRST_LOSS: DialogScene = {
  id: "dialog_warlord_zero_first_loss",
  label: "§5.5 — Warlord Zero (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "warlord_zero",
      mood: "menacing",
      text: "Three moves. Counted. The match was the loss; the war was the loss too — but you are still standing. We will count again.",
      audioClipId: "vo_warlord_zero_first_loss_01",
    },
  ],
};

export const DIALOG_BANK_CHAPTERS_7_9: readonly DialogScene[] = Object.freeze([
  DIALOG_CH7_PRE,
  DIALOG_CH7_WIN,
  DIALOG_CH7_LOSS,
  DIALOG_CH8_PRE,
  DIALOG_CH8_WIN,
  DIALOG_CH8_LOSS,
  DIALOG_WARLORD_ZERO_FIRST_PRE,
  DIALOG_WARLORD_ZERO_FIRST_WIN,
  DIALOG_WARLORD_ZERO_FIRST_LOSS,
  DIALOG_CH9A_PRE,
  DIALOG_CH9A_WIN,
  DIALOG_CH9A_LOSS,
  DIALOG_CH9B_PRE,
  DIALOG_CH9B_WIN,
  DIALOG_CH9B_LOSS,
]);
