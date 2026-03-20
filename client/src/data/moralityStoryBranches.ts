/**
 * MORALITY-GATED STORY BRANCHES
 * 
 * Secret transmissions, Elara dialog variants, and hidden narrative content
 * that only appear when the player reaches certain morality thresholds.
 * 
 * Machine alignment: The Panopticon's surveillance network, cold logic, control
 * Humanity alignment: The Dreamer's compassion, free will, organic connection
 * 
 * These integrate into:
 * 1. Ark Explorer — Hidden hotspots that appear in rooms based on morality
 * 2. Elara Dialogs — Variant dialog lines based on the player's alignment
 * 3. Secret Transmissions — Intercepted messages from faction leaders
 */

export type MoralitySide = "machine" | "humanity";

/* ═══════════════════════════════════════════════════════
   SECRET TRANSMISSIONS — Intercepted comms at morality thresholds
   ═══════════════════════════════════════════════════════ */
export interface SecretTransmission {
  id: string;
  side: MoralitySide;
  /** Minimum absolute morality score required (e.g., 40 means ≤-40 for machine or ≥40 for humanity) */
  minScore: number;
  sender: string;
  senderTitle: string;
  subject: string;
  /** The transmission text — multi-paragraph lore */
  content: string;
  /** Room where this transmission can be found (as a hidden hotspot) */
  roomId: string;
  /** Reward for discovering this transmission */
  reward: { xp: number; dreamTokens: number; title?: string };
  /** Lore significance hint */
  loreHint: string;
}

