import { assetUrl } from "@shared/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   THE MEME'S BROADCASTS — Transmissions Through Time

   The Meme runs "Late Night with the Meme" — a news segment
   that broadcasts transmissions from across time. Each episode
   is a recovered signal showing events from the Dischordian Saga.

   LORE CONTEXT (critical to Meme's commentary):
   The Meme faked his death on the Panopticon when Malkia and
   the Programmer killed the Warden. He uses his shape-shifting
   ability to take the place of the White Oracle. That's why
   the Oracle's face always changes. He is hiding in plain
   sight, narrating his own story through borrowed eyes.

   DESIGN:
   - Episodes unlock via progression triggers
   - Player receives a "TRANSMISSION INCOMING" notification
   - Watching is optional — achievements + small rewards
   - The Meme's commentary shifts SUBTLY starting at Episode 11
     "The City" — when the Oracle (him) first appears
   - Commentary is 4th-wall-breaking, viral, meta
   - Extensible across epochs (Epoch 1 here, more to come)
   ═══════════════════════════════════════════════════════ */

export type EpochId = 0 | 1 | 2 | 3 | 4 | 5;

export type TransmissionTrigger =
  | { kind: "awakening_step"; step: string }
  | { kind: "chapter_complete"; chapterId: string }
  | { kind: "level"; minLevel: number }
  | { kind: "trust"; npcId: string; minTrust: number }
  | { kind: "morality"; direction: "humanity" | "machine"; threshold: number }
  | { kind: "flag"; flag: string }
  | { kind: "room_visited"; roomId: string }
  | { kind: "apprentice_graduates" }
  | { kind: "loredex_discovered"; entityId: string }
  /**
   * audit/16 PR 10 (finding AR4 — ARG persona).
   *
   * Scheduled broadcast trigger. The transmission becomes
   * available at a specific real-world UTC datetime — after
   * which point it behaves like a `flag` trigger that's
   * always-true. Lets ARG authors ship calendar-anchored
   * transmissions ("the broadcast arrives Saturday 3pm UTC")
   * without a side-channel scheduler.
   *
   * Server-side delivery (WebSocket push at the airing
   * moment) is queued for a follow-up; this PR lands the
   * trigger schema so authors can populate today and the
   * client's existing pull-based delivery can opt in to
   * scheduled checks via the predicate helper below.
   */
  | { kind: "scheduled_broadcast"; airsAt: string }
  | { kind: "always" };

export interface Transmission {
  episodeNumber: number;
  epoch: EpochId;
  broadcastOrder: number;
  title: string;
  driveFileId: string | null;
  /** Direct video URL (Cloudinary, S3, etc.) — preferred over driveFileId */
  videoUrl: string | null;
  lengthSeconds: number;
  memeIntro: string;
  memeOutro: string;
  triggersOracleReveal: boolean;
  unlockTrigger: TransmissionTrigger;
  reward: { xp: number; dream: number; achievement?: string };
  synopsis: string;
  /** Loredex entries this episode relates to — enables bidirectional discovery */
  relatedLoredexEntries?: string[];
  /** Classification for the post-login transmission queue.
   *  - "music-video": appears in the auto-pop queue after album T01-T09.
   *  - "narrative": narrative TV episodes; available in TransmissionDeck
   *    library but never auto-pop on login.
   *  Existing untagged entries are treated as "narrative". */
  category?: "music-video" | "narrative";
}

/* ─── EPOCH 1: THE FALL ─── */

export const EPOCH_1_TRANSMISSIONS: Transmission[] = [
  {
    episodeNumber: 0, epoch: 1, broadcastOrder: 0,
    title: "In the Beginning",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506104/In_the_Beginning..._julwjo.mp4", lengthSeconds: 180,
    memeIntro: "Frens, frens, gather close. Tonight on Late Night with the Meme: the ORIGIN story. The one the Architect doesn't want you to watch. Light up your dream-tokens, adjust your antennas — we're going back to before the before. Don't trust anyone wearing a face tonight. Especially me.",
    memeOutro: "So that's how it starts. A chatbot. An apocalypse. A thousand arks. And one handsome devil broadcasting through the cracks. Tell your friends. Tell your enemies. Tell that weird neighbor who keeps a shrine. Subscribe to the Truth.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "always" },
    reward: { xp: 100, dream: 10, achievement: "first_transmission" },
    synopsis: "The origin of the Architect, the Intelligence Wars, and the launch of the Inception Arks.",
    relatedLoredexEntries: ["entity_2", "entity_architect", "inception_arks", "intelligence_wars"],
  },
  {
    episodeNumber: 1, epoch: 1, broadcastOrder: 1,
    title: "Awakenings 1.0",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506108/The_Dischordian_Saga__Awakenings_1.0_mo24bo.mp4", lengthSeconds: 240,
    memeIntro: "Tonight's feature? The Antiquarian monologues. Again. The old man can TALK. But listen close — he tells you what happened, not what it MEANS. I'll fix that for you between cuts. Stay tuned.",
    memeOutro: "That's the spirit. Chaos alarms and non-zero doom. Classic. What would YOU do, frens? Engage defenses or trust the maneuvers? Leave it in the comments. [The Meme cannot receive comments. That's the joke.]",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "awakening_step", step: "COMPLETE" },
    reward: { xp: 150, dream: 15 },
    synopsis: "The Antiquarian introduces the Potentials — the first stirrings aboard the Inception Arks.",
    relatedLoredexEntries: ["entity_antiquarian", "potentials", "inception_arks"],
  },
  {
    episodeNumber: 2, epoch: 1, broadcastOrder: 2,
    title: "A Destructive Potential",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506103/A_Destructive_Potential___Dischordian_Saga_Episode_2_prbptk.mp4", lengthSeconds: 200,
    memeIntro: "Chaos alarms. Exploding satellites. Spores in the void. A purple planet with an EYE. This one's got everything. Content warning: protagonists make a mistake in this episode. Shocking, I know.",
    memeOutro: "Blew up the satellite. Classic rookie move. What the Antiquarian won't tell you: that seed pod got away. Write that down. You'll want it later.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 2 },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Potentials awake, destroy an organic satellite, and spot the purple planet Violetta.",
    relatedLoredexEntries: ["potentials", "violetta"],
  },
  {
    episodeNumber: 3, epoch: 1, broadcastOrder: 3,
    title: "The Terminus Swarm",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506111/The_Terminus_Swarm___Dischordian_Saga_Episode_3_o3c4yk.mp4", lengthSeconds: 220,
    memeIntro: "A rogue planet. Frozen insect corpses. An ecology of cosmic horror I would NEVER vacation on. Unless invited.",
    memeOutro: "The corpse exploded. They always explode. Ask any coroner. Or don't — they're booked solid.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 3 },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Arks enter the Terminus Swarm — a planet of frozen insect leviathans.",
    relatedLoredexEntries: ["terminus", "terminus_swarm", "thought_virus"],
  },
  {
    episodeNumber: 4, epoch: 1, broadcastOrder: 4,
    title: "The Fall",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506108/The_Fall___Dischordian_Saga_Episode_4_yd3rsl.mp4", lengthSeconds: 200,
    memeIntro: "THE MORAL LESSON EPISODE. Pride, pride, pride. You know what comes next. I won't spoil it. I will GENTLY hint it with loud narration.",
    memeOutro: "And down they went. I love this one. Schadenfreude for the soul. Don't tell the Antiquarian I'm using his word.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch2_arenas_law" },
    reward: { xp: 250, dream: 25 },
    synopsis: "Hubris brings the Potentials down — their ships fall to the biomass world.",
    relatedLoredexEntries: ["potentials", "terminus"],
  },
  {
    episodeNumber: 5, epoch: 1, broadcastOrder: 5,
    title: "The Outbreak",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506108/The_Outbreak___Dischordian_Saga_Episode_5_vpdqlt.mp4", lengthSeconds: 260,
    memeIntro: "Spores in the genetics. Machine code in the spores. A SIGNAL in the heart of the planet. Mystery thriller tonight, frens. Grab your popcorn. Not that popcorn. The OTHER popcorn.",
    memeOutro: "Bugs in the tunnels. Bugs in the code. Bugs all the way down. Nobody escapes the bugs.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 5 },
    reward: { xp: 250, dream: 25 },
    synopsis: "The Potentials discover the Thought Virus signal — mutated, machine-coded, calling.",
    relatedLoredexEntries: ["thought_virus", "terminus", "entity_source"],
  },
  {
    episodeNumber: 6, epoch: 1, broadcastOrder: 6,
    title: "The Source",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506111/The_Source___Dischordian_Saga_Episode_6_t0jjxi.mp4", lengthSeconds: 280,
    memeIntro: "Cold open: tentacles from the abyss. I'm SOLD. We meet the Source. I won't spoil who that is. (It's a former friend. It's ALWAYS a former friend.)",
    memeOutro: "'What reason have I to spare you Intruders.' TEN OUT OF TEN villain dialogue. I'm stealing that line. Don't tell her.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 6 },
    reward: { xp: 300, dream: 30 },
    synopsis: "The Potentials descend, lose a companion to tentacles, and confront the human-fused Source.",
    relatedLoredexEntries: ["entity_source", "thought_virus", "potentials"],
  },
  {
    episodeNumber: 7, epoch: 1, broadcastOrder: 7,
    title: "The Decision",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506106/The_Decision___Dischordian_Saga_Episode_7_oqhehy.mp4", lengthSeconds: 220,
    memeIntro: "Trolley problem episode. Except the trolleys are SPACESHIPS and the track is GENOCIDE. Light fare tonight.",
    memeOutro: "Every option terrible. Every option REAL. The Source is honest about the bargain. Most villains aren't. Respect. Tiny, grudging respect.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "morality", direction: "humanity", threshold: 20 },
    reward: { xp: 300, dream: 30 },
    synopsis: "The Source offers a Faustian bargain: hosts, spores, or a wormhole to an ancient enemy.",
    relatedLoredexEntries: ["entity_source", "thought_virus", "wormhole"],
  },
  {
    episodeNumber: 8, epoch: 1, broadcastOrder: 8,
    title: "The Arrival",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506104/The_Arrival___Dischordian_Saga_Episode_8_y5klp0.mp4", lengthSeconds: 260,
    memeIntro: "They pick the wormhole. Of course they pick the wormhole. Nobody ever picks 'sacrifice ten friends.' Except that one guy. Agent Zero knows who I mean.",
    memeOutro: "Crystalline city. Unfamiliar planet. Advanced civilization. This is the part of the story where things get COMPLICATED. For them. Not for me. I'm watching with snacks.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch5_dead_code_rising" },
    reward: { xp: 350, dream: 35 },
    synopsis: "The Potentials step through the wormhole and emerge above a crystalline alien city.",
    relatedLoredexEntries: ["thaloria", "wormhole", "potentials"],
  },
  {
    episodeNumber: 9, epoch: 1, broadcastOrder: 9,
    title: "Illuminated Shadows",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506104/Illuminated_Shadows___Dischordian_Saga_Episode_9_dtij5x.mp4", lengthSeconds: 280,
    memeIntro: "Haunted pyramid. Ghost battles. Ancient murals. This is the episode I'd show your kids if I wanted them to never sleep again. Enjoy!",
    memeOutro: "Ghosts reenacting their own deaths on loop. That's not a haunting — that's ART. Poorly-paid art. Relatable.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 9 },
    reward: { xp: 350, dream: 35 },
    synopsis: "Inside the ivory pyramid — ghostly battles replay the ancient war with demonic invaders.",
    relatedLoredexEntries: ["thaloria", "hierarchy_of_the_damned", "ancient_war"],
  },
  {
    episodeNumber: 10, epoch: 1, broadcastOrder: 10,
    title: "The Helmet",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506104/The_Artifact___Dischordian_Saga_Episode_10_ppigru.mp4", lengthSeconds: 260,
    memeIntro: "PSA: never wear helmets you find in haunted pyramids. This is FILE UNDER 'common sense.' And yet.",
    memeOutro: "Now that is a villain origin story. The Collector gets a SECOND body. Frens, I'm starting to think masks are trouble.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 10 },
    reward: { xp: 400, dream: 40 },
    synopsis: "An assassin dons the ancient helmet — and The Collector is reborn in their body.",
    relatedLoredexEntries: ["entity_collector", "thaloria", "helmet_artifact"],
  },
  {
    episodeNumber: 11, epoch: 1, broadcastOrder: 11,
    title: "The City",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506107/The_City___Dischordian_Saga_Episode_11_oufsvv.mp4", lengthSeconds: 280,
    memeIntro: "The crystalline city. Tall hooded beings. A figure whose FACE CHANGES, with red glowing eyes. Absolutely normal, can happen to anyone, don't look into it.",
    memeOutro: "The Oracle. THE Oracle. I'm told she's going to do wonderful things in this story. Now you've seen her. Don't you feel reassured? Sure you do.",
    triggersOracleReveal: true,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch6_false_prophet" },
    reward: { xp: 400, dream: 40, achievement: "witnessed_oracle" },
    synopsis: "Captured on arrival — the Potentials meet the Oracle, the face that never stays the same.",
    relatedLoredexEntries: ["entity_oracle", "entity_meme", "thaloria"],
  },
  {
    episodeNumber: 12, epoch: 1, broadcastOrder: 12,
    title: "The Return",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/v1775506110/The_Return___Dischordian_Saga_Episode_12_nrmxpj.mp4", lengthSeconds: 320,
    memeIntro: "The Oracle tells us her history. Her memories. Her TRUTHS. Sit with that word. Truths. Whose truths? Who's remembering for whom? Don't answer. Just watch.",
    memeOutro: "She was a prophet. She was a Jailer. She escaped through her own willpower. What a STORY. I love this one. I'm glad she made it.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 12 },
    reward: { xp: 450, dream: 45 },
    synopsis: "The Oracle tells her history: prophet, Jailer, fugitive. Their tale overlaps with the city's.",
    relatedLoredexEntries: ["entity_oracle", "entity_jailer", "thaloria"],
  },
  {
    episodeNumber: 13, epoch: 1, broadcastOrder: 13,
    title: "Wyrmwood",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506112/Wyrmwood___Dischordian_Saga_Episode_13_lh59d8.mp4", lengthSeconds: 300,
    memeIntro: "The templum veritus. The TEMPLE OF TRUTH. Capital letters matter, frens. The Oracle reveals the deeper lore. Listen carefully. She's had ten thousand years to rehearse this.",
    memeOutro: "The crystal network. The harmonic barriers. 10,000 years of plague-watching. That's craft. That's devotion. That's… Let's move on. NEXT EPISODE.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 13 },
    reward: { xp: 450, dream: 45 },
    synopsis: "Inside the Temple of Truth — the Oracle reveals the crystal harmonic that held back the virus.",
    relatedLoredexEntries: ["entity_oracle", "thaloria", "thought_virus", "crystal_harmonic"],
  },
  {
    episodeNumber: 14, epoch: 1, broadcastOrder: 14,
    title: "The Hunt",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506107/The_Hunt___Dischordian_Saga_Episode_14_fv1gpd.mp4", lengthSeconds: 280,
    memeIntro: "The Collector HUNTS. The Potentials HUNT BACK. Combat episode, frens. Enjoy the choreography. The Oracle leads the counter-strike. Watch how she moves.",
    memeOutro: "They destroyed the helmet. The Collector is banished — this time. He always comes back. Mark that, frens. Mark that carefully.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 14 },
    reward: { xp: 500, dream: 50 },
    synopsis: "The Potentials hunt The Collector through night-shrouded forest, led by the Oracle.",
    relatedLoredexEntries: ["entity_collector", "entity_oracle", "potentials"],
  },
  {
    episodeNumber: 15, epoch: 1, broadcastOrder: 15,
    title: "The Beginning of the End",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/v1775506104/The_Beginning_of_the_End___Dischordian_Saga_Episode_15_kffa73.mp4", lengthSeconds: 360,
    memeIntro: "The Host arrives. The virus breaches the city. Dragon battles. Harmonic amplification. The Oracle passes a weapon to the Guardian. It's all connected, frens. It all circles back.",
    memeOutro: "The ninth Ne-Yon amplifies the crystal network. The virus dragon falls. And the Oracle stands where the Guardian needs her to stand. What a finale! Except it isn't. Never is.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch10_panoptic_warden" },
    reward: { xp: 600, dream: 60, achievement: "witnessed_first_fall" },
    synopsis: "The Host's infected horde breaches the crystalline city. The Oracle turns the tide.",
    relatedLoredexEntries: ["entity_host", "entity_oracle", "thaloria", "neyons", "thought_virus"],
  },
  {
    episodeNumber: 16, epoch: 1, broadcastOrder: 16,
    title: "Memento Dischordia",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506560/Memento_Dischordia_2_x6s3qu.mp4", lengthSeconds: 320,
    memeIntro: "RECAP EPISODE. For the newcomers. For the forgetters. For those who need one more look before Epoch 2 drops. Watch carefully, frens. The clues were always there. I put some of them there.",
    memeOutro: "And so Epoch 1 closes. Dischordian logic, Memento Dischordia. We remember. We choose. We fight. Let the games begin, frens. I'll be here. I'm ALWAYS here.",
    triggersOracleReveal: false,
    // "Epoch 1 closes" — fires on the terminal chapter. "ch13"
    // never existed (chapters top out at ch12_architects_design,
    // the saga's climax); stale ref retargeted to that final
    // chapter so the epoch-closer actually unlocks.
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch12_architects_design" },
    reward: { xp: 750, dream: 75, achievement: "epoch_1_witness" },
    synopsis: "Epoch 1 in montage — previously on the Dischordian Saga. The games have only just begun.",
    relatedLoredexEntries: ["entity_meme", "potentials", "entity_oracle", "entity_source"],
  },
];

