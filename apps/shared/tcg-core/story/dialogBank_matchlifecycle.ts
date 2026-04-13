/**
 * Dialog bank — match lifecycle cues (D10).
 *
 * These are the one-liners that play at specific moments inside
 * any match, not just campaign chapters. They're the texture
 * that keeps a PvP skirmish or a draft tournament from feeling
 * mechanical.
 *
 * Scenes covered:
 *   - dialog_match_mulligan_generic — Elara talks you through
 *     your opening hand
 *   - dialog_match_start_{faction} — one per faction, Elara's
 *     opening line when you start a match with that faction
 *     as your general
 *   - dialog_bbs_cast_{faction} — one-liner when a Bloodborn
 *     Spell fires
 *   - dialog_victory_{faction} — Elara's end-of-match win line
 *   - dialog_defeat_{faction} — Elara's end-of-match loss line
 *
 * The client plays these automatically on the matching event
 * emitted by the reducer (mulligan_finished, bloodborn_cast,
 * match_ended). Ids are keyed by faction so the client just
 * builds the lookup string from `player.faction`.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   MULLIGAN (generic, one scene, plays every match)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_MATCH_MULLIGAN: DialogScene = {
  id: "dialog_match_mulligan_generic",
  label: "Match — Mulligan guidance (generic)",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "curious",
      text: "That's your opening hand. Swap whichever cards feel wrong — the deck will replace them from the same shuffle, so what you hate now won't come back to punish you. The Engineer called this 'one mercy per match.'",
      audioClipId: "vo_elara_mulligan_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   MATCH START (one scene per faction)
   ═══════════════════════════════════════════════════════ */

export const DIALOG_MATCH_START_ARCHITECT: DialogScene = {
  id: "dialog_match_start_architect",
  label: "Match start — Architect faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "reflective",
      text: "Architect deck loaded. You are playing the side of the table that prefers its outcomes pre-computed. Don't hurry. The game punishes hurry when you're running computation.",
      audioClipId: "vo_elara_start_architect",
    },
  ],
};

export const DIALOG_MATCH_START_INSURGENCY: DialogScene = {
  id: "dialog_match_start_insurgency",
  label: "Match start — Insurgency faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Insurgency deck loaded. Zero's old faction. Play fast, play angry, play like the cameras are about to cycle — because somewhere, in some timeline, they are.",
      audioClipId: "vo_elara_start_insurgency",
    },
  ],
};

export const DIALOG_MATCH_START_DREAMER: DialogScene = {
  id: "dialog_match_start_dreamer",
  label: "Match start — Dreamer faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "reflective",
      text: "Dreamer deck loaded. The Oracle's people — or they would have been, if she'd allowed herself to have people. Listen to the deck. It knows what it wants before you do.",
      audioClipId: "vo_elara_start_dreamer",
    },
  ],
};

export const DIALOG_MATCH_START_NEW_BABYLON: DialogScene = {
  id: "dialog_match_start_new_babylon",
  label: "Match start — New Babylon faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "guarded",
      text: "New Babylon deck loaded. Every card in that pile has a receipt. Read the bottom line before you play anything — especially the Bloodborn. Locke never paid a bill without knowing what it was.",
      audioClipId: "vo_elara_start_new_babylon",
    },
  ],
};

export const DIALOG_MATCH_START_ANTIQUARIAN: DialogScene = {
  id: "dialog_match_start_antiquarian",
  label: "Match start — Antiquarian faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "reflective",
      text: "Antiquarian deck loaded. Patience in a stack of cards. She catalogued twelve endings and left you the patience to avoid the thirteenth. Play slow. Play like she's watching.",
      audioClipId: "vo_elara_start_antiquarian",
    },
  ],
};

export const DIALOG_MATCH_START_THOUGHT_VIRUS: DialogScene = {
  id: "dialog_match_start_thought_virus",
  label: "Match start — Thought Virus faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "conflicted",
      text: "Thought Virus deck loaded. I don't love seeing this one in your hand, Potential. But I understand — sometimes you need to learn the shape of the thing you're going to have to fight. Play it carefully. Don't let it play you.",
      audioClipId: "vo_elara_start_thought_virus",
    },
  ],
};

export const DIALOG_MATCH_START_NEUTRAL: DialogScene = {
  id: "dialog_match_start_neutral",
  label: "Match start — Neutral faction",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Neutral deck loaded. My deck, if I'm being honest about it. The cards the Engineer made for the people who hadn't picked a side yet. Good company. Good luck.",
      audioClipId: "vo_elara_start_neutral",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BLOODBORN SPELL CAST (one scene per general)
   The client plays these the first time a BBS fires in a
   match — the general being played narrates their own ability.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BBS_CAST_ARCHITECT: DialogScene = {
  id: "dialog_bbs_cast_architect",
  label: "Bloodborn cast — The Architect",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "the_architect",
      mood: "reflective",
      text: "Predetermined design.",
      audioClipId: "vo_arch_bbs_cast",
    },
  ],
};

