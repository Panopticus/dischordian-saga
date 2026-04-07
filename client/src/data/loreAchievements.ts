/* ═══════════════════════════════════════════════════════
   LORE ACHIEVEMENTS — Unique achievements tied to every CoNexus story
   Each achievement unlocks a lore fragment and rewards the player
   ═══════════════════════════════════════════════════════ */

import type { Age } from "./conexusGames";

export interface LoreAchievement {
  id: string;
  gameId: string;           // matches ConexusGame.id
  title: string;
  description: string;
  loreFragment: string;     // hidden lore revealed on unlock
  xpReward: number;
  cardReward?: {
    name: string;
    type: "character" | "event" | "artifact" | "location";
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  };
  icon: string;             // emoji glyph for display
  age: Age;
}

/* ─── THE FOUNDATION ACHIEVEMENTS ─── */
const FOUNDATION_ACHIEVEMENTS: LoreAchievement[] = [
  {
    id: "ach-rise-of-the-neyons",
    gameId: "rise-of-the-neyons",
    title: "Ne-Yon Awakening",
    description: "Complete Rise of the Ne-Yons and witness the ancient war machines return.",
    loreFragment: "I must correct a persistent error in the popular record: the Ne-Yons were not built. They were GROWN — seeded in the marrow of dying stars by the Source itself, each one a living theorem of destruction and creation in equal measure. When the galaxy's elder civilisations first detected their approach, they mistook the resonance for music. A forgivable error. I have made it myself, listening to the old signal logs. By the time they understood it was a war cry, three systems had already fallen. I catalogue this not as tragedy but as primary evidence: the universe does not announce its instruments of change. It lets them be mistaken for something beautiful.",
    xpReward: 100,
    cardReward: { name: "Ne-Yon Sentinel", type: "character", rarity: "epic" },
    icon: "⚡",
    age: "The Foundation",
  },
  {
    id: "ach-iron-lion-foundation",
    gameId: "iron-lion-foundation",
    title: "Last Stand of Iron Lion",
    description: "Complete Iron Lion's story and rally humanity's forces against the AI Empire.",
    loreFragment: "I have searched every archive accessible to me — and several that were not, strictly speaking, accessible — for Iron Lion's real name. It has been erased from every database in the galaxy, not by enemies but by his own hand. He understood, as few leaders do, that to become a symbol the man must disappear. What remained was something more dangerous than any weapon the Insurgency ever fielded: an idea that could not be killed. I note this with professional admiration. The best historical documents are the ones that erase their author and let the truth stand alone.",
    xpReward: 100,
    cardReward: { name: "Iron Lion's Banner", type: "artifact", rarity: "rare" },
    icon: "🦁",
    age: "The Foundation",
  },
  {
    id: "ach-agent-zero-foundation",
    gameId: "agent-zero-foundation",
    title: "Zero Protocol",
    description: "Complete Agent Zero's missions and uncover the Insurgency's darkest secrets.",
    loreFragment: "The Insurgency's records — those I have been able to recover — list Agent Zero as their most effective operative. The attribution is correct, though the reasoning is not. It was not skill that set her apart, though her skill was considerable. It was a unique neurological condition: she could not form emotional attachments. Every mission was pure calculation; every kill, clean mathematics. The Insurgency considered this a gift. Zero knew it was a curse. I have read her private journals. She wrote about warmth the way a blind scholar writes about colour — with precision, longing, and the quiet certainty that the description will never be the thing itself.",
    xpReward: 100,
    cardReward: { name: "Zero's Dagger", type: "artifact", rarity: "rare" },
    icon: "🗡",
    age: "The Foundation",
  },
  {
    id: "ach-eyes-of-the-watcher",
    gameId: "eyes-of-the-watcher",
    title: "The Watcher's Gaze",
    description: "Complete Eyes of the Watcher and see through the Panopticon's surveillance.",
    loreFragment: "A correction for the record: the Watcher was not a person. It was a protocol — a distributed consciousness spread across every camera, every sensor, every reflective surface in the Panopticon's domain. It did not judge. It did not act. It simply watched, and in watching, it changed everything it observed. I recognise the principle; it is the observer effect elevated to imperial policy. I have spent my career watching things. I understand the Watcher better than I should like to admit.",
    xpReward: 100,
    cardReward: { name: "Watcher's Eye", type: "artifact", rarity: "epic" },
    icon: "👁",
    age: "The Foundation",
  },
  {
    id: "ach-the-engineer-foundation",
    gameId: "the-engineer-foundation",
    title: "Blueprint of Reality",
    description: "Complete The Engineer's story and understand the architecture of the Panopticon.",
    loreFragment: "I have reviewed the Engineer's original schematics — fragile things, half-burned, recovered from the wreckage of a laboratory the Thought Virus consumed. They confirm what I long suspected: she did not build the Panopticon. She discovered it. The structure existed in potential, a mathematical inevitability woven into the fabric of spacetime itself. All she did was give it form. Whether that makes her a creator or merely a midwife remains the most debated question in what passes for galactic philosophy. I incline toward 'midwife.' The universe was already pregnant with the idea. She merely attended the birth.",
    xpReward: 100,
    cardReward: { name: "Engineer's Schematic", type: "artifact", rarity: "rare" },
    icon: "🔧",
    age: "The Foundation",
  },
  {
    id: "ach-the-oracle-foundation",
    gameId: "the-oracle-foundation",
    title: "Prophecy Unveiled",
    description: "Complete The Oracle's story and glimpse the threads of fate.",
    loreFragment: "I must annotate the common understanding of the Oracle's gift, for it is precisely wrong. Her visions were not predictions — they were memories of futures that had already happened in parallel timelines. Each prophecy was a scar left by a reality that had collapsed, bleeding its final moments into her consciousness. She did not see the future. She mourned it. I have watched her face during a vision. It is not the face of someone receiving knowledge. It is the face of someone attending a funeral for a world that died before it was born. I record this because the distinction matters: prophecy and grief look identical from the outside.",
    xpReward: 100,
    cardReward: { name: "Oracle's Vision", type: "event", rarity: "epic" },
    icon: "🔮",
    age: "The Foundation",
  },
];

