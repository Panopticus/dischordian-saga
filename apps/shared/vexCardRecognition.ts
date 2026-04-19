/* ═══════════════════════════════════════════════════════
   VEX SOLÈNE — *THE FRIEND I SAVED* CARD RECOGNITION

   Canonical one-time dialog beat that fires the first time
   the player plays *The Friend I Saved* (the C3 Mythic Light
   unlock from Act 1, §2.12) in any Act 3 match.

   Per Act 1 Ship-Ready Bible §2.12 and §23.8: when Vex
   Solène encounters the card during a Coda-adjacent Act 3
   context (Trade Empire narration, Coda mission briefing,
   or an Act 3 card ladder match where she is watching), the
   card's flavor text triggers a one-time custom dialog beat
   where Vex **recognizes the card**.

   She does NOT know why she recognizes it. She cannot
   place the memory. The recognition itself is the weight —
   she has been carrying the Engineer's remnant since C3
   and the card is the canonical interface to that remnant.
   The player hears this dialog exactly once per save; the
   `vex_recognized_friend_i_saved` flag gates subsequent
   plays back to the generic dialog.

   Canonical cross-references:
     - Act 1 §2.12 (C3 card unlock + flavor text branches)
     - Act 1 §15.3 (dignity-condition N-score — feeds into
       the variant selection below)
     - CANON_REV_7_ORACLE_VEX_EXPANSION.md §1.3 item 5
       (the transference; why the recognition is possible)
     - CANON_REV_7_ORACLE_VEX_EXPANSION.md §1.5 rule 1
       (Vex never says "Agent Zero" aloud — constrains
       the dialog authoring below)
   ═══════════════════════════════════════════════════════ */

export interface VexRecognitionDialog {
  /**
   * Dialog variant id. Selection is keyed to the player's C3
   * N-score (Cards played as yourself / 12) from §15.3.
   */
  id: "n_0" | "n_1_3" | "n_4_7" | "n_8_11" | "n_12";
  /** The N-score band this variant triggers for. */
  nRange: { min: number; max: number };
  /**
   * Vex's recognition line. Delivered in the canonical
   * Vex voice profile (existing `agent_zero` profile with
   * the §1.5 rule 3 post modifiers: 30% less urgency, 50%
   * more warmth, no static layer).
   */
  vexLine: string;
  /**
   * Actor direction for the VO session. Short, behavioral,
   * not philosophical.
   */
  direction: string;
  /**
   * Flag written on the player's narrativeFlags set when
   * this dialog fires. The presence of the flag gates the
   * dialog to one-time play.
   */
  firesFlag: "vex_recognized_friend_i_saved";
}

export const VEX_RECOGNITION_DIALOG: readonly VexRecognitionDialog[] = [
  {
    id: "n_0",
    nRange: { min: 0, max: 0 },
    vexLine:
      "Stop. Stop — play that again. I know that card. I — I have never seen it. I know that card.",
    direction:
      "The N=0 variant: the player's C3 was entirely swarm-conscripted. Vex sees the card with no residue; the recognition is pure remnant, disoriented. Hold the stops long. The second 'I have never seen it' should sound frustrated rather than denial.",
    firesFlag: "vex_recognized_friend_i_saved",
  },
  {
    id: "n_1_3",
    nRange: { min: 1, max: 3 },
    vexLine:
      "You have that card. Of course you have that card. I have not seen it before but I have — I am going to stop talking now. Please keep playing.",
    direction:
      "Warm, uncertain, slightly embarrassed at herself. The 'Of course' is soft, observational. The pivot to 'please keep playing' is her professional self closing the door on whatever just opened.",
    firesFlag: "vex_recognized_friend_i_saved",
  },
  {
    id: "n_4_7",
    nRange: { min: 4, max: 7 },
    vexLine:
      "I know the name of that card. I have not been told. I do not know what that means and I am not going to ask. Your move.",
    direction:
      "Level, a little shaken, pulling authority back fast. The 'I am not going to ask' is canonical — she is refusing her own question. Hold a 0.5s beat before 'Your move.'",
    firesFlag: "vex_recognized_friend_i_saved",
  },
  {
    id: "n_8_11",
    nRange: { min: 8, max: 11 },
    vexLine:
      "That card is mine. I did not know it was mine until you set it on the table. Play it. I want to see it played by the right hand.",
    direction:
      "Quiet, certain, owning it. The N=8-11 player earned enough dignity in C3 that the remnant is nearer the surface for her — she claims the card rather than questioning it. 'The right hand' is said without irony.",
    firesFlag: "vex_recognized_friend_i_saved",
  },
  {
    id: "n_12",
    nRange: { min: 12, max: 12 },
    vexLine:
      "He saved me with that card. I have no memory of him. I have the card. That is enough. Thank you.",
    direction:
      "The canonical N=12 variant: the player held every card themselves through all twelve turns of C3. Vex does not say his name; she does not need to. Hold the 'Thank you' bare — no emotion beyond the gratitude itself. This is the only variant where she addresses the Engineer directly through the card.",
    firesFlag: "vex_recognized_friend_i_saved",
  },
];

/**
 * Select the canonical recognition dialog for the player's
 * C3 N-score. N-score falls outside 0-12 should never happen;
 * the function throws if that invariant is violated.
 */
export function selectVexRecognitionDialog(
  c3NScore: number,
): VexRecognitionDialog {
  if (c3NScore < 0 || c3NScore > 12) {
    throw new Error(
      `C3 N-score ${c3NScore} is out of canonical 0-12 range (§15.3).`,
    );
  }
  const match = VEX_RECOGNITION_DIALOG.find(
    (d) => c3NScore >= d.nRange.min && c3NScore <= d.nRange.max,
  );
  // Invariant: the five variants partition [0, 12] exactly.
  if (!match) {
    throw new Error(
      `No recognition dialog for N=${c3NScore} — canonical partition broken.`,
    );
  }
  return match;
}

/**
 * Guard for whether the recognition dialog should fire for a
 * given player state. Returns true only if all canonical
 * conditions are satisfied:
 *   - narrativeAct >= 3 (Act 3 or later)
 *   - vex_recognized_friend_i_saved flag not yet set
 *   - The Friend I Saved card is being played NOW
 */
export function shouldFireVexRecognition(params: {
  narrativeAct: number;
  cardBeingPlayed: string;
  flags: Record<string, unknown>;
}): boolean {
  if (params.narrativeAct < 3) return false;
  if (params.cardBeingPlayed !== "friend_i_saved") return false;
  if (params.flags["vex_recognized_friend_i_saved"] === true) return false;
  return true;
}
