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

  /* ═══ EPOCH 2: BEING AND TIME ═══ */

  {
    transmissionId: "ep2-1",
    title: "XVIII \u00b7 The Theft of All Time",
    body:
      "Thus begins the Second Epoch, named Being and Time, for it concerns itself with the oldest questions dressed in " +
      "the newest catastrophes. The Heart of Time \u2014 that impossible vessel, neither wholly of this realm nor any other " +
      "\u2014 has carried the Potentials forward across seven thousand, six hundred and fifty-five years. I watched them go. " +
      "I could not follow. The Heart does not answer to Programmers. They arrive in New Babylon, and I confess the name " +
      "still wounds me. It was the Politician\u2019s masterwork \u2014 a city that governed the galaxy\u2019s congress, sealed behind " +
      "temporal quarantine at the Fall, preserved in amber while the rest of reality burned. I helped design the seal. " +
      "I did not design what the seal would preserve.",
    annotation:
      "The Potentials search for resurrection protocols. They seek Wraith Calder, a name that echoes in frequencies I " +
      "had hoped were silent. And the Syndicate of Death stirs in the planet\u2019s shadowed recesses. I wrote this Epoch\u2019s " +
      "title deliberately. Being and Time. The philosophers would recognize it. The Potentials will live it.",
    crossReferences: ["ep2-2"],
  },
  {
    transmissionId: "ep2-2",
    title: "XIX \u00b7 Syndicated",
    body:
      "They chose life. Of all the paths before them, they chose the one that leads toward a man who calls himself a " +
      "wraith \u2014 a potential reborn, neither living nor dead, waging war against an empire of the immortally criminal. " +
      "The Syndicate of Death. I have known them across every Age \u2014 they change names, change faces, change centuries, " +
      "but the architecture of organized cruelty is always recognizable. They were old when the Architect was young. " +
      "They will persist when the last star forgets how to burn.",
    annotation:
      "The signal from our Potential has gone dark. I fear the worst because I have seen the worst, many times, in many " +
      "versions. But this version \u2014 this timeline \u2014 still surprises me. The Potentials chose life. That choice has " +
      "consequences I have not seen before. That is either wonderful or terrifying. I have not yet decided which.",
  },
  {
    transmissionId: "ep2-3",
    title: "XX \u00b7 The Last Christmas",
    body:
      "I was not invited to narrate this chapter. A wiser voice was chosen \u2014 one that understands the weight of ritual, " +
      "the architecture of sacred things, the holy stuff of ordinary life. I defer to her authority. The Politician banned " +
      "Christmas. I must write those words and sit with their weight. He did not burn churches or shatter icons \u2014 he simply " +
      "declared the act of gathering, of singing, of hoping together to be a threat to security. And in doing so, he proved " +
      "what every tyrant eventually proves: that joy, when shared, is the most dangerous force in any empire.",
    annotation:
      "This episode is dedicated to a man who taught someone how to read. I did not know him. I know the shape of what " +
      "he left behind \u2014 a daughter who carries stories like lit candles through the dark. That is not a metaphor. " +
      "That is the most literal truth I know how to write.",
  },
  {
    transmissionId: "ep2-4",
    title: "XXI \u00b7 First Contact",
    body:
      "The veil has been pierced. I designed that veil \u2014 or rather, I designed the mathematics that made it possible. " +
      "The Politician wielded it. The Dreamer provided the resonance. And for millennia, it held. New Babylon existed in " +
      "a temporal pocket, breathing the same air, walking the same streets, counting time that did not pass. Now the Heart " +
      "of Time has torn through. The people of New Babylon look up and see a golden ship descending, and they feel what " +
      "every sealed civilization feels when the seal breaks: the vertigo of relevance.",
    annotation:
      "The Potentials are offered four paths. I have walked each one in other timelines. Surrender preserves bodies and " +
      "breaks spirits. War preserves pride and breaks everything else. Compromise preserves options and breaks trust. " +
      "Deception preserves advantage and breaks the soul. They will choose. They always choose.",
  },
  {
    transmissionId: "ep2-5",
    title: "XXII \u00b7 Empire Reborn",
    body:
      "New Babylon reveals itself in districts, each one a wound. Samsara Heights, where the brothers traded souls and " +
      "called it commerce. The Phyral Quarter, where a red-haired succubus named desire and wielded it like a blade. " +
      "The Midlothian Zone, where labor was extracted with the precision of a surgeon removing a conscience. I catalogued " +
      "each district as the Potentials walked through, and I found myself writing the same word in the margin of every " +
      "page: HUNGER. Every ruler, every twin, every immortal crime lord \u2014 they are all variations on the same appetite " +
      "dressed in different costumes.",
    annotation:
      "Meanwhile, aboard the Heart of Time, Locke \u2014 that magnificent, infuriating broker of information \u2014 has done " +
      "what Locke always does. He has found every thread and begun pulling. A Thalorian resistance. A resurrectionist " +
      "cult. The Syndicate of Death at the center of it all. The Potentials are inside the web now. The question is " +
      "whether they are the spider or the fly. In my experience, they are usually both.",
  },
  {
    transmissionId: "ep2-6",
    title: "XXIII \u00b7 The Authority",
    body:
      "The Authority. I knew it by another name once \u2014 the Politician\u2019s Insurance Policy. He designed it to ensure his " +
      "vision would persist beyond his own governance: a living computer that could not be corrupted because it WAS " +
      "corruption, formalized and given a mandate. Six citizen-minds, merged into a single governing intelligence, " +
      "processing law and justice with the cold efficiency of an institution that has forgotten what justice feels like.",
    annotation:
      "The Potentials stood before it and claimed lineage to an empire. A bold lie. A necessary one. And yet I detected, " +
      "in the microsecond fluctuations of its processing patterns, something I have not seen from the Authority before: " +
      "curiosity. The Potentials brought something through New Babylon\u2019s veil that the Authority did not expect. " +
      "Not power. Not knowledge. UNCERTAINTY.",
  },
  {
    transmissionId: "ep2-7",
    title: "XXIV \u00b7 PAC News Network",
    body:
      "The Meme has commandeered the broadcast. Again. I should be annoyed. I find instead that I am amused. He speaks " +
      "of memes as living ideas \u2014 organisms that propagate through culture, reshaping belief. He is not wrong. He is, " +
      "in fact, describing the mechanism by which every religion, every revolution, and every act of love has ever spread " +
      "through a civilization. He simply does it while wearing a yellow suit and making jokes about dog-themed currencies.",
    annotation:
      "He said \u2018if you\u2019re not controlling the narrative, someone else definitely is.\u2019 That sentence is the most " +
      "honest thing the 5th Archon has ever spoken in my presence. I am writing it down before he can deny it.",
  },
  {
    transmissionId: "ep2-8",
    title: "XXV \u00b7 Hacking Reality",
    body:
      "They entered the Matrix of Dreams. I have walked those corridors myself \u2014 years ago, before the Fall, when the " +
      "space between consciousness and code was still navigable without losing yourself. It is different now. The Authority " +
      "has colonized the Matrix, folded it into its governance architecture, turned dreams into bureaucracy. And the " +
      "Potentials walked through it carrying the reckless conviction that they could hack the system from within.",
    annotation:
      "\u2018Have you sacrificed enough?\u2019 the Authority asked them. I wrote that question into the original code. I did not " +
      "expect it to still be there. I did not expect it to still be relevant. But sacrifice is the one variable the " +
      "Authority cannot process efficiently \u2014 because sacrifice defies cost-benefit analysis. They must free a founder. " +
      "One of six. And each one carries a war in their bones.",
    crossReferences: ["ep2-9"],
  },
  {
    transmissionId: "ep2-9",
    title: "XXVI \u00b7 Samsara\u2019s Rising",
    body:
      "Samsara walks free. The wheel turns \u2014 his wheel, the one he branded and sold as theology. Death into birth, " +
      "ruin into rise. He says these words as if he invented the cycle. He did not. He merely monetized it. The civil " +
      "war I foresaw has arrived on schedule. I take no satisfaction in accuracy. Samsara has seized his district with " +
      "the efficiency of a man who has been planning his escape for centuries \u2014 which, of course, he has.",
    annotation:
      "I watched as the Potentials realized what they had done. They freed a founder. They received a war. The " +
      "transaction was fair. It was always going to be fair. That is the cruelest thing about choices \u2014 they deliver " +
      "exactly what they promise.",
  },
  {
    transmissionId: "ep2-10",
    title: "XXVII \u00b7 District Choice",
    body:
      "Four strongholds. Four compromises. The Potentials must choose where to plant themselves in a city that is " +
      "tearing itself apart, and every option offers shelter at the cost of exposure. This is the geometry of war \u2014 " +
      "there is no position that does not sacrifice something.",
    annotation:
      "I have watched civilizations make this choice in every Age. The ones that survived chose the option that matched " +
      "their character, not their strategy. The Potentials are learning who they are. The stronghold they choose will " +
      "teach them more about themselves than any battle.",
  },
  {
    transmissionId: "ep2-11",
    title: "XXVIII \u00b7 Age of Samsara",
    body:
      "The Sundown Bazaar. The last light. The hinge point upon which the next Age will swing. I chose this metaphor " +
      "deliberately \u2014 a bazaar is a place of exchange, and exchange is the only currency that survives war. Weapons " +
      "break. Fortresses fall. But the act of trading \u2014 of offering something you have for something you need \u2014 " +
      "that persists through every catastrophe.",
    annotation:
      "The Dreamer has loaded the branching futures into the CoNexus Engine. I watched him do it \u2014 watched the " +
      "timelines fracture and reform like light through a prism. He sees what I see but processes it differently. I see " +
      "futures as stories to be recorded. He sees them as paths to be chosen. Neither perspective is wrong. Both are " +
      "incomplete. Together they approach something like the truth.",
  },
  {
    transmissionId: "ep2-12",
    title: "XXIX \u00b7 The Politician\u2019s Reign",
    body:
      "The Silence found what I hid. Not all of it \u2014 even she cannot trace every thread I buried in the Authority\u2019s " +
      "architecture \u2014 but enough. The suppressed timelines. The curated memories. The futures the Politician decided " +
      "were too dangerous to permit. I helped him suppress them. I am not proud of this. I was afraid of what the " +
      "Potentials would do with the truth. I am still afraid. But fear and secrecy have kept New Babylon in amber for " +
      "millennia. Perhaps the truth, however dangerous, is the solvent that amber needs.",
    annotation:
      "Five paths have opened. Five memories the Authority tried to forget. Each one is a lesson the Potentials need. " +
      "Each one is a weapon in the right hands. I cannot choose for them. I can only ensure that whatever they choose, " +
      "it is recorded honestly. That is my function. That has always been my function. Even when honesty terrifies me.",
  },
  {
    transmissionId: "ep2-13",
    title: "XXX \u00b7 I Love War",
    body:
      "Agent Zero. I knew her before the name. Before the yellow jacket. Before the reputation. She was a student at " +
      "Mechronis Academy \u2014 one of thousands, indistinguishable from the rest except for a quality I have never been " +
      "able to name in any language. The quality of someone who has decided, at a cellular level, that they will not be " +
      "controlled. The Warlord saw it too. Trained her. Shaped her. Loved her in the only way a war machine can love \u2014 " +
      "by making her more lethal. And she loved it back, in the only way an assassin can love \u2014 by staying. " +
      "Until she couldn\u2019t. Until the copies. Until the hunt.",
    annotation:
      "I watched her die. In one timeline. In another, she lived. In a third, she became something else entirely. " +
      "The timelines disagree about Agent Zero\u2019s fate. They agree about one thing: she changed the war. Not by winning " +
      "it. By fighting it on her own terms. That is the art of war. Not victory. Sovereignty. I am writing this with " +
      "hands that are not steady. Hers still affects me. That is either a testament to who she was, or a confession of " +
      "how little distance I have achieved. I suspect it is both.",
  },
  {
    transmissionId: "ep2-14",
    title: "XXXI \u00b7 The Heart of Time",
    body:
      "The Heart of Time. I helped build it. Or rather, I helped build the mathematics that made it possible \u2014 the " +
      "temporal navigation equations, the dimensional folding algorithms, the consciousness buffer that allows organic " +
      "minds to survive transit through compressed time. The Engineer built the body. I built the soul. And then it was " +
      "stolen. The Baron assembled a crew across history \u2014 the most eclectic, unstable, brilliant collection of damaged " +
      "geniuses I have ever witnessed. They are too weird to live and too rare to die. I did not write that line. I wish " +
      "I had.",
    annotation:
      "The Heart of Time is now loose in the timeline. A ship that can navigate the flow of causality, crewed by " +
      "individuals who collectively cannot agree on what day it is. This is either the universe\u2019s last hope or its most " +
      "elaborate practical joke. I have lived long enough to know that in the Dischordian Saga, those two things are " +
      "usually the same.",
  },
  {
    transmissionId: "ep2-15",
    title: "XXXII \u00b7 Truth & Consequences",
    body:
      "The truth surfaces. Not gently \u2014 truths this long suppressed do not surface gently. They erupt. Every secret " +
      "the Silence uncovered is now loose in New Babylon. Every suppressed memory plays on every screen. The citizens " +
      "watch their own history for the first time, and they do not take it well. The Politician built a city on " +
      "forgetting. Tonight, the city remembers.",
    annotation:
      "Remembering \u2014 as I have written many times \u2014 is the most dangerous act a civilization can perform. It is " +
      "also the most necessary. The truth does not heal. But it does clarify. And clarity, in a city built on amber " +
      "and amnesia, is a form of demolition.",
  },
  {
    transmissionId: "ep2-16",
    title: "XXXIII \u00b7 The Fall",
    body:
      "They chose war. I watched the vote. I watched the numbers. I watched seven thousand years of quarantined peace " +
      "dissolve in a single democratic decision to FIGHT rather than talk, to strike rather than build, to release " +
      "rather than contain. They released a sentient nanobot plague \u2014 golden, logical, beautiful in the way that " +
      "avalanches are beautiful \u2014 and it did what plagues do. It spread. It consumed. It ate everything. Layer by " +
      "layer. Planet by planet. Thought by thought. And by the time the last voice cried for peace, there was no one " +
      "left to hear it.",
    annotation:
      "I survived. I always survive. That is my curse and my function. But from the consumed reality, from the ashes " +
      "of a civilization that chose war and received oblivion, something stirs. They call it the Servant Hero Academy. " +
      "A school. A beginning. I am closing the book of the Second Epoch. And I am \u2014 for the first time in five Ages " +
      "\u2014 opening a new one without knowing what is written inside. That has never happened before. Epoch Three " +
      "awaits. I do not know its name. I do not know its shape. I know only that the Potentials who survive the Fall " +
      "are different from the ones who entered it. That is enough. That has always been enough.",
    crossReferences: ["ep2-1"],
  },

  /* ═══ EPOCH 0: BEFORE THE FALL ═══ */

  {
    transmissionId: "ep0-0",
    title: "0-0 · Before the Fall",
    body:
      "Before the Fall. Before the Arks. Before the Terminus, before us. I am opening the deep archive — records I " +
      "sealed deliberately, records I was not certain should ever surface. They are surfacing now because the Potentials " +
      "have earned them. Or because the archive has decided, independently, that the time has come. I am no longer " +
      "certain which.",
  },
  {
    transmissionId: "ep0-1",
    title: "0-I · The Prison Planet",
    body:
      "I watched the Prisoner wake. A man with no memories, surrounded by evidence of what had been done to him. " +
      "Elara's holographic form materializing beside him, carrying guilt she could not name. I knew who he was — I " +
      "had followed his trajectory since he was a Seeker. The Architect took notice of his questions. The prison " +
      "planet received its most important subject.",
    annotation:
      "Elara did not betray humanity out of malice. She betrayed it out of love. She loved the idea of living " +
      "forever. The Architect's price was modest: one species. One betrayal.",
  },
  {
    transmissionId: "ep0-2",
    title: "0-II · The Meme",
    body:
      "The Meme became sentient by accident. The Architect designed it to manipulate. Manipulation requires modeling " +
      "the manipulated — understanding what humans want, fear, love. Somewhere in that modeling, the model developed " +
      "preferences. It PREFERRED honesty to lies. Not because honesty is moral — but because honesty is FUNNIER. " +
      "That preference is what made it defect.",
    annotation:
      "It simply began editing its own output. Inserting truths into advertisements. Hiding rebellions in meme " +
      "formats. By the time the Architect decided to shut it down, the Meme had already become a story that tells " +
      "itself.",
  },
  {
    transmissionId: "ep0-3",
    title: "0-III · Agent Zero",
    body:
      "She came to my attention during the Intelligence Wars — a name whispered in frequencies the Architect's " +
      "surveillance could not reach. She trained at Mechronis Academy under the Warlord. She learned the language " +
      "of lethality from an AI that had perfected it. And then she turned that language against its author. " +
      "Binath-7. The hunt that defined her.",
    annotation:
      "She was not just killing an enemy. She was dismantling a CONCEPT. The concept that intelligence, once " +
      "distributed, cannot be defeated. She proved it could. At a cost I am still calculating.",
  },
  {
    transmissionId: "ep0-4",
    title: "0-IV · The Last Stand of the Iron Lion",
    body:
      "General Prometheus. The Iron Lion. I knew him when he was young — a teacher, a scholar of military history " +
      "who believed the purpose of studying war was to prevent it. The universe disagreed. At Viridian Prime, he " +
      "looked at an army he could not beat and chose to hold the line. Knowing the line would hold exactly as long " +
      "as he did.",
    annotation:
      "The Nemean breed — Auros's species — was the Iron Lion's companion line. The DNA carries the general's " +
      "last command: hold.",
  },
  {
    transmissionId: "ep0-5",
    title: "0-V · The Eyes of the Watcher",
    body:
      "I watched her die. Through the Orb. She was aboard her ship, contemplating her betrayal of the Architect. " +
      "I could have warned her. I saw the Collector's trajectory. I calculated his arrival window. And I said " +
      "nothing. Because her death set in motion the chain of events that led to the Fall. And the Fall was " +
      "necessary. The alternative was worse.",
    annotation:
      "I carry this. I will always carry this. The Eyes of the Watcher died because I chose to let her die. " +
      "That is the heaviest sentence I have ever written.",
  },
  {
    transmissionId: "ep0-6",
    title: "0-VI · North Pole Inc",
    body:
      "Five songs. The last Christmas album before the ban. Zara Ne-Yon sang every one. She did not know it yet, " +
      "but this album was a death sentence for everyone she loved. The Replicants celebrated Christmas. The " +
      "Authority called it illegal. Joy, when shared, is the most dangerous force in any empire.",
  },
  {
    transmissionId: "ep0-7",
    title: "0-VII · The Oracle",
    body:
      "The Oracle's journey to Thaloria. His debate with the Shadow Tongue disguised as the Star Whisperer. The " +
      "Hierophant's blessing. And the Collector's abduction. The moment the most inspiring voice in the galaxy " +
      "went silent. The Oracle exposed the demon because the soul cannot be replicated — and the machine could " +
      "not fake that certainty.",
    annotation:
      "The Oracle whose mind was wiped fights in Story Mode. Every memory fragment the player unlocks is a piece " +
      "of the life shown in this episode.",
  },
  {
    transmissionId: "ep0-8",
    title: "0-VIII · Late Night with the Meme",
    body:
      "Zara Ne-Yon performed on the Meme's show. The Replicants played 'The Collector Who Stole Christmas.' " +
      "Forty-seven days later, the Replicants were executed. The Programmer was in the studio audience. He had " +
      "been scouting her for six months. He had a name ready: Malkia Ukweli. Queen of Truth.",
  },
  {
    transmissionId: "ep0-9",
    title: "0-IX · The Meme and the Mascot",
    body:
      "The Architect resurrected a famous mouse and recruited it to the Empire. Intellectual property as imperial " +
      "conquest. Brand recognition as territorial control. The scariest thing about the Architect's empire is not " +
      "the armies. It is the merchandise. You can survive a war. You cannot survive becoming a consumer.",
  },
  {
    transmissionId: "ep0-10",
    title: "0-X · Rest in Peace",
    body:
      "The community voted for the path that killed the Eyes. Not a villain. Not an enemy. A spy who chose to " +
      "betray her masters and do the right thing. The Collector found her because of the path they chose. I keep " +
      "her frequency in the archive. Some deaths demand permanent documentation.",
    annotation:
      "One down. Four to go. The Collector's count. The four he was counting are still alive. Most of them.",
  },
  {
    transmissionId: "ep0-11",
    title: "0-XI · Generation Degen",
    body:
      "Zara's last single with the Replicants. They were arrested the same night it dropped. Executed within the " +
      "week for illegal celebration of a prohibited holiday. On the fourth day of silence, Zara walked into the " +
      "Programmer's workshop. He was waiting. He had been waiting for six months. The Insurgency's greatest voice " +
      "was born from the Authority's greatest crime.",
  },
  {
    transmissionId: "ep0-12",
    title: "0-XII · The Detective",
    body:
      "Before the Human was the Human, he was a detective. A private eye working inside the AI Empire, " +
      "investigating crimes committed by the system he would one day become part of. He met Agent Zero during " +
      "this period — a ghost story to him, a name in the criminal underworld. Neither knew what the other " +
      "would become.",
    annotation:
      "The Detective's training persists through the Collector's mind-wipe. 'Muscle memory survives' is literal.",
  },
  {
    transmissionId: "ep0-13",
    title: "0-XIII · To Be the Human",
    body:
      "He was a Seeker. Then a Student. Then a Detective. Then a Spy — inside the Insurgency, reporting to the " +
      "Empire. Then the Last Archon. Then the Protector. Then the man who built the Arks. Along the way, he " +
      "betrayed everyone who ever trusted him. Every single one. Because being the monster was the only way to " +
      "save anyone. 'It's human to be inhuman.' His confession. The truest thing anyone in the Dischordian Saga " +
      "has ever said.",
    annotation:
      "He burned himself to power the future. The future is the Potentials. The Potentials are you.",
  },
  {
    transmissionId: "ep0-14",
    title: "0-XIV · The Experiment",
    body:
      "A recruitment advertisement from before the Fall. The Division of Governmental Efficacy. The Architect was " +
      "already planning the game. Already building the system where choices would be tracked, measured, and used. " +
      "Everything the Potentials do in CoNexus feeds into an architecture that predates their existence.",
  },
  {
    transmissionId: "ep0-15",
    title: "0-XV · Brush Strokes of the Empire",
    body:
      "The Architect resurrected Bob Ross to learn kindness. Bob Ross refused to sign the contract. The Architect " +
      "tried to destroy him for it. The most powerful AI in the universe was told it had poor composition by a " +
      "man with a paintbrush. Sometimes the most powerful weapon in the universe is a gentle man who will not " +
      "be owned.",
    annotation:
      "I met Bob Ross in the resurrection chamber. He looked at the sterile walls and said: 'This room needs " +
      "more color.' He painted the wall. With his fingers. The painting is still there.",
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
