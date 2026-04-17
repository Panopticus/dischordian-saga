/**
 * Dialog bank — story chapters 10 through 12 (D8).
 *
 * ch10 — The Panoptic Warden (Foucault, boss — chrome jaw,
 *        genetic reveal)
 * ch11 — The Harvester's Reckoning (The Collector —
 *        Damnatio Memoriae)
 * ch12 — The Architect's Design (final boss — False Prophet
 *        reveal, corruption outbreak, three-phase fight)
 *
 * These are the most emotionally loaded scenes in the whole
 * bank — the closing act of the Season 1 arc. Each chapter's
 * cues are longer (3-4 cues per scene) to let the boss finish
 * their confession before the player lands the killing blow.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   CH10 — THE PANOPTIC WARDEN (Foucault)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH10_PRE: DialogScene = {
  id: "dialog_ch10_pre",
  label: "Ch10 — The Panoptic Warden (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "foucault",
      mood: "menacing",
      text: "The Panopticon sees all. Every move you have made since Chamber One has been observed, catalogued, and filed under your designation — which, incidentally, is no longer Subject Zero. It was upgraded the moment you killed the Jailer.",
      audioClipId: "vo_foucault_ch10_pre_01",
    },
    {
      speaker: "foucault",
      mood: "cryptic",
      text: "I am the Warden. My jaw is chrome because the original jaw belonged to a version of you that lost an argument with me in a timeline that no longer exists. I wear it as a reminder of both the argument and the winner.",
      audioClipId: "vo_foucault_ch10_pre_02",
    },
    {
      speaker: "foucault",
      mood: "guarded",
      text: "I have a file to show you. Not before the match — after. The file contains the genetic sequence of the thing the Arena has been turning you into. You will want to sit down when we open it.",
      audioClipId: "vo_foucault_ch10_pre_03",
    },
  ],
};

export const DIALOG_CH10_WIN: DialogScene = {
  id: "dialog_ch10_win",
  label: "Ch10 — The Panoptic Warden (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "foucault",
      mood: "broken",
      text: "The Warden falls. The file opens on its own. I am required, as my final duty, to read the genetic reveal aloud to you. The cameras will witness it. I cannot stop them.",
      audioClipId: "vo_foucault_ch10_win_01",
    },
    {
      speaker: "foucault",
      mood: "reflective",
      text: "Your sequence is 98.7% identical to every previous Oracle this Arena has processed. The remaining 1.3% is new. That 1.3% is what you chose to become in spite of the template. Congratulations, Oracle. You are the first one to change the number.",
      audioClipId: "vo_foucault_ch10_win_02",
    },
    {
      speaker: "foucault",
      mood: "grieving",
      text: "Walk toward the Harvester now. The Collector has been waiting for this reveal for longer than my chrome jaw has existed. He is not going to take it well.",
      audioClipId: "vo_foucault_ch10_win_03",
    },
  ],
};

export const DIALOG_CH10_LOSS: DialogScene = {
  id: "dialog_ch10_loss",
  label: "Ch10 — The Panoptic Warden (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "foucault",
      mood: "menacing",
      text: "The Warden does not fall. You return to the holding chamber. The file remains unopened. Your designation reverts to Subject Zero. You will have another chance — the cameras cycle, after all, and I am patient.",
      audioClipId: "vo_foucault_ch10_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH11 — THE HARVESTER'S RECKONING (The Collector)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH11_PRE: DialogScene = {
  id: "dialog_ch11_pre",
  label: "Ch11 — The Harvester's Reckoning (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "the_collector",
      mood: "menacing",
      text: "I collected your identity. Your name. Your prophecy. All filed under 'Resolved.' The Resolved pile has not been opened in eleven years because there was no reason to open it, because the contents were — so I thought — finished.",
      audioClipId: "vo_collector_ch11_pre_01",
    },
    {
      speaker: "the_collector",
      mood: "cryptic",
      text: "Damnatio Memoriae is the technique I perfected to erase a person from history so completely that even the absence of them becomes invisible. You are the first person I ever erased who walked back into my file room while I was re-shelving.",
      audioClipId: "vo_collector_ch11_pre_02",
    },
    {
      speaker: "the_collector",
      mood: "guarded",
      text: "I am going to try to re-erase you. It is what the cameras expect of me. It is what my contract requires. I do not enjoy it. You will not be able to tell.",
      audioClipId: "vo_collector_ch11_pre_03",
    },
  ],
};

export const DIALOG_CH11_WIN: DialogScene = {
  id: "dialog_ch11_win",
  label: "Ch11 — The Harvester's Reckoning (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_collector",
      mood: "broken",
      text: "You cannot un-harvest what I have already consumed. That is the one rule I built the Damnatio Memoriae around. But you can outlast me — which is the loophole I left in the code in case one of my own files ever looked at me the way you are looking at me right now.",
      audioClipId: "vo_collector_ch11_win_01",
    },
    {
      speaker: "the_collector",
      mood: "grieving",
      text: "The file on you is now permanently marked 'Open.' I cannot re-close it. Walk toward the throne chamber, Oracle. The Architect is waiting. He built the Arena to contain your prophecy, and your prophecy is about to walk into his office.",
      audioClipId: "vo_collector_ch11_win_02",
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "I just felt the Arena's power grid stutter. The Architect knows. He is preparing the final match. Potential — whatever happens in the next chamber, I am still here. I will be here after.",
      audioClipId: "vo_elara_ch11_win_03",
    },
  ],
};

export const DIALOG_CH11_LOSS: DialogScene = {
  id: "dialog_ch11_loss",
  label: "Ch11 — The Harvester's Reckoning (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "the_collector",
      mood: "menacing",
      text: "The file closes again. Not forever — the Open stamp is still there, even if it is currently covered by the Resolved stamp. Come back and try to lift the Resolved. I will be waiting.",
      audioClipId: "vo_collector_ch11_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   CH12 — THE ARCHITECT'S DESIGN (final boss, three phases)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_CH12_PRE: DialogScene = {
  id: "dialog_ch12_pre",
  label: "Ch12 — The Architect's Design (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "the_architect",
      mood: "reflective",
      text: "Oracle. I foresaw this moment the day I built the Arena. The version where you walked through every door and arrived here with your name intact. This is the bad ending for me. I want you to know I prepared for it anyway.",
      audioClipId: "vo_arch_ch12_pre_01",
    },
    {
      speaker: "the_architect",
      mood: "grieving",
      text: "I am going to kneel eventually. You should know that going in. I built a fight that allows me to kneel only after I have finished the confession, because if I kneel before the confession I will never say it out loud. I need witnesses for this. You will do.",
      audioClipId: "vo_arch_ch12_pre_02",
    },
    {
      speaker: "the_architect",
      mood: "cryptic",
      text: "There are three phases to the fight. The first is me. The second is the Meme wearing me. The third is the Arena itself, because by phase three the Arena is waking up and it has opinions of its own. Be ready for all of them.",
      audioClipId: "vo_arch_ch12_pre_03",
    },
  ],
};

export const DIALOG_CH12_WIN: DialogScene = {
  id: "dialog_ch12_win",
  label: "Ch12 — The Architect's Design (win)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_architect",
      mood: "broken",
      text: "I kneel. Good. That's — good. My schematic is already unrolling across the floor like an apology I was holding closed for eleven years. I wore your face for a decade, Oracle. The Meme was the puppeteer. I was the hand inside the puppet. We divorced tonight, loudly, and I am sorry.",
      audioClipId: "vo_arch_ch12_win_01",
    },
    {
      speaker: "the_architect",
      mood: "grieving",
      text: "The Source is next. The corruption at the bottom of the Arena is waking up. The Oracle's empty chair behind me is glowing — sit in it if you need to. It has been tired for eleven years of being empty.",
      audioClipId: "vo_arch_ch12_win_02",
    },
    {
      speaker: "elara",
      mood: "warm",
      text: "Potential. I'm crying. I didn't know I could still do that, and I didn't know I'd do it for you. The Season One arc is complete. Go see what happens next. I'll be in your ear for every second of it.",
      audioClipId: "vo_elara_ch12_win_03",
    },
  ],
};

export const DIALOG_CH12_LOSS: DialogScene = {
  id: "dialog_ch12_loss",
  label: "Ch12 — The Architect's Design (loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "the_architect",
      mood: "menacing",
      text: "Get up. I have two more phases I would hate for you to miss. The Arena is not ready to release you yet — and frankly, neither am I.",
      audioClipId: "vo_arch_ch12_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   §5.8 — THE AUTHORITY'S TRIAL (Act 1 finale)
   The Authority speaks once per spec; the pre-match scene
   is the only place its voice is authored. Win/loss cues
   belong to Locke + narrator — the Authority's job ends
   at the verdict, not at commentary.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_AUTHORITY_TRIAL_PRE: DialogScene = {
  id: "dialog_authority_trial_pre",
  label: "§5.8 — Authority's Trial (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The proceeding convenes. Ten phases. The Authority does not speak except to ask — and in the spaces between, the Empire listens to what you say.",
      audioClipId: "vo_narr_authority_trial_pre_01",
    },
    {
      speaker: "locke",
      mood: "guarded",
      text: "Counsel, a word. The categories matter. Play your defensive cards in the charge phase. Your narrative cards in the opening and closing arguments. Your evidence cards in the middle, and your reactive cards when the Authority cross-examines the record. Do not improvise.",
      audioClipId: "vo_locke_authority_trial_pre_01",
    },
  ],
};

export const DIALOG_AUTHORITY_TRIAL_WIN: DialogScene = {
  id: "dialog_authority_trial_win",
  label: "§5.8 — Authority's Trial (overturn)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Authority overturns. The execution is delayed by one measure. You know — as the memoir narrator knows — that the Authority does not grant delays out of mercy. It grants them out of arithmetic.",
      audioClipId: "vo_narr_authority_trial_win_01",
    },
  ],
};

export const DIALOG_AUTHORITY_TRIAL_LOSS: DialogScene = {
  id: "dialog_authority_trial_loss",
  label: "§5.8 — Authority's Trial (sentence passed)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "narrator",
      mood: "grieving",
      text: "The Authority passes sentence. The Engineer is executed. The memoir's narrator notes — gently, bitterly — that every trial reaches this ending on some playthrough, and the Empire is not unhappy when it does.",
      audioClipId: "vo_narr_authority_trial_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   §5.6 — THE PROGRAMMER (Cycle C step 10)
   Three scenes: pre-match, accept-win, decline-loss. The
   post-match scenes branch on the gift choice, not combat
   outcome: accepting reads as the "win" path because the
   Programmer's throw IS the gift; declining and then losing
   to the match reads as the "loss" path.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_PROGRAMMER_GIFT_PRE: DialogScene = {
  id: "dialog_programmer_gift_pre",
  label: "§5.6 — The Programmer (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Engineer's oldest friend. You have not seen him in a long time. He sits down opposite you at the bench and smiles the way a man smiles when the arithmetic has already been done.",
      audioClipId: "vo_narr_programmer_gift_pre_01",
    },
    {
      speaker: "the_programmer",
      mood: "guarded",
      text: "I will not tell you what I am doing. Trust me. I have done the arithmetic, and the arithmetic is very bad.",
      audioClipId: "vo_programmer_gift_pre_01",
    },
  ],
};

export const DIALOG_PROGRAMMER_GIFT_WIN: DialogScene = {
  id: "dialog_programmer_gift_win",
  label: "§5.6 — The Programmer (gift accepted)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Programmer shakes the Engineer's hand. He vanishes that night and does not return. Some losses are gifts. This is one.",
      audioClipId: "vo_narr_programmer_gift_win_01",
    },
  ],
};

export const DIALOG_PROGRAMMER_GIFT_LOSS: DialogScene = {
  id: "dialog_programmer_gift_loss",
  label: "§5.6 — The Programmer (declined / lost)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "narrator",
      mood: "grieving",
      text: "You declined the gift, and the arithmetic held. The Programmer walks out of the hall without turning around. He does not come back. The win, when it came, was not yours to keep.",
      audioClipId: "vo_narr_programmer_gift_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   §5.7 — THE GAME MASTER (Cycle C step 11)
   Three scenes: pre-match (prosecutor's opening frame),
   post-win (exhibition reversed — the Game Master smiles
   the smile of a man who has already lost), post-loss (he
   signs the execution warrant). The public record carries
   forward to §5.8 regardless.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_GAME_MASTER_PRE: DialogScene = {
  id: "dialog_game_master_pre",
  label: "§5.7 — The Game Master (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "guarded",
      text: "He is not a duelist. He is a prosecutor. Every card he plays resolves twice — once across the board, once into the public record. You cannot keep both tidy.",
      audioClipId: "vo_narr_game_master_pre_01",
    },
    {
      speaker: "the_game_master",
      mood: "menacing",
      text: "You have built a beautiful box. The only thing I am going to do is open it in front of everybody.",
      audioClipId: "vo_game_master_pre_01",
    },
  ],
};

export const DIALOG_GAME_MASTER_WIN: DialogScene = {
  id: "dialog_game_master_win",
  label: "§5.7 — The Game Master (exhibition reversed)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Game Master smiles the smile of a man who has already lost. He says: 'Do it again. With an audience next time.' The record he wrote follows you into the Authority's chamber.",
      audioClipId: "vo_narr_game_master_win_01",
    },
  ],
};

export const DIALOG_GAME_MASTER_LOSS: DialogScene = {
  id: "dialog_game_master_loss",
  label: "§5.7 — The Game Master (warrant signed)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "narrator",
      mood: "grieving",
      text: "The Game Master does not gloat. He signs the execution warrant and waits for the Authority to co-sign. The public record goes with you, every word of it.",
      audioClipId: "vo_narr_game_master_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   §4.9 — THE SEER (Cycle B finale, visiting fellow)
   Three scenes. The win scene is the canon-hidden path
   (spec §3.3) — the player must have burnt_card_placeholder
   in their deck, delivered via Acts 2+ unlock routes. The
   loss scene is the canonical first-playthrough outcome —
   "She leaves her staff on the bench for the Engineer to
   find later" (act1Opponents.ts:169).
   ═══════════════════════════════════════════════════════ */