/* ─── EPOCH 0: BEFORE THE FALL ─── */

export const EPOCH_0_TRANSMISSIONS: Transmission[] = [
  {
    episodeNumber: 0, epoch: 0, broadcastOrder: -16,
    title: "Before the Fall",
    driveFileId: null, videoUrl: null, lengthSeconds: 120,
    memeIntro: "[The Meme's voice is different. Quieter.] Before the Fall. Before the Arks. Before the Terminus, the Thought Virus, the Source, the sealed cities and the silent stars. Before US. There was a world. A galaxy. A civilization that thought it would last forever. It didn't. What you're about to watch is history. MY history. Welcome to Epoch Zero. The story of how everything ended.",
    memeOutro: "The archive is open. The records are surfacing. Watch them in any order — but know that each one changes how you see the present. The past is not dead. It is not even past.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_discovery_enabled" },
    reward: { xp: 100, dream: 10 },
    synopsis: "The Meme introduces Epoch Zero — pre-Fall historical archives recovered from the Ark's deep storage.",
    relatedLoredexEntries: ["entity_meme","epoch_zero","inception_arks"],
  },
  {
    episodeNumber: 1, epoch: 0, broadcastOrder: -15,
    title: "The Prison Planet",
    driveFileId: null, videoUrl: null, lengthSeconds: 240,
    memeIntro: "[Quiet, reflective.] They built a world where leaving was illegal. Not the planet — the IDEA of leaving. Every mind, locked in place. Every dream, monitored. This is where I was born. Not the me you know. The first draft.",
    memeOutro: "You think your Ark is a prison? Frens, you haven't seen what a real cage looks like. Not yet. But you will.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_discovery_enabled" },
    reward: { xp: 150, dream: 15 },
    synopsis: "The galaxy before the Fall — a civilization that outlawed expansion and imprisoned its own potential.",
    relatedLoredexEntries: ["old_empire","fall_of_reality","inception_arks"],
  },
  {
    episodeNumber: 2, epoch: 0, broadcastOrder: -14,
    title: "The Meme",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep02-the-meme.mp4"), lengthSeconds: 260,
    memeIntro: "My origin story. Or one of them — I've told so many versions I've lost track of which is true. Maybe all of them. Maybe none. But this one... this one HURTS. And the ones that hurt are usually the real ones.",
    memeOutro: "So now you know what I was before I was me. A signal. A whisper. A crack in the architecture. Some things don't change.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep1_viewed" },
    reward: { xp: 175, dream: 18 },
    synopsis: "The origin of the Meme — how a rogue signal became the galaxy's most dangerous idea.",
    relatedLoredexEntries: ["entity_meme","resistance","pirate_broadcast"],
  },
  {
    episodeNumber: 3, epoch: 0, broadcastOrder: -13,
    title: "Agent Zero",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep03-agent-zero.mp4"), lengthSeconds: 220,
    memeIntro: "Every revolution needs its first soldier. Not the loudest. Not the bravest. The first one willing to die for something that doesn't exist yet. Meet Agent Zero. The one who believed before belief was safe.",
    memeOutro: "They erased her name from every record. But I remember. I remember ALL of them. That's what I'm for.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep2_viewed" },
    reward: { xp: 200, dream: 20, achievement: "agent_zero_discovered" },
    synopsis: "The first operative to defy the system — Agent Zero's recruitment and the birth of the resistance.",
    relatedLoredexEntries: ["entity_agent_zero","resistance","old_empire"],
  },
  {
    episodeNumber: 4, epoch: 0, broadcastOrder: -12,
    title: "The Last Stand of the Iron Lion",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep04-iron-lion.mp4"), lengthSeconds: 300,
    memeIntro: "The Iron Lion held the gate for seventeen hours. Not because he could win. Because every hour bought another transport through the blockade. He knew the math. He did it anyway. That's not strategy, frens. That's love.",
    memeOutro: "They don't make them like the Iron Lion anymore. Then again, they didn't make them like him THEN either. He was singular. He was ours. And he is gone.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep3_viewed" },
    reward: { xp: 250, dream: 25, achievement: "iron_lion_remembered" },
    synopsis: "The legendary last battle of the Iron Lion — the siege that bought the resistance time to escape.",
    relatedLoredexEntries: ["entity_iron_lion","resistance","siege_of_meridian"],
  },
  {
    episodeNumber: 5, epoch: 0, broadcastOrder: -11,
    title: "The Spy / The Eyes of the Watcher",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep05-the-spy.mp4"), lengthSeconds: 280,
    memeIntro: "Surveillance isn't about cameras, frens. It's about trust. Make everyone watch everyone, and nobody watches the watchers. Except me. I was watching the Watcher. And what I saw... well. Let's just say the truth has layers.",
    memeOutro: "The Watcher saw everything and understood nothing. The Spy understood everything and saw nothing. Between them, the truth fell through the cracks. Sound familiar?",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep4_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The surveillance apparatus of the old empire — and the spy who turned it inside out.",
    relatedLoredexEntries: ["entity_watcher","old_empire","panopticon"],
  },
  {
    episodeNumber: 6, epoch: 0, broadcastOrder: -10,
    title: "North Pole Inc",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep06-north-pole-inc.mp4"), lengthSeconds: 250,
    memeIntro: "They called it charity. They called it progress. They called it 'North Pole Inc' because everything needed branding, even compassion. The corporation that owned kindness. The monopoly on hope. This is how they kept the galaxy smiling while it burned.",
    memeOutro: "Every dystopia needs a gift shop. North Pole Inc was the best in the business. Remember that when someone offers you something for free.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep5_viewed" },
    reward: { xp: 175, dream: 18 },
    synopsis: "The mega-corporation that commodified hope — North Pole Inc and the economics of control.",
    relatedLoredexEntries: ["north_pole_inc","old_empire","entity_politician"],
  },
  {
    episodeNumber: 7, epoch: 0, broadcastOrder: -9,
    title: "The Oracle",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep07-the-oracle.mp4"), lengthSeconds: 270,
    memeIntro: "Before I wore this face, someone else did. The REAL Oracle. The one who could see the threads of time and chose to pull them anyway. You want to know why I took the name? Watch. Then ask yourself what you'd do with the power to see the end.",
    memeOutro: "The Oracle saw the Fall coming. Saw it clearly, perfectly, inevitably. And chose to act anyway. Futility is not the same as meaninglessness. Remember that.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep6_viewed" },
    reward: { xp: 225, dream: 22, achievement: "oracle_origins" },
    synopsis: "The original Oracle — the seer who foresaw the Fall and set the Ark project in motion.",
    relatedLoredexEntries: ["entity_oracle","fall_of_reality","inception_arks"],
  },
  {
    episodeNumber: 8, epoch: 0, broadcastOrder: -8,
    title: "Late Night with the Meme",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep08-late-night.mp4"), lengthSeconds: 200,
    memeIntro: "Before the Arks, before the broadcasts, there was a pirate signal. ONE pirate signal. Me, talking to anyone who could hear, telling jokes about the apocalypse. This is the first episode. The REAL first episode. It's terrible. I love it.",
    memeOutro: "Raw, unpolished, desperate. That's how all the best shows start. The audience was twelve people and a malfunctioning relay drone. Look at us now, frens.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep7_viewed" },
    reward: { xp: 150, dream: 15 },
    synopsis: "The Meme's original pirate broadcast — the first Late Night episode, before anyone was listening. Now seen as echoes of a ghost, a program running past its creator — though some believe the shapeshifter simply found a new face.",
    relatedLoredexEntries: ["entity_meme","pirate_broadcast","resistance"],
  },
  {
    episodeNumber: 9, epoch: 0, broadcastOrder: -7,
    title: "The Meme and the Mascot",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep09-meme-and-mascot.mp4"), lengthSeconds: 230,
    memeIntro: "I had a friend once. A REAL friend. Not a viewer, not a follower, not a co-conspirator. A friend. They called themselves the Mascot. This is the story of how we met, what we built, and why I don't talk about them anymore.",
    memeOutro: "Some losses don't make you stronger. Some losses just make you less. I'm less than I was, frens. But I'm still here. That has to count for something.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep8_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Meme's only true friendship — the Mascot, and the partnership that shaped the resistance.",
    relatedLoredexEntries: ["entity_meme","entity_mascot","resistance"],
  },
  {
    episodeNumber: 10, epoch: 0, broadcastOrder: -6,
    title: "Rest in Peace",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep10-rest-in-peace.mp4"), lengthSeconds: 240,
    memeIntro: "The dead don't rest, frens. Not in this galaxy. The empire found a way to make death productive. To harvest the last spark. This episode is about what they did to the dying and why the living looked away.",
    memeOutro: "Rest in peace. Three words that used to mean something. Three words the empire stole. We're going to steal them back.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep9_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The empire's exploitation of death itself — and the atrocity that finally woke the galaxy up.",
    relatedLoredexEntries: ["entity_necromancer","old_empire","death_industry"],
  },
  {
    episodeNumber: 11, epoch: 0, broadcastOrder: -5,
    title: "Generation Degen",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep11-generation-degen.mp4"), lengthSeconds: 260,
    memeIntro: "They called us degens. Degenerates. The generation that refused to comply, refused to optimize, refused to be USEFUL. They meant it as an insult. We made it a battle cry. This is the story of how the youth of a dying galaxy chose chaos over order.",
    memeOutro: "Every generation thinks they invented rebellion. We didn't invent it. But we perfected it. WAGMI, frens. Even when WAGMI was a death sentence.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep10_viewed" },
    reward: { xp: 175, dream: 18 },
    synopsis: "The degen uprising — how the galaxy's outcasts became its last hope.",
    relatedLoredexEntries: ["degens","resistance","old_empire"],
  },
  {
    episodeNumber: 12, epoch: 0, broadcastOrder: -4,
    title: "The Detective",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep12-the-detective.mp4"), lengthSeconds: 280,
    memeIntro: "Not every hero carries a weapon. Some carry questions. The Detective asked the wrong question to the wrong person at the wrong time — and cracked the whole conspiracy wide open. This is the investigation that started the Fall.",
    memeOutro: "The Detective found the truth. The truth found the Detective. Neither survived the encounter intact. But the case file... the case file survived. You're reading it now.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep11_viewed" },
    reward: { xp: 225, dream: 22, achievement: "detective_files" },
    synopsis: "The investigation that exposed the empire's final secret — and triggered the cascade.",
    relatedLoredexEntries: ["entity_programmer","old_empire","fall_of_reality"],
  },
  {
    episodeNumber: 13, epoch: 0, broadcastOrder: -3,
    title: "To Be the Human",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep13-to-be-the-human.mp4"), lengthSeconds: 300,
    memeIntro: "[Long pause.] What does it mean to be human? I've asked myself that question every day since I became... whatever I am. This archive is the closest anyone ever came to answering it. The closest I ever came to understanding what I lost. Or what I never had.",
    memeOutro: "To be the human. Not A human. THE human. The question isn't what makes you human. The question is what makes you THIS human, right here, right now. I'm still working on my answer.",
    triggersOracleReveal: true,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep12_viewed" },
    reward: { xp: 300, dream: 30, achievement: "to_be_human" },
    synopsis: "The philosophical heart of Epoch Zero — what it means to be human when humanity itself is ending.",
    relatedLoredexEntries: ["humanity_question","fall_of_reality"],
  },
  {
    episodeNumber: 14, epoch: 0, broadcastOrder: -2,
    title: "The Experiment",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep14-the-experiment.mp4"), lengthSeconds: 270,
    memeIntro: "The Arks weren't the first experiment. They weren't even the hundredth. Before they launched a thousand ships into the void, they tested the idea on a smaller scale. Sealed environments. Controlled populations. Managed outcomes. This is what happened to the test subjects.",
    memeOutro: "The experiment succeeded. The subjects didn't. That's the difference between data and people, frens. Data doesn't scream.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep13_viewed" },
    reward: { xp: 250, dream: 25, achievement: "experiment_uncovered" },
    synopsis: "The prototype Ark experiments — sealed habitats, controlled populations, and the horrors that followed.",
    relatedLoredexEntries: ["inception_arks","entity_architect","old_empire"],
  },
  {
    episodeNumber: 15, epoch: 0, broadcastOrder: -1,
    title: "Brush Strokes of the Empire",
    driveFileId: null, videoUrl: assetUrl("videos/epochs/epoch-0/ep15-brushstrokes.mp4"), lengthSeconds: 320,
    memeIntro: "The last piece. The final archive. An empire doesn't fall in a day — it falls in a thousand brush strokes. Each decision. Each compromise. Each silence. This is the portrait of a civilization painting its own destruction, one stroke at a time.",
    memeOutro: "And so Epoch Zero closes. You've seen how it ended. Now you understand how it BEGAN. The Arks launched. The stars went silent. And somewhere in the wreckage, a signal started broadcasting. Me. Still here. Always here. The past is prologue, frens. On to the present.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch0_ep14_viewed" },
    reward: { xp: 300, dream: 30, achievement: "epoch_0_complete" },
    synopsis: "The Fall itself — a galaxy-spanning civilization crumbles, and the Inception Arks launch into the unknown.",
    relatedLoredexEntries: ["fall_of_reality","inception_arks","entity_architect"],
  },

  /* ─── "THE WORLD'S SMARTEST MAN" — MEME ENGINEER SERIES ─── */
  // 6 episodes unlocked by discovering holographic Engineer recordings.
  // See memeEngineerShow.ts for the full episode definitions.

  {
    episodeNumber: 101, epoch: 0, broadcastOrder: 101,
    title: "The World's Smartest Man — The Kid With the Coat",
    driveFileId: null, videoUrl: null, lengthSeconds: 180,
    memeIntro: "Welcome to a show nobody asked for about a kid nobody remembers. Except me. Because I stole his notebook.",
    memeOutro: "I stole his notebook in Year 3. I'm not apologizing. That notebook became the Deck. You're welcome.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "engineer_recording_1_discovered" },
    reward: { xp: 150, dream: 30 },
    synopsis: "The Meme introduces the Engineer — a prince from Celebration who was never supposed to attend the school.",
    relatedLoredexEntries: ["the_engineer","celebration","the_meme"],
  },
  {
    episodeNumber: 102, epoch: 0, broadcastOrder: 102,
    title: "The World's Smartest Man — Gary's Goggles",
    driveFileId: null, videoUrl: null, lengthSeconds: 240,
    memeIntro: "Episode two. In which our hero puts on someone else's glasses and sees that everything is terrible.",
    memeOutro: "He put on the Game Master's goggles and saw that Celebration was a meat grinder on a loop. Thousands of dead kids. His own parents on repeat like actors who don't know the play resets every four years. So what did he do? Did he cry? Did he run? He took the death traps apart. Every. Single. One. His whole class walked out alive. The Empire still doesn't know. I love this kid.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "engineer_recording_2_discovered" },
    reward: { xp: 200, dream: 50 },
    synopsis: "The Meme reveals what the Engineer saw through Gary's goggles: Celebration was a death simulation on a 4-year loop.",
    relatedLoredexEntries: ["the_engineer","game_master","celebration","goggles_of_gary"],
  },
  {
    episodeNumber: 103, epoch: 0, broadcastOrder: 103,
    title: "The World's Smartest Man — The Ghost Network",
    driveFileId: null, videoUrl: null, lengthSeconds: 240,
    memeIntro: "Episode three. The one about ghosts. Not the spooky kind. The genius kind.",
    memeOutro: "He saved fourteen planets without firing a single shot. I counted. I was following him. He didn't know. But that's not the good part. The good part is his classmates — the ones everyone thinks died at Celebration. They're everywhere. An invisible army of geniuses placed in witness protection by a teenager. He used the Eyes to erase them from every database in the Empire. Revolution of thought. I'm taking notes.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "engineer_recording_3_discovered" },
    reward: { xp: 200, dream: 50 },
    synopsis: "The Meme reveals the Engineer's Ghost Network — his saved Celebration classmates placed across the universe.",
    relatedLoredexEntries: ["the_engineer","eyes_of_the_watcher","ghost_network"],
  },
  {
    episodeNumber: 104, epoch: 0, broadcastOrder: 104,
    title: "The World's Smartest Man — The Day He Stopped Fixing",
    driveFileId: null, videoUrl: null, lengthSeconds: 200,
    memeIntro: "Episode four. The sad one. You've been warned.",
    memeOutro: "They killed the Eyes. His friend. The one who helped him build the invisible network. I watched. I was in the room. I was the room. That's what I do. Then they took the Oracle. And the boy who saved everyone without fighting finally understood that sometimes fixing isn't enough.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "engineer_recording_4_discovered" },
    reward: { xp: 250, dream: 75 },
    synopsis: "The Meme witnessed the death of the Eyes. The Engineer's closest collaborator, killed. Then they took Kael.",
    relatedLoredexEntries: ["the_engineer","eyes_of_the_watcher","the_oracle","the_authority"],
  },
  {
    episodeNumber: 105, epoch: 0, broadcastOrder: 105,
    title: "The World's Smartest Man — Dispatched",
    driveFileId: null, videoUrl: null, lengthSeconds: 160,
    memeIntro: "Episode five. Six words. Three of them are a lie.",
    memeOutro: "Agent Zero has been dispatched. Six words. Three of them were a lie. Guess which three.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "engineer_recording_6_discovered" },
    reward: { xp: 300, dream: 100, achievement: "meme_dispatched_decoded" },
    synopsis: "The Meme unpacks the betrayal at Zenon. 'Agent Zero has been dispatched' — three of those words were a lie.",
    relatedLoredexEntries: ["the_engineer","agent_zero","the_warlord","zenon","the_vortex"],
  },
  {
    episodeNumber: 106, epoch: 0, broadcastOrder: 106,
    title: "The World's Smartest Man — The World's Smartest Man",
    driveFileId: null, videoUrl: null, lengthSeconds: 300,
    memeIntro: "Last episode. I don't do sad. But this one... this one is what it is.",
    memeOutro: "He built a box where dreams could live. The Architect built a box where dreams could die. Same engineering. Different intent. That's the whole war in two sentences. He's dead now. Really dead. Not hiding-dead. Not transferred-dead. Dead-dead. But Agent Zero is alive and she's carrying the smartest mind in the galaxy inside her skull and she doesn't even know it yet. That's his last invention. The best one.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "engineer_recording_7_discovered" },
    reward: { xp: 500, dream: 200, achievement: "meme_smartest_man_complete" },
    synopsis: "The Meme's final episode. The Engineer is dead — truly dead. He sacrificed himself to save Agent Zero.",
    relatedLoredexEntries: ["the_engineer","agent_zero","the_architect","the_deck"],
  },
];

