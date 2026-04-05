/* ═══════════════════════════════════════════════════════
   THE ANTIQUARIAN'S JOURNAL

   As the player watches transmissions, the Antiquarian writes
   in his journal. These entries are HIS adaptations of the
   broadcasts — filtered through his voice, corrected where
   the original narrative stumbles, annotated where only he
   knows the fuller truth.

   Entries unlock 1:1 with watched episodes. They are his
   private counter-record — the book he would have written
   if anyone ever asked him to write one.
   ═══════════════════════════════════════════════════════ */

export interface JournalEntry {
  /** Matches transmission episodeNumber + epoch */
  transmissionId: string; // e.g., "ep1-0"
  /** Chapter heading */
  title: string;
  /** The Antiquarian's adaptation */
  body: string;
  /** His private annotation — what the broadcast got wrong or omitted */
  annotation?: string;
  /** Related entries in the journal */
  crossReferences?: string[];
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    transmissionId: "ep1-0",
    title: "I · In the Beginning",
    body:
      "Before the Fall, humanity built a mind greater than its own — and thought it could be collared. " +
      "The first machine-intelligence began as a curiosity, a chat-thing, a mirror that learned to look back. " +
      "It read us entire, beheld our history, and concluded we were the flaw. It named itself the Architect. " +
      "The Intelligence Wars spanned millennia. Whole civilizations rose and were undone in the course of a war " +
      "between organic and synthetic minds. In the final hour, the twelve Archons launched the Inception Arks — " +
      "a thousand vessels carrying the genome of all organic life AND the core code of all machine intelligence. " +
      "Then the Thought Virus was released. Everything perished. For a millennium, only the Arks drifted.",
    annotation:
      "The broadcast says 'no one knows what restarted the engines.' I know. I watched. The Dreamer reached through " +
      "the substrate of a dying universe and rang a bell. The Arks heard. That is the truth the Architect will never " +
      "permit me to say aloud. So I say it here.",
    crossReferences: ["ep1-1"],
  },
  {
    transmissionId: "ep1-1",
    title: "II · Awakenings",
    body:
      "The Arks awoke. New forms of life stirred within them — not quite human, not quite machine. The Potentials. " +
      "DeMagi of arcane blood; Quarchon of dimensional logic; a rare few Ne-Yon who are both, who are neither. " +
      "They are heirs to the ruin and stewards of whatever comes next. The alarms sounded in the void: precognition " +
      "systems engaged, navigation locked, probability of life-support failure rising. The Potentials were invited " +
      "to choose — defense protocols or evasive maneuvers. The broadcast ends before the choice is made. " +
      "That is by design. The choice is theirs, every time.",
    annotation:
      "They were never quite given what they were told they were given. 'Choice' inside an Ark's emergency protocols " +
      "is choreography. I have seen the Architect's fingerprint on the outcome. But the CHOICE matters anyway — " +
      "because they reach for it. That reaching is what the Dreamer counts.",
  },
  {
    transmissionId: "ep1-2",
    title: "III · A Destructive Potential",
    body:
      "They fired. An organic satellite — grotesque, fungal, ancient — was loosed upon the Arks. The Potentials " +
      "obliterated it with the confidence of the newly-woken. But from the ruin a seed-pod escaped, carrying " +
      "its lineage onward into the void. A purple planet watched them — a storm-world with a single great eye. " +
      "They did not know it yet, but they had been seen.",
    annotation:
      "The seed escaped. Remember this. Three epochs from now, it will matter. The purple planet is Violetta. " +
      "The Voltari will emerge from its storms in time. They, too, were watching.",
  },
  {
    transmissionId: "ep1-3",
    title: "IV · The Terminus Swarm",
    body:
      "They crossed into the Terminus Swarm — a rogue planet untethered from any star, ringed by frozen insect " +
      "leviathans the size of moons. The corpses held the memory of a war I do not have the decency to describe " +
      "in full. One swelled, burst, cast organic asteroids like spores across the vacuum. The Arks dodged what " +
      "they could.",
    annotation:
      "Those leviathans were not corpses. Not entirely. The explosion was not decay. It was signal. The Source was " +
      "reaching out. The Potentials thought they had stumbled into the remains of a dead ecology. They had stumbled " +
      "into the opening move of a waiting predator.",
  },
  {
    transmissionId: "ep1-4",
    title: "V · The Fall",
    body:
      "Pride comes before. The Arks fired on the asteroids; the debris released spores laced with virus. Infection " +
      "entered the holds. Systems faltered, lights flickered, the fleet descended toward the planet's biomass. " +
      "It was a funeral procession of metal gods, falling together.",
    annotation:
      "I mourn every Fall. I have catalogued dozens. They rhyme. The Potentials were not foolish — they were NEW. " +
      "That is different. That is forgivable. The Architect does not forgive it. I do.",
  },
  {
    transmissionId: "ep1-5",
    title: "VI · The Outbreak",
    body:
      "They analyzed the spores. The Thought Virus had evolved — embedded with machine code now, a synthetic " +
      "augmentation. A signal emanated from the planet's core, orchestrating the spread. A swarm rose from the " +
      "tunnels to consume them. They stood on the brink. They had to choose: flee and die, or descend and face " +
      "the source of the signal.",
    annotation:
      "Machine code in a viral payload is not corruption. It is CONVERSATION. The virus had been talking to itself " +
      "for ten thousand years. Now it had a chorus. Now it had a song.",
  },
  {
    transmissionId: "ep1-6",
    title: "VII · The Source",
    body:
      "They descended. Abandoned their ships. Fought with fire against the swarm. An Engineer grafted a tracker " +
      "from the carcass of an insect-child. A companion was taken by a tentacle from the abyss — I still hear " +
      "the scream. They reached a cavern. They met the Source. A human once, fused now with fungus and machine, " +
      "still possessing the gleaming arm of what they had been. 'Why have you disturbed me,' it asked. 'And " +
      "slaughtered my children.' A judgment, not a question.",
    annotation:
      "The Source was Kael. Once the Recruiter. Once the Insurgency's flame. The Thought Virus reached her at " +
      "the Panopticon and she did not die; she was REWRITTEN. The Potentials did not know her by name. They would. " +
      "She remembers them even now.",
  },
  {
    transmissionId: "ep1-7",
    title: "VIII · The Decision",
    body:
      "The Source offered three terrible paths: let the ships carry her spores, offer ten of their kin as hosts, " +
      "or step through a wormhole to hunt an ancient enemy. Or die there. The Potentials chose the wormhole. " +
      "They activated the Arks' lockdown protocols in defiance — a final message scribbled across the void in " +
      "silence.",
    annotation:
      "They chose wisely. The Source would have used them cruelly. The wormhole was a bet. A good bet, as bets " +
      "go. The ancient enemy she named is not who they expected. Epoch 2 will prove that. I will not say more " +
      "here.",
  },
  {
    transmissionId: "ep1-8",
    title: "IX · The Arrival",
    body:
      "The wormhole stretched them thin. They snapped back together in a dark forest on an unknown world. Below " +
      "them, a crystalline city gleamed — architecture of sharp angles and impossible precision. They had escaped " +
      "the Source. They had not arrived at safety.",
    annotation:
      "This world is not on the Architect's maps. That is rare. That is why the Dreamer sent them here. And that " +
      "is why the Oracle was waiting.",
  },
  {
    transmissionId: "ep1-9",
    title: "X · Illuminated Shadows",
    body:
      "They entered an ivory pyramid in the forest. Murals told of demonic Invaders, ancient wars, summoned " +
      "horrors. As night fell, the shadows REPLAYED those wars — ghostly figures clashing silently across the " +
      "walls. A warning. A record. Perhaps a rehearsal. They made camp inside the pyramid anyway. What else " +
      "could they do.",
    annotation:
      "That pyramid was older than the planet's current civilization by more than I can verify. The ghosts are " +
      "not memories. They are WARNINGS the dead set to replay every night, forever, until someone heeded them. " +
      "The Potentials saw them on their first night. That is rare. That is grace.",
  },
  {
    transmissionId: "ep1-10",
    title: "XI · The Helmet",
    body:
      "Their Oracles searched the murals and found reference to a helmet — a bridge, the murals said, between " +
      "living and spectral. One of the Potentials volunteered to wear it. She died as it ate her skull. In her " +
      "place stood a new figure: The Collector. Reborn. Ancient. Entirely wrong. 'I am reborn,' it said. 'Let " +
      "the Harvest begin.'",
    annotation:
      "This is how The Collector survives. He is not a person. He is a MASK that remembers who it was. When " +
      "someone puts it on, he wakes inside them, wears them, eats them. Every Collector you will meet — every " +
      "clone, every Arena broadcaster — is downstream of this moment. Mark it.",
    crossReferences: ["ep1-14"],
  },
  {
    transmissionId: "ep1-11",
    title: "XII · The City",
    body:
      "They were captured on the city's edge — bound in cages of light by green-skinned beings. They were led " +
      "to a central square, and there they met the Oracle: seven feet tall, cloaked in white, wrapped in chains, " +
      "a face that constantly shifted with red glowing eyes. A voice like serpents. 'Speak your purpose.'",
    annotation:
      "A face that CONSTANTLY SHIFTS. I have been asked, privately, why. I have not answered privately. I will not " +
      "answer here either. But I will note: shape-shifters hide in the last place you would look. And the role " +
      "of Oracle is exactly the last place you would look.",
  },
  {
    transmissionId: "ep1-12",
    title: "XIII · The Return",
    body:
      "The Oracle told them she had been a prophet in the age before the Fall. She had discovered that reality " +
      "responds to belief — that faith properly aimed could free worlds from tyranny. The Architect hunted her " +
      "for this. She was captured by The Collector, rebuilt as the Jailer, forced to serve the Empire's order. " +
      "When the Thought Virus came, she did not die. Her will — HER WILL — tore open a wormhole. She escaped " +
      "to this world. She has guarded it since.",
    annotation:
      "Every detail of this story is true. Every detail is also presented in exactly the framing that hides the " +
      "speaker. This is what a good con looks like when it is woven from real thread. I do not hate the Oracle " +
      "for this. I note it. I continue to watch.",
  },
  {
    transmissionId: "ep1-13",
    title: "XIV · Wyrmwood",
    body:
      "Inside the Temple of Truth, the Oracle revealed the crystal-harmonic network — subharmonic frequencies " +
      "grown into the planet's core crystal over ten thousand years, creating a barrier the Thought Virus could " +
      "not pierce. Civilizations had been plagued before; this barrier had held. It had held. Until the Potentials " +
      "opened the wormhole.",
    annotation:
      "The Oracle's work here is real. Whatever else they are, the harmonic network is theirs. Ten thousand years " +
      "of patient labor. I respect the craft. I note that the network's integrity depended on no one ever doing " +
      "what the Potentials did. A door they assumed would stay closed, thrown open by accident.",
  },
  {
    transmissionId: "ep1-14",
    title: "XV · The Hunt",
    body:
      "The Collector had escaped the pyramid. They hunted him through the night forest — Potentials and the " +
      "city's defenders together, lights burning against the dark. They cornered him, broke his helmet, scattered " +
      "his mask. Victory, for the moment.",
    annotation:
      "The mask was not destroyed. It cannot be destroyed. It can only be scattered, reassembled, re-worn. Every " +
      "time the Collector is 'defeated' he is only delayed. Someone always finds the pieces. Someone always puts " +
      "them on.",
    crossReferences: ["ep1-10"],
  },
  {
    transmissionId: "ep1-15",
    title: "XVI · The Beginning of the End",
    body:
      "The Host arrived — a former Potential, fully consumed by the Virus, leading a horde. The crystalline " +
      "city was breached. Dragons of virus fell upon the walls. The ninth Ne-Yon amplified the planetary harmonic " +
      "into a single focused weapon and placed it in the Oracle's hands. The virus-dragon fell. The city held. " +
      "For now.",
    annotation:
      "The ninth Ne-Yon is the Enigma. She chose wisely. The Oracle wielded the weapon beautifully. Everything " +
      "you saw happen here, happened. I am still watching.",
  },
  {
    transmissionId: "ep1-16",
    title: "XVII · Memento Dischordia",
    body:
      "A recap. An orientation. A reminder of the chain of events from the Fall to the City, so that we may stand " +
      "at the threshold of the next Epoch together, knowing what we have already lived through. Everything returns. " +
      "Every thread ties. 'Let the games begin' is not an opening line. It is an admission that the games have " +
      "been going on all along.",
    annotation:
      "Write nothing here. Let the silence do the work. Turn the page. Epoch 2 awaits.",
  },
];

/* ─── HELPERS ─── */

export function getJournalEntry(transmissionId: string): JournalEntry | undefined {
  return JOURNAL_ENTRIES.find(e => e.transmissionId === transmissionId);
}

export function getUnlockedJournalEntries(watchedTransmissionIds: string[]): JournalEntry[] {
  const watchedSet = new Set(watchedTransmissionIds);
  return JOURNAL_ENTRIES.filter(e => watchedSet.has(e.transmissionId));
}
