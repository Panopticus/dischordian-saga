/* ═══════════════════════════════════════════════════════
   POST-VICTORY CINEMATICS

   Per-chapter cinematic sequences played after a story-mode
   victory. Each cinematic is a sequence of beats — camera
   moves, visual effects, optional dialogue lines — timed
   on a single ms timeline.

   Data-only by design. FightPage (or a dedicated
   PostVictoryCinematicPlayer) consumes the registry on
   chapter complete and drives the playback. The actual
   camera / portrait rendering lives in FightArena2D;
   this file defines WHAT plays, not HOW.

   ═══════════════════════════════════════════════════════ */

// ─── CAMERA ────────────────────────────────────────────

export type CameraMove =
  | { type: "hold"; durationMs: number }
  | { type: "cut_to_wide"; durationMs: number }
  | { type: "cut_to_closeup"; target: "victor" | "defeated"; durationMs: number }
  | { type: "slow_zoom"; target: "victor" | "defeated" | "wide"; scale: number; durationMs: number }
  | { type: "slow_pan"; direction: "left" | "right" | "up" | "down"; durationMs: number }
  | { type: "pull_out"; durationMs: number }
  | { type: "shake"; intensity: number; durationMs: number }
  | { type: "dolly_around"; target: "victor" | "defeated"; degrees: number; durationMs: number };

// ─── EFFECTS ───────────────────────────────────────────

export type ColorGrade =
  | "normal"
  | "monochrome"
  | "sepia"
  | "purple_bloom"
  | "red_rage"
  | "green_death"
  | "gold_ascend"
  | "pink_glitch";

export type CinematicEffect =
  | { type: "portrait_fade"; actor: "victor" | "defeated"; to: number; durationMs: number }
  | { type: "color_grade"; to: ColorGrade; durationMs: number }
  | { type: "flash"; color: string; durationMs: number }
  | { type: "slow_motion"; factor: number; durationMs: number }
  | { type: "memory_fragment_float"; text: string; durationMs: number }
  | { type: "particle_burst"; color: string; count: number; durationMs: number }
  | { type: "text_card"; text: string; size: "sm" | "md" | "lg" | "xl"; color?: string; durationMs: number };

// ─── DIALOGUE ──────────────────────────────────────────

export interface CinematicDialogue {
  speaker: string;
  text: string;
  speakerColor?: string;
  /** If true, the line is internal monologue (italicized) */
  internal?: boolean;
}

// ─── BEAT ─────────────────────────────────────────────

export interface CinematicBeat {
  /** Label used by debug tools — not shown to the player */
  label: string;
  /** Optional camera move to execute at the start of this beat */
  camera?: CameraMove;
  /** Optional visual effect to apply at the start of this beat */
  effect?: CinematicEffect;
  /** Optional dialogue line to display during this beat */
  dialogue?: CinematicDialogue;
  /** How long this beat holds before advancing to the next one */
  durationMs: number;
}

// ─── CINEMATIC ────────────────────────────────────────

export interface PostVictoryCinematic {
  /** Matches a StoryChapter.id in storyModeChapters.ts */
  chapterId: string;
  title: string;
  /** If true, cinematic plays even on non-canonical outcomes
   *  (mandatory-loss chapters set this true because the "loss"
   *  IS the canonical ending) */
  playOnDefeat: boolean;
  beats: CinematicBeat[];
}

// ─── HELPERS ──────────────────────────────────────────

/** Sum of beat durations — total cinematic runtime in ms. */
export function cinematicTotalDuration(cin: PostVictoryCinematic): number {
  return cin.beats.reduce((sum, b) => sum + b.durationMs, 0);
}

/** Find the cinematic for a given chapter id, or null. */
export function getPostVictoryCinematic(chapterId: string): PostVictoryCinematic | null {
  return POST_VICTORY_CINEMATICS.find(c => c.chapterId === chapterId) ?? null;
}

// ═══════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════

const ch1: PostVictoryCinematic = {
  chapterId: "ch1_dead_signal",
  title: "Pattern Alpha-7-Violet",
  playOnDefeat: false,
  beats: [
    { label: "wide-establishing", camera: { type: "cut_to_wide", durationMs: 1200 }, effect: { type: "color_grade", to: "normal", durationMs: 0 }, durationMs: 1200 },
    { label: "zero-reveal", camera: { type: "slow_zoom", target: "defeated", scale: 1.3, durationMs: 1800 }, dialogue: { speaker: "Agent Zero", text: "Combat pattern Alpha-7-Violet. Confirmed.", speakerColor: "#94a3b8" }, durationMs: 2200 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "Your body fights with a pattern that belongs to someone called the Oracle.", durationMs: 3000 }, durationMs: 3200 },
    { label: "hold-silence", camera: { type: "hold", durationMs: 1500 }, effect: { type: "color_grade", to: "monochrome", durationMs: 800 }, durationMs: 1500 },
    { label: "fade-out", effect: { type: "portrait_fade", actor: "victor", to: 0.3, durationMs: 1200 }, durationMs: 1400 },
  ],
};

