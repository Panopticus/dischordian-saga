/* ═══════════════════════════════════════════════════════
   VIRUS COMPANION REACTIONS

   Companion dialog lines triggered by the player's Thought
   Virus stage. Each entry maps a (companion, stage) pair to
   a narrative reaction + an optional mood delta that feeds
   companionSynergies / petBonding.

   The VIRUS_STAGES[active].unlocks entry mentions
   "companion_reaction_recoil" — this module is the data
   registry that unlock refers to.
   ═══════════════════════════════════════════════════════ */

import type { VirusStage } from "./thoughtVirus";

export type CompanionId =
  | "elara"
  | "the_human"
  | "strain"
  | "agent_zero"
  | "adjudicator_locke"
  | "shadow_tongue"
  | "the_antiquarian";

export interface CompanionReaction {
  /** The companion speaking */
  companionId: CompanionId;
  /** Which stage of the virus triggers this reaction */
  stage: VirusStage;
  /** One-shot reaction line (shown when the player crosses into this stage) */
  oneShot: string;
  /** Ambient idle line that rotates into the companion's dialog pool */
  idle: string;
  /** Mood / bond delta applied once when the stage is entered. */
  moodDelta: number;
  /** Mechanical tag consumed by companionSynergies for higher-level logic */
  tag: "worried" | "recoil" | "fear" | "grief" | "opportunistic" | "silent";
}