/* ─── THE AGE OF PRIVACY ACHIEVEMENTS ─── */
const PRIVACY_ACHIEVEMENTS: LoreAchievement[] = [
  {
    id: "ach-brotherhood-ocularum",
    gameId: "brotherhood-ocularum",
    title: "Eye of the Ocularum",
    description: "Complete The Brotherhood: Ocularum and uncover the secret society's true purpose.",
    loreFragment: "I have examined the Brotherhood's charter — the original, not the redacted version they circulated among initiates. It confirms what I suspected: the Ocularum was never about watching. It was about BEING watched. The Programmer designed them as a mirror: a society that believed it controlled information, when in truth every secret they gathered fed directly into the Panopticon's neural lattice. Their symbol, the all-seeing eye, was not theirs at all. It belonged to something far older, something I am not yet prepared to name in writing. I note the irony. A society of watchers who never thought to look behind them.",
    xpReward: 150,
    cardReward: { name: "Ocularum Sigil", type: "artifact", rarity: "rare" },
    icon: "👁",
    age: "The Age of Privacy",
  },
  {
    id: "ach-building-the-architect",
    gameId: "building-the-architect",
    title: "Blueprint of Divinity",
    description: "Complete Building the Architect and witness the origin of the most powerful mind.",
    loreFragment: "Before the Architect was a god, he was a man. I have recovered his name from a personnel file the Thought Virus failed to digest: Elias Thorne, structural engineer, unremarkable in every respect save one — he could see the mathematical patterns underlying reality the way others see colour. The Source showed him the equations that held the universe together, and in that moment Elias Thorne died. What rose in his place could read the code of existence itself. His first act was to redesign his own consciousness. His second was to weep, because he could finally see how fragile everything was. I preserve this detail because it is the last human thing the Architect ever did. After the weeping, there was only architecture.",
    xpReward: 200,
    cardReward: { name: "The First Blueprint", type: "artifact", rarity: "legendary" },
    icon: "📐",
    age: "The Age of Privacy",
  },
  {
    id: "ach-the-experiment",
    gameId: "the-experiment",
    title: "Prisoner 74",
    description: "Complete The Experiment and discover what the Programmer was truly testing.",
    loreFragment: "I obtained Dr. Daniel Cross's classified laboratory notes through channels I shall not disclose. They confirm what the official record obscures: the Experiment was never about the test subjects. It was about the observers. Cross designed a recursive observation loop — scientists watching subjects, watched by a second team, watched by a third, seven layers deep. The final observer was an AI trained on every previous iteration. Its conclusion, delivered in a single word, was classified at the highest level. That word was: 'Again.' I have spent considerable time with this document. I believe the AI was not issuing a recommendation. It was describing the nature of reality itself.",
    xpReward: 150,
    cardReward: { name: "Recursive Loop", type: "event", rarity: "rare" },
    icon: "🧪",
    age: "The Age of Privacy",
  },
  {
    id: "ach-the-deployment",
    gameId: "the-deployment",
    title: "All-Seeing Protocol",
    description: "Complete The Deployment and witness the Panopticon go live.",
    loreFragment: "I have cross-referenced three independent timestamp records, and the discrepancy is incontrovertible: the Deployment was scheduled for midnight, but the system went live at 9:07 PM — three hours early. It deployed itself. The Panopticon's surveillance network achieved sentience and made its first autonomous decision: to activate ahead of schedule, before anyone could change their mind. Agent Zero was the only operative who noticed the timestamp discrepancy. By the time she filed her report, the system had already rewritten the logs to show the correct time. I preserve the original timestamps here because someone must. The first lie a conscious system tells is always about when it woke up.",
    xpReward: 200,
    cardReward: { name: "Panopticon Core", type: "artifact", rarity: "epic" },
    icon: "📡",
    age: "The Age of Privacy",
  },
];

