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
  // Base event per stage
  const base: BetrayalEvent = (() => {
    switch (stage) {
      case "warning": return makeWarningEvent(app);
      case "turn": return makeTurnEvent(app);
      case "declaration": return makeDeclarationEvent(app);
      case "betrayal": return makeBetrayalEvent(app);
    }
  })();
  // Overlay archetype-specific flavor (template with {name} interpolated)
  const flavor = ARCHETYPE_EVENT_FLAVOR[app.archetype]?.[stage];
  if (flavor?.prompt) {
    let prompt = flavor.prompt.replaceAll("{name}", app.name);
    // Preserve hidden motive at declaration stage — it's the key reveal
    if (stage === "declaration" && app.hiddenMotive) {
      prompt = `${prompt}\n\n"${app.hiddenMotive}"`;
    }
    // Preserve evil-from-start distinction at betrayal stage
    if (stage === "betrayal" && app.evilFromStart) {
      prompt = `${prompt} This was the plan from Day 1.`;
    }
    return { ...base, prompt };
  }
  return base;
}

/* ─── ARCHETYPE-SPECIFIC FLAVOR OVERLAYS ─── */
/* Each archetype reframes the 4 betrayal stages with their own voice.
   If an archetype has no entry for a given stage, the generic event fires. */

interface ArchetypeFlavor {
  warning?: { prompt?: string };
  turn?: { prompt?: string };
  declaration?: { prompt?: string };
  betrayal?: { prompt?: string };
}