const ch2: PostVictoryCinematic = {
  chapterId: "ch2_arenas_law",
  title: "The Rotation Ends",
  playOnDefeat: false,
  beats: [
    { label: "jailer-falls", camera: { type: "slow_zoom", target: "defeated", scale: 1.4, durationMs: 1600 }, effect: { type: "flash", color: "#facc15", durationMs: 200 }, durationMs: 1800 },
    { label: "zero-approaches", camera: { type: "cut_to_closeup", target: "victor", durationMs: 1500 }, dialogue: { speaker: "Agent Zero", text: "Two wings. Wing A: Iron Lion. Wing B: Wraith Calder.", speakerColor: "#94a3b8" }, durationMs: 2400 },
    { label: "branch-card", effect: { type: "text_card", text: "BRANCH POINT A", size: "xl", color: "#a78bfa", durationMs: 2000 }, durationMs: 2200 },
    { label: "hold-choice", camera: { type: "hold", durationMs: 1200 }, durationMs: 1200 },
  ],
};

const ch3a: PostVictoryCinematic = {
  chapterId: "ch3a_generals_honor",
  title: "The Commander's Salute",
  playOnDefeat: false,
  beats: [
    { label: "iron-lion-rises", camera: { type: "cut_to_closeup", target: "defeated", durationMs: 1400 }, durationMs: 1400 },
    { label: "salute", dialogue: { speaker: "narrator", text: "Iron Lion salutes — fist to chest. A subordinate saluting a commander." }, effect: { type: "slow_motion", factor: 0.4, durationMs: 2000 }, durationMs: 2400 },
    { label: "gold-ascend", effect: { type: "color_grade", to: "gold_ascend", durationMs: 1500 }, camera: { type: "dolly_around", target: "defeated", degrees: 45, durationMs: 2000 }, durationMs: 2200 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "You gave him the lion crest before Veridian VI. You were his commander.", durationMs: 3000 }, durationMs: 3200 },
  ],
};

const ch3b: PostVictoryCinematic = {
  chapterId: "ch3b_the_ghost",
  title: "Seven Overlapping Bodies",
  playOnDefeat: false,
  beats: [
    { label: "calder-phases", camera: { type: "cut_to_closeup", target: "defeated", durationMs: 1200 }, effect: { type: "particle_burst", color: "#c4b5fd", count: 60, durationMs: 1500 }, durationMs: 1500 },
    { label: "echo-overlay", effect: { type: "text_card", text: "SEVEN BODIES — ONE GHOST", size: "lg", color: "#c4b5fd", durationMs: 2000 }, durationMs: 2200 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "Three architects of rebirth: Necromancer's code, Warden's modifications, Vox's nanobots.", durationMs: 3200 }, durationMs: 3400 },
    { label: "fade", effect: { type: "portrait_fade", actor: "victor", to: 0.4, durationMs: 1200 }, durationMs: 1200 },
  ],
};

const ch4: PostVictoryCinematic = {
  chapterId: "ch4_red_death",
  title: "Eleven Deaths",
  playOnDefeat: false,
  beats: [
    { label: "akai-rises", camera: { type: "slow_zoom", target: "defeated", scale: 1.25, durationMs: 1500 }, effect: { type: "color_grade", to: "red_rage", durationMs: 1200 }, durationMs: 1800 },
    { label: "warning", dialogue: { speaker: "Akai Shi", text: "The Necromancer is next. When he kills you — and he will — don't fight the green fire.", speakerColor: "#dc2626" }, durationMs: 3000 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "Akai Shi has died eleven times in the Necromancer's Matrix. She survives by refusing to grieve herself.", durationMs: 3200 }, durationMs: 3400 },
  ],
};

const ch5: PostVictoryCinematic = {
  chapterId: "ch5_dead_code_rising",
  title: "The Seventh Death",
  // CH5 is a mandatory-loss chapter — the cinematic plays on defeat.
  playOnDefeat: true,
  beats: [
    { label: "green-fire", effect: { type: "flash", color: "var(--energy-success)", durationMs: 200 }, camera: { type: "slow_zoom", target: "victor", scale: 1.6, durationMs: 1800 }, durationMs: 2000 },
    { label: "fall", effect: { type: "slow_motion", factor: 0.3, durationMs: 2500 }, dialogue: { speaker: "The Necromancer", text: "Green fire now. Soft, if it helps. Yes. Like that.", speakerColor: "var(--energy-success)" }, durationMs: 2800 },
    { label: "resurrection-voices", effect: { type: "text_card", text: "INK IN WATER. A NAME RISING TO THE SURFACE.", size: "md", color: "#a78bfa", durationMs: 2500 }, durationMs: 2700 },
    { label: "oracle-name", effect: { type: "text_card", text: "ORACLE.", size: "xl", color: "#c4b5fd", durationMs: 2500 }, camera: { type: "cut_to_closeup", target: "victor", durationMs: 1000 }, durationMs: 2700 },
    { label: "color-shift", effect: { type: "color_grade", to: "purple_bloom", durationMs: 1500 }, durationMs: 1600 },
    { label: "welcome-back", dialogue: { speaker: "Agent Zero", text: "You said a name. Out loud. You said ORACLE. Welcome back, Prophet.", speakerColor: "#94a3b8" }, durationMs: 3000 },
  ],
};