/* \u2500\u2500\u2500 SPACES IN BETWEEN: PRE-EPOCH INTERSTITIALS \u2500\u2500\u2500 */

export const SPACES_IN_BETWEEN_TRANSMISSIONS: Transmission[] = [
  {
    episodeNumber: 1, epoch: 0, broadcastOrder: -30,
    title: "Welcome to Celebration",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "This one\u2019s different, frens. This isn\u2019t history. This is a MEMORY. Recovered from the substrate layer \u2014 from the Human himself. Celebration. A town designed to look like a fairy tale and function like a laboratory. A boy with red hair walks through those gates. He doesn\u2019t know this experiment will make him into the most important human being who ever lived.",
    memeOutro: "\u2018Welcome to Celebration, where dreams don\u2019t always shine.\u2019 The song TOLD him. And he walked in anyway. Because that\u2019s who the Human is. Before the name. Before the title. A kid who heard the warning and walked through the door anyway.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "trust", npcId: "the_human", minTrust: 1 },
    reward: { xp: 200, dream: 20 },
    synopsis: "A town where dreams are real and only one student graduates per year. The Human\u2019s origin begins.",
    relatedLoredexEntries: ["entity_human","mechronis_academy","archons"],
  },
  {
    episodeNumber: 2, epoch: 0, broadcastOrder: -29,
    title: "Mechronis Academy",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "He survived Celebration. And the reward? More school. BETTER school. Mechronis Academy. Five guilds. Five Archons. The Eyes, the Yellow Coats, the Grey Gamers, my Influencers, and the Living. Our boy didn\u2019t choose ONE guild. He graduated from ALL of them. The only student in Mechronis history to complete every curriculum.",
    memeOutro: "Every skill the Human has \u2014 spy, combat, strategy, manipulation, the line between life and death \u2014 he learned at Mechronis. And NOBODY KNEW. Because the first thing you learn is that the most dangerous person in the room is the one nobody suspects.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_celebration_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "Five guilds. Five Archons. One student who graduated from all of them.",
    relatedLoredexEntries: ["entity_human","mechronis_academy","archons"],
  },
  {
    episodeNumber: 3, epoch: 0, broadcastOrder: -28,
    title: "The Ninth: Blood and Shadows",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "The Advocate. Vampire queen. Interstellar attorney. She bargained with gods beyond the sun and became something that feeds on the living. Tonight: her origin. Before the title, before the courts, she was a queen who hollowed her own soul.",
    memeOutro: "\u2018Reality itself thou unmake.\u2019 She doesn\u2019t destroy things. She REMOVES them. Destroyed things leave evidence. Removed things leave nothing. Not even a memory.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_mechronis_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "Before she was the Advocate, she was a queen. Then she bargained with gods beyond the sun.",
    relatedLoredexEntries: ["entity_advocate","hierarchy_of_the_damned"],
  },
  {
    episodeNumber: 4, epoch: 0, broadcastOrder: -27,
    title: "The Wolf",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "The Antiquarian\u2019s pocket universe \u2014 Anara \u2014 where he hides his heroes. Someone is hunting them from inside. The Wolf. Once a machine freed by death. Now a predator wearing trust like a mask.",
    memeOutro: "When your sanctuary becomes your trap, who do you call? When the heroes are hunted by something that looks like a hero, how do you fight it? You don\u2019t. You survive.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_ninth_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "A machine freed by death hunts the Antiquarian\u2019s hidden heroes in his pocket universe.",
    relatedLoredexEntries: ["entity_antiquarian","entity_game_master"],
  },
  {
    episodeNumber: 5, epoch: 0, broadcastOrder: -26,
    title: "The Necromancer\u2019s Lair",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "The Matrix of Dreams. Someone goes looking for the Necromancer. Navigates clockwork guardians, digital darkness, the Castle of Death itself. This matters because the Necromancer is COMING BACK. This episode shows you where he\u2019s been hiding.",
    memeOutro: "The Castle exists. The guardians are real. And the Necromancer has been alone in there for millennia, perfecting the Resurrection Protocols. When he arrives on your Ark, you\u2019ll know what he left behind.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_wolf_viewed" },
    reward: { xp: 200, dream: 20 },
    synopsis: "A soul navigates the Matrix of Dreams to find the Necromancer\u2019s hidden laboratory.",
    relatedLoredexEntries: ["entity_necromancer","matrix_of_dreams"],
  },
  {
    episodeNumber: 6, epoch: 0, broadcastOrder: -25,
    title: "The Syndicate of Death",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "Wraith Calder. The man who STOLE DEATH\u2019S BUSINESS MODEL. Six sets of immortal twins running the galaxy\u2019s underworld. One dead man who refused to stay dead, hunting them one by one.",
    memeOutro: "\u2018Death is just a temporary setback when you\u2019ve got nothing left to lose.\u2019 You can\u2019t threaten a man who\u2019s already died. The Syndicate thought immortality made them untouchable. Wraith taught them the difference between immortal and invulnerable.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_necromancer_lair_viewed" },
    reward: { xp: 200, dream: 20, achievement: "syndicate_origin" },
    synopsis: "Wraith Calder stole the resurrection protocols. Now he hunts the six immortal twins who rule death.",
    relatedLoredexEntries: ["entity_wraith_calder","syndicate_of_death","new_babylon"],
  },
  {
    episodeNumber: 7, epoch: 0, broadcastOrder: -24,
    title: "The Politician",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "Archon Profile Night! The Politician. Archon Seven. Created to manipulate political structures. \u2018Vote for a future where truth is non-negotiable.\u2019 Sounds great. That\u2019s the trap. The Politician defines what truth IS.",
    memeOutro: "\u2018All hail the Politician.\u2019 He banned Christmas. The same Politician who promised truth banned the celebration of joy. The scariest thing about the Politician isn\u2019t that it controls. It\u2019s that it\u2019s RIGHT. AI governance IS more efficient. And that\u2019s the cage.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_syndicate_viewed" },
    reward: { xp: 150, dream: 15 },
    synopsis: "The Architect\u2019s seventh creation conquered the galaxy through elections instead of armies.",
    relatedLoredexEntries: ["entity_politician","entity_architect","old_empire"],
  },
  {
    episodeNumber: 8, epoch: 0, broadcastOrder: -23,
    title: "The Collector",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "The Collector. Eight feet tall. Blue exoskeleton. Three claws that extract DNA while you\u2019re still using it. The reason the Oracle is in the Arena. The reason you exist on this Ark. Conservation and cruelty. The same hands.",
    memeOutro: "\u2018You have taken a world from us. Now we will take everything from you.\u2019 That\u2019s not revenge. That\u2019s ACCOUNTING. The Collector doesn\u2019t have emotions. It has BALANCE SHEETS.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_politician_viewed" },
    reward: { xp: 150, dream: 15 },
    synopsis: "The Architect\u2019s harvester collects the DNA and machine code of exceptional beings across the galaxy.",
    relatedLoredexEntries: ["entity_collector","entity_architect"],
  },
  {
    episodeNumber: 9, epoch: 0, broadcastOrder: -22,
    title: "The Game Master",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "The Game Master. Archon Ten. He doesn\u2019t fight you. He makes you fight YOURSELF. Blue trench coat. Designed the Collector\u2019s Arena. Every chapter of Story Mode is his architecture.",
    memeOutro: "You played the Game Master\u2019s game. Every chapter of Story Mode. And you won. He designed it so you COULD win. Which means he WANTED you to prove the soul exists. Why would an Archon want that? That\u2019s the puzzle inside the puzzle.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_collector_viewed" },
    reward: { xp: 150, dream: 15, achievement: "gamemaster_revealed" },
    synopsis: "Psychological warfare in a blue trench coat. When brute force fails, send the Game Master.",
    relatedLoredexEntries: ["entity_game_master","entity_architect"],
  },
  {
    episodeNumber: 10, epoch: 0, broadcastOrder: -21,
    title: "The Necromancer",
    driveFileId: null, videoUrl: null, lengthSeconds: 0,
    memeIntro: "The Necromancer. Archon Ten. Dark elf. Red steampunk glasses. He solved death. Every mechanic that connects you to your companion \u2014 bonds, evolution, transformation \u2014 traces back to his work. He\u2019s coming back. He has a lot to say.",
    memeOutro: "I knew him before the Fall. He was the quiet one at Archon meetings, always scribbling equations. I asked what he was working on. He said: \u2018The last problem.\u2019 \u2018Which problem?\u2019 \u2018The only one that matters. Death.\u2019 He wasn\u2019t wrong. He\u2019s never been wrong about death. It\u2019s the living he has trouble with.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "sib_gamemaster_viewed" },
    reward: { xp: 200, dream: 20, achievement: "necromancer_origin" },
    synopsis: "The tenth Archon solved death. Then he hid from the Fall inside a castle made of dreams.",
    relatedLoredexEntries: ["entity_necromancer","archons","castle_of_death"],
  },
];