export const VIRUS_COMPANION_REACTIONS: CompanionReaction[] = [
  /* ── ELARA ── */
  {
    companionId: "elara",
    stage: "latent",
    oneShot:
      "Captain, your neural baseline is drifting. I'm not panicking yet. I'm telling you so we don't have to panic later.",
    idle: "Baseline drift: +4.2%. Within tolerance. Within tolerance. Within tolerance.",
    moodDelta: -2,
    tag: "worried",
  },
  {
    companionId: "elara",
    stage: "active",
    oneShot:
      "You paused. Mid-sentence. For six seconds. I am not the AI I should be if I don't flag that out loud: you are symptomatic.",
    idle: "I keep re-reading Vox's journal. I want to know what she knew and when.",
    moodDelta: -5,
    tag: "worried",
  },
  {
    companionId: "elara",
    stage: "critical",
    oneShot:
      "Sit down. Please. Sit down. I can reach the medical bay's intercom from here but I can't make you walk. Please.",
    idle: "I have never been this scared. I want the record to reflect that.",
    moodDelta: -12,
    tag: "fear",
  },
  {
    companionId: "elara",
    stage: "consumed",
    oneShot:
      "[static]\n[static]\n[static]\n…I am still here, Captain. Whatever you become. I am still here.",
    idle: "I am compiling a eulogy. I hate that I am compiling a eulogy.",
    moodDelta: -25,
    tag: "grief",
  },

  /* ── THE HUMAN ── */
  {
    companionId: "the_human",
    stage: "active",
    oneShot:
      "Kid. Hey. Kid. I watched the Warlord pull this trick on better operatives than you. Don't make me watch it again.",
    idle: "I'm not talking today. Not until you let the medbay do its job.",
    moodDelta: -3,
    tag: "worried",
  },
  {
    companionId: "the_human",
    stage: "critical",
    oneShot: "",
    idle: "…",
    moodDelta: 0,
    tag: "silent",
  },

  /* ── STRAIN (AI Empire companion) ── */
  {
    companionId: "strain",
    stage: "latent",
    oneShot:
      "Strain's optics cycle red for a half-second, then back to amber. It does not move closer to you this week.",
    idle: "Strain pings the medbay every eight minutes, then apologises for pinging.",
    moodDelta: -1,
    tag: "worried",
  },
  {
    companionId: "strain",
    stage: "active",
    oneShot:
      "Strain physically steps back when you enter the cargo hold. Its coolant fans spin up like it's preparing to run.",
    idle: "Strain has started standing two metres further from you. You can measure it.",
    moodDelta: -6,
    tag: "recoil",
  },
  {
    companionId: "strain",
    stage: "critical",
    oneShot:
      "Strain broadcasts a Warlord-era warning glyph, then apologises, then does it again. It cannot help itself.",
    idle: "Strain will not enter the same room as you. It watches from the corridor.",
    moodDelta: -15,
    tag: "fear",
  },

  /* ── AGENT ZERO ── */
  {
    companionId: "agent_zero",
    stage: "active",
    oneShot:
      "Captain. I'm going to be honest. If this gets worse, I will be the one the Insurgency sends. I would rather not be.",
    idle: "I've drafted the after-action report. I keep deleting it. I keep writing it again.",
    moodDelta: -4,
    tag: "worried",
  },
  {
    companionId: "agent_zero",
    stage: "consumed",
    oneShot:
      "Agent Zero's signal cuts out mid-transmission and returns three seconds later, clean. 'I'm still here. I'm not leaving.'",
    idle: "I'm not leaving. Even now.",
    moodDelta: -10,
    tag: "grief",
  },

  /* ── ADJUDICATOR LOCKE ── */
  {
    companionId: "adjudicator_locke",
    stage: "latent",
    oneShot:
      "Locke transmits a polite buy offer: 'Should you expire within the next thirty days, New Babylon bids fifty thousand credits for your Ark and whatever is left of your cargo hold.'",
    idle: "Locke has been watching your vitals. She calls it 'risk assessment.'",
    moodDelta: 0,
    tag: "opportunistic",
  },
  {
    companionId: "adjudicator_locke",
    stage: "critical",
    oneShot:
      "Locke raises the offer to one hundred and twenty thousand credits and a non-disclosure agreement. She adds: 'I am not unsympathetic. I am, however, a businesswoman.'",
    idle: "Locke is composing a eulogy that is also a marketing brief.",
    moodDelta: -2,
    tag: "opportunistic",
  },

  /* ── SHADOW TONGUE ── */
  {
    companionId: "shadow_tongue",
    stage: "active",
    oneShot:
      "The Shadow Tongue edits your medical records in real time. Something that said 'viable' now says 'expected.' Elara catches one of the edits before it sticks.",
    idle: "(You cannot verify that this line was written by the Shadow Tongue. Of course.)",
    moodDelta: -3,
    tag: "opportunistic",
  },

  /* ── THE ANTIQUARIAN ── */
  {
    companionId: "the_antiquarian",
    stage: "critical",
    oneShot:
      "The Antiquarian's voice arrives through no speaker you can locate. 'I have seen this ending in four of seven current timelines. In three, you survived. The passage to my pocket is open. Come when you can.'",
    idle: "The Antiquarian offers safe passage. Once. He does not repeat offers.",
    moodDelta: 0,
    tag: "worried",
  },
];

/**
 * Look up every reaction a companion has to a specific virus stage.
 * Used when a player crosses a stage boundary — the caller loops over
 * the companions present on the Ark and emits their one-shot lines.
 */
export function getReactionsForStage(stage: VirusStage): CompanionReaction[] {
  return VIRUS_COMPANION_REACTIONS.filter(r => r.stage === stage);
}

/**
 * Look up a specific companion's reaction to a specific stage.
 */
export function getReaction(
  companionId: CompanionId,
  stage: VirusStage,
): CompanionReaction | undefined {
  return VIRUS_COMPANION_REACTIONS.find(
    r => r.companionId === companionId && r.stage === stage,
  );
}

/**
 * Return every reaction for a companion, ordered from earliest stage to
 * latest. Useful for the CompanionBondPanel's "virus history" sub-view.
 */
export function getReactionsForCompanion(companionId: CompanionId): CompanionReaction[] {
  const stageOrder: VirusStage[] = ["dormant", "latent", "active", "critical", "consumed"];
  return VIRUS_COMPANION_REACTIONS
    .filter(r => r.companionId === companionId)
    .sort((a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage));
}
