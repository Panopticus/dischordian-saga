/* ═══════════════════════════════════════════════════════
   ROMANCE LADDER REGISTRY

   Five player-facing romance candidates as identified in the
   choice-impact audit:

     - locke (Adjudicator Locke)        existing 1,137-line bank
     - vex (Vex Solène)                 existing 1,127-line bank
     - elara                             existing 1,071-line VO
     - dmc_companion (Awakening Protocol) existing 3,026-line bank
     - jericho_jones                    bank built fresh in Sprint 2

   Each ladder declares per-stage gate conditions, intimacy
   beat metadata, and the public-flag string written at
   commitment. The factionStandingService-style sticky-flag
   pattern is reused: `romance:committed:<npcId>` lands in
   npc_public_flags so other NPC banks read it via
   reactsToPublicFlag.

   The 5-stage shape is the Bioware-grade ladder (Acquaintance
   → Mutual Interest → Commitment → Intimacy → Devotion).
   Stage 3 is the commitment beat; advancing any other ladder
   past stage 2 while a different romance is exclusive
   requires the existing romance to first end.
   ═══════════════════════════════════════════════════════ */

export type RomanceNpcId =
  | "locke"
  | "vex"
  | "elara"
  | "dmc_companion"
  | "jericho_jones";

export const ROMANCE_NPC_IDS: readonly RomanceNpcId[] = [
  "locke",
  "vex",
  "elara",
  "dmc_companion",
  "jericho_jones",
];

export interface RomanceStage {
  stage: 1 | 2 | 3 | 4 | 5;
  /** Display label for UI. */
  label: string;
  /** Trust threshold required to advance into this stage. */
  trustGate: number;
  /** Optional narrative flag the player must have set before
   *  this stage unlocks. Used to gate Vex's stage 3 behind the
   *  Engineer reveal, etc. */
  requiresFlag?: string;
  /** Per-stage scene id authored in companionComments.ts. The
   *  trigger surface fires `romance:<npcId>:stage<n>:reached`
   *  when the player crosses into the stage. */
  sceneTrigger: string;
  /** Short writer-facing summary of the stage's narrative beat. */
  beatSummary: string;
}

export interface RomanceLadderDef {
  npcId: RomanceNpcId;
  /** UI display name. */
  npcName: string;
  /** The five-stage ladder. */
  stages: readonly RomanceStage[];
  /** Public flag set when the player commits at stage 3. */
  committedFlag: string;
  /** Public flag set when the romance ends (breakup or loss). */
  endedFlag: string;
  /** Existing canon NPC bank to which the new romance content
   *  attaches. Used by tests to verify the bank exists. */
  bankPath: string;
}

const baseLadder = (
  npcId: RomanceNpcId,
  npcName: string,
  bankPath: string,
  stageBeats: ReadonlyArray<{ label: string; beatSummary: string; requiresFlag?: string }>,
): RomanceLadderDef => ({
  npcId,
  npcName,
  bankPath,
  committedFlag: `romance:committed:${npcId}`,
  endedFlag: `romance:ended:${npcId}`,
  stages: stageBeats.map((beat, i) => ({
    stage: (i + 1) as 1 | 2 | 3 | 4 | 5,
    label: beat.label,
    trustGate: [10, 30, 50, 70, 90][i] ?? 90,
    requiresFlag: beat.requiresFlag,
    sceneTrigger: `romance:${npcId}:stage${i + 1}:reached`,
    beatSummary: beat.beatSummary,
  })),
});

