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

export type EpochId = 1 | 2 | 3 | 4 | 5;

export type TransmissionTrigger =
  | { kind: "awakening_step"; step: string }
  | { kind: "chapter_complete"; chapterId: string }
  | { kind: "level"; minLevel: number }
  | { kind: "trust"; npcId: string; minTrust: number }
  | { kind: "morality"; direction: "humanity" | "machine"; threshold: number }
  | { kind: "flag"; flag: string }
  | { kind: "room_visited"; roomId: string }
  | { kind: "apprentice_graduates" }
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
  },
  {
    episodeNumber: 4, epoch: 1, broadcastOrder: 4,
    title: "The Fall",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506108/The_Fall___Dischordian_Saga_Episode_4_yd3rsl.mp4", lengthSeconds: 200,
    memeIntro: "THE MORAL LESSON EPISODE. Pride, pride, pride. You know what comes next. I won't spoil it. I will GENTLY hint it with loud narration.",
    memeOutro: "And down they went. I love this one. Schadenfreude for the soul. Don't tell the Antiquarian I'm using his word.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch2" },
    reward: { xp: 250, dream: 25 },
    synopsis: "Hubris brings the Potentials down — their ships fall to the biomass world.",
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
  },
  {
    episodeNumber: 8, epoch: 1, broadcastOrder: 8,
    title: "The Arrival",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506104/The_Arrival___Dischordian_Saga_Episode_8_y5klp0.mp4", lengthSeconds: 260,
    memeIntro: "They pick the wormhole. Of course they pick the wormhole. Nobody ever picks 'sacrifice ten friends.' Except that one guy. Agent Zero knows who I mean.",
    memeOutro: "Crystalline city. Unfamiliar planet. Advanced civilization. This is the part of the story where things get COMPLICATED. For them. Not for me. I'm watching with snacks.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch5" },
    reward: { xp: 350, dream: 35 },
    synopsis: "The Potentials step through the wormhole and emerge above a crystalline alien city.",
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
  },
  {
    episodeNumber: 11, epoch: 1, broadcastOrder: 11,
    title: "The City",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506107/The_City___Dischordian_Saga_Episode_11_oufsvv.mp4", lengthSeconds: 280,
    memeIntro: "The crystalline city. Tall hooded beings. A figure whose FACE CHANGES, with red glowing eyes. Absolutely normal, can happen to anyone, don't look into it.",
    memeOutro: "The Oracle. THE Oracle. I'm told she's going to do wonderful things in this story. Now you've seen her. Don't you feel reassured? Sure you do.",
    triggersOracleReveal: true,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch6" },
    reward: { xp: 400, dream: 40, achievement: "witnessed_oracle" },
    synopsis: "Captured on arrival — the Potentials meet the Oracle, the face that never stays the same.",
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
  },
  {
    episodeNumber: 15, epoch: 1, broadcastOrder: 15,
    title: "The Beginning of the End",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/v1775506104/The_Beginning_of_the_End___Dischordian_Saga_Episode_15_kffa73.mp4", lengthSeconds: 360,
    memeIntro: "The Host arrives. The virus breaches the city. Dragon battles. Harmonic amplification. The Oracle passes a weapon to the Guardian. It's all connected, frens. It all circles back.",
    memeOutro: "The ninth Ne-Yon amplifies the crystal network. The virus dragon falls. And the Oracle stands where the Guardian needs her to stand. What a finale! Except it isn't. Never is.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch10" },
    reward: { xp: 600, dream: 60, achievement: "witnessed_first_fall" },
    synopsis: "The Host's infected horde breaches the crystalline city. The Oracle turns the tide.",
  },
  {
    episodeNumber: 16, epoch: 1, broadcastOrder: 16,
    title: "Memento Dischordia",
    driveFileId: null, videoUrl: "https://res.cloudinary.com/dsenaozjq/video/upload/q_auto/f_auto/v1775506560/Memento_Dischordia_2_x6s3qu.mp4", lengthSeconds: 320,
    memeIntro: "RECAP EPISODE. For the newcomers. For the forgetters. For those who need one more look before Epoch 2 drops. Watch carefully, frens. The clues were always there. I put some of them there.",
    memeOutro: "And so Epoch 1 closes. Dischordian logic, Memento Dischordia. We remember. We choose. We fight. Let the games begin, frens. I'll be here. I'm ALWAYS here.",
    triggersOracleReveal: false,
    unlockTrigger: { kind: "chapter_complete", chapterId: "ch13" },
    reward: { xp: 750, dream: 75, achievement: "epoch_1_witness" },
    synopsis: "Epoch 1 in montage — previously on the Dischordian Saga. The games have only just begun.",
  },
];

export const ALL_TRANSMISSIONS: Transmission[] = [
  ...EPOCH_1_TRANSMISSIONS,
];

export function getTransmissionsByEpoch(epoch: EpochId): Transmission[] {
  return ALL_TRANSMISSIONS.filter(t => t.epoch === epoch);
}

export function getTransmissionByBroadcastOrder(order: number): Transmission | undefined {
  return ALL_TRANSMISSIONS.find(t => t.broadcastOrder === order);
}

export function transmissionId(t: Transmission): string {
  return `ep${t.epoch}-${t.episodeNumber}`;
}

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
