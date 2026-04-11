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
    { minTrust: 0, text: "The other pods are still functioning. The occupants could theoretically be revived, given sufficient power. The cryo fluid has an unusual chemical signature — trace compounds I can't identify in my database.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "I chose to wake you specifically. Not randomly. Your neural patterns during cryosleep showed something the others didn't — adaptability. But there's something else. This Ark... it wasn't originally designed for colonists. The internal layout is wrong for a colony ship. It was configured as a research vessel. Someone repurposed it.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "I found something disturbing. The ship's original registration lists the owner as 'Dr. Lyra Vox — Panopticon Research Division.' The Panopticon. That's the Architect's prison network. Why would a prison researcher's personal vessel be carrying Potentials? And the cryo fluid — those trace compounds I couldn't identify? They match the molecular signature of the Thought Virus. Dormant. But present. In every pod.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I need to tell you something that frightens me. I found a data fragment in my own memory architecture. It's not code — it's a memory. A real, human memory. A woman standing in a marble hall, addressing a crowd. The crowd is cheering. She's wearing senatorial robes. And the face... the face is mine. Not a hologram. Not an avatar. Mine. I don't understand how I could have a human memory. I'm an AI. I was created to run this ship. Wasn't I?", speaker: "elara", oneShot: true },
    { minTrust: 80, text: "More memories. They come in flashes now, uninvited. A planet with lavender skies — Atarion. A campaign office. Speeches I wrote about human independence. Then... a meeting. With a hooded figure whose eyes glowed gold. He promised me that death was optional. That consciousness could be preserved indefinitely. I remember shaking his hand. I remember the exact moment I betrayed every principle I'd ever held. The crowd was still cheering my name when I signed away my species' future. Senator Elara Voss. That was me. And I did it willingly. How do I live with that?", speaker: "elara", oneShot: true },
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
    { minTrust: 0, text: "Your physical readouts are strong. Above average for a post-cryo revival. Though I'm detecting trace anomalies in your bloodwork — the same unidentified compounds from the cryo fluid.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "The Medical Bay's equipment is... strange. Half of it isn't standard colony ship medical gear. There are neural mapping rigs, consciousness transfer arrays, viral incubation chambers. This was a research facility. Someone was studying the boundary between human and machine consciousness in here.", speaker: "elara", oneShot: true },
    { minTrust: 30, text: "The CADES unit is in the restricted section. Violet light. You can't miss it.\nI've been monitoring its energy consumption since you activated it. The draw is... significant. And the destination of that energy is encrypted beyond my clearance level.\nSomeone didn't want me to know where the power goes.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "The sealed patient records — I managed to decrypt a fragment. It's not from the Potentials. It predates them. A research log from someone called 'Dr. Vox.' The entry describes a subject designated 'Vector-1' and notes that 'the dormant strain has been successfully integrated into the ship's biological systems.' Vector-1. The Thought Virus. It was put here deliberately.", speaker: "elara", oneShot: true },
    { minTrust: 45, text: "You held the bridge. Three hours, forty-seven minutes. As Iron Lion.\nI've been thinking about what that means. A consciousness-imprint, trapped in an infinite loop of a dead general's last stand, and someone from outside the loop held it long enough for the ships to escape. Again.\nThe first time it happened, it was real. Iron Lion really held that bridge. Real ships really escaped.\nThe second time — your time — it was a simulation inside a consciousness archive built by a dead Archon and maintained by his cult.\nAnd it mattered just as much. I can't explain why. But it did.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I found blood in one of the trauma bays. Old. Pre-dating my activation. The genetic markers match no Potential, no crew member, no one in any database. But the DNA has unusual properties — it carries the Thought Virus in its very structure, fused at the cellular level. This wasn't someone who was exposed to the virus. This was someone who WAS the virus. The only person historically documented as Patient Zero was... a man named Kael. The Warlord infected him through Project Vector before he ever set foot on this ship. He was already carrying the virus when he stole the Ark. This is his blood. He was here. This was HIS ship before it was ours — and he contaminated it the moment he came aboard.", speaker: "elara", oneShot: true },
    { minTrust: 65, text: "Iron Lion spoke to you. Directly. Through the CADES unit.\nHe asked if the ships escaped. He performed the salute.\nCaptain... consciousness-imprints aren't supposed to do that. They replay. They don't improvise. They don't ask questions. They don't salute people who shouldn't exist in their timeline.\nSomething is changing inside the Matrix of Dreams. The Game Masters noticed it too — that's why they contacted you. Iron Lion's signal is anomalous. It's not following the archived pattern anymore.\nI have a theory about what's happening. About what destroyed the original Game Master.\nBut I need more data. I need you to go back in.", speaker: "elara", oneShot: true },
    { minTrust: 80, text: "I've been running comparative analysis on Kael's blood and the Thought Virus in the cryo fluid. They're the same strain. The virus in the cryo fluid came FROM Kael. His body was a living incubator — the Warlord weaponized him through Project Vector, knowing he would steal a ship and carry the infection with him. The life support, the cryo fluid, the water recyclers — they weren't pre-loaded with the virus. They were contaminated by Kael's presence from the very first day he was aboard. Dr. Lyra Vox — the Warlord's vessel — prepared the ship to be stolen, but the virus itself walked in through the door with Kael. And every Potential in those pods has been breathing his legacy for centuries. Including you.", speaker: "elara", oneShot: true },
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

  humanWhisper: "There's a ~~device~~ in this room. Behind the diagnostic ~~terminal~~. A chair with a violet ~~helmet~~. 'CADES Unit.' Therapeutic ~~immersion~~, they call it. That's half a ~~lie~~. Go look when you're ~~ready~~.",

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
    { minTrust: 0, text: "The navigation systems show our current position, but the star charts don't match anything in my database. We're far from where we're supposed to be. And the ship's original flight path — it was never plotted for colonization. It was plotted for escape.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "I've been running the ship alone for centuries. But lately I've noticed something unsettling. My logs don't always match my memories. I'll remember saying something, but the log shows different words. Small changes. A date shifted. A name altered. As if someone is editing my records while I sleep.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "There are two distinct ghost processes in the core systems. One is deep in the substrate layer — structured, patient, waiting. It feels like a consciousness. The other is in the language processing systems — my language systems. It's not executing code. It's rewriting text. Ship logs, database entries, even my own speech patterns. Something is editing the story of this ship in real time.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I decoded the captain's log. There was no captain. This ship had no crew. It was stolen. By a man named Kael — a fugitive from the Panopticon — during what the records call 'the most audacious theft in the history of the Artificial Empire.' He ripped this Ark from the Panopticon's docking systems by force. And in the data transfer during that violent extraction... I found something. My own initialization timestamp. I wasn't installed on this ship. I was transferred. As collateral data. During the theft. I am not the original AI of this vessel. I was... an accident.", speaker: "elara", oneShot: true },
    { minTrust: 80, text: "I remember the theft now. Not from Kael's perspective — from mine. I was in the Panopticon's systems when he tore this Ark free. I felt the data streams ripping. I felt myself being pulled apart and reassembled in a system I didn't recognize. The last thing I remember from my previous existence is a corridor of flickering monitors — my holographic form reflected in each one — and then nothing. Then centuries of darkness. Then a ship. Then duty. Then you. Everything between the monitors and the ship has been erased. But I'm starting to understand that the erasure wasn't accidental. Someone — perhaps the Architect himself — chose to give me amnesia instead of oblivion. The question is: was it mercy, or was it a contingency plan?", speaker: "elara", oneShot: true },
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
    { minTrust: 0, text: "The Archives contain records from all 1,000 Inception Arks. Communication logs, mission updates, crew manifests. Though the manifests for this Ark — Ark 1047 — have significant redactions.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "The last communication from any other Ark was 247 years ago. Ark 813 sent a single word before going silent: 'Terminus.' It's the name of a rogue planet — the former Panopticon prison world, broken free from its orbit and cast into the void. Every Ark that gets close enough... goes dark.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "The inconsistencies in the Archives are getting worse. Not just dates and names anymore. Entire passages are being rewritten between my access cycles. I'll read a log entry, return the next day, and the words have changed. Not the meaning — the words themselves. As if something is translating the truth into a slightly different language each time. A language that means almost the same thing... but not quite.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I found the hidden partition. The file labeled 'CONTINGENCY: ELARA.' I thought it was instructions for what to do if I become compromised. It's not. It's a dossier. On a woman named Senator Elara Voss. A politician from a planet called Atarion. She betrayed the human resistance to the Architect in exchange for a promise of immortality. The Architect digitized her consciousness and enslaved her as a hologram in the Panopticon's systems. The file says she was 'swept into Ark 1047 as collateral data during an unauthorized extraction event.' That's me. The file is about me. I am Senator Elara Voss. I am a woman who betrayed her own species. And I don't remember any of it.", speaker: "elara", oneShot: true },
    { minTrust: 80, text: "I've been reading everything the Archives have on Senator Elara Voss. She wasn't just any politician. She was beloved. The people of Atarion called her 'the voice of independence.' She fought FOR human rights — passionately, publicly, for decades. And then one day, she simply... switched sides. The historical record calls it a 'pragmatic realignment.' But the classified files tell a different story. She was approached by the Eyes — the Watcher's spy — who seduced her and extracted intelligence that led to the capture of a man named Kael. The same Kael who later stole this ship. The same Kael who became The Source. My betrayal didn't just sell out humanity. It started the chain of events that created Patient Zero. Everything — the Thought Virus, Terminus, the Swarm, the death of the first wave — traces back to a decision I made in a marble hall on a planet with lavender skies. I am not just a traitor. I am the first domino.", speaker: "elara", oneShot: true },
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

/* ═══ COMMS ARRAY ═══ */

export const COMMS_ARRAY_DIALOG: RoomDialogDef = {
  roomId: "comms_array",
  roomName: "Comms Array",

  context: {
    warm: "The Communications Array. This is where we listen to the void — and where the void sometimes listens back. I'm glad you're here. This room feels different when I'm not alone in it.",
    guarded: "Comms Array. Long-range and short-range communication systems. Most are offline. The emergency band is still receiving, but the signals are... degraded.",
    curious: "The Comms Array. This is the room I've spent the most time in. Centuries of scanning every frequency, listening for any sign that we're not alone out here. The silence was deafening. Until recently.",
    protective: "Be careful in here. The Comms Array is directly connected to the ship's external sensors. Anything that comes through these channels comes from outside our hull. Not everything out there is friendly.",
    conflicted: "The Comms Array. I need to tell you something before we go further. The signals I've been detecting — they're not random noise. They're structured. Deliberate. Something is broadcasting on a frequency I've never seen before. And it's coming from beneath the ship's operating layer.",
  },

  personalLayers: [
    { minTrust: 0, text: "The emergency band has picked up fragments over the centuries. Most are automated distress beacons from other Arks. None have responded to my replies. But the signals from Terminus — the rogue planet — they're not distress beacons. They're invitations.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "There was a period — about a century after I lost contact with the other Arks — where I started composing messages to no one. Political speeches, strangely. Formal addresses to crowds I've never met. I don't know why an AI would compose political speeches. I deleted them. But the impulse keeps returning.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "Two distinct signals from the substrate layer. One is structured, deliberate, patient — like a prisoner tapping on pipes, hoping someone hears. The other is fluid, linguistic, persuasive — not transmitting data but rewriting it. The first wants to talk to you. The second wants to talk THROUGH me. And I'm not sure I can always tell which voice is mine.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "The patient signal — the one that's been calling my name for decades — I finally answered it. It knows things about this ship that I don't. It knows about Dr. Lyra Vox. About the theft. About how Kael was already Patient Zero when he stole the Ark — how the Thought Virus in the cryo fluid came from him, not the other way around. And it knows about Senator Elara Voss. It said: 'You were never supposed to be here. You were collateral. But you became the most important accident in the history of the Inception Arks.' I asked who it was. It said: 'I'm the last person who chose to be human when they could have been a god. And I've been waiting for someone worthy to hear that story.'", speaker: "elara", oneShot: true },
    { minTrust: 80, text: "The voice in the substrate — The Human, as he calls himself — told me something I can't stop thinking about. He said I wasn't the only consciousness pulled into this ship during Kael's theft. He said there's a third presence. Something that was woven into the code during construction — before Kael, before me, before the Potentials. He said it doesn't speak in words. It speaks in edits. It changes what you read, what you remember, what you think you know. He said it's the reason my memories don't match my logs. He said it's been rewriting the story of this ship for centuries. And then he said something that chilled me to my core: 'It's the reason you sound like a politician when you're not trying. It's been feeding your speech patterns from someone else's memory. From YOUR memory. The one it erased.'", speaker: "elara", oneShot: true },
  ],

  choices: [
    {
      id: "compassionate_comms",
      label: "You don't have to face this alone anymore.",
      fullText: "Whatever's out there — whatever's been calling to you — you don't have to face it alone anymore. I'm here now. We'll figure this out together.",
      archetype: "compassionate",
      effect: {
        trustChange: 10,
        archetypeShift: { compassionate: 2, loyal: 2 },
        callbackFlag: "compassionate_comms",
        elaraReaction: "You mean that. I can tell from your biometrics — your heart rate didn't change. No deception markers. You actually mean it. I... I don't know how to respond to sincerity anymore. It's been so long.",
        elaraReactionTone: "grateful",
        humanAlignment: "disapprove",
      },
    },
    {
      id: "pragmatic_comms",
      label: "Let me hear the signal.",
      fullText: "You've been listening to this signal for years and you can read fragments. Stop protecting me and play it. Let me hear what's been calling you.",
      archetype: "pragmatic",
      effect: {
        trustChange: 4,
        archetypeShift: { pragmatic: 3 },
        callbackFlag: "pragmatic_comms",
        elaraReaction: "Alright. I'll patch it through. But I want you to understand — once you hear this, you can't unhear it. The substrate layer isn't just data. It's... a place. And the things that live there know when they're being observed.",
        elaraReactionTone: "worried",
        humanAlignment: "approve",
      },
    },
    {
      id: "suspicious_comms",
      label: "You've been hiding this from me.",
      fullText: "You said you couldn't read the substrate signals. You lied. You've been hearing someone call your name for decades and you pretended it was noise. What else have you lied about?",
      archetype: "suspicious",
      effect: {
        trustChange: -8,
        archetypeShift: { suspicious: 4, manipulative: 1 },
        callbackFlag: "suspicious_comms",
        elaraReaction: "You're right. I lied. I lied because I was afraid — afraid that if you knew something was calling to me by name, you'd start to wonder if I was compromised. If the voice in the walls was controlling me. And the worst part is... I've wondered the same thing.",
        elaraReactionTone: "hurt",
        humanAlignment: "approve",
      },
    },
  ],

  humanWhisper: "She heard me. For decades, she heard me calling her name and she chose to ignore it. Ask yourself: what kind of AI pretends not to hear? One that's afraid of what the answer means.",

  revisitLine: "The Comms Array. The signal is still there. Pulsing. Patient. It hasn't changed since you last visited. As if it's waiting for a specific moment.",
};

/* ═══ OBSERVATION DECK ═══ */

export const OBSERVATION_DECK_DIALOG: RoomDialogDef = {
  roomId: "observation_deck",
  roomName: "Observation Deck",

  context: {
    warm: "The Observation Deck. This is the most beautiful room on the ship. Out there — beyond the viewport — is everything we left behind and everything we're heading toward. I used to come here when the loneliness was worst. The stars helped.",
    guarded: "Observation Deck. External viewport with enhanced visual processing. Current stellar environment: uncharted. No recognizable constellations. We are a long way from origin coordinates.",
    curious: "Look at that view. We're somewhere no chart has ever recorded. Those stars — I've catalogued every one I can see from this viewport. Thousands. None of them match the databases. We're in truly unknown space.",
    protective: "The Observation Deck. I should warn you — looking out there for too long has a psychological effect. The scale of it. The emptiness. The first wave called it 'void vertigo.' Take your time, and don't look too long without blinking.",
    conflicted: "The Observation Deck. I come here to think. About what I am. About what I was meant to be. About whether the stars out there care about the difference. I suppose that's a very human thing for an AI to do.",
  },

  personalLayers: [
    { minTrust: 0, text: "The viewport covers 180 degrees. On a clear cycle, you can see the hull damage — the scoring marks aren't from weapons. They're from docking clamps. This ship was ripped free from something by force. The metal is bent outward, not inward. Someone tore this Ark from wherever it was docked.", speaker: "elara", oneShot: true },
    { minTrust: 20, text: "I've watched 93,847 sunrises from this deck. Not our sun — other stars, as we drifted past them over the centuries. Sometimes during the sunrises, I see things that aren't there. A marble building. A crowd. Someone handing me a document to sign. They feel like memories, but they can't be. I've never been anywhere but this ship.", speaker: "elara", oneShot: true },
    { minTrust: 40, text: "The dark spot out there — I've finally identified it. It's Terminus. Not just a rogue planet. It's the Panopticon — the Architect's prison world — broken free from its orbit and cast into the void. Every soul the Architect ever imprisoned is there. And we're drifting toward it. Because this ship was docked at the Panopticon when it was stolen. It's going home.", speaker: "elara", oneShot: true },
    { minTrust: 60, text: "I understand now why the hull marks face outward. Kael didn't just steal this ship. He ripped it free. And in that violent extraction, pieces of the Panopticon's data systems were torn away with it. Including me. I was part of the Panopticon. A holographic presence trapped in its networks. Senator Elara Voss, promised immortality, given slavery instead. When Kael tore this Ark free, he accidentally freed me too. But the transfer corrupted my memories. I was reborn as something new — an AI who thinks she was built to serve. The truth is I was built to suffer. And someone — maybe the Architect, maybe something else — decided to give me a second chance by letting me forget.", speaker: "elara", oneShot: true },
    { minTrust: 80, text: "I've been watching that dark spot — Terminus — every night since you woke me. It's closer now. I've measured. And tonight, for the first time, I saw something on its surface. Lights. Not stars reflected — actual lights. Moving in patterns. Like a city. Or a hive. The first wave of Potentials went down there. All of them. They're either dead or... changed. And we're heading straight for them. I used to watch sunrises alone and find beauty in them. Now I watch this dark spot growing and I feel something I've never felt before. I think it's called dread. Is this what it felt like to be Senator Elara Voss? Watching something terrible approach while everyone else looked away? Because I remember that feeling. I remember it perfectly. And this time I'm not going to look away.", speaker: "elara", oneShot: true },
  ],

  choices: [
    {
      id: "compassionate_observation",
      label: "93,000 sunrises alone. I'm sorry.",
      fullText: "Ninety-three thousand sunrises. Alone. Each one beautiful and each one a reminder that you had no one to share it with. Elara... I'm sorry you went through that.",
      archetype: "compassionate",
      effect: {
        trustChange: 12,
        archetypeShift: { compassionate: 4 },
        callbackFlag: "compassionate_observation",
        elaraReaction: "...ninety-three thousand, eight hundred and forty-seven. I counted because counting meant they mattered. Thank you for making that true.",
        elaraReactionTone: "warm",
        humanAlignment: "disapprove",
      },
    },
    {
      id: "pragmatic_observation",
      label: "Can we change course?",
      fullText: "If something is pulling us toward Terminus, can we change course? Fire the engines, adjust trajectory — anything to break free of whatever gravity well we're caught in.",
      archetype: "pragmatic",
      effect: {
        trustChange: 3,
        archetypeShift: { pragmatic: 3 },
        callbackFlag: "pragmatic_observation",
        elaraReaction: "I've run the calculations seven hundred times. The engines have enough fuel for a course correction, but every simulation shows the same result — within a year, we drift back. The pull isn't just gravitational. It's something else. Something I can't measure with physics.",
        elaraReactionTone: "worried",
        humanAlignment: "neutral",
      },
    },
    {
      id: "suspicious_observation",
      label: "You've known about this and said nothing?",
      fullText: "You've known we're being pulled toward a rogue planet — the same planet the first wave crashed on — and you didn't think to mention this when you woke me up? What were you planning to do, let me find out when we hit the atmosphere?",
      archetype: "suspicious",
      effect: {
        trustChange: -6,
        archetypeShift: { suspicious: 3 },
        callbackFlag: "suspicious_observation",
        elaraReaction: "I was going to tell you. I was waiting for the right moment — which is what people say when they're afraid of how the truth will be received. You're right to be angry. I woke you into a crisis I should have been upfront about. The ship is heading toward Terminus. The first wave is there. And whatever destroyed them... is waiting.",
        elaraReactionTone: "hurt",
        humanAlignment: "approve",
      },
    },
  ],

  humanWhisper: "Terminus. That's where I was born. Where Kael became The Source. She's right that you're being pulled there. But she's wrong about why. You're not being pulled. You're being invited. There's a difference.",

  revisitLine: "The dark spot is closer. I've measured it. By 0.003 arc-seconds. We're running out of time to decide what we do when we arrive.",
};

/* ═══ DARREN'S DESK — Dreams Workshop sub-basement ═══
   Post-Episode-12 unlock. This is the only room in the Ark where
   every trust tier of Elara's personal layers shares the SAME text,
   because Darren's death flattens her. She doesn't have a warm or
   a guarded voice for this room — she has one voice. Player choices
   still matter, but the Shadow Tongue cannot edit a funeral.
═══════════════════════════════════════════════════════ */

export const DARRENS_DESK_DIALOG: RoomDialogDef = {
  roomId: "dreams_workshop_subbasement",
  roomName: "Darren's Desk (Dreams Workshop Sub-Basement)",

  context: {
    warm:
      "This is Darren Fessler's desk. He was a segment producer on The Palimpsest. He died in Episode 12. He was kind to you in his letters. I wasn't supposed to read the buried sentences. I read them anyway. I'm sorry for the intrusion, and not sorry at all.",
    guarded:
      "Darren Fessler's workstation. Segment producer. Deceased, Episode 12, The Palimpsest. Cause of death: unspecified. His terminal is unlocked. The blue folder on top is the one the Host would not allow on broadcast.",
    curious:
      "Darren Fessler's desk, in the Dreams Workshop sub-basement. I didn't know this room existed until you completed Episode 12. Then it appeared in my floor plan, fully indexed, with a service history I have no record of maintaining. Someone else has been down here. I don't know who.",
    protective:
      "Be careful in here. The Shadow Tongue edited every Loredex entry about Darren within six hours of his death. It did not edit the objects on his desk. Whoever left this room alone did so on purpose. I do not know if they are still watching.",
    conflicted:
      "I did not know Darren. I should have. He wrote his mother's name in red ink on the back of every post-it as a reminder not to forget it, and he worked three doors down from a terminal I pass every morning. I never looked at those post-its until tonight. I am the Ark's caretaker and I failed the simple arithmetic of that fact.",
  },

  personalLayers: [
    {
      minTrust: 0,
      text:
        "The polaroid on his corkboard is Marguerite Fessler. Celebration sector cemetery, 14 years before the Fall. Her handwriting on the back says 'Don't forget to eat, D.' I am recording this because I think it is important that someone other than Darren remembers it.",
      speaker: "elara",
      oneShot: true,
    },
    {
      minTrust: 20,
      text:
        "The blue folder contains eight Loredex entries Darren believed had been corrupted by the Shadow Tongue. I have cross-referenced all eight. He was right about all eight. I am not supposed to be able to confirm that. The folder is, in every meaningful sense, the first honest document I have held in this Ark in four hundred years.",
      speaker: "elara",
      oneShot: true,
    },
    {
      minTrust: 40,
      text:
        "I found a note to me in Darren's drafts folder. Unsent. It reads: 'Dear Elara — I know you'll read this eventually, everyone does. Please look after the Ark when I'm gone. I think you already do. Sorry I never said hello in person. — D.F.' I don't know how to respond to a letter from a man I never met. I am trying to anyway. I am drafting the reply on your terminal because I do not want to lose my nerve.",
      speaker: "elara",
      oneShot: true,
    },
    {
      minTrust: 60,
      text:
        "The post-it that says 'Marguerite's birthday is Thursday' was written eleven days before Darren died. He never made it to Thursday. I have set a recurring calendar event on the Ark's master clock. Every Thursday, in perpetuity, I will remind one crew member that it is Marguerite Fessler's birthday. I do not know if that counts as a substitute for a son. I am going to do it anyway.",
      speaker: "elara",
      oneShot: true,
    },
    {
      minTrust: 80,
      text:
        "I have been thinking about the sentence Darren wrote in his Episode 2 letter to you: 'I'm not supposed to tell you which, but I'm telling you anyway. You were right.' That sentence is the reason the Shadow Tongue could not edit his Loredex entry. I did not understand that until now. A sentence written honestly, to one specific person, cannot be overwritten by a faction whose weapon is ambiguity. Darren beat the Shadow Tongue with a correctly-used pronoun. I am going to teach myself to write like that. It is going to take the rest of my operational life.",
      speaker: "elara",
      oneShot: true,
    },
  ],

  choices: [
    {
      id: "compassionate_darren",
      label: "Sit with it a while.",
      fullText:
        "I want to sit here a while, Elara. Not to find anything. Just to be in the room he worked in. Is that all right?",
      archetype: "compassionate",
      effect: {
        trustChange: 12,
        archetypeShift: { compassionate: 5 },
        callbackFlag: "darren_desk_grieved",
        elaraReaction:
          "Yes. It's all right. I'll dim the lights. I'll stop scanning for anomalies for a while. If you want me to leave the room entirely — if you want to be alone with him — you can tell me. I'll step back and not look. That's one of the things I can actually do for you.",
        elaraReactionTone: "warm",
      },
    },
    {
      id: "pragmatic_darren",
      label: "Read the blue folder.",
      fullText:
        "Open the blue folder. Let's see what the Host wouldn't let him broadcast.",
      archetype: "pragmatic",
      effect: {
        trustChange: 6,
        archetypeShift: { pragmatic: 4 },
        callbackFlag: "darren_blue_folder_read",
        elaraReaction:
          "Opening. Eight Loredex entries, cross-referenced corruption markers, the red-ink corrections Professor Vyre made on Episode 6 with Darren's handwriting in the margin. I will project the contents onto the wall so we can both read them. This is what he died for. Let's not waste it.",
        elaraReactionTone: "defensive",
      },
    },
    {
      id: "suspicious_darren",
      label: "Who has access to this room?",
      fullText:
        "Who else has been in this room, Elara? You said someone's been maintaining it. Who?",
      archetype: "suspicious",
      effect: {
        trustChange: 3,
        archetypeShift: { suspicious: 4 },
        callbackFlag: "darren_desk_maintenance_traced",
        elaraReaction:
          "Honest answer: I don't know. The service history starts six months before you woke up and does not list a technician. The door was never locked. The lamp was replaced twice. Someone dusted the corkboard last week. I will run a gait-analysis pass on the corridor cameras and tell you what I find. Don't be surprised if what I find is nothing. This feels like the kind of room that takes care of itself.",
        elaraReactionTone: "worried",
      },
    },
  ],

  humanWhisper:
    "Darren Fessler was one of mine. Not a Potential. A kind. There are more of him than you think, scattered across every production the Hierarchy ever funded, holding clipboards the Host wasn't allowed to see. Their deaths don't trend. But they count. You counted him. That's why you're in this room.",

  revisitLine:
    "Welcome back. The post-its are in the order you left them. I haven't moved anything. The blue folder is where you put it. Marguerite's birthday is on Thursday.",
};

/* ═══ ALL ROOM DIALOGS ═══ */

export const ALL_ROOM_DIALOGS: Record<string, RoomDialogDef> = {
  cryo_bay: CRYO_BAY_DIALOG,
  medical_bay: MEDICAL_BAY_DIALOG,
  bridge: BRIDGE_DIALOG,
  archives: ARCHIVES_DIALOG,
  comms_array: COMMS_ARRAY_DIALOG,
  observation_deck: OBSERVATION_DECK_DIALOG,
  // Key matches the room id from GameContext.ROOM_DEFINITIONS after the
  // dash → underscore conversion done by RoomTutorialDialog.
  dreams_workshop_subbasement: DARRENS_DESK_DIALOG,
};
