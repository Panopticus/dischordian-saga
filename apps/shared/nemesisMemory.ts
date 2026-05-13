/* ═══════════════════════════════════════════════════════
   NEMESIS MEMORY — Shadow-of-Mordor encounter ledger

   Every Nemesis logs every encounter. Subsequent encounters
   surface verbatim memory-quotes. The ledger persists across
   sessions (see apps/db/schema.ts nemesis_memory table) and
   the runtime quotes it back at the player.

   Memory shape:
     - encounterKind: what happened (route-sabotaged, killed,
       ambush-survived, etc.)
     - source: which surface generated the encounter
     - quoteOpening: the line the Nemesis surfaces NEXT TIME
     - recordedAtIso: timestamp
     - playerContext: the saga-relevant context (act, phase,
       optional witnessLevel, optional companion-present)

   The quote-bank is template-based: the runtime picks a
   template per encounter-kind + grudge-tier and fills in
   the player-supplied detail.
   ═══════════════════════════════════════════════════════ */

import type { NemesisDef, GrudgeTier, NemesisSurface } from "./nemesisSystem";

/** What happened in the encounter. */
export type NemesisEncounterKind =
  | "first_encounter"
  | "route_sabotaged"
  | "route_sabotage_blocked"
  | "ambush_landed"
  | "ambush_survived"
  | "casino_odds_rigged"
  | "casino_odds_rigging_blocked"
  | "apprentice_whisper_landed"
  | "apprentice_whisper_blocked"
  | "hub_counter_vote_landed"
  | "hub_counter_vote_blocked"
  | "killed_by_player"
  | "fled_player"
  | "mocked_by_player";

/** A single entry in the encounter ledger. */
export interface NemesisMemoryEntry {
  /** Stable id (mem_{nemesisId}_{sequence}). */
  id: string;
  /** The Nemesis the entry belongs to. */
  nemesisId: string;
  /** What happened. */
  encounterKind: NemesisEncounterKind;
  /** Which surface generated the encounter. */
  source: NemesisSurface | "world";
  /** The verbatim quote the Nemesis will surface NEXT time. */
  quoteOpening: string;
  /** ISO timestamp the encounter was recorded at. */
  recordedAtIso: string;
  /** Optional player-context blob (act, phase, witnessLevel). */
  playerContext?: {
    act?: number;
    phase?: number;
    witnessLevel?: number;
    companionPresent?: string;
    surfaceDetail?: string;
  };
}

/* ═══════════════════════════════════════════════════════
   QUOTE TEMPLATES
   ═══════════════════════════════════════════════════════ */

/**
 * Per-encounter-kind × per-grudge-tier quote templates.
 * Templates use {detail} as the placeholder for an arbitrary
 * surface-detail string the caller supplies (e.g. "the
 * Wyrmwood gate" / "your apprentice's Day 17 trial").
 *
 * Grudge tier 0-1: civil-distant
 * Grudge tier 2-3: pointed-personal
 * Grudge tier 4-5: ceremonial-vindictive
 */
