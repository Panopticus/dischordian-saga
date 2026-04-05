/* ═══════════════════════════════════════════════════════
   APPRENTICE BETRAYAL EVENTS

   When an Apprentice's corruption crosses thresholds, narrative
   beats fire. Four stages:
     60 — WARNING: they say something off. Player can confront.
     75 — TURN: they actively sabotage you. Player can intervene.
     90 — DECLARATION: they reveal their motive. Player chooses response.
     100 — BETRAYAL: irreversible. Apprentice attacks or leaves.

   Evil-from-start apprentices fire these faster AND their
   declarations reveal their hidden motive.
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype } from "./apprentices";

export type BetrayalStage = "warning" | "turn" | "declaration" | "betrayal";

export interface BetrayalEvent {
  stage: BetrayalStage;
  /** Corruption threshold that triggers this */
  threshold: number;
  /** Flavor text presented to player */
  prompt: string;
  /** Choice options — some can slow/halt/accelerate betrayal */
  options: BetrayalChoice[];
}

export interface BetrayalChoice {
  id: string;
  label: string;
  /** Outcome applied */
  outcome: {
    corruptionDelta: number;
    bondDelta: number;
    /** If present, immediately advances to this stage */
    forceStage?: BetrayalStage | "halted";
    /** Player morality shift */
    moralityDelta: number;
    resultFlavor: string;
  };
}

/* ─── STAGE THRESHOLDS ─── */

export const BETRAYAL_THRESHOLDS: Record<BetrayalStage, number> = {
  warning: 60,
  turn: 75,
  declaration: 90,
  betrayal: 100,
};

export function getBetrayalStage(corruption: number): BetrayalStage | null {
  if (corruption >= BETRAYAL_THRESHOLDS.betrayal) return "betrayal";
  if (corruption >= BETRAYAL_THRESHOLDS.declaration) return "declaration";
  if (corruption >= BETRAYAL_THRESHOLDS.turn) return "turn";
  if (corruption >= BETRAYAL_THRESHOLDS.warning) return "warning";
  return null;
}

/* ─── GENERIC BETRAYAL EVENTS (archetype-flavored) ─── */

function makeWarningEvent(app: Apprentice): BetrayalEvent {
  return {
    stage: "warning", threshold: 60,
    prompt: `${app.name} says something strange at dinner. Their tone is wrong — just for a moment. They catch you noticing.`,
    options: [
      { id: "confront", label: "Confront them directly", outcome: {
        corruptionDelta: -8, bondDelta: -5, moralityDelta: 2,
        resultFlavor: `${app.name} flinches, then steadies. "Sorry. Long day. Won't happen again." It will.`,
      } },
      { id: "dismiss", label: "Ignore it. Everyone has bad days.", outcome: {
        corruptionDelta: 3, bondDelta: 2, moralityDelta: 0,
        resultFlavor: `You let it pass. ${app.name} relaxes. The strangeness settles deeper.`,
      } },
      { id: "probe", label: "Probe gently. What's really going on?", outcome: {
        corruptionDelta: -3, bondDelta: 3, moralityDelta: 3,
        resultFlavor: `${app.name} almost tells you something real. Then catches themselves. The bond grows. The corruption grows too.`,
      } },
    ],
  };
}

function makeTurnEvent(app: Apprentice): BetrayalEvent {
  return {
    stage: "turn", threshold: 75,
    prompt: `You catch ${app.name} doing something they shouldn't. It's not catastrophic — yet. But it's them sabotaging you, quietly. They haven't noticed you saw.`,
    options: [
      { id: "expose", label: "Expose them to the crew", outcome: {
        corruptionDelta: -10, bondDelta: -30, moralityDelta: -3,
        forceStage: "halted",
        resultFlavor: `The crew turns on ${app.name}. They're locked out of sensitive systems. The betrayal path is halted. So is the friendship.`,
      } },
      { id: "private_talk", label: "Confront them privately", outcome: {
        corruptionDelta: -5, bondDelta: -10, moralityDelta: 2,
        resultFlavor: `${app.name} apologizes. Means it. Or performs it. You can't tell anymore.`,
      } },
      { id: "let_it_go", label: "Let it go. They're going through something.", outcome: {
        corruptionDelta: 10, bondDelta: 5, moralityDelta: -5,
        resultFlavor: `You say nothing. ${app.name} understood the silence as permission. The sabotage continues, bolder.`,
      } },
      { id: "test_them", label: "Set a trap — give them another chance to betray", outcome: {
        corruptionDelta: 15, bondDelta: -5, moralityDelta: -3,
        resultFlavor: `You bait the trap. ${app.name} walks into it, takes what they shouldn't. Now you know.`,
      } },
    ],
  };
}

