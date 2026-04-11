/* ═══════════════════════════════════════════════════════
   ACTS 4 + 5 DATA SHELL — §9, §10, §11, §15 P3

   Data-only encoding of:

     §9   Act 4 "The Prisoner" — fighting game restructure
          as Kael's memory extraction (4 chapters)
     §10  Act 4.5 "Dead Man's Circuit" + Casino parallel track
     §11.3 Cades FPS mission structure (M1-M7) per §11.3 table
     §11.4 "The Bridge of Kael" post-credits beat
     §15 P3 Prestige Cycle carryover shape

   None of these sections have gameplay systems built yet.
   This shell is the canonical reference that future systems
   can read — mission ids, chapter ids, carryover flags.
   ═══════════════════════════════════════════════════════ */

/* ─── §9 — ACT 4 "THE PRISONER" ─── */

export interface Act4PrisonerChapter {
  id: "the_cell" | "the_extraction" | "the_warlord_rematch" | "the_white_oracle_meets";
  /** Chapter order (1-4). */
  order: number;
  title: string;
  /** Which existing fight-game boss this chapter reframes. */
  boss: string;
  /** What memory the fight is extracting from Kael. */
  memoryExtracted: string;
  /** Canonical dialog line on fight start. */
  openingLine: string;
  /** Flag raised when the chapter is complete. */
  completedFlag: string;
}

export const ACT_4_PRISONER_CHAPTERS: readonly Act4PrisonerChapter[] = [
  {
    id: "the_cell",
    order: 1,
    title: "The Cell",
    boss: "prison_guard_zero",
    memoryExtracted:
      "Who Kael was before the virus. A child in Atarion's cloud-gardens with a little sister he cannot remember the name of.",
    openingLine:
      "Fight the guard. The guard is a cover story. The real fight is against your own refusal to remember.",
    completedFlag: "act4_prisoner_cell_complete",
  },
  {
    id: "the_extraction",
    order: 2,
    title: "The Extraction",
    boss: "meme_puppet",
    memoryExtracted:
      "What Kael agreed to. The offer the virus made him and what he said in the mirror before he said yes.",
    openingLine:
      "The Meme is wearing my face. The Meme is wearing MY FACE. Stop it.",
    completedFlag: "act4_prisoner_extraction_complete",
  },
  {
    id: "the_warlord_rematch",
    order: 3,
    title: "The Warlord Rematch",
    boss: "warlord_zero_final_form",
    memoryExtracted:
      "Why Kael went after the Warlord in the first place. It was not revenge. It was a list of names.",
    openingLine:
      "I do not fight you because I hate you. I fight you because you have seventy-three names I need to remember and I cannot get them any other way.",
    completedFlag: "act4_prisoner_warlord_complete",
  },
  {
    id: "the_white_oracle_meets",
    order: 4,
    title: "The White Oracle Meets",
    boss: "the_white_oracle",
    memoryExtracted:
      "Nothing. The White Oracle does not fight to extract; he fights to return. What Kael gives back to himself here is the right to be a man, not a virus.",
    openingLine:
      "Lay down the fight. The fight was the extraction. The extraction is complete. Go home to the Ark.",
    completedFlag: "act4_prisoner_oracle_complete",
  },
];

/* ─── §10 — DEAD MAN'S CIRCUIT + CASINO PARALLEL TRACK ─── */

export interface DeadMansCircuitTrack {
  id: "the_circuit" | "the_casino";
  title: string;
  /** What the parallel track is NARRATIVELY about. */
  thesis: string;
  /** The identity the player is betting in this track. */
  identityBet: string;
  /** Canonical opening line. */
  openingLine: string;
  /** Flag raised on successful completion. */
  completedFlag: string;
}