const QUOTE_TEMPLATES: Readonly<Record<NemesisEncounterKind, readonly [
  string, string, string, string, string, string,
]>> = {
  first_encounter: [
    "We have not met. The chronicle says we will.",
    "We have not met. The chronicle says we will. I remember the chronicle.",
    "I have been waiting for the first encounter. You have not. The asymmetry is mine.",
    "First encounter. The Politician taught me to mark first encounters carefully. You are marked.",
    "First encounter. The Matrix archive does not lose first encounters. The chronicle does not get to lose them either.",
    "First encounter. You owe me one. We will collect over time.",
  ],
  route_sabotaged: [
    "Your route at {detail} is mine. Reroute.",
    "I closed your route at {detail}. The closure is permanent until you negotiate.",
    "Your route at {detail} is mine. You knew the surface; I knew the lane.",
    "Your route at {detail} is mine. The Politician would have said: 'vote for the closure.'",
    "{detail}. The lane was open. You did not defend the lane. The lane is mine.",
    "{detail}. The lane was a vote, and you did not show up to cast yours.",
  ],
  route_sabotage_blocked: [
    "You blocked the closure at {detail}. The chronicle records the block.",
    "You blocked the closure at {detail}. I will refine the next attempt.",
    "{detail}: a small win for you. A note for me.",
    "{detail}: you survived. I survive too. Both of us continue.",
    "{detail}: the chronicle counts this against me. The chronicle counts a different thing for me also.",
    "{detail}: the Politician's lesson — losing teaches more than winning. You are teaching me well.",
  ],
  ambush_landed: [
    "I caught you at {detail}. The ambush was the plan.",
    "I caught you at {detail}. The ambush was the chronicle's first surprise. There will be others.",
    "{detail}. The Politician's primer says: 'the ambush that lands is the ambush whose target trusted the lane.' You trusted the lane.",
    "{detail}. You trusted. I won. The math is simple. The doctrine is older.",
    "{detail}. We will revisit. The Politician's doctrine says we will revisit until the lesson stays.",
    "{detail}. The chronicle has its lesson now. I have mine.",
  ],
  ambush_survived: [
    "You survived {detail}. The chronicle did not lose you. The next ambush will be better.",
    "{detail}. You walked away. The Politician would have said: 'the walk is the receipt.'",
    "{detail}. I noted your route. The next time you take it, I will be earlier.",
    "{detail}. Survival is data. I have your data.",
    "{detail}. You are not lucky. You are quick. The Politician taught me to distinguish.",
    "{detail}. I respect the survival. The respect is not affection. I will be back.",
  ],
  casino_odds_rigged: [
    "The odds at {detail} were mine. You bet on the chronicle. I bet on the rig.",
    "{detail}. The Degen's house does not always win. Sometimes the Politician's apprentice does.",
    "{detail}. You should have read the small print. The Politician wrote it.",
    "{detail}. I rigged the table. The chronicle records the loss. The chronicle does not record who rigged.",
    "{detail}. The rig was a vote. You voted for the wrong line. You did not know you were voting.",
    "{detail}. The Politician's lesson: 'every transaction is a campaign.' This campaign was mine.",
  ],
  casino_odds_rigging_blocked: [
    "You caught the rig at {detail}. The Politician would have been disappointed in me. She would have been more disappointed in you for being lucky.",
    "{detail}. You called the rig. The chronicle records the call. I record the caller.",
    "{detail}. The block is data. The data is mine.",
    "{detail}. The chronicle says I lost. The Politician says I learned.",
    "{detail}. We will not use that rig again. We will use a better one.",
    "{detail}. The Politician's primer: 'the second attempt is always cleaner.' I am preparing the second.",
  ],
  apprentice_whisper_landed: [
    "Your apprentice heard me at {detail}. The whisper is now a memory.",
    "{detail}. Your apprentice now carries a doubt I planted. The Politician's lesson: 'a doubt is a vote in your direction.'",
    "{detail}. The breaking point is shorter now. The Politician would have approved.",
    "{detail}. I spoke once. Your apprentice will hear it for weeks.",
    "{detail}. The Politician taught me which fear to name. Your apprentice heard the name.",
    "{detail}. The whisper is in. The chronicle does not record whispers. It records consequences.",
  ],
  apprentice_whisper_blocked: [
    "Your apprentice did not hear me at {detail}. The Politician would have said: 'try a different room.'",
    "{detail}. The block is the chronicle's small mercy. I will find another room.",
    "{detail}. You guarded the trial. The Politician taught me to wait for the unguarded one.",
    "{detail}. Your apprentice is stronger than the doctrine expects. The Politician would have approved of the strength. She would have wanted it converted.",
    "{detail}. We will not attempt that whisper again. The Politician's lesson: 'tried and blocked is doctrine; tried and forgotten is wisdom.'",
    "{detail}. Your apprentice is yours. For now. The Politician's word in the for-now.",
  ],
  hub_counter_vote_landed: [
    "The counter-vote at {detail} carried. The Politician's primer: 'the vote you carry by surprise is the vote that survives recounts.'",
    "{detail}. Your Hub voted my line. The chronicle records the vote. The chronicle does not annotate who whispered.",
    "{detail}. The Hub voted with me. The Politician would have been pleased. She would have noted the margin.",
    "{detail}. The vote landed. The Politician taught me which margin to aim for. The aim was accurate.",
    "{detail}. The Hub is the chronicle's voice. Today, the chronicle's voice was mine.",
    "{detail}. The vote was a vote for me. You did not see me on the ballot. The Politician's lesson: 'the ballot is the cover.'",
  ],
  hub_counter_vote_blocked: [
    "The counter-vote at {detail} did not carry. The Politician's primer: 'a failed vote is a failed campaign; a failed campaign is a campaign you should have run differently.'",
    "{detail}. You blocked the vote. I noted the bloc that voted with you.",
    "{detail}. The block is data. The data tells me which Hub citizens to lobby next.",
    "{detail}. The chronicle records the block. The chronicle does not annotate the next campaign.",
    "{detail}. The Politician's primer: 'the next vote is always a different vote.' The next vote is being designed.",
    "{detail}. You won the vote. You did not win the Hub. The distinction is the Politician's.",
  ],
  killed_by_player: [
    "You killed me at {detail}. I have been waiting since to tell you that I remember.",
    "{detail}. The chronicle says you killed me. The chronicle does not say I stayed dead.",
    "{detail}. The kill was the chronicle's first chapter on us. The Politician's lesson: 'the second chapter is longer.'",
    "{detail}. You ended me. The Matrix archive did not end me. I came back through the gate the Necromancer opened.",
    "{detail}. I am here again. The Politician's lesson: 'the chronicle returns me when the chronicle has need.'",
    "{detail}. The kill was clean. The return is cleaner. The chronicle has been generous to me.",
  ],
  fled_player: [
    "I fled at {detail}. I will not flee at the next encounter. The Politician's primer: 'flight is a tax. Pay it once.'",
    "{detail}. You drove me off. The chronicle records the flight. The chronicle does not record where I went.",
    "{detail}. The flight was the right move at the wrong moment. The Politician taught me to recognize the right moment when it comes.",
    "{detail}. We will not meet there again. The chronicle will arrange a different room.",
    "{detail}. Fleeing is data. I have my data. You have yours.",
    "{detail}. The Politician's primer: 'a flight repaid is a flight no longer.' I am calculating the repayment.",
  ],
  mocked_by_player: [
    "You mocked me at {detail}. The mock is in the ledger. The Politician's lesson: 'mocks compound.'",
    "{detail}. You laughed. The chronicle records the laughter. The Politician's primer says laughter is data.",
    "{detail}. The mock is mine to carry. I will carry it. The Politician taught me to carry mocks until they are useful.",
    "{detail}. The Politician's lesson: 'the mocked party returns with the same laugh, only sharper.' I am sharpening.",
    "{detail}. You should not have laughed. The chronicle does not always reward laughter. The Politician's apprentice is the chronicle's correction.",
    "{detail}. The mock is the receipt. The receipt is in my pocket. The Politician would have approved.",
  ],
};