export const ROMANCE_LADDERS: Readonly<Record<RomanceNpcId, RomanceLadderDef>> = {
  locke: baseLadder(
    "locke",
    "Adjudicator Locke",
    "apps/shared/npcs/banks/adjudicator_locke.ts",
    [
      { label: "Prospect", beatSummary: "Locke acknowledges your competence; the contract framing softens." },
      { label: "Client", beatSummary: "She tells you about the eye and the deal. Discloses by choice, not pressure." },
      { label: "Partner", beatSummary: "The New Babylon exit contract: she chooses whether to leave the Authority for you.", requiresFlag: "locke_offers_exit_contract" },
      { label: "Insider", beatSummary: "A quiet New Babylon scene; the legal record is, for once, off." },
      { label: "Adjudicated", beatSummary: "She begins citing your choices in her judgments." },
    ],
  ),
  vex: baseLadder(
    "vex",
    "Vex Solène",
    "apps/shared/npcs/banks/vex_solene.ts",
    [
      { label: "Stranger", beatSummary: "She notices you in the audience. She does not bow." },
      { label: "Watcher", beatSummary: "She plays a piece written for one listener. You are the listener.", requiresFlag: "vex_first_private_concert" },
      { label: "Confidant", beatSummary: "Engineer reveal — she trusts you with her past. Stage 3 of the four-stage Engineer arc lands here.", requiresFlag: "engineer_zero_hint" },
      { label: "Inner Circle", beatSummary: "Composition/Coda intimate scene — music as act of love." },
      { label: "Devotion", beatSummary: "Her final Coda is for you. Plays in Act 7." },
    ],
  ),
  elara: baseLadder(
    "elara",
    "Elara",
    "apps/shared/elaraVoManifest.json",
    [
      { label: "Co-narrator", beatSummary: "The narrator-bond becomes mutual rather than functional." },
      { label: "Mutual Interest", beatSummary: "A memory fragment — she is unsure if the feeling is hers or Senator Voss's." },
      { label: "Commitment", beatSummary: "She chooses you over recovering more of her political past — or doesn't." },
      { label: "Intimacy", beatSummary: "A non-substrate moment. Brief. Honest. Surprising." },
      { label: "Devotion", beatSummary: "She narrates Act 7 with audible warmth/grief depending on stage." },
    ],
  ),
  dmc_companion: baseLadder(
    "dmc_companion",
    "DMC Companion",
    "apps/shared/npcs/banks/dmc_clone_companion.ts",
    [
      { label: "Wary", beatSummary: "First eye contact past the Awakening Protocol's guard." },
      { label: "Witnessed", beatSummary: "They volunteer a memory that wasn't asked for." },
      { label: "Present", beatSummary: "They ask whether their Naming should be a kin-name or a partner-name. Stage 3 commits the romance branch.", requiresFlag: "dmc_companion_naming_offered" },
      { label: "Inheriting", beatSummary: "The soul-fragment becomes a person to you, not just with you." },
      { label: "Named", beatSummary: "You name them with a partner-name. The Awakening Protocol concludes as romance." },
    ],
  ),
  jericho_jones: baseLadder(
    "jericho_jones",
    "Jericho Jones",
    "apps/shared/npcs/banks/jericho_jones.ts",
    [
      { label: "Acquaintance", beatSummary: "First combat banter. He notes your handle without using it yet." },
      { label: "Mutual Interest", beatSummary: "The Akai Shi mercy-kill confession at Thaloria.", requiresFlag: "jericho_thaloria_confessed" },
      { label: "Commitment", beatSummary: "Stay or board the Heart of Time with him. Mutually exclusive with the other four ladders.", requiresFlag: "jericho_heart_of_time_offer" },
      { label: "Intimacy", beatSummary: "A pre-mission scene. Combat banter shifts to intimate." },
      { label: "Devotion", beatSummary: "He starts every mission with a phrase you taught him. Reads as a vow." },
    ],
  ),
};

/** Compute the next stage available given current stage and trust;
 *  returns null if no advancement is available right now. */
export function nextAvailableStage(
  ladder: RomanceLadderDef,
  currentStage: number,
  trust: number,
  flags: ReadonlySet<string>,
): RomanceStage | null {
  for (const stage of ladder.stages) {
    if (stage.stage <= currentStage) continue;
    if (trust < stage.trustGate) return null;
    if (stage.requiresFlag && !flags.has(stage.requiresFlag)) return null;
    return stage;
  }
  return null;
}

/** Resolve the public flag namespace prefix for a romance commitment. */
export function committedFlagFor(npcId: RomanceNpcId): string {
  return ROMANCE_LADDERS[npcId].committedFlag;
}

/** True iff committing to `target` requires breaking off any
 *  other romance the player has already committed to. */
export function requiresBreakup(
  target: RomanceNpcId,
  alreadyCommittedNpcIds: readonly RomanceNpcId[],
): boolean {
  return alreadyCommittedNpcIds.some((id) => id !== target);
}