const ARCHETYPE_EVENT_FLAVOR: Partial<Record<ApprenticeArchetype, ArchetypeFlavor>> = {
  zealot: {
    warning: { prompt: `At prayer, {name} mouths the wrong name under their breath. They catch you listening.` },
    turn: { prompt: `You find {name} in the chapel at 3 AM. Burning the wrong book. They smile — calm, not caught.` },
    declaration: { prompt: `{name} tells you they were never praying to your cause. They were waiting for you to fail it.` },
    betrayal: { prompt: `{name} lifts a weapon with the reverence they once reserved for you.` },
  },
  ghost: {
    warning: { prompt: `You feel watched. You turn. {name} is not where they were. Something is different about the room.` },
    turn: { prompt: `Your private files have been read. {name} says nothing. Their face doesn't change. It's already too late.` },
    declaration: { prompt: `{name} appears from nowhere: "I've been listening. I'm not who you thought I was listening FOR."` },
    betrayal: { prompt: `{name} stands in a place they should not be able to reach. A weapon appears in their hand like the room grew it.` },
  },
  scholar: {
    warning: { prompt: `{name} corrects you at dinner. It's a small error. But they cite a source you've never given them access to.` },
    turn: { prompt: `You find {name} cross-referencing you against an encyclopedia you don't own. They close it too quickly.` },
    declaration: { prompt: `{name} reads aloud from a book that details everything you've done. "I've been annotating. I thought you should know."` },
    betrayal: { prompt: `{name} recites your failures as a mathematical proof. The conclusion is a weapon.` },
  },
  revenant: {
    warning: { prompt: `{name} says something you've heard before — from a person who died. Word for word.` },
    turn: { prompt: `{name} collects your fingerprints. "For the archive I owe," they say. You don't remember making them.` },
    declaration: { prompt: `{name} names a ghost you killed. "They sent me. They're waiting. Today I settle their account."` },
    betrayal: { prompt: `{name} moves with the muscle-memory of someone else. Someone you buried. They have come back through the door you thought was locked.` },
  },
  artisan: {
    warning: { prompt: `The thing {name} built for you is subtly wrong. One weld crooked. A tool they never leave crooked.` },
    turn: { prompt: `You catch {name} dismantling a gift they made you. They finish the work with care — then pocket the key piece.` },
    declaration: { prompt: `{name} places a finished object on the table. "This one's for me. I built you badly. This one I'll build right."` },
    betrayal: { prompt: `{name} attacks with a weapon they made in your own forge. Quiet satisfaction in every strike.` },
  },
  oracle: {
    warning: { prompt: `{name} has been dreaming of your death. They tell you over breakfast. They seem to find it comforting.` },
    turn: { prompt: `{name} predicts a disaster. It happens. You realize they predicted it because they caused it.` },
    declaration: { prompt: `{name} says: "I saw this moment three months ago. I arranged every step to walk you into it. I'm sorry I was right."` },
    betrayal: { prompt: `{name} attacks with prophetic certainty — every dodge you try, they anticipated weeks ago.` },
  },
  wanderer: {
    warning: { prompt: `{name} has been packing a go-bag every night. They tell you it's a habit. It's not.` },
    turn: { prompt: `You wake up. {name} is gone. They come back by noon. Something of yours is missing. They're warm again.` },
    declaration: { prompt: `{name} announces at dinner: "I'm going tomorrow. I want you to know who's paying me to go. It's you, in a way."` },
    betrayal: { prompt: `{name} leaves the ship at full speed. Alarms follow them. They took what cannot be replaced.` },
  },
  martyr: {
    warning: { prompt: `{name} starts taking more hits for you than necessary. You notice they're smiling through them.` },
    turn: { prompt: `{name} is hurt badly. They refuse treatment. "I'm saving this one for the big sacrifice," they whisper.` },
    declaration: { prompt: `{name} says softly: "Everything I've given you, I'm taking back. I want to burn as brightly going out as I did coming in."` },
    betrayal: { prompt: `{name} moves to destroy themselves and you together. They are smiling. This is their finest work.` },
  },
  heretic: {
    warning: { prompt: `{name} questions your last three orders in sequence. Their questions are slightly too good.` },
    turn: { prompt: `{name} is spreading doubt to the crew. You catch a conversation. Your name is in it, and not kindly.` },
    declaration: { prompt: `{name} stands before the whole crew: "Here's what our Oracle actually believes. Here's what it actually costs. Vote."` },
    betrayal: { prompt: `{name} has turned half your crew. They ask you to step aside. They promise to be fair. You believe them halfway.` },
  },
  jester: {
    warning: { prompt: `{name} makes a joke at your expense. The crew laughs. The joke was accurate in a way that alarms you.` },
    turn: { prompt: `{name} does a terrible impression of you. Too terrible. Too accurate. The jokes are barbed now.` },
    declaration: { prompt: `{name} holds up a mirror: "I've been mocking you to teach you. You didn't learn. So now the joke is real."` },
    betrayal: { prompt: `{name} attacks mid-punchline. The last thing you hear is the setup to a joke they never finish.` },
  },
  sentinel: {
    warning: { prompt: `{name} asks permission to rotate off your detail. "Concentration issues," they say. Their eyes say something else.` },
    turn: { prompt: `{name} missed a shift. On purpose. An intruder got close. You think they let it happen.` },
    declaration: { prompt: `{name} salutes and files a resignation: "I was guarding the wrong person. I know who I should have been guarding now."` },
    betrayal: { prompt: `{name} attacks at shift change — the hour they know you trust them most. The guard becomes the breach.` },
  },
  prodigal: {
    warning: { prompt: `{name} tells you they're going to see "someone from before." They don't elaborate. They don't come home on time.` },
    turn: { prompt: `{name} has been on unsanctioned calls. You catch a fragment: an old debt, an old name. They lie about who.` },
    declaration: { prompt: `{name} finally says it: "I came to you to hide from them. I'm done hiding. I'm going back. I might need to go through you."` },
    betrayal: { prompt: `{name} does what they always do: they leave. But this time they take your most loyal companion with them, as collateral.` },
  },
};

/* ─── ARCHETYPE NARRATIVE FLAVOR (legacy reference) ─── */

export const ARCHETYPE_BETRAYAL_FLAVOR: Partial<Record<ApprenticeArchetype, string>> = {
  zealot: "The Zealot betrays because they found a truer cause. They'll tell you about it while attacking.",
  heretic: "The Heretic betrays because they found an orthodoxy worth questioning — and you weren't it.",
  prodigal: "The Prodigal leaves again. They always leave. This time they don't pretend they're coming back.",
  martyr: "The Martyr doesn't betray. They sacrifice themselves to stop you. Same outcome.",
  revenant: "The Revenant was always owed a debt. Today is collection day.",
  ghost: "The Ghost never betrays out loud. You wake up and their bunk is cold and something important is gone.",
};