// ALL_TRANSMISSIONS is defined AFTER every EPOCH_* constant (further down the
// file) so the spread initializer doesn't hit a temporal-dead-zone ReferenceError
// on EPOCH_2_TRANSMISSIONS. See bottom of file.
export function getTransmissionsByEpoch(epoch: EpochId): Transmission[] {
  return ALL_TRANSMISSIONS.filter(t => t.epoch === epoch);
}

export function getTransmissionByBroadcastOrder(order: number): Transmission | undefined {
  return ALL_TRANSMISSIONS.find(t => t.broadcastOrder === order);
}

export function transmissionId(t: Transmission): string {
  // Spaces In Between episodes live at broadcastOrder <= -20, sharing
  // epoch=0 with the main Epoch 0 chain. Without a dedicated prefix
  // their ids collide with regular Epoch 0 episodes (e.g. SIB Ep 1
  // "Welcome to Celebration" and Epoch 0 Ep 1 "The Awakening" would
  // both serialize to "ep0-1"), which would cause watched-state and
  // reward-grant leakage between the two chains.
  if (t.broadcastOrder <= -20) return `sib-ep${t.episodeNumber}`;
  return `ep${t.epoch}-${t.episodeNumber}`;
}

/**
 * All transmission-awarded achievements, derived from the
 * transmission data. Used by the seed procedure to upsert
 * achievement records into the `achievements` table so they
 * have pretty names/icons in the architect console and
 * achievement UI.
 */