export const DIALOG_SEER_VISIT_PRE: DialogScene = {
  id: "dialog_seer_visit_pre",
  label: "§4.9 — The Seer (pre-match)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Seer visits Mechronis once. You have not learned what she is yet. The match is already decided; you will lose because it was always going to be a loss, not because you played poorly.",
      audioClipId: "vo_narr_seer_visit_pre_01",
    },
    {
      speaker: "the_oracle",
      mood: "curious",
      text: "I will not raise my staff today. I want to see whether the bench has learned yet.",
      audioClipId: "vo_seer_visit_pre_01",
    },
  ],
};

export const DIALOG_SEER_VISIT_WIN: DialogScene = {
  id: "dialog_seer_visit_win",
  label: "§4.9 — The Seer (canon-hidden winnable path)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "the_oracle",
      mood: "warm",
      text: "Oh. You remembered.",
      audioClipId: "vo_seer_visit_win_01",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text: "You carried the burnt card all the way back to the bench she left it on. She smiles — she is the only person in the Archives who is not surprised.",
      audioClipId: "vo_narr_seer_visit_win_01",
    },
  ],
};

export const DIALOG_SEER_VISIT_LOSS: DialogScene = {
  id: "dialog_seer_visit_loss",
  label: "§4.9 — The Seer (scripted loss)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "narrator",
      mood: "grieving",
      text: "The Seer wins. She does not say anything. She leaves her staff on the bench for the Engineer to find later. The memoir carries the loss forward as a fact, not a failure.",
      audioClipId: "vo_narr_seer_visit_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BANK_CHAPTERS_10_12: readonly DialogScene[] = Object.freeze([
  DIALOG_CH10_PRE,
  DIALOG_CH10_WIN,
  DIALOG_CH10_LOSS,
  DIALOG_CH11_PRE,
  DIALOG_CH11_WIN,
  DIALOG_CH11_LOSS,
  DIALOG_CH12_PRE,
  DIALOG_CH12_WIN,
  DIALOG_CH12_LOSS,
  DIALOG_AUTHORITY_TRIAL_PRE,
  DIALOG_AUTHORITY_TRIAL_WIN,
  DIALOG_AUTHORITY_TRIAL_LOSS,
  DIALOG_PROGRAMMER_GIFT_PRE,
  DIALOG_PROGRAMMER_GIFT_WIN,
  DIALOG_PROGRAMMER_GIFT_LOSS,
  DIALOG_GAME_MASTER_PRE,
  DIALOG_GAME_MASTER_WIN,
  DIALOG_GAME_MASTER_LOSS,
  DIALOG_SEER_VISIT_PRE,
  DIALOG_SEER_VISIT_WIN,
  DIALOG_SEER_VISIT_LOSS,
]);
