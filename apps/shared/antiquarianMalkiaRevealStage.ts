/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN / MALKIA UKWELI REVEAL STAGE

   Sprint 3 #2 — the audit named the dual-nature thread
   ('Antiquarian + Malkia = two halves of one being') as
   post-credits-only content; the recommendation was a gradual
   reveal across Acts 4-7. This module defines the four-stage
   ladder for that reveal so callers can resolve the current
   stage from narrative flags and emit the matching cross-
   character reactions.

   Stage progression:

     unrelated      — default; the Antiquarian and Malkia are
                      treated as independent figures
     resonance      — small synchronicities surface (a phrase
                      Malkia uses appears in the Antiquarian's
                      inscription a week later); set by
                      `act4_malkia_phrase_echo`
     paired         — explicit pairing — they appear together
                      in a record, or one names the other; set
                      by `act5_antiquarian_malkia_paired`
     two_halves     — full reveal: they are halves of one being.
                      Set by `act6_antiquarian_malkia_revealed`
                      OR by completing the Malkia revolution
                      questline.
   ═══════════════════════════════════════════════════════ */

export type AntiquarianMalkiaStage =
  | "unrelated"
  | "resonance"
  | "paired"
  | "two_halves";

export interface AntiquarianMalkiaResolverInput {
  flags: ReadonlySet<string>;
  act: number;
}

export function resolveAntiquarianMalkiaStage(
  input: AntiquarianMalkiaResolverInput,
): AntiquarianMalkiaStage {
  const { flags, act } = input;
  if (
    flags.has("act6_antiquarian_malkia_revealed") ||
    flags.has("malkia_revolution_questline_complete")
  ) {
    return "two_halves";
  }
  if (flags.has("act5_antiquarian_malkia_paired")) {
    return "paired";
  }
  if (flags.has("act4_malkia_phrase_echo") || act >= 4) {
    return "resonance";
  }
  return "unrelated";
}

export function nextAntiquarianMalkiaStage(
  current: AntiquarianMalkiaStage,
): { requiredFlags: readonly string[]; nextStage: AntiquarianMalkiaStage } | null {
  switch (current) {
    case "unrelated":
      return { requiredFlags: ["act4_malkia_phrase_echo"], nextStage: "resonance" };
    case "resonance":
      return { requiredFlags: ["act5_antiquarian_malkia_paired"], nextStage: "paired" };
    case "paired":
      return {
        requiredFlags: [
          "act6_antiquarian_malkia_revealed",
          "malkia_revolution_questline_complete",
        ],
        nextStage: "two_halves",
      };
    case "two_halves":
      return null;
  }
}