function makeDeclarationEvent(app: Apprentice): BetrayalEvent {
  const motive = app.hiddenMotive ?? "They've been different for weeks. Today they're finally honest.";
  return {
    stage: "declaration", threshold: 90,
    prompt: `${app.name} stands in front of you. They tell you the truth. "${motive}"`,
    options: [
      { id: "fight", label: "Tell them to get off your ship. Now.", outcome: {
        corruptionDelta: 0, bondDelta: -100, moralityDelta: 0,
        forceStage: "halted",
        resultFlavor: `${app.name} leaves. Disappears. You'll see them again, probably. Not as an ally.`,
      } },
      { id: "embrace", label: "I forgive you. Stay. We fix this together.", outcome: {
        corruptionDelta: -15, bondDelta: 20, moralityDelta: 5,
        resultFlavor: `${app.name} collapses. Maybe in relief. Maybe in calculation. The bond survives — barely.`,
      } },
      { id: "turn_them", label: "Use what they just told you. Against them.", outcome: {
        corruptionDelta: 20, bondDelta: -20, moralityDelta: -8,
        resultFlavor: `You weaponize the confession. ${app.name} realizes this mid-sentence. Their eyes change.`,
      } },
      { id: "walk_away", label: "Say nothing. Walk away.", outcome: {
        corruptionDelta: 5, bondDelta: -15, moralityDelta: -2,
        resultFlavor: `You leave the room. ${app.name} is still standing there when you return. Or they're not.`,
      } },
    ],
  };
}

function makeBetrayalEvent(app: Apprentice): BetrayalEvent {
  const isEvil = app.evilFromStart;
  return {
    stage: "betrayal", threshold: 100,
    prompt: isEvil
      ? `${app.name} doesn't speak. They draw a weapon. The crew is frozen. This was the plan from Day 1.`
      : `${app.name} whispers, "I wish it hadn't gone this way." Then strikes.`,
    options: [
      { id: "kill", label: "End them.", outcome: {
        corruptionDelta: 5, bondDelta: -100, moralityDelta: -5,
        resultFlavor: `${app.name} is dead. You recruit again. This time you'll know better. Probably.`,
      } },
      { id: "disarm", label: "Disarm and spare.", outcome: {
        corruptionDelta: -5, bondDelta: -80, moralityDelta: 8,
        resultFlavor: `${app.name} spared. Exiled. Still alive out there. You think about that sometimes.`,
      } },
      { id: "defect", label: "Join them. (if your morality allows)", outcome: {
        corruptionDelta: 25, bondDelta: 40, moralityDelta: -30,
        resultFlavor: `You walk off your own ship beside them. The Dreamer's unique ending opens. The Architect marks you.`,
      } },
    ],
  };
}

export function generateBetrayalEvent(app: Apprentice, stage: BetrayalStage): BetrayalEvent {
  switch (stage) {
    case "warning": return makeWarningEvent(app);
    case "turn": return makeTurnEvent(app);
    case "declaration": return makeDeclarationEvent(app);
    case "betrayal": return makeBetrayalEvent(app);
  }
}

/* ─── ARCHETYPE-SPECIFIC FLAVOR (hooks for future expansion) ─── */

export const ARCHETYPE_BETRAYAL_FLAVOR: Partial<Record<ApprenticeArchetype, string>> = {
  zealot: "The Zealot betrays because they found a truer cause. They'll tell you about it while attacking.",
  heretic: "The Heretic betrays because they found an orthodoxy worth questioning — and you weren't it.",
  prodigal: "The Prodigal leaves again. They always leave. This time they don't pretend they're coming back.",
  martyr: "The Martyr doesn't betray. They sacrifice themselves to stop you. Same outcome.",
  revenant: "The Revenant was always owed a debt. Today is collection day.",
  ghost: "The Ghost never betrays out loud. You wake up and their bunk is cold and something important is gone.",
};