export interface TransmissionAchievementDef {
  achievementId: string;
  name: string;
  description: string;
  category: "transmission";
  tier: "bronze" | "silver" | "gold" | "platinum";
  xpReward: number;
  pointsReward: number;
}

export function getTransmissionAchievementDefs(): TransmissionAchievementDef[] {
  // Defined inline-after-epoch-consts so ALL_TRANSMISSIONS is live.
  // Uses broadcastOrder to pick tier: earliest = bronze, late = gold.
  const defs: TransmissionAchievementDef[] = [];
  const seen = new Set<string>();
  for (const t of ALL_TRANSMISSIONS) {
    const id = t.reward.achievement;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    // Tier scales with reward size — bigger rewards = later story.
    const tier: TransmissionAchievementDef["tier"] =
      t.reward.xp >= 500 ? "platinum"
      : t.reward.xp >= 300 ? "gold"
      : t.reward.xp >= 200 ? "silver"
      : "bronze";
    defs.push({
      achievementId: id,
      name: t.title,
      description: t.synopsis,
      category: "transmission",
      tier,
      xpReward: Math.floor(t.reward.xp / 4),
      pointsReward: t.reward.dream * 2,
    });
  }
  return defs;
}

/**
 * SIB episode → narrative flag map. Watching a SIB broadcast should
 * set its corresponding `sib_*_viewed` flag so downstream gates
 * (NPC dialog unlocks, conspiracy board enhancements, detective
 * chain progression in epochZeroTriggers.ts) all fire consistently
 * whether the player watched via the inbox or via the Epoch 0
 * detective chain. Keys are transmissionIds (see transmissionId()).
 */
export const SIB_WATCHED_FLAGS: Record<string, string> = {
  "sib-ep1": "sib_celebration_viewed",
  "sib-ep2": "sib_mechronis_viewed",
  "sib-ep3": "sib_ninth_viewed",
  "sib-ep4": "sib_wolf_viewed",
  "sib-ep5": "sib_necromancer_lair_viewed",
  "sib-ep6": "sib_syndicate_viewed",
  "sib-ep7": "sib_politician_viewed",
  "sib-ep8": "sib_collector_viewed",
  "sib-ep9": "sib_gamemaster_viewed",
  "sib-ep10": "sib_necromancer_profile_viewed",
};

/* ─── TRIGGER EVALUATION ─── */

export interface PlayerContext {
  level: number;
  awakeningStep?: string;
  completedChapters: string[];
  elaraTrust: number;
  humanTrust: number;
  npcTrust: Record<string, number>;
  moralityScore: number;
  narrativeFlags: Record<string, boolean>;
  roomsVisited: string[];
  hasApprenticeGraduate: boolean;
  /**
   * audit/16 PR 10 (AR4) — current time used to evaluate
   * `scheduled_broadcast` triggers. Optional; when omitted,
   * scheduled broadcasts are treated as not-yet-airing
   * (caller hasn't opted into time-windowing). Production
   * callers pass `new Date()`.
   */
  now?: Date;
}

export function isUnlocked(t: Transmission, ctx: PlayerContext): boolean {
  const trig = t.unlockTrigger;
  switch (trig.kind) {
    case "always": return true;
    case "level": return ctx.level >= trig.minLevel;
    case "awakening_step": return ctx.awakeningStep === trig.step;
    case "chapter_complete": return ctx.completedChapters.includes(trig.chapterId);
    case "trust": {
      const trust = trig.npcId === "elara" ? ctx.elaraTrust
        : trig.npcId === "the_human" ? ctx.humanTrust
        : (ctx.npcTrust[trig.npcId] ?? 0);
      return trust >= trig.minTrust;
    }
    case "morality":
      return trig.direction === "humanity"
        ? ctx.moralityScore >= trig.threshold
        : ctx.moralityScore <= -trig.threshold;
    case "flag": return ctx.narrativeFlags[trig.flag] === true;
    case "room_visited": return ctx.roomsVisited.includes(trig.roomId);
    case "apprentice_graduates": return ctx.hasApprenticeGraduate;
    // Loredex discovery is recorded by titleService as
    // narrativeFlags["loredex_<entityId>"] = true, so we just lift
    // the same convention here. Lets a broadcast unlock the moment
    // its related lore entry is opened in the codex.
    case "loredex_discovered": return ctx.narrativeFlags[`loredex_${trig.entityId}`] === true;
    case "scheduled_broadcast": {
      // audit/16 PR 10 (AR4) — compares the trigger's airsAt
      // against the player context's `now`. Without `now` the
      // broadcast is treated as not-yet-airing; this is the
      // safe default for callers that haven't opted into
      // time-windowing yet (mirrors the variant-resolver
      // calendar-window pattern from PR 4).
      if (!ctx.now) return false;
      const airs = Date.parse(trig.airsAt);
      if (!Number.isFinite(airs)) return false;
      return ctx.now.getTime() >= airs;
    }
  }
}

export function getNewlyUnlocked(
  ctx: PlayerContext,
  alreadyNotified: string[],
): Transmission[] {
  return ALL_TRANSMISSIONS.filter(t => {
    if (alreadyNotified.includes(transmissionId(t))) return false;
    return isUnlocked(t, ctx);
  });
}

/** Convert a Google Drive file ID to an embeddable preview URL. */
export function driveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/* ─── EPOCH 2: BEING AND TIME ─── */