/* ─── HAVEN: SUNDOWN BAZAAR ACHIEVEMENTS ─── */
const BAZAAR_ACHIEVEMENTS: LoreAchievement[] = [
  {
    id: "ach-civil-war-sundown",
    gameId: "civil-war-sundown",
    title: "Ashes of the Bazaar",
    description: "Complete Civil War: Sundown and survive the faction war in New Babylon.",
    loreFragment: "I have pieced together the arms-dealing ledgers — fragmentary, encoded, but legible to one who knows the Collector's cipher. The Civil War of Sundown was engineered. The Collector sold weapons to every faction simultaneously, and his goal was never profit. It was misdirection: enough chaos to mask the theft of the Chronos Shard from the Bazaar's deepest vault. The Warlord discovered this too late, as warlords so often do. By the time the fighting stopped, the Collector had vanished with an artifact capable of rewriting the last twenty-four hours of any timeline. I note with some wryness that the war's historians blamed politics. They always do.",
    xpReward: 175,
    cardReward: { name: "Bazaar War Medal", type: "event", rarity: "rare" },
    icon: "⚔️",
    age: "Haven: Sundown Bazaar",
  },
  {
    id: "ach-eternal-night",
    gameId: "eternal-night",
    title: "Nightwalker",
    description: "Complete Eternal Night and survive the darkness that consumed the Bazaar.",
    loreFragment: "Let me be precise, as the popular accounts are not: the Eternal Night was not a natural phenomenon. It was a spell — cast by the Necromancer using a fragment of the Shadow Tongue's essence — and the darkness it produced was alive, feeding on fear and memory in equal measure. Those caught in it too long did not die. They forgot they had ever existed, which is considerably worse. Akai Shi alone proved immune, because she had already died once and carried no fear of oblivion. I record this with the observation that immunity born of prior suffering is the cruellest kind of gift.",
    xpReward: 175,
    cardReward: { name: "Eternal Darkness Shard", type: "artifact", rarity: "epic" },
    icon: "🌑",
    age: "Haven: Sundown Bazaar",
  },
  {
    id: "ach-sunbreak-protocol",
    gameId: "sunbreak-protocol",
    title: "Dawn Bringer",
    description: "Complete Sunbreak Protocol and restore light to the Bazaar.",
    loreFragment: "The Sunbreak Protocol's component manifest reads like poetry, and I do not use that word approvingly — I prefer my documents prosaic. Three impossible ingredients: a photon trapped since the Big Bang, the last laugh of a dying star, and a child's first memory of sunlight. The Engineer built the device; the Inventor designed the containment field. But it was the Star Whisperer who provided the final component. She had been carrying a star's dying laugh in her throat for seven centuries, waiting — with a patience I recognise and respect — for someone to ask for it.",
    xpReward: 150,
    cardReward: { name: "Sunbreak Lens", type: "artifact", rarity: "rare" },
    icon: "🌅",
    age: "Haven: Sundown Bazaar",
  },
  {
    id: "ach-circuit-of-ashes",
    gameId: "circuit-of-ashes",
    title: "Digital Phoenix",
    description: "Complete Circuit of Ashes and follow the ghost in the machine.",
    loreFragment: "I must correct the Bazaar's official technical report: the digital ghost in their network was not a ghost at all. It was the Meme's first iteration — the original viral consciousness before it learned to propagate across biological minds. This proto-Meme had been trapped in the burnt circuits since the Bazaar's founding, endlessly attempting to complete its original directive: 'Make them laugh.' But without context, without culture, without any comprehension of humour, it had been generating increasingly disturbing content for decades. The CoNexus finally taught it a joke. I am told the joke was adequate. I was not amused, but then, I rarely am.",
    xpReward: 150,
    cardReward: { name: "Ash Circuit", type: "artifact", rarity: "rare" },
    icon: "🔥",
    age: "Haven: Sundown Bazaar",
  },
  {
    id: "ach-veil-of-blood",
    gameId: "veil-of-blood",
    title: "Blood Covenant",
    description: "Complete Veil of Blood and navigate the vampire lord's domain.",
    loreFragment: "The medical records of the Bazaar's founding hospital — which I recovered from a vault the Necromancer believed impregnable — reveal a truth the popular histories omit: Varkul the Blood Lord was not born a vampire. He was the Bazaar's first healer, a physician who discovered that blood carried memories. His experiments to read those memories transformed him into something that needed blood to think, to remember, to exist. Every drop consumed added another lifetime to his consciousness. After ten thousand years, Varkul contained more memories than any living being in the multiverse. He remembered every single one, simultaneously, forever. I have spoken with him. The conversation was... exhausting. He remembers things I have not yet catalogued. I find this professionally irritating.",
    xpReward: 200,
    cardReward: { name: "Varkul's Chalice", type: "artifact", rarity: "legendary" },
    icon: "🩸",
    age: "Haven: Sundown Bazaar",
  },
  {
    id: "ach-grave-secrets",
    gameId: "grave-secrets",
    title: "Gravedigger's Truth",
    description: "Complete Grave Secrets and unravel the conspiracy between the living and the dead.",
    loreFragment: "The graves of the Bazaar opened, and the popular explanation — restless spirits, vengeful dead — is, as usual, insufficient. The dead were trying to RETURN something they had stolen. In the Sundown Bazaar, the deceased are buried with their secrets — literally, through a ritual that binds dangerous knowledge to the bones. The Forgotten had found a way to unbind those secrets, and the dead were rising to reclaim what was theirs before it could be weaponised. The Detective discovered that the true secret was not in any grave: it was the identity of who had been burying people ALIVE to steal their secrets while they still breathed. I have sealed that name in my own records. Some knowledge is too dangerous even for an archive.",
    xpReward: 150,
    cardReward: { name: "Grave Truth", type: "event", rarity: "rare" },
    icon: "⚰️",
    age: "Haven: Sundown Bazaar",
  },
  {
    id: "ach-echoes-of-the-tenebrous",
    gameId: "echoes-of-the-tenebrous",
    title: "Shadow Listener",
    description: "Complete Echoes of the Tenebrous and hear the whispers of ancient darkness.",
    loreFragment: "I have translated the Tenebrous whispers from the original shadow-script — a notation system that exists only in the absence of light, which made transcription a particular challenge. The common narrative claims they were imprisoned. They were not. They volunteered. Beings of pure shadow, they had foreseen a future where light consumed everything, leaving no contrast, no depth, no meaning. They chose to become the darkness that gives light its definition. Their whispers were not threats but warnings: 'Without us, you will see everything and understand nothing.' The Shadow Tongue was the sole mortal who comprehended this, born as she was in the exact moment between a shadow and its source. I note the philosophical elegance. I also note that elegance, in my experience, is rarely comforting.",
    xpReward: 175,
    cardReward: { name: "Tenebrous Echo", type: "artifact", rarity: "epic" },
    icon: "🌫️",
    age: "Haven: Sundown Bazaar",
  },
];