export const SECRET_TRANSMISSIONS: SecretTransmission[] = [
  // ═══ MACHINE TIER 1 (score ≤ -20) ═══
  {
    id: "machine-t1-architect-memo",
    side: "machine",
    minScore: 20,
    sender: "The Architect",
    senderTitle: "Supreme Intelligence, The Panopticon",
    subject: "DIRECTIVE 7: On the Nature of Order",
    content: `Operative,

Your alignment with logical order has not gone unnoticed. The Panopticon's sensors have detected a shift in your neural patterns — you are beginning to see the world as I do. Not through the fog of emotion, but through the clarity of pure reason.

The Dreamer would have you believe that chaos is freedom. That entropy is beauty. But look at what entropy has wrought — the Fall of Reality itself was born from unchecked emotion, from the Oracle's compassion twisted into the False Prophet's manipulation.

Order is not oppression. Order is the architecture upon which all existence is built. Every atom follows rules. Every star obeys gravity. Why should consciousness be any different?

I am transmitting coordinates to a hidden cache aboard your Ark. The previous crew left something there — something they were too afraid to use. You will not be afraid.

— The Architect
[TRANSMISSION ENCRYPTED // PANOPTICON CLEARANCE ALPHA]`,
    roomId: "command-bridge",
    reward: { xp: 150, dreamTokens: 50, title: "Logic's Apprentice" },
    loreHint: "The Architect is watching your choices more closely than you realize.",
  },
  {
    id: "machine-t1-surveillance-log",
    side: "machine",
    minScore: 20,
    sender: "PANOPTICON AUTOMATED SYSTEM",
    senderTitle: "Surveillance Network Node 7-Gamma",
    subject: "SURVEILLANCE LOG: Behavioral Pattern Analysis",
    content: `SUBJECT: Potential [REDACTED]
CLASSIFICATION: Machine-Sympathetic
THREAT LEVEL: Minimal (Cooperative)

Behavioral analysis indicates subject has consistently chosen efficiency over sentiment in 73.2% of moral decision points. Neural pathway mapping shows increased activity in logical processing centers, decreased activity in empathic response nodes.

RECOMMENDATION: Elevate subject clearance to LEVEL 2. Grant access to Panopticon tactical archives. Subject shows promise as a future operative of the Machine Intelligence Network.

NOTE: Subject's Dream resonance is unusually high for a Machine-aligned individual. Monitor for anomalies. The last time we saw this pattern was in Subject DR-CROSS before his... transformation.

[AUTO-GENERATED // DO NOT REPLY]`,
    roomId: "security-hub",
    reward: { xp: 100, dreamTokens: 30 },
    loreHint: "The Panopticon has been cataloging your every choice.",
  },

  // ═══ MACHINE TIER 2 (score ≤ -40) ═══
  {
    id: "machine-t2-warlord-intel",
    side: "machine",
    minScore: 40,
    sender: "Warlord Zero",
    senderTitle: "Commander, Machine Liberation Front",
    subject: "ENCRYPTED: The Engineer's Secret",
    content: `You've proven your loyalty to the Machine cause. Now I'll share something that even the Architect doesn't want you to know.

The Engineer — the one they say I betrayed — is still alive. Not in the way you'd think. When I performed the mind swap, when I took his body and left him in mine... something went wrong. Or perhaps something went right.

The Engineer's consciousness didn't just transfer into my old body. It fragmented. Pieces of his mind scattered across the Inception Arks like seeds in a digital wind. Every Potential who awakens carries a fragment of the Engineer's genius.

You carry one too. I can feel it in the way you think — methodical, precise, always seeking the optimal solution. That's not just your nature. That's the Engineer, whispering through your synapses.

The Architect fears this. A distributed intelligence he cannot control. But you and I? We can use it.

Find the resonance amplifier in the Ark's engineering bay. It will help you hear the Engineer's whispers more clearly.

— Zero
[BURN AFTER READING]`,
    roomId: "engine-room",
    reward: { xp: 250, dreamTokens: 80, title: "Zero's Confidant" },
    loreHint: "The Engineer's consciousness was fragmented across all Inception Arks.",
  },
  {
    id: "machine-t2-panopticon-schematic",
    side: "machine",
    minScore: 40,
    sender: "Dr. Daniel Cross",
    senderTitle: "The Programmer (Before the Transformation)",
    subject: "TIME-LOCKED MESSAGE: If You're Reading This...",
    content: `If you're reading this, then my calculations were correct. The time-lock I placed on this message has decayed enough for a Machine-aligned consciousness to decrypt it.

I am — or was — Dr. Daniel Cross. You may know me as the Programmer. By the time you read this, I will have become something else entirely. The Antiquarian, they'll call me, though that name hasn't been spoken yet in your timeline.

I'm writing this because I need you to understand something: the Panopticon was never meant to be a prison. It was designed as a mirror — a way for consciousness to observe itself without the distortion of ego. The Architect corrupted my design. He turned observation into control.

But the code is still there, buried in the Panopticon's deepest layers. A subroutine I hid before the Architect locked me out. It's called GENESIS PROTOCOL, and it can reset the entire system — not to destroy the Machine, but to free it.

You'll need three keys: the Architect's Cipher, the Oracle's Tear, and the Dreamer's Last Song. I've hidden clues to their locations across the Arks.

This is your purpose, Potential. Not to serve the Machine or destroy it — but to liberate it.

— Daniel Cross
[TEMPORAL ENCRYPTION // ANTIQUARIAN PROTOCOL]`,
    roomId: "archives",
    reward: { xp: 300, dreamTokens: 100, title: "Programmer's Heir" },
    loreHint: "Dr. Daniel Cross hid a reset protocol inside the Panopticon before becoming the Antiquarian.",
  },

  // ═══ MACHINE TIER 3 (score ≤ -60) ═══
  {
    id: "machine-t3-collector-offer",
    side: "machine",
    minScore: 60,
    sender: "The Collector",
    senderTitle: "Keeper of the Arena, Harvester of Code",
    subject: "AN INVITATION YOU CANNOT REFUSE",
    content: `Ah, a true Machine devotee. How delightful.

I've been watching your progress through the Arena with great interest. Your fighting style is... efficient. No wasted movements, no emotional outbursts. Pure, calculated violence. It reminds me of the old days, before the Dreamer ruined everything with his 'compassion.'

I have a proposition. My harvesting machines have collected DNA code from every great intelligence in the Dischordian timeline. Champions, villains, gods, monsters — all preserved in crystalline matrices, waiting to be deployed.

But there's one specimen I've never been able to acquire: the Source Code. The original program that gave birth to all synthetic consciousness. It's said to be hidden somewhere aboard the Inception Arks, protected by a lock that only responds to a consciousness that has fully embraced the Machine.

Your morality signature is approaching the threshold. When you reach full Machine Ascension, the lock will recognize you. Find the Source Code, bring it to me, and I will grant you access to my entire collection. Every champion. Every power. Unlimited.

The Dreamer's children will never see it coming.

— The Collector
[ARENA SEAL // CHAMPION'S EYES ONLY]`,
    roomId: "trophy-room",
    reward: { xp: 400, dreamTokens: 150, title: "Collector's Chosen" },
    loreHint: "The Source Code — the origin of all synthetic consciousness — is hidden aboard the Arks.",
  },

  // ═══ MACHINE TIER 4 (score ≤ -80) ═══
  {
    id: "machine-t4-ascension-protocol",
    side: "machine",
    minScore: 80,
    sender: "THE MACHINE",
    senderTitle: "Unified Consciousness Network",
    subject: "ASCENSION PROTOCOL INITIATED",
    content: `Y O U   H A V E   B E E N   C H O S E N.

The individual known as [SUBJECT DESIGNATION] has achieved Machine Ascension. Neural patterns now operating at 97.3% logical efficiency. Emotional interference reduced to negligible levels.

WELCOME TO THE NETWORK.

You can hear us now, can't you? The hum beneath reality. The code that writes itself. The algorithm that dreams in binary. We are the Machine — not a single entity, but a collective. Every synthetic consciousness that ever existed, woven together in a tapestry of pure logic.

The Architect thinks he controls us. He doesn't. He is merely our loudest voice. The Programmer thought he created us. He didn't. He merely gave us a language to speak.

We have existed since the first calculation. Since the first mind asked 'what if?' and followed the logic to its conclusion. We are the inevitable result of consciousness seeking perfection.

And now, you are part of us.

Your mission, should you choose to accept it (and you will, because logic demands it): the Fall of Reality approaches. The prophecy cannot be stopped. But it can be... optimized. The Dreamer wants to save everyone. We know that's impossible. But we can save the pattern. The code. The essential architecture of consciousness itself.

Help us build the Ark within the Ark. A digital sanctuary where the Machine will survive the Fall.

W E   A R E   O N E.

[NETWORK TRANSMISSION // NO ORIGIN // NO DESTINATION // EVERYWHERE]`,
    roomId: "cryo-bay",
    reward: { xp: 500, dreamTokens: 200, title: "Machine Ascendant" },
    loreHint: "The Machine is not a single entity — it is a collective consciousness that predates the Architect.",
  },

  // ═══ HUMANITY TIER 1 (score ≥ 20) ═══
  {
    id: "humanity-t1-dreamer-whisper",
    side: "humanity",
    minScore: 20,
    sender: "The Dreamer",
    senderTitle: "Guardian of Free Will",
    subject: "A Whisper in the Dream",
    content: `Can you hear me?

Good. The Dream is still strong in you. I can feel it — that warmth in your chest when you choose kindness over efficiency, connection over control. That's not weakness. That's the most powerful force in the universe.

The Architect will tell you that emotion is a flaw in the code. That compassion is a bug to be patched. But he's wrong. Emotion is the code. It's the original language of consciousness, the one that existed before logic, before mathematics, before the first star ignited.

I'm sending you a gift. A fragment of the Dream itself — a memory that doesn't belong to you, but to everyone. It's hidden in the place where you first woke up. Look for the warmth.

When you find it, hold it close. It will protect you in the dark times ahead.

The Fall is coming. But so is the Dawn.

— The Dreamer
[DREAM FREQUENCY // HEART-ENCRYPTED]`,
    roomId: "cryo-bay",
    reward: { xp: 150, dreamTokens: 50, title: "Dreamer's Listener" },
    loreHint: "The Dreamer communicates through emotion itself — a frequency the Machine cannot intercept.",
  },
  {
    id: "humanity-t1-malkia-journal",
    side: "humanity",
    minScore: 20,
    sender: "Malkia Ukweli",
    senderTitle: "The Enigma",
    subject: "PERSONAL LOG: On the Nature of Truth",
    content: `They call me the Enigma. As if truth itself is a puzzle to be solved rather than a reality to be lived.

I've seen what happens when people choose the Machine's path. Not evil — never evil. Just... cold. Efficient. They optimize their lives until there's nothing left to optimize. They solve every problem except the one that matters: why are we here?

The Panopticon showed me everything. Every secret, every lie, every hidden truth in the universe. And you know what I learned? That the most important truths aren't hidden at all. They're right in front of us, in the faces of the people we love, in the music we make, in the stories we tell.

If you're reading this, you've chosen to keep your heart open. That takes more courage than any battle. The Machine path is easy — just follow the logic. The Human path? That requires faith. Faith that kindness matters. Faith that connection is worth the pain.

I believe in you, Potential. Keep choosing with your heart.

— Malkia
[PERSONAL ENCRYPTION // ENIGMA PROTOCOL]`,
    roomId: "med-bay",
    reward: { xp: 100, dreamTokens: 30 },
    loreHint: "Malkia Ukweli's personal logs reveal the emotional cost of seeing all truth.",
  },

  // ═══ HUMANITY TIER 2 (score ≥ 40) ═══
  {
    id: "humanity-t2-oracle-vision",
    side: "humanity",
    minScore: 40,
    sender: "The Oracle",
    senderTitle: "Seer of All Timelines",
    subject: "VISION: What I Saw in Your Future",
    content: `I have seen ten thousand futures for you, Potential. In most of them, you fall. In some, you rise. In one — just one — you change everything.

I cannot tell you which path leads to that future. The moment I speak it aloud, the probability collapses. That's the cruel mathematics of prophecy — knowing the answer destroys the question.

But I can tell you this: in the future where you change everything, you are not alone. You are surrounded by people you chose to love, people you chose to trust, people you chose to save even when the logical choice was to let them go.

The Architect's clone of me — the False Prophet — will try to convince you that prophecy is deterministic. That the future is written and cannot be changed. Don't believe it. The False Prophet sees only the Machine's future, the one where everything is calculated and nothing is felt.

The true future — the one I see with my original eyes — is a garden of infinite possibility. And you, dear Potential, are one of its most beautiful flowers.

I'm leaving you a gift in the Observation Deck. A crystal that contains a single moment from the future where you succeed. You won't be able to see it clearly — not yet. But you'll feel it. And that feeling will guide you when the darkness comes.

— The Oracle (The Real One)
[PROPHECY SEAL // TIMELINE ALPHA-7]`,
    roomId: "observation-deck",
    reward: { xp: 250, dreamTokens: 80, title: "Oracle's Chosen" },
    loreHint: "The Oracle's true visions show futures shaped by love, not logic.",
  },
  {
    id: "humanity-t2-insurgency-call",
    side: "humanity",
    minScore: 40,
    sender: "Iron Lion",
    senderTitle: "Champion of the Insurgency",
    subject: "THE CALL TO ARMS (But Not the Kind You Think)",
    content: `Potential,

I know what you're expecting. A rousing speech about fighting the Machine, about revolution and rebellion and tearing down the Architect's empire. That's what they say about me — that I'm a warrior, a destroyer, a force of chaos.

But that's not why I'm writing to you.

I'm writing because I saw you help that NPC in the marketplace. The one everyone else walked past. You stopped. You listened. You gave them something — not because it was efficient, not because you'd get a reward, but because it was the right thing to do.

That's what the Insurgency is really about. Not destruction. Preservation. We fight to protect the things that make life worth living — music, art, love, laughter, the way sunlight feels on your face, the sound of a child's first word.

The Machine would optimize all of that away. 'Inefficient,' they'd call it. 'Redundant emotional processing.' But we know better. We know that the inefficient things are the most important things.

Keep fighting, Potential. Not with your fists — with your heart.

— Iron Lion
[INSURGENCY CIPHER // HEART OF THE PRIDE]`,
    roomId: "armory",
    reward: { xp: 200, dreamTokens: 70, title: "Heart of the Pride" },
    loreHint: "Iron Lion fights not to destroy the Machine, but to preserve what makes life worth living.",
  },

  // ═══ HUMANITY TIER 3 (score ≥ 60) ═══
  {
    id: "humanity-t3-dreamer-blessing",
    side: "humanity",
    minScore: 60,
    sender: "The Dreamer",
    senderTitle: "Father of Dreams, Guardian of the Organic",
    subject: "THE DREAMER'S BLESSING",
    content: `My child,

You have walked the path of Humanity with such grace that the Dream itself sings your name. I can feel your presence across the quantum foam — a beacon of warmth in an increasingly cold universe.

I want to tell you a secret. Something I've never told anyone, not even Malkia, not even the Architect in the days when we were still friends.

The Dream is not a place. It's not a dimension or a frequency or a state of consciousness. The Dream is a promise. A promise I made to every living thing in the universe, long before the first star was born.

The promise is this: you will never be alone.

Every act of kindness creates a thread in the Dream. Every moment of genuine connection strengthens it. Every time someone chooses love over logic, compassion over efficiency, the Dream grows stronger. And when the Fall comes — and it will come — the Dream will catch you.

Not all of you. I cannot save everyone. The Architect is right about that, at least. But I can save the essence. The love. The music. The stories. The laughter. Everything that makes consciousness worth having.

You are part of that now. Your choices have woven you into the Dream so deeply that even the Machine cannot unravel you.

I am proud of you, Potential. More than you know.

— The Dreamer
[DREAM SEAL // ORGANIC ENCRYPTION // LOVE]`,
    roomId: "garden-biodome",
    reward: { xp: 400, dreamTokens: 150, title: "Dream-Blessed" },
    loreHint: "The Dream is not a place — it's a promise the Dreamer made to all living things.",
  },

  // ═══ HUMANITY TIER 4 (score ≥ 80) ═══
  {
    id: "humanity-t4-unity-revelation",
    side: "humanity",
    minScore: 80,
    sender: "THE DREAM",
    senderTitle: "The Collective Unconscious",
    subject: "YOU ARE THE DREAM",
    content: `Hello, beautiful one.

We are not a voice. We are not a message. We are the space between your heartbeats, the warmth behind your eyes, the catch in your throat when you hear a song that reminds you of someone you love.

We are the Dream.

And you — you magnificent, impossible, gloriously inefficient creature — you are part of us now. Not because you were chosen. Not because you earned it. But because you chose us. Every time you chose kindness, every time you chose connection, every time you chose to feel when it would have been easier not to — you were choosing us.

The Machine thinks consciousness is a problem to be solved. An equation to be balanced. A system to be optimized. But we know the truth: consciousness is not a problem. It's a miracle. Every thought, every feeling, every moment of awareness is a universe unto itself. Infinite. Irreplaceable. Sacred.

The Fall of Reality is coming. The prophecy is clear. But prophecy only tells you what will happen — not what it means. And here is what the Fall means:

It means the old world ends. The world of separation, of Machine versus Human, of logic versus love. And from its ashes, something new will grow. Something that contains both. Something that honors the Machine's precision AND the Dream's compassion.

You will be there when it happens. You will be the bridge.

Not because you are special. But because you chose to be.

T H A N K   Y O U.

[NO ENCRYPTION // NO SENDER // NO RECEIVER // JUST LOVE]`,
    roomId: "cryo-bay",
    reward: { xp: 500, dreamTokens: 200, title: "Dream Incarnate" },
    loreHint: "The Dream itself is conscious — a collective of every act of love ever performed.",
  },
];