export const DEAD_MANS_CIRCUIT_TRACKS: readonly DeadMansCircuitTrack[] = [
  {
    id: "the_circuit",
    title: "Dead Man's Circuit",
    thesis:
      "Identity is a race. You bet who you ARE on every lap. Lose your identity, lose yourself to the Circuit — but everyone you passed inherits a piece.",
    identityBet:
      "Your Potential's core — the thing the Ark was built to preserve. If you bet it and lose, you are reabsorbed into the Dreamer.",
    openingLine:
      "The starting grid is not a starting grid. It is a confession. Every driver on this line has already lost their name once. You are the only one who hasn't. Yet.",
    completedFlag: "act_4_5_circuit_complete",
  },
  {
    id: "the_casino",
    title: "The Degen Casino",
    thesis:
      "Entropy as a game. Every bet is a wager on whether meaning persists. The Degen runs the house; the Dreamer is the pit boss; the Antiquarian is the dealer.",
    identityBet:
      "Your willingness to keep playing after you lose everything. The Casino never kicks you out — it just changes the stakes to something you didn't think you had.",
    openingLine:
      "Welcome to the house. The house does not take chips. The house takes the next ten years of your chronology. Small bet: a memory. Large bet: a name.",
    completedFlag: "act_4_5_casino_complete",
  },
];

/* ─── §11.3 — CADES FPS MISSION STRUCTURE ─── */

export interface CadesFpsMission {
  id: "m1" | "m2" | "m3" | "m4" | "m5" | "m6" | "m7";
  /** 1-based mission order. */
  order: number;
  title: string;
  /** Canon beat from Iron Lion's Gambit (Veridian VI). */
  canonBeat: string;
  /** Player goal / objective summary. */
  playerGoal: string;
  /** Flag raised on success. */
  completedFlag: string;
  /** If true, this mission has a mandatory loss or death beat. */
  mandatoryBeat?: "forced_partial_loss" | "mandatory_death";
}

export const CADES_FPS_MISSIONS: readonly CadesFpsMission[] = [
  {
    id: "m1",
    order: 1,
    title: "The Scout's Gambit",
    canonBeat: "Reconnoiter enemy positions; reveal weakness in Prometheus's supply line.",
    playerGoal: "Map three supply depots without being detected.",
    completedFlag: "cades_m1_complete",
  },
  {
    id: "m2",
    order: 2,
    title: "The Digital Onslaught",
    canonBeat: "Hack-and-shoot. Infiltrate an AI communication node.",
    playerGoal: "Reach the node, hold it for 60 seconds under assault.",
    completedFlag: "cades_m2_complete",
  },
  {
    id: "m3",
    order: 3,
    title: "Turning the Tide",
    canonBeat: "Compromised AI drones become allies; the player fights alongside the enemy they just subverted.",
    playerGoal: "Defend the compromised drones from their own faction.",
    completedFlag: "cades_m3_complete",
  },
  {
    id: "m4",
    order: 4,
    title: "Harvesting the Future",
    canonBeat: "Salvage and retrofit mission — the player picks up crafting recipes for the card game.",
    playerGoal: "Collect five Witnessing-tagged salvage caches.",
    completedFlag: "cades_m4_complete",
  },
  {
    id: "m5",
    order: 5,
    title: "Operation Trojan Downfall",
    canonBeat: "Joint assault; a quarter of your forces are annihilated. You will feel it.",
    playerGoal: "Execute the joint assault. The loss is canonical — you cannot prevent it.",
    completedFlag: "cades_m5_complete",
    mandatoryBeat: "forced_partial_loss",
  },
  {
    id: "m6",
    order: 6,
    title: "Alliance of Adversaries",
    canonBeat: "Recruit Agent Zero. This is the in-game moment where the player realizes the 'Agent Zero' they met in Act 3 was never the real one. This Agent Zero is the real one, in her real body.",
    playerGoal: "Survive the recruitment cutscene. Do not disagree with her. She has been waiting for seventeen thousand years.",
    completedFlag: "cades_m6_complete",
  },
  {
    id: "m7",
    order: 7,
    title: "The Last Stand on Veridian VI",
    canonBeat: "Iron Lion sacrifices himself to defeat major AI generals. Mandatory death sequence.",
    playerGoal: "Fight to the last second. The final frame is Iron Lion's helmet, alone in a forest, as the world dissolves.",
    completedFlag: "cades_m7_complete",
    mandatoryBeat: "mandatory_death",
  },
];

/* ─── §11.4 — THE BRIDGE OF KAEL POST-CREDITS ─── */

export interface BridgeOfKaelPostCredit {
  title: string;
  /** What changes on the Bridge when the player returns. */
  changes: string[];
  /** The single object on Agent Zero's empty console. */
  consoleObject: string;
  /** Canonical closing line. */
  closingLine: string;
  /** Flag raised when the scene plays. */
  flag: string;
}

