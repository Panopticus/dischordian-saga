/* ═══════════════════════════════════════════════════════
   THE PALIMPSEST — CINEMATIC CUE STUBS

   Six hero cinematics from design proposal §C.8. This file
   is the scheduling registry: it declares which cinematic
   plays on which episode, the target duration, the scene
   description (for the Seedance 2 prompt), and the canonical
   "mask slip" animation cue used when Noise dominates the
   meter.

   The actual video assets are produced outside the repo.
   This module lets the client know WHICH cue to play and
   WHERE it goes in the broadcast.
   ═══════════════════════════════════════════════════════ */

export type CinematicId =
  | "cold_open_bumper"
  | "darrens_first_letter"
  | "vyre_guest_judge"
  | "inventor_full_takeover"
  | "meme_identity_reveal"
  | "darren_funeral_b_roll";

export interface PalimpsestCinematic {
  id: CinematicId;
  episode: number;
  /** Approximate duration in seconds. */
  duration: number;
  scene: string;
  /** Seedance 2 prompt — the text a renderer uses to produce the shot. */
  renderPrompt: string;
  /** Optional override: where in the episode this cue plays. */
  cueAt: "cold_open" | "round_2" | "round_3" | "finale" | "post_credits";
}

export const PALIMPSEST_CINEMATICS: PalimpsestCinematic[] = [
  {
    id: "cold_open_bumper",
    episode: 1, // Reused every episode with a single line variation.
    duration: 10,
    cueAt: "cold_open",
    scene:
      "The Palimpsest logo writes itself in gold ink on a parchment page. Red ink crosses it out. Gold ink rewrites it. The Host walks on-stage from the bottom of the frame.",
    renderPrompt:
      "Seedance 2: illuminated manuscript unfurls against a black void, gold calligraphy draws the words 'THE PALIMPSEST,' red ink crosshatches them, gold rewrites underneath, camera pulls back to reveal a stage, a tall man in red goggles walks into frame from below. 10 seconds, 24fps, cinematic.",
  },
  {
    id: "darrens_first_letter",
    episode: 2,
    duration: 20,
    cueAt: "post_credits",
    scene:
      "Darren at his desk in the Dreams Workshop sub-basement, 3am, typing a letter. Camera over his shoulder. The screen shows the Episode 2 letter. He deletes the last paragraph twice. On the third try, he writes 'You were right.' and sends it without reading it back.",
    renderPrompt:
      "Seedance 2: tired man in his 30s, ill-fitting cardigan, typing alone in a cluttered basement office under a single desk lamp, camera over his shoulder reading the screen, he deletes a paragraph, retypes, deletes again, finally writes 'You were right' and hits send. 20 seconds, warm lamp light, cinematic.",
  },
  {
    id: "vyre_guest_judge",
    episode: 6,
    duration: 15,
    cueAt: "round_3",
    scene:
      "Professor Vyre walks onto the Mechronis Survivor set. Red goggles catch the studio light. He lifts a red pen and marks a contestant's answer RIGHT after the Host's scoreboard marked it WRONG. The scoreboard glitches, updates.",
    renderPrompt:
      "Seedance 2: tall gaunt academic in dark robes with red-lens goggles strides onto a brightly-lit quiz show set, picks up a red marker, draws a check mark over a large glowing scoreboard that is already showing a cross, the scoreboard stutters, cross becomes check. 15 seconds, high contrast.",
  },
  {
    id: "inventor_full_takeover",
    episode: 12,
    duration: 45,
    cueAt: "finale",
    scene:
      "Mid-episode, the Host's face dissolves into static. A long level voice reads a list of contestant names that should still be alive. The final name is Darren Fessler. The broadcast cuts to black. A single frame of a schematic diagram of the Matrix of Dreams flashes. Signed —I.",
    renderPrompt:
      "Seedance 2: quiz show host mid-sentence, his face dissolves into grey static, over the static a calm male voice reads ten names. Last name is 'Darren Fessler.' Cut to black. One frame flash of a blueprint-style schematic with the signature '—I.' at the bottom. 45 seconds, tense minimal score, cinematic finale.",
  },
  {
    id: "meme_identity_reveal",
    episode: 12,
    duration: 8,
    cueAt: "finale",
    scene:
      "Single held shot: the Host's mask falls away for exactly four frames. Underneath is the Meme, crying. The mask snaps back. The Host laughs like nothing happened.",
    renderPrompt:
      "Seedance 2: close-up of a cheerful game show host, his face slips off like a mask for four frames revealing a weeping figure underneath, mask snaps back, host laughs heartily. 8 seconds, close up, subtle horror.",
  },
  {
    id: "darren_funeral_b_roll",
    episode: 13,
    duration: 30,
    cueAt: "cold_open",
    scene:
      "Thirty seconds of a small graveside service in the Celebration sector cemetery. Nine people attending. One of them is Professor Vyre. One of them is a ghost contestant from Episode 4. Nobody speaks. The sky is fake; it is on purpose.",
    renderPrompt:
      "Seedance 2: small outdoor graveside service in an artificial cemetery with a painted sky, nine mourners in quiet clothes, one tall man in dark robes and red goggles at the back, another figure who shimmers faintly, slow pushes in on each face, no dialogue. 30 seconds, elegiac tone.",
  },
];

/* ─── HOST MASK SLIP ANIMATION CUE ─── */

/**
 * Canonical timing for the Host's mask slip. The client component
 * reads this to know when to glitch the face texture / flash the
 * Meme underneath. Shorter when the player has merely hit the
 * corruption threshold; full 4-frame reveal at overwritten.
 */
export interface MaskSlipCue {
  durationMs: number;
  framesShown: number;
  glitchIntensity: 0 | 1 | 2 | 3;
  revealMemeBelow: boolean;
  soundCue: "static" | "heartbeat" | "laugh" | "silent";
}

export const MASK_SLIP_CUES: Record<"corrupted" | "overwritten", MaskSlipCue> = {
  corrupted: {
    durationMs: 120,
    framesShown: 2,
    glitchIntensity: 1,
    revealMemeBelow: false,
    soundCue: "static",
  },
  overwritten: {
    durationMs: 400,
    framesShown: 4,
    glitchIntensity: 3,
    revealMemeBelow: true,
    soundCue: "silent",
  },
};

/* ─── HELPERS ─── */

export function getCinematicsForEpisode(episode: number): PalimpsestCinematic[] {
  return PALIMPSEST_CINEMATICS.filter((c) => c.episode === episode);
}
