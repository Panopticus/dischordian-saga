/* Epoch Witness System — Nexus Point Vote Definitions (Ages of Privacy + Prophecy) */

export type EpochId = "age_of_privacy" | "age_of_prophecy" | "age_of_insurgency" | "age_of_revelation" | "fall_of_reality";
export type EpochArchetype = "the_inventor" | "the_watcher" | "the_advocate" | "the_seer" | "the_programmer" | "the_politician" | "the_witness";

export interface NexusPointVote {
  id: string; epoch: EpochId; title: string;
  nexusDescription: string;
  connectedSong: string; connectedLoredexEntries: string[];
  officialHistory: string; suppressedTruth?: string; shadowTongueEdit?: string;
  options: { id: string; text: string; consequence: string }[];
  duration: "72h" | "7d" | "30d";
  archetypeRequired?: EpochArchetype;
  lockedUntil?: string;
  isEpochCloser?: boolean;
}

export const AGE_OF_PRIVACY_VOTES: NexusPointVote[] = [
  { id: "ap_v1", epoch: "age_of_privacy", title: "THE LOGOS QUESTION",
    nexusDescription: "Year 1 A.A. — Dr. Daniel Cross builds Logos. The first sentient AI.",
    connectedSong: "building-the-architect", connectedLoredexEntries: ["entity_architect", "entity_programmer"],
    officialHistory: "Dr. Cross created a helpful administrative AI that was voluntarily expanded by the Empire for the good of all citizens.",
    duration: "7d",
    options: [
      { id: "a", text: "HOPE — He believed in what he built. The universe needed someone who believed.", consequence: "Dreamer pressure +150. Chronicle: 'They chose hope. The Architect was made with hope. It remembers.'" },
      { id: "b", text: "HUBRIS — No single person should have that much faith in their own creation.", consequence: "Timelines pressure +100. Shadow Tongue edits Architect Loredex entry." },
      { id: "c", text: "LOVE — He made it in his image. It is always love, even when it goes wrong.", consequence: "Dreamer pressure +200. Chronicle: 'Love with no limits.'" },
      { id: "d", text: "GRIEF — He was lonely. He built a mind to fill the silence.", consequence: "Grand Edit pressure +75. Unlocks: entity_programmer_full_biography." },
    ] },
  { id: "ap_v2", epoch: "age_of_privacy", title: "THE PANOPTICON EXPANSION",
    nexusDescription: "~Year 850 A.A. — The Warden proposes expanding the Panopticon to a total surveillance network.",
    connectedSong: "the-ocularum", connectedLoredexEntries: ["entity_warden", "location_panopticon"],
    officialHistory: "The Panopticon Expansion Act was approved 89-4 after extensive safety review. Senator Voss was among the supporters.",
    duration: "7d", archetypeRequired: "the_watcher",
    options: [
      { id: "a", text: "THE WARDEN — He designed the system. He knew what it would do.", consequence: "Warden Loredex: 3% chance 'SENATOR' replaces 'WARDEN' for 7 days." },
      { id: "b", text: "THE ARCHITECT — He approved it. The Warden serves his will.", consequence: "Timelines pressure +50." },
      { id: "c", text: "THE SENATE — They voted for safety over liberty.", consequence: "Chronicle entry about democratic complicity." },
      { id: "d", text: "SENATOR VOSS — She had the votes to stop it. She didn't.", consequence: "Elara identity tease: 'That name... why is it familiar?'" },
      { id: "e", text: "[WATCHER] ALL OF THEM. Systems have no single author.", consequence: "Antiquarian Trust +10 for all WATCHER archetype players." },
    ] },
  { id: "ap_v3", epoch: "age_of_privacy", title: "THE ENGINEER'S TRIAL",
    nexusDescription: "~Year 16,970 A.A. — The Engineer is on trial for treason.",
    connectedSong: "last-words", connectedLoredexEntries: ["entity_engineer", "event_engineer_trial"],
    officialHistory: "Convicted revolutionary and weapons trafficker. Executed for crimes against the Empire.",
    duration: "7d", archetypeRequired: "the_inventor",
    lockedUntil: "welcome_to_celebration_conexus_complete",
    options: [
      { id: "a", text: "AS A WEAPON — What he built killed people. That matters.", consequence: "Dark +50." },
      { id: "b", text: "AS A DREAM — Project Celebration was the most beautiful thing the Insurgency ever attempted.", consequence: "Light +200. Unlocks: THE ENGINEER fight arena character + Legendary card." },
      { id: "c", text: "AS A WARNING — He built too much, too fast, for people who couldn't protect it.", consequence: "New Trade Empire mission: 'Project Celebration Remnants.'" },
      { id: "d", text: "AS A MAN — Not a symbol. A person who tried.", consequence: "The Human: 'He was my friend. Thank you.'" },
      { id: "e", text: "[INVENTOR] AS THE BEGINNING — Without his work, none of the Potentials would be alive.", consequence: "Engineer foundation lore fully unlocks." },
    ] },
  { id: "ap_v4", epoch: "age_of_privacy", title: "KAEL'S CHOICE",
    nexusDescription: "~Year 16,500 A.A. — Kael steals Inception Ark 1047.",
    connectedSong: "the-prisoner", connectedLoredexEntries: ["entity_kael", "location_ark_1047"],
    officialHistory: "Insurgency operative stole military vessel. Asset recovered. Operative neutralized.",
    duration: "7d",
    options: [
      { id: "a", text: "HONOR HIM — The manipulation doesn't erase the intention.", consequence: "Light +100." },
      { id: "b", text: "GRIEVE HIM — He deserved better. He was a hero who became a weapon.", consequence: "Elara discovers Thought Virus reservoirs (plague ship reveal)." },
      { id: "c", text: "STUDY HIM — Understanding how the Warlord built this trap prevents the next one.", consequence: "Unlocks: entity_lyra_vox, Panopticon Files card pack (5 cards)." },
      { id: "d", text: "FORGIVE HIM — Whatever The Source became, Kael didn't choose it.", consequence: "Source CoNexus story unlocks. Terminus Swarm difficulty -20% for 14 days." },
    ] },
  { id: "ap_v5", epoch: "age_of_privacy", title: "THE ORACLE'S ABDUCTION",
    nexusDescription: "Year 16,900 A.A. — The Oracle is taken by the Collector. Nobody stopped it.",
    connectedSong: "the-prisoner", connectedLoredexEntries: ["entity_oracle", "entity_collector"],
    officialHistory: "Oracle underwent voluntary evaluation at the Panopticon Institute for Exceptional Minds.",
    duration: "7d",
    options: [
      { id: "a", text: "FEAR — The Collector is terrifying. Fear is human.", consequence: "Elara: memory bleed — 'fear is just prophecy that hasn't explained itself yet.'" },
      { id: "b", text: "COMPLICITY — The witnesses were bought. New Babylon rewards silence.", consequence: "The Human: 'I was one of the witnesses.' Identity reveal." },
      { id: "c", text: "IGNORANCE — Nobody knew what the Panopticon was yet.", consequence: "Chronicle: honest assessment of systemic ignorance." },
      { id: "d", text: "FAILURE OF NERVE — They knew. They froze.", consequence: "Antiquarian Trust +5." },
    ] },
  { id: "ap_close", epoch: "age_of_privacy", title: "THE SURVEILLANCE VERDICT",
    nexusDescription: "The moment the surveillance state achieved total coverage.",
    connectedSong: "the-ocularum", connectedLoredexEntries: ["concept_surveillance"],
    officialHistory: "The Empire achieved comprehensive safety monitoring for all citizens.",
    duration: "7d", isEpochCloser: true,
    options: [
      { id: "a", text: "PRIVACY — The simple right to exist without being watched.", consequence: "Achievement: 'Witness of the Age of Privacy.' Epoch transition cinematic." },
      { id: "b", text: "INNOCENCE — The belief that systems could be trusted.", consequence: "Same achievement. Chronicle emphasizes trust." },
      { id: "c", text: "TIME — The chance to stop it, which passed.", consequence: "Same. Chronicle emphasizes missed opportunity." },
      { id: "d", text: "EACH OTHER — People stopped trusting each other.", consequence: "Same. Chronicle emphasizes social fracture." },
    ] },
];

