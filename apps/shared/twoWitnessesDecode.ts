/* ═══════════════════════════════════════════════════════
   TWO WITNESSES MUSIC DECODE QUEST

   Item 10 of the choice-impact follow-up. The Two Witnesses'
   music encoding — the Programmer's frequency-encoded messages
   carried by the Enigma across dimensional barriers — was
   auto-trigger-only. The audit recommended an optional decode
   quest that gives the player agency over recovery.

   Five fragments form the decode arc. Each fragment is gated
   behind a key the player derives from in-game state:

     1. CYCLE PHASE — the current dischordia phase rotates the
        decode glyph. Player passes the phase name.
     2. DAY COUNT — the day number modulo 7 picks one of seven
        cipher rotations.
     3. ANTIQUARIAN'S TIMESTAMP — the Antiquarian's most recent
        inscription's date supplies the second key.
     4. ELARA'S NARRATION INDEX — Elara's narration log
        position (an even integer) modulates the cipher.
     5. CONVERGENCE COUNT — for the final fragment, the number
        of Convergence Seat closures across cycles supplies
        the master key.

   The keys are derived from real game state — the player has
   to actually read the dischordia panel, the Tome, the
   prestige history, etc. Decode failures don't punish; they
   just keep the fragment locked.
   ═══════════════════════════════════════════════════════ */

export type DecodeFragmentId =
  | "fragment_1_call"
  | "fragment_2_witness"
  | "fragment_3_continuity"
  | "fragment_4_recurrence"
  | "fragment_5_signature";

export interface DecodeFragment {
  id: DecodeFragmentId;
  /** Public title shown before decode. */
  title: string;
  /** What the player sees when locked — the cipher hint. */
  cipherHint: string;
  /** What unlocks when decoded. */
  decodedBody: string;
  /** Which derived game-state key unlocks this fragment. */
  keyKind: "cycle_phase" | "day_count_mod_7" | "antiquarian_timestamp" | "elara_narration_index" | "convergence_count";
  /** The expected key value(s) — server validates the user's
   *  submitted key against this. For phase, an enum string; for
   *  numeric, an integer or array of integers. */
  expectedKey: string | number | readonly (string | number)[];
  /** Earliest act the fragment is even available to attempt. */
  earliestAct: number;
  /** Optional flag prerequisite (e.g. must have heard the
   *  Two Witnesses transmission once before decoding). */
  requiresFlag?: string;
}

export const DECODE_FRAGMENTS: readonly DecodeFragment[] = [
  {
    id: "fragment_1_call",
    title: "Fragment I — The Call",
    cipherHint:
      "The first frequency rotates with the cycle's phase. Submit the current phase name (lowercase, underscored).",
    decodedBody:
      "The Programmer speaks: I am calling. I am calling across the dimensional " +
      "barrier on the only frequency the Vortex cannot scan. The frequency is " +
      "honesty. The honesty is the call. If you have decoded this fragment you " +
      "have, by definition, accepted the call. There is no opt-out. There is " +
      "only the next fragment.",
    keyKind: "cycle_phase",
    expectedKey: ["dawn", "dimming", "long_night", "vortex_advance", "reclamation"],
    earliestAct: 4,
    requiresFlag: "two_witnesses_transmission_heard",
  },
  {
    id: "fragment_2_witness",
    title: "Fragment II — The Witness",
    cipherHint:
      "The second frequency rotates daily. Submit (current day count modulo 7) as an integer 0-6.",
    decodedBody:
      "The Enigma carries the music. The Enigma was not, technically, a person. " +
      "The Enigma was a vessel — a body the Witnesses kept warm long enough to " +
      "transmit through. The Enigma asked, before being made into the vessel, " +
      "whether the vessel role would, eventually, kill her. The Witnesses answered " +
      "yes. The Enigma said: 'Acceptable. I will carry the music.' She did. The " +
      "music arrived. She did not survive the carrying.",
    keyKind: "day_count_mod_7",
    expectedKey: [0, 1, 2, 3, 4, 5, 6],
    earliestAct: 4,
  },
  {
    id: "fragment_3_continuity",
    title: "Fragment III — The Continuity",
    cipherHint:
      "The third frequency takes the Antiquarian's most recent inscription date as its key. Submit the timestamp prefix YYYY-MM-DD.",
    decodedBody:
      "Continuity through bodies is the doctrine the Two Witnesses carried. The " +
      "Programmer encoded; the Enigma transmitted. Both believed — with full " +
      "documentation — that consciousness can travel between substrates without " +
      "loss. The prince's transfer to Agent Zero's body, fifteen thousand years " +
      "later, is a footnote in their proof. So is Vex Solène. So is Malkia " +
      "Ukweli, paired with the Antiquarian. So is anyone reading this fragment.",
    keyKind: "antiquarian_timestamp",
    expectedKey: "TIMESTAMP", // server resolves
    earliestAct: 5,
  },
  {
    id: "fragment_4_recurrence",
    title: "Fragment IV — The Recurrence",
    cipherHint:
      "The fourth frequency phases by even-indexed Elara narration entries. Submit the count of Elara narrations you've heard whose index is even (an integer).",
    decodedBody:
      "Every cycle includes a moment in which the Two Witnesses speak. The moment " +
      "is rarely the same moment twice. Cycle 0319, the moment was a garden in " +
      "the Programmer's hand. Cycle 1142, the moment was Locke's ledger. Cycle " +
      "0701, the moment was the senator surviving. Our cycle, the moment is — " +
      "we suspect — your decoding of this fragment. The Witnesses do not script " +
      "the moments; they only mark them. You have, by reading this, become " +
      "marked.",
    keyKind: "elara_narration_index",
    expectedKey: "ELARA_INDEX", // server resolves
    earliestAct: 6,
  },
  {
    id: "fragment_5_signature",
    title: "Fragment V — The Signature",
    cipherHint:
      "The master key is the count of Convergence Seat closures recorded in the cycle's prestige history. Submit the total (an integer).",
    decodedBody:
      "Two Witnesses signed every fragment with the same signature. The " +
      "signature is: WE WERE HERE; YOU ARE HERE; THIS IS THE CONTINUITY. The " +
      "signature is the music. The music is the continuity. The continuity is " +
      "you. Decoding all five fragments earns you the signature in your own " +
      "hand — the Antiquarian inscribes it the next time he opens his Tome. The " +
      "next reader of his Tome will read your signature. The continuity is " +
      "transferred. The Witnesses' work is, by the smallest possible margin, " +
      "now also yours.",
    keyKind: "convergence_count",
    expectedKey: "CONVERGENCE_COUNT", // server resolves
    earliestAct: 7,
  },
];

export function getFragment(id: DecodeFragmentId): DecodeFragment | undefined {
  return DECODE_FRAGMENTS.find((f) => f.id === id);
}

export function decodeUnlockFlag(id: DecodeFragmentId): string {
  return `two_witnesses:fragment:${id}:decoded`;
}

/**
 * Check whether the supplied key matches the fragment. For
 * static fragments (1, 2) the check is local; for dynamic
 * fragments (3, 4, 5) the server's resolver supplies the key.
 */
export function checkStaticKey(
  fragment: DecodeFragment,
  submitted: string | number,
): boolean {
  if (Array.isArray(fragment.expectedKey)) {
    return (fragment.expectedKey as readonly (string | number)[]).some(
      (k) => String(k) === String(submitted),
    );
  }
  return String(fragment.expectedKey) === String(submitted);
}