/* ═══════════════════════════════════════════════════════
   QUOTE GENERATION
   ═══════════════════════════════════════════════════════ */

/**
 * Generates the verbatim quote-opening line for a given
 * encounter. The quote-tier index = the Nemesis's current
 * grudge tier (0-5), clamped to template-array length.
 */
export function generateQuoteOpening(
  encounterKind: NemesisEncounterKind,
  grudgeTier: GrudgeTier,
  detail: string,
): string {
  const templates = QUOTE_TEMPLATES[encounterKind];
  if (!templates) {
    throw new Error(`No quote-template bank for encounter: ${encounterKind}`);
  }
  const idx = Math.min(grudgeTier, templates.length - 1);
  return templates[idx].replace("{detail}", detail);
}

/* ═══════════════════════════════════════════════════════
   MEMORY-ENTRY CONSTRUCTION
   ═══════════════════════════════════════════════════════ */

export interface RecordEncounterInput {
  nemesis: NemesisDef;
  encounterKind: NemesisEncounterKind;
  source: NemesisSurface | "world";
  detail: string;
  recordedAtIso: string;
  /** Sequence number — the count of prior entries for this Nemesis + 1. */
  sequence: number;
  playerContext?: NemesisMemoryEntry["playerContext"];
}

/**
 * Builds a new memory entry from an encounter. The
 * `quoteOpening` is generated using the Nemesis's current
 * grudge tier (BEFORE any post-encounter transition).
 */
export function recordEncounter(input: RecordEncounterInput): NemesisMemoryEntry {
  return {
    id: `mem_${input.nemesis.id}_${input.sequence}`,
    nemesisId: input.nemesis.id,
    encounterKind: input.encounterKind,
    source: input.source,
    quoteOpening: generateQuoteOpening(
      input.encounterKind,
      input.nemesis.grudgeTier,
      input.detail,
    ),
    recordedAtIso: input.recordedAtIso,
    playerContext: input.playerContext,
  };
}

/* ═══════════════════════════════════════════════════════
   QUERY HELPERS
   ═══════════════════════════════════════════════════════ */

/** Returns the most recent memory entry for a Nemesis, if any. */
export function mostRecentEncounter(
  ledger: ReadonlyArray<NemesisMemoryEntry>,
): NemesisMemoryEntry | null {
  if (ledger.length === 0) return null;
  let latest = ledger[0];
  for (const entry of ledger) {
    if (entry.recordedAtIso > latest.recordedAtIso) latest = entry;
  }
  return latest;
}

/** Returns count of encounters of a given kind. */
export function countEncountersOfKind(
  ledger: ReadonlyArray<NemesisMemoryEntry>,
  kind: NemesisEncounterKind,
): number {
  return ledger.filter((e) => e.encounterKind === kind).length;
}

/** Returns count of kills the player has scored on this Nemesis. */
export function countPlayerKills(
  ledger: ReadonlyArray<NemesisMemoryEntry>,
): number {
  return countEncountersOfKind(ledger, "killed_by_player");
}
