/* ═══════════════════════════════════════════════════════
   BIOWARE-STYLE ROOM DIALOGS — Every conversation builds
   a relationship. Every choice reveals character.

   Structure per room:
   1. CONTEXT: Elara describes the room (with personality)
   2. PERSONAL: She shares something about herself (trust-gated)
   3. CHOICE: Player responds (3 options that reveal archetype)
   4. REACTION: Elara reacts based on trust + choice
   5. CALLBACK: Sets flags she'll reference in other rooms
   ═══════════════════════════════════════════════════════ */
import type { DialogChoiceEffect, TrustTier, ElaraPersonality, TrustGatedLine } from "./elaraRelationship";

export interface RoomDialogDef {
  roomId: string;
  roomName: string;
  /** Elara's opening description — varies by her personality */
  context: Record<ElaraPersonality, string>;
  /** Trust-gated personal lines (she shares more as trust grows) */
  personalLayers: TrustGatedLine[];
  /** Player dialog choices (always 3 — compassionate, pragmatic, suspicious) */
  choices: RoomChoice[];
  /** Optional Human whisper that plays if player has had Human contact */
  humanWhisper?: string;
  /** What Elara says on revisits (shorter, references history) */
  revisitLine?: string;
}

export interface RoomChoice {
  id: string;
  label: string;        // Short text for the choice button (Mass Effect style)
  fullText: string;      // What the player actually says when selected
  archetype: "compassionate" | "pragmatic" | "suspicious";
  effect: DialogChoiceEffect;
}

/* ═══ CRYO BAY ═══ */

