/* ═══════════════════════════════════════════════════════
   TERMINUS CINEMATIC ASSETS — Keyframe Pairs (10)

   Start/end keyframe pairs for Terminus Swarm cinematic
   sequences. Start frames are used as video poster
   images in TerminusSwarmPage.tsx. End frames complete
   the pairs for Kling video generation.

   Mirrors the DMC keyframe pattern in dmcAssets.ts.
   Source: s3://dgrsart/terminus_cinematics.zip
   ═══════════════════════════════════════════════════════ */

export const TERMINUS_KEYFRAMES = {
  cin01: { start: "/art/terminus/cinematics/cin01_start.png", end: "/art/terminus/cinematics/cin01_end.png" },
  cin02: { start: "/art/terminus/cinematics/cin02_start.png", end: "/art/terminus/cinematics/cin02_end.png" },
  cin03: { start: "/art/terminus/cinematics/cin03_start.png", end: "/art/terminus/cinematics/cin03_end.png" },
  cin04: { start: "/art/terminus/cinematics/cin04_start.png", end: "/art/terminus/cinematics/cin04_end.png" },
  cin05: { start: "/art/terminus/cinematics/cin05_start.png", end: "/art/terminus/cinematics/cin05_end.png" },
} as const;

export const TERMINUS_CINEMATIC_MANIFEST = {
  keyframes: { count: 10, format: "PNG", dir: "/art/terminus/cinematics/" },
  total: 10,
} as const;