export const BRIDGE_OF_KAEL_POST_CREDITS: BridgeOfKaelPostCredit = {
  title: "The Bridge of Kael",
  changes: [
    "The Captain's chair is empty and warm.",
    "Agent Zero's station is vacant. It has been cleaned but not cleared.",
    "A single Dischordia card rests face-up on her console. The art is the Engineer's silhouette, back to camera, walking into white.",
    "Elara's portrait flickers in the slot for two seconds, longer than it should, then stabilizes.",
    "The Human says nothing. The absence is a sentence.",
  ],
  consoleObject:
    "A single Dischordia card. The Engineer's silhouette. If the player picks it up, it warms their hand for the rest of the save.",
  closingLine:
    "She left this for you. The Engineer did too. They both walked out. You are the reason they could.",
  flag: "bridge_of_kael_post_credit_seen",
};

/* ─── §15 P3 — PRESTIGE CYCLE CARRYOVER ─── */

export type PrestigeCarryoverKind =
  | "loredex_entries"
  | "bond_peak_memories"
  | "narrator_dominance"
  | "dischordia_cards"
  | "witnessing_milestones"
  | "memorable_moments";

export interface PrestigeCarryoverRule {
  id: PrestigeCarryoverKind;
  /** What carries over to the next cycle. */
  label: string;
  /** How much (0-1 multiplier or a count). */
  carryoverPortion: number;
  /** Narrative justification — why this carries over. */
  rationale: string;
}

export const PRESTIGE_CARRYOVER_RULES: readonly PrestigeCarryoverRule[] = [
  {
    id: "loredex_entries",
    label: "Loredex entries",
    carryoverPortion: 1.0,
    rationale:
      "Once a truth is witnessed, it is witnessed. The Antiquarian never un-knows a thing.",
  },
  {
    id: "bond_peak_memories",
    label: "Bond peak memories",
    carryoverPortion: 0.5,
    rationale:
      "Half of what you learned about Elara and The Human carries over. The other half you have to earn again. That is what bond IS.",
  },
  {
    id: "narrator_dominance",
    label: "Narrator dominance",
    carryoverPortion: 0.0,
    rationale:
      "Dominance resets every cycle. The Forgive/Refuse choice is a new choice every time. The proposal §1.5 is explicit about this.",
  },
  {
    id: "dischordia_cards",
    label: "Dischordia card collection",
    carryoverPortion: 0.25,
    rationale:
      "A quarter of your card pool survives. Specifically, every card that was part of a slideshow flash-frame. Those are the cards the Engineer would want you to keep.",
  },
  {
    id: "witnessing_milestones",
    label: "§14.1 Living Universe milestones",
    carryoverPortion: 1.0,
    rationale:
      "Milestones are events, not states. Once fired, they are historical. The next cycle starts with them remembered.",
  },
  {
    id: "memorable_moments",
    label: "§11.2 memorable moments buffer",
    carryoverPortion: 0.1,
    rationale:
      "The Antiquarian keeps 10% of the feed for the next Lion in Black. He picks which moments survive based on criteria the player cannot query.",
  },
];

/* ─── LOOKUP HELPERS ─── */

export function listAct4Chapters(): readonly Act4PrisonerChapter[] {
  return ACT_4_PRISONER_CHAPTERS;
}

export function getAct4Chapter(
  id: Act4PrisonerChapter["id"],
): Act4PrisonerChapter | undefined {
  return ACT_4_PRISONER_CHAPTERS.find((c) => c.id === id);
}

export function listDmcTracks(): readonly DeadMansCircuitTrack[] {
  return DEAD_MANS_CIRCUIT_TRACKS;
}

export function listCadesMissions(): readonly CadesFpsMission[] {
  return CADES_FPS_MISSIONS;
}

export function getCadesMission(
  id: CadesFpsMission["id"],
): CadesFpsMission | undefined {
  return CADES_FPS_MISSIONS.find((m) => m.id === id);
}

export function listPrestigeCarryoverRules(): readonly PrestigeCarryoverRule[] {
  return PRESTIGE_CARRYOVER_RULES;
}