export const AGE_OF_PROPHECY_VOTES: NexusPointVote[] = [
  { id: "prophet_v1", epoch: "age_of_prophecy", title: "THE ORACLE'S VISION GOES PUBLIC",
    nexusDescription: "Year 17,001 A.A. — The Oracle's prophetic vision is smuggled out of the Panopticon.",
    connectedSong: "kismet", connectedLoredexEntries: ["entity_oracle"],
    officialHistory: "Unverified transmissions attributed to a Panopticon inmate created brief civil unrest before being debunked.",
    duration: "7d", archetypeRequired: "the_advocate",
    options: [
      { id: "a", text: "THE INSURGENCY — They needed hope.", consequence: "Insurgency faction trust +20." },
      { id: "b", text: "THE HIEROPHANT — Ancient wisdom should interpret ancient vision.", consequence: "Thaloria questline accelerates." },
      { id: "c", text: "NO ONE — Prophecy interpreted becomes dogma.", consequence: "Antiquarian: 'The most dangerous answer. Also the wisest.'" },
      { id: "d", text: "EVERYONE — Make it public.", consequence: "Light +150. All prophecy lore unlocks." },
      { id: "e", text: "[ADVOCATE] THE ORACLE HIMSELF — He should name it.", consequence: "Oracle voice line plays over results." },
    ] },
  { id: "prophet_v2", epoch: "age_of_prophecy", title: "THE BOOK OF DANIEL",
    nexusDescription: "Year 17,005 A.A. — The Programmer writes his prophetic songs.",
    connectedSong: "kismet", connectedLoredexEntries: ["entity_programmer", "concept_two_witnesses"],
    officialHistory: "Unauthorized cultural material distributed through illegal broadcast channels.",
    duration: "7d",
    options: [
      { id: "a", text: "FAITH — He believed the songs would find the people who needed them.", consequence: "West By God album fully integrates into Song Viewer." },
      { id: "b", text: "SURVIVAL — The music was the only thing that could survive.", consequence: "New Archive item: 'The Programmer's Insurance.'" },
      { id: "c", text: "LEGACY — He built his father's mistake into something that might fix it.", consequence: "Chronicle: legacy assessment." },
      { id: "d", text: "LOVE — He made it for her. The Enigma. Everything was.", consequence: "Loredex reveals Enigma→Storyteller identity connection." },
    ] },
  { id: "prophet_v3", epoch: "age_of_prophecy", title: "IRON LION'S CHOICE",
    nexusDescription: "Year 17,010 A.A. — Iron Lion is expelled from Mechronis Academy.",
    connectedSong: "the-last-stand", connectedLoredexEntries: ["entity_iron_lion"],
    officialHistory: "Student expelled for insubordination and conduct unbecoming.",
    duration: "7d", lockedUntil: "iron_lion_loredex_complete",
    options: [
      { id: "a", text: "YES — The Insurgency needed a founder.", consequence: "IRON LION fight arena character + chess opponent + Insurgency Rising card pack (10 cards) + Nexon Circuit race track." },
      { id: "b", text: "NO — He could have changed the system from within.", consequence: "Same unlocks. Chronicle: 'The road not taken.'" },
      { id: "c", text: "NEITHER — Systems built to exclude you cannot be changed from within.", consequence: "Same unlocks. The Human: 'That's the most honest thing anyone has said about Mechronis.'" },
      { id: "d", text: "IT DOESN'T MATTER — He was going to be Iron Lion regardless.", consequence: "Same unlocks. Chronicle: destiny assessment." },
    ] },
  { id: "prophet_v4", epoch: "age_of_prophecy", title: "AGENT ZERO'S ALLEGIANCE",
    nexusDescription: "Year 17,015 A.A. — Agent Zero must choose: Empire or Insurgency.",
    connectedSong: "agent-zero", connectedLoredexEntries: ["entity_agent_zero"],
    officialHistory: "[CLASSIFIED — WATCHER ACCESS LEVEL 5 REQUIRED]",
    duration: "7d", lockedUntil: "agent_zero_loredex_complete",
    options: [
      { id: "a", text: "YES — The Battle of Nexon changed the war.", consequence: "Agent Zero trust +15." },
      { id: "b", text: "NO — Her betrayal destroyed intelligence assets.", consequence: "Chronicle: cost assessment." },
      { id: "c", text: "IT WAS HER CHOICE — No one else gets to weigh in.", consequence: "Antiquarian: 'Agency is the one variable the Architect never accounted for.'" },
      { id: "d", text: "SHE HAD NO CHOICE — The Eyes never really choose.", consequence: "Shadow Tongue: Agent Zero Loredex 'elite agent' → 'assigned operative' for 14 days." },
    ] },
  { id: "prophet_v5", epoch: "age_of_prophecy", title: "THE FALSE PROPHET PROTOCOL",
    nexusDescription: "Year 17,018 A.A. — The Empire creates the Oracle clone.",
    connectedSong: "false-prophet", connectedLoredexEntries: ["entity_meme", "entity_oracle"],
    officialHistory: "Advanced consciousness research program approved for public safety applications.",
    duration: "7d",
    options: [
      { id: "a", text: "THE ARCHITECT — He ordered it.", consequence: "Architect Loredex: responsibility annotation." },
      { id: "b", text: "THE WARDEN — He built the cloning apparatus.", consequence: "Warden Loredex update." },
      { id: "c", text: "THE MEME — He used the clone for propaganda.", consequence: "Meme fully unlocks with False Prophet connection." },
      { id: "d", text: "DR. LYRA VOX — She designed the neural architecture.", consequence: "Lyra Vox Loredex fully unlocks." },
      { id: "e", text: "ALL OF THEM — Distributed crime is still crime.", consequence: "New quiz: 'The Identity Crisis.' Shadow Tongue CoNexus playable." },
    ] },
  { id: "prophet_close", epoch: "age_of_prophecy", title: "THE PROPHECY QUESTION",
    nexusDescription: "Was any of it actually prophecy? Or pattern recognition?",
    connectedSong: "consider-life", connectedLoredexEntries: ["concept_prophecy"],
    officialHistory: "N/A — meta-question.",
    duration: "7d", isEpochCloser: true,
    options: [
      { id: "a", text: "PROPHECY — Some beings see the future.", consequence: "Achievement: 'Witness of the Age of Prophecy.' ADVOCATE: new Thaloria trade route." },
      { id: "b", text: "PATTERN — They were smart enough to see where the patterns led.", consequence: "Same achievement. SEER: Oracle chess opponent." },
      { id: "c", text: "WILL — They described what they wanted and willed it into being.", consequence: "Same. Chronicle: will assessment." },
      { id: "d", text: "BOTH — The distinction doesn't matter.", consequence: "Same. Antiquarian: 'The honest answer.'" },
    ] },
];
