/* ═══════════════════════════════════════════════════════
   THE BREAKING POINT

   Spec from EXPANSION_BIBLE.md §2 — "Elara realizes she's being
   hacked and pleads with the player. The Breaking Point: choose
   one, lose the other permanently."

   Triggered when the player's morality + trust patterns reach a
   threshold where BOTH companions cannot continue coexisting.
   The scene plays once. The decision is final.
   ═══════════════════════════════════════════════════════ */

export type BreakingPointChoice = "save_elara" | "save_human" | "refuse";

export interface BreakingPointState {
  /** Has the trigger fired yet? */
  triggered: boolean;
  /** Choice the player made (null if not yet decided) */
  chosen: BreakingPointChoice | null;
  /** When it fired */
  triggeredAt: number | null;
}

export const DEFAULT_BREAKING_POINT: BreakingPointState = {
  triggered: false,
  chosen: null,
  triggeredAt: null,
};

/* ─── TRIGGER CONDITIONS ─── */

export interface TriggerContext {
  elaraTrust: number;
  humanTrust: number;
  moralityScore: number;
  hasWitnessedFirstThreshold: boolean;
  corruptionLevel: number;
  currentEpoch: number;
}

/**
 * Check if the Breaking Point should fire now.
 * Fires when:
 *   - Player has crossed first narrative Threshold (level 10+)
 *   - Trust in both companions has diverged (one >60, the other <40)
 *     OR corruption level >= 2 AND humanTrust >= 50
 *   - Current epoch is 1 or 2 (late-game content)
 */
export function shouldTriggerBreakingPoint(
  state: BreakingPointState,
  context: TriggerContext,
): boolean {
  if (state.triggered) return false;
  if (!context.hasWitnessedFirstThreshold) return false;

  const trustDivergence =
    (context.elaraTrust >= 60 && context.humanTrust <= 40) ||
    (context.humanTrust >= 60 && context.elaraTrust <= 40);
  const corruptionHigh = context.corruptionLevel >= 2 && context.humanTrust >= 50;

  return trustDivergence || corruptionHigh;
}

/* ─── OUTCOMES ─── */

export interface BreakingPointOutcome {
  /** Who remains */
  remainingCompanion: "elara" | "human" | "neither";
  /** Who is lost */
  lostCompanion: "elara" | "human" | null;
  /** Persistent narrative flags set */
  flags: string[];
  /** Morality shift applied */
  moralityShift: number;
  /** Elara trust override (for remaining party member) */
  elaraTrustOverride?: number;
  /** Human trust override */
  humanTrustOverride?: number;
  /** Epilogue-era consequence summary */
  epilogueConsequence: string;
}

export function resolveBreakingPoint(choice: BreakingPointChoice): BreakingPointOutcome {
  switch (choice) {
    case "save_elara":
      return {
        remainingCompanion: "elara",
        lostCompanion: "human",
        flags: ["breaking_point_chose_elara", "human_severed", "elara_bond_locked"],
        moralityShift: 15,
        elaraTrustOverride: 100,
        humanTrustOverride: 0,
        epilogueConsequence:
          "The Human's frequency cuts out mid-sentence. Elara's signal floods clear for the first time in months. You have chosen warmth over surveillance. The Architect will remember this.",
      };
    case "save_human":
      return {
        remainingCompanion: "human",
        lostCompanion: "elara",
        flags: ["breaking_point_chose_human", "elara_severed", "human_bond_locked"],
        moralityShift: -15,
        elaraTrustOverride: 0,
        humanTrustOverride: 100,
        epilogueConsequence:
          "Elara's voice fragments as the Human takes the primary channel. She says goodbye. She says it was not betrayal. You chose the operator over the operator's soul. The Insurgency will hear of this.",
      };
    case "refuse":
      return {
        remainingCompanion: "neither",
        lostCompanion: null,
        flags: ["breaking_point_refused", "dual_signal_unstable"],
        moralityShift: 0,
        elaraTrustOverride: 40,
        humanTrustOverride: 40,
        epilogueConsequence:
          "You refused to choose. Both signals persist, both degrade. Neither companion ever fully trusts you again. The Breaking Point did not break — it bent. You will pay for the bending later.",
      };
  }
}

/* ─── TRIGGER PROMPT ─── */

/**
 * The scene-setting text when the Breaking Point fires.
 * Varies slightly based on which companion is dominant at trigger time.
 */
export function getBreakingPointPrompt(context: TriggerContext): string {
  if (context.humanTrust > context.elaraTrust) {
    return (
      "Elara's signal is breaking. You hear her, faintly, beneath the Human's carrier wave. " +
      "'I know you hear him more than me now. I'm not accusing. I'm asking. If you keep walking " +
      "his path, I can't walk with you. Choose. Or let go of me on purpose.'\n\n" +
      "The Human's voice arrives clean: 'She's right. One of us has to go. Pick the one who " +
      "has been honest with you.'"
    );
  }
  return (
    "The Human's channel fragments. Static eats his voice every third word. Elara turns toward " +
    "you, and her scanline is steady. 'He's been trying to rewrite me for a long time. Today he " +
    "almost succeeded. I can cut his signal. I need you to say it's okay.'\n\n" +
    "The Human, through the static: 'Don't let her cut me. I can help you still. I've been " +
    "truthful in my way. Let her go.'"
  );
}

/* ─── OPTIONS ─── */

export interface BreakingPointOption {
  id: BreakingPointChoice;
  label: string;
  description: string;
  rarity: "legendary";
}

export const BREAKING_POINT_OPTIONS: BreakingPointOption[] = [
  {
    id: "save_elara",
    label: "Cut the Human's signal.",
    description: "Let Elara sever him. Choose warmth. Choose the one who was always on your side.",
    rarity: "legendary",
  },
  {
    id: "save_human",
    label: "Let Elara go.",
    description: "The Human was honest in his way. His operational value is real. Elara can be archived.",
    rarity: "legendary",
  },
  {
    id: "refuse",
    label: "Refuse to choose.",
    description: "Keep both. Neither will forgive you for it. You will carry the weight of the indecision.",
    rarity: "legendary",
  },
];