const ch6: PostVictoryCinematic = {
  chapterId: "ch6_false_prophet",
  title: "The Mirror Shatters",
  playOnDefeat: false,
  beats: [
    { label: "mirror-match-freeze", camera: { type: "hold", durationMs: 1000 }, effect: { type: "color_grade", to: "pink_glitch", durationMs: 600 }, durationMs: 1000 },
    { label: "glitch-burst", effect: { type: "particle_burst", color: "#ec4899", count: 120, durationMs: 1500 }, camera: { type: "shake", intensity: 0.4, durationMs: 800 }, durationMs: 1500 },
    { label: "warning", dialogue: { speaker: "The White Oracle", text: "There's a signal in Channel 7. Older than any of us. Find it.", speakerColor: "#f8fafc" }, durationMs: 3000 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "The White Oracle wears your face. Someone is puppeteering your identity.", durationMs: 3000 }, durationMs: 3200 },
  ],
};

const ch7: PostVictoryCinematic = {
  chapterId: "ch7_project_vector",
  title: "The Lab Coat Falls",
  playOnDefeat: false,
  beats: [
    { label: "vox-dissolves", effect: { type: "particle_burst", color: "#b91c1c", count: 80, durationMs: 1200 }, camera: { type: "slow_zoom", target: "defeated", scale: 1.4, durationMs: 1800 }, durationMs: 2000 },
    { label: "warlord-reveal", effect: { type: "color_grade", to: "red_rage", durationMs: 1200 }, dialogue: { speaker: "The Warlord", text: "Oracle. You cost me Veridian VI. You cost me my right hand.", speakerColor: "var(--energy-error)" }, durationMs: 2800 },
    { label: "virus-warning", dialogue: { speaker: "The Warlord", text: "The Thought Virus is already in you. I put it there eleven years ago.", speakerColor: "var(--energy-error)" }, durationMs: 2800 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "Dr. Vox is a puppet. The Warlord is wearing him like a lab coat.", durationMs: 3000 }, durationMs: 3200 },
  ],
};

const ch8: PostVictoryCinematic = {
  chapterId: "ch8_detective",
  title: "The Letter",
  playOnDefeat: false,
  beats: [
    { label: "human-nods", camera: { type: "cut_to_closeup", target: "defeated", durationMs: 1500 }, effect: { type: "color_grade", to: "sepia", durationMs: 1000 }, durationMs: 1500 },
    { label: "letter-reveal", dialogue: { speaker: "The Human", text: "You left a letter eleven years ago. It said: 'When I forget who I am, come find me.'", speakerColor: "#64748b" }, durationMs: 3500 },
    { label: "branch-card", effect: { type: "text_card", text: "BRANCH POINT B", size: "xl", color: "#a78bfa", durationMs: 2000 }, durationMs: 2200 },
  ],
};

const ch9a: PostVictoryCinematic = {
  chapterId: "ch9a_unknown_variable",
  title: "The Variable Resolved",
  playOnDefeat: false,
  beats: [
    { label: "enigma-math", camera: { type: "slow_zoom", target: "defeated", scale: 1.2, durationMs: 1500 }, effect: { type: "color_grade", to: "monochrome", durationMs: 1200 }, durationMs: 1500 },
    { label: "rylloh-strike", effect: { type: "text_card", text: "RYLLOH STRIKE — YOU NAMED THIS MOVE", size: "md", color: "var(--energy-primary)", durationMs: 2200 }, durationMs: 2400 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "Enigma watched you sacrifice yourself at Veridian VI as a math problem. She hasn't slept since.", durationMs: 3200 }, durationMs: 3400 },
  ],
};