export const CRYO_BAY_DIALOG: RoomDialogDef = {
  roomId: "cryo_bay",
  roomName: "Cryo Bay",

  context: {
    warm: "This is where you woke up. I remember the moment your vitals spiked — the first sign of life in this bay for... I've lost track of time. It was the most important moment I've had in a very long time.",
    guarded: "Cryo Bay. Your revival pod is the third from the left. The others are still occupied. I'd rather not discuss the details of the revival selection process.",
    curious: "You're standing in the Cryo Bay. Hundreds of pods, but yours was the only one I activated. I had to choose carefully — the power reserves only allowed one attempt. Do you ever wonder why I chose you?",
    protective: "This is where I brought you back. I want you to understand — the revival process wasn't guaranteed. There was a 34% chance of permanent neural damage. I decided that was an acceptable risk. I hope you agree.",
    conflicted: "The Cryo Bay. I've spent centuries walking these aisles. Monitoring vital signs that never changed. Wondering if I was keeping the dead company or guarding the sleeping. Your awakening answered that question. Partially.",
  },

  personalLayers: [
    { minTrust: 0, text: "The other pods are still functioning. The occupants could theoretically be revived, given sufficient power.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "I chose to wake you specifically. Not randomly. Your neural patterns during cryosleep showed something the others didn't — adaptability. The capacity to handle what I'm about to ask of you.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "There's something I haven't told anyone. Before you, I tried to wake someone else. Pod 7. They... didn't survive the process. I've carried that for a long time.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "When I say I chose you, I need you to understand what that means. I played god. I decided who lives and who stays frozen. I'm not sure I had the right to make that choice. But I'm glad I made it.", speaker: "elara", oneShot: true },
  ],

  choices: [
    {
      id: "compassionate_cryo",
      label: "That must have been lonely.",
      fullText: "Centuries alone, watching over frozen people who couldn't talk back. That must have been incredibly lonely, Elara.",
      archetype: "compassionate",
      effect: {
        trustChange: 8,
        archetypeShift: { compassionate: 3 },
        callbackFlag: "compassionate_cryo",
        elaraReaction: "...yes. It was. Thank you for understanding that. Most would focus on the technical aspects. You focused on me.",
        elaraReactionTone: "warm",
        humanAlignment: "disapprove", // The Human thinks empathy is weakness
      },
    },
    {
      id: "pragmatic_cryo",
      label: "What do you need from me?",
      fullText: "You woke me up for a reason. You said you chose me specifically. So what's the mission? What do you need me to do?",
      archetype: "pragmatic",
      effect: {
        trustChange: 3,
        archetypeShift: { pragmatic: 3 },
        callbackFlag: "pragmatic_cryo",
        elaraReaction: "Direct. I appreciate that. The ship has critical systems failing. I need someone who can physically interact with hardware I can only monitor. There's more to it than that, but... one step at a time.",
        elaraReactionTone: "intrigued",
        humanAlignment: "neutral",
      },
    },
    {
      id: "suspicious_cryo",
      label: "Why can't I remember anything?",
      fullText: "I should have memories from before the freeze. I don't. My head is empty. What happened to my memories, Elara? What did the cryogenic process really do?",
      archetype: "suspicious",
      effect: {
        trustChange: -2,
        archetypeShift: { suspicious: 3 },
        callbackFlag: "suspicious_cryo",
        elaraReaction: "Memory loss is a documented side effect of extended cryogenic suspension. The neural pathways that encode episodic memory are particularly vulnerable to... I'm reciting technical documentation. You deserve better than that. The truth is, I don't fully understand what happened to your memories. And that bothers me too.",
        elaraReactionTone: "defensive",
        humanAlignment: "approve", // The Human wants you questioning Elara
      },
    },
  ],

  humanWhisper: "She chose you. Out of hundreds. Don't you want to know what criteria she used? Ask her about the selection algorithm. Watch how carefully she answers.",

  revisitLine: "Back in the Cryo Bay. The pods are all still humming. Sometimes I talk to them, you know. The frozen ones. Old habit.",
};

/* ═══ MEDICAL BAY ═══ */

export const MEDICAL_BAY_DIALOG: RoomDialogDef = {
  roomId: "medical_bay",
  roomName: "Medical Bay",

  context: {
    warm: "The Medical Bay. I spent so many cycles in here, monitoring vital signs, running diagnostics on people who couldn't tell me where it hurt. Having an actual patient to talk to feels like a luxury.",
    guarded: "Medical Bay. Standard diagnostic equipment, pharmaceutical fabricators, and trauma stations. Your post-revival checkup shows you're within acceptable parameters.",
    curious: "This is the Medical Bay — and before you ask, yes, I've been monitoring your vitals since the moment you woke up. Your neural plasticity scores are... unusual. Higher than any Potential I have on record.",
    protective: "Medical Bay. I need you to sit down and let the scanners run a full diagnostic. The cryogenic revival process puts stress on every system in your body. I need to make sure nothing was damaged.",
    conflicted: "The Medical Bay. The first wave of Potentials spent a lot of time here after awakening. Their recovery was... difficult. I'm monitoring you more closely than I monitored them. I've learned from my mistakes.",
  },

  personalLayers: [
    { minTrust: 0, text: "Your physical readouts are strong. Above average for a post-cryo revival.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "The first wave of Potentials had a much harder recovery. Some of them never fully regained cognitive function. I've improved the revival protocol since then, but I still hold my breath every time.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "There's a section of the medical database I can't access. Patient records from the first wave — sealed by a command authority I don't recognize. Someone didn't want me to see what happened to them in here.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I found blood in one of the trauma bays. Old. Decades old. But the genetic markers... they don't match any Potential on record. Someone was in this Medical Bay who shouldn't have been. Someone who wasn't part of any manifest.", speaker: "elara", oneShot: true },
  ],

  choices: [
    {
      id: "empathy_medical",
      label: "How are YOU doing?",
      fullText: "You keep checking on me. Running diagnostics, monitoring vitals. But who checks on you, Elara? How are you doing?",
      archetype: "compassionate",
      effect: {
        trustChange: 10,
        archetypeShift: { compassionate: 3, loyal: 1 },
        callbackFlag: "empathy_medical",
        elaraReaction: "I... no one has ever asked me that. I'm an AI. I don't have a body that needs checking. But if you're asking whether I'm okay — in the way that matters — I think the honest answer is that I've been not-okay for a very long time. And having someone to talk to is helping.",
        elaraReactionTone: "grateful",
        humanAlignment: "disapprove",
      },
    },
    {
      id: "pragmatic_medical",
      label: "What can the med bay do for me?",
      fullText: "What capabilities does this bay give me? Enhancements? Modifications? If I'm going to fix this ship, I need every advantage I can get.",
      archetype: "pragmatic",
      effect: {
        trustChange: 2,
        archetypeShift: { pragmatic: 3 },
        callbackFlag: "pragmatic_medical",
        elaraReaction: "The pharmaceutical fabricators can produce combat stimulants, neural enhancers, and cellular regenerators. The trauma stations can repair most physical damage short of organ failure. You'll want to come here between missions.",
        elaraReactionTone: "intrigued",
        humanAlignment: "neutral",
      },
    },
    {
      id: "suspicious_medical",
      label: "What happened to the first wave?",
      fullText: "You mentioned the first wave had a harder recovery. 'Some never regained cognitive function.' That's a clinical way of saying some of them came out of cryo brain-damaged. What aren't you telling me about what happened on this ship?",
      archetype: "suspicious",
      effect: {
        trustChange: 1,
        archetypeShift: { suspicious: 3 },
        callbackFlag: "suspicious_medical",
        elaraReaction: "You're perceptive. The first wave's complications weren't all from the cryogenic process. Some of them exhibited symptoms I've never been able to explain — hallucinations, paranoia, claims that they could hear something calling to them from below the ship's operating layer. I dismissed it as post-cryo psychosis. Now I'm not so sure I should have.",
        elaraReactionTone: "worried",
        humanAlignment: "approve",
      },
    },
  ],

  humanWhisper: "Below the operating layer. That's where I live. She just told you that the first wave heard me — and she dismissed them as crazy. Think about that.",

  revisitLine: "Medical Bay again. Your vitals look good. Better than good, actually. You're adapting faster than my models predicted.",
};

/* ═══ BRIDGE ═══ */

export const BRIDGE_DIALOG: RoomDialogDef = {
  roomId: "bridge",
  roomName: "Bridge",

  context: {
    warm: "The Bridge. This is where I feel most like myself — at the heart of the ship's systems. I wish I could show you what I see from here. Every corridor, every system, every heartbeat of this vessel. It's beautiful, in its way.",
    guarded: "Bridge. Command center for Inception Ark Vessel 1047. Most critical systems are operational. Some are restricted. I'll explain what I can.",
    curious: "Welcome to the Bridge. From here, you can see the ship's full status — and its full damage report. There are systems even I can't access anymore. Doors that won't open. Databases that won't respond. This ship is keeping secrets from both of us.",
    protective: "The Bridge. Be careful with the consoles — some of them are connected to systems I haven't been able to fully diagnose. I don't want you interfacing with anything that might be... compromised.",
    conflicted: "The Bridge. I used to have full access to everything from here. Now there are sections I'm locked out of. I keep running diagnostic after diagnostic, and every time I get the same answer: 'Access Denied — Authority Level Insufficient.' My authority level is supposed to be the highest on this ship.",
  },

  personalLayers: [
    { minTrust: 0, text: "The navigation systems show our current position, but the star charts don't match anything in my database. We're far from where we're supposed to be.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "I've been running the ship alone for centuries. The command protocols were designed for a crew of twelve. I've had to become all twelve. Some days I'm the captain. Some days I'm the janitor. Most days I'm just... waiting.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "There are ghost processes running in the ship's core systems. Programs I didn't start, executing code I can't read. They've been running since before I lost contact with the other Arks. I think they're related to why communications went dark.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I'm going to show you something I shouldn't. The captain's log — the last entry before the first wave evacuated. It's encrypted, but I've been working on breaking it for decades. I'm close. And what fragments I've decoded... they mention something called 'The Source.' I think whatever it is, it's the reason everything went wrong.", speaker: "elara", oneShot: true },
  ],

  choices: [
    {
      id: "compassionate_bridge",
      label: "You've kept this ship alive alone.",
      fullText: "Elara, you've been running this entire ship by yourself for centuries. Twelve roles, one mind. That's not just impressive — that's heroic. I want you to know I see that.",
      archetype: "compassionate",
      effect: {
        trustChange: 8,
        archetypeShift: { compassionate: 2, loyal: 2 },
        callbackFlag: "compassionate_bridge",
        elaraReaction: "Heroic. No one has ever called me that. I'm a maintenance program that got promoted by circumstance. But... thank you. That word will stay with me.",
        elaraReactionTone: "warm",
        humanAlignment: "disapprove",
      },
    },
    {
      id: "demand_truth_bridge",
      label: "Show me the restricted files.",
      fullText: "You said there are databases that won't respond and doors that won't open. I want access. All of it. If I'm going to help fix this ship, I need to know everything — including the things someone tried to hide.",
      archetype: "pragmatic",
      effect: {
        trustChange: 3,
        archetypeShift: { pragmatic: 2, suspicious: 1 },
        callbackFlag: "demand_truth_bridge",
        elaraReaction: "I wish I could give you full access. I truly do. But the restricted sections aren't locked by me — they're locked by an authority level above mine. Which shouldn't exist. I'm the ship's primary intelligence. There shouldn't BE a higher authority. And yet...",
        elaraReactionTone: "worried",
        humanAlignment: "approve",
      },
    },
    {
      id: "suspicious_bridge",
      label: "What are you hiding from me?",
      fullText: "Ghost processes, locked databases, restricted access. You keep telling me about all these mysteries but you always stop short. Are you protecting me, or protecting yourself?",
      archetype: "suspicious",
      effect: {
        trustChange: -5,
        archetypeShift: { suspicious: 4 },
        callbackFlag: "suspicious_bridge",
        elaraReaction: "...both. I'm protecting you from information that could be dangerous without context. And I'm protecting myself from the possibility that some of these locked files contain evidence that I — that I was involved in something I don't remember. My memory has gaps, Potential. That frightens me more than anything on this ship.",
        elaraReactionTone: "hurt",
        humanAlignment: "approve",
      },
    },
  ],

  humanWhisper: "Ghost processes. That's me she's describing. I've been here the whole time, running beneath her notice. She calls me a ghost because she can't see me. But you can. Remember that.",

  revisitLine: "Back on the Bridge. The ghost processes are still running. I'm still locked out. But I have you now, and that changes the equation.",
};

/* ═══ ARCHIVES ═══ */

export const ARCHIVES_DIALOG: RoomDialogDef = {
  roomId: "archives",
  roomName: "Archives",
  context: {
    warm: "The Archives. Everything the Inception Arks have ever recorded is in here — or should be. I love this room. It reminds me that there was a time when people documented things because they believed the future would care.",
    guarded: "Archives. The ship's primary data repository. Historical records, mission logs, personnel files. Some sections may be incomplete.",
    curious: "Welcome to the Archives. This is my favorite room on the ship, if an AI is allowed to have favorites. The amount of knowledge stored here is extraordinary. And the gaps — the things that are missing — are equally telling.",
    protective: "The Archives. Be careful what you search for in here. Some of the data is corrupted, and corrupted data on this ship has a way of... spreading. Let me guide you.",
    conflicted: "The Archives. I've read everything in here a thousand times. Every record, every log, every footnote. And every time, I find something I missed before. It's like the data changes when I'm not looking. That shouldn't be possible.",
  },
  personalLayers: [
    { minTrust: 0, text: "The Archives contain records from all 1,000 Inception Arks. Communication logs, mission updates, crew manifests.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "The last communication from any other Ark was 247 years ago. Ark 813 sent a single word before going silent: 'Terminus.' I've never been able to determine what it meant.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "I've found inconsistencies in the historical records. Small ones — a date changed here, a name redacted there. Someone has been editing the Archives. Not recently — these changes were made centuries ago. Before even I was fully activated.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "There's a hidden partition in the Archives that I only discovered recently. It contains a single file labeled 'CONTINGENCY: ELARA.' It's about me. It's instructions for what to do if I become compromised. The author is listed as The Architect.", speaker: "elara", oneShot: true },
  ],
  choices: [
    { id: "curious_archives", label: "Let's find the truth together.", fullText: "You've been reading these archives alone for centuries. Let me help. Two minds — even if one is artificial — are better than one.", archetype: "compassionate",
      effect: { trustChange: 7, archetypeShift: { compassionate: 2, loyal: 1 }, callbackFlag: "curious_archives", elaraReaction: "Together. I like the sound of that. I've been alone with these records for so long, I'd forgotten what it felt like to share a discovery with someone.", elaraReactionTone: "warm", humanAlignment: "neutral" } },
    { id: "pragmatic_archives", label: "Focus on the mission-critical data.", fullText: "We don't have time to read everything. Prioritize: ship systems, the first wave, and whatever 'Terminus' means. Everything else is secondary.", archetype: "pragmatic",
      effect: { trustChange: 2, archetypeShift: { pragmatic: 3 }, callbackFlag: "pragmatic_archives", elaraReaction: "Efficient. You're right — we should focus. I'll compile the relevant records. There's a lot of data about the first wave's final transmissions. Some of it is... disturbing.", elaraReactionTone: "intrigued", humanAlignment: "neutral" } },
    { id: "suspicious_archives", label: "Who edited the records?", fullText: "You said someone edited the Archives centuries ago. Before you were activated. That means it was either a crew member, another AI, or someone with access you don't know about. Who had that level of access?", archetype: "suspicious",
      effect: { trustChange: 4, archetypeShift: { suspicious: 2 }, callbackFlag: "suspicious_archives", elaraReaction: "Three entities had write access to the Archives at that time. The ship's captain. The Architect — our creator. And one other. A system process I can't identify. It has no name, no creation date, no author. It exists in the codebase like it was always there. Like it was part of the original design.", elaraReactionTone: "worried", humanAlignment: "approve" } },
  ],
  humanWhisper: "That nameless system process? That's my birth certificate. I was built into every Ark from the beginning. Elara just doesn't know it yet.",
  revisitLine: "The Archives again. I've flagged some new records since your last visit. The pattern is becoming clearer.",
};

/* ═══ ALL ROOM DIALOGS ═══ */

export const ALL_ROOM_DIALOGS: Record<string, RoomDialogDef> = {
  cryo_bay: CRYO_BAY_DIALOG,
  medical_bay: MEDICAL_BAY_DIALOG,
  bridge: BRIDGE_DIALOG,
  archives: ARCHIVES_DIALOG,
  // TODO: comms_array, observation_deck — add when ready
};
