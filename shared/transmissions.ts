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
  ...EPOCH_2_TRANSMISSIONS,
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
    synopsis: "The Meme hijacks the broadcast for a special announcement. Project and Control launches. The fourth wall doesn't survive.",
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
  },
];