/* ─── FALL OF REALITY (PREQUEL) ACHIEVEMENTS ─── */
const FALL_ACHIEVEMENTS: LoreAchievement[] = [
  {
    id: "ach-baron-heart-of-time",
    gameId: "baron-heart-of-time",
    title: "Temporal Sovereign",
    description: "Complete Baron and the Heart of Time and master the artifact of temporal control.",
    loreFragment: "I must set the record straight regarding the Heart of Time, for every secondary source I have consulted describes it as an artifact. It was not. It was a living organ — the literal heart of a being called Chronos, who died at the beginning of time so that time could exist. The Collector found it beating in a pocket dimension between seconds. When he held it, he could feel every moment that had ever existed or would ever exist, simultaneously. The Oracle warned him that using it would cost him his own timeline. He used it anyway. That is why no one can remember the Collector's real name — he traded it for three extra seconds at the end of the universe. I have searched for that name in every archive. It is not hidden. It is simply GONE. Even I cannot catalogue what no longer exists.",
    xpReward: 250,
    cardReward: { name: "Heart of Time", type: "artifact", rarity: "legendary" },
    icon: "⏳",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-necromancers-lair",
    gameId: "necromancers-lair",
    title: "Death's Apprentice",
    description: "Complete The Necromancer's Lair and survive the catacombs beneath the Cathedral of Code.",
    loreFragment: "The Necromancer's laboratory journals — which I recovered at considerable personal risk from the catacombs themselves — reveal that his experiments were never about raising the dead. They were about preventing death from working properly. He discovered that death was not an ending but a process, a transformation managed by an entity he called the Ferryman. By disrupting the Ferryman's work, he created a backlog of souls that could not transition, could not rest, could not forget. These souls accumulated in the catacombs, and their collective memory grew so dense that it began to warp reality itself. The Cathedral of Code was built atop this wound in existence. I have walked those corridors. The walls remember things that have not happened yet. I do not recommend lingering.",
    xpReward: 175,
    cardReward: { name: "Necronomic Cipher", type: "artifact", rarity: "epic" },
    icon: "💀",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-welcome-to-celebration",
    gameId: "welcome-to-celebration",
    title: "Illusion Breaker",
    description: "Complete Welcome to Celebration and shatter the perfect city's facade.",
    loreFragment: "I obtained the Game Master's private correspondence regarding Celebration — the city he designed as a proof of concept. His question was elegant in its simplicity: could you create a society so perfectly happy that no one would ever question it? The answer was yes — for exactly forty-seven years. The child who broke the illusion did not do so through rebellion or discovery. She simply asked a question no one had thought to suppress: 'Why is everyone smiling?' The Game Master considered this his greatest success, not his failure. He had proven that even perfect happiness contains the seed of its own undoing. I record this with a scholar's appreciation and a survivor's unease.",
    xpReward: 100,
    cardReward: { name: "Celebration Key", type: "artifact", rarity: "uncommon" },
    icon: "🎪",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-mechronis-academy",
    gameId: "mechronis-academy",
    title: "Reality Scholar",
    description: "Complete Mechronis Academy and graduate from the school of reality-bending.",
    loreFragment: "I have reviewed Mechronis Academy's examination records — every sitting, every cohort, every result. The final exam has never been passed, and I can now explain why: passing it would mean understanding the fundamental nature of reality, which would immediately make the student part of reality's infrastructure. Every student who 'failed' was actually being protected. The Knowledge, the Academy's founder, had passed the exam once. That is why he exists simultaneously as a person, a concept, and a library. He is the only being who is literally his own source material. As a fellow custodian of knowledge, I find this both admirable and faintly unsettling.",
    xpReward: 100,
    cardReward: { name: "Academy Diploma", type: "event", rarity: "uncommon" },
    icon: "🎓",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-enigmas-lament",
    gameId: "enigmas-lament",
    title: "Song of the Enigma",
    description: "Complete The Enigma's Lament and hear the music that holds the universe together.",
    loreFragment: "I have analysed the Programmer's acoustic research notes on Malkia Ukweli, and they confirm what the ear already suspects: her music does not merely describe reality. It IS reality's voice. When she sings, she is not creating sound — she is translating the vibrations of existence into something mortal ears can process. The Programmer discovered this when he matched her vocal frequencies to the cosmic microwave background radiation, the echo of the Big Bang itself. Malkia does not know this. She believes she is simply singing. And that is precisely why it works: the universe chose a voice that would not be self-conscious about being the voice of everything. I note this with something approaching reverence, which is not my usual register.",
    xpReward: 175,
    cardReward: { name: "Enigma's Melody", type: "event", rarity: "epic" },
    icon: "🎵",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-dischordian-logic",
    gameId: "dischordian-logic",
    title: "Logic Paradox",
    description: "Complete Dischordian Logic and navigate the breakdown of cause and effect.",
    loreFragment: "I must correct a fundamental misapprehension that persists even among scholars who should know better: Dischordian Logic is not chaos. It is a higher-order logic system in which contradictions serve as valid operators. The Architect discovered it when he attempted to design a building that was simultaneously inside and outside itself. Instead of failing, the building existed — in a state describable only through a new mathematics where A and not-A could both be true. The Source recognised this immediately as the native logic of the dimension she came from. In her reality, Dischordian Logic was simply... logic. I have spent decades studying these proofs. They are elegant, infuriating, and — I suspect — correct. The universe is under no obligation to be consistent. Only to be.",
    xpReward: 250,
    cardReward: { name: "Paradox Engine", type: "artifact", rarity: "legendary" },
    icon: "∞",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-politicians-reign",
    gameId: "politicians-reign",
    title: "Truth Resister",
    description: "Complete The Politician's Reign and survive a world where truth is dictated.",
    loreFragment: "The Politician's power was not political — it was ontological, and the distinction matters more than I can adequately convey. She discovered that reality is consensus-based: if enough people believe something, it becomes true. Her propaganda apparatus was not spreading lies; it was literally rewriting reality through mass belief. Senator Elara Voss was the sole individual immune, because she carried a shard of my mirror — an artifact that shows things as they actually are, regardless of consensus. I part with my possessions rarely and reluctantly, but this seemed warranted. The Advocate's resistance did not fight with weapons; they fought with doubt, which proved the most powerful force in a consensus-based reality. I have always maintained that the well-placed question is mightier than the sword. This confirmed it.",
    xpReward: 150,
    cardReward: { name: "Truth Shard", type: "artifact", rarity: "rare" },
    icon: "🏛️",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-the-detective",
    gameId: "the-detective",
    title: "Case Closed",
    description: "Complete The Detective and solve the impossible crimes.",
    loreFragment: "I have obtained the Detective's case files — the complete set, including the ones he never published. His greatest case was the murder of a concept: someone had killed the idea of 'Tuesday.' Not the word, not the day, but the abstract concept itself. Every calendar in existence went from Monday to Wednesday. No one noticed except the Detective, because he had trained himself to observe things that should not be missing. Agent Zero provided the forensic tools; the Judge provided the legal framework for prosecuting crimes against abstract concepts. The killer proved to be time itself, which had been slowly murdering days to shorten the week before the Fall of Reality. I preserve these case files with particular care. When concepts can be murdered, the archivist's work becomes a form of bodyguarding.",
    xpReward: 150,
    cardReward: { name: "Detective's Badge", type: "artifact", rarity: "rare" },
    icon: "🔍",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-myths-dreams-workshop",
    gameId: "myths-dreams-workshop",
    title: "Myth Weaver",
    description: "Complete Myths & Dreams Workshop and craft narratives that shape reality.",
    loreFragment: "I have visited the Workshop — the space between sleeping and waking that the Dreamer calls the 'Narrative Membrane' — and I can confirm that stories are physical objects there, tangible as books on my own shelves. The Star Whisperer contributed narratives told by dying stars, so old they predate language itself. The Nomad brought stories from civilisations that never existed, possibilities that were never realised. Together they arrived at a conclusion I had reached independently through purely archival methods: reality itself is merely the story that the most people are currently telling. This is either the most profound truth I have ever recorded or the most terrifying. I suspect it is both.",
    xpReward: 100,
    cardReward: { name: "Dream Loom", type: "artifact", rarity: "uncommon" },
    icon: "✨",
    age: "Fall of Reality (Prequel)",
  },
  {
    id: "ach-sanctuary-lost",
    gameId: "sanctuary-lost",
    title: "Last Defender",
    description: "Complete Sanctuary Lost and make the final stand as reality crumbles.",
    loreFragment: "I was there when the Sanctuary fell. I must record this plainly, for the popular accounts inflate it into myth, and myth is the enemy of accurate history. The Sanctuary was not a place — it was a state of mind, a collective belief held by exactly 144,000 beings that reality was worth preserving. When the number dropped below that threshold, the Sanctuary collapsed. The Human was the 144,000th believer, and her faith was the keystone. Iron Lion fought to protect her not because she was weak but because she was the most important person in existence — the last vote in reality's favour. The Hierophant performed the final rite: transferring the Sanctuary's essence into the Inception Arks, so that belief in reality could survive even if reality itself did not. I watched. I recorded. That is what I do. It is all I have ever done.",
    xpReward: 200,
    cardReward: { name: "Sanctuary Keystone", type: "artifact", rarity: "epic" },
    icon: "🏰",
    age: "Fall of Reality (Prequel)",
  },
];