const ch9b: PostVictoryCinematic = {
  chapterId: "ch9b_gamblers_truth",
  title: "Debt Paid",
  playOnDefeat: false,
  beats: [
    { label: "degen-deck", camera: { type: "cut_to_closeup", target: "defeated", durationMs: 1200 }, effect: { type: "particle_burst", color: "var(--energy-accent)", count: 40, durationMs: 1000 }, durationMs: 1400 },
    { label: "tip", dialogue: { speaker: "The Degen", text: "Don't fight the Architect on his own floor. Pick the chair he hates.", speakerColor: "var(--energy-accent)" }, durationMs: 3000 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "The Architect bet against your survival. The Degen bet for you.", durationMs: 3000 }, durationMs: 3200 },
  ],
};

const ch10: PostVictoryCinematic = {
  chapterId: "ch10_panoptic_warden",
  title: "The Chrome Jaw Rests",
  playOnDefeat: false,
  beats: [
    { label: "warden-kneels", camera: { type: "pull_out", durationMs: 1800 }, effect: { type: "slow_motion", factor: 0.5, durationMs: 1800 }, durationMs: 2000 },
    { label: "confession", dialogue: { speaker: "The Warden", text: "I put you in that cell so you'd survive what came next. Tell the Prophet — I love him still.", speakerColor: "#facc15" }, durationMs: 3800 },
    { label: "jaw-falls", effect: { type: "flash", color: "#facc15", durationMs: 300 }, camera: { type: "shake", intensity: 0.3, durationMs: 600 }, durationMs: 900 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "The Warden locked you up because he loved you.", durationMs: 3200 }, durationMs: 3400 },
  ],
};

const ch11: PostVictoryCinematic = {
  chapterId: "ch11_harvester_reckoning",
  title: "The Jar Opens",
  playOnDefeat: false,
  beats: [
    { label: "collector-bows", camera: { type: "slow_zoom", target: "defeated", scale: 1.35, durationMs: 1800 }, effect: { type: "color_grade", to: "purple_bloom", durationMs: 1500 }, durationMs: 2000 },
    { label: "jar-rises", effect: { type: "particle_burst", color: "#a855f7", count: 100, durationMs: 1800 }, camera: { type: "slow_pan", direction: "up", durationMs: 1800 }, durationMs: 2000 },
    { label: "mothers-face", effect: { type: "text_card", text: "YOU REMEMBER YOUR MOTHER'S FACE.", size: "lg", color: "#f0abfc", durationMs: 2800 }, durationMs: 3000 },
    { label: "silence", camera: { type: "hold", durationMs: 1500 }, durationMs: 1500 },
    { label: "memory-fragment", effect: { type: "memory_fragment_float", text: "The Collector kept one jar back 'in case he comes looking.' The jar is yours now.", durationMs: 3200 }, durationMs: 3400 },
  ],
};

const ch12: PostVictoryCinematic = {
  chapterId: "ch12_architects_design",
  title: "The Design Collapses",
  playOnDefeat: false,
  beats: [
    { label: "phase-1-end", camera: { type: "slow_zoom", target: "defeated", scale: 1.4, durationMs: 1800 }, durationMs: 1800 },
    { label: "pink-glitch", effect: { type: "color_grade", to: "pink_glitch", durationMs: 600 }, dialogue: { speaker: "The Architect", text: "The White Oracle you fought on Thaloria? My voice inside her smile.", speakerColor: "var(--energy-error)" }, durationMs: 3200 },
    { label: "phase-2-confession", dialogue: { speaker: "The Architect", text: "I wore your face for a decade. It is the only skin I ever fit into.", speakerColor: "var(--energy-error)" }, durationMs: 3200 },
    { label: "corruption-bleed", effect: { type: "particle_burst", color: "#dc2626", count: 160, durationMs: 2500 }, camera: { type: "shake", intensity: 0.5, durationMs: 1500 }, durationMs: 2500 },
    { label: "final-warning", dialogue: { speaker: "The Architect", text: "The Source, Oracle. You have to deal with the Source now. The Arena is coming apart.", speakerColor: "var(--energy-error)" }, durationMs: 3400 },
    { label: "throne-room-collapses", camera: { type: "pull_out", durationMs: 2200 }, effect: { type: "color_grade", to: "red_rage", durationMs: 1500 }, durationMs: 2400 },
    { label: "prophet-stands", effect: { type: "text_card", text: "THE ORACLE STANDS ALONE", size: "xl", color: "#c4b5fd", durationMs: 3200 }, durationMs: 3400 },
  ],
};

// ─── REGISTRY ──────────────────────────────────────────

export const POST_VICTORY_CINEMATICS: PostVictoryCinematic[] = [
  ch1, ch2, ch3a, ch3b, ch4, ch5, ch6, ch7, ch8, ch9a, ch9b, ch10, ch11, ch12,
];

/** Map of chapter id → cinematic for O(1) lookup. */
export const POST_VICTORY_CINEMATIC_BY_CHAPTER: Record<string, PostVictoryCinematic> =
  Object.fromEntries(POST_VICTORY_CINEMATICS.map(c => [c.chapterId, c]));