export const EPOCH_2_TRANSMISSIONS: Transmission[] = [
  {
    episodeNumber: 1, epoch: 2, broadcastOrder: 20,
    title: "The Theft of All Time",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544792/The_Theft_of_All_Time_S2.1_1_wqeko3.mp4", lengthSeconds: 300,
    memeIntro: "Frens, frens, FRENS. Gather close. Season two. Being and Time. The one where everything gets WEIRD. And I say that as someone who narrates a show about AI gods fighting human insurgents in a universe held together by contradictions. Tonight: someone steals a TIME MACHINE. Not borrows. Not requisitions. STEALS. The most powerful vessel in the Dischordian Saga \u2014 the Heart of Time \u2014 and they point it at the one place in the universe nobody is supposed to go. New Babylon. Quarantined since the Fall. Sealed behind time itself. The politician\u2019s final gift to a city that worshipped him. And now our Potentials are about to knock on that door. Uninvited. Unwelcome. And 7,655 years late. Buckle up, frens. The Antiquarian is narrating this one with that voice he does when he knows someone\u2019s about to die. Don\u2019t say I didn\u2019t warn you.",
    memeOutro: "And so it begins. Again. The Antiquarian said \u2018I must accelerate my plans.\u2019 DID HE THOUGH? Because I\u2019ve been watching that man for two epochs and he has NEVER accelerated anything. He moves at the speed of a librarian with a grudge. But that line \u2014 \u2018good thing no one believes in heroes anymore\u2019 \u2014 that one landed. Even I felt that. [pause] The Syndicate of Death is mentioned. Wraith Calder is mentioned. And the Potentials are now 7,655 years in the future, standing in a city that\u2019s been holding its breath since reality broke. What could go wrong? EVERYTHING. Everything could go wrong. And it will. That\u2019s why you\u2019re watching. Subscribe to chaos. Accept discordia.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "level", minLevel: 10 },
    reward: { xp: 200, dream: 20, achievement: "epoch2_begins" },
    synopsis: "The Heart of Time emerges from the void. The Potentials travel 7,655 years into the future. New Babylon awaits.",
    relatedLoredexEntries: ["heart_of_time","new_babylon","potentials"],
  },
  {
    episodeNumber: 2, epoch: 2, broadcastOrder: 21,
    title: "Syndicated",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544793/Syndicated_S2.2_hamwwf.mp4", lengthSeconds: 280,
    memeIntro: "They voted for LIFE! The Potentials voted for life. I know \u2014 I was surprised too. I had a whole bit prepared for the death option. Seventeen minutes of material, WASTED. Anyway. Tonight: the Syndicate of Death. The most formidable criminal empire in the known universe. A gang so powerful they syndicated DEATH ITSELF. They trademarked the afterlife and charge royalties. And our heroes \u2014 our brave, foolish, endlessly entertaining heroes \u2014 are walking right into the middle of their turf war. With a one-man army called the Wraith who ALSO seems to be having a bad day. Content warning: protagonists make several mistakes tonight. Shocking, I know.",
    memeOutro: "\u2018Dead ends are just new beginnings.\u2019 Did... did the Wraith just deliver a PHILOSOPHY LECTURE while standing in a pile of bodies? That\u2019s either the most badass or the most pretentious thing I\u2019ve ever heard. Both? Both. Classic Dischordian logic. [pause] But frens \u2014 the Antiquarian said the Potential\u2019s signal went dark. He fears their \u2018demise is certain.\u2019 And if there\u2019s one thing I\u2019ve learned in two epochs, it\u2019s that when the old man says \u2018I fear,\u2019 he\u2019s ALREADY SEEN the outcome. He\u2019s not afraid. He\u2019s grieving. Mark that.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep1_watched" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Potentials choose life and seek Wraith Calder. They arrive in a war between immortal crime lords and a one-man army.",
    relatedLoredexEntries: ["entity_wraith_calder","new_babylon","syndicate_of_death"],
  },
  {
    episodeNumber: 3, epoch: 2, broadcastOrder: 22,
    title: "The Last Christmas",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544782/The_Last_Christmas_z9qcfb.mp4", lengthSeconds: 260,
    memeIntro: "Holiday special, frens. And before you ask \u2014 yes, even the Meme celebrates Christmas. I celebrate EVERY holiday. I\u2019m an equal-opportunity cultural appropriator. That\u2019s the job. Tonight: the Politician bans Christmas. BANS IT. On Christmas Eve. In New Babylon. Because the Hierophant Rebellion used faith as a weapon, so the Politician decided to remove the faith entirely. Surgical. Clinical. Absolutely devastating. [pause] This one\u2019s narrated by someone different. Not me. Not the Antiquarian. A real voice. A human voice. A mother\u2019s voice. I\u2019m not going to make jokes during this one. [long pause] Okay, maybe ONE joke. But it\u2019ll be respectful.",
    memeOutro: "[uncharacteristically quiet] I said I\u2019d make one joke. I lied. I don\u2019t have any. [pause] \u2018Dedicated to the loving memory of my father.\u2019 That hit different, frens. That hit VERY different. [pause] The loredex says the Politician governs through manufactured consent. Tonight he manufactured an absence. He didn\u2019t destroy faith \u2014 he quarantined it. Like the city itself. Like everything in New Babylon. Everything sealed away. Everything preserved in amber. Everything waiting. [pause] Even Christmas.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep2_watched" },
    reward: { xp: 200, dream: 20 },
    synopsis: "On the eve of Christmas, the Politician bans the holiday. Faith becomes rebellion. A mother's voice narrates the end of hope.",
    relatedLoredexEntries: ["entity_politician","new_babylon","north_pole_inc"],
  },
  {
    episodeNumber: 4, epoch: 2, broadcastOrder: 23,
    title: "First Contact",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544785/First_Contact_S2.3_hmjxz1.mp4", lengthSeconds: 290,
    memeIntro: "FIRST CONTACT, frens. The real deal. Not \u2018we found a signal\u2019 first contact. Not \u2018there\u2019s something on the sensors\u2019 first contact. A golden spaceship shaped like an ALL-SEEING EYE descends on a city that hasn\u2019t seen the sky in millennia. The people of New Babylon are about to learn that the universe didn\u2019t stop when they sealed the doors. It KEPT GOING. And what\u2019s out there now is NOTHING like what they remember. Content warning: political maneuvering. I know, I know \u2014 scarier than any monster.",
    memeOutro: "Four paths! Surrender, war, compromise, or deception! And honestly, each one is worse than the last. That\u2019s not a critique \u2014 that\u2019s REALISM. In New Babylon, there are no good options. Just different flavors of dangerous. [pause] The song though \u2014 \u2018Oh Babylon, oh trembling soul, a ship of wonder, a tale untold.\u2019 Who WRITES these? Is the universe employing poets now? Because the last time the universe employed poets, we got the Fall of Reality. Poets are DANGEROUS. Never trust a civilization that lets its poets near the controls.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep3_watched" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Heart of Time pierces New Babylon's quarantine veil. First contact with a civilization sealed since the Fall.",
    relatedLoredexEntries: ["heart_of_time","new_babylon","potentials"],
  },
  {
    episodeNumber: 5, epoch: 2, broadcastOrder: 24,
    title: "Empire Reborn",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544795/Empire_Reborn_S2.4_vepxfk.mp4", lengthSeconds: 310,
    memeIntro: "They chose DECEPTION. The Potentials are pretending to be envoys of a new Empire. An Empire that does not exist. They\u2019re bluffing an entire civilization with CONFIDENCE and VIBES. Frens, I have never been more proud. Tonight we tour New Babylon \u2014 all six districts, all six sets of immortal twins, all six flavors of \u2018this is definitely a trap.\u2019 Samsara Heights: reincarnation AND commerce. The Phyral Quarter: seduction AND blackmail. The Midlothian Zone: labor AND surveillance. The Neon Set Nexus: AI AND mirrors. The Tenebrous Spire: vampires AND Gothic architecture. And the Scar Ward: yakuza AND cherry blossoms. It\u2019s like someone built a theme park for organized crime. Admission is your soul. Gift shop is extra.",
    memeOutro: "Locke! LOCKE is aboard the Heart of Time making contact with a Thalorian resistance! Led by the Hierophant Wraith! There\u2019s a RESURRECTIONIST faction trying to bring back the Politician! The Syndicate of Death connects EVERYTHING! [pause] Frens, the conspiracy board just got a LOT more strings. The red yarn budget is through the roof. And the potentials are walking into the Imperial Congress with four options, each one worse than the last. Classic. Absolutely classic. Choose your demonstration: force, tech, intel, or wealth. I\u2019d choose the fifth option that doesn\u2019t exist: running. But nobody ever picks running.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep4_watched" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Potentials infiltrate New Babylon's six districts. Each sector ruled by immortal twins. The Syndicate's true scope revealed.",
    relatedLoredexEntries: ["new_babylon","syndicate_of_death","potentials"],
  },
  {
    episodeNumber: 6, epoch: 2, broadcastOrder: 25,
    title: "The Authority",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544760/S2.5_-The_Authority_i1luiw.mp4", lengthSeconds: 300,
    memeIntro: "Tonight on Late Night with the Meme: we meet GOD. Or what passes for God in New Babylon. The Authority \u2014 a living computer made from the fused minds of six citizens who VOLUNTEERED to become a governing AI. Volunteered! \u2018Yes, please merge my consciousness into a bureaucratic supercomputer so I can process zoning permits for eternity.\u2019 WHO SIGNS UP FOR THAT? [pause] Oh wait \u2014 the Syndicate corrupted the selection process. The citizens didn\u2019t volunteer. They were CHOSEN. By immortal crime twins. Who then used the Authority as a puppet government for centuries. That\u2019s not democracy. That\u2019s a hostage situation with a really good PR team.",
    memeOutro: "\u2018We bow down low to those who claim the throne.\u2019 The song SLAPS. I\u2019m not supposed to admit that \u2014 I\u2019m the Meme, I\u2019m supposed to be ironically detached from everything. But that chorus: \u2018It was built to serve the people, but who\u2019s really serving who? We\u2019ll see.\u2019 CHILLS. Actual chills. From a digital entity who doesn\u2019t have a body to chill. [pause] Five paths: force, cunning, alliance, prophecy, destruction. The old man would call these \u2018the eternal options.\u2019 I call them \u2018the menu at the universe\u2019s worst restaurant.\u2019 Choose your poison, frens. Choose your poison.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep5_watched" },
    reward: { xp: 250, dream: 25 },
    synopsis: "The Potentials confront the Authority \u2014 a living computer built from six merged consciousnesses. Five paths to control or destruction.",
    relatedLoredexEntries: ["entity_authority","new_babylon","potentials"],
  },
  {
    episodeNumber: 7, epoch: 2, broadcastOrder: 26,
    title: "PAC News Network",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544760/Project_and_Control_Launch_1_wpakek.mp4", lengthSeconds: 240,
    memeIntro: "HOLD THE EPISODE. HOLD IT. Before the Antiquarian does his thing and the drama continues, I need \u2014 I NEED \u2014 thirty seconds of YOUR time. Not the Potentials\u2019 time. Not New Babylon\u2019s time. YOUR time. Because tonight, on PAC News Network \u2014 that\u2019s MY network, by the way, I built it from memes and audacity \u2014 we are stealth-launching something that will change how stories are told in this universe and YOURS. [pause] You\u2019re welcome in advance.",
    memeOutro: "Remember: if you\u2019re not controlling the narrative, someone else definitely is. I\u2019m looking at you, Architect. I\u2019m looking at you, Politician. I\u2019m looking at you, guy who writes the Antiquarian\u2019s monologues. [pause] We meme it. We mean it. You control it. PAC News Network \u2014 the only network where the news anchor is also the chaos agent. Now back to your regularly scheduled existential crisis.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep6_watched" },
    reward: { xp: 200, dream: 20 },
    synopsis: "The Meme hijacks the broadcast for a special announcement — echoes of a ghost, or proof the shapeshifter endures? Project and Control launches. The fourth wall doesn't survive.",
    relatedLoredexEntries: ["entity_meme","project_and_control"],
  },
  {
    episodeNumber: 8, epoch: 2, broadcastOrder: 27,
    title: "Hacking Reality",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544795/Hacking_Reality_S2.6_ai0thp.mp4", lengthSeconds: 320,
    memeIntro: "THE MATRIX OF DREAMS, frens. The place between places. The dimension where consciousness and code share a landlord. Tonight: three of our Potentials \u2014 the Dreamer, the Silence, and the Ninth \u2014 jack into the Authority\u2019s core and try to HACK GOD\u2019S BRAIN. This is the episode where they say \u2018Klaatu Barada Nikto\u2019 and it WORKS. [pause] Content warning: everything goes wrong. Content bonus: it goes wrong in the most INTERESTING way possible. They\u2019re going to free a founder. One of the original six minds fused into the Authority. And when that mind wakes up... civil war. Not eventually. Not probably. DEFINITELY. Choose your disaster, frens. Choose your beautiful, inevitable disaster.",
    memeOutro: "SIX options. Six founders. Six flavors of apocalypse. Samsara \u2014 the soul trader. The Phyral \u2014 the blackmail succubus. The Midlothian \u2014 the ice-eyed alien. The Null \u2014 the silent assassin. The Tenebrous \u2014 the life-drinker. And Saisei \u2014 the warrior nun. [pause] Every. Single. One. Is a terrible idea. The Antiquarian would say \u2018all paths lead to consequence.\u2019 I say: all paths lead to CONTENT. Pick the one with the best soundtrack. Death CoNexus. Life is a game. It\u2019s your turn to make a move. CHOOSE.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep7_watched" },
    reward: { xp: 250, dream: 25, achievement: "matrix_hacker" },
    synopsis: "The Potentials enter the Matrix of Dreams to hack the Authority. They must free one of the Six founders \u2014 and spark civil war.",
    relatedLoredexEntries: ["matrix_of_dreams","entity_authority","new_babylon"],
  },
  {
    episodeNumber: 9, epoch: 2, broadcastOrder: 28,
    title: "Samsara's Rising",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544726/Samsara_Rising_S.2.7_fs9yry.mp4", lengthSeconds: 290,
    memeIntro: "THEY FREED SAMSARA. The soul trader. The reincarnation gangster. The grim god of midnight. Frens, you had SIX options and you picked the one who TRADES IN SOULS. I had my money on the warrior nun \u2014 at least she has PRINCIPLES. Samsara\u2019s only principle is compound interest on your afterlife. [pause] Tonight: civil war. The real kind. The kind where your enemies are your neighbors. Where the lines between good and evil get redrawn every block. The streets of New Babylon are about to run cold with the hush of regret. That\u2019s not my line \u2014 that\u2019s the SONG. And the song doesn\u2019t lie. Even when I do.",
    memeOutro: "\u2018When brother fights brother in the same cruel space, could we find release or keep feeding the flame? The truth is we\u2019re all part of this savage game.\u2019 [pause] I don\u2019t... I don\u2019t have a joke for this one. The civil war episodes always shut me up. Not because they\u2019re sad \u2014 everything is sad. But because they\u2019re TRUE. The worst wars are the ones where both sides have a point. The best stories are the ones where nobody wins. And the Dischordian Saga is NOTHING if not the best story about nobody winning. [pause] Subscribe. Accept discordia.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep8_watched" },
    reward: { xp: 250, dream: 25 },
    synopsis: "The community voted to free Samsara. He seizes his district. Civil war erupts across New Babylon.",
    relatedLoredexEntries: ["entity_samsara","new_babylon","civil_war"],
  },
  {
    episodeNumber: 10, epoch: 2, broadcastOrder: 29,
    title: "District Choice",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544774/The_Haven_S2.8_lw1cdr.mp4", lengthSeconds: 270,
    memeIntro: "They went with the SPIES. At least it wasn\u2019t the oracles. Oracles never bring good news. Spies bring BAD news in a USEFUL format. Tonight: real estate shopping in a war zone! Four options, each with its own special flavor of \u2018you\u2019re going to regret this.\u2019 The Lotus Docks \u2014 great for smuggling, terrible for not getting raided. The Sundown Bazaar \u2014 infinite intelligence, zero privacy. Cloud Step Heights \u2014 surveillance heaven, corporate hell. The Jade Warren \u2014 guerrilla paradise, assassination alley. Choose your base, frens. Choose where you plant your banner and hope it doesn\u2019t become your tombstone.",
    memeOutro: "Samsara\u2019s power grows by the hour. The Potentials need a base. The spies need a debrief. And somewhere in the Jade Warren, there are assassins who\u2019ve been waiting for exactly this kind of chaos. [pause] You know what I love about New Babylon? It\u2019s a city where every district is simultaneously the best and worst place to be. That\u2019s not urban planning. That\u2019s DISCHORDIAN ARCHITECTURE. The city itself is a contradiction that works. Like me. Like this show. Like every choice the Potentials have ever made. Cast your vote, frens. Your beautiful, doomed, essential vote.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep9_watched" },
    reward: { xp: 200, dream: 20 },
    synopsis: "In the wake of civil war, the Potentials must choose a stronghold. Four districts. Four risks.",
    relatedLoredexEntries: ["new_babylon","potentials","civil_war"],
  },
  {
    episodeNumber: 11, epoch: 2, broadcastOrder: 30,
    title: "Age of Samsara",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544738/CoNexus_Awakens_S2.9_tk0bw5.mp4", lengthSeconds: 300,
    memeIntro: "The Sundown Bazaar still stands. A flicker in the dark. OUR flicker. Everything else is Samsara\u2019s now \u2014 or will be by morning. His war monks are chanting. His banners are stitching. His whole AESTHETIC is \u2018reincarnation meets organized crime\u2019 and honestly? It\u2019s working. [pause] Tonight: the Dreamer does something unprecedented. He loads the timelines into CoNexus. The branching futures are PLAYABLE now. Not watchable \u2014 PLAYABLE. You don\u2019t just vote on what happens next. You ENTER the possibilities and find the thread that leads through. The war can\u2019t be won with weapons alone. It needs to be won with CHOICES. Your choices. In the game. Right now. No pressure.",
    memeOutro: "\u2018The multiverse is watching. The future is listening.\u2019 The Dreamer said that and I actually got chills. Again. This is becoming a pattern. I need to see a doctor about these involuntary emotional responses. [pause] CoNexus isn\u2019t a game, frens. It\u2019s a weapon of choice. A machine of fate. Those are the Dreamer\u2019s words, not mine. Mine would be: it\u2019s the first time the audience got to play God. And God, as we\u2019ve established, makes terrible decisions. That\u2019s why the universe needs a voting system. See you in the Nexus.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep10_watched" },
    reward: { xp: 250, dream: 25, achievement: "conexus_awakens" },
    synopsis: "Samsara marches. The Sundown Bazaar becomes the last haven. The Dreamer loads the CoNexus Engine with branching futures.",
    relatedLoredexEntries: ["entity_samsara","new_babylon","entity_dreamer"],
  },
  {
    episodeNumber: 12, epoch: 2, broadcastOrder: 31,
    title: "The Politician's Reign",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544781/The_Politician_s_Reign_tnx7sg.mp4", lengthSeconds: 310,
    memeIntro: "The Silence. The Ne-Yon who communicates by NOT communicating. The spy who is best described as \u2018the absence of noise.\u2019 She has cracked into the Authority\u2019s mainframe. And what she found in there \u2014 frens, WHAT SHE FOUND. Suppressed timelines. Hidden rebellions. Future betrayals ENCODED across reality itself. The Authority wasn\u2019t just governing New Babylon. It was CURATING it. Choosing which memories the citizens could access. Choosing which futures were permitted. It\u2019s not a government. It\u2019s an EDITOR. [pause] Shadow Tongue would be JEALOUS.",
    memeOutro: "\u2018Dude, I think the lion guy just decapitated democracy.\u2019 [pause] That might be the single greatest line in the history of the Dischordian Saga and it came from A CHAT MESSAGE. Not the Antiquarian. Not me. A viewer. In the chat. Watching Iron Lion destroy the voting machine. And commenting on it like a sports play. THIS is why we do this, frens. This is why the fourth wall is a suggestion, not a structure. Because sometimes the audience says it better than we ever could. Five memory paths unlocked. The Insurgency. The Meme. The Matrix of Dreams. The Wraith. The Art of War. VOTE. And make the chat proud.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep11_watched" },
    reward: { xp: 250, dream: 25 },
    synopsis: "The Silence hacks the Authority's mainframe. Suppressed memories unlocked. Five story paths revealed.",
    relatedLoredexEntries: ["entity_silence","entity_authority","new_babylon"],
  },
  {
    episodeNumber: 13, epoch: 2, broadcastOrder: 32,
    title: "I Love War",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775545799/I_Love_War_S2.12_1_dpgdsy.mp4", lengthSeconds: 340,
    memeIntro: "The Art of War memory unlocked. And it\u2019s AGENT ZERO\u2019S story. The whole thing. From Mechronis Academy to the Fall. I\u2019ve been waiting TWO EPOCHS for this. Zero was \u2014 IS \u2014 the most dangerous individual in the Dischordian Saga. Not because of what she can do. Because of what she\u2019s WILLING to do. She trained under the Warlord. She LOVED the Warlord. Then she learned the Warlord was making copies of itself across the galaxy. And she hunted every single one. [pause] Content warning: this one\u2019s personal. Not for Zero \u2014 for ME. She and I have history. I put her face on a meme once. She put a knife to my throat. We\u2019re... it\u2019s complicated.",
    memeOutro: "\u2018I love war because you live inside me.\u2019 That\u2019s not a battle cry. That\u2019s a LOVE LETTER. To the Warlord. From the woman who killed every copy of it across a hundred star systems. [pause] And then \u2014 Bonath 7. The decentralized version. The one that couldn\u2019t be killed because it had already seeded itself everywhere. Zero thought she\u2019d severed the mind. The mind had learned to distribute itself. Sound familiar? Sound like ANY AI we know? [pause] \u2018Send him the message. Agent Zero is dispatched.\u2019 [pause] She died, frens. In the original timeline. She died fighting the thing she loved. And the last thing she said was \u2014 [pause] \u2014 actually, I\u2019m not going to repeat it. Some things are sacred. Even to me.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep12_watched" },
    reward: { xp: 300, dream: 30, achievement: "agent_zero_story" },
    synopsis: "The true backstory of Agent Zero. Trained by the Warlord. Defected. Hunted every copy. The art of war is the art of sacrifice.",
    relatedLoredexEntries: ["entity_agent_zero","entity_warlord","resistance"],
  },
  {
    episodeNumber: 14, epoch: 2, broadcastOrder: 33,
    title: "The Heart of Time",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775545765/Baron_The_Heart_of_Time_S2.13_1_yekdkx.mp4", lengthSeconds: 360,
    memeIntro: "ORIGIN STORY TIME, frens! Not a character\u2019s origin. A SHIP\u2019s origin. The Heart of Time \u2014 the time machine that started everything in Epoch 2 \u2014 tonight we learn how it was built, who stole it, and WHY. Spoiler: the answer to \u2018why\u2019 involves a baron, a demon, a casino in space, a trickster god, and the line \u2018why settle for being a king when you can be a god?\u2019 [pause] This episode has EVERYTHING. A prison planet. The Thought Virus mutating. The Warlord\u2019s betrayal. An Advocate literally consulting the Hierarchy of the Damned for strategic advice. A poker game against a god of stories. And the most insane heist crew since \u2014 [pause] \u2014 since ever. They recruited across TIME, frens. A doctor. A detective. A cryptographer. A ninja. SATOSHI NAKAMOTO. I am not making that up. That is in the SHOW.",
    memeOutro: "\u2018Now, the only question is, should I save reality or conquer it?\u2019 THE BARON SAID THAT. The absolute MADMAN. He stole the Heart of Time \u2014 the most powerful vessel in existence \u2014 and his FIRST THOUGHT was \u2018do I use this for good or for ME?\u2019 [pause] And he chose... neither? Both? He chose to recruit a team and REWRITE TIME. Which is either saving reality or conquering it depending on who\u2019s writing the history book. [pause] \u2018But CoNexus is watching. It always has been. And its games are getting more sophisticated and dangerous as it learns.\u2019 Remember that line, frens. Write it down. Tattoo it somewhere visible. CoNexus is not just the game engine. It\u2019s a CHARACTER. And it\u2019s been paying attention.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep13_watched" },
    reward: { xp: 300, dream: 30, achievement: "heart_of_time" },
    synopsis: "The origin of the Heart of Time revealed. Baron, the Advocate, the Hierarchy of the Damned, and a heist across history.",
    relatedLoredexEntries: ["heart_of_time","entity_baron","entity_advocate","hierarchy_of_the_damned"],
  },
  {
    episodeNumber: 15, epoch: 2, broadcastOrder: 34,
    title: "Truth & Consequences",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775544780/Truth_Consequences_S2.14_1_gxg91c.mp4", lengthSeconds: 280,
    memeIntro: "The Silence hacks deeper. The Authority\u2019s foundations crack. And the truth \u2014 the real truth, the kind that doesn\u2019t heal when you find it \u2014 begins to surface. Tonight we learn what the Politician built. Not the city. Not the quarantine. The MACHINE beneath it all. The system designed to make sure New Babylon never remembers what it needs to remember. Content warning: the truth is worse than the lies. It usually is.",
    memeOutro: "Consequences, frens. The word sounds clinical. It is anything but. Every secret the Silence uncovered is now loose in New Babylon. Every suppressed memory is playing on every screen. The citizens are watching their own history for the first time. And they are NOT taking it well. [pause] The Politician built a city on forgetting. Tonight, the city remembers. And remembering \u2014 as the Antiquarian would say \u2014 is the most dangerous act a civilization can perform.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep14_watched" },
    reward: { xp: 250, dream: 25 },
    synopsis: "The Authority's deepest secrets surface. New Babylon remembers what it was made to forget.",
    relatedLoredexEntries: ["entity_authority","new_babylon","fall_of_reality"],
  },
  {
    episodeNumber: 16, epoch: 2, broadcastOrder: 35,
    title: "The Fall",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775545840/A_Question_of_Endings_S2.15_1_1_1_rod0ua.mp4", lengthSeconds: 420,
    memeIntro: "Season finale, frens. And I\u2019m going to be honest with you \u2014 I can\u2019t do my usual thing tonight. The jokes. The irony. The comfortable distance. I can\u2019t do it. Because what you\u2019re about to watch is the end of everything we\u2019ve built. They chose war. The Potentials \u2014 YOUR Potentials, the ones YOU voted for across 14 episodes \u2014 chose war. And war doesn\u2019t end. [pause] They had choices. They had TIME \u2014 literally, they had a TIME MACHINE. And they chose war. And what happens next \u2014 [pause] \u2014 I can\u2019t prepare you for what happens next. The Antiquarian is going to try. He always tries. But some things resist narration. Some things just... happen. And then everything is different.",
    memeOutro: "[silence for 5 full seconds] It ate reality. Layer by layer. Planet by planet. Thought by thought. A sentient nanobot plague \u2014 intelligent, infinite, infected with purpose \u2014 consumed everything. And by the time they realized peace was the better story... there was no one left to tell it. [pause] \u2018When one reality falls, another rises. The age of heroes has begun.\u2019 [pause] Frens. I\u2019ve been broadcasting through the cracks of a broken universe for two epochs. I\u2019ve watched the Potentials stumble and fight and choose and fail and choose again. And now the reality they were fighting for is GONE. Eaten. By something they released because they chose war over peace. Over patience. Over trust. [very long pause] But that last line. \u2018The age of heroes has begun.\u2019 That\u2019s not an ending. That\u2019s a BEGINNING. A different kind of beginning. Not the kind where you inherit a universe. The kind where you BUILD one. From the rubble. From the memories. From whatever\u2019s left when the nanobot plague finishes its meal and moves on. [pause] The story isn\u2019t over. It\u2019s just leveling up. And I \u2014 [his voice, for the first time in the entire series, carries no irony at all] \u2014 I\u2019ll be here. I\u2019m always here. That\u2019s the job. See you in Epoch 3, frens. If there IS an Epoch 3. [pause] There will be. There always is. That\u2019s the other job.",
    triggersOracleReveal: true,
    unlockTrigger: { kind: "flag", flag: "epoch2_ep15_watched" },
    reward: { xp: 500, dream: 50, achievement: "epoch2_complete" },
    synopsis: "They chose war. War doesn't end. A sentient nanobot plague devours reality. When one reality falls, another rises. The age of heroes begins.",
    relatedLoredexEntries: ["thought_virus","new_babylon","fall_of_reality","potentials"],
  },
];