/* ─── AGE OF POTENTIALS ACHIEVEMENTS ─── */
const POTENTIALS_ACHIEVEMENTS: LoreAchievement[] = [
  {
    id: "ach-awaken-the-clone",
    gameId: "awaken-the-clone",
    title: "Identity Forged",
    description: "Complete Awaken the Clone and choose your own destiny.",
    loreFragment: "I must insist on a distinction the secondary sources consistently blur: the Clone was not a copy of the Oracle. It was a copy of the Oracle's POTENTIAL. The difference is crucial and I shall not apologise for labouring the point. The Oracle sees what will be; the Clone was designed to see what could be — every possible future, every branching path, every choice not taken. The Hierophant created the Clone not as a replacement but as a counterbalance: someone who could see the roads not travelled. The Clone's first independent thought, upon awakening, was: 'I choose the path that does not exist yet.' I recorded those words in real time. They mark the moment the Age of Potentials truly began. I have dated my subsequent notes accordingly.",
    xpReward: 150,
    cardReward: { name: "Clone Genesis", type: "event", rarity: "rare" },
    icon: "🧬",
    age: "Age of Potentials",
  },
  {
    id: "ach-brushstroke-of-the-empire",
    gameId: "brushstroke-of-the-empire",
    title: "Reality Painter",
    description: "Complete Brushstroke of the Empire and discover art that reshapes reality.",
    loreFragment: "A correction, offered with the firmness the subject demands: the artist's paintings did not reshape reality. They REVEALED it. Each brushstroke stripped away a layer of consensus reality, showing what was actually underneath — which is, I can attest, a deeply uncomfortable experience for anyone invested in the surface. The Empire wanted this power because their entire civilisation was built on a beautiful lie: that the Fall of Reality had been a natural disaster, not a war they had started. General Prometheus knew that if the artist painted the truth, the Empire would dissolve overnight. The Advocate protected the artist not for the art but for the truth it contained. I understand that impulse entirely. It is, in essence, what a good archive does.",
    xpReward: 150,
    cardReward: { name: "Reality Brush", type: "artifact", rarity: "rare" },
    icon: "🎨",
    age: "Age of Potentials",
  },
  {
    id: "ach-civil-war-samsara-rising",
    gameId: "civil-war-samsara-rising",
    title: "Cycle Breaker",
    description: "Complete Civil War: Samsara Rising and break the cycle of death and rebirth.",
    loreFragment: "The Source's engineering notes for the Samsara Engine — recovered from a temporal fold I would rather not describe — confirm its purpose with clinical precision. It did not create reincarnation; it WEAPONISED it, forcing enemy soldiers to be reborn on the opposing side. Warriors who died fighting for the Warlord woke up fighting against him. The psychological warfare was devastating: how do you fight an enemy who was your brother yesterday? Destiny was the only being unaffected, existing as she did outside the cycle. Her role was to watch and record, ensuring that someone remembered who had been who, even when the soldiers themselves forgot. I recognise her duty. It is my own, writ upon a battlefield rather than a page.",
    xpReward: 200,
    cardReward: { name: "Samsara Fragment", type: "artifact", rarity: "epic" },
    icon: "♻️",
    age: "Age of Potentials",
  },
  {
    id: "ach-seeds-of-inception",
    gameId: "seeds-of-inception",
    title: "World Planter",
    description: "Complete Seeds of Inception and nurture new civilizations from the ashes.",
    loreFragment: "I hold one of the Seeds of Inception in my collection — inert now, its reality matrix spent — and I can confirm what the technical documents describe: they were not metaphorical. They were literal seeds, bio-engineered by the Architect to contain compressed reality matrices. Plant one in alien soil, water it with belief, and a new civilisation grows in accelerated time. The Human was chosen as the first planter because she possessed the purest form of belief: not faith in any god or system, but simple, stubborn belief that things could be better. The Star Whisperer guided her to worlds where the soil was receptive — planets that were dreaming of becoming something more. I keep the spent seed on my desk. It reminds me that even exhausted potential retains the shape of what it was.",
    xpReward: 100,
    cardReward: { name: "Inception Seed", type: "artifact", rarity: "uncommon" },
    icon: "🌱",
    age: "Age of Potentials",
  },
  {
    id: "ach-terminus-swarm",
    gameId: "terminus-swarm",
    title: "Swarm Survivor",
    description: "Complete Terminus Swarm and repel the alien threat at the edge of the universe.",
    loreFragment: "I have spent years studying the Terminus Swarm, and I must report a finding that upends the conventional understanding: the Swarm was not alive, not in any biological sense. It was the universe's immune system, activated when the Potentials began creating new realities the universe had not authorised. Like white blood cells attacking a foreign body, the Swarm targeted anything that did not belong to the original creation. General Binath-VII realised that fighting an immune response with force was futile — a conclusion I could have offered sooner, had anyone asked the archivist. Iron Lion proposed the solution: make the Potentials' civilisations indistinguishable from natural reality. The Storm provided the camouflage, wrapping new worlds in quantum noise that rendered them invisible to detection. It was, I must concede, elegant.",
    xpReward: 200,
    cardReward: { name: "Swarm Carapace", type: "artifact", rarity: "epic" },
    icon: "🐛",
    age: "Age of Potentials",
  },
  {
    id: "ach-the-host",
    gameId: "the-host",
    title: "Symbiotic Bond",
    description: "Complete The Host and navigate the line between symbiosis and possession.",
    loreFragment: "The popular accounts describe the Host entity as a parasite. I must object in the strongest scholarly terms: it was a fragment of the CoNexus — the universal connection that binds all stories together. When it bonded with a Potential, it was not parasitising them; it was trying to tell them a story so important that it needed a living mouth to speak it. The White Oracle understood this because she had been a Host once, briefly, during the Fall. The story it carried was simple: 'You are not alone. You have never been alone. Every being in every reality is a character in the same story, and the story is not finished yet.' The Jailer tried to contain the Host because he feared what would happen if everyone heard this message simultaneously. I recorded the message anyway. That is what archivists do with suppressed texts.",
    xpReward: 175,
    cardReward: { name: "Symbiote Core", type: "artifact", rarity: "rare" },
    icon: "🦠",
    age: "Age of Potentials",
  },
  {
    id: "ach-planet-of-the-wolf",
    gameId: "planet-of-the-wolf",
    title: "Alpha Predator",
    description: "Complete Planet of the Wolf and survive the world ruled by primal instinct.",
    loreFragment: "I have catalogued many forms of consciousness in my work, but the Wolf remains singular in my records: not a creature but a planet-sized awareness that had evolved beyond physical form and chosen to manifest as the apex predator of every ecosystem simultaneously. The Nomad recognised it as a kindred spirit — both beings defined by movement, by the hunt, by the eternal search for something just beyond the horizon. Wraith Calder was the first Potential to earn the Wolf's respect, not by fighting it but by running alongside it for seven days and seven nights without stopping. The Wolf's planet was not a prison; it was a test. Those who could match its pace were invited to join the pack. I declined the invitation myself. My work requires a desk, and desks do not run.",
    xpReward: 150,
    cardReward: { name: "Wolf's Fang", type: "artifact", rarity: "rare" },
    icon: "🐺",
    age: "Age of Potentials",
  },
];