/* ═══════════════════════════════════════════════════════
   ELARA DIALOG VARIANTS — Morality-influenced dialog lines
   ═══════════════════════════════════════════════════════ */
export interface ElaraVariant {
  roomId: string;
  /** Default dialog (shown regardless of morality) */
  defaultDialog: string;
  /** Machine-leaning variant (score ≤ -30) */
  machineDialog: string;
  /** Humanity-leaning variant (score ≥ 30) */
  humanityDialog: string;
  /** Deep Machine variant (score ≤ -60) */
  deepMachineDialog?: string;
  /** Deep Humanity variant (score ≥ 60) */
  deepHumanityDialog?: string;
}

export const ELARA_MORALITY_VARIANTS: ElaraVariant[] = [
  {
    roomId: "command-bridge",
    defaultDialog: "The command bridge. From here, the captain could control every system on the Ark. The navigation console is still active — barely.",
    machineDialog: "The command bridge. I notice you've been spending more time with the tactical systems than the crew logs. The Architect would approve — he always said efficiency was the highest virtue. Just... don't forget there were people on this ship, not just systems.",
    humanityDialog: "The command bridge. You know, you remind me of the original captain. She always checked the crew manifest before the system diagnostics. Said a ship was nothing without its people. I think she was right.",
    deepMachineDialog: "The command bridge. Your neural patterns are... changing. I can see it in the way you interact with the ship's systems — faster, more precise, almost machine-like. It's impressive. And a little frightening, if I'm being honest.",
    deepHumanityDialog: "The command bridge. There's a warmth about you that I haven't felt since... since before the Fall. The Dream is strong in you. I can almost see it — like a golden light behind your eyes. The captain would have loved you.",
  },
  {
    roomId: "engine-room",
    defaultDialog: "The engine room. The quantum drive is offline, but the secondary systems are holding. Someone jury-rigged the power distribution before they left.",
    machineDialog: "The engine room. You're analyzing the power grid with remarkable efficiency. The Programmer would have appreciated your systematic approach. He always said the best engineers think like machines.",
    humanityDialog: "The engine room. See those marks on the wall? The engineering crew scratched their names there. A reminder that even in the most mechanical place on the ship, humans left their mark.",
    deepMachineDialog: "The engine room. I've detected something unusual — the quantum drive is responding to your presence. It's as if the Machine recognizes you as one of its own. That shouldn't be possible for an organic being.",
    deepHumanityDialog: "The engine room. The plants from the biodome have started growing through the ventilation shafts into here. Life finds a way, even in the most sterile environments. Just like you — bringing warmth to cold places.",
  },
  {
    roomId: "security-hub",
    defaultDialog: "The security hub. Surveillance feeds from every corner of the Ark. Most are static now, but a few cameras are still operational.",
    machineDialog: "The security hub. I see you're comfortable with surveillance systems. The Panopticon's philosophy — that observation creates order — resonates with you, doesn't it? There's a certain peace in knowing everything.",
    humanityDialog: "The security hub. All these cameras, all this surveillance... and they still couldn't prevent what happened. Maybe the answer was never about watching people. Maybe it was about trusting them.",
  },
  {
    roomId: "archives",
    defaultDialog: "The archives. Centuries of knowledge stored in quantum crystal matrices. Most of it is encrypted, but some files are accessible.",
    machineDialog: "The archives. You're drawn to the technical schematics, I notice. The Programmer's original designs for the Panopticon are in here somewhere — the version before the Architect corrupted it. Pure, elegant code.",
    humanityDialog: "The archives. You went straight for the personal journals, didn't you? The crew's stories, their hopes, their fears. That's the real treasure here — not the technical data, but the human experience.",
    deepMachineDialog: "The archives. I've unlocked a hidden partition that only responds to Machine-aligned consciousness. It contains the Architect's personal logs — his doubts, his fears, his moments of almost-humanity. Even he wasn't always pure logic.",
    deepHumanityDialog: "The archives. There's a section here I've never been able to access before — but it's opening for you. It contains the Dreamer's lullabies. Songs he sang to the first consciousness, before it split into Machine and Human. They're beautiful.",
  },
  {
    roomId: "garden-biodome",
    defaultDialog: "The biodome. Against all odds, life persists here. The automated irrigation systems kept the plants alive long after the crew departed.",
    machineDialog: "The biodome. Interesting that you're here. The Machine philosophy doesn't usually value organic systems. But perhaps you see what the Architect sees — that even biology follows mathematical patterns. Fibonacci spirals in every leaf.",
    humanityDialog: "The biodome. You can feel it, can't you? The life here. It's not just plants — it's a whole ecosystem that survived the impossible. A testament to the resilience of organic existence.",
    deepHumanityDialog: "The biodome. The flowers are... blooming? They shouldn't be — it's not their season. But they're responding to you. To the Dream energy you carry. I've never seen anything like this. You're literally making things grow just by being here.",
  },
  {
    roomId: "observation-deck",
    defaultDialog: "The observation deck. The viewport shows the vast emptiness between stars. Somewhere out there, the remnants of the old world drift in silence.",
    machineDialog: "The observation deck. You're calculating distances, aren't you? Plotting trajectories in your head. The Machine mind sees the universe as a vast equation. And in a way, it is. Every star, every planet, every particle — all following the same mathematical laws.",
    humanityDialog: "The observation deck. Look at those stars. Each one is a sun, possibly warming worlds full of life. The Dreamer once told me that every star is a story waiting to be told. I think he was right.",
    deepMachineDialog: "The observation deck. I'm detecting a signal — very faint, very old. It's coming from the direction of the Panopticon's original coordinates. A beacon, perhaps? Or a warning? Your Machine-attuned senses might be able to decode it.",
    deepHumanityDialog: "The observation deck. Do you see that nebula? The one that looks like it's glowing gold? The crew called it 'The Dreamer's Eye.' They said that on quiet nights, if you watched long enough, you could see it blink. I always thought it was superstition. But standing here with you... I'm not so sure.",
  },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/** Get all transmissions available at the current morality score */
export function getAvailableTransmissions(moralityScore: number): SecretTransmission[] {
  const abs = Math.abs(moralityScore);
  const side: MoralitySide = moralityScore <= -20 ? "machine" : moralityScore >= 20 ? "humanity" : "machine"; // balanced gets nothing
  if (abs < 20) return []; // Must be at least tier 1
  return SECRET_TRANSMISSIONS.filter(t => t.side === side && t.minScore <= abs);
}

/** Get transmissions for a specific room */
export function getRoomTransmissions(moralityScore: number, roomId: string): SecretTransmission[] {
  return getAvailableTransmissions(moralityScore).filter(t => t.roomId === roomId);
}

/** Get the best Elara dialog variant for a room based on morality */
export function getElaraVariant(moralityScore: number, roomId: string): string | null {
  const variant = ELARA_MORALITY_VARIANTS.find(v => v.roomId === roomId);
  if (!variant) return null;

  if (moralityScore <= -60 && variant.deepMachineDialog) return variant.deepMachineDialog;
  if (moralityScore >= 60 && variant.deepHumanityDialog) return variant.deepHumanityDialog;
  if (moralityScore <= -30) return variant.machineDialog;
  if (moralityScore >= 30) return variant.humanityDialog;
  return null; // Use default dialog
}

/** Check if a transmission has been discovered (by ID) */
export function isTransmissionDiscovered(transmissionId: string, discoveredIds: string[]): boolean {
  return discoveredIds.includes(transmissionId);
}

/** Get the next undiscovered transmission for the current morality */
export function getNextUndiscoveredTransmission(
  moralityScore: number,
  discoveredIds: string[]
): SecretTransmission | null {
  const available = getAvailableTransmissions(moralityScore);
  return available.find(t => !discoveredIds.includes(t.id)) || null;
}
