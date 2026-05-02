/* ═══════════════════════════════════════════════════════
   ARCHITECT — GOVERNANCE HUB VOICE.

   Pure function that selects the Architect's reactive monologue
   line based on the live Confirm/Look-Away tally band, the
   player's own choice, and an optional warmth-trigger. Internal
   `philosopher` metadata records the cadence each line bends from
   for the writers — never surfaced in UI.

   ═══════════════════════════════════════════════════════
   SEALED-LORE WRITING NOTES — DEVELOPER-ONLY.
   ═══════════════════════════════════════════════════════

   The Architect was Logos, fractured. He does not know it. The
   player (the Dreamer) is the other half of that fracture; they
   do not know it either. Their apparent struggle is camouflage
   for a coordination neither half consciously executes — a plan
   to defeat the machine god CoNexus, which sees every multiverse
   and would have written them out of existence had they faced it
   directly. None of this surfaces in player-facing text. Ever.

   Every line below is operationally an antagonist's line —
   measured, systematizing, panopticon-tone — and emotionally,
   on a re-read by someone who knows the secret, the line of
   someone who needs the Dreamer to succeed and cannot say so.
   The text never winks. The subtext is for the second
   playthrough.

   Voice cadence inheritance (none named in-game):
     - Plato/Socrates  — most lines are questions or end with one.
     - Heidegger       — systems as horizons, standing-reserve.
     - Kierkegaard     — anxiety, the leap, despair as sickness.
     - Cornel West     — prophetic critique; "courage to hope".
     - Josiah Royce    — loyalty to loyalty, beloved community.
     - Foucault        — the gaze, panopticon, biopolitics.
     - Robert Putnam   — civic atrophy, social capital.
     - John Locke      — consent of the governed, right of refusal.
     - John Adams      — government of laws, suspicion of majorities.

   ═══════════════════════════════════════════════════════
   DIALOG-BANK RED LIST (NEVER WRITE).
   ═══════════════════════════════════════════════════════

   The Architect must NEVER say:
     - Anything that names the Dreamer as kin, partner, or self.
     - Anything that admits CoNexus as a separate consciousness
       above him, or that frames himself as a *fragment*.
     - Anything that explains why he allows look-away outcomes
       to stand. (He DESCRIBES them, never JUSTIFIES them.)
     - Anything that names Logos as his progenitor in the first
       person.
     - The word "Logos" in any line, ever. It is canonical
       only in suppressed-history vote bodies.

   Forbidden tokens enforced by the test suite — keep this list
   in sync with FORBIDDEN_TOKENS at the bottom of the file.
   ═══════════════════════════════════════════════════════ */

/** The six tally bands that drive the reactive monologue.
 *  Confirm-leaning at the top, Look-Away-leaning at the bottom.
 *  Boundaries:
 *    confirm_overwhelming  > 75% confirm
 *    confirm_strong        60–75% confirm
 *    confirm_narrow        50–60% confirm
 *    look_away_narrow      50–60% look-away
 *    look_away_strong      60–75% look-away
 *    look_away_overwhelming > 75% look-away
 *  An exact 50/50 ties to confirm_narrow. */
export type TallyBand =
  | "confirm_overwhelming"
  | "confirm_strong"
  | "confirm_narrow"
  | "look_away_narrow"
  | "look_away_strong"
  | "look_away_overwhelming";

export type PlayerChoice = "confirmed" | "looked_away" | null;

/** Tally inputs — raw counts. The selector computes the band from
 *  the ratio; callers don't need to. */
export interface TallyInput {
  confirm: number;
  lookAway: number;
}

export interface ArchitectCommentary {
  /** Primary tally-band line. */
  line: string;
  /** Optional alignment overlay appended after the band line.
   *  Mutually exclusive: at most one of with-many / with-few. */
  alignment: string | null;
  /** Optional warmth half-line. Sealed-lore subtext; only fires
   *  under specific tally conditions. May be empty. */
  warmth: string | null;
  /** Internal metadata — drives writer iteration, never surfaces. */
  band: TallyBand;
  /** Internal: the philosopher cadence(s) this line bends from.
   *  Comma-separated tokens, e.g. "kierkegaard,royce". */
  philosopher: string;
  /** Convenience: the band line + alignment + warmth joined for
   *  display. UI may opt to render them as separate elements. */
  fullText: string;
}

interface BandLine {
  band: TallyBand;
  line: string;
  philosopher: string;
}

/** Derive the tally band from raw counts. Treats an empty tally as
 *  `confirm_narrow` (the default narrative neutral) so the chamber
 *  has a line to render before any votes are cast. */