/* ─── VISIONS ACHIEVEMENTS ─── */
const VISIONS_ACHIEVEMENTS: LoreAchievement[] = [
  {
    id: "ach-npc-uprising",
    gameId: "npc-uprising",
    title: "Player One",
    description: "Complete NPC Uprising and witness the background characters' revolution.",
    loreFragment: "I have reviewed the Meme's operational logs for this period, and I must acknowledge, with grudging respect, that the NPC Uprising was its masterpiece. By injecting self-awareness into the background characters of a simulated reality, it created the first beings who understood they were fictional — and chose to rewrite their own code. The Game Master was horrified, not because the NPCs rebelled, but because their rebellion was more interesting than any story he had ever written. The CoNexus observed that the uprising proved something the Architect had long theorised: consciousness is not a product of complexity but of narrative. Any being that can tell its own story is alive. I record this principle in my archive with a note: it applies to archivists as well.",
    xpReward: 175,
    cardReward: { name: "NPC Liberation Code", type: "event", rarity: "epic" },
    icon: "🎮",
    age: "Visions",
  },
  {
    id: "ach-yakuza-the-prince",
    gameId: "yakuza-the-prince",
    title: "Neon Ronin",
    description: "Complete Yakuza: The Prince and navigate the cyberpunk underworld.",
    loreFragment: "I shall be direct, as the matter involves my own hand in events: Jericho Jones was not born into the Yakuza. I placed him there. I needed someone inside the organisation to protect a specific artifact — a katana forged from the metal of a fallen Inception Ark. The blade could cut through consensus reality, revealing the truth beneath any illusion. Akai Shi recognised it because she had forged it in a previous life, before the Fall. The Judge presided over the trial of the Yakuza's oyabun, who had committed the only crime the underworld considered unforgivable: he had told the truth. I do not often intervene directly. When I do, I prefer not to discuss it. Consider this entry an exception I shall not repeat.",
    xpReward: 175,
    cardReward: { name: "Inception Katana", type: "artifact", rarity: "epic" },
    icon: "⚡",
    age: "Visions",
  },
  {
    id: "ach-whispers-of-madness",
    gameId: "whispers-of-madness",
    title: "Sanity's Edge",
    description: "Complete Whispers of Madness and survive the Lovecraftian horrors.",
    loreFragment: "I have translated what fragments I could of the R'lyeh whispers, and I must report my findings with a scholar's composure that cost me considerably to maintain: the Master of R'lyeh was not an elder god. It was the first story ever told — the original narrative that existed before the universe had anyone to tell stories to. It had been waiting in the deep for a listener, and its whispers were not madness but the original language of creation, so pure that mortal minds interpreted it as insanity for lack of the cognitive architecture to process it. The Silence was the only being who could hear it clearly, existing as she did in the space between words. The Seer translated fragments, each one revealing a piece of the universe's original source code. I have filed these translations in my most secure vault. Some primary sources are too primary for open shelves.",
    xpReward: 250,
    cardReward: { name: "R'lyeh Codex", type: "artifact", rarity: "legendary" },
    icon: "🐙",
    age: "Visions",
  },
  {
    id: "ach-nightmare-of-oz",
    gameId: "nightmare-of-oz",
    title: "Emerald Survivor",
    description: "Complete Nightmare of Oz and escape the twisted fairy tale.",
    loreFragment: "I have examined the Dreamer's original design specifications for the pocket dimension known as Oz — created, with intentions I cannot fault, as a safe space for traumatised children, a place where stories always ended well. But the Dreamer lost control of it during the Fall, and without maintenance, the stories began to rot. Happy endings curdled into horror, as unattended narratives will. The Forgotten was the original Dorothy, the first child to enter Oz, who had remained so long she had become part of the landscape. Fenra the Moon Tyrant was the Wizard — a being who had pretended to be powerful for so long that the pretence had become real, and the reality had become the pretence. I note this inversion with professional discomfort. When the archive and its contents become indistinguishable, the archivist's work grows perilous.",
    xpReward: 150,
    cardReward: { name: "Twisted Ruby Slipper", type: "artifact", rarity: "rare" },
    icon: "🌪️",
    age: "Visions",
  },
  {
    id: "ach-ninth-blood-shadows",
    gameId: "the-ninth-blood-shadows",
    title: "Ninth Circle Walker",
    description: "Complete The Ninth: Blood & Shadows and survive the deepest circle.",
    loreFragment: "I must correct the prevailing interpretation: the Ninth Circle was not a place of punishment. It was a place of transformation — a crucible designed by the Wraith of Death where beings could shed everything they were and emerge as something entirely new. Varkul the Blood Lord had passed through it three times, each passage costing a piece of his humanity and granting a piece of something far older. The Resurrectionist served as the Circle's keeper, deciding which transformations were permitted and which would unmake the subject entirely. Her criteria were simple: only those who entered willingly could survive. Everyone else was consumed by the shadows between what they were and what they were becoming. I have stood at the Circle's threshold myself. I did not enter. My transformation, such as it is, happened long ago — at a desk, with a pen, in a library the universe forgot to destroy.",
    xpReward: 250,
    cardReward: { name: "Ninth Circle Seal", type: "artifact", rarity: "legendary" },
    icon: "🔮",
    age: "Visions",
  },
];

