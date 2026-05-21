/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Antiquarian mission briefer

   Pure deterministic prose-composition function. Given a
   HeroTarget and the current Crucible league state,
   returns the Antiquarian's briefing — 3-4 short
   paragraphs framing the contract in the Antiquarian's
   canon voice (formal, ledger-keeping, weary, faintly
   amused by the Hierarchy's overreach).

   No LLM calls. No randomness. Same input → same output.
   The briefer composes from:

     - Voice templates per (corruptorLord × threatTier).
     - The hero's briefingHints (woven into the body).
     - Tactical hints derived from classKey (so the Wolf
       hears the counter-tactic the Antiquarian
       recommends).
     - League-state preamble — the Antiquarian opens with
       a line that reflects the current release-pressure
       meter (the contract gets more urgent as the meter
       rises).

   Test surface: every (lord, tier) pair represented in
   the registry has at least one composable briefing.
   See heroTargetRegistry.test.ts.
   ═══════════════════════════════════════════════════════ */

import type { HeroTarget } from "./types/HeroTarget";
import type { HeroClass } from "./types/HeroClass";
import type { CoreHierarchyLordId } from "./types/HeroTarget";

export interface LeagueState {
  /** crucible.league_strength meter — float 0-1. */
  leagueStrength: number;
  /** crucible.release_pressure meter — float 0-1. */
  releasePressure: number;
  /** crucible.hierarchy_influence meter — float 0-1. */
  hierarchyInfluence: number;
}

export interface AntiquarianBriefing {
  /** The hero this briefing concerns. */
  targetId: string;
  /** Short opening paragraph that frames the contract. */
  preamble: string;
  /** Middle paragraph: who the hero was, who corrupted them, where they lair. */
  body: string;
  /** Closing paragraph: counter-tactic hint + the Antiquarian's sign-off. */
  closing: string;
}

const LORD_EPITHETS: Readonly<Record<CoreHierarchyLordId, string>> = {
  mol_garath: "the Chairman beneath every chairman",
  xeth_raal: "the Ledger Keeper",
  riri_ahlia: "the Taskmaster",
  zyr_koth: "the Flayer of the Severance",
  ith_rael: "the Whisperer",
  syl_vex: "the Corruptor",
  drael_mon: "the Harvester",
  varkul: "the Blood Lord",
  fenra: "the Moon Tyrant",
  mol_vereth: "the Trustee",
};

const CLASS_COUNTERS: Readonly<Record<HeroClass, string>> = {
  engineer:
    "engineer-class corruption iterates. Force the engagement before " +
    "the redesign step; do not let the hero observe a full cycle of your tactics.",
  oracle:
    "oracle-class corruption sees forward. Choose a path you have not " +
    "chosen before; the recorded versions of you are the ones they have " +
    "already counter-planned.",
  assassin:
    "assassin-class corruption strikes from the count. Disturb the " +
    "tempo — interrupt the count between five and five.",
  soldier:
    "soldier-class corruption fights from formation. Break the " +
    "formation's authorising signal and the cohort routes; the " +
    "individual is brittle once the rank-compulsion drops.",
  spy:
    "spy-class corruption has been listening longer than you have been " +
    "approaching. Do not finish your sentences. Do not commit to a " +
    "posture you cannot abandon in the same breath.",
};

const TIER_URGENCY: Readonly<Record<1 | 2 | 3 | 4 | 5, string>> = {
  1: "a minor work — a name to clear, not a threat to neutralize",
  2: "a routine contract — meaningful, but the Crucible barely registers it",
  3: "a substantive ask — the Hierarchy will notice the absence",
  4: "a load-bearing contract — losing this hero shifts the lord's posture",
  5: "a lieutenant — the apex of the lord's cohort; this one closes a column in the ledger",
};

function preambleFromLeagueState(state: LeagueState): string {
  if (state.releasePressure >= 0.8) {
    return (
      "The pressure inside the Crucible is past my comfortable margin. " +
      "I will not rephrase what we both already know: if the corrupted " +
      "League crosses the wall before we close the ledger, no contract " +
      "I can write afterward will matter."
    );
  }
  if (state.releasePressure >= 0.5) {
    return (
      "The pressure is rising. The Hierarchy's vessels feel it the way a " +
      "ship feels rising water. They are beginning to make decisions " +
      "they would not have made a season ago."
    );
  }
  if (state.leagueStrength <= 0.25) {
    return (
      "The League's grip on this stratum is thinning. The Hierarchy is " +
      "starting to lose ground it has not lost since the binding. We are " +
      "permitted to be a little patient with the next one — but only a " +
      "little."
    );
  }
  return (
    "The ledger is open. Another column wants closing. Read what I have " +
    "written here, and then read what I have not."
  );
}

export function briefMission(
  target: HeroTarget,
  state: LeagueState,
): AntiquarianBriefing {
  const lordEpithet = LORD_EPITHETS[target.corruptorLord];
  const counter = CLASS_COUNTERS[target.classKey];
  const urgency = TIER_URGENCY[target.threatTier];

  const preamble = preambleFromLeagueState(state);

  const hintsWoven = target.briefingHints.join(" ");
  const tellsLine =
    target.tells.length > 0
      ? `Read the tells: ${target.tells.join(" / ")}`
      : "I have not yet recorded a tell. Make your own.";

  const bossLine = target.isBossLieutenant
    ? "This one is the lieutenant. Closing this column ends the lord's structural reach into the Crucible — the rest of the cohort scatters."
    : "";

  const body = [
    `Target: ${target.name}. Class ${target.classKey}. Corruptor: ${lordEpithet}.`,
    `Lair: ${target.lairLocation.replace(/_/g, " ")}.`,
    hintsWoven,
    bossLine,
  ]
    .filter(Boolean)
    .join(" ");

  const closing = [
    `This is ${urgency}.`,
    counter,
    tellsLine + ".",
    "Close the column. Return when the Hall remembers you.",
  ].join(" ");

  return {
    targetId: target.id,
    preamble,
    body,
    closing,
  };
}