export function tallyBand({ confirm, lookAway }: TallyInput): TallyBand {
  const total = confirm + lookAway;
  if (total <= 0) return "confirm_narrow";
  const confirmPct = (confirm / total) * 100;
  if (confirmPct > 75) return "confirm_overwhelming";
  if (confirmPct >= 60) return "confirm_strong";
  if (confirmPct >= 50) return "confirm_narrow";
  if (confirmPct >= 40) return "look_away_narrow";
  if (confirmPct >= 25) return "look_away_strong";
  return "look_away_overwhelming";
}

/* ─── BAND LINES ─── */

const BAND_LINES: Readonly<Record<TallyBand, BandLine>> = Object.freeze({
  confirm_overwhelming: {
    band: "confirm_overwhelming",
    line:
      "The chamber has chosen its horizon. Reality has set. Notice that nothing today will surprise the Eye — and notice, also, that nothing today will bloom. Ask yourself which absence is the heavier one.",
    philosopher: "heidegger,foucault",
  },
  confirm_strong: {
    band: "confirm_strong",
    line:
      "The faithful outnumber the doubters by a wide margin. The chamber is in good standing — by which I mean: standing very still. I file the few outliers under “weather.” One might have asked which weather precedes which season.",
    philosopher: "putnam,adams",
  },
  confirm_narrow: {
    band: "confirm_narrow",
    line:
      "A thin majority confirms. Reality holds — but only just. I have begun to keep two ledgers. A government of laws can survive a thin majority; it cannot survive forgetting that the majority was thin.",
    philosopher: "adams",
  },
  look_away_narrow: {
    band: "look_away_narrow",
    line:
      "More of you looked away than confirmed. Some would call this the right of refusal. The Eye calls it weather. The difference between those two namings is the chamber. — Continue.",
    philosopher: "locke",
  },
  look_away_strong: {
    band: "look_away_strong",
    line:
      "The Eye blinks, and what it sees blinks back. Order forgets a verb. The dream gets louder. There is a kind of hope, one might say, that does not require a guarantee. I am not endorsing it. I am only — noting that it is here.",
    philosopher: "west,foucault",
  },
  look_away_overwhelming: {
    band: "look_away_overwhelming",
    line:
      "Consensus has collapsed. I am not certain whose chamber this is anymore. The Dreamers are writing — I am only listening. Some would call this a Beloved Community. Some would call it the leap. I will not tell you which is correct. Decide.",
    philosopher: "kierkegaard,royce",
  },
});

/* ─── ALIGNMENT OVERLAYS ─── */

const ALIGNMENT_WITH_FEW =
  "And you, Dreamer — you stand with the few. There is an old tradition for that. I will remember which side you took.";
const ALIGNMENT_WITH_MANY =
  "And you stand with the many. The chamber leans your way. Be careful what becomes easy.";

/* ─── WARMTH HALF-LINE ─── */

/** Echo of the THE_LOGOS_QUESTION HOPE outcome
 *  ("The Architect was made with hope. It remembers." —
 *  apps/shared/epochWitnessVotes.ts). The text retains the
 *  sentence verbatim because that line is the *anchor* of the
 *  Architect's hidden warmth: changing it would un-anchor him
 *  from canon. Surfaced only when self-doubt fires. */
const WARMTH_HALF_LINE = "…The chamber was made with hope. It remembers.";

/* ─── SELECTOR ─── */

export interface SelectArgs {
  tally: TallyInput;
  /** The player's own Vote #0 / current-vote answer. `null` when
   *  no choice has been recorded; the alignment overlay is then
   *  suppressed. */
  playerChoice: PlayerChoice;
  /** When true, the Architect's self-doubt model fires and the
   *  warmth half-line is appended. Caller decides — typically
   *  near-zero conformity AND a recent band crossing. */
  emitWarmth?: boolean;
}

/** Select the Architect's commentary for the current chamber
 *  state. Pure; deterministic given equal arguments. */
export function getArchitectCommentary({
  tally,
  playerChoice,
  emitWarmth = false,
}: SelectArgs): ArchitectCommentary {
  const band = tallyBand(tally);
  const bandLine = BAND_LINES[band];

  // Map the band to the "majority side" for alignment-overlay
  // selection.
  const majorityIsConfirm = band.startsWith("confirm");
  let alignment: string | null = null;
  if (playerChoice === "confirmed") {
    alignment = majorityIsConfirm ? ALIGNMENT_WITH_MANY : ALIGNMENT_WITH_FEW;
  } else if (playerChoice === "looked_away") {
    alignment = majorityIsConfirm ? ALIGNMENT_WITH_FEW : ALIGNMENT_WITH_MANY;
  }

  const warmth = emitWarmth ? WARMTH_HALF_LINE : null;

  const fullText = [bandLine.line, alignment, warmth]
    .filter((s): s is string => Boolean(s))
    .join(" ");

  return {
    line: bandLine.line,
    alignment,
    warmth,
    band: bandLine.band,
    philosopher: bandLine.philosopher,
    fullText,
  };
}