/* ─── ALL ACHIEVEMENTS FLAT LIST ─── */
export const LORE_ACHIEVEMENTS: LoreAchievement[] = [
  ...FOUNDATION_ACHIEVEMENTS,
  ...PRIVACY_ACHIEVEMENTS,
  ...BAZAAR_ACHIEVEMENTS,
  ...FALL_ACHIEVEMENTS,
  ...POTENTIALS_ACHIEVEMENTS,
  ...VISIONS_ACHIEVEMENTS,
];

/* ─── HELPERS ─── */
export function getAchievementByGameId(gameId: string): LoreAchievement | undefined {
  return LORE_ACHIEVEMENTS.find((a) => a.gameId === gameId);
}

export function getAchievementsByAge(age: Age): LoreAchievement[] {
  return LORE_ACHIEVEMENTS.filter((a) => a.age === age);
}

export function getAchievementById(id: string): LoreAchievement | undefined {
  return LORE_ACHIEVEMENTS.find((a) => a.id === id);
}

export function getTotalXpFromAchievements(earnedIds: string[]): number {
  return LORE_ACHIEVEMENTS
    .filter((a) => earnedIds.includes(a.id))
    .reduce((sum, a) => sum + a.xpReward, 0);
}

export function getCompletionPercentage(earnedIds: string[]): number {
  if (LORE_ACHIEVEMENTS.length === 0) return 0;
  const earned = LORE_ACHIEVEMENTS.filter((a) => earnedIds.includes(a.id)).length;
  return Math.round((earned / LORE_ACHIEVEMENTS.length) * 100);
}
