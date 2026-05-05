/* ═══════════════════════════════════════════════════════
   VEX REVEAL STAGE RESOLVER

   Sprint 3 #1 — the Engineer→Agent Zero→Vex Solène identity
   chain. The audit named this the highest-ROI Sprint 3 item:
   the corpus exists, the four reveal stages are wired in
   vex_solene.ts, the governance "Tell her" vote already sets
   `engineer_zero_hint`. What was missing: a single resolver
   the engine and the client can both call to know which stage
   Vex is currently in, plus the conditions that advance the
   final stage.

   Stage progression:

     eyes_of_reality      — default; pre-Mechronis encounter
     vex_public           — once the Maestro persona surfaces
                            (typically Act 2 Coda contracts)
     engineer_zero_hint   — set by governance "Tell her" vote
                            outcome OR by the Vex romance
                            stage-3 commitment beat
     engineer_zero_confirmed — Act 5+ AND
                            engineer_zero_hint set AND
                            (act_5_engineer_corroboration_seen
                             OR vex_played_for_one_listener flag)

   The resolver is pure — same flag set in, same stage out. The
   server's reveal-stage advancement code calls this on every
   game-state mutation that could plausibly cross a threshold,
   and writes `flag_set:engineer_zero_confirmed` to npc_public_flags
   when the result transitions for the first time.
   ═══════════════════════════════════════════════════════ */

export type VexRevealStage =
  | "eyes_of_reality"
  | "vex_public"
  | "engineer_zero_hint"
  | "engineer_zero_confirmed";

export interface VexRevealResolverInput {
  /** Set of currently-active narrative flags. */
  flags: ReadonlySet<string>;
  /** Player's current act number (0-7). */
  act: number;
}

/**
 * Resolve Vex's current reveal stage from the player's narrative
 * state. Called by selector callers, romance ladder
 * advancement, and the cross-character reaction emitter.
 */
export function resolveVexRevealStage(
  input: VexRevealResolverInput,
): VexRevealStage {
  const { flags, act } = input;
  if (
    flags.has("engineer_zero_confirmed") ||
    (flags.has("engineer_zero_hint") &&
      act >= 5 &&
      (flags.has("act_5_engineer_corroboration_seen") ||
        flags.has("vex_played_for_one_listener")))
  ) {
    return "engineer_zero_confirmed";
  }
  if (flags.has("engineer_zero_hint")) {
    return "engineer_zero_hint";
  }
  if (flags.has("vex_public_first_contact") || act >= 2) {
    return "vex_public";
  }
  return "eyes_of_reality";
}

/**
 * Compute which canonical flags need to be written to advance
 * Vex from her current stage to the next, given the player's
 * current state. Returns null if no advancement is currently
 * available — the player has met all the conditions or hasn't
 * yet met enough for the next stage.
 */
export function nextStageRequirements(
  current: VexRevealStage,
): { requiredFlags: readonly string[]; nextStage: VexRevealStage } | null {
  switch (current) {
    case "eyes_of_reality":
      return { requiredFlags: ["vex_public_first_contact"], nextStage: "vex_public" };
    case "vex_public":
      return { requiredFlags: ["engineer_zero_hint"], nextStage: "engineer_zero_hint" };
    case "engineer_zero_hint":
      return {
        requiredFlags: [
          "act_5_engineer_corroboration_seen",
          "vex_played_for_one_listener",
        ],
        nextStage: "engineer_zero_confirmed",
      };
    case "engineer_zero_confirmed":
      return null;
  }
}