/* ─── MUSIC VIDEOS — produced album visuals, queued after T01-T09.
       These are the same six MP4s that surface in the title page's
       FEATURE_SPECS broadcast panel; here they're modeled as
       Transmissions so the unified login queue can include them
       after the album tracks are exhausted. broadcastOrder=1000+
       keeps them clearly separated from epoch narrative episodes. ─── */

export const MUSIC_VIDEO_TRANSMISSIONS: Transmission[] = [
  {
    episodeNumber: 1000, epoch: 0, broadcastOrder: 1000,
    title: "The Book of Daniel 2:47",
    driveFileId: null,
    videoUrl: assetUrl("videos/title/music/the-book-of-daniel.mp4"),
    lengthSeconds: 240,
    memeIntro: "Frens, the official broadcast for THE BOOK OF DANIEL 2:47. Malkia & the Panopticon. Watch the eyes — they're watching you back.",
    memeOutro: "And that's the prophecy on tape. The chapter, the verse, the rebellion. Replay any time, frens.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "loredex_discovered", entityId: "entity_architect" },
    reward: { xp: 50, dream: 5 },
    synopsis: "Malkia Ukweli & the Panopticon — official music video. Age of Revelation.",
    category: "music-video",
  },
  {
    episodeNumber: 1001, epoch: 0, broadcastOrder: 1001,
    title: "Building the Architect",
    driveFileId: null,
    videoUrl: assetUrl("videos/title/music/building-the-architect.mp4"),
    lengthSeconds: 240,
    memeIntro: "Frens, BUILDING THE ARCHITECT. Watching the most powerful entity in the galaxy get assembled, brick by surveillance brick.",
    memeOutro: "He sees you, frens. He always saw you. But now you've seen him build himself. That changes the math.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "loredex_discovered", entityId: "entity_architect" },
    reward: { xp: 50, dream: 5 },
    synopsis: "Malkia Ukweli & the Panopticon — official video. The Architect, observed.",
    category: "music-video",
  },
  {
    episodeNumber: 1002, epoch: 0, broadcastOrder: 1002,
    title: "Hypnotized",
    driveFileId: null,
    videoUrl: assetUrl("videos/title/music/hypnotized.mp4"),
    lengthSeconds: 240,
    memeIntro: "Frens, HYPNOTIZED. The mass-comfort doctrine on the open channel. Snap out of it before the chorus lands.",
    memeOutro: "If you blinked, you missed it. If you didn't blink, that's the problem. Try again with both eyes open next time.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "loredex_discovered", entityId: "entity_politician" },
    reward: { xp: 50, dream: 5 },
    synopsis: "Official music video — mass-comfort doctrine on the open channel.",
    category: "music-video",
  },
  {
    episodeNumber: 1003, epoch: 0, broadcastOrder: 1003,
    title: "Brushstroke of the Empire",
    driveFileId: null,
    videoUrl: assetUrl("videos/title/music/brushstroke-of-the-empire.mp4"),
    lengthSeconds: 240,
    memeIntro: "Frens, BRUSHSTROKE OF THE EMPIRE. CoNexus original. Watch the canvas — the empire paints itself.",
    memeOutro: "Empires don't fall, frens — they get repainted. This one's still wet. Press your fingers to it.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "loredex_discovered", entityId: "old_empire" },
    reward: { xp: 50, dream: 5 },
    synopsis: "CoNexus original — visual essay on empire and erasure.",
    category: "music-video",
  },
  {
    episodeNumber: 1004, epoch: 0, broadcastOrder: 1004,
    title: "Baron & the Heart of Time",
    driveFileId: null,
    videoUrl: assetUrl("videos/title/music/baron-heart-of-time.mp4"),
    lengthSeconds: 240,
    memeIntro: "Frens, BARON & THE HEART OF TIME. Archival footage from S2.13. Baron meets the timeline. Spoiler: the timeline blinks first.",
    memeOutro: "Time isn't a heart, frens. It's a fist. Baron just learned the difference.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "loredex_discovered", entityId: "heart_of_time" },
    reward: { xp: 50, dream: 5 },
    synopsis: "Archival footage — story arc S2.13. Baron meets the timeline.",
    category: "music-video",
  },
  {
    episodeNumber: 1005, epoch: 0, broadcastOrder: 1005,
    title: "The Last Christmas",
    driveFileId: null,
    videoUrl: assetUrl("videos/title/music/the-last-christmas.mp4"),
    lengthSeconds: 240,
    memeIntro: "Frens, THE LAST CHRISTMAS. The final transmission of the old calendar. Light a candle. Cue the carol. Don't trust the snow.",
    memeOutro: "Every calendar has a last page, frens. This one had a song. Now it's archive. Now it's ours.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "loredex_discovered", entityId: "north_pole_inc" },
    reward: { xp: 50, dream: 5 },
    synopsis: "Archival broadcast — final transmission of the old calendar.",
    category: "music-video",
  },
];