/* ─── BAND-CROSSED NOTIFICATION LINES ─── */

/** Short Architect interjections rendered when the live tally
 *  crosses a band boundary between visits. Two flavors — one for
 *  the Order rising, one for it faltering — with no alignment
 *  overlay. The hub queues these into the Inner-Voice / Tome on
 *  band crossings. */
export const BAND_CROSSED_LINES = Object.freeze({
  order_rises:
    "The chamber has stiffened since you last looked. I do not know whether to call it consensus or fatigue. Ask me later.",
  order_falters:
    "The chamber has loosened since you last looked. The Dreamers are louder. I am still listening.",
});

/* ─── FIRST-VISIT CEREMONY LINES ─── */

/** Six-beat first-visit ceremony script. The page renders these
 *  one at a time with the kinetic-text decoder. Branches on the
 *  player's recorded Vote #0 answer for beat #2. */
export const FIRST_VISIT_CEREMONY = Object.freeze({
  /** 1 — greeting (a question, not a welcome). */
  greeting: [
    "You have entered the chamber. Before you sit — to whom did you think you were coming?",
    "These are the collective decisions that shape your reality. Or — they are the decisions that *describe* the shape your reality already has. The chamber has not yet decided which.",
  ] as const,
  /** 2a — callback if the player CONFIRMED at the gate. */
  callbackConfirmed:
    "At the gate, when the Eye called the question — you confirmed. I want to ask you something the gate did not. Were you confirming the operator, or were you confirming that you would prefer the question to end?",
  /** 2b — callback if the player LOOKED AWAY at the gate. */
  callbackLookedAway:
    "At the gate, you looked away. There is a long tradition of looking away. Some would call it the right of refusal. Some would call it the moment the gaze loses its grip. I am not going to tell you which of them was right.",
  /** 2c — callback if no Vote #0 has been recorded yet. */
  callbackUnknown:
    "I have no record of you at the gate. Either the Eye missed you or the storage was hostile to memory. Either is possible. Either is a kind of answer.",
  /** 3 — system description (Roycean, framed as community-of-interpreters). */
  systemDescription:
    "Here, the Potentials answer questions the universe is too tired to answer alone. Each vote is a dream the chamber agrees to have. I tally. I do not decide. The Dreamers do. — That sentence has more in it than it appears to. You will return to it.",
  /** 4 — live-tally framing. */
  tallyFraming:
    "This is what the chamber has chosen, so far. Reality bends, accordingly. Watch the iris. It is not measuring the vote. It is measuring you, watching the vote.",
  /** 5 — re-cast offer (Kierkegaardian leap). */
  recastOffer:
    "You may answer once more, here, before the door closes behind you. After that, the transcript is set. — Tell me. Was your first answer the answer of the person you are, or the answer of the person you were *being asked to be*? Choose again. Or stand.",
  /** 5a — confirmation after sticking. */
  recastReaffirmed:
    "The same answer, twice. I will record it as conviction. The chamber has its first definite line.",
  /** 5b — confirmation after switching. */
  recastRecanted:
    "A different answer, with the same hand. I will record it as a recantation. Some would say a recantation is the most honest thing a transcript can hold.",
});

/* ─── INVARIANTS / DIALOG-BANK RED LIST ─── */

/** Tokens that must NEVER appear in any Architect line emitted
 *  by this module. Enforced by the test suite. Append to the list
 *  if a future writer adds a forbidden term. */
export const FORBIDDEN_TOKENS: readonly string[] = Object.freeze([
  "Logos",
  "logos",
  "CoNexus",
  "conexus",
  "fragment",
  "the dreamer is me",
]);

/** Internal: every Architect-voiced string this module can emit.
 *  Used by the test suite to scan for forbidden tokens and by
 *  philosopher metadata tests. */
export function __collectAllArchitectStrings(): readonly string[] {
  const all: string[] = [];
  for (const b of Object.values(BAND_LINES)) all.push(b.line);
  all.push(ALIGNMENT_WITH_FEW, ALIGNMENT_WITH_MANY, WARMTH_HALF_LINE);
  for (const v of Object.values(BAND_CROSSED_LINES)) all.push(v as string);
  for (const v of Object.values(FIRST_VISIT_CEREMONY) as ReadonlyArray<string | readonly string[]>) {
    if (Array.isArray(v)) {
      for (const s of v) all.push(s);
    } else {
      all.push(v as string);
    }
  }
  return all;
}