export const DIALOG_BBS_CAST_INSURGENCY: DialogScene = {
  id: "dialog_bbs_cast_insurgency",
  label: "Bloodborn cast — Agent Zero",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "agent_zero",
      mood: "triumphant",
      text: "Dead signal, loud and clear.",
      audioClipId: "vo_zero_bbs_cast",
    },
  ],
};

export const DIALOG_BBS_CAST_DREAMER: DialogScene = {
  id: "dialog_bbs_cast_dreamer",
  label: "Bloodborn cast — The Oracle",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "the_oracle",
      mood: "reflective",
      text: "I've already seen this.",
      audioClipId: "vo_oracle_bbs_cast",
    },
  ],
};

export const DIALOG_BBS_CAST_NEW_BABYLON: DialogScene = {
  id: "dialog_bbs_cast_new_babylon",
  label: "Bloodborn cast — Adjudicator Locke",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "locke",
      mood: "cryptic",
      text: "Dark bargain. The ledger balances.",
      audioClipId: "vo_locke_bbs_cast",
    },
  ],
};

export const DIALOG_BBS_CAST_ANTIQUARIAN: DialogScene = {
  id: "dialog_bbs_cast_antiquarian",
  label: "Bloodborn cast — The Antiquarian",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "antiquarian",
      mood: "reflective",
      text: "Temporal echo. A lesson from a timeline that didn't make it.",
      audioClipId: "vo_antiquarian_bbs_cast",
    },
  ],
};

export const DIALOG_BBS_CAST_THOUGHT_VIRUS: DialogScene = {
  id: "dialog_bbs_cast_thought_virus",
  label: "Bloodborn cast — The Source",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "the_source",
      mood: "cryptic",
      text: "Viral propagation. I am being merciful.",
      audioClipId: "vo_source_bbs_cast",
    },
  ],
};

export const DIALOG_BBS_CAST_NEUTRAL: DialogScene = {
  id: "dialog_bbs_cast_neutral",
  label: "Bloodborn cast — Elara",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Ark protocol. I've got you.",
      audioClipId: "vo_elara_bbs_cast",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   VICTORY / DEFEAT (generic, one per outcome)
   Plays at match_ended for any non-campaign match.
   ═══════════════════════════════════════════════════════ */

export const DIALOG_MATCH_VICTORY: DialogScene = {
  id: "dialog_match_victory",
  label: "Match ended — victory",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "warm",
      text: "Good game, Potential. The Engineer used to say the only match that mattered was the one you remembered the day after — I think you'll remember this one. Save the replay. We can watch it together later if you want.",
      audioClipId: "vo_elara_victory",
    },
  ],
};

export const DIALOG_MATCH_DEFEAT: DialogScene = {
  id: "dialog_match_defeat",
  label: "Match ended — defeat",
  kind: "match_lifecycle",
  cues: [
    {
      speaker: "elara",
      mood: "protective",
      text: "That one got away from you. Breathe. The Engineer's notes used to say the second-best thing about losing was that it gave you a reason to remember the opponent. Remember theirs. The rematch will go differently.",
      audioClipId: "vo_elara_defeat",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   BANK EXPORT
   ═══════════════════════════════════════════════════════ */

export const DIALOG_BANK_MATCH_LIFECYCLE: readonly DialogScene[] = Object.freeze([
  DIALOG_MATCH_MULLIGAN,
  DIALOG_MATCH_START_ARCHITECT,
  DIALOG_MATCH_START_INSURGENCY,
  DIALOG_MATCH_START_DREAMER,
  DIALOG_MATCH_START_NEW_BABYLON,
  DIALOG_MATCH_START_ANTIQUARIAN,
  DIALOG_MATCH_START_THOUGHT_VIRUS,
  DIALOG_MATCH_START_NEUTRAL,
  DIALOG_BBS_CAST_ARCHITECT,
  DIALOG_BBS_CAST_INSURGENCY,
  DIALOG_BBS_CAST_DREAMER,
  DIALOG_BBS_CAST_NEW_BABYLON,
  DIALOG_BBS_CAST_ANTIQUARIAN,
  DIALOG_BBS_CAST_THOUGHT_VIRUS,
  DIALOG_BBS_CAST_NEUTRAL,
  DIALOG_MATCH_VICTORY,
  DIALOG_MATCH_DEFEAT,
]);