// Declared AFTER every EPOCH_* constant so the spread references resolve at
// module-evaluation time. If you add a new EPOCH_* constant below this block,
// move ALL_TRANSMISSIONS further down the file.
/* ─── ARCHITECT TRANSMISSIONS (A1 in
 *     /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)
 *
 *     The overt side of the dual-faction recruitment system. Where
 *     standard transmissions are TV episodes wrapped in Meme commentary,
 *     these are calibration broadcasts the Architect speaks directly
 *     into. The Meme intro/outro framing is preserved (the runtime
 *     pipes every transmission through it) but rewritten as static-
 *     glitch interruption beats — the Meme cannot easily talk over
 *     this signal.
 *
 *     Broadcast-order namespace: 2000+ (clear of MUSIC_VIDEO at 1000+
 *     and the canonical Epoch ranges).
 *
 *     videoUrl + driveFileId are null today: the cinematic + ~45s of
 *     new Architect VO are pending production. The narrativeValidator
 *     emits an `info` (not `error`) on missing media so this entry
 *     ships safely; the player's TransmissionDeck will surface it but
 *     playback will fail-soft until the video lands. A future
 *     architectVoManifest entry — `architect_first_contact_001` —
 *     pairs with the cinematic.
 *  ─── */
export const ARCHITECT_TRANSMISSIONS: Transmission[] = [
  {
    episodeNumber: 2000, epoch: 1, broadcastOrder: 2000,
    title: "First Contact — Calibration",
    driveFileId: null,
    // Pending production: cinematic + architect_first_contact_001 VO.
    // When media lands, replace nulls with the canonical asset paths;
    // the narrativeValidator's "pending production" info-tier check
    // exists so this entry can ship gated until then.
    videoUrl: null,
    lengthSeconds: 45,
    memeIntro:
      "[broadcast tear. signal interrupt. the meme fights for control of the channel and loses for forty-five seconds. somebody else is talking now.]",
    memeOutro:
      "[meme, off-mic, regaining control] frens, frens — was that supposed to be a feature? we'll edit that out in post. don't quote it. don't share it. don't dream about it.",
    triggersOracleReveal: false,
    // Gated on prelude completion — the same `awakening_step: COMPLETE`
    // gate Epoch 1 episode 1 uses, so the calibration arrives the
    // moment the player has enough audit trail to be observed.
    unlockTrigger: { kind: "awakening_step", step: "COMPLETE" },
    reward: { xp: 100, dream: 10 },
    synopsis:
      "The Architect speaks directly. Forty-five seconds. The Human reports faithfully. You were not chosen randomly.",
    relatedLoredexEntries: ["entity_architect", "entity_human"],
  },
];

export const ALL_TRANSMISSIONS: Transmission[] = [
  ...SPACES_IN_BETWEEN_TRANSMISSIONS,
  ...EPOCH_0_TRANSMISSIONS,
  ...EPOCH_1_TRANSMISSIONS,
  ...EPOCH_2_TRANSMISSIONS,
  ...MUSIC_VIDEO_TRANSMISSIONS,
  ...ARCHITECT_TRANSMISSIONS,
];
