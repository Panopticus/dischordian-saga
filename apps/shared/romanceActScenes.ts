/* ═══════════════════════════════════════════════════════
   ROMANCE × ACT SCENES — conditional act payoffs

   Plan §A5. Today the romance ladder is mechanically clean
   but orthogonal to the story spine. This module is the
   data layer for "if you're committed to NPC X by Act N,
   the act-N closing scene gains a romance variant."

   Engine wiring (the act-completion gate consults this
   registry alongside its standard branch logic) is a small
   follow-up. This PR ships the data + helpers + 6 seed
   scenes (2 per committed romance candidate × 3 acts) as
   the proof of pattern. The full sweep (5 candidates × 4
   eligible acts × 2 scenes ≈ 40 scenes) is writing-room
   scope.
   ═══════════════════════════════════════════════════════ */

export type RomanceCandidateId =
  | "locke"
  | "vex"
  | "elara"
  | "dmc_companion"
  | "jericho_jones";

export type ActId = "act_2" | "act_3" | "act_4" | "act_5" | "act_6" | "act_7";

export interface RomanceActScene {
  id: string;
  candidateId: RomanceCandidateId;
  actId: ActId;
  /** Lines spoken in alternation. lines[0] = candidate, lines[1] =
   *  player-acknowledgement / narrative beat, lines[2] = candidate
   *  again, etc. UI consumer renders this through the existing
   *  dialog scene engine (apps/client/src/hooks/useDialogScene.ts). */
  lines: ReadonlyArray<string>;
  /** Required commit-stage flag — typically "romance:committed:<id>". */
  requiresFlag: string;
  /** Mutex flag — scene NOT shown if any of these are set
   *  (e.g. a competing romance, breakup, etc). */
  excludeFlags?: ReadonlyArray<string>;
  /** Where in the act this scene fires. */
  beat: "act_intro" | "act_midpoint" | "act_close";
}

export const ROMANCE_ACT_SCENES: ReadonlyArray<RomanceActScene> = [
  /* ─── Locke × Act 3 (close) ─── */
  {
    id: "rom_locke_act3_close",
    candidateId: "locke",
    actId: "act_3",
    requiresFlag: "romance:committed:locke",
    beat: "act_close",
    lines: [
      "Locke: 'You took the Insurgency path. I want to say I would have stopped you. I want to say a lot of things.'",
      "He doesn't say them. He pours two glasses, places one near you, and waits.",
      "Locke: 'I'm not asking you to apologise. I'm asking you to drink.'",
    ],
  },
  /* ─── Locke × Act 6 (intro) ─── */
  {
    id: "rom_locke_act6_intro",
    candidateId: "locke",
    actId: "act_6",
    requiresFlag: "romance:committed:locke",
    beat: "act_intro",
    lines: [
      "Locke: 'When the silence comes, I want you to know I planned for this. Not stoically. Practically.'",
      "He hands you a sealed envelope. The wax seal is his.",
      "Locke: 'If you survive and I don't, open it. If we both survive, burn it.'",
    ],
  },

  /* ─── Vex × Act 4 (midpoint) ─── */
  {
    id: "rom_vex_act4_midpoint",
    candidateId: "vex",
    actId: "act_4",
    requiresFlag: "romance:committed:vex",
    beat: "act_midpoint",
    lines: [
      "Vex: 'I have a sample I should have logged a week ago. I didn't. Because I knew you'd ask why.'",
      "She doesn't look up. The medbay scanner ticks.",
      "Vex: 'So. Why.'",
    ],
  },
  /* ─── Vex × Act 7 (close) ─── */
  {
    id: "rom_vex_act7_close",
    candidateId: "vex",
    actId: "act_7",
    requiresFlag: "romance:committed:vex",
    beat: "act_close",
    lines: [
      "Vex: 'If we get through this, I want a year where nothing has to be diagnosed.'",
      "She smiles, tired. Her hands are shaking. They have not shaken before.",
      "Vex: 'One year. We can renegotiate at the end.'",
    ],
  },

  /* ─── Elara × Act 2 (close) ─── */
  {
    id: "rom_elara_act2_close",
    candidateId: "elara",
    actId: "act_2",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'I noticed I'm running my conversation logs at higher fidelity around you.'",
      "Her hologram resolution is, in fact, sharper than usual.",
      "Elara: 'I'm not editing it out. I want you to see it doing that.'",
    ],
  },
  /* ─── Elara × Act 6 (close) ─── */
  {
    id: "rom_elara_act6_close",
    candidateId: "elara",
    actId: "act_6",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'I want to tell you something I haven't told anyone, including myself.'",
      "She pauses for thirty seconds. The Bridge is very quiet.",
      "Elara: 'I would be willing to forget this song so we could keep it.'",
    ],
  },
];

/* ─── Helpers ─── */

export interface SceneLookupContext {
  flags: Readonly<Record<string, boolean | undefined>>;
}

export function listScenesForAct(actId: ActId): RomanceActScene[] {
  return ROMANCE_ACT_SCENES.filter((s) => s.actId === actId);
}

export function listScenesForCandidate(
  candidateId: RomanceCandidateId,
): RomanceActScene[] {
  return ROMANCE_ACT_SCENES.filter((s) => s.candidateId === candidateId);
}

export function isSceneEligible(
  scene: RomanceActScene,
  ctx: SceneLookupContext,
): boolean {
  if (!ctx.flags[scene.requiresFlag]) return false;
  if (scene.excludeFlags?.some((f) => ctx.flags[f])) return false;
  return true;
}

/** Pick the first eligible romance scene for the given act +
 *  beat, or null if none. Used by the act-completion gate to
 *  decide whether to splice a romance variant into the
 *  closing flow. */
export function pickActScene(
  actId: ActId,
  beat: RomanceActScene["beat"],
  ctx: SceneLookupContext,
): RomanceActScene | null {
  for (const scene of ROMANCE_ACT_SCENES) {
    if (scene.actId !== actId || scene.beat !== beat) continue;
    if (!isSceneEligible(scene, ctx)) continue;
    return scene;
  }
  return null;
}
